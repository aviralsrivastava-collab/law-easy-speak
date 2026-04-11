import { Scale, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-card border-t border-border text-foreground py-12">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-6 h-6" />
            <span className="text-lg font-bold">LexiLearn</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Making Indian law accessible to every citizen. Free, multilingual, and designed for everyone.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Emergency Helplines</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> Women Helpline: 181</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> Police: 100</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> Cyber Crime: 1930</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> NALSA: 15100</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Disclaimer</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            LexiLearn provides legal information for educational purposes only. This is not legal advice. Please consult a qualified lawyer for your specific situation.
          </p>
          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" /> contact@lexilearn.in
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
        © 2026 LexiLearn. Open-source legal awareness initiative.
      </div>
    </div>
  </footer>
);

export default Footer;
