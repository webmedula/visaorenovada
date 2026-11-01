/* App Visão Renovada: rotas, estado local e player de exercícios guiados. */
(function () {
  'use strict';
  const EX = window.VR_EXERCICIOS || [];
  const PLANO = window.VR_PLANO || [];
  const GRUPOS = window.VR_GRUPOS || [];
  const NDIAS = PLANO.length;
  const byId = Object.fromEntries(EX.map(e => [e.id, e]));
  const $ = (s, r = document) => r.querySelector(s);
  const app = $('#app');
  const player = $('#player');

  /* ---------- Estado (fica só no navegador da pessoa) ---------- */
  const KEY = 'vr-estado-v1';
  const hoje = () => new Date().toISOString().slice(0, 10);
  function load() {
    try { return Object.assign({ feitos: {}, inicioPlano: null, diasConcluidos: [] }, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch { return { feitos: {}, inicioPlano: null, diasConcluidos: [] }; }
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* modo privado etc. */ } }
  let S = load();

  function feitosHoje() { return S.feitos[hoje()] || []; }
  function marcarFeito(id) {
    const d = hoje();
    S.feitos[d] = Array.from(new Set([...(S.feitos[d] || []), id]));
    // conclui o dia do plano se todos os exercícios do dia foram feitos
    const dia = diaAtual();
    if (dia && dia.ex.every(x => S.feitos[d].includes(x)) && !S.diasConcluidos.includes(dia.dia)) S.diasConcluidos.push(dia.dia);
    save(S);
  }
  function diasSeguidos() {
    let n = 0; const dt = new Date();
    for (;;) {
      const k = dt.toISOString().slice(0, 10);
      if ((S.feitos[k] || []).length) { n++; dt.setDate(dt.getDate() - 1); } else break;
      if (n > 365) break;
    }
    return n;
  }
  function diaAtual() {
    if (!S.inicioPlano) return null;
    const n = Math.min(S.diasConcluidos.length + 1, NDIAS);
    return PLANO[n - 1];
  }

  /* ---------- Utilidades ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  const total = ex => ex.steps.reduce((a, b) => a + b.s, 0);
  let toastT;
  function toast(msg) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
  }
  function beep() {
    try {
      const ctx = beep.ctx || (beep.ctx = new (window.AudioContext || window.webkitAudioContext)());
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 660; g.gain.value = 0.0001;
      o.connect(g); g.connect(ctx.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      o.stop(ctx.currentTime + 0.55);
    } catch { /* sem áudio */ }
  }

  function exCard(ex, opts = {}) {
    const done = feitosHoje().includes(ex.id);
    return `
      <div class="card ex-item ${done ? 'is-done' : ''}" role="button" tabindex="0" data-ex="${ex.id}" aria-label="Iniciar ${esc(ex.nome)}">
        <div class="ico" aria-hidden="true">${ex.ico}</div>
        <div class="meta">
          <div class="row space" style="gap:6px"><h3 style="margin:0">${esc(ex.nome)}</h3>${done ? '<span class="done">✓ feito hoje</span>' : ''}</div>
          <p>${esc(opts.curto ? ex.tag : ex.resumo)} · <b>${ex.min} min</b></p>
        </div>
        <span class="btn btn-primary" style="padding:10px 16px;font-size:.9rem;flex:none">Iniciar</span>
      </div>`;
  }

  /* ---------- Telas ---------- */
  const views = {
    inicio() {
      const dia = diaAtual();
      const feitos = feitosHoje();
      const seq = diasSeguidos();
      const sugeridos = dia ? dia.ex.map(id => byId[id]).filter(Boolean) : [byId['piscar'], byId['olhar-longe']].filter(Boolean);
      const faltam = sugeridos.filter(e => !feitos.includes(e.id));
      return `
        <section class="hero-card">
          <span class="chip gold">${dia ? `Dia ${dia.dia} de ${NDIAS} · ${esc(dia.foco)}` : 'Bem-vindo(a)'}</span>
          <h2 style="margin-top:12px">${faltam.length ? (dia ? 'Sua prática de hoje' : 'Que tal começar com 4 minutos?') : 'Prática de hoje concluída 🎉'}</h2>
          <p>${dia ? esc(dia.dica) : 'Exercícios curtos e guiados para aliviar o cansaço visual. Comece por onde quiser.'}</p>
          <div class="row" style="margin-top:18px">
            ${faltam.length ? `<button class="btn btn-primary" data-ex="${faltam[0].id}">▶ Iniciar ${esc(faltam[0].nome)}</button>` : ''}
            ${!dia ? '<a class="btn btn-ghost" style="border-color:#cfe4de;color:#fff" href="#plano">Ver o plano de 7 dias</a>' : ''}
          </div>
          <div class="streak" title="Dias seguidos de prática">${Array.from({ length: 7 }, (_, i) => `<span class="${i < Math.min(seq, 7) ? 'on' : ''}"></span>`).join('')}<small style="margin-left:6px;color:#cfe4de">${seq} ${seq === 1 ? 'dia seguido' : 'dias seguidos'}</small></div>
        </section>

        <h2 class="mt" style="font-size:1.35rem">${dia ? 'Exercícios de hoje' : 'Sugestões para começar'}</h2>
        <div class="grid">${sugeridos.map(e => exCard(e)).join('')}</div>

        <h2 class="mt" style="font-size:1.35rem">Pausa rápida</h2>
        <div class="grid grid-2">
          <a class="card" href="#pausas" style="text-decoration:none;color:inherit">
            <h3>⏱️ Lembrete 20-20-20</h3><p>A cada 20 minutos, 20 segundos olhando para algo a 6 metros. Deixe o cronômetro aberto enquanto trabalha.</p>
          </a>
          <a class="card" href="/avaliacao/" style="text-decoration:none;color:inherit">
            <h3>📋 Autoavaliação (Bônus 2)</h3><p>Responda à autoavaliação visual e receba uma leitura do seu perfil com orientações práticas.</p>
          </a>
        </div>`;
    },

    exercicios() {
      return `
        <div class="page-head">
          <h1>Guia prático de exercícios</h1>
          <p class="lead">Os exercícios do Capítulo 4 do livro, guiados passo a passo. Escolha pelo que você está sentindo agora.</p>
        </div>
        ${GRUPOS.map((g, i) => `
          <h2 class="${i ? 'mt' : ''}" style="font-size:1.3rem;margin-bottom:4px">${i + 1}. ${esc(g.nome)}</h2>
          <p class="small mb">${esc(g.desc)}</p>
          <div class="grid">${EX.filter(e => e.grupo === g.id).map(e => exCard(e)).join('')}</div>`).join('')}`;
    },

    plano() {
      if (!S.inicioPlano) {
        return `
          <div class="page-head">
            <span class="chip gold">Bônus 1 do livro</span>
            <h1 style="margin-top:10px">Seu plano de 7 dias para uma Visão Renovada</h1>
            <p class="lead">Uma semana de prática guiada, com um foco por dia e uma dica extra de hábito. Cada dia leva de 5 a 10 minutos.</p>
          </div>
          <div class="grid grid-2">
            ${PLANO.map(p => `<div class="card"><span class="chip">Dia ${p.dia}</span><h3 style="margin-top:8px">${esc(p.foco)}</h3><p>${p.ex.map(id => byId[id] ? byId[id].nome : id).join(', ')}.</p></div>`).join('')}
          </div>
          <div class="mt center"><button class="btn btn-primary" id="comecar-plano">Começar o plano hoje</button>
          <p class="small mt">Seu progresso fica salvo neste navegador. O plano avança um dia a cada prática concluída, e você pode repetir a semana quantas vezes quiser.</p></div>`;
      }
      const atual = diaAtual();
      const semanas = `
        <div class="week-title">Sua semana${S.semanas ? ` · ${S.semanas + 1}ª rodada` : ''}</div>
        <div class="days">${PLANO.map(p => {
          const done = S.diasConcluidos.includes(p.dia), today = atual && atual.dia === p.dia;
          return `<div class="day ${done ? 'done' : ''} ${today ? 'today' : ''} ${!done && !today ? 'lock' : ''}" title="Dia ${p.dia}: ${esc(p.foco)}">${done ? '✓' : p.dia}</div>`;
        }).join('')}</div>`;
      const concluido = S.diasConcluidos.length >= NDIAS;
      return `
        <div class="page-head">
          <span class="chip">${S.diasConcluidos.length} de ${NDIAS} dias concluídos</span>
          <h1 style="margin-top:10px">${concluido ? 'Semana concluída! 🎉' : `Dia ${atual.dia}: ${esc(atual.foco)}`}</h1>
          <p class="lead">${concluido ? 'Você completou os 7 dias do plano. Como sugere o livro, revise seu progresso e planeje a próxima semana: repita o plano ou siga com os exercícios livres.' : esc(atual.dica)}</p>
        </div>
        ${concluido ? '' : `<div class="grid">${atual.ex.map(id => byId[id]).filter(Boolean).map(e => exCard(e, { curto: true })).join('')}</div>`}
        ${semanas}
        <p class="small mt">${concluido ? '<button class="btn btn-primary" id="repetir-plano">Repetir a semana</button>' : '<button class="linkbtn" id="reiniciar-plano">Reiniciar o plano</button>'}</p>`;
    },

    receitas() {
      if (!R.dados) {
        return `
          <div class="page-head">
            <span class="chip gold">Conteúdo exclusivo</span>
            <h1 style="margin-top:10px">Cozinha Visão Renovada</h1>
            <p class="lead">50 receitas, um cardápio de 30 dias e listas de compras semanais com os alimentos que fazem bem aos olhos. Área exclusiva para quem adquiriu o ebook de receitas.</p>
          </div>
          <div class="grid grid-2">
            <form class="card" id="receitas-form" autocomplete="off">
              <h3>Já tem o ebook?</h3>
              <p class="mb">Digite o código de acesso que você recebeu na compra.</p>
              <label class="small" for="receitas-codigo">Código de acesso</label>
              <input id="receitas-codigo" class="input" type="text" inputmode="text" autocapitalize="characters" placeholder="Ex.: VR-2026-XXXX" required>
              <p class="small" id="receitas-erro" style="color:var(--warn);min-height:1.2em;margin:6px 0 10px"></p>
              <button class="btn btn-primary" type="submit" id="receitas-entrar">Acessar receitas</button>
            </form>
            <div class="card">
              <h3>Ainda não tem?</h3>
              <p class="mb">O ebook complementa o livro: 50 receitas novas de café da manhã, almoço e jantar, lanches e sucos, um mês inteiro planejado e 4 listas de compras. Dá para ler aqui no app ou baixar o PDF.</p>
              <a class="btn btn-ghost" href="https://www.visaorenovada.com.br/receitas/">Quero o ebook de receitas</a>
            </div>
          </div>`;
      }
      const d = R.dados, aba = R.aba || 'receitas';
      const porId = Object.fromEntries((d.receitas || []).map(r => [r.id, r]));
      const abas = [['receitas', 'Receitas'], ['cardapio', 'Cardápio 30 dias'], ['compras', 'Listas de compras'], ['guia', 'Guia dos nutrientes']];
      let corpo = '';
      if (aba === 'receitas') corpo = receitasLista(d);
      else if (aba === 'cardapio') corpo = receitasCardapio(d, porId);
      else if (aba === 'compras') corpo = receitasCompras(d);
      else corpo = receitasGuia(d);
      return `
        <div class="page-head">
          <span class="chip gold">${esc(d.subtitulo || 'Ebook de receitas')}</span>
          <h1 style="margin-top:10px">${esc(d.titulo)}</h1>
          <p class="lead">${esc(d.introducao || '')}</p>
          <div class="row mt">
            ${d.pdf ? `<button class="btn btn-primary" id="receitas-pdf">⬇ Baixar o ebook em PDF</button>` : `<span class="chip gray">PDF em breve</span>`}
            <button class="linkbtn" id="receitas-sair">Sair da área exclusiva</button>
          </div>
        </div>
        <div class="row mb subtabs" role="tablist" aria-label="Seções do ebook">
          ${abas.map(([id, nome]) => `<button class="chip-btn ${aba === id ? 'on' : ''}" role="tab" aria-selected="${aba === id}" data-aba="${id}">${nome}</button>`).join('')}
        </div>
        ${corpo}
        <p class="small mt">${esc(d.aviso || '')}</p>`;
    },

    pausas() {
      return `
        <div class="page-head">
          <h1>Pausas 20-20-20</h1>
          <p class="lead">Deixe esta tela aberta enquanto trabalha. A cada 20 minutos ela avisa: olhe para algo a 6 metros por 20 segundos.</p>
        </div>
        <div class="card center" id="pausa-card">
          <div class="ring">
            <svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" id="ring-fg" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="0"/></svg>
            <div class="lbl"><div><div class="timer-big" id="pausa-tempo">20:00</div><small id="pausa-fase">até a próxima pausa</small></div></div>
          </div>
          <div class="row" style="justify-content:center">
            <button class="btn btn-primary" id="pausa-toggle">Iniciar</button>
            <button class="btn btn-ghost" id="pausa-reset">Zerar</button>
          </div>
          <p class="small mt" id="pausa-notif"></p>
        </div>
        <div class="grid grid-2 mt">
          <div class="card"><h3>Por que 20-20-20?</h3><p>Focar perto por muito tempo cansa o músculo do foco e reduz o piscar. Olhar longe por 20 segundos relaxa os dois.</p></div>
          <div class="card"><h3>Dica</h3><p>Aproveite a pausa para piscar devagar e beber um gole de água. Se puder, levante-se.</p></div>
        </div>`;
    }
  };


  /* ---------- Receitas: blocos da área exclusiva ---------- */
  function receitaMeta(r) {
    const tempo = r.tempo || (r.tempo_min ? `${r.tempo_min} min` : '');
    const rend = r.rendimento || (r.porcoes ? `${r.porcoes} ${r.porcoes > 1 ? 'porções' : 'porção'}` : '');
    return [tempo ? `⏱ ${esc(tempo)}` : '', rend ? `🍽 ${esc(rend)}` : '', r.dificuldade ? esc(r.dificuldade) : ''].filter(Boolean).join(' · ');
  }
  function receitaCard(r, aberta) {
    return `
      <details class="card receita" id="r-${esc(r.id)}" ${aberta ? 'open' : ''}>
        <summary>
          <div>
            <h3 style="margin:0">${r.numero ? `<span class="num">${r.numero}.</span> ` : ''}${esc(r.nome)}</h3>
            <p class="small" style="margin:4px 0 0">${receitaMeta(r)}</p>
          </div>
          <span class="chev" aria-hidden="true">›</span>
        </summary>
        <div class="receita-body">
          <div>
            <h4>Ingredientes</h4>
            <ul>${(r.ingredientes || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
          </div>
          <div>
            <h4>Modo de preparo</h4>
            <ol>${(r.preparo || []).map(i => `<li>${esc(i)}</li>`).join('')}</ol>
            ${r.dica ? `<p class="small"><b>Dica:</b> ${esc(r.dica)}</p>` : ''}
          </div>
          <div class="beneficio">
            <b>Por que faz bem aos olhos</b>
            <p style="margin:4px 0 8px">${esc(r.beneficios || '')}</p>
            <div class="row" style="gap:6px">${(r.nutrientes || []).map(n => `<span class="chip">${esc(n)}</span>`).join('')}</div>
            ${r.pagina_pdf ? `<p class="small" style="margin:8px 0 0">No PDF: página ${r.pagina_pdf}</p>` : ''}
          </div>
        </div>
      </details>`;
  }
  function receitasLista(d) {
    const cat = R.cat || 'todas';
    const lista = d.receitas.filter(r => cat === 'todas' || r.categoria === cat);
    const catAtual = (d.categorias || []).find(c => c.id === cat);
    return `
      <div class="row mb" role="tablist" aria-label="Categorias">
        <button class="chip-btn ${cat === 'todas' ? 'on' : ''}" data-cat="todas">Todas (${d.receitas.length})</button>
        ${(d.categorias || []).map(c => `<button class="chip-btn ${cat === c.id ? 'on' : ''}" data-cat="${esc(c.id)}">${esc(c.nome)} (${d.receitas.filter(r => r.categoria === c.id).length})</button>`).join('')}
      </div>
      ${catAtual && catAtual.descricao ? `<p class="small mb" style="max-width:62ch">${esc(catAtual.descricao)}</p>` : ''}
      <div class="grid">${lista.map(r => receitaCard(r, false)).join('')}</div>`;
  }
  function receitasCardapio(d, porId) {
    const sem = R.semana || 1;
    const dias = (d.cardapio || []).filter(c => c.semana === sem);
    const semanas = [...new Set((d.cardapio || []).map(c => c.semana))];
    const link = (id) => id && porId[id] ? `<a href="#receitas" data-receita="${esc(id)}">${esc(porId[id].nome)}</a>` : '';
    const linha = (rot, id, txt) => (id || txt) ? `<div class="ref"><span class="rot">${rot}</span><span>${id ? link(id) : esc(txt || '')}</span></div>` : '';
    return `
      <p class="mb" style="max-width:62ch">Um mês planejado: café, almoço, lanche, bebida e jantar. Toque no nome do prato para abrir a receita. Nos dias de sobras, o jantar aproveita o almoço da véspera.</p>
      <div class="row mb" role="tablist" aria-label="Semanas">
        ${semanas.map(n => `<button class="chip-btn ${sem === n ? 'on' : ''}" data-semana="${n}">Semana ${n}</button>`).join('')}
      </div>
      <div class="grid grid-2">
        ${dias.map(c => `
          <div class="card dia-card">
            <h3 style="margin:0 0 8px">Dia ${c.dia}</h3>
            ${linha('Café', c.cafe)}${linha('Almoço', c.almoco)}${linha('Lanche', c.lanche)}${linha('Bebida', c.bebida)}${linha('Jantar', c.jantar, c.jantar_texto)}
          </div>`).join('')}
      </div>`;
  }
  function receitasCompras(d) {
    const sem = R.semana || 1;
    const lista = (d.listas_compras || []).find(l => l.semana === sem) || (d.listas_compras || [])[0];
    if (!lista) return '<p>Listas de compras não disponíveis.</p>';
    return `
      <p class="mb" style="max-width:62ch">Lista organizada por seção do mercado. Marque o que já tem em casa; as marcações ficam salvas neste aparelho.</p>
      <div class="row mb" role="tablist" aria-label="Semanas">
        ${(d.listas_compras || []).map(l => `<button class="chip-btn ${sem === l.semana ? 'on' : ''}" data-semana="${l.semana}">Semana ${l.semana} <small>(dias ${l.dias[0]} a ${l.dias[1]})</small></button>`).join('')}
      </div>
      <div class="grid grid-2">
        ${(lista.secoes || []).map(sec => `
          <div class="card">
            <h3 style="margin:0 0 8px">${esc(sec.nome)}</h3>
            <ul class="checklist">
              ${(sec.itens || []).map(it => { const k = `${sem}|${sec.nome}|${it.item}`; const on = !!R.marcados[k]; return `<li><label><input type="checkbox" data-compra="${esc(k)}" ${on ? 'checked' : ''}> <span class="${on ? 'done' : ''}">${esc(it.item)}</span>${it.receitas ? `<small> · ${it.receitas} receita${it.receitas > 1 ? 's' : ''}</small>` : ''}</label></li>`; }).join('')}
            </ul>
          </div>`).join('')}
      </div>`;
  }
  function receitasGuia(d) {
    return `
      <h2 style="margin:0 0 10px">Os nutrientes do olhar</h2>
      <div class="grid grid-2 mb">
        ${(d.nutrientes || []).map(n => `
          <div class="card" style="border-left:4px solid ${/^#[0-9a-f]{3,8}$/i.test(n.cor || '') ? n.cor : 'var(--brand)'}">
            <h3 style="margin:0 0 6px">${esc(n.nome)}</h3>
            <p style="margin:0 0 8px">${esc(n.funcao || '')}</p>
            ${n.onde_encontrar ? `<p class="small" style="margin:0"><b>Onde encontrar:</b> ${esc(n.onde_encontrar)}</p>` : ''}
          </div>`).join('')}
      </div>
      ${(d.regras || []).length ? `<h2 style="margin:18px 0 10px">Regras simples da cozinha que cuida dos olhos</h2>
      <div class="grid grid-2">
        ${d.regras.map(r => `<div class="card"><h3 style="margin:0 0 6px">${esc(r.titulo)}</h3><p style="margin:0">${esc(r.texto)}</p></div>`).join('')}
      </div>` : ''}`;
  }
  /* ---------- Receitas: acesso por código (HTTP Basic no nginx) ---------- */
  const R = { dados: null, cat: 'todas', codigo: null, aba: 'receitas', semana: 1, marcados: {} };
  try { R.marcados = JSON.parse(localStorage.getItem('vr-compras') || '{}') || {}; } catch { R.marcados = {}; }
  const RKEY = 'vr-receitas-codigo';
  try { R.codigo = sessionStorage.getItem(RKEY) || localStorage.getItem(RKEY); } catch { /* sem storage */ }
  function authHeader(codigo) { return { Authorization: 'Basic ' + btoa(unescape(encodeURIComponent('leitor:' + codigo))) }; }
  async function carregarReceitas(codigo) {
    const res = await fetch('/receitas/receitas.json', { headers: authHeader(codigo), credentials: 'omit', cache: 'no-store' });
    if (res.status === 401 || res.status === 403) throw new Error('codigo');
    if (!res.ok) throw new Error('rede');
    return res.json();
  }
  async function entrarReceitas(codigo, lembrar) {
    const btn = $('#receitas-entrar'), erro = $('#receitas-erro');
    if (btn) { btn.disabled = true; btn.textContent = 'Verificando...'; }
    try {
      R.dados = await carregarReceitas(codigo); R.codigo = codigo;
      try { (lembrar ? localStorage : sessionStorage).setItem(RKEY, codigo); } catch { /* ignora */ }
      render();
    } catch (e) {
      if (btn) { btn.disabled = false; btn.textContent = 'Acessar receitas'; }
      if (erro) erro.textContent = e.message === 'codigo' ? 'Código não reconhecido. Confira o e-mail da compra.' : 'Não foi possível carregar agora. Tente de novo em instantes.';
    }
  }
  async function baixarPdf() {
    const d = R.dados; if (!d || !d.pdf) return;
    const btn = $('#receitas-pdf'); if (btn) { btn.disabled = true; btn.textContent = 'Preparando PDF...'; }
    try {
      const res = await fetch('/receitas/' + d.pdf, { headers: authHeader(R.codigo), credentials: 'omit' });
      if (!res.ok) throw new Error();
      const blob = new Blob([await res.arrayBuffer()], { type: 'application/pdf' }), url = URL.createObjectURL(blob);
      const nome = (d.titulo || 'receitas').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w ]+/g, '').trim().replace(/\s+/g, '-') + '.pdf';
      const a = document.createElement('a'); a.href = url; a.setAttribute('download', nome); a.rel = 'noopener';
      document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 10000);
    } catch { toast('Não foi possível baixar o PDF agora.'); }
    if (btn) { btn.disabled = false; btn.textContent = '⬇ Baixar o ebook em PDF'; }
  }
  function sairReceitas() { R.dados = null; R.codigo = null; try { sessionStorage.removeItem(RKEY); localStorage.removeItem(RKEY); } catch { /* ignora */ } render(); }

  /* ---------- Pausas: cronômetro ---------- */
  const P = { on: false, fase: 'trabalho', rest: 20 * 60, t: null };
  const TRAB = 20 * 60, PAUSA = 20;
  function pausaTick() {
    P.rest--;
    if (P.rest <= 0) {
      beep();
      if (P.fase === 'trabalho') { P.fase = 'pausa'; P.rest = PAUSA; notificar('Hora da pausa 👀', 'Olhe para algo a 6 metros por 20 segundos.'); }
      else { P.fase = 'trabalho'; P.rest = TRAB; }
    }
    pausaRender();
  }
  function pausaRender() {
    const tempo = $('#pausa-tempo'); if (!tempo) return;
    tempo.textContent = fmt(P.rest);
    $('#pausa-fase').textContent = P.fase === 'trabalho' ? 'até a próxima pausa' : 'olhe para longe!';
    const tot = P.fase === 'trabalho' ? TRAB : PAUSA;
    $('#ring-fg').style.strokeDashoffset = (326.7 * (1 - P.rest / tot)).toFixed(1);
    $('#ring-fg').style.stroke = P.fase === 'trabalho' ? 'var(--brand-2)' : 'var(--accent)';
    $('#pausa-toggle').textContent = P.on ? 'Pausar' : (P.rest === TRAB && P.fase === 'trabalho' ? 'Iniciar' : 'Continuar');
  }
  function pausaToggle() {
    P.on = !P.on;
    if (P.on) { P.t = setInterval(pausaTick, 1000); pedirNotificacao(); } else clearInterval(P.t);
    pausaRender();
  }
  function pausaReset() { clearInterval(P.t); Object.assign(P, { on: false, fase: 'trabalho', rest: TRAB }); pausaRender(); }
  function pedirNotificacao() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') Notification.requestPermission().then(() => notifStatus());
    notifStatus();
  }
  function notifStatus() {
    const el = $('#pausa-notif'); if (!el) return;
    if (!('Notification' in window)) el.textContent = 'Seu navegador não mostra notificações; mantenha esta aba visível para ouvir o aviso.';
    else if (Notification.permission === 'granted') el.textContent = 'Você será avisado(a) por notificação e som, mesmo em outra aba.';
    else if (Notification.permission === 'denied') el.textContent = 'Notificações bloqueadas. O aviso será só por som nesta aba.';
    else el.textContent = 'Ao iniciar, o navegador pedirá permissão para avisar você em outra aba.';
  }
  function notificar(t, b) {
    try { if ('Notification' in window && Notification.permission === 'granted') new Notification(t, { body: b, icon: '/assets/logo.svg' }); } catch { /* ignora */ }
  }

  /* ---------- Player de exercício guiado ---------- */
  const PL = { ex: null, i: 0, rest: 0, t: null, paused: false };
  function abrirPlayer(id) {
    const ex = byId[id]; if (!ex) return;
    Object.assign(PL, { ex, i: 0, rest: ex.steps[0].s, paused: false });
    player.hidden = false; document.body.style.overflow = 'hidden';
    renderPlayer(); iniciarTimer();
    try { beep.ctx && beep.ctx.resume(); } catch { /* ignora */ }
  }
  function fecharPlayer() {
    clearInterval(PL.t); player.hidden = true; document.body.style.overflow = ''; PL.ex = null;
  }
  function iniciarTimer() { clearInterval(PL.t); PL.t = setInterval(() => { if (PL.paused) return; PL.rest--; if (PL.rest <= 0) proximoPasso(); else atualizarContador(); }, 1000); }
  function proximoPasso() {
    PL.i++;
    if (PL.i >= PL.ex.steps.length) { clearInterval(PL.t); beep(); const antes = diaAtual(); marcarFeito(PL.ex.id); renderConclusao(antes); return; }
    beep(); PL.rest = PL.ex.steps[PL.i].s; renderPlayer();
  }
  function atualizarContador() {
    const c = $('.count', player); if (c) c.textContent = fmt(PL.rest);
    const st = PL.ex.steps[PL.i];
    const b = player.querySelectorAll('.player-steps i b')[PL.i]; if (b) b.style.width = ((1 - PL.rest / st.s) * 100) + '%';
  }
  function renderPlayer() {
    const ex = PL.ex, st = ex.steps[PL.i];
    player.innerHTML = `
      <div class="player-top">
        <h2>${ex.ico} ${esc(ex.nome)}</h2>
        <button class="player-close" aria-label="Fechar exercício" data-act="fechar">✕</button>
      </div>
      <div class="player-steps" aria-hidden="true">${ex.steps.map((s, i) => `<i class="${i < PL.i ? 'done' : ''}"><b></b></i>`).join('')}</div>
      <div class="small" style="color:#9fbfb8">Passo ${PL.i + 1} de ${ex.steps.length}</div>
      <div class="stage">
        ${st.scene ? `<div class="scene ${st.scene}" style="--spd:${st.spd || '4s'}" aria-hidden="true"><div class="dot"></div></div>` : ''}
        <h3>${esc(st.t)}</h3>
        <p>${esc(st.d)}</p>
        <div class="count" aria-label="Tempo restante do passo">${fmt(PL.rest)}</div>
      </div>
      <div class="player-actions">
        <button class="btn btn-ghost" data-act="pausar">${PL.paused ? '▶ Continuar' : '❚❚ Pausar'}</button>
        <button class="btn btn-ghost" data-act="pular">Pular passo →</button>
      </div>`;
  }
  function renderConclusao(dia) {
    const ex = PL.ex;
    const concluiuDia = dia && dia.ex.includes(ex.id) && S.diasConcluidos.includes(dia.dia) && S.diasConcluidos[S.diasConcluidos.length - 1] === dia.dia;
    player.innerHTML = `
      <div class="player-top"><h2>Concluído</h2><button class="player-close" aria-label="Fechar" data-act="fechar">✕</button></div>
      <div class="stage">
        <div class="celebrate">🎉</div>
        <h3>${esc(ex.nome)} feito!</h3>
        <p>${concluiuDia ? (dia.dia >= NDIAS ? 'Você concluiu a semana inteira do plano. Parabéns!' : `Você concluiu o dia ${dia.dia} do plano. Até amanhã!`) : 'Perceba como seus olhos estão agora. Pequenas pausas, grande diferença.'}</p>
        <p class="small" style="color:#9fbfb8">${esc(ex.beneficio)}</p>
      </div>
      <div class="player-actions">
        <button class="btn btn-primary" data-act="fechar">Voltar</button>
        <button class="btn btn-ghost" data-act="repetir">Repetir</button>
      </div>`;
  }
  player.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act;
    if (a === 'fechar') { fecharPlayer(); render(); }
    else if (a === 'pausar') { PL.paused = !PL.paused; b.textContent = PL.paused ? '▶ Continuar' : '❚❚ Pausar'; }
    else if (a === 'pular') { proximoPasso(); }
    else if (a === 'repetir') { abrirPlayer(PL.ex.id); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !player.hidden) { fecharPlayer(); render(); } });

  /* ---------- Rotas ---------- */
  function rota() { const h = (location.hash || '#inicio').slice(1); return views[h] ? h : 'inicio'; }
  function render() {
    const r = rota();
    app.innerHTML = views[r]();
    document.querySelectorAll('[data-nav]').forEach(a => { if (a.dataset.nav === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (r === 'pausas') { pausaRender(); notifStatus(); }
    if (r === 'receitas' && !R.dados && R.codigo) { carregarReceitas(R.codigo).then(d => { R.dados = d; if (rota() === 'receitas') render(); }).catch(() => { R.codigo = null; }); }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }
  app.addEventListener('click', e => {
    const ex = e.target.closest('[data-ex]'); if (ex) { abrirPlayer(ex.dataset.ex); return; }
    const id = e.target.id;
    if (id === 'comecar-plano') { S.inicioPlano = hoje(); save(S); render(); toast('Plano iniciado. Bom começo!'); }
    else if (id === 'reiniciar-plano') { S.inicioPlano = hoje(); S.diasConcluidos = []; save(S); render(); toast('Plano reiniciado.'); }
    else if (id === 'repetir-plano') { S.inicioPlano = hoje(); S.diasConcluidos = []; S.semanas = (S.semanas || 0) + 1; save(S); render(); toast('Nova semana iniciada. Bom começo!'); }
    else if (id === 'pausa-toggle') pausaToggle();
    else if (id === 'pausa-reset') pausaReset();
    else if (id === 'receitas-pdf') baixarPdf();
    else if (id === 'receitas-sair') sairReceitas();
    else if (e.target.closest('[data-cat]')) { R.cat = e.target.closest('[data-cat]').dataset.cat; render(); }
    else if (e.target.closest('[data-aba]')) { R.aba = e.target.closest('[data-aba]').dataset.aba; render(); }
    else if (e.target.closest('[data-semana]')) { R.semana = +e.target.closest('[data-semana]').dataset.semana; render(); }
    else if (e.target.closest('[data-receita]')) {
      e.preventDefault(); const rid = e.target.closest('[data-receita]').dataset.receita;
      R.aba = 'receitas'; R.cat = 'todas'; render();
      const el = document.getElementById('r-' + rid); if (el) { el.open = true; el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });
  app.addEventListener('change', e => {
    const cb = e.target.closest('[data-compra]'); if (!cb) return;
    const k = cb.dataset.compra; if (cb.checked) R.marcados[k] = 1; else delete R.marcados[k];
    try { localStorage.setItem('vr-compras', JSON.stringify(R.marcados)); } catch { /* ignora */ }
    const sp = cb.nextElementSibling; if (sp) sp.classList.toggle('done', cb.checked);
  });
  app.addEventListener('submit', e => {
    if (e.target.id === 'receitas-form') { e.preventDefault(); const v = $('#receitas-codigo').value.trim(); if (v) entrarReceitas(v, true); }
  });
  app.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-ex][role=button]')) { e.preventDefault(); abrirPlayer(e.target.dataset.ex); }
  });
  window.addEventListener('hashchange', render);
  render();
})();
