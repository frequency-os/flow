  /* ════════ «Журнал героя» (41-journal.js): персонаж, ресурси, тиждень і журнал місій ════════
     Екран scr-journal стоїть у нижній панелі на місці «Гроші» (Гаманець — чипом на Огляді).
     Місія = звичайна ціль з goals_data (09-goals.js) з НЕОБОВʼЯЗКОВИМИ полями — старі цілі працюють як є:
       role:'main'|'side'|'wait'   status:'active'|'pause'|'archive'
       from, to — рівень «зараз» і «мета» (текст)
       sched:{dows:[0..6], min, h, start:'YYYY-MM-DD', end:'YYYY-MM-DD'|'', plan:true|false}
       budget:{hWeek, money}   reward:{t, sum}
     Рівні місії — це наявні віхи gl.ms {id, ym, t, done} + необовʼязкова точна дата due:'YYYY-MM-DD'
     (тому вони видні й у «Дорозі року»). Розклад ставить у Планер ОДИН повторюваний шаблон rt_m_<id>
     (link habit → goalId), plCompleteBlock закриває день у трекері цілі.
     Герой — goalsData.hero {name, cls, energy:{ds:0..100}}. Новий ключ сховища не потрібен.
     Усі записи — лише після дії людини (кнопка «Зберегти», вибір у шторці). */

  const JN_COLORS=['#3ec7b4','#c48cff','#6fd39a','#ff7a59','#5b8def','#f0b429','#ff6b9d'];
  const JN_DOW=['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
  const JN_DOW_ORDER=[1,2,3,4,5,6,0];
  const JN_MON=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
  const JN_CLASSES=['Підприємець','Спортсмен','Студент','Творець','Батьки','Дослідник'];
  const JN_XP_LVL=500;
  let jnShowArchive=false;

  function jnEl(id){ return document.getElementById(id); }
  function jnMoney(n){ const v=Math.round(+n||0); return (v<0?'−':'')+'₴'+Math.abs(v).toLocaleString('uk-UA'); }
  function jnHm(h){ const m=Math.round((+h||0)*60); return String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); }
  function jnDateTxt(ds){ if(!/^\d{4}-\d{2}-\d{2}$/.test(ds||'')) return ''; return (+ds.slice(8))+' '+JN_MON[+ds.slice(5,7)-1]; }
  function jnHero(){ if(!goalsData.hero||typeof goalsData.hero!=='object') goalsData.hero={}; return goalsData.hero; }
  function jnRole(gl){ return gl.role==='main'||gl.role==='wait'?gl.role:'side'; }
  function jnStatus(gl){ return gl.status==='pause'||gl.status==='archive'?gl.status:'active'; }
  function jnLevels(gl){
    return ylGoalMs(gl).slice().sort((a,b)=>String(a.due||a.ym+'-99').localeCompare(String(b.due||b.ym+'-99')));
  }
  function jnPct(gl){
    const lv=jnLevels(gl); if(lv.length) return Math.round(lv.filter(m=>m.done).length/lv.length*100);
    const st=gl.steps||[]; if(st.length) return Math.round(st.filter(s=>s.done).length/st.length*100);
    return 0;
  }

  /* блоки дня БЕЗ розгортання повторюваних у памʼять (читання нічого не змінює) */
  function jnDayBlocks(ds){
    const out=[];
    try{
      const p=plData(), saved=Array.isArray(p.blocksByDay[ds])?p.blocksByDay[ds]:[];
      saved.forEach(b=>{ if(b) out.push(b); });
      const skip=(p.recurSkip&&p.recurSkip[ds])||[];
      (p.recurring||[]).forEach(t=>{
        if(skip.includes(t.id)||!plRecurMatchesDay(t,ds)||saved.some(b=>b&&b.fromRecur===t.id)) return;
        out.push({id:'v_'+t.id, h:t.h, endH:t.endH, t:t.t, link:t.link, done:false, fromRecur:t.id, virtual:true});
      });
    }catch(_){}
    return out.sort((a,b)=>(+a.h||0)-(+b.h||0));
  }
  function jnBlockGoal(b){ return (b&&b.link&&b.link.goalId)?String(b.link.goalId):''; }

  /* досвід: віхи ×100, кроки ×20, дні трекера ×10, виконані блоки місії в Планері ×15 */
  function jnXP(gl){
    let xp=0;
    xp+=jnLevels(gl).filter(m=>m.done).length*100;
    xp+=(gl.steps||[]).filter(s=>s&&s.done&&!s.auto).length*20;
    xp+=gl.track?Object.keys(gl.track).filter(k=>gl.track[k]).length*10:0;
    try{ const by=plData().blocksByDay||{}; Object.keys(by).forEach(ds=>{ (by[ds]||[]).forEach(b=>{ if(b&&b.done&&jnBlockGoal(b)===(gl.id||gl.name)) xp+=15; }); }); }catch(_){}
    return xp;
  }
  function jnHeroXP(){ return (goalsData.goals||[]).reduce((s,gl)=>s+jnXP(gl),0); }

  function jnFreeHours(){
    try{
      const p=plData(), now=new Date(), nowH=now.getHours()+now.getMinutes()/60, end=Math.max(nowH,+p.dayEnd||24);
      const busy=jnDayBlocks(ymdLocal()).filter(b=>!b.done).reduce((s,b)=>s+Math.max(0,Math.min(plBlockEnd(b),end)-Math.max(+b.h||0,nowH)),0);
      return Math.max(0,Math.round((end-nowH-busy)*2)/2);
    }catch(_){ return null; }
  }
  // рівень дня 0–3: частка виконаних блоків
  function jnDayLevel(ds){
    const bl=jnDayBlocks(ds); if(!bl.length) return -1;
    const r=bl.filter(b=>b.done).length/bl.length;
    return r>=1?3:r>=.5?2:r>0?1:0;
  }
  function jnStreak(){
    let n=0; const d=new Date();
    if(jnDayLevel(ymdLocal(d))<1) d.setDate(d.getDate()-1);   // сьогодні ще не закрито — рахуємо від учора
    for(let i=0;i<366;i++){ if(jnDayLevel(ymdLocal(d))<1) break; n++; d.setDate(d.getDate()-1); }
    return n;
  }
  function jnWeek(){
    const now=new Date(), dow=(now.getDay()+6)%7, mon=new Date(now); mon.setDate(now.getDate()-dow);
    const out=[]; for(let i=0;i<7;i++){ const d=new Date(mon); d.setDate(mon.getDate()+i); out.push(ymdLocal(d)); } return out;
  }

  function jnAvatar(){
    try{ if(typeof customAvatar==='string'&&customAvatar) return `<img src="${safeImg(customAvatar)}" alt="">`; }catch(_){}
    const u=window.sbUser&&window.sbUser(), pic=u&&u.user_metadata&&u.user_metadata.avatar_url;
    if(pic) return `<img src="${safeImg(pic)}" alt="">`;
    return esc((jnName()||'Г').trim().charAt(0).toUpperCase());
  }
  function jnName(){
    const h=jnHero(); if(h.name) return String(h.name);
    const u=window.sbUser&&window.sbUser(); const n=u&&u.user_metadata&&u.user_metadata.full_name;
    return n?String(n).split(' ')[0]:'Герой';
  }

  function jnSchedTxt(gl){
    const sc=gl.sched; if(!sc||!Array.isArray(sc.dows)||!sc.dows.length) return 'без розкладу';
    const days=JN_DOW_ORDER.filter(d=>sc.dows.includes(d)).map(d=>JN_DOW[d]).join(' ');
    return days+' · '+(+sc.min||45)+' хв'+(typeof sc.h==='number'?' о '+jnHm(sc.h):'');
  }
  function jnMissionCard(gl){
    const c=safeColor(gl.color,'#3ec7b4'), pct=jnPct(gl), lv=jnLevels(gl), next=lv.find(m=>!m.done);
    const today=jnDayBlocks(ymdLocal()).filter(b=>jnBlockGoal(b)===String(gl.id));
    const role=jnRole(gl), st=jnStatus(gl);
    const lvTxt=[(gl.from||gl.to)?esc(gl.from||'?')+' → '+esc(gl.to||'?'):'', next?'далі: '+esc(next.t)+(next.due?' до '+jnDateTxt(next.due):''):''].filter(Boolean).join(' · ');
    const dayTxt=today.length?'Сьогодні '+today.map(b=>jnHm(b.h)+(b.done?' ✓':'')).join(', '):jnSchedTxt(gl);
    return `<button class="jn-m${role==='main'?' main':''}${st!=='active'?' off':''}" data-jnm="${esc(gl.id)}" style="--c:${c}">
      <span class="jn-m-ic">${safeEmoji(gl.emoji,'🎯')}</span>
      <span class="jn-m-b">
        <span class="jn-m-h"><b>${esc(gl.name||'Місія')}</b><u>${role==='main'?'головна · ':''}${st==='pause'?'пауза · ':''}${pct}%</u></span>
        ${lvTxt?`<span class="jn-m-s">${lvTxt}</span>`:''}
        <span class="jn-bar"><i style="width:${pct}%"></i></span>
        <span class="jn-m-s">${esc(dayTxt)}${gl.reward&&gl.reward.t?' · 🎁 '+esc(gl.reward.t):''}</span>
      </span></button>`;
  }

  /* ── Вигляд «Сторіс» (09.10.2026): кружечки місій, велика картка найближчої справи, свято «Зроблено» ── */
  let jnFocus='';   // id блоку, який людина вибрала великою карткою (лише в памʼяті)

  // фото місії — фото мрії з Карти бажань, привʼязаної до цієї цілі; інакше '' (фон кольору місії)
  function jnMissionPhoto(gl){
    try{
      const w=(wishes||[]).find(x=>x&&x.goalId&&String(x.goalId)===String(gl.id)&&(x.type==='video'?x.thumb:x.img));
      if(!w) return '';
      return safeImg(w.type==='video'?w.thumb:w.img)||'';
    }catch(_){ return ''; }
  }
  function jnGoalById(id){ return (goalsData.goals||[]).find(g=>g&&String(g.id||g.name)===String(id))||null; }
  function jnBg(gl){
    const ph=gl?jnMissionPhoto(gl):'';
    return ph?`background-image:url('${ph}')`:'';
  }
  function jnStory(gl){
    const c=safeColor(gl.color,'#3ec7b4'), pct=jnPct(gl), ph=jnMissionPhoto(gl), off=jnStatus(gl)!=='active'||jnRole(gl)==='wait';
    return `<button class="jn-st${off?' off':''}" data-jnstory="${esc(gl.id)}" style="--c:${c};--p:${pct}">
      <span class="jn-st-r"><span class="jn-st-i"${ph?` style="background-image:url('${ph}')"`:''}>${ph?'':safeEmoji(gl.emoji,'🎯')}</span></span>
      <small>${esc(gl.name||'Місія')}</small></button>`;
  }
  // справи дня: спершу невиконані за часом, потім виконані
  function jnTodayList(){
    const all=jnDayBlocks(ymdLocal());
    return all.filter(b=>!b.done).concat(all.filter(b=>b.done));
  }
  function jnFocusCard(list){
    const undone=list.filter(b=>!b.done);
    if(!list.length) return `<div class="jn-fc empty"><b>На сьогодні справ нема</b><span>Додай справу в Планері або дай місії розклад — тоді вона зʼявиться тут.</span><button class="jn-fc-btn" data-jnplan>Відкрити Планер</button></div>`;
    if(!undone.length) return `<div class="jn-fc empty win"><b>Усе на сьогодні зроблено 🎉</b><span>${list.length} ${pluralUk(list.length,'справа','справи','справ')} закрито. Серія тримається.</span></div>`;
    const b=undone.find(x=>x.id===jnFocus)||undone[0], gl=jnGoalById(jnBlockGoal(b));
    const c=gl?safeColor(gl.color,'#3ec7b4'):'var(--accent)', bg=jnBg(gl);
    return `<div class="jn-fc${bg?' ph':''}" style="--c:${c};${bg}">
      ${bg?'':`<span class="jn-fc-em">${gl?safeEmoji(gl.emoji,'🎯'):'⏱'}</span>`}
      <span class="jn-fc-v"></span>
      <span class="jn-fc-b"><small>${gl?esc(gl.name||'Місія')+' · ':''}${jnHm(b.h)}</small><b>${esc(b.t||'Справа')}</b>
        <button class="jn-fc-btn" data-jndone="${esc(b.id)}">Зроблено</button></span></div>`;
  }
  function jnTaskRow(b){
    const gl=jnGoalById(jnBlockGoal(b)), c=gl?safeColor(gl.color,'#3ec7b4'):'var(--accent)';
    return `<button class="jn-tk${b.done?' done':''}" data-jnfocus="${esc(b.id)}" style="--c:${c}">
      <span class="jn-tk-ic">${b.done?'✓':(gl?safeEmoji(gl.emoji,'🎯'):'⏱')}</span>
      <span class="jn-tk-b"><b>${esc(b.t||'Справа')}</b><small>${gl?esc(gl.name||'')+' · ':''}${jnHm(b.h)}</small></span></button>`;
  }

  function jnRender(){
    const body=jnEl('jnBody'); if(!body) return;
    const goals=(goalsData.goals||[]).filter(g=>g&&g.id);
    const act=goals.filter(g=>jnStatus(g)!=='archive');
    const order=g=>jnRole(g)==='main'?0:(jnRole(g)==='side'&&jnStatus(g)==='active')?1:2;
    const stories=act.slice().sort((a,b)=>order(a)-order(b));
    const arch=goals.filter(g=>jnStatus(g)==='archive');
    const xp=jnHeroXP(), lvl=1+Math.floor(xp/JN_XP_LVL), xpIn=xp%JN_XP_LVL;
    const hero=jnHero(), td=ymdLocal(), en=hero.energy&&typeof hero.energy[td]==='number'?hero.energy[td]:null;
    const free=jnFreeHours(); let bal=null; try{ bal=walletBalance(); }catch(_){}
    const sub=jnEl('jnSub'); if(sub) sub.textContent=act.length?(act.length+' '+pluralUk(act.length,'місія','місії','місій')+' · рівень '+lvl):'почни з головної місії';
    const now=new Date(), streak=jnStreak();
    const list=jnTodayList(), focus=(list.filter(b=>!b.done).find(x=>x.id===jnFocus)||list.find(b=>!b.done)||{}).id;
    const rest=list.filter(b=>b.id!==focus);
    const week=jnWeek().map(ds=>{ const l=jnDayLevel(ds), d=new Date(ds+'T12:00:00');
      return `<button class="jn-d${ds===td?' today':''}${ds>td?' fut':''}" data-jnday="${ds}"><small>${JN_DOW[d.getDay()]}</small><b>${d.getDate()}</b><i class="jl${ds>td?'x':(l<0?'x':l)}"></i></button>`; }).join('');
    const dev=!!(window.upDevOn&&window.upDevOn());
    body.innerHTML=`
      ${hero.started?'':jnStartCard()}
      <div class="jn-top">
        <button class="jn-me" data-jnhero><span class="jn-av sm">${jnAvatar()}</span>
          <span class="jn-me-b"><b>${esc(jnName())}</b><span class="jn-xp"><span class="jn-bar gold"><i style="width:${Math.round(xpIn/JN_XP_LVL*100)}%"></i></span>рів. ${lvl}</span></span></button>
        <span class="jn-fire${streak?'':' zero'}">🔥 ${streak} ${pluralUk(streak,'день','дні','днів')}</span>
      </div>
      <div class="jn-sts">${stories.map(jnStory).join('')}
        <button class="jn-st add" data-jnadd><span class="jn-st-r"><span class="jn-st-i">＋</span></span><small>Місія</small></button></div>
      ${act.length?'':`<div class="jn-empty"><b>Ще нема місій</b>Почни з головної — того, куди йдеш. Рівні, дні й бюджет задаси в ній.<button data-jnadd>+ Перша місія</button></div>`}
      <div class="jn-sec"><span>Сьогодні · ${JN_DOW[now.getDay()]}, ${now.getDate()} ${JN_MON[now.getMonth()]}</span><button data-jnplan>Планер ›</button></div>
      ${jnFocusCard(list)}
      ${rest.length?`<div class="jn-tks">${rest.map(jnTaskRow).join('')}</div>`:''}
      <div class="jn-wk-h"><span>Тиждень</span><span><button data-jnhist>Історія</button></span></div>
      <div class="jn-wk">${week}</div>
      <div class="jn-res">
        <button class="jn-r t" data-jnres="time"><small>Час</small><b>${free===null?'—':String(free).replace('.',',')+' год'}</b><small>вільно сьогодні</small></button>
        <button class="jn-r c" data-jnres="money"><small>Гроші</small><b>${bal===null?'—':jnMoney(bal)}</b><small>Гаманець</small></button>
        <button class="jn-r e" data-jnres="energy"><small>Енергія</small><b>${en===null?'оцінити':en}</b><small>${en===null?'тапни':'зі 100'}</small></button>
      </div>
      ${arch.length?`<button class="jn-arch" data-jnarch>${jnShowArchive?'Сховати архів':'Архів місій · '+arch.length}</button>${jnShowArchive?arch.map(jnMissionCard).join(''):''}`:''}
      <div class="jn-sec"><span>Розбір з Флоу</span></div>
      <div class="jn-ai"><button data-jnai="day">День</button><button data-jnai="week">Тиждень</button><button data-jnai="month">Місяць</button></div>
      <button class="jn-arch" data-jnset>Налаштування гри</button>
      ${dev?`<button class="jn-map" data-jnmap>Карта · «Мій світ» (розробник)</button>`:''}
      <div class="jn-pad"></div>`;
    body.querySelectorAll('[data-jnm]').forEach(b=>b.onclick=()=>{ const gl=goals.find(g=>String(g.id)===b.dataset.jnm); if(gl) jnEditor(gl); });
    body.querySelectorAll('[data-jnstory]').forEach(b=>b.onclick=()=>{ const i=stories.findIndex(g=>String(g.id)===b.dataset.jnstory); if(i>=0) jnStoryView(stories,i); });
    body.querySelectorAll('[data-jnadd]').forEach(b=>b.onclick=()=>jnEditor(null));
    body.querySelectorAll('[data-jnplan]').forEach(p=>p.onclick=()=>{ try{ goPlanner(); }catch(_){} });
    body.querySelectorAll('[data-jnfocus]').forEach(b=>b.onclick=()=>{
      const bl=list.find(x=>x.id===b.dataset.jnfocus); if(!bl) return;
      if(bl.done){ jnUndoSheet(bl); return; }
      jnFocus=bl.id; jnRender(); try{ body.querySelector('.jn-fc').scrollIntoView({block:'nearest',behavior:'smooth'}); }catch(_){} });
    { const d=body.querySelector('[data-jndone]'); if(d) d.onclick=()=>{ const bl=list.find(x=>x.id===d.dataset.jndone); if(bl) jnDone(bl); }; }
    { const h=body.querySelector('[data-jnhero]'); if(h) h.onclick=jnHeroSheet; }
    { const a=body.querySelector('[data-jnarch]'); if(a) a.onclick=()=>{ jnShowArchive=!jnShowArchive; jnRender(); }; }
    { const m=body.querySelector('[data-jnmap]'); if(m) m.onclick=()=>{ if(window.goWorld) window.goWorld(); }; }
    { const st=body.querySelector('[data-jnstart]'); if(st) st.onclick=()=>jnStart(+jnHero().startStep||1); }
    { const hs=body.querySelector('[data-jnhist]'); if(hs) hs.onclick=()=>jnDaySheet(ymdLocal()); }
    { const se=body.querySelector('[data-jnset]'); if(se) se.onclick=jnSettings; }
    body.querySelectorAll('[data-jnday]').forEach(b=>b.onclick=()=>jnDaySheet(b.dataset.jnday));
    body.querySelectorAll('[data-jnai]').forEach(b=>b.onclick=()=>jnAskReview(b.dataset.jnai));
    body.querySelectorAll('[data-jnres]').forEach(b=>b.onclick=()=>{
      const k=b.dataset.jnres;
      if(k==='time'){ try{ goPlanner(); }catch(_){} }
      else if(k==='money'){ try{ goFinance(); }catch(_){} }
      else if(k==='energy') jnEnergySheet();
    });
  }

  /* «Зроблено»: та сама функція Планера, що й галочка в ньому (plCompleteBlock — звичка/крок/дохід).
     Повторюваний блок, якого ще нема в дні, Планер створює тим самим plBlocksFor — як при відкритті дня. */
  function jnToggleBlock(b){
    const p=plData(), old=p.selDate, td=plTodayStr(); let real=null;
    p.selDate=td;
    try{
      const list=plBlocksFor(td);
      real=b.fromRecur&&b.virtual?list.find(x=>x.fromRecur===b.fromRecur):list.find(x=>x.id===b.id);
      if(real) plCompleteBlock(real.id);
    }catch(err){ console.error('jnToggleBlock',err); }
    finally{ p.selDate=old; }
    // plCompleteBlock зберіг уже з сьогоднішнім selDate — зберігаємо ще раз, щоб у сховищі був день, який людина дивилась у Планері
    if(real){ try{ saveGoals(); plRerender(); }catch(_){} }
    return real;
  }
  function jnDone(b){
    const real=jnToggleBlock(b); if(!real||!real.done){ jnRender(); return; }
    jnFocus=''; jnRender();
    jnCelebrate(real);
  }
  function jnUndoSheet(b){
    actionSheet({title:b.t||'Справа', sub:'Уже зроблено сьогодні', items:[
      {ic:'refresh', label:'Зняти позначку «зроблено»', onClick:()=>{ const r=jnToggleBlock(b); jnRender(); return r; }} ]});
  }
  function jnCelebrate(b){
    const gl=jnGoalById(jnBlockGoal(b)), c=gl?safeColor(gl.color,'#3ec7b4'):'#3ec7b4';
    const next=jnTodayList().find(x=>!x.done);
    let prog='';
    if(gl){ const lv=jnLevels(gl), nx=lv.find(m=>!m.done);
      prog='Місія «'+esc(gl.name||'Місія')+'» рушила'+(lv.length?': '+lv.filter(m=>m.done).length+' з '+lv.length+' '+pluralUk(lv.length,'рівня','рівнів','рівнів'):'')+'.'
        +(nx?' Далі — '+esc(nx.t)+(nx.due?' до '+jnDateTxt(nx.due):'')+'.':''); }
    const streak=jnStreak();
    const old=document.querySelector('.jn-cel'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='jn-cel'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.style.setProperty('--c',c);
    ov.innerHTML=`<div class="jn-cel-in">
      <span class="jn-conf" aria-hidden="true">${'<i></i>'.repeat(14)}</span>
      <span class="jn-cel-ok">✓</span>
      <b>${esc(b.t||'Справа')} — зроблено!</b>
      ${prog?`<p>${prog}</p>`:''}
      <span class="jn-cel-chips">${gl?'<span>+15 XP</span>':''}<span>🔥 ${streak} ${pluralUk(streak,'день','дні','днів')}</span></span>
      <button class="jn-cel-go" data-jncgo>${next?'Далі: '+esc(next.t||'Справа'):'Чудово'}</button>
      <button class="jn-cel-undo" data-jncundo>Скасувати</button></div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    ov.querySelector('[data-jncgo]').onclick=()=>{ if(next) jnFocus=next.id; close(); jnRender(); };
    ov.querySelector('[data-jncundo]').onclick=()=>{ jnToggleBlock(b); close(); jnRender(); };
  }

  /* перегляд місії «сторіс»: на весь екран, тап праворуч/ліворуч — наступна/попередня */
  function jnStoryView(arr, i){
    const old=document.querySelector('.jn-sv'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='jn-sv'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    document.body.appendChild(ov);
    const draw=()=>{
      const gl=arr[i], c=safeColor(gl.color,'#3ec7b4'), pct=jnPct(gl), lv=jnLevels(gl), bg=jnBg(gl);
      const today=jnDayBlocks(ymdLocal()).filter(b=>jnBlockGoal(b)===String(gl.id));
      ov.style.setProperty('--c',c);
      ov.innerHTML=`<div class="jn-sv-bg${bg?' ph':''}" style="${bg}">${bg?'':`<span class="jn-sv-big">${safeEmoji(gl.emoji,'🎯')}</span>`}</div><div class="jn-sv-veil"></div>
        <div class="jn-sv-in">
          <div class="jn-sv-seg">${arr.map((_,k)=>`<i class="${k<i?'on':k===i?'cur':''}"></i>`).join('')}</div>
          <div class="jn-sv-h"><span class="jn-sv-em">${safeEmoji(gl.emoji,'🎯')}</span>
            <span><b>${esc(gl.name||'Місія')}</b><small>${jnRole(gl)==='main'?'головна місія':jnRole(gl)==='wait'?'чекає':'місія'}${jnStatus(gl)==='pause'?' · пауза':''}</small></span>
            <button data-svx aria-label="Закрити">✕</button></div>
          <span class="jn-sv-tap l" data-svprev aria-hidden="true"></span><span class="jn-sv-tap r" data-svnext aria-hidden="true"></span>
          <div class="jn-sv-b">
            <div class="jn-sv-pct"><b>${pct}%</b><span>${(gl.from||gl.to)?esc(gl.from||'?')+' → '+esc(gl.to||'?'):'шлях місії'}</span></div>
            <span class="jn-bar"><i style="width:${pct}%"></i></span>
            ${lv.length?`<div class="jn-sv-lv">${lv.slice(0,6).map(m=>`<span class="${m.done?'ok':''}">${m.done?'✓':'○'} ${esc(m.t)}${m.due?' · '+jnDateTxt(m.due):''}</span>`).join('')}${lv.length>6?`<span>ще ${lv.length-6}…</span>`:''}</div>`:''}
            <div class="jn-sv-row"><span>📅 ${esc(today.length?'Сьогодні '+today.map(b=>jnHm(b.h)+(b.done?' ✓':'')).join(', '):jnSchedTxt(gl))}</span>
              ${gl.reward&&gl.reward.t?`<span>🎁 ${esc(gl.reward.t)}</span>`:''}</div>
            <button class="jn-sv-ed" data-sved>Редагувати місію</button>
          </div></div>`;
      ov.querySelector('[data-svx]').onclick=()=>ov.remove();
      ov.querySelector('[data-sved]').onclick=()=>{ ov.remove(); jnEditor(gl); };
      ov.querySelector('[data-svprev]').onclick=()=>{ if(i>0){ i--; draw(); } else ov.remove(); };
      ov.querySelector('[data-svnext]').onclick=()=>{ if(i<arr.length-1){ i++; draw(); } else ov.remove(); };
    };
    draw();
  }

  function jnEnergySheet(){
    const vals=[[20,'Ледве живий'],[40,'Втомлений'],[60,'Нормально'],[80,'Бадьорий'],[100,'На максимумі']];
    actionSheet({title:'Енергія сьогодні', sub:'Від неї залежить, скільки брати на день',
      items:vals.map(([v,l])=>({ic:'', label:v+' · '+l, onClick:()=>{
        const h=jnHero(); if(!h.energy||typeof h.energy!=='object') h.energy={};
        h.energy[ymdLocal()]=v;   // історію енергії не обрізаємо — це журнал гравця
        saveGoals(); jnRender(); }}))});
  }

  function jnHeroSheet(){
    const h=jnHero();
    jnOverlay(`<div class="jn-ed-h"><b>Твій герой</b><button data-jnx aria-label="Закрити">✕</button></div>
      <div class="jn-ed-av"><span class="jn-av big">${jnAvatar()}</span><small>Фото міняється в «Ще → Профіль»</small></div>
      <label class="jn-f"><span>Імʼя</span><input id="jnHName" maxlength="40" value="${esc(h.name||'')}" placeholder="${esc(jnName())}"></label>
      <div class="jn-f"><span>Клас</span><div class="jn-chips" id="jnHCls">${JN_CLASSES.map(c=>`<button class="jn-chip${h.cls===c?' on':''}" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>
      <div class="jn-ed-foot"><button class="jn-btn" data-jnsave>Зберегти</button></div>`, ov=>{
      let cls=h.cls||'';
      ov.querySelectorAll('#jnHCls [data-v]').forEach(b=>b.onclick=()=>{ cls=(cls===b.dataset.v)?'':b.dataset.v; ov.querySelectorAll('#jnHCls [data-v]').forEach(x=>x.classList.toggle('on',x.dataset.v===cls)); });
      ov.querySelector('[data-jnsave]').onclick=()=>{
        h.name=String(ov.querySelector('#jnHName').value||'').trim().slice(0,40); h.cls=cls;
        saveGoals(); ov.remove(); jnRender(); };
    });
  }

  /* спільна повноекранна шторка редакторів */
  function jnOverlay(html, bind){
    const old=document.querySelector('.jn-ov'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='jn-ov'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.innerHTML=`<div class="jn-ed">${html}</div>`;
    document.body.appendChild(ov);
    ov.onclick=e=>{ if(e.target===ov) ov.remove(); };
    const x=ov.querySelector('[data-jnx]'); if(x) x.onclick=()=>ov.remove();
    bind(ov);
    return ov;
  }

  /* розклад місії → один повторюваний шаблон Планера (rt_m_<id>) */
  // невиконані блоки шаблону від сьогодні вперед (як вимикач шаблону в Планері, але минуле не чіпаємо)
  function jnClearFuture(tplId){
    const p=plData(), td=ymdLocal();
    Object.keys(p.blocksByDay||{}).forEach(ds=>{
      if(ds<td||!Array.isArray(p.blocksByDay[ds])) return;
      p.blocksByDay[ds]=p.blocksByDay[ds].filter(b=>!(b&&b.fromRecur===tplId&&!b.done));
    });
  }
  // інші шаблони Планера цієї цілі (напр. rt_ai_* з AI-старту)
  function jnOtherTpls(gl){
    try{ return (plData().recurring||[]).filter(t=>t&&t.id!=='rt_m_'+gl.id&&t.link&&String(t.link.goalId)===String(gl.id)); }catch(_){ return []; }
  }
  function jnTplDows(t){
    const r=t&&t.repeat||{};
    if(r.type==='daily') return [0,1,2,3,4,5,6];
    if(r.type==='weekdays') return [1,2,3,4,5];
    if(r.type==='weekly'&&t.startDate) return [new Date(t.startDate+'T12:00:00').getDay()];
    return Array.isArray(r.dows)?r.dows.map(Number).filter(x=>x>=0&&x<=6):[];
  }
  function jnSyncRecur(gl, adoptIds, adoptActive){
    const p=plData(); if(!Array.isArray(p.recurring)) p.recurring=[];
    // розклад, що його переймає місія, — старі шаблони геть разом із їхніми ще не виконаними блоками
    (adoptIds||[]).forEach(aid=>{ if(aid==='rt_m_'+gl.id) return; p.recurring=p.recurring.filter(t=>!(t&&t.id===aid)); jnClearFuture(aid); });
    const id='rt_m_'+gl.id, i=p.recurring.findIndex(t=>t&&t.id===id), prev=i>=0?p.recurring[i]:null;
    const sig=t=>t?[t.h,t.endH,(t.repeat&&t.repeat.dows||[]).join(','),t.startDate,t.endDate||''].join('|'):'';
    const sc=gl.sched;
    const on=!!(sc&&Array.isArray(sc.dows)&&sc.dows.length&&sc.plan!==false&&jnStatus(gl)==='active'&&jnRole(gl)!=='wait');
    if(!on){ if(i>=0){ p.recurring.splice(i,1); jnClearFuture(id); } return; }
    const h=Math.min(23.75,Math.max(0,+sc.h||18)), endH=Math.min(24,h+Math.max(5,+sc.min||45)/60);
    const tpl={id, h, endH, t:String(gl.name||'Місія').slice(0,60), c:gl.color||'', tag:'', folder:gl.folderKey||'',
      link:{type:'habit', goalId:gl.id, goalName:String(gl.name||'')},
      repeat:{type:'custom', dows:sc.dows.map(Number).filter(d=>d>=0&&d<=6)},
      startDate:sc.start||ymdLocal(), endDate:sc.end||'',
      // вимкнений людиною в Планері шаблон Журнал знову не вмикає
      active:prev?prev.active!==false:(adoptActive===false?false:true)};
    // змінились дні/час/період — розставлені раніше невиконані блоки переставляться за новим розкладом
    if(prev&&sig(prev)!==sig(tpl)) jnClearFuture(id);
    if(i>=0) p.recurring[i]=Object.assign(prev,tpl); else p.recurring.push(tpl);
  }

  function jnEditor(gl){
    const isNew=!gl;
    const others=gl?jnOtherTpls(gl):[];
    const adopt=(gl&&!gl.sched&&others.length===1&&/^rt_ai_/.test(String(others[0].id)))?others:[];
    const othersKeep=others.length-adopt.length;
    const sc=(gl&&gl.sched)||(adopt[0]?{dows:jnTplDows(adopt[0]), h:+adopt[0].h||18, min:Math.round(((+adopt[0].endH||(+adopt[0].h+1))-(+adopt[0].h||0))*60)||45, start:adopt[0].startDate||'', end:adopt[0].endDate||''}:{});
    const d={ name:gl?gl.name:'', emoji:gl?gl.emoji:'🎯', color:gl?gl.color:JN_COLORS[(goalsData.goals||[]).length%JN_COLORS.length],
      role:gl?jnRole(gl):((goalsData.goals||[]).some(g=>jnRole(g)==='main'&&jnStatus(g)!=='archive')?'side':'main'),
      status:gl?jnStatus(gl):'active', from:gl?gl.from||'':'', to:gl?gl.to||'':'',
      levels:gl?jnLevels(gl).map(m=>({id:m.id,t:m.t,due:m.due||'',ym:m.ym,done:!!m.done})):[],
      startIds:gl?jnLevels(gl).map(m=>m.id):[],
      dows:Array.isArray(sc.dows)?sc.dows.slice():[], min:+sc.min||45, h:typeof sc.h==='number'?sc.h:18,
      start:sc.start||ymdLocal(), end:sc.end||'', plan:sc.plan!==false,
      hWeek:(gl&&gl.budget&&+gl.budget.hWeek)||'', money:(gl&&gl.budget&&+gl.budget.money)||'',
      rt:(gl&&gl.reward&&gl.reward.t)||'', rs:(gl&&gl.reward&&+gl.reward.sum)||'', folderKey:gl?gl.folderKey||null:null };
    const seg=(name,opts,val)=>`<div class="jn-seg" data-seg="${name}">${opts.map(([v,l])=>`<button class="${val===v?'on':''}" data-v="${v}">${l}</button>`).join('')}</div>`;
    const lvRow=(m,i)=>`<div class="jn-lv${m.done?' done':''}" data-i="${i}"><button class="jn-lv-ck" data-lvck="${i}" aria-label="Досягнуто">${m.done?'✓':''}</button>
      <input value="${esc(m.t)}" data-lvt="${i}" maxlength="80" placeholder="Рівень, напр. B1"><input type="date" value="${esc(m.due)}" data-lvd="${i}">
      <button class="jn-lv-x" data-lvx="${i}" aria-label="Прибрати рівень">✕</button></div>`;
    const folderTxt=()=>d.folderKey&&folders[d.folderKey]?safeEmoji(folders[d.folderKey].emoji,'📁')+' '+esc(folders[d.folderKey].name||'Папка'):'без папки';
    jnOverlay(`<div class="jn-ed-h"><b>${isNew?'Нова місія':'Місія'}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <div class="jn-row"><input class="jn-emo" id="jnEmo" maxlength="16" value="${esc(d.emoji||'🎯')}" aria-label="Емодзі"><input class="jn-name" id="jnName" maxlength="80" value="${esc(d.name)}" placeholder="Напр. Англійська B2"></div>
      <div class="jn-colors" id="jnColors">${JN_COLORS.map(c=>`<button style="--c:${c}" class="${c===d.color?'on':''}" data-c="${c}" aria-label="Колір"></button>`).join('')}</div>
      <div class="jn-f"><span>Роль</span>${seg('role',[['main','Головна'],['side','Побічна'],['wait','Чекає']],d.role)}</div>
      <div class="jn-f"><span>Стан</span>${seg('status',[['active','Активна'],['pause','Пауза'],['archive','Архів']],d.status)}</div>
      <div class="jn-f"><span>Зараз → мета</span><div class="jn-row"><input id="jnFrom" maxlength="30" value="${esc(d.from)}" placeholder="A2"><span class="jn-arr">→</span><input id="jnTo" maxlength="30" value="${esc(d.to)}" placeholder="B2"></div></div>
      <div class="jn-f"><span>Рівні</span><div id="jnLvls">${d.levels.map(lvRow).join('')}</div><button class="jn-mini" data-lvadd>+ Рівень</button></div>
      <div class="jn-f"><span>Дні</span><div class="jn-chips" id="jnDows">${JN_DOW_ORDER.map(x=>`<button class="jn-chip${d.dows.includes(x)?' on':''}" data-v="${x}">${JN_DOW[x]}</button>`).join('')}</div></div>
      <div class="jn-row3"><label class="jn-f"><span>О котрій</span><input type="time" id="jnTime" value="${jnHm(d.h)}"></label>
        <label class="jn-f"><span>Хвилин</span><input type="number" id="jnMin" min="5" max="600" step="5" value="${d.min}"></label></div>
      <div class="jn-row3"><label class="jn-f"><span>Від</span><input type="date" id="jnStart" value="${esc(d.start)}"></label>
        <label class="jn-f"><span>До</span><input type="date" id="jnEnd" value="${esc(d.end)}"></label></div>
      ${adopt.length?`<div class="jn-note">Розклад узято з AI-старту в Планері. Після «Зберегти» він стане розкладом місії, а старий шаблон заміниться ним (без дублів).</div>`:''}
      ${othersKeep>0?`<div class="jn-note">У Планері вже є ${othersKeep} ${pluralUk(othersKeep,'розклад','розклади','розкладів')} цієї цілі — Журнал їх не чіпає. Якщо задаси дні тут, у ці дні може бути два блоки.</div>`:''}
      <label class="jn-check"><input type="checkbox" id="jnPlan"${d.plan?' checked':''}> Ставити в Планер у ці дні</label>
      <div class="jn-row3"><label class="jn-f"><span>Годин / тиждень</span><input type="number" id="jnHW" min="0" max="168" step="0.5" value="${esc(String(d.hWeek))}" placeholder="авто"></label>
        <label class="jn-f"><span>₴ / місяць</span><input type="number" id="jnMoney" min="0" step="100" value="${esc(String(d.money))}" placeholder="0"></label></div>
      <div class="jn-row3"><label class="jn-f"><span>Нагорода</span><input id="jnRT" maxlength="60" value="${esc(d.rt)}" placeholder="Поїздка, річ…"></label>
        <label class="jn-f"><span>Ціна, ₴</span><input type="number" id="jnRS" min="0" step="100" value="${esc(String(d.rs))}" placeholder="0"></label></div>
      <div class="jn-f"><span>Папка</span><button class="jn-mini" data-jnfold>${folderTxt()}</button></div>
      <div class="jn-ed-foot">
        ${isNew?'':`<button class="jn-btn ghost" data-jngoals>Кроки й трекер</button><button class="jn-btn danger" data-jndel>Видалити</button>`}
        <button class="jn-btn" data-jnsave>Зберегти</button></div>`, ov=>{
      const q=s=>ov.querySelector(s);
      // поля, які перемальовуються, спершу забирають введене
      const pull=()=>{ ov.querySelectorAll('[data-lvt]').forEach(i=>{ const m=d.levels[+i.dataset.lvt]; if(m) m.t=i.value; });
        ov.querySelectorAll('[data-lvd]').forEach(i=>{ const m=d.levels[+i.dataset.lvd]; if(m) m.due=i.value; }); };
      const bindLv=()=>{
        ov.querySelectorAll('[data-lvck]').forEach(b=>b.onclick=()=>{ pull(); const m=d.levels[+b.dataset.lvck]; if(m){ m.done=!m.done; drawLv(); } });
        ov.querySelectorAll('[data-lvx]').forEach(b=>b.onclick=()=>{ pull(); d.levels.splice(+b.dataset.lvx,1); drawLv(); });
      };
      const drawLv=()=>{ q('#jnLvls').innerHTML=d.levels.map(lvRow).join(''); bindLv(); };
      bindLv();
      q('[data-lvadd]').onclick=()=>{ pull(); d.levels.push({id:'',t:'',due:'',done:false}); drawLv(); const ins=ov.querySelectorAll('[data-lvt]'); if(ins.length) ins[ins.length-1].focus(); };
      ov.querySelectorAll('.jn-seg').forEach(sg=>sg.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{
        d[sg.dataset.seg]=b.dataset.v; sg.querySelectorAll('[data-v]').forEach(x=>x.classList.toggle('on',x===b)); }));
      ov.querySelectorAll('#jnColors [data-c]').forEach(b=>b.onclick=()=>{ d.color=b.dataset.c; ov.querySelectorAll('#jnColors [data-c]').forEach(x=>x.classList.toggle('on',x===b)); });
      ov.querySelectorAll('#jnDows [data-v]').forEach(b=>b.onclick=()=>{ const v=+b.dataset.v, i=d.dows.indexOf(v);
        if(i>=0) d.dows.splice(i,1); else d.dows.push(v); b.classList.toggle('on',i<0); });
      q('[data-jnfold]').onclick=()=>pickFolderForGoal(k=>{ d.folderKey=k||null; const b=q('[data-jnfold]'); if(b) b.innerHTML=folderTxt(); });
      if(!isNew){
        q('[data-jngoals]').onclick=()=>{ ov.remove(); try{ goGoals(); }catch(_){} };
        q('[data-jndel]').onclick=()=>confirmSheet({title:'Видалити місію «'+String(gl.name||'').slice(0,40)+'»?',
          sub:'Зникнуть її рівні, кроки й трекер, а з Планера — невиконані блоки місії від сьогодні. Виконані лишаться. Можна натомість перенести в архів.',
          okLabel:'Видалити', onOk:()=>{
            const cur=(goalsData.goals||[]).find(x=>x&&x.id===gl.id);
            if(!cur){ ov.remove(); jnRender(); try{ plToast('Місію вже змінили або прибрали на іншому пристрої'); }catch(_){} return; }
            try{ if(cur.wishId){ const w=wishes.find(x=>x.id===cur.wishId); if(w){ delete w.goalId; saveWishes(); } } }catch(_){}
            const p=plData(), ids=['rt_m_'+cur.id].concat(jnOtherTpls(cur).filter(t=>/^rt_ai_/.test(String(t.id))).map(t=>t.id));
            p.recurring=(p.recurring||[]).filter(t=>!(t&&ids.includes(t.id))); ids.forEach(jnClearFuture);
            goalsData.goals=goalsData.goals.filter(x=>!(x&&x.id===cur.id));
            saveGoals(); ov.remove(); jnRender(); try{ renderGoals(); }catch(_){} try{ plToast('Місію видалено'); }catch(_){} }});
      }
      q('[data-jnsave]').onclick=()=>{
        pull();
        const name=String(q('#jnName').value||'').trim().slice(0,80);
        if(!name){ q('#jnName').focus(); try{ plToast('Дай місії назву'); }catch(_){} return; }
        const tm=String(q('#jnTime').value||'18:00').split(':');
        // поки редактор був відкритий, синк з хмарою міг підмінити goalsData — беремо свіжу ціль за id
        const cur=gl?(goalsData.goals||[]).find(x=>x&&x.id===gl.id):null;
        if(gl&&!cur){ ov.remove(); jnRender(); try{ plToast('Місію змінили на іншому пристрої — відкрий її ще раз'); }catch(_){} return; }
        const g=cur||{ id:'g_m_'+Date.now()+'_'+Math.random().toString(36).slice(2,5), steps:[], track:{}, days:{}, open:true, ms:[] };
        g.name=name; g.emoji=safeEmoji(q('#jnEmo').value,'🎯'); g.color=safeColor(d.color,JN_COLORS[0]);
        if(d.role==='main') (goalsData.goals||[]).forEach(x=>{ if(x!==g&&jnRole(x)==='main') x.role='side'; });
        g.role=d.role; g.status=d.status;
        g.from=String(q('#jnFrom').value||'').trim().slice(0,30); g.to=String(q('#jnTo').value||'').trim().slice(0,30);
        const endV=String(q('#jnEnd').value||''), ymNow=/^\d{4}-\d{2}-\d{2}$/.test(endV)?endV.slice(0,7):ymdLocal().slice(0,7), keep=Array.isArray(g.ms)?g.ms.filter(m=>!(m&&typeof m==='object'&&/^\d{4}-\d{2}$/.test(m.ym||''))||(m&&m.id&&!d.startIds.includes(m.id)&&!d.levels.some(x=>x.id===m.id))):[];
        g.ms=keep.concat(d.levels.filter(m=>String(m.t||'').trim()).map((m,i)=>{
          const due=/^\d{4}-\d{2}-\d{2}$/.test(m.due||'')?m.due:'';
          const old=Array.isArray(g.ms)?g.ms.find(x=>x&&x.id&&x.id===m.id):null;
          return Object.assign(old||{}, { id:m.id||('ms_m_'+Date.now()+'_'+i+'_'+Math.random().toString(36).slice(2,5)),
            ym:due?due.slice(0,7):(m.ym||ymNow), t:String(m.t).trim().slice(0,80), done:!!m.done, due });
        }));
        g.sched={ dows:d.dows.slice().sort(), min:Math.min(600,Math.max(5,+q('#jnMin').value||45)),
          h:Math.min(23.75,Math.max(0,(+tm[0]||0)+(+tm[1]||0)/60)),
          start:/^\d{4}-\d{2}-\d{2}$/.test(q('#jnStart').value)?q('#jnStart').value:ymdLocal(),
          end:/^\d{4}-\d{2}-\d{2}$/.test(q('#jnEnd').value)?q('#jnEnd').value:'', plan:!!q('#jnPlan').checked };
        const hw=+q('#jnHW').value, mo=+q('#jnMoney').value;
        g.budget={ hWeek:hw>0?Math.min(168,hw):Math.round(g.sched.dows.length*g.sched.min/60*4)/4, money:mo>0?Math.round(mo):0 };
        const rt=String(q('#jnRT').value||'').trim().slice(0,60), rs=+q('#jnRS').value;
        g.reward=rt?{ t:rt, sum:rs>0?Math.round(rs):0 }:null;
        g.folderKey=d.folderKey&&folders[d.folderKey]?d.folderKey:null;
        if(isNew){ if(!Array.isArray(goalsData.goals)) goalsData.goals=[]; goalsData.goals.push(g); }
        const willOn=g.sched.dows.length&&g.sched.plan&&g.status==='active'&&g.role!=='wait';
        jnSyncRecur(g, willOn?adopt.map(t=>t.id):[], (willOn&&adopt[0]&&adopt[0].active===false)?false:undefined);
        saveGoals(); ov.remove(); jnRender(); try{ renderGoals(); }catch(_){}
        try{ plToast(isNew?'Місію додано':'Збережено'); }catch(_){}
      };
    });
  }

  /* ─── СТАРТ ГРИ: 5 кроків, усе вводить людина (жодних прикладів і заготовок) ───
     Кожен крок пише лише після «Далі». Пройдений старт запамʼятовується (hero.started) і сам ніколи не скидається. */
  function jnStartCard(){
    const st=+jnHero().startStep||0;
    return `<div class="jn-start"><b>${st>1?'Продовжити старт гри':'Почни гру'}</b><span>5 кроків: куди йдеш, хто ти, з чим стартуєш, місії, перший день.</span>
      <button data-jnstart>${st>1?'Продовжити · крок '+st+' з 5':'Почати · 5 кроків'}</button></div>`;
  }
  function jnStart(step){
    step=Math.min(5,Math.max(1,+step||1));
    const h=jnHero(), L=ylLetter(), p=plData();
    let bal=null, ops=0; try{ ops=walletOps().length; bal=walletBalance(); }catch(_){}
    const signedIn=!!(window.sbUser&&window.sbUser());
    const finReady=signedIn&&!!(window.storeKeyReady&&window.storeKeyReady('fin_ops'));
    const hours=(a,b,v)=>{ let o=''; a=Math.min(a,v); b=Math.max(b,v); for(let x=a;x<=b;x++) o+=`<option value="${x}"${x===v?' selected':''}>${String(x).padStart(2,'0')}:00</option>`; return o; };
    const act=(goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)!=='archive');
    let body='';
    if(step===1) body=`<b class="jn-q">Куди ти йдеш?</b>
      <p class="jn-p">Напиши, як виглядає твоє життя в точці Б, — як лист собі в майбутнє. Своїми словами: з цього листа виростуть місії.</p>
      <textarea id="jsLetter" rows="7" maxlength="2000" placeholder="Через рік я…">${esc(L.text)}</textarea>
      <label class="jn-f"><span>До якої дати</span><input type="date" id="jsDate" value="${esc(ylDate(L))}"></label>`;
    else if(step===2) body=`<b class="jn-q">Хто ти в грі</b>
      <div class="jn-ed-av"><span class="jn-av big">${jnAvatar()}</span><small>Фото — у «Ще → Профіль»</small></div>
      <label class="jn-f"><span>Імʼя героя</span><input id="jsName" maxlength="40" value="${esc(h.name||'')}" placeholder="Як тебе звати в грі"></label>
      <div class="jn-f"><span>Клас</span><div class="jn-chips" id="jsCls">${JN_CLASSES.map(c=>`<button class="jn-chip${h.cls===c?' on':''}" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>`;
    else if(step===3) body=`<b class="jn-q">З чим стартуєш</b>
      <p class="jn-p">Твої справжні ресурси. Нічого не підставляємо — лише те, що введеш.</p>
      ${ops?`<div class="jn-note">У Гаманці вже є записи: зараз <b>${jnMoney(bal)}</b>. Стартовий залишок не потрібен.</div>`
        :finReady?`<label class="jn-f"><span>Скільки зараз на рахунку, ₴</span><input type="number" id="jsBal" min="0" step="100" inputmode="decimal" placeholder="Напр. 12000"></label>`
        :signedIn?`<div class="jn-note">Гаманець ще звіряється з хмарою. Суму можна буде додати в Гаманці — так нічого не задвоїться.</div>`
        :`<div class="jn-note">Без входу в акаунт стартову суму краще внести в Гаманці після входу — інакше вона може задвоїтись із записами акаунта.</div>`}
      <label class="jn-f"><span>Скільки годин на тиждень маєш на місії</span><input type="number" id="jsHW" min="0" max="112" step="0.5" value="${h.hWeek?esc(String(h.hWeek)):''}" placeholder="Напр. 10"></label>
      <div class="jn-row3"><label class="jn-f"><span>День починається</span><select id="jsDS">${hours(4,12,+p.dayStart||0)}</select></label>
        <label class="jn-f"><span>і закінчується</span><select id="jsDE">${hours(16,24,+p.dayEnd||24)}</select></label></div>`;
    else if(step===4) body=`<b class="jn-q">Твої місії</b>
      <p class="jn-p">Флоу може розкласти лист на місії — ти переглянеш і підтвердиш кожну. Або додай свої вручну. Одна — головна.</p>
      ${act.length?act.map(g=>`<div class="jn-mini-m" style="--c:${safeColor(g.color,'#3ec7b4')}"><span>${safeEmoji(g.emoji,'🎯')}</span><b>${esc(g.name||'Місія')}</b><u>${jnRole(g)==='main'?'головна':jnRole(g)==='wait'?'чекає':''}</u></div>`).join(''):'<div class="jn-note">Місій ще нема.</div>'}
      <div class="jn-row3"><button class="jn-btn ghost" data-jsai>Розкласти лист з Флоу</button><button class="jn-btn ghost" data-jsadd>+ Місія вручну</button></div>`;
    else body=`<b class="jn-q">Готово до старту</b>
      <div class="jn-sum"><span>Герой</span><b>${esc(h.name||jnName())}${h.cls?' · '+esc(h.cls):''}</b>
        <span>Точка Б</span><b>${L.text.trim()?'до '+esc(ylDateTxt(ylDate(L))):'не задано'}</b>
        <span>Гаманець</span><b>${bal===null?'—':jnMoney(bal)}</b>
        <span>На місії</span><b>${h.hWeek?esc(String(h.hWeek))+' год / тиждень':'не задано'}</b>
        <span>Місій</span><b>${act.length}</b></div>
      <p class="jn-p">Після старту все зберігається: дні, місії, гроші й енергія лишаються в історії. Скинути можна лише вручну в «Налаштуваннях гри».</p>`;
    const snap=()=>{ try{ return JSON.stringify([goalsData.letter||null, h.name||'', h.cls||'', h.hWeek||0, h.started||'', p.dayStart, p.dayEnd]); }catch(_){ return ''; } };
    const before=snap();
    jnOverlay(`<div class="jn-ed-h"><b>Старт гри</b><button data-jnx aria-label="Закрити">✕</button></div>
      <div class="jn-steps">${[1,2,3,4,5].map(i=>`<i class="${i<=step?'on':''}"></i>`).join('')}</div>
      <span class="jn-k">Крок ${step} з 5</span>${body}
      <div class="jn-ed-foot">${step>1?'<button class="jn-btn ghost" data-jnback>Назад</button>':''}<button class="jn-btn" data-jnnext>${step===5?'Почати гру':'Далі'}</button></div>`, ov=>{
      const q=x=>ov.querySelector(x);
      let cls=h.cls||'';
      ov.querySelectorAll('#jsCls [data-v]').forEach(b=>b.onclick=()=>{ cls=(cls===b.dataset.v)?'':b.dataset.v; ov.querySelectorAll('#jsCls [data-v]').forEach(x=>x.classList.toggle('on',x.dataset.v===cls)); });
      const ai=q('[data-jsai]'); if(ai) ai.onclick=()=>{ h.startStep=4; saveGoals(); ov.remove(); try{ aiStartSheet(); }catch(e){ console.error('aiStart',e); } };
      const ad=q('[data-jsadd]'); if(ad) ad.onclick=()=>{ h.startStep=4; saveGoals(); ov.remove(); jnEditor(null); };
      const bk=q('[data-jnback]'); if(bk) bk.onclick=()=>jnStart(step-1);
      q('[data-jnnext]').onclick=()=>{
        if(step===1){
          const text=String(q('#jsLetter').value||'').trim().slice(0,2000);
          if(!text){ q('#jsLetter').focus(); try{ plToast('Напиши хоч кілька речень про точку Б'); }catch(_){} return; }
          const dv=String(q('#jsDate').value||'');
          goalsData.letter={ text, date:/^\d{4}-\d{2}-\d{2}$/.test(dv)?dv:ylDate(L), wishId:L.wishId||'' };
        } else if(step===2){
          h.name=String(q('#jsName').value||'').trim().slice(0,40); h.cls=cls;
        } else if(step===3){
          const hw=+(q('#jsHW')&&q('#jsHW').value); h.hWeek=hw>0?Math.min(112,hw):0;
          const ds=+q('#jsDS').value, de=+q('#jsDE').value; if(de>ds){ p.dayStart=ds; p.dayEnd=de; }
          const bi=q('#jsBal'), amount=bi?parseFloat(String(bi.value||'').replace(',','.')):0;
          // стартовий залишок — лише в прочитаний і порожній Гаманець (інакше задвоїли б хмарні записи)
          if(amount>0 && window.sbUser && window.sbUser() && window.storeKeyReady && window.storeKeyReady('fin_ops') && !walletOps().length){
            try{ ensureCards(); finOps.push({ id:'start_'+Date.now(), type:'in', amount:Math.round(amount*100)/100, label:'Стартовий залишок', date:ymdLocal(), card:mainCard().id }); saveFinOps(); }
            catch(e){ console.error('start balance',e); }
          }
        } else if(step===5){
          h.started=ymdLocal(); delete h.startStep;
          saveGoals(); ov.remove(); jnRender(); try{ plToast('Гру почато — успіхів, '+jnName()+'!'); }catch(_){} return;
        }
        h.startStep=step+1;
        if(snap()!==before) saveGoals();   // нічого не змінилось — не перезаписуємо ключ цілком (крок лишиться в памʼяті)
        jnStart(step+1);
      };
    });
  }

  /* ─── НАЛАШТУВАННЯ ГРИ: нічого не скидається саме; лише ці дві дії і лише рукою ─── */
  function jnSettings(){
    actionSheet({title:'Налаштування гри', sub:'Історія днів, місії, гроші й лист не скидаються ніколи — лише те, що вибереш тут.', items:[
      {ic:'refresh', label:'Пройти старт ще раз', sub:'Нічого не видаляє — лише відкриває кроки старту', onClick:()=>jnStart(1)},
      {ic:'edit', label:'Герой: імʼя і клас', onClick:jnHeroSheet},
      {ic:'trash', label:'Скинути налаштування гри', sub:'Герой і бюджет годин; місії та історія лишаються', danger:true, onClick:()=>confirmSheet({
        title:'Скинути налаштування гри?', sub:'Скинуться імʼя героя, клас, бюджет годин і позначка старту. Місії, рівні, історія днів, енергія, гроші й лист лишаються.',
        okLabel:'Скинути', onOk:()=>{ const h=jnHero(); delete h.name; delete h.cls; delete h.hWeek; delete h.started; delete h.startStep; saveGoals(); jnRender(); try{ plToast('Налаштування гри скинуто'); }catch(_){} }})}
    ]});
  }

  /* ─── ЖУРНАЛ ДНІВ: будь-який день — що зроблено, енергія, гроші, щоденник. Лише читання ─── */
  function jnDaySheet(ds, ym){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(ds||'')) ds=ymdLocal();
    ym=/^\d{4}-\d{2}$/.test(ym||'')?ym:ds.slice(0,7);
    const td=ymdLocal(), goals=goalsData.goals||[];
    const gById=id=>goals.find(g=>g&&String(g.id)===String(id));
    const bl=ds>=td?jnDayBlocks(ds):(()=>{ try{ const s=plData().blocksByDay[ds]; return Array.isArray(s)?s.filter(Boolean).slice().sort((a,b)=>(+a.h||0)-(+b.h||0)):[]; }catch(_){ return []; } })();
    const done=bl.filter(b=>b.done);
    const moved=[...new Set(done.map(jnBlockGoal).filter(Boolean))].map(gById).filter(Boolean);
    const h=jnHero(), en=h.energy&&typeof h.energy[ds]==='number'?h.energy[ds]:null;
    let ops=[]; try{ ops=walletOps().filter(o=>o&&o.date===ds); }catch(_){}
    const inS=ops.filter(o=>o.type==='in').reduce((s,o)=>s+(+o.amount||0),0), outS=ops.filter(o=>o.type!=='in').reduce((s,o)=>s+(+o.amount||0),0);
    let dia=''; try{ const e=diaryEntries[ds]; if(e&&e.text&&e.text.trim()) dia=e.text.trim(); }catch(_){}
    const d=new Date(ds+'T12:00:00');
    // календар місяця
    const y=+ym.slice(0,4), m=+ym.slice(5,7)-1, first=new Date(y,m,1), days=new Date(y,m+1,0).getDate(), lead=(first.getDay()+6)%7;
    let cal=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(x=>`<i class="jc-h">${x}</i>`).join('')+'<i></i>'.repeat(lead);
    for(let i=1;i<=days;i++){ const dd=ymdLocal(new Date(y,m,i)), l=dd>td?-1:jnDayLevel(dd);
      cal+=`<button class="jc-d jl${l<0?'x':l}${dd===ds?' sel':''}${dd===td?' td':''}" data-jcd="${dd}">${i}</button>`; }
    const prevYm=ymdLocal(new Date(y,m-1,1)).slice(0,7), nextYm=ymdLocal(new Date(y,m+1,1)).slice(0,7);
    jnOverlay(`<div class="jn-ed-h"><b>Журнал днів</b><button data-jnx aria-label="Закрити">✕</button></div>
      <div class="jc-nav"><button data-jcm="${prevYm}" aria-label="Попередній місяць">‹</button><b>${YL_MON[m]} ${y}</b><button data-jcm="${nextYm}" aria-label="Наступний місяць">›</button></div>
      <div class="jc">${cal}</div>
      <div class="jd-h"><b>${JN_DOW[d.getDay()]}, ${d.getDate()} ${JN_MON[d.getMonth()]}${ds===td?' · сьогодні':''}</b><small>${bl.length?done.length+' з '+bl.length+' зроблено':'план порожній'}</small></div>
      ${bl.length?`<div class="jd-list">${bl.map(b=>{ const g=gById(jnBlockGoal(b)); return `<div class="jd-b${b.done?' ok':''}" style="--c:${safeColor(g&&g.color,'#8a96b0')}"><span>${jnHm(b.h)}</span><b>${esc(b.t||'Блок')}</b><u>${b.done?'✓':'—'}</u></div>`; }).join('')}</div>`:''}
      ${moved.length?`<div class="jn-f"><span>Місії, що рушили</span><div class="jn-chips">${moved.map(g=>`<span class="jd-chip" style="--c:${safeColor(g.color,'#3ec7b4')}">${safeEmoji(g.emoji,'🎯')} ${esc(g.name||'')}</span>`).join('')}</div></div>`:''}
      <div class="jd-grid"><div><small>Енергія</small><b>${en===null?'—':en}</b></div><div><small>Дохід</small><b class="in">${inS?jnMoney(inS):'—'}</b></div><div><small>Витрати</small><b>${outS?jnMoney(outS):'—'}</b></div></div>
      ${dia?`<div class="jd-dia">${esc(dia.slice(0,280))}${dia.length>280?'…':''}</div>`:''}
      <div class="jn-ed-foot"><button class="jn-btn ghost" data-jddia>${dia?'Щоденник цього дня':'Написати в щоденник'}</button><button class="jn-btn" data-jdai>Розбір дня з Флоу</button></div>`, ov=>{
      ov.querySelectorAll('[data-jcd]').forEach(b=>b.onclick=()=>jnDaySheet(b.dataset.jcd, ym));
      ov.querySelectorAll('[data-jcm]').forEach(b=>b.onclick=()=>jnDaySheet(ds, b.dataset.jcm));
      ov.querySelector('[data-jddia]').onclick=()=>{ ov.remove(); try{ goDiary(ds); }catch(_){} };
      ov.querySelector('[data-jdai]').onclick=()=>{ ov.remove(); jnAskReview('day', ds); };
    });
  }

  /* ─── РОЗБОРИ З ФЛОУ: лише фіксовані питання; Флоу читає дані через get_data і нічого не змінює без згоди ─── */
  function jnAskReview(kind, ds){
    const day=ds&&/^\d{4}-\d{2}-\d{2}$/.test(ds)?ds:ymdLocal();
    const q={
      day:'Зроби розбір мого дня '+day+' у «Журналі героя»: що зроблено з місій, що ні й чому, як була енергія і гроші. Що одне взяти на завтра? Стисло. Подивись мої місії й історію днів (get_data journal), без моєї згоди нічого не змінюй.',
      week:'Зроби розбір мого тижня в «Журналі героя»: які місії рухались, а які стояли, скільки годин пішло проти бюджету, енергія, гроші. Один фокус на наступний тиждень. Подивись місії й історію днів (get_data journal), без моєї згоди нічого не змінюй.',
      month:'Зроби розбір мого місяця в «Журналі героя»: прогрес кожної місії й рівнів, години й гроші проти плану, серії, енергія, що заважало. Чи встигаю до точки Б? 3 висновки й 1 зміна на наступний місяць. Подивись місії й історію днів (get_data journal, 31 день), без моєї згоди нічого не змінюй.'
    }[kind];
    if(q) ylAskFlow(q);
  }

  function goJournal(){ try{ jnRender(); show('scr-journal'); }catch(e){ console.error('goJournal',e); } }
  { const nj=document.getElementById('navJournal'); if(nj) nj.onclick=goJournal; }
  { const dj=document.querySelector('.dsb-i[data-dnav="journal"]'); if(dj) dj.onclick=goJournal; }
  // дані підтягнулись з хмари — Журнал, якщо відкритий, перемальовується
  try{ document.addEventListener('flowsync',()=>{ const s=document.getElementById('scr-journal'); if(s&&s.classList.contains('active')) jnRender(); }); }catch(_){}
  try{ window.goJournal=goJournal; window.jnRender=jnRender; }catch(_){}
