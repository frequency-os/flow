  /* ============ FOLDER / NAV DATA ============ */
  let folders = {
    work: { key:'work', c:'#6a7dff', emoji:'💼', icon:'fo-briefcase', name:'Робота', pct:0, photo:'', flayout:'a', pinned:false,
      widgets:[ { id:'worktrack', emoji:'⏱', t:'Години та заробіток', d:'Календар змін + зарплата', ready:true } ]},
  };
  let order = ['work'];

  /* ── власна іконка профілю (необов'язково): data-URL, стисле фото ── */
  const CUSTOM_AV_KEY='custom_avatar_v1';
  let customAvatar='';
  function saveCustomAvatar(){ try{ const p=window.storage.set(CUSTOM_AV_KEY, customAvatar||'', false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function customAvatarHtml(){ return customAvatar? `<img src="${customAvatar}" alt="">` : ''; }
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
  function folderIcon(f){ return (f&&f.icon) ? f.icon : folderIconFor(f&&f.emoji); }
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

  // persist folder customizations (photo, color, emoji, name, layout, pinned) + custom folders + order
  function saveFolders(){
    try{
      const cfg={};
      Object.keys(folders).forEach(k=>{
        const f=folders[k];
        cfg[k]={c:f.c,emoji:f.emoji,icon:f.icon||folderIconFor(f.emoji),iconSet:f.iconSet?1:0,name:f.name,photo:f.photo||'',photoPos:f.photoPos||null,flayout:f.flayout||'a',pinned:!!f.pinned,custom:!!f.custom,pct:f.pct||0,parent:f.parent||'',role:f.role||'area',status:f.status||'',due:f.due||''};
      });
      const p1=window.storage.set(FKEY,JSON.stringify(cfg),false); if(p1&&p1.catch)p1.catch(()=>{});
      const p2=window.storage.set(FOKEY,JSON.stringify(order),false); if(p2&&p2.catch)p2.catch(()=>{});
    }catch(_){}
  }

  /* ===== додані віджети папок (спільні дані, різні входи) ===== */
  // каталог доступних віджетів, які можна додати в будь-яку папку
  const WIDGET_CATALOG = {
    worktrack: { emoji:'⏱', t:'Години та заробіток', d:'Календар змін, ставка, зарплата, конверти', open:()=>goWork() },
    debts:     { emoji:'🤝', t:'Борги', d:'Хто кому винен · синхрон із фінансами', open:()=>goDebts() },
    spend:     { emoji:'🧾', t:'Витрати', d:'Куди йдуть гроші', open:()=>goSpend() },
    envelopes: { emoji:'✉️', t:'Конверти', d:'Накопичення на мрії та проєкти · впливає на баланс', open:()=>goEnvelopes() },
    patterns:  { emoji:'🧠', t:'Патерни', d:'Перехват лазівок · заміна патернів за 4 міс', open:()=>goPatterns() },
    planday:   { emoji:'📅', t:'План на день', d:'Точки проєкту в сьогоднішньому розкладі · синхрон із Планером', open:()=>plFolderDaySheet(currentFolderKey) },
    planmonth: { emoji:'🗓', t:'План на місяць', d:'Календар точок проєкту + найближчі', open:()=>plFolderMonthSheet(currentFolderKey) },
  };
  let folderWidgets={}; // { folderKey: ['worktrack', ...] }
  const FWKEY='folder_widgets';
  function saveFolderWidgets(){ try{ const p=window.storage.set(FWKEY,JSON.stringify(folderWidgets),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function widgetsForFolder(key){
    // вбудовані (з folders[key].widgets) + додані вручну
    const built=(folders[key]&&folders[key].widgets||[]).map(w=>w.id);
    const added=folderWidgets[key]||[];
    // унікальні, у порядку: вбудовані, потім додані
    const seen={}; const out=[];
    built.concat(added).forEach(id=>{ if(!seen[id] && WIDGET_CATALOG[id]){ seen[id]=1; out.push(id); } });
    return out;
  }
  function addWidgetToFolder(key,id){
    if(!WIDGET_CATALOG[id]) return;
    if(!folderWidgets[key]) folderWidgets[key]=[];
    if(!folderWidgets[key].includes(id) && !((folders[key]&&folders[key].widgets||[]).some(w=>w.id===id))){
      folderWidgets[key].push(id); saveFolderWidgets();
    }
    renderFolder(key);
  }
  function removeWidgetFromFolder(key,id){
    if(folderWidgets[key]) folderWidgets[key]=folderWidgets[key].filter(x=>x!==id);
    saveFolderWidgets(); renderFolder(key);
  }

  function orderedFolderKeys(){
    // pinned first, keep order otherwise
    return order.slice().sort((a,b)=>((folders[b]&&folders[b].pinned?1:0)-(folders[a]&&folders[a].pinned?1:0)));
  }

  /* ===== РОЛІ ПАПОК: область / проєкт / сторінка ===== */
  const FOLDER_ROLES={
    area:    {n:'Область',  d:'Постійна сфера життя', e:'📁'},
    project: {n:'Проєкт',   d:'Має ціль, статус і дедлайн', e:'🚀'},
    page:    {n:'Сторінка', d:'Відкривається одразу як аркуш', e:'📄'},
  };
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
      if(b.type==='task'){ total++; if(b.done)done++; }
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
  // перший невиконаний пункт у дошках папки: {bkey, block, item} або null
  function folderNextStep(key){
    let found=null;
    const walk=(arr,bkey)=>{ (arr||[]).forEach(b=>{
      if(found||!b) return;
      if(b.type==='check'&&Array.isArray(b.items)){ const it=b.items.find(i=>i&&!i.done&&(i.text||'').trim()); if(it){found={bkey,block:b,item:it};return;} }
      if(Array.isArray(b.sections)){ b.sections.forEach(s=>{ if(found)return; if(s&&s.type==='check'&&Array.isArray(s.items)){ const it=s.items.find(i=>i&&!i.done&&(i.text||'').trim()); if(it)found={bkey,block:b,item:it}; } }); }
      if(!found&&Array.isArray(b.children)) walk(b.children,bkey);
    }); };
    try{ Object.keys(boards||{}).forEach(bk=>{ if(!found&&(bk===key||bk.indexOf(key+'__sp_')===0)) walk(boards[bk],bk); }); }catch(_){}
    return found;
  }
  function completeFolderNextStep(key){
    const nx=folderNextStep(key); if(!nx) return null;
    nx.item.done=true;
    try{ if(typeof saveBoard==='function') saveBoard(); }catch(_){}
    try{ if(typeof renderDashboard==='function') renderDashboard(); }catch(_){}
    return nx.item.text;
  }

  /* ===== вкладені папки (папка в папці) ===== */
  function childFolderKeys(parentKey){
    return orderedFolderKeys().filter(k=>folders[k] && (folders[k].parent||'')===(parentKey||''));
  }
  function topFolderKeys(){
    return orderedFolderKeys().filter(k=>folders[k] && !(folders[k].parent||''));
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
      // ЧИСТА ПАПКА: відкривається як Канал (стрічка + рядок вводу, 35-channel.js);
      // документ-редактор — звідти, тапом по запису або через «⋯»
      if(typeof goChannel==='function'){ goChannel(key); return; }
      goSpaceFor(key); return;
    }catch(e){ console.error('goFolder', key, e); flowAlert('Не вдалося відкрити папку: '+e.message); }
  }
  function goDebts(){ render(); show('scr-debts'); }
  function goFinance(){ finView='dash'; renderFinance(); show('scr-finance'); }
  function goEnvelopes(){ finView='envelopes'; renderFinance(); show('scr-finance'); }
  function goSpend(){ renderSpend(); show('scr-spend'); }
  let workOrigin='work';
  function goWork(){ workOrigin=currentFolderKey||'work'; renderWork(); show('scr-work'); }
  function goSpace(){ renderBoard(); show('scr-space'); }

