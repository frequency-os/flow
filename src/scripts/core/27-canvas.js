  /* ===== КАНВАС: ЗУМ ЩИПКОМ (два пальці) ===== */
  function enableCanvasZoom(board){
    if(board.__zoomBound) return;   // не навішувати двічі
    board.__zoomBound=true;
    // придушити системне меню iOS (Copy/Look Up/Translate) при утриманні блока,
    // але дозволити його у полях вводу
    board.addEventListener('contextmenu',e=>{
      if(e.target.closest('input,textarea,[contenteditable]')) return;
      e.preventDefault();
      // правий клік (десктоп) по блоку → радіальне меню швидких дій
      const tileEl=e.target.closest('.tile[data-tileid]');
      if(tileEl){ try{ openCanvasRadial(tileEl, e.clientX, e.clientY); }catch(_){} }
    });
    board.addEventListener('selectstart',e=>{
      if(e.target.closest('input,textarea,[contenteditable]')) return;
      e.preventDefault();
    });
    let zooming=false, startDist=0, startZoom=1, badge=null;
    let panning=false, panStartX=0, panStartY=0, panSL=0, panST=0;
    function dist(t){ return Math.hypot(t[0].clientX-t[1].clientX, t[0].clientY-t[1].clientY); }
    function mid(t){ return { clientX:(t[0].clientX+t[1].clientX)/2, clientY:(t[0].clientY+t[1].clientY)/2 }; }
    function showBadge(z){
      if(!badge){ badge=document.createElement('div'); badge.className='canvas-zoom-badge'; document.body.appendChild(badge); }
      badge.textContent=Math.round(z*100)+'%'; badge.classList.add('show');
    }
    function hideBadge(){ if(badge){ badge.classList.remove('show'); } }
    // pan дозволений будь-де, КРІМ ручок перетягування/розміру та полів вводу
    function panAllowed(t){
      return !t.target.closest('.draghandle,.rzhandle,button,input,textarea,select,[contenteditable="true"],a,.bn-waterplus,.tcheck .cb,.tx');
    }

    let panArmed=false; // pan «зведений», але ще не активний поки палець не зрушив
    board.addEventListener('touchstart',e=>{
      if(e.touches.length===2){
        zooming=true; panning=false; panArmed=false;
        startDist=dist(e.touches); startZoom=getZoom();
        board.classList.add('zooming');
        try{ window.platform.lockSwipe(true); }catch(_){}
      } else if(e.touches.length===1 && panAllowed(e)){
        // зводимо pan; активуємо лише коли палець реально посунувся (щоб не зламати тапи)
        panArmed=true; panning=false;
        panStartX=e.touches[0].clientX; panStartY=e.touches[0].clientY;
        panSL=board.scrollLeft; panST=board.scrollTop;
      }
    },{passive:true});

    board.addEventListener('touchmove',e=>{
      if(zooming && e.touches.length===2){
        e.preventDefault();
        const d=dist(e.touches);
        if(startDist>0){ const z=setZoom(startZoom*(d/startDist), false, mid(e.touches)); showBadge(z); }
      } else if((panArmed||panning) && e.touches.length===1){
        if(window.__canvasBlockDragging){ panArmed=false; panning=false; return; }
        const dx=e.touches[0].clientX-panStartX, dy=e.touches[0].clientY-panStartY;
        if(!panning && (Math.abs(dx)>6 || Math.abs(dy)>6)){ panning=true; panArmed=false; }
        if(panning){
          e.preventDefault();
          board.scrollLeft = panSL - dx;
          board.scrollTop  = panST - dy;
          try{ flashMinimap(); }catch(_){}
        }
      }
    },{passive:false});

    function endAll(){
      if(zooming){ zooming=false; board.classList.remove('zooming'); saveCanvasZoom(); hideBadge();
        try{ window.platform.lockSwipe(false); window.platform.haptic('light'); }catch(_){} }
      panning=false; panArmed=false;
    }
    board.addEventListener('touchend',e=>{ if(e.touches.length<2) endAll(); },{passive:true});
    board.addEventListener('touchcancel',endAll,{passive:true});

    // десктоп: зум колесом з Ctrl/⌘, pan колесом
    board.addEventListener('wheel',e=>{
      if(e.ctrlKey || e.metaKey){
        e.preventDefault();
        setZoom(getZoom() * (e.deltaY<0?1.1:0.9), true, {clientX:e.clientX, clientY:e.clientY});
      } else {
        // звичайне колесо = вертикальний скрол полотна (Shift = горизонтальний)
        if(e.shiftKey){ board.scrollLeft += e.deltaY; e.preventDefault(); }
      }
    },{passive:false});

    // десктоп: pan мишею по порожньому/тілу (не за ручки/поля)
    let mPan=false, mSX=0, mSY=0, mSL=0, mST=0;
    board.addEventListener('mousedown',e=>{
      if(e.button!==0) return;
      if(e.target.closest('.draghandle,.rzhandle,button,input,textarea,select,[contenteditable="true"],a,.tx,.tcheck .cb')) return;
      mPan=true; mSX=e.clientX; mSY=e.clientY; mSL=board.scrollLeft; mST=board.scrollTop;
    });
    window.addEventListener('mousemove',e=>{
      if(!mPan || window.__canvasBlockDragging) { if(window.__canvasBlockDragging) mPan=false; return; }
      const dx=e.clientX-mSX, dy=e.clientY-mSY;
      if(Math.abs(dx)>4||Math.abs(dy)>4){ board.classList.add('panning-cursor');
        board.scrollLeft=mSL-dx; board.scrollTop=mST-dy; try{flashMinimap();}catch(_){} }
    });
    window.addEventListener('mouseup',()=>{ mPan=false; board.classList.remove('panning-cursor'); });

    // подвійний тап: по блоку → вписати блок; по порожньому → 100%
    let lastTap=0, lastTarget=null;
    board.addEventListener('pointerup',e=>{
      const now=Date.now();
      if(now-lastTap<300 && lastTarget===e.target){
        const tileEl=e.target.closest('.tile[data-tileid]');
        if(tileEl){ zoomToBlock(tileEl.dataset.tileid); }
        else { setZoom(1,true); }
        lastTap=0; lastTarget=null;
      } else { lastTap=now; lastTarget=e.target; }
    });
  }

  /* ===== КАНВАС: антиколізія — блоки не залазять один на одного ===== */
  // прямокутник блока на полотні
  function canvasRect(b, tile){
    const w = (b.fw!=null? b.fw : 260);
    const h = (b.fh!=null? b.fh : (tile? (tile.offsetHeight||130) : 130));
    return { x:(b.fx||0), y:(b.fy||0), w, h };
  }

  // радіальне меню швидких дій над блоком (long-press у canvas)
  function openCanvasRadial(tile, cx, cy){
    document.querySelectorAll('.canvas-radial').forEach(m=>m.remove());
    const id=tile.dataset.tileid; const b=getBlock(id); if(!b) return;
    try{ window.platform.haptic('medium'); }catch(_){}
    const menu=document.createElement('div'); menu.className='canvas-radial';
    menu.style.left=cx+'px'; menu.style.top=cy+'px';
    menu.innerHTML=`
      <button data-ra="dup" title="Дублювати">⧉</button>
      <button data-ra="front" title="На передній план">⬆</button>
      <button data-ra="pin" title="${b.pinned?'Відкріпити':'Закріпити'}">${b.pinned?'📌':'📍'}</button>
      <button data-ra="del" title="Видалити" style="color:var(--owe)">🗑</button>`;
    document.body.appendChild(menu);
    const close=()=>{ menu.remove(); document.removeEventListener('pointerdown',out,true); };
    const out=ev=>{ if(!menu.contains(ev.target)) close(); };
    setTimeout(()=>document.addEventListener('pointerdown',out,true),30);
    menu.querySelectorAll('[data-ra]').forEach(btn=>btn.onclick=ev=>{
      ev.stopPropagation(); const a=btn.dataset.ra;
      if(a==='dup'){ const copy=JSON.parse(JSON.stringify(b)); copy.id=Date.now()+Math.random();
        copy.fx=(b.fx||0)+24; copy.fy=(b.fy||0)+24; currentLevelArr().push(copy); saveBoard(); renderBoard(); }
      else if(a==='front'){ const arr=currentLevelArr(); const i=arr.findIndex(x=>String(x.id)===String(id));
        if(i>=0){ const [it]=arr.splice(i,1); arr.push(it); saveBoard(); renderBoard(); } }
      else if(a==='pin'){ b.pinned=!b.pinned; saveBoard(); renderBoard(); }
      else if(a==='del'){ const arr=currentLevelArr(); const i=arr.findIndex(x=>String(x.id)===String(id));
        if(i>=0){ arr.splice(i,1); saveBoard(); renderBoard(); } }
      close();
    });
  }

  // вирівнювальні напрямні (Figma-style): лінії при збігу країв/центрів із сусідами
  function clearAlignGuides(){ document.querySelectorAll('.canvas-guide').forEach(g=>g.remove()); }
  function showAlignGuides(board, tile, x, y, w, h){
    clearAlignGuides();
    const inner=board.querySelector('.canvas-inner'); if(!inner) return;
    const TH=4; // поріг прилипання, px
    const myXs=[x, x+w/2, x+w], myYs=[y, y+h/2, y+h];
    const guides=[];
    currentLevelArr().forEach(ob=>{
      if(!ob||ob.fx==null||String(ob.id)===String(tile.dataset.tileid)) return;
      const ow=ob.fw||260, oh=ob.fh||130;
      const oXs=[ob.fx, ob.fx+ow/2, ob.fx+ow], oYs=[ob.fy, ob.fy+oh/2, ob.fy+oh];
      myXs.forEach(mx=>oXs.forEach(ox=>{ if(Math.abs(mx-ox)<=TH) guides.push({type:'v',pos:ox}); }));
      myYs.forEach(my=>oYs.forEach(oy=>{ if(Math.abs(my-oy)<=TH) guides.push({type:'h',pos:oy}); }));
    });
    const seen=new Set();
    guides.forEach(g=>{
      const key=g.type+g.pos; if(seen.has(key))return; seen.add(key);
      const el=document.createElement('div'); el.className='canvas-guide '+g.type;
      if(g.type==='v'){ el.style.left=g.pos+'px'; el.style.top='0'; el.style.height='100%'; }
      else { el.style.top=g.pos+'px'; el.style.left='0'; el.style.width='100%'; }
      inner.appendChild(el);
    });
  }
  function rectsOverlap(a, c, gap){
    gap = gap||0;
    return !( a.x + a.w + gap <= c.x ||
              c.x + c.w + gap <= a.x ||
              a.y + a.h + gap <= c.y ||
              c.y + c.h + gap <= a.y );
  }
  // підсунути блок так, щоб не перекривав інших: спершу пробуємо лишити на місці,
  // інакше шукаємо найближче вільне місце (вниз або вбік), а не лише прямо вниз
  function resolveCanvasCollision(board, movingId, x, y, w, h){
    const GAP=10;
    x = Math.max(0, x);
    y = Math.max(0, y);
    const others=[];
    (window.__btRoot||board).querySelectorAll('.tile[data-tileid]').forEach(t=>{
      if(t.dataset.tileid===String(movingId)) return;
      const ob=getBlock(t.dataset.tileid); if(!ob) return;
      if(ob.fx==null||ob.fy==null) return;
      others.push(canvasRect(ob, t));
    });
    const free=(px,py)=>{ const me={x:px,y:py,w,h};
      for(const o of others){ if(rectsOverlap(me,o,GAP)) return false; } return true; };
    // 1) якщо на місці вільно — лишаємо як є (ручне розташування важливіше за «вирівнювання»)
    if(free(x,y)) return { x:Math.round(x), y:Math.round(y) };
    // 2) пробуємо опустити вниз під найнижчий блок, що заважає (старий, надійний шлях)
    let guard=0, me={x,y,w,h}, moved=true, downY=y;
    while(moved && guard++<200){ moved=false;
      for(const o of others){ if(rectsOverlap(me,o,GAP)){ me.y=o.y+o.h+GAP; downY=me.y; moved=true; } } }
    // 3) також пробуємо посунути вправо/вліво на тому ж рядку — раптом ближче
    let rightX=x;
    { const sorted=others.filter(o=> y<o.y+o.h+GAP && y+h+GAP>o.y).sort((a,b)=>a.x-b.x);
      for(const o of sorted){ if(rightX+w+GAP>o.x && rightX<o.x+o.w+GAP) rightX=o.x+o.w+GAP; } }
    const downOk=free(x,downY), rightOk=free(rightX,y);
    if(downOk && rightOk){
      // обрати ближчий варіант
      return (Math.abs(rightX-x) <= Math.abs(downY-y))
        ? { x:Math.round(rightX), y:Math.round(y) }
        : { x:Math.round(x), y:Math.round(downY) };
    }
    if(rightOk) return { x:Math.round(rightX), y:Math.round(y) };
    return { x:Math.round(x), y:Math.round(downY) };
  }

  /* ===== ВІЛЬНІ РОЗМІРИ: застосувати збережені span(b.w 1..4) та висоту(b.h px) ===== */
  function applyFreeSizes(board){
    if(viewMode==='merged' || viewMode==='shelf') return; // лише в сітці

    // canvas-режим: позиціонуємо плитки за X/Y та шириною/висотою в px
    if(isCanvasMode()){
      const tiles=[...(window.__btRoot||board).querySelectorAll('.tile[data-tileid]')];
      // прибрати залишкові стани drag (помаранчева рамка «перетин»), якщо drag перервався
      (window.__btRoot||board).querySelectorAll('.canvas-blocked,.over-blocked,.canvas-dragging').forEach(t=>{
        t.classList.remove('canvas-blocked','over-blocked','canvas-dragging'); });

      // 1) спершу задаємо ширину всім (щоб виміряти реальну висоту контенту)
      tiles.forEach(tile=>{
        const b=getBlock(tile.dataset.tileid); if(!b) return;
        if(b.fw==null) b.fw = (b.w!=null ? Math.round(b.w*138) : 260);
        // рятуємо блоки, що колись заїхали за лівий/верхній край: повертаємо в видиму зону
        if(b.fx!=null && b.fx<0){ b.fx=0; tile.style.setProperty('--fx','0px'); }
        if(b.fy!=null && b.fy<0){ b.fy=0; tile.style.setProperty('--fy','0px'); }
        // фото без заданої висоти — компактний дефолт, щоб не займало пів-екрана
        if(b.type==='photo' && b.fh==null) b.fh = 240;
        // сторінки та папки без висоти — компактна картка-обкладинка
        if((b.type==='page'||isContainer(b)) && b.fh==null) b.fh = 120;
        tile.style.setProperty('--fw', Math.round(b.fw)+'px');
        if(b.fh!=null){ tile.style.setProperty('--fh', Math.round(b.fh)+'px'); tile.classList.add('has-fh'); }
      });

      // 2) для блоків без координат — акуратне «потокове» укладання, щоб не накладались
      const boardW = board.clientWidth || window.innerWidth;
      const PAD=12, GAP=12, PAD_TOP=76; // PAD_TOP: перший рядок нижче фіксованої шапки екрана
      const cols = boardW < 560 ? 1 : 2;        // на телефоні — одна колонка
      const colY = new Array(cols).fill(PAD_TOP);   // поточна висота-курсор кожної колонки
      const colX = i => PAD + i*( (boardW-PAD*2-GAP*(cols-1))/cols + GAP );

      // КЛЮЧОВЕ: ручні позиції користувача недоторканні. Повний reflow (перепакування
      // всіх блоків у лівий кут) допускається ЛИШЕ ОДИН раз — при першому вході в canvas
      // для цієї дошки. Далі ніколи, навіть якщо координати чомусь скинулись.
      const anyPlaced = tiles.some(t=>{ const b=getBlock(t.dataset.tileid); return b && b.fx!=null && b.fy!=null; });
      window.__canvasJustDropped=false;
      window.__canvasLaidOut = window.__canvasLaidOut || {};
      const alreadyLaid = !!window.__canvasLaidOut[boardKey];
      // reflow тільки якщо: ще жоден блок не має координат І дошку ще не розкладали
      const reflowAll = !anyPlaced && !alreadyLaid;
      if(reflowAll) window.__canvasLaidOut[boardKey]=true;

      let maxR=0, maxXr=0;
      tiles.forEach(tile=>{
        const b=getBlock(tile.dataset.tileid); if(!b) return;
        let assigned=false;   // чи ми ЩОЙНО призначили координати (тоді треба виставити в DOM)
        if(reflowAll){
          // початкове укладання по колонках (лише коли координат ще немає)
          let ci=0; for(let i=1;i<cols;i++) if(colY[i]<colY[ci]) ci=i;
          const h = (b.fh!=null? b.fh : (tile.offsetHeight||130));
          b.fx = Math.round(colX(ci));
          b.fy = Math.round(colY[ci]);
          colY[ci] += h + GAP;
          assigned=true;
        } else if(b.fx==null || b.fy==null){
          // новий блок: класти поряд із наявними, у вільне місце (не в лівий кут)
          let ci=0; for(let i=1;i<cols;i++) if(colY[i]<colY[ci]) ci=i;
          const w=(b.fw!=null?b.fw:260), h=(b.fh!=null?b.fh:(tile.offsetHeight||130));
          const pos=resolveCanvasCollision(board, b.id, Math.round(colX(ci)), Math.round(colY[ci]), w, h);
          b.fx=pos.x; b.fy=pos.y;
          colY[ci]=Math.max(colY[ci], b.fy+h+GAP);
          assigned=true;
        }
        // ВАЖЛИВО: позицію в DOM чіпаємо ЛИШЕ якщо щойно призначили координати.
        // Для вже-розташованих блоків --fx/--fy вже вшиті рендером — НЕ перезаписуємо
        // (це й був ризик стрибка при ре-рендері/тапі).
        if(assigned){
          tile.style.setProperty('--fx', Math.round(b.fx)+'px');
          tile.style.setProperty('--fy', Math.round(b.fy)+'px');
        }
        tile.classList.add('pos-ready');
        maxR = Math.max(maxR, b.fy + (b.fh|| (tile.offsetHeight||130)) );
        maxXr = Math.max(maxXr, b.fx + (b.fw|| (tile.offsetWidth||260)) );
      });
      saveBoard();
      // запас знизу + вбік, щоб полотно скролилось і не обрізало блоки
      const inner=board.querySelector('.canvas-inner');
      if(inner){
        const z=getZoom();
        const logicalH=Math.max(window.innerHeight*0.6, maxR+160);
        const logicalW=Math.max(boardW, maxXr+80);
        inner.style.minHeight=logicalH+'px';
        inner.style.minWidth=logicalW+'px';
        inner.style.setProperty('--cz', z);
        // КЛЮЧОВЕ: transform:scale НЕ впливає на scrollHeight контейнера.
        // Тому при зумі додаємо невидимий розпірник, що дає скрол-контейнеру
        // РЕАЛЬНУ масштабовану висоту/ширину — інакше на 100%+ не доскролити донизу.
        let spacer=board.querySelector('.canvas-scroll-spacer');
        if(!spacer){ spacer=document.createElement('div'); spacer.className='canvas-scroll-spacer';
          spacer.style.cssText='position:absolute;width:1px;height:1px;pointer-events:none;opacity:0;';
          board.appendChild(spacer); }
        // позиція розпірника = масштабований правий-нижній край контенту
        spacer.style.left=Math.round(logicalW*z)+'px';
        spacer.style.top =Math.round(logicalH*z)+'px';
      }
      board.style.minHeight='';
      board.style.minWidth='';
      // міні-мапа + слухач скролу (один раз)
      try{ updateMinimap(); }catch(_){}
      if(!board.__scrollBound){
        board.__scrollBound=true;
        let st=0; board.addEventListener('scroll',()=>{ if(st)return; st=requestAnimationFrame(()=>{ st=0; try{updateMinimap();}catch(_){} }); },{passive:true});
      }
      return;
    }
    board.style.minHeight='';
    board.style.minWidth='';
    try{ const mm=document.getElementById('canvasMinimap'); if(mm) mm.style.display='none'; }catch(_){}

    (window.__btRoot||board).querySelectorAll('.tile[data-tileid]').forEach(tile=>{
      const b=getBlock(tile.dataset.tileid);
      if(!b) return;
      if(['group','page','divider','head','h1','h2','h3'].includes(b.type)) return;
      if(b.w==null && b.h==null) return;
      tile.setAttribute('data-free','');
      tile.classList.remove('sz-s','sz-w','sz-l','sz-xl');
      const maxC = (viewMode==='grid' ? boardCols : 4);
      if(b.w!=null) tile.style.setProperty('--span', Math.max(1,Math.min(maxC,b.w)));
      if(b.h!=null){ tile.style.setProperty('--h', b.h+'px'); tile.classList.add('has-h'); }
    });
  }

  /* поповер: емодзі + колір для папки/сторінки */
  function openCardStyle(id, anchor){
    document.querySelectorAll('.cardstyle-pop').forEach(p=>p.remove());
    const b=getBlock(id); if(!b) return;
    const EMOJI=['📄','📁','🎬','🎥','📸','🔥','💡','📚','💼','🎯','⭐','🚀','💰','🎨','🏆','📊','🗂️','❤️','🧠','⚡'];
    const COLORS=['#7c9cf5','#5b8def','#34c77b','#e8843c','#c77dff','#ff6b9d','#4ecdc4','#f0b429','#ff6b6f','#9b8cff'];
    const pop=document.createElement('div'); pop.className='cardstyle-pop';
    pop.innerHTML=`
      <div class="csp-sec">Іконка</div>
      <div class="csp-emoji">${EMOJI.map(e=>`<button data-e="${e}" class="${b.emoji===e?'on':''}">${e}</button>`).join('')}
        <button data-e="" class="csp-reset ${!b.emoji?'on':''}" title="Стандартна">⟲</button></div>
      <div class="csp-sec">Колір</div>
      <div class="csp-colors">${COLORS.map(c=>`<button data-c="${c}" style="background:${c}" class="${(b.color||'')===c?'on':''}"></button>`).join('')}</div>`;
    document.body.appendChild(pop);
    const r=anchor.getBoundingClientRect();
    pop.style.left=Math.max(10,Math.min(r.left, window.innerWidth-pop.offsetWidth-10))+'px';
    pop.style.top=(r.bottom+8)+'px';
    pop.querySelectorAll('[data-e]').forEach(btn=>btn.onclick=ev=>{ ev.stopPropagation(); b.emoji=btn.dataset.e||null; saveBoard(); pop.remove(); renderBoard(); });
    pop.querySelectorAll('[data-c]').forEach(btn=>btn.onclick=ev=>{ ev.stopPropagation(); b.color=btn.dataset.c; saveBoard(); pop.remove(); renderBoard(); });
    const close=ev=>{ if(!pop.contains(ev.target)){ pop.remove(); document.removeEventListener('pointerdown',close); } };
    setTimeout(()=>document.addEventListener('pointerdown',close),50);
  }

  /* ===== RESIZE: тягнеш кутик ⤡ → ВІЛЬНО міняєш ширину (1..4 колонки) і висоту (px) ===== */
  function enableTileResize(board){
    const COLS=(viewMode==='grid' ? boardCols : 4);
    const onCanvas=isCanvasMode();
    (window.__btRoot||board).querySelectorAll('.tile[data-tileid]').forEach(tile=>{
      const b=getBlock(tile.dataset.tileid);
      if(!b) return;
      // дивайдери/заголовки не змінюють розмір ніде;
      // папки/сторінки — НЕ в сітці (там компактна картка), але НА полотні дозволяємо
      if(['divider','head','h1','h2','h3'].includes(b.type)) return;
      if(!onCanvas && ['group','page'].includes(b.type)) return;
      if(tile.querySelector('.rzhandle')) return;
      const rz=document.createElement('div');
      rz.className='rzhandle'; rz.title='Потягни, щоб змінити розмір'; rz.textContent='⤡';
      tile.appendChild(rz);

      rz.addEventListener('pointerdown',e=>{
        e.preventDefault(); e.stopPropagation();
        const id=tile.dataset.tileid;

        // ── CANVAS: вільна ширина/висота в px (плавно) ──
        if(isCanvasMode()){
          const r=tile.getBoundingClientRect();
          tile.classList.add('resizing'); document.body.classList.add('resizing-block');
          try{ rz.setPointerCapture(e.pointerId); }catch(_){}
          try{ window.platform.lockSwipe(true); }catch(_){}
          let lastW=b.fw!=null?b.fw:Math.round(r.width);
          let lastH=b.fh!=null?b.fh:Math.round(r.height);
          let badge=document.createElement('div'); badge.className='rz-badge';
          const setBadge=()=>{ badge.textContent=lastW+'×'+lastH+'px'; };
          setBadge(); tile.appendChild(badge);
          const czr=getZoom();
          let raf=0;
          const apply=ev=>{
            if(raf) return;
            raf=requestAnimationFrame(()=>{
              raf=0;
              let w=Math.round(Math.max(150, (ev.clientX-r.left)/czr));
              let h=Math.round(Math.max(80,  (ev.clientY-r.top)/czr));
              let changed=false;
              if(Math.abs(w-lastW)>=2){ lastW=w; tile.style.setProperty('--fw',w+'px'); changed=true; }
              if(Math.abs(h-lastH)>=2){ lastH=h; tile.style.setProperty('--fh',h+'px'); tile.classList.add('has-fh'); changed=true; }
              if(changed) setBadge();
            });
          };
          const up=()=>{
            if(raf) cancelAnimationFrame(raf);
            document.removeEventListener('pointermove',apply);
            document.removeEventListener('pointerup',up);
            document.removeEventListener('pointercancel',up);
            tile.classList.remove('resizing'); document.body.classList.remove('resizing-block');
            try{ window.platform.lockSwipe(false); }catch(_){}
            badge.remove();
            const bb=getBlock(id);
            if(bb){ bb.fw=lastW; bb.fh=lastH; saveBoard(); try{window.platform.haptic('light');}catch(_){} }
          };
          document.addEventListener('pointermove',apply,{passive:true});
          document.addEventListener('pointerup',up);
          document.addEventListener('pointercancel',up);
          return;
        }

        // ── СІТКА: ширина по колонках (span), висота в px ──
        // у широкому режимі реальна сітка — .board-inner; інакше сам board
        const gridEl=board.querySelector('.board-inner')||board;
        const bRect=gridEl.getBoundingClientRect();
        const r=tile.getBoundingClientRect();
        // ширина однієї колонки (з урахуванням gap)
        const gap=parseFloat(getComputedStyle(gridEl).columnGap||getComputedStyle(gridEl).gap||'11')||11;
        const colW=(bRect.width-gap*(COLS-1))/COLS;
        tile.setAttribute('data-free','');
        tile.classList.remove('sz-s','sz-w','sz-l','sz-xl');
        tile.classList.add('resizing'); document.body.classList.add('resizing-block');
        try{ rz.setPointerCapture(e.pointerId); }catch(_){}

        let lastSpan = b.w!=null ? Math.max(1,Math.min(COLS,b.w)) : Math.max(1,Math.min(COLS,Math.round((r.width+gap)/(colW+gap))));
        let lastH = b.h!=null ? b.h : Math.round(r.height);
        let badge=document.createElement('div'); badge.className='rz-badge';
        const setBadge=()=>{ badge.textContent=lastSpan+'/4 · '+lastH+'px'; };
        setBadge(); tile.appendChild(badge);

        let raf=0;
        const apply=ev=>{
          if(raf) return;
          raf=requestAnimationFrame(()=>{
            raf=0;
            // ширина: від лівого краю плитки до курсора → кількість колонок
            const w=Math.max(colW*0.5, ev.clientX-r.left);
            let span=Math.round((w+gap)/(colW+gap));
            span=Math.max(1,Math.min(COLS,span));
            // висота: вільна, в px
            let h=Math.round(Math.max(70, ev.clientY-r.top));
            let changed=false;
            if(span!==lastSpan){ lastSpan=span; tile.style.setProperty('--span',span); changed=true; window.platform.haptic('select'); }
            if(Math.abs(h-lastH)>=2){ lastH=h; tile.style.setProperty('--h',h+'px'); tile.classList.add('has-h'); changed=true; }
            if(changed) setBadge();
          });
        };
        const up=()=>{
          if(raf) cancelAnimationFrame(raf);
          document.removeEventListener('pointermove',apply);
          document.removeEventListener('pointerup',up);
          document.removeEventListener('pointercancel',up);
          tile.classList.remove('resizing'); document.body.classList.remove('resizing-block');
          badge.remove();
          const bb=getBlock(id);
          if(bb){ bb.w=lastSpan; bb.h=lastH; bb.size=null; saveBoard(); window.platform.haptic('light'); }
        };
        document.addEventListener('pointermove',apply,{passive:true});
        document.addEventListener('pointerup',up);
        document.addEventListener('pointercancel',up);
      });
    });
  }

  /* ===== DRAG-TO-REORDER (тяг за ручку ⠿) ===== */
  function enableTileDrag(board){
    let dragId=null, ghost=null, holdTimer=null, startX=0, startY=0, dragging=false, scrollEl=null, lastY=0;
    const LONG=220, MOVE_CANCEL=10;

    function tilesArr(){ return [...(window.__btRoot||board).querySelectorAll('.tile[data-tileid]')]; }
    function arrFor(id){ return findParentArr(curBoard(), id) || currentLevelArr(); }

    function startDrag(tile, clientY){
      dragId=tile.dataset.tileid; dragging=true;
      tile.classList.add('drag-src');
      document.body.classList.add('dragging-block');
      try{ window.platform.lockSwipe(true); }catch(_){}
      window.platform.haptic('medium');
      const r=tile.getBoundingClientRect();
      ghost=tile.cloneNode(true);
      ghost.classList.add('drag-ghost'); ghost.classList.remove('drag-src','menu-open');
      ghost.style.width=r.width+'px'; ghost.style.height=r.height+'px';
      ghost.style.left='0px'; ghost.style.top='0px';
      ghost._ox=r.left; ghost._oy=r.top; ghost._dy=(clientY-r.top);
      ghost.style.transform=`translate(${r.left}px,${r.top}px)`;
      document.body.appendChild(ghost);
      lastY=clientY;
    }

    let rafId=0, pendingY=0;
    function moveGhost(clientY){
      pendingY=clientY;
      if(rafId) return;
      rafId=requestAnimationFrame(()=>{
        rafId=0;
        if(!ghost) return;
        const y=pendingY;
        ghost.style.transform=`translate(${ghost._ox}px,${y-ghost._dy}px)`;
        // плитка під курсором
        const list=tilesArr().filter(t=>t.dataset.tileid!==dragId);
        let over=null;
        for(const t of list){
          const r=t.getBoundingClientRect();
          if(y>=r.top && y<=r.bottom){ over=t; break; }
        }
        list.forEach(t=>{ t.classList.remove('drop-before','drop-after'); });
        if(over){
          const r=over.getBoundingClientRect();
          const after = y > (r.top+r.height/2);
          over.classList.add(after?'drop-after':'drop-before');
          over.dataset.dropafter = after?'1':'0';
        }
        const vh=window.innerHeight;
        if(y<80) window.scrollBy(0,-10);
        else if(y>vh-80) window.scrollBy(0,10);
      });
    }

    function endDrag(commit){
      clearTimeout(holdTimer); holdTimer=null;
      if(rafId){ cancelAnimationFrame(rafId); rafId=0; }
      if(ghost){ ghost.remove(); ghost=null; }
      document.body.classList.remove('dragging-block');
      try{ window.platform.lockSwipe(false); }catch(_){}
      const src=board.querySelector('.tile.drag-src');
      const target=board.querySelector('.drop-before,.drop-after');
      if(commit && dragId && target){
        const targetId=target.dataset.tileid;
        const after = target.dataset.dropafter==='1';
        const arr=arrFor(dragId);
        const tArr=arrFor(targetId);
        if(arr===tArr && targetId!==dragId){
          const from=arr.findIndex(b=>String(b.id)===String(dragId));
          if(from>=0){
            const [item]=arr.splice(from,1);
            let to=arr.findIndex(b=>String(b.id)===String(targetId));
            if(after) to+=1;
            arr.splice(to,0,item);
            syncBlocks(); saveBoard();
            window.platform.haptic('light');
          }
        }
      }
      (window.__btRoot||board).querySelectorAll('.drop-before,.drop-after').forEach(t=>t.classList.remove('drop-before','drop-after'));
      if(src) src.classList.remove('drag-src');
      dragId=null; dragging=false;
      renderBoard();
    }

    tilesArr().forEach(tile=>{
      const handle=tile.querySelector('.draghandle');
      if(!handle) return;

      // ── CANVAS (нова механіка): тягни за ручку ОДРАЗУ або утримай блок 260мс ──
      if(isCanvasMode()){
        const IGNORE='.rzhandle,button,input,textarea,select,[contenteditable],a,.tx,.tcheck .cb,.bn-waterplus';
        const EDGE=44, STEP=14; // автопрокрутка полотна біля країв під час drag

        function startCanvasDrag(e){
          document.querySelectorAll('.canvas-radial').forEach(m=>m.remove());
          window.__canvasGripActive=true;
          const b=getBlock(tile.dataset.tileid); if(!b){ window.__canvasGripActive=false; return; }
          if(b.fx==null || b.fy==null){ try{ applyFreeSizes(board); }catch(_){} }
          const baseX=(b.fx!=null?b.fx:0), baseY=(b.fy!=null?b.fy:0);
          const startPX=e.clientX, startPY=e.clientY;
          const startSL=board.scrollLeft, startST=board.scrollTop;
          const cz=getZoom();
          let raf=0, nx=baseX, ny=baseY, started=false, lastEv=e;
          let panRaf=0;
          const DRAG_THRESHOLD = e.__fromHold ? 0 : 6;  // з утримання стартуємо одразу

          const apply=(ev)=>{
            // позиція = базова + рух пальця/миші + ЗСУВ СКРОЛУ полотна (щоб блок не відставав при автопрокрутці)
            nx=Math.max(0, baseX + (ev.clientX-startPX)/cz + (board.scrollLeft-startSL)/cz);
            ny=Math.max(0, baseY + (ev.clientY-startPY)/cz + (board.scrollTop -startST)/cz);
            tile.style.setProperty('--fx', Math.round(nx)+'px');
            tile.style.setProperty('--fy', Math.round(ny)+'px');
            const w=(b.fw!=null?b.fw:tile.offsetWidth||260);
            const h=(b.fh!=null?b.fh:tile.offsetHeight||130);
            showAlignGuides(board, tile, nx, ny, w, h);
            const innerEl=board.querySelector('.canvas-inner');
            if(innerEl){
              const needW=nx+w+80, needH=ny+h+120;
              if(needW > innerEl.offsetWidth)  innerEl.style.minWidth = needW+'px';
              if(needH > innerEl.offsetHeight) innerEl.style.minHeight= needH+'px';
            }
          };
          const beginDrag=()=>{
            if(started) return; started=true;
            tile.classList.add('canvas-dragging');
            document.body.classList.add('dragging-block');
            window.__canvasBlockDragging=true;
            try{ window.platform.lockSwipe(true); }catch(_){}
            try{ window.platform.haptic('medium'); }catch(_){}
            autoPan();
          };
          // автопрокрутка полотна, коли палець біля краю (і блок їде разом — apply() компенсує)
          function autoPan(){
            if(!started || !window.__canvasBlockDragging){ panRaf=0; return; }
            const r=board.getBoundingClientRect();
            let moved=false;
            const x=lastEv.clientX, y=lastEv.clientY;
            if(x < r.left+EDGE  && board.scrollLeft>0){ board.scrollLeft-=STEP; moved=true; }
            else if(x > r.right-EDGE){ board.scrollLeft+=STEP; moved=true; }
            if(y < r.top+EDGE   && board.scrollTop>0){ board.scrollTop-=STEP; moved=true; }
            else if(y > r.bottom-EDGE){ board.scrollTop+=STEP; moved=true; }
            if(moved){ apply(lastEv); try{ flashMinimap(); }catch(_){} }
            panRaf=requestAnimationFrame(autoPan);
          }
          const mv=ev=>{
            lastEv=ev;
            if(!started){
              const dx=Math.abs(ev.clientX-startPX), dy=Math.abs(ev.clientY-startPY);
              if(dx>DRAG_THRESHOLD || dy>DRAG_THRESHOLD) beginDrag();
              else return;
            }
            if(raf) return;
            raf=requestAnimationFrame(()=>{ raf=0; apply(lastEv); });
          };
          const up=()=>{
            if(raf) cancelAnimationFrame(raf);
            if(panRaf) cancelAnimationFrame(panRaf);
            document.removeEventListener('pointermove',mv);
            document.removeEventListener('pointerup',up);
            document.removeEventListener('pointercancel',up);
            window.__canvasGripActive=false;
            if(!started){ window.__justDragged=false; window.__canvasBlockDragging=false; return; }
            tile.classList.remove('canvas-dragging','over-blocked');
            window.__justDragged=true;
            setTimeout(()=>{ window.__justDragged=false; }, 350);
            (window.__btRoot||board).querySelectorAll('.tile.canvas-blocked').forEach(t=>t.classList.remove('canvas-blocked'));
            clearAlignGuides();
            document.body.classList.remove('dragging-block');
            window.__canvasBlockDragging=false;
            try{ window.platform.lockSwipe(false); }catch(_){}
            // прилипання до сітки; блок лишається там, де відпустили (без авто-підсувань)
            b.fx=Math.max(0,Math.round(snapVal(nx))); b.fy=Math.max(0,Math.round(snapVal(ny)));
            window.__canvasJustDropped=true;
            tile.style.transition='transform .14s ease';
            tile.style.setProperty('--fx', b.fx+'px');
            tile.style.setProperty('--fy', b.fy+'px');
            setTimeout(()=>{ try{ tile.style.transition=''; }catch(_){} },160);
            saveBoard();
            let maxR=0, maxXr=0;
            (window.__btRoot||board).querySelectorAll('.tile[data-tileid]').forEach(t=>{
              const ob=getBlock(t.dataset.tileid); if(!ob||ob.fx==null) return;
              maxR=Math.max(maxR, ob.fy+(ob.fh||t.offsetHeight||130));
              maxXr=Math.max(maxXr, ob.fx+(ob.fw||t.offsetWidth||260));
            });
            const innerEl=board.querySelector('.canvas-inner');
            if(innerEl){
              innerEl.style.minHeight=Math.max(window.innerHeight*0.6, maxR+160)+'px';
              innerEl.style.minWidth=Math.max(board.clientWidth, maxXr+80)+'px';
            }
            try{ updateMinimap(); }catch(_){}
          };
          document.addEventListener('pointermove',mv,{passive:true});
          document.addEventListener('pointerup',up);
          document.addEventListener('pointercancel',up);
          // старт з утримання: блок «піднімається» одразу, не чекаючи руху
          if(e.__fromHold) beginDrag();
        }

        // 1) ручка ⠿ — тягнеться миттєво
        handle.addEventListener('pointerdown',e=>{
          e.preventDefault(); e.stopPropagation();
          startCanvasDrag(e);
        });

        // 2) НОВЕ: утримай блок 260мс будь-де по тілу → перетягування
        //    (короткий тап = звичайна дія; рух пальця до спрацювання = pan полотна)
        let holdT=null, hX=0, hY=0, hSL=0, hST=0;
        const holdCancel=()=>{ if(holdT){ clearTimeout(holdT); holdT=null; }
          document.removeEventListener('pointermove',holdMove,true);
          document.removeEventListener('pointerup',holdCancel,true);
          document.removeEventListener('pointercancel',holdCancel,true); };
        const holdMove=ev=>{
          if(Math.abs(ev.clientX-hX)>8||Math.abs(ev.clientY-hY)>8) holdCancel();
        };
        tile.addEventListener('pointerdown',e=>{
          if(e.target.closest('.draghandle')) return;               // ручка обробляється вище
          if(e.target.closest(IGNORE)) return;                       // поля/кнопки — не чіпаємо
          if(window.__canvasBlockDragging || window.__canvasGripActive) return;
          hX=e.clientX; hY=e.clientY; hSL=board.scrollLeft; hST=board.scrollTop;
          const pe={clientX:e.clientX, clientY:e.clientY, __fromHold:true};
          document.addEventListener('pointermove',holdMove,true);
          document.addEventListener('pointerup',holdCancel,true);
          document.addEventListener('pointercancel',holdCancel,true);
          holdT=setTimeout(()=>{
            holdT=null; holdCancel();
            // якщо полотно тим часом поїхало (pan) — це був скрол, не утримання
            if(Math.abs(board.scrollLeft-hSL)>4 || Math.abs(board.scrollTop-hST)>4) return;
            if(window.__canvasBlockDragging || window.__canvasGripActive) return;
            startCanvasDrag(pe);
          },260);
        });
        return;
      }

      // перетягування ТІЛЬКИ за ручку ⠿ — миттєвий старт (reorder у сітці)      // перетягування ТІЛЬКИ за ручку ⠿ — миттєвий старт (reorder у сітці)
      handle.addEventListener('pointerdown',e=>{
        e.preventDefault(); e.stopPropagation();
        startX=e.clientX; startY=e.clientY;
        startDrag(tile, e.clientY);
      });
    });

    // глобальні рухи/відпускання
    function onMove(e){
      if(!dragging){
        if(holdTimer && (Math.abs(e.clientX-startX)>MOVE_CANCEL || Math.abs(e.clientY-startY)>MOVE_CANCEL)){
          clearTimeout(holdTimer); holdTimer=null;
        }
        return;
      }
      e.preventDefault();
      moveGhost(e.clientY);
    }
    function onUp(){ if(holdTimer){clearTimeout(holdTimer);holdTimer=null;} if(dragging) endDrag(true); }

    board.__dragMove && document.removeEventListener('pointermove', board.__dragMove);
    board.__dragUp && document.removeEventListener('pointerup', board.__dragUp);
    document.addEventListener('pointermove', onMove, {passive:false});
    document.addEventListener('pointerup', onUp);
    board.__dragMove=onMove; board.__dragUp=onUp;
  }
  function escAttr(s){ return String(s).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

  /* ---- load ---- */
  function migrate(){
    let ch=false;
    items.forEach(i=>{ if(!i.ops){ i.ops=[{id:i.id,type:'borrow',amount:i.amount||0,date:i.date,note:i.note}]; delete i.amount;delete i.date;delete i.note; ch=true; } });
    if(ch) save();
  }
  // приводить блоки до коректної форми (доповнює відсутні поля за типом)
  function normalizeBlocks(arr){
    if(!Array.isArray(arr)) return [];
    return arr.filter(b=>b&&b.type).map(b=>{
      const t=b.type;
      if(t==='check'){ if(!Array.isArray(b.items)) b.items=[{id:Date.now()+Math.random(),text:'',done:false}];
        b.items=b.items.map(i=>({id:i&&i.id||Date.now()+Math.random(),text:i&&i.text||'',done:!!(i&&i.done)})); }
      if(t==='list'){ if(!Array.isArray(b.items)) b.items=[{id:Date.now()+Math.random(),text:''}];
        b.items=b.items.map(i=>({id:i&&i.id||Date.now()+Math.random(),text:i&&i.text||''})); }
      if(t==='numlist'){ if(!Array.isArray(b.items)) b.items=['']; }
      if(t==='table'){ if(!Array.isArray(b.cols)) b.cols=['Назва','Значення'];
        if(!Array.isArray(b.rows)) b.rows=[b.cols.map(()=>'')];
        b.rows=b.rows.map(r=>Array.isArray(r)?b.cols.map((_,i)=>r[i]||''):b.cols.map(()=>'')); }
      if(t==='link'){ if(typeof b.url!=='string') b.url=''; if(typeof b.label!=='string') b.label=''; }
      if(t==='group'||t==='page'){ b.children=normalizeBlocks(Array.isArray(b.children)?b.children:[]); if(typeof b.open!=='boolean') b.open=true; }
      if(t==='progress'){ b.value=Math.max(0,Math.min(100,parseInt(b.value)||0)); }
      if(t==='calendar'){ if(!b.marks||typeof b.marks!=='object') b.marks={}; if(!b.ym) b.ym=ymLocal(); }
      if(t==='task'){ if(!b.prio) b.prio='none'; if(!Array.isArray(b.subs)) b.subs=[];
        b.subs=b.subs.map(s=>({id:s&&s.id||Date.now()+Math.random(),text:s&&s.text||'',done:!!(s&&s.done)})); }
      if(t==='callout'){ if(!b.tone) b.tone='tip'; }
      if(t==='quote'){ if(!b.qstyle) b.qstyle='line'; }
      if((t==='list') && !b.lstyle) b.lstyle='bullet';
      if(t==='progress' && !b.pview) b.pview='bar';
      if(!b.id) b.id=Date.now()+Math.random();
      return b;
    });
  }

  function seedAgencySlovakia(){
    var FK="f_agsk_seed", EID="env_agsk_tax", EID2="env_agsk_re";
    try{ if(folders&&folders[FK]) return; }catch(_){ return; }
    var FOLDER={"key":"f_agsk_seed","c":"#5b8def","emoji":"🇸🇰","name":"Агенція Словаччина","pct":0,"photo":"","flayout":"a","pinned":true,"custom":true,"widgets":[],"parent":"","role":"project","status":"active","due":"2026-07-15","secret":true};
    var BOARD=[{"id":"b_agsk_1","type":"h1","title":"Заголовок 1","text":"Агенція · Словаччина 🇸🇰"},{"id":"b_agsk_2","type":"callout","tone":"tip","text":"Адмін-супровід українців: тимчасовий захист (dočasné útočisko), živnosť і pobyt. Чек 500 € з клієнта. Партнерство 50/50."},{"id":"b_agsk_3","type":"countdown","title":"До нового закону","target":"2026-07-15","label":"TP → prechodný pobyt (6 міс. діяльності)"},{"id":"b_agsk_4","type":"head","title":"Клієнти"},{"id":"b_agsk_5","type":"kanban","title":"Воронка клієнтів","cols":[{"id":"kc_agsk_z","name":"Заявка","cards":[{"id":"kd_a1","t":"Наталя — TP","m":"дзвінок пт"}]},{"id":"kc_agsk_k","name":"Консультація","cards":[{"id":"kd_a2","t":"Роман — živnosť","m":""}]},{"id":"kc_agsk_o","name":"Оплата 500€","cards":[]},{"id":"kc_agsk_r","name":"В роботі","cards":[]},{"id":"kc_agsk_p","name":"Подано","cards":[]},{"id":"kc_agsk_g","name":"Готово","cards":[]}]},{"id":"b_agsk_6","type":"contacts","title":"База клієнтів","people":[{"id":"ct_a1","name":"Приклад клієнта","note":"TP · оплачено 500€ · подано 00.00","link":"","color":"#5b8def"}]},{"id":"b_agsk_7","type":"table","title":"Реєстр справ","cols":["Клієнт","Послуга","Подано","Дедлайн","Хто веде","€"],"rows":[["Приклад","TP","","","Партнерка","500"],["","živnosť","","","Я",""],["","pobyt","","","",""]]},{"id":"b_agsk_8","type":"check","title":"Документи клієнта · шаблон","items":[{"id":"dc1","text":"Закордонний паспорт (скан)","done":false},{"id":"dc2","text":"Фото 3×3.5","done":false},{"id":"dc3","text":"Адреса проживання / ubytovanie","done":false},{"id":"dc4","text":"Довіреність / plná moc","done":false},{"id":"dc5","text":"Заява на dočasné útočisko","done":false},{"id":"dc6","text":"Реєстрація живності (za studena)","done":false},{"id":"dc7","text":"Договір з клієнтом підписано","done":false}]},{"id":"b_agsk_9","type":"head","title":"Фінанси"},{"id":"b_agsk_10","type":"fin","title":"Фінанси агенції"},{"id":"b_agsk_11","type":"project","title":"Прибуток агенції","ops":[],"expected":0,"cur":"€","deadline":"","unlocked":true,"pview":1,"splitPreset":{"amount":500,"cur":"€","label":"Клієнт","rules":[{"envId":"env_agsk_tax","pct":0.2},{"envId":"env_agsk_re","pct":0.15}]}},{"id":"b_agsk_12","type":"envelope","title":"Податки / Резерв","envId":"env_agsk_tax"},{"id":"b_agsk_13","type":"envelope","title":"Reinvest · Реклама","envId":"env_agsk_re"},{"id":"b_agsk_14","type":"callout","tone":"warn","text":"Правило з кожного клієнта: 20% у «Податки/Резерв», 15% у «Reinvest». Решта — 50/50 з партнеркою."},{"id":"b_agsk_15","type":"head","title":"Маркетинг і контент"},{"id":"b_agsk_16","type":"kanban","title":"Контент-план","cols":[{"id":"kc_agsk_mi","name":"Ідея","cards":[{"id":"kd_m1","t":"Reels: 3 помилки при TP","m":""}]},{"id":"kc_agsk_ms","name":"Сценарій","cards":[]},{"id":"kc_agsk_mz","name":"Знято","cards":[]},{"id":"kc_agsk_mm","name":"Монтаж","cards":[]},{"id":"kc_agsk_mp","name":"Опубліковано","cards":[]}]},{"id":"b_agsk_17","type":"check","title":"Канали залучення","items":[{"id":"ch1","text":"Instagram (reels)","done":false},{"id":"ch2","text":"Telegram-канал","done":false},{"id":"ch3","text":"Групи українців у SK","done":false},{"id":"ch4","text":"Сарафан / відгуки","done":false},{"id":"ch5","text":"Партнерства (юрист, HR, житло)","done":false}]},{"id":"b_agsk_18","type":"note","title":"Офер і скрипт","text":"УТП: «Отримаєш захист і живність без стресу — ми ведемо всі папери».\nСкрипт консультації: біль → рішення → пакет 500€ → наступний крок.\nЗаперечення: «дорого» → рахуємо ризик самостійних помилок і час."},{"id":"b_agsk_19","type":"head","title":"Операційка й розвиток"},{"id":"b_agsk_20","type":"caseline","title":"Таймлайн запуску","events":[{"id":"ev1","d":"2026-07-13","t":"Сайт готовий ✅"},{"id":"ev2","d":"2026-07-13","t":"Договори UA/SK готові ✅"},{"id":"ev3","d":"2026-07-15","t":"Старт нового закону — реєструю власну živnosť"}]},{"id":"b_agsk_21","type":"contacts","title":"Партнери й сервіси","people":[{"id":"pt1","name":"Юрист","note":"","link":"","color":"#34c77b"},{"id":"pt2","name":"Бухгалтер","note":"","link":"","color":"#e8843c"},{"id":"pt3","name":"Нотаріус","note":"","link":"","color":"#c77dff"},{"id":"pt4","name":"Житло / ubytovanie","note":"","link":"","color":"#5b8def"}]},{"id":"b_agsk_22","type":"note","title":"Розвиток · гіпотези","text":"• Пакетні тарифи (базовий/під ключ/сімʼя)\n• Найм асистента при 8+ клієнтах/міс\n• Другий напрямок: pobyt для бізнесу\n• База знань → міні-курс як апсел"}];
    var ENVS=[{"id":"env_agsk_tax","name":"Податки / Резерв","emoji":"🛟","color":"#f0b429","goal":3000,"saved":0,"ops":[],"kind":"ціль","link":"f_agsk_seed","linkLabel":"Агенція SK"},{"id":"env_agsk_re","name":"Reinvest · Реклама","emoji":"📣","color":"#5b8def","goal":1500,"saved":0,"ops":[],"kind":"ціль","link":"f_agsk_seed","linkLabel":"Агенція SK"}];
    try{ folders[FK]=FOLDER; if(order.indexOf(FK)<0) order.push(FK); saveFolders(); }catch(_){}
    try{ boards[FK]=BOARD; saveBoard(); }catch(_){}
    try{ var have={}; envelopes.forEach(function(e){have[e.id]=1;}); ENVS.forEach(function(e){ if(!have[e.id]) envelopes.push(e); }); saveEnvelopes(); }catch(_){}
    try{ window.__agencySeeded=true; }catch(_){}
  }

  // Одноразове тихе очищення старих тестових оплат агенції (спрацьовує рівно раз).
  function agskCleanupOnce(){
    var FLAG='flowapp_agsk_cleaned_v2';
    try{ if(localStorage.getItem(FLAG)) return; }catch(_){ return; }
    try{
      // клієнти: обнулити платежі
      if(typeof agClients==='function'){ agClients().forEach(function(c){ c.payments=[]; }); }
      // проєкт агенції: повністю обнулити всі рухи (старі тапи «Клієнт +500» без міток теж)
      var projId=null;
      if(typeof agProjBlock==='function'){ var proj=agProjBlock();
        if(proj){ projId=proj.id; proj.ops=[]; } }
      // агенційні конверти: повністю обнулити ops і saved
      var agEnvIds={}; if(typeof agFindAll==='function'){ agFindAll('envelope').forEach(function(eb){ agEnvIds[String(eb.envId)]=1; }); }
      if(Array.isArray(envelopes)) envelopes.forEach(function(e){
        if(agEnvIds[String(e.id)]){ e.ops=[]; e.saved=0; }
        else if(Array.isArray(e.ops)){ e.ops=e.ops.filter(function(o){ return !o.payId; });
          try{ e.saved=(e.ops||[]).reduce(function(s,o){ return s+(o.t==='in'?+o.amount:-(+o.amount)); },0); }catch(_){}
        }
      });
      // finOps: прибрати все, що стосується агенції (payId, clientId, агенційний проєкт, агенційні конверти, резерви)
      try{ if(Array.isArray(finOps)) finOps=finOps.filter(function(f){
        if(f.payId||f.clientId) return false;
        if(projId&&f.proj===projId) return false;
        if(f.env&&agEnvIds[String(f.env)]) return false;
        if(/^Клієнт:|^Проєкт: Прибуток агенції|^Виплата партнеру|^Резерв:/i.test(f.label||'')) return false;
        return true;
      }); }catch(_){}
      // виплати партнерам
      try{ if(typeof agPartnersBlock==='function'){ var pb=agPartnersBlock(); if(pb) pb.payouts=[]; } }catch(_){}
      try{ saveBoard(); }catch(_){}
      try{ saveFinOps(); }catch(_){}
      try{ saveEnvelopes(); }catch(_){}
    }catch(_){}
    try{ localStorage.setItem(FLAG,'1'); }catch(_){}
  }

  // ── merge конфігурації папок (спільна для миттєвого й повного завантаження) ──
  function applyFolderCfgRaw(rawf){
    const cfg=rawf?JSON.parse(rawf):null;
    if(cfg&&typeof cfg==='object'){
      Object.keys(cfg).forEach(k=>{
        const c=cfg[k];
        if(folders[k]){ Object.assign(folders[k],{c:c.c,emoji:c.emoji,name:c.name,photo:c.photo||'',photoPos:c.photoPos||null,flayout:c.flayout||'a',pinned:!!c.pinned,pct:c.pct||folders[k].pct||0,parent:c.parent||'',role:c.role||'area',status:c.status||'',due:c.due||'',secret:!!c.secret}); }
        else if(c.custom){ folders[k]={key:k,c:c.c,emoji:c.emoji,name:c.name,pct:c.pct||0,photo:c.photo||'',photoPos:c.photoPos||null,flayout:c.flayout||'a',pinned:!!c.pinned,custom:true,parent:c.parent||'',widgets:[],role:c.role||'area',status:c.status||'',due:c.due||'',secret:!!c.secret}; }
      });
    }
  }
  function applyFolderOrderRaw(rawo){
    const ord=rawo?JSON.parse(rawo):null;
    if(Array.isArray(ord)&&ord.length){ order=ord.filter(k=>folders[k]); Object.keys(folders).forEach(k=>{ if(!order.includes(k)) order.push(k); }); }
  }
  async function load(){
    // ⚡ МИТТЄВИЙ ПЕРШИЙ РЕНДЕР: папки з локального кешу ДО очікування хмари Telegram.
    //    Прибирає «порожні папки на пару секунд» при старті. Повний load нижче все оновить.
    try{
      if(window.storage.getLocal){
        const rawf=window.storage.getLocal(FKEY); if(rawf) applyFolderCfgRaw(rawf);
        const rawo=window.storage.getLocal(FOKEY); if(rawo) applyFolderOrderRaw(rawo);
        try{ if(folders[AGENCY_KEY]) folders[AGENCY_KEY].secret=true; }catch(_){}
        renderDashboard();
      }
    }catch(e){ console.warn('fast-render skip', e); }
    try{ window.__load=load; }catch(_){}
    /* Native: підняти дані з Preferences ДО будь-якого читання, інакше апка
       відрендериться порожньою, якщо iOS вичистив localStorage. */
    try{
      if(window.FLOW_NATIVE && window.storage.nativeBoot){
        const nb=await window.storage.nativeBoot();
        if(nb.restored) console.warn('storage: відновлено з Preferences', nb.restored, 'ключів');
      }
    }catch(e){ console.error('nativeBoot',e); }
    try{ if(window.storage.prefetchAll){ await window.storage.prefetchAll(window.FLOW_KEYS.slice()); } }catch(_){}
    // 🚀 ОДИН пакет паралельних запитів замість ~30 послідовних await один за
    // одним — усі мережеві звернення летять одночасно, а не в чергу. Логіка
    // застосування значень нижче лишається в тому самому порядку, що й раніше.
    const __RAW = await (async ()=>{
      const keys=[KEY,SKEY,PAT_CKEY,PAT_SKEY,PAT_TKEY,BKEY,CBKEY,UKEY,RDR_CFG_KEY,
        FKEY,FOKEY,FWKEY,VAULT_KEY,GKEY,VZKEY,CUSTOM_AV_KEY,ENVKEY,FINOPKEY,
        WORKKEY,WORKCFGKEY,WKEXTRAKEY,WKBLKKEY,RECKEY,CHKEY,CARDKEY,CARDCFGKEY,
        FINLITKEY,FXKEY,DIARY_KEY];
      const pairs=await Promise.all(keys.map(k=>
        window.storage.get(k,false).then(
          r=>[k,(r&&typeof r.value!=='undefined')?r.value:null],
          ()=>[k,null]
        )
      ));
      const m={}; pairs.forEach(([k,v])=>{ m[k]=v; }); return m;
    })();
    // ці читання незалежні одне від одного — теж ідуть паралельно, а не по черзі
    try{ await Promise.all([loadValues(), loadWishes(), loadWishPrice(), loadHomeGlass()]); applyHomeGlass(); }catch(_){}

    try{ const raw=__RAW[KEY]; items=raw?JSON.parse(raw):[]; }
    catch{ items=[]; }
    try{ const raw2=__RAW[SKEY]; spends=raw2?JSON.parse(raw2):[]; }
    catch{ spends=[]; }
    try{ const rawp=__RAW[PAT_CKEY]; patChains=rawp?JSON.parse(rawp):[]; if(!Array.isArray(patChains))patChains=[]; }
    catch{ patChains=[]; }
    try{ const rawps=__RAW[PAT_SKEY]; const ps=rawps?JSON.parse(rawps):null; if(ps&&typeof ps==='object')patScore={win:+ps.win||0,lose:+ps.lose||0}; }
    catch{ patScore={win:0,lose:0}; }
    try{ const rawpt=__RAW[PAT_TKEY]; patTrans=rawpt?JSON.parse(rawpt):[]; if(!Array.isArray(patTrans))patTrans=[]; }
    catch{ patTrans=[]; }
    try{
      const raw3=__RAW[BKEY];
      const parsed=raw3?JSON.parse(raw3):null;
      if(Array.isArray(parsed)) boards={all:parsed};        // migrate old single board
      else if(parsed&&typeof parsed==='object') boards=parsed;
      else boards={};
      // нормалізуємо всі блоки, щоб старі/неповні дані не ламали рендер
      Object.keys(boards).forEach(k=>{ if(Array.isArray(boards[k])) boards[k]=normalizeBlocks(boards[k]); });
      // папка «Патерни» відкривається одразу як екран — її простір не використовується, чистимо залишки
      try{ if(boards['pat']){ delete boards['pat']; saveBoard(); } }catch(_){}
    }
    catch{ boards={}; }
    try{ rescheduleAllReminders(); checkDueReminders(); }catch(_){}
    try{ plRescheduleReminders(); plCheckDueReminders(); }catch(_){}
    try{
      const raw4=__RAW[CBKEY];
      const cb=raw4?JSON.parse(raw4):null;
      customBoards = Array.isArray(cb)? cb : [];
    }
    catch{ customBoards=[]; }
    try{ const rawu=__RAW[UKEY]; const u=rawu?JSON.parse(rawu):null; blockUsage=(u&&typeof u==='object')?u:{}; }
    catch{ blockUsage={}; }
    try{ const rawc=__RAW[RDR_CFG_KEY]; const c=rawc?JSON.parse(rawc):null; if(c&&typeof c==='object') Object.assign(rdrCfg,c); }
    catch{}
    // folder customizations + custom folders + order
    try{
      applyFolderCfgRaw(__RAW[FKEY]);
      applyFolderOrderRaw(__RAW[FOKEY]);
      const raww=__RAW[FWKEY];
      const fw=raww?JSON.parse(raww):null; if(fw&&typeof fw==='object') folderWidgets=fw;
    }catch(e){ /* перше завантаження — сховища ще нема, це нормально */ }
    // 🕶️ vault: лише хеш коду, ніколи не сам код
    try{
      const rawv=__RAW[VAULT_KEY];
      const vc=rawv?JSON.parse(rawv):null;
      if(vc&&vc.h&&vc.s) vaultCfg=vc;
    }catch(_){}
    // 🇸🇰 Агенція завжди під кодом: навіть якщо в сховищі прапорця ще нема
    try{ if(folders[AGENCY_KEY]){ folders[AGENCY_KEY].secret=true; } }catch(_){}
    // ── ОЧИЩЕННЯ: «Простір» видалено повністю разом із даними.
    //    Прибираємо: кореневі дошки ('all' + 'all__sp_*'), додаткові простори
    //    кореня та колись перенесені папки «🧩 Простір» ('f_space_*').
    //    Виконується один раз.
    try{
      if(!localStorage.getItem('space_purge_v1')){
        let changed=false;
        Object.keys(boards).forEach(k=>{
          if(k==='all'){ if(Array.isArray(boards[k])&&boards[k].length){ boards[k]=[]; changed=true; } }
          else if(k.indexOf('all__sp_')===0 || k.indexOf('f_space_')===0){ delete boards[k]; changed=true; }
        });
        Object.keys(folders).forEach(k=>{
          if(k.indexOf('f_space_')===0){ delete folders[k]; changed=true; }
        });
        for(let i=order.length-1;i>=0;i--){
          if(String(order[i]).indexOf('f_space_')===0){ order.splice(i,1); changed=true; }
        }
        try{
          if(typeof spacesMap!=='undefined' && spacesMap && spacesMap['__root__']){
            delete spacesMap['__root__'];
            if(typeof activeSpaceMap!=='undefined' && activeSpaceMap) delete activeSpaceMap['__root__'];
            if(typeof saveSpacesMeta==='function') saveSpacesMeta();
            changed=true;
          }
        }catch(_){}
        if(changed){ try{ saveFolders(); }catch(_){} try{ saveBoard(); }catch(_){} }
        localStorage.setItem('space_purge_v1','1');
      }
    }catch(e){ console.error('space purge', e); }
    // ── ОЧИЩЕННЯ 2: старі віджети та проєктні блоки (перенесені зі Простору)
    //    видаляємо з усіх папок — на їхнє місце прийдуть нові, професійніші.
    //    «Відлік» лишається — він рідний для сторінки. Виконується один раз.
    try{
      if(!localStorage.getItem('legacy_widgets_purge_v1')){
        const DEAD={progress:1,fin:1,envelope:1,calendar:1,wpult:1,wstack:1,wpipe:1,wtline:1,
          wportal:1,wplanday:1,wplanmonth:1,project:1,kanban:1,contacts:1,caseline:1,festival:1};
        let removed=0;
        const strip=(arr)=>{
          if(!Array.isArray(arr))return;
          for(let i=arr.length-1;i>=0;i--){
            const b=arr[i];
            if(b&&DEAD[b.type]){ arr.splice(i,1); removed++; continue; }
            if(b&&Array.isArray(b.children)) strip(b.children);
          }
        };
        Object.keys(boards).forEach(k=>strip(boards[k]));
        if(removed){ try{ saveBoard(); }catch(_){} }
        localStorage.setItem('legacy_widgets_purge_v1','1');
      }
    }catch(e){ console.error('legacy widgets purge', e); }
    // goals data
    try{
      const rawg=__RAW[GKEY];
      const gd=rawg?JSON.parse(rawg):null;
      if(gd&&typeof gd==='object'){ goalsData=Object.assign(goalsData,gd); if(!Array.isArray(goalsData.goals))goalsData.goals=[];
        if(!goalsData.planner||typeof goalsData.planner!=='object') goalsData.planner={scope:'week',tasks:[],blocks:[]};
        if(!Array.isArray(goalsData.planner.tasks)) goalsData.planner.tasks=[];
        if(!Array.isArray(goalsData.planner.blocks)) goalsData.planner.blocks=[];
        if(!goalsData.planner.scope) goalsData.planner.scope='week';
        if(typeof goalsData.pointA!=='string') goalsData.pointA='';
        if(typeof goalsData.pointB!=='string') goalsData.pointB='';
        if(goalsData.pathMode!=='flow'&&goalsData.pathMode!=='bridge') goalsData.pathMode='flow';
        if(goalsData.wishTheme!=='classic'&&goalsData.wishTheme!=='ai') goalsData.wishTheme='classic';
        if(!goalsData.pointA.trim() && !goalsData._paInit){
          goalsData.pointA='Сплю 4–5 год — і через це не маю волі обирати головне. Хапаюся за все, не доводжу нічого, 0/7 днів за планом, 3–5 год на день згорають у соцмережах. Вдома бардак, харчуюся абияк, є борги. Хочу дохід і бренд — але це поки мрія без жодного конкретного кроку. Тікаю в швидкі стрибки (крипта) замість системи. Корінь один: недосип + звичка щоразу обирати легке зараз замість потрібного потім.';
          goalsData._paInit=true;
        }
        if(!goalsData.pointB.trim() && !goalsData._pbInit){
          goalsData.pointB='Сплю 7+ год, лягаю до 00:00. Не курю — кинув, сон чистий. Живу 5/7 днів за планом, бо щовечора планую завтрашній день. Соцмережі ≤1 год/день. Щодня 15 хв на порядок — дім не захаращений. Три прийоми їжі, готую ввечері на завтра. Фінанси сплановані наперед: бюджет, конверти, борги під контролем — щомісяця мінус фіксована сума, відома дата «вільний». Навчання рознесене: англійська пн/ср/сб, AI-відео вт/чт/пт/нд. Контент build-in-public 3–4 рази/тиждень. Frequency зарелізений до Нового року. Гроші вкладаю лише в те, що розумію; спершу подушка, потім ризик. Один пріоритет за раз, доводжу до кінця. Горизонт: кінець 2026.';
          goalsData._pbInit=true;
        }
      }
    }catch(_){}
    // vision
    try{
      const rawv=__RAW[VZKEY];
      const vd=rawv?JSON.parse(rawv):null;
      if(vd&&typeof vd==='object') vzData=Object.assign(vzData,vd);
      vzNorm();
    }catch(_){}
    // власна іконка профілю
    try{
      const rawca=__RAW[CUSTOM_AV_KEY];
      if(rawca) customAvatar=rawca;
      try{ if(typeof window.dsbFillUser==='function') window.dsbFillUser(); }catch(_){}
      try{ if(typeof window.renderAccount==='function') window.renderAccount(); }catch(_){}
    }catch(_){}
    // envelopes
    try{
      const rawe=__RAW[ENVKEY];
      const ev=rawe?JSON.parse(rawe):null;
      if(Array.isArray(ev)) envelopes=ev;
    }catch(_){}
    try{ const raw=__RAW[FINOPKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) finOps=d; }catch(_){}
    try{ const raw=__RAW[WORKKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) workSessions=d; }catch(_){}
    try{ const raw=__RAW[WORKCFGKEY]; const c=raw?JSON.parse(raw):null; if(c&&typeof c==='object'){ if(c.rate) workRate=c.rate; if(c.cur) workCur=c.cur; if(c.payday) workPayday=c.payday; if(c.postedSal&&typeof c.postedSal==='object') workPostedSal=c.postedSal; if(c.cardId) workCardId=c.cardId; } }catch(_){}
    try{ const raw=__RAW[WKEXTRAKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) workExtras=d; }catch(_){}
    try{ const raw=__RAW[WKBLKKEY]; const d=raw?JSON.parse(raw):null; if(d&&typeof d==='object') wkBlocks=Object.assign(wkBlocks,d); }catch(_){}
    try{ const raw=__RAW[RECKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) recurring=d; }catch(_){}
    try{ const raw=__RAW[CHKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) challenges=d; }catch(_){}
    try{ const raw=__RAW[CARDKEY]; const d=raw?JSON.parse(raw):null; if(Array.isArray(d)) cards=d; }catch(_){}
    try{ const raw=__RAW[CARDCFGKEY]; const d=raw?JSON.parse(raw):null; if(d&&typeof d==='object') cardCfg=Object.assign(cardCfg,d); }catch(_){}
    try{ migrateSpendsToFin(); }catch(_){}   // одна книга: старі spends → finOps (ідемпотентно)
    try{ const raw=__RAW[FINLITKEY]; const d=raw?JSON.parse(raw):null; if(d&&typeof d==='object'&&Array.isArray(d.done)) finlit=Object.assign({done:[],hist:{}},d); }catch(_){}
    try{ const raw=__RAW[FXKEY]; const d=raw?JSON.parse(raw):null; if(d&&typeof d==='object') fx=Object.assign(fx,d); }catch(_){}
    try{ const raw=__RAW[DIARY_KEY]; const d=raw?JSON.parse(raw):null; if(d&&typeof d==='object') diaryEntries=d; }catch(_){}
    try{ fxUpdate(false).then(ok=>{ if(ok){ try{renderFinance();}catch(_){} } }); }catch(_){}
    try{ ensureCards(); }catch(_){}
    try{ removeSystemSeedFoldersOnce(); }catch(e){ console.error('removeSeedFolders',e); }
    try{ seedAgencySlovakia(); }catch(e){ console.error('seedAgency',e); }
    try{ agskCleanupOnce(); }catch(e){ console.error('agskCleanup',e); }
    syncBlocks();
    try{ migrate(); }catch(e){ console.error('migrate',e); }
    try{ buildAddSheet(); }catch(e){ console.error('addsheet',e); }
    try{ render(); }catch(e){ console.error('render',e); }
    try{ renderDashboard(); }catch(e){ console.error('dashboard',e); }
    try{ if(window.uiMode==='lite') goPlanner(); }catch(_){}
    try{ updateSummaryBg(); }catch(_){}
  }
  try{ applySpaceLayout(); }catch(_){}
  try{ applyHomeWidgets(); }catch(_){}
  try{ applyTheme(); }catch(_){}

  load().catch(e=>{
    console.error('load failed',e);
    try{ renderDashboard(); }catch(_){}
  });

  /* ---------- клавіатура: ховаємо бар + тримаємо активне поле у видимій зоні ---------- */
  (function(){
    const vv = window.visualViewport;
    const FIELD = 'input,textarea,[contenteditable="true"]';

    function isField(el){ return el && el.matches && el.matches(FIELD); }

    // визначаємо відкриту клавіатуру за різницею висот в'юпорта
    function kbHeight(){
      if(!vv) return 0;
      return Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    }
    function syncKb(){
      const open = kbHeight() > 120 && isField(document.activeElement);
      document.body.classList.toggle('kb-open', open);
      if(open) ensureVisible(document.activeElement);
    }

    // скрол активного поля так, щоб воно було над клавіатурою
    function ensureVisible(el){
      if(!el) return;
      requestAnimationFrame(()=>{
        const r = el.getBoundingClientRect();
        const safeBottom = (vv ? vv.height : window.innerHeight) - 24;
        if(r.bottom > safeBottom){
          window.scrollBy({top: r.bottom - safeBottom + 16, behavior:'smooth'});
        } else if(r.top < 80){
          window.scrollBy({top: r.top - 80, behavior:'smooth'});
        }
      });
    }

    if(vv){
      vv.addEventListener('resize', syncKb);
      vv.addEventListener('scroll', syncKb);
    }
    document.addEventListener('focusin', e=>{
      if(isField(e.target)){
        document.body.classList.add('kb-open');
        setTimeout(()=>ensureVisible(e.target), 300);
      }
    });
    document.addEventListener('focusout', e=>{
      // невелика затримка: фокус може перейти на інше поле
      setTimeout(()=>{
        if(!isField(document.activeElement)) document.body.classList.remove('kb-open');
      }, 120);
    });
  })();


  /* ── «Візія» більше НЕ створюється автоматично: користувач сам вирішує,
     які папки йому потрібні. Ключ лишається — екран Візії відкривається
     через goVision() з будь-якої власної папки, просто без нав'язаного
     системного фолдера на Огляді. ── */
  const VISION_FKEY='f_vision_seed';
  // одноразове прибирання: якщо «Патерни»/«Візія» вже встигли створитись
  // раніше (старі акаунти) — видаляємо їх, звільняючи Огляд під власні папки.
  function removeSystemSeedFoldersOnce(){
    var FLAG='flowapp_seedfolders_removed_v1';
    try{ if(localStorage.getItem(FLAG)) return; }catch(_){ return; }
    try{
      var changed=false;
      ['pat', VISION_FKEY].forEach(function(k){
        if(folders && folders[k]){ delete folders[k]; changed=true; }
        var i=order.indexOf(k); if(i>=0){ order.splice(i,1); changed=true; }
      });
      if(changed) saveFolders();
    }catch(_){}
    try{ localStorage.setItem(FLAG,'1'); }catch(_){}
  }

