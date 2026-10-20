  /* ════════ «Мій рік» · вкладка «Рік» Журналу (57-my-plan.js, 20.10.2026) ════════
     Одна сторінка, розділи завжди в тому самому порядку: Точка Б → Цілі (плитки) → Календар року.
     Порожній розділ не зникає — показує запрошення, тож план не «губиться».
     Етап 1: лише ПОКАЗ наявних даних, нових полів і ключів нема:
       лист — goalsData.letter (40-year-letter.js), цілі — goalsData.goals, фото — мрія з wish.goalId,
       кроки — рівні gl.ms. Рік — наступні 12 місяців: поточний квартал + 3 наступні.
     Сама сторінка нічого не пише: лист — ylEdit, нова ціль — jnEditor, кроки — yrLvMenu (45-year.js).
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
  // «червня 2027» / «June 2027» — у родовому, бо стоїть після «до»
  function mrMonth(ym){
    const y=ym.slice(0,4), show=mrFar(ym+'-01');
    if(mrEn()){ try{ return new Date(ym+'-15T12:00:00').toLocaleDateString('en-US',show?{month:'long',year:'numeric'}:{month:'long'}); }catch(_){} }
    return JN_MON[+ym.slice(5,7)-1]+(show?' '+y:'');
  }
  // фініш цілі — дата останнього кроку (рівні вже відсортовані за датою)
  function mrFinish(g){
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
    c.querySelectorAll('[data-mrg]').forEach(b=>b.onclick=()=>{ const g=jnGoalById(b.dataset.mrg); if(g) moMissionPage(g,'path'); });
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
