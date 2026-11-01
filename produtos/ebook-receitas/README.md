# Cozinha Visão Renovada (ebook de receitas, upsell)

Fonte do ebook: `receitas.txt` (50 receitas), `dicas.txt` (uma dica por receita, na mesma ordem), `build.py` (cardápio, listas de compras, layout), `ebook.css`.

    python3 build.py   # gera ebook.html e receitas.json (dados para o app)
    node render.js     # gera ebook.pdf (use "node render.js png" para prévias em previews/)
    node capa.js       # gera capa.jpg

Arquivos finais publicados em /mnt/project-files/receitas/ (receitas.pdf, receitas.json, capa.jpg, upsell-kiwify.md).
