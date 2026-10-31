# Visão Renovada

Código do site (www) e do app (autoavaliação), prontos para rodar em uma VPS com Docker.

## Serviços

| Serviço | Endereço | O que é |
|---|---|---|
| `site` | https://www.visaorenovada.com.br | Página de vendas do livro (estático, nginx) |
| `app` | https://app.visaorenovada.com.br | Autoavaliação de conforto visual (estático, nginx) |
| `caddy` | portas 80 e 443 | Proxy reverso com HTTPS automático (Let's Encrypt) |

O domínio sem `www` redireciona para `www`.

```
caddy/Caddyfile            rotas e HTTPS
services/site/public/      HTML e JS do site
services/app/public/       HTML e JS do app
shared/                    CSS e logo usados pelos dois (copiados para /assets no build)
docker-compose.yml         sobe tudo
deploy.sh                  atualiza a VPS (git pull + rebuild)
```

## Colocar no ar (primeira vez)

1. **DNS**: no registro do domínio, crie registros `A` apontando para o IP da VPS:
   `visaorenovada.com.br`, `www.visaorenovada.com.br` e `app.visaorenovada.com.br`.
2. **VPS** (Ubuntu/Debian): instale o Docker
   ```sh
   curl -fsSL https://get.docker.com | sh
   ```
   Libere as portas 80 e 443 no firewall. Se outro servidor web (Apache, nginx do painel, etc.) já usa essas portas, ele precisa ser parado ou o Caddy precisa sair do compose.
3. **Código**:
   ```sh
   git clone <url-do-repositorio> /opt/visaorenovada
   cd /opt/visaorenovada
   cp .env.example .env   # edite o e-mail
   docker compose up -d --build
   ```
4. Em 1 a 2 minutos o Caddy emite os certificados. Acompanhe com `docker compose logs -f caddy`.

## Atualizar

```sh
cd /opt/visaorenovada && ./deploy.sh
```

## Testar localmente

```sh
docker compose build
docker compose run --rm -p 8081:80 site   # http://localhost:8081
docker compose run --rm -p 8082:80 app    # http://localhost:8082
```

## Pendências de conteúdo

Os itens marcados em amarelo na página são exemplos: preço, link do checkout (`data-checkout`), autor, depoimentos, capítulos/bônus e CNPJ. Também faltam as páginas de política de privacidade e termos de uso.
