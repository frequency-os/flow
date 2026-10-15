  /* ════════ «Забіг» (56-run.js, 15.10.2026) — відлік до дати з власними цілями ════════
     Задум погоджено 14–15.10.2026: варіант A «Забіг» (макети — артефакт «Забіг до дати»),
     графік «гроші з часом» — окремим етапом 2.
     Смужка вгорі вкладки «День» Журналу → шторка: старт (дата фінішу + 1–3 «свої числа»),
     повна картка (відлік, мої цілі, «Програма помітила сама»), фініш «було → стало».
     Дані — у goals_data, нового ключа сховища нема (як лист у 40-year-letter.js):
       goalsData.run = {id, title, start:'YYYY-MM-DD', end:'YYYY-MM-DD', endedAt?:'YYYY-MM-DD',
                        base:{xp, lv}, goals:[{id, t, unit, from, to, log:[{ds, v}]}]}
       goalsData.runsDone = [той самий обʼєкт + closed:'YYYY-MM-DD', cancelled?:true] — архів, нічого не видаляється;
       після закриття goalsData.run = {id, closed} — «надгробок», не null (див. rnArchive).
     Точка А (base) — знімок досвіду героя й зроблених рівнів місій у момент «Почати».
     Гроші — дохід мінус витрати за записами з датою в межах забігу (wlAgg) — знімок балансу не потрібен.
     Записи — лише після натискання людини і лише коли goals_data прочитано (rnReady).
     Лічильник на Огляді (21-newyear-countdown.js) рахує до фінішу через window.runTarget;
     нашивка «Фініш» у шафі героя (48-hero.js) відкривається через window.runFinishedAny.
     Тексти — парами uk/en, без родових форм. */
  const rnLang=()=>{ try{ return (window.flowLang&&window.flowLang())==='en'?'en':'uk'; }catch(_){ return 'uk'; } };
  const RN_T={
    uk:{title:'Забіг', close:'Закрити', start:'Почати забіг', startSub:'Відлік до дати з твоїми цілями',
      when:'Коли фініш', ny:'1 січня', d90:'90 днів', d30:'30 днів', own:'Своя дата', to:'До ',
      name:'Назва', namePh:'Можна без неї: «Зима», «Нова форма»…',
      goals:'Мої цілі забігу', goalHint:'Своє число: було → мета. Нове значення записується, коли зручно.',
      gName:'Що рахуємо', gNamePh:'Вага, кілометри, сторінки…', gUnit:'Одиниця', gUnitPh:'кг', gFrom:'Було', gTo:'Мета',
      addGoal:'+ Ще ціль', rmGoal:'Прибрати ціль', go:'Почати',
      errDate:'Фініш має бути пізніше за сьогодні', errGoal:'Потрібна хоча б одна ціль: назва, «було» і «мета» — різні числа',
      wait:'Ще вантажу твої цілі — спробуй за мить',
      left:'лишилось', dayOf:(n,m)=>'день '+n+' з '+m, moving:(a,b)=>a+' з '+b+' '+pluralUk(b,'цілі','цілей','цілей')+' рухаються',
      mine:'Мої цілі', noted:'Програма помітила сама',
      motion:(a,b)=>a+' з '+b+' '+pluralUk(b,'дня','днів','днів')+' в русі', best:n=>'найдовша серія '+n,
      xp:'досвіду', net:'чистими', lv:n=>n+' '+pluralUk(n,'рівень','рівні','рівнів')+' місій', notes:n=>n+' '+pluralUk(n,'запис','записи','записів')+' у Щоденнику',
      write:'+ записати', val:'Значення сьогодні', save:'Зберегти', saved:'✓ Записано', back:'Назад', last:'востаннє ',
      errVal:'Вкажи число',
      endEarly:'Завершити зараз', cancel:'Скасувати', sureCancel:'Скасувати забіг? Він піде в архів без фінішу.',
      sureEnd:'Завершити сьогодні й подивитись підсумок?', yesCancel:'Так, скасувати', yesEnd:'Так, завершити', no:'Ні',
      finH:'Фініш!', finSub:'Ось що змінилось', finStrip:'Фініш! Подивись, що змінилось', was:'було', hit:'мету досягнуто',
      patch:'У шафі героя відкрилась нашивка «Фініш»', archive:'Закрити забіг', newRun:'Новий забіг',
      started:'🏁 Забіг почався', cancelled:'Забіг скасовано — він в архіві', closed:'Забіг у архіві. Так тримати!',
      aria:'Забіг — відкрити'},
    en:{title:'Run', close:'Close', start:'Start a run', startSub:'A countdown to a date with your own goals',
      when:'Finish date', ny:'Jan 1', d90:'90 days', d30:'30 days', own:'Pick a date', to:'Until ',
      name:'Name', namePh:'Optional: “Winter”, “New shape”…',
      goals:'Goals for this run', goalHint:'Your own number: from → target. Log a new value whenever it suits you.',
      gName:'What to track', gNamePh:'Weight, kilometres, pages…', gUnit:'Unit', gUnitPh:'kg', gFrom:'From', gTo:'Target',
      addGoal:'+ Another goal', rmGoal:'Remove goal', go:'Start',
      errDate:'The finish has to be after today', errGoal:'Add at least one goal: a name, and “from” and “target” as different numbers',
      wait:'Still loading your goals — try in a moment',
      left:'left', dayOf:(n,m)=>'day '+n+' of '+m, moving:(a,b)=>a+' of '+b+' goals moving',
      mine:'My goals', noted:'Noticed by the app',
      motion:(a,b)=>a+' of '+b+' days in motion', best:n=>'longest streak '+n,
      xp:'XP', net:'net', lv:n=>n+' mission '+(n===1?'level':'levels'), notes:n=>n+' journal '+(n===1?'entry':'entries'),
      write:'+ log', val:'Value today', save:'Save', saved:'✓ Logged', back:'Back', last:'last ',
      errVal:'Enter a number',
      endEarly:'Finish now', cancel:'Cancel', sureCancel:'Cancel this run? It goes to the archive without a finish.',
      sureEnd:'Finish today and see the summary?', yesCancel:'Yes, cancel', yesEnd:'Yes, finish', no:'No',
      finH:'Finish!', finSub:'Here is what changed', finStrip:'Finish! See what changed', was:'from', hit:'target reached',
      patch:'The “Finish” patch is now open in the hero wardrobe', archive:'Close the run', newRun:'New run',
      started:'🏁 The run has started', cancelled:'Run cancelled — it is in the archive', closed:'Run archived. Keep going!',
      aria:'Run — open'}
  };
  const rnT=k=>(RN_T[rnLang()]||RN_T.uk)[k];
  const RN_MON_G=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
  const RN_MAX_DAYS=730;   // своя дата — не далі двох років
  let rnDraft=null;        // чернетка форми старту (лише в памʼяті шторки)

  /* goals_data прочитано зі сховища? До того goalsData — заводська заглушка, і saveGoals() затер би справжні цілі */
  function rnReady(){ try{ return typeof window.storeKeyReady!=='function'||window.storeKeyReady('goals_data')===true; }catch(_){ return false; } }

  // ── дати ──
  function rnOkDs(ds){ return typeof ds==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(ds); }
  function rnD(ds){ return new Date(+ds.slice(0,4),+ds.slice(5,7)-1,+ds.slice(8,10)); }
  function rnDiff(a,b){ return Math.round((rnD(b)-rnD(a))/864e5); }
  function rnAdd(ds,n){ const d=rnD(ds); d.setDate(d.getDate()+n); return ymdLocal(d); }
  function rnDateTxt(ds){
    if(!rnOkDs(ds)) return '';
    if(rnLang()==='en') return rnD(ds).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    return (+ds.slice(8))+' '+RN_MON_G[+ds.slice(5,7)-1]+' '+ds.slice(0,4);
  }
  function rnDaysWord(n){ return rnLang()==='en'?(n===1?'day':'days'):pluralUk(n,'день','дні','днів'); }
  function rnNum(v){ const n=Math.round((+v||0)*100)/100; return n.toLocaleString(rnLang()==='en'?'en-US':'uk-UA'); }
  function rnParse(s){ const n=parseFloat(String(s==null?'':s).replace(/\s/g,'').replace(',','.')); return isFinite(n)?n:null; }
  function rnId(p){ return p+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }

  // ── дані забігу ──
  function rnGoalNorm(g){
    if(!g||typeof g!=='object') return null;
    const from=+g.from, to=+g.to; if(!isFinite(from)||!isFinite(to)) return null;
    const log=Array.isArray(g.log)?g.log.filter(x=>x&&rnOkDs(x.ds)&&isFinite(+x.v)):[];
    return {id:String(g.id||''), t:String(g.t||''), unit:String(g.unit||''), from, to, log};
  }
  function rnCur(){
    const r=goalsData&&goalsData.run;
    if(!r||typeof r!=='object'||!rnOkDs(r.start)||!rnOkDs(r.end)) return null;
    return r;
  }
  function rnGoals(r){ return (Array.isArray(r.goals)?r.goals:[]).map(rnGoalNorm).filter(Boolean); }
  function rnEnd(r){ return rnOkDs(r.endedAt)?r.endedAt:r.end; }
  function rnOver(r){ return ymdLocal()>=rnEnd(r); }
  function rnVal(g){ return g.log.length?+g.log[g.log.length-1].v:g.from; }
  function rnPct(g){ const span=g.to-g.from; if(!span) return 0; return Math.max(0,Math.min(1,(rnVal(g)-g.from)/span)); }
  function rnMoving(g){ return (rnVal(g)-g.from)*(g.to-g.from)>0; }
  function rnHit(g){ return g.to>=g.from?rnVal(g)>=g.to:rnVal(g)<=g.to; }
  function rnTime(r){
    const td=ymdLocal(), end=rnEnd(r), total=Math.max(1,rnDiff(r.start,end));
    const n=Math.max(1,Math.min(total,rnDiff(r.start,td)+1)), left=Math.max(0,rnDiff(td,end));
    return {total, n, left, pct:Math.round(Math.min(1,Math.max(0,rnDiff(r.start,td)/total))*100)};
  }
  function rnLvDone(){ try{ return (goalsData.goals||[]).reduce((s,g)=>s+(g?jnLevels(g).filter(m=>m.done).length:0),0); }catch(_){ return 0; } }
  function rnXP(){ try{ return jnHeroXP(); }catch(_){ return 0; } }

  /* «Програма помітила сама»: усе з наявних даних, кожне у своєму try — одна зламана система не валить картку */
  function rnStats(r){
    // останній день періоду: сьогодні; після фінішу за датою — переддень фінішу (1 січня вже не рахується);
    // «Завершити зараз» — день завершення включно
    const td=ymdLocal(), end=rnEnd(r), last=td<end?td:rnOkDs(r.endedAt)?r.endedAt:rnAdd(end,-1);
    const s={days:0, motion:0, best:0, xp:0, lv:0, money:null, notes:0};
    try{
      let run=0;
      for(let ds=r.start, i=0; ds<=last&&i<=RN_MAX_DAYS; ds=rnAdd(ds,1), i++){
        s.days++;
        if(dayInMotion(ds)){ s.motion++; run++; if(run>s.best) s.best=run; } else run=0;
      }
    }catch(_){}
    const b=r.base&&typeof r.base==='object'?r.base:{};
    s.xp=Math.max(0,rnXP()-(+b.xp||0));
    s.lv=Math.max(0,rnLvDone()-(+b.lv||0));
    // гроші — те саме правило, що в Гаманці (wlAgg): дохід мінус справжні витрати; перекази, обмін,
    // поповнення конвертів і стартовий залишок не рахуються — відкладене в скарбничку не стає «мінусом»
    try{ const a=wlAgg((finOps||[]).filter(o=>o&&rnOkDs(o.date)&&o.date>=r.start&&o.date<=last&&!String(o.id||'').startsWith('start_'))); s.money=a.inc-a.out; }catch(_){}
    try{ Object.keys(diaryEntries||{}).forEach(ds=>{ const e=diaryEntries[ds]; if(ds>=r.start&&ds<=last&&e&&e.text&&String(e.text).trim()) s.notes++; }); }catch(_){}
    return s;
  }

  // ── для інших систем ──
  // Огляд: Date фінішу активного забігу (опівночі), інакше null
  window.runTarget=function(){ try{ const r=rnCur(); return r&&!rnOver(r)?rnD(rnEnd(r)):null; }catch(_){ return null; } };
  // шафа героя: чи був хоч один фініш (у тому числі ще не закритий забіг, у якого настала дата)
  window.runFinishedAny=function(){
    try{
      if((goalsData.runsDone||[]).some(x=>x&&typeof x==='object'&&!x.cancelled)) return true;
      const r=rnCur(); return !!(r&&rnOver(r));
    }catch(_){ return false; }
  };

  // ── смужка на вкладці «День» ──
  function runStripHTML(){
    if(!rnReady()) return '';
    const r=rnCur();
    if(!r) return `<button class="rn-strip ghost" data-rnopen><span class="rn-em" aria-hidden="true">🏁</span><span class="rn-sb"><b>${rnT('start')}</b><small>${rnT('startSub')}</small></span><i aria-hidden="true">›</i></button>`;
    const title=String(r.title||'').trim();
    if(rnOver(r)) return `<button class="rn-strip fin" data-rnopen><span class="rn-em" aria-hidden="true">🏁</span><span class="rn-sb"><b>${rnT('finStrip')}</b><small>${esc(title||rnT('title'))}</small></span><i aria-hidden="true">›</i></button>`;
    const tm=rnTime(r), gs=rnGoals(r), mv=gs.filter(rnMoving).length;
    return `<button class="rn-strip" data-rnopen aria-label="${rnT('aria')}"><span class="rn-em" aria-hidden="true">🏁</span>
      <span class="rn-sb"><b>${tm.left} ${rnDaysWord(tm.left)} · ${rnT('dayOf')(tm.n,tm.total)}</b>
      <small>${title?esc(title)+' · ':''}${gs.length?rnT('moving')(mv,gs.length):''}</small>
      <span class="rn-bar sm"><i style="width:${tm.pct}%"></i></span></span><i aria-hidden="true">›</i></button>`;
  }
  function runBind(body){ body.querySelectorAll('[data-rnopen]').forEach(b=>b.onclick=()=>runOpen()); }

  // ── шторка ──
  function rnHead(t){ return `<div class="jn-ed-h"><b>🏁 ${t}</b><button data-jnx aria-label="${rnT('close')}">✕</button></div>`; }
  function rnStatsHTML(r){
    const s=rnStats(r), mo=s.money;
    const chips=[
      '✓ '+rnT('motion')(s.motion,s.days),
      '🔥 '+rnT('best')(s.best),
      '⭐ +'+rnNum(s.xp)+' '+rnT('xp'),
      '🎯 '+rnT('lv')(s.lv),
      mo===null?'':'💳 '+(mo>0?'+':'')+money(mo)+' '+rnT('net'),
      '📓 '+rnT('notes')(s.notes)
    ].filter(Boolean);
    return `<div class="rn-sec">${rnT('noted')}</div><div class="rn-chips">${chips.map(c=>`<span>${esc(c)}</span>`).join('')}</div>`;
  }
  function rnGoalHTML(g,fin){
    const c=rnVal(g), u=g.unit?' '+esc(g.unit):'', l=g.log.length?g.log[g.log.length-1].ds:'';
    if(fin) return `<div class="rn-goal"><div class="rn-gh"><b>${esc(g.t)}</b>${rnHit(g)?`<em>✓ ${rnT('hit')}</em>`:''}</div>
      <div class="rn-ba"><span>${rnT('was')} ${rnNum(g.from)}${u}</span><i aria-hidden="true">→</i><b>${rnNum(c)}${u}</b></div>
      <div class="rn-gf"><small>${rnT('gTo').toLowerCase()} ${rnNum(g.to)}${u}</small><button class="jn-mini" data-rnlog="${esc(g.id)}">${rnT('write')}</button></div></div>`;
    return `<div class="rn-goal"><div class="rn-gh"><b>${esc(g.t)}</b><span>${rnNum(c)}${u}</span></div>
      <span class="rn-bar"><i style="width:${Math.round(rnPct(g)*100)}%"></i></span>
      <div class="rn-gf"><small>${rnNum(g.from)} → ${rnNum(g.to)}${u}${l?' · '+rnT('last')+esc(rnDateTxt(l)):''}</small><button class="jn-mini" data-rnlog="${esc(g.id)}">${rnT('write')}</button></div></div>`;
  }
  function rnCardHTML(r){
    const tm=rnTime(r), gs=rnGoals(r), title=String(r.title||'').trim();
    return `${rnHead(esc(title||rnT('title')))}
      <div class="rn-hero"><span class="rn-big">${tm.left}</span><span class="rn-sb"><b>${rnDaysWord(tm.left)} ${rnT('left')}</b>
        <small>${rnT('to')}${esc(rnDateTxt(rnEnd(r)))} · ${rnT('dayOf')(tm.n,tm.total)}</small></span></div>
      <span class="rn-bar"><i style="width:${tm.pct}%"></i></span>
      <div class="rn-sec">${rnT('mine')}</div>
      ${gs.map(g=>rnGoalHTML(g,false)).join('')}
      ${rnStatsHTML(r)}
      <div class="jn-ed-foot" data-rnfoot><button class="jn-btn ghost" data-rnend>${rnT('endEarly')}</button><button class="jn-btn danger" data-rncancel>${rnT('cancel')}</button></div>`;
  }
  function rnFinHTML(r){
    const gs=rnGoals(r), title=String(r.title||'').trim(), tm=rnTime(r);
    return `${rnHead(rnT('finH'))}
      <small class="rn-note">${esc(title?title+' · ':'')}${esc(rnDateTxt(r.start))} → ${esc(rnDateTxt(rnEnd(r)))} · ${tm.total} ${rnDaysWord(tm.total)}</small>
      <div class="rn-sec">${rnT('finSub')}</div>
      ${gs.map(g=>rnGoalHTML(g,true)).join('')}
      ${rnStatsHTML(r)}
      <div class="rn-patch"><span aria-hidden="true">🏁</span>${rnT('patch')}</div>
      <div class="jn-ed-foot"><button class="jn-btn ghost" data-rnclose>${rnT('archive')}</button><button class="jn-btn" data-rnnew>${rnT('newRun')}</button></div>`;
  }

  // ── форма старту ──
  function rnPresetEnd(p){
    const td=ymdLocal();
    if(p==='d90') return rnAdd(td,90);
    if(p==='d30') return rnAdd(td,30);
    if(p==='own') return rnOkDs(rnDraft.end)?rnDraft.end:rnAdd(td,60);
    return (+td.slice(0,4)+1)+'-01-01';
  }
  function rnStartHTML(){
    const d=rnDraft, td=ymdLocal(), end=rnPresetEnd(d.preset), n=rnDiff(td,end);
    const pre=[['ny',rnT('ny')],['d90',rnT('d90')],['d30',rnT('d30')],['own',rnT('own')]]
      .map(([k,l])=>`<button data-rnpre="${k}"${d.preset===k?' class="on" aria-pressed="true"':' aria-pressed="false"'}>${l}</button>`).join('');
    const rows=d.goals.map((g,i)=>`<div class="rn-g" data-rng="${i}">
        <label class="jn-f"><span>${rnT('gName')}</span><input data-k="t" maxlength="40" placeholder="${rnT('gNamePh')}" value="${esc(g.t)}"></label>
        <div class="rn-g3">
          <label class="jn-f"><span>${rnT('gUnit')}</span><input data-k="unit" maxlength="12" placeholder="${rnT('gUnitPh')}" value="${esc(g.unit)}"></label>
          <label class="jn-f"><span>${rnT('gFrom')}</span><input data-k="from" inputmode="decimal" placeholder="82" value="${esc(g.from)}"></label>
          <label class="jn-f"><span>${rnT('gTo')}</span><input data-k="to" inputmode="decimal" placeholder="77" value="${esc(g.to)}"></label>
        </div>
        ${d.goals.length>1?`<button class="jn-mini rn-rm" data-rnrm="${i}">${rnT('rmGoal')}</button>`:''}
      </div>`).join('');
    return `${rnHead(rnT('start'))}
      <small class="rn-note">${rnT('startSub')}</small>
      <div class="jn-f"><span>${rnT('when')}</span><div class="rn-pre">${pre}</div>
        ${d.preset==='own'?`<input id="rnEnd" type="date" min="${rnAdd(td,1)}" max="${rnAdd(td,RN_MAX_DAYS)}" value="${esc(end)}" aria-label="${rnT('own')}">`:''}
        <small class="rn-note">${rnT('to')}${esc(rnDateTxt(end))}${n>0?' · '+n+' '+rnDaysWord(n):''}</small></div>
      <label class="jn-f"><span>${rnT('name')}</span><input id="rnTitle" maxlength="40" placeholder="${rnT('namePh')}" value="${esc(d.title)}"></label>
      <div class="rn-sec">${rnT('goals')}</div>
      <small class="rn-note">${rnT('goalHint')}</small>
      ${rows}
      ${d.goals.length<3?`<button class="jn-mini" data-rnadd>${rnT('addGoal')}</button>`:''}
      <div class="jn-ed-foot"><button class="jn-btn" data-rngo>${rnT('go')}</button></div>`;
  }
  function rnReadDraft(ov){
    const t=ov.querySelector('#rnTitle'); if(t) rnDraft.title=t.value;
    const e=ov.querySelector('#rnEnd'); if(e) rnDraft.end=e.value;
    ov.querySelectorAll('[data-rng]').forEach(row=>{
      const g=rnDraft.goals[+row.dataset.rng]; if(!g) return;
      row.querySelectorAll('[data-k]').forEach(i=>{ g[i.dataset.k]=i.value; });
    });
  }
  function rnStartBind(ov){
    ov.querySelectorAll('[data-rnpre]').forEach(b=>b.onclick=()=>{ rnReadDraft(ov); rnDraft.preset=b.dataset.rnpre; runOpen(); });
    { const e=ov.querySelector('#rnEnd'); if(e) e.onchange=()=>{ rnReadDraft(ov); runOpen(); }; }
    { const a=ov.querySelector('[data-rnadd]'); if(a) a.onclick=()=>{ rnReadDraft(ov); if(rnDraft.goals.length<3) rnDraft.goals.push({t:'',unit:'',from:'',to:''}); runOpen(); }; }
    ov.querySelectorAll('[data-rnrm]').forEach(b=>b.onclick=()=>{ rnReadDraft(ov); rnDraft.goals.splice(+b.dataset.rnrm,1); runOpen(); });
    ov.querySelector('[data-rngo]').onclick=()=>{
      rnReadDraft(ov);
      if(!rnReady()){ plToast(rnT('wait')); return; }
      if(rnCur()){ runOpen(); return; }   // забіг уже йде (почато на іншому пристрої) — не затирати
      const td=ymdLocal(), end=rnPresetEnd(rnDraft.preset);
      if(!rnOkDs(end)||end<=td||rnDiff(td,end)>RN_MAX_DAYS){ plToast(rnT('errDate')); return; }
      const goals=rnDraft.goals.map(g=>({t:String(g.t||'').trim().slice(0,40), unit:String(g.unit||'').trim().slice(0,12), from:rnParse(g.from), to:rnParse(g.to)}))
        .filter(g=>g.t&&g.from!==null&&g.to!==null&&g.from!==g.to)
        .map(g=>({id:rnId('rg_'), t:g.t, unit:g.unit, from:g.from, to:g.to, log:[]}));
      if(!goals.length){ plToast(rnT('errGoal')); return; }
      goalsData.run={id:rnId('run_'), title:String(rnDraft.title||'').trim().slice(0,40), start:td, end, base:{xp:rnXP(), lv:rnLvDone()}, goals};
      saveGoals();
      rnDraft=null;
      try{ window.platform.haptic('success'); }catch(_){}
      plToast(rnT('started'));
      rnAfter(); runOpen();
    };
  }

  // ── записати нове значення ──
  function rnLogSheet(gid){
    const r=rnCur(); if(!r) return;
    const raw=(r.goals||[]).find(x=>x&&String(x.id)===String(gid)), g=rnGoalNorm(raw); if(!g) return;
    const u=g.unit?' '+esc(g.unit):'';
    jnOverlay(`${rnHead(esc(g.t))}
      <small class="rn-note">${rnNum(g.from)} → ${rnNum(g.to)}${u}</small>
      <label class="jn-f"><span>${rnT('val')}${g.unit?', '+esc(g.unit):''}</span><input id="rnVal" inputmode="decimal" value="${esc(rnNum(rnVal(g)).replace(/\s/g,''))}"></label>
      <div class="jn-ed-foot"><button class="jn-btn ghost" data-rnback>${rnT('back')}</button><button class="jn-btn" data-rnsave>${rnT('save')}</button></div>`, ov=>{
      const inp=ov.querySelector('#rnVal');
      ov.querySelector('[data-rnback]').onclick=()=>runOpen();
      ov.querySelector('[data-rnsave]').onclick=()=>{
        const v=rnParse(inp.value);
        if(v===null){ plToast(rnT('errVal')); return; }
        if(!rnReady()){ plToast(rnT('wait')); return; }
        const lr=rnLive(r.id), lg=lr&&(lr.goals||[]).find(x=>x&&String(x.id)===String(gid));
        if(!lg){ runOpen(); return; }
        const td=ymdLocal();
        // один запис на день: новий за сьогодні замінює попередній
        const log=(Array.isArray(lg.log)?lg.log:[]).filter(x=>x&&x.ds!==td);
        log.push({ds:td, v}); lg.log=log.slice(-400);
        saveGoals();
        plToast(rnT('saved'));
        rnAfter(); runOpen();
      };
      setTimeout(()=>{ try{ inp.focus(); inp.select(); }catch(_){} },60);
    });
  }

  // ── завершити / скасувати / в архів ──
  // забіг, на який дивиться шторка, ще той самий? Поки вона відкрита, goals_data могли перечитати з хмари —
  // тоді пишемо в живий обʼєкт, а не в стару копію; зник/інший — просто перемалювати шторку
  function rnLive(id){ const r=rnCur(); return r&&String(r.id)===String(id)?r:null; }
  /* закритий забіг лишає «надгробок» {id, closed} замість null: при вході з гостя в акаунт злиття бере локальне
     значення, і null затер би активний забіг із хмари, а обʼєкт зливається поле за полем — хмарний забіг уціліє.
     Надгробок без start/end rnCur() вважає «забігу нема». Той самий id в архіві не дублюється. */
  function rnArchive(r,extra){
    const td=ymdLocal(), prev=(Array.isArray(goalsData.runsDone)?goalsData.runsDone:[]).filter(x=>!(x&&String(x.id)===String(r.id)));
    goalsData.runsDone=prev.concat([Object.assign({},r,{closed:td},extra||{})]).slice(-50);
    goalsData.run={id:String(r.id||''), closed:td};
    saveGoals();
  }
  function rnConfirm(ov,msg,yes,onYes){
    const f=ov.querySelector('[data-rnfoot]'); if(!f) return;
    f.innerHTML=`<small class="rn-sure">${msg}</small><button class="jn-btn ghost" data-rnno>${rnT('no')}</button><button class="jn-btn" data-rnyes>${yes}</button>`;
    f.querySelector('[data-rnno]').onclick=()=>runOpen();
    f.querySelector('[data-rnyes]').onclick=()=>{ if(!rnReady()){ plToast(rnT('wait')); return; } onYes(); };
  }
  function rnCardBind(ov,r){
    ov.querySelectorAll('[data-rnlog]').forEach(b=>b.onclick=()=>rnLogSheet(b.dataset.rnlog));
    { const e=ov.querySelector('[data-rnend]'); if(e) e.onclick=()=>rnConfirm(ov,rnT('sureEnd'),rnT('yesEnd'),()=>{
        const L=rnLive(r.id); if(!L){ runOpen(); return; }
        L.endedAt=ymdLocal(); saveGoals(); rnAfter(); runOpen(); }); }
    { const c=ov.querySelector('[data-rncancel]'); if(c) c.onclick=()=>rnConfirm(ov,rnT('sureCancel'),rnT('yesCancel'),()=>{
        const L=rnLive(r.id); if(!L){ runOpen(); return; }
        rnArchive(L,{cancelled:true}); plToast(rnT('cancelled')); rnAfter(); const o=document.querySelector('.jn-ov'); if(o) o.remove(); }); }
    { const a=ov.querySelector('[data-rnclose]'); if(a) a.onclick=()=>{
        if(!rnReady()){ plToast(rnT('wait')); return; }
        const L=rnLive(r.id); if(!L){ runOpen(); return; }
        rnArchive(L); plToast(rnT('closed')); rnAfter(); const o=document.querySelector('.jn-ov'); if(o) o.remove(); }; }
    { const n=ov.querySelector('[data-rnnew]'); if(n) n.onclick=()=>{
        if(!rnReady()){ plToast(rnT('wait')); return; }
        const L=rnLive(r.id); if(!L){ runOpen(); return; }
        rnArchive(L); rnAfter(); runOpen(); }; }
  }
  // після запису — оновити Журнал і лічильник Огляду
  function rnAfter(){ try{ jnRender(); }catch(_){} try{ if(window.__nycRefresh) window.__nycRefresh(); }catch(_){} }

  function runOpen(){
    if(!rnReady()){ plToast(rnT('wait')); return; }
    const r=rnCur();
    if(!r){
      if(!rnDraft) rnDraft={title:'', preset:'ny', end:'', goals:[{t:'',unit:'',from:'',to:''}]};
      jnOverlay(rnStartHTML(), rnStartBind);
      return;
    }
    jnOverlay(rnOver(r)?rnFinHTML(r):rnCardHTML(r), ov=>rnCardBind(ov,r));
  }
  window.runOpen=runOpen;
