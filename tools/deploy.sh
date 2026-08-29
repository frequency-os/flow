#!/bin/sh
# Публікує свіжу версію: Mac → GitHub → Telegram на телефоні.
cd "$(dirname "$0")/.." || exit 1
set -e

echo "1) Збірка"
python3 tools/build.py | sed 's/^/   /'

echo "2) Кладемо зібране в корінь (звідти GitHub Pages віддає сайт)"
cp dist/index.html index.html
rm -rf vendor && cp -R dist/vendor vendor
echo "   index.html $(du -h index.html | cut -f1) + vendor/ $(du -sh vendor | cut -f1)"

echo "3) Записуємо в історію"
git add -A
if git diff --cached --quiet; then
  echo "   нічого нового — пропускаю"
else
  git commit -q -m "публікація $(date '+%Y-%m-%d %H:%M')"
  echo "   $(git log --oneline -1)"
fi

echo "4) Відправляємо на GitHub"
git push -q origin main
echo "   ✅ відправлено"

echo "5) Чекаємо, поки GitHub оновить сайт (зазвичай до хвилини)"
WANT=$(shasum -a 256 index.html | cut -d' ' -f1)
i=0
while [ $i -lt 30 ]; do
  sleep 6; i=$((i+1))
  GOT=$(curl -sS --max-time 25 "https://frequency-os.github.io/flow/?_=$(date +%s)" 2>/dev/null | shasum -a 256 | cut -d' ' -f1)
  if [ "$GOT" = "$WANT" ]; then
    echo "   ✅ сайт оновлено — на телефоні вже нова версія"
    echo
    echo "   https://frequency-os.github.io/flow/"
    exit 0
  fi
  printf '   чекаю… %ds\n' $((i*6))
done
echo "   ⚠️ за 3 хвилини сайт ще не оновився. Файл на GitHub уже є —"
echo "      подивись github.com/frequency-os/flow/actions, чи не впала публікація."
