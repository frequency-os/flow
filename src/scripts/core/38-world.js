  /* ════════ «Мій світ»: гра «Місто дня» всередині Frequency ════════
     Поки лише для розробника (ворота upDevOn): у нижній панелі «Мій світ» стає
     на місце «Гроші», а гроші переїжджають угору Огляду чипом із балансом.
     Гра — окрема сторінка misto.html у рамці (iframe), зі своїм сховищем
     misto_dnya_v3. Дані Frequency вона бачить лише через worldBridge і лише
     читає: баланс і останні записи Гаманця. Нічого не пише. */
  let worldShown=false;
  function worldOn(){ try{ return !!(window.upDevOn&&window.upDevOn()); }catch(_){ return false; } }

  function worldFmt(v){ try{ return fmt(v)+' ₴'; }catch(_){ return Math.round(v)+' ₴'; } }

  function worldApplyNav(){
    const on=worldOn();
    const nw=document.getElementById('navWorld'), nf=document.getElementById('navFinance');
    if(nw) nw.hidden=!on;
    if(nf) nf.hidden=on;
    const dw=document.querySelector('.dsb-i[data-dnav="world"]'); if(dw) dw.hidden=!on;
    const chip=document.getElementById('homeMoneyChip');
    if(chip){ chip.hidden=!on; if(on) worldMoneyChip(); }
  }

  // чип балансу вгорі Огляду: гроші не зникають, коли їхнє місце внизу займає «Мій світ»
  function worldMoneyChip(){
    const chip=document.getElementById('homeMoneyChip'); if(!chip||chip.hidden) return;
    let b=0; try{ b=walletBalance(); }catch(_){}
    chip.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/></svg><span>Гаманець</span><b>'+esc(worldFmt(b))+'</b><svg class="wm-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
    chip.setAttribute('aria-label','Гаманець: '+worldFmt(b));
  }

  // міст для гри: лише читання; open() — перехід у розділ Frequency
  function worldBridge(){ return {
    wallet(){
      let ops=[], bal=0;
      try{ bal=walletBalance(); ops=walletOps().slice(-8).reverse().map(o=>({type:o.type, amount:+o.amount||0, label:String(o.label||''), date:String(o.date||'')})); }catch(_){}
      return {balance:bal, ops};
    },
    open(sec){
      if(sec==='finance') goFinance();
      else if(sec==='ai'){ if(window.aiChatSheet) window.aiChatSheet(); }
    }
  }; }


  function goWorld(){
    if(!worldOn()){ goHome(); return; }
    // міст зʼявляється лише тоді, коли розробник справді відкрив світ
    if(!window.flowWorldBridge) window.flowWorldBridge=worldBridge();
    const box=document.getElementById('worldFrame');
    if(box && !box.firstChild){
      // сторінка гри йде повз сервіс-воркер (лише її картинки лягають у кеш версії) — без мережі лише пояснюємо
      if(navigator.onLine===false){
        if(typeof flowAlert==='function') flowAlert('Мій світ відкривається лише з інтернетом. Спробуй, коли зʼявиться мережа.','Немає мережі');
        return;
      }
      const f=document.createElement('iframe');
      f.src='misto.html?embed=1'; f.title='Мій світ — гра «Місто дня»';
      box.appendChild(f);
    } else {
      // повернулись у світ: гаманець міг змінитись — гра перемальовує HUD
      try{ const w=box.firstChild.contentWindow; if(w&&w.mistoRefresh) w.mistoRefresh(); }catch(_){}
    }
    worldShown=true;
    show('scr-world');
  }

  { const nw=document.getElementById('navWorld'); if(nw) nw.onclick=goWorld; }
  { const dw=document.querySelector('.dsb-i[data-dnav="world"]'); if(dw) dw.onclick=goWorld; }
  { const chip=document.getElementById('homeMoneyChip'); if(chip) chip.onclick=goFinance; }

  // ворота розробника відповідають не одразу (хеш пошти рахується асинхронно)
  worldApplyNav();
  [1200,4000,10000].forEach(t=>setTimeout(worldApplyNav,t));
  try{ document.addEventListener('flowsync',()=>setTimeout(worldApplyNav,300)); }catch(_){}
  try{ document.addEventListener('visibilitychange',()=>{ if(!document.hidden) worldMoneyChip(); }); }catch(_){}
  try{ window.goWorld=goWorld; window.worldApplyNav=worldApplyNav; window.worldMoneyChip=worldMoneyChip; }catch(_){}
