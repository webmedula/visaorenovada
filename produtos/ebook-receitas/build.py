#!/usr/bin/env python3
"""Gera o HTML do ebook "Cozinha Visão Renovada" a partir de receitas.txt.
Uso: python3 build.py  -> escreve ebook.html ao lado deste arquivo.
Depois: node render.js  -> ebook.pdf
"""
import html, math, random, re
from pathlib import Path

HERE = Path(__file__).parent
TITLE = "Cozinha Visão Renovada"
SUB = "50 receitas e um cardápio de 30 dias para nutrir seus olhos"

CATS = {
    "cafe":   {"nome": "Café da manhã", "cor": "#c98a1e", "soft": "#fbf0dc",
               "intro": "Começar o dia com ovos, frutas alaranjadas, aveia e sementes é o jeito mais simples de colocar luteína, vitamina A e ômega-3 na rotina antes mesmo de ligar a primeira tela."},
    "almoco": {"nome": "Almoço e jantar", "cor": "#0f5c5a", "soft": "#e3f0ec",
               "intro": "Pratos de comida de verdade, com peixe, folhas verde-escuras, leguminosas e legumes coloridos. Muitas receitas rendem para o dia seguinte e ajudam na marmita."},
    "lanche": {"nome": "Lanches", "cor": "#b5532f", "soft": "#f8e6dc",
               "intro": "Para a pausa do meio da tarde, aquela em que você também faz a regra 20-20-20. Trocas práticas para o salgadinho e o biscoito de pacote."},
    "bebida": {"nome": "Sucos e vitaminas", "cor": "#4c7d3a", "soft": "#e7f0de",
               "intro": "Bebidas que somam vitamina C, betacaroteno e, principalmente, água. A lágrima também depende da sua hidratação."},
}

# Nutrientes: cor do "prato" ilustrado, o que faz (de forma geral) e onde encontrar
NUTR = {
    "Luteína":       ("#5a8f3a", "Pigmento amarelo que se concentra na mácula, o centro da retina responsável pela visão de detalhes. Funciona como um filtro natural da luz azul e como antioxidante.", "couve, espinafre, rúcula, agrião, brócolis, abobrinha, gema de ovo"),
    "Zeaxantina":    ("#e2b11a", "Parceira da luteína, também se acumula na mácula e tem a mesma função de filtro e proteção.", "milho, gema de ovo, pimentão amarelo e laranja, folhas verde-escuras"),
    "Vitamina A":    ("#d9622b", "Indispensável para enxergar com pouca luz e para manter a córnea, a superfície do olho, saudável e lubrificada.", "ovos, leite e queijos; e, como betacaroteno, nos vegetais alaranjados e verde-escuros"),
    "Betacaroteno":  ("#ee8a24", "Pigmento laranja que o corpo transforma em vitamina A conforme precisa.", "cenoura, abóbora, batata-doce, manga, mamão, damasco seco, couve"),
    "Vitamina C":    ("#f2c14e", "Antioxidante presente em concentração alta dentro do próprio olho. Ajuda a proteger as células do desgaste diário.", "acerola, goiaba, laranja, kiwi, morango, pimentão, brócolis"),
    "Vitamina E":    ("#8a9a3b", "Antioxidante que protege as gorduras das membranas das células, incluindo as da retina.", "amêndoas, sementes de girassol, castanhas, abacate, azeite"),
    "Zinco":         ("#8b5a3c", "Mineral que ajuda a levar a vitamina A do fígado até a retina e participa de enzimas protetoras do olho.", "carnes, frango, ovos, feijão, lentilha, grão-de-bico, sementes de abóbora, castanha-de-caju"),
    "Ômega-3":       ("#e07a6f", "Gordura boa. O tipo DHA faz parte da estrutura da retina e o ômega-3 está ligado ao conforto do filme lacrimal.", "sardinha, salmão, atum, cavala; na forma vegetal, linhaça, chia e nozes"),
    "Antioxidantes": ("#6b3a6e", "Os pigmentos roxos e vermelhos das frutas ajudam a combater o estresse oxidativo do corpo como um todo.", "açaí, frutas vermelhas, uva, beterraba, tomate"),
    "Hidratação":    ("#3f8fb0", "A lágrima é feita principalmente de água. Beber pouco favorece o olho seco, sobretudo em ambientes com ar-condicionado.", "água, melancia, pepino, sucos naturais, sopas"),
}
NUTR_ORDER = ["Luteína", "Zeaxantina", "Vitamina A", "Betacaroteno", "Vitamina C", "Vitamina E", "Zinco", "Ômega-3", "Hidratação"]


def esc(s):
    return html.escape(s, quote=False)


# ---------------------------------------------------------------- parse
def parse():
    recs, cat, cur = [], None, None
    for raw in (HERE / "receitas.txt").read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        if not line:
            continue
        if line.startswith("== "):
            cat = line[3:].strip()
        elif line.startswith("# "):
            nome, tempo, rende, tags = [p.strip() for p in line[2:].split("|")]
            cur = {"cat": cat, "nome": nome, "tempo": tempo, "rende": rende,
                   "tags": [t.strip() for t in tags.split(",")], "ing": [], "prep": [], "por": ""}
            recs.append(cur)
        elif line.startswith("- "):
            cur["ing"].append(line[2:])
        elif line.startswith("> "):
            cur["prep"].append(line[2:])
        elif line.startswith("! "):
            cur["por"] = line[2:]
    dicas = (HERE / "dicas.txt").read_text(encoding="utf-8").strip().splitlines()
    assert len(dicas) == len(recs)
    for i, r in enumerate(recs, 1):
        r["n"] = i
        r["dica"] = dicas[i - 1].strip()
    return recs


R = parse()
assert len(R) == 50, len(R)
BYCAT = {c: [r for r in R if r["cat"] == c] for c in CATS}


def find(nome):
    for r in R:
        if r["nome"].lower().startswith(nome.lower()):
            return r
    raise KeyError(nome)


# ---------------------------------------------------------------- cardápio de 30 dias
cafes = [r for r in BYCAT["cafe"] if not r["nome"].startswith("Granola")]
lunch_order = ["Salmão", "Arroz, feijão", "Frango salteado", "Moqueca", "Escondidinho", "Salada de feijão-fradinho",
               "Galinhada", "Sardinha assada", "Kibe", "Tilápia", "Lentilha", "Abobrinha recheada",
               "Macarrão integral", "Falafel", "Salada morna"]
dinner_order = ["Sopa creme", "Fritada", "Caldo verde", "Salada morna", "Lentilha", "Falafel", "Abobrinha recheada", "Macarrão integral"]
L = [find(n) for n in lunch_order]
D = [find(n) for n in dinner_order]
LAN = BYCAT["lanche"]
BEB = BYCAT["bebida"]

DAYS = []
for d in range(30):
    lunch = L[d % len(L)]
    if d % 4 == 3:
        dinner = ("Sobras do almoço de ontem + salada de folhas escuras", L[(d - 1) % len(L)])
    else:
        dinner = (None, D[d % len(D)])
    cafe = cafes[(d * 5) % len(cafes)]  # passo 5 em 11 itens: percorre todos sem repetir em sequência
    DAYS.append({"dia": d + 1, "cafe": cafe, "almoco": lunch, "lanche": LAN[(d * 3) % 10], "bebida": BEB[(d * 7) % 10], "jantar": dinner})

WEEKS = [(1, 7), (8, 14), (15, 21), (22, 30)]

# ---------------------------------------------------------------- lista de compras
SHOP = [  # (categoria, item, regex)
    ("Verduras e legumes", "Espinafre", r"espinafre"),
    ("Verduras e legumes", "Couve-manteiga", r"\bcouve\b"),
    ("Verduras e legumes", "Rúcula", r"rúcula"),
    ("Verduras e legumes", "Agrião", r"agrião"),
    ("Verduras e legumes", "Folhas verde-escuras para salada", r"salada (verde|de folhas)"),
    ("Verduras e legumes", "Brócolis", r"brócolis"),
    ("Verduras e legumes", "Cenoura", r"cenoura"),
    ("Verduras e legumes", "Abóbora cabotiá", r"abóbora cabotiá"),
    ("Verduras e legumes", "Batata-doce", r"batata-doce|batatas-doces"),
    ("Verduras e legumes", "Batata", r"\bbatatas? médias"),
    ("Verduras e legumes", "Abobrinha", r"abobrinha"),
    ("Verduras e legumes", "Pimentão vermelho / amarelo", r"pimentão (vermelho|amarelo)|pimentões|pimentão$|1 pimentão em|pimentão em"),
    ("Verduras e legumes", "Pimentão verde", r"pimentão verde"),
    ("Verduras e legumes", "Tomate", r"tomate(?!-cereja|s-cereja)"),
    ("Verduras e legumes", "Tomate-cereja", r"tomates?-cereja"),
    ("Verduras e legumes", "Pepino", r"pepino"),
    ("Verduras e legumes", "Beterraba", r"beterraba"),
    ("Verduras e legumes", "Milho verde", r"milho verde"),
    ("Verduras e legumes", "Cebola roxa", r"cebola roxa"),
    ("Verduras e legumes", "Gengibre", r"gengibre"),
    ("Verduras e legumes", "Cheiro-verde, coentro, salsinha", r"cheiro-verde|coentro|salsinha"),
    ("Verduras e legumes", "Hortelã e manjericão", r"hortelã|manjericão"),
    ("Verduras e legumes", "Limão", r"limão"),
    ("Frutas", "Laranja", r"laranja"),
    ("Frutas", "Manga", r"manga"),
    ("Frutas", "Mamão", r"mamão"),
    ("Frutas", "Banana", r"banana"),
    ("Frutas", "Morango", r"morango"),
    ("Frutas", "Kiwi", r"kiwi"),
    ("Frutas", "Abacate", r"abacate"),
    ("Frutas", "Abacaxi", r"abacaxi"),
    ("Frutas", "Acerola (fresca ou polpa)", r"acerola"),
    ("Frutas", "Goiaba vermelha", r"goiaba"),
    ("Frutas", "Maracujá", r"maracujá"),
    ("Frutas", "Melancia", r"melancia"),
    ("Frutas", "Polpa de açaí sem açúcar", r"açaí"),
    ("Frutas", "Damasco seco", r"damasco"),
    ("Peixes, carnes e ovos", "Ovos", r"\bovos?\b"),
    ("Peixes, carnes e ovos", "Salmão", r"salmão"),
    ("Peixes, carnes e ovos", "Sardinha (fresca ou em lata)", r"sardinha"),
    ("Peixes, carnes e ovos", "Atum em lata", r"\batum\b"),
    ("Peixes, carnes e ovos", "Tilápia", r"tilápia"),
    ("Peixes, carnes e ovos", "Peixe para moqueca", r"peixe em postas"),
    ("Peixes, carnes e ovos", "Frango (peito ou sobrecoxa)", r"frango"),
    ("Peixes, carnes e ovos", "Carne moída magra", r"carne moída"),
    ("Laticínios", "Leite (animal ou vegetal)", r"\bleite\b(?! de coco)"),
    ("Laticínios", "Iogurte natural", r"iogurte"),
    ("Laticínios", "Ricota", r"ricota"),
    ("Laticínios", "Queijo minas", r"queijo minas"),
    ("Laticínios", "Queijo ralado / parmesão", r"queijo ralado|parmesão"),
    ("Grãos, leguminosas e sementes", "Aveia em flocos", r"aveia"),
    ("Grãos, leguminosas e sementes", "Arroz (de preferência integral)", r"\barroz\b"),
    ("Grãos, leguminosas e sementes", "Macarrão integral", r"macarrão"),
    ("Grãos, leguminosas e sementes", "Pão integral", r"pão integral|torradas integrais"),
    ("Grãos, leguminosas e sementes", "Goma de tapioca", r"tapioca"),
    ("Grãos, leguminosas e sementes", "Flocão de milho", r"flocão"),
    ("Grãos, leguminosas e sementes", "Trigo para kibe", r"trigo para kibe"),
    ("Grãos, leguminosas e sementes", "Feijão", r"feijão cozido"),
    ("Grãos, leguminosas e sementes", "Feijão-fradinho", r"fradinho"),
    ("Grãos, leguminosas e sementes", "Lentilha", r"lentilha"),
    ("Grãos, leguminosas e sementes", "Grão-de-bico", r"grão-de-bico"),
    ("Grãos, leguminosas e sementes", "Milho de pipoca", r"milho de pipoca"),
    ("Grãos, leguminosas e sementes", "Linhaça dourada", r"linhaça"),
    ("Grãos, leguminosas e sementes", "Chia", r"chia"),
    ("Grãos, leguminosas e sementes", "Sementes de abóbora", r"sementes de abóbora"),
    ("Grãos, leguminosas e sementes", "Sementes de girassol", r"girassol"),
    ("Grãos, leguminosas e sementes", "Gergelim / tahine", r"gergelim|tahine"),
    ("Grãos, leguminosas e sementes", "Castanhas, amêndoas ou nozes", r"castanha|amêndoa|nozes"),
    ("Grãos, leguminosas e sementes", "Pasta de amendoim", r"amendoim"),
    ("Despensa", "Leite de coco", r"leite de coco"),
    ("Despensa", "Mel", r"\bmel\b"),
    ("Despensa", "Cacau em pó", r"cacau"),
    ("Despensa", "Shoyu", r"shoyu"),
    ("Despensa", "Cúrcuma, páprica, cominho, canela", r"cúrcuma|páprica|cominho|canela"),
]
SHOP_CATS = ["Verduras e legumes", "Frutas", "Peixes, carnes e ovos", "Laticínios", "Grãos, leguminosas e sementes", "Despensa"]


def shopping(a, b):
    used = []
    for day in DAYS[a - 1:b]:
        used += [day["cafe"], day["almoco"], day["lanche"], day["bebida"]]
        if day["jantar"][0] is None:
            used.append(day["jantar"][1])
    if a == 1:
        used.append(find("Granola"))  # preparo de domingo
    out = {}
    for cat, item, rx in SHOP:
        k = sum(1 for r in used if any(re.search(rx, i.lower()) for i in r["ing"]))
        if k:
            out.setdefault(cat, []).append((item, k))
    return out


# ---------------------------------------------------------------- ilustrações
def plate_svg(r, size=120):
    """Prato abstrato: cada círculo colorido representa um nutriente da receita."""
    rnd = random.Random(r["n"] * 7919)
    cols = [NUTR[t][0] for t in r["tags"] if t in NUTR] or ["#5a8f3a"]
    cx = cy = 60
    parts = [f'<circle cx="60" cy="60" r="57" fill="#fffdf9" stroke="#e3ddd2" stroke-width="1.2"/>',
             f'<circle cx="60" cy="60" r="45" fill="none" stroke="#efe8da" stroke-width="1"/>']
    blobs = []
    n = 11 + rnd.randint(0, 4)
    for k in range(n):
        col = cols[k % len(cols)]
        ang = rnd.uniform(0, 2 * math.pi)
        dist = math.sqrt(rnd.uniform(0, 1)) * 30
        rad = rnd.uniform(6, 13)
        blobs.append((cx + dist * math.cos(ang), cy + dist * math.sin(ang), rad, col, rnd.uniform(.72, .95)))
    for x, y, rad, col, op in sorted(blobs, key=lambda b: -b[2]):
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rad:.1f}" fill="{col}" fill-opacity="{op:.2f}"/>')
    # folhinha
    lx, ly = cx + rnd.uniform(-14, 14), cy + rnd.uniform(-14, 14)
    parts.append(f'<path d="M{lx:.1f} {ly:.1f} q 8 -10 18 -6 q -4 10 -18 6z" fill="#2f6b3a" fill-opacity=".85"/>')
    return f'<svg viewBox="0 0 120 120" width="{size}" height="{size}" aria-hidden="true">{"".join(parts)}</svg>'


EYE = '<svg viewBox="0 0 32 32" width="{s}" height="{s}"><path d="M2 16c4-7 9-10 14-10s10 3 14 10c-4 7-9 10-14 10S6 23 2 16z" fill="none" stroke="{c}" stroke-width="2.4"/><circle cx="16" cy="16" r="5" fill="#e8a33d"/></svg>'
ICON_CLOCK = '<svg viewBox="0 0 24 24" width="11" height="11"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
ICON_BOWL = '<svg viewBox="0 0 24 24" width="11" height="11"><path d="M3 11h18a9 9 0 0 1-18 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 7c0-1.5 1-2 1-3M12 7c0-1.5 1-2 1-3M16 7c0-1.5 1-2 1-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'


def cover_art():
    """Olho cujo íris é um prato colorido de alimentos."""
    rnd = random.Random(42)
    palette = ["#ee8a24", "#5a8f3a", "#e2b11a", "#e07a6f", "#d9622b", "#8a9a3b", "#f2c14e", "#3f8fb0", "#6b3a6e"]
    dots = []
    for k in range(70):
        ang = rnd.uniform(0, 2 * math.pi)
        dist = math.sqrt(rnd.uniform(0, 1)) * 80
        rad = rnd.uniform(6, 15)
        dots.append((200 + dist * math.cos(ang), 200 + dist * math.sin(ang), rad, palette[k % len(palette)], rnd.uniform(.78, .96)))
    d = "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{c}" fill-opacity="{o:.2f}"/>' for x, y, r, c, o in sorted(dots, key=lambda b: -b[2]))
    leaves = ""
    for ang in range(0, 360, 30):
        leaves += f'<g transform="rotate({ang} 200 200)"><path d="M200 92 q 10 -16 0 -30 q -10 14 0 30z" fill="#e8a33d" fill-opacity=".55"/></g>'
    return f'''<svg viewBox="0 0 400 400" class="cover-art" aria-hidden="true">
      <defs><clipPath id="iris"><circle cx="200" cy="200" r="88"/></clipPath>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff6e0" stop-opacity=".22"/><stop offset="1" stop-color="#fff6e0" stop-opacity="0"/></radialGradient></defs>
      <circle cx="200" cy="200" r="196" fill="url(#glow)"/>
      {leaves}
      <path d="M22 200 C 80 92, 140 60, 200 60 S 320 92, 378 200 C 320 308, 260 340, 200 340 S 80 308, 22 200z" fill="none" stroke="#e8a33d" stroke-width="5"/>
      <circle cx="200" cy="200" r="98" fill="#fffdf9"/>
      <circle cx="200" cy="200" r="88" fill="#f4ecdc"/>
      <g clip-path="url(#iris)">{d}</g>
      <circle cx="200" cy="200" r="98" fill="none" stroke="#e3ddd2" stroke-width="2"/>
      <circle cx="232" cy="166" r="11" fill="#fff" fill-opacity=".85"/>
    </svg>'''


# ---------------------------------------------------------------- páginas
PAGES = []  # (html, opts)


def page(body, cls="", footer=True, label=""):
    PAGES.append({"body": body, "cls": cls, "footer": footer, "label": label})
    return len(PAGES)


def chips(tags):
    return "".join(f'<span class="chip"><i style="background:{NUTR.get(t, ("#999",))[0]}"></i>{esc(t)}</span>' for t in tags)


# 1. capa
page(f'''
<div class="cover-top">{EYE.format(s=26, c="#f7f4ee")}<span>Visão Renovada</span></div>
<div class="cover-art-wrap">{cover_art()}</div>
<div class="cover-txt">
  <div class="kicker">Complemento do livro Visão Renovada</div>
  <h1>Cozinha<br><em>Visão Renovada</em></h1>
  <p class="cover-sub">50 receitas e um cardápio de 30 dias<br>para nutrir seus olhos de dentro para fora</p>
  <div class="cover-badges"><span>50 receitas</span><span>Cardápio de 30 dias</span><span>Listas de compras</span></div>
</div>''', cls="cover", footer=False)

# placeholder pages for numbering (filled later)
P_CRED = page("", cls="plain", footer=False)
P_SUM = page("")

# intro
P_INTRO = page(f'''
<div class="eyebrow">Antes de começar</div>
<h2>O terceiro pilar<br>da sua visão</h2>
<p class="lead">No livro, você aprendeu a cuidar dos olhos com pausas, exercícios, ergonomia e bons hábitos. Este livro de receitas cuida do pilar que acontece três vezes por dia, na mesa.</p>
<p>No capítulo 6 de <em>Visão Renovada</em>, o Dr. Ethan Cole resume a sua filosofia em poucas palavras: quanto mais colorido e natural for o prato, melhor. Folhas verde-escuras, legumes de cor intensa, ovos, sementes e peixes trazem nutrientes que a retina, a mácula e a lágrima usam todos os dias.</p>
<p>O desafio é transformar esse conselho em comida no prato, numa semana corrida. Foi para isso que este livro foi feito: <strong>50 receitas simples, com ingredientes de feira e mercado</strong>, um <strong>cardápio de 30 dias</strong> que já combina tudo para você e <strong>listas de compras semanais</strong> para você não ter que pensar no que comprar.</p>
<blockquote>“Eu não acredito em soluções milagrosas. Acredito em consistência.”<cite>Dr. Ethan Cole, em Visão Renovada</cite></blockquote>
<p>Nenhum alimento sozinho muda a sua visão, e nenhuma receita aqui promete isso. O que faz diferença é a repetição de boas escolhas, semana após semana. Por isso cada receita traz o quadro <strong>Por que faz bem aos olhos</strong>, para você entender o que está colocando no prato e por quê.</p>
''', label="Antes de começar")

# guia de nutrientes
counts = {k: sum(1 for r in R if k in r["tags"]) for k in NUTR}
nutr_rows = "".join(f'''<div class="nutr"><div class="nutr-dot" style="background:{NUTR[k][0]}"></div><div>
<h4>{k} <span>em {counts[k]} receitas</span></h4><p>{esc(NUTR[k][1])}</p><p class="onde"><b>Onde encontrar:</b> {esc(NUTR[k][2])}.</p></div></div>''' for k in NUTR_ORDER[:5])
nutr_rows2 = "".join(f'''<div class="nutr"><div class="nutr-dot" style="background:{NUTR[k][0]}"></div><div>
<h4>{k} <span>em {counts[k]} receitas</span></h4><p>{esc(NUTR[k][1])}</p><p class="onde"><b>Onde encontrar:</b> {esc(NUTR[k][2])}.</p></div></div>''' for k in NUTR_ORDER[5:])
P_NUTR = page(f'''<div class="eyebrow">Guia rápido</div><h2>Os nutrientes do olhar</h2>
<p class="small">Cada cor abaixo aparece nos pratos ilustrados das receitas. Assim você vê, num relance, o que cada receita oferece.</p>{nutr_rows}''', label="Os nutrientes do olhar")
page(f'''{nutr_rows2}<div class="note"><b>Um lembrete honesto:</b> esses nutrientes fazem parte do funcionamento normal dos olhos, e uma alimentação variada é a melhor forma de recebê-los. Suplementos são outra conversa, que precisa ser feita com o seu médico.</div>''', label="Os nutrientes do olhar")

# regras
regras = [
    ("Gordura boa junto", "Luteína, zeaxantina, betacaroteno e vitaminas A e E se dissolvem em gordura. Um fio de azeite na salada, o abacate, a gema ou as castanhas ajudam o corpo a aproveitá-los."),
    ("Cozinhe pouco os verdes", "Folhas e brócolis ficam melhores no vapor ou salteados rapidamente, até ficarem verde vivo. Cozimento longo leva parte das vitaminas embora."),
    ("Pinte o prato", "Tente ter pelo menos três cores por refeição: um verde-escuro, um laranja ou vermelho e uma proteína. Cores diferentes, nutrientes diferentes."),
    ("Peixe duas vezes por semana", "Sardinha, salmão, atum ou outro peixe. Em lata também vale, e a sardinha costuma ser a opção mais barata."),
    ("Água à vista", "Uma garrafa ou jarra na mesa de trabalho. A hidratação é parte do cuidado com a lágrima, como você viu no livro."),
    ("Regularidade, não perfeição", "Seguir o cardápio na maior parte dos dias já é ótimo. Trocou uma refeição? Tudo bem. Volte na próxima."),
]
regras_html = "".join(f'<div class="regra"><div class="regra-n">{i}</div><div><h4>{esc(t)}</h4><p>{esc(x)}</p></div></div>' for i, (t, x) in enumerate(regras, 1))
P_REGRAS = page(f'<div class="eyebrow">Na prática</div><h2>Seis regras da cozinha<br>que cuida dos olhos</h2>{regras_html}', label="Seis regras")

# como usar
P_COMO = page(f'''<div class="eyebrow">Como usar este livro</div><h2>Três jeitos de aproveitar</h2>
<div class="uso"><div class="uso-n">1</div><div><h4>Siga o cardápio de 30 dias</h4><p>Cada dia já tem café da manhã, almoço, lanche, jantar e uma bebida, com a página de cada receita. O cardápio inclui peixe cerca de duas vezes por semana e aproveita sobras para você não cozinhar todo dia.</p></div></div>
<div class="uso"><div class="uso-n">2</div><div><h4>Use a lista de compras da semana</h4><p>Para cada semana há uma lista organizada por seção do mercado. O número ao lado de cada item mostra em quantas receitas da semana ele aparece, para você calcular a quantidade para a sua casa.</p></div></div>
<div class="uso"><div class="uso-n">3</div><div><h4>Ou escolha livremente</h4><p>Prefere montar o seu próprio cardápio? Escolha pela categoria ou pelo nutriente que quer reforçar. As cores dos pratos ilustrados ajudam a variar.</p></div></div>
<div class="anatomia">
  <h4>Como ler uma receita</h4>
  <ul><li><b>Tempo e rendimento</b> no topo, para planejar.</li><li><b>Etiquetas coloridas</b> com os principais nutrientes da receita.</li><li><b>Por que faz bem aos olhos:</b> o quadro final explica a ligação com a sua visão, sem exageros.</li></ul>
  <p class="small">As receitas usam medidas caseiras (xícara de 240 ml, colher de sopa e de chá). As porções são para adultos; ajuste o sal e as quantidades à sua realidade.</p>
</div>''', label="Como usar")

# receitas
RECIPE_PAGE = {}
CAT_PAGE = {}
for ck, cat in CATS.items():
    lst = BYCAT[ck]
    first = len(PAGES) + 2
    items = "".join(f'<li><span>{esc(r["nome"])}</span><b>{first + k}</b></li>' for k, r in enumerate(lst))
    CAT_PAGE[ck] = page(f'''<div class="div-num">{list(CATS).index(ck) + 1:02d}</div>
<h2>{cat["nome"]}</h2><p class="div-intro">{esc(cat["intro"])}</p><ul class="div-list">{items}</ul>''', cls=f"divider", footer=False)
    for r in lst:
        ing = "".join(f"<li>{esc(i)}</li>" for i in r["ing"])
        prep = "".join(f"<li>{esc(p)}</li>" for p in r["prep"])
        RECIPE_PAGE[r["n"]] = page(f'''
<div class="r-head">
  <div class="r-head-txt">
    <div class="r-cat" style="color:{cat["cor"]}">{cat["nome"]} · Receita {r["n"]:02d}</div>
    <h3>{esc(r["nome"])}</h3>
    <div class="r-meta"><span>{ICON_CLOCK} {esc(r["tempo"])}</span><span>{ICON_BOWL} {esc(r["rende"])}</span></div>
    <div class="chips">{chips(r["tags"])}</div>
  </div>
  <div class="r-plate">{plate_svg(r, 92)}</div>
</div>
<div class="r-body">
  <div class="r-ing" style="background:{cat["soft"]}"><h5>Ingredientes</h5><ul>{ing}</ul></div>
  <div class="r-prep"><h5>Modo de preparo</h5><ol>{prep}</ol></div>
</div>
<div class="r-why">{EYE.format(s=20, c="#0f5c5a")}<div><h5>Por que faz bem aos olhos</h5><p>{esc(r["por"])}</p></div></div>
<div class="r-tip"><b>Dica</b>{esc(r["dica"])}</div>
<div class="r-notes"><h5>Minhas anotações</h5><div></div></div>
''', cls=f"recipe cat-{ck}", label=cat["nome"])

# cardápio
P_CARD_DIV = page(f'''<div class="div-num">05</div><h2>Cardápio de 30 dias</h2>
<p class="div-intro">Um mês inteiro já planejado, com as 50 receitas distribuídas para você variar cores e nutrientes. O número ao lado de cada prato é a página da receita.</p>
<ul class="div-list plain"><li><span>Peixe cerca de 2 vezes por semana</span></li><li><span>Sobras planejadas a cada 4 dias</span></li><li><span>Uma bebida diferente por dia</span></li><li><span>Listas de compras semanais no final</span></li></ul>''', cls="divider", footer=False)


def link(r):
    return f'{esc(r["nome"])} <b>{RECIPE_PAGE[r["n"]]}</b>'


def day_card(d):
    jt, jr = d["jantar"]
    jtxt = f'{esc(jt)}' if jt else link(jr)
    week = (d["dia"] - 1) // 7 + 1 if d["dia"] <= 21 else 4
    return f'''<div class="day"><div class="day-h"><span>Dia {d["dia"]}</span><em>Semana {week}</em></div>
<dl><dt>Café</dt><dd>{link(d["cafe"])}</dd><dt>Almoço</dt><dd>{link(d["almoco"])}</dd>
<dt>Lanche</dt><dd>{link(d["lanche"])}</dd><dt>Jantar</dt><dd>{jtxt}</dd><dt>Bebida</dt><dd>{link(d["bebida"])}</dd></dl></div>'''


CARD_PAGES = []
for i in range(0, 30, 6):
    extra = ""
    if i == 0:
        extra = '<div class="prep-tip"><b>Domingo antes do dia 1:</b> prepare a <b>Granola caseira</b> (p. ' + str(RECIPE_PAGE[find("Granola")["n"]]) + ') e, se quiser, os <b>Muffins salgados</b>. Eles resolvem vários cafés da manhã.</div>'
    CARD_PAGES.append(page(extra + '<div class="days">' + "".join(day_card(d) for d in DAYS[i:i + 6]) + "</div>", cls="cardapio", label="Cardápio de 30 dias"))

# listas de compras
SHOP_PAGES = []
for wi, (a, b) in enumerate(WEEKS, 1):
    sh = shopping(a, b)
    cols = ""
    for c in SHOP_CATS:
        if c not in sh:
            continue
        lis = "".join(f'<li><span class="box"></span>{esc(it)}<em>×{k}</em></li>' for it, k in sh[c])
        cols += f'<div class="shop-cat"><h5>{esc(c)}</h5><ul>{lis}</ul></div>'
    SHOP_PAGES.append(page(f'''<div class="eyebrow">Lista de compras</div><h2 class="h-shop">Semana {wi} <span>dias {a} a {b}</span></h2>
<div class="shop">{cols}</div>
<p class="shop-foot">Básicos que você provavelmente já tem: sal, pimenta-do-reino, azeite, óleo, alho e cebola. O número ao lado de cada item é quantas receitas da semana o usam.</p>''', cls="shoppage", label="Listas de compras"))

# prato modelo
P_PRATO = page(f'''<div class="eyebrow">Para todas as refeições</div><h2>Monte o seu prato<br>que cuida dos olhos</h2>
<p>Quando você não estiver seguindo uma receita, use este modelo simples para qualquer almoço ou jantar.</p>
<div class="prato">
<svg viewBox="0 0 200 200" width="190" height="190"><circle cx="100" cy="100" r="96" fill="#fffdf9" stroke="#e3ddd2" stroke-width="2"/>
<path d="M100 100 L100 14 A86 86 0 0 1 100 186 Z" fill="#5a8f3a" fill-opacity=".85"/>
<path d="M100 100 L100 186 A86 86 0 0 1 14 100 Z" fill="#ee8a24" fill-opacity=".85"/>
<path d="M100 100 L14 100 A86 86 0 0 1 100 14 Z" fill="#8b5a3c" fill-opacity=".8"/>
<circle cx="182" cy="22" r="11" fill="#e2b11a" stroke="#fffdf9" stroke-width="2"/></svg>
<div class="prato-leg">
<p><i style="background:#5a8f3a"></i><b>Metade: vegetais</b>, com pelo menos um verde-escuro (couve, espinafre, rúcula, brócolis) e um colorido (cenoura, abóbora, pimentão, tomate).</p>
<p><i style="background:#8b5a3c"></i><b>Um quarto: proteína.</b> Peixe duas vezes por semana; nos outros dias ovos, frango, carne magra ou leguminosas.</p>
<p><i style="background:#ee8a24"></i><b>Um quarto: carboidrato de verdade</b>, como arroz, batata-doce, milho, mandioca ou macarrão integral.</p>
<p><i style="background:#e2b11a"></i><b>Um toque de gordura boa:</b> azeite, abacate, castanhas ou sementes, para aproveitar os nutrientes das cores.</p>
</div></div>
<p class="small">E, para beber, água. Este modelo é um ponto de partida para pessoas saudáveis; quem tem diabetes, doença renal ou outra condição deve adaptar as quantidades com um nutricionista.</p>''', label="Monte o seu prato")

# fechamento
P_FIM = page(f'''<div class="end-eye">{EYE.format(s=46, c="#f7f4ee")}</div>
<h2>Do prato para a tela,<br>da tela para a pausa</h2>
<p>As receitas cuidam dos olhos por dentro. O resto do cuidado continua no livro e no app <b>Visão Renovada</b>: os exercícios guiados, os lembretes da pausa 20-20-20 e a autoavaliação para acompanhar como você está.</p>
<p>Uma sugestão para o próximo mês: escolha um horário fixo para os exercícios, deixe a jarra de água à vista e siga o cardápio. Pequenas escolhas repetidas são o que constrói uma visão mais confortável.</p>
<p class="end-sign">Bom apetite e bons olhos.</p>''', cls="end", footer=False)

# créditos + aviso
PAGES[P_CRED - 1]["body"] = f'''
<div class="cred">
<h4>{TITLE}</h4><p>{SUB}.</p>
<p>Complemento do livro <em>Visão Renovada</em>, do Dr. Ethan Cole.<br>Edição digital, 2026. WebMedula · CNPJ 39.505.168/0001-94.</p>
<p>Todos os direitos reservados. Este livro é de uso pessoal do comprador e não pode ser copiado, revendido ou distribuído, no todo ou em parte, sem autorização.</p>
<div class="aviso"><h5>Aviso importante</h5>
<p>Este livro traz receitas e informações gerais sobre alimentação. Ele não substitui consulta, diagnóstico ou tratamento com médico oftalmologista, nutricionista ou outro profissional de saúde, e nenhuma receita aqui trata, cura ou corrige problemas de visão ou de grau.</p>
<p>Converse com seu médico ou nutricionista antes de mudar a alimentação se você tem diabetes, doença renal, alergias ou intolerâncias, está grávida ou amamentando, ou usa anticoagulantes como a varfarina (folhas verde-escuras são ricas em vitamina K e podem interferir na dose).</p>
<p>Se notar mudança súbita na visão, dor nos olhos, flashes de luz ou manchas novas, procure atendimento médico imediatamente.</p></div>
</div>'''

# sumário
def toc_item(t, p, sub=False):
    return f'<li class="{"sub" if sub else ""}"><span>{esc(t)}</span><i></i><b>{p}</b></li>'


toc = [toc_item("Antes de começar: o terceiro pilar da sua visão", P_INTRO), toc_item("Os nutrientes do olhar", P_NUTR),
       toc_item("Seis regras da cozinha que cuida dos olhos", P_REGRAS), toc_item("Como usar este livro", P_COMO)]
for ck, cat in CATS.items():
    toc.append(toc_item(f'{cat["nome"]} · {len(BYCAT[ck])} receitas', CAT_PAGE[ck]))
toc += [toc_item("Cardápio de 30 dias", P_CARD_DIV), toc_item("Listas de compras das 4 semanas", SHOP_PAGES[0]),
        toc_item("Monte o seu prato que cuida dos olhos", P_PRATO), toc_item("Do prato para a tela", P_FIM)]
PAGES[P_SUM - 1]["body"] = f'<div class="eyebrow">Sumário</div><h2>Nesta cozinha</h2><ul class="toc">{"".join(toc)}</ul>'
PAGES[P_SUM - 1]["label"] = "Sumário"

# índice por nutriente ao final? (cabe no sumário de receitas das divisórias)

CSS = (HERE / "ebook.css").read_text(encoding="utf-8")
out = []
for i, p in enumerate(PAGES, 1):
    foot = f'<div class="foot"><span>{esc(p["label"] or TITLE)}</span><span>{i}</span></div>' if p["footer"] else ""
    out.append(f'<section class="page {p["cls"]}" data-n="{i}"><div class="inner">{p["body"]}</div>{foot}</section>')

doc = f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>{TITLE}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{"".join(out)}</body></html>'''
(HERE / "ebook.html").write_text(doc, encoding="utf-8")
print(f"{len(PAGES)} páginas")


# ---------------------------------------------------------------- JSON para o app
import json, unicodedata


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def tempo_min(t):
    return int(re.match(r"\d+", t).group())


def porcoes(t):
    m = re.match(r"(\d+) porç", t)
    return int(m.group(1)) if m else None


AVISO = ("Este livro traz receitas e informações gerais sobre alimentação. Ele não substitui consulta, diagnóstico ou tratamento com médico "
         "oftalmologista, nutricionista ou outro profissional de saúde, e nenhuma receita aqui trata, cura ou corrige problemas de visão ou de grau. "
         "Converse com seu médico ou nutricionista antes de mudar a alimentação se você tem diabetes, doença renal, alergias ou intolerâncias, está "
         "grávida ou amamentando, ou usa anticoagulantes como a varfarina (folhas verde-escuras são ricas em vitamina K e podem interferir na dose). "
         "Se notar mudança súbita na visão, dor nos olhos, flashes de luz ou manchas novas, procure atendimento médico imediatamente.")
ids = {r["n"]: slug(r["nome"]) for r in R}
data = {
    "titulo": TITLE, "subtitulo": SUB, "autor": "Visão Renovada (complemento do livro do Dr. Ethan Cole)", "versao": "2026-11-01",
    "introducao": ("No livro, você aprendeu a cuidar dos olhos com pausas, exercícios, ergonomia e bons hábitos. Estas receitas cuidam do pilar que "
                   "acontece três vezes por dia, na mesa: 50 receitas simples, um cardápio de 30 dias e listas de compras semanais. Nenhum alimento "
                   "sozinho muda a sua visão; o que faz diferença é a repetição de boas escolhas."),
    "categorias": [{"id": k, "nome": v["nome"], "descricao": v["intro"], "cor": v["cor"]} for k, v in CATS.items()],
    "nutrientes": [{"nome": k, "cor": NUTR[k][0], "funcao": NUTR[k][1], "onde_encontrar": NUTR[k][2]} for k in NUTR],
    "regras": [{"titulo": t, "texto": x} for t, x in regras],
    "receitas": [{
        "id": ids[r["n"]], "numero": r["n"], "nome": r["nome"], "categoria": r["cat"], "tempo_min": tempo_min(r["tempo"]), "tempo": r["tempo"],
        "porcoes": porcoes(r["rende"]), "rendimento": r["rende"], "dificuldade": "fácil" if tempo_min(r["tempo"]) <= 40 else "média",
        "ingredientes": r["ing"], "preparo": r["prep"], "beneficios": r["por"], "nutrientes": r["tags"], "dica": r["dica"],
        "pagina_pdf": RECIPE_PAGE[r["n"]]} for r in R],
    "cardapio": [{
        "dia": d["dia"], "semana": min((d["dia"] - 1) // 7 + 1, 4), "cafe": ids[d["cafe"]["n"]], "almoco": ids[d["almoco"]["n"]],
        "lanche": ids[d["lanche"]["n"]], "bebida": ids[d["bebida"]["n"]],
        "jantar": ids[d["jantar"][1]["n"]] if d["jantar"][0] is None else None,
        "jantar_texto": d["jantar"][0]} for d in DAYS],
    "listas_compras": [{"semana": i, "dias": [a, b], "secoes": [{"nome": c, "itens": [{"item": it, "receitas": k} for it, k in shopping(a, b).get(c, [])]}
                       for c in SHOP_CATS if c in shopping(a, b)]} for i, (a, b) in enumerate(WEEKS, 1)],
    "aviso": AVISO,
}
(HERE / "receitas.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
