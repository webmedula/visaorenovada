import { CategoryKey, CategoryResult } from "./questions";
import { VisualTestScores, AllTestResults, amslerNeedsAlert } from "./visualTests";

export interface VisualProfile {
  id: string;
  title: string;
  description: string;
  emoji: string;
  alertLevel: "verde" | "amarelo" | "vermelho";
}

export function determineProfile(
  catResults: Record<CategoryKey, CategoryResult>,
  testScores: VisualTestScores,
  tests: AllTestResults
): VisualProfile {
  const amslerAlert = tests.amsler && amslerNeedsAlert(tests.amsler);
  const elevated = Object.values(catResults).filter((r) => r.level === "elevado").length;
  const moderate = Object.values(catResults).filter((r) => r.level === "moderado").length;

  if (amslerAlert) {
    return {
      id: "atencao-central",
      title: "Atenção à Visão Central",
      description: "Foram identificados sinais sugestivos de alterações na percepção visual central. Recomenda-se avaliação oftalmológica para investigação mais aprofundada.",
      emoji: "🔴",
      alertLevel: "vermelho",
    };
  }

  if (elevated >= 3 || testScores.overall < 40) {
    return {
      id: "sobrecarga-digital",
      title: "Perfil de Sobrecarga Digital",
      description: "Seus resultados sugerem sinais significativos de esforço visual. É muito importante adotar hábitos visuais saudáveis e consultar um oftalmologista para uma avaliação completa.",
      emoji: "🔴",
      alertLevel: "vermelho",
    };
  }

  if (catResults.foco.level === "elevado" || testScores.reading < 50) {
    return {
      id: "esforco-perto",
      title: "Sinais de Esforço para Foco de Perto",
      description: "Seus resultados indicam possíveis sinais compatíveis com dificuldade de acomodação para perto. Uma avaliação profissional pode ajudar a identificar a melhor solução para seu conforto.",
      emoji: "🟡",
      alertLevel: "amarelo",
    };
  }

  if (elevated >= 1 || moderate >= 3 || testScores.overall < 60) {
    return {
      id: "fadiga-moderada",
      title: "Fadiga Visual Moderada",
      description: "Alguns sinais indicam que seu conforto visual pode ser melhorado. Pequenas mudanças de hábito podem fazer grande diferença no seu dia a dia.",
      emoji: "🟡",
      alertLevel: "amarelo",
    };
  }

  if (catResults.noturna?.level !== "baixo") {
    return {
      id: "desconforto-telas",
      title: "Desconforto Ocular em Telas",
      description: "Foram identificados sinais de desconforto visual associados ao uso de telas, especialmente em condições de baixa iluminação. Ajustes simples na rotina podem trazer melhora significativa.",
      emoji: "🟡",
      alertLevel: "amarelo",
    };
  }

  if (moderate >= 1) {
    return {
      id: "prevencao",
      title: "Perfil de Prevenção Visual",
      description: "Você apresenta poucos sinais de desconforto visual, mas ainda há espaço para otimizar seus hábitos e prevenir problemas futuros.",
      emoji: "🟢",
      alertLevel: "verde",
    };
  }

  return {
    id: "conforto-excelente",
    title: "Conforto Visual Excelente",
    description: "Parabéns! Seus hábitos visuais parecem estar bem equilibrados. Continue mantendo boas práticas para preservar sua saúde ocular.",
    emoji: "✨",
    alertLevel: "verde",
  };
}

export function getRecommendations(
  catResults: Record<CategoryKey, CategoryResult>,
  testScores: VisualTestScores,
  tests: AllTestResults,
  profile: { horasTela: number; idade: number }
): string[] {
  const recs: string[] = [];

  if (catResults.fadiga.level !== "baixo") {
    recs.push("Pratique a regra 20-20-20: a cada 20 minutos, olhe para algo a 6 metros de distância por 20 segundos.");
    recs.push("Ajuste o brilho e contraste da tela para combinar com a iluminação do ambiente.");
  }

  if (catResults.ressecamento.level !== "baixo") {
    recs.push("Pisque conscientemente com mais frequência — ao menos 15 vezes por minuto ao usar telas.");
    recs.push("Considere o uso de colírios lubrificantes (lágrimas artificiais) sem conservantes, com orientação profissional.");
  }

  if (catResults.sobrecarga.level !== "baixo") {
    recs.push("Faça pausas programadas de 5 a 10 minutos a cada 60-90 minutos de uso contínuo de telas.");
    recs.push("Mantenha a tela a 50-70 cm dos olhos, com o topo na altura dos olhos ou levemente abaixo.");
  }

  if (catResults.foco.level !== "baixo" || testScores.reading < 60) {
    recs.push("Considere uma consulta com oftalmologista para avaliar possível necessidade de correção visual.");
    recs.push("Ao ler no celular, mantenha uma distância confortável de pelo menos 30-40 cm dos olhos.");
  }

  if (catResults.noturna.level !== "baixo") {
    recs.push("Evite o uso de telas pelo menos 1 hora antes de dormir para melhorar a qualidade do sono.");
    recs.push("Ative o filtro de luz azul ou modo noturno nos seus dispositivos a partir do final da tarde.");
  }

  if (testScores.focus < 60) {
    recs.push("Pratique exercícios de acomodação visual: alterne o foco entre objetos próximos (30 cm) e distantes (3+ metros) por 10 repetições, 2-3 vezes ao dia.");
    recs.push("Ao longo do dia, faça pausas para olhar por janelas e focar em objetos distantes por alguns segundos.");
  }

  if (testScores.contrast < 60) {
    recs.push("Melhore a iluminação do seu ambiente de trabalho — luz adequada pode melhorar significativamente a percepção de contraste.");
  }

  if (tests.amsler && amslerNeedsAlert(tests.amsler)) {
    recs.push("Seu resultado no teste da grade de Amsler sugere sinais que merecem investigação. Procure um oftalmologista para avaliação detalhada da visão central.");
  }

  if (profile.horasTela >= 8) {
    recs.push("Com mais de 8 horas diárias de tela, é fundamental manter hidratação adequada e alimentação rica em ômega-3, vitamina A e luteína.");
  }

  if (profile.idade >= 40) {
    recs.push("A partir dos 40 anos, exames oftalmológicos anuais são ainda mais importantes para monitorar a saúde ocular.");
  }

  if (recs.length === 0) {
    recs.push("Continue com seus bons hábitos visuais! Mantenha pausas regulares e iluminação adequada.");
    recs.push("Faça consultas oftalmológicas de rotina pelo menos uma vez ao ano.");
  }

  return recs;
}
