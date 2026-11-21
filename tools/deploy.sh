#!/bin/sh
# Публікує свіжу версію: Mac → GitHub → сайт на телефоні.
# Спершу ворота (перевірка + димовий тест + тест міграцій): якщо щось не так —
# стоп ДО коміту й пушу, на телефон не їде нічого.
cd "$(dirname "$0")/.." || exit 1
set -e

branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != main ]; then
  # Нижче пушиться саме main: з іншої гілки коміт «публікація» лишився б
  # тут, а сайт — старим, і крок 6 три хвилини чекав би даремно.
  echo "❌ Зараз гілка «$branch», а сайт публікується з main. Не публікую."
  exit 1
fi

ROOT=$(pwd)
# ── Чиста копія (21.11.2026) ──
# Сайт збирається НЕ з робочої теки, а з окремої тимчасової копії рівно останнього коміту (git worktree).
# Причина: поруч працюють інші сесії, і їхні незакомічені правки в src/ потрапляли на сайт — так 21.11
# поїхали неперевірені 16-dashboard.js і 03-folders-projects.css, що змінились саме під час перевірок.
# Тепер на сайт іде лише закомічене, а чужа робота в теці лишається недоторканою.
SRC=$(git rev-parse HEAD)
WT=$(mktemp -d "${TMPDIR:-/tmp}/fq-pub.XXXXXX")
cleanup(){ cd "$ROOT" 2>/dev/null; git worktree remove --force "$WT" >/dev/null 2>&1 || rm -rf "$WT"; git worktree prune >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM
git worktree add -q --detach "$WT" "$SRC"
# оригінал для порівняння (крок 5 перевірки) лежить поза git — даємо копії посилання, якщо він є
[ -f original/index11.html ] && mkdir -p "$WT/original" && ln -s "$ROOT/original/index11.html" "$WT/original/index11.html"
echo "0) Чиста копія коміту $(git log --oneline -1 "$SRC")"
dirty=$(git status --porcelain -- src tools | wc -l | tr -d ' ')
[ "$dirty" != 0 ] && echo "   ℹ️ у робочій теці є незакомічене в src/ чи tools/ ($dirty) — на сайт воно НЕ поїде"
cd "$WT"

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

echo "2б) Тест міграцій (npm run test:migrations): старт не псує дані, «Стерти все» на iPhone стирає"
# Міграція, що при старті тихо переписує чи стирає дані, або скидання, після якого
# стерте повертається, димовий тест не бачить: екрани відкриваються, а дані вже не ті.
# Поза воротами цей тест був червоний з 09.10 і тричі поїхав на сайт (аудит DAT-3).
if ! ./tools/test-migrations.sh; then
  echo "\n❌ Тест міграцій знайшов порушення — НЕ публікую. Нічого не закомічено й не відправлено."
  exit 1
fi

echo "2в) Тестовий місяць (npm run test:month): Огляд, гроші, папки й прогрес рахують одне й те саме"
# Стислий місяць у невидимому вікні і 20 інваріантів проти помилок з «тестового місяця» 12.10.2026
# (Огляд «жодного дня», 700 ₴ замість 12 802 ₴, вибір папки під вікном місії, 100% за перший день…).
# Кожна з них проходила check і smoke: екрани відкривались, а цифри були неправдою.
if ! ./tools/test-month.sh; then
  echo "\n❌ Тестовий місяць знайшов порушення — НЕ публікую. Нічого не закомічено й не відправлено."
  exit 1
fi

cd "$ROOT"
# поки йшли перевірки, в main могли зʼявитись нові коміти (інша сесія) — тоді зібране вже не «останнє»
if [ "$(git rev-parse HEAD)" != "$SRC" ]; then
  echo "\n❌ Поки йшли перевірки, у main зʼявились нові коміти — зібране вже не останнє. Запусти публікацію ще раз."
  exit 1
fi

# пробний прогін (DEPLOY_DRY=1): усі ворота пройдено, але нічого не копіюємо, не комітимо й не відправляємо
if [ -n "$DEPLOY_DRY" ]; then
  DRY="${TMPDIR:-/tmp}/fq-pub-dry.html"; cp "$WT/dist/index.html" "$DRY"
  echo "\n🧪 Пробний прогін: усі перевірки пройдено, сайт НЕ змінено. Зібраний файл: $DRY"
  exit 0
fi

echo "3) Кладемо зібране в корінь (звідти GitHub Pages віддає сайт)"
# Публікуємо лише файли сайту: index.html, усе, що build.py кладе з src/web
# (sw.js, маніфест, іконки), і vendor/. Список беремо з src/web, а не пишемо
# руками: колись так забули іконки з маніфестом, і вони не доїхали на сайт.
# Будь-що інше в dist/ (макет _mock.html, __test-*.html з даними для
# відтворення бага) — стоп: раніше воно тихо ставало публічним назавжди.
PUB="index.html $(ls "$WT/src/web" | tr '\n' ' ')"
extra=""
for f in "$WT"/dist/*; do
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
for n in $PUB; do cp "$WT/dist/$n" .; done
rm -rf vendor && cp -R "$WT/dist/vendor" vendor
# робочий dist/ теж оновлюємо зібраним — щоб npm run smoke чи прев'ю показували те, що на сайті
rm -rf dist && cp -R "$WT/dist" dist
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
  echo "   ℹ️ у src/, tools/ чи CODEMAP.md є незакомічені правки ($left) — на сайт вони не пішли"
  echo "      (сайт зібрано з коміту ${SRC%"${SRC#???????}"}); їх власник закомітить і опублікує окремо."
fi

echo "5) Відправляємо на GitHub"
git push -q origin main
echo "   ✅ відправлено"

echo "5б) Ставимо тег публікації — точку, до якої можна відкотити сайт"
# Без тегу «що стояло на телефоні в четвер» доводилось вишукувати в журналі
# серед десятків комітів. Тег pub-РРРРММДД-ГГХХ = рівно те, що зараз на сайті.
# Якщо цей коміт уже має тег (повторна публікація без змін) — новий не ставимо.
# Невдача з тегом сайт не ламає: публікація вже пішла, тож лише попереджаємо.
if git tag --points-at HEAD | grep -q '^pub-'; then
  echo "   цей коміт уже позначено: $(git tag --points-at HEAD | grep '^pub-' | head -1)"
else
  TAG="pub-$(date '+%Y%m%d-%H%M')"
  if git tag "$TAG" && git push -q origin "refs/tags/$TAG"; then
    echo "   🏷  $TAG (відкат — prompts/workflows/publikatsiia.md, розділ «Відкат»)"
  else
    echo "   ⚠️ тег $TAG не вдалося поставити чи відправити — сайт опубліковано, тег постав руками"
  fi
fi

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
