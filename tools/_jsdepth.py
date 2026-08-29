# -*- coding: utf-8 -*-
"""Грубий, але свідомий сканер JS: рахує глибину {} з урахуванням
рядків, шаблонів, коментарів і регулярних виразів. Потрібен лише для
того, щоб знайти рядки, де глибина == 0 (тобто верхній рівень скрипта)."""
import re

RE_PREV = re.compile(r'[)\]}\w$]\s*$')   # перед / стоїть значення → це ділення, не regex

def depth_map(text):
    """Повертає список: для кожного рядка — глибина фігурних дужок ПЕРЕД цим рядком."""
    depths = []
    d = 0
    i = 0
    n = len(text)
    state = None          # None | 'sq' | 'dq' | 'tpl' | 'lc' | 'bc' | 're'
    tpl_stack = []
    line_start = True
    depths.append(0)
    prev_sig = ''         # останній значущий символ (для розрізнення regex / ділення)
    while i < n:
        c = text[i]
        if c == '\n':
            if state in ('lc',): state = None
            depths.append(d)
            i += 1
            continue
        if state is None:
            if c == '/' and i+1 < n and text[i+1] == '/': state='lc'; i+=2; continue
            if c == '/' and i+1 < n and text[i+1] == '*': state='bc'; i+=2; continue
            if c == '/' and not RE_PREV.search(prev_sig): state='re'; i+=1; continue
            if c == "'": state='sq'; i+=1; prev_sig=c; continue
            if c == '"': state='dq'; i+=1; prev_sig=c; continue
            if c == '`': state='tpl'; i+=1; prev_sig=c; continue
            if c == '{': d += 1
            elif c == '}':
                d -= 1
            if not c.isspace(): prev_sig = (prev_sig + c)[-4:]
            i += 1; continue
        if state == 'lc':
            i += 1; continue
        if state == 'bc':
            if c == '*' and i+1 < n and text[i+1]=='/': state=None; i+=2; continue
            i += 1; continue
        if state in ('sq','dq','re'):
            if c == '\\': i += 2; continue
            if (state=='sq' and c=="'") or (state=='dq' and c=='"') or (state=='re' and c=='/'):
                state=None; prev_sig='x'
            i += 1; continue
        if state == 'tpl':
            if c == '\\': i += 2; continue
            if c == '`': state=None; prev_sig='x'; i+=1; continue
            if c == '$' and i+1<n and text[i+1]=='{':
                tpl_stack.append('tpl'); state=None; d+=1; i+=2; continue
            i += 1; continue
    return depths
