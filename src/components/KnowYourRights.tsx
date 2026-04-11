import { useState } from "react";
import { Volume2, VolumeX, Home, UserCheck, ShoppingBag, Car, Wifi, Heart, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const handlePlayAudio = async (card: typeof cards[0], index: number) => {
    // If already playing this card, stop it
    if (playingIndex === index) {
      window.speechSynthesis.cancel();
      setPlayingIndex(null);
      setCurrentUtterance(null);
      return;
    }

    // Stop any current playback
    window.speechSynthesis.cancel();
    setLoadingIndex(index);

    try {
      const { data, error } = await supabase.functions.invoke("tts-summary", {
        body: { text: card.desc, title: card.title },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const script = data?.script;
      if (!script) throw new Error("No audio script generated");

      // Use Web Speech API for TTS
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onend = () => {
        setPlayingIndex(null);
        setCurrentUtterance(null);
      };
      utterance.onerror = () => {
        setPlayingIndex(null);
        setCurrentUtterance(null);
      };

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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Know Your Rights
          </h2>
          <p className="text-muted-foreground text-lg">
            Quick visual guides with AI audio summaries in your language
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md hover:shadow-primary/5 transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 ${playingIndex === index ? "text-warm-amber" : "text-muted-foreground hover:text-primary"}`}
                  title={playingIndex === index ? "Stop audio" : "Play 2-minute audio summary"}
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
