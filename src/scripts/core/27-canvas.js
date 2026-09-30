  /* поповер: емодзі + колір для папки/сторінки */
  function openCardStyle(id, anchor){
    document.querySelectorAll('.cardstyle-pop').forEach(p=>p.remove());
    const b=getBlock(id); if(!b) return;
    const EMOJI=['📄','📁','🎬','🎥','📸','🔥','💡','📚','💼','🎯','⭐','🚀','💰','🎨','🏆','📊','🗂️','❤️','🧠','⚡'];
    const COLORS=['#7c9cf5','#5b8def','#34c77b','#e8843c','#c77dff','#ff6b9d','#4ecdc4','#f0b429','#ff6b6f','#9b8cff'];
    const pop=document.createElement('div'); pop.className='cardstyle-pop';
    pop.innerHTML=`
      <div class="csp-sec">Іконка</div>
      <div class="csp-emoji">${EMOJI.map(e=>`<button data-e="${e}" class="${b.emoji===e?'on':''}">${e}</button>`).join('')}
        <button data-e="" class="csp-reset ${!b.emoji?'on':''}" title="Стандартна">⟲</button></div>
      <div class="csp-sec">Колір</div>
      <div class="csp-colors">${COLORS.map(c=>`<button data-c="${c}" style="background:${c}" class="${(b.color||'')===c?'on':''}"></button>`).join('')}</div>`;
    document.body.appendChild(pop);
    const r=anchor.getBoundingClientRect();
    pop.style.left=Math.max(10,Math.min(r.left, window.innerWidth-pop.offsetWidth-10))+'px';
    pop.style.top=(r.bottom+8)+'px';
    pop.querySelectorAll('[data-e]').forEach(btn=>btn.onclick=ev=>{ ev.stopPropagation(); b.emoji=btn.dataset.e||null; saveBoard(); pop.remove(); renderBoard(); });
    pop.querySelectorAll('[data-c]').forEach(btn=>btn.onclick=ev=>{ ev.stopPropagation(); b.color=btn.dataset.c; saveBoard(); pop.remove(); renderBoard(); });
    const close=ev=>{ if(!pop.contains(ev.target)){ pop.remove(); document.removeEventListener('pointerdown',close); } };
    setTimeout(()=>document.addEventListener('pointerdown',close),50);
  }

  function escAttr(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

  /* ---- load ---- */
  // борги старого формату → ops[]. memOnly — лише в памʼяті (екран боргів без ops падає),
  // коли реєстр міграцій відклав записи до довіреного читання
  function migrate(memOnly){
    let ch=false;
    debtItems.forEach(i=>{ if(!i.ops){ i.ops=[{id:i.id,type:'borrow',amount:i.amount||0,date:i.date,note:i.note}]; delete i.amount;delete i.date;delete i.note; ch=true; } });
    if(ch && !memOnly) debtSave();
  }
  // приводить блоки до коректної форми (доповнює відсутні поля за типом)
  function normalizeBlocks(arr){
    if(!Array.isArray(arr)) return [];
    return arr.filter(b=>b&&b.type).map(b=>{
      const t=b.type;
      if(t==='check'){ if(!Array.isArray(b.items)) b.items=[{id:Date.now()+Math.random(),text:'',done:false}];
        b.items=b.items.map(i=>({id:i&&i.id||Date.now()+Math.random(),text:i&&i.text||'',done:!!(i&&i.done)})); }
      if(t==='list'){ if(!Array.isArray(b.items)) b.items=[{id:Date.now()+Math.random(),text:''}];
        b.items=b.items.map(i=>({id:i&&i.id||Date.now()+Math.random(),text:i&&i.text||''})); }
      if(t==='numlist'){ if(!Array.isArray(b.items)) b.items=['']; }
      if(t==='table'){ if(!Array.isArray(b.cols)) b.cols=['Назва','Значення'];
        if(!Array.isArray(b.rows)) b.rows=[b.cols.map(()=>'')];
        b.rows=b.rows.map(r=>Array.isArray(r)?b.cols.map((_,i)=>r[i]||''):b.cols.map(()=>'')); }
      if(t==='link'){ if(typeof b.url!=='string') b.url=''; if(typeof b.label!=='string') b.label=''; }
      if(t==='group'||t==='page'){ b.children=normalizeBlocks(Array.isArray(b.children)?b.children:[]); if(typeof b.open!=='boolean') b.open=true; }
      if(t==='progress'){ b.value=Math.max(0,Math.min(100,parseInt(b.value)||0)); }
      if(t==='calendar'){ if(!b.marks||typeof b.marks!=='object') b.marks={}; if(!b.ym) b.ym=ymLocal(); }
      if(t==='task'){ if(!b.prio) b.prio='none'; if(!Array.isArray(b.subs)) b.subs=[];
        b.subs=b.subs.map(s=>({id:s&&s.id||Date.now()+Math.random(),text:s&&s.text||'',done:!!(s&&s.done)})); }
      if(t==='callout'){ if(!b.tone) b.tone='tip'; }
      if(t==='quote'){ if(!b.qstyle) b.qstyle='line'; }
      if((t==='list') && !b.lstyle) b.lstyle='bullet';
      if(t==='progress' && !b.pview) b.pview='bar';
      if(!b.id) b.id=Date.now()+Math.random();
      return b;
    });
  }

  /* ── Переїзд із Простору (14.09.2026) ──
     Загальний Простір (коренева дошка 'all' і її простори 'all__sp_*') видалено.
     Якщо там щось лежало — переносимо у звичайну папку «Вхідні» (f_inbox):
     блоки кореня → головна дошка папки, групи «Вхідні» розкриваємо (їхні діти
     стають записами), додаткові простори кореня → теми папки, обкладинка — за ними.
     Порожні джерела просто видаляємо. Прапорець — у реєстрі MIGRATIONS_ONCE. */
  function inboxMigrateOnce(){
    var srcKeys=Object.keys(boards||{}).filter(function(k){ return k==='all'||k.indexOf('all__sp_')===0; });
    var hasBlocks=srcKeys.some(function(k){ return Array.isArray(boards[k])&&boards[k].length; });
    if(hasBlocks){
      ensureInboxFolder();
      srcKeys.forEach(function(k){
        var flat=[];
        (boards[k]||[]).forEach(function(b){ if(!b) return;
          if(b.type==='group'&&b.title===INBOX_TITLE){ (b.children||[]).forEach(function(c){ if(c) flat.push(c); }); }
          else flat.push(b); });
        if(!flat.length) return;
        var dst = k==='all' ? INBOX_FKEY : INBOX_FKEY+'__sp_'+k.slice('all__sp_'.length);
        boards[dst]=(boards[dst]||[]).concat(flat);
      });
      try{
        var extra=(spacesMap['__root__']||[]).filter(function(s){ return s&&s.id!=='main'; });
        if(extra.length){ spacesMap[INBOX_FKEY]=(spacesMap[INBOX_FKEY]||[]).concat(extra.map(function(s){ return Object.assign({},s); })); }
      }catch(_){}
      try{
        var c=JSON.parse(localStorage.getItem('flowPgCovers')||'{}')||{};
        if(c.all){ c[INBOX_FKEY]=c[INBOX_FKEY]||c.all; delete c.all;
          localStorage.setItem('flowPgCovers',JSON.stringify(c));
          var p=window.storage&&window.storage.set&&window.storage.set('flowPgCovers',JSON.stringify(c),false); if(p&&p.catch)p.catch(function(){}); }
      }catch(_){}
      console.log('[Flow] Простір перенесено у «Вхідні»:', srcKeys.join(', '));
    }
    srcKeys.forEach(function(k){ delete boards[k]; });
    var hadRoot=false;
    try{ hadRoot=!!(spacesMap['__root__']||activeSpaceMap['__root__']); }catch(_){}
    if(hadRoot){ try{ delete spacesMap['__root__']; delete activeSpaceMap['__root__']; saveSpacesMeta(); }catch(_){} }
    // Пишемо лише те, що справді змінилось: порожній прохід раніше клав у сховище
    // (і в хмару) дошки зі свіжою міткою — на новому пристрої це '{}' поверх усього.
    if(srcKeys.length) saveBoard();
    return true;
  }
  /* ── Одноразове прибирання після видалення Агенції (04.09.2026) ──
     Її папка, дошки, конверти, конфіг Vault і база документів клієнтів більше
     не мають власника в коді — прибираємо зі сховища. Сховані папки НЕ
     видаляємо: прапорець secret просто перестав читатися (applyFolderCfgRaw),
     тож вони знову видимі на Огляді; saveFolders() нижче закріплює це і в хмарі.
     Прапорець — у реєстрі MIGRATIONS_ONCE. */
  function agencyPurgeOnce(ctx){
    var FK='f_agsk_seed';
    var hadAgency=false;
    Object.keys(folders).forEach(function(k){
      var f=folders[k]; if(!f) return;
      if(k===FK || f.parent===FK){
        try{ if(f.photo && window.photoDel) window.photoDel(f.photo); }catch(_){}
        delete folders[k]; hadAgency=true;
      }
    });
    for(var i=order.length-1;i>=0;i--){ if(!folders[order[i]]) order.splice(i,1); }
    try{ if(folderWidgets && folderWidgets[FK]) delete folderWidgets[FK]; }catch(_){}
    // дошки: головна + додаткові простори папки
    var hadBoards=false;
    Object.keys(boards).forEach(function(k){ if(k===FK || k.indexOf(FK+'__sp_')===0){ delete boards[k]; hadBoards=true; } });
    // конверти агенції (Податки/Резерв, Reinvest)
    var hadEnv=false;
    for(var j=envelopes.length-1;j>=0;j--){ var e=envelopes[j];
      if(e && (/^env_agsk_/.test(String(e.id||'')) || e.link===FK)){ envelopes.splice(j,1); hadEnv=true; } }
    // мета просторів у контексті агенції
    try{ if(typeof spacesMap!=='undefined' && spacesMap && spacesMap[FK]){ delete spacesMap[FK];
      if(typeof activeSpaceMap!=='undefined' && activeSpaceMap) delete activeSpaceMap[FK];
      if(typeof saveSpacesMeta==='function') saveSpacesMeta(); } }catch(_){}
    // знімає secret з усіх папок і в хмарі (під запобіжником) — лише якщо є що знімати
    if(hadAgency || /"secret"\s*:/.test(String(ctx&&ctx.rawFolders||''))) saveFolders({auto:true});
    if(hadBoards) saveBoard();
    if(hadEnv) saveEnvelopes();
    // конфіг Vault, база документів клієнтів, старий прапорець очищення
    try{ var p=window.storage.delete('vault_cfg'); if(p&&p.catch) p.catch(function(){}); }catch(_){}
    try{ indexedDB.deleteDatabase('flow_docs'); }catch(_){}
    try{ localStorage.removeItem('flowapp_agsk_cleaned_v2'); }catch(_){}
    if(hadAgency) console.log('[Flow] Агенцію прибрано зі сховища');
    return true;
  }
  /* ── ОЧИЩЕННЯ: «Простір» видалено повністю разом із даними (липень 2026).
     Прибираємо: кореневі дошки ('all' + 'all__sp_*'), додаткові простори
     кореня та колись перенесені папки «🧩 Простір» ('f_space_*'). */
  function migSpacePurge(){
    let changed=false;
    Object.keys(boards).forEach(k=>{
      if(k==='all'){ if(Array.isArray(boards[k])&&boards[k].length){ boards[k]=[]; changed=true; } }
      else if(k.indexOf('all__sp_')===0 || k.indexOf('f_space_')===0){ delete boards[k]; changed=true; }
    });
    Object.keys(folders).forEach(k=>{
      if(k.indexOf('f_space_')===0){ delete folders[k]; changed=true; }
    });
    for(let i=order.length-1;i>=0;i--){
      if(String(order[i]).indexOf('f_space_')===0){ order.splice(i,1); changed=true; }
    }
    try{
      if(typeof spacesMap!=='undefined' && spacesMap && spacesMap['__root__']){
        delete spacesMap['__root__'];
        if(typeof activeSpaceMap!=='undefined' && activeSpaceMap) delete activeSpaceMap['__root__'];
        if(typeof saveSpacesMeta==='function') saveSpacesMeta();
        changed=true;
      }
    }catch(_){}
    if(changed){ try{ saveFolders({auto:true}); }catch(_){} try{ saveBoard(); }catch(_){} }
    return true;
  }
  /* ── ОЧИЩЕННЯ 2: старі віджети та проєктні блоки (перенесені зі Простору)
     видаляємо з усіх папок — на їхнє місце прийшли нові. «Відлік» лишається. */
  function migLegacyWidgets(){
    const DEAD={progress:1,fin:1,envelope:1,calendar:1,wpult:1,wstack:1,wpipe:1,wtline:1,
      wportal:1,wplanday:1,wplanmonth:1,project:1,kanban:1,contacts:1,caseline:1,festival:1};
    let removed=0;
    const strip=(arr)=>{
      if(!Array.isArray(arr))return;
      for(let i=arr.length-1;i>=0;i--){
        const b=arr[i];
        if(b&&DEAD[b.type]){ arr.splice(i,1); removed++; continue; }
        if(b&&Array.isArray(b.children)) strip(b.children);
      }
    };
    Object.keys(boards).forEach(k=>strip(boards[k]));
    if(removed){ try{ saveBoard(); }catch(_){} }
    return true;
  }
  // папка «Патерни» відкривається одразу як екран — її простір не використовується, чистимо залишки
  function migBoardPat(){
    if(boards && boards['pat']){ delete boards['pat']; saveBoard(); }
  }
  // «ручний десктопний режим» видалено: у сховищі (і хмарі) лишаємо '0', але пишемо лише
  // коли там ще не '0' — раніше це йшло при КОЖНОМУ старті зі свіжою міткою (05-spaces.js)
  // (не prefSet: сирі ключі цього пристрою 05-spaces.js якраз прибирає — їм і лишатись порожніми)
  function migForceLayoutOff(){
    ['forcedesktop','forcemobile'].forEach(k=>{
      let cur=null; try{ cur=window.storage.getLocal(k); }catch(_){}
      if(cur!=='0'){ const p=window.storage.set(k,'0',false); if(p&&p.catch)p.catch(()=>{}); }
    });
  }

  /* ═══════ РЕЄСТР РАЗОВИХ МІГРАЦІЙ — єдиний список, у порядку виконання ═══════
     Раніше ~10 переїздів жили по різних файлах, кожен сам вирішував, коли
     запускатись і коли ставити прапорець. Звідси два класи багів:
       • міграція йшла, коли дані ще не прочитані (новий пристрій + хмара мовчить):
         порожня заглушка лягала в сховище зі свіжою міткою і через хмару
         затирала справжні дані на всіх пристроях;
       • прапорець ставився навіть після винятку чи «порожнього» проходу —
         і міграція вже ніколи не бачила справжніх даних.
     Правила реєстру:
       1) runMigrations не робить НІЧОГО, поки window.sbDataTrusted() ≠ true
          (сесію перевірено і хмара відповіла, або входу нема взагалі). Прапорців
          теж не чіпає — наступний load() спробує знову.
       2) Прапорець ставиться ЛИШЕ після успішного run(): не кинув виняток і не
          повернув false (false = «ще нема на чому працювати, спробуй пізніше»).
       3) Папки — тільки saveFolders({auto:true}); писати — лише коли щось змінилось.
       4) Імена прапорців НЕ міняти: за ними пристрої знають, що вже зроблено —
          нове імʼя означає повторний прогін на всіх пристроях.
     every:true — без прапорця: ідемпотентна дочистка, що йде при кожному
     довіреному load() і пише лише за реальної зміни.
     Поза реєстром (навмисно): перехід теми 01.09 (05-spaces.js — мусить іти до
     першого малювання, чіпає лише тему пристрою), планер blocks→blocksByDay
     (10-planner.js, лише в памʼяті при читанні). Схеми SCHEMAS (02-storage.js)
     підвищуються при читанні лише в памʼяті, а в сховище їх закріплює schema_stamp. */
  const MIGRATIONS_ONCE = [
    // версії схем SCHEMAS (02-storage.js): закріпити в локальних копіях без __sv
    { id:'schema_stamp',    every:true,                            run: ()=>{ if(window.storage.restampLocal) window.storage.restampLocal(); } },
    { id:'space_purge',     flag:'space_purge_v1',                 run: migSpacePurge },
    { id:'legacy_widgets',  flag:'legacy_widgets_purge_v1',        run: migLegacyWidgets },
    { id:'board_pat',       every:true,                            run: migBoardPat },
    { id:'force_layout',    every:true,                            run: migForceLayoutOff },
    { id:'spends_to_fin',   every:true,                            run: ()=>migrateSpendsToFin() },   // 19-spending.js
    // спершу гаманець — йому потрібні СТАРІ картки й курси зі сховища (ctx), які ensureCards() затирає.
    // Порожня книга → false: на новому пристрої операції ще можуть не дійти
    { id:'wallet',          flag:WALLET_MIG_FLAG,                  run: ctx=>migrateToWallet(ctx.rawCards, ctx.rawFx).ops>0 },   // 08-finance.js
    { id:'folder_photos',   every:true,                            run: ()=>migrateFolderPhotosOnce() },   // async, у фоні
    { id:'wish_photos',     every:true,                            run: ()=>migrateWishPhotosOnce() },     // 06-wishes.js, async
    { id:'seed_folders',    flag:'flowapp_seedfolders_removed_v1', run: removeSystemSeedFoldersOnce },
    { id:'agency_purge',    flag:'flowapp_agency_purged_v1',       run: agencyPurgeOnce },
    { id:'space_to_inbox',  flag:'flowapp_space_removed_v1',       run: inboxMigrateOnce },
    { id:'inbox_to_chat',   flag:'flowapp_inbox_chat_v1',          run: ()=>chatsMigrateInboxOnce() },    // 36-chats.js
    { id:'debt_ops',        every:true,                            run: ()=>migrate() },
  ];
  let migDeferred=false;   // останній load() відклав міграції (дані не підтверджені)
  function runMigrations(ctx){
    const rep={ at:Date.now(), trusted:false, ran:[], skipped:[], failed:[] };
    rep.trusted = (typeof window.sbDataTrusted==='function') ? window.sbDataTrusted() : true;
    try{ window.__migReport=rep; }catch(_){}
    if(!rep.trusted){
      migDeferred=true;
      try{ console.warn('[Flow] міграції відкладено: дані цієї сесії ще не підтверджені сховищем'); }catch(_){}
      return false;
    }
    migDeferred=false;
    MIGRATIONS_ONCE.forEach(m=>{
      if(m.flag){
        let done=true;   // прапорець не читається — не ризикуємо повторним прогоном
        try{ done=!!localStorage.getItem(m.flag); }catch(_){}
        if(done){ rep.skipped.push(m.id); return; }
      }
      const fail=e=>{ rep.failed.push(m.id); try{ console.error('[Flow] міграція '+m.id+' не вдалась — повторю наступного разу', e); }catch(_){} };
      const finish=ok=>{
        if(ok===false){ rep.skipped.push(m.id); return; }
        if(m.flag){ try{ localStorage.setItem(m.flag,'1'); }catch(_){} }
        rep.ran.push(m.id);
      };
      try{
        const r=m.run(ctx||{});
        if(r && typeof r.then==='function') r.then(finish, fail);
        else finish(r);
      }catch(e){ fail(e); }
    });
    return true;
  }
  try{ window.__flowMigDeferred=()=>migDeferred; }catch(_){}
  // Без входу довіра настає, щойно перевірку сесії завершено (02-storage.js шле
  // 'flowsbready'). Якщо стартовий load() устиг раніше і відклав міграції — доганяємо.
  // Із сесією load() і так повториться після відповіді хмари.
  document.addEventListener('flowsbready', ()=>{
    try{ if(migDeferred && window.sbDataTrusted && window.sbDataTrusted()) load().catch(()=>{}); }catch(_){}
  });

  // ── merge конфігурації папок (спільна для миттєвого й повного завантаження) ──
  function applyFolderCfgRaw(rawf){
    const cfg=rawf?JSON.parse(rawf):null;
    if(cfg&&typeof cfg==='object'){
      Object.keys(cfg).forEach(k=>{
        const c=cfg[k];
        // Папки, збережені до появи іконок, поля icon не мають — підбираємо
        // його з емодзі на льоту. У сховище воно потрапить при першому ж
        // saveFolders(); доти емодзі лишається єдиним джерелом правди.
        const ic=c.icon||folderIconFor(c.emoji);
        if(folders[k]){ Object.assign(folders[k],{c:c.c,emoji:c.emoji,icon:ic,iconSet:c.iconSet?1:0,name:c.name,photo:c.photo||'',photoPos:c.photoPos||null,flayout:c.flayout||'a',pinned:!!c.pinned,pct:c.pct||folders[k].pct||0,parent:c.parent||'',role:c.role||'area',status:c.status||'',due:c.due||''}); }
        else if(c.custom){ folders[k]={key:k,c:c.c,emoji:c.emoji,icon:ic,iconSet:c.iconSet?1:0,name:c.name,pct:c.pct||0,photo:c.photo||'',photoPos:c.photoPos||null,flayout:c.flayout||'a',pinned:!!c.pinned,custom:true,parent:c.parent||'',widgets:[],role:c.role||'area',status:c.status||'',due:c.due||''}; }
      });
    }
  }
  function applyFolderOrderRaw(rawo){
    const ord=rawo?JSON.parse(rawo):null;
    if(Array.isArray(ord)&&ord.length){ order=ord.filter(k=>folders[k]); Object.keys(folders).forEach(k=>{ if(!order.includes(k)) order.push(k); }); }
  }
  /* ── ЗАМОК НА load() ──
     load() смикають із шести місць: старт сторінки, підтвердження Google-сесії,
     повернення з OAuth, звірка свіжості (кожні 2 хв і при фокусі) та екран «Ще».
     Досі вони могли йти внахлест — два проходи одночасно читали сховище і
     застосовували результат наввипередки. Тепер другий виклик не стартує новий
     прохід, а чекає на той, що вже йде. */
  let loadInFlight = null;
  async function load(){
    if(loadInFlight) return loadInFlight;
    loadInFlight = loadOnce().finally(()=>{ loadInFlight = null; });
    return loadInFlight;
  }
  async function loadOnce(){
    /* Знімки лежать в IndexedDB (PhotoDB) — вичитуємо їх у памʼятний кеш ДО
       першого рендеру, інакше картки блиснуть без фото. Читання швидке:
       одна транзакція, десятки записів. Якщо IndexedDB нема — photoWarm
       поверне false, і все працюватиме на старих data-URL. */
    try{ await window.photoWarm(); }catch(_){}
    // ⚡ МИТТЄВИЙ ПЕРШИЙ РЕНДЕР: папки з локального кешу ДО очікування хмари.
    //    Прибирає «порожні папки на пару секунд» при старті. Повний load нижче все оновить.
    try{
      if(window.storage.getLocal){
        const rawf=window.storage.getLocal(FKEY); if(rawf) applyFolderCfgRaw(rawf);
        const rawch=window.storage.getLocal('chats_v1'); if(rawch) applyChatsRaw(rawch);
        const rawo=window.storage.getLocal(FOKEY); if(rawo) applyFolderOrderRaw(rawo);
        renderDashboard();
      }
    }catch(e){ console.warn('fast-render skip', e); }
    try{ window.__load=load; }catch(_){}
    /* Native: підняти дані з Preferences ДО будь-якого читання, інакше апка
       відрендериться порожньою, якщо iOS вичистив localStorage. */
    try{
      if(window.FLOW_NATIVE && window.storage.nativeBoot){
        const nb=await window.storage.nativeBoot();
        if(nb.restored) console.warn('storage: відновлено з Preferences', nb.restored, 'ключів');
      }
    }catch(e){ console.error('nativeBoot',e); }
    try{ if(window.storage.prefetchAll){ await window.storage.prefetchAll(window.FLOW_KEYS.slice()); } }catch(_){}
    // 🚀 ОДИН пакет паралельних запитів замість ~30 послідовних await один за
    // одним — усі мережеві звернення летять одночасно, а не в чергу. Логіка
    // застосування значень нижче лишається в тому самому порядку, що й раніше.
    const __RAW = await (async ()=>{
      const keys=[DEBT_KEY,SKEY,PAT_CKEY,PAT_SKEY,PAT_TKEY,BKEY,RDR_CFG_KEY,
        FKEY,FOKEY,FWKEY,GKEY,VZKEY,CUSTOM_AV_KEY,ENVKEY,FINOPKEY,'chats_v1',
        WORKKEY,WORKCFGKEY,WKEXTRAKEY,WKBLKKEY,RECKEY,CARDKEY,'fx_cfg',DIARY_KEY,DIAINS_KEY,DIABOOKS_KEY];   // fx_cfg лишився тільки як джерело курсу для міграції
      const pairs=await Promise.all(keys.map(k=>
        window.storage.get(k,false).then(
          r=>[k,(r&&typeof r.value!=='undefined')?r.value:null],
          ()=>[k,null]
        )
      ));
      const m={}; pairs.forEach(([k,v])=>{ m[k]=v;
        // Запобіжник: непорожній рядок, що НЕ парситься — це пошкоджені дані.
        // Позначаємо ключ, щоб наступний saveX() не затер добру копію порожнечею.
        if(typeof v==='string' && v.length){ try{ JSON.parse(v); }catch(_){ (window.__storeCorrupt=window.__storeCorrupt||new Set()).add(k); } }
      }); return m;
    })();
    // ці читання незалежні одне від одного — теж ідуть паралельно, а не по черзі
    // aiPrivLoad — згода й закриті від AI розділи (37-ai-privacy.js): так вони синкаються між пристроями
    try{ await Promise.all([loadValues(), loadWishes(), loadWishPrice(), loadHomeGlass(), aiPrivLoad()]); applyHomeGlass(); }catch(_){}
    /* SYNC-2: запамʼятати, які ключі справді прочитано — автозаписи в решту не підуть,
       а ручні правки в них чекатимуть звірки з хмарою (02-storage.js, storeMarkRead).
       Саме тут, після останнього await: далі прочитане синхронно лягає в памʼять.
       Разом із __RAW — ключі, які дочитують loadValues/loadWishes/loadWishPrice/loadHomeGlass. */
    try{ if(window.storeMarkRead) window.storeMarkRead(__RAW, [VAL_KEY, WISH_KEY, WISH_ACT_KEY, WPRICE_KEY, HOMEGLASS_KEY, 'ai_privacy_v1']); }catch(_){}
    /* Усе нижче до кінця load() — синхронне застосування прочитаного разом з
       міграціями й прибираннями. Їхні записи — автоматичні: у ключ, який не
       прочитався (сховище мовчало), вони не підуть (SYNC-2, storeAuto). */
    const endAuto = window.storeAutoBegin ? window.storeAutoBegin() : function(){};
    try{

    try{ const raw=__RAW[DEBT_KEY]; debtItems=raw?JSON.parse(raw):[]; }
    catch{ debtItems=[]; }
    try{ const raw2=__RAW[SKEY]; spends=raw2?JSON.parse(raw2):[]; }
    catch{ spends=[]; }
    try{ const rawp=__RAW[PAT_CKEY]; patChains=rawp?JSON.parse(rawp):[]; if(!Array.isArray(patChains))patChains=[]; }
    catch{ patChains=[]; }
    try{ const rawps=__RAW[PAT_SKEY]; const ps=rawps?JSON.parse(rawps):null; if(ps&&typeof ps==='object')patScore={win:+ps.win||0,lose:+ps.lose||0}; }
    catch{ patScore={win:0,lose:0}; }
    try{ const rawpt=__RAW[PAT_TKEY]; patTrans=rawpt?JSON.parse(rawpt):[]; if(!Array.isArray(patTrans))patTrans=[]; }
    catch{ patTrans=[]; }
    try{
      const raw3=__RAW[BKEY];
      const parsed=raw3?JSON.parse(raw3):null;
      if(Array.isArray(parsed)) boards={all:parsed};        // migrate old single board
      else if(parsed&&typeof parsed==='object') boards=parsed;
      else boards={};
      // нормалізуємо всі блоки, щоб старі/неповні дані не ламали рендер
      Object.keys(boards).forEach(k=>{ if(Array.isArray(boards[k])) boards[k]=normalizeBlocks(boards[k]); });
      // залишки простору «Патерни» ('pat') прибирає реєстр міграцій (board_pat) — після довіреного читання
    }
    catch{ boards={}; }
    try{ rescheduleAllReminders(); checkDueReminders(); }catch(_){}
    try{ plRescheduleReminders(); plCheckDueReminders(); }catch(_){}
    try{ const rawc=__RAW[RDR_CFG_KEY]; const c=rawc?JSON.parse(rawc):null; if(c&&typeof c==='object') Object.assign(rdrCfg,c); }
    catch{}
    // folder customizations + custom folders + order
    try{
      applyFolderCfgRaw(__RAW[FKEY]);
      applyFolderOrderRaw(__RAW[FOKEY]);
      const raww=__RAW[FWKEY];
      const fw=raww?JSON.parse(raww):null; if(fw&&typeof fw==='object') folderWidgets=fw;
    }catch(e){ /* перше завантаження — сховища ще нема, це нормально */ }
    /* Чи можна вважати, що папки цієї сесії справді прочитані? Так, якщо конфіг
       прийшов — або якщо сховище чесно сказало «порожньо» і ми впевнені, що це
       не збій зв'язку (sbDataTrusted). Доти жоден автоматичний запис не має
       права чіпати папки: інакше заводська заглушка поїде в хмару. */
    try{
      const gotCfg = !!__RAW[FKEY];
      const trustedEmpty = (typeof window.sbDataTrusted==='function') ? window.sbDataTrusted() : true;
      markFoldersLoaded(gotCfg || trustedEmpty);
      if(!gotCfg && !trustedEmpty){
        console.warn('[Flow] папки не прочитано (сховище мовчить) — автозапис заблоковано');
        // Порожній Огляд без пояснення виглядає як «усе пропало». Кажемо прямо,
        // що це збій зв'язку і дані на місці — і що чіпати нічого не треба.
        try{ if(typeof window.showQuotaBanner==='function')
          window.showQuotaBanner('Сховище не відповіло, тому папки не показані. Нічого не видалено — дані чекають. Перевір зв\'язок і онови сторінку.',
                                 'Папки не завантажились'); }catch(_){}
      }
    }catch(_){}
    try{ applyChatsRaw(__RAW['chats_v1']); }catch(e){ console.error('chats load',e); }
    // goals data
    try{
      const rawg=__RAW[GKEY];
      const gd=rawg?JSON.parse(rawg):null;
      if(gd&&typeof gd==='object'){ goalsData=Object.assign(goalsData,gd); if(!Array.isArray(goalsData.goals))goalsData.goals=[];
        if(!goalsData.planner||typeof goalsData.planner!=='object') goalsData.planner={scope:'week',tasks:[],blocks:[]};
        if(!Array.isArray(goalsData.planner.tasks)) goalsData.planner.tasks=[];
        if(!Array.isArray(goalsData.planner.blocks)) goalsData.planner.blocks=[];
        if(!goalsData.planner.scope) goalsData.planner.scope='week';
        if(typeof goalsData.pointA!=='string') goalsData.pointA='';
        if(typeof goalsData.pointB!=='string') goalsData.pointB='';
        if(goalsData.pathMode!=='flow'&&goalsData.pathMode!=='bridge') goalsData.pathMode='flow';
        if(goalsData.wishTheme!=='classic'&&goalsData.wishTheme!=='ai') goalsData.wishTheme='classic';
      }
    }catch(_){}
    // vision
    try{
      const rawv=__RAW[VZKEY];
      const vd=rawv?JSON.parse(rawv):null;
      if(vd&&typeof vd==='object') vzData=Object.assign(vzData,vd);
      vzNorm();
    }catch(_){}
    // власна іконка профілю
    try{
      const rawca=__RAW[CUSTOM_AV_KEY];
      if(rawca) customAvatar=rawca;
      try{ if(typeof window.dsbFillUser==='function') window.dsbFillUser(); }catch(_){}
      try{ if(typeof window.renderAccount==='function') window.renderAccount(); }catch(_){}
    }catch(_){}
    // envelopes
    try{
      const rawe=__RAW[ENVKEY];
      const ev=rawe?JSON.parse(rawe):null;
      if(Array.isArray(ev)) envelopes=ev;
    }catch(_){}
    try{ const raw=__RAW[FINOPKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) finOps=d; }catch(_){}
    try{ const raw=__RAW[WORKKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) workSessions=d; }catch(_){}
    try{ const raw=__RAW[WORKCFGKEY]; const c=raw?JSON.parse(raw):null; if(c&&typeof c==='object'){ if(c.rate) workRate=c.rate; if(c.cur) workCur=c.cur; if(c.payday) workPayday=c.payday; if(c.postedSal&&typeof c.postedSal==='object') workPostedSal=c.postedSal; if(c.cardId) workCardId=c.cardId; } }catch(_){}
    try{ const raw=__RAW[WKEXTRAKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) workExtras=d; }catch(_){}
    try{ const raw=__RAW[WKBLKKEY]; const d=raw?JSON.parse(raw):null; if(d&&typeof d==='object') wkBlocks=Object.assign(wkBlocks,d); }catch(_){}
    try{ const raw=__RAW[RECKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) recurring=d; }catch(_){}
    try{ const raw=__RAW[CARDKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) cards=d; }catch(_){}
    try{ const raw=__RAW[DIARY_KEY]; const d=raw?JSON.parse(raw):null; if(d&&typeof d==='object') diaryEntries=d; }catch(_){}
    try{ const raw=__RAW[DIAINS_KEY]; const d=raw?JSON.parse(raw):null; if(d&&typeof d==='object') diaInsights=Object.assign({mood:{},weeks:{}},d); }catch(_){}
    try{ const raw=__RAW[DIABOOKS_KEY]; const d=raw?JSON.parse(raw):null; if(d&&typeof d==='object'&&Array.isArray(d.books)) diaBooks=Object.assign({books:[],entries:{}},d); }catch(_){}
    /* Усі разові переїзди даних — у реєстрі MIGRATIONS_ONCE (вище) і лише після
       довіреного читання: коли сховище/хмара мовчать, runMigrations нічого не пише
       і прапорців не ставить — спробує наступний load(). */
    const migOk = runMigrations({ rawCards:__RAW[CARDKEY], rawFx:__RAW['fx_cfg'], rawFolders:__RAW[FKEY] });
    // гаманець потрібен екранам завжди, але поки дані не підтверджені — лише в памʼяті:
    // інакше заводський гаманець ляже в сховище (і хмару) поверх справжнього з назвою/кольором
    try{ ensureCards(migOk ? null : {memOnly:true}); }catch(_){}
    if(!migOk){ try{ migrate(true); }catch(e){ console.error('migrate',e); } }
    syncBlocks();
    try{ debtRender(); }catch(e){ console.error('render',e); }
    try{ chatsInit(); }catch(e){ console.error('chatsInit',e); }
    try{ renderDashboard(); }catch(e){ console.error('dashboard',e); }
    try{ if(window.uiMode==='lite') goPlanner(); }catch(_){}
    try{ updateSummaryBg(); }catch(_){}
    } finally { endAuto(); }
  }
  try{ applyHomeWidgets(); }catch(_){}
  try{ applyTheme(); }catch(_){}

  load().catch(e=>{
    console.error('load failed',e);
    try{ renderDashboard(); }catch(_){}
  });

  /* ---------- клавіатура: ховаємо бар + тримаємо активне поле у видимій зоні ---------- */
  (function(){
    const vv = window.visualViewport;
    const FIELD = 'input,textarea,[contenteditable="true"]';

    function isField(el){ return el && el.matches && el.matches(FIELD); }

    // визначаємо відкриту клавіатуру за різницею висот в'юпорта
    function kbHeight(){
      if(!vv) return 0;
      return Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    }
    function syncKb(){
      const open = kbHeight() > 120 && isField(document.activeElement);
      document.body.classList.toggle('kb-open', open);
      if(open) ensureVisible(document.activeElement);
    }

    // скрол активного поля так, щоб воно було над клавіатурою
    function ensureVisible(el){
      if(!el) return;
      requestAnimationFrame(()=>{
        const r = el.getBoundingClientRect();
        const safeBottom = (vv ? vv.height : window.innerHeight) - 24;
        if(r.bottom > safeBottom){
          window.scrollBy({top: r.bottom - safeBottom + 16, behavior:'smooth'});
        } else if(r.top < 80){
          window.scrollBy({top: r.top - 80, behavior:'smooth'});
        }
      });
    }

    if(vv){
      vv.addEventListener('resize', syncKb);
      vv.addEventListener('scroll', syncKb);
    }
    document.addEventListener('focusin', e=>{
      if(isField(e.target)){
        document.body.classList.add('kb-open');
        setTimeout(()=>ensureVisible(e.target), 300);
      }
    });
    document.addEventListener('focusout', e=>{
      // невелика затримка: фокус може перейти на інше поле
      setTimeout(()=>{
        if(!isField(document.activeElement)) document.body.classList.remove('kb-open');
      }, 120);
    });
  })();


  /* ── «Візія» більше НЕ створюється автоматично: користувач сам вирішує,
     які папки йому потрібні. Ключ лишається — екран Візії відкривається
     через goVision() з будь-якої власної папки, просто без нав'язаного
     системного фолдера на Огляді. ── */
  const VISION_FKEY='f_vision_seed';
  // одноразове прибирання: якщо «Патерни»/«Візія» вже встигли створитись
  // раніше (старі акаунти) — видаляємо їх, звільняючи Огляд під власні папки.
  /* Переїзд наявних знімків: усе, що лежить у folders_cfg як `data:…`,
     переносимо в PhotoDB, а в конфігу лишаємо посилання. Робиться тихо, у
     фоні, по одному запису; якщо IndexedDB недоступний — просто нічого не
     стається і фото лишаються там, де були. */
  async function migrateFolderPhotosOnce(){
    try{
      if(!window.PhotoDB || !window.PhotoDB.available()) return;
      const keys=Object.keys(folders||{}).filter(k=>{
        const p=folders[k] && folders[k].photo;
        return p && String(p).slice(0,5)==='data:';
      });
      if(!keys.length) return;
      for(const k of keys){
        const ref=await window.photoPut('ph_'+k, folders[k].photo);
        if(ref && String(ref).slice(0,4)==='idb:') folders[k].photo=ref;
      }
      saveFolders({auto:true});
      try{ renderDashboard(); }catch(_){}
      console.log('[Flow] знімків перенесено в PhotoDB:', keys.length);
    }catch(e){ console.error('migrateFolderPhotos', e); }
  }
  // прапорець — у реєстрі MIGRATIONS_ONCE (ставиться лише після успішного проходу)
  function removeSystemSeedFoldersOnce(){
    var changed=false;
    ['pat', VISION_FKEY].forEach(function(k){
      if(folders && folders[k]){ delete folders[k]; changed=true; }
      var i=order.indexOf(k); if(i>=0){ order.splice(i,1); changed=true; }
    });
    if(changed) saveFolders({auto:true});
    return true;
  }

