  /* ============ STORAGE: localStorage кеш + Capacitor Preferences + Supabase + версіонування ============ */

  /* ── Дочистка IndexedDB після «Скинути до заводських» ──
     deleteDatabase не проходить, поки живі зʼєднання (PhotoDB/BookDB
     тримають свої постійно) — тому скидання лише ставить прапорець і
     перезапускає сторінку, а СПРАВЖНЄ видалення робимо тут: на самому
     старті, до того, як будь-хто встиг відкрити базу. Запити open,
     видані пізніше, за специфікацією стають у чергу ПІСЛЯ delete —
     тож модулі просто отримають свіжі порожні бази. */
  (function(){
    const FLAG='__flow_wipe_idb__';
    try{
      if(!localStorage.getItem(FLAG)) return;
      localStorage.removeItem(FLAG);
      ['flow_photos','flow_books','flow_docs'].forEach(n=>{
        try{ indexedDB.deleteDatabase(n); }catch(_){}
      });
    }catch(_){}
  })();

  (function(){
    /* Telegram CloudStorage вирізано 04.09.2026: хмара тепер — Supabase (нижче),
       локальний кеш — localStorage, на native — ще й Capacitor Preferences. */
    const LP = 'flowapp_';
    window.__flowSync = { state:'idle', last:0, pending:0, cloud:false, warmed:false };

    function setSync(state){ window.__flowSync.state=state; try{ document.dispatchEvent(new CustomEvent('flowsync',{detail:window.__flowSync})); }catch(_){} }
    try{ window.__setSync = setSync; }catch(_){}
    /* Обгортка локальної копії: _v — мітка часу запису, _m — позначка «ще не
       звірено з хмарою акаунта» ('u' — записано, коли ключ не прочитався;
       'g' — записано гостем). Звірку робить storage.get у шарі Supabase (sbReconcile).
       Порядок полів сталий (_v, _m, d): localMeta читає їх з початку рядка, не
       розбираючи всю дошку. */
    function wrap(value, v, m){
      const ts = (typeof v==='number') ? v : Date.now();
      return JSON.stringify(m ? { _v: ts, _m: m, d: value } : { _v: ts, d: value });
    }
    function unwrap(raw){
      if(raw==null) return null;
      try{ const o=JSON.parse(raw); if(o && typeof o==='object' && '_v' in o && 'd' in o) return { v:o._v, m:o._m||'', w:true, value:(typeof o.d==='string'?o.d:JSON.stringify(o.d)) }; }catch(_){}
      return { v:0, m:'', w:false, value:raw };
    }

    /* ===== МІГРАЦІЇ СХЕМИ ДАНИХ =====
       Призначення: коли формат даних модуля змінюється, старі дані юзера
       плавно оновлюються під новий код, замість того щоб ламатись.
       Як працює: кожен ключ може мати актуальну версію в SCHEMAS.
       Дані несуть свою версію в полі __sv. При читанні, якщо __sv старіша —
       проганяємо через ланцюжок правил MIGRATIONS до актуальної.
       Щоб додати міграцію в майбутньому: підніми число в SCHEMAS і додай
       функцію-правило у MIGRATIONS[ключ][нова_версія].  ============ */

    // актуальна версія схеми для ключів (відсутні тут = версія 0, без міграцій)
    const SCHEMAS = {
      envelopes: 1,
      debts: 1,
      goals_data: 1,
      work_sessions: 1,
      spend: 1,
    };

    // правила підвищення: MIGRATIONS[key][toVersion](data) -> data
    // приклад: конверти v0 -> v1 додають поля created та archived
    const MIGRATIONS = {
      envelopes: {
        1: (arr)=>{
          if(!Array.isArray(arr)) return arr;
          return arr.map(e=>{
            if(e && typeof e==='object'){
              if(!('created' in e)) e.created = Date.now();   // не було дати — ставимо поточну
              if(!('archived' in e)) e.archived = false;       // не було прапорця — активний
            }
            return e;
          });
        },
      },
    };

    // витягнути службову версію схеми з розпарсених даних
    function readSv(parsed){
      if(parsed && typeof parsed==='object' && !Array.isArray(parsed) && typeof parsed.__sv==='number') return parsed.__sv;
      // для масивів та обʼєктів без __sv вважаємо версією 0
      return 0;
    }
    // прогнати дані через ланцюжок міграцій до актуальної версії ключа
    // приймає вже розпарсений JSON, повертає {data, changed}
    function migrateParsed(key, parsed){
      const target = SCHEMAS[key] || 0;
      if(!target) return { data: parsed, changed:false };
      let cur = readSv(parsed);
      if(cur >= target) return { data: parsed, changed:false };
      let data = parsed;
      // якщо дані обгорнуті як {__sv, d:...} — розгортаємо payload для правил
      let payload = (data && typeof data==='object' && '__sv' in data && 'd' in data) ? data.d : data;
      const rules = MIGRATIONS[key] || {};
      for(let v=cur+1; v<=target; v++){
        if(typeof rules[v]==='function'){ try{ payload = rules[v](payload); }catch(_){} }
      }
      return { data: payload, changed:true, version: target };
    }
    // позначити дані версією схеми перед збереженням (якщо ключ версіонований)
    function stampSv(key, valueStr){
      const target = SCHEMAS[key] || 0;
      if(!target) return valueStr; // не версіонований ключ — лишаємо як є
      try{
        const parsed = JSON.parse(valueStr);
        // зберігаємо версію поряд з даними, не псуючи структуру:
        // для масивів обгортаємо у {__sv, d}, для обʼєктів додаємо __sv
        if(Array.isArray(parsed)) return JSON.stringify({ __sv: target, d: parsed });
        if(parsed && typeof parsed==='object'){ parsed.__sv = target; return JSON.stringify(parsed); }
      }catch(_){}
      return valueStr;
    }
    // розгорнути дані для модуля (прибрати службову обгортку __sv/d)
    function unstampSv(valueStr){
      try{
        const parsed = JSON.parse(valueStr);
        if(parsed && typeof parsed==='object' && '__sv' in parsed && 'd' in parsed) return JSON.stringify(parsed.d);
        if(parsed && typeof parsed==='object' && '__sv' in parsed){ const c=Object.assign({},parsed); delete c.__sv; return JSON.stringify(c); }
      }catch(_){}
      return valueStr;
    }
    function lcGet(key){ try{ return localStorage.getItem(LP+key); }catch(_){ return null; } }
    // визначити саме помилку переповнення (різні движки називають по-різному)
    function isQuotaErr(e){
      return e && (e.code===22 || e.code===1014 ||
        e.name==='QuotaExceededError' || e.name==='NS_ERROR_DOM_QUOTA_REACHED');
    }
    // ключі, які можна безпечно скинути при переповненні (кеш/тимчасові, не дані користувача)
    function purgeDisposable(exceptKey){
      let freed=0;
      try{
        const drop=[];
        for(let i=0;i<localStorage.length;i++){
          const k=localStorage.key(i);
          if(!k || k.indexOf(LP)!==0) continue;
          const short=k.slice(LP.length);
          if(LP+short===LP+exceptKey) continue;
          // евристика: тимчасові/кешові ключі
          if(/(^|_)(cache|tmp|temp|draft|preview|thumb|_bk|_bak|backup)/i.test(short)) drop.push(k);
        }
        drop.forEach(k=>{ try{ localStorage.removeItem(k); freed++; }catch(_){} });
      }catch(_){}
      return freed;
    }
    function lcSet(key,raw){
      /* Скидання вже стирає сховище (flowFactoryReset): фоновий load(), що
         доробляється після звірки з хмарою, не має дописати туди нічого —
         інакше після «Стерти все» частина даних пережила б стирання. */
      if(window.__flowWriteLock) return false;
      try{ localStorage.setItem(LP+key,raw); npWrite(key,raw); return true; }
      catch(e){
        if(isQuotaErr(e)){
          // спроба врятувати запис: скинути кеш і повторити один раз
          const freed=purgeDisposable(key);
          if(freed){ try{ localStorage.setItem(LP+key,raw); npWrite(key,raw); return true; }catch(_){} }
          /* localStorage переповнений — але на native Preferences ще може
             прийняти запис, тож дані не втрачені. Пишемо туди в будь-якому разі. */
          npWrite(key,raw);
          // не вдалось — сигналимо назовні (банер + індикатор), дані врятує хмара (chunked)
          try{ window.__flowSync.quota=true; }catch(_){}
          try{ if(typeof window.showQuotaBanner==='function') window.showQuotaBanner(); }catch(_){}
          try{ setSync('error'); }catch(_){}
          return false;
        }
        return false;
      }
    }
    function lcDel(key){ try{ localStorage.removeItem(LP+key); }catch(_){} npDel(key); }

    /* ═══════════ NATIVE-ДЗЕРКАЛО (Capacitor Preferences) ═══════════
       Навіщо: у WKWebView localStorage — це кеш, який iOS має право вичистити
       при нестачі місця на пристрої. Для життєвої ОС це означає втратити все
       разом. Preferences (UserDefaults) живе в контейнері застосунку, потрапляє
       в резервну копію і не чиститься системою.

       Чому дзеркало, а не заміна: уся апка читає сховище СИНХРОННО в десятках
       місць, а Preferences — асинхронний. Переписати всі читання на async —
       це переламати застосунок. Тому localStorage лишається швидким кешем для
       читання, а Preferences — джерелом істини для виживання:
         запис  → localStorage негайно + Preferences з дебаунсом
         старт  → якщо localStorage порожній/старіший, піднімаємо з Preferences
       Значення зберігаються вже обгорнутими (_v), тож порівняння версій
       працює так само, як із хмарою. */
    const NP = (function(){
      try{
        const C = window.Capacitor;
        const p = C && C.Plugins && C.Plugins.Preferences;
        const native = !!(C && (C.isNativePlatform ? C.isNativePlatform() : C.isNative));
        return (native && p) ? p : null;
      }catch(_){ return null; }
    })();
    const npTimers = {};
    let npFails = 0;

    /* lcSet визначено вище за NP, тому звертаємось через геттер: якщо запис
       трапиться до ініціалізації константи, отримаємо null, а не виняток. */
    function npReady(){ try{ return NP; }catch(_){ return null; } }

    function npWrite(key, raw){
      const P = npReady(); if(!P) return;
      clearTimeout(npTimers[key]);
      npTimers[key] = setTimeout(function(){
        Promise.resolve()
          .then(function(){ return P.set({ key: LP+key, value: raw }); })
          .then(function(){ npFails = 0; })
          .catch(function(){
            /* Тиха відмова тут небезпечна: людина думає, що дані в безпеці.
               Після кількох поспіль — кажемо прямо. */
            npFails++;
            if(npFails === 3){
              try{ window.__flowSync.nativeFail = true; }catch(_){}
              try{ if(typeof plToast==='function') plToast('⚠️ Не вдається зберегти дані на пристрій — зроби експорт у файл'); }catch(_){}
            }
          });
      }, 400);
    }
    function npDel(key){
      const P = npReady(); if(!P) return;
      clearTimeout(npTimers[key]);
      try{ P.remove({ key: LP+key }); }catch(_){}
    }
    /* ── Скидання до заводських на native (знахідка APP-2, 10.10.2026) ──
       wipeLocal у flowFactoryReset чистить лише localStorage, а npHydrate на
       наступному старті піднімав з Preferences усе стерте назад: «Стерти все»
       на iPhone нічого не стирало. Тому скидання стирає й нативну копію — усі
       flowapp_*, разом зі службовими ___seeded / ___owner — і чекає відповіді.
       NP_WIPED — одноразова мітка «щойно було скидання» для npHydrate. Це сирий
       ключ localStorage без префікса flowapp_: у Preferences (а отже й у хмару,
       й у бекап) він не потрапляє, тож воскреснути звідти не може. Ставимо її
       ДО стирання: обірветься воно посередині — наступний старт дотре. */
    const NP_WIPED = '__flow_wipe_np__';
    async function npWipeAll(){
      const P = npReady();
      if(!P) return { native:false, removed:0, left:0 };
      try{ localStorage.setItem(NP_WIPED, '1'); }catch(_){}
      // відкладені записи дзеркала (дебаунс 400 мс) інакше доїхали б ПІСЛЯ стирання
      Object.keys(npTimers).forEach(function(k){ clearTimeout(npTimers[k]); delete npTimers[k]; });
      const own = function(all){ return (all && all.keys ? all.keys : []).filter(function(k){ return k.indexOf(LP)===0; }); };
      let removed = 0, left = -1;   // -1 — Preferences навіть не відповів, скільки лишилось
      try{
        const keys = own(await P.keys());
        await Promise.all(keys.map(function(k){
          return Promise.resolve().then(function(){ return P.remove({ key:k }); }).then(function(){ removed++; }, function(){});
        }));
        left = own(await P.keys()).length;
      }catch(_){}
      return { native:true, removed, left };
    }
    /* Підйом при старті: Preferences → localStorage. Перезаписуємо лише коли
       локального значення немає або воно старіше — щоб не відкотити зміни,
       зроблені за цей запуск. */
    async function npHydrate(){
      const NP = npReady();
      if(!NP) return { restored:0, checked:0 };
      /* Перший старт після скидання: нічого не піднімаємо, а що лишилось у
         Preferences (скидання не дочекалось, iOS відмовив) — дотираємо. Мітку
         знімаємо, лише коли там справді порожньо, інакше наступний старт
         повторить. Далі npSeed засіє Preferences уже новим, порожнім станом. */
      let wiped = false;
      try{ wiped = localStorage.getItem(NP_WIPED)==='1'; }catch(_){}
      if(wiped){
        const w = await npWipeAll();
        if(w.left===0){ try{ localStorage.removeItem(NP_WIPED); }catch(_){} }
        return { restored:0, checked:0, wiped:w.removed };
      }
      let restored = 0, checked = 0;
      try{
        const all = await NP.keys();
        const keys = (all && all.keys ? all.keys : []).filter(function(k){ return k.indexOf(LP)===0; });
        for(const full of keys){
          const short = full.slice(LP.length);
          checked++;
          try{
            const got = await NP.get({ key: full });
            const nRaw = got && got.value;
            if(nRaw == null) continue;
            const l = unwrap(lcGet(short));
            const n = unwrap(nRaw);
            if(!l || n.v > l.v){ lcSet(short, nRaw); restored++; }
          }catch(_){}
        }
      }catch(_){}
      return { restored, checked };
    }
    /* Перший запуск native після веб-версії: усе, що вже лежить у
       localStorage, треба один раз перелити в Preferences, інакше перша ж
       чистка кешу з'їсть дані, які ніколи там не були. */
    async function npSeed(){
      const NP = npReady();
      if(!NP) return 0;
      let seeded = 0;
      try{
        const done = await NP.get({ key: LP+'__seeded' });
        if(done && done.value === '1') return 0;
        const keys = (window.FLOW_KEYS || []).slice();
        for(const k of keys){
          const raw = lcGet(k);
          if(raw == null) continue;
          try{ await NP.set({ key: LP+k, value: raw }); seeded++; }catch(_){}
        }
        await NP.set({ key: LP+'__seeded', value: '1' });
      }catch(_){}
      return seeded;
    }
    window.storage = {
      /* Native-довговічність. nativeBoot() треба викликати ОДИН раз на старті,
         до першого рендеру: спершу піднімає дані з Preferences (якщо система
         вичистила localStorage), потім одноразово засіває Preferences тим, що
         вже було локально (перехід з веб-версії). */
      async nativeBoot(){
        const h = await npHydrate();
        const s = await npSeed();
        return { restored:h.restored, checked:h.checked, seeded:s, wiped:h.wiped||0, native: !!npReady() };
      },
      /* Скидання до заводських (flowFactoryReset): стерти нативну копію й
         поставити мітку для наступного старту. На web/Mac — нічого (native:false). */
      nativeWipe(){ return npWipeAll(); },
      /* обробити значення на виході: мігрувати якщо треба, віддати модулю чисті дані.
         Приймає рядок ЯК ЛЕЖИТЬ у сховищі (з __sv). Читання більше НІЧОГО НЕ ПИШЕ.
         Раніше сюди приходив уже розгорнутий рядок без __sv — версія завжди
         читалась як 0, і КОЖНЕ читання envelopes/debts/goals_data/work_sessions/
         spend переписувало ключ зі свіжою міткою (навіть коли хмара мовчить):
         локальна копія «новішала» і при звірці перемагала правки з інших
         пристроїв. Закріпити нову версію в сховищі — справа restampLocal(),
         яку кличе реєстр міграцій лише після довіреного читання. */
      _out(key, storedStr){
        const target = SCHEMAS[key] || 0;
        if(!target) return unstampSv(storedStr); // не версіонований — як є
        let parsed; try{ parsed = JSON.parse(storedStr); }catch(_){ return storedStr; }
        const m = migrateParsed(key, parsed);
        if(!m.changed) return unstampSv(storedStr);
        return unstampSv(stampSv(key, JSON.stringify(m.data))); // модулю — чисті дані без __sv
      },
      /* Дописати актуальну версію схеми в локальні копії, які ще без неї.
         Кличе реєстр MIGRATIONS_ONCE (27-canvas.js) після довіреного читання.
         Мітку _v лишаємо ТІЄЮ САМОЮ: це той самий запис у новій формі, а не
         свіжа правка — інакше він перебив би новіші дані з хмари. */
      restampLocal(){
        let n=0;
        Object.keys(SCHEMAS).forEach(key=>{
          const l=unwrap(lcGet(key)); if(!l) return;
          let parsed; try{ parsed=JSON.parse(l.value); }catch(_){ return; }
          const m=migrateParsed(key, parsed); if(!m.changed) return;
          // заводська мітка 0 лишається 0 (SYNC-1), позначка «не звірено» — теж
          if(lcSet(key, wrap(stampSv(key, JSON.stringify(m.data)), l.w ? l.v : Date.now(), l.m))) n++;
        });
        return n;
      },
      /* Значення у тому вигляді, як воно лежить у localStorage ({_v,d} + версія
         схеми) — щоб бекап міг покласти поруч із локальними й хмарну копію,
         якщо вона свіжіша (див. collect у BACKUP нижче). */
      wrapRaw(key, value, v){ return JSON.stringify({ _v: v || Date.now(), d: stampSv(key, value) }); },
      // ⚡ синхронне читання ЛИШЕ локальної копії (для миттєвого першого рендера до синку з хмарою)
      getLocal(key){
        try{ const l=unwrap(lcGet(key)); return l? this._out(key, l.value) : null; }catch(_){ return null; }
      },
      /* Службове про локальну копію без розбору всього значення:
         has — копія є; w — у нашій обгортці; v — мітка; m — позначка «не звірено». */
      localMeta(key){
        const raw = lcGet(key);
        if(raw==null) return { has:false, w:false, v:0, m:'' };
        const h = /^\{"_v":(-?\d+)(?:,"_m":"([a-z])")?,"d":/.exec(raw.slice(0,64));
        return h ? { has:true, w:true, v:+h[1], m:h[2]||'' } : { has:true, w:false, v:0, m:'' };
      },
      async get(key){
        const localRaw = lcGet(key);
        const local = unwrap(localRaw);
        if(local) return { key, value: this._out(key, local.value), shared:false };
        throw new Error('not found');
      },
      // meta (необовʼязково): { v: мітка, m: позначка } — вирішує шар Supabase (sbWriteMeta)
      async set(key, value, _shared, meta){
        const stamped = stampSv(key, value);     // позначити версією схеми (якщо ключ версіонований)
        const raw = wrap(stamped, meta && meta.v, meta && meta.m);
        const okLocal = lcSet(key, raw);
        return { key, value, shared:false, _local:okLocal };
      },
      async delete(key){
        lcDel(key);
        return { key, deleted:true, shared:false };
      },
      async list(prefix){
        const p = LP+(prefix||'');
        let keys=[];
        try{ keys = Object.keys(localStorage).filter(k=>k.startsWith(p)).map(k=>k.slice(LP.length)); }catch(_){}
        return { keys, prefix, shared:false };
      },
      // pullAll/prefetchAll лишились від старої хмари: для Supabase є sbPrefetchAll і sbPullFresh
      async pullAll(){ return false; },
      async prefetchAll(){ return false; },
    };
  })();

  /* ============ WEB AUTH: Supabase (Google OAuth) ============
     Активується ЛИШЕ поза native (Capacitor) — тобто коли Frequency
     відкритий як звичайний сайт. Не чіпає логіку iOS Preferences: якщо
     Google-сесії немає, window.storage.get/set/delete/list просто
     викликають старий код як і раніше. ============ */
  (function(){
    const SB_URL = 'https://mogtitbgvrhzyhxmzvhs.supabase.co';
    const SB_KEY = 'sb_publishable_T7L_IuX2intaDOUrU7H94w_fVBdKQfD';
    let sb = null, sbUserCache = null, sbInitPromise = null;
    let sbBatchCache = null; // {key: rawJsonString} — заповнюється одним пакетним запитом
    let sbBatchTs = {};      // {key: час оновлення в хмарі, мс} — для звірки «що новіше»
    window.__sbReady = false; // стає true, коли перевірку сесії завершено (успішно чи ні)

    /* ── ЧИЇ ЦЕ ЛОКАЛЬНІ ДАНІ ──
       «Вийти» лише закриває сесію: дані, фото й кошик незлитих правок лишаються
       на пристрої. Якщо потім тут увійде ІНШИЙ акаунт, усе це раніше саме їхало
       в його хмару (кошик, гостьові правки 'g', фото з PhotoDB), а на екрані він
       бачив чужий щоденник. Тепер пристрій пам'ятає власника локальних даних.
       Увійшов не він — сесію для сховища не вмикаємо (sbUserCache лишається
       null): ні читання хмари, ні запису в неї, пристрій живе як без входу, а
       людина вибирає у вікні (29-more-screen.js): зберегти чуже у файл і стерти
       з пристрою (flowFactoryReset лишає сесію) або вийти.
       Власника ставимо при першій сесії, якщо його ще нема: на пристрої з
       гостьовими даними це законний перший вхід — вони зливаються з акаунтом,
       як і досі. Ключ службовий (___): у бекап і хмару не йде, скидання стирає.
       Пристрої, де вийшли ще ДО появи власника: його видно з прапорця фото
       flowapp___ph_backfill_<id> — він ставиться для кожного акаунта, що тут був.
       sbTabOwner — чиї дані в ПАМʼЯТІ цієї вкладки. Власник змінився в іншій
       вкладці (там стерли й увійшли) — ця перезапускається, а не вмикає хмару з
       чужою памʼяттю; і кошик (sbOutboxSave) вона вже не пише. */
    const OWNER_KEY = 'flowapp___owner';
    function sbOwnerRead(){
      try{ const o = JSON.parse(localStorage.getItem(OWNER_KEY)||'null'); if(o && o.id) return { id:String(o.id), email:String(o.email||'') }; }catch(_){}
      return null;
    }
    // хто тут уже входив до появи мітки власника (за прапорцем фото)
    function sbPastUsers(){
      const out = [];
      try{ for(let i=0;i<localStorage.length;i++){ const k = localStorage.key(i)||'';
        if(k.indexOf('flowapp___ph_backfill_')===0) out.push(k.slice(22)); } }catch(_){}
      return out;
    }
    let sbForeign = null;   // { id, email } власника, коли сесія належить іншому акаунту
    let sbTabOwner = (sbOwnerRead()||{}).id || null;
    let sbReloading = false;
    function sbReloadTab(why){
      if(sbReloading) return; sbReloading = true;
      try{ console.warn('[Flow auth] '+why+' — перезапуск вкладки'); }catch(_){}
      try{ location.reload(); }catch(_){}
    }
    function sbSetUser(u){
      const was = !!sbForeign;
      sbForeign = null;
      if(u){
        let o = sbOwnerRead();
        if(!o){
          const past = sbPastUsers();
          if(past.length && past.indexOf(u.id) < 0) o = { id:past[0], email:'' };
        }
        if(o && o.id !== u.id){
          sbForeign = { id:o.id, email:o.email, as:String(u.email||'') }; u = null;
          // власника вгадали з прапорця фото — памʼять цієї вкладки теж його: стирання
          // в іншій вкладці має перезапустити її (слухач storage), а не ввімкнути хмару
          if(!sbTabOwner) sbTabOwner = o.id;
        }
        else if(sbTabOwner && sbTabOwner !== u.id){ u = null; sbReloadTab('власник даних змінився в іншій вкладці'); }
        else {
          if(!o){ try{ localStorage.setItem(OWNER_KEY, JSON.stringify({ id:u.id, email:u.email||'' })); }
                  catch(_){ try{ console.warn('[Flow auth] мітку власника не записано — сховище повне'); }catch(_){} } }
          sbTabOwner = u.id;
        }
      }
      sbUserCache = u;
      window.__flowForeign = sbForeign ? { owner: sbForeign.email, as: sbForeign.as } : null;
      if(sbForeign && !was){
        try{ console.warn('[Flow auth] на пристрої дані іншого акаунта — хмару вимкнено до вибору людини'); }catch(_){}
        try{ document.dispatchEvent(new CustomEvent('flowforeign')); }catch(_){}
      }
    }
    // власника стерли чи змінили в іншій вкладці — памʼять цієї вже чужа
    try{ window.addEventListener('storage', e=>{
      if(e.key !== OWNER_KEY && e.key !== null) return;   // null — сховище очищено цілком
      const o = sbOwnerRead();
      if(sbTabOwner && (!o || o.id !== sbTabOwner)) sbReloadTab('власника даних змінено в іншій вкладці');
    }); }catch(_){}
    // чи можна класти чергу цієї вкладки в кошик: не під час скидання і не поверх чужого пристрою
    function sbOutboxMine(){
      if(window.__flowWriteLock) return false;
      // вкладка без власника (гість, старий кошик) пише, лише доки власника нема й на пристрої
      if(!sbTabOwner) return !sbOwnerRead();
      const o = sbOwnerRead();
      return !!o && o.id === sbTabOwner;
    }

    /* Спершу локальна копія з vendor/ (працює без інтернету), потім CDN.
       Версія на CDN зафіксована навмисно: «@2» колись оновиться сама і може
       зламати вхід у момент, коли ти цього не чекаєш. */
    function loadSupabaseLib(){
      return new Promise((resolve)=>{
        if(window.supabase){ resolve(window.supabase); return; }
        const urls = ['vendor/supabase.min.js',
                      'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/dist/umd/supabase.js'];
        (function next(i){
          if(i >= urls.length){
            try{ console.warn('[Flow auth] не вдалося завантажити supabase-js — вхід через Google буде недоступний'); }catch(_){}
            resolve(null); return;
          }
          const s = document.createElement('script');
          s.src = urls[i];
          s.onload = ()=> window.supabase ? resolve(window.supabase) : next(i+1);
          s.onerror = ()=> next(i+1);
          document.head.appendChild(s);
        })(0);
      });
    }

    // перевірку сесії завершено — хто чекав на довіру до даних (реєстр міграцій), може йти
    function sbReadyEvt(){ try{ document.dispatchEvent(new CustomEvent('flowsbready')); }catch(_){} }
    async function sbInit(){
      if(sbInitPromise) return sbInitPromise;
      sbInitPromise = (async()=>{
        const lib = await loadSupabaseLib();
        if(!lib){ window.__sbReady = true; sbReadyEvt(); return null; }
        sb = lib.createClient(SB_URL, SB_KEY);
        try{
          const { data } = await sb.auth.getSession();
          sbSetUser(data && data.session ? data.session.user : null);
        }catch(_){}
        window.__sbReady = true; sbReadyEvt();
        try{ if(typeof window.renderAccount==='function') window.renderAccount(); }catch(_){}
        // Якщо на момент старту сторінки сесія вже була (людина заходить у знайомому
        // браузері) — стартовий load() міг устигнути прочитати ЛИШЕ локальну копію
        // цього пристрою ДО того, як ми дізналися про сесію (гонка: sbInit() і load()
        // виконуються паралельно). Через це різні пристрої одного акаунта показували
        // різні дані (фото на обкладинці папки, кількість активних тощо), доки хтось
        // не тис кнопку ручного оновлення. Тому одразу після підтвердження сесії
        // примусово перечитуємо дані — цього разу вже з хмари.
        if(sbUserCache){
          // старий індикатор міг застрягнути на "Помилка синхрону" ще з часів, коли
          // ключ переповнив localStorage (це позначалось назавжди, бо код очищення
          // статусу раніше існував лише для старої хмари) — тепер, коли
          // знаємо, що Google-сесія жива, одразу показуємо коректний стан
          try{ if(window.__setSync){ window.__flowSync.quota=false; window.__setSync('synced'); } }catch(_){}
          const refetch=async ()=>{ try{ if(window.__flowSync) window.__flowSync.warmed=false; }catch(_){}
            // ОДИН пакетний запит замість ~30-40 окремих (по одному на ключ) —
            // без цього кожне відкриття/перечитування «Ще» шле десятки послідовних
            // запитів у Supabase, і синхронізація виглядає повільною.
            try{ await sbPrefetchAll(); }catch(_){}
            // сесія жива — доштовхнути незлиті правки з попереднього (можливо офлайн) запуску
            try{ if(window.sbFlushWrites && localStorage.getItem('flowapp___sb_outbox')) window.sbFlushWrites(); }catch(_){}
            try{ const ld=window.__load; if(typeof ld==='function') await ld().catch(()=>{}); }catch(_){}
            // фото: доштовхнути незлиті + разовий backfill старих знімків
            try{ if(window.sbPhotoSync) window.sbPhotoSync(); }catch(_){} };
          if(typeof window.__load==='function') refetch();
          else setTimeout(refetch, 300); // load() ще міг не встигнути визначитись на цьому етапі скрипта
        }
        sb.auth.onAuthStateChange((_evt, session)=>{
          sbSetUser(session ? session.user : null);
          try{ if(typeof window.renderAccount==='function') window.renderAccount(); }catch(_){}
          // прибрати access_token/code з адресного рядка одразу після обробки —
          // інакше він так і висить у видимому URL (ризик, якщо людина скопіює
          // посилання чи зробить скрін адресного рядка)
          if(_evt==='SIGNED_IN'){
            try{
              const hasAuthParams = location.hash.indexOf('access_token')>-1 || location.search.indexOf('code=')>-1;
              if(hasAuthParams) history.replaceState(null, '', location.origin + location.pathname);
            }catch(_){}
          }
        });
        return sb;
      })();
      return sbInitPromise;
    }

    window.sbUser = function(){ return sbUserCache; };
    /* Рядок ↔ хмара. У локальному сховищі значення — це РЯДОК: здебільшого JSON
       (JSON.stringify обʼєкта), але деякі ключі пишуть сирий текст (аватарка —
       data-URL, ui_mode — 'lite', тема, вкладка). У jsonb сирий текст лягає як
       JSON-рядок, а назад ми завжди робили JSON.stringify — і 'data:…'
       поверталось як '"data:…"' (з лапками): після перезапуску з входом
       аватарка ламалась, '' ставало '""'. Правило тепер одне:
       jsonb-рядок = саме той рядок, що записали; решта — JSON.stringify.
       Старі рядки в хмарі (сирий текст) читаються правильно без міграції,
       а старі версії застосунку на інших пристроях бачать те саме, що й раніше. */
    function sbFromCloud(v){ return typeof v==='string' ? v : JSON.stringify(v); }
    function sbToCloud(raw){
      let parsed; try{ parsed = JSON.parse(raw); }catch(_){ return raw; }
      // JSON-рядок ('"abc"') кладемо як є, інакше при читанні він втратив би лапки
      return typeof parsed==='string' ? raw : parsed;
    }
    /* Токен сесії для AI-воркера (див. aiFetch у 09-goals.js): воркер може
       вимагати вхід, щоб чужі не ганяли платну модель. getSession сам оновлює
       прострочений токен. Чекаємо не довше 1.5 с — AI не має висіти через Supabase. */
    window.sbAccessToken = async function(){
      if(!sb || !sbUserCache) return '';
      try{
        const got = await Promise.race([ sb.auth.getSession(), new Promise(r=>setTimeout(()=>r(null),1500)) ]);
        return (got && got.data && got.data.session && got.data.session.access_token) || '';
      }catch(_){ return ''; }
    };
    // ОДИН запит на весь список даних користувача — замість того, щоб кожен
    // window.storage.get(key) під час load() ходив у мережу окремо.
    async function sbPrefetchAll(){
      if(!sb || !sbUserCache) return false;
      try{
        // фото (ключі 'photo:…') сюди не тягнемо: вони великі й потрібні
        // ліниво — їх дотягує sbPhotoFetch при промаху в IndexedDB
        const { data, error } = await sb.from('user_data').select('key,value,updated_at').eq('user_id', sbUserCache.id).not('key','like','photo:%');
        if(error || !data){ window.__sbCloudOk=false; return false; }
        const c={}, ts={}; data.forEach(r=>{ c[r.key]=sbFromCloud(r.value); ts[r.key]=Date.parse(r.updated_at)||0; });
        sbBatchCache=c; sbBatchTs=ts;
        window.__sbCloudOk=true;
        return true;
      }catch(_){ window.__sbCloudOk=false; return false; }
    }
    /* час останнього ЛОКАЛЬНОГО запису ключа (з обгортки _v), 0 якщо нема —
       потрібен, щоб при читанні звірити, що новіше: локальне чи хмарне. */
    function sbLocalVersion(key){
      try{
        const raw = localStorage.getItem('flowapp_'+key);
        if(!raw) return 0;
        const o = JSON.parse(raw);
        return (o && typeof o==='object' && typeof o._v==='number') ? o._v : 0;
      }catch(_){ return 0; }
    }
    window.sbPrefetchAll = sbPrefetchAll;
    /* Ключі, чия хмарна копія свіжіша за локальну. Хмарне значення при читанні
       віддається модулю, але в localStorage НЕ пишеться — тож на пристрої, де
       правили з іншого, локальна копія стара, і бекап лише з localStorage
       зберіг би НЕ те, що людина бачить на екрані. Віддаємо у форматі
       localStorage ({_v,d}), щоб бекап просто поклав їх поверх локальних. */
    window.sbCloudFresher = function(){
      if(!sb || !sbUserCache || !sbBatchCache) return null;
      const out = {};
      Object.keys(sbBatchCache).forEach(k=>{
        if(k in sbWriteQueue || k in sbInFlight) return;   // своя правка ще летить — вона новіша
        const ts = sbBatchTs[k]||0;
        if(ts > sbLocalVersion(k)) out[k] = window.storage.wrapRaw(k, sbBatchCache[k], ts);
      });
      return out;
    };
    /* Покласти в ЛОКАЛЬНУ копію значення, яке збігається з хмарним, — з міткою
       хмари, тож воно не «новішає» і назад у хмару не їде. Для ключів, де модуль
       сам злив прочитане з памʼяттю і злите вийшло рівно хмарним (надгробки
       папок): інакше локальна копія лишалась би старою до першої правки. */
    window.sbCacheLocal = function(key, value){
      if(!sb || !sbUserCache || !sbBatchCache || window.__flowWriteLock) return false;
      const ts = sbBatchTs[key]; if(!ts) return false;
      if(key in sbWriteQueue || key in sbInFlight) return false;   // своя правка ще летить — вона новіша
      if(window.storage.localMeta(key).m) return false;            // незвірену копію зводить sbReconcile
      if(sbLocalVersion(key) > ts) return false;                   // локальна свіжіша — не чіпаємо
      try{ origSet(key, value, false, { v: ts }); return true; }catch(_){ return false; }
    };
    /* ── ЧИ МОЖНА ВІРИТИ ПОРОЖНЬОМУ ЧИТАННЮ? ──
       Головне питання перед будь-яким автоматичним записом: «у сховищі справді
       нічого нема» чи «сховище не відповіло»? Досі обидва випадки виглядали
       однаково (null) — і застосунок міг записати заводську заглушку з однією
       папкою поверх справжніх даних, а тоді розігнати її на всі пристрої через
       хмару (мітка ж свіжа). Тепер порожнечі віримо лише тоді, коли точно
       знаємо, що її ніхто не підмінив збоєм зв'язку. */
    window.sbDataTrusted = function(){
      if(!window.__sbReady) return false;      // сесію ще перевіряють — рано щось вирішувати
      if(!sbUserCache) return true;            // хмари нема взагалі: локальне сховище і є джерело істини
      return window.__sbCloudOk === true;      // сесія є — віримо, лише коли хмара реально відповіла
    };
    /* ── ЯКІ КЛЮЧІ ЦЯ СЕСІЯ СПРАВДІ ПРОЧИТАЛА (SYNC-2) ──
       Той самий запобіжник, що в saveFolders({auto:true}), тепер для всіх
       ключів load(): дошки, чати, щоденник, фінанси, бажання… Після читання
       load() позначає кожен ключ: прочитано (прийшли дані або чесне «порожньо»)
       чи ні (сховище мовчало / дані пошкоджені).
       • АВТОМАТИЧНІ записи (міграції, прибирання, заглушки — усе всередині
         storeAuto) у непрочитаний ключ не йдуть: лишаються лише в памʼяті.
       • Ручні дії людини пишуться завжди. Але якщо ключ не прочитано, у памʼяті
         лише її правка поверх порожнечі — тож копія лягає локально з позначкою
         'u' і в хмару не йде, доки не звіримо її з хмарою (sbReconcile): тоді
         правку ДОДАЄМО до хмарного, а не затираємо хмару порожнечею з правкою. */
    const keyRead = {};    // key → true (прочитано) | false (не відповіло / пошкоджено) | null (невідомо)
    const keyMark = {};    // key → 'u' | 'g': локальна копія ще не звірена з хмарою акаунта
    const keyRecon = {};   // key → id акаунта, з хмарою якого ключ уже звірено в цій сесії
    const keyPending = {}; // key → { uid, cloudVal, cloudTs, mark }: хмарне прочитано, злиття ще не застосовано
    const sbLastGot = {};  // key → що віддав останній storage.get (для ключів, які load() читає поза __RAW)
    let autoDepth = 0;     // >0 — зараз виконується автоматичний запис
    function sbReconciled(key){ return !!sbUserCache && keyRecon[key] === sbUserCache.id; }
    // raw — {ключ: значення} з пакета __RAW; extra — ключі, які load() дочитує окремо (бажання, цінності…)
    window.storeMarkRead = function(raw, extra){
      const ready = window.__sbReady === true;
      const trusted = window.sbDataTrusted();
      const all = Object.assign({}, raw||{});
      (extra||[]).forEach(k=>{ all[k] = Object.prototype.hasOwnProperty.call(sbLastGot, k) ? sbLastGot[k] : null; });
      Object.keys(sbLastGot).forEach(k=>{ delete sbLastGot[k]; });
      sbCommitReconciled(raw, all);
      Object.keys(all).forEach(k=>{
        const v = all[k];
        /* Порожньо, а бібліотека Supabase ще не довантажилась (повільна мережа) —
           ще не знаємо, гість це чи вхід із Google. Не «ні», а «невідомо» (null). */
        let ok = (v!=null) ? true : (ready ? trusted : null);
        // схоже на JSON, але не розбирається — пошкоджено (сирий текст, як аватарка, — ні)
        if(typeof v==='string' && /^[\[{]/.test(v)){ try{ JSON.parse(v); }catch(_){ ok = false; } }
        keyRead[k] = ok;
        const m = window.storage.localMeta(k).m;
        if(m) keyMark[k] = m; else delete keyMark[k];
      });
    };
    // ключ, якого load() не читав, оцінюємо загальною довірою до сховища
    window.storeKeyReady = function(key){
      if(!Object.prototype.hasOwnProperty.call(keyRead, key)) return window.sbDataTrusted();
      // локальна копія ще не звірена з хмарою, а сесія вже є — її вміст ще не правда акаунта
      if(keyMark[key] && sbUserCache && !sbReconciled(key)) return false;
      // «невідомо»: сесію перевірено, її нема — гість, локальна порожнеча і є правда.
      // Вхід із Google сюди не дійде: sbInit одразу перечитує load() і перепозначає ключ.
      if(keyRead[key] === null) return window.__sbReady === true && !sbUserCache;
      return keyRead[key];
    };
    // почати автоматичну ділянку; повертає функцію, що її закриває (для try/finally)
    window.storeAutoBegin = function(){
      autoDepth++; let open = true;
      return function(){ if(open){ open = false; autoDepth--; } };
    };
    window.storeAuto = function(fn){
      const end = window.storeAutoBegin();
      try{ return fn(); } finally { end(); }
    };
    /* Мітка й позначка для локальної копії (storage.set нижче).
       SYNC-1: заводське значення — автозапис без сесії в ключ, де ще нічого нема
       (або лежить таке саме заводське), — отримує мітку 0. Раніше мітка була
       свіжа: після входу гостьова заглушка виходила «новішою» за хмару, і перша
       ж правка заливала її в хмару. Мітка 0 програє будь-якій хмарній, а гостю
       без хмари не заважає. Першу ж ручну правку ключа пишемо зі свіжою міткою.
       Позначки — лише для ключів, які читає load():
       'g' — ручна правка гостя (сесію перевірено, входу нема). При вході гостьове
             ЗЛИВАЄТЬСЯ з хмарним, а не «новіше перемагає цілим ключем»: те, що є
             лише в хмарі, лишається.
       'u' — ручна правка ключа, який не прочитано (див. вище).
       Доки ключ не звірено з хмарою цього акаунта, позначка переходить на
       наступні записи: правка поверх незвіреного — теж незвірена. */
    function sbWriteMeta(key, auto){
      const cur = window.storage.localMeta(key);
      let v = Date.now(), m = '';
      if(auto && !sbUserCache && (!cur.has || (cur.w && cur.v === 0))) v = 0;
      if(Object.prototype.hasOwnProperty.call(keyRead, key)){
        /* На native сесія не відновлюється при старті (вхід — через frequency://auth
           у самій сесії), тож «без входу» там — звичайна робота з власними даними,
           а не гість. Позначка 'g' повертала б при вході видалене — лишаємо як було. */
        const guest = !window.FLOW_NATIVE && window.__sbReady === true && !sbUserCache;
        if(guest) m = auto ? cur.m : 'g';
        else if(cur.m && !sbReconciled(key)) m = cur.m;
        else if(!auto && !window.storeKeyReady(key)) m = 'u';
      }
      return { v, m };
    }
    /* ── ЗВІРКА НЕЗВІРЕНОЇ КОПІЇ З ХМАРОЮ ──
       Злиття, а не «хто новіший»: у списках записів з id (блоки, чати, бажання) —
       усе хмарне плюс локальні записи, яких у хмарі нема; в обʼєктах — ключ за
       ключем. Спірне (той самий id чи різні прості значення з обох боків):
       'g' — перемагає гостьове (як і досі, коли новіше перемагало цілим ключем);
       'u' — перемагає хмарне: правка лягла поверх НЕпрочитаного, тож усе в ній,
             крім нових записів, — заводські значення памʼяті. Спірне з 'u'
             кладемо в резерв (sbKeepHeld), щоб його можна було повернути.
       Значення верхнього рівня (прапорець, аватарка) — завжди локальне: це
       прямий вибір людини. */
    function sbMergeHeld(cStr, lStr, preferLocal){
      let c, l;
      try{ c = JSON.parse(cStr); l = JSON.parse(lStr); }catch(_){ return { value: lStr, dropped: 0 }; }
      let dropped = 0;
      const isObj = x => !!x && typeof x==='object' && !Array.isArray(x);
      const idOf = x => (isObj(x) && x.id != null) ? String(x.id) : null;
      const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
      function mg(cv, lv, depth){
        if(Array.isArray(cv) && Array.isArray(lv)){
          const out = cv.slice(), at = new Map(), seen = new Set(cv.map(x=>JSON.stringify(x)));
          out.forEach((x, i)=>{ const id = idOf(x); if(id != null && !at.has(id)) at.set(id, i); });
          lv.forEach(x=>{
            const id = idOf(x);
            if(id != null && at.has(id)){
              if(same(out[at.get(id)], x)) return;
              if(preferLocal) out[at.get(id)] = x; else dropped++;
              return;
            }
            if(!seen.has(JSON.stringify(x))) out.push(x);
          });
          return out;
        }
        if(isObj(cv) && isObj(lv)){
          const out = Object.assign({}, cv);
          Object.keys(lv).forEach(k=>{ out[k] = Object.prototype.hasOwnProperty.call(cv, k) ? mg(cv[k], lv[k], depth+1) : lv[k]; });
          return out;
        }
        if(depth === 0 || preferLocal) return lv;
        if(!same(cv, lv)) dropped++;
        return cv;
      }
      return { value: JSON.stringify(mg(c, l, 0)), dropped };
    }
    /* Резерв спірного зі звірки 'u': flowapp___held_keep_<час>_<ключ> = { at, key, value }.
       Назва без «backup»/«bak»: такі ключі purgeDisposable() стирає першими.
       Не більше трьох (найстаріші прибираємо) і не більше ~1 МБ на один; їде в експорт. */
    const HK_PREFIX = 'flowapp___held_keep_';
    function sbKeepHeld(key, value){
      try{
        const str = JSON.stringify({ at: new Date().toISOString(), key, value });
        if(str.length > 1000000) throw new Error('завеликий');
        localStorage.setItem(HK_PREFIX + Date.now() + '_' + key, str);
        const all = [];
        for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k && k.indexOf(HK_PREFIX)===0) all.push(k); }
        all.sort(); while(all.length > 3) localStorage.removeItem(all.shift());
        try{ console.warn('[Flow storage] спірне при звірці з хмарою відкладено в резерв:', key); }catch(_){}
      }catch(_){ try{ console.warn('[Flow storage] спірне при звірці не влізло в резерв:', key); }catch(_){} }
    }
    /* Звести незвірену локальну копію з хмарою цього акаунта — у два кроки.
       1) sbReconcile (кличе storage.get): прочитати хмарне і віддати злите.
          Нічого не пише і позначку не знімає: load() читає ще інші ключі (з
          повільною мережею — секунди), а в памʼяті доти стара копія. Зніми ми
          позначку зараз — правка в цю мить пішла б у хмару поверх злитого.
       2) sbCommitReconciled (кличе storeMarkRead, коли load() ось-ось застосує
          прочитане): злити хмарне з ТЕПЕРІШНЬОЮ локальною копією (раптом за цей
          час додалась правка), записати локально й у хмару, зняти позначку.
       Повертає { key, value } або null, якщо хмара мовчить — тоді копія лишається
       незвіреною до наступного load(). */
    async function sbReconcile(key, mark){
      const u = sbUserCache;
      let cloudVal = null, cloudTs = 0, known = false;
      if(sbBatchCache){
        known = true;
        if(Object.prototype.hasOwnProperty.call(sbBatchCache, key)){ cloudVal = sbBatchCache[key]; cloudTs = sbBatchTs[key]||0; }
      } else {
        try{
          const { data, error } = await sb.from('user_data').select('value,updated_at').eq('user_id', u.id).eq('key', key).maybeSingle();
          if(!error){ known = true; if(data){ cloudVal = sbFromCloud(data.value); cloudTs = Date.parse(data.updated_at)||0; } }
        }catch(_){}
      }
      if(!known || sbUserCache !== u) return null;
      let local = null;
      try{ const r = await origGet(key); local = r ? r.value : null; }catch(_){}
      keyPending[key] = { uid: u.id, cloudVal, cloudTs, mark };
      const value = (local != null && cloudVal != null) ? sbMergeHeld(cloudVal, local, mark === 'g').value
                  : (local != null ? local : cloudVal);
      return { key, value, shared:false };
    }
    // raw — пакет __RAW, який load() зараз застосує: злите кладемо і туди
    function sbCommitReconciled(raw, all){
      Object.keys(keyPending).forEach(k=>{
        const p = keyPending[k]; delete keyPending[k];
        if(!sbUserCache || sbUserCache.id !== p.uid) return;
        const local = window.storage.getLocal(k);
        let value = (local != null) ? local : p.cloudVal, changed = (local != null);
        if(local != null && p.cloudVal != null){
          const r = sbMergeHeld(p.cloudVal, local, p.mark === 'g');
          value = r.value; changed = (value !== p.cloudVal);
          if(r.dropped && p.mark !== 'g') sbKeepHeld(k, local);
        }
        keyRecon[k] = p.uid;
        if(value != null){
          // незмінене хмарне лишаємо з міткою хмари — локальна копія не має «новішати» без правки
          try{ origSet(k, value, false, { v: changed ? Date.now() : p.cloudTs }); }catch(_){}   // пише синхронно
          if(changed) sbScheduleWrite(k, value);
        }
        if(raw && Object.prototype.hasOwnProperty.call(raw, k)){ raw[k] = value; all[k] = value; }
        try{ console.log('[Flow storage] звірено з хмарою (' + p.mark + '):', k); }catch(_){}
      });
    }
    let sbSigningIn=false;
    window.sbSignInGoogle = async function(){
      if(sbSigningIn) return;            // захист від подвійного натискання
      sbSigningIn=true;
      try{
        const client = await sbInit();
        if(!client) return;
        // ЧИСТА адреса повернення (без старих #-хвостів) — інакше виходить
        // «##access_token=», який Supabase не може розпарсити
        // У браузері повертаємось на ту саму сторінку. У застосунку на Mac/Windows
        // повертатись «на сторінку» нікуди — там немає адресного рядка, тому
        // просимо Google повернути людину на frequency://auth, а система
        // передасть це посилання самому застосунку (див. desktop/main.js).
        const DESK = window.flowDesktop || null;
        const backTo = (DESK && DESK.authRedirect) ? DESK.authRedirect
                                                   : (location.origin + location.pathname);
        await client.auth.signInWithOAuth({ provider:'google', options:{ redirectTo: backTo } });
      } finally {
        setTimeout(()=>{ sbSigningIn=false; }, 8000);
      }
    };
    /* ── Повернення з входу в застосунку (Mac/Windows) ──
       У браузері supabase-js сам ловить токени з адреси після переходу.
       У застосунку переходу немає: посилання приходить ззовні, тому
       розбираємо його руками і кладемо сесію самі. Далі — те саме, що
       робиться після звичайного входу: перечитуємо дані вже з хмари. */
    (function(){
      const DESK = window.flowDesktop || null;
      if(!DESK || typeof DESK.onAuthCallback !== 'function') return;
      /* У застосунку немає адресного рядка й консолі під рукою, тому про
         результат входу кажемо вголос — інакше при невдачі людина бачить
         просто «нічого не сталось» і не має за що вхопитись. */
      const say = (msg)=>{ try{
        if(typeof window.__flowToast==='function') window.__flowToast(msg);
        else alert(msg);
      }catch(_){} };

      DESK.onAuthCallback(async function(cbUrl){
        try{
          const frag = String(cbUrl||'').split('#')[1] || '';
          const q = new URLSearchParams(frag);
          const access_token  = q.get('access_token');
          const refresh_token = q.get('refresh_token');
          if(!access_token || !refresh_token){
            const err = q.get('error_description') || q.get('error');
            if(err){
              try{ console.warn('[Flow auth] Google повернув помилку:', err); }catch(_){}
              say('Вхід не вдався: ' + decodeURIComponent(String(err).replace(/\+/g,' ')));
            } else {
              say('Вхід не вдався: Supabase не повернув ключі. Перевір, чи додано frequency://auth у Redirect URLs.');
            }
            return;
          }
          const client = await sbInit();
          if(!client){ say('Вхід не вдався: не завантажилась бібліотека Supabase.'); return; }
          const { data, error } = await client.auth.setSession({ access_token, refresh_token });
          if(error){
            try{ console.warn('[Flow auth] сесію не прийнято:', error.message); }catch(_){}
            say('Вхід не вдався: ' + error.message);
            return;
          }
          sbSetUser(data && data.session ? data.session.user : null);
          // на пристрої дані іншого акаунта — хмару не чіпаємо, вибір у вікні (flowforeign)
          if(sbForeign){ try{ if(typeof window.renderAccount==='function') window.renderAccount(); }catch(_){} return; }
          try{ if(window.__setSync){ window.__flowSync.quota=false; window.__setSync('synced'); } }catch(_){}
          try{ if(window.__flowSync) window.__flowSync.warmed=false; }catch(_){}
          try{ await sbPrefetchAll(); }catch(_){}
          try{ const ld=window.__load; if(typeof ld==='function') await ld().catch(()=>{}); }catch(_){}
          try{ if(window.sbPhotoSync) window.sbPhotoSync(); }catch(_){}
          try{ if(typeof window.renderAccount==='function') window.renderAccount(); }catch(_){}
          const who = (sbUserCache && sbUserCache.email) ? sbUserCache.email : '';
          say('Вхід виконано' + (who ? ' · ' + who : ''));
        }catch(e){
          say('Вхід не вдався: ' + (e && e.message ? e.message : 'невідома помилка'));
        }
      });
    })();

    window.sbSignOut = async function(){
      const client = await sbInit();
      if(!client) return;
      await client.auth.signOut();
      sbSetUser(null);
      try{ if(typeof window.renderAccount==='function') window.renderAccount(); }catch(_){}
    };

    // ініціалізуємо тільки в web-режимі (native має свій шлях входу через frequency://auth)
    try{
      if(!window.FLOW_NATIVE) sbInit();
      else window.__sbReady = true; // тут Google взагалі не задіяний — нема на що чекати
    }catch(_){ window.__sbReady = true; }

    // FIX: iOS Safari часто відновлює сторінку після OAuth-редіректу з
    // bfcache (без повного reload) — тоді JS-стан лишається "неавторизованим",
    // хоча токен вже прийшов в URL. Форсуємо reload, якщо бачимо ознаки
    // OAuth-колбека і сторінку відновлено з кешу.
    window.addEventListener('pageshow', function(e){
      const hasAuthParams = location.hash.indexOf('access_token')>-1 || location.search.indexOf('code=')>-1;
      if(e.persisted && hasAuthParams){ location.reload(); }
    });

    // DIAG: якщо Google/Supabase повернули помилку в URL — раніше вона мовчки
    // проковтувалась. Показуємо її, щоб зрозуміти справжню причину падіння логіну.
    try{
      const rawHash = location.hash.replace(/^#/, '');
      const hp = new URLSearchParams(rawHash);
      const sp = new URLSearchParams(location.search);
      const errCode = sp.get('error') || hp.get('error');
      const errDesc = sp.get('error_description') || hp.get('error_description');
      if(errCode){
        setTimeout(()=>{ try{ alert('Помилка входу Google:\n'+errCode+(errDesc?'\n\n'+decodeURIComponent(errDesc.replace(/\+/g,' ')):'')); }catch(_){} }, 300);
      }
    }catch(_){}

    // обгортаємо ІСНУЮЧІ методи window.storage — якщо є Google-сесія,
    // читаємо/пишемо в Supabase; інакше все як було
    const origGet = window.storage.get.bind(window.storage);
    const origSet = window.storage.set.bind(window.storage);
    const origDelete = window.storage.delete.bind(window.storage);
    const origList = window.storage.list.bind(window.storage);

    async function sbGet(key){
      const u = sbUserCache;
      if(u && sb){
        // 1) незлитий локальний запис у черзі — він найсвіжіший
        if(typeof sbWriteQueue!=='undefined' && sbWriteQueue && Object.prototype.hasOwnProperty.call(sbWriteQueue,key)){
          return { key, value: sbWriteQueue[key], shared:false };
        }
        // 1а) локальна копія ще не звірена з хмарою акаунта ('u'/'g') — зводимо
        //     її з хмарною (sbReconcile), а не міряємося мітками часу
        const mark = window.storage.localMeta(key).m;
        if(mark && !sbReconciled(key)){
          const r = await sbReconcile(key, mark);
          return r || origGet(key);
        }
        const localTs = sbLocalVersion(key);
        // 2) є в кеші хмари: віддаємо ХМАРНЕ, тільки якщо воно НЕ старіше за локальне.
        //    Раніше хмара перемагала завжди — і свіжа локальна правка, що не встигла
        //    синхронізуватись, «поверталась назад». Тепер новіше перемагає.
        if(sbBatchCache && Object.prototype.hasOwnProperty.call(sbBatchCache,key)){
          const cloudTs = sbBatchTs[key]||0;
          if(localTs > cloudTs) return origGet(key);          // локальна свіжіша
          return { key, value: sbBatchCache[key], shared:false };
        }
        // 3) немає в кеші — точковий запит, теж зі звіркою свіжості
        try{
          const { data, error } = await sb.from('user_data').select('value,updated_at').eq('user_id', u.id).eq('key', key).maybeSingle();
          if(!error && data){
            const cloudTs = Date.parse(data.updated_at)||0;
            if(localTs > cloudTs) return origGet(key);         // локальна свіжіша
            return { key, value: sbFromCloud(data.value), shared:false };
          }
        }catch(_){}
        // хмара порожня/недоступна — фолбек на локальну копію, щоб дані не «зникали»
        return origGet(key);
      }
      return origGet(key);
    }
    // запамʼятати, що віддали: storeMarkRead так бачить і ключі, які load() дочитує поза __RAW
    window.storage.get = async function(key){
      try{ const r = await sbGet(key); sbLastGot[key] = (r && r.value != null) ? r.value : null; return r; }
      catch(e){ sbLastGot[key] = null; throw e; }
    };
    // ── групування записів: кілька set() поспіль (напр. під час швидкого
    //    редагування різних розділів) об'єднуються в ОДИН upsert-запит із
    //    кількома рядками замість окремого запиту на кожен ключ ──
    let sbWriteQueue = {}; // {key: rawValueString} — очікують відправки в хмару
    let sbWriteTimer = null;
    /* Партія, яку sbFlushWrites уже забрав із черги, але хмара ще не відповіла.
       Вона теж мусить лежати в кошику: інакше будь-яке збереження кошика під час
       польоту (відкладений таймер, згортання, set іншого ключа) бачить порожню
       чергу і стирає кошик — і якщо iOS уб'є застосунок до відповіді, правка
       в хмару вже не піде. Прибираємо ключ звідси лише після відповіді. */
    let sbInFlight = {};
    /* Номер партії й номер останньої партії, що ДІЙШЛА, для кожного ключа.
       Потрібні, щоб стара партія, яка впала пізніше за новішу, не повернула
       старе значення в чергу: повтор записав би його в хмару з найсвіжішою
       міткою, і правку пристрій потім сам відкотив би. Лічильник, а не
       годинник: мітки хмари з інших пристроїв можуть бути зсунуті. */
    let sbFlushSeq = 0;
    const sbDoneSeq = {};
    /* «Вихідний кошик» у localStorage: незлиті записи мають пережити перезапуск,
       інакше офлайн-правка, зроблена перед закриттям, губиться назавжди. */
    function sbOutboxSave(){
      if(sbOutboxTimer){ clearTimeout(sbOutboxTimer); sbOutboxTimer=null; }
      /* Скидання стерло сховище, а черга ще в памʼяті: pagehide перед перезапуском
         записав би кошик назад — і новий власник відправив би чуже у свою хмару. */
      if(!sbOutboxMine()) return;
      try{
        const all = Object.assign({}, sbInFlight, sbWriteQueue);   // новіше з черги перемагає
        if(Object.keys(all).length) localStorage.setItem('flowapp___sb_outbox', JSON.stringify(all));
        else localStorage.removeItem('flowapp___sb_outbox');
        sbOutboxKeys = all;   // лише після вдалого запису: це те, що справді лежить у кошику
      }catch(_){}
    }
    /* Кошик пишемо не на КОЖЕН set(), а не частіше ніж раз на 400 мс. Чому:
       повзунок чи перетягування дає десятки set() того самого ключа за секунду,
       і кожен раз уся черга (з дошкою ~0.7 МБ) серіалізувалась і лягала в
       localStorage заново — хоча в черзі однаково лишається тільки ОСТАННЄ
       значення ключа. Саме значення вже лежить у localStorage (origSet пише
       синхронно), тож у ці 400 мс ризикує лише позначка «ще не в хмарі».
       Коли застосунок ховають або закривають — кошик пишемо НЕГАЙНО (sbOnHide),
       і будь-який запис уже після ховання теж іде в кошик одразу.
       Виняток: ключ, який УЖЕ лежить у збереженому кошику, — пишемо одразу.
       Там його старе значення, і якщо застосунок уб'ють (падіння WebContent
       на iOS, без pagehide), перезапуск вишле в хмару старе зі свіжою міткою
       і відкотить заодно й локальну копію. Застаріле гірше за відсутнє. */
    let sbOutboxTimer = null;
    let sbOutboxKeys = {};  // що зараз лежить у збереженому кошику (дивимось лише на ключі)
    let sbHiding = false;   // pagehide вже був (visibilityState на старих WebKit міг ще лишатись 'visible')
    function sbOutboxSaveSoon(key){
      if(sbHiding || document.visibilityState==='hidden' || (key!=null && key in sbOutboxKeys)){ sbOutboxSave(); return; }
      if(!sbOutboxTimer) sbOutboxTimer = setTimeout(sbOutboxSave, 400);
    }
    function sbOutboxLoad(){
      try{
        const raw=localStorage.getItem('flowapp___sb_outbox'); if(!raw) return;
        const o=JSON.parse(raw);
        if(o && typeof o==='object'){ sbOutboxKeys = o; Object.keys(o).forEach(k=>{ if(!(k in sbWriteQueue)) sbWriteQueue[k]=o[k]; }); }
      }catch(_){}
    }
    function sbSyncPending(){ try{ window.__flowSync.sbPending = Object.keys(sbWriteQueue).length; }catch(_){} }
    function sbScheduleWrite(key, value){
      if(window.__flowWriteLock) return;   // скидання: у хмару теж нічого не доливаємо (див. lcSet)
      sbWriteQueue[key] = value;       // той самий ключ удруге — просто нове значення (останнє перемагає)
      sbOutboxSaveSoon(key); sbSyncPending();
      try{ if(window.__setSync) window.__setSync('syncing'); }catch(_){}
      if(sbWriteTimer) return;
      sbWriteTimer = setTimeout(sbFlushWrites, 500);
    }
    async function sbFlushWrites(){
      sbWriteTimer = null;
      // на пристрої дані іншого акаунта — черга чекає в кошику, без повторів і «Помилки»
      if(sbForeign) return;
      const u = sbUserCache;
      const q = sbWriteQueue; sbWriteQueue = {};   // знімаємо поточну партію
      const keys = Object.keys(q);
      if(!keys.length){ sbOutboxSave(); return; }
      keys.forEach(k=>{ sbInFlight[k]=q[k]; });
      const seq = ++sbFlushSeq;
      let ok=false;
      if(u && sb){
        try{
          const now = Date.now();
          const rows = keys.map(k=>{
            return { user_id:u.id, key:k, value:sbToCloud(q[k]), updated_at:new Date(now).toISOString() };
          });
          // ВАЖЛИВО: supabase-js повертає {error}, а не кидає — перевіряємо явно,
          // інакше зірваний запис вважався б успішним і правка зникала б.
          const { error } = await sb.from('user_data').upsert(rows, { onConflict:'user_id,key' });
          if(error) throw error;
          if(sbBatchCache) keys.forEach(k=>{ sbBatchCache[k]=q[k]; });
          keys.forEach(k=>{ sbBatchTs[k]=now; sbDoneSeq[k]=seq; });   // свіжість хмари тепер відома точно
          ok=true;
        }catch(_){ ok=false; }
      }
      // відповідь є — ця партія більше не «в польоті» (якщо ключ уже летить
      // новішим значенням в іншій партії, його не чіпаємо)
      keys.forEach(k=>{ if(sbInFlight[k]===q[k]) delete sbInFlight[k]; });
      if(!ok){
        // НЕ втрачаємо партію: повертаємо ключі в чергу (не затираючи новіші),
        // зберігаємо в outbox і повторюємо з паузою — і одразу коли з'явиться мережа.
        // Ключ НЕ повертаємо, якщо новіше значення вже в черзі, ще летить в іншій
        // партії (у sbInFlight лишається лише чуже, своє ми щойно прибрали) або
        // пізніша партія вже дійшла — інакше старе перемогло б новіше.
        let back = 0;
        keys.forEach(k=>{ if(!(k in sbWriteQueue) && !(k in sbInFlight) && !((sbDoneSeq[k]||0) > seq)){ sbWriteQueue[k]=q[k]; back++; } });
        sbOutboxSave(); sbSyncPending();
        if(!back){
          /* Жодного ключа не повернули: у кожного вже є новіше значення (дійшло,
             летить або чекає в черзі), тож ця невдача нічого не втратила.
             «Помилка» тут збрехала б і застрягла б: повтор побачив би порожню
             чергу і вийшов, не повернувши «synced». Стан вирішить новіша партія;
             якщо ж усе вже в хмарі — кажемо це прямо. */
          if(!Object.keys(sbWriteQueue).length && !Object.keys(sbInFlight).length){
            try{ if(window.__setSync){ window.__flowSync.sbHadError=false; window.__setSync('synced'); } }catch(_){}
          }
          return;
        }
        window.__flowSync.sbHadError = true;
        try{ if(window.__setSync) window.__setSync('error'); }catch(_){}
        if(!sbWriteTimer) sbWriteTimer=setTimeout(sbFlushWrites, 5000);   // бекоф замість тісного циклу
        return;
      }
      // успіх
      sbOutboxSave(); sbSyncPending();
      if(Object.keys(sbWriteQueue).length){
        if(!sbWriteTimer) sbWriteTimer=setTimeout(sbFlushWrites,500);
      } else {
        try{ if(window.__setSync){ window.__flowSync.sbHadError=false; window.__flowSync.last=Date.now(); window.__setSync('synced'); } }catch(_){}
      }
    }
    // віддаємо на випадок, якщо треба «доштовхнути» outbox ззовні (напр. після входу)
    window.sbFlushWrites = sbFlushWrites;
    // скидання: черга в памʼяті більше нічия — викидаємо разом із таймерами (кошик у сховищі стирає wipeLocal)
    window.sbDropQueue = function(){
      if(sbWriteTimer){ clearTimeout(sbWriteTimer); sbWriteTimer=null; }
      if(sbOutboxTimer){ clearTimeout(sbOutboxTimer); sbOutboxTimer=null; }
      sbWriteQueue = {}; sbInFlight = {}; sbOutboxKeys = {}; sbSyncPending();
    };
    // застосунок ховають/закривають: відкладений кошик — у localStorage зараз,
    // черга — в хмару зараз (таймери у фоні iOS можуть уже не спрацювати)
    function sbOnHide(){
      if(sbOutboxTimer) sbOutboxSave();
      if(Object.keys(sbWriteQueue).length){
        sbOutboxSave();
        if(sbWriteTimer){ clearTimeout(sbWriteTimer); sbWriteTimer=null; }
        try{ sbFlushWrites(); }catch(_){}
      }
    }
    document.addEventListener('visibilitychange', ()=>{
      if(document.visibilityState==='hidden') sbOnHide();
      else sbHiding=false;
    });
    try{
      window.addEventListener('pagehide', ()=>{ sbHiding=true; sbOnHide(); });
      window.addEventListener('pageshow', ()=>{ sbHiding=false; });
    }catch(_){}
    // щойно повернулась мережа — спробувати відправити те, що чекає
    try{ window.addEventListener('online', ()=>{ if(Object.keys(sbWriteQueue).length && !sbWriteTimer) sbWriteTimer=setTimeout(sbFlushWrites,300); }); }catch(_){}
    // при старті підхопити незлиті правки з попередньої сесії (відправляться, коли буде сесія)
    try{ sbOutboxLoad(); sbSyncPending(); }catch(_){}

    /* ── СВІЖІСТЬ МІЖ ПРИСТРОЯМИ ──
       Хмара досі читалась лише при запуску та по ручному «↻» — застосунок,
       що висить відкритим на Маку, не бачив правок з телефона, доки його не
       перезапустиш. Тепер: (а) при поверненні до вкладки/застосунку і
       (б) тихим кроком раз на ~2 хв, поки він видимий, звіряємо час-мітки
       (sbPullChanged) і, ТІЛЬКИ якщо в хмарі зʼявилось щось новіше за локальне,
       перечитуємо дані тим самим __load(), що й кнопка «↻». Порожні звірки
       екран не смикають узагалі. */
    /* Звірка у ДВА кроки замість повного скачування. Раніше кожне повернення в
       застосунок і кожні 2 хв тягнули ВСІ значення всіх ключів (дошка з фото —
       ~0.7 МБ) лише для того, щоб порівняти час-мітки. Тепер: (1) лише
       key+updated_at — кілька КБ; (2) значення докачуємо тільки для ключів,
       чия мітка в хмарі не така, як у нашому кеші. Кеш після цього такий самий,
       як після повного читання, тож storage.get() поводиться як раніше. */
    async function sbPullChanged(){
      if(!sb || !sbUserCache) return false;
      if(!sbBatchCache) return sbPrefetchAll();   // кешу ще нема — одне повне читання, як раніше
      try{
        const uid = sbUserCache.id;
        const { data, error } = await sb.from('user_data').select('key,updated_at').eq('user_id', uid).not('key','like','photo:%');
        if(error || !data){ window.__sbCloudOk=false; return false; }
        const stamps = {};
        data.forEach(r=>{ stamps[r.key]=Date.parse(r.updated_at)||0; });
        // ключ зник із хмари — прибрати з кешу, як це зробило б повне читання
        Object.keys(sbBatchCache).forEach(k=>{ if(!(k in stamps)){ delete sbBatchCache[k]; delete sbBatchTs[k]; } });
        const need = Object.keys(stamps).filter(k=> !(k in sbBatchCache) || stamps[k]!==(sbBatchTs[k]||0));
        if(need.length){
          const r2 = await sb.from('user_data').select('key,value,updated_at').eq('user_id', uid).in('key', need);
          if(r2.error || !r2.data){ window.__sbCloudOk=false; return false; }
          // sbFromCloud, як і в sbPrefetchAll: сирий текст (аватарка, ui_mode) — без лапок
          r2.data.forEach(r=>{ sbBatchCache[r.key]=sbFromCloud(r.value); sbBatchTs[r.key]=Date.parse(r.updated_at)||0; });
        }
        window.__sbCloudOk=true;
        return true;
      }catch(_){ window.__sbCloudOk=false; return false; }
    }
    let sbLastPull = 0;
    async function sbPullFresh(){
      if(!sb || !sbUserCache) return;
      if(document.visibilityState !== 'visible') return;
      if(Date.now() - sbLastPull < 30000) return;   // не частіше, ніж раз на 30 с
      // людина щось друкує — не висмикувати поле з-під пальців; наступний крок добере
      try{
        const ae = document.activeElement;
        if(ae && (ae.tagName==='INPUT' || ae.tagName==='TEXTAREA' || ae.isContentEditable)) return;
      }catch(_){}
      sbLastPull = Date.now();
      if(await sbPullAndLoad()){ try{ sbPhotoSync(); }catch(_){} }   // заразом доштовхнути фото, що чекають
    }
    /* Звірка з хмарою І перечитування в памʼять, якщо там новіше. Окремо від
       sbPullFresh (без паузи 30 с і перевірки фокуса), бо потрібна ще й бекапу:
       раніше makeFile тихо оновлював кеш через sbPrefetchAll — мітки зсувались,
       наступний пул уже не бачив змін, екран і памʼять лишались старими, і перша
       ж правка на цьому пристрої (saveBoard пише всю дошку) затирала хмару.
       Правило: хто оновлює кеш і мітки хмари, той і перечитує дані (__load). */
    async function sbPullAndLoad(){
      if(!sb || !sbUserCache) return false;
      const before = Object.assign({}, sbBatchTs);  // час-мітки хмари ДО звірки
      let ok=false; try{ ok = await sbPullChanged(); }catch(_){}
      if(!ok) return false;
      let changed = false;
      for(const k in sbBatchTs){
        const cloudTs = sbBatchTs[k]||0;
        // новим вважаємо лише те, чого ми ще не бачили І що свіжіше за локальну копію
        if(cloudTs > (before[k]||0) && cloudTs > sbLocalVersion(k)){ changed = true; break; }
      }
      // хмара відповіла, а міграції цієї сесії ще відкладені (стартували, поки вона мовчала) —
      // перечитуємо, навіть якщо нового нема: інакше вони чекали б до наступного запуску
      let migWait=false; try{ migWait=!!(window.__flowMigDeferred && window.__flowMigDeferred()); }catch(_){}
      // є незвірені локальні копії ('u'/'g') — звіряє їх load(), тож хмара відповіла — перечитуємо
      const held = Object.keys(keyMark).some(k=>!sbReconciled(k));
      if(!changed && !migWait && !held) return true;
      try{ if(window.__flowSync) window.__flowSync.warmed=false; }catch(_){}
      try{ const ld=window.__load; if(typeof ld==='function') await ld().catch(()=>{}); }catch(_){}
      try{ if(typeof window.renderAccount==='function') window.renderAccount(); }catch(_){}
      try{ if(window.__setSync){ window.__flowSync.last=Date.now(); window.__setSync('synced'); } }catch(_){}
      return true;
    }
    window.sbPullFresh = sbPullFresh;
    window.sbPullAndLoad = sbPullAndLoad;
    document.addEventListener('visibilitychange', ()=>{
      if(document.visibilityState==='visible') sbPullFresh();
    });
    // у фоні не будимо телефон: при поверненні звірку й так робить visibilitychange вище
    visInterval(sbPullFresh, 120000);

    /* ── ФОТО В ХМАРІ ──
       Знімки папок і Карти бажань лежать в IndexedDB (PhotoDB), а в конфіги
       йде лише посилання `idb:ph_…` — тому досі на іншому пристрої фото були
       порожні. Тут їхній власний шлях у ту саму таблицю user_data під ключами
       `photo:<id>`. НАВМИСНО повз чергу-outbox: вона зберігається в
       localStorage, і один знімок міг би переповнити його 5-МБ ліміт. Замість
       цього — прямий upsert, а при невдачі запам'ятовуємо лише СПИСОК id
       (самі дані й так живуть в IndexedDB) і доштовхуємо при наступній
       звірці свіжості чи появі мережі. */
    const PH_KEY = 'photo:';
    const PH_PENDING = 'flowapp___ph_push';   // id-шники, що чекають на відправку
    function phPendingGet(){ try{ const a=JSON.parse(localStorage.getItem(PH_PENDING)||'[]'); return Array.isArray(a)?a:[]; }catch(_){ return []; } }
    function phPendingSet(a){ try{ a.length?localStorage.setItem(PH_PENDING,JSON.stringify(a)):localStorage.removeItem(PH_PENDING); }catch(_){} }
    function phPendingAdd(id){ const a=phPendingGet(); if(!a.includes(id)){ a.push(id); phPendingSet(a); } }
    function phPendingDrop(id){ phPendingSet(phPendingGet().filter(x=>x!==id)); }
    /* Час-мітки НАШОЇ копії кожного знімка ({id: мс}). Потрібні, бо id фото
       стабільні (ph_<папка>, wi_<бажання>): заміна обкладинки на іншому
       пристрої переписує ТОЙ САМИЙ id, і без мітки локальний кеш ніколи б
       не дізнався, що його копія застаріла. Карта крихітна — лише числа. */
    const PH_TS = 'flowapp___ph_ts';
    function phTsGet(){ try{ const o=JSON.parse(localStorage.getItem(PH_TS)||'{}'); return (o&&typeof o==='object')?o:{}; }catch(_){ return {}; } }
    function phTsSet(id, ts){ try{ const o=phTsGet(); o[id]=ts; localStorage.setItem(PH_TS, JSON.stringify(o)); }catch(_){} }
    function phTsDrop(id){ try{ const o=phTsGet(); delete o[id]; localStorage.setItem(PH_TS, JSON.stringify(o)); }catch(_){} }

    window.sbPhotoPush = async function(id){
      if(!id || window.__flowWriteLock) return false;   // скидання: нічого не доливаємо в хмару
      if(!sb || !sbUserCache){ phPendingAdd(id); return false; }
      try{
        const dataUrl = await window.PhotoDB.get(id);
        if(!dataUrl){ phPendingDrop(id); return false; }   // знімок уже стерто — нема чого штовхати
        const now = Date.now();
        const { error } = await sb.from('user_data').upsert(
          { user_id:sbUserCache.id, key:PH_KEY+id, value:dataUrl, updated_at:new Date(now).toISOString() },
          { onConflict:'user_id,key' });
        if(error) throw error;
        phPendingDrop(id); phTsSet(id, now);
        return true;
      }catch(_){ phPendingAdd(id); return false; }
    };
    // opts.peek — лише подивитись (для бекапу): локальної копії не буде, тож і мітку не ставимо
    window.sbPhotoFetch = async function(id, opts){
      if(!id || !sb || !sbUserCache) return null;
      try{
        const { data, error } = await sb.from('user_data').select('value,updated_at').eq('user_id', sbUserCache.id).eq('key', PH_KEY+id).maybeSingle();
        if(error || !data || typeof data.value!=='string') return null;
        if(!(opts && opts.peek)) phTsSet(id, Date.parse(data.updated_at)||Date.now());
        return data.value;
      }catch(_){ return null; }
    };
    /* Які фото лежать у хмарі (лише id, без самих знімків — запит легкий).
       Потрібно бекапу: фото, які на цьому пристрої ще не показувались, є ТІЛЬКИ
       там. null — хмара не відповіла: тоді не можна сказати, чи все є у файлі. */
    /* Сторінками: Supabase віддає за один запит не більше Max Rows (типово 1000) і
       мовчки обрізає решту — тоді бекап вважав би, що докачав усе, а «Стерти все»
       знищило б фото, яких нема у файлі. Крок — фактична довжина сторінки, тож
       працює й тоді, коли стеля сервера менша за 1000. null — «список невідомий»:
       тоді «Стерти все» зупиняється, нічого не стерши. */
    window.sbPhotoList = async function(){
      if(!sb || !sbUserCache) return null;
      const out = []; let from = 0;
      try{
        for(let page=0; page<500; page++){
          const { data, error } = await sb.from('user_data').select('key').eq('user_id', sbUserCache.id)
            .like('key', PH_KEY+'%').order('key', {ascending:true}).range(from, from+999);
          if(error || !Array.isArray(data)) return null;
          if(!data.length) return out;
          data.forEach(r=>{ const id = String(r.key).slice(PH_KEY.length); if(id) out.push(id); });
          from += data.length;
        }
        return null;   // понад 500 сторінок — не віримо, що список повний
      }catch(_){ return null; }
    };
    window.sbPhotoDel = async function(id){
      phPendingDrop(id); phTsDrop(id);
      if(!id || !sb || !sbUserCache) return;
      try{ await sb.from('user_data').delete().eq('user_id', sbUserCache.id).eq('key', PH_KEY+id); }catch(_){}
    };
    /* Повний фото-цикл: (1) одноразово на пристрій+акаунт поставити в чергу
       знімки, збережені ще ДО появи цієї синхронізації; (2) доштовхнути
       чергу — по одному, послідовно, щоб не зліпити мегабайтний запит;
       (3) освіжити локальні копії, які інший пристрій встиг замінити
       (звірка йде легким запитом лише id + час-мітка, без самих фото). */
    let phSyncBusy=false;
    async function sbPhotoSync(){
      if(phSyncBusy || !sb || !sbUserCache) return;
      phSyncBusy=true;
      try{
        const { data, error } = await sb.from('user_data').select('key,updated_at').eq('user_id', sbUserCache.id).like('key', PH_KEY+'%');
        if(error) throw error;
        const cloud={}; (data||[]).forEach(r=>{ cloud[r.key.slice(PH_KEY.length)]=Date.parse(r.updated_at)||0; });
        // (1) backfill старих знімків
        const doneKey='flowapp___ph_backfill_'+sbUserCache.id;
        let backfillDone=false; try{ backfillDone=!!localStorage.getItem(doneKey); }catch(_){}
        if(!backfillDone){
          const local = await window.PhotoDB.all();
          Object.keys(local).forEach(id=>{ if(!(id in cloud)) phPendingAdd(id); });
          try{ localStorage.setItem(doneKey,'1'); }catch(_){}
        }
        // (2) відправка черги
        for(const id of phPendingGet()){ await window.sbPhotoPush(id); }
        // (3) застарілі локальні копії; відсутні локально не чіпаємо —
        //     їх дотягне photoSrc ліниво, коли вони знадобляться рендеру
        const ts=phTsGet(); let refreshed=false;
        for(const id in cloud){
          if(cloud[id] <= (ts[id]||0)) continue;
          if(!(window.__photoCache && window.__photoCache[id])) continue;
          const v = await window.sbPhotoFetch(id);
          if(v){ try{ await window.PhotoDB.put(id, v); }catch(_){} window.__photoCache[id]=v; refreshed=true; }
        }
        if(refreshed){ try{ __photoPoke(); }catch(_){} }
      }catch(_){}
      phSyncBusy=false;
    }
    window.sbPhotoSync = sbPhotoSync;
    try{ window.addEventListener('online', ()=>{ setTimeout(sbPhotoSync, 1000); }); }catch(_){}

    /* Стерти ВСІ дані акаунта в хмарі (разом із фото). Викликається лише
       з «Стерти все з акаунта» — після обовʼязкового бекапу у файл. */
    window.sbWipeAll = async function(){
      if(!sb || !sbUserCache) return false;
      try{
        const { error } = await sb.from('user_data').delete().eq('user_id', sbUserCache.id);
        if(error) throw error;
        sbBatchCache={}; sbBatchTs={}; sbWriteQueue={}; sbInFlight={};
        sbOutboxSave(); sbSyncPending();
        return true;
      }catch(_){ return false; }
    };
    window.storage.set = async function(key, value){
      const auto = autoDepth > 0;
      // SYNC-2: автоматичний запис (усередині storeAuto) у ключ, який ця сесія
      // не прочитала, не пишемо ні локально, ні в хмару — лише памʼять: сховище
      // ще не сказало, що там лежить, і заглушка затерла б справжні дані.
      if(auto && !window.storeKeyReady(key)){
        try{ console.warn('[Flow storage] автозапис пропущено — ключ не прочитано (сховище мовчало):', key); }catch(_){}
        return { key, value, shared:false, _skipped:true };
      }
      // Запобіжник від затирання порожнечею: якщо ключ не прочитався при старті
      // (пошкоджений), не даємо його ПОРОЖНІМ дефолтом стерти добру копію. Щойно
      // прийдуть реальні дані — знімаємо позначку й зберігаємо як звичайно.
      if(window.__storeCorrupt && window.__storeCorrupt.has(key)){
        const empty = value==null || value==='' || value==='[]' || value==='{}';
        if(empty){ try{ console.warn('[Flow storage] пропущено запис порожнечею в пошкоджений ключ:', key); }catch(_){} return { key, value, shared:false, _skipped:true }; }
        window.__storeCorrupt.delete(key);
      }
      const meta = sbWriteMeta(key, auto);   // мітка (SYNC-1) і позначка «не звірено» — до першого await
      // ЗАВЖДИ пишемо локально одразу (синхронно всередині origSet) — це страховка
      // на випадок, якщо сторінку закриють до завершення мережевого запиту в Supabase
      const pLocal = origSet(key, value, false, meta);   // сама копія лягає синхронно
      if(Object.prototype.hasOwnProperty.call(keyRead, key)){ if(meta.m) keyMark[key] = meta.m; else delete keyMark[key]; }
      const localResult = await pLocal;
      /* Незвірена копія ('u'/'g') у хмару не йде: це правка поверх непрочитаного
         чи гостьового. Піде після звірки (sbReconcile) — злитою з хмарним, а не
         замість нього. Черга/outbox її не тримає: копія з позначкою сама і є
         «ще не відправлено», і переживає перезапуск. */
      if(meta.m) return localResult;
      const u = sbUserCache;
      if(u && sb) sbScheduleWrite(key, value);
      return localResult;
    };
    window.storage.delete = async function(key){
      const localResult = await origDelete(key);
      const u = sbUserCache;
      if(u && sb){
        try{ await sb.from('user_data').delete().eq('user_id', u.id).eq('key', key); }catch(_){}
        if(sbBatchCache) delete sbBatchCache[key];
        if((sbWriteQueue && key in sbWriteQueue) || key in sbInFlight){ delete sbWriteQueue[key]; delete sbInFlight[key]; sbOutboxSaveSoon(key); }   // інакше стертий ключ воскрес би з кошика після перезапуску
      }
      return localResult;
    };
    window.storage.list = async function(prefix){
      const u = sbUserCache;
      if(u && sb){
        const { data, error } = await sb.from('user_data').select('key').eq('user_id', u.id).like('key', (prefix||'')+'%');
        const keys = (!error && data) ? data.map(r=>r.key) : [];
        return { keys, prefix, shared:false };
      }
      return origList(prefix);
    };
  })();

  /* ============ PREF SYNC ============
     Легкі UI-налаштування (тема, розкладка, zen тощо) читаються синхронно при
     старті — тому лишаємо миттєвий localStorage.setItem як є, але дублюємо
     запис у window.storage, щоб значення також їхало в CloudStorage і
     підхоплювалось на інших пристроях. prefCatchup підтягує хмарне значення
     вже ПІСЛЯ першого малювання екрану (не блокує старт). */
  function prefSet(key, raw){
    try{ localStorage.setItem(key, raw); }catch(_){}
    try{ const p=window.storage.set(key, raw, false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
  }
  function prefCatchup(key, applyFn){
    try{
      const p = window.storage.get(key);
      if(p && p.then) p.then(r=>{
        if(r && r.value!=null && r.value !== localStorage.getItem(key)){
          try{ localStorage.setItem(key, r.value); }catch(_){}
          try{ applyFn(r.value); }catch(_){}
        }
      }).catch(()=>{});
    }catch(_){}
  }

  /* ── Режим Lite/Pro: один організм, два шари. Lite = фільтр поверх тих самих даних ── */
  const UIMODE_KEY='ui_mode';
  window.uiMode=(function(){ try{ const v=localStorage.getItem(UIMODE_KEY); return v==='lite'?'lite':'pro'; }catch(_){ return 'pro'; } })();
  function applyUiMode(){ try{ document.body.classList.toggle('mode-lite', window.uiMode==='lite'); }catch(_){} }
  function setUiMode(m){
    m=(m==='lite')?'lite':'pro';
    const changed=(m!==window.uiMode);
    window.uiMode=m; prefSet(UIMODE_KEY,m); applyUiMode();
    if(!changed) return;
    try{ window.platform.haptic('light'); }catch(_){}
    if(m==='lite'){ try{ goPlanner(); }catch(_){} }
  }
  window.setUiMode=setUiMode;
  applyUiMode();
  prefCatchup(UIMODE_KEY, v=>{ window.uiMode=(v==='lite')?'lite':'pro'; applyUiMode(); });


  /* ============ BACKUP / EXPORT / IMPORT ============ */
  (function(){
    const LP = 'flowapp_';                 // той самий префікс, що й у storage
    const FORMAT = 1;                       // версія формату бекапу (не плутати з версією схеми даних)
    const APP = 'flow';
    const ZIP_JSON = 'frequency-backup.json';   // дані всередині «повного бекапу з фото»
    /* Службові ключі з подвійним підкресленням (flowapp___sb_outbox — кошик
       синку, ___ph_push / ___ph_ts / ___ph_backfill_* — черга й мітки фото,
       ___seeded — прапорець Preferences) описують стан ЦЬОГО пристрою, а не
       дані людини. Раніше вони йшли в бекап, і відновлений старий кошик
       повторно відправляв би в хмару давні правки. */
    function isSvc(short){ return String(short).slice(0,2)==='__'; }
    /* Звірка з FLOW_KEYS (01-base.js): з усього реєстру лише ці пишуться
       СИРИМИ (без flowapp_), тож збір за префіксом їх не бачив.
       i18n_content_cache — кеш перекладу, його не беремо. */
    const RAW_DATA = ['lang_pref'];
    // ключі, які МУСЯТЬ читатись як JSON — інакше файл пошкоджений і відновлювати не можна
    const JSON_KEYS = ['folders_cfg','folders_order','folders_deleted_v1','chats_v1','board','goals_data',
      'diary_entries_v1','diary_books_v1','fin_ops','wishes_board'];

    // Зібрати ВЕСЬ стан Flow у один обʼєкт (у форматі localStorage: {_v,d})
    function collect(){
      const data = {};
      try{
        for(const k of Object.keys(localStorage)){
          if(!k.startsWith(LP)) continue;
          const short = k.slice(LP.length);
          if(!isSvc(short)) data[short] = localStorage.getItem(k);
        }
      }catch(_){}
      // з входом у Google хмарна копія буває свіжішою за локальну (правили на
      // іншому пристрої) — у бекап має піти те, що людина бачить на екрані
      try{
        const fr = window.sbCloudFresher && window.sbCloudFresher();
        if(fr) Object.keys(fr).forEach(k=>{ if(!isSvc(k)) data[k] = fr[k]; });
      }catch(_){}
      return data;
    }
    function collectRaw(){
      const r = {};
      RAW_DATA.forEach(k=>{ try{ const v = localStorage.getItem(k); if(v!=null) r[k] = v; }catch(_){} });
      return r;
    }

    // Скільки ключів / приблизний розмір — для UI
    function stats(){
      const d = collect(); const keys = Object.keys(d);
      let bytes = 0; try{ bytes = new Blob([JSON.stringify(d)]).size; }catch(_){ bytes = JSON.stringify(d).length; }
      return { keys: keys.length, bytes };
    }
    // розмір фото з base64 (×3/4), без декодування
    function phBytes(v){ const i = v.indexOf(','); return i>0 ? Math.floor((v.length-i-1)*3/4) : v.length; }
    const signedIn = ()=>!!(window.sbUser && window.sbUser());
    /* Лічильник для кнопки «Повний бекап з фото»: фото з IndexedDB (PhotoDB) на
       цьому пристрої + з входом у Google — скільки ще лежить ЛИШЕ в хмарі
       (photo:<id>; їх бекап докачає). cloudOnly === null — хмара не відповіла.
       opts.cloud:false — лише пристрій, без запиту до хмари;
       opts.list — уже запущений sbPhotoList() (makeFile пускає його паралельно зі звіркою). */
    async function photoStats(opts){
      let all = {};
      try{ if(window.PhotoDB && window.PhotoDB.available()) all = await window.PhotoDB.all(); }catch(_){}
      let count = 0, bytes = 0;
      Object.keys(all).forEach(id=>{
        const v = all[id]; if(typeof v!=='string' || !v){ delete all[id]; return; }
        count++; bytes += phBytes(v);
      });
      let cloudOnly = 0, cloudIds = [];
      if(!(opts && opts.cloud===false) && signedIn() && window.sbPhotoList){
        const ids = await ((opts && opts.list) || window.sbPhotoList());
        if(ids){ cloudIds = ids.filter(id=>!Object.prototype.hasOwnProperty.call(all, id)); cloudOnly = cloudIds.length; }
        else cloudOnly = null;
      }
      return { count, bytes, all, cloudOnly, cloudIds };
    }
    /* Усі фото для повного бекапу: з пристрою + докачані з хмари ті, яких тут нема.
       Раніше бралось лише PhotoDB — фото, що жили тільки в хмарі, у файл не йшли,
       а «Стерти все» потім видаляло їх назавжди.
       onProgress(done, total) — чесний лічильник докачування для екрана.
       missing — скільки не вдалося докачати; unchecked — хмара не сказала, що в ній є. */
    async function gatherPhotos(onProgress, list){
      const ps = await photoStats({ list });
      const res = { all: ps.all, count: ps.count, bytes: ps.bytes, fromCloud: 0, missing: 0, unchecked: ps.cloudOnly===null };
      const need = ps.cloudIds || [];
      const tell = (d)=>{ try{ if(onProgress) onProgress(d, need.length); }catch(_){} };
      for(let i=0; i<need.length; i++){
        tell(i);
        let v = null; try{ v = await window.sbPhotoFetch(need[i], {peek:true}); }catch(_){}
        if(typeof v==='string' && v){ res.all[need[i]] = v; res.count++; res.bytes += phBytes(v); res.fromCloud++; }
        else res.missing++;
      }
      if(need.length) tell(need.length);
      /* Докачування може йти хвилинами, а застосунок тим часом живий: фото, додане
         зараз, уже є в даних, але його не було в першому знімку PhotoDB. Дочитуємо. */
      if(need.length){
        try{
          const now = (window.PhotoDB && window.PhotoDB.available()) ? await window.PhotoDB.all() : {};
          Object.keys(now).forEach(id=>{
            const v = now[id];
            if(typeof v==='string' && v && !Object.prototype.hasOwnProperty.call(res.all, id)){ res.all[id] = v; res.count++; res.bytes += phBytes(v); }
          });
        }catch(_){}
      }
      return res;
    }

    // Згорнути все у JSON-конверт з метаданими (extra — додаткові поля, напр. опис фото)
    function makeEnvelope(extra){
      const data = collect();
      return JSON.stringify(Object.assign({
        app: APP,
        format: FORMAT,
        exportedAt: new Date().toISOString(),
        keyCount: Object.keys(data).length,
        data,
        raw: collectRaw()
      }, extra||{}), null, 0);
    }

    // JSZip лежить у vendor/ і потрібен рідко — вантажимо лише коли справді треба
    async function loadZip(){
      if(window.JSZip) return window.JSZip;
      try{ if(typeof loadScriptOnce==='function') await loadScriptOnce(['vendor/jszip.min.js','https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js']); }catch(_){}
      return window.JSZip || null;
    }
    const PH_EXT = { 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp', 'image/gif':'gif' };
    function dataUrlParts(v){
      const m = /^data:([^;,]*)(;base64)?,/.exec(String(v||''));
      if(!m) return null;
      return { mime: m[1]||'application/octet-stream', b64: !!m[2], body: String(v).slice(m[0].length) };
    }

    /* Готовий файл бекапу (ще НЕ збережений): { name, blob, type, photos,
       photosFromCloud, photosMissing, photosUnchecked }.
       opts.photos: true — «повний бекап з фото» (zip: дані + кожне фото окремим
       файлом); 'auto' — zip лише якщо фото є; інакше — звичайний .json.
       З входом у Google фото, яких нема на пристрої, докачуються з хмари;
       opts.cloudPhotos:false — лише фото з пристрою (скидання пристрою: хмара лишається).
       opts.onProgress({stage:'photos', done, total} | {stage:'zip'}) — для екрана. */
    async function makeFile(opts){
      opts = opts || {};
      // список фото в хмарі — паралельно зі звіркою нижче, а не після неї: інакше на
      // повільному звʼязку бекап чекав би два запити поспіль
      const withCloudPh = !!opts.photos && opts.cloudPhotos!==false && signedIn() && !!window.sbPhotoList;
      const listP = withCloudPh ? window.sbPhotoList() : null;
      // хмара могла змінитись після останньої звірки — освіжаємо, щоб бекап збігся з екраном.
      // Саме звірка з перечитуванням (як пул при фокусі), а не голий sbPrefetchAll:
      // той зсував мітки без __load, і свіжа правка з телефона потім затиралась старою памʼяттю
      if(window.sbUser && window.sbUser() && window.sbPullAndLoad){
        try{ await Promise.race([ window.sbPullAndLoad(), new Promise(r=>setTimeout(r, 8000)) ]); }catch(_){}
      }
      const stamp = ymdLocal();
      const prog = (p)=>{ try{ if(opts.onProgress) opts.onProgress(p); }catch(_){} };
      let ps = null, extra = { photosFromCloud:0, photosMissing:0, photosUnchecked:false };
      if(opts.photos){
        if(!withCloudPh){ ps = await photoStats({cloud:false}); ps.fromCloud = 0; ps.missing = 0; ps.unchecked = false; }
        else ps = await gatherPhotos((done, total)=>prog({ stage:'photos', done, total }), listP);
        extra = { photosFromCloud:ps.fromCloud, photosMissing:ps.missing, photosUnchecked:ps.unchecked };
        if(opts.photos==='auto' && !ps.count) ps = null;
      }
      if(!ps){
        return Object.assign({ name:`flow-backup-${stamp}.json`, type:'application/json', photos:0,
                 blob: new Blob([makeEnvelope()], {type:'application/json'}) }, extra);
      }
      prog({ stage:'zip' });
      const JSZip = await loadZip();
      if(!JSZip) throw new Error('не вдалося завантажити модуль zip — зроби звичайний бекап без фото');
      const zip = new JSZip(), map = {};
      Object.keys(ps.all).forEach(id=>{
        const p = dataUrlParts(ps.all[id]); if(!p) return;
        const file = 'photos/'+encodeURIComponent(id)+'.'+(PH_EXT[p.mime]||'bin');
        // JPEG уже стиснутий — пакуємо як є, стискаємо лише дані JSON
        if(p.b64) zip.file(file, p.body, { base64:true, compression:'STORE' });
        else zip.file(file, decodeURIComponent(p.body), { compression:'STORE' });
        map[id] = { file, mime:p.mime };
      });
      zip.file(ZIP_JSON, makeEnvelope({ photos:map }), { compression:'DEFLATE' });
      const blob = await zip.generateAsync({ type:'blob', mimeType:'application/zip' });
      return Object.assign({ name:`flow-backup-${stamp}-photos.zip`, type:'application/zip', photos:Object.keys(map).length, blob }, extra);
    }

    // Зберегти файл і сказати ПРАВДУ, чи він є. Раніше після a.click() відповідь
    // завжди була ok:true — хоча в iPhone-обгортці <a download> нічого не пише,
    // а на Mac діалог збереження можна скасувати. «Стерти все» спиралось на цей «бекап».
    //   { ok:true,  saved:true }  — файл точно віддано: діалог «Зберегти як…»
    //                               чи аркуш «Поділитися» завершились успіхом
    //   { ok:true,  saved:false } — віддали браузеру на завантаження; чи
    //                               файл з'явився, сторінка знати не може
    //   { ok:false, cancelled:true } — людина закрила діалог: файлу НЕМА
    async function saveBlob(f){
      const { name, blob, type } = f;
      const ext = name.slice(name.lastIndexOf('.'));
      const cancelled = { ok:false, cancelled:true, name, error:'збереження скасовано — файл не записано' };
      // 1) діалог «Зберегти як…» (Chrome, Edge, застосунок на Mac): результат відомий напевно
      if(typeof window.showSaveFilePicker==='function'){
        try{
          const h = await window.showSaveFilePicker({ suggestedName:name,
            types:[{ description:'Frequency backup', accept:{ [type]:[ext] } }] });
          const w = await h.createWritable(); await w.write(blob); await w.close();
          return { ok:true, saved:true, how:'picker', name:h.name||name };
        }catch(e){
          if(e && e.name==='AbortError') return cancelled;
          // інша відмова (нема дозволу тощо) — пробуємо наступний спосіб
        }
      }
      // 2) iPhone/iPad і native-обгортка: там <a download> файл не пише,
      //    а в аркуші «Поділитися» є «Зберегти у Файли»
      const ios = window.FLOW_NATIVE || /iPad|iPhone|iPod/.test(navigator.userAgent||'') ||
                  (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
      if(ios && navigator.share && typeof File==='function'){
        try{
          const file = new File([blob], name, {type});
          if(!navigator.canShare || navigator.canShare({files:[file]})){
            await navigator.share({ files:[file], title:name });
            return { ok:true, saved:true, how:'share', name };
          }
        }catch(e){
          if(e && e.name==='AbortError') return cancelled;
          // в обгортці застосунку <a download> нижче нічого не пише — не вдаємо, що файл
          // «передано на завантаження»: скидання спитало б «файл є?», а його нема
          if(window.FLOW_NATIVE) return { ok:false, name, error:'аркуш «Поділитися» не відкрився ('+((e&&e.name)||'помилка')+') — файл не записано' };
        }
      }
      // 3) звичайне завантаження — останній варіант, результат невідомий
      try{
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name; document.body.appendChild(a); a.click();
        // не 0 мс: Safari читає blob асинхронно і з миттєвим revoke міг лишитись без файла
        setTimeout(()=>{ try{ document.body.removeChild(a); URL.revokeObjectURL(url); }catch(_){} }, 1500);
        return { ok:true, saved:false, how:'download', name };
      }catch(e){ return { ok:false, error:String(e) }; }
    }
    // Зберегти вже зібраний файл (з makeFile) — викликати прямо з натискання
    async function saveFile(f){
      const r = await saveBlob(f);
      r.photos = f.photos; r.bytes = f.blob.size;
      r.photosFromCloud = f.photosFromCloud||0; r.photosMissing = f.photosMissing||0; r.photosUnchecked = !!f.photosUnchecked;
      return r;
    }
    // чого з фото бракує у файлі — людськими словами ('' — усе на місці)
    function photosGap(f){
      if(f.photosUnchecked) return 'не вдалося перевірити, які фото лежать у хмарі (нема звʼязку?)';
      if(f.photosMissing) return 'не вдалося докачати з хмари '+f.photosMissing+' фото';
      return '';
    }
    /* Чи ще діє дозвіл від натискання (user activation). Аркуш «Поділитися» і
       діалог «Зберегти як…» відкриваються лише одразу після дотику, а перед ними
       тепер звірка з хмарою (до 8 с) і пакування zip. Якщо дозвіл минув, на iPhone
       share кидав помилку і все падало в <a download>, який в обгортці нічого не
       пише, — а скидання питало «файл є?». Де браузер не каже напевно — вважаємо
       свіжим лише перші 800 мс. */
    function tapStillFresh(t0){
      try{ const ua = navigator.userActivation; if(ua && typeof ua.isActive==='boolean') return ua.isActive; }catch(_){}
      return Date.now()-t0 < 800;
    }
    // Експорт: зібрати файл (opts.photos — див. makeFile) і зберегти його.
    // Дозвіл від натискання минув, поки збирали, — повертаємо крок 'tap' з готовим
    // файлом: екран покаже кнопку «Зберегти», і її свіжий дотик відкриє аркуш.
    // opts.needAllPhotos — перед «Стерти все»: якщо хоч одного фото з хмари у файлі
    // нема, зупиняємось ДО збереження (крок 'photos') — стирати не можна.
    async function exportToFile(opts){
      const t0 = Date.now();
      let f;
      try{ f = await makeFile(opts); }catch(e){ return { ok:false, error:String((e&&e.message)||e) }; }
      const gap = photosGap(f);
      if(opts && opts.needAllPhotos && gap){
        return { ok:false, step:'photos', missing:f.photosMissing||0, unchecked:!!f.photosUnchecked,
                 error: gap+' — без них у файлі хмару стирати не можна. Нічого не стерто; спробуй ще раз, коли звʼязок буде кращим' };
      }
      if(!tapStillFresh(t0)) return { ok:false, step:'tap', file:f, name:f.name, photos:f.photos, bytes:f.blob.size,
                                      photosFromCloud:f.photosFromCloud||0, photosMissing:f.photosMissing||0, photosUnchecked:!!f.photosUnchecked };
      return saveFile(f);
    }

    // Аварійний знімок у самій localStorage (на випадок "зламав — відкоти")
    function snapshot(){
      try{ localStorage.setItem('__flow_snapshot__', makeEnvelope()); return true; }catch(_){ return false; }
    }
    function restoreSnapshot(){
      try{ const s = localStorage.getItem('__flow_snapshot__'); if(!s) return false; return applyEnvelope(s, {makeSafetyCopy:false}); }catch(_){ return false; }
    }

    // значення у форматі localStorage ({_v,d} чи сирий рядок) → рядок даних
    function unwrapVal(raw){
      try{ const o = JSON.parse(raw); if(o && typeof o==='object' && '_v' in o && 'd' in o) return typeof o.d==='string' ? o.d : JSON.stringify(o.d); }catch(_){}
      return raw;
    }
    // розібраний обʼєкт даних ключа (без обгортки версії схеми {__sv,d}) або null
    function valOf(env, k){
      const raw = env.data[k]; if(typeof raw!=='string') return null;
      try{
        let o = JSON.parse(unwrapVal(raw));
        if(o && typeof o==='object' && !Array.isArray(o) && '__sv' in o && 'd' in o) o = o.d;
        return o;
      }catch(_){ return null; }
    }
    // Перевірити структуру конверта, НІЧОГО не записуючи
    function checkEnvelope(json){
      let env;
      try{ env = JSON.parse(json); }catch(_){ return { ok:false, error:'Файл не є коректним JSON' }; }
      if(!env || env.app !== APP || !env.data || typeof env.data !== 'object' || Array.isArray(env.data)){
        return { ok:false, error:'Це не схоже на бекап Frequency' };
      }
      if(env.format > FORMAT){
        return { ok:false, error:'Бекап з новішої версії застосунку. Онови Frequency.' };
      }
      const bad = [];
      Object.keys(env.data).forEach(k=>{
        const v = env.data[k];
        if(typeof v!=='string'){ bad.push(k); return; }
        if(JSON_KEYS.includes(k)){ try{ JSON.parse(unwrapVal(v)); }catch(_){ bad.push(k); } }
      });
      if(bad.length) return { ok:false, error:'Файл пошкоджений — не читаються: '+bad.slice(0,5).join(', ') };
      return { ok:true, env };
    }
    function plural(n, one, few, many){
      const a = n%10, b = n%100;
      return n+' '+(a===1 && b!==11 ? one : (a>=2 && a<=4 && (b<12 || b>14) ? few : many));
    }
    // Підсумок «що буде відновлено» — людина бачить його ДО того, як щось перезапишеться
    function summarize(env, photos, missing){
      const parts = [];
      const fc = valOf(env,'folders_cfg'); if(fc && typeof fc==='object') parts.push(plural(Object.keys(fc).length,'папка','папки','папок'));
      const ch = valOf(env,'chats_v1'); if(Array.isArray(ch)) parts.push(plural(ch.length,'чат','чати','чатів'));
      let dn = 0;
      const de = valOf(env,'diary_entries_v1'); if(de && typeof de==='object') dn += Object.keys(de).length;
      const db = valOf(env,'diary_books_v1');
      if(db && db.entries && typeof db.entries==='object') Object.keys(db.entries).forEach(b=>{ if(Array.isArray(db.entries[b])) dn += db.entries[b].length; });
      if(dn) parts.push(plural(dn,'запис щоденника','записи щоденника','записів щоденника'));
      const bd = valOf(env,'board');
      if(bd && typeof bd==='object'){ let n=0; Object.keys(bd).forEach(k=>{ if(Array.isArray(bd[k])) n += bd[k].length; });
        if(n) parts.push(plural(n,'блок у документах і чатах','блоки в документах і чатах','блоків у документах і чатах')); }
      const gd = valOf(env,'goals_data'); if(gd && Array.isArray(gd.goals) && gd.goals.length) parts.push(plural(gd.goals.length,'ціль','цілі','цілей'));
      const fo = valOf(env,'fin_ops'); if(Array.isArray(fo) && fo.length) parts.push(plural(fo.length,'фінансова операція','фінансові операції','фінансових операцій'));
      const wb = valOf(env,'wishes_board'); if(Array.isArray(wb) && wb.length) parts.push(plural(wb.length,'бажання','бажання','бажань'));
      const np = photos ? Object.keys(photos).length : 0;
      parts.push(np ? np+' фото' : 'фото в цьому файлі немає');
      const keys = Object.keys(env.data).filter(k=>!isSvc(k)).length;
      let text = 'Буде відновлено: '+parts.join(', ')+' (усього '+plural(keys,'розділ','розділи','розділів')+' даних).';
      if(missing) text += ' Не вдалося прочитати фото: '+missing+'.';
      return { parts, keys, photos:np, missing:missing||0, exportedAt:env.exportedAt||'', text };
    }

    function readFile(file, how){
      return new Promise((res, rej)=>{
        const r = new FileReader();
        r.onload = ()=> res(r.result);
        r.onerror = ()=> rej(r.error || new Error('read'));
        if(how==='buf') r.readAsArrayBuffer(file); else r.readAsText(file);
      });
    }
    /* Крок 1 відновлення: прочитати файл (.json чи .zip з фото) і перевірити
       структуру. НІЧОГО не пише — повертає { ok, env, photos, summary }. */
    async function inspectFile(file){
      let text = null, zip = null;
      try{
        const head = new Uint8Array(await readFile(file.slice(0,2), 'buf'));
        if(head[0]===0x50 && head[1]===0x4b){          // 'PK' — це zip
          const JSZip = await loadZip();
          if(!JSZip) return { ok:false, error:'Не вдалося відкрити zip: модуль не завантажився' };
          zip = await JSZip.loadAsync(await readFile(file, 'buf'));
          const jf = zip.file(ZIP_JSON);
          if(!jf) return { ok:false, error:'У zip немає '+ZIP_JSON+' — це не бекап Frequency' };
          text = await jf.async('string');
        } else text = String(await readFile(file, 'text'));
      }catch(e){ return { ok:false, error:'Не вдалося прочитати файл: '+String((e&&e.message)||e) }; }
      const chk = checkEnvelope(text); if(!chk.ok) return chk;
      const env = chk.env;
      let photos = null, missing = 0;
      if(zip && env.photos && typeof env.photos==='object'){
        photos = {};
        for(const id of Object.keys(env.photos)){
          const m = env.photos[id]; const zf = m && m.file && zip.file(m.file);
          if(!zf){ missing++; continue; }
          try{ photos[id] = 'data:'+(m.mime||'image/jpeg')+';base64,'+(await zf.async('base64')); }catch(_){ missing++; }
        }
      }
      return { ok:true, env, photos, summary: summarize(env, photos, missing) };
    }

    // Розпакувати конверт (рядок чи вже перевірений обʼєкт) назад у localStorage
    // opts.makeSafetyCopy: перед перезаписом зробити авто-знімок поточного стану
    function applyEnvelope(src, opts){
      opts = opts || {};
      let env = src;
      if(typeof src==='string'){ const c = checkEnvelope(src); if(!c.ok) return c; env = c.env; }
      if(opts.makeSafetyCopy !== false) snapshot();
      let restored = 0;
      try{
        for(const k of Object.keys(env.data)){
          if(isSvc(k)) continue;           // старі бекапи несли й службові ключі — стан чужого пристрою
          localStorage.setItem(LP + k, env.data[k]);
          restored++;
        }
        if(env.raw && typeof env.raw==='object') RAW_DATA.forEach(k=>{ if(typeof env.raw[k]==='string') localStorage.setItem(k, env.raw[k]); });
      }catch(e){ return { ok:false, error:'Не вистачило памʼяті: '+String(e), restored }; }
      return { ok:true, restored, exportedAt: env.exportedAt };
    }

    /* Відновлене має стати НАЙСВІЖІШИМ записом. Мітка _v у бекапі стара, тож
       без перепису (а) з входом у Google хмара з новішою міткою перемагала при
       першому ж читанні — відновлення мовчки не діяло; (б) на iPhone
       Preferences з новішою міткою так само підняли б старе при старті.
       Тому кожен ключ даних переписуємо через window.storage.set: свіжа мітка →
       localStorage + Preferences + черга в хмару. Сирі прапорці міграцій (не
       {_v,d}) не чіпаємо — вони й не синхронізуються. */
    async function pushRestored(keys, photos){
      let n = 0;
      for(const k of keys){
        if(isSvc(k)) continue;
        let wrapped = false;
        try{ const o = JSON.parse(localStorage.getItem(LP+k)); wrapped = !!(o && typeof o==='object' && '_v' in o && 'd' in o); }catch(_){}
        if(!wrapped) continue;
        const v = window.storage.getLocal(k); if(v==null) continue;
        try{ await window.storage.set(k, v, false); n++; }catch(_){}
      }
      if(!(window.sbUser && window.sbUser())) return { cloud:false, keys:n };
      // відновлення — крок назад у часі: «надгробки» папок, які інші пристрої
      // ще тримають у памʼяті, більше не діють (інакше вони знову стерли б
      // щойно відновлені папки). Без входу інших пристроїв нема — не чіпаємо.
      try{ if(typeof window.folderTombsReset==='function') await window.folderTombsReset(); }catch(_){}
      // у хмару одразу, не чекаючи таймера: далі сторінка перезапуститься
      try{ if(window.sbFlushWrites) await window.sbFlushWrites(); }catch(_){}
      let phOk = 0, phFail = 0;
      if(photos && window.sbPhotoPush){
        for(const id of Object.keys(photos)){ try{ if(await window.sbPhotoPush(id)) phOk++; else phFail++; }catch(_){ phFail++; } }
      }
      const pending = (window.__flowSync && window.__flowSync.sbPending) || 0;
      return { cloud:true, keys:n, pending, phOk, phFail };
    }
    /* Крок 2 відновлення (після підтвердження людиною): записати дані й фото,
       зробити їх найсвіжішими і — з входом у Google — відправити в хмару. */
    async function applyInspected(ins, opts){
      opts = opts || {};
      if(!ins || !ins.ok || !ins.env) return { ok:false, error:'Нема що відновлювати' };
      const r = applyEnvelope(ins.env, { makeSafetyCopy: opts.makeSafetyCopy!==false });
      if(!r.ok) return r;
      let ph = 0;
      if(ins.photos && window.PhotoDB && window.PhotoDB.available()){
        for(const id of Object.keys(ins.photos)){
          try{ await window.PhotoDB.put(id, ins.photos[id]); window.__photoCache[id] = ins.photos[id]; ph++; }catch(_){}
        }
      }
      r.photos = ph;
      const c = await pushRestored(Object.keys(ins.env.data), ins.photos);
      r.cloud = c.cloud; r.pending = c.pending||0; r.phFail = c.phFail||0;
      return r;
    }

    // Імпорт із файлу одним кроком (перевірка + запис) — для старих викликів
    async function importFromFile(file){
      const ins = await inspectFile(file);
      if(!ins.ok) return ins;
      return applyInspected(ins, {makeSafetyCopy:true});
    }

    window.flowBackup = { collect, stats, photoStats, makeFile, saveFile, exportToFile, inspectFile, applyInspected,
                          importFromFile, snapshot, restoreSnapshot, FORMAT };
  })();

  /* ============ СКИДАННЯ ДО ЗАВОДСЬКИХ ============
     Дві дії з екрана «Ще»:
       • «Скинути цей пристрій» (wipeCloud:false) — чистить усе локальне,
         але ЛИШАЄ сесію Google: після перезапуску дані повертаються з
         хмари чистим дзеркалом акаунта.
       • «Стерти все з акаунта» (wipeCloud:true) — плюс видаляє всі рядки
         в хмарі й виходить з акаунта. Незворотно.
     Обидві починаються з експорту бекапу у файл — без нього не рушаємо.
     Книжки читалки (BookDB) в бекап не входять — екран чесно попереджає.
     IndexedDB тут лише позначається прапорцем: бази видаляє ранній хук
     на наступному старті (див. верх файлу), бо відкриті зʼєднання
     блокують deleteDatabase. На iPhone стирається й копія в Preferences
     (storage.nativeWipe → npWipeAll), інакше старт повернув би все назад. ============ */
  window.flowFactoryReset = async function(opts){
    const o=opts||{};
    // 1) страховка: бекап у файл. Не вдався чи скасовано — зупиняємось.
    //    Якщо файл лише віддано на завантаження (saved:false), сторінка не знає,
    //    чи він є, — повертаємо крок 'backup-confirm': екран спитає людину і
    //    викличе нас знову з backupConfirmed:true (без повторного експорту).
    //    Фото (PhotoDB) скидання теж стирає — тож якщо вони є, бекап іде zip-ом
    //    разом із ними. Книжки (BookDB) не беремо: вони великі, їх завантажують знову.
    //    Крок 'tap': файл зібрано, але дозвіл від натискання минув (звірка з хмарою,
    //    zip) — екран дає кнопку «Зберегти» і кличе нас знову з o.file (вже зібраним).
    //    «Стерти все» видаляє і рядки photo:<id> у хмарі — тож фото, яких нема на
    //    пристрої, спершу докачуємо у файл; не вийшло хоч з одним — зупиняємось
    //    (крок 'photos'), нічого не стерто. «Скинути пристрій» хмару лишає: у файл —
    //    фото з пристрою, решта повернеться з хмари.
    if(!o.backupConfirmed){
      const bk = o.file ? await window.flowBackup.saveFile(o.file)
        : await window.flowBackup.exportToFile({ photos:'auto', cloudPhotos:!!o.wipeCloud, needAllPhotos:!!o.wipeCloud, onProgress:o.onProgress });
      if(bk && (bk.step==='tap' || bk.step==='photos')) return bk;
      if(!bk || !bk.ok) return { ok:false, step:'backup', error:(bk&&bk.error)||'експорт не вдався' };
      if(!bk.saved) return { ok:false, step:'backup-confirm', name:bk.name, error:'не видно, чи файл бекапу збережено' };
    }
    /* Далі — стирання. Звірка з хмарою перед бекапом чекає не довше 8 с, а load()
       після неї може доробитись у фоні й дописати сховище (прибирання папок,
       міграції) — вже ПІСЛЯ стирання. Тож замикаємо всі записи через
       window.storage (локальні й у хмару); якщо хмару стерти не вдалось —
       відмикаємо: застосунок працює далі як був. */
    window.__flowWriteLock = true;
    // 2) хмара — доки сесія ще жива
    if(o.wipeCloud){
      const u = window.sbUser && window.sbUser();
      if(u){
        const wiped = await (window.sbWipeAll ? window.sbWipeAll() : false);
        if(!wiped){ window.__flowWriteLock = false; return { ok:false, step:'cloud', error:'хмару не вдалося стерти — дані не чіпав' }; }
        try{ if(window.sbSignOut) await window.sbSignOut(); }catch(_){}
      }
    }
    // 3) localStorage: усе, крім сесії Supabase (ключі 'sb-…') при скиданні
    //    лише пристрою — інакше довелося б входити в Google заново.
    //    Двічі: зараз і перед самим перезапуском — прапорці міграцій фоновий
    //    load() пише повз window.storage, замок їх не бачить.
    const wipeLocal = ()=>{
      try{
        const drop=[];
        for(let i=0;i<localStorage.length;i++){
          const k=localStorage.key(i); if(!k) continue;
          if(!o.wipeCloud && k.slice(0,3)==='sb-') continue;
          drop.push(k);
        }
        drop.forEach(k=>{ try{ localStorage.removeItem(k); }catch(_){} });
      }catch(_){}
      // 4) прапорець для дочистки IndexedDB на наступному старті
      try{ localStorage.setItem('__flow_wipe_idb__','1'); }catch(_){}
    };
    /* Черга незлитих правок у памʼяті: стерте сховище не має отримати її назад
       з pagehide перед перезапуском (на пристрої тепер може бути інша людина).
       Тут, а не до кроку хмари: якщо хмару стерти не вдалось, кошик лишається живим.
       Самі правки є у файлі бекапу, зробленому вище. */
    try{ if(window.sbDropQueue) window.sbDropQueue(); }catch(_){}
    /* 5) iPhone: нативна копія в Preferences. Без цього npHydrate на старті
       підняв би все стерте назад (APP-2). Стираємо після кожного wipeLocal
       (він прибирає й мітку NP_WIPED, nativeWipe ставить її знову) і ЧЕКАЄМО
       відповіді до перезапуску; завис міст — не довше 5 с, решту дотре
       наступний старт за міткою. На web/Mac nativeWipe нічого не робить. */
    const npWipe = ()=>Promise.race([
      Promise.resolve().then(()=>window.storage.nativeWipe ? window.storage.nativeWipe() : null).catch(()=>null),
      new Promise(r=>setTimeout(r, 5000)) ]);
    wipeLocal();
    await npWipe();
    setTimeout(async ()=>{ wipeLocal(); await npWipe(); try{ location.reload(); }catch(_){} }, 600);
    return { ok:true };
  };

  /* ============ PhotoDB — знімки папок і Карти бажань в IndexedDB ============
     Раніше фото лежали base64-рядком просто в folders_cfg / wishes_board. Через
     це один знімок роздував увесь JSON, а кожна дрібна зміна (перейменував
     папку) переписувала всі фото разом з нею. localStorage має жорсткий ліміт
     у кілька мегабайтів — саме туди впирався банер «памʼять заповнена».

     Тут той самий підхід, що вже працює для книжок (BookDB):
     важке лежить в IndexedDB, у конфігу — лише посилання виду
     `idb:ph_<id>`. Старі записи з `data:` читаються як раніше й переїжджають
     самі при першому збереженні. ============================================ */
  window.PhotoDB = (function(){
    const DB='flow_photos', STORE='photos'; let _db=null;
    function open(){
      return new Promise((res,rej)=>{
        if(_db) return res(_db);
        if(!window.indexedDB) return rej(new Error('no-idb'));
        const r=indexedDB.open(DB,1);
        r.onupgradeneeded=()=>{ const db=r.result; if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE); };
        r.onsuccess=()=>{ _db=r.result; res(_db); };
        r.onerror=()=>rej(r.error||new Error('idb-open'));
      });
    }
    return {
      available(){ return !!window.indexedDB; },
      async put(id,dataUrl){ const db=await open(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(dataUrl,id); tx.oncomplete=()=>res(true); tx.onerror=()=>rej(tx.error); }); },
      async get(id){ const db=await open(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readonly'); const rq=tx.objectStore(STORE).get(id); rq.onsuccess=()=>res(rq.result||null); rq.onerror=()=>rej(rq.error); }); },
      async del(id){ try{ const db=await open(); return new Promise(res=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).delete(id); tx.oncomplete=()=>res(true); tx.onerror=()=>res(false); }); }catch(_){ return false; } },
      /* Усе одразу — щоб на старті скласти памʼятний кеш і далі малювати
         синхронно, як і раніше. Знімків десятки, не тисячі. */
      async all(){
        try{
          const db=await open();
          return new Promise(res=>{
            const out={}; const tx=db.transaction(STORE,'readonly'); const st=tx.objectStore(STORE);
            const rq=st.openCursor();
            rq.onsuccess=()=>{ const c=rq.result; if(!c){ res(out); return; } out[c.key]=c.value; c.continue(); };
            rq.onerror=()=>res(out);
          });
        }catch(_){ return {}; }
      }
    };
  })();

  /* Памʼятний кеш знімків. Рендер карток синхронний, тож читати IndexedDB
     під час малювання не можна — натомість на старті один раз вичитуємо все
     у память (photoWarm), а далі photoSrc() віддає готовий data-URL.
     photoSrc також приймає старі значення (`data:…`) і повертає їх як є,
     тому виклики працюють однаково до і після переїзду. */
  window.__photoCache = Object.create(null);
  /* Самозцілення промаху: якщо рендер попросив знімок, якого ще немає в
     кеші (перемалювання спрацювало раніше за photoWarm — так сталось у
     Electron-збірці, і фото зникали назавжди), тихо дотягуємо його з
     IndexedDB і перемальовуємо екрани один раз, пакетом. Після цього кеш
     заповнений і промахів більше не буде. */
  const __phPending=new Set(); let __phPoke=null;
  function __photoPoke(){
    if(__phPoke) return;
    __phPoke=setTimeout(()=>{ __phPoke=null;
      try{ if(typeof renderDashboard==='function') renderDashboard(); }catch(_){}
      try{ if(typeof updateSummaryBg==='function') updateSummaryBg(); }catch(_){}
      try{ if(typeof renderWishes==='function') renderWishes(); }catch(_){}
    },60);
  }
  window.photoSrc = function(ref){
    if(!ref) return '';
    const r=String(ref);
    if(r.slice(0,4)!=='idb:') return r;         // старий формат — сам data-URL
    const id=r.slice(4);
    const hit=window.__photoCache[id];
    if(hit) return hit;
    if(!__phPending.has(id) && window.PhotoDB && window.PhotoDB.available()){
      __phPending.add(id);
      window.PhotoDB.get(id)
        .then(async v=>{
          // нема локально — можливо, знімок зроблено на іншому пристрої:
          // дотягуємо з хмари й кладемо в IndexedDB, далі він уже рідний
          if(!v && window.sbPhotoFetch){
            try{ v = await window.sbPhotoFetch(id); }catch(_){ v=null; }
            if(v){ try{ await window.PhotoDB.put(id, v); }catch(_){} }
          }
          if(v){ window.__photoCache[id]=v; __photoPoke(); }
        })
        .catch(()=>{})
        .then(()=>__phPending.delete(id));
    }
    return '';
  };
  window.photoIsRef = function(ref){ return !!ref && String(ref).slice(0,4)==='idb:'; };
  window.photoWarm = async function(){
    try{ if(!window.PhotoDB||!window.PhotoDB.available()) return false;
      window.__photoCache = await window.PhotoDB.all(); return true; }catch(_){ return false; }
  };
  /* Зберегти знімок і повернути посилання для конфігу. Якщо IndexedDB
     недоступний — віддаємо сам data-URL, і все працює як раніше. */
  window.photoPut = async function(id, dataUrl){
    try{
      if(!window.PhotoDB||!window.PhotoDB.available()) return dataUrl;
      await window.PhotoDB.put(id, dataUrl);
      window.__photoCache[id]=dataUrl;
      try{ if(window.sbPhotoPush) window.sbPhotoPush(id); }catch(_){}   // у хмару — фоном
      return 'idb:'+id;
    }catch(_){ return dataUrl; }
  };
  window.photoDel = async function(ref){
    try{
      if(!window.photoIsRef(ref)) return;
      const id=String(ref).slice(4);
      delete window.__photoCache[id];
      if(window.PhotoDB&&window.PhotoDB.available()) await window.PhotoDB.del(id);
      try{ if(window.sbPhotoDel) window.sbPhotoDel(id); }catch(_){}
    }catch(_){}
  };


