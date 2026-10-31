#!/usr/bin/env sh
# Atualiza o código e recria os serviços que mudaram.
set -e
cd "$(dirname "$0")"
git pull --ff-only
docker compose up -d --build
docker image prune -f
docker compose ps
