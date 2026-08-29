#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ріже src/scripts/10-core.js на секції по коментарях-заголовках.
Кожна межа перевіряється справжнім JS-движком (jscheck.sh): якщо шматок
не є валідним JS сам по собі — межа неправильна, шматок зростає до наступної.
"""
import os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORE = os.path.join(ROOT, 'src', 'scripts', '10-core.js')
CHECK = os.path.join(ROOT, 'tools', 'jscheck.sh')

def ok(src):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
        f.write(src); p = f.name
    try:
        r = subprocess.run([CHECK, p], capture_output=True, text=True).stdout.strip()
    finally:
        os.unlink(p)
    return r == 'OK', r

lines = open(CORE, encoding='utf-8', newline='').read().split('\n')
HDR = re.compile(r'^  /\* *[=═]{4,}(.*)')
cands = [0] + [i for i, l in enumerate(lines) if HDR.match(l)]
cands = sorted(set(cands))
print('кандидатів на межі: %d' % len(cands))

bounds = [0]
i = 0
merged = 0
while i < len(cands):
    start = bounds[-1]
    j = i + 1
    while j < len(cands):
        end = cands[j]
        good, msg = ok('\n'.join(lines[start:end]))
        if good:
            bounds.append(end); break
        merged += 1
        j += 1
    if j >= len(cands):
        break
    i = j
print('меж прийнято: %d (злито невалідних: %d)' % (len(bounds), merged))

def title(idx):
    if idx == 0: return 'prelude'
    m = HDR.match(lines[idx])
    t = (m.group(1) or '').strip(' =═*/').strip()
    t = re.sub(r'[^\wЀ-ӿ ·-]', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t[:48] or 'section'

for k, b in enumerate(bounds):
    end = bounds[k+1] if k+1 < len(bounds) else len(lines)
    print('%3d  %6d–%-6d  %5d рядків  %s' % (k, b+1, end, end-b, title(b)))
