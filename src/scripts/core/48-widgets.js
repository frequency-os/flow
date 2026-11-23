  /* ════════ Віджети «Гроші» (48-widgets.js, 09.10.2026) ════════
     Вигляд A «Плитки» (як віджети iPhone). Віджет — ВІКНО в Гаманець: даних одна копія (finOps, конверти,
     місії, План місяця, правила), віджет лише показує їх і відкриває ті самі шторки. Запис — лише тапом людини.
     Типи блоків сторінки папки (boards): wgwallet · wgmission · wgenv · wgdebt · wgmoney{kind:'in'|'out', src, label, goal}.
     «Доходи»/«Витрати» (wgmoney) — поєднання A+C: операції з них мають мітку папки (op.folderKey) і тип доходу (op.src);
     у папці місії — ще й мітку місії. У Гаманці (вкладка «Огляд») — Місія · Конверти · Борги й правила (10.10.2026: з Огляду прибрано в ⚙ Огляду, folderOpts.money).
     Хост на сторінці: <div data-wghost="id"> (page-editor/02-block-styles.js), у Гаманці — [data-wghome] (wlRender). */

  const WG_TYPES={wgwallet:1, wgmission:1, wgenv:1, wgdebt:1, wgmoney:1, wgwork:1, wgworkpanel:1, dmission:1, dhabit:1, dtime:1, dtasks:1, dcal:1, dcount:1, dsave:1, dcounter:1, dphoto:1, countdown:1};   // d* — «Дані» (нижче)
  const WG_SETTINGS={
    wgwallet:{t:'Гаманець',ic:'👛'},
    wgwork:{t:'Робота',ic:'⏱'},
    wgmission:{t:'Гроші місії',h:'Місія',ic:'🎯'},
    wgenv:{t:'Конверти й платежі',ic:'✉️'},
    wgdebt:{t:'Борги й правила',ic:'⚖️'}
  };
  function wgIs(t){ return !!WG_TYPES[t]; }
  function wgHasSettings(t){ return t==='wgmoney'||Object.hasOwn(WG_SETTINGS,t); }
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
      wdOpenNew(b.id);
      return true;
    }
    if(wgIs(k)){ b.type=k; return true; }
    return false;
  }

  // ── HTML плиток ──
  function wgTile(cls,inner,attrs){ return `<div class="wg-t ${cls}"${attrs||''}>${inner}</div>`; }
  function wgPageTile(b,fk,cls,inner,color){
    return b.id?wdTile(b,fk,inner,'wg-settings '+cls,color)
      :wgTile(cls,inner,color?` style="--mc:${safeColor(color,'#34c77b')}"`:'');
  }
  function wgSettingsHead(b,label,legacy,custom=b.hd){
    if(!b.id) return `<span class="wg-h">${legacy}</span>`;
    const name=String(custom||'').slice(0,40);
    return `<button class="wd-h wg-settings-head" data-wga="cfg" aria-label="Налаштувати віджет «${esc(name||label)}»"><b${name?' data-i18n-skip="1"':''}>${name?esc(name):legacy}</b></button>`;
  }
  function wgMoneyMission(b,fk){
    const chosen=b.goalId&&wlGoal(b.goalId);
    return chosen||wgFolderMission(fk)||wlMissions()[0]||null;
  }
  function wgHTML(b,fk){
    const ym=wlYm(), t=b&&b.type;
    if(t==='wgworkpanel') return wkPanelHTML(b);
    if(t==='calendar') return wdTrkCal(b,fk)?wdHTML(wdCalView(b),fk):'';   // трекер місії в новому вигляді (23.11.2026)
    if(wdIs(t)) return wdHTML(b,fk);   // «Дані»: вікна в місію / трекер / Планер
    if(t==='wgwallet'){
      let bal=0, pz=0; try{ bal=walletBalance(); pz=typeof pzTotal==='function'?pzTotal():0; }catch(_){}
      const all=wlAgg(wlMonthOps(ym)), g=(jnHero().money&&jnHero().money[ym])||null, svd=typeof pzMonthSaved==='function'?Math.max(0,pzMonthSaved(ym)):0;
      let fc=null; try{ fc=rlForecast(ym); }catch(_){}
      const ring=(p,lbl)=>`<span class="wg-r" style="--p:${Math.max(0,Math.min(100,Math.round(p)))}"><em>${Math.round(p)}%</em><small>${lbl}</small></span>`;
      const rings=g&&(+g.earn>0||+g.spend>0||+g.save>0)
        ?`<span class="wg-rings">${+g.earn>0?ring(all.inc/g.earn*100,'заробив'):''}${+g.spend>0?ring(all.out/g.spend*100,'витратив'):''}${+g.save>0?ring(svd/g.save*100,'відклав'):''}</span>`
        :`<span class="wg-fact"><span>+${wgK(all.inc)}</span><span>−${wgK(all.out)}</span></span>`;
      return wgPageTile(b,fk,'wide c-wallet',`<button class="wg-hit" data-wga="wallet" aria-label="Відкрити Гаманець"></button>
        ${wgSettingsHead(b,'Гаманець','Гаманець · '+esc(MO_NAMES[+ym.slice(5,7)-1].toLowerCase()))}<b class="wg-big">${wgMoney(bal)}</b>
        <small>${fc!==null?'прогноз на кінець місяця '+wgMoney(fc):''}${pz?(fc!==null?' · ':'')+'на призи '+wgMoney(pz):''}</small>
        ${(()=>{ let l=[]; try{ l=wlCurList(); }catch(_){} return l.length?`<small class="wg-curs">${l.map(c=>esc(money(curBalance(c),c))).join(' · ')}</small>`:''; })()}
        <span class="wg-foot">${rings}<span class="wg-acts"><button data-wga="out" aria-label="Витрата">−</button><button data-wga="in" aria-label="Дохід">＋</button></span></span>`);
    }
    if(t==='wgmission'){
      const g=wgMoneyMission(b,fk);
      if(!g) return wgPageTile(b,fk,'c-mission',`<button class="wg-hit" data-wga="journal" aria-label="Журнал"></button>${wgSettingsHead(b,'Гроші місії','🎯 Гроші місії')}<b class="wg-big sm">Ще нема місій</b><small>створи в Журналі</small>`);
      const a=wlAgg(wlMonthOps(ym),g.id), bud=g.budget&&+g.budget.money>0?+g.budget.money:0;
      const rw=g.reward&&String(g.reward.t||'').trim()?g.reward:null, sv=rw&&typeof pzSaved==='function'?pzSaved(g):0, rp=rw&&+rw.sum>0?Math.min(100,Math.round(sv/rw.sum*100)):0;
      return wgPageTile(b,fk,'c-mission',`<button class="wg-hit" data-wga="mission" data-wgg="${esc(g.id)}" aria-label="Гроші місії ${esc(g.name||'')}"></button>
        ${wgSettingsHead(b,'Гроші місії',safeEmoji(g.emoji,'🎯')+' <span data-i18n-skip="1">'+esc(String(g.name||'Місія').slice(0,22))+'</span>')}
        ${b.id&&b.hd?`<small data-i18n-skip="1" class="wg-mission-name">${esc(String(g.name||'Місія').slice(0,40))}</small>`:''}
        <b class="wg-big">${a.inc-a.out>0?'+':a.inc-a.out<0?'−':''}${wgK(Math.abs(a.inc-a.out))}</b>
        <small>${bud?'бюджет '+wgK(a.out)+' / '+wgK(bud):'дохід '+wgK(a.inc)+' · витрати '+wgK(a.out)}</small>
        ${bud?`<span class="wg-bar"><i class="${a.out>bud?'over':''}" style="width:${Math.min(100,Math.round(a.out/bud*100))}%"></i></span>`:''}
        ${rw?`<small class="wg-pz">${safeEmoji(rw.emoji,'🎁')} ${rp}% на «${esc(String(rw.t).slice(0,18))}»</small>`:''}`,g.color||'#34c77b');
    }
    if(t==='wgenv'){
      const envs=(envelopes||[]).filter(e=>e&&e.id&&!envCur(e)); let tot=0; envs.forEach(e=>{ try{ tot+=envSaved(e); }catch(_){} });   // сума — лише головна валюта
      let rows=[]; try{ rows=rlPlanOpen(ym).slice(0,2); }catch(_){}
      const td=+ymdLocal().slice(8,10);
      return wgPageTile(b,fk,'c-env',`<button class="wg-hit" data-wga="envs" aria-label="Конверти"></button>
        ${wgSettingsHead(b,'Конверти й платежі','✉️ Конверти')}<b class="wg-big">${wgK(tot)}</b>
        ${rows.length?rows.map(x=>`<button class="wg-li" data-wga="plan" data-wgp="${x.k}|${esc(x.r.id)}"><span>${esc(String(x.r.t||'').slice(0,14))}${x.r.day?` · ${+x.r.day<td?'<i>прострочено</i>':esc(String(x.r.day))+'-го'}`:''}</span><b>${x.k==='in'?'+':'−'}${esc(moneyK(x.rest,rlRowCur(x.r)))}</b></button>`).join('')
          :`<button class="wg-li" data-wga="planadd"><span>План місяця порожній</span><b>＋</b></button>`}`);
    }
    if(t==='wgdebt'){
      const d=wgDebtNet(); let s=0, dc={ok:0,all:0}; try{ s=jnStreak(); dc=rlDiscipline(); }catch(_){}
      return wgPageTile(b,fk,'wide c-debt',`<button class="wg-hit" data-wga="debts" aria-label="Борги"></button>
        ${wgSettingsHead(b,'Борги й правила','🤝 Борги · 📖 Правила')}
        <span class="wg-two"><span><b class="wg-big">${d.net>0?'+':''}${wgK(d.net)}</b><small>${d.owed||d.owe?'мені винні '+wgK(d.owed)+' · я винен '+wgK(d.owe):'боргів нема'}</small></span>
        <button class="wg-rules" data-wga="rules"><b>🔥 ${s} ${pluralUk(s,'день','дні','днів')}</b><small>${dc.all?'дисципліна '+Math.round(dc.ok/dc.all*100)+'%':'Книга правил ›'}</small></button></span>`);
    }
    if(t==='wgwork'){
      const i=typeof wkMoneyInfo==='function'?wkMoneyInfo(ym):null;
      if(!i) return b.id?wgPageTile(b,fk,'wide c-work',`${wgSettingsHead(b,'Робота','⏱ Робота')}<small>Дані про години недоступні</small>`):'';
      return wgPageTile(b,fk,'wide c-work',`<button class="wg-hit" data-wga="work" aria-label="Робота — календар годин"></button>
        ${wgSettingsHead(b,'Робота','⏱ Робота · '+esc(MO_NAMES[+ym.slice(5,7)-1].toLowerCase()))}<b class="wg-big">${esc(moneyK(i.earned,i.cur))}</b>
        <small>${esc(String(Math.round(i.hours*10)/10).replace('.',','))} год · ${i.paid?'✓ зарплату записано':i.due?'тапни — запише зарплату':'виплата '+esc(String(i.pday))+'-го'}</small>
        ${b.id?'<span class="wg-acts one"><button data-wga="workadd">＋ Години</button></span>':''}`);   // на сторінці папки (є id блока) — запис годин на сьогодні; у Гаманці — без кнопки
    }
    if(t==='wgmoney'){
      const kind=b.kind==='out'?'out':'in', src=WL_SRC[b.src]?b.src:'main', cur=b.cur&&b.cur!==mainCur()&&Object.prototype.hasOwnProperty.call(CUR_LIST,b.cur)?b.cur:'';
      const name=String(b.label||(kind==='in'?'Доходи':'Витрати')).slice(0,40);
      const head=wgSettingsHead(b,name,esc(name),name);
      if(!fk) return wgPageTile(b,fk,'c-'+kind,`${head}<b class="wg-big sm">Лише в папці</b><small>постав віджет у папку-проєкт</small>`);
      // віджет із валютою (етап 2) рахує лише свою валюту; без — головну
      const ops=wlMonthOps(ym).filter(o=>inFolderOp(o,fk)&&(o.cur||'')===cur&&(kind==='in'?_isIncAny(o)&&wlSrc(o)===src:_isExpAny(o)));
      const sum=ops.reduce((s,o)=>s+(+o.amount||0),0), goal=+b.goal>0?+b.goal:0, last=ops[ops.length-1];
      return wgPageTile(b,fk,'c-'+kind,`<button class="wg-hit" data-wga="folderops" aria-label="Записи папки"></button>
        ${head}
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
    else if(a.startsWith('wkp:')){ try{ wkpAct(a.slice(4),el,id); }catch(err){ console.error('wkpAct',err); } }
    else if(a==='workadd'){ try{ workTapDay(ymdLocal()); }catch(_){} }   // та сама шторка, що й тап по дню в календарі Роботи
    else if(a==='rules'){ try{ rlBook(); }catch(_){} }
    else if(a==='folderops'){ if(fk) wlFolderSheet(fk); }
    else if(a==='cfg'){ if(id) wdSheet(id,{tab:'own'}); }
    else if(a.slice(0,2)==='wd'){ const b=blk(); wdAct(a,el,wdTrkCal(b,fk)?wdCalView(b):b,fk,id); }
    else if(a==='add'){ const b=blk(); if(!b||!fk) return; const g=wgFolderMission(fk);
      wlOpSheet(b.kind==='out'?'out':'in', g?String(g.id):'', {folderKey:fk, src:b.src, cur:b.cur, label:b.kind==='out'?'':(b.label||'')}); }
  }
  function wgFill(host,b,fk){
    host.dataset.wgfk=fk||'';
    let html=''; try{ html=wgHTML(b,fk); }catch(err){ console.error('wgHTML',err); }
    if(b&&wgHasSettings(b.type)&&b.ws&&host.classList.contains('pgwg')&&!host.closest('.pg-board')){
      const dev=wdDev(), [w,h]=wdCell(b,dev);
      host.style.setProperty('--money-width',w/wdCols(dev)*100+'%');
      host.style.setProperty('--money-height',Math.max(150,h*54)+'px');
    }else{
      host.style.removeProperty('--money-width');
      host.style.removeProperty('--money-height');
    }
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

  /* ════════ «Дані» (10.10.2026): віджети-вікна в екосистему — Місія · Звичка · Час папки ════════
     Блок зберігає ЛИШЕ свої налаштування: sz ('s'|'m'|'l', + gw/gh для сітки дошки), goalId (місія; порожньо — місія цієї папки),
     period ('day'|'week'|'month'), show{ключ:false} — вимкнені рядки. Дані живуть у модулях (місії, трекер місії, Планер),
     віджет їх лише читає. Запис — тільки тапом людини і тими самими функціями, що й застосунок:
     позначка дня — moToggleMark, трекер — moAddTracker (43-month.js), новий блок Планера — plFolderAddBlock (15-flow-spot.js).
     Вставка в дошку віджетів (board з wboard:true) — page-editor/03-premium-pack.js → pgDataInsert. */
  const WD_SZ={s:{gw:6,gh:2,t:'S',d:'Половина'}, m:{gw:12,gh:2,t:'M',d:'Широкий'}, l:{gw:12,gh:4,t:'L',d:'Великий'}};
  const WD_META={
    dmission:{t:'Місія папки', h:'Місія', ic:'🎯', per:null, show:[['next','Наступний крок'],['due','Дедлайн'],['ring','Кільце прогресу']]},
    dhabit:{t:'Трекер цілі', h:'Звичка', ic:'🔥', per:[['week','Тиждень'],['month','Місяць']], show:[['streak','Серія'],['count','Скільки днів'],['days','Дні періоду']]},
    dtime:{t:'Час папки', h:'Час', ic:'⏱', per:[['day','День'],['week','Тиждень'],['month','Місяць']], show:[['hours','Години'],['done','Виконані блоки'],['add','Кнопка «＋ блок»']]},
    /* «Справи папки» (19.11.2026, етап 2 нового Плану, 65-plan.js): справи сьогодні з міткою папки — і з часом, і без */
    dtasks:{t:'Справи папки', h:'Справи', ic:'✅', per:[['day','Сьогодні'],['week','Тиждень']], show:[['done','Виконані справи'],['add','Кнопка «＋ справа»'],['star','Зірочки «Головне»']]},
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
  // розмір S/M/L: з клітинок пристрою (63-widget-sheet.js wdCell), а для віджетів без b.ws — як раніше
  function wdSz(b){ if(b&&b.ws){ const t=wdTier(b); return t==='l'?'l':t==='m'?'m':'s'; } return wdSzOld(b); }
  function wdSzOld(b){ return b&&Object.prototype.hasOwnProperty.call(WD_SZ,String(b.sz||''))?b.sz:(b&&b.type==='dcal'?'l':b&&(b.type==='dtime'||b.type==='dtasks'||b.type==='dphoto'||b.type==='countdown')?'m':'s'); }
  function wdPer(b){ const m=WD_META[b.type]; if(!m||!m.per) return ''; return m.per.some(x=>x[0]===b.period)?b.period:m.per[0][0]; }
  function wdOn(b,k){ return !(b&&b.show&&typeof b.show==='object'&&b.show[k]===false); }
  function wdOpenNew(id){
    const key=boardKey;
    setTimeout(()=>{
      if(boardKey===key&&!document.querySelector('.ws-ov.on:not(.out)')) wdSheet(id,{tab:'own'});
    },450);
  }
  // новий блок із меню «Дані»: лише налаштування, без копії даних
  function wdInit(b,k){
    b.type=k; b.sz=wdSz(b); b.gw=WD_SZ[b.sz].gw; b.gh=WD_SZ[b.sz].gh;
    if(WD_META[k].per&&!b.period) b.period=(k==='dtime'||k==='dtasks')?'day':'week';
    delete b.text;
    if(k==='countdown'||k==='dhabit') wdOpenNew(b.id);
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
    // ⚙ прибрано (19.11.2026): шапка сама — кнопка налаштувань; ще — утримати віджет або «Змінити» на дошці
    const m=WD_META[b.type], nm=b.type==='countdown'?'':String(b.hd||'').slice(0,40);
    if(b.nohd) return '';
    return `<button class="wd-h" data-wga="wdcfg" aria-label="Налаштувати віджет «${esc(nm||m.t)}»"><i class="wd-dot"></i><b>${esc(nm||m.h)}</b>${extra&&!nm?`<span>${extra}</span>`:''}</button>`;
  }
  function wdTile(b,fk,inner,cls,color){
    const f=wdFolder(fk), c=safeColor(wdCcOf(b)||color||(f&&f.c)||'','#7c8cff'), tx=wdTier(b);
    const bg=b.bg==='frost'||b.bg==='solid'?' bg-'+b.bg:'';
    return `<div class="wg-t wd sz-${wdSz(b)}${tx==='xs'||tx==='row'?' tx-'+tx:''}${bg}${cls?' '+cls:''}" style="--fc:${c}">${inner}</div>`;
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
  function wdHabGrid(mk,td,rs){
    const end=new Date(td+'T12:00:00'); end.setDate(end.getDate()+(7-((end.getDay()+6)%7)-1));
    const rows=[]; for(let w=3;w>=0;w--){ const r=[]; for(let i=6;i>=0;i--){ const d=new Date(end); d.setDate(end.getDate()-w*7-i); const ds=ymdLocal(d); r.push(`<i class="${mk(ds)?'on':''}${rs&&rs(ds)?' rest':''}${ds===td?' td':''}${ds>td?' fut':''}"></i>`); } rows.push(`<span>${r.join('')}</span>`); }
    return `<span class="wd-hg" aria-hidden="true">${rows.join('')}</span>`;
  }
  // L-час: години папки по днях цього тижня (стовпчики), сьогодні виділено
  function wdWeekBars(mine,hrs,td){
    const by=jnWeek().map(ds=>({ds,h:mine(ds).reduce((s,x)=>s+hrs(x),0)})), mx=Math.max(1,...by.map(x=>x.h));
    return `<span class="wd-bars week">${by.map(x=>`<i class="${x.ds===td?'td':''}"><u style="height:${x.h?Math.max(10,Math.round(x.h/mx*100)):0}%"></u><s>${DY_DOW[(new Date(x.ds+'T12:00:00').getDay()+6)%7]}</s></i>`).join('')}</span>`;
  }
  /* ════════ Трекер цілі — вигляди (22.11.2026, полотно «Трекери в Магазині блоків») ════════
     Ланцюг (chain) — нинішня «Звичка». Шлях · Сезон · Росток · Кільце — інші малюнки тих самих позначок трекера місії.
     Пишеться лише b.look / b.days (поля вигляду, шторка 63-widget-sheet.js); позначка дня — як і раніше, wdmark → moToggleMark. */
  const WD_LOOKS=[['chain','Ланцюг'],['path','Шлях'],['grid','Сезон'],['plant','Росток'],['ring','Кільце']];
  const WD_PATH_N=[21,30,66,100];
  function wdLook(b){ const v=String(b&&b.look||''); return WD_LOOKS.some(x=>x[0]===v)?v:'chain'; }
  function wdPathN(b){ return WD_PATH_N.includes(+(b&&b.days))?+b.days:30; }
  // усі позначені дні до сьогодні включно (ключі — лише справжні дати)
  // ритм і вихідні для показу: чернетка шторки (b.__tr, у блок не пишеться — нема в WS_KEYS) або сам трекер
  /* трекер місії = старий блок calendar у її папці (moTracker). З 23.11.2026 він малюється як «Трекер цілі»: той самий код,
     що й dhabit, але через «погляд» wdCalView — копію з type:'dhabit' (позначки — те саме посилання, не копія).
     Дані не змінюються: тип у сховищі лишається calendar, вигляд і розмір — звичайні поля віджета на самому блоці. */
  function wdTrkCal(b,fk){
    try{ return !!(b&&b.type==='calendar'&&fk&&moOwnFolder(fk)&&moTracker(fk)===b&&wgFolderMission(fk)); }catch(_){ return false; }
  }
  function wdCalView(b){ return Object.assign({},b,{type:'dhabit',look:b.look||'grid',sz:b.sz||'l'}); }   // без вибору — «Сезон», великий
  // у папці вже стоїть окремий віджет «Трекер цілі» цієї ж місії — блок-трекер не дублюємо, він лишається даними
  function wdTrkDup(fk){
    const walk=arr=>(arr||[]).some(x=>x&&((x.type==='dhabit'&&(()=>{ try{ const g=wdGoal(x,fk); return g&&g.folderKey===fk; }catch(_){ return false; } })())||(Array.isArray(x.children)&&walk(x.children))));
    try{ return walk(boards[fk]); }catch(_){ return false; }
  }
  function wdTrkView(b,tr){ return b&&b.__tr&&typeof b.__tr==='object'?b.__tr:tr; }
  // ціль тижня: ритм «N на тиждень»; поки ритму в трекері нема — старе поле віджета b.goal (без міграції)
  function wdWeekGoal(b,tv){ const r=moRhythm(tv); if(r.k==='week') return r.n; return tv&&tv.rhythm?0:wsGoal(b); }
  function wdMarkedAll(tr,mk,td){ return Object.keys(tr&&tr.marks||{}).filter(ds=>/^\d{4}-\d{2}-\d{2}$/.test(ds)&&ds<=td&&mk(ds)).length; }
  const WD_PLANT=[[0,'Насінина','Seed'],[3,'Паросток','Sprout'],[7,'Росток','Seedling'],[21,'Кущ','Bush'],[66,'Дерево','Tree']];
  function wdPlantSvg(n){
    const h=Math.min(n,66), stem=24+Math.round(h/66*70), top=114-stem, leaves=Math.min(10,Math.ceil(n/3));
    let L='';
    for(let i=0;i<leaves;i++){ const y=110-Math.round((i+1)*stem/(leaves+1)), sd=i%2?1:-1, r=9+Math.min(6,Math.floor(n/12));
      L+=`<ellipse class="lf" cx="${50+sd*r}" cy="${y}" rx="${r}" ry="${Math.round(r*.45)}" transform="rotate(${sd*-28} ${50+sd*r} ${y})"/>`; }
    const bud=n>=21?`<circle class="bd" cx="50" cy="${top-5}" r="${n>=66?8:5}"/>`:'';
    return `<svg class="wd-plant" viewBox="0 0 100 124" aria-hidden="true"><ellipse class="gr" cx="50" cy="118" rx="34" ry="4"/>`
      +(n?`<path class="st" d="M50 118 Q53 ${Math.round((118+top)/2)} 50 ${top}"/>${L}${bud}`:`<ellipse class="sd" cx="50" cy="112" rx="6" ry="4"/>`)+`</svg>`;
  }
  function wdHabLook(lk,b,fk,g,gk,tr,mk,td,on,tv){
    const rs=ds=>!mk(ds)&&moIsRest(tv,ds), rh=moRhythm(tv);
    const sz=wdSz(b), tx=wdTier(b), col=folders[gk].c;
    const head=wdHead(b,fk,sz==='s'?'':'🔗 '+(WD_LOOKS.find(x=>x[0]===lk)||['',''])[1].toLowerCase());
    const hit=`<button class="wg-hit" data-wga="wdpage" data-wgg="${esc(g.id)}" data-wgtab="folder" aria-label="Трекер місії ${esc(g.name||'')}"></button>`;
    // L — пігулка з текстом; S/M — кругла «✓» у правому куті шапки (пігулка там не влазить по висоті)
    const pill=(l0,l1)=>sz==='l'?`<span class="wd-acts c"><button data-wga="wdmark" class="pill${on?' on':''}" aria-pressed="${on}">${on?l1:l0}</button></span>`
      :`<button class="wd-ck${on?' on':''}" data-wga="wdmark" aria-pressed="${on}" aria-label="${esc(on?l1:l0)}">✓</button>`;
    const all=wdMarkedAll(tr,mk,td);
    // XS і рядок: лише головне число (решту ховає 41-widget-sheet.css)
    const tiny=big=>tx==='xs'||tx==='row'?wdTile(b,fk,`${hit}${head}<b class="wd-big">${big}</b>`,'hab trk '+lk,col):'';
    if(lk==='path'){
      const N=rh.k==='days'?rh.n:wdPathN(b), n=Math.min(all,N), ms=[7,21,N].filter((x,i,a)=>x<=N&&a.indexOf(x)===i), fin=n>=N;
      const t0=tiny(`${n}<span>/${N}</span>`); if(t0) return t0;
      const cols=N===21?7:N===66?11:10;
      const cells=sz==='s'||(sz==='m'&&N>30)?`<span class="wd-bar"><i style="width:${Math.round(n/N*100)}%"></i></span>`
        :`<span class="wd-path" style="--c:${cols}" aria-hidden="true">${Array.from({length:N},(_,i)=>`<i class="${i<n?'on':''}${ms.includes(i+1)?' ms':''}${i===n&&!on&&!fin?' nx':''}"></i>`).join('')}</span>`;
      return wdTile(b,fk,`${hit}${head}
        <span class="wd-strk"><b class="wd-big xl">${n}</b><small class="wd-cap">${fin?'шлях пройдено ✓':`з ${N} ${pluralUk(N,'дня','днів','днів')}<br>лишилось ${N-n}`}</small></span>
        ${cells}${pill(fin?'✓ Сьогодні':`Крок ${n+1} — зроблено`,`Крок ${n} ✓`)}`,'hab trk path',col);
    }
    if(lk==='grid'){
      // тижні Пн–Нд до кінця цього тижня, стовпчик = тиждень; клітинки квадратні (32-widgets.css), тому S — 8 тижнів, M/L — 20
      const W=sz==='s'?8:20, end=new Date(td+'T12:00:00'); end.setDate(end.getDate()+(6-((end.getDay()+6)%7)));
      let cells='', past=0, hit2=0;
      for(let w=W-1;w>=0;w--) for(let i=6;i>=0;i--){ const d=new Date(end); d.setDate(end.getDate()-w*7-i); const ds=ymdLocal(d), m=mk(ds);
        if(ds<=td&&!rs(ds)){ past++; if(m) hit2++; } cells+=`<i class="${m?'on':''}${rs(ds)?' rest':''}${ds===td?' td':''}${ds>td?' fut':''}"></i>`; }
      const pct=past?Math.round(hit2/past*100):0, wk=jnWeek().filter(ds=>ds<=td&&mk(ds)).length;
      const t0=tiny(`${pct}%`); if(t0) return t0;
      const sum=`за ${W} ${pluralUk(W,'тиждень','тижні','тижнів')}`;
      return wdTile(b,fk,`${hit}${head}
        ${sz==='l'?`<span class="wd-strk"><b class="wd-big xl">${pct}%</b><small class="wd-cap">${sum}<br>${wk}/7 цього тижня</small></span>`
          :`<small class="wd-sub one"><em>${pct}%</em> ${sum}${sz==='m'?` · <em>${wk}/7</em> цей тиждень`:''}</small>`}
        <span class="wd-hm" style="--w:${W}" aria-hidden="true">${cells}</span>${pill('✓ Сьогодні','✓ Сьогодні є')}`,'hab trk grid',col);
    }
    if(lk==='plant'){
      const st=WD_PLANT.filter(x=>all>=x[0]).pop(), nx=WD_PLANT.find(x=>x[0]>all);
      const t0=tiny(`${all}<span> ${pluralUk(all,'день','дні','днів')}</span>`); if(t0) return t0;
      return wdTile(b,fk,`${hit}${head}
        <span class="wd-pl">${wdPlantSvg(all)}<span class="wd-col"><b class="wd-big xl">${all}</b>
          <small class="wd-cap">${st[1]}${nx?` · ${nx[1].toLowerCase()} на ${nx[0]}`:''}</small>
          ${sz==='l'?'<small class="wd-sub">Пропустив день — росток не вʼяне, просто чекає.</small>':''}</span></span>
        ${pill('Полити сьогодні','Полито ✓')}`,'hab trk plant',col);
    }
    // ring: тиждень кільцем; саме кільце — кнопка позначки
    const per=jnWeek(), n=per.filter(ds=>ds<=td&&mk(ds)).length, gl=wdWeekGoal(b,tv)||Math.max(1,7-moRest(tv).length), pct=Math.min(100,Math.round(n/gl*100));
    const t0=tiny(`${n}<span>/${gl}</span>`); if(t0) return t0;
    const st=moStreak(tv,mk);
    const ring=`<button class="wd-tapr${on?' on':''}" data-wga="wdmark" aria-pressed="${on}" aria-label="${on?'Зняти позначку за сьогодні':'Позначити сьогодні'}">
      <svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15.5" class="tr"/><circle cx="18" cy="18" r="15.5" class="vl" pathLength="100" stroke-dasharray="${pct} 100"/>${on?'<path class="ck" d="M12 18.5l4 4 8-9"/>':''}</svg>
      <b>${on?'':n+'/'+gl}</b></button>`;
    return wdTile(b,fk,`${hit}${head}
      <span class="wd-rg">${ring}<span class="wd-col"><b class="wd-big xl">${n}<span>/${gl}</span></b>
        <small class="wd-cap">цього тижня${st?`<br>${st} ${pluralUk(st,'день','дні','днів')} поспіль`:''}</small></span></span>
      ${sz==='s'?'':'<small class="wd-sub">Тап по кільцю — позначити сьогодні.</small>'}`,'hab trk ring',col);
  }
  // малий календар (S і менше): місяць не влазить — число дня і цей тиждень із позначками папки
  function wdCalWeek(td,fk){
    return `<span class="cal-wk">${jnWeek().map(ds=>{ const m=calMarks(ds,fk), d=+ds.slice(8);
      return `<button class="cal-d${ds===td?' td':''}${ds>td?' fut':''}" data-wga="wdcalday" data-ds="${ds}" aria-label="${d} ${JN_MON[+ds.slice(5,7)-1]}${m.n?', блоків: '+m.n:''}${m.ev?', є подія':''}"><s>${DY_DOW[(new Date(ds+'T12:00:00').getDay()+6)%7]}</s>${d}<i>${m.cols.map(c=>`<u style="background:${c}"></u>`).join('')}</i></button>`; }).join('')}</span>`;
  }
  function wdHTML(b,fk){
    const t=b.type, sz=wdSz(b), td=ymdLocal();
    if(t==='countdown') return tmHTML(b,fk);
    if(t==='dmission'){
      const g=wdGoal(b,fk); if(!g) return wdNoGoal(b,fk);
      const pct=jnPct(g), nx=wdNext(g), due=wdDue(g), dl=due?wdDaysLeft(due):null;
      const dueTxt=due?jnDateTxt(due)+(dl<0?' · прострочено':dl===0?' · сьогодні':' · за '+dl+' '+pluralUk(dl,'день','дні','днів')):'';
      const nm=esc(String(g.name||'Місія').slice(0,60)), em=safeEmoji(g.emoji,'🎯');
      // «Головне число» (19.11.2026): % (кільце) · кроки (рівні місії) · дні до дедлайну
      const lvA=jnLevels(g), mn=b.main==='steps'&&lvA.length?'steps':b.main==='days'&&due?'days':'pct';
      const ring=mn==='pct'&&wdOn(b,'ring');
      const bigTxt=mn==='steps'?`${lvA.filter(x=>x.done).length}<span>/${lvA.length} кроків</span>`:mn==='days'?`${Math.abs(dl)}<span> ${pluralUk(Math.abs(dl),'день','дні','днів')}${dl<0?' тому':''}</span>`:`${pct}%`;
      const hit=`<button class="wg-hit" data-wga="wdpage" data-wgg="${esc(g.id)}" aria-label="Відкрити місію ${esc(g.name||'')}"></button>`;
      const col=wdFolder(fk)?'':g.color;
      // S — макет «кільце по центру + назва під ним»; M/L — кільце ліворуч, праворуч назва, наступний крок і дедлайн
      if(sz==='s') return wdTile(b,fk,`${hit}${wdHead(b,fk)}
        ${ring?`<span class="wd-ringc">${wdRing(pct)}</span>`:`<b class="wd-big">${bigTxt}</b><span class="wd-bar"><i style="width:${pct}%"></i></span>`}
        <small class="wd-cap">${nm}</small>`,'mis',col);
      return wdTile(b,fk,`${hit}${wdHead(b,fk,'🔗 місія')}
        <span class="wd-row">${ring?wdRing(pct):`<b class="wd-big">${bigTxt}</b>`}<span class="wd-col"><b class="wd-name">${em} ${nm}</b>
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
      const per=wdPer(b), mk=ds=>moMarked(tr,ds), tv=wdTrkView(b,tr), rs=ds=>!mk(ds)&&moIsRest(tv,ds);
      const days=per==='month'?Array.from({length:moDim(td.slice(0,7))},(_,i)=>td.slice(0,8)+String(i+1).padStart(2,'0')):jnWeek();
      // непозначені вихідні не рахуються в «з N» (22.11.2026, крок 2)
      const past=days.filter(ds=>ds<=td&&!rs(ds)), n=past.filter(mk).length;
      const st=moStreak(tv,mk);
      const on=mk(td), gl=per==='week'?wdWeekGoal(b,tv):0;   // ціль днів на тиждень: ритм трекера, інакше старе b.goal (19.11.2026)
      // вигляд трекера (22.11.2026): без b.look — «Ланцюг», тобто все нижче як було; інші вигляди лише інакше малюють ті самі позначки
      const lk=wdLook(b); if(lk!=='chain') return wdHabLook(lk,b,fk,g,gk,tr,mk,td,on,tv);
      // макет: велике число серії, підпис, 7 крапок тижня (місяць — сітка), обведена кнопка «✓ Сьогодні»
      const big=wdOn(b,'streak')?`<span class="wd-strk"><b class="wd-big xl">${st}</b><small class="wd-cap">${pluralUk(st,'день','дні','днів')}<br>поспіль</small></span>`:'';
      const cnt=gl?`<small class="wd-sub${n>=gl?' ok':''}"><em>${n} з ${gl}</em> ${n>=gl?'ціль тижня взято ✓':'до цілі тижня'}</small>`
        :wdOn(b,'count')&&(sz==='l'||!wdOn(b,'streak'))?`<small class="wd-sub"><em>${n} з ${past.length}</em> ${per==='month'?'цього місяця':'цього тижня'}</small>`:'';
      const dots=wdOn(b,'days')?`<span class="wd-days ${per}">${days.map(ds=>`<i class="${mk(ds)?'on':''}${rs(ds)?' rest':''}${ds===td?' td':''}${ds>td?' fut':''}"><u></u>${per==='week'?`<s>${DY_DOW[(new Date(ds+'T12:00:00').getDay()+6)%7]}</s>`:''}</i>`).join('')}</span>`:'';
      const hitH=b.tapmk?`<button class="wg-hit" data-wga="wdmark" aria-pressed="${on}" aria-label="${on?'Зняти позначку за сьогодні':'Позначити сьогодні'}"></button>`
        :`<button class="wg-hit" data-wga="wdpage" data-wgg="${esc(g.id)}" data-wgtab="folder" aria-label="Трекер місії ${esc(g.name||'')}"></button>`;
      return wdTile(b,fk,`${hitH}
        ${wdHead(b,fk,sz==='s'?'':'🔗 трекер місії')}${sz==='l'?name:''}${big}${cnt}${dots}${sz==='l'?wdHabGrid(mk,td,rs):''}
        <span class="wd-acts c"><button data-wga="wdmark" class="pill${on?' on':''}" aria-pressed="${on}">✓ Сьогодні${on?' є':''}</button></span>`,'hab',folders[gk].c);
    }
    if(t==='dcal'){
      // календар Планера, але лише ця папка: її блоки (смужки кольору) і події (★); місяць гортається в памʼяті, не пишеться
      if(!fk) return wdTile(b,'',`${wdHead(b,'')}<b class="wd-big sm">Лише в папці</b><small class="wd-sub">Показує блоки й події з міткою папки</small>`,'empty');
      const ym=wdCalYm[b.id]||td.slice(0,7), cfk=b.ev==='all'?'':fk;   // «Весь Планер» (19.11.2026) — без фільтра папки
      const dow=['Нд','Пн','Вт','Ср','Чт','Пт','Сб'][new Date(td+'T12:00:00').getDay()];
      return wdTile(b,fk,`${wdHead(b,fk,wdSz(b)==='s'?'':'🔗 Планер · '+esc(MO_NAMES[+ym.slice(5,7)-1].toLowerCase())+(ym.slice(0,4)!==td.slice(0,4)?' '+ym.slice(0,4):''))}
        <span class="cal-nav"><button data-wga="wdcalnav" data-n="-1" aria-label="Попередній місяць">‹</button><button data-wga="wdcalnav" data-n="0">Сьогодні</button><button data-wga="wdcalnav" data-n="1" aria-label="Наступний місяць">›</button></span>
        <b class="wd-big cal-today"><span>${dow}</span> ${+td.slice(8)}</b>
        ${wdSz(b)==='s'?wdCalWeek(td,cfk):calMonthGridHTML(ym,cfk)}
        ${wdOn(b,'hint')?'<small class="wd-sub cal-hint">Тап по дню — події й блоки папки</small>':''}`,'calw');
    }
    if(t==='dtasks') return wdTasksHTML(b,fk,sz,td);
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
        ${wsGoal(b)?`<span class="wd-bar"><i style="width:${Math.min(100,Math.round(h/wsGoal(b)*100))}%"></i></span><small class="wd-sub${h>=wsGoal(b)?' ok':''}">${wdHm(h)} з ${wsGoal(b)} год${h>=wsGoal(b)?' · ціль взято ✓':''}</small>`:''}
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
      const add=wdOn(b,'add')?`<button data-wga="wdsavein">＋ ${wsQ(b)?esc(wgMoney(wsQ(b))):esc(curSym())}</button>`:'';
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

  /* ═══ «Справи папки» (dtasks, 19.11.2026) ═══
     Вікно в План: блоки Планера цієї папки (folder або місія папки) + справи без часу з folder=папка.
     Даних віджет не має — лише налаштування блоку; галочка/☆/«＋ справа» пишуть у plData() тапом людини. */
  function wdTT(uk,en){ try{ return (window.flowLang&&window.flowLang())==='en'?en:uk; }catch(_){ return uk; } }
  // справи папки на день ds; справи без часу — за тим самим правилом дати, що й у Плані (pnTaskOn, 65-plan.js)
  function wdTasksItems(fk,ds){
    const out=[], td=ymdLocal();
    plBlocksDisplay(ds).forEach(x=>{ if(x&&inFolderBlock(x,fk)) out.push({k:'b',id:String(x.id),t:String(x.t||''),done:!!x.done,h:+x.h||0,star:!!x.star,ds}); });
    (plData().tasks||[]).forEach(x=>{ if(!x||x.folder!==fk) return;
      const on=typeof pnTaskOn==='function'?pnTaskOn(x,ds):(x.scope==='day'&&!x.slotted&&ds===td?{}:null);
      if(on) out.push({k:'t',id:String(x.id),t:String(x.t||''),done:!!x.done,h:null,star:!!x.star,ds}); });
    return out.sort((a,c)=>(a.done-c.done)||((a.h==null?99:a.h)-(c.h==null?99:c.h)));
  }
  // блок дня за id; повторюваний із показу (disp_/v_) — шукаємо створений за шаблоном (як dyBind у 42-day.js)
  function wdTasksBlock(td,id){
    const L=plBlocksFor(td); let x=L.find(q=>q&&String(q.id)===String(id));
    if(!x){ const m=String(id).match(/^(?:v_|disp_)(.+)$/); if(m) x=L.find(q=>q&&q.fromRecur===m[1]); }
    return x||null;
  }
  function wdTasksHTML(b,fk,sz,td){
    if(!fk) return wdTile(b,'',`${wdHead(b,'')}<b class="wd-big sm">${wdTT('Лише в папці','Folders only')}</b><small class="wd-sub">${wdTT('Показує справи з міткою цієї папки','Shows tasks tagged with this folder')}</small>`,'empty');
    // Тиждень — 7 днів від сьогодні; рядок каже день («Пт 21»), галочка пише в свій день
    const wk=wdPer(b)==='week', days=wk?[0,1,2,3,4,5,6].map(i=>{ const d=new Date(td+'T12:00:00'); d.setDate(d.getDate()+i); return ymdLocal(d); }):[td];
    const all=[].concat(...days.map(ds=>{ const L=wdTasksItems(fk,ds); return wk?L.sort((a,c)=>(a.h==null?99:a.h)-(c.h==null?99:c.h)):L; }));
    if(wk) all.sort((a,c)=>a.done-c.done);   // стабільне сортування: дні лишаються по порядку, виконані — вниз
    const shown=all.filter(x=>wdOn(b,'done')||!x.done), dn=all.filter(x=>x.done).length;
    const dayLbl=ds=>ds===td?wdTT('сьогодні','today'):DY_DOW[(new Date(ds+'T12:00:00').getDay()+6)%7]+' '+(+ds.slice(8));
    // M — одна найближча невиконана (як «Час папки»: висоти плитки вистачає на один рядок 44px), L — до 5 (6-й на ноутбуці виходив за край)
    const rows=sz==='l'?shown.slice(0,5):sz==='m'?all.filter(x=>!x.done).slice(0,1):[], more=sz==='l'?shown.length-rows.length:0;
    const ck=x=>`<button class="wd-tk-c" data-wga="wdtck" data-k="${x.k}" data-id="${esc(x.id)}" data-ds="${x.ds}" role="checkbox" aria-checked="${x.done}" aria-label="${esc(x.t)}"><i>✓</i></button>`;
    const st=x=>sz==='l'&&wdOn(b,'star')?`<button class="wd-tk-s${x.star?' on':''}" data-wga="wdtstar" data-k="${x.k}" data-id="${esc(x.id)}" data-ds="${x.ds}" aria-label="${esc(wdTT(x.star?'Прибрати з головного':'У головне',x.star?'Remove from focus':'Add to focus'))}">${x.star?'★':'☆'}</button>`:'';
    // div, а не span: .wg-t>span вимикає натиски (32-widgets.css:25), а тут галочки
    const list=rows.length?`<div class="wd-tks">${rows.map(x=>`<span class="wd-tk${x.done?' done':''}">${ck(x)}<button class="wd-tk-t" data-wga="wdtgo" data-ds="${x.ds}">${wk?`<em>${esc(dayLbl(x.ds))}${x.h!=null?' · '+plHM(x.h):''}</em>`:x.h!=null?`<em>${plHM(x.h)}</em>`:''}<span>${esc(x.t.slice(0,60))}</span></button>${st(x)}</span>`).join('')}${more>0?`<button class="wd-tk-more" data-wga="wdtgo">${wdTT('ще','more')} ${more} ›</button>`:''}</div>`:'';
    const next=all.find(x=>!x.done);
    const empty=!all.length?`<small class="wd-sub">${wk?wdTT('Цього тижня справ папки нема','No tasks for this folder this week'):wdTT('Сьогодні справ папки нема','No tasks for this folder today')}</small>`
      :!rows.length&&sz==='m'?`<small class="wd-sub">${wdTT('на сьогодні все ✓','all done for today ✓')}</small>`
      :sz==='s'?`<small class="wd-sub">${next?(wk?esc(dayLbl(next.ds))+' · ':'')+esc(next.t.slice(0,40)):wdTT('на сьогодні все ✓','all done for today ✓')}</small>`:'';
    // «＋» — кругла кнопка поруч із числом: у M дві справи вже заповнюють плитку, окремий рядок кнопки обрізався
    const add=wdOn(b,'add')&&sz!=='s'?`<button class="wd-tk-add" data-wga="wdtadd" aria-label="${esc(wdTT('Додати справу на сьогодні','Add a task for today'))}">＋</button>`:'';
    const cnt=wdTT(pluralUk(all.length,'справа','справи','справ'),all.length===1?'task':'tasks');
    const moreM=sz==='m'&&wk?all.filter(x=>!x.done).length-rows.length:0;
    return wdTile(b,fk,`${wdHead(b,fk,wk?wdTT('тиждень','week'):wdTT('сьогодні','today'))}
      <div class="wd-tk-top"><button class="wd-tk-big" data-wga="wdtgo"><b class="wd-big">${all.length} <span>${cnt}${dn?' · '+dn+' ✓':''}</span></b></button>${add}</div>
      ${empty}${list}${moreM>0?`<button class="wd-tk-more" data-wga="wdtgo">${wdTT('ще','more')} ${moreM} ${wdTT('цього тижня','this week')} ›</button>`:''}`,'tsk');
  }
  function wdTasksAct(a,el,fk){
    if(a==='wdtgo'){ try{ const d=el.dataset.ds; if(/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&d!==ymdLocal()){ plData().selDate=d; goPlan(true); } else goPlan(); }catch(e){ console.error('wdtgo',e); } return; }
    if(!fk) return;
    const td=/^\d{4}-\d{2}-\d{2}$/.test(el.dataset.ds||'')?el.dataset.ds:ymdLocal(), id=el.dataset.id, k=el.dataset.k;
    if(a==='wdtadd'){ wdTasksAddSheet(fk); return; }
    const ref=k==='b'?wdTasksBlock(td,id):(plData().tasks||[]).find(x=>x&&String(x.id)===String(id));
    if(!ref){ plToast(wdTT('Справу змінили на іншому пристрої','The task changed on another device')); wdRedraw(); return; }
    if(a==='wdtck'){
      try{ window.platform.haptic('light'); }catch(_){}
      if(k==='b') dyComplete(ref.id,td);            // блок — та сама логіка, що в Плані й Журналі (XP, нагадування, звʼязки)
      else { ref.done=!ref.done; saveGoals(); }
      wgRefresh(); return;   // не wdRedraw: перебудова сторінки (__pgWidgetsSync) кидала папку нагору — розмір віджета ж не змінився
    }
    if(a==='wdtstar'){
      if(!ref.star){ const n=(typeof pnItems==='function'?pnItems(td):[]).filter(x=>x.ref&&x.ref.star).length;
        if(n>=3){ plToast(wdTT('Головних уже три — спершу прибери одну','You already have three — remove one first')); return; } ref.star=true; }
      else delete ref.star;
      saveGoals(); wgRefresh();
    }
  }
  function wdTasksAddSheet(fk){
    const f=wdFolder(fk), nm=String((f&&f.name)||wdTT('Папка','Folder')).slice(0,40);
    jnOverlay(`<div class="jn-ed-h"><b>＋ ${esc(wdTT('Справа на сьогодні','Task for today'))}</b><button data-jnx aria-label="${esc(wdTT('Закрити','Close'))}">✕</button></div>
      <small class="dy-fm-sub">${esc(wdTT('Папка','Folder'))}: ${esc(nm)}</small>
      <label class="jn-f"><span>${esc(wdTT('Що зробити','What to do'))}</span><input id="wdTkIn" type="text" maxlength="200" enterkeyhint="done"></label>
      <div class="jn-ed-foot"><button class="jn-btn" data-wdtkok>${esc(wdTT('Додати','Add'))}</button></div>`, ov=>{
      const inp=ov.querySelector('#wdTkIn');
      const ok=()=>{ const v=String(inp.value||'').trim().slice(0,200); if(!v){ inp.focus(); return; }
        plData().tasks.push({id:'t_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),scope:'day',t:v,c:'val',p:2,tag:'',folder:fk,done:false,open:false,subs:[]});
        saveGoals(); ov.remove(); wgRefresh(); plToast('✓ '+wdTT('Додано в План','Added to Plan')); };
      ov.querySelector('[data-wdtkok]').onclick=ok;
      inp.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.isComposing){ e.preventDefault(); ok(); } });
      setTimeout(()=>{ try{ inp.focus(); }catch(_){} },60);
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
    else if(a==='wdtck'||a==='wdtstar'||a==='wdtadd'||a==='wdtgo') wdTasksAct(a,el,fk);
    else if(a==='wdday'){ if(fk) plFolderDaySheet(fk); }
    else if(a==='wdmonth'){ if(fk) plFolderMonthSheet(fk); }
    // день — з плитки (коли її намалювали), а не з моменту тапу: після півночі не шукаємо блок у новому дні
    else if(a==='wdsub'){ const bid=el.dataset.bid, ds=/^\d{4}-\d{2}-\d{2}$/.test(el.dataset.ds||'')?el.dataset.ds:ymdLocal(); if(bid) subSheet(ds,bid); }
    else if(a==='wdsubck'){ const bid=el.dataset.bid, sid=el.dataset.sid, ds=/^\d{4}-\d{2}-\d{2}$/.test(el.dataset.ds||'')?el.dataset.ds:ymdLocal(); if(bid&&sid){ const r=subToggle(ds,bid,sid); if(r!==null) try{ window.platform.haptic('light'); }catch(_){} } }
    // прогрес місії: Лічильник · Скарбничка
    else if(a==='wdcstep'){ wdCounterStep(b,fk,+el.dataset.n<0?-1:1); }
    else if(a==='wdcsheet'||a==='wdcnew'){ const q=wdGoal(b,fk); if(q) wdCounterSheet(id,q.id,a==='wdcnew'?null:String(b.cid||'')); }
    // швидка сума лише заповнює поле — запис, як і раніше, кнопкою в шторці Гаманця
    else if(a==='wdsavein'){ const q=wdGoal(b,fk); if(q){ const o=fk?{folderKey:fk}:{}; if(wsQ(b)) o.amount=wsQ(b); wlOpSheet('in',String(q.id),o); } }
    else if(a==='wdsavegoal'){ const q=wdGoal(b,fk); if(q) wdSaveGoalSheet(q.id); }
    else if(a==='wdphadd'){ const q=wdGoal(b,fk); if(q) wdPhotoAdd(q.id); }
    else if(a==='wdphgal'){ const q=wdGoal(b,fk); if(q) wdPhotoGallery(q.id); }
    else if(a==='wdcalnav'){ const n=+el.dataset.n||0, cur=wdCalYm[b.id]||ymdLocal().slice(0,7); wdCalYm[b.id]=n?moShift(cur,n):ymdLocal().slice(0,7); wgRefresh(); }
    else if(a==='wdcalday'){ const ds=el.dataset.ds; if(fk&&/^\d{4}-\d{2}-\d{2}$/.test(ds||'')) calDaySheet(ds,{folder:b.ev==='all'?'':fk,onOpenDay:d=>{ try{ goJournal({tab:'day',ds:d}); }catch(_){} }}); }
  }

  // налаштування віджета — скляна шторка «Загальні · Цей віджет» (63-widget-sheet.js)
  function wdCfg(id){ wdSheet(id); }
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
      dir, units, sty:TM_STY.some(s=>s[0]===b.sty)?b.sty:'flip', yearly:!!b.yearly&&dir==='down', date:wdOn(b,'date'),
      end:b.end==='quiet'||b.end==='up'?b.end:'conf' };   // «Коли настане» (19.11.2026): святкувати · тихо · рахувати «від»
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
    // «до», дата настала, а людина вибрала «рахувати від» — далі рахуємо, скільки минуло
    if(off&&c.dir==='down'&&c.end==='up'&&!c.yearly) return {at, off:false, after:true, p:tmParts(at,now,c.units)};
    return {at, off, p:off?null:(c.dir==='down'?tmParts(now,at,c.units):tmParts(at,now,c.units))};
  }
  function tmDateTxt(at,c){ const ds=ymdLocal(at); return jnDateTxt(ds)+(ds.slice(0,4)!==ymdLocal().slice(0,4)?' '+ds.slice(0,4):'')+(c.tm!=='00:00'?', '+c.tm:''); }
  const tmPad=(k,v)=>(k==='h'||k==='mi'||k==='s')?String(v).padStart(2,'0'):String(v);
  // вміст живої частини віджета; el — щоб флип знав, які цифри змінились з минулої секунди
  function tmInner(c,sz,el){
    const st=tmState(c,new Date());
    const tiny=sz==='xs'||sz==='row';   // 1 клітинка чи один ряд: лише найбільша одиниця
    const dt=c.date&&!tiny?`<small class="wd-sub tm-dt">${c.dir==='down'&&!st.after?'':'з '}${esc(tmDateTxt(st.at,c))}${c.yearly?' · щороку':''}</small>`:'';
    if(st.off) return c.dir==='down'?`<b class="wd-big tm-done">${c.end==='quiet'?'Настав':'Настав! 🎉'}</b>${dt}`:`<b class="wd-big sm">Ще не почалось</b>${tiny?'':`<small class="wd-sub">Старт ${esc(tmDateTxt(st.at,c))}</small>`}`;
    let us=c.units.slice(); while(us.length>1&&!st.p[us[0]]) us.shift();   // нулі попереду не показуємо: «0 років 1 місяць» → «1 місяць»
    if(sz==='s') us=us.slice(0,2);
    if(tiny) us=us.slice(0,1);
    const pl=k=>pluralUk(st.p[k],...TM_N[k]);
    let sty=c.sty; if(sty==='rings'&&sz==='s'||tiny) sty='huge';
    if(sty==='huge'){
      const k0=us[0], rest=us.slice(1).map(k=>tmPad(k,st.p[k])+' '+TM_SH[k]).join(' · ');
      return `<span class="wd-cnt"><b class="wd-big xl">${st.p[k0]}</b><small class="wd-cap">${tiny?TM_SH[k0]:pl(k0)}${st.after&&!tiny?' тому':''}</small></span>${rest?`<small class="wd-sub tm-rest">${rest}${st.after?' тому':''}</small>`:''}${dt}`;
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
    const c=tmCfgOf(b), tx=wdTier(b), sz=tx==='xs'||tx==='row'?tx:wdSz(b), nm=esc(String(b.title||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,60));
    const hit=`<button class="wg-hit" data-wga="wdcfg" aria-label="Налаштувати відлік${nm?' «'+nm+'»':''}"></button>`;
    if(!c.target) return wdTile(b,fk,`${hit}${wdHead(b,fk)}<b class="wd-name">${nm||'Новий відлік'}</b>
      <small class="wd-sub">Вибери дату, і відлік почнеться</small><span class="wd-acts"><button data-wga="wdcfg">Вибрати дату</button></span>`,'empty');
    tmStart();
    const live=`<span class="tm-live" data-tg="${esc(c.target)}" data-tm="${esc(c.tm)}" data-dir="${c.dir}" data-u="${esc(c.units.join(','))}" data-sty="${c.sty}" data-sz="${sz}" data-yr="${c.yearly?1:''}" data-dt="${c.date?1:''}" data-end="${c.end}">${tmInner(c,sz,null)}</span>`;
    return wdTile(b,fk,`${hit}${wdHead(b,fk,c.dir==='up'?'від дати':'')}${nm?`<b class="wd-name">${nm}</b>`:''}${live}`,'tmw');
  }
  // один таймер на весь застосунок: оновлює цифри всіх видимих відліків; налаштування — з data-* самої плитки
  let tmTimer=0;
  function tmTickAll(){
    if(document.hidden) return;
    document.querySelectorAll('.tm-live').forEach(el=>{
      const d=el.dataset; if(!/^\d{4}-\d{2}-\d{2}$/.test(d.tg||'')) return;
      const c={target:d.tg, tm:/^([01]\d|2[0-3]):[0-5]\d$/.test(d.tm||'')?d.tm:'00:00', dir:d.dir==='up'?'up':'down',
        units:String(d.u||'').split(',').filter(u=>TM_U.includes(u)), sty:d.sty, yearly:d.yr==='1', date:d.dt==='1', end:d.end==='quiet'||d.end==='up'?d.end:'conf'};
      if(!c.units.length) c.units=TM_DEF.slice();
      const h=tmInner(c,d.sz,el); if(h!==el.__tmH){ el.__tmH=h; el.innerHTML=h; }
    });
  }
  function tmStart(){ if(!tmTimer) tmTimer=setInterval(tmTickAll,1000); }
  // відлік — та сама шторка, одразу на вкладці «Відлік часу» (дата, напрям, одиниці, стиль)
  function tmCfg(id){ wdSheet(id,{tab:'own'}); }

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
