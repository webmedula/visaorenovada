import { useState } from "react";
import { ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readingLines, ReadingTestResult } from "@/lib/visualTests";

interface Props {
  onComplete: (result: ReadingTestResult) => void;
  onBack: () => void;
  totalSteps: number;
  currentStep: number;
}

const comfortOptions = [
  { value: "confortavel" as const, label: "Li com conforto", emoji: "😊" },
  { value: "forcou" as const, label: "Precisei forçar", emoji: "😐" },
  { value: "embacado" as const, label: "Ficou embaçado", emoji: "😕" },
  { value: "afastou" as const, label: "Afastei a tela", emoji: "📱" },
];

export function ReadingTest({ onComplete, onBack, totalSteps, currentStep }: Props) {
  const [lastLine, setLastLine] = useState<number | null>(null);
  const [comfort, setComfort] = useState<ReadingTestResult["comfort"] | null>(null);

  const canSubmit = lastLine !== null && comfort !== null;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
          <div className="mb-5">
            <p className="text-xs text-primary font-heading font-semibold uppercase tracking-widest mb-1">
              Etapa {currentStep}/{totalSteps}
            </p>
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4.5 h-4.5 text-primary" />
              <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">
                Conforto para Leitura em Tela
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Toque na <strong>última linha</strong> que conseguiu ler na distância habitual.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 md:p-5 mb-5 space-y-2">
            {readingLines.map((line, i) => (
              <button
                key={i}
                onClick={() => setLastLine(i)}
                className={`w-full text-left px-3 py-2 rounded-xl border-2 transition-all duration-200 touch-target ${
                  lastLine === i
                    ? "border-primary bg-teal-light"
                    : lastLine !== null && i <= lastLine
                    ? "border-primary/15 bg-teal-light/20"
                    : "border-transparent hover:bg-secondary/50 active:bg-secondary"
                }`}
                style={{ fontSize: `${line.size}px`, lineHeight: 1.4 }}
              >
                <span className="text-muted-foreground/30 text-[10px] mr-1.5 font-mono">{i + 1}</span>
                {line.text}
              </button>
            ))}
          </div>

          {lastLine !== null && (
            <div className="mb-6 animate-scale-in">
              <p className="font-heading font-semibold text-sm text-foreground mb-3">
                Como foi a leitura?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {comfortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setComfort(opt.value)}
                    className={`px-3 py-3 rounded-2xl border-2 transition-all text-xs font-body text-center touch-target ${
                      comfort === opt.value
                        ? "border-primary/40 bg-teal-light text-foreground"
                        : "border-border bg-card text-muted-foreground active:bg-secondary/50"
                    }`}
                  >
                    <span className="text-xl block mb-1">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-muted-foreground/70 bg-secondary/50 rounded-xl p-3 mb-5">
            ⚠ Teste educativo. Resultados variam conforme dispositivo, brilho e distância.
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
            <Button
              onClick={() => canSubmit && onComplete({ lastLineRead: lastLine!, comfort: comfort! })}
              disabled={!canSubmit}
              className="flex-1 h-12 rounded-xl gradient-accent text-accent-foreground font-heading font-semibold"
            >
              Próximo <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
