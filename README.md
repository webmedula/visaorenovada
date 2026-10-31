# Visão Renovada

Código do site (www) e do app (autoavaliação). Cada um é um serviço separado, publicado na VPS pelo **Easypanel**.

## Serviços

| Serviço | Domínio | Dockerfile | Porta |
|---|---|---|---|
| `site` | www.visaorenovada.com.br (+ visaorenovada.com.br, que redireciona para www) | `services/site/Dockerfile` | 80 |
| `app` | app.visaorenovada.com.br | `services/app/Dockerfile` | 80 |

```
services/site/public/   HTML e JS do site (página do livro)
services/app/public/    app: exercícios guiados, plano de 21 dias, pausas 20-20-20 e autoavaliação (/avaliacao)
services/app/public/assets/exercicios.js   conteúdo dos exercícios e do plano (edite aqui para ajustar ao livro)
shared/                 CSS e logo usados pelos dois (copiados para /assets no build)
docker-compose.yml      só para testar localmente
```

O HTTPS e o roteamento dos domínios ficam com o Easypanel.

## 1. DNS

No painel onde o domínio está registrado (Registro.br, Cloudflare, etc.), crie três registros **A** apontando para o IP da VPS `31.97.87.68`:

| Nome | Tipo | Valor |
|---|---|---|
| `@` (visaorenovada.com.br) | A | 31.97.87.68 |
| `www` | A | 31.97.87.68 |
| `app` | A | 31.97.87.68 |

Se o domínio estiver na Cloudflare, deixe o proxy (nuvem laranja) **desligado** até o certificado ser emitido.

## 2. Easypanel

1. **Create Project** com o nome `visaorenovada`.
2. Dentro do projeto, **+ Service → App** com o nome `site`:
   - **Source → GitHub**: owner `webmedula`, repository `visaorenovada`, branch `main`, build path `/`.
     (Se o Easypanel não listar o repositório, conecte sua conta do GitHub em Settings → GitHub.)
   - **Build → Dockerfile**, arquivo `services/site/Dockerfile`.
   - **Domains**: adicione `www.visaorenovada.com.br` e `visaorenovada.com.br`, ambos com HTTPS ligado e porta `80`.
   - Clique em **Deploy**.
3. Repita para um App chamado `app`:
   - mesmo repositório e branch, build path `/`
   - Dockerfile `services/app/Dockerfile`
   - domínio `app.visaorenovada.com.br`, porta `80`
4. Opcional: ative **Auto Deploy** em cada App para publicar sozinho a cada push no `main`.

Se o site antigo (WordPress) e o app antigo (Lovable) ainda usam esses domínios em outro lugar, remova os domínios de lá antes, ou mude o DNS só quando o Easypanel estiver pronto.

## Testar localmente

```sh
docker compose up --build
# site: http://localhost:8081   app: http://localhost:8082
```

## Pendências de conteúdo

Os exercícios e o plano de 7 dias do app vêm do livro (Capítulo 4 e Bônus 1) e ficam em `services/app/public/assets/exercicios.js`. Na página do site, os itens marcados em amarelo ainda são exemplos: preço, link do checkout (`data-checkout`), autor, depoimentos, capítulos/bônus e CNPJ. Falta também a foto do autor e as páginas de política de privacidade e termos de uso. O endereço impresso no livro, `www.visaorenovada.com.br/bonus2`, redireciona para a autoavaliação no app.
