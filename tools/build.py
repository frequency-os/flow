#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build.py — збирає src/ назад в один файл dist/index.html.
Це і є «готова програма»: саме її відкриває браузер, Telegram, iPhone, Android.
Правиш файли в src/ → запускаєш build → отримуєш dist/index.html.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'src')
DIST = os.path.join(ROOT, 'dist')

def read(p):
    with open(p, 'r', encoding='utf-8', newline='') as f:
        return f.read()

def main():
    html = read(os.path.join(SRC, 'index.html'))
    used = []
    missing = []

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
        for name in sorted(os.listdir(d)):
            if name.startswith('.'): continue
            used.append(rel + '/' + name)
            parts.append(read(os.path.join(d, name)))
        return ''.join(parts)

    out = re.sub(r'@@INCDIR:([^@]+)@@', subdir, html)
    out = re.sub(r'@@INC:([^@]+)@@', sub, out)

    if missing:
        print('ПОМИЛКА — немає файлів:'); [print('  ' + m) for m in missing]; sys.exit(1)

    os.makedirs(DIST, exist_ok=True)
    dest = os.path.join(DIST, 'index.html')
    with open(dest, 'w', encoding='utf-8', newline='') as f:
        f.write(out)

    print('Зібрано %d частин → dist/index.html (%.1f KB, %d рядків)'
          % (len(used), len(out.encode('utf-8'))/1024, out.count('\n') + 1))

main()
