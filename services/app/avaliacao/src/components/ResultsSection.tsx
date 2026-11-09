import { useEffect } from "react";
import { Download, RotateCcw, BookOpen, CheckCircle2, AlertCircle, AlertTriangle, Shield, Eye, Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryKey, categoryLabels, CategoryResult } from "@/lib/questions";
import { VisualTestScores, AllTestResults, amslerNeedsAlert } from "@/lib/visualTests";
import { VisualProfile, getRecommendations } from "@/lib/profileEngine";
import { generateResultPdf } from "@/lib/generatePdf";
import { UserProfile } from "@/components/ProfileForm";

interface Props {
  catResults: Record<CategoryKey, CategoryResult>;
  testScores: VisualTestScores;
  tests: AllTestResults;
  visualProfile: VisualProfile;
  profile: UserProfile;
  onRestart: () => void;
}

const levelConfig = {
  baixo: { color: "text-emerald-600", bg: "bg-emerald-50", barColor: "bg-emerald-500", icon: CheckCircle2, label: "Baixo" },
  moderado: { color: "text-amber-600", bg: "bg-amber-50", barColor: "bg-amber-500", icon: AlertCircle, label: "Moderado" },
  elevado: { color: "text-red-500", bg: "bg-red-50", barColor: "bg-red-500", icon: AlertTriangle, label: "Elevado" },
};

function ScoreCircle({ score, label, icon }: { score: number; label: string; icon: string }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "stroke-emerald-500" : score >= 50 ? "stroke-amber-500" : "stroke-red-500";
  const textColor = score >= 75 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-500";
  const labelText = score >= 75 ? "Bom" : score >= 50 ? "Moderado" : "Atenção";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 md:w-24 md:h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
          <circle
            cx="48" cy="48" r="40" fill="none"
            className={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg md:text-xl font-heading font-bold text-foreground">{score}</span>
        </div>
      </div>
      <span className="text-lg mt-1">{icon}</span>
      <span className="text-xs font-heading font-semibold text-foreground mt-0.5">{label}</span>
      <span className={`text-[10px] font-semibold ${textColor}`}>{labelText}</span>
    </div>
  );
}

const educationalContent = [
  { title: "Regra 20-20-20", text: "A cada 20 minutos de tela, olhe para algo a 6 metros por 20 segundos para relaxar o músculo ciliar.", icon: "👁️" },
  { title: "Piscadas Conscientes", text: "Pisque 15-20 vezes por minuto ao usar telas para manter a lubrificação ocular adequada.", icon: "💧" },
  { title: "Iluminação Adequada", text: "O brilho da tela deve ser similar ao do ambiente. Use iluminação indireta para menos esforço.", icon: "💡" },
  { title: "Distância e Postura", text: "Tela a 50-70 cm dos olhos. Celular a pelo menos 30 cm. Topo da tela na altura dos olhos.", icon: "📏" },
  { title: "Modo Noturno", text: "Ative filtros de luz azul após o pôr do sol. Evite telas 1h antes de dormir.", icon: "🌙" },
  { title: "Alimentação Visual", text: "Ômega-3, vitamina A e luteína (cenoura, espinafre, peixes) beneficiam a saúde ocular.", icon: "🥗" },
];

export function ResultsSection({ catResults, testScores, tests, visualProfile, profile, onRestart }: Props) {
  // Meta Pixel: marca quem chegou ao resultado (público para anúncios e medição do anúncio B)
  useEffect(() => {
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    w.fbq?.("trackCustom", "AvaliacaoConcluida");
  }, []);

  const recommendations = getRecommendations(catResults, testScores, tests, { horasTela: profile.horasTela, idade: profile.idade });
  const categories: CategoryKey[] = ["fadiga", "ressecamento", "sobrecarga", "foco", "noturna"];
  const date = new Date().toLocaleDateString("pt-BR");
  const needsAmslerAlert = tests.amsler && amslerNeedsAlert(tests.amsler);

  const handleDownloadPdf = () => {
    generateResultPdf({
      nome: profile.nome,
      idade: profile.idade,
      horasTela: profile.horasTela,
      usoPrincipal: profile.usoPrincipal,
      catResults,
      testScores,
      tests,
      visualProfile,
      recommendations,
    });
  };

  const profileGradient = visualProfile.alertLevel === "vermelho"
    ? "gradient-result-red"
    : visualProfile.alertLevel === "amarelo"
    ? "gradient-result-yellow"
    : "gradient-result-green";

  const profileBorder = visualProfile.alertLevel === "vermelho"
    ? "border-red-200"
    : visualProfile.alertLevel === "amarelo"
    ? "border-amber-200"
    : "border-emerald-200";

  return (
    <div className="min-h-[100dvh] bg-background px-5 py-8">
      <div className="w-full max-w-2xl mx-auto space-y-6">

        {/* ===== PROFILE CARD ===== */}
        <div className={`rounded-3xl shadow-premium p-7 md:p-10 text-center animate-fade-up ${profileGradient} border ${profileBorder}`}>
          <p className="text-xs text-primary font-heading font-semibold uppercase tracking-widest mb-4">
            Resultado da Triagem Visual Educativa
          </p>
          <div className="text-5xl mb-3">{visualProfile.emoji}</div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground mb-3 leading-tight">
            {visualProfile.title}
          </h2>
          <p className="text-sm text-muted-foreground font-body max-w-md mx-auto leading-relaxed">
            {visualProfile.description}
          </p>
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground/70 bg-background/50 rounded-2xl px-4 py-2.5">
            <span className="font-medium text-foreground">{profile.nome}</span>
            <span>•</span>
            <span>{profile.idade} anos</span>
            <span>•</span>
            <span>{profile.horasTela}h tela/dia</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>

        {/* ===== SAFETY ALERT ===== */}
        {(visualProfile.alertLevel === "vermelho" || needsAmslerAlert) && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-5 flex items-start gap-3 animate-fade-up">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-bold text-sm text-red-600 mb-1">Recomendação Importante</p>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                Seu resultado sugere sinais que merecem avaliação com oftalmologista. Esta ferramenta não fornece diagnóstico, mas pode indicar a necessidade de investigação profissional.
              </p>
            </div>
          </div>
        )}

        {/* ===== TEST SCORES - CIRCLES ===== */}
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10 animate-fade-up-delay">
          <h3 className="font-heading text-base font-bold text-foreground mb-6 flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-primary" />
            Testes Visuais Interativos
          </h3>
          <div className="grid grid-cols-4 gap-2">
            <ScoreCircle score={testScores.reading} label="Leitura" icon="📖" />
            <ScoreCircle score={testScores.focus} label="Foco" icon="🎯" />
            <ScoreCircle score={testScores.contrast} label="Contraste" icon="🔲" />
            <ScoreCircle score={testScores.amsler} label="Amsler" icon="🔳" />
          </div>
          <div className="mt-5 text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/60 rounded-2xl px-4 py-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-bold text-foreground">Score geral: {testScores.overall}/100</span>
            </div>
          </div>
        </div>

        {/* ===== CATEGORY SCORES ===== */}
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10 animate-fade-up-delay-2">
          <h3 className="font-heading text-base font-bold text-foreground mb-6 flex items-center gap-2">
            <Eye className="w-4.5 h-4.5 text-primary" />
            Questionário — Por Categoria
          </h3>
          <div className="space-y-5">
            {categories.map((cat) => {
              const r = catResults[cat];
              const config = levelConfig[r.level];
              const Icon = config.icon;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-heading font-semibold text-sm text-foreground">{categoryLabels[cat]}</span>
                    <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}>
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-1000 ease-out ${config.barColor}`} style={{ width: `${r.percentage}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{r.score}/{r.maxScore} pontos</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== RECOMMENDATIONS ===== */}
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10 animate-fade-up-delay-3">
          <h3 className="font-heading text-base font-bold text-foreground mb-5">
            🎯 Recomendações Personalizadas
          </h3>
          <div className="space-y-2.5">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 items-start p-4 rounded-2xl bg-teal-light/40 border border-primary/8">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground font-body leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== EDUCATIONAL ===== */}
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-4.5 h-4.5 text-primary" />
            <h3 className="font-heading text-base font-bold text-foreground">Saúde Visual — Saiba Mais</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {educationalContent.map((item, i) => (
              <div key={i} className="p-4 rounded-2xl border border-border bg-card hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{item.icon}</span>
                  <h4 className="font-heading font-bold text-sm text-foreground">{item.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DISCLAIMER ===== */}
        <div className="rounded-2xl bg-warm-light/70 border border-warm/15 p-5">
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-warm shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
              <strong className="text-foreground">Aviso Legal:</strong> Esta triagem visual educativa não substitui consulta com oftalmologista. Os resultados são sugestivos e podem variar conforme brilho da tela, iluminação, distância de uso e qualidade do dispositivo.
            </p>
          </div>
        </div>

        {/* ===== PRÓXIMO PASSO: LIVRO ===== */}
        <div className="glass-card rounded-3xl shadow-premium p-7 md:p-10 border-2 border-primary/20">
          <div className="flex items-center gap-2 text-primary mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-heading font-bold uppercase tracking-wide">Próximo passo</span>
          </div>
          <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-2">Cuide dos seus olhos no dia a dia com o livro Visão Renovada</h3>
          <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
            Este resultado é só o começo. No livro você encontra 7 capítulos com hábitos, pausas e exercícios simples para o conforto visual, mais 3 bônus e o app que guia os exercícios passo a passo, com cronômetro e plano de 7 dias.
          </p>
          <ul className="text-sm text-foreground font-body space-y-1.5 mb-5">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Livro digital (PDF) com 7 capítulos</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />3 bônus e acesso ao app de exercícios</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />R$ 37, pagamento único, no cartão, boleto ou Pix</li>
          </ul>
          <Button asChild className="w-full h-14 rounded-2xl gradient-accent text-accent-foreground font-heading font-bold text-base shadow-glow">
            <a href="https://pay.kiwify.com.br/FjvsV5c">Quero o livro por R$ 37</a>
          </Button>
          <div className="flex flex-col sm:flex-row gap-3 mt-3 text-center text-sm font-body">
            <a href="https://www.visaorenovada.com.br/" className="flex-1 text-muted-foreground underline underline-offset-4 hover:text-foreground">Ver tudo o que vem no livro</a>
            <a href="/" className="flex-1 text-muted-foreground underline underline-offset-4 hover:text-foreground">Já tenho o livro: abrir o app</a>
          </div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex flex-col gap-3 pb-8">
          <Button onClick={handleDownloadPdf} className="w-full h-14 rounded-2xl gradient-accent text-accent-foreground font-heading font-bold text-base shadow-glow">
            <Download className="mr-2 w-5 h-5" />
            Baixar Relatório em PDF
          </Button>
          <Button variant="outline" onClick={onRestart} className="w-full h-12 rounded-2xl font-heading font-semibold">
            <RotateCcw className="mr-2 w-4 h-4" />
            Refazer Análise
          </Button>
        </div>
      </div>
    </div>
  );
}
