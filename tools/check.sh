#!/bin/sh
# Перевірка здоров'я проєкту.
cd "$(dirname "$0")/.." || exit 1
TMP=$(mktemp -d); bad=0
say(){ case "$2" in OK) echo "   ✅ $1";; *) echo "   ❌ $1 — $2"; bad=$((bad+1));; esac; }

echo "1) Синтаксис JS (кожен файл src/ окремо):"
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

echo "2) Збірка:"
# Без пайпа в sed: інакше код помилки збірки губився, і далі перевірявся СТАРИЙ dist.
python3 tools/build.py > "$TMP/build.log" 2>&1; built=$?
sed 's/^/   /' "$TMP/build.log"
if [ "$built" != 0 ]; then
  echo "   ❌ збірка не вдалась — далі не перевіряю: dist/ лишився старий"
  rm -rf "$TMP"; echo "\nПроблем: $((bad+1))"; exit 1
fi

echo "3) Синтаксис так, як його бачить браузер (кожен <script> з dist/index.html по черзі):"
# Крок 1 розбирає файли як тіло функції й пропускає, наприклад, return на
# верхньому рівні. Тут — справжній розбір скрипта + конфлікти імен між блоками.
if command -v node >/dev/null 2>&1; then
  node tools/scriptcheck.js dist/index.html || bad=$((bad+1))
else
  echo "   ❌ немає Node — поставити: brew install node"; bad=$((bad+1))
fi

echo "4) Автономність (чи потрібен інтернет, щоб застосунок відкрився):"
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

echo "5) Що змінилось відносно оригіналу (original/index11.html):"
if [ -f original/index11.html ]; then
  echo "   рядків додано/прибрано: $(diff original/index11.html dist/index.html | grep -c '^[<>]')"
else
  echo "   (еталона нема на цьому Mac — крок пропущено; з 04.09.2026 він лежить поза git)"
fi

echo "6) Карта коду (CODEMAP.md):"
if out=$(python3 tools/codemap.py --check 2>&1); then
  echo "   ✅ $out"
else
  echo "   ❌ $out"; bad=$((bad+1))
fi

rm -rf "$TMP"
# Код виходу важливий: за ним deploy.sh вирішує, чи можна публікувати.
[ "$bad" = 0 ] && { echo "\nВсе гаразд."; exit 0; }
echo "\nПроблем: $bad"; exit 1
