import { useState } from "react";
import { BookOpen, Clock, ArrowRight, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const articles = [
  { title: "What to Do If You're Wrongfully Arrested", excerpt: "Know the exact steps to protect yourself during a wrongful arrest — from asserting your rights to contacting legal aid.", category: "Criminal Law", readTime: "4 min" },
  { title: "Your Complete Guide to Filing an RTI Application", excerpt: "Learn how to use the Right to Information Act to get answers from government departments, with sample templates.", category: "Government", readTime: "5 min" },
  { title: "Tenant vs Landlord: Rights You Didn't Know You Had", excerpt: "From security deposits to eviction notice periods — a plain-language breakdown of Indian rental law.", category: "Property", readTime: "6 min" },
  { title: "How to Report Cyber Fraud and Get Your Money Back", excerpt: "Step-by-step guide to filing complaints on the National Cyber Crime Portal and tracking your case.", category: "Cyber Crime", readTime: "3 min" },
  { title: "Understanding POCSO Act: A Parent's Guide", excerpt: "What every parent should know about the Protection of Children from Sexual Offences Act.", category: "Women & Youth", readTime: "5 min" },
  { title: "GST for Small Businesses: Simplified Compliance", excerpt: "A beginner-friendly walkthrough of GST registration, invoicing, and filing returns for MSMEs.", category: "Business", readTime: "7 min" },
];

const categoryColors: Record<string, string> = {
  "Criminal Law": "bg-destructive/10 text-destructive",
  "Government": "bg-safe-green/10 text-safe-green",
  "Property": "bg-primary/10 text-primary",
  "Cyber Crime": "bg-warm-amber/10 text-warm-amber",
  "Women & Youth": "bg-primary/10 text-primary",
  "Business": "bg-safe-green/10 text-safe-green",
};

interface ArticleContent {
  title: string;
  content: { heading: string; text: string }[];
  keyTakeaways: string[];
  disclaimer: string;
}

const ArticlesSection = () => {
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [articleContent, setArticleContent] = useState<ArticleContent | null>(null);
  const [loading, setLoading] = useState(false);

  const handleArticleClick = async (article: typeof articles[0]) => {
    setSelectedArticle(article);
    setArticleContent(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("content-generator", {
        body: { type: "article", title: article.title, description: article.excerpt, category: article.category },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setArticleContent(data);
    } catch (e: any) {
      console.error("Article generation error:", e);
      toast.error("Could not generate article. Please try again.");
      setSelectedArticle(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Latest Articles & Guides</h2>
          <p className="text-muted-foreground text-lg">Plain-language legal guides written for everyday citizens</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <article
              key={article.title}
              onClick={() => handleArticleClick(article)}
              className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}>
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{article.excerpt}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                <BookOpen className="w-4 h-4" />
                Read Guide
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedArticle} onOpenChange={(open) => { if (!open) setSelectedArticle(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating article...</p>
            </div>
          ) : articleContent ? (
            <div className="space-y-6 mt-2">
              {articleContent.content?.map((section, i) => (
                <div key={i}>
                  <h3 className="font-bold text-foreground text-lg mb-2">{section.heading}</h3>
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                </div>
              ))}
              {articleContent.keyTakeaways?.length > 0 && (
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                  <h3 className="font-bold text-foreground mb-2">Key Takeaways</h3>
                  <ul className="space-y-1.5">
                    {articleContent.keyTakeaways.map((point, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {articleContent.disclaimer && (
                <p className="text-xs text-muted-foreground italic border-t border-border pt-3">{articleContent.disclaimer}</p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ArticlesSection;
