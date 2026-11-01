import { useState } from "react";
import { ArrowRight, ArrowLeft, Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contrastLevels, ContrastTestResult } from "@/lib/visualTests";

interface Props {
  onComplete: (result: ContrastTestResult) => void;
  onBack: () => void;
  totalSteps: number;
  currentStep: number;
}

const testChars = ["A", "E", "7", "M", "3", "R", "5", "G"];

export function ContrastTest({ onComplete, onBack, totalSteps, currentStep }: Props) {
  const [lastLevel, setLastLevel] = useState<number | null>(null);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
          <div className="mb-5">
            <p className="text-xs text-primary font-heading font-semibold uppercase tracking-widest mb-1">
              Etapa {currentStep}/{totalSteps}
            </p>
            <div className="flex items-center gap-2 mb-1.5">
              <Contrast className="w-4.5 h-4.5 text-primary" />
              <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">
                Percepção de Contraste
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Toque no <strong>último nível</strong> que consegue ler com segurança.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 mb-5">
            <div className="space-y-2">
              {contrastLevels.map((level, i) => (
                <button
                  key={i}
                  onClick={() => setLastLevel(i)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 touch-target ${
                    lastLevel === i
                      ? "border-primary bg-teal-light"
                      : lastLevel !== null && i <= lastLevel
                      ? "border-primary/15 bg-teal-light/20"
                      : "border-transparent hover:bg-secondary/50"
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground/50 font-mono w-7 shrink-0 text-right">
                    {level.label}
                  </span>
                  <span
                    className="text-xl md:text-2xl font-bold font-mono tracking-[0.25em]"
                    style={{ color: `rgba(30, 30, 30, ${level.opacity})` }}
                  >
                    {testChars[i]}  {testChars[(i + 3) % 8]}  {testChars[(i + 5) % 8]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground/70 bg-secondary/50 rounded-xl p-3 mb-5">
            ⚠ Resultado influenciado por brilho da tela, iluminação e qualidade do dispositivo.
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
            <Button
              onClick={() => lastLevel !== null && onComplete({ lastLevelSeen: lastLevel })}
              disabled={lastLevel === null}
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
