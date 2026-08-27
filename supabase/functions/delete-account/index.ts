import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const ALLOWED_ORIGIN_RE =
  /^https?:\/\/(localhost(:\d+)?|127\.0\.0\.1(:\d+)?|([a-z0-9-]+\.)*lovable\.app|([a-z0-9-]+\.)*lovableproject\.com)$/i;
const DEFAULT_ORIGIN = "https://law-easy-speak.lovable.app";

/** Same-origin-ish CORS: reflect only known app origins, never a blanket "*". */
function corsFor(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN_RE.test(origin) ? origin : DEFAULT_ORIGIN,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  };
}

// --- Simple in-memory per-IP rate limit (best effort, per isolate) ---
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();
function rateLimited(req: Request) {
  const ip =
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

/** Never leak stack traces, provider payloads or internals to the client. */
function failure(corsHeaders: Record<string, string>, e: unknown, fn: string) {
  const correlationId = crypto.randomUUID();
  console.error(
    `[${fn}] ${correlationId}`,
    e instanceof Error ? e.message : "unknown error",
  );
  return new Response(
    JSON.stringify({
      error: "Something went wrong. Please try again.",
      correlationId,
    }),
    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

serve(async (req) => {
  const corsHeaders = corsFor(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (rateLimited(req)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a minute and try again." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } },
    );
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Identify the caller from their own JWT — never trust a user id from the body.
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Remove all personal data rows first, then the auth identity itself.
    await admin.from("search_history").delete().eq("user_id", userId);
    await admin.from("bookmarks").delete().eq("user_id", userId);
    await admin.from("profiles").delete().eq("user_id", userId);

    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) throw delErr;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return failure(corsHeaders, e, "delete-account");
  }
});
