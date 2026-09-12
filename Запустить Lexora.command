#!/bin/zsh

# Double-click this file in Finder to launch Lexora.
set -e

cd "$(dirname "$0")"

# Finder does not always include the Node installation in PATH.
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js 22 or later, then start Lexora again."
  read -r "?Press Enter to close."
  exit 1
fi

if ! lsof -nP -iTCP:4173 -sTCP:LISTEN >/dev/null 2>&1; then
  node server.js >/tmp/lexora-server.log 2>&1 &
  sleep 1
fi

open "http://localhost:4173"
