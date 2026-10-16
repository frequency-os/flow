#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
pult.py — збирає pult/index.html: пульт «як ми працюємо над Frequency».

Що на сторінці:
  1) Карта метро — шлях задачі від задуму до телефона (pult/marshrut.json).
  2) Дерево папок — скіли, рецензенти, промпти, команди, скрипти, документи.
     Опис кожного файлу береться з самого файлу, тож пульт не застаріває.
  3) Журнал — що робили, по днях, з історії git.
  4) Кандидати з GitHub (pult/kandydaty.json).

Пульт сам нічого не записує. Кнопки ✎ і ＋ кладуть у буфер готовий запит
до Claude — правку робить Claude у чаті, з перевіркою.

Запуск: python3 tools/pult.py   (або npm run pult — ще й відкриє в браузері)
"""

import html
import json
import os
import re
import subprocess
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'pult', 'index.html')

# Папки дерева: (шлях, як називати один файл у запиті, що це за папка).
# Скіли — окремо: там кожен скіл є текою з SKILL.md усередині.
FOLDERS = [
    ('.claude/skills', 'скіл', 'Скіли — інструкції, які Claude підхоплює сам за знайомими словами'),
    ('.claude/agents', 'рецензента', 'Рецензенти — окремі агенти, що лише читають і повертають вердикт'),
    ('prompts', 'промпт', 'Промпти — готові тексти, які вставляють у чат першим повідомленням'),
    ('prompts/audits', 'промпт аудиту', 'Аудити — один вимір проєкту, звіт «файл:рядок + сценарій»'),
    ('prompts/workflows', 'робочий процес', 'Робочі процеси — покрокові шляхи для типових задач'),
    ('tools', 'скрипт', 'Скрипти — те, що стоїть за командами npm run …'),
    ('docs', 'документ', 'Документи — словник і чернетки'),
    ('pult', 'файл пульта', 'Пульт — маршрут і кандидати, які ведемо руками'),
]
ROOT_FILES = ['CLAUDE.md', 'CODEMAP.md', 'README.md', '.gitleaks.toml']

STATUSES = ['розглядаємо', 'беремо', 'взяли', 'відмовились']
TYPE_LABEL = {'skill': 'скіл', 'agent': 'рецензент', 'command': 'команда',
              'file': 'файл', 'planned': 'заплановано'}

esc = lambda s: html.escape(str(s), quote=True)


def read(path):
    try:
        with open(os.path.join(ROOT, path), encoding='utf-8') as f:
            return f.read()
    except (OSError, UnicodeDecodeError):
        return ''


def describe(path):
    """Опис файлу одним абзацом — з того, що вже написано в ньому самому."""
    text = read(path)
    if not text:
        return ''
    if path.endswith('.json'):
        try:
            return json.loads(text).get('_opys', '')
        except ValueError:
            return ''
    if path.endswith('.md'):
        # Скіли й рецензенти: поле description у шапці між ---.
        m = re.match(r'---\n(.*?)\n---', text, re.S)
        if m:
            d = re.search(r'^description:\s*"?(.*?)"?\s*$', m.group(1), re.M)
            if d:
                return d.group(1)
            text = text[m.end():]
        # Аудити мають рядок «Мета виміру» — він кращий за інструкцію зверху.
        goal = re.search(r'^\*\*Мета[^*]*:\*\*\s*(.+)$', text, re.M)
        if goal:
            return md_plain(goal.group(1))
        # Інакше: перший абзац після заголовка (цитату «> …» теж беремо),
        # крім «Як користуватись» — вона однакова в усіх аудитах.
        paras, cur = [], []
        for ln in text.splitlines():
            s = ln.strip().lstrip('>').strip()
            if s.startswith('#') or not s or s == '---':
                if cur:
                    paras.append(' '.join(cur))
                    cur = []
                continue
            cur.append(s)
        if cur:
            paras.append(' '.join(cur))
        for para in paras:
            if not para.startswith('Як користуватись'):
                return md_plain(para)
        return ''
    # Скрипти: коментар на початку (після #!/…), або перший рядок docstring.
    lines = []
    for ln in text.splitlines()[:14]:
        s = ln.strip()
        if s.startswith('#!') or '-*- coding' in s or s in ('"""', "'''"):
            continue
        c = re.match(r'^(#|//|/\*+|\*)\s?(.*?)(\*/)?$', s)
        if c and not s.startswith('#!'):
            body = c.group(2).strip()
            if body:
                lines.append(body)
            elif lines:
                break
            continue
        if lines:
            break
        if s and not lines and path.endswith('.py'):
            lines.append(s)   # перший рядок docstring
            continue
        if s:
            break
    d = ' '.join(lines)
    return re.sub(r'^[\w.-]+\.(py|sh|js)\s*—\s*', '', d)


def md_plain(s):
    """Markdown → простий текст: без **, з текстом посилань замість [..](..)."""
    s = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', s)
    return s.replace('**', '').replace('`', '')


def title(path):
    """Заголовок # … з .md-файлу — людська назва поруч з імʼям файлу."""
    if not path.endswith('.md'):
        return ''
    m = re.search(r'^# (.+)$', read(path), re.M)
    return md_plain(m.group(1).strip()) if m else ''


def list_folder(rel):
    """Файли однієї папки дерева (без підпапок; скіли — теки з SKILL.md)."""
    full = os.path.join(ROOT, rel)
    if not os.path.isdir(full):
        return []
    items = []
    for name in sorted(os.listdir(full)):
        if name.startswith('.') or name == 'index.html':
            continue
        p = os.path.join(rel, name)
        if rel == '.claude/skills':
            if os.path.isfile(os.path.join(ROOT, p, 'SKILL.md')):
                extra = len([n for n in os.listdir(os.path.join(ROOT, p)) if not n.startswith('.')]) - 1
                items.append({'name': name, 'path': p + '/SKILL.md', 'extra': extra})
        elif os.path.isfile(os.path.join(ROOT, p)) and not name.endswith('.pyc'):
            items.append({'name': name, 'path': p, 'extra': 0})
    for it in items:
        d = describe(it['path'])
        it['desc'] = d[:1].upper() + d[1:]
        it['title'] = title(it['path'])
        it['id'] = 'f-' + re.sub(r'[^\w-]', '-', it['path'])
    return items


def npm_scripts():
    try:
        scripts = json.loads(read('package.json')).get('scripts', {})
    except ValueError:
        return []
    out = []
    for name, cmd in scripts.items():
        m = re.search(r'tools/[\w.-]+', cmd)
        out.append({'name': name, 'cmd': cmd, 'file': m.group(0) if m else '',
                    'id': 'cmd-' + re.sub(r'[^\w-]', '-', name)})
    return out


def git(*args):
    try:
        return subprocess.run(['git', *args], cwd=ROOT, capture_output=True,
                              text=True, timeout=20).stdout
    except (OSError, subprocess.SubprocessError):
        return ''


def journal(limit=60):
    """Останні коміти, згруповані по днях. Публікація = тег pub-* або «публікація …»."""
    days = {}
    for ln in git('log', '-n', str(limit), '--date=format-local:%Y-%m-%d %H:%M',
                  '--format=%h\t%ad\t%s\t%D').splitlines():
        parts = ln.split('\t')
        if len(parts) < 3:
            continue
        h, when, subj = parts[:3]
        refs = parts[3] if len(parts) > 3 else ''
        pub = 'tag: pub-' in refs or subj.lower().startswith('публікація')
        days.setdefault(when[:10], []).append(
            {'hash': h, 'time': when[11:], 'subj': subj, 'pub': pub})
    dirty = len([l for l in git('status', '--porcelain').splitlines() if l.strip()])
    return days, dirty


# ─────────────── Конвеєр: правиться → гілки → закомічено → на сайті ───────────────

ALIVE_H = 48   # гілка «жива», якщо в ній був рух за останні 48 годин


def topic_key(path):
    """56-run.js і 36-run.css → «run»: тема = імʼя файлу без номера й розширення."""
    stem = os.path.splitext(os.path.basename(path.rstrip('/')))[0]
    return re.sub(r'^\d+-', '', stem)


def work_now(names):
    """Незакомічене в головній папці, згруповане за темами, з +/− рядків."""
    nums = {}
    for ln in git('diff', 'HEAD', '--numstat').splitlines():
        a, d, p = (ln.split('\t') + ['', '', ''])[:3]
        nums[p] = (int(a) if a.isdigit() else 0, int(d) if d.isdigit() else 0)
    topics = {}
    for ln in git('status', '--porcelain', '--untracked-files=all').splitlines():
        if len(ln) < 4:
            continue
        code, path = ln[:2], ln[3:].split(' -> ')[-1].strip('"')
        new = code == '??' or 'A' in code
        add, rem = nums.get(path, (0, 0))
        if code == '??':
            add = read(path).count('\n')
        # Різні файли однієї теми (pult.py, temy.json → «Пульт») — в одну картку.
        key = topic_key(path)
        t = topics.setdefault(names.get(key, key), {'key': key, 'name': names.get(key, ''), 'files': [],
                                    'add': 0, 'rem': 0, 'new': False})
        t['files'].append({'path': path, 'new': new, 'add': add, 'rem': rem})
        t['add'] += add
        t['rem'] += rem
        t['new'] = t['new'] or new
    return sorted(topics.values(), key=lambda t: -(t['add'] + t['rem']))


def branches():
    """Гілки з комітами, яких справді нема в main (git cherry: той самий патч не рахується)."""
    trees, cur = {}, None
    for ln in git('worktree', 'list', '--porcelain').splitlines():
        if ln.startswith('worktree '):
            cur = ln[9:]
        elif ln.startswith('branch refs/heads/') and cur:
            trees[ln[18:]] = cur
    now = datetime.now().timestamp()
    out = []
    for b in git('branch', '--no-merged', 'main', '--format=%(refname:short)').split():
        ahead = len([l for l in git('cherry', 'main', b).splitlines() if l.startswith('+')])
        if not ahead:
            continue
        ts, subj = (git('log', '-1', '--format=%ct\t%s', b).strip().split('\t') + ['', ''])[:2]
        last = int(ts) if ts.isdigit() else 0
        wt = trees.get(b, '')
        dirty, touched = 0, last
        if wt and os.path.isdir(wt):
            for ln in git('-C', wt, 'status', '--porcelain').splitlines():
                dirty += 1
                try:
                    touched = max(touched, os.path.getmtime(os.path.join(wt, ln[3:].strip('"'))))
                except OSError:
                    pass
        out.append({'name': b, 'ahead': ahead, 'subj': subj, 'last': last, 'wt': wt,
                    'dirty': dirty, 'alive': now - touched < ALIVE_H * 3600})
    return sorted(out, key=lambda x: (not x['alive'], -x['last']))


def site():
    """Остання публікація (тег pub-*) і коміти main після неї."""
    tag = (git('tag', '-l', 'pub-*', '--sort=-creatordate').split() or [''])[0]
    if not tag:
        return None, []
    ts = git('log', '-1', '--format=%ct', tag).strip()
    waiting = []
    for ln in git('log', '--format=%h\t%ct\t%s', f'{tag}..main').splitlines():
        h, t, s = (ln.split('\t') + ['', '', ''])[:3]
        waiting.append({'hash': h, 'ts': int(t) if t.isdigit() else 0, 'subj': s})
    return {'tag': tag, 'ts': int(ts) if ts.isdigit() else 0}, waiting


def ago(ts):
    """«3 год тому», «2 дні тому» — для людини, а не для машини."""
    if not ts:
        return ''
    m = int((datetime.now().timestamp() - ts) // 60)
    if m < 60:
        return f'{max(m, 1)} хв тому'
    if m < 48 * 60:
        return f'{m // 60} год тому'
    return f'{m // 1440} дн. тому'


# ───────────────────────── HTML ─────────────────────────

def prompt_edit(kind, path):
    return (f'Зміни {kind} `{path}`:\n<що змінити>\n\n'
            'Спершу коротко скажи задум і дочекайся «так». Після правки — '
            'npm run check і npm run pult, покажи вивід.')


def prompt_add(kind, folder, desc):
    return (f'Додай новий {kind} у `{folder}/` ({desc.split(" — ")[0].lower()}):\n'
            '<що він має робити і коли ним користуватись>\n\n'
            'Спершу коротко скажи задум і дочекайся «так». Після — '
            'npm run check і npm run pult, покажи вивід.')


# ─────────────── Мої навички: словник → карта, стежка, особистий прогрес ───────────────

SK_ICONS = {1: '⌨️', 2: '🗄️', 3: '🌿', 4: '🛠️', 5: '🔒', 6: '🖼️'}
LEVELS = {'розумію': 1, 'застосував': 2}


def glossary():
    """docs/slovnyk.md → розділи «## N. Назва» зі словами «- **Слово** (*eng*) — що це»."""
    secs, cur = [], None
    for ln in read('docs/slovnyk.md').splitlines():
        m = re.match(r'^## (\d+)\. (.+)$', ln)
        if m:
            cur = {'n': int(m.group(1)), 'name': m.group(2).strip(), 'terms': []}
            secs.append(cur)
            continue
        m = re.match(r'^- \*\*([^*]+)\*\*\s*(?:\(([^)]*)\))?\s*—\s*(.*)$', ln)
        if m and cur:
            desc = md_plain(m.group(3)).replace('*', '')
            desc = desc.split('У Frequency:')[0].strip()
            cur['terms'].append({'name': m.group(1).strip(),
                                 'eng': (m.group(2) or '').replace('*', '').strip(),
                                 'desc': desc[:160] + ('…' if len(desc) > 160 else '')})
    return secs


def progress():
    """Прогрес навчання живе в базі Хабу навичок (claude.ai), пульт його не бачить —
    тут лише порожня заготовка, щоб карта показувала слова без позначок."""
    return {'slova': {}, 'kroky': {}, 'zrobysam': []}


def hub_url():
    """Адреса приватного Хабу навичок — pult/hub.local.json (поза git)."""
    try:
        u = json.loads(read('pult/hub.local.json') or '{}').get('url', '')
    except ValueError:
        u = ''
    return u if u.startswith('https://claude.ai/') else ''


def skills_html(secs, steps, prog):
    o = []
    w = o.append
    done = prog['kroky']
    nxt = next((s for s in steps if s.get('id') not in done), None)

    def lv(name):
        return LEVELS.get((prog['slova'].get(name) or {}).get('riven'), 0)

    total = sum(len(s['terms']) for s in secs)
    got = sum(1 for s in secs for t in s['terms'] if lv(t['name']))
    w('<section id="sec-skills"><div class="sec-h"><h2>Мої навички</h2>'
      f'<p class="muted">Карта — {total} слів зі словника по 6 темах і стежка з кроків. Прогрес, картки англійської '
      'й міні-тести — у Хабі навичок (відкривається і з телефона).</p>'
      + (f'<p><a class="hub-link" href="{esc(hub_url())}" target="_blank" rel="noopener noreferrer">Відкрити Хаб навичок ↗</a></p>'
         if hub_url() else '') + '</div><div class="skmap">')
    for s in secs:
        n = len(s['terms'])
        g = sum(1 for t in s['terms'] if lv(t['name']))
        pct = round(100 * g / n) if n else 0
        step = next((x for x in steps if x.get('tema') == s['n'] and x.get('id') not in done), None)
        status = f'{g} з {n}' if g else f'{n} слів'
        w(f'<details class="sk"><summary><span class="sk-i">{SK_ICONS.get(s["n"], "📘")}</span>'
          f'<b>{esc(s["name"])}</b><span class="sk-bar" role="img" aria-label="{esc(status)}"><i style="width:{pct}%"></i></span>'
          f'<span class="sk-n">{esc(status)}</span>'
          + (f'<span class="sk-next">далі: {esc(step["nazva"])}</span>' if step else '')
          + '</summary><div class="sk-body"><ul class="words">')
        for t in s['terms']:
            lvl = lv(t['name'])
            mark = ['зустрів', 'розумію', 'застосував'][lvl]
            ask = (f'Я розумію слово «{t["name"]}». Постав мені одне коротке питання, щоб перевірити. '
                   'Якщо відповідь правильна — познач його в Хабі навичок як «розумію».')
            w(f'<li><span class="lv lv{lvl}" title="{mark}"></span><span class="w"><b>{esc(t["name"])}</b>'
              + (f' <span class="eng">{esc(t["eng"])}</span>' if t['eng'] else '')
              + f'<span class="d">{esc(t["desc"])}</span></span>'
              + ('' if lvl else f'<button class="ico sm" data-copy="{esc(ask)}" aria-label="Я розумію: {esc(t["name"])}">✓</button>')
              + '</li>')
        w('</ul>')
        mats = [x for x in steps if x.get('tema') == s['n'] and (x.get('material') or {}).get('url', '').startswith('https://')]
        if mats:
            w('<p class="sk-m">Матеріали: ' + ' · '.join(
                f'<a href="{esc(x["material"]["url"])}" target="_blank" rel="noopener noreferrer">{esc(x["material"]["nazva"])}</a>'
                for x in mats) + '</p>')
        w('</div></details>')
    w('</div>')

    # Стежка
    w(f'<h3 class="path-h">Стежка <span class="muted">· пройдено {len([s for s in steps if s.get("id") in done])} з {len(steps)}</span></h3><ol class="path">')
    for i, s in enumerate(steps, 1):
        sid = s.get('id', '')
        m = s.get('material') or {}
        url = m.get('url', '') if str(m.get('url', '')).startswith('https://') else ''
        edit = (f'Зміни крок «{s.get("nazva")}» у pult/stezhka.json:\n<що змінити>\n\nПісля — npm run pult.')
        if sid in done:
            koly = (done[sid] or {}).get('koly', '')
            w(f'<li class="st-done"><span class="pd">✓</span><div><b>{esc(s.get("nazva"))}</b>'
              f'<span class="muted"> · {esc(koly)}</span></div></li>')
        elif s is nxt:
            start = (f'Почнімо крок {i} «{s.get("nazva")}» зі стежки навчання (pult/stezhka.json).\n'
                     f'Поясни поняття на прикладі Frequency, дай матеріал ({url}), потім «Зроби сам»: {s.get("zrobysam")}\n'
                     f'Крок пройдено, коли: {s.get("proideno")}\n'
                     'Після — відміть прогрес у Хабі навичок.')
            w(f'<li class="st-now"><span class="pd">{i}</span><div class="pn"><b>{esc(s.get("nazva"))}</b>'
              f'<p>{esc(s.get("ideia"))}</p>'
              '<p class="chips">' + ''.join(f'<span class="chip">{esc(x)}</span>' for x in s.get('slova', [])) + '</p>'
              + (f'<p>📖 <a href="{esc(url)}" target="_blank" rel="noopener noreferrer">{esc(m.get("nazva"))}</a>'
                 f'<span class="muted"> · ~{esc(m.get("hv", ""))} хв</span></p>' if url else '')
              + f'<p>✍️ <b>Зроби сам:</b> {esc(s.get("zrobysam"))}</p>'
              f'<p class="muted">Пройдено, коли: {esc(s.get("proideno"))}</p>'
              f'<div class="cb"><button class="act-s" data-copy="{esc(start)}">Почати крок</button>'
              f'<button data-copy="{esc(edit)}">✎ Змінити</button></div></div></li>')
        else:
            w(f'<li class="st-next"><span class="pd">{i}</span><div><b>{esc(s.get("nazva"))}</b>'
              f'<span class="muted"> · {esc(s.get("ideia", "").split(".")[0])}.</span></div>'
              f'<button class="ico sm" data-copy="{esc(edit)}" aria-label="Змінити крок {esc(s.get("nazva"))}">✎</button></li>')
    w('</ol></section>')
    return '\n'.join(o), got, total


def chip(use, index):
    t, n = use.get('type', 'file'), use.get('name', '')
    target = index.get((t, n))
    label = n.split('/')[-1] if t in ('file', 'planned') else n
    if t == 'command':
        label = 'npm run ' + n
    # На чипі — коротко: «deploy», а не «frequency-deploy»; повне імʼя в підказці.
    if t == 'skill':
        label = n.replace('frequency-', '')
    if t == 'agent':
        label = n.replace('-reviewer', '')
    cls = 'chip t-' + t + ('' if target else ' missing')
    title = TYPE_LABEL.get(t, t) + ' · ' + n
    if not target:
        title += ' — не знайдено, перевір marshrut.json'
    return (f'<button class="{cls}" data-go="{esc(target or "")}" title="{esc(title)}">'
            f'{esc(label)}</button>')


def render():
    route = json.loads(read('pult/marshrut.json') or '{}')
    cands = json.loads(read('pult/kandydaty.json') or '{}').get('items', [])
    folders = [(rel, kind, desc, list_folder(rel)) for rel, kind, desc in FOLDERS]
    roots = [{'name': n, 'path': n, 'extra': 0, 'desc': describe(n), 'title': title(n),
              'id': 'f-' + re.sub(r'[^\w-]', '-', n)}
             for n in ROOT_FILES if os.path.isfile(os.path.join(ROOT, n))]
    scripts = npm_scripts()
    days, dirty = journal()
    names = json.loads(read('pult/temy.json') or '{}').get('names', {})
    steps = json.loads(read('pult/stezhka.json') or '{}').get('steps', [])
    skills, sk_got, sk_total = skills_html(glossary(), steps, progress())
    now_topics, brs = work_now(names), branches()
    pub, waiting = site()
    dir_id = lambda rel: 'd-' + re.sub(r'[^\w-]', '-', rel)

    # Покажчик «тип + імʼя → якір у дереві» для чипів карти.
    index = {}
    for rel, _, _, items in folders:
        for it in items:
            index[('file', it['path'])] = it['id']
            if rel == '.claude/skills':
                index[('skill', it['name'])] = it['id']
            if rel == '.claude/agents':
                index[('agent', it['name'][:-3])] = it['id']
    for it in roots:
        index[('file', it['path'])] = it['id']
    for s in scripts:
        index[('command', s['name'])] = s['id']
    for c in cands:
        index[('planned', c['name'])] = 'k-' + re.sub(r'[^\w-]', '-', c['name'])

    # Лічильники вгорі — кнопки: торкнешся «7 скілів» — пульт відкриє саму папку.
    counts = [('скілів', len(folders[0][3]), dir_id('.claude/skills')),
              ('рецензентів', len(folders[1][3]), dir_id('.claude/agents')),
              ('команд', len(scripts), 'd-npm'),
              ('промптів', sum(len(f[3]) for f in folders if f[0].startswith('prompts')), dir_id('prompts')),
              ('кандидатів', len([c for c in cands if c.get('status') in ('розглядаємо', 'беремо')]), 'sec-kand')]
    alive = [b for b in brs if b['alive']]

    o = []
    w = o.append
    w('<header class="top"><div><h1>Пульт Frequency</h1>'
      '<p class="muted">Що в нас є і яким шляхом іде кожна задача. '
      f'Зібрано {esc(datetime.now().strftime("%d.%m.%Y %H:%M"))} · оновити: <code>npm run pult</code></p></div>'
      '<div class="counts">' + ''.join(f'<button data-go="{esc(g)}"><b>{n}</b><span>{esc(l)}</span></button>'
                                       for l, n, g in counts)
      + '</div></header>')

    # Навігація: блоки сторінки, липка смужка вгорі.
    nfiles = sum(len(t['files']) for t in now_topics)
    nav = [('sec-work', 'В роботі', str(nfiles)), ('sec-skills', 'Навички', f'{sk_got}/{sk_total}'),
           ('sec-route', 'Маршрут', ''), ('sec-tree', 'Папки', ''),
           ('sec-log', 'Журнал', ''), ('sec-kand', 'Кандидати', str(counts[4][1]))]
    w('<nav class="nav" aria-label="Блоки пульта">' + ''.join(
        f'<button data-go="{i}">{esc(l)}' + (f'<span>{esc(c)}</span>' if c else '') + '</button>'
        for i, l, c in nav) + '</nav>')

    # 0) Конвеєр: правиться зараз → окремі гілки → закомічено → на сайті
    w('<section id="sec-work"><div class="sec-h"><h2>Що в роботі</h2>'
      '<p class="muted">Кожна робота рухається зліва направо. Стан на момент збірки — свіже після <code>npm run pult</code>.</p></div>'
      '<div class="conv">')

    w(f'<div class="col" id="col-now"><div class="col-h"><span>Правиться зараз</span><b>{nfiles}</b></div>'
      '<p class="col-s">Не закомічено в головній папці. Хто саме править — git не знає: тут кілька сесій.</p>')
    for t in now_topics:
        files = ', '.join(f['path'].split('/')[-1] for f in t['files'])
        label = t['name'] or t['key']
        ask = (f'Тема «{label}» не закомічена в головній папці: {files}.\n'
               'Подивись, чия це робота і чи вона готова. Скажи, що з нею робити, — '
               'нічого не комітити без мого «так».')
        name_ask = (f'Дай людську назву темі `{t["key"]}` у pult/temy.json: <назва>. Після — npm run pult.')
        head = (esc(t['name']) if t['name'] else
                 f'<code>{esc(t["key"])}</code> <button class="link" data-copy="{esc(name_ask)}">назвати</button>')
        w(f'<div class="it"><div class="it-h"><b>{head}</b>'
          + ('<span class="tag new">нове</span>' if t['new'] else '')
          + f'<span class="pm"><i>+{t["add"]}</i> <s>−{t["rem"]}</s></span>'
          f'<button class="ico sm" data-copy="{esc(ask)}" aria-label="Запит про тему {esc(label)}">✎</button></div>'
          f'<div class="it-f">{esc(files)}</div></div>')
    if not now_topics:
        w('<p class="empty">Усе закомічено ✓</p>')
    w('</div>')

    def branch_item(b):
        where = f' (папка {b["wt"].replace(ROOT + "/", "")})' if b['wt'] else ''
        if b['alive']:
            ask = (f'Гілка {b["name"]}{where}: {b["ahead"]} коміт(ів) ще не в main. '
                   'Що там зроблено, що лишилось до злиття і чи все перевірено? Нічого не зливати без мого «так».')
        else:
            ask = (f'Розберись з гілкою {b["name"]}{where}: {b["ahead"]} коміт(ів) git вважає не злитими, '
                   'останній рух ' + ago(b['last']) + '. Чи її вміст уже в main (могли влити зі змінами)? '
                   'Запропонуй: злити, прибрати чи лишити. Нічого не видаляти без мого «так».')
        meta = f'{b["ahead"]} ком. · {ago(b["last"])}' + (f' · {b["dirty"]} незакоміч.' if b['dirty'] else '')
        return (f'<div class="it"><div class="it-h"><b class="mono">{esc(b["name"])}</b>'
                f'<button class="ico sm" data-copy="{esc(ask)}" aria-label="Запит про гілку {esc(b["name"])}">✎</button></div>'
                f'<div class="it-m">{esc(meta)}</div><div class="it-f">{esc(b["subj"])}</div></div>')

    stale = [b for b in brs if not b['alive']]
    w(f'<div class="col" id="col-br"><div class="col-h"><span>Окремі гілки</span><b>{len(alive)}</b></div>'
      f'<p class="col-s">Паралельні сесії у своїх папках. Живі — рух за {ALIVE_H} год.</p>'
      + ''.join(branch_item(b) for b in alive)
      + ('' if alive else '<p class="empty">Живих гілок нема</p>'))
    if stale:
        w(f'<details class="stale"><summary>Застиглі: {len(stale)} — перевірити</summary>'
          + ''.join(branch_item(b) for b in stale) + '</details>')
    w('</div>')

    deploy_ask = (f'Задеплой: на сайті ще нема {len(waiting)} коміт(ів) після {pub["tag"] if pub else "останньої публікації"}. '
                  'Покажи перелік того, що поїде (і чиї це коміти), і дочекайся мого «так».')
    w(f'<div class="col" id="col-wait"><div class="col-h"><span>Закомічено, не на сайті</span><b>{len(waiting)}</b></div>'
      '<p class="col-s">Уже в main, але телефон їх ще не бачить.</p>')
    for c in waiting[:10]:
        dim = ' dim' if c['subj'].startswith('Карта коду') else ''
        w(f'<div class="it{dim}"><div class="it-f">{esc(c["subj"])}</div><div class="it-m">{esc(ago(c["ts"]))} · {esc(c["hash"])}</div></div>')
    if len(waiting) > 10:
        w(f'<button class="link more-log" data-go="sec-log">ще {len(waiting) - 10} — у журналі</button>')
    if waiting:
        w(f'<button class="act" data-copy="{esc(deploy_ask)}">Задеплой…</button>')
    else:
        w('<p class="empty">Усе вже на сайті ✓</p>')
    w('</div>')

    w('<div class="col" id="col-site"><div class="col-h"><span>На сайті</span><b>✓</b></div>')
    if pub:
        d = datetime.fromtimestamp(pub['ts']).strftime('%d.%m %H:%M') if pub['ts'] else ''
        w(f'<p class="col-s">Остання публікація</p><div class="big">{esc(d)}</div>'
          f'<div class="it-m">{esc(ago(pub["ts"]))}</div><code class="tagname">{esc(pub["tag"])}</code>')
    else:
        w('<p class="empty">Публікацій ще не було</p>')
    w('</div></div></section>')

    # Мої навички: карта тем словника + стежка
    w(skills)

    # 1) Карта метро
    w('<section id="sec-route"><div class="sec-h"><h2>Маршрут задачі</h2>'
      '<p class="muted">Натисни чип — покажу, де цей файл лежить. ✎ біля станції — змінити саму станцію.</p></div>'
      '<ol class="metro">')
    stations = route.get('stations', [])
    for i, st in enumerate(stations):
        ask = (f'Зміни станцію «{st.get("name")}» на карті пульта (`pult/marshrut.json`):\n'
               '<що додати чи прибрати>\n\nПісля — npm run pult, покажи знімок.')
        w(f'<li class="st{" last" if i == len(stations) - 1 else ""}"><span class="dot"></span>'
          f'<div class="st-b"><div class="st-h"><span class="st-n">{i + 1}</span>'
          f'<b>{esc(st.get("name", ""))}</b>'
          f'<button class="ico" data-copy="{esc(ask)}" aria-label="Змінити станцію {esc(st.get("name", ""))}">✎</button></div>'
          f'<p class="hint">{esc(st.get("hint", ""))}</p><div class="chips">'
          + ''.join(chip(u, index) for u in st.get('uses', [])) + '</div></div></li>')
    w('</ol><p class="legend"><span class="chip t-skill">скіл</span><span class="chip t-agent">рецензент</span>'
      '<span class="chip t-command">команда</span><span class="chip t-file">файл</span>'
      '<span class="chip t-planned">заплановано</span></p></section>')

    # 2) Дерево папок
    w('<section id="sec-tree"><div class="sec-h"><h2>Де що лежить</h2>'
      '<p class="muted">Торкнись файлу — повний опис. ✎ — запит «зміни», ＋ — запит «додай». '
      'Обидва йдуть у буфер: встав у чат із Claude.</p></div><div class="tree">')

    def file_row(it, kind):
        extra = f'<span class="tag">+{it["extra"]} файл.</span>' if it['extra'] > 0 else ''
        desc = it['desc'] or 'опису нема — допиши перший рядок у файлі'
        return (f'<details class="file" id="{esc(it["id"])}"><summary>'
                f'<span class="fn">{esc(it["name"])}</span>{extra}'
                f'<span class="ft">{esc(it["title"])}</span>'
                f'<span class="fd">{esc(desc)}</span>'
                f'<button class="ico" data-copy="{esc(prompt_edit(kind, it["path"]))}" '
                f'aria-label="Виправити {esc(it["name"])}">✎</button></summary>'
                f'<div class="more"><p>{esc(desc)}</p><code>{esc(it["path"])}</code></div></details>')

    w('<details class="dir" open><summary><span class="dn">📁 корінь проєкту</span>'
      '<span class="dd">Правила, карта коду, опис</span><span class="cnt">'
      f'{len(roots)}</span></summary>' + ''.join(file_row(it, 'файл') for it in roots) + '</details>')

    for rel, kind, desc, items in folders:
        w(f'<details class="dir" open id="{esc(dir_id(rel))}"><summary><span class="dn">📁 {esc(rel)}/</span>'
          f'<span class="dd">{esc(desc)}</span><span class="cnt">{len(items)}</span>'
          f'<button class="ico add" data-copy="{esc(prompt_add(kind, rel, desc))}" '
          f'aria-label="Додати в {esc(rel)}">＋</button></summary>'
          + ''.join(file_row(it, kind) for it in items) + '</details>')

    w('<details class="dir" open id="d-npm"><summary><span class="dn">⌨ npm run …</span>'
      '<span class="dd">Команди з package.json — що запускати в терміналі</span>'
      f'<span class="cnt">{len(scripts)}</span></summary>')
    for s in scripts:
        go = index.get(('file', s['file']), '')
        link = (f'<button class="chip t-file" data-go="{esc(go)}">{esc(s["file"].split("/")[-1])}</button>'
                if go else '')
        w(f'<div class="file cmd" id="{esc(s["id"])}"><div class="row"><span class="fn">npm run {esc(s["name"])}</span>'
          f'<span class="fd"><code>{esc(s["cmd"])}</code></span>{link}</div></div>')
    w('</details></div></section>')

    # 3) Журнал
    w('<section id="sec-log"><div class="sec-h"><h2>Що робили</h2><p class="muted">Останні коміти з git, по днях. '
      '<span class="chip t-pub">на сайті</span> — публікація.'
      + (f' Зараз не закомічено файлів: <b>{dirty}</b> (зокрема робота інших сесій).' if dirty else '')
      + '</p></div><div class="journal">')
    for day in sorted(days, reverse=True):
        try:
            label = datetime.strptime(day, '%Y-%m-%d').strftime('%d.%m')
        except ValueError:
            label = day
        w(f'<div class="day"><div class="dl">{esc(label)}<span>{len(days[day])}</span></div><ul>')
        for c in days[day]:
            pub = '<span class="chip t-pub">на сайті</span>' if c['pub'] else ''
            w(f'<li><span class="tm">{esc(c["time"])}</span><span class="cs">{esc(c["subj"])}</span>'
              f'{pub}<code class="h">{esc(c["hash"])}</code></li>')
        w('</ul></div>')
    w('</div></section>')

    # 4) Кандидати
    w('<section id="sec-kand"><div class="sec-h"><h2>Кандидати з GitHub</h2><p class="muted">'
      'Чуже береться лише після того, як Claude прочитав кожен файл і зафіксував версію.</p></div>'
      '<div class="cands">')
    order = {s: i for i, s in enumerate(STATUSES)}
    for c in sorted(cands, key=lambda c: order.get(c.get('status'), 9)):
        st = c.get('status', 'розглядаємо')
        url = c.get('url', '')
        url = url if url.startswith('https://github.com/') else ''
        cid = 'k-' + re.sub(r'[^\w-]', '-', c.get('name', ''))
        ask_take = (f'Беремо кандидата {c.get("name")} з пульта. Прочитай кожен файл, який братимемо, '
                    'зафіксуй версію, скажи задум встановлення і дочекайся «так». '
                    'Після — онови статус у pult/kandydaty.json і npm run pult.')
        ask_drop = (f'Відмовляємось від кандидата {c.get("name")}: <чому>. '
                    'Онови статус у pult/kandydaty.json на «відмовились» і npm run pult.')
        name = (f'<a href="{esc(url)}" target="_blank" rel="noopener noreferrer">{esc(c.get("name", ""))}</a>'
                if url else esc(c.get('name', '')))
        btns = ('' if st in ('взяли', 'відмовились') else
                f'<div class="cb"><button data-copy="{esc(ask_take)}">Беремо</button>'
                f'<button data-copy="{esc(ask_drop)}">Відмовитись</button></div>')
        w(f'<article class="cand s-{order.get(st, 9)}" id="{esc(cid)}"><div class="ch">{name}'
          f'<span class="tag">{esc(c.get("kind", ""))} · ⭐ {esc(c.get("stars", ""))}</span>'
          f'<span class="status">{esc(st)}</span></div>'
          f'<p>{esc(c.get("value", ""))}</p><p class="minus">Мінус: {esc(c.get("minus", ""))}</p>{btns}</article>')
    w('</div></section>')

    return PAGE.replace('@@BODY@@', '\n'.join(o))


PAGE = '''<!doctype html>
<html lang="uk"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Пульт Frequency</title>
<style>
:root{--bg:#f6f5fb;--card:#fff;--line:#e4e1ef;--tx:#1d1b26;--mu:#6b6780;--ac:#6c4fd8;--ac-bg:#efeafd;
--sk:#0f6e56;--sk-bg:#e1f5ee;--ag:#3c3489;--ag-bg:#eeedfe;--cm:#633806;--cm-bg:#faeeda;
--pl:#6b6780;--pub:#27500a;--pub-bg:#eaf3de;--bad:#a32d2d}
@media (prefers-color-scheme:dark){:root{--bg:#14121b;--card:#1d1a27;--line:#2f2b3d;--tx:#ece9f6;--mu:#a29db8;
--ac:#a993ff;--ac-bg:#2a2340;--sk:#9fe1cb;--sk-bg:#0d3b30;--ag:#cecbf6;--ag-bg:#2c2766;--cm:#fac775;--cm-bg:#3d2a0c;
--pl:#a29db8;--pub:#c0dd97;--pub-bg:#22370f;--bad:#f09595}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--tx);font:15px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;
padding:max(16px,env(safe-area-inset-top)) 16px 48px}
main{max-width:1100px;margin:0 auto}
h1{font-size:24px;margin:0}h2{font-size:18px;margin:0}
code{font:12.5px ui-monospace,Menlo,monospace}
.muted{color:var(--mu);margin:4px 0 0;font-size:13.5px}
section{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;margin-top:16px}
.sec-h{margin-bottom:14px}
.top{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:flex-end}
.counts{display:flex;gap:8px;flex-wrap:wrap}
.counts button{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:8px 12px;min-width:76px;text-align:left}
.counts button:hover,.nav button:hover{border-color:var(--ac)}
.counts b{display:block;font-size:20px}.counts span{font-size:12px;color:var(--mu)}
/* липка смужка блоків */
.nav{position:sticky;top:0;z-index:5;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;
margin:12px -16px 0;padding:10px 16px;background:var(--bg)}
.nav::-webkit-scrollbar{display:none}
.nav button{flex:none;border:1px solid var(--line);background:var(--card);border-radius:999px;padding:0 14px;min-height:40px;font-size:14px}
.nav span{margin-left:6px;color:var(--mu);font-size:12.5px}
section,.dir,.file,.cand{scroll-margin-top:70px}
/* мої навички */
.skmap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
@media (max-width:900px){.skmap{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.skmap{grid-template-columns:1fr}}
.sk{border:1px solid var(--line);border-radius:14px;padding:12px;min-width:0}
.sk[open]{grid-column:1/-1}
.sk>summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:auto 1fr auto;gap:4px 8px;align-items:center}
.sk>summary::-webkit-details-marker{display:none}
.sk-i{font-size:18px}.sk>summary b{font-size:14px}
.sk-bar{grid-column:1/-1;height:8px;border-radius:4px;background:var(--ac-bg);overflow:hidden}
.sk-bar i{display:block;height:100%;background:var(--ac);border-radius:4px}
.sk-n{font-size:12px;color:var(--mu)}
.sk-next{grid-column:1/-1;font-size:12px;color:var(--mu)}
.sk-body{margin-top:10px;border-top:1px solid var(--line);padding-top:6px}
.words{list-style:none;margin:0;padding:0;columns:2 280px;column-gap:20px}
.words li{display:flex;gap:8px;align-items:flex-start;padding:5px 0;break-inside:avoid;font-size:13.5px}
.lv{flex:none;width:10px;height:10px;border-radius:50%;margin-top:5px;border:2px solid var(--ac)}
.lv1{background:var(--ac-bg)}.lv2{background:var(--ac)}
.w{flex:1;min-width:0}.eng{color:var(--mu);font-size:12px}
.d{display:block;color:var(--mu);font-size:12.5px}
.sk-m{font-size:13px;margin:8px 0 0}.sk-m a,.pn a{color:var(--ac)}
.path-h{font-size:16px;margin:18px 0 6px}
.hub-link{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;margin-top:8px;border-radius:10px;
background:var(--ac);color:var(--bg);font-weight:600;text-decoration:none}
.path{list-style:none;margin:0;padding:0}
.path li{display:flex;gap:10px;align-items:flex-start;border-top:1px solid var(--line);padding:9px 0;font-size:13.5px}
.pd{flex:none;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:600}
.st-done .pd{background:var(--sk-bg);color:var(--sk)}
.st-now .pd{background:var(--ac);color:var(--bg)}
.st-next .pd{border:1px dashed var(--mu);color:var(--mu)}
.st-next>div{flex:1;min-width:0}.st-next b{font-weight:500}
.pn{flex:1;min-width:0}.pn p{margin:6px 0 0}.pn .chips{margin-top:4px}
.act-s{border:1px solid var(--ac);background:var(--ac-bg);color:var(--ac);border-radius:10px;padding:0 16px;min-height:44px;font-weight:600}
/* конвеєр */
.conv{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
@media (max-width:1000px){.conv{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.conv{grid-template-columns:1fr}}
.col{border:1px solid var(--line);border-radius:14px;padding:12px;min-width:0;position:relative}
.col::after{content:"→";position:absolute;right:-12px;top:12px;color:var(--mu);font-size:13px}
.col:last-child::after{content:none}
@media (max-width:1000px){.col::after{content:none}}
.col-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-weight:600}
.col-h b{font-size:22px}
#col-now .col-h b{color:var(--cm)}#col-br .col-h b{color:var(--ac)}#col-wait .col-h b{color:var(--sk)}#col-site .col-h b{color:var(--pub)}
.col-s{font-size:12.5px;color:var(--mu);margin:2px 0 8px}
.it{border-top:1px solid var(--line);padding:7px 0;font-size:13.5px;min-width:0}
.it.dim{opacity:.55}
.it-h{display:flex;align-items:center;gap:6px;min-width:0}
.it-h b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.mono{font:12.5px ui-monospace,Menlo,monospace}
.it-f{color:var(--mu);font-size:12.5px;overflow-wrap:anywhere}
.it-m{color:var(--mu);font-size:12px}
.pm{font-size:12px;flex:none}.pm i{font-style:normal;color:var(--sk)}.pm s{text-decoration:none;color:var(--bad)}
.tag.new{background:var(--cm-bg);color:var(--cm);border-radius:6px;padding:0 6px}
.ico.sm{min-width:32px;height:32px;font-size:13px}
.link{border:0;background:none;color:var(--ac);padding:4px 2px;font-size:12.5px}
.act{margin-top:8px;width:100%;min-height:42px;border-radius:10px;border:1px solid var(--ac);background:var(--ac-bg);color:var(--ac);font-weight:600}
.stale{margin-top:6px}.stale>summary{cursor:pointer;color:var(--mu);font-size:13px;padding:6px 0;min-height:32px}
.empty{color:var(--mu);font-size:13px;margin:6px 0}
.big{font-size:22px;font-weight:600}
.tagname{color:var(--mu);font-size:11.5px;display:block;margin-top:6px;overflow-wrap:anywhere}
button{font:inherit;color:inherit;cursor:pointer}
.chip{display:inline-block;border:0;border-radius:8px;padding:3px 8px;margin:3px 4px 0 0;font-size:12.5px;line-height:1.4;
background:var(--line);color:var(--tx);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.t-skill{background:var(--sk-bg);color:var(--sk)}.t-agent{background:var(--ag-bg);color:var(--ag)}
.t-command{background:var(--cm-bg);color:var(--cm)}.t-file{background:var(--line);color:var(--tx)}
.t-planned{background:transparent;color:var(--pl);outline:1px dashed var(--pl);outline-offset:-1px}
.t-pub{background:var(--pub-bg);color:var(--pub)}
.chip.missing{outline:1px dashed var(--bad);color:var(--bad);background:transparent}
.legend{margin:14px 0 0}
.ico{border:1px solid var(--line);background:var(--card);border-radius:10px;min-width:36px;height:36px;font-size:15px;flex:none}
.ico:hover,.cb button:hover{border-color:var(--ac);color:var(--ac)}
/* метро: на ноутбуці — горизонтальна лінія, на телефоні — вертикальна */
.metro{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;position:relative}
.st{position:relative;padding-top:30px}
.st::before{content:"";position:absolute;top:9px;left:0;right:-8px;height:4px;background:var(--ac)}
.st.last::before{right:50%}.st:first-child::before{left:50%}
.dot{position:absolute;top:2px;left:50%;margin-left:-9px;width:18px;height:18px;border-radius:50%;background:var(--card);border:4px solid var(--ac)}
.st.last .dot{background:var(--ac)}
.st-h{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;text-align:center}
.st-h .ico{min-width:30px;height:30px;font-size:13px}
.st-n{font-size:11px;color:var(--mu)}
.hint{font-size:12px;color:var(--mu);margin:2px 0 4px;text-align:center}
.chips{text-align:center}
@media (max-width:900px){
 .metro{grid-template-columns:1fr;gap:0}
 .st{padding:0 0 18px 34px}
 .st::before{top:0;bottom:0;left:7px;right:auto;width:4px;height:auto}
 .st:first-child::before{left:7px;top:10px}.st.last::before{right:auto;bottom:auto;height:10px}
 .dot{top:2px;left:0;margin-left:0}
 .st-h{justify-content:flex-start;text-align:left}.hint,.chips{text-align:left}
}
/* дерево */
.tree{border-left:2px solid var(--line);padding-left:12px}
.dir{margin:0 0 10px}
.dir>summary,.file>summary{list-style:none;cursor:pointer}
.dir>summary::-webkit-details-marker,.file>summary::-webkit-details-marker{display:none}
.dir>summary{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 0}
.dn{font-weight:600}.dd{color:var(--mu);font-size:13px;flex:1;min-width:200px}
.cnt{font-size:12px;color:var(--mu);background:var(--line);border-radius:8px;padding:1px 8px}
.file{margin-left:18px;border-top:1px solid var(--line)}
.file>summary,.file .row{display:flex;align-items:center;gap:10px;padding:6px 0;min-height:44px}
.fn{font:13px ui-monospace,Menlo,monospace;flex:none;max-width:42%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fd{flex:1;min-width:0;color:var(--mu);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ft{flex:none;font-size:13.5px;font-weight:600;max-width:30%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ft:empty{display:none}
.tag{font-size:11.5px;color:var(--mu);flex:none}
.more{padding:0 0 10px;font-size:13.5px}.more p{margin:0 0 6px}.more code{color:var(--mu)}
.file.flash{animation:fl 1.6s ease}
@keyframes fl{0%,40%{background:var(--ac-bg)}100%{background:transparent}}
@media (max-width:600px){.file{margin-left:6px}.file>summary{flex-wrap:wrap;row-gap:0}.fn{flex:1;max-width:calc(100% - 50px)}
 .ft{order:3;flex-basis:100%;max-width:none;font-weight:500;color:var(--mu);font-size:12.5px;margin-top:-4px}.fd{display:none}.dd{min-width:0;flex-basis:100%;order:5}}
/* журнал */
.day{display:flex;gap:14px;border-top:1px solid var(--line);padding:8px 0}
.dl{flex:none;width:52px;font-weight:600}.dl span{display:block;font-size:11px;color:var(--mu);font-weight:400}
.day ul{list-style:none;margin:0;padding:0;flex:1;min-width:0}
.day li{display:flex;gap:8px;align-items:baseline;padding:3px 0;font-size:13.5px;flex-wrap:wrap}
.tm{color:var(--mu);font-size:12px;flex:none}.cs{flex:1;min-width:0}.h{color:var(--mu);font-size:11.5px}
@media (max-width:600px){.day{flex-direction:column;gap:2px}.dl span{display:inline;margin-left:6px}.h{display:none}}
/* кандидати */
.cands{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.cand{border:1px solid var(--line);border-radius:14px;padding:12px 14px;font-size:13.5px}
.cand p{margin:6px 0 0}.minus{color:var(--mu)}
.ch{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
.ch a{color:var(--ac);font-weight:600;text-decoration:none;word-break:break-all}
.status{margin-left:auto;font-size:12px;border-radius:8px;padding:1px 8px;background:var(--ac-bg);color:var(--ac)}
.s-2 .status{background:var(--pub-bg);color:var(--pub)}
.s-3{opacity:.62}.s-3 .status{background:var(--line);color:var(--mu)}
.cb{display:flex;gap:8px;margin-top:10px}
.cb button{border:1px solid var(--line);background:var(--card);border-radius:10px;padding:0 14px;min-height:44px}
.toast{position:fixed;left:50%;bottom:max(20px,env(safe-area-inset-bottom));transform:translateX(-50%) translateY(140%);
background:var(--tx);color:var(--bg);border-radius:12px;padding:10px 16px;font-size:14px;transition:transform .25s,opacity .25s;max-width:calc(100% - 32px);
opacity:0;visibility:hidden;pointer-events:none}
.toast:empty{display:none}
.toast.on{transform:translateX(-50%) translateY(0);opacity:1;visibility:visible}
.fallback{display:none;margin-top:16px}.fallback.on{display:block}
.fallback textarea{width:100%;min-height:120px;font:13px ui-monospace,Menlo,monospace;border-radius:10px;border:1px solid var(--line);
background:var(--card);color:var(--tx);padding:10px}
</style></head><body><main>
@@BODY@@
<section class="fallback" id="fb"><h2>Скопіюй запит</h2>
<p class="muted">Браузер не дав покласти текст у буфер — виділи його тут і скопіюй (⌘C).</p>
<textarea id="fbt" readonly></textarea></section>
</main>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script>
(function(){
  var toast=document.getElementById('toast'),tm;
  function say(t){toast.textContent=t;toast.classList.add('on');clearTimeout(tm);tm=setTimeout(function(){toast.classList.remove('on')},2200)}
  function fallback(text){
    var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}
    ta.remove();
    if(ok){say('Скопійовано — встав у чат із Claude');return}
    var fb=document.getElementById('fb');document.getElementById('fbt').value=text;fb.classList.add('on');
    fb.scrollIntoView({behavior:'smooth'});
  }
  function copy(text){
    if(navigator.clipboard&&window.isSecureContext){
      navigator.clipboard.writeText(text).then(function(){say('Скопійовано — встав у чат із Claude')},function(){fallback(text)});
    } else fallback(text);
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-copy]');
    if(b){e.preventDefault();e.stopPropagation();copy(b.getAttribute('data-copy'));return}
    var g=e.target.closest('[data-go]');
    if(g){
      e.preventDefault();e.stopPropagation();
      var id=g.getAttribute('data-go'),el=id&&document.getElementById(id);
      if(!el){say('Цього ще нема в дереві — перевір pult/marshrut.json');return}
      for(var p=el;p;p=p.parentElement){if(p.tagName==='DETAILS')p.open=true}
      var top=el.tagName==='SECTION'||el.classList.contains('dir');
      el.scrollIntoView({behavior:'smooth',block:top?'start':'center'});
      el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');
    }
  });
})();
</script></body></html>
'''


if __name__ == '__main__':
    page = render()
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(page)
    print('Пульт зібрано:', os.path.relpath(OUT, ROOT))
