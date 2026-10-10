  /* ════════ «Стартовий набір» — перший екран нової людини (53-starter.js, 10.10.2026) ════════
     Варіант А з макетів Higgsfield. Порожній Огляд (жодної папки, жодної мрії) не показує
     голий аркуш: банер Карти бажань стає колажем із 5 фото-мрій, замість «＋ Нова папка» —
     4 папки-приклади з обкладинками, картка Журналу героя і кнопка «Зробити своїм».
     Правила (погоджено з Ярославом):
       • приклад лише НАМАЛЬОВАНИЙ — у сховище нічого не пишеться, доки людина не тисне;
       • «Зробити своїм» → шторка з галочками → вибране стає справжніми папками й мріями
         (звичайні saveFolders()/saveWishes(): це дія людини, а не автоматика). Демо-цифри
         (57%, «3 звички») не переносяться — програма не каже людині неправду про неї;
       • «Почати з чистого аркуша» — позначка лише на цьому пристрої (localStorage flow_starter);
       • показуємо, лише коли папки й мрії справді прочитані (storeKeyReady): офлайн-копія
         «порожньо» ≠ порожній акаунт — інакше приклад вискочив би людині з даними в хмарі.
     Фото — ліниво з starter-assets.js (src/web), лише коли набір справді потрібен. */
  const ST_KEY='flow_starter';
  const ST_WISHES=[
    {a:'sea',    cap:'Зустріти світанок біля моря', size:'tall'},
    {a:'run',    cap:'Пробігти 10 км у горах',       size:'tall'},
    {a:'home',   cap:'Свій затишний дім',            size:'wide'},
    {a:'study',  cap:'Опанувати нову професію',      size:'sq'},
    {a:'travel', cap:'Подорож мрії',                 size:'sq'},
  ];
  // «Кар'єра», а не «Робота»: папка «Робота» вже є в кожному акаунті (вкладка «Проєкти»)
  const ST_FOLDERS=[
    {a:'health', name:"Здоров'я", emoji:'❤️', c:'#34c77b', stat:'3 звички'},
    {a:'money',  name:'Гроші',    emoji:'💰', c:'#f0b429', stat:'ціль 68%'},
    {a:'learn',  name:'Навчання', emoji:'📚', c:'#5b8def', stat:'курс 40%'},
    {a:'work',   name:"Кар'єра",  emoji:'💼', c:'#c77dff', stat:'5 задач'},
  ];
  let stLoading=false, stBusy=false;
  function stOff(){ try{ return !!localStorage.getItem(ST_KEY); }catch(_){ return false; } }
  function stTrusted(){
    if(!foldersLoaded) return false;
    if(typeof window.sbDataTrusted==='function'&&!window.sbDataTrusted()) return false;
    return !(window.storeKeyReady&&!['folders_cfg','wishes_board'].every(k=>window.storeKeyReady(k)));
  }
  // той самий відбір, що в renderDashboard: Робота й проєкти на Огляді не живуть
  function stEmpty(){
    const keys=topFolderKeys().filter(folderVisible).filter(k=>k!=='work'&&!(folders[k]&&folders[k].role==='project'));
    return !keys.length && !(wishes||[]).length;
  }
  function starterActive(){ return !stOff() && stTrusted() && stEmpty(); }
  function stImg(a){ const A=window.STARTER_A; return A&&A[a]?A[a]:''; }
  function stLoad(){
    if(window.STARTER_A||stLoading) return;
    stLoading=true;
    window.starterAssetsReady=()=>{ try{ renderDashboard(); }catch(_){} try{ updateSummaryBg(); }catch(_){} };
    const s=document.createElement('script');
    s.src='starter-assets.js'; s.async=true;
    s.onerror=()=>{ stLoading=false; };   // офлайн без кешу — плитки лишаються кольоровими
    document.head.appendChild(s);
  }
  const stBg=a=>{ const u=stImg(a); return u?`style="background-image:url('${safeImg(u)}')"`:''; };

  /* ── банер Карти бажань: колаж замість «0%» ── */
  function stHeroOff(){
    const card=document.getElementById('summaryCard'); if(!card) return;
    card.classList.remove('is-starter');
    const h=card.querySelector('.st-hero'); if(h) h.remove();
  }
  function stHero(){
    const card=document.getElementById('summaryCard'); if(!card) return;
    stLoad();
    card.classList.add('is-starter');
    // як і звичайний банер (updateSummaryBg): без цього класу шапка стає на назву «Карта бажань»
    const topBar=document.querySelector('#scr-home .top'); if(topBar) topBar.classList.add('top-photobleed');
    let h=card.querySelector('.st-hero');
    if(!h){ h=document.createElement('div'); h.className='st-hero'; card.prepend(h); }
    const days=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
    h.innerHTML=`<div class="st-col">${ST_WISHES.map(w=>`<i class="st-ph st-${w.a}" ${stBg(w.a)}></i>`).join('')}</div>
      <span class="st-tag">приклад</span>
      <div class="st-hstat"><b>57<small>%</small></b><span>цього тижня · <b>4/7</b></span></div>
      <div class="st-week">${days.map((d,i)=>`<span class="${i<4?'on':''}"><em>${d}</em><i></i></span>`).join('')}</div>`;
    h.onclick=e=>{ e.stopPropagation(); stPick(); };
  }

  /* ── замість сітки папок ── */
  function starterRender(grid){
    stLoad();
    grid.classList.add('st-on');
    grid.innerHTML=`<div class="st-wrap">
      <div class="st-tiles">${ST_FOLDERS.map(f=>`<button class="st-tile" style="--c:${f.c}" data-stp>
        <i class="st-tbg" ${stBg(f.a)}></i><span class="st-veil"></span>
        <span class="st-em">${f.emoji}</span><b>${esc(f.name)}</b><small>${esc(f.stat)}</small></button>`).join('')}</div>
      <button class="st-jr" data-stp><span class="st-jr-ic">📖</span><span class="st-jr-t"><b>Журнал героя</b><small>4 з 7 днів у русі</small></span>
        <svg viewBox="0 0 40 16" aria-hidden="true"><path d="M2 13l8-5 7 3 9-8 12 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <button class="st-go" data-stp>✨ Зробити своїм</button>
      <button class="st-clean" data-stclean>Почати з чистого аркуша</button>
    </div>`;
    grid.querySelectorAll('[data-stp]').forEach(b=>b.onclick=stPick);
    grid.querySelector('[data-stclean]').onclick=()=>{
      try{ localStorage.setItem(ST_KEY,'off'); }catch(_){}
      stRefresh();
    };
    try{ const cb=document.getElementById('folderCountBadge'); if(cb) cb.textContent='0'; }catch(_){}
    stHero();
  }
  function stRefresh(){
    try{ renderDashboard(); }catch(_){}
    try{ updateSummaryBg(); }catch(_){}
  }

  /* ── шторка «Обери, що з цього — твоє» ── */
  function stPick(){
    const row=(kind,i,img,title)=>`<label class="st-pick"><input type="checkbox" data-${kind}="${i}" checked>
      <i class="st-pth" ${stBg(img)}></i><span>${esc(title)}</span></label>`;
    jnOverlay(`<div class="jn-ed-h"><b>Обери, що з цього — твоє</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Позначене стане твоїм: мрії з фото лягнуть у Карту бажань, папки — на Огляд. Цифри прикладу не переносяться — твій відлік почнеться з нуля. Назви й фото потім можна змінити.</small>
      <div class="st-pick-h">Мрії</div>${ST_WISHES.map((w,i)=>row('stw',i,w.a,w.cap)).join('')}
      <div class="st-pick-h">Папки</div>${ST_FOLDERS.map((f,i)=>row('stf',i,f.a,f.emoji+' '+f.name)).join('')}
      <div class="jn-ed-foot"><button class="jn-btn" data-stok>Готово</button></div>`, ov=>{
      ov.querySelector('[data-stok]').onclick=async()=>{
        const wi=[...ov.querySelectorAll('[data-stw]:checked')].map(x=>+x.dataset.stw);
        const fi=[...ov.querySelectorAll('[data-stf]:checked')].map(x=>+x.dataset.stf);
        if(!wi.length&&!fi.length){ plToast('Познач хоча б одне — або обери «Почати з чистого аркуша»'); return; }
        if(!stTrusted()){ plToast('Дані ще звіряються з хмарою — спробуй за хвилину'); return; }
        if(!window.STARTER_A){ plToast('Фото ще вантажаться — спробуй за мить'); stLoad(); return; }
        if(stBusy) return;
        stBusy=true;
        try{ await stMakeOwn(wi,fi); ov.remove(); }
        finally{ stBusy=false; }
      };
    });
  }
  /* фото — у PhotoDB під власним ключем (як pickWishPhoto / pickFolderPhoto), у даних лише
     посилання idb:. Без PhotoDB photoPut віддає сам data-URL — його в folders_cfg/wishes_board
     не кладемо (~250 КБ base64 у ключі, що синхронізується цілком): плитка лишиться без фото. */
  async function stPut(id,a){
    const u=stImg(a); if(!u) return '';
    try{ const ref=await window.photoPut(id,u); return String(ref).slice(0,4)==='idb:'?ref:''; }catch(_){ return ''; }
  }
  async function stMakeOwn(wi,fi){
    const t=Date.now();
    // спершу всі фото (тут await — за цей час load() міг замінити масиви), потім одним кроком у дані
    const nw=[], nf=[];
    for(const i of wi){
      const w=ST_WISHES[i], id='w'+t+'_'+i;
      nw.push({id, img:await stPut('wi_'+id,w.a), cap:w.cap, size:w.size});
    }
    for(const i of fi){
      const f=ST_FOLDERS[i], key='f_'+t+'_'+i;
      nf.push({ key, c:f.c, emoji:f.emoji, icon:folderIconFor(f.emoji), name:f.name, pct:0,
        photo:await stPut('ph_'+key,f.a), flayout:'a', pinned:false, custom:true, widgets:[] });
    }
    nw.forEach(w=>wishes.push(w));
    nf.forEach(f=>{ folders[f.key]=f; order.push(f.key); });
    // зроблено — набір більше не потрібен на цьому пристрої, навіть якщо все потім видалять
    try{ localStorage.setItem(ST_KEY,'done'); }catch(_){}
    if(fi.length) saveFolders();
    if(wi.length) saveWishes();
    try{ renderWishes(); }catch(_){}
    stRefresh();
    plToast('✨ Готово — тепер це твоє');
  }
