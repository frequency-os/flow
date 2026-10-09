  /* ════════ Віджети «Гроші» (48-widgets.js, 09.10.2026) ════════
     Вигляд A «Плитки» (як віджети iPhone). Віджет — ВІКНО в Гаманець: даних одна копія (finOps, конверти,
     місії, План місяця, правила), віджет лише показує їх і відкриває ті самі шторки. Запис — лише тапом людини.
     Типи блоків сторінки папки (boards): wgwallet · wgmission · wgenv · wgdebt · wgmoney{kind:'in'|'out', src, label, goal}.
     «Доходи»/«Витрати» (wgmoney) — поєднання A+C: операції з них мають мітку папки (op.folderKey) і тип доходу (op.src);
     у папці місії — ще й мітку місії. На Огляді — ряд із 4 плиток (вимикається в ⚙ Огляду, folderOpts.money).
     Хост на сторінці: <div data-wghost="id"> (page-editor/02-block-styles.js), на Огляді — #homeMoney. */

  const WG_TYPES={wgwallet:1, wgmission:1, wgenv:1, wgdebt:1, wgmoney:1};
  function wgIs(t){ return !!WG_TYPES[t]; }
  // папка відкритої сторінки (ключ дошки без простору); '' — не в папці
  function wgCtxFolder(){ try{ const k=String(boardKey||'').split('__sp_')[0]; return k&&moOwnFolder(k)?k:''; }catch(_){ return ''; } }
  function wgFolderMission(fk){ return fk?(goalsData.goals||[]).find(g=>g&&g.id&&String(g.folderKey||'')===String(fk)&&jnStatus(g)!=='archive')||null:null; }
  function wgMoney(n){ return wlMoney(n); }
  function wgK(n){ return moneyK(n); }
  function wgDebtNet(){ let owe=0,owed=0; try{ debtItems.forEach(i=>{ if((i.cur||'UAH')===mainCur()){ const v=balance(i); if(i.kind==='owe') owe+=v; else owed+=v; } }); }catch(_){} return {owe,owed,net:owed-owe}; }

  // ── вставка з меню «/» (03-premium-pack.js → applySlash) ──
  function wgApply(k,b){
    if(k==='wgin'||k==='wgout'){
      b.type='wgmoney'; b.kind=k==='wgin'?'in':'out'; b.label=b.label||(k==='wgin'?'Доходи':'Витрати');
      if(k==='wgin'&&!b.src) b.src='extra';   // у папці-проєкті дохід зазвичай додатковий
      if(b.goal==null) b.goal=0;
      const id=b.id; setTimeout(()=>{ try{ wgMoneyCfg(id,true); }catch(_){} },450);   // одразу спитати тип і назву
      return true;
    }
    if(wgIs(k)){ b.type=k; return true; }
    return false;
  }

  // ── HTML плиток ──
  function wgTile(cls,inner,attrs){ return `<div class="wg-t ${cls}"${attrs||''}>${inner}</div>`; }
  function wgHTML(b,fk){
    const ym=wlYm(), t=b&&b.type;
    if(t==='wgwallet'){
      let bal=0, pz=0; try{ bal=walletBalance(); pz=typeof pzTotal==='function'?pzTotal():0; }catch(_){}
      const all=wlAgg(wlMonthOps(ym)), g=(jnHero().money&&jnHero().money[ym])||null, svd=typeof pzMonthSaved==='function'?Math.max(0,pzMonthSaved(ym)):0;
      let fc=null; try{ fc=rlForecast(ym); }catch(_){}
      const ring=(p,lbl)=>`<span class="wg-r" style="--p:${Math.max(0,Math.min(100,Math.round(p)))}"><em>${Math.round(p)}%</em><small>${lbl}</small></span>`;
      const rings=g&&(+g.earn>0||+g.spend>0||+g.save>0)
        ?`<span class="wg-rings">${+g.earn>0?ring(all.inc/g.earn*100,'заробив'):''}${+g.spend>0?ring(all.out/g.spend*100,'витратив'):''}${+g.save>0?ring(svd/g.save*100,'відклав'):''}</span>`
        :`<span class="wg-fact"><span>+${wgK(all.inc)}</span><span>−${wgK(all.out)}</span></span>`;
      return wgTile('wide c-wallet',`<button class="wg-hit" data-wga="wallet" aria-label="Відкрити Гаманець"></button>
        <span class="wg-h">Гаманець · ${esc(MO_NAMES[+ym.slice(5,7)-1].toLowerCase())}</span><b class="wg-big">${wgMoney(bal)}</b>
        <small>${fc!==null?'прогноз на кінець місяця '+wgMoney(fc):''}${pz?(fc!==null?' · ':'')+'на призи '+wgMoney(pz):''}</small>
        ${(()=>{ let l=[]; try{ l=wlCurList(); }catch(_){} return l.length?`<small class="wg-curs">${l.map(c=>esc(money(curBalance(c),c))).join(' · ')}</small>`:''; })()}
        <span class="wg-foot">${rings}<span class="wg-acts"><button data-wga="out" aria-label="Витрата">−</button><button data-wga="in" aria-label="Дохід">＋</button></span></span>`);
    }
    if(t==='wgmission'){
      const g=wgFolderMission(fk)||(b.goalId&&wlGoal(b.goalId))||wlMissions()[0]||null;
      if(!g) return wgTile('c-mission',`<button class="wg-hit" data-wga="journal" aria-label="Журнал"></button><span class="wg-h">🎯 Гроші місії</span><b class="wg-big sm">Ще нема місій</b><small>створи в Журналі</small>`);
      const a=wlAgg(wlMonthOps(ym),g.id), bud=g.budget&&+g.budget.money>0?+g.budget.money:0;
      const rw=g.reward&&String(g.reward.t||'').trim()?g.reward:null, sv=rw&&typeof pzSaved==='function'?pzSaved(g):0, rp=rw&&+rw.sum>0?Math.min(100,Math.round(sv/rw.sum*100)):0;
      return wgTile('c-mission',`<button class="wg-hit" data-wga="mission" data-wgg="${esc(g.id)}" aria-label="Гроші місії ${esc(g.name||'')}"></button>
        <span class="wg-h">${safeEmoji(g.emoji,'🎯')} ${esc(String(g.name||'Місія').slice(0,22))}</span><b class="wg-big">${a.inc-a.out>0?'+':a.inc-a.out<0?'−':''}${wgK(Math.abs(a.inc-a.out))}</b>
        <small>${bud?'бюджет '+wgK(a.out)+' / '+wgK(bud):'дохід '+wgK(a.inc)+' · витрати '+wgK(a.out)}</small>
        ${bud?`<span class="wg-bar"><i class="${a.out>bud?'over':''}" style="width:${Math.min(100,Math.round(a.out/bud*100))}%"></i></span>`:''}
        ${rw?`<small class="wg-pz">${safeEmoji(rw.emoji,'🎁')} ${rp}% на «${esc(String(rw.t).slice(0,18))}»</small>`:''}`,` style="--mc:${safeColor(g.color,'#34c77b')}"`);
    }
    if(t==='wgenv'){
      const envs=(envelopes||[]).filter(e=>e&&e.id); let tot=0; envs.forEach(e=>{ try{ tot+=envSaved(e); }catch(_){} });
      let rows=[]; try{ rows=rlPlanOpen(ym).slice(0,2); }catch(_){}
      const td=+ymdLocal().slice(8,10);
      return wgTile('c-env',`<button class="wg-hit" data-wga="envs" aria-label="Конверти"></button>
        <span class="wg-h">✉️ Конверти</span><b class="wg-big">${wgK(tot)}</b>
        ${rows.length?rows.map(x=>`<button class="wg-li" data-wga="plan" data-wgp="${x.k}|${esc(x.r.id)}"><span>${esc(String(x.r.t||'').slice(0,14))}${x.r.day?` · ${+x.r.day<td?'<i>прострочено</i>':esc(String(x.r.day))+'-го'}`:''}</span><b>${x.k==='in'?'+':'−'}${wgK(x.rest)}</b></button>`).join('')
          :`<button class="wg-li" data-wga="planadd"><span>План місяця порожній</span><b>＋</b></button>`}`);
    }
    if(t==='wgdebt'){
      const d=wgDebtNet(); let s=0, dc={ok:0,all:0}; try{ s=jnStreak(); dc=rlDiscipline(); }catch(_){}
      return wgTile('wide c-debt',`<button class="wg-hit" data-wga="debts" aria-label="Борги"></button>
        <span class="wg-h">🤝 Борги · 📖 Правила</span>
        <span class="wg-two"><span><b class="wg-big">${d.net>0?'+':''}${wgK(d.net)}</b><small>${d.owed||d.owe?'мені винні '+wgK(d.owed)+' · я винен '+wgK(d.owe):'боргів нема'}</small></span>
        <button class="wg-rules" data-wga="rules"><b>🔥 ${s} ${pluralUk(s,'день','дні','днів')}</b><small>${dc.all?'дисципліна '+Math.round(dc.ok/dc.all*100)+'%':'Книга правил ›'}</small></button></span>`);
    }
    if(t==='wgmoney'){
      const kind=b.kind==='out'?'out':'in', src=WL_SRC[b.src]?b.src:'main', cur=b.cur&&b.cur!==mainCur()&&Object.prototype.hasOwnProperty.call(CUR_LIST,b.cur)?b.cur:'';
      if(!fk) return wgTile('c-'+kind,`<span class="wg-h">${kind==='in'?'＋ Доходи':'− Витрати'}</span><b class="wg-big sm">Лише в папці</b><small>постав віджет у папку-проєкт</small>`);
      // віджет із валютою (етап 2) рахує лише свою валюту; без — головну
      const ops=wlMonthOps(ym).filter(o=>String(o.folderKey||'')===String(fk)&&(o.cur||'')===cur&&(kind==='in'?_isIncAny(o)&&wlSrc(o)===src:_isExpAny(o)));
      const sum=ops.reduce((s,o)=>s+(+o.amount||0),0), goal=+b.goal>0?+b.goal:0, last=ops[ops.length-1];
      return wgTile('c-'+kind,`<button class="wg-hit" data-wga="folderops" aria-label="Записи папки"></button>
        <button class="wg-cfg" data-wga="cfg" aria-label="Налаштувати віджет">⚙</button>
        <span class="wg-h">${kind==='in'?WL_SRC[src][0]:'−'} ${esc(String(b.label||(kind==='in'?'Доходи':'Витрати')).slice(0,20))}</span>
        <b class="wg-big">${esc(moneyK(sum,cur))}</b>
        <small>${goal?(kind==='in'?'ціль ':'ліміт ')+esc(moneyK(goal,cur))+' · '+Math.round(sum/goal*100)+'%':ops.length?ops.length+' '+pluralUk(ops.length,'запис','записи','записів')+(last?' · '+esc(String(last.label||'').slice(0,14)):''):'цього місяця ще нема'}</small>
        ${goal?`<span class="wg-bar"><i class="${kind==='out'&&sum>goal?'over':''}" style="width:${Math.min(100,Math.round(sum/goal*100))}%"></i></span>`:''}
        <span class="wg-acts one"><button data-wga="add">${kind==='in'?'＋ Дохід':'− Витрата'}</button></span>`);
    }
    return '';
  }

  // ── дії (делегування: один обробник на хост) ──
  function wgAct(e,host){
    const el=e.target.closest('[data-wga]'); if(!el||!host.contains(el)) return;
    e.preventDefault(); e.stopPropagation();
    const a=el.dataset.wga, fk=host.dataset.wgfk||'', id=host.dataset.wghost||'';
    const blk=()=>{ try{ return id?getBlock(id):null; }catch(_){ return null; } };
    if(a==='wallet'){ try{ wlState.tab='overview'; goFinance(); }catch(_){} }
    else if(a==='in'||a==='out'){ wlOpSheet(a,'',{}); }
    else if(a==='journal'){ try{ goJournal({tab:'day'}); }catch(_){} }
    else if(a==='mission'){ try{ wlMissionSheet(el.dataset.wgg); }catch(_){} }
    else if(a==='envs'){ try{ goEnvelopes(); }catch(_){} }
    else if(a==='plan'){ const [k,pid]=String(el.dataset.wgp||'').split('|'); try{ rlPlanRowMenu(wlYm(),k,pid); }catch(_){} }
    else if(a==='planadd'){ try{ wlState.tab='plan'; goFinance(); }catch(_){} }
    else if(a==='debts'){ try{ goDebts(); }catch(_){} }
    else if(a==='rules'){ try{ rlBook(); }catch(_){} }
    else if(a==='folderops'){ if(fk) wlFolderSheet(fk); }
    else if(a==='cfg'){ if(id) wgMoneyCfg(id,false); }
    else if(a==='add'){ const b=blk(); if(!b||!fk) return; const g=wgFolderMission(fk);
      wlOpSheet(b.kind==='out'?'out':'in', g?String(g.id):'', {folderKey:fk, src:b.src, cur:b.cur, label:b.kind==='out'?'':(b.label||'')}); }
  }
  function wgFill(host,b,fk){
    host.dataset.wgfk=fk||'';
    let html=''; try{ html=wgHTML(b,fk); }catch(err){ console.error('wgHTML',err); }
    host.innerHTML=html||'<div class="wg-t c-none"><small>Віджет недоступний</small></div>';
    if(!host.__wgBound){ host.__wgBound=true; host.addEventListener('click',e=>wgAct(e,host)); }
  }
  // сторінка папки: хости від редактора; Огляд — #homeMoney
  function wgFillPage(root){
    const fk=wgCtxFolder();
    (root||document).querySelectorAll('[data-wghost]').forEach(h=>{ let b=null; try{ b=getBlock(h.dataset.wghost); }catch(_){} if(b) wgFill(h,b,fk); });
  }
  function wgHome(){
    const box=document.getElementById('homeMoney'); if(!box) return;
    let on=1; try{ on=folderOpts.money; }catch(_){}
    if(!on){ box.hidden=true; box.innerHTML=''; return; }
    box.hidden=false;
    if(!box.querySelector('.wg-grid')) box.innerHTML='<div class="wg-grid"></div>';
    const grid=box.querySelector('.wg-grid');
    const want=['wgwallet','wgmission','wgenv','wgdebt'];
    if(grid.children.length!==want.length){ grid.innerHTML=want.map(t=>`<div class="wg-host" data-wghome="${t}"></div>`).join(''); }
    grid.querySelectorAll('[data-wghome]').forEach(h=>wgFill(h,{type:h.dataset.wghome},''));
  }
  // після будь-якого запису грошей — перемалювати всі видимі віджети
  function wgRefresh(){ try{ wgFillPage(document); }catch(_){} try{ wgHome(); }catch(_){} }

  // ── налаштування «Доходи»/«Витрати»: тип доходу, назва, ціль/ліміт ──
  function wgMoneyCfg(id,isNew){
    let b=null; try{ b=getBlock(id); }catch(_){} if(!b||b.type!=='wgmoney') return;
    const kind=b.kind==='out'?'out':'in'; let src=WL_SRC[b.src]?b.src:'main', cur=b.cur&&Object.prototype.hasOwnProperty.call(CUR_LIST,b.cur)?b.cur:mainCur();
    jnOverlay(`<div class="jn-ed-h"><b>${isNew?'Новий віджет':'Віджет'} «${kind==='in'?'Доходи':'Витрати'}»</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Записи з нього підуть у Гаманець з міткою цієї папки${kind==='in'?' і типом доходу':''}.</small>
      ${kind==='in'?`<div class="jn-f"><span>Тип доходу</span><div class="wl-chips" id="wgSrc">${Object.keys(WL_SRC).map(k=>`<button data-wgsrc="${k}"${k===src?' class="on"':''}>${WL_SRC[k][0]} ${WL_SRC[k][1]}</button>`).join('')}</div></div>`:''}
      <div class="jn-f"><span>Валюта</span><div class="wl-chips" id="wgCur">${Object.keys(CUR_LIST).map(k=>`<button data-wgcur="${k}"${k===cur?' class="on"':''}>${CUR_LIST[k].s} ${CUR_LIST[k].n}${k===mainCur()?' · головна':''}</button>`).join('')}</div></div>
      <label class="jn-f"><span>Назва</span><input id="wgLbl" maxlength="40" value="${esc(String(b.label||''))}" placeholder="${kind==='in'?'Фріланс, клієнти…':'Реклама, софт…'}"></label>
      <label class="jn-f"><span>${kind==='in'?'Ціль':'Ліміт'} на місяць, ${curSym(cur)} (необовʼязково)</span><input id="wgGoal" type="number" inputmode="numeric" min="0" step="100" value="${+b.goal>0?+b.goal:''}" placeholder="Напр. 15000"></label>
      <div class="jn-ed-foot"><button class="jn-btn" data-wgok>Зберегти</button></div>`, ov=>{
      ov.querySelectorAll('[data-wgcur]').forEach(x=>x.onclick=()=>{ cur=x.dataset.wgcur; ov.querySelectorAll('[data-wgcur]').forEach(y=>y.classList.toggle('on',y===x)); });
      ov.querySelectorAll('[data-wgsrc]').forEach(x=>x.onclick=()=>{ src=x.dataset.wgsrc; ov.querySelectorAll('[data-wgsrc]').forEach(y=>y.classList.toggle('on',y===x)); });
      ov.querySelector('[data-wgok]').onclick=()=>{
        const q=getBlock(id); if(!q){ ov.remove(); return; }
        q.label=String(ov.querySelector('#wgLbl').value||'').trim().slice(0,40)||(kind==='in'?'Доходи':'Витрати');
        const gv=Math.round(parseFloat(String(ov.querySelector('#wgGoal').value||'').replace(',','.'))||0); q.goal=gv>0?gv:0;
        if(kind==='in') q.src=src;
        if(cur!==mainCur()){ q.cur=cur; const l=wlCurList(); if(!l.includes(cur)){ l.push(cur); wlCurSave(l); } } else delete q.cur;   // інша валюта — зʼявиться окремим балансом у Гаманці
        saveBoard(); ov.remove(); wgRefresh();
      };
    });
  }

  // дані прийшли з хмари / з іншого пристрою — віджети оновлюються самі (як колись 33-home-widgets.js)
  // лише ключі, що й так живуть сирими в localStorage (FLOW_RAW_KEYS) — prefCatchup кладе значення туди
  try{ ['fin_ops','goals_data'].forEach(k=>prefCatchup(k,()=>{ try{ wgRefresh(); }catch(_){} })); }catch(_){}

  /* ── «Ще → Дані → Старі віджети»: прибрати старі фінансові блоки й проєкти Кабінету ──
     Лише рукою людини і лише коли сховище довірене (дані з хмари прочитано). Нічого не робить при старті.
     Стирає: блоки fin / envelope / project / festival / kpi на сторінках папок і сховище fin_projects.
     НЕ чіпає: конверти, операції Гаманця, борги — вони живуть у своїх ключах. */
  const WG_OLD={fin:'Фінанси', envelope:'Конверт', project:'Проєкт', festival:'Фестиваль', kpi:'KPI'};
  function wgOldScan(){
    const by={}; let n=0;
    const walk=arr=>(arr||[]).forEach(b=>{ if(!b) return; if(WG_OLD[b.type]){ by[b.type]=(by[b.type]||0)+1; n++; } if(Array.isArray(b.children)) walk(b.children); });
    try{ Object.keys(boards||{}).forEach(k=>{ if(Array.isArray(boards[k])) walk(boards[k]); }); }catch(_){}
    let pj=0; try{ pj=(finProjects||[]).length; }catch(_){}
    return {by,n,pj};
  }
  function wgOldCleanup(){
    if(window.sbDataTrusted&&!window.sbDataTrusted()){ plToast('Дані ще не завантажились з хмари — спробуй за хвилину'); return; }
    const r=wgOldScan();
    if(!r.n&&!r.pj){ plToast('Старих фінансових віджетів нема'); return; }
    const list=Object.keys(r.by).map(t=>WG_OLD[t]+' × '+r.by[t]).join(', ');
    confirmSheet({title:'Прибрати старі віджети?',
      sub:(r.n?'Блоки на сторінках папок: '+list+'. ':'')+(r.pj?'Проєкти Кабінету: '+r.pj+' (їхні рухи й нотатки). ':'')
        +'Конверти, операції в Гаманці й борги лишаються. Скасувати не можна — спершу зроби бекап (вище, «Експорт у файл»).',
      okLabel:'Прибрати назавжди', danger:true, onOk:()=>{
        if(window.sbDataTrusted&&!window.sbDataTrusted()){ plToast('Дані ще не завантажились — нічого не змінено'); return; }
        // board пишеться цілком — лише коли справді є що прибрати (зайвий запис зі свіжою міткою перетер би правки з іншого пристрою)
        if(r.n){
          const strip=arr=>arr.filter(b=>!(b&&WG_OLD[b.type])).map(b=>{ if(b&&Array.isArray(b.children)) b.children=strip(b.children); return b; });
          try{ Object.keys(boards||{}).forEach(k=>{ if(Array.isArray(boards[k])) boards[k]=strip(boards[k]); }); }catch(_){}
          try{ syncBlocks(); }catch(_){}
          saveBoard();
        }
        if(r.pj){ try{ finProjects=[]; saveFinProjects(); }catch(_){} }
        plToast('🧹 Прибрано: '+(r.n?r.n+' '+pluralUk(r.n,'блок','блоки','блоків'):'')+(r.n&&r.pj?' · ':'')+(r.pj?r.pj+' '+pluralUk(r.pj,'проєкт','проєкти','проєктів'):''));
        try{ renderBoard(); }catch(_){}
      }});
  }
