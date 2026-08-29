#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
split.py — одноразова операція: ріже original/index11.html на частини.
Кожен інлайновий <script>/<style> стає окремим файлом у src/scripts | src/styles,
а на його місці в src/index.html лишається маркер @@INC:шлях@@.
Нічого в самому коді не змінюється — тільки переїзд байтів у файли.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_HTML = os.path.join(ROOT, 'original', 'index11.html')

# Ім'я файлу за номером рядка, де відкривається тег (1-based).
NAMES = {
    # ---- <script> ----
    8:     'scripts/01-crash-screen.js',
    28:    'scripts/02-vendor-lz-string.js',
    6525:  'scripts/03-quota-banner.js',
    7362:  'scripts/10-core.js',
    26789: 'scripts/20-radial-menu.js',
    26921: 'scripts/21-newyear-countdown.js',
    27046: 'scripts/30-page-editor.js',
    30609: 'scripts/40-pets-3d.js',
    31362: 'scripts/41-theme-layer.js',
    31513: 'scripts/42-voice-island.js',
    32381: 'scripts/43-planner.js',
    32654: 'scripts/44-week.js',
    33215: 'scripts/45-month.js',
    34081: 'scripts/46-mx.js',
    # ---- <style> ----
    34:    'styles/01-core.css',
    6247:  'styles/02-income-cards.css',
    6400:  'styles/03-patterns.css',
    6472:  'styles/04-diary.css',
    30531: 'styles/10-fd26.css',
    30561: 'styles/11-agency.css',
    30898: 'styles/12-theme-nightfire.css',
    32298: 'styles/13-planner.css',
    32516: 'styles/14-week.css',
    32986: 'styles/15-month.css',
    33878: 'styles/16-mx.css',
    34298: 'styles/17-horizon.css',
}

def main():
    with open(SRC_HTML, 'r', encoding='utf-8', newline='') as f:
        text = f.read()

    lines = text.split('\n')            # без втрати даних: join('\n') відновить точно
    out_lines = []
    i = 0
    n = len(lines)
    extracted = []

    while i < n:
        line = lines[i]
        lineno = i + 1
        m = re.match(r'<(script|style)\b([^>]*)>', line)
        # тег рахуємо тільки якщо він на початку рядка (колонка 0)
        if not m:
            out_lines.append(line); i += 1; continue

        tag = m.group(1)
        attrs = m.group(2)
        # зовнішній <script src=...> — не чіпаємо
        if 'src=' in attrs:
            out_lines.append(line); i += 1; continue

        close = '</%s>' % tag
        # шукаємо закриваючий тег на початку рядка
        j = i
        while j < n and not lines[j].startswith(close):
            j += 1
        if j >= n:
            print('!! не знайдено %s для рядка %d' % (close, lineno)); sys.exit(1)

        path = NAMES.get(lineno)
        if not path:
            print('!! немає імені для %s на рядку %d' % (tag, lineno)); sys.exit(1)

        # внутрішній вміст = все між '>' відкриваючого тега і '</' закриваючого
        head_rest = line[m.end():]                 # хвіст рядка після '>'
        body = '\n'.join([head_rest] + lines[i+1:j] + [''])   # + '' дає \n перед </tag>
        # (lines[j] — рядок із закриваючим тегом; він може мати хвіст після </tag>)
        tail = lines[j][len(close):]

        dest = os.path.join(ROOT, 'src', path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, 'w', encoding='utf-8', newline='') as f:
            f.write(body)

        out_lines.append('<%s%s>@@INC:%s@@%s%s' % (tag, attrs, path, close, tail))
        extracted.append((path, len(body.split('\n')) - 1, len(body)))
        i = j + 1

    skeleton = '\n'.join(out_lines)
    with open(os.path.join(ROOT, 'src', 'index.html'), 'w', encoding='utf-8', newline='') as f:
        f.write(skeleton)

    print('Витягнуто %d частин:' % len(extracted))
    for p, l, b in extracted:
        print('  %-36s %6d рядків  %8.1f KB' % (p, l, b/1024))
    print('Каркас src/index.html: %d рядків' % len(out_lines))

main()
