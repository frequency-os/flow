#!/bin/sh
# Хук git «перед комітом»: не дає закомітити ключ, токен чи пароль у публічне репо.
# Сканує лише те, що йде в коміт (staged). Правила — .gitleaks.toml.
# Встановлення (робить tools/check.sh, крок «Секрети»): копія в .git/hooks/pre-commit.
# Нема програми gitleaks (наприклад, у робочій копії іншої гілки) — хук мовчки пропускає.
TOP=$(git rev-parse --show-toplevel) || exit 0
MAIN=$(cd "$(dirname "$(git rev-parse --git-common-dir)")" && pwd)   # головна папка проєкту
GL="$MAIN/tools/bin/gitleaks"
[ -x "$GL" ] || exit 0
CFG="$TOP/.gitleaks.toml"; [ -f "$CFG" ] || CFG="$MAIN/.gitleaks.toml"
if ! "$GL" git "$TOP" --staged --config "$CFG" --redact --no-banner -v --log-level warn; then
  echo ""
  echo "⛔ Коміт зупинено: схоже на ключ, токен чи пароль (значення приховано)."
  echo "   Прибери його з файлу. Якщо це точно не секрет — допиши виняток у .gitleaks.toml."
  exit 1
fi
