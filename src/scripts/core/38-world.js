  /* ════════ «Мій світ»: гра «Місто дня» всередині Frequency ════════
     Поки лише для розробника (ворота upDevOn): у нижній панелі «Мій світ» стає
     на місце «Гроші», а гроші видно в чипі картки «Сьогодні» на Огляді.
     Гра — окрема сторінка misto.html у рамці (iframe), зі своїм сховищем
     misto_dnya_v3. Дані Frequency вона бачить лише через worldBridge і лише
     читає: баланс і записи Гаманця, сфери, план на рік (лист і віхи). Пише лише
     власний стан у ключ world_game (gameSave). */
  let worldShown=false;
  function worldOn(){ try{ return !!(window.upDevOn&&window.upDevOn()); }catch(_){ return false; } }

  function worldApplyNav(){
    const on=worldOn();
    const nw=document.getElementById('navWorld'), nf=document.getElementById('navFinance');
    if(nw) nw.hidden=!on;
    if(nf) nf.hidden=on;
    const dw=document.querySelector('.dsb-i[data-dnav="world"]'); if(dw) dw.hidden=!on;
  }

  // міст для гри: лише читання; open() — перехід у розділ Frequency
  function worldBridge(){ return {
    wallet(){
      let ops=[], bal=0;
      try{ bal=walletBalance(); ops=walletOps().slice(-8).reverse().map(o=>({type:o.type, amount:+o.amount||0, label:String(o.label||''), date:String(o.date||'')})); }catch(_){}
      return {balance:bal, ops};
    },
    // сфери (39-spheres.js): назва, шаблон, будівля й цифри з блоків папки — лише читання
    spheres(){ try{ return sphForWorld(); }catch(_){ return []; } },
    /* Стан гри в акаунті — ключ world_game. Гра читає й пише ЛИШЕ його і лише цілком,
       Frequency вміст не розбирає. trusted=false — хмара ще не відповіла: тоді гра в
       акаунт не пише («порожньо» ≠ «не відповіло», урок 24.09). */
    async gameLoad(){
      const trusted=!!(window.sbDataTrusted&&window.sbDataTrusted());
      let raw=null;
      try{ const r=await window.storage.get('world_game'); raw=(r&&typeof r.value==='string')?r.value:null; }catch(_){ raw=null; }
      // id акаунта: гра прив'язує перенесення до нього; гість ('') в акаунт не пише
      const u=window.sbUser&&window.sbUser();
      return {trusted, raw, uid:(u&&u.id)?String(u.id):''};
    },
    gameSave(raw){
      if(!(window.sbDataTrusted&&window.sbDataTrusted())) return 'untrusted';
      if(!(window.sbUser&&window.sbUser())) return 'guest';   // без входу акаунта нема — гра лише в браузері
      if(typeof raw!=='string') return 'bad';
      if(raw.length>600000) return 'too_big';             // кілька копій гри ділять ~5 МБ памʼяті браузера
      try{ const o=JSON.parse(raw); if(!o||typeof o!=='object'||!o.player||typeof o.player!=='object') return 'bad'; }catch(_){ return 'bad'; }
      try{ const p=window.storage.set('world_game', raw, false); if(p&&p.catch) p.catch(()=>{}); }catch(_){ return 'fail'; }
      return 'ok';
    },
    // план на рік (40-year-letter.js): лист і віхи — лише читання
    year(){ try{ return ylForWorld(); }catch(_){ return null; } },
    open(sec, key){
      if(sec==='finance') goFinance();
      else if(sec==='ai'){ if(window.aiChatSheet) window.aiChatSheet(); }
      else if(sec==='goals') goGoals();
      // питання до Флоу — лише фіксовані тексти звідси, гра свого тексту не передає
      else if(sec==='ai_behind') ylAskFlow('Я відстаю з віхами цього місяця в «Дорозі року». Подивись мої цілі й віхи: що перенести на наступний місяць або спростити, щоб встигнути? Запропонуй, але без моєї згоди нічого не змінюй.');
      else if(sec==='ai_week') ylAskFlow('Зроби розбір мого тижня: що вдалось, що пропустив і чому, і скажи мовою мого листа із точки Б, яке речення наблизилось. Стисло, один фокус на наступний тиждень.');
      else if(sec==='folder' && typeof key==='string' && Object.prototype.hasOwnProperty.call(folders,key)) goFolder(key);
    }
  }; }

  function goWorld(opts){
    if(!worldOn()){ goHome(); return; }
    // міст зʼявляється лише тоді, коли розробник справді відкрив світ
    if(!window.flowWorldBridge) window.flowWorldBridge=worldBridge();
    const box=document.getElementById('worldFrame');
    // повторний тап на «Мій світ», коли світ уже відкритий, — назад на карту
    const here=document.getElementById('scr-world');
    if(here && here.classList.contains('active') && box && box.firstChild){
      try{ const w=box.firstChild.contentWindow; if(opts&&opts.focus&&w&&w.mistoFocus) w.mistoFocus(opts.focus); else if(w&&w.mistoHome) w.mistoHome(); }catch(_){}
      return;
    }
    if(box && !box.firstChild){
      // сторінка гри йде повз сервіс-воркер (лише її картинки лягають у кеш версії) — без мережі лише пояснюємо
      if(navigator.onLine===false){
        if(typeof flowAlert==='function') flowAlert('Мій світ відкривається лише з інтернетом. Спробуй, коли зʼявиться мережа.','Немає мережі');
        return;
      }
      const f=document.createElement('iframe');
      f.src='misto.html?embed=1'; f.title='Мій світ — гра «Місто дня»';
      // прийшли зі сфери — коли гра завантажиться, підводимо карту до її будівлі
      if(opts&&opts.focus) f.addEventListener('load',()=>{ setTimeout(()=>{ try{ const w=f.contentWindow; if(w&&w.mistoFocus) w.mistoFocus(opts.focus); }catch(_){} },300); },{once:true});
      box.appendChild(f);
    } else {
      // повернулись у світ: гаманець міг змінитись — гра перемальовує HUD
      try{ const w=box.firstChild.contentWindow; if(opts&&opts.focus&&w&&w.mistoFocus) w.mistoFocus(opts.focus); else if(w&&w.mistoRefresh) w.mistoRefresh(); }catch(_){}
    }
    worldShown=true;
    show('scr-world');
  }

  { const nw=document.getElementById('navWorld'); if(nw) nw.onclick=goWorld; }
  { const dw=document.querySelector('.dsb-i[data-dnav="world"]'); if(dw) dw.onclick=goWorld; }

  // ворота розробника відповідають не одразу (хеш пошти рахується асинхронно)
  worldApplyNav();
  [1200,4000,10000].forEach(t=>setTimeout(worldApplyNav,t));
  try{ document.addEventListener('flowsync',()=>setTimeout(worldApplyNav,300)); }catch(_){}
  try{ window.goWorld=goWorld; window.worldApplyNav=worldApplyNav; }catch(_){}
