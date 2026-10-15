#!/bin/sh
# Сторож «тестовий місяць»: стислий місяць у невидимому Electron і 12 інваріантів (див. tools/test-month.js),
# плюс перевірка, що в зібраному не повернулись тексти з родовими формами. Код 1 — є порушення.
# Сам нічого не збирає: спершу npm run build (або npm run check).
cd "$(dirname "$0")/.." || exit 1
[ -f dist/index.html ] || { echo "❌ немає dist/index.html — спершу npm run build"; exit 1; }

# тексти, які прибрано 12–15.10.2026 (для всіх і двома мовами) — не мають повернутись
bad=0
for t in 'Ти заслужив' 'Втомився —' "'Заробив'" "'Витратив'" 'Ледве живий' 'Якщо вже купив' 'Створено: '"'"'+nG+'"'"' цілей'; do
  if grep -qF -- "$t" dist/index.html dist/misto.html 2>/dev/null; then echo "   ✗ текст повернувся: $t"; bad=1; fi
done
[ $bad = 0 ] && echo "   ✓ тексти без родових форм і з правильними відмінками"

E=./node_modules/.bin/electron
if [ ! -x "$E" ]; then
  common=$(git rev-parse --git-common-dir 2>/dev/null) && E="$(cd "$common/.." && pwd)/node_modules/.bin/electron"
fi
[ -x "$E" ] || { echo "❌ не знайдено Electron — запусти npm install"; exit 1; }
"$E" tools/test-month.js "$PWD/dist/index.html"; code=$?
[ $bad = 1 ] && [ $code = 0 ] && { echo "❌ Тестовий місяць: повернулись старі тексти"; exit 1; }
exit $code
