  /* ════════ ЕКРАН «ЩЕ»: модулі + навігація ════════ */
  (function(){
    const MAIN=[
      {k:'quick', emo:'⚡', c:'232,132,60',  t:'Швидкий запис', d:'Витрата, нотатка чи задача за 2 сек'},
      {k:'focus', emo:'⏱️', c:'255,107,157', t:'Фокус-сесії',   d:'Pomodoro + статистика концентрації'},
      {k:'report',emo:'📊', c:'91,141,239',  t:'Звіт тижня',    d:'Гроші, задачі, фокус, серії', badge:'нове'},
      {k:'streak',emo:'🔥', c:'52,199,123',  t:'Серії звичок',  d:'Стрік-календар за 90 днів'},
    ];
    const MORE=[
      {k:'inbox', emo:'📥', c:'47,182,196',  t:'Вхідні',            d:'Незараховані задачі', pill:'3'},
      {k:'goals', emo:'🎯', c:'199,125,255', t:'Дерево цілей',      d:'OKR-карта з прогресом гілок'},
      {k:'pdf',   emo:'📄', c:'240,180,41',  t:'Експорт PDF-звіту', d:'Гарний звіт для себе чи клієнта'},
      {k:'widget',emo:'📲', c:'106,125,255', t:'Віджети на екран',  d:'Баланс і задачі на головному'},
    ];
    const INFO={
      quick:'Глобальна кнопка швидкого вводу. Один тап — і ти записуєш <b>витрату, нотатку або задачу</b> без переходів по екранах. Розпізнає тип за текстом (напр. «-200 кава» → витрата).',
      focus:'Таймер <b>Pomodoro</b> з історією сесій: скільки годин фокусу за день/тиждень, які папки забирали найбільше уваги, серія днів поспіль.',
      report:'Один екран підсумків за тиждень: <b>дохід/витрати</b>, виконані задачі, години фокусу, найдовші серії звичок. Можна гортати по тижнях.',
      streak:'Календар-стрік для звичок за останні <b>90 днів</b>: видно пропуски, поточну й найдовшу серію, відсоток виконання.',
      inbox:'Швидкий «вхідний кошик» для задач, які ще не розкладені по папках. Накидав сюди — розсортував пізніше. Лічильник показує скільки чекає.',
      goals:'Візуальна <b>OKR-карта</b>: цілі → ключові результати → задачі. Видно прогрес кожної гілки й що тягне вниз.',
      pdf:'Згенерувати охайний <b>PDF-звіт</b> з твоєї статистики — для себе, інвестора чи клієнта. Логотип, графіки, період на вибір.',
      widget:'Винеси <b>баланс, задачі на сьогодні чи серію звичок</b> на головний екран телефона як віджет — без відкривання застосунку.',
    };
    function tileHTML(m){
      return `<button class="mh-tile" data-mh="${m.k}" style="--mc:rgb(${m.c})">
        <div class="mh-orb" style="background:rgb(${m.c})"></div>
        <div class="mh-ico" style="background:rgba(${m.c},.18)">${m.emo}</div>
        <h4>${m.t}</h4><p>${m.d}</p>
        ${m.badge?`<span class="mh-badge">${m.badge}</span>`:''}</button>`;
    }
    function rowHTML(m){
      const right = m.pill
        ? `<span class="mh-pill" style="background:rgba(${m.c},.2);color:rgb(${m.c})">${m.pill}</span>`
        : `<span class="mh-chev">›</span>`;
      return `<button class="mh-row" data-mh="${m.k}">
        <span class="mh-bar" style="background:rgb(${m.c})"></span>
        <div class="mh-ico" style="background:rgba(${m.c},.18)">${m.emo}</div>
        <div class="mh-tx"><h4>${m.t}</h4><p>${m.d}</p></div>${right}</button>`;
    }
    function renderMore(){
      const host=document.getElementById('moreHybrid'); if(!host) return;
      const _m=(window.uiMode||'pro');
      host.innerHTML=
        `<div class="mh-mode">
           <div class="mh-mode-tx"><b>Режим Frequency</b><span>${_m==='lite'
             ?'Lite — ядро: Планер · Гроші · Проєкти. Решта чекає тут.'
             :'Pro — повний Frequency: Огляд, простір, папки, все одразу.'}</span></div>
           <div class="mh-mode-seg">
             <button class="${_m==='lite'?'on':''}" data-uimode="lite">Lite</button>
             <button class="${_m==='pro'?'on':''}" data-uimode="pro">Pro</button>
           </div>
         </div>
         <div class="mh-lbl">⚡ Головне</div>
         <div class="mh-grid">${MAIN.map(tileHTML).join('')}</div>
         <div class="mh-lbl mt">🧩 Ще інструменти</div>
         <div class="mh-rows">${MORE.map(rowHTML).join('')}</div>`;
      host.querySelectorAll('[data-mh]').forEach(b=>b.addEventListener('click',()=>openMoreSheet(b.dataset.mh)));
      host.querySelectorAll('[data-uimode]').forEach(b=>b.addEventListener('click',()=>{
        (window.setUiMode||function(){})(b.dataset.uimode);
        renderMore();
      }));
    }
    function openMoreSheet(key){
      const m=[...MAIN,...MORE].find(x=>x.k===key); if(!m) return;
      window.platform.haptic('light');
      // живі дії замість заглушок
      if(key==='quick'){ if(window.flowQuickCapture) window.flowQuickCapture(); return; }
      if(key==='inbox'){ if(window.flowOpenInbox) window.flowOpenInbox(); return; }
      const ov=document.createElement('div'); ov.className='mh-sheet';
      ov.innerHTML=`<div class="mh-sheet-in">
        <div class="mh-grip"></div>
        <div class="mh-sheet-h">
          <div class="mh-ico" style="background:rgba(${m.c},.18)">${m.emo}</div>
          <div><h3>${m.t}</h3><span>${m.d}</span></div></div>
        <div class="mh-sheet-body">${INFO[key]||''}<br><span class="mh-soon">🚧 У розробці</span></div>
      </div>`;
      ov.addEventListener('click',e=>{ if(e.target===ov) ov.remove(); });
      document.body.appendChild(ov);
    }
    function goMore(){ renderMore(); renderAccount(); const sh=window.__show||window.show||(typeof show==='function'?show:null); if(sh) sh('scr-more'); }
    window.goMore=goMore; window.renderMore=renderMore;

    /* ── АКАУНТ + статус синхрону + діагностика ── */
    function escA(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    function safeImgA(u){ u=String(u==null?'':u).trim(); if(/^https?:\/\//i.test(u)||/^data:image\//i.test(u)) return u.replace(/'/g,'%27').replace(/"/g,'%22'); return ''; }
    function tgUser(){ return window.platform.user(); }
    // читає обране фото і стискає в маленький квадрат (щоб влізло в хмарний ліміт)
    function readAvatarFile(file){
      return new Promise((resolve,reject)=>{
        if(!file||!/^image\//.test(file.type)){ reject(new Error('не фото')); return; }
        const fr=new FileReader();
        fr.onerror=()=>reject(new Error('не вдалось прочитати файл'));
        fr.onload=()=>{
          const img=new Image();
          img.onerror=()=>reject(new Error('пошкоджене зображення'));
          img.onload=()=>{
            const S=160, side=Math.min(img.width,img.height);
            const sx=(img.width-side)/2, sy=(img.height-side)/2;
            const cv=document.createElement('canvas'); cv.width=S; cv.height=S;
            const ctx=cv.getContext('2d');
            ctx.drawImage(img, sx, sy, side, side, 0, 0, S, S);
            resolve(cv.toDataURL('image/jpeg', 0.82));
          };
          img.src=fr.result;
        };
        fr.readAsDataURL(file);
      });
    }
    function syncLabel(st){
      const gUser=(window.sbUser && window.sbUser())||null;
      const cloudTxt = window.FLOW_NATIVE ? 'збережено на цьому пристрої' : (gUser ? 'хмара Google · всі пристрої' : 'хмара Telegram · всі пристрої');
      if(st==='syncing') return ['syncing','Синхронізація…','дані вирівнюються між пристроями'];
      if(st==='synced')  return ['synced','Синхронізовано',cloudTxt];
      if(st==='error'){
        if(window.__flowSync && window.__flowSync.quota)
          return ['error','Пам\u2019ять заповнена','локальна копія відстає · хмара зберігає дані'];
        return ['error','Помилка синхрону','перевір зʼєднання'];
      }
      if(st==='local-big') return ['error','Завелике для хмари','частина даних (фото) лише тут'];
      return ['idle','Локально','зміни збережено на цьому пристрої'];
    }
    function ALL_KEYS(){ return (window.FLOW_KEYS||[]).slice(); }

    function tgDiag(){ return window.platform.diag(); }

    function renderAccount(){
      const host=document.getElementById('accountCard'); if(!host) return;
      const u=tgUser();
      const gUser=(window.sbUser && window.sbUser())||null;
      const cloud=window.__flowSync?.cloud;
      // поки Supabase ще перевіряє сесію (перша мить після відкриття сайту) —
      // НЕ стверджуємо «Гість», щоб не блимати хибним станом, який сам собою виправляється
      const checking = !u && !gUser && !window.FLOW_NATIVE && window.__sbReady===false;
      const name=checking?'Перевіряємо…':(u?((u.first_name||'')+(u.last_name?' '+u.last_name:'')).trim()||'Користувач'
        :(gUser?((gUser.user_metadata&&gUser.user_metadata.full_name)||gUser.email||'Google'):'Гість'));
      const sub=checking?'':(u?('@'+(u.username||('id'+u.id))+(cloud?' · Telegram':''))
        :(gUser?(gUser.email||'Google'):'без входу · дані лише тут'));
      const gPic=gUser&&gUser.user_metadata&&gUser.user_metadata.avatar_url;
      const av=checking?'⏳':(customAvatar?`<img src="${customAvatar}" alt="">`
        :(u&&u.photo_url?`<img src="${safeImgA(u.photo_url)}" alt="">`
        :(gUser&&gPic?`<img src="${safeImgA(gPic)}" alt="">`:(name||'F').trim().charAt(0).toUpperCase())));
      const [cls,txt]=syncLabel(window.__flowSync?.state||'idle');
      const loggedIn=!!(u||gUser);

      // рядок «Вхід»: показує поточний стан; якщо не увійдено — тап розкриває варіанти
      const loginSub=checking?'Перевіряємо сесію…':(u?('Telegram · @'+(u.username||('id'+u.id)))
        :gUser?('Google · '+(gUser.email||''))
        :'Не увійдено · дані лише на цьому пристрої');
      const loginIco=checking?'⏳':(u?'✈️':(gUser?'🔵':'🔑'));
      // «Вийти» доступне лише для Google — з Telegram-ідентичності вийти нема куди
      const loginAction=(gUser&&!u)
        ? `<button class="acc-row-out" data-acc-out>Вийти</button>`
        : `<span class="acc-chev">›</span>`;
      const loginExpand=(!loggedIn && !window.FLOW_NATIVE && !checking) ? `
        <div class="acc-expand" data-acc-login-expand hidden>
          <button class="acc-mini tg" data-acc-tg>✈️ Telegram</button>
          <button class="acc-mini gg" data-acc-google>🔵 Google</button>
        </div>` : '';

      const bkStats=(()=>{const s=window.flowBackup?window.flowBackup.stats():{keys:0,bytes:0};return s.keys+' записів · '+(s.bytes>1024?(s.bytes/1024).toFixed(0)+' КБ':s.bytes+' Б');})();
      const avHintTxt=customAvatar
        ? 'Власна іконка встановлена — можна замінити.'
        : 'Не обов’язково: можна додати власну іконку профілю, або лишити фото з Google чи літеру імені.';
      const avHint=`<p class="acc-hint acc-hint-av">${avHintTxt}${customAvatar?' <button class="acc-mini-link" data-acc-av-remove>прибрати</button>':''}</p>`;

      host.innerHTML=`<div class="acc-wrap">
        <div class="acc-head">
          <div class="acc-av-wrap">
            <div class="acc-av" data-acc-av-btn>${av}</div>
            <div class="acc-av-edit" data-acc-av-btn>✎</div>
          </div>
          <div class="acc-hinfo">
            <div class="acc-hname">${escA(name)}</div>
            <div class="acc-hsub"><span class="acc-dot ${cls}"></span>${escA(txt)}</div>
          </div>
          ${cloud?`<button class="acc-refresh" data-acc-sync>↻</button>`:''}
        </div>
        <input type="file" accept="image/*" data-acc-av-file style="display:none">
        ${avHint}
        ${window.FLOW_NATIVE ? '' : `
        <div class="acc-row" data-acc-login-row>
          <div class="acc-rico">${loginIco}</div>
          <div class="acc-rtext"><div class="acc-rtitle">${loggedIn?'Вхід':'Увійти'}</div><div class="acc-rsub">${escA(loginSub)}</div></div>
          ${loginAction}
        </div>
        ${loginExpand}`}
        <div class="acc-row" data-acc-backup-row>
          <div class="acc-rico">🛟</div>
          <div class="acc-rtext"><div class="acc-rtitle">Бекап даних</div><div class="acc-rsub">${bkStats}</div></div>
          <span class="acc-chev">›</span>
        </div>
        <div class="acc-expand" data-acc-backup-expand hidden>
          <button class="acc-mini" data-acc-export>⬇️ Експорт у файл</button>
          <button class="acc-mini" data-acc-import>⬆️ Імпорт з файлу</button>
          <input type="file" accept="application/json,.json" data-acc-file style="display:none">
          <p class="acc-hint">Імпорт перезапише поточні дані (попередній стан зберігається автоматично).</p>
        </div>
        <div class="acc-row" data-acc-settings-row>
          <div class="acc-rico">⚙️</div>
          <div class="acc-rtext"><div class="acc-rtitle">Всі налаштування</div></div>
          <span class="acc-chev">›</span>
        </div>
      </div>`;

      function toggle(sel){ const el=host.querySelector(sel); if(el) el.hidden=!el.hidden; }

      const syncBtn=host.querySelector('[data-acc-sync]');
      if(syncBtn) syncBtn.onclick=async (e)=>{
        e.stopPropagation();
        syncBtn.disabled=true; const old=syncBtn.textContent; syncBtn.textContent='…';
        try{ window.__flowSync.warmed=false; await window.storage.pullAll(ALL_KEYS()); }catch(_){}
        // pullAll вище — лише для Telegram CloudStorage; для Google-акаунта
        // тягнемо все одним пакетним запитом, інакше load() нижче знову піде
        // по ключах окремо (десятки послідовних запитів замість одного)
        try{ if(typeof window.sbPrefetchAll==='function' && window.sbUser && window.sbUser()) await window.sbPrefetchAll(); }catch(_){}
        // мʼяке оновлення без reload (reload у Telegram викидає в меню)
        try{ const ld=window.__load; if(typeof ld==='function') await ld(); }catch(_){}
        try{ const rd=window.__renderDashboard; if(typeof rd==='function') rd(); }catch(_){}
        try{ if(typeof renderMore==='function') renderMore(); }catch(_){}
        syncBtn.disabled=false; syncBtn.textContent=old||'↻';
        renderAccount();
      };

      const loginRow=host.querySelector('[data-acc-login-row]');
      if(loginRow) loginRow.onclick=()=>{ if(!loggedIn) toggle('[data-acc-login-expand]'); };
      const outBtn=host.querySelector('[data-acc-out]');
      if(outBtn) outBtn.onclick=(e)=>{ e.stopPropagation(); if(window.sbSignOut) window.sbSignOut(); };
      const tb=host.querySelector('[data-acc-tg]');
      if(tb) tb.onclick=(e)=>{ e.stopPropagation(); const d=tgDiag();
        flowAlert('Щоб увійти:\n\n1) Відкрий Frequency через Menu Button свого бота (BotFather → /setmenubutton), а не через посилання в браузері.\n2) initData зараз: '+(d.initLen||0)+' символів.\n\nЯкщо 0 — Telegram не передав акаунт. Перевір, що домен Mini App у BotFather збігається з хостингом.'); };
      const gb=host.querySelector('[data-acc-google]');
      if(gb) gb.onclick=async (e)=>{
        e.stopPropagation();
        if(gb.disabled) return;
        gb.disabled=true; const old=gb.textContent; gb.textContent='⏳ Відкриваємо…';
        try{ if(window.sbSignInGoogle) await window.sbSignInGoogle(); }
        finally{ setTimeout(()=>{ try{ gb.disabled=false; gb.textContent=old; }catch(_){} }, 8000); }
      };

      const bkRow=host.querySelector('[data-acc-backup-row]');
      if(bkRow) bkRow.onclick=()=>toggle('[data-acc-backup-expand]');
      const exb=host.querySelector('[data-acc-export]');
      if(exb) exb.onclick=(e)=>{
        e.stopPropagation();
        const r=window.flowBackup.exportToFile();
        if(r.ok) flowAlert('✅ Збережено: '+r.name+'\n\nПоклади файл у надійне місце (хмара, пошта собі).');
        else flowAlert('❌ Не вдалося експортувати: '+(r.error||'невідома помилка'));
      };
      const imb=host.querySelector('[data-acc-import]');
      const fileInput=host.querySelector('[data-acc-file]');
      if(imb && fileInput){
        imb.onclick=(e)=>{ e.stopPropagation(); fileInput.click(); };
        fileInput.onchange=async ()=>{
          const f=fileInput.files&&fileInput.files[0]; if(!f) return;
          confirmSheet({title:'Імпортувати «'+f.name+'»?', sub:'Поточні дані буде замінено. Авто-копія попереднього стану збережеться на випадок відкату.', okLabel:'Імпортувати', onOk:async ()=>{
          const r=await window.flowBackup.importFromFile(f);
          fileInput.value='';
          if(r.ok){
            flowAlert('✅ Відновлено '+r.restored+' записів'+(r.exportedAt?'\nз бекапу від '+new Date(r.exportedAt).toLocaleString():'')+'\n\nЗастосунок зараз перезавантажить дані.');
            try{ const ld=window.__load; if(typeof ld==='function') await ld(); }catch(_){}
            try{ const rd=window.__renderDashboard; if(typeof rd==='function') rd(); }catch(_){}
            try{ if(typeof renderMore==='function') renderMore(); }catch(_){}
            renderAccount();
          } else {
            flowAlert('❌ Імпорт не вдався: '+(r.error||'невідома помилка'));
          }
          }});
        };
      }

      const setRow=host.querySelector('[data-acc-settings-row]');
      if(setRow) setRow.onclick=()=>{ if(window.openSettingsSheet) window.openSettingsSheet(); };

      // власна іконка профілю: тап по аватарці/олівцю відкриває вибір фото
      const avFile=host.querySelector('[data-acc-av-file]');
      host.querySelectorAll('[data-acc-av-btn]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); if(avFile) avFile.click(); });
      if(avFile) avFile.onchange=async ()=>{
        const f=avFile.files&&avFile.files[0]; avFile.value='';
        if(!f) return;
        try{
          customAvatar=await readAvatarFile(f);
          saveCustomAvatar();
          renderAccount();
        }catch(e){ flowAlert('❌ Не вдалося встановити іконку: '+(e.message||'спробуй інше фото')); }
      };
      const avRemove=host.querySelector('[data-acc-av-remove]');
      if(avRemove) avRemove.onclick=(e)=>{ e.stopPropagation(); customAvatar=''; saveCustomAvatar(); renderAccount(); };

      // тримаємо нижню панель (сайдбар/шторка гостя) в тому ж стані, що й ця картка
      try{ if(typeof window.dsbFillUser==='function') window.dsbFillUser(); }catch(_){}
    }
    window.renderAccount=renderAccount;
    document.addEventListener('flowsync', ()=>{
      if(!document.getElementById('scr-more')?.classList.contains('active')) return;
      // під час старту (load()) прилітає ціла черга подій flowsync — без дебаунсу
      // це смикало accountCard десятки разів поспіль і зсувало прокрутку донизу
      clearTimeout(window.__acctRenderT);
      window.__acctRenderT=setTimeout(renderAccount, 120);
    });

    // прив'язка кнопок «Ще» (топбар Огляду + десктопний сайдбар) і центральної AI
    const hm=document.getElementById('homeMoreBtn'); if(hm) hm.onclick=goMore;
    const na=document.getElementById('navAI'); if(na) na.onclick=()=>{ if(window.aiChatSheet) window.aiChatSheet(); };
    try{ flowCapRender(); setInterval(flowCapRender,60000); }catch(_){}
    try{ prefCatchup('pet_pos',()=>flowCapRender()); prefCatchup('pet_sleep',()=>flowCapRender()); }catch(_){}
    document.querySelectorAll('.dsb-i[data-dnav="more"]').forEach(b=>b.onclick=goMore);
    renderMore();
    renderAccount();
  })();
