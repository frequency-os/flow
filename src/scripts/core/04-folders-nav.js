  /* ============ FOLDER / NAV DATA ============ */
  let folders = {
    work: { key:'work', c:'#6a7dff', emoji:'💼', icon:'fo-briefcase', name:'Робота', pct:0, photo:'', flayout:'a', pinned:false,
      widgets:[ { id:'worktrack', emoji:'⏱', t:'Години та заробіток', d:'Календар змін + зарплата', ready:true } ]},
  };
  let order = ['work'];
  let currentFolderKey=null;  // яка папка відкрита (Канал / документ / Робота)

  /* ── власна іконка профілю (необов'язково): data-URL, стисле фото ── */
  const CUSTOM_AV_KEY='custom_avatar_v1';
  let customAvatar='';
  function saveCustomAvatar(){ try{ const p=window.storage.set(CUSTOM_AV_KEY, customAvatar||'', false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  const FKEY='folders_cfg', FOKEY='folders_order';
  const FOLDER_COLORS=['#e8843c','#34c77b','#5b8def','#c77dff','#ff6b9d','#4ecdc4','#f0b429','#9b8cff','#ff5a5f','#2dd4bf'];
  const FOLDER_EMOJIS=['📁','💰','🏃','⭐','📚','🎯','💡','❤️','🏠','✈️','🍎','💪','🧠','🎨','🎵','📈'];
  /* ── лінійні іконки папок (нові теми) ──
     Той самий порядок, що й у FOLDER_EMOJIS: нова папка отримує пару
     «емодзі + іконка», тож виглядає правильно в будь-якій темі.
     Поле emoji НЕ прибрано: у старих темах малюється воно. */
  const FOLDER_ICONS=['fo-folder','fo-coin','fo-run','fo-star','fo-book','fo-target','fo-bulb','fo-heart',
                      'fo-home','fo-plane','fo-apple','fo-dumbbell','fo-brain','fo-palette','fo-music','fo-chart'];
  /* Мапа для переїзду вже наявних папок: емодзі, яке ти колись поставив,
     → найближча іконка. Що не впізналось — стає загальною текою (fo-folder). */
  const EMOJI_ICON={
    '📁':'fo-folder','📂':'fo-folder','🗂':'fo-folder','🗃':'fo-folder','🗄':'fo-folder',
    '💼':'fo-briefcase','👔':'fo-briefcase','🏢':'fo-briefcase',
    '💰':'fo-coin','💵':'fo-coin','💸':'fo-coin','🪙':'fo-coin','💳':'fo-coin','🏦':'fo-coin','💲':'fo-coin',
    '🏃':'fo-run','🚶':'fo-run','🏅':'fo-run',
    '⭐':'fo-star','🌟':'fo-star','✴️':'fo-star',
    '✨':'fo-spark','🪄':'fo-spark',
    '📚':'fo-book','📖':'fo-book','📕':'fo-book','📗':'fo-book','📘':'fo-book','📙':'fo-book',
    '🎯':'fo-target','🏹':'fo-target',
    '💡':'fo-bulb',
    '❤️':'fo-heart','❤':'fo-heart','💗':'fo-heart','💖':'fo-heart','💜':'fo-heart','🧡':'fo-heart',
    '🏠':'fo-home','🏡':'fo-home','🏘':'fo-home',
    '✈️':'fo-plane','✈':'fo-plane','🌍':'fo-plane','🌎':'fo-plane','🧳':'fo-plane','🗺':'fo-plane',
    '🍎':'fo-apple','🍏':'fo-apple','🥗':'fo-apple','🍽':'fo-apple','🥑':'fo-apple',
    '💪':'fo-dumbbell','🏋':'fo-dumbbell','🤸':'fo-dumbbell','🧘':'fo-dumbbell',
    '🧠':'fo-brain','🤯':'fo-brain','🫀':'fo-brain',
    '🎨':'fo-palette','🖌':'fo-palette','🖼':'fo-palette','🎭':'fo-palette',
    '🎵':'fo-music','🎶':'fo-music','🎧':'fo-music','🎸':'fo-music','🎤':'fo-music',
    '📈':'fo-chart','📊':'fo-chart','📉':'fo-chart',
    '📅':'fo-calendar','🗓':'fo-calendar','📆':'fo-calendar',
    '⏱':'fo-clock','⏰':'fo-clock','🕐':'fo-clock','⌛':'fo-clock','⏳':'fo-clock',
    '📄':'fo-doc','📝':'fo-doc','✍️':'fo-doc','📋':'fo-doc','🧾':'fo-doc','📃':'fo-doc',
    '🔧':'fo-tool','🛠':'fo-tool','⚙️':'fo-tool','🔨':'fo-tool',
    '🎓':'fo-study','🏫':'fo-study','👨‍🎓':'fo-study',
    '🌱':'fo-plant','🌿':'fo-plant','🪴':'fo-plant','🌳':'fo-plant','🌸':'fo-plant',
    '🔥':'fo-flame',
    '🚀':'fo-rocket','🛸':'fo-rocket',
    '🛒':'fo-cart','🛍':'fo-cart',
    '🚗':'fo-car','🚙':'fo-car','🚕':'fo-car','🚲':'fo-car',
    '📷':'fo-camera','📸':'fo-camera','🎬':'fo-camera','📹':'fo-camera',
    '✉️':'fo-mail','📧':'fo-mail','📮':'fo-mail','💬':'fo-mail',
    '🛡':'fo-shield','🔒':'fo-shield','🕶️':'fo-shield','🔐':'fo-shield',
    '👥':'fo-users','🤝':'fo-users','👪':'fo-users','👨‍👩‍👧':'fo-users','👨‍👩‍👦':'fo-users',
  };
  /* Емодзі приходить із даних користувача — там трапляються варіаційні
     селектори (U+FE0F) і модифікатори тону/статі. Перед пошуком у мапі
     чистимо їх, інакше '🏃‍♂️' не збіглося б із '🏃'. */
  function folderIconFor(emoji){
    if(!emoji) return 'fo-folder';
    const raw=String(emoji).trim();
    if(EMOJI_ICON[raw]) return EMOJI_ICON[raw];
    const bare=raw.replace(/[\u{FE0E}\u{FE0F}\u{200D}\u{1F3FB}-\u{1F3FF}\u{2640}\u{2642}]/gu,'');
    return EMOJI_ICON[bare] || 'fo-folder';
  }
  // іконка приходить і з хмари — пропускаємо лише ім'я спрайта (літери, цифри, дефіс), інакше за емодзі
  function folderIcon(f){ return (f&&f.icon&&/^[A-Za-z0-9_-]{1,40}$/.test(String(f.icon))) ? f.icon : folderIconFor(f&&f.emoji); }
  /* Повний перелік іконок для ручного вибору — той самий порядок, що у
     спрайті в index.html. Підписи потрібні лише для підказки при наведенні. */
  const ICON_ALL=[
    ['fo-folder','Тека'],       ['fo-briefcase','Робота'],  ['fo-coin','Гроші'],      ['fo-chart','Графік'],
    ['fo-target','Ціль'],       ['fo-rocket','Проєкт'],     ['fo-calendar','Календар'],['fo-clock','Час'],
    ['fo-doc','Документ'],      ['fo-book','Книга'],        ['fo-study','Навчання'],  ['fo-brain','Мислення'],
    ['fo-bulb','Ідея'],         ['fo-spark','Іскра'],       ['fo-star','Зірка'],      ['fo-flame','Вогонь'],
    ['fo-heart','Серце'],       ['fo-home','Дім'],          ['fo-users','Люди'],      ['fo-mail','Пошта'],
    ['fo-run','Біг'],           ['fo-dumbbell','Спорт'],    ['fo-apple','Їжа'],       ['fo-plant','Ріст'],
    ['fo-palette','Творчість'], ['fo-music','Музика'],      ['fo-camera','Фото'],     ['fo-tool','Інструменти'],
    ['fo-cart','Покупки'],      ['fo-car','Транспорт'],     ['fo-plane','Подорожі'],  ['fo-shield','Захист'],
  ];
  try{ window.folderIconFor=folderIconFor; }catch(_){}

  // видимість папки: Vault (сховані папки за PIN) вирізано 04.09.2026 — усі папки видимі
  function folderVisible(k){ return !!folders[k]; }

  /* ═══════ ЗАПОБІЖНИК ВІД ВТРАТИ ПАПОК ═══════
     Історія бага: якщо локальної копії не було (iOS вичистив кеш, інший
     пристрій, очищені дані сайту), а хмара тієї миті не відповіла, то load()
     не мав чого застосувати — і `folders` лишався заводською заглушкою з
     однією «Роботою». Далі будь-яка разова міграція кликала saveFolders(),
     ця заглушка лягала в сховище зі свіжою міткою і через хмару затирала
     справжні папки на ВСІХ пристроях. Назавжди.

     Лікування — два незалежні замки, обидва тільки для АВТОМАТИЧНИХ записів
     ({auto:true} — міграції й разові прибирання). Те, що робить людина
     руками, проходить завжди: вона бачить екран і відповідає за свій вибір.
       1) не писати, поки load() не підтвердив, що дані справді прочитані;
       2) не писати заводську заглушку поверх сховища, де папок більше. */
  let foldersLoaded = false;               // load() успішно застосував конфіг папок
  function markFoldersLoaded(ok){ foldersLoaded = !!ok; }
  // у памʼяті рівно те, з чим модуль стартує (04-folders-nav.js:2) — тобто нічого не прочитано
  function foldersLookFactory(){
    const ks=Object.keys(folders);
    return ks.length===0 || (ks.length===1 && ks[0]==='work');
  }
  // скільки папок зараз лежить у локальному сховищі (0 — якщо порожньо чи не читається)
  function storedFolderCount(){
    try{
      const raw = window.storage.getLocal ? window.storage.getLocal(FKEY) : null;
      if(!raw) return 0;
      const o = JSON.parse(raw);
      return (o && typeof o==='object') ? Object.keys(o).length : 0;
    }catch(_){ return 0; }
  }
  // persist folder customizations (photo, color, emoji, name, layout, pinned) + custom folders + order
  function saveFolders(opts){
    const auto = !!(opts && opts.auto);
    if(auto){
      if(!foldersLoaded){
        try{ console.warn('[Flow] saveFolders пропущено: дані папок цієї сесії не прочитані'); }catch(_){}
        return false;
      }
      if(foldersLookFactory() && storedFolderCount() > 1){
        try{ console.warn('[Flow] saveFolders пропущено: у памʼяті заводська заглушка, а у сховищі', storedFolderCount(), 'папок'); }catch(_){}
        return false;
      }
    }
    try{
      const cfg={};
      Object.keys(folders).forEach(k=>{
        const f=folders[k];
        cfg[k]={c:f.c,emoji:f.emoji,icon:f.icon||folderIconFor(f.emoji),iconSet:f.iconSet?1:0,name:f.name,photo:f.photo||'',photoPos:f.photoPos||null,flayout:f.flayout||'a',pinned:!!f.pinned,custom:!!f.custom,pct:f.pct||0,parent:f.parent||'',role:f.role||'area',status:f.status||'',due:f.due||''};
        // сфера (39-spheres.js): шаблон і будівля в «Моєму світі»; поле пишемо лише в сфер
        if(f.sphere&&typeof f.sphere.tpl==='string') cfg[k].sphere={tpl:f.sphere.tpl,bld:String(f.sphere.bld||'')};
        // як відкривається група (16-dashboard.js openGroupAsChosen): пишемо лише не-типове
        if(f.gview==='folder'||f.gview==='ios') cfg[k].gview=f.gview;
      });
      const put=()=>{
        const p1=window.storage.set(FKEY,JSON.stringify(cfg),false); if(p1&&p1.catch)p1.catch(()=>{});
        const p2=window.storage.set(FOKEY,JSON.stringify(order),false); if(p2&&p2.catch)p2.catch(()=>{});
      };
      // {auto:true} — автоматичний запис і для сховища: заводські папки гостя
      // лягають з міткою 0 і не перебивають хмару після входу (SYNC-1, 02-storage.js)
      if(auto && window.storeAuto) window.storeAuto(put); else put();
      return true;
    }catch(_){ return false; }
  }

  /* ═══════ «НАДГРОБКИ» ВИДАЛЕНИХ ПАПОК ═══════
     Конфіг папок при читанні лише ДОЛИВАЄТЬСЯ (applyFolderCfgRaw у 27-canvas.js
     не прибирає того, чого в сховищі нема). Тому пристрій, що ще тримав
     видалену папку в памʼяті чи в локальній копії, першим же saveFolders()
     повертав її в хмару — і вона воскресала на всіх пристроях.
     Тепер видалення лишає запис {ключ: коли} у синхронізованому ключі
     folders_deleted_v1, і кожен пристрій після читання прибирає такі папки
     разом з усім, що їм належало. Ключі папок унікальні ('f_'+час), тож
     надгробок не зачепить нову папку.
     reset — мить відновлення з бекапу: давніші надгробки більше не діють
     (інакше інший пристрій знову стер би щойно відновлені папки). */
  const FDELKEY='folders_deleted_v1';
  const FDEL_MAX=300;                      // межа розміру: найстаріші надгробки відкидаємо
  function tombsNorm(o){
    const t={ reset:(o&&+o.reset)||0, ids:{} };
    const ids=(o&&o.ids&&typeof o.ids==='object')?o.ids:{};
    Object.keys(ids).forEach(k=>{ const ts=+ids[k]||0; if(ts>t.reset) t.ids[k]=ts; });
    const ks=Object.keys(t.ids);
    if(ks.length>FDEL_MAX) ks.sort((a,b)=>t.ids[b]-t.ids[a]).slice(FDEL_MAX).forEach(k=>{ delete t.ids[k]; });
    return t;
  }
  // злити дві копії (памʼять цього пристрою + сховище/хмара): жодне видалення не губиться
  function tombsMerge(a,b){
    const reset=Math.max(a.reset||0,b.reset||0), ids={};
    [a,b].forEach(t=>Object.keys(t.ids||{}).forEach(k=>{ const ts=+t.ids[k]||0; if(ts>(ids[k]||0)) ids[k]=ts; }));
    return tombsNorm({reset, ids});
  }
  function tombsSame(a,b){
    const ka=Object.keys(a.ids), kb=Object.keys(b.ids);
    return a.reset===b.reset && ka.length===kb.length && ka.every(k=>a.ids[k]===b.ids[k]);
  }
  let folderTombs={ reset:0, ids:{} };
  // одразу з локальної копії: миттєвий рендер (27-canvas.js) не має блиснути видаленою папкою
  try{ const r=window.storage.getLocal(FDELKEY); if(r) folderTombs=tombsNorm(JSON.parse(r)); }catch(_){}
  function folderTombed(k){ return !!folderTombs.ids[k]; }
  function saveFolderTombs(){ try{ const p=window.storage.set(FDELKEY,JSON.stringify(folderTombs),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  // віддає проміс запису: відновлення з бекапу чекає його, перш ніж штовхати чергу в хмару
  window.folderTombsReset=function(){ folderTombs={ reset:Date.now(), ids:{} }; return window.storage.set(FDELKEY,JSON.stringify(folderTombs),false); };

  /* Прибрати все, що належить папці: документ і теми (дошки key та key__sp_*),
     список тем, додані віджети, обкладинку документа, фото (IndexedDB + рядок
     photo:<id> у хмарі), прикріплення в чатах і картки «Прикріплено» в їхніх
     стрічках. Кожне сховище пишемо лише тоді, коли в ньому справді щось змінилось.
     opts.remote — папку видалили на ІНШОМУ пристрої: карту тем (spaces_map_v2)
     і обкладинки (flowPgCovers) модулі читають лише з локальної копії, тож тут
     вони можуть бути застарілі. Той пристрій уже прибрав їх у хмарі; ми чистимо
     лише памʼять — інакше свіжа мітка нашої старої копії затерла б у хмарі його
     новіші теми й обкладинки. Повертає true, якщо було що прибирати. */
  function folderPurge(key, opts){
    if(!key) return false;
    const remote=!!(opts && opts.remote);
    let any=false;
    const f=folders[key];
    const own=k=>k===key || k.indexOf(key+'__sp_')===0;
    try{
      const refs=new Set();
      if(f && window.photoIsRef(f.photo)) refs.add(String(f.photo));
      const pid='ph_'+key; if(window.__photoCache && window.__photoCache[pid]) refs.add('idb:'+pid);
      refs.forEach(r=>{ window.photoDel(r); any=true; });
    }catch(_){}
    try{
      let ch=false;
      Object.keys(boards).forEach(k=>{
        if(own(k)){ delete boards[k]; ch=true; return; }
        if(k.indexOf('chat_')===0 && Array.isArray(boards[k])){
          const n=boards[k].length;
          boards[k]=boards[k].filter(b=>!(b && b.type==='flink' && b.folder===key));
          if(boards[k].length!==n) ch=true;
        }
      });
      if(ch){ saveBoard(); any=true; }
    }catch(e){ console.error('folderPurge boards',e); }
    try{
      const api=window.__pgCovers;
      if(api && typeof api.keys==='function') api.keys().filter(own).forEach(k=>{
        if(remote && typeof api.forget==='function') api.forget(k); else api.clear(k);
        any=true;
      });
    }catch(_){}
    try{ if(spacesMap[key]!==undefined || activeSpaceMap[key]!==undefined){ delete spacesMap[key]; delete activeSpaceMap[key]; if(!remote) saveSpacesMeta(); any=true; } }catch(_){}
    try{ if(folderWidgets[key]){ delete folderWidgets[key]; saveFolderWidgets(); any=true; } }catch(_){}
    try{
      let ch=false;
      chats.forEach(c=>{ if(c && Array.isArray(c.folders) && c.folders.includes(key)){ c.folders=c.folders.filter(k=>k!==key); ch=true; } });
      if(ch){ saveChats(); any=true; }
    }catch(_){}
    if(f){
      const par=f.parent||'';
      Object.keys(folders).forEach(ck=>{ if(folders[ck]&&(folders[ck].parent||'')===key) folders[ck].parent=par; });
      delete folders[key]; any=true;
    }
    if(order.indexOf(key)>=0){ order=order.filter(x=>x!==key); any=true; }
    return any;
  }
  // Людина видаляє папку (меню папки, агент, «відкотити» агента): надгробок → прибирання → запис
  function folderDelete(key){
    // вбудовані папки (work) видаляти не можна: після перезапуску вони повертаються
    // з коду порожніми, а інші пристрої їх не прибирають (див. applyFolderTombsRaw)
    if(!folders[key] || !folders[key].custom) return false;
    folderTombs.ids[key]=Date.now(); folderTombs=tombsNorm(folderTombs); saveFolderTombs();
    folderPurge(key);
    saveFolders();
    /* якщо видалили папку, чий документ зараз відкритий, — на Огляд; інакше документ
       лишався на екрані, а дописане йшло в дошку-сироту і зникало (10.10.2026) */
    try{ leaveTombedFolder([]); }catch(_){}
    return true;
  }
  /* Крок 1 після читання сховища (load у 27-canvas.js) — ДО застосування конфігу
     папок: злити надгробки з прочитаного з тими, що в памʼяті. Саме тут reset
     (мить відновлення з бекапу) знімає давні надгробки. Раніше злиття йшло ПІСЛЯ
     applyFolderCfgRaw: той ще бачив старий надгробок і відкидав щойно відновлену
     папку — на другому пристрої вона не зʼявлялась, а його наступне збереження
     папок стирало її з хмари. Нічого не пише; повертає прочитане (для кроку 2). */
  function mergeFolderTombsRaw(raw){
    let got={ reset:0, ids:{} };
    try{ const o=raw?JSON.parse(raw):null; if(o&&typeof o==='object') got=tombsNorm(o); }catch(_){}
    folderTombs=tombsMerge(folderTombs, got);
    return got;
  }
  /* Крок 2 (після папок і чатів): записати злите й прибрати папки, видалені на
     іншому пристрої. Пише лише після довіреного читання — як усі автоматичні
     записи папок. got — те, що повернув крок 1. */
  function applyFolderTombsRaw(got){
    got=got||{ reset:0, ids:{} };
    const merged=folderTombs;
    if(!foldersLoaded) return 0;
    if(!tombsSame(merged, got)) saveFolderTombs();
    // злите збігається з хмарним, а локальна копія стара — оновити лише її (з міткою
    // хмари, без запису в хмару): інакше після перезапуску без звʼязку пристрій
    // стартував би зі старих надгробків
    else if(window.sbCacheLocal){
      let loc=null; try{ const r=window.storage.getLocal(FDELKEY); if(r) loc=tombsNorm(JSON.parse(r)); }catch(_){}
      if(!loc || !tombsSame(merged, loc)) window.sbCacheLocal(FDELKEY, JSON.stringify(merged));
    }
    const purged=[];
    Object.keys(folderTombs.ids).forEach(k=>{
      if(folders[k] && !folders[k].custom) return;     // вбудовані папки видаляти не можна
      if(folderPurge(k, {remote:true})) purged.push(k);
    });
    const n=purged.length;
    if(n){ saveFolders({auto:true}); console.warn('[Flow] прибрано папок, видалених на іншому пристрої:', n); }
    try{ leaveTombedFolder(purged); }catch(e){ console.error('leaveTombedFolder',e); }
    return n;
  }
  /* Папку видалили на іншому пристрої, поки вона відкрита тут. Без цього на
     екрані лишався її документ, а boardKey вказував на неї — syncBlocks()
     знову заводив boards[key]=[], і все дописане йшло в невидиму дошку-сироту
     (та ще й щоразу поверталось у хмару). Скидаємо вказівники ДО syncBlocks
     у load() і, якщо людина саме в цій папці, повертаємо на Огляд із поясненням.
     purged — папки, прибрані щойно (тобто видалені деінде): лише про них тост. */
  function leaveTombedFolder(purged){
    const gone=k=>!!k && folderTombed(k) && !folders[k];
    const bBase=String(boardKey||'').split('__sp_')[0];
    const onBoard=gone(bBase), onFolder=gone(currentFolderKey);
    if(!onBoard && !onFolder) return false;
    const act=document.querySelector('.screen.active');
    // документ папки (scr-page) показує саме boardKey; інші екрани її вмісту не тримають
    const visible=!!(act && act.id==='scr-page' && onBoard);
    if(onBoard){ delete boards[boardKey]; boardKey='all'; }
    if(onFolder) currentFolderKey=null;
    if(visible){
      goHome();
      if((purged||[]).indexOf(bBase)>=0){ try{ plToast('Папку видалено на іншому пристрої'); }catch(_){} }
    }
    return true;
  }

  /* Старий каталог віджетів папки (WIDGET_CATALOG) прибрано 09.10.2026: його ніде не показували.
     Сховище folder_widgets лишається — його читає завантаження і чистить видалення папки. */
  let folderWidgets={}; // { folderKey: [...] } — лише старі дані
  const FWKEY='folder_widgets';
  function saveFolderWidgets(){ try{ const p=window.storage.set(FWKEY,JSON.stringify(folderWidgets),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }

  function orderedFolderKeys(){
    // pinned first, keep order otherwise
    return order.slice().sort((a,b)=>((folders[b]&&folders[b].pinned?1:0)-(folders[a]&&folders[a].pinned?1:0)));
  }

  /* ===== РОЛІ ПАПОК: область / проєкт / сторінка ===== */
  const PROJECT_STATUSES=[
    ['idea','Ідея','#8b93a3'], ['active','В роботі','#5b8def'],
    ['pause','Пауза','#f0b429'], ['done','Готово','#34c77b'],
  ];
  function projStatusMeta(s){ return PROJECT_STATUSES.find(x=>x[0]===s)||PROJECT_STATUSES[1]; }
  // прогрес проєкту = виконані пункти всіх чеклістів/завдань у дошках цієї папки (включно з її просторами)
  function folderProgress(key){
    let done=0, total=0;
    const walk=(arr)=>{ (arr||[]).forEach(b=>{
      if(!b) return;
      if(b.type==='check'&&Array.isArray(b.items)){ b.items.forEach(it=>{ if(it&&(it.text||'').trim()){ total++; if(it.done)done++; } }); }
      if(b.type==='task' && String(b.text||'').trim()){ total++; if(b.done)done++; }
      if(Array.isArray(b.sections)){ b.sections.forEach(s=>{ if(s&&s.type==='check'&&Array.isArray(s.items)) s.items.forEach(it=>{ if(it&&(it.text||'').trim()){ total++; if(it.done)done++; } }); }); }
      if(Array.isArray(b.children)) walk(b.children);
    }); };
    try{ Object.keys(boards||{}).forEach(bk=>{ if(bk===key||bk.indexOf(key+'__sp_')===0) walk(boards[bk]); }); }catch(_){}
    return { done, total, pct: total? Math.round(done/total*100) : 0 };
  }
  function dueLabel(due){
    if(!due) return '';
    const d=new Date(due+'T23:59:59'); if(isNaN(d)) return '';
    const days=Math.ceil((d-Date.now())/86400000);
    if(days<0)  return {t:Math.abs(days)+' дн. тому', late:true};
    if(days===0)return {t:'сьогодні', late:false};
    return {t:'через '+days+' дн.', late:false};
  }
  // ключі папок-проєктів (для віджетів)
  function projFolderKeys(){ return orderedFolderKeys().filter(k=>folders[k]&&folders[k].role==='project'&&folderVisible(k)); }

  /* ===== вкладені папки (папка в папці) ===== */
  function childFolderKeys(parentKey){
    return orderedFolderKeys().filter(k=>folders[k] && (folders[k].parent||'')===(parentKey||''));
  }
  function topFolderKeys(){
    // батька нема (видалили на іншому пристрої) — папка лишається на головній, а не зникає
    return orderedFolderKeys().filter(k=>{ const p=folders[k]&&(folders[k].parent||''); return folders[k] && (!p || !folders[p]); });
  }
  function isDescendantFolder(cand, key){
    let cur=cand, guard=0;
    while(cur && guard++<100){
      if(cur===key) return true;
      cur=folders[cur] ? (folders[cur].parent||'') : '';
    }
    return false;
  }
  function moveFolderTo(key, parentKey){
    const f=folders[key]; if(!f) return;
    parentKey=parentKey||'';
    if(parentKey===key) return;
    if(parentKey && isDescendantFolder(parentKey, key)) return;
    f.parent=parentKey;
    saveFolders(); renderDashboard();
  }

  /* ============ SCREEN ROUTER ============ */
  function goHome(){ show('scr-home'); }
  function goFolder(key){
    try{
      currentFolderKey=key;
      // роль «Сторінка»: одразу відкриваємо аркуш цієї папки
      if(folders[key] && folders[key].role==='page'){ goSpaceFor(key); return; }
      if(key==='fin'){ finView='dash'; renderFinance(); show('scr-finance'); return; }
      if(key==='val'){ renderValues(); show('scr-values'); return; }
      if(key==='work'){ goWork(); return; }
      if(key==='pat'){ goPatterns(); return; }
      if(key===VISION_FKEY){ goVision(); return; }
      // ЗВИЧАЙНА ПАПКА: одразу документ. Стрічка «як у месенджері» — це окрема
      // сутність Чат (36-chats.js); папки нею більше не відкриваються (21.09.2026)
      goSpaceFor(key); return;
    }catch(e){ console.error('goFolder', key, e); flowAlert('Не вдалося відкрити папку: '+e.message); }
  }
  function goDebts(){ debtRender(); try{ const c=document.getElementById('cur'); if(c&&!c.__picked){ c.value=mainCur(); c.onchange=()=>{ c.__picked=true; }; } }catch(_){} show('scr-debts'); }   // новий борг — у головній валюті
  function goFinance(){ finView='dash'; renderFinance(); show('scr-finance'); }
  function goEnvelopes(){ finView='envelopes'; renderFinance(); show('scr-finance'); }
  function goSpend(){ renderSpend(); show('scr-spend'); }
  let workOrigin='work';
  function goWork(){ workOrigin=currentFolderKey||'work'; renderWork(); show('scr-work'); }

