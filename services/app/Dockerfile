# Etapa 1: build da Autoavaliação (React/Vite) em /avaliacao/
FROM node:20-alpine AS avaliacao
WORKDIR /build
COPY services/app/avaliacao/package.json services/app/avaliacao/package-lock.json ./
# O package-lock.json veio desatualizado do Lovable (faltam jspdf e deps de teste),
# por isso `npm install` em vez de `npm ci`.
RUN npm install --no-audit --no-fund --loglevel=error
COPY services/app/avaliacao/ ./
RUN npm run build

# Etapa 2: nginx servindo o app de exercícios (estático) + a autoavaliação
FROM nginx:1.27-alpine
COPY services/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY services/app/public/ /usr/share/nginx/html/
COPY shared/ /usr/share/nginx/html/assets/
COPY --from=avaliacao /build/dist/ /usr/share/nginx/html/avaliacao/
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
