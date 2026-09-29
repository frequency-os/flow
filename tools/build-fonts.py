#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-fonts.py — забирає шрифти з Google Fonts і вкладає їх ПРЯМО в код,
щоб застосунок працював без інтернету.

Що робить:
  1. просить у Google CSS для потрібних шрифтів (як це робить браузер Chrome);
  2. лишає тільки потрібні алфавіти (кирилиця + латиниця), решту викидає;
  3. качає файли шрифтів (.woff2);
  4. вшиває їх у src/styles/00-fonts.css у вигляді тексту (base64);
  5. рукописний Caveat кладе ОКРЕМО — у src/web/fonts-caveat.css (див. LAZY).

Запускати треба лише тоді, коли хочеш оновити шрифти. Інтернет потрібен
ТІЛЬКИ під час цього запуску — самій програмі він більше не потрібен.
"""
import base64, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, 'src', 'styles', '00-fonts.css')
# Шрифти, що НЕ потрібні для першого екрана, — окремим файлом поруч з index.html.
# Caveat (≈235 КБ тексту, 40 % усіх шрифтів) — лише напис «Карта бажань» у темі
# «Плоска» і стиль «рукопис» у редакторі. Його підвантажує 01-base.js після
# першого кадру; до того — запасний cursive. Офлайн дає sw.js (PRECACHE).
LAZY     = {'Caveat'}
OUT_LAZY = os.path.join(ROOT, 'src', 'web', 'fonts-caveat.css')
UA   = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

CSS_URL = ('https://fonts.googleapis.com/css2?'
           'family=Manrope:wght@400;500;600;700;800'
           '&family=Lora:wght@600;700'
           '&family=Caveat:wght@600;700'
           '&display=swap')

# Українська мова повністю вкладається в субсет `cyrillic`;
# `latin-ext` потрібен для словацьких/чеських імен в Агенції.
KEEP = {'cyrillic', 'latin', 'latin-ext'}

HEADER_LAZY = """/* ═══════════ ШРИФТ CAVEAT — окремо, вантажиться ПІСЛЯ першого кадру ═══════════
   Підвантажує 01-base.js (<link id="fontCaveat">), до того діє запасний cursive.
   Ліцензія SIL Open Font License 1.1. Джерело: Google Fonts.
   Оновити: python3 tools/build-fonts.py
   ЦЕЙ ФАЙЛ ЗГЕНЕРОВАНО АВТОМАТИЧНО — руками не правити. */
"""

HEADER = """/* ═══════════ ШРИФТИ — вбудовані, працюють без інтернету ═══════════
   Manrope, Lora (+ Caveat в src/web/fonts-caveat.css, вантажиться ліниво) —
   усі три під ліцензією SIL Open Font License 1.1,
   яка прямо дозволяє вкладати шрифт у застосунок.
   Джерело: Google Fonts. Оновити: python3 tools/build-fonts.py
   Алфавіти: кирилиця + латиниця (грецьку, вʼєтнамську, math і symbols
   викинуто — вони тут не потрібні і лише додавали ваги).
   ЦЕЙ ФАЙЛ ЗГЕНЕРОВАНО АВТОМАТИЧНО — руками не правити. */
"""

def fetch(url, binary=False):
    r = subprocess.run(['curl', '-fsS', '--max-time', '60', '-A', UA, url],
                       capture_output=True)
    if r.returncode != 0:
        print('❌ не вдалося завантажити %s\n%s' % (url, r.stderr.decode()[:200]))
        sys.exit(1)
    return r.stdout if binary else r.stdout.decode('utf-8')

def main():
    css = fetch(CSS_URL)
    blocks = re.split(r'(?=/\* [a-z-]+ \*/)', css)

    # Google видає окремий @font-face на КОЖНУ товщину, але для змінних
    # шрифтів усі товщини лежать в одному файлі. Якщо вкладати як є —
    # той самий шрифт потрапить у код по 2-3 рази. Тому групуємо блоки
    # з однаковим файлом і зводимо товщини в діапазон (напр. 600 700 → "600 700").
    groups, order, skipped = {}, [], 0
    for b in blocks:
        m = re.match(r'/\* ([a-z-]+) \*/', b)
        if not m:
            continue
        sub = m.group(1)
        url = re.search(r'url\((https://fonts\.gstatic\.com[^)]*)\)', b)
        fam = re.search(r"font-family: *'([^']+)'", b)
        wt  = re.search(r'font-weight: *([0-9]+)', b)
        rng = re.search(r'unicode-range: *([^;]+);', b)
        sty = re.search(r'font-style: *([^;]+);', b)
        if sub not in KEEP or not (url and fam and wt and rng):
            skipped += 1
            continue
        key = (fam.group(1), (sty.group(1).strip() if sty else 'normal'), url.group(1), rng.group(1).strip())
        if key not in groups:
            groups[key] = []
            order.append((key, sub))
        groups[key].append(int(wt.group(1)))

    cache, out, out_lazy = {}, [], []
    for key, sub in order:
        fam, sty, url, rng = key
        if url not in cache:
            data = fetch(url, binary=True)
            if data[:4] != b'wOF2':
                print('❌ %s — це не woff2' % url); sys.exit(1)
            cache[url] = 'data:font/woff2;base64,' + base64.b64encode(data).decode()
            print('   ↓ %6.1f KB  %s' % (len(data)/1024, url.rsplit('/', 1)[-1]))
        ws = sorted(set(groups[key]))
        weight = str(ws[0]) if len(ws) == 1 else '%d %d' % (ws[0], ws[-1])
        (out_lazy if fam in LAZY else out).append(
            "/* %s · %s */\n@font-face {\n"
            "  font-family: '%s';\n  font-style: %s;\n  font-weight: %s;\n"
            "  font-display: swap;\n  src: url(%s) format('woff2');\n"
            "  unicode-range: %s;\n}\n" % (fam, sub, fam, sty, weight, cache[url], rng))

    kept = len(out) + len(out_lazy)
    if not out or not out_lazy:
        print('❌ жодного блоку не залишилось (основних %d, лінивих %d)' % (len(out), len(out_lazy))); sys.exit(1)

    text = HEADER + '\n' + '\n'.join(out)
    with open(OUT, 'w', encoding='utf-8', newline='') as f:
        f.write(text)
    lazy = HEADER_LAZY + '\n' + '\n'.join(out_lazy)
    with open(OUT_LAZY, 'w', encoding='utf-8', newline='') as f:
        f.write(lazy)

    raw = sum(len(base64.b64decode(v.split(',', 1)[1])) for v in cache.values())
    print('\n✅ src/styles/00-fonts.css (%.0f KB) + src/web/fonts-caveat.css (%.0f KB, ліниво)'
          % (len(text.encode())/1024, len(lazy.encode())/1024))
    print('   блоків @font-face: %d (відкинуто %d)' % (kept, skipped))
    print('   файлів шрифтів: %d, %.0f KB → %.0f KB у вигляді тексту'
          % (len(cache), raw/1024, (len(text.encode())+len(lazy.encode()))/1024))
    print('\nДалі: python3 tools/build.py')

main()
