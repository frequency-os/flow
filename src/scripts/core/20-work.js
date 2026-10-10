  /* ============ WORK TRACKER (Робота) ============ */
  let workSessions=[];          // {id, date, hours, rate, cur, amount, note, pushed:bool, opId, src}
  let workRate=15;              // остання ставка
  let workCur='UAH';            // остання валюта
  let workMonth=(()=>{ const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`; })(); // YYYY-MM для календаря (локально)
  let workPayday=31;            // число місяця — день зарплати
  const WORKKEY='work_sessions', WORKCFGKEY='work_cfg';
  function saveWork(){
    try{ const p=window.storage.set(WORKKEY,JSON.stringify(workSessions),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
    try{ const q=window.storage.set(WORKCFGKEY,JSON.stringify({rate:workRate,cur:workCur,payday:workPayday,postedSal:workPostedSal,cardId:workCardId}),false); if(q&&q.catch)q.catch(()=>{}); }catch(_){}
  }
  function workHoursOn(ds){ return workSessions.filter(w=>w.date===ds).reduce((s,w)=>s+(+w.hours||0),0); }
  function workSessionsIn(ym){ return workSessions.filter(w=>String(w.date).slice(0,7)===ym); }

  const WK_MONTHS=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
  function renderWorkCal(){
    const grid=document.getElementById('wkCalGrid'); if(!grid) return;
    const [yy,mm]=workMonth.split('-').map(Number);
    const first=new Date(yy,mm-1,1); const start=(first.getDay()+6)%7; // Пн=0
    const days=new Date(yy,mm,0).getDate();
    const today=ymdLocal();
    const sym=CUR[workCur]||workCur;

    const mcm=document.getElementById('wkCalMonth'); if(mcm) mcm.textContent=WK_MONTHS[mm-1]+' '+yy;
    const monthSessions=workSessionsIn(workMonth);

    let cells='';
    ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].forEach(d=>cells+=`<span class="wkcal-wd">${d}</span>`);
    for(let i=0;i<start;i++) cells+=`<span class="wkcal-e"></span>`;
    const pday=Math.min(Math.max(parseInt(workPayday)||0,0),days);
    for(let d=1;d<=days;d++){
      const ds=`${workMonth}-${String(d).padStart(2,'0')}`;
      const h=workHoursOn(ds);
      const dow=(new Date(yy,mm-1,d).getDay()+6)%7;
      const we=dow>=5?'we':'';
      const has=h>0?'has':'';
      const td=ds===today?'today':'';
      const isPay=(pday>0 && d===pday)?'pay':'';
      cells+=`<div class="wkcal-d ${has} ${td} ${we} ${isPay}" data-wkday="${ds}">
        <span class="dn">${d}</span>${h>0?`<span class="dh">${fmt(h)}г</span>`:(isPay?`<span class="dp">💰</span>`:'')}</div>`;
    }
    grid.innerHTML=cells;
    grid.querySelectorAll('[data-wkday]').forEach(el=>el.onclick=()=>workTapDay(el.dataset.wkday));
  }

  let wkmDate=null; // дата, що редагується в модалці
  function workTapDay(ds){
    wkmDate=ds;
    const existing=workSessions.find(w=>w.date===ds && w.src==='cal');
    const d=new Date(ds).toLocaleDateString('uk-UA',{day:'numeric',month:'long',year:'numeric'});
    document.getElementById('wkmTitle').textContent=d;
    document.getElementById('wkmHours').value=existing?existing.hours:0;
    document.getElementById('wkmNote').value=existing?(existing.note||''):'';
    wkmRenderChips(); wkmUpdateMoney();
    document.getElementById('wkmBack').classList.add('on');
    setTimeout(()=>{ const i=document.getElementById('wkmHours'); if(i){ i.focus(); i.select(); } },60);
  }
  function wkmHoursVal(){ return parseFloat((document.getElementById('wkmHours').value||'').replace(',','.'))||0; }
  function wkmRate(){ return parseFloat((document.getElementById('wkRate').value||'').replace(',','.'))||workRate||0; }
  function wkmRenderChips(){
    const h=wkmHoursVal();
    document.getElementById('wkmChips').innerHTML=[4,6,8,10,12].map(n=>
      `<button data-wkc="${n}" class="${h===n?'on':''}">${n}г</button>`).join('');
    document.querySelectorAll('#wkmChips [data-wkc]').forEach(b=>b.onclick=()=>{
      document.getElementById('wkmHours').value=b.dataset.wkc; wkmRenderChips(); wkmUpdateMoney();
    });
  }
  function wkmUpdateMoney(){
    const h=wkmHoursVal(), r=wkmRate(), cur=document.getElementById('wkCur').value||workCur, sym=CUR[cur]||cur;
    const el=document.getElementById('wkmMoney');
    el.innerHTML = (h>0 && r>0) ? `≈ <b>${fmt(r*h)} ${sym}</b> · ${fmt(r)} ${sym}/год` : `${fmt(r)} ${sym}/год — впиши години`;
  }
  function wkmClose(){ document.getElementById('wkmBack').classList.remove('on'); wkmDate=null; }
  function wkmSave(){
    if(!wkmDate) return;
    const ds=wkmDate, h=wkmHoursVal(), r=wkmRate();
    const cur=document.getElementById('wkCur').value||workCur, sym=CUR[cur]||cur;
    const note=document.getElementById('wkmNote').value.trim();
    const existing=workSessions.find(w=>w.date===ds && w.src==='cal');
    if(!(h>0)){
      if(existing){
        if(existing.pushed && existing.opId){ finOps=finOps.filter(o=>String(o.id)!==String(existing.opId)); saveFinOps(); }
        workSessions=workSessions.filter(w=>w!==existing);
      }
    } else {
      if(r>0) workRate=r; workCur=cur;
      if(existing){
        existing.hours=h; existing.rate=r||existing.rate; existing.cur=cur; existing.note=note;
        existing.amount=Math.round((r||existing.rate)*h*100)/100;
        if(existing.pushed && existing.opId){
          const op=finOps.find(o=>String(o.id)===String(existing.opId));
          if(op){ op.amount=existing.amount; op.label='Робота · '+fmt(h)+' год'+(note?' · '+note:'')+(cur!=='UAH'?(' ('+fmt(existing.amount)+' '+sym+')'):''); saveFinOps(); }
        }
      } else {
        workSessions.push({ id:Date.now()+'_'+Math.random().toString(36).slice(2,6),
          date:ds, hours:h, rate:r||0, cur, amount:Math.round((r||0)*h*100)/100, note, pushed:false, opId:null, src:'cal' });
      }
    }
    saveWork(); renderWork(); try{renderFinance();}catch(_){}
    window.platform.haptic('success');
    wkmClose();
  }
  { const b=document.getElementById('wkmMinus'); if(b) b.onclick=()=>{ const i=document.getElementById('wkmHours'); i.value=Math.max(0,Math.round((wkmHoursVal()-0.5)*4)/4); wkmRenderChips(); wkmUpdateMoney(); }; }
  { const b=document.getElementById('wkmPlus'); if(b) b.onclick=()=>{ const i=document.getElementById('wkmHours'); i.value=Math.round((wkmHoursVal()+0.5)*4)/4; wkmRenderChips(); wkmUpdateMoney(); }; }
  { const i=document.getElementById('wkmHours'); if(i) i.addEventListener('input',()=>{ wkmRenderChips(); wkmUpdateMoney(); }); }
  { const b=document.getElementById('wkmSave'); if(b) b.onclick=wkmSave; }
  { const b=document.getElementById('wkmCancel'); if(b) b.onclick=wkmClose; }
  { const bg=document.getElementById('wkmBack'); if(bg) bg.onclick=(e)=>{ if(e.target===bg) wkmClose(); }; }
  { const n=document.getElementById('wkmNote'); if(n) n.addEventListener('keydown',e=>{ if(e.key==='Enter') wkmSave(); }); }


  function ymOffset(ym,off){
    const [y,m]=ym.split('-').map(Number);
    const total=(y*12)+(m-1)+off;
    const ny=Math.floor(total/12), nm=(total%12)+1;
    return `${ny}-${String(nm).padStart(2,'0')}`;
  }
  function renderWorkMonthStrip(){
    const el=document.getElementById('wkMonthStrip'); if(!el) return;
    let html='';
    for(let off=-4;off<=2;off++){
      const ym=ymOffset(workMonth,off);
      const [yy,mm]=ym.split('-').map(Number);
      const mh=workSessionsIn(ym).reduce((s,w)=>s+(+w.hours||0),0);
      const nm=WK_MONTHS[mm-1].slice(0,3);
      const on=ym===workMonth?'on':'';
      html+=`<div class="wk-mchip ${on}" data-wm="${ym}"><div class="m">${nm} ${String(yy).slice(2)}</div><div class="s">${mh>0?fmt(mh)+'г':'·'}</div></div>`;
    }
    el.innerHTML=html;
    el.querySelectorAll('[data-wm]').forEach(b=>b.onclick=()=>{ workMonth=b.dataset.wm; renderWork(); });
    const act=el.querySelector('.wk-mchip.on'); if(act) act.scrollIntoView({inline:'center',block:'nearest'});
  }

  function renderWorkSalary(monthEarned,sym){
    const amtEl=document.getElementById('wkSalaryAmt'); const subEl=document.getElementById('wkSalarySub');
    const labEl=document.querySelector('#scr-work .wk-salary-lab'); const dotEl=document.querySelector('#scr-work .wk-salary .dot');
    const box=document.querySelector('#scr-work .wk-salary');
    if(!amtEl) return;
    amtEl.textContent=fmt(monthEarned)+' '+sym;
    const [yy,mm]=workMonth.split('-').map(Number);
    const dim=new Date(yy,mm,0).getDate();
    const pday=Math.min(Math.max(parseInt(workPayday)||dim,1),dim);
    const ds=`${String(pday).padStart(2,'0')}.${String(mm).padStart(2,'0')}.${yy}`;
    const now=new Date(); const cY=now.getFullYear(), cMN=now.getMonth();
    const isCur=(yy===cY&&mm===cMN+1), isFuture=(yy>cY)||(yy===cY&&mm>cMN+1);
    const isPast=(yy<cY)||(yy===cY&&mm<cMN+1);

    // статус: locked (очікується) / unlocked (отримана)
    let status='locked';
    if(monthEarned>0){
      if(isFuture) status='locked';
      else if(isCur) status = now.getDate()>=pday ? 'unlocked' : 'locked';
      else if(isPast) status='unlocked';
    }

    if(box){ box.classList.toggle('paid', status==='unlocked'); }
    const planned=workPlannedTotal(workMonth);
    const planTxt = planned>0 ? ` · розподілено ${fmt(planned)} ${sym}, вільно ${fmt(Math.max(0,monthEarned-planned))} ${sym}` : '';
    if(status==='unlocked'){
      if(labEl) labEl.innerHTML='<span class="dot ok"></span>ЗАРПЛАТА ОТРИМАНА';
      subEl.textContent=`Прийшла ${ds} · додано у фінанси`;
      syncSalaryToFin(yy,mm,monthEarned,pday,sym);
    } else {
      const left = isCur ? (pday-now.getDate()) : null;
      if(labEl) labEl.innerHTML='<span class="dot"></span>ОЧІКУЄТЬСЯ ЗАРПЛАТА';
      subEl.textContent=`${ds}${(left!==null&&left>=0)?` · через ${left} ${pluralDaysWk(left)}`:''}${planTxt||' · плануй конверти заздалегідь'}`;
    }
  }
  function pluralDaysWk(n){const a=Math.abs(n)%100,b=a%10;if(a>=11&&a<=14)return'днів';if(b===1)return'день';if(b>=2&&b<=4)return'дні';return'днів';}

  // автосинхронізація зарплати у finOps (один раз на місяць, без дублів)
  let workPostedSal={}; // 'YYYY-MM' -> 'posted'|'deleted'
  let workExtras=[];    // {id, ym, kind:'advance'|'bonus'|'expense', amount, note, date}
  const WKEXTRAKEY='work_extras';
  // перемикачі/приховування блоків трекера
  let wkBlocks={stats:true,salary:true,rate:true,extras:true};
  const WKBLKKEY='work_blocks';
  function saveWkBlocks(){ try{ const p=window.storage.set(WKBLKKEY,JSON.stringify(wkBlocks),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function applyWkBlocks(){
    document.querySelectorAll('#scr-work .wk-block').forEach(el=>{
      const k=el.dataset.wkblock; el.classList.toggle('wk-hidden', wkBlocks[k]===false);
    });
    document.querySelectorAll('#wkToggles [data-wktog]').forEach(b=>{
      b.classList.toggle('on', wkBlocks[b.dataset.wktog]!==false);
    });
  }
  { document.querySelectorAll('#wkToggles [data-wktog]').forEach(b=>b.onclick=()=>{
      const k=b.dataset.wktog; wkBlocks[k]=(wkBlocks[k]===false); saveWkBlocks(); applyWkBlocks();
  }); }
  function saveExtras(){ try{ const p=window.storage.set(WKEXTRAKEY,JSON.stringify(workExtras),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  const EXTRA_META={advance:{ic:'➖',name:'Аванс',sign:-1,color:'#ff6b6f'},bonus:{ic:'➕',name:'Премія',sign:1,color:'#34c77b'},expense:{ic:'🧾',name:'Витрата',sign:-1,color:'#e8843c'}};
  function extrasIn(ym){ return workExtras.filter(x=>x.ym===ym); }
  function extrasNet(ym){ return extrasIn(ym).reduce((s,x)=>s+EXTRA_META[x.kind].sign*(+x.amount||0),0); }
  let extraKind=null;
  function addExtra(kind){
    const m=EXTRA_META[kind]; if(!m) return;
    extraKind=kind;
    const sym=CUR[workCur]||workCur;
    document.getElementById('extraIc').textContent=m.ic;
    document.getElementById('extraTitle').textContent=m.name;
    document.getElementById('extraLab').textContent='СУМА ('+sym+')';
    document.getElementById('extraAmt').value=0;
    document.getElementById('extraNote').value='';
    const presets = kind==='bonus'?[50,100,200,500]:[100,200,500,1000];
    document.getElementById('extraChips').innerHTML=presets.map(n=>`<button data-exc="${n}">${n}</button>`).join('');
    document.querySelectorAll('#extraChips [data-exc]').forEach(b=>b.onclick=()=>{ document.getElementById('extraAmt').value=b.dataset.exc; });
    document.getElementById('extraBack').classList.add('on');
    setTimeout(()=>{ const i=document.getElementById('extraAmt'); if(i){ i.focus(); i.select(); } },60);
  }
  function extraSave(){
    if(!extraKind) return;
    const amt=parseFloat((document.getElementById('extraAmt').value||'').replace(',','.'));
    if(!(amt>0)){ document.getElementById('extraAmt').focus(); return; }
    const note=document.getElementById('extraNote').value.trim();
    workExtras.push({ id:Date.now()+'_'+Math.random().toString(36).slice(2,6), ym:workMonth, kind:extraKind, amount:amt, note, date:ymdLocal() });
    saveExtras(); document.getElementById('extraBack').classList.remove('on'); extraKind=null; renderWork();
  }
  { const b=document.getElementById('extraMinus'); if(b) b.onclick=()=>{ const i=document.getElementById('extraAmt'); i.value=Math.max(0,(parseFloat(i.value)||0)-10); }; }
  { const b=document.getElementById('extraPlus'); if(b) b.onclick=()=>{ const i=document.getElementById('extraAmt'); i.value=(parseFloat(i.value)||0)+10; }; }
  { const b=document.getElementById('extraSave'); if(b) b.onclick=extraSave; }
  { const b=document.getElementById('wpkCancel'); if(b) b.onclick=()=>document.getElementById('wpkBack').classList.remove('on'); }
  { const bg=document.getElementById('wpkBack'); if(bg) bg.onclick=(e)=>{ if(e.target===bg) bg.classList.remove('on'); }; }
  { const b=document.getElementById('extraCancel'); if(b) b.onclick=()=>{ document.getElementById('extraBack').classList.remove('on'); extraKind=null; }; }
  { const bg=document.getElementById('extraBack'); if(bg) bg.onclick=(e)=>{ if(e.target===bg){ bg.classList.remove('on'); extraKind=null; } }; }
  { const n=document.getElementById('extraNote'); if(n) n.addEventListener('keydown',e=>{ if(e.key==='Enter') extraSave(); }); }
  function delExtra(id){ workExtras=workExtras.filter(x=>String(x.id)!==String(id)); saveExtras(); renderWork(); }
  function renderExtras(){
    const sym=CUR[workCur]||workCur;
    const net=extrasNet(workMonth);
    const ne=document.getElementById('wkExtrasNet');
    if(ne){ ne.textContent=(net>0?'+':net<0?'−':'±')+fmt(Math.abs(net))+' '+sym; ne.style.color=net>0?'#34c77b':net<0?'#ff6b6f':'var(--muted)'; }
    const list=document.getElementById('wkExtrasList'); if(!list) return;
    const rows=extrasIn(workMonth);
    list.innerHTML=rows.length?rows.slice().reverse().map(x=>{
      const m=EXTRA_META[x.kind]; const d=new Date(x.date).toLocaleDateString('uk-UA',{day:'numeric',month:'short'});
      return `<div class="wk-extra-row"><span class="ic">${m.ic}</span>
        <div class="mid"><b>${m.name}${x.note?' · '+esc(x.note):''}</b><small>${d}</small></div>
        <span class="amt" style="color:${m.color}">${m.sign>0?'+':'−'}${fmt(x.amount)} ${sym}</span>
        <button class="del" data-exdel="${esc(x.id)}">×</button></div>`;
    }).join(''):'';
    list.querySelectorAll('[data-exdel]').forEach(b=>b.onclick=()=>delExtra(b.dataset.exdel));
    document.querySelectorAll('#scr-work [data-extra]').forEach(b=>b.onclick=()=>addExtra(b.dataset.extra));
    applyWkBlocks();
  }

  function syncSalaryToFin(year,month,amount,pday,sym){
    if(!amount||amount<=0) return;
    const ymKey=`${year}-${String(month).padStart(2,'0')}`;
    if(workPostedSal[ymKey]==='deleted') return;
    const dim=new Date(year,month,0).getDate();
    const txDate=`${year}-${String(month).padStart(2,'0')}-${String(Math.min(pday,dim)).padStart(2,'0')}`;
    // Зарплата пишеться сама, без людини, — курс не питаємо. Раз записаний
    // курс живе в самій операції (op._fx їде в хмару разом з fin_ops), тож
    // пристрої рахують однаково і не перебивають одне одного. Перерахунок —
    // лише коли змінилась зароблена сума чи валюта Роботи.
    const code=finCurCode(workCur);
    let op=finOps.find(o=>o._autoSal===true && o._salYM===ymKey);
    const frozen=(op&&op._fx&&op._fx.cur===code&&+op._fx.rate>0)?+op._fx.rate:0;
    const fx=finFx(amount, code, code===mainCur()?1:(frozen||finLastRate(code)));
    const label='Зарплата · '+WK_MONTHS[month-1]+' '+year+fx.tail;
    const autoSave=fn=>{ if(window.storeAuto) window.storeAuto(fn); else fn(); };
    if(op){
      // записано при іншій головній валюті (старі — у ₴) — не перераховуємо: заморожений курс і суму не чіпаємо
      if((op._mc||'UAH')!==mainCur()) return;
      const fxSame=JSON.stringify(op._fx||null)===JSON.stringify(fx.fx);
      if(op.amount!==fx.amount || op.date!==txDate || !fxSame){   // підпис сам по собі не чіпаємо
        op.amount=fx.amount; op.date=txDate; op.label=label;
        if(fx.fx) op._fx=fx.fx; else delete op._fx;
        autoSave(()=>saveFinOps());
      }
      return;
    }
    let _wc; try{ ensureCards(); _wc=workCard().id; }catch(_){}
    op={ id:Date.now()+'_'+Math.random().toString(36).slice(2,6), type:'in', amount:fx.amount, label, date:txDate, _autoSal:true, _salYM:ymKey, card:_wc, _mc:mainCur() };
    // у Плані місяця є рядок «Зарплата» — привʼязуємо, щоб він став ✓, а не висів відкритим поруч із записаною зарплатою (47-rules.js)
    try{ const pl=typeof rlPlan==='function'?rlPlan(ymKey,false):null; const row=pl&&pl.in.find(r=>!rlRowCur(r)&&/зарплат|(^|[^а-яіїєґ])зп([^а-яіїєґ]|$)|salary/i.test(String(r.t||''))&&!rlPlanFact(ymKey,r.id)); if(row) op.planId=row.id; }catch(_){}
    if(fx.fx) op._fx=fx.fx;
    finOps.push(op); workPostedSal[ymKey]='posted'; autoSave(()=>{ saveFinOps(); saveWork(); });
    // коли зарплата прийшла — перелити заплановане у конверти
    transferPlannedToEnvelopes(ymKey);
    try{ renderFinance(); }catch(_){}
  }

  // переказ запланованого з конвертів у saved (один раз на місяць)
  function transferPlannedToEnvelopes(ymKey){
    if(!Array.isArray(envelopes) || !envelopes.length) return;
    if(!workPostedSal) workPostedSal={};
    if(workPostedSal['planDone:'+ymKey]==='1') return;
    let moved=false;
    envelopes.forEach(e=>{
      if(typeof envCur==='function'&&envCur(e)) return;   // €-конверт: заплановане в гривнях не переносимо сам (етап 3 валют)
      const p=(e.planned&&e.planned[ymKey])?+e.planned[ymKey]:0;
      if(p>0){
        if(typeof envAddOp==='function'){ let _wc2; try{ ensureCards(); _wc2=workCard().id; }catch(_){} envAddOp(e,'in',p,'Із зарплати ('+ymKey+')',_wc2); }
        else { e.saved=(+e.saved||0)+p; }
        delete e.planned[ymKey]; moved=true;
      }
    });
    if(moved){ workPostedSal['planDone:'+ymKey]='1'; saveEnvelopes(); saveWork(); }
  }

  /* ---- модалка розподілу зарплати наперед ---- */
  function workPlannedTotal(ymKey){
    if(!Array.isArray(envelopes)) return 0;
    return envelopes.reduce((s,e)=>s+((e.planned&&e.planned[ymKey])?+e.planned[ymKey]:0),0);
  }
  function openAllocModal(){
    const sym=CUR[workCur]||workCur;
    let me=workSessionsIn(workMonth).reduce((s,w)=>s+(+w.amount||0),0);
    const ymKey=workMonth;
    if(!(me>0)){ try{ me=finOps.filter(o=>o.type==='in'&&!o._tr&&String(o.date||'').slice(0,7)===workMonth).reduce((s,o)=>s+o.amount,0); }catch(_){} }
    if(!(me>0)){ flowAlert('Спершу додай дохід або познач відпрацьовані дні — буде що розподіляти.'); return; }
    if(!Array.isArray(envelopes) || !envelopes.length){
      flowAlert('Спершу створи конверти у Фінансах → ✉️ Конверти (напр. «Подушка», «Оренда»).'); return;
    }
    const list=document.getElementById('allocList');
    list.innerHTML=envelopes.filter(e=>!(typeof envCur==='function'&&envCur(e))).map(e=>{   // лише головна валюта
      const p=(e.planned&&e.planned[ymKey])?+e.planned[ymKey]:0;
      const goalTxt=e.goal?`ціль ${fmt(e.goal)} · є ${fmt(e.saved||0)}`:`є ${fmt(e.saved||0)}`;
      return `<div class="alloc-env">
        <div class="ic">${safeEmoji(e.emoji,'✉️')}</div>
        <div class="mid"><b>${esc(e.name)}</b><small>${goalTxt}</small></div>
        <div class="pinput"><input type="number" min="0" step="10" data-alloc="${esc(e.id)}" value="${p||''}" placeholder="0"><span>${sym}</span></div>
      </div>`;
    }).join('');
    list.querySelectorAll('[data-alloc]').forEach(inp=>inp.addEventListener('input',()=>allocUpdateSummary(me,sym)));
    allocUpdateSummary(me,sym);
    document.getElementById('allocBack').classList.add('on');
  }
  function allocUpdateSummary(me,sym){
    let planned=0;
    document.querySelectorAll('#allocList [data-alloc]').forEach(inp=>{ planned+=parseFloat(inp.value)||0; });
    const free=me-planned;
    document.getElementById('allocTotal').textContent=fmt(me)+' '+sym;
    document.getElementById('allocPlanned').textContent=fmt(planned)+' '+sym;
    const fEl=document.getElementById('allocFree');
    fEl.textContent=fmt(free)+' '+sym;
    fEl.style.color = free<0 ? '#ff6b6f' : '#34c77b';
    document.getElementById('allocBar').style.width=Math.min(100,me>0?planned/me*100:0)+'%';
  }
  function allocSave(){
    const ymKey=workMonth;
    document.querySelectorAll('#allocList [data-alloc]').forEach(inp=>{
      const e=envelopes.find(x=>String(x.id)===String(inp.dataset.alloc)); if(!e) return;
      if(!e.planned) e.planned={};
      const v=parseFloat(inp.value)||0;
      if(v>0) e.planned[ymKey]=v; else delete e.planned[ymKey];
    });
    saveEnvelopes();
    document.getElementById('allocBack').classList.remove('on');
    renderWork(); try{ renderFinance(); }catch(_){}
  }
  { const b=document.getElementById('wkAllocBtn'); if(b) b.onclick=openAllocModal; }
  { const b=document.getElementById('allocSave'); if(b) b.onclick=allocSave; }
  { const b=document.getElementById('allocCancel'); if(b) b.onclick=()=>document.getElementById('allocBack').classList.remove('on'); }
  { const bg=document.getElementById('allocBack'); if(bg) bg.onclick=(e)=>{ if(e.target===bg) bg.classList.remove('on'); }; }

  function renderWork(){
    const rt=document.getElementById('wkRate'); if(rt && !rt.value) rt.value=workRate||'';
    const cu=document.getElementById('wkCur'); if(cu) cu.value=workCur||'UAH';
    const pd=document.getElementById('wkPayday'); if(pd && !pd.value) pd.value=workPayday||'';
    const dt=document.getElementById('wkDate'); if(dt && !dt.value) dt.value=ymdLocal();
    const sym=CUR[workCur]||workCur;

    // одиниця ставки
    const ru=document.getElementById('wkRateUnit'); if(ru) ru.textContent=sym+'/год';

    // підсумки за обраний місяць (як на фото)
    const ms=workSessionsIn(workMonth);
    const mh=ms.reduce((s,w)=>s+(+w.hours||0),0);
    const me=ms.reduce((s,w)=>s+(+w.amount||0),0);
    const mdays=new Set(ms.filter(w=>w.hours>0).map(w=>w.date)).size;
    document.getElementById('wkHours').innerHTML=fmt(mh)+' <small>год</small>';
    document.getElementById('wkDays').textContent=mdays;
    document.getElementById('wkEarned').innerHTML=fmt(me)+' <small>'+sym+'</small>';

    // місяць-лейбли
    const [yy,mm]=workMonth.split('-').map(Number);
    const mlabel=WK_MONTHS[mm-1]+' '+yy;
    const ml=document.getElementById('wkMonthLbl'); if(ml) ml.textContent=mlabel;
    const mc=document.getElementById('wkCalMonth'); if(mc) mc.textContent=mlabel;

    // очікується зарплата (з урахуванням авансів/премій/витрат місяця)
    const net=extrasNet(workMonth);
    renderWorkSalary(me+net, sym);
    renderExtras();

    const monthShifts=workSessionsIn(workMonth);
    document.getElementById('wkLogCount').textContent=monthShifts.length;
    renderWorkMonthStrip();
    renderWorkCal();

    const log=document.getElementById('wkLog');
    if(!monthShifts.length){
      log.innerHTML=`<div class="empty"><div class="e">💼</div>За цей місяць ще порожньо.<br>Тапни день у календарі.</div>`;
    } else {
      log.innerHTML=monthShifts.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(w=>{
        const s=CUR[w.cur]||w.cur;
        const d=new Date(w.date).toLocaleDateString('uk-UA',{day:'numeric',month:'short'});
        const pushed=w.pushed?`<span class="wk-pushed" title="У фінансах">✓ у фінансах</span>`
                              :`<button class="wk-push" data-wkpush="${w.id}">→ у фінанси</button>`;
        return `<div class="wk-row">
          <div class="wk-main">
            <div class="wk-top"><b>${fmt(w.hours)} год</b> · ${fmt(w.rate)} ${s}/год${w.note?' · '+esc(w.note):''}</div>
            <div class="wk-meta">${d}</div>
          </div>
          <div class="wk-right">
            <div class="wk-amt">+${fmt(w.amount)} ${s}</div>
            ${pushed}
          </div>
          <button class="wk-del" data-wkdel="${w.id}">×</button>
        </div>`;
      }).join('');
    }

    const tools=document.getElementById('wkTools');
    const unpushed=monthShifts.filter(w=>!w.pushed);
    tools.innerHTML = monthShifts.length
      ? (unpushed.length?`<button class="toolbtn" id="wkPushAll">→ Додати зміни місяця у фінанси (${unpushed.length})</button>`:'')
        +`<button class="toolbtn" onclick="clearWorkMonth()">🗑️ Очистити зміни ${WK_MONTHS[parseInt(workMonth.slice(5,7))-1]}</button>`
      : '';

    // bind
    log.querySelectorAll('[data-wkdel]').forEach(b=>b.onclick=()=>delWork(b.dataset.wkdel));
    log.querySelectorAll('[data-wkpush]').forEach(b=>b.onclick=()=>pushWorkToFin(b.dataset.wkpush));
    const pa=document.getElementById('wkPushAll'); if(pa) pa.onclick=()=>pushWorkBatch(unpushed);
  }

  document.getElementById('wkAdd').onclick=()=>{
    const r=parseFloat((document.getElementById('wkRate').value||'').replace(',','.'));
    const h=parseFloat((document.getElementById('wkHrsInput').value||'').replace(',','.'));
    const cur=document.getElementById('wkCur').value;
    const date=document.getElementById('wkDate').value||ymdLocal();
    const note=document.getElementById('wkNote').value.trim();
    if(!(r>0)){ document.getElementById('wkRate').focus(); return; }
    if(!(h>0)){ document.getElementById('wkHrsInput').focus(); return; }
    workRate=r; workCur=cur;
    workSessions.push({ id:Date.now()+'_'+Math.random().toString(36).slice(2,6),
      date, hours:h, rate:r, cur, amount:Math.round(r*h*100)/100, note, pushed:false, opId:null });
    document.getElementById('wkHrsInput').value=''; document.getElementById('wkNote').value='';
    saveWork(); renderWork();
    window.platform.haptic('success');
  };
  // ставка / день зарплати — зберігаємо й перераховуємо
  { const el=document.getElementById('wkRate'); if(el) el.addEventListener('input',()=>{
      const v=parseFloat((el.value||'').replace(',','.')); if(v>=0) workRate=v; saveWork(); renderWork();
    }); }
  { const el=document.getElementById('wkPayday'); if(el) el.addEventListener('input',()=>{
      const v=parseInt(el.value); if(v>=1&&v<=31){ workPayday=v; saveWork(); }
      const sym=CUR[workCur]||workCur; const ms=workSessionsIn(workMonth); const me=ms.reduce((s,w)=>s+(+w.amount||0),0);
      renderWorkSalary(me,sym);
    }); }
  { const el=document.getElementById('wkCur'); if(el) el.addEventListener('change',()=>{
      workCur=el.value; saveWork(); renderWork();
    }); }
  { const el=document.getElementById('wkToFin'); if(el) el.onclick=()=>{
      const unp=workSessions.filter(w=>!w.pushed && String(w.date).slice(0,7)===workMonth);
      if(!unp.length){ flowAlert('Усі зміни цього місяця вже у фінансах (або їх немає).'); return; }
      pushWorkBatch(unp);
    }; }
  function workShiftMonth(dir){
    workMonth=ymOffset(workMonth,dir);
    renderWork();
  }
  { const p=document.getElementById('wkCalPrev'); if(p) p.onclick=()=>workShiftMonth(-1); }
  { const n=document.getElementById('wkCalNext'); if(n) n.onclick=()=>workShiftMonth(1); }

  // пачка змін: курс кожної чужої валюти питаємо ОДИН раз, а не на кожну зміну
  function pushWorkBatch(list){
    const need=[...new Set(list.map(w=>finCurCode(w.cur)).filter(c=>c!==mainCur()))];
    const rates={};
    const next=()=>{
      const c=need.shift();
      if(c){ finAskRate(c, r=>{ rates[c]=r; next(); }); return; }
      list.forEach(w=>pushWorkToFin(w.id,true,rates));
      saveWork(); renderWork(); try{renderFinance();}catch(_){}
      try{ window.platform.haptic('success'); }catch(_){}
    };
    next();
  }
  // rates — {EUR:48.6,…}: курс, уже спитаний для пачки змін; без нього питаємо самі
  function pushWorkToFin(id, batch, rates){
    const w=workSessions.find(x=>String(x.id)===String(id));
    if(!w || w.pushed) return;
    const code=finCurCode(w.cur);
    if(code!==mainCur() && !(rates&&rates[code]>0)){
      finAskRate(code, r=>pushWorkToFin(id, batch, Object.assign({}, rates, {[code]:r})));
      return;
    }
    const opId=Date.now()+'_'+Math.random().toString(36).slice(2,6);
    const lbl='Робота · '+fmt(w.hours)+' год'+(w.note?' · '+w.note:'');
    finOps.push(finOpFx({ id:opId, type:'in', label:lbl, date:w.date, card:WALLET_ID }, w.amount, code, code===mainCur()?1:rates[code]));
    w.pushed=true; w.opId=opId;
    saveFinOps(); saveWork();
    if(!batch){ renderWork(); try{ renderFinance(); }catch(_){} 
      window.platform.haptic('success');
    }
  }

  function delWork(id){
    const w=workSessions.find(x=>String(x.id)===String(id));
    // якщо вже у фінансах — прибрати і пов'язану операцію
    if(w && w.pushed && w.opId){
      finOps=finOps.filter(o=>String(o.id)!==String(w.opId));
      saveFinOps();
    }
    workSessions=workSessions.filter(x=>String(x.id)!==String(id));
    saveWork(); renderWork(); try{ renderFinance(); }catch(_){}
  }
  function clearWorkMonth(){
    const mName=WK_MONTHS[parseInt(workMonth.slice(5,7))-1]+' '+workMonth.slice(0,4);
    confirmSheet({title:'Видалити зміни за '+mName+'?', sub:'Пов’язані доходи у фінансах теж приберуться.', onOk:()=>{
    const month=workSessionsIn(workMonth);
    const ids=month.filter(w=>w.opId).map(w=>w.opId);
    if(ids.length){ finOps=finOps.filter(o=>!ids.includes(o.id)); saveFinOps(); }
    // прибрати авто-зарплату цього місяця
    finOps=finOps.filter(o=>!(o._autoSal && o._salYM===workMonth));
    delete workPostedSal[workMonth];
    workSessions=workSessions.filter(w=>String(w.date).slice(0,7)!==workMonth);
    saveWork(); saveFinOps(); renderWork(); try{ renderFinance(); }catch(_){}
    }});
  }

