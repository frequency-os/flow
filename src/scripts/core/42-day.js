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
  function dyGap(from,to,last){
    const lbl=last&&to>=24?'вільно до кінця дня':(last?'вільно до '+plHM(to):'вільно '+plDurLabel(from,to));
    return `<button class="dy-gap" data-dyadd="${from}"><span class="dy-t">${plHM(from)}</span><span>${lbl}</span><b>＋</b></button>`;
  }

  // стрічка одного дня: справи за часом, лінія «зараз», проміжки «вільно ＋» (лише HTML; привʼязка — dyBind)
  function dyRibbonHTML(ds){
    const today=plTodayStr(), isToday=ds===today;
    const blocks=plBlocksFor(ds).slice().sort((a,b)=>(+a.h||0)-(+b.h||0));
    const n=new Date(), nowDec=n.getHours()+n.getMinutes()/60;
    let rows='', cur=dyCursorStart(ds), nowShown=!isToday;
    const nowLine=()=>`<div class="dy-now"><span class="dy-t">${plHM(nowDec)}</span><i></i></div>`;
    blocks.forEach(b=>{
      if(!nowShown && b.h>nowDec){ rows+=nowLine(); nowShown=true; }
      if(b.h-cur>=DY_MIN_GAP) rows+=dyGap(cur,b.h,false);
      rows+=dyRow(b);
      cur=Math.max(cur,Math.min(plBlockEnd(b),24));
    });
    if(!nowShown) rows+=nowLine();
    const H1=dyDayEnd();
    if(H1-cur>=DY_MIN_GAP) rows+=dyGap(cur,H1,true);
    const empty=!blocks.length?`<div class="dy-empty"><b>${isToday?'День ще порожній':'Цей день порожній'}</b><span>Візьми справу з місії або тапни «＋» у вільному часі.</span></div>`:'';
    return `${empty}<div class="dy-list">${rows}</div>`;
  }
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
        plBlocksFor(ds).push({id:dyNewId(), h, endH:h+dur, t:g.name||'Місія', c:'val', link, tag:plLinkTag(link), folder:'', done:false});
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
    const maxH=Math.max(1,...days.map(ds=>dayH[ds]));
    const heat=days.map((ds,i)=>{ const h=dayH[ds];
      return `<button class="dw-d${ds===sel?' on':''}${ds===today?' today':''}" data-dwday="${ds}" aria-label="${DY_DOW[i]} ${+ds.slice(8)} ${JN_MON[+ds.slice(5,7)-1]}, ${h?dyNum(h)+' год':'вільний'}"${ds===sel?' aria-pressed="true"':''}><small>${DY_DOW[i]}</small><b>${+ds.slice(8)}</b>
        <span class="dw-col"><i style="height:${h?Math.max(12,Math.round(h/maxH*100)):0}%"></i></span><small>${h?dyNum(h)+'г':'—'}</small></button>`; }).join('');
    const list=plBlocksDisplay(sel).slice().sort((a,b)=>(+a.h||0)-(+b.h||0));
    const sd=new Date(sel+'T12:00:00');
    const selTitle=(sel===today?'Сьогодні · ':'')+DY_DOW[(sd.getDay()+6)%7]+', '+sd.getDate()+' '+JN_MON[sd.getMonth()];
    return `<div class="dw-nav"><button data-dwshift="-7" aria-label="Попередній тиждень">‹</button>
        <div><b>${dyWeekRange(mon)}</b>${mon!==thisMon?`<button class="dw-now" data-dwthis>Цей тиждень</button>`:'<small>цей тиждень</small>'}</div>
        <button data-dwshift="7" aria-label="Наступний тиждень">›</button></div>
      <div class="dw-sec"><span>Бюджет місій</span><span>${heroH?`усього ${dyNum(totD+totP)} з ${dyNum(heroH)} год`:`усього ${dyNum(totD+totP)} год`}</span></div>
      ${rows||`<div class="dy-empty"><b>Ще нема місій</b><span>Бюджет годин зʼявиться, коли створиш місію в Журналі.</span></div>`}
      ${ms.length?`<div class="dw-leg"><span><i class="d"></i>зроблено</span><span><i class="p"></i>заплановано</span></div>`:''}
      <div class="dw-heat">${heat}</div>
      ${dyWeekTasksHTML()}
      <div class="dw-sec"><span>${esc(selTitle)}</span><span>${list.length?list.filter(b=>b.done).length+' з '+list.length:''}</span></div>
      ${list.length?`<div class="dy-list">${list.map(dyRow).join('')}</div>`:`<div class="dy-empty"><span>У цей день справ нема.</span></div>`}
      <button class="dw-open" data-dwopen>Відкрити день ›</button>
      <div class="dy-pad"></div>`;
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
