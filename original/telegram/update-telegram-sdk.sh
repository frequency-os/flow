#!/bin/sh
# Оновлює локальну копію Telegram Web App SDK з офіційного джерела.
cd "$(dirname "$0")/.." || exit 1
TMP=$(mktemp)
curl -fsS --max-time 30 -o "$TMP" https://telegram.org/js/telegram-web-app.js || { echo "❌ не вдалося завантажити"; rm -f "$TMP"; exit 1; }
./tools/jscheck.sh "$TMP" | grep -q '^OK$' || { echo "❌ завантажене не є валідним JS — залишаю стару копію"; rm -f "$TMP"; exit 1; }
printf '/* Telegram Web App SDK — локальна копія (щоб працювало без інтернету).\n   Джерело: https://telegram.org/js/telegram-web-app.js\n   Завантажено: %s\n   Оновити: ./tools/update-telegram-sdk.sh */\n' "$(date +%Y-%m-%d)" > src/scripts/00-telegram-sdk.js
cat "$TMP" >> src/scripts/00-telegram-sdk.js
rm -f "$TMP"
echo "✅ SDK оновлено. Не забудь зібрати: python3 tools/build.py"
