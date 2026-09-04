  /* ════════ ГЛОБАЛЬНИЙ ПОШУК (⌘K): папки · блоки · щоденник · транзакції ════════
     Джерела підключені містками: flowSearchBoards/flowOpenBlock (23-board),
     flowSearchDiary + goDiary(дата) (22-diary), flowSearchFin (08-finance).
     UI перевикористовує стилі .srch-* дошкового пошуку. */
  (function(){
    const LIM=8; // результатів на групу
    function gsEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    function gsRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
    function gsMark(text,q){
      const safe=gsEsc(text); if(!q) return safe;
      try{ return safe.replace(new RegExp('('+gsRe(gsEsc(q))+')','ig'),'<mark>$1</mark>'); }catch(_){ return safe; }
    }
    function gsSnip(text,q){
      let s=String(text||''); const i=s.toLowerCase().indexOf(q.toLowerCase());
      if(i>40) s='…'+s.slice(i-30);
      if(s.length>140) s=s.slice(0,140)+'…';
      return s;
    }

    let ov=null;
    function ensureOv(){
      if(ov) return ov;
      ov=document.createElement('div');
      ov.id='gsOv'; ov.className='srch-ov';
      ov.innerHTML=`<div class="srch-box">
        <div class="srch-head">
          <input id="gsInput" class="srch-input" type="text" placeholder="Шукати скрізь: блоки, щоденник, гроші…" autocomplete="off">
          <button id="gsClose" class="srch-x" type="button">✕</button>
        </div>
        <div id="gsRes" class="srch-res"></div>
      </div>`;
      document.body.appendChild(ov);
      const inp=ov.querySelector('#gsInput');
      inp.addEventListener('input',()=>render(inp.value));
      ov.querySelector('#gsClose').onclick=close;
      ov.addEventListener('click',e=>{ if(e.target===ov) close(); });
      ov.addEventListener('click',e=>{
        const hit=e.target.closest&&e.target.closest('[data-gs]');
        if(!hit) return;
        e.preventDefault();
        const act=hit.dataset.gs, a=hit.dataset.a, b=hit.dataset.b;
        close();
        try{
          if(act==='folder')     goFolder(a);
          else if(act==='block') window.flowOpenBlock(a,b);
          else if(act==='diary') window.goDiary(a);
          else if(act==='fin')   goFinance();
          else if(act==='cmd'){
            if(a==='capture'&&window.flowQuickCapture) window.flowQuickCapture();
            else if(a==='spend') goSpend();
            else if(a==='diary') window.goDiary();
          }
        }catch(err){ console.error('gsOpen',err); }
      });
      return ov;
    }

    function hitHTML(gs,a,b,emoji,color,title,sub,path){
      return `<button class="srch-hit" data-gs="${gs}" data-a="${gsEsc(a)}" data-b="${gsEsc(b||'')}" style="--shc:${color}">
        <span class="sh-ic">${emoji}</span>
        <span class="sh-body">
          <span class="sh-t">${title}</span>
          ${sub?`<span class="sh-s">${sub}</span>`:''}
          ${path?`<span class="sh-path">📍 ${gsEsc(path)}</span>`:''}
        </span></button>`;
    }

    function render(q){
      const res=document.getElementById('gsRes'); if(!res) return;
      q=(q||'').trim();
      if(!q){
        res.innerHTML=`<div class="gs-lbl">Швидкі дії</div>`
          + hitHTML('cmd','capture','', '⚡','#e8843c','Швидкий запис','Витрата, нотатка чи задача')
          + hitHTML('cmd','spend','',   '💸','#ff6b9d','Додати витрату','')
          + hitHTML('cmd','diary','',   '📓','#34c77b','Запис у щоденник','')
          + `<div class="srch-empty">Почни вводити — знайду по всіх папках,<br>щоденнику і транзакціях.</div>`;
        return;
      }
      const ql=q.toLowerCase();
      let html='';

      // 1) папки за назвою
      try{
        const fl=(window.__flowPageBridge&&window.__flowPageBridge.folderList&&window.__flowPageBridge.folderList())||[];
        const hits=fl.filter(f=>String(f.name||'').toLowerCase().includes(ql)).slice(0,LIM);
        if(hits.length) html+=`<div class="gs-lbl">Папки</div>`+hits.map(f=>
          hitHTML('folder',f.key,'',f.emoji||'📁','#6a7dff',gsMark(f.name,q),'')).join('');
      }catch(_){}

      // 2) блоки всіх дошок
      try{
        const hits=(window.flowSearchBoards?window.flowSearchBoards():[])
          .filter(x=>(x.title+' '+x.text).toLowerCase().includes(ql)).slice(0,LIM);
        if(hits.length) html+=`<div class="gs-lbl">Блоки</div>`+hits.map(x=>{
          const snip=gsSnip(x.text,q);
          return hitHTML('block',x.bk,x.id,x.emoji,'#8b7cff',
            gsMark(x.title||snip.slice(0,40)||'Блок',q),
            (snip&&snip!==x.title)?gsMark(snip,q):'', x.folder);
        }).join('');
      }catch(_){}

      // 3) щоденник
      try{
        const hits=(window.flowSearchDiary?window.flowSearchDiary():[])
          .filter(x=>String(x.text).toLowerCase().includes(ql)).slice(0,LIM);
        if(hits.length) html+=`<div class="gs-lbl">Щоденник</div>`+hits.map(x=>
          hitHTML('diary',x.date,'','📓','#34c77b',
            gsEsc(x.date||x.book),gsMark(gsSnip(x.text,q),q))).join('');
      }catch(_){}

      // 4) транзакції
      try{
        const hits=(window.flowSearchFin?window.flowSearchFin():[])
          .filter(x=>String(x.label).toLowerCase().includes(ql)).slice(0,LIM);
        if(hits.length) html+=`<div class="gs-lbl">Гроші</div>`+hits.map(x=>
          hitHTML('fin',x.id,'',x.type==='in'?'📈':'📉','#f0b429',
            gsMark(x.label||'Операція',q),
            gsEsc((x.type==='in'?'+':'−')+x.amount+' · '+x.date))).join('');
      }catch(_){}

      res.innerHTML=html||`<div class="srch-empty">Нічого не знайдено за «${gsEsc(q)}».</div>`;
    }

    function open(){
      const o=ensureOv(); o.classList.add('show');
      const inp=o.querySelector('#gsInput'); inp.value=''; render('');
      // фокус синхронно в момент тапу — інакше iOS не покаже клавіатуру
      try{ inp.focus(); inp.click&&inp.click(); }catch(_){}
      requestAnimationFrame(()=>{ try{ inp.focus(); }catch(_){} });
    }
    function close(){ if(ov) ov.classList.remove('show'); try{ document.activeElement&&document.activeElement.blur(); }catch(_){} }
    window.flowGlobalSearch=open;

    // ⌘K / Ctrl+K — відкрити/закрити; Esc — закрити
    document.addEventListener('keydown',e=>{
      if((e.metaKey||e.ctrlKey)&&(e.key==='k'||e.key==='K'||e.code==='KeyK')){
        e.preventDefault();
        (ov&&ov.classList.contains('show'))?close():open();
      } else if(e.key==='Escape'&&ov&&ov.classList.contains('show')){ close(); }
    });
    // лупа в шапці Огляду (мобільний шлях)
    const hb=document.getElementById('homeSearchBtn'); if(hb) hb.onclick=open;
  })();
