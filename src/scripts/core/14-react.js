  /* ════════ FLOW REACT · живі реакції на дії ════════ */
  // налаштування ефектів: 'full' (емодзі+фрази), 'subtle' (лише хептик/кільце), 'off'
  function frMode(){ try{ const v=localStorage.getItem('fx_mode'); return (v==='off'||v==='subtle'||v==='full')?v:'full'; }catch(_){ return 'full'; } }
  function frModeSet(v){ try{ prefSet('fx_mode', v); }catch(_){} }
  function frSayOn(){ try{ return localStorage.getItem('fx_say')!=='0'; }catch(_){ return true; } }
  function frSaySet(on){ try{ prefSet('fx_say', on?'1':'0'); }catch(_){} }
  const FR_PRESETS={
    income:  {emo:['💸','🤑','💰','✨','🪙'], dir:'up',   c:'#34c77b', ring:1, haptic:'medium', say:['Дзинь! Капає 🤑','Плюс у скарбничку!','Гроші йдуть — красиво!','Так тримати 💪']},
    spend:   {emo:['💸','🫰','📉','💨'],       dir:'down', c:'#ff6b6b', ring:0, haptic:'light',  say:['Полетіли…','Мінус, але під контролем','Гроші пішли гуляти 💨','Ок, записав']},
    save:    {emo:['🐷','💵','⭐','✨'],        dir:'up',   c:'#f0b429', ring:1, haptic:'medium', say:['У конверт! 🐷','Відкладаєш — молодець','Мрія ближча ✨']},
    done:    {emo:['✅','🔥','⚡','🎉'],         dir:'up',   c:'#34c77b', ring:1, haptic:'medium', say:['Готово! 🔥','Є діло!','Крок зроблено ⚡','Так, погнали далі!']},
    goal:    {emo:['🎯','🏆','⭐','✨'],         dir:'up',   c:'#7d8dff', ring:1, haptic:'heavy',  say:['Ближче до цілі 🎯','Прогрес!','Ще крок до Точки Б']},
    streak:  {emo:['🔥','🔥','⚡','💥'],         dir:'up',   c:'#ff8a3d', ring:1, haptic:'heavy',  say:['Серія! 🔥','Не зупиняйся!','Вогонь тримається!']},
    folder:  {emo:['📁','✨','🚀'],              dir:'up',   c:'#7d8dff', ring:1, haptic:'light',  say:['Новий простір!','Створено 🚀','Місце для ідей']},
    create:  {emo:['✨','📝','💡'],              dir:'up',   c:'#7c8cff', ring:0, haptic:'light',  say:['Записав ✨','Готово','Додав']},
    celebrate:{emo:['🎉','🎊','⭐','✨','🔥','💫'],dir:'up', c:'#a879ff', ring:1, haptic:'heavy',  say:['Ого, красота! 🎉','Це рівень!','Кайф 💫']}
  };
  let __frLast=0;
  function flowReactAt(x,y,kind,opts){
    opts=opts||{};
    const P=FR_PRESETS[kind]||FR_PRESETS.create;
    const n=opts.big?9:(opts.count||6);
    // кільце-пульс
    if(P.ring){
      const r=document.createElement('div'); r.className='fr-ring';
      r.style.cssText=`left:${x}px;top:${y}px;width:70px;height:70px;--frc:${P.c}`;
      document.body.appendChild(r); setTimeout(()=>r.remove(),720);
    }
    // фонтан емодзі
    for(let i=0;i<n;i++){
      const s=document.createElement('span'); s.className='fr-emo'+(P.dir==='down'?' down':'');
      s.textContent=P.emo[Math.floor(Math.random()*P.emo.length)];
      const spread=(Math.random()-.5)*120, rise=60+Math.random()*70, rot=(Math.random()-.5)*50;
      const sz=opts.big?(24+Math.random()*12):(18+Math.random()*9);
      s.style.cssText=`left:${x}px;top:${y}px;font-size:${sz}px;`
        +`--frx1:${(Math.random()-.5)*30}px;--fry1:${P.dir==='down'?6:-14}px;`
        +`--frx:${spread}px;--fry:${P.dir==='down'?rise:-rise}px;--frr:${rot}deg;`
        +`--frdur:${1.2+Math.random()*.7}s;`
        +`animation-delay:${i*45}ms`;
      document.body.appendChild(s); setTimeout(()=>s.remove(),2300);
    }
    try{ if(P.haptic&&window.platform&&window.platform.haptic) window.platform.haptic(P.haptic); }catch(_){}
  }
  function flowReact(kind,opts){
    opts=opts||{};
    const mode=frMode();
    if(mode==='off' && !opts.force) return;               // ефекти вимкнено повністю
    const now=Date.now(); if(now-__frLast<160 && !opts.force) { /* антиспам */ } __frLast=now;
    // епіцентр: центр екрана трохи вище доку, або задана точка
    let x=opts.x, y=opts.y;
    if(x==null||y==null){
      x=window.innerWidth/2; y=window.innerHeight*0.5;
      const cap=document.querySelector('#aiCapPet .cap-pet, #flowSpot .fs-pet, #flowCap .fc-inner');
      if(cap){ const r=cap.getBoundingClientRect(); if(r.width){ x=r.left+r.width/2; y=r.top+r.height/2; } }
    }
    if(mode==='subtle'){
      // лише кільце-пульс + хептик, без емодзі й фраз
      const P=FR_PRESETS[kind]||FR_PRESETS.create;
      const r=document.createElement('div'); r.className='fr-ring';
      r.style.cssText=`left:${x}px;top:${y}px;width:64px;height:64px;--frc:${P.c}`;
      document.body.appendChild(r); setTimeout(()=>r.remove(),720);
      try{ if(P.haptic&&window.platform&&window.platform.haptic) window.platform.haptic(P.haptic); }catch(_){}
      const av0=document.querySelector('#aiCapPet .cap-pet, #flowSpot .fs-pet, #flowCap');
      if(av0){ av0.classList.remove('fr-pop'); void av0.offsetWidth; av0.classList.add('fr-pop'); }
      return;
    }
    flowReactAt(x,y,kind,opts);
    // фраза Спарка (окремий тумблер + не для дрібних)
    if(opts.say!==false && frSayOn()){
      const P=FR_PRESETS[kind]||FR_PRESETS.create;
      if(P.say && (opts.say===true || Math.random()<(opts.sayChance!=null?opts.sayChance:.55))){
        flowSay(P.say[Math.floor(Math.random()*P.say.length)], P.emo[0]);
      }
    }
    // легкий поп аватара, якщо він на екрані
    const av=document.querySelector('#aiCapPet .cap-pet, #flowSpot .fs-pet, #flowCap');
    if(av){ av.classList.remove('fr-pop'); void av.offsetWidth; av.classList.add('fr-pop'); }
  }
  let __frSayT=null;
  function flowSay(text,emo){
    if(!text) return;
    let b=document.getElementById('frSay');
    if(b) b.remove();
    b=document.createElement('div'); b.id='frSay'; b.className='fr-say';
    b.innerHTML=`<span class="fx">${emo||'✨'}</span><span>${esc(text)}</span>`;
    document.body.appendChild(b);
    void b.offsetWidth; b.classList.add('in');
    clearTimeout(__frSayT); __frSayT=setTimeout(()=>{ if(b) b.remove(); },2500);
  }
  window.flowReact=flowReact; window.flowSay=flowSay;
  const FC_EMO={spark:['🔥','✨','⚡'],luna:['🌙','✨','💜'],mo:['🐻','❤️','☕'],bublik:['🥯','😄','🎉'],volt:['⚡','🎯','💪']};
  function fcEmote(){
    const cap=document.getElementById('flowCap');
    if(!cap||cap.style.display==='none'||petSleeping()) return;
    const list=FC_EMO[petCur()]||FC_EMO.spark;
    const r=cap.getBoundingClientRect();
    const e=document.createElement('span'); e.className='fc-emo';
    e.textContent=list[Math.floor(Math.random()*list.length)];
    e.style.left=(r.left+r.width/2-8+(Math.random()*16-8))+'px';
    e.style.top=(r.top-6)+'px';
    document.body.appendChild(e); setTimeout(()=>e.remove(),1400);
  }
  let fcLifeTimer=null;
  function fcLifeStart(){
    if(fcLifeTimer) return;
    fcLifeTimer=setInterval(()=>{
      const cap=document.getElementById('flowCap');
      if(!cap||cap.style.display==='none'||petSleeping()) return;
      if(document.body.classList.contains('spot-open')) return;
      cap.classList.add('fc-wig'); setTimeout(()=>cap.classList.remove('fc-wig'),950);
      if(Math.random()<0.45) fcEmote();
    },18000);
  }
  /* ── сплячі очі: універсальна накладка поверх petSVG ── */
  function petSVGSleep(id,size){
    const g='pg'+id+Math.round(size);
    const patch=`<ellipse cx="36" cy="48" rx="10.5" ry="9.5" fill="url(#${g})"/><ellipse cx="64" cy="48" rx="10.5" ry="9.5" fill="url(#${g})"/>`
      +`<path d="M29.5 50 q6.5 5.5 13 0 M57.5 50 q6.5 5.5 13 0" stroke="#0b0d1a" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
    return petSVG(id,size).replace('</svg>', patch+'</svg>');
  }
  /* ── гамачок Флоу: спить / читає / за ноутом ── */
  const AI_HAM_ACTS=[
    {k:'sleep',prop:'',  cap:n=>`<b>${n}</b> солодко спить у гамачку.<br>Дай завдання — і він одразу прокинеться`},
    {k:'book', prop:'📖',cap:n=>`День порожній, тож <b>${n}</b> читає книжку.<br>Дай йому завдання — і він одразу за роботу`},
    {k:'lap',  prop:'💻',cap:n=>`<b>${n}</b> щось майструє за ноутом.<br>Потрібен — тапни, він усе кине`},
    {k:'play', prop:'🎮',cap:n=>`<b>${n}</b> ганяє в приставку.<br>Дай завдання — поставить на паузу і за діло`},
    {k:'rest', prop:'🍹',cap:n=>`<b>${n}</b> чілить з коктейлем.<br>Свисни — і він миттю в строю`},
    {k:'bub',  prop:'🫧',cap:n=>`<b>${n}</b> дує бульбашки й мріє.<br>Дай завдання — і мрії стануть планом`}
  ];
  function aiHamAct(){
    if(!window.__aiHamAct) window.__aiHamAct=AI_HAM_ACTS[Math.floor(Math.random()*AI_HAM_ACTS.length)];
    return window.__aiHamAct;
  }
  function aiHamNextAct(){
    const cur=aiHamAct(); let n=cur;
    while(n.k===cur.k) n=AI_HAM_ACTS[Math.floor(Math.random()*AI_HAM_ACTS.length)];
    window.__aiHamAct=n; return n;
  }
  /* спільне ядро сцени: гамак + улюбленець + пропси (юзається і в порожньому чаті, і в «Сцені») */
  function aiHamCoreHTML(){
    const act=aiHamAct(); const id=petCur();
    const sleepy=act.k==='sleep';
    return `<div class="hm">
        <svg class="hm-str" viewBox="0 0 170 122"><path d="M28 60 Q16 30 4 4 M142 60 Q154 30 166 4" stroke="rgba(139,123,255,.5)" stroke-width="1.5" fill="none"/></svg>
        <div class="hm-net"></div>
        <div class="hm-pet">${sleepy?petSVGSleep(id,64):petSVG(id,64)}</div>
        ${act.prop?`<span class="hm-prop">${act.prop}</span>`:''}
        ${sleepy?'<span class="hm-z">💤</span><span class="hm-z2">💤</span>':''}
        ${act.k==='bub'?'<span class="hm-bub b1">🫧</span><span class="hm-bub b2">🫧</span><span class="hm-bub b3">🫧</span>':''}
      </div>`;
  }
  function aiHamSceneHTML(){
    const act=aiHamAct(); const nm=FLOW_PETS[petCur()].name;
    return `<div class="ai-hamscene act-${act.k}" id="aiHamScene">
      ${aiHamCoreHTML()}
      <div class="hm-cap">${act.cap(nm)}</div>
      <div class="hm-sub">тапни — розбудити</div>
    </div>`;
  }
  /* ротація активностей: раз на ~35с Спарк міняє заняття (спить/читає/грається/ноут/чіл/бульбашки) */
  let aiHamRotT=null;
  function aiHamRotStart(){
    if(aiHamRotT) return;
    aiHamRotT=setInterval(()=>{
      const sc=document.querySelector('.ai-hamscene');
      if(!sc||!document.body.contains(sc)){ clearInterval(aiHamRotT); aiHamRotT=null; return; }
      if(sc.classList.contains('h-poof')) return;
      sc.classList.add('h-sw');
      setTimeout(()=>{ aiHamNextAct(); try{ aiRenderBody(); }catch(_){} },240);
    },35000);
  }
  function aiHamWakeFrom(sc){
    const hm=sc.querySelector('.hm'); const r=(hm||sc).getBoundingClientRect();
    fcBurst(r.left+r.width/2, r.top+r.height/2, FLOW_PETS[petCur()].glow);
    try{ window.platform.haptic('medium'); }catch(_){}
    sc.classList.add('h-poof');
    setTimeout(()=>{ aiWakeInChat(); },370);
  }
  function aiHamBind(el){
    const sc=el.querySelector('#aiHamScene'); if(!sc) return;
    sc.onclick=()=>aiHamWakeFrom(sc);
    aiHamRotStart();
  }
  /* пробудження зсередини чату: шапка + тіло оновлюються, кап зʼявиться після закриття */
  function aiWakeInChat(){
    window.__fcJustWoke=true;
    petSleepSet(false);
    try{ aiRenderHead(); aiRenderBody(); }catch(_){}
    // ефект у шапці: улюбленець «вистрибує» в капсулі
    try{
      const cp=document.querySelector('#aiCapPet .cap-pet');
      if(cp){ cp.classList.add('wakefx');
        const r=cp.getBoundingClientRect();
        fcBurst(r.left+r.width/2, r.top+r.height/2, FLOW_PETS[petCur()].glow);
        setTimeout(()=>cp.classList.remove('wakefx'),520);
      }
    }catch(_){}
  }
  function petSleepNow(){
    fcSayHide();
    const el=document.getElementById('flowCap');
    const p=FLOW_PETS[petCur()];
    if(el&&el.style.display!=='none'){
      const r=el.getBoundingClientRect();
      fcBurst(r.left+r.width/2, r.top+r.height/2, p.glow);
      el.classList.add('fc-poof');
      try{ window.platform.haptic('medium'); }catch(_){}
      setTimeout(()=>{ el.classList.remove('fc-poof'); petSleepSet(true); },370);
    } else petSleepSet(true);
  }
  window.petSleepNow=petSleepNow;
  function fcWakeNow(){
    try{ window.platform.haptic('medium'); }catch(_){}
    petSleepSet(false);
    const el=document.getElementById('flowCap');
    if(el){ el.classList.add('fc-appear');
      const r=el.getBoundingClientRect();
      setTimeout(()=>fcBurst(r.left+r.width/2, r.top+r.height/2, FLOW_PETS[petCur()].glow),80);
      setTimeout(()=>{ el.classList.remove('fc-appear'); fcEmote(); },520);
    }
  }
  window.petWake=fcWakeNow;
  /* ── бульбашка: кожні ~2 хв тепла фраза, індивідуальна під характер улюбленця ── */
  const FC_SAY={
    spark:['В тебе все вийде — я в тебе вірю 🔥','Один маленький крок зараз — і день уже не змарнований. Погнали!',
      'Ти сьогодні вже молодець, що взагалі тут. Серйозно.','Не думай ідеально — думай «зроблено». Вогонь!',
      'Пам\u2019ятаєш, навіщо це все? От і я памʼятаю. Тримаємось курсу 🦊','Втомився — це нормально. 5 хвилин перерви теж план.',
      'Кожен блок у планері — цеглинка твого 2027-го.','Я поруч. Треба щось — просто тапни на мене.'],
    luna:['Дихай глибше. Все йде своїм темпом 🌙','Ти робиш більше, ніж помічаєш. Я бачу.',
      'Тиха робота сьогодні — гучний результат завтра.','Не порівнюй себе ні з ким. Порівнюй з собою вчорашнім.',
      'Спокій — це теж суперсила.','Якщо важко — просто зроби найменший крок. Цього досить.'],
    mo:['Ну шо, працюємо? Я підстрахую 🐻','Ти крутий. Це не комплімент, це факт.',
      'Велике складається з малого. Малий крок — теж крок.','Не забудь поїсти й попити води. Я слідкую!',
      'Все під контролем. Навіть коли здається, що ні.'],
    bublik:['Хрум-хрум! А ти сьогодні вже щось відмітив? 🥯','З тобою приємно мати справу. Так тримати!',
      'Маленька перемога — теж перемога. Святкуємо!','Усміхнись. Так, зараз. Ну от, краще ж!',
      'Я тут сиджу і пишаюсь тобою потихеньку.'],
    volt:['Заряд 100%. Твій — теж, я перевірив ⚡','Фокус на одному. Решта почекає.',
      'Дисципліна — це любов до себе завтрашнього.','Зроби зараз те, за що подякуєш собі ввечері.',
      'Система працює, коли працюєш ти. Поїхали.']
  };
  function fcSayPick(){
    const h=new Date().getHours(); const p=petCur();
    const extra=[];
    if(h>=5&&h<11) extra.push('Доброго ранку! Сьогодні буде хороший день ☀️','Ранок — найкращий час для головного кроку.');
    else if(h>=22||h<5) extra.push('Уже пізно. Може, час відпочити? Ти заслужив 🌙','Сон — теж частина системи. Я серйозно.');
    const base=FC_SAY[p]||FC_SAY.spark;
    const pool=base.concat(extra);
    let last=-1; try{ last=+localStorage.getItem('pet_say_i')||-1; }catch(_){}
    let i=Math.floor(Math.random()*pool.length);
    if(pool.length>1&&i===last) i=(i+1)%pool.length;
    try{ localStorage.setItem('pet_say_i',String(i)); }catch(_){}
    return pool[i];
  }
  let fcSayTimer=null, fcSayHideT=null;
  function fcSayHide(){ const b=document.getElementById('fcSay'); if(b) b.classList.remove('on'); if(fcSayHideT){ clearTimeout(fcSayHideT); fcSayHideT=null; } }
  function fcSayShow(){
    const cap=document.getElementById('flowCap'), b=document.getElementById('fcSay');
    if(!cap||!b) return;
    if(petSleeping()||cap.style.display==='none') return;
    if(document.body.classList.contains('spot-open')||document.body.classList.contains('ai-open')||document.body.classList.contains('kb-open')) return;
    b.textContent=fcSayPick();
    // позиція: збоку від улюбленця (щоб не накривати контент над ним);
    // якщо збоку не влазить — fallback над ним, як раніше
    const r=cap.getBoundingClientRect(); const onLeft=(r.left + r.width/2) < window.innerWidth/2;
    b.style.visibility='hidden'; b.classList.add('on');
    requestAnimationFrame(()=>{
      const bw=b.offsetWidth, bh=b.offsetHeight, m=10;
      b.classList.remove('tail-l','tail-r','tail-sl','tail-sr');
      let x=onLeft ? (r.right+12) : (r.left-bw-12);
      if(x>=m && x+bw<=window.innerWidth-m){
        const y=Math.max(64, Math.min(window.innerHeight-bh-m, r.top+r.height/2-bh/2));
        b.classList.add(onLeft?'tail-sl':'tail-sr');
        b.style.left=x+'px'; b.style.top=y+'px';
      } else {
        x=onLeft ? r.left : (r.right - bw);
        x=Math.max(m,Math.min(window.innerWidth-bw-m,x));
        let y=r.top - bh - 12; if(y<64) y=r.bottom+12;
        b.classList.add(onLeft?'tail-l':'tail-r');
        b.style.left=x+'px'; b.style.top=y+'px';
      }
      b.style.visibility='';
    });
    b.onclick=()=>{ fcSayHide(); flowSpotOpen(); };
    try{ window.platform.haptic('light'); }catch(_){}
    if(fcSayHideT) clearTimeout(fcSayHideT);
    fcSayHideT=setTimeout(fcSayHide,8000);
  }
  function fcSayStart(){
    if(fcSayTimer) return;
    setTimeout(fcSayShow, 25000);                       // перше «привіт» через ~25 сек
    fcSayTimer=setInterval(fcSayShow, 120000);          // далі кожні 2 хв
  }
  function flowCapRender(){
    const el=document.getElementById('flowCap'); if(!el) return;
    if(petSleeping()){ el.style.display='none'; fcSayHide(); return; }
    const p=FLOW_PETS[petCur()];
    el.style.display='grid';
    el.style.setProperty('--pet-halo', p.glow+'4d');
    el.innerHTML=`<div class="fc-inner">${petSVG(petCur(),60)}</div>`;
    fcApplyPos(el);
    fcBindDrag(el);
    fcSayStart();
    fcLifeStart();
    if(window.__fcJustWoke){
      const r0=el.getBoundingClientRect();
      if(r0.width>0){ window.__fcJustWoke=false;
        el.classList.add('fc-appear');
        setTimeout(()=>fcBurst(r0.left+r0.width/2, r0.top+r0.height/2, p.glow),100);
        setTimeout(()=>{ el.classList.remove('fc-appear'); fcEmote(); },560);
      }
    }
    el.onclick=null; // тап обробляє pointer-логіка, щоб не конфліктувати з драгом
    fcCheckOverlap();
  }
  /* ── улюбленець «поступається місцем»: якщо його плаваюча позиція
     візуально накрила плитку «Нова папка» (чи будь-яку папку) на Огляді —
     ховаємо його на цей момент, інакше тап зʼїдає пітомець замість кнопки. ── */
  function fcCheckOverlap(){
    try{
      const el=document.getElementById('flowCap');
      if(!el || el.style.display==='none' || el.classList.contains('fc-drag')) return;
      const scr=document.getElementById('scr-home');
      const onHome = scr && scr.classList.contains('active');
      if(!onHome){ document.body.classList.remove('fc-yield'); return; }
      const grid=document.getElementById('folderGrid');
      const r1=el.getBoundingClientRect();
      let hit=false;
      if(grid){
        const tiles=grid.querySelectorAll('.fc2');
        for(const t of tiles){
          const r2=t.getBoundingClientRect();
          if(!(r1.right<r2.left||r1.left>r2.right||r1.bottom<r2.top||r1.top>r2.bottom)){ hit=true; break; }
        }
      }
      document.body.classList.toggle('fc-yield', hit);
    }catch(_){}
  }
  window.fcCheckOverlap=fcCheckOverlap;
  (function(){
    let t=null;
    const sched=()=>{ if(t) return; t=requestAnimationFrame(()=>{ t=null; fcCheckOverlap(); }); };
    window.addEventListener('scroll', sched, {passive:true, capture:true});
    window.addEventListener('resize', sched);
  })();
