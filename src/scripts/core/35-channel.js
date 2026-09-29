  /* ============ ЧАТ (екран стрічки) ============
     До 21.09.2026 це був «Канал папки». Тепер стрічкою відкривається ЧАТ —
     окрема від папок сутність (реєстр і зв'язки — 36-chats.js): обкладинка →
     чипи прикріплених папок → записи за часом → рядок вводу, як у месенджері.

     Записи чату лежать у boards['chat_'+id] у форматі блоків документа
     (note/task/photo/…) з `at` (мс) і `by` (автор; поки завжди 'me', підсумок
     Флоу — 'flow'). Старим записам час відновлюємо з id — редактор зашиває в id
     Date.now() у base36 ('pg' + 8 символів). Що не датується — іде вгору під
     «Раніше». Записи, перенесені з тем колишньої папки «Вхідні», несуть `topic`.

     Тап по запису — шторка дій (редагувати, завдання, скопіювати в папку,
     видалити). Прикріплені папки відкриваються документом і повертають сюди. */
  let chKey=null;          // id відкритого чату
  let chTopic='all';       // 'all' | 'media' (лише фото чату)
  let chOrigin=null;       // звідки прийшли: {scr:'home'} | {scr:'page', key:папка}
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
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    folderPlus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 10v6M9 13h6"/></svg>',
    link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1"/><path d="M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H8l-4 3v-5.5A8 8 0 1 1 21 12z"/></svg>',
    close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
  };
  function chI(n){ return CH_I[n]||''; }
  function chToast(m){ try{ (window.__flowToast||function(){})(m); }catch(_){} }
  function chHaptic(k){ try{ window.platform.haptic(k||'light'); }catch(_){} }
  function chChat(){ return chKey?chatById(chKey):null; }
  function chBoardKey(){ return chKey?chatBk(chKey):''; }
  // куди лягає новий запис: у дошку чату (тем у чата нема)
  function chTargetBk(){ return chBoardKey(); }
  // прикріплені папки чату — лише ті, що існують
  function chFolders(){ const c=chChat(); return c?chatFolders(c):[]; }
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

  /* записи стрічки: блоки верхнього рівня дошки чату, за часом */
  function chItems(){
    const bk=chBoardKey(), out=[];
    (boards[bk]||[]).forEach((b,i)=>{ if(b) out.push({b,bk,at:chTimeOf(b),i}); });
    out.sort((a,b)=>(a.at-b.at)||(a.i-b.i));
    return out;
  }
  /* усі фото чату, включно з вкладеними — для режиму «Медіа» */
  function chPhotos(){
    const bk=chBoardKey(), out=[];
    const walk=(arr)=>{ (arr||[]).forEach(b=>{ if(!b) return;
      if(b.type==='photo'&&b.data) out.push({b,bk,at:chTimeOf(b)});
      if(Array.isArray(b.children)) walk(b.children); }); };
    walk(boards[bk]);
    out.sort((a,b)=>b.at-a.at);
    return out;
  }

  /* ── вхід ── */
  // відкрити чат; o.from: 'home' (типово) або 'page' з o.key — папка, куди повертає «назад»
  function goChat(id, o){
    const c=chatById(id); if(!c){ goHome(); return; }
    if(goChat._last!==id){ chTopic='all'; }
    goChat._last=id;
    chKey=id; chOrigin=(o&&o.from==='page'&&o.key)?{scr:'page',key:o.key}:{scr:'home'};
    currentFolderKey=null; spaceFromFolder=null; folderPath=[];
    boardKey=chBoardKey(); if(!boards[boardKey]) boards[boardKey]=[]; syncBlocks();
    chSetMode('note'); chToggleTray(false);
    renderChannel();
    show('scr-channel');
    chScrollBottom(false);
  }
  // сумісність зі старими викликами (читалка тощо): id чату — чат, ключ папки — документ
  function goChannel(key){
    if(chatById(key)){ goChat(key); return; }
    if(folders[key]){ goSpaceFor(key); return; }
    goHome();
  }
  function chBack(){
    const o=chOrigin||{}; chOrigin=null;
    if(o.scr==='page' && folders[o.key]){ currentFolderKey=o.key; goSpaceFor(o.key); return; }
    homeTab='chats'; try{ prefSet(HTAB_KEY,'chats'); }catch(_){}
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
    const c=chChat(); if(!c) return;
    if(chTopic!=='all'&&chTopic!=='media') chTopic='all';
    const scr=document.getElementById('scr-channel');
    scr.style.setProperty('--fc', c.c||'var(--accent)');
    renderChCover(); renderChChips(); renderChFeed();
  }

  /* ── обкладинка: той самий механізм, що й у документі (window.__pgCovers) ── */
  function chCoverApi(){ return window.__pgCovers||null; }
  // підпис під назвою: учасники · папки · записи (картки «прикріплено папку» не рахуємо)
  function chSubText(){
    const c=chChat(); if(!c) return '';
    const nf=chFolders().length, nr=chItems().filter(it=>it.b.type!=='flink').length, nm=(c.members||[]).length;
    return ['Чат', nm>1?(nm+' '+pluralUk(nm,'учасник','учасники','учасників')):'лише ти',
      nf?(nf+' '+pluralUk(nf,'папка','папки','папок')):'', nr?(nr+' '+pluralUk(nr,'запис','записи','записів')):''].filter(Boolean).join(' · ');
  }
  // оновити лише підпис — без перемальовування обкладинки (фото не блимає)
  function chSyncSub(){ const el=document.querySelector('#chCover .ch-sub'); if(el) el.textContent=chSubText(); }
  function renderChCover(){
    const c=chChat(), el=document.getElementById('chCover'); if(!c||!el) return;
    const api=chCoverApi(); const cov=api?api.get(chBoardKey()):null;
    let bg;
    if(cov&&cov.img) bg=`background-image:url('${cov.img}');background-size:cover;background-position:50% ${cov.pos==null?50:cov.pos}%;`;
    else if(cov&&api&&api.grads[cov.g||0]) bg='background:'+api.grads[cov.g||0]+';';
    else bg=`background:linear-gradient(160deg,color-mix(in srgb,${c.c} 60%,#0f1115),color-mix(in srgb,${c.c} 14%,var(--bg)));`;
    const em=(c.emoji&&c.emoji.trim())?c.emoji:esc((c.name||'?').trim().charAt(0).toUpperCase());
    const sub=chSubText();
    el.innerHTML=`<div class="ch-cov-bg" style="${bg}"></div>
      <div class="ch-cov-top">
        <button class="ch-ghost" id="chBack" aria-label="Назад">${chI('back')}</button>
        <span class="ch-sp"></span>
        <button class="ch-chip-photo" id="chPhotoBtn">${chI('camera')}<span>Фото</span></button>
        <button class="ch-ghost acc" id="chAdd" aria-label="Додати папку">${chI('plus')}</button>
        <button class="ch-ghost" id="chMore" aria-label="Ще дії">${chI('dots')}</button>
      </div>
      <div class="ch-cov-title"><span class="ch-av">${em}</span><div class="ch-cov-txt"><h1 data-i18n-skip="1">${esc(c.name)}</h1><div class="ch-sub">${sub}</div></div></div>`;
    el.querySelector('#chBack').onclick=chBack;
    el.querySelector('#chPhotoBtn').onclick=chCoverSheet;
    el.querySelector('#chAdd').onclick=()=>chatAddSheet(chKey);
    el.querySelector('#chMore').onclick=chMoreSheet;
  }
  function chCoverSheet(){
    const api=chCoverApi(); if(!api){ chToast('⚠️ Обкладинки недоступні'); return; }
    const cov=api.get(chBoardKey());
    const sw=api.grads.map((g,i)=>`<button class="ch-sw ${cov&&!cov.img&&(cov.g||0)===i?'on':''}" data-chgrad="${i}" style="background:${g}" aria-label="Градієнт ${i+1}"></button>`).join('');
    chSheet('Обкладинка чату',
      `<button class="ch-sheet-row" data-chcov="photo"><span class="ic">${chI('camera')}</span><span>Вибрати фото</span></button>
       <div class="ch-sw-row">${sw}</div>
       ${cov?`<button class="ch-sheet-row danger" data-chcov="clear"><span class="ic">${chI('trash')}</span><span>Прибрати обкладинку</span></button>`:''}`,
      (ov,close)=>{
        ov.querySelectorAll('[data-chgrad]').forEach(b=>b.onclick=()=>{ api.set(chBoardKey(),{g:+b.dataset.chgrad}); renderChCover(); chHaptic('select'); close(); });
        const ph=ov.querySelector('[data-chcov="photo"]'); if(ph) ph.onclick=()=>{ close(); chPickFile(f=>chShrink(f,1200,760,data=>{ const prev=api.get(chBoardKey())||{}; api.set(chBoardKey(),{img:data,pos:prev.pos==null?50:prev.pos,dark:prev.dark==null?30:prev.dark,h:prev.h||176}); renderChCover(); })); };
        const cl=ov.querySelector('[data-chcov="clear"]'); if(cl) cl.onclick=()=>{ api.clear(chBoardKey()); renderChCover(); close(); };
      });
  }
  function chMoreSheet(){
    const c=chChat(); if(!c) return;
    const media=chTopic==='media';
    chSheet('',
      `<button class="ch-sheet-row" data-chm="media"><span class="ic">${chI('image')}</span><span>${media?'Усі записи':'Медіа'}</span></button>
       <button class="ch-sheet-row" data-chm="folders"><span class="ic">${chI('folder')}</span><span>Папки чату</span></button>
       <button class="ch-sheet-row" data-chm="cover"><span class="ic">${chI('camera')}</span><span>Обкладинка</span></button>
       <button class="ch-sheet-row" data-chm="rename"><span class="ic">${chI('edit')}</span><span>Перейменувати</span></button>
       ${chKey!==INBOX_CHAT?`<button class="ch-sheet-row danger" data-chm="delete"><span class="ic">${chI('trash')}</span><span>Видалити чат</span></button>`:''}`,
      (ov,close)=>{
        ov.querySelector('[data-chm="media"]').onclick=()=>{ close(); chTopic=media?'all':'media'; chHaptic('select'); renderChChips(); renderChFeed(); chScrollBottom(false); };
        ov.querySelector('[data-chm="folders"]').onclick=()=>{ close(); setTimeout(()=>chatAddSheet(chKey),200); };
        ov.querySelector('[data-chm="cover"]').onclick=()=>{ close(); setTimeout(chCoverSheet,200); };
        ov.querySelector('[data-chm="rename"]').onclick=()=>{ close(); setTimeout(()=>chatRename(chKey),200); };
        const d=ov.querySelector('[data-chm="delete"]'); if(d) d.onclick=()=>{ close(); setTimeout(()=>chatDelete(chKey),200); };
      });
  }

  /* ── чипи: прикріплені папки чату (тап — документ папки, довгий тап — дії) ── */
  function renderChChips(){
    const host=document.getElementById('chChips'); if(!host) return;
    const fl=chFolders();
    let h='';
    if(chTopic==='media') h+=`<button class="ch-chip on" data-chall>${chI('back')}Усі записи</button>`;
    h+=`<span class="ch-lbl">Папки</span>`;
    fl.forEach(f=>{ h+=`<button class="ch-chip fold" data-chfold="${esc(f.key)}" data-i18n-skip="1"><span class="e">${esc(f.emoji||'📁')}</span>${esc(f.name)}</button>`; });
    h+=`<button class="ch-chip add" data-chadd aria-label="Додати папку">${chI('plus')}</button>`;
    host.innerHTML=h;
    const all=host.querySelector('[data-chall]'); if(all) all.onclick=()=>{ chTopic='all'; chHaptic('select'); renderChChips(); renderChFeed(); chScrollBottom(false); };
    host.querySelectorAll('[data-chfold]').forEach(b=>{
      b.onclick=()=>{ if(chLongPressed){ chLongPressed=false; return; } chOpenFolder(b.dataset.chfold); };
      chAttachLongPress(b,()=>chFolderChipSheet(b.dataset.chfold));
    });
    host.querySelector('[data-chadd]').onclick=()=>chatAddSheet(chKey);
  }
  // документ прикріпленої папки; «‹ Папки» в документі повертає в цей чат
  function chOpenFolder(fkey){
    if(!folders[fkey]) return;
    const id=chKey; currentFolderKey=fkey;
    goSpaceFor(fkey);
    window.__flowExitPage=function(){ goChat(id); };
  }
  function chFolderChipSheet(fkey){
    const f=folders[fkey]; if(!f) return;
    chSheet(esc(f.name),
      `<button class="ch-sheet-row" data-cf="open"><span class="ic">${chI('doc')}</span><span>Відкрити документ</span></button>
       <button class="ch-sheet-row danger" data-cf="unlink"><span class="ic">${chI('close')}</span><span>Відкріпити від чату</span></button>`,
      (ov,close)=>{
        ov.querySelector('[data-cf="open"]').onclick=()=>{ close(); chOpenFolder(fkey); };
        ov.querySelector('[data-cf="unlink"]').onclick=()=>{ close(); chatUnlinkFolder(chKey,fkey); };
      });
  }
  function chAttachLongPress(el,fn){
    let t=null;
    const start=()=>{ chLongPressed=false; t=setTimeout(()=>{ chLongPressed=true; chHaptic('medium'); fn(); },550); };
    const stop=()=>{ if(t){ clearTimeout(t); t=null; } };
    el.addEventListener('pointerdown',start);
    ['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,stop));
    el.addEventListener('contextmenu',e=>e.preventDefault());
  }

  /* ── стрічка ── */
  function renderChFeed(){
    const host=document.getElementById('chFeed'); if(!host) return;
    if(chTopic==='media'){
      const ph=chPhotos();
      host.innerHTML = ph.length
        ? `<div class="ch-media">${ph.map(p=>`<button class="ch-mi" data-chopen="${p.bk}|${p.b.id}"><img src="${p.b.data}" alt="" loading="lazy"></button>`).join('')}</div>`
        : `<div class="ch-empty"><b>Фото ще немає</b><span>Додай через «+» → Фото — і всі знімки чату збиратимуться тут.</span></div>`;
      chBindFeed(host); return;
    }
    const items=chItems();
    if(!items.length){
      host.innerHTML=`<div class="ch-empty"><b>Поки порожньо</b><span>Напиши перше повідомлення внизу — воно стане першим записом чату.</span></div>`;
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
    let tag=(b.topic&&b.topic.name) ? `<div class="ch-tag" style="--sc:${b.topic.color||'var(--accent)'}">${esc(b.topic.emoji||'')} ${esc(b.topic.name)}</div>` : '';
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
        : `<div class="ch-link-card"><span class="ch-lc-ic">🖼️</span><div><b>Фото</b><small>без зображення</small></div>${chI('chev')}</div>`;
    } else if(t==='flink'){
      // картка «прикріплено папку» — момент, коли це сталось; тап відкриває документ папки
      const f=folders[b.folder];
      body = f
        ? `<div class="ch-link-card" style="--sc:${f.c||'var(--fc)'}"><span class="ch-lc-ic">${esc(f.emoji||'📁')}</span><div><b data-i18n-skip="1">${esc(f.name)}</b><small>прикріплено папку · відкрити документ</small></div>${chI('chev')}</div>`
        : `<div class="ch-link-card"><span class="ch-lc-ic">📁</span><div><b>Папка</b><small>уже видалена</small></div></div>`;
    } else if(t==='page'||t==='group'){
      const n=(b.children||[]).length;
      body=`<div class="ch-link-card" style="--sc:${t==='page'?'#7c8cff':'#f0b429'}"><span class="ch-lc-ic">${esc(b.emoji||(t==='page'?'📄':'📁'))}</span><div><b>${esc(b.title||(t==='page'?'Сторінка':'Папка'))}</b><small>${t==='page'?'сторінка':'папка'}${n?' · '+n+' бл.':''}</small></div>${chI('chev')}</div>`;
    } else if(t==='link'){
      body=`<div class="ch-link-card"><span class="ch-lc-ic">🔗</span><div><b>${esc(b.label||b.title||b.url||'Посилання')}</b><small>${esc(b.url||'')}</small></div>${chI('chev')}</div>`;
    } else {
      body=`<div class="ch-link-card"><span class="ch-lc-ic">${esc(meta.emoji||'🧩')}</span><div><b>${esc(b.title||meta.title||t)}</b><small>${esc(meta.title||t)}</small></div>${chI('chev')}</div>`;
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
        else { const weekAgo=Date.now()-7*864e5; if(!items.some(it=>it.at>=weekAgo)) label='Підсумувати чат'; }
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
      const topic=(it.b.topic&&it.b.topic.name)?(' · '+it.b.topic.name):'';
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
    const c=chChat(); const fname=(c&&c.name)||'чат';
    const isWeek=col.mode==='week';
    const sys='Ти — уважний і чесний помічник, який підсумовує записи людини в її чаті «'+fname+'». '
      +'Тобі дають записи '+(isWeek?'за останній тиждень':'з усього чату')+' (від старіших до новіших): нотатки, завдання з позначкою виконано чи не виконано, підписи фото. '
      +'Напиши 3–5 коротких рядків: що сталось, що лишилось відкритим, і одну конкретну пораду на наступний тиждень — лише з того, що є в записах, без вигаданих фактів і цифр. '
      +'Українською, без вступних фраз, без заголовків і markdown.';
    const targetBk=chTargetBk(); // куди ляже підсумок, якщо натиснуть «У стрічку»
    let result='', done=false, closed=false;
    chAiBusy=true; chAiSync();
    const ov=chSheet(isWeek?'Підсумок тижня':'Підсумок чату',
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
          boards[targetBk].push({id:chUid(),type:'note',text:result,title:'',ai:true,at:Date.now(),by:'flow'});
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
      const [bk,id]=el.dataset.chopen.split('|');
      const b=(boards[bk]||[]).find(x=>x&&String(x.id)===id); if(!b) return;
      if(b.type==='flink'){ if(folders[b.folder]) chOpenFolder(b.folder); else chToast('Цю папку вже видалено'); return; }
      chRecordSheet(bk,b);
    });
  }
  // стрибок до бульбашки (глобальний пошук). false — блока в стрічці не видно
  // (вкладений або не з цієї папки), тоді той, хто кликав, відкриє документ.
  function chJumpTo(bk,id){
    const scr=document.getElementById('scr-channel');
    if(!chKey||!scr||!scr.classList.contains('active')) return false;
    if(bk!==chBoardKey()) return false;
    if(chTopic!=='all'){ chTopic='all'; renderChChips(); renderChFeed(); }
    const el=document.querySelector('#chFeed [data-chopen="'+bk+'|'+String(id).replace(/["\\]/g,'')+'"]');
    if(!el) return false;
    chFitFeed(); el.scrollIntoView({block:'center'});
    el.classList.add('ch-flash'); setTimeout(()=>el.classList.remove('ch-flash'),1600);
    return true;
  }
  /* ── шторка запису: чат — не документ, тож правки тут, а не в редакторі ── */
  function chRecordSheet(bk,b){
    const t=b.type||'note';
    const canText=(t==='note'||t==='quick'||t==='task'||t==='head'||t==='quote'||t==='photo');
    const fl=chFolders();
    chSheet(t==='photo'?'Фото':(t==='task'?'Завдання':'Запис'),
      `${canText?`<button class="ch-sheet-row" data-cr="edit"><span class="ic">${chI('edit')}</span><span>${t==='photo'?'Підпис':'Редагувати'}</span></button>`:''}
       ${(t==='note'||t==='quick')?`<button class="ch-sheet-row" data-cr="totask"><span class="ic">${chI('task')}</span><span>Зробити завданням</span></button>`:''}
       ${t==='task'?`<button class="ch-sheet-row" data-cr="tonote"><span class="ic">${chI('doc')}</span><span>Зробити нотаткою</span></button>`:''}
       <button class="ch-sheet-row" data-cr="copy"><span class="ic">${chI('copy')}</span><span>Скопіювати в папку${fl.length===1?' «'+esc(fl[0].name)+'»':'…'}</span></button>
       <button class="ch-sheet-row danger" data-cr="del"><span class="ic">${chI('trash')}</span><span>Видалити</span></button>`,
      (ov,close)=>{
        const q=s=>ov.querySelector(s);
        const e=q('[data-cr="edit"]'); if(e) e.onclick=()=>{ close(); setTimeout(()=>chEditRecord(bk,b),200); };
        const tt=q('[data-cr="totask"]'); if(tt) tt.onclick=()=>{ b.type='task'; b.title='Завдання'; if(b.done==null) b.done=false; saveBoard(); close(); renderChFeed(); chHaptic('light'); };
        const tn=q('[data-cr="tonote"]'); if(tn) tn.onclick=()=>{ b.type='note'; b.title=''; saveBoard(); close(); renderChFeed(); chHaptic('light'); };
        q('[data-cr="copy"]').onclick=()=>{ close(); if(fl.length===1) chCopyToFolder(b,fl[0].key); else setTimeout(()=>chPickCopyTarget(b),200); };
        q('[data-cr="del"]').onclick=()=>{ close(); chDeleteRecord(bk,b); };
      });
  }
  function chEditRecord(bk,b){
    const isPhoto=b.type==='photo';
    const cur=isPhoto?(b.title||''):(b.text!=null?b.text:(b.title||''));
    chSheet(isPhoto?'Підпис до фото':'Редагувати запис',
      `<textarea class="ch-edit" id="chEditTa" rows="4" placeholder="${isPhoto?'Підпис…':'Текст запису…'}"></textarea>
       <div class="ch-ai-acts"><button class="ch-ai-btn" data-ce="save">Зберегти</button><button class="ch-ai-btn ghost" data-ce="cancel">Скасувати</button></div>`,
      (ov,close)=>{
        const ta=ov.querySelector('#chEditTa'); ta.value=cur;
        setTimeout(()=>{ try{ ta.focus(); ta.setSelectionRange(ta.value.length,ta.value.length); }catch(_){} },60);
        ov.querySelector('[data-ce="cancel"]').onclick=close;
        ov.querySelector('[data-ce="save"]').onclick=()=>{
          const v=ta.value.replace(/\s+$/,'');
          if(isPhoto) b.title=v.trim();
          else if(b.text!=null||b.type==='note'||b.type==='task'||b.type==='quick') b.text=v;
          else b.title=v;
          b.edited=Date.now(); saveBoard(); if(boardKey===bk) syncBlocks();
          close(); renderChFeed(); chHaptic('light');
        };
      });
  }
  // копія запису → головна дошка папки (стане блоком документа); оригінал лишається в чаті
  function chCopyToFolder(b,fkey){
    const f=folders[fkey]; if(!f) return;
    if(!boards[fkey]) boards[fkey]=[];
    const copy=JSON.parse(JSON.stringify(b)); copy.id=chUid(); copy.at=Date.now(); delete copy.by; delete copy.topic;
    boards[fkey].push(copy); saveBoard();
    chHaptic('medium'); chToast('Скопійовано в «'+f.name+'»');
  }
  function chPickCopyTarget(b){
    const fl=chFolders(); const skip={fin:1,val:1,work:1,pat:1}; const vz=(typeof VISION_FKEY!=='undefined')?VISION_FKEY:'';
    const rest=orderedFolderKeys().filter(k=>folders[k]&&!skip[k]&&k!==vz&&!fl.some(f=>f.key===k));
    const row=k=>{ const f=folders[k]; return `<button class="ch-sheet-row" data-pick="${esc(k)}"><span class="ic e">${esc(f.emoji||'📁')}</span><span data-i18n-skip="1">${esc(f.name)}</span></button>`; };
    if(!fl.length&&!rest.length){ chToast('Папок ще нема'); return; }
    chSheet('Скопіювати в папку',
      `<div class="ch-pick">${fl.length?`<div class="ch-sheet-t">Папки чату</div>`+fl.map(f=>row(f.key)).join(''):''}${rest.length?`<div class="ch-sheet-t">Інші</div>`+rest.map(row).join(''):''}</div>`,
      (ov,close)=>{ ov.querySelectorAll('[data-pick]').forEach(x=>x.onclick=()=>{ close(); chCopyToFolder(b,x.dataset.pick); }); });
  }
  function chDeleteRecord(bk,b){
    confirmSheet({ title:'Видалити запис?', onOk:()=>{
      const arr=boards[bk]||[]; const i=arr.indexOf(b); if(i>=0) arr.splice(i,1);
      saveBoard(); if(boardKey===bk) syncBlocks();
      renderChFeed(); chHaptic('medium'); chSyncSub();
    }});
  }

  /* ── рядок вводу ── */
  function chInitComposer(){
    const comp=document.getElementById('chComposer'); if(!comp||comp.__init) return; comp.__init=true;
    comp.innerHTML=`
      <div class="ch-tray" id="chTray" hidden>
        <button data-chtray="photo"><i>${chI('image')}</i><span>Фото</span></button>
        <button data-chtray="task"><i>${chI('task')}</i><span>Завдання</span></button>
        <button data-chtray="voice"><i>${chI('mic')}</i><span>Голос</span></button>
        <button data-chtray="folder"><i>${chI('folder')}</i><span>Папка</span></button>
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
      if(a==='photo') chPickFile(f=>chShrink(f,1100,1100,data=>chPushBlock({id:chUid(),type:'photo',title:'',data,at:Date.now(),by:'me'})));
      else if(a==='task'){ chSetMode('task'); inp.focus(); }
      else if(a==='voice') chVoice();
      else if(a==='folder') chatAddSheet(chKey);
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
    renderChFeed(); chScrollBottom(true); chHaptic('light'); chSyncSub();
  }
  function chSend(){
    const inp=document.getElementById('chInput'); if(!inp) return;
    const raw=(inp.value||'').replace(/\s+$/,'');
    if(!raw.trim()) return;
    let text=raw, type=chMode;
    const m=/^\s*(\[\s?\]|-\s\[\s?\])\s+/.exec(raw); if(m){ type='task'; text=raw.slice(m[0].length); }
    const b = type==='task'
      ? {id:chUid(),type:'task',text:text.trim(),title:'Завдання',done:false,due:'',prio:'none',at:Date.now(),by:'me'}
      : {id:chUid(),type:'note',text:text.trim(),title:'',at:Date.now(),by:'me'};
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
    const c=chChat();
    ov.innerHTML=`<div class="ch-sheet" style="--fc:${(c&&c.c)||'var(--accent)'}"><div class="ch-grip"></div>${title?`<div class="ch-sheet-t">${title}</div>`:''}${rowsHtml}</div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    ov.addEventListener('click',e=>{ if(e.target===ov) close(); });
    bind(ov,close);
    return ov;
  }

  chInitComposer();
  try{ window.goChannel=goChannel; window.goChat=goChat; }catch(_){}
