import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, language } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 30) {
      return new Response(
        JSON.stringify({ error: "Please paste at least a paragraph of legal text (30+ characters)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const truncated = text.slice(0, 12000);
    const lang = language === "hi" ? "\nRespond entirely in Hindi." : "\nRespond in English.";

    const systemPrompt = `You are LexiLearn, an Indian legal expert who explains documents in plain language for common citizens.
Return STRICT JSON only:
{
  "documentType": "e.g. Rental Agreement / Notice / Contract / FIR copy",
  "summary": "2-3 plain sentences summarizing what this document says",
  "keyPoints": ["Important obligation 1", "Right granted 2", "..."],
  "redFlags": ["Anything user should be cautious about"],
  "yourRights": ["What the reader is entitled to"],
  "yourObligations": ["What the reader must do"],
  "deadlines": [{"item": "Notice period", "when": "30 days from receipt"}],
  "nextSteps": ["What to do next, in order"],
  "questionsToAsk": ["Smart questions to ask the other party or a lawyer"],
  "disclaimer": "Standard disclaimer"
}
Be specific, cite the relevant Indian Act/section if obvious. Keep it practical and protective of the reader.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt + lang },
          { role: "user", content: `Explain this legal document in plain language:\n\n${truncated}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No response from AI");
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("explain-document error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
