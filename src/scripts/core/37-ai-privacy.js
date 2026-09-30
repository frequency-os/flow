  /* ============ AI І ПРИВАТНІСТЬ: згода + що бачить AI ============
     Вимога Apple 5.1.2(i): перш ніж дані людини підуть до стороннього AI,
     вона має побачити, ЩО саме піде, КОМУ і НАВІЩО, і погодитись.
     Тому жоден запит до AI-воркера не виходить без згоди — перевірка стоїть
     у aiFetch (09-goals.js), через який ідуть усі шляхи: чат, спот, голос,
     аналіз щоденника, Апгрейд, тренер тижня, AI-старт, віджет «Щоденник».
     Там же — друга половина: запит, що несе дані закритого розділу
     (opts.ai.uses), не виходить, навіть якщо шлях забув перевірити сам.

     Шторку згоди показує ЛИШЕ дія людини. Фоновий запит (opts.ai.bg —
     авто-зведення, оцінка настрою, озвучення) без згоди тихо не йде:
     без шторки і без тосту-помилки (помилка з quiet=true).

     Ключ ai_privacy_v1 (у FLOW_KEYS — синкається між пристроями: load() читає
     його через storage.get, тобто хмарне значення, якщо воно новіше):
       { consent: <версія тексту, на яку людина погодилась>, at: ISO-дата,
         off: true — AI вимкнено повністю,
         deny: { diary, finance, photos } — розділи, які агент НЕ читає }
     Змінився перелік даних чи сервісів — піднімаємо AI_CONSENT_VER, і
     людину спитають знову: стара згода була на інший текст. */
  const AI_PRIV_KEY='ai_privacy_v1';
  const AI_CONSENT_VER=1;
  const AI_PRIV_SECTIONS=[
    {k:'diary',   emo:'📓', t:'Щоденник',  d:'Записи, зошити, віджет у папках, аналіз тижня і настрою'},
    {k:'finance', emo:'💶', t:'Фінанси',   d:'Гаманець, конверти, борги, витрати'},
    {k:'photos',  emo:'🖼️', t:'Фото',      d:'Знімки, які прикріплюєш у чаті'},
  ];
  /* Останнє відоме значення. getLocal — лише копія цього пристрою, тож після
     load() тут лежить те, що віддав storage.get (хмара, якщо там новіше):
     вимкнула людина AI на iPhone — Mac після звірки з хмарою теж не шле. */
  var aiPrivMem=null;   // var, а не let: ранній виклик aiPrivGet не впаде на «ще не оголошено»
  function aiPrivNorm(o){
    o=(o&&typeof o==='object')?o:{};
    o.deny=(o.deny&&typeof o.deny==='object')?o.deny:{};
    return o;
  }
  function aiPrivGet(){
    if(aiPrivMem) return aiPrivNorm(JSON.parse(JSON.stringify(aiPrivMem)));   // копія: виклики її змінюють
    let o=null;
    try{ const raw=window.storage.getLocal(AI_PRIV_KEY); if(raw) o=JSON.parse(raw); }catch(_){}
    return aiPrivNorm(o);
  }
  function aiPrivSet(o){
    aiPrivMem=aiPrivNorm(JSON.parse(JSON.stringify(o)));
    try{ const p=window.storage.set(AI_PRIV_KEY,JSON.stringify(o)); if(p&&p.catch) p.catch(()=>{}); }catch(_){}
  }
  /* Кличе load() (27-canvas.js): на старті й після кожної звірки з хмарою, що
     принесла новіше. Назад у сховище НЕ пишемо — інакше пристрої перекидались
     би тим самим значенням зі свіжою міткою без кінця. */
  async function aiPrivLoad(){
    try{
      const r=await window.storage.get(AI_PRIV_KEY);
      if(r&&typeof r.value==='string'&&r.value) aiPrivMem=aiPrivNorm(JSON.parse(r.value));
    }catch(_){ /* ключа ще нема ні тут, ні в хмарі — лишаємо як є */ }
  }
  function aiConsentOk(){ const o=aiPrivGet(); return !o.off && (+o.consent||0)>=AI_CONSENT_VER; }
  /* Чи можна зараз ТИХО (без шторки) піти в AI — для фонових запитів,
     яких людина не просила: вони не мають вискакувати шторкою згоди.
     section — розділ, дані якого піде в запит (diary/finance/photos). */
  function aiAllowed(section){ return aiConsentOk() && !(section && aiSectionOff(section)); }
  function aiSectionOff(k){ return !!aiPrivGet().deny[k]; }
  function aiSectionOffMsg(k){
    const s=AI_PRIV_SECTIONS.find(x=>x.k===k);
    return 'розділ «'+(s?s.t:k)+'» вимкнено людиною (Ще → AI і приватність) — не читай і не змінюй його, не вигадуй вміст; якщо треба, чесно скажи, що доступ закрито.';
  }
  /* Помилка, яку бачить людина: human=true — без «перевір URL проксі»,
     aiOff=true — чат показує її без ⚠️, це не поломка. */
  function aiOffError(off,quiet){
    const e=new Error(off
      ? '🔒 AI вимкнено. Увімкнути: Ще → AI і приватність.'
      : '🔒 Без твоєї згоди AI нічого не отримує. Передумаєш — Ще → AI і приватність.');
    e.human=true; e.aiOff=true; e.quiet=!!quiet;   // quiet — фоновий запит: людині нічого не кажемо
    return e;
  }
  function aiSectionError(k,quiet){
    const s=AI_PRIV_SECTIONS.find(x=>x.k===k);
    const e=new Error('🔒 Розділ «'+(s?s.t:k)+'» закрито від AI, тож його дані не надсилаються. Відкрити: Ще → AI і приватність.');
    e.human=true; e.aiOff=true; e.quiet=!!quiet;
    return e;
  }
  /* Тиха підказка для віджета, що сам ходить до AI у фоні: чому він зараз
     мовчить. '' — усе дозволено. act — назва кнопки, якою людина може
     попросити сама (тоді й спитаємо згоду). */
  function aiQuietHint(section,act){
    const o=aiPrivGet();
    if(o.off) return '🔒 AI вимкнено, тож сюди нічого не надсилається. Увімкнути: Ще → AI і приватність.';
    if(section&&o.deny[section]){
      const s=AI_PRIV_SECTIONS.find(x=>x.k===section);
      return '🔒 Розділ «'+(s?s.t:section)+'» закрито від AI, тож його дані не надсилаються. Відкрити: Ще → AI і приватність.';
    }
    if((+o.consent||0)<AI_CONSENT_VER) return '🔒 Сам я нічого не надсилаю, доки ти не погодишся.'+(act?' Натисни «'+act+'» — спершу спитаю.':'');
    return '';
  }

  /* ── «Що бачить AI»: один текст і для шторки згоди, і для налаштувань ── */
  function aiPrivWhatHTML(){
    return '<div class="aip-what">'
      +'<p><b>Що йде до AI.</b> Те, що ти пишеш або надиктовуєш помічнику, і файли чи фото, які прикріплюєш. '
      +'А ще — те, що агент читає, щоб відповісти по суті: планер і беклог, цілі й Точку Б, щоденник і зошити, '
      +'фінанси (гаманець, конверти, борги), папки й проєкти, Візію, підписи Карти бажань, памʼять про тебе. '
      +'Після згоди дещо йде й без окремого прохання: ранковий бриф і тижневий огляд, коли відкриваєш чат, '
      +'оцінка настрою за записами, коли відкриваєш щоденник, і зведення віджета «Щоденник» на сторінці папки '
      +'(записи за тиждень чи місяць, а ще ритуал, витрати й завдання тих днів).</p>'
      +'<p><b>Кому.</b> Моделі Claude від Anthropic — через наш сервер-посередник на Cloudflare '
      +'(ключ доступу до моделі лежить там, а не в застосунку). Голос: розпізнавання мови — модель Whisper на Cloudflare Workers AI; '
      +'озвучення відповідей — ElevenLabs, запасний — Microsoft Azure Speech. Якщо вони недоступні, говорить системний голос телефона, без мережі.</p>'
      +'<p><b>Навіщо.</b> Тільки щоб відповісти на твоє прохання і зробити дію, яку ти просиш: запис у планер, витрату, запис у щоденник. '
      +'Не для реклами і не на продаж.</p>'
      +'<p><b>Що ти контролюєш.</b> Вимкнути AI повністю, закрити від агента щоденник, фінанси чи фото, '
      +'відкликати згоду — у «Ще → AI і приватність».</p>'
      +'</div>';
  }

  /* ── шторка згоди перед ПЕРШИМ запитом ──
     Кілька запитів одночасно (напр., голос + чат) — одна шторка на всіх. */
  let aiConsentPending=null;
  function aiConsentSheet(){
    if(aiConsentPending) return aiConsentPending;
    aiConsentPending=new Promise(res=>{
      let done=false;
      const ov=document.createElement('div'); ov.className='asheet aip-sheet';
      const fin=v=>{ if(done) return; done=true; aiConsentPending=null; try{ ov.remove(); }catch(_){} res(v); };
      try{
        /* aip-ask: текст гортається, а кнопки завжди видно — на iPhone SE
           «Погоджуюсь» не має ховатися під краєм екрана */
        ov.innerHTML='<div class="asheet-in aip-in aip-ask" role="dialog" aria-modal="true" aria-labelledby="aipT">'
          +'<div class="asheet-grip"></div>'
          +'<div class="asheet-title" id="aipT">✨ Перш ніж AI почне допомагати</div>'
          +'<div class="asheet-sub">Щоб відповісти, AI має побачити частину твоїх даних. Поки ти не погодишся, не надсилається нічого.</div>'
          +'<div class="aip-scroll">'+aiPrivWhatHTML()+'</div>'
          +'<button class="asheet-item primary aip-yes" data-aip-yes><span class="tx"><span class="lab2">Погоджуюсь</span></span></button>'
          +'<button class="asheet-cancel" data-aip-no>Не зараз</button>'
          +'</div>';
        ov.onclick=e=>{ if(e.target===ov) fin(false); };
        ov.querySelector('[data-aip-no]').onclick=()=>fin(false);
        ov.querySelector('[data-aip-yes]').onclick=()=>{
          const o=aiPrivGet(); o.consent=AI_CONSENT_VER; o.at=new Date().toISOString(); o.off=false;
          aiPrivSet(o);
          try{ window.platform.haptic('light'); }catch(_){}
          fin(true);
        };
        document.body.appendChild(ov);
      }catch(e){ console.error('aiConsentSheet',e); fin(false); }
    });
    return aiConsentPending;
  }
  /* Ворота для aiFetch: true — можна слати. ai = {bg, uses} з opts.ai.
     Вимкнено — без шторки (людина сама так вирішила). Запит несе закритий
     розділ (uses) — не йде. Згоди нема: дія людини — питаємо шторкою,
     фоновий запит (bg) — тихо не йде. */
  async function aiConsentGate(ai){
    ai=ai||{};
    const o=aiPrivGet(), bg=!!ai.bg;
    if(o.off) throw aiOffError(true,bg);
    const closed=(Array.isArray(ai.uses)?ai.uses:[]).find(k=>o.deny[k]);
    if(closed) throw aiSectionError(closed,bg);
    if((+o.consent||0)>=AI_CONSENT_VER) return true;
    if(bg) throw aiOffError(false,true);
    if(await aiConsentSheet()) return true;
    throw aiOffError(false);
  }

  /* ── «Ще → AI і приватність» ── */
  function aiPrivacySheet(){
    const old=document.querySelector('.aip-sheet'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='asheet aip-sheet';
    const sw=(k,on,emo,t,d)=>'<button class="aip-tg" data-aip-tg="'+k+'" role="switch" aria-checked="'+(on?'true':'false')+'">'
      +'<span class="aip-ic">'+emo+'</span><span class="aip-tx"><b>'+t+'</b><small>'+d+'</small></span><span class="aip-sw"></span></button>';
    const paint=()=>{
      const o=aiPrivGet(), ok=(+o.consent||0)>=AI_CONSENT_VER;
      let at=''; try{ if(o.at) at=new Date(o.at).toLocaleDateString('uk-UA'); }catch(_){}
      const status=o.off ? 'AI вимкнено — жоден запит не йде.'
        : ok ? ('Згоду дано'+(at?' '+at:'')+'. Агент бачить лише увімкнені розділи.')
        : 'Згоди ще нема — AI не отримує нічого. Спитаю перед першим запитом.';
      ov.innerHTML='<div class="asheet-in aip-in">'
        +'<div class="asheet-grip"></div>'
        +'<div class="asheet-title">🔒 AI і приватність</div>'
        +'<div class="asheet-sub">'+status+'</div>'
        +sw('ai',!o.off,'✨','AI-помічник',o.off?'Вимкнено — жоден запит до AI не йде':'Чат, голос і аналізи можуть звертатися до AI')
        +'<div class="aip-lbl">Що агент може читати</div>'
        +AI_PRIV_SECTIONS.map(s=>sw(s.k,!o.deny[s.k],s.emo,s.t,s.d)).join('')
        +'<details class="aip-det"><summary>Що бачить AI і куди це йде</summary>'+aiPrivWhatHTML()+'</details>'
        +(ok ? '<button class="asheet-item danger" data-aip-revoke><span class="tx"><span class="lab2">Відкликати згоду</span>'
                +'<span class="sub2">Перед наступним запитом спитаю знову</span></span></button>'
             : '')
        +'<button class="asheet-cancel">Готово</button>'
        +'</div>';
      ov.querySelectorAll('[data-aip-tg]').forEach(b=>b.onclick=()=>{
        const k=b.dataset.aipTg, o2=aiPrivGet();
        if(k==='ai') o2.off=!o2.off; else o2.deny[k]=!o2.deny[k];
        aiPrivSet(o2);
        try{ window.platform.haptic('light'); }catch(_){}
        paint();
      });
      const rv=ov.querySelector('[data-aip-revoke]');
      if(rv) rv.onclick=()=>{ const o2=aiPrivGet(); o2.consent=0; o2.at=''; aiPrivSet(o2); paint(); };
      ov.querySelector('.asheet-cancel').onclick=()=>ov.remove();
    };
    paint();
    ov.addEventListener('click',e=>{ if(e.target===ov) ov.remove(); });
    document.body.appendChild(ov);
  }
  try{ window.aiPrivacySheet=aiPrivacySheet; window.aiAllowed=aiAllowed; window.aiQuietHint=aiQuietHint; }catch(_){}
