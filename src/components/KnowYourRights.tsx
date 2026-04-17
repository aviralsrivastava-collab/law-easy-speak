import { useState } from "react";
import { Volume2, VolumeX, Home, UserCheck, ShoppingBag, Car, Wifi, Heart, GraduationCap, Loader2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const cards = [
  { icon: Home, title: "Tenancy Rights", titleHi: "किरायेदारी अधिकार", desc: "Deposit rules, eviction protection & rent receipts", descHi: "जमा राशि के नियम, बेदखली से सुरक्षा और किराया रसीद", lang: "EN • HI • TA" },
  { icon: UserCheck, title: "Police Encounters", titleHi: "पुलिस से मुलाकात", desc: "Rights during arrest, FIR filing & legal aid access", descHi: "गिरफ्तारी के दौरान अधिकार, FIR दर्ज करना और कानूनी सहायता", lang: "EN • HI • BN" },
  { icon: ShoppingBag, title: "Consumer Protection", titleHi: "उपभोक्ता संरक्षण", desc: "Refunds, warranties & filing complaints", descHi: "रिफंड, वारंटी और शिकायत दर्ज करना", lang: "EN • HI • TE" },
  { icon: Car, title: "Road Accidents", titleHi: "सड़क दुर्घटना", desc: "Insurance claims, FIR & compensation", descHi: "बीमा दावे, FIR और मुआवजा", lang: "EN • HI • TA" },
  { icon: Wifi, title: "Cyber Crime", titleHi: "साइबर अपराध", desc: "Online fraud, harassment & reporting", descHi: "ऑनलाइन धोखाधड़ी, उत्पीड़न और रिपोर्ट करना", lang: "EN • HI • BN" },
  { icon: Heart, title: "Domestic Violence", titleHi: "घरेलू हिंसा", desc: "Protection orders, shelter & legal aid", descHi: "सुरक्षा आदेश, आश्रय और कानूनी सहायता", lang: "EN • HI • TE" },
  { icon: GraduationCap, title: "Education Rights", titleHi: "शिक्षा के अधिकार", desc: "RTE, admission denials & fee refunds", descHi: "RTE, प्रवेश अस्वीकृति और शुल्क वापसी", lang: "EN • HI • TA" },
  { icon: ShoppingBag, title: "Workplace Rights", titleHi: "कार्यस्थल अधिकार", desc: "Salary delays, termination & harassment", descHi: "वेतन में देरी, बर्खास्तगी और उत्पीड़न", lang: "EN • HI • BN" },
];

const KnowYourRights = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voiceLang, setVoiceLang] = useState<Record<number, "en" | "hi">>({});

  const getCardLang = (index: number) => voiceLang[index] || "en";

  const toggleLang = (index: number) => {
    setVoiceLang(prev => ({ ...prev, [index]: prev[index] === "hi" ? "en" : "hi" }));
  };

  const handlePlayAudio = async (card: typeof cards[0], index: number) => {
    if (playingIndex === index) {
      window.speechSynthesis.cancel();
      setPlayingIndex(null);
      setCurrentUtterance(null);
      return;
    }

    window.speechSynthesis.cancel();
    setLoadingIndex(index);
    const lang = getCardLang(index);

    try {
      const title = lang === "hi" ? card.titleHi : card.title;
      const desc = lang === "hi" ? card.descHi : card.desc;

      const { data, error } = await supabase.functions.invoke("tts-summary", {
        body: { text: desc, title: title },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const script = data?.script;
      if (!script) throw new Error("No audio script generated");

      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.95;

      // Prefer a female voice in the requested language
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = lang === "hi" ? "hi" : "en";
      const femaleHints = /female|woman|zira|aria|jenny|samantha|victoria|susan|karen|tessa|fiona|moira|google.*(uk|us).*female|kalpana|swara|heera|priya|neerja|raveena|lekha/i;
      const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
      const femaleVoice =
        langVoices.find(v => femaleHints.test(v.name)) ||
        voices.find(v => femaleHints.test(v.name)) ||
        langVoices[0];
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.pitch = 1.15;

      utterance.onend = () => { setPlayingIndex(null); setCurrentUtterance(null); };
      utterance.onerror = () => { setPlayingIndex(null); setCurrentUtterance(null); };

      setCurrentUtterance(utterance);
      setPlayingIndex(index);
      setLoadingIndex(null);
      window.speechSynthesis.speak(utterance);
    } catch (e: any) {
      console.error("Audio error:", e);
      toast.error("Could not generate audio summary. Please try again.");
      setLoadingIndex(null);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-muted/50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Know Your Rights</h2>
          <p className="text-muted-foreground text-lg">Quick visual guides with AI audio summaries — toggle between English & Hindi</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const lang = getCardLang(index);
            return (
              <div key={card.title} className="bg-card rounded-xl border border-border p-5 hover:shadow-md hover:shadow-primary/5 transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-primary"
                      title={`Switch to ${lang === "en" ? "Hindi" : "English"}`}
                      onClick={() => toggleLang(index)}
                    >
                      <Languages className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`w-8 h-8 ${playingIndex === index ? "text-warm-amber" : "text-muted-foreground hover:text-primary"}`}
                      title={playingIndex === index ? "Stop audio" : `Play in ${lang === "en" ? "English" : "Hindi"}`}
                      onClick={() => handlePlayAudio(card, index)}
                      disabled={loadingIndex === index}
                    >
                      {loadingIndex === index ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : playingIndex === index ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {lang === "hi" ? card.titleHi : card.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {lang === "hi" ? card.descHi : card.desc}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${lang === "en" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"} cursor-pointer`} onClick={() => setVoiceLang(prev => ({ ...prev, [index]: "en" }))}>EN</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${lang === "hi" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"} cursor-pointer`} onClick={() => setVoiceLang(prev => ({ ...prev, [index]: "hi" }))}>हिं</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KnowYourRights;
