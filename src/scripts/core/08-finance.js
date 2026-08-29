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
  // recurring payments
  let recurring=[]; // {id,name,emoji,amount,period}
  const RECKEY='fin_recurring';
  function saveRecurring(){ try{ const p=window.storage.set(RECKEY,JSON.stringify(recurring),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  // challenges
  let challenges=[]; // {id,name,emoji,goal,progress,unit}
  const CHKEY='fin_challenges';
  function saveChallenges(){ try{ const p=window.storage.set(CHKEY,JSON.stringify(challenges),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }


  /* ============ INCOME CARDS · Доходи (віртуальні картки) ============ */
  let cards=[]; const CARDKEY='income_cards';
  let cardCfg={ style:1, sel:'' }; const CARDCFGKEY='income_cfg';
  function saveCards(){ try{ const p=window.storage.set(CARDKEY,JSON.stringify(cards),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function saveCardCfg(){ try{ const p=window.storage.set(CARDCFGKEY,JSON.stringify(cardCfg),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  const CARD_TYPES={ work:'Робота · ЗП', project:'Проєкти', side:'Додатковий', custom:'Картка' };
  const CARD_COLORS=['#5b8def','#34c77b','#e8843c','#c77dff','#f0b429','#4ecdc4','#ff6b9d','#9b8cff'];
  function mainCard(){ return cards.find(c=>c.main)||cards[0]; }
  function cardById(id){ return cards.find(c=>String(c.id)===String(id)); }
  function cardSym(c){ return CUR[c.cur]||c.cur||'₴'; }
  function cardOps(c){ return finOps.filter(o=>String(o.card)===String(c.id) && !o.envSpend); }
  function cardBalance(c){ return cardOps(c).reduce((s,o)=>s+(o.type==='in'?o.amount:-o.amount),0); }
  function cardMonthIn(c){ const ym=ymLocal(); return cardOps(c).filter(o=>o.type==='in'&&String(o.date||'').slice(0,7)===ym).reduce((s,o)=>s+o.amount,0); }
  function cardsTotals(){ const t={}; cards.forEach(c=>{ const cur=c.cur||'UAH'; t[cur]=(t[cur]||0)+cardBalance(c); }); return t; }
  function cardNum(c){ let h=0; const st=String(c.id); for(let i=0;i<st.length;i++) h=(h*31+st.charCodeAt(i))>>>0; return String(1000+h%9000); }
  function incomeSummary(){ try{ ensureCards(); const t=cardsTotals(); const ks=Object.keys(t); return ks.length?ks.map(k=>fmt(t[k])+' '+(CUR[k]||k)).join(' · '):'—'; }catch(_){ return '—'; } }
  function _projCardId(){ try{ ensureCards(); return (cards.find(c=>c.type==='project')||mainCard()).id; }catch(_){ return undefined; } }
  function ensureCards(){
    if(!Array.isArray(cards)) cards=[];
    if(!cards.length){
      cards=[
        { id:'card_work', name:'Робота · ЗП', emoji:'💼', type:'work', cur:(workCur||'EUR'), color:'#5b8def', main:true },
        { id:'card_proj', name:'Проєкти', emoji:'🚀', type:'project', cur:'EUR', color:'#34c77b' },
        { id:'card_side', name:'Додатковий дохід', emoji:'➕', type:'side', cur:'UAH', color:'#e8843c' }
      ];
      saveCards();
    }
    if(!cards.some(c=>c.main)) cards[0].main=true;
    let ch=false;
    // міграція: витрати ІЗ конверта не мають вдруге списувати баланс/картку
    try{
      envelopes.forEach(e=>{ (e.ops||[]).forEach(op=>{
        if(op.t==='out'&&op.finOpId){ const f=finOps.find(x=>String(x.id)===String(op.finOpId)); if(f&&!f.envSpend){ f.envSpend=true; ch=true; } }
      });});
    }catch(_){}
    // міграція: старі операції без картки → розкласти за джерелами
    const workId=(cards.find(c=>c.type==='work')||cards[0]).id;
    const projId=(cards.find(c=>c.type==='project')||cards[0]).id;
    finOps.forEach(o=>{ if(!o.card && !o.envSpend){ o.card = o._autoSal?workId : (o.proj?projId : mainCard().id); ch=true; } });
    if(ch) saveFinOps();
    if(!cardCfg.sel || !cardById(cardCfg.sel)) cardCfg.sel=mainCard().id;
  }
  function pickCard(opts){
    ensureCards();
    const o=opts||{};
    actionSheet({ title:o.title||'Обери картку', sub:o.sub||'',
      items: cards.map(c=>({ ic:c.emoji||'💳', label:c.name, sub:fmt(cardBalance(c))+' '+cardSym(c)+(c.main?' · головна':''),
        onClick:()=>{ if(o.onPick) o.onPick(c); } }))
        .concat(o.allowNew===false?[]:[{ ic:'＋', label:'Нова картка', sub:'створити джерело доходу', onClick:()=>newCard(o.onPick) }])
    });
  }
  function newCard(after){
    inputModal({title:'Нова картка — назва', placeholder:'Напр. Фриланс', emoji:true, emojiVal:'💳', onOk:(name,em)=>{
      if(!(name||'').trim()) return;
      actionSheet({title:'Валюта картки', items:['UAH','EUR','USD','PLN'].map(cur=>({ ic:CUR[cur]||cur, label:cur, onClick:()=>{
        const c={ id:'card_'+Date.now(), name:name.trim(), emoji:(em!==undefined&&em?em:'💳'), type:'custom', cur, color:CARD_COLORS[cards.length%CARD_COLORS.length] };
        cards.push(c); cardCfg.sel=c.id; saveCards(); saveCardCfg();
        try{ renderIncome(); }catch(_){}
        if(typeof after==='function') after(c);
      }}))});
    }});
  }
  function cardSheet(id){
    const c=cardById(id); if(!c) return;
    actionSheet({ title:(c.emoji||'💳')+' '+c.name, sub:'Баланс: '+fmt(cardBalance(c))+' '+cardSym(c),
      items:[
        { ic:'✎', label:'Назва та емодзі', onClick:()=>inputModal({title:'Назва картки', value:c.name, emoji:true, emojiVal:c.emoji||'💳', onOk:(v,em)=>{ if((v||'').trim()) c.name=v.trim(); if(em!==undefined&&em) c.emoji=em; saveCards(); renderIncome(); try{renderFinance();}catch(_){} }}) },
        { ic:'🎨', label:'Колір картки', onClick:()=>actionSheet({title:'Колір', row:true, items:CARD_COLORS.map(col=>({ ic:'●', label:col, onClick:()=>{ c.color=col; saveCards(); renderIncome(); } }))}) },
        { ic:'💱', label:'Валюта: '+c.cur, onClick:()=>actionSheet({title:'Валюта картки', items:['UAH','EUR','USD','PLN'].map(cur=>({ ic:CUR[cur]||cur, label:cur, onClick:()=>{ c.cur=cur; saveCards(); renderIncome(); } }))}) },
        { ic:'⭐', label:c.main?'Головна картка ✓':'Зробити головною', sub:'сюди йдуть операції без картки', onClick:()=>{ cards.forEach(x=>x.main=false); c.main=true; saveCards(); renderIncome(); } },
        { ic:'⏱', label:(workCard().id===c.id?'Зарплата приходить сюди ✓':'Отримувати зарплату сюди'), sub:'синхрон із «Робота та зарплата»', onClick:()=>{ workCardId=c.id; try{ saveWork(); }catch(_){} renderIncome(); try{renderFinance();}catch(_){} } },
        { ic:'🗑', label:'Видалити картку', danger:true, sub:'операції перейдуть на головну', onClick:()=>{
          if(cards.length<=1){ flowAlert('Має лишитись хоча б одна картка.'); return; }
          confirmSheet({title:'Видалити «'+c.name+'»?', sub:'Операції перейдуть на головну картку.', onOk:()=>{
            cards=cards.filter(x=>x.id!==c.id);
            if(!cards.some(x=>x.main)) cards[0].main=true;
            const mid=mainCard().id; let ch=false;
            finOps.forEach(o=>{ if(String(o.card)===String(c.id)){ o.card=mid; ch=true; } });
            if(ch) saveFinOps();
            if(cardCfg.sel===c.id) cardCfg.sel=mid;
            saveCards(); saveCardCfg(); renderIncome(); try{renderFinance();}catch(_){}
          }});
        }}
      ]});
  }
  function cardTransfer(){
    ensureCards();
    if(cards.length<2){ flowAlert('Потрібні щонайменше дві картки для переказу.'); return; }
    const from=cardById(cardCfg.sel)||mainCard();
    pickCard({title:'Переказ з «'+from.name+'» — куди?', allowNew:false, onPick:(to)=>{
      if(to.id===from.id){ flowAlert('Обери іншу картку.'); return; }
      inputModal({title:'Сума переказу ('+cardSym(from)+')', placeholder:'Напр. 100', onOk:(v)=>{
        const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
        const date=ymdLocal(); const gid='tr_'+Date.now();
        finOps.push({ id:gid+'a', type:'out', amount:n, label:'Переказ → '+to.name, date, card:from.id, _tr:gid });
        finOps.push({ id:gid+'b', type:'in',  amount:n, label:'Переказ ← '+from.name, date, card:to.id, _tr:gid });
        saveFinOps(); renderIncome(); try{renderFinance();}catch(_){}
      }});
    }});
  }
  function cardFundEnvelope(){
    ensureCards();
    const c=cardById(cardCfg.sel)||mainCard();
    if(!envelopes.length){ flowAlert('Спершу створи конверт у Фінансах → ✉️ Конверти.'); return; }
    actionSheet({ title:'У який конверт?', sub:'Джерело: '+(c.emoji||'💳')+' '+c.name,
      items: envelopes.map(e=>{ const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
        return { ic:(e.emoji||'✉️'), label:e.name, sub:fmt(sv)+' / '+fmt(e.goal||0)+' · '+pct+'%', onClick:()=>{
          inputModal({title:'Скільки в «'+e.name+'»?', placeholder:'Сума', onOk:(v)=>{
            const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
            envAddOp(e,'in',n,'З картки: '+c.name,c.id); renderIncome(); try{renderFinance();}catch(_){}
          }});
        }};
      })});
  }
  /* ==== FX: курси валют (НБУ → er-api → офлайн), автооновлення раз на добу ==== */
  let fx={ base:'UAH', rates:{UAH:1,EUR:48.6,USD:41.6,PLN:11.4}, ts:0, src:'офлайн' };
  const FXKEY='fx_cfg';
  function saveFx(){ try{ const p=window.storage.set(FXKEY,JSON.stringify(fx),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function fxConv(amount, from, to){ const r=fx.rates||{}; const a=r[from]||1, b2=r[to]||1; return amount*a/b2; }
  function fxTotalIn(cur){ let t=0; try{ ensureCards(); cards.forEach(c=>{ t+=fxConv(cardBalance(c), c.cur||'UAH', cur); }); }catch(_){} return t; }
  async function fxUpdate(force){
    const DAY=24*3600*1000;
    if(!force && fx.ts && (Date.now()-fx.ts)<DAY) return false;
    try{
      const r=await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
      const d=await r.json();
      if(Array.isArray(d)&&d.length){
        const m={UAH:1};
        d.forEach(x=>{ if(x&&x.cc&&x.rate>0) m[x.cc]=x.rate; });
        if(m.EUR&&m.USD){ fx.rates=m; fx.ts=Date.now(); fx.src='НБУ'; saveFx(); return true; }
      }
    }catch(_){}
    try{
      const r=await fetch('https://open.er-api.com/v6/latest/UAH');
      const d=await r.json();
      if(d&&d.rates){ const m={UAH:1}; Object.keys(d.rates).forEach(k=>{ const v=d.rates[k]; if(v>0) m[k]=1/v; }); fx.rates=m; fx.ts=Date.now(); fx.src='er-api'; saveFx(); return true; }
    }catch(_){}
    return false;
  }
  function fxAgo(){ if(!fx.ts) return 'курс офлайн'; const h=Math.floor((Date.now()-fx.ts)/3600000); return h<1?'курс оновлено щойно':(h<24?('курс оновлено '+h+' год тому'):('курс оновлено '+Math.floor(h/24)+' дн тому')); }
  function openFxSheet(){
    const curs=['UAH','EUR','USD','PLN'];
    actionSheet({ title:'Валюта відображення балансу', sub:fxAgo()+' · джерело: '+(fx.src||'—'),
      items: curs.map(c=>({ ic:CUR[c]||c, label:c+(fx.base===c?' ✓':''), sub:c==='UAH'?'базова валюта':('1 '+c+' ≈ '+(Math.round((fx.rates[c]||0)*100)/100)+' ₴'),
        onClick:()=>{ fx.base=c; saveFx(); try{renderFinance();}catch(_){} try{renderIncome();}catch(_){} } }))
      .concat([{ ic:'🔄', label:'Оновити курс зараз', sub:'НБУ · автоматично раз на добу', onClick:()=>{
        fxUpdate(true).then(ok=>{ flowAlert(ok?('Курс оновлено · '+fx.src):'Не вдалося оновити — використовую збережений курс.'); try{renderFinance();}catch(_){} try{renderIncome();}catch(_){} });
      } }])
    });
  }

  /* ==== швидкі дії по картці (тап по вибраній) ==== */
  function cardQuickSheet(id){
    const c=cardById(id); if(!c) return;
    cardCfg.sel=c.id; saveCardCfg();
    actionSheet({ title:(c.emoji||'💳')+' '+c.name, sub:fmt(cardBalance(c))+' '+cardSym(c)+' · швидкі дії',
      items:[
        { ic:'＋', label:'Дохід на цю картку', primary:true, onClick:()=>addFinOpCard('in',c) },
        { ic:'−', label:'Витрата з цієї картки', onClick:()=>addFinOpCard('out',c) },
        { ic:'⇄', label:'Переказ на іншу картку', onClick:()=>cardTransfer() },
        { ic:'✉️', label:'У конверт з цієї картки', onClick:()=>cardFundEnvelope() },
        { ic:'⚙️', label:'Налаштування картки', onClick:()=>cardSheet(c.id) },
        { ic:'💳', label:'Всі картки та операції', onClick:()=>goIncome() }
      ]});
  }
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
  function goIncome(){ ensureCards(); renderIncome(); show('scr-income'); }
  function renderIncome(){
    const body=document.getElementById('incomeBody'); if(!body) return;
    ensureCards();
    const totals=cardsTotals(), curKeys=Object.keys(totals);
    const sel=cardById(cardCfg.sel)||mainCard();
    const ym=ymLocal();
    let wkPend=0, wkPendSym='', wkTargetId='';
    try{ const me0=workSessionsIn(ym).reduce((s,w)=>s+(+w.amount||0),0); if(me0>0 && workPostedSal[ym]!=='posted'){ wkPend=me0; wkPendSym=CUR[workCur]||workCur; wkTargetId=workCard().id; } }catch(_){}
    // очікується зарплата → на картку «Робота»
    let expHtml='';
    try{
      const me=workSessionsIn(ym).reduce((s,w)=>s+(+w.amount||0),0);
      if(me>0 && workPostedSal[ym]!=='posted'){
        const now=new Date(); const dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
        const pday=Math.min(Math.max(parseInt(workPayday)||dim,1),dim);
        const left=pday-now.getDate();
        const sym=CUR[workCur]||workCur;
        const wc=workCard();
        expHtml=`<div class="incx-exp"><span class="ic">⏳</span><div><b>Очікується зарплата · ${fmt(me)} ${sym}</b>
          <small>${String(pday).padStart(2,'0')}.${String(now.getMonth()+1).padStart(2,'0')} — зарахується на «${esc(wc.name)}»${left>0?' · через '+left+' дн':''}</small></div></div>`;
      }
    }catch(_){}
    // цей місяць за джерелами
    const mi=cards.map(c=>({c,v:cardMonthIn(c)}));
    const miTot=mi.reduce((s,x)=>s+x.v,0);
    const srcHtml = miTot>0 ? `<div class="fdash-sec"><span>Цей місяць за джерелами</span></div>
      <div class="incx-srcs">${mi.filter(x=>x.v>0).map(x=>{
        const pct=Math.max(2,Math.round(x.v/miTot*100));
        return `<div class="incx-src" style="--cc:${x.c.color||'#5b8def'}"><div class="r"><span>${x.c.emoji||'💳'} ${esc(x.c.name)}</span><b>+${fmt(x.v)} ${cardSym(x.c)} · ${Math.round(x.v/miTot*100)}%</b></div>
          <div class="bar"><i style="width:${pct}%"></i></div></div>`;
      }).join('')}</div>` : '';
    const opsAll=cardOps(sel), ops=opsAll.slice().reverse().slice(0,12);
    const dispCur=fx.base||'UAH';
    const heroVal=`<div data-fuzfx="1" style="cursor:pointer">${fmt(Math.round(fxTotalIn(dispCur)))} <small>${CUR[dispCur]||dispCur} ▾</small></div>`
      + (curKeys.length>1?`<div class="cur2">${curKeys.map(k=>fmt(totals[k])+' '+(CUR[k]||k)).join(' · ')}</div>`:`<div class="cur2">${fxAgo()}</div>`);
    body.innerHTML=`
      <div class="incx-hero"><div class="l">Загальний баланс · ${cards.length} карток</div>
        <div class="v">${heroVal}</div>
        <div class="incx-styles">${[[1,'Aurora'],[2,'Glass'],[3,'Carbon'],[4,'Minimal'],[5,'Neo']].map(([n,l])=>`<button class="${(cardCfg.style||1)===n?'on':''}" data-cstyle="${n}">${l}</button>`).join('')}</div>
      </div>
      <div class="incx-rail v${cardCfg.style||1}">
        ${cards.map(c=>{
          const bal=cardBalance(c), mIn=cardMonthIn(c);
          return `<div class="incx-card ${c.id===sel.id?'sel':''}" style="--cc:${c.color||'#5b8def'}" data-cardsel="${c.id}">
            <span class="incx-wm">${c.emoji||'💳'}</span>
            <div class="incx-top"><span class="incx-em">${c.emoji||'💳'}</span>
              <div class="incx-nm">${esc(c.name)}<s>${CARD_TYPES[c.type]||'Картка'}${c.main?' · головна':''}</s></div>
              <button class="incx-menu" data-cardmenu="${c.id}">⋯</button></div>
            <div class="incx-mid"><span class="incx-chip"></span>
              <svg class="incx-nfc" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9a9 9 0 0 1 0 6"/><path d="M10 6.5a13 13 0 0 1 0 11"/><path d="M14 4a17 17 0 0 1 0 16"/></svg></div>
            <div class="incx-bal">${fmt(bal)} <small>${cardSym(c)}</small></div>
            <div class="incx-bot"><span class="incx-num">•••• ${cardNum(c)}</span><span class="incx-mo">${c.id===wkTargetId&&wkPend>0?'⏳ +'+fmt(wkPend)+' '+wkPendSym+' очік.':(mIn>0?'+'+fmt(mIn)+' за міс':'— за міс')}</span></div>
          </div>`;
        }).join('')}
        <div class="incx-addc" data-cardnew="1"><span>＋</span>Нова</div>
      </div>
      <div class="incx-hint">← гортай картки · тап — вибрати · ⋯ — налаштування</div>
      <div class="incx-acts">
        <button class="pri" data-incact="in"><i>＋</i>Дохід</button>
        <button data-incact="out"><i>−</i>Витрата</button>
        <button data-incact="tr"><i>⇄</i>Переказ</button>
        <button data-incact="env"><i>✉️</i>У конверт</button>
      </div>
      ${expHtml}
      ${srcHtml}
      <div class="fdash-sec"><span>Операції · ${esc(sel.name)} (${opsAll.length})</span></div>
      ${ops.length? ops.map(o=>`<div class="fin-op" data-incdel="${o.id}">
        <span><svg class="fin-ico" style="color:${o.type==='in'?'var(--hab)':'var(--fin)'}"><use href="#${o.type==='in'?'fi-up':'fi-down'}"/></svg> ${esc(o.label||'Операція')}${o.env?' ✉️':''}</span>
        <b style="color:${o.type==='in'?'var(--hab)':'var(--fin)'}">${o.type==='in'?'+':'−'}${fmt(o.amount)}</b></div>`).join('')
        : `<div class="fh-empty">На цій картці ще немає операцій. Додай перший дохід ↑</div>`}`;
    body.querySelectorAll('[data-cstyle]').forEach(b=>b.onclick=()=>{ cardCfg.style=+b.dataset.cstyle; saveCardCfg(); renderIncome(); });
    body.querySelectorAll('[data-cardsel]').forEach(el=>el.onclick=()=>{ if(String(cardCfg.sel)===String(el.dataset.cardsel)){ cardQuickSheet(el.dataset.cardsel); } else { cardCfg.sel=el.dataset.cardsel; saveCardCfg(); renderIncome(); } });
    body.querySelectorAll('[data-fuzfx]').forEach(el=>el.onclick=()=>openFxSheet());
    body.querySelectorAll('[data-cardmenu]').forEach(b=>b.onclick=(ev)=>{ ev.stopPropagation(); cardSheet(b.dataset.cardmenu); });
    const nc=body.querySelector('[data-cardnew]'); if(nc) nc.onclick=()=>newCard();
    body.querySelectorAll('[data-incact]').forEach(b=>b.onclick=()=>{
      const a=b.dataset.incact, c=cardById(cardCfg.sel)||mainCard();
      if(a==='in') addFinOpCard('in',c);
      else if(a==='out') addFinOpCard('out',c);
      else if(a==='tr') cardTransfer();
      else if(a==='env') cardFundEnvelope();
    });
    body.querySelectorAll('[data-incdel]').forEach(el=>el.onclick=()=>{
      confirmSheet({title:'Видалити операцію?', onOk:()=>{ finOps=finOps.filter(o=>String(o.id)!==String(el.dataset.incdel)); saveFinOps(); renderIncome(); try{renderFinance();}catch(_){} }});
    });
  }
  let workCardId=''; // куди приходить зарплата (обирається в меню картки)
  function workCard(){ return cardById(workCardId)||cards.find(c=>c.type==='work')||mainCard(); }

  /* ============ АНАЛІТИКА · ріст і спад ============ */
  const ANA_M=['Січ','Лют','Бер','Кві','Тра','Чер','Лип','Сер','Вер','Жов','Лис','Гру'];
  function _isRealExpense(o){ return o.type==='out' && !o._tr && !(o.envId && !o.envSpend); }
  function _isRealIncome(o){ return o.type==='in' && !o._tr; }
  function lastMonths(n){ const a=[]; const now=new Date(); for(let i=n-1;i>=0;i--){ const x=new Date(now.getFullYear(),now.getMonth()-i,1); a.push(x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')); } return a; }
  function monthAgg(ym){ let inn=0,out=0; finOps.forEach(o=>{ if(String(o.date||'').slice(0,7)!==ym) return; if(_isRealIncome(o)) inn+=o.amount; else if(_isRealExpense(o)) out+=o.amount; }); return {in:inn,out}; }
  function goAnalytics(){ renderAnalytics(); show('scr-analytics'); }
  function renderAnalytics(){
    const body=document.getElementById('analyticsBody'); if(!body) return;
    ensureCards();
    const mss=lastMonths(6).map(ym=>Object.assign({ym},monthAgg(ym)));
    const mx=Math.max(1,...mss.map(m=>Math.max(m.in,m.out)));
    const cur=mss[mss.length-1], prev=mss[mss.length-2]||{in:0,out:0};
    const net=cur.in-cur.out, netPrev=prev.in-prev.out;
    const dIn=cur.in-prev.in, dOut=cur.out-prev.out, dNet=net-netPrev;
    const arrow=(d,goodUp)=>{ const up=d>0, good=goodUp?up:!up; return `<b class="${good?'ana-up':'ana-dn'}">${up?'▲':(d<0?'▼':'•')} ${d>=0?'+':''}${fmt(d)}</b>`; };
    const ymC=cur.ym, ymP=prev.ym;
    const cardIn=(c,ym)=>cardOps(c).filter(o=>_isRealIncome(o)&&String(o.date||'').slice(0,7)===ym).reduce((s,o)=>s+o.amount,0);
    let movers=[];
    cards.forEach(c=>{ const a=cardIn(c,ymC), b2=cardIn(c,ymP); if(a||b2) movers.push({name:(c.emoji||'💳')+' '+esc(c.name), d:a-b2, goodUp:true, sym:cardSym(c)}); });
    try{
      const cs={}, ps={};
      finOps.forEach(o=>{ if(o.type!=='out'||!o.cat) return; const ym=String(o.date||'').slice(0,7); const k=(CATS[o.cat]||CATS.other).name; if(ym===ymC) cs[k]=(cs[k]||0)+o.amount; if(ym===ymP) ps[k]=(ps[k]||0)+o.amount; });
      Object.keys(Object.assign({},cs,ps)).forEach(k=>{ const d=(cs[k]||0)-(ps[k]||0); if(d) movers.push({name:'🧾 '+esc(k), d, goodUp:false, sym:'₴'}); });
    }catch(_){}
    movers.sort((x,y)=>Math.abs(y.d)-Math.abs(x.d)); movers=movers.slice(0,7);
    body.innerHTML=`
      <div class="incx-hero"><div class="l">Чистий результат · цей місяць</div>
        <div class="v" style="color:${net>=0?'var(--hab)':'#ff5a5f'}">${net>=0?'+':''}${fmt(net)}</div>
        <div style="font-size:12px;color:#8b93a3;margin-top:4px">минулого місяця: ${netPrev>=0?'+':''}${fmt(netPrev)} · зміна ${dNet>=0?'+':''}${fmt(dNet)}</div>
      </div>
      <div class="fdash-sec"><span>Дохід vs витрати · 6 місяців</span></div>
      <div class="ana-chart">${mss.map(m=>{
        const hi=Math.max(3,Math.round(m.in/mx*100)), ho=Math.max(3,Math.round(m.out/mx*100));
        const mi2=parseInt(m.ym.slice(5,7),10)-1;
        return `<div class="ana-col"><div class="bars"><i class="bin" style="height:${hi}%"></i><i class="bout" style="height:${ho}%"></i></div><s>${ANA_M[mi2]}</s></div>`;
      }).join('')}</div>
      <div class="ana-leg"><span><i class="bin"></i>Дохід</span><span><i class="bout"></i>Витрати</span></div>
      <div class="fdash-sec"><span>Ріст і спад · vs минулий місяць</span></div>
      <div class="ana-row"><span>📥 Дохід</span>${arrow(dIn,true)}</div>
      <div class="ana-row"><span>📤 Витрати</span>${arrow(dOut,false)}</div>
      ${movers.map(m=>`<div class="ana-row"><span>${m.name}</span>${arrow(m.d,m.goodUp)}</div>`).join('')}
      ${movers.length?'':'<div class="fh-empty">Замало даних — додай операції за два місяці, і тут зʼявиться порівняння.</div>'}`;
  }
  { const b=document.getElementById('analyticsBack'); if(b) b.onclick=()=>goFinance(); }

  /* ============ МОЯ ФІНАНСОВА ГРАМОТНІСТЬ ============ */
  let finlit={done:[],hist:{}}; const FINLITKEY='finlit_state';
  function saveFinlit(){ try{ const p=window.storage.set(FINLITKEY,JSON.stringify(finlit),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  const LIT_LESSONS=[
    {id:'l1', t:'Правило 50/30/20', d:'50% — потреби, 30% — бажання, 20% — заощадження. Перевір свої конверти за цією пропорцією.'},
    {id:'l2', t:'Подушка безпеки', d:'3–6 місячних витрат у окремому конверті. Це свобода казати «ні» поганій роботі.'},
    {id:'l3', t:'Плати собі першому', d:'Щойно прийшла зарплата — спершу конверти, потім витрати. Не навпаки.'},
    {id:'l4', t:'Метод конвертів', d:'Кожна гривня має призначення до того, як її витрачено. Ти вже це робиш у Frequency 😉'},
    {id:'l5', t:'Найдорожчі борги — першими', d:'Гаси спочатку борги з найбільшою «ціною» (відсотком чи стресом).'},
    {id:'l6', t:'30 днів обліку', d:'Один місяць запису кожної витрати змінює звички сильніше за будь-яку книгу.'},
    {id:'l7', t:'Фінансова ціль = число + дата', d:'Не «хочу накопичити», а «20 000 ₴ до 1 грудня». Конверт із ціллю — це воно.'},
    {id:'l8', t:'Валюта й інфляція', d:'Тримай подушку в стабільній валюті. Гроші «під матрацом» щороку тануть.'},
    {id:'l9', t:'Автоматизуй заощадження', d:'Регулярний платіж собі — найнадійніший. План місяця у Frequency = твоя автоматизація.'},
    {id:'l10',t:'Інвестиції — після подушки', d:'Спершу резерв і нуль дорогих боргів, потім інвестуй те, що не страшно заморозити.'}
  ];
  function finlitScore(){
    const ym=ymLocal();
    let inn=0, fund=0, opsN=0;
    finOps.forEach(o=>{ if(String(o.date||'').slice(0,7)!==ym) return; opsN++; if(_isRealIncome(o)) inn+=o.amount; if(o.envId&&!o.envSpend&&o.type==='out') fund+=o.amount; });
    const parts=[];
    const rate=inn>0?fund/inn:0;
    parts.push({name:'Норма заощаджень', pts:Math.min(30,Math.round(rate/0.2*30)), max:30, hint:inn>0?Math.round(rate*100)+'% доходу йде в конверти (ціль 20%+)':'додай дохід цього місяця'});
    parts.push({name:'Регулярність обліку', pts:Math.min(20,opsN*2), max:20, hint:opsN+' операцій цього місяця'});
    let owe=0; try{ items.forEach(i=>{ if(i.kind==='owe'){ const b=balance(i); if(b>0) owe+=b; } }); }catch(_){}
    parts.push({name:'Контроль боргів', pts:owe===0?20:(inn>0&&owe<inn?10:4), max:20, hint:owe===0?'боргів немає 💪':'є активні борги — тримай план погашення'});
    let cushion=0; try{ envelopes.forEach(e=>{ if(/подуш|резерв|безпек|emerg/i.test((e.name||'')+' '+(e.emoji||''))) cushion+=envSaved(e); }); }catch(_){}
    const avgOut=(lastMonths(3).reduce((s,m)=>s+monthAgg(m).out,0)/3)||0;
    const monthsCov=avgOut>0?cushion/avgOut:(cushion>0?3:0);
    parts.push({name:'Подушка безпеки', pts:Math.min(20,Math.round(monthsCov/3*20)), max:20, hint:cushion>0?fmt(cushion)+' ₴ ≈ '+(Math.round(monthsCov*10)/10)+' міс витрат':'створи конверт «Подушка»'});
    parts.push({name:'Стабільний дохід', pts:inn>0?10:0, max:10, hint:inn>0?'дохід цього місяця є':'запиши дохід на картку'});
    const total=parts.reduce((s,x)=>s+x.pts,0);
    return {total, parts};
  }
  function finlitScoreSafe(){ try{ return finlitScore().total; }catch(_){ return 0; } }
  function goFinlit(){ renderFinlit(); show('scr-finlit'); }
  function litStreak(){
    const days=new Set();
    finOps.forEach(o=>{ if(o.date) days.add(String(o.date).slice(0,10)); });
    let n=0; const d=new Date();
    for(;;){ const k=ymdLocal(d); if(days.has(k)){ n++; d.setDate(d.getDate()-1); } else break; }
    return n;
  }
  function renderFinlit(){
    const body=document.getElementById('finlitBody'); if(!body) return;
    const sc=finlitScore();
    const ym=ymLocal();
    if(!finlit.hist) finlit.hist={};
    if(finlit.hist[ym]!==sc.total){ finlit.hist[ym]=sc.total; saveFinlit(); }
    const R=44, C=2*Math.PI*R, off=C*(1-sc.total/100);
    const tip=LIT_LESSONS[new Date().getDate()%LIT_LESSONS.length];
    const LV=[[0,'Початок шляху',30],[30,'Хороший старт',55],[55,'Впевнений рівень',80],[80,'Профі 🏆',100]];
    let lvl=LV[0]; LV.forEach(l=>{ if(sc.total>=l[0]) lvl=l; });
    const toNext=Math.max(0,lvl[2]-sc.total);
    const lvPct=Math.min(100,Math.round((sc.total-lvl[0])/Math.max(1,(lvl[2]-lvl[0]))*100));
    const streak=litStreak();
    const ACT={'Норма заощаджень':{t:'Відклади частину доходу в конверт',b:'✉️',a:'env'},
      'Регулярність обліку':{t:'Запиши сьогоднішні витрати',b:'−',a:'out'},
      'Контроль боргів':{t:'Перевір борги і план погашення',b:'🤝',a:'debts'},
      'Подушка безпеки':{t:'Створи або поповни конверт «Подушка»',b:'🛡',a:'cushion'},
      'Стабільний дохід':{t:'Запиши дохід на картку',b:'＋',a:'in'}};
    const recs=sc.parts.slice().sort((a,b2)=>(a.pts/a.max)-(b2.pts/b2.max)).filter(pp=>pp.pts<pp.max).slice(0,3);
    const hms=lastMonths(6);
    body.innerHTML=`
      <div class="lit-hero">
        <svg class="lit-ring" width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="${R}" fill="none" stroke="#1e2230" stroke-width="10"/>
          <circle cx="55" cy="55" r="${R}" fill="none" stroke="#f0b429" stroke-width="10" stroke-linecap="round"
            stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90 55 55)"/>
          <text x="55" y="52" text-anchor="middle" fill="#e9edf6" font-size="24" font-weight="800">${sc.total}</text>
          <text x="55" y="70" text-anchor="middle" fill="#8b93a3" font-size="10">із 100</text>
        </svg>
        <div style="min-width:0;flex:1"><div class="lit-lvl">${lvl[1]}</div>
          <div class="lit-next"><div class="bar"><i style="width:${lvPct}%"></i></div>
            <small>${toNext>0?'+'+toNext+' балів до наступного рівня':'максимальний рівень — тримай планку'}</small></div>
          <div class="lit-chips"><span class="chip">🔥 Серія обліку: ${streak} ${streak===1?'день':(streak>=2&&streak<=4?'дні':'днів')}</span></div>
        </div>
      </div>
      ${recs.length?`<div class="fdash-sec"><span>Що зробити зараз</span></div>`+recs.map(pp=>{ const a=ACT[pp.name]||{};
        return `<div class="lit-act"><div style="min-width:0"><b>${a.t||pp.name}</b><small>${pp.name} · ${pp.pts}/${pp.max} балів</small></div><button data-litact="${a.a||''}">${a.b||'→'}</button></div>`; }).join(''):''}
      <div class="fdash-sec"><span>Динаміка рейтингу · 6 міс</span></div>
      <div class="lit-hist">${hms.map(m=>{ const v=(finlit.hist&&finlit.hist[m]!=null)?finlit.hist[m]:null; const mi2=parseInt(m.slice(5,7),10)-1;
        return `<div class="c"><div class="bw"><i style="height:${v==null?0:Math.max(4,v)}%"></i></div><s>${ANA_M[mi2]}</s><b>${v==null?'·':v}</b></div>`; }).join('')}</div>
      <div class="fdash-sec"><span>З чого складається</span></div>
      ${sc.parts.map(pp=>`<div class="lit-part"><div class="r"><span>${pp.name}</span><b>${pp.pts} / ${pp.max}</b></div>
        <div class="bar"><i style="width:${Math.round(pp.pts/pp.max*100)}%"></i></div><small>${pp.hint}</small></div>`).join('')}
      <div class="incx-exp" style="border-left-color:#f0b429"><span class="ic">💡</span><div><b>Порада дня: ${tip.t}</b><small>${tip.d}</small></div></div>
      <div class="fdash-sec"><span>Мікроуроки · ${finlit.done.length}/${LIT_LESSONS.length}</span></div>
      ${LIT_LESSONS.map(L=>{ const dn=finlit.done.includes(L.id);
        return `<div class="lit-lesson ${dn?'done':''}" data-lit="${L.id}"><span class="ck">${dn?'✓':''}</span>
          <div><b>${L.t}</b><small>${L.d}</small></div></div>`; }).join('')}`;
    body.querySelectorAll('[data-lit]').forEach(el=>el.onclick=()=>{
      const id=el.dataset.lit;
      finlit.done = finlit.done.includes(id) ? finlit.done.filter(x=>x!==id) : finlit.done.concat([id]);
      saveFinlit(); renderFinlit();
    });
    body.querySelectorAll('[data-litact]').forEach(b=>b.onclick=()=>{
      const a=b.dataset.litact;
      if(a==='env') cardFundEnvelope();
      else if(a==='out') addFinOp('out');
      else if(a==='in') addFinOp('in');
      else if(a==='debts') goDebts();
      else if(a==='cushion'){ const e=envelopes.find(x=>/подуш|резерв|безпек/i.test(x.name||'')); if(e) openEnvSheet(e.id); else newEnvelope(); }
    });
  }
  { const b=document.getElementById('finlitBack'); if(b) b.onclick=()=>goFinance(); }
  function planMonthTs(){ try{ const ym=ymLocal(); const x=workPlannedTotal(ym); return x>0?fmt(x)+' розподілено':'розклади дохід по конвертах'; }catch(_){ return 'план по конвертах'; } }

  { const b=document.getElementById('incomeBack'); if(b) b.onclick=()=>goFinance(); }

  let finTab='overview'; // legacy (kept for compatibility)
  let finView='dash'; // 'dash' | 'envelopes'
  function finIncome(){ return finOps.filter(o=>o.type==='in').reduce((s,o)=>s+o.amount,0); }
  function finExpense(){ return finOps.filter(o=>o.type==='out').reduce((s,o)=>s+o.amount,0); }
  function finBalance(){ return finOps.reduce((s,o)=>s+(o.type==='in'?o.amount:(o.envSpend?0:-o.amount)),0); }
  function recTotal(){ return recurring.reduce((s,r)=>s+(r.amount||0),0); }

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
    document.getElementById('finSub').textContent='фінансовий центр';
    if(finView==='envelopes'){ renderEnvScreen(body); return; }
    renderFinDash(body);
  }

  // 7-day expense sparkline data from finOps
  function finSpark(){
    const today=new Date(); const days=[];
    for(let i=6;i>=0;i--){ const d=new Date(today); d.setDate(d.getDate()-i); days.push(d.toISOString().slice(0,10)); }
    const byDay={}; days.forEach(d=>byDay[d]=0);
    finOps.forEach(o=>{ if(o.type==='out' && byDay[o.date]!==undefined) byDay[o.date]+=o.amount; });
    return days.map(d=>byDay[d]);
  }
  function finSpark7Total(){ return finSpark().reduce((s,v)=>s+v,0); }

  // nearest recurring payment (simple: first recurring)
  function nearestPay(){
    if(!recurring.length) return null;
    return recurring[0];
  }
  // top spend category
  function topCat(){
    const cats={};
    finOps.filter(o=>o.type==='out'&&!o.env).forEach(o=>{
      const nm=(o.cat&&CATS[o.cat])?CATS[o.cat].name:'Інше';
      cats[nm]=(cats[nm]||0)+o.amount;
    });
    const e=Object.entries(cats).sort((a,b)=>b[1]-a[1])[0];
    return e?{name:e[0],amount:e[1]}:null;
  }

  // ── «Вільно до зарплати» + «Вільний від боргу» — два числа, що ведуть ──
  // ── денна норма: єдине джерело правди ──
  function finNorm(){
    const base=fx.base||'UAH', sym=CUR[base]||base;
    const now=new Date(), ym=ymLocal(now);
    const dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
    const pd=Math.min(Math.max(parseInt(workPayday)||dim,1),dim);
    let payDate=new Date(now.getFullYear(),now.getMonth(),pd);
    if(now.getDate()>pd){
      const dimN=new Date(now.getFullYear(),now.getMonth()+2,0).getDate();
      payDate=new Date(now.getFullYear(),now.getMonth()+1,Math.min(parseInt(workPayday)||dimN,dimN));
    }
    const today0=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const daysLeft=Math.max(0,Math.round((payDate-today0)/86400000));
    let pending=0;
    try{ recurring.forEach(r=>{ const d=recDayOf(r); if(!d||!(r.amount>0)) return;
      if(r.lastYM===ym) return; if(d>=now.getDate()) pending+=r.amount; }); }catch(_){}
    pending=Math.round(pending);
    const free=Math.round(fxTotalIn(base))-pending;
    const perDay=daysLeft>0?Math.round(Math.max(0,free)/daysLeft):0;
    return {base,sym,free,pending,daysLeft,perDay,payDate};
  }

  // ── 7 днів vs норма ──
  function finWeekHTML(){
    try{
      const n=finNorm(), sp=finSpark();
      if(!(n.perDay>0)){
        if(!sp.some(v=>v>0)) return '';
        const mx=Math.max(1,...sp);
        return `<div class="fwk"><div class="fwk-h"><span>Останні 7 днів</span>
          <span class="lnk" data-fdash="work">вкажи день зарплати ›</span></div>
          <div class="fwk-plot">${sp.map((v,i)=>`<div class="fwk-d"><i class="${i===6?'now':'ok'}" style="height:${Math.max(3,Math.round(v/mx*100))}%"></i><span>·</span></div>`).join('')}</div></div>`;
      }
      const today=sp[6]||0;
      const left=Math.max(0,n.perDay-today);
      const ok=sp.filter(v=>v<=n.perDay).length;
      const peak=Math.max(n.perDay*1.35,...sp,1);
      const D=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'], wd=new Date().getDay(), labs=[];
      for(let i=6;i>=0;i--){ const k=(wd-i+7)%7; labs.push(D[(k+6)%7]); }
      return `<div class="fwk">
        <div class="fwk-h"><span>Останні 7 днів</span>
          <span class="lnk" data-fdash="analytics">норма ${fmt(n.perDay)} ${n.sym} ›</span></div>
        <div class="fwk-plot"><div class="fwk-norm" style="bottom:${Math.round(n.perDay/peak*100)}%"></div>
          ${sp.map((v,i)=>{
            const h=Math.max(3,Math.round(v/peak*100));
            const cls=i===6?'now':(v>n.perDay?'hi':'ok');
            return `<div class="fwk-d"><i class="${cls}" style="height:${h}%"></i><span>${labs[i]}</span></div>`;
          }).join('')}
        </div>
        <div class="fwk-sum">
          <div><b>${fmt(today)} ${n.sym}</b><span>сьогодні</span></div>
          <div><b>${fmt(left)} ${n.sym}</b><span>ще можна</span></div>
          <div><b>${ok} з 7</b><span>днів у нормі</span></div>
        </div></div>`;
    }catch(e){ console.error('finWeek',e); return ''; }
  }

  function finTopCats(lim){
    const ym=ymLocal(), acc={};
    finOps.forEach(o=>{
      if(o.type!=='out') return;
      if(String(o.date||'').slice(0,7)!==ym) return;
      let nm='Інше', em='📦', col='#8b93a3';
      if(o.env){ const e=envelopes.find(x=>String(x.id)===String(o.env));
        nm=(e&&e.name)||'Конверт'; em=(e&&e.emoji)||'✉️'; col=(e&&e.color)||'#c77dff'; }
      else if(o.cat&&CATS[o.cat]){ nm=CATS[o.cat].name; em=CATS[o.cat].emoji; col=CATS[o.cat].color; }
      if(!acc[nm]) acc[nm]={name:nm,emoji:em,color:col,amount:0};
      acc[nm].amount+=o.amount;
    });
    return Object.values(acc).sort((a,b)=>b.amount-a.amount).slice(0,lim||3);
  }

  function finTopCatsHTML(){
    const t=finTopCats(3); if(!t.length) return '';
    const mx=Math.max(1,...t.map(x=>x.amount));
    const sym=CUR[fx.base||'UAH']||'₴';
    return `<div class="fuz-sec"><span>Куди йде найбільше</span>
        <span class="lnk" data-fdash="spend">історія ›</span></div>
      <div class="fwk-cats">${t.map(c=>`<div class="fwk-cat" data-fdash="spend">
        <span class="e">${c.emoji}</span>
        <div class="b"><div class="n">${esc(c.name)}</div>
          <div class="ln"><i style="width:${Math.max(4,Math.round(c.amount/mx*100))}%;background:${c.color}"></i></div></div>
        <b>${fmt(c.amount)} ${sym}</b></div>`).join('')}</div>`;
  }

  function finFreedomHTML(){
    try{
      const _n=finNorm();
      const base=_n.base, sym=_n.sym, daysLeft=_n.daysLeft, pending=_n.pending;
      const free=_n.free, perDay=_n.perDay, payDate=_n.payDate, now=new Date();
      // борг: усі валюти → базова
      let owe=0;
      try{ const t=debtTotals(); Object.keys(t).forEach(c=>{ owe+=fxConv(t[c].owe||0,c,base); }); }catch(_){}
      owe=Math.round(owe);
      let debtHtml='';
      if(owe>0){
        const plan=Math.round(parseFloat(localStorage.getItem('debt_plan_m'))||0);
        if(plan>0){
          const months=Math.max(1,Math.ceil(owe/plan));
          const d2=new Date(now.getFullYear(),now.getMonth()+months,1);
          const MN=['січень','лютий','березень','квітень','травень','червень','липень','серпень','вересень','жовтень','листопад','грудень'];
          debtHtml=`<div class="fuz-free-half debt" data-debtplan="1"><span class="l">🕊 Вільний від боргу</span>
            <b>${MN[d2.getMonth()]} ${d2.getFullYear()}</b>
            <small>−${fmt(plan)} ${sym}/міс · лишилось ${fmt(owe)} ${sym} · тап — змінити</small></div>`;
        } else {
          debtHtml=`<div class="fuz-free-half debt" data-debtplan="1"><span class="l">🕊 Вільний від боргу</span>
            <b>коли?</b>
            <small>борг ${fmt(owe)} ${sym} · тапни і вкажи платіж/міс — побачиш дату</small></div>`;
        }
      }
      return `<div class="fuz-free">
        <div class="fuz-free-half" data-fuznext="1"><span class="l">Вільно до зарплати</span>
          <b>${fmt(free)} ${sym}</b>
          <small>${daysLeft} дн до ${String(payDate.getDate()).padStart(2,'0')}.${String(payDate.getMonth()+1).padStart(2,'0')}${pending>0?' · мінус регулярка '+fmt(pending)+' '+sym:''}${perDay>0?' · ~'+fmt(perDay)+'/день':''}</small></div>
        ${debtHtml}
      </div>`;
    }catch(e){ console.error('finFreedom',e); return ''; }
  }

  function renderFinDash(body){
    ensureCards();
    const income=finIncome(), expense=finExpense();
    const saved=envelopes.reduce((s,e)=>s+(envSaved(e)),0);
    const goalSum=envelopes.reduce((s,e)=>s+(+e.goal||0),0);
    const spark=finSpark(), spark7=finSpark7Total();
    const smax=Math.max(1,...spark);
    let wkMonth=[], wkEarn=0, wkSym='₴';
    try{ const ym=(new Date()).toISOString().slice(0,7); wkMonth=workSessionsIn(ym); wkEarn=wkMonth.reduce((s,w)=>s+(+w.amount||0),0); wkSym=CUR[workCur]||workCur; }catch(_){}
    const envPct=goalSum?Math.round(saved/goalSum*100):0;
    const ops=finOps.slice().reverse().slice(0,6);
    const totals=cardsTotals(), curKeys=Object.keys(totals);
    const ymNow=ymLocal();
    let wkPend=0, wkTargetId='';
    try{ if(wkEarn>0 && workPostedSal[ymNow]!=='posted'){ wkPend=wkEarn; wkTargetId=workCard().id; } }catch(_){}
    const lit=finlitScoreSafe();
    let mss=[]; try{ mss=lastMonths(6).map(ym=>monthAgg(ym)); }catch(_){}
    const mmax=Math.max(1,...mss.map(m=>Math.max(m.in,m.out)));
    const curM=mss[mss.length-1]||{in:0,out:0}, prevM=mss[mss.length-2]||{in:0,out:0};
    const dNet=(curM.in-curM.out)-(prevM.in-prevM.out);
    let nextHtml='';
    try{
      recAutoPost();
      const bits=[];
      if(wkPend>0){
        const now2=new Date(); const dim=new Date(now2.getFullYear(),now2.getMonth()+1,0).getDate();
        const pd=Math.min(Math.max(parseInt(workPayday)||dim,1),dim);
        bits.push('ЗП +'+fmt(wkPend)+' '+wkSym+' · '+String(pd).padStart(2,'0')+'.'+ymNow.slice(5,7)+' → '+esc(workCard().name));
      }
      nextRecurring(2).forEach(x=>{ bits.push(esc(x.r.name)+' −'+fmt(x.r.amount)+' ₴ · '+String(x.dt.getDate()).padStart(2,'0')+'.'+String(x.dt.getMonth()+1).padStart(2,'0')); });
      const noDay=recurring.some(r=>!recDayOf(r)&&r.amount>0);
      if(bits.length||recurring.length){
        nextHtml=`<div class="incx-exp" data-fuznext="1" style="margin:2px 0 12px;cursor:pointer"><span class="ic">⏳</span><div><b>Найближче</b><small>${bits.length?bits.join('  ·  '):'встанови дні списання — і регулярні працюватимуть самі'}${(noDay&&bits.length)?'  ·  ⚠️ є платежі без дня':''}</small></div></div>`;
      }
    }catch(_){}
    const R=44, Ci=2*Math.PI*R;
    const dispCur=fx.base||'UAH';
    const headTotal=fmt(Math.round(fxTotalIn(dispCur)))+' '+(CUR[dispCur]||dispCur);
    const headSub=(curKeys.length>1?curKeys.map(k=>fmt(totals[k])+' '+(CUR[k]||k)).join(' · ')+' · ':'')+fxAgo();

    body.innerHTML=`
      <div class="fuz-head">
        <div data-fuzfx="1" style="cursor:pointer"><div class="fuz-lab">Гроші · ${cards.length} карток</div><div class="fuz-total">${headTotal} <u>▾</u></div>
          <div class="fuz-sub">${headSub}</div></div>
        <button class="fuz-lit" data-fdash="finlit">🎓 ${lit}</button>
      </div>
      ${finFreedomHTML()}
      <div class="fusion-pager" id="fuzPager">
        <div class="fusion-page">
          <div class="incx-rail fuz-cards v${cardCfg.style||1}">
            ${cards.map(c=>{
              const bal2=cardBalance(c), mIn=cardMonthIn(c);
              return `<div class="incx-card" style="--cc:${c.color||'#5b8def'}" data-fuzcard="${c.id}">
                <span class="incx-wm">${c.emoji||'💳'}</span>
                <div class="incx-top"><span class="incx-em">${c.emoji||'💳'}</span>
                  <div class="incx-nm">${esc(c.name)}<s>${CARD_TYPES[c.type]||'Картка'}${c.main?' · головна':''}</s></div></div>
                <div class="incx-bal">${fmt(bal2)} <small>${cardSym(c)}</small></div>
                <div class="incx-bot"><span class="incx-num">•••• ${cardNum(c)}</span><span class="incx-mo">${c.id===wkTargetId&&wkPend>0?'⏳ +'+fmt(wkPend)+' '+wkSym+' очік.':(mIn>0?'+'+fmt(mIn)+' за міс':'—')}</span></div>
              </div>`;
            }).join('')}
            <div class="fuz-all" data-fdash="income"><span style="font-size:20px">💳</span>Всі картки ›</div>
          </div>
          <div class="incx-acts">
            <button class="pri" data-finop="in"><i>＋</i>Дохід</button>
            <button data-finop="out"><i>−</i>Витрата</button>
            <button data-fuzact="tr"><i>⇄</i>Переказ</button>
            <button data-fuzact="env"><i>✉️</i>У конверт</button>
          </div>
          ${finWeekHTML()}
          ${nextHtml}
          ${finTopCatsHTML()}
          <div class="fuz-sec"><span>Конверти · ${fmt(saved)} ₴${goalSum?' · '+envPct+'%':''}</span><span class="lnk" data-fdash="plan">🗓 план місяця ›</span></div>
          <div class="fhx-rail" style="margin:0">
            ${envelopes.map(e=>{
              const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
              const col=e.color||'#5b8def';
              return `<div class="fhx-ec" data-envopen="${e.id}">
                <div class="fhx-w" data-fhxfill="${pct}" style="background:${col}"></div>
                <div class="fhx-t">${e.emoji||'✉️'}<span class="fhx-p">${pct}%</span></div>
                <div class="fhx-n">${esc(e.name)}</div>
                <div class="fhx-a">${fmt(sv)} <small>/ ${e.goal?fmt(e.goal):'—'}</small></div>
              </div>`;
            }).join('')}
            <div class="fhx-ec fhx-add" data-fdash="newenv"><span>＋</span>Новий</div>
          </div>
          <div class="fuz-bento">
            <div class="fuz-b" data-fdash="analytics"><b>📈 Аналітика</b>
              <div class="fuz-bars">${mss.map(m=>`<i style="height:${Math.max(4,Math.round(m.in/mmax*100))}%"></i><i class="o" style="height:${Math.max(4,Math.round(m.out/mmax*100))}%"></i>`).join('')}</div>
              <s>чистий ${dNet>=0?'▲ +':'▼ '}${fmt(dNet)} до мин. міс</s></div>
            <div class="fuz-b fuz-ring" data-fdash="finlit">
              <svg width="58" height="58" viewBox="0 0 110 110"><circle cx="55" cy="55" r="${R}" fill="none" stroke="#1e2230" stroke-width="11"/><circle cx="55" cy="55" r="${R}" fill="none" stroke="#f0b429" stroke-width="11" stroke-linecap="round" stroke-dasharray="${Ci}" stroke-dashoffset="${Ci*(1-lit/100)}" transform="rotate(-90 55 55)"/><text x="55" y="63" text-anchor="middle" fill="#e9edf6" font-size="26" font-weight="800">${lit}</text></svg>
              <b>Грамотність</b></div>
          </div>
        </div>
        <div class="fusion-page">
          <div class="fuz-sec"><span>Інструменти</span><span></span></div>
          <div class="fhx-grid">
            <div class="fhx-tile" data-fdash="recurring"><div class="r"><div class="i" style="background:rgba(91,141,239,.15)">🔁</div>
              <div><div class="tt">Регулярні</div><div class="ts">${recurring.length?fmt(recTotal())+' ₴/міс · '+recurring.length:'нема платежів'}</div></div><span class="ar">›</span></div></div>
            <div class="fhx-tile" data-fdash="debts"><div class="r"><div class="i" style="background:rgba(255,90,95,.13)">🤝</div>
              <div><div class="tt">Борги</div><div class="ts">${debtSummary()} · синхрон ✓</div></div><span class="ar">›</span></div></div>
            <div class="fhx-tile" data-fdash="envelopes"><div class="r"><div class="i" style="background:rgba(199,125,255,.15)">✉️</div>
              <div><div class="tt">Конверти</div><div class="ts">${envelopes.length} · ${envPct}% накопичено</div></div><span class="ar">›</span></div></div>
            <div class="fhx-tile" data-fdash="challenges"><div class="r"><div class="i" style="background:rgba(240,180,41,.15)">🏆</div>
              <div><div class="tt">Челенджі</div><div class="ts">${challenges.length?challenges.length+' активні':'додай челендж'}</div></div><span class="ar">›</span></div></div>
            <div class="fhx-tile wide" data-fdash="work"><div class="r"><div class="i" style="background:rgba(232,132,60,.15)">⏱</div>
              <div><div class="tt">Робота та зарплата</div><div class="ts">${wkMonth.length?wkMonth.length+' змін · '+fmt(wkEarn)+' '+wkSym+' очікувано':'познач відпрацьовані дні'}</div></div><span class="ar">›</span></div></div>
            <div class="fhx-tile wide" data-fdash="tracker"><div class="r" style="margin-bottom:2px"><div class="i" style="background:rgba(232,132,60,.12)">🧾</div>
              <div><div class="tt">Витрати · 7 днів</div><div class="ts">${fmt(spark7)} ₴ · тап — історія</div></div><span class="ar">›</span></div>
              <div class="sp">${spark.map(v=>`<i style="height:${Math.max(3,Math.round(v/smax*100))}%"></i>`).join('')}</div></div>
          </div>
          <div class="fdash-sec"><span>Останні операції (${finOps.length})</span></div>
          ${ops.length? ops.map(o=>`<div class="fin-op" data-finopdel="${o.id}">
            <span><svg class="fin-ico" style="color:${o.type==='in'?'var(--hab)':'var(--fin)'}"><use href="#${o.type==='in'?'fi-up':'fi-down'}"/></svg> ${esc(o.label||'Операція')}${o.env?' ✉️':''}</span>
            <b style="color:${o.type==='in'?'var(--hab)':'var(--fin)'}">${o.type==='in'?'+':'−'}${fmt(o.amount)}</b></div>`).join('')
            : `<div class="fh-empty">Ще немає операцій. Додай дохід або витрату на першій сторінці.</div>`}
        </div>
      </div>
      <div class="fuz-dots"><i class="on"></i><i></i></div>
      <div class="fuz-hint">свайп вправо → інструменти й історія</div>`;

    bindFinDash(body);
    body.querySelectorAll('[data-fuzcard]').forEach(el=>el.onclick=()=>cardQuickSheet(el.dataset.fuzcard));
    body.querySelectorAll('[data-fuznext]').forEach(el=>el.onclick=()=>openNextSheet());
    body.querySelectorAll('[data-debtplan]').forEach(el=>el.onclick=()=>{
      inputModal({title:'Щомісячний платіж по боргу', value:(localStorage.getItem('debt_plan_m')||''),
        placeholder:'Напр. 250 — фіксований мінус на місяць', onOk:(v)=>{
          const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,''))||0;
          prefSet('debt_plan_m', String(n>0?n:''));
          renderFinance();
        }});
    });
    body.querySelectorAll('[data-fuzfx]').forEach(el=>el.onclick=()=>openFxSheet());
    body.querySelectorAll('[data-fuzact]').forEach(b=>b.onclick=()=>{ const a=b.dataset.fuzact; if(a==='tr') cardTransfer(); else if(a==='env') cardFundEnvelope(); });
    const pg=document.getElementById('fuzPager');
    if(pg){
      const dots=[...body.querySelectorAll('.fuz-dots i')];
      pg.addEventListener('scroll',()=>{ const i=Math.round(pg.scrollLeft/Math.max(1,pg.clientWidth)); dots.forEach((d,j)=>d.classList.toggle('on',j===i)); },{passive:true});
    }
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      body.querySelectorAll('.fhx-w[data-fhxfill]').forEach(w=>{ w.style.height=(w.dataset.fhxfill||0)+'%'; });
    }));
  }

  function bindFinDash(body){
    body.querySelectorAll('[data-fdash]').forEach(b=>b.onclick=()=>{
      const a=b.dataset.fdash;
      if(a==='income') goIncome();
      else if(a==='debts') goDebts();
      else if(a==='spend') goSpend();
      else if(a==='envelopes'){ finView='envelopes'; renderFinance(); }
      else if(a==='newenv'){ newEnvelope(); }
      else if(a==='tracker'){ goSpend(); }
      else if(a==='recurring'){ finView='envelopes'; renderFinance(); }
      else if(a==='work'){ goWork(); }
      else if(a==='analytics'){ goAnalytics(); }
      else if(a==='finlit'){ goFinlit(); }
      else if(a==='plan'){ try{ workMonth=ymLocal(); }catch(_){} openAllocModal(); }
      else if(a==='challenges'){ openChallengesSheet(); }
    });
    body.querySelectorAll('[data-envopen]').forEach(el=>el.onclick=()=>openEnvSheet(el.dataset.envopen));
    body.querySelectorAll('[data-finop]').forEach(b=>b.onclick=()=>addFinOp(b.dataset.finop));
    body.querySelectorAll('[data-finopdel]').forEach(el=>el.onclick=()=>{
      confirmSheet({title:'Видалити операцію?', onOk:()=>{ finOps=finOps.filter(o=>String(o.id)!==String(el.dataset.finopdel)); saveFinOps(); renderFinance(); }});
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

  // ===== Challenges as a sheet (reuse envelope sheet container) =====
  function openChallengesSheet(){
    const s=document.getElementById('e2Sheet'), d=document.getElementById('e2Dim'); if(!s) return;
    s.style.setProperty('--ec','#c77dff');
    s.innerHTML=`<div class="e2grab"></div>
      <div class="e2body" style="padding-top:6px">
        <div class="e2secl" style="margin-top:4px"><span>🏆 Челенджі (${challenges.length})</span></div>
        ${challenges.map(c=>{
          const pct=c.goal?Math.min(100,Math.round((c.progress||0)/c.goal*100)):0;
          return `<div class="fin-chal" data-chaledit="${c.id}" style="cursor:pointer">
            <div class="fin-chal-h"><span>${c.emoji||'🏆'} ${esc(c.name)}</span><span>${c.progress||0}/${c.goal} ${esc(c.unit||'')}</span></div>
            <div class="fh-env-bar"><i style="width:${pct}%;background:#c77dff"></i></div></div>`;
        }).join('') || `<div class="fh-empty">Челенджів ще нема. Напр. «Тиждень без кави» чи «Накопити 5 000 за місяць».</div>`}
        <button class="newbtn" id="fhNewChal" style="border-color:#c77dff;color:#c77dff;margin-top:10px">+ Новий челендж</button>
      </div>`;
    d.classList.add('on'); s.classList.add('on');
    const nc=document.getElementById('fhNewChal'); if(nc) nc.onclick=()=>{ newChallenge(); };
    s.querySelectorAll('[data-chaledit]').forEach(el=>el.onclick=()=>editChallenge(el.dataset.chaledit));
  }

  function addFinOp(type){
    ensureCards();
    pickCard({title:type==='in'?'Дохід — на яку картку?':'Витрата — з якої картки?', onPick:(c)=>addFinOpCard(type,c)});
  }
  function addFinOpCard(type,c){
    const t=type==='in'?'Дохід':'Витрата';
    inputModal({title:t+' — сума ('+cardSym(c)+')', placeholder:'Напр. 500', onOk:(v)=>{
      const amount=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(amount>0)) return;
      inputModal({title:t+' — на що?', placeholder:type==='in'?'Зарплата, подарунок…':'Їжа, таксі…', onOk:(label)=>{
        finOps.push({ id:Date.now()+'_'+Math.random().toString(36).slice(2,6), type, amount, label:label||t, date:ymdLocal(), card:c.id });
        saveFinOps(); renderFinance(); try{ renderIncome(); }catch(_){}
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
  function newChallenge(){
    inputModal({title:'Новий челендж', placeholder:'Напр. Тиждень без кави', emoji:true, emojiVal:'🏆', onOk:(name,emojiVal)=>{
      if(!name) return;
      inputModal({title:'Ціль (число, напр. 7 днів або 5000 ₴)', placeholder:'7', onOk:(v)=>{
        const goal=parseInt((v||'').replace(/\D/g,''))||0;
        challenges.push({ id:'ch_'+Date.now(), name, emoji:(emojiVal!==undefined?emojiVal:'🏆'), goal, progress:0, unit:'' });
        saveChallenges(); renderFinance();
        try{ if(document.getElementById('e2Sheet').classList.contains('on')) openChallengesSheet(); }catch(_){}
      }});
    }});
  }
  function editChallenge(id){
    const c=challenges.find(x=>x.id===id); if(!c) return;
    inputModal({title:'Прогрес «'+c.name+'»', value:String(c.progress||0), placeholder:'Скільки виконано', onOk:(v)=>{
      const n=parseInt((v||'').replace(/\D/g,'')); if(!isNaN(n)){ c.progress=n; saveChallenges(); renderFinance();
        try{ if(document.getElementById('e2Sheet').classList.contains('on')) openChallengesSheet(); }catch(_){} }
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

  /* ═══════════ ПРОЄКТНІ БЛОКИ з макета «Агенція»: канбан · контакти · таймлайн · подія ═══════════ */
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
    inputModal({title:'Ім’я або назва', placeholder:'Напр. Notár Trnavská 8', onOk:(nm)=>{
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
      {ic:'📍', label:'Місце', sub:b.place||'додати', onClick:()=>inputModal({title:'Місце події', value:b.place||'', placeholder:'Напр. Bratislava', onOk:(v)=>{ b.place=(v||'').trim(); saveBoard(); renderBoard(); }})},
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
      const def=e.cardId?cardById(e.cardId):null;
      if(def) ask(def); else pickCard({title:'З якої картки поповнити?', sub:'«'+e.name+'»', allowNew:false, onPick:ask});
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

