#!/bin/zsh

# Double-click this file in Finder to launch Lexora.
set -e

cd "$(dirname "$0")"

if ! lsof -nP -iTCP:4173 -sTCP:LISTEN >/dev/null 2>&1; then
  python3 -m http.server 4173 >/tmp/lexora-server.log 2>&1 &
  sleep 1
fi

open "http://localhost:4173"
