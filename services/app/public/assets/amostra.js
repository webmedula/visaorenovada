/*
 * Amostra gratuita do app: só o exercício "Piscar consciente".
 * O conteúdo completo (8 exercícios e o plano de 7 dias) fica em /conteudo/exercicios.js,
 * protegido pelo código de acesso do app (APP_CODIGO).
 */
window.VR_GRUPOS = [
  {
    "id": "relax",
    "nome": "Relaxamento e lubrificação",
    "desc": "A base para aliviar a fadiga imediata causada pelo uso de telas."
  },
  {
    "id": "circ",
    "nome": "Circulação e mobilidade",
    "desc": "Melhoram o fluxo sanguíneo e a flexibilidade dos músculos que movem os olhos."
  },
  {
    "id": "forca",
    "nome": "Fortalecimento e coordenação",
    "desc": "Treinam os olhos para se adaptarem a diferentes distâncias e formas."
  }
];
window.VR_EXERCICIOS = [
  {
    "id": "piscar",
    "grupo": "relax",
    "nome": "Piscar consciente",
    "ico": "😌",
    "min": 1,
    "tag": "Relaxamento",
    "resumo": "Piscar é a maneira mais rápida de relaxar os olhos. Pratique de 30 a 60 segundos, várias vezes ao dia.",
    "beneficio": "Piscar suavemente regula a circulação e garante a lubrificação que a tela faz você esquecer.",
    "steps": [
      {
        "t": "Prepare-se",
        "d": "Sente-se confortavelmente, ombros soltos. Olhe para um ponto neutro à sua frente.",
        "s": 8,
        "scene": "breathe",
        "spd": "6s"
      },
      {
        "t": "Pisque suavemente",
        "d": "Feche e abra os olhos de forma leve e completa, no ritmo do círculo. Sem apertar.",
        "s": 45,
        "scene": "blink",
        "spd": "3s"
      },
      {
        "t": "Descanse",
        "d": "Feche os olhos por alguns segundos e respire fundo. Perceba os olhos mais úmidos.",
        "s": 10,
        "scene": "dark"
      }
    ]
  }
];
window.VR_PLANO = [];
