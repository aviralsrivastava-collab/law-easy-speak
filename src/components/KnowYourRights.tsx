import { Volume2, Home, UserCheck, ShoppingBag, Car, Wifi, Heart, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const cards = [
  { icon: Home, title: "Tenancy Rights", desc: "Deposit rules, eviction protection & rent receipts", lang: "EN • HI • TA" },
  { icon: UserCheck, title: "Police Encounters", desc: "Rights during arrest, FIR filing & legal aid access", lang: "EN • HI • BN" },
  { icon: ShoppingBag, title: "Consumer Protection", desc: "Refunds, warranties & filing complaints", lang: "EN • HI • TE" },
  { icon: Car, title: "Road Accidents", desc: "Insurance claims, FIR & compensation", lang: "EN • HI • TA" },
  { icon: Wifi, title: "Cyber Crime", desc: "Online fraud, harassment & reporting", lang: "EN • HI • BN" },
  { icon: Heart, title: "Domestic Violence", desc: "Protection orders, shelter & legal aid", lang: "EN • HI • TE" },
  { icon: GraduationCap, title: "Education Rights", desc: "RTE, admission denials & fee refunds", lang: "EN • HI • TA" },
  { icon: ShoppingBag, title: "Workplace Rights", desc: "Salary delays, termination & harassment", lang: "EN • HI • BN" },
];

const KnowYourRights = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Know Your Rights
          </h2>
          <p className="text-muted-foreground text-lg">
            Quick visual guides with audio summaries in your language
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-muted-foreground hover:text-primary"
                  title="Play 2-minute audio summary"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{card.desc}</p>
              <div className="text-xs text-muted-foreground font-medium bg-muted rounded-md px-2 py-1 inline-block">
                🌐 {card.lang}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KnowYourRights;
