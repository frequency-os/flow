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
# ворота dev-екранів (Апгрейд, Місто дня, Сфери, Мій світ): у dist-ios upDevOn
# має бути рівно одна і з тілом лише «return false;» — тоді вони не відкриються ніколи
dv=$(python3 - "$F" <<'PY'
import re,sys
s=open(sys.argv[1],encoding='utf-8').read()
defs=len(re.findall(r'function upDevOn\s*\(', s))
ok=len(re.findall(r'function upDevOn\(\)\{\s*(?:/\*(?:(?!\*/).)*\*/\s*)*return false;\s*\}', s, re.S))
print('ok' if defs==1 and ok==1 else 'bad %d/%d' % (ok, defs))
PY
)
if [ "$dv" = ok ]; then echo "   ✅ upDevOn завжди повертає false"
else echo "   ❌ upDevOn у dist-ios не «return false;» ($dv) — dev-екрани відкриються"; bad=$((bad+1)); fi
[ "$bad" = 0 ] && exit 0
echo "   dist-ios/ зібрано зі старого коду? Збери знову: python3 tools/build.py --ios"
exit 1
