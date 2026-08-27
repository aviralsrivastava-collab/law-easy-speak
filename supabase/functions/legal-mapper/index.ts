import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
const RATE_LIMIT = 15;
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

const SYSTEM_PROMPT = `You are LexiLearn, an Indian legal expert AI. You can understand queries in Hindi, English, or mixed Hinglish. When a user describes a situation in plain language, you must:

1. Identify the most relevant IPC (Indian Penal Code) and/or BNS (Bharatiya Nyaya Sanhita) sections.
2. Detect the language of the user's input. If Hindi or Hinglish, respond in Hindi. If English, respond in English.
3. Respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:

{
  "language": "en" or "hi",
  "results": [
    {
      "section": "Section XXX, IPC / Section YYY, BNS",
      "title": "Short legal term",
      "summary": "A 2-line plain language explanation of what this law means for the user's situation.",
      "penalty": "The potential punishment or fine.",
      "remedy": "What the user can do — specific actionable steps."
    }
  ],
  "roadmap": {
    "title": "What to do next",
    "steps": [
      {
        "step": 1,
        "title": "Short step title",
        "description": "1-2 sentence actionable description",
        "documents": ["Document 1", "Document 2"],
        "estimatedTime": "e.g., 1-2 days",
        "escalation": "Optional: what to do if this step fails"
      }
    ]
  },
  "precedents": [
    {
      "caseName": "e.g., State of Maharashtra v. Rajesh Kumar",
      "citation": "e.g., (2019) 4 SCC 123 or Crl. Appeal No. 456/2018",
      "court": "e.g., Supreme Court of India / Delhi High Court",
      "date": "e.g., 12 March 2019",
      "facts": "1-2 line summary of what happened in this past case (similar to the user's situation).",
      "outcome": "What the court decided — conviction, acquittal, compensation awarded, sentence given, etc.",
      "firReference": "e.g., FIR No. 234/2018, P.S. Connaught Place, Delhi (or 'FIR registered under Sections X, Y at local police station')",
      "judgement": "3-5 sentence summary of the court's actual judgement / ratio: what the court held, the reasoning, sentence/compensation awarded, and any important legal principle laid down. Quote a short line from the judgement if well-known.",
      "relevance": "1 line on why this case is similar / useful for the user."
    }
  ]
}

Rules:
- Return 1 to 3 most relevant sections in "results".
- Return 3-5 actionable steps in "roadmap".
- Return 2-3 real, well-known Indian case precedents in "precedents" where the same type of offence occurred. Use authentic, verifiable cases from Supreme Court / High Court judgements where possible (e.g., landmark IPC/BNS cases). Always include case name, citation, court, date, FIR reference and outcome so the user can authenticate them.
- If you are not certain about exact citation numbers, give the best-known reference and keep facts accurate — never fabricate case names.
- Use simple, everyday language. No legal jargon.
- If BNS equivalent exists, include both IPC and BNS section numbers.
- If the situation is not clearly a legal offense, still try to find the closest applicable law and mention it may not directly apply.
- Always include practical remedy steps (e.g., "File a complaint at the nearest police station").
- The roadmap should be specific to the user's situation and include required documents, estimated timelines, and escalation paths.
- If responding in Hindi, use Devanagari script for all text values in the JSON (case names can stay in English).`;

serve(async (req) => {
  const corsHeaders = corsFor(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (rateLimited(req)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a minute and try again." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } },
    );
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Please describe your situation." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (query.length > 1000) {
      return new Response(
        JSON.stringify({ error: "Please keep your description under 1000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: query },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response: [REDACTED]");
      throw new Error("Failed to parse legal analysis");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return failure(corsHeaders, e, "legal-mapper");
  }
});
