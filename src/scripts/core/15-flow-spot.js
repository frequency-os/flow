  /* ════════ ФЛОУ-СПОТ: міні-простір поверх поточного екрана ════════ */
  let spotMsgs=[], spotBusy=false, spotRec=null;
  function spotCtx(){
    const scr=(document.querySelector('.screen.active')||{}).id||'scr-home';
    const br=window.__flowPageBridge;
    if(scr==='scr-page'||scr==='scr-space'){
      let nm=''; try{ nm=br&&br.folderName()||''; }catch(_){}
      return {key:'page',label:'📁 '+(nm||'Простір'),canWrite:!!br};
    }
    if(/^scr-(finance|values|debts|spend|work)$/.test(scr)) return {key:'fin',label:'💰 Гроші'};
    if(scr==='scr-planner') return {key:'plan',label:'📅 Планер'};
    if(scr==='scr-vision') return {key:'vision',label:'🧭 Візія'};
    if(scr==='scr-goals') return {key:'goals',label:'🎯 Цілі'};
    if(scr==='scr-projects'||scr==='scr-agency'||scr==='scr-client') return {key:'projects',label:'🚀 Проєкти'};
    return {key:'home',label:'🏠 Огляд'};
  }
  function spotChips(key){
    if(key==='page') return ['Додай план на тиждень','Зроби таблицю витрат','Додай чекліст на завтра'];
    if(key==='fin') return ['Куди пішли гроші?','Скільки можу відкласти?','Постав блок на бюджет'];
    if(key==='plan') return ['Заповни мій день','Встав перерву 30 хв','Що встигну сьогодні?'];
    if(key==='vision') return ['Що просідає у моїй візії?','Додай у планер блок до Точки Б','Оціни мій фокус кварталу'];
    if(key==='goals') return ['Розбий ціль на кроки','Що головне цього тижня?'];
    if(key==='projects') return ['Який проєкт зараз просідає?','Наступний крок по агенції','Розбий проєкт на кроки'];
    return ['Що зараз головне?','План на сьогодні','Додай блок у планер'];
  }
  function spotAddon(ctx){
    let a='МІНІ-РЕЖИМ: ти працюєш у маленькому вікні поверх екрана «'+ctx.label+'». Відповідай КОРОТКО: 1-3 речення. Максимум ОДИН JSON-маркер на відповідь, завжди в самому кінці.';
    if(ctx.canWrite){
      a+='\n\nЯкщо користувач просить додати контент у поточну папку/сторінку (текст, список, план, таблицю, чекліст) — після короткої фрази додай маркер FLOW_PAGE: з JSON:'
      +'\nFLOW_PAGE:{"page":[{"type":"h2","text":"Заголовок"},{"type":"note","text":"абзац"},{"type":"bullet","text":"пункт"},{"type":"num","text":"крок"},{"type":"task","text":"завдання"},{"type":"quote","text":"цитата"},{"type":"callout","text":"порада","emo":"💡"},{"type":"divider"},{"type":"table","cols":["Колонка1","Колонка2"],"rows":[["a","b"]]}]}'
      +'\nДозволені type лише з прикладу. Не описуй JSON словами і не обгортай у ```.';
    } else {
      a+='\nЗапис у сторінки тут недоступний — для планера використовуй стандартний FLOW_BLOCKS.';
    }
    a+='\nЗмінювати самі фінансові записи ти поки не вмієш — якщо просять, чесно скажи і запропонуй блок у планер чи нотатку.';
    return a;
  }
  function aiParsePage(txt){
    const i=String(txt||'').indexOf('FLOW_PAGE:');
    if(i<0) return {text:txt||'',list:[]};
    let list=[];
    try{ const j=JSON.parse(String(txt).slice(i+10).trim()); if(j&&Array.isArray(j.page)) list=j.page; }catch(e){ console.error('FLOW_PAGE parse',e); }
    return {text:String(txt).slice(0,i).trim(),list};
  }
  function applyPageBlocks(list){
    const br=window.__flowPageBridge; if(!br||!list.length) return {n:0,ids:[]};
    let arr; try{ arr=br.getBlocks(); }catch(_){ return {n:0,ids:[]}; }
    const ids=[]; const T={h1:1,h2:1,h3:1,note:1,bullet:1,num:1,task:1,quote:1,callout:1,divider:1,table:1};
    list.forEach(it=>{
      if(!it||!T[it.type]) return;
      const b={id:'aib'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),type:it.type};
      if(it.type==='table'){ b.cols=Array.isArray(it.cols)&&it.cols.length?it.cols.map(String):['Назва','Значення'];
        b.rows=Array.isArray(it.rows)?it.rows.map(r=>Array.isArray(r)?r.map(String):[String(r)]):[]; b.title=it.text||''; }
      else if(it.type==='divider'){}
      else { b.text=String(it.text||''); if(it.type==='callout') b.emo=it.emo||'💡'; if(it.type==='task') b.done=false; }
      arr.push(b); ids.push(b.id);
    });
    if(!ids.length) return {n:0,ids:[]};
    try{ br.save(); }catch(_){}
    const scr=(document.querySelector('.screen.active')||{}).id;
    try{
      if(scr==='scr-page'&&window.__pgRender) window.__pgRender();
      else if(typeof renderBoard==='function') renderBoard();
    }catch(_){}
    setTimeout(()=>{ ids.forEach(id=>{
      const el=document.querySelector(`[data-edit="${id}"]`)||document.querySelector(`[data-id="${id}"]`)||document.querySelector(`[data-block="${id}"]`);
      if(el){ const w=el.closest('.pg-block')||el.closest('[data-id]')||el; w.classList.add('ai-born'); }
    }); },60);
    return {n:ids.length,ids};
  }
  function flowSpotEl(){
    let el=document.getElementById('flowSpot');
    if(el) return el;
    el=document.createElement('div'); el.id='flowSpot';
    el.innerHTML=`<div class="fs-head">
        <div class="fs-pet" id="fsPet"></div><span class="fs-nm" id="fsNm"></span><span class="fs-x" id="fsPick" title="Змінити персонажа" style="margin-left:2px;width:22px;height:22px">›</span>
        <span class="fs-ctx" id="fsCtx"></span><span class="fs-x" id="fsSleep" title="Спати">💤</span><span class="fs-x" id="fsX" style="margin-left:8px">✕</span></div>
      <div class="fs-body" id="fsBody"></div>
      <div class="fs-chips" id="fsChips"></div>
      <div class="fs-in">
        <button class="fs-mic" id="fsMic">🎙</button>
        <input id="fsInput" placeholder="Скажи, що зробити…" autocomplete="off">
        <button class="fs-send" id="fsSend">↑</button></div>`;
    document.body.appendChild(el);
    el.querySelector('#fsX').onclick=()=>flowSpotClose();
    el.querySelector('#fsPick').onclick=()=>{ flowSpotClose(); setTimeout(()=>{ if(window.petPickerSheet) window.petPickerSheet(); },120); };
    el.querySelector('#fsSleep').onclick=()=>{ flowSpotClose(); setTimeout(()=>petSleepNow(),150); };
    el.querySelector('#fsSend').onclick=()=>flowSpotSend(el.querySelector('#fsInput').value);
    el.querySelector('#fsInput').addEventListener('keydown',e=>{ if(e.key==='Enter') flowSpotSend(e.target.value); });
    el.querySelector('#fsMic').onclick=()=>spotMicToggle();
    return el;
  }
  function flowSpotToggle(){ document.body.classList.contains('spot-open')?flowSpotClose():flowSpotOpen(); }
  function flowSpotOpen(){
    try{ fcSayHide(); }catch(_){}
    const el=flowSpotEl(); const p=FLOW_PETS[petCur()]; const ctx=spotCtx();
    el.querySelector('#fsPet').innerHTML=petSVG(petCur(),32);
    el.querySelector('#fsNm').textContent=p.name;
    el.querySelector('#fsCtx').textContent=ctx.label;
    el.style.borderColor=p.glow+'66';
    el.querySelector('#fsInput').placeholder='Скажи '+p.name+'у, що зробити…';
    const ch=el.querySelector('#fsChips');
    ch.innerHTML=spotChips(ctx.key).map(c=>`<span class="fs-chip">${c}</span>`).join('');
    ch.querySelectorAll('.fs-chip').forEach(c=>c.onclick=()=>flowSpotSend(c.textContent));
    document.body.classList.add('spot-open');
    setTimeout(()=>{ try{ el.querySelector('#fsInput').focus(); }catch(_){} },250);
  }
  function flowSpotClose(){ document.body.classList.remove('spot-open'); if(spotRec){ try{ spotRec.stop(); }catch(_){} } }
  async function flowSpotSend(q){
    q=String(q||'').trim(); if(!q||spotBusy) return;
    const el=flowSpotEl(); const body=el.querySelector('#fsBody'); const p=FLOW_PETS[petCur()];
    el.querySelector('#fsInput').value='';
    body.insertAdjacentHTML('beforeend',`<div class="fs-msg u">${q.replace(/</g,'&lt;')}</div>`);
    body.insertAdjacentHTML('beforeend',`<div class="fs-gen" id="fsGen"><div style="width:26px;height:26px;animation:petGlow 1s infinite">${petSVG(petCur(),26)}</div><small>${p.name} генерує…</small><div class="fs-bar"></div></div>`);
    body.scrollTop=body.scrollHeight;
    spotBusy=true; const cap=document.getElementById('flowCap'); if(cap) cap.classList.add('busy');
    const ctx=spotCtx();
    try{
      const sys=AI_CHAT_SYS+'\n\n'+petPersona()+'\n\n'+spotAddon(ctx)+'\n\nКОНТЕКСТ:\n'+aiCtx();
      spotMsgs.push({role:'user',content:q});
      const raw=await aiCall(sys,spotMsgs.slice(-6));
      spotMsgs.push({role:'assistant',content:raw});
      const pg=aiParsePage(raw);
      const pr=aiParseBlocks(pg.text);
      let done='';
      if(pg.list.length){ const r=applyPageBlocks(pg.list); if(r.n) done+=`<div class="fs-done">✨ Додав ${r.n} блок(и) → ${ctx.label}</div>`; }
      if(pr.blocks.length||pr.steps.length||(pr.folders&&pr.folders.length)){
        try{ aiCommit(pr); done+=`<div class="fs-done">📅 Оновив планер</div>`; }catch(e){ console.error(e); }
      }
      const g=document.getElementById('fsGen'); if(g) g.remove();
      const say=(pr.text||pg.text||'Готово.').trim();
      body.insertAdjacentHTML('beforeend',done+(say?`<div class="fs-msg">${say.replace(/</g,'&lt;')}</div>`:''));
      body.scrollTop=body.scrollHeight;
      try{ aiSpeak(say); }catch(_){}
    }catch(e){
      const g=document.getElementById('fsGen'); if(g) g.remove();
      body.insertAdjacentHTML('beforeend',`<div class="fs-msg">⚠️ Не вдалось: ${String(e.message||e).replace(/</g,'&lt;')}</div>`);
    }
    spotBusy=false; if(cap) cap.classList.remove('busy');
  }
  async function spotMicToggle(){
    const btn=document.querySelector('#flowSpot .fs-mic');
    if(spotRec){ try{ spotRec.stop(); }catch(_){} return; }
    try{
      aiSpeakStop&&aiSpeakStop();
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mime=MediaRecorder.isTypeSupported('audio/mp4')?'audio/mp4':(MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'');
      spotRec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
      const chunks=[];
      spotRec.ondataavailable=e=>{ if(e.data&&e.data.size) chunks.push(e.data); };
      spotRec.onstop=async()=>{
        stream.getTracks().forEach(t=>t.stop());
        if(btn) btn.classList.remove('rec');
        const blob=new Blob(chunks,{type:spotRec.mimeType||'audio/mp4'}); spotRec=null;
        if(blob.size<1200){ plToast('🎙 Закоротко'); return; }
        const t=await aiTranscribeBlob(blob);
        if(t) flowSpotSend(t);
      };
      spotRec.start(); if(btn) btn.classList.add('rec');
      plToast('🎙 Говори — тап ще раз, щоб зупинити');
    }catch(e){ plToast('⚠️ Нема доступу до мікрофона'); spotRec=null; }
  }
  /* safety-stop: запис спотлайту не має тихо писати у фоні, коли апку згорнули */
  document.addEventListener('visibilitychange',function(){
    if(document.hidden&&spotRec){
      try{ plToast('🎙 Запис зупинено — застосунок згорнуто'); }catch(_){}
      try{ spotRec.stop(); }catch(_){}
    }
  });
  window.flowCapRender=flowCapRender; window.petPickerSheet=petPickerSheet; window.petSVG=petSVG;
  window.flowSpotOpen=flowSpotOpen;

  /* ── повноекранний UI ── */
  function aiChatSheet(){
    setTimeout(()=>{ try{ aiMorningMaybe(); aiWeeklyMaybe(); }catch(_){} }, 700);
    if(document.getElementById('aiScr')) return;
    const scr=document.createElement('div'); scr.id='aiScr'; scr.className='aiscr';
    scr.innerHTML=`
      <div class="ai-aurora"></div>
      <div class="ai-head" id="aiHead"></div>
      <div class="ai-body" id="aiChatBody"></div>
      <div class="ai-dock">
        <div class="ai-views" id="aiViews"></div>
        <div class="ai-in">
          <button class="ai-mic ai-plusb" id="aiPlusBtn">${aiIco('plus',17)}</button>
          <input id="aiInput" placeholder="Напиши Флоу…" autocomplete="off">
          <button class="ai-mic" id="aiMic">${AI_SVG.mic}</button>
          <button class="ai-send" id="aiSend">${AI_SVG.send}</button>
        </div>
      </div>`;
    document.body.appendChild(scr);
    document.body.classList.add('ai-open');
    scr.querySelector('#aiPlusBtn').onclick=e=>{ e.stopPropagation(); aiPlusSheet(); };
    scr.querySelector('#aiSend').onclick=()=>aiChatSend(document.getElementById('aiInput').value);
    scr.querySelector('#aiInput').addEventListener('keydown',e=>{ if(e.key==='Enter') aiChatSend(e.target.value); });
    scr.querySelector('#aiInput').addEventListener('input',e=>{
      const v=e.target.value;
      if(v[0]==='/') aiSlashShow(v.slice(1).split(/\s/)[0].toLowerCase());
      else aiSlashHide();
    });
    scr.querySelector('#aiMic').onclick=()=>aiMicToggle();
    scr.querySelector('#aiInput').placeholder='Напиши '+FLOW_PETS[petCur()].name+'…';
    aiRenderHead(); aiRenderViews(); aiRenderBody();
    aiChatLoad().then(()=>{ aiRenderHead(); aiRenderViews(); aiRenderBody(); });
    window.__aiHamAct=null; // нове заняття в гамачку при кожному відкритті
  }
  function aiClose(){
    aiSpeakStop(); aiSlashHide();
    const ms=document.getElementById('aiMemSheet'); if(ms) ms.remove();
    const s=document.getElementById('aiScr'); if(s) s.remove();
    document.body.classList.remove('ai-open');
    try{ if(window.__fcJustWoke) setTimeout(flowCapRender,60); }catch(_){}
  }
  function aiDayPct(){
    const l=plBlocksFor(plTodayStr())||[];
    if(!l.length) return {pct:0,done:0,tot:0};
    const d=l.filter(b=>b.done).length;
    return {pct:Math.round(d/l.length*100),done:d,tot:l.length};
  }
  /* ── голос Флоу: озвучка відповідей через системний TTS (iOS/Android, укр. голос) ── */
  let aiVoiceOn=false;
  try{ aiVoiceOn = localStorage.getItem('ai_voice')==='1'; }catch(_){}
  function aiSpeakStop(){ try{ window.speechSynthesis&&speechSynthesis.cancel(); }catch(_){} }
  function aiSpeak(text){
    if(!aiVoiceOn) return;
    try{
      if(!('speechSynthesis' in window)) return;
      let t=String(text||'').replace(/[*_`#>]+/g,'').replace(/https?:\/\/\S+/g,'').trim();
      if(!t) return;
      if(t.length>600) t=t.slice(0,600)+'…';
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(t);
      u.lang='uk-UA'; u.rate=1.04; u.pitch=1;

      /* Голоси в браузері зʼявляються не одразу. Раніше тут стояв
         speak() ОДРАЗУ, а український голос підставлявся потім — тобто
         першу фразу після відкриття читав голос за замовчуванням,
         зазвичай англійський. Українською це звучало жахливо.
         Тепер спершу дочекуємось списку, потім говоримо. */
      const pickUk = () => (speechSynthesis.getVoices()||[])
        .find(x => (x.lang||'').toLowerCase().startsWith('uk'));

      const say = () => {
        const v = pickUk();
        if (v) u.voice = v;          // немає української — хай читає системний
        speechSynthesis.speak(u);
      };

      if (pickUk() || (speechSynthesis.getVoices()||[]).length) { say(); }
      else {
        /* чекаємо появи голосів, але не вічно: якщо за 800 мс їх так
           і не буде — говоримо тим, що є, аби не мовчати зовсім */
        let said = false;
        const once = () => { if (said) return; said = true; say(); };
        const prev = speechSynthesis.onvoiceschanged;
        speechSynthesis.onvoiceschanged = function(e){
          try{ if (typeof prev === 'function') prev.call(this, e); }catch(_){}
          once();
        };
        setTimeout(once, 800);
      }
    }catch(e){ console.error('aiSpeak',e); }
  }
  function aiVoiceToggle(){
    aiVoiceOn=!aiVoiceOn;
    try{ prefSet('ai_voice', aiVoiceOn?'1':'0'); }catch(_){}
    if(!aiVoiceOn) aiSpeakStop();
    else aiSpeak('Голос увімкнено');
    aiRenderHead();
  }
  function aiRenderHead(){
    const h=document.getElementById('aiHead'); if(!h) return;
    const d=aiDayPct(); const stk=plStreak();
    h.innerHTML=`
      <button class="ai-back" id="aiBack">${AI_SVG.back}</button>
      <div class="ai-cap ai-glass" id="aiCapPet" title="${petSleeping()?'Розбудити':'Обрати друга'}" style="min-width:0;cursor:pointer;touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none">
        <div class="cap-pet" style="width:28px;height:28px;flex:none">${petSleeping()?petSVGSleep(petCur(),28):petSVG(petCur(),28)}</div>
        ${petSleeping()?'<span class="cap-z">💤</span><span class="cap-z2">💤</span>':''}
        <div class="ai-ht" style="min-width:0"><b style="white-space:nowrap">${FLOW_PETS[petCur()].name}</b><small style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">${petSleeping()?'💤 відпочиває · тапни':`<span class="ai-dot"></span>онлайн · ${d.done}/${d.tot} · 🔥${stk}`}</small></div>
      </div>
      <button class="ai-clear" id="aiMemBtn" title="Памʼять Флоу" style="${aiMem.length?'color:#a08bff;':''}">${aiIco('chip',16)}${aiMem.length?'<sup>'+aiMem.length+'</sup>':''}</button>
      <button class="ai-clear" id="aiVoice" title="Голос Флоу" style="${aiVoiceOn?'color:#a08bff;':''}">${aiIco(aiVoiceOn?'spk':'spkoff',16)}</button>
      <div class="ai-trust" id="aiTrust"><i class="${aiAuto?'':'on'}" data-a="0">Питати</i><i class="${aiAuto?'on':''}" data-a="1">Авто</i></div>
      <button class="ai-clear" id="aiClear" title="Очистити памʼять">${AI_SVG.trash}</button>`;
    h.querySelector('#aiBack').onclick=aiClose;
    h.querySelector('#aiVoice').onclick=aiVoiceToggle;
    (function(){
      const cap=h.querySelector('#aiCapPet'); if(!cap) return;
      let lp=false, tm=null;
      /* @dev-only:start */
      const start=e=>{ lp=false; tm=setTimeout(()=>{ lp=true; try{ window.platform.haptic('medium'); }catch(_){} aiDevToggleSheet(); }, 550); };
      const stop=()=>{ if(tm){ clearTimeout(tm); tm=null; } };
      cap.addEventListener('pointerdown',start);
      cap.addEventListener('touchstart',e=>{ if(!tm) start(e); },{passive:true});
      ['pointerup','pointercancel','touchend','touchcancel'].forEach(ev=>cap.addEventListener(ev,stop));
      cap.addEventListener('contextmenu',e=>{ try{ e.preventDefault(); }catch(_){} });
      /* @dev-only:end */
      cap.onclick=()=>{
        if(lp){ lp=false; return; }
        /* @dev-only:start */
        if(aiDevOn()){ aiDevToggleSheet(); return; }   // у dev персонажа не міняємо
        /* @dev-only:end */
        if(petSleeping()){ aiWakeInChat(); } else petPickerSheet();
      };
    })();
    h.querySelectorAll('#aiTrust i').forEach(t=>t.onclick=()=>{ aiAuto=t.dataset.a==='1'; aiChatSave(); aiRenderHead(); });
    h.querySelector('#aiMemBtn').onclick=aiMemSheet;
    h.querySelector('#aiClear').onclick=()=>{
      confirmSheet({title:'Очистити історію Флоу?', sub:'Розмови, резюме і журнал змін зітруться. Довготривала памʼять (🧠) залишиться.', okLabel:'Очистити', onOk:()=>{
        aiChatMsgs=[]; aiLog=[]; aiSum=''; aiChatSave(); aiRenderBody();
      }});
    };
  }
  /* ── 🧠 памʼять: перегляд і видалення фактів ── */
  function aiMemSheet(){
    const old=document.getElementById('aiMemSheet'); if(old) old.remove();
    const s=document.createElement('div'); s.id='aiMemSheet'; s.className='ai-memsheet';
    const rows=aiMem.length
      ? aiMem.map((f,i)=>`<div class="ai-memrow"><span>${esc(f)}</span><button data-mdel="${i}">${aiIco('x',12)}</button></div>`).join('')
      : '<div class="ai-memempty">Поки порожньо. Флоу сам запамʼятовує важливе з розмов — імʼя, обставини, рішення.</div>';
    s.innerHTML=`<div class="ai-memcard"><div class="grab"></div>
      <div class="ai-memh"><b><span class="mi">${aiIco('chip',15)}</span>Памʼять Флоу</b><small>${aiMem.length} фактів · живе між розмовами</small></div>
      <div class="ai-memlist">${rows}</div>
      <div class="ai-memf">
        <button class="ai-memadd" id="aiMemAddBtn">+ Додати факт</button>
        ${aiMem.length?'<button class="ai-memwipe" id="aiMemWipe">Стерти все</button>':''}
      </div></div>`;
    s.onclick=e=>{ if(e.target===s) s.remove(); };
    s.querySelectorAll('[data-mdel]').forEach(b=>b.onclick=()=>{ aiMem.splice(+b.dataset.mdel,1); aiMemSave(); aiRenderHead(); aiMemSheet(); });
    s.querySelector('#aiMemAddBtn').onclick=()=>{
      inputModal({title:'Що Флоу має памʼятати?', value:'', onOk:v=>{ if(aiMemAdd([v])) aiMemSheet(); }});
    };
    const w=s.querySelector('#aiMemWipe');
    if(w) w.onclick=()=>confirmSheet({title:'Стерти всю памʼять?', okLabel:'Стерти', onOk:()=>{ aiMem=[]; aiMemSave(); aiRenderHead(); s.remove(); }});
    document.body.appendChild(s);
  }
  function aiRenderViews(){
    // єдиний розумний режим: перемикач більше не потрібен
    const v=document.getElementById('aiViews'); if(!v) return;
    v.innerHTML=''; v.style.display='none';
  }
  function aiPendingMsg(){
    for(let i=aiChatMsgs.length-1;i>=0;i--){
      const m=aiChatMsgs[i];
      if(m.role!=='assistant') continue;
      if(m.applied||m.declined) return null;
      if(m.streaming) return null;
      const pr=aiParseBlocks(m.content);
      return aiOpsCount(pr)?{m:m,pr:pr}:null;
    }
    return null;
  }
  function aiLogHTML(){
    if(!aiLog.length) return '';
    const fmtT=ts=>{ const d=new Date(ts); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); };
    return `<div class="ai-chlog">${aiLog.slice(0,6).map(l=>
      `<span class="ai-chp">✎ <b>${l.nb+l.ns+(l.nf||0)+(l.nop||0)+(l.np||0)}</b> · ${fmtT(l.ts)} <em data-undo="${l.ts}">↩</em></span>`).join('')}</div>`;
  }
  /* ── міні-таймлайн дня 6:00–24:00: наявне · нове · перенесене ── */
  function aiTlHTML(pr){
    const td=plTodayStr();
    const movedIds=new Set();
    const seg=(h,e,cls)=>{
      h=Math.max(6,Math.min(24,+h||6)); e=Math.max(h+0.15,Math.min(24,+e||h+0.5));
      const l=(h-6)/18*100, w=(e-h)/18*100;
      return `<i class="${cls}" style="left:${l.toFixed(1)}%;width:${Math.max(1.4,w).toFixed(1)}%"></i>`;
    };
    let segs='';
    (pr.move||[]).forEach(mv=>{
      const ds=/^\d{4}-\d{2}-\d{2}$/.test(mv.ds||'')?mv.ds:td;
      if(ds!==td) return;
      const b=aiFindBlockByT(ds,mv.t);
      if(b) movedIds.add(b.id);
      segs+=seg(mv.h,mv.endH,'mv');
    });
    (plBlocksFor(td)||[]).forEach(b=>{ if(!movedIds.has(b.id)) segs+=seg(b.h,plBlockEnd(b),b.done?'f dn':'f'); });
    (pr.blocks||[]).forEach(b=>{ const ds=/^\d{4}-\d{2}-\d{2}$/.test(b.ds||'')?b.ds:td; if(ds===td) segs+=seg(b.h,b.endH,'nw'); });
    if(!segs) return '';
    const n=new Date(), nowL=((n.getHours()+n.getMinutes()/60-6)/18*100);
    const now=(nowL>0&&nowL<100)?`<em style="left:${nowL.toFixed(1)}%"></em>`:'';
    return `<div class="ai-tl">${segs}${now}<span style="left:0">6</span><span style="left:33.3%">12</span><span style="left:66.6%">18</span><span style="right:0">24</span></div>`;
  }
  function aiActsHTML(pr,mi){
    const rows=[];
    (pr.blocks||[]).forEach(b=>{
      const gl=b.goal?aiFindGoal(b.goal):null;
      rows.push(`<div class="ai-act new"><span class="ic">${aiIco('plus',13)}</span><span class="tx">${esc(b.t||'Блок')}<small>${esc(b.ds||plTodayStr())} · ${plHM(+b.h||0)}–${plHM(+b.endH||0)}${gl?' · 🎯 '+esc(gl.name):''}</small></span></div>`);
    });
    (pr.steps||[]).forEach(s=>{
      rows.push(`<div class="ai-act goal"><span class="ic">${aiIco('target',13)}</span><span class="tx">${esc(s.t||'Крок')}<small>у ціль «${esc(s.goal||'')}»</small></span></div>`);
    });
    (pr.folders||[]).forEach(f=>{
      const isP=f.role==='project';
      const wc=Array.isArray(f.widgets)?f.widgets.filter(w=>['worktrack','income','spend','debts','envelopes','patterns','planday','planmonth'].includes(String(w))).length:0;
      const meta=[isP?'проєкт':'папка', f.due?('до '+esc(f.due)):'', wc?(wc+' віджет'+(wc===1?'':'и')):''].filter(Boolean).join(' · ');
      rows.push(`<div class="ai-act goal"><span class="ic">${aiIco(isP?'target':'folder',13)}</span><span class="tx">${isP?'Проєкт':'Папка'} «${esc(f.name||'')}»<small>${meta}</small></span></div>`);
    });
    (pr.move||[]).forEach(mv=>{
      const b=aiFindBlockByT(/^\d{4}-\d{2}-\d{2}$/.test(mv.ds||'')?mv.ds:plTodayStr(),mv.t);
      rows.push(`<div class="ai-act mv"><span class="ic">${aiIco('move',13)}</span><span class="tx">${esc(b?b.t:mv.t||'Блок')}<small>${b?plHM(b.h)+'–'+plHM(plBlockEnd(b))+' → ':''}${plHM(+mv.h||0)}–${plHM(+mv.endH||0)}${b?'':' · ⚠️ не знайдено'}</small></span></div>`);
    });
    (pr.done||[]).forEach(dn=>{
      const b=aiFindBlockByT(/^\d{4}-\d{2}-\d{2}$/.test(dn.ds||'')?dn.ds:plTodayStr(),dn.t);
      rows.push(`<div class="ai-act dn"><span class="ic">${aiIco('check',13)}</span><span class="tx">${esc(b?b.t:dn.t||'Блок')}<small>відмітити виконаним${b?'':' · ⚠️ не знайдено'}</small></span></div>`);
    });
    (pr.del||[]).forEach(dl=>{
      const b=aiFindBlockByT(/^\d{4}-\d{2}-\d{2}$/.test(dl.ds||'')?dl.ds:plTodayStr(),dl.t);
      rows.push(`<div class="ai-act rm"><span class="ic">${aiIco('x',13)}</span><span class="tx">${esc(b?b.t:dl.t||'Блок')}<small>видалити з дня${b?'':' · ⚠️ не знайдено'}</small></span></div>`);
    });
    (pr.pages||[]).forEach(pg=>{
      const fk=aiFindFolderKey(pg.folder);
      const bc=Array.isArray(pg.blocks)?pg.blocks.length:0;
      rows.push(`<div class="ai-act pg"><span class="ic">${aiIco('doc',13)}</span><span class="tx">Сторінка «${esc(pg.title||'')}»<small>${bc?bc+' блок'+(bc===1?'':'и')+' · ':''}у «${esc(pg.folder||'')}»${fk?'':' · ⚠️ папку не знайдено'}</small></span></div>`);
    });
    return `<div class="ai-acts">${aiTlHTML(pr)}${rows.join('')}
      <div class="ai-apply">
        <button class="ok" data-commit="${mi}">✓ Застосувати ${rows.length}</button>
        <button class="no" data-decline="${mi}">Відхилити</button>
      </div></div>`;
  }
  function aiWireBody(el){
    el.querySelectorAll('[data-undo]').forEach(b=>b.onclick=()=>aiUndo(+b.dataset.undo));
    el.querySelectorAll('[data-commit]').forEach(b=>b.onclick=()=>{
      const m=aiChatMsgs[+b.dataset.commit]; if(!m||m.applied) return;
      aiCommit(aiParseBlocks(m.content)); m.applied=true; aiChatSave(); aiRenderHead(); aiRenderBody();
    });
    el.querySelectorAll('[data-decline]').forEach(b=>b.onclick=()=>{
      const m=aiChatMsgs[+b.dataset.decline]; if(!m) return;
      m.declined=true; aiChatSave(); aiRenderBody();
    });
    el.querySelectorAll('[data-chip]').forEach(b=>b.onclick=()=>aiChatSend(b.dataset.chip));
    const hs=el.querySelector('#aiHamStagePet');
    if(hs){ hs.onclick=()=>aiHamWakeFrom(hs); aiHamRotStart(); }
  }
  function aiChipsHTML(){
    return `<div class="ai-chips">
      ${Object.keys(AI_SKILLS).map(k=>`<button data-chip="/${k}">${aiIco(AI_SKILLS[k].ico,14)}<span>${esc(AI_SKILLS[k].t)}</span></button>`).join('')}
      <button data-chip="Що зараз найважливіше зробити і чому саме це?">${aiIco('target',14)}<span>Що зараз важливо</span></button>
    </div>`;
  }
  const AI_SVG={
    back:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    mic:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    send:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    trash:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/></svg>',
    bolt:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z"/></svg>'
  };
  /* ── іконки Флоу: stroke, як у решті Flow ── */
  const AI_ICO={
    plus:'<path d="M12 5v14M5 12h14"/>',
    chip:'<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 4v3M15 4v3M9 17v3M15 17v3M4 9h3M4 15h3M17 9h3M17 15h3"/>',
    slashsq:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9.5 15l5-6"/>',
    image:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9.2" cy="9.2" r="1.5"/><path d="M20 15.5l-4.5-4.5L6 20"/>',
    doc:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    cal:'<rect x="4" y="5" width="16" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M4 10h16"/>',
    trend:'<path d="M4 19h16M6 15l4-5 3 3 5-7"/>',
    scan:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2"/>',
    cash:'<rect x="3" y="7" width="18" height="11" rx="2.5"/><circle cx="12" cy="12.5" r="2.4"/><path d="M6.6 10.6h.01M17.4 14.4h.01"/>',
    target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.6"/><circle cx="12" cy="12" r=".5"/>',
    move:'<path d="M7 8h13M17 5l3 3-3 3M17 16H4M7 13l-3 3 3 3"/>',
    check:'<path d="M5 13l4.2 4.2L19 7"/>',
    x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    folder:'<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.2h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    play:'<path d="M9 6.5v11l9-5.5z"/>',
    spk:'<path d="M11 5.5L6.5 9H4v6h2.5L11 18.5z"/><path d="M15 9.5a3.6 3.6 0 0 1 0 5"/><path d="M17.5 7.5a7 7 0 0 1 0 9"/>',
    spkoff:'<path d="M11 5.5L6.5 9H4v6h2.5L11 18.5z"/><path d="M15.5 9.5l5 5M20.5 9.5l-5 5"/>',
    orb:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.6"/>',
    rows:'<path d="M4 6.5h16M4 12h16M4 17.5h10"/>',
    layout:'<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M4 14h16M10 14v6"/>',
    trash:'<path d="M4 7h16M9 7V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5V7M6.5 7l1 13h9l1-13"/>'
  };
  function aiIco(n,s){
    s=s||16;
    return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+(AI_ICO[n]||AI_ICO.plus)+'</svg>';
  }
  /* ── markdown-lite: **жирне**, списки, переноси ── */
  function aiMD(t){
    t=esc(String(t||''));
    t=t.replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>');
    t=t.split('\n').map(l=>{ const m2=l.match(/^\s*[-•]\s+(.*)$/); return m2?'<span class="ai-li">'+m2[1]+'</span>':l; }).join('\n');
    return t.replace(/\n{2,}/g,'\n').replace(/\n/g,'<br>');
  }
  function aiBusyHTML(){
    const m=aiChatMsgs[aiChatMsgs.length-1];
    const t=(m&&m.role==='assistant'&&m.streaming)?aiStreamText(m.content):'';
    const st=(typeof aiAgentStatus!=='undefined'&&aiAgentStatus)?'<div class="ai-dots">'+aiAgentStatus+'</div>':'';
    if(t) return aiMD(t)+(st||'<i class="ai-cursor"></i>');
    return st||'<span class="ai-dots">думаю…</span>';
  }
  /* ── слеш-меню скілів над полем вводу ── */
  function aiSlashHide(){ const s=document.getElementById('aiSlash'); if(s) s.remove(); }
  function aiSlashShow(filter){
    let s=document.getElementById('aiSlash');
    const keys=Object.keys(AI_SKILLS).filter(k=>!filter||k.startsWith(filter));
    const cust=aiPrompts.map((p,i)=>({i:i,p:p})).filter(x=>!filter||x.p.name.toLowerCase().startsWith(filter));
    if(!keys.length&&!cust.length){ aiSlashHide(); return; }
    if(!s){
      s=document.createElement('div'); s.id='aiSlash'; s.className='ai-slash';
      const dock=document.querySelector('#aiScr .ai-dock'); if(dock) dock.prepend(s); else return;
    }
    s.innerHTML=keys.map(k=>`<button data-sk="${k}"><span class="si">${aiIco(AI_SKILLS[k].ico,15)}</span><b>/${k}</b><small>${esc(AI_SKILLS[k].t)}</small></button>`).join('')
      +cust.map(x=>`<button data-pr="${x.i}"><span class="si">${aiIco('slashsq',15)}</span><b>/${esc(x.p.name.toLowerCase())}</b><small>мій промт</small></button>`).join('');
    s.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>aiChatSend('/'+b.dataset.sk));
    s.querySelectorAll('[data-pr]').forEach(b=>b.onclick=()=>{ const p=aiPrompts[+b.dataset.pr]; aiSlashHide(); const f=document.getElementById('aiInput'); if(f) f.value=''; if(p) aiChatSend(p.text); });
  }
  /* ── вкладення: фото (стискається), PDF, текстові файли ── */
  function aiAttachRender(){
    let row=document.getElementById('aiAttRow');
    if(!aiAttach.length){ if(row) row.remove(); return; }
    if(!row){
      row=document.createElement('div'); row.id='aiAttRow'; row.className='ai-attrow';
      const dock=document.querySelector('#aiScr .ai-dock'); if(dock) dock.prepend(row); else return;
    }
    row.innerHTML=aiAttach.map((a,i)=>a.kind==='image'
      ?`<span class="ai-attc img"><img src="data:${a.media};base64,${a.data}"><b data-adel="${i}">${aiIco('x',11)}</b></span>`
      :`<span class="ai-attc">${aiIco('doc',13)} ${esc(a.name).slice(0,18)}<b data-adel="${i}">${aiIco('x',11)}</b></span>`).join('');
    row.querySelectorAll('[data-adel]').forEach(b=>b.onclick=()=>{ aiAttach.splice(+b.dataset.adel,1); aiAttachRender(); });
  }
  function aiImgShrink(file){
    return new Promise((res,rej)=>{
      const img=new Image();
      img.onload=()=>{
        try{
          const MAX=1280; let w=img.width,h=img.height;
          if(Math.max(w,h)>MAX){ const k=MAX/Math.max(w,h); w=Math.round(w*k); h=Math.round(h*k); }
          const c=document.createElement('canvas'); c.width=w; c.height=h;
          c.getContext('2d').drawImage(img,0,0,w,h);
          const du=c.toDataURL('image/jpeg',.82);
          res(du.slice(du.indexOf(',')+1));
        }catch(e){ rej(e); }
      };
      img.onerror=()=>rej(new Error('img'));
      img.src=URL.createObjectURL(file);
    });
  }
  function aiFileB64(file){
    return new Promise((res,rej)=>{
      const r=new FileReader();
      r.onload=()=>res(String(r.result).slice(String(r.result).indexOf(',')+1));
      r.onerror=()=>rej(new Error('read'));
      r.readAsDataURL(file);
    });
  }
  function aiPickFile(kind){
    const inp=document.createElement('input'); inp.type='file';
    inp.accept=kind==='photo'?'image/*':'.pdf,.txt,.md,.csv,application/pdf,text/plain';
    inp.onchange=async()=>{
      const f=inp.files&&inp.files[0]; if(!f) return;
      try{
        if(/^image\//.test(f.type)){
          plToast('⏳ Стискаю фото…');
          const data=await aiImgShrink(f);
          aiAttach.push({kind:'image',media:'image/jpeg',data:data,name:f.name});
        } else if(f.type==='application/pdf'||/\.pdf$/i.test(f.name)){
          if(f.size>4.5*1024*1024){ plToast('📄 PDF завеликий (макс ~4.5 МБ)'); return; }
          aiAttach.push({kind:'pdf',media:'application/pdf',data:await aiFileB64(f),name:f.name});
        } else {
          const txt=await f.text();
          aiAttach.push({kind:'text',text:txt.slice(0,24000),name:f.name});
        }
        aiAttachRender();
        try{ window.platform.haptic('light'); }catch(_){}
        const fld=document.getElementById('aiInput'); if(fld&&!fld.value) fld.placeholder='Що зробити з файлом?';
      }catch(e){ console.error('aiPick',e); plToast('⚠️ Не вдалось прочитати файл'); }
    };
    inp.click();
  }
  /* ── «＋»: промти · памʼять · файли ── */
  function aiPlusSheet(){
    const old=document.getElementById('aiPlus'); if(old){ old.remove(); return; }
    const s=document.createElement('div'); s.id='aiPlus'; s.className='ai-plus';
    s.innerHTML=`
      <button data-p="prompts"><span class="ic t1">${aiIco('slashsq',17)}</span><div>Мої промти<small>${aiPrompts.length?aiPrompts.length+' збережено':'створи свої скіли'}</small></div></button>
      <button data-p="mem"><span class="ic t2">${aiIco('chip',17)}</span><div>Памʼять<small>${aiMem.length} фактів</small></div></button>
      <button data-p="photo"><span class="ic t3">${aiIco('image',17)}</span><div>Фото<small>Флоу роздивиться</small></div></button>
      <button data-p="doc"><span class="ic t4">${aiIco('doc',17)}</span><div>Документ<small>PDF · TXT · MD · CSV</small></div></button>`;
    s.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      s.remove();
      const p=b.dataset.p;
      if(p==='prompts') aiPromptsSheet();
      else if(p==='mem') aiMemSheet();
      else aiPickFile(p);
    });
    const dock=document.querySelector('#aiScr .ai-dock');
    if(dock) dock.prepend(s);
    document.addEventListener('click',function h(e){ if(!s.contains(e.target)&&e.target.id!=='aiPlusBtn'){ s.remove(); document.removeEventListener('click',h); } },{capture:true});
  }
  /* ── 🧩 мої промти: редактор ── */
  function aiPromptsSheet(){
    const old=document.getElementById('aiMemSheet'); if(old) old.remove();
    const s=document.createElement('div'); s.id='aiMemSheet'; s.className='ai-memsheet';
    const rows=aiPrompts.length
      ? aiPrompts.map((p,i)=>`<div class="ai-memrow ai-prow">
          <span class="pe">${aiIco('slashsq',15)}</span>
          <span><b>${esc(p.name)}</b><small>${esc(p.text).slice(0,60)}…</small></span>
          <button data-prun="${i}" class="prun">${aiIco('play',14)}</button><button data-pdel="${i}">${aiIco('x',12)}</button></div>`).join('')
      : '<div class="ai-memempty">Промт — твій власний скіл: збережи один раз, запускай з «+» або через «/» у полі.</div>';
    s.innerHTML=`<div class="ai-memcard"><div class="grab"></div>
      <div class="ai-memh"><b><span class="mi">${aiIco('slashsq',15)}</span>Мої промти</b><small>${aiPrompts.length}/20 · доступні через /слеш</small></div>
      <div class="ai-memlist">${rows}</div>
      <div class="ai-memf"><button class="ai-memadd" id="aiPrAdd">+ Новий промт</button></div></div>`;
    s.onclick=e=>{ if(e.target===s) s.remove(); };
    s.querySelectorAll('[data-prun]').forEach(b=>b.onclick=()=>{ s.remove(); aiChatSend(aiPrompts[+b.dataset.prun].text); });
    s.querySelectorAll('[data-pdel]').forEach(b=>b.onclick=()=>{ aiPrompts.splice(+b.dataset.pdel,1); aiPromptsSave(); aiPromptsSheet(); });
    s.querySelector('#aiPrAdd').onclick=()=>{ s.remove(); aiPromptEdit(); };
    document.body.appendChild(s);
  }
  function aiPromptEdit(){
    const s=document.createElement('div'); s.className='ai-memsheet';
    s.innerHTML=`<div class="ai-memcard"><div class="grab"></div>
      <div class="ai-memh"><b>Новий промт</b><small>назва — для меню, текст — що сказати Флоу</small></div>
      <input class="ai-pin" id="aiPrName" placeholder="Назва (напр. Ранковий запуск)" maxlength="40">
      <textarea class="ai-pta" id="aiPrText" placeholder="Текст промта… (напр.: Подивись мій день і памʼять, дай 3 пріоритети і один головний блок. Додай FLOW_OPS.)"></textarea>
      <div class="ai-memf"><button class="ai-memadd" id="aiPrSave">Зберегти промт</button></div></div>`;
    s.onclick=e=>{ if(e.target===s) s.remove(); };
    s.querySelector('#aiPrSave').onclick=()=>{
      const n=s.querySelector('#aiPrName').value.trim(), t=s.querySelector('#aiPrText').value.trim();
      if(!n||!t){ plToast('Заповни назву і текст'); return; }
      aiPrompts.unshift({name:n,text:t}); aiPromptsSave();
      s.remove(); aiPromptsSheet();
    };
    document.body.appendChild(s);
    setTimeout(()=>{ const f=s.querySelector('#aiPrName'); if(f) f.focus(); },60);
  }
  function aiEnvKpi(){
    try{
      const e=(envelopes||[]).find(x=>+x.goal>0);
      if(!e) return null;
      return {name:e.name, pct:Math.min(100,Math.round(envSaved(e)/(+e.goal)*100))};
    }catch(_){ return null; }
  }
  /* ── картка змін: «зроби/сплануй» → пропозиція або результат зі статами і блоками дня ── */
  function aiPlanCardHTML(pr,mi,m){
    const cnt=aiOpsCount(pr);
    const pendHere=!m.applied&&!m.declined;
    let s=`<div class="ai-plancard${pendHere?' pend':''}">
      <div class="pc-h"><span>${pendHere?'Пропоновані зміни':'Зміни застосовано'}</span><b>${cnt}</b></div>`;
    if(pendHere) s+=aiActsHTML(pr,mi);
    else if(m.applied){
      const td=plTodayStr(); const d=aiDayPct(); const env=aiEnvKpi();
      const lastIds=aiLog.length?new Set((aiLog[0].undo.blocks||[]).map(x=>x.id)):new Set();
      const list=(plBlocksFor(td)||[]).slice().sort((a,b)=>a.h-b.h);
      s+=`<div class="ai-kpis">
        <div class="ai-kpi g"><b>${d.tot?d.pct+'%':'—'}</b><small>день</small></div>
        <div class="ai-kpi"><b>${plStreak()}</b><small>стрік</small></div>
        ${env?`<div class="ai-kpi"><b>${env.pct}%</b><small>${esc(env.name).slice(0,10)}</small></div>`:''}
      </div>`;
      const blkRow=b=>`<div class="ai-blk${lastIds.has(b.id)?' fresh':''}${b.done?' dn':''}">
        <span class="tm">${plHM(b.h)}</span>
        <div class="tt"><b>${esc(b.t||'')}</b><small>${plHM(b.h)}–${plHM(plBlockEnd(b))}</small></div>
        ${b.link&&b.link.goalName?`<span class="ai-pill">${esc(b.link.goalName).slice(0,14)}</span>`:''}
      </div>`;
      const fresh=list.filter(b=>lastIds.has(b.id));
      if(fresh.length) s+=`<div class="ai-sect">Нові блоки дня</div>`+fresh.map(blkRow).join('');
      else if(list.length) s+=`<div class="ai-sect">День</div>`+list.slice(0,5).map(blkRow).join('');
    }
    return s+`</div>`;
  }
  function aiRenderBody(){
    const el=document.getElementById('aiChatBody'); if(!el) return;
    el.className='ai-body v-uni';
    if(petSleeping()&&!aiChatMsgs.length&&!aiBusy){   // порожній день = він і є сцена
      el.innerHTML=aiHamSceneHTML(); aiHamBind(el); return;
    }
    let html=aiLogHTML();
    // порожній чат, не спить → привітальний hero з чипсами
    if(!aiChatMsgs.length&&!aiBusy){
      html+=`<div class="ai-stage">
        <div class="ai-pet-stage" style="--pet-glow:${FLOW_PETS[petCur()].glow}55">${petSVG(petCur(),112)}</div>
        <div class="ai-greet">Скажи — <b>я зміню день</b></div>
        ${aiChipsHTML()}
      </div>`;
      el.innerHTML=html; aiWireBody(el); return;
    }
    // спить посеред розмови → компактний гамак над діалогом
    if(petSleeping()&&!aiBusy){
      html+=`<div class="ai-hamscene hm-stage act-${aiHamAct().k}" id="aiHamStagePet">${aiHamCoreHTML()}<div class="hm-sub">спить · тапни — розбудити</div></div>`;
    }
    // єдиний діалог: питання → текст; ops → текст + картка змін під останнім пакетом
    let lastOpsIdx=-1;
    for(let i=aiChatMsgs.length-1;i>=0;i--){
      const m=aiChatMsgs[i];
      if(m.role==='assistant'&&!m.streaming&&aiOpsCount(aiParseBlocks(m.content))){ lastOpsIdx=i; break; }
    }
    html+=`<div class="ai-clog">${aiChatMsgs.map((m,mi)=>{
      if(m.role==='user') return `<div class="ai-msg u" data-i18n-skip="1">${esc(m.content)}</div>`;
      if(m.streaming) return '';
      const pr=aiParseBlocks(m.content);
      const cnt=aiOpsCount(pr);
      let s=`<div class="ai-msg a">${aiMD(pr.text)}`;
      if(cnt&&m.applied&&mi!==lastOpsIdx) s+=`<span class="ai-done">✓ застосовано (${cnt})</span>`;
      if(cnt&&m.declined) s+=`<span class="ai-done off">відхилено</span>`;
      s+=`</div>`;
      if(cnt&&mi===lastOpsIdx&&!m.declined) s+=aiPlanCardHTML(pr,mi,m);
      return s;
    }).join('')}${aiBusy?'<div class="ai-msg a"><span id="aiStreamTxt">'+aiBusyHTML()+'</span></div>':''}</div>`;
    el.innerHTML=html;
    aiWireBody(el);
    el.scrollTop=el.scrollHeight;
  }
  /* ── скіли: слеш-команди зі своїм промптом і СВОЇМ зрізом контексту ── */
  const AI_SKILLS={
    'день':{ico:'cal',t:'Сплануй день',ctx:['day','goals'],q:'Сплануй мій день реалістично з того, що є в контексті',
      sys:'СКІЛ /день: побудуй реальний план на сьогодні. Врахуй поточний час і наявні блоки, 3-5 блоків максимум, один головний. Обовʼязково додай FLOW_OPS.'},
    'тиждень':{ico:'trend',t:'Ретро тижня',ctx:['day','week','goals'],q:'Зроби ретро мого тижня: що працює, що зривається, один висновок',
      sys:'СКІЛ /тиждень: ретроспектива за 7 днів з контексту. Назви патерн зривів (день/тип блоків), одну сильну сторону і ОДНУ конкретну зміну на наступний тиждень.'},
    'розбір':{ico:'scan',t:'Чесний розбір',ctx:['day','week','goals'],q:'Зроби чесний розбір мого стану без лестощів',
      sys:'СКІЛ /розбір: чесний аналіз без пощади і без моралі. Де самообман, де реальний прогрес. Заверши одним питанням, яке людина уникає.'},
    'фінанси':{ico:'cash',t:'Фінанси',ctx:['fin','goals'],q:'Подивись на мої фінанси цього місяця і скажи, що не так і що зробити',
      sys:'СКІЛ /фінанси: аналіз грошей місяця з контексту. Головний витік, стан конвертів відносно цілей, одна конкретна дія з сумою.'},
    'проєкт':{ico:'folder',t:'Новий проєкт',ctx:['goals'],q:'Допоможи оформити новий проєкт: спитай одне-два уточнення, тоді створи папку-проєкт з дедлайном і доречними віджетами',
      sys:'СКІЛ /проєкт: людина хоче новий проєкт. Якщо ціль/тема ясна з контексту — одразу створи через folders з role:"project", доречним due і 1-3 віджетами. Якщо ні — постав одне коротке уточнення і зупинись. Не перевантажуй віджетами.'}
  };
  function aiSkillFor(q){
    if(q[0]!=='/') return null;
    const w=q.slice(1).split(/\s/)[0].toLowerCase();
    const k=Object.keys(AI_SKILLS).find(x=>x.startsWith(w)&&w);
    return k?{key:k,rest:q.slice(1+w.length).trim()}:null;
  }
  /* ── rolling summary: стара історія стискається, а не викидається ── */
  let aiSumBusy=false;
  async function aiMaybeSummarize(){
    if(aiSumBusy||aiChatMsgs.length<28) return;
    aiSumBusy=true;
    try{
      const old=aiChatMsgs.slice(0,aiChatMsgs.length-16);
      const dlg=old.map(m=>(m.role==='user'?'Я: ':'Флоу: ')+aiStreamText(m.content).slice(0,300)).join('\n');
      const s=await aiCall('Стисни діалог у резюме до 500 символів українською: факти про людину, рішення, домовленості, незакриті теми. Без води, без markdown. Якщо є попереднє резюме — обʼєднай.',
        [{role:'user',content:(aiSum?'ПОПЕРЕДНЄ РЕЗЮМЕ: '+aiSum+'\n\n':'')+'ДІАЛОГ:\n'+dlg}]);
      if(s){ aiSum=s.slice(0,1600); aiChatMsgs=aiChatMsgs.slice(-16); aiChatSave(); }
    }catch(e){ console.error('aiSum',e); }
    aiSumBusy=false;
  }
  async function aiChatSend(q){
    q=(q||'').trim(); if(!q&&!aiAttach.length) return; if(aiBusy) return;
    const inp=document.getElementById('aiInput'); if(inp){ inp.value=''; inp.placeholder='Напиши '+FLOW_PETS[petCur()].name+'…'; }
    aiSlashHide();
    let sk=aiSkillFor(q);
    if(!sk&&q[0]==='/'){ // мій промт через слеш
      const w=q.slice(1).split(/\s/)[0].toLowerCase();
      const cp=aiPrompts.find(p=>w&&p.name.toLowerCase().startsWith(w));
      if(cp){ q=cp.text; }
    }
    const att=aiAttach.splice(0,aiAttach.length); aiAttachRender();
    const shown=(sk?(sk.rest||AI_SKILLS[sk.key].q):q)||'Прочитай вкладення і скажи головне';
    const histShown=att.length?shown+' 📎 '+att.map(a=>a.name||'файл').join(', '):shown;
    aiChatMsgs.push({role:'user',content:histShown});
    aiBusy=true;
    const scrEl=document.getElementById('aiScr'); if(scrEl) scrEl.classList.add('busy');
    aiRenderBody();
    try{ window.platform.haptic('light'); }catch(_){}
    const m={role:'assistant',content:'',streaming:true};
    aiChatMsgs.push(m);
    let lastPaint=0;
    try{
      let sys=AI_CHAT_SYS+'\n\n'+petPersona();
      if(sk) sys+='\n\n'+AI_SKILLS[sk.key].sys;
      sys+='\n\nКОНТЕКСТ:\n'+aiCtx(sk?AI_SKILLS[sk.key].ctx:null);
      const msgs=aiChatMsgs.slice(-13,-1).map(x=>({role:x.role==='user'?'user':'assistant',content:x.content}));
      if(att.length){ // останнє user-повідомлення стає мультимодальним
        const blocks=[];
        att.forEach(a=>{
          if(a.kind==='image') blocks.push({type:'image',source:{type:'base64',media_type:a.media,data:a.data}});
          else if(a.kind==='pdf') blocks.push({type:'document',source:{type:'base64',media_type:'application/pdf',data:a.data}});
          else if(a.kind==='text') blocks.push({type:'text',text:'ФАЙЛ «'+(a.name||'txt')+'»:\n'+a.text});
        });
        blocks.push({type:'text',text:shown});
        msgs[msgs.length-1]={role:'user',content:blocks};
      }
      const onDelta=full=>{
        m.content=full;
        const now=Date.now(); if(now-lastPaint<90) return; lastPaint=now;
        const el=document.getElementById('aiStreamTxt');
        if(el){ el.innerHTML=aiBusyHTML(); const b=document.getElementById('aiChatBody'); if(b) b.scrollTop=b.scrollHeight; }
        else aiRenderBody();
      };
      let txt;
      if(aiAgentOn()){
        // стабільний шар (кешується) окремо від динамічного (персона+контекст)
        let sysStable, sysDyn;
        /* @dev-only:start replace="if(false){} else {" */
        if(aiDevOn()){
          sysStable=AI_DEV_SYS;
          sysDyn=aiDevCtx();
        } else {
        /* @dev-only:end */
          sysStable=AI_CHAT_SYS+AI_AGENT_ADDON;
          sysDyn=petPersona();
          if(sk) sysDyn+='\n\n'+AI_SKILLS[sk.key].sys;
          sysDyn+='\n\nКОНТЕКСТ:\n'+aiCtx(sk?AI_SKILLS[sk.key].ctx:null);
        }
        txt=await aiAgentTurn(sysStable,sysDyn,msgs,shown,onDelta);
      } else {
        txt=await aiCall(sys,msgs,onDelta);
      }
      m.content=txt||'…'; delete m.streaming;
      const pr=aiParseBlocks(m.content);
      if(pr.mem.length) aiMemAdd(pr.mem);
      aiSpeak(pr.text);
      if(aiAuto&&aiOpsCount(pr)){ aiCommit(pr); m.applied=true; }
    }catch(e){
      console.error('aiChat',e);
      /* Текст бачить людина, не розробник. Найчастіша причина — немає мережі,
         а не «поганий URL»; на native поле проксі взагалі приховане. */
      const off = (typeof navigator!=='undefined' && navigator.onLine===false);
      m.content = off
        ? '📡 Немає зв’язку. Планер, фінанси й нотатки працюють без інтернету — а я повернусь, щойно мережа з’явиться.'
        : (window.FLOW_NATIVE
            ? '⚠️ Не вдалось до мене достукатись. Спробуй ще раз за хвилину.'
            : '⚠️ Не вдалось: '+String(e.message||e)+'. Перевір URL AI-проксі.');
      delete m.streaming;
    }
    aiBusy=false;
    if(scrEl) scrEl.classList.remove('busy');
    aiChatSave(); aiRenderHead(); aiRenderBody();
    aiMaybeSummarize();
  }
  /* ── голос: MediaRecorder → воркер /transcribe → Whisper ── */
  let aiRec=null;
  function aiMicUI(on){ const b=document.getElementById('aiMic'); if(b) b.classList.toggle('rec',!!on); }
  async function aiMicToggle(){
    aiSpeakStop();
    if(aiRec){ try{ aiRec.stop(); }catch(_){} return; }
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){
      plToast('🎙 Мікрофон недоступний у цьому середовищі'); return;
    }
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mime=MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported('audio/mp4')?'audio/mp4'
        :(MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'');
      const chunks=[];
      aiRec=new MediaRecorder(stream, mime?{mimeType:mime}:undefined);
      aiRec.ondataavailable=e=>{ if(e.data&&e.data.size) chunks.push(e.data); };
      aiRec.onstop=async()=>{
        try{ stream.getTracks().forEach(t=>t.stop()); }catch(_){}
        const type=(aiRec&&aiRec.mimeType)||mime||'audio/mp4';
        aiRec=null; aiMicUI(false);
        const blob=new Blob(chunks,{type:type});
        if(blob.size<1200){ plToast('🎙 Занадто коротко — спробуй ще'); return; }
        await aiTranscribe(blob);
      };
      aiRec.start();
      aiMicUI(true);
      plToast('🎙 Говори… тапни мікрофон ще раз, щоб зупинити');
    }catch(e){
      console.error('aiMic',e); aiRec=null; aiMicUI(false);
      plToast(micDenyMsg());
    }
  }
  /* safety-stop: диктовка не має тихо писати у фоні, коли апку згорнули */
  document.addEventListener('visibilitychange',function(){
    if(document.hidden&&aiRec){
      try{ plToast('🎙 Диктовку зупинено — застосунок згорнуто'); }catch(_){}
      try{ aiRec.stop(); }catch(_){}
    }
  });
  // спільний розпізнавач: blob → текст (base64 JSON у воркер)
  try{ window.__flowTranscribe=aiTranscribeBlob; }catch(_){}
  async function aiTranscribeBlob(blob){
    try{
      plToast('⏳ Розпізнаю…');
      const url=aiEndpoint().replace(/\/+$/,'')+'/transcribe';
      const b64=await new Promise((res,rej)=>{
        const r=new FileReader();
        r.onload=()=>{ const s=String(r.result); res(s.slice(s.indexOf(',')+1)); };
        r.onerror=()=>rej(new Error('read'));
        r.readAsDataURL(blob);
      });
      const res=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({audio_b64:b64, mime:blob.type||''})});
      let j={}; try{ j=await res.json(); }catch(_){}
      if(!res.ok){ plToast('⚠️ Розпізнавання: '+((j&&j.error)||('HTTP '+res.status))+' — онови воркер'); return ''; }
      const t=(j&&j.text||'').trim();
      if(!t){ plToast('🎙 Не розчув — скажи чіткіше і трохи довше'); return ''; }
      return t;
    }catch(e){
      console.error('aiTranscribeBlob',e);
      plToast('⚠️ Транскрипція не вдалась: '+String(e.message||e));
      return '';
    }
  }
  async function aiTranscribe(blob){
    const t=await aiTranscribeBlob(blob);
    if(t){ const inp=document.getElementById('aiInput'); if(inp) inp.value=''; aiChatSend('🎙 '+t); }
  }
  window.aiChatSheet=aiChatSheet;

  function plStreak(){
    const p=plData();
    const hasDone=ds=>Array.isArray(p.blocksByDay[ds])&&p.blocksByDay[ds].some(b=>b.done);
    let n=hasDone(plTodayStr())?1:0;
    for(let i=1;i<=365;i++){ const d=new Date(); d.setDate(d.getDate()-i);
      if(hasDone(d.toISOString().slice(0,10))) n++; else break; }
    return n;
  }
  // найдовша серія за всю історію (не лише поточна) — для хіро-картки «Серія»
  function plBestStreak(){
    const p=plData();
    const days=Object.keys(p.blocksByDay||{})
      .filter(ds=>Array.isArray(p.blocksByDay[ds])&&p.blocksByDay[ds].some(b=>b.done)).sort();
    if(!days.length) return 0;
    let best=1, cur=1;
    for(let i=1;i<days.length;i++){
      const diff=Math.round((new Date(days[i])-new Date(days[i-1]))/86400000);
      cur = diff===1 ? cur+1 : 1;
      if(cur>best) best=cur;
    }
    return Math.max(best,plStreak());
  }
  // поточний тиждень (Пн→Нд), для смужки крапок на хіро-картці
  function plWeekDots(){
    const p=plData();
    const hasDone=ds=>Array.isArray(p.blocksByDay[ds])&&p.blocksByDay[ds].some(b=>b.done);
    const labels=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
    const today=new Date(); today.setHours(0,0,0,0);
    const dow=(today.getDay()+6)%7;
    const monday=new Date(today); monday.setDate(today.getDate()-dow);
    const out=[];
    for(let i=0;i<7;i++){
      const d=new Date(monday); d.setDate(monday.getDate()+i);
      out.push({ l:labels[i], on:hasDone(d.toISOString().slice(0,10)), future:d>today });
    }
    return out;
  }
  // ── хіро-картка Огляду: «Серія» замість статичного «12/100%» ──
  function heroMonthPct(){
    const now=new Date(), y=now.getFullYear(), m=now.getMonth(), daysElapsed=now.getDate();
    let filled=0;
    for(let d=1; d<=daysElapsed; d++){
      const ds=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      const hasDiary=!!(diaryEntries[ds]&&diaryEntries[ds].text&&diaryEntries[ds].text.trim());
      const hasWish=!!(typeof wishActiveDays!=='undefined'&&wishActiveDays[ds]);
      if(hasDiary||hasWish) filled++;
    }
    return { pct: daysElapsed?Math.round(filled/daysElapsed*100):0, filled, total:daysElapsed };
  }
  function heroDayWord(n){
    const n10=n%10, n100=n%100;
    if(n10===1&&n100!==11) return 'день';
    if(n10>=2&&n10<=4&&(n100<10||n100>=20)) return 'дні';
    return 'днів';
  }
  function renderHeroStreak(){
    try{
      const bigEl=document.getElementById('heroPctBig');
      const hintEl=document.getElementById('heroPctHint');
      const barEl=document.getElementById('heroBarFill');
      if(!bigEl||!hintEl||!barEl) return;
      const st=heroMonthPct();
      bigEl.innerHTML=st.pct+'<small>%</small>';
      hintEl.textContent = st.filled===0
        ? 'Ще нема даних цього місяця.'
        : st.filled+' з '+st.total+' '+heroDayWord(st.total)+' — хоч щось у Карті бажань чи Щоденнику';
      barEl.style.width=st.pct+'%';
    }catch(_){}
  }
  function plRolloverHTML(){
    const p=plData(); const td=plTodayStr();
    if((p.selDate||td)!==td) return '';
    if(p.rolloverDismissed===td) return '';
    const y=new Date(); y.setDate(y.getDate()-1); const yds=y.toISOString().slice(0,10);
    const yl=Array.isArray(p.blocksByDay[yds])?p.blocksByDay[yds]:[];
    const undone=yl.filter(b=>!b.done && !b.fromRecur && !b.rolled);
    if(!undone.length) return '';
    return `<div class="pl-rollover"><div>⏳ Учора лишилось <b>${undone.length}</b> — ${undone.slice(0,3).map(b=>'«'+esc(b.t)+'»').join(', ')}${undone.length>3?'…':''}</div>
      <div class="ro-b"><button class="pl-rook" data-plrook>→ Перенести на сьогодні</button><button class="pl-ronope" data-plronope>Пропустити</button></div></div>`;
  }

  function plDaySummaryHTML(){
    const p=plData();
    const ds=p.selDate||plTodayStr();
    const blocks=plBlocksFor(ds);
    const total=blocks.length, doneN=blocks.filter(b=>b.done).length;
    const pct=total?Math.round(doneN/total*100):0;
    // порахувати внески в екосистему з виконаних блоків
    let finSum=0, habitN=0, stepN=0;
    blocks.filter(b=>b.done && b.link).forEach(b=>{
      if(b.link.type==='fin') finSum+=(b.link.amount||0);
      else if(b.link.type==='habit') habitN++;
      else if(b.link.type==='goalstep') stepN++;
    });
    const f=plFocusToday(); const focusMin=Math.round((f.seconds||0)/60);
    let chips='';
    if(finSum>0) chips+=`<span class="pl-fchip fin">${plIco('income',11)} +${finSum}₴</span>`;
    if(habitN>0) chips+=`<span class="pl-fchip hab">${plIco('done',11)} ${habitN} звичк${habitN===1?'а':'и'}</span>`;
    if(stepN>0) chips+=`<span class="pl-fchip goal">${plIco('goal',11)} +${stepN} крок${stepN===1?'':'и'}</span>`;
    if(focusMin>0) chips+=`<span class="pl-fchip foc">${plIco('focus',11)} ${focusMin} хв фокус</span>`;
    const stk=plStreak(); if(stk>1) chips+=`<span class="pl-fchip foc">🔥 ${stk} дн. стрік</span>`;
    if(!chips) chips=`<span class="pl-fchip" style="opacity:.6">Виконуй блоки — тут з'явиться внесок у Флов</span>`;
    const open=!p.collapsed.sum;
    const meta=[]; if(stk>1) meta.push('🔥 '+stk+' дн'); if(focusMin>0) meta.push(focusMin+' хв фокус');
    const body=open?`<div class="pl-dtb"><div class="pl-dsflow" style="margin-top:0">${chips}</div>
      <button class="pl-weekbtn" data-plweek>📈 Тиждень — як іде і що зривається</button></div>`:'';
    return `<div class="pl-daythin ${open?'open':''}">
      <div class="pl-dth" data-plcoll="sum">
        <div class="pl-miniring" style="background:conic-gradient(var(--accent) ${pct}%,var(--card-2) 0)"><i></i></div>
        <b>${doneN}/${total}</b><span class="mt">${meta.length?'· '+meta.join(' · '):'· внесок дня у Флов'}</span>
        <span class="pl-cev">▾</span></div>
      ${body}</div>`;
  }

  // авто-пропозиції: Планер будує день з робіт, регулярних платежів, звичок
  function plAutoSuggestHTML(){
    const p=plData();
    const ds=p.selDate||plTodayStr();
    const existing=plBlocksFor(ds).map(b=>b.t.toLowerCase());
    const sugg=[];
    // регулярні платежі (з фінансів)
    try{
      if(typeof recurring!=='undefined' && Array.isArray(recurring)){
        recurring.slice(0,2).forEach(r=>{
          if(!existing.includes((r.name||'').toLowerCase()))
            sugg.push({ic:plIco('repeat',13),t:r.name||'Платіж',s:'регулярний · '+(r.amount||0)+'₴',c:'val',
              block:{t:r.name||'Платіж', h:12, endH:13, c:'fin', link:null}});
        });
      }
    }catch(_){}
    // звички з цілей (ціль зі щоденним трекером)
    try{
      (goalsData.goals||[]).slice(0,2).forEach(g=>{
        if(g.days && !existing.includes((g.name||'').toLowerCase())){
          sugg.push({ic:g.emoji||'💪',t:g.name||'Звичка',s:'звичка · щодня',c:'hab',
            block:{t:g.name||'Звичка', h:18, endH:19, c:'hab', link:{type:'habit',goalId:g.id||g.name,goalName:g.name}}});
        }
      });
    }catch(_){}
    // задачі тижня/місяця з дедлайном сьогодні — самі напрошуються в розклад
    try{
      p.tasks.filter(t=>!t.done && t.ddl===ds && (t.scope==='week'||t.scope==='month')).slice(0,3).forEach(t=>{
        if(!existing.includes((t.t||'').toLowerCase()))
          sugg.push({ic:plIco('calendar',13),t:t.t||'Задача',s:'дедлайн сьогодні',c:t.c||'val',
            block:{t:t.t||'Задача', h:p.dayStart, endH:Math.min(p.dayStart+1,p.dayEnd), c:t.c||'val', link:null, fromTask:t.id}});
      });
    }catch(_){}
    plData()._autoSugg=sugg;
    if(!sugg.length) return {html:'',n:0};
    const rows=sugg.map((s,i)=>`<div class="pl-auto pl-inrow" style="border-left-color:${PL_COL[s.c]||'#5b8def'}" data-plautoidx="${i}">
      <span class="pl-autoic">${s.ic}</span>
      <div class="pl-autox"><div class="pl-autot">${esc(s.t)}</div><div class="pl-autos">${esc(s.s)}</div></div>
      <button class="pl-autoadd" data-plautoidx="${i}">+</button></div>`).join('');
    return {html:rows,n:sugg.length};
  }

  // квартальні цілі-якорі: реальний прогрес + скільки задач сьогодні їх рухає
  function plQAnchorsHTML(){
    const goals=(goalsData.goals||[]);
    if(!goals.length){
      return `<div class="seclbl">${plIco('goal',13)} Цілі кварталу</div>
        <div class="pl-qempty" data-plqall>Ще нема цілей. Додай ціль — і бачитимеш, як день її рухає ›</div>`;
    }
    const p=plData();
    const cards=goals.slice(0,6).map(gl=>{
      const steps=gl.steps||[]; const sd=steps.filter(s=>s.done).length;
      const gp=steps.length?Math.round(sd/steps.length*100):(gl.progress||0);
      const cc=gl.color||'#5b8def';
      // скільки задач планера цього дня згадують цю ціль (за назвою в t.goal або t.tag)
      const nm=(gl.name||'').toLowerCase();
      const linked=p.tasks.filter(t=>t.scope==='day' && ((t.goal||'').toLowerCase().includes(nm) || (t.tag||'').toLowerCase().includes(nm))).length;
      const sub=linked?linked+' задач сьогодні ↓':(steps.length?sd+'/'+steps.length+' кроків':'ціль кварталу');
      return `<div class="pl-qa" style="--gc:${cc}" data-plqgoal="${esc(gl.id||gl.name||'')}">
        <div class="pl-qah"><div class="pl-qae" style="background:${cc}22">${gl.emoji||'🎯'}</div>
          <div class="pl-qan">${esc(gl.name||'Ціль')}</div><div class="pl-qap" style="color:${cc}">${gp}%</div></div>
        <div class="pl-qbar"><i style="width:${gp}%;background:${cc}"></i></div>
        <div class="pl-qm">${sub}</div></div>`;
    }).join('');
    return `<div class="seclbl" style="display:flex;justify-content:space-between;align-items:center">${plIco('goal',13)} Цілі кварталу<span class="pl-qmore" data-plqall>усі ›</span></div><div class="pl-qstrip">${cards}</div>`;
  }

  // тижневий календар: 7 днів навколо обраного, крапки = заплановані блоки
  function plWeekCalHTML(){
    const p=plData();
    const sel=p.selDate||plTodayStr();
    const today=plTodayStr();
    // тиждень (Пн-Нд) що містить обраний день
    const base=new Date(sel+'T12:00:00');
    const dow=(base.getDay()+6)%7;
    const monday=new Date(base); monday.setDate(base.getDate()-dow);
    const DOW=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
    let cells='';
    for(let i=0;i<7;i++){
      const d=new Date(monday); d.setDate(monday.getDate()+i);
      const ds=d.toISOString().slice(0,10);
      const blocks=Array.isArray(p.blocksByDay[ds])?p.blocksByDay[ds]:[];
      const cols=[...new Set(blocks.map(b=>PL_COL[b.c]||'#5b8def'))].slice(0,3);
      const dots=cols.map(c=>`<i style="background:${c}"></i>`).join('');
      cells+=`<div class="pl-cd ${ds===sel?'on':''} ${ds===today?'today':''}" data-plday="${ds}">
        <span class="cw">${DOW[i]}</span><span class="cn">${d.getDate()}</span>
        ${dots?`<span class="cdots">${dots}</span>`:''}</div>`;
    }
    return `<div class="pl-dayscroll">${cells}</div>`;
  }
  function plDayTitle(ds){
    const MON=['січ','лют','бер','кві','тра','чер','лип','сер','вер','жов','лис','гру'];
    if(ds===plTodayStr()) return 'Сьогодні';
    const tmr=new Date(); tmr.setDate(tmr.getDate()+1);
    if(ds===tmr.toISOString().slice(0,10)) return 'Завтра';
    const d=new Date(ds+'T12:00:00');
    const DOW=['Неділя','Понеділок','Вівторок','Середа','Четвер','П\u2019ятниця','Субота'];
    return `${DOW[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`;
  }

  // задача бек-логу → блок розкладу на обрану годину
  // ═══ Віджети плану в папці (📅 день / 🗓 місяць) ═══
  // блоки дня для читання: збережені + повторювані без мутації сховища
  function plBlocksDisplay(ds){
    const p=plData();
    const saved=Array.isArray(p.blocksByDay[ds])?p.blocksByDay[ds]:[];
    const skip=p.recurSkip[ds]||[];
    const extra=[];
    p.recurring.forEach(tpl=>{
      if(skip.includes(tpl.id)) return;
      if(!plRecurMatchesDay(tpl,ds)) return;
      if(saved.some(b=>b.fromRecur===tpl.id)) return;
      extra.push({id:'disp_'+tpl.id, h:tpl.h, endH:tpl.endH, t:tpl.t, c:tpl.c, link:tpl.link, tag:tpl.tag, folder:tpl.folder||'', fromRecur:tpl.id, done:false});
    });
    return saved.concat(extra);
  }
  function plFolderDayVal(key){
    const bs=plBlocksDisplay(plTodayStr()).filter(b=>b.folder===key);
    if(!bs.length) return '+';
    return bs.filter(b=>b.done).length+'/'+bs.length+' сьогодні';
  }
  function plFolderMonthVal(key){
    const ym=plTodayStr().slice(0,7);
    let n=0, hrs=0;
    plMonthWeeks(ym).flat().filter(Boolean).forEach(ds=>{
      plBlocksDisplay(ds).filter(b=>b.folder===key).forEach(b=>{ n++; hrs+=Math.max(0,plBlockEnd(b)-b.h); });
    });
    return n? n+' точок · '+Math.round(hrs)+' год' : '+';
  }
  // виконання блоку з контексту папки (завжди сьогодні)
  function plFolderComplete(id){
    const p=plData(); const old=p.selDate;
    p.selDate=plTodayStr();
    try{ plCompleteBlock(id); } finally { p.selDate=old; saveGoals(); }
  }
  const DOW_UA=['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
  function plRuleDowsLabel(tpl){
    const r=tpl.repeat||{};
    if(r.type==='daily') return 'щодня';
    if(r.type==='weekdays') return 'будні';
    if(r.type==='weekly') return 'щотижня · '+DOW_UA[new Date(tpl.startDate+'T12:00:00').getDay()];
    if(r.type==='custom') return (r.dows||[]).slice().sort((a,b)=>((a+6)%7)-((b+6)%7)).map(d=>DOW_UA[d]).join('·');
    return '';
  }
  // ── шторка «План на день» у папці ──
  function plFolderDaySheet(key){
    const f=folders[key]; if(!f) return;
    const p=plData();
    if(!p.fdayAll || typeof p.fdayAll!=='object') p.fdayAll={};
    const ov=document.createElement('div'); ov.className='pl-sheet-ov';
    ov.innerHTML=`<div class="pl-sheet"><div class="pl-sheet-grab"></div><div id="fpsBody"></div></div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    ov.addEventListener('click',(e)=>{ if(e.target===ov) close(); });
    function paint(){
      const td=plTodayStr();
      const showAll=!!p.fdayAll[key];
      const all=plBlocksFor(td).slice().sort((a,b)=>a.h-b.h);
      const rows=all.filter(b=>showAll||b.folder===key).map(b=>{
        const mine=b.folder===key;
        const cc=mine?(f.c||'#c77dff'):'var(--muted)';
        return `<div class="fps-row ${b.done?'done':''} ${mine?'':'dim'}">
          <span class="fps-tm">${plHM(b.h)}</span>
          <div class="fps-tx"><b>${esc(b.t)}</b><span>${plHM(b.h)}–${plHM(Math.min(plBlockEnd(b),24))}${b.fromRecur?' · 🔁':''}</span></div>
          ${mine?`<button class="fps-ck" data-fpsck="${b.id}" style="color:${cc}">${b.done?'✓':''}</button>`:''}</div>`;
      }).join('')||`<div class="fps-empty">Сьогодні точок ${showAll?'':'проєкту '}нема. Додай першу ↓</div>`;
      const rules=p.recurring.filter(t=>t.folder===key);
      const rulesHtml=rules.length?rules.map(t=>`<div class="fps-rule ${t.active===false?'off':''}">
        <b>${plRuleDowsLabel(t)}</b><span>${plHM(t.h)}–${plHM(Math.min(t.endH,24))} · ${esc(t.t)}</span>
        <button class="fps-ract" data-fpsract="${t.id}">${t.active===false?'▶':'⏸'}</button>
        <button class="fps-rdel" data-fpsrdel="${t.id}">✕</button></div>`).join('')
        :`<div class="fps-empty">Нема ритму. Створи точку з повтором (напр. Вт·Чт 19:00) — і вона сама з'являтиметься щотижня.</div>`;
      ov.querySelector('#fpsBody').innerHTML=`
        <div class="pl-sheet-h">${f.emoji||'📁'} ${esc(f.name)} · сьогодні</div>
        <div class="fps-toggle">
          <button class="${showAll?'':'on'}" data-fpsall="0">Тільки проєкт</button>
          <button class="${showAll?'on':''}" data-fpsall="1">Весь день</button>
        </div>
        ${rows}
        <button class="fps-add" data-fpsadd>＋ Точка проєкту (разова або з повтором)</button>
        <label class="pl-sheet-l" style="margin-top:14px">🔁 Ритм проєкту</label>
        ${rulesHtml}`;
      // bind
      ov.querySelectorAll('[data-fpsall]').forEach(b=>b.onclick=()=>{ p.fdayAll[key]=b.dataset.fpsall==='1'; saveGoals(); paint(); });
      ov.querySelectorAll('[data-fpsck]').forEach(b=>b.onclick=()=>{ plFolderComplete(b.dataset.fpsck); paint(); });
      ov.querySelectorAll('[data-fpsract]').forEach(b=>b.onclick=()=>{
        const t=p.recurring.find(x=>x.id===b.dataset.fpsract); if(t){ t.active=t.active===false?true:false; saveGoals(); paint(); } });
      ov.querySelectorAll('[data-fpsrdel]').forEach(b=>b.onclick=()=>{
        confirmSheet({title:'Видалити правило ритму?', sub:'Нові точки перестануть з\'являтись. Уже створені дні залишаться.', okLabel:'Видалити', onOk:()=>{
          const i=p.recurring.findIndex(x=>x.id===b.dataset.fpsrdel);
          if(i>=0) p.recurring.splice(i,1);
          saveGoals(); paint();
        }});
      });
      { const ad=ov.querySelector('[data-fpsadd]'); if(ad) ad.onclick=()=>{
        p.selDate=plTodayStr(); saveGoals(); close();
        plBlockSheet(null, null, {folder:key});
      }; }
    }
    paint();
  }
  // ── шторка «План на місяць» у папці ──
  function plFolderMonthSheet(key){
    const f=folders[key]; if(!f) return;
    const p=plData();
    let ym=plTodayStr().slice(0,7);
    const ov=document.createElement('div'); ov.className='pl-sheet-ov';
    ov.innerHTML=`<div class="pl-sheet"><div class="pl-sheet-grab"></div><div id="fpmBody"></div></div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    ov.addEventListener('click',(e)=>{ if(e.target===ov) close(); });
    function shift(d){ let [y,m]=ym.split('-').map(Number); m+=d; while(m<1){m+=12;y--;} while(m>12){m-=12;y++;} ym=y+'-'+String(m).padStart(2,'0'); }
    function paint(){
      const td=plTodayStr();
      const [y,m]=ym.split('-').map(Number);
      const weeks=plMonthWeeks(ym);
      let n=0, hrs=0;
      const byDs={};
      weeks.flat().filter(Boolean).forEach(ds=>{
        const bs=plBlocksDisplay(ds).filter(b=>b.folder===key);
        if(bs.length){ byDs[ds]=bs; bs.forEach(b=>{ n++; hrs+=Math.max(0,plBlockEnd(b)-b.h); }); }
      });
      const grid=weeks.map(w=>w.map(ds=>{
        if(!ds) return '<div></div>';
        const d=+ds.slice(8);
        return `<div class="fpm-dd ${byDs[ds]?'dot':''} ${ds===td?'today':''}" data-fpmday="${ds}" style="--fc:${f.c||'#c77dff'}">${d}</div>`;
      }).join('')).join('');
      // найближчі точки: від сьогодні, до 10 шт, у межах 45 днів
      const up=[];
      for(let i=0;i<45 && up.length<10;i++){
        const dt=new Date(); dt.setDate(dt.getDate()+i);
        const ds=ymdLocal(dt);
        plBlocksDisplay(ds).filter(b=>b.folder===key && !b.done).sort((a,b)=>a.h-b.h).forEach(b=>{
          if(up.length<10) up.push({ds,b});
        });
      }
      const upHtml=up.length?up.map(({ds,b})=>{
        const d=new Date(ds+'T12:00:00');
        const dl=ds===td?'Сьогодні':DOW_UA[d.getDay()]+' '+d.getDate();
        return `<div class="fps-row" style="cursor:pointer" data-fpmgo="${ds}">
          <span class="fps-tm">${dl}</span>
          <div class="fps-tx"><b>${esc(b.t)}</b><span>${plHM(b.h)}–${plHM(Math.min(plBlockEnd(b),24))}${b.fromRecur?' · 🔁':''}</span></div></div>`;
      }).join(''):`<div class="fps-empty">Найближчих точок нема</div>`;
      ov.querySelector('#fpmBody').innerHTML=`
        <div class="pl-sheet-h">${f.emoji||'📁'} ${esc(f.name)} · ${PL_MONTH_NAMES[m-1]} ${y}</div>
        <div class="fpm-sub">${n} точок · ${Math.round(hrs)} год за місяць</div>
        <div class="fpm-nav"><button data-fpmnav="-1">‹</button><button data-fpmnav="1">›</button></div>
        <div class="fpm-grid">${DOW_UA.slice(1).concat(DOW_UA[0]).map(l=>`<div class="fpm-dw">${l}</div>`).join('')}${grid}</div>
        <label class="pl-sheet-l" style="margin-top:12px">Найближчі точки</label>
        ${upHtml}
        <button class="fps-add" data-fpsadd>＋ Точка проєкту</button>`;
      ov.querySelectorAll('[data-fpmnav]').forEach(b=>b.onclick=()=>{ shift(+b.dataset.fpmnav); paint(); });
      ov.querySelectorAll('[data-fpmday]').forEach(b=>b.onclick=()=>{
        p.selDate=b.dataset.fpmday; p.scope='day'; saveGoals(); close(); goPlanner();
      });
      ov.querySelectorAll('[data-fpmgo]').forEach(b=>b.onclick=()=>{
        p.selDate=b.dataset.fpmgo; p.scope='day'; saveGoals(); close(); goPlanner();
      });
      { const ad=ov.querySelector('[data-fpsadd]'); if(ad) ad.onclick=()=>{
        p.selDate=plTodayStr(); saveGoals(); close();
        plBlockSheet(null, null, {folder:key});
      }; }
    }
    paint();
  }

  // ═══ Квадрати «важливо/терміново» (матриця Ейзенхауера) ═══
  const PL_MXQ=[['q1','🔥 Важливо + терміново'],['q2','🎯 Важливо'],['q3','⚡ Терміново'],['q4','💤 Потім']];
  function plMatrixHTML(){
    const p=plData();
    const open=!p.collapsed.mx;
    const undone=PL_MXQ.reduce((n,[k])=>n+(p.matrix[k]||[]).filter(i=>!i.done).length,0);
    const anyDone=PL_MXQ.some(([k])=>(p.matrix[k]||[]).some(i=>i.done));
    let inner='';
    if(open){
      const cells=PL_MXQ.map(([k,lbl])=>{
        const items=(p.matrix[k]||[]).map(it=>`<div class="pl-mxit ${it.done?'done':''} ${it.sch?'issch':''}">
          <span data-mxdone="${k}|${it.id}">${esc(it.t)}</span>
          ${it.done?'':`<button class="sch" data-mxsch="${k}|${it.id}" title="У розклад">📅</button>`}</div>`).join('');
        return `<div class="pl-mq ${k}"><h5>${lbl}</h5><button class="pl-mqadd" data-mxadd="${k}">＋</button>${items||'<div class="pl-mxempty">—</div>'}</div>`;
      }).join('');
      const clearBtn=anyDone?`<button class="pl-mxclear" data-mxclear>Прибрати виконані</button>`:'';
      inner=`<div class="pl-mx">${cells}</div>${clearBtn}`;
    }
    return `<div class="seclbl" data-plcoll="mx" style="cursor:pointer">⬛ Квадрати · що важливе${undone?` (${undone})`:''}<span class="pl-cev" style="margin-left:auto">${open?'▴':'▾'}</span></div>${inner}`;
  }
  // запис із квадрата → блок у розклад (з діалогом часу)
  function plMxSchedule(k,id){
    const p=plData();
    const it=(p.matrix[k]||[]).find(x=>x.id===id); if(!it) return;
    const ds=p.selDate||plTodayStr();
    const list=plBlocksFor(ds);
    const H0=p.dayStart, H1=p.dayEnd;
    const col=k==='q1'?'fin':(k==='q2'?'val':(k==='q3'?'gold':'skl'));
    const nb={id:'b_'+Date.now(), h:H0, endH:Math.min(H0+1,H1), t:it.t, c:col, tag:'', fromMx:k+'|'+id};
    list.push(nb); it.sch=true; saveGoals();
    plRerender();
    plBlockSheet(nb.id, null);
  }

  // задача бек-логу → блок розкладу (через повний діалог з-до)
  function plSlotTask(taskId){
    const p=plData();
    const t=p.tasks.find(x=>x.id===taskId); if(!t) return;
    const ds=p.selDate||plTodayStr();
    const list=plBlocksFor(ds);
    const H0=p.dayStart, H1=p.dayEnd;
    // створюємо блок з задачі й одразу відкриваємо його на редагування часу
    const nb={id:'b_'+Date.now(), h:H0, endH:Math.min(H0+1,H1), t:t.t, c:t.c||'val', tag:t.tag||t.goal||'', fromTask:t.id};
    list.push(nb); t.slotted=true; saveGoals();
    plRerender();
    plBlockSheet(nb.id, null);
  }

  // бек-лог: задачі дня, які ще не поставлені в розклад (тап → обрати годину)
  function plBacklogHTML(){
    const p=plData();
    const dayTasks=p.tasks.filter(t=>t.scope==='day' && !t.done && !t.slotted);
    const rows=dayTasks.slice(0,12).map(t=>{
      const cc=PL_COL[t.c]||'#5b8def';
      const tag=t.tag||t.goal||'';
      return `<div class="pl-auto pl-inrow" style="border-left-color:${cc}" data-plslot="${t.id}">
        <span class="pl-autoic">📋</span>
        <div class="pl-autox"><div class="pl-autot">${esc(t.t)}</div><div class="pl-autos">${tag?esc(tag)+' · ':''}тапни → у розклад</div></div>
        <button class="pl-autoadd">📅</button></div>`;
    }).join('');
    return {html:rows,n:dayTasks.length};
  }

  // «Вхідні»: пропозиції планера + задачі-беклог в одному згортаному блоці
  function plInboxHTML(){
    const p=plData();
    const a=plAutoSuggestHTML(), b=plBacklogHTML();
    const n=a.n+b.n;
    const open=!p.collapsed.inbox;
    const addRow=`<div class="pl-auto pl-inrow pl-inadd" data-plintask>
      <span class="pl-autoic">＋</span>
      <div class="pl-autox"><div class="pl-autot">Нова задача</div><div class="pl-autos">без часу — впаде сюди, потім поставиш у розклад</div></div></div>`;
    const bodyRows=n?(a.html+b.html):`<div class="pl-inempty">Порожньо. Тут з'являться пропозиції зі звичок, платежів і дедлайнів — і задачі без часу.</div>`;
    return `<div class="pl-coll ${open?'open':''}">
      <div class="pl-collh" data-plcoll="inbox"><span>📥</span><b>Вхідні</b>${n?`<span class="pl-cnt">${n}</span>`:''}<span class="pl-cev">▾</span></div>
      <div class="pl-collb">${bodyRows}${addRow}</div></div>`;
  }

  // нормалізує блок: гарантує h та endH (мігрує старий span)
  function plBlockEnd(b){ if(typeof b.endH==='number') return b.endH; return b.h+(b.span||1); }
  function plDayHTML(){
    const p=plData();
    const ds=p.selDate||plTodayStr();
    const blocks=plBlocksFor(ds).slice().sort((a,b)=>a.h-b.h);
    const isToday=ds===plTodayStr();
    const now=new Date(); const nowDec=now.getHours()+now.getMinutes()/60; const nowH=Math.floor(nowDec);
    const H0=p.dayStart, H1=p.dayEnd;
    const expanded=!!p._expandHours; // режим повного 24г-сітки

    // накладання: позначаємо всі блоки, що перетинаються з іншим блоком цього дня
    const overlapIds=new Set();
    blocks.forEach((a,i)=>{ blocks.forEach((c,j)=>{ if(i===j) return;
      if(a.h<plBlockEnd(c) && plBlockEnd(a)>c.h){ overlapIds.add(a.id); overlapIds.add(c.id); } }); });

    function blockHTML(b){
      const cc=PL_COL[b.c]||'#5b8def';
      const rgb=PL_RGB[b.c]||'91,141,239';
      const rawEnd=plBlockEnd(b);
      const eh=Math.min(rawEnd,24);
      const overnight=rawEnd>24;
      const doneCls=b.done?' pl-blk-done':'';
      const isConf=overlapIds.has(b.id);
      const expanded=sessionStorage.getItem('plexp_'+b.id)==='1';

      // ── кнопка дії ──
      let actBtn;
      if(b.done) actBtn=`<button class="pl-blk-btn pl-blk-undo" data-plcomplete="${b.id}">✓ Виконано</button>`;
      else if(b.link && b.link.type==='fin') actBtn=`<button class="pl-blk-btn pl-blk-fin-btn2" data-plcomplete="${b.id}">💰</button>`;
      else if(b.link && (b.link.type==='habit'||b.link.type==='goalstep')) actBtn=`<button class="pl-blk-btn pl-blk-done-b" data-plcomplete="${b.id}">✓</button>`;
      else actBtn=`<button class="pl-blk-btn pl-blk-plain" data-plcomplete="${b.id}">✓</button>`;

      const nowMark=(isToday && nowDec>=b.h && nowDec<eh)?`<span class="pl-blk-now">● зараз</span>`:'';
      const missed=(isToday && !b.done && !b.micro && eh<=nowDec);
      const endLabel=overnight?'→'+plHM(rawEnd-24)+' (наст.)':plHM(eh);
      const durLabel=plDurLabel(b.h, rawEnd>24?rawEnd:eh);

      // ── чіпи зверху ──
      let topChips='';
      if(overnight) topChips+=`<span class="v2-chip repeat">🌙 через північ</span>`;
      if(b.fromRecur) topChips+=`<span class="v2-chip repeat">${plIco('repeat')}${esc(b.repeatLabel||'повтор')}</span>`;
      if(isConf) topChips+=`<span class="v2-chip conf">${plIco('warn')}накладання</span>`;
      if(b.remindAt && !b.done){
        const rd=new Date(b.remindAt);
        topChips+=`<span class="v2-chip remind">${plIco('remind')}${('0'+rd.getHours()).slice(-2)}:${('0'+rd.getMinutes()).slice(-2)}</span>`;
      }

      // ── зв'язки ──
      let linksHtml='';
      if(b.link && b.link.goalId){
        linksHtml+=`<span class="pl-blk-link-chip goal">🎯 ${esc(b.link.goalName||'Ціль')}</span>`;
      }
      if(b.folder && typeof folders!=='undefined' && folders[b.folder]){
        const f=folders[b.folder];
        linksHtml+=`<span class="pl-blk-link-chip folder" data-plgofolder="${esc(b.folder)}">${f.emoji||'📁'} ${esc(f.name||'Папка')}</span>`;
      }
      if(b.tag) linksHtml+=`<span class="pl-blk-link-chip">#${esc(b.tag)}</span>`;
      if(b.link && b.link.type==='fin') linksHtml+=`<span class="pl-blk-link-chip fin">💰 ${esc(b.link.envName||'Фінанси')}</span>`;
      if(b.fromRecur) linksHtml+=`<span class="pl-blk-link-chip">🔒 шаблон</span>`;

      // ── підпункти ──
      const subs=Array.isArray(b.subtasks)?b.subtasks:[];
      const doneCount=subs.filter(s=>s.done).length;
      const subPct=subs.length?Math.round(doneCount/subs.length*100):0;
      const circ=2*Math.PI*18; // r=18
      const dash=circ*(subPct/100);
      const ringHtml=`<div class="pl-blk-ring">
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="4"/>
          <circle cx="24" cy="24" r="18" fill="none" stroke="${cc}" stroke-width="4"
            stroke-dasharray="${dash.toFixed(1)} ${(circ-dash).toFixed(1)}" stroke-linecap="round"/>
        </svg>
        <div class="pl-blk-ring-txt">${subPct}%</div>
      </div>`;
      const subsListHtml=subs.map((s,si)=>`
        <div class="pl-blk-sub${s.done?' sdone':''}" data-plsubck="${b.id}_${si}">
          <div class="pl-blk-sub-cb${s.done?' on':''}">${s.done?'✓':''}</div>
          <span>${esc(s.text||s.t||'')}</span>
        </div>`).join('');

      // ── фінанси (якщо є) ──
      let finHtml='';
      if(b.link && b.link.type==='fin'){
        const amt=b.link.amount||0; const neg=amt<0;
        const envName=b.link.envName||'Конверт';
        const envBudget=b.link.envBudget||0; const envUsed=b.link.envUsed||0;
        const pct=envBudget>0?Math.min(100,Math.round(envUsed/envBudget*100)):0;
        finHtml=`<div>
          <div class="pl-blk-sec-lbl">Фінанси</div>
          <div class="pl-blk-fin">
            <div class="pl-blk-fin-h">
              <span>💰 ${esc(envName)}</span>
              <strong class="${neg?'neg':''}">${neg?'−':'+'}${Math.abs(amt).toLocaleString()} ₴</strong>
            </div>
            ${envBudget>0?`<div class="pl-blk-fin-bar"><div class="pl-blk-fin-fill" style="width:${pct}%"></div></div>
            <div class="pl-blk-fin-meta"><span>Витрачено: ${envUsed.toLocaleString()} ₴</span><span>план ${envBudget.toLocaleString()} ₴</span></div>`:''}
            ${!b.done?`<button class="pl-blk-fin-btn" data-plcomplete="${b.id}">💰 Зарахувати у конверт</button>`:''}
          </div>
        </div>`;
      }

      // ── статистика (тільки для шаблонів) ──
      let statsHtml='';
      if(b.fromRecur){
        const recId=b.fromRecur;
        const ym=p.calMonth||plTodayStr().slice(0,7);
        const [sy,sm]=ym.split('-').map(Number);
        const daysInM=new Date(sy,sm,0).getDate();
        let cnt=0;
        for(let d=1;d<=daysInM;d++){
          const ds=sy+'-'+String(sm).padStart(2,'0')+'-'+String(d).padStart(2,'0');
          if(plRecurMatchesDay(p.recurring.find(t=>t.id===recId),ds)) cnt++;
        }
        const durH=eh-b.h;
        statsHtml=`<div>
          <div class="pl-blk-sec-lbl">Статистика шаблону</div>
          <div class="pl-blk-meta">
            <div class="pl-blk-meta-pill"><strong>${durH}г</strong><span>за раз</span></div>
            <div class="pl-blk-meta-pill"><strong>${cnt}</strong><span>днів/міс</span></div>
            <div class="pl-blk-meta-pill"><strong>${durH*cnt}г</strong><span>у місяць</span></div>
          </div>
        </div>`;
      }

      // ── зібрати detail секцію ──
      let detailHtml='';
      if(expanded){
        detailHtml=`<div class="pl-blk-detail">
          ${linksHtml?`<div><div class="pl-blk-sec-lbl">Зв'язки</div><div class="pl-blk-links">${linksHtml}</div></div>`:''}
          ${subs.length?`<div>
            <div class="pl-blk-sec-lbl">Підпункти · ${doneCount}/${subs.length}</div>
            <div class="pl-blk-prog-row">${ringHtml}<div class="pl-blk-subs">${subsListHtml}
              <button class="pl-blk-add-sub" data-pladdsub="${b.id}">+ додати підпункт</button>
            </div></div>
          </div>`:`<div>
            <div class="pl-blk-sec-lbl">Підпункти</div>
            <button class="pl-blk-add-sub" data-pladdsub="${b.id}">+ додати перший підпункт</button>
          </div>`}
          ${finHtml}
          ${statsHtml}
        </div>`;
      }

      return `<div class="pl-flowrow">
        <span class="pl-flowh">${plHM(b.h)}</span>
        <div class="pl-flowblk${doneCls}" style="border-left-color:${isConf?'var(--owe)':cc};background:linear-gradient(180deg,rgba(${rgb},.13),rgba(${rgb},.04));${expanded?'':'min-height:'+Math.min(150,Math.round(52+(Math.max(.5,(rawEnd>24?24:eh)-b.h)-1)*22))+'px'}" data-plblk="${b.id}">
          <div class="pl-blk-top">
            <div class="pl-blk-txt" style="cursor:pointer">
              <h5>${esc(b.t)} ${nowMark}</h5>
              <p>${plHM(b.h)}–${endLabel} · ${durLabel} · <span style="color:var(--accent2)">✎ редаг.</span></p>
            </div>
            <div style="display:flex;gap:4px;align-items:center;flex-shrink:0">
              ${actBtn}
              <button class="pl-blk-expand-btn" data-plblkexp="${b.id}" title="${expanded?'Згорнути':'Розгорнути'}">${expanded?'▲':'▼'}</button>
            </div>
          </div>
          ${topChips?`<div class="v2-chips" style="margin-top:7px">${topChips}</div>`:''}
          ${missed?`<div class="pl-blk-miss"><span>Пропущено — не нуль:</span><button class="pl-blk-micro-btn" data-plmicro="${b.id}">⚡ 15 хв зараз</button></div>`:''}
          ${b.micro&&!b.done?`<div class="v2-chips" style="margin-top:7px"><span class="v2-chip repeat">⚡ мікроверсія</span></div>`:''}
          ${!expanded && linksHtml?`<div class="pl-blk-links" style="margin-top:8px">${linksHtml}</div>`:''}
          ${detailHtml}
        </div></div>`;
    }

    let rows='';
    if(expanded){
      // повна 24г-сітка (для точного вибору години)
      let h=0;
      while(h<24){
        const b=blocks.find(x=>Math.floor(x.h)===h);
        if(b){ rows+=blockHTML(b); h=Math.max(h+1,Math.floor(plBlockEnd(b))); }
        else {
          const nowMark=(isToday && h===nowH)?`<div class="pl-now-flow"></div>`:'';
          rows+=`<div class="pl-flowrow"><span class="pl-flowh">${(h<10?'0':'')+h}:00</span><div class="pl-flowempty" data-pladdh="${h}">${nowMark}+ ${(h<10?'0':'')+h}:00</div></div>`;
          h++;
        }
      }
    } else if(blocks.length){
      // тільки заплановані блоки + тонкий роздільник для вставки між ними
      let nowInserted=!isToday || nowDec<H0 || nowDec>H1;
      blocks.forEach((b,i)=>{
        if(!nowInserted && nowDec<b.h){ rows+=plNowLineHTML(); nowInserted=true; }
        rows+=blockHTML(b);
        const eh=Math.min(plBlockEnd(b),24);
        if(!nowInserted && nowDec>=b.h && nowDec<eh) nowInserted=true; // всередині блока — мітка «● зараз» уже є
        const next=blocks[i+1];
        const gapFrom=eh, gapTo=next?next.h:H1;
        if(gapTo>gapFrom){
          if(!nowInserted && nowDec>=gapFrom && nowDec<gapTo){ rows+=plNowLineHTML(); nowInserted=true; }
          rows+=`<div class="pl-gap" data-pladdh="${Math.floor(gapFrom)}">+ ${plHM(gapFrom)} · ${plDurLabel(gapFrom,gapTo)} вільно</div>`;
        }
      });
      if(!nowInserted) rows+=plNowLineHTML();
      // роздільник перед першим блоком (якщо він пізніше старту дня)
      if(blocks[0].h>H0){
        rows=`<div class="pl-gap" data-pladdh="${H0}">+ додати о ${(H0<10?'0':'')+H0}:00</div>`+rows;
      }
    } else {
      // нема блоків — заклик додати
      rows=`<div class="pl-flowempty pl-flowempty-big" data-pladdh="${H0}">Порожньо. Тапни, щоб додати перший блок о ${(H0<10?'0':'')+H0}:00</div>`;
    }

    const toggleLbl=expanded?'▲ Показати тільки заплановане':'▼ Розгорнути всі 24 години';
    const toggleBtn=`<button class="pl-clearold" data-plexpand style="margin-top:10px">${toggleLbl}</button>`;
    const clearBtn=blocks.length?`<button class="pl-clearold" data-plclearday style="margin-top:8px">${plIco('trash',12)} Очистити розклад цього дня (${blocks.length})</button>`:'';
    const rangeBtn=`<button class="pl-clearold" data-plrange style="margin-top:8px">${plIco('clock',12)} Діапазон дня: ${(H0<10?'0':'')+H0}:00–${(H1<10?'0':'')+H1}:00 (змінити)</button>`;
    const addBtn=`<button class="pl-addblock" data-pladdh="${H0}">＋ Додати блок часу</button>`;
    return `<div class="seclbl">${plIco('clock',13)} Розклад · весь Флов у блоках</div><div class="pl-flow">${rows}</div>${addBtn}${toggleBtn}${clearBtn}${rangeBtn}`;
  }

  function plTaskCard(t){
    const prio=t.p?`<span class="pl-prio" style="background:${PL_PRIO[t.p]}">P${t.p}</span>`:'';
    const cc=PL_COL[t.c]||'#5b8def';
    const meta=[];
    if(t.tag) meta.push(`<span class="pl-tag" style="background:rgba(${PL_RGB[t.c]||'91,141,239'},.18);color:${cc}">${esc(t.tag)}</span>`);
    if(t.ddl) meta.push(`<span class="pl-ddl">📅 ${esc(t.ddl)}</span>`);
    if(t.goal) meta.push(`<span class="pl-lk">🎯 ${esc(t.goal)}</span>`);
    const subs=t.subs||[]; const sd=subs.filter(s=>s.d).length;
    let subsHtml='';
    if(subs.length){
      subsHtml=`<div class="pl-subs"><div class="pl-subprog">Підзадачі · ${sd}/${subs.length}</div><div class="pl-subin">`+
        subs.map((s,i)=>`<div class="pl-sub ${s.d?'sdone':''}" data-plsub="${t.id}|${i}"><div class="pl-sc">${s.d?'✓':''}</div><span>${esc(s.t)}</span></div>`).join('')+
        `</div></div>`;
    }
    const exp=subs.length?`<span class="pl-exp" data-pltoggle="${t.id}">${t.open?'▾':'▸'}</span>`:`<span class="pl-exp" data-pldel="${t.id}" style="opacity:.4">×</span>`;
    return `<div class="pl-tcard ${t.done?'done':''} ${t.open?'open':''}">
      <div class="pl-trow">
        <div class="pl-tcheck" data-plcheck="${t.id}">${t.done?'✓':''}</div>
        <div class="pl-ttx"><h5>${prio}${esc(t.t)}</h5>${meta.length?`<div class="pl-meta">${meta.join('')}</div>`:''}</div>
        ${exp}
      </div>${subsHtml}</div>`;
  }

  function plAdd(){
    const p=plData();
    if(p.scope==='quarter'){
      // делегуємо на створення цілі
      const nb=document.getElementById('gNewGoal');
      inputModal({title:'Нова ціль', placeholder:'Назва цілі', emoji:true, emojiVal:'🎯', onOk:(name,emojiVal)=>{
        if(!name) return;
        const colors=['#5b8def','#34c77b','#e8843c','#c77dff','#f0b429','#4ecdc4'];
        goalsData.goals.push({ id:'g_'+Date.now(), name, emoji:(emojiVal!==undefined?emojiVal:'🎯'),
          color:colors[goalsData.goals.length%colors.length], steps:[], track:{}, open:true });
        saveGoals(); plRerender();
      }});
      return;
    }
    if(p.scope==='day'){
      plAddBlockAt(9);
      return;
    }
    inputModal({title:'Нова задача', placeholder:'Назва задачі', onOk:(v)=>{
      if(!v) return;
      const cols=['val','hab','fin','skl','cyan','gold'];
      p.tasks.push({id:'t_'+Date.now(), scope:p.scope, t:v, c:cols[p.tasks.length%cols.length], p:2, tag:'', done:false, open:false, subs:[]});
      saveGoals(); plRerender();
    }});
  }

  // додати блок часу — відкриває повний діалог з вибором з/до
  function plAddBlockAt(hour){
    const p=plData();
    plBlockSheet(null, hour);
  }
  // текст-чип зі структурованого зв'язку блоку
  function plLinkTag(link){
    if(!link||!link.type) return '';
    if(link.type==='fin') return '💰 +'+(link.amount||0)+' ₴ → '+(link.envName||'конверт');
    if(link.type==='habit') return '✅ '+(link.goalName||'звичка');
    if(link.type==='goalstep') return '🎯 '+(link.goalName||'ціль');
    return '';
  }
  // ЛАНЦЮГ: крок цілі → блок сьогодні на першу вільну годину
  function plScheduleStep(gl,st){
    const p=plData(); const ds=plTodayStr();
    const list=plBlocksFor(ds);
    const dup=list.find(b=>!b.done && b.link && b.link.type==='goalstep' && b.link.stepId===st.id);
    if(dup){ plToast('📅 Уже в плані сьогодні о '+plHM(dup.h)); return; }
    const now=new Date();
    let h=Math.max(p.dayStart, now.getHours()+1);
    const busy=hh=>list.some(b=>!b.done && hh<plBlockEnd(b) && hh+1>b.h);
    while(h<p.dayEnd-1 && busy(h)) h++;
    h=Math.min(h, Math.max(p.dayStart, p.dayEnd-1));
    list.push({ id:'b_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), h:h, endH:h+1,
      t:st.name, done:false, tag:'', folder:gl.folder||'',
      link:{type:'goalstep', goalId:(gl.id||gl.name), goalName:gl.name, stepId:st.id} });
    saveGoals(); try{ window.platform.haptic('light'); }catch(_){}
    plToast('📅 «'+st.name+'» → сьогодні '+plHM(h));
  }
  // АНТИ-НУЛЬ: пропущений блок стискається до 15 хв від «зараз»
  function plMicroBlock(blockId){
    const p=plData(); const ds=p.selDate||plTodayStr();
    const list=plBlocksFor(ds);
    const b=list.find(x=>x.id===blockId); if(!b||b.done) return;
    const now=new Date(); const nd=now.getHours()+now.getMinutes()/60;
    b.h=Math.max(0, Math.min(23.75, Math.round(nd*12)/12));
    b.endH=Math.min(24, b.h+0.25);
    b.micro=true;
    saveGoals(); try{ window.platform.haptic('light'); }catch(_){}
    plRerender();
    plToast('⚡ 15 хв зараз — виконай, і день не нуль');
  }
  // ЯДРО: завершення блоку пише в модуль (дохід/звичка/крок цілі)
  function plCompleteBlock(blockId){
    const p=plData();
    const ds=p.selDate||plTodayStr();
    const list=plBlocksFor(ds);
    const b=list.find(x=>x.id===blockId); if(!b) return;
    if(b.done){ // зняти виконання (ідемпотентно, без подвійного запису)
      b.done=false; plUncompleteEffects(b,ds); saveGoals(); plRerender(); plToast('↩ Виконання знято'); return;
    }
    b.done=true;
    if(b.fromMx){ try{ const sep=b.fromMx.indexOf('|'); const mk=b.fromMx.slice(0,sep), mid=b.fromMx.slice(sep+1);
      const mit=(p.matrix[mk]||[]).find(x=>x.id===mid); if(mit) mit.done=true; }catch(_){} }
    if(reminderTimers['pl_'+b.id]){ clearTimeout(reminderTimers['pl_'+b.id]); delete reminderTimers['pl_'+b.id]; }
    let msg='✓ Виконано';
    const link=b.link;
    try{
      if(link && link.type==='fin' && link.envId && link.amount>0){
        const e=(envelopes||[]).find(x=>x.id===link.envId);
        if(e){ envAddOp(e,'in',link.amount, b.t||'Дохід із блоку'); msg='💰 +'+link.amount+' ₴ у «'+e.name+'»'; }
      } else if(link && (link.type==='habit'||link.type==='goalstep') && link.goalId){
        const g=(goalsData.goals||[]).find(x=>(x.id||x.name)===link.goalId);
        if(g){
          if(link.type==='habit'){
            // відмітити день звички: додати виконаний пункт у days[ds] і синхронізувати
            if(!g.days) g.days={};
            if(!Array.isArray(g.days[ds])) g.days[ds]=[];
            g.days[ds].push({id:'dg_'+Date.now(), name:b.t||'Блок виконано', done:true, fromBlock:b.id});
            try{ if(typeof dgSync==='function') dgSync(g,ds,plTodayStr()); }catch(_){}
            msg='✅ Звичка «'+(g.name||'')+'» відмічена';
          } else {
            if(!g.steps) g.steps=[];
            const exSt=b.link.stepId ? g.steps.find(s=>s.id===b.link.stepId) : null;
            if(exSt){ exSt.done=true; msg='🎯 Крок «'+(exSt.name||'')+'» виконано'; }
            else {
              g.steps.push({id:'st_blk_'+Date.now(), name:'⏱ '+(b.t||'Блок')+' · '+ds, done:true, fromBlock:b.id});
              msg='🎯 +1 крок до «'+(g.name||'')+'»';
            }
          }
        }
      }
    }catch(err){ console.error('plCompleteBlock',err); }
    saveGoals(); try{ if(typeof saveEnvelopes==='function') saveEnvelopes(); }catch(_){}
    try{ window.platform.haptic('medium'); }catch(_){}
    plRerender();
    plToast(msg);
    // жива реакція по суті виконаного
    try{
      let rk='done';
      if(link&&link.type==='fin') rk='income';
      else if(link&&link.type==='goalstep') rk='goal';
      const stk=plStreak();
      if(stk>=3 && stk%3===0) rk='streak';   // кожні 3 дні серії — вогонь
      flowReact(rk,{sayChance:.5});
    }catch(_){}
  }
  // ефект скасування виконання блоку прибирає записані сліди
  function plUncompleteEffects(b,ds){
    if(!b||!b.link) return;
    const g=(goalsData.goals||[]).find(x=>(x.id||x.name)===b.link.goalId);
    if(g){
      if(b.link.type==='habit' && g.days && Array.isArray(g.days[ds])){
        g.days[ds]=g.days[ds].filter(it=>it.fromBlock!==b.id);
        try{ if(typeof dgSync==='function') dgSync(g,ds,plTodayStr()); }catch(_){}
      }
      if(b.link.type==='goalstep' && g.steps){
        if(b.link.stepId){ const exSt=g.steps.find(s=>s.id===b.link.stepId); if(exSt) exSt.done=false; }
        g.steps=g.steps.filter(s=>s.fromBlock!==b.id);
      }
    }
  }
  // легкий тост планера
  try{ window.__flowToast=plToast; }catch(_){}
  function plToast(msg){
    let t=document.getElementById('plToast');
    if(!t){ t=document.createElement('div'); t.id='plToast'; t.className='pl-toast'; document.body.appendChild(t); }
    t.textContent=msg; t.classList.add('show');
    clearTimeout(window.__plToastT); window.__plToastT=setTimeout(()=>t.classList.remove('show'),2400);
  }

  // повний діалог блоку: назва + з/до + зв'язок з ціллю
  function plBlockSheet(existingId, defaultHour, preset){
    const p=plData();
    const ds=p.selDate||plTodayStr();
    const list=plBlocksFor(ds);
    const b = existingId ? list.find(x=>x.id===existingId) : null;
    const H0=p.dayStart, H1=p.dayEnd;
    const startVal = b ? b.h : (typeof defaultHour==='number'?defaultHour:H0);
    const endVal = b ? plBlockEnd(b) : Math.min(startVal+1, H1);
    // список цілей для прив'язки
    const goals=(goalsData.goals||[]);
    // список папок (проєктів) для категоризації
    const folderKeys=(typeof folders!=='undefined')?Object.keys(folders).filter(k=>folders[k]):[];
    const ov=document.createElement('div'); ov.className='pl-sheet-ov';
    const remindSel=(b&&b.remindOffset!=null)?String(b.remindOffset):'';
    const remindOpt=(v,lbl)=>`<option value="${v}" ${remindSel===v?'selected':''}>${lbl}</option>`;
    ov.innerHTML=`
      <div class="pl-sheet">
        <div class="pl-sheet-grab"></div>
        <div class="pl-sheet-h">${b?'Редагувати блок':'Новий блок часу'}</div>
        <label class="pl-sheet-l">Що робитимеш?</label>
        <input class="pl-sheet-in" id="pbTitle" placeholder="Напр. Робота на зміні" value="${b?esc(b.t):''}">
        <div class="pl-sheet-row">
          <div class="pl-sheet-col"><label class="pl-sheet-l">З</label>
            <input type="time" step="300" class="pl-sheet-in" id="pbFrom" value="${plHM(startVal)}"></div>
          <div class="pl-sheet-col"><label class="pl-sheet-l">До</label>
            <input type="time" step="300" class="pl-sheet-in" id="pbTo" value="${plHM(endVal)}"></div>
        </div>
        <div id="pbOverlapWarn"></div>
        <label class="pl-sheet-l">${plIco('remind',13)} Нагадати</label>
        <select class="pl-sheet-in" id="pbRemind">
          ${remindOpt('','— без нагадування —')}${remindOpt('0','У момент початку')}
          ${remindOpt('5','За 5 хв')}${remindOpt('10','За 10 хв')}${remindOpt('15','За 15 хв')}${remindOpt('30','За 30 хв')}
        </select>
        ${!b?`<label class="pl-sheet-l">${plIco('repeat',13)} Повторення</label>
        <select class="pl-sheet-in" id="pbRepeat">
          <option value="">— одноразово —</option>
          <option value="daily">Щодня</option>
          <option value="weekdays">Будні (Пн–Пт)</option>
          <option value="weekly">Щотижня, цей день</option>
          <option value="custom">Обрані дні тижня…</option>
        </select>
        <div id="pbCustomDows" style="display:none;margin-top:8px">
          <div class="pl-dow-chips">${['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map((l,i)=>`<button type="button" class="pl-dow-chip" data-dow="${i===6?0:i+1}">${l}</button>`).join('')}</div>
        </div>`:(b&&b.fromRecur?`<div class="pl-sheet-sub">${plIco('repeat',12)} частина повтору «${esc(b.repeatLabel||'')}» · зміни діють лише на цей день</div>`:'')}
        <label class="pl-sheet-l">🔗 Зв'язок з Флов (необов'язково)</label>
        <select class="pl-sheet-in" id="pbLinkType">
          <option value="">— без зв'язку —</option>
          <option value="goalstep">🎯 Крок до цілі</option>
          <option value="habit">✅ Звичка (ціль зі звичкою)</option>
          <option value="fin">💰 Дохід у конверт</option>
        </select>
        <div id="pbLinkExtra"></div>
        ${folderKeys.length?`<label class="pl-sheet-l">📁 Папка / проєкт (необов'язково)</label>
        <select class="pl-sheet-in" id="pbFolder">
          <option value="">— без папки —</option>
          ${folderKeys.map(k=>`<option value="${k}" ${(b&&b.folder===k)?'selected':''}>${(folders[k].emoji||'📁')} ${esc(folders[k].name||'Папка')}</option>`).join('')}
        </select>`:''}
        <div class="pl-sheet-btns">
          ${b?`<button class="pl-sheet-del" id="pbDel">Видалити</button>`:''}
          <button class="pl-sheet-cancel" id="pbCancel">Скасувати</button>
          <button class="pl-sheet-ok" id="pbOk">${b?'Зберегти':'Додати'}</button>
        </div>
        ${b?`<div style="margin-top:16px;border-top:1px solid var(--line);padding-top:14px">
          <div class="pl-sheet-l" style="margin-bottom:8px">📋 Підпункти</div>
          <div id="pbSubsList" style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
            ${(Array.isArray(b.subtasks)&&b.subtasks.length)?b.subtasks.map((s,i)=>`
              <div style="display:flex;align-items:center;gap:8px;background:var(--field);border-radius:10px;padding:8px 10px">
                <div class="pl-blk-sub-cb${s.done?' on':''}" data-pbsubdone="${i}" style="cursor:pointer">${s.done?'✓':''}</div>
                <span style="flex:1;font-size:12.5px">${esc(s.text||s.t||'')}</span>
                <button style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:13px" data-pbsubdel="${i}">✕</button>
              </div>`).join(''):'<div style="font-size:12px;color:var(--muted);padding:4px 0">Підпунктів немає</div>'}
          </div>
          <div style="display:flex;gap:6px">
            <input class="pl-sheet-in" id="pbSubInput" placeholder="Новий підпункт..." style="flex:1;padding:9px 10px;font-size:13px">
            <button id="pbSubAdd" style="background:var(--accent);border:none;color:#fff;font:700 13px inherit;padding:9px 14px;border-radius:11px;cursor:pointer">+</button>
          </div>
        </div>`:''}
      </div>`;
    document.body.appendChild(ov);
    if(preset && preset.folder){ const fs=ov.querySelector('#pbFolder'); if(fs) fs.value=preset.folder; }
    const close=()=>ov.remove();
    ov.addEventListener('click',(e)=>{ if(e.target===ov) close(); });
    // ── підпункти у формі редагування ──
    if(b){
      ov.querySelectorAll('[data-pbsubdone]').forEach(el=>el.onclick=(e)=>{
        e.stopPropagation();
        const i=+el.dataset.pbsubdone;
        if(!Array.isArray(b.subtasks)) b.subtasks=[];
        b.subtasks[i].done=!b.subtasks[i].done;
        el.classList.toggle('on',b.subtasks[i].done);
        el.textContent=b.subtasks[i].done?'✓':'';
        saveGoals();
      });
      ov.querySelectorAll('[data-pbsubdel]').forEach(el=>el.onclick=(e)=>{
        e.stopPropagation();
        const i=+el.dataset.pbsubdel;
        if(!Array.isArray(b.subtasks)) return;
        b.subtasks.splice(i,1);
        saveGoals(); close(); plBlockSheet(existingId,null);
      });
      const subInput=ov.querySelector('#pbSubInput');
      const subAdd=ov.querySelector('#pbSubAdd');
      if(subAdd&&subInput){
        const doAdd=()=>{
          const txt=(subInput.value||'').trim(); if(!txt) return;
          if(!Array.isArray(b.subtasks)) b.subtasks=[];
          b.subtasks.push({text:txt,done:false});
          saveGoals(); subInput.value=''; close(); plBlockSheet(existingId,null);
        };
        subAdd.onclick=doAdd;
        subInput.onkeydown=(e)=>{ if(e.key==='Enter'){ e.preventDefault(); doAdd(); } };
      }
    }
    const fromSel=ov.querySelector('#pbFrom'), toSel=ov.querySelector('#pbTo');
    function checkOverlap(){
      const from=plHMtoDec(fromSel.value), to=plHMtoDec(toSel.value);
      const warnEl=ov.querySelector('#pbOverlapWarn'); if(!warnEl) return;
      if(from==null||to==null){ warnEl.innerHTML=''; return; }
      const conflict=list.find(x=>x!==b && x.h<to && plBlockEnd(x)>from);
      warnEl.innerHTML=conflict?`<div class="pl-sheet-sub" style="color:var(--owe)">${plIco('warn',12)} накладається з «${esc(conflict.t)}» (${plHM(conflict.h)}–${plHM(plBlockEnd(conflict))})</div>`:'';
    }
    fromSel.onchange=()=>{ checkOverlap(); };
    toSel.onchange=checkOverlap;
    checkOverlap();
    // ── повторення: показ чипів обраних днів тижня для типу "custom"
    let customDows=new Set([new Date(ds+'T12:00:00').getDay()]);
    const repeatSel=ov.querySelector('#pbRepeat');
    const customBox=ov.querySelector('#pbCustomDows');
    if(repeatSel){
      const paintDowChips=()=>{ customBox.querySelectorAll('[data-dow]').forEach(ch=>ch.classList.toggle('on', customDows.has(+ch.dataset.dow))); };
      repeatSel.onchange=()=>{ customBox.style.display = repeatSel.value==='custom' ? 'block' : 'none'; paintDowChips(); };
      customBox.querySelectorAll('[data-dow]').forEach(ch=>ch.onclick=()=>{
        const dv=+ch.dataset.dow;
        if(customDows.has(dv)){ if(customDows.size>1) customDows.delete(dv); } else customDows.add(dv);
        paintDowChips();
      });
      paintDowChips();
    }
    // ── зв'язок: тип → залежні поля
    const linkTypeSel=ov.querySelector('#pbLinkType');
    const linkExtra=ov.querySelector('#pbLinkExtra');
    const envs=(typeof envelopes!=='undefined'&&Array.isArray(envelopes))?envelopes:[];
    function renderLinkExtra(){
      const tp=linkTypeSel.value;
      const curLink=(b&&b.link)||{};
      if(tp==='goalstep' || tp==='habit'){
        linkExtra.innerHTML=`<label class="pl-sheet-l">Яка ціль?</label>
          <select class="pl-sheet-in" id="pbLinkGoal">${goals.map(g=>`<option value="${esc(g.id||g.name||'')}" ${curLink.goalId===(g.id||g.name)?'selected':''}>${g.emoji||'🎯'} ${esc(g.name||'Ціль')}</option>`).join('')||'<option value="">(нема цілей — створи в Цілях)</option>'}</select>`;
      } else if(tp==='fin'){
        linkExtra.innerHTML=`<label class="pl-sheet-l">У який конверт</label>
          <select class="pl-sheet-in" id="pbLinkEnv">${envs.map(e=>`<option value="${e.id}" ${curLink.envId===e.id?'selected':''}>${e.emoji||'✉️'} ${esc(e.name)}</option>`).join('')||'<option value="">(нема конвертів — створи в Грошах)</option>'}</select>
          <label class="pl-sheet-l">Сума доходу, ₴</label>
          <input class="pl-sheet-in" id="pbLinkAmt" inputmode="numeric" placeholder="напр. 1200" value="${curLink.amount||''}">`;
      } else { linkExtra.innerHTML=''; }
    }
    // початковий тип зі збереженого блоку
    if(b&&b.link&&b.link.type){ linkTypeSel.value=b.link.type; }
    renderLinkExtra();
    linkTypeSel.onchange=renderLinkExtra;
    ov.querySelector('#pbCancel').onclick=close;
    ov.querySelector('#pbOk').onclick=()=>{
      const t=ov.querySelector('#pbTitle').value.trim();
      const from=plHMtoDec(fromSel.value), to=plHMtoDec(toSel.value);
      if(!t){ ov.querySelector('#pbTitle').focus(); return; }
      if(from==null||to==null){ return; }
      // блок "через північ": якщо кінець < початок — додаємо 24 (наприклад Сон 23:00–05:00 → endH=29)
      const toNorm = (to<from) ? to+24 : to;
      if(toNorm<=from){ return; }
      // зібрати зв'язок
      let link=null; const tp=linkTypeSel.value;
      if(tp==='goalstep' || tp==='habit'){
        const gid=ov.querySelector('#pbLinkGoal') && ov.querySelector('#pbLinkGoal').value;
        if(gid){ const g=goals.find(x=>(x.id||x.name)===gid); link={type:tp, goalId:gid, goalName:g?g.name:''}; }
      } else if(tp==='fin'){
        const eid=ov.querySelector('#pbLinkEnv') && ov.querySelector('#pbLinkEnv').value;
        const amt=parseInt((ov.querySelector('#pbLinkAmt')&&ov.querySelector('#pbLinkAmt').value)||'0',10);
        if(eid){ const e=envs.find(x=>x.id===eid); link={type:'fin', envId:eid, envName:e?e.name:'', amount:amt||0}; }
      }
      const tag=plLinkTag(link);
      const folderKey=(ov.querySelector('#pbFolder') && ov.querySelector('#pbFolder').value)||'';
      const remindRaw=(ov.querySelector('#pbRemind')&&ov.querySelector('#pbRemind').value);
      const remindOffset=(remindRaw===''||remindRaw==null)?null:+remindRaw;
      const computeRemindAt=(offsetMin)=>{
        if(offsetMin==null) return null;
        const base=new Date(ds+'T00:00:00');
        return new Date(base.getTime()+Math.round(from*3600000)-offsetMin*60000).toISOString();
      };
      if(b){
        b.t=t; b.h=from; b.endH=toNorm; b.link=link; b.tag=tag; b.folder=folderKey; delete b.span;
        b.remindOffset=remindOffset; b.remindAt=computeRemindAt(remindOffset); b.remindFired=false;
        if(b.remindAt) plScheduleReminder(b); else if(reminderTimers['pl_'+b.id]){ clearTimeout(reminderTimers['pl_'+b.id]); delete reminderTimers['pl_'+b.id]; }
      } else {
        const cols=['val','hab','fin','skl','cyan'];
        const col=cols[list.length%cols.length];
        const repeatVal=(ov.querySelector('#pbRepeat')&&ov.querySelector('#pbRepeat').value)||'';
        let fromRecur=null, repeatLabel=null;
        if(repeatVal){
          const repeatObj = repeatVal==='custom' ? {type:'custom', dows:[...customDows]} : {type:repeatVal};
          const tpl={id:'rt_'+Date.now(), t, h:from, endH:toNorm, c:col, link, tag, folder:folderKey, repeat:repeatObj, startDate:ds, remindOffset};
          p.recurring.push(tpl); fromRecur=tpl.id;
          repeatLabel = repeatVal==='custom'
            ? [...customDows].sort().map(dv=>['Нд','Пн','Вт','Ср','Чт','Пт','Сб'][dv]).join(',')
            : PL_REPEAT_LABEL[repeatVal];
        }
        const nb={id:'b_'+Date.now(), h:from, endH:toNorm, t, c:col, link, tag, folder:folderKey, done:false, remindOffset};
        if(fromRecur){ nb.fromRecur=fromRecur; nb.repeatLabel=repeatLabel; }
        nb.remindAt=computeRemindAt(remindOffset);
        if(nb.remindAt) plScheduleReminder(nb);
        list.push(nb);
      }
      saveGoals(); close(); plRerender();
      try{ window.platform.haptic('light'); }catch(_){}
    };
    if(b){ const del=ov.querySelector('#pbDel'); if(del) del.onclick=()=>{
      const i=list.indexOf(b); if(i>=0)list.splice(i,1);
      if(b.fromTask){ const tt=p.tasks.find(x=>x.id===b.fromTask); if(tt) tt.slotted=false; }
      if(b.fromRecur){ if(!Array.isArray(p.recurSkip[ds])) p.recurSkip[ds]=[]; if(!p.recurSkip[ds].includes(b.fromRecur)) p.recurSkip[ds].push(b.fromRecur); }
      if(reminderTimers['pl_'+b.id]){ clearTimeout(reminderTimers['pl_'+b.id]); delete reminderTimers['pl_'+b.id]; }
      saveGoals(); close(); plRerender();
    }; }
    setTimeout(()=>{ const ti=ov.querySelector('#pbTitle'); if(ti && !b) ti.focus(); },100);
  }
  function plEditBlock(id){ plBlockSheet(id, null); }

  // налаштування діапазону годин розкладу
  function plRangeSheet(){
    const p=plData();
    const ov=document.createElement('div'); ov.className='pl-sheet-ov';
    const styleOpt=(v,lbl)=>`<button class="pl-icst-b ${plIconStyle()===v?'on':''}" data-icst="${v}">${lbl}</button>`;
    ov.innerHTML=`
      <div class="pl-sheet">
        <div class="pl-sheet-grab"></div>
        <div class="pl-sheet-h">Налаштування Планера</div>
        <p class="pl-sheet-sub">З якої до якої години показувати розклад. Наприклад, якщо прокидаєшся о 6 — став початок 06:00.</p>
        <div class="pl-sheet-row">
          <div class="pl-sheet-col"><label class="pl-sheet-l">Початок дня</label>
            <select class="pl-sheet-in" id="prFrom">${(()=>{let o='';for(let h=0;h<=23;h++)o+=`<option value="${h}" ${h===p.dayStart?'selected':''}>${(h<10?'0':'')+h}:00</option>`;return o;})()}</select></div>
          <div class="pl-sheet-col"><label class="pl-sheet-l">Кінець дня</label>
            <select class="pl-sheet-in" id="prTo">${(()=>{let o='';for(let h=1;h<=24;h++)o+=`<option value="${h}" ${h===p.dayEnd?'selected':''}>${(h<10?'0':'')+h}:00</option>`;return o;})()}</select></div>
        </div>
        <label class="pl-sheet-l">Стиль іконок</label>
        <div class="pl-icst-row" id="pbIconStyle">
          ${styleOpt('1','Лінія')}${styleOpt('3','Дуотон')}${styleOpt('5','Гео')}
        </div>
        <div class="pl-sheet-sub" id="pbIconPrev" style="display:flex;gap:8px;align-items:center;margin:8px 0 4px">
          ${plIco('remind',15)}${plIco('repeat',15)}${plIco('warn',15)}${plIco('done',15)}${plIco('calendar',15)}${plIco('goal',15)}
        </div>
        <div class="pl-sheet-btns" style="margin-bottom:10px">
          <button class="pl-sheet-cancel" id="prFocus" style="flex:1">${plIco('focus',13)} Запустити фокус-сесію</button>
        </div>
        <div class="pl-sheet-btns">
          <button class="pl-sheet-cancel" id="prCancel">Скасувати</button>
          <button class="pl-sheet-ok" id="prOk">Зберегти</button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    ov.addEventListener('click',(e)=>{ if(e.target===ov) close(); });
    ov.querySelectorAll('[data-icst]').forEach(b=>b.onclick=()=>{
      p.iconStyle=b.dataset.icst; saveGoals();
      ov.querySelectorAll('[data-icst]').forEach(x=>x.classList.remove('on')); b.classList.add('on');
      const prev=ov.querySelector('#pbIconPrev');
      if(prev) prev.innerHTML=`${plIco('remind',15)}${plIco('repeat',15)}${plIco('warn',15)}${plIco('done',15)}${plIco('calendar',15)}${plIco('goal',15)}`;
      try{ window.platform.haptic('light'); }catch(_){}
      plRerender();
    });
    { const pf=ov.querySelector('#prFocus'); if(pf) pf.onclick=()=>{ close(); plStartFocus(); }; }
    ov.querySelector('#prCancel').onclick=close;
    ov.querySelector('#prOk').onclick=()=>{
      p.dayStart=+ov.querySelector('#prFrom').value;
      p.dayEnd=+ov.querySelector('#prTo').value;
      if(p.dayEnd<=p.dayStart) p.dayEnd=p.dayStart+1;
      saveGoals(); close(); plRerender();
    };
  }


