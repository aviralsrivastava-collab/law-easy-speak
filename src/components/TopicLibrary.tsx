import { Sprout, Building2, ShieldCheck, Briefcase, Scale, HeartPulse, Landmark, Smartphone } from "lucide-react";

const topics = [
  {
    icon: Sprout,
    title: "Rural Rights",
    subtitle: "Land, MNREGA & Agriculture",
    description: "Know your rights about land ownership, MNREGA wages, and agricultural protections.",
    color: "bg-safe-green/10 text-safe-green border-safe-green/20",
    items: ["Land disputes", "MNREGA entitlements", "Crop insurance"],
  },
  {
    icon: Building2,
    title: "Urban & Workplace",
    subtitle: "Harassment, Tenancy & Labour",
    description: "Rights related to workplace safety, rent agreements, and employment law.",
    color: "bg-primary/10 text-primary border-primary/20",
    items: ["Tenant rights", "Workplace harassment", "Wage disputes"],
  },
  {
    icon: ShieldCheck,
    title: "Women & Youth",
    subtitle: "Cyber Safety & Protection",
    description: "Legal protections for women, children, and youth including cyber harassment.",
    color: "bg-warm-amber/10 text-warm-amber border-warm-amber/20",
    items: ["Domestic violence", "Cyber bullying", "POCSO Act"],
  },
  {
    icon: Briefcase,
    title: "Small Business",
    subtitle: "GST, Contracts & Compliance",
    description: "Navigate GST, contracts, and regulatory compliance for your business.",
    color: "bg-trust-blue-light/10 text-trust-blue-light border-trust-blue-light/20",
    items: ["GST basics", "Contract disputes", "MSME protections"],
  },
  {
    icon: Scale,
    title: "Property & Inheritance",
    subtitle: "Succession, Wills & Disputes",
    description: "Understand property transfer, inheritance laws, and will registration.",
    color: "bg-primary/10 text-primary border-primary/20",
    items: ["Will drafting", "Succession rights", "Property mutation"],
  },
  {
    icon: HeartPulse,
    title: "Health & Medical",
    subtitle: "Insurance, Negligence & Rights",
    description: "Medical negligence claims, insurance disputes, and patient rights.",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    items: ["Medical negligence", "Health insurance", "Patient rights"],
  },
  {
    icon: Landmark,
    title: "Government Schemes",
    subtitle: "Subsidies, Pensions & RTI",
    description: "Access government benefits, file RTI, and claim pensions or subsidies.",
    color: "bg-safe-green/10 text-safe-green border-safe-green/20",
    items: ["RTI filing", "Pension claims", "Aadhaar issues"],
  },
  {
    icon: Smartphone,
    title: "Digital & Privacy",
    subtitle: "Data Protection & Online Fraud",
    description: "Protect your digital identity, report online fraud, and understand data laws.",
    color: "bg-warm-amber/10 text-warm-amber border-warm-amber/20",
    items: ["Data protection", "Online scams", "Social media laws"],
  },
];

const TopicLibrary = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose a topic that matches your situation
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topics.map((topic) => (
            <button
              key={topic.title}
              className="group bg-card rounded-xl border border-border p-6 text-left hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${topic.color} border mb-4`}>
                <topic.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">{topic.title}</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                {topic.subtitle}
              </p>
              <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
              <ul className="space-y-1.5">
                {topic.items.map((item) => (
                  <li key={item} className="text-sm text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopicLibrary;
