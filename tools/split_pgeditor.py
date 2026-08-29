#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, subprocess, tempfile, shutil
ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC   = os.path.join(ROOT, 'src', 'scripts', '30-page-editor.js')
OUT   = os.path.join(ROOT, 'src', 'scripts', 'page-editor')
CHECK = os.path.join(ROOT, 'tools', 'jscheck.sh')

PLAN = [
    (1,    '01-palette.js'),      # каталог блоків, синоніми, пошук, «Нещодавні»
    (205,  '02-block-styles.js'), # стилі заголовків, колонки, дошка 12 колонок, рендер списку
    (1129, '03-premium-pack.js'), # збереження текстів, pgAsk, тікер фокуса
    (1719, '04-w-journal.js'),    # віджет «Щоденник» (стрічка днів)
    (1826, '05-w-decisions.js'),  # віджет «Лог рішень»
    (1938, '06-w-project.js'),    # віджет «Проєкт-трекер»
    (2038, '07-w-habits.js'),     # віджет «Трекер звичок»
    (2107, '08-w-projects-hub.js'),# віджет «Хаб проєктів»
    (3034, '09-journal-sheet.js'),# щоденник: аркуш + місяць + зведення AI
]
def ok(src):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
        f.write(src); p=f.name
    try: return subprocess.run([CHECK,p],capture_output=True,text=True).stdout.strip()
    finally: os.unlink(p)

lines = open(SRC, encoding='utf-8', newline='').read().split('\n')
if os.path.isdir(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)
bad=0
for k,(start,name) in enumerate(PLAN):
    end = PLAN[k+1][0] if k+1<len(PLAN) else len(lines)+1
    body = '\n'.join(lines[start-1:end-1])
    if k+1<len(PLAN): body += '\n'
    # весь файл — одна обгортка (function(){...})(); тому шматки перевіряємо
    # в тому ж контексті: додаємо відсутню відкриваючу/закриваючу частину.
    pre  = '' if k == 0 else '(function(){\n'
    post = '' if k == len(PLAN)-1 else '\n})();'
    v = ok(pre + body + post)
    if v!='OK': bad+=1
    with open(os.path.join(OUT,name),'w',encoding='utf-8',newline='') as f: f.write(body)
    print('  %s %-24s %5d рядків %7.1f KB %s' % ('✅' if v=='OK' else '❌', name, end-start, len(body.encode())/1024, '' if v=='OK' else v[:70]))
print('\nФайлів: %d, невалідних: %d' % (len(PLAN), bad))
