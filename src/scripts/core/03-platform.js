  /* ============ PLATFORM: єдиний шар над Native (Capacitor) / Web ============
     Єдине місце в усьому застосунку, що знає про конкретну платформу.
     Решта коду звертається ТІЛЬКИ до window.platform.
     Telegram-гілку вирізано 04.09.2026: SDK і CloudStorage більше не існують.
     Коли робитимемо Mac/iPhone (Capacitor) — міняємо лише цей блок,
     а не тисячі рядків логіки. ============ */
  (function(){
    // Native-обгортка (Capacitor: iOS/Android). Визначаємо тут і тільки тут.
    const CAP = window.Capacitor || null;
    const isNative = !!(CAP && (CAP.isNativePlatform ? CAP.isNativePlatform() : CAP.isNative));
    window.FLOW_NATIVE = isNative;

    // Яка платформа активна: ios | android | web
    const kind = isNative
      ? ((CAP.getPlatform && CAP.getPlatform()) || 'ios')
      : 'web';

    // Вібрація. type: 'light' | 'medium' | 'heavy' | 'select' | 'success' | 'warning' | 'error'
    // На web нічого не робить; у native-збірці тут підключиться Capacitor Haptics.
    function haptic(type){}

    // Поточний користувач платформи: на web/desktop — null, вхід іде через Google (sbUser)
    function user(){ return null; }

    // Колір фону системної панелі: на web — ігнор
    function setBgColor(hex){}

    // Відкрити зовнішнє посилання — звичайна вкладка
    function openLink(url){
      if(!url) return;
      try{ window.open(url, '_blank', 'noopener'); }catch(_){}
    }

    // Діагностика середовища (для екрана акаунту)
    function diag(){ return { kind, native:isNative }; }

    // Заглушки з часів міні-застосунку: свайп-закриття й розгортання на весь
    // екран на web не існують; лишені, щоб виклики в коді не розсипались.
    function lockSwipe(on){}
    function expand(){}

    // Системний попап: тихий фолбек через flowAlert, якщо є
    function popup(opts){
      try{ if(typeof window.flowAlert==='function') window.flowAlert(opts && (opts.message||opts.title) || ''); }catch(_){}
    }

    window.platform = { kind, haptic, user, setBgColor, openLink, diag, lockSwipe, expand, popup, hasCloud:false };
  })();

  /* Текст відмови мікрофона залежить від платформи: на iOS дозвіл живе в
     Налаштуваннях системи, а не в браузері. Неправильна підказка тут — це
     App Review 2.1 (рецензент бачить інструкцію для чужого застосунку). */
  window.micDenyMsg = function(){
    var k = (window.platform && window.platform.kind) || 'web';
    if(k==='ios')      return '🎙 Нема доступу до мікрофона — увімкни його в Налаштуваннях → Frequency → Мікрофон';
    if(k==='android')  return '🎙 Нема доступу до мікрофона — дозволь його в налаштуваннях застосунку';
    return '🎙 Нема доступу до мікрофона — дозволь його в налаштуваннях браузера';
  };


