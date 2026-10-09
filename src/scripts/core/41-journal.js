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

  function jnRender(){
    const body=jnEl('jnBody'); if(!body) return;
    const goals=(goalsData.goals||[]).filter(g=>g&&g.id);
    const act=goals.filter(g=>jnStatus(g)!=='archive');
    const main=act.filter(g=>jnRole(g)==='main'), side=act.filter(g=>jnRole(g)==='side'&&jnStatus(g)==='active');
    const wait=act.filter(g=>jnRole(g)==='wait'||(jnRole(g)==='side'&&jnStatus(g)==='pause'));
    const arch=goals.filter(g=>jnStatus(g)==='archive');
    const xp=jnHeroXP(), lvl=1+Math.floor(xp/JN_XP_LVL), xpIn=xp%JN_XP_LVL;
    const hero=jnHero(), td=ymdLocal(), en=hero.energy&&typeof hero.energy[td]==='number'?hero.energy[td]:null;
    const free=jnFreeHours(); let bal=null; try{ bal=walletBalance(); }catch(_){}
    const sub=jnEl('jnSub'); if(sub) sub.textContent=act.length?(act.length+' '+pluralUk(act.length,'місія','місії','місій')+' · рівень '+lvl):'почни з головної місії';
    const now=new Date();
    const week=jnWeek().map(ds=>{ const l=jnDayLevel(ds), d=new Date(ds+'T12:00:00');
      return `<span class="jn-d${ds===td?' today':''}${ds>td?' fut':''}"><small>${JN_DOW[d.getDay()]}</small><b>${d.getDate()}</b><i class="jl${ds>td?'x':(l<0?'x':l)}"></i></span>`; }).join('');
    const dev=!!(window.upDevOn&&window.upDevOn());
    body.innerHTML=`
      <button class="jn-hero" data-jnhero>
        <span class="jn-av">${jnAvatar()}</span>
        <span class="jn-hero-b"><span class="jn-cls">${esc(hero.cls||'обери клас')} · рів. ${lvl}</span>
          <b>${esc(jnName())}</b>
          <span class="jn-xp"><span class="jn-bar gold"><i style="width:${Math.round(xpIn/JN_XP_LVL*100)}%"></i></span>${xpIn}/${JN_XP_LVL} XP</span></span>
      </button>
      <div class="jn-res">
        <button class="jn-r t" data-jnres="time"><small>Час</small><b>${free===null?'—':String(free).replace('.',',')+' год'}</b><small>вільно сьогодні</small></button>
        <button class="jn-r c" data-jnres="money"><small>Гроші</small><b>${bal===null?'—':jnMoney(bal)}</b><small>Гаманець</small></button>
        <button class="jn-r e" data-jnres="energy"><small>Енергія</small><b>${en===null?'оцінити':en}</b><small>${en===null?'тапни':'зі 100'}</small></button>
        <button class="jn-r s" data-jnres="streak"><small>Серія</small><b>${jnStreak()}</b><small>днів поспіль</small></button>
      </div>
      <div class="jn-wk-h"><span>${JN_DOW[now.getDay()]}, ${now.getDate()} ${JN_MON[now.getMonth()]}</span><button data-jnplan>Планер ›</button></div>
      <div class="jn-wk">${week}</div>
      <div class="jn-sec"><span>Журнал місій</span><button data-jnadd>+ Місія</button></div>
      ${act.length?'':`<div class="jn-empty"><b>Ще нема місій</b>Почни з головної — того, куди йдеш. Рівні, дні й бюджет задаси в ній.<button data-jnadd>+ Перша місія</button></div>`}
      ${main.map(jnMissionCard).join('')}
      ${side.map(jnMissionCard).join('')}
      ${wait.length?`<div class="jn-sub">Чекають і на паузі · ${wait.length}</div>${wait.map(jnMissionCard).join('')}`:''}
      ${arch.length?`<button class="jn-arch" data-jnarch>${jnShowArchive?'Сховати архів':'Архів · '+arch.length}</button>${jnShowArchive?arch.map(jnMissionCard).join(''):''}`:''}
      ${dev?`<button class="jn-map" data-jnmap>Карта · «Мій світ» (розробник)</button>`:''}
      <div class="jn-pad"></div>`;
    body.querySelectorAll('[data-jnm]').forEach(b=>b.onclick=()=>{ const gl=goals.find(g=>String(g.id)===b.dataset.jnm); if(gl) jnEditor(gl); });
    body.querySelectorAll('[data-jnadd]').forEach(b=>b.onclick=()=>jnEditor(null));
    { const h=body.querySelector('[data-jnhero]'); if(h) h.onclick=jnHeroSheet; }
    { const p=body.querySelector('[data-jnplan]'); if(p) p.onclick=()=>{ try{ goPlanner(); }catch(_){} }; }
    { const a=body.querySelector('[data-jnarch]'); if(a) a.onclick=()=>{ jnShowArchive=!jnShowArchive; jnRender(); }; }
    { const m=body.querySelector('[data-jnmap]'); if(m) m.onclick=()=>{ if(window.goWorld) window.goWorld(); }; }
    body.querySelectorAll('[data-jnres]').forEach(b=>b.onclick=()=>{
      const k=b.dataset.jnres;
      if(k==='time'){ try{ goPlanner(); }catch(_){} }
      else if(k==='money'){ try{ goFinance(); }catch(_){} }
      else if(k==='energy') jnEnergySheet();
    });
  }

  function jnEnergySheet(){
    const vals=[[20,'Ледве живий'],[40,'Втомлений'],[60,'Нормально'],[80,'Бадьорий'],[100,'На максимумі']];
    actionSheet({title:'Енергія сьогодні', sub:'Від неї залежить, скільки брати на день',
      items:vals.map(([v,l])=>({ic:'', label:v+' · '+l, onClick:()=>{
        const h=jnHero(); if(!h.energy||typeof h.energy!=='object') h.energy={};
        h.energy[ymdLocal()]=v;
        const ks=Object.keys(h.energy).sort(); while(ks.length>60) delete h.energy[ks.shift()];
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

  function goJournal(){ try{ jnRender(); show('scr-journal'); }catch(e){ console.error('goJournal',e); } }
  { const nj=document.getElementById('navJournal'); if(nj) nj.onclick=goJournal; }
  { const dj=document.querySelector('.dsb-i[data-dnav="journal"]'); if(dj) dj.onclick=goJournal; }
  // дані підтягнулись з хмари — Журнал, якщо відкритий, перемальовується
  try{ document.addEventListener('flowsync',()=>{ const s=document.getElementById('scr-journal'); if(s&&s.classList.contains('active')) jnRender(); }); }catch(_){}
  try{ window.goJournal=goJournal; window.jnRender=jnRender; }catch(_){}
