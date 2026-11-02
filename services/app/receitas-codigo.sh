#!/bin/sh
# Define os códigos de acesso a partir das variáveis de ambiente (aba Ambiente do Easypanel).
# RECEITAS_CODIGO: ebook de receitas. APP_CODIGO: exercícios, plano e pausas do app.
set -e
if [ -n "${RECEITAS_CODIGO:-}" ]; then
  printf 'leitor:%s\n' "$(openssl passwd -apr1 "$RECEITAS_CODIGO")" > /etc/nginx/receitas.htpasswd
  echo "receitas-codigo: código das receitas definido pela variável de ambiente"
else
  echo "receitas-codigo: usando o código das receitas definido no build"
fi
if [ -n "${APP_CODIGO:-}" ]; then
  printf 'membro:%s\n' "$(openssl passwd -apr1 "$APP_CODIGO")" > /etc/nginx/app.htpasswd
  echo "receitas-codigo: código do app definido pela variável de ambiente"
else
  echo "receitas-codigo: usando o código do app definido no build"
fi
