  function pickPhoto(targetArr){
    const dest = Array.isArray(targetArr) ? targetArr : currentLevelArr();
    const inp=document.createElement('input');
    inp.type='file'; inp.accept='image/*';
    inp.onchange=()=>{
      const f=inp.files&&inp.files[0]; if(!f) return;
      const reader=new FileReader();
      reader.onload=()=>{
        const img=new Image();
        img.onload=()=>{
          const max=900; let{width:w,height:h}=img;
          if(w>max||h>max){ const r=Math.min(max/w,max/h); w=Math.round(w*r); h=Math.round(h*r); }
          const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
          cv.getContext('2d').drawImage(img,0,0,w,h);
          const data=cv.toDataURL('image/jpeg',0.72);
          const blk={ id:Date.now()+Math.random(), type:'photo', title:'Фото', data };
          dest.push(blk); syncBlocks();
          saveBoard(); renderBoard();
          requestAnimationFrame(()=>{ const el=document.querySelector('[data-tileid="'+blk.id+'"]'); if(el) el.scrollIntoView({behavior:'smooth',block:'center'}); });
        };
        img.src=reader.result;
      };
      reader.readAsDataURL(f);
    };
    inp.click();
  }
  // рекурсивний пошук блока (враховує вкладені у папки)
  function isContainer(b){ return b && (b.type==='group'||b.type==='page'); }
  function findBlockDeep(arr,id){
    for(const b of arr){
      if(String(b.id)===String(id)) return b;
      if(isContainer(b)&&Array.isArray(b.children)){
        const f=findBlockDeep(b.children,id); if(f) return f;
      }
    }
    return null;
  }
  // знайти масив-контейнер, у якому лежить блок (для переміщення/видалення)
  function findParentArr(arr,id){
    for(const b of arr){
      if(String(b.id)===String(id)) return arr;
      if(isContainer(b)&&Array.isArray(b.children)){
        const f=findParentArr(b.children,id); if(f) return f;
      }
    }
    return null;
  }
  function delBlock(id){
    const arr=findParentArr(curBoard(),id);
    if(arr){ const i=arr.findIndex(b=>String(b.id)===String(id));
      if(i>=0){
        const b=arr[i];
        try{ snapshotForUndo('Блок «'+((b&&b.title)||(BLOCK_TYPES[b&&b.type]&&BLOCK_TYPES[b.type].title)||'блок')+'» видалено'); }catch(_){}
        if(b && b.type==='book' && b.bookId){ try{ BookDB.del(b.bookId); }catch(_){} }
        arr.splice(i,1);
      }
    }
    syncBlocks(); saveBoard(); renderBoard();
  }
  function getBlock(id){ return findBlockDeep(curBoard(),id); }

  function renderBoardTabs(){
    const t=document.getElementById('boardTabs');
    t.innerHTML=allTabs().map(tb=>{
      const n=(boards[tb.key]||[]).length;
      return `<button class="${tb.key===boardKey?'on':''}" style="--tbc:${tb.color}" data-board="${tb.key}">
        ${tb.emoji} ${esc(tb.label)}${n?` <span class="cnt">${n}</span>`:''}</button>`;
    }).join('');
    t.querySelectorAll('[data-board]').forEach(el=>el.onclick=()=>{
      boardKey=el.dataset.board; syncBlocks(); renderBoard();
    });
  }

  // ── дашборд простору ──
  var SD_GRADS=[
    'radial-gradient(120% 100% at 15% 0%,#41508f 0%,transparent 55%),radial-gradient(110% 90% at 85% 15%,#7b4a9e 0%,transparent 50%),radial-gradient(130% 120% at 60% 100%,#173a5e 0%,#0f1115 78%)',
    'linear-gradient(135deg,#0f2b1e,#1f6f4a 60%,#4ee69a)',
    'linear-gradient(135deg,#3a1f14,#a4502a 55%,#ffb37c)',
    'linear-gradient(135deg,#141a33,#31418f 55%,#7c8cff)'
  ];
  function sdCovers(){ try{ return JSON.parse(localStorage.getItem('flowPgCovers')||'{}')||{}; }catch(_){ return {}; } }
  function sdSaveCovers(c){
    try{ localStorage.setItem('flowPgCovers',JSON.stringify(c)); }catch(_){}
    try{ const p=window.storage&&window.storage.set&&window.storage.set('flowPgCovers',JSON.stringify(c),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
  }
  function sdDashOpen(){ try{ return localStorage.getItem('flowSpaceDash')!=='0'; }catch(_){ return true; } }
  function sdStats(arr){
    let tot=0,tDone=0,tAll=0,pgs=0,prSum=0,prN=0,cdTarget=null;
    const now=Date.now();
    (function walk(a){ a.forEach(b=>{ if(!b)return; tot++;
      if(b.type==='task'){ tAll++; if(b.done)tDone++; }
      if(b.type==='check'&&Array.isArray(b.items)) b.items.forEach(it=>{ if(it&&(it.text||'').trim()){ tAll++; if(it.done)tDone++; } });
      if(b.type==='progress'&&typeof b.value==='number'){ prSum+=b.value; prN++; }
      if(b.type==='countdown'&&b.target){
        const t=new Date(b.target+'T23:59:59').getTime();
        if(!isNaN(t)&&t>now&&(cdTarget==null||t<cdTarget)) cdTarget=t;
      }
      if(b.type==='page'||b.type==='group') pgs++;
      if(isContainer(b)&&Array.isArray(b.children)) walk(b.children);
    }); })(arr);
    const prog = prN? Math.round(prSum/prN) : (tAll? Math.round(tDone/tAll*100) : null);
    const cdDays = cdTarget!=null ? Math.max(0,Math.ceil((cdTarget-now)/864e5)) : null;
    return {tot,tDone,tAll,pgs,prog,cdDays};
  }
  function spaceDashHTML(levelArr){
    let sp=null;
    try{ const ctx=curCtx(); sp=spaceByIdIn(ctx,activeSpaceFor(ctx)); }catch(_){}
    const name=sp?sp.name:'Простір', emoji=sp?sp.emoji:'🧩';
    const cov=sdCovers()[boardKey];
    const st=sdStats(levelArr);
    const open=sdDashOpen();
    let bg;
    if(cov&&cov.img) bg='background-image:url('+cov.img+')';
    else bg='background:'+SD_GRADS[(cov&&cov.g)||0];
    const sw=SD_GRADS.map((g,i)=>'<button class="sw" data-sdgrad="'+i+'" style="background:'+g+'"></button>').join('');
    const pages=levelArr.filter(b=>b&&(b.type==='page'||b.type==='group'));
    const pagesHtml=pages.length?'<div class="sdash-pages">'+pages.map(p=>{
      const kids=(p.children||[]).length;
      const e=p.emoji||(p.type==='page'?'📄':'📁');
      return '<div class="sdash-pg" data-sdopen="'+p.id+'"><span class="e">'+e+'</span><div class="t">'+esc(p.title||(p.type==='page'?'Сторінка':'Папка'))+'</div><div class="n">'+(p.type==='page'?'сторінка':'папка')+(kids?' · '+kids:'')+'</div></div>';
    }).join('')+'</div>':'';
    return '<div class="sdash'+(open?'':' closed')+'">'
      +'<button class="sdash-toggle" data-sdtoggle><i>▾</i> Дашборд</button>'
      +'<div class="sdash-body">'
      +'<div class="sdash-hero" data-sdcov><div class="bgc" style="'+bg+'"></div>'
      +'<div class="in"><span class="sdash-emo">'+emoji+'</span>'
      +'<div><h2>'+esc(name)+'</h2><div class="d">'+st.tot+' блок(ів)'+(st.pgs?' · '+st.pgs+' стор.':'')+'</div></div>'
      +(st.cdDays!=null?'<div class="sdash-cd"><b>'+st.cdDays+'</b><span>дн лишилось</span></div>':'')
      +'</div>'
      +'<div class="sdash-covmenu" data-sdmenu><div class="row">'+sw+'</div>'
      +'<div class="acts"><button data-sdphoto>Фото</button><button data-sdclear>Прибрати</button></div></div>'
      +'</div>'
      +'<div class="sdash-stats">'
      +'<div class="sdash-st"><b>'+(st.prog!=null?st.prog+'%':'—')+'</b><span>Прогрес</span><div class="bar"><i style="width:'+(st.prog||0)+'%"></i></div></div>'
      +'<div class="sdash-st"><b>'+(st.tAll?st.tDone+'/'+st.tAll:'—')+'</b><span>Задачі</span><div class="bar"><i style="width:'+(st.tAll?Math.round(st.tDone/st.tAll*100):0)+'%"></i></div></div>'
      +'<div class="sdash-st"><b>'+st.pgs+'</b><span>Сторінки</span><div class="bar"><i style="width:'+Math.min(100,st.pgs*20)+'%;background:#f0b429"></i></div></div>'
      +'<div class="sdash-st"><b>'+st.tot+'</b><span>Блоки</span><div class="bar"><i style="width:'+Math.min(100,st.tot*8)+'%;background:#7c8cff"></i></div></div>'
      +'</div>'
      +pagesHtml
      +'</div></div>';
  }
  (function bindSdash(){
    const board=document.getElementById('board'); if(!board||board.__sdBound)return; board.__sdBound=true;
    board.addEventListener('click',function(e){
      const dash=e.target.closest&&e.target.closest('.sdash'); if(!dash)return;
      if(e.target.closest('[data-sdtoggle]')){
        try{ localStorage.setItem('flowSpaceDash', sdDashOpen()?'0':'1'); }catch(_){}
        renderBoard(); return;
      }
      const op=e.target.closest('[data-sdopen]');
      if(op){ folderPath.push(op.dataset.sdopen); board.scrollTop=0; renderBoard(); return; }
      const menu=dash.querySelector('[data-sdmenu]');
      const g=e.target.closest('[data-sdgrad]');
      if(g){ const c=sdCovers(); c[boardKey]={g:+g.dataset.sdgrad}; sdSaveCovers(c); renderBoard(); return; }
      if(e.target.closest('[data-sdclear]')){ const c=sdCovers(); delete c[boardKey]; sdSaveCovers(c); renderBoard(); return; }
      if(e.target.closest('[data-sdphoto]')){
        if(menu)menu.classList.remove('on');
        const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
        inp.onchange=()=>{ const f=inp.files&&inp.files[0]; if(!f)return;
          const rd=new FileReader();
          rd.onload=()=>{ const img=new Image();
            img.onload=()=>{ const mw=1200,mh=700; let w=img.width,hh=img.height;
              const r=Math.min(1,mw/w,mh/hh); w=Math.round(w*r); hh=Math.round(hh*r);
              const cv=document.createElement('canvas'); cv.width=w; cv.height=hh;
              cv.getContext('2d').drawImage(img,0,0,w,hh);
              const c=sdCovers(); c[boardKey]={img:cv.toDataURL('image/jpeg',0.72)}; sdSaveCovers(c); renderBoard();
            }; img.src=rd.result; };
          rd.readAsDataURL(f); };
        inp.click(); return;
      }
      if(e.target.closest('[data-sdcov]')){ if(menu)menu.classList.toggle('on'); }
    });
  })();

  function renderBoard(){
    syncBlocks();
    try{ renderSpaceSwitcher(); }catch(_){}
    const fromFolderList = !!spaceFromFolder && spaceFromFolder!=='__general__';
    const tabsEl=document.getElementById('boardTabs');
    const sb=document.getElementById('spaceBack');
    const vt=document.getElementById('viewToggle');
    const board=document.getElementById('board');

    // активний масив: корінь або вміст відкритої папки
    const levelArr=currentLevelArr();
    const curFolder=currentFolderObj();
    const inFolder=folderPath.length>0;

    // tabs removed everywhere — clean board; view switcher visible
    tabsEl.style.display='none'; tabsEl.innerHTML='';
    vt.style.display=''; applyViewIcon();
    board.classList.remove('listview','docview','shelfview','gridview');
    if(viewMode==='merged') board.classList.add('docview');
    else if(viewMode==='shelf') board.classList.add('shelfview');
    else board.classList.add('gridview');

    // ШИРОКА ДОШКА: лише в сітці; ширше за екран → горизонтальна прокрутка
    const wideActive = (viewMode==='grid' && boardCols>4 && !isCanvasMode());
    board.classList.toggle('wideboard', wideActive);
    document.body.classList.toggle('wide-on', wideActive);
    if(wideActive){ board.style.setProperty('--bcols', boardCols); }
    else { board.style.removeProperty('--bcols'); }
    try{ applyWideIcon(); }catch(_){}

    // ВІЛЬНЕ ПОЛОТНО: режим canvas (блоки за X/Y)
    const canvasActive = isCanvasMode();
    board.classList.toggle('canvasboard', canvasActive);
    document.body.classList.toggle('canvas-on', canvasActive);
    try{ const ct=document.getElementById('canvasToggle'); if(ct) ct.classList.toggle('on', canvasActive); }catch(_){}

    // кнопка «Назад»: усередині папки — на рівень вище; інакше — стара логіка
    if(inFolder){
      sb.style.display=''; sb.textContent='‹ Назад';
      sb.style.setProperty('--c', (BLOCK_TYPES.group.color));
    } else if(fromFolderList && currentFolderKey){
      sb.style.display=''; sb.textContent='‹ Папки'; sb.style.setProperty('--c', (folders[currentFolderKey]||{}).c||'var(--accent)');
    } else {
      sb.style.display='none';
    }

    // заголовок: ім'я відкритої вкладеної папки/сторінки, або назва активного простору контексту
    if(inFolder && curFolder){
      const isPg=curFolder.type==='page';
      const h1=document.querySelector('#scr-space .brand h1'); if(h1) h1.textContent=curFolder.title||(isPg?'Сторінка':'Папка');
      const lg=document.querySelector('#scr-space .brand .logo'); if(lg) lg.textContent=isPg?'📄':'📁';
    } else {
      const ctx=(typeof curCtx==='function')?curCtx():'__root__';
      const a=(typeof activeSpaceFor==='function')?activeSpaceFor(ctx):'main';
      const sp=(typeof spaceByIdIn==='function')?spaceByIdIn(ctx,a):null;
      const h1=document.querySelector('#scr-space .brand h1'); if(h1) h1.textContent=sp?sp.name:'Простір';
      const lg=document.querySelector('#scr-space .brand .logo'); if(lg) lg.textContent=sp?sp.emoji:'🧩';
    }
    const totalBlocks=(arr)=>arr.reduce((n,b)=>n+1+(isContainer(b)&&Array.isArray(b.children)?totalBlocks(b.children):0),0);
    const tot=totalBlocks(levelArr);
    const inPage = inFolder && curFolder && curFolder.type==='page';
    document.getElementById('spaceSub').textContent = inFolder
      ? (tot? `${tot} ${inPage?'на аркуші':'всередині'}` : (inPage?'порожній аркуш':'порожня папка'))
      : (tot? `${tot} блок(ів)` : 'чистий аркуш');

    // хлібні крихти при вкладеності
    let crumbHtml='';
    if(folderPath.length){
      const parts=['<span data-crumb="-1">Простір</span>'];
      let arr=curBoard();
      folderPath.forEach((id,idx)=>{
        const g=arr.find(b=>String(b.id)===String(id));
        if(g){ parts.push(`<span data-crumb="${idx}">${esc(g.title||'Папка')}</span>`); arr=g.children||[]; }
      });
      crumbHtml=`<div class="grp-crumbs">${parts.join('<i>›</i>')}</div>`;
    }

    const dashHtml=(!inFolder && !isCanvasMode()) ? spaceDashHTML(levelArr) : '';
    if(!levelArr.length){
      if(document.body.classList.contains('folder-clean')){ board.innerHTML=dashHtml+crumbHtml; return; }
      const isPg = inFolder && curFolder && curFolder.type==='page';
      const ico = isPg ? '📄' : (inFolder ? '📂' : '📄');
      const lbl = isPg ? 'Порожній аркуш.' : (inFolder?'Папка порожня.':'Чистий аркуш.');
      board.innerHTML=dashHtml+crumbHtml+`<div class="board-empty"><div class="e">${ico}</div>
        <p>${lbl}<br>Тисни «+», щоб додати блок${inFolder?' сюди':''}.</p></div>`;
      return;
    }
    try{
      const tilesHtml=levelArr.map(b=>{ try{ return renderTileFull(b); }catch(e){ console.error('renderTile',b&&b.type,e); return ''; } }).join('');
      if(board.classList.contains('wideboard')){
        board.innerHTML=dashHtml+crumbHtml+`<div class="board-inner">${tilesHtml}</div>`;
      } else if(board.classList.contains('canvasboard')){
        board.innerHTML=crumbHtml+`<div class="canvas-inner">${tilesHtml}</div>`;
      } else {
        board.innerHTML=dashHtml+crumbHtml+tilesHtml;
      }
      bindTiles();
      try{ if(window.__pgWidgetsSync) window.__pgWidgetsSync(); }catch(_){}
    }catch(e){
      console.error('renderBoard failed',e);
      board.innerHTML='<div class="board-empty"><div class="e">⚠️</div><p>Не вдалося показати дошку. Спробуй оновити.</p></div>';
    }
    try{ if(document.body.classList.contains('space-3pane')) renderPaneList(); }catch(_){}
  }

  // default size per type, used until user changes it
  function defaultSize(type){
    if(type==='quick') return 's';
    if(type==='fin') return 'w';
    return 'w'; // note, check, task, photo, link, list, table — full width by default
  }
  // авто-розмір: підбираємо span за типом і обсягом контенту блока
  function autoSize(b){
    const t=b.type;
    if(t==='photo'||t==='table'||t==='calendar'||t==='fin'||t==='countdown') return 'w';
    if(t==='divider'||t==='head'||t==='h1'||t==='h2'||t==='h3') return 'w';
    if(t==='heatmap'||t==='chart'||t==='tabs'||t==='accord'||t==='code'||t==='embed'||t==='kpi'||t==='audio'||t==='wfocus') return 'w';
    if(t==='quick'){ const len=(b.text||'').length; return len>60?'w':'s'; }
    if(t==='note'){ const len=(b.text||'').length; return len>240?'l':(len>40?'w':'s'); }
    if(t==='quote'){ const len=(b.text||'').length; return len>120?'l':'w'; }
    if(t==='check'||t==='list'||t==='numlist'){ const n=(b.items||[]).length; return n>6?'l':(n>2?'w':'s'); }
    if(t==='progress') return 'w';
    if(t==='task'){ return (b.text||'').length>60?'w':'s'; }
    if(t==='link') return 'w';
    return 'w';
  }
  function szClass(b){
    let s=b.size||defaultSize(b.type);
    if(s==='auto') s=autoSize(b);
    return 'sz-'+s;
  }

  function headBar(b){
    if(b.type==='head') return '';
    const pinned=b.pinned?'on':'';
    // розмір тепер вільний — тягнеш кутик ⤡. Кнопки-пресети прибрано.
    const sizeCtl = '';
    const chipLbl = ((BLOCK_TYPES[b.type]||{}).title||'').toUpperCase();
    return `<div class="th" data-chip="${escAttr(chipLbl)}"><span class="draghandle" data-drag="${b.id}" title="Перетягни блок">⠿</span><span class="ti" style="--c:var(--tc)">${blockIcon(b.type,16)}</span>
      <input class="tt" value="${escAttr(b.title||'')}" data-id="${b.id}" data-f="title" placeholder="Назва">
      <button class="collapsebtn" data-collapse="${b.id}" title="Згорнути">${b.collapsed?'▸':'▾'}</button>
      <button class="menubtn" data-menu="${b.id}" title="Дії">⋮</button></div>
      <div class="tctl">
        ${sizeCtl}
        <button data-mv="${b.id}|up" title="Вгору">↑</button>
        <button data-mv="${b.id}|down" title="Вниз">↓</button>
        <span class="sep"></span>
        <button class="${pinned}" data-pin="${b.id}" title="Закріпити">📌</button>
        <button data-dup="${b.id}" title="Дублювати">⧉</button>
        <button data-del="${b.id}" title="Видалити" style="color:var(--owe)">×</button>
      </div>`;
  }

  // рендер вкладених секцій (для bento і для будь-якого блока з b.sections)
  // типи, які НЕ отримують вкладені секції + водяний «＋»
  const BENTO_SKIP={bento:1,group:1,page:1,head:1,divider:1,fin:1};
  // обгортка: додає вкладені секції та водяний «＋» у звичайні блоки
  function renderTileFull(b){
    let html=renderTile(b);
    if(!html || !b) return html;
    // CANVAS: одразу вшити координати/розмір у НАЯВНИЙ style плитки,
    // щоб вона з'являлась РІВНО на місці (без стрибка в кут і без невидимого drag)
    if(isCanvasMode() && b.fx!=null && b.fy!=null){
      const fhCss = (b.fh!=null) ? `--fh:${Math.round(b.fh)}px;` : '';
      const inline = `--fx:${Math.round(b.fx)}px;--fy:${Math.round(b.fy)}px;--fw:${Math.round(b.fw||260)}px;${fhCss}`;
      html = html.replace(/style="/, `style="${inline}`);
      if(b.fh!=null) html = html.replace(/^(\s*<div class="tile)/, '$1 has-fh');
    }
    if(BENTO_SKIP[b.type]) return html;
    // знаходимо позицію останнього </div> (кінець плитки) і вставляємо перед ним
    const idx=html.lastIndexOf('</div>');
    if(idx<0) return html;
    const secs=bentoSectionsHtml(b);
    const waterPlus=`<button class="bn-waterplus" data-bentoadd="${b.id}" title="Додати секцію">＋</button>`;
    const inject=`${secs}${waterPlus}`;
    return html.slice(0,idx)+inject+html.slice(idx);
  }

  function bentoSectionsHtml(b){
    if(!Array.isArray(b.sections) || !b.sections.length) return '';
    const SM={text:['Текст','📄'],check:['Чек-лист','☑️'],link:['Посилання','🔗'],divider:['Розділювач','➖']};
    return b.sections.map(s=>{
      const lbl=`<div class="bn-lbl">${SM[s.type]?SM[s.type][1]+' '+SM[s.type][0]:''}<button class="bn-x" data-bnsecdel="${b.id}|${s.id}" title="Прибрати секцію">×</button></div>`;
      if(s.type==='text'){
        return `<div class="bn-sec"><div class="bn-text" contenteditable="true" data-bntext="${b.id}|${s.id}" data-ph="Текст…">${esc(s.text||'')}</div></div>`;
      }
      if(s.type==='check'){
        const rows=(s.items||[]).map(it=>`<div class="bn-ck ${it.done?'done':''}">
          <div class="bn-cb ${it.done?'on':''}" data-bnckdone="${b.id}|${s.id}|${it.id}">${it.done?'✓':''}</div>
          <div class="bn-ct" contenteditable="true" data-bncktext="${b.id}|${s.id}|${it.id}" data-ph="Пункт…">${esc(it.text||'')}</div>
          <button class="bn-cx" data-bnckdel="${b.id}|${s.id}|${it.id}">×</button></div>`).join('');
        return `<div class="bn-sec">${lbl}${rows}<div class="bn-ckadd" data-bnckadd="${b.id}|${s.id}">＋ пункт</div></div>`;
      }
      if(s.type==='link'){
        const raw=(s.url||'').trim();
        const host=raw.replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0];
        const inner = raw ? `<div class="bn-lk" data-bnlkedit="${b.id}|${s.id}"><div class="bn-lf">🔗</div>
            <div class="bn-lb"><b>${esc(s.label||host)}</b><small>${esc(host)}</small></div></div>`
          : `<div class="bn-lk"><input placeholder="Встав посилання https://…" data-bnlkurl="${b.id}|${s.id}" value="${escAttr(s.url||'')}"></div>`;
        return `<div class="bn-sec">${lbl}${inner}</div>`;
      }
      if(s.type==='divider'){
        return `<div class="bn-sec">${lbl}<div class="bn-div"></div></div>`;
      }
      return '';
    }).join('');
  }

  function renderTile(b){
    if(!b || !b.type) return '';
    const T=BLOCK_TYPES[b.type];
    if(!T){ // невідомий/застарілий тип — не валимо весь рендер
      return `<div class="tile sz-w" data-tileid="${b&&b.id||''}" style="--tc:var(--muted)">
        <div class="tnote" style="color:var(--muted)">Невідомий блок «${esc(String(b.type||'?'))}»</div></div>`;
    }
    const c=T.color;
    const cc = (b.color)||c;  // власний колір картки папки/сторінки

    // ── СТОРІНКА (окремий аркуш, тап → відкривається новий аркуш) ──
    if(b.type==='page'){
      const kids=Array.isArray(b.children)?b.children:[];
      const count=kids.length;
      const sub = count? `${count} блок${count===1?'':(count<5?'и':'ів')}` : 'порожній аркуш';
      // мініатюра прев'ю: перші кілька рядків змісту
      const prev=kids.slice(0,4).map(k=>{
        const t=BLOCK_TYPES[k.type];
        const lab=(k.title&&k.title.trim())||(k.text&&String(k.text).slice(0,30))||(t?t.title:'блок');
        return `<span class="pgprev-row"><i></i>${esc(String(lab).slice(0,34))}</span>`;
      }).join('') || `<span class="pgprev-empty">Порожній аркуш</span>`;
      const icoHtml = b.emoji ? `<span class="card-emoji">${esc(b.emoji)}</span>` : blockIcon(b.type,18);
      return `<div class="tile page-card" data-tileid="${b.id}" style="--tc:${cc}">
        <span class="draghandle card-grip" data-drag="${b.id}" title="Перетягни">⠿</span>
        <div class="pgc-main" data-grpopen="${b.id}">
          <div class="pgc-sheet">${prev}</div>
          <div class="pgc-foot">
            <button class="pgc-ico card-icobtn" data-cardico="${b.id}" title="Іконка / колір">${icoHtml}</button>
            <span class="pgc-body">
              <input class="pgc-title cardtitle" value="${escAttr(b.title||'Сторінка')}" data-id="${b.id}" data-f="title" placeholder="Назва сторінки">
              <span class="pgc-sub">${sub}</span>
            </span>
            <span class="pgc-arrow">›</span>
          </div>
        </div>
        <button class="menubtn pgc-menu" data-menu="${b.id}" title="Дії">⋮</button>
        <div class="tctl">
          <button data-mv="${b.id}|up" title="Вгору">↑</button>
          <button data-mv="${b.id}|down" title="Вниз">↓</button>
          <span class="sep"></span>
          <button class="${b.pinned?'on':''}" data-pin="${b.id}" title="Закріпити">📌</button>
          <button data-dup="${b.id}" title="Дублювати">⧉</button>
          <button data-del="${b.id}" title="Видалити сторінку" style="color:var(--owe)">×</button>
        </div>
      </div>`;
    }

    // ── КНИГА (тап → відкривається читалка) ──
    if(b.type==='book'){
      const prog=Math.max(0,Math.min(100,Math.round(b.progress||0)));
      const fmt=(b.fmt||'').toUpperCase();
      const hasFile=!!b.bookId;
      const bm=(Array.isArray(b.bookmarks)?b.bookmarks.length:0);
      const sub = hasFile
        ? `${fmt||'—'} · ${prog}%${bm?` · 🔖 ${bm}`:''}`
        : 'натисни, щоб завантажити файл';
      const cover = b.cover
        ? `<span class="bookc-cover" style="background-image:url('${escAttr(b.cover)}')"></span>`
        : `<span class="bookc-cover bookc-noimg">${blockIcon('book',26)}</span>`;
      return `<div class="tile book-card" data-tileid="${b.id}" style="--tc:${cc}">
        <span class="draghandle card-grip" data-drag="${b.id}" title="Перетягни">⠿</span>
        <div class="bookc-main" data-bookopen="${b.id}">
          ${cover}
          <span class="bookc-body">
            <input class="bookc-title cardtitle" value="${escAttr(b.title||'Книга')}" data-id="${b.id}" data-f="title" placeholder="Назва книги">
            <input class="bookc-author" value="${escAttr(b.author||'')}" data-bookauthor="${b.id}" placeholder="Автор (необов'язково)">
            <span class="bookc-sub">${sub}</span>
            ${hasFile?`<span class="bookc-bar"><i style="width:${prog}%"></i></span>`:''}
          </span>
          <span class="bookc-arrow">${hasFile?'›':'⤓'}</span>
        </div>
        <button class="menubtn bookc-menu" data-menu="${b.id}" title="Дії">⋮</button>
        <div class="tctl">
          <button data-mv="${b.id}|up" title="Вгору">↑</button>
          <button data-mv="${b.id}|down" title="Вниз">↓</button>
          <span class="sep"></span>
          <button data-bookfile="${b.id}" title="Замінити файл">⤓</button>
          <button data-dup="${b.id}" title="Дублювати">⧉</button>
          <button data-del="${b.id}" title="Видалити книгу" style="color:var(--owe)">×</button>
        </div>
      </div>`;
    }

    // ── ПАПКА (відкривається на свій рівень) ──
    if(b.type==='group'){
      const kids=Array.isArray(b.children)?b.children:[];
      const count=kids.length;
      const sub = count? `${count} ${count===1?'елемент':(count<5?'елементи':'елементів')}` : 'порожня';
      const gIco = b.emoji ? `<span class="card-emoji">${esc(b.emoji)}</span>` : blockIcon(b.type,20);
      return `<div class="tile grp-card" data-tileid="${b.id}" style="--tc:${cc}">
        <span class="draghandle card-grip" data-drag="${b.id}" title="Перетягни">⠿</span>
        <div class="grpc-main" data-grpopen="${b.id}">
          <button class="grpc-ico card-icobtn" data-cardico="${b.id}" title="Іконка / колір">${gIco}</button>
          <span class="grpc-body">
            <input class="grpc-title cardtitle" value="${escAttr(b.title||'Папка')}" data-id="${b.id}" data-f="title" placeholder="Назва папки">
            <span class="grpc-sub">${sub}</span>
          </span>
          <span class="grpc-arrow">›</span>
        </div>
        <button class="menubtn grpc-menu" data-menu="${b.id}" title="Дії">⋮</button>
        <div class="tctl">
          <button data-mv="${b.id}|up" title="Вгору">↑</button>
          <button data-mv="${b.id}|down" title="Вниз">↓</button>
          <span class="sep"></span>
          <button class="${b.pinned?'on':''}" data-pin="${b.id}" title="Закріпити">📌</button>
          <button data-dup="${b.id}" title="Дублювати">⧉</button>
          <button data-del="${b.id}" title="Видалити папку" style="color:var(--owe)">×</button>
        </div>
      </div>`;
    }

    const head=headBar(b);
    let sz=szClass(b);
    if(b.collapsed) sz+=' collapsed';
    if(b.pinned) sz+=' pinned';

    if(b.type==='divider'){
      return `<div class="tile ${sz} tdivider" data-tileid="${b.id}" style="--tc:${c}">${head}<div class="dividerline"></div></div>`;
    }
    if(b.type==='quote'){
      const qs=b.qstyle||'line';
      const styleBtns=[['line','┃'],['card','▢'],['big','A']].map(([k,l])=>`<button class="qz-style ${qs===k?'on':''}" data-qstyle="${b.id}|${k}" title="${k}">${l}</button>`).join('');
      return `<div class="tile ${sz} tquote qz-${qs}" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="quotebody" contenteditable="true" data-id="${b.id}" data-f="text" data-ph="Цитата або думка…">${esc(b.text||'')}</div>
        <input class="quote-author" placeholder="— Автор (необов'язково)" value="${escAttr(b.author||'')}" data-qauthor="${b.id}">
        <div class="qz-styles">${styleBtns}</div></div>`;
    }
    if(b.type==='progress'){
      const v=Math.max(0,Math.min(100,parseInt(b.value)||0));
      const pv=b.pview||'bar';
      let view;
      if(pv==='ring'){
        const off=Math.round(97*(1-v/100));
        view=`<div class="prog-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--hair)" stroke-width="3.5"/>
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--tc)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="97" stroke-dashoffset="${off}" transform="rotate(-90 18 18)"/>
          <text x="18" y="22" text-anchor="middle" font-size="9" font-weight="800" fill="var(--text)">${v}%</text></svg></div>`;
      } else if(pv==='seg'){
        const steps=5, fill=Math.round(v/100*steps);
        view=`<div class="prog-seg">${Array.from({length:steps}).map((_,i)=>`<span class="${i<fill?'on':''}"></span>`).join('')}<b class="prog-segval">${v}%</b></div>`;
      } else {
        view=`<div class="progwrap"><div class="progbar"><i style="width:${v}%"></i></div><span class="progval">${v}%</span></div>`;
      }
      const viewBtns=[['bar','▬'],['seg','▰'],['ring','◯']].map(([k,l])=>`<button class="pv-style ${pv===k?'on':''}" data-pview="${b.id}|${k}">${l}</button>`).join('');
      return `<div class="tile ${sz} tprog pv-${pv}" data-tileid="${b.id}" style="--tc:${c}">${head}
        ${view}
        <input type="range" min="0" max="100" value="${v}" class="progrange" data-prog="${b.id}">
        <div class="prog-presets">${[0,25,50,75,100].map(p=>`<button class="prog-chip ${v===p?'on':''}" data-progset="${b.id}|${p}">${p}</button>`).join('')}</div>
        <div class="pv-styles">${viewBtns}</div></div>`;
    }
    if(b.type==='calendar'){
      const ym=b.ym||ymLocal();
      const [yy,mm]=ym.split('-').map(Number);
      const first=new Date(yy,mm-1,1); const start=(first.getDay()+6)%7; // Mon=0
      const days=new Date(yy,mm,0).getDate();
      const monthName=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'][mm-1];
      const today=ymdLocal();
      let cells='';
      ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].forEach(d=>cells+=`<span class="cal-wd">${d}</span>`);
      for(let i=0;i<start;i++) cells+=`<span class="cal-e"></span>`;
      for(let d=1;d<=days;d++){
        const ds=`${ym}-${String(d).padStart(2,'0')}`;
        const on=b.marks&&b.marks[ds]?'on':'';
        const td=ds===today?'today':'';
        cells+=`<span class="cal-d ${on} ${td}" data-cal="${b.id}|${ds}">${d}</span>`;
      }
      return `<div class="tile ${sz} tcal" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="cal-head"><button data-calnav="${b.id}|-1">‹</button><span>${monthName} ${yy}</span><button data-calnav="${b.id}|1">›</button></div>
        <div class="cal-grid">${cells}</div></div>`;
    }
    /* ═══ PREMIUM PACK V1 ═══ */
    if(b.type==='heatmap'){
      const marks=b.marks||{};
      const today=ymdLocal();
      const end=new Date(); const dow=(end.getDay()+6)%7; // Пн=0
      const days=[]; const start=new Date(end); start.setDate(end.getDate()-(11*7+dow));
      for(let d=new Date(start); d<=end; d.setDate(d.getDate()+1)){ days.push(ymdLocal(new Date(d))); }
      const cells=days.map(ds=>{
        const lv=marks[ds]||0;
        return `<i class="hm-c lv${lv} ${ds===today?'hm-t':''}" data-hm="${b.id}|${ds}"></i>`;
      }).join('');
      const total=Object.keys(marks).filter(k=>marks[k]>0).length;
      let streak=0; for(let i=days.length-1;i>=0;i--){ if(marks[days[i]]>0) streak++; else break; }
      return `<div class="tile ${sz} theat" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="hm-grid">${cells}</div>
        <div class="hm-foot"><span>🔥 ${streak} дн. поспіль</span><span>${total} за 12 тиж.</span></div>
        <div class="hm-hint">тап по сьогодні · довгий тап по будь-якому дню</div></div>`;
    }
    if(b.type==='kpi'){
      const pts=(b.points||[]).slice(-30);
      if(!pts.length){
        return `<div class="tile ${sz} tkpi" data-tileid="${b.id}" style="--tc:${c}">${head}
          <button class="pp-empty" data-kpiadd="${b.id}">＋ Додай перше значення</button></div>`;
      }
      const cur=pts[pts.length-1].v, prev=pts.length>1?pts[pts.length-2].v:cur;
      const dd=prev? Math.round((cur-prev)/Math.abs(prev)*1000)/10 : 0;
      const up=dd>=0;
      const mn=Math.min(...pts.map(p=>p.v)), mx=Math.max(...pts.map(p=>p.v)), rng=(mx-mn)||1;
      const W=120,H=34;
      const poly=pts.map((p,i)=>`${(i/(Math.max(pts.length-1,1)))*W},${H-3-((p.v-mn)/rng)*(H-6)}`).join(' ');
      return `<div class="tile ${sz} tkpi" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="kpi-row">
          <div class="kpi-main"><b class="kpi-val">${esc(String(cur))}</b><span class="kpi-unit">${esc(b.unit||'')}</span>
            <span class="kpi-delta ${up?'up':'dn'}">${up?'▲':'▼'} ${Math.abs(dd)}%</span></div>
          <svg class="kpi-spark" viewBox="0 0 ${W} ${H}"><polyline points="${poly}"/></svg>
        </div>
        <button class="pp-ghost" data-kpiadd="${b.id}">＋ значення</button></div>`;
    }
    if(b.type==='chart'){
      const pts=(b.points||[]).slice(-30);
      const view=b.view||'bar';
      let body;
      if(!pts.length){
        body=`<button class="pp-empty" data-chadd="${b.id}">＋ Додай першу точку</button>`;
      } else {
        const mx=Math.max(...pts.map(p=>p.v),1);
        if(view==='bar'){
          body=`<div class="ch-bars">${pts.map(p=>`<span class="ch-bcol"><i style="height:${Math.max(4,p.v/mx*100)}%"></i><em>${esc(p.l||'')}</em></span>`).join('')}</div>`;
        } else {
          const W=280,H=90;
          const poly=pts.map((p,i)=>`${(i/Math.max(pts.length-1,1))*W},${H-6-(p.v/mx)*(H-12)}`).join(' ');
          body=`<svg class="ch-line" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polyline points="${poly}"/></svg>`;
        }
      }
      return `<div class="tile ${sz} tchart" data-tileid="${b.id}" style="--tc:${c}">${head}
        ${body}
        <div class="ch-ctrl">
          <button class="pv-style ${view==='bar'?'on':''}" data-chview="${b.id}|bar">▮▮</button>
          <button class="pv-style ${view==='line'?'on':''}" data-chview="${b.id}|line">〜</button>
          ${pts.length?`<button class="pp-ghost" style="margin-top:0" data-chadd="${b.id}">＋ точка</button>`:''}
        </div></div>`;
    }
    if(b.type==='tabs'){
      if(!Array.isArray(b.tabs)||!b.tabs.length) b.tabs=[{name:'Нотатки',text:''}];
      const ti=Math.min(parseInt(b.ti)||0, b.tabs.length-1);
      const heads=b.tabs.map((t,i)=>`<button class="tb-h ${i===ti?'on':''}" data-tab="${b.id}|${i}">${esc(t.name||('Таб '+(i+1)))}</button>`).join('');
      const curTab=b.tabs[ti];
      return `<div class="tile ${sz} ttabs" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="tb-heads">${heads}<button class="tb-h tb-add" data-tabadd="${b.id}">＋</button></div>
        <div class="tb-body" contenteditable="true" data-tabtxt="${b.id}|${ti}">${esc(curTab.text||'')}</div></div>`;
    }
    if(b.type==='accord'){
      if(!Array.isArray(b.secs)||!b.secs.length) b.secs=[{name:'Секція',text:'',open:1}];
      const rows=b.secs.map((s,i)=>`
        <div class="ac-sec ${s.open?'open':''}">
          <button class="ac-h" data-acc="${b.id}|${i}"><span class="ac-ar">›</span>${esc(s.name||('Секція '+(i+1)))}</button>
          <div class="ac-b"><div><div class="ac-txt" contenteditable="true" data-acctxt="${b.id}|${i}">${esc(s.text||'')}</div></div></div>
        </div>`).join('');
      return `<div class="tile ${sz} taccord" data-tileid="${b.id}" style="--tc:${c}">${head}
        ${rows}<button class="pp-ghost" data-accadd="${b.id}">＋ секція</button></div>`;
    }
    if(b.type==='code'){
      const lang=b.lang||'js';
      const hl=(srcTxt)=>{
        let s=esc(srcTxt||'');
        if(lang==='js'){
          s=s.replace(/(\/\/[^\n]*)/g,'<i class="c-com">$1</i>')
             .replace(/(&#39;[^&\n]*?&#39;|&quot;[^&\n]*?&quot;|`[^`]*`)/g,'<i class="c-str">$1</i>')
             .replace(/\b(const|let|var|function|return|if|else|for|while|try|catch|new|class|await|async|import|export)\b/g,'<i class="c-kw">$1</i>')
             .replace(/\b(\d+(?:\.\d+)?)\b/g,'<i class="c-num">$1</i>');
        } else if(lang==='css'){
          s=s.replace(/(\/\*[\s\S]*?\*\/)/g,'<i class="c-com">$1</i>')
             .replace(/(--[a-z-]+)/g,'<i class="c-num">$1</i>')
             .replace(/([.#]?[a-zA-Z][a-zA-Z0-9_-]*)(\s*\{)/g,'<i class="c-kw">$1</i>$2');
        } else if(lang==='html'){
          s=s.replace(/(&lt;\/?[a-zA-Z][^&]*?&gt;)/g,'<i class="c-kw">$1</i>');
        }
        return s;
      };
      const emptyC=!(b.text||'').trim();
      return `<div class="tile ${sz} tcode" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="cd-bar">
          ${['js','html','css','txt'].map(l=>`<button class="cd-lang ${lang===l?'on':''}" data-cdlang="${b.id}|${l}">${l}</button>`).join('')}
          <button class="cd-copy" data-cdcopy="${b.id}">копіювати</button>
        </div>
        ${emptyC
          ? `<button class="pp-empty" data-cdedit="${b.id}">＋ Встав код</button>`
          : `<pre class="cd-pre" data-cdedit="${b.id}"><code>${hl(b.text)}</code></pre>`}</div>`;
    }
    if(b.type==='embed'){
      const m=(b.url||'').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
      const vid=m?m[1]:null;
      let body;
      if(!vid){
        body=`<button class="pp-empty" data-emset="${b.id}">＋ Встав посилання YouTube</button>`;
      } else if(b.play){
        body=`<div class="em-wrap"><iframe src="https://www.youtube.com/embed/${vid}?autoplay=1&playsinline=1" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
      } else {
        body=`<button class="em-wrap em-thumb" data-emplay="${b.id}" style="background-image:url('https://i.ytimg.com/vi/${vid}/hqdefault.jpg')"><span class="em-play">▶</span></button>`;
      }
      return `<div class="tile ${sz} tembed" data-tileid="${b.id}" style="--tc:${c}">${head}${body}</div>`;
    }
    if(b.type==='audio'){
      const emptyA=!(b.url||'').trim();
      return `<div class="tile ${sz} taudio" data-tileid="${b.id}" style="--tc:${c}">${head}
        ${emptyA
          ? `<button class="pp-empty" data-auset="${b.id}">＋ Встав посилання на аудіо</button>`
          : `<div class="au-row">
              <button class="au-btn" data-auplay="${b.id}">▶</button>
              <div class="au-mid"><b class="au-nm">${esc(b.name||'Аудіо')}</b>
                <div class="au-bar" data-auseek="${b.id}"><i></i></div></div>
              <span class="au-time">0:00</span>
              <audio preload="none" data-auel="${b.id}" src="${esc(b.url)}"></audio>
            </div>`}</div>`;
    }
    if(b.type==='wfocus'){
      const nowT=Date.now();
      if(b.doneD!==ymdLocal()){ b.done=0; b.doneD=ymdLocal(); }
      const running=b.end&&b.end>nowT;
      const totalT=(b.mode==='rest'?5:25)*60000;
      const left=running? b.end-nowT : totalT;
      const mmF=Math.floor(left/60000), ssF=Math.floor(left%60000/1000);
      const frac=running? left/totalT : 1;
      const RR=34, CIRC=2*Math.PI*RR;
      return `<div class="tile ${sz} tfocus ${running?'run':''}" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="fc-row">
          <button class="fc-ring" data-fctap="${b.id}">
            <svg viewBox="0 0 80 80"><circle class="fc-bg" cx="40" cy="40" r="${RR}"/>
              <circle class="fc-fg" cx="40" cy="40" r="${RR}" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC*(1-frac)}"/></svg>
            <b class="fc-time">${mmF}:${String(ssF).padStart(2,'0')}</b>
          </button>
          <div class="fc-side">
            <span class="fc-mode">${b.mode==='rest'?'☕ Перерва':'🍅 Фокус'}</span>
            <span class="fc-cnt">${'●'.repeat(Math.min(b.done||0,8))||'—'} сьогодні</span>
            <span class="fc-hint">${running?'тап = стоп':'тап = старт '+(b.mode==='rest'?'5':'25')+' хв'}</span>
          </div>
        </div></div>`;
    }
    if(b.type==='countdown'){
      let info='';
      if(b.target){
        const t=new Date(b.target+'T00:00:00'); const now=new Date(); now.setHours(0,0,0,0);
        const diff=Math.round((t-now)/86400000);
        const txt = diff>0?`${diff} дн. лишилось` : diff===0?'Сьогодні!' : `${-diff} дн. тому`;
        info=`<div class="cd-num" style="color:${diff<0?'var(--muted)':'var(--tc)'}">${diff>0?diff:diff===0?'0':'—'}</div><div class="cd-txt">${txt}</div>`;
      } else {
        info=`<div class="cd-txt" style="color:var(--muted)">Обери дату нижче</div>`;
      }
      return `<div class="tile ${sz} tcd" data-tileid="${b.id}" style="--tc:${c}">${head}
        ${info}
        <input class="cd-label" placeholder="Подія (напр. Відпустка)" value="${escAttr(b.label||'')}" data-cdlabel="${b.id}">
        <div class="due">📅 <input type="date" value="${esc(b.target||'')}" data-cdtarget="${b.id}"></div></div>`;
    }
    if(b.type==='h1' || b.type==='h2' || b.type==='h3'){
      return `<div class="tile ${sz} theading t${b.type}" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="hd-text" contenteditable="true" data-id="${b.id}" data-f="text" data-ph="Заголовок…">${esc(b.text||'')}</div></div>`;
    }
    if(b.type==='toggle'){
      return `<div class="tile ${sz} ttoggle" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="tg-row" data-toggleblk="${b.id}">
          <span class="tg-car">${b.open?'▾':'▸'}</span>
          <div class="tg-title" contenteditable="true" data-id="${b.id}" data-f="title" data-ph="Заголовок тоглу…">${esc(b.title||'')}</div>
        </div>
        <div class="tg-body ${b.open?'open':''}" contenteditable="true" data-id="${b.id}" data-f="text" data-ph="Прихований текст…">${esc(b.text||'')}</div></div>`;
    }
    if(b.type==='callout'){
      const tone=b.tone||'tip';
      const TONES={tip:['💡','#f0b429'],warn:['⚠️','#ff6b6f'],ok:['✅','#34c77b'],info:['ℹ️','#5b8def']};
      const ico=b.ico||TONES[tone][0];
      const tc2=TONES[tone][1];
      const toneBtns=Object.keys(TONES).map(k=>`<button class="co-tone ${tone===k?'on':''}" style="--toc:${TONES[k][1]}" data-cotone="${b.id}|${k}" title="${k}">${TONES[k][0]}</button>`).join('');
      return `<div class="tile ${sz} tcallout co-${tone}" data-tileid="${b.id}" style="--tc:${tc2}">${head}
        <div class="co-in"><button class="co-ico" data-coico="${b.id}" title="Змінити іконку">${ico}</button>
        <div class="co-text" contenteditable="true" data-id="${b.id}" data-f="text" data-ph="Важлива примітка…">${esc(b.text||'')}</div></div>
        <div class="co-tones">${toneBtns}</div></div>`;
    }
    if(b.type==='numlist'){
      const items=(b.items||['']);
      const rows=items.map((t,i)=>`<div class="nl-row">
        <span class="nl-num">${i+1}.</span>
        <div class="nl-tx" contenteditable="true" data-numlist="${b.id}|${i}" data-ph="Пункт…">${esc(t)}</div>
        <button class="nl-del" data-numdel="${b.id}|${i}">×</button></div>`).join('');
      return `<div class="tile ${sz} tnumlist" data-tileid="${b.id}" style="--tc:${c}">${head}${rows}
        <button class="nl-add" data-numadd="${b.id}">+ Пункт</button></div>`;
    }
    if(b.type==='note' || b.type==='quick'){
      const showBar = b.type==='note';
      const bar = showBar ? `<div class="rt-bar">
        <button data-rt="bold|${b.id}" title="Жирний"><b>Б</b></button>
        <button data-rt="italic|${b.id}" title="Курсив"><i>К</i></button>
        <button data-rt="hl|${b.id}" title="Маркер">🖍</button>
        <button data-rt="strike|${b.id}" title="Закреслити"><s>S</s></button>
        <button data-rt="clear|${b.id}" title="Очистити формат">⌫</button>
      </div>` : '';
      return `<div class="tile ${sz}" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="note-rich-wrap">${bar}
        <div class="tnote rich" contenteditable="true" data-id="${b.id}" data-f="html" data-ph="Почни писати…">${b.html||esc(b.text||'')}</div></div></div>`;
    }
    if(b.type==='check'){
      const total=b.items.filter(i=>i.text.trim()).length;
      const done=b.items.filter(i=>i.done&&i.text.trim()).length;
      const pct=total?Math.round(done/total*100):0;
      const rows=b.items.map(i=>`<div class="ci">
        <div class="cb ${i.done?'on':''}" data-chk="${b.id}|${i.id}">${i.done?'✓':''}</div>
        <div class="ct ${i.done?'done':''}" contenteditable="true" data-ci="${b.id}|${i.id}">${esc(i.text)}</div>
        <button class="cdel" data-cdel="${b.id}|${i.id}">×</button></div>`).join('');
      return `<div class="tile ${sz} tcheck" data-tileid="${b.id}" style="--tc:${c}">${head}
        ${total?`<div class="chk-count">${done}/${total} виконано</div>`:''}
        ${rows}
        <div class="tadd" data-addci="${b.id}">+ пункт</div>
        ${done?`<button class="chk-clear" data-clrdone="${b.id}">🧹 Прибрати виконані (${done})</button>`:''}
        ${total?`<div class="tprogress"><i style="width:${pct}%"></i></div>`:''}</div>`;
    }
    if(b.type==='task'){
      const PR={none:['—','var(--muted)'],low:['Низький','#34c77b'],mid:['Середній','#f0b429'],high:['Високий','#ff6b6b']};
      const prio=b.prio||'none';
      const chips=Object.keys(PR).filter(k=>k!=='none').map(k=>
        `<button class="prio-chip ${prio===k?'on':''}" style="--pc:${PR[k][1]}" data-prio="${b.id}|${k}">${PR[k][0]}</button>`).join('');
      const subs=Array.isArray(b.subs)?b.subs:[];
      const sdone=subs.filter(s=>s.done).length;
      const ring = subs.length ? (()=>{ const off=Math.round(97*(1-sdone/subs.length));
        return `<div class="task-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--hair)" stroke-width="4"/>
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--tc)" stroke-width="4" stroke-linecap="round" stroke-dasharray="97" stroke-dashoffset="${off}" transform="rotate(-90 18 18)"/>
          <text x="18" y="22" text-anchor="middle" font-size="8.5" font-weight="800" fill="var(--text)">${sdone}/${subs.length}</text></svg></div>`; })() : '';
      const subRows=subs.map(s=>`<div class="subrow ${s.done?'done':''}">
        <span class="subcb ${s.done?'on':''}" data-subchk="${b.id}|${s.id}">${s.done?'✓':''}</span>
        <div class="subtx" contenteditable="true" data-subtx="${b.id}|${s.id}" data-ph="Підзадача…">${esc(s.text||'')}</div>
        <button class="subdel" data-subdel="${b.id}|${s.id}">×</button></div>`).join('');
      return `<div class="tile ${sz} ttask" data-tileid="${b.id}" style="--tc:${prio!=='none'?PR[prio][1]:c}">${head}
        <div class="bigchk">${ring}<div class="cb ${b.done?'on':''}" data-tdone="${b.id}">${b.done?'✓':''}</div>
        <div class="lbl ${b.done?'done':''}" contenteditable="true" data-id="${b.id}" data-f="text" data-ph="Що зробити…">${esc(b.text||'')}</div></div>
        <div class="subs">${subRows}<button class="sub-add" data-subadd="${b.id}">+ підзадача</button></div>
        <div class="prio-row">${chips}</div>
        <div class="due">📅 <input type="date" value="${esc(b.due||'')}" data-due="${b.id}"></div>
        <button class="task-remind ${b.remindAt?'set':''}" data-remind="${b.id}">${b.remindAt?('⏰ '+remindLabel(b.remindAt)):'🔔 Нагадати'}</button></div>`;
    }
    if(b.type==='photo'){
      return `<div class="tile ${sz} tphoto" data-tileid="${b.id}" style="--tc:${c}">${head}
        ${b.data?`<img class="pimg" src="${safeImg(b.data)}" alt="фото">`:`<div class="tnote" style="color:var(--muted)">Не вдалося завантажити фото</div>`}</div>`;
    }
    if(b.type==='link'){
      const raw=(b.url||'').trim();
      const host=raw.replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0];
      const title=b.label||host||'Посилання';
      const fav=host?`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`:'';
      const editing=b.editing||!raw;
      const card = raw ? `<div class="link-view">
          <a class="linkcard" href="${escAttr(raw)}" target="_blank" rel="noopener" data-linkopen="${b.id}">
            <span class="lc-fav">${fav?`<img src="${safeImg(fav)}" alt="" onerror="this.parentNode.innerHTML='<span class=&quot;lc-let&quot;>${esc((host[0]||'L').toUpperCase())}</span>'">`:`<span class="lc-let">${esc((host[0]||'L').toUpperCase())}</span>`}</span>
            <span class="lc-body"><span class="lc-title">${esc(title)}</span><span class="lc-host">${esc(host)}</span></span>
            <span class="lc-arrow">→</span>
          </a>
          <button class="link-edit-toggle" data-linkedit="${b.id}">✎ Змінити</button>
        </div>` : '';
      const fields = `<div class="link-fields">
          <input class="linkinput" placeholder="Встав посилання (https://…)" value="${escAttr(b.url||'')}" data-linkurl="${b.id}">
          <input class="linkinput sm" placeholder="Назва (необов'язково)" value="${escAttr(b.label||'')}" data-linklabel="${b.id}">
          ${raw?`<button class="link-edit-toggle" data-linkdone="${b.id}">✓ Готово</button>`:''}
        </div>`;
      return `<div class="tile ${sz} tlinkblock ${editing?'editing':''}" data-tileid="${b.id}" style="--tc:${c}">${head}${card}${fields}</div>`;
    }
    if(b.type==='list'){
      const lstyle=b.lstyle||'bullet';
      const BUL={bullet:'•',arrow:'→',dash:'–',star:'★'};
      const rows=b.items.map(i=>`<div class="li">
        <span class="lbullet">${BUL[lstyle]||'•'}</span>
        <div class="lt" contenteditable="true" data-li="${b.id}|${i.id}">${esc(i.text)}</div>
        <button class="cdel" data-ldel="${b.id}|${i.id}">×</button></div>`).join('');
      const styleBtns=Object.entries(BUL).map(([k,v])=>`<button class="ls-style ${lstyle===k?'on':''}" data-lstyle="${b.id}|${k}">${v}</button>`).join('');
      return `<div class="tile ${sz} tlist" data-tileid="${b.id}" style="--tc:${c}">${head}${rows}
        <div class="tadd" data-addli="${b.id}">+ пункт</div>
        <div class="ls-styles">${styleBtns}</div></div>`;
    }
    if(b.type==='table'){
      const head2=`<tr>${b.cols.map((cName,ci)=>`<th><input class="tcell thx" value="${escAttr(cName)}" data-tcol="${b.id}|${ci}"><button class="tsort" data-tsort="${b.id}|${ci}" title="Сортувати">↕</button></th>`).join('')}<th class="tctrl"></th></tr>`;
      const body=b.rows.map((row,ri)=>`<tr>${row.map((cell,ci)=>`<td><input class="tcell" value="${escAttr(cell)}" data-tcell="${b.id}|${ri}|${ci}"></td>`).join('')}<td class="tctrl"><button class="trdel" data-trdel="${b.id}|${ri}">×</button></td></tr>`).join('');
      // підсумок: для кожної колонки, де всі непорожні значення числові — сума
      const sums=b.cols.map((_,ci)=>{ const vals=b.rows.map(r=>String(r[ci]??'').trim()).filter(x=>x!==''); if(!vals.length) return ''; const nums=vals.map(x=>parseFloat(x.replace(',','.'))); return nums.every(n=>!isNaN(n))?'Σ '+(Math.round(nums.reduce((a,n)=>a+n,0)*100)/100):''; });
      const hasSum=sums.some(s=>s);
      const sumRow=hasSum?`<tr class="tsum">${sums.map(s=>`<td>${s}</td>`).join('')}<td></td></tr>`:'';
      return `<div class="tile ${sz} ttable" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="tablescroll"><table class="dtable"><thead>${head2}</thead><tbody>${body}${sumRow}</tbody></table></div>
        <div class="tablebtns"><span class="tadd" data-addrow="${b.id}">+ рядок</span><span class="tadd" data-addcol="${b.id}">+ колонка</span></div></div>`;
    }
    if(b.type==='head'){
      return `<div class="tile sz-w thead" data-tileid="${b.id}" style="--tc:${c}">
        <span class="draghandle" data-drag="${b.id}" title="Перетягни">⠿</span>
        <input class="headinput" value="${escAttr(b.title||'')}" data-id="${b.id}" data-f="title" placeholder="Заголовок секції">
        <div class="tctl"><button data-mv="${b.id}|up">↑</button><button data-mv="${b.id}|down">↓</button>
        <button data-del="${b.id}" style="color:var(--owe)">×</button></div></div>`;
    }
    // ── 5 ВІДЖЕТІВ ПРОЄКТІВ (папки з роллю «Проєкт») ──
    if(b.type==='wplanday'||b.type==='wplanmonth'){
      let fk=b.pfolder||''; try{ if(!fk){ const cx=curCtx(); if(cx!=='__root__') fk=cx; } }catch(_){}
      if(!fk || typeof folders==='undefined' || !folders[fk]){
        return `<div class="tile ${sz} pw" data-tileid="${b.id}" style="--tc:${c}">${head}
          <div class="pw-empty">Віджет живе всередині папки-проєкту</div></div>`;
      }
      const f=folders[fk];
      if(b.type==='wplanday'){
        const td=plTodayStr();
        const bs=plBlocksDisplay(td).filter(x=>x.folder===fk).sort((a,b2)=>a.h-b2.h);
        const dn=bs.filter(x=>x.done).length;
        const rows=bs.slice(0,4).map(x=>`<div class="pw-planrow ${x.done?'done':''}" style="--fc:${f.c}">
          <span>${plHM(x.h)}</span><b>${esc(x.t)}</b>${x.fromRecur?'<em>🔁</em>':''}</div>`).join('')
          ||`<div class="pw-planempty">Сьогодні точок нема — додай першу</div>`;
        return `<div class="tile ${sz} pw" data-tileid="${b.id}" style="--tc:${c}">${head}
          <div class="pw-plansub">${bs.length?dn+' з '+bs.length+' виконано':'план проєкту на сьогодні'}</div>
          ${rows}
          <button class="pw-btn go" data-wplan="day|${fk}">Відкрити · ＋ точка</button></div>`;
      }
      const ym=plTodayStr().slice(0,7), td=plTodayStr();
      const weeks=plMonthWeeks(ym);
      let nd=0;
      const cells=weeks.map(w=>w.map(ds=>{
        if(!ds) return '<i></i>';
        const has=plBlocksDisplay(ds).some(x=>x.folder===fk); if(has) nd++;
        return `<i class="${has?'dot':''}${ds===td?' td':''}"></i>`;
      }).join('')).join('');
      return `<div class="tile ${sz} pw" data-tileid="${b.id}" style="--tc:${c};--fc:${f.c}">${head}
        <div class="pw-plansub">${nd?nd+' дн. з точками цього місяця':'ритм проєкту за місяць'}</div>
        <div class="pw-mmini">${cells}</div>
        <button class="pw-btn go" data-wplan="month|${fk}">Відкрити календар</button></div>`;
    }
    if(b.type==='wpult'||b.type==='wstack'||b.type==='wpipe'||b.type==='wtline'||b.type==='wportal'){
      const pks=projFolderKeys();
      const empt=(msg)=>`<div class="tile ${sz} pw" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="pw-empty">${msg}<br><small>Меню папки (⋮) → Роль → Проєкт</small></div></div>`;
      const st=s=>projStatusMeta(s||'active');
      if(b.type==='wpult'){
        if(!pks.length) return empt('Немає папок-проєктів');
        const rows=pks.map(k=>{const f=folders[k];const pr=folderProgress(k);const nx=folderNextStep(k);const dl=dueLabel(f.due);const s=st(f.status);
          return `<div class="pw-row" style="--fc:${f.c}">
            <div class="pw-rt" data-wgo="${k}">
              <span class="pw-em">${(f.emoji||'📁')}</span>
              <span class="pw-meat"><b>${esc(f.name)}</b>
                <span class="pw-line"><span class="fchip" style="--stc:${s[2]}">${s[1]}</span>
                  <span class="fprg"><i style="width:${pr.pct}%"></i></span><span class="pw-pct">${pr.pct}%</span>
                  ${dl?`<span class="fdue ${dl.late?'late':''}">${dl.t}</span>`:''}</span></span>
            </div>
            ${nx?`<div class="pw-next"><button class="pw-cb" data-wpnext="${b.id}|${k}"></button>
              <span class="pw-nx"><small>НАСТУПНИЙ КРОК</small>${esc(nx.item.text)}</span></div>`
            :`<div class="pw-next pw-done">✨ всі кроки закриті</div>`}
          </div>`;}).join('');
        return `<div class="tile ${sz} pw" data-tileid="${b.id}" style="--tc:${c}">${head}<div class="pw-list">${rows}</div></div>`;
      }
      if(b.type==='wstack'){
        if(!pks.length) return empt('Немає папок-проєктів');
        const i=Math.min(parseInt(b.idx)||0, pks.length);
        if(i>=pks.length){
          return `<div class="tile ${sz} pw" data-tileid="${b.id}" style="--tc:${c}">${head}
            <div class="pw-empty">🎉 Обліт завершено!<br><small>Всі проєкти переглянуто</small>
            <button class="pw-btn" data-wstack="${b.id}|reset">Пройти ще раз</button></div></div>`;
        }
        const f=folders[pks[i]];const pr=folderProgress(pks[i]);const nx=folderNextStep(pks[i]);const dl=dueLabel(f.due);const s=st(f.status);
        const C2=2*Math.PI*20, off=Math.round(C2*(1-pr.pct/100));
        return `<div class="tile ${sz} pw pw-stack" data-tileid="${b.id}" style="--tc:${c};--fc:${f.c}">${head}
          <div class="pw-scard">
            <div class="pw-shead">
              <span class="pw-ring"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="none" stroke="var(--hair)" stroke-width="5"/>
                <circle cx="24" cy="24" r="20" fill="none" stroke="${f.c}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C2}" stroke-dashoffset="${off}" transform="rotate(-90 24 24)"/></svg><b>${pr.pct}%</b></span>
              <span class="pw-meat"><b>${(f.emoji||'📁')} ${esc(f.name)}</b>
                <span class="pw-line"><span class="fchip" style="--stc:${s[2]}">${s[1]}</span>
                ${dl?`<span class="fdue ${dl.late?'late':''}">⏳ ${dl.t}</span>`:''}</span></span>
            </div>
            ${nx?`<div class="pw-next"><span class="pw-nx"><small>НАСТУПНИЙ КРОК</small>${esc(nx.item.text)}</span></div>`:`<div class="pw-next pw-done">✨ всі кроки закриті</div>`}
            <div class="pw-sbtns">
              <button class="pw-btn ghost" data-wstack="${b.id}|skip">Пізніше</button>
              <button class="pw-btn ghost" data-wgo="${pks[i]}">Відкрити</button>
              ${nx?`<button class="pw-btn go" data-wstack="${b.id}|done|${pks[i]}">Зроблено ✓</button>`:`<button class="pw-btn go" data-wstack="${b.id}|skip">Далі</button>`}
            </div>
            <div class="pw-cnt">${i+1} з ${pks.length}</div>
          </div></div>`;
      }
      if(b.type==='wpipe'){
        if(!pks.length) return empt('Немає папок-проєктів');
        const cols=PROJECT_STATUSES.map(([sk,sn,sc])=>{
          const list=pks.filter(k=>(folders[k].status||'active')===sk);
          return `<div class="pw-col" style="--sc:${sc}"><div class="pw-colh">${sn}<i>${list.length}</i></div>
            ${list.map(k=>{const f=folders[k];const pr=folderProgress(k);
              return `<div class="pw-pcard" style="--fc:${f.c}" data-wpipe="${k}" title="Тап — наступний статус">
                <b>${(f.emoji||'📁')} ${esc(f.name)}</b>
                <span class="pw-line"><span class="fprg"><i style="width:${pr.pct}%"></i></span><span class="pw-pct">${pr.pct}%</span></span></div>`;}).join('')||'<div class="pw-colempty">—</div>'}
          </div>`;}).join('');
        const act=pks.filter(k=>(folders[k].status||'active')==='active').length;
        return `<div class="tile ${sz} pw" data-tileid="${b.id}" style="--tc:${c}">${head}
          <div class="pw-pipe">${cols}</div>
          ${act>3?`<div class="pw-wip">⚠️ У роботі ${act} проєктів — фокус розмивається</div>`:''}</div>`;
      }
      if(b.type==='wtline'){
        const dks=pks.filter(k=>folders[k].due);
        if(!dks.length) return empt('Немає проєктів із дедлайном');
        const WEEKS=6;
        const wk=k=>{const d=new Date(folders[k].due+'T23:59:59');const days=Math.ceil((d-Date.now())/86400000);return Math.max(0,Math.min(WEEKS-1,Math.floor(days/7)));};
        const late=k=>{const d=new Date(folders[k].due+'T23:59:59');return d<Date.now();};
        return `<div class="tile ${sz} pw" data-tileid="${b.id}" style="--tc:${c}">${head}
          <div class="pw-tl"><div class="pw-tlin">
            <div class="pw-hot" style="left:0;width:${100/WEEKS}%"></div>
            <div class="pw-axis">${Array.from({length:WEEKS},(_,i)=>`<span class="${i===0?'hot':''}">${i===0?'Цей тижд.':'+'+i}</span>`).join('')}</div>
            ${dks.map(k=>{const f=folders[k];const pr=folderProgress(k);const L=late(k);const w=wk(k);
              return `<div class="pw-tlrow"><div class="pw-tlbar ${L?'late':''}" style="--fc:${f.c};left:${L?0:w*(100/WEEKS)}%;width:${100/WEEKS*0.96}%" data-wgo="${k}">
                <i style="width:${pr.pct}%"></i><span>${(f.emoji||'📁')} ${esc(f.name)}</span></div></div>`;}).join('')}
          </div></div></div>`;
      }
      if(b.type==='wportal'){
        const all=orderedFolderKeys().filter(k=>folders[k]&&folderVisible(k));
        if(!all.length) return empt('Немає папок');
        return `<div class="tile ${sz} pw" data-tileid="${b.id}" style="--tc:${c}">${head}
          <div class="pw-grid">${all.map(k=>{const f=folders[k];const role=f.role||'area';const pr=role==='project'?folderProgress(k):null;const s=st(f.status);
            return `<div class="pw-gcell" style="--fc:${f.c}" data-wgo="${k}">
              <span class="pw-em big">${(f.emoji||'📁')}</span><b>${esc(f.name)}</b>
              ${role==='project'?`<span class="pw-line"><span class="fchip" style="--stc:${s[2]}">${s[1]}</span><span class="fprg"><i style="width:${pr.pct}%"></i></span></span>`
                :`<span class="pw-role">${role==='page'?'📄 сторінка':'📁 область'}</span>`}</div>`;}).join('')}
          </div></div>`;
      }
    }
    if(b.type==='fin'){
      let owe=0,owed=0; items.forEach(i=>{ if(i.cur==='UAH'){const v=balance(i); i.kind==='owe'?owe+=v:owed+=v;} });
      const net=owed-owe, spent=spendTotal();
      return `<div class="tile ${sz} tlink tfin" data-tileid="${b.id}" style="--tc:${c}">${head}
        <div class="lrow"><span>🤝 Чистий баланс боргів</span><b style="color:${net<0?'var(--owe)':'var(--owed)'}">${(net>0?'+':'')+fmt(net)} ₴</b></div>
        <div class="lrow"><span>🧾 Витрачено всього</span><b>${fmt(spent)} ₴</b></div>
        <div class="fin-btns">
          <button class="fin-btn" data-finopen="debts">🤝 Борги</button>
          <button class="fin-btn" data-finopen="spend">🧾 Витрати</button>
        </div></div>`;
    }
    if(b.type==='envelope'){
      const env = b.envId ? envelopes.find(e=>String(e.id)===String(b.envId)) : null;
      if(env){
        const sv=envSaved(env), pct=env.goal?Math.min(100,Math.round(sv/env.goal*100)):0;
        const col=env.color||'#c77dff';
        const cover=env.cover||env.wishImg||'';
        const kind=env.kind||(env.wishId?'мрія':'ціль');
        return `<div class="tile ${sz} tlink tenv" data-tileid="${b.id}" data-envwopen="${env.id}" style="--tc:${col}">${head}
          <div class="tenv-card" style="--ec:${col}">
            ${cover?`<div class="tenv-cover" style="background-image:url('${esc(cover)}')"></div>`:''}
            <div class="tenv-water" style="height:${pct}%"></div>
            <div class="tenv-top"><span class="tenv-em">${env.emoji||'✉️'}</span><span class="tenv-pct">${pct}%</span></div>
            <div class="tenv-nm">${esc(env.name)}</div>
            <div class="tenv-amt">${fmt(sv)} / ${fmt(env.goal||0)} ₴ · 🎯 ${esc(kind)}</div>
          </div>
          <div class="fin-btns">
            <button class="fin-btn" data-envwadd="${env.id}|in">+ Поповнити</button>
            <button class="fin-btn" data-envwadd="${env.id}|out">− Витрата</button>
          </div></div>`;
      }
      // не привʼязаний — зведення по всіх конвертах + вибір
      const tot=envTotalSaved(), goalSum=envelopes.reduce((s,e)=>s+(+e.goal||0),0);
      const pct=goalSum?Math.round(tot/goalSum*100):0;
      return `<div class="tile ${sz} tlink tenv" data-tileid="${b.id}" style="--tc:#c77dff">${head}
        <div class="lrow"><span>✉️ Накопичено у конвертах</span><b>${fmt(tot)} ₴</b></div>
        <div class="fh-env-bar" style="margin:4px 0 8px"><i style="width:${pct}%;background:#c77dff"></i></div>
        <div class="lrow"><span>Ціль усього</span><b>${fmt(goalSum)} ₴ · ${pct}%</b></div>
        <div class="fin-btns">
          <button class="fin-btn" data-envwlink="${b.id}">🔗 Привʼязати</button>
          <button class="fin-btn" data-envwnew="${b.id}">＋ Новий конверт</button>
        </div></div>`;
    }
    if(b.type==='project'){
      return projectWidgetHtml(b, sz, head);
    }
    if(b.type==='kanban')   return kanbanWidgetHtml(b, sz, head);
    if(b.type==='contacts') return contactsWidgetHtml(b, sz, head);
    if(b.type==='caseline') return caselineWidgetHtml(b, sz, head);
    if(b.type==='festival') return festivalWidgetHtml(b, sz, head);
    if(b.type==='bento'){
      const secs=bentoSectionsHtml(b);
      return `<div class="tile ${sz} tbento" data-tileid="${b.id}" style="--tc:${c}">${head}
        ${secs}
        <div class="bn-addbar">
          <button data-bnadd="${b.id}|text">＋ Текст</button>
          <button data-bnadd="${b.id}|check">＋ Чек-лист</button>
          <button data-bnadd="${b.id}|link">＋ Посилання</button>
          <button data-bnadd="${b.id}|divider">＋ Розділювач</button>
        </div></div>`;
    }
    return '';
  }

  // ставить курсор у новий редагований пункт після ререндера
  function focusItem(sel){
    requestAnimationFrame(()=>{
      const el=document.querySelector(sel); if(!el) return;
      el.focus();
      try{ const r=document.createRange(); r.selectNodeContents(el); r.collapse(false);
        const s=getSelection(); s.removeAllRanges(); s.addRange(r); }catch(_){}
    });
  }

  function bindTiles(){
    const board=document.getElementById('board');
    // menu toggle (⋮) — open/close control bar
    (window.__btRoot||board).querySelectorAll('[data-menu]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const tile=el.closest('.tile');
      if(tile && tile.dataset.tileid){ openRadialMenu(tile); return; }
      // запасний шлях (нетипові картки без tileid) — стара поведінка
      const wasOpen=tile.classList.contains('menu-open');
      (window.__btRoot||board).querySelectorAll('.tile.menu-open').forEach(t=>t.classList.remove('menu-open'));
      if(!wasOpen) tile.classList.add('menu-open');
    });
    // collapse toggle
    (window.__btRoot||board).querySelectorAll('[data-collapse]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const b=getBlock(el.dataset.collapse);
      if(b){ b.collapsed=!b.collapsed; saveBoard(); renderBoard(); }
    });
    // pin to top
    (window.__btRoot||board).querySelectorAll('[data-pin]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const b=getBlock(el.dataset.pin);
      if(b){ b.pinned=!b.pinned; resortPinned(); saveBoard(); renderBoard(); }
    });
    // duplicate
    (window.__btRoot||board).querySelectorAll('[data-dup]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const arr=findParentArr(curBoard(),el.dataset.dup); if(!arr) return;
      const i=arr.findIndex(x=>String(x.id)===el.dataset.dup);
      if(i<0) return;
      const copy=JSON.parse(JSON.stringify(arr[i]));
      const reid=o=>{ o.id=Date.now()+Math.random()*1e6; if(isContainer(o)&&Array.isArray(o.children)) o.children.forEach(reid); };
      reid(copy); copy.pinned=false;
      arr.splice(i+1,0,copy); syncBlocks(); saveBoard(); renderBoard();
    });
    // progress slider
    (window.__btRoot||board).querySelectorAll('[data-prog]').forEach(el=>el.oninput=()=>{
      const b=getBlock(el.dataset.prog);
      if(b){ b.value=parseInt(el.value)||0;
        const tile=el.closest('.tile');
        const bar=tile.querySelector('.progbar i'); const val=tile.querySelector('.progval');
        if(bar)bar.style.width=b.value+'%'; if(val)val.textContent=b.value+'%';
        saveBoard(); }
    });
    // progress preset chips
    (window.__btRoot||board).querySelectorAll('[data-progset]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,p]=el.dataset.progset.split('|'); const b=getBlock(bid);
      if(b){ b.value=parseInt(p)||0; saveBoard(); renderBoard(); }
    });
    // ── віджети проєктів ──
    // виконати наступний крок проєкту прямо з віджета
    (window.__btRoot||board).querySelectorAll('[data-wpnext]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [,k]=el.dataset.wpnext.split('|');
      const txt=completeFolderNextStep(k);
      if(txt!==null){ window.platform.haptic('medium'); renderBoard(); }
    });
    // фокус-стек: пізніше / зроблено / спочатку
    (window.__btRoot||board).querySelectorAll('[data-wstack]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const parts=el.dataset.wstack.split('|'); const b=getBlock(parts[0]); if(!b) return;
      if(parts[1]==='reset'){ b.idx=0; }
      else if(parts[1]==='done'){ completeFolderNextStep(parts[2]); b.idx=(parseInt(b.idx)||0)+1; window.platform.haptic('medium'); }
      else { b.idx=(parseInt(b.idx)||0)+1; window.platform.haptic('light'); }
      saveBoard(); renderBoard();
    });
    // пайплайн: тап по картці → наступний статус
    (window.__btRoot||board).querySelectorAll('[data-wpipe]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const k=el.dataset.wpipe; const f=folders[k]; if(!f) return;
      const idx=PROJECT_STATUSES.findIndex(x=>x[0]===(f.status||'active'));
      f.status=PROJECT_STATUSES[(idx+1)%PROJECT_STATUSES.length][0];
      saveFolders(); window.platform.haptic('select');
      try{ renderDashboard(); }catch(_){}
      renderBoard();
    });
    // перехід у папку з віджета
    (window.__btRoot||board).querySelectorAll('[data-wgo]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      goFolder(el.dataset.wgo);
    });
    (window.__btRoot||board).querySelectorAll('[data-wplan]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const raw=el.dataset.wplan; const sep=raw.indexOf('|');
      const md=raw.slice(0,sep), fk=raw.slice(sep+1);
      try{ if(md==='day') plFolderDaySheet(fk); else plFolderMonthSheet(fk); }catch(err){ console.error('wplan',err); }
    });
    // task priority
    (window.__btRoot||board).querySelectorAll('[data-prio]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,p]=el.dataset.prio.split('|'); const b=getBlock(bid);
      if(b){ b.prio = (b.prio===p?'none':p); saveBoard(); renderBoard(); }
    });
    // quote author
    (window.__btRoot||board).querySelectorAll('[data-qauthor]').forEach(el=>el.onblur=()=>{
      const b=getBlock(el.dataset.qauthor); if(b){ b.author=el.value; saveBoard(); }
    });
    // checklist: clear done
    (window.__btRoot||board).querySelectorAll('[data-clrdone]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const b=getBlock(el.dataset.clrdone);
      if(b){ b.items=b.items.filter(i=>!i.done); if(!b.items.length)b.items.push({id:Date.now(),text:'',done:false});
        saveBoard(); renderBoard(); }
    });
    // calendar: toggle day mark
    (window.__btRoot||board).querySelectorAll('[data-cal]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,ds]=el.dataset.cal.split('|'); const b=getBlock(bid);
      if(!b) return; if(!b.marks)b.marks={};
      if(b.marks[ds]) delete b.marks[ds]; else b.marks[ds]=true;
      el.classList.toggle('on'); saveBoard();
    });
    // calendar: month nav
    (window.__btRoot||board).querySelectorAll('[data-calnav]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,dir]=el.dataset.calnav.split('|'); const b=getBlock(bid);
      if(!b) return; const ym=b.ym||ymLocal();
      let [y,m]=ym.split('-').map(Number); m+=parseInt(dir);
      if(m<1){m=12;y--;} if(m>12){m=1;y++;}
      b.ym=`${y}-${String(m).padStart(2,'0')}`; saveBoard(); renderBoard();
    });
    // countdown: target date + label
    (window.__btRoot||board).querySelectorAll('[data-cdtarget]').forEach(el=>el.onchange=()=>{
      const b=getBlock(el.dataset.cdtarget); if(b){ b.target=el.value; saveBoard(); renderBoard(); }
    });
    (window.__btRoot||board).querySelectorAll('[data-cdlabel]').forEach(el=>el.onblur=()=>{
      const b=getBlock(el.dataset.cdlabel); if(b){ b.label=el.value; saveBoard(); }
    });
    // toggle block open/close
    (window.__btRoot||board).querySelectorAll('[data-toggleblk]').forEach(el=>el.onclick=(e)=>{
      if(e.target.closest('[contenteditable]')) return;
      const b=getBlock(el.dataset.toggleblk); if(b){ b.open=!b.open; saveBoard(); renderBoard(); }
    });
    // numlist edit/add/del
    (window.__btRoot||board).querySelectorAll('[data-numlist]').forEach(el=>{
      el.onblur=()=>{
        const [bid,i]=el.dataset.numlist.split('|'); const b=getBlock(bid);
        if(b&&b.items){ b.items[parseInt(i)]=el.textContent; saveBoard(); }
      };
      el.onkeydown=e=>{
        if(e.key==='Enter'){ e.preventDefault(); el.blur();
          const [bid,i]=el.dataset.numlist.split('|'); const b=getBlock(bid);
          if(b){ if(!b.items)b.items=[]; const at=parseInt(i)+1; b.items.splice(at,0,''); saveBoard(); renderBoard();
            focusItem('[data-numlist="'+bid+'|'+at+'"]'); }
        }
      };
    });
    (window.__btRoot||board).querySelectorAll('[data-numadd]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const b=getBlock(el.dataset.numadd); if(b){ if(!b.items)b.items=[]; b.items.push(''); saveBoard(); renderBoard(); }
    });
    (window.__btRoot||board).querySelectorAll('[data-numdel]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,i]=el.dataset.numdel.split('|'); const b=getBlock(bid);
      if(b&&b.items){ b.items.splice(parseInt(i),1); if(!b.items.length)b.items=['']; saveBoard(); renderBoard(); }
    });
    // size buttons
    (window.__btRoot||board).querySelectorAll('[data-size]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,s]=el.dataset.size.split('|'); const b=getBlock(bid);
      if(b){
        if(s==='auto'){ b.size = (b.size==='auto'?'w':'auto'); }
        else { b.size = (b.size===s? (s==='s'?'w':'s') : s); }
        saveBoard(); renderBoard();
      }
    });
    // move up/down
    (window.__btRoot||board).querySelectorAll('[data-mv]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,dir]=el.dataset.mv.split('|');
      const arr=findParentArr(curBoard(),bid); if(!arr) return;
      const i=arr.findIndex(x=>String(x.id)===bid);
      if(i<0) return;
      const j = dir==='up'? i-1 : i+1;
      if(j<0||j>=arr.length) return;
      [arr[i],arr[j]]=[arr[j],arr[i]]; saveBoard(); renderBoard();
    });
    // ── КНИГА: відкрити читалку / завантажити файл ──
    (window.__btRoot||board).querySelectorAll('[data-bookopen]').forEach(el=>el.onclick=e=>{
      if(e.target.closest('button,.draghandle,.cardtitle,input,.bookc-author')) return;
      e.stopPropagation();
      const b=getBlock(el.dataset.bookopen);
      if(!b) return;
      if(b.bookId) openReader(b.id);
      else pickBookFile(b.id);
    });
    (window.__btRoot||board).querySelectorAll('[data-bookfile]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); pickBookFile(el.dataset.bookfile);
    });
    (window.__btRoot||board).querySelectorAll('[data-bookauthor]').forEach(el=>el.oninput=e=>{
      const b=getBlock(el.dataset.bookauthor); if(b){ b.author=e.target.value; saveBoard(); }
    });
    // ── ПАПКИ: відкрити (зайти всередину) ──
    (window.__btRoot||board).querySelectorAll('[data-grpopen]').forEach(el=>el.onclick=e=>{
      if(e.target.closest('button,.draghandle,.cardtitle,input,.card-icobtn')) return;
      if(window.__justDragged){ window.__justDragged=false; return; } // не відкривати одразу після перетягування
      e.stopPropagation();
      folderPath.push(el.dataset.grpopen);
      board.scrollTop=0; window.scrollTo({top:0});
      renderBoard();
      window.platform.haptic('light');
    });
    // хлібні крихти: перехід на потрібний рівень
    (window.__btRoot||board).querySelectorAll('[data-crumb]').forEach(el=>el.onclick=()=>{
      const i=parseInt(el.dataset.crumb);
      folderPath = i<0 ? [] : folderPath.slice(0,i+1);
      renderBoard();
    });
    // delete
    (window.__btRoot||board).querySelectorAll('[data-del]').forEach(el=>el.onclick=e=>{e.stopPropagation();delBlock(el.dataset.del);});
    (window.__btRoot||board).querySelectorAll('[data-remind]').forEach(el=>el.onclick=e=>{e.stopPropagation();setTaskReminder(el.dataset.remind);});
    // title + text inputs
    (window.__btRoot||board).querySelectorAll('.tt[data-f]').forEach(el=>el.onblur=()=>{ const b=getBlock(el.dataset.id); if(b){b.title=el.value;saveBoard();} });
    // назви папок/сторінок (input у картці) — зберігаємо без перерендеру, лишаємо фокус
    (window.__btRoot||board).querySelectorAll('.cardtitle[data-f]').forEach(el=>{
      el.onpointerdown=e=>e.stopPropagation();   // не запускати drag/open
      el.onclick=e=>e.stopPropagation();
      el.onblur=()=>{ const b=getBlock(el.dataset.id); if(b){ b.title=el.value; saveBoard(); const sub=el.parentElement.querySelector('.grpc-sub,.pgc-sub'); } };
      el.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); el.blur(); } };
    });
    (window.__btRoot||board).querySelectorAll('[contenteditable][data-f]').forEach(el=>el.onblur=()=>{ const b=getBlock(el.dataset.id); if(b){ if(el.dataset.f==='html'){ b.html=sanitizeRich(el.innerHTML); b.text=el.innerText; } else { b[el.dataset.f]=el.innerText; } saveBoard(); } });
    // checklist toggles
    (window.__btRoot||board).querySelectorAll('[data-chk]').forEach(el=>el.onclick=()=>{
      const [bid,iid]=el.dataset.chk.split('|'); const b=getBlock(bid); const it=b.items.find(x=>String(x.id)===iid);
      if(it){ it.done=!it.done; saveBoard(); renderBoard(); }
    });
    (window.__btRoot||board).querySelectorAll('[data-ci]').forEach(el=>{
      el.onblur=()=>{
        const [bid,iid]=el.dataset.ci.split('|'); const b=getBlock(bid); const it=b.items.find(x=>String(x.id)===iid);
        if(it){ it.text=el.innerText; saveBoard(); }
      };
      el.onkeydown=e=>{
        if(e.key==='Enter'){ e.preventDefault(); el.blur();
          const [bid]=el.dataset.ci.split('|'); const b=getBlock(bid);
          if(b){ const ni={id:Date.now(),text:'',done:false}; b.items.push(ni); saveBoard(); renderBoard();
            focusItem('[data-ci="'+bid+'|'+ni.id+'"]'); }
        }
      };
    });
    (window.__btRoot||board).querySelectorAll('[data-cdel]').forEach(el=>el.onclick=()=>{
      const [bid,iid]=el.dataset.cdel.split('|'); const b=getBlock(bid);
      b.items=b.items.filter(x=>String(x.id)!==iid); if(!b.items.length)b.items.push({id:Date.now(),text:'',done:false});
      saveBoard(); renderBoard();
    });
    (window.__btRoot||board).querySelectorAll('[data-addci]').forEach(el=>el.onclick=()=>{
      const b=getBlock(el.dataset.addci); b.items.push({id:Date.now(),text:'',done:false}); saveBoard(); renderBoard();
    });
    // ===== BENTO MIX section handlers =====
    const bnSec=(bid,sid)=>{ const b=getBlock(bid); const s=b&&Array.isArray(b.sections)&&b.sections.find(x=>String(x.id)===String(sid)); return [b,s]; };
    // спільна логіка: додати секцію типу в блок
    function addSectionTo(bid,type){
      const b=getBlock(bid); if(!b) return;
      if(!Array.isArray(b.sections))b.sections=[];
      const sec={id:Date.now()+Math.random(),type};
      if(type==='text')sec.text='';
      if(type==='check')sec.items=[{id:Date.now(),text:'',done:false}];
      if(type==='link'){sec.url='';sec.label='';}
      b.sections.push(sec); syncBlocks(); saveBoard(); renderBoard();
    }
    // водяний «＋» → компактне міні-меню з 4 типів (вкладаються в цей блок)
    (window.__btRoot||board).querySelectorAll('[data-bentoadd]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      openBentoPop(el, el.dataset.bentoadd, addSectionTo);
    });
    // add section (addbar бенто-блока)
    (window.__btRoot||board).querySelectorAll('[data-bnadd]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,type]=el.dataset.bnadd.split('|');
      addSectionTo(bid,type);
    });
    // delete section
    (window.__btRoot||board).querySelectorAll('[data-bnsecdel]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,sid]=el.dataset.bnsecdel.split('|'); const b=getBlock(bid);
      if(b&&Array.isArray(b.sections)){ b.sections=b.sections.filter(s=>String(s.id)!==String(sid)); saveBoard(); renderBoard(); }
    });
    // text edit
    (window.__btRoot||board).querySelectorAll('[data-bntext]').forEach(el=>el.onblur=()=>{
      const [bid,sid]=el.dataset.bntext.split('|'); const [,s]=bnSec(bid,sid);
      if(s){ s.text=el.innerText; saveBoard(); }
    });
    // check toggle
    (window.__btRoot||board).querySelectorAll('[data-bnckdone]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,sid,iid]=el.dataset.bnckdone.split('|'); const [,s]=bnSec(bid,sid);
      const it=s&&(s.items||[]).find(x=>String(x.id)===String(iid));
      if(it){ it.done=!it.done; saveBoard(); renderBoard(); }
    });
    // check text edit + Enter
    (window.__btRoot||board).querySelectorAll('[data-bncktext]').forEach(el=>{
      el.onblur=()=>{ const [bid,sid,iid]=el.dataset.bncktext.split('|'); const [,s]=bnSec(bid,sid);
        const it=s&&(s.items||[]).find(x=>String(x.id)===String(iid)); if(it){ it.text=el.innerText; saveBoard(); } };
      el.onkeydown=ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); el.blur();
        const [bid,sid]=el.dataset.bncktext.split('|'); const [,s]=bnSec(bid,sid);
        if(s){ if(!s.items)s.items=[]; s.items.push({id:Date.now(),text:'',done:false}); saveBoard(); renderBoard(); } } };
    });
    // check add
    (window.__btRoot||board).querySelectorAll('[data-bnckadd]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,sid]=el.dataset.bnckadd.split('|'); const [,s]=bnSec(bid,sid);
      if(s){ if(!s.items)s.items=[]; s.items.push({id:Date.now(),text:'',done:false}); saveBoard(); renderBoard(); }
    });
    // check delete
    (window.__btRoot||board).querySelectorAll('[data-bnckdel]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [bid,sid,iid]=el.dataset.bnckdel.split('|'); const [,s]=bnSec(bid,sid);
      if(s){ s.items=(s.items||[]).filter(x=>String(x.id)!==String(iid)); if(!s.items.length)s.items.push({id:Date.now(),text:'',done:false}); saveBoard(); renderBoard(); }
    });
    // link url commit
    (window.__btRoot||board).querySelectorAll('[data-bnlkurl]').forEach(el=>el.onblur=()=>{
      const [bid,sid]=el.dataset.bnlkurl.split('|'); const [,s]=bnSec(bid,sid);
      if(s){ s.url=el.value; saveBoard(); renderBoard(); }
    });
    // link re-edit
    (window.__btRoot||board).querySelectorAll('[data-bnlkedit]').forEach(el=>el.onclick=e=>{
      if(e.target.closest('a'))return;
      const [bid,sid]=el.dataset.bnlkedit.split('|'); const [,s]=bnSec(bid,sid);
      if(s){ s.url=''; saveBoard(); renderBoard(); }
    });
    // task
    (window.__btRoot||board).querySelectorAll('[data-tdone]').forEach(el=>el.onclick=()=>{ const b=getBlock(el.dataset.tdone); b.done=!b.done; saveBoard(); renderBoard(); });
    (window.__btRoot||board).querySelectorAll('[data-due]').forEach(el=>el.onchange=()=>{ const b=getBlock(el.dataset.due); b.due=el.value; saveBoard(); });
    // list (bulleted)
    (window.__btRoot||board).querySelectorAll('[data-li]').forEach(el=>{
      el.onblur=()=>{
        const [bid,iid]=el.dataset.li.split('|'); const b=getBlock(bid); const it=b.items.find(x=>String(x.id)===iid);
        if(it){ it.text=el.innerText; saveBoard(); }
      };
      el.onkeydown=e=>{
        if(e.key==='Enter'){ e.preventDefault(); el.blur();
          const [bid]=el.dataset.li.split('|'); const b=getBlock(bid);
          if(b){ const ni={id:Date.now(),text:''}; b.items.push(ni); saveBoard(); renderBoard();
            focusItem('[data-li="'+bid+'|'+ni.id+'"]'); }
        }
      };
    });
    (window.__btRoot||board).querySelectorAll('[data-ldel]').forEach(el=>el.onclick=()=>{
      const [bid,iid]=el.dataset.ldel.split('|'); const b=getBlock(bid);
      b.items=b.items.filter(x=>String(x.id)!==iid); if(!b.items.length)b.items.push({id:Date.now(),text:''});
      saveBoard(); renderBoard();
    });
    (window.__btRoot||board).querySelectorAll('[data-addli]').forEach(el=>el.onclick=()=>{
      const b=getBlock(el.dataset.addli); b.items.push({id:Date.now(),text:''}); saveBoard(); renderBoard();
    });
    // link
    (window.__btRoot||board).querySelectorAll('[data-linkurl]').forEach(el=>el.onblur=()=>{
      const b=getBlock(el.dataset.linkurl); let u=el.value.trim();
      if(u&&!/^https?:\/\//.test(u)) u='https://'+u;
      b.url=u; if(u) b.editing=false; saveBoard(); renderBoard();
    });
    (window.__btRoot||board).querySelectorAll('[data-linklabel]').forEach(el=>el.onblur=()=>{
      const b=getBlock(el.dataset.linklabel); b.label=el.value.trim(); saveBoard(); renderBoard();
    });
    (window.__btRoot||board).querySelectorAll('[data-linkedit]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.linkedit);
      if(b){ b.editing=true; saveBoard(); renderBoard(); }
    });
    (window.__btRoot||board).querySelectorAll('[data-linkdone]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.linkdone);
      if(b){ b.editing=false; saveBoard(); renderBoard(); }
    });
    // відкривати посилання через Telegram, якщо доступно (інакше — звичайна вкладка)
    (window.__btRoot||board).querySelectorAll('[data-linkopen]').forEach(el=>el.onclick=e=>{
      const b=getBlock(el.dataset.linkopen); if(!b||!b.url) return;
      e.preventDefault(); window.platform.openLink(b.url);
    });
    // table
    (window.__btRoot||board).querySelectorAll('[data-tcol]').forEach(el=>el.onblur=()=>{
      const [bid,ci]=el.dataset.tcol.split('|'); const b=getBlock(bid); b.cols[+ci]=el.value; saveBoard();
    });
    (window.__btRoot||board).querySelectorAll('[data-tcell]').forEach(el=>el.onblur=()=>{
      const [bid,ri,ci]=el.dataset.tcell.split('|'); const b=getBlock(bid); b.rows[+ri][+ci]=el.value; saveBoard();
    });
    (window.__btRoot||board).querySelectorAll('[data-addrow]').forEach(el=>el.onclick=()=>{
      const b=getBlock(el.dataset.addrow); b.rows.push(b.cols.map(()=>'')); saveBoard(); renderBoard();
    });
    (window.__btRoot||board).querySelectorAll('[data-addcol]').forEach(el=>el.onclick=()=>{
      const b=getBlock(el.dataset.addcol); b.cols.push('Колонка'); b.rows.forEach(r=>r.push('')); saveBoard(); renderBoard();
    });
    (window.__btRoot||board).querySelectorAll('[data-trdel]').forEach(el=>el.onclick=()=>{
      const [bid,ri]=el.dataset.trdel.split('|'); const b=getBlock(bid);
      b.rows.splice(+ri,1); if(!b.rows.length)b.rows.push(b.cols.map(()=>'')); saveBoard(); renderBoard();
    });
    // fin link
    (window.__btRoot||board).querySelectorAll('[data-finopen]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      if(el.dataset.finopen==='debts') goDebts();
      if(el.dataset.finopen==='spend') goSpend();
      if(el.dataset.finopen==='envelopes') goEnvelopes();
    });
    // envelope widget: open linked envelope sheet
    (window.__btRoot||board).querySelectorAll('[data-envwopen]').forEach(el=>el.onclick=e=>{
      // тап по картці (не по кнопках) → відкрити аркуш конверта
      if(e.target.closest('[data-envwadd]')) return;
      e.stopPropagation();
      goEnvelopes(); setTimeout(()=>{ try{ openEnvSheet(el.dataset.envwopen); }catch(_){} }, 80);
    });
    // envelope widget: quick top-up / spend right on canvas
    (window.__btRoot||board).querySelectorAll('[data-envwadd]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [id,t]=el.dataset.envwadd.split('|');
      const env=envelopes.find(x=>String(x.id)===String(id)); if(!env) return;
      if(t==='in'){
        inputModal({title:'Поповнити «'+env.name+'» (₴)', placeholder:'Сума', onOk:(v)=>{
          const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
          envAddOp(env,'in',n,'Поповнення'); renderBoard();
        }});
      } else {
        inputModal({title:'Витрата на «'+env.name+'»', placeholder:'На що…', onOk:(label)=>{
          inputModal({title:'Сума (₴)', placeholder:'Напр. 500', onOk:(v)=>{
            const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
            envAddOp(env,'out',n,label||'Витрата'); renderBoard();
          }});
        }});
      }
    });
    // envelope widget: link an envelope to this canvas widget
    (window.__btRoot||board).querySelectorAll('[data-envwlink]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const b=getBlock(el.dataset.envwlink); if(!b) return;
      if(!envelopes.length){ createEnvelopeFor(b); return; }
      pickEnvelopeFor(b);
    });
    // envelope widget: create a new envelope right here and link it
    (window.__btRoot||board).querySelectorAll('[data-envwnew]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const b=getBlock(el.dataset.envwnew); if(!b) return;
      createEnvelopeFor(b);
    });
    // ===== project widget handlers =====
    (window.__btRoot||board).querySelectorAll('[data-pjview]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [id,v]=el.dataset.pjview.split('|');
      const b=getBlock(id); if(!b) return;
      b.pview=+v; saveBoard(); renderBoard();
    });
    (window.__btRoot||board).querySelectorAll('[data-pjsplit]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.pjsplit); if(!b) return;
      projSplitPreset(b);
    });
    (window.__btRoot||board).querySelectorAll('[data-pjadd]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [id,t]=el.dataset.pjadd.split('|');
      const b=getBlock(id); if(!b) return;
      projAddMovement(b,t);
    });
    (window.__btRoot||board).querySelectorAll('[data-pjgot]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const b=getBlock(el.dataset.pjgot); if(!b) return;
      projReceiveExpected(b);
    });
    (window.__btRoot||board).querySelectorAll('[data-pjenv]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const b=getBlock(el.dataset.pjenv); if(!b) return;
      projDistributeToEnvelope(b);
    });
    (window.__btRoot||board).querySelectorAll('[data-pjdel]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const [id,opId]=el.dataset.pjdel.split('|');
      const b=getBlock(id); if(!b) return;
      confirmSheet({title:'Видалити рух?', onOk:()=>{
        const op=(b.ops||[]).find(o=>String(o.id)===String(opId));
        if(op&&op.finOpId) finOps=finOps.filter(f=>f.id!==op.finOpId);
        b.ops=(b.ops||[]).filter(o=>String(o.id)!==String(opId));
        saveBoard(); saveFinOps(); renderBoard();
      }});
    });
    (window.__btRoot||board).querySelectorAll('[data-pjtitle]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const b=getBlock(el.dataset.pjtitle); if(!b) return;
      inputModal({title:'Назва проєкту', value:b.title||'', onOk:(v)=>{ if((v||'').trim()){ b.title=v.trim(); saveBoard(); renderBoard(); } }});
    });
    (window.__btRoot||board).querySelectorAll('[data-pjsetup]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      const b=getBlock(el.dataset.pjsetup); if(!b) return;
      inputModal({title:'Очікуваний дохід ('+(b.cur||'€')+')', value:String(b.expected||0), placeholder:'Напр. 1000', onOk:(v)=>{
        const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,''))||0;
        b.expected=n; if(n>0) b.unlocked=false;
        inputModal({title:'Дедлайн (РРРР-ММ-ДД, або порожньо)', value:b.deadline||'', placeholder:'2026-07-15', onOk:(d)=>{
          d=(d||'').trim();
          b.deadline = /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '';
          saveBoard(); renderBoard();
        }});
      }});
    });

    // ===== ПРОЄКТНІ БЛОКИ: канбан =====
    (window.__btRoot||board).querySelectorAll('[data-kbaddcol]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.kbaddcol); if(!b) return;
      inputModal({title:'Назва колонки', placeholder:'Напр. Аудит', onOk:(v)=>{
        if(!(v||'').trim()) return;
        (b.cols=b.cols||[]).push({id:'kc'+Date.now(),name:v.trim(),cards:[]});
        saveBoard(); renderBoard();
      }});
    });
    (window.__btRoot||board).querySelectorAll('[data-kbaddcard]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [id,colId]=el.dataset.kbaddcard.split('|');
      const b=getBlock(id); if(b) kbwAddCard(b,colId);
    });
    (window.__btRoot||board).querySelectorAll('[data-kbcol]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [id,colId]=el.dataset.kbcol.split('|');
      const b=getBlock(id); if(b) kbwColMenu(b,colId);
    });
    (window.__btRoot||board).querySelectorAll('[data-kbcard]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [id,colId,cardId]=el.dataset.kbcard.split('|');
      const b=getBlock(id); if(b) kbwCardMenu(b,colId,cardId);
    });
    // ===== ПРОЄКТНІ БЛОКИ: контакти =====
    (window.__btRoot||board).querySelectorAll('[data-ctadd]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.ctadd); if(b) ctwAdd(b);
    });
    (window.__btRoot||board).querySelectorAll('[data-ctrow]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [id,pid]=el.dataset.ctrow.split('|');
      const b=getBlock(id); if(b) ctwMenu(b,pid);
    });
    (window.__btRoot||board).querySelectorAll('[data-ctgo]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [id,pid]=el.dataset.ctgo.split('|');
      const b=getBlock(id); const p=b&&(b.people||[]).find(x=>String(x.id)===String(pid));
      if(p) ctwOpenLink(p);
    });
    // ===== ПРОЄКТНІ БЛОКИ: таймлайн справи =====
    (window.__btRoot||board).querySelectorAll('[data-cladd]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.cladd); if(b) clwAdd(b);
    });
    (window.__btRoot||board).querySelectorAll('[data-clev]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [id,evId]=el.dataset.clev.split('|');
      const b=getBlock(id); if(b) clwMenu(b,evId);
    });
    // ===== ПРОЄКТНІ БЛОКИ: фестиваль · подія =====
    (window.__btRoot||board).querySelectorAll('[data-fstsetup],[data-fstsetup2]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.fstsetup||el.dataset.fstsetup2); if(b) fstwSetup(b);
    });
    (window.__btRoot||board).querySelectorAll('[data-fstspend]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.fstspend); if(b) fstwSpend(b);
    });
    (window.__btRoot||board).querySelectorAll('[data-fstadd]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.fstadd); if(!b) return;
      inputModal({title:'Пункт програми', placeholder:'Напр. Забронювати житло', onOk:(v)=>{
        if(!(v||'').trim()) return;
        (b.program=b.program||[]).push({id:'fp'+Date.now(),text:v.trim(),done:false});
        saveBoard(); renderBoard();
      }});
    });
    (window.__btRoot||board).querySelectorAll('[data-fstck]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [id,pid]=el.dataset.fstck.split('|');
      const b=getBlock(id); const p=b&&(b.program||[]).find(x=>String(x.id)===String(pid));
      if(p){ p.done=!p.done; saveBoard(); renderBoard(); window.platform.haptic('select'); }
    });
    (window.__btRoot||board).querySelectorAll('[data-fstdel]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [id,pid]=el.dataset.fstdel.split('|');
      const b=getBlock(id); if(!b) return;
      b.program=(b.program||[]).filter(x=>String(x.id)!==String(pid));
      saveBoard(); renderBoard();
    });

    /* ===== АПГРЕЙДИ БЛОКІВ ===== */
    // NOTE: панель форматування
    (window.__btRoot||board).querySelectorAll('[data-rt]').forEach(el=>el.onmousedown=el.ontouchstart=e=>{
      e.preventDefault(); // не втрачати фокус/виділення
      const [cmd,bid]=el.dataset.rt.split('|');
      const area=board.querySelector('.tnote.rich[data-id="'+bid+'"]');
      if(area) area.focus();
      if(cmd==='bold') document.execCommand('bold');
      else if(cmd==='italic') document.execCommand('italic');
      else if(cmd==='strike') document.execCommand('strikeThrough');
      else if(cmd==='hl') document.execCommand('hiliteColor',false,'rgba(240,180,41,.42)');
      else if(cmd==='clear') document.execCommand('removeFormat');
      const b=getBlock(bid); if(b&&area){ b.html=sanitizeRich(area.innerHTML); b.text=area.innerText; saveBoard(); }
    });
    // CALLOUT: тон + іконка
    (window.__btRoot||board).querySelectorAll('[data-cotone]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [bid,t]=el.dataset.cotone.split('|'); const b=getBlock(bid);
      if(b){ b.tone=t; b.ico=null; saveBoard(); renderBoard(); }
    });
    (window.__btRoot||board).querySelectorAll('[data-coico]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.coico); if(!b) return;
      inputModal({title:'Емодзі для виноски', value:b.ico||'💡', placeholder:'напр. 💡', onOk:(v)=>{ const pick=(v||'').trim().slice(0,2); b.ico=pick||null; saveBoard(); renderBoard(); }});
    });
    // QUOTE: стиль
    (window.__btRoot||board).querySelectorAll('[data-qstyle]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [bid,s]=el.dataset.qstyle.split('|'); const b=getBlock(bid);
      if(b){ b.qstyle=s; saveBoard(); renderBoard(); }
    });
    // LIST: стиль маркера
    (window.__btRoot||board).querySelectorAll('[data-lstyle]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [bid,s]=el.dataset.lstyle.split('|'); const b=getBlock(bid);
      if(b){ b.lstyle=s; saveBoard(); renderBoard(); }
    });
    // PROGRESS: вид
    (window.__btRoot||board).querySelectorAll('[data-pview]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [bid,v]=el.dataset.pview.split('|'); const b=getBlock(bid);
      if(b){ b.pview=v; saveBoard(); renderBoard(); }
    });
    // TASK: підзадачі
    (window.__btRoot||board).querySelectorAll('[data-subadd]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const b=getBlock(el.dataset.subadd); if(!b) return;
      if(!Array.isArray(b.subs)) b.subs=[];
      const ns={id:Date.now()+Math.random(),text:'',done:false}; b.subs.push(ns); saveBoard(); renderBoard();
      focusItem('[data-subtx="'+b.id+'|'+ns.id+'"]');
    });
    (window.__btRoot||board).querySelectorAll('[data-subchk]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [bid,sid]=el.dataset.subchk.split('|'); const b=getBlock(bid);
      const s=b&&b.subs&&b.subs.find(x=>String(x.id)===sid); if(s){ s.done=!s.done; saveBoard(); renderBoard(); }
    });
    (window.__btRoot||board).querySelectorAll('[data-subtx]').forEach(el=>{
      el.onblur=()=>{ const [bid,sid]=el.dataset.subtx.split('|'); const b=getBlock(bid);
        const s=b&&b.subs&&b.subs.find(x=>String(x.id)===sid); if(s){ s.text=el.innerText; saveBoard(); } };
      el.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); el.blur();
        const [bid]=el.dataset.subtx.split('|'); const b=getBlock(bid);
        if(b){ const ns={id:Date.now()+Math.random(),text:'',done:false}; b.subs.push(ns); saveBoard(); renderBoard(); focusItem('[data-subtx="'+bid+'|'+ns.id+'"]'); } } };
    });
    (window.__btRoot||board).querySelectorAll('[data-subdel]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [bid,sid]=el.dataset.subdel.split('|'); const b=getBlock(bid);
      if(b&&b.subs){ b.subs=b.subs.filter(x=>String(x.id)!==sid); saveBoard(); renderBoard(); }
    });
    // TABLE: сортування
    (window.__btRoot||board).querySelectorAll('[data-tsort]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); const [bid,ci]=el.dataset.tsort.split('|'); const b=getBlock(bid); if(!b) return;
      const c=+ci; const dir = (b._sortcol===c && b._sortdir==='asc') ? 'desc' : 'asc';
      b.rows.sort((r1,r2)=>{ const x=String(r1[c]??'').trim(), y=String(r2[c]??'').trim();
        const nx=parseFloat(x.replace(',','.')), ny=parseFloat(y.replace(',','.'));
        let cmp; if(!isNaN(nx)&&!isNaN(ny)) cmp=nx-ny; else cmp=x.localeCompare(y,'uk');
        return dir==='asc'?cmp:-cmp; });
      b._sortcol=c; b._sortdir=dir; saveBoard(); renderBoard();
    });

    // PAGE/GROUP: іконка-емодзі + колір картки
    (window.__btRoot||board).querySelectorAll('[data-cardico]').forEach(el=>el.onclick=e=>{
      e.stopPropagation(); e.preventDefault();
      openCardStyle(el.dataset.cardico, el);
    });

    // PRO-тема: перший закріплений блок стає bento-«героєм» (ширший, з сяйвом)
    try{
      (window.__btRoot||board).querySelectorAll('.tile.is-hero').forEach(t=>t.classList.remove('is-hero'));
      if(document.body.classList.contains('theme-pro') && !isCanvasMode() && viewMode==='grid'){
        const tiles=[...(window.__btRoot||board).querySelectorAll('.tile[data-tileid]')];
        const heroTile=tiles.find(t=>{
          const b=getBlock(t.dataset.tileid);
          return b && b.pinned && !['group','page','divider','head','h1','h2','h3'].includes(b.type) && b.w==null;
        });
        if(heroTile) heroTile.classList.add('is-hero');
      }
    }catch(_){}

    /* ═══ PREMIUM PACK V1 · події ═══ */
    // мінішторка вводу (prompt у Telegram WebView заблоковано)
    function ppAsk(title, ph, val, cb){
      const ov=document.createElement('div'); ov.className='pp-ov';
      ov.innerHTML=`<div class="pp-sheet"><div class="pp-tt">${esc(title)}</div>
        <input class="pp-in" placeholder="${esc(ph||'')}" value="${esc(val||'')}">
        <div class="pp-btns"><button class="pp-c">Скасувати</button><button class="pp-ok">Готово</button></div></div>`;
      document.body.appendChild(ov);
      const inp=ov.querySelector('.pp-in'); setTimeout(()=>inp.focus(),60);
      const close=()=>ov.remove();
      ov.querySelector('.pp-c').onclick=close;
      ov.addEventListener('click',e=>{ if(e.target===ov) close(); });
      const ok=()=>{ const v=inp.value.trim(); close(); if(v) cb(v); };
      ov.querySelector('.pp-ok').onclick=ok;
      inp.onkeydown=e=>{ if(e.key==='Enter') ok(); };
    }
    const PPR=(window.__btRoot||board);
    // heatmap: тап = сьогодні, довгий тап = будь-який день
    PPR.querySelectorAll('[data-hm]').forEach(el=>{
      const [hmBid,hmDs]=el.dataset.hm.split('|');
      let lt=null;
      const toggleHm=()=>{
        const b=getBlock(hmBid); if(!b) return;
        b.marks=b.marks||{};
        b.marks[hmDs]=((b.marks[hmDs]||0)+1)%5;
        el.className='hm-c lv'+(b.marks[hmDs]||0)+(hmDs===ymdLocal()?' hm-t':'');
        try{window.platform.haptic('medium');}catch(_){}
        saveBoard();
        const tile=el.closest('.tile');
        const marks=b.marks, keys=Object.keys(marks).filter(k=>marks[k]>0);
        const f=tile&&tile.querySelector('.hm-foot');
        if(f) f.lastElementChild.textContent=keys.length+' за 12 тиж.';
      };
      el.onpointerdown=e=>{ lt=setTimeout(()=>{ lt=null; toggleHm(); },450); };
      el.onpointerup=e=>{ if(lt){ clearTimeout(lt); lt=null; if(hmDs===ymdLocal()) toggleHm(); } };
      el.onpointercancel=()=>{ if(lt){ clearTimeout(lt); lt=null; } };
    });
    // kpi / chart: додати значення
    PPR.querySelectorAll('[data-kpiadd]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      ppAsk('Нове значення KPI','число, напр. 1250','',v=>{
        const b=getBlock(el.dataset.kpiadd); if(!b) return;
        b.points=b.points||[]; b.points.push({d:ymdLocal(),v:parseFloat(v.replace(',','.'))||0});
        saveBoard(); renderBoard(); });
    });
    PPR.querySelectorAll('[data-chadd]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      ppAsk('Точка графіка','мітка | число  (напр. Пн | 4)','',v=>{
        const b=getBlock(el.dataset.chadd); if(!b) return;
        const parts=v.split('|').map(s=>s.trim());
        const lab=parts.length>1?parts[0]:''; const num=parts.length>1?parts[1]:parts[0];
        b.points=b.points||[]; b.points.push({l:lab,v:parseFloat(String(num).replace(',','.'))||0});
        saveBoard(); renderBoard(); });
    });
    PPR.querySelectorAll('[data-chview]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const [cvBid,cvV]=el.dataset.chview.split('|'); const b=getBlock(cvBid);
      if(b){ b.view=cvV; try{window.platform.haptic('select');}catch(_){} saveBoard(); renderBoard(); }
    });
    // tabs
    PPR.querySelectorAll('[data-tab]').forEach(el=>{
      const [tbBid,tbI]=el.dataset.tab.split('|');
      let lt=null, fired=false;
      el.onpointerdown=()=>{ fired=false; lt=setTimeout(()=>{ lt=null; fired=true;
        const b0=getBlock(tbBid); if(!b0||!b0.tabs||!b0.tabs[tbI]) return;
        ppAsk('Назва вкладки','', b0.tabs[tbI].name||'', v=>{
          const b=getBlock(tbBid); if(b&&b.tabs[tbI]){ b.tabs[tbI].name=v; saveBoard(); renderBoard(); } }); },450); };
      el.onpointerup=el.onpointercancel=()=>{ if(lt){clearTimeout(lt);lt=null;} };
      el.onclick=e=>{ e.stopPropagation(); if(fired) return;
        const b=getBlock(tbBid);
        if(b){ b.ti=parseInt(tbI); try{window.platform.haptic('select');}catch(_){} saveBoard(); renderBoard(); } };
    });
    PPR.querySelectorAll('[data-tabadd]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const b=getBlock(el.dataset.tabadd); if(!b) return;
      b.tabs=b.tabs||[]; b.tabs.push({name:'Таб '+(b.tabs.length+1),text:''}); b.ti=b.tabs.length-1;
      saveBoard(); renderBoard(); });
    PPR.querySelectorAll('[data-tabtxt]').forEach(el=>{
      el.onpointerdown=e=>e.stopPropagation();
      el.onblur=()=>{
        const [ttBid,ttI]=el.dataset.tabtxt.split('|'); const b=getBlock(ttBid);
        if(b&&b.tabs&&b.tabs[ttI]){ b.tabs[ttI].text=el.textContent; saveBoard(); } };
    });
    // accordion
    PPR.querySelectorAll('[data-acc]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const [acBid,acI]=el.dataset.acc.split('|'); const b=getBlock(acBid);
      if(b&&b.secs&&b.secs[acI]){ b.secs[acI].open=b.secs[acI].open?0:1;
        const sec=el.closest('.ac-sec'); if(sec) sec.classList.toggle('open');
        try{window.platform.haptic('light');}catch(_){} saveBoard(); } });
    PPR.querySelectorAll('[data-accadd]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const b=getBlock(el.dataset.accadd); if(!b) return;
      b.secs=b.secs||[]; b.secs.push({name:'Секція '+(b.secs.length+1),text:'',open:1});
      saveBoard(); renderBoard(); });
    PPR.querySelectorAll('[data-acctxt]').forEach(el=>{
      el.onpointerdown=e=>e.stopPropagation();
      el.onblur=()=>{
        const [atBid,atI]=el.dataset.acctxt.split('|'); const b=getBlock(atBid);
        if(b&&b.secs&&b.secs[atI]){ b.secs[atI].text=el.textContent; saveBoard(); } };
    });
    // code
    PPR.querySelectorAll('[data-cdlang]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const [clBid,clL]=el.dataset.cdlang.split('|'); const b=getBlock(clBid);
      if(b){ b.lang=clL; saveBoard(); renderBoard(); } });
    PPR.querySelectorAll('[data-cdcopy]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const b=getBlock(el.dataset.cdcopy); if(!b) return;
      try{ navigator.clipboard.writeText(b.text||''); el.textContent='✓ скопійовано';
        setTimeout(()=>{el.textContent='копіювати';},1200);
        window.platform.haptic('medium'); }catch(_){} });
    PPR.querySelectorAll('[data-cdedit]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const b=getBlock(el.dataset.cdedit); if(!b) return;
      const ov=document.createElement('div'); ov.className='pp-ov';
      const ta=document.createElement('textarea'); ta.className='pp-ta'; ta.value=b.text||'';
      const sheet=document.createElement('div'); sheet.className='pp-sheet';
      sheet.innerHTML=`<div class="pp-tt">Код (${esc(b.lang||'js')})</div>`;
      const btns=document.createElement('div'); btns.className='pp-btns';
      btns.innerHTML=`<button class="pp-c">Скасувати</button><button class="pp-ok">Зберегти</button>`;
      sheet.appendChild(ta); sheet.appendChild(btns); ov.appendChild(sheet);
      document.body.appendChild(ov);
      btns.querySelector('.pp-c').onclick=()=>ov.remove();
      ov.addEventListener('click',ev=>{ if(ev.target===ov) ov.remove(); });
      btns.querySelector('.pp-ok').onclick=()=>{ b.text=ta.value; ov.remove(); saveBoard(); renderBoard(); }; });
    // embed
    PPR.querySelectorAll('[data-emset]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      ppAsk('Посилання YouTube','https://youtu.be/…','',v=>{
        const b=getBlock(el.dataset.emset); if(b){ b.url=v; b.play=0; saveBoard(); renderBoard(); } }); });
    PPR.querySelectorAll('[data-emplay]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const b=getBlock(el.dataset.emplay);
      if(b){ b.play=1; renderBoard(); b.play=0; /* play не зберігаємо: після перезапуску знову прев'ю */ } });
    // audio
    PPR.querySelectorAll('[data-auset]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      ppAsk('Посилання на mp3','https://…/track.mp3','',v=>{
        const b=getBlock(el.dataset.auset); if(b){ b.url=v; b.name=decodeURIComponent(v.split('/').pop()||'Аудіо'); saveBoard(); renderBoard(); } }); });
    PPR.querySelectorAll('[data-auplay]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const auBid=el.dataset.auplay;
      const au=PPR.querySelector('[data-auel="'+auBid+'"]'); if(!au) return;
      const tile=el.closest('.tile'), bar=tile.querySelector('.au-bar i'), tm=tile.querySelector('.au-time');
      if(au.paused){ au.play(); el.textContent='⏸'; }
      else { au.pause(); el.textContent='▶'; }
      au.ontimeupdate=()=>{ if(au.duration&&bar&&tm){ bar.style.width=(au.currentTime/au.duration*100)+'%';
        const m=Math.floor(au.currentTime/60), s=Math.floor(au.currentTime%60);
        tm.textContent=m+':'+String(s).padStart(2,'0'); } };
      au.onended=()=>{ el.textContent='▶'; if(bar) bar.style.width='0%'; }; });
    PPR.querySelectorAll('[data-auseek]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const au=PPR.querySelector('[data-auel="'+el.dataset.auseek+'"]');
      if(au&&au.duration){ const r=el.getBoundingClientRect();
        au.currentTime=(e.clientX-r.left)/r.width*au.duration; } });
    // focus (pomodoro)
    PPR.querySelectorAll('[data-fctap]').forEach(el=>el.onclick=e=>{ e.stopPropagation();
      const b=getBlock(el.dataset.fctap); if(!b) return;
      const nowT=Date.now();
      if(b.end&&b.end>nowT){ b.end=0; }
      else {
        const mins=b.mode==='rest'?5:25;
        b.end=nowT+mins*60000;
        try{window.platform.haptic('medium');}catch(_){}
      }
      saveBoard(); renderBoard(); });
    // тікер фокуса: 1 інтервал на всі wfocus, точковий апдейт без ререндера
    if(!window.__fcTick){
      window.__fcTick=setInterval(()=>{
        document.querySelectorAll('.tfocus.run').forEach(tile=>{
          let b=null; try{ b=getBlock(tile.dataset.tileid); }catch(_){ }
          if(!b) return;
          const nowT=Date.now();
          if(!b.end||b.end<=nowT){
            if(b.end){
              if(b.mode!=='rest'){ b.done=(b.done||0)+1; b.doneD=ymdLocal(); b.mode='rest'; }
              else b.mode='work';
              b.end=0; try{window.platform.haptic('heavy');}catch(_){}
              try{ saveBoard(); renderBoard(); }catch(_){}
            }
            return;
          }
          const totalT=(b.mode==='rest'?5:25)*60000, left=b.end-nowT;
          const mmF=Math.floor(left/60000), ssF=Math.floor(left%60000/1000);
          const t=tile.querySelector('.fc-time'); if(t) t.textContent=mmF+':'+String(ssF).padStart(2,'0');
          const fg=tile.querySelector('.fc-fg');
          if(fg){ const CIRC=2*Math.PI*34; fg.style.strokeDashoffset=CIRC*(1-left/totalT); }
        });
      },1000);
    }

    applyFreeSizes(board);
    enableTileResize(board);
    enableTileDrag(board);
    if(isCanvasMode()){ setZoom(getZoom(), false); enableCanvasZoom(board); }
  }

