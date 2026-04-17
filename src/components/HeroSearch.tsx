import { useState } from "react";
import { Search, MessageCircle, Scale, Shield, Loader2, Globe, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ProceduralRoadmap from "@/components/ProceduralRoadmap";
import CasePrecedents, { Precedent } from "@/components/CasePrecedents";

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

const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LegalResult[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [precedents, setPrecedents] = useState<Precedent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const { user } = useAuth();
  const [bookmarkedSections, setBookmarkedSections] = useState<Set<string>>(new Set());

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

  const currentExamples = exampleQueries[language];

  return (
    <section className="relative bg-muted overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-primary/20" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border-2 border-primary/20" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full border border-primary/10" />
      </div>

      <div className="container relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-foreground">
              <Scale className="w-4 h-4 text-primary" />
              <span>{language === "hi" ? "आपकी भाषा में कानूनी अधिकार, 2 मिनट में" : "Legal rights in your language, in 2 minutes or less"}</span>
            </div>
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="inline-flex items-center gap-1 bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors"
            >
              <Globe className="w-4 h-4" />
              {language === "en" ? "हिंदी" : "EN"}
            </button>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-balance">
            {language === "hi" ? (
              <>अपनी स्थिति बताएँ।<br /><span className="text-warm-amber">हम कानून ढूंढेंगे।</span></>
            ) : (
              <>Describe your situation.<br /><span className="text-warm-amber">We'll find the law.</span></>
            )}
          </h1>

          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {language === "hi"
              ? "कोई कानूनी शब्दजाल नहीं। बस बताएं क्या हुआ, सीधे शब्दों में।"
              : "No legal jargon. No confusing codes. Just tell us what happened in simple words."}
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center pl-4">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={placeholders[language]}
                className="flex-1 px-4 py-4 md:py-5 text-foreground bg-transparent outline-none text-base md:text-lg placeholder:text-muted-foreground"
                disabled={isLoading}
              />
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

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <span className="text-muted-foreground text-sm">{currentExamples.label}</span>
            {currentExamples.queries.map((eq) => (
              <button
                key={eq}
                onClick={() => {
                  setQuery(eq);
                  handleSearch(eq);
                }}
                disabled={isLoading}
                className="text-sm bg-primary/10 hover:bg-primary/20 text-foreground rounded-full px-3 py-1 transition-colors disabled:opacity-50"
              >
                {eq}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto">
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

        {isLoading && (
          <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
            <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
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
                </div>
              ))}
            </div>

            {roadmap && <ProceduralRoadmap roadmap={roadmap} />}
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
