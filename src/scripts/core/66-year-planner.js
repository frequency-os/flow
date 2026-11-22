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
      ${ph?`<img src="${esc(ph)}" alt="">`:`<span class="yp-dot" aria-hidden="true"></span>`}
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
    return `<button class="yp-hero${ph?' ph':''}" data-ypopen style="--c:${c};--p:${pct};${ph?`background-image:url('${esc(ph)}')`:''}">
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
  function ypAddWeekStep(g,rer){
    inputModal({ title:ypT('Крок на цей тиждень','Step for this week'), placeholder:ypT('Напр. Відкласти ₴ 2 000','E.g. Put aside 50'), onOk:v=>{
      v=String(v||'').trim().slice(0,200); if(!v) return;
      const td=ymdLocal(), sun=ypAddDays(ypWeekMon(),6), days=[];
      for(let ds=td; ds<=sun; ds=ypAddDays(ds,1)) days.push(ds);
      actionSheet({ title:ypT('Коли?','When?'), sub:v, items:days.map((ds,i)=>({ ic:'calendar',
        label:i===0?ypT('Сьогодні','Today'):i===1?ypT('Завтра','Tomorrow'):ypDow(ds)+', '+(+ds.slice(8)),
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
    const backL=ypBack==='journal'?ypT('‹ Журнал','‹ Journal')
      :ypBack==='plan'?ypT('‹ План','‹ Plan')
      :(ypBack==='folder'&&moOwnFolder(ypBackFk))?'‹ '+String(folders[ypBackFk].name||ypT('Папка','Folder')).slice(0,24):ypT('‹ Огляд','‹ Overview');
    const ng=goals.length, cnt=ng?' · '+(mrEn()?ng+(ng===1?' goal':' goals'):ng+' '+pluralUk(ng,'ціль','цілі','цілей')):'';
    let h=`<div class="yp-top"><button class="back" data-ypback>${esc(backL)}</button>
        <div class="yp-head"><h1>${ypT('Мій рік','My year')}</h1><span>${ypT('до ','until ')}${esc(mrUntil())}${esc(cnt)}</span></div>
        <button class="yp-map" data-ypmap>${ypT('Усі мрії','All dreams')}</button>
        <button class="yp-flowtop" data-ypflow><span class="yp-spark sm" aria-hidden="true">✦</span>${ypT('Флоу, розпиши мій рік','Flow, plan my year')}</button></div>`;
    if(!g) return h+ypEmpty()+'<div class="yp-pad"></div>';
    h+=`<div class="yp-pills" role="group" aria-label="${ypT('Цілі року','Goals of the year')}">${goals.map(x=>ypPill(x,x===g)).join('')}
      <button class="yp-pill add" data-ypnew>＋ ${ypT('Нова ціль','New goal')}</button>${ypFreePill(free)}</div>`;
    if(ypShowFree&&free.length) h+=`<div class="yp-strip">${free.map(ypWishCard).join('')}</div>`;
    h+=`<div class="yp-main"><section class="yp-left">${ypHero(g)}${ypTiles(g)}</section>
      <section class="yp-right">${ypTempo(g)}${ypTrackers(g,true)}${ypWeekHTML(g)}
        <div class="yp-rh"><b>${ypT('Дорога року','Road of the year')}</b><span>${esc(MR_QN[mrQuarters()[0].q])} — ${esc(MR_QN[mrQuarters()[3].q])}</span></div>
        ${ypRoad(g)}
        <button class="mr-link" data-ypjn>${ypT('Точка Б, гроші й правила року ›','Point B, money and rules of the year ›')}</button></section></div>`;
    return h+'<div class="yp-pad"></div>';
  }

  function ypRender(){
    const body=document.getElementById('ypBody'); if(!body) return;
    body.innerHTML=ypHTML();
    ypBind(body, ()=>jnGoalById(ypSel), ypRender);
    ypDock();
  }
  /* обробники кнопок цілі — спільні для «Мого року» і картки цілі в папці (етап 7):
     cur() — жива ціль (свіжа з goalsData), rer() — перемалювати те місце, звідки тапнули */
  function ypBind(root, cur, rer){
    const q=s=>root.querySelectorAll(s);
    q('[data-ypback]').forEach(b=>b.onclick=()=>{ if(ypBack==='journal') goJournal(); else if(ypBack==='folder'&&moOwnFolder(ypBackFk)) goFolder(ypBackFk); else if(ypBack==='plan'&&typeof goPlan==='function') goPlan(true); else goHome(); });
    q('[data-ypmap]').forEach(b=>b.onclick=()=>goWishes({back:goYearPlanBack, label:ypT('‹ Мій рік','‹ My year')}));
    q('[data-ypg]').forEach(b=>b.onclick=()=>{
      if(ypSel===b.dataset.ypg){ const g=cur(); if(g) mrGoalPage(g); return; }   // повторний тап — відкрити ціль
      ypSel=b.dataset.ypg; rer();
    });
    q('[data-ypw]').forEach(b=>b.onclick=()=>wishToGoal(b.dataset.ypw, gid=>{ ypSel=String(gid); rer(); const g=jnGoalById(gid); if(g) mrGoalPage(g); }));
    q('[data-ypnew]').forEach(b=>b.onclick=mrNewGoal);
    q('[data-ypfree]').forEach(b=>b.onclick=()=>{ ypShowFree=!ypShowFree; rer(); });
    q('[data-ypflow]').forEach(b=>b.onclick=ypFlowOpen);
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
    return `<button class="pn-gchip" style="--gc:${c}" data-pngoal="${esc(g.id)}">${ph?`<img src="${esc(ph)}" alt="">`:'<i aria-hidden="true"></i>'}<span>${esc(String(g.name||'').slice(0,24))}</span></button>`;
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
        <i class="ypm-c" aria-hidden="true"></i>${ph?`<img src="${esc(ph)}" alt="">`:'<i class="ypm-d" aria-hidden="true"></i>'}
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
    root.querySelectorAll('[data-pnyp]').forEach(b=>b.onclick=()=>goYearPlan({from:'plan'}));
    root.querySelectorAll('[data-pnms]').forEach(b=>b.onclick=()=>{
      if(!ypReady()){ ypNotReady(); return; }
      const [gid,mid]=String(b.dataset.pnms).split(':'), g=jnGoalById(gid), m=g&&(g.ms||[]).find(x=>x&&String(x.id)===mid);
      if(!m){ if(g) mrGoalPage(g); return; }   // віха не з «Дороги» — правиться на сторінці цілі
      jnMsSetDone(m,!m.done); saveGoals(); rer();
    });
  }

  /* ════════ Етап 7: ціль у папці (П1) ════════
     Папка, до якої привʼязана ціль (goal.folderKey), показує під обкладинкою картку цілі: фото, %, квартали,
     трекери, «Цей тиждень» і перехід у «Мій рік». Кличе 36-chats.js (fhBelowRender) — лише показ;
     пише тільки після тапу тими самими обробниками, що й «Мій рік» (ypBind). Обкладинка папки без власної
     обкладинки бере фото мрії цілі — теж лише на екрані (fhCoverStyle), нічого не зберігається. */
  function ypGoalsOfFolder(fk){ try{ return mrActive().filter(g=>g&&String(g.folderKey||'')===String(fk)); }catch(_){ return []; } }
  function ypFolderGoalPhoto(fk){ const g=ypGoalsOfFolder(fk)[0]; return g?jnMissionPhoto(g):''; }
  function ypFolderGoalHTML(fk){
    const gs=ypGoalsOfFolder(fk); if(!gs.length) return '';
    const g=gs[0], ph=jnMissionPhoto(g), pct=ypPct(g), fin=mrFinish(g), c=safeColor(g.color,'#5b8def');
    const qs=mrQuarters().map((qq,i)=>{ const lv=mrLvIn(g,qq), d=lv.filter(m=>m.done).length;
      return `<span class="ypf-q${i===0?' now':''}"><small>${YP_QN[qq.q]}${i===0?' · '+ypT('зараз','now'):''}</small>`
        +`<b>${lv.length?esc(String(lv[0].t||''))+(lv.length>1?' +'+(lv.length-1):''):'—'}</b>${lv.length?`<i>${d}/${lv.length}</i>`:''}</span>`; }).join('');
    const more=gs.length>1?(mrEn()?' · +'+(gs.length-1)+' more':' · ще '+(gs.length-1)):'';
    return `<section class="ypf" data-ypfg="${esc(g.id)}" style="--c:${c};--p:${pct}">
      <button class="ypf-h" data-ypopen>${ph?`<img src="${esc(ph)}" alt="">`:'<span class="ypf-dot" aria-hidden="true"></span>'}
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

  function ypRefresh(){ const s=document.getElementById('scr-yplan'); if(s&&s.classList.contains('active')) ypRender(); }
  function goYearPlanBack(){ goYearPlan({keepBack:true}); }
  function goYearPlan(opts){ try{
    if(opts&&typeof opts==='object'){ if(opts.from){ ypBack=opts.from; ypBackFk=opts.from==='folder'?String(opts.fk||''):''; } else if(!opts.keepBack) ypBack='home'; }
    else ypBack='home';
    ypRender(); show('scr-yplan'); window.scrollTo(0,0);
  }catch(e){ console.error('goYearPlan',e); } }
  window.goYearPlan=goYearPlan;
  try{ document.addEventListener('flowsync',ypRefresh); }catch(_){}
