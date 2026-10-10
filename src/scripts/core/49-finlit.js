  /* ════════ Фінансові звички і «Школа грошей» (49-finlit.js, 10.10.2026) ════════
     Додає в Книгу правил (47-rules.js, масив RL) групу «Фінансові звички». Як і решта правил — лише пропонують,
     записує людина; кожне вимикається. Усе в головній валюті.
       first  «Спершу собі»       — дохід → «Відкласти N% у Подушку?» (конверт «Подушка»; нема — створюється після «так»)
       h24    «Правило 24 годин»  — витрата ≥ N → «Почекати добу?» → нагадування в планері на завтра, витрату не пишемо
       cushion «Подушка безпеки»  — ціль: N місяців середніх витрат; видно прогрес і кнопку «Поставити ціль»
       review «Огляд місяця»      — перші 7 днів місяця: картка в Журналі з підсумком минулого місяця
     Плюс кнопка «50/30/20» у розподілі зарплати і 6 карток-уроків «Школа грошей». */

  RL.push(
    {id:'first',  grp:'Фінансові звички', em:'🐷', t:'Спершу собі',       flow:['дохід','{n}% у Подушку?'], on:true, n:10, unit:'%', min:1, max:50},
    {id:'h24',    grp:'Фінансові звички', em:'⏳', t:'Правило 24 годин',  flow:['витрата ≥ {n}','почекати добу?'], on:false, n:5000, unit:'cur', min:100, max:10000000},
    {id:'cushion',grp:'Фінансові звички', em:'🛟', t:'Подушка безпеки',   flow:['{n} міс. витрат','ціль Подушки'], on:true, n:3, unit:'міс.', min:1, max:12},
    {id:'review', grp:'Фінансові звички', em:'📊', t:'Огляд місяця',      flow:['початок місяця','підсумок і норма 20%'], on:true}
  );

  // ── спільне ──
  function flCushionEnv(){ return (envelopes||[]).find(e=>e&&!envCur(e)&&e.kind!=='приз'&&/подушк/i.test(String(e.name||'')))||null; }
  function flMonthAgg(ym){ return wlAgg(wlMonthOps(ym)); }
  function flPrevYm(ym){ const y=+ym.slice(0,4), m=+ym.slice(5,7); return m===1?(y-1)+'-12':y+'-'+String(m-1).padStart(2,'0'); }
  // відкладено за місяць: поповнення конвертів і скарбничок головної валюти (рух «У конверт» = out з envId без envSpend)
  function flSavedIn(ym){ return (finOps||[]).filter(o=>o&&opMain(o)&&o.type==='out'&&o.envId&&!o.envSpend&&String(o.date||'').slice(0,7)===ym).reduce((s,o)=>s+(+o.amount||0),0)
    -(finOps||[]).filter(o=>o&&opMain(o)&&o.type==='in'&&o._tr&&(o.envBack||o.envId)&&String(o.date||'').slice(0,7)===ym).reduce((s,o)=>s+(+o.amount||0),0); }
  // середні витрати за 3 повні минулі місяці (є дані — рахуємо лише їх)
  function flAvgSpend(){ let ym=wlYm(), s=0, n=0; for(let i=0;i<3;i++){ ym=flPrevYm(ym); const a=flMonthAgg(ym); if(a.out>0){ s+=a.out; n++; } } return n?Math.round(s/n):0; }

  // ── «Спершу собі»: після доходу (47-rules.js rlOnOp кличе, якщо не спрацювали зарплата й скарбничка) ──
  function flOnIncome(op){
    if(!op||!opMain(op)||op.type!=='in'||op._tr||!rlOn('first')) return false;
    if(window.storeKeyReady&&!(window.storeKeyReady('fin_ops')&&window.storeKeyReady(ENVKEY))) return false;   // конверти ще не прочитано — не створюємо «Подушку» поверх справжніх
    if(+op.amount<1000) return false;   // дрібні надходження не чіпаємо
    const pct=Math.max(1,Math.min(50,+rlN('first')||10)), amt=Math.round(+op.amount*pct/100);
    let free=0; try{ free=walletBalance(); }catch(_){}
    if(!(amt>0)||amt>free) return false;
    const e=flCushionEnv();
    setTimeout(()=>rlOffer('🐷','Спершу собі', (op.label||'Дохід')+' +'+money(op.amount)+'. Відкласти '+pct+'% ('+money(amt)+') у '+(e?'«'+e.name+'»':'нову «Подушку»')+'? Спершу собі — потім витрати.',
      'Відкласти '+money(amt),'Не зараз',()=>{
        if(window.storeKeyReady&&!(window.storeKeyReady('fin_ops')&&window.storeKeyReady(ENVKEY))){ plToast('Гаманець ще звіряється з хмарою — спробуй за хвилину'); return; }
        let f2=0; try{ f2=walletBalance(); }catch(_){} if(amt>f2){ plToast('Вільно лише '+money(f2)); return; }
        let env=flCushionEnv();
        if(!env){ env={id:'env_cushion_'+Date.now().toString(36), name:'Подушка', emoji:'🛟', color:'#3ec7b4', goal:0, saved:0, ops:[], kind:'витрати', link:'main', linkLabel:'головна папка'}; envelopes.push(env); }
        envAddOp(env,'in',amt,'Спершу собі'); rlMark('first',true,amt); saveGoals(); try{ renderFinance(); }catch(_){}
        plToast('🐷 '+money(amt)+' у «'+env.name+'»'); },
      ()=>{ rlMark('first',false); saveGoals(); }),300);
    return true;
  }

  // ── «Правило 24 годин»: перед записом великої витрати (46-wallet.js wlOpSheet). true — запис зупинено, чекаємо рішення ──
  function flH24(amount,label,proceed,defer){
    if(!rlOn('h24')) return false;
    const lim=Math.max(100,+rlN('h24')||5000); if(!(+amount>=lim)) return false;
    actionSheet({title:'⏳ Велика покупка · '+money(amount), sub:'Правило 24 годин: почекай добу — якщо завтра все ще потрібно, купуй спокійно. Якщо вже купив — тисни «Записати зараз».',
      items:[
        {ic:'calendar', label:'Подумати до завтра', sub:'нагадування в планері, витрату не записую', onClick:()=>{
          const ds=dyAddDays(ymdLocal(),1); let h=null; try{ h=dyFreeSlot(ds,0.25); }catch(_){}
          if(h===null) h=12;
          try{ plBlocksFor(ds).push({id:dyNewId(), h, endH:h+0.25, t:'🤔 Купити «'+String(label||'покупку').slice(0,40)+'» за '+money(amount)+'?', c:'val', link:null, tag:'', folder:'', done:false}); saveGoals(); }catch(_){}
          rlMark('h24',true,amount); saveGoals();
          if(defer) try{ defer(); }catch(_){}
          plToast('⏳ Нагадаю завтра о '+(typeof plHM==='function'?plHM(h):h+':00')); }},
        {ic:'plus', label:'Записати зараз', sub:'покупка обдумана', onClick:()=>{ rlMark('h24',false); saveGoals(); proceed(); }}
      ]});
    return true;
  }

  // ── «Огляд місяця»: картка в Журналі перші 7 днів місяця (закривається на цей місяць — лише цей пристрій) ──
  function flReviewHTML(){
    if(!rlOn('review')) return '';
    const td=ymdLocal(); if(+td.slice(8,10)>7) return '';
    const pym=flPrevYm(td.slice(0,7)); let seen=false; try{ seen=localStorage.getItem('flow_fl_review')===pym; }catch(_){} if(seen) return '';
    const a=flMonthAgg(pym); if(!(a.inc>0||a.out>0)) return '';
    const sv=Math.max(0,flSavedIn(pym)), rate=a.inc>0?Math.round(sv/a.inc*100):0, good=rate>=20;
    const mn=MO_NAMES[+pym.slice(5,7)-1];
    return `<div class="fl-rev${good?' good':''}"><div class="fl-rev-h"><span>📊</span><b>${esc(mn)}: підсумок</b><button data-flrevx aria-label="Закрити">✕</button></div>
      <div class="fl-rev-k"><span><small>заробив</small><b>${esc(money(a.inc))}</b></span><span><small>витратив</small><b>${esc(money(a.out))}</b></span><span><small>відклав</small><b>${esc(money(sv))}</b></span></div>
      <div class="fl-rev-bar"><i style="width:${Math.min(100,rate)}%"></i><u style="left:20%"></u></div>
      <p>${good?'Відклав '+rate+'% доходу — це норма фінансово здорової людини (20%+). Так тримати!':'Відкладено '+rate+'% доходу. Орієнтир — 20%: спробуй «Спершу собі» в Книзі правил.'}</p></div>`;
  }
  function flReviewBind(c){
    c.querySelectorAll('[data-flrevx]').forEach(b=>b.onclick=()=>{ try{ localStorage.setItem('flow_fl_review', flPrevYm(ymdLocal().slice(0,7))); }catch(_){} rlMark('review',true); saveGoals(); try{ jnRender(); }catch(_){} });
  }

  // ── 50/30/20: розкласти відсотки по конвертах за типом (потреби / бажання / заощадження) ──
  const FL_NEEDS=/продукт|житл|оренд|комунал|звʼязок|зв'язок|інтернет|транспорт|побут|здоров|ліки|кредит/i;
  const FL_SAVE=/подушк|заощадж|резерв|інвест|запас|відпуст|мрі/i;
  function fl503020(envs){
    const g={n:[],w:[],s:[]};
    envs.forEach(e=>{ const nm=String(e.name||''), k=String(e.id||'');
      if(e.kind==='приз'||FL_SAVE.test(nm)||/^env_cushion/.test(k)) g.s.push(e); else if(FL_NEEDS.test(nm)||/^env_(food|trans|home|rent|util|net|health)_/.test(k)) g.n.push(e); else g.w.push(e); });
    const out={}; const put=(arr,share)=>{ if(!arr.length) return; const each=Math.floor(share/arr.length); arr.forEach((e,i)=>{ out[e.id]=each+(i<share-each*arr.length?1:0); }); };
    put(g.n,50); put(g.w,30); put(g.s,20);
    return out;
  }
  // кнопку додає 47-rules.js у шторки розподілу; тут — заповнення полів
  function flApply503020(ov,envs){
    const m=fl503020(envs); ov.querySelectorAll('[data-rlpct]').forEach(i=>{ i.value=m[i.dataset.rlpct]?String(m[i.dataset.rlpct]):''; i.dispatchEvent(new Event('input')); });
    plToast('50% потреби · 30% бажання · 20% заощадження');
  }

  // ── «Подушка безпеки» і «Школа грошей» — у Книзі правил ──
  const FL_LESSONS=[
    {id:'l503020', em:'🥧', t:'50/30/20', rule:'salary', p:'Половина доходу — на потреби (житло, їжа, транспорт), 30% — на бажання, 20% — на заощадження. Простий каркас, з якого легко почати. У розподілі зарплати є кнопка «50/30/20».'},
    {id:'lfirst',  em:'🐷', t:'Спершу собі', rule:'first', p:'Відкладай одразу, коли прийшли гроші, а не те, що лишилось у кінці місяця — бо лишається зазвичай нуль. Навіть 10% щомісяця за рік дають більше місячного доходу.'},
    {id:'lcushion',em:'🛟', t:'Подушка безпеки', rule:'cushion', p:'3–6 місяців звичайних витрат на окремому рахунку — і втрата роботи чи хвороба вже не катастрофа. Спершу подушка, потім інвестиції.'},
    {id:'lh24',    em:'⏳', t:'Правило 24 годин', rule:'h24', p:'Велику незаплановану покупку відклади на добу. Якщо завтра вона все ще потрібна — купуй спокійно. Більшість імпульсних бажань до ранку зникає.'},
    {id:'lenv',    em:'✉️', t:'Конверти', rule:'salary', p:'Розклади гроші по конвертах одразу після зарплати: Продукти, Житло, Кафе… Коли конверт порожній — категорія на цей місяць закрита. Видно, куди йдуть гроші, ще до того, як вони пішли.'},
    {id:'ldebt',   em:'🧊', t:'Борги: лавина і сніжка', rule:'', p:'Лавина — гасиш спершу борг з найбільшим відсотком (вигідніше). Сніжка — спершу найменший (швидша перемога, більше мотивації). Обидва працюють, якщо платити більше мінімуму.'},
  ];
  function flCushionHTML(){
    if(!rlOn('cushion')) return '';
    const avg=flAvgSpend(), n=Math.max(1,+rlN('cushion')||3), target=Math.round(avg*n/100)*100, e=flCushionEnv(), sv=e?envSaved(e):0, pct=target?Math.min(100,Math.round(sv/target*100)):0;
    return `<div class="fl-cush"><div class="fl-cush-h"><span>🛟</span><b>Подушка безпеки</b><small>${n} ${pluralUk(n,'місяць','місяці','місяців')} витрат</small></div>
      ${avg?`<div class="fl-cush-n"><b>${esc(money(sv))}</b><small>з ${esc(money(target))} · середні витрати ${esc(money(avg))}/міс</small></div><div class="fl-rev-bar"><i style="width:${pct}%"></i></div>`
        :`<small class="fl-cush-e">Ще мало даних про витрати — ціль зʼявиться після першого повного місяця.</small>`}
      ${avg&&(!e||+e.goal!==target)?`<button class="mo-set" data-flcush>${e?'Поставити ціль «'+esc(e.name)+'» — '+esc(money(target)):'Створити конверт «Подушка» з ціллю '+esc(money(target))}</button>`:''}</div>`;
  }
  function flSchoolHTML(){
    return `<div class="mo-h" style="margin-top:14px"><span>Школа грошей</span></div>${flCushionHTML()}
      <div class="fl-school">${FL_LESSONS.map(l=>`<details class="fl-l"><summary><span>${l.em}</span><b>${esc(l.t)}</b><i>›</i></summary><p>${esc(l.p)}</p>
        ${l.rule&&rlDef(l.rule)?(rlOn(l.rule)?`<small class="fl-on">✓ правило «${esc(rlDef(l.rule).t)}» увімкнене</small>`:`<button class="mo-set" data-flon="${l.rule}">Увімкнути «${esc(rlDef(l.rule).t)}»</button>`):''}</details>`).join('')}</div>`;
  }
  function flSchoolBind(ov,redraw){
    ov.querySelectorAll('[data-flon]').forEach(b=>b.onclick=()=>{ const id=b.dataset.flon, hh=jnHero(); if(!hh.rules||typeof hh.rules!=='object'||Array.isArray(hh.rules)) hh.rules={};
      hh.rules[id]=Object.assign({},hh.rules[id]||{},{on:true}); saveGoals(); redraw(); });
    { const c=ov.querySelector('[data-flcush]'); if(c) c.onclick=()=>{
      if(window.storeKeyReady&&!window.storeKeyReady(ENVKEY)){ plToast('Конверти ще завантажуються'); return; }
      const target=Math.round(flAvgSpend()*Math.max(1,+rlN('cushion')||3)/100)*100; if(!(target>0)) return;   // кругла ціль
      let e=flCushionEnv();
      if(!e){ e={id:'env_cushion_'+Date.now().toString(36), name:'Подушка', emoji:'🛟', color:'#3ec7b4', goal:target, saved:0, ops:[], kind:'витрати', link:'main', linkLabel:'головна папка'}; envelopes.push(e); }
      else e.goal=target;
      saveEnvelopes(); plToast('🛟 Ціль Подушки — '+money(target)); redraw(); }; }
  }
