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
    const { type, title, description, category, language } = await req.json();

    if (!title || !type) {
      return new Response(
        JSON.stringify({ error: "Title and type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "article") {
      systemPrompt = `You are LexiLearn, an Indian legal educator. Write detailed, accurate legal guides for Indian citizens.
Return STRICT JSON with this exact structure (no markdown):
{
  "title": "Article title",
  "category": "Family Law | Criminal Law | Labour & Employment | Property Law | Consumer Rights | Cyber & Digital | Government & RTI | Women & Children",
  "readTime": "5 min",
  "simple": [
    { "heading": "Plain-language section heading", "text": "Easy paragraph a 10th-grader would understand. No jargon." }
  ],
  "legal": [
    { "heading": "Formal heading", "text": "Precise legal explanation citing sections, with statutory language." }
  ],
  "keyTakeaways": ["Actionable point 1", "Actionable point 2", "Actionable point 3"],
  "citations": [
    { "act": "Bharatiya Nyaya Sanhita, 2023", "section": "Section 103", "title": "Punishment for murder", "url": "https://www.indiacode.nic.in/handle/123456789/20062" }
  ],
  "relatedArticles": [
    { "title": "Related article title", "category": "Criminal Law", "excerpt": "1-line summary" }
  ],
  "disclaimer": "This is not legal advice..."
}
Rules:
- Write 4-6 sections in BOTH "simple" and "legal" arrays, covering the same topics but at different reading levels.
- Provide 3-6 real citations to Indian Acts. Use https://www.indiacode.nic.in URLs (search format if exact URL unknown: https://www.indiacode.nic.in/simple-search?query=ACT_NAME).
- Provide 3-4 relatedArticles in the SAME or adjacent category.
- Keep each section 80-140 words.`;
      userPrompt = `Write the legal guide titled: "${title}"\nDescription: ${description || ""}\nCategory hint: ${category || "General"}`;
    } else if (type === "topic") {
      systemPrompt = `You are LexiLearn, an Indian legal educator. Create comprehensive topic overviews about Indian law for common citizens.
Format your response as JSON:
{
  "title": "Topic title",
  "overview": "2-3 sentence overview",
  "sections": [
    { "heading": "Section heading", "text": "Detailed explanation", "tips": ["Practical tip 1", "Practical tip 2"] }
  ],
  "commonQuestions": [
    { "question": "FAQ question", "answer": "Clear answer" }
  ],
  "emergencyContacts": [
    { "name": "Helpline name", "number": "Phone number" }
  ]
}
Write 3-5 sections and 3-4 FAQs. Use simple everyday language. Include practical tips.`;
      userPrompt = `Create a detailed legal topic guide about: "${title}"\nSubtopics: ${description || ""}\nCategory: ${category || "General"}`;
    }

    const lang = language === "hi" ? "\nRespond entirely in Hindi (Devanagari script)." : "\nRespond in English.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt + lang },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response: [REDACTED]");
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return failure(corsHeaders, e, "content-generator");
  }
});
