#!/bin/sh
# Показує, що ти накидав зі скріншотів у папку iCloud «Frequency-баги».
BOX="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Frequency-баги"
[ -d "$BOX" ] || { echo "Папки немає: $BOX"; exit 1; }

# .icloud = файл ще не завантажився на Mac
PEND=$(find "$BOX" -name '*.icloud' 2>/dev/null | wc -l | xargs)
[ "$PEND" != "0" ] && echo "⏳ ще качається з iCloud: $PEND файл(ів) — зачекай пару секунд"

N=0
for f in "$BOX"/*.png "$BOX"/*.PNG "$BOX"/*.jpg "$BOX"/*.jpeg "$BOX"/*.HEIC; do
  [ -e "$f" ] || continue
  N=$((N+1))
  printf '  %-46s %s\n' "$(basename "$f")" "$(date -r "$f" '+%d.%m %H:%M')"
done
[ "$N" = 0 ] && echo "Порожньо — нових скріншотів немає." || echo "
Разом: $N. Скажи «подивись баги» — прочитаю кожен."
