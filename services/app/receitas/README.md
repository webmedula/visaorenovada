# Área de receitas (conteúdo pago)

- `receitas.json`: receitas renderizadas pelo app em `#receitas`. Formato: ver exemplo no próprio arquivo.
- `receitas.pdf`: ebook "Cozinha Visão Renovada" (74 páginas) para download; `capa.jpg` é a capa. A fonte do ebook fica em produtos/ebook-receitas (JSON gerado por build.py).

Tudo nesta pasta é servido em `/receitas/` **protegido por código de acesso** (HTTP Basic no nginx).
O código é definido no build pela variável `RECEITAS_CODIGO` (no Easypanel: Build → Build Args,
ou variável de ambiente de build). Usuário fixo: `leitor`. Para trocar o código, altere a variável
e reimplante.
