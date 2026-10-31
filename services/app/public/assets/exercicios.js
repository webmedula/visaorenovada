/*
 * Conteúdo do app: exercícios e plano de 7 dias.
 * Fonte: livro "Visão Renovada", Dr. Ethan Cole (Capítulo 4: Guia Prático de
 * Exercícios Oculares, e Bônus 1: Plano de 7 Dias).
 *
 * Cada passo (steps) tem:
 *   t     título curto mostrado em destaque
 *   d     instrução
 *   s     duração em segundos
 *   scene animação de apoio: 'breathe' | 'dir-h' | 'dir-v' | 'dir-diag' | 'dir-circle' |
 *         'dir-eight' | 'dir-tri' | 'nearfar' | 'blink' | 'dark' | null
 *   spd   velocidade da animação (ex.: '4s')
 */
window.VR_GRUPOS = [
  { id: 'relax', nome: 'Relaxamento e lubrificação', desc: 'A base para aliviar a fadiga imediata causada pelo uso de telas.' },
  { id: 'circ', nome: 'Circulação e mobilidade', desc: 'Melhoram o fluxo sanguíneo e a flexibilidade dos músculos que movem os olhos.' },
  { id: 'forca', nome: 'Fortalecimento e coordenação', desc: 'Treinam os olhos para se adaptarem a diferentes distâncias e formas.' }
];

window.VR_EXERCICIOS = [
  /* ---------- 1. Relaxamento e lubrificação ---------- */
  {
    id: 'piscar',
    grupo: 'relax',
    nome: 'Piscar consciente',
    ico: '😌',
    min: 1,
    tag: 'Relaxamento',
    resumo: 'Piscar é a maneira mais rápida de relaxar os olhos. Pratique de 30 a 60 segundos, várias vezes ao dia.',
    beneficio: 'Piscar suavemente regula a circulação e garante a lubrificação que a tela faz você esquecer.',
    steps: [
      { t: 'Prepare-se', d: 'Sente-se confortavelmente, ombros soltos. Olhe para um ponto neutro à sua frente.', s: 8, scene: 'breathe', spd: '6s' },
      { t: 'Pisque suavemente', d: 'Feche e abra os olhos de forma leve e completa, no ritmo do círculo. Sem apertar.', s: 45, scene: 'blink', spd: '3s' },
      { t: 'Descanse', d: 'Feche os olhos por alguns segundos e respire fundo. Perceba os olhos mais úmidos.', s: 10, scene: 'dark' }
    ]
  },
  {
    id: 'palming',
    grupo: 'relax',
    nome: 'Palming (enconchamento)',
    ico: '🤲',
    min: 4,
    tag: 'Relaxamento',
    resumo: 'Esfregue as palmas até aquecê-las e cubra os olhos fechados, em escuridão total, respirando fundo.',
    beneficio: 'A escuridão total e o calor das mãos relaxam o sistema nervoso e a musculatura ao redor dos olhos.',
    steps: [
      { t: 'Aqueça as mãos', d: 'Esfregue as palmas uma na outra até sentir calor.', s: 15, scene: 'breathe', spd: '3s' },
      { t: 'Cubra os olhos', d: 'Apoie os cotovelos na mesa e cubra os olhos fechados com as palmas em concha, sem pressionar. Não deve entrar luz.', s: 15, scene: 'dark' },
      { t: 'Respire profundamente', d: 'Inspire pelo nariz em 4 tempos e solte devagar em 6. Imagine um preto profundo. Fique de 2 a 5 minutos.', s: 150, scene: 'dark' },
      { t: 'Volte devagar', d: 'Afaste as mãos ainda com os olhos fechados. Abra-os lentamente e pisque algumas vezes.', s: 15, scene: 'breathe', spd: '8s' }
    ]
  },
  {
    id: 'fechar-abrir',
    grupo: 'relax',
    nome: 'Fechar e abrir com pressão',
    ico: '👁️',
    min: 2,
    tag: 'Lubrificação',
    resumo: 'Feche os olhos bem apertados por 3 a 5 segundos e abra completamente. Repita sete vezes.',
    beneficio: 'Alternar pressão e abertura aumenta a circulação e relaxa a musculatura das pálpebras.',
    steps: [
      { t: 'Posição', d: 'Sente-se com a coluna ereta e o rosto relaxado. Vamos fazer 7 repetições.', s: 6, scene: 'breathe', spd: '6s' },
      { t: 'Repetição 1 de 7', d: 'Feche os olhos bem apertados por 4 segundos... e abra completamente.', s: 8, scene: 'blink', spd: '8s' },
      { t: 'Repetição 2 de 7', d: 'Aperte... e abra bem, olhando para a frente.', s: 8, scene: 'blink', spd: '8s' },
      { t: 'Repetição 3 de 7', d: 'Aperte... e abra. Respire normalmente.', s: 8, scene: 'blink', spd: '8s' },
      { t: 'Repetição 4 de 7', d: 'Aperte... e abra. Mantenha os ombros soltos.', s: 8, scene: 'blink', spd: '8s' },
      { t: 'Repetição 5 de 7', d: 'Aperte... e abra. Sinta o calor nas pálpebras.', s: 8, scene: 'blink', spd: '8s' },
      { t: 'Repetição 6 de 7', d: 'Aperte... e abra.', s: 8, scene: 'blink', spd: '8s' },
      { t: 'Repetição 7 de 7', d: 'Última: aperte... e abra bem.', s: 8, scene: 'blink', spd: '8s' },
      { t: 'Descanse', d: 'Feche os olhos suavemente e respire fundo duas vezes.', s: 10, scene: 'dark' }
    ]
  },

  /* ---------- 2. Circulação e mobilidade ---------- */
  {
    id: 'giro-cabeca',
    grupo: 'circ',
    nome: 'Giro de cabeça com foco fixo',
    ico: '🔄',
    min: 3,
    tag: 'Circulação',
    resumo: 'Gire a cabeça lentamente em círculos enquanto mantém o olhar fixo em um ponto à frente.',
    beneficio: 'Aumenta a circulação e treina a estabilidade visual: a cabeça se move, o olhar fica parado.',
    steps: [
      { t: 'Escolha um ponto', d: 'Fixe o olhar em um ponto à sua frente, na altura dos olhos. Ele não sai do lugar durante todo o exercício.', s: 8, scene: 'breathe', spd: '10s' },
      { t: 'Círculos para a direita', d: 'Gire a cabeça devagar em círculos no sentido horário, 3 vezes, sem tirar os olhos do ponto.', s: 30, scene: 'dir-circle', spd: '10s' },
      { t: 'Círculos para a esquerda', d: 'Agora 3 círculos no sentido anti-horário. Movimento lento e confortável.', s: 30, scene: 'dir-circle', spd: '10s' },
      { t: 'Cima e baixo', d: 'Leve o queixo devagar para cima e para baixo, 3 vezes, mantendo o olhar fixo.', s: 24, scene: 'dir-v', spd: '8s' },
      { t: 'Lado a lado', d: 'Vire a cabeça devagar para a direita e para a esquerda, 3 vezes, sempre olhando o ponto.', s: 24, scene: 'dir-h', spd: '8s' },
      { t: 'Descanse', d: 'Volte ao centro, feche os olhos e respire. Se sentir tontura, fique sentado(a) um instante.', s: 12, scene: 'dark' }
    ]
  },
  {
    id: 'cardeais',
    grupo: 'circ',
    nome: 'Movimentos cardeais e diagonais',
    ico: '🧭',
    min: 3,
    tag: 'Mobilidade',
    resumo: 'Olhe para cima, baixo, direita e esquerda, e depois nas diagonais, segurando cada posição alguns segundos.',
    beneficio: 'Trabalha a amplitude de movimento dos seis músculos que movem cada olho.',
    steps: [
      { t: 'Posição', d: 'Cabeça parada, olhando para a frente. Mova só os olhos. Segure cada direção por 3 segundos.', s: 8, scene: 'breathe', spd: '6s' },
      { t: 'Cima e baixo', d: 'Olhe para cima, segure... para baixo, segure. Siga o ponto, 3 vezes.', s: 30, scene: 'dir-v', spd: '10s' },
      { t: 'Direita e esquerda', d: 'Olhe para a direita, segure... para a esquerda, segure. 3 vezes.', s: 30, scene: 'dir-h', spd: '10s' },
      { t: 'Pisque', d: 'Pisque algumas vezes e relaxe o olhar por um instante.', s: 6, scene: 'blink', spd: '2s' },
      { t: 'Diagonal 1', d: 'Canto superior direito, segure... canto inferior esquerdo, segure. 3 vezes.', s: 30, scene: 'dir-diag', spd: '10s' },
      { t: 'Diagonal 2', d: 'Canto superior esquerdo, segure... canto inferior direito, segure. 3 vezes.', s: 30, scene: 'dir-diag2', spd: '10s' },
      { t: 'Descanse', d: 'Feche os olhos e respire fundo. Sinta os olhos mais soltos.', s: 12, scene: 'dark' }
    ]
  },
  {
    id: 'temporas',
    grupo: 'circ',
    nome: 'Massagem nas têmporas',
    ico: '💆',
    min: 1,
    tag: 'Circulação',
    resumo: 'Aperte de leve as têmporas com os dedos por dois segundos e solte. Repita 5 vezes.',
    beneficio: 'Alivia a tensão da região dos olhos e favorece a circulação local.',
    steps: [
      { t: 'Mãos limpas', d: 'Apoie as pontas dos dedos nas têmporas, ao lado dos olhos. Nunca pressione o globo ocular.', s: 8, scene: 'breathe', spd: '6s' },
      { t: 'Pressione e solte', d: 'Aperte de leve por 2 segundos e solte. Acompanhe o círculo: cresce, aperta; encolhe, solta. 5 vezes.', s: 30, scene: 'breathe', spd: '6s' },
      { t: 'Círculos suaves', d: 'Termine com círculos lentos e leves nas têmporas.', s: 15, scene: 'dir-circle', spd: '5s' },
      { t: 'Descanse', d: 'Solte as mãos e feche os olhos por alguns segundos.', s: 8, scene: 'dark' }
    ]
  },

  /* ---------- 3. Fortalecimento e coordenação ---------- */
  {
    id: 'perto-longe',
    grupo: 'forca',
    nome: 'Mudança de foco (perto e longe)',
    ico: '🔭',
    min: 3,
    tag: 'Foco',
    resumo: 'Foque no polegar a 25 cm do rosto por 15 segundos e depois em um objeto a 6 metros por mais 15. Repita 5 vezes.',
    beneficio: 'Horas focando de perto deixam o foco "travado". Alternar distâncias devolve flexibilidade ao foco.',
    steps: [
      { t: 'Escolha o ponto distante', d: 'Olhe pela janela ou para o ponto mais longe da sala, a uns 6 metros. Estenda o braço com o polegar a 25 cm do rosto.', s: 10, scene: null },
      { t: 'Ciclo 1 de 5', d: 'Círculo grande: foque no polegar. Círculo pequeno: foque no ponto distante. 15 segundos cada.', s: 30, scene: 'nearfar', spd: '30s' },
      { t: 'Ciclo 2 de 5', d: 'Perto... e longe. Sem forçar, deixe o foco acontecer.', s: 30, scene: 'nearfar', spd: '30s' },
      { t: 'Ciclo 3 de 5', d: 'Perto... e longe. Pisque normalmente.', s: 30, scene: 'nearfar', spd: '30s' },
      { t: 'Ciclo 4 de 5', d: 'Perto... e longe. Ombros soltos.', s: 30, scene: 'nearfar', spd: '30s' },
      { t: 'Ciclo 5 de 5', d: 'Último: perto... e longe.', s: 30, scene: 'nearfar', spd: '30s' },
      { t: 'Descanse', d: 'Abaixe o braço, feche os olhos e respire fundo.', s: 10, scene: 'dark' }
    ]
  },
  {
    id: 'figuras',
    grupo: 'forca',
    nome: 'Figuras geométricas e o "oito"',
    ico: '♾️',
    min: 3,
    tag: 'Coordenação',
    resumo: 'Desenhe triângulos, círculos e o símbolo do infinito com o olhar, sem mexer a cabeça.',
    beneficio: 'Formas complexas treinam a coordenação fina dos músculos oculares.',
    steps: [
      { t: 'Posição', d: 'Cabeça parada. Siga o ponto só com os olhos, devagar e sem forçar.', s: 8, scene: 'breathe', spd: '6s' },
      { t: 'Triângulo', d: 'Acompanhe o ponto desenhando um triângulo. 3 voltas.', s: 36, scene: 'dir-tri', spd: '12s' },
      { t: 'Círculo', d: 'Agora um círculo completo, bem redondo. 3 voltas, depois inverta mentalmente o sentido.', s: 36, scene: 'dir-circle', spd: '12s' },
      { t: 'Pisque', d: 'Pisque algumas vezes e relaxe.', s: 6, scene: 'blink', spd: '2s' },
      { t: 'Oito deitado (∞)', d: 'Siga o ponto no desenho do infinito. 3 voltas.', s: 36, scene: 'dir-eight', spd: '12s' },
      { t: 'Desafio: trapézio', d: 'Agora sem o ponto: desenhe com o olhar um trapézio imaginário e depois um paralelepípedo. Devagar.', s: 30, scene: null },
      { t: 'Descanse', d: 'Feche os olhos e respire fundo. Pronto!', s: 12, scene: 'dark' }
    ]
  }
];

/* Bônus 1 do livro: Plano de 7 dias para uma Visão Renovada. */
window.VR_PLANO = [
  { dia: 1, foco: 'Consciência e relaxamento', ex: ['piscar', 'palming'], dica: 'Ajuste o brilho da tela para o ambiente. Faça pausas a cada 20 minutos.' },
  { dia: 2, foco: 'Lubrificação e circulação', ex: ['fechar-abrir', 'giro-cabeca'], dica: 'Beba mais água. Use colírios lubrificantes se necessário.' },
  { dia: 3, foco: 'Foco e flexibilidade', ex: ['perto-longe', 'cardeais'], dica: 'Olhe pela janela por 5 minutos a cada hora.' },
  { dia: 4, foco: 'Detox digital', ex: ['palming', 'figuras'], dica: 'Evite telas 1 hora antes de dormir. Faça uma caminhada leve.' },
  { dia: 5, foco: 'Ergonomia e ambiente', ex: ['piscar', 'temporas'], dica: 'Verifique a altura e a distância do monitor. Mantenha iluminação adequada.' },
  { dia: 6, foco: 'Nutrição e bem-estar', ex: ['perto-longe', 'cardeais', 'palming'], dica: 'Inclua alimentos ricos em vitamina A e ômega-3. Repita seus exercícios favoritos.' },
  { dia: 7, foco: 'Revisão e planejamento', ex: ['piscar', 'fechar-abrir', 'giro-cabeca', 'cardeais', 'temporas', 'perto-longe', 'figuras', 'palming'], dica: 'Todos os exercícios, uma vez cada. Revise seu progresso e planeje a próxima semana.' }
];
