#!/bin/sh
# Димовий тест: відкриває зібраний dist/index.html у невидимому Electron
# (375×812), проходить головні екрани і рахує помилки. Код 1 — є проблеми.
# Сам нічого не збирає: спершу npm run build (або npm run check).
cd "$(dirname "$0")/.." || exit 1
[ -f dist/index.html ] || { echo "❌ немає dist/index.html — спершу npm run build"; exit 1; }

# Electron шукаємо у своєму node_modules. У копії-worktree (.claude/worktrees/…)
# node_modules немає — тоді беремо з головної копії репо, куди його ставив npm install.
E=./node_modules/.bin/electron
if [ ! -x "$E" ]; then
  common=$(git rev-parse --git-common-dir 2>/dev/null) && E="$(cd "$common/.." && pwd)/node_modules/.bin/electron"
fi
[ -x "$E" ] || { echo "❌ не знайдено Electron — запусти npm install"; exit 1; }

exec "$E" tools/smoke.js "$PWD/dist/index.html"
