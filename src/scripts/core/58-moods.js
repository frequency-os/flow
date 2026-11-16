  /* ════════ «Мої настрої» (58-moods.js, 16.11.2026) — кілька ритуалів замість одного ранку ════════
     Задум погоджено 16.11.2026, вигляд — другий варіант: на Карті бажань велика картка
     «Зараз» (настрій, якому зараз час) + стрічка «Мій день» + полиця щоденників корінцями;
     «Продовжити» відкриває покроковий режим на весь екран.
     • Ранок — це той самий ранковий ритуал (06-wishes.js): його дні й кроки лишаються
       в ritual_board / ritual_steps, тут лише його назва, значок і колір (MOODS.m).
     • Інші настрої — у новому ключі moods_v1: {list:[настрій], days:{id:{'YYYY-MM-DD':{…}}}, m:{…}}.
       Пишемо його лише після дії людини; читаємо при старті разом з усім (27-canvas.js load).
     • Кроки, картки й «День зараховано» — спільні з ранком: 06-wishes.js малює їх для того
       настрою, що стоїть у ritCtx (ritWithCtx). */
  const MOODS_KEY='moods_v1';
  let MOODS={list:[], days:{}, m:{}};
  try{ if(Array.isArray(window.FLOW_KEYS)&&window.FLOW_KEYS.indexOf(MOODS_KEY)<0) window.FLOW_KEYS.push(MOODS_KEY); }catch(_){}
  const mdLang=()=>{ try{ return (window.flowLang&&window.flowLang())==='en'?'en':'uk'; }catch(_){ return 'uk'; } };
  const MD_T={
    uk:{sec:'Мої настрої', now:'Зараз', day:'Мій день', add:'＋ настрій', start:'Почати', cont:'Продовжити', again:'✓ Зараховано · відкрити',
      of:' з ', steps:' кроків', streak:'стрік ', close:'Закрити', more:'Ще',
      morning:'Ранок', slot:{morning:'ранок', day:'день', evening:'вечір', any:'будь-коли'},
      slotH:{morning:'Ранок', day:'День', evening:'Вечір', any:'Будь-коли'},
      step:'Крок ', fin:'Готово на сьогодні', finSub:'Кроків зроблено: ', next:'Далі', back:'Назад', finish:'Завершити', write:'Напиши тут…',
      mSteps:'Кроки', mStepsSub:'порядок, шаблони, свої питання', mList:'Список і календар', mListSub:'усі кроки одразу',
      mEdit:'Назва, значок, час', mBook:'Відповіді у щоденник', mDel:'Видалити настрій',
      delQ:'Видалити настрій «', delSub:'Разом з його календарем. Це незворотно.', delOk:'Видалити',
      newT:'Новий настрій', editT:'Настрій', name:'Назва', namePh:'Вечір, Перед тренуванням…', icon:'Значок', color:'Колір',
      when:'Коли показувати першим', tpl:'Почати з шаблону', book:'Записувати відповіді в окремий щоденник', create:'Створити', save:'Зберегти', cancel:'Скасувати',
      needName:'Дай настрою назву', bookPick:'Куди записувати відповіді?', bookNone:'Нікуди', bookNoneSub:'відповіді лишаються лише в настрої',
      bookNew:'＋ Новий щоденник', bookOn:'📔 Відповіді йдуть у «', shelf:'Щоденники', dayDiary:'Щоденник дня', shelfHint:'＋ — свій щоденник: вдячність, ідеї, сни…',
      newBook:'Новий щоденник', bookNamePh:'Вдячність, Ідеї, Сни…', needBook:'Дай щоденнику назву',
      tplEve:'Підсумок дня', tplBefore:'Перед важливим', tplSport:'Спорт', tplCalm:'Тиха голова', tplEmpty:'Порожньо',
      qWin:'Що сьогодні вдалось?', qOther:'Що завтра зробити інакше?', qResult:'Який результат мені потрібен?', qBody:'Як почувається тіло?',
      dEve:'Вечір', dBefore:'Перед важливим'},
    en:{sec:'My tunings', now:'Now', day:'My day', add:'＋ tuning', start:'Start', cont:'Continue', again:'✓ Counted · open',
      of:' of ', steps:' steps', streak:'streak ', close:'Close', more:'More',
      morning:'Morning', slot:{morning:'morning', day:'day', evening:'evening', any:'anytime'},
      slotH:{morning:'Morning', day:'Day', evening:'Evening', any:'Anytime'},
      step:'Step ', fin:'Done for today', finSub:'Steps done: ', next:'Next', back:'Back', finish:'Finish', write:'Write here…',
      mSteps:'Steps', mStepsSub:'order, templates, your own questions', mList:'List and calendar', mListSub:'all steps at once',
      mEdit:'Name, icon, time', mBook:'Answers to a journal', mDel:'Delete tuning',
      delQ:'Delete tuning «', delSub:'Together with its calendar. This cannot be undone.', delOk:'Delete',
      newT:'New tuning', editT:'Tuning', name:'Name', namePh:'Evening, Before training…', icon:'Icon', color:'Color',
      when:'When to show it first', tpl:'Start from a template', book:'Save answers to a separate journal', create:'Create', save:'Save', cancel:'Cancel',
      needName:'Give the tuning a name', bookPick:'Where should answers go?', bookNone:'Nowhere', bookNoneSub:'answers stay in the tuning only',
      bookNew:'＋ New journal', bookOn:'📔 Answers go to «', shelf:'Journals', dayDiary:'Daily journal', shelfHint:'＋ — your own journal: gratitude, ideas, dreams…',
      newBook:'New journal', bookNamePh:'Gratitude, Ideas, Dreams…', needBook:'Give the journal a name',
      tplEve:'Day review', tplBefore:'Before something big', tplSport:'Sport', tplCalm:'Quiet mind', tplEmpty:'Empty',
      qWin:'What went well today?', qOther:'What to do differently tomorrow?', qResult:'What result do I need?', qBody:'How does my body feel?',
      dEve:'Evening', dBefore:'Before something big'}
  };
  const mdT=()=>MD_T[mdLang()];
  const MD_ICONS=['🌅','🌙','☀️','🏋️','🧘','💼','📚','🎯','💛','🌿','🔥','✨'];
  const MD_COLORS=['#e8a33c','#8b6cf0','#34c77b','#5b8def','#e0607e','#3cb8c4'];
  const MD_SLOTS=['morning','day','evening','any'];
  let mdSel='';            // настрій, який людина сама тапнула (до кінця сесії); '' — вибір за часом
  let mdF=null;            // відкритий покроковий режим: {id, i}
  let mdListId='';         // відкрита шторка «Список і календар»

  /* ── дані ── */
  function mdClean(o){
    const out={list:[], days:{}, m:{}};
    if(!o||typeof o!=='object') return out;
    if(Array.isArray(o.list)) o.list.forEach(x=>{
      if(!x||typeof x!=='object'||typeof x.id!=='string'||!/^md_[a-z0-9]{2,20}$/.test(x.id)) return;
      out.list.push({id:x.id, name:String(x.name||'').slice(0,40)||'…', ic:String(x.ic||'✨').slice(0,4),
        color:typeof x.color==='string'?x.color:MD_COLORS[1], at:MD_SLOTS.indexOf(x.at)>=0?x.at:'any',
        book:typeof x.book==='string'?x.book:'', steps:Array.isArray(x.steps)?x.steps:[]});
    });
    // лише ключі настроїв: «__proto__» з чужих даних не підмінить прототип
    if(o.days&&typeof o.days==='object') Object.keys(o.days).forEach(k=>{ if(/^md_[a-z0-9]{2,20}$/.test(k)&&o.days[k]&&typeof o.days[k]==='object') out.days[k]=o.days[k]; });
    if(o.m&&typeof o.m==='object') out.m=o.m;
    return out;
  }
  async function loadMoods(){
    try{ const r=await window.storage.get(MOODS_KEY,false);
      if(r&&r.value){ MOODS=mdClean(JSON.parse(r.value)); } }catch(_){}
    try{ ritualRerender(); }catch(_){}
  }
  window.loadMoods=loadMoods;
  function saveMoods(){ try{ const p=window.storage.set(MOODS_KEY,JSON.stringify(MOODS),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function moodGet(id){ return MOODS.list.find(x=>x.id===id)||null; }
  function moodDaysOf(id){ if(!moodGet(id)) return null; if(!MOODS.days[id]||typeof MOODS.days[id]!=='object') MOODS.days[id]={}; return MOODS.days[id]; }
  function moodStepsOf(id){ const m=moodGet(id); return m?m.steps:[]; }
  function moodSetSteps(id,steps){ const m=moodGet(id); if(m){ m.steps=steps; saveMoods(); } }
  function moodName(id){ if(id==='m') return MOODS.m.name||mdT().morning; const m=moodGet(id); return m?m.name:''; }
  // усі настрої одним списком; Ранок — завжди перший
  function moodAll(){
    const m=MOODS.m||{};
    return [{id:'m', name:moodName('m'), ic:m.ic||'🌅', color:m.color||MD_COLORS[0], at:MD_SLOTS.indexOf(m.at)>=0?m.at:'morning', book:m.book||''}]
      .concat(MOODS.list);
  }
  function mdNewStepId(){ return 'c_'+(Date.now().toString(36)+Math.random().toString(36).slice(2,6)).slice(-12); }
  function moodTemplates(){
    const t=mdT(), own=(ty,q)=>({id:mdNewStepId(), ty, t:q});
    return [
      {k:'eve',    t:t.tplEve,    s:['grat', own('text',t.qWin), own('text',t.qOther), 'breath']},
      {k:'before', t:t.tplBefore, s:['breath', own('text',t.qResult), 'vis']},
      {k:'sport',  t:t.tplSport,  s:['water','move', own('text',t.qBody)]},
      {k:'calm',   t:t.tplCalm,   s:['breath','grat','med']}
    ];
  }
  function mdSlotNow(){ const h=new Date().getHours(); return (h>=4&&h<12)?'morning':(h<17&&h>=12?'day':'evening'); }
  // стан настрою на сьогодні — без створення порожнього дня
  function moodStat(id){
    return ritWithCtx(id,()=>{
      const steps=ritSteps(), d=ritDaysObj()[ritDs(0)]||{};
      return {of:steps.length, n:steps.filter(s=>ritStepDone(s,d)).length, done:!!d.done, streak:ritStreak().s};
    });
  }
  function moodCurrent(){
    const all=moodAll();
    if(mdSel&&all.some(x=>x.id===mdSel)) return mdSel;
    const slot=mdSlotNow(), open=x=>!moodStat(x.id).done;
    const pick=all.find(x=>x.at===slot&&open(x))||all.find(x=>x.at==='any'&&open(x))||all.find(x=>x.at===slot);
    return pick?pick.id:'m';
  }

  /* ── блок на Карті бажань ── */
  function moodsBlockHTML(){
    const t=mdT(), all=moodAll(), cur=moodCurrent(), c=all.find(x=>x.id===cur)||all[0], st=moodStat(c.id);
    const now=new Date(), hm=now.getHours()+':'+String(now.getMinutes()).padStart(2,'0');
    const C=113.1, pct=st.of?st.n/st.of:0;
    const goLbl=st.done?t.again:(st.n?t.cont:t.start);
    const rows=all.map(x=>{ const s=moodStat(x.id);
      return `<button type="button" class="md-row ${x.id===c.id?'on':''}" data-mdpick="${esc(x.id)}" style="--mc:${safeColor(x.color,'#8b6cf0')}">
        <i class="md-dot"></i><span class="md-rn">${esc(x.ic)} ${esc(x.name)}</span>
        <small>${esc(t.slot[x.at]||'')} · ${s.done?'✓ ':''}${s.n}/${s.of}</small></button>`; }).join('');
    return `<div class="rit-sec md-sec" style="margin-top:18px"><span>${esc(t.sec)}</span></div>
      <div id="ritInline" class="md-wrap">
        <div class="md-hero" style="--mc:${safeColor(c.color,'#8b6cf0')}">
          <div class="md-hero-top">
            <div class="md-hero-tx"><small>${esc(t.now)} · ${hm}</small><b>${esc(c.ic)} ${esc(c.name)}</b>
              <small>${st.n}${t.of}${st.of}${t.steps}${st.streak?' · 🔥 '+t.streak+st.streak:''}</small></div>
            <svg class="md-ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18"/><circle cx="22" cy="22" r="18" class="pv"
              stroke-dasharray="${C}" stroke-dashoffset="${(C*(1-pct)).toFixed(1)}" transform="rotate(-90 22 22)"/></svg>
          </div>
          <div class="md-hero-act">
            <button type="button" class="md-go" data-mdgo="${esc(c.id)}">${esc(goLbl)}</button>
            <button type="button" class="md-more" data-mdmore="${esc(c.id)}" aria-label="${esc(t.more)}">⋯</button>
          </div>
        </div>
        <div class="md-day-h"><span>${esc(t.day)}</span><button type="button" class="md-add" data-mdnew="1">${esc(t.add)}</button></div>
        <div class="md-day">${rows}</div>
        ${(typeof mdShelfHTML==='function')?mdShelfHTML():''}
      </div>`;
  }
  function moodsBlockBind(body){
    const root=(body||document).querySelector('#ritInline'); if(!root) return;
    root.querySelectorAll('[data-mdgo]').forEach(b=>b.onclick=()=>moodFocus(b.dataset.mdgo));
    root.querySelectorAll('[data-mdmore]').forEach(b=>b.onclick=()=>moodMenu(b.dataset.mdmore));
    // тап по рядку стрічки — цей настрій стає «Зараз» і одразу відкривається
    root.querySelectorAll('[data-mdpick]').forEach(b=>b.onclick=()=>{ mdSel=b.dataset.mdpick; mdRerender(); moodFocus(mdSel); });
    const nb=root.querySelector('[data-mdnew]'); if(nb) nb.onclick=()=>moodSheet('');
    if(typeof mdShelfBind==='function') mdShelfBind(root);
  }
  function mdRerender(){ try{ const s=document.getElementById('scr-wishes'); if(s&&s.classList.contains('active')) renderWishes(); }catch(_){} }

  /* ── покроковий режим на весь екран ── */
  let mdTaTimer=null;
  function moodFocus(id,at){
    if(!moodAll().some(x=>x.id===id)) return;
    const old=document.getElementById('mdFocus'); if(old) old.remove();
    const steps=ritWithCtx(id,ritSteps);
    let i=typeof at==='number'?at:-1;
    if(i<0){ // перший незроблений крок; усе зроблено — фініш
      i=ritWithCtx(id,()=>{ const d=ritDaysObj()[ritDs(0)]||{}; const k=steps.findIndex(s=>!ritStepDone(s,d)); return k<0?steps.length:k; });
    }
    mdF={id, i:Math.max(0,Math.min(i,steps.length))};
    const ov=document.createElement('div'); ov.className='md-focus'; ov.id='mdFocus';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    document.body.appendChild(ov);
    mdFocusRender();
  }
  function mdTaFlush(){
    const ta=document.querySelector('#mdFocus .md-ta'); if(!ta||!mdF) return;
    clearTimeout(mdTaTimer); mdTaTimer=null;
    const sid=ta.dataset.sid, v=ta.value.trim().slice(0,2000), id=mdF.id;
    ritWithCtx(id,()=>{ const d=ritDay(ritDs(0)); if((d[sid]||'')===v) return; if(v) d[sid]=v; else delete d[sid]; ritSaveToday(); });
  }
  function mdFocusClose(){
    mdTaFlush();
    try{ if(mdF) moodToDiary(mdF.id); }catch(_){}
    try{ ritStopAll(); }catch(_){}
    const ov=document.getElementById('mdFocus'); if(ov) ov.remove();
    mdF=null; ritCtx='m'; mdRerender();
  }
  function mdFocusRender(){
    const ov=document.getElementById('mdFocus'); if(!ov||!mdF) return;
    const t=mdT(), id=mdF.id, mood=moodAll().find(x=>x.id===id); if(!mood){ mdFocusClose(); return; }
    ritWithCtx(id,()=>{
      const steps=ritSteps(), d=ritDay(ritDs(0)), i=Math.min(mdF.i,steps.length); mdF.i=i;
      const segs=steps.map((s,k)=>`<button type="button" class="md-seg ${ritStepDone(s,d)?'on':''} ${k===i?'cur':''}" data-mdseg="${k}" aria-label="${esc(t.step+(k+1))}"></button>`).join('')
        +`<button type="button" class="md-seg fin ${d.done?'on':''} ${i===steps.length?'cur':''}" data-mdseg="${steps.length}" aria-label="${esc(t.fin)}"></button>`;
      let mid='';
      if(i<steps.length){
        const s=steps[i], m=ritMeta(s);
        if(m.ty==='text'){
          const ak=ritAudioKey(s), au=ak?d[ak]:null;
          mid=`<div class="md-q">${esc(m.t)}</div>
            <textarea class="md-ta" data-sid="${esc(s.id)}" rows="6" maxlength="2000" placeholder="${esc(m.ph||t.write)}">${esc(d[s.id]||'')}</textarea>
            ${ak?`<div class="md-mic-row"><span class="mic ${au?'has':''}" data-rmic="${esc(ak)}" role="button" tabindex="0" aria-label="🎙">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/></svg></span>
              ${au?`<span class="adur">${fmtDur(au.dur||0)}</span>`:''}<b class="rit-rectm"></b></div>`:''}`;
        } else {
          mid=`<div class="md-q sm">${esc(m.ic||'')} ${esc(m.t)}</div><div class="rit-wrap md-card">${ritStepHTML(s,d)}</div>`;
        }
      } else {
        const n=steps.filter(s=>ritStepDone(s,d)).length;
        mid=`<div class="md-q">${esc(t.fin)}</div><div class="md-fin-sub">${esc(t.finSub)}${n}${t.of}${steps.length}</div>
          <div class="rit-wrap md-card"><button class="rit-done ${d.done?'ok':''}" data-rdone="1">${d.done?'✓ День зараховано':'🔥 День зараховано'}</button></div>`;
      }
      const last=i>=steps.length;
      ov.style.setProperty('--mc', safeColor(mood.color,'#8b6cf0'));
      ov.innerHTML=`<div class="md-f-in">
        <div class="md-f-top"><span>${esc(mood.ic)} ${esc(mood.name)}</span><button type="button" class="md-x" aria-label="${esc(t.close)}">✕</button></div>
        <div class="md-segs">${segs}</div>
        <div class="md-f-step">${last?'':esc(t.step+(i+1)+t.of+steps.length)}</div>
        <div class="md-f-mid">${mid}</div>
        <div class="md-f-bot">
          ${i>0?`<button type="button" class="md-back" aria-label="${esc(t.back)}">‹</button>`:''}
          <button type="button" class="md-next">${esc(last?t.close:(i===steps.length-1?t.finish:t.next))}</button>
        </div></div>`;
      // картки кроків (галочка, таймер, мікс, фото, відео, «День зараховано») — тим самим кодом, що й у ранку
      ritualBind(ov.querySelector('.md-f-mid'));
    });
    ov.querySelector('.md-x').onclick=mdFocusClose;
    const ta=ov.querySelector('.md-ta');
    if(ta){ ta.oninput=()=>{ clearTimeout(mdTaTimer); mdTaTimer=setTimeout(mdTaFlush,600); }; ta.onblur=mdTaFlush; }
    const go=k=>{ mdTaFlush(); if(mdF){ mdF.i=k; mdFocusRender(); } };
    ov.querySelectorAll('[data-mdseg]').forEach(b=>b.onclick=()=>go(+b.dataset.mdseg));
    const bk=ov.querySelector('.md-back'); if(bk) bk.onclick=()=>go(mdF.i-1);
    ov.querySelector('.md-next').onclick=()=>{
      const n=ritWithCtx(mdF.id,ritSteps).length;
      if(mdF.i>=n){ mdFocusClose(); return; }
      mdTaFlush(); try{ moodToDiary(mdF.id); }catch(_){}
      go(mdF.i+1);
    };
  }
  // застосунок згортають посеред набору — зберегти останні символи, не чекаючи таймера
  try{ window.addEventListener('pagehide',mdTaFlush);
    document.addEventListener('visibilitychange',()=>{ if(document.hidden) mdTaFlush(); }); }catch(_){}
  // 06-wishes.js кличе після будь-якої зміни ранку (галочка, таймер, запис голосу)
  function moodFocusRerender(){
    if(mdF && document.getElementById('mdFocus') && !document.activeElement?.classList?.contains('md-ta')) mdFocusRender();
    const lb=document.getElementById('mdListBody');
    if(lb&&mdListId) ritWithCtx(mdListId,()=>{ lb.innerHTML=ritualInnerHTML(); ritualBind(lb); });
  }

  /* ── «Список і календар»: увесь набір одразу, як колись ранок на Карті ── */
  function moodListSheet(id){
    const old=document.getElementById('mdList'); if(old) old.remove();
    const mood=moodAll().find(x=>x.id===id); if(!mood) return;
    mdListId=id;
    const ov=document.createElement('div'); ov.className='asheet rit-sheet'; ov.id='mdList';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.innerHTML=`<div class="asheet-in"><div class="asheet-grip"></div>
      <div class="rsh-h"><span><b>${esc(mood.ic)} ${esc(mood.name)}</b></span><button type="button" class="rsh-x" aria-label="${esc(mdT().close)}">✕</button></div>
      <div class="rit-wrap rsh-body" id="mdListBody"></div></div>`;
    document.body.appendChild(ov);
    const close=()=>{ try{ ritStopAll(); }catch(_){} ov.remove(); mdListId=''; ritCtx='m'; mdRerender(); };
    ov.querySelector('.rsh-x').onclick=close;
    ov.onclick=e=>{ if(e.target===ov) close(); };
    moodFocusRerender();
  }

  /* ── меню настрою ── */
  function moodMenu(id){
    const t=mdT(), mood=moodAll().find(x=>x.id===id); if(!mood) return;
    const bk=(typeof diaBookName==='function'&&mood.book)?diaBookName(mood.book):'';
    const items=[
      {ic:'✓', label:t.mSteps, sub:t.mStepsSub, onClick:()=>ritWithCtx(id,ritEditor)},
      {ic:'☰', label:t.mList, sub:t.mListSub, onClick:()=>moodListSheet(id)},
      {ic:'edit', label:t.mEdit, onClick:()=>moodSheet(id)},
      {ic:'📔', label:t.mBook, sub:bk||t.bookNone, onClick:()=>moodBookPick(id)}
    ];
    if(id!=='m') items.push({ic:'trash', label:t.mDel, danger:true, onClick:()=>confirmSheet({
      title:t.delQ+mood.name+'»?', sub:t.delSub, okLabel:t.delOk, onOk:()=>{
        MOODS.list=MOODS.list.filter(x=>x.id!==id); delete MOODS.days[id];
        if(mdSel===id) mdSel=''; saveMoods(); mdRerender(); }})});
    actionSheet({title:mood.ic+' '+mood.name, items});
  }
  function moodSetBook(id,bookId){
    if(id==='m'){ MOODS.m=Object.assign({},MOODS.m,{book:bookId}); }
    else { const m=moodGet(id); if(!m) return; m.book=bookId; }
    saveMoods();
    if(bookId){ try{ plToast(mdT().bookOn+((typeof diaBookName==='function'&&diaBookName(bookId))||'')+'»'); }catch(_){} }
  }
  function moodBookPick(id){
    const t=mdT(), mood=moodAll().find(x=>x.id===id); if(!mood) return;
    const books=(typeof diaShelf==='function')?diaShelf().filter(b=>b.id):[];
    const items=[{ic:'✕', label:t.bookNone, sub:t.bookNoneSub, onClick:()=>moodSetBook(id,'')}]
      .concat(books.map(b=>({ic:esc(b.emoji), label:b.name, sub:b.id===mood.book?'✓':'', onClick:()=>moodSetBook(id,b.id)})));
    items.push({ic:'＋', label:t.bookNew.replace('＋ ',''), sub:mood.name, onClick:()=>{
      if(typeof diaCreateBook!=='function') return;
      const bid=diaCreateBook(mood.name, mood.ic, mood.color); if(bid) moodSetBook(id,bid); mdRerender(); }});
    actionSheet({title:t.bookPick, items});
  }
  /* Відповіді настрою за сьогодні — одним записом у його щоденник. Запис один на день:
     id запису лежить у дні (_de), повторні «Далі» його оновлюють, а не плодять копії. */
  function moodToDiary(id){
    const mood=moodAll().find(x=>x.id===id); if(!mood||!mood.book||typeof diaUpsertEntry!=='function') return;
    ritWithCtx(id,()=>{
      const d=ritDaysObj()[ritDs(0)]; if(!d) return;
      const parts=ritSteps().map(s=>({s, m:ritMeta(s)})).filter(x=>x.m.ty==='text'&&d[x.s.id]&&String(d[x.s.id]).trim())
        .map(x=>x.m.t+'\n'+String(d[x.s.id]).trim());
      if(!parts.length) return;
      const eid=diaUpsertEntry(mood.book, d._de||'', mood.ic+' '+mood.name+'\n\n'+parts.join('\n\n'));
      if(eid&&eid!==d._de){ d._de=eid; ritSaveToday(); }
    });
  }

  /* ── шторка «Новий настрій» / «Настрій» ── */
  function moodSheet(id){
    const t=mdT(), isNew=!id, cur=isNew?null:moodAll().find(x=>x.id===id);
    if(!isNew&&!cur) return;
    const st={name:cur?cur.name:'', ic:cur?cur.ic:MD_ICONS[1], color:cur?cur.color:MD_COLORS[1],
      at:cur?cur.at:'evening', tpl:'eve', book:false};
    const tpls=moodTemplates();
    const ov=document.createElement('div'); ov.className='asheet md-sheet';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.innerHTML='<div class="asheet-in"></div>';
    document.body.appendChild(ov);
    const box=ov.firstChild, close=()=>ov.remove();
    const chip=(on,attr,val,label,style)=>`<button type="button" class="md-chip ${on?'on':''}" ${attr}="${esc(val)}"${style?` style="${style}"`:''}>${label}</button>`;
    const draw=()=>{
      box.innerHTML=`<div class="asheet-grip"></div>
        <div class="asheet-title">${esc(isNew?t.newT:t.editT)}</div>
        <label class="md-lbl" for="mdName">${esc(t.name)}</label>
        <input class="md-in" id="mdName" maxlength="40" placeholder="${esc(t.namePh)}" value="${esc(st.name)}">
        <div class="md-lbl">${esc(t.icon)}</div>
        <div class="md-chips">${MD_ICONS.map(e=>chip(e===st.ic,'data-mdic',e,esc(e))).join('')}</div>
        <div class="md-lbl">${esc(t.color)}</div>
        <div class="md-chips">${MD_COLORS.map(c=>chip(c===st.color,'data-mdcol',c,'','--cc:'+c).replace('md-chip','md-chip dot')).join('')}</div>
        <div class="md-lbl">${esc(t.when)}</div>
        <div class="md-chips">${MD_SLOTS.map(k=>chip(k===st.at,'data-mdat',k,esc(t.slotH[k]))).join('')}</div>
        ${isNew?`<div class="md-lbl">${esc(t.tpl)}</div>
        <div class="md-chips">${tpls.map(x=>chip(x.k===st.tpl,'data-mdtpl',x.k,esc(x.t))).join('')}${chip(st.tpl==='empty','data-mdtpl','empty',esc(t.tplEmpty))}</div>
        <label class="md-check"><input type="checkbox" id="mdBook" ${st.book?'checked':''}> <span>${esc(t.book)}</span></label>`:''}
        <button type="button" class="red-ok" data-mdok="1">${esc(isNew?t.create:t.save)}</button>
        <button type="button" class="asheet-cancel">${esc(t.cancel)}</button>`;
      const nm=box.querySelector('#mdName'); nm.oninput=()=>{ st.name=nm.value; };
      const keep=fn=>()=>{ st.name=nm.value; fn(); draw(); };
      box.querySelectorAll('[data-mdic]').forEach(b=>b.onclick=keep(()=>{ st.ic=b.dataset.mdic; }));
      box.querySelectorAll('[data-mdcol]').forEach(b=>b.onclick=keep(()=>{ st.color=b.dataset.mdcol; }));
      box.querySelectorAll('[data-mdat]').forEach(b=>b.onclick=keep(()=>{ st.at=b.dataset.mdat; }));
      box.querySelectorAll('[data-mdtpl]').forEach(b=>b.onclick=keep(()=>{ st.tpl=b.dataset.mdtpl; }));
      const bk=box.querySelector('#mdBook'); if(bk) bk.onchange=()=>{ st.book=bk.checked; };
      box.querySelector('.asheet-cancel').onclick=close;
      box.querySelector('[data-mdok]').onclick=()=>{
        const name=String(nm.value||'').trim().slice(0,40);
        if(!name){ try{ plToast(t.needName); }catch(_){} nm.focus(); return; }
        if(id==='m'){ MOODS.m=Object.assign({},MOODS.m,{name, ic:st.ic, color:st.color, at:st.at}); saveMoods(); close(); mdRerender(); return; }
        if(!isNew){ const m=moodGet(id); if(m){ Object.assign(m,{name, ic:st.ic, color:st.color, at:st.at}); saveMoods(); } close(); mdRerender(); return; }
        const tp=tpls.find(x=>x.k===st.tpl);
        const steps=tp?tp.s.map(x=>typeof x==='string'?{id:x}:x).map(ritCleanStep).filter(Boolean):[];
        const nid='md_'+Date.now().toString(36);
        const mood={id:nid, name, ic:st.ic, color:st.color, at:st.at, book:'', steps};
        if(st.book&&typeof diaCreateBook==='function') mood.book=diaCreateBook(name, st.ic, st.color)||'';
        MOODS.list.push(mood); MOODS.days[nid]={}; saveMoods();
        close(); mdSel=nid; mdRerender();
        if(!steps.length) ritWithCtx(nid,ritEditor);   // «Порожньо» — одразу до кроків
      };
    };
    draw();
    ov.onclick=e=>{ if(e.target===ov) close(); };
  }

  /* ── полиця «Щоденники» корінцями (дані — 22-diary.js) ── */
  function mdShelfHTML(){
    if(typeof diaShelf!=='function') return '';
    const t=mdT(), books=diaShelf(), max=Math.max(1,...books.map(b=>b.n));
    const sp=books.map(b=>{ const h=Math.round(138+22*Math.min(1,b.n/max));
      return `<button type="button" class="md-spine" data-mdbook="${esc(b.id||'@day')}" style="--bc:${safeColor(b.color,'#5b6fd6')};height:${h}px" aria-label="${esc(b.name)}">
        <span class="md-sp-ic">${esc(b.emoji)}</span><span class="md-sp-t">${esc(b.name)}</span></button>`; }).join('');
    const hint=books.length<2?`<div class="md-shelf-hint">${esc(t.shelfHint)}</div>`:'';
    return `<div class="md-day-h md-shelf-h"><span>${esc(t.shelf)}</span></div>
      <div class="md-shelf">${sp}<button type="button" class="md-spine new" data-mdbooknew="1" aria-label="${esc(t.newBook)}"><span class="md-sp-ic">＋</span></button>${hint}</div>`;
  }
  function mdShelfBind(root){
    root.querySelectorAll('[data-mdbook]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.mdbook;
      if(id==='@day'){ try{ goDiary(); }catch(_){} return; }
      if(typeof goDiaryBook==='function') goDiaryBook(id);
    });
    root.querySelectorAll('[data-mdbooknew]').forEach(b=>b.onclick=()=>mdBookNew());
  }
  function mdBookNew(){
    const t=mdT(), em=(typeof DIA_BOOK_EMOJIS!=='undefined')?DIA_BOOK_EMOJIS:['📖'], co=(typeof DIA_BOOK_COLORS!=='undefined')?DIA_BOOK_COLORS:['#5b8def'];
    const st={name:'', ic:em[0], color:co[0]};
    const ov=document.createElement('div'); ov.className='asheet md-sheet';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.innerHTML='<div class="asheet-in"></div>';
    document.body.appendChild(ov);
    const box=ov.firstChild, close=()=>ov.remove();
    const draw=()=>{
      box.innerHTML=`<div class="asheet-grip"></div>
        <div class="asheet-title">${esc(t.newBook)}</div>
        <label class="md-lbl" for="mdBkName">${esc(t.name)}</label>
        <input class="md-in" id="mdBkName" maxlength="24" placeholder="${esc(t.bookNamePh)}" value="${esc(st.name)}">
        <div class="md-lbl">${esc(t.icon)}</div>
        <div class="md-chips">${em.map(e=>`<button type="button" class="md-chip ${e===st.ic?'on':''}" data-bkic="${esc(e)}">${esc(e)}</button>`).join('')}</div>
        <div class="md-lbl">${esc(t.color)}</div>
        <div class="md-chips">${co.map(c=>`<button type="button" class="md-chip dot ${c===st.color?'on':''}" data-bkcol="${esc(c)}" style="--cc:${safeColor(c,'#5b8def')}"></button>`).join('')}</div>
        <button type="button" class="red-ok" data-bkok="1">${esc(t.create)}</button>
        <button type="button" class="asheet-cancel">${esc(t.cancel)}</button>`;
      const nm=box.querySelector('#mdBkName'); nm.oninput=()=>{ st.name=nm.value; };
      box.querySelectorAll('[data-bkic]').forEach(b=>b.onclick=()=>{ st.name=nm.value; st.ic=b.dataset.bkic; draw(); });
      box.querySelectorAll('[data-bkcol]').forEach(b=>b.onclick=()=>{ st.name=nm.value; st.color=b.dataset.bkcol; draw(); });
      box.querySelector('.asheet-cancel').onclick=close;
      box.querySelector('[data-bkok]').onclick=()=>{
        const name=String(nm.value||'').trim();
        if(!name){ try{ plToast(t.needBook); }catch(_){} nm.focus(); return; }
        const id=(typeof diaCreateBook==='function')?diaCreateBook(name, st.ic, st.color):'';
        close(); mdRerender();
        if(id&&typeof goDiaryBook==='function') goDiaryBook(id);
      };
    };
    draw();
    ov.onclick=e=>{ if(e.target===ov) close(); };
  }
