import { useState } from "react";
import { ArrowRight, ArrowLeft, User, Clock, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface UserProfile {
  nome: string;
  idade: number;
  horasTela: number;
  usoPrincipal: string;
}

interface Props {
  onSubmit: (profile: UserProfile) => void;
  onBack: () => void;
}

const usosOptions = [
  { label: "💻 Trabalho no computador", value: "Trabalho no computador" },
  { label: "📱 Redes sociais / celular", value: "Redes sociais / celular" },
  { label: "📚 Estudos online", value: "Estudos online" },
  { label: "🎮 Jogos / entretenimento", value: "Jogos / entretenimento" },
  { label: "🔄 Misto (vários usos)", value: "Misto (vários usos)" },
];

export function ProfileForm({ onSubmit, onBack }: Props) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [horasTela, setHorasTela] = useState("");
  const [usoPrincipal, setUsoPrincipal] = useState("");

  const canSubmit = nome.trim() && idade && horasTela && usoPrincipal;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ nome: nome.trim(), idade: Number(idade), horasTela: Number(horasTela), usoPrincipal });
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
          <div className="mb-6">
            <p className="text-xs text-primary font-heading font-semibold uppercase tracking-widest mb-2">Etapa 3 de 8</p>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">Seus Dados</h2>
            <p className="text-sm text-muted-foreground mt-1.5">Para personalizar seus resultados.</p>
          </div>

          <div className="space-y-5">
            <div>
              <Label className="flex items-center gap-2 mb-2 font-heading font-semibold text-sm">
                <User className="w-4 h-4 text-primary" /> Seu nome
              </Label>
              <Input placeholder="Ex: Maria Silva" value={nome} onChange={(e) => setNome(e.target.value)} className="h-12 rounded-xl text-base" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center gap-2 mb-2 font-heading font-semibold text-sm">
                  <User className="w-4 h-4 text-primary" /> Idade
                </Label>
                <Input type="number" placeholder="35" min={10} max={100} value={idade} onChange={(e) => setIdade(e.target.value)} className="h-12 rounded-xl text-base" />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-2 font-heading font-semibold text-sm">
                  <Clock className="w-4 h-4 text-primary" /> Horas/dia
                </Label>
                <Input type="number" placeholder="8" min={0} max={24} value={horasTela} onChange={(e) => setHorasTela(e.target.value)} className="h-12 rounded-xl text-base" />
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2.5 font-heading font-semibold text-sm">
                <Monitor className="w-4 h-4 text-primary" /> Uso principal
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {usosOptions.map((uso) => (
                  <button
                    key={uso.value}
                    onClick={() => setUsoPrincipal(uso.value)}
                    className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 font-body text-sm touch-target ${
                      usoPrincipal === uso.value
                        ? "border-primary/40 bg-teal-light text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/20 active:bg-secondary/50"
                    }`}
                  >
                    {uso.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit} className="flex-1 h-12 rounded-xl gradient-accent text-accent-foreground font-heading font-semibold">
              Continuar
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
