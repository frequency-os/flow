#!/bin/sh
# Знімок УСІХ даних застосунку на цю мить: папки, гроші, щоденник,
# цілі, книги, документи. Копіює сховище Frequency у backups/.
# Швидко (секунди), місця займає мало, робиться скільки завгодно разів.
cd "$(dirname "$0")/.." || exit 1

APPDIR="$HOME/Library/Application Support/Frequency"
[ -d "$APPDIR" ] || { echo "❌ Сховище Frequency не знайдено — застосунок ще жодного разу не запускався?"; exit 1; }

STAMP=$(date +%Y-%m-%d_%H-%M)
DEST="backups/$STAMP"
mkdir -p "$DEST"

for part in "Local Storage" "IndexedDB" "Session Storage" "Preferences"; do
  [ -e "$APPDIR/$part" ] && cp -R "$APPDIR/$part" "$DEST/" 2>/dev/null
done

# що саме взяли — щоб потім було зрозуміло, чи знімок «живий»
KEYS=$(cat "$DEST/Local Storage/leveldb/"* 2>/dev/null | strings | grep -c 'flow_' 2>/dev/null || echo 0)
printf 'Знімок: %s\nГілка git: %s\nКоміт: %s\n' "$STAMP" "$(git rev-parse --abbrev-ref HEAD 2>/dev/null)" "$(git rev-parse --short HEAD 2>/dev/null)" > "$DEST/ЩО-ЦЕ.txt"

echo "✅ $DEST  ($(du -sh "$DEST" | cut -f1))"
ls -1 backups | tail -5 | sed 's/^/   /'
echo
echo "Відкотити: ./tools/restore.sh $STAMP"
