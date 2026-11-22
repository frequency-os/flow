  /* ════════ DEV-ВОРОТА: що бачить лише розробник ════════
     Колись тут жив екран «Апгрейд» (персонаж, сфери, заявлений шлях) —
     видалено 22.11.2026 разом із «Місто дня», «Мій світ» і екраном «Ядро».
     Лишились самі ворота upDevOn: ними користуються агент Флоу (12-ai-agent.js),
     проксі ШІ (09-goals.js), Журнал, Огляд, Сфери і екран аварії.
     Дані колишнього Апгрейду (upgrade_profile_v1) у сховищі не чіпаємо. */
  (function(){
    // SHA-256 від email власника: сам email у коді не лежить (репозиторій публічний)
    const UP_DEV_HASH='2c3a0426ff1f3cd97c70282b6601962b293ccb35731f0208819c94f286fb199c';
    let upDevProbe=null;   // {email, ok} — результат перевірки поточного акаунта

    /* dev-ворота: бачить лише власник акаунта або пристрій із flow_dev=1 */
    function upDevOn(){
      /* Збірка під App Store (build.py --ios) замінює тіло на «return false;»:
         dev-можливості там не відкриваються ніколи. Перевірка — tools/check-ios.sh. */
      /* @dev-only:start replace="return false;" */
      try{ if(localStorage.getItem('flow_dev')==='1') return true; }catch(_){}
      try{
        const u=window.sbUser&&window.sbUser(); const em=u?String(u.email||'').toLowerCase():'';
        if(!em) return false;
        if(upDevProbe&&upDevProbe.email===em) return !!upDevProbe.ok;
        // хеш рахується асинхронно: перший виклик каже «ні», а коли відповідь
        // готова і збіглась — перемальовує «Ще», щоб dev-пункти зʼявились самі
        upDevProbe={email:em, ok:false};
        upSha256(em).then(h=>{ if(upDevProbe&&upDevProbe.email===em){ upDevProbe.ok=(h===UP_DEV_HASH);
          if(upDevProbe.ok){ try{ if(typeof window.renderMore==='function') window.renderMore(); }catch(_){} } } }).catch(()=>{});
      }catch(_){}
      return false;
      /* @dev-only:end */
    }
    async function upSha256(s){
      const buf=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
    }
    // запускаємо перевірку заздалегідь, щойно синк повідомить про живу сесію
    try{ document.addEventListener('flowsync', ()=>{ try{ upDevOn(); }catch(_){} }); }catch(_){}
    window.upDevOn=upDevOn;
  })();
