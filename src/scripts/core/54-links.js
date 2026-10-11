  /* ════════ «Звʼязки папки» (10.10.2026, макети: телефон — шторка «Звʼязки папки», ноутбук — права панель №8) ════════
     Одне місце, де видно все, що привʼязано до папки: Місія · Звичка · Час · Календар · Гроші · Чати.
     Лише читає те, що вже позначено папкою (goal.folderKey, трекер місії в папці, блок Планера .folder,
     подія календаря .folder, op.folderKey, chat.folders). Формат даних не змінюється.
     Перемикач «показати в папці» додає / прибирає віджет цього звʼязку в дошці віджетів папки (boards[fk]) —
     лише тапом людини, зі «Скасувати». Привʼязати місію = поставити їй folderKey (як у редакторі місії). */
  const LK_W={mission:'dmission', habit:'dhabit', time:'dtime', cal:'dcal'};   // звʼязок → віджет у папці
  // дошка, яку зараз видно: сторінка теми папки (fk__sp_x) має свою — інакше boards[fk]
  function lkKey(fk){ try{ if(typeof boardKey==='string'&&boardKey.split('__sp_')[0]===fk) return boardKey; }catch(_){} return fk; }
  function lkBoard(fk){ const k=lkKey(fk); return Array.isArray(boards[k])?boards[k]:[]; }
  function lkWboard(fk){ return lkBoard(fk).find(x=>x&&x.type==='board'&&x.wboard&&Array.isArray(x.children))||null; }
  function lkShown(fk,k){ const t=LK_W[k]; if(!t) return false;
    // лише сама сторінка і її дошки — вкладені сторінки й групи не чіпаємо
    return lkBoard(fk).some(x=>x&&(x.type===t||(x.type==='board'&&Array.isArray(x.children)&&x.children.some(y=>y&&y.type===t)))); }
  function lkRows(fk){
    const rows=[], td=ymdLocal();
    let g=null; try{ g=wgFolderMission(fk); }catch(_){}
    rows.push({k:'mission', ic:'🎯', t:'Місія', v:g?esc(String(g.name||'Місія').slice(0,40))+' · '+jnPct(g)+'%':'не привʼязано', on:!!g, act:g?'Відкрити':'＋ Привʼязати'});
    let tr=null; try{ tr=g&&moOwnFolder(g.folderKey)?moTracker(g.folderKey):null; }catch(_){}
    let st=0; if(tr){ const d=new Date(); if(!moMarked(tr,ymdLocal(d))) d.setDate(d.getDate()-1); for(let i=0;i<400&&moMarked(tr,ymdLocal(d));i++){ st++; d.setDate(d.getDate()-1); } }
    rows.push({k:'habit', ic:'🔥', t:'Звичка', v:tr?'трекер місії · '+st+' '+pluralUk(st,'день','дні','днів')+' поспіль':g?'у папці місії ще нема трекера':'спершу привʼяжи місію', on:!!tr, act:tr?'':g?'＋ Трекер':''});
    let bl=[]; try{ bl=plBlocksDisplay(td).filter(b=>b&&b.folder===fk); }catch(_){}
    const h=bl.reduce((s,b)=>s+Math.max(0,Math.min(plBlockEnd(b),24)-(+b.h||0)),0);
    rows.push({k:'time', ic:'⏱', t:'Час', v:bl.length?'блоки Планера з міткою папки · '+bl.length+' сьогодні · '+String(Math.round(h*10)/10).replace('.',',')+' год':'сьогодні блоків папки нема', on:bl.length>0, act:'＋ Блок'});
    let ev=0; try{ for(let i=0;i<31;i++){ const d=new Date(); d.setDate(d.getDate()+i); ev+=calEventsOn(ymdLocal(d),fk).length; } }catch(_){}
    rows.push({k:'cal', ic:'📅', t:'Календар', v:ev?'подій папки за місяць · '+ev:'подій папки нема', on:ev>0, act:'★ Подія'});
    let m=null; try{ const d=pgHubData(fk); m=d.money; }catch(_){}
    rows.push({k:'money', ic:'💳', t:'Гроші', v:m==null?'записів з міткою папки цього місяця нема':((m>0?'+':m<0?'−':'')+esc(moneyK(Math.abs(m)))+' за місяць'), on:m!=null, act:'Відкрити'});
    let ch=0; try{ ch=chatsForFolder(fk).length; }catch(_){}
    rows.push({k:'chats', ic:'💬', t:'Чати', v:ch?ch+' '+pluralUk(ch,'чат','чати','чатів'):'не привʼязано', on:ch>0, act:ch?'Відкрити':'＋ Привʼязати'});
    return rows;
  }
  function lkHTML(fk,panel){
    const f=folders[fk]; if(!f) return '';
    return `<div class="lk${panel?' panel':''}">
      ${panel?`<div class="lk-h"><b>Звʼязки</b><small data-i18n-skip="1">${esc(String(f.name||'Папка').slice(0,24))}</small></div>`:''}
      ${lkRows(fk).map(r=>{ const w=LK_W[r.k], sh=w?lkShown(fk,r.k):false;
        return `<div class="lk-r${r.on?'':' off'}"><button class="lk-m" data-lk="${r.k}"><span class="lk-ic">${r.ic}</span><span class="lk-tx"><b>${r.t}</b><small>${r.v}</small></span>${r.act?`<span class="lk-act">${r.act}</span>`:''}</button>
          ${w?`<button class="lk-tg${sh?' on':''}" data-lktg="${r.k}" role="switch" aria-checked="${sh}" aria-label="Показати віджет «${r.t}» у папці"><i></i></button>`:''}</div>`; }).join('')}
      <small class="lk-hint">Перемикач — показати віджет у папці. Тап по рядку — відкрити або привʼязати.</small></div>`;
  }
  function lkRefresh(fk){
    try{ if(typeof window.__pgRender==='function') window.__pgRender(); }catch(_){}
    try{ renderPgLinks(); }catch(_){} try{ wgRefresh(); }catch(_){} try{ lkAsideSync(); }catch(_){}
  }
  // дія рядка: відкрити те місце, де цим керують (ті самі шторки, що й хаб)
  function lkOpen(fk,k,after){
    const g=(()=>{ try{ return wgFolderMission(fk); }catch(_){ return null; } })();
    if(k==='mission'){ if(g) moMissionPage(g,'path'); else lkPickMission(fk,after); }
    else if(k==='habit'){ if(g&&moOwnFolder(g.folderKey)&&!moTracker(g.folderKey)){ if(moAddTracker(g.folderKey,g)){ plToast('Трекер додано в папку'); if(after) after(); } } else if(g) moMissionPage(g,'folder'); }
    else if(k==='time') plFolderAddBlock(fk);
    else if(k==='cal') calEventSheet(ymdLocal(),'',after,fk);
    else if(k==='money') wlFolderSheet(fk);
    else if(k==='chats') folderAddSheet(fk);
  }
  // привʼязати місію без папки до цієї папки — так само, як «Папка місії» в редакторі місії
  function lkPickMission(fk,after){
    // лише місії зовсім без папки: folderKey на ще не завантажену папку — теж звʼязок, його не затираємо
    const free=(goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)!=='archive'&&!g.folderKey);
    if(!free.length){ plToast('Усі місії вже мають папку — зміни її на сторінці місії'); return; }
    jnOverlay(`<div class="jn-ed-h"><b>Привʼязати місію</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Місія житиме в цій папці: трекер, нотатки й віджети беруть її звідси.</small>
      <div class="wd-pick">${free.map(g=>`<button data-lkg="${esc(g.id)}" style="--fc:${safeColor(g.color,'#7c8cff')}"><span>${safeEmoji(g.emoji,'🎯')}</span><b>${esc(String(g.name||'Місія').slice(0,40))}</b><small>${jnPct(g)}%</small></button>`).join('')}</div>`, ov=>{
      ov.querySelectorAll('[data-lkg]').forEach(b=>b.onclick=()=>{
        const g=(goalsData.goals||[]).find(x=>x&&String(x.id)===String(b.dataset.lkg)); if(!g||!moOwnFolder(fk)) return;
        if(g.folderKey){ ov.remove(); return; }   // поки шторка була відкрита, місія вже отримала папку
        g.folderKey=fk; saveGoals(); ov.remove(); plToast('Місію привʼязано до папки'); lkRefresh(fk); if(after) after();
      });
    });
  }
  // перемикач «показати в папці»: увімкнути — віджет у дошку віджетів (нема — нова дошка зверху); вимкнути — прибрати зі «Скасувати»
  function lkToggle(fk,k){
    const t=LK_W[k]; if(!t||!moOwnFolder(fk)) return;
    const key=lkKey(fk); if(!Array.isArray(boards[key])) boards[key]=[];
    const top=boards[key];
    if(lkShown(fk,k)){
      const removed=[];
      const strip=(arr,deep)=>{ for(let i=arr.length-1;i>=0;i--){ const x=arr[i]; if(!x) continue; if(x.type===t){ removed.push({arr,i,x}); arr.splice(i,1); } else if(deep&&x.type==='board'&&Array.isArray(x.children)) strip(x.children,false); } };
      strip(top,true); saveBoard(); lkRefresh(fk);
      try{ flowUndoToast('Віджет прибрано з папки — дані лишились',()=>{ removed.reverse().forEach(r=>{ if(!r.arr.some(y=>y&&y.id===r.x.id)) r.arr.splice(Math.min(r.i,r.arr.length),0,r.x); }); saveBoard(); lkRefresh(fk); }); }catch(_){}
    } else {
      let wb=lkWboard(fk);
      if(!wb){ wb={id:'wb'+Date.now().toString(36), type:'board', wboard:true, children:[]}; top.unshift(wb); }
      wb.children.push(wdInit({id:'w'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)},t));
      saveBoard(); lkRefresh(fk); plToast('Віджет додано в папку');
    }
  }
  function lkBind(root,fk,redraw){
    root.querySelectorAll('[data-lk]').forEach(b=>b.onclick=()=>lkOpen(fk,b.dataset.lk,redraw));
    root.querySelectorAll('[data-lktg]').forEach(b=>b.onclick=()=>{ lkToggle(fk,b.dataset.lktg); if(redraw) redraw(); });
  }
  // телефон: шторка
  function lkSheet(fk){
    if(!moOwnFolder(fk)) return;
    const f=folders[fk];
    jnOverlay(`<div class="jn-ed-h"><b>Звʼязки · ${esc(String(f.name||'Папка').slice(0,24))}</b><button data-jnx aria-label="Закрити">✕</button></div><div data-lkbody>${lkHTML(fk,false)}</div>`, ov=>{
      ov.classList.add('lk-ov');
      const redraw=()=>{ if(!ov.isConnected) return; const b=ov.querySelector('[data-lkbody]'); b.innerHTML=lkHTML(fk,false); lkBind(b,fk,redraw); };
      lkBind(ov,fk,redraw);
    });
  }
  /* ноутбук (≥1180px): та сама панель праворуч від документа папки (макет №8) */
  function lkAsideSync(){
    const scr=document.getElementById('scr-page'); if(!scr) return;
    let fk=''; try{ fk=pgFolderKey(); }catch(_){}
    let a=document.getElementById('lkAside');
    const wide=window.innerWidth>=1180&&scr.classList.contains('active')&&fk&&moOwnFolder(fk);
    if(!wide){ if(a) a.remove(); scr.classList.remove('lk-has'); return; }
    if(!a){ a=document.createElement('aside'); a.id='lkAside'; a.setAttribute('aria-label','Звʼязки папки'); scr.appendChild(a); }
    scr.classList.add('lk-has');
    a.innerHTML=lkPanelHTML(fk); lkBind(a,fk,lkAsideSync);
    { const c=a.querySelector('[data-lkcfg]'); if(c) c.onclick=()=>lkSheet(fk); }
  }
  try{ window.addEventListener('resize',()=>{ clearTimeout(window.__lkRz); window.__lkRz=setTimeout(lkAsideSync,150); }); }catch(_){}

  /* ── ноутбук: картки з вмістом, як макет №8 (Гроші · Час сьогодні · Місія · Календар · Чати).
     Лише показ; тап по картці — та сама дія, що й у шторці; ⚙ — шторка з перемикачами «показати в папці». ── */
  function lkPanelHTML(fk){
    const f=folders[fk]; if(!f) return '';
    const td=ymdLocal(), card=(k,ic,t,body,act)=>`<button class="lkc" data-lk="${k}"><span class="lkc-h"><span>${ic}</span><b>${t}</b>${act?`<em>${act}</em>`:'<em>›</em>'}</span>${body}</button>`;
    // Гроші місяця з міткою папки
    let inc=0,out=0,has=false;
    try{ wlMonthOps(wlYm()).filter(o=>String(o.folderKey||'')===String(fk)).filter(opMain).forEach(o=>{ has=true; if(_isRealIncome(o)) inc+=(+o.amount||0); else if(_isRealExpense(o)) out+=(+o.amount||0); }); }catch(_){}
    const tot=inc+out, money=has?`<span class="lkc-money"><span><b class="in">+${esc(moneyK(inc))}</b><small>дохід</small></span><span><b class="out">−${esc(moneyK(out))}</b><small>витрати</small></span></span>
      <span class="lkc-bar"><i style="width:${tot?Math.round(inc/tot*100):0}%"></i></span>`:'<small class="lkc-none">Записів з міткою папки цього місяця нема</small>';
    // Час сьогодні
    let bl=[]; try{ bl=plBlocksDisplay(td).filter(b=>b&&b.folder===fk).sort((a,c)=>(+a.h||0)-(+c.h||0)); }catch(_){}
    const time=bl.length?`<span class="lkc-list">${bl.slice(0,4).map(b=>`<span class="${b.done?'done':''}"><em>${plHM(+b.h||0)}</em><span>${esc(String(b.t||'Блок').slice(0,34))}</span>${typeof subBadge==='function'&&subBadge(b)?`<small>${subBadge(b)}</small>`:''}</span>`).join('')}</span>`:'<small class="lkc-none">Сьогодні блоків папки нема</small>';
    // Місія
    let g=null; try{ g=wgFolderMission(fk); }catch(_){}
    let nx=null; try{ nx=g?wdNext(g):null; }catch(_){}
    const mis=g?`<span class="lkc-mis">${wdRing(jnPct(g))}<span><b>${safeEmoji(g.emoji,'🎯')} ${esc(String(g.name||'Місія').slice(0,40))}</b><small>${nx?'Далі: '+esc(nx.t.slice(0,60)):'усі кроки зроблено ✓'}</small></span></span>`:'<small class="lkc-none">Місію не привʼязано</small>';
    // Календар: найближчі події папки за 30 днів
    const evs=[]; try{ for(let i=0;i<30&&evs.length<3;i++){ const d=new Date(); d.setDate(d.getDate()+i); const ds=ymdLocal(d); calEventsOn(ds,fk).forEach(e=>{ if(evs.length<3) evs.push({ds,e}); }); } }catch(_){}
    const cal=evs.length?`<span class="lkc-list">${evs.map(x=>`<span><em>${x.ds===td?'сьогодні':esc(jnDateTxt(x.ds))}</em><span>★ ${esc(String(x.e.t||'Подія').slice(0,34))}</span></span>`).join('')}</span>`:'<small class="lkc-none">Подій папки найближчим часом нема</small>';
    // Чати
    let chs=[]; try{ chs=chatsForFolder(fk).slice(0,3); }catch(_){}
    const ch=chs.length?`<span class="lkc-list">${chs.map(c=>{ let p=''; try{ const l=chatLast(c); p=l?chatPreview(l.b):''; }catch(_){} return `<span><em>${esc(c.emoji||'💬')}</em><span>${esc(String(c.name||'Чат').slice(0,30))}${p?` · <small data-i18n-skip="1">${esc(String(p).slice(0,40))}</small>`:''}</span></span>`; }).join('')}</span>`:'<small class="lkc-none">Чатів не привʼязано</small>';
    return `<div class="lk panel"><div class="lk-h"><b>Звʼязки</b><button class="lk-cfg" data-lkcfg aria-label="Що показувати в папці">⚙</button></div>
      ${card('money','💳','Гроші',money,has?'':'Відкрити')}
      ${card('time','⏱','Час · сьогодні',time,'＋ блок')}
      ${card('mission','🎯','Місія',mis,g?'':'＋ Привʼязати')}
      ${card('cal','📅','Календар',cal,'★ Подія')}
      ${card('chats','💬','Чати',ch,chs.length?'':'＋ Привʼязати')}</div>`;
  }

  /* ════════ «Стрічка папки» (нічний макет №3, 10.10.2026): перемикач «Документ · Стрічка» над документом.
     Стрічка — усе, що сталось у папці за 30 днів, по днях: записи Гаманця, виконані блоки Планера, позначки звички,
     події календаря, повідомлення привʼязаних чатів, нові записи документа. Лише читання; режим — у памʼяті. ── */
  const lkView={};   // fk → 'doc' | 'feed' (не зберігається)
  function lkFeedItems(fk){
    const out=[], td=ymdLocal(), from=(()=>{ const d=new Date(); d.setDate(d.getDate()-30); return ymdLocal(d); })();
    const add=(ds,t,ic,title,sub,cls)=>{ if(/^\d{4}-\d{2}-\d{2}$/.test(ds||'')&&ds>=from&&ds<=td) out.push({ds,t:+t||0,ic,title,sub:sub||'',cls:cls||''}); };
    const dsOf=ms=>{ const d=new Date(ms); return isNaN(d)?'':ymdLocal(d); };
    try{ (finOps||[]).forEach(o=>{ if(!o||String(o.folderKey||'')!==String(fk)) return; const inc=o.type==='in';
      add(String(o.date||''),0,inc?'＋':'−',(inc?'+':'−')+money(+o.amount||0,o.cur||undefined),o.label||(inc?'Дохід':'Витрата'),inc?'in':'out'); }); }catch(_){}
    try{ for(let i=0;i<=30;i++){ const d=new Date(); d.setDate(d.getDate()-i); const ds=ymdLocal(d);
      plBlocksDisplay(ds).forEach(b=>{ if(b&&b.done&&b.folder===fk){ const h=Math.max(0,Math.min(plBlockEnd(b),24)-(+b.h||0));
        add(ds,(+b.h||0)*3600e3,'⏱','Блок виконано · '+String(b.t||'Блок'),plHM(+b.h||0)+' · '+String(Math.round(h*10)/10).replace('.',',')+' год','done'); } });
      calEventsOn(ds,fk).forEach(e=>add(ds,1,'★',String(e.t||'Подія'),'подія календаря','ev')); } }catch(_){}
    try{ const g=wgFolderMission(fk), tr=g&&moOwnFolder(g.folderKey)?moTracker(g.folderKey):null;
      if(tr) Object.keys(tr.marks||{}).forEach(ds=>{ if(moMarked(tr,ds)) add(ds,2,'🔥','Звичку відмічено',String(g.name||'Місія'),'hab'); }); }catch(_){}
    try{ chatsForFolder(fk).forEach(c=>{ (boards[chatBk(c.id)]||[]).forEach(b=>{ if(!b||b.type==='divider') return; const t=chTimeOf(b); if(!t) return;
      add(dsOf(t),t,'💬',String(c.name||'Чат'),chatPreview(b),'chat'); }); }); }catch(_){}
    try{ (Array.isArray(boards[fk])?boards[fk]:[]).forEach(b=>{ if(!b||!/^(note|task|h1|h2|h3|bullet|num)$/.test(b.type)) return; const t=chTimeOf(b), tx=String(txtPlain(b)).trim(); if(!t||!tx) return;
      add(dsOf(t),t,b.type==='task'?(b.done?'☑':'☐'):'📝',b.type==='task'?(b.done?'Завдання виконано':'Нове завдання'):'Запис у документі',tx,'doc'); }); }catch(_){}
    return out.sort((a,b)=>a.ds<b.ds?1:a.ds>b.ds?-1:b.t-a.t).slice(0,80);
  }
  function txtPlain(b){ try{ return chTxt(b); }catch(_){ return String(b.text||b.title||''); } }
  function lkFeedHTML(fk){
    const items=lkFeedItems(fk), td=ymdLocal();
    if(!items.length) return `<div class="lkf"><div class="dy-empty"><b>Стрічка поки порожня</b><span>Тут зʼявиться все, що відбувається з папкою: блоки Планера, гроші, звичка, події, чати й нові записи.</span></div></div>`;
    let h='<div class="lkf">', cur='';
    items.forEach(x=>{ if(x.ds!==cur){ cur=x.ds; h+=`<div class="lkf-day">${x.ds===td?'Сьогодні':esc(dyDayTitle(x.ds))}</div>`; }
      h+=`<div class="lkf-it ${x.cls}"><span class="lkf-ic">${esc(x.ic)}</span><span class="lkf-tx"><b data-i18n-skip="1">${esc(String(x.title).slice(0,80))}</b>${x.sub?`<small data-i18n-skip="1">${esc(String(x.sub).slice(0,120))}</small>`:''}</span></div>`; });
    return h+'</div>';
  }
  function lkSegHTML(fk){ const v=lkView[fk]==='feed'?'feed':'doc';
    return `<div class="lkv-seg" role="tablist" aria-label="Вигляд папки"><button role="tab" data-lkview="doc" aria-selected="${v==='doc'}" class="${v==='doc'?'on':''}">Документ</button><button role="tab" data-lkview="feed" aria-selected="${v==='feed'}" class="${v==='feed'?'on':''}">Стрічка</button></div>`; }
  // показати / сховати документ і стрічку; викликається з renderPgLinks
  function lkViewApply(fk){
    const scr=document.getElementById('scr-page'); if(!scr) return;
    const ed=document.getElementById('pgEditor'), host=document.getElementById('pgLinks');
    let feed=document.getElementById('lkFeed');
    const on=!!fk&&lkView[fk]==='feed';
    scr.classList.toggle('lk-feedmode',on);
    if(!on){ if(feed) feed.remove(); if(ed) ed.hidden=false; return; }
    if(!feed){ feed=document.createElement('div'); feed.id='lkFeed'; if(host&&host.parentNode) host.parentNode.insertBefore(feed,host.nextSibling); else scr.appendChild(feed); }
    feed.innerHTML=lkFeedHTML(fk); if(ed) ed.hidden=true;
  }
  function lkSegBind(root,fk){
    root.querySelectorAll('[data-lkview]').forEach(b=>b.onclick=()=>{ lkView[fk]=b.dataset.lkview; try{ renderPgLinks(); }catch(_){} });
  }

  /* ════════ Дерево папок у бічному меню ноутбука (нічний макет №8) ════════
     Під пунктом «Папки»: папки верхнього рівня, групи розгортаються (Фінанси → YouTube…), відкрита папка підсвічена.
     Лише читає folders/order; тап — та сама навігація, що й на Огляді. Розгорнуті групи — у памʼяті. */
  const dsbOpen=Object.create(null);
  // дерево під «Папки» можна згорнути (стрілка ˅); вибір — на пристрої (зручність вигляду, не дані)
  let dsbTreeHidden=false; try{ dsbTreeHidden=localStorage.getItem('dsbTreeHidden')==='1'; }catch(_){}   // без прототипу: ключ папки «constructor» не вдаватиме розгорнуту групу
  function dsbTreeHTML(){
    let cur=''; try{ const s=document.getElementById('scr-page'); if(s&&s.classList.contains('active')) cur=pgFolderKey()||''; }catch(_){}
    const vis=k=>folders[k]&&(typeof folderVisible!=='function'||folderVisible(k))&&folders[k].role!=='project';
    let tops=[]; try{ tops=topFolderKeys().filter(vis); }catch(_){ return ''; }
    if(!tops.length) return '';
    const row=(k,lvl)=>{ const f=folders[k], kids=childFolderKeys(k).filter(vis), open=!!dsbOpen[k]||(cur&&kids.includes(cur));
      return `<div class="dsbt-r${k===cur?' on':''}" style="--lvl:${lvl}">
        ${kids.length?`<button class="dsbt-tw${open?' open':''}" data-dsbtw="${esc(k)}" aria-label="${open?'Згорнути':'Розгорнути'} «${esc(String(f.name||'Папка').slice(0,30))}»" aria-expanded="${open}">›</button>`:'<span class="dsbt-tw sp"></span>'}
        <button class="dsbt-b" data-dsbt="${esc(k)}" style="--c:${safeColor(f.c,'#6a7dff')}"><span class="dsbt-ic"><svg class="ico" aria-hidden="true"><use href="#${esc(folderIcon(f))}"/></svg></span><span class="dsbt-n" data-i18n-skip="1">${esc(String(f.name||'Папка').slice(0,40))}</span></button></div>`
        +(kids.length&&open&&lvl<2?kids.map(ck=>row(ck,lvl+1)).join(''):''); };
    return tops.slice(0,40).map(k=>row(k,0)).join('');
  }
  function dsbTreeSync(){
    if(window.innerWidth<1024) return;
    const nav=document.querySelector('#desktopSidebar .dsb-nav'), fb=nav&&nav.querySelector('.dsb-i[data-dnav="folders"]'); if(!fb) return;
    let t=document.getElementById('dsbTree');
    if(!t){ t=document.createElement('div'); t.id='dsbTree'; t.className='dsb-tree'; t.setAttribute('aria-label','Папки'); fb.insertAdjacentElement('afterend',t); }
    // стрілка біля «Папки»: згорнути / розгорнути дерево
    let tw=fb.querySelector('.dsb-tw');
    if(!tw){ tw=document.createElement('span'); tw.className='dsb-tw'; tw.setAttribute('role','button'); tw.tabIndex=0;
      tw.onclick=e=>{ e.stopPropagation(); dsbTreeHidden=!dsbTreeHidden; try{ localStorage.setItem('dsbTreeHidden',dsbTreeHidden?'1':'0'); }catch(_){} dsbTreeSync(); };
      tw.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); tw.onclick(e); } };
      fb.appendChild(tw); }
    tw.textContent='˅'; tw.classList.toggle('shut',dsbTreeHidden);
    tw.setAttribute('aria-label',dsbTreeHidden?'Показати папки':'Сховати папки'); tw.setAttribute('aria-expanded',String(!dsbTreeHidden));
    // згорнуто: лишається лише відкрита папка (щоб було видно, де ти)
    let curK=''; try{ const sp=document.getElementById('scr-page'); if(sp&&sp.classList.contains('active')) curK=pgFolderKey()||''; }catch(_){}
    if(dsbTreeHidden){ const f=curK&&folders[curK];
      t.innerHTML=f?`<div class="dsbt-r on" style="--lvl:0"><span class="dsbt-tw sp"></span><button class="dsbt-b" data-dsbt="${esc(curK)}" style="--c:${safeColor(f.c,'#6a7dff')}"><span class="dsbt-ic"><svg class="ico" aria-hidden="true"><use href="#${esc(folderIcon(f))}"/></svg></span><span class="dsbt-n" data-i18n-skip="1">${esc(String(f.name||'Папка').slice(0,40))}</span></button></div>`:'';
    } else t.innerHTML=dsbTreeHTML();
    t.querySelectorAll('[data-dsbtw]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); const k=b.dataset.dsbtw; dsbOpen[k]=!(b.classList.contains('open')); dsbTreeSync(); });
    t.querySelectorAll('[data-dsbt]').forEach(b=>b.onclick=()=>{ const k=b.dataset.dsbt; if(!folders[k]) return;
      try{ if(typeof groupKids==='function'&&groupKids(k).length&&typeof openGroupAsChosen==='function'){ dsbOpen[k]=true; openGroupAsChosen(k); dsbTreeSync(); return; } }catch(_){}
      try{ goFolder(k); }catch(_){} });
  }
  try{ window.addEventListener('resize',()=>{ clearTimeout(window.__dsbRz); window.__dsbRz=setTimeout(dsbTreeSync,200); }); }catch(_){}
  try{ document.addEventListener('flowsync',()=>{ try{ dsbTreeSync(); }catch(_){} }); }catch(_){}
