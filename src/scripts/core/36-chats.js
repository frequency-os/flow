  /* ============ ЧАТИ (окремо від папок) ============
     Рішення 21.09.2026 (полотно «Чати і папки», раунд 3, модель 3): чат — окрема
     сутність зі своїм реєстром (ключ chats_v1): назва, емодзі, колір, учасники
     (поки лише 'me'), прикріплені папки. Записи чату лежать у ТОМУ САМОМУ сховищі
     дошок, що й документи (boards, ключ 'board'), під ключем 'chat_<id>', у форматі
     блоків стрічки (note/task/photo/…) плюс `by` — автор. Так екран стрічки
     (35-channel.js), синк і пошук працюють без переписування, а коли з'являться
     люди — міняється лише доставка записів між пристроями різних людей.

     Папка й чат — дві різні структури. Зв'язок зберігається один раз, у чата
     (folders[]); папка його лише читає (chatsForFolder) і показує блок «Чати папки»
     у документі. Прикріплення робить три речі: картка `flink` у стрічці (момент),
     чип під обкладинкою чату (постійно), рядок у блоці папки. */
  const CHATS_KEY='chats_v1';
  const INBOX_CHAT='inbox';        // «Вхідні» — перший чат (колишня папка f_inbox)
  const CHAT_PALETTE=['#5b8def','#34c77b','#e8843c','#c77dff','#ff6b9d','#4ecdc4','#f0b429','#9b8cff'];
  let chats=[];                    // [{id,name,emoji,c,members,folders,at,pinned}]

  /* вкладка Огляду: 'folders' | 'chats' — запам'ятовується як інші дрібні налаштування */
  const HTAB_KEY='hometab';
  let homeTab='folders';
  try{ if(localStorage.getItem(HTAB_KEY)==='chats') homeTab='chats'; }catch(_){}
  prefCatchup(HTAB_KEY, v=>{ homeTab = v==='chats' ? 'chats' : 'folders'; });

  function chatBk(id){ return 'chat_'+id; }
  function chatById(id){ return chats.find(c=>c&&c.id===id)||null; }
  function chatsForFolder(fkey){ return chats.filter(c=>Array.isArray(c.folders)&&c.folders.includes(fkey)); }
  // прикріплені папки чату — лише ті, що досі існують
  function chatFolders(c){ return ((c&&c.folders)||[]).filter(k=>folders[k]).map(k=>folders[k]); }
  function chatUid(){ return 'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5); }
  function normChat(c){
    return { id:String(c.id), name:String(c.name||'Чат'), emoji:String(c.emoji||'💬').slice(0,4), c:c.c||CHAT_PALETTE[0],
      members:(Array.isArray(c.members)&&c.members.length)?c.members:['me'],
      folders:Array.isArray(c.folders)?c.folders.filter(k=>typeof k==='string'):[],
      at:+c.at||0, pinned:!!c.pinned };
  }
  function saveChats(){
    try{ const p=window.storage.set(CHATS_KEY,JSON.stringify(chats),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
  }
  function applyChatsRaw(raw){
    try{ const p=raw?JSON.parse(raw):null; if(Array.isArray(p)) chats=p.filter(c=>c&&c.id).map(normChat); }
    catch(e){ console.error('chats parse',e); }
  }

  /* ── створення / перейменування / видалення ── */
  function chatCreate(o){
    o=o||{};
    const n=chats.length;
    const c={ id:o.id||chatUid(), name:(o.name||'').trim()||('Чат '+(n+1)),
      emoji:((o.emoji!=null?o.emoji:'💬')||'').trim().slice(0,4), c:o.c||CHAT_PALETTE[n%CHAT_PALETTE.length],
      members:['me'], folders:(o.folders||[]).filter(k=>folders[k]), at:Date.now(), pinned:false };
    chats.push(c);
    if(!boards[chatBk(c.id)]) boards[chatBk(c.id)]=[];
    saveChats(); saveBoard();
    return c;
  }
  // діалог «Новий чат»; o.folders — одразу прикріпити; o.then(chat) — що робити далі (типово — відкрити)
  function createChat(o){
    o=o||{};
    inputModal({ title:'Новий чат', placeholder:'Назва чату', emoji:true, emojiVal:'💬',
      onOk:(name,em)=>{
        const c=chatCreate({name, emoji:(em!==undefined?em:'💬'), folders:o.folders});
        try{ renderDashboard(); }catch(_){}
        if(o.then) o.then(c); else goChat(c.id,{from:'home'});
      }});
  }
  function chatRename(id){
    const c=chatById(id); if(!c) return;
    inputModal({ title:'Перейменувати чат', value:c.name, placeholder:'Назва чату', emoji:true, emojiVal:c.emoji||'',
      onOk:(name,em)=>{
        if(name) c.name=name;
        if(em!==undefined) c.emoji=((em||'').trim().slice(0,4))||'💬';
        saveChats(); chatsRefresh();
      }});
  }
  function chatDelete(id){
    const c=chatById(id); if(!c||id===INBOX_CHAT) return;
    const n=(boards[chatBk(id)]||[]).length;
    confirmSheet({ title:'Видалити чат «'+c.name+'»?',
      sub:(n?('Разом із '+n+' '+pluralUk(n,'записом','записами','записами')+'. '):'')+'Прикріплені папки лишаються.',
      onOk:()=>{
        chats=chats.filter(x=>x.id!==id); delete boards[chatBk(id)];
        try{ const api=window.__pgCovers; if(api) api.clear(chatBk(id)); }catch(_){}
        saveChats(); saveBoard();
        if(chKey===id){ chKey=null; homeTab='chats'; goHome(); }
        chatsRefresh();
      }});
  }
  // перемалювати все, що показує чати: Огляд, відкритий чат, блок у документі
  function chatsRefresh(){
    try{ renderDashboard(); }catch(_){}
    try{ const scr=document.getElementById('scr-channel'); if(scr&&scr.classList.contains('active')&&chKey) renderChannel(); }catch(_){}
    try{ renderPgLinks(); }catch(_){}
  }

  /* ── «Вхідні» ── */
  function ensureInboxChat(){
    let c=chatById(INBOX_CHAT);
    if(!c) c=chatCreate({id:INBOX_CHAT, name:'Вхідні', emoji:'📥', c:'#6a7dff'});
    if(!boards[chatBk(INBOX_CHAT)]) boards[chatBk(INBOX_CHAT)]=[];
    return c;
  }
  /* одноразова міграція: папка-Канал f_inbox → чат «Вхідні». Записи головної дошки
     і тем переїжджають у boards['chat_inbox'] (тема лишається підписом `topic`),
     обкладинка — теж, папка зникає зі списку папок. Прапорець локальний, як в інших
     міграціях; на другому пристрої дані вже прийдуть перенесеними — тоді нема що робити. */
  function chatsMigrateInboxOnce(){
    const FLAG='flowapp_inbox_chat_v1';
    try{ if(localStorage.getItem(FLAG)) return; }catch(_){ return; }
    const FK='f_inbox';
    const f=folders[FK];
    const srcKeys=Object.keys(boards||{}).filter(k=>k===FK||k.indexOf(FK+'__sp_')===0);
    const hasBlocks=srcKeys.some(k=>Array.isArray(boards[k])&&boards[k].length);
    if(f||hasBlocks){
      const c=ensureInboxChat();
      if(f){ if(f.name) c.name=f.name; if(f.emoji) c.emoji=f.emoji; if(f.c) c.c=f.c; }
      const dst=chatBk(INBOX_CHAT); if(!boards[dst]) boards[dst]=[];
      const sps=(typeof spacesMap!=='undefined'&&Array.isArray(spacesMap[FK]))?spacesMap[FK]:[];
      let n=0;
      srcKeys.forEach(k=>{
        const sid = k===FK ? 'main' : k.slice((FK+'__sp_').length);
        const sp = sid==='main' ? null : sps.find(s=>s&&s.id===sid);
        (boards[k]||[]).forEach(b=>{ if(!b) return;
          if(sp) b.topic={name:sp.name||'',emoji:sp.emoji||'',color:sp.color||''};
          if(!b.by) b.by='me';
          boards[dst].push(b); n++; });
        delete boards[k];
      });
      try{ const api=window.__pgCovers; const cov=api&&api.get(FK); if(cov){ api.set(dst,cov); api.clear(FK); } }catch(_){}
      if(f) delete folders[FK];
      for(let i=order.length-1;i>=0;i--){ if(order[i]===FK) order.splice(i,1); }
      try{ if(typeof spacesMap!=='undefined'){ delete spacesMap[FK]; delete activeSpaceMap[FK]; saveSpacesMeta(); } }catch(_){}
      try{ if(typeof folderWidgets!=='undefined'&&folderWidgets[FK]){ delete folderWidgets[FK]; saveFolderWidgets(); } }catch(_){}
      saveFolders({auto:true}); saveBoard(); saveChats();
      console.log('[Flow] «Вхідні»: папку перенесено в чат, записів:', n);
    }
    try{ localStorage.setItem(FLAG,'1'); }catch(_){}
  }

  /* ── зв'язок папка ↔ чат ── */
  function chatLinkFolder(cid, fkey, o){
    const c=chatById(cid); if(!c||!folders[fkey]) return false;
    if(c.folders.includes(fkey)) return true;
    c.folders.push(fkey);
    // картка в стрічці: момент, коли папку прикріпили (чип під обкладинкою — постійно)
    if(!(o&&o.silent)){ const bk=chatBk(cid); if(!boards[bk]) boards[bk]=[];
      boards[bk].push({ id:chUid(), type:'flink', folder:fkey, title:'', at:Date.now(), by:'me' }); }
    saveChats(); saveBoard(); chatsRefresh();
    return true;
  }
  function chatUnlinkFolder(cid, fkey){
    const c=chatById(cid); if(!c) return;
    c.folders=c.folders.filter(k=>k!==fkey); saveChats(); chatsRefresh();
  }
  // папки, які можна прикріпити (без спецпапок: Гроші, Цінності, Робота, Патерни, Бачення)
  function linkableFolders(cid){
    const c=chatById(cid); const skip={fin:1,val:1,work:1,pat:1};
    const vz=(typeof VISION_FKEY!=='undefined')?VISION_FKEY:'';
    return orderedFolderKeys().filter(k=>folders[k] && !skip[k] && k!==vz && !(c&&c.folders.includes(k)));
  }
  // шторка «+» у чаті: нова папка / прикріпити наявну / список прикріплених (з відкріпленням)
  function chatAddSheet(cid){
    const c=chatById(cid); if(!c) return;
    const fl=chatFolders(c);
    const cur = fl.length ? `<div class="ch-sheet-t">Прикріплені</div>`+fl.map(f=>
      `<div class="ch-sheet-row static"><span class="ic e">${esc(f.emoji||'📁')}</span><span class="grow" data-i18n-skip="1">${esc(f.name)}</span><button class="ch-x" data-unlink="${esc(f.key)}" aria-label="Відкріпити">${chI('close')}</button></div>`).join('') : '';
    chSheet('Додати в чат «'+esc(c.name)+'»',
      `<button class="ch-sheet-row" data-ca="newf"><span class="ic">${chI('folderPlus')}</span><span>Нова папка<small>Документ, прикріплений до цього чату</small></span></button>
       <button class="ch-sheet-row" data-ca="linkf"><span class="ic">${chI('link')}</span><span>Прикріпити наявну папку<small>Вибрати з усіх папок</small></span></button>
       ${cur}`,
      (ov,close)=>{
        ov.querySelector('[data-ca="newf"]').onclick=()=>{ close(); setTimeout(()=>newFolderForChat(cid),200); };
        ov.querySelector('[data-ca="linkf"]').onclick=()=>{ close(); setTimeout(()=>pickFolderForChat(cid),200); };
        ov.querySelectorAll('[data-unlink]').forEach(b=>b.onclick=()=>{ chatUnlinkFolder(cid,b.dataset.unlink); close(); setTimeout(()=>chatAddSheet(cid),200); });
      });
  }
  function newFolderForChat(cid){
    inputModal({ title:'Нова папка', placeholder:'Назва папки', emoji:true, emojiVal:'📁',
      onOk:(name,em)=>{
        const used=order.length, nm=name||('Папка '+(used+1)), key='f_'+Date.now();
        const e=(em!==undefined?em:FOLDER_EMOJIS[used%FOLDER_EMOJIS.length]);
        folders[key]={ key, c:FOLDER_COLORS[used%FOLDER_COLORS.length], emoji:e, icon:folderIconFor(e),
          name:nm, pct:0, photo:'', flayout:'a', pinned:false, custom:true, widgets:[] };
        order.push(key); saveFolders();
        chatLinkFolder(cid,key);
        chToast('Папку «'+nm+'» створено і прикріплено');
      }});
  }
  function pickFolderForChat(cid){
    const keys=linkableFolders(cid);
    if(!keys.length){ chToast(Object.keys(folders).length?'Усі папки вже прикріплені':'Папок ще нема'); return; }
    chSheet('Прикріпити папку',
      `<div class="ch-pick">${keys.map(k=>{ const f=folders[k];
        return `<button class="ch-sheet-row" data-pick="${esc(k)}"><span class="ic e">${esc(f.emoji||'📁')}</span><span data-i18n-skip="1">${esc(f.name)}</span></button>`; }).join('')}</div>`,
      (ov,close)=>{ ov.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{ close();
        if(chatLinkFolder(cid,b.dataset.pick)){ chHaptic('medium'); chToast('Прикріплено «'+folders[b.dataset.pick].name+'»'); } }); });
  }

  /* ── Огляд: вкладки і список чатів ── */
  function setHomeTab(t){
    t = t==='chats' ? 'chats' : 'folders';
    if(t===homeTab) return;
    homeTab=t; try{ prefSet(HTAB_KEY,t); }catch(_){}
    try{ window.platform.haptic('select'); }catch(_){}
    renderDashboard();
  }
  // викликається з renderDashboard (16-dashboard.js): перемикає видимість і лічильники.
  // true — активна вкладка «Чати», сітку папок малювати не треба.
  function chatsHomeSync(){
    const on = homeTab==='chats';
    const tabs=document.getElementById('homeTabs');
    if(tabs) tabs.querySelectorAll('[data-htab]').forEach(b=>b.classList.toggle('on', b.dataset.htab===(on?'chats':'folders')));
    const row=document.querySelector('#scr-home .foh-row'), list=document.getElementById('chatList'),
          seg=document.getElementById('folderViewSeg'), add=document.getElementById('chatAddBtn');
    if(row) row.style.display = on ? 'none' : '';
    if(list) list.hidden=!on;
    if(seg) seg.style.display = on ? 'none' : '';
    if(add) add.hidden=!on;
    try{ const cb=document.getElementById('chatCountBadge'); if(cb) cb.textContent=chats.length; }catch(_){}
    try{ const fb=document.getElementById('folderCountBadge'); if(fb) fb.textContent=topFolderKeys().filter(folderVisible).length; }catch(_){}
    if(on) renderChatList();
    return on;
  }
  // останній запис чату (за часом) — для рядка списку і блоку в документі
  function chatLast(c){
    const arr=boards[chatBk(c.id)]||[]; let best=null, bt=0;
    for(let i=arr.length-1;i>=0;i--){ const b=arr[i]; if(!b||b.type==='divider') continue;
      const t=chTimeOf(b); if(!best||t>bt){ best=b; bt=t; } }
    return best?{b:best,at:bt}:null;
  }
  function chatPreview(b){
    if(!b) return 'Поки порожньо';
    const t=b.type||'note', s=chTxt(b);
    if(t==='photo') return '📷 Фото'+(b.title?' · '+b.title:'');
    if(t==='task') return (b.done?'☑ ':'☐ ')+s;
    if(t==='flink'){ const f=folders[b.folder]; return '📁 Прикріплено «'+((f&&f.name)||'папку')+'»'; }
    if(b.ai) return '✦ Підсумок від Флоу';
    return s||b.title||'Запис';
  }
  function chatTimeLabel(t){
    if(!t) return '';
    const d=chDayLabel(t);
    if(d==='Сьогодні') return chHM(t);
    if(d==='Вчора') return 'вчора';
    return d;
  }
  function renderChatList(){
    const host=document.getElementById('chatList'); if(!host) return;
    const rows=chats.map(c=>({c,last:chatLast(c)}))
      .sort((a,b)=>((b.c.pinned?1:0)-(a.c.pinned?1:0)) || ((b.last?b.last.at:b.c.at)-(a.last?a.last.at:a.c.at)));
    let h='';
    if(!rows.length) h+=`<div class="chl-empty"><b>Чатів ще нема</b><span>Чат — стрічка як у месенджері: думки, завдання, фото за часом. До чату можна прикріпити папки.</span></div>`;
    rows.forEach(({c,last})=>{
      const fl=chatFolders(c);
      const pill = fl.length ? `<span class="chl-pill" data-i18n-skip="1">${esc(fl[0].emoji||'📁')} ${esc(fl[0].name)}${fl.length>1?' +'+(fl.length-1):''}</span>` : '';
      h+=`<button class="chl-row" data-chat="${esc(c.id)}" style="--cc:${c.c||'var(--accent)'}">
        <span class="chl-av">${esc(c.emoji||'💬')}</span>
        <span class="chl-body">
          <span class="chl-top"><b data-i18n-skip="1">${esc(c.name)}</b><small>${chatTimeLabel(last?last.at:0)}</small></span>
          <span class="chl-sub">${pill}<span class="chl-prev" data-i18n-skip="1">${esc(chatPreview(last&&last.b))}</span></span>
        </span></button>`;
    });
    h+=`<button class="chl-add" id="chatListAdd">${chI('plus')}<span>Новий чат</span></button>`;
    host.innerHTML=h;
    host.querySelectorAll('[data-chat]').forEach(b=>{
      b.onclick=()=>{ if(chLongPressed){ chLongPressed=false; return; } goChat(b.dataset.chat,{from:'home'}); };
      chAttachLongPress(b,()=>chatMenu(b.dataset.chat));
    });
    const add=host.querySelector('#chatListAdd'); if(add) add.onclick=()=>createChat();
    // котик-напарник плаває праворуч унизу: хай поступиться, якщо накрив рядок чи «Новий чат»
    try{ requestAnimationFrame(()=>{ if(typeof fcCheckOverlap==='function') fcCheckOverlap(); }); }catch(_){}
  }
  // довгий тап по рядку чату на Огляді
  function chatMenu(id){
    const c=chatById(id); if(!c) return;
    chSheet(esc(c.name),
      `<button class="ch-sheet-row" data-cm="rename"><span class="ic">${chI('edit')}</span><span>Перейменувати</span></button>
       <button class="ch-sheet-row" data-cm="folders"><span class="ic">${chI('folder')}</span><span>Папки чату${chatFolders(c).length?' · '+chatFolders(c).length:''}</span></button>
       ${id!==INBOX_CHAT?`<button class="ch-sheet-row danger" data-cm="delete"><span class="ic">${chI('trash')}</span><span>Видалити чат</span></button>`:''}`,
      (ov,close)=>{
        ov.querySelector('[data-cm="rename"]').onclick=()=>{ close(); setTimeout(()=>chatRename(id),200); };
        ov.querySelector('[data-cm="folders"]').onclick=()=>{ close(); setTimeout(()=>chatAddSheet(id),200); };
        const d=ov.querySelector('[data-cm="delete"]'); if(d) d.onclick=()=>{ close(); setTimeout(()=>chatDelete(id),200); };
      });
  }

  /* ── документ папки: «+» у шапці і блок «Чати папки» під назвою ── */
  function pgFolderKey(){ try{ const base=String(boardKey||'').split('__sp_')[0]; return folders[base]?base:''; }catch(_){ return ''; } }
  function renderPgLinks(){
    const host=document.getElementById('pgLinks'), add=document.getElementById('pgAddLink'); if(!host) return;
    const fk=pgFolderKey();
    if(!fk){ host.innerHTML=''; host.hidden=true; if(add) add.hidden=true; return; }
    if(add) add.hidden=false;
    const list=chatsForFolder(fk).map(c=>({c,last:chatLast(c)})).sort((a,b)=>(b.last?b.last.at:b.c.at)-(a.last?a.last.at:a.c.at));
    if(!list.length){ host.innerHTML=''; host.hidden=true; return; }
    host.hidden=false;
    host.innerHTML=`<div class="pgl-head"><span>💬</span>Чати папки · ${list.length}</div>`+list.map(({c,last})=>
      `<button class="pgl-row" data-pgchat="${esc(c.id)}" style="--cc:${c.c||'var(--accent)'}">
        <span class="pgl-av">${esc(c.emoji||'💬')}</span>
        <span class="pgl-body"><b data-i18n-skip="1">${esc(c.name)}</b><small data-i18n-skip="1">${esc(chatPreview(last&&last.b))}</small></span>
        <small class="pgl-time">${chatTimeLabel(last?last.at:0)}</small></button>`).join('');
    host.querySelectorAll('[data-pgchat]').forEach(b=>b.onclick=()=>goChat(b.dataset.pgchat,{from:'page',key:fk}));
  }
  function folderAddSheet(fk){
    const f=folders[fk]; if(!f) return;
    const linked=chatsForFolder(fk);
    const cur = linked.length ? `<div class="ch-sheet-t">Чати папки</div>`+linked.map(c=>
      `<div class="ch-sheet-row static"><span class="ic e">${esc(c.emoji||'💬')}</span><span class="grow" data-i18n-skip="1">${esc(c.name)}</span><button class="ch-x" data-unlink="${esc(c.id)}" aria-label="Відкріпити">${chI('close')}</button></div>`).join('') : '';
    chSheet('Додати в папку «'+esc(f.name)+'»',
      `<button class="ch-sheet-row" data-fa="newc"><span class="ic">${chI('chat')}</span><span>Новий чат<small>Стрічка, прикріплена до цієї папки</small></span></button>
       <button class="ch-sheet-row" data-fa="linkc"><span class="ic">${chI('link')}</span><span>Прикріпити наявний чат<small>Вибрати з усіх чатів</small></span></button>
       ${cur}`,
      (ov,close)=>{
        ov.querySelector('[data-fa="newc"]').onclick=()=>{ close(); setTimeout(()=>createChat({folders:[fk], then:(c)=>{ renderPgLinks(); goChat(c.id,{from:'page',key:fk}); }}),200); };
        ov.querySelector('[data-fa="linkc"]').onclick=()=>{ close(); setTimeout(()=>pickChatForFolder(fk),200); };
        ov.querySelectorAll('[data-unlink]').forEach(b=>b.onclick=()=>{ chatUnlinkFolder(b.dataset.unlink,fk); close(); setTimeout(()=>folderAddSheet(fk),200); });
      });
  }
  function pickChatForFolder(fk){
    const list=chats.filter(c=>!c.folders.includes(fk));
    if(!list.length){ chToast(chats.length?'Усі чати вже прикріплені':'Чатів ще нема — створи новий'); return; }
    chSheet('Прикріпити чат',
      `<div class="ch-pick">${list.map(c=>`<button class="ch-sheet-row" data-pick="${esc(c.id)}"><span class="ic e">${esc(c.emoji||'💬')}</span><span data-i18n-skip="1">${esc(c.name)}</span></button>`).join('')}</div>`,
      (ov,close)=>{ ov.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{ close();
        if(chatLinkFolder(b.dataset.pick,fk)){ chHaptic('medium'); chToast('Прикріплено «'+chatById(b.dataset.pick).name+'»'); } }); });
  }

  /* ── старт: викликає load() у 27-canvas.js, коли дані вже застосовано ── */
  function chatsInit(){
    const tabs=document.getElementById('homeTabs');
    if(tabs&&!tabs.__init){ tabs.__init=true; tabs.querySelectorAll('[data-htab]').forEach(b=>b.onclick=()=>setHomeTab(b.dataset.htab)); }
    const add=document.getElementById('chatAddBtn'); if(add&&!add.__init){ add.__init=true; add.onclick=()=>createChat(); }
    const pa=document.getElementById('pgAddLink'); if(pa&&!pa.__init){ pa.__init=true; pa.onclick=()=>{ const fk=pgFolderKey(); if(fk) folderAddSheet(fk); }; }
    // блок «Чати папки» малюється при кожному відкритті документа
    if(typeof window.openFlowPage==='function' && !window.openFlowPage.__chats){
      const orig=window.openFlowPage;
      const wrapped=function(opts){ orig(opts); try{ renderPgLinks(); }catch(e){ console.error('pgLinks',e); } };
      wrapped.__chats=true; window.openFlowPage=wrapped;
    }
  }
  try{ window.createChat=createChat; window.chatsForFolder=chatsForFolder; }catch(_){}
