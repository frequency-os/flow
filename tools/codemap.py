#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Будує CODEMAP.md — карту коду.

Карта веде в src/, а не в dist/index.html. Попередня карта вела в dist —
і саме тому старіла: dist перезбирається щоразу, номери рядків у ньому
поїхали вже наступного дня. Файли в src/ стабільні.

Запуск:    python3 tools/codemap.py            (або npm run map)
Перевірка: python3 tools/codemap.py --check    — нічого не пише, лише каже,
           чи карта відстала від коду. Це і викликає tools/check.sh.
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'CODEMAP.md')

# Теки, які збірка склеює в ОДИН <script> (маркер @@INCDIR у src/index.html).
# Їх не можна читати файл за файлом: page-editor/01-palette.js відкриває
# обгортку (function(){, а закриває її аж page-editor/09-journal-sheet.js
# рядком })();. Поодинці кожен із них виглядає як файл із поламаними дужками.
GROUP_DIRS = ('src/scripts/core', 'src/scripts/page-editor')

# Верхній рівень визначається глибиною фігурних дужок, а не відступом.
# Відступ бреше: core/02-storage.js має кілька функцій на 2 пробілах
# і все головне тіло на 4 (зайвий IIFE), а core/12-ai-agent.js має 127
# оголошень на 6 пробілах — але то локальні змінні всередині функцій.
#
# Глибина 0 — сам файл. Глибина 1 рахується верхнім рівнем ЛИШЕ тоді,
# коли її відкрила анонімна обгортка (function(){...})(). Якщо рівень 1
# відкрила звичайна іменована функція — це вже її тіло, і локальні змінні
# в карту не йдуть.
RE_WRAPPER = re.compile(
    r'^\s*[!+~\-]?\(\s*(?:async\s+)?function\s*[\w$]*\s*\([^()]*\)\s*$'
    r"|^\s*\(\s*(?:async\s+)?\([^()]*\)\s*=>\s*$")

# Селектори CSS шукаємо по відступу — там вкладеність дрібна.
CSS_TOP_INDENT = 2

RE_FUNC = re.compile(r'^(\s*)(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(')
RE_CLASS = re.compile(r'^(\s*)class\s+([A-Za-z_$][\w$]*)')
RE_VAR = re.compile(r'^(\s*)(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(.*)$')
RE_WIN = re.compile(r'^(\s*)window\.([A-Za-z_$][\w$]*)\s*=\s*(.*)$')


def is_minified(text):
    """Чужий мініфікований код розбирати немає сенсу."""
    lines = text.split('\n')
    if len(lines) < 5:
        return True
    return any(len(ln) > 2000 for ln in lines)


def kind_of(rest):
    """Що це — функція, обʼєкт, масив чи просто значення."""
    rest = rest.strip()
    if rest.startswith('function') or rest.startswith('async function'):
        return 'функція'
    if '=>' in rest.split('{')[0][:80]:
        return 'функція'
    if rest.startswith('{'):
        return "обʼєкт"
    if rest.startswith('['):
        return 'масив'
    if rest.startswith('new '):
        return "обʼєкт"
    return 'значення'


def top_level_lines(text):
    """Для кожного рядка: чи він на верхньому рівні.

    Рядки, коментарі, шаблонні літерали і регулярні вирази пропускаємо —
    інакше дужка всередині тексту зсуває лік. Саме на цьому спіткнувся
    попередній (втрачений) генератор карти.
    """
    tops = []
    wrapper1 = False     # рівень 1 відкрила анонімна обгортка?
    depth = 0
    line_start = 0
    i = 0
    n = len(text)
    state = 'code'       # code | line_comment | block_comment | string | template | regex
    quote = ''
    tmpl_stack = []      # глибини дужок, на яких відкрились ${...}
    prev_sig = ''        # останній значущий символ — регулярка чи ділення
    at_line_start = True

    while i < n:
        ch = text[i]
        if at_line_start:
            tops.append(depth == 0 or (depth == 1 and wrapper1))
            line_start = i
            at_line_start = False

        if ch == '\n':
            if state in ('line_comment', 'regex'):
                state = 'code'
            at_line_start = True
            i += 1
            continue

        if state == 'code':
            nxt = text[i + 1] if i + 1 < n else ''
            if ch == '/' and nxt == '/':
                state = 'line_comment'; i += 2; continue
            if ch == '/' and nxt == '*':
                state = 'block_comment'; i += 2; continue
            if ch == '/' and (prev_sig == '' or prev_sig in '(,=:[!&|?{};+-*%~^<>'):
                state = 'regex'; i += 1; continue
            if ch in '"\'':
                state = 'string'; quote = ch; i += 1; continue
            if ch == '`':
                state = 'template'; i += 1; continue
            if ch == '{':
                if depth == 0:
                    wrapper1 = bool(RE_WRAPPER.search(text[line_start:i].rstrip()))
                depth += 1
            elif ch == '}':
                if tmpl_stack and depth == tmpl_stack[-1] + 1:
                    # закриття ${...} — повертаємось у шаблонний рядок
                    tmpl_stack.pop(); depth -= 1; state = 'template'; i += 1; continue
                depth -= 1
            if not ch.isspace():
                prev_sig = ch
            i += 1; continue

        if state == 'block_comment':
            if ch == '*' and i + 1 < n and text[i + 1] == '/':
                state = 'code'; i += 2; continue
            i += 1; continue

        if state == 'line_comment':
            i += 1; continue

        if state == 'string':
            if ch == '\\':
                i += 2; continue
            if ch == quote:
                state = 'code'; prev_sig = quote
            i += 1; continue

        if state == 'regex':
            if ch == '\\':
                i += 2; continue
            if ch == '/':
                state = 'code'; prev_sig = '/'
            i += 1; continue

        if state == 'template':
            if ch == '\\':
                i += 2; continue
            if ch == '`':
                state = 'code'; prev_sig = '`'; i += 1; continue
            if ch == '$' and i + 1 < n and text[i + 1] == '{':
                tmpl_stack.append(depth); depth += 1; state = 'code'; i += 2; continue
            i += 1; continue

    while len(tops) < text.count('\n') + 1:
        tops.append(depth == 0 or (depth == 1 and wrapper1))
    return tops


def js_groups():
    """Групи файлів у порядку, в якому їх склеює збірка.

    Окремий файл = окремий <script>. Тека з GROUP_DIRS = один <script>.
    """
    groups = []
    base = os.path.join(ROOT, 'src/scripts')
    for name in sorted(os.listdir(base)):
        full = os.path.join(base, name)
        if os.path.isfile(full) and name.endswith('.js'):
            groups.append([os.path.relpath(full, ROOT)])
    for d in GROUP_DIRS:
        full_d = os.path.join(ROOT, d)
        if not os.path.isdir(full_d):
            continue
        files = [os.path.relpath(os.path.join(full_d, n), ROOT)
                 for n in sorted(os.listdir(full_d)) if n.endswith('.js')]
        if files:
            groups.append(files)
    return groups


def scan_group(rels):
    """Сканує групу як одне ціле, повертає {файл: [(рядок, імʼя, вид)]}."""
    texts = []
    for rel in rels:
        with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
            texts.append(f.read())

    result = {rel: [] for rel in rels}

    # мініфікований вендор позначаємо окремо і не розбираємо
    if len(rels) == 1 and is_minified(texts[0]):
        return {rels[0]: None}

    joined = ''.join(texts)          # рівно так само склеює tools/build.py
    tops = top_level_lines(joined)
    lines = joined.split('\n')

    # де в склеєному тексті починається кожен файл
    starts = []
    pos = 0
    for t in texts:
        starts.append(joined.count('\n', 0, pos))
        pos += len(t)

    def owner(g):
        """Якому файлу належить глобальний рядок g (0-базований)."""
        lo, hi = 0, len(starts) - 1
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if starts[mid] <= g:
                lo = mid
            else:
                hi = mid - 1
        return lo

    for idx, line in enumerate(lines):
        if idx >= len(tops) or not tops[idx]:
            continue
        for rx, kind in ((RE_FUNC, 'функція'), (RE_CLASS, 'клас'),
                         (RE_VAR, None), (RE_WIN, None)):
            m = rx.match(line)
            if not m:
                continue
            name = m.group(2)
            if rx is RE_WIN:
                name = 'window.' + name
            k = kind or kind_of(m.group(3))
            oi = owner(idx)
            result[rels[oi]].append((idx - starts[oi] + 1, name, k))
            break
    return result


def scan_css(path):
    """Рахує селектори верхнього рівня."""
    with open(path, encoding='utf-8') as f:
        lines = f.read().splitlines()
    n = 0
    for line in lines:
        stripped = line.lstrip()
        indent = len(line) - len(stripped)
        if indent <= CSS_TOP_INDENT and stripped.endswith('{') and not stripped.startswith('@'):
            n += 1
    return n, len(lines)


def flow_keys():
    """FLOW_KEYS — реєстр ключів сховища, живе в 01-base.js."""
    path = os.path.join(ROOT, 'src/scripts/core/01-base.js')
    if not os.path.exists(path):
        return []
    with open(path, encoding='utf-8') as f:
        text = f.read()
    m = re.search(r'FLOW_KEYS\s*=\s*\[(.*?)\]', text, re.S)
    if not m:
        return []
    return sorted(set(re.findall(r"'([^']+)'", m.group(1))))


def nlines(rel):
    # splitlines, а не split('\n'): інакше завершальний перевід рядка
    # дає зайвий порожній рядок, і карта рахує на один більше в кожному файлі
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return len(f.read().splitlines())


def build():
    js_data = []                      # (rel, рядків, сутності або None)
    for rels in js_groups():
        found = scan_group(rels)
        for rel in rels:
            js_data.append((rel, nlines(rel), found[rel]))
    js_data.sort(key=lambda r: r[0])

    css_data = []
    css_base = os.path.join(ROOT, 'src/styles')
    for dirpath, dirnames, filenames in os.walk(css_base):
        dirnames.sort()
        for name in sorted(filenames):
            if name.endswith('.css'):
                full = os.path.join(dirpath, name)
                nsel, nl = scan_css(full)
                css_data.append((os.path.relpath(full, ROOT), nl, nsel))
    css_data.sort(key=lambda r: r[0])

    keys = flow_keys()
    total_ents = sum(len(e) for _, _, e in js_data if e is not None)

    L = []
    a = L.append
    a('# CODEMAP — карта коду')
    a('')
    a('> **Цей файл створює скрипт. Руками не правити** — зміни зітруться.')
    a('> Перебудувати: `npm run map`. Чи не відстала карта — скаже `./tools/check.sh`.')
    a('>')
    a('> Карта веде в `src/`, а не в `dist/index.html`: `dist` перезбирається')
    a('> щоразу, тому номери рядків у ньому старіють одразу.')
    a('>')
    a('> **Навіщо:** щоб не тягнути в контекст AI-сесії весь код. Спершу карта —')
    a('> потім читати лише потрібний файл.')
    a('')
    a('## Огляд')
    a('')
    a('| Метрика | Значення |')
    a('|---|---|')
    a('| Файлів JS | {} |'.format(len(js_data)))
    a('| Рядків JS | {} |'.format(sum(n for _, n, _ in js_data)))
    a('| Файлів CSS | {} |'.format(len(css_data)))
    a('| Рядків CSS | {} |'.format(sum(n for _, n, _ in css_data)))
    a('| Сутностей верхнього рівня | {} |'.format(total_ents))
    a('| Ключів сховища (FLOW_KEYS) | {} |'.format(len(keys)))
    a('')

    a('## Файли JS')
    a('')
    a('| Файл | Рядків | Сутностей |')
    a('|---|---|---|')
    for rel, nl, ents in js_data:
        n = '—' if ents is None else str(len(ents))
        note = ' _(мініфікований вендор)_' if ents is None else ''
        a('| `{}`{} | {} | {} |'.format(rel, note, nl, n))
    a('')

    a('## Файли CSS')
    a('')
    a('| Файл | Рядків | Селекторів |')
    a('|---|---|---|')
    for rel, nl, nsel in css_data:
        a('| `{}` | {} | {} |'.format(rel, nl, nsel))
    a('')

    if keys:
        a('## Ключі сховища — FLOW_KEYS ({})'.format(len(keys)))
        a('')
        a('`src/scripts/core/01-base.js`')
        a('')
        for i in range(0, len(keys), 6):
            a('`' + '` · `'.join(keys[i:i + 6]) + '`')
            a('')

    a('## Сутності по файлах')
    a('')
    a('Посилання виду `файл:рядок` — клікабельні.')
    a('')
    for rel, nl, ents in js_data:
        if ents is None:
            continue
        if not ents:
            a('### `{}` — порожньо на верхньому рівні'.format(rel))
            a('')
            continue
        a('### `{}` — {} сутностей'.format(rel, len(ents)))
        a('')
        a('| Імʼя | Вид | Де |')
        a('|---|---|---|')
        for line, name, kind in ents:
            a('| `{}` | {} | `{}:{}` |'.format(name, kind, rel, line))
        a('')

    return '\n'.join(L).rstrip() + '\n'


def main():
    text = build()
    if '--check' in sys.argv:
        old = ''
        if os.path.exists(OUT):
            with open(OUT, encoding='utf-8') as f:
                old = f.read()
        if old != text:
            print('CODEMAP.md відстав від коду — запусти: npm run map')
            return 1
        print('CODEMAP.md збігається з кодом')
        return 0
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(text)
    print('CODEMAP.md перебудовано: {} рядків'.format(len(text.split('\n'))))
    return 0


if __name__ == '__main__':
    sys.exit(main())
