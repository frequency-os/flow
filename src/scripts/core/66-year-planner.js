  /* ════════ «Мій рік» — планер із Карти бажань (66-year-planner.js, 22.11.2026) ════════
     Банер Карти бажань на Огляді відкриває цей екран; сама Карта (колаж) — кнопкою «Усі мрії».
     Обрано збірку A з полотна: стрічка цілей-мрій → ланцюжок зв'язків вибраної цілі →
     дорога 4 кварталів від сьогодні → поле Флоу над нижньою панеллю.
     Етап 1: лише ПОКАЗ наявних даних (goalsData.goals, wishes, конверти Гаманця).
     Пише тільки після тапу людини і тільки наявними функціями: wishToGoal (06-wishes.js),
     mrNewGoal / mrAddStep / mrSumSheet / mrGoalPage (57-my-plan.js), jnMsSetDone (41-journal.js).
     Етап 2: «Цей тиждень» — справи «Плану» з полем goalId (нове поле лише в справі, створеній тут). */
  let ypSel='';                         // id вибраної цілі — лише в памʼяті екрана
  let ypBack='home';                    // звідки прийшли: 'home' | 'journal' | 'folder'
  let ypBackFk='';                      // папка, з якої прийшли (ypBack==='folder')
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

  /* ── Н1 (етап 6, 22.11.2026): пігулки цілей угорі, фото-герой, плитки звʼязків, трекери, тиждень, дорога.
     Плитки читають Core.graph() (57-core.js) — ті самі числа, що бачить Ядро й Флоу. ── */
  let ypShowFree=false;                 // розгорнуто «мрії без плану» — лише памʼять екрана
  function ypPct(g){ return Math.max(0,Math.min(100,jnPct(g)||0)); }
  function ypPill(g,on){
    const c=safeColor(g.color,'#5b8def'), ph=jnMissionPhoto(g), fin=mrFinish(g);
    return `<button class="yp-pill${on?' on':''}" data-ypg="${esc(g.id)}" aria-pressed="${on}" style="--c:${c}">
      ${ph?`<img src="${esc(ph)}" alt="" style="${jnMissionFocus(g,'obj')}">`:`<span class="yp-dot" aria-hidden="true"></span>`}
      <span><b>${esc(g.name||ypT('Ціль','Goal'))}</b><small>${ypPct(g)}%${fin?' · '+ypT('до ','by ')+esc(fin):''}</small></span></button>`;
  }
  function ypFreePill(free){
    if(!free.length) return '';
    const n=free.length, av=free.slice(0,3).map(w=>{ const s=safeImg(w.type==='video'?w.thumb:w.img)||''; return s?`<img src="${esc(s)}" alt="">`:''; }).join('');
    const lab=mrEn()?n+(n===1?' dream':' dreams')+' without a plan':n+' '+pluralUk(n,'мрія','мрії','мрій')+' без плану';
    return `<button class="yp-free" data-ypfree aria-expanded="${ypShowFree}"><span class="yp-av">${av}</span>${esc(lab)} ${ypShowFree?'⌃':'›'}</button>`;
  }
  // зв'язки цілі одним читанням Ядра; якщо Ядра нема — порожньо, плитки покажуть «＋»
  function ypLinks(g){
    try{ const gr=window.Core&&window.Core.graph(); const x=gr&&(gr.goals||[]).find(v=>v.id===String(g.id)); return (x&&x.links)||{}; }catch(_){ return {}; }
  }
  function ypHero(g){
    const c=safeColor(g.color,'#5b8def'), ph=jnMissionPhoto(g), pct=ypPct(g), fin=mrFinish(g), why=String(g.why||'').trim();
    const eb=[jnRole(g)==='main'?ypT('головна ціль','main goal'):ypT('ціль року','goal of the year'), fin?ypT('до ','by ')+fin:''].filter(Boolean).join(' · ');
    return `<button class="yp-hero${ph?' ph':''}" data-ypopen style="--c:${c};--p:${pct};${ph?`background-image:url('${esc(ph)}');${jnMissionFocus(g)}`:''}">
      <span class="yp-hb"><small>${esc(eb)}</small><b>${esc(g.name||ypT('Ціль','Goal'))}</b>
        <span>${why?esc(why.length>110?why.slice(0,109)+'…':why):ypT('Навіщо тобі ця ціль? Тапни — і допиши.','Why this goal? Tap and add a line.')}</span></span>
      <span class="yp-ring big" aria-hidden="true"><i>${pct}%</i></span></button>`;
  }
  function ypTiles(g){
    const L=ypLinks(g), fk=moOwnFolder(g.folderKey)?g.folderKey:'', sum=mrMoneySum(g);
    const tile=(attr,lab,val,sub,extra)=>`<button class="yp-tile${extra||''}" ${attr}><small>${lab}</small><b>${val}</b>${sub?`<span>${sub}</span>`:''}</button>`;
    let h='';
    if(fk){ const f=folders[fk], ch=(L.chats||[]).length;
      h+=tile('data-ypfold',ypT('Папка цілі','Goal folder'),`${safeEmoji(f.emoji,'📁')} ${esc(String(f.name||ypT('Папка','Folder')))} ›`,
        ch?esc(ch+' '+(mrEn()?(ch===1?'chat':'chats'):pluralUk(ch,'чат','чати','чатів'))):ypT('записи, фото, чати','notes, photos, chats')); }
    else h+=tile('data-ypfpick',ypT('Папка цілі','Goal folder'),ypT('＋ Привʼязати','＋ Link'),ypT('де житимуть записи цілі','where the goal notes live'),' add');
    if(sum){ const sv=mrSaved(g), w=Math.min(100,Math.round(sv/sum*100)), mt=ypMonthTarget(g), ms=ypMonthSaved(g);
      // етап 10: «цього місяця X з Y» і «＋ Відкласти» — наявна шторка переказу mrMoveSheet (людина підтверджує суму)
      h+=`<div class="yp-tile money"><button class="yp-tile-h" data-ypopen><small>${ypT('Гроші','Money')}</small><b>${esc(mrK(sv,g))} <em>${ypT('з ','of ')}${esc(mrK(sum,g))}</em></b>
        <i class="yp-bar"><u style="width:${w}%"></u></i>${mt?`<span class="${ms>=mt?'ok':'warm'}">${ypT('цього місяця ','this month ')}${esc(mrK(ms,g))} ${ypT('з ','of ')}${esc(mrK(mt,g))}</span>`:''}</button>
        ${sv<sum?`<button class="yp-tile-a" data-ypin>＋ ${ypT('Відкласти','Save')}</button>`:''}</div>`; }
    else h+=tile('data-ypsum',ypT('Гроші','Money'),ypT('＋ Сума цілі','＋ Target sum'),ypT('якщо на ціль треба гроші','if the goal needs money'),' add');
    const tm=L.time||{};
    h+=tile('data-ypgoplan',ypT('Час на ціль','Time on goal'),tm.blocks?esc(tm.blocks+' '+(mrEn()?(tm.blocks===1?'block':'blocks'):pluralUk(tm.blocks,'блок','блоки','блоків'))):'—',
      tm.blocks?ypT('за 7 днів · зроблено ','last 7 days · done ')+tm.done:ypT('блоки з ціллю в «Плані»','goal blocks in Plan'));
    const wk=ypWeekTasks(g), lv=jnLevels(g);
    h+=wk.length?tile('data-ypgoplan',ypT('У «Плані»','In Plan'),`${wk.filter(t=>t.done).length} ${ypT('з','of')} ${wk.length}`,ypT('цього тижня · відкрити ›','this week · open ›'),' plan')
      :tile('data-ypopen',ypT('Кроки року','Year steps'),`${lv.filter(m=>m.done).length} ${ypT('з','of')} ${lv.length}`,lv.length?'':ypT('додай 3–4 великі кроки','add 3–4 big steps'));
    return `<div class="yp-tiles">${h}</div>`;
  }
  // підказка темпу: скільки на місяць, щоб устигнути (етап 10 додасть «позаду / попереду»)
  /* ── гроші цілі за місяць (етап 10) ──
     Відкладено цього місяця — операції конверта цілі з датою цього місяця (in − out).
     Ціль на місяць — від стану на ПОЧАТОК місяця: (лишилось + уже відкладене цього місяця) / місяців до фінішу,
     інакше після кожного «Відкласти» вона сама зменшувалась би. */
  function ypMonthSaved(g,ym){
    try{ ym=ym||ymdLocal().slice(0,7); const e=mrEnv(g); if(!e||!Array.isArray(e.ops)) return 0;
      return Math.max(0,e.ops.reduce((a,o)=>a+(o&&String(o.date||'').slice(0,7)===ym?(o.t==='in'?+o.amount||0:-(+o.amount||0)):0),0)); }catch(_){ return 0; }
  }
  function ypMonthTarget(g){
    const sum=mrMoneySum(g); if(!sum) return 0;
    const d=mrDaysLeft(mrDueDs(g)); if(d===null||d<0) return 0;
    const need0=Math.max(0,sum-mrSaved(g))+ypMonthSaved(g);
    return need0?Math.ceil(need0/Math.max(1,Math.ceil(d/30.44))):0;
  }
  function ypTempo(g){
    const sum=mrMoneySum(g), mt=sum?ypMonthTarget(g):0; if(!mt) return '';
    const due=mrDueDs(g), ms=ypMonthSaved(g), left=Math.max(0,mt-ms), done=left<=0;
    return `<div class="yp-tempo${done?' ok':''}"><span class="yp-spark sm" aria-hidden="true">✦</span>
      <span>${ypT('Щоб устигнути','To make it')}${due?ypT(' до ',' by ')+esc(mrDate(due)):''}: <b>${esc(mrK(mt,g))}</b> ${ypT('на місяць','a month')}`
      +` · ${done?ypT('цього місяця вже є ✓','this month is done ✓'):ypT('цього місяця ще ','still this month ')+esc(mrK(left,g))}</span>
      ${done?`<button data-ypflow>${ypT('Розписати','Plan it')}</button>`:`<button data-ypin>${ypT('Відкласти','Save')}</button>`}</div>`;
  }
  /* ── трекери цілі (етап 8) ──
     Число — «зараз → мета» цілі (g.from/g.to, як у формі місії) + НОВЕ поле g.numLog=[{ds,v}]: історія записів
     для графіка й темпу. Пише лише «＋ Записати» після тапу (ypNumRecord). Щодня — наявний «Трекер цілі» в папці.
     Моменти — звичайні записи папки цілі: лише читаємо кількість і останній; пишуть у самій папці. */
  function ypNumLog(g){ return Array.isArray(g&&g.numLog)?g.numLog.filter(x=>x&&/^\d{4}-\d{2}-\d{2}$/.test(String(x.ds||''))&&isFinite(+x.v)):[]; }
  function ypFmtNum(v){ const n=+v; if(!isFinite(n)) return ''; try{ return n.toLocaleString(mrEn()?'en-US':'uk-UA',{maximumFractionDigits:2}); }catch(_){ return String(n); } }
  function ypSpark(vals){
    if(vals.length<2) return '';
    const mn=Math.min(...vals), mx=Math.max(...vals), w=120, h=30;
    const pts=vals.map((v,i)=>Math.round(i/(vals.length-1)*w)+','+Math.round(h-((v-mn)/((mx-mn)||1))*h)).join(' ');
    return `<svg class="yp-spk" viewBox="0 -2 ${w} ${h+4}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
  }
  // темп: де мало б бути число сьогодні, якщо рухатись рівно від першого запису до мети в день фінішу
  function ypNumPace(g,n){
    const L=ypNumLog(g), due=mrDueDs(g); if(!L.length||!due) return null;
    const d0=L[0].ds, td=ymdLocal(); if(!(due>d0)||td<d0) return null;
    const day=s=>new Date(s+'T12:00:00').getTime(), f=Math.min(1,(day(td)-day(d0))/(day(due)-day(d0)));
    const v0=+L[0].v, exp=v0+(n.to-v0)*f, up=n.to>=v0, diff=up?(n.cur-exp):(exp-n.cur);
    return {ok:diff>=-Math.abs(n.to-v0)*0.02, gap:Math.abs(Math.round((n.cur-exp)*100)/100)};
  }
  function ypMoments(fk){
    try{ const B=(typeof boards==='object'&&Array.isArray(boards[fk]))?boards[fk]:[]; const recs=[];
      const walk=a=>(a||[]).forEach(b=>{ if(!b) return; if(b.type!=='subs'&&b.type!=='divider') recs.push(b); if(Array.isArray(b.children)) walk(b.children); }); walk(B);
      const last=recs.slice().reverse().find(b=>String(b.text||b.title||'').replace(/<[^>]*>/g,'').trim());
      return {n:recs.length, last:last?String(last.text||last.title||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim():''}; }
    catch(_){ return {n:0,last:''}; }
  }
  function ypTrackers(g,full){
    const out=[], n=jnNum(g), fk=moOwnFolder(g.folderKey)?g.folderKey:'';
    if(n){ const L=ypNumLog(g), vals=L.slice(-12).map(x=>+x.v), pace=ypNumPace(g,n), manual=!jnNumIncome(g);
      out.push(`<div class="yp-trk num"><button class="yp-trk-h" data-ypopen><small>${ypT('Число','Number')}${pace?` · <em class="${pace.ok?'ok':'warn'}">${pace.ok?ypT('у темпі','on pace'):ypT('позаду на ','behind by ')+esc(ypFmtNum(pace.gap))}</em>`:''}</small>
        <b>${esc(ypFmtNum(n.cur))} → ${esc(ypFmtNum(n.to))}</b></button>${ypSpark(vals)}<i class="yp-bar"><u style="width:${n.pct}%"></u></i>
        ${manual?`<button class="yp-trk-a" data-ypnum>＋ ${ypT('Записати','Record')}</button>`:''}</div>`); }
    else if(full) out.push(`<button class="yp-trk add" data-ypnumset><small>${ypT('Число','Number')}</small><b>＋ ${ypT('Мета числом','Numeric target')}</b><span>${ypT('гроші, кг, км, сторінки','money, kg, km, pages')}</span></button>`);
    const tr=fk&&typeof moTracker==='function'?moTracker(fk):null;
    if(tr){ const st=moStreak(tr); out.push(`<button class="yp-trk" data-ypfold><small>${ypT('Щодня','Daily')}</small><b>${st} ${mrEn()?(st===1?'day':'days'):pluralUk(st,'день','дні','днів')}</b><span>${ypT('поспіль','in a row')}</span></button>`); }
    if(fk){ const mo=ypMoments(fk);
      out.push(`<button class="yp-trk" data-ypfold><small>${ypT('Моменти','Moments')}</small><b>${mo.n?esc(String(mo.n))+' '+(mrEn()?(mo.n===1?'record':'records'):pluralUk(mo.n,'запис','записи','записів')):ypT('＋ Перший момент','＋ First moment')}</b>`
        +`<span>${mo.last?esc(mo.last.length>40?mo.last.slice(0,39)+'…':mo.last):ypT('нотатки й фото в папці цілі','notes and photos in the goal folder')}</span></button>`); }
    return out.length?`<div class="yp-trks">${out.join('')}</div>`:'';
  }
  // «＋ Записати»: нове значення числа цілі → g.from (як у формі місії) + рядок історії за сьогодні
  function ypNumRecord(g,rer){
    const n=jnNum(g); if(!n||jnNumIncome(g)) return;
    inputModal({ title:ypT('Записати результат','Record a result'), value:String(n.cur), placeholder:ypT('Напр. 62000','E.g. 62000'), onOk:v=>{
      const x=jnNumOf(v); if(x===null){ try{ plToast(ypT('Потрібне число','A number is needed')); }catch(_){} return; }
      if(!ypReady()){ ypNotReady(); return; }
      const c=jnGoalById(g.id); if(!c) return;
      const td=ymdLocal();
      if(!Array.isArray(c.numLog)) c.numLog=[];
      // перший запис — точка відліку темпу: якщо історії ще нема, спершу кладемо «було» (поточне число)
      const old=jnNumOf(c.from);
      if(!c.numLog.length&&old!==null&&+old!==x) c.numLog.push({ds:td, v:+old, base:1});   // «було» — не перезаписується
      const last=c.numLog[c.numLog.length-1];
      if(last&&last.ds===td&&!last.base) last.v=x; else c.numLog.push({ds:td, v:x});        // другий запис за день — уточнення
      if(c.numLog.length>400) c.numLog=[c.numLog[0]].concat(c.numLog.slice(-399));   // перша точка — відлік темпу, лишається
      c.from=String(x); saveGoals();
      try{ plToast(ypT('Записано: ','Recorded: ')+ypFmtNum(x)); }catch(_){}
      if(typeof rer==='function') rer();
    }});
  }
  function ypWishCard(w){
    const src=safeImg(w.type==='video'?w.thumb:w.img)||'';
    return `<button class="yp-card wish ph" data-ypw="${esc(w.id)}" style="${src?`background-image:url('${esc(src)}')`:''}">
      <span class="yp-cn"><b>${esc(w.cap||ypT('Мрія','Dream'))}</b><small>＋ ${ypT('Зробити ціллю','Make it a goal')}</small></span></button>`;
  }
  function ypNewCard(){ return `<button class="yp-card add" data-ypnew><span aria-hidden="true">＋</span><b>${ypT('Нова ціль','New goal')}</b></button>`; }

  /* ── «Цей тиждень» (етап 2): крок тижня — ЗВИЧАЙНА справа «Плану» з датою і полем goalId.
     Одне джерело (plData().tasks у goals_data): галочка тут = галочка в «Плані», і навпаки.
     goalId пишеться лише в нову справу, створену тапом тут; старі справи не змінюються. ── */
  const YP_DOW={uk:['пн','вт','ср','чт','пт','сб','нд'],en:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']};
  function ypAddDays(ds,n){ const d=new Date(ds+'T12:00:00'); d.setDate(d.getDate()+n); return ymdLocal(d); }
  function ypWeekMon(){ const td=ymdLocal(); return ypAddDays(td,-((new Date(td+'T12:00:00').getDay()+6)%7)); }
  function ypDow(ds){ return (mrEn()?YP_DOW.en:YP_DOW.uk)[(new Date(ds+'T12:00:00').getDay()+6)%7]; }
  // справи цілі на цей тиждень + незроблені з минулих днів (їх «План» і так переносить на сьогодні)
  // етап 12: у суботу й неділю «тиждень» — до кінця НАСТУПНОГО тижня, бо саме тоді його й планують
  function ypWeekend(){ return [0,6].includes(new Date(ymdLocal()+'T12:00:00').getDay()); }
  function ypWeekEnd(){ return ypAddDays(ypWeekMon(), ypWeekend()?13:6); }
  function ypWeekTasks(g){
    const mon=ypWeekMon(), sun=ypWeekEnd();
    return (plData().tasks||[]).filter(t=>t&&String(t.goalId||'')===String(g.id)&&/^\d{4}-\d{2}-\d{2}$/.test(t.date||'')
        &&((t.date>=mon&&t.date<=sun)||(t.date<mon&&!t.done)))
      .sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  }
  function ypWeekHTML(g){
    const L=ypWeekTasks(g), mon=ypWeekMon(), done=L.filter(t=>t.done).length;
    const rows=L.map(t=>`<button class="yp-lv${t.done?' ok':''}" data-ypt="${esc(t.id)}" aria-pressed="${!!t.done}">
        <i aria-hidden="true"></i><span>${esc(t.t||'')}</span><small>${t.date<mon?ypT('з минулого','overdue'):(t.date>ypAddDays(mon,6)?ypT('наст. ','next ')+esc(ypDow(t.date)):esc(ypDow(t.date)))}</small></button>`).join('');
    return `<div class="yp-week"><div class="yp-wh"><b>${ypT('Цей тиждень','This week')}</b><span>${L.length?done+ypT(' з ',' of ')+L.length:''}</span></div>
      ${rows||`<p class="yp-none">${ypT('Кроків на тиждень ще нема — вони стануть справами в «Плані».','No steps this week yet — they become tasks in Plan.')}</p>`}
      <button class="yp-add in" data-ypweek>＋ ${ypWeekend()?ypT('Крок на тиждень','Step for the week'):ypT('Крок на цей тиждень','Step for this week')}</button></div>`;
  }
  function ypAddWeekStep(g,rer){
    inputModal({ title:ypT('Крок на цей тиждень','Step for this week'), placeholder:ypT('Напр. Відкласти ₴ 2 000','E.g. Put aside 50'), onOk:v=>{
      v=String(v||'').trim().slice(0,200); if(!v) return;
      const td=ymdLocal(), sun=ypWeekEnd(), days=[];   // у вихідні — і дні наступного тижня
      for(let ds=td; ds<=sun; ds=ypAddDays(ds,1)) days.push(ds);
      actionSheet({ title:ypT('Коли?','When?'), sub:v, items:days.map((ds,i)=>({ ic:'calendar',
        label:i===0?ypT('Сьогодні','Today'):i===1?ypT('Завтра','Tomorrow'):(ds>ypAddDays(ypWeekMon(),6)?ypT('наст. ','next '):'')+ypDow(ds)+', '+(+ds.slice(8)),
        onClick:()=>ypPushTask(g,v,ds,rer) })) });
    }});
  }
  // goals_data ще не прочитано (старт без мережі) — не пишемо, як «Забіг» (56-run.js rnReady)
  function ypReady(){ try{ return typeof window.storeKeyReady!=='function'||window.storeKeyReady('goals_data')===true; }catch(_){ return false; } }
  function ypNotReady(){ try{ plToast(ypT('Ще завантажуються цілі — спробуй за мить','Goals are still loading — try again in a moment')); }catch(_){} }
  function ypPushTask(g,v,ds,rer){
    if(!ypReady()){ ypNotReady(); return; }
    const cur=jnGoalById(g.id); if(!cur) return;   // ціль могли прибрати, поки відкрита шторка
    const t={ id:'t_'+Date.now()+'_'+Math.random().toString(36).slice(2,5), scope:'day', t:v, date:ds, c:'val', p:2, tag:'',
      done:false, open:false, subs:[], goalId:String(cur.id) };
    if(moOwnFolder(cur.folderKey)) t.folder=cur.folderKey;   // у «Плані» справа покаже папку цілі
    plData().tasks.push(t); saveGoals(); (typeof rer==='function'?rer:ypRender)();
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
        ${items||`<p class="yp-none">${ypT('Кроків ще нема','No steps yet')}</p>`}</li>`;
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
    const backL=(ypView==='goal'&&ypFromWall)?ypT('‹ Мої цілі','‹ My goals')
      :ypBack==='journal'?ypT('‹ Журнал','‹ Journal')
      :ypBack==='plan'?ypT('‹ План','‹ Plan')
      :(ypBack==='folder'&&moOwnFolder(ypBackFk))?'‹ '+String(folders[ypBackFk].name||ypT('Папка','Folder')).slice(0,24):ypT('‹ Огляд','‹ Overview');
    if(ypView==='wall') return ypWallHTML(backL);
    const ng=goals.length, cnt=ng?' · '+(mrEn()?ng+(ng===1?' goal':' goals'):ng+' '+pluralUk(ng,'ціль','цілі','цілей')):'';
    let h=`<div class="yp-top"><button class="back" data-ypback>${esc(backL)}</button>
        <div class="yp-head"><h1>${ypT('Мій рік','My year')}</h1><span>${ypT('до ','until ')}${esc(mrUntil())}${esc(cnt)}</span></div>
        <button class="yp-map" data-ypmap>${ypT('Усі мрії','All dreams')}</button>
        <button class="yp-flowtop" data-ypflow><span class="yp-spark sm" aria-hidden="true">✦</span>${ypT('Флоу, розпиши мій рік','Flow, plan my year')}</button></div>`;
    if(!g) return h+ypEmpty()+ypDoneShelf()+'<div class="yp-pad"></div>';
    h+=`<div class="yp-pills" role="group" aria-label="${ypT('Цілі року','Goals of the year')}">${goals.map(x=>ypPill(x,x===g)).join('')}
      <button class="yp-pill add" data-ypnew>＋ ${ypT('Нова ціль','New goal')}</button>${ypFreePill(free)}</div>`;
    if(ypShowFree&&free.length) h+=`<div class="yp-strip">${free.map(ypWishCard).join('')}</div>`;
    h+=`<div class="yp-main"><section class="yp-left">${ypHero(g)}${ypStatusRow(g)}${ypDoneHTML(g)}${ypTiles(g)}</section>
      <section class="yp-right">${ypWeekendHint()}${ypTempo(g)}${ypTrackers(g,true)}${ypWeekHTML(g)}
        <div class="yp-rh"><b>${ypT('Дорога року','Road of the year')}</b><span>${esc(MR_QN[mrQuarters()[0].q])} — ${esc(MR_QN[mrQuarters()[3].q])}</span></div>
        ${ypRoad(g)}
        <button class="mr-link" data-ypjn>${ypT('Точка Б, гроші й правила року ›','Point B, money and rules of the year ›')}</button></section></div>`+ypDoneShelf();
    return h+'<div class="yp-pad"></div>';
  }

  function ypRender(){
    const body=document.getElementById('ypBody'); if(!body) return;
    body.innerHTML=ypHTML();
    ypBind(body, ()=>jnGoalById(ypSel), ypRender);
    if(ypView==='wall') ypWallBind(body);
    ypDock();
  }
  /* обробники кнопок цілі — спільні для «Мого року» і картки цілі в папці (етап 7):
     cur() — жива ціль (свіжа з goalsData), rer() — перемалювати те місце, звідки тапнули */
  function ypBind(root, cur, rer){
    const q=s=>root.querySelectorAll(s);
    q('[data-ypback]').forEach(b=>b.onclick=()=>{
      if(ypView==='goal'&&ypFromWall){ ypView='wall'; ypFromWall=false; ypRender(); window.scrollTo(0,0); return; }   // «‹ Мої цілі»
      if(ypBack==='journal') goJournal(); else if(ypBack==='folder'&&moOwnFolder(ypBackFk)) goFolder(ypBackFk); else if(ypBack==='plan'&&typeof goPlan==='function') goPlan(true); else goHome(); });
    q('[data-ypmap]').forEach(b=>b.onclick=()=>goWishes({back:goYearPlanBack, label:ypT('‹ Мій рік','‹ My year')}));
    q('[data-ypg]').forEach(b=>b.onclick=()=>{
      if(ypSel===b.dataset.ypg){ const g=cur(); if(g) mrGoalPage(g); return; }   // повторний тап — відкрити ціль
      ypSel=b.dataset.ypg; rer();
    });
    q('[data-ypw]').forEach(b=>b.onclick=()=>wishToGoal(b.dataset.ypw, gid=>{ ypSel=String(gid); rer(); const g=jnGoalById(gid); if(g) mrGoalPage(g); }));
    q('[data-ypnew]').forEach(b=>b.onclick=mrNewGoal);
    q('[data-ypfree]').forEach(b=>b.onclick=()=>{ ypShowFree=!ypShowFree; rer(); });
    q('[data-ypflow]').forEach(b=>b.onclick=ypFlowOpen);
    q('[data-ypnext]').forEach(b=>b.onclick=ypFlowOpenNext);
    q('[data-ypcatch]').forEach(b=>b.onclick=()=>{ const g=jnGoalById(b.dataset.ypcatch); if(g) ypFlowCatch(g); });   // стіна й «Мій рік», 24.11   // етап 12
    q('[data-ypjn]').forEach(b=>b.onclick=()=>{ mrDetail=false; goJournal({tab:'year'}); });
    q('[data-ypopen]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) mrGoalPage(g); });
    q('[data-ypfpick]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) mrPickFolder(g,rer); });   // етап 3
    q('[data-ypsum]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) mrSumSheet(g,rer); });
    q('[data-ypfold]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g&&moOwnFolder(g.folderKey)) goFolder(g.folderKey); });
    q('[data-ypstep]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) mrAddStep(g,rer); });
    q('[data-ypweek]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) ypAddWeekStep(g,rer); });
    q('[data-ypgoplan]').forEach(b=>b.onclick=()=>{ if(typeof goPlan==='function') goPlan(); });
    q('[data-ypnum]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) ypNumRecord(g,rer); });   // етап 8
    q('[data-ypin]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) mrMoveSheet(g,'in',rer); });   // етап 10: наявна шторка «Відкласти»
    q('[data-ypproof]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) ypProofPhoto(g,rer); });   // етап 11
    q('[data-ypdone]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) ypMoveToDone(g,rer); });
    q('[data-ypshelf]').forEach(b=>b.onclick=()=>{ const g=jnGoalById(b.dataset.ypshelf); if(g) mrGoalPage(g); });
    q('[data-ypnumset]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) jnEditor(g,{after:rer}); });
    q('[data-ypyear]').forEach(b=>b.onclick=()=>{ const g=cur(); if(g) ypSel=String(g.id); goYearPlan({from:'folder', fk:b.dataset.ypyear}); });
    q('[data-ypt]').forEach(b=>b.onclick=()=>{
      if(!ypReady()){ ypNotReady(); return; }
      const t=(plData().tasks||[]).find(x=>x&&String(x.id)===b.dataset.ypt); if(!t) return;
      t.done=!t.done; saveGoals(); rer();
    });
    q('[data-ypms]').forEach(b=>b.onclick=()=>{
      if(!ypReady()){ ypNotReady(); return; }
      const g=cur(), m=g&&(g.ms||[]).find(x=>x&&String(x.id)===b.dataset.ypms);
      if(!m){ if(g) mrGoalPage(g); return; }   // крок не з «Дороги» (старий рівень) — правиться на сторінці цілі
      jnMsSetDone(m,!m.done); saveGoals(); rer();
    });
  }

  /* ════════ Етап 9: ціль у «Плані» (65-plan.js) — лише показ, запис лише тапом ════════
     День/Тиждень: чіп цілі в справі (task.goalId) і блоці (block.link.goalId). Місяць: віхи цілей цього
     місяця + скільки на цілі щомісяця. Рік: перша віха кожного місяця замість заглушки «окремим кроком». */
  function ypItemGoalId(it){ const r=it&&it.ref; if(!r) return ''; return String(r.goalId||(r.link&&r.link.goalId)||''); }
  function ypGoalChip(goalId){
    const g=goalId?jnGoalById(goalId):null; if(!g||jnStatus(g)==='archive') return '';
    const ph=jnMissionPhoto(g), c=safeColor(g.color,'#5b8def');
    return `<button class="pn-gchip" style="--gc:${c}" data-pngoal="${esc(g.id)}">${ph?`<img src="${esc(ph)}" alt="" style="${jnMissionFocus(g,'obj')}">`:'<i aria-hidden="true"></i>'}<span>${esc(String(g.name||'').slice(0,24))}</span></button>`;
  }
  function ypPerMonthAll(){ try{ return mrActive().reduce((a,g)=>a+(mrMoneySum(g)?ypMonthTarget(g):0),0); }catch(_){ return 0; } }
  function ypMonthSavedAll(ym){ try{ return mrActive().reduce((a,g)=>a+ypMonthSaved(g,ym),0); }catch(_){ return 0; } }
  function ypPlanMonthHTML(ym){
    const rows=[]; mrActive().forEach(g=>jnLevels(g).filter(m=>m.ym===ym).forEach(m=>rows.push({g,m})));
    const pm=ypPerMonthAll();
    if(!rows.length&&!pm) return '';
    const done=rows.filter(x=>x.m.done).length;
    const r=rows.map(({g,m})=>{ const ph=jnMissionPhoto(g);
      return `<button class="ypm-r${m.done?' ok':''}" data-pnms="${esc(g.id)}:${esc(m.id)}" aria-pressed="${!!m.done}" style="--gc:${safeColor(g.color,'#5b8def')}">
        <i class="ypm-c" aria-hidden="true"></i>${ph?`<img src="${esc(ph)}" alt="" style="${jnMissionFocus(g,'obj')}">`:'<i class="ypm-d" aria-hidden="true"></i>'}
        <span><b>${esc(String(m.t||''))}</b><small>${esc(String(g.name||''))}</small></span></button>`; }).join('');
    return (rows.length?`<div class="pn-lbl"><span>${ypT('Віхи місяця','Milestones this month')}</span><span>${done} ${ypT('з','of')} ${rows.length}</span></div><div class="pn-glass ypm">${r}</div>`:'')
      +(pm?`<button class="pn-glass ypm-money" data-pnyp><span>${ypT('На цілі цього місяця','For goals this month')}</span><b>${esc(money(ypMonthSavedAll(ym)))} <small>${ypT('з ','of ')}${esc(money(pm))}</small></b><em>${ypT('Мій рік ›','My year ›')}</em></button>`:'');
  }
  function ypPlanYearMs(ym){
    const L=[]; mrActive().forEach(g=>jnLevels(g).filter(m=>m.ym===ym).forEach(m=>L.push({g,m})));
    if(!L.length) return '';
    const x=L[0];
    return `<span class="ypy-m"><i style="background:${safeColor(x.g.color,'#5b8def')}"></i>${esc(String(x.m.t||'').slice(0,28))}${L.length>1?' +'+(L.length-1):''}</span>`;
  }
  function ypPlanYearFoot(){
    const gs=mrActive(), pm=ypPerMonthAll();
    if(!gs.length) return `<button class="pn-soon pn-glass" data-pnyp><b>${ypT('План року','Year plan')}</b>${ypT('Обери 1–3 мрії й зроби їх цілями — тут стануть їхні кроки по місяцях. Мій рік ›','Pick 1–3 dreams and make them goals — their monthly steps will show here. My year ›')}</button>`;
    const n=gs.length;
    return `<button class="pn-soon pn-glass ypy-f" data-pnyp><b>${esc(mrEn()?n+(n===1?' goal':' goals')+' this year':n+' '+pluralUk(n,'ціль','цілі','цілей')+' року')}</b>`
      +`${pm?ypT('на цілі щомісяця ','for goals each month ')+esc(money(pm))+' · ':''}${ypT('Мій рік ›','My year ›')}</button>`;
  }
  // тапи з «Плану»: чіп цілі, віха місяця, «Мій рік» — повертаємось у той самий вигляд «Плану»
  function ypPlanBind(root, rer){
    root.querySelectorAll('[data-pngoal]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); ypSel=b.dataset.pngoal; goYearPlan({from:'plan'}); });
    root.querySelectorAll('[data-pnyp]').forEach(b=>b.onclick=()=>goYearPlan({from:'plan', view:'wall'}));
    root.querySelectorAll('[data-pnms]').forEach(b=>b.onclick=()=>{
      if(!ypReady()){ ypNotReady(); return; }
      const [gid,mid]=String(b.dataset.pnms).split(':'), g=jnGoalById(gid), m=g&&(g.ms||[]).find(x=>x&&String(x.id)===mid);
      if(!m){ if(g) mrGoalPage(g); return; }   // віха не з «Дороги» — правиться на сторінці цілі
      jnMsSetDone(m,!m.done); saveGoals(); rer();
    });
  }

  /* ════════ Етап 11: «Здійснено» — замкнути коло мрія → ціль → реальність ════════
     Ціль на 100% показує картку «Здійснилось?»: фото-доказ (як mrAddPhoto: перевірка, що відкривається →
     PhotoDB → у мрію лише посилання w.proofImg; без PhotoDB — як раніше в pickProofPhoto) і «У Здійснені» —
     архів цілі після підтвердження. Полиця «Здійснені» внизу «Мого року» — лише показ. Банер Огляду
     підписом «Мій рік · ще N кроків» — лише текст на екрані. */
  function ypWishOf(g){ try{ return (wishes||[]).find(w=>w&&String(w.goalId||'')===String(g.id))||null; }catch(_){ return null; } }
  function ypDoneHTML(g){
    if(ypPct(g)<100) return '';
    const w=ypWishOf(g), proof=w&&w.proofImg?safeImg(w.proofImg):'';
    return `<div class="yp-done">${proof?`<img src="${esc(proof)}" alt="${ypT('Фото: як це вийшло','Photo: how it turned out')}">`:'<span class="yp-done-ic" aria-hidden="true">✓</span>'}
      <span class="yp-done-t"><b>${proof?ypT('Мрія стала реальністю','The dream came true'):ypT('Здійснилось?','Did it come true?')}</b>
        <small>${proof?ypT('Можна переносити на полицю «Здійснені».','You can move it to the “Done” shelf.'):ypT('Додай фото, як це вийшло насправді.','Add a photo of how it really turned out.')}</small></span>
      <span class="yp-done-a">${proof?'':`<button data-ypproof>${ypT('＋ Фото','＋ Photo')}</button>`}<button data-ypdone>${ypT('У Здійснені','To Done')}</button></span></div>`;
  }
  function ypDoneShelf(){
    let gs=[]; try{ gs=(goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)==='archive'&&ypPct(g)>=100); }catch(_){}
    if(!gs.length) return '';
    return `<div class="yp-rh"><b>${ypT('Здійснені','Done')}</b><span>${gs.length}</span></div><div class="yp-shelf">${gs.slice(-12).reverse().map(g=>{
      const w=ypWishOf(g), src=w?safeImg(w.proofImg||(w.type==='video'?w.thumb:w.img)||''):'', fo=w&&!w.proofImg?wishFocusObj(w):'';
      return `<button class="yp-sh" data-ypshelf="${esc(g.id)}">${src?`<img src="${esc(src)}" alt="" style="${fo}">`:'<i aria-hidden="true">✓</i>'}<span>${esc(String(g.name||''))}</span></button>`; }).join('')}</div>`;
  }
  function ypProofPhoto(g,rer){
    if(!ypReady()){ ypNotReady(); return; }
    // Карту бажань ще не прочитано — інакше доказ ляже в нову мрію-дубль, а не в наявну (рецензія даних, 22.11)
    try{ if(window.storeKeyReady&&window.storeKeyReady('wishes_board')!==true){ plToast(ypT('Карта бажань ще завантажується — спробуй за мить','The Vision board is still loading — try again in a moment')); return; } }catch(_){}
    const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.style.display='none'; document.body.appendChild(inp);
    inp.onchange=()=>{
      const f=inp.files&&inp.files[0]; inp.remove(); if(!f) return;
      compressImage(f, async dataUrl=>{
        const shows=await new Promise(res=>{ const im=new Image(); im.onload=()=>res(im.naturalWidth>0); im.onerror=()=>res(false); im.src=dataUrl; });
        if(!shows){ flowAlert(ypT('Це фото не вдалося відкрити. Спробуй JPG або PNG.','This photo could not be opened. Try JPG or PNG.')); return; }
        const q=jnGoalById(g.id); if(!q) return;
        let w=ypWishOf(q); const wid=w?w.id:'w'+Date.now()+'_d';
        const usePdb=!!(window.PhotoDB&&window.PhotoDB.available());
        // свій ключ на кожен знімок (як replaceWishPhoto): два пристрої не затруть доказ один одному
        let ref=dataUrl; try{ ref=await window.photoPut('wp_'+wid+'_'+Date.now().toString(36), dataUrl); }catch(_){}
        const stored=String(ref).slice(0,4)==='idb:';
        if(usePdb&&!stored){ flowAlert(ypT('Не вдалося зберегти фото. Спробуй ще раз.','Could not save the photo. Try again.')); return; }
        w=ypWishOf(q);   // мрію могли змінити, поки йшов запис фото
        if(w) w.proofImg=stored?ref:dataUrl;
        else wishes.push({id:wid, img:stored?ref:dataUrl, proofImg:stored?ref:dataUrl, cap:String(q.name||'').slice(0,60), size:'sq', goalId:String(q.id)});
        saveWishes(); try{ renderWishes(); }catch(_){}
        try{ plToast(ypT('Мрія стала реальністю ✓','The dream came true ✓')); }catch(_){}
        if(typeof rer==='function') rer();
      });
    };
    inp.click();
  }
  function ypMoveToDone(g,rer){
    // не confirmSheet: там кнопка завжди «небезпечна» з кошиком, а тут нічого не видаляється
    actionSheet({ title:ypT('Перенести в «Здійснені»?','Move to “Done”?'),
      sub:'«'+String(g.name||'')+'» '+ypT('зникне зі списку цілей року й ляже на полицю «Здійснені». Нічого не видаляється.','leaves this year’s goals and goes to the “Done” shelf. Nothing is deleted.'),
      items:[{ic:'target', label:ypT('Перенести','Move'), primary:true, onClick:()=>{
        if(!ypReady()){ ypNotReady(); return; }
        const q=jnGoalById(g.id); if(!q) return;
        q.status='archive'; saveGoals();
        if(String(ypSel)===String(q.id)) ypSel='';
        try{ plToast(ypT('На полиці «Здійснені»','On the “Done” shelf')); }catch(_){}
        if(typeof rer==='function') rer();
      }}] });
  }
  // банер Карти бажань на Огляді: «Мої цілі · 1 позаду» / «Мої цілі · 3» — лише підпис на екрані (24.11: стіна)
  function ypHomeHint(){
    try{ const el=document.querySelector('#summaryCard .wishlink'); if(!el) return;
      const act=mrActive().filter(g=>ypPct(g)<100); if(!act.length){ el.textContent=ypT('Мої цілі ›','My goals ›'); return; }
      const bh=act.filter(g=>ypStatus(g).k==='behind').length;
      el.textContent=bh?(mrEn()?'My goals · '+bh+' behind ›':'Мої цілі · '+bh+' позаду ›'):ypT('Мої цілі · ','My goals · ')+act.length+' ›';
    }catch(_){}
  }


  /* ════════ Етап 7: ціль у папці (П1) ════════
     Папка, до якої привʼязана ціль (goal.folderKey), показує під обкладинкою картку цілі: фото, %, квартали,
     трекери, «Цей тиждень» і перехід у «Мій рік». Кличе 36-chats.js (fhBelowRender) — лише показ;
     пише тільки після тапу тими самими обробниками, що й «Мій рік» (ypBind). Обкладинка папки без власної
     обкладинки бере фото мрії цілі — теж лише на екрані (fhCoverStyle), нічого не зберігається. */
  function ypGoalsOfFolder(fk){ try{ return mrActive().filter(g=>g&&String(g.folderKey||'')===String(fk)); }catch(_){ return []; } }
  function ypFolderGoalPhoto(fk){ const g=ypGoalsOfFolder(fk)[0]; return g?jnMissionPhoto(g):''; }
  function ypFolderGoalFocus(fk){ const g=ypGoalsOfFolder(fk)[0]; return g?jnMissionFocus(g):''; }   // точка фокусу для обкладинки папки
  function ypFolderGoalHTML(fk){
    const gs=ypGoalsOfFolder(fk); if(!gs.length) return '';
    const g=gs[0], ph=jnMissionPhoto(g), pct=ypPct(g), fin=mrFinish(g), c=safeColor(g.color,'#5b8def');
    const qs=mrQuarters().map((qq,i)=>{ const lv=mrLvIn(g,qq), d=lv.filter(m=>m.done).length;
      return `<span class="ypf-q${i===0?' now':''}"><small>${YP_QN[qq.q]}${i===0?' · '+ypT('зараз','now'):''}</small>`
        +`<b>${lv.length?esc(String(lv[0].t||''))+(lv.length>1?' +'+(lv.length-1):''):'—'}</b>${lv.length?`<i>${d}/${lv.length}</i>`:''}</span>`; }).join('');
    const more=gs.length>1?(mrEn()?' · +'+(gs.length-1)+' more':' · ще '+(gs.length-1)):'';
    return `<section class="ypf" data-ypfg="${esc(g.id)}" style="--c:${c};--p:${pct}">
      <button class="ypf-h" data-ypopen>${ph?`<img src="${esc(ph)}" alt="" style="${jnMissionFocus(g,'obj')}">`:'<span class="ypf-dot" aria-hidden="true"></span>'}
        <span class="ypf-t"><small>${ypT('ціль цієї папки','goal of this folder')}${fin?' · '+ypT('до ','by ')+esc(fin):''}</small><b>${esc(g.name||ypT('Ціль','Goal'))}</b></span>
        <span class="yp-ring" aria-hidden="true"><i>${pct}</i></span></button>
      <div class="ypf-qs">${qs}</div>
      ${ypTrackers(g)}
      ${ypWeekHTML(g)}
      <button class="mr-link" data-ypyear="${esc(fk)}">${ypT('Уся ціль у «Моєму році» ›','The whole goal in My year ›')}${esc(more)}</button>
    </section>`;
  }
  function ypFolderGoalBind(box,fk,rer){
    const sec=box&&box.querySelector('.ypf'); if(!sec) return;
    const gid=sec.dataset.ypfg;
    ypBind(sec, ()=>jnGoalById(gid), rer);
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
  // етап 12: у вихідні — підказка спланувати наступний тиждень; кнопка лише ВПИСУЄ питання Флоу
  function ypWeekendHint(){
    if(!ypWeekend()||!ypPrefs().flow) return '';
    return `<div class="yp-tempo"><span class="yp-spark sm" aria-hidden="true">✦</span><span>${ypT('Вихідні — час спланувати наступний тиждень.','Weekend — time to plan next week.')}</span>`
      +`<button data-ypnext>${ypT('Флоу, допоможи','Flow, help')}</button></div>`;
  }
  function ypFlowOpenNext(){
    if(!window.aiChatSheet) return;
    const q=ypT('Сплануй мій наступний тиждень: подивись цілі й те, що вже зроблено цього тижня, і запропонуй пакетом 2–3 кроки на наступний тиждень для кожної цілі, з датами.',
      'Plan my next week: look at my goals and what got done this week, and suggest as one batch 2–3 steps for next week for each goal, with dates.');
    window.aiChatSheet();
    setTimeout(()=>{ const i=document.getElementById('aiInput'); if(i&&!i.value){ i.value=q; try{ i.dispatchEvent(new Event('input',{bubbles:true})); i.focus(); }catch(_){} } }, 60);
  }
  function ypFlowOpen(){
    if(!window.aiChatSheet) return;
    const q=ypFlowAsk(); window.aiChatSheet();
    setTimeout(()=>{ const i=document.getElementById('aiInput'); if(i&&!i.value){ i.value=q; try{ i.dispatchEvent(new Event('input',{bubbles:true})); i.focus(); }catch(_){} } }, 60);
  }
  function ypDock(){
    let d=document.getElementById('ypFlow');
    if(!d){ d=document.createElement('button'); d.id='ypFlow'; d.type='button'; d.className='yp-flow'; document.body.appendChild(d); d.onclick=ypFlowOpen; }
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

  /* ════════ «Мої цілі» — стіна мрій (О1, 24.11.2026) ════════
     Банер Карти бажань тепер відкриває ЗАГАЛЬНУ картину: усі цілі колажем — %, днів до фінішу, стан із причиною;
     тап по картці — «Мій рік» на цій цілі, «‹ Мої цілі» — назад. Лише показ; пише тільки тапом наявними
     обробниками (галочка справи, «Відкласти» = mrMoveSheet, «Зробити ціллю» = wishToGoal). Нових ключів нема. */
  let ypView='goal';                    // 'wall' — стіна, 'goal' — «Мій рік» однієї цілі (памʼять екрана)
  let ypFromWall=false;                 // «Мій рік» відкрито зі стіни — «назад» веде на стіну
  let ypWallF='all';                    // фільтр стіни: 'all' | 'behind' | 'done'
  /* Вкладки «Мрії · Шлях» (25.11.2026): Мрії — стіна; Шлях — що робити (етап 2). Остання вкладка — зручність
     цього пристрою, тому localStorage (як памʼять фільтрів), а не хмара. */
  let ypTab=(()=>{ try{ return localStorage.getItem('yp_tab')==='path'?'path':'dreams'; }catch(_){ return 'dreams'; } })();
  function ypSetTab(t){ ypTab=t==='path'?'path':'dreams'; try{ localStorage.setItem('yp_tab',ypTab); }catch(_){} ypRender(); }
  /* ⚙ «Моїх цілей» — goalsData.ypPrefs (ключ goals_data, синк як у цілей): sens — коли ціль «позаду»,
     flow — чи Флоу сам підказує про цілі. Пишеться лише тапом людини і лише після ypReady(). */
  const YP_SENS=['soft','norm','strict'];
  function ypPrefs(){
    let p={}; try{ p=(goalsData&&goalsData.ypPrefs&&typeof goalsData.ypPrefs==='object')?goalsData.ypPrefs:{}; }catch(_){}
    return { sens:YP_SENS.includes(p.sens)?p.sens:'norm', flow:p.flow!==false };
  }
  function ypSetPref(k,v){
    if(!ypReady()){ ypNotReady(); return false; }
    if(!goalsData.ypPrefs||typeof goalsData.ypPrefs!=='object') goalsData.ypPrefs={};
    goalsData.ypPrefs[k]=v; saveGoals(); return true;
  }

  // день початку цілі: свій start/розклад → мітка часу в id (g_m_<ms>, g_<ms>) → перший запис числа
  function ypStartDs(g){
    if(mrDueOk(g.start)) return g.start;
    if(g.sched&&mrDueOk(g.sched.start)) return g.sched.start;
    const m=String(g.id||'').match(/(\d{12,})/); if(m){ const d=new Date(+m[1]); if(!isNaN(d)&&d.getFullYear()>2020) return ymdLocal(d); }
    const L=ypNumLog(g); return L.length?L[0].ds:'';
  }
  function ypPrevYm(){ return ypYm(-1); }
  /* Стан цілі — ОДНЕ правило для стіни й «Мого року» (рішення 23.11: А + Б):
     Б) конкретні сигнали — пропущена віха, гроші минулого місяця, «Число» відстає від темпу — з причиною;
     А) якщо сигналам нема з чого рахувати, але є фініш і відсоток — час: минуло X% часу, зроблено Y% (люфт 10 пунктів);
     нема ні віх, ні грошей, ні числа, ні відсотка — «без кроків». */
  function ypStatus(g){
    const pct=ypPct(g);
    if(pct>=100||jnStatus(g)==='archive') return {k:'done'};
    const td=ymdLocal(), qs=mrQuarters()[0], qStart=qs.y+'-'+String(qs.q*3+1).padStart(2,'0');
    const lv=jnLevels(g), sum=mrMoneySum(g), n=jnNum(g), pace=n?ypNumPace(g,n):null;
    const sens=ypPrefs().sens, slack=sens==='soft'?20:sens==='strict'?5:10;   // ⚙: Мʼяко · Звичайно · Суворо
    const why=[];
    // 1) віха минулого кварталу (або з власною датою, що минула) — не відмічена
    const miss=lv.find(m=>!m.done&&(mrDueOk(m.due)?m.due<td:m.ym<qStart));
    if(miss) why.push(ypT('пропущено крок «','missed step “')+String(miss.t||'').slice(0,40)+ypT('»','”'));
    // 2) гроші: за минулий місяць відкладено менше, ніж треба щомісяця (лише якщо ціль уже жила того місяця)
    if(sum&&mrSaved(g)<sum){
      const per=mrPerMonth(g), pym=ypPrevYm(), st=ypStartDs(g);
      if(per>0&&st&&st.slice(0,7)<=pym){ const got=ypMonthSaved(g,pym);
        if(sens==='soft'?got<=0:got<per) why.push(ypT('за ','for ')+mrMonth(pym,true)+' '+mrK(got,g)+ypT(' з ',' of ')+mrK(per,g)); }
    }
    // 3) «Число» відстає від темпу (те саме, що показує трекер)
    if(pace&&!pace.ok&&sens!=='soft') why.push(ypT('«Число» позаду на ','Number behind by ')+ypFmtNum(pace.gap));
    if(why.length) return {k:'behind', why:why[0], n:why.length};
    if((lv.length||sum||pace)&&sens!=='strict') return {k:'ok'};   // суворо — час перевіряємо завжди
    // А) запасне правило часу — коли сигналам нема з чого рахувати
    const due=mrDueDs(g), st=ypStartDs(g);
    if(due&&st&&due>st&&jnHasMeasure(g)){
      const day=s=>new Date(s+'T12:00:00').getTime(), f=Math.max(0,Math.min(1,(day(td)-day(st))/(day(due)-day(st))));
      const tp=Math.round(f*100);
      if(tp-pct>slack) return {k:'behind', why:ypT('минуло ','')+tp+ypT('% часу, зроблено ','% of time gone, ')+pct+ypT('%','% done')};
      return {k:'ok'};
    }
    return (jnHasMeasure(g)||lv.length||sum||pace)?{k:'ok'}:{k:'none'};
  }
  function ypStatusTxt(s){
    return s.k==='done'?ypT('здійснено','done'):s.k==='behind'?ypT('позаду · ','behind · ')+s.why:s.k==='none'?ypT('кроків ще нема','no steps yet'):ypT('у темпі','on track');
  }
  // «Мій рік»: стан цілі під героєм — лише коли позаду (з причиною й «Наздогнати»)
  function ypStatusRow(g){
    const s=ypStatus(g); if(s.k!=='behind') return '';
    return `<div class="yp-tempo yw-behind"><span>${esc(ypT('Позаду: ','Behind: ')+s.why)}</span><button data-ypcatch="${esc(g.id)}">✦ ${ypT('Наздогнати','Catch up')}</button></div>`;
  }
  function ypDaysTxt(g){
    const d=mrDaysLeft(mrDueDs(g)); if(d===null) return '';
    if(d<0) return ypT('фініш минув','past finish');
    return mrEn()?d+(d===1?' day left':' days left'):'ще '+d+' '+pluralUk(d,'день','дні','днів');
  }
  // для лічильника на Огляді: найближчий фініш серед активних цілей (сьогодні й далі)
  function ypNearestGoal(){
    try{ const td=ymdLocal(); let best=null;
      mrActive().forEach(g=>{ if(ypPct(g)>=100) return; const ds=mrDueDs(g); if(!ds||ds<td) return; if(!best||ds<best.ds) best={g,ds}; });
      return best; }catch(_){ return null; }
  }
  window.ypNearest=function(){ const b=ypNearestGoal(); return b?{name:String(b.g.name||''), ds:b.ds}:null; };
  function ypDoneGoals(){
    try{ return (goalsData.goals||[]).filter(g=>g&&g.id&&ypPct(g)>=100&&(jnStatus(g)==='archive'||jnStatus(g)==='active')); }catch(_){ return []; }
  }

  function ypWallCard(g,big){
    const s=ypStatus(g), c=safeColor(g.color,'#5b8def'), ph=jnMissionPhoto(g), pct=ypPct(g);
    const w=s.k==='done'?ypWishOf(g):null, proof=w&&w.proofImg?safeImg(w.proofImg):'', src=proof||ph;
    const fp=proof?'':jnMissionFocus(g);   // фото-доказ — інший знімок, для нього точки нема
    const role=jnRole(g)==='main'&&s.k!=='done'?`<span class="yw-tag">${ypT('головна','main')}</span>`:'';
    const meta=s.k==='done'?'':[s.k==='none'?'':pct+'%', ypDaysTxt(g)].filter(Boolean).join(' · ');
    return `<div class="yw-card${big?' big':''}${src?' ph':''} st-${s.k}" style="--c:${c};${src?`background-image:url('${esc(src)}');${fp}`:''}">
      <button class="yw-hit" data-ypwall="${esc(g.id)}" aria-label="${esc(String(g.name||ypT('Ціль','Goal'))+' — '+ypStatusTxt(s))}"></button>
      ${role}${s.k==='done'?'<span class="yw-ok" aria-hidden="true">✓</span>':''}
      <button class="yw-more" data-ypwmore="${esc(g.id)}" aria-label="${esc(ypT('Дії з ціллю','Goal actions'))}">⋯</button>
      <div class="yw-b"><b>${esc(String(g.name||ypT('Ціль','Goal')))}</b>
        ${meta?`<span class="yw-m">${esc(meta)}</span>`:''}${big&&s.k!=='done'?`<i class="yw-bar"><u style="width:${pct}%"></u></i>`:''}
        <small class="yw-s">${esc(ypStatusTxt(s))}</small>
        ${s.k==='behind'?`<button class="yw-catch" data-ypcatch="${esc(g.id)}">✦ ${ypT('Наздогнати','Catch up')}</button>`
          :s.k==='none'?`<button class="yw-catch" data-ypplan="${esc(g.id)}">＋ ${ypT('Розписати','Plan it')}</button>`:''}</div></div>`;
  }
  // «Цей тиждень — усі цілі»: ті самі справи «Плану» з goalId, що й у «Моєму році»
  function ypWallWeek(goals){
    const rows=[]; goals.forEach(g=>ypWeekTasks(g).forEach(t=>rows.push({g,t})));
    rows.sort((a,b)=>String(a.t.date).localeCompare(String(b.t.date)));
    const mon=ypWeekMon(), done=rows.filter(x=>x.t.done).length;
    const r=rows.map(({g,t})=>`<button class="yp-lv${t.done?' ok':''}" data-ypt="${esc(t.id)}" aria-pressed="${!!t.done}" style="--c:${safeColor(g.color,'#5b8def')}">
        <i aria-hidden="true"></i><span>${esc(t.t||'')}<em>${esc(String(g.name||''))}</em></span><small>${t.date<mon?ypT('з минулого','overdue'):(t.date>ypAddDays(mon,6)?ypT('наст. ','next ')+esc(ypDow(t.date)):esc(ypDow(t.date)))}</small></button>`).join('');
    return `<div class="yp-week yw-week"><div class="yp-wh"><b>${ypT('Цей тиждень — усі цілі','This week — all goals')}</b><span>${rows.length?done+ypT(' з ',' of ')+rows.length:''}</span></div>
      ${r||`<p class="yp-none">${ypT('Кроків на тиждень ще нема. Відкрий ціль і додай крок — або попроси Флоу.','No steps this week yet. Open a goal and add one, or ask Flow.')}</p>`}</div>`;
  }
  function ypWallMoney(){
    const pm=ypPerMonthAll(); if(!pm) return '';
    const ms=ypMonthSavedAll(), ok=ms>=pm;
    return `<div class="yp-tempo yw-money${ok?' ok':''}"><span>${ypT('На цілі цього місяця ','For goals this month ')}<b>${esc(money(ms))}</b>${ypT(' з ',' of ')}${esc(money(pm))}</span>
      ${ok?`<em>✓</em>`:`<button data-ypwin>${ypT('Відкласти','Save')}</button>`}</div>`;
  }
  // лінія фінішів (комп'ютер): цілі на відрізку «сьогодні → точка Б»
  function ypWallLine(goals){
    const td=ymdLocal(), end=ylDate(ylLetter()); if(!mrDueOk(end)||end<=td) return '';
    const day=s=>new Date(s+'T12:00:00').getTime(), span=day(end)-day(td);
    const dots=goals.map(g=>{ const ds=mrDueDs(g); if(!ds||ds<td) return '';
      const x=Math.min(100,Math.round((day(ds)-day(td))/span*100)), ph=jnMissionPhoto(g), s=ypStatus(g);
      return `<button class="yw-dot st-${s.k}" data-ypwall="${esc(g.id)}" style="left:${x}%;--c:${safeColor(g.color,'#5b8def')}" title="${esc(String(g.name||'')+' · '+mrDate(ds))}">${ph?`<img src="${esc(ph)}" alt="" style="${jnMissionFocus(g,'obj')}">`:''}</button>`; }).join('');
    return `<div class="yw-line"><div class="yp-wh"><b>${ypT('Лінія фінішів','Finish line')}</b><span>${ypT('до ','until ')}${esc(mrUntil())}</span></div>
      <div class="yw-track"><i class="yw-rail"></i>${dots}</div><div class="yw-ends"><span>${ypT('сьогодні','today')}</span><span>${ypT('точка Б','point B')}</span></div></div>`;
  }
  function ypWallHTML(backL){
    const goals=mrActive(), done=ypDoneGoals(), act=goals.filter(g=>ypPct(g)<100);
    const st=new Map(act.map(g=>[g,ypStatus(g)])), behind=act.filter(g=>st.get(g).k==='behind'), free=ypFreeWishes();
    const avg=act.length?Math.round(act.reduce((a,g)=>a+ypPct(g),0)/act.length):0;
    const pbDays=mrDaysLeft(ylDate(ylLetter()));
    let h=`<div class="yp-top"><button class="back" data-ypback>${esc(backL)}</button>
        <div class="yp-head"><h1>${ypT('Мої цілі','My goals')}</h1><span>${ypT('до ','until ')}${esc(mrUntil())}</span></div>
        <button class="yp-map" data-ypwmap>${ypT('Колаж','Collage')}</button></div>
      <div class="yw-tabrow"><div class="yw-tabs" role="tablist" aria-label="${esc(ypT('Вигляд цілей','Goals view'))}">
        <button role="tab" data-yptab="dreams" aria-selected="${ypTab==='dreams'}">${ypT('Мрії','Dreams')}</button>
        <button role="tab" data-yptab="path" aria-selected="${ypTab==='path'}">${ypT('Шлях','Path')}</button></div>
        <button class="yp-gear" data-ypset aria-label="${esc(ypT('Налаштування цілей','Goal settings'))}" aria-haspopup="dialog">⚙</button></div>`;
    if(!goals.length&&!done.length) return h+ypEmpty()+'<div class="yp-pad"></div>';
    if(ypTab==='path') return h+ypPathHTML(goals)+'<div class="yp-pad"></div>';
    const pl=(n,a,b,c,e1,e2)=>mrEn()?(n===1?e1:e2):pluralUk(n,a,b,c);
    h+=`<div class="yw-stats"><div><b>${act.length}</b><span>${pl(act.length,'ціль','цілі','цілей','goal','goals')}</span></div>
      <div><b class="acc">${avg}%</b><span>${ypT('разом','overall')}</span></div>
      ${pbDays!==null&&pbDays>=0?`<div><b>${pbDays}</b><span>${ypT('днів до точки Б','days to point B')}</span></div>`:''}</div>`;
    if(ypWallF==='behind'&&!behind.length) ypWallF='all';
    if(ypWallF==='done'&&!done.length) ypWallF='all';
    const fb=(k,lab)=>`<button class="yw-f${ypWallF===k?' on':''}" data-ypwf="${k}" aria-pressed="${ypWallF===k}">${lab}</button>`;
    h+=`<div class="yw-fs" role="group" aria-label="${ypT('Фільтр цілей','Filter goals')}">${fb('all',ypT('Усі','All'))}`
      +(behind.length?fb('behind',ypT('Позаду · ','Behind · ')+behind.length):'')+(done.length?fb('done',ypT('Здійснені · ','Done · ')+done.length):'')+'</div>';
    const list=ypWallF==='behind'?behind:ypWallF==='done'?done:act.concat(done);
    const cards=list.map((g,i)=>ypWallCard(g, i===0&&ypWallF==='all'&&list.length>2)).join('');
    let left=`<div class="yw-grid">${cards}</div>`+(ypWallF==='all'?`<button class="yw-free yw-new" data-ypnew><em>＋ ${ypT('Нова ціль','New goal')}</em></button>`:'');
    if(free.length&&ypWallF==='all'){
      left+=`<button class="yw-free" data-ypfree aria-expanded="${ypShowFree}"><span class="yp-av">${free.slice(0,3).map(w=>{ const s=safeImg(w.type==='video'?w.thumb:w.img)||''; return s?`<img src="${esc(s)}" alt="">`:''; }).join('')}</span>
        <span>${mrEn()?free.length+(free.length===1?' dream':' dreams')+' without a plan':free.length+' '+pluralUk(free.length,'мрія','мрії','мрій')+' ще без плану'}</span><em>＋ ${ypT('Зробити ціллю','Make it a goal')}</em></button>`;
      if(ypShowFree) left+=`<div class="yp-strip">${free.map(ypWishCard).join('')}</div>`;
    }
    h+=`<div class="yw-main"><section class="yw-left">${left}</section><section class="yw-right">${ypWallLine(act)}${ypWallWeek(act)}${ypWallMoney()}</section></div>`;
    return h+'<div class="yp-pad"></div>';
  }
  function ypWallBind(root){
    const q=s=>root.querySelectorAll(s);
    q('[data-ypwall]').forEach(b=>b.onclick=()=>{ ypSel=String(b.dataset.ypwall); ypView='goal'; ypFromWall=true; ypRender(); window.scrollTo(0,0); });
    // ⋯ на картці: відкрити ціль і «Кадр фото» — точка фокусу мрії цілі (wishFocusEditor, 06-wishes.js)
    q('[data-ypwmore]').forEach(b=>b.onclick=e=>{ e.stopPropagation();
      const g=jnGoalById(b.dataset.ypwmore); if(!g) return;
      const w=(wishes||[]).find(x=>x&&String(x.goalId||'')===String(g.id)&&(x.type==='video'?x.thumb:x.img));
      const items=[{ic:'target', label:ypT('Відкрити ціль','Open goal'), primary:true, onClick:()=>{ ypSel=String(g.id); ypView='goal'; ypFromWall=true; ypRender(); window.scrollTo(0,0); }}];
      if(w) items.push({ic:'crop', label:ypT('Кадр фото','Photo focus'), sub:wishFocusXY(w)?ypT('Точку вибрано · тап, щоб змінити','Point set · tap to change'):ypT('Що має бути видно на всіх картках','What must stay visible on every card'),
        onClick:()=>wishFocusEditor(w.id, ypRender)});
      else items.push({ic:'photo', label:ypT('Додати фото','Add a photo'), sub:ypT('на сторінці цілі','on the goal page'), onClick:()=>mrGoalPage(g)});
      actionSheet({ title:String(g.name||ypT('Ціль','Goal')), items });
    });
    q('[data-yptab]').forEach(b=>b.onclick=()=>{ if(b.dataset.yptab!==ypTab) ypSetTab(b.dataset.yptab); });
    q('[data-ypset]').forEach(b=>b.onclick=()=>ypSettings(b));
    q('[data-yptoday]').forEach(b=>b.onclick=()=>ypAddTodayStep(mrActive()));
    q('[data-ypcatchall]').forEach(b=>b.onclick=ypFlowCatchAll);
    q('[data-ypwf]').forEach(b=>b.onclick=()=>{ ypWallF=b.dataset.ypwf; ypRender(); });
    q('[data-ypwmap]').forEach(b=>b.onclick=()=>goWishes({back:goYearPlanBack, label:ypT('‹ Мої цілі','‹ My goals')}));
    q('[data-ypw]').forEach(b=>b.onclick=()=>wishToGoal(b.dataset.ypw, gid=>{ ypSel=String(gid); ypRender(); }));
    q('[data-ypplan]').forEach(b=>b.onclick=()=>{ const g=jnGoalById(b.dataset.ypplan); if(g) mrAddStep(g,ypRender); });
    q('[data-ypwin]').forEach(b=>b.onclick=()=>{
      const gs=mrActive().filter(g=>mrMoneySum(g)&&mrSaved(g)<mrMoneySum(g));
      if(gs.length===1){ mrMoveSheet(gs[0],'in',ypRender); return; }
      actionSheet({ title:ypT('На яку ціль відкласти?','Save for which goal?'), items:gs.map(g=>({ ic:'target',
        label:String(g.name||'')+' · '+ypT('цього місяця ','this month ')+mrK(ypMonthSaved(g),g)+ypT(' з ',' of ')+mrK(ypMonthTarget(g),g),
        onClick:()=>mrMoveSheet(g,'in',ypRender) })) });
    });
  }
  /* ════════ «Шлях» (етап 2, 25.11.2026) — що робити, а не лише як справи ════════
     Згори вниз: сьогодні для цілей → що позаду (одна кнопка на всі) → головна ціль великим фото → решта рядками → гроші.
     Лише показ: справи — ті самі plData().tasks з goalId, що в «Плані» й «Цьому тижні»; галочка — наявний data-ypt (ypBind). */
  function ypTodayTasks(goals){
    const td=ymdLocal(), ids=new Set(goals.map(g=>String(g.id))), rows=[];
    (plData().tasks||[]).forEach(t=>{ if(!t||!ids.has(String(t.goalId||''))||!/^\d{4}-\d{2}-\d{2}$/.test(t.date||'')) return;
      if(t.date===td||(t.date<td&&!t.done)) rows.push(t); });
    return rows.sort((a,b)=>(a.done?1:0)-(b.done?1:0)||String(a.date).localeCompare(String(b.date)));
  }
  function ypPathToday(goals){
    const L=ypTodayTasks(goals), done=L.filter(t=>t.done).length, td=ymdLocal();
    const r=L.map(t=>{ const g=jnGoalById(t.goalId), ph=g?jnMissionPhoto(g):'';
      return `<button class="yp-lv ypp-t${t.done?' ok':''}" data-ypt="${esc(t.id)}" aria-pressed="${!!t.done}">
        <i aria-hidden="true"></i>${ph?`<img src="${esc(ph)}" alt="" style="${g?jnMissionFocus(g,'obj'):''}">`:''}
        <span>${esc(t.t||'')}<em>${esc(g?String(g.name||''):'')}${t.date<td?' · '+ypT('з минулого','overdue'):''}</em></span></button>`; }).join('');
    return `<section class="ypp-card ypp-today"><div class="yp-wh"><b>${ypT('Сьогодні для цілей','Today for your goals')}</b><span>${L.length?done+ypT(' з ',' of ')+L.length:''}</span></div>
      ${r||`<p class="yp-none">${ypT('На сьогодні кроків нема. Один маленький крок — і ціль ближче.','No steps for today. One small step brings a goal closer.')}</p>`}
      <button class="yp-add in" data-yptoday>＋ ${ypT('Крок на сьогодні','Step for today')}</button></section>`;
  }
  function ypPathBehind(act){
    const bh=act.filter(g=>ypStatus(g).k==='behind'); if(!bh.length) return '';
    const n=bh.length, lab=mrEn()?n+(n===1?' goal behind':' goals behind'):n+' '+pluralUk(n,'ціль','цілі','цілей')+' позаду';
    const why=bh.slice(0,2).map(g=>ypStatus(g).why).join(' · ');
    return `<div class="yp-tempo yw-behind ypp-behind"><span><b>${esc(lab)}</b> · ${esc(why)}</span><button data-ypcatchall>✦ ${ypT('Наздогнати разом','Catch up together')}</button></div>`;
  }
  // наступний крок цілі: найближча незроблена справа тижня → незроблена віха; '' якщо нема
  function ypNext(g){
    const t=ypWeekTasks(g).find(x=>!x.done); if(t) return String(t.t||'')+' · '+(t.date<ymdLocal()?ypT('з минулого','overdue'):t.date===ymdLocal()?ypT('сьогодні','today'):ypDow(t.date));
    const m=jnLevels(g).find(x=>!x.done); return m?String(m.t||'')+' · '+mrMonth(m.ym):'';
  }
  // фішки звʼязків цілі — переходи; без даних фішки нема (порожніх «＋» тут не показуємо, це робить «Мій рік»)
  function ypChips(g){
    const out=[], sum=mrMoneySum(g), fk=moOwnFolder(g.folderKey)?g.folderKey:'', n=jnNum(g);
    if(sum) out.push(`<span class="ypp-chip">${esc(mrK(mrSaved(g),g))} / ${esc(mrK(sum,g))}</span>`);
    if(n) out.push(`<span class="ypp-chip">↗ ${esc(ypFmtNum(n.cur))} → ${esc(ypFmtNum(n.to))}</span>`);
    if(fk) out.push(`<span class="ypp-chip">▢ ${esc(String(folders[fk].name||ypT('Папка','Folder')).slice(0,18))}</span>`);
    return out.join('');
  }
  function ypPathHero(g){
    const s=ypStatus(g), ph=jnMissionPhoto(g), pct=ypPct(g), c=safeColor(g.color,'#5b8def'), nx=ypNext(g), meta=[pct+'%', ypDaysTxt(g)].filter(Boolean).join(' · ');
    return `<div class="yw-card big ypp-hero${ph?' ph':''} st-${s.k}" style="--c:${c};${ph?`background-image:url('${esc(ph)}');${jnMissionFocus(g)}`:''}">
      <button class="yw-hit" data-ypwall="${esc(g.id)}" aria-label="${esc(String(g.name||'')+' — '+ypStatusTxt(s))}"></button>
      <span class="yw-tag">${jnRole(g)==='main'?ypT('головна','main'):ypT('найближча','next up')}</span>
      <button class="yw-more" data-ypwmore="${esc(g.id)}" aria-label="${esc(ypT('Дії з ціллю','Goal actions'))}">⋯</button>
      <div class="yw-b"><b>${esc(String(g.name||ypT('Ціль','Goal')))}</b><span class="yw-m">${esc(meta)}</span>
        <i class="yw-bar"><u style="width:${pct}%"></u></i><small class="yw-s">${esc(ypStatusTxt(s))}</small>
        ${nx?`<span class="ypp-next">${ypT('далі: ','next: ')}${esc(nx)}</span>`:''}
        <span class="ypp-chips">${ypChips(g)}</span></div></div>`;
  }
  // смужка 4 кварталів: частка взятих віх у кожному
  function ypQBar(g){
    return '<span class="ypp-q" aria-hidden="true">'+mrQuarters().map(qq=>{ const lv=mrLvIn(g,qq), d=lv.filter(m=>m.done).length;
      return `<i${lv.length?' class="has"':''}><u style="width:${lv.length?Math.round(d/lv.length*100):0}%"></u></i>`; }).join('')+'</span>';
  }
  function ypPathRow(g){
    const s=ypStatus(g), ph=jnMissionPhoto(g), pct=ypPct(g), d=mrDaysLeft(mrDueDs(g)), nx=ypNext(g);
    return `<div class="ypp-row st-${s.k}">
      <button class="yw-hit" data-ypwall="${esc(g.id)}" aria-label="${esc(String(g.name||'')+' — '+ypStatusTxt(s))}"></button>
      ${ph?`<img src="${esc(ph)}" alt="" style="${jnMissionFocus(g,'obj')}">`:`<span class="ypp-dot" style="--c:${safeColor(g.color,'#5b8def')}"></span>`}
      <span class="ypp-rb"><span class="ypp-rh"><b>${esc(String(g.name||''))}</b><em>${s.k==='none'?'—':pct+'%'}</em></span>
        <small class="yw-s">${esc(ypStatusTxt(s))}</small>${ypQBar(g)}
        ${nx?`<small class="ypp-next">${ypT('далі: ','next: ')}${esc(nx)}</small>`:''}</span>
      ${d!==null&&d>=0?`<span class="ypp-days"><b>${d}</b><small>${mrEn()?(d===1?'day':'days'):pluralUk(d,'день','дні','днів')}</small></span>`:''}
      ${s.k==='behind'?`<button class="yw-catch ypp-rc" data-ypcatch="${esc(g.id)}">✦</button>`:s.k==='none'?`<button class="yw-catch ypp-rc" data-ypplan="${esc(g.id)}" aria-label="${esc(ypT('Розписати','Plan it'))}">＋</button>`:''}
    </div>`;
  }
  function ypPathHTML(goals){
    const act=goals.filter(g=>ypPct(g)<100);
    if(!act.length) return `<div class="yp-empty"><b>${ypT('Усі цілі здійснено','All goals are done')}</b><span>${ypT('Час для нової мрії — вкладка «Мрії» або «＋ Нова ціль».','Time for a new dream — the Dreams tab or “＋ New goal”.')}</span></div>`;
    // головна — роль main, інакше найближчий фініш, інакше перша
    const main=act.find(g=>jnRole(g)==='main')||act.slice().sort((a,b)=>String(mrDueDs(a)||'9').localeCompare(String(mrDueDs(b)||'9')))[0];
    const rest=act.filter(g=>g!==main);
    return `<div class="ypp">${ypPathToday(act)}${ypPathBehind(act)}${ypPathHero(main)}
      ${rest.length?`<div class="ypp-rows">${rest.map(ypPathRow).join('')}</div>`:''}
      <button class="yw-free yw-new" data-ypnew><em>＋ ${ypT('Нова ціль','New goal')}</em></button>${ypWallMoney()}</div>`;
  }
  // «＋ Крок на сьогодні»: текст → яка ціль → звичайна справа «Плану» на сьогодні з goalId (ypPushTask)
  function ypAddTodayStep(goals){
    inputModal({ title:ypT('Крок на сьогодні','Step for today'), placeholder:ypT('Напр. Подзвонити в банк','E.g. Call the bank'), onOk:v=>{
      v=String(v||'').trim().slice(0,200); if(!v) return;
      const act=goals.filter(g=>ypPct(g)<100);
      if(act.length===1){ ypPushTask(act[0],v,ymdLocal(),ypRender); return; }
      actionSheet({ title:ypT('Для якої цілі?','For which goal?'), sub:v, items:act.map(g=>({ ic:'target', label:String(g.name||''), onClick:()=>ypPushTask(g,v,ymdLocal(),ypRender) })) });
    }});
  }
  // «✦ Наздогнати разом» — одне ВПИСАНЕ питання про всі цілі позаду; зміни — лише шторкою year_plan
  function ypFlowCatchAll(){
    if(!window.aiChatSheet) return;
    const bh=mrActive().filter(g=>ypPct(g)<100&&ypStatus(g).k==='behind'); if(!bh.length) return;
    const list=bh.map(g=>'«'+String(g.name||'').slice(0,60)+'» — '+ypStatus(g).why).join('; ');
    const q=ypT('Ці цілі позаду: ','These goals are behind: ')+list+ypT('. Запропонуй ОДНИМ пакетом, як наздогнати: 2–3 кроки на цей тиждень для кожної і що перенести в дорозі року.',
      '. Suggest as ONE batch how to catch up: 2–3 steps this week for each and what to move on the road of the year.');
    window.aiChatSheet();
    setTimeout(()=>{ const i=document.getElementById('aiInput'); if(i&&!i.value){ i.value=q; try{ i.dispatchEvent(new Event('input',{bubbles:true})); i.focus(); }catch(_){} } }, 60);
  }
  /* Віконце біля кнопки (25.11.2026): на компʼютері — під кнопкою, на телефоні — шторка знизу.
     Свій маленький компонент, щоб не міняти спільний actionSheet (04-menus.css) для всього застосунку. */
  function ypPop(anchor, html, bind){
    document.querySelectorAll('.yp-pop-ov').forEach(x=>x.remove());
    const ov=document.createElement('div'); ov.className='yp-pop-ov';
    ov.innerHTML=`<div class="yp-pop" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(ov);
    const pop=ov.querySelector('.yp-pop');
    const place=()=>{
      if(window.innerWidth<1024||!anchor){ pop.classList.remove('at'); pop.style.left=pop.style.top=''; return; }
      pop.classList.add('at');   // спершу вузька форма — тоді міряємо ширину
      const r=anchor.getBoundingClientRect(), w=pop.offsetWidth||380;
      pop.style.left=Math.max(12,Math.min(window.innerWidth-w-12,r.right-w))+'px'; pop.style.top=(r.bottom+10)+'px';
    };
    place();
    const close=()=>{ window.removeEventListener('resize',place); document.removeEventListener('keydown',onKey,true); ov.remove(); try{ anchor&&anchor.focus(); }catch(_){} };
    const onKey=e=>{ if(e.key==='Escape'){ e.preventDefault(); close(); } };
    window.addEventListener('resize',place); document.addEventListener('keydown',onKey,true);
    ov.addEventListener('click',e=>{ if(e.target===ov||e.target.closest('[data-yppopx]')) close(); });
    if(typeof bind==='function') bind(pop,close);
    setTimeout(()=>{ try{ (pop.querySelector('[aria-pressed="true"],button')||pop).focus(); }catch(_){} },30);
    return close;
  }
  // ⚙ «Мої цілі»: лише 2 рядки — решта налаштовується там, де живе (⋯ на картці, утримати лічильник, Гаманець)
  function ypSettings(anchor){
    const draw=()=>{ const p=ypPrefs();
      const sb=(k,lab)=>`<button data-ypsens="${k}" aria-pressed="${p.sens===k}">${lab}</button>`;
      const hint={soft:ypT('Лише явні пропуски: віха не відмічена або за місяць не відкладено нічого.','Only clear misses: a missed milestone or nothing saved last month.'),
        norm:ypT('Пропущена віха, недовідкладені гроші, «Число» позаду, відставання від часу більше 10%.','Missed milestone, money short, Number behind, more than 10% behind time.'),
        strict:ypT('Як звичайно, плюс відставання від часу вже на 5% — навіть коли є віхи.','As normal, plus 5% behind time — even when there are milestones.')}[p.sens];
      return `<div class="yp-pop-h"><b>${ypT('Налаштування цілей','Goal settings')}</b><button class="yp-pop-x" data-yppopx aria-label="${esc(ypT('Закрити','Close'))}">✕</button></div>
        <div class="yp-pop-l">${ypT('Коли ціль «позаду»','When a goal is “behind”')}</div>
        <div class="yp-seg" role="group">${sb('soft',ypT('Мʼяко','Gentle'))}${sb('norm',ypT('Звичайно','Normal'))}${sb('strict',ypT('Суворо','Strict'))}</div>
        <p class="yp-pop-s">${esc(hint)}</p>
        <button class="yp-pop-row" data-ypflowpref role="switch" aria-checked="${p.flow}"><span><b>${ypT('Флоу підказує сам','Flow suggests on its own')}</b>
          <small>${ypT('неділя — кроки на тиждень по цілях · вихідні — «сплануй тиждень»','Sunday — weekly steps per goal · weekend — “plan your week”')}</small></span><i class="yp-sw" aria-hidden="true"></i></button>
        <p class="yp-pop-s">${ypT('Блоки, кадр фото й лічильник налаштовуються на них самих — через ⋯ або утримання.','Blocks, photo focus and the countdown are set on themselves — via ⋯ or long-press.')}</p>`; };
    ypPop(anchor, draw(), function bind(pop){
      pop.querySelectorAll('[data-ypsens]').forEach(b=>b.onclick=()=>{ if(ypSetPref('sens',b.dataset.ypsens)){ pop.innerHTML=draw(); bind(pop); ypRender(); try{ ypHomeHint(); }catch(_){} } });
      pop.querySelectorAll('[data-ypflowpref]').forEach(b=>b.onclick=()=>{ if(ypSetPref('flow',!ypPrefs().flow)){ pop.innerHTML=draw(); bind(pop); } });
    });
  }
  // «✦ Наздогнати»: Флоу з ВПИСАНИМ (не надісланим) питанням; зміни — лише шторкою year_plan з галочками
  function ypFlowCatch(g){
    if(!window.aiChatSheet) return;
    const s=ypStatus(g);
    const q=ypT('Ціль «','My goal “')+String(g.name||'').slice(0,80)+ypT('» позаду: ','” is behind: ')+(s.why||'')
      +ypT('. Запропонуй пакетом, як наздогнати: 2–3 кроки на цей тиждень і що перенести в дорозі року.',
           '. Suggest as one batch how to catch up: 2–3 steps for this week and what to move on the road of the year.');
    window.aiChatSheet();
    setTimeout(()=>{ const i=document.getElementById('aiInput'); if(i&&!i.value){ i.value=q; try{ i.dispatchEvent(new Event('input',{bubbles:true})); i.focus(); }catch(_){} } }, 60);
  }

  function ypRefresh(){ const s=document.getElementById('scr-yplan'); if(s&&s.classList.contains('active')) ypRender(); }
  function goYearPlanBack(){ goYearPlan({keepBack:true}); }
  function goYearPlan(opts){ try{
    // банер Огляду (без opts) і view:'wall' — стіна «Мої цілі»; з Журналу/папки/Плану — одразу «Мій рік» цілі
    if(opts&&typeof opts==='object'){
      if(opts.from){ ypBack=opts.from; ypBackFk=opts.from==='folder'?String(opts.fk||''):''; } else if(!opts.keepBack) ypBack='home';
      if(!opts.keepBack){ ypView=opts.view==='wall'||!opts.from?'wall':'goal'; ypFromWall=false; }
    }
    else { ypBack='home'; ypView='wall'; ypFromWall=false; }
    ypRender(); show('scr-yplan'); window.scrollTo(0,0);
  }catch(e){ console.error('goYearPlan',e); } }
  window.goYearPlan=goYearPlan;
  try{ document.addEventListener('flowsync',ypRefresh); }catch(_){}
