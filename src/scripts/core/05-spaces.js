  /* ============ ПРОСТОРИ · ПРОЄКТИ · САЙДБАР · ТЕМИ ============
     Колишній 05-agency.js: Агенцію (Захист.SK) і Vault вирізано 04.09.2026,
     лишилось усе, що не було агенцією — простори, екран «Проєкти», профіль
     сайдбара, бекап, десктопні панелі, стилі карток і теми. */
  /* ============ ДОДАТКОВІ ПРОСТОРИ (листки) ============ */
  // Простори існують у КОНТЕКСТІ: загальний Простір (ctx='__root__') або всередині папки (ctx=folderKey).
  // Кожен простір контексту має свій boardKey: головний = baseKey, додаткові = baseKey+'__sp_'+id.
  let switcherStyle=(window.innerWidth<640?'stories':'cards'); // pills | segment | cards | dropdown | foldertabs | stories
  const SWKEY='switcher_style';
  try{ const s=localStorage.getItem(SWKEY); if(s) switcherStyle=s; }catch(_){}
  prefCatchup(SWKEY, v=>{ if(v) switcherStyle=v; });

  // мапа просторів: { ctx: [ {id,name,emoji,color} ] }, та активні: { ctx: id }
  let spacesMap={}, activeSpaceMap={};
  const SPMKEY='spaces_map_v2', ACMKEY='active_space_map_v2';
  try{ const r=localStorage.getItem(SPMKEY); if(r){ const p=JSON.parse(r); if(p&&typeof p==='object') spacesMap=p; } }catch(_){}
  try{ const r=localStorage.getItem(ACMKEY); if(r){ const p=JSON.parse(r); if(p&&typeof p==='object') activeSpaceMap=p; } }catch(_){}
  prefCatchup(SPMKEY, v=>{ try{ const p=JSON.parse(v); if(p&&typeof p==='object') spacesMap=p; }catch(_){} });
  prefCatchup(ACMKEY, v=>{ try{ const p=JSON.parse(v); if(p&&typeof p==='object') activeSpaceMap=p; }catch(_){} });


  function saveSpacesMeta(){ try{ prefSet(SPMKEY,JSON.stringify(spacesMap)); prefSet(ACMKEY,JSON.stringify(activeSpaceMap)); prefSet(SWKEY,switcherStyle); }catch(_){} }

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
  function spaceByIdIn(ctx,id){ return spacesFor(ctx).find(s=>s.id===id)||spacesFor(ctx)[0]; }
  function keyForSpaceIn(ctx,id){ const base=ctxBaseKey(ctx); return id==='main'?base:(base+'__sp_'+id); }
  function spaceCountIn(ctx,id){ const arr=boards[keyForSpaceIn(ctx,id)]; return Array.isArray(arr)?arr.length:0; }

  // перейти в активний простір ЗАГАЛЬНОГО простору (з нав-кнопки)
  function goActiveSpace(){
    spaceFromFolder='__general__'; currentFolderKey=null; folderPath=[];
    const a=activeSpaceFor('__root__');
    boardKey=keyForSpaceIn('__root__',a);
    if(!boards[boardKey]) boards[boardKey]=[];
    syncBlocks(); renderBoard(); show('scr-space');
  }
  // перемкнути простір у поточному контексті
  function switchSpace(id){
    const ctx=curCtx();
    activeSpaceMap[ctx]=id; saveSpacesMeta();
    folderPath=[]; // виходимо на корінь простору
    boardKey=keyForSpaceIn(ctx,id);
    if(!boards[boardKey]) boards[boardKey]=[];
    window.platform.haptic('light');
    syncBlocks(); renderBoard();
  }
  function addSpace(){
    const ctx=curCtx();
    const list=spacesFor(ctx);
    const palette=['#ff6b9d','#34c77b','#f0b429','#c77dff','#4ecdc4','#e8843c','#9b8cff','#5b8def'];
    const emojis=['🎬','💼','💡','🚀','📚','🏆','🎨','⚡','❤️','🎯','📸','🧠'];
    const id='s'+Date.now().toString(36);
    const n=list.length;
    list.push({id,name:'Простір '+(n+1),emoji:emojis[n%emojis.length],color:palette[n%palette.length]});
    boards[keyForSpaceIn(ctx,id)]=[]; activeSpaceMap[ctx]=id; saveSpacesMeta(); saveBoard();
    window.platform.haptic('medium');
    folderPath=[]; boardKey=keyForSpaceIn(ctx,id); syncBlocks(); renderBoard();
    setTimeout(()=>openSpaceSettings(id),120);
  }
  function deleteSpace(id){
    const ctx=curCtx();
    if(id==='main'){ flowAlert('Головний простір видалити не можна.'); return; }
    const sp=spaceByIdIn(ctx,id);
    confirmSheet({title:'Видалити простір «'+sp.name+'»?', sub:'Разом з усіма блоками.', onOk:()=>{
    delete boards[keyForSpaceIn(ctx,id)];
    spacesMap[ctx]=spacesFor(ctx).filter(s=>s.id!==id);
    if(activeSpaceFor(ctx)===id) activeSpaceMap[ctx]='main';
    saveSpacesMeta(); saveBoard();
    folderPath=[]; boardKey=keyForSpaceIn(ctx,'main'); syncBlocks(); renderBoard();
    }});
  }

  // РЕНДЕР перемикача в обраному стилі (для поточного контексту: Простір або папка)
  function renderSpaceSwitcher(){
    const host=document.getElementById('spaceSwitcher');
    if(!host) return;
    // ховаємо, якщо ми заглибились у вкладену папку/сторінку (не на корені простору)
    const inNested = (typeof folderPath!=='undefined') && folderPath.length>0;
    const ctx=curCtx();
    const isFinVal = boardKey==='fin'||boardKey==='val';
    if(inNested || isFinVal){ host.style.display='none'; host.innerHTML=''; return; }
    host.style.display='';
    host.className='space-switcher sw-'+switcherStyle;
    const list=spacesFor(ctx);
    const A=activeSpaceFor(ctx);
    const cnt=id=>spaceCountIn(ctx,id);
    if(switcherStyle==='pills'){
      host.innerHTML=list.map(s=>`<button class="sw-pill ${s.id===A?'on':''}" style="--sc:${s.color}" data-sp="${s.id}">${s.emoji} ${esc(s.name)}</button>`).join('')
        +`<button class="sw-pill add" data-spadd>＋</button>`;
    } else if(switcherStyle==='segment'){
      host.innerHTML=`<div class="sw-seg">${list.map(s=>`<button class="${s.id===A?'on':''}" data-sp="${s.id}">${s.emoji} ${esc(s.name)}</button>`).join('')}<button class="sw-plus" data-spadd>＋</button></div>`;
    } else if(switcherStyle==='cards'){
      host.innerHTML=`<div class="sw-cards">${list.map(s=>`<button class="sw-card ${s.id===A?'on':''}" style="--sc:${s.color}" data-sp="${s.id}">
        <span class="sc-e">${s.emoji}</span><span class="sc-n">${esc(s.name)}</span><span class="sc-c">${cnt(s.id)} блок.</span></button>`).join('')}
        <button class="sw-card add" data-spadd><span class="pl">＋</span><span>Новий</span></button></div>`;
    } else if(switcherStyle==='dropdown'){
      const cur=spaceByIdIn(ctx,A);
      host.innerHTML=`<button class="sw-dd-btn" data-spdd style="--sc:${cur.color}"><span class="dd-e">${cur.emoji}</span><span class="dd-n">${esc(cur.name)}</span><span class="dd-car">▾</span></button>
        <div class="sw-dd-menu" id="swDdMenu">${list.map(s=>`<button class="sw-dd-item ${s.id===A?'on':''}" data-sp="${s.id}"><span>${s.emoji}</span><span class="ddi-n">${esc(s.name)}</span><span class="ddi-c">${cnt(s.id)}</span></button>`).join('')}
        <button class="sw-dd-item add" data-spadd><span>＋</span><span class="ddi-n">Новий простір</span></button></div>`;
    } else if(switcherStyle==='stories'){
      host.innerHTML=list.map(s=>`<button class="sw-story ${s.id===A?'on':''}" style="--sc:${s.color}" data-sp="${s.id}">
        <span class="ring"><span class="in">${s.emoji}</span></span><small>${esc(s.name)}</small></button>`).join('')
        +`<button class="sw-story add" data-spadd><span class="ring"><span class="in">＋</span></span><small>Новий</small></button>`;
    } else if(switcherStyle==='foldertabs'){
      host.innerHTML=`<div class="sw-ftabs">${list.map(s=>`<button class="sw-ftab ${s.id===A?'on':''}" style="--sc:${s.color}" data-sp="${s.id}">${s.emoji} ${esc(s.name)}</button>`).join('')}<button class="sw-ftab add" data-spadd>＋</button></div>`;
    }
    host.querySelectorAll('[data-sp]').forEach(el=>el.onclick=()=>{ const id=el.dataset.sp; if(id!==A) switchSpace(id); });
    host.querySelectorAll('[data-spadd]').forEach(el=>el.onclick=()=>addSpace());
    const ddBtn=host.querySelector('[data-spdd]');
    if(ddBtn){ ddBtn.onclick=()=>{ const m=document.getElementById('swDdMenu'); if(m) m.classList.toggle('open'); ddBtn.classList.toggle('open'); }; }
  }

  // НАЛАШТУВАННЯ просторів поточного контексту
  function openSpaceSettings(focusId){
    document.querySelectorAll('.spcfg-ov').forEach(o=>o.remove());
    const ctx=curCtx();
    const list=spacesFor(ctx);
    const ctxName = ctx==='__root__' ? 'Простір' : ((folders[ctx]&&folders[ctx].name)||'Папка');
    const STYLES=[['stories','Сторі','◉ ◉'],['pills','Піл-таби','● ● ●'],['segment','Сегмент','▭▭▭'],['cards','Картки','▢ ▢'],['dropdown','Дропдаун','▾'],['foldertabs','Вкладки','◳◳']];
    const ov=document.createElement('div'); ov.className='spcfg-ov';
    ov.innerHTML=`<div class="spcfg-in">
      <div class="spcfg-grip"></div>
      <div class="spcfg-h">Простори · ${esc(ctxName)}</div>
      <div class="spcfg-sec">Стиль перемикача</div>
      <div class="spcfg-styles">${STYLES.map(([k,n,p])=>`<button class="spcfg-style ${switcherStyle===k?'on':''}" data-style="${k}"><span class="ss-p">${p}</span><span class="ss-n">${n}</span></button>`).join('')}</div>
      <div class="spcfg-sec">Стиль карток</div>
      <div class="spcfg-styles" style="grid-template-columns:repeat(3,1fr)">${[['classic','Класика','▢'],['glass','Скло','◇'],['bento','Бенто','▧']].map(([k,n,p])=>`<button class="spcfg-style ${cardSkin===k?'on':''}" data-cardskin="${k}"><span class="ss-p">${p}</span><span class="ss-n">${n}</span></button>`).join('')}</div>
      <div class="spcfg-sec">Простори тут</div>
      <div class="spcfg-list">${list.map(s=>`<div class="spcfg-row ${s.id===focusId?'flash':''}" data-row="${s.id}" style="--sc:${s.color}">
        <button class="spcfg-emoji" data-spemoji="${s.id}">${s.emoji}</button>
        <input class="spcfg-name" value="${escAttr(s.name)}" data-spname="${s.id}" placeholder="Назва простору">
        <span class="spcfg-cnt">${spaceCountIn(ctx,s.id)}</span>
        ${s.id==='main'?'<span class="spcfg-lock" title="Головний">🏠</span>':`<button class="spcfg-del" data-spdel="${s.id}">🗑️</button>`}
      </div>`).join('')}</div>
      <button class="spcfg-add" data-spaddnew>＋ Додати простір</button>
      <button class="spcfg-close" data-spclose>Готово</button>
    </div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(()=>ov.classList.add('open'));
    const close=()=>{ ov.classList.remove('open'); setTimeout(()=>ov.remove(),200); };
    ov.addEventListener('click',e=>{ if(e.target===ov) close(); });
    ov.querySelector('[data-spclose]').onclick=close;
    ov.querySelector('[data-spaddnew]').onclick=()=>{ close(); addSpace(); };
    ov.querySelectorAll('[data-style]').forEach(b=>b.onclick=()=>{
      switcherStyle=b.dataset.style; saveSpacesMeta();
      ov.querySelectorAll('[data-style]').forEach(x=>x.classList.toggle('on',x===b));
      renderSpaceSwitcher();
      window.platform.haptic('select');
    });
    ov.querySelectorAll('[data-cardskin]').forEach(b=>b.onclick=()=>{
      setCardSkin(b.dataset.cardskin);
      ov.querySelectorAll('[data-cardskin]').forEach(x=>x.classList.toggle('on',x===b));
      renderBoard();
    });
    ov.querySelectorAll('[data-spname]').forEach(inp=>inp.onblur=()=>{
      const sp=spaceByIdIn(ctx,inp.dataset.spname); if(sp){ sp.name=inp.value.trim()||sp.name; saveSpacesMeta(); renderSpaceSwitcher(); renderBoard(); }
    });
    ov.querySelectorAll('[data-spemoji]').forEach(btn=>btn.onclick=()=>{
      const sp=spaceByIdIn(ctx,btn.dataset.spemoji); if(!sp) return;
      inputModal({title:'Емодзі простору', value:sp.emoji, placeholder:'напр. 🌌', onOk:(v)=>{ const pick=(v||'').trim().slice(0,2); if(pick){ sp.emoji=pick; btn.textContent=sp.emoji; saveSpacesMeta(); renderSpaceSwitcher(); } }});
    });
    ov.querySelectorAll('[data-spdel]').forEach(btn=>btn.onclick=()=>{ close(); deleteSpace(btn.dataset.spdel); });
  }

  // opts.focusId — відкрити документ прокрученим до цього блока (стрибок із Каналу папки)
  function goSpaceFor(key, opts){
    try{
      boardKey=key;
      if(!boards[key]) boards[key]=[];
      if(typeof syncBlocks==='function') syncBlocks();
      const tb=(typeof tabByKey==='function')?tabByKey(key):null;
      const isFolderBuiltin = (typeof BUILTIN_TABS!=='undefined') && BUILTIN_TABS.some(t=>t.key===key) && key!=='all';
      spaceFromFolder = (tb && tb.folder) ? tb.folder : (isFolderBuiltin ? key : (currentFolderKey||null));
      // ЧИСТА ПАПКА: виставляємо клас ДО renderBoard, щоб порожній аркуш не показував «Тисни +»
      { const fromFolder = spaceFromFolder && spaceFromFolder!=='__general__' && spaceFromFolder!=='__root__';
        document.body.classList.toggle('folder-clean', !!fromFolder); }
      // НОВИЙ РЕДАКТОР: папки відкриваються у Notion-стилі. Fallback — стара дошка.
      if(typeof window.openFlowPage==='function'){
        window.__flowExitPage=function(){ try{ if(typeof goHome==='function'){ goHome(); return; } }catch(_){} if(window.__show)window.__show('scr-home'); };
        window.openFlowPage(opts||null);
      } else {
        renderBoard();
        show('scr-space');
      }
    }catch(e){ console.error('goSpaceFor', e); renderBoard(); show('scr-space'); }
  }
  let spaceFromFolder=null;

  // FAB visible only on space screen
  function show(id){
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('fab').classList.toggle('show', id==='scr-space');
    document.querySelectorAll('.nav a').forEach(a=>a.classList.remove('on'));
    if(id==='scr-home'){ document.getElementById('navHome').classList.add('on');
      const bm=document.getElementById('brandMark');
      if(bm){ bm.classList.remove('lg-play'); void bm.offsetWidth; bm.classList.add('lg-play'); } }
    if(id==='scr-finance'){ const nf=document.getElementById('navFinance'); if(nf) nf.classList.add('on'); }
    if(id==='scr-goals'){ const np=document.getElementById('navPlanner'); if(np) np.classList.add('on'); }
    if(id==='scr-planner'){ const np=document.getElementById('navPlanner'); if(np) np.classList.add('on'); }
    if(id==='scr-more'||id==='scr-projects'||id==='scr-work'){ const nmr=document.getElementById('navMore'); if(nmr) nmr.classList.add('on'); }
    // синхронізація десктопного сайдбару
    const dmap={'scr-home':'home','scr-folder':'home','scr-space':'home','scr-goals':'planner','scr-projects':'projects',
                'scr-finance':'finance','scr-planner':'planner','scr-values':'finance','scr-debts':'finance','scr-spend':'finance','scr-work':'projects','scr-wishes':'home','scr-more':'more','scr-nyc':'more','scr-page':'home','scr-patterns':'home','scr-vision':'home'};
    const dkey=dmap[id]||'home';
    document.querySelectorAll('.dsb-i').forEach(b=>b.classList.toggle('on', b.dataset.dnav===dkey));
    // прапорець для 3-панельного режиму Простору
    document.body.classList.toggle('in-space', id==='scr-space');
    // ЧИСТА ПАПКА: якщо простір відкрито з папки (а не з головного Огляду) — ховаємо всі панелі
    { const fromFolder = id==='scr-space' && spaceFromFolder && spaceFromFolder!=='__general__' && spaceFromFolder!=='__root__';
      document.body.classList.toggle('folder-clean', !!fromFolder); }
    document.body.classList.toggle('in-home', id==='scr-home');
    document.body.classList.toggle('in-reader', id==='scr-reader');
    // Канал папки: ховає нижню панель і котика (18-channel.css)
    document.body.classList.toggle('in-channel', id==='scr-channel');
    if(id==='scr-space'){ try{ renderSpaceSwitcher(); }catch(_){} }
    if(id==='scr-reader'){ try{ initReader(); applyRdrCfg(); }catch(_){} }
    if(id==='scr-nyc'){ try{ if(window.__nycRefresh) window.__nycRefresh(); }catch(_){} }
    if(id==='scr-space') renderPaneList();
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
  { const b=document.getElementById('spaceCfgBtn'); if(b) b.onclick=()=>openSpaceSettings(); }

  // ── меню «⋯» Простору: другорядні дії однією шторкою ──
  function openSpaceMore(){
    document.querySelectorAll('#spaceMoreSheet').forEach(x=>x.remove());
    const items=[
      ['zenToggle','⛶','Повний екран (zen)'],
      ['spaceFullToggle','🖥️','Простір на весь екран'],
      ['spaceLayoutToggle','◫','Лейаут: класичний / три панелі'],
      ['canvasToggle','🧲','Вільне полотно'],
      ['boardWideToggle','↔️','Ширина дошки'],
      ['proThemeToggle','✨','Pro-стиль'],
      ['spaceClear','🗑️','Очистити дошку'],
    ];
    const m=document.createElement('div'); m.className='fmenu-sheet'; m.id='spaceMoreSheet';
    m.innerHTML=`<div class="fmenu-in"><div class="fmenu-grip"></div>
      <div class="fmenu-title">Дії простору</div>
      ${items.map(([id,e,t])=>`<button class="fmi ${id==='spaceClear'?'danger':''}" data-proxy="${id}">${e} ${t}</button>`).join('')}
    </div>`;
    m.onclick=e=>{ if(e.target===m) m.remove(); };
    document.body.appendChild(m);
    m.querySelectorAll('[data-proxy]').forEach(b=>b.onclick=()=>{
      m.remove();
      const t=document.getElementById(b.dataset.proxy);
      if(t) t.click();
    });
  }
  { const b=document.getElementById('spaceMoreBtn'); if(b) b.onclick=openSpaceMore; }

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
      ${window.FLOW_NATIVE ? '' : '<button class="dpr-i" data-act="proxy">⚙️ AI-проксі</button>'}
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

  /* ═══ НАЛАШТУВАННЯ ═══
     Живуть як картка на екрані «Ще» (той самий стиль, що й картка бекапу —
     перевірена, стабільна верстка, без багів кастомної шторки). Мова, тема,
     AI-проксі, і (тільки в dev-режимі) переклад власного контенту. */
  function renderSettingsCard(){
    const host=document.getElementById('settingsCard'); if(!host) return;
    const lang=(window.flowLang&&window.flowLang())||'uk';
    const devOn=(typeof aiDevOn==='function')&&aiDevOn();
    const ctOn=(function(){ try{ return localStorage.getItem('dev_translate_content')==='1'; }catch(_){ return false; } })();
    host.innerHTML = `
      <div class="bkp-t">⚙️ Налаштування</div>
      <div class="stg-list">
        <div class="stg-row">
          <div class="stg-ic c-lang">🌐</div>
          <div class="stg-tx"><div class="stg-tt">Мова інтерфейсу</div><div class="stg-sub">Interface language</div></div>
          <div class="stg-seg" id="stgLangSeg">
            <button data-l="uk" class="${lang==='uk'?'on':''}">UA</button>
            <button data-l="en" class="${lang==='en'?'on':''}">EN</button>
          </div>
        </div>
        <div class="stg-row">
          <div class="stg-ic c-theme">🎨</div>
          <div class="stg-tx"><div class="stg-tt">Набір стилю</div><div class="stg-sub">${THEME_SETS[themeSetOf(theme)].name}</div></div>
          <div class="stg-seg" id="stgThemeSetSeg">
            ${Object.keys(THEME_SETS).map(id=>`<button data-ts="${id}" class="${themeSetOf(theme)===id?'on':''}">${THEME_SETS[id].name}</button>`).join('')}
          </div>
        </div>
        <div class="stg-row">
          <div class="stg-ic c-theme">🌓</div>
          <div class="stg-tx"><div class="stg-tt">Тема</div><div class="stg-sub">${THEME_META[theme]?THEME_META[theme][1]:'Світла / темна'}</div></div>
          <button class="stg-go" id="stgThemeBtn">Перемкнути</button>
        </div>
        <div class="stg-row">
          <div class="stg-ic c-theme">✨</div>
          <div class="stg-tx"><div class="stg-tt">Живе скло</div><div class="stg-sub">Новий вигляд Огляду · аврора та рідкий метал</div></div>
          <button class="stg-sw ${homeGlass?'on':''}" id="stgHomeGlassSw" aria-label="Живе скло"></button>
        </div>
        ${window.FLOW_NATIVE ? '' : `
        <div class="stg-row">
          <div class="stg-ic c-ai">🤖</div>
          <div class="stg-tx"><div class="stg-tt">AI-проксі</div><div class="stg-sub">Endpoint та ключ</div></div>
          <button class="stg-go" id="stgProxyBtn">Відкрити</button>
        </div>`}
        ${devOn ? `
        <div class="stg-row">
          <div class="stg-ic c-dev">🧪</div>
          <div class="stg-tx"><div class="stg-tt">Перекладати мій контент</div><div class="stg-sub">Папки, сторінки, нотатки → EN · dev</div></div>
          <button class="stg-sw ${ctOn?'on':''}" id="stgCtSw" aria-label="Перекладати контент"></button>
        </div>` : ''}
      </div>
    `;
    host.querySelectorAll('#stgLangSeg button').forEach(b=>b.onclick=()=>{
      const l=b.dataset.l;
      if(l!==lang && window.flowSetLang) window.flowSetLang(l);
      renderSettingsCard();
    });
    const tb=document.getElementById('stgThemeBtn'); if(tb) tb.onclick=()=>{ toggleTheme(); };
    { const seg=document.getElementById('stgThemeSetSeg');
      if(seg) seg.querySelectorAll('[data-ts]').forEach(b=>b.onclick=()=>setThemeSet(b.dataset.ts)); }
    const hgs=document.getElementById('stgHomeGlassSw'); if(hgs) hgs.onclick=()=>{ homeGlass=!homeGlass; applyHomeGlass(); saveHomeGlass(); renderSettingsCard(); };
    const pb=document.getElementById('stgProxyBtn'); if(pb) pb.onclick=()=>{ if(typeof aiConfig==='function') aiConfig(()=>{}); };
    const cs=document.getElementById('stgCtSw'); if(cs) cs.onclick=()=>{ if(typeof devContentTranslateToggleSheet==='function') devContentTranslateToggleSheet(); setTimeout(renderSettingsCard,50); };
  }
  window.renderSettingsCard = renderSettingsCard;
  document.addEventListener('flowlangchange', renderSettingsCard);
  function openSettings(){
    if(typeof goMore==='function') goMore();
    const host=document.getElementById('settingsCard'); if(!host) return;
    host.hidden=!host.hidden;
    if(window.__settingsScrollT){ clearTimeout(window.__settingsScrollT); window.__settingsScrollT=null; }
    if(!host.hidden){
      renderSettingsCard();
      window.__settingsScrollT=setTimeout(()=>{
        // скролимо, лише якщо картка реально виходить за межі видимої області —
        // якщо вона й так уже вміщується на екрані, зайвий стрибок не потрібен
        const r=host.getBoundingClientRect();
        const fits = r.top>=0 && r.bottom<=(window.innerHeight||document.documentElement.clientHeight);
        if(!fits) host.scrollIntoView({behavior:'smooth',block:'start'});
      },50);
    }
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

  // ── бекап: експорт/імпорт усіх даних у файл (шлях до iCloud Drive через «Файли») ──
  (function(){
    var ex=document.getElementById('bkpExport'), im=document.getElementById('bkpImport'), note=document.getElementById('bkpNote');
    if(!ex||!im)return;
    function setNote(t){ if(note)note.textContent=t; }
    ex.onclick=function(){
      try{
        var data={_flow_backup:1, ts:new Date().toISOString(), keys:{}};
        for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); data.keys[k]=localStorage.getItem(k); }
        var json=JSON.stringify(data);
        var name='flow-backup-'+new Date().toISOString().slice(0,10)+'.json';
        var blob=new Blob([json],{type:'application/json'});
        var file=null; try{ file=new File([blob],name,{type:'application/json'}); }catch(_){}
        if(file && navigator.canShare && navigator.canShare({files:[file]})){
          navigator.share({files:[file],title:'Frequency бекап'})
            .then(function(){ setNote('Готово. У шиті обери «Зберегти у Файли» → iCloud Drive.'); })
            .catch(function(){ setNote('Скасовано.'); });
          return;
        }
        var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name;
        document.body.appendChild(a); a.click(); a.remove();
        setNote('Файл завантажено ('+Math.round(json.length/1024)+' КБ).');
      }catch(e){ setNote('Не вдалося: '+((e&&e.message)||e)); }
    };
    im.onclick=function(){
      var inp=document.createElement('input'); inp.type='file'; inp.accept='.json,application/json';
      inp.onchange=function(){
        var f=inp.files&&inp.files[0]; if(!f)return;
        var rd=new FileReader();
        rd.onload=function(){
          try{
            var data=JSON.parse(rd.result);
            if(!data||data._flow_backup!==1||!data.keys){ setNote('Це не файл бекапу Flow.'); return; }
            var n=Object.keys(data.keys).length;
            if(!confirm('Відновити бекап від '+(data.ts?data.ts.slice(0,16).replace('T',' '):'?')+'? Поточні дані на цьому пристрої буде замінено ('+n+' ключів).'))return;
            Object.keys(data.keys).forEach(function(k){ try{ localStorage.setItem(k,data.keys[k]); }catch(_){} });
            setNote('Відновлено. Перезавантажую…');
            setTimeout(function(){ location.reload(); },600);
          }catch(e){ setNote('Помилка читання: '+((e&&e.message)||e)); }
        };
        rd.readAsText(f);
      };
      inp.click();
    };
  })();

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

  // ── перемикач лейауту Простору (класичний ↔ три панелі), лише десктоп ──
  let spaceLayout='classic';
  try{ const sl=localStorage.getItem('spacelayout'); if(sl) spaceLayout=sl; }catch(_){}
  prefCatchup('spacelayout', v=>{ if(v) spaceLayout=v; });
  function applySpaceLayout(){
    document.body.classList.toggle('space-3pane', spaceLayout==='3pane');
    const btn=document.getElementById('spaceLayoutToggle');
    if(btn) btn.title = spaceLayout==='3pane' ? 'Лейаут: три панелі (тап → класичний)' : 'Лейаут: класичний (тап → три панелі)';
    if(spaceLayout==='3pane') renderPaneList();
  }
  { const b=document.getElementById('spaceLayoutToggle');
    if(b) b.onclick=()=>{ spaceLayout = spaceLayout==='3pane'?'classic':'3pane';
      try{ prefSet('spacelayout', spaceLayout); }catch(_){}
      applySpaceLayout(); renderBoard(); }; }

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

  // список блоків поточного рівня для лівої панелі (3-pane)
  function renderPaneList(){
    const el=document.getElementById('paneList'); if(!el) return;
    if(typeof currentLevelArr!=='function'){ el.innerHTML=''; return; }
    const arr=currentLevelArr();
    const ico=(t)=> (typeof blockIcon==='function')? blockIcon(t,16) : '';
    const subFor=(b)=>{
      if(isContainer(b)) return (b.children||[]).length+' елем.';
      if(b.type==='link') return (b.url||'').replace(/^https?:\/\//,'').split('/')[0]||'посилання';
      if(b.type==='check'||b.type==='list') return ((b.items||[]).length)+' пункт.';
      if(b.type==='note'||b.type==='quick') return 'текст';
      return (BLOCK_TYPES[b.type]||{}).title||'';
    };
    el.innerHTML = `<div class="pane-list-h">${folderPath&&folderPath.length?'У папці':'Блоки простору'}</div>`+
      arr.map(b=>{
        const t=BLOCK_TYPES[b.type]||{color:'#5b8def',title:'Блок'};
        const title = b.title || (b.text? String(b.text).slice(0,24) : t.title);
        return `<div class="pane-item" data-panejump="${b.id}" style="--pc:${t.color}">
          <span class="pi-ico">${ico(b.type)}</span>
          <span style="min-width:0"><span class="pi-nm">${esc(title)}</span><span class="pi-sub">${esc(subFor(b))}</span></span>
        </div>`;
      }).join('');
    el.querySelectorAll('[data-panejump]').forEach(it=>it.onclick=()=>{
      const b=getBlock(it.dataset.panejump);
      if(b&&isContainer(b)){ folderPath.push(it.dataset.panejump); renderBoard(); }
      else {
        const node=document.querySelector('[data-tileid="'+it.dataset.panejump+'"]');
        if(node) node.scrollIntoView({behavior:'smooth',block:'center'});
      }
    });
  }
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
     студія, AMOLED лишаються доступними в «Набір стилю». */
  try{
    if(!localStorage.getItem('theme_flat_default_v1')){
      localStorage.setItem('theme_flat_default_v1','1');
      const MIG={ light:'desk-light', dark:'desk-dark', black:'desk-dark' };
      const saved=localStorage.getItem('flowtheme');
      let next=null;
      if(saved && MIG[saved]) next=MIG[saved];    // був на класичній — переносимо
      else if(!isTheme(saved)) next='desk-dark';  // нічого валідного — новий дефолт
      if(next){ theme=next; try{ prefSet('flowtheme', theme); }catch(_){ try{ localStorage.setItem('flowtheme', theme); }catch(_){} } }
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
  function setCardSkin(v){
    cardSkin=v;
    try{ prefSet('flowcardskin', v); }catch(_){}
    applyCardSkin();
    window.platform.haptic('select');
  }
  try{ applyCardSkin(); }catch(_){}
  try{ applyProTheme(); }catch(_){}

  // ── ZEN / повноекранний Простір (моб+десктоп): ховає хедер, перемикач, нав-бар ──
  let zenMode=false;
  function applyZen(){
    document.body.classList.toggle('space-zen', zenMode);
    const b=document.getElementById('zenToggle');
    if(b) b.classList.toggle('on', zenMode);
    // розгорнути на повну висоту, якщо платформа вміє
    try{ if(zenMode) window.platform.expand(); }catch(_){}
  }
  function setZen(on){ zenMode=on; applyZen(); try{ window.platform.haptic(on?'medium':'light'); }catch(_){}
    try{ if(document.body.classList.contains('in-space')) renderBoard(); }catch(_){} }
  { const b=document.getElementById('zenToggle'); if(b) b.onclick=()=>setZen(!zenMode); }
  { const x=document.getElementById('zenExit'); if(x) x.onclick=()=>setZen(false); }

  // кнопки панелі полотна
  { const zi=document.getElementById('czIn'); if(zi) zi.onclick=()=>{ setZoom(getZoom()+0.2,true); try{window.platform.haptic('select');}catch(_){} }; }
  { const zo=document.getElementById('czOut'); if(zo) zo.onclick=()=>{ setZoom(getZoom()-0.2,true); try{window.platform.haptic('select');}catch(_){} }; }
  { const zv=document.getElementById('czVal'); if(zv) zv.onclick=()=>{ setZoom(1,true); try{window.platform.haptic('light');}catch(_){} }; }
  { const zf=document.getElementById('czFit'); if(zf) zf.onclick=()=>{ fitAll(); }; }
  { const zt=document.getElementById('czTidy'); if(zt) zt.onclick=()=>{ tidyCanvas(); }; }
  { const zs=document.getElementById('czSnap'); if(zs) zs.onclick=()=>{ toggleSnap(); }; }
  { const sk=document.getElementById('czSkin'); if(sk) sk.onclick=()=>{ cycleCanvasSkin(); }; }
  { const ze=document.getElementById('czExit'); if(ze) ze.onclick=()=>{ if(isCanvasMode()) toggleCanvasMode(); }; }
  // міні-мапа: тап → стрибок у відповідну точку полотна
  { const mm=document.getElementById('canvasMinimap'); if(mm) mm.onclick=e=>{
      const board=document.getElementById('board'); if(!board||!mm._scale) return;
      const r=mm.getBoundingClientRect();
      const px=(e.clientX-r.left)/mm._scale, py=(e.clientY-r.top)/mm._scale; // лог. координати
      const z=getZoom();
      board.scrollLeft = px*z - board.clientWidth/2;
      board.scrollTop  = py*z - board.clientHeight/2;
      flashMinimap();
    }; }
  // вихід із Простору автоматично знімає zen
  try{
    document.querySelectorAll('.nav a').forEach(a=>{
      a.addEventListener('click',()=>{ if(zenMode) setZen(false); });
    });
  }catch(_){}

  // ЗІБРАТИ ВСЕ: акуратно скласти блоки в стрічку (скидає ручні позиції)
  function tidyCanvas(){
    if(!isCanvasMode()) return;
    confirmSheet({title:'Зібрати всі блоки в акуратну стрічку?', sub:'Поточні позиції скинуться.', okLabel:'Зібрати', onOk:()=>{
    currentLevelArr().forEach(b=>{ b.fx=null; b.fy=null; });
    saveBoard(); renderBoard();
    try{ window.platform.haptic('medium'); }catch(_){}
    }});
  }
  window.__fitAll=fitAll; window.__tidyCanvas=tidyCanvas;

  // ── фічу «ручний десктопний режим» видалено; чистимо старі збережені прапорці,
  //    щоб у користувачів не лишався зламаний viewport зі старих версій ──
  try{
    localStorage.removeItem('forcedesktop');
    localStorage.removeItem('forcemobile');
    if(typeof prefSet==='function'){ prefSet('forcedesktop','0'); prefSet('forcemobile','0'); }
  }catch(_){}

  // наповнення правої панелі: конфігуроване користувачем (вибір/порядок/вимкнення)
  const RR_DEFS={tasks:'🎯 Завдання', streak:'🔥 Streak', bal:'💰 Баланс', tip:'⚡ Підказка'};
  function rrCfg(){
    try{ const j=JSON.parse(localStorage.getItem('rrail_cfg')||''); 
      if(Array.isArray(j)&&j.length&&j.every(x=>x&&RR_DEFS[x.id])) return j; }catch(_){}
    return [{id:'tasks',on:true},{id:'streak',on:true},{id:'bal',on:true},{id:'tip',on:true}];
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
    // фінансовий баланс
    let bal=null;
    try{ if(typeof items!=='undefined'){ let owe=0,owed=0; items.forEach(i=>{ if(i.cur==='UAH'){const v=balance(i); i.kind==='owe'?owe+=v:owed+=v;} }); bal=owed-owe; } }catch(_){}

    const W={
      tasks:`<div class="wgt" style="--wc:#5b8def"><div class="wh"><div class="wi">🎯</div><div><div class="wn">${taskTotal?taskTotal:'0'} завдань</div></div></div>
        <div class="wd">${taskTotal?`${taskDone} виконано · ${taskTotal-taskDone} лишилось`:'Додай завдання у папці'}</div></div>`,
      streak:`<div class="wgt" style="--wc:#34c77b"><div class="wh"><div class="wi">🔥</div><div><div class="wn">Streak ${streak} дн.</div></div></div>
        <div class="wd">${streak?'Звички тримаються':'Почни звичку сьогодні'}</div></div>`,
      bal:(bal!==null?`<div class="wgt" style="--wc:#e8843c"><div class="wh"><div class="wi">💰</div><div><div class="wn">Баланс</div></div></div>
        <div class="wbig" style="color:${bal<0?'var(--owe)':'var(--owed)'}">${(bal>0?'+':'')+ (typeof fmt==='function'?fmt(bal):bal)} ₴</div>
        <div class="wd">борги · чистий</div></div>`:''),
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
      return {k:'f:'+k, emo:(f.emoji||'🚀'), c:prjHexToRgb(f.c), t:esc(f.name||'Проєкт'),
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
  function goPlanner(keepDay){ try{
    if(!keepDay){ const pp=plData(); const td=plTodayStr();
      if(pp.selDate!==td){ pp.selDate=td; pp.calMonth=td.slice(0,7); saveGoals(); } }
    const c=document.getElementById('plannerBody'); if(c) renderPlanner(c); show('scr-planner'); const sb=document.getElementById('plSettingsBtn'); if(sb) sb.onclick=()=>plRangeSheet(); const ab=document.getElementById('plAiBtn'); if(ab) ab.onclick=()=>aiChatSheet(); }catch(e){ console.error('goPlanner',e); } }
  function goValues(){ try{ renderValues(); show('scr-values'); }catch(e){ console.error('goValues',e); } }
  document.getElementById('valBack').onclick = () => { currentFolderKey=null; goHome(); };
  function goWishes(){ try{ renderWishes(); show('scr-wishes'); }catch(e){ console.error('goWishes',e); } }
  window.goWishes=goWishes;
  document.getElementById('wishBack').onclick = goHome;
  { const sc=document.getElementById('summaryCard'); if(sc) sc.onclick=goWishes; }
  document.getElementById('spaceBack').onclick = ()=>{
    if(folderPath.length){ folderPath.pop(); renderBoard(); return; }  // вийти на рівень вище
    // ЧИСТА ПАПКА: назад одразу до списку папок
    spaceFromFolder=null; currentFolderKey=null;
    goHome();
  };
  document.getElementById('folderBack').onclick = goHome;
  document.getElementById('debtsBack').onclick = () => goFolder('fin');
  document.getElementById('spendBack').onclick = () => goFolder('fin');
  { const wb=document.getElementById('workBack'); if(wb) wb.onclick=()=>{
      if(!workOrigin || workOrigin==='work') goProjects();
      else { renderFolder(workOrigin); show('scr-folder'); }
  }; }
  { const sb=document.getElementById('wkSpacesBtn'); if(sb) sb.onclick=()=>{ renderFolder(workOrigin||'work'); show('scr-folder'); }; }
  document.getElementById('finBack').onclick = () => { currentFolderKey=null; goHome(); };
  (function(){ const d=document.getElementById('e2Dim'); if(d) d.onclick=()=>{ try{closeEnvSheet();}catch(_){}}; })();

