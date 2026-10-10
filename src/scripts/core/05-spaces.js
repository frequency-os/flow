  /* ============ ПРОСТОРИ · ПРОЄКТИ · САЙДБАР · ТЕМИ ============
     Простори, екран «Проєкти», профіль сайдбара, бекап, десктопні панелі,
     стилі карток і теми. */
  /* ============ ДОДАТКОВІ ПРОСТОРИ (листки) ============ */
  // Простори існують у КОНТЕКСТІ: загальний Простір (ctx='__root__') або всередині папки (ctx=folderKey).
  // Кожен простір контексту має свій boardKey: головний = baseKey, додаткові = baseKey+'__sp_'+id.

  // мапа просторів: { ctx: [ {id,name,emoji,color} ] }, та активні: { ctx: id }
  let spacesMap={}, activeSpaceMap={};
  const SPMKEY='spaces_map_v2', ACMKEY='active_space_map_v2';
  try{ const r=localStorage.getItem(SPMKEY); if(r){ const p=JSON.parse(r); if(p&&typeof p==='object') spacesMap=p; } }catch(_){}
  try{ const r=localStorage.getItem(ACMKEY); if(r){ const p=JSON.parse(r); if(p&&typeof p==='object') activeSpaceMap=p; } }catch(_){}
  prefCatchup(SPMKEY, v=>{ try{ const p=JSON.parse(v); if(p&&typeof p==='object') spacesMap=p; }catch(_){} });
  prefCatchup(ACMKEY, v=>{ try{ const p=JSON.parse(v); if(p&&typeof p==='object') activeSpaceMap=p; }catch(_){} });


  function saveSpacesMeta(){ try{ prefSet(SPMKEY,JSON.stringify(spacesMap)); prefSet(ACMKEY,JSON.stringify(activeSpaceMap)); }catch(_){} }

  // який зараз контекст: загальний Простір чи папка
  function curCtx(){
    if(spaceFromFolder && spaceFromFolder!=='__general__'){ return currentFolderKey||spaceFromFolder; }
    return '__root__';
  }
  function ctxBaseKey(ctx){ return ctx==='__root__' ? 'all' : ctx; }
  function ctxDefaultMeta(ctx){
    if(ctx==='__root__') return {id:'main',name:'Головний',emoji:'🧩',color:'#7c9cf5'};
    const f=folders[ctx];
    return {id:'main',name:(f&&f.name)||'Головний', emoji:(f&&f.emoji&&f.emoji.trim())||'📁', color:'#7c9cf5'};
  }
  // список просторів контексту (гарантує головний)
  function spacesFor(ctx){
    if(!Array.isArray(spacesMap[ctx]) || !spacesMap[ctx].length){ spacesMap[ctx]=[ctxDefaultMeta(ctx)]; }
    if(!spacesMap[ctx].some(s=>s.id==='main')){ spacesMap[ctx].unshift(ctxDefaultMeta(ctx)); }
    return spacesMap[ctx];
  }
  function activeSpaceFor(ctx){ const a=activeSpaceMap[ctx]; const list=spacesFor(ctx); return list.some(s=>s.id===a)?a:'main'; }
  function keyForSpaceIn(ctx,id){ const base=ctxBaseKey(ctx); return id==='main'?base:(base+'__sp_'+id); }

  // перемкнути простір у поточному контексті (теми папки; Простору більше нема)
  function switchSpace(id){
    const ctx=curCtx();
    activeSpaceMap[ctx]=id; saveSpacesMeta();
    folderPath=[]; // виходимо на корінь простору
    boardKey=keyForSpaceIn(ctx,id);
    if(!boards[boardKey]) boards[boardKey]=[];
    window.platform.haptic('light');
    syncBlocks(); renderBoard();
  }
  // opts.focusId — відкрити документ прокрученим до цього блока (стрибок із Каналу папки)
  // відкрити дошку папки (або її теми) документом-редактором; key — ключ дошки
  function goSpaceFor(key, opts){
    try{
      boardKey=key;
      if(!boards[key]) boards[key]=[];
      if(typeof syncBlocks==='function') syncBlocks();
      spaceFromFolder = String(key).split('__sp_')[0] || (currentFolderKey||null);
      if(typeof window.openFlowPage!=='function'){ goHome(); return; }
      // «назад» з папки, що лежить у групі (або відкрита зі шторки групи), — знову шторка цієї групи
      const fgBase=String(key).split('__sp_')[0];
      const fgBack=window.__fgNext || (folders[fgBase] && folders[fgBase].parent) || '';
      window.__fgNext=null;
      window.__flowExitPage=function(){
        try{ if(typeof goHome==='function'){ goHome();
          if(fgBack && folders[fgBack] && folders[fgBack].gview==='folder'){ goFolder(fgBack); return; }   // група «як папка» — назад у її документ
          if(fgBack && folders[fgBack] && typeof window.openGroupAsChosen==='function') setTimeout(()=>{ try{ window.openGroupAsChosen(fgBack); }catch(_){} },60);
          return; } }catch(_){}
        if(window.__show)window.__show('scr-home'); };
      window.openFlowPage(opts||null);
    }catch(e){ console.error('goSpaceFor', e); goHome(); }
  }
  let spaceFromFolder=null;

  // FAB visible only on space screen
  function show(id){
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav a').forEach(a=>a.classList.remove('on'));
    if(id==='scr-home'){ document.getElementById('navHome').classList.add('on');
      const bm=document.getElementById('brandMark');
      if(bm){ bm.classList.remove('lg-play'); void bm.offsetWidth; bm.classList.add('lg-play'); } }
    if(id==='scr-finance'){ const nf=document.getElementById('navFinance'); if(nf) nf.classList.add('on'); }
    if(id==='scr-world'){ const nw=document.getElementById('navWorld'); if(nw) nw.classList.add('on'); }
    if(id==='scr-journal'){ const nj=document.getElementById('navJournal'); if(nj) nj.classList.add('on'); }
    // перемикач періоду — у Журналі і на «Рік» (Горизонт), щоб повертатись одним тапом
    { const jf=document.getElementById('jnFloat'); if(jf){ jf.hidden=!(id==='scr-journal'||id==='scr-goals'); if(!jf.hidden&&typeof jnFloatRender==='function') jnFloatRender(id==='scr-goals'?'year':null); } }
    // Горизонт («Рік») і старий Планер тепер частина Журналу — світиться «Журнал»
    if(id==='scr-goals'||id==='scr-planner'){ const nj=document.getElementById('navJournal'); if(nj) nj.classList.add('on'); }
    if(id==='scr-more'||id==='scr-projects'||id==='scr-work'){ const nmr=document.getElementById('navMore'); if(nmr) nmr.classList.add('on'); }
    // синхронізація десктопного сайдбару
    const dmap={'scr-journal':'journal','scr-home':'home','scr-goals':'journal','scr-projects':'projects',
                'scr-finance':'finance','scr-planner':'journal','scr-debts':'finance','scr-spend':'finance','scr-work':'projects','scr-wishes':'home','scr-more':'more','scr-nyc':'more','scr-page':'home','scr-world':'world'};
    const dkey=dmap[id]||'home';
    document.querySelectorAll('.dsb-i').forEach(b=>b.classList.toggle('on', b.dataset.dnav===dkey));
    document.body.classList.toggle('in-home', id==='scr-home');
    document.body.classList.toggle('in-reader', id==='scr-reader');
    // Канал папки: ховає нижню панель і котика (18-channel.css)
    document.body.classList.toggle('in-channel', id==='scr-channel');
    // «Мій світ» — гра на весь екран над нижньою панеллю (20-world.css)
    document.body.classList.toggle('in-world', id==='scr-world');
    if(id==='scr-reader'){ try{ initReader(); applyRdrCfg(); }catch(_){} }
    if(id==='scr-nyc'){ try{ if(window.__nycRefresh) window.__nycRefresh(); }catch(_){} }
    if(id==='scr-home'){ try{ renderRightRail(); }catch(_){} }
    // ВАЖЛИВО: <html> має overflow:hidden, а <body> — position:fixed зі своїм
    // overflow-y:auto. Тобто реальний скрол — на body, а не на window/html.
    // window.scrollTo() тут ЗАВЖДИ був no-op — ось чому попередні спроби
    // скинути прокрутку при перемиканні екрану іноді "не працювали".
    try{ document.body.scrollTop = 0; }catch(_){}
    try{ window.scrollTo({top:0, behavior:'instant'}); }catch(_){} // про всяк випадок, якщо колись зміниться CSS
    setTimeout(()=>{ try{ document.body.scrollTop = 0; }catch(_){} }, 80);
  }
  try{ window.__show=show; }catch(_){}

  document.getElementById('navHome').onclick = goHome;
  document.getElementById('navFinance').onclick = goFinance;
  document.getElementById('navPlanner').onclick = ()=>{ goPlanner(); };
  // клавіатура / VoiceOver: «кнопки» не з <button> (таб-бар <a> без href, іконки шапки <div>)
  // мають role="button" і tabindex — Enter чи Пробіл спрацьовують як тап
  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ') return;
    const t=e.target;
    if(!t||!t.matches||!t.matches('[role="button"]:not(button):not(input):not(textarea)')) return;
    e.preventDefault(); t.click();
  });


  // ── профіль у футері сайдбара: Google-акаунт + меню функцій ──
  function dsbFillUser(){
    try{
      const g=(window.sbUser&&window.sbUser())||null;
      const av=document.getElementById('dsbAv'), nm=document.getElementById('dsbNm');
      if(!av||!nm) return;
      if(g){
        const gname=(g.user_metadata&&g.user_metadata.full_name)||g.email||'Google';
        nm.innerHTML=esc(gname)+'<small>'+esc(g.email||'Google')+'</small>';
        const pic=g.user_metadata&&g.user_metadata.avatar_url;
        if(customAvatar){ av.style.background='url('+customAvatar+') center/cover'; av.textContent=''; }
        else if(pic){ av.style.background='url('+pic+') center/cover'; av.textContent=''; }
        else{ av.style.background=''; av.textContent=(gname[0]||'G').toUpperCase(); av.style.display='grid'; av.style.placeItems='center'; av.style.fontWeight='800'; av.style.color='#fff'; }
      }else{
        /* На native лишаємо нейтральний текст: рецензент App Store не має
           бачити пропозицію відкрити апку деінде (правило 2.1). */
        nm.innerHTML=window.FLOW_NATIVE
          ? 'Цей пристрій<small>дані зберігаються локально</small>'
          : 'Гість<small>увійди, щоб дані були на всіх пристроях</small>';
        if(customAvatar){ av.style.background='url('+customAvatar+') center/cover'; av.textContent=''; }
        else{ av.style.background=''; av.textContent='F'; av.style.display='grid'; av.style.placeItems='center'; av.style.fontWeight='800'; av.style.color='#fff'; }
      }
    }catch(e){ console.error('dsbFillUser',e); }
  }
  window.dsbFillUser=dsbFillUser;
  function dsbProfileSheet(){
    const old=document.getElementById('dsbProf'); if(old){ old.remove(); return; }
    const g=(window.sbUser&&window.sbUser())||null;
    const name=(g?((g.user_metadata&&g.user_metadata.full_name)||g.email||'Google'):(window.FLOW_NATIVE?'Цей пристрій':'Гість'));
    const sub=(g?esc(g.email||'Google'):(window.FLOW_NATIVE?'дані зберігаються локально':'Frequency'));
    const gPic=g&&g.user_metadata&&g.user_metadata.avatar_url;
    const photo=customAvatar||gPic||'';
    const ov=document.createElement('div'); ov.id='dsbProf'; ov.className='dsb-prof';
    ov.innerHTML=`<div class="dsb-prof-in">
      <div class="dpr-head">
        <div class="dpr-av">${photo?'<img src="'+photo+'" alt="">':(esc((name[0]||'F').toUpperCase()))}</div>
        <div class="dpr-nm">${esc(name)}<small>${sub}</small></div>
      </div>
      <button class="dpr-i" data-act="ai">✨ Відкрити Флоу</button>
      ${(typeof aiProxyUiOn==='function'&&aiProxyUiOn()) ? '<button class="dpr-i" data-act="proxy">⚙️ AI-проксі</button>' : ''}
      <button class="dpr-i" data-act="theme">🌓 Змінити тему</button>
      <button class="dpr-i" data-act="settings">⚙️ Всі налаштування</button>
    </div>`;
    ov.onclick=e=>{ if(e.target===ov) ov.remove(); };
    document.body.appendChild(ov);
    ov.querySelectorAll('.dpr-i').forEach(b=>b.onclick=()=>{
      const a=b.dataset.act; ov.remove();
      if(a==='ai'&&window.aiChatSheet) window.aiChatSheet();
      else if(a==='proxy'&&typeof aiConfig==='function') aiConfig(()=>{});
      else if(a==='theme'){ const t=document.getElementById('themeToggle'); if(t) t.click(); }
      else if(a==='settings'&&window.openSettingsSheet) window.openSettingsSheet();
    });
  }
  { const f=document.getElementById('dsbFoot'); if(f) f.onclick=dsbProfileSheet; }
  dsbFillUser();

  /* ═══ ІКОНКИ ЕКРАНА «ЩЕ» ═══
     Лінійні, білі на кольоровій плашці — «стиль B», той самий, що в «Сферах»
     (39-spheres.js). Заміна 18 емодзі (рішення Ярослава 03.10.2026): решта
     застосунку давно на лінійних іконках, налаштування лишались останнім
     місцем зі старим почерком. 29-more-screen.js бере їх через window.stgIco. */
  const STG_COL={blue:'#5b8def',violet:'#8b7cff',green:'#22c55e',orange:'#f97316',amber:'#e0a428',
    pink:'#ec6aa0',teal:'#2bb3c0',slate:'#6b7280',red:'#ef5350'};
  const STG_IC={
    user:'<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    key:'<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 20 3M16 7l3 3M14 9l2 2"/>',
    backup:'<path d="M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5A4 4 0 0 1 17.5 18"/><path d="M12 12v8M9 15l3-3 3 3"/>',
    sync:'<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>',
    disk:'<ellipse cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6"/><path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8"/>',
    reset:'<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v5h5"/>',
    globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>',
    theme:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>',
    palette:'<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.8 0-1.4-1.4-1.7-1.4-3 0-1 .8-1.7 1.8-1.7h2.3a3.5 3.5 0 0 0 3.5-3.5c0-3.9-3.6-7-8-7z"/><circle cx="7.6" cy="11" r="1.1" fill="currentColor"/><circle cx="10" cy="7.2" r="1.1" fill="currentColor"/><circle cx="14.4" cy="7.4" r="1.1" fill="currentColor"/>',
    mode:'<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 9.5h17M8 9.5V19"/>',
    paw:'<circle cx="7" cy="10" r="1.8"/><circle cx="10.5" cy="6.5" r="1.8"/><circle cx="14.5" cy="6.5" r="1.8"/><circle cx="18" cy="10" r="1.8"/><path d="M12 12c-3 0-5.5 3-5.5 5.2 0 1.6 1.3 2.3 2.8 2.3 1.2 0 1.8-.6 2.7-.6s1.5.6 2.7.6c1.5 0 2.8-.7 2.8-2.3C17.5 15 15 12 12 12z"/>',
    lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    bolt:'<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/>',
    inbox:'<path d="M3.5 13.5 6 5.5h12l2.5 8V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19z"/><path d="M3.5 13.5h4.5l1.5 2.5h5l1.5-2.5h4.5"/>',
    target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
    info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
    bug:'<rect x="7.5" y="7.5" width="9" height="12" rx="4.5"/><path d="M12 11.5v8M7.5 13H4M20 13h-3.5M8 9 5.5 6.5M16 9l2.5-2.5M7.8 17 5 19M16.2 17l2.8 2M9.5 7.5a2.5 2.5 0 0 1 5 0"/>',
    code:'<path d="m8.5 8-4.5 4 4.5 4M15.5 8l4.5 4-4.5 4M13.5 5.5l-3 13"/>',
    lang:'<path d="M4 6h9M8.5 4v2M6 6c.7 3 2.7 5.3 5.5 6.5M11 6c-.8 3.3-3 6-6.5 7.5"/><path d="M13 20l3.5-8.5L20 20M14.2 17.2h4.6"/>',
    folder:'<path d="M3.5 7a2 2 0 0 1 2-2h3.5l2 2.5h7.5a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    book:'<path d="M6 3.5h11a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z"/><path d="M6 3.5v17M9 8h6M9 12h6"/>',
    compass:'<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    dna:'<path d="M7 3.5c0 5 10 5 10 10s-10 5-10 7M17 3.5c0 5-10 5-10 10s10 5 10 7M8.5 7h7M8.5 17h7"/>',
    city:'<path d="M3.5 20.5h17M5 20.5V9l5-3v14.5M10 20.5V4l6 3.5v13M16 20.5V11l3.5 2v7.5"/>',
    chev:'<path d="m9.5 6 6 6-6 6"/>'
  };
  function stgSvg(name){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(STG_IC[name]||'')+'</svg>';
  }
  // плашка з іконкою; color — ключ STG_COL або готовий колір
  function stgIco(name, color){
    // лише ключ зі STG_COL або hex — стрічка йде в атрибут style
    const c=STG_COL[color]||(/^#[0-9a-f]{3,8}$/i.test(String(color||''))?color:STG_COL.slate);
    return '<span class="mr-ti" style="--c:'+c+'">'+stgSvg(name)+'</span>';
  }
  try{ window.stgIco=stgIco; window.stgSvg=stgSvg; }catch(_){}

  /* ═══ НАЛАШТУВАННЯ ═══
     Три розділи екрана «Ще»: Вигляд, Напарник, AI і приватність. Раніше це була
     окрема картка, схована за рядком «Всі налаштування»; тепер розділи видно
     одразу, а місце кожного на екрані задає data-sec (22-more-screen.css).
     Прибрано 03.10.2026: «Живе скло» — у «Робочому столі» перемикач нічого не
     міняв (єдиний шар, який він чіпає, схований в обох станах; перевірено на
     живому сайті). Сама логіка homeGlass лишилась — у класичному наборі вона
     ще діє, просто без перемикача. */
  function renderSettingsCard(){
    const host=document.getElementById('settingsCard'); if(!host) return;
    const lang=(window.flowLang&&window.flowLang())||'uk';
    /* Англійська поки чорнова: словник (01-base.js) міняє лише частину слів, і
       виходить мішанина — «ЦЬОГО WEEK», «Історія days». Для App Store це
       «незавершений застосунок» (APP-8, BUGS-3, 10.10.2026). Тому рядок «Мова»
       бачить лише той, у кого EN уже стоїть, — щоб міг повернутись на українську.
       Сховище не чіпаємо, код перекладу лишається: повний переклад — поверне рядок. */
    const langRow=lang==='en';
    const devOn=(typeof aiDevOn==='function')&&aiDevOn();
    const ctOn=(function(){ try{ return localStorage.getItem('dev_translate_content')==='1'; }catch(_){ return false; } })();
    const set=themeSetOf(theme), dark=themeIsDark(theme);
    const um=(window.uiMode==='lite')?'lite':'pro';
    const petOn=!(typeof window.petHidden==='function' && window.petHidden());
    /* AI-проксі — для розробника: адреса за замовчуванням уже вшита (09-goals.js).
       Показуємо лише власнику (aiProxyUiOn → upDevOn: акаунт розробника чи flow_dev=1,
       лише веб) або коли людина колись поставила свою адресу — щоб могла її повернути. */
    let epCustom=false;
    try{ epCustom = typeof aiEndpoint==='function' && typeof AI_EP_DEFAULT!=='undefined' && aiEndpoint()!==AI_EP_DEFAULT; }catch(_){}
    const showProxy=!window.FLOW_NATIVE && ((typeof aiProxyUiOn==='function'&&aiProxyUiOn()) || epCustom);
    // мініатюри наборів: тло темної теми + акцент набору (01-tokens-base.css)
    const SW={desk:['#101317','#7c93ff'], studio:['#0e1011','#d4a24c'], classic:['#0c0e14','#8b7cff']};
    const swatches=Object.keys(THEME_SETS).map(id=>{
      const c=SW[id]||['#222','#888'];
      return `<button class="mr-sw ${set===id?'on':''}" data-ts="${id}" title="${THEME_SETS[id].name}" aria-label="${THEME_SETS[id].name}" aria-pressed="${set===id}" style="--a:${c[0]};--b:${c[1]}"></button>`;
    }).join('');
    const seg=(attr,items,cur)=>'<span class="mr-seg">'+items.map(([v,l])=>`<button data-${attr}="${v}" class="${v===cur?'on':''}" aria-pressed="${v===cur}">${l}</button>`).join('')+'</span>';
    host.innerHTML = `
      <div class="mr-sl" data-sec="look">Вигляд</div>
      <div class="mr-grp" data-sec="look">
        <div class="mr-row">${stgIco('theme','violet')}
          <span class="mr-tx"><b>Тема</b><small>${THEME_META[theme]?THEME_META[theme][1]:''}</small></span>
          ${seg('tm',[['light','Світла'],['dark','Темна']],dark?'dark':'light')}</div>
        <div class="mr-row">${stgIco('palette','pink')}
          <span class="mr-tx"><b>Стиль</b><small>${THEME_SETS[set].name}</small></span>
          <span class="mr-sws" id="stgThemeSetSeg">${swatches}</span></div>
        ${langRow?`<div class="mr-row">${stgIco('globe','teal')}
          <span class="mr-tx"><b>Мова</b><small>Interface language</small></span>
          <span class="mr-seg" id="stgLangSeg">
            <button data-l="uk" class="${lang==='uk'?'on':''}">UA</button>
            <button data-l="en" class="${lang==='en'?'on':''}">EN</button></span></div>`:''}
        <div class="mr-row">${stgIco('mode','slate')}
          <span class="mr-tx"><b>Режим</b><small>${um==='lite'?'Lite: внизу лише Планер і Гроші':'Pro: увесь Frequency з Оглядом'}</small></span>
          ${seg('uimode',[['lite','Lite'],['pro','Pro']],um)}</div>
      </div>
      <div class="mr-sl" data-sec="pet">Напарник</div>
      <div class="mr-grp" data-sec="pet">
        <div class="mr-row">${stgIco('paw','orange')}
          <span class="mr-tx"><b>Показувати котика</b><small>на Огляді й у списках</small></span>
          <button class="mr-tg ${petOn?'on':''}" id="stgPetSw" role="switch" aria-checked="${petOn}" aria-label="Показувати котика"></button></div>
      </div>
      <div class="mr-sl" data-sec="ai">AI і приватність</div>
      <div class="mr-grp" data-sec="ai">
        <button class="mr-row" id="stgAiPriv">${stgIco('lock','green')}
          <span class="mr-tx"><b>AI і приватність</b><small>що бачить AI · згода · закриті розділи</small></span>
          <span class="mr-chev">${stgSvg('chev')}</span></button>
        ${showProxy?`<div class="mr-row">${stgIco('code','slate')}
          <span class="mr-tx"><b>AI-проксі</b><small>для розробника · адреса сервера</small></span>
          <button class="mr-go" id="stgProxyBtn">Відкрити</button></div>`:''}
        ${devOn?`<div class="mr-row">${stgIco('lang','slate')}
          <span class="mr-tx"><b>Перекладати мій контент</b><small>папки, сторінки, нотатки → EN · dev</small></span>
          <button class="mr-tg ${ctOn?'on':''}" id="stgCtSw" role="switch" aria-checked="${ctOn}" aria-label="Перекладати контент"></button></div>`:''}
      </div>
    `;
    host.querySelectorAll('#stgLangSeg button').forEach(b=>b.onclick=()=>{
      const l=b.dataset.l;
      if(l!==lang && window.flowSetLang) window.flowSetLang(l);
      // уже перекладені підписи назад не вертаються, а рядок «Мова» зараз зникне — кажемо чесно
      if(l==='uk' && lang==='en'){ try{ plToast('Мову змінено на українську — решта підписів оновиться після перезапуску'); }catch(_){} }
      renderSettingsCard();
    });
    host.querySelectorAll('[data-tm]').forEach(b=>b.onclick=()=>{
      const s=THEME_SETS[themeSetOf(theme)];
      const want=b.dataset.tm==='dark';
      if(want!==themeIsDark(theme)) setTheme(want ? s.dark : s.light);
    });
    host.querySelectorAll('[data-ts]').forEach(b=>b.onclick=()=>setThemeSet(b.dataset.ts));
    host.querySelectorAll('[data-uimode]').forEach(b=>b.onclick=()=>{
      (window.setUiMode||function(){})(b.dataset.uimode);
      renderSettingsCard();
      try{ if(window.renderMore) window.renderMore(); }catch(_){}
    });
    const ps=document.getElementById('stgPetSw'); if(ps) ps.onclick=()=>{
      try{ if(typeof window.petHiddenSet==='function') window.petHiddenSet(!window.petHidden()); }catch(_){}
      renderSettingsCard();
    };
    const ap=document.getElementById('stgAiPriv'); if(ap) ap.onclick=()=>{ if(window.aiPrivacySheet) window.aiPrivacySheet(); };
    const pb=document.getElementById('stgProxyBtn'); if(pb) pb.onclick=()=>{ if(typeof aiConfig==='function') aiConfig(()=>{ renderSettingsCard(); }); };
    const cs=document.getElementById('stgCtSw'); if(cs) cs.onclick=()=>{ if(typeof devContentTranslateToggleSheet==='function') devContentTranslateToggleSheet(); setTimeout(renderSettingsCard,50); };
  }
  window.renderSettingsCard = renderSettingsCard;
  document.addEventListener('flowlangchange', renderSettingsCard);
  /* Шестірня на Огляді веде на «Ще» до розділу «Вигляд»: на телефоні —
     прокрутка, на комп'ютері — розділ відкривається праворуч (moreShowSection,
     29-more-screen.js). Окремої картки, яку треба розгортати, більше немає. */
  function openSettings(){
    if(typeof goMore==='function') goMore();
    // 160 мс, не менше: show() скидає прокрутку body двічі — одразу і ще раз
    // через 80 мс. Раніше прокрутка до «Вигляду» спрацьовувала на 60 мс і
    // затиралася цим другим скиданням — шестірня вела на «Ще», але нагору.
    setTimeout(()=>{ try{ if(window.moreShowSection) window.moreShowSection('look', true); }catch(_){} }, 160);
  }
  window.openSettingsSheet = openSettings; // збережено для сумісності викликів нижче
  { const gb=document.getElementById('dashSettingsBtn'); if(gb) gb.onclick=openSettings; }

  // ── сторінка папки: режим «на весь екран» ↔ «вузька колонка» ──
  { const wb=document.getElementById('pgWideBtn'), pg=document.getElementById('scr-page');
    if(wb&&pg){
      // водяна стрілка виходу із zen
      const zb=document.createElement('button');
      zb.className='pg-zenback'; zb.innerHTML='‹'; zb.title='Повернутись';
      document.body.appendChild(zb);
      function setZen(on){
        pg.classList.toggle('pg-zen',on);
        pg.classList.toggle('pg-wide',on);
        document.body.classList.toggle('pg-zen-on',on);
        try{ localStorage.setItem('pg_wide',on?'1':'0'); }catch(_){}
      }
      zb.onclick=()=>setZen(false);
      try{ if(localStorage.getItem('pg_wide')==='1') setZen(true); }catch(_){}
      wb.onclick=()=>setZen(!pg.classList.contains('pg-zen'));
    } }

  // ── десктопний сайдбар: ті самі дії, що й мобільна навігація ──
  document.querySelectorAll('.dsb-i').forEach(b=>b.onclick=()=>{
    const k=b.dataset.dnav;
    if(k==='home') goHome();
    else if(k==='ai'){ if(window.aiChatSheet) window.aiChatSheet(); }
    else if(k==='folders'){ goHome(); setTimeout(()=>{ const el=document.getElementById('folderGrid'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); },120); }
    /* «Простір» прибрано з навігації — всі дошки живуть у папках */
    else if(k==='finance') goFinance();
    else if(k==='planner') goPlanner();
    else if(k==='projects'){ try{ goProjects(); }catch(e){ console.error('dnav projects',e); } }
    else if(k==='more') goMore();
  });

  // ── ЗГОРТАННЯ ЛІВОЇ ПАНЕЛІ + ПОВНОЕКРАННИЙ ПРОСТІР (десктоп) ──
  let sidebarCollapsed=false, spaceFull=false;
  try{ sidebarCollapsed = localStorage.getItem('sidebarcol')==='1'; }catch(_){}
  try{ spaceFull = localStorage.getItem('spacefull')==='1'; }catch(_){}
  prefCatchup('sidebarcol', v=>{ sidebarCollapsed = v==='1'; try{applyChrome();}catch(_){} });
  prefCatchup('spacefull', v=>{ spaceFull = v==='1'; try{applyChrome();}catch(_){} });
  function applyChrome(){
    document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
    document.body.classList.toggle('space-full', spaceFull);
    const ft=document.getElementById('spaceFullToggle');
    if(ft) ft.classList.toggle('on', spaceFull);
  }
  { const c=document.getElementById('sidebarCollapse');
    if(c) c.onclick=()=>{ sidebarCollapsed=true; try{prefSet('sidebarcol','1');}catch(_){} applyChrome(); }; }
  { const r=document.getElementById('sidebarReveal');
    if(r) r.onclick=()=>{ sidebarCollapsed=false; try{prefSet('sidebarcol','0');}catch(_){} applyChrome(); }; }
  { const f=document.getElementById('spaceFullToggle');
    if(f) f.onclick=()=>{ spaceFull=!spaceFull; try{prefSet('spacefull',spaceFull?'1':'0');}catch(_){}
      applyChrome(); try{window.platform.haptic('select');}catch(_){} }; }
  try{ applyChrome(); }catch(_){}

  // ── Варіант 3: панель віджетів на Огляді (десктоп) ──
  let homeWidgets=false;
  try{ homeWidgets = localStorage.getItem('homewidgets')==='1'; }catch(_){}
  prefCatchup('homewidgets', v=>{ homeWidgets = v==='1'; });
  function applyHomeWidgets(){
    document.body.classList.toggle('home-widgets', homeWidgets);
    // якщо ми зараз на Огляді — гарантуємо клас in-home для показу панелі
    if(document.getElementById('scr-home')?.classList.contains('active')){
      document.body.classList.add('in-home');
    }
    if(homeWidgets) try{ renderRightRail(); }catch(_){}
  }
  { const b=document.getElementById('homeWidgetsToggle');
    if(b) b.onclick=()=>{ homeWidgets=!homeWidgets;
      try{ prefSet('homewidgets', homeWidgets?'1':'0'); }catch(_){}
      applyHomeWidgets(); }; }

  /* ── перемикач теми ──
     Три старі теми (dark / black / light) лишились як були — вони живуть
     у наборі «classic» і гортаються тією ж каруселлю, що й раніше.
     Додано два нові набори: desk («Робочий стіл») і studio («Студія»),
     у кожного своя світла й темна пара. Кнопка в шапці всередині нового
     набору не гортає по колу, а перемикає світло↔темно — з семи тем
     карусель була б незручною. Сам набір обирають у Налаштуваннях. */
  const THEME_SETS={
    classic:{ name:'Класична',      light:'light',        dark:'dark' },
    desk:   { name:'Робочий стіл',  light:'desk-light',   dark:'desk-dark' },
    studio: { name:'Студія',        light:'studio-light', dark:'studio-dark' },
  };
  // [значок, назва, колір шапки платформи, id SVG-іконки або '' для емодзі]
  const THEME_META={
    dark:          ['🌙','Frequency-дарк',        '#0c0e14','i-moon'],
    black:         ['⚫','Чорна (AMOLED)',        '#000000','i-moon'],
    light:         ['☀️','Світла',                '#f4f6fb','i-sun'],
    'desk-light':  ['', 'Робочий стіл · світла',  '#f6f7f9','i-sun'],
    'desk-dark':   ['', 'Робочий стіл · темна',   '#101317','i-moon'],
    'studio-light':['', 'Студія · світла',        '#f7f7f6','i-sun'],
    'studio-dark': ['', 'Студія · темна',         '#0e1011','i-moon'],
  };
  const THEME_KEYS=Object.keys(THEME_META);
  const isTheme=v=>THEME_KEYS.indexOf(v)>=0;
  // до якого набору належить тема (для перемикача в Налаштуваннях)
  function themeSetOf(t){
    for(const id in THEME_SETS){ const s=THEME_SETS[id]; if(s.light===t||s.dark===t) return id; }
    return 'classic'; // 'black' теж класика
  }
  function themeIsDark(t){ return t!=='light' && t!=='desk-light' && t!=='studio-light'; }
  let theme='desk-dark';
  try{ const t=localStorage.getItem('flowtheme'); if(isTheme(t)) theme=t; }catch(_){}
  /* Базовий набір — desk (рішення Ярослава 01.09.2026): чистий плоский дизайн +
     нейтральна палітра. Хто був на класичній темі — переїжджає на пару desk
     (light→desk-light, dark/black→desk-dark), нові користувачі стартують на
     desk-dark. Робиться РАЗ (прапорець), далі будь-який вибір сталий — класична,
     студія, AMOLED лишаються доступними в «Набір стилю».
     Поза реєстром MIGRATIONS_ONCE (27-canvas.js) навмисно: тема потрібна ДО
     першого малювання, а load() ще не почався. Тому пишемо лише справжній
     перехід зі збереженої класичної теми; новий дефолт не записуємо зовсім —
     він і так 'desk-dark' (вище), а запис зі свіжою міткою на новому пристрої
     поїхав би в хмару поверх теми, яку людина вибрала деінде. */
  try{
    if(!localStorage.getItem('theme_flat_default_v1')){
      const MIG={ light:'desk-light', dark:'desk-dark', black:'desk-dark' };
      const saved=localStorage.getItem('flowtheme');
      if(saved && MIG[saved]){                    // був на класичній — переносимо
        theme=MIG[saved];
        try{ prefSet('flowtheme', theme); }catch(_){ try{ localStorage.setItem('flowtheme', theme); }catch(_){} }
      }
      // прапорець — лише після проходу (виняток вище → спробуємо при наступному старті)
      localStorage.setItem('theme_flat_default_v1','1');
    }
  }catch(_){}
  function applyTheme(){
    const r=document.documentElement;
    // 'dark' — тема за замовчуванням, вона живе на голому :root без атрибута
    if(theme==='dark') r.removeAttribute('data-theme');
    else r.setAttribute('data-theme',theme);
    // Плаский дизайн — УНІВЕРСАЛЬНИЙ для всіх тем (рішення Ярослава 01.09.2026):
    // рівні поверхні замість градієнтів, лінійні іконки замість емодзі. Оновлення
    // застосунку одне на всі теми; самі теми — лише палітри кольорів поверх нього.
    r.classList.add('t-flat');
    /* «Це світла тема» — для будь-якої світлої теми (не лише нових наборів).
       Десятки правил написані як html[data-theme="light"]; цей клас дає їх також
       світлим desk-light / studio-light, а для класичної light просто дублює
       наявні правила (нешкідливо). */
    r.classList.toggle('t-light', !themeIsDark(theme));
    const m=THEME_META[theme]||THEME_META.dark;
    const b=document.getElementById('themeToggle');
    if(b){
      if(m[3]) b.innerHTML=`<svg class="ico"><use href="#${m[3]}"/></svg>`;
      else b.textContent=m[0];
      b.title='Тема: '+m[1];
    }
    // синхронізувати колір системної панелі, якщо платформа вміє
    window.platform.setBgColor(m[2]);
  }
  prefCatchup('flowtheme', v=>{ if(isTheme(v)){ theme=v; applyTheme(); } });
  function setTheme(t){
    if(!isTheme(t)||t===theme) return;
    theme=t;
    try{ prefSet('flowtheme', theme); }catch(_){}
    applyTheme();
    try{ if(typeof renderSettingsCard==='function') renderSettingsCard(); }catch(_){}
    try{ if(typeof plToast==='function'){ const m=THEME_META[theme]; plToast((m[0]?m[0]+' ':'')+m[1]); } }catch(_){}
    window.platform.haptic('light');
  }
  // вибір набору з Налаштувань: лишаємось на тій самій половині (світло/темно)
  function setThemeSet(id){
    const s=THEME_SETS[id]; if(!s) return;
    setTheme(themeIsDark(theme) ? s.dark : s.light);
  }
  function toggleTheme(){
    const set=themeSetOf(theme);
    // класика: стара карусель dark → black → light → dark, без змін
    if(set==='classic'){ setTheme(theme==='dark' ? 'black' : theme==='black' ? 'light' : 'dark'); return; }
    const s=THEME_SETS[set];
    setTheme(themeIsDark(theme) ? s.light : s.dark);
  }
  { const b=document.getElementById('themeToggle'); if(b) b.onclick=toggleTheme; }
  /* Обгортки для інших частин програми. Імена НАВМИСНО інші, ніж у самих
     функцій: файли складаються в один глобальний скоуп, тож window.themeSetOf
     затер би функцію themeSetOf і вона почала б викликати саму себе. */
  try{ window.flowSetThemeSet=setThemeSet; window.flowThemeSet=()=>themeSetOf(theme); window.FLOW_THEME_SETS=THEME_SETS; }catch(_){}

  // ── PRO-СТИЛЬ (Quiet Luxe + aurora + bento hero) ── увімкнено за замовчуванням
  let proTheme=true;
  try{ const p=localStorage.getItem('flowprotheme'); if(p==='0') proTheme=false; }catch(_){}
  function applyProTheme(){
    document.body.classList.toggle('theme-pro', proTheme);
    const b=document.getElementById('proThemeToggle');
    if(b){ b.classList.toggle('on', proTheme); b.title = proTheme?'Pro-стиль увімкнено (тап → вимкнути)':'Pro-стиль вимкнено (тап → увімкнути)'; }
  }
  prefCatchup('flowprotheme', v=>{ proTheme = v!=='0'; applyProTheme(); });
  function toggleProTheme(){
    proTheme=!proTheme;
    try{ prefSet('flowprotheme', proTheme?'1':'0'); }catch(_){}
    applyProTheme();
    try{ if(document.body.classList.contains('in-space')) renderBoard(); }catch(_){}
    try{ window.platform.haptic('light'); }catch(_){}
  }
  { const b=document.getElementById('proThemeToggle'); if(b) b.onclick=toggleProTheme; }

  // ── СТИЛЬ КАРТОК: класика / скло / бенто (вибір у налаштуваннях простору) ──
  let cardSkin='classic';
  try{ const cs=localStorage.getItem('flowcardskin'); if(cs==='glass'||cs==='bento') cardSkin=cs; }catch(_){}
  function applyCardSkin(){
    document.body.classList.toggle('cardskin-glass', cardSkin==='glass');
    document.body.classList.toggle('cardskin-bento', cardSkin==='bento');
    document.querySelectorAll('[data-cardskin]').forEach(b=>b.classList.toggle('on', b.dataset.cardskin===cardSkin));
  }
  prefCatchup('flowcardskin', v=>{ if(v==='classic'||v==='glass'||v==='bento'){ cardSkin=v; applyCardSkin(); } });
  try{ applyCardSkin(); }catch(_){}
  try{ applyProTheme(); }catch(_){}


  // ── фічу «ручний десктопний режим» видалено; чистимо старі збережені прапорці,
  //    щоб у користувачів не лишався зламаний viewport зі старих версій.
  //    Тут — лише сирі ключі цього пристрою. '0' у сховищі/хмарі ставить реєстр
  //    міграцій (migForceLayoutOff, 27-canvas.js): раніше prefSet ішов при КОЖНОМУ
  //    старті, навіть коли хмара мовчить, і щоразу слав у неї свіжий запис. ──
  try{
    localStorage.removeItem('forcedesktop');
    localStorage.removeItem('forcemobile');
  }catch(_){}

  // наповнення правої панелі: конфігуроване користувачем (вибір/порядок/вимкнення)
  const RR_DEFS={tasks:'🎯 Завдання', streak:'🔥 Streak', tip:'⚡ Підказка'};   // «💰 Баланс» прибрано 09.10.2026 — гроші тепер віджети «Гроші» на Огляді
  function rrCfg(){
    try{ const j=JSON.parse(localStorage.getItem('rrail_cfg')||''); 
      if(Array.isArray(j)&&j.length&&j.every(x=>x&&RR_DEFS[x.id])) return j; }catch(_){}
    return [{id:'tasks',on:true},{id:'streak',on:true},{id:'tip',on:true}];
  }
  function rrSave(c){ try{ localStorage.setItem('rrail_cfg',JSON.stringify(c)); }catch(_){} }
  function rrCfgSheet(){
    const old=document.getElementById('rrCfgOv'); if(old){ old.remove(); return; }
    const ov=document.createElement('div'); ov.id='rrCfgOv'; ov.className='dsb-prof';
    const draw=()=>{
      const cfg=rrCfg();
      ov.innerHTML=`<div class="dsb-prof-in" style="left:auto;right:14px;bottom:auto;top:80px;width:270px">
        <div class="dpr-head" style="border-bottom:none;padding-bottom:6px"><div class="dpr-nm">Панель «Сьогодні»<small>що показувати і в якому порядку</small></div></div>
        ${cfg.map((w,i)=>`<div class="rrcfg-row">
          <label><input type="checkbox" data-rron="${i}" ${w.on?'checked':''}> ${RR_DEFS[w.id]}</label>
          <span class="rrcfg-mv"><button data-rrup="${i}" ${i===0?'disabled':''}>↑</button><button data-rrdn="${i}" ${i===cfg.length-1?'disabled':''}>↓</button></span>
        </div>`).join('')}
      </div>`;
      ov.querySelectorAll('[data-rron]').forEach(c=>c.onchange=()=>{ const cf=rrCfg(); cf[+c.dataset.rron].on=c.checked; rrSave(cf); renderRightRail(); draw(); });
      ov.querySelectorAll('[data-rrup]').forEach(b=>b.onclick=()=>{ const cf=rrCfg(), i=+b.dataset.rrup; [cf[i-1],cf[i]]=[cf[i],cf[i-1]]; rrSave(cf); renderRightRail(); draw(); });
      ov.querySelectorAll('[data-rrdn]').forEach(b=>b.onclick=()=>{ const cf=rrCfg(), i=+b.dataset.rrdn; [cf[i+1],cf[i]]=[cf[i],cf[i+1]]; rrSave(cf); renderRightRail(); draw(); });
    };
    ov.onclick=e=>{ if(e.target===ov) ov.remove(); };
    document.body.appendChild(ov); draw();
  }
  function renderRightRail(){
    const el=document.getElementById('rightRail'); if(!el) return;
    // завдання сьогодні — з блоків Простору типу task
    let taskTotal=0, taskDone=0;
    try{
      const walk=(arr)=>arr.forEach(b=>{
        if(b.type==='task'){ taskTotal++; if(b.done) taskDone++; }
        if(isContainer(b)&&Array.isArray(b.children)) walk(b.children);
      });
      Object.values(boards||{}).forEach(arr=>{ if(Array.isArray(arr)) walk(arr); });
    }catch(_){}
    // streak звичок (якщо доступно) — фолбек на 0
    let streak=0;
    try{ if(typeof habitStreak==='number') streak=habitStreak; }catch(_){}

    const W={
      tasks:`<div class="wgt" style="--wc:#5b8def"><div class="wh"><div class="wi">🎯</div><div><div class="wn">${taskTotal?taskTotal:'0'} завдань</div></div></div>
        <div class="wd">${taskTotal?`${taskDone} виконано · ${taskTotal-taskDone} лишилось`:'Додай завдання у папці'}</div></div>`,
      streak:`<div class="wgt" style="--wc:#34c77b"><div class="wh"><div class="wi">🔥</div><div><div class="wn">Streak ${streak} дн.</div></div></div>
        <div class="wd">${streak?'Звички тримаються':'Почни звичку сьогодні'}</div></div>`,
      tip:`<div class="wgt" style="--wc:#c77dff"><div class="wh"><div class="wi">⚡</div><div><div class="wn">Швидко</div></div></div>
        <div class="wd">Відкрий папку, щоб додати блок</div></div>`
    };
    el.innerHTML = `<div class="rrail-h">Сьогодні <button class="rrcfg-btn" id="rrCfgBtn" title="Налаштувати панель">⚙</button></div>`
      + rrCfg().filter(w=>w.on).map(w=>W[w.id]||'').join('');
    const g=el.querySelector('#rrCfgBtn'); if(g) g.onclick=rrCfgSheet;
  }

  function goGoals(){ try{ renderGoals(); show('scr-goals'); }catch(e){ console.error('goGoals',e); } }

  /* ════════ ЕКРАН «ПРОЄКТИ»: заводські (Робота) + папки-проєкти ════════ */
  function prjHexToRgb(hex){
    try{
      let h=String(hex||'').replace('#','').trim();
      if(h.length===3) h=h.split('').map(c=>c+c).join('');
      const n=parseInt(h,16); if(isNaN(n)) return '106,125,255';
      return ((n>>16)&255)+','+((n>>8)&255)+','+(n&255);
    }catch(_){ return '106,125,255'; }
  }
  function prjTileHTML(o){
    // o: {k, emo, c:'r,g,b', t, d, badge?, badgeC?}
    const badge = o.badge?`<span class="mh-badge" ${o.badgeC?`style="background:${o.badgeC};color:#fff"`:''}>${o.badge}</span>`:'';
    return `<button class="mh-tile" data-prj="${o.k}" style="--mc:rgb(${o.c})">
      <div class="mh-orb" style="background:rgb(${o.c})"></div>
      <div class="mh-ico" style="background:rgba(${o.c},.18)">${o.emo}</div>
      <h4>${o.t}</h4><p>${o.d}</p>${badge}</button>`;
  }
  function renderProjects(){
    const host=document.getElementById('projectsBody'); if(!host) return;
    // заводські проєкти
    const factory=[
      {k:'work',   emo:'💼', c:'106,125,255', t:'Робота',      d:'Зміни, ставка та зарплата'},
    ];
    // папки-проєкти користувача
    const mine=projFolderKeys().map(k=>{
      const f=folders[k];
      const st=projStatusMeta(f.status||'active');
      const pr=folderProgress(k);
      const dl=dueLabel(f.due);
      const bits=[];
      if(pr.total) bits.push(pr.done+'/'+pr.total+' · '+pr.pct+'%');
      if(dl&&dl.t) bits.push(dl.t);
      return {k:'f:'+k, emo:esc(f.emoji||'🚀'), c:prjHexToRgb(f.c), t:esc(f.name||'Проєкт'),
        d:bits.length?bits.join(' · '):'ще без кроків', badge:st[1], badgeC:st[2]};
    });
    host.innerHTML=
      `<div class="mh-lbl">⚡ Заводські</div>
       <div class="mh-grid">${factory.map(prjTileHTML).join('')}</div>
       <div class="mh-lbl mt">🚀 Мої проєкти</div>
       ${mine.length?`<div class="mh-grid">${mine.map(prjTileHTML).join('')}</div>`
         :`<div class="prj-empty">Тут зʼявляться твої проєкти. Створи перший — і він житиме на цій вкладці.</div>`}
       <button class="prj-add" data-prj="add">＋ Новий проєкт</button>`;
    host.querySelectorAll('[data-prj]').forEach(b=>b.addEventListener('click',()=>{
      const k=b.dataset.prj;
      try{ window.platform.haptic('light'); }catch(_){}
      if(k==='work'){ goWork(); return; }
      if(k==='add'){ if(typeof createProjectFolder==='function') createProjectFolder(); return; }
      if(k.indexOf('f:')===0){ goFolder(k.slice(2)); return; }
    }));
  }
  function goProjects(){ try{ renderProjects(); show('scr-projects'); }catch(e){ console.error('goProjects',e); } }
  try{ window.goProjects=goProjects; window.renderProjects=renderProjects; }catch(_){}
  // keepDay=true — не скидати обраний день (навмисний перехід на конкретну дату)
  /* 09.10.2026: Планер живе в Журналі (вкладки День · Тиждень · Місяць). Усі старі входи сюди ведуть туди ж;
     keepDay=true — відкрити саме вибраний день Планера. */
  function goPlanner(keepDay){ try{
    if(typeof goJournal==='function'){ const pp=plData(); goJournal({tab:'day', ds:keepDay?pp.selDate:''}); return; }
    if(!keepDay){ const pp=plData(); const td=plTodayStr();
      if(pp.selDate!==td){ pp.selDate=td; pp.calMonth=td.slice(0,7); saveGoals(); } }
    const c=document.getElementById('plannerBody'); if(c) renderPlanner(c); show('scr-planner'); const sb=document.getElementById('plSettingsBtn'); if(sb) sb.onclick=()=>plRangeSheet(); const ab=document.getElementById('plAiBtn'); if(ab) ab.onclick=()=>aiChatSheet(); }catch(e){ console.error('goPlanner',e); } }
  function goWishes(){ try{ renderWishes(); show('scr-wishes'); }catch(e){ console.error('goWishes',e); } }
  window.goWishes=goWishes;
  document.getElementById('wishBack').onclick = goHome;
  { const sc=document.getElementById('summaryCard'); if(sc) sc.onclick=goWishes; }
  document.getElementById('debtsBack').onclick = () => goFolder('fin');
  document.getElementById('spendBack').onclick = () => goFolder('fin');
  { const wb=document.getElementById('workBack'); if(wb) wb.onclick=()=>{
      // «назад» веде в Канал папки, з якої прийшли (старого екрана папки з віджетами більше нема)
      if(!workOrigin || workOrigin==='work' || !folders[workOrigin]) goProjects();
      else goFolder(workOrigin);
  }; }
  { const sb=document.getElementById('wkSpacesBtn'); if(sb) sb.onclick=()=>{ if(workOrigin&&workOrigin!=='work'&&folders[workOrigin]) goFolder(workOrigin); else goProjects(); }; }
  document.getElementById('finBack').onclick = () => { currentFolderKey=null; goHome(); };
  (function(){ const d=document.getElementById('e2Dim'); if(d) d.onclick=()=>{ try{closeEnvSheet();}catch(_){}}; })();

