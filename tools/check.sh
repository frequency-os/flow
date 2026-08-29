#!/bin/sh
# Перевірка здоров'я проєкту: синтаксис JS + збірка + порівняння з оригіналом.
cd "$(dirname "$0")/.." || exit 1
TMP=$(mktemp -d)
bad=0
say(){ case "$2" in OK) echo "   ✅ $1";; *) echo "   ❌ $1 — $2"; bad=$((bad+1));; esac; }

echo "1) Синтаксис JS:"
for f in src/scripts/*.js; do
  [ -e "$f" ] || continue
  say "$(basename "$f")" "$(./tools/jscheck.sh "$f")"
done
# Папки — це один скрипт, порізаний на частини: перевіряємо їх склеєними.
for d in src/scripts/*/; do
  [ -d "$d" ] || continue
  cat "$d"*.js > "$TMP/joined.js"
  say "$(basename "$d")/ (усі частини разом)" "$(./tools/jscheck.sh "$TMP/joined.js")"
done
rm -rf "$TMP"

echo "2) Збірка:"
python3 tools/build.py | sed 's/^/   /'

echo "3) Порівняння з оригіналом (original/index11.html):"
if cmp -s original/index11.html dist/index.html; then
  echo "   ✅ збігається байт-у-байт"
else
  n=$(diff original/index11.html dist/index.html | grep -c '^[<>]')
  echo "   ⚠️  відрізняється на $n рядків — нормально, якщо ти вже правив src/"
fi
[ "$bad" = 0 ] && echo "\nВсе гаразд." || echo "\nПроблем: $bad"
