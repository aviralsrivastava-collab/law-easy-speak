import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, MessageCircle, Scale, Shield, Loader2, Globe, Bookmark, BookmarkCheck,
  FileDown, Mic, MicOff, Sparkles, FileText, Upload, PhoneCall, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ProceduralRoadmap from "@/components/ProceduralRoadmap";
import CasePrecedents, { Precedent } from "@/components/CasePrecedents";
import jsPDF from "jspdf";

// Lazy-load the WebGL scene so mobile / reduced-motion users skip the bundle cost.
const CinematicScene = lazy(() => import("@/components/three/CinematicScene"));

interface LegalResult {
  section: string;
  title: string;
  summary: string;
  penalty: string;
  remedy: string;
}

interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  documents?: string[];
  estimatedTime?: string;
  escalation?: string;
}

interface RoadmapData {
  title: string;
  steps: RoadmapStep[];
}

const exampleQueries: Record<string, { label: string; queries: string[] }> = {
  en: {
    label: "Try:",
    queries: [
      "My landlord won't return my deposit",
      "Someone threatened me online",
      "My employer hasn't paid my salary",
      "I was sold a fake product",
    ],
  },
  hi: {
    label: "आज़माएँ:",
    queries: [
      "मकान मालिक मेरी जमानत वापस नहीं कर रहा",
      "किसी ने मुझे ऑनलाइन धमकी दी",
      "मालिक ने मेरी तनख्वाह नहीं दी",
      "मुझे नकली प्रोडक्ट बेचा गया",
    ],
  },
};

const placeholders: Record<string, string> = {
  en: "e.g., My landlord won't return my deposit...",
  hi: "जैसे, मकान मालिक मेरी जमानत वापस नहीं कर रहा...",
};

// Smart suggestion chips shown below the search box
const suggestionChips: Record<string, { label: string; query: string }[]> = {
  en: [
    { label: "Rent agreement", query: "Help me understand my rent agreement and tenant rights" },
    { label: "Police complaint", query: "How do I file a police complaint / FIR?" },
    { label: "Consumer case", query: "I was sold a defective product and the seller refuses refund" },
    { label: "Workplace harassment", query: "I am facing harassment at my workplace" },
    { label: "Cyber fraud", query: "I lost money to an online scam, how do I report it?" },
    { label: "Domestic violence", query: "I am facing domestic violence at home" },
  ],
  hi: [
    { label: "किराया समझौता", query: "मेरे किरायेदार अधिकार और किराया समझौता समझाइए" },
    { label: "पुलिस शिकायत", query: "मैं FIR / पुलिस शिकायत कैसे दर्ज करूँ?" },
    { label: "उपभोक्ता मामला", query: "मुझे खराब प्रोडक्ट बेचा गया, दुकानदार रिफंड नहीं दे रहा" },
    { label: "कार्यस्थल उत्पीड़न", query: "मैं अपने कार्यस्थल पर उत्पीड़न का सामना कर रहा/रही हूँ" },
    { label: "साइबर धोखाधड़ी", query: "मैंने ऑनलाइन घोटाले में पैसे गँवाए, रिपोर्ट कैसे करूँ?" },
    { label: "घरेलू हिंसा", query: "मैं घर में घरेलू हिंसा का सामना कर रहा/रही हूँ" },
  ],
};

// Web Speech API typing for browsers
type SpeechRec = any;

const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LegalResult[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [precedents, setPrecedents] = useState<Precedent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [isListening, setIsListening] = useState(false);
  const [rotatingIdx, setRotatingIdx] = useState(0);
  const recognitionRef = useRef<SpeechRec | null>(null);
  const navigate = useNavigate();

  const { user } = useAuth();
  const [bookmarkedSections, setBookmarkedSections] = useState<Set<string>>(new Set());
  const [generatingFir, setGeneratingFir] = useState<string | null>(null);

  // Rotate placeholder text every 3.5s for a "live" feel when input is empty
  useEffect(() => {
    if (query) return;
    const id = setInterval(() => {
      setRotatingIdx((i) => (i + 1) % exampleQueries[language].queries.length);
    }, 3500);
    return () => clearInterval(id);
  }, [query, language]);

  const livePlaceholder =
    query.length === 0
      ? exampleQueries[language].queries[rotatingIdx]
      : placeholders[language];

  const toggleVoiceInput = () => {
    const SR: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error(
        language === "hi"
          ? "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है"
          : "Voice input is not supported in this browser"
      );
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop?.();
      setIsListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = language === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setQuery(transcript);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => {
      setIsListening(false);
      toast.error(language === "hi" ? "वॉइस इनपुट विफल" : "Voice input failed");
    };
    recognitionRef.current = rec;
    setIsListening(true);
    rec.start();
  };

  const generateFirDraft = async (r: LegalResult) => {
    const situation = query.trim();
    if (!situation) {
      toast.error(language === "hi" ? "कृपया पहले अपनी स्थिति बताएँ" : "Please describe your situation first");
      return;
    }
    setGeneratingFir(r.section);
    try {
      const { data, error } = await supabase.functions.invoke("fir-draft", {
        body: { situation, section: r.section, title: r.title },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 48;
      const pageW = doc.internal.pageSize.getWidth();
      const maxW = pageW - margin * 2;
      let y = margin;

      const writeBlock = (text: string, opts: { size?: number; bold?: boolean; gap?: number } = {}) => {
        const { size = 11, bold = false, gap = 14 } = opts;
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(text || "", maxW);
        for (const line of lines) {
          if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += size + 4;
        }
        y += gap;
      };

      writeBlock(data.title || "FIR Complaint Letter", { size: 16, bold: true });
      writeBlock(`Date: ${new Date().toLocaleDateString()}`, { size: 10 });
      writeBlock(`To,\n${data.to || "The Station House Officer"}`, { size: 11 });
      writeBlock(`Subject: ${data.subject || ""}`, { size: 11, bold: true });
      writeBlock(data.body || "", { size: 11 });
      writeBlock(data.signature || "Yours sincerely,\n[Your Full Name]", { size: 11 });

      if (Array.isArray(data.checklist) && data.checklist.length) {
        writeBlock("Documents to attach:", { size: 12, bold: true, gap: 6 });
        data.checklist.forEach((item: string, i: number) => writeBlock(`${i + 1}. ${item}`, { size: 11, gap: 2 }));
      }

      writeBlock(`Legal basis: ${r.section} — ${r.title}`, { size: 10 });

      doc.save(`FIR-Draft-${r.section.replace(/[^a-z0-9]/gi, "_")}.pdf`);
      toast.success(language === "hi" ? "FIR ड्राफ्ट डाउनलोड हो गया" : "FIR draft downloaded");
    } catch (e) {
      console.error("FIR draft error:", e);
      toast.error(language === "hi" ? "FIR ड्राफ्ट जनरेट नहीं हो सका" : "Could not generate FIR draft");
    } finally {
      setGeneratingFir(null);
    }
  };

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    setIsLoading(true);
    setHasSearched(true);
    setResults([]);
    setRoadmap(null);
    setPrecedents([]);

    try {
      const { data, error } = await supabase.functions.invoke("legal-mapper", {
        body: { query: q },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.results) {
        setResults(data.results);
      }
      if (data?.roadmap) {
        setRoadmap(data.roadmap);
      }
      if (Array.isArray(data?.precedents)) {
        setPrecedents(data.precedents);
      }
      if (data?.language) {
        setLanguage(data.language === "hi" ? "hi" : "en");
      }

      // Save to history if logged in
      if (user && data?.results) {
        supabase.from("search_history").insert({
          user_id: user.id,
          query: q,
          results: data.results,
          roadmap: data.roadmap || null,
          language: data.language || "en",
        }).then(() => {});
      }
    } catch (e: any) {
      console.error("Search error:", e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = async (r: LegalResult) => {
    if (!user) {
      toast.info("Sign in to bookmark legal sections");
      return;
    }
    const isBookmarked = bookmarkedSections.has(r.section);
    if (isBookmarked) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("section", r.section);
      setBookmarkedSections((prev) => { const n = new Set(prev); n.delete(r.section); return n; });
      toast.success("Bookmark removed");
    } else {
      await supabase.from("bookmarks").insert({
        user_id: user.id,
        section: r.section,
        title: r.title,
        summary: r.summary,
        penalty: r.penalty,
        remedy: r.remedy,
      });
      setBookmarkedSections((prev) => new Set(prev).add(r.section));
      toast.success("Bookmarked!");
    }
  };

  const currentChips = suggestionChips[language];

  // Capability detection: enable WebGL hero only on capable devices that don't request reduced motion.
  const enable3D = useMemo(() => {
    if (typeof window === "undefined") return false;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia?.("(pointer: coarse)").matches;
    const isSmall = window.innerWidth < 768;
    return !reducedMotion && !isCoarse && !isSmall;
  }, []);

  return (
    <section className="relative overflow-hidden cinema-stage min-h-[88vh] flex items-center">
      {/* Cinematic 3D backdrop (lazy, capability-gated) */}
      {enable3D && (
        <div className="absolute inset-0 pointer-events-none">
          <Suspense fallback={null}>
            <CinematicScene />
          </Suspense>
          {/* Foreground readability scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background/70" />
        </div>
      )}
      {/* Fallback ambient glow for mobile / reduced-motion */}
      {!enable3D && (
        <>
          <div className="hero-glow w-[420px] h-[420px] -top-32 -left-24 bg-primary/25 animate-glow-drift-slow" aria-hidden />
          <div className="hero-glow w-[360px] h-[360px] top-1/2 -right-24 bg-warm-amber/15 animate-glow-drift-med" aria-hidden />
        </>
      )}

      <div className="container relative py-24 md:py-36 w-full">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          <div className="flex items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-foreground">
              <Scale className="w-4 h-4 text-primary" />
              <span>{language === "hi" ? "✨ डर नहीं, अब आपके पास कानून है" : "✨ You're not alone — the law is on your side"}</span>
            </div>
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="inline-flex items-center gap-1 bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors"
            >
              <Globe className="w-4 h-4" />
              {language === "en" ? "हिंदी" : "EN"}
            </button>
          </div>

          <h1
            className="text-3xl md:text-5xl font-extrabold leading-tight text-balance animate-fade-in-up opacity-0"
            style={{ animationDelay: "120ms" }}
          >
            {language === "hi" ? (
              <>आपकी आवाज़, आपका हक़।<br /><span className="text-warm-amber">कानून अब आपकी भाषा बोलेगा।</span></>
            ) : (
              <>Your voice. Your rights.<br /><span className="text-warm-amber">The law, finally on your side.</span></>
            )}
          </h1>

          <p
            className="text-muted-foreground text-lg max-w-xl mx-auto animate-fade-in-up opacity-0"
            style={{ animationDelay: "260ms" }}
          >
            {language === "hi"
              ? "कोई वकील नहीं, कोई फीस नहीं, कोई मुश्किल भाषा नहीं। बस अपनी कहानी बताइए — हम 2 मिनट में IPC/BNS धारा, FIR ड्राफ्ट और मिलते-जुलते असली मुक़दमे लाएँगे।"
              : "No lawyer. No fees. No jargon. Just tell us what happened — in 2 minutes you'll have the right IPC/BNS section, a ready FIR draft, and real past judgements to back you up."}
          </p>

          <div
            className="relative max-w-2xl mx-auto animate-fade-in-up opacity-0"
            style={{ animationDelay: "400ms" }}
          >
            {/* Glow ring around input */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-warm-amber/30 to-primary/40 rounded-2xl blur-md opacity-60 animate-pulse-gentle pointer-events-none" />
            <div className="relative flex items-center bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center pl-4">
                {isLoading ? (
                  <span className="flex items-center gap-1" aria-label="loading">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "300ms" }} />
                  </span>
                ) : isListening ? (
                  <span className="relative flex items-center justify-center">
                    <span className="absolute w-5 h-5 rounded-full bg-destructive/30 animate-ping" />
                    <Mic className="w-5 h-5 text-destructive relative" />
                  </span>
                ) : (
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={livePlaceholder}
                className="flex-1 px-4 py-4 md:py-5 text-foreground bg-transparent outline-none text-base md:text-lg placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={isLoading}
                className={`px-3 h-full text-muted-foreground hover:text-foreground transition-colors ${isListening ? "text-destructive" : ""}`}
                title={isListening ? (language === "hi" ? "रोकें" : "Stop") : (language === "hi" ? "बोलकर खोजें" : "Voice search")}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <Button
                variant="hero"
                size="lg"
                className="rounded-none rounded-r-xl h-full px-6"
                onClick={() => handleSearch()}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                <span className="hidden sm:inline">{isLoading ? (language === "hi" ? "विश्लेषण..." : "Analyzing...") : (language === "hi" ? "खोजें" : "Search")}</span>
              </Button>
            </div>
          </div>

          {/* Smart suggestion chips */}
          <div
            className="flex flex-wrap justify-center gap-2 pt-1 animate-fade-in-up opacity-0"
            style={{ animationDelay: "540ms" }}
          >
            <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
              <Sparkles className="w-3.5 h-3.5 text-warm-amber" />
              {language === "hi" ? "त्वरित विषय:" : "Quick topics:"}
            </span>
            {currentChips.map((c) => (
              <button
                key={c.label}
                onClick={() => { setQuery(c.query); handleSearch(c.query); }}
                disabled={isLoading}
                className="text-sm bg-primary/10 hover:bg-primary/20 hover:scale-105 text-foreground rounded-full px-3 py-1.5 transition-all disabled:opacity-50 border border-primary/10"
              >
                {c.label}
              </button>
            ))}
          </div>

          <div
            className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto animate-fade-in-up opacity-0"
            style={{ animationDelay: "680ms" }}
          >
            {[
              { num: "500+", label: language === "hi" ? "IPC/BNS धाराएँ" : "IPC/BNS Sections" },
              { num: "5", label: language === "hi" ? "भाषाएँ" : "Languages" },
              { num: language === "hi" ? "मुफ़्त" : "Free", label: language === "hi" ? "हमेशा" : "Always" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-warm-amber">{stat.num}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Guided action cards — shown when no search has run yet */}
        {!hasSearched && !isLoading && (
          <div
            className="max-w-3xl mx-auto mt-14 grid sm:grid-cols-3 gap-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: "820ms" }}
          >
            {[
              {
                icon: BookOpen,
                title: language === "hi" ? "शब्द समझाइए" : "Explain a term",
                desc: language === "hi" ? "किसी कानूनी शब्द का सरल मतलब पाइए" : "Get the simple meaning of any legal term",
                onClick: () => {
                  const q = language === "hi" ? "मुझे 'जमानत' सरल भाषा में समझाइए" : "Explain 'bail' to me in simple words";
                  setQuery(q); handleSearch(q);
                },
              },
              {
                icon: Upload,
                title: language === "hi" ? "दस्तावेज़ अपलोड" : "Upload document",
                desc: language === "hi" ? "कानूनी नोटिस / PDF को सरल भाषा में पढ़ें" : "Get a legal notice or PDF in plain language",
                onClick: () => navigate("/document-explainer"),
              },
              {
                icon: PhoneCall,
                title: language === "hi" ? "वकील से बात की तैयारी" : "Prepare for lawyer call",
                desc: language === "hi" ? "सही प्रश्न और दस्तावेज़ों की चेकलिस्ट" : "A checklist of questions and documents to bring",
                onClick: () => {
                  const q = language === "hi"
                    ? "मुझे वकील से पहली बार बात करने की तैयारी में मदद चाहिए — क्या पूछूँ और क्या दस्तावेज़ ले जाऊँ?"
                    : "Help me prepare for my first call with a lawyer — what should I ask and what documents should I bring?";
                  setQuery(q); handleSearch(q);
                },
              },
            ].map((card) => (
              <button
                key={card.title}
                onClick={card.onClick}
                className="group text-left bg-card/80 backdrop-blur border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
            <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-muted-foreground">
                {language === "hi" ? "आपकी स्थिति का भारतीय कानूनी संहिताओं से विश्लेषण हो रहा है..." : "Analyzing your situation against Indian legal codes..."}
              </p>
            </div>
          </div>
        )}

        {!isLoading && hasSearched && results.length > 0 && (
          <div className="max-w-2xl mx-auto mt-10 space-y-4">
            <div className="bg-card text-card-foreground rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
              <div className="bg-safe-green/10 border-b border-safe-green/20 px-6 py-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-safe-green" />
                <span className="font-semibold text-safe-green">
                  {results.length} {language === "hi" ? "संबंधित कानून मिले" : `Relevant Law${results.length > 1 ? "s" : ""} Found`}
                </span>
              </div>
              {results.map((r, i) => (
                <div key={i} className={`p-6 space-y-4 ${i > 0 ? "border-t border-border" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="inline-block bg-trust-blue-lighter text-primary font-mono text-sm font-semibold px-3 py-1 rounded-md">
                        {r.section}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mt-2">{r.title}</h3>
                    </div>
                    <button onClick={() => toggleBookmark(r)} className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0" title="Bookmark">
                      {bookmarkedSections.has(r.section) ? <BookmarkCheck className="w-5 h-5 text-warm-amber" /> : <Bookmark className="w-5 h-5 text-muted-foreground" />}
                    </button>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{r.summary}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-3">
                      <div className="text-xs font-semibold text-destructive uppercase tracking-wide mb-1">
                        {language === "hi" ? "दंड" : "Penalty"}
                      </div>
                      <p className="text-sm text-foreground">{r.penalty}</p>
                    </div>
                    <div className="bg-safe-green/5 border border-safe-green/10 rounded-lg p-3">
                      <div className="text-xs font-semibold text-safe-green uppercase tracking-wide mb-1">
                        {language === "hi" ? "उपाय" : "Remedy"}
                      </div>
                      <p className="text-sm text-foreground">{r.remedy}</p>
                    </div>
                  </div>
                  <div className="pt-1">
                    <Button
                      variant="amber"
                      size="sm"
                      onClick={() => generateFirDraft(r)}
                      disabled={generatingFir === r.section}
                      className="w-full sm:w-auto"
                    >
                      {generatingFir === r.section ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileDown className="w-4 h-4" />
                      )}
                      {generatingFir === r.section
                        ? (language === "hi" ? "तैयार हो रहा है..." : "Generating...")
                        : (language === "hi" ? "FIR ड्राफ्ट डाउनलोड करें (PDF)" : "Generate FIR Draft (PDF)")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {roadmap && <ProceduralRoadmap roadmap={roadmap} />}
            {precedents.length > 0 && <CasePrecedents precedents={precedents} language={language} />}
          </div>
        )}

        {!isLoading && hasSearched && results.length === 0 && (
          <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
            <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-8 text-center">
              <p className="text-muted-foreground">
                {language === "hi" ? "कोई मेल खाने वाला कानून नहीं मिला। कृपया अपनी स्थिति अलग तरीके से बताएँ।" : "No matching laws found. Try describing your situation differently."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSearch;
