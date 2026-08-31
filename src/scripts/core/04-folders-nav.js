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

  /* ===== 🕶️ VAULT: приховані папки за PIN =====
     У коді та сховищі НЕМає самого PIN — лише SHA-256(salt+pin).
     vaultOpen живе тільки в памʼяті сесії: закрив/згорнув апку — все знову приховано. */
  const VAULT_KEY='vault_cfg';
  let vaultCfg=null;      // {s:'salt', h:'sha256hex'}
  let vaultOpen=false;    // сесійний стан, НЕ зберігається
  function saveVaultCfg(){ try{ const p=window.storage.set(VAULT_KEY,JSON.stringify(vaultCfg||{}),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  async function vaultHash(salt,pin){
    const msg=String(salt)+':'+String(pin);
    try{
      if(window.crypto&&crypto.subtle){
        const buf=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
        return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
      }
    }catch(_){}
    // fallback (слабший, лише якщо WebCrypto недоступний)
    let h1=5381,h2=52711;
    for(let i=0;i<msg.length;i++){ const c=msg.charCodeAt(i); h1=(h1*33+c)>>>0; h2=(h2*31+c)>>>0; }
    let out=(h1.toString(16)+h2.toString(16));
    for(let r=0;r<6;r++){ let x=0; for(let i=0;i<out.length;i++){ x=(x*131+out.charCodeAt(i))>>>0; } out+=x.toString(16); }
    return 'fb_'+out;
  }
  function vaultRandSalt(){
    try{ const a=new Uint8Array(12); crypto.getRandomValues(a); return Array.from(a).map(b=>b.toString(16).padStart(2,'0')).join(''); }
    catch(_){ return 's'+Date.now().toString(36)+Math.random().toString(36).slice(2,10); }
  }
  function vaultLock(){ if(!vaultOpen) return; vaultOpen=false;
    try{ renderDashboard(); }catch(_){}
    try{ if(typeof renderProjects==='function') renderProjects(); }catch(_){}
    // якщо зараз відкрито Агенцію — виходимо на Проєкти
    try{ const scr=document.querySelector('.screen.active');
      if(scr&&(scr.id==='scr-agency'||scr.id==='scr-client')&&typeof goProjects==='function') goProjects(); }catch(_){}
  }
  // автолок: згорнув Mini App / переключив вкладку — приховані папки зникають
  try{ document.addEventListener('visibilitychange',()=>{ if(document.hidden) vaultLock(); }); }catch(_){}

  // PIN-шторка. mode: 'unlock' | 'setup' | 'change'
  function vaultPinSheet(mode,onOk){
    const old=document.getElementById('vaultSheet'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='imodal'; ov.id='vaultSheet';
    const isSetup=(mode==='setup');
    ov.innerHTML=`<div class="im-in">
      <div class="im-grip"></div>
      <div class="im-title">${isSetup?'Створи код доступу':'Код доступу'}</div>
      ${isSetup?'<div class="im-label">Цим кодом відкриватимуться приховані папки. Він ніде не зберігається у відкритому вигляді.</div>':''}
      <input class="im-input vlt-in1" type="password" inputmode="numeric" autocomplete="off" placeholder="${isSetup?'Новий код (4+ цифр)':'Введи код'}">
      ${isSetup?'<input class="im-input vlt-in2" type="password" inputmode="numeric" autocomplete="off" placeholder="Повтори код" style="margin-top:8px">':''}
      <div class="im-btns">
        <button type="button" class="im-cancel">Скасувати</button>
        <button type="button" class="im-ok">${isSetup?'Створити':'Відкрити'}</button>
      </div>
    </div>`;
    document.body.appendChild(ov);
    const in1=ov.querySelector('.vlt-in1'), in2=ov.querySelector('.vlt-in2');
    setTimeout(()=>{ try{ in1.focus(); }catch(_){} },60);
    const close=()=>ov.remove();
    ov.querySelector('.im-cancel').onclick=close;
    ov.onclick=e=>{ if(e.target===ov) close(); };
    const shake=()=>{ const box=ov.querySelector('.im-in'); box.style.animation='none'; void box.offsetWidth; box.style.animation='vshake .3s'; try{ window.platform.haptic('error'); }catch(_){} };
    const submit=async()=>{
      const v1=(in1.value||'').trim();
      if(isSetup){
        const v2=(in2.value||'').trim();
        if(v1.length<4){ shake(); return; }
        if(v1!==v2){ shake(); in2.value=''; return; }
        const s=vaultRandSalt();
        vaultCfg={ s, h: await vaultHash(s,v1) };
        saveVaultCfg(); close();
        vaultOpen=true; try{ renderDashboard(); }catch(_){}
        try{ if(typeof renderProjects==='function') renderProjects(); }catch(_){}
        try{ window.platform.haptic('success'); }catch(_){}
        if(onOk) onOk();
        flowAlert('Код створено. Довге утримання на «Нова папка» — відкрити/сховати приховані папки.\nУ меню папки (коли розблоковано) зʼявився пункт «Сховати папку».');
        return;
      }
      if(!vaultCfg||!vaultCfg.h){ close(); return; }
      const h=await vaultHash(vaultCfg.s,v1);
      if(h===vaultCfg.h){
        close(); vaultOpen=true;
        try{ renderDashboard(); }catch(_){}
        try{ if(typeof renderProjects==='function') renderProjects(); }catch(_){}
        try{ window.platform.haptic('success'); }catch(_){}
        if(onOk) onOk();
      } else { shake(); in1.value=''; }
    };
    ov.querySelector('.im-ok').onclick=submit;
    in1.onkeydown=e=>{ if(e.key==='Enter'){ if(isSetup&&in2){ in2.focus(); } else submit(); } };
    if(in2) in2.onkeydown=e=>{ if(e.key==='Enter') submit(); };
  }

  // Довге утримання на картці «Нова папка» — єдиний непомітний вхід у Vault
  function vaultAttachLongPress(el){
    let t=null, fired=false;
    const start=(e)=>{
      fired=false;
      t=setTimeout(()=>{
        fired=true;
        try{ window.platform.haptic('medium'); }catch(_){}
        if(vaultOpen){ vaultLock(); return; }
        if(vaultCfg&&vaultCfg.h) vaultPinSheet('unlock');
        else vaultPinSheet('setup');
      },650);
    };
    const stop=()=>{ if(t){ clearTimeout(t); t=null; } };
    el.addEventListener('pointerdown',start);
    el.addEventListener('pointerup',stop);
    el.addEventListener('pointerleave',stop);
    el.addEventListener('pointercancel',stop);
    el.addEventListener('click',(e)=>{ if(fired){ e.stopImmediatePropagation(); e.preventDefault(); fired=false; } },true);
    el.addEventListener('contextmenu',(e)=>{ e.preventDefault(); },false);
  }
  // фільтр видимості: приховані папки видно лише коли vault відкрито
  function folderVisible(k){ const f=folders[k]; return !!f && !(f.secret && !vaultOpen); }

  // persist folder customizations (photo, color, emoji, name, layout, pinned) + custom folders + order
  function saveFolders(){
    try{
      const cfg={};
      Object.keys(folders).forEach(k=>{
        const f=folders[k];
        cfg[k]={c:f.c,emoji:f.emoji,icon:f.icon||folderIconFor(f.emoji),iconSet:f.iconSet?1:0,name:f.name,photo:f.photo||'',photoPos:f.photoPos||null,flayout:f.flayout||'a',pinned:!!f.pinned,custom:!!f.custom,pct:f.pct||0,parent:f.parent||'',role:f.role||'area',status:f.status||'',due:f.due||'',secret:!!f.secret};
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
    income:    { emoji:'💳', t:'Доходи · Картки', d:'Робота · ЗП · проєкти · додатковий дохід', open:()=>goIncome() },
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
      // 🕶️ прихована папка при заблокованому vault — спершу код
      if(folders[key] && folders[key].secret && !vaultOpen){ vaultPinSheet('unlock',()=>goFolder(key)); return; }
      currentFolderKey=key;
      // роль «Сторінка»: одразу відкриваємо аркуш цієї папки
      if(folders[key] && folders[key].role==='page'){ goSpaceFor(key); return; }
      if(key==='fin'){ finView='dash'; renderFinance(); show('scr-finance'); return; }
      if(key==='val'){ renderValues(); show('scr-values'); return; }
      if(key==='work'){ goWork(); return; }
      if(key==='pat'){ goPatterns(); return; }
      if(key===VISION_FKEY){ goVision(); return; }
      if(key===AGENCY_KEY){ goAgency(); return; }
      // ЧИСТА ПАПКА: завжди відкриваємо простір напряму, без проміжного екрана вибору дошки
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

