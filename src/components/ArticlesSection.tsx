import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { resolveCategory } from "@/lib/categories";

const articles = [
  { title: "What to Do If You're Wrongfully Arrested", excerpt: "Know the exact steps to protect yourself during a wrongful arrest — from asserting your rights to contacting legal aid.", category: "Criminal Law", readTime: "4 min" },
  { title: "Your Complete Guide to Filing an RTI Application", excerpt: "Learn how to use the Right to Information Act to get answers from government departments, with sample templates.", category: "Government & RTI", readTime: "5 min" },
  { title: "Tenant vs Landlord: Rights You Didn't Know You Had", excerpt: "From security deposits to eviction notice periods — a plain-language breakdown of Indian rental law.", category: "Property Law", readTime: "6 min" },
  { title: "How to Report Cyber Fraud and Get Your Money Back", excerpt: "Step-by-step guide to filing complaints on the National Cyber Crime Portal and tracking your case.", category: "Cyber & Digital", readTime: "3 min" },
  { title: "Understanding POCSO Act: A Parent's Guide", excerpt: "What every parent should know about the Protection of Children from Sexual Offences Act.", category: "Women & Children", readTime: "5 min" },
  { title: "Workplace Harassment: Filing a POSH Complaint", excerpt: "Step-by-step process under the POSH Act 2013 — Internal Committee, timelines, and remedies.", category: "Labour & Employment", readTime: "5 min" },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const ArticlesSection = () => {
  const navigate = useNavigate();
  const [openingSlug, setOpeningSlug] = useState<string | null>(null);

  const open = (a: typeof articles[0]) => {
    const slug = slugify(a.title);
    sessionStorage.setItem(`article:${slug}`, JSON.stringify({ title: a.title, excerpt: a.excerpt, category: a.category }));
    setOpeningSlug(slug);
    navigate(`/article/${slug}`);
  };

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Latest Articles & Guides</h2>
          <p className="text-muted-foreground text-lg">Plain-language legal guides written for everyday citizens</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => {
            const cat = resolveCategory(article.category);
            return (
              <article
                key={article.title}
                onClick={() => open(article)}
                className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cat?.badge || "bg-muted text-muted-foreground border-border"}`}>
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
                  {openingSlug === slugify(article.title) ? "Opening…" : "Read Guide"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
