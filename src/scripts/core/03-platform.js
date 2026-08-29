  /* ============ PLATFORM: єдиний шар над Telegram / Desktop / Mobile ============
     Єдине місце в усьому застосунку, що знає про конкретну платформу.
     Решта коду звертається ТІЛЬКИ до window.platform — ніколи прямо до Telegram.
     Коли робитимемо Mac/Win (Tauri) чи iPhone/Android (Capacitor) —
     міняємо лише цей блок, а не 7000 рядків логіки. ============ */
  (function(){
    const TG = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
    // Telegram більше не використовується: SDK прибрано з каркаса, тому
    // window.Telegram не існує → TG=null, kind ніколи не буде 'telegram'.
    // Гілку лишено на випадок, якщо Telegram колись знадобиться повернути.
    const isRealTG = !!(TG && TG.initData && TG.initData.length > 0 && TG.platform && TG.platform !== 'unknown');

    // Native-обгортка (Capacitor: iOS/Android). Визначаємо тут і тільки тут.
    const CAP = window.Capacitor || null;
    const isNative = !!(CAP && (CAP.isNativePlatform ? CAP.isNativePlatform() : CAP.isNative));
    window.FLOW_NATIVE = isNative;

    // Яка платформа активна: ios | android | telegram | web
    const kind = isNative
      ? ((CAP.getPlatform && CAP.getPlatform()) || 'ios')
      : (isRealTG ? 'telegram' : 'web');

    // Вібрація. type: 'light' | 'medium' | 'heavy' | 'select' | 'success' | 'warning' | 'error'
    function haptic(type){
      try{
        const h = TG && TG.HapticFeedback; if(!h) return;
        if(type==='select') return h.selectionChanged && h.selectionChanged();
        if(type==='success'||type==='warning'||type==='error') return h.notificationOccurred && h.notificationOccurred(type);
        return h.impactOccurred && h.impactOccurred(type||'light'); // light/medium/heavy
      }catch(_){}
    }

    // Поточний користувач (на Telegram — акаунт; на desktop/web — поки null)
    function user(){
      try{ const u = TG && TG.initDataUnsafe && TG.initDataUnsafe.user; if(u) return u; }catch(_){}
      return null;
    }

    // Колір фону системної панелі (Telegram має API; решта — ігнор)
    function setBgColor(hex){
      try{ TG && TG.setBackgroundColor && TG.setBackgroundColor(hex); }catch(_){}
    }

    // Відкрити зовнішнє посилання (Telegram має свій openLink; web/desktop — звичайна вкладка)
    function openLink(url){
      if(!url) return;
      try{ if(TG && TG.openLink){ TG.openLink(url); return; } }catch(_){}
      try{ window.open(url, '_blank', 'noopener'); }catch(_){}
    }

    // Діагностика середовища (для екрана акаунту)
    function diag(){
      let initLen=0, ver='?', plat='?', hasUser=false, hasCS=false;
      try{
        initLen = (TG && TG.initData ? TG.initData.length : 0);
        ver = (TG && TG.version) || '?';
        plat = (TG && TG.platform) || '?';
        hasUser = !!(TG && TG.initDataUnsafe && TG.initDataUnsafe.user);
        hasCS = !!(TG && TG.CloudStorage);
      }catch(_){}
      return { hasTG:!!TG, hasCS, initLen, ver, plat, hasUser };
    }

    // Тимчасово блокувати/розблоковувати вертикальний свайп-закриття Telegram
    // (під час перетягування блоків по полотну, щоб міні-апп не закривався)
    function lockSwipe(on){
      try{
        if(!TG) return;
        if(on){ TG.disableVerticalSwipes && TG.disableVerticalSwipes(); }
        else  { TG.enableVerticalSwipes  && TG.enableVerticalSwipes();  }
      }catch(_){}
    }

    // Розгорнути міні-апп на весь екран (Telegram; на web — нічого не робить)
    function expand(){
      try{ TG && TG.expand && TG.expand(); }catch(_){}
    }

    // Системний попап (Telegram showPopup; на web — тихий фолбек через flowAlert якщо є, інакше ігнор)
    function popup(opts){
      try{
        if(TG && TG.showPopup){ TG.showPopup(opts); return; }
      }catch(_){}
      try{ if(typeof window.flowAlert==='function') window.flowAlert(opts && (opts.message||opts.title) || ''); }catch(_){}
    }

    window.platform = { kind, haptic, user, setBgColor, openLink, diag, lockSwipe, expand, popup, hasCloud:isRealTG&&!!(TG&&TG.CloudStorage) };
  })();

  /* Текст відмови мікрофона залежить від платформи: на iOS дозвіл живе в
     Налаштуваннях системи, а не в Telegram. Неправильна підказка тут — це
     App Review 2.1 (рецензент бачить інструкцію для чужого застосунку). */
  window.micDenyMsg = function(){
    var k = (window.platform && window.platform.kind) || 'web';
    if(k==='ios')      return '🎙 Нема доступу до мікрофона — увімкни його в Налаштуваннях → Frequency → Мікрофон';
    if(k==='android')  return '🎙 Нема доступу до мікрофона — дозволь його в налаштуваннях застосунку';
    if(k==='telegram') return '🎙 Нема доступу до мікрофона — дозволь у налаштуваннях Telegram';
    return '🎙 Нема доступу до мікрофона — дозволь його в налаштуваннях браузера';
  };


