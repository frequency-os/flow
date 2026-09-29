
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
  window.addEventListener('error',function(e){
    add('error', e.message||'Script error', e.filename, e.lineno);
    show((e.message||'Script error')+(e.lineno?('\nрядок '+e.lineno+(e.colno?':'+e.colno:'')):''));
  });
  window.addEventListener('unhandledrejection',function(e){
    var r=e&&e.reason, m=(r&&(r.message||r))||'невідома помилка';
    add('promise', m);
    show('Promise: '+m);
  });
})();
