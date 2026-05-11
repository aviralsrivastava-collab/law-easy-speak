import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Globe } from "lucide-react";
import Reveal from "@/components/Reveal";

const FAQS_EN = [
  {
    q: "Is LexiLearn free to use?",
    a: "Yes — LexiLearn is 100% free. No login, no fees, no hidden charges. We're a public legal-awareness initiative.",
  },
  {
    q: "Is this legal advice?",
    a: "No. LexiLearn provides legal information for educational purposes only. For your specific case, please consult a qualified advocate or your nearest DLSA (helpline 15100).",
  },
  {
    q: "Which languages are supported?",
    a: "The interface, search and AI summaries currently support English and Hindi, with audio summaries available in both. More Indian languages are being added.",
  },
  {
    q: "How accurate are the IPC / BNS sections?",
    a: "Our AI maps your situation to the most relevant Indian Penal Code and Bharatiya Nyaya Sanhita sections, with citations. Always verify with a lawyer before filing.",
  },
  {
    q: "Can I download the FIR draft?",
    a: "Yes. Every search result includes a 'Generate FIR Draft' button that produces a ready-to-submit complaint letter as a PDF you can take to the police station.",
  },
  {
    q: "Is my data private?",
    a: "Your searches are processed securely and are not shared. If you sign in, we save your bookmarks and history only to your account.",
  },
];

const FAQS_HI = [
  { q: "क्या LexiLearn मुफ़्त है?", a: "हाँ — पूरी तरह मुफ़्त। कोई लॉगिन, कोई फीस, कोई छुपा शुल्क नहीं।" },
  { q: "क्या यह कानूनी सलाह है?", a: "नहीं। यह केवल जागरूकता के लिए है। अपने मामले के लिए वकील या नज़दीकी DLSA (15100) से संपर्क करें।" },
  { q: "कौन-सी भाषाएँ समर्थित हैं?", a: "अभी अंग्रेज़ी और हिंदी में खोज, सारांश और ऑडियो उपलब्ध हैं। अन्य भारतीय भाषाएँ जल्द आ रही हैं।" },
  { q: "IPC / BNS धाराएँ कितनी सटीक हैं?", a: "AI आपकी स्थिति को सबसे प्रासंगिक धाराओं से जोड़ता है। फाइल करने से पहले हमेशा वकील से जाँच करें।" },
  { q: "क्या मैं FIR ड्राफ्ट डाउनलोड कर सकता हूँ?", a: "हाँ। हर परिणाम पर 'FIR ड्राफ्ट जनरेट करें' बटन है जो PDF देता है।" },
  { q: "क्या मेरा डेटा सुरक्षित है?", a: "हाँ। आपकी खोज सुरक्षित रूप से प्रोसेस होती है और साझा नहीं की जाती।" },
];

const FAQSection = () => {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const faqs = lang === "hi" ? FAQS_HI : FAQS_EN;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container max-w-3xl">
        <Reveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <HelpCircle className="w-4 h-4" />
            {lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {lang === "hi" ? "आपके सवाल, सीधे जवाब" : "Your Questions, Answered"}
          </h2>
          <p className="text-muted-foreground text-lg mb-5">
            {lang === "hi"
              ? "LexiLearn कैसे काम करता है — एक नज़र में।"
              : "Everything you need to know about how LexiLearn works."}
          </p>
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="inline-flex items-center gap-1 bg-primary/10 hover:bg-primary/20 rounded-full px-3 py-1.5 text-sm font-medium text-foreground transition-colors"
          >
            <Globe className="w-4 h-4" /> {lang === "en" ? "हिंदी" : "EN"}
          </button>
        </Reveal>

        <Reveal delay={120}>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border border-border rounded-xl px-5 data-[state=open]:border-primary/40 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5 transition-all"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
};

export default FAQSection;