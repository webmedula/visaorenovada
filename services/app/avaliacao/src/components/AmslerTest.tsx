import { useState } from "react";
import { ArrowRight, ArrowLeft, Grid3X3, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmslerTestResult, amslerNeedsAlert } from "@/lib/visualTests";

interface Props {
  onComplete: (result: AmslerTestResult) => void;
  onBack: () => void;
  totalSteps: number;
  currentStep: number;
}

type Phase = "instructions" | "test-right" | "test-left" | "questions";

const amslerQuestions = [
  { key: "straightLines" as const, text: "Linhas retas normais?", invert: true },
  { key: "wavyLines" as const, text: "Linhas onduladas ou tortas?", invert: false },
  { key: "blurredArea" as const, text: "Área borrada ou embaçada?", invert: false },
  { key: "missingSpot" as const, text: "Falha ou ponto faltando?", invert: false },
  { key: "discomfort" as const, text: "Desconforto ao observar?", invert: false },
];

function AmslerGrid() {
  const lines = 20;
  const size = 260;
  const step = size / lines;

  return (
    <div className="flex items-center justify-center my-5">
      <div className="relative bg-card border-2 border-foreground/15 rounded-xl" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute inset-0">
          {Array.from({ length: lines + 1 }).map((_, i) => (
            <g key={i}>
              <line x1={0} y1={i * step} x2={size} y2={i * step} stroke="hsl(210,10%,65%)" strokeWidth={0.5} />
              <line x1={i * step} y1={0} x2={i * step} y2={size} stroke="hsl(210,10%,65%)" strokeWidth={0.5} />
            </g>
          ))}
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-destructive shadow-lg" />
      </div>
    </div>
  );
}

export function AmslerTest({ onComplete, onBack, totalSteps, currentStep }: Props) {
  const [phase, setPhase] = useState<Phase>("instructions");
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const allAnswered = amslerQuestions.every((q) => answers[q.key] !== undefined);
  const result: AmslerTestResult = answers as unknown as AmslerTestResult;
  const showAlert = allAnswered && amslerNeedsAlert(result);

  const toggleAnswer = (key: string, val: boolean) => setAnswers((prev) => ({ ...prev, [key]: val }));

  if (phase === "instructions") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
        <div className="w-full max-w-lg animate-fade-up">
          <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
            <p className="text-xs text-primary font-heading font-semibold uppercase tracking-widest mb-1">
              Etapa {currentStep}/{totalSteps}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Grid3X3 className="w-4.5 h-4.5 text-primary" />
              <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">Grade de Amsler</h2>
            </div>

            <div className="text-sm text-muted-foreground font-body mb-6 space-y-3">
              <p>Teste educativo para observar a percepção visual central.</p>
              <div className="bg-teal-light/60 rounded-2xl p-4">
                <p className="font-heading font-semibold text-foreground text-sm mb-2">Instruções:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Use boa iluminação e óculos habituais</li>
                  <li>Cubra um olho por vez</li>
                  <li>Olhe fixamente para o <strong>ponto vermelho central</strong></li>
                  <li>Observe se as linhas parecem normais, tortas ou com falhas</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
                <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
              </Button>
              <Button onClick={() => setPhase("test-right")} className="flex-1 h-12 rounded-xl gradient-accent text-accent-foreground font-heading font-semibold">
                Começar <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "test-right" || phase === "test-left") {
    const isRight = phase === "test-right";
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
        <div className="w-full max-w-lg animate-scale-in">
          <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-light text-primary font-heading font-semibold text-xs mb-3">
              {isRight ? "👁️ Cubra o olho esquerdo" : "👁️ Cubra o olho direito"}
            </div>
            <p className="text-xs text-muted-foreground font-body mb-1">
              Olhe fixamente para o ponto vermelho. Observe as linhas sem mover os olhos.
            </p>

            <AmslerGrid />

            <p className="text-[10px] text-muted-foreground mb-5">~10 segundos</p>

            <Button
              onClick={() => setPhase(isRight ? "test-left" : "questions")}
              className="w-full h-12 rounded-xl gradient-accent text-accent-foreground font-heading font-semibold"
            >
              {isRight ? "Testar Outro Olho" : "Responder"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
          <h3 className="font-heading text-lg font-bold text-foreground mb-1">O que observou?</h3>
          <p className="text-xs text-muted-foreground font-body mb-5">Considerando ambos os olhos.</p>

          <div className="space-y-2.5 mb-5">
            {amslerQuestions.map((q) => (
              <div key={q.key} className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-card">
                <span className="text-sm font-body text-foreground pr-3">{q.text}</span>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAnswer(q.key, true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-target ${
                      answers[q.key] === true
                        ? q.invert ? "bg-primary text-primary-foreground" : "bg-warm text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >Sim</button>
                  <button
                    onClick={() => toggleAnswer(q.key, false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-target ${
                      answers[q.key] === false
                        ? q.invert ? "bg-warm text-primary-foreground" : "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >Não</button>
                </div>
              </div>
            ))}
          </div>

          {showAlert && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 mb-5 flex items-start gap-3 animate-fade-up">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-bold text-xs text-red-600 mb-0.5">Atenção</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Sinais que merecem avaliação com oftalmologista. Esta ferramenta não fornece diagnóstico.
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={() => allAnswered && onComplete(result)}
            disabled={!allAnswered}
            className="w-full h-12 rounded-xl gradient-accent text-accent-foreground font-heading font-semibold"
          >
            Ver Resultado Final <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
