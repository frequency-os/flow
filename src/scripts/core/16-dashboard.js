  /* ============ DASHBOARD RENDER ============ */
  // глобальний вигляд папок v2: list (full-bleed) | grid (обкладинки) | deck (колода)
  const FV_ORDER=['list','grid','mag'];
  const FV_NAME={list:'Список', grid:'Сітка', mag:'Журнал'};
  let homeFolderView='grid';
  try{ const sv=localStorage.getItem('folderview');
    if(sv==='cover'||sv==='compact'||sv==='deck') homeFolderView='grid';  // міграція старих режимів
    else if(sv&&FV_ORDER.includes(sv)) homeFolderView=sv; }catch(_){}
  prefCatchup('folderview', v=>{ if(v&&FV_ORDER.includes(v)) homeFolderView=v; else if(v==='cover'||v==='compact'||v==='deck') homeFolderView='grid'; });
  function applyFolderViewIcon(){
    const seg=document.getElementById('folderViewSeg');
    if(seg) seg.querySelectorAll('[data-fv]').forEach(b=>b.classList.toggle('on', b.dataset.fv===homeFolderView));
  }
  function setFolderView(v){
    if(!FV_ORDER.includes(v)||v===homeFolderView){ applyFolderViewIcon(); return; }
    homeFolderView=v;
    try{ prefSet('folderview', homeFolderView); }catch(_){}
    applyFolderViewIcon(); renderDashboard();
    try{ window.platform.haptic('select'); }catch(_){}
  }
  { const seg=document.getElementById('folderViewSeg');
    if(seg) seg.querySelectorAll('[data-fv]').forEach(b=>b.onclick=()=>setFolderView(b.dataset.fv)); }

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
        else if((folders[okey].parent||'')===(folders[st.key].parent||'')){
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
      if(commit && mode==='into' && targetKey){ try{window.platform.haptic('success');}catch(_){} moveFolderTo(key,targetKey); return; }
      if(commit && mode==='reorder'){ try{window.platform.haptic('light');}catch(_){} moveOrderItem(key,targetKey); saveFolders(); renderDashboard(); return; }
      renderDashboard();
    }

    grid.addEventListener('pointerdown',e=>{
      if(e.target.closest('.fmenu')||e.target.closest('.fadd')) return;
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

  function renderProjRail(){
    const rail=document.getElementById('projRail'); if(!rail) return;
    const projs=(typeof projFolderKeys==='function')?projFolderKeys():[];
    if(!projs.length){ rail.style.display='none'; rail.innerHTML=''; return; }
    rail.style.display='flex';
    rail.innerHTML = projs.map(k=>{
      const f=folders[k]; if(!f) return '';
      return '<div class="proj-rail-i" data-projrail="'+esc(k)+'" style="--pc:'+safeColor(f.c,'#6a7dff')+'" title="'+esc(f.name||'')+'">'+esc(f.emoji||'🚀')+'</div>';
    }).join('') + '<div class="proj-rail-add" data-projraddd title="Новий проєкт">＋</div>';
    rail.querySelectorAll('[data-projrail]').forEach(el=>{
      el.onclick=()=>{ try{ window.platform.haptic('select'); }catch(_){} goFolder(el.dataset.projrail); };
    });
    const addBtn=rail.querySelector('[data-projraddd]');
    if(addBtn) addBtn.onclick=()=>{ if(typeof goProjects==='function') goProjects(); };
  }
  function renderDashboard(){
    try{ window.__renderDashboard=renderDashboard; }catch(_){}
    try{ renderHeroStreak(); }catch(_){}
    try{ renderProjRail(); }catch(_){}
    const grid = document.getElementById('folderGrid');
    grid.innerHTML='';
    grid.classList.remove('fv-list','fv-grid','fv-cover','fv-compact','fv2-list','fv2-grid','fv2-deck','fv2-mag');
    grid.classList.add('fv2-'+homeFolderView);
    applyFolderViewIcon();
    // вкладка «Чати» на Огляді (36-chats.js): замість сітки папок — список чатів
    try{ if(chatsHomeSync()) return; }catch(e){ console.error('chatsHomeSync',e); }
    // 🚀 проєкти переїхали на вкладку «Проєкти»: Робота + папки-проєкти не показуємо в Огляді
    topFolderKeys().filter(folderVisible).filter(k=>k!=='work' && !(folders[k]&&folders[k].role==='project')).forEach((k,idx)=>{
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
        metaHtml=`<div class="fstat"><b>${active}</b> ${pluralUk(active,'активний','активні','активних')}${f.pct?` · ${f.pct}%`:''}</div>`;
      }
      // ── v2: єдина розмітка, режим вирішує лише клас-обгортку ──
      const modeClass = homeFolderView==='grid' ? 'fc2-tile'
                      : homeFolderView==='deck' ? 'fc2-deck'
                      : homeFolderView==='mag'  ? 'fc2-mag' : 'fc2-row';
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
      if(homeFolderView==='deck'){
        let dpct=0;
        if(f.role==='project'){ const pr=folderProgress(k); dpct=pr.total?pr.pct:0; }
        else dpct=Math.max(0,Math.min(100, +f.pct||0));
        inner+=`<div class="fc2-body"><div class="fc2-name" data-i18n-skip="1">${esc(f.name)}</div>${metaHtml}<div class="fc2-prog"><i style="width:${dpct}%"></i></div></div>`;
      } else {
        inner+=`<div class="fc2-body"><div class="fc2-name" data-i18n-skip="1">${esc(f.name)}</div>${metaHtml}</div>`;
      }
      inner+=`<button class="fmenu" data-fmenu="${esc(k)}" title="Налаштування">⋮</button>`+
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
    add.className='fc2 fc2-add '+(homeFolderView==='grid'?'fc2-tile-add':homeFolderView==='deck'?'fc2-deck-add':homeFolderView==='mag'?'fc2-mag-add':'fc2-row-add');
    add.innerHTML=`<div class="fc2-plus">＋</div><div class="fc2-addt">Нова папка</div>`;
    add.onclick=createFolder;
    grid.appendChild(add);
    // bind menus
    grid.querySelectorAll('[data-fmenu]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); openFolderMenu(b.dataset.fmenu); });
    try{ const cb=document.getElementById('folderCountBadge'); if(cb) cb.textContent=topFolderKeys().filter(folderVisible).length; }catch(_){}
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
  { const mb=document.getElementById('folderMergeBtn'); if(mb) mb.onclick=openFolderMerge; }
  try{ window.openFolderGroup=openFolderGroup; }catch(_){}
  // 🚀 створити папку-проєкт зі шторки «＋»: якщо ми всередині папки — вкладаємо в неї
  function createProjectFolder(){
    inputModal({ title:'Новий проєкт', placeholder:'Назва проєкту', emoji:true, emojiVal:'🚀',
      onOk:(name, emojiVal)=>{
        const nm=(name||'').trim(); if(!nm) return;
        const used=order.length;
        const key='f_'+Date.now();
        // контекст: якщо активна дошка належить папці — робимо проєкт її дочірньою папкою
        let parent='';
        try{ const base=String(boardKey||'').split('__sp_')[0]; if(base && base!=='__root__' && base!=='all' && folders[base]) parent=base; }catch(_){}
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

  function openFolderMenu(key){
    const f=folders[key]; if(!f) return;
    closeFolderMenu();
    const m=document.createElement('div');
    m.className='fmenu-sheet'; m.id='fmenuSheet';
    m.innerHTML=`<div class="fmenu-in">
      <div class="fmenu-grip"></div>
      <div class="fmenu-title">${esc(f.name)}</div>
      <button class="fmi" data-act="photo"><svg class="fmi-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="8.5" cy="10" r="1.6"/><path d="M21 15.5l-4.2-4.2a1.5 1.5 0 0 0-2.1 0L7 19"/></svg> ${f.photo?'Змінити фото':'Додати фото'}</button>
      ${f.photo?`<button class="fmi" data-act="cropphoto">🖼️ Кадрувати фото</button>`:''}
      ${f.photo?`<button class="fmi" data-act="rmphoto">🗑️ Прибрати фото</button>`:''}
      <div class="fmi-label">Роль папки</div>
      <div class="flay-pick frole-pick">
        ${Object.keys(FOLDER_ROLES).map(r=>`<button class="flay-opt ${(f.role||'area')===r?'on':''}" data-role="${r}" title="${FOLDER_ROLES[r].d}">
          <span class="frole-e">${FOLDER_ROLES[r].e}</span><span>${FOLDER_ROLES[r].n}</span></button>`).join('')}
      </div>
      ${(f.role==='project')?`
      <div class="fmi-label">Статус проєкту</div>
      <div class="fstatus-pick">
        ${PROJECT_STATUSES.map(([s,n,c])=>`<button class="fst-opt ${(f.status||'active')===s?'on':''}" data-status="${s}" style="--stc:${c}">${n}</button>`).join('')}
      </div>
      <button class="fmi" data-act="due">📅 ${f.due?('Дедлайн: '+esc(f.due)):'Встановити дедлайн'}</button>
      ${f.due?`<button class="fmi" data-act="rmdue">✖️ Прибрати дедлайн</button>`:''}`:''}
      <div class="fmi-label">Розкладка картки</div>
      <div class="flay-pick">
        ${['a','b','c','d'].map(L=>`<button class="flay-opt ${(f.flayout||'a')===L?'on':''}" data-lay="${L}">
          <span class="flay-ic flay-ic-${L}"></span><span>${({a:'Збоку',b:'Зверху',c:'На всю',d:'Перехід'})[L]}</span></button>`).join('')}
      </div>
      ${(window.upDevOn&&window.upDevOn())?`<button class="fmi" data-act="sphere">🏙 ${f.sphere?'Сфера: шаблон / прибрати':'Зробити сферою'}</button>`:''}
      <button class="fmi" data-act="pin">📌 ${f.pinned?'Відкріпити':'Закріпити зверху'}</button>
      <button class="fmi" data-act="rename">✏️ Перейменувати</button>
      ${groupKids(key).length?`<button class="fmi" data-act="ungroup">🗂 Розгрупувати<small class="fmi-sub">папки виходять з групи, нічого не видаляється</small></button>`:''}
      <button class="fmi" data-act="move">📂 ${f.parent?'Перемістити / на головну':'Перемістити в папку'}</button>
      <button class="fmi" data-act="color">🎨 Змінити колір</button>
      <button class="fmi" data-act="icon"><svg class="ico fmi-ic" aria-hidden="true"><use href="#${esc(folderIcon(f))}"/></svg> Іконка${f.iconSet?'':' · за емодзі'}</button>
      <button class="fmi" data-act="emoji">😀 Змінити емодзі</button>
      ${f.custom?`<button class="fmi danger" data-act="delete">🗑️ Видалити папку</button>`:''}
    </div>`;
    m.onclick=e=>{ if(e.target===m) closeFolderMenu(); };
    document.body.appendChild(m);
    m.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>folderAction(key,b.dataset.act));
    m.querySelectorAll('[data-lay]').forEach(b=>b.onclick=()=>{
      folders[key].flayout=b.dataset.lay; saveFolders(); renderDashboard(); openFolderMenu(key);
    });
    m.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{
      folders[key].role=b.dataset.role;
      if(b.dataset.role==='project'&&!folders[key].status) folders[key].status='active';
      saveFolders(); renderDashboard(); openFolderMenu(key);
      window.platform.haptic('select');
    });
    m.querySelectorAll('[data-status]').forEach(b=>b.onclick=()=>{
      folders[key].status=b.dataset.status; saveFolders(); renderDashboard(); openFolderMenu(key);
      window.platform.haptic('select');
    });
  }
  function closeFolderMenu(){ const e=document.getElementById('fmenuSheet'); if(e) e.remove(); }

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
      <button class="fmi" data-ficback="1">‹ Назад до налаштувань</button>
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
    if(back) back.onclick=()=>openFolderMenu(key);
  }

  function openFolderMovePicker(key){
    const f=folders[key]; if(!f) return;
    closeFolderMenu();
    const targets=orderedFolderKeys().filter(k=>k!==key && !isDescendantFolder(k,key) && folderVisible(k));
    const m=document.createElement('div'); m.className='fmenu-sheet'; m.id='fmenuSheet';
    const rootRow=(f.parent||'')?`<button class="fmi" data-mv="">🏠 На головну (без папки)</button>`:'';
    const rows=targets.map(k=>{ const tf=folders[k]; const cur=(f.parent||'')===k?' ✓':'';
      const em=(tf.emoji&&tf.emoji.trim())?esc(tf.emoji):'📁';
      return `<button class="fmi" data-mv="${esc(k)}"><span class="gfp-em">${em}</span> ${esc(tf.name)}${cur}</button>`; }).join('');
    m.innerHTML=`<div class="fmenu-in"><div class="fmenu-grip"></div>
      <div class="fmenu-title">Перемістити «${esc(f.name)}»</div>
      ${rootRow}${rows||'<div class="fmi-label">Немає інших папок</div>'}</div>`;
    m.onclick=e=>{ if(e.target===m) closeFolderMenu(); };
    document.body.appendChild(m);
    m.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{ moveFolderTo(key,b.dataset.mv); closeFolderMenu(); });
  }
  function folderAction(key,act){
    const f=folders[key]; if(!f) return;
    if(act==='due'){ closeFolderMenu(); inputModal({title:'Дедлайн проєкту', value:f.due||'', placeholder:'РРРР-ММ-ДД, напр. 2026-08-01', onOk:(v)=>{ const m=(v||'').match(/^\d{4}-\d{2}-\d{2}$/); if(m){ f.due=v; saveFolders(); renderDashboard(); } else if(v){ flowAlert('Формат дати: РРРР-ММ-ДД'); } }}); return; }
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
    if(act==='rmphoto'){ const prev=f.photo; f.photo=''; f.photoPos=null;
      window.photoDel(prev); saveFolders(); renderDashboard(); closeFolderMenu(); return; }
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
    if(act==='color'){ cycleFolderColor(key); saveFolders(); renderDashboard(); openFolderMenu(key); return; }
    if(act==='icon'){ openFolderIconPicker(key); return; }
    // Іконку, обрану вручну (iconSet), зміна емодзі не чіпає — інакше вибір
    // губився б мовчки. Автоматичну — переобираємо під нове емодзі.
    if(act==='emoji'){ closeFolderMenu(); inputModal({title:'Емодзі папки',value:f.emoji,placeholder:'Встав емодзі або лишай порожнім',emoji:false,onOk:(v)=>{ f.emoji=v; if(!f.iconSet) f.icon=folderIconFor(v); saveFolders(); renderDashboard(); }}); return; }
    if(act==='delete'){ confirmSheet({title:'Видалити папку «'+f.name+'»?', onOk:()=>{ folderDelete(key); renderDashboard(); closeFolderMenu(); }}); return; }   // з документом, темами, фото й посиланнями чатів — і надгробком для інших пристроїв
  }
  function cycleFolderColor(key){
    const f=folders[key];
    const raw=f.c.startsWith('var(')? ({'var(--fin)':'#e8843c','var(--hab)':'#34c77b','var(--val)':'#5b8def','var(--skl)':'#c77dff'}[f.c]||'#6a7dff') : f.c;
    let i=FOLDER_COLORS.indexOf(raw); i=(i+1)%FOLDER_COLORS.length;
    f.c=FOLDER_COLORS[i];
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

