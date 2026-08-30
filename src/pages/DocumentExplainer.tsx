import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, FileText, Upload, AlertTriangle, CheckCircle2, Clock, HelpCircle } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore - vite worker import
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ensureSignedIn } from "@/lib/ensureSignedIn";
import { toast } from "sonner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LEGAL_DISCLAIMER } from "@/lib/categories";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface ExplainResult {
  documentType: string;
  summary: string;
  keyPoints: string[];
  redFlags: string[];
  yourRights: string[];
  yourObligations: string[];
  deadlines: { item: string; when: string }[];
  nextSteps: string[];
  questionsToAsk: string[];
  disclaimer?: string;
}

const DocumentExplainer = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<ExplainResult | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setParsing(true);
    try {
      if (file.type === "application/pdf") {
        const buf = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let full = "";
        for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          full += content.items.map((it: any) => it.str).join(" ") + "\n\n";
        }
        if (!full.trim()) {
          toast.error("This PDF appears to be a scanned image. Please paste the text manually.");
        } else {
          setText(full.trim());
          toast.success(`Extracted ${pdf.numPages} page(s).`);
        }
      } else if (file.type.startsWith("text/")) {
        setText(await file.text());
      } else {
        toast.error("Please upload a PDF or text file.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not read this file.");
    } finally {
      setParsing(false);
    }
  };

  const explain = async () => {
    if (text.trim().length < 30) {
      toast.error("Please paste or upload at least a paragraph.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      if (!(await ensureSignedIn("the document explainer"))) throw new Error("Sign in required");
      const { data, error } = await supabase.functions.invoke("explain-document", {
        body: { text },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Could not explain document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 md:py-12 max-w-4xl">
          <Breadcrumb className="mb-5">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Document Explainer</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Paste Your Legal Document</h1>
            <p className="text-muted-foreground max-w-2xl">
              Got a notice, contract, FIR copy, or court order you can't decode? Paste the text or upload the PDF — we'll explain it in plain language, flag risks, and tell you exactly what to do next.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                <Upload className="w-4 h-4" />
                {parsing ? "Reading file…" : "Upload PDF or text file"}
                <input
                  type="file"
                  accept="application/pdf,text/plain,.txt,.md"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </label>
              <span className="text-xs text-muted-foreground">PDF up to 30 pages • or paste below</span>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your legal document here — eviction notice, rental agreement, contract clause, FIR copy, court summons…"
              className="min-h-[240px] font-mono text-sm"
            />

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{text.length.toLocaleString()} characters</span>
              <Button onClick={explain} disabled={loading || parsing || text.trim().length < 30}>
                {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Explaining…</>) : "Explain in Plain Language"}
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-8 space-y-5">
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">{result.documentType}</p>
                <p className="text-foreground leading-relaxed">{result.summary}</p>
              </div>

              {result.keyPoints?.length > 0 && (
                <Card title="Key Points" icon={<CheckCircle2 className="w-4 h-4 text-safe-green" />} items={result.keyPoints} />
              )}
              {result.redFlags?.length > 0 && (
                <Card title="Red Flags — Be Careful" icon={<AlertTriangle className="w-4 h-4 text-destructive" />} items={result.redFlags} accent="destructive" />
              )}
              {result.yourRights?.length > 0 && (
                <Card title="Your Rights" icon={<CheckCircle2 className="w-4 h-4 text-primary" />} items={result.yourRights} />
              )}
              {result.yourObligations?.length > 0 && (
                <Card title="Your Obligations" icon={<FileText className="w-4 h-4 text-warm-amber" />} items={result.yourObligations} />
              )}
              {result.deadlines?.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-warm-amber" /> Deadlines</h3>
                  <ul className="space-y-2">
                    {result.deadlines.map((d, i) => (
                      <li key={i} className="text-sm flex justify-between gap-3 border-b border-border pb-2 last:border-0">
                        <span className="text-foreground">{d.item}</span>
                        <span className="text-warm-amber font-semibold">{d.when}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.nextSteps?.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                  <h3 className="font-bold text-foreground mb-3">What To Do Next</h3>
                  <ol className="space-y-2">
                    {result.nextSteps.map((s, i) => (
                      <li key={i} className="text-sm text-foreground flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {result.questionsToAsk?.length > 0 && (
                <Card title="Smart Questions to Ask" icon={<HelpCircle className="w-4 h-4 text-primary" />} items={result.questionsToAsk} />
              )}

              <div className="rounded-lg p-4 bg-destructive/5 border border-destructive/20 text-xs text-muted-foreground">
                <span className="font-semibold text-destructive">⚠ Disclaimer: </span>{result.disclaimer || LEGAL_DISCLAIMER}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Card = ({ title, icon, items, accent }: { title: string; icon: React.ReactNode; items: string[]; accent?: "destructive" }) => (
  <div className={`rounded-xl p-5 border ${accent === "destructive" ? "bg-destructive/5 border-destructive/20" : "bg-card border-border"}`}>
    <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">{icon} {title}</h3>
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-muted-foreground mt-1">•</span><span>{it}</span></li>
      ))}
    </ul>
  </div>
);

export default DocumentExplainer;
