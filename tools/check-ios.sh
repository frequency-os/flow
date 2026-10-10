#!/bin/sh
# Перевірка збірки під App Store (dist-ios/, її робить python3 tools/build.py --ios):
# у ній не має лишитись dev-коду, що виконує текст як програму, і дозволу на це в CSP.
# Немає dist-ios/ — крок пропускається (код 0). Код 1 — знайдено заборонене.
cd "$(dirname "$0")/.." || exit 1
F=dist-ios/index.html
[ -f "$F" ] || { echo "   (dist-ios/ нема — крок пропущено; зібрати: python3 tools/build.py --ios)"; exit 0; }
bad=0
# що шукаємо · чому це не можна в App Store
for pat in "dev_eval|інструмент Нокса, що виконує код моделі" \
           "unsafe-eval|дозвіл CSP виконувати рядки як код" \
           "new Function|виконання рядка як коду" \
           "@dev-only:start|невирізаний dev-блок" \
           "@dev-only:end|невирізаний dev-блок" \
           "aiDevToggleSheet|шторка «Режим розробника»"; do
  p=${pat%%|*}; why=${pat#*|}
  n=$(grep -cF -- "$p" "$F")
  if [ "$n" = 0 ]; then echo "   ✅ нема «$p»"
  else echo "   ❌ «$p» трапляється $n раз — $why"; bad=$((bad+1)); fi
done
[ "$bad" = 0 ] && exit 0
echo "   dist-ios/ зібрано зі старого коду? Збери знову: python3 tools/build.py --ios"
exit 1
