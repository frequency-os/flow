#!/bin/sh
# Перевірка здоров'я проєкту.
cd "$(dirname "$0")/.." || exit 1
TMP=$(mktemp -d); bad=0
say(){ case "$2" in OK) echo "   ✅ $1";; *) echo "   ❌ $1 — $2"; bad=$((bad+1));; esac; }

echo "1) Синтаксис JS:"
for f in src/scripts/*.js; do
  [ -e "$f" ] || continue
  say "$(basename "$f")" "$(./tools/jscheck.sh "$f")"
done
for d in src/scripts/*/; do
  [ -d "$d" ] || continue
  cat "$d"*.js > "$TMP/j.js"
  say "$(basename "$d")/ (усі частини разом)" "$(./tools/jscheck.sh "$TMP/j.js")"
done
for f in src/vendor/*.js; do
  [ -e "$f" ] || continue
  say "vendor/$(basename "$f")" "$(./tools/jscheck.sh "$f")"
done
rm -rf "$TMP"

echo "2) Збірка:"
python3 tools/build.py | sed 's/^/   /'

echo "3) Автономність (чи потрібен інтернет, щоб застосунок відкрився):"
# Дивимось лише на теги, які браузер вантажить САМ при відкритті сторінки.
# Вбудовані відео (YouTube) не рахуємо: відео за визначенням потребує мережі,
# і воно вантажиться лише коли ти сам натиснеш «грати».
ext=$(grep -oE '<(script|link|img|iframe)[^>]*(src|href)="https?://[^"]*"' dist/index.html \
      | grep -vE 'youtube\.com|youtu\.be|vimeo\.com' | sort -u)
if [ -z "$ext" ]; then
  echo "   ✅ жодного зовнішнього завантаження при старті"
else
  echo "   ❌ тягне з мережі при старті:"; echo "$ext" | sed 's/^/      /'; bad=$((bad+1))
fi
for f in jszip.min.js pdf.min.js supabase.min.js; do
  if [ -f "dist/vendor/$f" ]; then echo "   ✅ vendor/$f на місці"
  else echo "   ❌ vendor/$f відсутній — запусти ./tools/build-vendor.sh"; bad=$((bad+1)); fi
done

echo "4) Що змінилось відносно оригіналу (original/index11.html):"
echo "   рядків додано/прибрано: $(diff original/index11.html dist/index.html | grep -c '^[<>]')"
echo "   (це шрифти, вбудовані всередину замість Google Fonts — так і має бути)"

echo "5) Карта коду (CODEMAP.md):"
if out=$(python3 tools/codemap.py --check 2>&1); then
  echo "   ✅ $out"
else
  echo "   ❌ $out"; bad=$((bad+1))
fi

[ "$bad" = 0 ] && echo "\nВсе гаразд." || echo "\nПроблем: $bad"
