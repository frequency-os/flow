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
    function wrap(value){ return JSON.stringify({ _v: Date.now(), d: value }); }
    function unwrap(raw){
      if(raw==null) return null;
      try{ const o=JSON.parse(raw); if(o && typeof o==='object' && '_v' in o && 'd' in o) return { v:o._v, value:(typeof o.d==='string'?o.d:JSON.stringify(o.d)) }; }catch(_){}
      return { v:0, value:raw };
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
    /* Підйом при старті: Preferences → localStorage. Перезаписуємо лише коли
       локального значення немає або воно старіше — щоб не відкотити зміни,
       зроблені за цей запуск. */
    async function npHydrate(){
      const NP = npReady();
      if(!NP) return { restored:0, checked:0 };
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
        return { restored:h.restored, checked:h.checked, seeded:s, native: !!npReady() };
      },
      // обробити значення на виході: мігрувати якщо треба, віддати модулю чисті дані
      _out(key, valueStr){
        const target = SCHEMAS[key] || 0;
        if(!target) return valueStr; // не версіонований — як є
        let parsed; try{ parsed = JSON.parse(valueStr); }catch(_){ return valueStr; }
        const m = migrateParsed(key, parsed);
        const cleanStr = JSON.stringify(m.data);
        if(m.changed){
          // тихо перезберігаємо вже у новій версії (локально; Supabase-обгортка нижче підхопить)
          try{ const stamped = stampSv(key, cleanStr); const raw = wrap(stamped); lcSet(key, raw); }catch(_){}
        }
        return cleanStr; // модулю — чисті дані без __sv
      },
      // ⚡ синхронне читання ЛИШЕ локальної копії (для миттєвого першого рендера до синку з хмарою)
      getLocal(key){
        try{ const l=unwrap(lcGet(key)); return l? this._out(key, unstampSv(l.value)) : null; }catch(_){ return null; }
      },
      async get(key){
        const localRaw = lcGet(key);
        const local = unwrap(localRaw);
        if(local) return { key, value: this._out(key, unstampSv(local.value)), shared:false };
        throw new Error('not found');
      },
      async set(key, value){
        const stamped = stampSv(key, value);     // позначити версією схеми (якщо ключ версіонований)
        const raw = wrap(stamped);
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

    async function sbInit(){
      if(sbInitPromise) return sbInitPromise;
      sbInitPromise = (async()=>{
        const lib = await loadSupabaseLib();
        if(!lib){ window.__sbReady = true; return null; }
        sb = lib.createClient(SB_URL, SB_KEY);
        try{
          const { data } = await sb.auth.getSession();
          sbUserCache = data && data.session ? data.session.user : null;
        }catch(_){}
        window.__sbReady = true;
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
          sbUserCache = session ? session.user : null;
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
    // ОДИН запит на весь список даних користувача — замість того, щоб кожен
    // window.storage.get(key) під час load() ходив у мережу окремо.
    async function sbPrefetchAll(){
      if(!sb || !sbUserCache) return false;
      try{
        // фото (ключі 'photo:…') сюди не тягнемо: вони великі й потрібні
        // ліниво — їх дотягує sbPhotoFetch при промаху в IndexedDB
        const { data, error } = await sb.from('user_data').select('key,value,updated_at').eq('user_id', sbUserCache.id).not('key','like','photo:%');
        if(error || !data) return false;
        const c={}, ts={}; data.forEach(r=>{ c[r.key]=JSON.stringify(r.value); ts[r.key]=Date.parse(r.updated_at)||0; });
        sbBatchCache=c; sbBatchTs=ts;
        return true;
      }catch(_){ return false; }
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
          sbUserCache = data && data.session ? data.session.user : null;
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
      sbUserCache = null;
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

    window.storage.get = async function(key){
      const u = sbUserCache;
      if(u && sb){
        // 1) незлитий локальний запис у черзі — він найсвіжіший
        if(typeof sbWriteQueue!=='undefined' && sbWriteQueue && Object.prototype.hasOwnProperty.call(sbWriteQueue,key)){
          return { key, value: sbWriteQueue[key], shared:false };
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
            return { key, value: JSON.stringify(data.value), shared:false };
          }
        }catch(_){}
        // хмара порожня/недоступна — фолбек на локальну копію, щоб дані не «зникали»
        return origGet(key);
      }
      return origGet(key);
    };
    // ── групування записів: кілька set() поспіль (напр. під час швидкого
    //    редагування різних розділів) об'єднуються в ОДИН upsert-запит із
    //    кількома рядками замість окремого запиту на кожен ключ ──
    let sbWriteQueue = {}; // {key: rawValueString} — очікують відправки в хмару
    let sbWriteTimer = null;
    /* «Вихідний кошик» у localStorage: незлиті записи мають пережити перезапуск,
       інакше офлайн-правка, зроблена перед закриттям, губиться назавжди. */
    function sbOutboxSave(){
      try{
        if(Object.keys(sbWriteQueue).length) localStorage.setItem('flowapp___sb_outbox', JSON.stringify(sbWriteQueue));
        else localStorage.removeItem('flowapp___sb_outbox');
      }catch(_){}
    }
    function sbOutboxLoad(){
      try{
        const raw=localStorage.getItem('flowapp___sb_outbox'); if(!raw) return;
        const o=JSON.parse(raw);
        if(o && typeof o==='object') Object.keys(o).forEach(k=>{ if(!(k in sbWriteQueue)) sbWriteQueue[k]=o[k]; });
      }catch(_){}
    }
    function sbSyncPending(){ try{ window.__flowSync.sbPending = Object.keys(sbWriteQueue).length; }catch(_){} }
    function sbScheduleWrite(key, value){
      sbWriteQueue[key] = value;
      sbOutboxSave(); sbSyncPending();
      try{ if(window.__setSync) window.__setSync('syncing'); }catch(_){}
      if(sbWriteTimer) return;
      sbWriteTimer = setTimeout(sbFlushWrites, 500);
    }
    async function sbFlushWrites(){
      sbWriteTimer = null;
      const u = sbUserCache;
      const q = sbWriteQueue; sbWriteQueue = {};   // знімаємо поточну партію
      const keys = Object.keys(q);
      if(!keys.length){ sbOutboxSave(); return; }
      let ok=false;
      if(u && sb){
        try{
          const now = Date.now();
          const rows = keys.map(k=>{
            let parsed; try{ parsed = JSON.parse(q[k]); }catch(_){ parsed = q[k]; }
            return { user_id:u.id, key:k, value:parsed, updated_at:new Date(now).toISOString() };
          });
          // ВАЖЛИВО: supabase-js повертає {error}, а не кидає — перевіряємо явно,
          // інакше зірваний запис вважався б успішним і правка зникала б.
          const { error } = await sb.from('user_data').upsert(rows, { onConflict:'user_id,key' });
          if(error) throw error;
          if(sbBatchCache) keys.forEach(k=>{ sbBatchCache[k]=q[k]; });
          keys.forEach(k=>{ sbBatchTs[k]=now; });   // свіжість хмари тепер відома точно
          ok=true;
        }catch(_){ ok=false; }
      }
      if(!ok){
        // НЕ втрачаємо партію: повертаємо ключі в чергу (не затираючи новіші),
        // зберігаємо в outbox і повторюємо з паузою — і одразу коли з'явиться мережа.
        keys.forEach(k=>{ if(!(k in sbWriteQueue)) sbWriteQueue[k]=q[k]; });
        sbOutboxSave(); sbSyncPending();
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
    document.addEventListener('visibilitychange', ()=>{
      if(document.visibilityState==='hidden' && Object.keys(sbWriteQueue).length){
        sbOutboxSave();
        if(sbWriteTimer){ clearTimeout(sbWriteTimer); sbWriteTimer=null; }
        try{ sbFlushWrites(); }catch(_){}
      }
    });
    // щойно повернулась мережа — спробувати відправити те, що чекає
    try{ window.addEventListener('online', ()=>{ if(Object.keys(sbWriteQueue).length && !sbWriteTimer) sbWriteTimer=setTimeout(sbFlushWrites,300); }); }catch(_){}
    // при старті підхопити незлиті правки з попередньої сесії (відправляться, коли буде сесія)
    try{ sbOutboxLoad(); sbSyncPending(); }catch(_){}

    /* ── СВІЖІСТЬ МІЖ ПРИСТРОЯМИ ──
       Хмара досі читалась лише при запуску та по ручному «↻» — застосунок,
       що висить відкритим на Маку, не бачив правок з телефона, доки його не
       перезапустиш. Тепер: (а) при поверненні до вкладки/застосунку і
       (б) тихим кроком раз на ~2 хв, поки він видимий, робимо ОДИН пакетний
       запит і, ТІЛЬКИ якщо в хмарі зʼявилось щось новіше за локальне,
       перечитуємо дані тим самим __load(), що й кнопка «↻». Порожні звірки
       екран не смикають узагалі. */
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
      const before = Object.assign({}, sbBatchTs);  // час-мітки хмари ДО звірки
      let ok=false; try{ ok = await sbPrefetchAll(); }catch(_){}
      if(!ok) return;
      try{ sbPhotoSync(); }catch(_){}   // заразом доштовхнути фото, що чекають
      let changed = false;
      for(const k in sbBatchTs){
        const cloudTs = sbBatchTs[k]||0;
        // новим вважаємо лише те, чого ми ще не бачили І що свіжіше за локальну копію
        if(cloudTs > (before[k]||0) && cloudTs > sbLocalVersion(k)){ changed = true; break; }
      }
      if(!changed) return;
      try{ if(window.__flowSync) window.__flowSync.warmed=false; }catch(_){}
      try{ const ld=window.__load; if(typeof ld==='function') await ld().catch(()=>{}); }catch(_){}
      try{ if(typeof window.renderAccount==='function') window.renderAccount(); }catch(_){}
      try{ if(window.__setSync){ window.__flowSync.last=Date.now(); window.__setSync('synced'); } }catch(_){}
    }
    window.sbPullFresh = sbPullFresh;
    document.addEventListener('visibilitychange', ()=>{
      if(document.visibilityState==='visible') sbPullFresh();
    });
    setInterval(sbPullFresh, 120000);

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
      if(!id) return false;
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
    window.sbPhotoFetch = async function(id){
      if(!id || !sb || !sbUserCache) return null;
      try{
        const { data, error } = await sb.from('user_data').select('value,updated_at').eq('user_id', sbUserCache.id).eq('key', PH_KEY+id).maybeSingle();
        if(error || !data || typeof data.value!=='string') return null;
        phTsSet(id, Date.parse(data.updated_at)||Date.now());
        return data.value;
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
        sbBatchCache={}; sbBatchTs={}; sbWriteQueue={};
        sbOutboxSave(); sbSyncPending();
        return true;
      }catch(_){ return false; }
    };
    window.storage.set = async function(key, value){
      // Запобіжник від затирання порожнечею: якщо ключ не прочитався при старті
      // (пошкоджений), не даємо його ПОРОЖНІМ дефолтом стерти добру копію. Щойно
      // прийдуть реальні дані — знімаємо позначку й зберігаємо як звичайно.
      if(window.__storeCorrupt && window.__storeCorrupt.has(key)){
        const empty = value==null || value==='' || value==='[]' || value==='{}';
        if(empty){ try{ console.warn('[Flow storage] пропущено запис порожнечею в пошкоджений ключ:', key); }catch(_){} return { key, value, shared:false, _skipped:true }; }
        window.__storeCorrupt.delete(key);
      }
      // ЗАВЖДИ пишемо локально одразу (синхронно всередині origSet) — це страховка
      // на випадок, якщо сторінку закриють до завершення мережевого запиту в Supabase
      const localResult = await origSet(key, value);
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
        if(sbWriteQueue) delete sbWriteQueue[key];
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

    // Зібрати ВЕСЬ стан Flow з localStorage у один обʼєкт
    function collect(){
      const data = {};
      try{
        for(const k of Object.keys(localStorage)){
          if(k.startsWith(LP)) data[k.slice(LP.length)] = localStorage.getItem(k);
        }
      }catch(_){}
      return data;
    }

    // Скільки ключів / приблизний розмір — для UI
    function stats(){
      const d = collect(); const keys = Object.keys(d);
      let bytes = 0; try{ bytes = new Blob([JSON.stringify(d)]).size; }catch(_){ bytes = JSON.stringify(d).length; }
      return { keys: keys.length, bytes };
    }

    // Згорнути все у JSON-конверт з метаданими
    function makeEnvelope(){
      return JSON.stringify({
        app: APP,
        format: FORMAT,
        exportedAt: new Date().toISOString(),
        keyCount: Object.keys(collect()).length,
        data: collect()
      }, null, 0);
    }

    // Експорт: завантажити файл flow-backup-YYYY-MM-DD.json
    function exportToFile(){
      const json = makeEnvelope();
      const stamp = ymdLocal();
      const name = `flow-backup-${stamp}.json`;
      try{
        const blob = new Blob([json], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name; document.body.appendChild(a); a.click();
        setTimeout(()=>{ try{ document.body.removeChild(a); URL.revokeObjectURL(url); }catch(_){} }, 0);
        return { ok:true, name };
      }catch(e){ return { ok:false, error:String(e) }; }
    }

    // Аварійний знімок у самій localStorage (на випадок "зламав — відкоти")
    function snapshot(){
      try{ localStorage.setItem('__flow_snapshot__', makeEnvelope()); return true; }catch(_){ return false; }
    }
    function restoreSnapshot(){
      try{ const s = localStorage.getItem('__flow_snapshot__'); if(!s) return false; return applyEnvelope(s, {makeSafetyCopy:false}); }catch(_){ return false; }
    }

    // Розпакувати конверт назад у localStorage
    // opts.makeSafetyCopy: перед перезаписом зробити авто-знімок поточного стану
    function applyEnvelope(json, opts){
      opts = opts || {};
      let env;
      try{ env = JSON.parse(json); }catch(_){ return { ok:false, error:'Файл не є коректним JSON' }; }
      if(!env || env.app !== APP || !env.data || typeof env.data !== 'object'){
        return { ok:false, error:'Це не схоже на бекап Frequency' };
      }
      if(env.format > FORMAT){
        return { ok:false, error:'Бекап з новішої версії застосунку. Онови Frequency.' };
      }
      if(opts.makeSafetyCopy !== false) snapshot();
      let restored = 0;
      try{
        for(const k of Object.keys(env.data)){
          localStorage.setItem(LP + k, env.data[k]);
          restored++;
        }
      }catch(e){ return { ok:false, error:'Не вистачило памʼяті: '+String(e), restored }; }
      return { ok:true, restored, exportedAt: env.exportedAt };
    }

    // Імпорт із файлу (через <input type=file>)
    function importFromFile(file){
      return new Promise(res=>{
        const r = new FileReader();
        r.onload = ()=> res(applyEnvelope(String(r.result), {makeSafetyCopy:true}));
        r.onerror = ()=> res({ ok:false, error:'Не вдалося прочитати файл' });
        r.readAsText(file);
      });
    }

    window.flowBackup = { collect, stats, exportToFile, importFromFile, snapshot, restoreSnapshot, FORMAT };
  })();

  /* ============ СКИДАННЯ ДО ЗАВОДСЬКИХ ============
     Дві дії з екрана «Ще»:
       • «Скинути цей пристрій» (wipeCloud:false) — чистить усе локальне,
         але ЛИШАЄ сесію Google: після перезапуску дані повертаються з
         хмари чистим дзеркалом акаунта.
       • «Стерти все з акаунта» (wipeCloud:true) — плюс видаляє всі рядки
         в хмарі й виходить з акаунта. Незворотно.
     Обидві починаються з експорту бекапу у файл — без нього не рушаємо.
     IndexedDB тут лише позначається прапорцем: бази видаляє ранній хук
     на наступному старті (див. верх файлу), бо відкриті зʼєднання
     блокують deleteDatabase. ============ */
  window.flowFactoryReset = async function(opts){
    const o=opts||{};
    // 1) страховка: бекап у файл. Не вдався — зупиняємось.
    const bk = window.flowBackup.exportToFile();
    if(!bk || !bk.ok) return { ok:false, step:'backup', error:(bk&&bk.error)||'експорт не вдався' };
    // 2) хмара — доки сесія ще жива
    if(o.wipeCloud){
      const u = window.sbUser && window.sbUser();
      if(u){
        const wiped = await (window.sbWipeAll ? window.sbWipeAll() : false);
        if(!wiped) return { ok:false, step:'cloud', error:'хмару не вдалося стерти — дані не чіпав' };
        try{ if(window.sbSignOut) await window.sbSignOut(); }catch(_){}
      }
    }
    // 3) localStorage: усе, крім сесії Supabase (ключі 'sb-…') при скиданні
    //    лише пристрою — інакше довелося б входити в Google заново
    try{
      const drop=[];
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i); if(!k) continue;
        if(!o.wipeCloud && k.slice(0,3)==='sb-') continue;
        drop.push(k);
      }
      drop.forEach(k=>{ try{ localStorage.removeItem(k); }catch(_){} });
    }catch(_){}
    // 4) прапорець для дочистки IndexedDB + перезапуск
    try{ localStorage.setItem('__flow_wipe_idb__','1'); }catch(_){}
    setTimeout(()=>{ try{ location.reload(); }catch(_){} }, 600);
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


