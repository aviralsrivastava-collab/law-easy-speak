import { Scale, Phone, Mail, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-card border-t border-border text-foreground">
    <div className="container py-12">
      <div className="grid md:grid-cols-4 gap-8">
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
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/category/family" className="hover:text-foreground">Family Law</Link></li>
            <li><Link to="/category/criminal" className="hover:text-foreground">Criminal Law</Link></li>
            <li><Link to="/category/labour" className="hover:text-foreground">Labour Law</Link></li>
            <li><Link to="/category/property" className="hover:text-foreground">Property Law</Link></li>
            <li><Link to="/category/consumer" className="hover:text-foreground">Consumer Rights</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Tools</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/document-explainer" className="hover:text-foreground">Document Explainer</Link></li>
            <li><Link to="/quizzes" className="hover:text-foreground">Know-Your-Rights Quizzes</Link></li>
            <li><Link to="/helplines" className="hover:text-foreground">Legal Helplines</Link></li>
          </ul>
          <h4 className="font-semibold mt-4 mb-2">Emergency</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> NALSA: 15100</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> Cyber: 1930</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> Women: 181</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-destructive" /> Legal Disclaimer</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">This is not legal advice.</span> LexiLearn provides legal information for educational purposes only. Laws change and outcomes depend on facts. Please consult a qualified advocate or your nearest DLSA (helpline 15100) for your specific situation.
          </p>
          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" /> contact@lexilearn.in
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>© 2026 LexiLearn. Open-source legal awareness initiative.</span>
        <span className="text-xs">⚠ This is not legal advice — for educational use only.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
