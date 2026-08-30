import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, ExternalLink, BookOpen, Sparkles, FileText, ArrowLeft, ArrowRight, Bookmark } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { ensureSignedIn } from "@/lib/ensureSignedIn";
import { toast } from "sonner";
import { resolveCategory, CATEGORIES, LEGAL_DISCLAIMER } from "@/lib/categories";

interface ArticleData {
  title: string;
  category: string;
  readTime: string;
  simple: { heading: string; text: string }[];
  legal: { heading: string; text: string }[];
  keyTakeaways: string[];
  citations: { act: string; section?: string; title?: string; url: string }[];
  relatedArticles: { title: string; category: string; excerpt: string }[];
  disclaimer?: string;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"simple" | "legal">("simple");

  useEffect(() => {
    const stored = sessionStorage.getItem(`article:${slug}`);
    if (stored) {
      try {
        const seed = JSON.parse(stored);
        loadArticle(seed.title, seed.excerpt, seed.category);
        return;
      } catch {}
    }
    loadArticle(decodeURIComponent(slug || "Indian Law Guide"), "", "General");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadArticle = async (title: string, description: string, category: string) => {
    setLoading(true);
    setArticle(null);
    try {
      if (!(await ensureSignedIn("AI article generation"))) throw new Error("Sign in required");
      const { data, error } = await supabase.functions.invoke("content-generator", {
        body: { type: "article", title, description, category },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setArticle(data);
    } catch (e: any) {
      console.error(e);
      toast.error("Could not load article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cat = resolveCategory(article?.category);

  const goRelated = (title: string, excerpt: string, category: string) => {
    const newSlug = slugify(title);
    sessionStorage.setItem(`article:${newSlug}`, JSON.stringify({ title, excerpt, category }));
    navigate(`/article/${newSlug}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6 md:py-10 max-w-4xl">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {cat && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild><Link to={`/category/${cat.slug}`}>{cat.name}</Link></BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">{article?.title || "Loading..."}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          {loading && (
            <div className="flex flex-col items-center py-24 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating your guide…</p>
            </div>
          )}

          {!loading && article && (
            <>
              <div className="mb-6">
                {cat && (
                  <Link to={`/category/${cat.slug}`} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cat.badge} mb-4`}>
                    <cat.icon className="w-3.5 h-3.5" /> {cat.name}
                  </Link>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{article.title}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> {article.readTime || "5 min read"}
                </p>
              </div>

              <Tabs value={mode} onValueChange={(v) => setMode(v as "simple" | "legal")} className="mb-8">
                <TabsList>
                  <TabsTrigger value="simple"><Sparkles className="w-3.5 h-3.5 mr-1.5" />Simple words</TabsTrigger>
                  <TabsTrigger value="legal"><FileText className="w-3.5 h-3.5 mr-1.5" />Legal text</TabsTrigger>
                </TabsList>
                <TabsContent value="simple" className="mt-6 space-y-6">
                  {article.simple?.map((s, i) => (
                    <section key={i}>
                      <h2 className="text-xl font-bold text-foreground mb-2">{s.heading}</h2>
                      <p className="text-muted-foreground leading-relaxed">{s.text}</p>
                    </section>
                  ))}
                </TabsContent>
                <TabsContent value="legal" className="mt-6 space-y-6">
                  {article.legal?.map((s, i) => (
                    <section key={i}>
                      <h2 className="text-xl font-bold text-foreground mb-2">{s.heading}</h2>
                      <p className="text-muted-foreground leading-relaxed">{s.text}</p>
                    </section>
                  ))}
                </TabsContent>
              </Tabs>

              {article.keyTakeaways?.length > 0 && (
                <div className={`rounded-xl p-5 border ${cat?.bg || "bg-primary/5"} ${cat?.border || "border-primary/20"} mb-8`}>
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Bookmark className={`w-4 h-4 ${cat?.text || "text-primary"}`} /> Key Takeaways
                  </h3>
                  <ul className="space-y-2">
                    {article.keyTakeaways.map((t, i) => (
                      <li key={i} className="text-sm text-foreground flex gap-2">
                        <span className={cat?.text || "text-primary"}>✓</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {article.citations?.length > 0 && (
                <div className="rounded-xl p-5 border border-border bg-card mb-8">
                  <h3 className="font-bold text-foreground mb-3">Source Citations (India Code)</h3>
                  <ul className="space-y-2">
                    {article.citations.map((c, i) => (
                      <li key={i}>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-start gap-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>
                            <span className="font-semibold">{c.act}</span>
                            {c.section && <> — {c.section}</>}
                            {c.title && <span className="text-muted-foreground"> · {c.title}</span>}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {article.relatedArticles?.length > 0 && (
                <div className="mb-10">
                  <h3 className="font-bold text-foreground text-xl mb-4">Related Articles</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {article.relatedArticles.map((r, i) => {
                      const rcat = resolveCategory(r.category);
                      return (
                        <button
                          key={i}
                          onClick={() => goRelated(r.title, r.excerpt, r.category)}
                          className="text-left bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all"
                        >
                          {rcat && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${rcat.badge} inline-block mb-2`}>{rcat.name}</span>
                          )}
                          <p className="font-semibold text-foreground mb-1">{r.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{r.excerpt}</p>
                          <span className="text-xs text-primary font-semibold mt-3 inline-flex items-center gap-1">Read <ArrowRight className="w-3 h-3" /></span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="rounded-lg p-4 bg-destructive/5 border border-destructive/20 text-xs text-muted-foreground">
                <span className="font-semibold text-destructive">⚠ Disclaimer: </span>
                {article.disclaimer || LEGAL_DISCLAIMER}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
