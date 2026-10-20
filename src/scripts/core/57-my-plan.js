  /* ════════ «Мій рік» · вкладка «Рік» Журналу (57-my-plan.js, 20.10.2026) ════════
     Одна сторінка, розділи завжди в тому самому порядку: Точка Б → Цілі (плитки) → Календар року.
     Порожній розділ не зникає — показує запрошення, тож план не «губиться».
     Етап 1: лише ПОКАЗ наявних даних, нових полів і ключів нема:
       лист — goalsData.letter (40-year-letter.js), цілі — goalsData.goals, фото — мрія з wish.goalId,
       кроки — рівні gl.ms. Рік — наступні 12 місяців: поточний квартал + 3 наступні.
     Сама сторінка нічого не пише: лист — ylEdit, нова ціль — jnEditor, кроки — yrLvMenu (45-year.js).
     Плитка відкриває сторінку цілі (етап 2, нижче) — там записи лише після натискання людини.
     Детальна «База цілей» (45-year.js) — кнопкою «Усі квартали» внизу. */

  let mrDetail=false;   // показ «Бази цілей» замість сторінки — лише в памʼяті екрана
  const MR_QN=['Січ–Бер','Кві–Чер','Лип–Вер','Жов–Гру'];

  // поточний квартал і 3 наступні: [{y:'2026', q:3}, {y:'2027', q:0}, …]
  function mrQuarters(){
    const td=ymdLocal(); let y=+td.slice(0,4), q=moQ(td.slice(0,7)); const out=[];
    for(let i=0;i<4;i++){ out.push({y:String(y), q}); q++; if(q>3){ q=0; y++; } }
    return out;
  }
  function mrActive(){
    return (goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)!=='archive')
      .sort((a,b)=>(jnRole(a)==='main'?0:1)-(jnRole(b)==='main'?0:1));
  }
  function mrLvIn(g,qq){ return jnLevels(g).filter(m=>m.ym.slice(0,4)===qq.y&&moQ(m.ym)===qq.q); }
  // рядки з числами й датами словник I18N_DICT не ловить — тому пари uk/en тут
  function mrEn(){ try{ return flowLang()==='en'; }catch(_){ return false; } }
  function mrT(uk,en){ return mrEn()?en:uk; }
  // рік у даті потрібен, лише коли вона поза «моїм роком»: раніше цього року або далі, ніж за рік
  function mrFar(ds){ return ds.slice(0,4)<ymdLocal().slice(0,4)||ds>ylDefaultDate(); }
  // «30 вересня» / «September 30»; рік — якщо mrFar або withYear
  function mrDate(ds,withYear){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(ds||'')) return '';
    const y=ds.slice(0,4), show=withYear||mrFar(ds);
    if(mrEn()){ try{ return new Date(ds+'T12:00:00').toLocaleDateString('en-US',show?{month:'long',day:'numeric',year:'numeric'}:{month:'long',day:'numeric'}); }catch(_){} }
    return jnDateTxt(ds)+(show?' '+y:'');
  }
  // «червня 2027» / «June 2027» — у родовому, бо стоїть після «до»; nom — називний («листопад») для підпису без «до»
  function mrMonth(ym,nom){
    const y=ym.slice(0,4), show=mrFar(ym+'-01');
    if(mrEn()){ try{ return new Date(ym+'-15T12:00:00').toLocaleDateString('en-US',show?{month:'long',year:'numeric'}:{month:'long'}); }catch(_){} }
    const i=+ym.slice(5,7)-1; if(!(i>=0&&i<12)) return '';   // зіпсований місяць з хмари/бекапу («2026-13») не ламає сторінку
    return (nom?MO_NAMES[i].toLowerCase():JN_MON[i])+(show?' '+y:'');
  }
  // фініш цілі — дата останнього кроку (рівні вже відсортовані за датою)
  function mrFinish(g){
    if(/^\d{4}-\d{2}-\d{2}$/.test(g.due||'')) return mrDate(g.due);   // свій фініш цілі (етап 2)
    const lv=jnLevels(g), m=lv[lv.length-1]; if(!m) return '';
    return m.due?mrDate(m.due):mrMonth(m.ym);
  }
  function mrUntil(){ return mrDate(ylDate(ylLetter()),true); }
  function mrFirst(text){ const s=ylSentences(text)[0]||String(text||'').trim(); return s.length>140?s.slice(0,139)+'…':s; }

  // ── 1. Точка Б: лист із фото мрії — єдине яскраве місце сторінки ──
  // адреси фото — ще й через esc(): safeImg не чіпає «&», а сутність &#39; в атрибуті браузер розкодує в «'»
  function mrPointB(){
    const L=ylLetter();
    if(!L.text.trim()) return `<button class="mr-b empty" data-mrletter><b>Ким ти будеш через рік?</b>
      <span>Кілька речень про себе через рік: як минає день, що вже є, що змінилось. Це твоя точка Б.</span><em>Написати</em></button>`;
    const cov=ylWishCover(ylWish(L)), t=L.text.trim();
    return `<button class="mr-b${cov?' ph':''}" data-mrletter${cov?` style="background-image:url('${esc(cov)}')"`:''}>
      <span class="mr-b-t">${esc(t.length>240?t.slice(0,239)+'…':t)}</span>
      <span class="mr-b-f"><span>${mrT('лист із ','letter from ')+esc(mrUntil())}</span><em>Змінити</em></span></button>`;
  }

  // ── 2. Цілі плитками: фон — мрія з Карти бажань, інакше колір цілі ──
  function mrTile(g){
    const c=safeColor(g.color,'#3ec7b4'), ph=jnMissionPhoto(g), pct=jnPct(g), fin=mrFinish(g);
    const fk=moOwnFolder(g.folderKey)?g.folderKey:'';
    const tag=fk?String(folders[fk].name||'Папка'):(jnRole(g)==='main'?'головна':'');
    return `<button class="mr-tile${ph?' ph':''}" data-mrg="${esc(g.id)}" style="--c:${c};${ph?`background-image:url('${esc(ph)}')`:''}">
      <small>${esc(tag)}</small>
      <span class="mr-tb"><b>${esc(g.name||'Ціль')}</b><i class="mr-pg"><u style="width:${pct}%"></u></i>
        <span class="mr-meta"><span>${pct}%</span><span>${fin?mrT('до ','by ')+esc(fin):'кроків нема'}</span></span></span></button>`;
  }

  // ── 3. Календар року: 4 чверті від сьогодні, кроки кольором своєї цілі ──
  function mrCalendar(goals){
    const cy=ymdLocal().slice(0,4);
    return '<div class="mr-cal">'+mrQuarters().map((qq,i)=>{
      const items=[]; goals.forEach(g=>mrLvIn(g,qq).forEach(m=>items.push({g,m})));
      return `<div class="mr-q${i===0?' now':''}"><b>${MR_QN[qq.q]}</b><small>${i===0?'зараз':qq.y!==cy?qq.y:'&nbsp;'}</small>
        ${items.length?items.map(({g,m})=>`<button class="mr-lv${m.done?' ok':''}" data-mrlv="${esc(g.id)}|${esc(m.id)}" style="--c:${safeColor(g.color,'#3ec7b4')}">${m.done?'✓ ':''}${esc(m.t)}</button>`).join(''):'<span class="mr-none">—</span>'}</div>`;
    }).join('')+'</div>';
  }

  function mrHTML(){
    if(mrDetail) return `<button class="mr-link" data-mrback>‹ Мій рік</button>`+yrHTML();
    const goals=mrActive(), now=mrQuarters()[0];
    const nowLv=goals.reduce((a,g)=>a.concat(mrLvIn(g,now)),[]);
    let h='<div class="mr">';
    h+=`<div class="mr-sec"><b>Точка Б</b><span>ким ти будеш через рік</span></div>`+mrPointB();
    h+=`<div class="mr-sec"><b>Цілі</b><span>${goals.length?'тапни плитку — відкриється ціль':'почни з однієї'}</span></div>`;
    h+=`<div class="mr-tiles">${goals.map(mrTile).join('')}<button class="mr-tile add" data-mradd><span aria-hidden="true">＋</span><b>Нова ціль</b></button></div>`;
    h+=`<div class="mr-sec"><b>Календар року</b><span>${nowLv.length?mrT('цей квартал: ','this quarter: ')+nowLv.filter(m=>m.done).length+mrT(' з ',' of ')+nowLv.length:'великі кроки по чвертях'}</span></div>`;
    h+=goals.length?mrCalendar(goals)+`<button class="mr-link" data-mrdetail>Усі квартали і таблиця ›</button>`
      :`<div class="dy-empty"><b>Тут стануть кроки</b><span>Додай ціль і розбий її на 3–4 великі кроки — вони розкладуться по чвертях року.</span></div>`;
    return h+'</div><div class="jn-pad"></div>';
  }
  function mrSub(){ return mrDetail?'рік · база цілей · '+yrYear():mrT('мій рік · до ','my year · until ')+mrUntil(); }
  function mrOpen(){ jnTab='year'; mrDetail=false; jnRender(); jnTop(); }

  function mrBind(c){
    if(mrDetail){ const b=c.querySelector('[data-mrback]'); if(b) b.onclick=()=>{ mrDetail=false; jnRender(); jnTop(); }; yrBind(c); return; }
    { const l=c.querySelector('[data-mrletter]'); if(l) l.onclick=()=>ylEdit(()=>{ if(jnTab==='year') jnRender(); }); }
    { const a=c.querySelector('[data-mradd]'); if(a) a.onclick=()=>jnEditor(null); }
    { const d=c.querySelector('[data-mrdetail]'); if(d) d.onclick=()=>{ mrDetail=true; jnRender(); jnTop(); }; }
    c.querySelectorAll('[data-mrg]').forEach(b=>b.onclick=()=>{ const g=jnGoalById(b.dataset.mrg); if(g) mrGoalPage(g); });
    c.querySelectorAll('[data-mrlv]').forEach(b=>b.onclick=()=>yrLvMenu(b.dataset.mrlv));
  }

  // ── картка «Мій рік» на «Дні» Журналу (замість «Почни гру») ──
  function mrDayCard(){
    const L=ylLetter(), goals=mrActive(), h=jnHero(), st=+h.startStep||0;
    const wiz=h.started?'':`<button class="ghost" data-jnstart>${st>1?mrT('Покроково · крок '+st+' з 5','Step by step · step '+st+' of 5'):'Покроково з підказками'}</button>`;
    if(!L.text.trim()&&!goals.length) return `<div class="mr-day"><small>Мій рік</small><b>Ким ти будеш через рік?</b>
      <span class="mr-day-s">Одна сторінка: точка Б, 1–3 цілі і великі кроки по чвертях року.</span>
      <span class="mr-day-btns"><button data-mropen>Розписати рік</button>${wiz}</span></div>`;
    const lv=goals.reduce((a,g)=>a.concat(mrLvIn(g,mrQuarters()[0])),[]);
    return `<div class="mr-day" data-mrcard><small>${mrT('Мій рік · до ','My year · until ')+esc(mrUntil())}</small>
      ${L.text.trim()?`<b>«${esc(mrFirst(L.text))}»</b>`:'<b>Точку Б ще не написано</b>'}
      ${goals.length?`<span class="mr-day-gs">${goals.slice(0,3).map(g=>`<span class="mr-day-g" style="--c:${safeColor(g.color,'#3ec7b4')}"><i aria-hidden="true"></i><span>${esc(g.name||'Ціль')}</span><em>${jnPct(g)}%</em></span>`).join('')}</span>`:''}
      <span class="mr-day-f"><span>${lv.length?mrT('Цей квартал: ','This quarter: ')+lv.filter(m=>m.done).length+mrT(' з ',' of ')+lv.length+mrT(' кроків',' steps'):'На цей квартал кроків нема'}</span>
        <span class="mr-day-btns"><button data-mropen>Відкрити план</button>${wiz}</span></span></div>`;
  }
  function mrDayBind(c){
    c.querySelectorAll('[data-mropen]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); mrOpen(); });
    const card=c.querySelector('[data-mrcard]');
    if(card) card.onclick=e=>{ if(!e.target.closest('button')) mrOpen(); };   // тап по картці поза кнопками — теж відкриває
  }

  /* ════════ Етап 2 (21.10.2026): сторінка цілі — тап по плитці «Мого року» ════════
     Блоки: Опис · Терміни · Гроші · Кроки · Фото · Папка. Нові НЕОБОВʼЯЗКОВІ поля цілі (старі цілі працюють як є):
       why — текст «навіщо»;  due — 'YYYY-MM-DD' фініш;  money {sum, envId} — сума і конверт.
     Гроші — справжній конверт накопичень (envelopes, kind:'ціль', goalId), як скарбничка призу (44-prizes.js):
       створюється лише при першому «Відкласти»; «Відкласти» = envAddOp(e,'in') (баланс Гаманця меншає);
       «Повернути» = pzWithdraw(…, e) (переказ назад, не дохід). Ціль із грошима в конверті не видаляється (41-journal.js).
     Фото — мрії Карти бажань з wish.goalId: «Нове фото» створює мрію, «З Карти бажань» привʼязує наявну.
     Усі записи — лише після натискання людини. */

  function mrMoneySum(g){ return g&&g.money&&typeof g.money==='object'&&+g.money.sum>0?Math.round(+g.money.sum):0; }
  // запасний пошук за goalId — envId може загубитись при синку двох пристроїв, а гроші мають знаходитись
  function mrEnv(g){
    if(!g) return null; const id=g.money&&g.money.envId, L=envelopes||[];
    return (id&&L.find(e=>e&&String(e.id)===String(id)))||L.find(e=>e&&e.kind==='ціль'&&String(e.goalId||'')===String(g.id))||null;
  }
  function mrSaved(g){ const e=mrEnv(g); return e?Math.max(0,envSaved(e)):0; }
  function mrK(n,g){ const e=mrEnv(g); return moneyK(n,e?envCur(e):''); }
  function mrDueOk(ds){ return /^\d{4}-\d{2}-\d{2}$/.test(ds||''); }
  // дата фінішу: своя due, інакше — останній крок (його дата або кінець його місяця)
  function mrDueDs(g){
    if(mrDueOk(g.due)) return g.due;
    const lv=jnLevels(g), m=lv[lv.length-1]; if(!m) return '';
    return mrDueOk(m.due)?m.due:m.ym+'-'+String(moDim(m.ym)).padStart(2,'0');
  }
  function mrDaysLeft(ds){ if(!mrDueOk(ds)) return null; return Math.round((new Date(ds+'T12:00:00')-new Date(ymdLocal()+'T12:00:00'))/864e5); }
  // скільки відкладати щомісяця, щоб встигнути до фінішу
  function mrPerMonth(g){
    const need=Math.max(0,mrMoneySum(g)-mrSaved(g)), d=mrDaysLeft(mrDueDs(g));
    if(!need||d===null) return 0;
    return Math.ceil(need/Math.max(1,Math.ceil(d/30.44)));
  }
  function mrWishesOf(g){ try{ return (wishes||[]).filter(w=>w&&w.goalId&&String(w.goalId)===String(g.id)&&(w.type==='video'?w.thumb:w.img)); }catch(_){ return []; } }
  // при видаленні цілі: зняти привʼязку з усіх її мрій — фото лишаються в Карті бажань і знову «вільні»
  function mrUnlinkWishes(g){
    if(!g) return; let n=0;
    (wishes||[]).forEach(w=>{ if(w&&(String(w.goalId||'')===String(g.id)||(g.wishId&&String(w.id)===String(g.wishId)&&w.goalId))){ delete w.goalId; n++; } });
    if(n){ saveWishes(); try{ renderWishes(); }catch(_){} }
  }
  function mrWishImg(w){ return safeImg(w.type==='video'?w.thumb:w.img)||''; }

  function mrGoalHTML(g){
    const c=safeColor(g.color,'#3ec7b4'), ph=jnMissionPhoto(g), pct=jnPct(g);
    const fk=moOwnFolder(g.folderKey)?g.folderKey:'', due=mrDueDs(g), left=mrDaysLeft(due);
    const sum=mrMoneySum(g), sv=mrSaved(g), pm=mrPerMonth(g), lv=jnLevels(g), ws=mrWishesOf(g);
    const tag=[fk?String(folders[fk].name||''):'', jnRole(g)==='main'?mrT('головна ціль','main goal'):''].filter(Boolean).join(' · ');
    const sec=(t,act,body)=>`<section class="mr-gb"><div class="mr-gb-h"><b>${t}</b>${act||''}</div>${body}</section>`;
    let h=`<div class="mr-gp-cover${ph?' ph':''}" style="--c:${c};${ph?`background-image:url('${esc(ph)}')`:''}">
      <div class="mr-gp-bar"><button data-gpx>‹ ${mrT('Мій рік','My year')}</button><button data-gpphoto>${ph?mrT('Змінити фото','Change photo'):mrT('＋ Фото','＋ Photo')}</button></div>
      <div class="mr-gp-t">${tag?`<small>${esc(tag)}</small>`:''}<b>${esc(g.name||'Ціль')}</b>
        <span>${pct}%${due?' · '+mrT('до ','by ')+esc(mrDate(due)):''}</span><i class="mr-pg"><u style="width:${pct}%"></u></i></div></div><div class="mr-gp-in">`;
    // Опис
    h+=sec(mrT('Опис','Description'), `<button class="mr-gb-a" data-gpwhy>${g.why?mrT('Змінити','Edit'):mrT('Написати','Write')}</button>`,
      g.why?`<p class="mr-gb-txt">${esc(g.why)}</p>`:`<p class="mr-gb-mut">${mrT('Навіщо тобі ця ціль? Як буде, коли вийде?','Why does this goal matter? What will it be like?')}</p>`);
    // Терміни
    h+=sec(mrT('Терміни','Timeline'), `<button class="mr-gb-a" data-gpdue>${g.due?mrT('Змінити','Edit'):mrT('Задати дату','Set date')}</button>`,
      due?`<div class="mr-gb-row"><span>${mrT('фініш','finish')}</span><b>${esc(mrDate(due,true))}</b></div>
        <div class="mr-gb-row"><span>${left>=0?mrT('лишилось','left'):mrT('минуло','overdue')}</span><b>${Math.abs(left)} ${mrEn()?'days':pluralUk(Math.abs(left),'день','дні','днів')}</b></div>
        ${g.due?'':`<p class="mr-gb-mut">${mrT('Дата — з останнього кроку. Задай свою, якщо фініш інший.','Taken from the last step. Set your own if the finish differs.')}</p>`}`
      :`<p class="mr-gb-mut">${mrT('До коли? Можна приблизно — порахуємо, скільки відкладати щомісяця.','By when? A rough date is fine — it helps count the monthly amount.')}</p>`);
    // Гроші
    h+=sec(mrT('Гроші','Money'), sum?`<button class="mr-gb-a" data-gpsum>${mrT('Змінити суму','Edit amount')}</button>`:'',
      sum?`<div class="mr-gb-money"><b>${esc(mrK(sv,g))}</b><span>${mrT('з','of')} ${esc(mrK(sum,g))}</span></div>
        <i class="mr-pg big"><u style="width:${Math.min(100,Math.round(sv/sum*100))}%"></u></i>
        ${sv>=sum?`<p class="mr-gb-ok">${mrT('Сума зібрана','Fully saved')}</p>`:pm?`<p class="mr-gb-txt">${mrT('Щоб встигнути: ','To make it: ')}<b>${esc(mrK(pm,g))} ${mrT('на місяць','a month')}</b></p>`:`<p class="mr-gb-mut">${mrT('Задай термін — порахуємо суму на місяць.','Set a date to see the monthly amount.')}</p>`}
        <div class="mr-gb-btns"><button class="pri" data-gpin>${mrT('＋ Відкласти','＋ Save')}</button>${sv>0?`<button data-gpout>${mrT('Повернути','Return')}</button>`:''}</div>
        <p class="mr-gb-mut">${mrEnv(g)?mrT('Гроші лежать у конверті «','Kept in the envelope «')+esc(String(mrEnv(g).name||''))+mrT('» у Гаманці.','» in Wallet.'):mrT('Конверт у Гаманці зʼявиться з першим «Відкласти».','A Wallet envelope appears with the first «Save».')}</p>`
      :`<p class="mr-gb-mut">${mrT('Чи потрібні на цю ціль гроші? Задай суму — відкладатимеш у конверт Гаманця.','Does this goal need money? Set an amount and save into a Wallet envelope.')}</p>
        <div class="mr-gb-btns"><button data-gpsum>${mrT('＋ Сума','＋ Amount')}</button></div>`);
    // Кроки
    h+=sec(mrT('Кроки','Steps')+(lv.length?` <small>${lv.filter(m=>m.done).length} ${mrT('з','of')} ${lv.length}</small>`:''), `<button class="mr-gb-a" data-gpstep>${mrT('＋ Крок','＋ Step')}</button>`,
      lv.length?'<div class="mr-gb-steps">'+lv.map(m=>`<button class="mr-st${m.done?' ok':''}" data-gpms="${esc(m.id)}" aria-pressed="${m.done?'true':'false'}"><i aria-hidden="true">${m.done?'✓':''}</i><span>${esc(m.t)}</span><small>${esc(m.due?mrDate(m.due):mrMonth(m.ym,true))}</small></button>`).join('')+'</div>'
      :`<p class="mr-gb-mut">${mrT('3–4 великі кроки до фінішу — вони стануть у календарі року.','3–4 big steps to the finish — they appear in the year calendar.')}</p>`);
    // Фото
    h+=sec(mrT('Фото і натхнення','Photos'), '',
      `<div class="mr-gb-ph">${ws.map(w=>`<button class="mr-ph" data-gpw="${esc(w.id)}" style="background-image:url('${esc(mrWishImg(w))}')" aria-label="${esc(w.cap||mrT('Фото','Photo'))}"></button>`).join('')}
        <button class="mr-ph add" data-gpphoto>${mrT('＋ Фото','＋ Photo')}</button></div>`);
    // Папка
    h+=sec(mrT('Папка','Folder'), `<button class="mr-gb-a" data-gpedit>${mrT('Змінити','Edit')}</button>`,
      fk?`<button class="mr-fold" data-gpfold>${safeEmoji(folders[fk].emoji,'📁')} ${esc(folders[fk].name||'Папка')} ›</button>`:`<p class="mr-gb-mut">${mrT('Без папки. Привʼяжи, де лежать нотатки й матеріали цілі.','No folder. Link the one with this goal’s notes.')}</p>`);
    h+=`<button class="mr-link" data-gpedit>${mrT('Редагувати все: роль, розклад, приз ›','Edit everything: role, schedule, prize ›')}</button></div>`;
    return h;
  }

  function mrGoalPage(gl){
    const old=document.querySelector('.mr-gp'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='mr-gp'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    document.body.appendChild(ov);
    const close=()=>{ ov.remove(); try{ jnRender(); }catch(_){} };
    const draw=()=>{
      const g=jnGoalById(gl.id); if(!g){ close(); return; }   // ціль прибрали (редактор, інший пристрій)
      const top=ov.scrollTop;
      ov.setAttribute('aria-label',String(g.name||'Ціль'));
      ov.innerHTML=mrGoalHTML(g);
      ov.scrollTop=top;
      const q=s=>ov.querySelectorAll(s);
      q('[data-gpx]').forEach(b=>b.onclick=close);
      q('[data-gpwhy]').forEach(b=>b.onclick=()=>mrWhySheet(g,draw));
      q('[data-gpdue]').forEach(b=>b.onclick=()=>mrDueSheet(g,draw));
      q('[data-gpsum]').forEach(b=>b.onclick=()=>mrSumSheet(g,draw));
      q('[data-gpin]').forEach(b=>b.onclick=()=>mrMoveSheet(g,'in',draw));
      q('[data-gpout]').forEach(b=>b.onclick=()=>mrMoveSheet(g,'out',draw));
      q('[data-gpstep]').forEach(b=>b.onclick=()=>mrAddStep(g,draw));
      q('[data-gpms]').forEach(b=>b.onclick=()=>{
        const c=jnGoalById(g.id), m=c&&(c.ms||[]).find(x=>x&&String(x.id)===b.dataset.gpms); if(!m) return;
        jnMsSetDone(m,!m.done); saveGoals(); draw(); });
      q('[data-gpphoto]').forEach(b=>b.onclick=()=>actionSheet({title:mrT('Фото цілі','Goal photo'), items:[
        {ic:'plus', label:mrT('Нове фото з телефона','New photo from phone'), sub:mrT('стане мрією в Карті бажань','becomes a dream on the Vision board'), primary:true, onClick:()=>mrAddPhoto(g,draw)},
        {ic:'image', label:mrT('З Карти бажань','From Vision board'), onClick:()=>mrLinkWish(g,draw)} ]}));
      q('[data-gpw]').forEach(b=>b.onclick=()=>{ const w=(wishes||[]).find(x=>x&&String(x.id)===b.dataset.gpw); if(!w) return;
        actionSheet({title:w.cap||mrT('Фото','Photo'), items:[{ic:'trash', label:mrT('Прибрати з цілі','Remove from goal'), sub:mrT('у Карті бажань фото лишиться','stays on the Vision board'),
          onClick:()=>{ const x=(wishes||[]).find(y=>y&&String(y.id)===String(w.id)); if(x){ delete x.goalId; saveWishes(); try{ renderWishes(); }catch(_){} } draw(); }}]}); });
      q('[data-gpfold]').forEach(b=>b.onclick=()=>{ const k=g.folderKey; ov.remove(); try{ goFolder(k); }catch(_){} });
      q('[data-gpedit]').forEach(b=>b.onclick=()=>jnEditor(g,{after:draw}));
    };
    draw();
  }

  // ── шторки (jnOverlay, 41-journal.js — шар над сторінкою цілі) ──
  function mrWhySheet(g,after){
    jnOverlay(`<div class="jn-ed-h"><b>${mrT('Опис','Description')}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <label class="jn-f"><span>${mrT('Навіщо тобі це? Як буде, коли вийде?','Why does it matter? What will it be like?')}</span><textarea id="mrWhy" rows="6" maxlength="2000"></textarea></label>
      <div class="jn-ed-foot"><button class="jn-btn" data-mrok>${mrT('Зберегти','Save')}</button></div>`, ov=>{
      const ta=ov.querySelector('#mrWhy'); ta.value=String(g.why||'');   // через value — текст людини не стає HTML
      ov.querySelector('[data-mrok]').onclick=()=>{
        const q=jnGoalById(g.id); if(!q){ ov.remove(); after(); return; }
        const v=ta.value.replace(/\s+$/,'').slice(0,2000);
        if(v.trim()) q.why=v; else delete q.why;
        saveGoals(); ov.remove(); after();
      };
      setTimeout(()=>{ try{ ta.focus(); }catch(_){} },60);
    });
  }
  function mrDueSheet(g,after){
    jnOverlay(`<div class="jn-ed-h"><b>${mrT('Фініш цілі','Goal finish')}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <label class="jn-f"><span>${mrT('Дата','Date')}</span><input id="mrDue" type="date" min="${ymdLocal()}" value="${mrDueOk(g.due)?g.due:''}"></label>
      <div class="jn-ed-foot">${g.due?`<button class="jn-btn ghost" data-mrclr>${mrT('Прибрати дату','Clear date')}</button>`:''}<button class="jn-btn" data-mrok>${mrT('Зберегти','Save')}</button></div>`, ov=>{
      const done=v=>{ const q=jnGoalById(g.id); if(q){ if(v) q.due=v; else delete q.due; saveGoals(); } ov.remove(); after(); };
      ov.querySelector('[data-mrok]').onclick=()=>{ const v=ov.querySelector('#mrDue').value; if(!mrDueOk(v)){ plToast(mrT('Вибери дату','Pick a date')); return; } done(v); };
      { const c=ov.querySelector('[data-mrclr]'); if(c) c.onclick=()=>done(''); }
    });
  }
  function mrSumSheet(g,after){
    const sv=mrSaved(g);
    jnOverlay(`<div class="jn-ed-h"><b>${mrT('Скільки грошей треба','How much is needed')}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <label class="jn-f"><span>${mrT('Сума, ','Amount, ')+curSym()}</span><input id="mrSum" type="number" inputmode="numeric" min="1" step="100" value="${mrMoneySum(g)||''}" placeholder="0"></label>
      ${sv>0?`<small class="mo-note">${mrT('У конверті вже ','Already saved ')+esc(mrK(sv,g))}${mrT('. Прибрати суму можна, коли повернеш гроші в Гаманець.','. You can clear the amount after returning the money.')}</small>`:''}
      <div class="jn-ed-foot">${mrMoneySum(g)&&!sv?`<button class="jn-btn ghost" data-mrclr>${mrT('Без грошей','No money')}</button>`:''}<button class="jn-btn" data-mrok>${mrT('Зберегти','Save')}</button></div>`, ov=>{
      ov.querySelector('[data-mrok]').onclick=()=>{
        const a=Math.round(+ov.querySelector('#mrSum').value||0);
        if(!(a>0)){ plToast(mrT('Вкажи суму','Enter an amount')); return; }
        const q=jnGoalById(g.id); if(!q){ ov.remove(); after(); return; }
        if(!q.money||typeof q.money!=='object') q.money={};
        q.money.sum=a; saveGoals();
        const e=mrEnv(q); if(e){ e.goal=a; saveEnvelopes(); }   // ціль конверта в Гаманці — та сама сума
        ov.remove(); after();
      };
      { const c=ov.querySelector('[data-mrclr]'); if(c) c.onclick=()=>{
        const q=jnGoalById(g.id); if(q&&mrSaved(q)===0&&q.money){ delete q.money.sum; if(!q.money.envId) delete q.money; saveGoals(); }
        ov.remove(); after(); }; }
    });
  }
  // «Відкласти» / «Повернути» — як шторка скарбнички призу (pzJarSheet), але для конверта цілі
  function mrMoveSheet(g,mode,after){
    const sv=mrSaved(g), sum=mrMoneySum(g), e0=mrEnv(g), cur=e0?envCur(e0):'';
    let free=0; try{ free=curFree(cur); }catch(_){}
    const max=mode==='in'?Math.max(0,free):sv, need=Math.max(0,sum-sv);
    const chips=(mode==='in'?[500,1000,2000,5000]:[500,1000,2000]).filter(v=>v<max);
    const full=mode==='in'?(need>0&&need<=max?need:0):sv;
    const pm=mrPerMonth(g), fmt=v=>v.toLocaleString(mrEn()?'en-US':'uk-UA');
    jnOverlay(`<div class="jn-ed-h"><b>${mode==='in'?mrT('Відкласти на ','Save for ')+'«'+esc(g.name||'')+'»':mrT('Повернути з ','Return from ')+'«'+esc(g.name||'')+'»'}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">${esc(mrK(sv,g))} ${mrT('з','of')} ${esc(mrK(sum,g))} · ${mode==='in'?mrT('у Гаманці вільно ','free in Wallet ')+esc(moneyK(free,cur)):mrT('повернеться на рахунок','goes back to your account')}</small>
      <label class="jn-f"><span>${mrT('Сума, ','Amount, ')+curSym(cur)}</span><input id="mrAmt" type="number" inputmode="numeric" min="1" step="100" max="${max}" value="${mode==='in'&&pm&&pm<=max?pm:(full||'')}" placeholder="0"></label>
      <div class="pz-chips">${chips.map(v=>`<button data-mrv="${v}">${fmt(v)}</button>`).join('')}${mode==='in'&&pm&&pm<=max?`<button data-mrv="${pm}">${mrT('на місяць · ','monthly · ')+fmt(pm)}</button>`:''}${full?`<button data-mrv="${full}">${mode==='in'?mrT('усе, що бракує','all that’s left'):mrT('усе','all')} · ${fmt(full)}</button>`:''}</div>
      <small class="mo-note">${mode==='in'?mrT('У Гаманці зʼявиться запис «У конверт: ','Wallet will show «To envelope: ')+esc(String((e0||{}).name||g.name||''))+mrT('». Повернути можна будь-коли.','». You can return it any time.'):mrT('У Гаманці зʼявиться переказ — у доходи він не піде.','Wallet will show a transfer — not counted as income.')}</small>
      <div class="jn-ed-foot"><button class="jn-btn" data-mrok>${mode==='in'?mrT('Відкласти','Save'):mrT('Повернути','Return')}</button></div>`, ov=>{
      const inp=ov.querySelector('#mrAmt');
      ov.querySelectorAll('[data-mrv]').forEach(b=>b.onclick=()=>{ inp.value=b.dataset.mrv; });
      ov.querySelector('[data-mrok]').onclick=()=>{
        const a=Math.round(+inp.value||0);
        if(!(a>0)){ plToast(mrT('Вкажи суму','Enter an amount')); return; }
        if(a>max){ plToast(mode==='in'?mrT('У Гаманці вільно лише ','Only free in Wallet: ')+moneyK(max,cur):mrT('У конверті лише ','Only in the envelope: ')+moneyK(max,cur)); return; }
        ov.remove();
        if(mode==='in') mrDeposit(g,a); else { const e=mrEnv(g); if(e) pzWithdraw(g,a,'Повернуто в Гаманець',e); }
        after();
      };
    });
  }
  function mrDeposit(g,a){
    const q=jnGoalById(g.id); if(!q) return;
    let e=mrEnv(q);
    if(!e){
      e={id:'env_mr_'+Date.now().toString(36)+Math.random().toString(36).slice(2,5), name:String(q.name||'Ціль').slice(0,60), emoji:safeEmoji(q.emoji,'🎯'),
        goal:mrMoneySum(q), color:safeColor(q.color,'#3ec7b4'), kind:'ціль', goalId:String(q.id), ops:[]};
      envelopes.push(e);
      if(!q.money||typeof q.money!=='object') q.money={};
      q.money.envId=e.id; saveGoals();
    }
    envAddOp(e,'in',a,'Відкладено на ціль');
    plToast('＋ '+mrK(a,q)+mrT(' — у конверт «',' — to envelope «')+e.name+'»');
  }
  // новий крок: назва → у яку чверть «мого року»
  function mrAddStep(g,after){
    inputModal({title:mrT('Новий крок','New step'), placeholder:mrT('Напр. Пробний тест B2','E.g. Mock exam'), onOk:v=>{
      v=String(v||'').trim().slice(0,80); if(!v) return;
      const cur=ymdLocal().slice(0,7);
      actionSheet({title:mrT('Коли?','When?'), sub:v, items:mrQuarters().map((qq,i)=>({ic:'calendar', label:MR_QN[qq.q]+' '+qq.y+(i===0?mrT(' · зараз',' · now'):''), onClick:()=>{
        const q=jnGoalById(g.id); if(!q) return;
        if(!Array.isArray(q.ms)) q.ms=[];
        q.ms.push({id:'ms_m_'+Date.now()+'_'+Math.random().toString(36).slice(2,5), ym:i===0?cur:qq.y+'-'+String(qq.q*3+1).padStart(2,'0'), t:v, done:false});
        saveGoals(); after(); plToast(mrT('＋ крок «','＋ step «')+v+'»');
      }}))});
    }});
  }
  // нове фото → нова мрія з goalId; порядок — як replaceWishPhoto (06-wishes.js): перевірити, що фото відкривається, → PhotoDB → один запис
  function mrAddPhoto(g,after){
    const inp=document.createElement('input');
    inp.type='file'; inp.accept='image/*'; inp.style.display='none';
    document.body.appendChild(inp);
    inp.onchange=()=>{
      const f=inp.files&&inp.files[0]; inp.remove();
      if(!f) return;
      compressImage(f, async dataUrl=>{
        const shows=await new Promise(res=>{ const im=new Image(); im.onload=()=>res(im.naturalWidth>0); im.onerror=()=>res(false); im.src=dataUrl; });
        if(!shows){ flowAlert(mrT('Це фото не вдалося відкрити. Спробуй JPG або PNG.','This photo could not be opened. Try JPG or PNG.')); return; }
        const id='w'+Date.now()+'_g';
        const usePdb=!!(window.PhotoDB&&window.PhotoDB.available());
        let ref=dataUrl;
        try{ ref=await window.photoPut('wi_'+id, dataUrl); }catch(_){}
        const stored=String(ref).slice(0,4)==='idb:';
        if(usePdb&&!stored){ flowAlert(mrT('Не вдалося зберегти фото. Спробуй ще раз.','Could not save the photo. Try again.')); return; }
        const q=jnGoalById(g.id); if(!q) return;   // ціль могли прибрати, поки йшов запис
        wishes.push({id, img:stored?ref:dataUrl, cap:String(q.name||'').slice(0,60), size:'sq', goalId:String(q.id)});
        saveWishes(); try{ renderWishes(); }catch(_){}
        after(); plToast(mrT('Фото додано — воно й у Карті бажань','Photo added — also on the Vision board'));
      });
    };
    inp.click();
  }
  // привʼязати мрію, яка ще не належить іншій цілі
  function mrLinkWish(g,after){
    let ws=[]; try{ ws=(wishes||[]).filter(w=>w&&!w.goalId&&(w.type==='video'?w.thumb:w.img)); }catch(_){}
    if(!ws.length){ flowAlert(mrT('У Карті бажань нема вільних фото — усі вже привʼязані до цілей. Додай нове фото з телефона.','No free photos on the Vision board. Add a new one from your phone.')); return; }
    jnOverlay(`<div class="jn-ed-h"><b>${mrT('Фото з Карти бажань','From Vision board')}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <div class="mr-pick">${ws.slice(0,40).map(w=>`<button class="mr-ph" data-mrw="${esc(w.id)}" style="background-image:url('${esc(mrWishImg(w))}')" aria-label="${esc(w.cap||mrT('Мрія','Dream'))}"></button>`).join('')}</div>`, ov=>{
      ov.querySelectorAll('[data-mrw]').forEach(b=>b.onclick=()=>{
        const w=(wishes||[]).find(x=>x&&String(x.id)===b.dataset.mrw), q=jnGoalById(g.id);
        if(w&&q&&!w.goalId){ w.goalId=String(q.id); saveWishes(); try{ renderWishes(); }catch(_){} }
        ov.remove(); after();
      });
    });
  }
