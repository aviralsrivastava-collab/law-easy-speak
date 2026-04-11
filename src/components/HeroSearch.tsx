import { useState } from "react";
import { Search, ArrowRight, MessageCircle, Scale, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LegalResult {
  section: string;
  title: string;
  summary: string;
  penalty: string;
  remedy: string;
}

const exampleQueries = [
  "My landlord won't return my deposit",
  "Someone threatened me online",
  "My employer hasn't paid my salary",
  "I was sold a fake product",
];

const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LegalResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

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
    } catch (e: any) {
      console.error("Search error:", e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-primary-foreground/20" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border-2 border-primary-foreground/20" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full border border-primary-foreground/10" />
      </div>

      <div className="container relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
            <Scale className="w-4 h-4" />
            <span>Legal rights in your language, in 2 minutes or less</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-balance">
            Describe your situation.
            <br />
            <span className="text-warm-amber">We'll find the law.</span>
          </h1>

          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            No legal jargon. No confusing codes. Just tell us what happened in simple words.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-primary-foreground rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center pl-4">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g., My landlord won't return my deposit..."
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
                <span className="hidden sm:inline">{isLoading ? "Analyzing..." : "Search"}</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <span className="text-primary-foreground/60 text-sm">Try:</span>
            {exampleQueries.map((eq) => (
              <button
                key={eq}
                onClick={() => {
                  setQuery(eq);
                  handleSearch(eq);
                }}
                disabled={isLoading}
                className="text-sm bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full px-3 py-1 transition-colors disabled:opacity-50"
              >
                {eq}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto">
            {[
              { num: "500+", label: "IPC/BNS Sections" },
              { num: "5", label: "Languages" },
              { num: "Free", label: "Always" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-warm-amber">{stat.num}</div>
                <div className="text-xs text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
            <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
              <p className="text-muted-foreground">Analyzing your situation against Indian legal codes...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && hasSearched && results.length > 0 && (
          <div className="max-w-2xl mx-auto mt-10 space-y-4">
            <div className="bg-card text-card-foreground rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
              <div className="bg-safe-green/10 border-b border-safe-green/20 px-6 py-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-safe-green" />
                <span className="font-semibold text-safe-green">
                  {results.length} Relevant Law{results.length > 1 ? "s" : ""} Found
                </span>
              </div>
              {results.map((r, i) => (
                <div key={i} className={`p-6 space-y-4 ${i > 0 ? "border-t border-border" : ""}`}>
                  <div className="inline-block bg-trust-blue-lighter text-primary font-mono text-sm font-semibold px-3 py-1 rounded-md">
                    {r.section}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{r.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{r.summary}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-3">
                      <div className="text-xs font-semibold text-destructive uppercase tracking-wide mb-1">Penalty</div>
                      <p className="text-sm text-foreground">{r.penalty}</p>
                    </div>
                    <div className="bg-safe-green/5 border border-safe-green/10 rounded-lg p-3">
                      <div className="text-xs font-semibold text-safe-green uppercase tracking-wide mb-1">Remedy</div>
                      <p className="text-sm text-foreground">{r.remedy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && hasSearched && results.length === 0 && (
          <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
            <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-8 text-center">
              <p className="text-muted-foreground">No matching laws found. Try describing your situation differently.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSearch;
