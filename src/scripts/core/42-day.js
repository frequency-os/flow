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
      cells+=`<button class="dy-d${ds===sel?' on':''}${ds===today?' today':''}" data-plday="${ds}"><small>${DY_DOW[i]}</small><b>${d.getDate()}</b>
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

  function dyDayHTML(){
    const p=plData(), ds=p.selDate||plTodayStr(), today=plTodayStr(), isToday=ds===today;
    const blocks=plBlocksFor(ds).slice().sort((a,b)=>(+a.h||0)-(+b.h||0));
    const done=blocks.filter(b=>b.done).length;
    const d=new Date(ds+'T12:00:00');
    const title=isToday?'Сьогодні':ds===dyAddDays(today,1)?'Завтра':ds===dyAddDays(today,-1)?'Вчора':DY_DOW[(d.getDay()+6)%7]+', '+d.getDate()+' '+JN_MON[d.getMonth()];
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
    return `${dyWeekHTML(ds)}
      <div class="dy-h"><div><b>${esc(title)}</b><small>${blocks.length?done+' з '+blocks.length+' зроблено':'справ нема'}</small></div>
        <span class="dy-hb">${isToday?'':`<button class="dy-today" data-plday="${today}">Сьогодні</button>`}<button class="dy-from" data-dyfrom>＋ З місій</button></span></div>
      ${empty}<div class="dy-list">${rows}</div><div class="dy-pad"></div>`;
  }

  function dyBind(c){
    const p=plData(), ds=p.selDate||plTodayStr();
    const find=id=>plBlocksFor(ds).find(x=>String(x.id)===String(id));
    c.querySelectorAll('[data-dydone]').forEach(el=>el.onclick=e=>{ e.stopPropagation(); const b=find(el.dataset.dydone); if(b) plCompleteBlock(b.id); });
    c.querySelectorAll('[data-dyblk]').forEach(el=>el.onclick=()=>{ const b=find(el.dataset.dyblk); if(b) dyMenu(b,ds); });
    c.querySelectorAll('[data-dyadd]').forEach(el=>el.onclick=()=>plBlockSheet(null,+el.dataset.dyadd));
    { const f=c.querySelector('[data-dyfrom]'); if(f) f.onclick=()=>dyFromMissions(ds); }
  }

  function dyNewId(){ return 'b_'+Date.now()+'_'+Math.random().toString(36).slice(2,6); }
  function dyDropReminder(b){ try{ if(reminderTimers['pl_'+b.id]){ clearTimeout(reminderTimers['pl_'+b.id]); delete reminderTimers['pl_'+b.id]; } }catch(_){} }
  // прибрати блок із дня (шукаємо за id — дані могли оновитись із хмари, поки відкрите меню);
  // повторюваний — ще й пропуск цього дня, щоб Планер не створив його знову. Повертає прибраний блок або null.
  function dyRemove(id,ds){
    const p=plData(), list=plBlocksFor(ds), i=list.findIndex(x=>String(x.id)===String(id)); if(i<0) return null;
    const b=list.splice(i,1)[0];
    if(b.done){ try{ plUncompleteEffects(b,ds); }catch(_){} }   // зроблена справа зникла — знімаємо її слід у цілі/трекері
    if(b.fromTask){ const t=p.tasks.find(x=>x.id===b.fromTask); if(t) t.slotted=false; }
    if(b.fromRecur){ if(!Array.isArray(p.recurSkip[ds])) p.recurSkip[ds]=[]; if(!p.recurSkip[ds].includes(b.fromRecur)) p.recurSkip[ds].push(b.fromRecur); }
    dyDropReminder(b);
    return b;
  }
  function dyMenu(b,ds){
    const g=dyGoal(b), items=[];
    items.push({ic:'target', label:b.done?'Зняти позначку «зроблено»':'Зроблено', primary:!b.done, onClick:()=>plCompleteBlock(b.id)});
    items.push({ic:'edit', label:'Змінити', sub:'назва, час, місія', onClick:()=>plEditBlock(b.id)});
    if(!b.done) items.push({ic:'calendar', label:'Перенести на завтра', sub:b.fromRecur?'лише цей раз — розклад лишається':'', onClick:()=>{
      const old=dyRemove(b.id,ds); if(!old){ plRerender(); return; }
      const next=dyAddDays(ds,1), copy=Object.assign({},old,{id:dyNewId(),done:false,remindAt:null,remindFired:false});
      delete copy.fromRecur; delete copy.repeatLabel; delete copy.fromTask;   // задачу dyRemove уже повернув у список
      // нагадування переносимо разом зі справою: те саме «за N хв», від завтрашнього часу
      if(copy.remindOffset!=null){ try{ copy.remindAt=new Date(new Date(next+'T00:00:00').getTime()+Math.round(copy.h*3600000)-copy.remindOffset*60000).toISOString(); plScheduleReminder(copy); }catch(_){} }
      plBlocksFor(next).push(copy);
      saveGoals(); plRerender(); plToast('→ «'+(old.t||'Справа')+'» завтра о '+plHM(old.h)); }});
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
