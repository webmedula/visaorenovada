import { Eye, Shield, ArrowRight, Activity, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="gradient-hero flex-1 flex items-center justify-center px-5 py-12 relative overflow-hidden">
        <div className="absolute top-16 right-6 w-72 h-72 rounded-full bg-primary/8 blur-3xl animate-float" />
        <div className="absolute bottom-16 left-6 w-56 h-56 rounded-full bg-accent/8 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="w-full max-w-lg text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-2 text-xs text-primary-foreground/70 mb-6 animate-fade-up backdrop-blur-sm font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bônus 2 do livro Visão Renovada</span>
          </div>

          <h1 className="font-heading text-[2.25rem] leading-[1.1] md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-4 animate-fade-up">
            Autoavaliação
            <br />
            <span className="text-teal-light">Visual Inteligente</span>
          </h1>

          <p className="text-base md:text-lg text-primary-foreground/75 max-w-md mx-auto mb-6 animate-fade-up-delay font-body leading-relaxed">
            Perguntas e testes visuais interativos para uma leitura inicial do seu perfil visual, com orientações práticas inspiradas no livro.
          </p>

          <div className="flex flex-col items-center gap-2 mb-8 text-xs text-primary-foreground/55 animate-fade-up-delay">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Sintomas</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Testes visuais</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Relatório</span>
            </div>
          </div>

          <Button
            onClick={onStart}
            size="lg"
            className="w-full sm:w-auto gradient-accent text-accent-foreground font-heading font-bold text-base px-10 py-6 rounded-2xl shadow-glow hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 animate-fade-up-delay-2"
          >
            Começar Análise
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <div className="flex items-center justify-center gap-5 mt-8 text-primary-foreground/45 text-xs animate-fade-up-delay-2">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Gratuito</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> ~8 min</span>
            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> PDF</span>
          </div>

          <p className="mt-6 text-xs text-primary-foreground/55 animate-fade-up-delay-3">
            <a href="/" className="underline underline-offset-4 hover:text-primary-foreground">Ir para os exercícios guiados</a>
            {" · "}
            <a href="https://www.visaorenovada.com.br/" className="underline underline-offset-4 hover:text-primary-foreground">Conhecer o livro</a>
          </p>

          <div className="mt-6 px-5 py-3 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/8 backdrop-blur-sm animate-fade-up-delay-3">
            <p className="text-[11px] text-primary-foreground/45 font-body leading-relaxed">
              ⚠ Ferramenta educativa. Não substitui avaliação, diagnóstico ou tratamento oftalmológico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
