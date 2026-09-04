  /* ============ FINANCE HUB (фінансовий центр) ============ */
  let envelopes=[]; // конверти накопичень
  const ENVKEY='envelopes';
  function saveEnvelopes(){ try{ const p=window.storage.set(ENVKEY,JSON.stringify(envelopes),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }

  /* ===== envelope ops model (накопичено = сума рухів) ===== */
  // Кожен конверт має ops:[{id,t:'in'|'out',label,amount,date,finOpId?}].
  // 'in'  = поповнення: гроші резервуються → у finOps йде 'out' (списання з балансу).
  // 'out' = витрата на ціль: гроші виходять з конверта → у finOps йде 'out' (розхід).
  function envMigrate(e){
    if(!Array.isArray(e.ops)){
      e.ops=[];
      const s=+e.saved||0;
      if(s>0) e.ops.push({ id:'eop_'+Date.now()+Math.random().toString(36).slice(2,5), t:'in', label:'Старт', amount:s, date:ymdLocal() });
    }
    return e;
  }
  function envSaved(e){ envMigrate(e); const v=e.ops.reduce((s,o)=>s+(o.t==='in'?o.amount:-o.amount),0); e.saved=v; return v; }
  function envSpentOut(e){ envMigrate(e); return e.ops.filter(o=>o.t==='out').reduce((s,o)=>s+o.amount,0); }
  function envTotalSaved(){ return envelopes.reduce((s,e)=>s+envSaved(e),0); }

  // додати рух у конверт + віддзеркалити у finOps (вплив на Дохід/Розхід/Баланс)
  function envAddOp(e, t, amount, label, cardId){
    envMigrate(e);
    const date=ymdLocal();
    const finId='fin_'+Date.now()+Math.random().toString(36).slice(2,6);
    const eop={ id:'eop_'+Date.now()+Math.random().toString(36).slice(2,5), t, label:label||(t==='in'?'Поповнення':'Витрата'), amount, date, finOpId:finId };
    e.ops.unshift(eop);
    e.saved = e.ops.reduce((s,o)=>s+(o.t==='in'?o.amount:-o.amount),0);
    // 'in' = резерв: списується з картки/балансу. 'out' = витрата ЗІ збереженого:
    // позначаємо envSpend, щоб не списувати баланс удруге (гроші вже пішли при поповненні).
    const finLabel = t==='in' ? ('У конверт: '+e.name) : (e.name+' · '+(label||'витрата'));
    const fo={ id:finId, type:'out', amount, label:finLabel, date, env:e.name, envId:e.id };
    if(t==='in'){ try{ fo.card = cardId || e.cardId || (cards.length?mainCard().id:undefined); }catch(_){} }
    else { fo.envSpend=true; }
    finOps.push(fo);
    saveEnvelopes(); saveFinOps();
    try{ flowReact(t==='in'?'save':'spend',{amount:amount}); }catch(_){}
  }
  function envDelOp(e, opId){
    envMigrate(e);
    const op=e.ops.find(o=>o.id===opId); if(!op) return;
    if(op.finOpId) finOps=finOps.filter(f=>f.id!==op.finOpId);
    e.ops=e.ops.filter(o=>o.id!==opId);
    e.saved = e.ops.reduce((s,o)=>s+(o.t==='in'?o.amount:-o.amount),0);
    saveEnvelopes(); saveFinOps();
  }
  function envSummary(){ return envelopes.length ? fmt(envTotalSaved())+' ₴' : '—'; }

  // tracker: income/expense operations
  let finOps=[]; // {id,type:'in'|'out',amount,label,date}
  const FINOPKEY='fin_ops';
  function saveFinOps(){ try{ const p=window.storage.set(FINOPKEY,JSON.stringify(finOps),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  // місток для глобального пошуку: всі операції
  window.flowSearchFin=function(){ try{ return finOps.map(o=>({id:o.id,type:o.type,amount:o.amount,label:o.label||'',date:o.date||''})); }catch(_){ return []; } };
  // recurring payments
  let recurring=[]; // {id,name,emoji,amount,period}
  const RECKEY='fin_recurring';
  function saveRecurring(){ try{ const p=window.storage.set(RECKEY,JSON.stringify(recurring),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  // challenges
// {id,name,emoji,goal,progress,unit}


  /* ============ ГАМАНЕЦЬ · єдиний рахунок ============
     Замість набору віртуальних карток — один гаманець у гривні.
     Імена функцій лишились ті самі: їх кличуть робота, борги,
     витрати й AI-агент. Тепер вони всі повертають один і той самий
     гаманець. */
  const WALLET_ID='wallet';
  let cards=[]; const CARDKEY='income_cards';
  function saveCards(){ try{ const p=window.storage.set(CARDKEY,JSON.stringify(cards),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function walletCard(){
    return { id:WALLET_ID, name:'Гаманець', emoji:'💳', type:'custom', cur:'UAH', color:'#5b8def', main:true };
  }
  function walletOps(){ return finOps.filter(o=>!o.envSpend); }
  function walletBalance(){ return walletOps().reduce((s,o)=>s+(o.type==='in'?o.amount:-o.amount),0); }
  // сумісність зі старим API карток
  function mainCard(){ ensureCards(); return cards[0]; }
  function cardById(){ ensureCards(); return cards[0]; }      // будь-який id → гаманець
  function cardSym(){ return '₴'; }
  function cardBalance(){ return walletBalance(); }
  function incomeSummary(){ try{ return fmt(walletBalance())+' ₴'; }catch(_){ return '—'; } }
  function _projCardId(){ return WALLET_ID; }
  function ensureCards(){
    if(!Array.isArray(cards) || !cards.length || cards.length>1 || cards[0].id!==WALLET_ID){
      cards=[walletCard()]; saveCards();
    }
    let ch=false;
    // витрати ІЗ конверта не мають вдруге списувати баланс
    try{
      envelopes.forEach(e=>{ (e.ops||[]).forEach(op=>{
        if(op.t==='out'&&op.finOpId){ const f=finOps.find(x=>String(x.id)===String(op.finOpId)); if(f&&!f.envSpend){ f.envSpend=true; ch=true; } }
      });});
    }catch(_){}
    // операції без рахунку → у гаманець
    finOps.forEach(o=>{ if(!o.card && !o.envSpend){ o.card=WALLET_ID; ch=true; } });
    if(ch) saveFinOps();
  }

  /* ============ Одноразова міграція: усі картки → гаманець ============
     Кожна операція переприв'язується до гаманця; суми в іноземній валюті
     переводяться в гривні за останнім збереженим курсом і фіксуються
     назавжди. Слід конвертації лишається в op._fx — щоб через рік було
     видно, звідки взялась цифра.

     Старі картки й курси читаються просто зі сховища, а не з живих
     змінних: на момент міграції картки вже замінено гаманцем, а блоку
     FX у програмі більше немає. Повторний запуск нешкідливий. */
  // src — або готовий рядок зі сховища (його передає завантажувач), або
  // ключ, який дочитуємо з localStorage. Перший шлях надійніший: на iOS
  // localStorage — лише кеш, який система має право вичистити.
  function migRaw(src, key){
    try{
      let raw = (typeof src==='string' && src) ? src : localStorage.getItem('flowapp_'+key);
      if(!raw) return null;
      let o=JSON.parse(raw);
      if(o && typeof o==='object' && !Array.isArray(o) && typeof o.d==='string') o=JSON.parse(o.d);
      return o;
    }catch(_){ return null; }
  }
  function migRates(src){
    const def={UAH:1,EUR:48.6,USD:41.6,PLN:11.4};
    const o=migRaw(src,'fx_cfg');
    return (o && o.rates) ? Object.assign({}, def, o.rates) : def;
  }
  function migCurByCard(src){
    const map={}; const old=migRaw(src,'income_cards');
    if(Array.isArray(old)) old.forEach(c=>{ if(c && c.id) map[String(c.id)]=c.cur||'UAH'; });
    return map;
  }
  // сума всієї книги у гривнях — рахується однаково до і після міграції,
  // тому годиться як доказ, що гроші не загубились
  function walletSumUAH(rates, curBy){
    const r=rates||migRates(), m=curBy||migCurByCard();
    let s=0;
    (finOps||[]).forEach(o=>{
      if(o.envSpend) return;
      const cur=m[String(o.card)]||'UAH';
      const v=(+o.amount||0)*(r[cur]||1);
      s += (o.type==='in' ? v : -v);
    });
    return Math.round(s*100)/100;
  }
  function migrateToWallet(rawCards, rawFx){
    const rep={ ops:0, converted:0, orphan:0, before:0, after:0, diff:0 };
    if(!Array.isArray(finOps)) return rep;
    const rates=migRates(rawFx), curBy=migCurByCard(rawCards);
    rep.before=walletSumUAH(rates, curBy);
    finOps.forEach(o=>{
      rep.ops++;
      const known=Object.prototype.hasOwnProperty.call(curBy, String(o.card));
      if(o.card && !known && o.card!==WALLET_ID) rep.orphan++;   // картки вже нема — лишаємо як гривні
      const cur=curBy[String(o.card)]||'UAH';
      if(cur!=='UAH'){
        const r=rates[cur]||1;
        o._fx={ cur, rate:r, was:+o.amount||0 };
        o.amount=Math.round((+o.amount||0)*r*100)/100;
        o.label=(o.label||'Операція')+' · '+fmt(o._fx.was)+' '+(CUR[cur]||cur)+' × '+r;
        rep.converted++;
      }
      o.card=WALLET_ID;
    });
    cards=[walletCard()];
    rep.after=walletSumUAH(rates, {});      // після міграції все у гривні
    rep.diff=Math.round((rep.after-rep.before)*100)/100;
    if(rep.ops){ saveFinOps(); saveCards(); }
    try{ window.__walletReport=rep; console.info('[гаманець] міграція:', rep); }catch(_){}
    return rep;
  }
  try{ window.migrateToWallet=migrateToWallet; window.walletSumUAH=walletSumUAH; window.walletBalance=walletBalance; }catch(_){}

  /* ==== FX: курси валют (НБУ → er-api → офлайн), автооновлення раз на добу ==== */

  /* ==== Clarity: регулярні платежі — день списання + автопостинг ==== */
  function recDayOf(r){ const d=parseInt(r.day,10); return (d>=1&&d<=31)?d:null; }
  function recAutoPost(){
    if(!recurring.length) return;
    const now=new Date(), ym=ymLocal(now);
    let ch=false;
    recurring.forEach(r=>{
      const d=recDayOf(r); if(!d||!(r.amount>0)) return;
      let cid; try{ ensureCards(); cid=(r.cardId&&cardById(r.cardId))?r.cardId:mainCard().id; }catch(_){}
      // місяці до постингу: все, що пропущено від lastYM до поточного (макс 12), без lastYM — лише поточний
      const due=[];
      if(r.lastYM && /^\d{4}-\d{2}$/.test(r.lastYM) && r.lastYM<ym){
        let y=Number(r.lastYM.slice(0,4)), m=Number(r.lastYM.slice(5,7));
        for(let i=0;i<12;i++){ m++; if(m>12){m=1;y++;} const cand=y+'-'+String(m).padStart(2,'0'); if(cand>ym) break; due.push(cand); }
      } else if(r.lastYM!==ym) due.push(ym);
      due.forEach(m2=>{
        if(m2===ym && now.getDate()<d) return;            // цього місяця день ще не настав
        const dim=new Date(Number(m2.slice(0,4)), Number(m2.slice(5,7)), 0).getDate();
        const date=m2+'-'+String(Math.min(d,dim)).padStart(2,'0'); // 31-ше у лютому → 28/29
        finOps.push({ id:'recop_'+Date.now()+'_'+Math.random().toString(36).slice(2,7), type:'out', amount:r.amount, label:'🔁 '+r.name, date, card:cid, _recId:r.id });
        r.lastYM=m2; ch=true;
      });
    });
    if(ch){ saveRecurring(); saveFinOps(); }
  }
  function nextRecurring(n){
    const now=new Date(), ym=ymLocal(now);
    return recurring.map(r=>{
      const d=recDayOf(r); if(!d) return null;
      let dt=new Date(now.getFullYear(),now.getMonth(),d);
      if(r.lastYM===ym || d<now.getDate()) dt=new Date(now.getFullYear(),now.getMonth()+1,d);
      return {r,dt};
    }).filter(Boolean).sort((a,b2)=>a.dt-b2.dt).slice(0,n||2);
  }
  function openNextSheet(){
    const ym=ymLocal();
    const its=recurring.map(r=>{ const d=recDayOf(r);
      return { ic:r.emoji||'🔁', label:r.name+' · '+fmt(r.amount)+' ₴',
        sub:d?('списується '+d+'-го числа'+(r.lastYM===ym?' · цього місяця ✓':'')):'тапни — встановити день автосписання',
        onClick:()=>{
          inputModal({title:'День списання «'+r.name+'» (1–31)', value:d?String(d):'', placeholder:'Напр. 15', onOk:(v)=>{
            const dd=parseInt((v||'').replace(/\D/g,''),10);
            if(dd>=1&&dd<=31){ r.day=dd; saveRecurring(); try{ recAutoPost(); }catch(_){} renderFinance(); }
          }});
        } };
    });
    actionSheet({ title:'Найближчі платежі', sub:'тап по платежу — змінити день автосписання',
      items: its.concat([{ ic:'＋', label:'Новий регулярний платіж', onClick:()=>newRecurring() }]) });
  }
  let workCardId=''; // куди приходить зарплата (обирається в меню картки)
  function workCard(){ return cardById(workCardId)||cards.find(c=>c.type==='work')||mainCard(); }

  /* ============ АНАЛІТИКА · ріст і спад ============ */
  function _isRealExpense(o){ return o.type==='out' && !o._tr && !(o.envId && !o.envSpend); }
  function _isRealIncome(o){ return o.type==='in' && !o._tr; }
  function lastMonths(n){ const a=[]; const now=new Date(); for(let i=n-1;i>=0;i--){ const x=new Date(now.getFullYear(),now.getMonth()-i,1); a.push(x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')); } return a; }
  function monthAgg(ym){ let inn=0,out=0; finOps.forEach(o=>{ if(String(o.date||'').slice(0,7)!==ym) return; if(_isRealIncome(o)) inn+=o.amount; else if(_isRealExpense(o)) out+=o.amount; }); return {in:inn,out}; }

  /* ============ МОЯ ФІНАНСОВА ГРАМОТНІСТЬ ============ */


  let finTab='overview'; // legacy (kept for compatibility)
  let finView='dash'; // 'dash' | 'envelopes'
  function finIncome(){ return finOps.filter(o=>o.type==='in').reduce((s,o)=>s+o.amount,0); }
  function finExpense(){ return finOps.filter(o=>o.type==='out').reduce((s,o)=>s+o.amount,0); }
  function finBalance(){ return finOps.reduce((s,o)=>s+(o.type==='in'?o.amount:(o.envSpend?0:-o.amount)),0); }

  function finEnvIcon(e){
    const s=((e&&(e.name||''))+' '+((e&&e.emoji)||'')).toLowerCase();
    if(/✈|🏖|🏝|відпус|подорож|трав|відпочин|італ|море|плям/.test(s)) return 'fi-plane';
    if(/🛡|подуш|безпек|резерв|емердж|надзвич|fund/.test(s)) return 'fi-shield';
    if(/🤝|борг|позик/.test(s)) return 'fi-handshake';
    if(/🏆|челен|ціль|goal/.test(s)) return 'fi-trophy';
    return 'fi-wallet';
  }
  function renderFinance(){
    const body=document.getElementById('financeBody'); if(!body) return;
    document.getElementById('finSub').textContent='гаманець і плани';
    if(finView==='envelopes'){ renderEnvScreen(body); return; }
    renderFinDash(body);
  }

  const MON_UA=['січень','лютий','березень','квітень','травень','червень',
                'липень','серпень','вересень','жовтень','листопад','грудень'];

  /* ============ Головний екран: гаманець і плани ============
     Один рахунок, дві кнопки, підсумок місяця, конверти, борги.
     Ніяких свайпів: усе, що є, видно згори вниз. */
  function renderFinDash(body){
    ensureCards();
    const bal=walletBalance();
    const ym=ymLocal(), m=monthAgg(ym);
    const mi=parseInt(ym.slice(5,7),10)-1;
    const saved=envTotalSaved();
    const goalSum=envelopes.reduce((s,e)=>s+(+e.goal||0),0);
    const ops=finOps.slice().reverse().slice(0,8);
    let debts='—'; try{ debts=debtSummary(); }catch(_){}
    const envTop=envelopes.slice(0,4);

    body.innerHTML=`
      <div class="wal-head">
        <div class="wal-lab">Гаманець</div>
        <div class="wal-bal">${fmt(bal)} <small>₴</small></div>
        <div class="wal-sub">${finOps.length} ${finOps.length===1?'операція':(finOps.length%10>=2&&finOps.length%10<=4&&(finOps.length%100<10||finOps.length%100>=20)?'операції':'операцій')} · один рахунок</div>
      </div>

      <div class="wal-acts">
        <button class="pri" data-finop="out"><i>−</i>Витрата</button>
        <button data-finop="in"><i>＋</i>Дохід</button>
      </div>

      <div class="fdash-sec"><span>${MON_UA[mi]}</span><span class="lnk" data-wal="spend">історія ›</span></div>
      <div class="wal-row"><span class="e">📥</span><div class="n">Дохід</div><b class="in">+${fmt(m.in)} ₴</b></div>
      <div class="wal-row"><span class="e">📤</span><div class="n">Витрати</div><b class="out">−${fmt(m.out)} ₴</b></div>

      <div class="fdash-sec"><span>Плани · ${fmt(saved)} ₴${goalSum?' / '+fmt(goalSum):''}</span><span class="lnk" data-wal="env">усі ›</span></div>
      ${envTop.length ? envTop.map(e=>{
        const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
        return `<div class="wal-env" data-envopen="${e.id}" style="--ec:${e.color||'#5b8def'}">
          <i class="fill" style="width:${pct}%"></i>
          <span class="e">${e.emoji||'✉️'}</span>
          <div class="n">${esc(e.name)}<s>${e.goal?pct+'% · ще '+fmt(Math.max(0,e.goal-sv))+' ₴':'без цілі'}</s></div>
          <b>${fmt(sv)}</b></div>`;
      }).join('') : `<div class="fh-empty">Планів ще немає. Конверт — це ціль із числом і датою.</div>`}
      <button class="newbtn" data-wal="newenv">+ Новий конверт</button>

      <div class="fdash-sec"><span>Борги</span><span class="lnk" data-wal="debts">усі ›</span></div>
      <div class="wal-row" data-wal="debts"><span class="e">🤝</span><div class="n">Нетто за боргами</div><b>${debts}</b></div>

      <div class="fdash-sec"><span>Останні операції</span></div>
      ${ops.length ? ops.map(o=>`<div class="fin-op" data-finopdel="${o.id}">
        <span><svg class="fin-ico" style="color:${o.type==='in'?'var(--hab)':'var(--fin)'}"><use href="#${o.type==='in'?'fi-up':'fi-down'}"/></svg> ${esc(o.label||'Операція')}${o.env?' ✉️':''}</span>
        <b style="color:${o.type==='in'?'var(--hab)':'var(--fin)'}">${o.type==='in'?'+':'−'}${fmt(o.amount)}</b></div>`).join('')
        : `<div class="fh-empty">Ще немає операцій. Почни з кнопки «Витрата».</div>`}`;

    bindFinDash(body);
  }

  function bindFinDash(body){
    body.querySelectorAll('[data-finop]').forEach(b=>b.onclick=()=>addFinOp(b.dataset.finop));
    body.querySelectorAll('[data-envopen]').forEach(el=>el.onclick=()=>openEnvSheet(el.dataset.envopen));
    body.querySelectorAll('[data-wal]').forEach(b=>b.onclick=()=>{
      const a=b.dataset.wal;
      if(a==='env'){ finView='envelopes'; renderFinance(); }
      else if(a==='newenv') newEnvelope();
      else if(a==='debts') goDebts();
      else if(a==='spend') goSpend();
    });
    body.querySelectorAll('[data-finopdel]').forEach(el=>el.onclick=()=>{
      confirmSheet({title:'Видалити операцію?', onOk:()=>{
        finOps=finOps.filter(o=>String(o.id)!==String(el.dataset.finopdel));
        saveFinOps(); renderFinance();
      }});
    });
  }










  // ===== Envelopes sub-screen (grid + recurring + challenges entry) =====
  function renderEnvScreen(body){
    const tot=envTotalSaved();
    const goalSum=envelopes.reduce((s,e)=>s+(+e.goal||0),0);
    body.innerHTML=`
      <button class="back" id="envScreenBack" style="--c:var(--skl);margin-bottom:14px">‹ Фінанси</button>
      <div class="env2-tot"><div><div class="l">Накопичено у конвертах</div></div>
        <div class="v">${fmt(tot)} <small>/ ${fmt(goalSum)} ₴</small></div></div>
      <div class="env2-grid">
      ${envelopes.map(e=>{
        const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
        const col=e.color||'#5b8def';
        const outs=(e.ops||[]).filter(o=>o.t==='out').length;
        const kind=e.kind||(e.wishId?'мрія':'ціль');
        const tags=[`🎯 ${kind}`]; if(outs) tags.push(`${outs} витрат`);
        const cover=e.cover||e.wishImg||'';
        return `<div class="env2 ${(e.wishId||cover)?'wishlinked':''}" style="--ec:${col}" data-envopen="${e.id}">
          ${cover?`<div class="e2cover" style="background-image:url('${esc(cover)}')"></div>`:''}
          <div class="e2water" style="height:0" data-e2fill="${pct}"></div>
          <div class="e2top"><span class="e2em">${e.emoji||'✉️'}</span><span class="e2pct">${pct}%</span></div>
          <div class="e2nm">${esc(e.name)}</div>
          <div class="e2amt">${fmt(sv)} / ${fmt(e.goal||0)} ₴</div>
          <div class="e2tags">${tags.map(t=>`<span class="e2tg">${t}</span>`).join('')}</div>
        </div>`;
      }).join('')}
        <div class="env2 add" id="fhNewEnv">＋<br>Новий конверт</div>
      </div>
      <div class="fh-secl"><svg class="fin-ico"><use href="#fi-repeat"/></svg> Регулярні платежі</div>
      ${recurring.map(r=>`<div class="fin-reg" data-regdel="${r.id}"><span><svg class="fin-ico"><use href="#fi-repeat"/></svg> ${esc(r.name)}</span><b>${fmt(r.amount)} ₴/міс</b></div>`).join('')
        || `<div class="fh-empty">Додай підписки й регулярні платежі (Netflix, оренда…).</div>`}
      <button class="newbtn" id="fhNewRec" style="border-color:#5b8def;color:#5b8def">+ Регулярний платіж</button>`;

    const bk=document.getElementById('envScreenBack'); if(bk) bk.onclick=()=>{ finView='dash'; renderFinance(); };
    body.querySelectorAll('[data-envopen]').forEach(el=>el.onclick=()=>openEnvSheet(el.dataset.envopen));
    const ne=document.getElementById('fhNewEnv'); if(ne) ne.onclick=newEnvelope;
    const nr=document.getElementById('fhNewRec'); if(nr) nr.onclick=newRecurring;
    body.querySelectorAll('[data-regdel]').forEach(el=>el.onclick=()=>{
      confirmSheet({title:'Видалити регулярний платіж?', onOk:()=>{ recurring=recurring.filter(r=>String(r.id)!==String(el.dataset.regdel)); saveRecurring(); renderFinance(); }});
    });
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      body.querySelectorAll('.e2water[data-e2fill]').forEach(w=>{ w.style.height=(w.dataset.e2fill||0)+'%'; });
    }));
  }


  function addFinOp(type){
    ensureCards();
    addFinOpCard(type, mainCard());   // рахунок один — питати нема про що
  }
  function addFinOpCard(type,c){
    const t=type==='in'?'Дохід':'Витрата';
    inputModal({title:t+' — сума ('+cardSym(c)+')', placeholder:'Напр. 500', onOk:(v)=>{
      const amount=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(amount>0)) return;
      inputModal({title:t+' — на що?', placeholder:type==='in'?'Зарплата, подарунок…':'Їжа, таксі…', onOk:(label)=>{
        finOps.push({ id:Date.now()+'_'+Math.random().toString(36).slice(2,6), type, amount, label:label||t, date:ymdLocal(), card:c.id });
        saveFinOps(); renderFinance();
        try{ flowReact(type==='in'?'income':'spend',{amount:amount}); }catch(_){}
      }});
    }});
  }
  function newRecurring(){
    inputModal({title:'Регулярний платіж', placeholder:'Напр. Netflix', emoji:true, emojiVal:'🔁', onOk:(name,emojiVal)=>{
      if(!name) return;
      inputModal({title:'Сума на місяць (₴)', placeholder:'Напр. 250', onOk:(v)=>{
        const amount=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,''))||0;
        inputModal({title:'День списання (1–31)', placeholder:'Напр. 15 · порожньо = без автосписання', onOk:(dv)=>{
          const dd=parseInt((dv||'').replace(/\D/g,''),10);
          const rec={ id:'rec_'+Date.now(), name, emoji:(emojiVal!==undefined?emojiVal:'🔁'), amount, period:'month' };
          if(dd>=1&&dd<=31) rec.day=dd;
          recurring.push(rec);
          saveRecurring(); try{ recAutoPost(); }catch(_){} renderFinance();
        }});
      }});
    }});
  }

  function newEnvelope(){
    inputModal({title:'Новий конверт', placeholder:'Напр. Відпустка', emoji:true, emojiVal:'✉️', onOk:(name,emojiVal)=>{
      if(!name) return;
      inputModal({title:'Ціль конверта (сума ₴)', placeholder:'Напр. 20000', onOk:(goalStr)=>{
        const colors=['#5b8def','#34c77b','#e8843c','#c77dff','#f0b429','#4ecdc4'];
        const goal=parseInt((goalStr||'').replace(/\D/g,''))||0;
        const e={ id:'env_'+Date.now(), name, emoji:(emojiVal!==undefined?emojiVal:'✉️'),
          color:colors[envelopes.length%colors.length], goal, saved:0, ops:[], kind:'ціль',
          link:'main', linkLabel:'головна папка' };
        envelopes.push(e);
        saveEnvelopes(); renderFinance();
        // одразу відкриваємо новий конверт
        setTimeout(()=>openEnvSheet(e.id),60);
      }});
    }});
  }

  /* ===== envelope goal-card sheet ===== */
  let envOpenId=null;
  function openEnvSheet(id){
    envOpenId=id; renderEnvSheet();
    const d=document.getElementById('e2Dim'), s=document.getElementById('e2Sheet');
    if(d) d.classList.add('on'); if(s) s.classList.add('on');
  }
  function closeEnvSheet(){
    const d=document.getElementById('e2Dim'), s=document.getElementById('e2Sheet');
    if(d) d.classList.remove('on'); if(s) s.classList.remove('on'); envOpenId=null;
  }
  // ===== Project P&L widget =====
  function projIncome(b){ return (b.ops||[]).filter(o=>o.t==='in').reduce((s,o)=>s+o.amount,0); }
  function projExpense(b){ return (b.ops||[]).filter(o=>o.t==='out').reduce((s,o)=>s+o.amount,0); }
  function projNet(b){ return projIncome(b)-projExpense(b); }
  function projIsLocked(b){
    if(b.unlocked) return false;
    if(!b.deadline) return false; // без дати — не блокується
    const today=ymdLocal();
    return today < b.deadline; // заблоковано доки не настала дата
  }
  function projDaysLeft(b){
    if(!b.deadline) return null;
    const d=Math.ceil((new Date(b.deadline)-new Date())/86400000);
    return d;
  }
  function projectWidgetHtml(b, sz, head){
    const cur=b.cur||'€';
    const inc=projIncome(b), exp=projExpense(b), net=projNet(b);
    const expected=+b.expected||0;
    const locked=projIsLocked(b);
    const dleft=projDaysLeft(b);
    const view=b.pview||1;
    const lockChip = b.deadline
      ? `<span class="pj-lock ${locked?'locked':'open'}">${locked?'🔒 до '+fmtDate(b.deadline):'🔓 розблоковано'}</span>`
      : `<span class="pj-lock open">🔓 будь-коли</span>`;
    const switcher = `<div class="pj-views">
      ${[['1','P&L'],['2','Журнал'],['3','Колонки'],['4','Маржа']].map(([v,l])=>
        `<button class="pj-vbtn ${String(view)===v?'on':''}" data-pjview="${b.id}|${v}">${l}</button>`).join('')}
    </div>`;
    const splitBtn = (b.splitPreset && +b.splitPreset.amount>0)
      ? `<button class="fin-btn pj-split" data-pjsplit="${b.id}" style="background:var(--hab,#34c77b);color:#08160e">💶 ${b.splitPreset.label||'Клієнт'} +${+b.splitPreset.amount}${b.splitPreset.cur||b.cur||'€'}</button>`
      : '';
    const actions = `<div class="fin-btns pj-acts">
      ${splitBtn}
      <button class="fin-btn pj-in" data-pjadd="${b.id}|in">+ Дохід</button>
      <button class="fin-btn pj-out" data-pjadd="${b.id}|out">− Витрата</button>
      ${(expected>0 && locked)
        ? `<button class="fin-btn pj-got" data-pjgot="${b.id}">✅ Отримано</button>`
        : `<button class="fin-btn pj-env" data-pjenv="${b.id}">✉️</button>`}
    </div>`;

    let bodyHtml='';
    if(view===1){
      const tot=inc+exp||1;
      const expRow = expected>0 ? `<div class="pj-exp-row">${locked?'🔒':'🔓'} Очікується ще <b>${fmt(expected)} ${cur}</b>${b.deadline?` · ${locked&&dleft>=0?'через '+dleft+' дн':fmtDate(b.deadline)}`:''}</div>` : '';
      bodyHtml=`
        <div class="pj-pnl">
          <div class="c" style="--pc:var(--hab)"><s>Дохід</s><b>${fmt(inc)} ${cur}</b></div>
          <div class="c" style="--pc:var(--owe)"><s>Витрати</s><b>${fmt(exp)} ${cur}</b></div>
          <div class="c net" style="--pc:var(--val)"><s>Прибуток</s><b style="color:${net>=0?'var(--val)':'var(--owe)'}">${fmt(net)} ${cur}</b></div>
        </div>
        <div class="pj-barstack"><i class="in" style="width:${inc/tot*100}%"></i><i class="ex" style="width:${exp/tot*100}%"></i></div>
        ${expRow}`;
    } else if(view===2){
      const ops=(b.ops||[]).slice().reverse();
      bodyHtml = ops.length ? ops.map(o=>`<div class="pj-led"><span class="i">${o.t==='in'?'⬆️':'⬇️'}</span>
        <div class="m"><div class="mn">${esc(o.label||(o.t==='in'?'Дохід':'Витрата'))}</div>
          <div class="md">${esc(o.date||'')}${o.src?' · '+esc(o.src):''}</div></div>
        <b class="${o.t}">${o.t==='in'?'+':'−'}${fmt(o.amount)} ${cur}</b>
        <button class="pj-del" data-pjdel="${b.id}|${o.id}">✕</button></div>`).join('')
        : `<div class="fh-empty">Рухів ще нема. Додай дохід або витрату.</div>`;
      bodyHtml += `<div class="pj-foot"><span class="l">Чистий прибуток</span><b class="${net<0?'neg':''}">${fmt(net)} ${cur}</b></div>`;
    } else if(view===3){
      const ins=(b.ops||[]).filter(o=>o.t==='in'), outs=(b.ops||[]).filter(o=>o.t==='out');
      bodyHtml=`<div class="pj-cols">
        <div class="pj-col inc"><div class="ch">⬆️ Доходи</div>
          ${ins.map(o=>`<div class="row"><span>${esc(o.label||'дохід')}</span><b>${fmt(o.amount)}</b></div>`).join('')||'<div class="row"><span>—</span><b>0</b></div>'}
          <div class="tot"><span>Разом</span><b>${fmt(inc)} ${cur}</b></div></div>
        <div class="pj-col exp"><div class="ch">⬇️ Витрати</div>
          ${outs.map(o=>`<div class="row"><span>${esc(o.label||'витрата')}</span><b>${fmt(o.amount)}</b></div>`).join('')||'<div class="row"><span>—</span><b>0</b></div>'}
          <div class="tot"><span>Разом</span><b>${fmt(exp)} ${cur}</b></div></div>
      </div>
      <div class="pj-netrow"><span class="l">Чистий прибуток</span><b>${fmt(net)} ${cur}</b></div>`;
    } else {
      const margin = inc>0 ? Math.max(0,Math.round(net/inc*100)) : 0;
      bodyHtml=`<div class="pj-gauge">
        <div class="pj-ring" style="--p:${margin}"><div class="rin"><b>${margin}%</b><s>маржа</s></div></div>
        <div class="pj-gstats">
          <div class="gr"><span class="n"><i style="background:var(--hab)"></i>Дохід</span><b>${fmt(inc)} ${cur}</b></div>
          <div class="gr"><span class="n"><i style="background:var(--owe)"></i>Витрати</span><b>−${fmt(exp)} ${cur}</b></div>
          <div class="gr top"><span class="n"><i style="background:var(--val)"></i>Прибуток</span><b style="color:var(--val)">${fmt(net)} ${cur}</b></div>
        </div></div>`;
    }

    return `<div class="tile ${sz} tproj" data-tileid="${b.id}" style="--tc:#34c77b">${head}
      <div class="pj-head"><span class="pj-title" data-pjtitle="${b.id}">${esc(b.title||'Проєкт')}</span>
        <span class="pj-lock-wrap" data-pjsetup="${b.id}">${lockChip}</span></div>
      ${switcher}
      <div class="pj-body">${bodyHtml}</div>
      ${actions}</div>`;
  }
  function fmtDate(iso){ if(!iso) return ''; const p=iso.split('-'); return p.length===3?`${p[2]}.${p[1]}`:iso; }

  /* ═══════════ ПРОЄКТНІ БЛОКИ: канбан · контакти · таймлайн · подія ═══════════ */
  // ── КАНБАН: колонки й картки ──
  function kanbanWidgetHtml(b, sz, head){
    const cols=Array.isArray(b.cols)?b.cols:[];
    const colsHtml=cols.map(col=>{
      const cards=(col.cards||[]).map(cd=>`<div class="kbw-card" data-kbcard="${b.id}|${col.id}|${cd.id}">
        <b>${esc(cd.t||'Картка')}</b>${cd.m?`<span class="m">${esc(cd.m)}</span>`:''}</div>`).join('');
      return `<div class="kbw-col">
        <div class="kbw-ch" data-kbcol="${b.id}|${col.id}"><span>${esc(col.name||'Колонка')}</span><i>${(col.cards||[]).length}</i></div>
        ${cards}
        <button class="kbw-add" data-kbaddcard="${b.id}|${col.id}">＋ картка</button></div>`;
    }).join('');
    return `<div class="tile ${sz} tkbw" data-tileid="${b.id}" style="--tc:#5b8def">${head}
      <div class="kbw-wrap">${colsHtml}
        <button class="kbw-newcol" data-kbaddcol="${b.id}">＋<br>колонка</button></div></div>`;
  }
  function kbwFind(b,colId){ return (b.cols||[]).find(c=>String(c.id)===String(colId)); }
  function kbwAddCard(b,colId){
    const col=kbwFind(b,colId); if(!col) return;
    inputModal({title:'Нова картка — назва', placeholder:'Напр. Ірина М. (Краків)', onOk:(t)=>{
      if(!(t||'').trim()) return;
      inputModal({title:'Примітка (необов’язково)', placeholder:'Напр. дзвінок пт 15:00', onOk:(m)=>{
        (col.cards=col.cards||[]).push({id:'kd'+Date.now(),t:t.trim(),m:(m||'').trim()});
        saveBoard(); renderBoard();
      }});
    }});
  }
  function kbwCardMenu(b,colId,cardId){
    const cols=b.cols||[]; const ci=cols.findIndex(c=>String(c.id)===String(colId));
    const col=cols[ci]; if(!col) return;
    const cd=(col.cards||[]).find(x=>String(x.id)===String(cardId)); if(!cd) return;
    const move=(dir)=>{ const to=cols[ci+dir]; if(!to) return;
      col.cards=col.cards.filter(x=>x!==cd); (to.cards=to.cards||[]).push(cd);
      saveBoard(); renderBoard(); window.platform.haptic('select'); };
    const items=[];
    if(cols[ci+1]) items.push({ic:'▶️', label:'Далі → «'+(cols[ci+1].name||'')+'»', sub:'перемістити вперед', onClick:()=>move(1)});
    if(cols[ci-1]) items.push({ic:'◀️', label:'Назад → «'+(cols[ci-1].name||'')+'»', sub:'перемістити назад', onClick:()=>move(-1)});
    items.push(
      {ic:'✏️', label:'Назва', sub:cd.t||'', onClick:()=>inputModal({title:'Назва картки', value:cd.t||'', onOk:(v)=>{ if((v||'').trim()){cd.t=v.trim(); saveBoard(); renderBoard();} }})},
      {ic:'📝', label:'Примітка', sub:cd.m||'додати', onClick:()=>inputModal({title:'Примітка', value:cd.m||'', onOk:(v)=>{ cd.m=(v||'').trim(); saveBoard(); renderBoard(); }})},
      {ic:'🗑', label:'Видалити картку', onClick:()=>confirmSheet({title:'Видалити «'+(cd.t||'картку')+'»?', onOk:()=>{ col.cards=col.cards.filter(x=>x!==cd); saveBoard(); renderBoard(); }})}
    );
    actionSheet({title:cd.t||'Картка', sub:col.name||'', items});
  }
  function kbwColMenu(b,colId){
    const cols=b.cols||[]; const ci=cols.findIndex(c=>String(c.id)===String(colId));
    const col=cols[ci]; if(!col) return;
    const swap=(dir)=>{ const j=ci+dir; if(j<0||j>=cols.length) return;
      [cols[ci],cols[j]]=[cols[j],cols[ci]]; saveBoard(); renderBoard(); };
    const items=[
      {ic:'✏️', label:'Перейменувати', sub:col.name||'', onClick:()=>inputModal({title:'Назва колонки', value:col.name||'', onOk:(v)=>{ if((v||'').trim()){col.name=v.trim(); saveBoard(); renderBoard();} }})},
    ];
    if(ci>0) items.push({ic:'⬅️', label:'Посунути вліво', onClick:()=>swap(-1)});
    if(ci<cols.length-1) items.push({ic:'➡️', label:'Посунути вправо', onClick:()=>swap(1)});
    items.push({ic:'🗑', label:'Видалити колонку', sub:(col.cards||[]).length?('разом із '+(col.cards||[]).length+' картками'):'порожня',
      onClick:()=>confirmSheet({title:'Видалити колонку «'+(col.name||'')+'»?', onOk:()=>{ b.cols=cols.filter(c=>c!==col); saveBoard(); renderBoard(); }})});
    actionSheet({title:col.name||'Колонка', sub:'Канбан', items});
  }
  // ── КОНТАКТИ: партнери, клієнти, сервіси ──
  const CTW_COLORS=['#6a7dff','#34c77b','#e8843c','#c77dff','#5b8def','#ff6b9d','#f0b429','#4ecdc4'];
  function ctwInit(nm){
    const parts=String(nm||'').trim().split(/\s+/).filter(Boolean);
    if(!parts.length) return '•';
    return (parts[0][0]+(parts[1]?parts[1][0]:'')).toUpperCase();
  }
  function contactsWidgetHtml(b, sz, head){
    const people=Array.isArray(b.people)?b.people:[];
    const rows=people.map((p,i)=>`<div class="ctw-row" data-ctrow="${b.id}|${p.id}">
      <span class="ctw-ava" style="background:${p.color||CTW_COLORS[i%CTW_COLORS.length]}">${esc(ctwInit(p.name))}</span>
      <span class="ctw-m"><b>${esc(p.name||'')}</b>${p.note?`<span>${esc(p.note)}</span>`:''}</span>
      ${p.link?`<button class="ctw-go" data-ctgo="${b.id}|${p.id}" title="Відкрити">↗</button>`:''}</div>`).join('');
    return `<div class="tile ${sz} tctw" data-tileid="${b.id}" style="--tc:#34c77b">${head}
      ${rows||'<div class="fh-empty">Швидкі контакти проєкту: партнери, клієнти, сервіси. Додай перший.</div>'}
      <div class="tadd" data-ctadd="${b.id}">+ контакт</div></div>`;
  }
  function ctwAdd(b){
    inputModal({title:'Ім’я або назва', placeholder:'Напр. Юрист Олена', onOk:(nm)=>{
      if(!(nm||'').trim()) return;
      inputModal({title:'Примітка (необов’язково)', placeholder:'Напр. підписи · пн–пт до 16:00', onOk:(note)=>{
        (b.people=b.people||[]).push({id:'ct'+Date.now(),name:nm.trim(),note:(note||'').trim(),link:'',
          color:CTW_COLORS[(b.people||[]).length%CTW_COLORS.length]});
        saveBoard(); renderBoard();
      }});
    }});
  }
  function ctwOpenLink(p){
    let l=(p.link||'').trim(); if(!l) return;
    if(/^\+?[\d\s\-()]{5,}$/.test(l)) l='tel:'+l.replace(/[\s\-()]/g,'');
    else if(!/^https?:\/\//i.test(l) && !/^tel:|^mailto:/i.test(l)) l='https://'+l;
    try{ window.platform.openLink(l); }catch(_){ try{ window.open(l,'_blank'); }catch(__){} }
  }
  function ctwMenu(b,pid){
    const p=(b.people||[]).find(x=>String(x.id)===String(pid)); if(!p) return;
    actionSheet({title:p.name||'Контакт', sub:p.note||'', items:[
      {ic:'✏️', label:'Ім’я', sub:p.name||'', onClick:()=>inputModal({title:'Ім’я', value:p.name||'', onOk:(v)=>{ if((v||'').trim()){p.name=v.trim(); saveBoard(); renderBoard();} }})},
      {ic:'📝', label:'Примітка', sub:p.note||'додати', onClick:()=>inputModal({title:'Примітка', value:p.note||'', onOk:(v)=>{ p.note=(v||'').trim(); saveBoard(); renderBoard(); }})},
      {ic:'🔗', label:'Телефон або посилання', sub:p.link||'додати', onClick:()=>inputModal({title:'Телефон / посилання', value:p.link||'', placeholder:'+421… або https://…', onOk:(v)=>{ p.link=(v||'').trim(); saveBoard(); renderBoard(); }})},
      {ic:'🎨', label:'Змінити колір', sub:'наступний із палітри', onClick:()=>{ const i=CTW_COLORS.indexOf(p.color); p.color=CTW_COLORS[(i+1+CTW_COLORS.length)%CTW_COLORS.length]; saveBoard(); renderBoard(); }},
      {ic:'🗑', label:'Видалити', onClick:()=>confirmSheet({title:'Видалити «'+(p.name||'контакт')+'»?', onOk:()=>{ b.people=(b.people||[]).filter(x=>x!==p); saveBoard(); renderBoard(); }})},
    ]});
  }
  // ── ТАЙМЛАЙН СПРАВИ: хронологія подій ──
  function clwFmt(d){
    const dt=new Date(d+'T12:00:00'); if(isNaN(dt)) return d||'';
    const wd=['нд','пн','вт','ср','чт','пт','сб'][dt.getDay()];
    return ('0'+dt.getDate()).slice(-2)+'.'+('0'+(dt.getMonth()+1)).slice(-2)+' · '+wd;
  }
  function caselineWidgetHtml(b, sz, head){
    const evs=(Array.isArray(b.events)?b.events:[]).slice().sort((a,x)=>String(a.d||'').localeCompare(String(x.d||'')));
    const rows=evs.map(ev=>`<div class="clw-ev" data-clev="${b.id}|${ev.id}">
      <span class="clw-d">${clwFmt(ev.d)}</span><span class="clw-t">${esc(ev.t||'')}</span></div>`).join('');
    return `<div class="tile ${sz} tclw" data-tileid="${b.id}" style="--tc:#e8843c">${head}
      ${rows?`<div class="clw-line">${rows}</div>`:'<div class="fh-empty">Хронологія справи: дзвінки, подачі, оплати — з датами. Додай першу подію.</div>'}
      <div class="tadd" data-cladd="${b.id}">+ подія</div></div>`;
  }
  function clwAdd(b){
    inputModal({title:'Дата події (РРРР-ММ-ДД)', value:ymdLocal(), onOk:(d)=>{
      d=(d||'').trim(); if(!/^\d{4}-\d{2}-\d{2}$/.test(d)){ if(d) flowAlert('Формат дати: РРРР-ММ-ДД'); return; }
      inputModal({title:'Що сталося?', placeholder:'Напр. Подача документів · статус того ж дня 🎉', onOk:(t)=>{
        if(!(t||'').trim()) return;
        (b.events=b.events||[]).push({id:'ce'+Date.now(),d,t:t.trim()});
        saveBoard(); renderBoard();
      }});
    }});
  }
  function clwMenu(b,evId){
    const ev=(b.events||[]).find(x=>String(x.id)===String(evId)); if(!ev) return;
    actionSheet({title:clwFmt(ev.d), sub:ev.t||'', items:[
      {ic:'📅', label:'Дата', sub:ev.d||'', onClick:()=>inputModal({title:'Дата (РРРР-ММ-ДД)', value:ev.d||'', onOk:(v)=>{ v=(v||'').trim(); if(/^\d{4}-\d{2}-\d{2}$/.test(v)){ ev.d=v; saveBoard(); renderBoard(); } else if(v) flowAlert('Формат дати: РРРР-ММ-ДД'); }})},
      {ic:'✏️', label:'Текст', sub:ev.t||'', onClick:()=>inputModal({title:'Текст події', value:ev.t||'', onOk:(v)=>{ if((v||'').trim()){ ev.t=v.trim(); saveBoard(); renderBoard(); } }})},
      {ic:'🗑', label:'Видалити подію', onClick:()=>confirmSheet({title:'Видалити подію?', onOk:()=>{ b.events=(b.events||[]).filter(x=>x!==ev); saveBoard(); renderBoard(); }})},
    ]});
  }
  // ── ФЕСТИВАЛЬ · ПОДІЯ: відлік, програма, бюджет ──
  function fstwCountdown(b){
    if(!b.date) return {t:'дата не задана',cls:''};
    const start=new Date(b.date+'T00:00:00'), end=new Date((b.dateEnd||b.date)+'T23:59:59'), now=new Date();
    if(isNaN(start)) return {t:'дата не задана',cls:''};
    if(now<start){ const n=Math.ceil((start-now)/86400000); return {t:n<=0?'сьогодні!':('через '+n+' дн.'),cls:'soon'}; }
    if(now<=end){ const n=Math.max(0,Math.ceil((end-now)/86400000)); return {t:'триває · ще '+n+' дн.',cls:'live'}; }
    return {t:'завершено',cls:'past'};
  }
  function fstwSpent(b){ return (b.ops||[]).reduce((s,o)=>s+(+o.amount||0),0); }
  function festivalWidgetHtml(b, sz, head){
    const cd=fstwCountdown(b);
    const cur=b.cur||'€';
    const spent=fstwSpent(b), bud=+b.budget||0;
    const pct=bud?Math.min(100,Math.round(spent/bud*100)):0;
    const prog=Array.isArray(b.program)?b.program:[];
    const done=prog.filter(p=>p.done).length;
    const dates=b.date?(fmtDate(b.date)+(b.dateEnd&&b.dateEnd!==b.date?('–'+fmtDate(b.dateEnd)):'')):'дата не задана';
    const items=prog.map(p=>`<div class="fstw-ck ${p.done?'done':''}">
      <i data-fstck="${b.id}|${p.id}"></i><span>${esc(p.text||'')}</span>
      <button class="cdel" data-fstdel="${b.id}|${p.id}">×</button></div>`).join('');
    return `<div class="tile ${sz} tfstw" data-tileid="${b.id}" style="--tc:#c77dff">${head}
      <div class="fstw-hero" data-fstsetup="${b.id}">
        <span class="fstw-em">${esc(b.emojiF||'🎪')}</span>
        <div class="fstw-hm"><b>${esc(b.title||'Подія')}</b>
          <span>📅 ${dates}${b.place?' · 📍 '+esc(b.place):''}</span></div>
        <span class="fstw-cd ${cd.cls}">${cd.t}</span></div>
      ${bud>0?`<div class="fstw-bud"><div class="r"><span>💶 Бюджет</span><b>${fmt(spent)} / ${fmt(bud)} ${cur}</b></div>
        <div class="fstw-bar"><i style="width:${pct}%"></i></div></div>`:''}
      <div class="fstw-pl">Програма · ${done}/${prog.length}</div>
      ${items||'<div class="fh-empty" style="padding:4px 0 8px">Що зробити до і під час події?</div>'}
      <div class="tadd" data-fstadd="${b.id}">+ пункт програми</div>
      <div class="fin-btns">
        <button class="fin-btn" data-fstspend="${b.id}">− Витрата</button>
        <button class="fin-btn" data-fstsetup2="${b.id}">⚙ Налаштувати</button></div></div>`;
  }
  function fstwSpend(b){
    const cur=b.cur||'€';
    inputModal({title:'Витрата — на що?', placeholder:'Напр. квитки', onOk:(label)=>{
      inputModal({title:'Сума ('+cur+')', placeholder:'Напр. 120', onOk:(v)=>{
        const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
        (b.ops=b.ops||[]).push({id:'fo'+Date.now(),label:(label||'Витрата').trim(),amount:n,date:ymdLocal()});
        saveBoard(); renderBoard();
      }});
    }});
  }
  function fstwOpsSheet(b){
    const cur=b.cur||'€';
    const ops=(b.ops||[]).slice().reverse();
    if(!ops.length){ flowAlert('Витрат по події ще нема.'); return; }
    actionSheet({title:'Витрати події', sub:'Разом: '+fmt(fstwSpent(b))+' '+cur+' · тап — видалити',
      items:ops.map(o=>({ic:'🧾', label:(o.label||'Витрата')+' · '+fmt(o.amount)+' '+cur, sub:o.date||'',
        onClick:()=>confirmSheet({title:'Видалити витрату «'+(o.label||'')+'»?', onOk:()=>{ b.ops=(b.ops||[]).filter(x=>x!==o); saveBoard(); renderBoard(); }})}))});
  }
  function fstwSetup(b){
    actionSheet({title:b.title||'Подія', sub:'Налаштування події', items:[
      {ic:'✏️', label:'Назва', sub:b.title||'', onClick:()=>inputModal({title:'Назва події', value:b.title||'', onOk:(v)=>{ if((v||'').trim()){ b.title=v.trim(); saveBoard(); renderBoard(); } }})},
      {ic:'🎪', label:'Емодзі', sub:b.emojiF||'🎪', onClick:()=>inputModal({title:'Емодзі події', value:b.emojiF||'🎪', onOk:(v)=>{ const e=(v||'').trim().slice(0,4); if(e){ b.emojiF=e; saveBoard(); renderBoard(); } }})},
      {ic:'📅', label:'Дата початку', sub:b.date||'РРРР-ММ-ДД', onClick:()=>inputModal({title:'Початок (РРРР-ММ-ДД)', value:b.date||'', onOk:(v)=>{ v=(v||'').trim(); if(!v||/^\d{4}-\d{2}-\d{2}$/.test(v)){ b.date=v; saveBoard(); renderBoard(); } else flowAlert('Формат дати: РРРР-ММ-ДД'); }})},
      {ic:'🏁', label:'Дата завершення', sub:b.dateEnd||'необов’язково', onClick:()=>inputModal({title:'Завершення (РРРР-ММ-ДД)', value:b.dateEnd||'', onOk:(v)=>{ v=(v||'').trim(); if(!v||/^\d{4}-\d{2}-\d{2}$/.test(v)){ b.dateEnd=v; saveBoard(); renderBoard(); } else flowAlert('Формат дати: РРРР-ММ-ДД'); }})},
      {ic:'📍', label:'Місце', sub:b.place||'додати', onClick:()=>inputModal({title:'Місце події', value:b.place||'', placeholder:'Напр. Київ', onOk:(v)=>{ b.place=(v||'').trim(); saveBoard(); renderBoard(); }})},
      {ic:'💶', label:'Бюджет', sub:(+b.budget||0)+' '+(b.cur||'€'), onClick:()=>inputModal({title:'Бюджет ('+(b.cur||'€')+')', value:String(+b.budget||''), placeholder:'Напр. 800', onOk:(v)=>{ b.budget=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,''))||0; saveBoard(); renderBoard(); }})},
      {ic:'🧾', label:'Журнал витрат', sub:(b.ops||[]).length+' записів', onClick:()=>fstwOpsSheet(b)},
    ]});
  }

  // додати дохід/витрату до проєкту
  function projAddMovement(b, t){
    const cur=b.cur||'€';
    const today=ymdLocal();
    if(t==='in'){
      inputModal({title:'Дохід проєкту — за що?', placeholder:'Напр. аванс', onOk:(label)=>{
        inputModal({title:'Сума доходу ('+cur+')', placeholder:'Напр. 300', onOk:(v)=>{
          const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
          const finId='fin_'+Date.now()+Math.random().toString(36).slice(2,5);
          (b.ops=b.ops||[]).push({id:'pop_'+Date.now(),t:'in',amount:n,label:label||'Дохід',date:today,src:'отримано',finOpId:finId});
          finOps.push({id:finId,type:'in',amount:n,label:'Проєкт: '+(b.title||'')+(label?' · '+label:''),date:today,proj:b.id,card:_projCardId()});
          saveBoard(); saveFinOps(); renderBoard();
        }});
      }});
    } else {
      // витрата — питаємо джерело
      actionSheet({
        title:'Витрата на проєкт',
        sub:'Звідки списати кошти?',
        items:[
          {ic:'💰', label:'З балансу', sub:'як звичайна витрата (Розходи)', onClick:()=>projAskExpense(b,'balance')},
          {ic:'💼', label:'З доходу проєкту', sub:'зменшує прибуток, баланс не чіпає', onClick:()=>projAskExpense(b,'project')},
        ]
      });
    }
  }
  function projAskExpense(b, src){
    const cur=b.cur||'€';
    const today=ymdLocal();
    inputModal({title:'Витрата — на що?', placeholder:'Напр. реклама', onOk:(label)=>{
      inputModal({title:'Сума витрати ('+cur+')', placeholder:'Напр. 180', onOk:(v)=>{
        const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
        const op={id:'pop_'+Date.now(),t:'out',amount:n,label:label||'Витрата',date:today,src:src==='balance'?'з балансу':'з доходу проєкту'};
        if(src==='balance'){
          const finId='fin_'+Date.now()+Math.random().toString(36).slice(2,5);
          op.finOpId=finId;
          finOps.push({id:finId,type:'out',amount:n,label:'Проєкт: '+(b.title||'')+(label?' · '+label:''),date:today,proj:b.id,card:_projCardId()});
          saveFinOps();
        }
        (b.ops=b.ops||[]).push(op);
        saveBoard(); renderBoard();
      }});
    }});
  }
  // отримати очікуваний дохід → розблокувати, додати в Дохід
  function projReceiveExpected(b){
    const cur=b.cur||'€';
    const amt=+b.expected||0;
    if(!(amt>0)){ b.unlocked=true; saveBoard(); renderBoard(); return; }
    const today=ymdLocal();
    const finId='fin_'+Date.now()+Math.random().toString(36).slice(2,5);
    (b.ops=b.ops||[]).push({id:'pop_'+Date.now(),t:'in',amount:amt,label:'Оплата проєкту',date:today,src:'отримано',finOpId:finId});
    finOps.push({id:finId,type:'in',amount:amt,label:'Проєкт: '+(b.title||'')+' · оплата',date:today,proj:b.id,card:_projCardId()});
    b.expected=0; b.unlocked=true;
    saveBoard(); saveFinOps(); renderBoard();
  }
  // ⚡ АВТО-РОЗПОДІЛ: прийняти фіксовану оплату і одним тапом розкидати по конвертах за правилом.
  // Вмикається, якщо у блока є b.splitPreset = { amount, cur, rules:[{envId, pct}] }.
  // rules: pct у частках від суми (0.20 = 20%). Решта лишається як прибуток проєкту.
  function projSplitPreset(b){
    const ps=b.splitPreset; if(!ps||!(+ps.amount>0)){ return projAddMovement(b,'in'); }
    const amt=+ps.amount, cur=ps.cur||b.cur||'€', today=ymdLocal();
    const rules=Array.isArray(ps.rules)?ps.rules.filter(r=>r&&r.envId&&+r.pct>0):[];
    // 1) дохід у проєкт + finOps
    const finId='fin_'+Date.now()+Math.random().toString(36).slice(2,5);
    (b.ops=b.ops||[]).push({id:'pop_'+Date.now(),t:'in',amount:amt,label:(ps.label||'Оплата клієнта'),date:today,src:'отримано',finOpId:finId});
    finOps.push({id:finId,type:'in',amount:amt,label:'Проєкт: '+(b.title||'')+' · '+(ps.label||'оплата'),date:today,proj:b.id,card:_projCardId()});
    // 2) авто-переклад у кожен конверт (envAddOp сам дзеркалить у finOps як резерв)
    let moved=0; const parts=[];
    rules.forEach(r=>{
      const e=envelopes.find(x=>String(x.id)===String(r.envId)); if(!e) return;
      const sum=Math.round(amt*(+r.pct)*100)/100; if(!(sum>0)) return;
      envAddOp(e,'in',sum,'Авто з «'+(b.title||'проєкт')+'»',_projCardId());
      moved+=sum; parts.push(sum+' '+cur+' → '+(e.emoji||'✉️')+' '+e.name);
    });
    saveBoard(); saveFinOps(); renderBoard();
    const rest=Math.round((amt-moved)*100)/100;
    try{ flowAlert('💶 +'+amt+' '+cur+'\n'+(parts.length?parts.join('\n')+'\n':'')+'Лишилось у прибутку: '+rest+' '+cur); }catch(_){}
    try{ window.platform.haptic('success'); }catch(_){}
  }

  // розподілити прибуток проєкту в конверт (поповнити накопичення)
  function projDistributeToEnvelope(b){
    const cur=b.cur||'€';
    const net=projNet(b);
    const doPick=()=>{
      actionSheet({
        title:'Розподілити в конверт',
        sub:'Прибуток проєкту: '+fmt(net)+' '+cur,
        items: envelopes.map(e=>{
          const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
          return { ic:(e.emoji||'✉️'), label:e.name, sub:`${fmt(sv)} / ${fmt(e.goal||0)} ₴ · ${pct}%`,
            onClick:()=>{
              inputModal({title:'Скільки в «'+e.name+'» (₴)', placeholder:'Сума', onOk:(v)=>{
                const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
                envAddOp(e,'in',n,'З проєкту: '+(b.title||''),_projCardId()); renderBoard();
              }});
            }};
        }).concat([{ ic:'＋', label:'Новий конверт', sub:'створити й поповнити', onClick:()=>createEnvelopeFor(null) }])
      });
    };
    if(!envelopes.length){ createEnvelopeFor(null); return; }
    doPick();
  }

  // створити конверт прямо з віджета на полотні й одразу привʼязати
  function createEnvelopeFor(block){
    inputModal({title:'Новий конверт', placeholder:'Напр. Спорт', emoji:true, emojiVal:'✉️', onOk:(name,emojiVal)=>{
      if(!(name||'').trim()) return;
      inputModal({title:'Ціль конверта (сума ₴)', placeholder:'Напр. 2000', onOk:(goalStr)=>{
        const colors=['#5b8def','#34c77b','#e8843c','#c77dff','#f0b429','#4ecdc4'];
        const goal=parseInt((goalStr||'').replace(/\D/g,''))||0;
        const e={ id:'env_'+Date.now(), name:name.trim(), emoji:(emojiVal!==undefined?emojiVal:'✉️'),
          color:colors[envelopes.length%colors.length], goal, saved:0, ops:[], kind:'ціль',
          link:'main', linkLabel:'головна папка' };
        envelopes.push(e);
        saveEnvelopes();
        if(block){ block.envId=e.id; saveBoard(); }
        renderBoard();
      }});
    }});
  }
  // вибір конверта для віджета на полотні
  function pickEnvelopeFor(block){
    actionSheet({
      title:'Привʼязати конверт',
      sub:'Цей віджет показуватиме обраний конверт',
      items: envelopes.map(e=>{
        const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
        return { ic:(e.emoji||'✉️'), label:e.name, sub:`${fmt(sv)} / ${fmt(e.goal||0)} ₴ · ${pct}%`,
          onClick:()=>{ block.envId=e.id; saveBoard(); renderBoard(); } };
      })
    });
  }
  function renderEnvSheet(){
    const s=document.getElementById('e2Sheet'); if(!s) return;
    const e=envelopes.find(x=>String(x.id)===String(envOpenId)); if(!e){ closeEnvSheet(); return; }
    envMigrate(e);
    const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
    const left=Math.max(0,(e.goal||0)-sv);
    const col=e.color||'#5b8def';
    const kind=e.kind||(e.wishId?'мрія':'ціль');
    const cover=e.cover||e.wishImg||'';
    s.style.setProperty('--ec',col);
    s.innerHTML=`<div class="e2grab"></div>
      <div class="e2hero">
        <div class="e2bg" style="background:${cover?`url('${esc(cover)}')`:`linear-gradient(135deg,${col},#1a1d27)`};background-size:cover;background-position:center"></div>
        <div class="e2veil"></div>
        <div class="e2htop"><span class="e2chip">🎯 ${esc(kind)}</span><span class="e2chip">${pct}%</span></div>
        <div class="e2htxt">
          <div class="e2nm2">${e.emoji||'✉️'} ${esc(e.name)}</div>
          <div class="e2sub">${e.wishId?'звʼязано з Картою мрій · ':''}ціль ${fmt(e.goal||0)} ₴</div>
          <div class="e2prog"><i style="width:${pct}%"></i></div>
          <div class="e2nums"><div class="n">${fmt(sv)} ₴<small>накопичено</small></div>
            <div class="n" style="text-align:right">${fmt(left)} ₴<small>лишилось</small></div></div>
        </div>
      </div>
      <div class="e2body">
        <div class="e2acts">
          <button class="in" id="e2In">+ Поповнити<small>з картки → у конверт</small></button>
          <button class="out" id="e2Out">− Витрата на ціль<small>піде в Розходи</small></button>
        </div>
        <div class="e2secl"><span>Рухи (${e.ops.length})</span><span>усе по конверту</span></div>
        ${e.ops.length? e.ops.map(o=>`<div class="e2op" data-eopdel="${o.id}">
          <div class="l"><span class="ic">${o.t==='in'?'⬆️':'⬇️'}</span>
            <div>${esc(o.label||'')}<s>${esc(o.date||'')}</s></div></div>
          <b class="${o.t}">${o.t==='in'?'+':'−'}${fmt(o.amount)} ₴</b></div>`).join('')
          : `<div class="fh-empty">Ще немає рухів. Поповни конверт або запиши витрату.</div>`}
        <div class="e2edit">
          <button id="e2Name">✎ Назва</button>
          <button id="e2Goal">🎯 Ціль</button>
          <button id="e2Card">💳 Картка</button>
          <button id="e2Del" class="e2del">Видалити</button>
        </div>
      </div>`;
    s.querySelector('#e2In').onclick=()=>{
      const ask=(c)=>inputModal({title:'Поповнити «'+e.name+'» ('+cardSym(c)+')', placeholder:'Сума', onOk:(v)=>{
        const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
        envAddOp(e,'in',n,'З картки: '+c.name,c.id); renderEnvSheet(); renderFinance();
      }});
      ask(mainCard());
    };
    s.querySelector('#e2Out').onclick=()=>inputModal({title:'Витрата на «'+e.name+'»', placeholder:'На що…', onOk:(label)=>{
      inputModal({title:'Сума витрати (₴)', placeholder:'Напр. 500', onOk:(v)=>{
        const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
        envAddOp(e,'out',n,label||'Витрата'); renderEnvSheet(); renderFinance();
      }});
    }});
    s.querySelector('#e2Name').onclick=()=>inputModal({title:'Назва конверта', value:e.name, onOk:(v)=>{ if((v||'').trim()){ e.name=v.trim(); saveEnvelopes(); renderEnvSheet(); renderFinance(); } }});
    { const cb=s.querySelector('#e2Card'); if(cb) cb.onclick=()=>{
      ensureCards();
      actionSheet({ title:'Картка для поповнень', sub:e.cardId?('Зараз: '+((cardById(e.cardId)||{}).name||'—')):'Зараз: питати щоразу',
        items: cards.map(c=>({ ic:c.emoji||'💳', label:c.name, sub:fmt(cardBalance(c))+' '+cardSym(c), onClick:()=>{ e.cardId=c.id; saveEnvelopes(); renderEnvSheet(); } }))
          .concat([{ ic:'❓', label:'Питати щоразу', onClick:()=>{ delete e.cardId; saveEnvelopes(); renderEnvSheet(); } }])
      });
    }; }
    s.querySelector('#e2Goal').onclick=()=>inputModal({title:'Ціль конверта (₴)', value:String(e.goal||0), onOk:(v)=>{ const n=parseInt((v||'').replace(/\D/g,'')); if(!isNaN(n)){ e.goal=n; saveEnvelopes(); renderEnvSheet(); renderFinance(); } }});
    s.querySelector('#e2Del').onclick=()=>{ confirmSheet({title:'Видалити конверт «'+e.name+'»?', sub:'Рухи в Розходах залишаться.', onOk:()=>{ envelopes=envelopes.filter(x=>String(x.id)!==String(e.id)); saveEnvelopes(); closeEnvSheet(); renderFinance(); }}); };
    s.querySelectorAll('[data-eopdel]').forEach(el=>el.onclick=()=>{ confirmSheet({title:'Видалити цей рух?', onOk:()=>{ envDelOp(e, el.dataset.eopdel); renderEnvSheet(); renderFinance(); }}); });
  }

