#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Розкладає src/styles/01-core.css на тематичні файли у src/styles/core/.
Перевірка: у кожному шматку фігурні дужки збалансовані і немає обірваного коментаря."""
import os, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'src', 'styles', '01-core.css')
OUT  = os.path.join(ROOT, 'src', 'styles', 'core')

PLAN = [
    (1,    '01-tokens-base.css'),      # змінні, теми (світла/AMOLED), екрани, топбари, дашборд
    (205,  '02-page-editor.css'),      # редактор сторінки (Notion-стиль), блоки, преміум-пак
    (1450, '03-folders-projects.css'), # ролі папок, віджети проєктів, шапка Простору
    (1792, '04-menus.css'),            # універсальне меню дій / підтвердження
    (1853, '05-values-wishes.css'),    # «Створи себе» + Карта бажань
    (2038, '06-goals.css'),            # цілі, вкладка «Шлях»
    (2266, '07-finance.css'),          # фінанси: бенто, конверти, доходи
    (2904, '08-work.css'),             # трекер роботи
    (3106, '09-board-canvas.css'),     # простір/дошка, полотно, стилі, zen, радіальне меню
    (3633, '10-reader-blocks.css'),    # книга, читалка, сторінка, drag/resize, bento mix
    (4162, '11-spaces-desktop.css'),   # перемикач просторів + десктопний лейаут (Mac)
    (4491, '12-pets-more-planner.css'),# напарники, екран «Ще», планер, акаунт
    (5640, '13-search-capture.css'),   # пошук, undo, швидке захоплення, нагадування
    (5709, '14-agency.css'),           # Агенція
    (6041, '15-vision.css'),           # Візія
]

def balanced(s):
    d = 0; i = 0; n = len(s); st = None
    while i < n:
        c = s[i]
        if st is None:
            if c == '/' and i+1 < n and s[i+1] == '*': st='c'; i+=2; continue
            if c in '"\'': st=c; i+=1; continue
            if c == '{': d += 1
            elif c == '}': d -= 1
            if d < 0: return False, 'зайва }'
        elif st == 'c':
            if c == '*' and i+1 < n and s[i+1] == '/': st=None; i+=2; continue
        else:
            if c == '\\': i += 2; continue
            if c == st: st = None
        i += 1
    if st is not None: return False, 'обірваний коментар/рядок'
    if d != 0: return False, 'дужок не збігається: %+d' % d
    return True, 'OK'

lines = open(SRC, encoding='utf-8', newline='').read().split('\n')
if os.path.isdir(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)
bad = 0
for k, (start, name) in enumerate(PLAN):
    end = PLAN[k+1][0] if k+1 < len(PLAN) else len(lines) + 1
    body = '\n'.join(lines[start-1:end-1])
    if k+1 < len(PLAN): body += '\n'
    good, msg = balanced(body)
    if not good: bad += 1
    with open(os.path.join(OUT, name), 'w', encoding='utf-8', newline='') as f:
        f.write(body)
    print('  %s %-28s %5d рядків %7.1f KB  %s' % ('✅' if good else '❌', name, end-start, len(body.encode())/1024, '' if good else msg))
print('\nФайлів: %d, невалідних: %d' % (len(PLAN), bad))
