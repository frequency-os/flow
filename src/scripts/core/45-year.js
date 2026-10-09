  /* ════════ База цілей · вкладка «Рік» Журналу (45-year.js, 09.10.2026) ════════
     Широкий екран (≥900px, Mac/комп'ютер): «Таблиця року» — рядок = місія, стовпці = квартали з рівнями,
     приз, папка й години; рівень можна перетягнути в інший квартал. Телефон: матриця «місії × квартали»
     (згортається/розгортається — вибір памʼятає цей пристрій) + картки місій вибраного кварталу.
     Рівні — ті самі gl.ms {id, ym, t, done, due?}; записи (взято, інший квартал, новий рівень) — лише після дії людини, saveGoals(). */

  const yrState={y:'', q:-1, filter:'all'};
  const YR_MX_KEY='flow_yr_mx_open';   // вигляд на цьому пристрої (не дані) — як згорнуті блоки Планера
  function yrMxOpen(){ try{ return localStorage.getItem(YR_MX_KEY)!=='0'; }catch(_){ return true; } }
  function yrSetMxOpen(v){ try{ localStorage.setItem(YR_MX_KEY,v?'1':'0'); }catch(_){} }
  function yrYear(){ if(!/^\d{4}$/.test(yrState.y)) yrState.y=ymdLocal().slice(0,4); return yrState.y; }
  function yrCurQ(){ const td=ymdLocal(); return td.slice(0,4)===yrYear()?moQ(td.slice(0,7)):-1; }
  function yrWide(){ try{ return window.innerWidth>=900; }catch(_){ return false; } }
  function yrMissions(){
    const f=yrState.filter, all=(goalsData.goals||[]).filter(g=>g&&g.id);
    const L=f==='main'?all.filter(g=>jnRole(g)==='main'&&jnStatus(g)!=='archive')
      :f==='pause'?all.filter(g=>jnStatus(g)==='pause'||jnRole(g)==='wait')
      :f==='archive'?all.filter(g=>jnStatus(g)==='archive')
      :all.filter(g=>jnStatus(g)!=='archive');
    return L.sort((a,b)=>(jnRole(a)==='main'?0:1)-(jnRole(b)==='main'?0:1));
  }
  function yrLv(g,q){ const y=yrYear(); return jnLevels(g).filter(m=>m.ym.slice(0,4)===y&&(q<0||moQ(m.ym)===q)); }
  function yrChip(g,m,drag){
    const cls=m.done?'ok':moLate(m,m.ym)?'late':'';
    return `<button class="yr-lv ${cls}" data-yrlv="${esc(g.id)}|${esc(m.id)}"${drag?' draggable="true"':''} title="${esc(m.t)}">${m.done?'✓ ':''}${esc(m.t)}${!m.done&&m.due?' · '+jnDateTxt(m.due):''}</button>`;
  }
  function yrPrize(g){
    if(!(g.reward&&String(g.reward.t||'').trim())) return '<span class="yr-mute">—</span>';
    const sv=typeof pzSaved==='function'?pzSaved(g):0, pr=Math.round(+g.reward.sum||0);
    return `<button class="yr-pz" data-yrpz="${esc(g.id)}"><span>${safeEmoji(g.reward.emoji,'🎁')}</span><span><b>${esc(g.reward.t)}</b><small>${g.reward.claimed?'🏅 отримано':(typeof pzK==='function'?pzK(sv)+' / '+pzK(pr):'')}</small></span></button>`;
  }
  function yrKpi(ms){
    const y=yrYear(), cq=yrCurQ(), lv=ms.reduce((a,g)=>a.concat(yrLv(g,-1)),[]), ql=cq>=0?lv.filter(m=>moQ(m.ym)===cq):[];
    const pz=typeof pzTotal==='function'?pzTotal():0;
    return `<div class="yr-kpi"><div><small>місій</small><b>${ms.length}</b></div><div><small>рівнів ${y}</small><b>${lv.filter(m=>m.done).length} з ${lv.length}</b></div>
      ${cq>=0?`<div><small>цей квартал · ${MO_Q[cq]}</small><b>${ql.filter(m=>m.done).length} з ${ql.length}</b></div>`:''}<div><small>🏆 на призи</small><b>${typeof pzK==='function'?pzK(pz):pz}</b></div></div>`;
  }
  function yrHead(){
    const y=yrYear(), cur=ymdLocal().slice(0,4);
    const f=[['all','Усі'],['main','Головні'],['pause','Пауза'],['archive','Архів']];
    return `<div class="yr-top"><div class="yr-yn"><button data-yrshift="-1" aria-label="Попередній рік">‹</button><b>${y}</b><button data-yrshift="1" aria-label="Наступний рік">›</button>${y!==cur?'<button class="mo-now" data-yrthis>Цей рік</button>':''}</div>
      <div class="yr-filt">${f.map(([k,l])=>`<button data-yrf="${k}"${yrState.filter===k?' class="on"':''}>${l}</button>`).join('')}<button data-yradd>＋ Місія</button></div></div>
      <button class="yr-letter" data-yrletter><span>✉️</span><span><b>Лист із точки Б · Дорога року</b><small>${(()=>{ try{ const L=goalsData.letter; return L&&L.text?esc(String(L.text).slice(0,70))+'…':'напиши, ким ти будеш через рік'; }catch(_){ return ''; } })()}</small></span><i>›</i></button>`;
  }

  // ── Mac: Таблиця року ──
  function yrTableHTML(){
    const ms=yrMissions(), cq=yrCurQ();
    let h=yrHead()+yrKpi(ms);
    if(!ms.length) return h+`<div class="dy-empty"><b>Тут поки порожньо</b><span>Додай місію — і розклади її рівні по кварталах.</span></div>`;
    h+=`<div class="yr-tbl"><div class="yr-th">Місія</div>${MO_Q.map((q,i)=>`<div class="yr-th${i===cq?' cur':''}">${q} кв${i===cq?' · зараз':''}</div>`).join('')}<div class="yr-th">Приз</div><div class="yr-th">Папка · год/тиж</div>`;
    ms.forEach(g=>{
      const c=safeColor(g.color,'#3ec7b4'), fk=typeof moOwnFolder==='function'&&moOwnFolder(g.folderKey)?g.folderKey:'';
      h+=`<button class="yr-mn" data-yrm="${esc(g.id)}" style="--c:${c}"><span class="yr-em">${safeEmoji(g.emoji,'🎯')}</span><span><b>${esc(g.name||'Місія')}</b><small>${(g.from||g.to)?esc(g.from||'?')+' → '+esc(g.to||'?')+' · ':''}${jnPct(g)}%</small><i class="yr-pg"><u style="width:${jnPct(g)}%"></u></i></span></button>`;
      [0,1,2,3].forEach(q=>{ h+=`<div class="yr-cell${q===cq?' cur':''}" data-yrdrop="${esc(g.id)}|${q}" style="--c:${c}">${yrLv(g,q).map(m=>yrChip(g,m,true)).join('')}<button class="yr-add" data-yradl="${esc(g.id)}|${q}" aria-label="Додати рівень у ${MO_Q[q]} квартал">＋</button></div>`; });
      h+=`<div class="yr-cell">${yrPrize(g)}</div><div class="yr-cell yr-mute">${fk?`<button class="yr-fold" data-yrfold="${esc(fk)}">${safeEmoji(folders[fk].emoji,'📁')} ${esc(folders[fk].name||'Папка')}</button>`:'—'}<br>${g.budget&&+g.budget.hWeek?dyNum(+g.budget.hWeek)+' год':''}</div>`;
    });
    return h+`</div><small class="mo-note">Тягни рівень в інший квартал або тапни — взято, перенести, змінити.</small><div class="jn-pad"></div>`;
  }

  // ── Телефон: матриця (згортається) + картки кварталу ──
  function yrPhoneHTML(){
    const ms=yrMissions(), cq=yrCurQ(), open=yrMxOpen();
    if(yrState.q<0||yrState.q>3) yrState.q=cq>=0?cq:0;
    const q=yrState.q;
    const lvAll=ms.reduce((a,g)=>a.concat(yrLv(g,-1)),[]);
    let h=yrHead();
    h+=`<div class="yr-mx-card"><button class="yr-mx-h" data-yrmx aria-expanded="${open}"><span>Рік по кварталах</span><span>${lvAll.filter(m=>m.done).length} з ${lvAll.length} ${open?'⌃':'⌄'}</span></button>`;
    if(open){
      h+=`<div class="yr-mx"><span></span>${MO_Q.map((t,i)=>`<button class="yr-mx-q${i===q?' on':''}${i===cq?' now':''}" data-yrq="${i}">${t}</button>`).join('')}`;
      ms.forEach(g=>{ const c=safeColor(g.color,'#3ec7b4');
        h+=`<span class="yr-mx-n">${safeEmoji(g.emoji,'🎯')} ${esc(String(g.name||'').slice(0,10))}</span>`;
        [0,1,2,3].forEach(i=>{ const L=yrLv(g,i); h+=`<button class="yr-mx-c${i===q?' on':''}" data-yrq="${i}" style="--c:${c}" aria-label="${esc(g.name||'')}: ${MO_Q[i]} квартал, ${L.filter(m=>m.done).length} з ${L.length}">${L.slice(0,4).map(m=>`<i class="${m.done?'ok':moLate(m,m.ym)?'l':'p'}"></i>`).join('')}${L.length>4?'<small>+'+(L.length-4)+'</small>':''}</button>`; });
      });
      h+=`</div><div class="yr-leg"><span><i class="ok"></i>взято</span><span><i class="p"></i>план</span><span><i class="l"></i>прострочено</span></div>`;
    } else {
      h+=`<div class="yr-qbar">${MO_Q.map((t,i)=>{ const L=lvAll.filter(m=>moQ(m.ym)===i); return `<button class="${i===q?'on':''}${i===cq?' now':''}" data-yrq="${i}">${t}<small>${L.filter(m=>m.done).length}/${L.length}</small></button>`; }).join('')}</div>`;
    }
    h+=`</div><div class="mo-h" style="margin-top:2px"><span>${MO_Q[q]} квартал · ${lvAll.filter(m=>moQ(m.ym)===q).length} рівнів</span></div>`;
    h+=ms.length?ms.map(g=>{ const c=safeColor(g.color,'#3ec7b4'), L=yrLv(g,q);
      return `<div class="yr-pc" style="--c:${c}"><button class="mo-c-t" data-yrm="${esc(g.id)}"><span class="mo-c-em">${safeEmoji(g.emoji,'🎯')}</span><span class="mo-c-n"><b>${esc(g.name||'Місія')}</b><small>${jnPct(g)}%${g.reward&&g.reward.t?' · '+safeEmoji(g.reward.emoji,'🎁')+' '+esc(g.reward.t):''}</small></span><span class="mo-c-go">›</span></button>
        <div class="yr-pc-lv">${L.map(m=>yrChip(g,m,false)).join('')}<button class="yr-add wide" data-yradl="${esc(g.id)}|${q}">＋ рівень</button></div></div>`; }).join('')
      :`<div class="dy-empty"><b>Ще нема місій</b><span>Додай місію — і розклади її рівні по кварталах.</span></div>`;
    return h+'<div class="jn-pad"></div>';
  }
  function yrHTML(){ return yrWide()?yrTableHTML():yrPhoneHTML(); }

  // ── дії з рівнями (лише після натискання) ──
  function yrFind(key){ const [gid,mid]=String(key).split('|'); const g=(goalsData.goals||[]).find(x=>String(x.id)===gid); const m=g&&(g.ms||[]).find(x=>x&&String(x.id)===mid); return {g,m}; }
  function yrMove(g,m,q){
    const y=m.ym.slice(0,4), cur=+m.ym.slice(5,7)-1, nm=q*3+(cur%3)+1, ym=y+'-'+String(nm).padStart(2,'0');   // рік — із самого рівня
    if(ym===m.ym) return;
    m.ym=ym;
    if(typeof m.due==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(m.due)){ const d=Math.min(+m.due.slice(8)||1, moDim(ym)); m.due=ym+'-'+String(d).padStart(2,'0'); }
    else if(m.due) delete m.due;   // зіпсована дата з хмари/бекапу не має зупинити перенесення
    saveGoals(); jnRender(); plToast('→ «'+m.t+'» у '+MO_Q[q]+' квартал');
  }
  function yrLvMenu(key){
    const {g,m}=yrFind(key); if(!g||!m) return;
    actionSheet({title:m.t, sub:(g.name||'Місія')+' · '+MO_NAMES[+m.ym.slice(5,7)-1].toLowerCase()+(m.due?' · до '+jnDateTxt(m.due):''), items:[
      {ic:'target', label:m.done?'Зняти «взято»':'Рівень взято ✓', primary:!m.done, onClick:()=>{ m.done=!m.done; saveGoals(); jnRender(); }},
      {ic:'calendar', label:'В інший квартал', onClick:()=>actionSheet({title:'У який квартал?', sub:m.t, items:[0,1,2,3].filter(i=>i!==moQ(m.ym)).map(i=>({ic:'calendar', label:MO_Q[i]+' квартал', onClick:()=>yrMove(g,m,i)}))})},
      {ic:'edit', label:'Змінити в редакторі місії', onClick:()=>jnEditor(g)} ]});
  }
  function yrAddLevel(key){
    const [gid,qs]=String(key).split('|'), q=+qs, g=(goalsData.goals||[]).find(x=>String(x.id)===gid); if(!g||!(q>=0&&q<=3)) return;
    const y=yrYear(), cur=ymdLocal().slice(0,7), ym=(cur.slice(0,4)===y&&moQ(cur)===q)?cur:y+'-'+String(q*3+1).padStart(2,'0');
    inputModal({title:'Рівень · '+MO_Q[q]+' квартал', placeholder:'Напр. Unit 6 або 50 замовлень', onOk:v=>{
      v=String(v||'').trim().slice(0,80); if(!v) return;
      const q2=(goalsData.goals||[]).find(x=>String(x.id)===gid); if(!q2) return;
      if(!Array.isArray(q2.ms)) q2.ms=[];
      q2.ms.push({id:'ms_m_'+Date.now()+'_'+Math.random().toString(36).slice(2,5), ym, t:v, done:false});
      saveGoals(); jnRender(); plToast('＋ рівень «'+v+'»');
    }});
  }
  function yrBind(c){
    c.querySelectorAll('[data-yrshift]').forEach(b=>b.onclick=()=>{ yrState.y=String(+yrYear()+(+b.dataset.yrshift)); yrState.q=-1; jnRender(); });
    { const t=c.querySelector('[data-yrthis]'); if(t) t.onclick=()=>{ yrState.y=''; yrState.q=-1; jnRender(); }; }
    c.querySelectorAll('[data-yrf]').forEach(b=>b.onclick=()=>{ yrState.filter=b.dataset.yrf; jnRender(); });
    { const a=c.querySelector('[data-yradd]'); if(a) a.onclick=()=>jnEditor(null); }
    { const l=c.querySelector('[data-yrletter]'); if(l) l.onclick=()=>{ try{ goGoals(); }catch(_){} }; }
    { const m=c.querySelector('[data-yrmx]'); if(m) m.onclick=()=>{ yrSetMxOpen(!yrMxOpen()); jnRender(); }; }
    c.querySelectorAll('[data-yrq]').forEach(b=>b.onclick=()=>{ yrState.q=+b.dataset.yrq; jnRender(); });
    c.querySelectorAll('[data-yrm]').forEach(b=>b.onclick=()=>{ const g=(goalsData.goals||[]).find(x=>String(x.id)===b.dataset.yrm); if(g) moMissionPage(g,'path'); });
    c.querySelectorAll('[data-yrpz]').forEach(b=>b.onclick=()=>{ const g=(goalsData.goals||[]).find(x=>String(x.id)===b.dataset.yrpz); if(g&&typeof pzJarSheet==='function') pzJarSheet(g); });
    c.querySelectorAll('[data-yrfold]').forEach(b=>b.onclick=()=>{ try{ goFolder(b.dataset.yrfold); }catch(_){} });
    c.querySelectorAll('[data-yrlv]').forEach(b=>b.onclick=()=>yrLvMenu(b.dataset.yrlv));
    c.querySelectorAll('[data-yradl]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); yrAddLevel(b.dataset.yradl); });
    // перетягування (лише широкий екран): рівень → інший квартал тієї ж місії
    c.querySelectorAll('.yr-lv[draggable]').forEach(b=>b.addEventListener('dragstart',e=>{ try{ e.dataTransfer.setData('text/plain',b.dataset.yrlv); e.dataTransfer.effectAllowed='move'; }catch(_){} b.classList.add('drag'); }));
    c.querySelectorAll('.yr-lv[draggable]').forEach(b=>b.addEventListener('dragend',()=>b.classList.remove('drag')));
    c.querySelectorAll('[data-yrdrop]').forEach(cell=>{
      cell.addEventListener('dragover',e=>{ e.preventDefault(); cell.classList.add('over'); });
      cell.addEventListener('dragleave',()=>cell.classList.remove('over'));
      cell.addEventListener('drop',e=>{ e.preventDefault(); cell.classList.remove('over');
        let key=''; try{ key=e.dataTransfer.getData('text/plain'); }catch(_){}
        const {g,m}=yrFind(key); const [gid,qs]=cell.dataset.yrdrop.split('|');
        if(!g||!m) return;
        if(String(g.id)!==gid){ plToast('Рівень можна перенести лише в межах своєї місії'); return; }
        yrMove(g,m,+qs);
      });
    });
  }
  // перемалювати при зміні ширини вікна (Mac: таблиця ↔ вузьке вікно: телефонний вигляд)
  try{ let yrW=yrWide(); window.addEventListener('resize',()=>{ const w=yrWide(); if(w!==yrW){ yrW=w; const s=document.getElementById('scr-journal'); if(s&&s.classList.contains('active')&&jnTab==='year') jnRender(); } }); }catch(_){}
