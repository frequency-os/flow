#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build.py — збирає src/ назад в один файл dist/index.html.
Це і є «готова програма»: саме її відкриває браузер, Mac, iPhone, Android.
Правиш файли в src/ → запускаєш build → отримуєш dist/index.html.

python3 tools/build.py --ios — збірка під App Store у dist-ios/ (звичайний
dist/ не чіпає): вирізає все між мітками @dev-only:start … @dev-only:end
(режим розробника, інструменти Нокса, що виконують код) і прибирає
'unsafe-eval' з політики безпеки (CSP). Перевірка: tools/check-ios.sh.
"""
import os, re, shutil, subprocess, sys, time

IOS  = '--ios' in sys.argv[1:]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'src')
DIST = os.path.join(ROOT, 'dist-ios' if IOS else 'dist')
OUTN = 'dist-ios' if IOS else 'dist'

# Мітки dev-коду. У JS: /* @dev-only:start */ … /* @dev-only:end */, з
# необовʼязковим replace="…" — чим замінити блок (щоб лишився валідний код).
# У HTML: <!-- @dev-only:start --> … <!-- @dev-only:end -->. Вкладати не можна.
DEV_JS   = re.compile(r'/\*\s*@dev-only:start(?:\s+replace="([^"]*)")?\s*\*/.*?/\*\s*@dev-only:end\s*\*/', re.S)
DEV_HTML = re.compile(r'<!--\s*@dev-only:start\s*-->.*?<!--\s*@dev-only:end\s*-->\n?', re.S)

def strip_dev(out):
    """Вирізає dev-блоки й 'unsafe-eval'. Будь-яка невідповідність міток — помилка
    збірки: краще не зібрати, ніж тихо віддати в App Store шматок dev-коду."""
    starts = len(re.findall(r'@dev-only:start', out))
    ends   = len(re.findall(r'@dev-only:end', out))
    out, nh = DEV_HTML.subn('', out)
    out, nj = DEV_JS.subn(lambda m: m.group(1) or '', out)
    left = re.findall(r'@dev-only:(?:start|end)', out)
    if starts != ends or starts != nh + nj or left:
        print('ПОМИЛКА --ios: мітки @dev-only не парні чи вкладені (start %d, end %d, вирізано %d, лишилось %d)'
              % (starts, ends, nh + nj, len(left)))
        sys.exit(1)
    csp = re.compile(r'(<meta http-equiv="Content-Security-Policy" content="[^"]*?)\s*\'unsafe-eval\'')
    out, nc = csp.subn(r'\1', out)
    if nc != 1:
        print("ПОМИЛКА --ios: не знайшов 'unsafe-eval' у CSP (знайдено %d)" % nc); sys.exit(1)
    print('iOS: вирізано dev-блоків %d (JS %d, HTML %d), з CSP прибрано \'unsafe-eval\'' % (nh + nj, nj, nh))
    return out

def read(p):
    with open(p, 'r', encoding='utf-8', newline='') as f:
        return f.read()

def build_stamp():
    """Дата збірки + короткий git-хеш, напр. 2026-09-03-0142-50f7fc9.

    «+» у кінці — зібрано з незакомічених правок src/: тоді хеш описує код
    не повністю, і це видно одразу в «Ще» чи на аварійному банері."""
    try:
        h = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'],
                                    cwd=ROOT, stderr=subprocess.DEVNULL).decode().strip()
        dirty = subprocess.check_output(['git', 'status', '--porcelain', '--', 'src'],
                                        cwd=ROOT, stderr=subprocess.DEVNULL).decode().strip()
        if dirty:
            h += '+'
    except Exception:
        h = 'nogit'
    return time.strftime('%Y-%m-%d-%H%M') + '-' + h

def main():
    html = read(os.path.join(SRC, 'index.html'))
    used = []
    missing = []
    strays = []   # чужі файли в теках @@INCDIR (копії .bak, .orig, нотатки…)

    def sub(m):
        rel = m.group(1)
        p = os.path.join(SRC, rel)
        if not os.path.exists(p):
            missing.append(rel); return ''
        used.append(rel)
        return read(p)

    def subdir(m):
        rel = m.group(1)
        d = os.path.join(SRC, rel)
        if not os.path.isdir(d):
            missing.append(rel + '/'); return ''
        parts = []
        # Уся тека вклеюється в ОДИН <script>/<style>, тож у ній мають бути
        # лише файли коду одного виду. Забута `36-chats.js.bak` раніше тихо
        # потрапляла в програму і могла зламати весь core на телефоні.
        names = [n for n in sorted(os.listdir(d)) if not n.startswith('.')]
        code = [os.path.splitext(n)[1] for n in names if os.path.splitext(n)[1] in ('.js', '.css')]
        kind = max(set(code), key=code.count) if code else None   # вид теки: .js чи .css
        for name in names:
            if os.path.splitext(name)[1] != kind:
                strays.append(rel + '/' + name); continue
            used.append(rel + '/' + name)
            parts.append(read(os.path.join(d, name)))
        return ''.join(parts)

    out = re.sub(r'@@INCDIR:([^@]+)@@', subdir, html)
    out = re.sub(r'@@INC:([^@]+)@@', sub, out)

    # Версія збірки — у сторінку (window.FLOW_BUILD, 01-crash-screen.js) і
    # в sw.js нижче. Одна мітка на обидва: за банером з телефона видно,
    # з якого коміту зібрано те, що впало, і що кеш воркера — той самий.
    stamp = build_stamp()
    out = out.replace('@@BUILD@@', stamp)

    if missing:
        print('ПОМИЛКА — немає файлів:'); [print('  ' + m) for m in missing]; sys.exit(1)
    if strays:
        print('ПОМИЛКА — у теці, яка цілком вклеюється в програму, є зайві файли:')
        [print('  ' + m) for m in strays]
        print('Там можна тримати лише .js (для <script>) або лише .css (для <style>),')
        print('не впереміш. Інакше файл стане частиною коду і може зламати застосунок.')
        print('Прибери його з src/ (копії — у scratchpad або git) і збери знову.')
        sys.exit(1)

    if IOS:
        out = strip_dev(out)

    os.makedirs(DIST, exist_ok=True)
    dest = os.path.join(DIST, 'index.html')
    with open(dest, 'w', encoding='utf-8', newline='') as f:
        f.write(out)

    print('Зібрано %d частин → %s/index.html (%.1f KB, %d рядків), версія %s'
          % (len(used), OUTN, len(out.encode('utf-8'))/1024, out.count('\n') + 1, stamp))

    # Іконка + маніфест: щоб сайт можна було поставити на телефон
    # як застосунок (повний екран, своя іконка, без адресного рядка).
    wsrc = os.path.join(SRC, 'web')
    if os.path.isdir(wsrc):
        names = sorted(os.listdir(wsrc))
        for n in names:
            if n == 'sw.js':
                # версія збірки → новий кеш воркера, старі чистяться самі
                sw = read(os.path.join(wsrc, n)).replace('@@BUILD@@', stamp)
                with open(os.path.join(DIST, n), 'w', encoding='utf-8', newline='') as f:
                    f.write(sw)
            else:
                shutil.copy2(os.path.join(wsrc, n), os.path.join(DIST, n))
        print('Скопійовано в %s/: %s' % (OUTN, ', '.join(names)))

    # Бібліотеки (PDF, EPUB, вхід через Google) кладемо поруч, а не всередину:
    # вони важкі й потрібні рідко, тому вантажаться лише коли справді треба.
    vsrc, vdst = os.path.join(SRC, 'vendor'), os.path.join(DIST, 'vendor')
    if os.path.isdir(vsrc):
        if os.path.isdir(vdst): shutil.rmtree(vdst)
        shutil.copytree(vsrc, vdst)
        names = sorted(os.listdir(vdst))
        size = sum(os.path.getsize(os.path.join(vdst, f)) for f in names)
        print('Скопійовано %s/vendor/: %s (%.0f KB)' % (OUTN, ', '.join(names), size/1024))

main()
