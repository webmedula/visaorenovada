(function(){
  const QUESTIONS = [
    {q:"Quantas horas por dia você passa em frente a telas (somando computador, celular e TV)?", key:"tempo",
     o:["Menos de 4 horas","De 4 a 6 horas","De 6 a 9 horas","Mais de 9 horas"]},
    {q:"Com que frequência você faz pausas para tirar os olhos da tela?", key:"pausas",
     o:["A cada 20 a 30 minutos","Mais ou menos a cada hora","Só de vez em quando","Quase nunca"]},
    {q:"Seus olhos ficam secos, ardendo ou vermelhos durante ou depois do uso de telas?", key:"secura",
     o:["Nunca","Raramente","Algumas vezes por semana","Quase todos os dias"]},
    {q:"Você sente a visão embaçada ou dificuldade de focar no fim do dia?", key:"foco",
     o:["Nunca","Raramente","Algumas vezes por semana","Quase todos os dias"]},
    {q:"Você tem dor de cabeça ou peso na testa depois de muito tempo de tela?", key:"cabeca",
     o:["Nunca","Raramente","Algumas vezes por semana","Quase todos os dias"]},
    {q:"Qual a distância entre seus olhos e a tela do computador?", key:"distancia",
     o:["Mais ou menos um braço (50 a 70 cm)","Um pouco menos que um braço","Bem perto (menos de 40 cm)","Não sei / uso mais o celular, bem perto do rosto"]},
    {q:"Como é a iluminação quando você usa telas?", key:"luz",
     o:["Ambiente bem iluminado, sem reflexo na tela","Às vezes tem reflexo ou luz forte atrás","Costumo usar telas com pouca luz","Uso muito no escuro, inclusive na cama"]},
    {q:"Quando foi sua última consulta com oftalmologista?", key:"consulta",
     o:["Há menos de 1 ano","Entre 1 e 2 anos","Há mais de 2 anos","Nunca fui ou não lembro"]}
  ];
  const TIPS = {
    tempo:{t:"Reduza a carga de tela onde der",d:"Troque parte das tarefas por áudio ou papel e evite telas na última hora antes de dormir."},
    pausas:{t:"Use a regra 20-20-20",d:"A cada 20 minutos, olhe para algo a cerca de 6 metros de distância por 20 segundos. Um lembrete no celular ajuda a criar o hábito."},
    secura:{t:"Pisque de propósito",d:"Diante da tela piscamos menos. Faça séries de piscadas completas e lentas, beba água e evite vento ou ar-condicionado direto no rosto."},
    foco:{t:"Relaxe o foco ao longo do dia",d:"Alterne o olhar entre um ponto perto e um ponto longe por alguns minutos. Isso ajuda a soltar a tensão do foco prolongado."},
    cabeca:{t:"Ajuste brilho e tamanho da letra",d:"Deixe o brilho da tela parecido com o do ambiente e aumente a fonte para não forçar a vista. Se a dor for frequente, converse com um médico."},
    distancia:{t:"Afaste a tela",d:"Mantenha o monitor a cerca de um braço de distância e com o topo na altura dos olhos ou um pouco abaixo. No celular, evite segurar muito perto do rosto."},
    luz:{t:"Cuide da iluminação",d:"Evite usar telas no escuro e posicione o monitor de lado para janelas, sem reflexos. Luz ambiente suave reduz o esforço visual."},
    consulta:{t:"Agende uma consulta",d:"Um exame com oftalmologista verifica se você precisa de óculos ou de ajuste no grau, o que faz grande diferença no conforto."}
  };
  const el = document.getElementById('quiz');
  let step = -1, answers = [];

  function intro(){
    el.innerHTML = `
      <h3 style="font-family:Inter,sans-serif;font-weight:600;font-size:1.3rem;margin-bottom:10px">Autoavaliação de conforto visual</h3>
      <ul class="intro-list" style="text-align:left">
        <li>8 perguntas de múltipla escolha</li>
        <li>Resultado imediato com dicas para a sua rotina</li>
        <li>Ferramenta educativa, não é diagnóstico médico</li>
      </ul>
      <button class="btn btn-primary" id="start">Começar agora</button>`;
    document.getElementById('start').onclick = ()=>{step=0;render(true)};
  }

  function render(focus){
    if(step<0) return intro();
    if(step>=QUESTIONS.length) return result();
    const Q = QUESTIONS[step];
    el.innerHTML = `
      <div class="quiz-top"><span>Pergunta ${step+1} de ${QUESTIONS.length}</span><span>${Math.round(step/QUESTIONS.length*100)}%</span></div>
      <div class="bar"><i style="width:${step/QUESTIONS.length*100}%"></i></div>
      <div class="q" style="text-align:left"><h3 id="qt" tabindex="-1">${Q.q}</h3>
        <div class="opts" role="group" aria-labelledby="qt">${Q.o.map((o,i)=>`<button class="opt" data-v="${i}">${o}</button>`).join('')}</div>
      </div>
      <div class="quiz-nav">${step>0?'<button class="linkbtn" id="back">← Voltar</button>':'<span></span>'}<span></span></div>`;
    el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{answers[step]=+b.dataset.v;step++;render(true)});
    const back=document.getElementById('back'); if(back) back.onclick=()=>{step--;render(true)};
    if(focus) document.getElementById('qt').focus({preventScroll:true});
  }

  function result(){
    const total = answers.reduce((a,b)=>a+b,0), max = QUESTIONS.length*3, pct = total/max;
    let lv,cls,txt;
    if(pct<.3){lv="Conforto visual bom";cls="lv-ok";txt="Seus hábitos já ajudam bastante. Alguns ajustes podem deixar seus olhos ainda mais descansados."}
    else if(pct<.6){lv="Sinais de cansaço visual";cls="lv-mid";txt="Sua rotina está cobrando um preço dos seus olhos. A boa notícia é que mudanças simples costumam trazer alívio rápido."}
    else {lv="Seus olhos pedem atenção";cls="lv-high";txt="Você tem vários sinais de fadiga visual digital. Vale ajustar a rotina já e conversar com um oftalmologista."}
    const ranked = QUESTIONS.map((Q,i)=>({k:Q.key,v:answers[i]})).filter(x=>x.v>=2).sort((a,b)=>b.v-a.v).slice(0,3);
    const tips = (ranked.length?ranked:[{k:'pausas'},{k:'secura'}]).map(x=>TIPS[x.k]);
    const symptomHigh = answers[3]===3 || answers[4]===3;
    el.innerHTML = `
      <div style="text-align:left">
        <span class="result-level ${cls}">${lv}</span>
        <h3 style="font-family:Inter,sans-serif;font-weight:600;font-size:1.35rem">${txt}</h3>
        <div class="gauge" aria-hidden="true"><small>Bom</small><div class="track"><span class="dot" style="left:0%"></span></div><small>Atenção</small></div>
        <p style="font-weight:600;margin-bottom:6px">Suas ${tips.length} prioridades:</p>
        <div class="tips">${tips.map(t=>`<div class="tip"><b>${t.t}</b>${t.d}</div>`).join('')}</div>
        <div class="result-cta">
          <div><b>Quer o passo a passo completo?</b><br><span style="color:var(--muted);font-size:.95rem">O livro traz o plano de 21 dias, os exercícios e o checklist do ambiente.</span></div>
          <a class="btn btn-primary" href="https://www.visaorenovada.com.br/#oferta">Conhecer o livro</a>
        </div>
        ${symptomHigh?`<div class="redflag"><b>Atenção:</b> sintomas que aparecem quase todos os dias merecem avaliação de um oftalmologista, principalmente se forem novos ou estiverem piorando.</div>`:''}
        <p style="margin-top:18px;font-size:.85rem;color:var(--muted)">Resultado educativo, baseado apenas nas suas respostas. Não é diagnóstico. <button class="linkbtn" id="redo">Refazer a autoavaliação</button></p>
      </div>`;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{el.querySelector('.dot').style.left=(pct*100)+'%'}));
    document.getElementById('redo').onclick=()=>{answers=[];step=0;render(true)};
  }
  intro();

})();
