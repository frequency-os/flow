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
  function envTotalSaved(){ return envelopes.reduce((s,e)=>s+(envCur(e)?0:envSaved(e)),0); }   // лише головна валюта

  /* Валюта конверта (етап 3 валют, 10.10.2026): e.cur — код неголовної валюти; без нього (усі старі) — головна.
     Рух конверта йде в баланс ТІЄЇ Ж валюти: op.cur на віддзеркаленні у finOps. */
  function envCur(e){ const c=e&&e.cur; return c&&curOk(c)&&c!==mainCur()?c:''; }
  // вільні гроші у валюті c ('' — головна)
  function curFree(c){ try{ return c?curBalance(c):walletBalance(); }catch(_){ return 0; } }
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
    { const ec=envCur(e); if(ec) fo.cur=ec; }   // €-конверт — у €-балансі
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
  /* Додаткові баланси (етап 2 валют): операція з op.cur ≠ головна живе лише у своєму балансі.
     Без cur (усі старі) — головна. Підсумки місяця, План, правила, призи, місії — лише головна валюта. */
  function opMain(o){ return !(o&&o.cur)||o.cur===mainCur()||!curOk(o.cur); }   // невідомий код — у головному, гроші не губляться
  function walletOps(){ return finOps.filter(o=>!o.envSpend&&opMain(o)); }
  function walletBalance(){ return walletOps().reduce((s,o)=>s+(o.type==='in'?o.amount:-o.amount),0); }
  // сумісність зі старим API карток
  function mainCard(){ ensureCards(); return cards[0]; }
  function cardById(){ ensureCards(); return cards[0]; }      // будь-який id → гаманець
  function cardSym(){ return curSym(); }
  function cardBalance(){ return walletBalance(); }
  function incomeSummary(){ try{ return money(walletBalance()); }catch(_){ return '—'; } }

  /* ==== Головна валюта акаунта (09.10.2026, етап 1 валют) ====
     Уся програма показує гроші в головній валюті: Гаманець, віджети, Журнал, призи, План, правила.
     Налаштування 'main_cur' (prefSet: сирий ключ + копія в хмарі) пише лише людина — у «Ще» чи на старті гри.
     Не вибрано: якщо вже є операції — це старий гривневий акаунт (UAH), інакше — за мовою пристрою.
     Записи без поля валюти — у головній; конвертації не робимо (міняється лише значок). */
  const CUR_LIST={UAH:{s:'₴',n:'Гривня'}, EUR:{s:'€',n:'Євро'}, USD:{s:'$',n:'Долар'}, PLN:{s:'zł',n:'Злотий'}, GBP:{s:'£',n:'Фунт'}};
  function curLocale(){ try{ const l=String(navigator.language||'').toLowerCase();
    if(/^uk|^ru/.test(l)) return 'UAH'; if(/^pl/.test(l)) return 'PLN'; if(l==='en-gb') return 'GBP'; if(/^en/.test(l)) return 'USD'; }catch(_){} return 'EUR'; }
  function mainCur(){
    try{ const v=localStorage.getItem('main_cur'); if(v&&Object.prototype.hasOwnProperty.call(CUR_LIST,v)) return v; }catch(_){}
    try{ if((finOps||[]).some(o=>o&&!String(o.id||'').startsWith('start_'))) return 'UAH'; }catch(_){}
    return curLocale();
  }
  function curOk(k){ return !!k&&Object.prototype.hasOwnProperty.call(CUR_LIST,k); }
  // код валюти з даних (хмара/бекап) — лише з CUR_LIST; невідомий → головна (ніякий сирий рядок не йде в HTML)
  function curKey(c){ const k=c?finCurCode(c):mainCur(); return curOk(k)?k:mainCur(); }
  function curSym(c){ const k=curKey(c); return (CUR_LIST[k]&&CUR_LIST[k].s)||'₴'; }
  // «₴1 250», «€1 250», «1 250 zł» — злотий пишуть після числа
  function money(n,c){ const v=Math.round(+n||0), k=curKey(c), sy=curSym(k), a=Math.abs(v).toLocaleString('uk-UA');
    return (v<0?'−':'')+(k==='PLN'?a+' '+sy:sy+a); }
  function moneyK(n,c){ n=Math.round(+n||0); const a=Math.abs(n); if(a<10000) return money(n,c);
    const k=curKey(c), sy=curSym(k), t=(Math.round(a/100)/10).toLocaleString('uk-UA')+'k';
    return (n<0?'−':'')+(k==='PLN'?t+' '+sy:sy+t); }
  // Суми не перераховуються — тому головну валюту вибирають, поки в Гаманці ще нема записів (старт).
  // Коли записи є, вони вже в цій валюті: зміна значка зробила б їх неправдивими, а Робота перерахувала б
  // зарплату (finFx порівнює з mainCur). Інша валюта — окремим балансом (етап 2 валют).
  // «Порожньо в памʼяті» ≠ «Гаманець порожній»: вибір лише коли fin_ops і конверти справді прочитано (хмара відповіла / гість)
  function curLocked(){ try{
    if(!window.__migReport) return true;   // load() ще не поклав fin_ops у памʼять (вікно на самому старті)
    if(window.storeKeyReady&&!(window.storeKeyReady('fin_ops')&&window.storeKeyReady(ENVKEY))) return true;
    // гість на сайті: його вибір після входу перебив би валюту акаунта — вибирають після входу, на довірених даних
    if(!window.FLOW_NATIVE&&!(window.sbUser&&window.sbUser())) return true;
    return (finOps||[]).some(o=>o&&!String(o.id||'').startsWith('start_'))||(envelopes||[]).some(e=>e&&envSaved(e)>0); }catch(_){ return true; } }
  function setMainCur(code){
    if(!Object.prototype.hasOwnProperty.call(CUR_LIST,code)) return;
    if(curLocked()&&code!==mainCur()){ try{ plToast('У Гаманці вже є записи в '+curSym()+' — головну валюту не міняємо'); }catch(_){} return; }
    try{ localStorage.setItem('main_cur',code); }catch(_){}
    try{ prefSet('main_cur',code); }catch(_){}
    try{ renderFinance(); }catch(_){} try{ renderDashboard(); }catch(_){} try{ if(typeof jnRender==='function') jnRender(); }catch(_){}
  }
  function curPickSheet(after){
    const cur=mainCur();
    if(curLocked()){ const guest=!window.FLOW_NATIVE&&!(window.sbUser&&window.sbUser());
      const wait=!window.__migReport||(window.storeKeyReady&&!(window.storeKeyReady('fin_ops')&&window.storeKeyReady(ENVKEY)));
      actionSheet({title:'Головна валюта · '+curSym()+' '+((CUR_LIST[cur]||{}).n||cur),
      sub:wait?'Гаманець ще звіряється з хмарою — вибрати валюту можна, коли дані завантажаться.'
        :guest&&!(finOps||[]).some(o=>o&&!String(o.id||'').startsWith('start_'))?'Увійди в акаунт — тоді вибереш головну валюту (щоб вибір не перебив валюту акаунта на інших пристроях). Зараз — '+curSym()+' за мовою пристрою.'
        :'У Гаманці вже є записи в цій валюті, тому вона зафіксована: інакше старі суми стали б неправдивими. Гроші в іншій валюті скоро можна буде додати окремим балансом.', items:[]}); return; }
    actionSheet({title:'Головна валюта', sub:'У ній показуються Гаманець, віджети, призи, План і правила. Суми не перераховуються — міняється лише значок.',
      items:Object.keys(CUR_LIST).map(k=>({ic:k===cur?'target':'refresh', label:CUR_LIST[k].s+'  '+CUR_LIST[k].n+(k===cur?' · зараз':''), onClick:()=>{ if(k!==cur) setMainCur(k); if(after) after(k); }}))});
  }
  try{ prefCatchup('main_cur', v=>{ if(CUR_LIST[v]){ try{ renderFinance(); }catch(_){} try{ renderDashboard(); }catch(_){} } }); }catch(_){}

  /* ==== Чужа валюта → головна валюта Гаманця ====
     Гаманець веде головну валюту (mainCur), а проєкт, зміна на Роботі чи борг можуть бути
     в іншій. Раніше в Гаманець ішла та сама цифра: 500 € ставали +500 ₴.
     Тепер питаємо курс (підставляємо останній) і пишемо в головній валюті, а слід
     лишаємо в op._fx і в підписі — так само, як при міграції на гаманець. */
  const FX_SYM2CODE={'₴':'UAH','грн':'UAH','€':'EUR','$':'USD','zł':'PLN'};
  const FX_DEF={EUR:48.6,USD:41.6,PLN:11.4};
  const FX_LAST_KEY='flowapp___fx_last';   // лише підказка на цьому пристрої, не дані
  function finCurCode(c){ c=String(c==null?'':c).trim(); if(!c) return mainCur(); return FX_SYM2CODE[c]||c.toUpperCase(); }
  // скільки гривень за 1 одиницю (база збережених курсів — історично гривня)
  function finUahRate(code){
    if(code==='UAH') return 1;
    try{ const o=JSON.parse(localStorage.getItem(FX_LAST_KEY)||'{}'); if(+o[code]>0) return +o[code]; }catch(_){}
    // далі — курси людини з fx_cfg (вони синкаються), і лише потім вшиті
    try{ const r=migRates()[code]; if(+r>0) return +r; }catch(_){}
    return FX_DEF[code]||0;
  }
  // скільки ГОЛОВНОЇ валюти за 1 одиницю code
  function finLastRate(code){
    const m=mainCur(); if(code===m) return 1;
    if(m==='UAH') return finUahRate(code);
    try{ const o=JSON.parse(localStorage.getItem(FX_LAST_KEY)||'{}'); if(+o[code+'>'+m]>0) return +o[code+'>'+m]; }catch(_){}
    const a=finUahRate(code), b=finUahRate(m); return a>0&&b>0?Math.round(a/b*10000)/10000:0;
  }
  function finRememberRate(code,r){
    const m=mainCur();
    try{ const o=JSON.parse(localStorage.getItem(FX_LAST_KEY)||'{}'); o[m==='UAH'?code:code+'>'+m]=r; localStorage.setItem(FX_LAST_KEY,JSON.stringify(o)); }catch(_){}
  }
  // cb(rate): для гривні одразу 1; для іншої валюти — питаємо курс.
  // Скасував або ввів не число — cb не кличемо, нічого не записується.
  function finAskRate(cur, cb){
    const code=finCurCode(cur);
    if(code===mainCur()){ cb(1); return; }
    const sym=curSym(code);
    inputModal({title:'Курс: 1 '+sym+' = скільки '+curSym()+'?', value:String(finLastRate(code)||''), placeholder:'Напр. 48.6', onOk:v=>{
      const r=parseFloat(String(v||'').replace(',','.').replace(/[^\d.]/g,''));
      if(!(r>0)){ flowAlert('Курс має бути числом, більшим за нуль. Нічого не записано.'); return; }
      finRememberRate(code,r); cb(r);
    }});
  }
  // сума у валюті cur → поля операції Гаманця: {amount у головній валюті, fx-слід, хвіст підпису}
  function finFx(amount, cur, rate){
    const code=finCurCode(cur), a=+amount||0;
    if(code===mainCur() || !(rate>0)) return {amount:a, fx:null, tail:''};
    const sym=curSym(code);
    return {amount:Math.round(a*rate*100)/100, fx:{cur:code, rate, was:a}, tail:' · '+fmt(a)+' '+sym+' × '+rate};
  }
  // готова операція Гаманця з урахуванням валюти
  function finOpFx(base, amount, cur, rate){
    const x=finFx(amount, cur, rate), op=Object.assign({}, base, {amount:x.amount});
    op.label=(base.label||'Операція')+x.tail;
    if(x.fx) op._fx=x.fx;
    return op;
  }
  // opts.memOnly — лише в памʼяті: так кличе load(), поки дані сесії не підтверджені
  // (хмара мовчить) — заводський гаманець не має лягти в сховище поверх справжнього
  function ensureCards(opts){
    const mem=!!(opts&&opts.memOnly);
    if(!Array.isArray(cards) || !cards.length || cards.length>1 || cards[0].id!==WALLET_ID){
      cards=[walletCard()]; if(!mem) saveCards();
    }
    let ch=false;
    // витрати ІЗ конверта не мають вдруге списувати баланс
    try{
      envelopes.forEach(e=>{ (e.ops||[]).forEach(op=>{
        // повернення з конверта на рахунок (скарбничка призу, 44-prizes.js) пишеться як t:'back' — це не витрата, баланс має зрости.
        // Якщо стара збірка встигла позначити такий запис витратою (envSpend) — знімаємо позначку
        if(op.t==='out'&&op.finOpId&&!op.back){ const f=finOps.find(x=>String(x.id)===String(op.finOpId)); if(f&&!f.envSpend){ f.envSpend=true; ch=true; } }
        else if(op.back&&op.finOpId){ const f=finOps.find(x=>String(x.id)===String(op.finOpId)); if(f&&f.type==='in'&&f.envSpend){ delete f.envSpend; ch=true; } }
      });});
    }catch(_){}
    // операції без рахунку → у гаманець
    finOps.forEach(o=>{ if(!o.card && !o.envSpend){ o.card=WALLET_ID; ch=true; } });
    if(ch && !mem) saveFinOps();
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
  /* Прапорець «виконано» — на пристрій, як інші разові міграції (flowapp_*_v1).
     Без нього міграція йшла при КОЖНОМУ load() (старт, фокус, кожні 2 хв)
     і щоразу переписувала fin_ops та income_cards у хмару зі свіжою міткою:
     інший пристрій бачив «новіше», перечитувався, сам переписував — і так
     по колу, а в кожному колі могла загубитись свіжа витрата з іншого
     пристрою. Тепер пишемо лише те, що справді змінилось, а прапорець
     ставимо, коли операції вже побачено і переведено в гаманець.
     Сам прапорець читає й ставить реєстр MIGRATIONS_ONCE (27-canvas.js):
     лише після довіреного читання і лише коли rep.ops > 0. */
  const WALLET_MIG_FLAG='flowapp_wallet_migrated_v1';
  // const, а не function — щоб НЕ висіла в window: файли core/ склеєні в один
  // <script> без обгортки, і кожна function верхнього рівня сама стає window.*.
  // Кличе її лише завантажувач (27-canvas.js, той самий скрипт); ззовні вона
  // нікому не потрібна, а зайві двері до переписування всієї книги краще зачинити.
  const migrateToWallet=function(rawCards, rawFx){
    const rep={ ops:0, moved:0, converted:0, orphan:0, before:0, after:0, diff:0 };
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
      if(o.card!==WALLET_ID){ o.card=WALLET_ID; rep.moved++; }
    });
    // картки вже = один гаманець — не чіпаємо (і не затираємо його назву/колір)
    const isWallet=Array.isArray(cards) && cards.length===1 && cards[0] && cards[0].id===WALLET_ID;
    if(!isWallet){ cards=[walletCard()]; saveCards(); }
    rep.after=walletSumUAH(rates, {});      // після міграції все у гривні
    rep.diff=Math.round((rep.after-rep.before)*100)/100;
    if(rep.moved || rep.converted) saveFinOps();
    // Порожня книга (rep.ops===0) — реєстр прапорець НЕ ставить: на новому пристрої
    // операції ще можуть не дійти, і міграція має спрацювати, коли дійдуть.
    // Повтор без прапорця нічого не пише — записи вище лише за реальної зміни.
    if(rep.moved || rep.converted || !isWallet){
      try{ window.__walletReport=rep; console.info('[гаманець] міграція:', rep); }catch(_){}
    }
    return rep;
  };
  try{ window.walletSumUAH=walletSumUAH; window.walletBalance=walletBalance; }catch(_){}

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
  let workCardId=''; // куди приходить зарплата (обирається в меню картки)
  function workCard(){ return cardById(workCardId)||cards.find(c=>c.type==='work')||mainCard(); }

  /* ============ АНАЛІТИКА · ріст і спад ============ */
  // без огляду на валюту — для балансів інших валют і віджетів папки з валютою
  function _isExpAny(o){ return o.type==='out' && !o._tr && !(o.envId && !o.envSpend); }
  function _isIncAny(o){ return o.type==='in' && !o._tr; }
  function _isRealExpense(o){ return _isExpAny(o) && opMain(o); }
  function _isRealIncome(o){ return _isIncAny(o) && opMain(o); }
  function monthAgg(ym){ let inn=0,out=0; finOps.forEach(o=>{ if(String(o.date||'').slice(0,7)!==ym) return; if(_isRealIncome(o)) inn+=o.amount; else if(_isRealExpense(o)) out+=o.amount; }); return {in:inn,out}; }

  /* ============ МОЯ ФІНАНСОВА ГРАМОТНІСТЬ ============ */


  let finView='dash'; // 'dash' | 'envelopes'
  function finBalance(){ return finOps.reduce((s,o)=>s+(!opMain(o)?0:o.type==='in'?o.amount:(o.envSpend?0:-o.amount)),0); }

  function renderFinance(){
    try{ if(typeof wgRefresh==='function') wgRefresh(); }catch(_){}   // віджети «Гроші» в папці й на Огляді бачать ту саму зміну
    const body=document.getElementById('financeBody'); if(!body) return;
    document.getElementById('finSub').textContent='гаманець і плани';
    if(finView==='envelopes'){ renderEnvScreen(body); return; }
    // 09.10.2026: головний екран — «Гаманець героя» (46-wallet.js); старий renderFinDash лишається запасним
    if(typeof wlRender==='function'){ try{ wlRender(body); return; }catch(err){ console.error('wlRender',err); } }
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
    const goalSum=envelopes.reduce((s,e)=>s+(envCur(e)?0:(+e.goal||0)),0);
    const ops=finOps.slice().reverse().slice(0,8);
    let debts='—'; try{ debts=debtSummary(); }catch(_){}
    const envTop=envelopes.slice(0,4);

    body.innerHTML=`
      <div class="wal-head">
        <div class="wal-lab">Гаманець</div>
        <div class="wal-bal">${fmt(bal)} <small>${curSym()}</small></div>
        ${(()=>{ try{ const pz=typeof pzTotal==='function'?pzTotal():0; return pz>0?`<div class="wal-split"><span>вільно <b>${money(bal)}</b></span><span>🏆 на призи <b>${money(pz)}</b></span></div>`:''; }catch(_){ return ''; } })()}
        <div class="wal-sub">${finOps.length} ${finOps.length===1?'операція':(finOps.length%10>=2&&finOps.length%10<=4&&(finOps.length%100<10||finOps.length%100>=20)?'операції':'операцій')} · один рахунок</div>
      </div>

      <div class="wal-acts">
        <button class="pri" data-finop="out"><i>−</i>Витрата</button>
        <button data-finop="in"><i>＋</i>Дохід</button>
      </div>

      <div class="fdash-sec"><span>${MON_UA[mi]}</span><span class="lnk" data-wal="spend">історія ›</span></div>
      <div class="wal-row"><span class="e">📥</span><div class="n">Дохід</div><b class="in">+${money(m.in)}</b></div>
      <div class="wal-row"><span class="e">📤</span><div class="n">Витрати</div><b class="out">−${money(m.out)}</b></div>

      <div class="fdash-sec"><span>Плани · ${money(saved)}${goalSum?' / '+fmt(goalSum):''}</span><span class="lnk" data-wal="env">усі ›</span></div>
      ${envTop.length ? envTop.map(e=>{
        const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
        return `<div class="wal-env" data-envopen="${esc(e.id)}" style="--ec:${safeColor(e.color,'#5b8def')}">
          <i class="fill" style="width:${pct}%"></i>
          <span class="e">${safeEmoji(e.emoji,'✉️')}</span>
          <div class="n">${esc(e.name)}<s>${e.goal?pct+'% · ще '+money(Math.max(0,e.goal-sv)):'без цілі'}</s></div>
          <b>${fmt(sv)}</b></div>`;
      }).join('') : `<div class="fh-empty">Планів ще немає. Конверт — це ціль із числом і датою.</div>`}
      <button class="newbtn" data-wal="newenv">+ Новий конверт</button>

      <div class="fdash-sec"><span>Борги</span><span class="lnk" data-wal="debts">усі ›</span></div>
      <div class="wal-row" data-wal="debts"><span class="e">🤝</span><div class="n">Нетто за боргами</div><b>${esc(debts)}</b></div>

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










  // ===== Envelopes sub-screen (grid + recurring) =====
  function renderEnvScreen(body){
    const tot=envTotalSaved();
    const goalSum=envelopes.reduce((s,e)=>s+(envCur(e)?0:(+e.goal||0)),0);
    body.innerHTML=`
      <button class="back" id="envScreenBack" style="--c:var(--skl);margin-bottom:14px">‹ Фінанси</button>
      <div class="env2-tot"><div><div class="l">Накопичено у конвертах</div></div>
        <div class="v">${fmt(tot)} <small>/ ${money(goalSum)}</small></div></div>
      <div class="env2-grid">
      ${envelopes.map(e=>{
        const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
        const col=safeColor(e.color,'#5b8def');
        const outs=(e.ops||[]).filter(o=>o.t==='out'&&!o.back).length;
        const kind=e.kind||(e.wishId?'мрія':'ціль');
        const tags=[`🎯 ${esc(kind)}`]; if(outs) tags.push(`${outs} витрат`); if(envCur(e)) tags.unshift(esc(curSym(envCur(e))));
        const cover=e.cover||e.wishImg||'';
        return `<div class="env2 ${(e.wishId||cover)?'wishlinked':''}" style="--ec:${col}" data-envopen="${esc(e.id)}">
          ${cover?`<div class="e2cover" style="background-image:url('${safeImg(cover)}')"></div>`:''}
          <div class="e2water" style="height:0" data-e2fill="${pct}"></div>
          <div class="e2top"><span class="e2em">${safeEmoji(e.emoji,'✉️')}</span><span class="e2pct">${pct}%</span></div>
          <div class="e2nm">${esc(e.name)}</div>
          <div class="e2amt">${fmt(sv)} / ${esc(money(e.goal||0,envCur(e)))}</div>
          <div class="e2tags">${tags.map(t=>`<span class="e2tg">${t}</span>`).join('')}</div>
        </div>`;
      }).join('')}
        <div class="env2 add" id="fhNewEnv">＋<br>Новий конверт</div>
        <div class="env2 add" id="fhTplEnv">🗂<br>Зі стандартних</div>
      </div>
      <div class="fh-secl"><svg class="fin-ico"><use href="#fi-repeat"/></svg> Регулярні платежі</div>
      ${recurring.map(r=>`<div class="fin-reg" data-regdel="${r.id}"><span><svg class="fin-ico"><use href="#fi-repeat"/></svg> ${esc(r.name)}</span><b>${money(r.amount)}/міс</b></div>`).join('')
        || `<div class="fh-empty">Додай підписки й регулярні платежі (Netflix, оренда…).</div>`}
      <button class="newbtn" id="fhNewRec" style="border-color:#5b8def;color:#5b8def">+ Регулярний платіж</button>`;

    const bk=document.getElementById('envScreenBack'); if(bk) bk.onclick=()=>{ finView='dash'; renderFinance(); };
    body.querySelectorAll('[data-envopen]').forEach(el=>el.onclick=()=>openEnvSheet(el.dataset.envopen));
    const ne=document.getElementById('fhNewEnv'); if(ne) ne.onclick=newEnvelope;
    { const te=document.getElementById('fhTplEnv'); if(te) te.onclick=()=>{ if(typeof wlEnvStarter==='function') wlEnvStarter(); }; }   // 46-wallet.js
    const nr=document.getElementById('fhNewRec'); if(nr) nr.onclick=newRecurring;
    body.querySelectorAll('[data-regdel]').forEach(el=>el.onclick=()=>{
      confirmSheet({title:'Видалити регулярний платіж?', onOk:()=>{ recurring=recurring.filter(r=>String(r.id)!==String(el.dataset.regdel)); saveRecurring(); renderFinance(); }});
    });
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      body.querySelectorAll('.e2water[data-e2fill]').forEach(w=>{ w.style.height=(w.dataset.e2fill||0)+'%'; });
    }));
  }


  function addFinOp(type){
    // нова шторка з полем «До місії» (46-wallet.js)
    if(typeof wlOpSheet==='function'){ try{ return wlOpSheet(type,''); }catch(err){ console.error('wlOpSheet',err); } }
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
      inputModal({title:'Сума на місяць ('+curSym()+')', placeholder:'Напр. 250', onOk:(v)=>{
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
      inputModal({title:'Ціль конверта (сума '+curSym()+')', placeholder:'Напр. 20000', onOk:(goalStr)=>{
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
  /* ============ ПРОЄКТИ КАБІНЕТУ (fin_projects) — ПРИБРАНО 09.10.2026 ============
     Старі віджети «Проєкт» і «Фестиваль» видалено; гроші проєктів тепер — віджети «Доходи»/«Витрати»
     (48-widgets.js) з міткою папки в Гаманці. Сховище лишається лише для «Ще → Дані → Старі віджети»,
     де людина сама стирає старі проєкти (wgOldCleanup). */
  let finProjects=[];
  const FINPROJKEY='fin_projects';
  function saveFinProjects(){ try{ const p=window.storage.set(FINPROJKEY,JSON.stringify(finProjects),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }


  // ── ФЕСТИВАЛЬ · ПОДІЯ: відлік, програма, бюджет ──
  function renderEnvSheet(){
    const s=document.getElementById('e2Sheet'); if(!s) return;
    const e=envelopes.find(x=>String(x.id)===String(envOpenId)); if(!e){ closeEnvSheet(); return; }
    envMigrate(e);
    const sv=envSaved(e), pct=e.goal?Math.min(100,Math.round(sv/e.goal*100)):0;
    const left=Math.max(0,(e.goal||0)-sv), ec=envCur(e);
    const col=safeColor(e.color,'#5b8def');
    const kind=e.kind||(e.wishId?'мрія':'ціль');
    const cover=e.cover||e.wishImg||'';
    s.style.setProperty('--ec',col);
    s.innerHTML=`<div class="e2grab"></div>
      <div class="e2hero">
        <div class="e2bg" style="background:${cover?`url('${safeImg(cover)}')`:`linear-gradient(135deg,${col},#1a1d27)`};background-size:cover;background-position:center"></div>
        <div class="e2veil"></div>
        <div class="e2htop"><span class="e2chip">🎯 ${esc(kind)}</span><span class="e2chip">${pct}%</span></div>
        <div class="e2htxt">
          <div class="e2nm2">${safeEmoji(e.emoji,'✉️')} ${esc(e.name)}</div>
          <div class="e2sub">${e.wishId?'звʼязано з Картою мрій · ':''}ціль ${esc(money(e.goal||0,ec))}</div>
          <div class="e2prog"><i style="width:${pct}%"></i></div>
          <div class="e2nums"><div class="n">${esc(money(sv,ec))}<small>накопичено</small></div>
            <div class="n" style="text-align:right">${esc(money(left,ec))}<small>лишилось</small></div></div>
        </div>
      </div>
      <div class="e2body">
        <div class="e2acts">
          <button class="in" id="e2In">+ Поповнити<small>з картки → у конверт</small></button>
          <button class="out" id="e2Out">− Витрата на ціль<small>піде в Розходи</small></button>
        </div>
        <div class="e2secl"><span>Рухи (${e.ops.length})</span><span>усе по конверту</span></div>
        ${e.ops.length? e.ops.map(o=>`<div class="e2op" data-eopdel="${esc(o.id)}">
          <div class="l"><span class="ic">${o.t==='in'?'⬆️':'⬇️'}</span>
            <div>${esc(o.label||'')}<s>${esc(o.date||'')}</s></div></div>
          <b class="${o.t==='in'?'in':'out'}">${o.t==='in'?'+':'−'}${esc(money(o.amount,ec))}</b></div>`).join('')
          : `<div class="fh-empty">Ще немає рухів. Поповни конверт або запиши витрату.</div>`}
        <div class="e2edit">
          <button id="e2Name">✎ Назва</button>
          <button id="e2Goal">🎯 Ціль</button>
          ${(typeof wlCurList==='function'&&wlCurList().length)||ec?`<button id="e2Cur">💱 ${esc(curSym(ec))}</button>`:`<button id="e2Card">💳 Картка</button>`}
          <button id="e2Del" class="e2del">Видалити</button>
        </div>
      </div>`;
    s.querySelector('#e2In').onclick=()=>{
      const ask=(c)=>inputModal({title:'Поповнити «'+e.name+'» ('+curSym(ec)+')', placeholder:'Сума · вільно '+money(curFree(ec),ec), onOk:(v)=>{
        const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
        if(n>curFree(ec)+1e-9){ flowAlert('Вільно лише '+money(curFree(ec),ec)+'. Нічого не записано.'); return; }   // конверт — гроші з вільних, не в борг
        envAddOp(e,'in',n,'З картки: '+c.name,c.id); renderEnvSheet(); renderFinance();
      }});
      ask(mainCard());
    };
    s.querySelector('#e2Out').onclick=()=>inputModal({title:'Витрата на «'+e.name+'»', placeholder:'На що…', onOk:(label)=>{
      inputModal({title:'Сума витрати ('+curSym(ec)+')', placeholder:'Напр. 500', onOk:(v)=>{
        const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
        envAddOp(e,'out',n,label||'Витрата'); renderEnvSheet(); renderFinance();
      }});
    }});
    s.querySelector('#e2Name').onclick=()=>inputModal({title:'Назва конверта', value:e.name, onOk:(v)=>{ if((v||'').trim()){ e.name=v.trim(); saveEnvelopes(); renderEnvSheet(); renderFinance(); } }});
    { const cu=s.querySelector('#e2Cur'); if(cu) cu.onclick=()=>{
      // валюту міняємо лише порожньому конверту: інакше старі рухи опинились би в чужому балансі
      if(e.ops.length){ flowAlert('Валюту можна змінити лише в новому конверті без рухів. Створи окремий конверт у потрібній валюті.'); return; }
      const opts=[mainCur()].concat(typeof wlCurList==='function'?wlCurList():[]);
      actionSheet({title:'Валюта конверта', sub:'Поповнення й витрати йдуть з балансу цієї валюти.', items:opts.map(c=>({ic:c===(ec||mainCur())?'target':'refresh', label:curSym(c)+'  '+((CUR_LIST[c]||{}).n||c)+(c===mainCur()?' · головна':''), onClick:()=>{ if(c===mainCur()) delete e.cur; else e.cur=c; saveEnvelopes(); renderEnvSheet(); renderFinance(); }}))});
    }; }
    { const cb=s.querySelector('#e2Card'); if(cb) cb.onclick=()=>{
      ensureCards();
      actionSheet({ title:'Картка для поповнень', sub:e.cardId?('Зараз: '+((cardById(e.cardId)||{}).name||'—')):'Зараз: питати щоразу',
        items: cards.map(c=>({ ic:safeEmoji(c.emoji,'💳'), label:c.name, sub:fmt(cardBalance(c))+' '+cardSym(c), onClick:()=>{ e.cardId=c.id; saveEnvelopes(); renderEnvSheet(); } }))
          .concat([{ ic:'❓', label:'Питати щоразу', onClick:()=>{ delete e.cardId; saveEnvelopes(); renderEnvSheet(); } }])
      });
    }; }
    s.querySelector('#e2Goal').onclick=()=>inputModal({title:'Ціль конверта ('+curSym()+')', value:String(e.goal||0), onOk:(v)=>{ const n=parseInt((v||'').replace(/\D/g,'')); if(!isNaN(n)){ e.goal=n; saveEnvelopes(); renderEnvSheet(); renderFinance(); } }});
    s.querySelector('#e2Del').onclick=()=>{
      // 10.10.2026: гроші в конверті вже списані з балансу (рух «У конверт») — без повернення вони б зникли.
      // Повертаємо залишок у вільні переказом (_tr: не дохід), як скарбничка призу, і лише тоді видаляємо.
      if(window.storeKeyReady&&!(window.storeKeyReady('fin_ops')&&window.storeKeyReady(ENVKEY))){ plToast('Гаманець ще звіряється з хмарою — спробуй за хвилину'); return; }   // інакше стара копія ляже поверх хмари
      const sv=Math.round(envSaved(e)*100)/100;
      const del=()=>{ envelopes=envelopes.filter(x=>String(x.id)!==String(e.id)); saveEnvelopes(); closeEnvSheet(); renderFinance(); };
      if(sv>0) confirmSheet({title:'Видалити конверт «'+e.name+'»?', sub:'У ньому '+money(sv,envCur(e))+' — вони повернуться у вільні гроші. Історія витрат лишиться.', okLabel:'Повернути '+money(sv,envCur(e))+' і видалити', onOk:()=>{
        let card; try{ card=mainCard().id; }catch(_){}
        const bo={id:'fin_'+Date.now()+Math.random().toString(36).slice(2,6), type:'in', amount:sv, label:'З конверта: '+e.name, date:ymdLocal(), env:e.name, card, _tr:true, envBack:true};
        if(envCur(e)) bo.cur=envCur(e);   // повертаємо в баланс валюти конверта
        finOps.push(bo);
        saveFinOps(); del(); try{ plToast('↩ '+money(sv,envCur(e))+' повернуто у вільні'); }catch(_){} }});
      else confirmSheet({title:'Видалити конверт «'+e.name+'»?', sub:'Він порожній. Історія витрат лишиться.', onOk:del});
    };
    s.querySelectorAll('[data-eopdel]').forEach(el=>el.onclick=()=>{ confirmSheet({title:'Видалити цей рух?', onOk:()=>{ envDelOp(e, el.dataset.eopdel); renderEnvSheet(); renderFinance(); }}); });
  }

