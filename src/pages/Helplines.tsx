import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Phone, ExternalLink, Search, MapPin, Scale } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { NATIONAL_HELPLINES, STATE_LEGAL_AID, FREE_LEGAL_LINKS } from "@/data/helplines";
import { LEGAL_DISCLAIMER } from "@/lib/categories";

const Helplines = () => {
  const [q, setQ] = useState("");
  const filteredStates = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return STATE_LEGAL_AID;
    return STATE_LEGAL_AID.filter((x) => x.state.toLowerCase().includes(s) || x.authority.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 md:py-12 max-w-5xl">
          <Breadcrumb className="mb-5">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Legal Helplines</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Legal Helplines & Free Aid</h1>
            <p className="text-muted-foreground max-w-2xl">
              Every Indian citizen is entitled to free legal aid. These numbers and links connect you to NALSA, your state legal services authority, and pro bono lawyers.
            </p>
          </div>

          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Scale className="w-5 h-5 text-primary" /> National Helplines</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {NATIONAL_HELPLINES.map((h) => (
                <a
                  key={h.name}
                  href={`tel:${h.number.replace(/\s|\//g, "")}`}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">{h.name}</p>
                    <p className="text-2xl font-bold text-primary my-1">{h.number}</p>
                    <p className="text-sm text-muted-foreground">{h.detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4"><MapPin className="w-5 h-5 text-primary" /> State Legal Services Authorities (SLSAs)</h2>
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by state or authority…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {filteredStates.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground text-center">No matches.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {filteredStates.map((s) => (
                    <li key={s.state} className="p-4 hover:bg-muted/40 transition-colors flex items-center justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">{s.state}</p>
                        <p className="text-xs text-muted-foreground">{s.authority}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <a href={`tel:${s.number.replace(/[^0-9]/g, "")}`} className="text-primary font-semibold text-sm inline-flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {s.number}
                        </a>
                        {s.website && (
                          <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Website
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">Free Legal Resources & Pro Bono Lawyers</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {FREE_LEGAL_LINKS.map((l) => (
                <a
                  key={l.name}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors block"
                >
                  <p className="font-bold text-foreground mb-1 flex items-center gap-2">{l.name} <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" /></p>
                  <p className="text-sm text-muted-foreground">{l.description}</p>
                </a>
              ))}
            </div>
          </section>

          <div className="rounded-lg p-4 bg-destructive/5 border border-destructive/20 text-xs text-muted-foreground">
            <span className="font-semibold text-destructive">⚠ Disclaimer: </span>{LEGAL_DISCLAIMER}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Helplines;
