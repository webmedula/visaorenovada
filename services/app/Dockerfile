FROM nginx:1.27-alpine
COPY services/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY services/app/public/ /usr/share/nginx/html/
COPY shared/ /usr/share/nginx/html/assets/
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
