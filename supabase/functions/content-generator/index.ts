import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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
      systemPrompt = `You are LexiLearn, an Indian legal educator. Write detailed, plain-language legal guides for Indian citizens.
Format your response as JSON with this structure:
{
  "title": "Article title",
  "content": [
    { "heading": "Section heading", "text": "Detailed paragraph content" }
  ],
  "keyTakeaways": ["Point 1", "Point 2"],
  "disclaimer": "Legal disclaimer text"
}
Write 4-6 content sections. Use simple language. Include practical examples and actionable steps.
Do NOT use markdown in text values. Keep each section 100-150 words.`;
      userPrompt = `Write a comprehensive legal guide about: "${title}"\nDescription: ${description || ""}\nCategory: ${category || "General"}`;
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
      console.error("Failed to parse:", content);
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("content-generator error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
