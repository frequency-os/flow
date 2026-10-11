  /* ════════ «Фокус» (12.10.2026, задум з аудиту «очима людини з СДВГ») ════════
     Іконка-мішень у шапці Огляду → шторка з ОДНІЄЮ справою «зараз» і таймером 5 / 15 / 25 хв.
     Звідки береться справа: та, що йде за розкладом зараз → наступні сьогодні → пропущені сьогодні →
     перший незроблений крок активної місії → порожньо: «Що одне зробиш зараз?».
     «Зроблено» — той самий шлях, що в Журналі (jnToggleBlock → plCompleteBlock): досвід і серія рахуються.
     Таймер зберігає ЧАС СТАРТУ (не лічить секунди), тож переживає перезапуск програми.
     Стан таймера — лише цього пристрою (localStorage 'focus_run'), у хмару не йде.
     Тексти — парами uk/en, без родових форм. */
  const FC_RUN_KEY='focus_run';
  const fcLang=()=>{ try{ return (window.flowLang&&window.flowLang())==='en'?'en':'uk'; }catch(_){ return 'uk'; } };
  const FC_T={
    uk:{loading:'Ще вантажу твої справи…', title:'Фокус', close:'Закрити', step:'Твій один крок', now:'зараз · до ', at:'о ', was:'було о ', wasTail:' — можна зараз',
      mission:'крок місії', other:'Інша справа', done:'Зроблено', start:'Почати', stop:'Стоп', min:'хв',
      emptyH:'Що одне зробиш зараз?', emptyPh:'Напиши одну справу', emptyGo:'Почати',
      allDone:'На сьогодні все зроблено', allDoneSub:'Можна відпочити — або взяти одну справу на завтра.',
      left:'лишилось', over:'Час вийшов. Як справа?', more5:'Ще 5 хв',
      mate:' поруч', mateRun:' поруч, поки йде таймер', ended:'⏱ Таймер «Фокусу» завершився', block:'Справа'},
    en:{loading:'Loading your tasks…', title:'Focus', close:'Close', step:'Your one step', now:'now · until ', at:'at ', was:'was at ', wasTail:' — fine to do now',
      mission:'mission step', other:'Something else', done:'Done', start:'Start', stop:'Stop', min:'min',
      emptyH:'What one thing will you do now?', emptyPh:'Write one thing', emptyGo:'Start',
      allDone:'Everything for today is done', allDoneSub:'Time to rest — or pick one thing for tomorrow.',
      left:'left', over:'Time is up. How did it go?', more5:'5 more min',
      mate:' is with you', mateRun:' is with you while the timer runs', ended:'⏱ Focus timer is over', block:'Task'}
  };
  const fcT=k=>(FC_T[fcLang()]||FC_T.uk)[k];
  let fcIdx=0, fcDur=15, fcTick=null, fcAudio=null;
  /* Цілі й Планер (goals_data) прочитано зі сховища? До того goalsData — заводська заглушка,
     і будь-який saveGoals() затер би справжні дані порожнечею (клас «зникання папок»). */
  function fcReady(){ try{ return typeof window.storeKeyReady!=='function'||window.storeKeyReady('goals_data')===true; }catch(_){ return false; } }

  function fcRun(){ try{ const r=JSON.parse(localStorage.getItem(FC_RUN_KEY)||'null'); return r&&r.start&&r.dur?r:null; }catch(_){ return null; } }
  function fcRunSet(r){ try{ if(r) localStorage.setItem(FC_RUN_KEY,JSON.stringify(r)); else localStorage.removeItem(FC_RUN_KEY); }catch(_){} }
  function fcLeft(r){ return Math.max(0, Math.round((r.start+r.dur*60000-Date.now())/1000)); }
  function fcNowDec(){ const n=new Date(); return n.getHours()+n.getMinutes()/60; }

  /* кандидати на «зараз»: блоки сьогодні (зараз → далі → пропущені), потім кроки активних місій */
  function fcCands(){
    const out=[], nd=fcNowDec();
    let bl=[];
    try{ bl=jnDayBlocks(ymdLocal()).filter(b=>b&&!b.done); }catch(_){}
    const end=b=>{ try{ return plBlockEnd(b); }catch(_){ return (+b.h||0)+1; } };
    bl.filter(b=>+b.h<=nd&&nd<end(b)).forEach(b=>out.push({kind:'block',b,t:b.t||fcT('block'),sub:fcT('now')+jnHm(end(b))}));
    bl.filter(b=>+b.h>nd).forEach(b=>out.push({kind:'block',b,t:b.t||fcT('block'),sub:fcT('at')+jnHm(b.h)}));
    bl.filter(b=>end(b)<=nd).forEach(b=>out.push({kind:'block',b,t:b.t||fcT('block'),sub:fcT('was')+jnHm(b.h)+fcT('wasTail')}));
    const planned=new Set(bl.map(b=>b.link&&b.link.stepId).filter(Boolean));
    try{
      const goals=(goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)==='active'&&jnRole(g)!=='wait')
        .sort((a,b)=>(jnRole(a)==='main'?0:1)-(jnRole(b)==='main'?0:1));
      goals.forEach(gl=>{
        const st=(gl.steps||[]).find(s=>s&&!s.done&&!s.auto&&s.name&&!planned.has(s.id));
        if(st) out.push({kind:'step',gl,st,t:st.name,sub:'🎯 '+(gl.name||fcT('mission'))});
      });
    }catch(_){}
    return out;
  }
  function fcHadToday(){ try{ return jnDayBlocks(ymdLocal()).some(b=>b&&b.done); }catch(_){ return false; } }

  /* справа з кроку місії чи з поля → блок на «зараз» тривалістю таймера */
  function fcMakeBlock(t,link){
    const ds=plTodayStr(), list=plBlocksFor(ds);
    const h=Math.max(0,Math.min(23.75,Math.floor(fcNowDec()*12)/12));
    const b={id:'b_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), h, endH:Math.min(24,h+fcDur/60),
      t:String(t).slice(0,120), c:'val', tag:'', done:false};
    if(link) b.link=link;
    list.push(b); saveGoals();
    try{ plRerender(); }catch(_){}
    return b;
  }
  function fcStepBlock(c){
    const gl=c.gl, st=c.st;
    return fcMakeBlock(st.name,{type:'goalstep', goalId:(gl.id||gl.name), goalName:gl.name, stepId:st.id});
  }

  function fcDone(c){
    try{ window.platform.haptic('medium'); }catch(_){}
    let b=c.b;
    if(c.kind==='step') b=fcStepBlock(c);
    try{ jnToggleBlock(b); }catch(err){ console.error('fcDone',err); }
    const r=fcRun(); if(r&&(r.id===b.id||(b.fromRecur&&r.recur===b.fromRecur))) fcStopTimer(true);
    try{ if(typeof jnRender==='function') jnRender(); }catch(_){}
    fcIdx=0; fcRender();
  }
  function fcStart(c){
    let b=c.b;
    if(c.kind==='step') b=fcStepBlock(c);
    fcStartTimer({id:b.id, recur:b.fromRecur||'', t:b.t||fcT('block')});
  }

  /* ── таймер ── */
  function fcBeep(){
    try{ const a=fcAudio; if(!a) return; const o=a.createOscillator(), g=a.createGain();
      o.type='sine'; o.frequency.value=880; g.gain.setValueAtTime(.0001,a.currentTime);
      g.gain.exponentialRampToValueAtTime(.25,a.currentTime+.02); g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.9);
      o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+.95); }catch(_){}
  }
  function fcStartTimer(item){
    try{ if(!fcAudio){ const AC=window.AudioContext||window.webkitAudioContext; if(AC) fcAudio=new AC(); } if(fcAudio&&fcAudio.resume) fcAudio.resume(); }catch(_){}   // звук розблоковується тапом «Почати» (iOS)
    try{ window.platform.haptic('medium'); }catch(_){}
    fcRunSet(Object.assign({start:Date.now(), dur:fcDur, counted:false}, item));
    fcLoop(); fcRender();
  }
  function fcStopTimer(silent){
    const r=fcRun();
    if(r&&!r.counted){ // зарахувати прожитий час у ту саму статистику фокусу, що й Планер
      try{ const f=plFocusToday(); f.seconds+=Math.min(r.dur*60,Math.round((Date.now()-r.start)/1000)); saveGoals(); }catch(_){}
    }
    fcRunSet(null); clearInterval(fcTick); fcTick=null; fcBadge();
    if(!silent) fcRender();
  }
  function fcFinish(r){
    if(r.counted||!fcReady()) return;   // дані ще не прочитано — зарахуємо, щойно прийдуть
    r.counted=true; fcRunSet(r);
    // запис без дії людини (таймер сам скінчився) — через storeAuto: сховище пропустить його, якщо ключ не прочитано
    try{ const f=plFocusToday(); f.sessions++; f.seconds+=r.dur*60; window.storeAuto?window.storeAuto(()=>saveGoals()):saveGoals(); }catch(_){}
    try{ window.platform.haptic('heavy'); }catch(_){}
    fcBeep();
    if(!document.querySelector('.fc-ov')){ try{ plToast(fcT('ended')); }catch(_){} }
  }
  function fcLoop(){
    clearInterval(fcTick); fcTick=null;
    { const r=fcRun(); if(r&&Date.now()>r.start+r.dur*60000+3*3600000) fcRunSet(null); }   // забутий таймер давніше 3 год — не показувати «Час вийшов» наступного дня
    const step=()=>{
      const r=fcRun(); if(!r){ clearInterval(fcTick); fcTick=null; fcBadge(); return; }
      if(fcLeft(r)<=0){ if(!fcReady()) return; fcFinish(r); clearInterval(fcTick); fcTick=null; fcRender(); fcBadge(); return; }
      fcPaintTime(r); fcBadge();
    };
    step();
    const r0=fcRun(); if(r0&&(fcLeft(r0)>0||!fcReady())) fcTick=setInterval(step,1000);
  }
  function fcMMSS(s){ return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
  function fcPaintTime(r){
    const ov=document.querySelector('.fc-ov'); if(!ov) return;
    const left=fcLeft(r), tm=ov.querySelector('[data-fctime]'), ring=ov.querySelector('[data-fcring]');
    if(tm) tm.textContent=fcMMSS(left);
    if(ring) ring.style.setProperty('--p',Math.round((1-left/(r.dur*60))*100)+'%');
  }
  /* мітка на іконці: поки йде таймер — хвилини, що лишились */
  function fcBadge(){
    const btn=document.getElementById('homeFocusBtn'); if(!btn) return;
    const r=fcRun(), bd=btn.querySelector('.fc-bd');
    const on=!!(r&&fcLeft(r)>0);
    btn.classList.toggle('fc-on',on);
    if(bd){ bd.hidden=!on; if(on) bd.textContent=Math.ceil(fcLeft(r)/60)+'′'; }
  }

  /* ── шторка ── */
  function fcMate(running){
    try{ const id=petCur(), p=FLOW_PETS[id]; if(!p) return '';
      return `<div class="fc-mate"><span class="fc-mate-av">${petSVG(id,40)}</span><span>${esc(p.name)}${running?fcT('mateRun'):fcT('mate')}</span></div>`;
    }catch(_){ return ''; }
  }
  function fcDurHTML(){
    return `<div class="fc-durs" role="group" aria-label="${fcT('min')}">${[5,15,25].map(m=>`<button class="fc-dur${m===fcDur?' on':''}" data-fcdur="${m}" aria-pressed="${m===fcDur}">${m} ${fcT('min')}</button>`).join('')}</div>`;
  }
  function fcBodyHTML(){
    if(!fcReady()) return `<div class="fc-card"><p class="fc-over">${fcT('loading')}</p></div>`;
    const r=fcRun();
    if(r){ // таймер іде або щойно скінчився
      const left=fcLeft(r);
      if(left<=0) return `<div class="fc-card">
          <small>${fcT('step')}</small><b class="fc-t">${esc(r.t)}</b>
          <p class="fc-over">${fcT('over')}</p>
          <button class="fc-pri" data-fcrdone>${fcT('done')}</button>
          <div class="fc-row"><button class="fc-sec" data-fcmore>${fcT('more5')}</button><button class="fc-sec" data-fcstop>${fcT('close')}</button></div>
        </div>${fcMate(false)}`;
      return `<div class="fc-card">
          <small>${fcT('step')}</small><b class="fc-t">${esc(r.t)}</b>
          <div class="fc-ring" data-fcring style="--p:0%"><span><b data-fctime>${fcMMSS(left)}</b><small>${fcT('left')}</small></span></div>
          <button class="fc-pri" data-fcrdone>${fcT('done')}</button>
          <div class="fc-row"><button class="fc-sec" data-fcstop>${fcT('stop')}</button></div>
        </div>${fcMate(true)}`;
    }
    const cs=fcCands();
    if(!cs.length){
      if(fcHadToday()) return `<div class="fc-card fc-win"><b class="fc-t">${fcT('allDone')}</b><p class="fc-over">${fcT('allDoneSub')}</p></div>${fcMate(false)}`;
      return `<div class="fc-card">
          <label class="fc-t" for="fcIn">${fcT('emptyH')}</label>
          <input id="fcIn" class="fc-in" maxlength="120" placeholder="${fcT('emptyPh')}" autocomplete="off" enterkeyhint="go">
          ${fcDurHTML()}
          <button class="fc-pri" data-fcnew>${fcT('emptyGo')}</button>
        </div>${fcMate(false)}`;
    }
    if(fcIdx>=cs.length) fcIdx=0;
    const c=cs[fcIdx];
    return `<div class="fc-card">
        <small>${fcT('step')}</small>
        <b class="fc-t">${esc(c.t)}</b>
        <span class="fc-sub">${esc(c.sub)}</span>
        ${fcDurHTML()}
        <button class="fc-pri" data-fcgo>▶ ${fcT('start')}</button>
        <div class="fc-row"><button class="fc-sec" data-fcdone>✓ ${fcT('done')}</button>${cs.length>1?`<button class="fc-sec" data-fcnext>${fcT('other')}</button>`:''}</div>
      </div>${fcMate(false)}`;
  }
  function fcRender(){
    const ov=document.querySelector('.fc-ov'); if(!ov) return;
    const body=ov.querySelector('.fc-body'); body.innerHTML=fcBodyHTML();
    const r=fcRun(); if(r) fcPaintTime(r);
    const cs=r?[]:fcCands(), c=cs[fcIdx];
    const on=(sel,fn)=>{ const el=body.querySelector(sel); if(el) el.onclick=fn; };
    body.querySelectorAll('[data-fcdur]').forEach(b=>b.onclick=()=>{ fcDur=+b.dataset.fcdur; try{ window.platform.haptic('light'); }catch(_){}
      body.querySelectorAll('[data-fcdur]').forEach(x=>{ const o=+x.dataset.fcdur===fcDur; x.classList.toggle('on',o); x.setAttribute('aria-pressed',o); }); });
    on('[data-fcgo]',()=>{ if(c) fcStart(c); });
    on('[data-fcdone]',()=>{ if(c) fcDone(c); });
    on('[data-fcnext]',()=>{ fcIdx=(fcIdx+1)%Math.max(1,cs.length); try{ window.platform.haptic('light'); }catch(_){} fcRender(); });
    on('[data-fcstop]',()=>fcStopTimer(false));
    on('[data-fcmore]',()=>{ const x=fcRun(); if(!x) return; fcDur=5; fcStartTimer({id:x.id, recur:x.recur||'', t:x.t}); });
    on('[data-fcrdone]',()=>{ const x=fcRun(); if(!x) return;
      const b=jnDayBlocks(ymdLocal()).find(y=>y.id===x.id||(x.recur&&y.fromRecur===x.recur));
      fcStopTimer(true);
      if(b&&!b.done) fcDone({kind:'block',b}); else fcRender(); });
    const inp=body.querySelector('#fcIn');
    if(inp){
      const go=()=>{ const v=inp.value.trim(); if(!v){ inp.focus(); return; } const b=fcMakeBlock(v,null); fcStartTimer({id:b.id, recur:'', t:b.t}); };
      on('[data-fcnew]',go);
      inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); go(); } };
    }
  }
  function fcClose(){
    const ov=document.querySelector('.fc-ov'); if(!ov) return;
    ov.classList.remove('show'); document.removeEventListener('keydown',fcKey);
    setTimeout(()=>ov.remove(),220);
    try{ const b=document.getElementById('homeFocusBtn'); if(b) b.focus(); }catch(_){}
  }
  function fcKey(e){
    if(e.key==='Escape'){ e.preventDefault(); fcClose(); return; }
    if(e.key!=='Tab') return;   // фокус клавіатури не тікає з шторки
    const ov=document.querySelector('.fc-ov'); if(!ov) return;
    const f=[...ov.querySelectorAll('button,input')].filter(x=>!x.disabled&&x.offsetParent!==null); if(!f.length) return;
    const first=f[0], last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
  }
  function openFocus(){
    if(document.querySelector('.fc-ov')) return;
    try{ window.platform.haptic('light'); }catch(_){}
    fcIdx=0;
    const ov=document.createElement('div'); ov.className='fc-ov';
    ov.innerHTML=`<div class="fc-sheet" role="dialog" aria-modal="true" aria-labelledby="fcH" tabindex="-1">
        <div class="fc-top"><h2 id="fcH">◎ ${fcT('title')}</h2><button class="fc-x" data-fcx aria-label="${fcT('close')}">✕</button></div>
        <div class="fc-body"></div>
      </div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click',e=>{ if(e.target===ov) fcClose(); });
    ov.querySelector('[data-fcx]').onclick=fcClose;
    document.addEventListener('keydown',fcKey);
    fcRender();
    if(!fcReady()){ const w=setInterval(()=>{ if(!document.body.contains(ov)){ clearInterval(w); return; } if(fcReady()){ clearInterval(w); fcRender(); } },400); }
    requestAnimationFrame(()=>ov.classList.add('show'));
    setTimeout(()=>{ try{ ov.querySelector('.fc-sheet').focus({preventScroll:true}); }catch(_){} },60);   // фокус на шторку, а не на кнопку — без зайвої рамки на телефоні
  }
  window.openFocus=openFocus;

  { const b=document.getElementById('homeFocusBtn');
    if(b){ b.onclick=openFocus; b.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openFocus(); } }; } }
  // таймер, запущений до перезапуску програми, продовжує йти (або повідомляє, що скінчився).
  // Мітку показуємо одразу (лише читання), а лічильник із записом — лише після того, як load() прочитав goals_data.
  try{ fcBadge();
    if(fcRun()){ let n=0; const w=setInterval(()=>{ n++; if(fcReady()){ clearInterval(w); fcLoop(); } else if(n>300) clearInterval(w); },400); }
  }catch(_){}
