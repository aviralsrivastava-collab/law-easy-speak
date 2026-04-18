import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CATEGORIES, type CategorySlug, LEGAL_DISCLAIMER } from "@/lib/categories";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const CategoryPage = () => {
  const { slug } = useParams<{ slug: CategorySlug }>();
  const navigate = useNavigate();
  const cat = slug ? CATEGORIES[slug as CategorySlug] : undefined;

  if (!cat) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold mb-2">Category not found</h1>
          <Link to="/" className="text-primary hover:underline">← Back home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = cat.icon;

  const openArticle = (title: string, excerpt: string) => {
    const articleSlug = slugify(title);
    sessionStorage.setItem(`article:${articleSlug}`, JSON.stringify({ title, excerpt, category: cat.name }));
    navigate(`/article/${articleSlug}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className={`border-b border-border ${cat.bg}`}>
          <div className="container py-10 md:py-14 max-w-5xl">
            <Breadcrumb className="mb-5">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>{cat.name}</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${cat.bg} border ${cat.border} mb-4`}>
              <Icon className={`w-7 h-7 ${cat.text}`} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{cat.name}</h1>
            <p className={`text-sm font-semibold uppercase tracking-wide ${cat.text} mb-3`}>{cat.tagline}</p>
            <p className="text-muted-foreground max-w-2xl">{cat.description}</p>
          </div>
        </div>

        <div className="container py-10 max-w-5xl">
          <h2 className="text-xl font-bold text-foreground mb-5">Articles in {cat.name}</h2>
          {cat.articles.length === 0 ? (
            <p className="text-muted-foreground">More articles coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {cat.articles.map((a) => (
                <button
                  key={a.title}
                  onClick={() => openArticle(a.title, a.excerpt)}
                  className="group text-left bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.badge}`}>{cat.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" /> {a.readTime}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">{a.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
                  <div className={`mt-4 flex items-center gap-1 text-sm font-semibold ${cat.text} group-hover:gap-2 transition-all`}>
                    <BookOpen className="w-4 h-4" /> Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="rounded-lg p-4 bg-destructive/5 border border-destructive/20 text-xs text-muted-foreground mt-10">
            <span className="font-semibold text-destructive">⚠ Disclaimer: </span>{LEGAL_DISCLAIMER}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
