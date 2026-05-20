import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import { CATEGORIES, PRIMARY_CATEGORIES } from "@/lib/categories";

const CategoriesSection = () => (
  <section className="relative py-20 md:py-28 overflow-hidden">
    {/* Cinematic ambient backdrop */}
    <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" aria-hidden />
    <div
      className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-30 blur-3xl"
      style={{ background: "radial-gradient(closest-side, hsl(var(--cinema-cyan) / 0.35), transparent)" }}
      aria-hidden
    />

    <div className="container relative">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 text-xs font-medium text-foreground mb-4">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span>Indian law, organized</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
          Browse by <span className="text-primary">Law Category</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Five core areas of Indian law — color-coded so you always know where you stand.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {PRIMARY_CATEGORIES.map((slug) => {
          const c = CATEGORIES[slug];
          const Icon = c.icon;
          return (
            <Link
              key={slug}
              to={`/category/${slug}`}
              className={`group relative tilt-card glass-panel rounded-2xl p-6 ${c.border}`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${c.bg}`}>
                <Icon className={`w-6 h-6 ${c.text}`} />
              </div>
              <h3 className="font-bold text-foreground text-base mb-1.5">{c.name}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{c.tagline}</p>
              <span className={`text-xs font-semibold inline-flex items-center gap-1 ${c.text} group-hover:gap-2 transition-all`}>
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
