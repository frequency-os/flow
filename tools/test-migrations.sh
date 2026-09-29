#!/bin/sh
# Тест разових міграцій: засіяти сховище → старт двічі → нуль записів при повторі;
# «хмара мовчить» → міграції нічого не пишуть. Код 1 — є порушення.
# Сам нічого не збирає: спершу npm run build (або npm run check).
cd "$(dirname "$0")/.." || exit 1
[ -f dist/index.html ] || { echo "❌ немає dist/index.html — спершу npm run build"; exit 1; }
# Electron — як у smoke.sh: свій node_modules або головної копії репо (для worktree)
E=./node_modules/.bin/electron
if [ ! -x "$E" ]; then
  common=$(git rev-parse --git-common-dir 2>/dev/null) && E="$(cd "$common/.." && pwd)/node_modules/.bin/electron"
fi
[ -x "$E" ] || { echo "❌ не знайдено Electron — запусти npm install"; exit 1; }
exec "$E" tools/test-migrations.js "$PWD/dist/index.html"
