import { Gavel, FileText, Calendar, Building2, CheckCircle2 } from "lucide-react";

export interface Precedent {
  caseName: string;
  citation: string;
  court: string;
  date: string;
  facts: string;
  outcome: string;
  firReference: string;
  relevance: string;
}

interface Props {
  precedents: Precedent[];
  language: "en" | "hi";
}

const CasePrecedents = ({ precedents, language }: Props) => {
  if (!precedents?.length) return null;

  const t = (en: string, hi: string) => (language === "hi" ? hi : en);

  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
      <div className="bg-trust-blue-lighter border-b border-primary/20 px-6 py-3 flex items-center gap-2">
        <Gavel className="w-5 h-5 text-primary" />
        <span className="font-semibold text-primary">
          {t(`Similar Past Cases & FIR References`, `मिलते-जुलते पुराने मामले और FIR संदर्भ`)}
        </span>
      </div>
      <div className="divide-y divide-border">
        {precedents.map((p, i) => (
          <div key={i} className="p-6 space-y-3">
            <div>
              <h4 className="text-lg font-bold text-foreground">{p.caseName}</h4>
              <p className="text-xs font-mono text-muted-foreground mt-1">{p.citation}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                <Building2 className="w-3 h-3" /> {p.court}
              </span>
              <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                <Calendar className="w-3 h-3" /> {p.date}
              </span>
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">{t("Facts:", "तथ्य:")} </span>
              {p.facts}
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-warm-amber/5 border border-warm-amber/20 rounded-lg p-3">
                <div className="text-xs font-semibold text-warm-amber uppercase tracking-wide mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {t("FIR Reference", "FIR संदर्भ")}
                </div>
                <p className="text-sm text-foreground">{p.firReference}</p>
              </div>
              <div className="bg-safe-green/5 border border-safe-green/20 rounded-lg p-3">
                <div className="text-xs font-semibold text-safe-green uppercase tracking-wide mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {t("Outcome", "परिणाम")}
                </div>
                <p className="text-sm text-foreground">{p.outcome}</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-md px-3 py-2 text-xs text-muted-foreground italic">
              {t("Why this matters: ", "यह क्यों प्रासंगिक है: ")} {p.relevance}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-muted/30 px-6 py-3 text-xs text-muted-foreground border-t border-border">
        {t(
          "⚖️ Citations are for reference. Verify on indiankanoon.org or the official court website before relying in court.",
          "⚖️ संदर्भ केवल जानकारी के लिए हैं। न्यायालय में उपयोग से पहले indiankanoon.org पर सत्यापित करें।"
        )}
      </div>
    </div>
  );
};

export default CasePrecedents;
