/*
 * Conteúdo do app: exercícios e plano de 21 dias.
 *
 * ATENÇÃO: estes exercícios são EXEMPLOS de práticas comuns de relaxamento visual.
 * Devem ser substituídos ou ajustados conforme os exercícios do livro
 * "Método Visão Renovada". Para alterar, edite apenas este arquivo.
 *
 * Cada passo (steps) tem:
 *   t     título curto mostrado em destaque
 *   d     instrução
 *   s     duração em segundos
 *   scene animação de apoio: 'breathe' | 'dir-h' | 'dir-v' | 'dir-diag' | 'dir-circle' |
 *         'dir-eight' | 'nearfar' | 'blink' | 'dark' | null
 *   spd   velocidade da animação (ex.: '4s')
 */
window.VR_EXERCICIOS = [
  {
    id: 'piscar',
    nome: 'Piscar consciente',
    ico: '😌',
    min: 2,
    tag: 'Olhos secos',
    resumo: 'Reidrata a superfície do olho. Ideal para quem passa horas na tela e esquece de piscar.',
    beneficio: 'Diante da tela, piscamos até 60% menos. Piscar completo e lento espalha a lágrima e alivia a secura.',
    steps: [
      { t: 'Prepare-se', d: 'Sente-se confortavelmente, ombros soltos. Olhe para um ponto neutro à sua frente.', s: 10, scene: 'breathe', spd: '6s' },
      { t: 'Pisque devagar', d: 'Feche os olhos suavemente por 2 segundos e abra. Acompanhe o ritmo do círculo.', s: 40, scene: 'blink', spd: '4s' },
      { t: 'Aperte de leve', d: 'Feche os olhos e aperte as pálpebras de leve por 3 segundos. Solte. Repita.', s: 30, scene: 'blink', spd: '6s' },
      { t: 'Piscadas rápidas', d: 'Pisque rápido e leve por 10 segundos, depois descanse com os olhos fechados.', s: 20, scene: 'blink', spd: '1s' },
      { t: 'Descanse', d: 'Olhos fechados, respire fundo três vezes. Sinta os olhos mais úmidos.', s: 20, scene: 'dark' }
    ]
  },
  {
    id: 'palming',
    nome: 'Palming (descanso no escuro)',
    ico: '🤲',
    min: 3,
    tag: 'Relaxamento',
    resumo: 'Cubra os olhos com as palmas das mãos aquecidas e deixe tudo escurecer.',
    beneficio: 'O calor e a escuridão total ajudam a relaxar a musculatura ao redor dos olhos e a reduzir a tensão acumulada.',
    steps: [
      { t: 'Aqueça as mãos', d: 'Esfregue as palmas uma na outra por alguns segundos até sentir calor.', s: 15, scene: 'breathe', spd: '3s' },
      { t: 'Cubra os olhos', d: 'Apoie os cotovelos na mesa e cubra os olhos com as palmas em concha, sem pressionar. Não deve entrar luz.', s: 15, scene: 'dark' },
      { t: 'Respire', d: 'Olhos fechados sob as mãos. Inspire pelo nariz em 4 tempos, solte em 6. Imagine um preto profundo.', s: 120, scene: 'dark' },
      { t: 'Volte devagar', d: 'Afaste as mãos ainda com os olhos fechados. Abra-os lentamente e pisque algumas vezes.', s: 15, scene: 'breathe', spd: '8s' }
    ]
  },
  {
    id: 'perto-longe',
    nome: 'Foco perto e longe',
    ico: '🔭',
    min: 3,
    tag: 'Foco',
    resumo: 'Alterne o foco entre o polegar e um ponto distante para soltar o músculo do foco.',
    beneficio: 'Horas focando de perto deixam o foco "travado". Alternar distâncias devolve flexibilidade à acomodação.',
    steps: [
      { t: 'Escolha o ponto distante', d: 'Olhe pela janela ou pelo ponto mais longe da sala, a pelo menos 5 metros.', s: 10, scene: null },
      { t: 'Polegar à frente', d: 'Estenda o braço com o polegar para cima, a uns 30 cm do rosto. Foque na unha até ficar nítida.', s: 10, scene: 'nearfar', spd: '60s' },
      { t: 'Alterne', d: 'Quando o círculo crescer, foque no polegar. Quando encolher, foque no ponto distante. Sem pressa, sem forçar.', s: 90, scene: 'nearfar', spd: '6s' },
      { t: 'Aproxime', d: 'Traga o polegar lentamente até perto do nariz, mantendo o foco. Depois afaste. Repita 3 vezes.', s: 30, scene: 'nearfar', spd: '10s' },
      { t: 'Descanse', d: 'Feche os olhos e respire fundo.', s: 15, scene: 'dark' }
    ]
  },
  {
    id: 'movimentos',
    nome: 'Movimentos oculares',
    ico: '👀',
    min: 4,
    tag: 'Mobilidade',
    resumo: 'Siga o ponto com os olhos, sem mexer a cabeça: horizontal, vertical, diagonais e círculos.',
    beneficio: 'Os músculos que movem os olhos ficam quase parados na tela. Movimentos amplos e lentos ajudam a soltá-los.',
    steps: [
      { t: 'Posição', d: 'Cabeça parada, olhando para a frente. Mova só os olhos. Se tiver tontura, pare.', s: 8, scene: 'breathe', spd: '6s' },
      { t: 'Horizontal', d: 'Siga o ponto da esquerda para a direita, devagar, até o limite confortável.', s: 30, scene: 'dir-h', spd: '5s' },
      { t: 'Vertical', d: 'Agora de cima para baixo. Respire normalmente.', s: 30, scene: 'dir-v', spd: '5s' },
      { t: 'Diagonal', d: 'Siga o ponto na diagonal. Mantenha o pescoço relaxado.', s: 30, scene: 'dir-diag', spd: '5s' },
      { t: 'Pisque e descanse', d: 'Pisque algumas vezes e feche os olhos por um instante.', s: 10, scene: 'dark' },
      { t: 'Círculos', d: 'Acompanhe o círculo completo, bem devagar.', s: 40, scene: 'dir-circle', spd: '10s' },
      { t: 'Oito deitado', d: 'Siga o ponto no desenho de um oito deitado, como um infinito.', s: 40, scene: 'dir-eight', spd: '10s' },
      { t: 'Descanse', d: 'Feche os olhos, respire fundo e sinta os olhos mais leves.', s: 20, scene: 'dark' }
    ]
  },
  {
    id: 'olhar-longe',
    nome: 'Olhar ao horizonte',
    ico: '🌅',
    min: 2,
    tag: 'Pausa de tela',
    resumo: 'Dois minutos olhando para longe, com respiração lenta. A pausa perfeita entre tarefas.',
    beneficio: 'Olhar para longe relaxa o foco de perto. Combinado com respiração lenta, reduz a tensão de todo o rosto.',
    steps: [
      { t: 'Vá até a janela', d: 'Ou olhe para o ponto mais distante que você conseguir. Postura ereta, ombros soltos.', s: 10, scene: null },
      { t: 'Olhe para longe', d: 'Deixe o olhar "descansar" no horizonte, sem fixar em nada. Pisque naturalmente.', s: 60, scene: 'breathe', spd: '10s' },
      { t: 'Amplie o campo', d: 'Sem mover os olhos, perceba o que está nas laterais, acima e abaixo. Visão aberta, relaxada.', s: 40, scene: 'breathe', spd: '10s' },
      { t: 'Volte', d: 'Pisque algumas vezes e volte à tarefa com os olhos descansados.', s: 10, scene: null }
    ]
  },
  {
    id: 'calor-massagem',
    nome: 'Massagem e calor',
    ico: '💆',
    min: 3,
    tag: 'Tensão',
    resumo: 'Toques leves ao redor dos olhos e na têmpora para aliviar a tensão do fim do dia.',
    beneficio: 'A musculatura da testa e da região dos olhos acumula tensão. Massagem leve melhora a circulação e o conforto.',
    steps: [
      { t: 'Mãos limpas', d: 'Lave as mãos. Nunca pressione o globo ocular, só o osso ao redor.', s: 8, scene: null },
      { t: 'Sobrancelhas', d: 'Com as pontas dos dedos, pressione de leve ao longo das sobrancelhas, do centro para fora.', s: 40, scene: 'breathe', spd: '5s' },
      { t: 'Têmporas', d: 'Faça círculos lentos nas têmporas, com pouca pressão.', s: 40, scene: 'dir-circle', spd: '5s' },
      { t: 'Abaixo dos olhos', d: 'Deslize suavemente os dedos sobre o osso abaixo dos olhos, do nariz para as laterais.', s: 40, scene: 'dir-h', spd: '5s' },
      { t: 'Calor', d: 'Esfregue as mãos e apoie as palmas quentes sobre os olhos fechados.', s: 40, scene: 'dark' }
    ]
  }
];

/* Plano de 21 dias. Cada dia lista os ids dos exercícios e uma dica. */
window.VR_PLANO = (function () {
  const base = [
    { ex: ['piscar', 'olhar-longe'], dica: 'Hoje é só começar. Ajuste a tela para a altura dos olhos.' },
    { ex: ['piscar', 'palming'], dica: 'Coloque um lembrete de pausa a cada 20 minutos.' },
    { ex: ['perto-longe', 'olhar-longe'], dica: 'Afaste a tela: a distância de um braço é a ideal.' },
    { ex: ['movimentos', 'piscar'], dica: 'Beba água ao longo do dia. Hidratação também é lágrima.' },
    { ex: ['palming', 'olhar-longe'], dica: 'Reduza o brilho da tela para o nível da luz do ambiente.' },
    { ex: ['perto-longe', 'calor-massagem'], dica: 'Aumente o tamanho da fonte em vez de se aproximar da tela.' },
    { ex: ['movimentos', 'palming'], dica: 'Dia de fechar a semana: perceba o que já mudou.' }
  ];
  const plano = [];
  for (let d = 0; d < 21; d++) {
    const semana = Math.floor(d / 7);
    const b = base[d % 7];
    plano.push({
      dia: d + 1,
      semana: semana + 1,
      ex: semana === 2 ? [...b.ex, 'olhar-longe'].filter((v, i, a) => a.indexOf(v) === i) : b.ex,
      dica: b.dica
    });
  }
  return plano;
})();
