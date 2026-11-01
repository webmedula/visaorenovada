#!/bin/sh
# Roda na partida do container (pasta /docker-entrypoint.d/ da imagem nginx).
# Se a variável de ambiente RECEITAS_CODIGO estiver definida (aba Ambiente do
# Easypanel), ela vira o código de acesso da área de receitas. Sem ela, vale o
# código definido no build (ARG RECEITAS_CODIGO do Dockerfile).
set -e
if [ -n "${RECEITAS_CODIGO:-}" ]; then
  printf 'leitor:%s\n' "$(openssl passwd -apr1 "$RECEITAS_CODIGO")" > /etc/nginx/receitas.htpasswd
  echo "receitas-codigo: código de acesso definido pela variável de ambiente"
else
  echo "receitas-codigo: usando o código definido no build"
fi
