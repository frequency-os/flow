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
  function wlMoney(n){ return '₴'+Math.round(+n||0).toLocaleString('uk-UA'); }
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
      <span class="wl-op-b"><b>${esc(o.label||(isIn?'Дохід':'Витрата'))}</b><small>${jnDateTxt(String(o.date||''))}${g?` · <i class="wl-tag">${esc(g.name||'Місія')}</i>`:(o.envId||o._tr?' · переказ':'')}</small></span>
      <b class="${isIn?'in':'out'}">${isIn?'+':'−'}${wlMoney(o.amount)}</b></button>`;
  }

  function wlRender(body){
    ensureCards();
    const bal=walletBalance(), pz=typeof pzTotal==='function'?pzTotal():0, ym=wlYm(), ops=wlMonthOps(ym), all=wlAgg(ops);
    const sub=document.getElementById('finSub'); if(sub) sub.textContent='гаманець героя · '+MO_NAMES[+ym.slice(5,7)-1].toLowerCase();
    let h=`<div class="wl-card"><small>Баланс</small><b>${wlMoney(bal+pz)}</b><span class="wl-sp"><span>вільно <b>${wlMoney(bal)}</b></span>${pz?`<span>🏆 на призи <b>${wlMoney(pz)}</b></span>`:''}</span></div>
      <div class="wl-acts"><button class="pri" data-wladd="out">− Витрата</button><button data-wladd="in">＋ Дохід</button><button data-wlpz>🏆 Відкласти</button></div>
      <div class="wl-seg"><button data-wltab="overview"${wlState.tab==='overview'?' class="on"':''}>Огляд</button><button data-wltab="missions"${wlState.tab==='missions'?' class="on"':''}>Гроші місій</button></div>`;
    h+=wlState.tab==='missions'?wlMissionsHTML(ops):wlOverviewHTML(ops,all,ym);
    body.innerHTML=h+'<div class="jn-pad"></div>';
    wlBind(body);
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
    const last=(finOps||[]).filter(o=>o&&o.id!=null&&String(o.id)!==''&&!String(o.id).startsWith('start_')).slice(-8).reverse();
    h+=`<div class="wl-sec"><span>Останні операції</span><button data-wlhist>історія ›</button></div>`;
    h+=last.length?`<div class="wl-ops">${last.map(wlOpRow).join('')}</div>`:`<div class="dy-empty"><span>Ще нема операцій. Почни з «Витрата» або «Дохід».</span></div>`;
    // конверти й борги — як і раніше
    const envTop=(envelopes||[]).slice(0,4);
    h+=`<div class="wl-sec"><span>Конверти й скарбнички</span><button data-wlenv>усі ›</button></div>`;
    h+=envTop.length?envTop.map(e=>{ const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
      return `<button class="wl-env" data-envopen="${esc(e.id)}" style="--c:${safeColor(e.color,'#5b8def')}"><i style="width:${pct}%"></i><span>${safeEmoji(e.emoji,'✉️')}</span><span><b>${esc(e.name)}</b><small>${e.goal?pct+'% · ще '+wlMoney(Math.max(0,e.goal-sv)):'без цілі'}</small></span><b>${wlMoney(sv)}</b></button>`; }).join('')
      :`<div class="dy-empty"><span>Конвертів ще нема.</span></div>`;
    let debts='—'; try{ debts=debtSummary(); }catch(_){}
    h+=`<button class="wl-env" data-wldebts><span>🤝</span><span><b>Борги</b><small>нетто</small></span><b>${esc(String(debts))}</b></button>`;
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
  function wlBind(c){
    c.querySelectorAll('[data-wladd]').forEach(b=>b.onclick=()=>wlOpSheet(b.dataset.wladd,''));
    { const p=c.querySelector('[data-wlpz]'); if(p) p.onclick=()=>{ if(typeof pzScreen==='function') pzScreen(); }; }
    c.querySelectorAll('[data-wltab]').forEach(b=>b.onclick=()=>{ wlState.tab=b.dataset.wltab; renderFinance(); });
    c.querySelectorAll('[data-wlgoals]').forEach(b=>b.onclick=()=>moMoneySheet(wlYm(),()=>renderFinance()));
    { const hs=c.querySelector('[data-wlhist]'); if(hs) hs.onclick=()=>{ try{ goSpend(); }catch(_){} }; }
    { const ev=c.querySelector('[data-wlenv]'); if(ev) ev.onclick=()=>{ finView='envelopes'; renderFinance(); }; }
    { const d=c.querySelector('[data-wldebts]'); if(d) d.onclick=()=>{ try{ goDebts(); }catch(_){} }; }
    c.querySelectorAll('[data-envopen]').forEach(el=>el.onclick=()=>openEnvSheet(el.dataset.envopen));
    c.querySelectorAll('[data-wlop]').forEach(b=>b.onclick=()=>wlOpMenu(b.dataset.wlop));
    c.querySelectorAll('[data-wlm]').forEach(b=>b.onclick=()=>wlMissionSheet(b.dataset.wlm));
  }

  // ── нова операція: сума, на що, до місії (необовʼязково) ──
  function wlOpSheet(type,preGid){
    const ms=wlMissions(), t=type==='in'?'Дохід':'Витрата'; let gid=preGid||'';
    const chips=()=>ms.map(g=>`<button data-wlg="${esc(g.id)}"${String(gid)===String(g.id)?' class="on"':''} style="--c:${safeColor(g.color,'#3ec7b4')}">${safeEmoji(g.emoji,'🎯')} ${esc(String(g.name||'').slice(0,18))}</button>`).join('')+`<button data-wlg=""${gid?'':' class="on"'}>без місії</button>`;
    const budTxt=()=>{ const g=wlGoal(gid); if(!g||type!=='out'||!(g.budget&&+g.budget.money>0)) return ''; const a=wlAgg(wlMonthOps(wlYm()),g.id); return 'Бюджет «'+esc(g.name||'')+'» на місяць: '+wlMoney(a.out)+' з '+wlMoney(g.budget.money); };
    jnOverlay(`<div class="jn-ed-h"><b>${type==='in'?'＋':'−'} ${t}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <label class="jn-f"><span>Сума, ₴</span><input id="wlAmt" type="number" inputmode="decimal" min="0" step="1" placeholder="Напр. 500"></label>
      <label class="jn-f"><span>На що</span><input id="wlLbl" maxlength="80" placeholder="${type==='in'?'Зарплата, оплата від клієнта…':'Їжа, таксі, підручник…'}"></label>
      ${ms.length?`<div class="jn-f"><span>До місії (необовʼязково)</span><div class="wl-chips" id="wlChips">${chips()}</div><small class="mo-note" id="wlBud">${budTxt()}</small></div>`:''}
      <div class="jn-ed-foot"><button class="jn-btn" data-wlok>Записати</button></div>`, ov=>{
      const bindChips=()=>ov.querySelectorAll('[data-wlg]').forEach(b=>b.onclick=()=>{ gid=b.dataset.wlg; ov.querySelector('#wlChips').innerHTML=chips(); const bt=ov.querySelector('#wlBud'); if(bt) bt.innerHTML=budTxt(); bindChips(); });
      bindChips();
      setTimeout(()=>{ try{ ov.querySelector('#wlAmt').focus(); }catch(_){} },80);
      ov.querySelector('[data-wlok]').onclick=()=>{
        const amount=Math.round(parseFloat(String(ov.querySelector('#wlAmt').value||'').replace(',','.'))*100)/100;
        if(!(amount>0)){ plToast('Вкажи суму'); return; }
        const label=String(ov.querySelector('#wlLbl').value||'').trim().slice(0,80)||t;
        const op={ id:Date.now()+'_'+Math.random().toString(36).slice(2,6), type, amount, label, date:ymdLocal(), card:mainCard().id };
        if(gid&&wlGoal(gid)) op.goalId=String(gid);
        finOps.push(op); saveFinOps(); ov.remove(); renderFinance();
        try{ flowReact(type==='in'?'income':'spend',{amount}); }catch(_){}
      };
    });
  }
  // ── тап по операції: привʼязати до місії / видалити ──
  function wlOpMenu(id){
    const o=(finOps||[]).find(x=>String(x.id)===String(id)); if(!o) return;
    const g=wlGoal(o.goalId), items=[];
    if(!o.envId&&!o._tr&&wlMissions().length) items.push({ic:'target', label:g?'Інша місія':'Привʼязати до місії', sub:g?'зараз: '+(g.name||''):'', onClick:()=>{
      const ms=wlMissions();
      actionSheet({title:'До якої місії?', sub:o.label||'', items:ms.map(m=>({ic:'target', label:(m.emoji?String(m.emoji)+' ':'')+(m.name||'Місія'), onClick:()=>{ const q=(finOps||[]).find(x=>String(x.id)===String(id)); if(q){ q.goalId=String(m.id); saveFinOps(); renderFinance(); } }}))
        .concat(g?[{ic:'refresh', label:'Без місії', onClick:()=>{ const q=(finOps||[]).find(x=>String(x.id)===String(id)); if(q){ delete q.goalId; saveFinOps(); renderFinance(); } }}]:[])});
    }});
    // рух конверта/скарбнички видаляється лише в самому конверті — інакше суми конверта й Гаманця розійдуться
    if(o.envId){ items.push({ic:'edit', label:'Відкрити конверт', sub:'рух видаляється там, щоб суми не розійшлись', onClick:()=>{ try{ openEnvSheet(o.envId); }catch(_){} }}); }
    else if(!o._tr) items.push({ic:'trash', label:'Видалити операцію', danger:true, onClick:()=>confirmSheet({title:'Видалити операцію?', sub:(o.label||'')+' · '+(o.type==='in'?'+':'−')+wlMoney(o.amount)+wlLinkedNote(o), onOk:()=>{
      const i=finOps.indexOf(o); if(i>=0){ finOps.splice(i,1); saveFinOps(); } renderFinance(); }})});   // саме цей обʼєкт, не всі з таким id
    actionSheet({title:o.label||(o.type==='in'?'Дохід':'Витрата'), sub:(o.type==='in'?'+':'−')+wlMoney(o.amount)+' · '+jnDateTxt(String(o.date||'')), items});
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
