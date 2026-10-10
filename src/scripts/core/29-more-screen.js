  /* ════════ ЕКРАН «ЩЕ»: модулі + навігація ════════ */
  (function(){
    /* Лише живі плитки. Заглушки «🚧 У розробці» (звіт тижня, серії звичок, PDF,
       віджети) прибрано 30.09.2026: людина тапала — а там обіцянка. Фокус і цілі
       вже є в Планері й «Плані на рік» — плитки ведуть туди. */
    /* Лише живі пункти. Заглушки «🚧 У розробці» прибрано 30.09.2026.
       03.10.2026: емодзі → лінійні іконки на кольоровій плашці (window.stgIco,
       05-spaces.js); «Проєкти» з «Ще» прибрано — Ярослав просив прибрати їх
       зовсім (з бічної панелі зникли 25.09); сам екран лишився за ⌘5.
       Режим Lite/Pro переїхав у розділ «Вигляд» (renderSettingsCard). */
    const TOOLS=[
      {k:'quick', ic:'bolt',   c:'amber',  t:'Швидкий запис', d:'витрата, нотатка чи задача'},
      {k:'focus', ic:'timer',  c:'pink',   t:'Фокус-сесія',   d:'Pomodoro 25 хв і підсумок дня'},
      {k:'inbox', ic:'inbox',  c:'teal',   t:'Вхідні',        d:'записи, що чекають розбору'},
      {k:'goals', ic:'target', c:'violet', t:'План на рік',   d:'цілі, кроки й прогрес'},
    ];
    /* Lite ховає «Огляд» з панелі — сюди ведуть двері до решти */
    const LITE_DOORS=[
      {k:'home',   ic:'folder',  c:'blue',   t:'Папки й чати',  d:'Огляд: усі папки, чати й Вхідні'},
      {k:'diary',  ic:'book',    c:'violet', t:'Щоденник',      d:'записи дня й зошити'},
      {k:'wishes', ic:'compass', c:'amber',  t:'Карта бажань',  d:'бажання, колаж і ранковий ритуал'},
    ];
    const DEV_ROWS=[
      {k:'upgrade', ic:'dna',  c:'violet', t:'Апгрейд',          d:'Персонаж, сфери, заявлений шлях'},
      {k:'misto',   ic:'city', c:'blue',   t:'Гра «Місто дня»',  d:'Прототип: місто, персонаж, друзі'},
    ];
    /* справжній лічильник «Вхідних»: записи, що чекають (виконані задачі не рахуємо);
       нуль або помилка — жодного числа, а не вигадане «3» */
    function inboxWaiting(){
      try{ return (boards[chatBk(INBOX_CHAT)]||[]).filter(b=>b&&!b.done).length; }catch(_){ return 0; }
    }
    const ico=(n,c)=>(window.stgIco?window.stgIco(n,c):'');
    const chev=()=>'<span class="mr-chev">'+(window.stgSvg?window.stgSvg('chev'):'›')+'</span>';
    function rowHTML(m){
      const pill=m.pill?`<span class="mr-pill">${m.pill}</span>`:'';
      return `<button class="mr-row" data-mh="${m.k}">${ico(m.ic,m.c)}
        <span class="mr-tx"><b>${m.t}</b><small>${m.d}</small></span>${pill}${chev()}</button>`;
    }
    function renderMore(){
      const host=document.getElementById('moreHybrid'); if(!host) return;
      const _m=(window.uiMode||'pro');
      const nIn=inboxWaiting();
      const tools=TOOLS.map(m=>m.k==='inbox'&&nIn>0?Object.assign({},m,{pill:String(nIn)}):m);
      host.innerHTML=
        `<div class="mr-sl" data-sec="tools">Інструменти</div>
         <div class="mr-grp mr-tools" data-sec="tools">${tools.map(rowHTML).join('')}</div>` +
        (_m==='lite'
          ? `<div class="mr-sl" data-sec="lite">Решта Frequency</div>
             <div class="mr-grp" data-sec="lite">${LITE_DOORS.map(rowHTML).join('')}</div>`
          : '') +
        ((window.upDevOn&&window.upDevOn())
          ? `<div class="mr-sl" data-sec="dev">Розробка</div>
             <div class="mr-grp" data-sec="dev">${DEV_ROWS.map(rowHTML).join('')}</div>`
          : '');
      host.querySelectorAll('[data-mh]').forEach(b=>b.addEventListener('click',()=>openMoreSheet(b.dataset.mh)));
      renderMoreIndex();
    }

    /* ── Комп'ютер: розділи ліворуч, вміст одного праворуч (варіант B, 03.10.2026) ──
       На телефоні всі розділи йдуть одним списком (варіант A). Розмітка однакова:
       кожен розділ — пара .mr-sl/.mr-grp з data-sec, а що видно на широкому
       екрані, вирішує атрибут data-msec на #scr-more (22-more-screen.css).
       «Інструменти» на комп'ютері стоять завжди — це дії, а не налаштування. */
    const MSEC=[['profile','Профіль'],['data','Дані'],['look','Вигляд'],['pet','Напарник'],
      ['ai','AI і приватність'],['lite','Решта Frequency'],['dev','Розробка'],['about','Про застосунок'],['danger','Скидання']];
    function moreIsWide(){ try{ return window.matchMedia('(min-width:1024px)').matches; }catch(_){ return false; } }
    function renderMoreIndex(){
      const ix=document.getElementById('moreIndex'), scr=document.getElementById('scr-more'); if(!ix||!scr) return;
      const present=MSEC.filter(([k])=>scr.querySelector('.mr-grp[data-sec="'+k+'"]'));
      if(!present.some(([k])=>k===scr.dataset.msec)) scr.dataset.msec='profile';
      const cur=scr.dataset.msec;
      ix.innerHTML=present.map(([k,l])=>`<button class="mi${k===cur?' on':''}${k==='danger'?' red':''}" data-msec="${k}"${k===cur?' aria-current="true"':''}>${l}</button>`).join('');
      ix.querySelectorAll('[data-msec]').forEach(b=>b.onclick=()=>moreShowSection(b.dataset.msec));
    }
    function moreShowSection(k, scroll){
      const scr=document.getElementById('scr-more'); if(!scr) return;
      // прокручується body, а не вікно (див. show() у 05-spaces.js) — window.scrollTo тут нічого не робить
      if(moreIsWide()){ scr.dataset.msec=k; renderMoreIndex(); try{ document.body.scrollTop=0; }catch(_){} return; }
      if(scroll){
        const el=scr.querySelector('.mr-sl[data-sec="'+k+'"]')||scr.querySelector('[data-sec="'+k+'"]');
        if(el) try{ el.scrollIntoView({behavior:'smooth',block:'start'}); }catch(_){ el.scrollIntoView(); }
      }
    }
    window.moreShowSection=moreShowSection;
    // кожна плитка — жива дія (колишня шторка «🚧 У розробці» більше не потрібна)
    function openMoreSheet(key){
      try{ window.platform.haptic('light'); }catch(_){}
      if(key==='upgrade'){ if(window.goUpgrade) window.goUpgrade(); return; }
      // гра — окрема сторінка поруч (src/web/misto.html), свої дані, назад — кнопкою з іконкою Frequency
      // без мережі не переходимо: воркер її не кешує, а в застосунку з екрана «Додому» на iPhone
      // зі сторінки «немає інтернету» нема кнопки «назад» — вийти можна лише закривши застосунок
      if(key==='misto'){
        if(!(window.upDevOn&&window.upDevOn())) return;   // dev-гра: лише за воротами upDevOn
        if(navigator.onLine===false){ if(typeof flowAlert==='function') flowAlert('Гра відкривається лише з інтернетом. Спробуй, коли зʼявиться мережа.','Немає мережі'); return; }
        location.href='misto.html'; return;
      }
      if(key==='projects'){ if(window.goProjects) window.goProjects(); return; }
      if(key==='aipriv'){ if(window.aiPrivacySheet) window.aiPrivacySheet(); return; }
      if(key==='quick'){ if(window.flowQuickCapture) window.flowQuickCapture(); return; }
      if(key==='inbox'){ if(window.flowOpenInbox) window.flowOpenInbox(); return; }
      if(key==='focus'){ try{ plStartFocus(); }catch(e){ console.error('more focus',e); } return; }
      if(key==='goals'){ goGoals(); return; }
      if(key==='home'){ goHome(); return; }
      if(key==='diary'){ if(window.goDiary) window.goDiary(); return; }
      if(key==='wishes'){ if(window.goWishes) window.goWishes(); return; }
    }
    function goMore(){
      renderMore(); renderAccount();
      try{ if(window.renderSettingsCard) window.renderSettingsCard(); }catch(_){}
      const scr=document.getElementById('scr-more'); if(scr) scr.dataset.msec='profile';
      renderMoreIndex();
      const sh=window.__show||window.show||(typeof show==='function'?show:null); if(sh) sh('scr-more');
    }
    window.goMore=goMore; window.renderMore=renderMore;

    /* ── АКАУНТ + статус синхрону + діагностика ── */
    function escA(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    function safeImgA(u){ u=String(u==null?'':u).trim(); if(/^https?:\/\//i.test(u)||/^data:image\//i.test(u)) return u.replace(/'/g,'%27').replace(/"/g,'%22'); return ''; }
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
      const cloudTxt = window.FLOW_NATIVE ? 'збережено на цьому пристрої' : (gUser ? 'хмара Google · всі пристрої' : 'лише на цьому пристрої · увійди для хмари');
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

    /* ── індикатор пам'яті ──
       localStorage («швидка память») впирається в ~5 МБ — саме він дає банер
       «памʼять заповнена». Фото й книги живуть окремо в IndexedDB, де місця на
       порядки більше. Показуємо обидва, щоб було видно, що саме тисне. */
    async function flowStorageInfo(){
      let lsBytes=0;
      try{ for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(!k) continue;
        lsBytes += (k.length + (localStorage.getItem(k)||'').length)*2; } }catch(_){}
      const lsCap=5*1024*1024;
      let usage=0, quota=0;
      try{ if(navigator.storage && navigator.storage.estimate){ const e=await navigator.storage.estimate(); usage=e.usage||0; quota=e.quota||0; } }catch(_){}
      return { lsBytes, lsCap, idbBytes:Math.max(0, usage-lsBytes), quota };
    }
    function fmtMem(b){ return b>=1048576 ? (b/1048576).toFixed(1)+' МБ' : Math.max(1,Math.round(b/1024))+' КБ'; }
    async function fillMemRow(host){
      try{
        const el=host&&host.querySelector('[data-acc-mem] .acc-mem-body'); if(!el) return;
        const s=await flowStorageInfo();
        const pct=Math.min(100, Math.round(s.lsBytes/s.lsCap*100));
        const col=pct>=85?'var(--owe,#ff5a5f)':pct>=65?'var(--fin,#f0b429)':'var(--hab,#34c77b)';
        const idbTxt=s.quota?(fmtMem(s.idbBytes)+' · вільно ще '+fmtMem(Math.max(0,s.quota-s.idbBytes-s.lsBytes))):fmtMem(s.idbBytes);
        el.innerHTML=
          '<div class="acc-rsub">Швидка памʼять (дані): <b style="color:var(--text)">'+fmtMem(s.lsBytes)+'</b> з ~'+fmtMem(s.lsCap)+'</div>'
          +'<div style="height:6px;border-radius:99px;background:var(--field);overflow:hidden;margin:6px 0 2px"><i style="display:block;height:100%;width:'+pct+'%;background:'+col+';border-radius:99px"></i></div>'
          +'<div class="acc-rsub" style="margin-top:5px">Фото й книги (окремо): '+idbTxt+'</div>'
          +(pct>=85?'<div class="acc-rsub" style="color:var(--owe,#ff5a5f);margin-top:4px">Майже повна — зроби експорт і почисти старі фото чи дані.</div>':'');
      }catch(_){}
    }

    function renderAccount(){
      const host=document.getElementById('accountCard'); if(!host) return;
      const gUser=(window.sbUser && window.sbUser())||null;
      const cloud=window.__flowSync?.cloud;
      // поки Supabase ще перевіряє сесію (перша мить після відкриття сайту) —
      // НЕ стверджуємо «Гість», щоб не блимати хибним станом, який сам собою виправляється
      const checking = !gUser && !window.FLOW_NATIVE && window.__sbReady===false;
      const name=checking?'Перевіряємо…'
        :(gUser?((gUser.user_metadata&&gUser.user_metadata.full_name)||gUser.email||'Google'):'Гість');
      const sub=checking?'':(gUser?(gUser.email||'Google'):'без входу · дані лише тут');
      const gPic=gUser&&gUser.user_metadata&&gUser.user_metadata.avatar_url;
      const av=checking?'⏳':(customAvatar?`<img src="${safeImgA(customAvatar)}" alt="">`
        :(gUser&&gPic?`<img src="${safeImgA(gPic)}" alt="">`:(name||'F').trim().charAt(0).toUpperCase()));
      const [cls,txt]=syncLabel(window.__flowSync?.state||'idle');
      const loggedIn=!!gUser;

      // рядок «Вхід»: показує поточний стан; якщо не увійдено — тап розкриває варіанти
      const loginSub=checking?'Перевіряємо сесію…'
        :gUser?('Google · '+(gUser.email||''))
        :window.__flowForeign?'Тут дані іншого акаунта · синк вимкнено'
        :'Не увійдено · дані лише на цьому пристрої';
      const loginIco=checking?ico('sync','slate'):(gUser?ico('user','blue'):ico('key','blue'));
      // «Вийти» доступне лише коли є Google-сесія
      const loginAction=gUser
        ? `<button class="acc-row-out" data-acc-out>Вийти</button>`
        : `<span class="acc-chev">›</span>`;
      const loginExpand=(!loggedIn && !window.FLOW_NATIVE && !checking) ? `
        <div class="acc-expand" data-acc-login-expand hidden>
          <button class="acc-mini gg" data-acc-google>Увійти через Google</button>
        </div>` : '';

      const bkStats=(()=>{const s=window.flowBackup?window.flowBackup.stats():{keys:0,bytes:0};return s.keys+' записів · '+(s.bytes>1024?(s.bytes/1024).toFixed(0)+' КБ':s.bytes+' Б');})();
      const avHintTxt=customAvatar
        ? 'Власна іконка встановлена — можна замінити.'
        : 'Не обов’язково: можна додати власну іконку профілю, або лишити фото з Google чи літеру імені.';
      const avHint=`<p class="acc-hint acc-hint-av">${avHintTxt}${customAvatar?' <button class="acc-mini-link" data-acc-av-remove>прибрати</button>':''}</p>`;
      // журнал помилок (01-crash-screen.js): на телефоні нема консолі — тут видно, що падало
      const errs=(window.flowErrLog&&window.flowErrLog.list())||[];
      const errWhen=t=>(window.flowErrLog?window.flowErrLog.when(t):String(t));
      const errSub=errs.length?(errs.length+' записів · остання '+errWhen(errs[errs.length-1].t)):'порожньо — помилок не було';
      const errList=errs.length
        ? errs.slice(-20).reverse().map(e=>`<div class="acc-errlog-i"><b>${escA(errWhen(e.t))}${e.n>1?' ×'+e.n:''}</b> ${escA(e.msg)}${e.src||e.line?` <span>@ ${escA(e.src||'?')}:${+e.line||0}</span>`:''}</div>`).join('')
        : '<div class="acc-errlog-i">Поки порожньо.</div>';

      /* Розділи профілю. Усе лежить в одному #accountCard, бо обробники нижче
         шукають свої елементи саме тут (host.querySelector). Порядок на екрані
         задає data-sec (22-more-screen.css): «Про застосунок» і «Скидання» стоять
         у самому низу, хоч у розмітці вони тут, біля бекапу. */
      host.innerHTML=`<div class="acc-wrap">
        <div class="mr-grp mr-prof" data-sec="profile">
          <div class="acc-head">
            <div class="acc-av-wrap">
              <div class="acc-av" data-acc-av-btn>${av}</div>
              <div class="acc-av-edit" data-acc-av-btn>✎</div>
            </div>
            <div class="acc-hinfo">
              <div class="acc-hname">${escA(name)}</div>
              <div class="acc-hsub"><span class="acc-dot ${cls}"></span>${escA(txt)}</div>
            </div>
            ${cloud?`<button class="acc-refresh" data-acc-sync aria-label="Синхронізувати">${window.stgSvg?window.stgSvg('sync'):'↻'}</button>`:''}
          </div>
          <input type="file" accept="image/*" data-acc-av-file style="display:none">
          ${avHint}
          ${window.FLOW_NATIVE ? '' : `
          <div class="acc-row" data-acc-login-row>
            ${loginIco}
            <div class="acc-rtext"><div class="acc-rtitle">${loggedIn?'Вхід':'Увійти'}</div><div class="acc-rsub">${escA(loginSub)}</div></div>
            ${loginAction}
          </div>
          ${loginExpand}`}
        </div>
        <div class="mr-sl" data-sec="data">Дані</div>
        <div class="mr-grp" data-sec="data">
          <div class="acc-row" data-acc-backup-row>
            ${ico('backup','blue')}
            <div class="acc-rtext"><div class="acc-rtitle">Бекап і відновлення</div><div class="acc-rsub">${bkStats}</div></div>
            ${chev()}
          </div>
          <div class="acc-expand" data-acc-backup-expand hidden>
            <button class="acc-mini" data-acc-export>Експорт у файл</button>
            <button class="acc-mini" data-acc-export-ph>Повний бекап з фото</button>
            <button class="acc-mini" data-acc-import>Імпорт з файлу</button>
            <input type="file" accept="application/json,.json,application/zip,.zip" data-acc-file style="display:none">
            <p class="acc-hint" data-acc-ph-count>Фото: рахую…</p>
            <p class="acc-hint">«Експорт» — лише дані, файл малий. «Повний бекап з фото» — zip, де кожне фото окремим файлом: і з цього пристрою, і ті, що поки лежать лише в хмарі (їх бекап спершу докачає). Книжки з читалки в бекап не входять — їх треба буде завантажити знову. Імпорт спершу покаже, що саме відновиться, і лише тоді перезапише дані (попередній стан збережеться автоматично).</p>
          </div>
          <div class="acc-row" data-acc-cur role="button" tabindex="0">
            ${ico('backup','green')}
            <div class="acc-rtext"><div class="acc-rtitle">Головна валюта</div><div class="acc-rsub">${escA(curSym()+' '+((CUR_LIST[mainCur()]||{}).n||mainCur()))} ${curLocked()?' · зафіксована':' · у ній Гаманець, віджети, призи, План'}</div></div>
            ${chev()}
          </div>
          <div class="acc-row" data-acc-finreset role="button" tabindex="0">
            ${ico('reset','red')}
            <div class="acc-rtext"><div class="acc-rtitle">Почати фінанси з нуля</div><div class="acc-rsub">стерти операції, конверти, План і цілі місяця — місії, Журнал, папки, борги й години Роботи лишаються</div></div>
            ${chev()}
          </div>
          <div class="acc-row" data-acc-oldw role="button" tabindex="0">
            ${ico('backup','slate')}
            <div class="acc-rtext"><div class="acc-rtitle">Старі віджети</div><div class="acc-rsub">прибрати старі «Фінанси», «Конверт», «Проєкт», «Фестиваль», KPI зі сторінок папок</div></div>
            ${chev()}
          </div>
          <div class="acc-row acc-mem-row" data-acc-mem style="cursor:default">
            ${ico('disk','slate')}
            <div class="acc-rtext" style="flex:1;min-width:0">
              <div class="acc-rtitle">Пам'ять пристрою</div>
              <div class="acc-mem-body"><div class="acc-rsub">рахую…</div></div>
            </div>
          </div>
        </div>
        <div class="mr-sl" data-sec="about">Про застосунок</div>
        <div class="mr-grp" data-sec="about">
          <div class="acc-row" data-acc-ver style="cursor:default">
            ${ico('info','slate')}
            <div class="acc-rtext"><div class="acc-rtitle">Версія</div><div class="acc-rsub">${escA(window.FLOW_BUILD||'невідома')} · дата збірки й код коміту</div></div>
          </div>
          <div class="acc-row" data-acc-errlog-row>
            ${ico('bug','slate')}
            <div class="acc-rtext"><div class="acc-rtitle">Журнал помилок</div><div class="acc-rsub">${escA(errSub)}</div></div>
            ${chev()}
          </div>
          <div class="acc-expand" data-acc-errlog-expand hidden>
            <div class="acc-errlog">${errList}</div>
            <button class="acc-mini" data-acc-errlog-share>Скопіювати / поділитися</button>
            <p class="acc-hint">Лише на цьому пристрої: журнал не йде ні в хмару, ні в бекап. Надішли його, коли щось зламалось.</p>
          </div>
        </div>
        <div class="mr-grp mr-danger" data-sec="danger">
          <div class="acc-row" data-acc-reset-row>
            ${ico('reset','red')}
            <div class="acc-rtext"><div class="acc-rtitle">Скидання до заводських</div><div class="acc-rsub">стерти дані на цьому пристрої або всюди</div></div>
            ${chev()}
          </div>
          <div class="acc-expand" data-acc-reset-expand hidden>
            <button class="acc-mini" data-acc-reset-device>Скинути цей пристрій</button>
            <button class="acc-mini dng" data-acc-reset-all>Стерти все з акаунта</button>
            <p class="acc-hint">«Скинути пристрій» чистить лише цю копію — з входом в акаунт дані повернуться з хмари. «Стерти все» видаляє і хмару: повний нуль, як після першого встановлення. Перед обома діями бекап автоматично збережеться у файл. «Скинути пристрій» кладе в нього фото з цього пристрою (решта лишається в хмарі). «Стерти все» спершу докачує у файл і фото, що є лише в хмарі, — і нічого не стирає, якщо хоч одне взяти не вдалось. Книжки з читалки в бекап не входять: після скидання їх треба буде завантажити знову.</p>
          </div>
        </div>
      </div>`;

      try{ fillMemRow(host); }catch(_){}

      function toggle(sel){ const el=host.querySelector(sel); if(el) el.hidden=!el.hidden; }

      const syncBtn=host.querySelector('[data-acc-sync]');
      if(syncBtn) syncBtn.onclick=async (e)=>{
        e.stopPropagation();
        syncBtn.disabled=true; const old=syncBtn.textContent; syncBtn.textContent='…';
        try{ window.__flowSync.warmed=false; }catch(_){}
        // для Google-акаунта тягнемо все одним пакетним запитом, інакше load() нижче
        // знову піде по ключах окремо (десятки послідовних запитів замість одного)
        try{ if(typeof window.sbPrefetchAll==='function' && window.sbUser && window.sbUser()) await window.sbPrefetchAll(); }catch(_){}
        // мʼяке оновлення без reload
        try{ const ld=window.__load; if(typeof ld==='function') await ld(); }catch(_){}
        try{ const rd=window.__renderDashboard; if(typeof rd==='function') rd(); }catch(_){}
        try{ if(typeof renderMore==='function') renderMore(); }catch(_){}
        syncBtn.disabled=false; syncBtn.textContent=old||'↻';
        renderAccount();
      };

      const loginRow=host.querySelector('[data-acc-login-row]');
      // дані іншого акаунта (вікно закрили «Пізніше») — той самий рядок повертає вибір
      if(loginRow) loginRow.onclick=()=>{ if(window.__flowForeign && window.flowForeignAsk){ window.flowForeignAsk(); return; } if(!loggedIn) toggle('[data-acc-login-expand]'); };
      const outBtn=host.querySelector('[data-acc-out]');
      if(outBtn) outBtn.onclick=(e)=>{ e.stopPropagation(); if(window.sbSignOut) window.sbSignOut(); };
      const gb=host.querySelector('[data-acc-google]');
      if(gb) gb.onclick=async (e)=>{
        e.stopPropagation();
        if(gb.disabled) return;
        gb.disabled=true; const old=gb.textContent; gb.textContent='⏳ Відкриваємо…';
        try{ if(window.sbSignInGoogle) await window.sbSignInGoogle(); }
        finally{ setTimeout(()=>{ try{ gb.disabled=false; gb.textContent=old; }catch(_){} }, 8000); }
      };

      const bkRow=host.querySelector('[data-acc-backup-row]');   // onclick — біля лічильника фото нижче
      { const cr=host.querySelector('[data-acc-cur]'); if(cr) cr.onclick=()=>curPickSheet(()=>{ try{ renderAccount(); }catch(_){} }); }   // 08-finance.js
      { const fr=host.querySelector('[data-acc-finreset]'); if(fr) fr.onclick=()=>{   // 51-money-reset.js
        if(typeof finResetScan!=='function') return;
        if(!finResetReady()){ try{ plToast('Дані ще звіряються з хмарою — спробуй за хвилину'); }catch(_){} return; }
        const r=finResetScan(), parts=[r.ops+' операцій', r.envs+' конвертів і скарбничок'];
        if(r.recs) parts.push(r.recs+' регулярних платежів'); if(r.plans||r.goals) parts.push('План і цілі місяця'); if(r.curs) parts.push(r.curs+' інших валют');
        actionSheet({title:'Почати фінанси з нуля?', sub:'Зникне: '+parts.join(', ')+'. Місії, Журнал, папки, борги й години Роботи лишаються. Скасувати не можна — спершу збережи бекап. На інших пристроях спершу онови Frequency й нічого там не записуй, доки вони не підтягнуть зміни — інакше старі записи можуть повернутися.',
          items:[
            {ic:'down', label:'Спершу бекап у файл', sub:'збереже всі дані, потім натисни ще раз', onClick:()=>{ try{ Promise.resolve(exportRun(false)).catch(e=>{ console.error('export',e); try{ plToast('Бекап не вдався — не стирай, спробуй ще раз'); }catch(_){} }); }catch(e){ console.error('export',e); try{ plToast('Бекап не вдався — не стирай'); }catch(_){} } }},
            {ic:'trash', label:'Стерти гроші й почати з нуля', danger:true, onClick:()=>confirmSheet({title:'Точно стерти всі гроші?', sub:'Гаманець стане ₴0, конверти зникнуть. Це остаточно.', okLabel:'Стерти назавжди', onOk:()=>{
              Promise.resolve(finResetAll()).then(ok=>{ if(ok){ try{ plToast('🧹 Фінанси з нуля — додай стартовий залишок у Гаманці'); }catch(_){} try{ renderAccount(); }catch(_){} } }); }})}
          ]});
      }; }
      { const ow=host.querySelector('[data-acc-oldw]'); if(ow) ow.onclick=()=>{ try{ wgOldCleanup(); }catch(e){ console.error('wgOldCleanup',e); } }; }   // 48-widgets.js

      // ── скидання до заводських ──
      // Бекап перед стиранням не беремо на віру: якщо файл лише віддано браузеру
      // на завантаження (перевірити нема як), людина мусить сама підтвердити,
      // що бачить його, — інакше «єдина копія» могла б не існувати.
      // file — уже зібраний бекап із кроку 'tap' (див. askTap нижче)
      // btn — кнопка скидання: на ній чесний хід бекапу («Фото з хмари: 3 з 12…»)
      const runReset=async (wipeCloud, stopMsg, file, btn)=>{
        const old=btn&&btn.textContent;
        if(btn){ btn.disabled=true; btn.textContent='⏳ Готую бекап…'; }
        let r;
        try{ r=await window.flowFactoryReset({wipeCloud, file, onProgress:p=>{ if(btn) btn.textContent=progText(p); }}); }
        finally{ if(btn && !(r&&r.ok)){ btn.disabled=false; btn.textContent=old; } }
        if(r.ok) return;
        if(r.step==='tap'){ askTap(r, ()=>runReset(wipeCloud, stopMsg, r.file, btn)); return; }
        if(r.step!=='backup-confirm'){ flowAlert(stopMsg+r.error); return; }
        setTimeout(()=>{ confirmSheet({title:'Файл бекапу зберігся?',
          sub:'Браузер не каже, чи «'+r.name+'» справді записано. Перевір «Завантаження»: без цього файла стерте не повернути.',
          okLabel:'Файл є — продовжити', onOk:async ()=>{
            const r2=await window.flowFactoryReset({wipeCloud, backupConfirmed:true});
            if(!r2.ok) flowAlert(stopMsg+r2.error);
          }}); }, 350);
      };
      const rsRow=host.querySelector('[data-acc-reset-row]');
      if(rsRow) rsRow.onclick=()=>toggle('[data-acc-reset-expand]');
      const rsDev=host.querySelector('[data-acc-reset-device]');
      if(rsDev) rsDev.onclick=(e)=>{
        e.stopPropagation();
        const inAcc=!!(window.sbUser&&window.sbUser());
        confirmSheet({title:'Скинути цей пристрій?',
          sub:'Локальні дані буде стерто'+(inAcc?' — після перезапуску вони повернуться з хмари акаунта':'. Входу в акаунт немає, тож вони НЕ відновляться')+'. Спершу бекап збережеться у файл. Книжки з читалки в нього не входять — їх треба буде завантажити знову.',
          okLabel:'Скинути', onOk:()=>runReset(false, '❌ Скидання зупинено: ', null, rsDev)});
      };
      const rsAll=host.querySelector('[data-acc-reset-all]');
      if(rsAll) rsAll.onclick=(e)=>{
        e.stopPropagation();
        confirmSheet({title:'Стерти ВСЕ з акаунта?',
          sub:'Дані на цьому пристрої і в хмарі буде видалено. Інші пристрої після наступної синхронізації теж спорожніють.',
          okLabel:'Далі', onOk:()=>{
            /* друге, окреме підтвердження — пауза, щоб перший аркуш встиг закритись */
            setTimeout(()=>{ confirmSheet({title:'Точно стерти все?',
              sub:'Це незворотно. Єдина копія лишиться у файлі бекапу, який зараз збережеться, — разом з усіма фото, і тими, що є лише в хмарі (їх спершу докачаємо). Якщо хоч одне фото взяти не вдасться, нічого не стираємо. Книжок з читалки у файлі не буде — їх доведеться завантажити знову.',
              okLabel:'Стерти назавжди', onOk:()=>runReset(true, '❌ Стирання зупинено: ', null, rsAll)}); }, 350);
          }});
      };
      const mb=n=>n>=1048576?(n/1048576).toFixed(1)+' МБ':Math.max(1,Math.round(n/1024))+' КБ';
      // хід збирання бекапу для напису на кнопці: скільки фото вже докачано з хмари
      const progText=p=>(p&&p.stage==='photos')?('⏳ Фото з хмари: '+p.done+' з '+p.total+'…'):'⏳ Пакую фото…';
      /* Бекап зібрано, але дозвіл від натискання минув, поки звіряли хмару й пакували
         фото: аркуш «Поділитися» (iPhone) чи «Зберегти як…» (Mac) відкриються лише з
         нового дотику. Тому окрема кнопка — її onClick одразу віддає готовий файл. */
      const askTap=(r, onTap)=>setTimeout(()=>actionSheet({ title:'Бекап готовий',
        sub:'Файл «'+r.name+'»'+(r.photos?' (разом із '+r.photos+' фото, '+mb(r.bytes||0)+')':'')+' зібрано. Натисни «Зберегти файл» і вибери, куди його покласти.',
        items:[{ ic:'down', label:'Зберегти файл', primary:true, onClick:onTap }], cancel:'Скасувати' }), 350);
      const exportRun=async (photos, onProgress)=>{
        const r=await window.flowBackup.exportToFile(photos?{photos:true, onProgress}:null);
        if(r.step==='tap'){ askTap(r, async ()=>exportTell(await window.flowBackup.saveFile(r.file))); return; }
        exportTell(r);
      };
      const exportTell=(r)=>{
        const what=r.photos?' (разом із '+r.photos+' фото'+(r.photosFromCloud?', з них '+r.photosFromCloud+' докачано з хмари':'')+', '+mb(r.bytes||0)+')':'';
        // фото, яких у файлі нема, — кажемо прямо, а не мовчки віддаємо неповний бекап
        const gap=r.photosUnchecked ? '\n\n⚠️ Не вдалося перевірити, які фото лежать у хмарі (нема звʼязку?) — у файлі лише фото з цього пристрою.'
          : (r.photosMissing ? '\n\n⚠️ '+r.photosMissing+' фото з хмари докачати не вдалося — їх у файлі нема. Спробуй ще раз, коли звʼязок буде кращим.' : '');
        // «✅ Збережено» — лише коли файл точно записано; інакше кажемо як є
        if(r.ok && r.saved) flowAlert('✅ Збережено: '+r.name+what+gap+'\n\nПоклади файл у надійне місце (хмара, пошта собі).');
        else if(r.ok) flowAlert('⬇️ Файл «'+r.name+'»'+what+' передано на завантаження.'+gap+'\n\nПеревір, що він з\'явився в «Завантаженнях», — застосунок цього не бачить. Потім поклади його в надійне місце.');
        else if(r.cancelled) flowAlert('Збереження скасовано — файл бекапу не записано.');
        else flowAlert('❌ Не вдалося експортувати: '+(r.error||'невідома помилка'));
      };
      const exb=host.querySelector('[data-acc-export]');
      if(exb) exb.onclick=(e)=>{ e.stopPropagation(); exportRun(false); };
      const exph=host.querySelector('[data-acc-export-ph]');
      if(exph) exph.onclick=async (e)=>{
        e.stopPropagation();
        if(exph.disabled) return;
        exph.disabled=true; const old=exph.textContent; exph.textContent='⏳ Готую бекап…';
        try{ await exportRun(true, p=>{ exph.textContent=progText(p); }); }finally{ exph.disabled=false; exph.textContent=old; }
      };
      // лічильник фото: скільки їх на пристрої, скільки важать і скільки ще лише в хмарі.
      // Рахуємо, лише коли розділ «Бекап» відкрито: renderAccount кличуть після кожної
      // звірки з хмарою, а тут читання всіх фото й запит до хмари
      const phCnt=host.querySelector('[data-acc-ph-count]');
      const bkEx=host.querySelector('[data-acc-backup-expand]');
      if(bkRow) bkRow.onclick=()=>{ toggle('[data-acc-backup-expand]'); if(bkEx && !bkEx.hidden) fillPhCnt(); };
      const fillPhCnt=()=>{ if(phCnt && window.flowBackup.photoStats) window.flowBackup.photoStats().then(ps=>{
        const cloud = ps.cloudOnly===null ? ' · що лежить у хмарі — перевірити не вдалось (нема звʼязку?)'
          : (ps.cloudOnly ? ' · ще '+ps.cloudOnly+' лише в хмарі — повний бекап їх докачає' : '');
        phCnt.textContent = (ps.count || ps.cloudOnly!==0) ? ('Фото на пристрої: '+ps.count+(ps.count?' · ≈ '+mb(ps.bytes):'')+cloud)
          : 'Фото поки немає — повний бекап буде таким самим, як звичайний.';
      }).catch(()=>{ phCnt.textContent=''; }); };
      const imb=host.querySelector('[data-acc-import]');
      const fileInput=host.querySelector('[data-acc-file]');
      if(imb && fileInput){
        imb.onclick=(e)=>{ e.stopPropagation(); fileInput.click(); };
        fileInput.onchange=async ()=>{
          const f=fileInput.files&&fileInput.files[0]; if(!f) return;
          fileInput.value='';
          // 1) спершу перевірка й підсумок — нічого не записано
          const ins=await window.flowBackup.inspectFile(f);
          if(!ins.ok){ flowAlert('❌ Цей файл не відновити: '+(ins.error||'невідома помилка')+'\n\nПоточні дані не змінено.'); return; }
          const inCloud=!!(window.sbUser&&window.sbUser());
          const when=ins.summary.exportedAt?('Бекап від '+new Date(ins.summary.exportedAt).toLocaleString()+'.\n'):'';
          const cloudWarn=inCloud
            ? '\n\n⚠️ Ти увійшов у Google: відновлене одразу піде в хмару і ПЕРЕЗАПИШЕ те, що там зараз. Інші пристрої отримають його при наступній синхронізації.'
            : '';
          // 2) людина бачить, що відновиться, і лише тоді підтверджує
          confirmSheet({title:'Відновити з «'+f.name+'»?', ic:'refresh',
            sub:when+ins.summary.text+'\n\nПоточні дані буде замінено. Авто-копія попереднього стану збережеться на випадок відкату.'+cloudWarn,
            okLabel:inCloud?'Відновити і перезаписати хмару':'Відновити', onOk:async ()=>{
              const r=await window.flowBackup.applyInspected(ins);
              if(!r.ok){ flowAlert('❌ Імпорт не вдався: '+(r.error||'невідома помилка')); return; }
              let msg='✅ Відновлено '+r.restored+' розділів даних'+(r.photos?' і '+r.photos+' фото':'')+'.';
              if(r.cloud) msg += (r.pending||r.phFail)
                ? '\n\n☁️ Частина ще не дійшла до хмари (нема зв\'язку?) — застосунок дошле сам, щойно зв\'язок з\'явиться.'
                : '\n\n☁️ Хмару оновлено — інші пристрої підхоплять відновлене при синхронізації.';
              msg += '\n\nЗастосунок зараз перезапуститься.';
              flowAlert(msg);
              // повний перезапуск: частину налаштувань модулі читають лише на старті
              setTimeout(()=>{ try{ location.reload(); }catch(_){} }, 1800);
            }});
        };
      }

      const elRow=host.querySelector('[data-acc-errlog-row]');
      if(elRow) elRow.onclick=()=>toggle('[data-acc-errlog-expand]');
      const elShare=host.querySelector('[data-acc-errlog-share]');
      // спершу системне «Поділитися» (телефон), інакше — буфер обміну (Mac),
      // а якщо й він закритий — кладемо текст у поле й виділяємо: скопіювати руками
      if(elShare) elShare.onclick=async (e)=>{
        e.stopPropagation();
        const txt=window.flowErrLog?window.flowErrLog.text():'Журнал недоступний';
        if(navigator.share){
          try{ await navigator.share({title:'Frequency — журнал помилок', text:txt}); return; }
          catch(err){ if(err&&err.name==='AbortError') return; }
        }
        try{ await navigator.clipboard.writeText(txt); flowAlert('📋 Журнал скопійовано — встав його в повідомлення.'); return; }catch(_){}
        const box=host.querySelector('.acc-errlog'); if(!box) return;
        const ta=document.createElement('textarea'); ta.readOnly=true; ta.className='acc-errlog-ta'; ta.value=txt;
        box.replaceChildren(ta); try{ ta.focus(); ta.select(); }catch(_){}
        const hint=host.querySelector('[data-acc-errlog-expand] .acc-hint');
        if(hint) hint.textContent='Автоматично скопіювати не вийшло — текст виділено вище, скопіюй його вручну.';
      };

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

    /* ── На пристрої дані іншого акаунта (sbSetUser у 02-storage.js) ──
       Хмару вже вимкнено — тут лише вибір людини. «Злити разом» навмисно нема.
       Стирання — те саме скидання пристрою: спершу бекап у файл (лише локальне:
       сесія для сховища вимкнена, хмару нового акаунта бекап не бачить), сесію
       лишає, тож після перезапуску тут уже дані того, хто увійшов. */
    const maskMail=m=>{ const s=String(m||''); const i=s.indexOf('@'); return i>0 ? s.charAt(0)+'•••'+s.slice(i) : (s||'іншому акаунту'); };
    const foreignWipe=async (file)=>{
      const stop='❌ Нічого не стерто: ';
      let r; try{ r=await window.flowFactoryReset({wipeCloud:false, file}); }catch(e){ r={ok:false, error:String((e&&e.message)||e)}; }
      if(r.ok) return;
      if(r.step==='tap'){ setTimeout(()=>actionSheet({ title:'Бекап готовий',
        sub:'Файл «'+r.name+'» зібрано. Натисни «Зберегти файл» і вибери, куди його покласти.',
        items:[{ ic:'down', label:'Зберегти файл', primary:true, onClick:()=>foreignWipe(r.file) }], cancel:'Скасувати' }), 350); return; }
      if(r.step!=='backup-confirm'){ flowAlert(stop+r.error); return; }
      setTimeout(()=>confirmSheet({ title:'Файл бекапу зберігся?',
        sub:'Браузер не каже, чи «'+r.name+'» справді записано. Перевір «Завантаження»: без цього файла стерте не повернути.',
        okLabel:'Файл є — стерти', onOk:async ()=>{
          const r2=await window.flowFactoryReset({wipeCloud:false, backupConfirmed:true});
          if(!r2.ok) flowAlert(stop+r2.error);
        }}), 350);
    };
    const foreignAsk=()=>{
      const f=window.__flowForeign; if(!f) return;
      actionSheet({ title:'На пристрої дані іншого акаунта',
        sub:'Вхід — '+(f.as||'новий акаунт')+', а дані тут належать '+maskMail(f.owner)+'. Щоб не змішати їх, синхронізацію вимкнено. '+
            'Збережи їх у файл і зітри з пристрою — після перезапуску тут будуть лише твої дані. Або вийди, і все лишиться як було.',
        items:[
          { ic:'down', label:'Зберегти у файл і стерти з пристрою', sub:'Хмари жодного з акаунтів це не торкнеться', primary:true, onClick:()=>foreignWipe(null) },
          { ic:'refresh', label:'Вийти з акаунта', sub:'Дані на пристрої лишаться як були', onClick:()=>{ if(window.sbSignOut) window.sbSignOut(); } }
        ], cancel:'Пізніше' });
    };
    window.flowForeignAsk=foreignAsk;
    document.addEventListener('flowforeign', ()=>setTimeout(foreignAsk, 600));
    if(window.__flowForeign) setTimeout(foreignAsk, 600);

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
    const nm=document.getElementById('navMore'); if(nm) nm.onclick=goMore;
    try{ flowCapRender(); visInterval(flowCapRender,60000,{now:true}); }catch(_){}
    try{ prefCatchup('pet_pos',()=>flowCapRender()); prefCatchup('pet_sleep',()=>flowCapRender()); }catch(_){}
    document.querySelectorAll('.dsb-i[data-dnav="more"]').forEach(b=>b.onclick=goMore);
    renderMore();
    renderAccount();
  })();
