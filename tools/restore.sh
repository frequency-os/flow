#!/bin/sh
# Повертає дані застосунку зі знімка. Застосунок має бути ЗАКРИТИЙ.
cd "$(dirname "$0")/.." || exit 1
SNAP="$1"
[ -n "$SNAP" ] || { echo "Вкажи знімок. Наявні:"; ls -1 backups 2>/dev/null | sed 's/^/   /'; exit 1; }
SRC="backups/$SNAP"
[ -d "$SRC" ] || { echo "❌ Немає знімка $SNAP"; exit 1; }

APPDIR="$HOME/Library/Application Support/Frequency"

if pgrep -f "Frequency.app/Contents/MacOS/Frequency" >/dev/null 2>&1 \
   || pgrep -f "node_modules/electron/dist/Electron.app" >/dev/null 2>&1; then
  echo "Закриваю застосунок…"
  osascript -e 'tell application "Frequency" to quit' 2>/dev/null
  pkill -f "node_modules/electron/dist/Electron.app" 2>/dev/null
  sleep 3
fi

# перед відкотом зберігаємо ТЕПЕРІШНІЙ стан — раптом відкат теж був помилкою
echo "Спершу знімаю поточний стан…"
./tools/snapshot.sh >/dev/null 2>&1

for part in "Local Storage" "IndexedDB" "Session Storage" "Preferences"; do
  if [ -e "$SRC/$part" ]; then
    rm -rf "$APPDIR/$part"
    cp -R "$SRC/$part" "$APPDIR/" && echo "   ↺ $part"
  fi
done
echo
echo "✅ Дані повернуто до стану $SNAP"
echo "Відкривай Frequency."
