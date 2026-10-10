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
      const blRow=b=>`<button class="cal-row" data-calbl style="--bc:${calBlockColor(b)}"><span class="cal-tm">${plHM(+b.h||0)}–${plHM(Math.min(plBlockEnd(b),24))}</span><span class="cal-tx"><b class="${b.done?'done':''}">${esc(String(b.t||'Блок').slice(0,60))}</b>${calFolderName(b.folder)&&!fk?`<small>📁 ${esc(calFolderName(b.folder).slice(0,24))}</small>`:''}</span>${b.done?'<span class="cal-ok">✓</span>':''}</button>`;
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
