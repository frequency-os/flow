  /* ============ ПЛАНЕР (День/Тиждень/Місяць/Квартал) ============ */
  const PL_COL={val:'#5b8def',hab:'#34c77b',fin:'#e8843c',skl:'#c77dff',cyan:'#2fb6c4',gold:'#f0b429',rose:'#ff6b9d'};
  const PL_RGB={val:'91,141,239',hab:'52,199,123',fin:'232,132,60',skl:'199,125,255',cyan:'47,182,196',gold:'240,180,41',rose:'255,107,157'};
  const PL_PRIO={1:'#ff5a6a',2:'#f0b429',3:'#5b8def'};
  // ===== Pomodoro фокус-таймер =====
  let plFocusState=null; // {sec, total, timerId, running, label}
  function plFocusToday(){ const p=plData(); if(!p.focus||typeof p.focus!=='object') p.focus={}; const td=plTodayStr();
    if(!p.focus[td]) p.focus[td]={sessions:0, seconds:0}; return p.focus[td]; }
  function plData(){ if(!goalsData.planner) goalsData.planner={scope:'week',tasks:[],blocks:[]};
    const p=goalsData.planner; if(!Array.isArray(p.tasks))p.tasks=[]; if(!p.scope)p.scope='week';
    if(!p.collapsed || typeof p.collapsed!=='object') p.collapsed={inbox:true,sum:true};
    if(!p.matrix || typeof p.matrix!=='object') p.matrix={q1:[],q2:[],q3:[],q4:[]};
    ['q1','q2','q3','q4'].forEach(k=>{ if(!Array.isArray(p.matrix[k])) p.matrix[k]=[]; });
    // міграція: старі плоскі blocks[] → blocksByDay{ 'YYYY-MM-DD':[...] } на сьогодні
    if(!p.blocksByDay || typeof p.blocksByDay!=='object'){ p.blocksByDay={}; }
    if(Array.isArray(p.blocks) && p.blocks.length){
      const td=plTodayStr();
      if(!Array.isArray(p.blocksByDay[td])) p.blocksByDay[td]=[];
      p.blocksByDay[td]=p.blocksByDay[td].concat(p.blocks);
      p.blocks=[]; // спорожнюємо старе поле (лишаємо як [], щоб старий код не падав)
    }
    if(!Array.isArray(p.blocks)) p.blocks=[];
    if(!p.selDate) p.selDate=plTodayStr();
    if(typeof p.dayStart!=='number') p.dayStart=0;
    if(typeof p.dayEnd!=='number') p.dayEnd=24;
    if(!Array.isArray(p.recurring)) p.recurring=[];
    if(!p.recurSkip || typeof p.recurSkip!=='object') p.recurSkip={};
    if(!p.iconStyle) p.iconStyle='5';
    if(!p.calMonth) p.calMonth=plTodayStr().slice(0,7);
    if(!p._blkExpanded || typeof p._blkExpanded!=='object') p._blkExpanded={};
    return p; }
  function plTodayStr(){ return ymdLocal(); }
  // мітки/розрахунки для повторів
  const PL_REPEAT_LABEL={daily:'щодня', weekdays:'будні', weekly:'щотижня'};
  function plRecurMatchesDay(tpl,ds){
    if(!tpl||!tpl.repeat||!tpl.repeat.type) return false;
    if(tpl.active===false) return false;
    if(ds<tpl.startDate) return false;
    const dow=new Date(ds+'T12:00:00').getDay();
    if(tpl.repeat.type==='daily') return true;
    if(tpl.repeat.type==='weekdays') return dow>=1&&dow<=5;
    if(tpl.repeat.type==='weekly'){ const odow=new Date(tpl.startDate+'T12:00:00').getDay(); return dow===odow; }
    if(tpl.repeat.type==='custom'){ return Array.isArray(tpl.repeat.dows) && tpl.repeat.dows.includes(dow); }
    return false;
  }
  // матеріалізує повторювані шаблони в конкретний день (ідемпотентно)
  function plMaterializeRecurring(ds,list){
    const p=plData();
    if(!p.recurring.length) return;
    const skip=p.recurSkip[ds]||[];
    p.recurring.forEach(tpl=>{
      if(skip.includes(tpl.id)) return;
      if(!plRecurMatchesDay(tpl,ds)) return;
      if(list.some(b=>b.fromRecur===tpl.id)) return;
      list.push({ id:'b_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), h:tpl.h, endH:tpl.endH, t:tpl.t,
        c:tpl.c, link:tpl.link?Object.assign({},tpl.link):null, tag:tpl.tag, folder:tpl.folder||'', done:false,
        fromRecur:tpl.id, repeatLabel:PL_REPEAT_LABEL[tpl.repeat.type]||'', remindOffset:tpl.remindOffset });
    });
  }
  // блоки конкретного дня
  function plBlocksFor(ds){ const p=plData(); if(!Array.isArray(p.blocksByDay[ds])) p.blocksByDay[ds]=[];
    const list=p.blocksByDay[ds]; plMaterializeRecurring(ds,list); return list; }

  /* ===== Календар місяця: бюджет годин + сітка днів з закритими (шаблонними) блоками ===== */
  const PL_MONTH_NAMES=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
  function plShiftCalMonth(delta){
    const p=plData(); let [y,m]=p.calMonth.split('-').map(Number);
    m+=delta; while(m<1){ m+=12; y--; } while(m>12){ m-=12; y++; }
    p.calMonth=y+'-'+String(m).padStart(2,'0'); saveGoals();
  }
  // клітинки місяця, згруповані по тижнях (Пн-першим) — для табличної сітки
  function plMonthWeeks(ym){
    const [y,m]=ym.split('-').map(Number);
    const first=new Date(y, m-1, 1);
    const daysInMonth=new Date(y, m, 0).getDate();
    let dow=(first.getDay()+6)%7; // Пн=0
    const flat=[]; for(let i=0;i<dow;i++) flat.push(null);
    for(let d=1; d<=daysInMonth; d++) flat.push(y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0'));
    while(flat.length%7) flat.push(null);
    const weeks=[]; for(let i=0;i<flat.length;i+=7) weeks.push(flat.slice(i,i+7));
    return weeks;
  }
  // колір блоку: якщо прив'язаний до цілі — колір цілі, інакше власний колір блоку
  function plGoalColorFor(b){
    if(b && b.link && b.link.goalId){
      const g=(goalsData.goals||[]).find(x=>(x.id||x.name)===b.link.goalId);
      if(g && g.color) return g.color;
    }
    return PL_COL[b&&b.c] || '#5b8def';
  }
  function plMonthCalHTML(){
    const p=plData(); const ym=p.calMonth; const [y,m]=ym.split('-').map(Number);
    const weeks=plMonthWeeks(ym); const CAP=Math.max(1, p.dayEnd-p.dayStart); const td=plTodayStr();
    const totalsByGoal={}; let totalFree=0, totalCap=0;

    // читаємо блоки дня без мутації сховища (лише для відображення)
    function blocksForDisplay(ds){
      const saved=Array.isArray(p.blocksByDay[ds]) ? p.blocksByDay[ds] : [];
      const skip=p.recurSkip[ds]||[];
      const extra=[];
      p.recurring.forEach(tpl=>{
        if(skip.includes(tpl.id)) return;
        if(!plRecurMatchesDay(tpl,ds)) return;
        if(saved.some(b=>b.fromRecur===tpl.id)) return;
        extra.push({h:tpl.h, endH:tpl.endH, t:tpl.t, c:tpl.c, link:tpl.link, fromRecur:tpl.id});
      });
      return saved.concat(extra);
    }

    function cellFor(ds){
      if(!ds) return `<td class="off"></td>`;
      const list=blocksForDisplay(ds);
      let used=0; const segByGoal={};
      list.forEach(b=>{
        const bEnd=b.endH!=null?b.endH:(b.h+(b.span||1));
        const dur=Math.max(0, Math.min(bEnd,p.dayEnd) - Math.max(b.h,p.dayStart));
        if(dur<=0) return;
        used+=dur;
        const key=(b.link&&b.link.goalId) ? b.link.goalId : (b.c||'_none');
        const col=plGoalColorFor(b);
        if(!segByGoal[key]) segByGoal[key]={dur:0,col};
        segByGoal[key].dur+=dur;
        if(!totalsByGoal[key]) totalsByGoal[key]={dur:0,col,name:(b.link&&b.link.goalName)||''};
        totalsByGoal[key].dur+=dur;
      });
      used=Math.min(used,CAP); const free=Math.max(0,CAP-used);
      totalFree+=free; totalCap+=CAP;
      const hasLock=list.some(b=>b.fromRecur);
      let bar=Object.values(segByGoal).map(s=>`<i style="width:${(s.dur/CAP*100).toFixed(0)}%;background:${s.col}"></i>`).join('');
      if(free>0) bar+=`<i style="width:${(free/CAP*100).toFixed(0)}%;background:rgba(255,255,255,.06)"></i>`;
      const dnum=+ds.slice(8,10); const isToday=ds===td, isSel=ds===p.selDate;
      return `<td class="${isToday?'today':''}${isSel?' sel':''}" data-plcalday="${ds}">
        <div class="pl-cal-dn">${dnum}</div>${hasLock?'<div class="pl-cal-lock">🔒</div>':''}
        <div class="pl-cal-bar">${bar}</div></td>`;
    }

    const rowsHtml=weeks.map(week=>`<tr>${week.map(cellFor).join('')}</tr>`).join('');
    const usedTotal=totalCap-totalFree;
    const budgetBar=Object.values(totalsByGoal).map(s=>`<i style="width:${(totalCap?s.dur/totalCap*100:0).toFixed(1)}%;background:${s.col}"></i>`).join('')
      + (totalFree>0?`<i style="width:${(totalCap?totalFree/totalCap*100:0).toFixed(1)}%;background:rgba(255,255,255,.06)"></i>`:'');
    const chips=Object.keys(totalsByGoal).map(k=>{
      const s=totalsByGoal[k]; const lbl=s.name||'Блоки';
      return `<span class="pl-cal-chip"><i style="background:${s.col}"></i>${esc(lbl)} ${Math.round(s.dur)}г</span>`;
    }).join('') + `<span class="pl-cal-chip"><i style="background:rgba(255,255,255,.15)"></i>Вільно ${Math.round(totalFree)}г</span>`;

    return `<div class="pl-budget">
        <div class="pl-budget-h"><h4>Бюджет · ${PL_MONTH_NAMES[m-1]}</h4>
          <div class="pl-budget-hr"><span>${Math.round(usedTotal)} / ${Math.round(totalCap)} год</span>
          <button class="pl-budget-gear" data-plrange title="Налаштувати години дня">⚙</button></div></div>
        <div class="pl-budget-bar">${budgetBar}</div>
        <div class="pl-budget-chips">${chips}</div>
        <div class="pl-budget-sub">Робочий день: ${(p.dayStart<10?'0':'')+p.dayStart}:00–${(p.dayEnd<10?'0':'')+p.dayEnd}:00 · ${CAP} год/день · тисни ⚙</div>
      </div>
      <div class="pl-cal">
        <div class="pl-cal-h">
          <button class="pl-cal-nav" data-plcalprev>‹</button>
          <h3>${PL_MONTH_NAMES[m-1]} ${y}</h3>
          <button class="pl-cal-nav" data-plcalnext>›</button>
        </div>
        <table class="pl-cal-table">
          <thead><tr>${['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(d=>`<th>${d}</th>`).join('')}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div class="pl-cal-hint">Тап на день — відкриє розклад і форму додавання блоку. 🔒 — є закриті шаблонні блоки.</div>
      </div>`;
  }

  // ---- список постійних (шаблонних) блоків місяця: перемикач + додавання ----
  function plTemplateGoalMeta(link){
    if(link && link.goalId){
      const g=(goalsData.goals||[]).find(x=>(x.id||x.name)===link.goalId);
      if(g) return {emoji:g.emoji||'🎯', color:g.color||'#5b8def', name:g.name||'Ціль'};
    }
    return {emoji:'⏱', color:'#5b8def', name:'Без цілі'};
  }
  function plDowLabel(dows){
    const names=['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
    return (dows||[]).slice().sort((a,b)=>(a===0?7:a)-(b===0?7:b)).map(d=>names[d]).join(', ');
  }
  function plTemplateListHTML(){
    const p=plData();
    const tpls=p.recurring.filter(t=>t.repeat);
    const rows = tpls.length ? tpls.map(t=>{
      const meta=plTemplateGoalMeta(t.link); const on=t.active!==false;
      let daysLbl='';
      if(t.repeat.type==='daily') daysLbl='щодня';
      else if(t.repeat.type==='weekdays') daysLbl='Пн–Пт';
      else if(t.repeat.type==='weekly'){ daysLbl=plDowLabel([new Date(t.startDate+'T12:00:00').getDay()]); }
      else if(t.repeat.type==='custom') daysLbl=plDowLabel(t.repeat.dows);
      return `<div class="pl-tpl${on?'':' off'}">
        <div class="pl-tpl-ic" style="background:color-mix(in srgb, ${meta.color} 22%, transparent);color:${meta.color}">${meta.emoji}</div>
        <div class="pl-tpl-ti"><h5>${esc(t.t)}</h5><p>${plHM(t.h)}–${plHM(t.endH)} · ${esc(daysLbl)} · ціль: ${esc(meta.name)}</p></div>
        <div class="pl-tpl-tog${on?' on':''}" data-pltpltoggle="${t.id}"><i></i></div>
      </div>`;
    }).join('') : `<div class="pl-empty" style="padding:18px 14px">Немає постійних блоків. Додай перший — розставиться одразу на весь місяць.</div>`;
    return `<div class="seclbl" style="display:flex;justify-content:space-between;align-items:center">🔒 Постійні блоки місяця<span class="pl-tpl-add" data-pltpladd>+ додати шаблон</span></div>
      <div class="pl-tpl-list">${rows}</div>`;
  }
  // умикач/вимикач шаблону: вимкнення не видаляє, лише прибирає ще не виконані розставлені блоки
  function plToggleTemplate(id){
    const p=plData();
    const tpl=p.recurring.find(x=>x.id===id); if(!tpl) return;
    tpl.active = !(tpl.active!==false);
    if(!tpl.active){
      Object.keys(p.blocksByDay).forEach(ds=>{
        p.blocksByDay[ds]=p.blocksByDay[ds].filter(b=>!(b.fromRecur===tpl.id && !b.done));
      });
    }
    saveGoals();
  }
  // окремий діалог: створити постійний блок одразу (без прив'язки до конкретного дня)
  function plNewTemplateSheet(){
    const p=plData(); const goals=(goalsData.goals||[]);
    let selDows=new Set([1,2,3,4,5]);
    const ov=document.createElement('div'); ov.className='pl-sheet-ov';
    ov.innerHTML=`
      <div class="pl-sheet">
        <div class="pl-sheet-grab"></div>
        <div class="pl-sheet-h">Новий постійний блок</div>
        <label class="pl-sheet-l">Що робитимеш?</label>
        <input class="pl-sheet-in" id="ntTitle" placeholder="Напр. Робота, Тренування, Зйомка...">
        <div class="pl-sheet-row">
          <div class="pl-sheet-col"><label class="pl-sheet-l">З</label><input type="time" step="300" class="pl-sheet-in" id="ntFrom" value="09:00"></div>
          <div class="pl-sheet-col"><label class="pl-sheet-l">До</label><input type="time" step="300" class="pl-sheet-in" id="ntTo" value="18:00"></div>
        </div>
        <label class="pl-sheet-l">Дні тижня</label>
        <div class="pl-dow-chips">${['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map((l,i)=>`<button type="button" class="pl-dow-chip${selDows.has(i===6?0:i+1)?' on':''}" data-dow="${i===6?0:i+1}">${l}</button>`).join('')}</div>
        <label class="pl-sheet-l">🔗 Зв'язок з ціллю (необов'язково)</label>
        <select class="pl-sheet-in" id="ntGoal">
          <option value="">— без цілі —</option>
          ${goals.map(g=>`<option value="${esc(g.id||g.name||'')}">${g.emoji||'🎯'} ${esc(g.name||'Ціль')}</option>`).join('')}
        </select>
        <div class="pl-sheet-btns">
          <button class="pl-sheet-cancel" id="ntCancel">Скасувати</button>
          <button class="pl-sheet-ok" id="ntOk">Додати</button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    ov.addEventListener('click',(e)=>{ if(e.target===ov) close(); });
    ov.querySelectorAll('[data-dow]').forEach(ch=>ch.onclick=()=>{
      const dv=+ch.dataset.dow;
      if(selDows.has(dv)){ if(selDows.size>1) selDows.delete(dv); } else selDows.add(dv);
      ch.classList.toggle('on', selDows.has(dv));
    });
    ov.querySelector('#ntCancel').onclick=close;
    ov.querySelector('#ntOk').onclick=()=>{
      const t=ov.querySelector('#ntTitle').value.trim();
      const from=plHMtoDec(ov.querySelector('#ntFrom').value), to=plHMtoDec(ov.querySelector('#ntTo').value);
      if(!t){ ov.querySelector('#ntTitle').focus(); return; }
      if(from==null||to==null||to<=from) return;
      const gid=ov.querySelector('#ntGoal').value;
      let link=null;
      if(gid){ const g=goals.find(x=>(x.id||x.name)===gid); link={type:'goalstep', goalId:gid, goalName:g?g.name:''}; }
      const cols=['val','hab','fin','skl','cyan'];
      const col=cols[p.recurring.length%cols.length];
      const tag=plLinkTag(link);
      const tpl={id:'rt_'+Date.now(), t, h:from, endH:to, c:col, link, tag, folder:'', repeat:{type:'custom', dows:[...selDows]}, startDate:plTodayStr(), remindOffset:null, active:true};
      p.recurring.push(tpl);
      saveGoals(); close(); plRerender();
      plToast('📅 Шаблон додано й розставлено на місяць');
    };
    setTimeout(()=>{ const ti=ov.querySelector('#ntTitle'); if(ti) ti.focus(); },100);
  }
  // округлення десяткової години до "ГГ:ХХ"
  function plHM(dec){ const h=Math.floor(dec+1e-6); const m=Math.round((dec-h)*60); const hh=(h<10?'0':'')+h; const mm=(m<10?'0':'')+m; return hh+':'+mm; }
  function plHMtoDec(s){ const m=String(s||'').match(/(\d{1,2}):(\d{2})/); if(!m) return null; return (+m[1])+(+m[2])/60; }
  function plDurLabel(fromDec,toDec){ const mins=Math.round((toDec-fromDec)*60); if(mins<60) return mins+' хв'; const h=Math.floor(mins/60), m=mins%60; return h+' год'+(m?' '+m+' хв':''); }
  // ===== іконки Планера: 3 перемикні стилі (1 лінія / 3 дуотон / 5 гео) =====
  const PL_ICON_CORE={
    '1':{ // тонка лінія (Feather-style)
      remind:'<path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/>',
      repeat:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>',
      warn:'<path d="M12 9v4"/><path d="M10.3 3.9L2.5 18a1.5 1.5 0 001.3 2.2h16.4a1.5 1.5 0 001.3-2.2L13.7 3.9a1.5 1.5 0 00-2.6 0z"/><path d="M12 17h.01"/>',
      done:'<polyline points="20 6 9 17 4 12"/>',
      calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
      goal:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
      income:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1-3 2.3c0 3 6 1.5 6 4.5 0 1.4-1.3 2.4-3 2.4s-3-1-3-2.4"/>',
      folder:'<path d="M3 7l2-3h5l2 3h9v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>'
    },
    '3':{ // дуотон (контур + акцент)
      remind:'<path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><circle cx="12" cy="8" r="2" fill="currentColor" stroke="none"/>',
      repeat:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
      warn:'<path d="M10.3 3.9L2.5 18a1.5 1.5 0 001.3 2.2h16.4a1.5 1.5 0 001.3-2.2L13.7 3.9a1.5 1.5 0 00-2.6 0z"/><path d="M12 10.5v2.8"/><circle cx="12" cy="16.3" r="1.1" fill="currentColor" stroke="none"/>',
      done:'<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.6 2.6L16.3 9"/>',
      calendar:'<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 10h18"/>',
      goal:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
      income:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10"/>',
      folder:'<path d="M3 7l2-3h5l2 3h9v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/><path d="M3 7h18"/>'
    },
    '5':{ // мікро-геометрія (поточний)
      remind:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 1.5"/>',
      repeat:'<path d="M4 12a8 8 0 0113-6"/><path d="M20 12a8 8 0 01-13 6"/><path d="M17 4v2h-2M7 20v-2h2"/>',
      warn:'<path d="M4 18L12 5l8 13z"/><path d="M12 10.5v2.3"/><circle cx="12" cy="15.3" r=".2" fill="currentColor" stroke="currentColor" stroke-width="2"/>',
      done:'<path d="M5 12.5l4.5 4.5L19 7"/>',
      calendar:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
      goal:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/>',
      income:'<path d="M12 4v16M8 8c0-2 2-3 4-3s4 1 4 2.5S14 9 12 9s-4 1-4 2.5S10 14 12 14s4 1 4 3-2 3-4 3"/>',
      folder:'<path d="M3 8l1.5-2.5h5L11 8h10v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>'
    }
  };
  // іконки, що не залежать від стилю (другорядні, спільні для всіх 3 варіантів)
  const PL_ICONS={
    clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 1.5"/>',
    inbox:'<path d="M4 5h16v14H4z"/><path d="M4 13h5l1.5 2h3L15 13h5"/>',
    sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><circle cx="12" cy="12" r="2.5"/>',
    trash:'<path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/>',
    focus:'<circle cx="12" cy="13" r="7"/><path d="M12 9v4l2 1.2M10 3h4"/>',
    link:'<path d="M9 15l6-6"/><path d="M8 12l-2.5 2.5a3.5 3.5 0 005 5L13 17"/><path d="M16 12l2.5-2.5a3.5 3.5 0 00-5-5L11 7"/>'
  };
  function plIconStyle(){ const p=plData(); return (p.iconStyle==='1'||p.iconStyle==='3')?p.iconStyle:'5'; }
  // повертає inline-SVG рядок; size — px, cls — додатковий CSS-клас
  function plIco(name,size,cls){
    const core=PL_ICON_CORE[plIconStyle()]||PL_ICON_CORE['5'];
    const body=core[name]||PL_ICONS[name]; if(!body) return '';
    const s=size||12;
    return `<svg class="pl-ico${cls?' '+cls:''}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  }

  function plRing(pct,cl){
    const r=36,c=2*Math.PI*r,off=c*(1-pct/100);
    return `<div class="pl-ring"><svg width="84" height="84" viewBox="0 0 84 84">
      <circle cx="42" cy="42" r="36" fill="none" stroke="var(--card-2)" stroke-width="7"/>
      <circle cx="42" cy="42" r="36" fill="none" stroke="${cl}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}"/>
      </svg><div class="pl-pct">${pct}%</div></div>`;
  }

  /* ===== ВКЛАДКА ШЛЯХ: Потік (каскад) + Містки (троси А→Б) ===== */
  function goalPctP(gl){
    const steps=gl.steps||[];
    const sd=steps.filter(s=>s.done).length;
    return steps.length?Math.round(sd/steps.length*100):(gl.progress||0);
  }
  function renderPath(c){
    const g=goalsData;
    if(g.pathMode!=='flow' && g.pathMode!=='bridge') g.pathMode='flow';
    const seg=`<div class="pth-seg">
      <button class="${g.pathMode==='flow'?'on':''}" data-pmode="flow">🪜 Потік</button>
      <button class="${g.pathMode==='bridge'?'on':''}" data-pmode="bridge">🌉 Містки</button>
    </div>`;
    c.innerHTML = seg + (g.pathMode==='flow' ? pathFlowHtml() : pathBridgeHtml());

    c.querySelectorAll('[data-pmode]').forEach(b=>b.onclick=()=>{ g.pathMode=b.dataset.pmode; saveGoals(); renderGoalsTab(); });
    // розкриття рівнів каскаду
    c.querySelectorAll('[data-flwtog]').forEach(r=>r.onclick=()=>{ r.closest('.flw-lvl').classList.toggle('open'); });
    // тап по А/Б у Містках → редагувати
    c.querySelectorAll('[data-pedit]').forEach(n=>n.onclick=()=>{
      const w=n.dataset.pedit;
      if(w==='a') inputModal({title:'Точка А — де я зараз', value:g.pointA||'', placeholder:'Чесно: звички, фінанси, стан…', onOk:(v)=>{ g.pointA=v; saveGoals(); renderGoalsTab(); }});
      else inputModal({title:'Точка Б — куди йду', value:g.pointB||'', placeholder:'Дисципліна, фінанси, реліз…', onOk:(v)=>{ g.pointB=v; saveGoals(); renderGoalsTab(); }});
    });
    // тап по цілі (в обох режимах) → перейти на вкладку Цілі
    c.querySelectorAll('[data-pgoal]').forEach(el=>el.onclick=()=>{ g.tab='goals'; saveGoals(); renderGoals(); });
    // додати ціль
    const addb=c.querySelector('[data-paddgoal]');
    if(addb) addb.onclick=()=>{ g.tab='goals'; saveGoals(); renderGoals(); setTimeout(()=>{ const nb=document.getElementById('gNewGoal'); if(nb) nb.click(); },80); };
  }

  function pathFlowHtml(){
    const g=goalsData;
    const visionTxt = g.mission&&g.mission.trim()? esc(g.mission) : 'Не задано — додай у вкладці Цілі';
    const aTxt = g.pointA&&g.pointA.trim()? esc(g.pointA) : 'Не задано';
    const bTxt = g.pointB&&g.pointB.trim()? esc(g.pointB) : 'Не задано';
    const goals=g.goals||[];
    const goalsAvg = goals.length? Math.round(goals.reduce((s,x)=>s+goalPctP(x),0)/goals.length):0;
    const doneG = goals.filter(x=>goalPctP(x)>=100).length;

    // рівень А/Б
    const abSub = `<div class="flw-sub"><div class="flw-sub-in">
      <div class="flw-item"><span style="color:var(--owe);font-weight:800">А:</span><span>${aTxt}</span></div>
      <div class="flw-item"><span style="color:var(--owed);font-weight:800">Б:</span><span>${bTxt}</span></div>
    </div></div>`;

    // рівень цілей
    const goalsSub = goals.length ? `<div class="flw-sub"><div class="flw-sub-in">${
      goals.map(gl=>{ const p=goalPctP(gl); return `<div class="flw-item ${p>=100?'done':''}" data-pgoal="${gl.id}"><span class="d"></span><span>${gl.emoji||'🎯'} ${esc(gl.name)} · ${p}%</span></div>`; }).join('')
    }</div></div>` : `<div class="flw-sub"><div class="flw-empty">Цілей ще нема. Додай нижче.</div></div>`;

    // рівень "сьогодні" — денні цілі з усіх goals на сьогодні
    const todayStr=ymdLocal();
    let todayItems=[];
    goals.forEach(gl=>{ const list=(gl.days&&Array.isArray(gl.days[todayStr]))?gl.days[todayStr]:[]; list.forEach(it=>todayItems.push({text:it.text,done:it.done})); });
    const tDone=todayItems.filter(x=>x.done).length;
    const todaySub = todayItems.length ? `<div class="flw-sub"><div class="flw-sub-in">${
      todayItems.map(it=>`<div class="flw-item ${it.done?'done':''}"><span class="d"></span><span>${esc(it.text)}</span></div>`).join('')
    }</div></div>` : `<div class="flw-sub"><div class="flw-empty">На сьогодні цілей дня нема. Додавай у «Цілі» → день.</div></div>`;

    return `<div class="flw">
      <div class="flw-lvl">
        <div class="flw-row" data-flwtog><div class="flw-ic l0">🌟</div><div class="flw-tx"><div class="flw-k">Візія</div><div class="flw-v">${visionTxt}</div></div><span class="flw-chev">›</span></div>
      </div>
      <div class="flw-lvl">
        <div class="flw-row" data-flwtog><div class="flw-ic l1">🧭</div><div class="flw-tx"><div class="flw-k">Шлях · А → Б</div><div class="flw-v">звідки → куди</div></div><span class="flw-chev">›</span></div>
        ${abSub}
      </div>
      <div class="flw-lvl open">
        <div class="flw-row" data-flwtog><div class="flw-ic l2">🎯</div><div class="flw-tx"><div class="flw-k">Цілі року</div><div class="flw-v">${goals.length} цілей · ${doneG} виконано</div></div><span class="flw-meta">${goalsAvg}%</span><span class="flw-chev">›</span></div>
        ${goalsSub}
      </div>
      <div class="flw-lvl">
        <div class="flw-row" data-flwtog><div class="flw-ic l3">📅</div><div class="flw-tx"><div class="flw-k">Сьогодні</div><div class="flw-v">${todayItems.length} цілей дня</div></div><span class="flw-meta">${tDone}/${todayItems.length}</span><span class="flw-chev">›</span></div>
        ${todaySub}
      </div>
    </div>
    <button class="pth-add" data-paddgoal>+ Нова ціль</button>`;
  }

  function brdRing(pct){
    const r=15,c=2*Math.PI*r,off=c*(1-Math.max(0,Math.min(100,pct))/100);
    return `<div class="brd-ring"><svg width="38" height="38" viewBox="0 0 38 38">
      <circle class="rt" cx="19" cy="19" r="15" fill="none" stroke-width="3.5"/>
      <circle class="rf" cx="19" cy="19" r="15" fill="none" stroke-width="3.5" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
      </svg><b>${pct}%</b></div>`;
  }
  function pathBridgeHtml(){
    const g=goalsData;
    const aTxt = g.pointA&&g.pointA.trim()? esc(g.pointA) : 'Тисни, щоб додати Точку А';
    const bTxt = g.pointB&&g.pointB.trim()? esc(g.pointB) : 'Тисни, щоб додати Точку Б';
    const goals=g.goals||[];
    const cables = goals.length ? goals.map(gl=>{
      const p=goalPctP(gl);
      const steps=gl.steps||[]; const sd=steps.filter(s=>s.done).length;
      const meta = steps.length? `${sd}/${steps.length} кроків` : 'без кроків';
      return `<div class="brd-cable" data-pgoal="${gl.id}">
        <div class="brd-cx"><div class="brd-cn">${gl.emoji||'🎯'} ${esc(gl.name)}</div><div class="brd-cm">${meta}</div></div>
        ${brdRing(p)}
      </div>`;
    }).join('') : `<div class="brd-empty">Цілей-містків ще нема.<br>Кожна ціль — це трос, що тягне тебе з А до Б.</div>`;

    return `<div class="brd">
      <div class="brd-poles">
        <div class="brd-pole a" data-pedit="a"><div class="brd-pl">📍 Точка А</div><div class="brd-pv">${aTxt}</div></div>
        <div class="brd-pole b" data-pedit="b"><div class="brd-pl">🏁 Точка Б</div><div class="brd-pv">${bTxt}</div></div>
      </div>
      <div class="brd-span-h">↓ цілі, що ведуть з А до Б ↓</div>
      ${cables}
    </div>
    <button class="pth-add" data-paddgoal>+ Нова ціль-місток</button>`;
  }

  // рендерить планер у активний контейнер (новий екран scr-planner або старий під-таб gTabBody)
  function plRerender(){
    const scr=document.getElementById('scr-planner');
    if(scr && scr.classList.contains('active')){ const c=document.getElementById('plannerBody'); if(c) renderPlanner(c); return; }
    const c=document.getElementById('gTabBody'); if(c) renderPlanner(c); else renderGoalsTab();
  }

  function renderPlanner(c){
    const p=plData();
    if(window.uiMode==='lite') p.scope='day';
    if(p.scope==='quarter') p.scope='day'; // квартал переїхав у Горизонт (Цілі)
    const periodTasks=p.tasks.filter(t=>t.scope===p.scope);
    const done=periodTasks.filter(t=>t.done).length;
    const pct=periodTasks.length?Math.round(done/periodTasks.length*100):0;
    const titles={day:'Сьогодні',week:'Цей тиждень',month:'Цей місяць'};
    const segs=[['day','День'],['week','Тиждень'],['month','Місяць']];

    let hero;
    if(p.scope==='day'){
      hero=`${plWeekCalHTML()}${plNowCardHTML()}${plRolloverHTML()}`;
    } else {
      hero=`<div class="pl-hero"><div class="pl-hero-row">${plRing(pct,'var(--accent)')}
        <div class="pl-hero-info"><h3>${titles[p.scope]}</h3><p>Прогрес періоду · ${done}/${periodTasks.length}</p>
        <div class="pl-hero-stats"><div class="s"><b>${pct}%</b>готово</div><div class="s"><b>${100-pct}%</b>лишилось</div></div></div></div></div>`;
    }

    let body;
    if(p.scope==='quarter'){
      // цілі кварталу — з реальних goalsData.goals
      if(!goalsData.goals.length){
        body=`<div class="pl-empty">🎯 Ще нема цілей. Додай їх у вкладці «Цілі».</div>`;
      } else {
        body=goalsData.goals.map(gl=>{
          const steps=gl.steps||[]; const sd=steps.filter(s=>s.done).length;
          const gp=steps.length?Math.round(sd/steps.length*100):(gl.progress||0);
          const cc=gl.color||'#5b8def';
          return `<div class="pl-qgoal" style="--gc:${cc}"><div class="pl-qh">
            <div class="pl-qemoji" style="background:${cc}2e">${gl.emoji||'🎯'}</div>
            <h5>${esc(gl.name)}</h5><span class="pl-qpc" style="color:${cc}">${gp}%</span></div>
            <div class="pl-qbar"><i style="width:${gp}%;background:${cc};box-shadow:0 0 10px ${cc}"></i></div>
            <div class="pl-qmeta"><span class="pl-chip">📋 ${sd}/${steps.length} кроків</span></div></div>`;
        }).join('');
      }
      body=`<div class="seclbl">${plIco('goal',13)} Цілі кварталу</div>${body}`;
    } else if(p.scope==='day'){
      body=plMatrixHTML()+plDayHTML()+plQuickAddHTML()+plInboxHTML()+plDaySummaryHTML();
    } else {
      const lbl=p.scope==='week'?'✅ Задачі тижня':'📅 Плани місяця';
      const items=periodTasks.length?periodTasks.map((t)=>plTaskCard(t)).join('')
        :`<div class="pl-empty">Поки порожньо. Додай першу задачу.</div>`;
      const calHtml=p.scope==='month'?(plTemplateListHTML()+plMonthCalHTML()):'';
      body=`${calHtml}<div class="seclbl">${lbl}</div><div class="pl-tasklist">${items}</div>`;
    }

    const addLabel='+ Нова задача';
    const addBtnHtml=p.scope==='day'?'':`<button class="pl-add" data-pladd>${addLabel}</button>`;
    const toplvl=`<div class="pl-toplvl"><button class="on">📅 Плани</button><button data-plhor>🎯 Горизонт</button></div>`;

    c.innerHTML=`
      ${toplvl}
      <div class="pl-seg">${segs.map(([k,l])=>`<button class="${p.scope===k?'on':''}" data-plscope="${k}">${l}</button>`).join('')}</div>
      ${hero}
      ${body}
      ${addBtnHtml}`;

    // bind
    { const hb=c.querySelector('[data-plhor]'); if(hb) hb.onclick=()=>{ try{ goGoals(); }catch(e){ console.error('goHorizon',e); } }; }
    c.querySelectorAll('[data-mxadd]').forEach(el=>el.onclick=()=>{
      const k=el.dataset.mxadd;
      inputModal({title:'У квадрат', placeholder:'Що тримати перед очима?', onOk:(v)=>{
        v=(v||'').trim(); if(!v) return;
        p.matrix[k].push({id:'m_'+Date.now(),t:v,done:false});
        p.collapsed.mx=false; saveGoals(); plRerender();
      }});
    });
    c.querySelectorAll('[data-mxdone]').forEach(el=>el.onclick=()=>{
      const raw=el.dataset.mxdone; const sep=raw.indexOf('|');
      const k=raw.slice(0,sep), id=raw.slice(sep+1);
      const it=(p.matrix[k]||[]).find(x=>x.id===id);
      if(it){ it.done=!it.done; saveGoals(); plRerender(); }
    });
    c.querySelectorAll('[data-mxsch]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const raw=el.dataset.mxsch; const sep=raw.indexOf('|');
      plMxSchedule(raw.slice(0,sep), raw.slice(sep+1));
    });
    { const mc=c.querySelector('[data-mxclear]'); if(mc) mc.onclick=()=>{
      ['q1','q2','q3','q4'].forEach(k=>{ p.matrix[k]=(p.matrix[k]||[]).filter(i=>!i.done); });
      saveGoals(); plRerender();
    }; }
    c.querySelectorAll('[data-plgofolder]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const k=el.dataset.plgofolder;
      if(typeof folders!=='undefined' && folders[k]){ try{ renderFolder(k); show('scr-folder'); }catch(err){ console.error('goFolder',err); } }
    });
    c.querySelectorAll('[data-plcoll]').forEach(el=>el.onclick=()=>{ const k=el.dataset.plcoll; p.collapsed[k]=!p.collapsed[k]; saveGoals(); plRerender(); });
    { const it=c.querySelector('[data-plintask]'); if(it) it.onclick=()=>{
      inputModal({title:'Нова задача', placeholder:'Назва задачі', onOk:(v)=>{
        if(!v) return;
        const cols=['val','hab','fin','skl','cyan','gold'];
        p.tasks.push({id:'t_'+Date.now(), scope:'day', t:v, c:cols[p.tasks.length%cols.length], p:2, tag:'', done:false, open:false, subs:[]});
        p.collapsed.inbox=false;
        saveGoals(); plRerender();
      }});
    }; }
    c.querySelectorAll('[data-plqgoal]').forEach(el=>el.onclick=()=>{ p.scope='quarter'; saveGoals(); plRerender(); });
    { const qa=c.querySelector('[data-plqall]'); if(qa) qa.onclick=()=>{ p.scope='quarter'; saveGoals(); plRerender(); }; }
    c.querySelectorAll('[data-plscope]').forEach(b=>b.onclick=()=>{ p.scope=b.dataset.plscope; saveGoals(); plRerender(); });
    c.querySelectorAll('[data-plslot]').forEach(el=>el.onclick=()=>plSlotTask(el.dataset.plslot));
    c.querySelectorAll('[data-plblkexp]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const id=el.dataset.plblkexp;
      const key='plexp_'+id;
      const cur=sessionStorage.getItem(key)==='1';
      sessionStorage.setItem(key, cur?'0':'1');
      plRerender();
    });
    c.querySelectorAll('[data-plsubck]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const raw=el.dataset.plsubck; const sep=raw.lastIndexOf('_');
      const bid=raw.slice(0,sep); const si=+raw.slice(sep+1);
      const pp=plData(); const selDs=pp.selDate||plTodayStr();
      const list=pp.blocksByDay[selDs]||[];
      const b=list.find(x=>x.id===bid); if(!b) return;
      if(!Array.isArray(b.subtasks)) b.subtasks=[];
      b.subtasks[si].done=!b.subtasks[si].done;
      saveGoals(); plRerender();
    });
    c.querySelectorAll('[data-pladdsub]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const bid=el.dataset.pladdsub;
      inputModal({title:'Підпункт блоку', placeholder:'Що зробити?', onOk:(val)=>{
        const text=(val||'').trim();
        if(!text) return;
        const pp=plData(); const selDs=pp.selDate||plTodayStr();
        // шукаємо в збережених і в матеріалізованих
        let b=(pp.blocksByDay[selDs]||[]).find(x=>x.id===bid);
        if(!b){ plBlocksFor(selDs); b=(pp.blocksByDay[selDs]||[]).find(x=>x.id===bid); }
        if(!b) return;
        if(!Array.isArray(b.subtasks)) b.subtasks=[];
        b.subtasks.push({text,done:false});
        sessionStorage.setItem('plexp_'+bid,'1');
        saveGoals(); plRerender();
      }});
    });
    c.querySelectorAll('[data-plday]').forEach(el=>el.onclick=()=>{ p.selDate=el.dataset.plday; saveGoals(); plRerender(); });
    c.querySelectorAll('[data-plcalday]').forEach(el=>el.onclick=()=>{ p.selDate=el.dataset.plcalday; p.scope='day'; saveGoals(); plRerender(); });
    c.querySelectorAll('[data-pltpltoggle]').forEach(el=>el.onclick=()=>{ plToggleTemplate(el.dataset.pltpltoggle); plRerender(); });
    { const nt=c.querySelector('[data-pltpladd]'); if(nt) nt.onclick=()=>plNewTemplateSheet(); }
    { const cp=c.querySelector('[data-plcalprev]'); if(cp) cp.onclick=(e)=>{ e.stopPropagation(); plShiftCalMonth(-1); plRerender(); }; }
    { const cn=c.querySelector('[data-plcalnext]'); if(cn) cn.onclick=(e)=>{ e.stopPropagation(); plShiftCalMonth(1); plRerender(); }; }
    c.querySelectorAll('[data-pladdh]').forEach(el=>el.onclick=()=>plAddBlockAt(+el.dataset.pladdh));
    c.querySelectorAll('[data-plautoidx]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const idx=+el.dataset.plautoidx;
      const sugg=(plData()._autoSugg||[])[idx];
      if(!sugg) return;
      const ds=p.selDate||plTodayStr();
      const list=plBlocksFor(ds);
      const nb=Object.assign({id:'b_'+Date.now()}, sugg.block, {done:false});
      nb.tag=plLinkTag(nb.link);
      list.push(nb);
      if(nb.fromTask){ const st=p.tasks.find(x=>x.id===nb.fromTask); if(st) st.slotted=true; }
      saveGoals(); plRerender();
      try{ window.platform.haptic('light'); }catch(_){}
      plToast('📅 «'+sugg.t+'» додано в розклад');
    });
    c.querySelectorAll('[data-plcomplete]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); plCompleteBlock(el.dataset.plcomplete); });
    c.querySelectorAll('[data-plmicro]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); plMicroBlock(el.dataset.plmicro); });
    c.querySelectorAll('[data-plblk]').forEach(el=>el.onclick=()=>plEditBlock(el.dataset.plblk));
    { const cd=c.querySelector('[data-plclearday]'); if(cd) cd.onclick=()=>{
      const ds=p.selDate||plTodayStr();
      confirmSheet({title:'Очистити розклад цього дня?', sub:'Блоки часу приберуться. Задачі повернуться в бек-лог.', okLabel:'Очистити', onOk:()=>{
        const list=plBlocksFor(ds);
        list.forEach(b=>{ if(b.fromTask){ const t=p.tasks.find(x=>x.id===b.fromTask); if(t) t.slotted=false; } });
        p.blocksByDay[ds]=[];
        saveGoals(); plRerender();
      }});
    }; }
    { const rg=c.querySelector('[data-plrange]'); if(rg) rg.onclick=()=>plRangeSheet(); }
    { const wb=c.querySelector('[data-plweek]'); if(wb) wb.onclick=()=>{ try{ plWeekReviewSheet(); }catch(e){ console.error('weekReview',e); } }; }
    { const ex=c.querySelector('[data-plexpand]'); if(ex) ex.onclick=()=>{ p._expandHours=!p._expandHours; plRerender(); }; }
    c.querySelectorAll('[data-plcheck]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation();
      const t=p.tasks.find(x=>x.id===el.dataset.plcheck); if(t){ t.done=!t.done; saveGoals(); plRerender(); } });
    c.querySelectorAll('[data-pltoggle]').forEach(el=>el.onclick=()=>{
      const t=p.tasks.find(x=>x.id===el.dataset.pltoggle); if(t){ t.open=!t.open; saveGoals(); plRerender(); } });
    c.querySelectorAll('[data-plsub]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation();
      const [tid,si]=el.dataset.plsub.split('|'); const t=p.tasks.find(x=>x.id===tid);
      if(t&&t.subs&&t.subs[+si]){ t.subs[+si].d=!t.subs[+si].d; saveGoals(); plRerender(); } });
    c.querySelectorAll('[data-pldel]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation();
      p.tasks=p.tasks.filter(x=>x.id!==el.dataset.pldel); saveGoals(); plRerender(); });
    const fb=c.querySelector('[data-plfocus]'); if(fb) fb.onclick=()=>{ try{ window.platform.haptic('medium'); }catch(_){} plStartFocus(); };
    const ab=c.querySelector('[data-pladd]'); if(ab) ab.onclick=()=>plAdd();
    /* ═══ Fusion bindings ═══ */
    { const qb=c.querySelector('[data-plqago]'); const qi=c.querySelector('#plQaIn');
      const go=()=>{ if(!qi) return; const parsed=plParseQuick(qi.value); if(!parsed) return;
        const ds=p.selDate||plTodayStr(); const list=plBlocksFor(ds);
        list.push({id:'b_'+Date.now(), h:parsed.h, endH:parsed.endH, t:parsed.t, c:'val', tag:'', done:false});
        saveGoals(); plRerender();
        try{ window.platform.haptic('light'); }catch(_){}
        plToast('📅 «'+parsed.t+'» · '+plHM(parsed.h)+'–'+plHM(Math.min(parsed.endH,24)));
      };
      if(qb) qb.onclick=go;
      if(qi) qi.onkeydown=(e)=>{ if(e.key==='Enter'){ e.preventDefault(); go(); } };
    }
    { const nd=c.querySelector('[data-plnowdone]'); if(nd) nd.onclick=()=>plCompleteBlock(nd.dataset.plnowdone);
      const nt=c.querySelector('[data-plnowtmr]'); if(nt) nt.onclick=()=>{
        const td=plTodayStr(); const list=plBlocksFor(td);
        const i=list.findIndex(b=>b.id===nt.dataset.plnowtmr); if(i<0) return;
        const b=list.splice(i,1)[0];
        const tm=new Date(); tm.setDate(tm.getDate()+1); const tds=tm.toISOString().slice(0,10);
        plBlocksFor(tds).push(Object.assign({},b,{id:'b_'+Date.now(),done:false,remindAt:null}));
        saveGoals(); plRerender();
        plToast('→ «'+b.t+'» завтра о '+plHM(b.h));
      };
    }
    { const ro=c.querySelector('[data-plrook]'); if(ro) ro.onclick=()=>{
        const td=plTodayStr(); const y=new Date(); y.setDate(y.getDate()-1); const yds=y.toISOString().slice(0,10);
        const yl=Array.isArray(p.blocksByDay[yds])?p.blocksByDay[yds]:[];
        const undone=yl.filter(b=>!b.done && !b.fromRecur && !b.rolled);
        const list=plBlocksFor(td);
        undone.forEach(b=>{ b.rolled=true;
          list.push(Object.assign({},b,{id:'b_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),done:false,rolled:false,remindAt:null})); });
        p.rolloverDismissed=td; saveGoals(); plRerender();
        plToast('→ Перенесено на сьогодні: '+undone.length);
      };
      const rn=c.querySelector('[data-plronope]'); if(rn) rn.onclick=()=>{ p.rolloverDismissed=plTodayStr(); saveGoals(); plRerender(); };
    }
    if(p.scope==='day') plNowTick();
  }

  // ===== Живий Pomodoro =====
  function plFmtMMSS(s){ const m=Math.floor(s/60), ss=s%60; return (m<10?'0':'')+m+':'+(ss<10?'0':'')+ss; }
  function plStartFocus(){
    if(document.querySelector('.pf-ov')) return;
    const total=25*60;
    plFocusState={ sec:total, total, running:true, timerId:null };
    const ov=document.createElement('div'); ov.className='pf-ov';
    ov.innerHTML=`
      <div class="pf-lab">${plIco('focus',14)} Фокус-сесія</div>
      <div class="pf-ring" id="pfRing" style="--p:0%">
        <div class="pf-time" id="pfTime">25:00</div>
        <div class="pf-sub" id="pfSub">до кінця сесії</div>
      </div>
      <div class="pf-stats" id="pfStats"></div>
      <div class="pf-btns">
        <button class="pf-btn" id="pfPause">Пауза</button>
        <button class="pf-btn" id="pfStop">Завершити</button>
      </div>`;
    document.body.appendChild(ov);
    const tEl=ov.querySelector('#pfTime'), ring=ov.querySelector('#pfRing'),
          sub=ov.querySelector('#pfSub'), stats=ov.querySelector('#pfStats'),
          pauseBtn=ov.querySelector('#pfPause'), stopBtn=ov.querySelector('#pfStop');
    const ft=plFocusToday();
    stats.textContent=`Сьогодні: ${ft.sessions} сесій · ${Math.round(ft.seconds/60)} хв фокусу`;
    function paint(){
      tEl.textContent=plFmtMMSS(plFocusState.sec);
      ring.style.setProperty('--p', Math.round((plFocusState.total-plFocusState.sec)/plFocusState.total*100)+'%');
    }
    function tick(){
      if(!plFocusState || !plFocusState.running) return;
      plFocusState.sec--;
      if(plFocusState.sec<=0){
        clearInterval(plFocusState.timerId);
        const f=plFocusToday(); f.sessions++; f.seconds+=plFocusState.total; saveGoals();
        try{ window.platform.haptic('heavy'); }catch(_){}
        tEl.textContent='00:00'; ring.style.setProperty('--p','100%'); sub.textContent='Сесію завершено 🎉';
        stats.textContent=`Сьогодні: ${f.sessions} сесій · ${Math.round(f.seconds/60)} хв фокусу`;
        pauseBtn.style.display='none'; stopBtn.textContent='Готово';
        plFocusState.running=false;
        return;
      }
      paint();
    }
    paint();
    plFocusState.timerId=setInterval(tick,1000);
    pauseBtn.onclick=()=>{
      plFocusState.running=!plFocusState.running;
      pauseBtn.textContent=plFocusState.running?'Пауза':'Продовжити';
      try{ window.platform.haptic('light'); }catch(_){}
    };
    stopBtn.onclick=()=>{
      if(plFocusState && plFocusState.running && plFocusState.sec<plFocusState.total){
        // зарахувати частковий час
        const f=plFocusToday(); f.seconds+=(plFocusState.total-plFocusState.sec); saveGoals();
      }
      if(plFocusState) clearInterval(plFocusState.timerId);
      plFocusState=null; ov.remove();
      try{ plRerender(); }catch(_){}
    };
  }

  // денне зведення: що день дав екосистемі (з завершених блоків)
  /* ═══ Fusion: «Зараз»-картка · швидкий ввід · перекат · стрік ═══ */
  let plNowIv=null;
  function plFmtHMS(sec){ sec=Math.max(0,Math.round(sec)); const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;
    return (h?h+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); }
  function plNowInfo(){
    const p=plData(); const td=plTodayStr();
    if((p.selDate||td)!==td) return {cur:null,next:null,nowDec:0};
    const now=new Date(); const nowDec=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;
    const blocks=plBlocksFor(td).slice().sort((a,b)=>a.h-b.h);
    const cur=blocks.find(b=>!b.done && nowDec>=b.h && nowDec<plBlockEnd(b))||null;
    const next=blocks.find(b=>!b.done && b.h>nowDec)||null;
    return {cur,next,nowDec};
  }
  function plNowCardHTML(){
    const {cur,next,nowDec}=plNowInfo();
    if(cur){
      const end=plBlockEnd(cur); const total=Math.max(1,(end-cur.h)*3600); const left=Math.max(0,(end-nowDec)*3600);
      const pct=Math.min(100,Math.round((1-left/total)*100));
      const cc=plGoalColorFor(cur);
      const tmrBtn=cur.fromRecur?'':`<button class="pl-nowtmr" data-plnowtmr="${cur.id}">→ Завтра</button>`;
      return `<div class="pl-nowcard" style="border-color:${cc}66">
        <div class="nc-eyebrow" style="color:${cc}">● Зараз</div>
        <h3>${esc(cur.t)}</h3>
        <div class="nc-rng">${plHM(cur.h)}–${plHM(Math.min(end,24))}${cur.tag?' · #'+esc(cur.tag):''}${cur.link&&cur.link.goalName?' · 🎯 '+esc(cur.link.goalName):''}</div>
        <div class="pl-nowtimer"><b id="plNowLeft">${plFmtHMS(left)}</b><span>лишилось</span></div>
        <div class="pl-nowbar"><i id="plNowBar" style="width:${pct}%;background:${cc}"></i></div>
        <div class="pl-nowacts"><button class="pl-nowdone" data-plnowdone="${cur.id}">✓ Виконано</button>${tmrBtn}</div>
      </div>`;
    }
    if(next) return `<div class="pl-nownext">⏭ Далі о <b>${plHM(next.h)}</b> · <b>${esc(next.t)}</b></div>`;
    return '';
  }
  function plNowTick(){
    if(plNowIv){ clearInterval(plNowIv); plNowIv=null; }
    if(!document.getElementById('plNowLeft')) return;
    plNowIv=setInterval(()=>{
      const el=document.getElementById('plNowLeft');
      if(!el){ clearInterval(plNowIv); plNowIv=null; return; }
      const {cur,nowDec}=plNowInfo();
      if(!cur){ clearInterval(plNowIv); plNowIv=null; plRerender(); return; }
      const end=plBlockEnd(cur); const total=Math.max(1,(end-cur.h)*3600); const left=Math.max(0,(end-nowDec)*3600);
      el.textContent=plFmtHMS(left);
      const bar=document.getElementById('plNowBar'); if(bar) bar.style.width=Math.min(100,Math.round((1-left/total)*100))+'%';
    },1000);
  }
  function plNowLineHTML(){ const n=new Date();
    return `<div class="pl-nowline"><em>${('0'+n.getHours()).slice(-2)}:${('0'+n.getMinutes()).slice(-2)}</em></div>`; }
  function plQuickAddHTML(){
    const p=plData(); const ds=p.selDate||plTodayStr();
    let hasBlocks=false; try{ hasBlocks=(plBlocksFor(ds)||[]).length>0; }catch(_){}
    const hint=hasBlocks?'':`<div class="pl-qhint">Пиши природно з часом — блок сам стане на місце. Без часу — на першу вільну годину.</div>`;
    return `<div class="pl-qadd" style="margin-top:12px"><input id="plQaIn" placeholder="Спорт 18-19 · Англ 20:00 45хв" enterkeyhint="done"><button data-plqago>＋</button></div>${hint}`;
  }
  function plParseQuick(text){
    let t=String(text||'').trim(); if(!t) return null;
    const p=plData(); let h=null,endH=null;
    let m=t.match(/(\d{1,2})(?::(\d{2}))?\s*[-–—]\s*(\d{1,2})(?::(\d{2}))?/);
    if(m){ h=(+m[1])+((+m[2]||0)/60); endH=(+m[3])+((+m[4]||0)/60); t=t.replace(m[0],' '); if(endH<=h) endH+=24; }
    else{
      m=t.match(/(?:^|\s)(?:о|в|o)?\s*(\d{1,2}):(\d{2})/);
      if(m){ h=(+m[1])+(+m[2])/60; t=t.replace(m[0],' '); }
      else{ m=t.match(/(?:^|\s)(?:о|в)\s+(\d{1,2})(?!\d)/); if(m){ h=+m[1]; t=t.replace(m[0],' '); } }
      let dur=1;
      const dm=t.match(/(\d+)\s*хв/); const dh=t.match(/(\d+(?:[.,]\d+)?)\s*год/);
      if(dm){ dur=Math.max(5,+dm[1])/60; t=t.replace(dm[0],' '); }
      else if(dh){ dur=Math.max(.25,parseFloat(dh[1].replace(',','.'))); t=t.replace(dh[0],' '); }
      if(h===null){ // перша вільна година дня
        const ds=p.selDate||plTodayStr(); const blocks=plBlocksFor(ds).slice().sort((a,b)=>a.h-b.h);
        h=p.dayStart;
        for(const b of blocks){ if(h+dur<=b.h) break; h=Math.max(h,plBlockEnd(b)); }
        if(h>=p.dayEnd) h=p.dayStart;
      }
      endH=h+dur;
    }
    h=Math.max(0,Math.min(23.98,h)); if(endH>30) endH=30; if(endH<=h) endH=h+1;
    const name=t.replace(/\s{2,}/g,' ').trim()||'Блок';
    return {t:name,h,endH};
  }
  /* ── Тижневий огляд: петля зворотного зв'язку ── */
  function plWeekStats(days){
    const p=plData(); const out=[];
    for(let i=days-1;i>=0;i--){
      const d=new Date(); d.setDate(d.getDate()-i);
      const ds=d.toISOString().slice(0,10);
      const list=Array.isArray(p.blocksByDay[ds])?p.blocksByDay[ds]:[];
      out.push({ ds, dow:d.getDay(), total:list.length,
        done:list.filter(b=>b.done).length,
        micro:list.filter(b=>b.done&&b.micro).length,
        missTitles:list.filter(b=>!b.done).map(b=>b.t||'').filter(Boolean) });
    }
    return out;
  }
  function plWeekReviewSheet(){
    const td=plTodayStr();
    const wk=plWeekStats(7);
    const doneT=wk.reduce((s,d)=>s+d.done,0), totT=wk.reduce((s,d)=>s+d.total,0);
    const microT=wk.reduce((s,d)=>s+d.micro,0);
    // патерни за 21 день (без сьогодні — день ще не закінчився)
    const st21=plWeekStats(21).filter(d=>d.ds<td);
    const byTitle={}, byDow=[0,0,0,0,0,0,0];
    st21.forEach(d=>{ d.missTitles.forEach(t=>{ byTitle[t]=(byTitle[t]||0)+1; byDow[d.dow]++; }); });
    const topMiss=Object.entries(byTitle).sort((a,b)=>b[1]-a[1])[0];
    let worstDow=-1, worstN=0; byDow.forEach((n,i)=>{ if(n>worstN){ worstN=n; worstDow=i; } });
    const DN=['неділя','понеділок','вівторок','середа','четвер','пʼятниця','субота'];
    const DS=['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
    let insight;
    if(topMiss && topMiss[1]>=2 && worstDow>=0){
      insight=`<b>Патерн:</b> найчастіше зривається «${esc(topMiss[0])}» (${topMiss[1]}× за 3 тижні), найслабший день — ${DN[worstDow]}. `
        +`Спробуй перенести цей блок на інший день, поставити раніше або зменшити до 30 хв — краще стабільно мало, ніж ідеально ніколи.`;
    } else if(totT>0 && doneT>0 && wk.filter(d=>d.total>0&&!d.done).length===0){
      insight=`<b>Жодного нульового дня за тиждень.</b> Система тримається${microT>0?` — ⚡ мікроблоки врятували ${microT} `+(microT===1?'день':'дні'):''}. Можна обережно піднімати планку.`;
    } else {
      insight=`Поки мало даних для патернів. Виконуй блоки — за тиждень тут з'явиться, що саме зривається і коли.`;
    }
    const cells=wk.map(d=>{
      let cls='', ch='—';
      if(d.done>0){ if(d.micro>0 && d.done===d.micro){ cls='m'; ch='⚡'; } else { cls='f'; ch='✓'; } }
      else if(d.total>0){ ch='·'; }
      if(d.ds===td && d.done===0) ch=d.total>0?'…':'—';
      return `<div><div class="wk-cell ${cls}">${ch}</div><span>${DS[d.dow]}</span></div>`;
    }).join('');
    const stk=plStreak();
    const ov=document.createElement('div'); ov.className='ai-ov'; ov.id='wkOv';
    ov.innerHTML=`<div class="ai-sheet">
      <h3>📈 Тиждень</h3>
      <div class="sub">✓ день з виконаним блоком · ⚡ врятовано мікроблоком · «·» заплановано, але нуль</div>
      <div class="wk-grid">${cells}</div>
      <div class="wk-stats">
        <div class="wk-stat"><b>${doneT}/${totT}</b><span>блоків виконано</span></div>
        <div class="wk-stat"><b>🔥 ${stk}</b><span>стрік днів</span></div>
        <div class="wk-stat"><b>⚡ ${microT}</b><span>мікро-порятунків</span></div>
      </div>
      <div class="wk-insight">${insight}</div>
      <div id="wkAiOut"></div>
      <div class="ai-actions">
        <button class="sec" data-wkai>🤖 Огляд тренера</button>
        <button class="ghost" data-wkclose>Закрити</button>
      </div></div>`;
    ov.addEventListener('click',e=>{ if(e.target===ov) ov.remove(); });
    document.body.appendChild(ov);
    ov.querySelector('[data-wkclose]').onclick=()=>ov.remove();
    ov.querySelector('[data-wkai]').onclick=()=>{
      plWeekAI({wk, doneT, totT, microT, stk, topMiss, worstDow:worstDow>=0?DN[worstDow]:''});
    };
  }
  async function plWeekAI(d){
    const out=document.getElementById('wkAiOut'); if(!out) return;
    out.innerHTML=`<div class="ai-load"><div class="orb"></div>Тренер дивиться твій тиждень…</div>`;
    try{
      const g=goalsData;
      const sys='Ти — тренер застосунку Frequency. Дай короткий чесний огляд тижня українською: '
        +'2-3 речення про те, що реально відбувається (без лестощів і без моралі), і ОДНУ конкретну пропозицію зміни на наступний тиждень. '
        +'Людина рухається з Точки А в Точку Б. Відповідай простим текстом, без markdown, без списків.';
      const usr='Точка Б: '+(g.pointB||'—')
        +'\nТиждень: виконано '+d.doneT+' з '+d.totT+' блоків, стрік '+d.stk+' днів, мікро-порятунків '+d.microT
        +(d.topMiss?('\nНайчастіше зривається: «'+d.topMiss[0]+'» ('+d.topMiss[1]+'× за 3 тижні)'):'')
        +(d.worstDow?('\nНайслабший день: '+d.worstDow):'')
        +'\nПо днях (done/total): '+d.wk.map(x=>x.ds.slice(5)+' '+x.done+'/'+x.total).join(', ');
      const res=await fetch(aiEndpoint(),{ method:'POST', headers:{'content-type':'application/json'},
        body:JSON.stringify({ system:sys, messages:[{role:'user',content:usr}] }) });
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data=await res.json();
      let txt='';
      if(Array.isArray(data.content)) txt=data.content.filter(x=>x&&x.type==='text').map(x=>x.text).join('\n');
      out.innerHTML=`<div class="wk-insight"><b>🤖 Тренер:</b> ${esc(txt.trim()||'…')}</div>`;
    }catch(e){
      console.error('plWeekAI',e);
      out.innerHTML=`<div class="wk-insight">⚠️ Не вдалось отримати огляд: ${esc(String(e.message||e))}</div>`;
    }
  }
