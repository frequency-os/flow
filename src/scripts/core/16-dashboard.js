  /* ============ DASHBOARD RENDER ============ */
  /* Вигляд папок на Огляді (06.10.2026): Галерея (за замовчуванням) · Секції ·
     Бенто — обкладинки на всю плитку (.fc3); Список і Журнал — колишні .fc2.
     Вибір — у шторці ⚙ (openFolderViewSheet). Старе 'grid' (і ще давніші
     cover/compact/deck) читаємо як «Галерею» лише в памʼяті: при старті нічого
     не переписуємо, ключ зміниться, коли людина сама вибере вигляд. */
  const FV_ORDER=['gallery','sections','bento','list','mag'];
  const FV_NAME={gallery:'Галерея', sections:'Секції', bento:'Бенто', list:'Список', mag:'Журнал'};
  const FV_COVER=['gallery','sections','bento'];
  function fvNorm(v){ return FV_ORDER.includes(v) ? v : (v==='grid'||v==='cover'||v==='compact'||v==='deck') ? 'gallery' : null; }
  let homeFolderView='gallery';
  try{ const sv=fvNorm(localStorage.getItem('folderview')); if(sv) homeFolderView=sv; }catch(_){}
  prefCatchup('folderview', v=>{ const n=fvNorm(v); if(n){ homeFolderView=n; try{ renderDashboard(); }catch(_){} } });
  /* розмір плиток (s/m/l), порядок (вручну/за назвою), фото на всю плитку —
     одним легким налаштуванням 'folderopts' (prefSet: сирий ключ + копія в хмарі) */
  const FOPT_DEF={size:'m', sort:'manual', covers:1};
  function foptParse(raw){
    let o={}; try{ o=JSON.parse(raw||'{}')||{}; }catch(_){}
    return { size:['s','m','l'].includes(o.size)?o.size:'m',
             sort:o.sort==='name'?'name':'manual',
             covers:o.covers===0?0:1 };
  }
  let folderOpts=Object.assign({},FOPT_DEF);
  try{ folderOpts=foptParse(localStorage.getItem('folderopts')); }catch(_){}
  prefCatchup('folderopts', v=>{ folderOpts=foptParse(v); try{ renderDashboard(); }catch(_){} });
  function setFolderOpt(k,v){
    folderOpts[k]=v;
    try{ prefSet('folderopts', JSON.stringify(folderOpts)); }catch(_){}
    renderDashboard();
    try{ window.platform.haptic('select'); }catch(_){}
  }
  function applyFolderViewIcon(){
    const b=document.getElementById('folderLookBtn');
    if(b) b.setAttribute('aria-label','Вигляд папок: '+FV_NAME[homeFolderView]);
  }
  function setFolderView(v){
    if(!FV_ORDER.includes(v)||v===homeFolderView){ applyFolderViewIcon(); return; }
    homeFolderView=v;
    try{ prefSet('folderview', homeFolderView); }catch(_){}
    applyFolderViewIcon(); renderDashboard();
    try{ window.platform.haptic('select'); }catch(_){}
  }

  const R=20, C=2*Math.PI*R;

  /* ===== Перетягування папок (long-press → reorder / вкласти) ===== */
  function moveOrderItem(key, beforeKey){
    const arr=order.filter(x=>x!==key);
    if(beforeKey==null){ arr.push(key); }
    else { const i=arr.indexOf(beforeKey); if(i<0) arr.push(key); else arr.splice(i,0,key); }
    order=arr;
  }

  function enableFolderDrag(grid){
    let st=null, holdTimer=null, startedKey=null, startCard=null;
    let startX=0, startY=0, armed=false, pid=null;
    let rafId=0, lastX=0, lastY=0, cardRects=null;
    const LONG=300, JITTER=10;

    function cancelPending(){ if(holdTimer){ clearTimeout(holdTimer); holdTimer=null; } startedKey=null; startCard=null; armed=false; }

    // кешуємо прямокутники карток один раз на старті drag (не на кожен рух)
    function snapshotRects(){
      cardRects=[];
      grid.querySelectorAll('.fcard[data-fkey]').forEach(c=>{
        cardRects.push({ key:c.dataset.fkey, el:c, r:c.getBoundingClientRect() });
      });
    }
    function cardAt(x,y){
      if(!cardRects) return null;
      for(const it of cardRects){ const r=it.r;
        if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom) return it; }
      return null;
    }
    function begin(card,x,y){
      const key=card.dataset.fkey; if(!key) return;
      const rect=card.getBoundingClientRect();
      const ghost=card.cloneNode(true); ghost.classList.add('fdrag-ghost');
      ghost.style.width=rect.width+'px'; ghost.style.height=rect.height+'px';
      ghost.style.willChange='transform';
      document.body.appendChild(ghost);
      const line=document.createElement('div'); line.className='fdrop-line'; line.style.display='none'; grid.appendChild(line);
      st={ key, card, ghost, line, offX:x-rect.left, offY:y-rect.top, mode:null, targetKey:null, lift:false };
      card.classList.add('fdrag-src'); grid.classList.add('fdragging');
      snapshotRects();
      try{ window.platform.haptic('medium'); }catch(_){}
      lastX=x; lastY=y; scheduleFrame();
    }
    function scheduleFrame(){ if(!rafId) rafId=requestAnimationFrame(frame); }
    function frame(){
      rafId=0; if(!st) return;
      // 1) рух ghost — лише трансформ (GPU)
      const tx=lastX-st.offX, ty=lastY-st.offY;
      st.ghost.style.transform=`translate3d(${tx}px,${ty}px,0) scale(1.06) rotate(-1.5deg)`;
      // 2) визначення цілі — з кешу прямокутників
      const it=cardAt(lastX,lastY);
      const prevTarget=st.targetKey, prevMode=st.mode;
      st.mode=null; st.targetKey=null;
      let intoEl=null, lineStyle=null;
      if(it && it.key!==st.key){
        const okey=it.key, r=it.r, relX=(lastX-r.left)/r.width;
        const forbidden=isDescendantFolder(okey, st.key);
        if(!forbidden && relX>0.28 && relX<0.72){ st.mode='into'; st.targetKey=okey; intoEl=it.el; }
        // «За назвою» порядок задає абетка — переставляти нема чого (вкласти в папку можна)
        else if(folderOpts.sort!=='name' && (folders[okey].parent||'')===(folders[st.key].parent||'')){
          const before=relX<0.5; st.mode='reorder'; st.targetKey=before?okey:nextAfterCached(okey);
          const gr=grid.getBoundingClientRect();
          lineStyle={ top:(r.top-gr.top+r.height*0.15), height:(r.height*0.7),
                      left:((before?r.left:r.right)-gr.left-1.5) };
        }
      }
      // оновлюємо підсвітку лише коли вона змінилась
      if(prevTarget!==st.targetKey || prevMode!==st.mode){
        grid.querySelectorAll('.fdrop-into').forEach(e=>e.classList.remove('fdrop-into'));
        if(intoEl) intoEl.classList.add('fdrop-into');
      }
      if(lineStyle){ st.line.style.display='block'; st.line.style.width='3px';
        st.line.style.top=lineStyle.top+'px'; st.line.style.height=lineStyle.height+'px'; st.line.style.left=lineStyle.left+'px'; }
      else { st.line.style.display='none'; }
    }
    function nextAfterCached(okey){
      const i=cardRects.findIndex(c=>c.key===okey);
      return (i>=0&&i+1<cardRects.length)?cardRects[i+1].key:null;
    }
    function finish(commit){
      if(!st){ cancelPending(); return; }
      if(rafId){ cancelAnimationFrame(rafId); rafId=0; }
      const {key,card,ghost,line,mode,targetKey}=st;
      try{ghost.remove();}catch(_){} try{line.remove();}catch(_){}
      card.classList.remove('fdrag-src'); grid.classList.remove('fdragging');
      grid.querySelectorAll('.fdrop-into').forEach(e=>e.classList.remove('fdrop-into'));
      st=null; cardRects=null; window.__folderDragJustEnded=Date.now();
      if(commit && mode==='into' && targetKey){ try{window.platform.haptic('success');}catch(_){}
        /* відпустили посередині іншої плитки — папка лягає всередину; без «Скасувати» це було мовчки (10.10.2026) */
        const prevParent=(folders[key]&&folders[key].parent)||'';
        moveFolderTo(key,targetKey);
        try{ if(window.flowUndoToast&&folders[key]&&folders[targetKey]) window.flowUndoToast('Покладено в «'+folders[targetKey].name+'»', ()=>moveFolderTo(key,prevParent)); }catch(_){}
        return; }
      if(commit && mode==='reorder'){ try{window.platform.haptic('light');}catch(_){} moveOrderItem(key,targetKey); saveFolders(); renderDashboard(); return; }
      renderDashboard();
    }

    grid.addEventListener('pointerdown',e=>{
      if(e.target.closest('.fmenu')||e.target.closest('.fadd')||e.target.closest('.fc3-photo')) return;
      // ручка перетягування — миттєвий старт без утримання
      const handle=e.target.closest('.fdrag-handle');
      const card=e.target.closest('.fcard[data-fkey]'); if(!card||!grid.contains(card)) return;
      startedKey=card.dataset.fkey; startCard=card; startX=e.clientX; startY=e.clientY; pid=e.pointerId;
      if(handle){
        armed=true;
        try{grid.setPointerCapture(pid);}catch(_){}
        begin(card,e.clientX,e.clientY);
        e.preventDefault(); e.stopPropagation();
        return;
      }
      armed=false;
      holdTimer=setTimeout(()=>{ holdTimer=null; if(startedKey){ armed=true; try{window.platform.haptic('light');}catch(_){} } }, LONG);
    });
    grid.addEventListener('pointermove',e=>{
      if(st){ e.preventDefault(); lastX=e.clientX; lastY=e.clientY; scheduleFrame(); return; }
      if(!startedKey) return;
      const dx=Math.abs(e.clientX-startX), dy=Math.abs(e.clientY-startY);
      if(armed){ if(dx>3||dy>3){ try{grid.setPointerCapture(pid);}catch(_){} begin(startCard,e.clientX,e.clientY); } }
      else if(dx>JITTER||dy>JITTER){ cancelPending(); }
    },{passive:false});
    grid.addEventListener('pointerup',()=>{ if(st) finish(true); else cancelPending(); });
    grid.addEventListener('pointercancel',()=>{ if(st) finish(false); else cancelPending(); });
  }

  /* ════════ ОБКЛАДИНКИ: Галерея · Секції · Бенто (06.10.2026) ════════
     Фото на всю плитку, назва на матовому склі. Папка без фото — кольорова
     обкладинка з великою іконкою і кнопкою «фото» (одразу вибір знімка).
     Ліву колонку проєктів прибрано: проєкти — «Ще → Проєкти» і шторка ⚙. */
  const FC3_IC={
    pin:'<path d="M9 4h6l-1 6 3 3H7l3-3z"/><path d="M12 13v7"/>',
    cam:'<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'
  };
  function fc3Svg(n){ return '<svg class="fc3-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(FC3_IC[n]||'')+'</svg>'; }
  // підпис під назвою: лише те, що справді щось каже («0 активних» — шум)
  function fc3Meta(k,f){
    const n=groupKids(k).length;
    if(n) return 'група · '+n+' '+pluralUk(n,'папка','папки','папок');
    if(f.role==='page') return 'сторінка';
    const active=(f.widgets||[]).filter(w=>w.ready).length;
    return active ? (active+' '+pluralUk(active,'активний','активні','активних')) : '';
  }
  // плитка-обкладинка; shape: '' | 'wide' (карусель секцій) | 'big' | 'tall' (бенто)
  function fc3Tile(k, shape){
    const f=folders[k];
    const isGroup=groupKids(k).length>0;
    const photo=!!(f.photo && folderOpts.covers);
    const el=document.createElement('div');
    el.className='fcard fc3 '+(photo?'fc3-has-photo':'fc3-color')+(isGroup?' fc3-group':'')+(shape?' fc3-'+shape:'');
    { const sc=safeColor(f.c,''); if(sc) el.style.setProperty('--c', sc); }   // порожній/чужий колір не ставимо — спрацює запасний у CSS
    el.dataset.fkey=k;
    const meta=fc3Meta(k,f);
    const emojiShow=(f.emoji&&f.emoji.trim())?esc(f.emoji.trim()):esc((f.name||'?').trim().charAt(0).toUpperCase());
    let h='';
    if(photo){
      const pp=f.photoPos;
      const xf=pp?`transform:translate(${+pp.x||0}%,${+pp.y||0}%) scale(${+pp.scale||1});`:'';
      h+=`<div class="fc3-bg" style="background-image:url('${esc(safeImg(window.photoSrc(f.photo)))}');${xf}"></div><div class="fc3-veil"></div>`;
    } else {
      h+=`<svg class="ico fc3-wm" aria-hidden="true"><use href="#${esc(folderIcon(f))}"/></svg>`;
      // емодзі й лінійна іконка — обидва; яку показати, вирішує тема (як у .fc2)
      h+=`<span class="fc3-ic"><span class="fc2-emj">${emojiShow}</span><svg class="ico fc2-ico" aria-hidden="true"><use href="#${esc(folderIcon(f))}"/></svg></span>`;
      // камера — лише коли фото справді нема: при вимкненому «Фото на всю плитку»
      // знімок у папки є, і новий тихо затер би його (той самий id 'ph_'+key, і в хмарі)
      if(!f.photo) h+=`<button class="fc3-photo" data-fphoto="${esc(k)}" aria-label="Додати фото-обкладинку">${fc3Svg('cam')}</button>`;
    }
    h+=`<div class="fc3-label"><div class="fc3-name" data-i18n-skip="1">${f.pinned?`<span class="fc3-pin" title="Закріплена">${fc3Svg('pin')}</span>`:''}${esc(f.name)}</div>${meta?`<div class="fc3-meta">${esc(meta)}</div>`:''}</div>`;
    h+=`<button class="fmenu fc3-menu" data-fmenu="${esc(k)}" aria-label="Меню папки «${escAttr(f.name)}»" title="Налаштування">⋯</button>`;
    el.innerHTML=h;
    el.onclick=(e)=>{ if(e.target.closest('.fmenu')||e.target.closest('.fc3-photo')) return;
      if(window.__folderDragJustEnded && Date.now()-window.__folderDragJustEnded<400) return;
      if(isGroup){ openFolderGroup(k); return; }
      goFolder(k); };
    return el;
  }
  // група в «Секціях»: рядок зі стосом мініатюр (сама група + до двох її папок)
  function fc3GroupRow(k){
    const f=folders[k], kids=groupKids(k);
    const el=document.createElement('div');
    el.className='fcard fc3-grow'; el.dataset.fkey=k;
    { const sc=safeColor(f.c,''); if(sc) el.style.setProperty('--c', sc); }
    const th=[k].concat(kids).slice(0,3).map((ck,i)=>{
      const cf=folders[ck], ph=!!(cf.photo&&folderOpts.covers);
      return `<span class="fc3-th" style="--i:${i};--c:${safeColor(cf.c,'#6a7dff')};${ph?`background-image:url('${esc(safeImg(window.photoSrc(cf.photo)))}')`:''}"></span>`;
    }).reverse().join('');
    el.innerHTML=`<span class="fc3-stack" aria-hidden="true">${th}</span>`+
      `<span class="fc3-gt"><b data-i18n-skip="1">${esc(f.name)}</b><small>${kids.length} ${pluralUk(kids.length,'папка','папки','папок')} всередині</small></span>`+
      `<button class="fmenu fc3-menu" data-fmenu="${esc(k)}" aria-label="Меню групи «${escAttr(f.name)}»" title="Налаштування">⋯</button>`;
    el.onclick=(e)=>{ if(e.target.closest('.fmenu')) return;
      if(window.__folderDragJustEnded && Date.now()-window.__folderDragJustEnded<400) return;
      openFolderGroup(k); };
    return el;
  }
  function fc3Add(){
    const a=document.createElement('button'); a.type='button'; a.className='fc3-add';
    a.innerHTML='<span class="fc3-plus" aria-hidden="true">＋</span><span>Нова папка</span>';
    a.onclick=()=>createFolder();
    return a;
  }
  function renderFolderCovers(grid, keys){
    const v=homeFolderView;
    grid.classList.add('fsz-'+folderOpts.size);
    if(v==='sections'){
      const pinned=keys.filter(k=>folders[k].pinned);
      const groups=keys.filter(k=>!folders[k].pinned && groupKids(k).length);
      const rest=keys.filter(k=>!folders[k].pinned && !groupKids(k).length);
      const sec=(title,n,cls)=>{
        const s=document.createElement('div'); s.className='fsec';
        s.innerHTML=`<div class="fsec-h"><span>${title}</span>${n?`<small>${n}</small>`:''}</div><div class="${cls}"></div>`;
        grid.appendChild(s); return s.lastElementChild;
      };
      if(pinned.length){ const row=sec('Закріплені',pinned.length,'fsec-row'); pinned.forEach(k=>row.appendChild(fc3Tile(k,'wide'))); }
      if(groups.length){ const box=sec('Групи',groups.length,'fsec-groups'); groups.forEach(k=>box.appendChild(fc3GroupRow(k))); }
      const all=sec((pinned.length||groups.length)?'Усі папки':'Папки',0,'fsec-grid');
      rest.forEach(k=>all.appendChild(fc3Tile(k,'')));
      all.appendChild(fc3Add());
      return;
    }
    // Бенто: перша закріплена — велика, групи — високі, решта — квадрати
    let bigUsed=false;
    keys.forEach(k=>{
      let shape='';
      if(v==='bento'){
        if(!bigUsed && folders[k].pinned){ shape='big'; bigUsed=true; }
        else if(groupKids(k).length) shape='tall';
      }
      grid.appendChild(fc3Tile(k,shape));
    });
    grid.appendChild(fc3Add());
  }
  function renderDashboard(){
    try{ window.__renderDashboard=renderDashboard; }catch(_){}
    try{ renderHeroStreak(); }catch(_){}
    const grid = document.getElementById('folderGrid');
    grid.innerHTML='';
    grid.classList.remove('fv-list','fv-grid','fv-cover','fv-compact','fv2-list','fv2-grid','fv2-deck','fv2-mag',
      'fv2-gallery','fv2-sections','fv2-bento','fsz-s','fsz-m','fsz-l');
    grid.classList.add('fv2-'+homeFolderView);
    applyFolderViewIcon();
    // вкладка «Чати» на Огляді (36-chats.js): замість сітки папок — список чатів
    try{ if(chatsHomeSync()) return; }catch(e){ console.error('chatsHomeSync',e); }
    // 🚀 проєкти переїхали на вкладку «Проєкти»: Робота + папки-проєкти не показуємо в Огляді
    let keys=topFolderKeys().filter(folderVisible).filter(k=>k!=='work' && !(folders[k]&&folders[k].role==='project'));
    // «за назвою»: закріплені однаково зверху, решта — за абеткою
    if(folderOpts.sort==='name') keys=keys.slice().sort((a,b)=>
      ((folders[b].pinned?1:0)-(folders[a].pinned?1:0)) || String(folders[a].name||'').localeCompare(String(folders[b].name||''),'uk'));
    if(FV_COVER.includes(homeFolderView)) renderFolderCovers(grid, keys);
    else {
    keys.forEach((k,idx)=>{
      const f=folders[k]; if(!f) return;
      const active = (f.widgets||[]).filter(w=>w.ready).length;
      const subCount = childFolderKeys(k).length;
      // група: у папці лежать інші папки (проєкти не рахуємо — вони живуть на вкладці «Проєкти»)
      const kids = groupKids(k), isGroup = kids.length>0;
      const emojiShow = (f.emoji && f.emoji.trim()) ? esc(f.emoji.trim()) : esc((f.name||'?').trim().charAt(0).toUpperCase());
      const pinDot = f.pinned ? `<span class="fpin">📌</span>` : '';
      const subBadge = (subCount && !isGroup) ? `<span class="fsub">📁 ${subCount}</span>` : '';
      // метарядок залежно від ролі папки
      let metaHtml;
      if(isGroup){
        metaHtml=`<div class="fstat fgrp-stat"><span class="fgrp-mini" aria-hidden="true">${kids.slice(0,3).map(ck=>fgIcon(folders[ck],'fgrp-mi')).join('')}</span><b>${kids.length}</b> ${pluralUk(kids.length,'папка','папки','папок')} · група</div>`;
      } else if(f.role==='project'){
        const st=projStatusMeta(f.status||'active');
        const pr=folderProgress(k);
        const dl=dueLabel(f.due);
        metaHtml=`<div class="fproj">
            <span class="fchip" style="--stc:${st[2]}">${st[1]}</span>
            ${pr.total?`<span class="fprg"><i style="width:${pr.pct}%"></i></span><span class="fprg-t">${pr.done}/${pr.total}</span>`:''}
            ${dl?`<span class="fdue ${dl.late?'late':''}">${dl.t}</span>`:''}
          </div>`;
      } else if(f.role==='page'){
        metaHtml=`<div class="fstat">📄 сторінка</div>`;
      } else {
        metaHtml=f.pct?`<div class="fstat">${f.pct}%</div>`:'';
      }
      // ── v2 (Список · Журнал): єдина розмітка, режим вирішує лише клас-обгортку ──
      const modeClass = homeFolderView==='mag' ? 'fc2-mag' : 'fc2-row';
      const el=document.createElement('div');
      el.className='fcard fc2 '+modeClass+(isGroup?' fc2-group':'');
      // Порожній колір НЕ виставляємо: інакше в --c потрапляє сміття,
      // color-mix() у стилях ламається і картка лишається без фону.
      // Краще не задати нічого — тоді спрацює запасне значення в CSS.
      if(f.c) el.style.setProperty('--c', f.c);
      el.dataset.fkey=k;
      let inner='';
      if(f.photo){
        const pp=f.photoPos;
        const xf=pp?`transform:translate(${+pp.x||0}%,${+pp.y||0}%) scale(${+pp.scale||1});`:'';
        inner+=`<div class="fc2-bg" style="background-image:url('${safeImg(window.photoSrc(f.photo))}');${xf}"></div>`;
      }
      else { el.classList.add('nocover'); }
      inner+=`<div class="fc2-veil"></div>`+pinDot+subBadge;
      // Емодзі й іконка малюються обидва, показує CSS лише одне: у старих
      // темах — емодзі, у нових (desk-*/studio-*) — лінійну іконку. Так
      // перемикання теми міняє вигляд миттєво, без перемальовування списку.
      inner+=`<div class="fc2-em"><span class="fc2-emj">${emojiShow}</span>`+
             `<svg class="ico fc2-ico" aria-hidden="true"><use href="#${esc(folderIcon(f))}"/></svg></div>`;
      inner+=`<div class="fc2-body"><div class="fc2-name" data-i18n-skip="1">${esc(f.name)}</div>${metaHtml}</div>`;
      inner+=`<button class="fmenu" data-fmenu="${esc(k)}" title="Налаштування" aria-label="Налаштування папки">⋯</button>`+
             `<button class="fdrag-handle" title="Перетягнути" aria-label="Перетягнути">⠿</button>`;
      el.innerHTML=inner;
      el.onclick=(e)=>{ if(e.target.closest('.fmenu')) return;
        if(window.__folderDragJustEnded && Date.now()-window.__folderDragJustEnded<400) return;
        if(isGroup){ openFolderGroup(k); return; }
        goFolder(k); };
      grid.appendChild(el);
    });
    // add-folder card — під поточний режим
    const add=document.createElement('div');
    add.className='fc2 fc2-add '+(homeFolderView==='mag'?'fc2-mag-add':'fc2-row-add');
    add.innerHTML=`<div class="fc2-plus">＋</div><div class="fc2-addt">Нова папка</div>`;
    add.onclick=createFolder;
    grid.appendChild(add);
    }
    // bind menus
    grid.querySelectorAll('[data-fmenu]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); openFolderMenu(b.dataset.fmenu); });
    // «фото» на кольоровій обкладинці — одразу вибір знімка
    grid.querySelectorAll('[data-fphoto]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); pickFolderPhoto(b.dataset.fphoto); });
    try{ const cb=document.getElementById('folderCountBadge'); if(cb) cb.textContent=topFolderKeys().filter(folderVisible).filter(k=>k!=='work' && !(folders[k]&&folders[k].role==='project')).length; }catch(_){}
    if(!grid.__dragInit){ grid.__dragInit=true; enableFolderDrag(grid); }
    try{ requestAnimationFrame(()=>{ if(typeof fcCheckOverlap==='function') fcCheckOverlap(); }); }catch(_){}
  }

  /* ===== folder actions ===== */
  // in-app input modal (replaces blocked prompt)
  function inputModal(opts){
    // opts: {title, value, placeholder, emoji (bool), onOk(val, emojiVal)}
    const o=opts||{};
    const ov=document.createElement('div'); ov.className='imodal';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');   // шторка модальна для VoiceOver
    const emojiRow = o.emoji ? `
      <div class="im-label">Емодзі (необов'язково)</div>
      <div class="im-emoji-row">
        <input class="im-emoji" maxlength="4" value="${escAttr(o.emojiVal||'')}" placeholder="напр. 💰">
        <button type="button" class="im-noemoji">Без емодзі</button>
      </div>` : '';
    ov.innerHTML=`<div class="im-in">
      <div class="im-grip"></div>
      <div class="im-title">${esc(o.title||'Назва')}</div>
      <input class="im-input" value="${escAttr(o.value||'')}" placeholder="${escAttr(o.placeholder||'Введи назву')}">
      ${emojiRow}
      <div class="im-btns">
        <button type="button" class="im-cancel">Скасувати</button>
        <button type="button" class="im-ok">Готово</button>
      </div>
    </div>`;
    document.body.appendChild(ov);
    const inp=ov.querySelector('.im-input');
    const emo=ov.querySelector('.im-emoji');
    setTimeout(()=>{ try{ inp.focus(); inp.select&&inp.select(); }catch(_){} },60);
    const close=()=>ov.remove();
    ov.querySelector('.im-cancel').onclick=close;
    ov.onclick=e=>{ if(e.target===ov) close(); };
    if(o.emoji){ ov.querySelector('.im-noemoji').onclick=()=>{ emo.value=''; }; }
    const ok=()=>{ const v=inp.value.trim(); const ev=o.emoji?(emo.value.trim()):undefined; close(); if(o.onOk) o.onOk(v, ev); };
    ov.querySelector('.im-ok').onclick=ok;
    inp.onkeydown=e=>{ if(e.key==='Enter') ok(); };
  }

  // parent — ключ групи, якщо папку створюють зі шторки групи (з картки «＋» приходить подія — її ігноруємо)
  function createFolder(parent){
    const par=(typeof parent==='string' && folders[parent]) ? parent : '';
    inputModal({ title:par?('Нова папка в «'+folders[par].name+'»'):'Нова папка', placeholder:'Назва папки', emoji:true, emojiVal:'📁',
      onOk:(name, emojiVal)=>{
        const used=order.length;
        const nm = name || ('Папка '+(used+1));
        const key='f_'+Date.now();
        const em=(emojiVal!==undefined?emojiVal:FOLDER_EMOJIS[used%FOLDER_EMOJIS.length]);
        folders[key]={ key, c:FOLDER_COLORS[used%FOLDER_COLORS.length],
          emoji:em, icon:folderIconFor(em),
          name:nm, pct:0, photo:'', flayout:'a', pinned:false, custom:true, widgets:[] };
        if(par) folders[key].parent=par;
        order.push(key);
        saveFolders(); renderDashboard();
        if(par) openFolderGroup(par);
      }});
  }

  /* ════════ ГРУПИ ПАПОК (варіант A «Стос», 03.10.2026) ════════
     Група — звичайна папка, в якій лежать інші (поле parent). На головній вона
     стосом карток, тап відкриває шторку зі списком її папок. Формат даних той
     самий, що й у «Перемістити в папку»; усе пишеться лише з дії людини. */
  function groupKids(key){
    return childFolderKeys(key).filter(folderVisible).filter(ck=>folders[ck].role!=='project');
  }
  function fgIcon(f, cls){
    return `<span class="${cls||'fgs-ic'}" style="--c:${safeColor(f.c,'#6a7dff')}"><svg class="ico" aria-hidden="true"><use href="#${esc(folderIcon(f))}"/></svg></span>`;
  }
  function fgSub(ck){
    const n=groupKids(ck).length;
    if(n) return n+' '+pluralUk(n,'папка','папки','папок')+' · група';
    const pr=folderProgress(ck), open=pr.total-pr.done;
    if(!pr.total) return 'поки порожньо';
    return open ? (open+' '+pluralUk(open,'справа','справи','справ')+' відкрито') : 'усі справи виконано';
  }
  function fgToast(m){ try{ (window.__flowToast||function(){})(m); }catch(_){} }
  function fgSheet(html, bind){
    closeFolderMenu();
    const m=document.createElement('div');
    m.className='fmenu-sheet'; m.id='fmenuSheet';
    m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true');
    m.innerHTML=`<div class="fmenu-in fgs">${html}</div>`;
    m.onclick=e=>{ if(e.target===m) closeFolderMenu(); };
    document.body.appendChild(m);
    bind(m);
    return m;
  }
  // шторка групи: нотатки самої папки + її папки + додати
  function openFolderGroup(key){
    const g=folders[key]; if(!g) return;
    const kids=groupKids(key);
    const go=(k)=>{ closeFolderMenu(); window.__fgNext=key; goFolder(k); window.__fgNext=null; };   // goSpaceFor читає мітку одразу
    fgSheet(`<div class="fmenu-grip"></div>
      <div class="fgs-head">${fgIcon(g,'fgs-ic fgs-ic-lg')}
        <div class="fgs-ht"><b data-i18n-skip="1">${esc(g.name)}</b><small>група · ${kids.length} ${pluralUk(kids.length,'папка','папки','папок')}</small></div>
        <button class="fgs-more" data-gmore aria-label="Налаштування групи">⋯</button></div>
      <button class="fgs-row" data-gnotes><span class="fgs-ic fgs-doc" style="--c:${safeColor(g.c,'#6a7dff')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4M9 12.5h6M9 16h4"/></svg></span>
        <span class="fgs-t"><b>Нотатки групи</b><small data-i18n-skip="1">документ папки «${esc(g.name)}»</small></span><span class="fgs-go">›</span></button>
      ${kids.map(ck=>`<button class="fgs-row" data-gkid="${esc(ck)}">${fgIcon(folders[ck])}
        <span class="fgs-t"><b data-i18n-skip="1">${esc(folders[ck].name)}</b><small>${esc(fgSub(ck))}</small></span><span class="fgs-go">›</span></button>`).join('')}
      <div class="fgs-add"><button data-gnew>＋ Нова папка</button><button data-gadd>Додати наявну</button></div>`,
    m=>{
      m.querySelector('[data-gmore]').onclick=()=>openFolderMenu(key);
      m.querySelector('[data-gnotes]').onclick=()=>go(key);
      m.querySelectorAll('[data-gkid]').forEach(b=>b.onclick=()=>{
        const ck=b.dataset.gkid;
        if(groupKids(ck).length){ openFolderGroup(ck); return; }   // група в групі — своя шторка
        go(ck);
      });
      m.querySelector('[data-gnew]').onclick=()=>{ closeFolderMenu(); createFolder(key); };
      m.querySelector('[data-gadd]').onclick=()=>openFolderGroupAdd(key);
    });
    try{ window.platform.haptic('light'); }catch(_){}
  }
  // додати в групу папку, що вже є на головній
  function openFolderGroupAdd(key){
    const cand=topFolderKeys().filter(folderVisible).filter(k=>k!==key && k!=='work' && folders[k].role!=='project' && !isDescendantFolder(key,k));
    fgSheet(`<div class="fmenu-grip"></div>
      <div class="fmenu-title">Додати в «<span data-i18n-skip="1">${esc(folders[key].name)}</span>»</div>
      ${cand.map(k=>`<button class="fgs-row" data-gpick="${esc(k)}">${fgIcon(folders[k])}<span class="fgs-t"><b data-i18n-skip="1">${esc(folders[k].name)}</b></span><span class="fgs-go">＋</span></button>`).join('')
        || '<div class="fmi-label">На головній немає інших папок</div>'}
      <button class="fmi" data-gback>‹ Назад до групи</button>`,
    m=>{
      m.querySelectorAll('[data-gpick]').forEach(b=>b.onclick=()=>{
        moveFolderTo(b.dataset.gpick, key);
        try{ window.platform.haptic('success'); }catch(_){}
        openFolderGroup(key);
      });
      m.querySelector('[data-gback]').onclick=()=>openFolderGroup(key);
    });
  }
  // «Обʼєднати»: кілька папок з головної → нова група
  function openFolderMerge(){
    const cand=topFolderKeys().filter(folderVisible).filter(k=>k!=='work' && folders[k].role!=='project');
    const sel=new Set();
    fgSheet(`<div class="fmenu-grip"></div>
      <div class="fmenu-title">Обʼєднати в групу</div>
      <label class="fgm-lbl" for="fgmName">Назва групи</label>
      <input class="fgm-name" id="fgmName" maxlength="60" placeholder="напр. Фінанси" autocomplete="off">
      <div class="fmi-label">Які папки</div>
      ${cand.map(k=>`<button class="fgs-row" data-gsel="${esc(k)}" aria-pressed="false">${fgIcon(folders[k])}<span class="fgs-t"><b data-i18n-skip="1">${esc(folders[k].name)}</b>${groupKids(k).length?'<small>група</small>':''}</span><span class="fgm-chk" aria-hidden="true"></span></button>`).join('')}
      <button class="fgm-ok" data-gok disabled>Обери хоча б дві папки</button>`,
    m=>{
      const ok=m.querySelector('[data-gok]'), inp=m.querySelector('#fgmName');
      const sync=()=>{ ok.disabled=sel.size<2; ok.textContent=sel.size<2?'Обери хоча б дві папки':('Обʼєднати '+sel.size+' '+pluralUk(sel.size,'папку','папки','папок')); };
      m.querySelectorAll('[data-gsel]').forEach(b=>b.onclick=()=>{
        const k=b.dataset.gsel; if(sel.has(k)) sel.delete(k); else sel.add(k);
        b.classList.toggle('on',sel.has(k)); b.setAttribute('aria-pressed',sel.has(k)?'true':'false');
        try{ window.platform.haptic('select'); }catch(_){}
        sync();
      });
      ok.onclick=()=>{
        if(sel.size<2) return;
        const picked=cand.filter(k=>sel.has(k));
        const nm=(inp.value||'').trim()||'Група';
        const key='f_'+Date.now(), used=order.length;
        folders[key]={ key, c:FOLDER_COLORS[used%FOLDER_COLORS.length], emoji:'🗂', icon:folderIconFor('🗂'),
          name:nm, pct:0, photo:'', flayout:'a', pinned:false, custom:true, widgets:[] };
        // група стає на місце першої обраної папки
        const at=order.indexOf(picked[0]);
        if(at>=0) order.splice(at,0,key); else order.push(key);
        picked.forEach(k=>{ folders[k].parent=key; });
        saveFolders(); renderDashboard();
        try{ window.platform.haptic('success'); }catch(_){}
        fgToast('Група «'+nm+'»: '+picked.length+' '+pluralUk(picked.length,'папка','папки','папок'));
        openFolderGroup(key);
      };
      setTimeout(()=>{ try{ inp.focus(); }catch(_){} },120);
    });
  }
  /* ── шторка ⚙ «Вигляд папок» (06.10.2026): замість рядка «Список · Сітка ·
     Журнал · Обʼєднати» на головній. Кожен вибір застосовується одразу. ── */
  const FV_PREV={
    gallery:'<i></i><i></i><i></i><i></i>',
    sections:'<i class="w"></i><i class="r"></i><i></i><i></i>',
    bento:'<i class="w"></i><i class="t"></i><i></i><i></i>',
    list:'<i class="r"></i><i class="r"></i><i class="r"></i>',
    mag:'<i class="m"></i><i class="m"></i>'
  };
  function openFolderViewSheet(){
    const seg=(name,label,opts,cur)=>`<div class="fvs-lbl">${label}</div><div class="fvs-seg" role="group" aria-label="${label}">`+
      opts.map(([v,t])=>`<button type="button" data-fo="${name}" data-v="${v}" class="${cur===v?'on':''}" aria-pressed="${cur===v}">${t}</button>`).join('')+`</div>`;
    fgSheet(`<div class="fmenu-grip"></div>
      <div class="fvs-head"><b>Вигляд папок</b><button type="button" class="fvs-done" data-fvdone>Готово</button></div>
      <div class="fvs-views">${FV_ORDER.map(v=>`<button type="button" class="fvs-view${v===homeFolderView?' on':''}" data-fv="${v}" aria-pressed="${v===homeFolderView}"><span class="fvs-prev fvs-prev-${v}" aria-hidden="true">${FV_PREV[v]}</span><span class="fvs-vn">${FV_NAME[v]}</span></button>`).join('')}</div>
      ${seg('size','Розмір плиток',[['l','Великі'],['m','Звичайні'],['s','Дрібні']],folderOpts.size)}
      ${seg('sort','Порядок',[['manual','Вручну'],['name','За назвою']],folderOpts.sort)}
      <button type="button" class="fvs-tog" data-fotog role="switch" aria-checked="${folderOpts.covers?'true':'false'}"><span class="fvs-tt">Фото на всю плитку<small>вимкнеш — усі папки будуть кольоровими обкладинками</small></span><i class="fvs-sw" aria-hidden="true"></i></button>
      <div class="fvs-acts">
        ${fmRow('merge','group','Обʼєднати папки в групу','')}
        ${fmRow('newf','plus','Нова папка','')}
        ${fmRow('projects','proj','Проєкти','окремий екран зі статусами й дедлайнами')}
      </div>`,
    m=>{
      m.querySelectorAll('[data-fv]').forEach(b=>b.onclick=()=>{
        setFolderView(b.dataset.fv);
        m.querySelectorAll('[data-fv]').forEach(x=>{ const on=x.dataset.fv===homeFolderView; x.classList.toggle('on',on); x.setAttribute('aria-pressed',on?'true':'false'); });
      });
      m.querySelectorAll('[data-fo]').forEach(b=>b.onclick=()=>{
        const k=b.dataset.fo; setFolderOpt(k,b.dataset.v);
        m.querySelectorAll('[data-fo="'+k+'"]').forEach(x=>{ const on=x.dataset.v===folderOpts[k]; x.classList.toggle('on',on); x.setAttribute('aria-pressed',on?'true':'false'); });
      });
      const tg=m.querySelector('[data-fotog]');
      tg.onclick=()=>{ setFolderOpt('covers', folderOpts.covers?0:1); tg.setAttribute('aria-checked',folderOpts.covers?'true':'false'); };
      m.querySelector('[data-fvdone]').onclick=closeFolderMenu;
      m.querySelectorAll('.fvs-acts [data-act]').forEach(b=>b.onclick=()=>{
        const a=b.dataset.act;
        if(a==='merge'){ openFolderMerge(); return; }
        closeFolderMenu();
        if(a==='newf') createFolder();
        else if(a==='projects'){ try{ goProjects(); }catch(e){ console.error('goProjects',e); } }
      });
    });
    try{ window.platform.haptic('light'); }catch(_){}
  }
  { const b=document.getElementById('folderLookBtn'); if(b) b.onclick=openFolderViewSheet; }
  try{ window.openFolderGroup=openFolderGroup; }catch(_){}

  /* ════════ ВЕРХНІЙ БАР ДОКУМЕНТА (крок 2, 03.10.2026) ════════
     Було: 6 значків без підписів (Темна, Світла, Скасувати, Сховані, Мікрофон,
     На весь екран) і синій «+» (додати чат). Стало: «‹ · шлях групи · Назва ▾ · ⋯».
     Старі кнопки лишаються в DOM прихованими (їхні обробники в page-editor),
     «⋯» просто натискає їх. Мікрофон під час запису видно в барі (клас live). */
  function pgBarFolder(){ try{ const base=String(boardKey||'').split('__sp_')[0]; return folders[base]?base:''; }catch(_){ return ''; } }
  // група, між папками якої можна перемикатись: батько папки або вона сама, якщо це група
  function pgBarSwitchGroup(fk){
    const f=folders[fk]; if(!f) return '';
    if(f.parent && folders[f.parent] && groupKids(f.parent).includes(fk)) return f.parent;
    return groupKids(fk).length ? fk : '';
  }
  function pgBarSync(){
    const crumb=document.getElementById('pgCrumb'), up=document.getElementById('pgCrumbUp'), nm=document.getElementById('pgCrumbName');
    if(!crumb||!up||!nm) return;
    const fk=pgBarFolder(), f=fk?folders[fk]:null;
    if(!f){ crumb.hidden=true; return; }
    crumb.hidden=false;
    const par=(f.parent && folders[f.parent] && groupKids(f.parent).includes(fk)) ? f.parent : '';
    up.hidden=!par;
    if(par){ up.textContent=folders[par].name+' ›'; up.setAttribute('aria-label','До групи «'+folders[par].name+'»'); }
    nm.querySelector('.pgb-nm').textContent=f.name||'';
    const sw=pgBarSwitchGroup(fk);
    nm.classList.toggle('sw',!!sw); nm.disabled=!sw;
    nm.setAttribute('aria-label', sw ? ('«'+(f.name||'')+'» — перейти до іншої папки групи') : (f.name||''));
  }
  function pgBarHasCond(){
    let any=false;
    const walk=a=>(Array.isArray(a)?a:[]).forEach(b=>{ if(any||!b) return; if(b.cond&&b.cond.on){ any=true; return; } if(Array.isArray(b.children)) walk(b.children); });
    try{ walk(boards[boardKey]); }catch(_){}
    return any;
  }
  // ▾ — інші папки цієї групи
  function pgBarSwitchSheet(){
    const fk=pgBarFolder(), g=pgBarSwitchGroup(fk); if(!g) return;
    const kids=groupKids(g);
    const row=(k,label,sub)=>`<button class="fgs-row${k===fk?' on':''}" data-pgsw="${esc(k)}"${k===fk?' aria-current="page"':''}>${fgIcon(folders[k])}
      <span class="fgs-t"><b data-i18n-skip="1">${esc(label)}</b>${sub?`<small>${esc(sub)}</small>`:''}</span><span class="fgs-go">${k===fk?'✓':'›'}</span></button>`;
    fgSheet(`<div class="fmenu-grip"></div>
      <div class="fmenu-title">Перейти в «<span data-i18n-skip="1">${esc(folders[g].name)}</span>»</div>
      ${row(g,'Нотатки групи','документ папки «'+folders[g].name+'»')}
      ${kids.map(k=>row(k,folders[k].name,'')).join('')}`,
    m=>{
      m.querySelectorAll('[data-pgsw]').forEach(b=>b.onclick=()=>{
        const k=b.dataset.pgsw; closeFolderMenu();
        if(k===fk) return;
        if(k!==g && groupKids(k).length){ goHome(); setTimeout(()=>openFolderGroup(k),60); return; }   // група в групі — її шторка
        window.__fgNext=g; goFolder(k); window.__fgNext=null;
      });
    });
  }
  // ⋯ — рідкісні дії документа + налаштування папки
  function pgBarMoreSheet(){
    const fk=pgBarFolder();
    const undo=document.getElementById('pgUndoBtn'), hid=document.getElementById('pgShowHiddenBtn');
    const mic=document.getElementById('pgMicBtn'), wide=document.getElementById('pgWideBtn');
    const theme=(window.__pgThemeIsAuto&&window.__pgThemeIsAuto())?'auto':(document.getElementById('scr-page').classList.contains('pg-paper')?'paper':'ink');
    const live=!!(mic&&mic.classList.contains('live'));
    const wideOn=document.getElementById('scr-page').classList.contains('pg-wide');
    const hasCond=pgBarHasCond(), hidOn=!!(hid&&hid.classList.contains('on'));
    const r=(act,ic,t,sub,dis)=>`<button class="fmi pgb-row" data-pgm="${act}"${dis?' disabled':''}><span class="pgb-ic" aria-hidden="true">${ic}</span><span class="pgb-tx">${t}${sub?`<small class="fmi-sub">${sub}</small>`:''}</span></button>`;
    fgSheet(`<div class="fmenu-grip"></div>
      ${fk?`<div class="fmenu-title" data-i18n-skip="1">${esc(folders[fk].name)}</div>`:''}
      ${r('undo','↶','Скасувати','', !(undo&&!undo.disabled))}
      ${r('mic','🎙',live?'Зупинити диктування':'Диктувати','у блок, де стоїть курсор')}
      ${r('wide','⛶',wideOn?'Звичайна ширина':'На весь екран','')}
      ${hasCond?r('hid','◌',hidOn?'Ховати блоки з умовою':'Показати сховані блоки','блоки з умовою показу'):''}
      <div class="fmi-label">Тема документа</div>
      <div class="pgb-seg" role="group" aria-label="Тема документа">
        <button data-pgth="auto" class="${theme==='auto'?'on':''}" aria-pressed="${theme==='auto'}">Як застосунок</button>
        <button data-pgth="ink" class="${theme==='ink'?'on':''}" aria-pressed="${theme==='ink'}">Темна</button>
        <button data-pgth="paper" class="${theme==='paper'?'on':''}" aria-pressed="${theme==='paper'}">Світла</button></div>
      ${fk?`<div class="fmi-label">Папка</div>
      ${r('chats','💬','Чати папки','повʼязати новий чи наявний чат','')}
      ${r('fmenu','⚙︎','Налаштування папки','назва, колір, група, видалення','')}`:''}`,
    m=>{
      const run=(fn)=>{ closeFolderMenu(); setTimeout(fn,60); };
      m.querySelectorAll('[data-pgm]').forEach(b=>b.onclick=()=>{
        const a=b.dataset.pgm;
        if(a==='undo') run(()=>undo&&undo.click());
        if(a==='mic') run(()=>mic&&mic.click());
        if(a==='wide') run(()=>wide&&wide.click());
        if(a==='hid') run(()=>hid&&hid.click());
        if(a==='chats') run(()=>{ const pa=document.getElementById('pgAddLink'); if(pa) pa.click(); });
        if(a==='fmenu') run(()=>openFolderMenu(fk));
      });
      m.querySelectorAll('[data-pgth]').forEach(b=>b.onclick=()=>{
        if(b.dataset.pgth==='auto'){ try{ window.__pgThemeAuto&&window.__pgThemeAuto(); }catch(_){} }
        else { const t=document.querySelector('#pgTheme [data-pgtheme="'+b.dataset.pgth+'"]'); if(t) t.click(); }
        m.querySelectorAll('[data-pgth]').forEach(x=>{ const on=x===b; x.classList.toggle('on',on); x.setAttribute('aria-pressed',on); });
      });
    });
  }
  function pgBarInit(){
    const top=document.querySelector('#scr-page .pg-top'); if(!top||top.__pgb) return;
    top.__pgb=true; top.classList.add('pgb-v2');
    const up=document.getElementById('pgCrumbUp'), nm=document.getElementById('pgCrumbName'), more=document.getElementById('pgMoreBtn');
    if(up) up.onclick=()=>{ const f=folders[pgBarFolder()]; const p=f&&f.parent; goHome(); if(p&&folders[p]) setTimeout(()=>openFolderGroup(p),60); };
    if(nm) nm.onclick=pgBarSwitchSheet;
    if(more) more.onclick=pgBarMoreSheet;
    // шлях і назва оновлюються при кожному відкритті документа
    if(typeof window.openFlowPage==='function' && !window.openFlowPage.__pgb){
      const orig=window.openFlowPage;
      const wrapped=function(opts){ orig(opts); try{ pgBarSync(); }catch(e){ console.error('pgBar',e); } };
      wrapped.__pgb=true; ['__chats','__sph'].forEach(k=>{ if(orig[k]) wrapped[k]=true; });
      window.openFlowPage=wrapped;
    }
  }
  // openFlowPage зʼявляється в page-editor — пізніше за core, тож чекаємо кінця розбору сторінки
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{ try{ pgBarInit(); }catch(e){ console.error('pgBarInit',e); } });
  else { try{ pgBarInit(); }catch(e){ console.error('pgBarInit',e); } }
  try{ window.pgBarSync=pgBarSync; }catch(_){}
  // 🚀 створити папку-проєкт зі шторки «＋»: якщо ми всередині папки — вкладаємо в неї
  function createProjectFolder(){
    inputModal({ title:'Новий проєкт', placeholder:'Назва проєкту', emoji:true, emojiVal:'🚀',
      onOk:(name, emojiVal)=>{
        const nm=(name||'').trim(); if(!nm) return;
        const used=order.length;
        const key='f_'+Date.now();
        // контекст: якщо активна дошка належить папці — робимо проєкт її дочірньою папкою
        let parent='';
        try{ const act=document.querySelector('.screen.active'); const base=String(boardKey||'').split('__sp_')[0];
          if(act && act.id==='scr-page' && base && base!=='__root__' && base!=='all' && folders[base]) parent=base; }catch(_){}
        const em=(emojiVal!==undefined&&emojiVal!==''?emojiVal:'🚀');
        folders[key]={ key, c:FOLDER_COLORS[used%FOLDER_COLORS.length],
          emoji:em, icon:folderIconFor(em),
          name:nm, pct:0, photo:'', flayout:'a', pinned:false, custom:true, widgets:[],
          parent, role:'project', status:'active', due:'' };
        order.push(key);
        saveFolders();
        try{ renderDashboard(); }catch(_){}
        try{ if(typeof renderBoard==='function') renderBoard(); }catch(_){}
        try{ if(typeof renderProjects==='function') renderProjects(); }catch(_){}
        flowAlert('Проєкт «'+nm+'» створено'+(parent&&folders[parent]?(' у папці «'+folders[parent].name+'»'):' у вкладці «Проєкти»')+'.\nВіджети «Пульт», «Пайплайн», «Фокус-стек» і «Таймлайн» бачать його автоматично.');
        try{ flowReact('folder',{say:true}); }catch(_){}
      }});
  }
  /* ══ Кадрування фото: щипок = масштаб, перетягування = зсув, колесо миші = масштаб (ноут) ══
     Повертає {x,y,scale} — x/y у відсотках зсуву, scale 1..3. Застосовується як
     CSS transform: translate(x%,y%) scale(scale) на елементі з background-size:cover
     або <img style="object-fit:cover"> у контейнері з overflow:hidden. */
  function openPhotoCropEditor(opts){
    var st = Object.assign({x:0,y:0,scale:1}, opts.pos||{});
    var ov=document.createElement('div'); ov.className='pce-ov';
    ov.innerHTML='<div class="pce-top"><button class="pce-x" data-pcex>✕ Скасувати</button>'
      +'<span class="pce-t">'+esc(opts.title||'Кадрувати фото')+'</span>'
      +'<button class="pce-ok" data-pceok>Готово</button></div>'
      +'<div class="pce-stage" data-pcestage><div class="pce-img" data-pceimg></div></div>'
      +'<div class="pce-hint">Тягни пальцем, щоб змістити · щипни двома пальцями (або крутни колесо миші), щоб змінити масштаб</div>'
      +'<button class="pce-reset" data-pcereset>Скинути</button>';
    document.body.appendChild(ov);
    var stage=ov.querySelector('[data-pcestage]');
    var im=ov.querySelector('[data-pceimg]');
    /* Через safeImg: фото тут може прийти з імпортованого бекапу, де тип у
       data-URL підроблено ("image/jpeg'),url('https://…") — без фільтра
       редактор підвантажив би чужу адресу. Звичайний показ фото це вже
       відкидав; тепер і кадрування мрій, папок і документів. */
    im.style.backgroundImage="url('"+safeImg(opts.img)+"')";
    function clampScale(s){ return Math.max(1,Math.min(3,s)); }
    function clampOff(v,scale){ var m=(scale-1)*50; return Math.max(-m,Math.min(m,v)); }
    function apply(){
      st.scale=clampScale(st.scale);
      st.x=clampOff(st.x,st.scale); st.y=clampOff(st.y,st.scale);
      im.style.transform='translate('+st.x+'%,'+st.y+'%) scale('+st.scale+')';
    }
    apply();
    var pts={}, gest=null;
    function dist(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }
    function mid(a,b){ return {x:(a.x+b.x)/2,y:(a.y+b.y)/2}; }
    stage.addEventListener('pointerdown',function(e){
      try{ stage.setPointerCapture(e.pointerId); }catch(_){}
      pts[e.pointerId]={x:e.clientX,y:e.clientY};
      var ids=Object.keys(pts);
      if(ids.length===1){ gest={type:'pan',x:st.x,y:st.y,p:pts[ids[0]]}; }
      else if(ids.length===2){ var a=pts[ids[0]],b=pts[ids[1]]; gest={type:'pinch',scale:st.scale,d0:dist(a,b)}; }
    });
    stage.addEventListener('pointermove',function(e){
      if(!pts[e.pointerId])return;
      pts[e.pointerId]={x:e.clientX,y:e.clientY};
      var ids=Object.keys(pts), r=stage.getBoundingClientRect();
      if(ids.length===1&&gest&&gest.type==='pan'){
        var p=pts[ids[0]];
        st.x=gest.x+(p.x-gest.p.x)/r.width*100;
        st.y=gest.y+(p.y-gest.p.y)/r.height*100;
        apply();
      }else if(ids.length===2&&gest&&gest.type==='pinch'){
        var a=pts[ids[0]],b=pts[ids[1]], d1=dist(a,b);
        st.scale=gest.scale*(d1/(gest.d0||1));
        apply();
      }
    });
    function release(e){ delete pts[e.pointerId]; var ids=Object.keys(pts);
      if(ids.length===1){ gest={type:'pan',x:st.x,y:st.y,p:pts[ids[0]]}; } else gest=null;
    }
    stage.addEventListener('pointerup',release);
    stage.addEventListener('pointercancel',release);
    stage.addEventListener('wheel',function(e){
      e.preventDefault();
      st.scale=st.scale*(1-e.deltaY/500);
      apply();
    },{passive:false});
    ov.addEventListener('click',function(e){
      if(e.target.closest('[data-pcex]')){ ov.remove(); return; }
      if(e.target.closest('[data-pceok]')){ ov.remove(); if(opts.onSave) opts.onSave({x:st.x,y:st.y,scale:st.scale}); return; }
      if(e.target.closest('[data-pcereset]')){ st={x:0,y:0,scale:1}; apply(); return; }
    });
  }

  /* ════════ МЕНЮ ПАПКИ (крок 3, 03.10.2026) ════════
     Було 13 рядків упереміш: фото, роль, розкладка, сфера, колір, іконка, емодзі…
     Стало: шапка → «Папка» (назва, Вигляд ›, Тип ›, Група ›, закріпити) →
     «Звʼязки» (чат, будівля в грі) → Видалити. Дії ті самі (folderAction),
     формат даних не змінено. Документні дії — у «⋯» самого документа. */
  const FM_IC={
    pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    look:'<circle cx="12" cy="12" r="8.5"/><circle cx="8.5" cy="10" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="15.5" cy="10" r="1"/><path d="M12 20.5a2.5 2.5 0 0 1 0-5h2"/>',
    type:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    group:'<rect x="3.5" y="8" width="13" height="12" rx="2.5"/><path d="M7.5 5h10a3 3 0 0 1 3 3v9"/>',
    ungroup:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/><path d="M13.5 7h4M7 13.5v4"/>',
    pin:'<path d="M9 4h6l-1 6 3 3H7l3-3z"/><path d="M12 13v7"/>',
    chat:'<path d="M4 5.5h16v10H9l-5 4z"/>',
    bld:'<path d="M4 20.5h16M6 20.5V8l6-4 6 4v12.5"/><path d="M10 20.5v-4h4v4"/>',
    del:'<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    photo:'<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="8.5" cy="10" r="1.6"/><path d="M21 15.5l-4.2-4.2a1.5 1.5 0 0 0-2.1 0L7 19"/>',
    cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    folder:'<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    money:'<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16 14.5h2"/>',
    target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    media:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
    proj:'<path d="M12 3.5c3 3 5 5.5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2.5-5 .3 1.6 1 2.5 2 3 0-3 .2-5 .5-7z"/>'
  };
  function fmIc(n){ return '<span class="pgb-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(FM_IC[n]||'')+'</svg></span>'; }
  function fmRow(act,ic,t,sub,cls){ return `<button class="fmi pgb-row${cls?' '+cls:''}" data-act="${act}">${fmIc(ic)}<span class="pgb-tx">${t}${sub?`<small class="fmi-sub">${sub}</small>`:''}</span></button>`; }
  const FM_TYPE={area:'Звичайна',project:'Проєкт',page:'Сторінка'};
  function openFolderMenu(key){
    const f=folders[key]; if(!f) return;
    const kids=groupKids(key);
    const par=(f.parent&&folders[f.parent])?f.parent:'';
    const sub=kids.length ? ('група · '+kids.length+' '+pluralUk(kids.length,'папка','папки','папок'))
            : par ? ('у групі «'+esc(folders[par].name)+'»') : (f.sphere?'сфера в «Моєму світі»':'');
    const role=f.role||'area';
    let linked=0; try{ linked=(typeof window.chatsForFolder==='function')?window.chatsForFolder(key).length:0; }catch(_){}
    const dev=!!(window.upDevOn&&window.upDevOn());
    /* обкладинка — першою (06.10.2026): раніше фото ховалось у «Вигляд» → «Додати фото» */
    const ph=!!f.photo, pp=f.photoPos;
    const xf=(ph&&pp)?`transform:translate(${+pp.x||0}%,${+pp.y||0}%) scale(${+pp.scale||1});`:'';
    const curC=String(f.c||'').toLowerCase();
    fgSheet(`<div class="fmenu-grip"></div>
      <div class="fmc${ph?' fmc-photo':''}" style="--c:${safeColor(f.c,'#6a7dff')}">
        ${ph?`<div class="fmc-bg" style="background-image:url('${esc(safeImg(window.photoSrc(f.photo)))}');${xf}"></div>`
            :`<svg class="ico fmc-wm" aria-hidden="true"><use href="#${esc(folderIcon(f))}"/></svg>`}
        <div class="fmc-t"><small>${f.sphere?'Сфера':'Папка'}</small><b data-i18n-skip="1">${esc(f.name)}</b>${sub?`<span data-i18n-skip="1">${sub}</span>`:''}</div>
      </div>
      <div class="fmc-acts">
        <button type="button" class="fmc-btn fmc-main" data-act="photo">${fmIc('photo')}${ph?'Змінити обкладинку':'Додати обкладинку'}</button>
        ${ph?`<button type="button" class="fmc-btn" data-act="cropphoto">Кадрувати</button><button type="button" class="fmc-btn fmc-del" data-act="rmphoto" aria-label="Прибрати фото">${fmIc('del')}</button>`:''}
      </div>
      <div class="fmc-colors"><span>Колір</span>${FOLDER_COLORS.map(c=>`<button type="button" class="fmc-sw${curC===c?' on':''}" data-fcolor="${c}" style="--sw:${c}" aria-label="Колір обкладинки" aria-pressed="${curC===c}"></button>`).join('')}</div>
      <div class="fmi-label">Вигляд</div>
      ${fmRow('rename','pen','Назва','<span data-i18n-skip="1">'+esc(f.name)+'</span>')}
      ${fmRow('look','look','Значок','лінійна іконка чи емодзі')}
      <div class="fmi-label">Порядок</div>
      ${fmRow('pin','pin',f.pinned?'Відкріпити':'Закріпити зверху','')}
      <div class="fmi-label">Звʼязки</div>
      ${fmRow('chat','chat','Чати',linked?('повʼязано: '+linked):'не повʼязано')}
      ${dev?fmRow('sphere','bld','Сфера · будівля в грі',f.sphere?'повʼязано · змінити чи прибрати':'не повʼязано'):''}
      <div class="fmi-label">Особливе для ${f.sphere?'сфери':'папки'}</div>
      ${fmRow('type','type','Тип · '+FM_TYPE[role],'звичайна, проєкт чи сторінка')}
      ${role==='project'?`
      <div class="fstatus-pick">
        ${PROJECT_STATUSES.map(([s,n,c])=>`<button class="fst-opt ${(f.status||'active')===s?'on':''}" data-status="${s}" style="--stc:${c}">${n}</button>`).join('')}
      </div>
      ${fmRow('due','cal',f.due?('Дедлайн: '+esc(f.due)):'Встановити дедлайн','')}
      ${f.due?fmRow('rmdue','del','Прибрати дедлайн',''):''}`:''}
      ${fmRow('move','group',par?('Група · <span data-i18n-skip="1">'+esc(folders[par].name)+'</span>'):'Перемістити в групу',par?'змінити або винести на головну':'покласти в іншу папку')}
      ${kids.length?fmRow('ungroup','ungroup','Розгрупувати','папки виходять з групи, нічого не видаляється'):''}
      ${f.custom?fmRow('delete','del','Видалити папку','','danger'):''}`,
    m=>{
      m.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>folderAction(key,b.dataset.act));
      m.querySelectorAll('[data-fcolor]').forEach(b=>b.onclick=()=>{
        folders[key].c=b.dataset.fcolor; saveFolders(); renderDashboard(); openFolderMenu(key);
        try{ window.platform.haptic('select'); }catch(_){}
      });
      m.querySelectorAll('[data-status]').forEach(b=>b.onclick=()=>{
        folders[key].status=b.dataset.status; saveFolders(); renderDashboard(); openFolderMenu(key);
        try{ window.platform.haptic('select'); }catch(_){}
      });
    });
  }
  /* «Значок»: колір і фото — нагорі меню папки (обкладинка). Вибір «Картка на
     головній» (flayout) прибрано 06.10.2026: жоден рендер його не читав, кнопки
     нічого не змінювали. Поле в даних лишається як було. */
  function openFolderLook(key){
    const f=folders[key]; if(!f) return;
    fgSheet(`<div class="fmenu-grip"></div>
      <div class="fmenu-title">Значок · <span data-i18n-skip="1">${esc(f.name)}</span></div>
      <button class="fmi pgb-row" data-act="icon"><span class="pgb-ic" aria-hidden="true" style="color:${safeColor(f.c,'var(--accent)')}"><svg class="ico" width="16" height="16"><use href="#${esc(folderIcon(f))}"/></svg></span><span class="pgb-tx">Значок<small class="fmi-sub">${f.iconSet?'обрано вручну':'за емодзі'}</small></span></button>
      ${fmRow('emoji','pen','Емодзі',f.emoji?esc(f.emoji):'нема')}
      <button class="fmi" data-back>‹ Назад до меню</button>`,
    m=>{
      m.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{
        const a=b.dataset.act;
        folderAction(key,a);
      });
      m.querySelector('[data-back]').onclick=()=>openFolderMenu(key);
    });
  }
  // «Тип»: звичайна / проєкт / сторінка (раніше «Роль папки»)
  function openFolderType(key){
    const f=folders[key]; if(!f) return;
    const cur=f.role||'area';
    const D={area:'Документ для планування і нотаток',project:'Має статус і дедлайн, живе на вкладці «Проєкти»',page:'Відкривається одразу як аркуш'};
    fgSheet(`<div class="fmenu-grip"></div>
      <div class="fmenu-title">Тип · <span data-i18n-skip="1">${esc(f.name)}</span></div>
      ${Object.keys(FM_TYPE).map(r=>`<button class="fgs-row${cur===r?' on':''}" data-role="${r}" aria-pressed="${cur===r}">
        <span class="fgs-t"><b>${FM_TYPE[r]}</b><small>${D[r]}</small></span><span class="fgs-go">${cur===r?'✓':''}</span></button>`).join('')}
      <button class="fmi" data-back>‹ Назад до меню</button>`,
    m=>{
      m.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{
        const apply=()=>{
          f.role=b.dataset.role;
          if(f.role==='project'&&!f.status) f.status='active';
          saveFolders(); renderDashboard(); openFolderMenu(key);
          try{ window.platform.haptic('select'); }catch(_){}
        };
        /* проєкти живуть на вкладці «Проєкти», а не на Огляді — разом із ними зникли б і папки групи */
        const kids=groupKids(key);
        if(b.dataset.role==='project' && cur!=='project' && kids.length){
          closeFolderMenu();
          actionSheet({ title:'Зробити групу проєктом?',
            sub:'Проєкти показуються на вкладці «Проєкти», не на Огляді. '+kids.length+' '+pluralUk(kids.length,'папка','папки','папок')+' цієї групи теж '+pluralUk(kids.length,'зникне','зникнуть','зникнуть')+' з Огляду. Краще спершу розгрупувати.',
            items:[{ic:'target', label:'Усе одно зробити проєктом', primary:true, onClick:apply}], cancel:'Скасувати' });
          return;
        }
        apply();
      });
      m.querySelector('[data-back]').onclick=()=>openFolderMenu(key);
    });
  }
  function closeFolderMenu(){ const e=document.getElementById('fmenuSheet'); if(e) e.remove(); }
  // на ноуті шторки папки й «⋯» документа закриваються клавішею Escape (10.10.2026)
  document.addEventListener('keydown',e=>{ if(e.key==='Escape' && document.getElementById('fmenuSheet')){ e.preventDefault(); closeFolderMenu(); } });

  /* ── вибір іконки папки вручну ──
     Доти іконка виводилась з емодзі автоматично. Тут її можна задати самому;
     обраний вручну варіант позначається прапорцем iconSet, і відтоді зміна
     емодзі його вже не перезаписує — інакше вибір мовчки губився б.
     Кнопка «За емодзі» повертає автоматичний режим. */
  function openFolderIconPicker(key){
    const f=folders[key]; if(!f) return;
    closeFolderMenu();
    const cur=folderIcon(f);
    const m=document.createElement('div');
    m.className='fmenu-sheet'; m.id='fmenuSheet';
    m.innerHTML=`<div class="fmenu-in">
      <div class="fmenu-grip"></div>
      <div class="fmenu-title">Іконка · ${esc(f.name)}</div>
      <div class="fic-grid">
        ${ICON_ALL.map(([id,nm])=>`<button class="fic-opt ${cur===id?'on':''}" data-fic="${id}" title="${nm}" aria-label="${nm}" style="--c:${safeColor(f.c,'var(--accent)')}">
          <svg class="ico" aria-hidden="true"><use href="#${id}"/></svg></button>`).join('')}
      </div>
      <button class="fmi" data-ficauto="1">↺ За емодзі${f.emoji?' ('+esc(f.emoji)+')':''}</button>
      <button class="fmi" data-ficback="1">‹ Назад до вигляду</button>
    </div>`;
    m.onclick=e=>{ if(e.target===m) closeFolderMenu(); };
    document.body.appendChild(m);
    m.querySelectorAll('[data-fic]').forEach(b=>b.onclick=()=>{
      f.icon=b.dataset.fic; f.iconSet=1;
      saveFolders(); renderDashboard(); closeFolderMenu();
      try{ window.platform.haptic('select'); }catch(_){}
    });
    const auto=m.querySelector('[data-ficauto]');
    if(auto) auto.onclick=()=>{
      f.icon=folderIconFor(f.emoji); f.iconSet=0;
      saveFolders(); renderDashboard(); closeFolderMenu();
      try{ window.platform.haptic('select'); }catch(_){}
    };
    const back=m.querySelector('[data-ficback]');
    if(back) back.onclick=()=>openFolderLook(key);
  }

  function openFolderMovePicker(key){
    const f=folders[key]; if(!f) return;
    closeFolderMenu();
    const targets=orderedFolderKeys().filter(k=>k!==key && k!=='work' && folders[k] && folders[k].role!=='project' && !isDescendantFolder(k,key) && folderVisible(k));
    const m=document.createElement('div'); m.className='fmenu-sheet'; m.id='fmenuSheet';
    const rootRow=(f.parent||'')?`<button class="fmi" data-mv="">🏠 На головну (без папки)</button>`:'';
    const rows=targets.map(k=>{ const tf=folders[k]; const cur=(f.parent||'')===k?' ✓':'';
      const em=(tf.emoji&&tf.emoji.trim())?esc(tf.emoji):'📁';
      return `<button class="fmi" data-mv="${esc(k)}"><span class="gfp-em">${em}</span> ${esc(tf.name)}${cur}</button>`; }).join('');
    m.innerHTML=`<div class="fmenu-in"><div class="fmenu-grip"></div>
      <div class="fmenu-title">Група для «${esc(f.name)}»</div>
      ${rootRow}${rows||'<div class="fmi-label">Немає інших папок</div>'}</div>`;
    m.onclick=e=>{ if(e.target===m) closeFolderMenu(); };
    document.body.appendChild(m);
    m.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{ moveFolderTo(key,b.dataset.mv); closeFolderMenu(); });
  }
  function folderAction(key,act){
    const f=folders[key]; if(!f) return;
    if(act==='due'){ closeFolderMenu(); inputModal({title:'Дедлайн проєкту', value:f.due||'', placeholder:'РРРР-ММ-ДД, напр. 2026-08-01', onOk:(v)=>{ const m=(v||'').match(/^\d{4}-\d{2}-\d{2}$/); if(m){ f.due=v; saveFolders(); renderDashboard(); } else if(v){ flowAlert('Формат дати: РРРР-ММ-ДД'); } }}); return; }
    if(act==='look'){ openFolderLook(key); return; }
    if(act==='type'){ openFolderType(key); return; }
    if(act==='chat'){ closeFolderMenu(); try{ if(typeof window.folderAddSheet==='function') window.folderAddSheet(key); }catch(e){ console.error('chat',e); } return; }
    if(act==='sphere'){ closeFolderMenu(); try{ sphTemplateSheet(key); }catch(e){ console.error('sphere',e); } return; }
    if(act==='rmdue'){ f.due=''; saveFolders(); renderDashboard(); openFolderMenu(key); return; }
    if(act==='photo'){ pickFolderPhoto(key); return; }
    if(act==='cropphoto'){
      closeFolderMenu();
      if(!f.photo) return;
      openPhotoCropEditor({ img:window.photoSrc(f.photo), pos:f.photoPos, title:'Кадрувати «'+f.name+'»',
        onSave:(pos)=>{ f.photoPos=pos; saveFolders(); renderDashboard(); } });
      return;
    }
    // кошик стоїть поруч із «Кадрувати» — промах стер би фото і з хмари, тож спершу питаємо
    if(act==='rmphoto'){ closeFolderMenu();
      confirmSheet({ title:'Прибрати фото обкладинки?', sub:'Знімок зітреться з цього пристрою і з хмари. Повернути його можна лише з бекапу.', okLabel:'Прибрати фото',
        onOk:()=>{ const prev=f.photo; f.photo=''; f.photoPos=null;
          window.photoDel(prev); saveFolders(); renderDashboard(); } });
      return; }
    if(act==='ungroup'){
      const kids=groupKids(key), up=(f.parent&&folders[f.parent])?f.parent:'';   // батька вже нема — на головну
      kids.forEach(ck=>{ folders[ck].parent=up; });
      saveFolders(); renderDashboard(); closeFolderMenu();
      fgToast('«'+f.name+'» розгруповано: '+kids.length+' '+pluralUk(kids.length,'папка','папки','папок')+' на місці');
      return;
    }
    if(act==='pin'){ f.pinned=!f.pinned; saveFolders(); renderDashboard(); closeFolderMenu(); return; }
    if(act==='rename'){ closeFolderMenu(); inputModal({title:'Перейменувати папку',value:f.name,placeholder:'Назва папки',onOk:(v)=>{ if(v){f.name=v;saveFolders();renderDashboard();} }}); return; }
    if(act==='move'){ closeFolderMenu(); openFolderMovePicker(key); return; }
    if(act==='icon'){ openFolderIconPicker(key); return; }
    // Іконку, обрану вручну (iconSet), зміна емодзі не чіпає — інакше вибір
    // губився б мовчки. Автоматичну — переобираємо під нове емодзі.
    if(act==='emoji'){ closeFolderMenu(); inputModal({title:'Емодзі папки',value:f.emoji,placeholder:'Встав емодзі або лишай порожнім',emoji:false,onOk:(v)=>{ f.emoji=v; if(!f.iconSet) f.icon=folderIconFor(v); saveFolders(); renderDashboard(); }}); return; }
    if(act==='delete'){ confirmSheet({title:'Видалити папку «'+f.name+'»?', onOk:()=>{ folderDelete(key); renderDashboard(); closeFolderMenu(); }}); return; }   // з документом, темами, фото й посиланнями чатів — і надгробком для інших пристроїв
  }
  function pickFolderPhoto(key){
    const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
    inp.onchange=()=>{
      const file=inp.files&&inp.files[0]; if(!file) return;
      const reader=new FileReader();
      reader.onload=()=>{
        const img=new Image();
        img.onload=()=>{
          // 1400px / 0.82 (30.08.2026): 900px на Retina розтягувалось удвічі.
          const maxW=1400; const scale=Math.min(1,maxW/img.width);
          const cv=document.createElement('canvas');
          cv.width=Math.round(img.width*scale); cv.height=Math.round(img.height*scale);
          cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
          let du; try{ du=cv.toDataURL('image/jpeg',0.82); }catch(_){ du=reader.result; }
          folders[key].photoPos=null;
          // старий знімок цієї папки більше не потрібен
          const prev=folders[key].photo;
          Promise.resolve(window.photoPut('ph_'+key, du)).then(ref=>{
            folders[key].photo=ref;
            if(prev && prev!==ref) window.photoDel(prev);
            saveFolders(); renderDashboard(); closeFolderMenu();
          });
        };
        img.onerror=()=>{ folders[key].photo=reader.result; saveFolders(); renderDashboard(); closeFolderMenu(); };
        img.src=reader.result;
      };
      reader.readAsDataURL(file);
    };
    inp.click();
  }

