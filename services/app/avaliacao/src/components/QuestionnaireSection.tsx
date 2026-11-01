import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { questions, categoryLabels } from "@/lib/questions";

interface Props {
  onComplete: (answers: Record<string, number>) => void;
  onBack: () => void;
  totalSteps: number;
  currentStep: number;
}

export function QuestionnaireSection({ onComplete, onBack, totalSteps, currentStep }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const hasAnswer = answers[question.id] !== undefined;

  const handleSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
    else onBack();
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-primary font-heading font-semibold uppercase tracking-widest">
                Etapa {currentStep}/{totalSteps}
              </p>
              <span className="text-xs font-heading font-semibold text-primary px-3 py-1 rounded-full bg-teal-light">
                {categoryLabels[question.category]}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-secondary rounded-full h-1.5 mb-1">
              <div
                className="h-1.5 rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground text-right mt-1">
              {currentIndex + 1} de {questions.length}
            </p>
          </div>

          {/* Question */}
          <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-6 leading-snug">
            {question.text}
          </h3>

          {/* Options */}
          <div className="space-y-2.5 mb-8">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 font-body text-sm touch-target ${
                  answers[question.id] === opt.value
                    ? "border-primary/40 bg-teal-light text-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/20 active:bg-secondary/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrev} className="flex-1 h-12 rounded-xl">
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
            <Button onClick={handleNext} disabled={!hasAnswer} className="flex-1 h-12 rounded-xl gradient-accent text-accent-foreground font-heading font-semibold">
              {currentIndex < questions.length - 1 ? "Próxima" : "Avançar"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
