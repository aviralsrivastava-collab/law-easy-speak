import { useState } from "react";
import { Sprout, Building2, ShieldCheck, Briefcase, Scale, HeartPulse, Landmark, Smartphone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const topics = [
  { icon: Sprout, title: "Rural Rights", subtitle: "Land, MNREGA & Agriculture", description: "Know your rights about land ownership, MNREGA wages, and agricultural protections.", color: "bg-safe-green/10 text-safe-green border-safe-green/20", items: ["Land disputes", "MNREGA entitlements", "Crop insurance"] },
  { icon: Building2, title: "Urban & Workplace", subtitle: "Harassment, Tenancy & Labour", description: "Rights related to workplace safety, rent agreements, and employment law.", color: "bg-primary/10 text-primary border-primary/20", items: ["Tenant rights", "Workplace harassment", "Wage disputes"] },
  { icon: ShieldCheck, title: "Women & Youth", subtitle: "Cyber Safety & Protection", description: "Legal protections for women, children, and youth including cyber harassment.", color: "bg-warm-amber/10 text-warm-amber border-warm-amber/20", items: ["Domestic violence", "Cyber bullying", "POCSO Act"] },
  { icon: Briefcase, title: "Small Business", subtitle: "GST, Contracts & Compliance", description: "Navigate GST, contracts, and regulatory compliance for your business.", color: "bg-trust-blue-light/10 text-trust-blue-light border-trust-blue-light/20", items: ["GST basics", "Contract disputes", "MSME protections"] },
  { icon: Scale, title: "Property & Inheritance", subtitle: "Succession, Wills & Disputes", description: "Understand property transfer, inheritance laws, and will registration.", color: "bg-primary/10 text-primary border-primary/20", items: ["Will drafting", "Succession rights", "Property mutation"] },
  { icon: HeartPulse, title: "Health & Medical", subtitle: "Insurance, Negligence & Rights", description: "Medical negligence claims, insurance disputes, and patient rights.", color: "bg-destructive/10 text-destructive border-destructive/20", items: ["Medical negligence", "Health insurance", "Patient rights"] },
  { icon: Landmark, title: "Government Schemes", subtitle: "Subsidies, Pensions & RTI", description: "Access government benefits, file RTI, and claim pensions or subsidies.", color: "bg-safe-green/10 text-safe-green border-safe-green/20", items: ["RTI filing", "Pension claims", "Aadhaar issues"] },
  { icon: Smartphone, title: "Digital & Privacy", subtitle: "Data Protection & Online Fraud", description: "Protect your digital identity, report online fraud, and understand data laws.", color: "bg-warm-amber/10 text-warm-amber border-warm-amber/20", items: ["Data protection", "Online scams", "Social media laws"] },
];

interface TopicContent {
  title: string;
  overview: string;
  sections: { heading: string; text: string; tips: string[] }[];
  commonQuestions: { question: string; answer: string }[];
  emergencyContacts?: { name: string; number: string }[];
}

const TopicLibrary = () => {
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null);
  const [topicContent, setTopicContent] = useState<TopicContent | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTopicClick = async (topic: typeof topics[0]) => {
    setSelectedTopic(topic);
    setTopicContent(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("content-generator", {
        body: { type: "topic", title: topic.title, description: topic.items.join(", "), category: topic.subtitle },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setTopicContent(data);
    } catch (e: any) {
      console.error("Topic generation error:", e);
      toast.error("Could not generate topic content. Please try again.");
      setSelectedTopic(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-28 relative">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary/80 mb-3">
            <span className="h-px w-8 bg-primary/40" /> Topic Library
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Browse by Category</h2>
          <p className="text-muted-foreground text-lg">Choose a topic that matches your situation</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <button
              key={topic.title}
              onClick={() => handleTopicClick(topic)}
              className="group glass-panel tilt-card rounded-2xl p-6 text-left hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-500"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${topic.color} border mb-4`}>
                <topic.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">{topic.title}</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">{topic.subtitle}</p>
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

      <Dialog open={!!selectedTopic} onOpenChange={(open) => { if (!open) setSelectedTopic(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-3">
              {selectedTopic && <selectedTopic.icon className="w-6 h-6 text-primary" />}
              {selectedTopic?.title}
            </DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating topic guide...</p>
            </div>
          ) : topicContent ? (
            <div className="space-y-6 mt-2">
              {topicContent.overview && (
                <p className="text-muted-foreground bg-primary/5 rounded-lg p-4 border border-primary/10">{topicContent.overview}</p>
              )}
              {topicContent.sections?.map((section, i) => (
                <div key={i}>
                  <h3 className="font-bold text-foreground text-lg mb-2">{section.heading}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">{section.text}</p>
                  {section.tips?.length > 0 && (
                    <ul className="space-y-1">
                      {section.tips.map((tip, j) => (
                        <li key={j} className="text-sm text-primary flex gap-2">
                          <span>💡</span> {tip}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {topicContent.commonQuestions?.length > 0 && (
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-3">Common Questions</h3>
                  <div className="space-y-3">
                    {topicContent.commonQuestions.map((faq, i) => (
                      <div key={i} className="bg-muted/50 rounded-lg p-4">
                        <p className="font-semibold text-foreground text-sm mb-1">{faq.question}</p>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {topicContent.emergencyContacts?.length > 0 && (
                <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/10">
                  <h3 className="font-bold text-foreground mb-2">Emergency Contacts</h3>
                  {topicContent.emergencyContacts.map((c, i) => (
                    <p key={i} className="text-sm text-muted-foreground">📞 {c.name}: <span className="font-semibold text-foreground">{c.number}</span></p>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TopicLibrary;
