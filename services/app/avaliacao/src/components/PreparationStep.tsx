import { useState } from "react";
import { ArrowRight, ArrowLeft, Sun, Monitor, Glasses, Ruler, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onReady: () => void;
  onBack: () => void;
}

const checklistItems = [
  { id: "ambiente", icon: Sun, label: "Ambiente bem iluminado", tip: "Evite fazer o teste no escuro ou com luz na tela." },
  { id: "brilho", icon: Monitor, label: "Brilho da tela ajustado", tip: "Confortável, sem ser excessivo nem escuro demais." },
  { id: "oculos", icon: Glasses, label: "Usando óculos habituais", tip: "Se você usa óculos ou lentes, mantenha-os." },
  { id: "distancia", icon: Ruler, label: "Distância confortável de leitura", tip: "~35 cm (celular) ou ~60 cm (computador)." },
];

export function PreparationStep({ onReady, onBack }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allChecked = checklistItems.every((item) => checked[item.id]);
  const checkedCount = checklistItems.filter((item) => checked[item.id]).length;

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
          <div className="mb-6">
            <p className="text-xs text-primary font-heading font-semibold uppercase tracking-widest mb-2">Preparação</p>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">Antes de Começar</h2>
            <p className="text-sm text-muted-foreground mt-1.5 font-body">
              Prepare seu ambiente para resultados mais consistentes.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-5">
            {checklistItems.map((item, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${checked[item.id] ? "bg-primary" : "bg-secondary"}`} />
            ))}
          </div>

          <div className="space-y-2.5 mb-6">
            {checklistItems.map((item) => {
              const Icon = item.icon;
              const isChecked = !!checked[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 transition-all duration-200 text-left touch-target ${
                    isChecked
                      ? "border-primary/40 bg-teal-light/60"
                      : "border-border bg-card hover:border-primary/20 active:bg-secondary/50"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isChecked ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {isChecked ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-heading font-semibold text-sm leading-tight ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5 leading-snug">{item.tip}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl bg-warm-light/60 border border-warm/15 p-3.5 mb-6">
            <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
              💡 Em alguns testes, será solicitado que cubra um olho por vez. Os resultados podem variar conforme condições do ambiente e do dispositivo.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
            <Button onClick={onReady} disabled={!allChecked} className="flex-1 h-12 rounded-xl gradient-accent text-accent-foreground font-heading font-semibold">
              {allChecked ? "Pronto para Começar" : `${checkedCount}/${checklistItems.length} itens`}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
