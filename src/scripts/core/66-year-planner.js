  /* ════════ «Мій рік» — планер із Карти бажань (66-year-planner.js, 22.11.2026) ════════
     Банер Карти бажань на Огляді відкриває цей екран; сама Карта (колаж) — кнопкою «Усі мрії».
     Обрано збірку A з полотна: стрічка цілей-мрій → ланцюжок зв'язків вибраної цілі →
     дорога 4 кварталів від сьогодні → поле Флоу над нижньою панеллю.
     Етап 1: лише ПОКАЗ наявних даних (goalsData.goals, wishes, конверти Гаманця).
     Пише тільки після тапу людини і тільки наявними функціями: wishToGoal (06-wishes.js),
     mrNewGoal / mrAddStep / mrSumSheet / mrGoalPage (57-my-plan.js), jnMsSetDone (41-journal.js).
     Етап 2: «Цей тиждень» — справи «Плану» з полем goalId (нове поле лише в справі, створеній тут). */
  let ypSel='';                         // id вибраної цілі — лише в памʼяті екрана
  let ypBack='home';                    // звідки прийшли: 'home' | 'journal'
  const YP_QN=['I','II','III','IV'];
  function ypT(uk,en){ return mrT(uk,en); }

  // мрії без цілі (або з ціллю, якої вже нема) — їх можна зробити ціллю
  function ypFreeWishes(){
    try{ return (wishes||[]).filter(w=>w&&(w.type==='video'?w.thumb:w.img)&&!(w.goalId&&jnGoalById(w.goalId))); }catch(_){ return []; }
  }
  function ypCur(goals){
    let g=goals.find(x=>String(x.id)===ypSel);
    if(!g&&goals[0]){ g=goals[0]; ypSel=String(g.id); }
    return g||null;
  }

  // ── стрічка: ціль-картка (фото мрії або колір цілі) і вільна мрія ──
  function ypCard(g,on){
    const c=safeColor(g.color,'#5b8def'), ph=jnMissionPhoto(g), pct=Math.max(0,Math.min(100,jnPct(g)||0)), fin=mrFinish(g);
    return `<button class="yp-card${ph?' ph':''}${on?' on':''}" data-ypg="${esc(g.id)}" aria-pressed="${on}" style="--c:${c};--p:${pct};${ph?`background-image:url('${esc(ph)}')`:''}">
      <span class="yp-ring" aria-hidden="true"><i>${pct}</i></span>
      <span class="yp-cn"><b>${esc(g.name||ypT('Ціль','Goal'))}</b><small>${fin?ypT('до ','by ')+esc(fin):ypT('без терміну','no date')}</small></span></button>`;
  }
  function ypWishCard(w){
    const src=safeImg(w.type==='video'?w.thumb:w.img)||'';
    return `<button class="yp-card wish ph" data-ypw="${esc(w.id)}" style="${src?`background-image:url('${esc(src)}')`:''}">
      <span class="yp-cn"><b>${esc(w.cap||ypT('Мрія','Dream'))}</b><small>＋ ${ypT('Зробити ціллю','Make it a goal')}</small></span></button>`;
  }
  function ypNewCard(){ return `<button class="yp-card add" data-ypnew><span aria-hidden="true">＋</span><b>${ypT('Нова ціль','New goal')}</b></button>`; }

  // ── ланцюжок: що вже зв'язано з ціллю; бракує — кнопка, що веде туди, де це задають ──
  function ypChain(g){
    const ph=jnMissionPhoto(g), fk=moOwnFolder(g.folderKey)?g.folderKey:'', sum=mrMoneySum(g);
    const lv=jnLevels(g), done=lv.filter(m=>m.done).length;
    const arrow='<i class="yp-to" aria-hidden="true">→</i>';
    const parts=[
      ph?`<span class="yp-ln">${ypT('Мрія','Dream')}</span>`:`<button class="yp-ln add" data-ypopen>＋ ${ypT('фото мрії','dream photo')}</button>`,
      fk?`<button class="yp-ln" data-ypfold>${safeEmoji(folders[fk].emoji,'📁')} ${esc(String(folders[fk].name||ypT('Папка','Folder')))}</button>`:`<button class="yp-ln add" data-ypfpick>＋ ${ypT('папка','folder')}</button>`,
      sum?`<button class="yp-ln" data-ypopen>${esc(mrK(mrSaved(g),g))} / ${esc(mrK(sum,g))}</button>`:`<button class="yp-ln add" data-ypsum>＋ ${ypT('гроші','money')}</button>`,
      `<span class="yp-ln${lv.length?'':' dim'}">${ypT('кроки ','steps ')}${done}/${lv.length}</span>`
    ];
    const wk=ypWeekTasks(g);   // етап 2: ланка «План» — кроки цього тижня
    if(wk.length) parts.push(`<button class="yp-ln plan" data-ypgoplan>${ypT('План ','Plan ')}${wk.filter(t=>t.done).length}/${wk.length}</button>`);
    return `<div class="yp-chain" aria-label="${ypT("Зв'язки цілі",'Goal links')}">${parts.join(arrow)}</div>`;
  }

  /* ── «Цей тиждень» (етап 2): крок тижня — ЗВИЧАЙНА справа «Плану» з датою і полем goalId.
     Одне джерело (plData().tasks у goals_data): галочка тут = галочка в «Плані», і навпаки.
     goalId пишеться лише в нову справу, створену тапом тут; старі справи не змінюються. ── */
  const YP_DOW={uk:['пн','вт','ср','чт','пт','сб','нд'],en:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']};
  function ypAddDays(ds,n){ const d=new Date(ds+'T12:00:00'); d.setDate(d.getDate()+n); return ymdLocal(d); }
  function ypWeekMon(){ const td=ymdLocal(); return ypAddDays(td,-((new Date(td+'T12:00:00').getDay()+6)%7)); }
  function ypDow(ds){ return (mrEn()?YP_DOW.en:YP_DOW.uk)[(new Date(ds+'T12:00:00').getDay()+6)%7]; }
  // справи цілі на цей тиждень + незроблені з минулих днів (їх «План» і так переносить на сьогодні)
  function ypWeekTasks(g){
    const mon=ypWeekMon(), sun=ypAddDays(mon,6);
    return (plData().tasks||[]).filter(t=>t&&String(t.goalId||'')===String(g.id)&&/^\d{4}-\d{2}-\d{2}$/.test(t.date||'')
        &&((t.date>=mon&&t.date<=sun)||(t.date<mon&&!t.done)))
      .sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  }
  function ypWeekHTML(g){
    const L=ypWeekTasks(g), mon=ypWeekMon(), done=L.filter(t=>t.done).length;
    const rows=L.map(t=>`<button class="yp-lv${t.done?' ok':''}" data-ypt="${esc(t.id)}" aria-pressed="${!!t.done}">
        <i aria-hidden="true"></i><span>${esc(t.t||'')}</span><small>${t.date<mon?ypT('з минулого','overdue'):esc(ypDow(t.date))}</small></button>`).join('');
    return `<div class="yp-week"><div class="yp-wh"><b>${ypT('Цей тиждень','This week')}</b><span>${L.length?done+ypT(' з ',' of ')+L.length:''}</span></div>
      ${rows||`<p class="yp-none">${ypT('Кроків на тиждень ще нема — вони стануть справами в «Плані».','No steps this week yet — they become tasks in Plan.')}</p>`}
      <button class="yp-add in" data-ypweek>＋ ${ypT('Крок на цей тиждень','Step for this week')}</button></div>`;
  }
  function ypAddWeekStep(g){
    inputModal({ title:ypT('Крок на цей тиждень','Step for this week'), placeholder:ypT('Напр. Відкласти ₴ 2 000','E.g. Put aside 50'), onOk:v=>{
      v=String(v||'').trim().slice(0,200); if(!v) return;
      const td=ymdLocal(), sun=ypAddDays(ypWeekMon(),6), days=[];
      for(let ds=td; ds<=sun; ds=ypAddDays(ds,1)) days.push(ds);
      actionSheet({ title:ypT('Коли?','When?'), sub:v, items:days.map((ds,i)=>({ ic:'calendar',
        label:i===0?ypT('Сьогодні','Today'):i===1?ypT('Завтра','Tomorrow'):ypDow(ds)+', '+(+ds.slice(8)),
        onClick:()=>ypPushTask(g,v,ds) })) });
    }});
  }
  // goals_data ще не прочитано (старт без мережі) — не пишемо, як «Забіг» (56-run.js rnReady)
  function ypReady(){ try{ return typeof window.storeKeyReady!=='function'||window.storeKeyReady('goals_data')===true; }catch(_){ return false; } }
  function ypNotReady(){ try{ plToast(ypT('Ще завантажуються цілі — спробуй за мить','Goals are still loading — try again in a moment')); }catch(_){} }
  function ypPushTask(g,v,ds){
    if(!ypReady()){ ypNotReady(); return; }
    const cur=jnGoalById(g.id); if(!cur) return;   // ціль могли прибрати, поки відкрита шторка
    const t={ id:'t_'+Date.now()+'_'+Math.random().toString(36).slice(2,5), scope:'day', t:v, date:ds, c:'val', p:2, tag:'',
      done:false, open:false, subs:[], goalId:String(cur.id) };
    if(moOwnFolder(cur.folderKey)) t.folder=cur.folderKey;   // у «Плані» справа покаже папку цілі
    plData().tasks.push(t); saveGoals(); ypRender();
    try{ plToast(ypT('＋ крок у «Плані»','＋ step in Plan')); }catch(_){}
  }

  // ── дорога: 4 квартали від сьогодні, кроки (віхи) цілі в кожному ──
  function ypRoad(g){
    const cy=ymdLocal().slice(0,4);
    return '<ol class="yp-road">'+mrQuarters().map((qq,i)=>{
      const lv=mrLvIn(g,qq);
      const items=lv.map(m=>`<button class="yp-lv${m.done?' ok':''}" data-ypms="${esc(m.id)}" aria-pressed="${!!m.done}">
          <i aria-hidden="true"></i><span>${esc(m.t||'')}</span><small>${esc(mrMonth(m.ym))}</small></button>`).join('');
      return `<li class="yp-q${i===0?' now':''}"><div class="yp-qh"><b>${YP_QN[qq.q]} ${ypT('квартал','quarter')}${i===0?' · '+ypT('зараз','now'):''}</b>
          <span>${esc(MR_QN[qq.q])}${qq.y!==cy?' '+esc(qq.y):''}</span></div>
        ${items||`<p class="yp-none">${ypT('Кроків ще нема','No steps yet')}</p>`}${i===0?ypWeekHTML(g):''}</li>`;
    }).join('')+'</ol>'+`<button class="yp-add" data-ypstep>＋ ${ypT('Крок на квартал','Step for a quarter')}</button>`;
  }

  function ypEmpty(){
    const free=ypFreeWishes();
    let h=`<div class="yp-empty"><b>${ypT('Обери 1–3 мрії — і розкладемо їх на рік','Pick 1–3 dreams and spread them over the year')}</b>
      <span>${free.length?ypT('Тапни мрію, щоб зробити її ціллю. Або почни з чистої цілі.','Tap a dream to make it a goal. Or start with a blank goal.')
        :ypT('Карта бажань поки порожня. Додай фото мрії — або почни з чистої цілі.','Your Vision board is empty. Add a dream photo or start with a blank goal.')}</span></div>`;
    h+=`<div class="yp-strip">${free.map(ypWishCard).join('')}${ypNewCard()}</div>`;
    if(!free.length) h+=`<button class="mr-link" data-ypmap>${ypT('Відкрити Карту бажань','Open Vision board')}</button>`;
    return h;
  }

  function ypHTML(){
    const goals=mrActive(), g=ypCur(goals), free=ypFreeWishes();
    const backL=ypBack==='journal'?ypT('‹ Журнал','‹ Journal'):ypT('‹ Огляд','‹ Overview');
    let h=`<div class="yp-top"><button class="back" data-ypback>${backL}</button><button class="yp-map" data-ypmap>${ypT('Усі мрії','All dreams')}</button></div>
      <div class="yp-head"><h1>${ypT('Мій рік','My year')}</h1><span>${ypT('до ','until ')}${esc(mrUntil())}</span></div>`;
    if(!g) return h+ypEmpty()+'<div class="yp-pad"></div>';
    h+=`<div class="yp-strip" role="group" aria-label="${ypT('Цілі року','Goals of the year')}">${goals.map(x=>ypCard(x,x===g)).join('')}${free.map(ypWishCard).join('')}${ypNewCard()}</div>`;
    const why=String(g.why||'').trim();
    h+=`<section class="yp-goal"><button class="yp-gh" data-ypopen><b>${esc(g.name||ypT('Ціль','Goal'))}</b>
        <span>${why?esc(why.length>120?why.slice(0,119)+'…':why):ypT('Навіщо тобі ця ціль? Відкрий — і допиши.','Why this goal? Open it and add a line.')}</span></button>
      ${ypChain(g)}</section>`;
    h+=ypRoad(g);
    h+=`<button class="mr-link" data-ypjn>${ypT('Точка Б, гроші й правила року ›','Point B, money and rules of the year ›')}</button>`;
    return h+'<div class="yp-pad"></div>';
  }

  function ypRender(){
    const body=document.getElementById('ypBody'); if(!body) return;
    body.innerHTML=ypHTML();
    const q=s=>body.querySelectorAll(s);
    const cur=()=>jnGoalById(ypSel);
    q('[data-ypback]').forEach(b=>b.onclick=()=>{ if(ypBack==='journal') goJournal(); else goHome(); });
    q('[data-ypmap]').forEach(b=>b.onclick=()=>goWishes({back:goYearPlanBack, label:ypT('‹ Мій рік','‹ My year')}));
    q('[data-ypg]').forEach(b=>b.onclick=()=>{
      if(ypSel===b.dataset.ypg){ const g=cur(); if(g) mrGoalPage(g); return; }   // повторний тап — відкрити ціль
      ypSel=b.dataset.ypg; ypRender();
    });
    q('[data-ypw]').forEach(b=>b.onclick=()=>wishToGoal(b.dataset.ypw, gid=>{ ypSel=String(gid); ypRender(); const g=jnGoalById(gid); if(g) mrGoalPage(g); }));
    q('[data-ypnew]').forEach(b=>b.onclick=mrNewGoal);
    q('[data-ypjn]').forEach(b=>b.onclick=()=>{ mrDetail=false; goJournal({tab:'year'}); });
    q('[data-ypopen]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) mrGoalPage(g); });
    q('[data-ypfpick]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) mrPickFolder(g,ypRender); });   // етап 3
    q('[data-ypsum]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) mrSumSheet(g,ypRender); });
    q('[data-ypfold]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g&&moOwnFolder(g.folderKey)) goFolder(g.folderKey); });
    q('[data-ypstep]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) mrAddStep(g,ypRender); });
    q('[data-ypweek]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) ypAddWeekStep(g); });
    q('[data-ypgoplan]').forEach(b=>b.onclick=()=>{ if(typeof goPlan==='function') goPlan(); });
    q('[data-ypt]').forEach(b=>b.onclick=()=>{
      if(!ypReady()){ ypNotReady(); return; }
      const t=(plData().tasks||[]).find(x=>x&&String(x.id)===b.dataset.ypt); if(!t) return;
      t.done=!t.done; saveGoals(); ypRender();
    });
    q('[data-ypms]').forEach(b=>b.onclick=()=>{
      const g=cur(), m=g&&(g.ms||[]).find(x=>x&&String(x.id)===b.dataset.ypms);
      if(!m){ if(g) mrGoalPage(g); return; }   // крок не з «Дороги» (старий рівень) — правиться на сторінці цілі
      jnMsSetDone(m,!m.done); saveGoals(); ypRender();
    });
    ypDock();
  }

  // поле Флоу над нижньою панеллю — як у «Плані»; етап 4 замінить на шторку з пакетом
  function ypDock(){
    let d=document.getElementById('ypFlow');
    if(!d){ d=document.createElement('button'); d.id='ypFlow'; d.type='button'; d.className='yp-flow'; document.body.appendChild(d);
      d.onclick=()=>{ if(window.aiChatSheet) window.aiChatSheet(); }; }
    const g=jnGoalById(ypSel);
    d.innerHTML=`<span class="yp-spark" aria-hidden="true">✦</span><span>${g?ypT('Спитати Флоу про «','Ask Flow about “')+esc(g.name||'')+ypT('»','”'):ypT('Розкажи Флоу, що хочеш цього року','Tell Flow what you want this year')}</span>`;
  }

  function ypRefresh(){ const s=document.getElementById('scr-yplan'); if(s&&s.classList.contains('active')) ypRender(); }
  function goYearPlanBack(){ goYearPlan({keepBack:true}); }
  function goYearPlan(opts){ try{
    if(opts&&typeof opts==='object'){ if(opts.from) ypBack=opts.from; else if(!opts.keepBack) ypBack='home'; }
    else ypBack='home';
    ypRender(); show('scr-yplan'); window.scrollTo(0,0);
  }catch(e){ console.error('goYearPlan',e); } }
  window.goYearPlan=goYearPlan;
  try{ document.addEventListener('flowsync',ypRefresh); }catch(_){}
