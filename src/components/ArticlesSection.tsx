import { BookOpen, Clock, ArrowRight } from "lucide-react";

const articles = [
  {
    title: "What to Do If You're Wrongfully Arrested",
    excerpt: "Know the exact steps to protect yourself during a wrongful arrest — from asserting your rights to contacting legal aid.",
    category: "Criminal Law",
    readTime: "4 min",
  },
  {
    title: "Your Complete Guide to Filing an RTI Application",
    excerpt: "Learn how to use the Right to Information Act to get answers from government departments, with sample templates.",
    category: "Government",
    readTime: "5 min",
  },
  {
    title: "Tenant vs Landlord: Rights You Didn't Know You Had",
    excerpt: "From security deposits to eviction notice periods — a plain-language breakdown of Indian rental law.",
    category: "Property",
    readTime: "6 min",
  },
  {
    title: "How to Report Cyber Fraud and Get Your Money Back",
    excerpt: "Step-by-step guide to filing complaints on the National Cyber Crime Portal and tracking your case.",
    category: "Cyber Crime",
    readTime: "3 min",
  },
  {
    title: "Understanding POCSO Act: A Parent's Guide",
    excerpt: "What every parent should know about the Protection of Children from Sexual Offences Act.",
    category: "Women & Youth",
    readTime: "5 min",
  },
  {
    title: "GST for Small Businesses: Simplified Compliance",
    excerpt: "A beginner-friendly walkthrough of GST registration, invoicing, and filing returns for MSMEs.",
    category: "Business",
    readTime: "7 min",
  },
];

const categoryColors: Record<string, string> = {
  "Criminal Law": "bg-destructive/10 text-destructive",
  "Government": "bg-safe-green/10 text-safe-green",
  "Property": "bg-primary/10 text-primary",
  "Cyber Crime": "bg-warm-amber/10 text-warm-amber",
  "Women & Youth": "bg-primary/10 text-primary",
  "Business": "bg-safe-green/10 text-safe-green",
};

const ArticlesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Latest Articles & Guides
          </h2>
          <p className="text-muted-foreground text-lg">
            Plain-language legal guides written for everyday citizens
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <article
              key={article.title}
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
              <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {article.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                <BookOpen className="w-4 h-4" />
                Read Guide
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
