#!/bin/sh
# Публікує свіжу версію: Mac → GitHub → сайт на телефоні.
# Спершу ворота (перевірка + димовий тест): якщо щось не так — стоп
# ДО коміту й пушу, на телефон не їде нічого.
cd "$(dirname "$0")/.." || exit 1
set -e

branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != main ]; then
  # Нижче пушиться саме main: з іншої гілки коміт «публікація» лишився б
  # тут, а сайт — старим, і крок 6 три хвилини чекав би даремно.
  echo "❌ Зараз гілка «$branch», а сайт публікується з main. Не публікую."
  exit 1
fi

echo "1) Перевірка і збірка (npm run check)"
# check.sh сам збирає dist/ і повертає код 1 при будь-якій проблемі.
# Раніше тут стояла лише збірка через пайп, який ковтав її помилку:
# на сайт міг поїхати старий або зламаний index.html.
if ! ./tools/check.sh; then
  echo "\n❌ Перевірка не пройшла — НЕ публікую. Нічого не закомічено й не відправлено."
  exit 1
fi

echo "2) Димовий тест (npm run smoke): зібране відкривається в невидимому вікні"
# Синтаксис може бути чистим, а програма все одно падати під час запуску
# (напр., функцію викликали раніше, ніж оголосили). Це видно лише наживо.
if ! ./tools/smoke.sh; then
  echo "\n❌ Димовий тест знайшов помилки — НЕ публікую. Нічого не закомічено й не відправлено."
  exit 1
fi

echo "3) Кладемо зібране в корінь (звідти GitHub Pages віддає сайт)"
# Публікуємо лише файли сайту: index.html, усе, що build.py кладе з src/web
# (sw.js, маніфест, іконки), і vendor/. Список беремо з src/web, а не пишемо
# руками: колись так забули іконки з маніфестом, і вони не доїхали на сайт.
# Будь-що інше в dist/ (макет _mock.html, __test-*.html з даними для
# відтворення бага) — стоп: раніше воно тихо ставало публічним назавжди.
PUB="index.html $(ls src/web | tr '\n' ' ')"
extra=""
for f in dist/*; do
  n=$(basename "$f")
  [ "$n" = vendor ] && continue
  case " $PUB " in *" $n "*) ;; *) extra="$extra $n";; esac
done
if [ -n "$extra" ]; then
  echo "   ❌ у dist/ є зайве:$extra"
  echo "      Це не частина сайту (схоже на макет чи тестовий файл). Макети тримай"
  echo "      у scratchpad, а звідси прибери. Нічого не закомічено й не відправлено."
  exit 1
fi
for n in $PUB; do cp "dist/$n" .; done
rm -rf vendor && cp -R dist/vendor vendor
echo "   $PUB vendor/"

echo "4) Записуємо в історію (лише файли сайту)"
# Не `git add -A`: той забирав у «публікацію» все підряд — незакомічені правки
# src/, чужі чернетки, карту коду з напівзробленої роботи. `git commit -- шляхи`
# бере лише ці шляхи, навіть якщо щось інше вже додано в індекс.
git add -A -- $PUB vendor
if git diff --cached --quiet -- $PUB vendor; then
  echo "   нічого нового — пропускаю"
else
  git commit -q -m "публікація $(date '+%Y-%m-%d %H:%M')" -- $PUB vendor
  echo "   $(git log --oneline -1)"
fi
left=$(git status --porcelain -- src tools CODEMAP.md | wc -l | tr -d ' ')
if [ "$left" != 0 ]; then
  echo "   ⚠️ у src/, tools/ чи CODEMAP.md є незакомічені правки ($left): сайт зібрано"
  echo "      з них, але в історію вони не пішли — закоміть їх окремим комітом."
fi

echo "5) Відправляємо на GitHub"
git push -q origin main
echo "   ✅ відправлено"

echo "6) Чекаємо, поки GitHub оновить сайт (зазвичай до хвилини)"
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
