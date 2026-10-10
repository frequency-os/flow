  /* ════════ Гаманець героя (46-wallet.js, 09.10.2026) ════════
     Головний екран Фінансів: картка (баланс, вільно / на призи), кнопки, перемикач «Огляд · Гроші місій».
     Огляд — три кільця місяця (цілі hero.money[ym] з «Місяця» Журналу), операції з мітками місій, конверти, борги.
     Гроші місій — дохід/витрати кожної місії за місяць проти її бюджету (g.budget.money), «Без місії».
     Операція може мати необовʼязкове поле goalId (місія). Старі операції без нього — «Без місії».
     Свято «Квест виконано» — раз на місяць на ціль; що вже показано, памʼятає лише цей пристрій (localStorage). */

  const wlState={tab:'overview'};
  function wlYm(){ return ymdLocal().slice(0,7); }
  function wlMonthOps(ym){ return (finOps||[]).filter(o=>o&&String(o.date||'').slice(0,7)===ym&&!String(o.id||'').startsWith('start_')); }
  function wlGoal(id){ return id?(goalsData.goals||[]).find(g=>g&&String(g.id)===String(id))||null:null; }
  function wlMissions(){ return (goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)!=='archive').sort((a,b)=>(jnRole(a)==='main'?0:1)-(jnRole(b)==='main'?0:1)); }
  function wlMoney(n){ return money(n); }   // головна валюта (08-finance.js)
  function wlAgg(ops,gid){
    let inc=0,out=0;
    // «Без місії» (gid==='') — також операції видаленої чи архівної місії: так розріз місій сходиться з Оглядом
    const live=new Set(wlMissions().map(g=>String(g.id)));
    ops.forEach(o=>{ if(gid!==undefined){ const og=String(o.goalId||''); if(gid===''?(og&&live.has(og)):og!==String(gid)) return; } if(_isRealIncome(o)) inc+=+o.amount||0; else if(_isRealExpense(o)) out+=+o.amount||0; });
    return {inc,out};
  }
  function wlRing(c,p,val,lbl,sub){ return `<div class="wl-r" style="--c:${c};--p:${Math.max(0,Math.min(100,p))}"><b><em>${val}</em></b><span>${lbl}</span><small>${sub}</small></div>`; }
  function wlOpRow(o){
    const g=wlGoal(o.goalId), c=g?safeColor(g.color,'#3ec7b4'):'#8c93a8', isIn=o.type==='in';
    const em=g?safeEmoji(g.emoji,'🎯'):(o.envId?'✉️':(isIn?'⬆️':'⬇️'));
    return `<button class="wl-op" data-wlop="${esc(o.id)}" style="--c:${c}"><span class="wl-op-em">${em}</span>
      <span class="wl-op-b"><b>${esc(o.label||(isIn?'Дохід':'Витрата'))}</b><small>${jnDateTxt(String(o.date||''))}${g?` · <i class="wl-tag">${esc(g.name||'Місія')}</i>`:(o.envId||o._tr?' · переказ':'')}${wlFolderName(o.folderKey)?` · <i class="wl-tag fd">📁 ${esc(wlFolderName(o.folderKey))}</i>`:''}${isIn&&wlSrc(o)!=='main'?` · ${WL_SRC[wlSrc(o)][0]}`:''}</small></span>
      <b class="${isIn?'in':'out'}">${isIn?'+':'−'}${esc(money(o.amount,o.cur||''))}</b></button>`;
  }

  function wlRender(body){
    ensureCards();
    const bal=walletBalance(), pz=typeof pzTotal==='function'?pzTotal():0, ym=wlYm(), ops=wlMonthOps(ym), all=wlAgg(ops);
    const sub=document.getElementById('finSub'); if(sub) sub.textContent='гаманець героя · '+MO_NAMES[+ym.slice(5,7)-1].toLowerCase();
    let h=`<div class="wl-card"><button class="wl-cur" data-wlcur aria-label="Головна валюта">${esc(curSym())}${curLocked()?'':' ▾'}</button><small>Баланс</small><b>${wlMoney(bal+pz)}</b><span class="wl-sp"><span>вільно <b>${wlMoney(bal)}</b></span>${pz?`<span>🏆 на призи <b>${wlMoney(pz)}</b></span>`:''}${wlCurList().length?`<span>разом ≈ <b>${wlMoney(wlTotalApprox()+pz)}</b></span>`:''}</span></div>
      ${wlCursHTML()}
      <div class="wl-acts"><button class="pri" data-wladd="out">− Витрата</button><button data-wladd="in">＋ Дохід</button><button data-wlpz>🏆 Відкласти</button></div>
      <div class="wl-seg"><button data-wltab="overview"${wlState.tab==='overview'?' class="on"':''}>Огляд</button><button data-wltab="missions"${wlState.tab==='missions'?' class="on"':''}>Місії</button><button data-wltab="folders"${wlState.tab==='folders'?' class="on"':''}>Папки</button><button data-wltab="plan"${wlState.tab==='plan'?' class="on"':''}>План</button></div>`;
    const plan=wlState.tab==='plan'&&typeof rlPlanHTML==='function';   // план місяця (47-rules.js)
    if(wlState.tab==='overview'&&typeof wlStartHTML==='function') h+=wlStartHTML();   // порожній Гаманець — «З чого почнемо?» першим, над плитками
    if(wlState.tab==='overview'&&typeof wgWalletHTML==='function') h+=wgWalletHTML();   // плитки Місія · Конверти · Борги (48-widgets.js)
    h+=plan?rlPlanHTML(ym):wlState.tab==='missions'?wlMissionsHTML(ops):wlState.tab==='folders'?wlFoldersHTML(ops):wlOverviewHTML(ops,all,ym);
    body.innerHTML=h+'<div class="jn-pad"></div>';
    wlBind(body);
    if(plan) rlPlanBind(body,ym);
    try{ if(typeof wgHome==='function') wgHome(body); }catch(e){ console.error('wgHome',e); }
    wlQuestCheck(ym,all);
  }
  function wlOverviewHTML(ops,all,ym){
    const g=(jnHero().money&&jnHero().money[ym])||null, svd=typeof pzMonthSaved==='function'?Math.max(0,pzMonthSaved(ym)):0;
    let h='';
    if(g&&(+g.earn>0||+g.spend>0||+g.save>0)){
      h+=`<div class="wl-rings">${+g.earn>0?wlRing('var(--hab,#34c77b)',all.inc/g.earn*100,Math.round(all.inc/g.earn*100)+'%','Заробив',wlMoney(all.inc)+' / '+wlMoney(g.earn)):''}
        ${+g.spend>0?wlRing(all.out>g.spend?'#ff4d6d':'#e8930c',all.out/g.spend*100,Math.round(all.out/g.spend*100)+'%','Витратив',wlMoney(all.out)+' / '+wlMoney(g.spend)):''}
        ${+g.save>0?wlRing('#f0b429',svd/g.save*100,Math.round(svd/g.save*100)+'%','Відклав',wlMoney(svd)+' / '+wlMoney(g.save)):''}</div>
        <button class="wl-link" data-wlgoals>змінити цілі місяця</button>`;
    } else {
      h+=`<div class="wl-fact"><span>Заробив <b>${wlMoney(all.inc)}</b></span><span>Витратив <b>${wlMoney(all.out)}</b></span></div><button class="mo-set" data-wlgoals>Задати цілі місяця</button>`;
    }
    { const by={main:0,extra:0,passive:0}; ops.forEach(o=>{ if(_isRealIncome(o)) by[wlSrc(o)]+=+o.amount||0; });
      if(by.extra||by.passive){ const tot=by.main+by.extra+by.passive||1;
        h+=`<div class="wl-src"><div class="wl-src-h"><span>Дохід місяця</span><b>${wlMoney(tot)}</b></div>
          <div class="wl-src-bar">${Object.keys(WL_SRC).map(k=>by[k]?`<i class="s-${k}" style="width:${by[k]/tot*100}%"></i>`:'').join('')}</div>
          <div class="wl-src-k">${Object.keys(WL_SRC).map(k=>`<span class="s-${k}"><small>${WL_SRC[k][0]} ${WL_SRC[k][1].toLowerCase()}</small><b>${wlMoney(by[k])}</b>${by[k]&&k!=='main'?`<em>${Math.round(by[k]/tot*100)}%</em>`:''}</span>`).join('')}</div></div>`; } }
    const last=(finOps||[]).filter(o=>o&&o.id!=null&&String(o.id)!==''&&!String(o.id).startsWith('start_')).slice(-8).reverse();
    h+=`<div class="wl-sec"><span>Останні операції</span><button data-wlhist>історія ›</button></div>`;
    h+=last.length?`<div class="wl-ops">${last.map(wlOpRow).join('')}</div>`:`<div class="dy-empty"><span>Ще нема операцій. Почни з «Витрата» або «Дохід».</span></div>`;
    // конверти й борги — як і раніше
    const envTop=(envelopes||[]).slice(0,4);
    h+=`<div class="wl-sec"><span>Конверти й скарбнички</span><button data-wlenv>усі ›</button></div>`;
    h+=envTop.length?envTop.map(e=>{ const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
      return `<button class="wl-env" data-envopen="${esc(e.id)}" style="--c:${safeColor(e.color,'#5b8def')}"><i style="width:${pct}%"></i><span>${safeEmoji(e.emoji,'✉️')}</span><span><b>${esc(e.name)}</b><small>${e.goal?pct+'% · ще '+esc(money(Math.max(0,e.goal-sv),envCur(e))):'без цілі'}</small></span><b>${esc(money(sv,envCur(e)))}</b></button>`; }).join('')
      :`<button class="wl-starter" data-wlstarter><span>🗂</span><span><b>Розклади гроші по конвертах</b><small>Продукти, кафе, транспорт, житло… — вибери стандартні або створи свої</small></span><i>›</i></button>`;
    let debts='—'; try{ debts=debtSummary(); }catch(_){}
    h+=`<button class="wl-env" data-wldebts><span>🤝</span><span><b>Борги</b><small>нетто</small></span><b>${esc(String(debts))}</b></button>`;
    if(typeof qaGuide==='function') h+=`<button class="wl-link" data-wlqa>💳 Записувати покупки з Apple Pay автоматично ›</button>`;   // 50-quickadd.js
    return h;
  }
  function wlMissionsHTML(ops){
    const ms=wlMissions(); let h='';
    ms.forEach(g=>{ const a=wlAgg(ops,g.id), bud=g.budget&&+g.budget.money>0?+g.budget.money:0, c=safeColor(g.color,'#3ec7b4'), pr=a.inc-a.out;
      h+=`<button class="wl-m" data-wlm="${esc(g.id)}" style="--c:${c}"><span class="wl-m-h"><span>${safeEmoji(g.emoji,'🎯')}</span><b>${esc(g.name||'Місія')}</b><span class="${pr>=0?'in':'out'}">${pr>=0?'+':'−'}${wlMoney(Math.abs(pr))}</span></span>
        <span class="wl-m-d"><span>дохід <b>${wlMoney(a.inc)}</b></span><span>витрати <b>${wlMoney(a.out)}</b>${bud?' / '+wlMoney(bud):''}</span>${g.reward&&g.reward.t?`<span>${safeEmoji(g.reward.emoji,'🎁')} ${esc(g.reward.t)}</span>`:''}</span>
        ${bud?`<span class="wl-bar"><i class="${a.out>bud?'over':''}" style="width:${Math.min(100,Math.round(a.out/bud*100))}%"></i></span>`:''}</button>`; });
    const none=wlAgg(ops,'');
    h+=`<button class="wl-m none" data-wlm=""><span class="wl-m-h"><span>📦</span><b>Без місії</b><span class="out">−${wlMoney(none.out)}</span></span><span class="wl-m-d"><span>побутові витрати й доходи без місії${none.inc?' · дохід '+wlMoney(none.inc):''}</span></span></button>`;
    return (ms.length?'':'<div class="dy-empty"><span>Місій ще нема — тут буде розріз грошей по місіях.</span></div>')+h;
  }
  // ── гроші папок: операції з міткою folderKey (віджети «Доходи»/«Витрати» в папці) ──
  function wlFoldersHTML(ops){
    // ключ — папка + валюта: гроші папки в € і в ₴ — окремими рядками
    const by={}; ops.forEach(o=>{ const f=wlFolderName(o.folderKey)?String(o.folderKey):''; if(!f) return; const c=o.cur||'', k=f+'|'+c; if(!by[k]) by[k]={f,c,inc:0,out:0,n:0};
      if(_isIncAny(o)) by[k].inc+=+o.amount||0; else if(_isExpAny(o)) by[k].out+=+o.amount||0; by[k].n++; });
    const keys=Object.keys(by).sort((a,b)=>(by[b].inc-by[b].out)-(by[a].inc-by[a].out));
    let h=keys.length?'':`<div class="dy-empty"><b>Ще нема грошей папок</b><span>Додай у папку-проєкт віджет «Доходи» чи «Витрати» (меню «/» → Гроші) — записи з нього будуть тут.</span></div>`;
    keys.forEach(k=>{ const a=by[k], f=folders[a.f]||{}, pr=a.inc-a.out;
      h+=`<button class="wl-m" data-wlfd="${esc(a.f)}" style="--c:${safeColor(f.c,'#c48cff')}"><span class="wl-m-h"><span>${safeEmoji(f.emoji,'📁')}</span><b>${esc(f.name||'Папка')}${a.c?' · '+esc(curSym(a.c)):''}</b><span class="${pr>=0?'in':'out'}">${pr>=0?'+':'−'}${esc(money(Math.abs(pr),a.c))}</span></span>
        <span class="wl-m-d"><span>дохід <b>${esc(money(a.inc,a.c))}</b></span><span>витрати <b>${esc(money(a.out,a.c))}</b></span><span>${a.n} ${pluralUk(a.n,'запис','записи','записів')}</span></span></button>`; });
    return h;
  }
  function wlFolderSheet(k){
    const f=folders[k]; if(!f) return;
    const ym=wlYm(), all=wlMonthOps(ym).filter(o=>String(o.folderKey||'')===String(k)&&(_isIncAny(o)||_isExpAny(o))), ops=all.filter(opMain);
    const inc=ops.filter(_isRealIncome).reduce((s,o)=>s+(+o.amount||0),0), out=ops.filter(_isRealExpense).reduce((s,o)=>s+(+o.amount||0),0);
    jnOverlay(`<div class="jn-ed-h"><b>${safeEmoji(f.emoji,'📁')} ${esc(f.name||'Папка')}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">${esc(MO_NAMES[+ym.slice(5,7)-1])}: дохід ${wlMoney(inc)} · витрати ${wlMoney(out)} · ${inc-out>=0?'прибуток':'мінус'} ${wlMoney(Math.abs(inc-out))}</small>
      <div class="wl-ops">${all.length?all.slice().reverse().map(wlOpRow).join(''):'<div class="dy-empty"><span>Цього місяця записів нема.</span></div>'}</div>
      <div class="wl-acts"><button class="pri" data-wlfgo>Відкрити папку</button><button data-wlfadd="in">＋ Дохід</button></div>`, ov=>{
      ov.querySelector('[data-wlfgo]').onclick=()=>{ ov.remove(); try{ goFolder(k); }catch(_){} };
      ov.querySelector('[data-wlfadd]').onclick=()=>{ ov.remove(); wlOpSheet('in','',{folderKey:k, src:'extra'}); };
      ov.querySelectorAll('[data-wlop]').forEach(b=>b.onclick=()=>{ ov.remove(); wlOpMenu(b.dataset.wlop); });
    });
  }
  function wlBind(c){
    c.querySelectorAll('[data-wladd]').forEach(b=>b.onclick=()=>wlOpSheet(b.dataset.wladd,''));
    { const cu=c.querySelector('[data-wlcur]'); if(cu) cu.onclick=()=>curPickSheet(); }
    c.querySelectorAll('[data-wlcb]').forEach(b=>b.onclick=()=>wlCurSheet(b.dataset.wlcb));
    { const ad=c.querySelector('[data-wlcadd]'); if(ad) ad.onclick=wlCurAdd; }
    { const ex=c.querySelector('[data-wlx]'); if(ex) ex.onclick=()=>wlExchange(''); }
    { const p=c.querySelector('[data-wlpz]'); if(p) p.onclick=()=>{ if(typeof pzScreen==='function') pzScreen(); }; }
    c.querySelectorAll('[data-wltab]').forEach(b=>b.onclick=()=>{ wlState.tab=b.dataset.wltab; renderFinance(); });
    c.querySelectorAll('[data-wlgoals]').forEach(b=>b.onclick=()=>moMoneySheet(wlYm(),()=>renderFinance()));
    { const hs=c.querySelector('[data-wlhist]'); if(hs) hs.onclick=()=>{ try{ goSpend(); }catch(_){} }; }
    { const st=c.querySelector('[data-wlstarter]'); if(st) st.onclick=()=>wlEnvStarter(); }
    if(typeof wlStartBind==='function') wlStartBind(c);
    { const qa=c.querySelector('[data-wlqa]'); if(qa) qa.onclick=()=>qaGuide(); }
    { const ev=c.querySelector('[data-wlenv]'); if(ev) ev.onclick=()=>{ finView='envelopes'; renderFinance(); }; }
    { const d=c.querySelector('[data-wldebts]'); if(d) d.onclick=()=>{ try{ goDebts(); }catch(_){} }; }
    c.querySelectorAll('[data-envopen]').forEach(el=>el.onclick=()=>openEnvSheet(el.dataset.envopen));
    c.querySelectorAll('[data-wlop]').forEach(b=>b.onclick=()=>wlOpMenu(b.dataset.wlop));
    c.querySelectorAll('[data-wlm]').forEach(b=>b.onclick=()=>wlMissionSheet(b.dataset.wlm));
    c.querySelectorAll('[data-wlfd]').forEach(b=>b.onclick=()=>wlFolderSheet(b.dataset.wlfd));
  }

  // ── нова операція: сума, на що, до місії (необовʼязково) ──
  /* тип доходу (поєднання A+C, 09.10.2026): основний / додатковий / пасивний; старі операції без src — основний */
  const WL_SRC={main:['💼','Основний'], extra:['✨','Додатковий'], passive:['🌱','Пасивний']};
  function wlSrc(o){ return o&&WL_SRC[o.src]?o.src:'main'; }
  function wlFolderName(k){ try{ return k&&typeof moOwnFolder==='function'&&moOwnFolder(k)?String(folders[k].name||'Папка'):''; }catch(_){ return ''; } }
  // opt: {folderKey, src, label} — коли шторку відкриває віджет папки (48-widgets.js)
  function wlOpSheet(type,preGid,opt){
    opt=opt||{};
    const ms=wlMissions(), t=type==='in'?'Дохід':'Витрата'; let gid=preGid||'', src=WL_SRC[opt.src]?opt.src:'main';
    const curs=wlCurList();
    if(opt.cur&&curOk(opt.cur)&&opt.cur!==mainCur()&&!curs.includes(opt.cur)){ curs.push(opt.cur); wlCurSave(curs); }   // €-віджет на пристрої, де €-балансу ще нема
    let cur=opt.cur&&curs.includes(opt.cur)?opt.cur:mainCur();   // баланс запису (етап 2 валют)
    const fk=wlFolderName(opt.folderKey)?String(opt.folderKey):'';
    const chips=()=>ms.map(g=>`<button data-wlg="${esc(g.id)}"${String(gid)===String(g.id)?' class="on"':''} style="--c:${safeColor(g.color,'#3ec7b4')}">${safeEmoji(g.emoji,'🎯')} ${esc(String(g.name||'').slice(0,18))}</button>`).join('')+`<button data-wlg=""${gid?'':' class="on"'}>без місії</button>`;
    const budTxt=()=>{ const g=wlGoal(gid); if(!g||type!=='out'||!(g.budget&&+g.budget.money>0)) return ''; const a=wlAgg(wlMonthOps(wlYm()),g.id); return 'Бюджет «'+esc(g.name||'')+'» на місяць: '+wlMoney(a.out)+' з '+wlMoney(g.budget.money); };
    jnOverlay(`<div class="jn-ed-h"><b>${type==='in'?'＋':'−'} ${t}</b><button data-jnx aria-label="Закрити">✕</button></div>
      ${curs.length?`<div class="jn-f"><span>Баланс</span><div class="wl-chips" id="wlCurC">${[mainCur()].concat(curs).map(c=>`<button data-wlc="${c}"${c===cur?' class="on"':''}>${esc(curSym(c))} ${esc((CUR_LIST[c]||{}).n||c)}</button>`).join('')}</div></div>`:''}
      ${opt.fromLink?`<div class="wl-fromlink">🔗 Відкрито з посилання — перевір суму й назву, перш ніж записати</div>`:''}
      <label class="jn-f"><span id="wlAmtL">Сума, ${esc(curSym(cur))}</span><input id="wlAmt" type="number" inputmode="decimal" min="0" step="1" placeholder="Напр. 500" value="${+opt.amount>0?esc(String(Math.round(+opt.amount*100)/100)):''}"></label>
      <label class="jn-f"><span>На що</span><input id="wlLbl" maxlength="80" value="${esc(String(opt.label||'').slice(0,80))}" placeholder="${type==='in'?'Зарплата, оплата від клієнта…':'Їжа, таксі, підручник…'}"></label>
      ${type==='out'&&wlSpendEnvs().length?`<div class="jn-f" id="wlEnvF"${wlEnvPick(cur)?'':' hidden'}><span>З конверта (необовʼязково)</span><div class="wl-envpick" id="wlEnvP">${wlEnvPick(cur)}</div></div>`:''}
      ${type==='in'?`<div class="jn-f"><span>Тип доходу</span><div class="wl-chips" id="wlSrc">${Object.keys(WL_SRC).map(k=>`<button data-wlsrc="${k}"${k===src?' class="on"':''}>${WL_SRC[k][0]} ${WL_SRC[k][1]}</button>`).join('')}</div></div>`:''}
      ${fk?`<small class="mo-note">📁 Запишеться з міткою папки «${esc(wlFolderName(fk))}»</small>`:''}
      ${ms.length?`<div class="jn-f" id="wlMisF"${cur!==mainCur()?' hidden':''}><span>До місії (необовʼязково)</span><div class="wl-chips" id="wlChips">${chips()}</div><small class="mo-note" id="wlBud">${budTxt()}</small></div>`:''}
      <div class="jn-ed-foot"><button class="jn-btn" data-wlok>Записати</button></div>`, ov=>{
      const bindChips=()=>ov.querySelectorAll('[data-wlg]').forEach(b=>b.onclick=()=>{ gid=b.dataset.wlg; ov.querySelector('#wlChips').innerHTML=chips(); const bt=ov.querySelector('#wlBud'); if(bt) bt.innerHTML=budTxt(); bindChips(); });
      bindChips();
      ov.querySelectorAll('[data-wlc]').forEach(b=>b.onclick=()=>{ cur=b.dataset.wlc; ov.querySelectorAll('[data-wlc]').forEach(x=>x.classList.toggle('on',x===b));
        const l=ov.querySelector('#wlAmtL'); if(l) l.textContent='Сума, '+curSym(cur);
        const mf=ov.querySelector('#wlMisF'); if(mf) mf.hidden=cur!==mainCur();
        // конверти — лише тієї валюти, з якої витрата (етап 3 валют)
        const ef=ov.querySelector('#wlEnvF'); if(ef){ envId=''; const h2=wlEnvPick(cur); ov.querySelector('#wlEnvP').innerHTML=h2; ef.hidden=!h2; bindEnvP(); } });   // місії рахують лише головну валюту
      let envId='';
      const bindEnvP=()=>ov.querySelectorAll('[data-wlenvp]').forEach(b=>b.onclick=()=>{ envId=envId===b.dataset.wlenvp?'':b.dataset.wlenvp; ov.querySelectorAll('[data-wlenvp]').forEach(x=>x.classList.toggle('on',x.dataset.wlenvp===envId));
        const lb=ov.querySelector('#wlLbl'), e=(envelopes||[]).find(x=>String(x.id)===envId); if(e&&lb&&!lb.value.trim()) lb.placeholder=e.name; });
      bindEnvP();
      ov.querySelectorAll('[data-wlsrc]').forEach(b=>b.onclick=()=>{ src=b.dataset.wlsrc; ov.querySelectorAll('[data-wlsrc]').forEach(x=>x.classList.toggle('on',x===b)); });
      setTimeout(()=>{ try{ ov.querySelector('#wlAmt').focus(); }catch(_){} },80);
      ov.querySelector('[data-wlok]').onclick=()=>{
        const amount=Math.round(parseFloat(String(ov.querySelector('#wlAmt').value||'').replace(',','.'))*100)/100;
        if(!(amount>0)){ plToast('Вкажи суму'); return; }
        const env=envId?(envelopes||[]).find(x=>String(x.id)===envId&&(envCur(x)||mainCur())===cur)||null:null;
        // «Правило 24 годин» (49-finlit.js): велика витрата з вільних у головній валюті — спершу пропозиція почекати
        if(type==='out'&&!env&&cur===mainCur()&&!ov.__h24ok&&typeof flH24==='function'&&flH24(amount,String(ov.querySelector('#wlLbl').value||'').trim()||t,()=>{ ov.__h24ok=true; const b=ov.querySelector('[data-wlok]'); if(b) b.click(); },()=>ov.remove())) return;
        const typed=String(ov.querySelector('#wlLbl').value||'').trim().slice(0,80), label=typed||(env?env.name:t);
        // з конверта: гроші вже відкладені — витрата йде з конверта (envAddOp 'out' = envSpend, баланс удруге не списує).
        // Якщо в конверті менше — пишемо звичайну витрату з вільних і кажемо про це (з мінусом у конверт не йдемо).
        if(env){
          const sv=envSaved(env);
          if(amount<=sv+1e-9){
            envAddOp(env,'out',amount,typed||'Витрата');   // підпис в історії: «Продукти · <що>», без «Продукти · Продукти»
            const fo=finOps[finOps.length-1]; if(fo&&fo.envId===env.id){ if(gid&&wlGoal(gid)) fo.goalId=String(gid); if(fk&&wlFolderName(fk)) fo.folderKey=fk; saveFinOps();
              try{ if(typeof rlOnOp==='function') rlOnOp(fo); }catch(err){ console.error('rlOnOp',err); } }   // правила (бюджет місії) — як для звичайної витрати
            ov.remove(); renderFinance(); try{ if(typeof wgRefresh==='function') wgRefresh(); }catch(_){}
            plToast((env.emoji?safeEmoji(env.emoji,'✉️')+' ':'')+'−'+money(amount,cur)+' з «'+env.name+'» · лишилось '+money(envSaved(env),cur));
            return;
          }
          plToast('У «'+env.name+'» лише '+money(sv,cur)+' — витрату записано з вільних грошей');
        }
        const op={ id:Date.now()+'_'+Math.random().toString(36).slice(2,6), type, amount, label, date:ymdLocal(), card:mainCard().id };
        if(cur!==mainCur()) op.cur=cur;
        else if(gid&&wlGoal(gid)) op.goalId=String(gid);
        if(fk&&wlFolderName(fk)) op.folderKey=fk;
        if(type==='in'&&src!=='main') op.src=src;
        finOps.push(op); saveFinOps(); ov.remove(); renderFinance();
        try{ if(typeof wgRefresh==='function') wgRefresh(); }catch(_){}   // віджети в папці й на Огляді
        try{ flowReact(type==='in'?'income':'spend',{amount}); }catch(_){}
        try{ if(typeof rlOnOp==='function') rlOnOp(op); }catch(err){ console.error('rlOnOp',err); }   // правила: скарбничка / зарплата / бюджет
      };
    });
  }
  // ── тап по операції: привʼязати до місії / видалити ──
  function wlOpMenu(id){
    const o=(finOps||[]).find(x=>String(x.id)===String(id)); if(!o) return;
    const g=wlGoal(o.goalId), items=[];
    if(o._xid){ items.push({ic:'trash', label:'Скасувати обмін', sub:'прибере обидва записи обміну', danger:true, onClick:()=>confirmSheet({title:'Скасувати обмін?', sub:'Обидва баланси повернуться як були.', okLabel:'Скасувати обмін', onOk:()=>{
      finOps=finOps.filter(x=>!(x&&x._xid===o._xid)); saveFinOps(); renderFinance(); }})});
      actionSheet({title:o.label||'Обмін', sub:money(o.amount,o.cur||''), items}); return; }
    if(String(o.id||'').startsWith('start_cur_')) items.push({ic:'trash', label:'Видалити стартовий залишок', danger:true, onClick:()=>confirmSheet({title:'Видалити стартовий залишок?', sub:money(o.amount,o.cur||''), onOk:()=>{
      const i=finOps.indexOf(o); if(i>=0){ finOps.splice(i,1); saveFinOps(); } renderFinance(); }})});
    if(!o.envId&&!o._tr&&opMain(o)&&wlMissions().length) items.push({ic:'target', label:g?'Інша місія':'Привʼязати до місії', sub:g?'зараз: '+(g.name||''):'', onClick:()=>{
      const ms=wlMissions();
      actionSheet({title:'До якої місії?', sub:o.label||'', items:ms.map(m=>({ic:'target', label:(m.emoji?String(m.emoji)+' ':'')+(m.name||'Місія'), onClick:()=>{ const q=(finOps||[]).find(x=>String(x.id)===String(id)); if(q){ q.goalId=String(m.id); saveFinOps(); renderFinance(); } }}))
        .concat(g?[{ic:'refresh', label:'Без місії', onClick:()=>{ const q=(finOps||[]).find(x=>String(x.id)===String(id)); if(q){ delete q.goalId; saveFinOps(); renderFinance(); } }}]:[])});
    }});
    // рух конверта/скарбнички видаляється лише в самому конверті — інакше суми конверта й Гаманця розійдуться
    if(o.envId){ items.push({ic:'edit', label:'Відкрити конверт', sub:'рух видаляється там, щоб суми не розійшлись', onClick:()=>{ try{ openEnvSheet(o.envId); }catch(_){} }}); }
    else if(!o._tr) items.push({ic:'trash', label:'Видалити операцію', danger:true, onClick:()=>confirmSheet({title:'Видалити операцію?', sub:(o.label||'')+' · '+(o.type==='in'?'+':'−')+money(o.amount,o.cur||'')+wlLinkedNote(o), onOk:()=>{
      const i=finOps.indexOf(o); if(i>=0){ finOps.splice(i,1); saveFinOps(); } renderFinance(); }})});   // саме цей обʼєкт, не всі з таким id
    actionSheet({title:o.label||(o.type==='in'?'Дохід':'Витрата'), sub:(o.type==='in'?'+':'−')+money(o.amount,o.cur||'')+' · '+jnDateTxt(String(o.date||'')), items});
  }
  // операція, створена Боргами чи Роботою: попереджаємо, що змінювати краще там
  function wlLinkedNote(o){
    try{ if(typeof debtItems!=='undefined'&&debtItems.some(i=>i&&i.finOpId!=null&&String(i.finOpId)===String(o.id))) return ' · це операція боргу — краще змінювати в «Боргах», інакше борг лишиться позначеним'; }catch(_){}
    if(o._autoSal||o._src==='work') return ' · це запис Роботи — краще змінювати там';
    return '';
  }
  // ── гроші однієї місії (або «Без місії») ──
  function wlMissionSheet(gid){
    const live=new Set(wlMissions().map(x=>String(x.id)));
    const g=gid?wlGoal(gid):null, ym=wlYm(), ops=wlMonthOps(ym).filter(o=>{ const og=String(o.goalId||''); return (gid?og===String(gid):!(og&&live.has(og)))&&(_isRealIncome(o)||_isRealExpense(o)); });
    const a=wlAgg(wlMonthOps(ym),gid||''), bud=g&&g.budget&&+g.budget.money>0?+g.budget.money:0;
    jnOverlay(`<div class="jn-ed-h"><b>${g?safeEmoji(g.emoji,'🎯')+' '+esc(g.name||'Місія'):'📦 Без місії'}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">${esc(MO_NAMES[+ym.slice(5,7)-1])}: дохід ${wlMoney(a.inc)} · витрати ${wlMoney(a.out)}${bud?' з '+wlMoney(bud):''} · ${a.inc-a.out>=0?'прибуток':'мінус'} ${wlMoney(Math.abs(a.inc-a.out))}</small>
      <div class="wl-ops">${ops.length?ops.slice().reverse().map(wlOpRow).join(''):'<div class="dy-empty"><span>Цього місяця операцій нема.</span></div>'}</div>
      ${g?`<div class="wl-acts"><button class="pri" data-wlsadd="out">− Витрата</button><button data-wlsadd="in">＋ Дохід</button></div>`:''}`, ov=>{
      ov.querySelectorAll('[data-wlsadd]').forEach(b=>b.onclick=()=>{ ov.remove(); wlOpSheet(b.dataset.wlsadd,gid); });
      ov.querySelectorAll('[data-wlop]').forEach(b=>b.onclick=()=>{ ov.remove(); wlOpMenu(b.dataset.wlop); });
    });
  }
  // ── «Квест виконано!»: ціль місяця «Заробити» чи «Відкласти» досягнуто — раз на місяць на цьому пристрої ──
  function wlQuestCheck(ym,all){
    if(typeof rlOn==='function'&&!rlOn('quest')) return;   // правило «Квест місяця» вимкнено в Книзі правил
    const g=jnHero().money&&jnHero().money[ym]; if(!g) return;
    const svd=typeof pzMonthSaved==='function'?Math.max(0,pzMonthSaved(ym)):0;
    const q=[];
    if(+g.earn>0&&all.inc>=+g.earn) q.push(['earn','💰','Заробити '+wlMoney(g.earn)+' за місяць — є!']);
    if(+g.save>0&&svd>=+g.save) q.push(['save','🏆','Відкласти на призи '+wlMoney(g.save)+' — є!']);
    for(const [k,em,txt] of q){
      const key='flow_quest_'+ym+'_'+k; let seen=false; try{ seen=localStorage.getItem(key)==='1'; }catch(_){}
      if(seen) continue;
      try{ localStorage.setItem(key,'1'); }catch(_){}
      const ov=document.createElement('div'); ov.className='jn-cel'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.style.setProperty('--c','#34c77b');
      ov.innerHTML=`<div class="jn-cel-in"><span class="jn-conf" aria-hidden="true">${'<i></i>'.repeat(14)}</span><span class="jn-cel-ok">${em}</span><b>Квест виконано!</b><p>${esc(txt)}</p><button class="jn-cel-go" data-wlqok>Далі</button></div>`;
      document.body.appendChild(ov); ov.querySelector('[data-wlqok]').onclick=()=>ov.remove();
      break;   // по одному святу за раз
    }
  }

  /* ════ Додаткові баланси в інших валютах (етап 2 валют, 09.10.2026) ════
     Список кодів — 'fin_curs' (prefSet, пише лише людина) + валюти, що вже трапились в операціях.
     Баланс валюти = операції з op.cur===код. Обмін — пара переказів (_tr, спільний _xid): не дохід і не витрата.
     «Разом ≈» — лише показ за курсом людини (finLastRate), нічого не перераховує. */
  function wlCurList(){
    let l=[]; try{ const v=JSON.parse(localStorage.getItem('fin_curs')||'[]'); if(Array.isArray(v)) l=v.filter(x=>typeof x==='string'); }catch(_){}
    try{ (finOps||[]).forEach(o=>{ if(o&&o.cur&&!l.includes(o.cur)) l.push(o.cur); }); }catch(_){}
    const m=mainCur(); return l.filter((c,i)=>c!==m&&l.indexOf(c)===i&&Object.prototype.hasOwnProperty.call(CUR_LIST,c));
  }
  function wlCurSave(l){ try{ prefSet('fin_curs', JSON.stringify(l)); }catch(_){} }
  function curBalance(c){ return (finOps||[]).filter(o=>o&&o.cur===c&&!o.envSpend).reduce((s,o)=>s+(o.type==='in'?+o.amount||0:-(+o.amount||0)),0); }
  function wlTotalApprox(){ let t=0; try{ t=walletBalance(); }catch(_){} wlCurList().forEach(c=>{ t+=curBalance(c)*(finLastRate(c)||0); }); return t; }
  try{ prefCatchup('fin_curs', ()=>{ try{ renderFinance(); }catch(_){} }); }catch(_){}
  function wlCursHTML(){
    const l=wlCurList();
    return `<div class="wl-curs">${l.map(c=>`<button class="wl-cb" data-wlcb="${c}"><small>${esc((CUR_LIST[c]||{}).n||c)}</small><b>${esc(money(curBalance(c),c))}</b></button>`).join('')}
      <button class="wl-cb add" data-wlcadd><small>＋ Баланс</small><b>в іншій валюті</b></button>${l.length?`<button class="wl-cb add" data-wlx><small>⇄ Обмін</small><b>між балансами</b></button>`:''}</div>`;
  }
  function wlCurAdd(){
    const have=wlCurList(), m=mainCur(), free=Object.keys(CUR_LIST).filter(c=>c!==m&&!have.includes(c));
    if(!free.length){ plToast('Усі валюти вже додано'); return; }
    actionSheet({title:'Баланс в іншій валюті', sub:'Окремі гроші, напр. євро-рахунок. Головний баланс ('+curSym()+') не зміниться.',
      items:free.map(c=>({ic:'plus', label:CUR_LIST[c].s+'  '+CUR_LIST[c].n, onClick:()=>{
        inputModal({title:'Скільки зараз на ньому, '+CUR_LIST[c].s+'? (можна 0)', value:'0', placeholder:'0', onOk:v=>{
          const a=Math.round(parseFloat(String(v||'0').replace(',','.'))*100)/100;
          const l=wlCurList(); if(!l.includes(c)) l.push(c); wlCurSave(l);
          if(a>0){ finOps.push({id:'start_cur_'+Date.now().toString(36), type:'in', amount:a, cur:c, label:'Стартовий залишок', date:ymdLocal(), card:WALLET_ID, _tr:true}); saveFinOps(); }
          renderFinance(); plToast(CUR_LIST[c].s+' баланс додано'); }}); }}))});
  }
  function wlCurSheet(c){
    const ops=(finOps||[]).filter(o=>o&&o.cur===c).slice(-30).reverse(), ym=wlYm();
    const mo=ops.filter(o=>String(o.date||'').slice(0,7)===ym), inc=mo.filter(_isIncAny).reduce((s,o)=>s+(+o.amount||0),0), out=mo.filter(_isExpAny).reduce((s,o)=>s+(+o.amount||0),0);
    const r=finLastRate(c);
    jnOverlay(`<div class="jn-ed-h"><b>${esc(curSym(c))} ${esc((CUR_LIST[c]||{}).n||c)}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <div class="wl-cbig"><b>${esc(money(curBalance(c),c))}</b><small>≈ ${esc(money(curBalance(c)*(r||0)))} · курс 1 ${esc(curSym(c))} = ${esc(String(r||'—'))} ${esc(curSym())}</small></div>
      <small class="dy-fm-sub">${esc(MO_NAMES[+ym.slice(5,7)-1])}: дохід ${esc(money(inc,c))} · витрати ${esc(money(out,c))}</small>
      <div class="wl-acts"><button class="pri" data-wlcop="out">− Витрата</button><button data-wlcop="in">＋ Дохід</button><button data-wlcx>⇄ Обмін</button></div>
      <div class="wl-ops">${ops.length?ops.map(wlOpRow).join(''):'<div class="dy-empty"><span>Записів ще нема.</span></div>'}</div>
      ${ops.length?'':`<button class="mo-set" data-wlcdel>Прибрати цей баланс</button>`}`, ov=>{
      ov.querySelectorAll('[data-wlcop]').forEach(b=>b.onclick=()=>{ ov.remove(); wlOpSheet(b.dataset.wlcop,'',{cur:c}); });
      ov.querySelector('[data-wlcx]').onclick=()=>{ ov.remove(); wlExchange(c); };
      ov.querySelectorAll('[data-wlop]').forEach(b=>b.onclick=()=>{ ov.remove(); wlOpMenu(b.dataset.wlop); });
      const d=ov.querySelector('[data-wlcdel]'); if(d) d.onclick=()=>{ wlCurSave(wlCurList().filter(x=>x!==c)); ov.remove(); renderFinance(); };
    });
  }
  // обмін: віддаю A → отримую B; курс підставляється з finLastRate, суму «отримую» можна виправити
  function wlExchange(from){
    const m=mainCur(), all=[m].concat(wlCurList()); if(all.length<2){ plToast('Спершу додай баланс в іншій валюті'); return; }
    let a=all.includes(from)?from:all[1], b=a===m?all[1]:m;
    const rateM=c=>c===m?1:(finLastRate(c)||0), bal=c=>c===m?walletBalance():curBalance(c);
    const chips=(id,sel)=>all.map(c=>`<button data-x${id}="${c}"${c===sel?' class="on"':''}>${esc(curSym(c))}</button>`).join('');
    jnOverlay(`<div class="jn-ed-h"><b>⇄ Обмін</b><button data-jnx aria-label="Закрити">✕</button></div>
      <div class="jn-f"><span>Віддаю з балансу</span><div class="wl-chips" id="xA">${chips('a',a)}</div></div>
      <label class="jn-f"><span id="xAl"></span><input id="xAmt" type="number" inputmode="decimal" min="0" step="1" placeholder="Напр. 200"></label>
      <div class="jn-f"><span>Отримую на баланс</span><div class="wl-chips" id="xB">${chips('b',b)}</div></div>
      <label class="jn-f"><span id="xBl"></span><input id="xGet" type="number" inputmode="decimal" min="0" step="0.01" placeholder="за курсом"></label>
      <small class="mo-note" id="xNote"></small>
      <div class="jn-ed-foot"><button class="jn-btn" data-xok>Обміняти</button></div>`, ov=>{
      let edited=false;
      const rate=()=>{ const ra=rateM(a), rb=rateM(b); return ra>0&&rb>0?ra/rb:0; };
      const upd=()=>{ ov.querySelector('#xAl').textContent='Сума, '+curSym(a)+' · є '+money(bal(a),a);
        ov.querySelector('#xBl').textContent='Отримаю, '+curSym(b);
        const v=parseFloat(String(ov.querySelector('#xAmt').value||'').replace(',','.'))||0;
        if(!edited){ const g=ov.querySelector('#xGet'); g.value=v>0&&rate()>0?String(Math.round(v*rate()*100)/100):''; }
        const r=rate(); ov.querySelector('#xNote').textContent=r>0?'курс 1 '+curSym(a)+' = '+(Math.round(r*10000)/10000)+' '+curSym(b)+' — можна виправити суму «отримаю» на справжню з банку':'курсу ще нема — впиши, скільки отримаєш';
        ov.querySelectorAll('[data-xa]').forEach(x=>x.classList.toggle('on',x.dataset.xa===a)); ov.querySelectorAll('[data-xb]').forEach(x=>x.classList.toggle('on',x.dataset.xb===b)); };
      ov.querySelectorAll('[data-xa]').forEach(x=>x.onclick=()=>{ a=x.dataset.xa; if(a===b) b=all.find(c=>c!==a); edited=false; upd(); });
      ov.querySelectorAll('[data-xb]').forEach(x=>x.onclick=()=>{ b=x.dataset.xb; if(a===b) a=all.find(c=>c!==b); edited=false; upd(); });
      ov.querySelector('#xAmt').oninput=upd; ov.querySelector('#xGet').oninput=()=>{ edited=true; };
      upd();
      ov.querySelector('[data-xok]').onclick=()=>{
        const give=Math.round(parseFloat(String(ov.querySelector('#xAmt').value||'').replace(',','.'))*100)/100;
        const get=Math.round(parseFloat(String(ov.querySelector('#xGet').value||'').replace(',','.'))*100)/100;
        if(!(give>0)||!(get>0)){ plToast('Вкажи обидві суми'); return; }
        if(give>bal(a)+1e-9){ plToast('На балансі '+curSym(a)+' лише '+money(bal(a),a)); return; }
        const xid='x'+Date.now().toString(36)+Math.random().toString(36).slice(2,5), d=ymdLocal();
        const o1={id:xid+'a', type:'out', amount:give, label:'Обмін → '+curSym(b), date:d, card:WALLET_ID, _tr:true, _xid:xid};
        const o2={id:xid+'b', type:'in', amount:get, label:'Обмін ← '+curSym(a), date:d, card:WALLET_ID, _tr:true, _xid:xid};
        if(a!==m) o1.cur=a; if(b!==m) o2.cur=b;
        finOps.push(o1,o2); saveFinOps();
        // справжній курс із банку — підказка для наступного разу
        if(a===m) finRememberRate(b, Math.round(give/get*10000)/10000); else if(b===m) finRememberRate(a, Math.round(get/give*10000)/10000);
        ov.remove(); renderFinance(); plToast('⇄ '+money(give,a)+' → '+money(get,b));
      };
    });
  }

  /* ════ Конверти витрат: стартовий набір (10.10.2026) ════
     Як у YNAB / Goodbudget / Monefy: готові категорії групами, людина відмічає потрібні й задає ліміт на місяць
     (goal конверта), решту — «＋ Свій конверт». Модель конверта та сама: поповнюєш із вільних (чи правилом
     «Зарплата по конвертах»), витрата з конверта (шторка «− Витрата» → іконка) не списує баланс удруге.
     Створює лише тап людини; наявні конверти з такою ж назвою не дублюються. */
  const WL_ENV_TPL=[
    {g:'Щодня',    items:[['food','🛒','Продукти',1],['cafe','☕','Кафе',1],['trans','🚇','Транспорт',1],['home','🧴','Побут',0]]},
    {g:'Рахунки',  items:[['rent','🏠','Житло',1],['util','💡','Комуналка',1],['net','📱','Звʼязок та інтернет',0]]},
    {g:'Для себе', items:[['fun','🎬','Розваги',0],['clothes','👕','Одяг',0],['health','💊','Здоровʼя',0],['gift','🎁','Подарунки',0]]},
    {g:'Запас',    items:[['cushion','🛟','Подушка',0]]},
  ];
  const WL_ENV_COLORS=['#34c77b','#ff9f43','#5b8def','#4ecdc4','#c48cff','#f0b429','#7f8cff','#ff6b9d','#e8843c','#ff4d6d','#3ec7b4','#8b93a3'];
  // конверти, з яких можна платити: без скарбничок призів
  function wlSpendEnvs(){ return (envelopes||[]).filter(e=>e&&e.id&&e.kind!=='приз'); }
  // іконки конвертів для шторки витрати — лише валюти c
  function wlEnvPick(c){ return wlSpendEnvs().filter(e=>(envCur(e)||mainCur())===c).map(e=>`<button data-wlenvp="${esc(e.id)}" style="--c:${safeColor(e.color,'#5b8def')}"><span>${safeEmoji(e.emoji,'✉️')}</span><small>${esc(String(e.name||'').slice(0,12))}</small><i>${esc(moneyK(envSaved(e),envCur(e)))}</i></button>`).join(''); }
  function wlEnvStarter(done){   // done(n) — для майстра «Новий старт» (52-fresh-start.js): що робити після створення
    // конверти ще не прочитано (хмара не відповіла / вхід звіряється) — інакше після злиття вийдуть дублі за назвою
    if(window.storeKeyReady&&!window.storeKeyReady(ENVKEY)){ plToast('Конверти ще завантажуються — спробуй за хвилину'); return; }
    const curs=[mainCur()].concat(wlCurList()); let ecur=mainCur();   // валюта нових конвертів (етап 3 валют)
    let have=new Set();
    const haveFor=c=>new Set((envelopes||[]).filter(e=>e&&(envCur(e)||mainCur())===c).map(e=>String(e.name||'').trim().toLowerCase()));
    have=haveFor(ecur);
    const sel={}; WL_ENV_TPL.forEach(gr=>gr.items.forEach(([k,,n,on])=>{ if(on&&!have.has(n.toLowerCase())) sel[k]=true; }));
    jnOverlay(`<div class="jn-ed-h"><b>🗂 Конверти витрат</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Відміть, на що зазвичай ідуть гроші. Ліміт на місяць — необовʼязково. Потім можна перейменувати, видалити чи додати свої.</small>
      ${curs.length>1?`<div class="jn-f"><span>Валюта конвертів</span><div class="wl-chips" id="tplCur">${curs.map(c=>`<button data-tplc="${c}"${c===ecur?' class="on"':''}>${esc(curSym(c))} ${esc((CUR_LIST[c]||{}).n||c)}</button>`).join('')}</div></div>`:''}
      ${WL_ENV_TPL.map(gr=>`<div class="wl-tpl-g">${esc(gr.g)}</div><div class="wl-tpl">${gr.items.map(([k,em,n])=>{ const ex=have.has(n.toLowerCase());
        return `<div class="wl-tpl-r${ex?' ex':''}" data-tplr="${k}"><button class="wl-tpl-t${sel[k]?' on':''}" data-tpl="${k}"${ex?' disabled':''} aria-pressed="${!!sel[k]}"><span>${em}</span><b>${esc(n)}</b>${ex?'<small>вже є</small>':''}</button>
          <input type="number" inputmode="numeric" min="0" step="100" data-tpll="${k}" placeholder="ліміт, ${esc(curSym())}" aria-label="Ліміт для ${esc(n)}"${sel[k]?'':' hidden'}></div>`; }).join('')}</div>`).join('')}
      <div class="jn-ed-foot wl-tpl-foot"><button class="jn-btn ghost" data-tplown>＋ Свій конверт</button><button class="jn-btn" data-tplok></button></div>`, ov=>{
      const cnt=()=>{ const n=Object.keys(sel).filter(k=>sel[k]).length; const b=ov.querySelector('[data-tplok]'); b.textContent=n?'Створити '+n+' '+pluralUk(n,'конверт','конверти','конвертів'):'Нічого не вибрано'; b.disabled=!n; };
      ov.querySelectorAll('[data-tpl]').forEach(b=>b.onclick=()=>{ const k=b.dataset.tpl; sel[k]=!sel[k]; b.classList.toggle('on',!!sel[k]); b.setAttribute('aria-pressed',String(!!sel[k]));
        const i=ov.querySelector('[data-tpll="'+k+'"]'); if(i) i.hidden=!sel[k]; cnt(); });
      cnt();
      ov.querySelectorAll('[data-tplc]').forEach(b=>b.onclick=()=>{ ecur=b.dataset.tplc; ov.querySelectorAll('[data-tplc]').forEach(x=>x.classList.toggle('on',x===b));
        have=haveFor(ecur);
        ov.querySelectorAll('[data-tplr]').forEach(r=>{ const k=r.dataset.tplr, it=WL_ENV_TPL.flatMap(g=>g.items).find(x=>x[0]===k), ex=have.has(String(it[2]).toLowerCase());
          r.classList.toggle('ex',ex); const t=r.querySelector('[data-tpl]'); t.disabled=ex; if(ex){ sel[k]=false; t.classList.remove('on'); }
          const i=r.querySelector('[data-tpll]'); if(i){ i.placeholder='ліміт, '+curSym(ecur); i.hidden=!sel[k]; } });
        cnt(); });
      ov.querySelector('[data-tplown]').onclick=()=>{ ov.remove(); try{ newEnvelope(); }catch(_){} };
      ov.querySelector('[data-tplok]').onclick=()=>{
        let n=0, ci=(envelopes||[]).length;
        WL_ENV_TPL.forEach(gr=>gr.items.forEach(([k,em,nm])=>{ if(!sel[k]||have.has(nm.toLowerCase())) return;
          const li=ov.querySelector('[data-tpll="'+k+'"]'), goal=Math.max(0,Math.round(parseFloat(String(li&&li.value||'').replace(',','.'))||0));
          const ne={id:'env_'+k+'_'+Date.now().toString(36)+n, name:nm, emoji:em, color:WL_ENV_COLORS[(ci++)%WL_ENV_COLORS.length], goal, saved:0, ops:[], kind:'витрати', link:'main', linkLabel:'головна папка'};
          if(ecur!==mainCur()) ne.cur=ecur;
          envelopes.push(ne);
          n++; }));
        if(!n) return;
        saveEnvelopes(); ov.remove(); renderFinance();
        if(typeof done==='function'){ done(n); return; }
        plToast('🗂 Створено '+n+' '+pluralUk(n,'конверт','конверти','конвертів')+' — поповни їх із вільних чи правилом «Зарплата по конвертах»');
      };
    });
  }

  /* «З чого почнемо?» / майстер «Новий старт» — у 52-fresh-start.js (wlStartHTML, wlStartBind) */
