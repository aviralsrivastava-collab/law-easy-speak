import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert Indian legal drafter. Generate a ready-to-submit FIR (First Information Report) complaint letter for the user, addressed to the Station House Officer (SHO).

Rules:
- Detect language: if the user's situation is in Hindi/Hinglish, draft the FIR in formal Hindi (Devanagari). Otherwise draft in formal English.
- Use the exact IPC/BNS section provided.
- Output ONLY a valid JSON object (no markdown fences, no extra text):

{
  "language": "en" or "hi",
  "title": "FIR Complaint Letter / प्रथम सूचना रिपोर्ट शिकायत पत्र",
  "to": "The Station House Officer, [Police Station Name], [City]",
  "subject": "Subject line",
  "body": "Full multi-paragraph complaint body. Include: salutation, complainant details placeholders like [Your Full Name], [Address], [Mobile], date/time/place of incident, detailed factual narration based on the user's situation, names of accused (if known) or 'unknown person(s)', list of witnesses placeholder, mention of the relevant section, prayer/request to register FIR and investigate, closing.",
  "signature": "Yours sincerely,\\n[Your Full Name]\\n[Signature]\\n[Date]",
  "checklist": ["Photo ID proof", "Address proof", "Any evidence (photos, messages, receipts)", "Witness contact details"]
}

The body must be specific to the user's situation, professional, and legally sound. Use placeholder fields in [square brackets] only where the user must fill in personal info.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { situation, section, title } = await req.json();

    if (!situation || typeof situation !== "string") {
      return new Response(JSON.stringify({ error: "Situation is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `User's situation: ${situation}\n\nApplicable law: ${section} — ${title}\n\nDraft the FIR complaint letter now.`;

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status);
      throw new Error("AI gateway error");
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
      throw new Error("Failed to parse FIR draft");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fir-draft error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
