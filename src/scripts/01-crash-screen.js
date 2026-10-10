
/* аварійний екран: показує помилку замість білого екрана.
   Тут же версія збірки і журнал помилок: це найперший <script> сторінки,
   тож він ловить і те, що падає ще під час старту ядра. */
(function(){
  // Версію вшиває tools/build.py: дата-час збірки + короткий git-хеш.
  // Раніше дашборд друкував у консоль вигадану «2026-07-29-folders-v2.4»,
  // яка не мінялась місяцями, — з телефона не було як дізнатись, що там стоїть.
  var BUILD='@@BUILD@@';
  try{ window.FLOW_BUILD=BUILD; console.info('[Frequency] версія', BUILD); }catch(_){}

  /* ── Журнал помилок: останні 50, переживає перезапуск ──
     Ключ навмисно БЕЗ префікса flowapp_: у хмару Supabase і в нативне
     сховище йде лише те, що пишеться через window.storage (flowapp_…), а
     бекап (flowBackup.collect у 02-storage.js) теж бере лише flowapp_….
     Тож журнал лишається на цьому пристрої: не синхронізується, не їде
     в файл бекапу. «Скинути пристрій» чистить його разом з усім іншим. */
  var KEY='flow_errlog', MAX=50;
  function read(){
    try{ var a=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(a)?a:[]; }catch(_){ return []; }
  }
  function add(kind,msg,src,line){
    try{
      var a=read(), m=String(msg==null?'':msg).slice(0,300), last=a[a.length-1], now=Date.now();
      // та сама помилка в циклі (напр. на кожному кадрі) — не витісняє решту, а лічиться
      if(last && last.msg===m && last.kind===kind && now-last.t<5000){ last.n=(last.n||1)+1; last.t=now; }
      else a.push({ t:now, v:BUILD, kind:kind, msg:m, src:src?String(src).split('/').pop().slice(-60):'', line:line||0 });
      if(a.length>MAX) a=a.slice(-MAX);
      localStorage.setItem(KEY, JSON.stringify(a));
    }catch(_){}   // повна памʼять не має ламати сам ловець помилок
  }
  function pad(n){ return (n<10?'0':'')+n; }
  function when(t){ var d=new Date(t); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds()); }
  // текст для «Скопіювати / поділитися»: одразу з версією і пристроєм
  function text(){
    var a=read(), out=['Frequency — журнал помилок','Версія: '+BUILD,'Пристрій: '+(navigator.userAgent||'?'),'Записів: '+a.length,''];
    for(var i=a.length-1;i>=0;i--){ var e=a[i];
      out.push(when(e.t)+' · '+e.kind+(e.n>1?' ×'+e.n:'')+(e.v&&e.v!==BUILD?' · версія '+e.v:'')
        +'\n  '+e.msg+(e.src||e.line?'\n  @ '+(e.src||'?')+':'+(e.line||0):''));
    }
    return out.join('\n');
  }
  window.flowErrLog={ list:read, text:text, when:when };

  /* ── банер: один на всі помилки, з версією і кнопкою «Закрити» ──
     Раніше кожна помилка додавала ще один банер поверх попереднього, а
     закрити їх було нічим — стос червоних плашок накривав верх екрана. */
  var box=null, body=null, cnt=0;
  function show(msg){
    try{
      if(!box || !box.isConnected){
        cnt=0;
        box=document.createElement('div'); box.id='flowCrash'; box.setAttribute('role','alert');
        box.style.cssText='position:fixed;left:8px;right:8px;top:calc(8px + env(safe-area-inset-top,0px));z-index:999999;background:#2a1215;color:#ffb4b4;border:1px solid #7a2e35;border-radius:12px;padding:10px 12px;font:12px/1.5 -apple-system,Menlo,monospace;';
        var head=document.createElement('div');
        head.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:4px;';
        var ttl=document.createElement('div'); ttl.style.cssText='flex:1;min-width:0;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
        // версія — окремим рядком під заголовком: поруч із кнопкою на 375 px вона обрізалась
        ttl.innerHTML='⚠️ Помилка<div style="font-weight:400;opacity:.8;font-size:11px"></div>';
        ttl.lastChild.textContent='версія '+BUILD;
        var x=document.createElement('button'); x.type='button'; x.textContent='Закрити';
        x.style.cssText='flex-shrink:0;min-height:32px;padding:6px 12px;border-radius:9px;border:1px solid #7a2e35;background:#3a1a1e;color:#ffd6d6;font:600 12px -apple-system,sans-serif;cursor:pointer;';
        x.onclick=function(){ try{ box.remove(); }catch(_){} box=null; };
        body=document.createElement('div');
        body.style.cssText='white-space:pre-wrap;word-break:break-word;max-height:40vh;overflow:auto;';
        head.appendChild(ttl); head.appendChild(x); box.appendChild(head); box.appendChild(body);
        (document.body||document.documentElement).appendChild(box);
      }
      cnt++;
      body.textContent=msg+(cnt>1?'\n(помилок поспіль: '+cnt+')':'')+'\nУсі — в «Ще → Журнал помилок».';
    }catch(_){}
  }

  /* ── червоний банер — лише власнику в dev-режимі, людині — тихий тост ──
     Банер з англійським текстом рушія лякав і виглядав як «застосунок зламався»
     (App Store, 2.1). Запис у журнал (add) від цього не залежить. */
  function devOn(){
    try{ if(localStorage.getItem('flow_dev')==='1') return true; }catch(_){}
    // ворота власника з 30-upgrade.js. Поки ядро не завантажилось або хеш акаунта
    // ще рахується, upDevOn нема чи каже «ні» — тоді тихий варіант
    try{ return !!(window.upDevOn&&window.upDevOn()); }catch(_){ return false; }
  }
  var QUIET='Щось пішло не так — ми записали це в журнал помилок', quietAt=0, qel=null;
  function quiet(){
    var now=Date.now();
    if(now-quietAt<6000) return;   // помилка в циклі — тост раз на 6 с, а не «прилиплий»
    quietAt=now;
    try{ if(typeof window.__flowToast==='function'){ window.__flowToast(QUIET); return; } }catch(_){}
    // на старті тосту застосунку ще нема — свій, такий самий тихий
    try{
      if(!qel || !qel.isConnected){
        qel=document.createElement('div'); qel.id='flowErrToast'; qel.setAttribute('role','status');
        qel.style.cssText='position:fixed;left:50%;bottom:calc(90px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:999999;max-width:88vw;padding:11px 16px;border-radius:12px;background:#1d2029;color:#e8eaf1;border:1px solid rgba(255,255,255,.14);font:600 12.5px/1.4 -apple-system,sans-serif;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.45);pointer-events:none;transition:opacity .3s;';
        (document.body||document.documentElement).appendChild(qel);
      }
      qel.textContent=QUIET; qel.style.opacity='1';
      clearTimeout(qel._t); qel._t=setTimeout(function(){ try{ qel.style.opacity='0'; }catch(_){} },3000);
    }catch(_){}
  }
  function report(msg){ if(devOn()) show(msg); else quiet(); }

  window.addEventListener('error',function(e){
    add('error', e.message||'Script error', e.filename, e.lineno);
    report((e.message||'Script error')+(e.lineno?('\nрядок '+e.lineno+(e.colno?':'+e.colno:'')):''));
  });
  window.addEventListener('unhandledrejection',function(e){
    var r=e&&e.reason, m=(r&&(r.message||r))||'невідома помилка';
    add('promise', m);
    report('Promise: '+m);
  });
})();
