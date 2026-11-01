export interface Question {
  id: string;
  text: string;
  category: CategoryKey;
  options: { label: string; value: number }[];
}

export type CategoryKey = "fadiga" | "ressecamento" | "sobrecarga" | "foco" | "noturna";

export const categoryLabels: Record<CategoryKey, string> = {
  fadiga: "Fadiga Ocular Digital",
  ressecamento: "Ressecamento Ocular",
  sobrecarga: "Desconforto ao Usar Telas",
  foco: "Esforço para Foco de Perto",
  noturna: "Sobrecarga Visual Noturna",
};

export const categoryDescriptions: Record<CategoryKey, string> = {
  fadiga: "Sinais de cansaço visual causado pelo uso prolongado de dispositivos digitais.",
  ressecamento: "Indicadores de desconforto relacionados à secura ocular.",
  sobrecarga: "Impactos da exposição prolongada à luz de telas no bem-estar visual.",
  foco: "Possíveis sinais de dificuldade de acomodação visual para perto.",
  noturna: "Sinais de desconforto visual associados ao uso de telas em ambientes escuros ou à noite.",
};

const scaleOptions = [
  { label: "Nunca", value: 0 },
  { label: "Raramente", value: 1 },
  { label: "Às vezes", value: 2 },
  { label: "Frequentemente", value: 3 },
  { label: "Quase sempre", value: 4 },
];

export const questions: Question[] = [
  // Fadiga Ocular Digital
  { id: "f1", text: "Com que frequência você sente cansaço nos olhos após usar telas?", category: "fadiga", options: scaleOptions },
  { id: "f2", text: "Você sente dor de cabeça ao final do dia de trabalho em telas?", category: "fadiga", options: scaleOptions },
  { id: "f3", text: "Seus olhos ficam avermelhados após longos períodos de tela?", category: "fadiga", options: scaleOptions },
  // Ressecamento Ocular
  { id: "r1", text: "Com que frequência seus olhos ficam secos ou com sensação de areia?", category: "ressecamento", options: scaleOptions },
  { id: "r2", text: "Você sente necessidade de piscar com mais força ou mais vezes?", category: "ressecamento", options: scaleOptions },
  { id: "r3", text: "Seus olhos lacrimejam excessivamente em ambientes com ar-condicionado?", category: "ressecamento", options: scaleOptions },
  // Desconforto ao Usar Telas
  { id: "s1", text: "Você sente dificuldade em focar após trocar de tela (celular para computador)?", category: "sobrecarga", options: scaleOptions },
  { id: "s2", text: "Você sente sensibilidade à luz após usar telas por muito tempo?", category: "sobrecarga", options: scaleOptions },
  { id: "s3", text: "Você percebe desconforto ocular ao trabalhar em ambientes com iluminação artificial intensa?", category: "sobrecarga", options: scaleOptions },
  // Esforço para Foco de Perto
  { id: "p1", text: "Você precisa afastar o celular para ler textos pequenos?", category: "foco", options: scaleOptions },
  { id: "p2", text: "Letras pequenas ficam embaçadas especialmente no final do dia?", category: "foco", options: scaleOptions },
  { id: "p3", text: "Você sente que sua visão de perto piorou nos últimos anos?", category: "foco", options: scaleOptions },
  // Sobrecarga Visual Noturna
  { id: "n1", text: "Você usa telas antes de dormir e sente dificuldade para pegar no sono?", category: "noturna", options: scaleOptions },
  { id: "n2", text: "Seus olhos ficam mais cansados ou ardendo ao usar telas à noite?", category: "noturna", options: scaleOptions },
  { id: "n3", text: "Você percebe halos ou brilho excessivo em luzes ao dirigir à noite após usar telas?", category: "noturna", options: scaleOptions },
];

export interface CategoryResult {
  score: number;
  maxScore: number;
  percentage: number;
  level: "baixo" | "moderado" | "elevado";
  label: string;
  description: string;
}

export function calculateCategoryResults(answers: Record<string, number>): Record<CategoryKey, CategoryResult> {
  const categories: CategoryKey[] = ["fadiga", "ressecamento", "sobrecarga", "foco", "noturna"];
  const results = {} as Record<CategoryKey, CategoryResult>;

  for (const cat of categories) {
    const catQuestions = questions.filter((q) => q.category === cat);
    const maxScore = catQuestions.length * 4;
    const score = catQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const percentage = Math.round((score / maxScore) * 100);
    const level = percentage <= 33 ? "baixo" : percentage <= 66 ? "moderado" : "elevado";

    results[cat] = { score, maxScore, percentage, level, label: categoryLabels[cat], description: categoryDescriptions[cat] };
  }

  return results;
}
