  /* ============ WISHES / Карта бажань ============ */
  // мінімалістичні лінійні SVG-іконки (stroke=currentColor)
  const WICONS={
    play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>',
    image:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6" fill="currentColor" stroke="none"/><path d="M21 15l-5-5L5 21"/></svg>',
    edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    resize:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>',
    up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>',
    down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>',
    trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
    photo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    crop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>',
    refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/></svg>'
  };
  function icoHtml(name){ return WICONS[name] || (name||'') ; }

  // універсальне нижнє меню дій (працює там, де confirm/alert заблоковані, напр. у WebView)
  function actionSheet(opts){
    const o=opts||{}; const items=o.items||[];
    const ov=document.createElement('div'); ov.className='asheet';
    const rowCls = o.row ? 'asheet-row' : '';
    const itemsHtml=items.map((it,i)=>`
      <button class="asheet-item ${it.danger?'danger':''} ${it.primary?'primary':''}" data-ai="${i}">
        <span class="ic">${icoHtml(it.ic||it.icon)}</span>
        <span class="tx"><span class="lab2">${esc(it.label||'')}</span>${it.sub?`<span class="sub2">${esc(it.sub)}</span>`:''}</span>
      </button>`).join('');
    ov.innerHTML=`<div class="asheet-in">
      <div class="asheet-grip"></div>
      ${o.title?`<div class="asheet-title">${esc(o.title)}</div>`:''}
      ${o.sub?`<div class="asheet-sub">${esc(o.sub)}</div>`:''}
      <div class="${rowCls}">${itemsHtml}</div>
      <button class="asheet-cancel">${esc(o.cancel||'Скасувати')}</button>
    </div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    ov.onclick=e=>{ if(e.target===ov) close(); };
    ov.querySelector('.asheet-cancel').onclick=close;
    ov.querySelectorAll('[data-ai]').forEach(b=>b.onclick=()=>{
      const it=items[+b.dataset.ai]; close(); if(it&&it.onClick) it.onClick();
    });
  }
  function confirmSheet(opts){
    const o=opts||{};
    actionSheet({
      title:o.title||'Підтвердити дію',
      sub:o.sub||'',
      items:[{ic:o.ic||'trash', label:o.okLabel||'Видалити', danger:true, onClick:o.onOk||(()=>{})}],
      cancel:o.cancelLabel||'Скасувати'
    });
  }

  // проста заміна нативного alert (ламається в деяких WebView)
  function flowAlert(msg, title){
    actionSheet({
      title:title||'Повідомлення',
      sub:String(msg==null?'':msg),
      items:[],
      cancel:'Зрозуміло'
    });
  }

  const WISH_KEY='wishes_board';
  const WISH_ACT_KEY='wish_active_days_v1';
  let wishes=[]; // [{id, img, cap, size:'tall'|'wide'|'sq'}]
  let wishActiveDays={}; // {'YYYY-MM-DD': true} — дні, коли щось мінялось у Карті бажань
  try{ if(Array.isArray(window.FLOW_KEYS)&&window.FLOW_KEYS.indexOf(WISH_ACT_KEY)<0) window.FLOW_KEYS.push(WISH_ACT_KEY); }catch(_){}
  async function loadWishes(){
    try{ const r=await window.storage.get(WISH_KEY,false); if(r&&r.value){ const d=JSON.parse(r.value); if(Array.isArray(d)) wishes=d; } }catch(_){}
    try{ const r2=await window.storage.get(WISH_ACT_KEY,false); if(r2&&r2.value){ const d2=JSON.parse(r2.value); if(d2&&typeof d2==='object') wishActiveDays=d2; } }catch(_){}
    try{ await migrateWishPhotosOnce(); }catch(e){ console.error('migrateWishPhotos', e); }
  }
  /* Переїзд знімків Карти бажань у PhotoDB. Тут вони найважчі: до шести
     кадрів по 1400px, і всі лежали одним рядком у wishes_board — тобто
     будь-яка зміна підпису переписувала мегабайти. Формат посилання той
     самий, що й у папок: `idb:wi_<id>` для фото, `idb:wt_<id>` для
     обкладинки відео. Якщо IndexedDB нема — нічого не стається. */
  async function migrateWishPhotosOnce(){
    if(!window.PhotoDB || !window.PhotoDB.available()) return;
    const isData=v=>!!v && String(v).slice(0,5)==='data:';
    const todo=wishes.filter(w=>isData(w.img)||isData(w.thumb));
    if(!todo.length) return;
    for(const w of todo){
      if(isData(w.img)){ const ref=await window.photoPut('wi_'+w.id, w.img);
        if(String(ref).slice(0,4)==='idb:') w.img=ref; }
      if(isData(w.thumb)){ const ref=await window.photoPut('wt_'+w.id, w.thumb);
        if(String(ref).slice(0,4)==='idb:') w.thumb=ref; }
    }
    saveWishes();
    try{ renderWishes(); }catch(_){}
    try{ updateSummaryBg(); }catch(_){}
    console.log('[Flow] знімків Карти бажань перенесено:', todo.length);
  }
  function saveWishActiveDays(){ try{ const p=window.storage.set(WISH_ACT_KEY,JSON.stringify(wishActiveDays),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function saveWishes(){
    try{ const p=window.storage.set(WISH_KEY,JSON.stringify(wishes),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
    try{
      const d=new Date(), ds=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      if(!wishActiveDays[ds]){ wishActiveDays[ds]=true; saveWishActiveDays(); }
    }catch(_){}
    try{ if(typeof renderHeroStreak==='function') renderHeroStreak(); }catch(_){}
  }

  // ── Живе скло: перемикач нового вигляду головного екрана (Налаштування) ──
  const HOMEGLASS_KEY='home_glass_on';
  let homeGlass=false;
  try{ if(Array.isArray(window.FLOW_KEYS)&&window.FLOW_KEYS.indexOf(HOMEGLASS_KEY)<0) window.FLOW_KEYS.push(HOMEGLASS_KEY); }catch(_){}
  async function loadHomeGlass(){ try{ const r=await window.storage.get(HOMEGLASS_KEY,false); homeGlass = !!(r && r.value==='1'); }catch(_){} }
  function saveHomeGlass(){ try{ const p=window.storage.set(HOMEGLASS_KEY, homeGlass?'1':'0', false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function applyHomeGlass(){ try{ document.documentElement.classList.toggle('home-glass', !!homeGlass); }catch(_){} }

  // ── Ціна мрії: одноразова обіцянка (завжди видна вгорі Карти бажань, редагується будь-коли) ──
  const WPRICE_KEY='wish_price';
  let wishPrice='';
  try{ if(Array.isArray(window.FLOW_KEYS)&&window.FLOW_KEYS.indexOf(WPRICE_KEY)<0) window.FLOW_KEYS.push(WPRICE_KEY); }catch(_){}
  async function loadWishPrice(){ try{ const r=await window.storage.get(WPRICE_KEY,false); if(r&&typeof r.value==='string') wishPrice=r.value; }catch(_){} }
  function saveWishPrice(){ try{ const p=window.storage.set(WPRICE_KEY,wishPrice,false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function wishPriceHTML(){
    return `<div class="wprice ${wishPrice?'':'empty'}" id="wpriceCard">
      <div class="wp-ic">💎</div>
      <span class="tx"><b>Ціна мрії</b><small>${wishPrice?esc(wishPrice):'Яку ціну ти готовий(а) заплатити? Не курити, менше телефону…'}</small></span>
      <span class="wp-edit">✎</span>
    </div>`;
  }
  function bindWishPrice(body){
    const el=(body||document).querySelector('#wpriceCard'); if(!el) return;
    el.onclick=()=>{
      inputModal({title:'Ціна мрії', value:wishPrice||'', placeholder:'Напр. не курити, менше сидіти в телефоні…',
        onOk:(v)=>{ wishPrice=(v||'').trim(); saveWishPrice(); renderWishes(); }});
    };
  }

  // слайдшоу з фото Карти бажань на блоці «Загальний прогрес»
  const WISH_SLIDE_MS=5000;          // скільки показується одне фото
  let wishSlideTimer=null, wishSlideIdx=0;
  function updateSummaryBg(){
    try{ renderHeroStreak(); }catch(_){}
    const card=document.getElementById('summaryCard');
    const slides=document.getElementById('wishSlides');
    const ov=document.getElementById('wishBgOv');
    const dots=document.getElementById('wishDots');
    const topBar=document.querySelector('#scr-home .top');
    if(!card||!slides||!ov||!dots) return;
    if(wishSlideTimer){ clearInterval(wishSlideTimer); wishSlideTimer=null; }

    // у тло беремо лише те, що має картинку (фото або відео з прев'ю)
    const withImg=wishes.filter(w=> (w.type==='video') ? !!w.thumb : !!w.img );
    if(!withImg.length){
      slides.style.display='none'; ov.style.display='none';
      slides.innerHTML=''; dots.innerHTML=''; dots.classList.remove('on');
      card.classList.remove('has-wish');
      if(topBar) topBar.classList.add('top-photobleed');
      const fl0=document.getElementById('wishFlink');
      if(fl0) fl0.textContent='＋';
      return;
    }
    card.classList.add('has-wish');
    if(topBar) topBar.classList.add('top-photobleed');
    const fl1=document.getElementById('wishFlink');
    if(fl1) fl1.textContent='🎯';
    slides.style.display='block'; ov.style.display='block';
    // разом із картинкою несемо збережений кадр (w.pos) — той самий формат
    // {x,y,scale}, що й photoPos у папок
    const shown=withImg.slice(-6);
    const imgs=shown.map(w=> ({ src:(w.type==='video'?w.thumb:w.img), pos:w.pos||null }) );
    slides.innerHTML=imgs.map((it,i)=>{
      const xf=it.pos?`transform:translate(${it.pos.x}%,${it.pos.y}%) scale(${it.pos.scale});`:'';
      return `<div class="wishslide ${i===0?'on':''}" style="background-image:url('${safeImg(it.src)}');${xf}"></div>`;
    }).join('');
    if(imgs.length>1){
      /* Смужка як у сторіз: сегмент поточного фото наливається білим,
         пройдені лишаються повними, наступні — порожні. Тривалість
         віддаємо в CSS однією змінною, щоб анімація і таймер не розійшлися. */
      dots.style.setProperty('--wish-dur', WISH_SLIDE_MS+'ms');
      dots.innerHTML=imgs.map(()=>'<i><b></b></i>').join('');
      dots.classList.add('on');
      const slideEls=slides.querySelectorAll('.wishslide');
      const dotEls=dots.querySelectorAll('i');
      wishSlideIdx=0;
      dotEls[0].classList.add('now');
      wishSlideTimer=setInterval(()=>{
        slideEls[wishSlideIdx].classList.remove('on');
        dotEls[wishSlideIdx].classList.remove('now');
        dotEls[wishSlideIdx].classList.add('done');
        const wrapped = wishSlideIdx === slideEls.length-1;
        wishSlideIdx=(wishSlideIdx+1)%slideEls.length;
        // новий круг — гасимо всі пройдені, щоб смужка почалася з нуля
        if(wrapped) dotEls.forEach(d=>d.classList.remove('done'));
        slideEls[wishSlideIdx].classList.add('on');
        const cur=dotEls[wishSlideIdx];
        // перезапуск анімації: без цього сегмент на другому колі лишиться порожнім
        const fill=cur.querySelector('b');
        if(fill){ fill.style.animation='none'; void fill.offsetWidth; fill.style.animation=''; }
        cur.classList.add('now');
      },WISH_SLIDE_MS);
    }else{
      dots.innerHTML=''; dots.classList.remove('on');
    }
  }

  // стискаємо фото перед збереженням (макс ~900px, jpeg) — щоб влізало у сховище
  function compressImage(file, cb){
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        // 1400px / 0.82 замість 900 / 0.72 (30.08.2026): на Retina 900px
        // розтягувалось удвічі й давало «мило». Файл більшає приблизно втричі.
        const max=1400; let{width:w,height:h}=img;
        if(w>h && w>max){ h=Math.round(h*max/w); w=max; }
        else if(h>=w && h>max){ w=Math.round(w*max/h); h=max; }
        const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
        cv.getContext('2d').drawImage(img,0,0,w,h);
        try{ cb(cv.toDataURL('image/jpeg',0.82)); }
        catch(_){ cb(reader.result); }
      };
      img.onerror=()=>cb(reader.result);
      img.src=reader.result;
    };
    reader.readAsDataURL(file);
  }

  function pickWishPhoto(){
    const inp=document.createElement('input');
    inp.type='file'; inp.accept='image/*'; inp.multiple=true; inp.style.display='none';
    document.body.appendChild(inp);
    inp.onchange=()=>{
      const files=Array.from(inp.files||[]); inp.remove();
      if(!files.length) return;
      const sizes=['tall','sq','sq','wide','sq'];
      let done=0, firstNewId=null;
      files.forEach((f,fi)=>{
        compressImage(f,(dataUrl)=>{
          const id='w'+Date.now()+'_'+fi;
          if(firstNewId===null) firstNewId=id;
          const size=sizes[(wishes.length)%sizes.length];
          const w={id,img:dataUrl,cap:'',size};
          wishes.push(w);
          // важке — в IndexedDB, у wishes_board лишиться посилання
          Promise.resolve(window.photoPut('wi_'+id, dataUrl)).then(ref=>{ w.img=ref; saveWishes(); });
          done++;
          if(done===files.length){
            saveWishes(); renderWishes();
            // якщо додали одне фото — одразу спитати підпис
            if(files.length===1 && firstNewId) setTimeout(()=>askWishCap(firstNewId),150);
          }
        });
      });
    };
    inp.click();
  }
  const WISH_SIZES=['sq','tall','wide'];
  const WISH_SIZE_LABEL={sq:'Квадрат',tall:'Висока',wide:'Широка'};
  function cycleWishSize(id){
    const w=wishes.find(x=>x.id===id); if(!w) return;
    const cur=WISH_SIZES.indexOf(w.size==='tall'?'tall':(w.size==='wide'?'wide':'sq'));
    w.size=WISH_SIZES[(cur+1)%WISH_SIZES.length];
    saveWishes(); renderWishes();
  }
  function askWishCap(id){
    const w=wishes.find(x=>x.id===id); if(!w) return;
    inputModal({title:'Підпис до образу', value:w.cap||'', placeholder:'Напр. Свій дім, Свобода…',
      onOk:(v)=>{ w.cap=v; saveWishes(); renderWishes(); }});
  }
  // ── Картка деталей бажання (опис, дата-ціль, кроки, фото-доказ) ──
  function openWishCard(id){
    const w=wishes.find(x=>x.id===id); if(!w) return;
    const cover = w.type==='video' ? (w.thumb||'') : (w.img||'');
    const linkedGoal = w.goalId ? (goalsData.goals||[]).find(x=>x.id===w.goalId) : null;
    // кроки: якщо є зв'язана ціль — її steps; інакше власні wishSteps
    if(!Array.isArray(w.wishSteps)) w.wishSteps=[];
    const steps = linkedGoal ? (linkedGoal.steps||[]) : w.wishSteps;
    const sd = steps.filter(s=>s.done).length;
    const pct = steps.length ? Math.round(sd/steps.length*100) : (linkedGoal?(linkedGoal.progress||0):0);
    const done = pct>=100;

    const stepsHtml = steps.length ? steps.map(s=>`
      <div class="wc-li ${s.done?'done':''}" data-wcstep="${s.id}">
        <span class="wc-ck">${s.done?'✓':''}</span><span class="wc-tx">${esc(s.name)}</span>
        ${!linkedGoal?`<span class="wc-del" data-wcdel="${s.id}">×</span>`:''}
      </div>`).join('') : `<div class="wc-empty">Кроків ще нема${linkedGoal?'':' — додай нижче'}</div>`;

    const proofHtml = w.proofImg
      ? `<div class="wc-proof done" data-wcproof="1"><img class="wc-pimg" src="${safeImg(w.proofImg)}"><div><div class="wc-pt">✅ Мрія стала реальністю</div><div class="wc-ps">Тап щоб змінити фото</div></div></div>`
      : `<div class="wc-proof" data-wcproof="1"><div class="wc-pimg ph"></div><div><div class="wc-pt">Замінити мрію на реальність</div><div class="wc-ps">Завантаж своє фото, коли досягнеш</div></div></div>`;

    const ov=document.createElement('div'); ov.className='wcard';
    ov.innerHTML=`<div class="wcard-in">
      <div class="wcard-hero" style="background-image:url('${safeImg(cover)}')">
        <button class="wcard-x" data-wcx="1">✕</button>
        <span class="wcard-badge ${done?'done':''}">${done?'✓ Досягнуто':(linkedGoal?'🎯 Ціль':'✨ Образ')}</span>
        <div class="wcard-cap">${esc(w.cap||'Образ майбутнього')}</div>
      </div>
      <div class="wcard-body">
        <div class="wcard-stats">
          <div class="wcard-stat" data-wcdate="1"><div class="k">Дата-ціль</div><div class="v">${w.targetDate?esc(w.targetDate):'— тап —'}</div></div>
          <div class="wcard-stat"><div class="k">Прогрес</div><div class="v g">${pct}%</div></div>
        </div>
        <div class="wcard-field">
          <div class="wcard-fl">📝 Чому я цього хочу</div>
          <div class="wcard-desc ${w.desc?'':'empty'}" data-wcdesc="1">${w.desc?esc(w.desc):'Тап, щоб описати — навіщо тобі це…'}</div>
        </div>
        <div class="wcard-field">
          <div class="wcard-fl">✅ Кроки до мрії${linkedGoal?' <span class="wcard-link">· з цілі</span>':''}</div>
          <div class="wcard-list">${stepsHtml}</div>
          ${!linkedGoal?`<button class="wcard-addstep" data-wcaddstep="1">＋ Крок</button>`:''}
        </div>
        <div class="wcard-field">
          <div class="wcard-fl">📸 Фото-доказ</div>
          ${proofHtml}
        </div>
        ${!linkedGoal?`<button class="wcard-cta" data-wcmakegoal="1">🎯 Зробити повноцінною ціллю</button>`:`<button class="wcard-cta ghost" data-wcopengoal="1">Відкрити в Цілях →</button>`}
      </div>
    </div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    const rerender=()=>{ close(); openWishCard(id); };
    ov.onclick=e=>{ if(e.target===ov) close(); };
    ov.querySelector('[data-wcx]').onclick=close;
    // опис
    ov.querySelector('[data-wcdesc]').onclick=()=>inputModal({title:'Чому я цього хочу', value:w.desc||'', placeholder:'Що це для тебе значить…', onOk:(v)=>{ w.desc=v; saveWishes(); rerender(); }});
    // дата-ціль
    ov.querySelector('[data-wcdate]').onclick=()=>inputModal({title:'Дата-ціль', value:w.targetDate||'', placeholder:'Напр. Літо 2027', onOk:(v)=>{ w.targetDate=v; saveWishes(); rerender(); }});
    // кроки (тільки якщо власні, без зв'язаної цілі)
    if(!linkedGoal){
      ov.querySelectorAll('[data-wcstep]').forEach(el=>el.onclick=(e)=>{
        if(e.target.classList.contains('wc-del')) return;
        const sid=el.dataset.wcstep; const st=w.wishSteps.find(s=>s.id===sid); if(st){ st.done=!st.done; saveWishes(); rerender(); }
      });
      ov.querySelectorAll('[data-wcdel]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); w.wishSteps=w.wishSteps.filter(s=>s.id!==el.dataset.wcdel); saveWishes(); rerender(); });
      const addb=ov.querySelector('[data-wcaddstep]');
      if(addb) addb.onclick=()=>inputModal({title:'Новий крок', placeholder:'Що наблизить до мрії…', onOk:(v)=>{ if((v||'').trim()){ w.wishSteps.push({id:'ws'+Date.now(),name:v.trim(),done:false}); saveWishes(); rerender(); } }});
    }
    // фото-доказ
    ov.querySelector('[data-wcproof]').onclick=()=>pickProofPhoto(id, rerender);
    // зробити ціллю / відкрити ціль
    const mg=ov.querySelector('[data-wcmakegoal]'); if(mg) mg.onclick=()=>{ close(); wishToGoal(id); };
    const og=ov.querySelector('[data-wcopengoal]'); if(og) og.onclick=()=>{ close(); goalsData.tab='goals'; saveGoals(); goGoals(); };
  }
  function pickProofPhoto(id, cb){
    const w=wishes.find(x=>x.id===id); if(!w) return;
    const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
    inp.onchange=()=>{ const f=(inp.files||[])[0]; inp.remove(); if(!f) return;
      compressImage(f,(dataUrl)=>{ w.proofImg=dataUrl; saveWishes(); if(cb)cb(); }); };
    inp.click();
  }
  function delWish(id){
    const w=wishes.find(x=>x.id===id);
    confirmSheet({
      title:'Прибрати з карти?',
      sub:w&&w.cap?('«'+w.cap+'» зникне з Карти бажань.'):'Цей образ зникне з Карти бажань.',
      okLabel:'Прибрати',
      onOk:()=>{
        // знімок цього образу більше нікому не потрібен
        try{ if(w){ window.photoDel(w.img); window.photoDel(w.thumb); } }catch(_){}
        wishes=wishes.filter(x=>x.id!==id); saveWishes(); renderWishes(); }
    });
  }

  // розпізнаємо відео-посилання → {url, thumb, app, kind}
  // app — посилання, яке iOS/Android краще відкриває в самому застосунку
  function parseVideo(url){
    if(!url) return null;
    const u=url.trim();
    // YouTube
    let m=u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
    if(m) return {url:u, thumb:`https://i.ytimg.com/vi/${m[1]}/mqdefault.jpg`, kind:'youtube'};
    // Vimeo
    if(/vimeo\.com\/\d+/.test(u)) return {url:u, thumb:'', kind:'vimeo'};
    // Instagram (Reel/Post) → схема instagram:// відкриває застосунок
    m=u.match(/instagram\.com\/(?:reel|reels|p|tv)\/([\w-]+)/);
    if(m) return {url:u, thumb:'', kind:'instagram'};
    if(/instagram\.com/.test(u)) return {url:u, thumb:'', kind:'instagram'};
    // TikTok
    if(/tiktok\.com/.test(u)) return {url:u, thumb:'', kind:'tiktok'};
    if(/fb\.watch|facebook\.com/.test(u)) return {url:u, thumb:'', kind:'social'};
    if(/^https?:\/\//.test(u)) return {url:u, thumb:'', kind:'link'};
    return null;
  }
  function addWishVideo(){
    inputModal({title:'Відео за посиланням', placeholder:'Встав лінк (YouTube, Reels, TikTok…)',
      onOk:(v)=>{
        const info=parseVideo(v);
        if(!info){ actionSheet({title:'Не схоже на посилання',sub:'Встав повний лінк, що починається з https://',items:[]}); return; }
        const id='v'+Date.now();
        wishes.push({id, type:'video', url:info.url, thumb:info.thumb||'', vkind:info.kind, cap:'', size:'wide'});
        saveWishes(); renderWishes();
        if(!info.thumb){
          setTimeout(()=>{
            actionSheet({
              title:'Поставити обкладинку?',
              sub:'Це відео не дає прев\u2019ю-кадр. Обери фото з галереї, щоб плитка не була чорною.',
              items:[
                {ic:'image', label:'Обрати обкладинку', primary:true, onClick:()=>setWishCover(id)},
                {ic:'edit', label:'Лишити без обкладинки', onClick:()=>askWishCap(id)}
              ]
            });
          },220);
        }else{
          setTimeout(()=>askWishCap(id),150);
        }
      }});
  }
  // поставити/змінити обкладинку відео-плитки фото з галереї
  function setWishCover(id){
    const w=wishes.find(x=>x.id===id); if(!w) return;
    const inp=document.createElement('input');
    inp.type='file'; inp.accept='image/*'; inp.style.display='none';
    document.body.appendChild(inp);
    inp.onchange=()=>{
      const f=inp.files&&inp.files[0]; inp.remove();
      if(!f){ askWishCap(id); return; }
      compressImage(f,(dataUrl)=>{
        const prev=w.thumb; w.thumb=dataUrl; renderWishes();
        Promise.resolve(window.photoPut('wt_'+w.id, dataUrl)).then(ref=>{
          w.thumb=ref; if(prev&&prev!==ref) window.photoDel(prev); saveWishes(); });
      });
    };
    inp.click();
  }
  // відкрити відео — пробуємо застосунок, інакше браузер
  function openWishVideo(w){
    if(!w||!w.url) return;
    const u=w.url;
    // намагаємось відкрити напряму (iOS universal links самі перехоплять застосунок, якщо він є)
    try{ window.open(u,'_blank'); }
    catch(_){ try{ location.href=u; }catch(__){} }
  }

  // меню дій для плитки карти бажань
  function openWishMenu(id){
    const w=wishes.find(x=>x.id===id); if(!w) return;
    const isVid=w.type==='video';
    const idx=wishes.findIndex(x=>x.id===id);
    const szNow=w.size==='tall'?'Висока':(w.size==='wide'?'Широка':'Квадрат');
    const items=[];
    if(isVid){
      items.push({ic:'play', label:'Відкрити відео', sub:w.url, primary:true, onClick:()=>openWishVideo(w)});
      items.push({ic:'image', label:w.thumb?'Змінити обкладинку':'Додати обкладинку', sub:'Фото з галереї', onClick:()=>setWishCover(id)});
    }
    items.push({ic:'edit', label:'Підпис', sub:w.cap||'без підпису', onClick:()=>askWishCap(id)});
    items.push({ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v3.5M16 3v3.5"/></svg>', label:'Дата', sub:w.targetDate||'без дати', onClick:()=>inputModal({title:'Дата образу', value:w.targetDate||'', placeholder:'Напр. січ 2027, 09.2026 або 2029', onOk:v=>{ w.targetDate=(v||'').trim(); saveWishes(); renderWishes(); }})});
    if(w.goalId && (goalsData.goals||[]).some(g=>g.id===w.goalId)){
      items.push({ic:'🎯', label:'Відкрити ціль', sub:'Це бажання вже ціль', primary:true, onClick:()=>{ goalsData.tab='goals'; saveGoals(); show('scr-goals'); try{renderGoals();}catch(_){} }});
    } else {
      items.push({ic:'🎯', label:'Зробити ціллю', sub:'Додати в Цілі з цим фото', primary:true, onClick:()=>wishToGoal(id)});
    }
    items.push({ic:'resize', label:'Розмір плитки', sub:'Зараз: '+szNow+' · тап щоб змінити', onClick:()=>cycleWishSize(id)});
    /* Кадрування для банера Огляду. Знімок там лежить у широкій картці, тож
       вертикальне фото обрізається по центру — часто не там, де треба.
       Редактор той самий, що й для фото папки (openPhotoCropEditor). */
    { const src = (w.type==='video') ? w.thumb : w.img;
      if(src) items.push({ic:'image', label:'Кадрувати для Огляду',
        sub: w.pos ? 'Кадр підібрано · тап щоб змінити' : 'Обрати видиму частину',
        onClick:()=>{
          if(typeof openPhotoCropEditor!=='function'){ flowAlert('Редактор кадру недоступний.'); return; }
          openPhotoCropEditor({ img:src, pos:w.pos||null, title:'Кадр для Огляду',
            onSave:(pos)=>{ w.pos=pos; saveWishes(); try{renderWishes();}catch(_){}
              // тло банера малює updateSummaryBg(), не renderWishBg — назва
              // інша, і без цього виклику кадр застосувався б лише після
              // перезавантаження екрана
              try{ updateSummaryBg(); }catch(_){} } });
        }});
    }
    if(idx>0) items.push({ic:'up', label:'Перемістити вперед', onClick:()=>moveWish(id,-1)});
    if(idx<wishes.length-1) items.push({ic:'down', label:'Перемістити назад', onClick:()=>moveWish(id,1)});
    items.push({ic:'trash', label:'Прибрати з карти', danger:true, onClick:()=>delWish(id)});
    actionSheet({ title:w.cap||(isVid?'Відео':'Образ'), items });
  }
  function moveWish(id,dir){
    const i=wishes.findIndex(x=>x.id===id); if(i<0) return;
    const j=i+dir; if(j<0||j>=wishes.length) return;
    const t=wishes[i]; wishes[i]=wishes[j]; wishes[j]=t;
    saveWishes(); renderWishes();
  }
  // Перетворити бажання на ціль (одне джерело правди: зв'язок через id)
  function wishToGoal(id){
    const w=wishes.find(x=>x.id===id); if(!w) return;
    const cover = w.type==='video' ? (w.thumb||'') : (w.img||'');
    inputModal({ title:'Зробити ціллю', value:w.cap||'', placeholder:'Напр. Поїздка в Париж, 2027',
      onOk:(name)=>{
        const nm=(name||'').trim(); if(!nm) return;
        if(!Array.isArray(goalsData.goals)) goalsData.goals=[];
        const colors=['#5b8def','#34c77b','#e8843c','#c77dff','#f0b429','#4ecdc4'];
        const gid='g_'+Date.now();
        goalsData.goals.push({ id:gid, name:nm, emoji:'⭐',
          color:colors[goalsData.goals.length%colors.length], steps:[], track:{}, days:{},
          folderKey:null, open:true, wishId:w.id, wishImg:cover });
        w.goalId=gid;
        saveWishes(); saveGoals();
        confirmSheet({
          title:'Бажання стало ціллю ⭐',
          sub:'«'+nm+'» тепер у Цілях з цим фото. Відкрити зараз?',
          ic:'🎯', okLabel:'Відкрити Цілі',
          onOk:()=>{ goalsData.tab='goals'; saveGoals(); show('scr-goals'); try{renderGoals();}catch(_){} }
        });
      }});
  }




  // ═══ FD26T · РАНКОВИЙ РИТУАЛ «Стрічка дня» — ефір + щоденник + відео-полиця ═══
  const RIT_KEY='ritual_board';
  let RIT={days:{},mix:[],links:[]};
  try{ if(Array.isArray(window.FLOW_KEYS)&&window.FLOW_KEYS.indexOf(RIT_KEY)<0) window.FLOW_KEYS.push(RIT_KEY); }catch(_){}
  async function loadRitual(){ try{ const r=await window.storage.get(RIT_KEY,false);
    if(r&&r.value){ const d=JSON.parse(r.value); if(d&&typeof d==='object'){ RIT={days:d.days||{},mix:d.mix||[],links:d.links||[]}; } } }catch(_){} }
  function saveRitual(){ try{ const p=window.storage.set(RIT_KEY,JSON.stringify(RIT),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  let __ritLoad=null; try{ __ritLoad=loadRitual(); }catch(_){}

  function ritualRerender(){ try{ const s=document.getElementById('scr-wishes');
    if(s&&s.classList.contains('active')) renderWishes(); }catch(_){} }
  function goRitual(){ try{ renderWishes(); show('scr-wishes');
    setTimeout(()=>{ try{ const el=document.getElementById('ritInline');
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }catch(_){}} ,180);
  }catch(e){ console.error('goRitual',e); } }
  { const b=document.getElementById('ritBack'); if(b) b.onclick=()=>{ ritStopAll(); try{ renderWishes(); }catch(_){} show('scr-wishes'); }; }

  // ── вранці ритуал уже відкритий: без тапів по «Відкрити» ──
  try{
    if(Array.isArray(window.FLOW_KEYS)&&window.FLOW_KEYS.indexOf('rit_auto')<0) window.FLOW_KEYS.push('rit_auto');
    (__ritLoad||Promise.resolve()).then(function(){ setTimeout(function(){ try{
      var h=new Date().getHours(), ds=ritDs(0);
      var done=RIT.days[ds]&&RIT.days[ds].done;
      var home=document.getElementById('scr-home');
      if(h>=4 && h<12 && !done
        && localStorage.getItem('rit_auto')!==ds
        && home && home.classList.contains('active')){
        localStorage.setItem('rit_auto',ds);
        goRitual();
      }
    }catch(_){} },1200); });
  }catch(_){}

  function ritDay(ds){ if(!RIT.days[ds]) RIT.days[ds]={}; return RIT.days[ds]; }
  function ritDs(off){ const d=new Date(); d.setDate(d.getDate()+off); return ymdLocal(d); }
  function ritStreak(){
    let s=0; for(let i=0;i<400;i++){ const ds=ritDs(-i);
      if(RIT.days[ds]&&RIT.days[ds].done) s++;
      else if(i===0) continue; else break; }
    let best=0,cur=0;
    Object.keys(RIT.days).sort().forEach((ds,i,arr)=>{
      if(!RIT.days[ds].done){ cur=0; return; }
      if(i>0){ const prev=new Date(arr[i-1]), me=new Date(ds);
        cur=(RIT.days[arr[i-1]].done && (me-prev)<=90000000)?cur+1:1;
      } else cur=1;
      if(cur>best) best=cur;
    });
    return {s,best:Math.max(best,s)};
  }
  function ytId(u){ try{ const m=String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/); return m?m[1]:null; }catch(_){ return null; } }
  function fmtDur(sec){ sec=Math.max(0,sec|0); return (sec/60|0)+':'+String(sec%60).padStart(2,'0'); }

  // ── запис аудіо: slot='mix' або 'a1'|'a2'|'a3' (поле щоденника) ──
  let ritRec=null, ritRecT=null, ritRecSec=0, ritAudio=null, ritMixQ=[], ritMixOn=false;
  function ritStopAll(){ try{ if(ritRec) ritRec.stop(); }catch(_){}
    try{ if(ritAudio){ ritAudio.pause(); ritAudio=null; } }catch(_){} ritMixOn=false; }
  async function ritRecord(slot){
    if(ritRec){ try{ ritRec.stop(); }catch(_){} return; }
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mime=MediaRecorder.isTypeSupported('audio/mp4')?'audio/mp4':(MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'');
      ritRec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
      const chunks=[]; ritRecSec=0;
      ritRec.ondataavailable=e=>{ if(e.data&&e.data.size) chunks.push(e.data); };
      ritRec.onstop=()=>{
        stream.getTracks().forEach(t=>t.stop());
        clearInterval(ritRecT); const sec=ritRecSec; const mt=ritRec.mimeType||'audio/mp4'; ritRec=null;
        const blob=new Blob(chunks,{type:mt});
        if(blob.size<1200){ try{plToast('🎙 Закоротко');}catch(_){}; ritualRerender(); return; }
        const fr=new FileReader();
        fr.onload=()=>{ const a=fr.result;
          if(slot==='mix') RIT.mix.push({id:'m'+Date.now(),label:'Запис · '+ritDs(0).slice(5),a,dur:sec});
          else { const d=ritDay(ritDs(0)); d[slot]={a,dur:sec}; }
          saveRitual(); ritualRerender();
          try{ window.platform.haptic('medium'); }catch(_){}
        };
        fr.readAsDataURL(blob);
      };
      ritRec.start(); ritRecT=setInterval(()=>{ ritRecSec++;
        const t=document.getElementById('ritRecTm'); if(t) t.textContent='● '+fmtDur(ritRecSec); },1000);
      ritualRerender(); // покаже стан запису
      try{ plToast('🎙 Говори — тап ще раз, щоб зупинити'); }catch(_){}
    }catch(e){ ritRec=null; try{ plToast('⚠️ Нема доступу до мікрофона'); }catch(_){} }
  }
  /* safety-stop: запис ритуалу не має тихо писати у фоні, коли апку згорнули */
  document.addEventListener('visibilitychange',function(){
    if(document.hidden&&ritRec){
      try{ plToast('🎙 Запис зупинено — застосунок згорнуто'); }catch(_){}
      try{ ritRec.stop(); }catch(_){}
    }
  });
  function ritPlay(a){ ritStopAll(); try{ ritAudio=new Audio(a); ritAudio.play().catch(()=>{}); }catch(_){} }
  function ritMixPlay(btn){
    if(ritMixOn){ ritStopAll(); ritualRerender(); return; }
    ritMixQ=RIT.mix.map(m=>m.a); if(!ritMixQ.length){ try{plToast('Спершу запиши себе 🎙');}catch(_){} return; }
    ritMixOn=true; let i=0;
    const next=()=>{ if(!ritMixOn||i>=ritMixQ.length){ ritMixOn=false; ritualRerender(); return; }
      try{ ritAudio=new Audio(ritMixQ[i++]); ritAudio.onended=next; ritAudio.play().catch(()=>{ next(); }); }catch(_){ next(); } };
    next(); ritualRerender();
  }
  function ritFieldMic(slot){
    const d=ritDay(ritDs(0)), cur=d[slot];
    if(ritRec){ ritRecord(slot); return; }
    if(!cur){ ritRecord(slot); return; }
    actionSheet({title:'Аудіо · '+fmtDur(cur.dur||0), items:[
      {ic:WICONS.play, label:'Прослухати', onClick:()=>ritPlay(cur.a)},
      {ic:'edit', label:'Перезаписати', onClick:()=>{ delete d[slot]; saveRitual(); ritRecord(slot); }},
      {ic:'trash', label:'Прибрати', danger:true, onClick:()=>{ delete d[slot]; saveRitual(); ritualRerender(); }}
    ]});
  }
  function ritMixMenu(){
    if(!RIT.mix.length){ ritRecord('mix'); return; }
    const items=RIT.mix.map(m=>({ic:WICONS.play, label:m.label, sub:fmtDur(m.dur||0),
      onClick:()=>ritPlay(m.a)}));
    items.push({ic:'trash', label:'Видалити останній запис', danger:true,
      onClick:()=>{ RIT.mix.pop(); saveRitual(); ritualRerender(); }});
    actionSheet({title:'Мікс · '+RIT.mix.length+' зап.', items});
  }
  function ritAddLink(){
    inputModal({title:'Посилання на відео', placeholder:'https://youtube.com/…', onOk:u=>{
      u=(u||'').trim(); if(!u) return;
      if(!/^https?:\/\//i.test(u)) u='https://'+u;
      inputModal({title:'Назва (як тобі зручно)', placeholder:'Напр. Goggins · човни', onOk:t=>{
        RIT.links.push({id:'l'+Date.now(), url:u, title:(t||'').trim()||u.replace(/^https?:\/\/(www\.)?/,'').slice(0,40)});
        saveRitual(); ritualRerender();
      }});
    }});
  }
  function ritLinkMenu(id){
    const l=RIT.links.find(x=>x.id===id); if(!l) return;
    actionSheet({title:l.title, items:[
      {ic:'edit', label:'Перейменувати', onClick:()=>inputModal({title:'Назва', value:l.title,
        onOk:v=>{ l.title=(v||'').trim()||l.title; saveRitual(); ritualRerender(); }})},
      {ic:'trash', label:'Прибрати з полиці', danger:true,
        onClick:()=>{ RIT.links=RIT.links.filter(x=>x.id!==id); saveRitual(); ritualRerender(); }}
    ]});
  }

  const RIT_J=[['j1','a1','Я — людина, яка…','…дописуй речення про свою ідентичність'],
               ['j2','a2','Вчорашній доказ','Що вчора підтвердило, що ти вже ця людина?'],
               ['j3','a3','Намір на сьогодні','Одна дія, яка наближає твою дату']];
  function ritualInnerHTML(){
    const today=ritDs(0), d=ritDay(today), st=ritStreak();
    const DW=['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
    // місячний %
    const now=new Date(); let mDone=0,mDays=now.getDate();
    for(let i=1;i<=mDays;i++){ const ds=ymdLocal(new Date(now.getFullYear(),now.getMonth(),i));
      if(RIT.days[ds]&&RIT.days[ds].done) mDone++; }
    const cal=[]; for(let i=-10;i<=2;i++){ const dd=new Date(); dd.setDate(dd.getDate()+i);
      const ds=ymdLocal(dd), rec=RIT.days[ds];
      cal.push(`<div class="cd ${i===0?'today':''} ${rec&&rec.done?'done':(i<0?'miss':'')}"${i===0?' id="ritToday"':''}>
        <s>${DW[dd.getDay()]}</s><b>${dd.getDate()}</b><i></i></div>`); }
    const mixDur=RIT.mix.reduce((s,m)=>s+(m.dur||0),0);
    const recLive=!!ritRec;
    const jr=RIT_J.map(([jk,ak,lb,ph])=>{
      const val=d[jk]||'', au=d[ak];
      return `<div class="glass jr" >
        <div class="lb">${lb}</div>
        <div class="tx ${val?'':'ph'}" data-rjr="${jk}">${val?esc(val):esc(ph)}</div>
        <span class="mic ${au?'has':''}" data-rmic="${ak}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/></svg></span>
        ${au?`<span class="adur">${fmtDur(au.dur||0)}</span>`:''}
      </div>`; }).join('');
    const links=RIT.links.map(l=>{ const id=ytId(l.url);
      const th=id?`background-image:url('https://img.youtube.com/vi/${id}/hqdefault.jpg')`:'';
      const dom=l.url.replace(/^https?:\/\/(www\.)?/,'').split('/')[0];
      return `<div class="vcard" data-rlk="${l.id}">
        <div class="vth ${id?'':'vempty'}" style="${th}">
          <span class="pb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><polygon points="8 5 18 12 8 19" fill="currentColor" stroke="none"/></svg></span>
          <button class="vmn" data-rlmenu="${l.id}">⋯</button></div>
        <div class="vin"><b>${esc(l.title)}</b><small><span class="src">▶</span>${esc(dom)}</small></div>
      </div>`; }).join('');
    return `
      <div class="rit-cal">${cal.join('')}</div>
      <div class="rit-streak">🔥 <b>стрік ${st.s} ${st.s===1?'день':(st.s>=2&&st.s<=4?'дні':'днів')}</b> · найкращий — ${st.best} · ${mDays?Math.round(mDone/mDays*100):0}% місяця</div>
      <div class="glass mix">
        <button class="pl" id="ritMixPl">${ritMixOn?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6v12M15 6v12"/></svg>':WICONS.play}</button>
        <span class="tx"><b>Ранковий мікс · ${fmtDur(mixDur)}</b>
          <small>${RIT.mix.length?('твій голос · '+RIT.mix.length+' зап. · тап ▸ слухати'):'запиши себе з майбутнього — 30–60 с'}</small></span>
        <span class="tm" id="ritRecTm">${recLive?'● '+fmtDur(ritRecSec):''}</span>
        <button class="rec ${recLive?'live':''}" id="ritMixRec">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/></svg></button>
      </div>
      ${jr}
      ${ritPhotoCardHTML(d)}
      <div class="rit-sec"><span>Візія · відео</span><span class="add" id="ritAddLk">＋ посилання</span></div>
      <div class="vrail">${links||'<div class="vhint">Додай відео, які повертають тебе в стан «я вже там»</div>'}</div>
      <button class="rit-done ${d.done?'ok':''}" id="ritDone">${d.done?'✓ День зараховано':'🔥 День зараховано'}</button>`;
  }
  function ritualBind(){
    const today=ritDs(0), d=ritDay(today);
    // календар одразу відкритий на сьогодні (без анімації, щоб не смикалось)
    requestAnimationFrame(()=>{ try{
      const t=document.getElementById('ritToday'), c=t&&t.parentElement;
      if(c) c.scrollLeft=Math.max(0, t.offsetLeft-(c.clientWidth-t.offsetWidth)/2);
    }catch(_){}});
    // bind
    document.getElementById('ritMixPl').onclick=e=>ritMixPlay(e.currentTarget);
    document.getElementById('ritMixRec').onclick=()=>ritRec?ritRecord('mix'):ritMixRecTap();
    document.getElementById('ritAddLk').onclick=ritAddLink;
    document.querySelectorAll('[data-rjr]').forEach(el=>el.onclick=()=>{
      const jk=el.dataset.rjr, meta=RIT_J.find(x=>x[0]===jk);
      inputModal({title:meta[2], value:d[jk]||'', placeholder:meta[3],
        onOk:v=>{ d[jk]=(v||'').trim(); saveRitual(); ritualRerender(); }}); });
    document.querySelectorAll('[data-rmic]').forEach(el=>el.onclick=e=>{ e.stopPropagation(); ritFieldMic(el.dataset.rmic); });
    { const pc=document.getElementById('ritPhotoCard'); if(pc) pc.onclick=(e)=>{
        if(e.target.closest('[data-rphomenu]')) return;
        const dd=ritDay(today); if(dd.photo) ritEnterMoment(); else ritPhotoTap();
      }; }
    document.querySelectorAll('[data-rphomenu]').forEach(el=>el.onclick=e=>{ e.stopPropagation(); ritPhotoMenu(); });
    document.querySelectorAll('[data-rlk]').forEach(el=>el.onclick=()=>{
      const l=RIT.links.find(x=>x.id===el.dataset.rlk); if(!l) return;
      try{ window.platform.openLink(l.url); }catch(_){ try{ window.open(l.url,'_blank'); }catch(__){} } });
    document.querySelectorAll('[data-rlmenu]').forEach(el=>el.onclick=e=>{ e.stopPropagation(); ritLinkMenu(el.dataset.rlmenu); });
    document.getElementById('ritDone').onclick=()=>{
      const dd=ritDay(today);
      if(dd.done){ delete dd.done; saveRitual(); ritualRerender(); return; }
      try{ plToast('✨ Перейти до візуалізації мрій…'); }catch(_){}
      setTimeout(()=>{
        ritEnterMoment({
          seconds:150,
          label:'Перейди до візуалізації мрій',
          hint:'Уяви, що цей день сьогодні — саме цей: як ти його відчуваєш, як проживаєш?',
          doneLabel:'Зарахувати день',
          emptyMsg:'День зараховано — додай образи в Карту бажань, щоб бачити тут миті',
          onClose:()=>{
            const d2=ritDay(today); d2.done=1; saveRitual(); ritualRerender();
            try{ window.platform.haptic('medium'); plToast('🔥 День у стріку'); }catch(_){}
          }
        });
      },550);
    };
  }
  // ── Фото дня: запис живого зображення (з зошита/телефону) + пауза «Момент» ──
  const RPH_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  function ritPhotoCardHTML(d){
    if(d.photo){
      return `<div class="glass rphoto has" id="ritPhotoCard">
        <div class="rph-img" style="background-image:url('${safeImg(d.photo.url)}')"></div>
        <div class="rph-ov"><b>📸 Фото дня збережено</b><small>тап — знову зайти в момент</small></div>
        <button class="rph-menu" data-rphomenu="1">⋯</button>
      </div>`;
    }
    return `<div class="glass rphoto" id="ritPhotoCard">
      <div class="rph-ic">${RPH_ICON}</div>
      <span class="tx"><b>Фото дня</b><small>сфотографуй запис із зошита чи телефону — щоб AI зміг це візуалізувати</small></span>
      <span class="rph-arrow">›</span>
    </div>`;
  }
  function ritPhotoTap(){
    const inp=document.createElement('input');
    inp.type='file'; inp.accept='image/*'; inp.style.display='none';
    document.body.appendChild(inp);
    inp.onchange=()=>{
      const f=(inp.files||[])[0]; inp.remove(); if(!f) return;
      compressImage(f,(dataUrl)=>ritSavePhoto(dataUrl));
    };
    inp.click();
  }
  // проста обгортка з таймаутом, щоб офлайн/повільна мережа не тримала людину в очікуванні
  function fetchWithTimeout(url,opts,ms){
    return Promise.race([
      fetch(url,opts),
      new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms||9000))
    ]);
  }
  async function ritSavePhoto(dataUrl){
    const today=ritDs(0), d=ritDay(today);
    try{ plToast('📸 Зберігаю…'); }catch(_){}
    let saved={ts:Date.now(),url:dataUrl,local:true};
    try{
      const res=await fetchWithTimeout(aiEndpoint()+'/upload-photo',{
        method:'POST', headers:{'content-type':'application/json'},
        body:JSON.stringify({image:dataUrl, day:today})
      },9000);
      if(res && res.ok){
        const data=await res.json();
        if(data && data.url) saved={ts:Date.now(),url:data.url,local:false};
      }
    }catch(_){ /* нема мережі/проксі — лишаємось з локальним фото, спробуємо синхронізувати пізніше */ }
    d.photo=saved; saveRitual(); ritualRerender();
    try{ window.platform.haptic('medium'); }catch(_){}
    ritEnterMoment();
  }
  function ritPhotoMenu(){
    const d=ritDay(ritDs(0)); if(!d.photo) return;
    actionSheet({title:'Фото дня', items:[
      {ic:WICONS.play, label:'Зайти в момент', onClick:()=>ritEnterMoment()},
      {ic:'edit', label:'Перезняти', onClick:()=>ritPhotoTap()},
      {ic:'trash', label:'Прибрати', danger:true, onClick:()=>{ delete d.photo; saveRitual(); ritualRerender(); }}
    ]});
  }
  // ── Повноекранна пауза «Момент»: рандомне фото з Карти бажань, щоб пару хвилин пожити в ньому ──
  let rmomTimer=null;
  function ritEnterMoment(opts){
    opts=opts||{};
    const pool=wishes.filter(w=> (w.type==='video') ? !!w.thumb : !!w.img);
    if(!pool.length){
      try{ plToast(opts.emptyMsg||'📸 Фото дня збережено — додай образи в Карту бажань, щоб бачити тут миті'); }catch(_){}
      if(opts.onClose) opts.onClose();
      return;
    }
    const w=pool[Math.floor(Math.random()*pool.length)];
    const img = w.type==='video' ? w.thumb : w.img;
    const secTotal=opts.seconds||75;
    const ov=document.createElement('div'); ov.className='rmom-ov'; ov.id='rmomOv';
    ov.innerHTML=`
      <div class="rmom-bg" style="background-image:url('${safeImg(img)}')"></div>
      <div class="rmom-top"><button class="rmom-x" id="rmomX">✕</button></div>
      <div class="rmom-mid">
        <div class="rmom-tm" id="rmomTm">${fmtDur(secTotal)}</div>
        <div class="rmom-lb">${esc(opts.label||'Проживи цю мить')}</div>
        <div class="rmom-cap">${esc(w.cap||'Це вже твоє сьогодні')}</div>
        <div class="rmom-hint">${esc(opts.hint||'Кілька хвилин уяви, що ти вже тут — як це відчувається, що бачиш, що чуєш')}</div>
      </div>
      <div class="rmom-bot"><button class="rmom-done" id="rmomDone">${esc(opts.doneLabel||'Завершити')}</button></div>`;
    document.body.appendChild(ov);
    let sec=secTotal;
    const tm=document.getElementById('rmomTm');
    const tick=()=>{ if(tm) tm.textContent=fmtDur(sec); if(sec<=0){ clearInterval(rmomTimer); rmomTimer=null;
        const btn=document.getElementById('rmomDone'); if(btn) btn.textContent='✓ Готово'; } sec--; };
    tick(); rmomTimer=setInterval(tick,1000);
    const close=()=>{ if(rmomTimer){ clearInterval(rmomTimer); rmomTimer=null; } ov.remove(); if(opts.onClose) opts.onClose(); };
    document.getElementById('rmomX').onclick=close;
    document.getElementById('rmomDone').onclick=close;
  }
  function ritMixRecTap(){ if(RIT.mix.length) ritMixLongOrRec(); else ritRecord('mix'); }
  function ritMixLongOrRec(){
    actionSheet({title:'Мікс', items:[
      {ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/></svg>', label:'Дозаписати', primary:true, onClick:()=>ritRecord('mix')},
      {ic:WICONS.play, label:'Список записів', sub:RIT.mix.length+' зап.', onClick:ritMixMenu}
    ]});
  }

  // ═══ FD26T · КОЛАЖ «Мудборд» — дошка мрій: фото, афірмації, наліпки, шпалери ═══
  const CLG_KEY='collage_board';
  let collage=[]; // [{id, kind:'photo'|'quote'|'stick', img?, text?, cap?, size:''|'S'|'L', wishId?}]
  try{ if(Array.isArray(window.FLOW_KEYS)&&window.FLOW_KEYS.indexOf(CLG_KEY)<0) window.FLOW_KEYS.push(CLG_KEY); }catch(_){}
  async function loadCollage(){ try{ const r=await window.storage.get(CLG_KEY,false);
    if(r&&r.value){ const d=JSON.parse(r.value); if(Array.isArray(d)) collage=d; } }catch(_){} }
  function saveCollage(){ try{ const p=window.storage.set(CLG_KEY,JSON.stringify(collage),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  try{ loadCollage(); }catch(_){}

  function goCollage(){ try{ renderCollage(); show('scr-collage'); }catch(e){ console.error('goCollage',e); } }
  { const b=document.getElementById('clgBack'); if(b) b.onclick=()=>{ try{ renderWishes(); }catch(_){} show('scr-wishes'); }; }

  function clgPickPhotos(){
    const inp=document.createElement('input');
    inp.type='file'; inp.accept='image/*'; inp.multiple=true; inp.style.display='none';
    document.body.appendChild(inp);
    inp.onchange=()=>{
      const files=Array.from(inp.files||[]); inp.remove();
      if(!files.length) return;
      let done=0;
      files.forEach((f,fi)=>compressImage(f,(dataUrl)=>{
        collage.push({id:'c'+Date.now()+'_'+fi, kind:'photo', img:dataUrl, cap:'', size:''});
        if(++done===files.length){ saveCollage(); renderCollage(); }
      }));
    };
    inp.click();
  }
  function clgImportWishes(){
    let n=0;
    wishes.forEach(w=>{
      const img=w.type==='video'?(w.thumb||''):(w.img||'');
      if(!img) return;
      if(collage.some(c=>c.wishId===w.id)) return;
      collage.push({id:'c'+Date.now()+'_'+(n++), kind:'photo', img, cap:w.cap||'', size:n===1?'L':'', wishId:w.id});
    });
    saveCollage(); renderCollage();
    try{ if(typeof plToast==='function') plToast(n?('＋ '+n+' з карти бажань'):'Все вже на дошці'); }catch(_){}
  }
  function clgMenu(id){
    const c=collage.find(x=>x.id===id); if(!c) return;
    const items=[];
    if(c.kind==='photo') items.push({ic:'edit', label:'Підпис', sub:c.cap||'без підпису',
      onClick:()=>inputModal({title:'Підпис', value:c.cap||'', placeholder:'Напр. Балі · січ 2027',
        onOk:v=>{ c.cap=(v||'').trim(); saveCollage(); renderCollage(); }})});
    if(c.kind==='quote') items.push({ic:'edit', label:'Редагувати текст', sub:c.text||'',
      onClick:()=>inputModal({title:'Афірмація', value:c.text||'',
        onOk:v=>{ c.text=(v||'').trim(); saveCollage(); renderCollage(); }})});
    items.push({ic:'trash', label:'Прибрати з дошки', danger:true,
      onClick:()=>{ collage=collage.filter(x=>x.id!==id); saveCollage(); renderCollage(); }});
    actionSheet({title:c.kind==='photo'?(c.cap||'Фото'):(c.kind==='quote'?'Афірмація':'Наліпка'), items});
  }
  function renderCollage(){
    const body=document.getElementById('collageBody'); if(!body) return;
    const head=`<div class="wish-head">
      <div class="e">Дошка мрій</div><h2>Колаж</h2>
      <div class="sub">Фото, афірмації й наліпки — все впереміш. Тап по фото змінює розмір.</div>
    </div>`;
    if(!collage.length){
      body.innerHTML=head+`<div class="wish-empty"><div class="big">🎨</div>
        Дошка порожня. Додай фото або забери образи з карти бажань.
        <div style="margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="v-btn" id="clgFirst" style="background:var(--accent);max-width:180px">＋ Фото</button>
          <button class="v-btn ghost" id="clgFromW" style="max-width:200px">З карти бажань</button>
        </div></div>`;
      const b=document.getElementById('clgFirst'); if(b) b.onclick=clgPickPhotos;
      const w=document.getElementById('clgFromW'); if(w) w.onclick=clgImportWishes;
      return;
    }
    const tiles=collage.map(c=>{
      if(c.kind==='quote') return `<div class="clg-quote" data-cid="${c.id}">
        <p>${esc(c.text||'')}</p><small>афірмація</small>
        <button class="clg-mn" data-cmenu="${c.id}">⋯</button></div>`;
      if(c.kind==='stick') return `<div class="clg-stick" data-cid="${c.id}">
        <span>${esc(c.text||'🔥')}</span><button class="clg-mn" data-cmenu="${c.id}">⋯</button></div>`;
      const sz=c.size==='S'?'S':(c.size==='L'?'L':'');
      return `<div class="clg-tile ${sz}" data-cid="${c.id}">
        <div class="clg-ph" style="background-image:url('${safeImg(c.img)}')"></div>
        <span class="clg-sz">${sz||'M'}</span>
        ${c.cap?`<span class="clg-cap">${esc(c.cap)}</span>`:''}
        <button class="clg-mn" data-cmenu="${c.id}">⋯</button></div>`;
    }).join('');
    body.innerHTML=head+`<div class="clg-board" id="clgBoard">${tiles}</div>
      <div class="clg-bar">
        <button id="clgPh" class="hot">${WICONS.photo}<span>Фото</span></button>
        <button id="clgTx"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7V5h16v2M12 5v14M9 19h6"/></svg><span>Текст</span></button>
        <button id="clgSt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M8.7 14.2a4.4 4.4 0 0 0 6.6 0"/><path d="M9.3 9.8h.01M14.7 9.8h.01" stroke-width="2.4"/></svg><span>Наліпка</span></button>
        <button id="clgWp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M4 15l4-4 4 4 4-5 4 5"/></svg><span>Шпалери</span></button>
      </div>
      <div class="wish-note">${collage.length} на дошці · тап по фото — розмір · ⋯ — дії</div>`;
    const board=document.getElementById('clgBoard');
    board.addEventListener('click',e=>{
      const mn=e.target.closest('[data-cmenu]');
      if(mn){ e.stopPropagation(); clgMenu(mn.dataset.cmenu); return; }
      const t=e.target.closest('.clg-tile'); if(!t) return;
      const c=collage.find(x=>x.id===t.dataset.cid); if(!c) return;
      const ord=['','L','S']; c.size=ord[(ord.indexOf(c.size||'')+1)%3];
      saveCollage(); renderCollage();
      try{ window.platform.haptic('light'); }catch(_){}
    });
    document.getElementById('clgPh').onclick=clgPickPhotos;
    document.getElementById('clgTx').onclick=()=>inputModal({title:'Афірмація', placeholder:'Я будую систему, яка працює на мене',
      onOk:v=>{ v=(v||'').trim(); if(!v) return; collage.push({id:'c'+Date.now(),kind:'quote',text:v}); saveCollage(); renderCollage(); }});
    document.getElementById('clgSt').onclick=()=>inputModal({title:'Наліпка', placeholder:'🔥 ⚡ 🌊 ⭐ — встав емодзі',
      onOk:v=>{ v=(v||'').trim(); if(!v) return; collage.push({id:'c'+Date.now(),kind:'stick',text:v.slice(0,4)}); saveCollage(); renderCollage(); }});
    document.getElementById('clgWp').onclick=clgWallpaper;
  }

  // ── Шпалери 9:16: дошка → картинка на локскрін ──
  function clgWrap(ctx,text,maxW){
    const words=String(text).split(/\s+/), lines=[]; let ln='';
    words.forEach(w=>{ const t=ln?ln+' '+w:w;
      if(ctx.measureText(t).width>maxW && ln){ lines.push(ln); ln=w; } else ln=t; });
    if(ln) lines.push(ln); return lines;
  }
  function clgWallpaper(){
    try{
      const W=1080,H=1920,pad=54,gap=24,colW=(W-pad*2-gap)/2;
      const cv=document.createElement('canvas'); cv.width=W; cv.height=H;
      const x=cv.getContext('2d');
      // ніч
      const g=x.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0d0a1c'); g.addColorStop(1,'#07060e');
      x.fillStyle=g; x.fillRect(0,0,W,H);
      for(let i=0;i<90;i++){ x.fillStyle='rgba(255,255,255,'+(Math.random()*.5+.15)+')';
        x.beginPath(); x.arc(Math.random()*W,Math.random()*H,Math.random()*1.6+.4,0,7); x.fill(); }
      const imgs={};
      const photoItems=collage.filter(c=>c.kind==='photo');
      Promise.all(photoItems.map(c=>new Promise(res=>{
        const im=new Image(); im.onload=()=>{ imgs[c.id]=im; res(); }; im.onerror=()=>res(); im.src=c.img;
      }))).then(()=>{
        // контент малюємо на проміжному полотні, потім вписуємо в 9:16
        const hFor=c=>{ if(c.kind==='photo') return c.size==='S'?300:(c.size==='L'?640:430);
          if(c.kind==='stick') return 150;
          x.font='800 34px Manrope,sans-serif';
          return clgWrap(x,c.text||'',colW-72).length*46+118; };
        const colY=[0,0], place=[];
        collage.forEach(c=>{ const ci=colY[0]<=colY[1]?0:1; const h=hFor(c);
          place.push({c,ci,y:colY[ci],h}); colY[ci]+=h+gap; });
        const contentH=Math.max(colY[0],colY[1]),
              s=Math.min(1,(H-pad*2)/Math.max(contentH,1));
        const scale=s, boardW=(colW*2+gap)*scale, startX=(W-boardW)/2, startY=pad+Math.max(0,(H-pad*2-contentH*scale)/2);
        const rr=(px,py,pw,ph,r)=>{ x.beginPath(); x.moveTo(px+r,py);
          x.arcTo(px+pw,py,px+pw,py+ph,r); x.arcTo(px+pw,py+ph,px,py+ph,r);
          x.arcTo(px,py+ph,px,py,r); x.arcTo(px,py,px+pw,py,r); x.closePath(); };
        place.forEach(p=>{
          const px=startX+p.ci*(colW+gap)*scale, py=startY+p.y*scale,
                pw=colW*scale, ph=p.h*scale, c=p.c;
          if(c.kind==='photo'){
            rr(px,py,pw,ph,16*scale); x.save(); x.clip();
            const im=imgs[c.id];
            if(im&&im.width){ const k=Math.max(pw/im.width,ph/im.height),
              dw=im.width*k, dh=im.height*k;
              x.drawImage(im,px-(dw-pw)/2,py-(dh-ph)/2,dw,dh);
            }else{ x.fillStyle='#1c1436'; x.fillRect(px,py,pw,ph); }
            if(c.cap){ const gg=x.createLinearGradient(0,py+ph*.55,0,py+ph);
              gg.addColorStop(0,'rgba(0,0,0,0)'); gg.addColorStop(1,'rgba(0,0,0,.72)');
              x.fillStyle=gg; x.fillRect(px,py+ph*.5,pw,ph*.5);
              x.fillStyle='#fff'; x.font='800 '+(26*scale|0)+'px Manrope,sans-serif';
              x.fillText(c.cap,px+18*scale,py+ph-22*scale,pw-36*scale); }
            x.restore();
            x.strokeStyle='rgba(255,255,255,.12)'; x.lineWidth=2; rr(px,py,pw,ph,16*scale); x.stroke();
          }else if(c.kind==='quote'){
            rr(px,py,pw,ph,16*scale);
            x.fillStyle='rgba(139,124,255,.14)'; x.fill();
            x.strokeStyle='rgba(139,124,255,.4)'; x.lineWidth=2; x.stroke();
            x.fillStyle='#eceaf6'; x.font='800 '+(34*scale|0)+'px Manrope,sans-serif';
            const lines=clgWrap(x,c.text||'',pw-72*scale);
            lines.forEach((ln,i)=>x.fillText(ln,px+34*scale,py+(64+i*46)*scale));
            x.fillStyle='#c4a8ff'; x.font='700 '+(20*scale|0)+'px Manrope,sans-serif';
            x.fillText('АФІРМАЦІЯ',px+34*scale,py+ph-28*scale);
          }else{
            x.font=(96*scale|0)+'px sans-serif'; x.textAlign='center';
            x.fillText(c.text||'🔥',px+pw/2,py+ph*.72); x.textAlign='left';
          }
        });
        const url=cv.toDataURL('image/jpeg',.92);
        const ov=document.createElement('div'); ov.className='clg-ov';
        ov.innerHTML=`<div class="in"><img src="${url}" alt="Шпалери">
          <div class="hint">Затисни картинку → «Зберегти зображення» → постав на локскрін</div>
          <button class="cls">Закрити</button></div>`;
        document.body.appendChild(ov);
        ov.querySelector('.cls').onclick=()=>ov.remove();
        ov.onclick=e=>{ if(e.target===ov) ov.remove(); };
      });
    }catch(e){ console.error('clgWallpaper',e);
      try{ if(typeof plToast==='function') plToast('Не вдалось зібрати шпалери'); }catch(_){} }
  }

  // ── FD26T · Тема «Вітрина»: фокус-колода з датами, відліком і ритуалом ──
  let wdkShow=null;
  function wishDateInfo(t){
    // вільний текст targetDate → дата: «2029», «січ 2027», «літо 2027», «09.2026», «2026-09»
    try{
      if(!t) return null;
      const s=String(t).toLowerCase().trim();
      let y=null,m=0;
      const ym=s.match(/(\d{4})[-./](\d{1,2})/)||s.match(/(\d{1,2})[-./](\d{4})/);
      if(ym){ if(ym[1].length===4){y=+ym[1];m=+ym[2];} else {y=+ym[2];m=+ym[1];} }
      else{
        const yy=s.match(/(\d{4})/); if(!yy) return null; y=+yy[1];
        const MN=[['січ',1],['лют',2],['бер',3],['кві',4],['тра',5],['чер',6],['лип',7],['сер',8],['вер',9],['жов',10],['лис',11],['гру',12],['зим',12],['весн',4],['літ',7],['осін',10],['осен',10]];
        for(let i=0;i<MN.length;i++){ if(s.indexOf(MN[i][0])>=0){ m=MN[i][1]; break; } }
      }
      if(!y||y<2000||y>2100) return null;
      m=Math.min(12,Math.max(1,m||1));
      const days=Math.ceil((new Date(y,m-1,1) - new Date())/86400000);
      return {days};
    }catch(_){ return null; }
  }
  function renderWishDeck(body, head){
    const goals=(goalsData.goals||[]);
    let seed=0; try{ const s=ymdLocal(); for(let i=0;i<s.length;i++) seed=(seed*31+s.charCodeAt(i))>>>0; }catch(_){}
    const focusId=wishes.length?wishes[seed%wishes.length].id:null;
    const ordered=wishes.slice().sort((a,b)=>(a.id===focusId?-1:0)-(b.id===focusId?-1:0));
    const C=113.1;
    const slides=ordered.map(w=>{
      const isVid=w.type==='video';
      const bg=isVid?(w.thumb?`background-image:url('${safeImg(w.thumb)}')`:`background:linear-gradient(135deg,#241b3e,#0e0a20)`):`background-image:url('${safeImg(w.img)}')`;
      const gl=w.goalId?goals.find(x=>x.id===w.goalId):null;
      let pct=null;
      if(gl){ const st=gl.steps||[]; const sd=st.filter(s=>s.done).length; pct=st.length?Math.round(sd/st.length*100):(gl.progress||0); }
      const di=wishDateInfo(w.targetDate);
      const cnt=di?(di.days>0
        ?`<div class="wdk-cnt"><b>${di.days}</b><span>${di.days%10===1&&di.days%100!==11?'день':(di.days%10>=2&&di.days%10<=4&&(di.days%100<10||di.days%100>=20)?'дні':'днів')} до дати</span></div>`
        :`<div class="wdk-cnt"><b>✓</b><span>час настав</span></div>`):'';
      const ring=pct!==null?`<div class="wdk-ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18"/><circle cx="22" cy="22" r="18" class="pv" stroke-dasharray="${C}" stroke-dashoffset="${(C*(1-pct/100)).toFixed(1)}"/></svg><span>${pct}%</span></div>`:'';
      return `<div class="wdk-slide ${w.id===focusId?'focus':''}" data-wid="${w.id}" style="${bg}">
        <div class="wdk-veil"></div>
        ${w.id===focusId?'<span class="wdk-fl">🔥 фокус дня</span>':''}
        ${isVid?'<div class="wish-play">▶</div>':''}
        ${ring}
        <button class="wdk-menu" data-menu="${w.id}">⋯</button>
        <div class="wdk-in">
          <div class="wdk-cap">${esc(w.cap||'Образ майбутнього')}</div>
          <div class="wdk-meta">
            <span class="wdk-chip date" data-wdate="${w.id}">${esc(w.targetDate||'＋ дата')}</span>
            ${gl?`<span class="wdk-chip goal">${esc(gl.name||'ціль')}</span>`:''}
          </div>
          ${cnt}
        </div>
      </div>`;
    }).join('');
    const clgTh=(collage.filter(c=>c.kind==='photo').slice(0,3).map(c=>c.img));
    const clgThumbs=(clgTh.length?clgTh:wishes.filter(w=>w.img||w.thumb).slice(0,3).map(w=>w.img||w.thumb))
      .map(u=>`<i style="background-image:url('${safeImg(u)}')"></i>`).join('');
    body.innerHTML=head+`
      <div class="clg-banner" id="clgOpen">
        <span class="stack">${clgThumbs||'<i></i>'}</span>
        <span class="t"><b>Колаж</b><small>дошка мрій · текст · наліпки · шпалери</small></span>
        <span class="ar">›</span>
      </div>
      <div class="wdk" id="wdkDeck">
        <div class="wdk-add" id="wdkAdd">${WICONS.photo}<span>Фото</span></div>${slides}
      </div>
      <div class="wdk-dots" id="wdkDots">${ordered.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>
      <div class="rit-sec" style="margin-top:18px"><span>🔥 Ранковий ритуал</span></div>
      <div id="ritInline" class="rit-wrap">${ritualInnerHTML()}</div>
      <div class="wish-note">${wishes.length} ${wishes.length===1?'образ':'образів'} · свайпай · ⋯ — дії · тап по чипу — дата</div>`;
    body.querySelectorAll('[data-wtheme]').forEach(b=>b.onclick=()=>{ goalsData.wishTheme=b.dataset.wtheme; saveGoals(); renderWishes(); });
    const deck=body.querySelector('#wdkDeck');
    const dots=Array.prototype.slice.call(body.querySelectorAll('#wdkDots i'));
    if(deck) deck.addEventListener('scroll',()=>{
      const sl=deck.querySelectorAll('.wdk-slide'); if(!sl.length) return;
      const mid=deck.scrollLeft+deck.clientWidth/2;
      let best=0,bd=1e9;
      sl.forEach((el,i)=>{ const d=Math.abs(el.offsetLeft+el.offsetWidth/2-mid); if(d<bd){bd=d;best=i;} });
      dots.forEach((d,j)=>d.classList.toggle('on',j===best));
    },{passive:true});
    // відкривати колоду одразу на фокусі дня (плитка Фото лишається на відстані свайпа вліво)
    requestAnimationFrame(()=>{ try{ const f=deck&&deck.querySelector('.wdk-slide');
      if(f) deck.scrollLeft=Math.max(0,f.offsetLeft-18); }catch(_){}});
    body.querySelectorAll('[data-menu]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); openWishMenu(b.dataset.menu); });
    body.querySelectorAll('[data-wdate]').forEach(b=>b.onclick=e=>{ e.stopPropagation();
      const w=wishes.find(x=>x.id===b.dataset.wdate); if(!w) return;
      inputModal({title:'Дата образу', value:w.targetDate||'', placeholder:'Напр. січ 2027, 09.2026 або 2029',
        onOk:v=>{ w.targetDate=(v||'').trim(); saveWishes(); renderWishes(); }}); });
    body.querySelectorAll('.wdk-slide').forEach(c=>c.onclick=()=>{
      const w=wishes.find(x=>x.id===c.dataset.wid);
      if(w&&w.type==='video'&&w.url) openWishVideo(w); else openWishCard(c.dataset.wid); });
    const add=body.querySelector('#wdkAdd'); if(add) add.onclick=()=>pickWishPhoto();
    const clg=body.querySelector('#clgOpen'); if(clg) clg.onclick=goCollage;
    bindWishPrice(body);
    try{ ritualBind(); }catch(e){ console.error('ritual inline',e); }
  }

  function renderWishes(){
    const body=document.getElementById('wishesBody'); if(!body) return;
    updateSummaryBg();
    const wtheme='deck'; // Класична/AI прибрані — карта бажань = Вітрина
    const head=`
      <div class="wish-head">
        <div class="e">Куди я йду</div>
        <h2>Карта бажань</h2>
        <div class="sub">Кожне фото — образ майбутнього. Заходь сюди щодня й дивись.</div>

      </div>
      ${wishPriceHTML()}`;
    if(!wishes.length){
      body.innerHTML=head+`
        <div class="wish-empty">
          <div class="big">✨</div>
          Поки порожньо. Додай перше фото — місце, людину, річ, стан, до якого хочеш прийти.
          <div style="margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="v-btn" id="wishFirst" style="background:var(--val);max-width:180px">＋ Фото</button>
            <button class="v-btn ghost" id="wishFirstVid" style="max-width:180px">▶ Відео</button>
          </div>
        </div>`;
      const b=document.getElementById('wishFirst'); if(b) b.onclick=()=>pickWishPhoto();
      const bv=document.getElementById('wishFirstVid'); if(bv) bv.onclick=()=>addWishVideo();
      bindWishPrice(body);
      return;
    }
    if(wtheme==='deck'){ try{ renderWishDeck(body, head); return; }catch(e){ console.error('wishDeck',e); } }
    const cells=wishes.map(w=>{
      const cls=w.size==='tall'?'tall':(w.size==='wide'?'wide':'');
      const isVid=w.type==='video';
      const bgStyle = isVid
        ? (w.thumb?`background-image:url('${safeImg(w.thumb)}')`:`background:linear-gradient(135deg,#1b2335,#0e1320)`)
        : `background-image:url('${safeImg(w.img)}')`;
      const playIcon = isVid?`<div class="wish-play">▶</div>`:'';
      // AI-тема: HUD-панель із прогресом зв'язаної цілі (якщо є)
      let hud='';
      if(wtheme==='ai'){
        const gl = w.goalId ? (goalsData.goals||[]).find(x=>x.id===w.goalId) : null;
        let pct=null;
        if(gl){ const st=gl.steps||[]; const sd=st.filter(s=>s.done).length; pct=st.length?Math.round(sd/st.length*100):(gl.progress||0); }
        hud=`<div class="wish-hud">
          <div class="wh-top"><span class="wh-cap">${esc(w.cap||'образ')}</span>${pct!==null?`<span class="wh-pct">${pct}%</span>`:'<span class="wh-dot"></span>'}</div>
          ${pct!==null?`<div class="wh-track"><i style="width:${pct}%"></i></div>`:''}
          <div class="wh-scan">// ${gl?'goal.active':'dream.idle'}</div>
        </div>`;
      }
      return `<div class="wish-cell ${cls}" style="${bgStyle}" data-wid="${w.id}">
        <div class="sh"></div>
        ${playIcon}
        <button class="wmenu" data-menu="${w.id}">⋯</button>
        ${wtheme==='ai' ? hud : (w.cap?`<div class="cap">${esc(w.cap)}</div>`:'')}
      </div>`;
    }).join('');
    body.innerHTML=head+`<div class="wish-collage wm-theme-${wtheme}">${cells}
      <div class="wish-add" id="wishAdd"><div class="pl">${WICONS.photo}</div><div class="tx">Фото</div></div>
      <div class="wish-add" id="wishAddVid"><div class="pl">${WICONS.play}</div><div class="tx">Відео</div></div>
      </div>
      <div class="wish-note">${wishes.length} ${wishes.length===1?'образ':'образів'} · тапни ⋯ для дій, або плитку — щоб відкрити</div>`;
    body.querySelector('#wishAdd').onclick=()=>pickWishPhoto();
    body.querySelector('#wishAddVid').onclick=()=>addWishVideo();
    bindWishPrice(body);
    body.querySelectorAll('[data-wtheme]').forEach(b=>b.onclick=()=>{ goalsData.wishTheme=b.dataset.wtheme; saveGoals(); renderWishes(); });
    body.querySelectorAll('[data-menu]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); openWishMenu(b.dataset.menu); });
    body.querySelectorAll('.wish-cell').forEach(c=>c.onclick=()=>{
      const w=wishes.find(x=>x.id===c.dataset.wid);
      if(w&&w.type==='video'&&w.url){ openWishVideo(w); }
      else openWishCard(c.dataset.wid);
    });
  }

