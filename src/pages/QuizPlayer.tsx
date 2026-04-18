import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Loader2, RotateCcw, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { QUIZZES } from "@/data/quizzes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LEGAL_DISCLAIMER } from "@/lib/categories";

interface Feedback {
  isCorrect: boolean;
  verdict: string;
  explanation: string;
  lawReference: string;
  tip: string;
}

const QuizPlayer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const quiz = QUIZZES.find((q) => q.slug === slug);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold mb-2">Quiz not found</h1>
          <Link to="/quizzes" className="text-primary hover:underline">← Back to quizzes</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const current = quiz.questions[idx];
  const total = quiz.questions.length;

  const submit = async () => {
    if (selected === null) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("quiz-feedback", {
        body: {
          quizTopic: quiz.title,
          question: current.q,
          options: current.options,
          correctIndex: current.correctIndex,
          userAnswerIndex: selected,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setFeedback(data);
      if (data.isCorrect) setScore((s) => s + 1);
    } catch (e: any) {
      // Fallback offline feedback
      const isCorrect = selected === current.correctIndex;
      setFeedback({
        isCorrect,
        verdict: isCorrect ? "Correct" : "Incorrect",
        explanation: `The correct answer is: "${current.options[current.correctIndex]}".`,
        lawReference: "See related Indian Act for details.",
        tip: "Save NALSA helpline 15100 for free legal aid.",
      });
      if (isCorrect) setScore((s) => s + 1);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx(idx + 1);
      setSelected(null);
      setFeedback(null);
    }
  };

  const reset = () => {
    setIdx(0); setSelected(null); setFeedback(null); setScore(0); setDone(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 md:py-12 max-w-3xl">
          <Breadcrumb className="mb-5">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/quizzes">Quizzes</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{quiz.title}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate("/quizzes")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> All quizzes
          </Button>

          {!done ? (
            <>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{quiz.title}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Question {idx + 1} of {total}</span>
                  <span className="text-sm font-semibold text-foreground">Score: {score}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${((idx) / total) * 100}%` }} />
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-5">{current.q}</h2>
                <div className="space-y-2">
                  {current.options.map((opt, i) => {
                    const isSel = selected === i;
                    const showResult = !!feedback;
                    const isCorrectAns = i === current.correctIndex;
                    let cls = "border-border hover:border-primary/50 hover:bg-muted/40";
                    if (showResult && isCorrectAns) cls = "border-safe-green/60 bg-safe-green/10 text-foreground";
                    else if (showResult && isSel && !isCorrectAns) cls = "border-destructive/60 bg-destructive/10 text-foreground";
                    else if (isSel) cls = "border-primary bg-primary/10 text-foreground";
                    return (
                      <button
                        key={i}
                        disabled={!!feedback}
                        onClick={() => setSelected(i)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all text-sm ${cls}`}
                      >
                        <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                      </button>
                    );
                  })}
                </div>

                {!feedback ? (
                  <Button className="mt-5 w-full" disabled={selected === null || loading} onClick={submit}>
                    {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Checking…</>) : "Check answer"}
                  </Button>
                ) : (
                  <div className={`mt-5 rounded-lg border p-4 ${feedback.isCorrect ? "bg-safe-green/10 border-safe-green/30" : "bg-destructive/10 border-destructive/30"}`}>
                    <p className="font-bold mb-2 flex items-center gap-2">
                      {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-safe-green" /> : <XCircle className="w-5 h-5 text-destructive" />}
                      {feedback.verdict}
                    </p>
                    <p className="text-sm text-foreground mb-2">{feedback.explanation}</p>
                    {feedback.lawReference && (
                      <p className="text-xs text-muted-foreground mb-1"><BookOpen className="w-3.5 h-3.5 inline mr-1" /><span className="font-semibold">Law:</span> {feedback.lawReference}</p>
                    )}
                    {feedback.tip && <p className="text-xs text-primary"><span className="font-semibold">Tip:</span> {feedback.tip}</p>}
                    <Button className="mt-4 w-full" onClick={next}>
                      {idx + 1 >= total ? "See results" : (<>Next question <ArrowRight className="w-4 h-4 ml-1" /></>)}
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You scored {score}/{total}</h2>
              <p className="text-muted-foreground mb-6">
                {score === total ? "Perfect — you know your rights well." : score >= total / 2 ? "Solid awareness. Review the misses and you're set." : "Worth a re-read — these moments matter."}
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Retry</Button>
                <Button onClick={() => navigate("/quizzes")}>Try another quiz</Button>
              </div>
            </div>
          )}

          <div className="rounded-lg p-4 bg-destructive/5 border border-destructive/20 text-xs text-muted-foreground mt-8">
            <span className="font-semibold text-destructive">⚠ Disclaimer: </span>{LEGAL_DISCLAIMER}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizPlayer;
