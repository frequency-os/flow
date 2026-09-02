
  /* приглушуємо службові попередження pdf.js (не впливають на читання) */
  (function(){
    try{
      const _w=console.warn, _e=console.error;
      const mute=s=>{ s=String(s||''); return s.indexOf('fake worker')>=0 || s.indexOf('workerSrc')>=0 || s.indexOf('Deprecated API')>=0; };
      console.warn=function(){ try{ if(mute(arguments[0])) return; }catch(_){ } return _w.apply(console,arguments); };
      console.error=function(){ try{ if(mute(arguments[0])) return; }catch(_){ } return _e.apply(console,arguments); };
    }catch(_){}
  })();
  /* ============ ХЕЛПЕРИ ДАТ: локальний час, не UTC ============
     toISOString() дає UTC: в Амстердамі між 00:00 і 02:00 «сьогодні» = вчора.
     Всюди, де треба «сьогодні/поточний місяць» — тільки ці функції. */
  function ymdLocal(d){ d = d instanceof Date ? d : new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function ymLocal(d){ return ymdLocal(d).slice(0,7); }
  window.ymdLocal = ymdLocal; window.ymLocal = ymLocal;

  /* Відмінювання за українськими правилами:
     pluralUk(1,'картка','картки','карток') → 'картка', pluralUk(5,…) → 'карток'.
     Одне місце на всю апку — раніше форми зашивались руками в кожному екрані. */
  function pluralUk(n, one, few, many){
    n = Math.abs(+n||0); const t = n%100, d = n%10;
    if(t>=11 && t<=14) return many;
    if(d===1) return one;
    if(d>=2 && d<=4) return few;
    return many;
  }
  window.pluralUk = pluralUk;

  /* ============ РЕЄСТР КЛЮЧІВ СХОВИЩА — єдине джерело правди ============
     Новий ключ додаєш ТУТ (і за потреби версію в SCHEMAS).
     Звідси беруться prefetchAll на старті та ALL_KEYS для бекапу.
     Раніше списки велись руками у 2 місцях і розійшлися: модуль «Робота»
     (work_sessions/work_cfg/work_extras/work_blocks) та канвас-простори
     взагалі не потрапляли в бекап. */
  window.FLOW_KEYS = [
    'ui_mode','ai_endpoint','ai_chat','ai_memory','ai_prompts',
    'folders_cfg','folders_order','folder_widgets','switcher_style',
    'spaces_map_v2','active_space_map_v2',
    'goals_data','values_state','wishes_board',
    'envelopes','debts','fin_ops','fin_recurring',
    'income_cards','fx_cfg','spend',
    'work_sessions','work_cfg','work_extras','work_blocks',
    'board','customboards','blockusage',
    'spaceview','spacewide','spacecanvas','spacecanvaszoom',
    'readerCfg',
    'patterns_chains','patterns_score','patterns_transform',
    'vision_v1','vault_cfg','custom_avatar_v1','diary_entries_v1','diary_insights_v1','diary_books_v1','upgrade_profile_v1',
    'lang_pref','i18n_content_cache'
  ];

  /* ═══════════════════════════════════════════════════════════════════
     I18N: перемикач мови UI (uk/en) + переклад контенту в dev-режимі
     ═══════════════════════════════════════════════════════════════════
     Підхід: не переписуємо кожну render-функцію на t('key'). Замість
     цього тримаємо словник фраз укр→eng (I18N_DICT) і після кожного
     рендеру проходимо по DOM, підміняючи ТОЧНІ збіги системних рядків.
     Це безпечно для контенту користувача (папки/нотатки) — їхній текст
     довільний і просто не матиме збігів у словнику.
     Розширення словника: дописуй пари в I18N_DICT нижче, нічого іншого
     міняти не треба — застосується автоматично при наступному проході. */
  (function(){
    function getLang(){ try{ return localStorage.getItem('lang_pref')||'uk'; }catch(_){ return 'uk'; } }
    function setLang(l){ try{ localStorage.setItem('lang_pref', l); }catch(_){} window.__flowLang=l; i18nApply(); document.dispatchEvent(new CustomEvent('flowlangchange',{detail:{lang:l}})); }
    window.__flowLang = getLang();
    window.flowLang = getLang;
    window.flowSetLang = setLang;

    // ---- словник: 'укр рядок' -> 'English string' -----------------
    // Наповнюється поступово, екран за екраном. Ключі — точний текст,
    // який реально є в DOM (без зайвих пробілів).
    const I18N_DICT = {
      // нижня навігація
      'Огляд':'Overview', 'Планер':'Planner', 'Гроші':'Money', 'Проєкти':'Projects', 'Ще':'More',
      // профіль / шторка налаштувань
      '✨ Відкрити Флоу':'✨ Open Flow', '⚙️ AI-проксі':'⚙️ AI proxy', '🌓 Змінити тему':'🌓 Switch theme',
      '⚙️ Всі налаштування':'⚙️ All settings', 'Гість':'Guest', 'Користувач':'User',
      // canvas bar (тайтли)
      'Вийти з повного екрана':'Exit fullscreen', 'Тапни, щоб перейти':'Tap to jump',
      'Вийти з полотна':'Exit canvas', 'Зменшити':'Zoom out', 'Скинути на 100%':'Reset to 100%',
      'Збільшити':'Zoom in', 'Вписати все':'Fit all', 'Зібрати все в стрічку':'Tidy into a row',
      'Стиль полотна':'Canvas style', 'Прилипання до сітки':'Snap to grid',
      // dev-режим
      'Вийти з режиму розробника?':'Exit developer mode?', '⚙️ Режим розробника':'⚙️ Developer mode',
      'Повернутись до звичайного Флоу.':'Return to normal Flow.', 'Вийти':'Exit', 'Увійти':'Enter',
      // загальні кнопки
      'Зберегти':'Save', 'Скасувати':'Cancel', 'Видалити':'Delete', 'Готово':'Done',
      'Редагувати':'Edit', 'Додати':'Add', 'Назад':'Back', 'Закрити':'Close',
      'Так':'Yes', 'Ні':'No', 'Підтвердити':'Confirm',
      // ── дашборд ──
      'твоя система вибору хвилі':'your wave-choice system', 'ЗАГАЛЬНИЙ ПРОГРЕС':'OVERALL PROGRESS',
      'КАРТА БАЖАНЬ':'WISH MAP', 'ПАПКИ':'FOLDERS', 'активних':'active', 'Налаштування':'Settings',
      // ── Планер ──
      'плани · горизонт · квадрати':'plans · horizon · squares', 'AI-асистент':'AI assistant',
      '📅 Плани':'📅 Plans', '🎯 Горизонт':'🎯 Horizon', 'День':'Day', 'Тиждень':'Week', 'Місяць':'Month',
      '📥 Без дня':'📥 No day', '+ задача':'+ task', '+ Нова задача':'+ New task',
      'Все має свій день ✨':'Everything has its day ✨',
      'Тапни день на карті — задача ляже туди ↓':'Tap a day on the map — the task lands there ↓',
      '🗺 Карта тижня':'🗺 Week map', '✅ По фокусах':'✅ By focus', 'Ревʼю тижня':'Weekly review', 'Почати':'Start',
      'Поки порожньо. Додай першу задачу тижня.':'Empty for now. Add the week\'s first task.',
      'Немає постійних блоків. Додай перший — розставиться одразу на весь місяць.':'No recurring blocks yet. Add one — it fills the whole month at once.',
      '🔒 Постійні блоки місяця':'🔒 Recurring monthly blocks', '+ додати шаблон':'+ add template',
      'Новий постійний блок':'New recurring block', 'Що робитимеш?':'What will you do?',
      'Дні тижня':'Days of week', '— без цілі —':'— no goal —', 'Ціль':'Goal', 'Скасувати':'Cancel',
      'Тап на день — відкриє розклад і форму додавання блоку. 🔒 — є закриті шаблонні блоки.':'Tap a day to open the schedule and add a block. 🔒 — recurring template blocks.',
      'Робочий день:':'Working day:', 'год/день · тисни ⚙':'h/day · tap ⚙', 'Вільно':'Free', 'Блоки':'Blocks',
      'Бюджет ·':'Budget ·', 'Налаштувати години дня':'Set day hours',
      // ── Фінанси ──
      'фінансовий центр':'financial center', 'курс офлайн':'rate offline',
      'ВІЛЬНО ДО ЗАРПЛАТИ':'FREE UNTIL PAYDAY', 'Дохід':'Income', 'Витрата':'Expense', 'Переказ':'Transfer',
      'Конверти':'Envelopes', 'КОНВЕРТИ':'ENVELOPES', 'ПЛАН МІСЯЦЯ':'MONTH PLAN', 'план місяця':'month plan',
      'Картка':'Card', 'головна':'main', 'ГОЛОВНА':'MAIN', 'Робота · ЗП':'Work · Salary',
      'Загальний баланс':'Total balance', 'Новий':'New', '‹ Папки':'‹ Folders',
    };

    // ---- другий рівень: окремі слова (дні тижня, місяці) --------------
    // Ці слова часто йдуть усередині складених рядків, які повністю
    // під I18N_DICT не підпадають (напр. "Тиждень · 27–2 сер",
    // "3 дн до 31.07"). Заміна йде по межах слова (юнікод), тож
    // випадковий збіг всередині довільного тексту користувача
    // малоймовірний — але саме для контенту користувача повний захист
    // дає лише те, що ця секція вмикається тільки коли lang_pref='en'
    // разом з рештою системного UI, а не в dev-перекладі контенту.
    const I18N_WORDS = [
      // дні тижня (короткі)
      ['Пн','Mon'],['Вт','Tue'],['Ср','Wed'],['Чт','Thu'],['Пт','Fri'],['Сб','Sat'],['Нд','Sun'],
      // дні тижня (повні)
      ['Понеділок','Monday'],['Вівторок','Tuesday'],['Середа','Wednesday'],['Четвер','Thursday'],
      ["П'ятниця",'Friday'],['Пятниця','Friday'],['Субота','Saturday'],['Неділя','Sunday'],
      // місяці (короткі, 3 літери)
      ['Січ','Jan'],['Лют','Feb'],['Бер','Mar'],['Кві','Apr'],['Тра','May'],['Чер','Jun'],
      ['Лип','Jul'],['Сер','Aug'],['Вер','Sep'],['Жов','Oct'],['Лис','Nov'],['Гру','Dec'],
      // місяці (повні, називний)
      ['Січень','January'],['Лютий','February'],['Березень','March'],['Квітень','April'],
      ['Травень','May'],['Червень','June'],['Липень','July'],['Серпень','August'],
      ['Вересень','September'],['Жовтень','October'],['Листопад','November'],['Грудень','December'],
      // місяці (родовий відмінок — «27 липня»)
      ['Січня','January'],['Лютого','February'],['Березня','March'],['Квітня','April'],
      ['Травня','May'],['Червня','June'],['Липня','July'],['Серпня','August'],
      ['Вересня','September'],['Жовтня','October'],['Листопада','November'],['Грудня','December'],
      // фінансова/планерна лексика всередині складених рядків
      ['Гроші','Money'],['карток','cards'],['картки','cards'],['картка','card'],
      ['конверти','envelopes'],['Конверти','Envelopes'],['задач','tasks'],['задачі','tasks'],
      ['задача','task'],['тижня','week'],['тижні','week'],['місяця','month'],['днів','days'],
      ['дні','days'],['дн','d'],
    ].sort((a,b)=>b[0].length-a[0].length); // довші рядки — першими, щоб не ламати коротшими підрядками

    function wordLevelTranslate(text){
      let out=text;
      for(let i=0;i<I18N_WORDS.length;i++){
        const uk=I18N_WORDS[i][0], en=I18N_WORDS[i][1];
        try{
          const re=new RegExp('(?<![\\p{L}\\p{N}])'+uk.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}\\p{N}])','gu');
          out = out.replace(re, en);
        }catch(_){}
      }
      return out;
    }

    // ═══ автопереклад того, чого нема у словнику (запасний варіант) ═══
    // Працює тільки для тексту ПОЗА зонами data-i18n-skip (контент
    // користувача — папки/сторінки/задачі/клієнти — вже позначені).
    // Кешується назавжди в localStorage, повторний виклик /translate
    // для того самого рядка більше не робиться.
    const UI_CACHE_KEY='i18n_ui_cache';
    function uiHash(s){ let h=0; for(let i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))|0; } return 'u'+h; }
    function uiCacheGet(){ try{ return JSON.parse(localStorage.getItem(UI_CACHE_KEY)||'{}'); }catch(_){ return {}; } }
    function uiCacheSet(m){ try{ localStorage.setItem(UI_CACHE_KEY, JSON.stringify(m)); }catch(_){} }
    const uiInFlight = new Set();
    const uiQueue = []; let uiActive = 0; const UI_MAX_CONCURRENT = 4;
    function uiPump(){
      while(uiActive<UI_MAX_CONCURRENT && uiQueue.length){
        const job=uiQueue.shift(); uiActive++;
        job().catch(()=>{}).finally(()=>{ uiActive--; uiPump(); });
      }
    }
    const HAS_CYR = /[а-яА-ЯіїєґІЇЄҐ]/;
    function autoTranslateNode(node, original){
      const cache=uiCacheGet(), key=uiHash(original);
      if(cache[key] && cache[key].src===original){
        try{ if(node.nodeValue && node.nodeValue.indexOf(original)>=0) node.nodeValue = node.nodeValue.replace(original, cache[key].en); }catch(_){}
        return;
      }
      if(uiInFlight.has(key)) return;
      uiInFlight.add(key);
      uiQueue.push(async ()=>{
        try{
          const ep=(typeof aiEndpoint==='function' ? aiEndpoint() : (window.AI_ENDPOINT||''));
          if(!ep) return;
          const r=await fetch(ep.replace(/\/$/,'')+'/translate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:original,target:'en'})});
          if(!r.ok) return;
          const data=await r.json();
          const en=(data&&data.text)?String(data.text):original;
          const c2=uiCacheGet(); c2[key]={src:original,en,ts:Date.now()}; uiCacheSet(c2);
          if(node.isConnected!==false){ try{ if(node.nodeValue && node.nodeValue.indexOf(original)>=0) node.nodeValue = node.nodeValue.replace(original, en); }catch(_){} }
        }finally{ uiInFlight.delete(key); }
      });
      uiPump();
    }

    // атрибути, які теж перекладаємо (title/placeholder/aria-label)
    function translateNode(node){
      if(node.nodeType===3){
        const t=node.nodeValue, key=t.trim();
        if(!key) return;
        if(I18N_DICT[key]!==undefined){ node.nodeValue = t.replace(key, I18N_DICT[key]); return; }
        const wl = wordLevelTranslate(t);
        if(wl!==t){ node.nodeValue = wl; return; }
        if(HAS_CYR.test(key)) autoTranslateNode(node, key);
        return;
      }
      if(node.nodeType!==1) return;
      if(node.hasAttribute && node.hasAttribute('data-i18n-skip')) return; // явно виключені зони (контент користувача)
      ['title','placeholder','aria-label'].forEach(a=>{
        const v=node.getAttribute && node.getAttribute(a);
        if(v && I18N_DICT[v]!==undefined) node.setAttribute(a, I18N_DICT[v]);
      });
      for(let c=node.firstChild;c;c=c.nextSibling) translateNode(c);
    }
    function i18nApply(){
      if(getLang()!=='en') return;
      try{ translateNode(document.body); }catch(_){}
    }
    window.i18nApply = i18nApply;

    // після кожної зміни DOM (рендери екранів) — тихо доперекладаємо
    let raf=null;
    const mo = new MutationObserver(()=>{
      if(getLang()!=='en') return;
      if(raf) return;
      raf = requestAnimationFrame(()=>{ raf=null; i18nApply(); });
    });
    document.addEventListener('DOMContentLoaded', function(){
      try{ mo.observe(document.body, {childList:true, subtree:true, characterData:true}); }catch(_){}
      i18nApply();
    });
  })();

  /* ═══ DEV-РЕЖИМ: переклад КОНТЕНТУ КОРИСТУВАЧА (папки/нотатки/тощо) ═══
     На відміну від i18nApply() вище (тільки системний UI), це для
     довільного тексту, який пише сам користувач. Працює лише коли
     ai_dev==='1' (той самий Dev-режим/Нокс) І lang_pref==='en'.
     Кешується у storage за хешем оригіналу — повторно не перекладаємо. */
  (function(){
    function contentTranslateOn(){
      try{ return localStorage.getItem('ai_dev')==='1' && localStorage.getItem('lang_pref')==='en' && localStorage.getItem('dev_translate_content')==='1'; }catch(_){ return false; }
    }
    window.flowContentTranslateOn = contentTranslateOn;
    function hash(s){ let h=0; for(let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))|0; } return 'h'+h; }
    function cacheGet(){ try{ return JSON.parse(localStorage.getItem('i18n_content_cache')||'{}'); }catch(_){ return {}; } }
    function cacheSet(map){ try{ localStorage.setItem('i18n_content_cache', JSON.stringify(map)); }catch(_){} }

    // Публічний хелпер: переклад одного шматка тексту користувача з кешем.
    // Використання в render-функціях (тільки там, де показуємо контент
    // користувача): const label = await flowTranslateContent(folder.title);
    window.flowTranslateContent = async function(text){
      const src = (text==null?'':String(text));
      if(!src.trim() || !contentTranslateOn()) return src;
      const cache = cacheGet();
      const key = hash(src);
      if(cache[key] && cache[key].src===src) return cache[key].en;
      try{
        const ep = (typeof aiEndpoint==='function' ? aiEndpoint() : (window.AI_ENDPOINT||''));
        if(!ep) return src;
        const r = await fetch(ep.replace(/\/$/,'')+'/translate', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ text: src, target:'en' })
        });
        if(!r.ok) return src;
        const data = await r.json();
        const en = (data && data.text) ? String(data.text) : src;
        cache[key] = { src, en, ts: Date.now() };
        cacheSet(cache);
        return en;
      }catch(_){ return src; }
    };
  })();

  /* ============ ГЛОБАЛЬНИЙ ЛОВЕЦЬ ПОМИЛОК ============
     У Telegram WebView немає консолі — помилки зникали безслідно.
     Тримаємо останні 30 у window.__flowErrors; подивитись: flowErrors(). */
  (function(){
    window.__flowErrors = [];
    function push(kind,msg,src,line){
      try{
        window.__flowErrors.push({ t:Date.now(), kind, msg:String(msg==null?'':msg).slice(0,300), src:src?String(src).slice(-60):'', line:line||0 });
        if(window.__flowErrors.length>30) window.__flowErrors.shift();
        document.dispatchEvent(new CustomEvent('flowerror',{ detail:window.__flowErrors[window.__flowErrors.length-1] }));
      }catch(_){}
    }
    window.addEventListener('error', e=>push('error', e && e.message, e && e.filename, e && e.lineno));
    window.addEventListener('unhandledrejection', e=>push('promise', (e && e.reason && e.reason.message) || (e && e.reason)));
    window.flowErrors = function(){ return window.__flowErrors.slice(); };
  })();

  /* ============ TELEGRAM WEBAPP INIT ============ */
  (function(){
    try{
      const tg = window.Telegram && window.Telegram.WebApp;
      if(!tg) return;
      tg.ready();
      tg.expand();
      try{ tg.disableVerticalSwipes && tg.disableVerticalSwipes(); }catch(_){}
      const applyVH = ()=>{
        const h = tg.viewportStableHeight || tg.viewportHeight || window.innerHeight;
        document.documentElement.style.setProperty('--tg-viewport-stable-height', h+'px');
      };
      applyVH();
      tg.onEvent && tg.onEvent('viewportChanged', applyVH);
      window.addEventListener('resize', applyVH);
    }catch(_){}
  })();

