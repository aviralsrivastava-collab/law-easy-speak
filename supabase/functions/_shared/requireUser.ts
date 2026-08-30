import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Validates the caller's JWT in-code (functions deploy with verify_jwt = false).
 * Returns the authenticated user id, or a ready-to-return 401 Response.
 */
export async function requireUser(
  req: Request,
  corsHeaders: Record<string, string>,
): Promise<{ userId: string } | { response: Response }> {
  const unauthorized = () =>
    new Response(
      JSON.stringify({ error: "Please sign in to use this feature." }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  if (!token) return { response: unauthorized() };

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) return { response: unauthorized() };

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return { response: unauthorized() };

  return { userId: data.user.id };
}
