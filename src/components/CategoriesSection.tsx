import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, PRIMARY_CATEGORIES } from "@/lib/categories";

const CategoriesSection = () => (
  <section className="py-16 md:py-20 bg-muted/30">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Browse by Law Category</h2>
        <p className="text-muted-foreground text-lg">Five core areas of Indian law — color-coded so you always know where you are</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PRIMARY_CATEGORIES.map((slug) => {
          const c = CATEGORIES[slug];
          const Icon = c.icon;
          return (
            <Link
              key={slug}
              to={`/category/${slug}`}
              className={`group rounded-xl border-2 p-5 hover:shadow-lg hover:-translate-y-1 transition-all ${c.bg} ${c.border}`}
            >
              <Icon className={`w-8 h-8 mb-3 ${c.text}`} />
              <h3 className="font-bold text-foreground text-base mb-1">{c.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{c.tagline}</p>
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
