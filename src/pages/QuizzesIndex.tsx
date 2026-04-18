import { Link } from "react-router-dom";
import { Brain, ArrowRight, AlertTriangle, Home, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { QUIZZES } from "@/data/quizzes";
import { LEGAL_DISCLAIMER } from "@/lib/categories";

const ICONS = {
  arrest: AlertTriangle,
  eviction: Home,
  workplace: Briefcase,
};

const ACCENTS = {
  arrest: "bg-cat-criminal/10 border-cat-criminal/30 text-cat-criminal",
  eviction: "bg-cat-property/10 border-cat-property/30 text-cat-property",
  workplace: "bg-cat-labour/10 border-cat-labour/30 text-cat-labour",
};

const QuizzesIndex = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <div className="container py-8 md:py-12 max-w-4xl">
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Know Your Rights Quizzes</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Test Your Legal Awareness</h1>
          <p className="text-muted-foreground max-w-2xl">
            Quick scenario-based quizzes for the moments that matter — being stopped by police, fighting an eviction, or standing up at work. Real Indian law, AI explains every answer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {QUIZZES.map((q) => {
            const Icon = ICONS[q.slug];
            return (
              <Link
                key={q.slug}
                to={`/quizzes/${q.slug}`}
                className={`group rounded-xl border p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all ${ACCENTS[q.slug]}`}
              >
                <Icon className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-foreground text-lg mb-2">{q.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{q.tagline}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{q.questions.length} questions</span>
                  <span className="font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">Start <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="rounded-lg p-4 bg-destructive/5 border border-destructive/20 text-xs text-muted-foreground mt-10">
          <span className="font-semibold text-destructive">⚠ Disclaimer: </span>{LEGAL_DISCLAIMER}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default QuizzesIndex;
