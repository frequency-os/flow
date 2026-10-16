#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
hub.py — збирає pult/hub/tracks.json: зміст «Хабу навичок» (приватна сторінка
на claude.ai, сторінка — pult/hub/index.html).

Звідки береться зміст (усе з репо, тож хаб і пульт не розходяться):
  • Код         — кроки pult/stezhka.json + 6 тем і слова docs/slovnyk.md
  • Англійська  — англійські оригінали слів словника + pult/hub/slova-en.json

Прогрес людини тут НЕ лежить: він у базі самого хабу (cards, words, steps,
quiz) і в репо не потрапляє.

Запуск: python3 tools/hub.py   → потім Claude публікує хаб (Artifact).
"""

import hashlib
import json
import os
import re
import sys
from datetime import datetime

TOOLS = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, TOOLS)
import pult  # glossary(), read() — той самий розбір словника, що й у пульті

ROOT = pult.ROOT
OUT = os.path.join(ROOT, 'pult', 'hub', 'tracks.json')


def sid(prefix, text):
    """Стабільний id документа бази: лише латиниця/цифри (вимога шляхів db)."""
    slug = re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')[:40]
    h = hashlib.sha1(text.encode('utf-8')).hexdigest()[:6]
    return f'{prefix}-{slug}-{h}' if slug else f'{prefix}-{h}'


def eng_parts(eng):
    """«hook, «хук»» → ('hook', 'хук'); без латиниці — (None, …)."""
    pron = ''
    m = re.search(r'«([^»]+)»', eng)
    if m:
        pron = m.group(1)
    word = None
    for part in re.sub(r'«[^»]*»', '', eng).split(','):
        p = part.strip()
        if re.search(r'[A-Za-z]', p):
            word = p
            break
    return word, pron


def build():
    secs = pult.glossary()
    steps = json.loads(pult.read('pult/stezhka.json') or '{}').get('steps', [])
    extra = json.loads(pult.read('pult/hub/slova-en.json') or '{}').get('words', [])

    topics = []
    cards, seen = [], set()
    for s in secs:
        terms = []
        for t in s['terms']:
            terms.append({'id': sid('t', t['name']), 'name': t['name'], 'eng': t['eng'], 'desc': t['desc']})
            word, pron = eng_parts(t['eng'])
            if word and word.lower() not in seen:
                seen.add(word.lower())
                cards.append({'id': sid('c', word), 'en': word, 'pron': pron, 'uk': t['name'],
                              'desc': t['desc'], 'ex': '', 'src': 'словник · ' + s['name']})
        topics.append({'n': s['n'], 'name': s['name'], 'terms': terms})
    for w in extra:
        if w['en'].lower() in seen:
            continue
        seen.add(w['en'].lower())
        cards.append({'id': sid('c', w['en']), 'en': w['en'], 'pron': w.get('pron', ''), 'uk': w.get('uk', ''),
                      'desc': '', 'ex': w.get('ex', ''), 'src': 'урок · ' + w.get('koly', '')})

    data = {
        'built': datetime.now().strftime('%d.%m.%Y %H:%M'),
        'tracks': [
            {'id': 'code', 'name': 'Код', 'kind': 'path', 'color': 'teal', 'steps': steps, 'topics': topics},
            {'id': 'english', 'name': 'Англійська', 'kind': 'cards', 'color': 'blue', 'cards': cards},
            {'id': 'finance', 'name': 'Фінанси', 'kind': 'soon', 'color': 'amber',
             'note': 'Етап 2: 8 кроків на основі «Фінграмотності» й Гаманця у Frequency.'},
            {'id': 'marketing', 'name': 'Маркетинг', 'kind': 'soon', 'color': 'pink',
             'note': 'Етап 2: 8 кроків на основі посібника «комерція/».'},
        ],
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    return data


if __name__ == '__main__':
    d = build()
    code, eng = d['tracks'][0], d['tracks'][1]
    print(f"Хаб зібрано: {os.path.relpath(OUT, ROOT)} — кроків {len(code['steps'])}, "
          f"слів {sum(len(t['terms']) for t in code['topics'])}, карток англійської {len(eng['cards'])}")
