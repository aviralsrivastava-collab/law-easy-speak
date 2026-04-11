import { CheckCircle2, Circle, FileText, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  documents?: string[];
  estimatedTime?: string;
  escalation?: string;
}

interface RoadmapData {
  title: string;
  steps: RoadmapStep[];
}

interface ProceduralRoadmapProps {
  roadmap: RoadmapData;
}

const ProceduralRoadmap = ({ roadmap }: ProceduralRoadmapProps) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepIndex)) {
        next.delete(stepIndex);
      } else {
        next.add(stepIndex);
      }
      return next;
    });
  };

  const progress = roadmap.steps.length > 0 ? (completedSteps.size / roadmap.steps.length) * 100 : 0;

  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
      <div className="bg-primary/5 border-b border-primary/10 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {roadmap.title}
          </h3>
          <span className="text-sm font-medium text-muted-foreground">
            {completedSteps.size}/{roadmap.steps.length} done
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="divide-y divide-border">
        {roadmap.steps.map((step, i) => {
          const isCompleted = completedSteps.has(i);
          const isExpanded = expandedStep === i;

          return (
            <div key={i} className={`transition-colors ${isCompleted ? "bg-safe-green/5" : ""}`}>
              <div className="flex items-start gap-3 px-6 py-4 cursor-pointer" onClick={() => setExpandedStep(isExpanded ? null : i)}>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStep(i); }}
                  className="mt-0.5 flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-safe-green" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground/40" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                      Step {step.step}
                    </span>
                    {step.estimatedTime && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {step.estimatedTime}
                      </span>
                    )}
                  </div>
                  <p className={`font-semibold mt-1 ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {step.title}
                  </p>
                </div>

                {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </div>

              {isExpanded && (
                <div className="px-6 pb-4 pl-[3.75rem] space-y-3 animate-fade-in-up">
                  <p className="text-sm text-muted-foreground">{step.description}</p>

                  {step.documents && step.documents.length > 0 && (
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <div className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Required Documents
                      </div>
                      <ul className="space-y-1">
                        {step.documents.map((doc, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step.escalation && (
                    <div className="bg-warm-amber/5 border border-warm-amber/20 rounded-lg p-3">
                      <div className="text-xs font-semibold text-warm-amber uppercase tracking-wide mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> If this doesn't work
                      </div>
                      <p className="text-sm text-foreground">{step.escalation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProceduralRoadmap;
