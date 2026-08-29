#!/bin/sh
# Режим розробки: правиш файл у src/ — вікно оновлюється саме.
cd "$(dirname "$0")/.." || exit 1

# Встановлений Frequency і режим розробки користуються ОДНИМ сховищем.
# Два процеси одночасно писати в нього не можуть, тому закриваємо застосунок.
if pgrep -f "Applications/Frequency.app/Contents/MacOS/Frequency" >/dev/null 2>&1; then
  echo "Закриваю встановлений Frequency (сховище одне на двох)…"
  osascript -e 'tell application "Frequency" to quit' 2>/dev/null
  sleep 2
fi

python3 tools/build.py || exit 1
echo
exec npx electron .
