  /* ════════ Планер · День «Стрічка» (42-day.js, етап 5 Журналу героя, 09.10.2026) ════════
     Вкладка «День» Планера: тиждень, справи за часом (колір = місія), проміжки «вільно ＋»,
     меню справи (зроблено / змінити / на завтра / видалити) і «＋ З місій».
     Записи — тими самими функціями Планера (plBlocksFor, plBlockSheet, plCompleteBlock) і в ті самі
     поля goals_data.planner; нових ключів нема. Старі частини дня (матриця, «Вхідні», перенесення,
     підсумок, фокус) з екрана прибрано, їхні дані лежать як були. */

  const DY_DOW=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
  const DY_MIN_GAP=0.5;   // проміжки коротші за 30 хв не показуємо

  function dyGoal(b){ const id=b&&b.link&&b.link.goalId; if(!id) return null;
    return (goalsData.goals||[]).find(g=>g&&String(g.id||g.name)===String(id))||null; }
  function dyColor(b){ const g=dyGoal(b); return g?safeColor(g.color,'#3ec7b4'):''; }
  function dyAddDays(ds,n){ const d=new Date(ds+'T12:00:00'); d.setDate(d.getDate()+n); return ymdLocal(d); }
  // звідки починати вільний час: сьогодні — від «зараз», інакше — від початку дня (0 → 07:00, щоб не показувати ніч)
  function dyCursorStart(ds){
    const p=plData(), H0=p.dayStart>0?p.dayStart:7;
    if(ds!==plTodayStr()) return H0;
    const n=new Date(), now=n.getHours()+Math.ceil(n.getMinutes()/5)*5/60;
    return Math.max(H0,now);
  }
  function dyDayEnd(){ const p=plData(); return (p.dayEnd>0&&p.dayEnd<=24)?p.dayEnd:24; }

  function dyWeekHTML(sel){
    const p=plData(), today=plTodayStr(), base=new Date(sel+'T12:00:00'), dow=(base.getDay()+6)%7;
    const mon=new Date(base); mon.setDate(base.getDate()-dow);
    let cells='';
    for(let i=0;i<7;i++){
      const d=new Date(mon); d.setDate(mon.getDate()+i); const ds=ymdLocal(d);
      const bl=(typeof plBlocksDisplay==='function')?plBlocksDisplay(ds):[];
      const cols=[...new Set(bl.map(b=>dyColor(b)||'var(--muted)'))].slice(0,3);
      cells+=`<button class="dy-d${ds===sel?' on':''}${ds===today?' today':''}" data-plday="${ds}" aria-label="${DY_DOW[i]} ${d.getDate()} ${JN_MON[d.getMonth()]}"${ds===sel?' aria-pressed="true"':''}><small>${DY_DOW[i]}</small><b>${d.getDate()}</b>
        <span class="dy-dots">${cols.map(c=>`<i style="background:${c}"></i>`).join('')}</span></button>`;
    }
    return `<div class="dy-wk">${cells}</div>`;
  }

  function dyRow(b){
    const g=dyGoal(b), c=dyColor(b), end=Math.min(plBlockEnd(b),24);
    return `<div class="dy-row${b.done?' done':''}${g?'':' plain'}" style="${c?'--c:'+c:''}">
      <span class="dy-t">${plHM(b.h)}</span>
      <button class="dy-b" data-dyblk="${esc(b.id)}"><span class="dy-ic">${g?safeEmoji(g.emoji,'🎯'):'⏱'}</span>
        <span class="dy-tx"><b>${esc(b.t||'Справа')}</b><small>${g?esc(g.name||'Місія')+' · ':''}${plDurLabel(b.h,end)}${b.fromRecur?' · ↻':''}</small></span></button>
      <button class="dy-ck" data-dydone="${esc(b.id)}" aria-label="${b.done?'Зняти позначку':'Зроблено'}">${b.done?'✓':''}</button>
    </div>`;
  }

  // стрічка одного дня: справи за часом, лінія «зараз», проміжки «вільно ＋» (лише HTML; привʼязка — dyBind)
  /* ── Сітка дня по годинах (10.10.2026, замість «стрічки»): блоки на своїх годинах, минулі теж,
     тап по порожній годині — нова справа (data-dyadd), по справі — її меню (data-dyblk), ✓ (data-dydone).
     Ті самі data-атрибути, що в стрічці, тож dyBind не змінився. Лише HTML. ── */
  const DY_HP=52, DW_HP=40;   // висота години, px: день · тиждень
  function dyRange(lists){
    const p=plData(); let H0=p.dayStart>0?p.dayStart:7, H1=dyDayEnd();
    lists.forEach(L=>L.forEach(b=>{ const h=+b.h; if(Number.isFinite(h)){ H0=Math.min(H0,Math.floor(h)); H1=Math.max(H1,Math.min(24,Math.ceil(plBlockEnd(b)))); } }));
    H0=Math.max(0,Math.min(H0,23)); H1=Math.max(H0+1,Math.min(24,H1)); return [H0,H1];
  }
  // справи, що накладаються, стають поруч: доріжка (lane) і скільки доріжок у групі
  function dyLanes(blocks){
    const L=blocks.filter(b=>Number.isFinite(+b.h)).slice().sort((a,b)=>(+a.h)-(+b.h)), out=new Map();
    let grp=[], grpEnd=-1;
    const flush=()=>{ const n=Math.max(1,...grp.map(g=>g.lane+1)); grp.forEach(g=>out.set(g.b,{lane:g.lane,n})); grp=[]; };
    L.forEach(b=>{ const st=+b.h, en=Math.max(st+0.25,Math.min(plBlockEnd(b),24));
      if(grp.length&&st>=grpEnd){ flush(); grpEnd=-1; }
      const used=new Set(grp.filter(g=>g.en>st).map(g=>g.lane)); let lane=0; while(used.has(lane)) lane++;
      grp.push({b,lane,en}); grpEnd=Math.max(grpEnd,en); });
    if(grp.length) flush();
    return out;
  }
  function dyRibbonHTML(ds){
    const today=plTodayStr(), isToday=ds===today;
    const blocks=plBlocksFor(ds).filter(b=>b&&Number.isFinite(+b.h)).slice().sort((a,b)=>(+a.h||0)-(+b.h||0));
    const [H0,H1]=dyRange([blocks]), lanes=dyLanes(blocks);
    const n=new Date(), nowDec=n.getHours()+n.getMinutes()/60;
    let hours='';
    for(let h=H0;h<H1;h++) hours+=`<button class="dg-h" data-dyadd="${h}" style="top:${(h-H0)*DY_HP}px" aria-label="Нова справа о ${plHM(h)}"><span>${plHM(h)}</span></button>`;
    const bl=blocks.map(b=>{ const g=dyGoal(b), c=dyColor(b), st=+b.h, end=Math.max(st+0.25,Math.min(plBlockEnd(b),24)), ln=lanes.get(b)||{lane:0,n:1};
      const top=(st-H0)*DY_HP, ht=Math.max(26,(end-st)*DY_HP-3), short=ht<44;
      return `<div class="dg-b${b.done?' done':''}${g?'':' plain'}${short?' short':''}" style="top:${top}px;height:${ht}px;--ln:${ln.lane};--lns:${ln.n};${c?'--c:'+c:''}">
        <button class="dg-bb" data-dyblk="${esc(b.id)}"><b>${g?safeEmoji(g.emoji,'🎯')+' ':''}${esc(b.t||'Справа')}</b>${short?'':`<small>${plHM(st)}–${plHM(end)}${g?' · '+esc(g.name||'Місія'):''}${b.fromRecur?' · ↻':''}${typeof subBadge==='function'&&subBadge(b)?' · '+subBadge(b):''}</small>`}</button>
        <button class="dg-ck" data-dydone="${esc(b.id)}" aria-label="${b.done?'Зняти позначку':'Зроблено'}">${b.done?'✓':''}</button></div>`; }).join('');
    const now=isToday&&nowDec>=H0&&nowDec<H1?`<div class="dg-now" style="top:${(nowDec-H0)*DY_HP}px"><span>${plHM(nowDec)}</span><i></i></div>`:'';
    const empty=!blocks.length?`<div class="dy-empty"><b>${isToday?'День ще порожній':'Цей день порожній'}</b><span>Тапни по годині, щоб додати справу, або візьми з місій.</span></div>`:'';
    // куди прокрутити вікно сітки: сьогодні — година до «зараз», інший день — до першої справи
    const scr=isToday?(nowDec-H0-1)*DY_HP:blocks.length?(+blocks[0].h-H0-0.5)*DY_HP:0;
    return `${empty}<div class="dg-wrap" data-dgnow="${Math.max(0,Math.round(scr))}"><div class="dg" style="height:${(H1-H0)*DY_HP}px">${hours}${bl}${now}</div></div>`;
  }
  // сітка в межах свого вікна: на сьогодні — одразу до поточної години (без цього довелося б гортати від 7:00)
  // екран ще може бути прихований (рендер іде до show()) — тоді прокрутка не спрацює; ставимо її на наступні кадри
  function dyGridScroll(c){ const go=()=>c.querySelectorAll('.dg-wrap[data-dgnow]').forEach(w=>{ if(w.dataset.dgdone) return; try{ w.scrollTop=+w.dataset.dgnow||0; if(w.clientHeight) w.dataset.dgdone='1'; }catch(_){} });
    go(); requestAnimationFrame(go); setTimeout(go,120); setTimeout(go,400); }
  function dyDayTitle(ds){
    const today=plTodayStr(), d=new Date(ds+'T12:00:00');
    return ds===today?'Сьогодні':ds===dyAddDays(today,1)?'Завтра':ds===dyAddDays(today,-1)?'Вчора':DY_DOW[(d.getDay()+6)%7]+', '+d.getDate()+' '+JN_MON[d.getMonth()];
  }
  function dyDayHTML(){
    const p=plData(), ds=p.selDate||plTodayStr(), today=plTodayStr(), isToday=ds===today;
    const blocks=plBlocksFor(ds);
    const done=blocks.filter(b=>b.done).length;
    return `${dyWeekHTML(ds)}
      <div class="dy-h"><div><b>${esc(dyDayTitle(ds))}</b><small>${blocks.length?done+' з '+blocks.length+' зроблено':'справ нема'}</small></div>
        <span class="dy-hb">${isToday?'':`<button class="dy-today" data-plday="${today}">Сьогодні</button>`}<button class="dy-from" data-dyfrom>＋ З місій</button></span></div>
      ${dyRibbonHTML(ds)}<div class="dy-pad"></div>`;
  }

  /* привʼязка стрічки дня ds (за замовчуванням — день Планера). opt.onDone(b) — свій «Зроблено» (Журнал показує свято) */
  function dyBind(c,ds,opt){
    const p=plData(); ds=ds||p.selDate||plTodayStr();
    // id може бути «віртуальним» повторюваним (v_… з Журналу, disp_… з тижня) — тоді шукаємо створений Планером блок за шаблоном
    const find=id=>{ const L=plBlocksFor(ds); let b=L.find(x=>String(x.id)===String(id));
      if(!b){ const m=String(id).match(/^(?:v_|disp_)(.+)$/); if(m) b=L.find(x=>x.fromRecur===m[1]); } return b; };
    c.querySelectorAll('[data-dydone]').forEach(el=>el.onclick=e=>{ e.stopPropagation(); const b=find(el.dataset.dydone); if(!b) return;
      if(opt&&opt.onDone&&!b.done) opt.onDone(b); else dyComplete(b.id,ds); });
    c.querySelectorAll('[data-dyblk]').forEach(el=>el.onclick=()=>{ const b=find(el.dataset.dyblk); if(b) dyMenu(b,ds); });
    // шторка нової справи бере день із selDate при відкритті — ставимо ds на мить
    c.querySelectorAll('[data-dyadd]').forEach(el=>el.onclick=()=>{ const q=plData(), old=q.selDate; q.selDate=ds; try{ plBlockSheet(null,+el.dataset.dyadd); } finally{ q.selDate=old; } });
    c.querySelectorAll('[data-dyfrom]').forEach(f=>f.onclick=()=>dyFromMissions(ds));
    dyGridScroll(c);
  }

  function dyNewId(){ return 'b_'+Date.now()+'_'+Math.random().toString(36).slice(2,6); }
  function dyDropReminder(b){ try{ if(reminderTimers['pl_'+b.id]){ clearTimeout(reminderTimers['pl_'+b.id]); delete reminderTimers['pl_'+b.id]; } }catch(_){} }
  // прибрати блок із дня (шукаємо за id — дані могли оновитись із хмари, поки відкрите меню);
  // повторюваний — ще й пропуск цього дня, щоб Планер не створив його знову. Повертає прибраний блок або null.
  function dyRemove(id,ds){
    const p=plData(), list=plBlocksFor(ds), i=list.findIndex(x=>String(x.id)===String(id)); if(i<0) return null;
    const b=list.splice(i,1)[0];
    if(b.done){ try{ plUncompleteEffects(b,ds); }catch(_){} }   // зроблена справа зникла — знімаємо її слід у цілі/трекері
    // задача тижня повертається в список, лише якщо її справу так і не зробили
    if(b.fromTask&&!b.done){ const t=p.tasks.find(x=>x.id===b.fromTask); if(t) t.slotted=false; }
    if(b.fromRecur){ if(!Array.isArray(p.recurSkip[ds])) p.recurSkip[ds]=[]; if(!p.recurSkip[ds].includes(b.fromRecur)) p.recurSkip[ds].push(b.fromRecur); }
    dyDropReminder(b);
    return b;
  }
  /* «Зроблено» для справи будь-якого дня: plCompleteBlock працює з днем у selDate — ставимо його на мить
     і повертаємо (та сама схема, що й у Журналі), потім зберігаємо ще раз з правильним selDate */
  function dyComplete(id,ds){
    const p=plData(), old=p.selDate;
    if(old===ds){ plCompleteBlock(id); return; }
    p.selDate=ds;
    try{ plCompleteBlock(id); }catch(err){ console.error('dyComplete',err); }
    finally{ p.selDate=old; }
    saveGoals(); plRerender();
  }
  // перенести справу на інший день (той самий час); повторювана — лише цей раз, нагадування — разом зі справою
  function dyMoveTo(id,ds,target){
    if(!target||target===ds) return;
    const old=dyRemove(id,ds); if(!old){ plRerender(); return; }
    const copy=Object.assign({},old,{id:dyNewId(),done:false,remindAt:null,remindFired:false});
    delete copy.fromRecur; delete copy.repeatLabel;
    // справа із задачі тижня лишається привʼязаною до неї (dyRemove тимчасово повернув задачу в список)
    if(copy.fromTask){ const t=plData().tasks.find(x=>x.id===copy.fromTask); if(t) t.slotted=true; else delete copy.fromTask; }
    if(copy.remindOffset!=null){ try{ copy.remindAt=new Date(new Date(target+'T00:00:00').getTime()+Math.round(copy.h*3600000)-copy.remindOffset*60000).toISOString(); plScheduleReminder(copy); }catch(_){} }
    plBlocksFor(target).push(copy);
    saveGoals(); plRerender();
    const td=new Date(target+'T12:00:00');
    plToast('→ «'+(old.t||'Справа')+'» '+(target===dyAddDays(ds,1)?'завтра':DY_DOW[(td.getDay()+6)%7]+', '+td.getDate()+' '+JN_MON[td.getMonth()])+' о '+plHM(old.h));
  }
  // шторка вибору дня: сім днів тижня, де лежить base, + наступний понеділок
  function dyDayPicker(title,sub,base,skip,onPick){
    const mon=dyMonday(base), today=plTodayStr(), days=[0,1,2,3,4,5,6].map(i=>dyAddDays(mon,i)), nx=dyAddDays(mon,7);
    jnOverlay(`<div class="jn-ed-h"><b>${esc(title)}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">${esc(sub)}</small>
      <div class="dy-pick">${days.map((d,i)=>`<button data-dypick="${d}" aria-label="${DY_DOW[i]} ${+d.slice(8)} ${JN_MON[+d.slice(5,7)-1]}"${d===skip?' disabled':''} class="${d===today?'today':''}"><small>${DY_DOW[i]}</small><b>${+d.slice(8)}</b></button>`).join('')}</div>
      <div class="dy-pick-nav"><button data-dypick="${nx}">Наступний понеділок, ${+nx.slice(8)} ${JN_MON[+nx.slice(5,7)-1]}</button></div>`, ov=>{
      ov.querySelectorAll('[data-dypick]').forEach(el=>el.onclick=()=>{ ov.remove(); onPick(el.dataset.dypick); });
    });
  }
  function dyPickDay(b,ds){
    dyDayPicker('На який день?','«'+(b.t||'Справа')+'» о '+plHM(b.h)+' — час лишиться той самий.',ds,ds,target=>dyMoveTo(b.id,ds,target));
  }
  function dyMenu(b,ds,opt){
    const g=dyGoal(b), items=[], week=!!(opt&&opt.week);
    items.push({ic:'target', label:b.done?'Зняти позначку «зроблено»':'Зроблено', primary:!b.done, onClick:()=>dyComplete(b.id,ds)});
    // підпункти блоку (49-calendar.js): чекліст цього дня
    { const sc=typeof subCount==='function'?subCount(b):{n:0,d:0}; items.push({ic:'plus', label:'Підпункти', sub:sc.n?sc.d+' з '+sc.n+' зроблено':'розбити справу на кроки', onClick:()=>subSheet(ds,b.id)}); }
    // шторка бере день один раз при відкритті — ставимо його на мить і повертаємо, щоб «День» не зсувався
    items.push({ic:'edit', label:'Змінити', sub:'назва, час, місія', onClick:()=>{ const p=plData(), old=p.selDate; p.selDate=ds; try{ plEditBlock(b.id); } finally{ p.selDate=old; } }});
    if(!b.done) items.push(week
      ? {ic:'calendar', label:'На інший день', sub:b.fromRecur?'лише цей раз — розклад лишається':'час лишиться той самий', onClick:()=>dyPickDay(b,ds)}
      : {ic:'calendar', label:'Перенести на завтра', sub:b.fromRecur?'лише цей раз — розклад лишається':'', onClick:()=>dyMoveTo(b.id,ds,dyAddDays(ds,1))});
    items.push({ic:'trash', label:'Видалити', danger:true, sub:b.fromRecur?'лише з цього дня':'', onClick:()=>{
      const sub=(b.fromRecur?'Зникне лише з цього дня, розклад лишиться.':'Справа зникне з цього дня.')+(b.done&&g?' Позначка «зроблено» в місії теж зніметься.':'');
      confirmSheet({title:'Видалити «'+(b.t||'справу')+'»?', sub, okLabel:'Видалити', onOk:()=>{
        dyRemove(b.id,ds); saveGoals(); plRerender(); }}); }});
    actionSheet({title:b.t||'Справа', sub:(g?(g.name||'Місія')+' · ':'')+plHM(b.h)+'–'+plHM(Math.min(plBlockEnd(b),24)), items});
  }

  // перший вільний проміжок довжиною dur від курсора дня
  function dyFreeSlot(ds,dur){
    const bl=plBlocksFor(ds).slice().sort((a,b)=>(+a.h||0)-(+b.h||0));
    let cur=dyCursorStart(ds); const H1=dyDayEnd();
    for(const b of bl){ if(b.h-cur>=dur-1e-6) break; cur=Math.max(cur,plBlockEnd(b)); }
    cur=Math.round(cur*12)/12;
    return cur+dur<=H1+1e-6?cur:null;
  }
  function dyFromMissions(ds){
    const ms=(goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)==='active'&&jnRole(g)!=='wait')
      .sort((a,b)=>(jnRole(a)==='main'?0:1)-(jnRole(b)==='main'?0:1));
    if(!ms.length){
      actionSheet({title:'Ще нема місій', sub:'Створи першу місію в Журналі — тоді її справи можна брати в день.',
        items:[{ic:'target', label:'До Журналу', primary:true, onClick:()=>{ try{ goJournal(); }catch(_){} }}]});
      return;
    }
    jnOverlay(`<div class="jn-ed-h"><b>Взяти з місій</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Тапни місію — справа стане в перший вільний час. Час потім можна змінити.</small>
      <div class="dy-fm">${ms.map(g=>{
        const nx=jnLevels(g).find(m=>!m.done), min=Math.max(15,Math.min(240,+(g.sched&&g.sched.min)||45));
        return `<button class="dy-fm-i" data-dyfm="${esc(g.id)}" data-min="${min}" style="--c:${safeColor(g.color,'#3ec7b4')}">
          <span class="dy-ic">${safeEmoji(g.emoji,'🎯')}</span>
          <span class="dy-tx"><b>${esc(g.name||'Місія')}</b><small>${nx?'далі: '+esc(nx.t)+' · ':''}${min} хв</small></span><i>＋</i></button>`; }).join('')}</div>`, ov=>{
      ov.querySelectorAll('[data-dyfm]').forEach(el=>el.onclick=()=>{
        const g=ms.find(x=>String(x.id)===el.dataset.dyfm); if(!g) return;
        const dur=(+el.dataset.min||45)/60, h=dyFreeSlot(ds,dur);
        if(h===null){ plToast('Нема вільних '+plDurLabel(0,dur)+' до кінця дня'); return; }
        const link={type:'habit', goalId:g.id, goalName:g.name||''};
        plBlocksFor(ds).push({id:dyNewId(), h, endH:h+dur, t:g.name||'Місія', c:'val', link, tag:plLinkTag(link), folder:(g.folderKey&&folders[g.folderKey])?g.folderKey:'', done:false});
        saveGoals(); ov.remove(); plRerender();
        try{ window.platform.haptic('light'); }catch(_){}
        plToast('📅 «'+(g.name||'Місія')+'» о '+plHM(h));
      });
    });
  }

  /* ════════ Планер · Тиждень (етап 6): бюджет годин місій + теплова карта днів + справи вибраного дня ════════
     Вибраний тиждень і день живуть лише в памʼяті екрана (dyWk), у сховище не пишуться.
     Години: довжина справ, привʼязаних до місії; минулі й майбутні повторювані рахуються без запису (plBlocksDisplay). */
  const dyWk={mon:'', sel:''};
  function dyMonday(ds){ const d=new Date(ds+'T12:00:00'); return dyAddDays(ds,-((d.getDay()+6)%7)); }
  function dyHrs(b){ const v=Math.min(plBlockEnd(b),24)-(+b.h||0); return Number.isFinite(v)?Math.max(0,v):0; }   // зіпсовані години з хмари → 0, а не NaN
  function dyNum(n){ return String(Math.round(n*10)/10).replace('.',','); }
  function dyWeekRange(mon){
    const sun=dyAddDays(mon,6), m1=+mon.slice(5,7)-1, m2=+sun.slice(5,7)-1;
    return m1===m2?(+mon.slice(8))+'–'+(+sun.slice(8))+' '+JN_MON[m2]:(+mon.slice(8))+' '+JN_MON[m1]+' – '+(+sun.slice(8))+' '+JN_MON[m2];
  }
  function dyWeekHTMLFull(){
    const today=plTodayStr(), thisMon=dyMonday(today);
    if(!dyWk.mon){ dyWk.mon=thisMon; dyWk.sel=today; }
    const mon=dyWk.mon, days=[0,1,2,3,4,5,6].map(i=>dyAddDays(mon,i));
    if(!days.includes(dyWk.sel)) dyWk.sel=days.includes(today)?today:mon;
    const sel=dyWk.sel;
    // години по місіях і по днях
    const per={}, dayH={};
    days.forEach(ds=>{
      const bl=plBlocksDisplay(ds);   // лише читання — повторювані не записуються в день, поки людина не натисне
      dayH[ds]=bl.reduce((a,b)=>a+dyHrs(b),0);
      bl.forEach(b=>{ const g=dyGoal(b); if(!g) return; const k=String(g.id);
        if(!per[k]) per[k]={done:0,plan:0}; per[k][b.done?'done':'plan']+=dyHrs(b); });
    });
    const ms=(goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)!=='archive'&&(jnStatus(g)==='active'&&jnRole(g)!=='wait'||per[String(g.id)]))
      .sort((a,b)=>(jnRole(a)==='main'?0:1)-(jnRole(b)==='main'?0:1));
    let totD=0, totP=0;
    const rows=ms.map(g=>{
      const h=per[String(g.id)]||{done:0,plan:0}, bud=g.budget&&+g.budget.hWeek>0?+g.budget.hWeek:0;
      totD+=h.done; totP+=h.plan;
      const scale=Math.max(bud,h.done+h.plan,0.01), lack=bud?bud-(h.done+h.plan):0;
      const right=bud?`${dyNum(h.done)} + ${dyNum(h.plan)} / ${dyNum(bud)} год`:`${dyNum(h.done)} + ${dyNum(h.plan)} год`;
      return `<div class="dw-m" style="--c:${safeColor(g.color,'#3ec7b4')}">
        <div class="dw-m-h"><span class="dw-m-n">${safeEmoji(g.emoji,'🎯')} ${esc(g.name||'Місія')}</span><span class="dw-m-v">${right}</span></div>
        <div class="dw-bar"><i class="d" style="width:${Math.min(100,h.done/scale*100)}%"></i><i class="p" style="width:${Math.min(100,h.plan/scale*100)}%"></i></div>
        ${bud?(lack>0.01?`<small class="dw-lack">бракує ${dyNum(lack)} год у плані</small>`:''):`<button class="dw-set" data-dwset="${esc(g.id)}">задати бюджет</button>`}
      </div>`; }).join('');
    const heroH=+jnHero().hWeek||0;
    return `<div class="dw-nav"><button data-dwshift="-7" aria-label="Попередній тиждень">‹</button>
        <div><b>${dyWeekRange(mon)}</b>${mon!==thisMon?`<button class="dw-now" data-dwthis>Цей тиждень</button>`:'<small>цей тиждень</small>'}</div>
        <button data-dwshift="7" aria-label="Наступний тиждень">›</button></div>
      <div class="dw-sec"><span>Бюджет місій</span><span>${heroH?`усього ${dyNum(totD+totP)} з ${dyNum(heroH)} год`:`усього ${dyNum(totD+totP)} год`}</span></div>
      ${rows||`<div class="dy-empty"><b>Ще нема місій</b><span>Бюджет годин зʼявиться, коли створиш місію в Журналі.</span></div>`}
      ${ms.length?`<div class="dw-leg"><span><i class="d"></i>зроблено</span><span><i class="p"></i>заплановано</span></div>`:''}
      ${dyWeekGridHTML(days,dayH)}
      ${dyWeekTasksHTML()}
      <div class="dy-pad"></div>`;
  }
  /* сітка тижня: 7 колонок × години, як Календар на iPhone. Показує й «віртуальні» повторювані (plBlocksDisplay —
     лише читання); у день справа записується, коли людина її торкнеться (dyWeekFind → plBlocksFor). */
  function dyWeekGridHTML(days,dayH){
    const today=plTodayStr(), lists=days.map(ds=>plBlocksDisplay(ds).filter(b=>b&&Number.isFinite(+b.h)));
    const [H0,H1]=dyRange(lists), n=new Date(), nowDec=n.getHours()+n.getMinutes()/60;
    const head=days.map((ds,i)=>`<button class="dwg-d${ds===today?' today':''}" data-dwgday="${ds}" aria-label="Відкрити ${DY_DOW[i]} ${+ds.slice(8)} ${JN_MON[+ds.slice(5,7)-1]}"><small>${DY_DOW[i]}</small><b>${+ds.slice(8)}</b><small>${dayH[ds]?dyNum(dayH[ds])+'г':''}</small></button>`).join('');
    let lines=''; for(let h=H0;h<H1;h++) lines+=`<span class="dwg-l" style="top:${(h-H0)*DW_HP}px">${h}</span>`;
    const cols=days.map((ds,i)=>{ const L=lists[i], lanes=dyLanes(L);
      const bl=L.map(b=>{ const g=dyGoal(b), c=dyColor(b), st=+b.h, end=Math.max(st+0.25,Math.min(plBlockEnd(b),24)), ln=lanes.get(b)||{lane:0,n:1};
        return `<button class="dwg-b${b.done?' done':''}${g?'':' plain'}" data-dwgblk="${ds}|${esc(b.id)}" style="top:${(st-H0)*DW_HP}px;height:${Math.max(18,(end-st)*DW_HP-2)}px;--ln:${ln.lane};--lns:${ln.n};${c?'--c:'+c:''}" aria-label="${esc(b.t||'Справа')}, ${plHM(st)}–${plHM(end)}">${g?safeEmoji(g.emoji,'🎯'):''}${esc(String(b.t||'Справа').slice(0,24))}</button>`; }).join('');
      const now=ds===today&&nowDec>=H0&&nowDec<H1?`<i class="dwg-now" style="top:${(nowDec-H0)*DW_HP}px"></i>`:'';
      return `<div class="dwg-c${ds===today?' today':''}" data-dwgcol="${ds}">${bl}${now}</div>`; }).join('');
    return `<div class="dw-sec"><span>Тиждень по годинах</span><span>тапни по клітинці — нова справа</span></div>
      <div class="dwg"><div class="dwg-hd"><span></span>${head}</div>
      <div class="dg-wrap dwg-wrap" data-dgnow="${days.includes(today)?Math.max(0,(nowDec-H0-1)*DW_HP):0}"><div class="dwg-body" style="height:${(H1-H0)*DW_HP}px" data-dwgh0="${H0}">${lines}<span></span>${cols}</div></div></div>`;
  }
  function dyWeekFind(ds,id){
    const v=plBlocksDisplay(ds).find(x=>String(x.id)===String(id)); if(!v) return null;
    const list=plBlocksFor(ds); return list.find(x=>String(x.id)===String(id))||(v.fromRecur?list.find(x=>x.fromRecur===v.fromRecur):null);
  }
  function dyWeekGridBind(c,opt){
    c.querySelectorAll('[data-dwgblk]').forEach(el=>el.onclick=e=>{ e.stopPropagation(); const k=el.dataset.dwgblk, ix=k.indexOf('|'), ds=k.slice(0,ix);
      const b=dyWeekFind(ds,k.slice(ix+1)); if(b) dyMenu(b,ds,{week:true}); });
    c.querySelectorAll('[data-dwgcol]').forEach(col=>col.onclick=e=>{
      const ds=col.dataset.dwgcol, H0=+(c.querySelector('[data-dwgh0]')||{dataset:{}}).dataset.dwgh0||0;
      const r=col.getBoundingClientRect(), h=Math.min(23,Math.max(0,Math.floor(H0+(e.clientY-r.top)/DW_HP)));
      const q=plData(), old=q.selDate; q.selDate=ds; try{ plBlockSheet(null,h); } finally{ q.selDate=old; } });
    c.querySelectorAll('[data-dwgday]').forEach(el=>el.onclick=()=>{ const ds=el.dataset.dwgday;
      if(opt&&opt.onOpenDay) return opt.onOpenDay(ds);
      const p=plData(); p.selDate=ds; p.scope='day'; saveGoals(); plRerender(); try{ window.scrollTo(0,0); }catch(_){} });
    dyGridScroll(c);
  }
  function dyWeekBind(c,opt){
    const sel=dyWk.sel;
    // показана справа може бути «віртуальною» повторюваною (disp_…) — у момент натискання Планер створює її в дні
    const find=id=>{ const all=plBlocksDisplay(sel), v=all.find(x=>String(x.id)===String(id)); if(!v) return null;
      const list=plBlocksFor(sel); return list.find(x=>String(x.id)===String(id))||(v.fromRecur?list.find(x=>x.fromRecur===v.fromRecur):null); };
    c.querySelectorAll('[data-dwshift]').forEach(el=>el.onclick=()=>{ dyWk.mon=dyAddDays(dyWk.mon,+el.dataset.dwshift); dyWk.sel=''; plRerender(); });
    { const t=c.querySelector('[data-dwthis]'); if(t) t.onclick=()=>{ dyWk.mon=''; plRerender(); }; }
    c.querySelectorAll('[data-dwday]').forEach(el=>el.onclick=()=>{ dyWk.sel=el.dataset.dwday; plRerender(); });
    c.querySelectorAll('[data-dwset]').forEach(el=>el.onclick=()=>{ const g=(goalsData.goals||[]).find(x=>String(x.id)===el.dataset.dwset); if(g) jnEditor(g); });
    c.querySelectorAll('[data-dydone]').forEach(el=>el.onclick=e=>{ e.stopPropagation(); const b=find(el.dataset.dydone); if(b) dyComplete(b.id,sel); });
    c.querySelectorAll('[data-dyblk]').forEach(el=>el.onclick=()=>{ const b=find(el.dataset.dyblk); if(b) dyMenu(b,sel,{week:true}); });
    dyWeekTasksBind(c);
    dyWeekGridBind(c,opt);
    { const o=c.querySelector('[data-dwopen]'); if(o&&opt&&opt.onOpenDay) o.onclick=()=>opt.onOpenDay(sel); else if(o) o.onclick=()=>{ const p=plData(); p.selDate=sel; p.scope='day'; saveGoals(); plRerender(); try{ window.scrollTo(0,0); }catch(_){} }; }
  }

  /* ── Задачі тижня (старі p.tasks scope 'week'): список без дня → «Поставити в день» стає справою дня.
     Блок можна сховати: p.collapsed.wkTasks (у goals_data, тож однаково на всіх пристроях). ── */
  function dyWeekTasks(){ return plData().tasks.filter(t=>t&&t.scope==='week'&&!t.done&&!t.slotted); }
  function dyWeekTasksHTML(){
    const p=plData(), ts=dyWeekTasks(), hidden=!!p.collapsed.wkTasks;
    if(hidden) return `<button class="dw-th-hid" data-dwtshow>Задачі тижня сховано${ts.length?' · '+ts.length:''} · <b>показати</b></button>`;
    return `<div class="dw-sec"><span>Задачі тижня${ts.length?' · '+ts.length:''}</span><span class="dw-th-b"><button data-dwtadd>＋ задача</button><button data-dwthide>Сховати</button></span></div>
      ${ts.length?`<div class="dw-tasks">${ts.map(t=>`<div class="dw-t"><button class="dw-t-ck" data-dwtdone="${esc(t.id)}" aria-label="Зроблено: ${esc(t.t||'задача')}"></button>
        <button class="dw-t-b" data-dwtask="${esc(t.id)}"><b>${esc(t.t||'Задача')}</b><small>без дня · тапни, щоб поставити в день</small></button></div>`).join('')}</div>`
        :`<div class="dy-empty"><span>Задач без дня нема. «＋ задача» — щоб записати те, що треба зробити цього тижня, але ще не знаєш коли.</span></div>`}`;
  }
  function dyTaskToDay(id,target){
    const p=plData(), t=p.tasks.find(x=>String(x.id)===String(id)); if(!t||t.done||t.slotted) return;
    const h=dyFreeSlot(target,1);
    if(h===null){ plToast('Цього дня нема вільної години — обери інший'); return; }
    plBlocksFor(target).push({id:dyNewId(), h, endH:h+1, t:t.t||'Задача', c:t.c||'val', tag:t.tag||'', folder:'', fromTask:t.id, done:false});
    t.slotted=true; saveGoals(); plRerender();
    const d=new Date(target+'T12:00:00');
    plToast('📅 «'+(t.t||'Задача')+'» — '+DY_DOW[(d.getDay()+6)%7]+', '+d.getDate()+' '+JN_MON[d.getMonth()]+' о '+plHM(h));
  }
  function dyWeekTasksBind(c){
    // plData() щоразу заново: синк при фокусі міг замінити planner, поки відкрита шторка
    const find=id=>plData().tasks.find(x=>String(x.id)===String(id));
    { const b=c.querySelector('[data-dwthide]'); if(b) b.onclick=()=>{ plData().collapsed.wkTasks=true; saveGoals(); plRerender(); }; }
    { const b=c.querySelector('[data-dwtshow]'); if(b) b.onclick=()=>{ plData().collapsed.wkTasks=false; saveGoals(); plRerender(); }; }
    { const b=c.querySelector('[data-dwtadd]'); if(b) b.onclick=()=>inputModal({title:'Задача тижня', placeholder:'Що треба зробити цього тижня?', onOk:v=>{
        v=String(v||'').trim().slice(0,200); if(!v) return;
        plData().tasks.push({id:'t_'+Date.now()+'_'+Math.random().toString(36).slice(2,5), scope:'week', t:v, c:'val', p:2, tag:'', done:false, open:false, subs:[]});
        saveGoals(); plRerender(); }}); }
    c.querySelectorAll('[data-dwtdone]').forEach(el=>el.onclick=()=>{ const t=find(el.dataset.dwtdone); if(!t) return;
      t.done=true; saveGoals(); plRerender();
      flowUndoToast('Задачу зроблено',()=>{ const q=find(t.id); if(q){ q.done=false; saveGoals(); plRerender(); } }); });
    c.querySelectorAll('[data-dwtask]').forEach(el=>el.onclick=()=>{ const t=find(el.dataset.dwtask); if(!t) return;
      actionSheet({title:t.t||'Задача', sub:'Задача тижня без дня', items:[
        {ic:'calendar', label:'Поставити в день', sub:'стане справою в перший вільний час', primary:true, onClick:()=>
          dyDayPicker('У який день?','«'+(t.t||'Задача')+'» стане справою на годину — час потім можна змінити.',dyWk.sel||plTodayStr(),'',d=>dyTaskToDay(t.id,d))},
        {ic:'target', label:'Зроблено', onClick:()=>{ const q=find(t.id); if(q){ q.done=true; saveGoals(); } plRerender(); }},
        {ic:'trash', label:'Видалити', danger:true, onClick:()=>confirmSheet({title:'Видалити задачу «'+(t.t||'')+'»?', sub:'Її не буде в списку тижня.', okLabel:'Видалити', onOk:()=>{
          const q=plData(); q.tasks=q.tasks.filter(x=>String(x.id)!==String(t.id)); saveGoals(); plRerender(); }})} ]}); });
  }
