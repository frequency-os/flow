  /* ============ SPACE / BOARD LOGIC ============ */
  const BKEY='board';
  const CBKEY='customboards';
  // built-in boards keyed by folder; 'all' is the general space
  const BUILTIN_TABS=[
    {key:'all', label:'Загальна', emoji:'🧩', color:'#6a7dff', folder:null},
    {key:'fin', label:'Фінанси',  emoji:'💰', color:'#e8843c', folder:'fin'},
    {key:'hab', label:'Звички',   emoji:'🏃', color:'#34c77b', folder:'hab'},
    {key:'val', label:'Цінності', emoji:'⭐', color:'#5b8def', folder:'val'},
    {key:'skl', label:'Скіли',    emoji:'📚', color:'#c77dff', folder:'skl'},
  ];
  // user-created boards: {key,label,emoji,color,folder}
  let customBoards=[];
  // combined list of all boards (built-in + custom)
  function allTabs(){ return BUILTIN_TABS.concat(customBoards); }
  function tabByKey(k){ return allTabs().find(t=>t.key===k); }
  // tabs that belong to a folder (built-in folder board + custom boards of that folder)
  function tabsForFolder(fkey){ return allTabs().filter(t=>t.folder===fkey); }
  const BOARD_TABS=BUILTIN_TABS; // back-compat alias used in space tabs
  let boards={};        // { boardKey:[...blocks] }
  let boardKey='all';   // active board
  let viewMode='grid';  // 'shelf' | 'merged' | 'grid' — дефолт: сітка
  let folderPath=[];      // стек id відкритих папок (для навігації всередину)
  // повертає масив блоків для поточного рівня (кореня або відкритої папки)
  function currentLevelArr(){
    let arr=curBoard();
    for(const id of folderPath){
      const g=arr.find(b=>String(b.id)===String(id)&&isContainer(b));
      if(g){ if(!Array.isArray(g.children))g.children=[]; arr=g.children; }
      else { folderPath=[]; return curBoard(); }
    }
    return arr;
  }
  function currentFolderObj(){
    if(!folderPath.length) return null;
    return getBlock(folderPath[folderPath.length-1]);
  }
  const VMKEY='spaceview';
  try{ const sv=localStorage.getItem(VMKEY); if(sv) viewMode=sv; }catch(_){}
  prefCatchup(VMKEY, v=>{ if(v) viewMode=v; });
  function saveViewMode(){ try{ prefSet(VMKEY, viewMode); }catch(_){} }

  // ШИРОКА ДОШКА: скільки колонок усього (4 = стандарт; 6/8 = ширше за екран, гортаєш вправо)
  const BWKEY='spacewide';
  const WIDE_STEPS=[4,6,8];
  let boardCols=4;
  try{ const wv=parseInt(localStorage.getItem(BWKEY)); if(WIDE_STEPS.includes(wv)) boardCols=wv; }catch(_){}
  prefCatchup(BWKEY, v=>{ const wv=parseInt(v); if(WIDE_STEPS.includes(wv)) boardCols=wv; });
  function saveBoardCols(){ try{ prefSet(BWKEY, boardCols); }catch(_){} }

  // ВІЛЬНЕ ПОЛОТНО: набір ключів дошок, де ввімкнено canvas-режим (блоки за X/Y)
  const CANVKEY='spacecanvas';
  let canvasBoards={};
  try{ const cv=localStorage.getItem(CANVKEY); if(cv) canvasBoards=JSON.parse(cv)||{}; }catch(_){ canvasBoards={}; }
  function saveCanvasBoards(){ try{ prefSet(CANVKEY, JSON.stringify(canvasBoards)); }catch(_){} }
  function isCanvasMode(){ return viewMode==='grid' && !!canvasBoards[boardKey]; }
  function toggleCanvasMode(){
    if(viewMode!=='grid'){ viewMode='grid'; saveViewMode(); }
    canvasBoards[boardKey]=!canvasBoards[boardKey];
    if(!canvasBoards[boardKey]) delete canvasBoards[boardKey];
    saveCanvasBoards();
    try{ window.platform.haptic('light'); }catch(_){}
    renderBoard();
  }

  // масштаб полотна (зум щипком), окремо для кожної дошки
  const CZKEY='spacecanvaszoom';
  let canvasZoom={};
  try{ const z=localStorage.getItem(CZKEY); if(z) canvasZoom=JSON.parse(z)||{}; }catch(_){ canvasZoom={}; }
  function saveCanvasZoom(){ try{ prefSet(CZKEY, JSON.stringify(canvasZoom)); }catch(_){} }
  function getZoom(){ const z=canvasZoom[boardKey]; return (z&&z>=0.4&&z<=3)? z : 1; }
  // anchor: {clientX, clientY} — точка екрана, що має лишитись нерухомою (центр щипка/екрана)
  function setZoom(z, persist, anchor){
    const board=document.getElementById('board');
    const old=getZoom();
    z=Math.max(0.4, Math.min(3, z));
    if(board && board.classList.contains('canvasboard')){
      const rect=board.getBoundingClientRect();
      // точка-якір у координатах полотна (до зуму)
      const ax = anchor ? anchor.clientX - rect.left : rect.width/2;
      const ay = anchor ? anchor.clientY - rect.top  : rect.height/2;
      const contentX = (board.scrollLeft + ax) / old;   // логічна точка
      const contentY = (board.scrollTop  + ay) / old;
      canvasZoom[boardKey]=z;
      const inner=board.querySelector('.canvas-inner');
      if(inner) inner.style.setProperty('--cz', z);
      // оновити розпірник скролу під новий зум (інакше на 100%+ не доскролити вниз)
      try{
        const spacer=board.querySelector('.canvas-scroll-spacer');
        if(spacer){
          const lw=parseFloat(inner.style.minWidth)||board.clientWidth;
          const lh=parseFloat(inner.style.minHeight)||board.clientHeight;
          spacer.style.left=Math.round(lw*z)+'px';
          spacer.style.top =Math.round(lh*z)+'px';
        }
      }catch(_){}
      // скоригувати скрол так, щоб (contentX,contentY) лишилась під якорем
      board.scrollLeft = contentX*z - ax;
      board.scrollTop  = contentY*z - ay;
    } else {
      canvasZoom[boardKey]=z;
    }
    if(persist) saveCanvasZoom();
    try{ const v=document.getElementById('czVal'); if(v) v.textContent=Math.round(z*100)+'%'; }catch(_){}
    try{ flashMinimap(); }catch(_){}
    return z;
  }

  // SNAP до сітки (8px), з перемикачем
  let canvasSnap=true;
  try{ canvasSnap = localStorage.getItem('canvassnap')!=='0'; }catch(_){}
  prefCatchup('canvassnap', v=>{ canvasSnap = v!=='0'; });
  function toggleSnap(){ canvasSnap=!canvasSnap; try{prefSet('canvassnap',canvasSnap?'1':'0');}catch(_){}
    const b=document.getElementById('czSnap'); if(b) b.classList.toggle('on', canvasSnap);
    try{ window.platform.haptic('select'); }catch(_){} }
  function snapVal(v){ return canvasSnap ? Math.round(v/8)*8 : Math.round(v); }

  /* ===== 3 ВІЗУАЛЬНІ СТИЛІ ПОЛОТНА (перемикаються кнопкою 🎨 у панелі) ===== */
  const CANVAS_SKINS=[['dots','Крапки'],['grid','Клітинка'],['deep','Глибина']];
  let canvasSkin='dots';
  try{ const cs=localStorage.getItem('canvasskin'); if(cs&&CANVAS_SKINS.some(s=>s[0]===cs)) canvasSkin=cs; }catch(_){}
  prefCatchup('canvasskin', v=>{ if(v&&CANVAS_SKINS.some(s=>s[0]===v)){ canvasSkin=v; applyCanvasSkin(); } });
  function applyCanvasSkin(){
    CANVAS_SKINS.forEach(([k])=>document.body.classList.remove('cvsk-'+k));
    document.body.classList.add('cvsk-'+canvasSkin);
  }
  function cycleCanvasSkin(){
    const i=CANVAS_SKINS.findIndex(s=>s[0]===canvasSkin);
    canvasSkin=CANVAS_SKINS[(i+1)%CANVAS_SKINS.length][0];
    try{ prefSet('canvasskin', canvasSkin); }catch(_){}
    applyCanvasSkin();
    // показати назву стилю бейджем
    let bd=document.querySelector('.canvas-zoom-badge');
    if(!bd){ bd=document.createElement('div'); bd.className='canvas-zoom-badge'; document.body.appendChild(bd); }
    bd.textContent='🎨 '+CANVAS_SKINS.find(s=>s[0]===canvasSkin)[1];
    bd.classList.add('show');
    clearTimeout(bd.__t); bd.__t=setTimeout(()=>bd.classList.remove('show'),900);
    try{ window.platform.haptic('select'); }catch(_){}
  }
  applyCanvasSkin();

  // ВПИСАТИ ВСЕ: підібрати зум і скрол так, щоб усі блоки влізли в екран
  function fitAll(){
    const board=document.getElementById('board'); if(!board||!board.classList.contains('canvasboard')) return;
    const arr=currentLevelArr(); if(!arr.length) return;
    let minX=1e9,minY=1e9,maxX=-1e9,maxY=-1e9, any=false;
    arr.forEach(b=>{
      if(b.fx==null||b.fy==null) return;
      const w=b.fw||260, h=b.fh||130;
      minX=Math.min(minX,b.fx); minY=Math.min(minY,b.fy);
      maxX=Math.max(maxX,b.fx+w); maxY=Math.max(maxY,b.fy+h); any=true;
    });
    if(!any) return;
    const padd=40, vw=board.clientWidth-padd*2, vh=board.clientHeight-padd*2;
    const cw=Math.max(1,maxX-minX), ch=Math.max(1,maxY-minY);
    let z=Math.min(vw/cw, vh/ch); z=Math.max(0.4, Math.min(1, z)); // не наближати понад 100%
    canvasZoom[boardKey]=z; saveCanvasZoom();
    const inner=board.querySelector('.canvas-inner'); if(inner) inner.style.setProperty('--cz', z);
    // центрувати вміст
    board.scrollLeft = (minX*z) - (vw - cw*z)/2 - padd;
    board.scrollTop  = (minY*z) - (vh - ch*z)/2 - padd;
    try{ const v=document.getElementById('czVal'); if(v) v.textContent=Math.round(z*100)+'%'; }catch(_){}
    try{ flashMinimap(); window.platform.haptic('light'); }catch(_){}
  }

  // зум до конкретного блока (подвійний тап по блоку)
  function zoomToBlock(id){
    const board=document.getElementById('board'); if(!board) return;
    const b=getBlock(id); if(!b||b.fx==null) return;
    const w=b.fw||260, h=b.fh||130, padd=50;
    const vw=board.clientWidth-padd*2, vh=board.clientHeight-padd*2;
    let z=Math.min(vw/w, vh/h); z=Math.max(0.6, Math.min(1.6, z));
    canvasZoom[boardKey]=z; saveCanvasZoom();
    const inner=board.querySelector('.canvas-inner'); if(inner) inner.style.setProperty('--cz', z);
    board.scrollLeft = (b.fx*z) - (board.clientWidth - w*z)/2;
    board.scrollTop  = (b.fy*z) - (board.clientHeight - h*z)/2;
    try{ const v=document.getElementById('czVal'); if(v) v.textContent=Math.round(z*100)+'%'; }catch(_){}
    try{ flashMinimap(); window.platform.haptic('light'); }catch(_){}
  }

  // МІНІ-МАПА: дзеркалить розкладку блоків + рамку видимої області
  let _mmHideT=null;
  function updateMinimap(){
    const mm=document.getElementById('canvasMinimap'); if(!mm) return;
    const board=document.getElementById('board');
    if(!board||!board.classList.contains('canvasboard')){ mm.classList.remove('show'); return; }
    const arr=currentLevelArr();
    const z=getZoom();
    let maxX=board.clientWidth/z, maxY=board.clientHeight/z;
    arr.forEach(b=>{ if(b.fx==null)return; maxX=Math.max(maxX,b.fx+(b.fw||260)); maxY=Math.max(maxY,b.fy+(b.fh||130)); });
    maxX+=80; maxY+=120;
    const mmW=mm.clientWidth||104, mmH=mm.clientHeight||74;
    const s=Math.min(mmW/maxX, mmH/maxY);
    let html='';
    arr.forEach(b=>{ if(b.fx==null)return;
      // дзеркалимо колір: фото — рожевий, папка/сторінка — зелений, решта — за акцентом блока
      let cl='rgba(255,255,255,.32)';
      if(b.type==='photo') cl='rgba(255,107,157,.6)';
      else if(isContainer(b)) cl='rgba(52,199,123,.6)';
      else if(b.color) cl=b.color+'99';
      else if(b.pinned) cl='rgba(106,125,255,.7)';
      const rd = isContainer(b)? '3px':'2px';
      html+=`<i style="left:${b.fx*s}px;top:${b.fy*s}px;width:${Math.max(4,(b.fw||260)*s)}px;height:${Math.max(4,(b.fh||130)*s)}px;background:${cl};border-radius:${rd}"></i>`;
    });
    // рамка видимого вікна
    const vx=(board.scrollLeft/z)*s, vy=(board.scrollTop/z)*s;
    const vw=(board.clientWidth/z)*s, vh=(board.clientHeight/z)*s;
    html+=`<u style="left:${vx}px;top:${vy}px;width:${Math.min(vw,mmW)}px;height:${Math.min(vh,mmH)}px"></u>`;
    mm.innerHTML=html;
    mm._scale=s; mm._z=z;
  }
  // показати міні-мапу на час дії (зум/pan), потім сховати
  function flashMinimap(){
    const mm=document.getElementById('canvasMinimap'); if(!mm) return;
    updateMinimap(); mm.classList.add('show');
    if(_mmHideT) clearTimeout(_mmHideT);
    _mmHideT=setTimeout(()=>{ mm.classList.remove('show'); }, 1400);
  }

  // `blocks` always points to the active board's array
  function curBoard(){ if(!boards[boardKey]) boards[boardKey]=[]; return boards[boardKey]; }
  let blocks=[];  // kept in sync via syncBlocks()
  function syncBlocks(){ blocks=curBoard(); }
  // міст до нового редактора сторінки (після оголошення blocks — уникаємо TDZ)
  try{
    window.__flowPageBridge={
      getBlocks:function(){ return curBoard(); },
      setBlocks:function(arr){ boards[boardKey]=arr; blocks=boards[boardKey]; },
      save:function(){ try{ saveBoard(); }catch(_){} },
      tileHTML:function(id){ try{ const b=getBlock(id); return b?renderTileFull(b):''; }catch(e){ console.error('tileHTML',e); return ''; } },
      bindWidgets:function(rootEl){ try{ window.__btRoot=rootEl||null; bindTiles(); }catch(e){ console.error('bindWidgets',e); } finally{ window.__btRoot=null; } },
      curKey:function(){ return boardKey; },
      folderList:function(){ try{ return orderedFolderKeys().filter(function(k){ try{ return folderVisible(k); }catch(_){ return true; } }).map(function(k){ return {key:k, name:(folders[k]&&folders[k].name)||k, emoji:(folders[k]&&folders[k].emoji)||'📁'}; }); }catch(_){ return []; } },
      folderProgress:function(k){ try{ return folderProgress(k); }catch(_){ return {done:0,total:0,pct:0}; } },
      folderName:function(k){ try{ var base=k?String(k):String(boardKey||'').split('__sp_')[0]; return (folders[base]&&folders[base].name)||''; }catch(_){ return ''; } },
      ptrackersFor:function(fkey){ /* усі проєкти (одиночні + у хабах), прив'язані до папки fkey */
        var res=[];
        try{ Object.keys(boards||{}).forEach(function(bk){
          var walk=function(arr){ (arr||[]).forEach(function(b){ if(!b)return;
            if(b.type==='ptracker'&&b.link===fkey) res.push({id:b.id,title:b.title,emoji:b.emoji,bkey:bk});
            if(b.type==='phub'&&Array.isArray(b.projects)) b.projects.forEach(function(p){ if(p&&p.link===fkey) res.push({id:p.id,title:p.name,emoji:p.emoji,bkey:bk}); });
            if(Array.isArray(b.children))walk(b.children); }); };
          walk(boards[bk]);
        }); }catch(_){}
        return res;
      },
      blockTypes:function(){ try{ return BLOCK_TYPES; }catch(_){ return {}; } },
      spaces:function(){ try{ const ctx=curCtx(); const a=activeSpaceFor(ctx);
        return spacesFor(ctx).map(s=>({id:s.id,name:s.name,emoji:s.emoji,color:s.color,on:s.id===a,
          n:(function(){ try{ return (boards[keyForSpaceIn(ctx,s.id)]||[]).length; }catch(_){ return 0; } })()})); }catch(_){ return []; } },
      switchSpace:function(id){ try{ switchSpace(id); }catch(_){} },
      addSpace:function(){ try{
        const ctx=curCtx(); const list=spacesFor(ctx);
        const palette=['#ff6b9d','#34c77b','#f0b429','#c77dff','#4ecdc4','#e8843c','#9b8cff','#5b8def'];
        const emojis=['🎬','💼','💡','🚀','📚','🏆','🎨','⚡','❤️','🎯','📸','🧠'];
        const id='s'+Date.now().toString(36); const n=list.length;
        list.push({id,name:'Простір '+(n+1),emoji:emojis[n%emojis.length],color:palette[n%palette.length]});
        boards[keyForSpaceIn(ctx,id)]=[]; activeSpaceMap[ctx]=id; saveSpacesMeta(); saveBoard();
        boardKey=keyForSpaceIn(ctx,id); folderPath=[]; syncBlocks();
        return id;
      }catch(_){ return null; } }
    };
  }catch(_){}
  function resortPinned(){
    const arr=curBoard();
    // стабільне сортування: закріплені нагору, решта зберігає свій порядок
    const pinned=arr.filter(b=>b.pinned);
    const rest=arr.filter(b=>!b.pinned);
    arr.length=0; arr.push(...pinned,...rest);
    syncBlocks();
  }

  function saveCustomBoards(){
    try{ const p=window.storage.set(CBKEY,JSON.stringify(customBoards),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
  }
  const BOARD_COLORS=['#e8843c','#34c77b','#5b8def','#c77dff','#ff6b9d','#4ecdc4','#f0b429','#9b8cff'];
  const BOARD_EMOJIS=['📋','📊','🎯','💡','📁','⭐','🔥','📌','💼','🗒️','📈','🏆'];

  const BLOCK_TYPES={
    bento: {emoji:'🧩', color:'#6a7dff', title:'Мікс-блок', desc:'Текст + чек-лист + лінки разом'},
    note:  {emoji:'📝', color:'#5b8def', title:'Нотатка',  desc:'Вільний текст'},
    check: {emoji:'✅', color:'#34c77b', title:'Чекліст',   desc:'Список з галочками'},
    task:  {emoji:'🎯', color:'#e8843c', title:'Завдання',  desc:'Ціль з датою'},
    photo: {emoji:'🖼️', color:'#ff6b9d', title:'Фото',      desc:'Картинка з пристрою'},
    link:  {emoji:'🔗', color:'#4ecdc4', title:'Посилання', desc:'Сайт або документ'},
    list:  {emoji:'📋', color:'#9b8cff', title:'Список',    desc:'Маркований перелік'},
    table: {emoji:'🗂️', color:'#5b8def', title:'Таблиця',   desc:'Рядки та колонки'},
    head:  {emoji:'🏷️', color:'#8b93a3', title:'Заголовок', desc:'Розділювач секції'},
    quick: {emoji:'⚡', color:'#c77dff', title:'Картка',    desc:'Коротка замітка'},
    fin:   {emoji:'💰', color:'#f0b429', title:'Фінанси',   desc:'Зведення з модуля'},
    envelope:{emoji:'✉️', color:'#c77dff', title:'Конверт', desc:'Накопичення на ціль чи мрію'},
    project:{emoji:'💼', color:'#34c77b', title:'Проєкт', desc:'Дохід − витрати = прибуток'},
    divider:{emoji:'➖', color:'#8b93a3', title:'Роздільник', desc:'Лінія між секціями'},
    quote: {emoji:'❝', color:'#9b8cff', title:'Цитата',    desc:'Виділена думка'},
    progress:{emoji:'📊', color:'#34c77b', title:'Прогрес', desc:'Шкала виконання'},
    calendar:{emoji:'📅', color:'#5b8def', title:'Календар', desc:'Місяць з відмітками'},
    countdown:{emoji:'⏳', color:'#e8843c', title:'Відлік', desc:'Скільки днів до дати'},
    toggle:{emoji:'🔽', color:'#5b8def', title:'Тогл',     desc:'Заголовок, що розгортає текст'},
    callout:{emoji:'💡', color:'#f0b429', title:'Виноска',  desc:'Підказка чи примітка'},
    numlist:{emoji:'🔢', color:'#9b8cff', title:'Нумерований', desc:'Список 1. 2. 3.'},
    group: {emoji:'📁', color:'#5b8def', title:'Папка',     desc:'Група блоків усередині'},
    page:  {emoji:'📄', color:'#7c9cf5', title:'Сторінка',  desc:'Окремий аркуш — тап відкриває'},
    book:  {emoji:'📖', color:'#e0a458', title:'Книга',     desc:'Завантаж і читай (TXT, MD, EPUB, PDF)'},
    h1:{emoji:'𝐇', color:'#f3f5f8', title:'Заголовок 1', desc:'Великий заголовок'},
    h2:{emoji:'𝐇', color:'#c7cad3', title:'Заголовок 2', desc:'Середній підзаголовок'},
    h3:{emoji:'𝐇', color:'#8b93a3', title:'Заголовок 3', desc:'Малий підзаголовок'},
    wpult:  {emoji:'🎛️', color:'#6a7dff', title:'Пульт проєктів', desc:'Наступний крок кожного проєкту — закривай не заходячи'},
    wstack: {emoji:'🃏', color:'#ff6b9d', title:'Фокус-стек', desc:'Обліт проєктів по одному, як картки'},
    wpipe:  {emoji:'📊', color:'#5b8def', title:'Пайплайн', desc:'Проєкти за статусами · тап міняє статус'},
    wtline: {emoji:'🗓️', color:'#e8843c', title:'Таймлайн', desc:'Дедлайни проєктів на стрічці тижнів'},
    wportal:{emoji:'🌀', color:'#c77dff', title:'Портали', desc:'Швидкий стрибок у будь-яку папку'},
    wplanday:{emoji:'📅', color:'#6a7dff', title:'План на день', desc:'Точки цього проєкту сьогодні · синхрон із Планером'},
    wplanmonth:{emoji:'🗓', color:'#8b5cf6', title:'План на місяць', desc:'Календар точок проєкту + найближчі'},
    kanban: {emoji:'🗂️', color:'#5b8def', title:'Канбан', desc:'Колонки й картки: заявки → в роботі → готово'},
    contacts:{emoji:'☎️', color:'#34c77b', title:'Контакти', desc:'Партнери, клієнти, сервіси — під рукою'},
    caseline:{emoji:'🕓', color:'#e8843c', title:'Таймлайн справи', desc:'Хронологія подій з датами'},
    festival:{emoji:'🎪', color:'#c77dff', title:'Фестиваль · Подія', desc:'Відлік, програма, місце і бюджет події'},
    /* ═══ PREMIUM PACK V1 ═══ */
    heatmap:{emoji:'🟩', color:'#34c77b', title:'Хітмапа', desc:'12 тижнів звички клітинками'},
    kpi:    {emoji:'📈', color:'#6a7dff', title:'KPI', desc:'Число + дельта + спарклайн'},
    chart:  {emoji:'📉', color:'#5b8def', title:'Графік', desc:'Твої точки даних: bar або line'},
    tabs:   {emoji:'🗃️', color:'#9b8cff', title:'Таби', desc:'Кілька вкладок в одному блоці'},
    accord: {emoji:'🪗', color:'#5b8def', title:'Акордеон', desc:'Секції, що розгортаються'},
    code:   {emoji:'⌨️', color:'#8b93a3', title:'Код', desc:'Моноширинний блок із підсвіткою'},
    embed:  {emoji:'▶️', color:'#ff6b9d', title:'Відео', desc:'YouTube за посиланням'},
    audio:  {emoji:'🎧', color:'#c77dff', title:'Аудіо', desc:'Плеєр за посиланням на mp3'},
    wfocus: {emoji:'🍅', color:'#e8843c', title:'Фокус', desc:'Помодоро 25/5 із кільцем'},
  };
  // which block types are "widgets" (shown under separate Widgets icon)
  const WIDGET_TYPES=['fin','envelope','project','progress','calendar','countdown','wpult','wstack','wpipe','wtline','wportal','wplanday','wplanmonth','wfocus','heatmap','kpi'];
  // проєктні блоки — окрема вкладка «Проєкти» у шторці «＋» (з макета «Агенція»)
  const PROJECT_BLOCKS=['project','festival','kanban','contacts','caseline','wpult','wstack','wpipe','wtline'];
  const PROJECT_ONLY=['kanban','contacts','caseline','festival']; // не показувати серед простих блоків

  // modern line icons (feather-style) per block type
  const ICONS={
    note:'<path d="M11 4H4v16h16v-7" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" stroke-linecap="round" stroke-linejoin="round"/>',
    check:'<path d="M9 11l3 3L22 4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke-linecap="round" stroke-linejoin="round"/>',
    task:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
    photo:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21" stroke-linecap="round" stroke-linejoin="round"/>',
    link:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke-linecap="round" stroke-linejoin="round"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13" stroke-linecap="round"/><circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none"/>',
    table:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    head:'<path d="M4 7h16M4 12h10M4 17h7" stroke-linecap="round"/>',
    quick:'<path d="M13 2L4 14h7l-1 8 9-12h-7z" stroke-linecap="round" stroke-linejoin="round"/>',
    fin:'<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round"/>',
    divider:'<path d="M3 12h18" stroke-linecap="round"/>',
    quote:'<path d="M6 17h3l2-4V7H5v6h3zM14 17h3l2-4V7h-6v6h3z"/>',
    progress:'<rect x="3" y="9" width="18" height="6" rx="3"/><rect x="3" y="9" width="10" height="6" rx="3" fill="currentColor" stroke="none"/>',
    calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4" stroke-linecap="round"/>',
    countdown:'<circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 2h6M12 5V2" stroke-linecap="round"/>',
    toggle:'<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>',
    callout:'<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.5.5 1 1.5 1 2h6c0-.5.5-1.5 1-2a7 7 0 0 0-4-12z" stroke-linecap="round" stroke-linejoin="round"/>',
    numlist:'<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M4 16h2a1 1 0 0 1 0 2l-2 2h3" stroke-linecap="round" stroke-linejoin="round"/>',
    group:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" stroke-linecap="round" stroke-linejoin="round"/>',
    page:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h6" stroke-linecap="round"/>',
    book:'<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 19a2 2 0 0 1 2-2h12" stroke-linecap="round" stroke-linejoin="round"/>',
    h1:'<path d="M4 6v12M12 6v12M4 12h8M17 18V9l-3 2" stroke-linecap="round" stroke-linejoin="round"/>',
    h2:'<path d="M4 6v12M12 6v12M4 12h8M16 18c0-2 4-3 4-6a2 2 0 0 0-4 0" stroke-linecap="round" stroke-linejoin="round"/>',
    h3:'<path d="M4 6v12M12 6v12M4 12h8M16 10a2 2 0 1 1 3 1.5a2 2 0 1 1-3 1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    kanban:'<rect x="3" y="3" width="5.5" height="18" rx="1.5"/><rect x="9.5" y="3" width="5.5" height="12" rx="1.5"/><rect x="16" y="3" width="5" height="8" rx="1.5"/>',
    contacts:'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke-linecap="round"/><path d="M16 4a4 4 0 0 1 0 8M18 20c0-2.4-1-4.4-2.6-5.6" stroke-linecap="round"/>',
    caseline:'<path d="M5 3v18" stroke-linecap="round"/><circle cx="5" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="5" cy="13" r="2" fill="currentColor" stroke="none"/><path d="M10 6h11M10 13h8M10 19h5" stroke-linecap="round"/>',
    festival:'<path d="M12 3v3M4 21l2.5-9h11L20 21z" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12c1 2 2.5 3 4 3s3-1 4-3M4 21h16" stroke-linecap="round"/>',
    heatmap:'<rect x="3" y="3" width="4" height="4" rx="1"/><rect x="10" y="3" width="4" height="4" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1" fill="currentColor" stroke="none"/><rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor" stroke="none"/><rect x="17" y="10" width="4" height="4" rx="1"/><rect x="3" y="17" width="4" height="4" rx="1"/><rect x="10" y="17" width="4" height="4" rx="1" fill="currentColor" stroke="none"/><rect x="17" y="17" width="4" height="4" rx="1"/>',
    kpi:'<path d="M3 17l6-6 4 4 8-8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7h6v6" stroke-linecap="round" stroke-linejoin="round"/>',
    chart:'<path d="M4 20V10M10 20V4M16 20v-8M21 20H3" stroke-linecap="round"/>',
    tabs:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M3 11h18M8 7V4h5v3" stroke-linecap="round"/>',
    accord:'<rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="12" width="18" height="8" rx="1.5"/><path d="M17 6.5l1.5 1 1.5-1" stroke-linecap="round" stroke-linejoin="round"/>',
    code:'<path d="M8 6l-5 6 5 6M16 6l5 6-5 6M13 4l-2 16" stroke-linecap="round" stroke-linejoin="round"/>',
    embed:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/>',
    audio:'<path d="M4 10v4M8 6v12M12 9v6M16 4v16M20 8v8" stroke-linecap="round"/>',
    wfocus:'<circle cx="12" cy="13" r="8"/><path d="M12 13l3-3M12 3v2M9 3h6" stroke-linecap="round"/>'
  };
  // glass-circle icon (variant B): white line icon in frosted circle
  function blockIcon(type, size){
    const s=size||20;
    const svg=ICONS[type]||ICONS.note;
    return `<span class="gico" style="width:${s+18}px;height:${s+18}px;">
      <svg viewBox="0 0 24 24" style="width:${s}px;height:${s}px;">${svg}</svg></span>`;
  }

  // add-sheet
  // usage counter for "favorites" learning
  let blockUsage={};
  const UKEY='blockusage';
  function saveUsage(){ try{ const p=window.storage.set(UKEY,JSON.stringify(blockUsage),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}}

  let addTab='blocks'; // 'blocks' | 'widgets' | 'settings'
  // стиль шторки «Додати блок»: 'standard' (2 вкладки, як було) або 'gallery'
  // (картки з описом + вбудована вкладка ⚙ Налаштування). Вибір користувача, зберігається.
  let addSheetStyle='standard';
  try{ const s=localStorage.getItem('addsheet_style'); if(s==='gallery'||s==='standard') addSheetStyle=s; }catch(_){}
  prefCatchup('addsheet_style', v=>{ if(v==='gallery'||v==='standard') addSheetStyle=v; });
  // «внутрішнє» налаштування блоків: чи фокусувати текстове поле одразу після створення
  let autoFocusNewBlock=true;
  try{ const v=localStorage.getItem('autofocus_newblock'); if(v==='0') autoFocusNewBlock=false; }catch(_){}
  prefCatchup('autofocus_newblock', v=>{ autoFocusNewBlock = v!=='0'; });
  /* ═══════════ ПОШУК ПО ДОШЦІ ═══════════ */
  function blockSearchText(b){
    const parts=[];
    if(b.title) parts.push(b.title);
    if(b.text) parts.push(b.text);
    if(b.label) parts.push(b.label);
    if(b.url) parts.push(b.url);
    if(b.author) parts.push(b.author);
    if(Array.isArray(b.items)) b.items.forEach(it=>{ if(it&&it.text) parts.push(it.text); });
    if(Array.isArray(b.sections)) b.sections.forEach(s=>{
      if(s&&s.text) parts.push(s.text);
      if(s&&Array.isArray(s.items)) s.items.forEach(it=>{ if(it&&it.text) parts.push(it.text); });
    });
    if(Array.isArray(b.rows)) b.rows.forEach(r=>{ if(Array.isArray(r)) r.forEach(c=>{ if(c) parts.push(String(c)); }); });
    return parts.join(' \u00b7 ');
  }
  // рекурсивно збираємо всі блоки з шляхом (стек id папок/сторінок)
  function collectBlocks(arr,path,out){
    if(!Array.isArray(arr)) return;
    for(const b of arr){
      out.push({block:b, path:path.slice()});
      if(isContainer(b)&&Array.isArray(b.children)) collectBlocks(b.children,path.concat(b.id),out);
    }
  }
  function escRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
  function hiliteText(text,q){
    if(!text) return '';
    const safe=esc(text);
    if(!q) return safe;
    try{ return safe.replace(new RegExp('('+escRe(esc(q))+')','ig'),'<mark>$1</mark>'); }
    catch(_){ return safe; }
  }
  function pathLabel(path){
    if(!path.length) return 'дошка';
    const names=path.map(id=>{ const b=getBlock(id); return b? (b.title||(b.type==='page'?'Аркуш':'Папка')) : '…'; });
    return names.join(' › ');
  }
  function runSearch(q){
   try{
    const res=document.getElementById('srchRes');
    if(!res) return;
    q=(q||'').trim();
    const all=[]; collectBlocks(curBoard(),[],all);
    if(!q){
      res.innerHTML=`<div class="srch-empty">Почни вводити, щоб знайти<br>будь-який блок на цій дошці.</div>`;
      return;
    }
    const ql=q.toLowerCase();
    const hits=[];
    for(const item of all){
      const b=item.block;
      const txt=blockSearchText(b);
      if(txt.toLowerCase().includes(ql)){
        hits.push({...item, txt});
      }
    }
    if(!hits.length){
      res.innerHTML=`<div class="srch-empty">Нічого не знайдено за «${esc(q)}».</div>`;
      return;
    }
    res.innerHTML=hits.slice(0,60).map(h=>{
      const b=h.block; const T=BLOCK_TYPES[b.type]||{emoji:'▫️',color:'#6a7dff'};
      const title=b.title||T.title||'Блок';
      // знімок із фрагментом збігу
      let snip=h.txt;
      const idx=snip.toLowerCase().indexOf(ql);
      if(idx>40){ snip='…'+snip.slice(idx-30); }
      if(snip.length>160) snip=snip.slice(0,160)+'…';
      const path=pathLabel(h.path);
      return `<button class="srch-hit" data-jump="${b.id}" style="--shc:${T.color}">
        <span class="sh-ic">${T.emoji||'▫️'}</span>
        <span class="sh-body">
          <span class="sh-t">${hiliteText(title,q)}</span>
          ${snip&&snip!==title?`<span class="sh-s">${hiliteText(snip,q)}</span>`:''}
          <span class="sh-path">📍 ${esc(path)}</span>
        </span></button>`;
    }).join('');
   }catch(err){
    try{ const res=document.getElementById('srchRes'); if(res) res.innerHTML='<div class="srch-empty">Помилка пошуку. Спробуй інший запит.</div>'; }catch(_){}
   }
  }
  // знайти шлях (стек папок) до блоку за id
  function pathToBlock(arr,id,acc){
    for(const b of arr){
      if(String(b.id)===String(id)) return acc.slice();
      if(isContainer(b)&&Array.isArray(b.children)){
        const r=pathToBlock(b.children,id,acc.concat(b.id));
        if(r) return r;
      }
    }
    return null;
  }
  function jumpToBlock(id){
    const target=getBlock(id);
    if(!target){ closeSearch(); return; }
    // якщо сам блок — контейнер (папка/сторінка), заходимо ВСЕРЕДИНУ нього
    let path;
    if(isContainer(target)){
      const p=pathToBlock(curBoard(),id,[]);
      path=(p||[]).concat(id);
    } else {
      path=pathToBlock(curBoard(),id,[])||[];
    }
    folderPath=path;
    closeSearch();
    renderBoard();
    // підсвітити (лише якщо блок видно на поточному рівні)
    setTimeout(()=>{
      const tile=document.querySelector(`.tile[data-tileid="${CSS.escape(String(id))}"]`);
      if(tile){
        tile.scrollIntoView({behavior:'smooth',block:'center'});
        tile.classList.add('flash-hit');
        setTimeout(()=>tile.classList.remove('flash-hit'),1700);
      }
    },120);
  }
  /* ── містки для глобального пошуку (32-global-search.js) ── */
  // всі блоки всіх дошок; bk може бути під-простором виду 'папка__sp_id'
  window.flowSearchBoards=function(){
    const out=[];
    try{
      Object.keys(boards||{}).forEach(bk=>{
        const base=String(bk).split('__sp_')[0];
        const f=folders&&folders[base];
        if(base!=='all' && !f) return;                    // осиротілі дошки видалених папок
        try{ if(f&&f.secret&&!vaultOpen) return; }catch(_){} // прихований vault не світимо
        const fname=(f&&f.name)||(base==='all'?'Простір':base);
        const femo=(f&&f.emoji)||'📁';
        const all=[]; collectBlocks(boards[bk]||[],[],all);
        all.forEach(it=>{ const b=it.block;
          out.push({bk, id:b.id, folder:fname, emoji:femo, title:b.title||'', text:blockSearchText(b)}); });
      });
    }catch(e){ console.error('flowSearchBoards',e); }
    return out;
  };
  window.flowOpenBlock=function(bk,id){
    const base=String(bk).split('__sp_')[0];
    // коренева дошка не є папкою — відкривається екраном простору
    try{ if(base==='all') goSpace(); else goFolder(base); }catch(e){ console.error('flowOpenBlock',e); }
    // дочекатись рендера папки, тоді перемкнутись на потрібну дошку і стрибнути
    setTimeout(()=>{ try{ if(boards[bk]){ boardKey=bk; syncBlocks(); } jumpToBlock(id); }catch(e){ console.error('flowOpenBlock jump',e); } },300);
  };
  function openSearch(){
    const ov=document.getElementById('srchOv');
    const inp=document.getElementById('srchInput');
    ov.classList.add('show'); inp.value=''; runSearch('');
    // фокус має бути синхронним у момент тапу, інакше iOS не показує клавіатуру
    try{ inp.focus(); inp.click&&inp.click(); }catch(_){}
    requestAnimationFrame(()=>{ try{ inp.focus(); }catch(_){} });
  }
  function closeSearch(){ const ov=document.getElementById('srchOv'); if(ov) ov.classList.remove('show'); try{ document.activeElement&&document.activeElement.blur(); }catch(_){} }
  // ДЕЛЕГУВАННЯ на document: працює незалежно від моменту створення елементів і WebView-квірків
  function srchDelegate(e){
    const t=e.target;
    if(t.closest && t.closest('#boardSearchBtn')){ e.preventDefault(); e.stopPropagation(); openSearch(); return; }
    if(t.closest && t.closest('#srchClose')){ e.preventDefault(); e.stopPropagation(); closeSearch(); return; }
    const hit=t.closest && t.closest('.srch-hit[data-jump]');
    if(hit){ e.preventDefault(); e.stopPropagation(); jumpToBlock(hit.getAttribute('data-jump')); return; }
    const ov=document.getElementById('srchOv');
    if(ov && ov.classList.contains('show') && t===ov){ closeSearch(); }
  }
  document.addEventListener('click',srchDelegate,true);
  // pointerup-страховка: окремі WebView на iOS не шлють click у fixed+backdrop-filter
  document.addEventListener('pointerup',function(e){
    const t=e.target;
    if(t.closest && (t.closest('#boardSearchBtn')||t.closest('#srchClose'))){ srchDelegate(e); }
  },true);
  // ввід у пошук — теж делеговано
  document.addEventListener('input',function(e){
    if(e.target && e.target.id==='srchInput'){ runSearch(e.target.value); }
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){ const ov=document.getElementById('srchOv'); if(ov&&ov.classList.contains('show')) closeSearch(); }
  });

  /* ═══════════ UNDO (один рівень відкату) ═══════════ */
  let undoSnapshot=null, undoTimer=null;
  function snapshotForUndo(msg){
    try{ undoSnapshot={ key:boardKey, data:JSON.stringify(boards[boardKey]||[]), path:folderPath.slice() }; }
    catch(_){ undoSnapshot=null; return; }
    const t=document.getElementById('undoToast');
    const m=document.getElementById('undoMsg');
    if(m) m.textContent=msg||'Зміну застосовано';
    if(t){ t.classList.add('show'); }
    if(undoTimer) clearTimeout(undoTimer);
    undoTimer=setTimeout(hideUndo,6000);
  }
  function hideUndo(){ const t=document.getElementById('undoToast'); if(t) t.classList.remove('show'); }
  function doUndo(){
    if(!undoSnapshot) return;
    try{
      boards[undoSnapshot.key]=JSON.parse(undoSnapshot.data);
      boardKey=undoSnapshot.key;
      folderPath=undoSnapshot.path.slice();
      syncBlocks(); saveBoard(); renderBoard();
      window.platform.haptic('light');
    }catch(_){}
    undoSnapshot=null; hideUndo();
  }
  { const b=document.getElementById('undoBtn'); if(b) b.onclick=doUndo; }

  /* ═══════════ ШВИДКЕ ЗАХОПЛЕННЯ (Вхідні) ═══════════ */
  const INBOX_TITLE='Вхідні';
  function ensureInboxFolder(){
    const root=curBoard();
    let fol=root.find(b=>b.type==='group'&&b.title===INBOX_TITLE);
    if(!fol){
      fol={ id:Date.now()+Math.random(), type:'group', title:INBOX_TITLE, emoji:'📥', color:'#6a7dff', children:[] };
      root.unshift(fol);
    }
    if(!Array.isArray(fol.children)) fol.children=[];
    return fol;
  }
  function openQuickCapture(){
    const ov=document.getElementById('qcapOv');
    const ta=document.getElementById('qcapTa');
    ov.classList.add('show'); ta.value='';
    setTimeout(()=>ta.focus(),60);
  }
  function closeQuickCapture(){ document.getElementById('qcapOv').classList.remove('show'); try{ document.activeElement&&document.activeElement.blur(); }catch(_){} }
  function saveQuickCapture(){
    const ta=document.getElementById('qcapTa');
    const txt=(ta.value||'').trim();
    if(!txt){ closeQuickCapture(); return; }
    const fol=ensureInboxFolder();
    const firstLine=txt.split('\n')[0].slice(0,60);
    fol.children.push({ id:Date.now()+Math.random(), type:'note', title:firstLine, text:txt });
    syncBlocks(); saveBoard();
    if(document.getElementById('scr-space').classList.contains('on')||document.body.classList.contains('in-space')) renderBoard();
    closeQuickCapture();
    window.platform.haptic('light');
  }
  { const s=document.getElementById('qcapSave'); if(s){
      const h=e=>{ e.preventDefault(); e.stopPropagation(); saveQuickCapture(); };
      s.addEventListener('pointerdown',h); s.addEventListener('click',h);
  }}
  { const c=document.getElementById('qcapCancel'); if(c){
      const h=e=>{ e.preventDefault(); e.stopPropagation(); closeQuickCapture(); };
      c.addEventListener('pointerdown',h); c.addEventListener('click',h);
  }}
  { const ov=document.getElementById('qcapOv'); if(ov){
      ov.addEventListener('pointerdown',e=>{ if(e.target===ov) closeQuickCapture(); });
  }}
  { const ta=document.getElementById('qcapTa'); if(ta) ta.onkeydown=e=>{
      if((e.metaKey||e.ctrlKey)&&e.key==='Enter') saveQuickCapture();
      if(e.key==='Escape') closeQuickCapture();
  }; }
  // експонуємо для прив'язки до кнопки (напр. довгий тап на FAB або пункт меню)
  window.flowQuickCapture=openQuickCapture;
  // відкрити простір і зайти у «Вхідні»
  window.flowOpenInbox=function(){
    try{
      const fol=ensureInboxFolder(); saveBoard();
      folderPath=[fol.id];
      const sh=window.__show||window.show||(typeof show==='function'?show:null);
      renderBoard();
      if(sh) sh('scr-space');
      document.body.classList.add('in-space');
    }catch(_){}
  };

