  /* ════════ Віджети «Гроші» (48-widgets.js, 09.10.2026) ════════
     Вигляд A «Плитки» (як віджети iPhone). Віджет — ВІКНО в Гаманець: даних одна копія (finOps, конверти,
     місії, План місяця, правила), віджет лише показує їх і відкриває ті самі шторки. Запис — лише тапом людини.
     Типи блоків сторінки папки (boards): wgwallet · wgmission · wgenv · wgdebt · wgmoney{kind:'in'|'out', src, label, goal}.
     «Доходи»/«Витрати» (wgmoney) — поєднання A+C: операції з них мають мітку папки (op.folderKey) і тип доходу (op.src);
     у папці місії — ще й мітку місії. У Гаманці (вкладка «Огляд») — Місія · Конверти · Борги й правила (10.10.2026: з Огляду прибрано в ⚙ Огляду, folderOpts.money).
     Хост на сторінці: <div data-wghost="id"> (page-editor/02-block-styles.js), у Гаманці — [data-wghome] (wlRender). */

  const WG_TYPES={wgwallet:1, wgmission:1, wgenv:1, wgdebt:1, wgmoney:1, wgwork:1, dmission:1, dhabit:1, dtime:1, dcal:1, dcount:1, dsave:1, dcounter:1, dphoto:1, countdown:1};   // d* — «Дані» (нижче)
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
      const ops=wlMonthOps(ym).filter(o=>inFolderOp(o,fk)&&(o.cur||'')===cur&&(kind==='in'?_isIncAny(o)&&wlSrc(o)===src:_isExpAny(o)));
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
    dcal:{t:'Календар папки', h:'Календар', ic:'📅', per:null, show:[['hint','Підказка «тап по дню»']]},
    /* прогрес місії (15.11.2026): Відлік · Скарбничка · Лічильник — так само вікна в місію, даних одна копія */
    dcount:{t:'Відлік до мети', h:'Відлік', ic:'⏳', per:null, show:[['date','Дата'],['next','Наступна віха']]},
    dsave:{t:'Скарбничка місії', h:'Скарбничка', ic:'🐷', per:null, show:[['bar','Смужка'],['spent','Витрачено на місію'],['add','Кнопка «＋ ₴»']]},
    dcounter:{t:'Лічильник місії', h:'Лічильник', ic:'🔢', per:null, show:[['bar','Смужка'],['minus','Кнопка «−»']]},
    dphoto:{t:'Фото-прогрес', h:'Фото', ic:'📸', per:null, show:[['dates','Дати під фото'],['count','Скільки фото й днів']]},
    /* відлік часу (17.11.2026): старий блок countdown — тепер віджет; своя дата, без місії (tmHTML нижче) */
    countdown:{t:'Відлік часу', h:'Відлік', ic:'⏳', per:null, show:[['date','Дата під цифрами']]}
  };
  const wdCalYm={};   // місяць, який гортає віджет «Календар папки» (лише памʼять)
  function wdIs(t){ return Object.prototype.hasOwnProperty.call(WD_META,String(t||'')); }
  function wdSz(b){ return b&&Object.prototype.hasOwnProperty.call(WD_SZ,String(b.sz||''))?b.sz:(b&&b.type==='dcal'?'l':b&&(b.type==='dtime'||b.type==='dphoto'||b.type==='countdown')?'m':'s'); }
  function wdPer(b){ const m=WD_META[b.type]; if(!m||!m.per) return ''; return m.per.some(x=>x[0]===b.period)?b.period:m.per[0][0]; }
  function wdOn(b,k){ return !(b&&b.show&&typeof b.show==='object'&&b.show[k]===false); }
  // новий блок із меню «Дані»: лише налаштування, без копії даних
  function wdInit(b,k){
    b.type=k; b.sz=wdSz(b); b.gw=WD_SZ[b.sz].gw; b.gh=WD_SZ[b.sz].gh;
    if(WD_META[k].per&&!b.period) b.period=k==='dtime'?'day':'week';
    delete b.text;
    if(k==='countdown'){ const bid=b.id; setTimeout(()=>{ try{ tmCfg(bid); }catch(_){} },450); }   // новий відлік — одразу спитати назву й дату
    return b;
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
    if(t==='countdown') return tmHTML(b,fk);
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
      return wdTile(b,fk,`${hit}${wdHead(b,fk,'🔗 місія')}
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
        ${wdHead(b,fk,sz==='s'?'':'🔗 трекер місії')}${sz==='l'?name:''}${big}${cnt}${dots}${sz==='l'?wdHabGrid(mk,td):''}
        <span class="wd-acts c"><button data-wga="wdmark" class="pill${on?' on':''}" aria-pressed="${on}">✓ Сьогодні${on?' є':''}</button></span>`,'hab',folders[gk].c);
    }
    if(t==='dcal'){
      // календар Планера, але лише ця папка: її блоки (смужки кольору) і події (★); місяць гортається в памʼяті, не пишеться
      if(!fk) return wdTile(b,'',`${wdHead(b,'')}<b class="wd-big sm">Лише в папці</b><small class="wd-sub">Показує блоки й події з міткою папки</small>`,'empty');
      const ym=wdCalYm[b.id]||td.slice(0,7);
      return wdTile(b,fk,`${wdHead(b,fk,'🔗 Планер · '+esc(MO_NAMES[+ym.slice(5,7)-1].toLowerCase())+(ym.slice(0,4)!==td.slice(0,4)?' '+ym.slice(0,4):''))}
        <span class="cal-nav"><button data-wga="wdcalnav" data-n="-1" aria-label="Попередній місяць">‹</button><button data-wga="wdcalnav" data-n="0">Сьогодні</button><button data-wga="wdcalnav" data-n="1" aria-label="Наступний місяць">›</button></span>
        ${calMonthGridHTML(ym,fk)}
        ${wdOn(b,'hint')?'<small class="wd-sub cal-hint">Тап по дню — події й блоки папки</small>':''}`,'calw');
    }
    if(t==='dtime'){
      if(!fk) return wdTile(b,'',`${wdHead(b,'')}<b class="wd-big sm">Лише в папці</b><small class="wd-sub">Час рахується з блоків Планера з міткою папки</small>`,'empty');
      const per=wdPer(b), shown=x=>inFolderBlock(x,fk)&&(wdOn(b,'done')||!x.done);
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
        // рядок блоку: тап — підпункти (49-calendar.js); у L найближчий блок розгорнуто чеклістом
        const sb=x=>{ const c=subCount(x); return c.n?`<i class="wd-sb">☑ ${c.d}/${c.n}</i>`:''; };
        const subs=x=>{ const L=subList(x).slice(0,5); return L.length?`<span class="wd-subs">${L.map(q=>`<button data-wga="wdsubck" data-ds="${td}" data-bid="${esc(x.id)}" data-sid="${esc(q.id)}" class="${q.done?'on':''}" role="checkbox" aria-checked="${!!q.done}"><i>${q.done?'✓':''}</i>${esc(q.t.slice(0,40))}</button>`).join('')}</span>`:''; };
        const firstOpen=list.find(x=>!x.done);
        const rows=list.length?`<span class="wd-list">${list.map(x=>`<button data-wga="wdsub" data-ds="${td}" data-bid="${esc(x.id)}" class="wd-row-b${x.done?' done':''}"><em>${plHM(+x.h||0)}</em><span>${esc(String(x.t||'Блок').slice(0,40))}</span>${sb(x)}</button>${sz==='l'&&x===firstOpen?subs(x):''}`).join('')}</span>`
          :`<small class="wd-sub">${bs.length?'на сьогодні все ✓':'Сьогодні блоків папки нема'}</small>`;
        const addB=wdOn(b,'add')?`<button data-wga="wdadd" class="pill">＋ блок</button>`:'';
        return wdTile(b,fk,`<button class="wg-hit" data-wga="wdday" aria-label="План папки на сьогодні"></button>
          ${wdHead(b,fk,sz==='s'?'сьогодні':'🔗 Планер · сьогодні')}
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
        ${wdHead(b,fk,(sz==='s'?'':'🔗 Планер · ')+(per==='month'?esc(MO_NAMES[+td.slice(5,7)-1].toLowerCase()):'тиждень'))}
        <b class="wd-big">${n} <span>${pluralUk(n,'блок','блоки','блоків')}${wdOn(b,'hours')?' · '+wdHm(h)+' год':''}</span></b>
        ${bars}${up}${add}`);
    }
    if(t==='dcount'){
      // відлік до фінішу місії: остання дата її віх (віха без дня — кінець її місяця)
      const g=wdGoal(b,fk); if(!g) return wdNoGoal(b,fk);
      const fin=wdFinal(g), nm=esc(String(g.name||'Місія').slice(0,60)), col=wdFolder(fk)?'':g.color;
      const hit=`<button class="wg-hit" data-wga="wdpage" data-wgg="${esc(g.id)}" aria-label="Відкрити місію ${esc(g.name||'')}"></button>`;
      if(!fin) return wdTile(b,fk,`${hit}${wdHead(b,fk)}<b class="wd-name">${nm}</b>
        <small class="wd-sub">У місії ще нема дати фінішу</small>
        <span class="wd-acts"><button data-wga="wdpage" data-wgg="${esc(g.id)}">Задати дату</button></span>`,'empty',col);
      const dl=wdDaysLeft(fin);
      const big=dl>0?`<b class="wd-big xl">${dl}</b><small class="wd-cap">${pluralUk(dl,'день','дні','днів')} лишилось</small>`
        :dl===0?`<b class="wd-big">Сьогодні</b><small class="wd-cap">день фінішу</small>`
        :`<b class="wd-big sm">Час вийшов</b><small class="wd-sub late">${-dl} ${pluralUk(-dl,'день','дні','днів')} тому</small>`;
      const nx=wdNext(g), nxd=nx&&nx.due&&nx.due!==fin?wdDaysLeft(nx.due):null;
      const next=wdOn(b,'next')&&nxd!==null&&sz!=='s'?`<small class="wd-sub"><em>Далі:</em> ${esc(nx.t.slice(0,50))} · ${nxd<0?'прострочено':nxd===0?'сьогодні':'за '+nxd+' '+pluralUk(nxd,'день','дні','днів')}</small>`:'';
      return wdTile(b,fk,`${hit}${wdHead(b,fk,sz==='s'?'':'🔗 місія')}${sz!=='s'?`<b class="wd-name">${nm}</b>`:''}
        <span class="wd-cnt">${big}</span>
        ${wdOn(b,'date')?`<small class="wd-sub">${sz==='s'?nm+' · ':'Фініш: '}${esc(jnDateTxt(fin))}</small>`:''}${next}
        ${sz==='l'?wdLevels(g):''}`,'cnt',col);
    }
    if(t==='dsave'){
      // скарбничка: доходи Гаманця з міткою місії за весь час (головна валюта), ціль — поле місії saveGoal
      const g=wdGoal(b,fk); if(!g) return wdNoGoal(b,fk);
      const a=wlAgg((finOps||[]).filter(o=>o&&!String(o.id||'').startsWith('start_')),g.id), goal=wdSaveGoal(g);
      const pct=goal?Math.max(0,Math.min(100,Math.round(a.inc/goal*100))):0, col=wdFolder(fk)?'':g.color;
      const sum=sz==='s'?wgK(a.inc):wgMoney(a.inc);
      const add=wdOn(b,'add')?`<button data-wga="wdsavein">＋ ${esc(curSym())}</button>`:'';
      return wdTile(b,fk,`<button class="wg-hit" data-wga="mission" data-wgg="${esc(g.id)}" aria-label="Гроші місії ${esc(g.name||'')}"></button>
        ${wdHead(b,fk,sz==='s'?'':'🔗 Гаманець')}${sz==='l'?`<b class="wd-name">${safeEmoji(g.emoji,'🎯')} ${esc(String(g.name||'Місія').slice(0,60))}</b>`:''}
        <b class="wd-big">${esc(sum)}${goal?` <span>${pct}%</span>`:''}</b>
        ${goal&&wdOn(b,'bar')?`<span class="wd-bar"><i style="width:${pct}%"></i></span>`:''}
        ${goal?`<small class="wd-sub">з ${esc(sz==='s'?wgK(goal):wgMoney(goal))}${a.inc>=goal?' · зібрано ✓':''}${sz==='m'?' · '+esc(String(g.name||'Місія').slice(0,30)):''}</small>`:''}
        ${wdOn(b,'spent')&&a.out>0&&sz!=='s'?`<small class="wd-sub">Витрачено на місію: ${esc(wgMoney(a.out))}</small>`:''}
        <span class="wd-acts">${add}${goal?'':`<button data-wga="wdsavegoal">Ціль</button>`}</span>`,'sav',col);
    }
    if(t==='dcounter'){
      // лічильник: «число місії» (від → до) або власні лічильники місії (g.counters)
      const g=wdGoal(b,fk); if(!g) return wdNoGoal(b,fk);
      const L=wdCounters(g), c=L.find(x=>x.id===String(b.cid||''))||L[0], col=wdFolder(fk)?'':g.color;
      if(!c) return wdTile(b,fk,`${wdHead(b,fk)}<b class="wd-name">${esc(String(g.name||'Місія').slice(0,60))}</b>
        <small class="wd-sub">Рахуй будь-що: слова, сторінки, кілограми, пробіжки</small>
        <span class="wd-acts"><button data-wga="wdcnew">＋ Лічильник</button></span>`,'empty',col);
      const pct=wdCntPct(c), u=c.unit?' '+esc(c.unit):'';
      return wdTile(b,fk,`<button class="wg-hit" data-wga="wdcsheet" aria-label="Лічильник «${esc(c.t)}»: змінити"></button>
        ${wdHead(b,fk,sz==='s'?'':esc(c.t.slice(0,24)))}
        <b class="wd-big">${esc(wdNumTxt(c.v))}${c.to!==null?` <span>з ${esc(wdNumTxt(c.to))}${u}</span>`:u?` <span>${u}</span>`:''}</b>
        ${pct!==null&&wdOn(b,'bar')?`<span class="wd-bar"><i style="width:${pct}%"></i></span>`:''}
        ${sz==='s'?`<small class="wd-cap">${esc(c.t)}</small>`:''}
        ${sz!=='s'?`<small class="wd-sub">${pct!==null?pct+'% шляху':'без мети'} · ${esc(String(g.name||'Місія').slice(0,40))}</small>`:''}
        <span class="wd-acts">${wdOn(b,'minus')?`<button data-wga="wdcstep" data-n="-1" aria-label="Мінус ${esc(wdNumTxt(c.step))}">−</button>`:''}<button data-wga="wdcstep" data-n="1" aria-label="Плюс ${esc(wdNumTxt(c.step))}">＋${c.step!==1?esc(wdNumTxt(c.step)):'1'}</button></span>`,'ctr',col);
    }
    if(t==='dphoto'){
      // «було → стало»: перше фото місії поруч з останнім; усі — у галереї по тапу. Фото живуть у місії (g.photos), знімок — у сховищі фото
      const g=wdGoal(b,fk); if(!g) return wdNoGoal(b,fk);
      const L=wdPhotos(g), col=wdFolder(fk)?'':g.color, gid=esc(g.id);
      const nm=esc(String(g.name||'Місія').slice(0,40));
      if(!L.length) return wdTile(b,fk,`${wdHead(b,fk)}<b class="wd-name">${nm}</b>
        <small class="wd-sub">Перше фото стане точкою «було»</small>
        <span class="wd-acts"><button data-wga="wdphadd">＋ Фото</button></span>`,'empty',col);
      const first=L[0], last=L[L.length-1], dates=wdOn(b,'dates');
      const fr=(p,lbl)=>`<span class="wd-ph"><i style="background-image:url('${esc(safeImg(p.ref))}')"></i>${dates?`<s>${lbl} · ${esc(jnDateTxt(p.ds))}</s>`:''}</span>`;
      const add=`<button class="wd-ph-add" data-wga="wdphadd" aria-label="Додати фото"><span>＋</span></button>`;
      // одне фото: «було» є, праворуч — рамка під наступне
      const pair=sz==='s'?fr(last,L.length>1?'зараз':'було')
        :L.length===1?fr(first,'було')+`<button class="wd-ph wd-ph-new" data-wga="wdphadd"><span>＋</span><s>Нове фото</s></button>`
        :fr(first,'було')+fr(last,'зараз');
      const days=Math.max(0,Math.round((new Date(last.ds+'T12:00:00')-new Date(first.ds+'T12:00:00'))/864e5));
      const strip=sz==='l'&&L.length>2?`<span class="wd-ph-strip">${L.slice(-5,-1).reverse().map(p=>`<i style="background-image:url('${esc(safeImg(p.ref))}')"></i>`).join('')}</span>`:'';
      return wdTile(b,fk,`<button class="wg-hit" data-wga="wdphgal" aria-label="Усі фото місії ${nm}"></button>
        ${wdHead(b,fk,sz==='s'?'':esc(String(g.name||'').slice(0,24)))}
        <span class="wd-pair${sz==='s'?' one':''}">${pair}</span>${strip}
        <span class="wd-ph-foot">${sz==='s'||L.length>1?add:''}${wdOn(b,'count')?`<small class="wd-sub">${L.length} ${pluralUk(L.length,'фото','фото','фото')}${days?' · '+days+' '+pluralUk(days,'день','дні','днів')+(sz==='s'?'':' шляху'):''}</small>`:''}</span>`,'pho',col);
    }
    return '';
  }

  // ── прогрес місії: допоміжне ──
  // фото місії від найстарішого: лише посилання на сховище фото (idb:), з датою
  function wdPhotos(g){
    // лише СВОЇ знімки (gp_…, ref = idb:+id): підроблений імпорт не підсуне сюди обкладинку папки, яку «🗑» стер би й з хмари
    return (Array.isArray(g.photos)?g.photos:[]).filter(p=>p&&/^gp_[\w-]+$/.test(String(p.id||''))&&p.ref==='idb:'+p.id&&/^\d{4}-\d{2}-\d{2}$/.test(p.ds||''))
      .slice().sort((a,c)=>a.ds.localeCompare(c.ds)||(+a.t||0)-(+c.t||0));
  }
  const WD_PH_MAX=120;   // більше — уже архів, а не прогрес; усі фото читаються в памʼять при старті (photoWarm), тож тримаємо скромно
  // ＋ Фото: вибір → стиснення до 1080 px → сховище фото → у місію лише посилання
  function wdPhotoAdd(gid,after){
    const g0=wdFreshGoal(gid); if(!g0) return;
    if(wdPhotos(g0).length>=WD_PH_MAX){ plToast('У місії вже '+WD_PH_MAX+' фото — спершу прибери старі'); return; }
    chPickFile(file=>chShrink(file,1080,1080,async du=>{
      const id='gp_'+String(gid).replace(/[^\w-]/g,'').slice(0,24)+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
      let ref=''; try{ ref=await window.photoPut(id,du); }catch(_){ ref=''; }
      // сховище фото не прийняло — НЕ кладемо мегабайтний знімок у цілі (переповнило б памʼять і синк)
      if(!window.photoIsRef(ref)){ plToast('Не вийшло зберегти фото — у телефоні замало місця'); return; }
      const q=wdFreshGoal(gid);   // поки вибирали фото, синк міг підмінити goalsData
      if(!q){ try{ window.photoDel(ref); }catch(_){} plToast('Місію змінили на іншому пристрої'); return; }
      if(!Array.isArray(q.photos)) q.photos=[];
      q.photos.push({id, ref, ds:ymdLocal(), t:Date.now()});
      saveGoals(); try{ window.platform.haptic('light'); }catch(_){}
      wdRedraw(); plToast('📸 Фото додано'); if(after) try{ after(); }catch(_){}
    }));
  }
  // галерея: усі фото місії від нових, ＋ Фото, видалення (з хмари теж — тому питаємо)
  function wdPhotoGallery(gid){
    const g=wdFreshGoal(gid); if(!g) return;
    const L=wdPhotos(g).reverse();
    jnOverlay(`<div class="jn-ed-h"><b>📸 ${esc(String(g.name||'Місія').slice(0,30))}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">${L.length} ${pluralUk(L.length,'фото','фото','фото')} · від нових до перших</small>
      <div class="jn-ed-foot"><button class="jn-btn" data-wdpha>＋ Фото</button></div>
      <div class="wd-gal">${L.map((p,i)=>`<figure><i style="background-image:url('${esc(safeImg(p.ref))}')"></i>
        <figcaption><span>${esc(jnDateTxt(p.ds))}${i===L.length-1&&L.length>1?' · було':i===0&&L.length>1?' · зараз':''}</span>
        <button data-wdphdel="${esc(p.id)}" aria-label="Видалити фото від ${esc(jnDateTxt(p.ds))}">🗑</button></figcaption></figure>`).join('')}</div>`, ov=>{
      ov.classList.add('wd-ov');
      ov.querySelector('[data-wdpha]').onclick=()=>{ ov.remove(); wdPhotoAdd(gid,()=>wdPhotoGallery(gid)); };
      ov.querySelectorAll('[data-wdphdel]').forEach(x=>x.onclick=()=>{
        const pid=x.dataset.wdphdel; ov.remove();
        confirmSheet({title:'Видалити фото?', sub:'Воно зникне з місії і з хмари. Повернути не вийде.', okLabel:'Видалити', danger:true, onOk:()=>{
          const q=wdFreshGoal(gid); if(!q||!Array.isArray(q.photos)) return;
          const p=wdPhotos(q).find(y=>String(y.id)===pid); if(!p) return;
          q.photos=q.photos.filter(y=>y!==p); saveGoals();
          try{ window.photoDel(p.ref); }catch(_){}
          wdRedraw(); plToast('Фото видалено'); wdPhotoGallery(gid); }});
      });
    });
  }
  // фініш місії — найпізніша дата віх; віха лише з місяцем — останній день того місяця
  function wdFinal(g){
    const ds=ylGoalMs(g).map(m=>/^\d{4}-\d{2}-\d{2}$/.test(m.due||'')?m.due:m.ym+'-'+String(moDim(m.ym)).padStart(2,'0')).sort();
    return ds.length?ds[ds.length-1]:'';
  }
  function wdSaveGoal(g){ const v=Math.round(+g.saveGoal||0); return v>0?v:0; }
  function wdNumTxt(v){ return String(Math.round((+v||0)*100)/100).replace('.',','); }
  // список лічильників місії: «число місії» (якщо воно ручне, не з доходів) + власні g.counters
  function wdCounters(g){
    const out=[], n=jnNum(g);
    if(n&&!jnNumIncome(g)) out.push({id:'main', t:'Число місії', v:n.cur, to:n.to, st:n.start, step:1, unit:''});
    (Array.isArray(g.counters)?g.counters:[]).forEach(c=>{ if(!c||!c.id) return;
      const to=jnNumOf(c.to), st=jnNumOf(c.st);
      out.push({id:String(c.id), t:String(c.t||'Лічильник').slice(0,40), v:jnNumOf(c.v)||0, to, st:st===null?0:st, step:jnNumOf(c.step)>0?jnNumOf(c.step):1, unit:String(c.unit||'').slice(0,12)}); });
    return out;
  }
  function wdCntPct(c){ if(c.to===null||c.to===c.st) return null; return Math.max(0,Math.min(100,Math.round((c.v-c.st)/(c.to-c.st)*100))); }
  // свіжа місія за id — поки шторка відкрита, синк міг підмінити goalsData
  function wdFreshGoal(id){ return (goalsData.goals||[]).find(x=>x&&String(x.id)===String(id))||null; }

  // ＋ / − на плитці: пише лише тапом людини, тим самим saveGoals, що й сторінка місії
  function wdCounterStep(b,fk,dir){
    const g0=wdGoal(b,fk), g=g0&&wdFreshGoal(g0.id); if(!g) return;
    const c=wdCounters(g).find(x=>x.id===String(b.cid||''))||wdCounters(g)[0]; if(!c) return;
    const nv=Math.round((c.v+dir*c.step)*100)/100;
    if(c.id==='main') g.from=String(nv).slice(0,30);
    else { const r=(g.counters||[]).find(x=>x&&String(x.id)===c.id); if(!r) return; r.v=nv; }
    saveGoals();
    try{ window.platform.haptic('light'); }catch(_){}
    // мету щойно взято — кажемо один раз (саме на цьому кроці)
    if(c.to!==null&&c.to!==c.st){ const was=(c.v-c.st)/(c.to-c.st), now=(nv-c.st)/(c.to-c.st); if(was<1&&now>=1) plToast('🎉 Мету взято: '+c.t); }
    wdRedraw();
  }
  // шторка лічильника: вибрати, який показує плитка · змінити · додати новий · видалити
  function wdCounterSheet(blockId,gid,cid){
    const g=wdFreshGoal(gid); if(!g) return;
    const L=wdCounters(g), isNew=cid===null, c=isNew?null:(L.find(x=>x.id===String(cid||''))||L[0]||null);
    if(!isNew&&!c) return wdCounterSheet(blockId,gid,null);
    const chips=L.map(x=>`<button data-wdcp="${esc(x.id)}" class="${c&&x.id===c.id?'on':''}">${esc(x.t)}</button>`).join('')+`<button data-wdcp="" class="${isNew?'on':''}">＋ Новий</button>`;
    const f=(id,lbl,val,ty,ph)=>`<label class="jn-f"><span>${lbl}</span><input id="${id}" ${ty==='n'?'type="number" inputmode="decimal"':'maxlength="40"'} value="${esc(val==null?'':String(val))}" placeholder="${esc(ph)}"></label>`;
    const form=c&&c.id==='main'
      ?`<small class="dy-fm-sub">Це число з самої місії: ${esc(wdNumTxt(c.v))} з ${esc(wdNumTxt(c.to))}. Змінюється там же, де й на сторінці місії.</small>
        <div class="jn-ed-foot"><button class="jn-btn" data-wdcnum>Змінити число</button></div>`
      :`${f('wdcT','Назва',c?c.t:'','t','Напр. Японські слова')}
        <div class="wd-f2">${f('wdcV','Зараз',c?c.v:0,'n','0')}${f('wdcTo','Мета',c&&c.to!==null?c.to:'','n','1000')}</div>
        <div class="wd-f2">${f('wdcSt','Крок «＋»',c?c.step:1,'n','1')}${f('wdcU','Одиниця',c?c.unit:'','t','слів, кг, стор.')}</div>
        <div class="jn-ed-foot"><button class="jn-btn" data-wdcok>${isNew?'Додати':'Зберегти'}</button></div>
        ${!isNew?'<button class="wd-del" data-wdcdel>Видалити лічильник</button>':''}`;
    jnOverlay(`<div class="jn-ed-h"><b>🔢 Лічильник місії</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">${esc(String(g.name||'Місія').slice(0,40))} · плитка показує вибраний</small>
      <div class="jn-f"><span>Лічильники</span><div class="wl-chips">${chips}</div></div>${form}`, ov=>{
      // вибір лічильника пише в блок лише cid (вигляд плитки), саму місію не чіпає
      ov.querySelectorAll('[data-wdcp]').forEach(x=>x.onclick=()=>{
        const id=x.dataset.wdcp; if(!id){ wdCounterSheet(blockId,gid,null); return; }
        const q=getBlock(blockId); if(q&&String(q.cid||'')!==id){ q.cid=id; saveBoard(); wdRedraw(); }
        wdCounterSheet(blockId,gid,id);
      });
      const nb=ov.querySelector('[data-wdcnum]'); if(nb) nb.onclick=()=>{ ov.remove(); jnNumSheet(g,wdRedraw); };
      const ok=ov.querySelector('[data-wdcok]'); if(ok) ok.onclick=()=>{
        const v=id=>String(ov.querySelector('#'+id).value||'').trim();
        const name=v('wdcT').slice(0,40); if(!name){ plToast('Дай лічильнику назву'); return; }
        const now=jnNumOf(v('wdcV')), to=v('wdcTo')===''?null:jnNumOf(v('wdcTo')), st=jnNumOf(v('wdcSt'));
        if(now===null){ plToast('«Зараз» — це число'); return; }
        if(v('wdcTo')!==''&&to===null){ plToast('Мета — це число або порожньо'); return; }
        const q=wdFreshGoal(gid); if(!q){ ov.remove(); plToast('Місію змінили на іншому пристрої'); return; }
        if(!Array.isArray(q.counters)) q.counters=[];
        let r=isNew?null:q.counters.find(x=>x&&String(x.id)===c.id);
        if(!isNew&&!r){ ov.remove(); plToast('Лічильник змінили на іншому пристрої'); return; }
        if(isNew){ r={id:'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5), st:now}; q.counters.push(r); }
        r.t=name; r.v=now; r.step=st>0?st:1; r.unit=v('wdcU').slice(0,12);
        if(to===null) delete r.to; else r.to=to;
        saveGoals();
        if(isNew){ const bk=getBlock(blockId); if(bk){ bk.cid=r.id; saveBoard(); } }
        ov.remove(); wdRedraw(); plToast(isNew?'✓ Лічильник додано':'✓ Збережено');
      };
      const del=ov.querySelector('[data-wdcdel]'); if(del) del.onclick=()=>{
        ov.remove();
        confirmSheet({title:'Видалити «'+c.t+'»?', sub:'Число зникне з місії й з усіх плиток, що його показують.', okLabel:'Видалити', danger:true, onOk:()=>{
          const q=wdFreshGoal(gid); if(!q||!Array.isArray(q.counters)) return;
          q.counters=q.counters.filter(x=>!(x&&String(x.id)===c.id)); saveGoals(); wdRedraw(); plToast('Лічильник видалено'); }});
      };
    });
  }
  // ціль скарбнички — поле місії saveGoal (головна валюта); 0 або порожньо — без цілі
  function wdSaveGoalSheet(gid){
    const g=wdFreshGoal(gid); if(!g) return; const cur=wdSaveGoal(g);
    jnOverlay(`<div class="jn-ed-h"><b>🐷 Ціль скарбнички</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">${esc(String(g.name||'Місія').slice(0,40))} · рахуються доходи з міткою цієї місії</small>
      <label class="jn-f"><span>Скільки хочеш зібрати, ${esc(curSym())}</span><input id="wdSG" type="number" min="0" step="100" inputmode="decimal" value="${cur||''}" placeholder="Напр. 90000"></label>
      <div class="jn-ed-foot"><button class="jn-btn" data-wdsgok>Зберегти</button></div>`, ov=>{
      ov.querySelector('[data-wdsgok]').onclick=()=>{
        const raw=String(ov.querySelector('#wdSG').value||'').trim(), v=raw===''?0:jnNumOf(raw);
        if(v===null||v<0){ plToast('Вкажи суму числом'); return; }
        const q=wdFreshGoal(gid); if(!q){ ov.remove(); plToast('Місію змінили на іншому пристрої'); return; }
        if(v>0) q.saveGoal=Math.round(v); else delete q.saveGoal;
        saveGoals(); ov.remove(); wdRedraw(); plToast(v>0?'✓ Ціль: '+wgMoney(v):'Ціль прибрано');
      };
    });
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
    // день — з плитки (коли її намалювали), а не з моменту тапу: після півночі не шукаємо блок у новому дні
    else if(a==='wdsub'){ const bid=el.dataset.bid, ds=/^\d{4}-\d{2}-\d{2}$/.test(el.dataset.ds||'')?el.dataset.ds:ymdLocal(); if(bid) subSheet(ds,bid); }
    else if(a==='wdsubck'){ const bid=el.dataset.bid, sid=el.dataset.sid, ds=/^\d{4}-\d{2}-\d{2}$/.test(el.dataset.ds||'')?el.dataset.ds:ymdLocal(); if(bid&&sid){ const r=subToggle(ds,bid,sid); if(r!==null) try{ window.platform.haptic('light'); }catch(_){} } }
    // прогрес місії: Лічильник · Скарбничка
    else if(a==='wdcstep'){ wdCounterStep(b,fk,+el.dataset.n<0?-1:1); }
    else if(a==='wdcsheet'||a==='wdcnew'){ const q=wdGoal(b,fk); if(q) wdCounterSheet(id,q.id,a==='wdcnew'?null:String(b.cid||'')); }
    else if(a==='wdsavein'){ const q=wdGoal(b,fk); if(q) wlOpSheet('in',String(q.id),fk?{folderKey:fk}:{}); }
    else if(a==='wdsavegoal'){ const q=wdGoal(b,fk); if(q) wdSaveGoalSheet(q.id); }
    else if(a==='wdphadd'){ const q=wdGoal(b,fk); if(q) wdPhotoAdd(q.id); }
    else if(a==='wdphgal'){ const q=wdGoal(b,fk); if(q) wdPhotoGallery(q.id); }
    else if(a==='wdcalnav'){ const n=+el.dataset.n||0, cur=wdCalYm[b.id]||ymdLocal().slice(0,7); wdCalYm[b.id]=n?moShift(cur,n):ymdLocal().slice(0,7); wgRefresh(); }
    else if(a==='wdcalday'){ const ds=el.dataset.ds; if(fk&&/^\d{4}-\d{2}-\d{2}$/.test(ds||'')) calDaySheet(ds,{folder:fk,onOpenDay:d=>{ try{ goJournal({tab:'day',ds:d}); }catch(_){} }}); }
  }

  // ── ⚙ налаштування віджета: Розмір · Джерело · Період · Показувати · Видалити ──
  function wdCfg(id){
    let b=null; try{ b=getBlock(id); }catch(_){} if(!b||!wdIs(b.type)) return;
    if(b.type==='countdown') return tmCfg(id);   // у відліку своя шторка: дата, напрям, одиниці, стиль
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
      ${b.type==='dsave'?`<div class="jn-f"><span>Ціль</span><div class="wl-chips"><button data-wdsgo>🐷 Ціль скарбнички…</button></div></div>`:''}
      ${b.type==='dcounter'?`<div class="jn-f"><span>Лічильник</span><div class="wl-chips"><button data-wdcgo>🔢 Вибрати чи змінити…</button></div></div>`:''}
      <div class="jn-f"><span>Показувати</span><div class="wd-tg">${m.show.map(([k,l])=>`<button data-wdsh="${k}" role="switch" aria-checked="${show[k]}" class="${show[k]?'on':''}"><span>${l}</span><i></i></button>`).join('')}</div></div>
      <div class="jn-ed-foot"><button class="jn-btn" data-wdok>Зберегти</button></div>
      <button class="wd-del" data-wddel>Видалити віджет</button>`, ov=>{
      ov.classList.add('wd-ov');
      const pick=(sel,fn)=>ov.querySelectorAll(sel).forEach(x=>x.onclick=()=>{ fn(x);
        ov.querySelectorAll(sel).forEach(y=>{ y.classList.toggle('on',y===x); if(y.hasAttribute('aria-pressed')) y.setAttribute('aria-pressed',String(y===x)); }); });
      pick('[data-wdsz]',x=>{ sz=x.dataset.wdsz; });
      pick('[data-wdg]',x=>{ gid=x.dataset.wdg; });
      pick('[data-wdper]',x=>{ per=x.dataset.wdper; });
      // ціль / лічильник живуть у місії — шторка для місії, яку плитка показує зараз (збережене «Джерело»)
      const cfgGoal=()=>{ const q=wdGoal(b,fk); return q&&q.id?q:null; };
      const sg=ov.querySelector('[data-wdsgo]'); if(sg) sg.onclick=()=>{ const q=cfgGoal(); if(!q){ plToast('Спершу вибери місію'); return; } ov.remove(); wdSaveGoalSheet(q.id); };
      const cg=ov.querySelector('[data-wdcgo]'); if(cg) cg.onclick=()=>{ const q=cfgGoal(); if(!q){ plToast('Спершу вибери місію'); return; } ov.remove(); wdCounterSheet(id,q.id,String(b.cid||'')); };
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

  /* ════════ «Відлік часу» (17.11.2026): старий блок countdown став віджетом «Даних» ════════
     Блок зберігає лише свої налаштування. Старі поля лишились тими самими (їх пишуть агент Флоу і шаблони сфер):
     title — назва, target 'YYYY-MM-DD' — дата. Нові — лише після «Зберегти» в ⚙: tm 'HH:MM', dir 'up' (від дати),
     units [y,mo,w,d,h,mi,s], sty 'huge'|'rings' (типово флип), yearly — щороку. Без нових полів відлік рахує як раніше:
     до дати о 00:00, дні · год · хв · с. Тікання раз на секунду лише перемальовує цифри — нічого не пише. */
  const TM_U=['y','mo','w','d','h','mi','s'], TM_DEF=['d','h','mi','s'];
  const TM_N={y:['рік','роки','років'],mo:['місяць','місяці','місяців'],w:['тиждень','тижні','тижнів'],d:['день','дні','днів'],
    h:['година','години','годин'],mi:['хвилина','хвилини','хвилин'],s:['секунда','секунди','секунд']};
  const TM_SH={y:'р',mo:'міс',w:'тиж',d:'дн',h:'год',mi:'хв',s:'с'};
  const TM_MS={w:6048e5,d:864e5,h:36e5,mi:6e4,s:1e3};
  const TM_STY=[['flip','Флип 3D'],['huge','Велике число'],['rings','Кільця']];
  function tmCfgOf(b){
    const dir=b.dir==='up'?'up':'down';
    let units=Array.isArray(b.units)?TM_U.filter(u=>b.units.includes(u)):[]; if(!units.length) units=TM_DEF.slice();
    return { target:/^\d{4}-\d{2}-\d{2}$/.test(b.target||'')?b.target:'', tm:/^([01]\d|2[0-3]):[0-5]\d$/.test(b.tm||'')?b.tm:'00:00',
      dir, units, sty:TM_STY.some(s=>s[0]===b.sty)?b.sty:'flip', yearly:!!b.yearly&&dir==='down', date:wdOn(b,'date') };
  }
  function tmAt(c){ const [y,m,d]=c.target.split('-').map(Number), [h,mi]=c.tm.split(':').map(Number); return new Date(y,m-1,d,h,mi,0,0); }
  // +n календарних місяців; 31 січня + 1 = 28/29 лютого (не 3 березня)
  function tmAddM(dt,n){ const r=new Date(dt.getTime()), day=r.getDate(); r.setDate(1); r.setMonth(r.getMonth()+n);
    r.setDate(Math.min(day,new Date(r.getFullYear(),r.getMonth()+1,0).getDate())); return r; }
  // різниця a→b (a ≤ b) у вибраних одиницях, від найбільшої: роки й місяці календарні, решта — точні мілісекунди
  function tmParts(a,b,units){
    const out={}; let cur=a;
    if(units.includes('y')||units.includes('mo')){
      let mo=Math.max(0,(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth()-1);
      while(tmAddM(a,mo+1)<=b) mo++;
      if(units.includes('y')){ out.y=Math.floor(mo/12); if(units.includes('mo')) out.mo=mo%12; else mo=out.y*12; }
      else out.mo=mo;
      cur=tmAddM(a,(out.y||0)*12+(out.mo||0));
    }
    let rest=Math.max(0,b-cur);
    ['w','d','h','mi','s'].forEach(k=>{ if(units.includes(k)){ out[k]=Math.floor(rest/TM_MS[k]); rest-=out[k]*TM_MS[k]; } });
    return out;
  }
  // стан на «зараз»: дата (для «щороку» — найближча майбутня), чи вже настала, і розклад
  function tmState(c,now){
    let at=tmAt(c);
    if(c.dir==='down'&&c.yearly){ let n=0; while(at<=now&&n<300){ at=new Date(at.getTime()); at.setFullYear(at.getFullYear()+1); n++; } }
    const off=c.dir==='down'?at<=now:at>now;   // «до»: уже настала · «від»: ще не почалась
    return {at, off, p:off?null:(c.dir==='down'?tmParts(now,at,c.units):tmParts(at,now,c.units))};
  }
  function tmDateTxt(at,c){ const ds=ymdLocal(at); return jnDateTxt(ds)+(ds.slice(0,4)!==ymdLocal().slice(0,4)?' '+ds.slice(0,4):'')+(c.tm!=='00:00'?', '+c.tm:''); }
  const tmPad=(k,v)=>(k==='h'||k==='mi'||k==='s')?String(v).padStart(2,'0'):String(v);
  // вміст живої частини віджета; el — щоб флип знав, які цифри змінились з минулої секунди
  function tmInner(c,sz,el){
    const st=tmState(c,new Date());
    const dt=c.date?`<small class="wd-sub tm-dt">${c.dir==='down'?'':'з '}${esc(tmDateTxt(st.at,c))}${c.yearly?' · щороку':''}</small>`:'';
    if(st.off) return c.dir==='down'?`<b class="wd-big tm-done">Настав! 🎉</b>${dt}`:`<b class="wd-big sm">Ще не почалось</b><small class="wd-sub">Старт ${esc(tmDateTxt(st.at,c))}</small>`;
    let us=c.units.slice(); while(us.length>1&&!st.p[us[0]]) us.shift();   // нулі попереду не показуємо: «0 років 1 місяць» → «1 місяць»
    if(sz==='s') us=us.slice(0,2);
    const pl=k=>pluralUk(st.p[k],...TM_N[k]);
    let sty=c.sty; if(sty==='rings'&&sz==='s') sty='huge';
    if(sty==='huge'){
      const k0=us[0], rest=us.slice(1).map(k=>tmPad(k,st.p[k])+' '+TM_SH[k]).join(' · ');
      return `<span class="wd-cnt"><b class="wd-big xl">${st.p[k0]}</b><small class="wd-cap">${pl(k0)}</small></span>${rest?`<small class="wd-sub tm-rest">${rest}</small>`:''}${dt}`;
    }
    if(sty==='rings'){
      const rk=us.slice(-3), cols=['var(--fc)','#ff7a9a','#5ee0cf'];
      const max={y:100,mo:12,w:52,d:us.includes('w')?7:us.includes('mo')?31:365,h:24,mi:60,s:60};
      const svg=rk.map((k,i)=>{ const r=16-i*4.5, f=Math.min(1,(st.p[k]%max[k])/max[k]);
        return `<circle class="tr" cx="18" cy="18" r="${r}"/><circle cx="18" cy="18" r="${r}" pathLength="100" stroke="${cols[i]}" stroke-dasharray="${(f*100).toFixed(1)} 100"/>`; }).join('');
      return `<span class="tm-rings"><svg viewBox="0 0 36 36" aria-hidden="true">${svg}</svg><span class="tm-lg">${us.map(k=>{ const i=rk.indexOf(k);
        return `<span><i style="background:${i>=0?cols[i]:'var(--pg-track,rgba(127,127,127,.3))'}"></i>${tmPad(k,st.p[k])} ${pl(k)}</span>`; }).join('')}</span></span>${dt}`;
    }
    const prev=(el&&el.__tmPrev)||{}, now={};
    const h=us.map(k=>{ const s=tmPad(k,st.p[k]);
      return `<span class="tm-u"><span class="tm-ds">${s.split('').map((ch,i)=>{ const key=k+(s.length-i); now[key]=ch;
        return `<i class="tm-d${prev[key]!==undefined&&prev[key]!==ch?' go':''}">${ch}</i>`; }).join('')}</span><small>${pl(k)}</small></span>`; }).join('');
    if(el) el.__tmPrev=now;
    return `<span class="tm-flip" role="timer" aria-label="${us.map(k=>st.p[k]+' '+pl(k)).join(', ')}">${h}</span>${dt}`;
  }
  function tmHTML(b,fk){
    const c=tmCfgOf(b), sz=wdSz(b), nm=esc(String(b.title||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,60));
    const hit=`<button class="wg-hit" data-wga="wdcfg" aria-label="Налаштувати відлік${nm?' «'+nm+'»':''}"></button>`;
    if(!c.target) return wdTile(b,fk,`${hit}${wdHead(b,fk)}<b class="wd-name">${nm||'Новий відлік'}</b>
      <small class="wd-sub">Вибери дату, і відлік почнеться</small><span class="wd-acts"><button data-wga="wdcfg">Вибрати дату</button></span>`,'empty');
    tmStart();
    const live=`<span class="tm-live" data-tg="${esc(c.target)}" data-tm="${esc(c.tm)}" data-dir="${c.dir}" data-u="${esc(c.units.join(','))}" data-sty="${c.sty}" data-sz="${sz}" data-yr="${c.yearly?1:''}" data-dt="${c.date?1:''}">${tmInner(c,sz,null)}</span>`;
    return wdTile(b,fk,`${hit}${wdHead(b,fk,c.dir==='up'?'від дати':'')}${nm?`<b class="wd-name">${nm}</b>`:''}${live}`,'tmw');
  }
  // один таймер на весь застосунок: оновлює цифри всіх видимих відліків; налаштування — з data-* самої плитки
  let tmTimer=0;
  function tmTickAll(){
    if(document.hidden) return;
    document.querySelectorAll('.tm-live').forEach(el=>{
      const d=el.dataset; if(!/^\d{4}-\d{2}-\d{2}$/.test(d.tg||'')) return;
      const c={target:d.tg, tm:/^([01]\d|2[0-3]):[0-5]\d$/.test(d.tm||'')?d.tm:'00:00', dir:d.dir==='up'?'up':'down',
        units:String(d.u||'').split(',').filter(u=>TM_U.includes(u)), sty:d.sty, yearly:d.yr==='1', date:d.dt==='1'};
      if(!c.units.length) c.units=TM_DEF.slice();
      const h=tmInner(c,d.sz,el); if(h!==el.__tmH){ el.__tmH=h; el.innerHTML=h; }
    });
  }
  function tmStart(){ if(!tmTimer) tmTimer=setInterval(tmTickAll,1000); }
  // ⚙ відліку: назва, дата й час, напрям, одиниці, стиль, розмір, «щороку»
  function tmCfg(id){
    let b=null; try{ b=getBlock(id); }catch(_){} if(!b||b.type!=='countdown') return;
    const c=tmCfgOf(b), units=new Set(c.units); let sz=wdSz(b), dir=c.dir, sty=c.sty, yearly=c.yearly, date=c.date;
    const nm=String(b.title||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,60);
    jnOverlay(`<div class="jn-ed-h"><b>⏳ Відлік часу</b><button data-jnx aria-label="Закрити">✕</button></div>
      <label class="jn-f"><span>Назва</span><input id="tmName" type="text" maxlength="60" value="${esc(nm)}" placeholder="Новий рік, відпустка, без цукру…"></label>
      <div class="tm-dtrow"><label class="jn-f"><span>Дата</span><input id="tmDate" type="date" value="${esc(c.target)}"></label>
        <label class="jn-f"><span>Час</span><input id="tmTime" type="time" value="${esc(c.tm)}"></label></div>
      <div class="jn-f"><span>Напрям</span><div class="wl-chips"><button data-tmdir="down" class="${dir==='down'?'on':''}">⏳ До дати</button><button data-tmdir="up" class="${dir==='up'?'on':''}">⏱ Від дати</button></div></div>
      <div class="jn-f"><span>Що показувати</span><div class="wl-chips">${TM_U.map(u=>`<button data-tmu="${u}" class="${units.has(u)?'on':''}" aria-pressed="${units.has(u)}">${TM_N[u][2][0].toUpperCase()+TM_N[u][2].slice(1)}</button>`).join('')}</div></div>
      <div class="jn-f"><span>Стиль</span><div class="wl-chips">${TM_STY.map(([k,l])=>`<button data-tmsty="${k}" class="${k===sty?'on':''}">${l}</button>`).join('')}</div></div>
      <div class="jn-f"><span>Розмір</span><div class="wd-szs">${Object.keys(WD_SZ).map(k=>`<button data-wdsz="${k}" class="${k===sz?'on':''}" aria-pressed="${k===sz}"><i class="wd-szi ${k}"></i><b>${WD_SZ[k].t}</b><small>${WD_SZ[k].d}</small></button>`).join('')}</div></div>
      <div class="jn-f"><div class="wd-tg">
        <button data-tmyr role="switch" aria-checked="${yearly}" class="${yearly?'on':''}"><span>Щороку (день народження, річниця)</span><i></i></button>
        <button data-tmdt role="switch" aria-checked="${date}" class="${date?'on':''}"><span>Дата під цифрами</span><i></i></button></div></div>
      <div class="jn-ed-foot"><button class="jn-btn" data-tmok>Зберегти</button></div>
      <button class="wd-del" data-tmdel>Видалити відлік</button>`, ov=>{
      ov.classList.add('wd-ov');
      const one=(sel,fn)=>ov.querySelectorAll(sel).forEach(x=>x.onclick=()=>{ fn(x); ov.querySelectorAll(sel).forEach(y=>{ y.classList.toggle('on',y===x); if(y.hasAttribute('aria-pressed')) y.setAttribute('aria-pressed',String(y===x)); }); });
      one('[data-tmdir]',x=>{ dir=x.dataset.tmdir; });
      one('[data-tmsty]',x=>{ sty=x.dataset.tmsty; });
      one('[data-wdsz]',x=>{ sz=x.dataset.wdsz; });
      ov.querySelectorAll('[data-tmu]').forEach(x=>x.onclick=()=>{ const u=x.dataset.tmu;
        if(units.has(u)){ if(units.size===1){ plToast('Хоча б одна одиниця'); return; } units.delete(u); } else units.add(u);
        x.classList.toggle('on',units.has(u)); x.setAttribute('aria-pressed',String(units.has(u))); });
      const sw=(sel,get,set)=>{ const x=ov.querySelector(sel); x.onclick=()=>{ set(!get()); x.classList.toggle('on',get()); x.setAttribute('aria-checked',String(get())); }; };
      sw('[data-tmyr]',()=>yearly,v=>{ yearly=v; });
      sw('[data-tmdt]',()=>date,v=>{ date=v; });
      ov.querySelector('[data-tmok]').onclick=()=>{
        const ds=String(ov.querySelector('#tmDate').value||''), tm=String(ov.querySelector('#tmTime').value||'').slice(0,5);
        if(!/^\d{4}-\d{2}-\d{2}$/.test(ds)){ plToast('Вибери дату'); return; }
        const q=getBlock(id); if(!q||q.type!=='countdown'){ ov.remove(); return; }
        const name=String(ov.querySelector('#tmName').value||'').replace(/\s+/g,' ').trim().slice(0,60);
        q.title=name; q.label=name; q.target=ds;   // label — старе поле підпису, тримаємо разом із назвою
        if(/^([01]\d|2[0-3]):[0-5]\d$/.test(tm)&&tm!=='00:00') q.tm=tm; else delete q.tm;
        if(dir==='up') q.dir='up'; else delete q.dir;
        const us=TM_U.filter(u=>units.has(u)); if(us.join()===TM_DEF.join()) delete q.units; else q.units=us;
        if(sty!=='flip') q.sty=sty; else delete q.sty;
        if(yearly&&dir==='down') q.yearly=true; else delete q.yearly;
        if(date) delete q.show; else q.show={date:false};
        q.sz=sz; q.gw=WD_SZ[sz].gw; q.gh=WD_SZ[sz].gh;
        saveBoard(); ov.remove(); wdRedraw();
      };
      // відлік сам і є своїми даними (назва + дата), тож видалення — з «Скасувати»
      ov.querySelector('[data-tmdel]').onclick=()=>{
        const arr=findParentArr(curBoard(),id), i=arr?arr.findIndex(x=>x&&String(x.id)===String(id)):-1;
        if(i>=0){ const was=arr.splice(i,1)[0]; saveBoard();
          flowUndoToast('Відлік прибрано',()=>{ if(arr.some(x=>x&&String(x.id)===String(was.id))) return; arr.splice(Math.min(i,arr.length),0,was); saveBoard(); wdRedraw(); }); }
        ov.remove(); wdRedraw();
      };
      if(!c.target) setTimeout(()=>{ try{ ov.querySelector('#tmName').focus(); }catch(_){} },80);
    });
  }

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
