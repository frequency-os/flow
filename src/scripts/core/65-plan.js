  /* ═══════════ «План» (65-plan.js, 19.11.2026) ═══════════
     Новий екран планування замість старого Планера. Зверху період День · Тиждень · Місяць · Рік,
     на Дні — вигляд Головне · Години · Квадрат, внизу — поле Флоу. Вибраний дизайн «Два ряди»,
     світла тема — «Ранкове скло», темна — «Нічне скло» (42-plan.css).
     ДАНІ НЕ НОВІ: усе читається з plData() (10-planner.js) — tasks, blocksByDay, matrix.
     Нові необовʼязкові поля: star (у Головному), q (клітинка квадрата 1–4), folder у справ без часу.
     Нема поля — означає «не вибрано», тож старі записи працюють без міграції. Пишемо лише після дії людини. */
  const PN_TXT={
    uk:{day:'День',week:'Тиждень',month:'Місяць',year:'Рік',main:'Головне',hours:'Години',quad:'Квадрат',
      today:'Сьогодні',top:'Головне сьогодні',topDay:'Головне',rest:'Решта',noTop:'Познач до трьох головних справ — торкнись ☆ біля справи.',
      suggest:'Пропоную',empty:'На цей день справ нема.',add:'Нова справа…',free:'Не розписано',freeNone:'Усе розписано по годинах.',
      tapHour:'Торкнись години, щоб додати справу',q1:'Зараз',q2:'Запланувати',q3:'Делегувати',q4:'Відпустити',
      q1s:'важливо · терміново',q2s:'важливо · не горить',q3s:'терміново · не важливо',q4s:'можна не робити',
      unsorted:'Не розібрано',unsortedHint:'торкнись справи, щоб покласти в квадрат',weekTasks:'Справи тижня',days:'Дні',
      daysHint:'торкнись дня',monthDone:'Зроблено за місяць',yearSoon:'План року',yearSoonTx:'Тут буде все розписано: Точка Б, цілі року і місяці. Робимо окремим кроком.',
      flow:'Скажи Флоу…',flowDay:'Розпиши мені день',flowQuad:'Розклади мої справи по квадратах',flowWeek:'Сплануй мені тиждень',flowMonth:'Що головне цього місяця?',
      starOn:'У головне',starOff:'Прибрати з головного',starMax:'Головних уже три — спершу прибери одну',putQ:'Покласти в квадрат',qNone:'Прибрати з квадрата',
      folder:'Папка',noFolder:'Без папки',toHour:'Поставити на час',details:'Час і деталі',del:'Видалити',deleted:'Справу видалено',
      old:'зі старого квадрата',of:'з',wk:'Тиждень',from:'з',move:'Перенести на інший день',moveQ:'На який день?'},
    en:{day:'Day',week:'Week',month:'Month',year:'Year',main:'Focus',hours:'Hours',quad:'Matrix',
      today:'Today',top:'Today’s focus',topDay:'Focus',rest:'Everything else',noTop:'Mark up to three key tasks — tap ☆ next to a task.',
      suggest:'Suggested',empty:'Nothing planned for this day.',add:'New task…',free:'Not scheduled',freeNone:'Everything has a time.',
      tapHour:'Tap an hour to add a task',q1:'Do now',q2:'Schedule',q3:'Delegate',q4:'Let go',
      q1s:'important · urgent',q2s:'important · not urgent',q3s:'urgent · not important',q4s:'can skip',
      unsorted:'Not sorted',unsortedHint:'tap a task to place it',weekTasks:'This week',days:'Days',
      daysHint:'tap a day',monthDone:'Done this month',yearSoon:'Year plan',yearSoonTx:'Your point B, yearly goals and months will live here. Coming as a separate step.',
      flow:'Ask Flow…',flowDay:'Plan my day',flowQuad:'Sort my tasks into the matrix',flowWeek:'Plan my week',flowMonth:'What matters most this month?',
      starOn:'Add to focus',starOff:'Remove from focus',starMax:'You already have three — remove one first',putQ:'Put in the matrix',qNone:'Remove from matrix',
      folder:'Folder',noFolder:'No folder',toHour:'Give it a time',details:'Time and details',del:'Delete',deleted:'Task deleted',
      old:'from the old matrix',of:'of',wk:'Week',from:'since',move:'Move to another day',moveQ:'Which day?'}
  };
  const PN_DOW={uk:['Пн','Вт','Ср','Чт','Пт','Сб','Нд'],en:['Mo','Tu','We','Th','Fr','Sa','Su']};
  const PN_DOWL={uk:['Понеділок','Вівторок','Середа','Четвер','Пʼятниця','Субота','Неділя'],en:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']};
  const PN_MON={uk:['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'],
    en:['January','February','March','April','May','June','July','August','September','October','November','December']};
  const PN_MONG={uk:['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'],en:PN_MON.en};
  const PN_QC={1:'#ff453a',2:'#30c48d',3:'#ff9f0a',4:'#8e8e93'};
  const PN_FC=['#ff6b5a','#34c77b','#f0b429','#5b8def','#c77dff','#2fb6c4','#ff6b9d'];
  const PN_ICO={
    star:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>',
    starF:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>',
    grid:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>',
    folder:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 7l2-3h5l2 3h9v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>',
    clock:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    cal:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    trash:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    tick:'<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.3l2.3 2.3 4.7-5"/></svg>',
    spark:'<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/></svg>',
    mic:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
    prev:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>',
    next:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg>'
  };
  function pnLang(){ try{ return (window.flowLang&&window.flowLang())==='en'?'en':'uk'; }catch(_){ return 'uk'; } }
  function pnT(k){ const L=PN_TXT[pnLang()]; return (L&&L[k]!=null)?L[k]:PN_TXT.uk[k]; }

  // стан екрана — лише цього пристрою (який період і вигляд відкрито), у дані не пишеться
  let pnPer='day', pnView='main', pnDs='', pnYm='';
  try{ const u=JSON.parse(localStorage.getItem('pn_ui')||'{}');
    if(['day','week','month','year'].includes(u.per)) pnPer=u.per;
    if(['main','hours','quad'].includes(u.view)) pnView=u.view; }catch(_){}
  function pnRemember(){ try{ localStorage.setItem('pn_ui',JSON.stringify({per:pnPer,view:pnView})); }catch(_){} }

  function pnToday(){ return ymdLocal(); }
  function pnDay(){ return pnDs||pnToday(); }
  function pnAdd(ds,n){ const d=new Date(ds+'T12:00:00'); d.setDate(d.getDate()+n); return ymdLocal(d); }
  function pnMon(ds){ const d=new Date(ds+'T12:00:00'); return pnAdd(ds,-((d.getDay()+6)%7)); }
  function pnDowI(ds){ return (new Date(ds+'T12:00:00').getDay()+6)%7; }
  function pnHM(h){ const m=Math.round((+h||0)*60); return Math.floor(m/60)%24+':'+String(m%60).padStart(2,'0'); }
  function pnEnd(b){ return (typeof plBlockEnd==='function')?plBlockEnd(b):((+b.h||0)+1); }
  // блоки дня лише для читання (без створення порожнього масиву в даних) — для тижня, місяця, року
  function pnRaw(ds){ const p=plData(); const L=p.blocksByDay&&p.blocksByDay[ds]; return Array.isArray(L)?L.filter(Boolean):[]; }

  function pnFolder(k){ try{ return (k&&typeof folders!=='undefined'&&folders[k])?folders[k]:null; }catch(_){ return null; } }
  function pnFolderColor(k){
    const f=pnFolder(k); if(!f) return '';
    if(f.color&&typeof safeColor==='function'){ const c=safeColor(f.color,''); if(c) return c; }
    let h=0; String(k).split('').forEach(ch=>{ h=(h*31+ch.charCodeAt(0))|0; }); return PN_FC[Math.abs(h)%PN_FC.length];
  }

  /* Усі справи дня одним списком: блоки з часом + (лише сьогодні) справи без часу.
     kind 'b' — блок з blocksByDay, 't' — справа з tasks (scope 'day', ще не поставлена на час). */
  /* Етап 3 (19.11.2026): у справи без часу є необовʼязкова дата t.date.
     Нема дати — «на сьогодні», як було (старі справи не чіпаємо). Невиконана з минулого дня
     показується на сьогодні з позначкою «з …» — лише показ, дата в даних лишається. */
  function pnTaskDate(t){ return t&&/^\d{4}-\d{2}-\d{2}$/.test(t.date||'')?t.date:''; }
  function pnTaskOn(t,ds){
    if(!t||t.scope!=='day'||t.slotted) return null;
    const d=pnTaskDate(t), td=pnToday();
    if(d===ds) return {from:''};
    if(ds===td&&!d) return {from:''};
    if(ds===td&&d&&d<td&&!t.done) return {from:d};
    return null;
  }
  function pnItems(ds){
    const p=plData(), out=[];
    plBlocksFor(ds).forEach(b=>{ if(b) out.push({kind:'b',ref:b,id:String(b.id),t:b.t||'',done:!!b.done,folder:b.folder||'',h:+b.h||0,end:pnEnd(b)}); });
    (p.tasks||[]).forEach(t=>{ const on=pnTaskOn(t,ds); if(on) out.push({kind:'t',ref:t,id:String(t.id),t:t.t||'',done:!!t.done,folder:t.folder||'',h:null,prio:+t.p||2,from:on.from}); });
    return out;
  }
  // лише читання (Тиждень, Місяць, Рік): блоки дня без створення масиву + справи з цією датою
  function pnDayRead(ds){
    if(ds===pnToday()) return pnItems(ds);
    const out=pnRaw(ds).map(b=>({done:!!b.done,folder:b.folder||''}));
    (plData().tasks||[]).forEach(t=>{ if(pnTaskOn(t,ds)) out.push({done:!!t.done,folder:t.folder||''}); });
    return out;
  }
  function pnFind(ds,kind,id){ return pnItems(ds).find(x=>x.kind===kind&&x.id===String(id)); }

  function pnChip(it){
    const f=pnFolder(it.folder); if(!f) return '';
    return `<button class="pn-fchip" style="--fc:${pnFolderColor(it.folder)}" data-pnfold="${esc(it.folder)}">${esc(f.name||pnT('folder'))}</button>`;
  }
  function pnCheck(it){ return `<button class="pn-chk" data-pnchk="${it.kind}:${esc(it.id)}" aria-pressed="${it.done}" aria-label="${esc(it.t)}"><i>${PN_ICO.tick}</i></button>`; }
  function pnStarBtn(it){ return `<button class="pn-star${it.ref.star?' on':''}" data-pnstar="${it.kind}:${esc(it.id)}" aria-label="${esc(it.ref.star?pnT('starOff'):pnT('starOn'))}">${it.ref.star?PN_ICO.starF:PN_ICO.star}</button>`; }
  function pnMeta(it){
    const tm=it.h!=null?`<span>${pnHM(it.h)}–${pnHM(Math.min(it.end,24))}</span>`:'';
    const fr=it.from?`<span class="pn-from">${esc(pnT('from'))} ${esc(pnShort(it.from))}</span>`:'';
    const ch=pnChip(it); return (ch||tm||fr)?`<span class="pn-meta">${ch}${tm}${fr}</span>`:'';
  }
  function pnRow(it,big){
    return `<div class="pn-row${big?' pn-big pn-glass':''}${it.done?' done':''}">${pnCheck(it)}
      <div class="pn-tx"><button class="pn-tl" data-pnopen="${it.kind}:${esc(it.id)}"><span class="pn-t">${esc(it.t)}</span></button>${pnMeta(it)}</div>${pnStarBtn(it)}</div>`;
    // назва і мітка папки — дві окремі кнопки: кнопка в кнопці недопустима, браузер виносив мітку з назви в рядок
  }

  /* ─── День ─── */
  function pnMainHTML(ds){
    const all=pnItems(ds).sort((a,b)=>(a.h==null?99:a.h)-(b.h==null?99:b.h));
    if(!all.length) return `<div class="pn-empty pn-glass">${esc(pnT('empty'))}</div>${pnAddHTML(ds)}`;
    const top=all.filter(x=>x.ref.star).slice(0,3);
    let html=`<div class="pn-lbl"><span>${esc(ds===pnToday()?pnT('top'):pnT('topDay'))}</span><span>${top.filter(x=>x.done).length}/${top.length||0}</span></div>`;
    if(top.length) html+=`<div class="pn-hero">${top.map(x=>pnRow(x,true)).join('')}</div>`;
    else {
      const sug=all.filter(x=>!x.done&&x.prio===1).slice(0,3);
      html+=`<div class="pn-hint pn-glass">${esc(pnT('noTop'))}</div>`;
      if(sug.length) html+=`<div class="pn-lbl"><span>${esc(pnT('suggest'))}</span></div><div class="pn-hero">${sug.map(x=>pnRow(x,true)).join('')}</div>`;
    }
    const rest=all.filter(x=>!x.ref.star);
    if(rest.length) html+=`<div class="pn-lbl"><span>${esc(pnT('rest'))}</span><span>${rest.length}</span></div><div class="pn-list pn-glass">${rest.map(x=>pnRow(x,false)).join('')}</div>`;
    return html+pnAddHTML(ds);
  }
  function pnShort(ds){ const d=new Date(ds+'T12:00:00'), L=pnLang(); return L==='en'?PN_MON.en[d.getMonth()].slice(0,3)+' '+d.getDate():d.getDate()+' '+PN_MONG.uk[d.getMonth()].slice(0,4)+'.'; }
  function pnAddHTML(ds){
    return `<div class="pn-add pn-glass"><span>＋</span><input id="pnAddIn" type="text" enterkeyhint="done" maxlength="200" placeholder="${esc(pnT('add'))}" aria-label="${esc(pnT('add'))}"></div>`;
  }
  function pnHoursHTML(ds){
    const p=plData(), its=pnItems(ds), free=its.filter(x=>x.kind==='t'&&!x.done), timed=its.filter(x=>x.kind==='b');
    let S=Math.max(0,Math.min(7,...timed.map(b=>Math.floor(b.h)))), E=Math.min(24,Math.max(22,...timed.map(b=>Math.ceil(b.end))));
    if(p.dayEnd>0&&p.dayEnd<=24&&p.dayEnd>E) E=p.dayEnd;
    const H=48;
    let html=`<div class="pn-lbl"><span>${esc(pnT('free'))}</span><span>${free.length}</span></div>`;
    html+=free.length?`<div class="pn-tray">${free.map(x=>`<button class="pn-glass" style="--fc:${pnFolderColor(x.folder)||'var(--pn-tx3)'}" data-pnopen="t:${esc(x.id)}">${esc(x.t)}</button>`).join('')}</div>`
      :`<div class="pn-note">${esc(pnT('freeNone'))}</div>`;
    let hrs=''; for(let h=S;h<E;h++) hrs+=`<button class="pn-hr" data-pnhour="${h}" aria-label="${pnHM(h)}"><span>${String(h).padStart(2,'0')}</span></button>`;
    const blk=timed.map(b=>{ const c=pnFolderColor(b.folder)||'var(--pn-acc)';
      const top=(b.h-S)*H+2, ht=Math.max(26,(Math.min(b.end,E)-b.h)*H-4);
      return `<div class="pn-blk${b.done?' done':''}" style="top:${top}px;height:${ht}px;--fc:${c}">${pnCheck(b)}<button class="pn-tx" data-pnopen="b:${esc(b.id)}"><span class="pn-t">${esc(b.t)}</span><small>${pnHM(b.h)}–${pnHM(Math.min(b.end,24))}</small></button></div>`; }).join('');
    let now=''; if(ds===pnToday()){ const d=new Date(), h=d.getHours()+d.getMinutes()/60; if(h>=S&&h<=E) now=`<div class="pn-now" style="top:${(h-S)*H}px"></div>`; }
    return html+`<div class="pn-lbl"><span>${esc(pnT('hours'))}</span><span class="pn-sm">${esc(pnT('tapHour'))}</span></div><div class="pn-tl" style="height:${(E-S)*H}px" data-pnstart="${S}">${hrs}${blk}${now}</div>`;
  }
  function pnQuadHTML(ds){
    const p=plData(), its=pnItems(ds);
    const cells=[1,2,3,4].map(k=>{
      const mine=its.filter(x=>+x.ref.q===k), old=((p.matrix&&p.matrix['q'+k])||[]).filter(Boolean);
      const n=mine.length+old.filter(o=>!o.done).length;
      return `<div class="pn-q pn-glass" style="--qc:${PN_QC[k]}"><h4>${esc(pnT('q'+k))}<i>${n}</i></h4><p>${esc(pnT('q'+k+'s'))}</p>
        ${mine.map(x=>`<button class="pn-it${x.done?' done':''}" data-pnopen="${x.kind}:${esc(x.id)}">${esc(x.t)}</button>`).join('')}
        ${old.map(o=>`<button class="pn-it old${o.done?' done':''}" data-pnmx="q${k}:${esc(o.id)}" title="${esc(pnT('old'))}">${esc(o.t||'')}</button>`).join('')}</div>`;
    }).join('');
    const un=its.filter(x=>!x.done&&!(+x.ref.q>=1&&+x.ref.q<=4));
    return `<div class="pn-quad">${cells}</div>`+(un.length?`<div class="pn-lbl"><span>${esc(pnT('unsorted'))}</span><span>${un.length}</span></div><div class="pn-note">${esc(pnT('unsortedHint'))}</div>
      <div class="pn-list pn-glass">${un.map(x=>pnRow(x,false)).join('')}</div>`:'');
  }

  /* ─── Тиждень · Місяць · Рік ─── */
  function pnWeekHTML(){
    const p=plData(), mon=pnMon(pnDay()), td=pnToday(), L=pnLang();
    const wt=(p.tasks||[]).filter(t=>t&&t.scope==='week'&&!t.slotted);
    let html='';
    if(wt.length) html+=`<div class="pn-lbl"><span>${esc(pnT('weekTasks'))}</span><span>${wt.filter(t=>t.done).length}/${wt.length}</span></div>
      <div class="pn-list pn-glass">${wt.map(t=>{ const it={kind:'w',ref:t,id:String(t.id),t:t.t||'',done:!!t.done,folder:t.folder||'',h:null};
        return `<div class="pn-row${it.done?' done':''}">${pnCheck(it)}<span class="pn-tx"><span class="pn-t">${esc(it.t)}</span>${pnMeta(it)}</span></div>`; }).join('')}</div>`;
    const rows=[0,1,2,3,4,5,6].map(i=>{
      const ds=pnAdd(mon,i), bl=pnDayRead(ds);
      const dn=bl.filter(b=>b.done).length;
      const bars=bl.slice(0,12).map(b=>`<i style="background:${pnFolderColor(b.folder)||'var(--pn-acc)'};opacity:${b.done?1:.4}"></i>`).join('');
      return `<button class="pn-wd${ds===td?' today':''}" data-pngo="${ds}"><span class="pn-dn">${PN_DOW[L][i]}<b>${+ds.slice(8)}</b></span><span class="pn-bars">${bars}</span><span class="pn-ct">${bl.length?dn+'/'+bl.length:'—'}</span></button>`;
    }).join('');
    return html+`<div class="pn-lbl"><span>${esc(pnT('days'))}</span><span class="pn-sm">${esc(pnT('daysHint'))}</span></div><div class="pn-list pn-glass">${rows}</div>`;
  }
  function pnMonthHTML(){
    const ym=pnYm||pnToday().slice(0,7), y=+ym.slice(0,4), m=+ym.slice(5,7), L=pnLang(), td=pnToday();
    const first=ym+'-01', lead=pnDowI(first), days=new Date(y,m,0).getDate();
    let cells='', all=0, done=0;
    for(let i=0;i<lead;i++) cells+='<span></span>';
    for(let d=1;d<=days;d++){
      const ds=ym+'-'+String(d).padStart(2,'0'), bl=pnDayRead(ds);
      all+=bl.length; done+=bl.filter(b=>b.done).length;
      const dots=bl.slice(0,3).map(b=>`<i style="background:${pnFolderColor(b.folder)||'var(--pn-acc)'}"></i>`).join('');
      cells+=`<button class="${ds===td?'td':''}" data-pngo="${ds}"><span>${d}</span><em>${dots}</em></button>`;
    }
    return `<div class="pn-cal pn-glass"><div class="pn-calh">${PN_DOW[L].map(d=>`<span>${d}</span>`).join('')}</div><div class="pn-calg">${cells}</div></div>
      <div class="pn-lbl"><span>${esc(pnT('monthDone'))}</span><span>${done} ${esc(pnT('of'))} ${all}</span></div>
      <div class="pn-bar pn-glass"><i style="width:${all?Math.round(done/all*100):0}%"></i></div>`;
  }
  function pnYearHTML(){
    const p=plData(), y=+(pnYm||pnToday()).slice(0,4), cur=pnToday().slice(0,7), L=pnLang();
    const stat={}, add=(k,done)=>{ stat[k]=stat[k]||[0,0]; if(done) stat[k][0]++; stat[k][1]++; };
    Object.keys(p.blocksByDay||{}).forEach(ds=>{ if(ds.slice(0,4)!==String(y)) return; pnRaw(ds).forEach(b=>add(ds.slice(0,7),!!b.done)); });
    (p.tasks||[]).forEach(t=>{ const d=pnTaskDate(t); if(t&&t.scope==='day'&&!t.slotted&&d.slice(0,4)===String(y)) add(d.slice(0,7),!!t.done); });
    const tiles=PN_MON[L].map((nm,i)=>{ const k=y+'-'+String(i+1).padStart(2,'0'), s=stat[k]||[0,0];
      return `<button class="pn-glass${k===cur?' on':''}" data-pnym="${k}"><span>${esc(nm.slice(0,3))}</span><span class="pn-yb"><i style="width:${s[1]?Math.round(s[0]/s[1]*100):0}%"></i></span><small>${s[1]?s[0]+'/'+s[1]:''}</small></button>`; }).join('');
    return `<div class="pn-yr">${tiles}</div><div class="pn-soon pn-glass"><b>${esc(pnT('yearSoon'))}</b>${esc(pnT('yearSoonTx'))}</div>`;
  }

  /* ─── Шапка і каркас ─── */
  function pnRing(ds){
    const its=pnItems(ds), d=its.filter(x=>x.done).length, n=its.length, C=2*Math.PI*16;
    return `<div class="pn-ring" aria-label="${d}/${n}"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/><circle class="pn-ring-v" cx="20" cy="20" r="16" stroke-dasharray="${C}" stroke-dashoffset="${n?C*(1-d/n):C}"/></svg><i>${d}/${n}</i></div>`;
  }
  function pnHead(){
    const L=pnLang(), ds=pnDay();
    if(pnPer==='day'){ const d=new Date(ds+'T12:00:00');
      return [ds===pnToday()?pnT('today')+' · '+PN_DOWL[L][pnDowI(ds)]:PN_DOWL[L][pnDowI(ds)], L==='en'?PN_MON.en[d.getMonth()]+' '+d.getDate():d.getDate()+' '+PN_MONG.uk[d.getMonth()]]; }
    if(pnPer==='week'){ const mon=pnMon(ds), sun=pnAdd(mon,6), a=new Date(mon+'T12:00:00'), b=new Date(sun+'T12:00:00');
      const mn=L==='en'?PN_MON.en:PN_MONG.uk;
      return [pnT('wk'), a.getMonth()===b.getMonth()?a.getDate()+'–'+b.getDate()+' '+mn[b.getMonth()]:a.getDate()+' '+mn[a.getMonth()]+' – '+b.getDate()+' '+mn[b.getMonth()]]; }
    const ym=pnYm||pnToday().slice(0,7);
    if(pnPer==='month') return [ym.slice(0,4), PN_MON[L][+ym.slice(5,7)-1]];
    return [pnT('yearSoon'), ym.slice(0,4)];
  }
  function pnStrip(){
    const ds=pnDay(), mon=pnMon(ds), td=pnToday(), L=pnLang();
    return `<div class="pn-strip"><button class="pn-nav" data-pnstep="-7" aria-label="‹">${PN_ICO.prev}</button>${[0,1,2,3,4,5,6].map(i=>{ const d=pnAdd(mon,i);
      return `<button class="${d===ds?'on':''}${d===td?' td':''}" data-pngo="${d}">${PN_DOW[L][i]}<b>${+d.slice(8)}</b></button>`; }).join('')}<button class="pn-nav" data-pnstep="7" aria-label="›">${PN_ICO.next}</button></div>`;
  }
  function pnFlowHint(){
    if(pnPer==='week') return pnT('flowWeek'); if(pnPer==='month'||pnPer==='year') return pnT('flowMonth');
    return pnView==='hours'?pnT('flowDay'):pnView==='quad'?pnT('flowQuad'):'';
  }
  function pnRender(){
    const box=document.getElementById('pnBody'); if(!box) return;
    const [sm,bg]=pnHead();
    const per=[['day','day'],['week','week'],['month','month'],['year','year']].map(([k])=>`<button class="${pnPer===k?'on':''}" data-pnper="${k}" aria-pressed="${pnPer===k}">${esc(pnT(k))}</button>`).join('');
    const views=['main','hours','quad'].map(k=>`<button class="${pnView===k?'on':''}" data-pnview="${k}" aria-pressed="${pnView===k}">${esc(pnT(k))}</button>`).join('');
    const nav=(pnPer==='month'||pnPer==='year')?`<div class="pn-mnav"><button data-pnmstep="-1" aria-label="‹">${PN_ICO.prev}</button><button data-pnmstep="1" aria-label="›">${PN_ICO.next}</button></div>`:'';
    let body='';
    try{
      if(pnPer==='day') body=pnView==='hours'?pnHoursHTML(pnDay()):pnView==='quad'?pnQuadHTML(pnDay()):pnMainHTML(pnDay());
      else if(pnPer==='week') body=pnWeekHTML(); else if(pnPer==='month') body=pnMonthHTML(); else body=pnYearHTML();
    }catch(e){ console.error('pnRender',e); body=''; }
    const hint=pnFlowHint();
    box.innerHTML=`<div class="pn-seg pn-glass" role="group">${per}</div>
      <div class="pn-top"><div><small>${esc(sm)}</small><strong>${esc(bg)}</strong></div>${pnPer==='day'?pnRing(pnDay()):nav}</div>
      ${pnPer==='day'?pnStrip()+`<div class="pn-chips" role="group">${views}</div>`:''}
      ${body}<div class="pn-pad"></div>`;
    // поле Флоу живе в body, а не в екрані: у .screen є анімація з transform, і position:fixed рахувався б від екрана
    let fb=document.getElementById('pnFlow');
    if(!fb){ fb=document.createElement('button'); fb.id='pnFlow'; fb.className='pn-flow pn-glass'; fb.type='button'; document.body.appendChild(fb); fb.onclick=pnFlowOpen; }
    fb.innerHTML=`<span class="pn-sp">${PN_ICO.spark}</span><em>${esc(hint?'«'+hint+'»':pnT('flow'))}</em>${PN_ICO.mic}`;
    pnBind(box);
  }

  /* ─── Дії ─── */
  function pnSave(){ try{ saveGoals(); }catch(_){} }
  function pnSplit(v){ const i=String(v).indexOf(':'); return [v.slice(0,i), v.slice(i+1)]; }
  function pnToggleDone(kind,id){
    const ds=pnDay();
    if(kind==='b'){ dyComplete(id,ds); pnRender(); return; }   // блок: та сама логіка, що й у старому Планері (XP, нагадування, звʼязки)
    const t=(plData().tasks||[]).find(x=>x&&String(x.id)===String(id)); if(!t) return;
    t.done=!t.done; pnSave(); pnRender();
  }
  function pnToggleStar(kind,id){
    const it=pnFind(pnDay(),kind,id); if(!it) return;
    if(!it.ref.star){ const n=pnItems(pnDay()).filter(x=>x.ref.star).length; if(n>=3){ try{ plToast(pnT('starMax')); }catch(_){} return; } it.ref.star=true; }
    else delete it.ref.star;
    pnSave(); pnRender();
  }
  function pnFolderSheet(it){
    const keys=(typeof folders!=='undefined')?Object.keys(folders).filter(k=>folders[k]):[];
    const items=[{ic:PN_ICO.folder,label:pnT('noFolder'),onClick:()=>{ it.ref.folder=''; pnSave(); pnRender(); }}]
      .concat(keys.slice(0,40).map(k=>({ic:`<span class="pn-dot" style="background:${pnFolderColor(k)}"></span>`,label:String(folders[k].name||pnT('folder')),primary:it.ref.folder===k,
        onClick:()=>{ it.ref.folder=k; pnSave(); pnRender(); }})));
    actionSheet({title:pnT('folder'),sub:it.t,items});
  }
  function pnQuadSheet(it){
    const items=[1,2,3,4].map(k=>({ic:`<span class="pn-dot" style="background:${PN_QC[k]}"></span>`,label:pnT('q'+k),sub:pnT('q'+k+'s'),primary:+it.ref.q===k,
      onClick:()=>{ it.ref.q=k; pnSave(); pnRender(); }}));
    if(+it.ref.q) items.push({ic:PN_ICO.grid,label:pnT('qNone'),onClick:()=>{ delete it.ref.q; pnSave(); pnRender(); }});
    actionSheet({title:pnT('putQ'),sub:it.t,items});
  }
  function pnOpen(kind,id){
    const ds=pnDay(), it=pnFind(ds,kind,id); if(!it) return;
    const items=[
      {ic:it.ref.star?PN_ICO.starF:PN_ICO.star,label:it.ref.star?pnT('starOff'):pnT('starOn'),onClick:()=>pnToggleStar(kind,id)},
      {ic:PN_ICO.grid,label:pnT('putQ'),sub:+it.ref.q?pnT('q'+it.ref.q):'',onClick:()=>pnQuadSheet(it)},
      {ic:PN_ICO.folder,label:pnT('folder'),sub:(pnFolder(it.folder)||{}).name||pnT('noFolder'),onClick:()=>pnFolderSheet(it)}
    ];
    if(kind==='b') items.push({ic:PN_ICO.clock,label:pnT('details'),onClick:()=>{ try{ dyMenu(it.ref,ds); }catch(e){ console.error('pnOpen',e); } }});
    else {
      if(!it.done) items.push({ic:PN_ICO.cal,label:pnT('move'),sub:pnTaskDate(it.ref)?pnShort(pnTaskDate(it.ref)):pnT('today'),onClick:()=>{
        try{ dyDayPicker(pnT('moveQ'),it.t,ds,pnTaskDate(it.ref)||pnToday(),target=>{ it.ref.date=target; pnSave(); pnRender(); try{ plToast('📅 '+pnShort(target)); }catch(_){} }); }catch(e){ console.error('pnMove',e); } }});
      if(!it.done) items.push({ic:PN_ICO.clock,label:pnT('toHour'),onClick:()=>{ dyTaskToDay(it.id,ds);
        const b=plBlocksFor(ds).find(x=>x&&String(x.fromTask)===it.id); if(b){ if(it.ref.folder) b.folder=it.ref.folder; if(it.ref.star) b.star=true; if(it.ref.q) b.q=it.ref.q; pnSave(); } pnRender(); }});
      items.push({ic:PN_ICO.trash,label:pnT('del'),danger:true,onClick:()=>{ const p=plData(); p.tasks=(p.tasks||[]).filter(x=>!(x&&String(x.id)===it.id)); pnSave(); pnRender(); try{ plToast(pnT('deleted')); }catch(_){} }});
    }
    actionSheet({title:it.t,sub:it.h!=null?pnHM(it.h)+'–'+pnHM(Math.min(it.end,24)):'',items});
  }
  function pnAddTask(v){
    v=String(v||'').trim().slice(0,200); if(!v) return;
    const p=plData();
    p.tasks.push({id:'t_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),scope:'day',t:v,date:pnDay(),c:'val',p:2,tag:'',done:false,open:false,subs:[]});
    pnSave(); pnRender();
    // фокус одразу, у тому ж обробнику: інакше швидко надруковане зникає, а iPhone ховає клавіатуру
    const i=document.getElementById('pnAddIn'); if(i) try{ i.focus({preventScroll:true}); }catch(_){}
  }
  function pnFlowOpen(){
    try{ flowSpotOpen(); const h=pnFlowHint(); if(h) setTimeout(()=>{ const i=document.getElementById('fsInput'); if(i&&!i.value) i.value=h; },60); }
    catch(e){ console.error('pnFlow',e); }
  }
  function pnBind(c){
    const on=(sel,fn)=>c.querySelectorAll(sel).forEach(el=>el.onclick=e=>{ e.stopPropagation(); fn(el,e); });
    on('[data-pnper]',el=>{ pnPer=el.dataset.pnper; if(pnPer==='month'||pnPer==='year') pnYm=pnDay().slice(0,7); pnRemember(); pnRender(); pnTop(); });
    on('[data-pnview]',el=>{ pnView=el.dataset.pnview; pnRemember(); pnRender(); pnTop(); });
    on('[data-pngo]',el=>{ const d=el.dataset.pngo; pnDs=d===pnToday()?'':d; pnPer='day'; pnRemember(); pnRender(); });
    on('[data-pnstep]',el=>{ const d=pnAdd(pnDay(),+el.dataset.pnstep); pnDs=d===pnToday()?'':d; pnRender(); });
    on('[data-pnmstep]',el=>{ const ym=pnYm||pnToday().slice(0,7), st=+el.dataset.pnmstep;
      const d=new Date(+ym.slice(0,4), +ym.slice(5,7)-1+(pnPer==='year'?12*st:st), 1); pnYm=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'); pnRender(); });
    on('[data-pnym]',el=>{ pnYm=el.dataset.pnym; pnPer='month'; pnRemember(); pnRender(); });
    on('[data-pnchk]',el=>{ const [k,id]=pnSplit(el.dataset.pnchk);
      if(k==='w'){ const t=(plData().tasks||[]).find(x=>x&&String(x.id)===id); if(t){ t.done=!t.done; pnSave(); pnRender(); } return; }
      pnToggleDone(k,id); });
    on('[data-pnstar]',el=>{ const [k,id]=pnSplit(el.dataset.pnstar); pnToggleStar(k,id); });
    on('[data-pnopen]',el=>{ const [k,id]=pnSplit(el.dataset.pnopen); pnOpen(k,id); });
    on('[data-pnmx]',el=>{ const [k,id]=pnSplit(el.dataset.pnmx); const p=plData(), m=(p.matrix[k]||[]).find(x=>x&&String(x.id)===id); if(m){ m.done=!m.done; pnSave(); pnRender(); } });
    on('[data-pnfold]',el=>{ try{ goFolder(el.dataset.pnfold); }catch(e){ console.error('pnFolder',e); } });
    on('[data-pnhour]',el=>{ const q=plData(), old=q.selDate; q.selDate=pnDay(); try{ plBlockSheet(null,+el.dataset.pnhour); } finally{ q.selDate=old; } });
    const a=c.querySelector('#pnAddIn'); if(a) a.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.isComposing){ e.preventDefault(); pnAddTask(a.value); } });
    if(pnPer==='day'&&pnView==='hours'){ const tl=c.querySelector('.pn-tl'); if(tl){ const S=+tl.dataset.pnstart||0, h=new Date().getHours();
      setTimeout(()=>{ try{ const y=tl.getBoundingClientRect().top+document.body.scrollTop+Math.max(0,h-1-S)*48-120; if(pnDay()===pnToday()) document.body.scrollTop=Math.max(0,y); }catch(_){} },0); } }
  }
  function pnTop(){ try{ window.scrollTo(0,0); document.body.scrollTop=0; }catch(_){} }
  function pnIsOpen(){ const s=document.getElementById('scr-plan'); return !!(s&&s.classList.contains('active')); }

  // keepDay=true — відкрити день, вибраний у даних Планера (так ведуть старі входи з Флоу)
  function goPlan(keepDay){ try{
    const p=plData();
    pnDs=(keepDay&&p.selDate&&p.selDate!==pnToday())?p.selDate:'';
    if(keepDay) pnPer='day';
    pnYm=''; pnRender(); show('scr-plan'); pnTop();
  }catch(e){ console.error('goPlan',e); } }
  // дані підтягнулись з хмари — якщо План відкритий, перемальовуємо
  try{ document.addEventListener('flowsync',()=>{ if(pnIsOpen()) pnRender(); }); }catch(_){}
  /* 19.11.2026: кнопка «Журнал» у нижній панелі й бічному меню стала «Планер» і веде сюди (id лишились navJournal /
     data-dnav="journal" — на них спирається підсвітка в show()). Журнал героя відкривається з віджетів і посилань (goJournal).
     Цей файл іде після 41-journal.js, тож обробник тут перекриває старий. */
  { const nj=document.getElementById('navJournal'); if(nj) nj.onclick=()=>goPlan(); }
  { const dj=document.querySelector('.dsb-i[data-dnav="journal"]'); if(dj) dj.onclick=()=>goPlan(); }
  try{ window.goPlan=goPlan; window.pnRender=pnRender; window.pnIsOpen=pnIsOpen; }catch(_){}
