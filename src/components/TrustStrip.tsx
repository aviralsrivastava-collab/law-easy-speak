import { ShieldCheck, Languages, Sparkles, Lock, Scale } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Verified IPC / BNS citations" },
  { icon: Sparkles, label: "Gemini AI legal reasoning" },
  { icon: Languages, label: "English + Hindi, more coming" },
  { icon: Lock, label: "Private by default, no tracking" },
  { icon: Scale, label: "Built with NALSA & DLSA links" },
];

const TrustStrip = () => (
  <section aria-label="Trust signals" className="relative -mt-6 md:-mt-10 z-10">
    <div className="container">
      <div className="glass-panel rounded-2xl px-6 py-4 md:py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground/80">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStrip;