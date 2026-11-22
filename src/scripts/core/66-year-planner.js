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

  /* поле Флоу над нижньою панеллю — як у «Плані». Етап 4: відкриває чат із ВПИСАНИМ (не надісланим)
     питанням «розпиши мій рік» — людина бачить, що піде моделі, і сама тисне «надіслати».
     Даних цілей у текст не кладемо: Флоу читає їх сам через get_data goals. */
  function ypFlowAsk(){
    const g=jnGoalById(ypSel);
    return g&&mrActive().length===1
      ? ypT('Розпиши ціль «','Plan out my goal “')+String(g.name||'').slice(0,80)+ypT('» на рік: кроки по кварталах, 2–3 кроки на цей тиждень і суму, якщо треба гроші. Запропонуй пакетом.',
          '” for the year: steps by quarter, 2–3 steps for this week and a target sum if money is needed. Suggest it as one batch.')
      : ypT('Розпиши мій рік: подивись мої цілі й мрії і запропонуй пакетом кроки по кварталах, 2–3 кроки на цей тиждень і суми, де потрібні гроші.',
          'Plan my year: look at my goals and dreams and suggest, as one batch, steps by quarter, 2–3 steps for this week and target sums where money is needed.');
  }
  function ypDock(){
    let d=document.getElementById('ypFlow');
    if(!d){ d=document.createElement('button'); d.id='ypFlow'; d.type='button'; d.className='yp-flow'; document.body.appendChild(d);
      d.onclick=()=>{
        if(!window.aiChatSheet) return;
        const q=ypFlowAsk(); window.aiChatSheet();
        setTimeout(()=>{ const i=document.getElementById('aiInput'); if(i&&!i.value){ i.value=q; try{ i.dispatchEvent(new Event('input',{bubbles:true})); i.focus(); }catch(_){} } }, 60);
      }; }
    d.innerHTML=`<span class="yp-spark" aria-hidden="true">✦</span><span>${ypT('Флоу, розпиши мій рік','Flow, plan my year')}</span>`;
  }

  /* ════════ Етап 4: план року від Флоу ПАКЕТОМ (інструмент year_plan, 12-ai-agent.js) ════════
     Флоу лише ПРОПОНУЄ список; записує людина одним «Застосувати N» у шторці з галочками.
     Типи пунктів: goal (нова ціль) · quarter_step (віха goal.ms з місяцем) · week_step (справа «Плану»
     з goalId, як ypPushTask) · money (лише СУМА-мета цілі; гроші ніхто не переказує).
     Пише тими самими формами, що й кнопки, лише після ypReady(); кожен запис — у undo для aiLog. */
  const YP_BATCH_MAX=30;
  const YP_TYPE_UK={goal:'Ціль',quarter_step:'Дорога',week_step:'План',money:'Гроші'};
  const YP_TYPE_EN={goal:'Goal',quarter_step:'Road',week_step:'Plan',money:'Money'};
  function ypYm(off){ const d=new Date(ymdLocal()+'T12:00:00'); d.setDate(1); d.setMonth(d.getMonth()+off); return ymdLocal(d).slice(0,7); }
  // перевірка й привʼязка до справжніх цілей ДО шторки; неоднозначне — моделі, не людині
  function ypBatchPrepare(items){
    if(!Array.isArray(items)||!items.length) return {fatal:'порожній список items'};
    if(items.length>YP_BATCH_MAX) return {fatal:'забагато пунктів ('+items.length+'): не більше '+YP_BATCH_MAX+' за один пакет — розбий план на частини'};
    const goals=(goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)!=='archive');
    const low=s=>String(s||'').trim().toLowerCase();
    // нові цілі пакета — лише ті, що пройдуть перевірку нижче (та сама обрізка до 80): інакше кроки до
    // відкинутої цілі потрапили б у шторку і мовчки не записались (рецензія безпеки, 22.11)
    const newNames=[]; items.forEach(it=>{ if(!it||it.type!=='goal') return; const n=low(String(it.goal||'').trim().slice(0,80));
      if(n&&!goals.some(g=>low(g.name)===n)&&!newNames.includes(n)) newNames.push(n); });
    const rows=[], errors=[], ambiguous=[];
    const td=ymdLocal(), ymMin=ypYm(0), ymMax=ypYm(12), dsMax=ypAddDays(td,31);
    const resolve=(frag,i)=>{
      const f=low(frag); if(!f){ errors.push('#'+(i+1)+': не вказано goal'); return null; }
      if(newNames.includes(f)) return {newName:f};
      const exact=goals.filter(g=>low(g.name)===f); if(exact.length===1) return {g:exact[0]};
      const part=goals.filter(g=>low(g.name).includes(f));
      if(part.length===1) return {g:part[0]};
      if(!part.length){ errors.push('#'+(i+1)+': ціль «'+String(frag).slice(0,40)+'» не знайдено'); return null; }
      ambiguous.push('«'+String(frag).slice(0,40)+'» → '+part.slice(0,5).map(g=>'«'+String(g.name||'').slice(0,40)+'»').join(', '));
      return null;
    };
    items.forEach((it,i)=>{
      if(!it||typeof it!=='object'){ errors.push('#'+(i+1)+': не обʼєкт'); return; }
      const type=it.type;
      if(type==='goal'){
        const name=String(it.goal||'').trim().slice(0,80);
        if(!name){ errors.push('#'+(i+1)+': ціль без назви'); return; }
        if(goals.some(g=>low(g.name)===low(name))){ errors.push('#'+(i+1)+': ціль «'+name.slice(0,40)+'» вже є — не дублюю'); return; }
        if(rows.some(r=>r.type==='goal'&&low(r.name)===low(name))){ errors.push('#'+(i+1)+': ціль «'+name.slice(0,40)+'» двічі в пакеті'); return; }
        rows.push({type, name, label:name}); return;
      }
      if(type==='quarter_step'||type==='week_step'||type==='money'){
        const ref=resolve(it.goal,i); if(!ref) return;
        const gName=ref.g?String(ref.g.name||''):String((items.find(x=>x&&x.type==='goal'&&low(String(x.goal||'').trim().slice(0,80))===ref.newName)||{}).goal||'').trim().slice(0,80);
        if(type==='money'){
          const sum=Math.round(+it.sum||0);
          if(!(sum>0&&sum<1e9)){ errors.push('#'+(i+1)+': сума має бути більша за 0'); return; }
          rows.push({type, ref, sum, label:gName+' · '+ypT('мета ','goal ')+sum}); return;
        }
        const t=String(it.t||'').trim().slice(0,type==='week_step'?200:80);
        if(!t){ errors.push('#'+(i+1)+': крок без тексту'); return; }
        if(type==='quarter_step'){
          const ym=String(it.ym||'');
          if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(ym)||ym<ymMin||ym>ymMax){ errors.push('#'+(i+1)+': ym «'+ym.slice(0,10)+'» — потрібен РРРР-ММ від '+ymMin+' до '+ymMax); return; }
          rows.push({type, ref, t, ym, label:gName+' · '+t+' · '+mrMonth(ym)}); return;
        }
        const ds=String(it.ds||'');
        // ymdLocal(new Date(ds))===ds: Chromium тихо переносить «2026-11-31» на 1 грудня — такої дати не приймаємо
        if(!/^\d{4}-\d{2}-\d{2}$/.test(ds)||ymdLocal(new Date(ds+'T12:00:00'))!==ds||ds<td||ds>dsMax){ errors.push('#'+(i+1)+': ds «'+ds.slice(0,12)+'» — потрібна дата РРРР-ММ-ДД від '+td+' до '+dsMax); return; }
        rows.push({type, ref, t, ds, label:gName+' · '+t+' · '+ypDow(ds)+', '+(+ds.slice(8))}); return;
      }
      errors.push('#'+(i+1)+': невідомий type «'+String(type).slice(0,20)+'»');
    });
    return {rows, errors, ambiguous};
  }
  // шторка-пакет: кожен пункт з галочкою; Promise → масив індексів обраних або null (скасовано / час вийшов)
  function ypBatchSheet(rows,note){
    return new Promise(res=>{
      try{
        const T=mrEn()?YP_TYPE_EN:YP_TYPE_UK, on=rows.map(()=>true);
        const ov=document.createElement('div'); ov.className='asheet yp-batch';
        ov.innerHTML=`<div class="asheet-in" role="dialog" aria-modal="true" aria-label="${esc(ypT('Флоу пропонує план','Flow suggests a plan'))}"><div class="asheet-grip"></div>
          <div class="asheet-title">${esc(ypT('Флоу пропонує план','Flow suggests a plan'))}</div>
          ${note?`<div class="asheet-sub">${esc(String(note).slice(0,240))}</div>`:''}
          <div class="yp-bl">${rows.map((r,i)=>`<label class="yp-bi"><input type="checkbox" checked data-ybi="${i}">
            <span>${esc(r.label)}</span><em>${esc(T[r.type]||'')}</em></label>`).join('')}</div>
          <button class="asheet-item primary" data-ok="1"><span class="tx"><span class="lab2" data-ylab></span></span></button>
          <button class="asheet-cancel">${esc(ypT('Скасувати','Cancel'))}</button></div>`;
        document.body.appendChild(ov);
        const okB=ov.querySelector('[data-ok]'), lab=ov.querySelector('[data-ylab]');
        const paint=()=>{ const n=on.filter(Boolean).length; lab.textContent=ypT('Застосувати ','Apply ')+n; okB.disabled=!n; okB.style.opacity=n?'':'.5'; };
        ov.querySelectorAll('[data-ybi]').forEach(c=>c.onchange=()=>{ on[+c.dataset.ybi]=c.checked; paint(); });
        paint();
        let done=false; const fin=v=>{ if(done) return; done=true; try{ ov.remove(); }catch(_){} res(v); };
        ov.onclick=e=>{ if(e.target===ov) fin(null); };
        ov.querySelector('.asheet-cancel').onclick=()=>fin(null);
        okB.onclick=()=>{ const idx=on.map((v,i)=>v?i:-1).filter(i=>i>=0); if(idx.length) fin(idx); };
        setTimeout(()=>fin(null), 300000);
      }catch(e){ res(null); }
    });
  }
  // запис обраних пунктів; повертає {done:[рядки], undo:{goals,ms,tasks,money}}
  function ypBatchApply(rows,idx){
    const pick=idx.map(i=>rows[i]).filter(Boolean);
    const undo={goals:[],ms:[],tasks:[],money:[]}, done=[], newIds={};
    const uid=p=>p+Date.now()+'_'+Math.random().toString(36).slice(2,6);
    if(!Array.isArray(goalsData.goals)) goalsData.goals=[];
    let hasMain=goalsData.goals.some(g=>g&&jnStatus(g)!=='archive'&&jnRole(g)==='main');
    pick.filter(r=>r.type==='goal').forEach(r=>{
      const g={ id:uid('g_m_'), steps:[], track:{}, days:{}, open:true, ms:[], name:r.name, emoji:'🎯',
        color:safeColor(JN_COLORS[goalsData.goals.length%JN_COLORS.length],JN_COLORS[0]), role:hasMain?'side':'main', status:'active', from:'', to:'',
        sched:{dows:[], min:45, h:18, start:ymdLocal(), end:'', plan:false}, budget:{hWeek:0, money:0}, reward:null, folderKey:null, _src:'ai' };
      hasMain=true; goalsData.goals.push(g); newIds[r.name.toLowerCase()]=g.id; undo.goals.push(g.id); done.push(ypT('ціль ','goal ')+'«'+r.name+'»');
    });
    const goalOf=r=>{ if(r.ref.g) return jnGoalById(r.ref.g.id); const id=newIds[r.ref.newName]; return id?jnGoalById(id):null; };
    const lost=[];
    let envTouched=false;
    pick.filter(r=>r.type!=='goal').forEach(r=>{
      const g=goalOf(r);
      if(!g){ lost.push(r.label); return; }   // нову ціль зняли галочкою або її прибрали — пункт не пишемо, але кажемо про це
      if(r.type==='money'){
        const e0=mrEnv(g);
        undo.money.push({gid:String(g.id), prev:(g.money&&typeof g.money==='object'&&+g.money.sum>0)?+g.money.sum:0,
          envId:e0?String(e0.id):'', envPrev:e0?e0.goal:null});   // лише сума: envId конверта не чіпаємо
        g.money=Object.assign({}, (g.money&&typeof g.money==='object')?g.money:{}, {sum:r.sum});
        if(e0){ e0.goal=r.sum; envTouched=true; }   // як ручна кнопка (57-my-plan.js mrSumSheet): ціль конверта = та сама сума
        done.push(ypT('сума «','sum “')+(g.name||'')+ypT('» = ','” = ')+r.sum); return;
      }
      if(r.type==='quarter_step'){
        if(!Array.isArray(g.ms)) g.ms=[];
        const m={id:uid('ms_ai_'), ym:r.ym, t:r.t, done:false}; g.ms.push(m);
        undo.ms.push({gid:String(g.id), id:m.id}); done.push(ypT('крок «','step “')+r.t+ypT('» · ','” · ')+mrMonth(r.ym)); return;
      }
      const t={ id:uid('t_'), scope:'day', t:r.t, date:r.ds, c:'val', p:2, tag:'', done:false, open:false, subs:[], goalId:String(g.id), _src:'ai' };
      if(moOwnFolder(g.folderKey)) t.folder=g.folderKey;
      plData().tasks.push(t); undo.tasks.push(t.id); done.push(ypT('справа «','task “')+r.t+ypT('» · ','” · ')+r.ds);
    });
    if(done.length){ saveGoals(); if(envTouched) try{ saveEnvelopes(); }catch(_){} try{ ypRefresh(); }catch(_){} try{ if(typeof plRerender==='function') plRerender(); }catch(_){} }
    return {done, undo, lost};
  }
  // відкат пакета (кличе aiUndo, 12-ai-agent.js): прибрати створене, повернути суми
  function ypBatchUndo(u){
    if(!u) return;
    const tids=new Set((u.tasks||[]).map(String));
    if(tids.size){ const p=plData(); p.tasks=(p.tasks||[]).filter(t=>!(t&&tids.has(String(t.id)))); }
    (u.ms||[]).forEach(x=>{ const g=jnGoalById(x.gid); if(g&&Array.isArray(g.ms)) g.ms=g.ms.filter(m=>!(m&&String(m.id)===String(x.id))); });
    // сума — назад до попередньої; решту money (envId конверта, що міг зʼявитись після пакета) не чіпаємо
    let envTouched=false;
    (u.money||[]).slice().reverse().forEach(x=>{
      const g=jnGoalById(x.gid); if(!g||!g.money||typeof g.money!=='object') return;
      if(+x.prev>0) g.money.sum=+x.prev; else delete g.money.sum;
      if(x.envId){ const e=(envelopes||[]).find(v=>v&&String(v.id)===x.envId); if(e){ e.goal=x.envPrev; envTouched=true; } }
    });
    if(envTouched) try{ saveEnvelopes(); }catch(_){}
    (u.goals||[]).forEach(id=>{
      const g=jnGoalById(id); if(!g) return;
      // ціль, якою людина вже користується (гроші в конверті, свої кроки, відмітки трекера, розклад у планері), — лишаємо
      const used=o=>!!o&&typeof o==='object'&&Object.keys(o).length>0;
      const kept=(typeof mrSaved==='function'&&mrSaved(g)>0)||(g.ms||[]).length>0||(g.steps||[]).length>0
        ||used(g.track)||used(g.days)||!!(g.sched&&g.sched.plan);
      if(kept){ try{ plToast(ypT('Ціль «','Goal “')+(g.name||'')+ypT('» вже має гроші чи кроки — лишаю','” already has money or steps — kept')); }catch(_){} return; }
      try{ mrUnlinkWishes(g); }catch(_){}
      goalsData.goals=(goalsData.goals||[]).filter(x=>x!==g);
    });
    try{ ypRefresh(); }catch(_){}
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
