  /* ============ КАНАЛ ПАПКИ ============
     Папка відкривається як стрічка повідомлень (варіант «Канал», обрано 05.09.2026):
     обкладинка з назвою → чипи-теми (простори папки) → бульбашки за часом →
     рядок вводу знизу, як у месенджері.

     Дані ТІ САМІ, що й у документі-редакторі: boards[key] (головний простір)
     і boards[key+'__sp_'+id] (теми). Нового сховища немає. Новим блокам
     дописуємо `at` (мс); старим час відновлюємо з id — редактор зашиває в id
     Date.now() у base36 ('pg' + 8 символів), стара дошка — Date.now()+random.
     Що не датується — іде вгору під підписом «Раніше».

     Документ лишається: тап по бульбашці відкриває його на цьому блоці,
     «⋯ → Відкрити як документ» — цілком. */
  let chKey=null;          // ключ відкритої папки
  let chTopic='all';       // 'all' | 'media' | id простору
  let chMode='note';       // що створить рядок вводу: 'note' | 'task'
  let chRec=null, chStream=null; // диктування
  let chLongPressed=false; // довге утримання чипа: не вважати тапом
  let chAiBusy=false;      // AI-підсумок уже в дорозі — повторний тап ігноруємо

  const CH_I={
    back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    dots:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>',
    camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>',
    send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    image:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-8 8"/></svg>',
    task:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>',
    page:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>',
    doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>',
    chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
    spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg>',
  };
  function chI(n){ return CH_I[n]||''; }
  function chToast(m){ try{ (window.__flowToast||function(){})(m); }catch(_){} }
  function chHaptic(k){ try{ window.platform.haptic(k||'light'); }catch(_){} }
  function chFolder(){ return chKey?folders[chKey]:null; }
  function chSpaces(){ return spacesFor(chKey); }
  function chBk(id){ return keyForSpaceIn(chKey,id); }
  // куди лягає новий запис: у поточну тему; в «Усе» і «Медіа» — у головний простір
  function chTargetBk(){ return chBk((chTopic==='all'||chTopic==='media')?'main':chTopic); }
  // той самий формат id, що й у редакторі сторінки — з нього потім читається час
  function chUid(){ return 'pg'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  // текст блока без HTML (редактор зберігає textContent, але старі дані бувають різні)
  function chPlain(s){
    s=String(s==null?'':s);
    if(s.indexOf('<')<0) return s;
    try{ return new DOMParser().parseFromString(s,'text/html').body.textContent||''; }catch(_){ return s; }
  }
  function chTxt(b){ return chPlain(b.text!=null?b.text:(b.title!=null?b.title:'')); }

  /* час блока: явне поле `at`, інакше — з id */
  function chTimeOf(b){
    if(!b) return 0;
    if(typeof b.at==='number' && b.at>0) return b.at;
    const id=String(b.id||''); let t=0, m;
    m=/^pg([0-9a-z]{8})/.exec(id); if(m) t=parseInt(m[1],36);
    if(!t){ m=/(\d{13})(?!\d)/.exec(id); if(m) t=+m[1]; }
    if(!t && /^\d+(\.\d+)?$/.test(id)) t=Math.floor(+id);
    if(!(t>1.4e12 && t<4e12)) return 0; // до 2014 або після 2096 — не дата
    return t;
  }
  function chDayLabel(t){
    if(!t) return 'Раніше';
    const d=new Date(t), now=new Date();
    const d0=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();
    const n0=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
    const diff=Math.round((n0-d0)/864e5);
    if(diff===0) return 'Сьогодні';
    if(diff===1) return 'Вчора';
    const M=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
    return d.getDate()+' '+M[d.getMonth()]+(d.getFullYear()!==now.getFullYear()?' '+d.getFullYear():'');
  }
  function chHM(t){ const d=new Date(t); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }

  /* записи стрічки: блоки верхнього рівня обраних тем, за часом */
  function chItems(){
    const sps=chSpaces();
    const list = chTopic==='all' ? sps : sps.filter(s=>s.id===chTopic);
    const out=[];
    list.forEach(s=>{
      const bk=chBk(s.id);
      (boards[bk]||[]).forEach((b,i)=>{ if(b) out.push({b,bk,sp:s,at:chTimeOf(b),i}); });
    });
    out.sort((a,b)=>(a.at-b.at)||(a.i-b.i));
    return out;
  }
  /* усі фото папки, включно з вкладеними — для чипа «Медіа» */
  function chPhotos(){
    const out=[];
    chSpaces().forEach(s=>{
      const bk=chBk(s.id);
      const walk=(arr)=>{ (arr||[]).forEach(b=>{ if(!b) return;
        if(b.type==='photo'&&b.data) out.push({b,bk,sp:s,at:chTimeOf(b)});
        if(Array.isArray(b.children)) walk(b.children); }); };
      walk(boards[bk]);
    });
    out.sort((a,b)=>b.at-a.at);
    return out;
  }

  /* ── вхід ── */
  function goChannel(key){
    const f=folders[key]; if(!f){ goHome(); return; }
    if(goChannel._last!==key){ chTopic='all'; }
    goChannel._last=key;
    chKey=key; currentFolderKey=key; spaceFromFolder=key; folderPath=[];
    boardKey=chBk('main'); if(!boards[boardKey]) boards[boardKey]=[]; syncBlocks();
    chSetMode('note'); chToggleTray(false);
    renderChannel();
    show('scr-channel');
    chScrollBottom(false);
  }
  function chBack(){
    try{ if(typeof renderDashboard==='function') renderDashboard(); }catch(_){}
    goHome();
  }
  // ВАЖЛИВО: скрол — на body (він position:fixed з overflow-y:auto), а show()
  // скидає scrollTop у 0 ще й через 80 мс — тому другий виклик пізніше за це.
  // Без smooth: плавний скрол перебивається фокусом поля вводу і не доходить до кінця.
  // Третій виклик — коли фото в останній бульбашці домалювалось і стрічка підросла.
  function chScrollBottom(){
    const go=()=>{ chFitFeed(); document.body.scrollTop=document.body.scrollHeight; };
    go(); setTimeout(go,130); setTimeout(go,360);
  }
  // відступ стрічки знизу = висота рядка вводу (з чипом, лотком, багаторядковим текстом);
  // 62 px уже закладено в margin-bottom секції — див. 18-channel.css
  function chFitFeed(){
    const comp=document.getElementById('chComposer'), feed=document.getElementById('chFeed');
    if(!comp||!feed) return;
    feed.style.paddingBottom=Math.max(0,comp.offsetHeight-62)+'px';
  }
  function renderChannel(){
    const f=chFolder(); if(!f) return;
    if(chTopic!=='all'&&chTopic!=='media'&&!chSpaces().some(s=>s.id===chTopic)) chTopic='all';
    const scr=document.getElementById('scr-channel');
    scr.style.setProperty('--fc', f.c||'var(--accent)');
    renderChCover(); renderChChips(); renderChFeed();
  }

  /* ── обкладинка: той самий механізм, що й у документі (window.__pgCovers) ── */
  function chCoverApi(){ return window.__pgCovers||null; }
  function renderChCover(){
    const f=chFolder(), el=document.getElementById('chCover'); if(!f||!el) return;
    const api=chCoverApi(); const cov=api?api.get(chKey):null;
    let bg;
    if(cov&&cov.img) bg=`background-image:url('${cov.img}');background-size:cover;background-position:50% ${cov.pos==null?50:cov.pos}%;`;
    else if(cov&&api&&api.grads[cov.g||0]) bg='background:'+api.grads[cov.g||0]+';';
    else bg=`background:linear-gradient(160deg,color-mix(in srgb,${f.c} 60%,#0f1115),color-mix(in srgb,${f.c} 14%,var(--bg)));`;
    const em=(f.emoji&&f.emoji.trim())?f.emoji:esc((f.name||'?').trim().charAt(0).toUpperCase());
    el.innerHTML=`<div class="ch-cov-bg" style="${bg}"></div>
      <div class="ch-cov-top">
        <button class="ch-ghost" id="chBack" aria-label="Назад до папок">${chI('back')}</button>
        <span class="ch-sp"></span>
        <button class="ch-chip-photo" id="chPhotoBtn">${chI('camera')}<span>Фото</span></button>
        <button class="ch-ghost" id="chMore" aria-label="Ще дії">${chI('dots')}</button>
      </div>
      <div class="ch-cov-title"><span class="ch-av">${em}</span><h1>${esc(f.name)}</h1></div>`;
    el.querySelector('#chBack').onclick=chBack;
    el.querySelector('#chPhotoBtn').onclick=chCoverSheet;
    el.querySelector('#chMore').onclick=chMoreSheet;
  }
  function chCoverSheet(){
    const api=chCoverApi(); if(!api){ chToast('⚠️ Обкладинки недоступні'); return; }
    const cov=api.get(chKey);
    const sw=api.grads.map((g,i)=>`<button class="ch-sw ${cov&&!cov.img&&(cov.g||0)===i?'on':''}" data-chgrad="${i}" style="background:${g}" aria-label="Градієнт ${i+1}"></button>`).join('');
    chSheet('Обкладинка папки',
      `<button class="ch-sheet-row" data-chcov="photo"><span class="ic">${chI('camera')}</span><span>Вибрати фото</span></button>
       <div class="ch-sw-row">${sw}</div>
       ${cov?`<button class="ch-sheet-row danger" data-chcov="clear"><span class="ic">${chI('trash')}</span><span>Прибрати обкладинку</span></button>`:''}`,
      (ov,close)=>{
        ov.querySelectorAll('[data-chgrad]').forEach(b=>b.onclick=()=>{ api.set(chKey,{g:+b.dataset.chgrad}); renderChCover(); chHaptic('select'); close(); });
        const ph=ov.querySelector('[data-chcov="photo"]'); if(ph) ph.onclick=()=>{ close(); chPickFile(f=>chShrink(f,1200,760,data=>{ const prev=api.get(chKey)||{}; api.set(chKey,{img:data,pos:prev.pos==null?50:prev.pos,dark:prev.dark==null?30:prev.dark,h:prev.h||176}); renderChCover(); })); };
        const cl=ov.querySelector('[data-chcov="clear"]'); if(cl) cl.onclick=()=>{ api.clear(chKey); renderChCover(); close(); };
      });
  }
  function chMoreSheet(){
    chSheet('',
      `<button class="ch-sheet-row" data-chm="doc"><span class="ic">${chI('doc')}</span><span>Відкрити як документ</span></button>
       <button class="ch-sheet-row" data-chm="cover"><span class="ic">${chI('camera')}</span><span>Обкладинка</span></button>
       <button class="ch-sheet-row" data-chm="topics"><span class="ic">${chI('menu')}</span><span>Теми папки</span></button>`,
      (ov,close)=>{
        ov.querySelector('[data-chm="doc"]').onclick=()=>{ close(); chOpenInDoc(chTargetBk(),null); };
        ov.querySelector('[data-chm="cover"]').onclick=()=>{ close(); setTimeout(chCoverSheet,200); };
        ov.querySelector('[data-chm="topics"]').onclick=()=>{ close(); chOpenTopicSettings(); };
      });
  }
  // налаштування просторів (перейменувати / емодзі / видалити) — наявна шторка;
  // curCtx() уже дорівнює нашій папці, бо goChannel виставив spaceFromFolder
  function chOpenTopicSettings(focusId){
    try{ openSpaceSettings(focusId); }catch(e){ console.error('chOpenTopicSettings',e); return; }
    const wait=setInterval(()=>{ if(!document.querySelector('.spcfg-ov')){ clearInterval(wait); if(chKey) renderChannel(); } },400);
  }

  /* ── чипи-теми ── */
  function renderChChips(){
    const host=document.getElementById('chChips'); if(!host) return;
    const sps=chSpaces();
    let h=`<button class="ch-chip ${chTopic==='all'?'on':''}" data-chtopic="all">Усе</button>`;
    // головний простір не показуємо окремо: його записи і так у «Усе», туди ж іде рядок вводу
    sps.filter(s=>s.id!=='main').forEach(s=>{
      h+=`<button class="ch-chip ${chTopic===s.id?'on':''}" data-chtopic="${s.id}" data-chsp="${s.id}"><span class="e">${s.emoji||'📄'}</span>${esc(s.name)}</button>`;
    });
    h+=`<button class="ch-chip ${chTopic==='media'?'on':''}" data-chtopic="media">${chI('image')}Медіа</button>`;
    h+=`<button class="ch-chip add" data-chadd aria-label="Нова тема">${chI('plus')}</button>`;
    host.innerHTML=h;
    host.querySelectorAll('[data-chtopic]').forEach(b=>{
      b.onclick=()=>{ if(chLongPressed){ chLongPressed=false; return; } chTopic=b.dataset.chtopic; chHaptic('select'); renderChChips(); renderChFeed(); chScrollBottom(false); };
      if(b.dataset.chsp) chAttachLongPress(b,()=>chOpenTopicSettings(b.dataset.chsp));
    });
    host.querySelector('[data-chadd]').onclick=chAddTopic;
    // активний чип — у видиму частину ряду. НЕ scrollIntoView: рядок липкий (sticky),
    // і браузер тоді прокручує body до його «паперового» місця — стрічка стрибає вгору
    const on=host.querySelector('.ch-chip.on');
    if(on){ const l=on.offsetLeft-12, r=on.offsetLeft+on.offsetWidth+12-host.clientWidth;
      if(host.scrollLeft>l) host.scrollLeft=Math.max(0,l); else if(host.scrollLeft<r) host.scrollLeft=r; }
  }
  function chAttachLongPress(el,fn){
    let t=null;
    const start=()=>{ chLongPressed=false; t=setTimeout(()=>{ chLongPressed=true; chHaptic('medium'); fn(); },550); };
    const stop=()=>{ if(t){ clearTimeout(t); t=null; } };
    el.addEventListener('pointerdown',start);
    ['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,stop));
    el.addEventListener('contextmenu',e=>e.preventDefault());
  }
  function chAddTopic(){
    inputModal({ title:'Нова тема', placeholder:'Назва теми', emoji:true, emojiVal:'📄',
      onOk:(name,em)=>{
        const list=spacesFor(chKey);
        const palette=['#ff6b9d','#34c77b','#f0b429','#c77dff','#4ecdc4','#e8843c','#9b8cff','#5b8def'];
        const id='s'+Date.now().toString(36), n=list.length;
        list.push({id, name:(name||'').trim()||('Тема '+n), emoji:((em||'').trim().slice(0,2))||'📄', color:palette[n%palette.length]});
        boards[chBk(id)]=[]; activeSpaceMap[chKey]=id; saveSpacesMeta(); saveBoard();
        chTopic=id; chHaptic('medium'); renderChannel();
      }});
  }

  /* ── стрічка ── */
  function renderChFeed(){
    const host=document.getElementById('chFeed'); if(!host) return;
    if(chTopic==='media'){
      const ph=chPhotos();
      host.innerHTML = ph.length
        ? `<div class="ch-media">${ph.map(p=>`<button class="ch-mi" data-chopen="${p.bk}|${p.b.id}"><img src="${p.b.data}" alt="" loading="lazy"></button>`).join('')}</div>`
        : `<div class="ch-empty"><b>Фото ще немає</b><span>Додай через «+» → Фото — і всі знімки папки збиратимуться тут.</span></div>`;
      chBindFeed(host); return;
    }
    const items=chItems();
    if(!items.length){
      host.innerHTML=`<div class="ch-empty"><b>Поки порожньо</b><span>Напиши перше повідомлення внизу — воно стане записом у папці.</span></div>`;
      return;
    }
    let h='', lastDay=null;
    items.forEach(it=>{
      const day=chDayLabel(it.at);
      if(day!==lastDay){ h+=`<div class="ch-day">${day}</div>`; lastDay=day; }
      h+=chBubble(it);
    });
    host.innerHTML=h;
    chBindFeed(host);
    chAiSync();
  }
  function chBubble(it){
    const b=it.b, t=b.type||'note';
    if(t==='divider') return '';
    let tag=(chTopic==='all'&&it.sp&&it.sp.id!=='main') ? `<div class="ch-tag" style="--sc:${it.sp.color||'var(--accent)'}">${it.sp.emoji||''} ${esc(it.sp.name)}</div>` : '';
    if(b.ai) tag+=`<div class="ch-tag ai">${chI('spark')}Підсумок</div>`;
    const time=it.at ? `<div class="ch-time">${chHM(it.at)}</div>` : '';
    const meta=(typeof BLOCK_TYPES!=='undefined'&&BLOCK_TYPES[t])||{};
    let body='', cls='';
    if(t==='note'||t==='quick'||t==='callout'){
      const s=chTxt(b); body=`<div class="ch-text">${s?esc(s):'<i class="ch-mut">порожня нотатка</i>'}</div>`;
    } else if(t==='head'||t==='h1'||t==='h2'||t==='h3'){
      body=`<div class="ch-text ch-head">${esc(chTxt(b))}</div>`;
    } else if(t==='quote'){
      body=`<div class="ch-text ch-quote">${esc(chTxt(b))}</div>`;
    } else if(t==='task'){
      const s=chTxt(b);
      body=`<div class="ch-task ${b.done?'done':''}"><button class="ch-box" data-chtodo="${it.bk}|${b.id}" aria-label="Виконано">${b.done?chI('check'):''}</button><div class="ch-text">${s?esc(s):'<i class="ch-mut">Завдання…</i>'}</div></div>`;
    } else if(t==='check'){
      const items=(b.items||[]).filter(x=>x&&(x.text||'').trim());
      body=`<div class="ch-card">${b.title?`<div class="ch-card-t">${esc(b.title)}</div>`:''}${items.length?items.map(x=>`<div class="ch-task ${x.done?'done':''}"><button class="ch-box" data-chtodo="${it.bk}|${b.id}|${x.id}" aria-label="Виконано">${x.done?chI('check'):''}</button><div class="ch-text">${esc(chPlain(x.text))}</div></div>`).join(''):'<i class="ch-mut">Порожній чекліст</i>'}</div>`;
    } else if(t==='list'||t==='numlist'){
      const items=(b.items||[]).filter(x=>x&&(x.text||'').trim());
      body=`<div class="ch-card">${b.title&&b.title!=='Список'?`<div class="ch-card-t">${esc(b.title)}</div>`:''}${items.map((x,i)=>`<div class="ch-li"><span>${t==='numlist'?(i+1)+'.':'•'}</span><div class="ch-text">${esc(chPlain(x.text))}</div></div>`).join('')}</div>`;
    } else if(t==='photo'){
      cls=' photo';
      // без loading="lazy": фото — data-URL, а лінива підгрузка після прокрутки до кінця
      // підрощувала стрічку і ховала останній запис під рядком вводу
      body = b.data
        ? `<div class="ch-photo"><img src="${b.data}" alt=""${b.h?` style="height:${Math.min(340,Math.max(80,+b.h||0))}px"`:''}></div>${b.title?`<div class="ch-text ch-cap">${esc(b.title)}</div>`:''}`
        : `<div class="ch-link-card"><span class="ch-lc-ic">🖼️</span><div><b>Фото</b><small>ще не вибрано · відкрити в документі</small></div>${chI('chev')}</div>`;
    } else if(t==='page'||t==='group'){
      const n=(b.children||[]).length;
      body=`<div class="ch-link-card" style="--sc:${t==='page'?'#7c8cff':'#f0b429'}"><span class="ch-lc-ic">${b.emoji||(t==='page'?'📄':'📁')}</span><div><b>${esc(b.title||(t==='page'?'Сторінка':'Папка'))}</b><small>${t==='page'?'сторінка':'папка'}${n?' · '+n+' бл.':''}</small></div>${chI('chev')}</div>`;
    } else if(t==='link'){
      body=`<div class="ch-link-card"><span class="ch-lc-ic">🔗</span><div><b>${esc(b.label||b.title||b.url||'Посилання')}</b><small>${esc(b.url||'')}</small></div>${chI('chev')}</div>`;
    } else {
      body=`<div class="ch-link-card"><span class="ch-lc-ic">${meta.emoji||'🧩'}</span><div><b>${esc(b.title||meta.title||t)}</b><small>${esc(meta.title||t)} · відкрити в документі</small></div>${chI('chev')}</div>`;
    }
    return `<div class="ch-msg${cls}${b.ai?' ai':''}" data-chopen="${it.bk}|${b.id}">${tag}${body}${time}</div>`;
  }
  /* ── AI-чип «Підсумувати тиждень»: той самий aiCall, що аналізує тиждень у щоденнику ── */
  function chAiSync(){
    const wrap=document.getElementById('chAiWrap'), chip=document.getElementById('chAiChip'); if(!wrap||!chip) return;
    let on=false, label='Підсумувати тиждень';
    try{
      on = !!chKey && chTopic!=='media' && (typeof aiAgentOn!=='function' || aiAgentOn());
      if(on){
        const items=chItems().filter(it=>!it.b.ai&&it.b.type!=='divider');
        if(!items.length) on=false;
        else { const weekAgo=Date.now()-7*864e5; if(!items.some(it=>it.at>=weekAgo)) label='Підсумувати папку'; }
      }
    }catch(_){ on=false; }
    wrap.hidden=!on;
    chip.disabled=chAiBusy;
    chip.querySelector('span').textContent = chAiBusy ? 'Думаю…' : label;
    chFitFeed();
  }
  // записи для AI: тиждень поточної теми (в «Усе» — усіх тем); коли за тиждень порожньо — вся папка
  function chAiCollect(){
    const weekAgo=Date.now()-7*864e5;
    const all=chItems().filter(it=>!it.b.ai&&it.b.type!=='divider');
    let scope=all.filter(it=>it.at>=weekAgo), mode='week';
    if(!scope.length){ scope=all; mode='folder'; }
    const lines=[];
    scope.forEach(it=>{
      const b=it.b, t=b.type||'note'; let txt='';
      if(t==='task') txt=(b.done?'[виконано] ':'[не виконано] ')+chTxt(b);
      else if(t==='check') txt=(b.title?b.title+': ':'')+(b.items||[]).filter(x=>x&&(x.text||'').trim()).map(x=>(x.done?'[x] ':'[ ] ')+chPlain(x.text)).join('; ');
      else if(t==='list'||t==='numlist') txt=(b.items||[]).map(x=>x&&chPlain(x.text)).filter(Boolean).join('; ');
      else if(t==='photo') txt='фото'+(b.title?': '+b.title:'');
      else if(t==='page'||t==='group') txt=(t==='page'?'сторінка':'папка')+' «'+(b.title||'')+'»';
      else txt=chTxt(b)||b.title||'';
      txt=String(txt||'').replace(/\s+/g,' ').trim(); if(!txt) return;
      const when=it.at?(chDayLabel(it.at)+' '+chHM(it.at)):'без дати';
      const topic=(it.sp&&it.sp.id!=='main')?(' · '+it.sp.name):'';
      lines.push(when+topic+' — '+txt.slice(0,400));
    });
    // ліміт ~6000 символів: лишаємо найновіші
    const MAX=6000; let body=lines.join('\n');
    if(body.length>MAX){ const keep=[]; let n=0;
      for(let i=lines.length-1;i>=0;i--){ if(n+lines[i].length+1>MAX) break; keep.unshift(lines[i]); n+=lines[i].length+1; }
      body=keep.join('\n'); }
    return {mode, body, n:lines.length};
  }
  function chAiSummarize(){
    if(chAiBusy) return;
    if(typeof aiCall!=='function'){ chToast('⚠️ AI недоступний'); return; }
    const col=chAiCollect();
    if(!col.body){ chToast('Поки нема що підсумовувати'); return; }
    const f=chFolder(); const fname=(f&&f.name)||'папка';
    const isWeek=col.mode==='week';
    const sys='Ти — уважний і чесний помічник, який підсумовує записи людини в її особистій папці «'+fname+'». '
      +'Тобі дають записи '+(isWeek?'за останній тиждень':'з усієї папки')+' (від старіших до новіших): нотатки, завдання з позначкою виконано чи не виконано, підписи фото. '
      +'Напиши 3–5 коротких рядків: що сталось, що лишилось відкритим, і одну конкретну пораду на наступний тиждень — лише з того, що є в записах, без вигаданих фактів і цифр. '
      +'Українською, без вступних фраз, без заголовків і markdown.';
    const targetBk=chTargetBk(); // куди ляже підсумок, якщо натиснуть «У стрічку»
    let result='', done=false, closed=false;
    chAiBusy=true; chAiSync();
    const ov=chSheet(isWeek?'Підсумок тижня':'Підсумок папки',
      `<div class="ch-ai-out" id="chAiOut"><span class="ch-ai-wait">Думаю…</span></div>
       <div class="ch-ai-acts"><button class="ch-ai-btn" data-chai="save" disabled>У стрічку</button><button class="ch-ai-btn ghost" data-chai="close">Закрити</button></div>`,
      (ov,close)=>{
        const out=ov.querySelector('#chAiOut'), save=ov.querySelector('[data-chai="save"]');
        ov.querySelector('[data-chai="close"]').onclick=()=>{ closed=true; close(); };
        ov.addEventListener('click',e=>{ if(e.target===ov) closed=true; });
        save.onclick=()=>{
          if(save.dataset.retry){ closed=true; close(); setTimeout(chAiSummarize,220); return; }
          if(!done||!result) return;
          if(!boards[targetBk]) boards[targetBk]=[];
          boards[targetBk].push({id:chUid(),type:'note',text:result,title:'',ai:true,at:Date.now()});
          saveBoard(); if(boardKey===targetBk) syncBlocks();
          closed=true; close(); renderChFeed(); chScrollBottom(); chHaptic('medium');
        };
        (async()=>{
          try{
            const txt=await aiCall(sys,[{role:'user',content:col.body}],(partial)=>{ if(!closed) out.textContent=partial; });
            result=(txt||'').trim();
            if(!result) throw new Error('порожня відповідь');
            done=true; out.textContent=result; save.disabled=false;
          }catch(e){
            out.innerHTML='<span class="ch-ai-err">Не вдалося: '+esc((e&&e.message)||'спробуй пізніше')+'</span>';
            save.disabled=false; save.textContent='Ще раз'; save.dataset.retry='1';
          }finally{ chAiBusy=false; chAiSync(); }
        })();
      });
  }
  function chBindFeed(host){
    host.querySelectorAll('[data-chtodo]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const [bk,id,iid]=el.dataset.chtodo.split('|');
      const b=(boards[bk]||[]).find(x=>x&&String(x.id)===id); if(!b) return;
      if(iid){ const it=(b.items||[]).find(x=>x&&String(x.id)===iid); if(!it) return; it.done=!it.done; }
      else b.done=!b.done;
      saveBoard(); chHaptic('light');
      const top=document.body.scrollTop; renderChFeed(); document.body.scrollTop=top;
    });
    host.querySelectorAll('[data-chopen]').forEach(el=>el.onclick=(e)=>{
      if(e.target.closest('[data-chtodo]')) return;
      const [bk,id]=el.dataset.chopen.split('|'); chOpenInDoc(bk,id);
    });
  }
  // документ на цьому блоці; «‹ Папки» в документі повертає в Канал, не на Огляд
  function chOpenInDoc(bk,id){
    const key=chKey;
    if(!boards[bk]) boards[bk]=[];
    try{ const sid = bk===key ? 'main' : (String(bk).split('__sp_')[1]||'main'); activeSpaceMap[key]=sid; saveSpacesMeta(); }catch(_){}
    goSpaceFor(bk, id?{focusId:id}:null);
    window.__flowExitPage=function(){ goChannel(key); };
  }

  /* ── рядок вводу ── */
  function chInitComposer(){
    const comp=document.getElementById('chComposer'); if(!comp||comp.__init) return; comp.__init=true;
    comp.innerHTML=`
      <div class="ch-tray" id="chTray" hidden>
        <button data-chtray="photo"><i>${chI('image')}</i><span>Фото</span></button>
        <button data-chtray="task"><i>${chI('task')}</i><span>Завдання</span></button>
        <button data-chtray="voice"><i>${chI('mic')}</i><span>Голос</span></button>
        <button data-chtray="topic"><i>${chI('page')}</i><span>Тема</span></button>
      </div>
      <div class="ch-aiwrap" id="chAiWrap" hidden>
        <button class="ch-aichip" id="chAiChip">${chI('spark')}<span>Підсумувати тиждень</span></button>
      </div>
      <div class="ch-row">
        <button class="ch-plus" id="chPlus" aria-label="Додати">${chI('plus')}</button>
        <div class="ch-field">
          <button class="ch-modechip" id="chModeChip" hidden title="Скасувати">${chI('task')}<span>Завдання</span></button>
          <textarea class="ch-input" id="chInput" rows="1" placeholder="Написати…" enterkeyhint="send"></textarea>
          <button class="ch-mic" id="chMic" aria-label="Диктувати">${chI('mic')}</button>
          <button class="ch-send" id="chSend" aria-label="Надіслати" hidden>${chI('send')}</button>
        </div>
      </div>`;
    const inp=comp.querySelector('#chInput');
    inp.addEventListener('input',()=>{ chAutoGrow(); chSyncSend(); });
    inp.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); chSend(); } });
    inp.addEventListener('focus',()=>chToggleTray(false));
    comp.querySelector('#chSend').onclick=chSend;
    comp.querySelector('#chMic').onclick=chVoice;
    comp.querySelector('#chPlus').onclick=()=>chToggleTray();
    comp.querySelector('#chModeChip').onclick=()=>{ chSetMode('note'); inp.focus(); };
    comp.querySelector('#chAiChip').onclick=chAiSummarize;
    // рядок вводу росте (чип, лоток, кілька рядків тексту) — стрічка отримує стільки ж місця знизу
    try{ if(window.ResizeObserver) new ResizeObserver(chFitFeed).observe(comp); }catch(_){}
    comp.querySelectorAll('[data-chtray]').forEach(b=>b.onclick=()=>{
      const a=b.dataset.chtray; chToggleTray(false);
      if(a==='photo') chPickFile(f=>chShrink(f,1100,1100,data=>chPushBlock({id:chUid(),type:'photo',title:'',data,at:Date.now()})));
      else if(a==='task'){ chSetMode('task'); inp.focus(); }
      else if(a==='voice') chVoice();
      else if(a==='topic') chAddTopic();
    });
    // клавіатура: composer тримається над нею (iOS не зсуває fixed-елементи сам)
    const vv=window.visualViewport;
    if(vv){ const sync=()=>{ if(!document.getElementById('scr-channel').classList.contains('active')){ comp.style.bottom=''; return; }
        const kb=Math.max(0, window.innerHeight - vv.height - vv.offsetTop); comp.style.bottom = kb>120 ? kb+'px' : ''; };
      vv.addEventListener('resize',sync); vv.addEventListener('scroll',sync); }
  }
  function chAutoGrow(){ const inp=document.getElementById('chInput'); if(!inp) return; inp.style.height='auto'; inp.style.height=Math.min(140,inp.scrollHeight)+'px'; }
  function chSyncSend(){
    const inp=document.getElementById('chInput'); if(!inp) return;
    const has=!!inp.value.trim();
    document.getElementById('chSend').hidden=!has;
    document.getElementById('chMic').hidden=has;
  }
  function chSetMode(m){
    chMode=m;
    const chip=document.getElementById('chModeChip'), inp=document.getElementById('chInput');
    if(chip) chip.hidden=(m!=='task');
    if(inp) inp.placeholder = m==='task' ? 'Завдання…' : 'Написати…';
  }
  function chToggleTray(force){
    const tr=document.getElementById('chTray'), pl=document.getElementById('chPlus'); if(!tr) return;
    const open = force!=null ? !!force : tr.hidden;
    tr.hidden=!open; if(pl) pl.classList.toggle('on',open);
    chFitFeed();
  }
  function chPushBlock(b){
    const bk=chTargetBk(); if(!boards[bk]) boards[bk]=[];
    boards[bk].push(b); saveBoard();
    if(boardKey===bk) syncBlocks();
    if(chTopic==='media'&&b.type!=='photo'){ chTopic='all'; renderChChips(); }
    renderChFeed(); chScrollBottom(true); chHaptic('light');
  }
  function chSend(){
    const inp=document.getElementById('chInput'); if(!inp) return;
    const raw=(inp.value||'').replace(/\s+$/,'');
    if(!raw.trim()) return;
    let text=raw, type=chMode;
    const m=/^\s*(\[\s?\]|-\s\[\s?\])\s+/.exec(raw); if(m){ type='task'; text=raw.slice(m[0].length); }
    const b = type==='task'
      ? {id:chUid(),type:'task',text:text.trim(),title:'Завдання',done:false,due:'',prio:'none',at:Date.now()}
      : {id:chUid(),type:'note',text:text.trim(),title:'',at:Date.now()};
    inp.value=''; chAutoGrow(); chSetMode('note'); chSyncSend();
    chPushBlock(b);
    try{ inp.focus(); }catch(_){}
  }
  function chPickFile(cb){
    const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
    inp.onchange=()=>{ const f=inp.files&&inp.files[0]; if(f) cb(f); };
    inp.click();
  }
  // стискаємо як редактор: канвас → JPEG 0.72
  function chShrink(file,maxW,maxH,cb){
    const rd=new FileReader();
    rd.onload=()=>{ const img=new Image();
      img.onload=()=>{ let w=img.width,h=img.height; const r=Math.min(1,maxW/w,maxH/h); w=Math.round(w*r); h=Math.round(h*r);
        const cv=document.createElement('canvas'); cv.width=w; cv.height=h; cv.getContext('2d').drawImage(img,0,0,w,h);
        cb(cv.toDataURL('image/jpeg',0.72)); };
      img.onerror=()=>chToast('⚠️ Не вдалося прочитати фото');
      img.src=rd.result; };
    rd.readAsDataURL(file);
  }
  /* диктування: запис у браузері, розпізнавання — спільна window.__flowTranscribe */
  async function chVoice(){
    const comp=document.getElementById('chComposer');
    if(chRec){ try{ chRec.stop(); }catch(_){} return; }
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){ chToast('⚠️ Мікрофон недоступний'); return; }
    try{
      chStream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mime=MediaRecorder.isTypeSupported('audio/mp4')?'audio/mp4':(MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'');
      chRec=new MediaRecorder(chStream,mime?{mimeType:mime}:undefined);
      const parts=[];
      chRec.ondataavailable=ev=>{ if(ev.data&&ev.data.size) parts.push(ev.data); };
      chRec.onstop=async()=>{
        try{ chStream.getTracks().forEach(x=>x.stop()); }catch(_){}
        const blob=new Blob(parts,{type:mime||'audio/mp4'});
        chRec=null; chStream=null; comp.classList.remove('live');
        if(blob.size<1200){ chToast('🎙 Закоротко'); return; }
        const tr=window.__flowTranscribe;
        if(typeof tr!=='function'){ chToast('⚠️ Розпізнавання недоступне'); return; }
        chToast('🎙 Розпізнаю…');
        let txt=''; try{ txt=await tr(blob); }catch(_){ txt=''; }
        if(!txt){ chToast('⚠️ Не розчув'); return; }
        const inp=document.getElementById('chInput');
        inp.value=(inp.value?inp.value.replace(/\s+$/,'')+' ':'')+txt;
        chAutoGrow(); chSyncSend(); try{ inp.focus(); }catch(_){}
      };
      chRec.start(); comp.classList.add('live');
      chToast('🎙 Говори — тапни ще раз, щоб зупинити');
    }catch(err){ chRec=null; chStream=null; chToast('⚠️ Мікрофон недоступний'); }
  }
  document.addEventListener('visibilitychange',()=>{ if(document.hidden&&chRec){ try{ chRec.stop(); }catch(_){} } });

  /* ── шторка (проста, своя) ── */
  function chSheet(title, rowsHtml, bind){
    document.querySelectorAll('.ch-sheet-ov').forEach(x=>x.remove());
    const ov=document.createElement('div'); ov.className='ch-sheet-ov';
    const f=chFolder();
    ov.innerHTML=`<div class="ch-sheet" style="--fc:${(f&&f.c)||'var(--accent)'}"><div class="ch-grip"></div>${title?`<div class="ch-sheet-t">${title}</div>`:''}${rowsHtml}</div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    ov.addEventListener('click',e=>{ if(e.target===ov) close(); });
    bind(ov,close);
    return ov;
  }

  chInitComposer();
  try{ window.goChannel=goChannel; }catch(_){}
