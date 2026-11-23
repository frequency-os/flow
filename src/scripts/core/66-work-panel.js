  /* ════════ Папка «Робота»: блок wgworkpanel (22.11.2026) — варіант A «Конвеєр» ════════
     Години → зарплата → конверти одним блоком на сторінці папки: смуга шляху грошей, календар годин
     місяця (тап по дню — та сама шторка, що на екрані Роботи), «＋ Години сьогодні», «Куди піде зарплата».
     Блок НІЧОГО свого не зберігає (лише id у дошці): читає години й ставку (20-work.js), зарплату
     в Гаманці (wkMoneyInfo, 51-money-reset.js) і конверти (08-finance.js). Пише тільки тапом людини
     тими ж функціями Роботи: workTapDay (години), openAllocModal (розподіл). Підключено в 48-widgets.js
     (WG_TYPES, wgHTML, wgAct → wkpAct). Повний екран Роботи (ставка, день виплати, аванси) — «Налаштування». */
  const wkpYm={};   // місяць, який гортає блок (лише памʼять, як wdCalYm)
  const WKP_ENV_C=['#f0b429','#34c77b','#5ec8ff','#ff7a9c','#9b8cff','#ff9a4d'];
  function wkpMonth(id){ return wkpYm[id]||ymdLocal().slice(0,7); }
  function wkpMoney(n,sym){ return fmt(Math.round(n))+' '+sym; }
  // скільки зарплати цього місяця вже лягло в конверт (рух «Із зарплати (РРРР-ММ)», 20-work.js transferPlannedToEnvelopes)
  function wkpMoved(e,ym){ try{ envMigrate(e); }catch(_){ return 0; }
    const lbl='Із зарплати ('+ym+')'; return (e.ops||[]).filter(o=>o&&o.t==='in'&&o.label===lbl).reduce((s,o)=>s+(+o.amount||0),0); }
  // конверти головної валюти з сумою на місяць: заплановано (до виплати) або вже переказано (після)
  function wkpEnvRows(ym){
    const L=Array.isArray(envelopes)?envelopes.filter(e=>e&&!(typeof envCur==='function'&&envCur(e))):[];
    return L.map((e,i)=>{ const plan=e.planned&&+e.planned[ym]>0?+e.planned[ym]:0, moved=wkpMoved(e,ym);
      return {e, sum:plan+moved, moved, plan, c:WKP_ENV_C[i%WKP_ENV_C.length]}; }).filter(r=>r.sum>0);
  }
  function wkpCalHTML(ym){
    const [yy,mm]=ym.split('-').map(Number), start=(new Date(yy,mm-1,1).getDay()+6)%7, dim=new Date(yy,mm,0).getDate();
    const td=ymdLocal(), pday=Math.min(Math.max(parseInt(workPayday)||dim,1),dim);
    let h=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(d=>`<span class="wkp-wd" aria-hidden="true">${d}</span>`).join('');
    for(let i=0;i<start;i++) h+='<span class="wkp-e" aria-hidden="true"></span>';
    for(let d=1;d<=dim;d++){
      const ds=ym+'-'+String(d).padStart(2,'0'), hr=workHoursOn(ds);
      const cls=(hr>0?' on':'')+(ds===td?' td':'')+(ds>td?' fu':'')+(d===pday?' pay':'');
      const lab=d+' '+MO_NAMES[mm-1].toLowerCase()+(hr>0?', '+fmt(hr)+' год':', без годин')+(d===pday?', день виплати':'');
      h+=`<button class="wkp-d${cls}" data-wga="wkp:day" data-d="${ds}" aria-label="${esc(lab)}"><span>${d}</span><b>${hr>0?esc(fmt(hr))+'г':d===pday?'₴':''}</b></button>`;
    }
    return h;
  }
  function wkPanelHTML(b){
    const id=b&&b.id||'', ym=wkpMonth(id), sym=CUR[workCur]||workCur;
    let i=null; try{ i=wkMoneyInfo(ym); }catch(_){}
    i=i||{hours:0,earned:0,pday:31,paid:false,due:false};
    const ss=workSessionsIn(ym), days=new Set(ss.filter(w=>+w.hours>0).map(w=>w.date)).size;
    const td=ymdLocal(), cur=ym===td.slice(0,7), left=cur?Math.max(0,i.pday-+td.slice(8,10)):0;
    const rows=wkpEnvRows(ym), env=rows.reduce((s,r)=>s+r.sum,0), free=Math.max(0,i.earned-env);
    const salSub=i.paid?'✓ у Гаманці':i.skip?'не записується':cur&&!i.due?(left?'через '+left+' '+pluralUk(left,'день','дні','днів'):'сьогодні'):i.due&&!i.paid?'чекає запису':'виплата '+i.pday+'-го';
    const mn=MO_NAMES[+ym.slice(5,7)-1];
    const sal=i.paid?i.salOp:null, extra=sal&&sal._amt0!=null?Math.round((+sal.amount||0)-(+sal._amt0||0)):0;   // години, додані після виплати
    const msym=CUR[mainCur()]||mainCur();
    const pct=n=>i.earned>0?Math.max(0,Math.min(100,n/i.earned*100)).toFixed(1):'0';
    return `<div class="wkp">
      <div class="wkp-flow">
        <div class="wkp-st"><small>Години</small><b>${esc(fmt(i.hours))}</b><span>${days} ${pluralUk(days,'день','дні','днів')}</span></div>
        <svg class="wkp-ar hr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
        <div class="wkp-st sal"><small>Зарплата</small><b>${esc(wkpMoney(i.earned,sym))}</b><span>${esc(salSub)}</span></div>
        <svg class="wkp-ar env" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
        <div class="wkp-st env"><small>Конверти</small><b>${esc(wkpMoney(env,sym))}</b><span class="wkp-free">вільно ${esc(fmt(Math.round(free)))}</span></div>
      </div>
      ${extra>=1?`<div class="wkp-extra"><span class="wkp-ex-ic" aria-hidden="true">＋</span><span class="wkp-ex-t"><b>Доплата +${esc(fmt(extra))} ${esc(msym)}</b><small>години, додані після виплати</small></span><button data-wga="wkp:alloc">Розкласти</button></div>`:''}
      <div class="wkp-card">
        <div class="wkp-hd"><button class="wkp-nav" data-wga="wkp:prev" aria-label="Попередній місяць">‹</button><b>${esc(mn)} ${esc(ym.slice(0,4))}</b><button class="wkp-nav" data-wga="wkp:next" aria-label="Наступний місяць">›</button></div>
        <div class="wkp-cal">${wkpCalHTML(ym)}</div>
        <button class="wkp-main" data-wga="wkp:today">＋ Години сьогодні</button>
      </div>
      <div class="wkp-card">
        <div class="wkp-hd2"><b>Куди піде зарплата</b><small>${i.paid?'вже розкладено':esc(String(i.pday))+'-го, сама'}</small></div>
        ${rows.length?`<div class="wkp-bar" aria-hidden="true">${rows.map(r=>`<i style="width:${pct(r.sum)}%;background:${r.c}"></i>`).join('')}<i class="wkp-free" style="width:${pct(free)}%"></i></div>
        <div class="wkp-rows">${rows.map(r=>`<div class="wkp-row"><span class="dot" style="background:${r.c}"></span><span class="n">${esc(String(r.e.name||'Конверт'))}</span><b>${esc(wkpMoney(r.sum,sym))}</b></div>`).join('')}
          <div class="wkp-row mu"><span class="dot"></span><span class="n">Вільно в Гаманці</span><b>${esc(wkpMoney(free,sym))}</b></div></div>`
        :`<p class="wkp-empty">${Array.isArray(envelopes)&&envelopes.length?'Розклади зарплату по конвертах — Оренда, Подушка… Решта лишиться вільною в Гаманці.':'Конвертів ще нема — створи їх у Гаманці, і тут можна буде розкласти зарплату наперед.'}</p>`}
        <div class="wkp-acts"><button data-wga="wkp:alloc">${rows.length?'Змінити розподіл':'Розкласти зарплату'}</button><button data-wga="wkp:full">Ставка й аванси</button></div>
      </div>
    </div>`;
  }
  function wkpAct(a,el,id){
    const ym=wkpMonth(id);
    if(a==='day'){ const d=String(el.dataset.d||''); if(/^\d{4}-\d\d-\d\d$/.test(d)) workTapDay(d); return; }
    if(a==='today'){ workTapDay(ymdLocal()); return; }
    if(a==='prev'||a==='next'){ wkpYm[id]=ymOffset(ym,a==='next'?1:-1); wgRefresh(); return; }
    if(a==='alloc'){ workMonth=ym; openAllocModal(); return; }
    if(a==='full'){ workMonth=ym; goWork(); return; }
  }
