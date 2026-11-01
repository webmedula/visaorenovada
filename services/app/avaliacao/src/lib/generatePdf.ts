import jsPDF from "jspdf";
import { CategoryResult, CategoryKey, categoryLabels } from "./questions";
import { VisualTestScores, AllTestResults, amslerNeedsAlert } from "./visualTests";
import { VisualProfile } from "./profileEngine";

interface PdfData {
  nome: string;
  idade: number;
  horasTela: number;
  usoPrincipal: string;
  catResults: Record<CategoryKey, CategoryResult>;
  testScores: VisualTestScores;
  tests: AllTestResults;
  visualProfile: VisualProfile;
  recommendations: string[];
}

export function generateResultPdf(data: PdfData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Header
  doc.setFillColor(15, 60, 90);
  doc.rect(0, 0, pageWidth, 45, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Autoavaliação Visual Inteligente", margin, 22);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Relatório de Triagem Visual Educativa", margin, 32);
  doc.setFontSize(9);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, margin, 40);

  y = 55;
  doc.setTextColor(30, 30, 30);

  // User info
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Dados do Participante", margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${data.nome}`, margin, y); y += 6;
  doc.text(`Idade: ${data.idade} anos`, margin, y); y += 6;
  doc.text(`Horas diárias de tela: ${data.horasTela}h`, margin, y); y += 6;
  doc.text(`Uso principal: ${data.usoPrincipal}`, margin, y); y += 12;

  // Profile
  doc.setFillColor(230, 245, 250);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, "F");
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 60, 90);
  doc.text(`${data.visualProfile.emoji} ${data.visualProfile.title}`, margin + 6, y + 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  const descLines = doc.splitTextToSize(data.visualProfile.description, contentWidth - 12);
  doc.text(descLines, margin + 6, y + 20);
  y += 38;

  // Test Scores
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Testes Visuais Interativos", margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const testLabels = [
    { label: "Leitura de Perto", score: data.testScores.reading },
    { label: "Alternância de Foco", score: data.testScores.focus },
    { label: "Percepção de Contraste", score: data.testScores.contrast },
    { label: "Grade de Amsler", score: data.testScores.amsler },
  ];
  for (const t of testLabels) {
    const levelText = t.score >= 75 ? "Bom" : t.score >= 50 ? "Moderado" : "Atenção";
    doc.text(`${t.label}: ${t.score}/100 — ${levelText}`, margin, y);
    y += 6;
  }
  y += 6;

  // Category scores
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resultados por Categoria — Questionário", margin, y);
  y += 8;

  const categories: CategoryKey[] = ["fadiga", "ressecamento", "sobrecarga", "foco", "noturna"];
  for (const cat of categories) {
    const r = data.catResults[cat];
    const color = r.level === "baixo" ? [34, 197, 94] : r.level === "moderado" ? [234, 179, 8] : [239, 68, 68];
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(categoryLabels[cat], margin, y);
    doc.setFont("helvetica", "normal");
    const levelText = r.level === "baixo" ? "Baixo" : r.level === "moderado" ? "Moderado" : "Elevado";
    doc.text(`${r.score}/${r.maxScore} — ${levelText}`, margin + 100, y);
    y += 3;
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(margin, y, contentWidth, 4, 2, 2, "F");
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(margin, y, (contentWidth * r.percentage) / 100, 4, 2, 2, "F");
    y += 10;
  }
  y += 4;

  // Check page break
  if (y > 200) { doc.addPage(); y = 20; }

  // Recommendations
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Recomendações Personalizadas", margin, y);
  y += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  for (const rec of data.recommendations) {
    if (y > 270) { doc.addPage(); y = 20; }
    const lines = doc.splitTextToSize(`• ${rec}`, contentWidth - 4);
    doc.text(lines, margin + 2, y);
    y += lines.length * 5 + 3;
  }
  y += 6;

  // Amsler alert
  if (data.tests.amsler && amslerNeedsAlert(data.tests.amsler)) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");
    doc.setFontSize(9);
    doc.setTextColor(180, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("⚠ Atenção — Grade de Amsler", margin + 4, y + 7);
    doc.setFont("helvetica", "normal");
    doc.text("Foram observados sinais que merecem avaliação com oftalmologista.", margin + 4, y + 13);
    doc.setTextColor(30, 30, 30);
    y += 24;
  }

  // Disclaimer
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFillColor(255, 245, 230);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "F");
  doc.setFontSize(8);
  doc.setTextColor(120, 80, 30);
  doc.setFont("helvetica", "bold");
  doc.text("⚠ Aviso Legal", margin + 4, y + 7);
  doc.setFont("helvetica", "normal");
  const disclaimer = "Esta triagem visual educativa não substitui diagnóstico ou orientação de um oftalmologista. Os resultados são sugestivos e podem variar conforme brilho da tela, iluminação, distância de uso e qualidade do dispositivo. Consulte um profissional para avaliação completa.";
  const dLines = doc.splitTextToSize(disclaimer, contentWidth - 8);
  doc.text(dLines, margin + 4, y + 13);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Autoavaliação Visual Inteligente — Visão Renovada (app.visaorenovada.com.br) — Material educativo", margin, 290);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin - 25, 290);
  }

  doc.save(`checkup-visual-${data.nome.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
