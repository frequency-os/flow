#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Розкладає src/scripts/10-core.js на змістовні файли у src/scripts/core/.
Кожен шматок перевіряється справжнім JS-движком перед записом."""
import os, subprocess, sys, tempfile, shutil

ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORE  = os.path.join(ROOT, 'src', 'scripts', '10-core.js')
OUT   = os.path.join(ROOT, 'src', 'scripts', 'core')
CHECK = os.path.join(ROOT, 'tools', 'jscheck.sh')

# (перший рядок шматка, ім'я файлу)
PLAN = [
    (1,     '01-base.js'),                # дати, реєстр ключів, i18n/dev-переклад, ловець помилок, Telegram init
    (303,   '02-storage.js'),             # CloudStorage + localStorage + Capacitor Preferences, auth, sync, бекап
    (1154,  '03-platform.js'),            # єдиний шар над Telegram / Desktop / Mobile
    (1255,  '04-folders-nav.js'),         # папки, Vault(PIN), віджети папок, ролі, вкладеність, роутер екранів
    (1545,  '05-agency.js'),              # Захист.SK: дашборд, огляд, сховище документів, клієнти, партнерство
    (3511,  '06-wishes.js'),              # Карта бажань
    (4629,  '07-values.js'),              # «Створи себе» (цінності)
    (4831,  '08-finance.js'),             # конверти, доходи, курси валют, регулярні платежі, грамотність
    (6323,  '09-goals.js'),               # цілі на рік, AI-старт (Точка А→Б), цілі дня
    (6933,  '10-planner.js'),             # планер: день/тиждень/місяць/квартал, календар, «Шлях»
    (7836,  '11-ai-flow.js'),             # ФЛОУ: повноекранний AI-екран
    (7992,  '12-ai-agent.js'),            # агентний режим + dev-асистент (Нокс)
    (9253,  '13-pets.js'),                # напарники
    (9459,  '14-react.js'),               # живі реакції на дії
    (9794,  '15-flow-spot.js'),           # флоу-спот: міні-простір поверх екрана
    (11775, '16-dashboard.js'),           # головний екран, перетягування папок, дії над папкою
    (12275, '17-folder-render.js'),       # малювання вмісту папки
    (12500, '18-debts.js'),               # борги
    (12676, '19-spending.js'),            # витрати
    (12811, '20-work.js'),                # трекер роботи
    (13317, '21-patterns.js'),            # патерни: перехват лазівок, 4-місячна трансформація
    (13508, '22-diary.js'),               # щоденник
    (13703, '23-board.js'),               # дошка/простір: логіка, візуальні стилі, пошук, undo, вхідні
    (14336, '24-reminders.js'),           # нагадування через Telegram-бота
    (14967, '25-reader.js'),              # читалка книг: TXT/MD/EPUB/PDF + IndexedDB
    (15555, '26-blocks-render.js'),       # рендер блоків дошки
    (17446, '27-canvas.js'),              # канвас: зум, антиколізія, вільні розміри, resize, drag
    (18573, '28-vision.js'),              # «Візія» — бенто-екран
    (19106, '29-more-screen.js'),         # екран «Ще»
]

def ok(src):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
        f.write(src); p = f.name
    try:
        return subprocess.run([CHECK, p], capture_output=True, text=True).stdout.strip()
    finally:
        os.unlink(p)

lines = open(CORE, encoding='utf-8', newline='').read().split('\n')
if os.path.isdir(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)

bad = 0
for k, (start, name) in enumerate(PLAN):
    end = PLAN[k+1][0] if k+1 < len(PLAN) else len(lines) + 1
    chunk = lines[start-1:end-1]
    body = '\n'.join(chunk)
    if k+1 < len(PLAN): body += '\n'
    verdict = ok(body)
    if verdict != 'OK':
        bad += 1
        print('  ❌ %-24s %s' % (name, verdict[:90]))
    with open(os.path.join(OUT, name), 'w', encoding='utf-8', newline='') as f:
        f.write(body)
    print('  %s %-24s %5d рядків %7.1f KB' % ('✅' if verdict=='OK' else '❌', name, end-start, len(body.encode())/1024))

print('\nФайлів: %d, невалідних: %d' % (len(PLAN), bad))
