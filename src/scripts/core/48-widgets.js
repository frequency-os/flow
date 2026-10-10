  /* ════════ Віджети «Гроші» (48-widgets.js, 09.10.2026) ════════
     Вигляд A «Плитки» (як віджети iPhone). Віджет — ВІКНО в Гаманець: даних одна копія (finOps, конверти,
     місії, План місяця, правила), віджет лише показує їх і відкриває ті самі шторки. Запис — лише тапом людини.
     Типи блоків сторінки папки (boards): wgwallet · wgmission · wgenv · wgdebt · wgmoney{kind:'in'|'out', src, label, goal}.
     «Доходи»/«Витрати» (wgmoney) — поєднання A+C: операції з них мають мітку папки (op.folderKey) і тип доходу (op.src);
     у папці місії — ще й мітку місії. У Гаманці (вкладка «Огляд») — Місія · Конверти · Борги й правила (10.10.2026: з Огляду прибрано в ⚙ Огляду, folderOpts.money).
     Хост на сторінці: <div data-wghost="id"> (page-editor/02-block-styles.js), у Гаманці — [data-wghome] (wlRender). */

  const WG_TYPES={wgwallet:1, wgmission:1, wgenv:1, wgdebt:1, wgmoney:1, wgwork:1, dmission:1, dhabit:1, dtime:1, dcal:1};   // d* — «Дані» (нижче)
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
    if(wdIs(t)) return wdHTML(b,fk);   // «Дані»: вікна в місію / трекер / Планер
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
      const envs=(envelopes||[]).filter(e=>e&&e.id&&!envCur(e)); let tot=0; envs.forEach(e=>{ try{ tot+=envSaved(e); }catch(_){} });   // сума — лише головна валюта
      let rows=[]; try{ rows=rlPlanOpen(ym).slice(0,2); }catch(_){}
      const td=+ymdLocal().slice(8,10);
      return wgTile('c-env',`<button class="wg-hit" data-wga="envs" aria-label="Конверти"></button>
        <span class="wg-h">✉️ Конверти</span><b class="wg-big">${wgK(tot)}</b>
        ${rows.length?rows.map(x=>`<button class="wg-li" data-wga="plan" data-wgp="${x.k}|${esc(x.r.id)}"><span>${esc(String(x.r.t||'').slice(0,14))}${x.r.day?` · ${+x.r.day<td?'<i>прострочено</i>':esc(String(x.r.day))+'-го'}`:''}</span><b>${x.k==='in'?'+':'−'}${esc(moneyK(x.rest,rlRowCur(x.r)))}</b></button>`).join('')
          :`<button class="wg-li" data-wga="planadd"><span>План місяця порожній</span><b>＋</b></button>`}`);
    }
    if(t==='wgdebt'){
      const d=wgDebtNet(); let s=0, dc={ok:0,all:0}; try{ s=jnStreak(); dc=rlDiscipline(); }catch(_){}
      return wgTile('wide c-debt',`<button class="wg-hit" data-wga="debts" aria-label="Борги"></button>
        <span class="wg-h">🤝 Борги · 📖 Правила</span>
        <span class="wg-two"><span><b class="wg-big">${d.net>0?'+':''}${wgK(d.net)}</b><small>${d.owed||d.owe?'мені винні '+wgK(d.owed)+' · я винен '+wgK(d.owe):'боргів нема'}</small></span>
        <button class="wg-rules" data-wga="rules"><b>🔥 ${s} ${pluralUk(s,'день','дні','днів')}</b><small>${dc.all?'дисципліна '+Math.round(dc.ok/dc.all*100)+'%':'Книга правил ›'}</small></button></span>`);
    }
    if(t==='wgwork'){
      const i=typeof wkMoneyInfo==='function'?wkMoneyInfo(ym):null;
      if(!i) return '';
      return wgTile('wide c-work',`<button class="wg-hit" data-wga="work" aria-label="Робота — календар годин"></button>
        <span class="wg-h">⏱ Робота · ${esc(MO_NAMES[+ym.slice(5,7)-1].toLowerCase())}</span><b class="wg-big">${esc(moneyK(i.earned,i.cur))}</b>
        <small>${esc(String(Math.round(i.hours*10)/10).replace('.',','))} год · ${i.paid?'✓ зарплату записано':i.due?'тапни — запише зарплату':'виплата '+esc(String(i.pday))+'-го'}</small>`);
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
    else if(a==='work'){ try{ goWork(); }catch(_){} }
    else if(a==='rules'){ try{ rlBook(); }catch(_){} }
    else if(a==='folderops'){ if(fk) wlFolderSheet(fk); }
    else if(a==='cfg'){ if(id) wgMoneyCfg(id,false); }
    else if(a.slice(0,2)==='wd'){ wdAct(a,el,blk(),fk,id); }
    else if(a==='add'){ const b=blk(); if(!b||!fk) return; const g=wgFolderMission(fk);
      wlOpSheet(b.kind==='out'?'out':'in', g?String(g.id):'', {folderKey:fk, src:b.src, cur:b.cur, label:b.kind==='out'?'':(b.label||'')}); }
  }
  function wgFill(host,b,fk){
    host.dataset.wgfk=fk||'';
    let html=''; try{ html=wgHTML(b,fk); }catch(err){ console.error('wgHTML',err); }
    host.innerHTML=html||'<div class="wg-t c-none"><small>Віджет недоступний</small></div>';
    if(!host.__wgBound){ host.__wgBound=true; host.addEventListener('click',e=>wgAct(e,host)); }
  }
  // сторінка папки: хости від редактора; Гаманець — [data-wghome]
  function wgFillPage(root){
    const fk=wgCtxFolder();
    (root||document).querySelectorAll('[data-wghost]').forEach(h=>{ let b=null; try{ b=getBlock(h.dataset.wghost); }catch(_){} if(b) wgFill(h,b,fk); });
  }
  // плитки в Гаманці (вкладка «Огляд», під кнопками): картка балансу вже зверху, тож без «Гаманця»
  function wgWalletHTML(){ let w=false; try{ w=typeof wkMoneyInfo==='function'&&!!(wkMoneyInfo()||{}).has; }catch(_){}   // «⏱ Робота» — коли в календарі є години цього місяця
    return '<div class="wg-home wl-wg"><div class="wg-grid">'+(w?['wgmission','wgenv','wgwork','wgdebt']:['wgmission','wgenv','wgdebt']).map(t=>`<div class="wg-host" data-wghome="${t}"></div>`).join('')+'</div></div>'; }
  function wgHome(root){ (root||document).querySelectorAll('[data-wghome]').forEach(h=>wgFill(h,{type:h.dataset.wghome},'')); }
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

  /* ════════ «Дані» (10.10.2026): віджети-вікна в екосистему — Місія · Звичка · Час папки ════════
     Блок зберігає ЛИШЕ свої налаштування: sz ('s'|'m'|'l', + gw/gh для сітки дошки), goalId (місія; порожньо — місія цієї папки),
     period ('day'|'week'|'month'), show{ключ:false} — вимкнені рядки. Дані живуть у модулях (місії, трекер місії, Планер),
     віджет їх лише читає. Запис — тільки тапом людини і тими самими функціями, що й застосунок:
     позначка дня — moToggleMark, трекер — moAddTracker (43-month.js), новий блок Планера — plFolderAddBlock (15-flow-spot.js).
     Вставка в дошку віджетів (board з wboard:true) — page-editor/03-premium-pack.js → pgDataInsert. */
  const WD_SZ={s:{gw:6,gh:2,t:'S',d:'Половина'}, m:{gw:12,gh:2,t:'M',d:'Широкий'}, l:{gw:12,gh:4,t:'L',d:'Великий'}};
  const WD_META={
    dmission:{t:'Місія папки', h:'Місія', ic:'🎯', per:null, show:[['next','Наступний крок'],['due','Дедлайн'],['ring','Кільце прогресу']]},
    dhabit:{t:'Звичка папки', h:'Звичка', ic:'🔥', per:[['week','Тиждень'],['month','Місяць']], show:[['streak','Серія'],['count','Скільки днів'],['days','Дні періоду']]},
    dtime:{t:'Час папки', h:'Час', ic:'⏱', per:[['day','День'],['week','Тиждень'],['month','Місяць']], show:[['hours','Години'],['done','Виконані блоки'],['add','Кнопка «＋ блок»']]},
    dcal:{t:'Календар папки', h:'Календар', ic:'📅', per:null, show:[['hint','Підказка «тап по дню»']]}
  };
  const wdCalYm={};   // місяць, який гортає віджет «Календар папки» (лише памʼять)
  function wdIs(t){ return Object.prototype.hasOwnProperty.call(WD_META,String(t||'')); }
  function wdSz(b){ return b&&Object.prototype.hasOwnProperty.call(WD_SZ,String(b.sz||''))?b.sz:(b&&b.type==='dcal'?'l':b&&b.type==='dtime'?'m':'s'); }
  function wdPer(b){ const m=WD_META[b.type]; if(!m||!m.per) return ''; return m.per.some(x=>x[0]===b.period)?b.period:m.per[0][0]; }
  function wdOn(b,k){ return !(b&&b.show&&typeof b.show==='object'&&b.show[k]===false); }
  // новий блок із меню «Дані»: лише налаштування, без копії даних
  function wdInit(b,k){
    b.type=k; b.sz=wdSz(b); b.gw=WD_SZ[b.sz].gw; b.gh=WD_SZ[b.sz].gh;
    if(WD_META[k].per&&!b.period) b.period=k==='dtime'?'day':'week';
    delete b.text; return b;
  }
  // місія віджета: обрана в налаштуваннях (не архівна) → інакше місія цієї папки
  function wdGoal(b,fk){
    let g=null;
    if(b&&b.goalId) g=(goalsData.goals||[]).find(x=>x&&x.id&&String(x.id)===String(b.goalId)&&jnStatus(x)!=='archive')||null;
    return g||wgFolderMission(fk);
  }
  // наступний крок: перший невиконаний рівень, інакше перший невиконаний крок
  function wdNext(g){
    const n=jnLevels(g).find(m=>!m.done);
    if(n) return {t:String(n.t||''), due:/^\d{4}-\d{2}-\d{2}$/.test(n.due||'')?n.due:''};
    const st=(Array.isArray(g.steps)?g.steps:[]).find(x=>x&&!x.done&&!x.auto);
    return st?{t:String(st.name||''), due:''}:null;
  }
  // дедлайн: дата наступного рівня, інакше — найпізніша дата рівнів
  function wdDue(g){
    const n=wdNext(g); if(n&&n.due) return n.due;
    const ds=jnLevels(g).map(m=>m.due).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')).sort();
    return ds.length?ds[ds.length-1]:'';
  }
  function wdDaysLeft(ds){ return Math.round((new Date(ds+'T12:00:00')-new Date(ymdLocal()+'T12:00:00'))/864e5); }
  function wdFolder(fk){ return fk&&typeof folders!=='undefined'&&Object.prototype.hasOwnProperty.call(folders,fk)?folders[fk]:null; }
  // мітка папки в шапці — віджет завжди каже, з якої папки дані
  function wdHead(b,fk,extra){
    // віджет стоїть у своїй папці — назва папки в шапці зайва (вона вже в заголовку сторінки)
    const m=WD_META[b.type];
    return `<span class="wd-h"><i class="wd-dot"></i><b>${esc(m.h)}</b>${extra?`<span>${extra}</span>`:''}</span>`
      +`<button class="wd-cfg" data-wga="wdcfg" aria-label="Налаштувати віджет «${esc(m.t)}»"><span>⚙</span></button>`;
  }
  function wdTile(b,fk,inner,cls,color){
    const f=wdFolder(fk), c=safeColor(color||(f&&f.c)||'','#7c8cff');
    return `<div class="wg-t wd sz-${wdSz(b)}${cls?' '+cls:''}" style="--fc:${c}">${inner}</div>`;
  }
  function wdRing(p){ p=Math.max(0,Math.min(100,Math.round(+p||0)));
    return `<span class="wd-ring" aria-hidden="true"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" class="tr"/><circle cx="18" cy="18" r="15.5" class="vl" pathLength="100" stroke-dasharray="${p} 100"/></svg><b>${p}%</b></span>`; }
  function wdHm(h){ return String(Math.round((+h||0)*10)/10).replace('.',','); }
  // без місії: просимо повʼязати (у блоці зʼявиться лише goalId — саму місію не чіпаємо)
  function wdNoGoal(b,fk){
    const any=(goalsData.goals||[]).some(g=>g&&g.id&&jnStatus(g)!=='archive');
    return wdTile(b,fk,`${wdHead(b,fk)}<b class="wd-big sm">Місії ще нема</b>
      <small class="wd-sub">${any?'Вибери, яку місію показувати':'Створи місію в Журналі'}</small>
      <span class="wd-acts"><button data-wga="wdlink">${any?'Повʼязати місію':'Відкрити Журнал'}</button></span>`,'empty');
  }
  function wdLevels(g){
    const lv=jnLevels(g); if(!lv.length) return '';
    const i=Math.max(0,lv.findIndex(m=>!m.done)), sl=lv.slice(Math.max(0,i-1),i+3);
    return `<span class="wd-lv">${sl.map(m=>`<span class="${m.done?'ok':''}"><i>${m.done?'✓':'○'}</i>${esc(String(m.t||'').slice(0,40))}</span>`).join('')}</span>`;
  }

  // L-звичка: 4 тижні (Пн–Нд) до кінця поточного тижня — сітка, як на макеті ноутбука
  function wdHabGrid(mk,td){
    const end=new Date(td+'T12:00:00'); end.setDate(end.getDate()+(7-((end.getDay()+6)%7)-1));
    const rows=[]; for(let w=3;w>=0;w--){ const r=[]; for(let i=6;i>=0;i--){ const d=new Date(end); d.setDate(end.getDate()-w*7-i); const ds=ymdLocal(d); r.push(`<i class="${mk(ds)?'on':''}${ds===td?' td':''}${ds>td?' fut':''}"></i>`); } rows.push(`<span>${r.join('')}</span>`); }
    return `<span class="wd-hg" aria-hidden="true">${rows.join('')}</span>`;
  }
  // L-час: години папки по днях цього тижня (стовпчики), сьогодні виділено
  function wdWeekBars(mine,hrs,td){
    const by=jnWeek().map(ds=>({ds,h:mine(ds).reduce((s,x)=>s+hrs(x),0)})), mx=Math.max(1,...by.map(x=>x.h));
    return `<span class="wd-bars week">${by.map(x=>`<i class="${x.ds===td?'td':''}"><u style="height:${x.h?Math.max(10,Math.round(x.h/mx*100)):0}%"></u><s>${DY_DOW[(new Date(x.ds+'T12:00:00').getDay()+6)%7]}</s></i>`).join('')}</span>`;
  }
  function wdHTML(b,fk){
    const t=b.type, sz=wdSz(b), td=ymdLocal();
    if(t==='dmission'){
      const g=wdGoal(b,fk); if(!g) return wdNoGoal(b,fk);
      const pct=jnPct(g), nx=wdNext(g), due=wdDue(g), dl=due?wdDaysLeft(due):null;
      const dueTxt=due?jnDateTxt(due)+(dl<0?' · прострочено':dl===0?' · сьогодні':' · за '+dl+' '+pluralUk(dl,'день','дні','днів')):'';
      const ring=wdOn(b,'ring'), nm=esc(String(g.name||'Місія').slice(0,60)), em=safeEmoji(g.emoji,'🎯');
      const hit=`<button class="wg-hit" data-wga="wdpage" data-wgg="${esc(g.id)}" aria-label="Відкрити місію ${esc(g.name||'')}"></button>`;
      const col=wdFolder(fk)?'':g.color;
      // S — макет «кільце по центру + назва під ним»; M/L — кільце ліворуч, праворуч назва, наступний крок і дедлайн
      if(sz==='s') return wdTile(b,fk,`${hit}${wdHead(b,fk)}
        ${ring?`<span class="wd-ringc">${wdRing(pct)}</span>`:`<b class="wd-big">${pct}%</b><span class="wd-bar"><i style="width:${pct}%"></i></span>`}
        <small class="wd-cap">${nm}</small>`,'mis',col);
      return wdTile(b,fk,`${hit}${wdHead(b,fk)}
        <span class="wd-row">${ring?wdRing(pct):`<b class="wd-big">${pct}%</b>`}<span class="wd-col"><b class="wd-name">${em} ${nm}</b>
          ${wdOn(b,'next')?`<small class="wd-sub"><em>Далі:</em> ${nx?esc(nx.t.slice(0,80)):'усі кроки зроблено ✓'}</small>`:''}
          ${wdOn(b,'due')&&dueTxt?`<small class="wd-sub${dl<0?' late':''}"><em>Дедлайн:</em> ${esc(dueTxt)}</small>`:''}</span></span>
        ${ring?'':`<span class="wd-bar"><i style="width:${pct}%"></i></span>`}
        ${sz==='l'?wdLevels(g):''}`,'mis',col);
    }
    if(t==='dhabit'){
      const g=wdGoal(b,fk); if(!g) return wdNoGoal(b,fk);
      const gk=moOwnFolder(g.folderKey)?g.folderKey:'', tr=gk?moTracker(gk):null;
      const name=`<b class="wd-name">${safeEmoji(g.emoji,'🎯')} ${esc(String(g.name||'Місія').slice(0,40))}</b>`;
      if(!gk) return wdTile(b,fk,`<button class="wg-hit" data-wga="wdpage" data-wgg="${esc(g.id)}" data-wgtab="folder" aria-label="Відкрити папку місії"></button>${wdHead(b,fk)}${name}
        <small class="wd-sub">Позначки місії живуть у її папці — привʼяжи папку на сторінці місії.</small>`,'empty',g.color);
      if(!tr) return wdTile(b,fk,`${wdHead(b,fk)}${name}<small class="wd-sub">У папці місії ще нема трекера днів.</small>
        <span class="wd-acts"><button data-wga="wdtrk">＋ Трекер</button></span>`,'empty',folders[gk].c);
      const per=wdPer(b), mk=ds=>moMarked(tr,ds);
      const days=per==='month'?Array.from({length:moDim(td.slice(0,7))},(_,i)=>td.slice(0,8)+String(i+1).padStart(2,'0')):jnWeek();
      const past=days.filter(ds=>ds<=td), n=past.filter(mk).length;
      let st=0; { const d=new Date(); if(!mk(ymdLocal(d))) d.setDate(d.getDate()-1); for(let i=0;i<400&&mk(ymdLocal(d));i++){ st++; d.setDate(d.getDate()-1); } }
      const on=mk(td);
      // макет: велике число серії, підпис, 7 крапок тижня (місяць — сітка), обведена кнопка «✓ Сьогодні»
      const big=wdOn(b,'streak')?`<span class="wd-strk"><b class="wd-big xl">${st}</b><small class="wd-cap">${pluralUk(st,'день','дні','днів')}<br>поспіль</small></span>`:'';
      const cnt=wdOn(b,'count')&&(sz==='l'||!wdOn(b,'streak'))?`<small class="wd-sub"><em>${n} з ${past.length}</em> ${per==='month'?'цього місяця':'цього тижня'}</small>`:'';
      const dots=wdOn(b,'days')?`<span class="wd-days ${per}">${days.map(ds=>`<i class="${mk(ds)?'on':''}${ds===td?' td':''}${ds>td?' fut':''}"><u></u>${per==='week'?`<s>${DY_DOW[(new Date(ds+'T12:00:00').getDay()+6)%7]}</s>`:''}</i>`).join('')}</span>`:'';
      return wdTile(b,fk,`<button class="wg-hit" data-wga="wdpage" data-wgg="${esc(g.id)}" data-wgtab="folder" aria-label="Трекер місії ${esc(g.name||'')}"></button>
        ${wdHead(b,fk)}${sz==='l'?name:''}${big}${cnt}${dots}${sz==='l'?wdHabGrid(mk,td):''}
        <span class="wd-acts c"><button data-wga="wdmark" class="pill${on?' on':''}" aria-pressed="${on}">✓ Сьогодні${on?' є':''}</button></span>`,'hab',folders[gk].c);
    }
    if(t==='dcal'){
      // календар Планера, але лише ця папка: її блоки (смужки кольору) і події (★); місяць гортається в памʼяті, не пишеться
      if(!fk) return wdTile(b,'',`${wdHead(b,'')}<b class="wd-big sm">Лише в папці</b><small class="wd-sub">Показує блоки й події з міткою папки</small>`,'empty');
      const ym=wdCalYm[b.id]||td.slice(0,7);
      return wdTile(b,fk,`${wdHead(b,fk,esc(MO_NAMES[+ym.slice(5,7)-1].toLowerCase())+(ym.slice(0,4)!==td.slice(0,4)?' '+ym.slice(0,4):''))}
        <span class="cal-nav"><button data-wga="wdcalnav" data-n="-1" aria-label="Попередній місяць">‹</button><button data-wga="wdcalnav" data-n="0">Сьогодні</button><button data-wga="wdcalnav" data-n="1" aria-label="Наступний місяць">›</button></span>
        ${calMonthGridHTML(ym,fk)}
        ${wdOn(b,'hint')?'<small class="wd-sub cal-hint">Тап по дню — події й блоки папки</small>':''}`,'calw');
    }
    if(t==='dtime'){
      if(!fk) return wdTile(b,'',`${wdHead(b,'')}<b class="wd-big sm">Лише в папці</b><small class="wd-sub">Час рахується з блоків Планера з міткою папки</small>`,'empty');
      const per=wdPer(b), shown=x=>x&&x.folder===fk&&(wdOn(b,'done')||!x.done);
      const mine=ds=>plBlocksDisplay(ds).filter(shown).sort((a,c)=>(+a.h||0)-(+c.h||0));
      const hrs=x=>Math.max(0,Math.min(plBlockEnd(x),24)-(+x.h||0));
      const add=wdOn(b,'add')?`<span class="wd-acts"><button data-wga="wdadd">＋ блок</button></span>`:'';
      if(per==='day'){
        const bs=mine(td), dn=bs.filter(x=>x.done).length, h=bs.reduce((s,x)=>s+hrs(x),0);
        const now=new Date(), nowH=now.getHours()+now.getMinutes()/60;
        const pd=plData(), d0=Math.max(0,Math.min(23,+pd.dayStart||8)), d1=Math.max(d0+1,Math.min(24,+pd.dayEnd||22)), span=d1-d0;
        // смуга дня з макета: межі робочого дня Планера, блоки папки — сегменти, «зараз» — риска
        const seg=bs.map(x=>{ const s0=Math.max(d0,+x.h||0), s1=Math.min(d1,plBlockEnd(x)); if(s1<=s0) return '';
          return `<i class="${x.done?'done':''}" style="left:${((s0-d0)/span*100).toFixed(1)}%;width:${((s1-s0)/span*100).toFixed(1)}%"></i>`; }).join('');
        const nowM=nowH>=d0&&nowH<=d1?`<b style="left:${((nowH-d0)/span*100).toFixed(1)}%"></b>`:'';
        const tl=`<span class="wd-tl"><em>${plHM(d0)}</em><span class="wd-tlb">${seg}${nowM}</span><em>${plHM(d1)}</em></span>`;
        const list=sz==='l'?bs.slice(0,6):bs.filter(x=>!x.done&&plBlockEnd(x)>nowH).slice(0,1);   // S/M — найближчий блок, L — увесь день
        const rows=list.length?`<span class="wd-list">${list.map(x=>`<span class="${x.done?'done':''}"><em>${plHM(+x.h||0)}</em>${esc(String(x.t||'Блок').slice(0,40))}</span>`).join('')}</span>`
          :`<small class="wd-sub">${bs.length?'на сьогодні все ✓':'Сьогодні блоків папки нема'}</small>`;
        const addB=wdOn(b,'add')?`<button data-wga="wdadd" class="pill">＋ блок</button>`:'';
        return wdTile(b,fk,`<button class="wg-hit" data-wga="wdday" aria-label="План папки на сьогодні"></button>
          ${wdHead(b,fk,'сьогодні')}
          <b class="wd-big">${bs.length} <span>${pluralUk(bs.length,'блок','блоки','блоків')}${wdOn(b,'hours')&&bs.length?' · '+wdHm(h)+' год':''}${dn?' · '+dn+' ✓':''}</span></b>
          ${sz!=='s'?tl:''}
          ${sz==='l'?wdWeekBars(mine,hrs,td):''}
          <span class="wd-foot">${rows}${addB?`<span class="wd-acts">${addB}</span>`:''}</span>`,'tim');
      }
      const days=per==='month'?plMonthWeeks(td.slice(0,7)).flat().filter(Boolean):jnWeek();
      let n=0,h=0; const by=days.map(ds=>{ const bs=mine(ds), hh=bs.reduce((s,x)=>s+hrs(x),0); n+=bs.length; h+=hh; return {ds,bs,h:hh}; });
      const mx=Math.max(1,...by.map(x=>x.h));
      const bars=sz!=='s'?`<span class="wd-bars ${per}">${by.map(x=>`<i class="${x.ds===td?'td':''}"><u style="height:${x.h?Math.max(10,Math.round(x.h/mx*100)):0}%"></u>${per==='week'?`<s>${DY_DOW[(new Date(x.ds+'T12:00:00').getDay()+6)%7]}</s>`:''}</i>`).join('')}</span>`:'';
      let up='';
      if(sz==='l'){ const u=[]; by.forEach(x=>{ if(x.ds>=td) x.bs.forEach(y=>{ if(!y.done&&u.length<3) u.push({ds:x.ds,b:y}); }); });
        up=u.length?`<span class="wd-list">${u.map(x=>`<span><em>${x.ds===td?'сьогодні':esc(jnDateTxt(x.ds))} ${plHM(+x.b.h||0)}</em>${esc(String(x.b.t||'Блок').slice(0,34))}</span>`).join('')}</span>`:''; }
      return wdTile(b,fk,`<button class="wg-hit" data-wga="wdmonth" aria-label="Календар папки"></button>
        ${wdHead(b,fk,per==='month'?esc(MO_NAMES[+td.slice(5,7)-1].toLowerCase()):'тиждень')}
        <b class="wd-big">${n} <span>${pluralUk(n,'блок','блоки','блоків')}${wdOn(b,'hours')?' · '+wdHm(h)+' год':''}</span></b>
        ${bars}${up}${add}`);
    }
    return '';
  }

  // перемалювати після дії: сторінка (розмір клітинки міг змінитись) + усі видимі віджети
  function wdRedraw(){ try{ if(window.__pgWidgetsSync) window.__pgWidgetsSync(); }catch(_){} wgRefresh(); }
  function wdAct(a,el,b,fk,id){
    if(!b||!wdIs(b.type)) return;
    if(a==='wdcfg') wdCfg(id);
    else if(a==='wdlink') wdPickMission(id);
    else if(a==='wdpage'){ const q=wlGoal(el.dataset.wgg); if(q){ try{ moMissionPage(q,el.dataset.wgtab||'path'); }catch(_){} } }
    else if(a==='wdmark'){
      const q=wdGoal(b,fk), k=q&&moOwnFolder(q.folderKey)?q.folderKey:'';
      const r=moToggleMark(k,ymdLocal());   // той самий запис, що й тап по дню на сторінці місії
      if(r===null){ plToast('Не вийшло позначити — відкрий трекер місії'); return; }
      try{ window.platform.haptic('light'); }catch(_){}
      plToast(r?'✓ Позначено в трекері місії':'Позначку за сьогодні знято'); wdRedraw();
    }
    else if(a==='wdtrk'){ const q=wdGoal(b,fk); if(q&&moAddTracker(q.folderKey,q)){ plToast('Трекер додано в папку місії'); wdRedraw(); } }
    else if(a==='wdadd'){ if(fk) plFolderAddBlock(fk); }
    else if(a==='wdday'){ if(fk) plFolderDaySheet(fk); }
    else if(a==='wdmonth'){ if(fk) plFolderMonthSheet(fk); }
    else if(a==='wdcalnav'){ const n=+el.dataset.n||0, cur=wdCalYm[b.id]||ymdLocal().slice(0,7); wdCalYm[b.id]=n?moShift(cur,n):ymdLocal().slice(0,7); wgRefresh(); }
    else if(a==='wdcalday'){ const ds=el.dataset.ds; if(fk&&/^\d{4}-\d{2}-\d{2}$/.test(ds||'')) calDaySheet(ds,{folder:fk,onOpenDay:d=>{ try{ goJournal({tab:'day',ds:d}); }catch(_){} }}); }
  }

  // ── ⚙ налаштування віджета: Розмір · Джерело · Період · Показувати · Видалити ──
  function wdCfg(id){
    let b=null; try{ b=getBlock(id); }catch(_){} if(!b||!wdIs(b.type)) return;
    const m=WD_META[b.type], fk=wgCtxFolder(), fm=wgFolderMission(fk), goals=(b.type==='dtime'||b.type==='dcal')?[]:wlMissions();
    let sz=wdSz(b), per=wdPer(b), gid=b.goalId&&goals.some(g=>String(g.id)===String(b.goalId))?String(b.goalId):'';
    const show={}; m.show.forEach(([k])=>{ show[k]=wdOn(b,k); });
    jnOverlay(`<div class="jn-ed-h"><b>${m.ic} ${esc(m.t)}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Віджет — вікно в ${(b.type==='dtime'||b.type==='dcal')?'Планер':'місію'}: дані не копіюються, тут лише його вигляд.</small>
      <div class="jn-f"><span>Розмір</span><div class="wd-szs">${Object.keys(WD_SZ).map(k=>`<button data-wdsz="${k}" class="${k===sz?'on':''}" aria-pressed="${k===sz}"><i class="wd-szi ${k}"></i><b>${WD_SZ[k].t}</b><small>${WD_SZ[k].d}</small></button>`).join('')}</div></div>
      ${(b.type!=='dtime'&&b.type!=='dcal')?`<div class="jn-f"><span>Джерело</span><div class="wl-chips">
        <button data-wdg="" class="${gid?'':'on'}">📁 Місія цієї папки${fm?' · '+esc(String(fm.name||'').slice(0,20)):' (нема)'}</button>
        ${goals.map(g=>`<button data-wdg="${esc(g.id)}" class="${String(g.id)===gid?'on':''}">${safeEmoji(g.emoji,'🎯')} ${esc(String(g.name||'Місія').slice(0,24))}</button>`).join('')}</div></div>`:''}
      ${m.per?`<div class="jn-f"><span>Період</span><div class="wl-chips">${m.per.map(([k,l])=>`<button data-wdper="${k}" class="${k===per?'on':''}">${l}</button>`).join('')}</div></div>`:''}
      <div class="jn-f"><span>Показувати</span><div class="wd-tg">${m.show.map(([k,l])=>`<button data-wdsh="${k}" role="switch" aria-checked="${show[k]}" class="${show[k]?'on':''}"><span>${l}</span><i></i></button>`).join('')}</div></div>
      <div class="jn-ed-foot"><button class="jn-btn" data-wdok>Зберегти</button></div>
      <button class="wd-del" data-wddel>Видалити віджет</button>`, ov=>{
      ov.classList.add('wd-ov');
      const pick=(sel,fn)=>ov.querySelectorAll(sel).forEach(x=>x.onclick=()=>{ fn(x);
        ov.querySelectorAll(sel).forEach(y=>{ y.classList.toggle('on',y===x); if(y.hasAttribute('aria-pressed')) y.setAttribute('aria-pressed',String(y===x)); }); });
      pick('[data-wdsz]',x=>{ sz=x.dataset.wdsz; });
      pick('[data-wdg]',x=>{ gid=x.dataset.wdg; });
      pick('[data-wdper]',x=>{ per=x.dataset.wdper; });
      ov.querySelectorAll('[data-wdsh]').forEach(x=>x.onclick=()=>{ const k=x.dataset.wdsh; show[k]=!show[k]; x.classList.toggle('on',show[k]); x.setAttribute('aria-checked',String(show[k])); });
      ov.querySelector('[data-wdok]').onclick=()=>{
        const q=getBlock(id); if(!q){ ov.remove(); return; }
        q.sz=sz; q.gw=WD_SZ[sz].gw; q.gh=WD_SZ[sz].gh;
        if(q.type!=='dtime'&&q.type!=='dcal'){ if(gid) q.goalId=gid; else delete q.goalId; }
        if(m.per) q.period=per;
        const off={}; Object.keys(show).forEach(k=>{ if(!show[k]) off[k]=false; });
        if(Object.keys(off).length) q.show=off; else delete q.show;
        saveBoard(); ov.remove(); wdRedraw();
      };
      // прибирає лише вікно; місія, трекер і блоки Планера лишаються
      ov.querySelector('[data-wddel]').onclick=()=>{
        const arr=findParentArr(curBoard(),id), i=arr?arr.findIndex(x=>x&&String(x.id)===String(id)):-1;
        if(i>=0){
          const was=arr.splice(i,1)[0]; saveBoard();
          // «Скасувати» повертає саме вікно на те саме місце (дані модулів і так не чіпали)
          flowUndoToast('Віджет прибрано — дані в '+((b.type==='dtime'||b.type==='dcal')?'Планері':'місії')+' лишились',()=>{
            if(arr.some(x=>x&&String(x.id)===String(was.id))) return;
            arr.splice(Math.min(i,arr.length),0,was); saveBoard(); wdRedraw();
          });
        }
        ov.remove(); wdRedraw();
      };
    });
  }
  // «Повʼязати місію»: у блок пишеться лише goalId
  function wdPickMission(id){
    const goals=wlMissions();
    if(!goals.length){ try{ goJournal({tab:'day'}); }catch(_){} return; }
    jnOverlay(`<div class="jn-ed-h"><b>Повʼязати місію</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Віджет показуватиме цю місію. Сама місія не змінюється.</small>
      <div class="wd-pick">${goals.map(g=>`<button data-wdg="${esc(g.id)}" style="--fc:${safeColor(g.color,'#7c8cff')}"><span>${safeEmoji(g.emoji,'🎯')}</span><b>${esc(String(g.name||'Місія').slice(0,40))}</b><small>${jnPct(g)}%</small></button>`).join('')}</div>`, ov=>{
      ov.querySelectorAll('[data-wdg]').forEach(x=>x.onclick=()=>{ const q=getBlock(id); if(q&&wdIs(q.type)){ q.goalId=x.dataset.wdg; saveBoard(); } ov.remove(); wdRedraw(); });
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
