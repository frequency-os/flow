  /* ============ PATTERNS MODULE: перехват лазівок + 4-місячна трансформація ============
     Дані: patterns_chains (розібрані зриви), patterns_score (рахунок перехвату),
     patterns_transform (цикли заміни патернів). Дати — тільки ymdLocal. */
  const PAT_CKEY='patterns_chains', PAT_SKEY='patterns_score', PAT_TKEY='patterns_transform';
  let patChains=[], patScore={win:0,lose:0}, patTrans=[], patOrigin='';
  const PAT_PHASES=[
    {n:'Виявлення', t:'Тільки фіксуй: коли і чому вмикається старий патерн. Без тиску — це збір розвідданих про себе.'},
    {n:'Заміна', t:'У момент тригера свідомо запускай новий патерн. Старий ще прориватиметься — рахунок важливіший за ідеальність.'},
    {n:'Закріплення', t:'Новий патерн стає типовою відповіддю. Зриви розбирай без самопокарання — вони частина процесу.'},
    {n:'Автоматизм', t:'Новий рівень: патерн працює без зусиль волі. Ускладнюй — став наступну ціль.'}
  ];
  function patSaveChains(){ try{ const p=window.storage.set(PAT_CKEY,JSON.stringify(patChains),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function patSaveScore(){ try{ const p=window.storage.set(PAT_SKEY,JSON.stringify(patScore),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function patSaveTrans(){ try{ const p=window.storage.set(PAT_TKEY,JSON.stringify(patTrans),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function patEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function patFmt(ts){ return new Date(ts).toLocaleDateString('uk-UA',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); }

  function goPatterns(){ patOrigin=(typeof currentFolderKey!=='undefined'&&currentFolderKey)?currentFolderKey:'pat'; renderPatterns(); show('scr-patterns'); }
  try{ window.goPatterns=goPatterns; }catch(_){}
  { const b=document.getElementById('patternsBack'); if(b) b.onclick=()=>{ try{ goHome(); }catch(_){ } }; }

  // перемикач видів
  function patSetView(v){
    document.getElementById('patViewI').style.display = v==='i' ? '' : 'none';
    document.getElementById('patViewT').style.display = v==='t' ? '' : 'none';
    document.getElementById('patTabI').classList.toggle('on', v==='i');
    document.getElementById('patTabT').classList.toggle('on', v==='t');
  }
  { const ti=document.getElementById('patTabI'), tt=document.getElementById('patTabT');
    if(ti) ti.onclick=()=>patSetView('i');
    if(tt) tt.onclick=()=>patSetView('t'); }

  // ---- перехват ----
  function patInterceptData(){
    const map={};
    patChains.forEach(c=>{ const k=(c.thought||'').trim(); if(!k) return;
      if(!map[k]) map[k]={count:0,conseq:c.conseq}; map[k].count++; });
    const lies=Object.entries(map).sort((x,y)=>y[1].count-x[1].count).slice(0,3);
    const brs=patChains.filter(c=>c.brk).slice(0,4);
    return {lies,brs};
  }
  function patOpenIntercept(){
    const d=patInterceptData();
    document.getElementById('patLies').innerHTML = d.lies.length
      ? d.lies.map(e=>{ const lie=e[0], m=e[1];
          return '<div class="pat-lie"><div class="q">'+patEsc(lie)+'</div>'+
            (m.conseq?'<div class="aft">…а потім: <b>'+patEsc(m.conseq)+'</b></div>':'')+
            '<div class="aft">повторилось ×'+m.count+'</div></div>'; }).join('')
      : '<div class="pat-empty">Ще немає записаних лазівок. Розбери перший зрив — з’явиться контраргумент.</div>';
    document.getElementById('patBreaks').innerHTML = d.brs.length
      ? d.brs.map(c=>'<div class="pat-brk"><b>Розрив</b>'+patEsc(c.brk)+'</div>').join('')
      : '<div class="pat-empty">Додай розриви в розборі — стануть готовим планом.</div>';
    const p=document.getElementById('patPanel'); p.classList.add('open');
    try{ p.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(_){}
    try{ window.platform.haptic('light'); }catch(_){}
  }
  function patDecide(won){
    if(won) patScore.win++; else patScore.lose++;
    patSaveScore();
    document.getElementById('patPanel').classList.remove('open');
    if(!won){ const t=document.getElementById('patTrigger'); try{ t.scrollIntoView({behavior:'smooth'}); }catch(_){} t.focus(); }
    renderPatterns();
  }
  { const pb=document.getElementById('patPanicBtn'); if(pb) pb.onclick=patOpenIntercept;
    const dw=document.getElementById('patDWin'); if(dw) dw.onclick=()=>patDecide(true);
    const dl=document.getElementById('patDLose'); if(dl) dl.onclick=()=>patDecide(false); }

  // ---- ланцюги ----
  function patAddChain(){
    const g=id=>document.getElementById(id).value.trim();
    const c={ id:Date.now(), trigger:g('patTrigger'), thought:g('patThought'),
      action:g('patAction'), conseq:g('patConseq'), brk:g('patBreak'), ts:Date.now() };
    if(!c.trigger&&!c.thought){ document.getElementById('patTrigger').focus(); return; }
    patChains.unshift(c); patSaveChains();
    ['patTrigger','patThought','patAction','patConseq','patBreak'].forEach(i=>document.getElementById(i).value='');
    try{ window.platform.haptic('light'); }catch(_){}
    renderPatterns();
  }
  { const a=document.getElementById('patAdd'); if(a) a.onclick=patAddChain; }
  function patDelChain(id){
    confirmSheet({title:'Видалити ланцюг?', sub:'Запис зникне з журналу і статистики.', onOk:()=>{
      patChains=patChains.filter(c=>c.id!==id); patSaveChains(); renderPatterns();
    }});
  }
  try{ window.patDelChain=patDelChain; }catch(_){}

  // ---- трансформація 4 місяці ----
  function patDaysFrom(startYmd){
    const pr=String(startYmd||'').split('-');
    if(pr.length!==3) return 0;
    const s=new Date(+pr[0],+pr[1]-1,+pr[2]);
    const n=new Date(); const n0=new Date(n.getFullYear(),n.getMonth(),n.getDate());
    return Math.max(0,Math.round((n0-s)/86400000));
  }
  function patAddTrans(){
    const g=id=>document.getElementById(id).value.trim();
    const p={ id:Date.now(), old:g('patTOld'), cause:g('patTCause'), neu:g('patTNew'),
      tools:g('patTTools'), start:document.getElementById('patTStart').value||ymdLocal(), checks:{} };
    if(!p.old||!p.neu){ document.getElementById('patTOld').focus(); return; }
    patTrans.unshift(p); patSaveTrans();
    ['patTOld','patTCause','patTNew','patTTools'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('patTStart').value=ymdLocal();
    try{ window.platform.haptic('light'); }catch(_){}
    renderPatterns();
  }
  { const a=document.getElementById('patTAdd'); if(a) a.onclick=patAddTrans;
    const s=document.getElementById('patSeed'); if(s) s.onclick=()=>{
      document.getElementById('patTOld').value='Емоційні покупки — швидше позбутись грошей';
      document.getElementById('patTCause').value='Страх грошей: тримати їх тривожно, витратити = зняти напругу';
      document.getElementById('patTNew').value='Планування до зарплати + розподіл по конвертах';
      document.getElementById('patTTools').value='Конверти: обовʼязкове / подушка / вільні. Правило 24 год перед покупкою >500₴';
    }; }
  function patDelTrans(id){
    confirmSheet({title:'Видалити цикл заміни?', sub:'Прогрес і відмітки за 4 місяці зникнуть.', onOk:()=>{
      patTrans=patTrans.filter(p=>p.id!==id); patSaveTrans(); renderPatterns();
    }});
  }
  function patTCheck(id,kind){
    const p=patTrans.find(x=>x.id===id); if(!p) return;
    const k=ymdLocal(); if(!p.checks[k]) p.checks[k]={o:0,n:0};
    p.checks[k][kind]++; patSaveTrans();
    try{ window.platform.haptic('light'); }catch(_){}
    renderPatterns();
  }
  try{ window.patDelTrans=patDelTrans; window.patTCheck=patTCheck; }catch(_){}
  function patLast7(p){
    let o=0,n=0; const now=new Date();
    for(let i=0;i<7;i++){ const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);
      const c=p.checks[ymdLocal(d)]; if(c){ o+=c.o; n+=c.n; } }
    return {o,n};
  }

  // ---- рендер екрана ----
  function renderPatterns(){
    // рахунок
    document.getElementById('patWin').textContent=patScore.win;
    document.getElementById('patLose').textContent=patChains.length;
    const net=document.getElementById('patNet');
    net.textContent=patScore.win+' : '+patChains.length;
    net.style.color=patScore.win>=patChains.length?'var(--owed)':'var(--owe)';
    // ланцюги
    document.getElementById('patCnt').textContent=patChains.length;
    const tc={}; patChains.forEach(c=>{ const k=(c.thought||'').toLowerCase().trim(); if(k) tc[k]=(tc[k]||0)+1; });
    document.getElementById('patList').innerHTML = patChains.length ? patChains.map(c=>{
      const key=(c.thought||'').toLowerCase().trim();
      const rep=key&&tc[key]>1;
      const lks=[];
      if(c.trigger)lks.push('<span class="pat-lk t">'+patEsc(c.trigger)+'</span>');
      if(c.thought)lks.push('<span class="pat-lk h">'+patEsc(c.thought)+'</span>');
      if(c.action)lks.push('<span class="pat-lk a">'+patEsc(c.action)+'</span>');
      if(c.conseq)lks.push('<span class="pat-lk c">'+patEsc(c.conseq)+'</span>');
      return '<div class="pat-item"><div class="pat-flow">'+lks.join('<span class="pat-ar">→</span>')+'</div>'+
        (c.brk?'<div class="pat-cbrk">⚡ '+patEsc(c.brk)+'</div>':'')+
        '<div class="pat-foot"><span>'+patFmt(c.ts)+(rep?' · <span class="pat-rep">↻ повтор</span>':'')+'</span>'+
        '<button class="pat-del" onclick="patDelChain('+c.id+')">видалити</button></div></div>';
    }).join('') : '<div class="pat-empty">Наступний зрив — не сварись на себе, розбери його тут. Патерн стане видимим.</div>';
    // трансформація
    document.getElementById('patTCnt').textContent=patTrans.length;
    const tStart=document.getElementById('patTStart'); if(tStart&&!tStart.value) tStart.value=ymdLocal();
    document.getElementById('patTList').innerHTML = patTrans.length ? patTrans.map(p=>{
      const day=patDaysFrom(p.start);
      const done=day>=120;
      const mIdx=Math.min(3,Math.floor(day/30));
      const ph=PAT_PHASES[mIdx];
      const pct=Math.min(100,Math.round(day/120*100));
      const today=p.checks[ymdLocal()]||{o:0,n:0};
      const r7=patLast7(p);
      const dots=PAT_PHASES.map((x,i)=>{
        const cls=done?'done':(i<mIdx?'done':(i===mIdx?'cur':''));
        return '<div class="pat-md '+cls+'">'+(i+1)+'·'+x.n+'</div>'; }).join('');
      return '<div class="pat-tcard">'+
        '<div class="pat-swap"><span class="old">'+patEsc(p.old)+'</span><span class="pat-ar">→</span><span class="neu">'+patEsc(p.neu)+'</span></div>'+
        (p.cause?'<div class="pat-cause">Причина: <b>'+patEsc(p.cause)+'</b></div>':'')+
        (p.tools?'<div class="pat-tools"><b>Інструменти</b>'+patEsc(p.tools)+'</div>':'')+
        '<div class="pat-tphase"><div class="pn">'+(done?'🏆 Цикл завершено!':'📍 Місяць '+(mIdx+1)+' · '+ph.n)+'</div>'+
        '<div class="pd">день '+Math.min(day,120)+' / 120</div></div>'+
        '<div class="pat-task">'+(done?'4 місяці пройдено. Патерн замінено — час ставити наступний рівень.':ph.t)+'</div>'+
        '<div class="pat-tbar"><i style="width:'+pct+'%"></i></div>'+
        '<div class="pat-mdots">'+dots+'</div>'+
        '<div class="pat-tcheck">'+
          '<button class="pat-tco" onclick="patTCheck('+p.id+',\'o\')">Старий спрацював'+(today.o?'<b>'+today.o+'</b>':'')+'</button>'+
          '<button class="pat-tcn" onclick="patTCheck('+p.id+',\'n\')">Новий спрацював'+(today.n?'<b>'+today.n+'</b>':'')+'</button>'+
        '</div>'+
        '<div class="pat-ratio"><span>7 днів: <span class="bad">'+r7.o+' стар.</span> vs <span class="good">'+r7.n+' нов.</span>'+
        ((r7.o+r7.n>0)?' · новий '+Math.round(r7.n/(r7.o+r7.n)*100)+'%':'')+'</span>'+
        '<button class="pat-del" onclick="patDelTrans('+p.id+')">видалити</button></div>'+
      '</div>';
    }).join('') : '<div class="pat-empty">Додай перший патерн на заміну. Тапни «приклад» — заповню кейс із грошима.</div>';
  }
  try{ window.renderPatterns=renderPatterns; }catch(_){}

