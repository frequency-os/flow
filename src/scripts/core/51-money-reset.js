  /* ════════ Робота ↔ Гаманець і «Почати фінанси з нуля» (51-money-reset.js, 10.10.2026) ════════
     1) wkMoneyInfo(ym) — лише ЧИТАННЯ календаря Роботи (20-work.js): години, зароблено (зміни + аванси/премії),
        день виплати, чи зарплату вже записано (op._autoSal з _salYM). Записує зарплату, як і раніше, сама Робота
        (syncSalaryToFin) — тут нічого не пишеться.
        Використання: плитка «⏱ Робота» в Гаманці (48-widgets.js), рядок «Очікується з Роботи» у Плані й прогнозі (47-rules.js).
     2) finResetScan / finResetAll — «Ще → Дані → Почати фінанси з нуля»: лише за тапом людини, після підтвердження
        й лише коли fin_ops / конверти / goals_data звірені з хмарою. Стирає ГРОШІ: операції Гаманця, конверти й
        скарбнички, регулярні платежі, План і цілі місяця, шаблон зарплати, додаткові валюти. Лишає: місії, Журнал,
        папки, борги, години Роботи. Зарплати минулих місяців Робота після цього не записує знову (workPostedSal='deleted'). */

  function wkMoneyInfo(ym){
    ym=ym||wlYm();
    let ss=[]; try{ ss=workSessionsIn(ym); }catch(_){ return null; }
    let net=0; try{ net=extrasNet(ym); }catch(_){}
    const hours=ss.reduce((s,w)=>s+(+w.hours||0),0), earned=ss.reduce((s,w)=>s+(+w.amount||0),0)+net;
    const pushed=ss.filter(w=>w.pushed).reduce((s,w)=>s+(+w.amount||0),0);   // зміни, вже записані в Гаманець окремо
    const y=+ym.slice(0,4), m=+ym.slice(5,7), dim=new Date(y,m,0).getDate();
    const pday=Math.min(Math.max(parseInt(workPayday)||dim,1),dim);
    const sal=(finOps||[]).find(o=>o&&o._autoSal===true&&o._salYM===ym)||null;
    let cur=''; try{ const c=finCurCode(workCur); cur=c&&curOk(c)&&c!==mainCur()?c:''; }catch(_){}
    const left=sal?0:Math.max(0,Math.round((earned-pushed)*100)/100);
    const td=ymdLocal(), due=ym<td.slice(0,7)||(ym===td.slice(0,7)&&+td.slice(8,10)>=pday);   // день виплати вже настав
    // зарплату цього місяця видалено руками чи обнулено фінанси — Робота її не запише, тож і не «очікуємо»
    let skip=false; try{ skip=!sal&&workPostedSal&&workPostedSal[ym]==='deleted'; }catch(_){}
    return {ym, hours, earned, pday, paid:!!sal, salOp:sal, cur, left:skip?0:left, due, skip, has:!skip&&(ss.length>0||Math.abs(net)>0)};
  }
  // очікувана зарплата в головній валюті (для прогнозу Плану): Робота в €, зарплата пишеться в ₴ за курсом — так само рахуємо
  function wkExpectedMain(ym){
    const i=wkMoneyInfo(ym); if(!i||!i.left) return 0;
    try{ const p=rlPlan(ym,false); if(p&&p.in.some(r=>!rlRowCur(r)&&/зарплат|(^|[^а-яіїєґ])зп([^а-яіїєґ]|$)|salary/i.test(String(r.t||'')))) return 0; }catch(_){}   // уже є в Плані — не двічі
    if(!i.cur) return i.left;
    const r=finLastRate(i.cur); return r>0?Math.round(i.left*r):0;
  }
  // рядок у вкладці «План» → Доходи (лише показ; тап — у календар Роботи)
  function wkPlanRowHTML(ym){
    const i=wkMoneyInfo(ym); if(!i||!i.has) return '';
    const mn=MO_NAMES[+ym.slice(5,7)-1].toLowerCase();
    return `<button class="rl-pr${i.paid?' ok':''}" data-wkgo><span class="rl-pr-d">${esc(String(i.pday))}</span><span class="rl-pr-n"><b>⏱ Зарплата за ${esc(mn)}</b><small>${i.paid?'✓ записано в Гаманець':esc(String(Math.round(i.hours*10)/10).replace('.',','))+' год · '+(i.due?'день виплати минув — тапни, Робота запише':'очікується '+esc(String(i.pday))+'-го')}</small></span><b class="in">+${esc(money(i.paid?(+i.salOp.amount||0):i.left, i.paid?'':i.cur))}</b></button>`;
  }
  function wkPlanBind(c){ c.querySelectorAll('[data-wkgo]').forEach(b=>b.onclick=()=>{ try{ goWork(); }catch(_){} }); }

  // ── «Почати фінанси з нуля» ──
  function finResetScan(){
    const ops=(finOps||[]).length, envs=(envelopes||[]).length, recs=(typeof recurring!=='undefined'&&Array.isArray(recurring))?recurring.length:0;
    const h=jnHero(); const plans=h.plan&&typeof h.plan==='object'?Object.keys(h.plan).length:0, goals=h.money&&typeof h.money==='object'?Object.keys(h.money).length:0;
    let curs=0; try{ curs=wlCurList().length; }catch(_){}
    return {ops, envs, recs, plans, goals, curs};
  }
  // довіра: хмара реально відповіла (sbDataTrusted) і ключі прочитано — інакше стара локальна копія (офлайн) затерла б чужі правки
  function finResetReady(){
    if(window.sbDataTrusted&&!window.sbDataTrusted()) return false;
    return !(window.storeKeyReady&&!['fin_ops',ENVKEY,'goals_data','work_cfg','debts','fin_tomb'].every(k=>window.storeKeyReady(k)));
  }
  // перед стиранням — свіжі дані з хмари в памʼять (з входом); гість — лише локальні дані, звіряти нема з чим
  async function finResetAll(){
    try{ if(window.sbUser&&window.sbUser()&&typeof window.sbPullAndLoad==='function'){ const ok=await window.sbPullAndLoad(); if(!ok){ plToast('Хмара не відповіла — нічого не змінено. Перевір звʼязок.'); return false; } } }catch(_){ plToast('Хмара не відповіла — нічого не змінено.'); return false; }
    if(!finResetReady()){ plToast('Дані ще звіряються з хмарою — спробуй за хвилину. Нічого не змінено.'); return false; }
    // без входу на пристрої, де вже був акаунт: тут лежить його копія, і надгробки після входу сховали б історію акаунта всюди
    try{ if(!(window.sbUser&&window.sbUser())&&localStorage.getItem('flowapp___owner')){ plToast('Спершу увійди в акаунт — обнулення стосується всіх твоїх пристроїв'); return false; } }catch(_){}
    // Робота: зарплати, вже записані, і всі минулі місяці — «не записувати знову» (інакше відкриття календаря повернуло б стару історію)
    try{ const cur=wlYm(); if(!workPostedSal||typeof workPostedSal!=='object') workPostedSal={};
      (finOps||[]).forEach(o=>{ if(o&&o._autoSal===true&&o._salYM) workPostedSal[o._salYM]='deleted'; });
      (workSessions||[]).forEach(w=>{ const ym=String(w&&w.date||'').slice(0,7); if(/^\d{4}-\d{2}$/.test(ym)&&ym<cur) workPostedSal[ym]='deleted'; });
      (typeof workExtras!=='undefined'&&Array.isArray(workExtras)?workExtras:[]).forEach(x=>{ const ym=String(x&&x.ym||''); if(/^\d{4}-\d{2}$/.test(ym)&&ym<cur) workPostedSal[ym]='deleted'; }); }catch(_){}
    // «надгробки» — ДО стирання: id усього, що зараз зникне, щоб стара копія з іншого пристрою цього не повернула
    finTombAdd();
    finOps=[]; saveFinOps();
    envelopes=[]; saveEnvelopes();
    try{ recurring=[]; saveRecurring(); }catch(_){}
    const h=jnHero(); delete h.plan; delete h.money; delete h.salarySplit; saveGoals();
    // призи місій: прив'язку до видаленої скарбнички знімаємо (сам приз і ціна лишаються)
    try{ (goalsData.goals||[]).forEach(g=>{ if(g&&g.reward&&typeof g.reward==='object') delete g.reward.envId; }); saveGoals(); }catch(_){}   // «отримано» — досягнення, лишається
    try{ wlCurSave([]); }catch(_){}
    try{ if(typeof fsClear==='function') fsClear(); }catch(_){}   // майстер «Новий старт» (52-fresh-start.js) — знову з кроку 1
    // борги: самі борги лишаються, а позначка «записано в Гаманець» знімається — операцій уже нема, можна провести знову
    try{ let ch=false; (debtItems||[]).forEach(i=>{ if(i&&(i.synced||i.finOpId)){ i.synced=false; i.finOpId=null; ch=true; } }); if(ch) debtSave(); }catch(_){}
    // години Роботи (work_sessions) не переписуємо — лише налаштування з позначками зарплат (work_cfg)
    try{ const q=window.storage.set(WORKCFGKEY,JSON.stringify({rate:workRate,cur:workCur,payday:workPayday,postedSal:workPostedSal,cardId:workCardId}),false); if(q&&q.catch)q.catch(()=>{}); }catch(_){}
    try{ renderFinance(); }catch(_){} try{ if(typeof wgRefresh==='function') wgRefresh(); }catch(_){}
    return true;
  }

  /* ════ «Надгробки» обнулення фінансів (ключ fin_tomb, 10.10.2026) ════
     Ключі пишуться в хмару цілком, і новіша мітка перемагає. Тож пристрій, що лишився зі старими даними
     в памʼяті (Mac офлайн), після обнулення на телефоні міг одним записом повернути всю стару історію.
     finResetAll перед стиранням кладе в fin_tomb id стертого: операцій, конвертів, регулярних, рядків Плану
     і місяці зарплат Роботи. load() (27-canvas.js) відкидає їх при кожному читанні — ЛИШЕ в памʼяті, нічого
     не записує сам: хмара очиститься наступним ручним збереженням. Нове (інший id) лишається.
     Пише fin_tomb тільки кнопка обнулення (дія людини), списки доповнюються, а не замінюються. */
  const FIN_TOMB_KINDS=['ops','env','rec','plan','sal'], FIN_TOMB_CAP=20000;
  // відновлення бекапу (02-storage.js pushRestored) — крок назад у часі: надгробки «з майбутнього» більше не діють
  window.finTombReset=function(){ window.__finTomb=finTombNorm(null);
    return window.storage.set('fin_tomb',JSON.stringify({at:new Date().toISOString(),ops:[],env:[],rec:[],plan:[],sal:[]}),false); };
  function finTombNorm(d){
    const t={at:''}; FIN_TOMB_KINDS.forEach(k=>{ t[k]=Array.isArray(d&&d[k])?d[k].filter(x=>typeof x==='string'&&x&&x.length<120).slice(-FIN_TOMB_CAP):[]; });
    if(d&&typeof d.at==='string') t.at=d.at.slice(0,40);
    return t;
  }
  function finTombGet(){ return window.__finTomb||(window.__finTomb=finTombNorm(null)); }
  function finTombHas(kind,id){
    const t=finTombGet(); if(!t._s) t._s={}; if(!t._s[kind]) t._s[kind]=new Set(t[kind]||[]);
    return id!=null&&t._s[kind].has(String(id));
  }
  // відкинути «надгробне» з памʼяті (без запису)
  function finTombApply(){
    const t=finTombGet(); if(!FIN_TOMB_KINDS.some(k=>t[k].length)) return 0;
    let n=0; const keep=(kind)=>x=>{ const dead=x&&x.id!=null&&finTombHas(kind,x.id); if(dead) n++; return !dead; };
    try{ finOps=(finOps||[]).filter(keep('ops')); }catch(_){}
    try{ envelopes=(envelopes||[]).filter(keep('env')); }catch(_){}
    try{ recurring=(recurring||[]).filter(keep('rec')); }catch(_){}
    try{ const pl=jnHero().plan; if(pl&&typeof pl==='object') Object.keys(pl).forEach(ym=>{ const p=pl[ym]; if(!p||typeof p!=='object') return;
      ['in','out'].forEach(k=>{ if(Array.isArray(p[k])) p[k]=p[k].filter(keep('plan')); }); }); }catch(_){}
    return n;
  }
  function finTombLoad(raw){
    // ключ не прочитався (хмара мовчить) — не скидаємо надгробки в памʼяті в порожнечу, лишаємо які були
    if(raw==null&&window.storeKeyReady&&!window.storeKeyReady('fin_tomb')&&window.__finTomb){ finTombApply(); return; }
    let d=null; try{ d=raw?JSON.parse(raw):null; }catch(_){}
    window.__finTomb=finTombNorm(d);
    const n=finTombApply(); if(n) try{ console.info('fin_tomb: приховано '+n+' стертих записів зі старої копії'); }catch(_){}
  }
  function finTombAdd(){
    const t=finTombGet(), add=(kind,ids)=>{ const s=new Set(t[kind]); ids.forEach(id=>{ if(id!=null&&id!=='') s.add(String(id)); }); t[kind]=[...s].slice(-FIN_TOMB_CAP); };
    add('ops',(finOps||[]).map(o=>o&&o.id));
    add('env',(envelopes||[]).map(e=>e&&e.id));
    try{ add('rec',(recurring||[]).map(r=>r&&r.id)); }catch(_){}
    try{ const pl=jnHero().plan||{}; add('plan',Object.values(pl).flatMap(p=>p&&typeof p==='object'?[].concat(p.in||[],p.out||[]):[]).map(r=>r&&r.id)); }catch(_){}
    try{ add('sal',Object.keys(workPostedSal||{}).filter(ym=>/^\d{4}-\d{2}$/.test(ym)&&workPostedSal[ym]==='deleted')); }catch(_){}
    t.at=new Date().toISOString(); delete t._s;
    const out={at:t.at}; FIN_TOMB_KINDS.forEach(k=>{ out[k]=t[k]; });
    try{ const q=window.storage.set('fin_tomb',JSON.stringify(out),false); if(q&&q.catch)q.catch(()=>{}); }catch(_){}
  }
