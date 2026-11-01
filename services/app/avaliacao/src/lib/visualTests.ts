// ===== Reading Test =====
export interface ReadingTestResult {
  lastLineRead: number; // 0-6
  comfort: "confortavel" | "forcou" | "embacado" | "afastou";
}

export const readingLines = [
  { size: 24, text: "Visão clara é qualidade de vida" },
  { size: 20, text: "Seus olhos merecem atenção e cuidado diário" },
  { size: 16, text: "A leitura confortável depende de bons hábitos visuais" },
  { size: 13, text: "Textos menores exigem maior esforço de acomodação ocular" },
  { size: 11, text: "Pequenas letras podem revelar sinais de fadiga visual em telas digitais" },
  { size: 9, text: "A percepção de detalhes finos é um indicador importante do conforto para leitura de perto" },
  { size: 7, text: "Fontes muito reduzidas podem causar esforço acomodativo significativo especialmente após uso prolongado de dispositivos" },
];

export function scoreReadingTest(result: ReadingTestResult): number {
  // 0-100 scale
  const lineScore = Math.round((result.lastLineRead / (readingLines.length - 1)) * 60);
  const comfortScore = result.comfort === "confortavel" ? 40 : result.comfort === "forcou" ? 20 : result.comfort === "embacado" ? 10 : 5;
  return Math.min(100, lineScore + comfortScore);
}

// ===== Focus Test =====
export interface FocusTestResult {
  delayToFocus: boolean;
  feltEffort: boolean;
  blurry: boolean;
  nearWorse: boolean;
  farWorse: boolean;
}

export function scoreFocusTest(result: FocusTestResult): number {
  const issues = [result.delayToFocus, result.feltEffort, result.blurry, result.nearWorse, result.farWorse].filter(Boolean).length;
  return Math.max(0, 100 - issues * 20);
}

// ===== Contrast Test =====
export interface ContrastTestResult {
  lastLevelSeen: number; // 0-7
}

export const contrastLevels = [
  { opacity: 1.0, label: "100%" },
  { opacity: 0.7, label: "70%" },
  { opacity: 0.5, label: "50%" },
  { opacity: 0.35, label: "35%" },
  { opacity: 0.25, label: "25%" },
  { opacity: 0.18, label: "18%" },
  { opacity: 0.12, label: "12%" },
  { opacity: 0.07, label: "7%" },
];

export function scoreContrastTest(result: ContrastTestResult): number {
  return Math.round((result.lastLevelSeen / (contrastLevels.length - 1)) * 100);
}

// ===== Amsler Grid Test =====
export interface AmslerTestResult {
  straightLines: boolean;
  wavyLines: boolean;
  blurredArea: boolean;
  missingSpot: boolean;
  discomfort: boolean;
}

export function scoreAmslerTest(result: AmslerTestResult): number {
  let score = 100;
  if (!result.straightLines) score -= 15;
  if (result.wavyLines) score -= 25;
  if (result.blurredArea) score -= 25;
  if (result.missingSpot) score -= 25;
  if (result.discomfort) score -= 10;
  return Math.max(0, score);
}

export function amslerNeedsAlert(result: AmslerTestResult): boolean {
  return result.wavyLines || result.blurredArea || result.missingSpot;
}

// ===== Overall Scoring =====
export interface AllTestResults {
  reading?: ReadingTestResult;
  focus?: FocusTestResult;
  contrast?: ContrastTestResult;
  amsler?: AmslerTestResult;
}

export interface VisualTestScores {
  reading: number;
  focus: number;
  contrast: number;
  amsler: number;
  overall: number;
}

export function calculateTestScores(tests: AllTestResults): VisualTestScores {
  const reading = tests.reading ? scoreReadingTest(tests.reading) : 100;
  const focus = tests.focus ? scoreFocusTest(tests.focus) : 100;
  const contrast = tests.contrast ? scoreContrastTest(tests.contrast) : 100;
  const amsler = tests.amsler ? scoreAmslerTest(tests.amsler) : 100;
  const overall = Math.round((reading + focus + contrast + amsler) / 4);
  return { reading, focus, contrast, amsler, overall };
}
