# Etapa 1: build da Autoavaliação (React/Vite) em /avaliacao/
FROM node:20-alpine AS avaliacao
WORKDIR /build
COPY services/app/avaliacao/package.json services/app/avaliacao/package-lock.json ./
# O package-lock.json veio desatualizado do Lovable (faltam jspdf e deps de teste),
# por isso `npm install` em vez de `npm ci`.
RUN npm install --no-audit --no-fund --loglevel=error
COPY services/app/avaliacao/ ./
RUN npm run build

# Etapa 2: senha da área de receitas (código único entregue a quem compra)
FROM alpine:3.20 AS senha
ARG RECEITAS_CODIGO=TROQUE-ESTE-CODIGO
RUN apk add --no-cache openssl \
 && printf 'leitor:%s\n' "$(openssl passwd -apr1 "$RECEITAS_CODIGO")" > /htpasswd

# Etapa 3: nginx servindo o app de exercícios (estático), a autoavaliação e as receitas
FROM nginx:1.27-alpine
COPY services/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=senha /htpasswd /etc/nginx/receitas.htpasswd
COPY services/app/receitas/ /usr/share/nginx/html/receitas/
COPY services/app/public/ /usr/share/nginx/html/
COPY shared/ /usr/share/nginx/html/assets/
COPY --from=avaliacao /build/dist/ /usr/share/nginx/html/avaliacao/
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
