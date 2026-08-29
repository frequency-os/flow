#!/bin/sh
# Качає сторонні бібліотеки в src/vendor/, щоб вони працювали без інтернету.
# Запускати тільки коли треба оновити версії. Версії ЗАФІКСОВАНІ навмисно:
# «остання» версія колись зміниться і зламає те, що працює.
cd "$(dirname "$0")/.." || exit 1
mkdir -p src/vendor
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36'

get(){ # get <файл> <адреса>
  printf '  %-22s ' "$1"
  tmp=$(mktemp)
  if curl -fsS --max-time 60 -A "$UA" -o "$tmp" "$2"; then
    r=$(./tools/jscheck.sh "$tmp")
    if [ "$r" = "OK" ]; then
      mv "$tmp" "src/vendor/$1"
      echo "✅ $(du -h "src/vendor/$1" | cut -f1)"
    else
      echo "❌ не валідний JS: $r"; rm -f "$tmp"
    fi
  else
    echo "❌ не завантажилось"; rm -f "$tmp"
  fi
}

get jszip.min.js      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
get pdf.min.js        https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
get supabase.min.js   https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/dist/umd/supabase.js

echo
echo "Разом: $(du -sh src/vendor | cut -f1)"
echo "Далі: python3 tools/build.py"
