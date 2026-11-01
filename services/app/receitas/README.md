# Área de receitas (conteúdo pago)

- `receitas.json`: receitas renderizadas pelo app em `#receitas`. Formato: ver exemplo no próprio arquivo.
- `receitas.pdf`: ebook para download (coloque aqui quando estiver pronto e preencha `"pdf": "receitas.pdf"` no JSON).

Tudo nesta pasta é servido em `/receitas/` **protegido por código de acesso** (HTTP Basic no nginx).
O código é definido no build pela variável `RECEITAS_CODIGO` (no Easypanel: Build → Build Args,
ou variável de ambiente de build). Usuário fixo: `leitor`. Para trocar o código, altere a variável
e reimplante.
