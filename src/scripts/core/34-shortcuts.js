  /* ════════ КЛАВІАТУРНІ СКОРОЧЕННЯ (аудит Ф3) ════════
     1–6 — розділи, N — швидкий запис, ? — шпаргалка, ⌘K живе в 32-global-search.
     Голі цифри замість ⌘1–6: ті в браузері зайняті перемиканням вкладок.
     Не спрацьовують, коли фокус у полі вводу або затиснуті модифікатори. */
  (function(){
    const MAP={
      '1':['Огляд',      ()=>goHome()],
      '2':['Планер',     ()=>goPlanner()],
      '3':['Флоу (чат)', ()=>aiChatSheet()],
      '4':['Гроші',      ()=>goFinance()],
      '5':['Проєкти',    ()=>goProjects()],
      '6':['Ще',         ()=>goMore()],
    };
    function typing(){
      const el=document.activeElement;
      return !!(el && (el.tagName==='INPUT'||el.tagName==='TEXTAREA'||el.tagName==='SELECT'||el.isContentEditable));
    }

    let ks=null;
    function sheetHTML(){
      const rows=[
        ['⌘K / Ctrl+K','Глобальний пошук'],
        ...Object.keys(MAP).map(k=>[k,MAP[k][0]]),
        ['N','Швидкий запис'],
        ['Esc','Закрити пошук чи цю шпаргалку'],
        ['?','Ця шпаргалка'],
      ];
      return `<div class="ks-in"><div class="ks-h">Клавіатурні скорочення</div>`
        + rows.map(r=>`<div class="ks-row"><kbd>${r[0]}</kbd><span>${r[1]}</span></div>`).join('')
        + `</div>`;
    }
    function sheetToggle(){
      if(ks && ks.classList.contains('show')){ ks.classList.remove('show'); return; }
      if(!ks){
        ks=document.createElement('div'); ks.id='ksOv'; ks.className='ks-ov';
        ks.addEventListener('click',e=>{ if(e.target===ks) ks.classList.remove('show'); });
        document.body.appendChild(ks);
      }
      ks.innerHTML=sheetHTML(); ks.classList.add('show');
    }

    document.addEventListener('keydown',e=>{
      if(e.metaKey||e.ctrlKey||e.altKey) return;
      if(e.key==='Escape'){ if(ks&&ks.classList.contains('show')) ks.classList.remove('show'); return; }
      if(typing()) return;
      if(e.key==='?' || (e.shiftKey&&(e.key==='/'||e.code==='Slash'))){ e.preventDefault(); sheetToggle(); return; }
      const nav=MAP[e.key];
      if(nav){ e.preventDefault(); try{ nav[1](); }catch(err){ console.error('shortcut',e.key,err); } return; }
      if(e.key==='n'||e.key==='N'){
        e.preventDefault();
        try{ if(window.flowQuickCapture) window.flowQuickCapture(); }catch(err){ console.error('shortcut N',err); }
      }
    });
  })();
