import { AlertTriangle, ArrowRight, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onAccept: () => void;
  onBack: () => void;
}

export function DisclaimerSection({ onAccept, onBack }: Props) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-warm-light flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-warm" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">Aviso Importante</h2>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground font-body leading-relaxed">
            <p>
              Esta ferramenta é uma <strong className="text-foreground">triagem visual educativa</strong> desenvolvida como material complementar ao livro <em>Visão Renovada</em>.
            </p>
            <p>
              Ela <strong className="text-foreground">não substitui</strong> a consulta com um oftalmologista ou qualquer outro profissional de saúde. Os resultados são sugestivos e têm caráter exclusivamente educacional.
            </p>
            <p>
              Se você apresenta sintomas visuais, <strong className="text-foreground">consulte um oftalmologista</strong> para avaliação profissional completa.
            </p>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-secondary/80 p-4">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Os resultados podem variar conforme brilho da tela, iluminação do ambiente, distância de uso e qualidade do dispositivo.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Voltar
            </Button>
            <Button onClick={onAccept} className="flex-1 h-12 rounded-xl gradient-accent text-accent-foreground font-heading font-semibold">
              Li e Compreendo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
