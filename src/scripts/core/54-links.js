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
