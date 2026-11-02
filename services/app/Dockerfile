# Etapa 1: build da Autoavaliação (React/Vite) em /avaliacao/
FROM node:20-alpine AS avaliacao
WORKDIR /build
COPY services/app/avaliacao/package.json services/app/avaliacao/package-lock.json ./
# O package-lock.json veio desatualizado do Lovable (faltam jspdf e deps de teste),
# por isso `npm install` em vez de `npm ci`.
RUN npm install --no-audit --no-fund --loglevel=error
COPY services/app/avaliacao/ ./
RUN npm run build

# Etapa 2: senhas do app (livro) e das receitas (códigos entregues a quem compra)
FROM alpine:3.20 AS senha
ARG RECEITAS_CODIGO=TROQUE-ESTE-CODIGO
ARG APP_CODIGO=TROQUE-ESTE-CODIGO
RUN apk add --no-cache openssl \
 && printf 'leitor:%s\n' "$(openssl passwd -apr1 "$RECEITAS_CODIGO")" > /htpasswd \
 && printf 'membro:%s\n' "$(openssl passwd -apr1 "$APP_CODIGO")" > /app.htpasswd

# Etapa 3: nginx servindo o app de exercícios (estático), a autoavaliação e as receitas
FROM nginx:1.27-alpine
RUN apk add --no-cache openssl
COPY services/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=senha /htpasswd /etc/nginx/receitas.htpasswd
COPY --from=senha /app.htpasswd /etc/nginx/app.htpasswd
# Os códigos também podem vir das variáveis de ambiente RECEITAS_CODIGO e APP_CODIGO (lidas na partida)
COPY services/app/receitas-codigo.sh /docker-entrypoint.d/40-receitas-codigo.sh
RUN chmod +x /docker-entrypoint.d/40-receitas-codigo.sh
COPY services/app/receitas/ /usr/share/nginx/html/receitas/
COPY services/app/conteudo/ /usr/share/nginx/html/conteudo/
COPY services/app/public/ /usr/share/nginx/html/
COPY shared/ /usr/share/nginx/html/assets/
COPY --from=avaliacao /build/dist/ /usr/share/nginx/html/avaliacao/
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
