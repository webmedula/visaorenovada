import { useState } from "react";
import { ArrowRight, ArrowLeft, Focus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FocusTestResult } from "@/lib/visualTests";

interface Props {
  onComplete: (result: FocusTestResult) => void;
  onBack: () => void;
  totalSteps: number;
  currentStep: number;
}

type Phase = "instructions" | "exercise" | "questions";

const focusQuestions = [
  { key: "delayToFocus" as const, text: "Demorou para focar ao alternar?" },
  { key: "feltEffort" as const, text: "Sentiu esforço ao focar?" },
  { key: "blurry" as const, text: "A imagem ficou embaçada?" },
  { key: "nearWorse" as const, text: "Foco de perto foi mais difícil?" },
  { key: "farWorse" as const, text: "Foco de longe foi mais difícil?" },
];

export function FocusTest({ onComplete, onBack, totalSteps, currentStep }: Props) {
  const [phase, setPhase] = useState<Phase>("instructions");
  const [countdown, setCountdown] = useState(0);
  const [round, setRound] = useState(0);
  const [lookingNear, setLookingNear] = useState(true);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const allAnswered = focusQuestions.every((q) => answers[q.key] !== undefined);

  const startExercise = () => {
    setPhase("exercise");
    setRound(0);
    setLookingNear(true);
    runCycle(0, true);
  };

  const runCycle = (r: number, near: boolean) => {
    if (r >= 3) {
      setPhase("questions");
      return;
    }
    setRound(r);
    setLookingNear(near);
    setCountdown(5);
    let c = 5;
    const interval = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(interval);
        if (near) {
          runCycle(r, false);
        } else {
          runCycle(r + 1, true);
        }
      }
    }, 1000);
  };

  const toggleAnswer = (key: string, val: boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  if (phase === "instructions") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
        <div className="w-full max-w-lg animate-fade-up">
          <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
            <p className="text-xs text-primary font-heading font-semibold uppercase tracking-widest mb-1">
              Etapa {currentStep}/{totalSteps}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Focus className="w-4.5 h-4.5 text-primary" />
              <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">
                Alternância de Foco
              </h2>
            </div>

            <div className="text-sm text-muted-foreground font-body mb-6 space-y-3">
              <p>Avaliação educativa da facilidade de alternar o foco entre perto e longe.</p>
              <div className="bg-teal-light/60 rounded-2xl p-4">
                <p className="font-heading font-semibold text-foreground text-sm mb-2">Como funciona:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs">
                  <li>Foque no alvo da tela por 5 segundos</li>
                  <li>Olhe para um objeto distante (3+ metros)</li>
                  <li>Repita 3 vezes</li>
                  <li>Responda sobre a experiência</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
                <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
              </Button>
              <Button onClick={startExercise} className="flex-1 h-12 rounded-xl gradient-accent text-accent-foreground font-heading font-semibold">
                Iniciar <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "exercise") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
        <div className="w-full max-w-lg animate-scale-in">
          <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10 text-center">
            <p className="text-xs text-muted-foreground font-heading mb-2">Ciclo {round + 1} de 3</p>

            <div className="my-10">
              {lookingNear ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center shadow-glow animate-pulse-soft">
                    <Eye className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <p className="font-heading text-lg font-bold text-foreground">Foque neste ponto</p>
                  <p className="text-xs text-muted-foreground">Olhe fixamente para o ícone</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-accent/15 border-[3px] border-dashed border-accent flex items-center justify-center">
                    <span className="text-2xl">🏔️</span>
                  </div>
                  <p className="font-heading text-lg font-bold text-foreground">Olhe para longe</p>
                  <p className="text-xs text-muted-foreground">Foque em objeto a 3+ metros</p>
                </div>
              )}
            </div>

            <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
              <span className="font-heading text-2xl font-bold text-primary">{countdown}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">segundos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
          <h3 className="font-heading text-lg font-bold text-foreground mb-1.5">Como foi?</h3>
          <p className="text-xs text-muted-foreground font-body mb-5">Responda com base no que percebeu.</p>

          <div className="space-y-2.5 mb-6">
            {focusQuestions.map((q) => (
              <div key={q.key} className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-card">
                <span className="text-sm font-body text-foreground pr-3">{q.text}</span>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAnswer(q.key, true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-target ${
                      answers[q.key] === true ? "bg-warm text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >Sim</button>
                  <button
                    onClick={() => toggleAnswer(q.key, false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-target ${
                      answers[q.key] === false ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >Não</button>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => allAnswered && onComplete(answers as unknown as FocusTestResult)}
            disabled={!allAnswered}
            className="w-full h-12 rounded-xl gradient-accent text-accent-foreground font-heading font-semibold"
          >
            Próximo Teste <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
