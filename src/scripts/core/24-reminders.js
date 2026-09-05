  /* ═══════════ НАГАДУВАННЯ (на завданнях) ═══════════ */
  // зберігаємо у блоці task: b.remindAt (ISO). Нотифікація — системна, якщо дозволена, інакше шторка.
  function setTaskReminder(id){
    const b=getBlock(id); if(!b) return;
    const cur=b.remindAt? new Date(b.remindAt): null;
    const def=cur? toLocalInput(cur): toLocalInput(new Date(Date.now()+3600e3));
    inputModal({title:'Нагадати про «'+(b.title||'завдання')+'»', value:def, placeholder:'РРРР-ММ-ДД ГГ:ХХ', onOk:(val)=>{
    if(val===null||val===undefined) return;
    if(val.trim()===''){ b.remindAt=null; saveBoard(); renderBoard(); return; }
    const dt=parseLocalInput(val.trim());
    if(!dt||isNaN(dt.getTime())){ flowAlert('Не вдалося розпізнати дату. Формат: 2026-07-01 09:30'); return; }
    b.remindAt=dt.toISOString();
    saveBoard(); renderBoard();
    scheduleReminder(b);
    try{ window.platform.haptic('light'); }catch(_){}
    }});
  }
  function toLocalInput(d){
    const p=n=>String(n).padStart(2,'0');
    return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());
  }
  function remindLabel(iso){
    try{ const d=new Date(iso); const p=n=>String(n).padStart(2,'0');
      const today=new Date(); const isToday=d.toDateString()===today.toDateString();
      const tmrw=new Date(Date.now()+864e5); const isTmrw=d.toDateString()===tmrw.toDateString();
      const time=p(d.getHours())+':'+p(d.getMinutes());
      if(isToday) return 'сьогодні '+time;
      if(isTmrw) return 'завтра '+time;
      return p(d.getDate())+'.'+p(d.getMonth()+1)+' '+time;
    }catch(_){ return ''; }
  }
  function parseLocalInput(s){
    const m=s.match(/(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})/);
    if(!m) return null;
    return new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5]);
  }
  // активні таймери в межах сесії (для нагадувань у найближчі ~24 год)
  const reminderTimers={};
  function scheduleReminder(b){
    if(!b||!b.remindAt) return;
    const when=new Date(b.remindAt).getTime();
    const delay=when-Date.now();
    if(reminderTimers[b.id]){ clearTimeout(reminderTimers[b.id]); delete reminderTimers[b.id]; }
    if(delay<=0||delay>24*3600e3) return; // далеке — спрацює при наступному відкритті
    reminderTimers[b.id]=setTimeout(()=>{ fireReminder(b); },delay);
  }
  function fireReminder(b){
    const msg='⏰ '+(b.title||'Нагадування');
    try{
      if('Notification'in window && Notification.permission==='granted'){
        new Notification('Frequency',{ body:msg });
      } else { flowAlert(msg); }
    }catch(_){ try{ flowAlert(msg); }catch(__){} }
    window.platform.haptic('warning');
  }
  // при завантаженні — перепланувати найближчі нагадування з усіх дошок
  function rescheduleAllReminders(){
    try{
      Object.keys(boards).forEach(k=>{
        const stack=[...(boards[k]||[])];
        while(stack.length){
          const b=stack.pop();
          if(b&&b.remindAt&&b.type==='task') scheduleReminder(b);
          if(b&&isContainer(b)&&Array.isArray(b.children)) stack.push(...b.children);
        }
      });
    }catch(_){}
  }
  // показати прострочені нагадування, які мали спрацювати поки застосунок був закритий
  function checkDueReminders(){
    const now=Date.now(); const due=[];
    try{
      Object.keys(boards).forEach(k=>{
        const stack=[...(boards[k]||[])];
        while(stack.length){
          const b=stack.pop();
          if(b&&b.remindAt&&b.type==='task'&&!b.remindFired){
            if(new Date(b.remindAt).getTime()<=now){ due.push(b); b.remindFired=true; }
          }
          if(b&&isContainer(b)&&Array.isArray(b.children)) stack.push(...b.children);
        }
      });
    }catch(_){}
    if(due.length){
      saveBoard();
      const names=due.slice(0,4).map(b=>'• '+(b.title||'завдання')).join('\n');
      const extra=due.length>4?`\n…і ще ${due.length-4}`:'';
      setTimeout(()=>{ try{ flowAlert('⏰ Нагадування, що настали:\n'+names+extra); }catch(_){} },400);
    }
  }
  window.flowSetTaskReminder=setTaskReminder;

  // ===== Нагадування для блоків Планера (окрема черга, той самий механізм показу) =====
  function plScheduleReminder(b){
    if(!b||!b.remindAt) return;
    const when=new Date(b.remindAt).getTime();
    const delay=when-Date.now();
    const key='pl_'+b.id;
    if(reminderTimers[key]){ clearTimeout(reminderTimers[key]); delete reminderTimers[key]; }
    if(delay<=0||delay>24*3600e3) return;
    reminderTimers[key]=setTimeout(()=>{ plFireReminder(b); },delay);
  }
  function plFireReminder(b){
    const msg='⏰ '+(b.t||'Блок часу')+(b.h!=null?' · '+plHM(b.h):'');
    try{
      if('Notification'in window && Notification.permission==='granted'){
        new Notification('Frequency — Планер',{ body:msg });
      } else { flowAlert(msg); }
    }catch(_){ try{ flowAlert(msg); }catch(__){} }
    try{ window.platform.haptic('warning'); }catch(_){}
  }
  // перепланувати нагадування блоків на сьогодні/завтра (в межах вікна 24г таймерів)
  function plRescheduleReminders(){
    try{
      const p=plData();
      [plTodayStr(), (()=>{ const d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10); })()].forEach(ds=>{
        (p.blocksByDay[ds]||[]).forEach(b=>{ if(b&&b.remindAt&&!b.done) plScheduleReminder(b); });
      });
    }catch(_){}
  }
  // показати прострочені нагадування блоків, поки застосунок був закритий
  function plCheckDueReminders(){
    try{
      const p=plData(); const now=Date.now(); const due=[];
      Object.keys(p.blocksByDay||{}).forEach(ds=>{
        (p.blocksByDay[ds]||[]).forEach(b=>{
          if(b&&b.remindAt&&!b.done&&!b.remindFired && new Date(b.remindAt).getTime()<=now){ due.push(b); b.remindFired=true; }
        });
      });
      if(due.length){
        saveGoals();
        const names=due.slice(0,4).map(b=>'• '+(b.t||'блок')).join('\n');
        const extra=due.length>4?`\n…і ще ${due.length-4}`:'';
        setTimeout(()=>{ try{ flowAlert('⏰ Нагадування планера:\n'+names+extra); }catch(_){} },500);
      }
    }catch(_){}
  }

  function buildAddSheet(){
    const g=document.getElementById('ashGrid');
    const allKeys=Object.keys(BLOCK_TYPES);
    const simpleKeys=allKeys.filter(k=>!WIDGET_TYPES.includes(k)&&!PROJECT_ONLY.includes(k));
    // rank simple by usage
    const defaultTop=['note','check','task'];
    const ranked=simpleKeys.slice().sort((a,b)=>{
      const ua=blockUsage[a]||0, ub=blockUsage[b]||0;
      if(ub!==ua) return ub-ua;
      return defaultTop.indexOf(a)>=0 && defaultTop.indexOf(b)<0 ? -1 :
             defaultTop.indexOf(b)>=0 && defaultTop.indexOf(a)<0 ? 1 :
             simpleKeys.indexOf(a)-simpleKeys.indexOf(b);
    });
    const fav=ranked.slice(0,3);
    let rest=ranked.slice(3);
    // «Мікс», «Папка», «Сторінка» завжди першими серед інших блоків — їх легко знайти
    if(rest.includes('page')){ rest=['page',...rest.filter(k=>k!=='page')]; }
    if(rest.includes('group')){ rest=['group',...rest.filter(k=>k!=='group')]; }
    if(rest.includes('bento')){ rest=['bento',...rest.filter(k=>k!=='bento')]; }

    let bodyHtml='';
    if(addSheetStyle==='gallery'){
      // ГАЛЕРЕЯ: великі картки з реальним описом типу (BLOCK_TYPES[k].desc) + вкладка ⚙ Налаштування
      const cardHtml=(k)=>{ const t=BLOCK_TYPES[k];
        return `<button class="ash-card" style="--ac:${t.color}" data-add="${k}">
          <span class="ac-ico">${blockIcon(k,19)}</span>
          <div class="ac-nm">${t.title}</div>
          <div class="ac-ds">${t.desc||''}</div></button>`; };
      const tabs=`<div class="ash-tabs">
        <button class="${addTab==='blocks'?'on':''}" data-atab="blocks">Блоки</button>
        <button class="${addTab==='widgets'?'on':''}" data-atab="widgets">Віджети</button>
        <button class="${addTab==='proj'?'on':''}" data-atab="proj">Проєкти</button>
        <button class="${addTab==='settings'?'on':''}" data-atab="settings">⚙</button>
      </div>`;
      const blocksPane=`<div class="ash-pane ${addTab==='blocks'?'on':''}">
        <div class="ash-faves-label">Часто використовуєш</div>
        <div class="ash-cards">${fav.map(cardHtml).join('')}</div>
        <div class="ash-rest-label">Інші блоки</div>
        <div class="ash-cards">${rest.map(cardHtml).join('')}</div></div>`;
      const widgetsPane=`<div class="ash-pane ${addTab==='widgets'?'on':''}">
        <div class="ash-rest-label">Готові віджети</div>
        <div class="ash-cards">${WIDGET_TYPES.map(cardHtml).join('')}</div></div>`;
      const projPane=`<div class="ash-pane ${addTab==='proj'?'on':''}">
        <div class="ash-cards"><button class="ash-card" style="--ac:#6a7dff" data-addproj="1">
          <span class="ac-ico">🚀</span><div class="ac-nm">Папка-проєкт</div>
          <div class="ac-ds">Окремий проєкт зі статусом, дедлайном і прогресом — його бачать «Пульт», «Пайплайн» і «Фокус-стек»</div></button></div>
        <div class="ash-rest-label">Блоки проєкту</div>
        <div class="ash-cards">${PROJECT_BLOCKS.map(cardHtml).join('')}</div></div>`;
      const settingsPane=`<div class="ash-pane ${addTab==='settings'?'on':''}">
        <div class="ash-set-sec">
          <div class="tt">Зовнішні <span class="badge ext">простір</span></div>
          <div class="st">Стосуються всього полотна, не окремого блока</div>
          <div class="ash-set-row"><span class="nm">Прилипання до сітки</span>
            <div class="ash-toggle ${canvasSnap?'on':''}" data-ashset="snap"><i></i></div></div>
          <div class="ash-set-row"><span class="nm">Ширина дошки (колонок)</span>
            <span class="val" data-ashval="cols">${boardCols}</span></div>
          <div class="ash-set-row"><span class="nm">Тема</span>
            <span class="val" data-ashval="theme">${theme==='light'?'☀️ Світла':theme==='black'?'⚫ Чорна':'🌙 Frequency-дарк'}</span></div>
          <div class="ash-set-row"><span class="nm">Zen-режим</span>
            <div class="ash-toggle ${zenMode?'on':''}" data-ashset="zen"><i></i></div></div>
        </div>
        <div class="ash-set-sec">
          <div class="tt">Внутрішні <span class="badge int">блок</span></div>
          <div class="st">Поведінка нових блоків одразу після додавання</div>
          <div class="ash-set-row"><span class="nm">Фокус на тексті одразу після створення</span>
            <div class="ash-toggle ${autoFocusNewBlock?'on':''}" data-ashset="autofocus"><i></i></div></div>
        </div>
      </div>`;
      bodyHtml=tabs+blocksPane+widgetsPane+projPane+settingsPane;
    } else {
      // СТАНДАРТНИЙ вигляд — як і раніше, компактні іконки
      const favHtml=fav.map(k=>{const t=BLOCK_TYPES[k];
        return `<div class="fb" style="--ac:${t.color}" data-add="${k}">
          ${blockIcon(k,22)}<span class="lb">${t.title}</span></div>`;}).join('');
      const restHtml=rest.map(k=>{const t=BLOCK_TYPES[k];
        return `<div class="ri" style="--ac:${t.color}" data-add="${k}">
          ${blockIcon(k,20)}<span class="lb">${t.title}</span></div>`;}).join('');
      const widgetsHtml=WIDGET_TYPES.map(k=>{const t=BLOCK_TYPES[k];
        return `<div class="ri wcell" style="--ac:${t.color}" data-add="${k}">
          ${blockIcon(k,20)}<span class="lb">${t.title}</span></div>`;}).join('');
      const tabs=`<div class="ash-tabs">
        <button class="${addTab==='blocks'?'on':''}" data-atab="blocks">Блоки</button>
        <button class="${addTab==='widgets'?'on':''}" data-atab="widgets">Віджети</button>
        <button class="${addTab==='proj'?'on':''}" data-atab="proj">Проєкти</button>
      </div>`;
      const blocksPane=`<div class="ash-pane ${addTab==='blocks'?'on':''}">
        <div class="ash-faves-label">Часто використовуєш</div>
        <div class="ash-faves">${favHtml}</div>
        <div class="ash-rest-label">Інші блоки</div>
        <div class="ash-rest">${restHtml}</div></div>`;
      const widgetsPane=`<div class="ash-pane ${addTab==='widgets'?'on':''}">
        <div class="ash-rest-label">Готові віджети</div>
        <div class="ash-rest">${widgetsHtml}</div></div>`;
      const projCells=PROJECT_BLOCKS.map(k=>{const t=BLOCK_TYPES[k];
        return `<div class="ri wcell" style="--ac:${t.color}" data-add="${k}">
          ${blockIcon(k,20)}<span class="lb">${t.title}</span></div>`;}).join('');
      const projPane=`<div class="ash-pane ${addTab==='proj'?'on':''}">
        <div class="ash-rest-label">Проєкт як папка</div>
        <div class="ash-rest"><div class="ri wcell" style="--ac:#6a7dff" data-addproj="1">
          <span class="gico" style="width:38px;height:38px;font-size:19px;display:grid;place-items:center">🚀</span><span class="lb">Папка-проєкт</span></div></div>
        <div class="ash-rest-label">Блоки проєкту</div>
        <div class="ash-rest">${projCells}</div></div>`;
      bodyHtml=tabs+blocksPane+widgetsPane+projPane;
    }

    g.innerHTML=bodyHtml;

    // перемикач стилю шторки (кнопки живуть у сталому хедері, поза ashGrid)
    document.querySelectorAll('#ashStyleSw [data-ashstyle]').forEach(b=>{
      b.classList.toggle('on', b.dataset.ashstyle===addSheetStyle);
      b.onclick=()=>{
        addSheetStyle=b.dataset.ashstyle;
        try{ prefSet('addsheet_style', addSheetStyle); }catch(_){}
        if(addTab==='settings' && addSheetStyle==='standard') addTab='blocks';
        buildAddSheet();
      };
    });

    g.querySelectorAll('[data-atab]').forEach(b=>b.onclick=()=>{ addTab=b.dataset.atab; buildAddSheet(); });
    g.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{
      const k=b.dataset.add;
      blockUsage[k]=(blockUsage[k]||0)+1; saveUsage();
      addBlock(k);
    });
    // 🚀 «Папка-проєкт» — створити проєкт (вкладену папку з роллю «Проєкт»)
    g.querySelectorAll('[data-addproj]').forEach(b=>b.onclick=()=>{
      document.getElementById('addsheet').classList.remove('open');
      createProjectFolder();
    });
    // ⚙ Налаштування (вкладка є лише в galery-стилі) — реальні перемикачі, підʼєднані
    // до вже наявного стану застосунку (не декоративні, а справжні toggleSnap/setZen/тема)
    g.querySelectorAll('[data-ashset]').forEach(el=>el.onclick=()=>{
      const k=el.dataset.ashset;
      if(k==='snap'){ toggleSnap(); }
      else if(k==='zen'){ setZen(!zenMode); document.getElementById('addsheet').classList.remove('open'); return; }
      else if(k==='autofocus'){ autoFocusNewBlock=!autoFocusNewBlock; try{prefSet('autofocus_newblock',autoFocusNewBlock?'1':'0');}catch(_){} }
      buildAddSheet();
    });
    g.querySelectorAll('[data-ashval="cols"]').forEach(el=>el.parentElement.onclick=()=>{
      const i=WIDE_STEPS.indexOf(boardCols); boardCols=WIDE_STEPS[(i+1)%WIDE_STEPS.length];
      saveBoardCols(); renderBoard(); buildAddSheet();
    });
    g.querySelectorAll('[data-ashval="theme"]').forEach(el=>el.parentElement.onclick=()=>{ toggleTheme(); buildAddSheet(); });
  }
  function openFullAddSheet(){ bentoTarget=null; addTab='blocks'; buildAddSheet(); document.getElementById('addsheet').classList.add('open'); }
  document.getElementById('fab').onclick=()=>{
    if(isCanvasMode()){ toggleFabRadial(); return; }   // на полотні — радіальне віяло
    openFullAddSheet();
  };
  /* ── РАДІАЛЬНИЙ «＋» на полотні ── */
  function toggleFabRadial(){
    const fab=document.getElementById('fab');
    const ex=document.getElementById('fabRadial');
    if(ex){ ex.remove(); fab.classList.remove('r-open'); return; }
    const m=document.createElement('div'); m.id='fabRadial';
    const r=fab.getBoundingClientRect();
    m.style.right=Math.max(10, window.innerWidth-r.right)+'px';
    m.style.bottom=Math.max(10, window.innerHeight-r.bottom)+'px';
    m.innerHTML=`
      <button data-rf="note"><b>📝</b><small>НОТАТКА</small></button>
      <button data-rf="check"><b>✅</b><small>ЧЕКЛІСТ</small></button>
      <button data-rf="photo"><b>📷</b><small>ФОТО</small></button>
      <button data-rf="__more"><b>▦</b><small>ВСІ</small></button>`;
    document.body.appendChild(m);
    requestAnimationFrame(()=>m.classList.add('open'));
    fab.classList.add('r-open');
    try{ window.platform.haptic('light'); }catch(_){}
    m.querySelectorAll('[data-rf]').forEach(b=>b.onclick=ev=>{
      ev.stopPropagation();
      const t=b.dataset.rf; toggleFabRadial();
      if(t==='__more'){ openFullAddSheet(); return; }
      bentoTarget=null; addBlock(t);
    });
    const out=e=>{
      const mm=document.getElementById('fabRadial');
      if(!mm){ document.removeEventListener('pointerdown',out,true); return; }
      if(!mm.contains(e.target) && !e.target.closest('#fab')){ toggleFabRadial(); document.removeEventListener('pointerdown',out,true); }
    };
    setTimeout(()=>document.addEventListener('pointerdown',out,true),30);
  }
  /* ── ДОК ШВИДКИХ ДІЙ (мобільний, поза полотном) ── */
  (function(){
    const dock=document.getElementById('mobileDock'); if(!dock) return;
    dock.querySelectorAll('[data-dk]').forEach(b=>b.onclick=()=>{
      const t=b.dataset.dk;
      if(t==='__more'){ openFullAddSheet(); return; }
      bentoTarget=null; addBlock(t);
      try{ window.platform.haptic('light'); }catch(_){}
      // нотатка — одразу фокус у текст (дух «композера»): пишеш без зайвого тапу
      if(t==='note') setTimeout(()=>{ try{
        const txs=document.querySelectorAll('#board .tile textarea, #board .tile .tx');
        const tx=txs[txs.length-1]; if(tx&&tx.focus) tx.focus();
      }catch(_){} },140);
    });
    // довгий тап на «＋» дока → швидке захоплення (як було на FAB)
    const plus=dock.querySelector('.dk-plus');
    let h=null, lng=false;
    plus.addEventListener('pointerdown',()=>{ lng=false; h=setTimeout(()=>{ lng=true; try{window.platform.haptic('light');}catch(_){} openQuickCapture(); },480); });
    const clr=()=>{ if(h){ clearTimeout(h); h=null; } };
    plus.addEventListener('pointerup',clr); plus.addEventListener('pointerleave',clr); plus.addEventListener('pointercancel',clr);
    plus.addEventListener('click',e=>{ if(lng){ e.stopImmediatePropagation(); e.preventDefault(); lng=false; } },true);
  })();
  // довгий тап на FAB → швидке захоплення думки у «Вхідні»
  { const fab=document.getElementById('fab'); let fabHold=null, fabLong=false;
    fab.addEventListener('pointerdown',()=>{ fabLong=false; fabHold=setTimeout(()=>{ fabLong=true; window.platform.haptic('light'); openQuickCapture(); },480); });
    const clr=()=>{ if(fabHold){ clearTimeout(fabHold); fabHold=null; } };
    fab.addEventListener('pointerup',clr); fab.addEventListener('pointerleave',clr); fab.addEventListener('pointercancel',clr);
    // якщо був довгий тап — не відкривати звичайний addsheet
    fab.addEventListener('click',e=>{ if(fabLong){ e.stopImmediatePropagation(); e.preventDefault(); fabLong=false; } },true);
  }
  document.getElementById('addsheet').onclick=e=>{ if(e.target.id==='addsheet'){ bentoTarget=null; e.currentTarget.classList.remove('open'); } };
  document.getElementById('spaceClear').onclick=()=>{
    const f=folders[currentFolderKey];
    const label = f ? f.name : 'аркуш';
    confirmSheet({title:'Очистити дошку «'+label+'»?', okLabel:'Очистити', onOk:()=>{ boards[boardKey]=[]; syncBlocks(); saveBoard(); renderBoard(); }});
  };
  const VIEW_ORDER=['shelf','merged','grid'];
  const _vsvg=(inner)=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const VIEW_ICON={
    shelf:_vsvg('<rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="15" width="18" height="5" rx="1.5"/>'),
    merged:_vsvg('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
    grid:_vsvg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>')
  };
  const VIEW_NAME={shelf:'Полиці', merged:'Суцільний', grid:'Сітка'};
  function applyViewIcon(){
    const vt=document.getElementById('viewToggle');
    if(vt){ vt.innerHTML=VIEW_ICON[viewMode]; vt.title='Вигляд: '+VIEW_NAME[viewMode]; }
  }
  document.getElementById('viewToggle').onclick=()=>{
    const i=VIEW_ORDER.indexOf(viewMode);
    viewMode=VIEW_ORDER[(i+1)%VIEW_ORDER.length];
    saveViewMode(); applyViewIcon(); renderBoard();
    window.platform.haptic('select');
  };

  function applyWideIcon(){
    const wt=document.getElementById('boardWideToggle');
    if(!wt) return;
    const on = boardCols>4;
    wt.style.opacity = on ? '1' : '.6';
    wt.title = 'Ширина дошки: '+boardCols+' колонок'+(on?' (гортай вправо)':'');
    // невеликий лейбл-бейдж
    wt.innerHTML = on ? `<span style="font-weight:800;font-size:13px">×${boardCols/4===2?'2':'1.5'}</span>` : '↔️';
  }
  const wideBtn=document.getElementById('boardWideToggle');
  if(wideBtn) wideBtn.onclick=()=>{
    if(viewMode!=='grid'){ // широка дошка має сенс лише в сітці — перемкнемо в сітку
      viewMode='grid'; saveViewMode(); applyViewIcon();
    }
    const i=WIDE_STEPS.indexOf(boardCols);
    boardCols=WIDE_STEPS[(i+1)%WIDE_STEPS.length];
    saveBoardCols(); applyWideIcon(); renderBoard();
    window.platform.haptic('select');
  };

  const canvasBtn=document.getElementById('canvasToggle');
  if(canvasBtn) canvasBtn.onclick=()=>{ toggleCanvasMode(); };

  function saveBoard(){
    try{ const p=window.storage.set(BKEY,JSON.stringify(boards),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
  }

  // фабрика блока (лише конструювання, без вставки) — для водяного «＋»
  function buildBlock(type){
    if(type==='photo') return null; // фото йде окремим асинхронним шляхом
    const base={ id:Date.now()+Math.random(), type, title:(BLOCK_TYPES[type]||{}).title||'' };
    if(type==='bento') Object.assign(base,{title:'',sections:[{id:Date.now()+1,type:'text',text:''}]});
    if(type==='note')  Object.assign(base,{text:'',title:''});
    if(type==='quick') Object.assign(base,{text:'',title:''});
    if(type==='check') Object.assign(base,{items:[{id:Date.now(),text:'',done:false}],title:''});
    if(type==='list')  Object.assign(base,{items:[{id:Date.now(),text:''}],title:'Список'});
    if(type==='table') Object.assign(base,{title:'Таблиця',cols:['Назва','Значення'],rows:[['',''],['','']]});
    if(type==='task')  Object.assign(base,{text:'',due:'',done:false,prio:'none',title:'Завдання'});
    if(type==='link')  Object.assign(base,{url:'',label:'',title:'Посилання'});
    if(type==='head')  Object.assign(base,{title:'Нова секція'});
    /* PREMIUM PACK V1 */
    if(type==='heatmap') Object.assign(base,{title:'Звичка',marks:{}});
    if(type==='kpi')     Object.assign(base,{title:'KPI',unit:'',points:[]});
    if(type==='chart')   Object.assign(base,{title:'Графік',points:[],view:'bar'});
    if(type==='tabs')    Object.assign(base,{title:'',tabs:[{name:'Нотатки',text:''}],ti:0});
    if(type==='accord')  Object.assign(base,{title:'',secs:[{name:'Секція',text:'',open:1}]});
    if(type==='code')    Object.assign(base,{title:'Код',text:'',lang:'js'});
    if(type==='embed')   Object.assign(base,{title:'Відео',url:'',play:0});
    if(type==='audio')   Object.assign(base,{title:'',url:'',name:''});
    if(type==='wfocus')  Object.assign(base,{title:'Фокус',mode:'work',end:0,done:0,doneD:''});
    if(type==='fin')   Object.assign(base,{title:'Фінанси'});
    if(type==='envelope') Object.assign(base,{title:'Конверт',envId:null});
    if(type==='project') Object.assign(base,{title:'Проєкт',ops:[],expected:0,cur:'€',deadline:'',unlocked:false,pview:1});
    if(type==='divider') Object.assign(base,{title:''});
    if(type==='quote') Object.assign(base,{text:'',title:'Цитата'});
    if(type==='glass') Object.assign(base,{text:'',title:'Скло'});
    if(type==='progress') Object.assign(base,{value:0,title:'Прогрес'});
    if(type==='calendar') Object.assign(base,{title:'Календар',marks:{},ym:ymLocal()});
    if(type==='countdown') Object.assign(base,{title:'Відлік',target:'',label:''});
    if(type==='toggle') Object.assign(base,{title:'Заголовок тоглу',text:'',open:false});
    if(type==='callout') Object.assign(base,{text:'',tone:'tip'});
    if(type==='numlist') Object.assign(base,{items:['']});
    if(type==='h1') Object.assign(base,{text:'Заголовок'});
    if(type==='h2') Object.assign(base,{text:'Підзаголовок'});
    if(type==='h3') Object.assign(base,{text:'Малий заголовок'});
    if(type==='group') Object.assign(base,{title:'Нова папка',children:[],open:true});
    if(type==='page')  Object.assign(base,{title:'Нова сторінка',children:[],open:true});
    if(type==='book')  Object.assign(base,{title:'Нова книга',author:'',fmt:'',bookId:'',progress:0,loc:0,bookmarks:[],added:Date.now(),needsFile:true});
    if(type==='wstack') Object.assign(base,{title:'Фокус-стек',idx:0});
    if(type==='wpult'||type==='wpipe'||type==='wtline'||type==='wportal') base.title=BLOCK_TYPES[type].title;
    if(type==='wplanday'||type==='wplanmonth'){ base.title=BLOCK_TYPES[type].title; try{ const cx=curCtx(); if(cx!=='__root__') base.pfolder=cx; }catch(_){} }
    if(type==='kanban') Object.assign(base,{title:'Канбан',cols:[
      {id:'kc'+Date.now(),name:'Заявки',cards:[]},
      {id:'kc'+(Date.now()+1),name:'В роботі',cards:[]},
      {id:'kc'+(Date.now()+2),name:'Готово',cards:[]}]});
    if(type==='contacts') Object.assign(base,{title:'Контакти',people:[]});
    if(type==='caseline') Object.assign(base,{title:'Таймлайн справи',events:[]});
    if(type==='festival') Object.assign(base,{title:'Нова подія',emojiF:'🎪',date:'',dateEnd:'',place:'',budget:0,cur:'€',ops:[],program:[]});
    return base;
  }

  function addBlock(type){
    // === Водяний «＋»: додаємо в конкретний блок ===
    if(bentoTarget){
      const host=getBlock(bentoTarget);
      const tgt=bentoTarget; bentoTarget=null;
      if(host){
        const secType=BENTO_SEC_TYPES[type];
        if(secType){
          // легкий тип → секція ВСЕРЕДИНУ блока
          if(!Array.isArray(host.sections)) host.sections=[];
          const sec={id:Date.now()+Math.random(),type:secType};
          if(secType==='text')  sec.text='';
          if(secType==='check') sec.items=[{id:Date.now(),text:'',done:false}];
          if(secType==='link'){ sec.url=''; sec.label=''; }
          host.sections.push(sec);
          syncBlocks(); saveBoard(); renderBoard();
          document.getElementById('addsheet').classList.remove('open');
          requestAnimationFrame(()=>{ const el=document.querySelector('[data-tileid="'+tgt+'"]'); if(el) el.scrollIntoView({behavior:'smooth',block:'center'}); });
          return;
        }
        // важкий тип → окремий блок ОДРАЗУ ПІД поточним
        if(type!=='photo'){
          const arr=findParentArr(curBoard(),tgt);
          if(arr){
            const idx=arr.findIndex(x=>String(x.id)===String(tgt));
            const nb=buildBlock(type);
            if(nb){ arr.splice(idx+1,0,nb); syncBlocks(); saveBoard(); renderBoard();
              document.getElementById('addsheet').classList.remove('open');
              requestAnimationFrame(()=>{ const el=document.querySelector('[data-tileid="'+nb.id+'"]'); if(el) el.scrollIntoView({behavior:'smooth',block:'center'}); });
              if(type==='book'){ requestAnimationFrame(()=>{ try{ pickBookFile(nb.id); }catch(_){} }); }
              return;
            }
          }
        }
        // фото або fallback — додаємо звичайним шляхом нижче
      }
    }
    if(type==='photo'){
      // визначаємо цільовий масив ДО асинхронного вибору файлу
      let tArr=currentLevelArr();
      if(addTargetGroup){ const g=getBlock(addTargetGroup); if(g&&isContainer(g)){ if(!Array.isArray(g.children))g.children=[]; tArr=g.children; } }
      addTargetGroup=null;
      pickPhoto(tArr);
      document.getElementById('addsheet').classList.remove('open');
      return;
    }
    if(!BLOCK_TYPES[type]){ console.warn('addBlock: невідомий тип', type); return; }
    const base={ id:Date.now()+Math.random(), type, title:BLOCK_TYPES[type].title };
    if(type==='bento') Object.assign(base,{title:'',sections:[{id:Date.now()+1,type:'text',text:''}]});
    if(type==='note')  Object.assign(base,{text:'',title:''});
    if(type==='quick') Object.assign(base,{text:'',title:''});
    if(type==='check') Object.assign(base,{items:[{id:Date.now(),text:'',done:false}],title:''});
    if(type==='list')  Object.assign(base,{items:[{id:Date.now(),text:''}],title:'Список'});
    if(type==='table') Object.assign(base,{title:'Таблиця',cols:['Назва','Значення'],rows:[['',''],['','']]});
    if(type==='task')  Object.assign(base,{text:'',due:'',done:false,prio:'none',title:'Завдання'});
    if(type==='link')  Object.assign(base,{url:'',label:'',title:'Посилання'});
    if(type==='head')  Object.assign(base,{title:'Нова секція'});
    /* PREMIUM PACK V1 */
    if(type==='heatmap') Object.assign(base,{title:'Звичка',marks:{}});
    if(type==='kpi')     Object.assign(base,{title:'KPI',unit:'',points:[]});
    if(type==='chart')   Object.assign(base,{title:'Графік',points:[],view:'bar'});
    if(type==='tabs')    Object.assign(base,{title:'',tabs:[{name:'Нотатки',text:''}],ti:0});
    if(type==='accord')  Object.assign(base,{title:'',secs:[{name:'Секція',text:'',open:1}]});
    if(type==='code')    Object.assign(base,{title:'Код',text:'',lang:'js'});
    if(type==='embed')   Object.assign(base,{title:'Відео',url:'',play:0});
    if(type==='audio')   Object.assign(base,{title:'',url:'',name:''});
    if(type==='wfocus')  Object.assign(base,{title:'Фокус',mode:'work',end:0,done:0,doneD:''});
    if(type==='fin')   Object.assign(base,{title:'Фінанси'});
    if(type==='envelope') Object.assign(base,{title:'Конверт',envId:null});
    if(type==='project') Object.assign(base,{title:'Проєкт',ops:[],expected:0,cur:'€',deadline:'',unlocked:false,pview:1});
    if(type==='divider') Object.assign(base,{title:''});
    if(type==='quote') Object.assign(base,{text:'',title:'Цитата'});
    if(type==='glass') Object.assign(base,{text:'',title:'Скло'});
    if(type==='progress') Object.assign(base,{value:0,title:'Прогрес'});
    if(type==='calendar') Object.assign(base,{title:'Календар',marks:{},ym:ymLocal()});
    if(type==='countdown') Object.assign(base,{title:'Відлік',target:'',label:''});
    if(type==='toggle') Object.assign(base,{title:'Заголовок тоглу',text:'',open:false});
    if(type==='callout') Object.assign(base,{text:'',tone:'tip'});
    if(type==='numlist') Object.assign(base,{items:['']});
    if(type==='h1') Object.assign(base,{text:'Заголовок'});
    if(type==='h2') Object.assign(base,{text:'Підзаголовок'});
    if(type==='h3') Object.assign(base,{text:'Малий заголовок'});
    if(type==='group') Object.assign(base,{title:'Нова папка',children:[],open:true});
    if(type==='page')  Object.assign(base,{title:'Нова сторінка',children:[],open:true});
    if(type==='book')  Object.assign(base,{title:'Нова книга',author:'',fmt:'',bookId:'',progress:0,loc:0,bookmarks:[],added:Date.now(),needsFile:true});
    if(type==='wstack') Object.assign(base,{title:'Фокус-стек',idx:0});
    if(type==='wpult'||type==='wpipe'||type==='wtline'||type==='wportal') base.title=BLOCK_TYPES[type].title;
    if(type==='wplanday'||type==='wplanmonth'){ base.title=BLOCK_TYPES[type].title; try{ const cx=curCtx(); if(cx!=='__root__') base.pfolder=cx; }catch(_){} }
    if(type==='kanban') Object.assign(base,{title:'Канбан',cols:[
      {id:'kc'+Date.now(),name:'Заявки',cards:[]},
      {id:'kc'+(Date.now()+1),name:'В роботі',cards:[]},
      {id:'kc'+(Date.now()+2),name:'Готово',cards:[]}]});
    if(type==='contacts') Object.assign(base,{title:'Контакти',people:[]});
    if(type==='caseline') Object.assign(base,{title:'Таймлайн справи',events:[]});
    if(type==='festival') Object.assign(base,{title:'Нова подія',emojiF:'🎪',date:'',dateEnd:'',place:'',budget:0,cur:'€',ops:[],program:[]});
    // куди вставляти: у явно вказану папку, інакше у поточний відкритий рівень
    let targetArr;
    if(addTargetGroup){
      const g=getBlock(addTargetGroup);
      if(g&&isContainer(g)){ if(!Array.isArray(g.children))g.children=[]; targetArr=g.children; }
      else targetArr=currentLevelArr();
    } else {
      targetArr=currentLevelArr();
    }
    targetArr.push(base); syncBlocks();
    // CANVAS: одразу дати координати у вільне місце, щоб блок НЕ стрибав у лівий/верхній кут
    // і не лягав під шапку екрана. Раніше x завжди фіксувався на 12px (тому будь-який новий
    // блок «приклеювався» до лівого краю) — тепер шукаємо реально вільне місце тим самим
    // алгоритмом, що й підбір позиції при перетягуванні (resolveCanvasCollision).
    if(isCanvasMode() && base.fx==null){
      try{
        base.fw = base.fw || 260;
        base.fh = base.fh || (isContainer(base)||base.type==='page' ? 120 : null);
        const board=document.getElementById('board');
        const PAD_X=12, PAD_TOP=76; // відступ зверху — щоб перший блок не опинився під фіксованою шапкою/крихтами навігації
        const w=base.fw, h=(base.fh||130);
        let maxBottom=PAD_TOP;
        targetArr.forEach(ob=>{ if(ob!==base && ob.fx!=null && ob.fy!=null)
          maxBottom=Math.max(maxBottom, ob.fy+(ob.fh||130)+12); });
        if(board){
          const pos=resolveCanvasCollision(board, base.id, PAD_X, maxBottom, w, h);
          base.fx=pos.x; base.fy=pos.y;
        } else {
          base.fx=PAD_X; base.fy=maxBottom;
        }
      }catch(_){ base.fx=12; base.fy=76; }
    }
    addTargetGroup=null;
    document.getElementById('addsheet').classList.remove('open');
    saveBoard(); renderBoard();
    // нова книга — одразу пропонуємо завантажити файл
    if(type==='book'){ requestAnimationFrame(()=>{ try{ pickBookFile(base.id); }catch(_){} }); }
    // прокрутка до новоствореного блоку — на полотні враховуємо зум (native scrollIntoView
    // ігнорує CSS transform:scale і на зумі != 100% промахується повз реальну позицію блоку)
    requestAnimationFrame(()=>{
      const el=document.querySelector('[data-tileid="'+base.id+'"]');
      if(!el) return;
      if(isCanvasMode() && base.fx!=null && base.fy!=null){
        try{
          const board=document.getElementById('board');
          const z=getZoom();
          const w=base.fw||el.offsetWidth||260, h=base.fh||el.offsetHeight||130;
          board.scrollTo({
            left: Math.max(0,(base.fx*z)-(board.clientWidth-w*z)/2),
            top:  Math.max(0,(base.fy*z)-(board.clientHeight-h*z)/2),
            behavior:'smooth'
          });
          return;
        }catch(_){}
      }
      el.scrollIntoView({behavior:'smooth',block:'center'});
    });
    // «внутрішнє» налаштування: фокус на текстовому полі одразу після створення
    // (нотатка/картка/цитата/завдання/заголовки — все, що редагується текстом одразу)
    if(autoFocusNewBlock){
      const TEXT_FIRST={note:1,quick:1,quote:1,task:1,h1:1,h2:1,h3:1,callout:1,toggle:1};
      if(TEXT_FIRST[type]){
        setTimeout(()=>{
          try{
            const tile=document.querySelector('[data-tileid="'+base.id+'"]');
            const field=tile && tile.querySelector('[contenteditable="true"]');
            if(field){ field.focus(); const r=document.createRange(); r.selectNodeContents(field); r.collapse(false);
              const sel=window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
          }catch(_){}
        },360);
      }
    }
  }
  let addTargetGroup=null; // id папки, в яку додаємо блок (null = верхній рівень)
  let bentoTarget=null;    // id блока, в який додаємо секцію через водяний «＋»
  // типи, що додаються СЕКЦІЄЮ всередину блока (решта — окремим блоком під поточним)
  const BENTO_SEC_TYPES={note:'text', text:'text', check:'check', link:'link', divider:'divider'};

