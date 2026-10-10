  /* ════════ Календар Планера (етап 1, 10.10.2026): Місяць + шторка дня ════════
     Один календар на весь застосунок. Дані — усередині Планера (ключ goals_data → goalsData.planner):
       planner.events   = [{id, t, date:'YYYY-MM-DD', rep:''|'month'|'year', folder?}] — події й дати;
       planner.dayNotes = {'YYYY-MM-DD': 'текст'} — нотатка дня.
     Поля зʼявляються лише тоді, коли людина сама створить першу подію чи нотатку; читання нічого не пише.
     Блоки — з Планера (plBlocksDisplay), платежі — з Плану Гаманця й регулярних (47-rules.js), лише читання.
     У папці той самий календар — віджет «Календар папки» (48-widgets.js, тип dcal): лише її блоки й події. */

  const CAL_REP={'':'Один раз', month:'Щомісяця', year:'Щороку'};
  // читання без запису: зіпсовані записи з хмари пропускаємо
  function calEvents(){
    let p=null; try{ p=plData(); }catch(_){ return []; }
    return Array.isArray(p.events)?p.events.filter(e=>e&&typeof e==='object'&&!Array.isArray(e)&&e.id&&/^\d{4}-\d{2}-\d{2}$/.test(e.date||'')):[];
  }
  // без звертання до const — calMarks можуть кликнути з малювання раніше, ніж виконається цей файл
  function calRep(e){ const r=e?String(e.rep||''):''; return r==='month'||r==='year'?r:''; }
  function calDim(ym){ return new Date(+ym.slice(0,4), +ym.slice(5,7), 0).getDate(); }
  // чи припадає подія на день: «щомісяця» 31-го — в останній день коротшого місяця; «щороку» 29.02 — 28.02 у невисокосний
  function calEvOn(e,ds){
    if(ds<e.date) return false;
    const r=calRep(e); if(!r) return e.date===ds;
    const d=+e.date.slice(8), dd=+ds.slice(8), dim=calDim(ds.slice(0,7)), want=Math.min(d,dim);
    if(r==='month') return dd===want;
    return e.date.slice(5,7)===ds.slice(5,7)&&dd===want;
  }
  function calEventsOn(ds,fk){ return calEvents().filter(e=>calEvOn(e,ds)&&(!fk||String(e.folder||'')===fk)); }
  function calNote(ds){
    let p=null; try{ p=plData(); }catch(_){ return ''; }
    const n=p.dayNotes&&typeof p.dayNotes==='object'&&!Array.isArray(p.dayNotes)?p.dayNotes[ds]:'';
    return typeof n==='string'?n:'';
  }
  // платежі дня з Гаманця: рядки Плану місяця з днем + регулярні з днем (лише показ)
  function calPayOn(ds){
    const ym=ds.slice(0,7), dd=+ds.slice(8), dim=calDim(ym), out=[];
    const hit=day=>{ const d=parseInt(day,10); return d>=1&&d<=31&&Math.min(d,dim)===dd; };
    try{ const p=typeof rlPlan==='function'?rlPlan(ym,false):null;
      if(p) ['in','out'].forEach(k=>p[k].forEach(r=>{ if(hit(r.day)) out.push({k, t:String(r.t||'Без назви'), amt:+r.amt||0, cur:typeof rlRowCur==='function'?rlRowCur(r):''}); })); }catch(_){}
    try{ if(typeof rlRecurring==='function') rlRecurring().forEach(r=>{ if(hit(r.day)) out.push({k:'out', t:String(r.name||'Регулярний'), amt:+r.amount||0, cur:'', rec:true}); }); }catch(_){}
    return out;
  }
  function calBlocks(ds,fk){ let bl=[]; try{ bl=plBlocksDisplay(ds); }catch(_){} return bl.filter(b=>b&&(!fk||b.folder===fk)).sort((a,c)=>(+a.h||0)-(+c.h||0)); }
  function calBlockColor(b){
    let c=''; try{ c=dyColor(b); }catch(_){}
    if(!c&&b.folder&&typeof moOwnFolder==='function'&&moOwnFolder(b.folder)) c=safeColor(folders[b.folder].c,'');
    return c||(typeof PL_COL!=='undefined'&&Object.prototype.hasOwnProperty.call(PL_COL,String(b.c||''))&&PL_COL[b.c])||'#5b8def';
  }
  function calFolderName(fk){ return fk&&typeof moOwnFolder==='function'&&moOwnFolder(fk)?String(folders[fk].name||'Папка'):''; }
  // мітки клітинки місяця: кольори блоків, чи є подія, чи є платіж
  function calMarks(ds,fk){
    const bl=calBlocks(ds,fk);
    return { cols:[...new Set(bl.map(calBlockColor))].slice(0,3), n:bl.length, ev:calEventsOn(ds,fk).length>0, pay:fk?false:calPayOn(ds).length>0 };
  }

  // ── шторка дня: Події · Платежі · Блоки · Нотатка; opt.folder — лише ця папка, opt.onOpenDay(ds) — «Відкрити день» ──
  function calDaySheet(ds,opt){
    opt=opt||{}; const fk=opt.folder&&moOwnFolder(opt.folder)?opt.folder:'';
    if(!/^\d{4}-\d{2}-\d{2}$/.test(ds||'')) return;
    const draw=()=>{
      const ev=calEventsOn(ds,fk), pay=fk?[]:calPayOn(ds), bl=calBlocks(ds,fk), note=calNote(ds);
      const evRow=e=>`<button class="cal-row" data-calev="${esc(e.id)}"><span class="cal-ic ev">★</span><span class="cal-tx"><b>${esc(String(e.t||'Подія').slice(0,80))}</b><small>${esc(CAL_REP[calRep(e)])}${calFolderName(e.folder)&&!fk?' · 📁 '+esc(calFolderName(e.folder).slice(0,24)):''}</small></span><span class="cal-go">›</span></button>`;
      const payRow=x=>`<div class="cal-row ro"><span class="cal-ic pay">${x.k==='in'?'＋':'💳'}</span><span class="cal-tx"><b>${esc(x.t.slice(0,60))}</b><small>${x.rec?'регулярний · ':''}з Гаманця</small></span><b class="cal-amt ${x.k}">${x.k==='in'?'+':'−'}${esc(money(x.amt,x.cur||undefined))}</b></div>`;
      const blRow=b=>`<button class="cal-row" data-calbl style="--bc:${calBlockColor(b)}"><span class="cal-tm">${plHM(+b.h||0)}–${plHM(Math.min(plBlockEnd(b),24))}</span><span class="cal-tx"><b class="${b.done?'done':''}">${esc(String(b.t||'Блок').slice(0,60))}</b>${(calFolderName(b.folder)&&!fk)||subBadge(b)?`<small>${calFolderName(b.folder)&&!fk?'📁 '+esc(calFolderName(b.folder).slice(0,24)):''}${calFolderName(b.folder)&&!fk&&subBadge(b)?' · ':''}${subBadge(b)}</small>`:''}</span>${b.done?'<span class="cal-ok">✓</span>':''}</button>`;
      return `<div class="jn-ed-h"><b>${esc(dyDayTitle(ds))}${fk?' · '+esc(calFolderName(fk).slice(0,20)):''}</b><button data-jnx aria-label="Закрити">✕</button></div>
        <div class="cal-sec"><div class="cal-sh"><span>Події</span></div>
          ${ev.length||pay.length?ev.map(evRow).join('')+pay.map(payRow).join(''):'<small class="cal-none">Подій нема — день народження, дедлайн, платіж</small>'}</div>
        <div class="cal-sec"><div class="cal-sh"><span>Блоки${fk?' папки':''}</span>${bl.length?`<small>${bl.filter(b=>b.done).length}/${bl.length}</small>`:''}</div>
          ${bl.length?bl.map(blRow).join(''):'<small class="cal-none">Блоків нема</small>'}</div>
        ${fk?'':`<div class="cal-sec"><div class="cal-sh"><span>Нотатка дня</span></div>
          <textarea class="cal-note" id="calNote" maxlength="2000" rows="3" placeholder="Що важливо цього дня…">${esc(note)}</textarea></div>`}
        <div class="cal-acts"><button data-caladd="ev">★ Подія</button><button data-caladd="bl">＋ Блок</button>${opt.onOpenDay?'<button data-calopen>День ›</button>':''}</div>`;
    };
    const after=()=>{ try{ const s=document.getElementById('scr-journal'); if(s&&s.classList.contains('active')) jnRender(); }catch(_){} try{ wgRefresh(); }catch(_){} };
    const bind=ov=>{
      ov.classList.add('cal-ov');
      const nt=ov.querySelector('#calNote');
      // нотатка пишеться, коли людина вийшла з поля (і лише якщо змінилась)
      if(nt) nt.addEventListener('change',()=>calSaveOpenNote(ov,ds));
      ov.querySelectorAll('[data-calev]').forEach(b=>b.onclick=()=>{ calSaveOpenNote(ov,ds); ov.remove(); calEventSheet(ds,b.dataset.calev,()=>calDaySheet(ds,opt)); });
      ov.querySelectorAll('[data-calbl]').forEach(b=>b.onclick=()=>{ calSaveOpenNote(ov,ds); ov.remove(); if(opt.onOpenDay) opt.onOpenDay(ds); });
      const ae=ov.querySelector('[data-caladd="ev"]'); if(ae) ae.onclick=()=>{ calSaveOpenNote(ov,ds); ov.remove(); calEventSheet(ds,'',()=>calDaySheet(ds,opt),fk); };
      const ab=ov.querySelector('[data-caladd="bl"]'); if(ab) ab.onclick=()=>{ calSaveOpenNote(ov,ds); ov.remove();
        const p=plData(); p.selDate=ds; plBlockSheet(null,null,fk?{folder:fk}:undefined); };
      const op=ov.querySelector('[data-calopen]'); if(op) op.onclick=()=>{ calSaveOpenNote(ov,ds); ov.remove(); opt.onOpenDay(ds); };
      const x=ov.querySelector('[data-jnx]'); if(x) x.onclick=()=>{ calSaveOpenNote(ov,ds); ov.remove(); after(); };
      ov.onclick=e=>{ if(e.target===ov){ calSaveOpenNote(ov,ds); ov.remove(); after(); } };
    };
    jnOverlay(draw(),bind);
  }
  // порівнюємо з тим, що стояло в полі при відкритті (defaultValue), а не з памʼяттю: якщо синк тим часом
  // підтягнув новішу нотатку з іншого пристрою, незмінене поле її не перезапише
  function calSaveOpenNote(ov,ds){ const nt=ov&&ov.querySelector('#calNote'); if(!nt) return; if(calNoteSave(ds,nt.value,nt.defaultValue)) nt.defaultValue=nt.value; }
  function calNoteSave(ds,v,init){
    const t=String(v||'').slice(0,2000);
    if(t.trim()===String(init||'').trim()) return false;   // людина нічого не змінила — нічого не пишемо
    const p=plData();
    if(!p.dayNotes||typeof p.dayNotes!=='object'||Array.isArray(p.dayNotes)) p.dayNotes={};
    if(t.trim()) p.dayNotes[ds]=t; else delete p.dayNotes[ds];
    saveGoals(); return true;
  }

  // ── подія: створити / змінити / видалити (зі «Скасувати») ──
  function calEventSheet(ds,id,back,fk0){
    const e=id?calEvents().find(x=>String(x.id)===String(id)):null;
    let rep=e?calRep(e):'', fk=e?(moOwnFolder(e.folder)?e.folder:''):(fk0||'');
    const fks=Object.keys(folders||{}).filter(k=>moOwnFolder(k)&&(typeof folderVisible!=='function'||folderVisible(k))).slice(0,30);
    jnOverlay(`<div class="jn-ed-h"><b>${e?'Подія':'Нова подія'}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <label class="jn-f"><span>Назва</span><input id="calT" maxlength="80" value="${e?esc(String(e.t||'')):''}" placeholder="День народження Олі, дедлайн, оплата…"></label>
      <label class="jn-f"><span>Дата</span><input id="calD" type="date" value="${esc(e?e.date:ds)}"></label>
      <div class="jn-f"><span>Повтор</span><div class="wl-chips">${Object.keys(CAL_REP).map(k=>`<button data-calrep="${k}" class="${k===rep?'on':''}">${CAL_REP[k]}</button>`).join('')}</div></div>
      <div class="jn-f"><span>Папка (необовʼязково)</span><div class="wl-chips"><button data-calfk="" class="${fk?'':'on'}">Без папки</button>${fks.map(k=>`<button data-calfk="${esc(k)}" class="${k===fk?'on':''}">${esc(String(folders[k].name||'Папка').slice(0,22))}</button>`).join('')}</div></div>
      <div class="jn-ed-foot"><button class="jn-btn" data-calok>Зберегти</button></div>
      ${e?'<button class="wd-del" data-caldel>Видалити подію</button>':''}`, ov=>{
      const pick=(sel,fn)=>ov.querySelectorAll(sel).forEach(x=>x.onclick=()=>{ fn(x); ov.querySelectorAll(sel).forEach(y=>y.classList.toggle('on',y===x)); });
      pick('[data-calrep]',x=>{ rep=x.dataset.calrep; });
      pick('[data-calfk]',x=>{ fk=x.dataset.calfk; });
      const x=ov.querySelector('[data-jnx]'); if(x) x.onclick=()=>{ ov.remove(); if(back) back(); };
      ov.querySelector('[data-calok]').onclick=()=>{
        const t=String(ov.querySelector('#calT').value||'').trim().slice(0,80), d=String(ov.querySelector('#calD').value||'');
        if(!t){ ov.querySelector('#calT').focus(); return; }
        if(!/^\d{4}-\d{2}-\d{2}$/.test(d)) return;
        const p=plData(); if(!Array.isArray(p.events)) p.events=[];
        const row=e?p.events.find(q=>q&&String(q.id)===String(e.id)):null;
        const val={t, date:d}; if(rep) val.rep=rep; if(fk&&moOwnFolder(fk)) val.folder=fk;
        if(row){ delete row.rep; delete row.folder; Object.assign(row,val); }
        else p.events.push(Object.assign({id:'ev'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)},val));
        saveGoals(); ov.remove(); try{ wgRefresh(); }catch(_){}
        if(back) back(); else { try{ jnRender(); }catch(_){} }
      };
      const dl=ov.querySelector('[data-caldel]');
      if(dl) dl.onclick=()=>{
        const p=plData(); if(!Array.isArray(p.events)) return;
        const i=p.events.findIndex(q=>q&&String(q.id)===String(e.id)); if(i<0) return;
        const was=p.events.splice(i,1)[0]; saveGoals(); ov.remove();
        flowUndoToast('Подію видалено',()=>{ const pp=plData(); if(!Array.isArray(pp.events)) pp.events=[];
          if(!pp.events.some(q=>q&&String(q.id)===String(was.id))){ pp.events.splice(Math.min(i,pp.events.length),0,was); saveGoals(); try{ jnRender(); }catch(_){} try{ wgRefresh(); }catch(_){} } });
        if(back) back();
      };
    });
  }

  // ── сітка місяця для віджета папки (48-widgets.js → dcal) ──
  function calMonthGridHTML(ym,fk){
    const td=ymdLocal(), first=new Date(ym+'-01T12:00:00'), lead=(first.getDay()+6)%7, dim=calDim(ym);
    let h=DY_DOW.map(d=>`<b>${d}</b>`).join('')+'<span class="e"></span>'.repeat(lead);
    for(let d=1;d<=dim;d++){ const ds=ym+'-'+String(d).padStart(2,'0'), m=calMarks(ds,fk);
      h+=`<button class="cal-d${ds===td?' td':''}${ds>td?' fut':''}" data-wga="wdcalday" data-ds="${ds}" aria-label="${d} ${JN_MON[+ym.slice(5,7)-1]}${m.n?', блоків: '+m.n:''}${m.ev?', є подія':''}">${d}${m.ev?'<em>★</em>':''}<i>${m.cols.map(c=>`<u style="background:${c}"></u>`).join('')}</i></button>`; }
    return `<span class="cal-grid">${h}</span>`;
  }

  /* ════════ Підпункти блоку (етап 2, 10.10.2026) ════════
     Блок Планера несе свій чекліст: b.sub=[{id, t, done}] — усередині blocksByDay[ds], той самий ключ goals_data.
     Повторюваний блок отримує підпункти на конкретний день (материалізований блок цього дня) — відмітки не переходять.
     Коли людина відмітила останній підпункт, блок стає виконаним (той самий dyComplete, що й ✓), з «Скасувати».
     Пишеться лише з дій людини. Видно: Журнал → День (2/3, меню справи), шторка дня календаря, віджет «Час папки». */
  function subList(b){ return b&&Array.isArray(b.sub)?b.sub.filter(x=>x&&typeof x==='object'&&!Array.isArray(x)&&typeof x.t==='string'):[]; }
  function subCount(b){ const L=subList(b); return {n:L.length, d:L.filter(x=>x.done).length}; }
  function subBadge(b){ const c=subCount(b); return c.n?`☑ ${c.d}/${c.n}`:''; }
  // блок дня за id (віртуальні v_/disp_ повторюваних — за шаблоном; plBlocksFor створює блок дня в памʼяті)
  function subFind(ds,id){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(ds||'')) return null;
    const L=plBlocksFor(ds); let b=L.find(x=>x&&String(x.id)===String(id));
    if(!b){ const m=String(id||'').match(/^(?:v_|disp_)(.+)$/); if(m) b=L.find(x=>x&&x.fromRecur===m[1]); }
    return b||null;
  }
  function subAfter(){ try{ if(typeof window.__subRedraw==='function') window.__subRedraw(); }catch(_){} try{ plRerender(); }catch(_){} try{ const s=document.getElementById('scr-journal'); if(s&&s.classList.contains('active')) jnRender(); }catch(_){} try{ wgRefresh(); }catch(_){} }
  // відмітити підпункт; останній → блок виконано (з «Скасувати»). Повертає новий стан або null
  function subToggle(ds,id,sid){
    const b=subFind(ds,id); if(!b) return null;
    const s=subList(b).find(x=>String(x.id)===String(sid)); if(!s) return null;
    s.done=!s.done; saveGoals();
    const c=subCount(b);
    if(s.done&&c.n&&c.d===c.n&&!b.done){
      // блок із грошима (дохід у конверт) чи з матриці сам не закриваємо: зняття позначки не відкочує гроші,
      // тож «Повернути» було б неправдою — людина ставить ✓ сама
      if((b.link&&b.link.type==='fin')||b.fromMx){ try{ plToast('Усі підпункти ✓ — познач блок «Зроблено», коли готовий'); }catch(_){} }
      else{
        const bid=b.id, sid2=s.id; dyComplete(bid,ds);
        try{ flowUndoToast('Усі підпункти ✓ — блок виконано',()=>{ const q=subFind(ds,bid); if(q&&q.done) dyComplete(bid,ds);
          // повертаємо і останню відмітку — бейдж знову «2/3», а не «3/3» на невиконаному блоці
          const qs=q?subList(q).find(z=>String(z.id)===String(sid2)):null; if(qs&&qs.done){ qs.done=false; saveGoals(); }
          subAfter(); }); }catch(_){}
      }
    }
    subAfter(); return s.done;
  }
  function subSheet(ds,id){
    const draw=()=>{
      const b=subFind(ds,id); if(!b) return '';
      const L=subList(b), c=subCount(b);
      return `<div class="jn-ed-h"><b>${esc(String(b.t||'Справа').slice(0,50))}</b><button data-jnx aria-label="Закрити">✕</button></div>
        <small class="dy-fm-sub">${esc(dyDayTitle(ds))} · ${plHM(+b.h||0)}–${plHM(Math.min(plBlockEnd(b),24))}${c.n?' · '+c.d+' з '+c.n:''}${b.done?' · виконано ✓':''}</small>
        <div class="sub-list">${L.map(x=>`<div class="sub-row${x.done?' on':''}"><button class="sub-ck" data-subck="${esc(x.id)}" role="checkbox" aria-checked="${!!x.done}" aria-label="${esc(x.t)}">${x.done?'✓':''}</button><span>${esc(x.t)}</span><button class="sub-rm" data-subrm="${esc(x.id)}" aria-label="Прибрати «${esc(x.t)}»">✕</button></div>`).join('')||'<small class="cal-none">Розбий справу на кроки — їх видно і в Планері, і в папці</small>'}</div>
        <form class="sub-add" data-subadd><input id="subT" maxlength="80" placeholder="Новий підпункт, напр. «Граматика 20 хв»" autocomplete="off"><button type="submit">＋</button></form>`;
    };
    const bind=ov=>{
      ov.classList.add('cal-ov');
      const redraw=()=>{ if(!ov.isConnected){ window.__subRedraw=null; return; } const h=draw(); if(!h){ ov.remove(); return; } ov.querySelector('.jn-ed').innerHTML=h; bind2(); };
      window.__subRedraw=redraw;   // «Повернути» з тосту перемальовує відкриту шторку
      const bind2=()=>{
        const x=ov.querySelector('[data-jnx]'); if(x) x.onclick=()=>{ ov.remove(); subAfter(); };
        ov.querySelectorAll('[data-subck]').forEach(el=>el.onclick=()=>{ subToggle(ds,id,el.dataset.subck); redraw(); });
        ov.querySelectorAll('[data-subrm]').forEach(el=>el.onclick=()=>{
          const b=subFind(ds,id); if(!b||!Array.isArray(b.sub)) return;
          const i=b.sub.findIndex(q=>q&&String(q.id)===String(el.dataset.subrm)); if(i<0) return;
          const was=b.sub.splice(i,1)[0]; if(!b.sub.length) delete b.sub; saveGoals(); redraw();
          try{ flowUndoToast('Підпункт прибрано',()=>{ const q=subFind(ds,id); if(!q) return; if(!Array.isArray(q.sub)) q.sub=[];
            if(!q.sub.some(z=>z&&String(z.id)===String(was.id))){ q.sub.splice(Math.min(i,q.sub.length),0,was); saveGoals(); subAfter(); } }); }catch(_){}
        });
        const f=ov.querySelector('[data-subadd]'), inp=ov.querySelector('#subT');
        if(f) f.onsubmit=e=>{ e.preventDefault(); const t=String(inp.value||'').trim().slice(0,80); if(!t) return;
          const b=subFind(ds,id); if(!b) return; if(!Array.isArray(b.sub)) b.sub=[];
          if(b.sub.length>=30){ plToast('Максимум 30 підпунктів'); return; }
          b.sub.push({id:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,5), t, done:false}); saveGoals(); redraw();
          const n=ov.querySelector('#subT'); if(n) n.focus(); };
      };
      ov.onclick=e=>{ if(e.target===ov){ ov.remove(); subAfter(); } };
      bind2();
    };
    const h=draw(); if(!h) return; jnOverlay(h,bind);
  }

  /* ════════ Етап 3: «Весь день» і нотатка в Журнал → День (10.10.2026) ════════
     Над сіткою годин — події дня (★) і платежі Гаманця (💳) чипами, «＋ подія»; під сіткою — нотатка дня.
     Лише показ тих самих даних (planner.events / dayNotes / План Гаманця); запис — через ті самі шторки. */
  function calAllDayHTML(ds){
    const ev=calEventsOn(ds,''), pay=calPayOn(ds);
    return `<div class="cal-allday" aria-label="Весь день"><span class="cal-ad-l">Весь день</span><span class="cal-ad-c">
      ${ev.map(e=>`<button class="cal-chip ev" data-caladev="${esc(e.id)}">★ ${esc(String(e.t||'Подія').slice(0,40))}</button>`).join('')}
      ${pay.map(x=>`<span class="cal-chip pay ${x.k}">${x.k==='in'?'＋':'💳'} ${esc(x.t.slice(0,30))} ${esc(money(x.amt,x.cur||undefined))}</span>`).join('')}
      <button class="cal-chip add" data-caladnew aria-label="Нова подія цього дня">＋ подія</button></span></div>`;
  }
  function calNoteCardHTML(ds){
    const n=calNote(ds);
    return `<button class="cal-notecard${n?'':' empty'}" data-calnote><span class="cal-nc-h">📝 Нотатка дня</span>${n?`<span class="cal-nc-t">${esc(n.slice(0,400))}</span>`:'<span class="cal-nc-t">＋ Що важливо цього дня</span>'}</button>`;
  }
  // rerender — як перемалювати екран після змін у шторках
  function calBindDay(c,ds,rerender){
    const back=()=>{ try{ rerender(); }catch(_){} };
    c.querySelectorAll('[data-caladev]').forEach(b=>b.onclick=()=>calEventSheet(ds,b.dataset.caladev,back));
    c.querySelectorAll('[data-caladnew]').forEach(b=>b.onclick=()=>calEventSheet(ds,'',back));
    c.querySelectorAll('[data-calnote]').forEach(b=>b.onclick=()=>calDaySheet(ds,{}));
  }

  /* ════════ Етап 4: Цілі тижня (10.10.2026) ════════
     planner.weekGoals = {'YYYY-MM-DD' (понеділок): [{id, t, n (скільки разів), folder?, man (ручні +1)}]} — той самий goals_data.
     Прогрес = виконані блоки папки цього тижня (автоматично, якщо ціль привʼязана до папки) + ручні «+1».
     «→ на день» створює блок цієї папки у вільному часі вибраного дня. Пишеться лише з дій людини. */
  function wgoAll(){ let p=null; try{ p=plData(); }catch(_){ return {}; } return p.weekGoals&&typeof p.weekGoals==='object'&&!Array.isArray(p.weekGoals)?p.weekGoals:{}; }
  function wgoList(mon){ const L=wgoAll()[mon]; return Array.isArray(L)?L.filter(g=>g&&typeof g==='object'&&!Array.isArray(g)&&g.id&&typeof g.t==='string'):[]; }
  function wgoN(g){ const n=parseInt(g.n,10); return n>=1&&n<=50?n:1; }
  function wgoMan(g){ const m=parseInt(g.man,10); return m>0&&m<=999?m:0; }
  function wgoAuto(g,mon){
    if(!g.folder||!moOwnFolder(g.folder)) return 0;
    let n=0; for(let i=0;i<7;i++){ let bl=[]; try{ bl=plBlocksDisplay(dyAddDays(mon,i)); }catch(_){} n+=bl.filter(b=>b&&b.done&&b.folder===g.folder).length; }
    return n;
  }
  function wgoHTML(mon){
    const L=wgoList(mon);
    const row=g=>{ const n=wgoN(g), a=wgoAuto(g,mon), m=wgoMan(g), d=a+m, pct=Math.min(100,Math.round(d/n*100)), f=g.folder&&moOwnFolder(g.folder)?folders[g.folder]:null;
      return `<div class="wgo-r${d>=n?' ok':''}" style="--c:${safeColor(f&&f.c,'#ff9a4d')}">
        <button class="wgo-m" data-wgo="${esc(g.id)}"><span class="wgo-t"><b>${esc(g.t.slice(0,60))}</b><small>${f?'📁 '+esc(String(f.name||'Папка').slice(0,20))+(a?' · '+a+' з блоків':''):'вручну'}${m?' · +'+m:''}</small></span>
          <span class="wgo-v">${d}/${n}${d>=n?' ✓':''}</span><span class="wgo-bar"><i style="width:${pct}%"></i></span></button>
        <button class="wgo-p" data-wgoplus="${esc(g.id)}" aria-label="Плюс один до «${esc(g.t.slice(0,40))}»">+1</button></div>`; };
    return `<div class="dw-sec"><span>Цілі тижня</span><button class="wgo-add" data-wgoadd>＋ Ціль</button></div>
      <div class="wgo">${L.length?L.map(row).join(''):'<small class="cal-none">Що хочеш встигнути за тиждень? Напр. «3 заняття англійською» — рахується з блоків папки само.</small>'}</div>`;
  }
  function wgoSave(mon,fn){ const p=plData(); if(!p.weekGoals||typeof p.weekGoals!=='object'||Array.isArray(p.weekGoals)) p.weekGoals={}; if(!Array.isArray(p.weekGoals[mon])) p.weekGoals[mon]=[];
    p.weekGoals[mon]=p.weekGoals[mon].filter(g=>g&&typeof g==='object'&&!Array.isArray(g));   // сміття з хмари не валить кнопки
    fn(p.weekGoals[mon]); if(!p.weekGoals[mon].length) delete p.weekGoals[mon]; saveGoals(); }
  function wgoBind(c,mon,rerender){
    const re=()=>{ try{ rerender(); }catch(_){} };
    c.querySelectorAll('[data-wgoadd]').forEach(b=>b.onclick=()=>wgoSheet(mon,'',re));
    c.querySelectorAll('[data-wgoplus]').forEach(b=>b.onclick=()=>{ const id=b.dataset.wgoplus;
      wgoSave(mon,L=>{ const g=L.find(x=>x&&String(x.id)===String(id)); if(g) g.man=Math.min(999,wgoMan(g)+1); }); try{ window.platform.haptic('light'); }catch(_){} re(); });
    c.querySelectorAll('[data-wgo]').forEach(b=>b.onclick=()=>{ const id=b.dataset.wgo, g=wgoList(mon).find(x=>String(x.id)===String(id)); if(!g) return;
      const items=[];
      items.push({ic:'calendar', label:'→ На день', sub:g.folder&&moOwnFolder(g.folder)?'блок цієї папки у вільний час':'блок у вільний час', primary:true, onClick:()=>{
        dyDayPicker('На який день?','«'+g.t+'» — година у першому вільному проміжку.',mon,'',ds=>{
          const slot=dyFreeSlot(ds,1); if(slot===null){ plToast('У цей день нема вільної години'); return; }
          const nb={id:dyNewId(), h:slot, endH:slot+1, t:g.t.slice(0,60), c:'orange', done:false}; if(g.folder&&moOwnFolder(g.folder)) nb.folder=g.folder;
          plBlocksFor(ds).push(nb); saveGoals(); plToast('Додано на '+dyDayTitle(ds).toLowerCase()+' о '+plHM(slot)); re(); }); }});
      if(wgoMan(g)) items.push({ic:'down', label:'−1', sub:'забрати ручну позначку', onClick:()=>{ wgoSave(mon,L=>{ const q=L.find(x=>String(x.id)===String(id)); if(q) q.man=Math.max(0,wgoMan(q)-1); }); re(); }});
      items.push({ic:'edit', label:'Змінити', onClick:()=>wgoSheet(mon,id,re)});
      items.push({ic:'trash', label:'Видалити', danger:true, onClick:()=>{ let was=null,i=-1;
        wgoSave(mon,L=>{ i=L.findIndex(x=>String(x.id)===String(id)); if(i>=0) was=L.splice(i,1)[0]; }); re();
        if(was) try{ flowUndoToast('Ціль тижня видалено',()=>{ wgoSave(mon,L=>{ if(!L.some(x=>String(x.id)===String(was.id))) L.splice(Math.min(i,L.length),0,was); }); re(); }); }catch(_){} }});
      actionSheet({title:g.t, sub:(wgoAuto(g,mon)+wgoMan(g))+' з '+wgoN(g)+' цього тижня', items});
    });
  }
  function wgoSheet(mon,id,back){
    const g=id?wgoList(mon).find(x=>String(x.id)===String(id)):null;
    let fk=g&&g.folder&&moOwnFolder(g.folder)?g.folder:'', n=g?wgoN(g):3;
    const fks=Object.keys(folders||{}).filter(k=>moOwnFolder(k)&&(typeof folderVisible!=='function'||folderVisible(k))).slice(0,30);
    jnOverlay(`<div class="jn-ed-h"><b>${g?'Ціль тижня':'Нова ціль тижня'}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">${esc(dyWeekRange(mon))}</small>
      <label class="jn-f"><span>Що</span><input id="wgoT" maxlength="60" value="${g?esc(g.t):''}" placeholder="Заняття англійською, тренування…"></label>
      <div class="jn-f"><span>Скільки разів за тиждень</span><div class="wgo-n"><button data-wgon="-1" aria-label="Менше">−</button><b id="wgoN">${n}</b><button data-wgon="1" aria-label="Більше">＋</button></div></div>
      <div class="jn-f"><span>Папка — рахувати її виконані блоки (необовʼязково)</span><div class="wl-chips"><button data-wgofk="" class="${fk?'':'on'}">Лише вручну</button>${fks.map(k=>`<button data-wgofk="${esc(k)}" class="${k===fk?'on':''}">${esc(String(folders[k].name||'Папка').slice(0,22))}</button>`).join('')}</div></div>
      <div class="jn-ed-foot"><button class="jn-btn" data-wgook>Зберегти</button></div>`, ov=>{
      ov.querySelectorAll('[data-wgon]').forEach(b=>b.onclick=()=>{ n=Math.max(1,Math.min(50,n+(+b.dataset.wgon))); ov.querySelector('#wgoN').textContent=n; });
      ov.querySelectorAll('[data-wgofk]').forEach(b=>b.onclick=()=>{ fk=b.dataset.wgofk; ov.querySelectorAll('[data-wgofk]').forEach(y=>y.classList.toggle('on',y===b)); });
      ov.querySelector('[data-wgook]').onclick=()=>{
        const t=String(ov.querySelector('#wgoT').value||'').trim().slice(0,60); if(!t){ ov.querySelector('#wgoT').focus(); return; }
        wgoSave(mon,L=>{ const row=g?L.find(x=>String(x.id)===String(g.id)):null;
          if(row){ row.t=t; row.n=n; if(fk&&moOwnFolder(fk)) row.folder=fk; else delete row.folder; }
          else{ const v={id:'wg'+Date.now().toString(36)+Math.random().toString(36).slice(2,5), t, n}; if(fk&&moOwnFolder(fk)) v.folder=fk; L.push(v); } });
        ov.remove(); if(back) back();
      };
    });
  }
