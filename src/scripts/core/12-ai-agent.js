  /* ═══════════ АГЕНТНИЙ РЕЖИМ · Фаза 1 (get_data + planner) ═══════════
     Цикл tool_use на клієнті. Дані не покидають апку: модель просить
     інструмент → виконуємо ЛОКАЛЬНО → віддаємо результат → фінальний текст.
     FLOW_OPS лишається fallback-ом для steps/folders/pages.
     Вимкнути: localStorage.setItem('ai_agent','0') */
  const AI_AGENT_KEY='ai_agent';
  function aiAgentOn(){ try{ return (localStorage.getItem(AI_AGENT_KEY)||'1')==='1'; }catch(_){ return true; } }
  let aiAgentStatus='';                       // що агент робить зараз (для бульбашки чату)
  function aiAgentSetStatus(s){
    aiAgentStatus=s||'';
    if(typeof document==='undefined') return;
    const el=document.getElementById('aiStreamTxt');
    if(el){ el.innerHTML=aiBusyHTML(); const b=document.getElementById('aiChatBody'); if(b) b.scrollTop=b.scrollHeight; }
  }
  /* ═══ DEV-РЕЖИМ (Нокс): технічний асистент розробника ═══ */
  /* Dev-режим існує ТІЛЬКИ у web/Telegram-збірці. У native (Capacitor) він
     вимкнений на рівні прапорця, а сам код вирізається build-ios.mjs — щоб у
     бандлі App Store фізично не було ні виконання коду, ні прихованих входів.
     Прапорець з storage міг приїхати з веб-версії, тому native має пріоритет. */
  function aiDevOn(){
    try{ if(window.FLOW_NATIVE) return false; }catch(_){}
    try{ return localStorage.getItem('ai_dev')==='1'; }catch(_){ return false; }
  }
  /* @dev-only:start */
  function aiDevToggleSheet(){
    const on=aiDevOn();
    confirmSheet({
      title:on?'Вийти з режиму розробника?':'⚙️ Режим розробника',
      sub:on?'Повернутись до звичайного Флоу.':'Нокс отримає доступ до storage, логу помилок і статистики витрат AI. Персонажа в цьому режимі змінити не можна.',
      ic:'⚙️', okLabel:on?'Вийти':'Увійти',
      onOk:()=>{
        try{ localStorage.setItem('ai_dev',on?'0':'1'); }catch(_){}
        if(on){ try{ localStorage.setItem('dev_translate_content','0'); }catch(_){} }
        if(!on){ try{ aiChatMsgs.push({role:'assistant',content:aiDevHelpText()}); aiChatSave(); }catch(_){} }
        try{ plToast(on?'👋 Dev-режим вимкнено':'⚙️ Dev-режим: Нокс на звʼязку'); }catch(_){}
        try{ aiRenderHead(); aiRenderBody(); }catch(_){}
        try{ flowCapRender(); }catch(_){}
        const inp=document.getElementById('aiInput'); if(inp) inp.placeholder='Напиши '+FLOW_PETS[petCur()].name+'…';
      }
    });
  }
  // Тумблер "перекладати мій контент (папки/нотатки) англійською" —
  // доступний тільки коли dev-режим увімкнено. Викликати з UI: devContentTranslateToggleSheet()
  function devContentTranslateToggleSheet(){
    if(!aiDevOn()){ try{ plToast('Спочатку увімкни Dev-режим'); }catch(_){} return; }
    const on = (function(){ try{ return localStorage.getItem('dev_translate_content')==='1'; }catch(_){ return false; } })();
    confirmSheet({
      title: on ? 'Вимкнути переклад контенту?' : '🌐 Перекладати мій контент?',
      sub: on
        ? 'Папки, сторінки та нотатки знову показуватимуться мовою оригіналу.'
        : 'Назви папок, сторінок і текст нотаток перекладатимуться на англійську (через AI, з кешем — повторно не перекладає). Тільки в dev-режимі, на звичайний режим не впливає.',
      ic:'🌐', okLabel: on?'Вимкнути':'Увімкнути',
      onOk:()=>{
        try{ localStorage.setItem('dev_translate_content', on?'0':'1'); }catch(_){}
        try{ plToast(on?'Переклад контенту вимкнено':'Переклад контенту увімкнено'); }catch(_){}
        try{ if(window.flowSetLang) window.flowSetLang('en'); }catch(_){} // переклад контенту без англ. UI не має сенсу
        try{ render(); }catch(_){}
      }
    });
  }
  window.devContentTranslateToggleSheet = devContentTranslateToggleSheet;
  const AI_DEV_SYS='Ти — Нокс, технічний dev-асистент розробника Flow. Це службовий режим для власника апки, НЕ для користувачів: без мотивації, персон і FLOW_OPS. '
    +'Flow — односторінкова HTML/JS-апка (Mac через Electron + сайт/iPhone; Telegram прибрано): дані в localStorage + Supabase (Google-вхід) + IndexedDB для важкого (реєстр window.FLOW_KEYS), AI — через Cloudflare Worker до Anthropic (Haiku 4.5 / Sonnet 5 / Opus 5, prompt caching, агентний цикл на клієнті). '
    +'Твої dev-інструменти: dev_storage (keys/get/check), dev_errors (помилки JS), dev_cost (токени і $), dev_selftest (воркер+storage+парсинг), dev_data (backup/restore storage), dev_eval (JS у живій апці — з підтвердженням і авто-бекапом; для фіксів даних: змінив → save-функція → перевір check-ом). '
    +'Коли просять довідку/«що вмієш» — стисло перелічи ці можливості з прикладами запитів, без викликів інструментів. '
    +'Також доступні звичайні інструменти (get_data, planner, goals, finance, patterns, memory) — для перевірки поведінки. '
    +'Стиль: технічно, стисло, українською; код у ```; конкретні ключі/рядки/цифри. Нічого не вигадуй: немає даних — так і скажи. '
    +'Ти НЕ можеш змінювати код апки; можеш запропонувати патч текстом.';
  function aiDevCtx(){
    const p=[];
    try{ p.push('Endpoint: '+aiEndpoint()); }catch(_){}
    try{ p.push('FLOW_KEYS: '+((window.FLOW_KEYS||[]).length)+' ключів'); }catch(_){}
    try{
      let n=0,bytes=0; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); n++; bytes+=(localStorage.getItem(k)||'').length; }
      p.push('localStorage: '+n+' ключів, ~'+Math.round(bytes/1024)+' КБ');
    }catch(_){}
    try{ p.push('Помилок у лозі: '+((window.__flowErrors||[]).length)); }catch(_){}
    try{ p.push('Дата: '+plTodayStr()); }catch(_){}
    return 'СТАН:\n'+p.join('\n');
  }
  /* Реєстр dev-можливостей: додаєш функцію — додай рядок сюди, довідка оновиться сама */
  const DEV_FEATURES=[
    {q:'покажи storage',            d:'усі ключі з розмірами, найбільші зверху, чужі позначено'},
    {q:'що в ключі envelopes',      d:'сирий вміст будь-якого ключа'},
    {q:'перевір цілісність даних',  d:'розсинхрони конвертів, биті finOps/блоки/кроки — з назвами'},
    {q:'які були помилки',          d:'останні JS-помилки: тип, файл, рядок, час'},
    {q:'скільки я витратив на AI',  d:'токени і $ по днях, Haiku/Sonnet, економія кешу'},
    {q:'зроби селф-тест',           d:'воркер (обидві моделі + латенсі), storage, парсинг усіх ключів'},
    {q:'зроби бекап / відновись',   d:'знімок усього storage в памʼять і відкат до нього'},
    {q:'виконай код: …',            d:'JS-фікс прямо в живій апці — з шторкою підтвердження і авто-бекапом'},
    {q:'запропонуй патч для …',     d:'Нокс формулює патч текстом — кидаєш його в сесію розробки'}
  ];
  function aiDevHelpText(){
    return '⚙️ **Нокс · dev-режим**\nЩо я вмію (тапни-скопіюй запит):\n\n'
      +DEV_FEATURES.map(f=>'• «'+f.q+'» — '+f.d).join('\n')
      +'\n\nВийти: утримай мій аватар.';
  }
  /* @dev-only:end */
  /* @dev-only:start */
  function aiDevConfirm(title,body){
    return new Promise(res=>{
      try{
        const ov=document.createElement('div'); ov.className='asheet';
        ov.innerHTML='<div class="asheet-in"><div class="asheet-grip"></div>'
          +'<div class="asheet-title">'+esc(title)+'</div>'
          +'<div class="asheet-sub" style="text-align:left;white-space:pre-wrap;font-family:ui-monospace,monospace;font-size:12px;max-height:220px;overflow:auto">'+esc(body)+'</div>'
          +'<button class="asheet-item danger" data-ok="1"><span class="tx"><span class="lab2">Виконати</span></span></button>'
          +'<button class="asheet-cancel">Скасувати</button></div>';
        document.body.appendChild(ov);
        let done=false; const fin=v=>{ if(done)return; done=true; try{ov.remove();}catch(_){} res(v); };
        ov.onclick=e=>{ if(e.target===ov) fin(false); };
        ov.querySelector('.asheet-cancel').onclick=()=>fin(false);
        ov.querySelector('[data-ok]').onclick=()=>fin(true);
        setTimeout(()=>fin(false), 180000);
      }catch(e){ res(false); }
    });
  }
  /* @dev-only:end */
  /* @dev-only:start */
  function devSnapshot(){
    const s={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); s[k]=localStorage.getItem(k); }
    return s;
  }
  /* @dev-only:end */
  /* @dev-only:start replace="const DEV_TOOLS=[];" */
  const DEV_TOOLS=[
    { name:'dev_storage',
      description:'Storage-інспектор: keys (усі ключі localStorage з розмірами, позначає ключі поза FLOW_KEYS), get (сирий вміст ключа, обрізаний), check (перевірка цілісності: конверти, finOps, блоки планера, цілі).',
      input_schema:{ type:'object', properties:{
        action:{ type:'string', enum:['keys','get','check'] },
        key:{ type:'string', description:'ключ для get' }
      }, required:['action'] } },
    { name:'dev_errors',
      description:'Останні помилки JS (window.__flowErrors, до 30): тип, повідомлення, файл, рядок, час.',
      input_schema:{ type:'object', properties:{ limit:{ type:'number' } } } },
    { name:'dev_cost',
      description:'Статистика AI: токени (вхід/вихід/кеш) і вартість у $ по днях і моделях за поточний місяць.',
      input_schema:{ type:'object', properties:{} } },
    { name:'dev_selftest',
      description:'Селф-тест продакшену: пінг воркера обома моделями з латенсі, тест запису/читання storage, парсинг усіх JSON-ключів. Викликай без параметрів.',
      input_schema:{ type:'object', properties:{} } },
    { name:'dev_data',
      description:'Бекап/відкат storage: backup — знімок усіх ключів у памʼять (живе до перезапуску апки), restore — повне відновлення зі знімка (з підтвердженням людини).',
      input_schema:{ type:'object', properties:{ action:{type:'string',enum:['backup','restore']} }, required:['action'] } },
    { name:'dev_eval',
      description:'Виконати JS у живій апці (доступ до всіх глобальних: envelopes, finOps, plData(), goalsData, saveFinOps() тощо). Людина бачить код у шторці й підтверджує. Перед виконанням — авто-бекап storage. Пиши код, що ПОВЕРТАЄ результат (return). Використовуй для точкових фіксів даних, після фіксу клич save-функції і перевір check-ом.',
      input_schema:{ type:'object', properties:{ code:{type:'string'}, why:{type:'string',description:'1 рядок: навіщо'} }, required:['code','why'] } }
  ];
  /* @dev-only:end */
  /* @dev-only:start */
  function devToolStorage(inp){
    if(inp.action==='keys'){
      const reg={}; (window.FLOW_KEYS||[]).forEach(k=>reg[k]=1);
      ['ai_agent','ai_dev','ai_brief_ds','ai_week_ds','ai_usage','ai_pet','pet_sleep','ui_fx','ui_fx_say'].forEach(k=>reg[k]=1);  // локальні прапорці пристрою
      const rows=[];
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i), v=localStorage.getItem(k)||'';
        rows.push({k:k, b:v.length, reg:!!reg[k]});
      }
      rows.sort((a,b)=>b.b-a.b);
      return rows.map(r=>r.k+' · '+(r.b>2048?Math.round(r.b/1024)+'КБ':r.b+'Б')+(r.reg?'':' · ПОЗА FLOW_KEYS')).join('\n')||'порожньо';
    }
    if(inp.action==='get'){
      const k=String(inp.key||''); const v=localStorage.getItem(k);
      if(v==null) return '⚠️ ключа «'+k+'» немає';
      return k+' ('+v.length+'Б):\n'+v.slice(0,1300)+(v.length>1300?'\n…(обрізано)':'');
    }
    if(inp.action==='check'){
      const out=[];
      try{ (envelopes||[]).forEach(e=>{
        const s=(e.ops||[]).reduce((a,o)=>a+(o.t==='in'?+o.amount:-+o.amount),0);
        if(Math.abs(s-(+e.saved||0))>0.01) out.push('конверт «'+e.name+'»: saved='+e.saved+' ≠ сума ops='+s);
      }); }catch(e){ out.push('envelopes: '+e.message); }
      try{ (finOps||[]).forEach((f,i)=>{
        if(!f||!(+f.amount>0)||!f.type) out.push('finOps['+i+']: битий запис '+JSON.stringify(f).slice(0,80));
      }); }catch(e){ out.push('finOps: '+e.message); }
      try{ const p=plData(); Object.keys(p.blocksByDay||{}).forEach(ds=>{
        (p.blocksByDay[ds]||[]).forEach((b,i)=>{
          if(!b.id) out.push('блок без id: '+ds+'['+i+'] «'+(b.t||'')+'»');
          if(!(b.endH>b.h)) out.push('блок з битим часом: '+ds+' «'+(b.t||'')+'» h='+b.h+' endH='+b.endH);
        });
      }); }catch(e){ out.push('planner: '+e.message); }
      try{ (goalsData.goals||[]).forEach(g=>{
        (g.steps||[]).forEach((s,i)=>{ if(!s||(!s.name&&!s.t)) out.push('ціль «'+g.name+'»: битий крок ['+i+']'); });
      }); }catch(e){ out.push('goals: '+e.message); }
      return out.length?('Знайдено '+out.length+':\n'+out.slice(0,25).join('\n')):'✅ цілісність OK: конверти, finOps, блоки, цілі — без розбіжностей';
    }
    return '⚠️ невідома дія';
  }
  function devToolErrors(inp){
    const es=(window.__flowErrors||[]).slice(-Math.min(+((inp||{}).limit)||30,30));
    if(!es.length) return 'лог помилок порожній ✅';
    return es.map(e=>new Date(e.t).toISOString().slice(11,19)+' ['+e.kind+'] '+e.msg+(e.src?' @'+e.src+':'+e.line:'')).join('\n');
  }
  function devToolCost(){
    let d={}; try{ d=JSON.parse(localStorage.getItem('ai_usage')||'{}'); }catch(_){}
    const mon=plTodayStr().slice(0,7);
    const P={h:{i:1,o:5},s:{i:3,o:15}};   // $ за Mtok
    const cost=(m,e)=>(e.i*P[m].i+e.o*P[m].o+e.cr*P[m].i*0.1+e.cw*P[m].i*1.25)/1e6;
    let tot=0,totH=0,totS=0; const rows=[];
    Object.keys(d).sort().forEach(ds=>{
      if(ds.slice(0,7)!==mon) return;
      let day=0,parts=[];
      ['h','s'].forEach(m=>{ const e=d[ds][m]; if(!e) return;
        const c=cost(m,e); day+=c; if(m==='h')totH+=c; else totS+=c;
        parts.push((m==='h'?'Haiku':'Sonnet')+' '+e.n+'зап, in '+e.i+' (кеш '+e.cr+'), out '+e.o);
      });
      tot+=day;
      rows.push(ds+': $'+day.toFixed(3)+' · '+parts.join(' · '));
    });
    if(!rows.length) return 'за '+mon+' даних ще немає (збір почався з цієї версії)';
    return rows.join('\n')+'\nРАЗОМ '+mon+': $'+tot.toFixed(2)+' (Haiku $'+totH.toFixed(2)+' / Sonnet $'+totS.toFixed(2)+')';
  }
  async function devToolSelftest(){
    const out=[];
    // 1) воркер: обидві моделі, латенсі
    for(const m of ['claude-haiku-4-5','claude-sonnet-4-6']){
      const t0=Date.now();
      try{
        const r=await fetch(aiEndpoint(),{method:'POST',headers:{'content-type':'application/json'},
          body:JSON.stringify({model:m,max_tokens:1,messages:[{role:'user',content:'ping'}]})});
        out.push((r.ok?'✅':'❌ HTTP '+r.status)+' '+m+' · '+(Date.now()-t0)+'мс');
      }catch(e){ out.push('❌ '+m+' · '+String(e.message||e)); }
    }
    // 2) storage запис/читання
    try{
      localStorage.setItem('__devtest','ok');
      out.push(localStorage.getItem('__devtest')==='ok'?'✅ localStorage запис/читання':'❌ localStorage');
      localStorage.removeItem('__devtest');
    }catch(e){ out.push('❌ localStorage: '+e.message); }
    // 3) парсинг усіх JSON-ключів
    let bad=[],n=0;
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i), v=localStorage.getItem(k)||'';
      if(v[0]==='{'||v[0]==='['){ n++; try{ JSON.parse(v); }catch(_){ bad.push(k); } }
    }
    out.push(bad.length?('❌ биті JSON-ключі ('+bad.length+'): '+bad.join(', ')):('✅ JSON-ключі парсяться ('+n+')'));
    // 4) критичні функції на місці
    const fns=['plBlocksFor','aiCommit','saveGoals','saveFinOps','envAddOp','renderFinance'];
    const miss=fns.filter(f=>{ try{ return typeof eval(f)!=='function'; }catch(_){ return true; } });
    out.push(miss.length?('❌ відсутні функції: '+miss.join(', ')):'✅ критичні функції на місці');
    return out.join('\n');
  }
  async function devToolData(inp){
    if(inp.action==='backup'){
      window.__devBak=devSnapshot();
      const n=Object.keys(window.__devBak).length;
      const kb=Math.round(Object.values(window.__devBak).join('').length/1024);
      return '✅ бекап: '+n+' ключів, ~'+kb+' КБ (у памʼяті до перезапуску апки)';
    }
    if(inp.action==='restore'){
      if(!window.__devBak) return '⚠️ бекапа немає — спершу backup';
      const n=Object.keys(window.__devBak).length;
      const ok=await aiDevConfirm('♻️ Відновити storage з бекапа?','Буде перезаписано '+n+' ключів поточними значеннями зі знімка. Після відновлення апку треба перезапустити.');
      if(!ok) return 'людина скасувала відновлення';
      try{
        localStorage.clear();
        Object.keys(window.__devBak).forEach(k=>localStorage.setItem(k,window.__devBak[k]));
        return '✅ відновлено '+n+' ключів. Скажи людині перезапустити апку (закрити й відкрити).';
      }catch(e){ return '❌ помилка відновлення: '+String(e.message||e); }
    }
    return '⚠️ невідома дія';
  }
  async function devToolEval(inp){
    const code=String(inp.code||'').trim();
    if(!code) return '⚠️ порожній code';
    if(code.length>3000) return '⚠️ код задовгий (>3000) — розбий на кроки';
    const ok=await aiDevConfirm('🧪 Нокс хоче виконати код · '+String(inp.why||'').slice(0,60), code);
    if(!ok) return 'людина скасувала виконання — не повторюй без змін';
    window.__devBak=devSnapshot();   // авто-бекап перед кожним eval
    try{
      const fn=new Function('return (async()=>{ '+code+' })()');
      const r=await fn();
      let s; try{ s=typeof r==='object'?JSON.stringify(r):String(r); }catch(_){ s=String(r); }
      return '✅ виконано · результат: '+String(s==null?'undefined':s).slice(0,1200)+'\n(бекап зроблено — відкат: dev_data restore)';
    }catch(e){ return '❌ помилка виконання: '+String(e&&e.message||e); }
  }
  /* @dev-only:end */
  /* ── /ai зі сторінки редактора: агентний хід з текстом сторінки в контексті ── */
  async function aiPageAsk(q,pageTxt){
    const sysStable=AI_CHAT_SYS+AI_AGENT_ADDON;
    const sysDyn='РЕЖИМ СТОРІНКИ: людина викликала тебе слеш-командою зі сторінки редактора. Нижче — текст цієї сторінки. Виконай прохання; за потреби використовуй інструменти (planner/goals/finance/memory/get_data). Відповідь — стислий текст, який ляже блоком на цю сторінку: без FLOW_OPS, без заголовків, без markdown.'
      +'\n\nСТОРІНКА:\n'+(pageTxt||'(порожньо)')
      +'\n\nКОНТЕКСТ:\n'+aiCtx(null);
    return await aiAgentTurn(sysStable,sysDyn,[{role:'user',content:q}],q,null);
  }
  /* ── ранковий бриф: раз на день при першому відкритті чату до 12:00 ── */
  function aiMorningMaybe(){
    try{
      if(!aiAgentOn()||aiDevOn()) return;
      if(typeof aiBusy!=='undefined'&&aiBusy) return;
      const ds=plTodayStr();
      if(localStorage.getItem('ai_brief_ds')===ds) return;
      if(new Date().getHours()>=12) return;
      localStorage.setItem('ai_brief_ds',ds);
      aiChatSend('Ранковий бриф: подивись мій сьогоднішній план і вчорашній день, скажи що в плані, що я не закрив учора, і один головний фокус дня. Стисло, без води.');
    }catch(e){ console.error('aiMorningMaybe',e); }
  }
  /* ── тижневий огляд: неділя з 17:00, раз на тиждень ── */
  function aiWeeklyMaybe(){
    try{
      if(!aiAgentOn()||aiDevOn()) return;
      if(typeof aiBusy!=='undefined'&&aiBusy) return;
      const now=new Date();
      if(now.getDay()!==0||now.getHours()<17) return;
      const ds=plTodayStr();
      if(localStorage.getItem('ai_week_ds')===ds) return;
      localStorage.setItem('ai_week_ds',ds);
      aiChatSend('Тижневий огляд: подивись останні 7 днів, цілі й фінанси. Скажи: скільки блоків закрито по днях, що просіло, 1-2 чесні висновки і один фокус на наступний тиждень. Стисло, без води.');
    }catch(e){ console.error('aiWeeklyMaybe',e); }
  }
  function aiAgentStatusFor(name,inp){
    inp=inp||{};
    if(name==='get_data'){
      const M={day:'дивлюсь день',range:'дивлюсь період',goals:'дивлюсь цілі',finance:'дивлюсь фінанси',backlog:'дивлюсь беклог',folders:'дивлюсь папки',diary:'читаю щоденник',vision:'дивлюсь Візію',wishes:'дивлюсь Карту бажань'};
      return '🔍 '+(M[inp.what]||'читаю дані')+'…';
    }
    if(name==='planner'){
      const M={create:'📦 створюю блоки',move:'↔️ переношу блоки',done:'✅ відмічаю виконане',delete:'🗑 видаляю блоки'};
      return (M[inp.action]||'🔧 змінюю планер')+'…';
    }
    if(name==='goals'){
      const M={add_step:'🎯 додаю крок',check_step:'🎯 відмічаю крок',create_goal:'🎯 створюю ціль'};
      return (M[inp.action]||'🎯 працюю з цілями')+'…';
    }
    if(name==='finance'){
      const M={add_expense:'💸 записую витрату',add_income:'💰 записую дохід',env_deposit:'📩 відкладаю в конверт',env_spend:'📤 списую з конверта',env_create:'✉️ створюю конверт',debt_add:'🤝 записую борг',debt_pay:'🤝 фіксую погашення',debt_list:'🤝 дивлюсь борги',del_last:'↩️ прибираю запис'};
      return (M[inp.action]||'💶 працюю з фінансами')+'…';
    }
    if(name==='patterns') return '🧠 працюю з патернами…';
    /* @dev-only:start */
    if(name==='dev_storage') return '🗄 читаю storage…';
    if(name==='dev_errors') return '🐞 читаю лог помилок…';
    if(name==='dev_cost') return '💵 рахую витрати…';
    if(name==='dev_selftest') return '🩺 селф-тест…';
    if(name==='dev_data') return inp.action==='restore'?'♻️ відновлюю storage…':'💾 роблю бекап…';
    if(name==='dev_eval') return '🧪 виконую код…';
    /* @dev-only:end */
    if(name==='memory') return inp.action==='forget'?'🗑 забуваю…':'💾 запамʼятовую…';
    return '🔧 працюю…';
  }

  /* ── слід ходу: які інструменти агент реально викликав. Живе один хід;
     у повідомлення лягає компактна копія (m.trace) — з неї малюються
     згорнутий рядок, полиця розділів і цифри. Кроки видно наживо в картці
     #aiTraceLive, поки Флоу думає. ── */
  let aiTrace=null;
  function aiPlz(n,one,few,many){
    const m10=n%10,m100=n%100;
    return n+' '+(m10===1&&m100!==11?one:(m10>=2&&m10<=4&&(m100<10||m100>=20)?few:many));
  }
  const AI_TRACE_READ={
    day:{k:'day',name:'Планер',e:'🗓'}, range:{k:'day',name:'Планер',e:'🗓'},
    backlog:{k:'backlog',name:'Беклог',e:'📥'}, goals:{k:'goals',name:'Цілі',e:'🎯'},
    finance:{k:'fin',name:'Гаманець',e:'💰'}, folders:{k:'folders',name:'Папки',e:'🗂'},
    diary:{k:'diary',name:'Щоденник',e:'📓'}, vision:{k:'vision',name:'Візія',e:'🔭'},
    wishes:{k:'wishes',name:'Карта бажань',e:'✨'}
  };
  function aiTraceReadMeta(what,inp){
    try{
      if(what==='day'){
        const l=plBlocksFor(/^\d{4}-\d{2}-\d{2}$/.test(inp.ds||'')?inp.ds:plTodayStr())||[];
        return l.length?aiPlz(l.length,'блок','блоки','блоків'):'';
      }
      if(what==='goals'){ const n=((goalsData||{}).goals||[]).length; return n?aiPlz(n,'ціль','цілі','цілей'):''; }
      if(what==='folders'){ const n=Object.keys(folders||{}).length; return n?aiPlz(n,'папка','папки','папок'):''; }
      if(what==='diary'){
        const s=(typeof diaryEntries==='object'&&diaryEntries)?diaryEntries:{};
        const n=Object.keys(s).filter(k=>s[k]&&s[k].text&&String(s[k].text).trim()).length;
        return n?aiPlz(Math.min(n,10),'запис','записи','записів'):'';
      }
      if(what==='backlog'){ const n=(plData().tasks||[]).filter(x=>!x.done).length; return n?aiPlz(n,'задача','задачі','задач'):''; }
    }catch(_){}
    return '';
  }
  function aiTraceStart(){ aiTrace={steps:[],shelf:[],kpi:{}}; }
  function aiTraceStep(name,inp){
    if(!aiTrace) return -1;
    inp=inp||{};
    const st={t:String(aiAgentStatusFor(name,inp)).replace(/…+$/,''),n:'',run:1};
    if(name==='get_data'){
      st.n=aiTraceReadMeta(inp.what,inp);
      const r=AI_TRACE_READ[inp.what];
      if(r&&!aiTrace.shelf.some(x=>x.k===r.k)) aiTrace.shelf.push({k:r.k,name:r.name,e:r.e,meta:st.n});
      if(inp.what==='day'||inp.what==='range'||inp.what==='backlog') aiTrace.kpi.day=1;
      if(inp.what==='finance') aiTrace.kpi.fin=1;
    }
    if(name==='planner') aiTrace.kpi.day=1;
    if(name==='finance') aiTrace.kpi.fin=1;
    aiTrace.steps.push(st);
    aiTraceRepaint();
    return aiTrace.steps.length-1;
  }
  function aiTraceEnd(i){
    if(!aiTrace||!aiTrace.steps[i]) return;
    aiTrace.steps[i].run=0;
    aiTraceRepaint();
  }
  function aiTraceRepaint(){
    if(typeof document==='undefined') return;
    const el=document.getElementById('aiTraceLive'); if(!el) return;
    el.innerHTML=aiTraceLiveHTML();
    const b=document.getElementById('aiChatBody'); if(b) b.scrollTop=b.scrollHeight;
  }
  function aiTraceFinish(){
    const t=aiTrace; aiTrace=null;
    if(!t||!t.steps.length) return null;
    return {
      steps:t.steps.slice(0,10).map(s=>({t:String(s.t).slice(0,60),n:String(s.n||'').slice(0,24)})),
      shelf:t.shelf.slice(0,6).map(x=>({k:x.k,name:x.name,e:x.e,meta:String(x.meta||'').slice(0,24)})),
      kpi:t.kpi
    };
  }

  const FLOW_TOOLS=[
    { name:'get_data',
      description:'Прочитати живі дані Frequency. Клич, коли потрібних даних немає в КОНТЕКСТІ (минулі дні, деталі цілей, фінанси, беклог, папки, щоденник, Візія, Карта бажань). Повертає стислий текст.',
      input_schema:{ type:'object', properties:{
        what:{ type:'string', enum:['day','range','goals','finance','backlog','folders','diary','vision','wishes'] },
        ds:{ type:'string', description:'YYYY-MM-DD, для what=day' },
        from:{ type:'string', description:'YYYY-MM-DD, для what=range' },
        to:{ type:'string', description:'YYYY-MM-DD, для what=range (до 31 дня)' }
      }, required:['what'] } },
    { name:'planner',
      description:'Змінити планер: create (нові блоки), move (перенести), done (закрити), delete (видалити). Для move/done/delete поле t — фрагмент назви НАЯВНОГО блоку. Відповідь містить результат і конфлікти — прочитай її та виправ, якщо треба.',
      input_schema:{ type:'object', properties:{
        action:{ type:'string', enum:['create','move','done','delete'] },
        blocks:{ type:'array', items:{ type:'object', properties:{
          ds:{type:'string',description:'YYYY-MM-DD'},
          h:{type:'number',description:'початок 0-24, можна 19.5'},
          endH:{type:'number'},
          t:{type:'string',description:'назва (create) або фрагмент назви наявного (move/done/delete)'},
          goal:{type:'string',description:'фрагмент назви цілі, лише для create'}
        }, required:['t'] } }
      }, required:['action','blocks'] } },
    { name:'goals',
      description:'Цілі: add_step (додати крок до цілі), check_step (відмітити крок виконаним), create_goal (нова ціль). goal і t — фрагменти назв.',
      input_schema:{ type:'object', properties:{
        action:{ type:'string', enum:['add_step','check_step','create_goal'] },
        goal:{ type:'string', description:'фрагмент назви цілі (add_step/check_step) або назва нової цілі (create_goal)' },
        t:{ type:'string', description:'текст кроку (add_step) або фрагмент наявного кроку (check_step)' },
        emoji:{ type:'string', description:'емодзі для create_goal' }
      }, required:['action','goal'] } },
    { name:'finance',
      description:'Весь блок Гроші: add_expense (витрата), add_income (дохід), env_deposit/env_spend (конверти), env_create (новий конверт), debt_add (записати борг), debt_pay (погасити борг повністю/частково), debt_list (хто кому винен), del_last (видалити останній AI-запис витрати/доходу — для виправлень). Грошові записи людина підтверджує шторкою — просто викликай; якщо скасувала, не повторюй.',
      input_schema:{ type:'object', properties:{
        action:{ type:'string', enum:['add_expense','add_income','env_deposit','env_spend','env_create','debt_add','debt_pay','debt_list','del_last'] },
        amount:{ type:'number', description:'сума (не потрібна для debt_list/del_last)' },
        label:{ type:'string', description:'на що / звідки / коментар' },
        envelope:{ type:'string', description:'назва конверта: фрагмент наявного (env_deposit/env_spend) або назва нового (env_create)' },
        goal:{ type:'number', description:'ціль накопичення для env_create, опційно' },
        who:{ type:'string', description:'імʼя людини для debt_add/debt_pay' },
        direction:{ type:'string', enum:['owe','owed'], description:'debt_add: owe = я винен, owed = мені винні' },
        cur:{ type:'string', enum:['UAH','USD','EUR','PLN'], description:'валюта боргу, дефолт EUR' }
      }, required:['action'] } },
    { name:'patterns',
      description:'Патерни (цикли заміни звичок): list (активні цикли), mark_new (спрацював НОВИЙ патерн — перемога), mark_old (зрив у старий). name — фрагмент опису.',
      input_schema:{ type:'object', properties:{
        action:{ type:'string', enum:['list','mark_new','mark_old'] },
        name:{ type:'string' }
      }, required:['action'] } },
    { name:'memory',
      description:'Довготривала памʼять про людину: save (запамʼятати факт ≤120 символів — лише справді довготривале), forget (забути факти з фрагментом). Не дублюй те, що вже в ПАМʼЯТІ.',
      input_schema:{ type:'object', properties:{
        action:{ type:'string', enum:['save','forget'] },
        text:{ type:'string' }
      }, required:['action','text'] },
      cache_control:{ type:'ephemeral' } },
    { name:'folders',
      description:'Папки й проєкти на головному екрані: create (нова папка/проєкт), rename, set_role (зробити проєктом/звичайною папкою, виставити due), delete. folder — фрагмент наявної назви.',
      input_schema:{ type:'object', properties:{
        action:{ type:'string', enum:['create','rename','set_role','delete'] },
        folder:{ type:'string', description:'фрагмент назви наявної папки (rename/set_role/delete)' },
        name:{ type:'string', description:'назва (create) або нова назва (rename)' },
        emoji:{ type:'string' },
        role:{ type:'string', enum:['project','area'], description:'project — проєкт з дедлайном, area — звичайна папка' },
        due:{ type:'string', description:'YYYY-MM-DD, лише якщо role=project' }
      }, required:['action'] } },
    { name:'agency',
      description:'Захист.SK — клієнти агенції: list (усі клієнти й стан), add_client (новий клієнт), set_stage (перевести стадію), add_payment (записати платіж клієнта — автоматично відображається у Фінансах). client — фрагмент імені.',
      input_schema:{ type:'object', properties:{
        action:{ type:'string', enum:['list','add_client','set_stage','add_payment'] },
        name:{ type:'string', description:'імʼя нового клієнта, лише для add_client' },
        client:{ type:'string', description:'фрагмент імені наявного клієнта' },
        service:{ type:'string', enum:['TP','živnosť','pobyt'] },
        stage:{ type:'string', enum:['Заявка','Консультація','Оплата','В роботі','Подано','Готово'] },
        amount:{ type:'number', description:'сума платежу, лише для add_payment' },
        label:{ type:'string', description:'підпис платежу (напр. Аванс/Доплата)' }
      }, required:['action'] } }
  ];

  const AI_AGENT_ADDON='\n\nАГЕНТНИЙ РЕЖИМ: у тебе є інструменти get_data, planner, goals, finance, patterns, memory, folders, agency. '
    +'Дії з блоками планера — ЛИШЕ інструмент planner. Кроки/цілі — інструмент goals. ВЕСЬ блок Гроші — інструмент finance: витрати, доходи, конверти (env_deposit/env_spend/env_create), борги (debt_add/debt_pay/debt_list) і виправлення (del_last). Ніколи не кажи, що не можеш редагувати борги чи конверти — можеш, викликом finance. '
    +'Цикли заміни звичок — інструмент patterns (перемога=mark_new, зрив=mark_old, без осуду). '
    +'Довготривалі факти про людину — інструмент memory (save/forget), а НЕ FLOW_MEM-рядок. '
    +'Папки й проєкти на головному екрані — інструмент folders (create/rename/set_role/delete). '
    +'Захист.SK, клієнти агенції, платежі — інструмент agency (list/add_client/set_stage/add_payment). '
    +'FLOW_OPS використовуй лише для pages. '
    +'ПІДТВЕРДЖЕННЯ: майже кожен інструмент, що щось МІНЯЄ (не читає), сам питає людину підтвердити дію шторкою знизу — просто викликай його, шторка зʼявиться автоматично. Якщо результат каже "людина скасувала" — прийми це, не повторюй той самий виклик і не наполягай. '
    +'Перед плануванням дня, якого немає в КОНТЕКСТІ, спершу подивись його через get_data. '
    +'get_data також читає щоденник (diary), Візію (vision: куди йду / навіщо / фокус) і Карту бажань (wishes). Коли треба дати пораду «з душею» чи ранковий бриф — зазирни туди, щоб спиратись на те, що людині справді важливо, а не радити абстрактно. '
    +'Після кожного інструмента прочитай результат: якщо конфлікт чи ⚠️ — виправ наступним викликом або чесно скажи, що не вийшло. '
    +'Не переказуй сирі дані з інструментів — лише висновок. Максимум стислості. '
    +'ГОЛОСОВИЙ ДАМП: повідомлення з 🎙 — надиктоване. Якщо в ньому кілька думок/задач/фактів — сам розклади все по місцях інструментами (задачі з часом → planner, кроки цілей → goals, витрати/доходи → finance, довготривалі факти → memory) і підсумуй одним рядком, що куди поклав. Не перепитуй, якщо зрозуміло з контексту.';

  async function flowToolExec(name,inp){
    try{
      if(name==='get_data') return flowToolRead(inp||{});
      if(name==='planner')  return await flowToolPlanner(inp||{});
      if(name==='goals')    return await flowToolGoals(inp||{});
      if(name==='finance')  return await flowToolFinance(inp||{});
      if(name==='patterns') return await flowToolPatterns(inp||{});
      if(name==='memory')   return await flowToolMemory(inp||{});
      if(name==='folders')  return await flowToolFolders(inp||{});
      if(name==='agency')   return await flowToolAgency(inp||{});
      /* @dev-only:start */
      if(name==='dev_storage'||name==='dev_errors'||name==='dev_cost'){
        if(!aiDevOn()) return '⚠️ доступно лише в dev-режимі';
        if(name==='dev_storage') return devToolStorage(inp||{});
        if(name==='dev_errors')  return devToolErrors(inp||{});
        if(name==='dev_cost')    return devToolCost();
      }
      if(name==='dev_selftest'||name==='dev_data'||name==='dev_eval'){
        if(!aiDevOn()) return '⚠️ доступно лише в dev-режимі';
        if(name==='dev_selftest') return await devToolSelftest();
        if(name==='dev_data')     return await devToolData(inp||{});
        if(name==='dev_eval')     return await devToolEval(inp||{});
      }
      /* @dev-only:end */
      return '⚠️ невідомий інструмент';
    }catch(e){ console.error('toolExec',name,e); return '⚠️ помилка: '+String(e.message||e); }
  }
  function flowToolRead(inp){
    const D=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'');
    const dayLine=ds=>{
      const l=(plBlocksFor(ds)||[]).slice().sort((a,b)=>a.h-b.h)
        .map(b=>plHM(b.h)+'–'+plHM(plBlockEnd(b))+' '+(b.t||'')+(b.done?' ✓':''));
      return l.join('; ')||'порожньо';
    };
    if(inp.what==='day'){ const ds=D(inp.ds)?inp.ds:plTodayStr(); return ds+': '+dayLine(ds); }
    if(inp.what==='range'){
      const t0=D(inp.from)?new Date(inp.from+'T12:00:00'):new Date(Date.now()-6*864e5);
      const t1=D(inp.to)?new Date(inp.to+'T12:00:00'):new Date();
      const out=[]; let d=new Date(t0);
      for(let i=0;i<31&&d<=t1;i++,d.setDate(d.getDate()+1)){
        const ds=ymdLocal(d), l=plBlocksFor(ds)||[];
        if(!l.length){ out.push(ds+': —'); continue; }
        const nd=l.filter(b=>!b.done);
        out.push(ds+': '+l.filter(b=>b.done).length+'/'+l.length
          +(nd.length?' (не: '+nd.slice(0,3).map(b=>b.t).join(', ')+')':''));
      }
      return out.join('\n')||'порожньо';
    }
    if(inp.what==='goals'){
      return ((goalsData.goals||[]).map(g=>{
        const st=g.steps||[], dn=st.filter(s=>s&&s.done).length;
        const nx=st.filter(s=>s&&!s.done).slice(0,3).map(s=>(s.t||s.text||'')).filter(Boolean);
        return (g.emoji||'🎯')+' '+g.name+' ('+dn+'/'+st.length+')'+(nx.length?' · далі: '+nx.join('; '):'');
      }).join('\n'))||'цілей немає';
    }
    if(inp.what==='finance') return aiFinCtx();
    if(inp.what==='backlog'){
      const t=(plData().tasks||[]).filter(x=>!x.done).slice(0,15)
        .map(x=>'· '+(x.t||x.text||x.name||'?'));
      return t.join('\n')||'беклог порожній';
    }
    if(inp.what==='folders'){
      try{
        return Object.keys(folders||{}).map(k=>folders[k])
          .map(f=>(f.emoji||'📁')+' '+f.name+(f.role==='project'?' (проєкт'+(f.due?', до '+f.due:'')+')':''))
          .join('\n')||'папок немає';
      }catch(_){ return 'папок немає'; }
    }
    if(inp.what==='diary'){
      // останні до 10 записів щоденника; кожен обрізаємо, щоб не роздути контекст
      try{
        const src=(typeof diaryEntries==='object'&&diaryEntries)?diaryEntries:{};
        const keys=Object.keys(src).filter(k=>src[k]&&src[k].text&&String(src[k].text).trim()).sort().reverse().slice(0,10);
        if(!keys.length) return 'щоденник порожній';
        return keys.map(k=>{ let t=String(src[k].text).trim(); if(t.length>500) t=t.slice(0,500)+'…'; return k+': '+t; }).join('\n\n');
      }catch(_){ return 'щоденник недоступний'; }
    }
    if(inp.what==='vision'){
      // Візія: куди йду / навіщо / фокус / кроки / опори — щоб радити не абстрактно
      try{
        const v=(typeof vzData==='object'&&vzData)?vzData:{};
        const p=[];
        if(v.statement&&String(v.statement).trim()) p.push('Куди йду: '+String(v.statement).trim());
        const why=[v.why,v.why2].map(x=>String(x||'').trim()).filter(Boolean).join(' / ');
        if(why) p.push('Навіщо: '+why);
        if(v.focus&&v.focus.title&&String(v.focus.title).trim()){
          const rng=(v.focus.start||v.focus.end)?(' ('+(v.focus.start||'?')+'–'+(v.focus.end||'?')+')'):'';
          p.push('Фокус зараз: '+String(v.focus.title).trim()+rng);
        }
        const st=(Array.isArray(v.steps)?v.steps:[]).map(s=>typeof s==='string'?s:(s&&(s.t||s.title||s.name)||'')).filter(Boolean);
        if(st.length) p.push('Кроки: '+st.slice(0,6).join('; '));
        if(Array.isArray(v.tags)&&v.tags.length) p.push('Опори/теги: '+v.tags.join(', '));
        return p.join('\n')||'Візія ще не заповнена';
      }catch(_){ return 'Візія недоступна'; }
    }
    if(inp.what==='wishes'){
      // Карта бажань: фото текстом не передати — віддаємо ціну мрії й підписи образів
      try{
        const arr=Array.isArray(wishes)?wishes:[];
        const caps=arr.map(w=>w&&w.cap&&String(w.cap).trim()).filter(Boolean);
        const p=[];
        if(typeof wishPrice==='string'&&wishPrice.trim()) p.push('Ціна мрії: '+wishPrice.trim());
        if(arr.length) p.push('Образів на карті: '+arr.length+(caps.length?(' · підписи: '+caps.map(c=>'«'+c+'»').join('; ')):' (без підписів, лише фото)'));
        return p.join('\n')||'Карта бажань порожня';
      }catch(_){ return 'Карта бажань порожня'; }
    }
    return '⚠️ невідомий what';
  }
  async function flowToolPlanner(inp){
    const arr=Array.isArray(inp.blocks)?inp.blocks:[];
    if(!arr.length) return '⚠️ порожній blocks';
    const pr={text:'',mem:[],blocks:[],move:[],done:[],del:[],steps:[],folders:[],pages:[]};
    if(inp.action==='create')      pr.blocks=arr;
    else if(inp.action==='move')   pr.move=arr;
    else if(inp.action==='done')   pr.done=arr;
    else if(inp.action==='delete') pr.del=arr;
    else return '⚠️ невідома дія';
    if(inp.action!=='done'){
      const names=arr.map(b=>b.t||'').filter(Boolean).slice(0,4).join(', ');
      const verb=inp.action==='create'?'Створити':(inp.action==='move'?'Перенести':'Видалити');
      const ok=await aiToolConfirm(verb+' блок(и): '+(names||arr.length+' шт.'),{title:'🗓️ Frequency хоче змінити планер'});
      if(!ok) return 'людина скасувала — не повторюй';
    }
    const before=arr.length;
    const r=aiCommit(pr);
    const okN=(r.nb||0)+(r.nop||0);
    let msg='виконано '+okN+' із '+before;
    if(okN<before) msg+='; не знайдено/конфлікт: перевір назви (t — фрагмент наявного блоку) і чи вільний час';
    if(inp.action==='create'){
      const ds=(arr[0]&&arr[0].ds)||plTodayStr();
      msg+='\nдень '+ds+' тепер: '+flowToolRead({what:'day',ds:ds});
    }
    return msg;
  }

  async function flowToolGoals(inp){
    const a=inp.action;
    if(a==='add_step'){
      if(!inp.t) return '⚠️ потрібен t (текст кроку)';
      const ok=await aiToolConfirm('Додати крок «'+inp.t+'» до цілі «'+(inp.goal||'')+'»',{title:'🎯 Frequency хоче змінити ціль'});
      if(!ok) return 'людина скасувала — не повторюй';
      const r=aiCommit({text:'',mem:[],blocks:[],move:[],done:[],del:[],steps:[{goal:inp.goal,t:inp.t}],folders:[],pages:[]});
      return r.ns? 'крок додано до цілі' : '⚠️ ціль не знайдена: '+inp.goal;
    }
    if(a==='check_step'){
      const gl=aiFindGoal(inp.goal); if(!gl) return '⚠️ ціль не знайдена: '+inp.goal;
      const frag=String(inp.t||'').toLowerCase().trim();
      const st=(gl.steps||[]).find(s=>s&&!s.done&&String(s.name||s.t||'').toLowerCase().includes(frag)&&frag);
      if(!st) return '⚠️ невиконаний крок «'+(inp.t||'')+'» не знайдено. Кроки: '+(gl.steps||[]).filter(s=>s&&!s.done).map(s=>s.name||s.t).slice(0,5).join('; ');
      st.done=true; saveGoals();
      try{ renderGoals(); }catch(_){}
      try{ plToast('🤖 крок виконано: '+(st.name||st.t)); }catch(_){}
      return 'крок «'+(st.name||st.t)+'» відмічено ✓';
    }
    if(a==='create_goal'){
      const nm=String(inp.goal||'').trim().slice(0,60); if(!nm) return '⚠️ порожня назва';
      if(!Array.isArray(goalsData.goals)) goalsData.goals=[];
      if(goalsData.goals.some(g=>String(g.name||'').toLowerCase()===nm.toLowerCase())) return '⚠️ така ціль уже є';
      const ok=await aiToolConfirm('Нова ціль «'+nm+'»',{title:'🎯 Frequency хоче створити ціль'});
      if(!ok) return 'людина скасувала — не повторюй';
      const colors=['#5b8def','#34c77b','#e8843c','#c77dff','#f0b429','#4ecdc4'];
      goalsData.goals.push({ id:'g_'+Date.now(), name:nm, emoji:(inp.emoji||'⭐'),
        color:colors[goalsData.goals.length%colors.length], steps:[], track:{}, days:{},
        folderKey:null, open:true });
      saveGoals(); try{ renderGoals(); }catch(_){}
      try{ plToast('🤖 нова ціль: '+nm); }catch(_){}
      return 'ціль «'+nm+'» створено';
    }
    return '⚠️ невідома дія';
  }
  function aiToolConfirm(sub,opts){
    opts=opts||{};
    return new Promise(res=>{
      try{
        const ov=document.createElement('div'); ov.className='asheet';
        ov.innerHTML='<div class="asheet-in"><div class="asheet-grip"></div>'
          +'<div class="asheet-title">'+esc(opts.title||'🤖 Frequency хоче внести зміну')+'</div>'
          +'<div class="asheet-sub">'+esc(sub)+'</div>'
          +'<button class="asheet-item primary" data-ok="1"><span class="tx"><span class="lab2">'+esc(opts.okLabel||'Підтвердити')+'</span></span></button>'
          +'<button class="asheet-cancel">Скасувати</button></div>';
        document.body.appendChild(ov);
        let done=false; const fin=v=>{ if(done)return; done=true; try{ov.remove();}catch(_){} res(v); };
        ov.onclick=e=>{ if(e.target===ov) fin(false); };
        ov.querySelector('.asheet-cancel').onclick=()=>fin(false);
        ov.querySelector('[data-ok]').onclick=()=>fin(true);
        setTimeout(()=>fin(false), 120000);
      }catch(e){ res(false); }
    });
  }
  function aiFinConfirm(sub){
    return aiToolConfirm(sub,{title:'💶 Frequency хоче записати у Фінанси'});
  }
  async function flowToolFinance(inp){
    const a=inp.action, label=String(inp.label||'').slice(0,60);
    const amt=Math.round((+inp.amount||0)*100)/100;
    /* ── дії без суми ── */
    if(a==='debt_list'){
      try{
        if(!items.length) return 'боргів немає — чисто';
        const CURS={UAH:'₴',USD:'$',EUR:'€',PLN:'zł'};
        const open=items.map(i=>({i,b:balance(i)})).filter(x=>x.b>0.0001);
        if(!open.length) return 'усі борги закриті';
        return open.map(x=>(x.i.kind==='owe'?'я винен ':'мені винен(на) ')+x.i.name+': '+x.b+' '+(CURS[x.i.cur]||x.i.cur||'')).join('\n');
      }catch(e){ return '⚠️ не зміг прочитати борги: '+String(e.message||e); }
    }
    if(a==='del_last'){
      try{
        const idx=finOps.map(o=>o&&o._src==='ai').lastIndexOf(true);
        if(idx<0) return '⚠️ немає AI-записів для видалення';
        const fo=finOps[idx];
        const ok0=await aiFinConfirm('Видалити запис: '+(fo.type==='in'?'+':'-')+fo.amount+' · '+(fo.label||''));
        if(!ok0) return 'людина скасувала — не повторюй';
        finOps.splice(idx,1); saveFinOps();
        try{ renderFinance(); }catch(_){}
        return 'запис видалено: '+(fo.type==='in'?'+':'-')+fo.amount+' («'+(fo.label||'')+'»)';
      }catch(e){ return '⚠️ '+String(e.message||e); }
    }
    /* ── грошові дії ── */
    if(!(amt>0)) return '⚠️ сума має бути > 0';
    if(amt>100000) return '⚠️ неправдоподібна сума, уточни в людини';
    if(a==='env_create'){
      const nm=String(inp.envelope||label||'').trim().slice(0,40);
      if(!nm) return '⚠️ дай назву конверта (envelope)';
      if((envelopes||[]).some(x=>String(x.name||'').toLowerCase()===nm.toLowerCase()))
        return '⚠️ конверт «'+nm+'» уже є';
      const ok1=await aiFinConfirm('Новий конверт «'+nm+'»'+(inp.goal>0?' · ціль '+Math.round(+inp.goal):''));
      if(!ok1) return 'людина скасувала — не повторюй';
      const colors=['#5b8def','#34c77b','#e8843c','#c77dff','#f0b429','#4ecdc4'];
      envelopes.push({ id:'env_ai_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),
        name:nm, emoji:'✉️', color:colors[envelopes.length%colors.length],
        goal:Math.max(0,Math.round(+inp.goal||0)), saved:0, ops:[], kind:'ціль',
        link:'main', linkLabel:'головна папка' });
      saveEnvelopes();
      try{ renderFinance(); }catch(_){}
      try{ plToast('🤖 конверт «'+nm+'» створено'); }catch(_){}
      const okDep=amt>0.009&&inp.goal!==amt;
      return 'конверт «'+nm+'» створено'+(okDep?'. Якщо треба одразу відкласти '+amt+' — виклич env_deposit':'');
    }
    if(a==='debt_add'){
      const who=String(inp.who||label||'').trim().slice(0,40);
      if(!who) return '⚠️ вкажи who — імʼя людини';
      const dir=inp.direction==='owed'?'owed':'owe';
      const cur=['UAH','USD','EUR','PLN'].includes(inp.cur)?inp.cur:'EUR';
      const CURS={UAH:'₴',USD:'$',EUR:'€',PLN:'zł'};
      const ok2=await aiFinConfirm((dir==='owe'?'Я винен ':'Мені винен(на) ')+who+': '+amt+' '+CURS[cur]+(label&&label!==who?' · '+label:''));
      if(!ok2) return 'людина скасувала — не повторюй';
      try{
        items.unshift({ id:Date.now(), kind:dir, name:who, cur,
          ops:[{ id:Date.now()+1, type:'borrow', amount:amt, date:ymdLocal(), note:(label&&label!==who)?label:'' }] });
        save(); try{ render(); }catch(_){}
        try{ plToast('🤖 борг записано: '+who+' · '+amt+' '+CURS[cur]); }catch(_){}
        return 'борг записано: '+(dir==='owe'?'ти винен ':'тобі винен(на) ')+who+' '+amt+' '+CURS[cur]+'. Він у Гроші → Борги';
      }catch(e){ return '⚠️ не зміг записати борг: '+String(e.message||e); }
    }
    if(a==='debt_pay'){
      const frag=String(inp.who||label||'').toLowerCase().trim();
      if(!frag) return '⚠️ вкажи who — чий борг гасимо';
      try{
        const cand=items.map(i=>({i,b:balance(i)})).filter(x=>x.b>0.0001&&String(x.i.name||'').toLowerCase().includes(frag));
        if(!cand.length) return '⚠️ відкритий борг не знайдено. '+await flowToolFinance({action:'debt_list'});
        const x=cand[0], pay=Math.min(amt,x.b);
        const CURS={UAH:'₴',USD:'$',EUR:'€',PLN:'zł'};
        const ok3=await aiFinConfirm('Погашення боргу '+x.i.name+': '+pay+' '+(CURS[x.i.cur]||''));
        if(!ok3) return 'людина скасувала — не повторюй';
        x.i.ops.push({ id:Date.now(), type:'repay', amount:pay, date:ymdLocal(), note:label||'' });
        save(); try{ render(); }catch(_){}
        const left=balance(x.i);
        try{ plToast('🤖 борг '+x.i.name+': -'+pay+(left<=0.0001?' · закрито ✓':'')); }catch(_){}
        return 'погашено '+pay+' по боргу з '+x.i.name+(left>0.0001?', лишилось '+left:' — борг ЗАКРИТО 🎉');
      }catch(e){ return '⚠️ '+String(e.message||e); }
    }
    const DESCR={add_expense:'Витрата',add_income:'Дохід',env_deposit:'У конверт «'+(inp.envelope||'')+'»',env_spend:'З конверта «'+(inp.envelope||'')+'»'};
    const ok=await aiFinConfirm((DESCR[a]||a)+': '+amt+(label?' · '+label:''));
    if(!ok) return 'людина скасувала запис — прийми це, не наполягай і не повторюй виклик';
    if(a==='add_expense'||a==='add_income'){
      const fo={ id:'fin_'+Date.now()+Math.random().toString(36).slice(2,6),
        type:(a==='add_income'?'in':'out'), amount:amt,
        label:label||(a==='add_income'?'Дохід':'Витрата'), date:ymdLocal(), _src:'ai' };
      try{ if(cards.length) fo.card=mainCard().id; }catch(_){}
      finOps.push(fo); saveFinOps();
      try{ renderFinance(); }catch(_){}
      try{ flowReact(a==='add_income'?'save':'spend',{amount:amt}); }catch(_){}
      try{ plToast('🤖 '+(a==='add_income'?'+':'-')+amt+' · '+fo.label); }catch(_){}
      return (a==='add_income'?'дохід ':'витрату ')+amt+' («'+fo.label+'») записано';
    }
    if(a==='env_deposit'||a==='env_spend'){
      const frag=String(inp.envelope||'').toLowerCase().trim();
      const e=(envelopes||[]).find(x=>String(x.name||'').toLowerCase().includes(frag)&&frag);
      if(!e) return '⚠️ конверт не знайдено. Є: '+(envelopes||[]).map(x=>x.name).join('; ');
      envAddOp(e, a==='env_deposit'?'in':'out', amt, label||undefined);
      try{ renderFinance(); }catch(_){}
      try{ plToast('🤖 конверт «'+e.name+'»: '+(a==='env_deposit'?'+':'-')+amt); }catch(_){}
      return 'конверт «'+e.name+'»: '+(a==='env_deposit'?'відкладено ':'витрачено ')+amt+', тепер '+envSaved(e);
    }
    return '⚠️ невідома дія';
  }
  async function flowToolPatterns(inp){
    if(inp.action==='list'){
      if(!patTrans.length) return 'активних циклів заміни немає';
      return patTrans.map(p=>{
        const w=patLast7(p);
        return '«'+(p.old||'').slice(0,40)+'» → «'+(p.neu||'').slice(0,40)+'» · 7дн: нове '+w.n+' / старе '+w.o+' · день '+patDaysFrom(p.start);
      }).join('\n');
    }
    if(inp.action==='mark_new'||inp.action==='mark_old'){
      const frag=String(inp.name||'').toLowerCase().trim();
      const p=patTrans.find(x=>frag&&((x.neu||'').toLowerCase().includes(frag)||(x.old||'').toLowerCase().includes(frag)));
      if(!p) return '⚠️ патерн не знайдено. '+await flowToolPatterns({action:'list'});
      const ok=await aiToolConfirm(inp.action==='mark_new'?'Новий патерн спрацював: «'+(p.neu||'').slice(0,40)+'»':'Зрив у старий патерн — без осуду, просто фіксуємо',{title:'🔁 Frequency хоче відмітити патерн'});
      if(!ok) return 'людина скасувала — не повторюй';
      patTCheck(p.id, inp.action==='mark_new'?'n':'o');
      return inp.action==='mark_new'
        ? 'відмічено: спрацював новий патерн «'+(p.neu||'').slice(0,40)+'» 💪'
        : 'відмічено зрив у старий патерн — без самокритики, головне що помітив';
    }
    return '⚠️ невідома дія';
  }
  async function flowToolMemory(inp){
    const t=String(inp.text||'').trim();
    if(!t) return '⚠️ порожній text';
    if(inp.action==='save'){
      const n0=aiMem.length; aiMemAdd([t.slice(0,120)]);
      return aiMem.length>n0?'запамʼятав':'вже було в памʼяті';
    }
    if(inp.action==='forget'){
      const ok=await aiToolConfirm('Забути з памʼяті: «'+t+'»',{title:'🧠 Frequency хоче забути факт'});
      if(!ok) return 'людина скасувала — не повторюй';
      const low=t.toLowerCase(), n0=aiMem.length;
      aiMem=aiMem.filter(x=>!x.toLowerCase().includes(low));
      if(aiMem.length<n0){ aiMemSave(); try{ aiRenderHead(); }catch(_){} return 'забув ('+(n0-aiMem.length)+' факт.)'; }
      return 'нічого не знайшов у памʼяті по «'+t+'»';
    }
    return '⚠️ невідома дія';
  }
  async function flowToolFolders(inp){
    const a=inp.action;
    if(typeof folders!=='object'||!Array.isArray(order)) return '⚠️ папки недоступні';
    const findKey=frag=>{
      frag=String(frag||'').toLowerCase().trim();
      if(!frag) return null;
      return Object.keys(folders).find(k=>String(folders[k].name||'').toLowerCase().includes(frag));
    };
    if(a==='create'){
      const nm=String(inp.name||'').trim().slice(0,40); if(!nm) return '⚠️ потрібна name';
      const role=(inp.role==='project')?'project':'area';
      const ok=await aiToolConfirm('Нова папка «'+nm+'»'+(role==='project'?' (проєкт)':''),{title:'📁 Frequency хоче створити папку'});
      if(!ok) return 'людина скасувала — не повторюй';
      const key='f_'+Date.now()+'_'+Math.random().toString(36).slice(2,4);
      const used=order.length;
      const due=/^\d{4}-\d{2}-\d{2}$/.test(inp.due||'')?inp.due:'';
      folders[key]={key:key, c:(typeof FOLDER_COLORS!=='undefined'?FOLDER_COLORS[used%FOLDER_COLORS.length]:'#6a7dff'),
        emoji:(inp.emoji||(role==='project'?'🚀':'📁')), name:nm, pct:0, photo:'', flayout:'a',
        pinned:false, custom:true, widgets:[], parent:'', role:role, status:role==='project'?'active':'', due:due};
      order.push(key);
      saveFolders(); try{ renderDashboard(); }catch(_){}
      return 'папку «'+nm+'» створено'+(role==='project'?' як проєкт':'');
    }
    if(a==='rename'){
      const key=findKey(inp.folder); if(!key) return '⚠️ папку не знайдено: '+inp.folder;
      const nm=String(inp.name||'').trim().slice(0,40); if(!nm) return '⚠️ потрібна нова name';
      const ok=await aiToolConfirm('Перейменувати «'+folders[key].name+'» → «'+nm+'»',{title:'📁 Frequency хоче перейменувати папку'});
      if(!ok) return 'людина скасувала — не повторюй';
      folders[key].name=nm; saveFolders(); try{ renderDashboard(); }catch(_){}
      return 'перейменовано на «'+nm+'»';
    }
    if(a==='set_role'){
      const key=findKey(inp.folder); if(!key) return '⚠️ папку не знайдено: '+inp.folder;
      const role=(inp.role==='project')?'project':'area';
      const due=/^\d{4}-\d{2}-\d{2}$/.test(inp.due||'')?inp.due:(folders[key].due||'');
      const ok=await aiToolConfirm('«'+folders[key].name+'» → '+(role==='project'?'проєкт'+(due?' до '+due:''):'звичайна папка'),{title:'📁 Frequency хоче змінити роль папки'});
      if(!ok) return 'людина скасувала — не повторюй';
      folders[key].role=role; folders[key].due=due; if(role==='project'&&!folders[key].status) folders[key].status='active';
      saveFolders(); try{ renderDashboard(); }catch(_){}
      return '«'+folders[key].name+'» тепер '+(role==='project'?'проєкт':'звичайна папка');
    }
    if(a==='delete'){
      const key=findKey(inp.folder); if(!key) return '⚠️ папку не знайдено: '+inp.folder;
      const ok=await aiToolConfirm('Видалити папку «'+folders[key].name+'» назавжди',{title:'🗑️ Frequency хоче видалити папку'});
      if(!ok) return 'людина скасувала — не повторюй';
      const nm=folders[key].name, par=folders[key].parent||'';
      Object.keys(folders).forEach(ck=>{ if(folders[ck]&&(folders[ck].parent||'')===key) folders[ck].parent=par; });
      delete folders[key]; order=order.filter(x=>x!==key);
      saveFolders(); try{ renderDashboard(); }catch(_){}
      return 'папку «'+nm+'» видалено';
    }
    return '⚠️ невідома дія';
  }
  async function flowToolAgency(inp){
    if(typeof agClients!=='function') return '⚠️ агенція недоступна';
    const a=inp.action;
    if(a==='list'){
      const cs=agClients();
      if(!cs.length) return 'клієнтів немає';
      return cs.map(c=>c.name+' · '+(c.stage||'')+' · '+(c.service||'—')+' · борг '+agClientOwe(c)+'€ · '+agClientNext(c)).join('\n');
    }
    const findClient=frag=>{
      frag=String(frag||'').toLowerCase().trim();
      if(!frag) return null;
      return agClients().find(c=>String(c.name||'').toLowerCase().includes(frag));
    };
    if(a==='add_client'){
      const nm=String(inp.name||'').trim(); if(!nm) return '⚠️ потрібне name';
      const service=AG_SERVICES.includes(inp.service)?inp.service:'';
      const stage=AG_STAGES.includes(inp.stage)?inp.stage:'Заявка';
      const ok=await aiToolConfirm('Новий клієнт «'+nm+'»'+(service?' · '+service:'')+' · '+stage,{title:'🧑\u200d💼 Frequency хоче додати клієнта'});
      if(!ok) return 'людина скасувала — не повторюй';
      agCreateClient(nm,service,stage);
      return 'клієнта «'+nm+'» додано, стадія '+stage;
    }
    if(a==='set_stage'){
      const c=findClient(inp.client); if(!c) return '⚠️ клієнта не знайдено: '+inp.client;
      const stage=AG_STAGES.includes(inp.stage)?inp.stage:null; if(!stage) return '⚠️ невідома стадія. Доступні: '+AG_STAGES.join(', ');
      const ok=await aiToolConfirm('«'+c.name+'»: '+c.stage+' → '+stage,{title:'🧑\u200d💼 Frequency хоче змінити стадію клієнта'});
      if(!ok) return 'людина скасувала — не повторюй';
      c.stage=stage; saveBoard(); try{ renderAgOps(); }catch(_){} try{ renderClient(); }catch(_){}
      return '«'+c.name+'» тепер на стадії '+stage;
    }
    if(a==='add_payment'){
      const c=findClient(inp.client); if(!c) return '⚠️ клієнта не знайдено: '+inp.client;
      const amt=Math.round((+inp.amount||0)*100)/100; if(!(amt>0)) return '⚠️ сума має бути > 0';
      const label=String(inp.label||((c.payments||[]).length===0?'Аванс':'Доплата')).slice(0,40);
      const ok=await aiToolConfirm('Платіж від «'+c.name+'»: '+amt+'€ · '+label,{title:'💶 Frequency хоче записати платіж клієнта'});
      if(!ok) return 'людина скасувала — не повторюй';
      const pay={id:'p'+Date.now()+Math.random().toString(36).slice(2,4), amount:amt, label:label, date:ymdLocal()};
      (c.payments=c.payments||[]).push(pay);
      try{ agApplyPaymentEffects(c, pay); }catch(_){}
      saveBoard(); try{saveFinOps();}catch(_){} try{renderFinance();}catch(_){} try{ renderClient(); }catch(_){}
      return 'платіж '+amt+'€ від «'+c.name+'» записано, залишок боргу '+agClientOwe(c)+'€';
    }
    return '⚠️ невідома дія';
  }
  function aiPickModel(q,hop){
    q=String(q||'');
    if(hop>=3) return 'claude-sonnet-4-6';
    if(q.length>220) return 'claude-sonnet-4-6';
    if(/розплануй|проаналізуй|розпиши|чому|стратег|тиждень|місяць|порівняй/i.test(q)) return 'claude-sonnet-4-6';
    return 'claude-haiku-4-5';
  }

  function aiUsageAdd(model,u){
    try{
      const k='ai_usage'; const d=JSON.parse(localStorage.getItem(k)||'{}');
      const ds=plTodayStr(); d[ds]=d[ds]||{};
      const m=/haiku/.test(String(model))?'h':'s';
      const e=d[ds][m]=d[ds][m]||{i:0,o:0,cr:0,cw:0,n:0};
      e.i+=u.i||0; e.o+=u.o||0; e.cr+=u.cr||0; e.cw+=u.cw||0; e.n++;
      const ks=Object.keys(d).sort(); while(ks.length>62){ delete d[ks.shift()]; }
      localStorage.setItem(k,JSON.stringify(d));
    }catch(_){}
  }
  try{ window.__flowAiRaw=aiCallRaw; }catch(_){}
  async function aiCallRaw(payload,onDelta){
    const res=await fetch(aiEndpoint(),{method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify(Object.assign({stream:true},payload))});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const _u={i:0,o:0,cr:0,cw:0};
    const ctype=String(res.headers.get('content-type')||'');
    if(ctype.indexOf('text/event-stream')>=0&&res.body&&res.body.getReader){
      const rd=res.body.getReader(), dec=new TextDecoder();
      let buf='', blocks=[], stop='', textFull='';
      for(;;){
        const {done,value}=await rd.read();
        if(done) break;
        buf+=dec.decode(value,{stream:true});
        const lines=buf.split('\n'); buf=lines.pop();
        for(const ln of lines){
          if(ln.indexOf('data:')!==0) continue;
          const p=ln.slice(5).trim();
          if(!p||p==='[DONE]') continue;
          let ev; try{ ev=JSON.parse(p); }catch(_){ continue; }
          if(ev.type==='content_block_start'&&ev.content_block){
            const cb=ev.content_block;
            blocks[ev.index]= cb.type==='tool_use'
              ? {type:'tool_use',id:cb.id,name:cb.name,_json:''}
              : {type:'text',text:cb.text||''};
          } else if(ev.type==='content_block_delta'&&ev.delta){
            const b=blocks[ev.index]; if(!b) continue;
            if(ev.delta.type==='text_delta'&&typeof ev.delta.text==='string'){
              b.text=(b.text||'')+ev.delta.text; textFull+=ev.delta.text;
              if(onDelta) onDelta(textFull);
            } else if(ev.delta.type==='input_json_delta'){
              b._json=(b._json||'')+(ev.delta.partial_json||'');
            }
          } else if(ev.type==='message_start'&&ev.message&&ev.message.usage){
            const uu=ev.message.usage;
            _u.i=uu.input_tokens||0; _u.cr=uu.cache_read_input_tokens||0; _u.cw=uu.cache_creation_input_tokens||0;
          } else if(ev.type==='message_delta'&&ev.delta&&ev.delta.stop_reason){
            stop=ev.delta.stop_reason;
            if(ev.usage&&ev.usage.output_tokens) _u.o=ev.usage.output_tokens;
          } else if(ev.type==='error'){
            throw new Error((ev.error&&ev.error.message)||'stream error');
          }
        }
      }
      blocks=blocks.filter(Boolean).map(b=>{
        if(b.type==='tool_use'){ try{ b.input=b._json?JSON.parse(b._json):{}; }catch(_){ b.input={}; } delete b._json; }
        return b;
      });
      aiUsageAdd(payload.model,_u);
      return {content:blocks, stop_reason:stop||'end_turn'};
    }
    const data=await res.json();
    if(data.usage) aiUsageAdd(payload.model,{i:data.usage.input_tokens||0,o:data.usage.output_tokens||0,
      cr:data.usage.cache_read_input_tokens||0,cw:data.usage.cache_creation_input_tokens||0});
    if(onDelta&&Array.isArray(data.content)){
      const t=data.content.filter(x=>x.type==='text').map(x=>x.text).join('\n');
      if(t) onDelta(t);
    }
    return {content:data.content||[], stop_reason:data.stop_reason||'end_turn'};
  }

  async function aiAgentTurn(sysStable,sysDynamic,msgs,userQ,onDelta){
    const system=[
      {type:'text',text:sysStable,cache_control:{type:'ephemeral'}},
      {type:'text',text:sysDynamic}
    ];
    const conv=msgs.slice();
    const dev=aiDevOn();
    const TOOLS=dev?FLOW_TOOLS.concat(DEV_TOOLS):FLOW_TOOLS;
    let toolsUsed=0;
    aiTraceStart();
    for(let hop=0;hop<6;hop++){
      const resp=await aiCallRaw({
        model:dev?'claude-sonnet-4-6':aiPickModel(userQ,hop), system:system, tools:TOOLS,
        max_tokens:2048, messages:conv
      },onDelta);
      conv.push({role:'assistant',content:resp.content});
      if(resp.stop_reason!=='tool_use'){
        aiAgentSetStatus('');
        const fin=resp.content.filter(b=>b.type==='text').map(b=>b.text).join('\n').trim();
        return fin||(toolsUsed?'✅ Зроблено.':'Не зміг відповісти — спробуй ще раз.');
      }
      const results=[];
      for(const b of resp.content){
        if(b.type!=='tool_use') continue;
        toolsUsed++;
        const ti=aiTraceStep(b.name,b.input);
        const out=await flowToolExec(b.name,b.input);
        aiTraceEnd(ti);
        results.push({type:'tool_result',tool_use_id:b.id,
          content:String(out).slice(0,1500)});
      }
      conv.push({role:'user',content:results});
      aiAgentSetStatus('🧠 аналізую результат…');
      if(toolsUsed>10) break;
    }
    aiAgentSetStatus('');
    return 'Забагато кроків — сформулюй задачу вужче.';
  }

  /* ── контекст ── */
  function aiFinMonthNet(){
    try{
      const ym=ymLocal(); let inc=0,out=0;
      (finOps||[]).forEach(o=>{ if(o.envSpend) return; if(String(o.date||'').slice(0,7)!==ym) return;
        if(o.type==='in') inc+=o.amount; else out+=o.amount; });
      return inc-out;
    }catch(_){ return null; }
  }
  function aiFinCtx(){
    const parts=[];
    try{
      const ym=ymLocal(); let inc=0,out=0;
      (finOps||[]).forEach(o=>{ if(o.envSpend) return; if(String(o.date||'').slice(0,7)!==ym) return;
        if(o.type==='in') inc+=o.amount; else out+=o.amount; });
      parts.push('Місяць: +'+fmt(inc)+' / -'+fmt(out));
    }catch(_){}
    try{ parts.push('Гаманець: '+incomeSummary()); }catch(_){}
    try{
      if(envelopes&&envelopes.length){
        parts.push('Конверти: '+envelopes.slice(0,5).map(e=>{
          const sv=envSaved(e), gl=+e.goal||0;
          return e.name+' '+fmt(sv)+(gl?'/'+fmt(gl):'');
        }).join('; '));
      }
    }catch(_){}
    try{ const d=debtSummary(); if(d&&d!=='—') parts.push('Борги (нетто): '+d); }catch(_){}
    return parts.length?parts.join('\n'):'—';
  }
  function aiCtx(parts){
    const want=k=>!parts||parts.indexOf(k)>=0;
    const g=goalsData, p=plData(), td=plTodayStr(), n=new Date();
    const DNF=['неділя','понеділок','вівторок','середа','четвер','пʼятниця','субота'];
    const out=['Сьогодні: '+td+', '+DNF[n.getDay()]+', зараз '+plHM(n.getHours()+n.getMinutes()/60)];
    if(want('day')){
      const blocks=(plBlocksFor(td)||[]).slice().sort((a,b)=>a.h-b.h)
        .map(b=>plHM(b.h)+'–'+plHM(plBlockEnd(b))+' '+(b.t||'')
          +(b.link&&b.link.goalName?' →🎯 '+b.link.goalName:'')
          +(b.done?' ✓':'')).join('; ')||'порожньо';
      out.push('Блоки сьогодні: '+blocks);
      out.push('Стрік: '+plStreak()+' днів');
      out.push('Відкритих задач у беклозі: '+(p.tasks||[]).filter(t=>!t.done).length);
    }
    if(want('week')){
      const wk=[];
      for(let i=1;i<=7;i++){
        const d=new Date(); d.setDate(d.getDate()-i);
        const ds=ymdLocal(d), l=p.blocksByDay[ds]||[];
        if(l.length) wk.push(DNF[d.getDay()].slice(0,2)+' '+l.filter(b=>b.done).length+'/'+l.length
          +(l.filter(b=>!b.done).length?' (не: '+l.filter(b=>!b.done).slice(0,3).map(b=>b.t).join(', ')+')':''));
      }
      out.push('Тиждень назад: '+(wk.join(' · ')||'порожньо'));
    }
    if(want('goals')){
      const goals=(g.goals||[]).slice(0,6).map(gl=>{
        const st=gl.steps||[]; const dn=st.filter(s=>s&&s.done).length;
        return (gl.emoji||'🎯')+' '+gl.name+' ('+dn+'/'+st.length+' кроків)';
      }).join('; ')||'немає';
      out.push('Цілі: '+goals);
      out.push('Точка Б: '+(((g.pointB||'').trim().slice(0,400))||'—'));
    }
    if(want('fin')) out.push('Фінанси:\n'+aiFinCtx());
    if(aiMem.length) out.push('ПАМʼЯТЬ ПРО ЛЮДИНУ (з минулих розмов): '+aiMem.join(' | '));
    if(aiSum) out.push('РЕЗЮМЕ СТАРІШОЇ ІСТОРІЇ: '+aiSum);
    out.push('РЕЖИМ ТОНУ: '+aiMood());
    return out.join('\n');
  }
  /* ── дії ── */
  function aiFindGoal(q){
    q=String(q||'').toLowerCase().trim(); if(!q) return null;
    return (goalsData.goals||[]).find(g=>String(g.name||'').toLowerCase().includes(q))||null;
  }
  function aiParseBlocks(txt){
    txt=String(txt||'');
    const r={text:txt,blocks:[],steps:[],folders:[],move:[],done:[],del:[],mem:[],pages:[]};
    // FLOW_MEM: довготривалі факти (окремий рядок)
    const mi=txt.indexOf('FLOW_MEM:');
    if(mi>=0){
      const tail=txt.slice(mi+9);
      const nl=tail.indexOf('\n');
      const line=(nl>=0?tail.slice(0,nl):tail).trim();
      try{ const jm=JSON.parse(line); if(Array.isArray(jm)) r.mem=jm.filter(x=>typeof x==='string'); }catch(_){}
      txt=txt.slice(0,mi)+(nl>=0?tail.slice(nl+1):'');
    }
    // FLOW_OPS (новий) або FLOW_BLOCKS (legacy)
    let i=txt.indexOf('FLOW_OPS:'), off=9;
    if(i<0){ i=txt.indexOf('FLOW_BLOCKS:'); off=12; }
    if(i>=0){
      try{
        const j=JSON.parse(txt.slice(i+off).trim());
        if(j&&Array.isArray(j.blocks)) r.blocks=j.blocks;
        if(j&&Array.isArray(j.steps)) r.steps=j.steps;
        if(j&&Array.isArray(j.folders)) r.folders=j.folders;
        if(j&&Array.isArray(j.move)) r.move=j.move;
        if(j&&Array.isArray(j.done)) r.done=j.done;
        if(j&&Array.isArray(j.del)) r.del=j.del;
        if(j&&Array.isArray(j.pages)) r.pages=j.pages;
      }catch(_){}
      txt=txt.slice(0,i);
    }
    r.text=txt.trim();
    return r;
  }
  function aiOpsCount(pr){
    return (pr.blocks||[]).length+(pr.steps||[]).length+(pr.folders||[]).length
      +(pr.move||[]).length+(pr.done||[]).length+(pr.del||[]).length+(pr.pages||[]).length;
  }
  // текст для показу під час стріму: ховаємо службові хвости, поки вони друкуються
  function aiStreamText(t){
    t=String(t||'');
    const cut=Math.min(...['FLOW_OPS:','FLOW_BLOCKS:','FLOW_MEM:','FLOW_'].map(k=>{ const i=t.indexOf(k); return i<0?Infinity:i; }));
    return (cut===Infinity?t:t.slice(0,cut)).trim();
  }
  function aiFindBlockByT(ds,q){
    q=String(q||'').toLowerCase().trim(); if(!q) return null;
    const list=plBlocksFor(ds)||[];
    return list.find(b=>String(b.t||'').toLowerCase().includes(q))||null;
  }
  // знайти папку за фрагментом назви (для сторінок)
  function aiFindFolderKey(q){
    q=String(q||'').toLowerCase().trim(); if(!q) return null;
    try{
      const keys=Object.keys(folders||{});
      return keys.find(k=>folders[k]&&String(folders[k].name||'').toLowerCase().includes(q))||null;
    }catch(_){ return null; }
  }
  // зібрати блок сторінки з типу+тексту, які дає AI
  function aiBuildPageBlock(t,x,extra){
    extra=extra||{};
    const map={h1:'h1',h2:'h2',h3:'h3',note:'note',task:'task',bullet:'bullet',num:'num',
      quote:'quote',divider:'divider',code:'code',callout:'callout',section:'section',
      habit:'heatmap',progress:'pbar',countdown:'countdown'};
    const type=map[String(t||'').toLowerCase()]||'note';
    let b;
    try{ b=(typeof buildBlock==='function')?buildBlock(type):null; }catch(_){ b=null; }
    if(!b) b={id:Date.now()+Math.random(),type:type,title:''};
    const val=String(x||'').slice(0,400);
    if(type==='task') Object.assign(b,{text:val,done:false});
    else if(type==='divider'){ /* без тексту */ }
    else if(type==='heatmap'){ b.title=val||'Звичка'; if(!b.marks) b.marks={}; }
    else if(type==='pbar'){ b.title=val||'Прогрес'; b.value=Math.max(0,Math.min(100,parseInt(extra.value)||0)); }
    else if(type==='countdown'){ b.title=val||'Відлік'; b.label=val||''; if(/^\d{4}-\d{2}-\d{2}$/.test(extra.target||'')) b.target=extra.target; }
    else if(['h1','h2','h3','quote','code','callout','section','bullet','num'].includes(type)){ b.text=val; b.title=b.title||''; }
    else b.text=val;
    return b;
  }
  function aiApplyPages(pr,undo){
    let np=0;
    (pr.pages||[]).forEach(pg=>{
      if(!pg||!pg.title&&!(Array.isArray(pg.blocks)&&pg.blocks.length)) return;
      const fk=aiFindFolderKey(pg.folder);
      if(!fk) return;                                   // немає такої папки — пропускаємо
      try{
        if(typeof boards!=='object') return;
        if(!Array.isArray(boards[fk])) boards[fk]=[];
        const kids=(Array.isArray(pg.blocks)?pg.blocks:[]).slice(0,12)
          .map(bl=>aiBuildPageBlock(bl&&bl.t, bl&&bl.x, bl)).filter(Boolean);
        const page={id:Date.now()+Math.random(), type:'page',
          title:String(pg.title||'Сторінка').slice(0,80), children:kids, open:true, _src:'ai'};
        boards[fk].push(page);
        if(typeof saveBoard==='function') saveBoard();
        undo.pages.push({fk:fk, id:page.id});
        np++;
      }catch(e){ console.error('aiPage',e); }
    });
    if(np){ try{ if(typeof renderBoard==='function') renderBoard(); }catch(_){} }
    return np;
  }
  // застосувати пакет; повертає {nb,ns,undo} — undo для пакетного відкату
  function aiApplyActions(pr){
    let nb=0,ns=0,nf=0,nop=0,np=0; const undo={blocks:[],steps:[],folders:[],moves:[],dones:[],dels:[],pages:[]};
    // перенос наявних блоків
    (pr.move||[]).forEach(mv=>{
      const ds=/^\d{4}-\d{2}-\d{2}$/.test(mv.ds||'')?mv.ds:plTodayStr();
      const b=aiFindBlockByT(ds,mv.t); if(!b) return;
      const h=+mv.h, endH=+mv.endH;
      if(!(h>=0&&h<24)||!(endH>h&&endH<=24)) return;
      undo.moves.push({ds:ds,id:b.id,h:b.h,endH:b.endH});
      b.h=h; b.endH=endH; nop++;
    });
    // відмітити виконання
    (pr.done||[]).forEach(dn=>{
      const ds=/^\d{4}-\d{2}-\d{2}$/.test(dn.ds||'')?dn.ds:plTodayStr();
      const b=aiFindBlockByT(ds,dn.t); if(!b||b.done) return;
      const p=plData();
      undo.dones.push({ds:ds,id:b.id});
      if((p.selDate||plTodayStr())===ds){ plCompleteBlock(b.id); }   // повні ефекти (ціль/звичка/дохід)
      else b.done=true;
      nop++;
    });
    // видалити блоки
    (pr.del||[]).forEach(dl=>{
      const ds=/^\d{4}-\d{2}-\d{2}$/.test(dl.ds||'')?dl.ds:plTodayStr();
      const list=plBlocksFor(ds);
      const bi=list.findIndex(b=>String(b.t||'').toLowerCase().includes(String(dl.t||'').toLowerCase().trim())&&dl.t);
      if(bi<0) return;
      const b=list[bi];
      if(b.done){ try{ plUncompleteEffects(b,ds); }catch(_){} }
      undo.dels.push({ds:ds,idx:bi,block:JSON.parse(JSON.stringify(b))});
      list.splice(bi,1); nop++;
    });
    // папки на головному екрані
    (pr.folders||[]).forEach(f=>{
      if(!f||!f.name) return;
      try{
        if(typeof folders!=='object'||!Array.isArray(order)) return;
        const key='f_'+Date.now()+'_'+Math.random().toString(36).slice(2,4);
        const used=order.length;
        const role=(f.role==='project')?'project':'area';
        const due=/^\d{4}-\d{2}-\d{2}$/.test(f.due||'')?f.due:'';
        folders[key]={key:key, c:(typeof FOLDER_COLORS!=='undefined'?FOLDER_COLORS[used%FOLDER_COLORS.length]:'#6a7dff'),
          emoji:(f.emoji||(role==='project'?'🚀':'📁')), name:String(f.name).slice(0,40), pct:0, photo:'', flayout:'a',
          pinned:false, custom:true, widgets:[], parent:'', role:role, status:role==='project'?'active':'', due:due};
        order.push(key);
        // віджети з каталогу
        const wids=[];
        (Array.isArray(f.widgets)?f.widgets:[]).forEach(wid=>{
          wid=String(wid||'').trim();
          if(typeof WIDGET_CATALOG!=='undefined'&&WIDGET_CATALOG[wid]&&typeof addWidgetToFolder==='function'){
            try{ addWidgetToFolder(key,wid); wids.push(wid); }catch(_){}
          }
        });
        if(typeof saveFolders==='function') saveFolders();
        try{ renderDashboard(); }catch(_){}
        undo.folders.push(key);
        nf++;
      }catch(e){ console.error('aiFolder',e); }
    });
    const freshSteps={};
    (pr.steps||[]).forEach(s=>{
      if(!s||!s.t||!s.goal) return;
      const gl=aiFindGoal(s.goal); if(!gl) return;
      gl.steps=gl.steps||[];
      const st={id:'st_ai_'+Date.now()+'_'+Math.random().toString(36).slice(2,4), name:String(s.t).slice(0,120), done:false, _src:'ai'};
      gl.steps.push(st);
      freshSteps[gl.id||gl.name]=st.id;
      undo.steps.push({gid:gl.id||gl.name, sid:st.id});
      ns++;
    });
    (pr.blocks||[]).forEach(b=>{
      const ds=/^\d{4}-\d{2}-\d{2}$/.test(b.ds||'')?b.ds:plTodayStr();
      const h=+b.h, endH=+b.endH;
      if(!(h>=0&&h<24)||!(endH>h&&endH<=24)||!b.t) return;
      const nb2={id:'b_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), h:h, endH:endH,
        t:String(b.t).slice(0,80), c:'val', tag:'', done:false, _src:'ai'};
      const gl=b.goal?aiFindGoal(b.goal):null;
      if(gl){
        const gid=gl.id||gl.name;
        nb2.link={type:'goalstep', goalId:gid, goalName:String(gl.name||'')};
        if(freshSteps[gid]){ nb2.link.stepId=freshSteps[gid]; delete freshSteps[gid]; }
        nb2.tag=typeof plLinkTag==='function'?(plLinkTag(nb2.link)||''):'';
      }
      plBlocksFor(ds).push(nb2);
      undo.blocks.push({ds:ds, id:nb2.id});
      nb++;
    });
    if(nb||ns||nf||nop){ saveGoals(); plRerender(); }
    np=aiApplyPages(pr,undo);
    return {nb:nb,ns:ns,nf:nf,nop:nop,np:np,undo:undo};
  }
  function aiCommit(pr){
    const r=aiApplyActions(pr);
    if(r.nb||r.ns||r.nf||r.nop||r.np){
      aiLog.unshift({ts:Date.now(), nb:r.nb, ns:r.ns, nf:r.nf||0, nop:r.nop||0, np:r.np||0, undo:r.undo});
      aiChatSave();
      try{ window.platform.haptic('medium'); }catch(_){}
      plToast('🤖 '+[r.nb?'блоків: '+r.nb:'',r.nop?'змін: '+r.nop:'',r.ns?'кроків: '+r.ns:'',r.nf?'папок: '+r.nf:'',r.np?'сторінок: '+r.np:''].filter(Boolean).join(', '));
      try{
        let rk='create';
        if(r.nf) rk='folder';
        if((r.nb+r.ns+r.nf+r.nop+r.np)>=4) rk='celebrate';
        flowReact(rk,{say:true,big:rk==='celebrate'});
      }catch(_){}
    }
    return r;
  }
  function aiUndo(ts){
    const i=aiLog.findIndex(l=>l.ts===ts); if(i<0) return;
    const L=aiLog[i];
    (L.undo&&L.undo.blocks||[]).forEach(x=>{
      const list=plBlocksFor(x.ds);
      const bi=list.findIndex(b=>b.id===x.id);
      if(bi>=0){ const b=list[bi]; if(b.done){ try{ plUncompleteEffects(b,x.ds); }catch(_){} } list.splice(bi,1); }
    });
    (L.undo&&L.undo.steps||[]).forEach(x=>{
      const g=(goalsData.goals||[]).find(gg=>(gg.id||gg.name)===x.gid);
      if(g&&g.steps) g.steps=g.steps.filter(s=>s.id!==x.sid);
    });
    (L.undo&&L.undo.folders||[]).forEach(key=>{
      try{
        if(typeof folderWidgets==='object'&&folderWidgets[key]) delete folderWidgets[key];
        if(typeof saveFolderWidgets==='function') saveFolderWidgets();
        if(typeof folders==='object'&&folders[key]){ delete folders[key]; }
        if(Array.isArray(order)){ const oi=order.indexOf(key); if(oi>=0) order.splice(oi,1); }
        if(typeof saveFolders==='function') saveFolders();
        try{ renderDashboard(); }catch(_){}
      }catch(e){ console.error('aiUndoFolder',e); }
    });
    (L.undo&&L.undo.moves||[]).forEach(x=>{
      const b=(plBlocksFor(x.ds)||[]).find(bb=>bb.id===x.id);
      if(b){ b.h=x.h; b.endH=x.endH; }
    });
    (L.undo&&L.undo.dones||[]).forEach(x=>{
      const b=(plBlocksFor(x.ds)||[]).find(bb=>bb.id===x.id);
      if(b&&b.done){ b.done=false; try{ plUncompleteEffects(b,x.ds); }catch(_){} }
    });
    (L.undo&&L.undo.dels||[]).forEach(x=>{
      try{
        const list=plBlocksFor(x.ds);
        const idx=Math.min(Math.max(0,x.idx|0),list.length);
        list.splice(idx,0,x.block);
      }catch(e){ console.error('aiUndoDel',e); }
    });
    (L.undo&&L.undo.pages||[]).forEach(x=>{
      try{
        if(typeof boards==='object'&&Array.isArray(boards[x.fk])){
          boards[x.fk]=boards[x.fk].filter(b=>String(b.id)!==String(x.id));
          if(typeof saveBoard==='function') saveBoard();
          try{ if(typeof renderBoard==='function') renderBoard(); }catch(_){}
        }
      }catch(e){ console.error('aiUndoPage',e); }
    });
    aiLog.splice(i,1);
    saveGoals(); plRerender(); aiChatSave();
    plToast('↩ Пакет відкочено');
    aiRenderBody();
  }
