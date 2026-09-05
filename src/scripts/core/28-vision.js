  /* ════════ ВІЗІЯ: бенто-екран «куди я йду · фокус · план · звʼязки» ════════ */
  const VZKEY='vision_v1';
  let vzData={ statement:'', tags:[], why:'', why2:'',
    focus:{title:'', start:'', end:''}, steps:[], folderLinks:[] };
  function vzNorm(){
    if(!vzData||typeof vzData!=='object') vzData={};
    if(typeof vzData.statement!=='string') vzData.statement='';
    if(!Array.isArray(vzData.tags)) vzData.tags=[];
    if(typeof vzData.why!=='string') vzData.why='';
    if(typeof vzData.why2!=='string') vzData.why2='';
    if(!vzData.focus||typeof vzData.focus!=='object') vzData.focus={title:'',start:'',end:''};
    if(typeof vzData.focus.title!=='string') vzData.focus.title='';
    if(typeof vzData.focus.start!=='string') vzData.focus.start='';
    if(typeof vzData.focus.end!=='string') vzData.focus.end='';
    if(!Array.isArray(vzData.steps)) vzData.steps=[];
    if(!Array.isArray(vzData.folderLinks)) vzData.folderLinks=[];
    if(!Array.isArray(vzData.plans)) vzData.plans=[];
    vzData.plans.forEach(p=>{ if(!Array.isArray(p.items)) p.items=[]; if(!p.term) p.term='week'; });
    if(!vzData.ritual||typeof vzData.ritual!=='object') vzData.ritual={};
    if(!Array.isArray(vzData.ritual.items)) vzData.ritual.items=[
      {id:'rz1', t:'Склянка води + вікно', min:2},
      {id:'rz2', t:'Зарядка / розтяжка', min:10},
      {id:'rz3', t:'Прочитати візію вголос', min:1},
      {id:'rz4', t:'Обрати 1 головний блок дня', min:3},
    ];
    if(!vzData.ritual.doneBy||typeof vzData.ritual.doneBy!=='object') vzData.ritual.doneBy={};
    if(!vzData.contract||typeof vzData.contract!=='object') vzData.contract={};
    if(typeof vzData.contract.text!=='string') vzData.contract.text='';
    if(typeof vzData.contract.deadline!=='string') vzData.contract.deadline='';
    if(typeof vzData.contract.name!=='string') vzData.contract.name='';
    if(typeof vzData.contract.signed!=='string') vzData.contract.signed='';
    if(!vzData.contract.log||typeof vzData.contract.log!=='object') vzData.contract.log={};
  }
  function vzSave(){ try{ const p=window.storage.set(VZKEY,JSON.stringify(vzData),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }

  /* ── живі значення зі звʼязаних модулів (нічого не копіюємо — читаємо напряму) ── */
  function vzFin(){ try{
    const base=(fx&&fx.base)||'UAH'; const sym=(typeof CUR==='object'&&CUR[base])||'₴';
    const tot=envTotalSaved(); const goal=envelopes.reduce((s,e)=>s+(+e.goal||0),0);
    return { bal:fmt(finBalance())+' '+sym, envPct:goal?Math.min(100,Math.round(tot/goal*100)):null };
  }catch(_){ return {bal:'—', envPct:null}; } }
  function vzDay(){ try{ const l=plBlocksFor(plTodayStr());
    return {done:l.filter(b=>b.done).length, total:l.length};
  }catch(_){ return {done:0,total:0}; } }
  function vzGoalsInfo(){ try{ const gs=goalsData.goals||[]; if(!gs.length) return null;
    const avg=Math.round(gs.reduce((s,x)=>s+goalPctP(x),0)/gs.length);
    return {avg, done:gs.filter(x=>goalPctP(x)>=100).length, total:gs.length};
  }catch(_){ return null; } }
  function vzStreak(){ try{
    const p=plData(); const isHab=b=>(b&&b.c==='hab')||(b&&b.link&&b.link.type==='habit');
    const doneOn=ds=>{ const l=p.blocksByDay&&p.blocksByDay[ds]; return Array.isArray(l)&&l.some(b=>isHab(b)&&b.done); };
    let d=new Date(), n=0;
    if(!doneOn(ymdLocal(d))) d=new Date(d.getTime()-86400000); // сьогодні ще попереду — не рвемо серію
    for(let i=0;i<180;i++){ if(doneOn(ymdLocal(d))){ n++; d=new Date(d.getTime()-86400000); } else break; }
    return n;
  }catch(_){ return 0; } }
  function vzFocusCalc(){
    const f=vzData.focus; let pct=0, left=null;
    if(f.start&&f.end){
      const s=+new Date(f.start+'T00:00:00'), e=+new Date(f.end+'T23:59:59'), n=Date.now();
      if(e>s){ pct=Math.max(0,Math.min(100,Math.round((n-s)/(e-s)*100))); left=Math.max(0,Math.ceil((e-n)/86400000)); }
    }
    return {pct,left};
  }

  /* ── коуч: локальні підказки з живих даних + місток до Флоу ── */
  function vzCoachMsg(day,gi,stk,fin){
    const open=vzData.steps.filter(s=>!s.done);
    const next=open.length?(open[0].t||''):'';
    if(!vzData.statement.trim()) return 'Почни з головного: сформулюй одним реченням, куди ти йдеш. Далі привʼяжемо до цього день, гроші й цілі.';
    if(day.total===0) return 'Сьогодні в планері порожньо. Додай хоч один блок, який наближає до візії'+(next?' — напр. до кроку «'+next+'»':'')+'.';
    if(day.done===0) return 'Жоден блок сьогодні ще не закрито ('+day.done+'/'+day.total+'). Обери найлегший і зроби зараз — рух почнеться.';
    if(stk===0) return 'Серія звичок обнулилась. Одна маленька звичка сьогодні — і маршрут до Точки Б знову тримається.';
    if(fin.envPct!=null && fin.envPct<50) return 'Конверти наповнені на '+fin.envPct+'%. Невеликий переказ сьогодні прискорить '+(next?'крок «'+next+'»':'фінансову частину візії')+'.';
    if(day.done<day.total) return 'Сьогодні '+day.done+'/'+day.total+' блоків. Закрий ще один — і день зарахується на користь візії.';
    return 'День іде за планом: '+day.done+'/'+day.total+', серія '+stk+' дн. Наступний крок: '+(next?'«'+next+'»':'переглянь план нижче')+'.';
  }

  /* ── редагування ── */
  function vzEditStatement(){ inputModal({title:'Куди я йду — одним реченням', value:vzData.statement,
    placeholder:'Напр.: своя справа, дохід €3k/міс, Frequency — 100 користувачів',
    onOk:v=>{ vzData.statement=v; vzSave(); renderVision(); }}); }
  function vzEditTags(){ inputModal({title:'Теги напрямку (через кому)', value:vzData.tags.join(', '),
    placeholder:'Напр.: 🏡 Переїзд, 💼 Справа, 📱 Frequency',
    onOk:v=>{ vzData.tags=v.split(',').map(s=>s.trim()).filter(Boolean).slice(0,6); vzSave(); renderVision(); }}); }
  function vzEditWhy(side){ const cur=side==='b'?vzData.why2:vzData.why;
    inputModal({title:side==='b'?'Нагадування собі (зворот картки)':'Для чого мені це',
      value:cur, placeholder:side==='b'?'Фраза-якір на важкі дні':'Чесна відповідь: заради чого все це',
      onOk:v=>{ if(side==='b')vzData.why2=v; else vzData.why=v; vzSave(); renderVision(); }}); }
  function vzEditFocus(){
    inputModal({title:'Мій фокус зараз (одна річ)', value:vzData.focus.title,
      placeholder:'Напр.: Запуск проєкту — 5 угод', onOk:t=>{
        vzData.focus.title=t;
        inputModal({title:'Початок фокусу (РРРР-ММ-ДД)', value:vzData.focus.start||ymdLocal(),
          placeholder:ymdLocal(), onOk:s=>{
            if(/^\d{4}-\d{2}-\d{2}$/.test(s)) vzData.focus.start=s;
            inputModal({title:'Дедлайн фокусу (РРРР-ММ-ДД)', value:vzData.focus.end,
              placeholder:'Напр.: '+(new Date().getFullYear())+'-09-30', onOk:e=>{
                if(/^\d{4}-\d{2}-\d{2}$/.test(e)) vzData.focus.end=e;
                vzSave(); renderVision();
              }});
          }});
      }});
  }
  function vzAddStep(){
    inputModal({title:'Новий крок плану', placeholder:'Напр.: Переїзд у Братиславу', onOk:t=>{
      if(!t) return;
      inputModal({title:'Підпис (необовʼязково)', placeholder:'Деталі, звʼязки, критерій готовності', onOk:d=>{
        vzData.steps.push({ id:'vs_'+Date.now().toString(36), q:'Q'+(Math.floor(new Date().getMonth()/3)+1),
          t, d:d||'', done:false });
        vzSave(); renderVision();
      }});
    }});
  }
  function vzStepMenu(id){
    const s=vzData.steps.find(x=>x.id===id); if(!s) return;
    actionSheet({ title:s.t||'Крок', sub:s.d||'', items:[
      {ic:'✅', label:s.done?'Позначити невиконаним':'Позначити виконаним', primary:true,
        onClick:()=>{ s.done=!s.done; vzSave(); renderVision(); try{window.platform.haptic('success');}catch(_){} }},
      {ic:'edit', label:'Назва', sub:s.t, onClick:()=>inputModal({title:'Назва кроку', value:s.t, onOk:v=>{ if(v)s.t=v; vzSave(); renderVision(); }})},
      {ic:'edit', label:'Підпис', sub:s.d||'без підпису', onClick:()=>inputModal({title:'Підпис кроку', value:s.d, onOk:v=>{ s.d=v; vzSave(); renderVision(); }})},
      {ic:'edit', label:'Мітка', sub:'Зараз: '+(s.q||'—'), onClick:()=>inputModal({title:'Мітка (напр. Q3, Осінь)', value:s.q||'', onOk:v=>{ s.q=(v||'').slice(0,6); vzSave(); renderVision(); }})},
      (s.folder&&folders[s.folder]
        ? {ic:folders[s.folder].emoji||'📁', label:'Відкрити папку', sub:folders[s.folder].name+' · привʼязана', onClick:()=>goFolder(s.folder)}
        : {ic:'📂', label:'Привʼязати папку', sub:'Тап по чіпу в кроці відкриє її', onClick:()=>vzPickFolder('Папка для кроку «'+s.t+'»',k=>{ s.folder=k; vzSave(); renderVision(); })}),
      (s.folder ? {ic:'trash', label:'Відвʼязати папку', onClick:()=>{ s.folder=''; vzSave(); renderVision(); }} : null),
      {ic:'⭐', label:'Зробити ціллю', sub:'Перенести крок у Цілі', onClick:()=>vzStepToGoal(s)},
      {ic:'trash', label:'Видалити крок', danger:true,
        onClick:()=>confirmSheet({title:'Видалити крок?', sub:s.t, onOk:()=>{ vzData.steps=vzData.steps.filter(x=>x.id!==id); vzSave(); renderVision(); }})},
    ].filter(Boolean)});
  }
  /* ── вибір папки (спільний пікер) ── */
  function vzPickFolder(title,cb){
    let list=[]; try{ list=(order||[]).filter(k=>folders[k] && k!==VISION_FKEY); }catch(_){ list=[]; }
    if(!list.length){ flowAlert('Папок ще немає — створи їх на Огляді.','Звʼязки'); return; }
    actionSheet({ title:title||'Обери папку',
      items:list.slice(0,14).map(k=>({ ic:folders[k].emoji||'📁', label:folders[k].name||k,
        onClick:()=>cb(k) })) });
  }
  /* ── перенесення у Цілі ── */
  const VZ_GOAL_COLORS=['#e8843c','#34c77b','#5b8def','#c77dff','#ff6b9d','#f0b429'];
  function vzAfterGoalCreated(name){
    actionSheet({ title:'Перенесено в Цілі ⭐', sub:name, cancel:'Ок',
      items:[{ic:'🎯', label:'Відкрити Цілі', primary:true,
        onClick:()=>{ try{ goalsData.tab='goals'; saveGoals(); goGoals(); }catch(_){} }}] });
  }
  function vzStepToGoal(s){
    const gid='g_vz_'+Date.now().toString(36);
    goalsData.goals.push({ id:gid, name:s.t, emoji:'🧭', color:VZ_GOAL_COLORS[goalsData.goals.length%VZ_GOAL_COLORS.length],
      steps:(s.d?[{id:'st_vz_'+Date.now().toString(36), name:s.d, done:false}]:[]), track:{}, days:{},
      folderKey:s.folder||null, open:true });
    saveGoals(); vzAfterGoalCreated(s.t);
  }
  function vzPlanToGoal(p){
    if(!p.items.length){ flowAlert('Додай у віджет хоча б один крок — тоді буде що переносити.','План'); return; }
    const gid='g_vz_'+Date.now().toString(36);
    goalsData.goals.push({ id:gid, name:p.title, emoji:p.emoji||'🧭',
      color:VZ_GOAL_COLORS[goalsData.goals.length%VZ_GOAL_COLORS.length],
      steps:p.items.map(it=>({id:'st_vz_'+it.id, name:it.t, done:!!it.done})), track:{}, days:{},
      folderKey:p.folder||null, open:true });
    saveGoals(); vzAfterGoalCreated(p.title);
  }
  /* ── віджети-плани («Англійська · план на місяць») ── */
  const VZ_TERMS=[['day','День'],['week','Тижд.'],['month','Місяць'],['quarter','Квартал'],['year','Рік']];
  const VZ_TERM_LABEL={day:'день',week:'тиждень',month:'місяць',quarter:'квартал',year:'рік'};
  function vzAddPlan(){
    inputModal({title:'Назва віджет-плану', placeholder:'Напр.: Англійська мова', emoji:true, emojiVal:'📚', onOk:(t,emo)=>{
      if(!t) return;
      vzData.plans.push({ id:'vp_'+Date.now().toString(36), title:t, emoji:emo||'🗂', term:'month', folder:'', items:[] });
      vzSave(); renderVision();
    }});
  }
  function vzPlanAddItem(p){
    inputModal({title:'Крок у «'+p.title+'» · план на '+(VZ_TERM_LABEL[p.term]||''), placeholder:'Напр.: 3 уроки на тиждень', onOk:t=>{
      if(!t) return;
      p.items.push({ id:'vi_'+Date.now().toString(36), t, done:false });
      vzSave(); renderVision();
    }});
  }
  function vzPlanMenu(id){
    const p=vzData.plans.find(x=>x.id===id); if(!p) return;
    const items=[
      {ic:'⭐', label:'Перенести в Цілі', sub:'Стане ціллю з кроками', primary:true, onClick:()=>vzPlanToGoal(p)},
      {ic:'edit', label:'Назва та емодзі', sub:p.title, onClick:()=>inputModal({title:'Назва віджета', value:p.title, emoji:true, emojiVal:p.emoji||'', onOk:(v,emo)=>{ if(v)p.title=v; p.emoji=emo||p.emoji; vzSave(); renderVision(); }})},
    ];
    if(p.folder && folders[p.folder]){
      items.push({ic:folders[p.folder].emoji||'📁', label:'Відкрити папку', sub:folders[p.folder].name, onClick:()=>goFolder(p.folder)});
      items.push({ic:'trash', label:'Відвʼязати папку', onClick:()=>{ p.folder=''; vzSave(); renderVision(); }});
    } else {
      items.push({ic:'📂', label:'Привʼязати папку', sub:'Для швидкого переходу в роботу', onClick:()=>vzPickFolder('Папка для «'+p.title+'»',k=>{ p.folder=k; vzSave(); renderVision(); })});
    }
    items.push({ic:'🧹', label:'Прибрати виконані кроки', onClick:()=>{ p.items=p.items.filter(i=>!i.done); vzSave(); renderVision(); }});
    items.push({ic:'trash', label:'Видалити віджет', danger:true,
      onClick:()=>confirmSheet({title:'Видалити віджет-план?', sub:p.title, onOk:()=>{ vzData.plans=vzData.plans.filter(x=>x.id!==id); vzSave(); renderVision(); }})});
    actionSheet({ title:(p.emoji?p.emoji+' ':'')+p.title, sub:'План на '+(VZ_TERM_LABEL[p.term]||''), items });
  }
  function vzAddFolderLink(){
    let list=[]; try{ list=(order||[]).filter(k=>folders[k] && !vzData.folderLinks.includes(k)); }catch(_){ list=[]; }
    if(!list.length){ flowAlert('Всі папки вже привʼязані або папок ще немає.','Звʼязки'); return; }
    actionSheet({ title:'Привʼязати папку до візії',
      sub:'Папка зʼявиться серед звʼязків з живим лічильником',
      items:list.slice(0,12).map(k=>({ ic:folders[k].emoji||'📁', label:folders[k].name||k,
        onClick:()=>{ vzData.folderLinks.push(k); vzSave(); renderVision(); } })) });
  }
  function vzFolderChipMenu(k){
    actionSheet({ title:(folders[k]&&folders[k].name)||'Папка', items:[
      {ic:'📂', label:'Відкрити папку', primary:true, onClick:()=>goFolder(k)},
      {ic:'trash', label:'Відвʼязати від візії', danger:true,
        onClick:()=>{ vzData.folderLinks=vzData.folderLinks.filter(x=>x!==k); vzSave(); renderVision(); }},
    ]});
  }

  /* ── ранковий запуск ── */
  function vzRzToday(){ const ds=plTodayStr(); if(!Array.isArray(vzData.ritual.doneBy[ds])) vzData.ritual.doneBy[ds]=[]; return vzData.ritual.doneBy[ds]; }
  function vzRzDayFull(ds){ const arr=vzData.ritual.doneBy[ds];
    return Array.isArray(arr) && vzData.ritual.items.length>0 && vzData.ritual.items.every(it=>arr.includes(it.id)); }
  function vzRzToggle(id){
    const arr=vzRzToday(); const i=arr.indexOf(id);
    if(i>=0) arr.splice(i,1); else arr.push(id);
    // прибирання старих днів (тримаємо 90)
    try{ const keys=Object.keys(vzData.ritual.doneBy).sort(); while(keys.length>90){ delete vzData.ritual.doneBy[keys.shift()]; } }catch(_){}
    vzSave(); renderVision(); try{window.platform.haptic('success');}catch(_){}
  }
  function vzRzMenu(){
    const items=[{ic:'＋', label:'Додати пункт ритуалу', primary:true, onClick:()=>{
      inputModal({title:'Пункт ритуалу', placeholder:'Напр.: 5 хв журналінг', onOk:t=>{ if(!t) return;
        inputModal({title:'Хвилини (число)', placeholder:'5', onOk:m=>{
          vzData.ritual.items.push({id:'rz_'+Date.now().toString(36), t, min:Math.max(1,parseInt(m,10)||1)});
          vzSave(); renderVision(); }});
      }});
    }}];
    vzData.ritual.items.forEach(it=>items.push({ic:'edit', label:it.t, sub:it.min+' хв · тап — редагувати', onClick:()=>{
      actionSheet({title:it.t, items:[
        {ic:'edit', label:'Назва', onClick:()=>inputModal({title:'Назва пункту', value:it.t, onOk:v=>{ if(v)it.t=v; vzSave(); renderVision(); }})},
        {ic:'edit', label:'Хвилини', sub:it.min+' хв', onClick:()=>inputModal({title:'Хвилини', value:String(it.min), onOk:v=>{ it.min=Math.max(1,parseInt(v,10)||it.min); vzSave(); renderVision(); }})},
        {ic:'trash', label:'Видалити пункт', danger:true, onClick:()=>{ vzData.ritual.items=vzData.ritual.items.filter(x=>x.id!==it.id); vzSave(); renderVision(); }},
      ]});
    }}));
    items.push({ic:'🧹', label:'Скинути сьогодні', onClick:()=>{ vzData.ritual.doneBy[plTodayStr()]=[]; vzSave(); renderVision(); }});
    actionSheet({title:'🌅 Ранковий запуск', sub:'Ритуал, що вмикає день', items});
  }
  /* ── контракт із собою ── */
  function vzKtStats(){
    let y=0,n=0; Object.values(vzData.contract.log).forEach(v=>{ if(v==='y')y++; else if(v==='n')n++; });
    const rel=(y+n)?Math.round(y/(y+n)*100):null;
    let left=null; if(vzData.contract.deadline){
      left=Math.max(0,Math.ceil((+new Date(vzData.contract.deadline+'T23:59:59')-Date.now())/86400000)); }
    return {y,n,rel,left};
  }
  function vzKtAnswer(v){
    vzData.contract.log[plTodayStr()]=v; vzSave(); renderVision();
    try{window.platform.haptic(v==='y'?'success':'warning');}catch(_){}
  }
  function vzKtMenu(){
    const kt=vzData.contract;
    actionSheet({title:'✍️ Контракт із собою', sub:kt.text?'':'Одне чесне зобовʼязання + щоденне Так/Ні', items:[
      {ic:'edit', label:kt.text?'Текст контракту':'Скласти контракт', sub:kt.text||'«Я щодня … навіть у поганий день»', primary:!kt.text,
        onClick:()=>inputModal({title:'Текст контракту (одне речення)', value:kt.text,
          placeholder:'Я щодня роблю мінімум один крок до мети — навіть на 10 хв', onOk:v=>{
            kt.text=v; if(v && !kt.signed) kt.signed=plTodayStr(); vzSave(); renderVision(); }})},
      {ic:'edit', label:'Дедлайн', sub:kt.deadline||'РРРР-ММ-ДД', onClick:()=>inputModal({title:'Дедлайн контракту (РРРР-ММ-ДД)', value:kt.deadline,
        placeholder:new Date().getFullYear()+'-09-30', onOk:v=>{ if(/^\d{4}-\d{2}-\d{2}$/.test(v)||v==='') kt.deadline=v; vzSave(); renderVision(); }})},
      {ic:'edit', label:'Підпис (імʼя)', sub:kt.name||'не задано', onClick:()=>inputModal({title:'Імʼя для підпису', value:kt.name, onOk:v=>{ kt.name=v; vzSave(); renderVision(); }})},
      (kt.text?{ic:'📜', label:'Переглянути контракт', onClick:()=>{
        const s=vzKtStats();
        flowAlert(kt.text+'\n\nПідписано: '+(kt.signed||'—')+(kt.deadline?' · до '+kt.deadline:'')+'\nДотримано: '+s.y+' · зриви: '+s.n,'✍️ '+(kt.name||'Контракт'));
      }}:null),
      {ic:'🧹', label:'Скинути статистику', danger:true, onClick:()=>confirmSheet({title:'Скинути статистику контракту?', okLabel:'Скинути',
        onOk:()=>{ vzData.contract.log={}; vzSave(); renderVision(); }})},
    ].filter(Boolean)});
  }
  /* ── фокус-режим «один крок» ── */
  let vzFocus={on:false, i:0, sec:1500, timer:null};
  function vzQueue(){
    const q=[];
    vzData.steps.filter(s=>!s.done).forEach(s=>q.push({kind:'step', id:s.id, t:s.t,
      src:'крок плану'+(s.q?' · '+s.q:''), folder:s.folder||''}));
    vzData.plans.forEach(p=>p.items.filter(i=>!i.done).forEach(i=>q.push({kind:'plan', pid:p.id, id:i.id, t:i.t,
      src:(p.emoji?p.emoji+' ':'')+p.title+' · план на '+(VZ_TERM_LABEL[p.term]||''), folder:p.folder||''})));
    try{ plBlocksFor(plTodayStr()).filter(b=>!b.done).forEach(b=>q.push({kind:'block', id:b.id, t:b.t||'Блок',
      src:'Планер · сьогодні'+(typeof b.h==='number'?' о '+b.h+':00':''), folder:b.folder||''})); }catch(_){}
    return q;
  }
  function vzFocusStop(){ if(vzFocus.timer){ clearInterval(vzFocus.timer); vzFocus.timer=null; } }
  function vzFocusDone(item){
    try{
      if(item.kind==='step'){ const s=vzData.steps.find(x=>x.id===item.id); if(s){ s.done=true; vzSave(); } }
      else if(item.kind==='plan'){ const p=vzData.plans.find(x=>x.id===item.pid);
        const it=p&&p.items.find(x=>x.id===item.id); if(it){ it.done=true; vzSave(); } }
      else if(item.kind==='block'){ const l=plBlocksFor(plTodayStr());
        const b=l.find(x=>x.id===item.id); if(b){ b.done=true; saveGoals(); } }
    }catch(_){}
    try{window.platform.haptic('success');}catch(_){}
  }
  function renderVisionFocus(c){
    vzFocusStop();
    const q=vzQueue();
    if(!q.length){
      c.innerHTML=`<div class="vz-ok-top"><span>ФОКУС-РЕЖИМ</span>
          <button class="zen" data-vzok="exit">◫ Вся Візія</button></div>
        <div class="vz-ok-empty">🎉 Черга порожня — всі кроки й блоки на сьогодні закриті.<br>Додай нові кроки в план або блоки в Планер.</div>`;
      c.querySelector('[data-vzok="exit"]').onclick=()=>{ vzFocus.on=false; renderVision(); };
      return;
    }
    if(vzFocus.i>=q.length) vzFocus.i=0;
    const it=q[vzFocus.i];
    const nxt=q[(vzFocus.i+1)%q.length], nxt2=q[(vzFocus.i+2)%q.length];
    const fl=(it.folder&&folders[it.folder])?folders[it.folder]:null;
    const tfmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
    c.innerHTML=`
      <div class="vz-ok-top"><span>ФОКУС-РЕЖИМ · ${vzFocus.i+1} із ${q.length}</span>
        <button class="zen" data-vzok="exit">◫ Вся Візія</button></div>
      <div class="vz-ok-card" id="vzOkCard">
        <div class="vz-eyebrow">Наступний крок</div>
        <h2>${esc(it.t)}</h2>
        <div class="from">${esc(it.src)}</div>
        ${fl?`<button class="fold" data-vzok="fold">${fl.emoji||'📁'} ${esc(fl.name)} — відкрити ›</button>`:''}
        <div class="vz-ok-timer" id="vzOkTimer">${tfmt(vzFocus.sec)}</div>
      </div>
      <div class="vz-ok-acts">
        <button class="vz-ok-later" data-vzok="later">Пізніше</button>
        <button class="vz-ok-done" data-vzok="done">Зробив ✓</button>
      </div>
      ${q.length>1?`<div class="vz-ok-left">Далі: <b>${esc(nxt.t)}</b>${q.length>2?' · потім <b>'+esc(nxt2.t)+'</b>':''}</div>`:''}`;
    const tEl=c.querySelector('#vzOkTimer');
    vzFocus.timer=setInterval(()=>{ if(vzFocus.sec>0){ vzFocus.sec--; if(tEl) tEl.textContent=tfmt(vzFocus.sec); } },1000);
    const swipeNext=()=>{ const card=c.querySelector('#vzOkCard'); if(card) card.classList.add('swipe');
      setTimeout(()=>{ vzFocus.sec=1500; renderVision(); },240); };
    c.querySelector('[data-vzok="exit"]').onclick=()=>{ vzFocus.on=false; vzFocusStop(); renderVision(); };
    c.querySelector('[data-vzok="done"]').onclick=()=>{ vzFocusDone(it); swipeNext(); };
    c.querySelector('[data-vzok="later"]').onclick=()=>{ vzFocus.i=(vzFocus.i+1)%q.length; swipeNext(); };
    const fb=c.querySelector('[data-vzok="fold"]'); if(fb) fb.onclick=()=>{ vzFocusStop(); goFolder(it.folder); };
  }
  /* ── рендер ── */
  function renderVision(){
    vzNorm();
    const c=document.getElementById('visionBody'); if(!c) return;
    vzFocusStop();
    if(vzFocus.on){ renderVisionFocus(c); return; }
    const day=vzDay(), gi=vzGoalsInfo(), stk=vzStreak(), fin=vzFin(), fc=vzFocusCalc();
    const st=vzData.statement.trim();
    const tags=vzData.tags.length?vzData.tags:(st?[]:['тапни ✎, щоб додати теги']);
    const CIRC=264;
    const foldChips=vzData.folderLinks.filter(k=>{ try{ return !!folders[k]; }catch(_){ return false; } })
      .map(k=>{ let cnt=0; try{ cnt=(boards&&Array.isArray(boards[k]))?boards[k].length:0; }catch(_){}
        return `<button class="vz-lchip" data-vzfold="${k}">
          <span>${folders[k].emoji||'📁'} ${esc(folders[k].name||k)}</span><b>${cnt}</b><small>блоків</small></button>`; }).join('');
    // ранковий запуск: стан
    const rzDone=vzRzToday(), rzAll=vzRzDayFull(plTodayStr());
    const rzChain=(()=>{ const L=['Н','П','В','С','Ч','П','С']; let h='';
      for(let i=6;i>=0;i--){ const d=new Date(Date.now()-i*86400000), ds=ymdLocal(d);
        h+=`<div class="vz-rz-d ${vzRzDayFull(ds)?'done':''} ${i===0?'today':''}">${L[d.getDay()]}</div>`; }
      return h; })();
    const rzStreak=(()=>{ let n=0,d=new Date();
      if(!vzRzDayFull(ymdLocal(d))) d=new Date(d.getTime()-86400000);
      for(let i=0;i<90;i++){ if(vzRzDayFull(ymdLocal(d))){ n++; d=new Date(d.getTime()-86400000); } else break; } return n; })();
    const hourNow=new Date().getHours();
    // контракт: стан
    const kt=vzData.contract, ks=vzKtStats(), ktToday=kt.log[plTodayStr()];
    c.innerHTML=`
    <div class="vz-grid">
      <button class="vz-focusbar" data-vz="focusmode">🎯 Фокус-режим: один крок</button>

      <div class="vz-rz">
        <button class="vz-edit" data-vz="rzmenu">✎</button>
        <div class="vz-eyebrow">🌅 Ранковий запуск${hourNow<10?' · до 10:00':''}</div>
        <div class="vz-rz-chain">${rzChain}<small>🔥 ${rzStreak} поспіль</small></div>
        ${vzData.ritual.items.map(it=>`
          <div class="vz-rz-item ${rzDone.includes(it.id)?'done':''}" data-vzrz="${it.id}">
            <span class="cb">✓</span><div><b>${esc(it.t)}</b></div><span class="min">${it.min} хв</span>
          </div>`).join('')}
        <div class="vz-rz-ignite ${rzAll?'on':''}">${rzAll
          ?('🔥 День запалено!'+(st?`<span class="big">«${esc(st)}»</span>`:''))
          :'Закрий усі пункти — і день «запалиться»'}</div>
      </div>

      <div class="vz-card vz-dest">
        <button class="vz-edit" data-vz="statement">✎</button>
        <div class="vz-eyebrow">Куди я йду</div>
        <h2 class="${st?'':'empty'}" data-vz="statement-h">${st?esc(st):'Тапни й опиши одним реченням, де ти хочеш опинитись…'}</h2>
        <div class="vz-tags" data-vz="tags">${tags.map(t=>`<span class="vz-tag">${esc(t)}</span>`).join('')}</div>
      </div>

      <div class="vz-card vz-ring" data-vz="focus" title="Тапни, щоб змінити фокус">
        <svg viewBox="0 0 96 96">
          <defs><linearGradient id="vzGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="#f0b429"/>
          </linearGradient></defs>
          <circle class="bgc" cx="48" cy="48" r="42"/>
          <circle class="fgc" cx="48" cy="48" r="42"/>
        </svg>
        <div class="pct">${fc.pct}%</div>
        <div class="lbl">Мій фокус<br>${vzData.focus.title?esc(vzData.focus.title):'тапни, щоб задати'}${fc.left!=null?' · '+fc.left+' дн':''}</div>
      </div>

      <div class="vz-card vz-kt">
        <button class="vz-edit" data-vz="ktmenu">✎</button>
        <div class="vz-eyebrow">✍️ Контракт із собою</div>
        ${kt.text?`
          <div class="rel">${ks.rel!=null?ks.rel+'%':'—'}<small>надійність слова собі</small></div>
          <div class="sc"><i class="g">✓ ${ks.y}</i> · <i class="r">✗ ${ks.n}</i>${ks.left!=null?' · '+ks.left+' дн':''}</div>
          ${ktToday==null?`
            <div class="vz-kt-btns">
              <button class="vz-kt-y" data-vzkt="y">✓ Виконав</button>
              <button class="vz-kt-n" data-vzkt="n">✗ Зірвав</button>
            </div>`
          :`<div class="vz-kt-st ${ktToday==='y'?'y':'n'}">${ktToday==='y'?'Сьогодні: слово дотримано ✓':'Сьогодні: зрив · завтра ×2'}</div>`}
        `:`<div class="vz-kt-empty">Одне чесне зобовʼязання собі + щоденне «Так/Ні».<br>Тапни ✎ і склади контракт.</div>`}
      </div>

      <div class="vz-card vz-plan">
        <div class="vz-plan-h">
          <div class="vz-eyebrow">План · кроки до Точки Б</div>
          <button class="vz-addstep" data-vz="addstep">＋ крок</button>
        </div>
        ${vzData.steps.length?vzData.steps.map(s=>`
          <div class="vz-step ${s.done?'done':''}">
            <span class="q" data-vztoggle="${s.id}">${esc(s.q||'•')}</span>
            <div class="tx" data-vzmenu="${s.id}"><b>${esc(s.t)}</b>${s.d?`<small>${esc(s.d)}</small>`:''}${(s.folder&&folders[s.folder])?`<span class="vz-fchip" data-vzstepgo="${s.folder}">${folders[s.folder].emoji||'📁'} ${esc(folders[s.folder].name||'')} ›</span>`:''}</div>
            <span class="dots" data-vzmenu2="${s.id}">⋯</span>
          </div>`).join('')
        :`<div class="vz-empty">Розбий шлях на 3–5 великих кроків: що має статись цього кварталу, наступного, і перед фінішем.</div>`}
      </div>

      ${vzData.plans.map(p=>{ const dn=p.items.filter(i=>i.done).length, tt=p.items.length,
        pct=tt?Math.round(dn/tt*100):0, fl=(p.folder&&folders[p.folder])?folders[p.folder]:null;
        return `
      <div class="vz-card vz-pw" data-vzpw="${p.id}">
        <div class="vz-pw-h">
          <div class="em">${esc(p.emoji||'🗂')}</div>
          <b>${esc(p.title)}<br><span class="vz-pw-cnt" style="margin:0">план на ${VZ_TERM_LABEL[p.term]||''}</span></b>
          <span class="dots" data-vzpwmenu="${p.id}">⋯</span>
        </div>
        <div class="vz-term">${VZ_TERMS.map(([k,l])=>`<button class="${p.term===k?'on':''}" data-vzterm="${p.id}:${k}">${l}</button>`).join('')}</div>
        <div class="vz-pw-bar"><i style="width:${pct}%"></i></div>
        <div class="vz-pw-cnt">${tt?dn+'/'+tt+' кроків · '+pct+'%':'ще без кроків'}</div>
        <div class="vz-pw-items">${p.items.map(it=>`
          <div class="vz-pw-item ${it.done?'done':''}" data-vzpwit="${p.id}:${it.id}">
            <span class="cb">✓</span><span>${esc(it.t)}</span><span class="x" data-vzpwdel="${p.id}:${it.id}">×</span>
          </div>`).join('')}</div>
        <button class="vz-additem" data-vzpwadd="${p.id}">＋ пункт плану</button>
        <div class="vz-pw-foot">
          ${fl?`<button class="fold" data-vzpwfold="${p.id}">${fl.emoji||'📁'} ${esc(fl.name)} — працювати ›</button>`
              :`<button class="fold" data-vzpwlink="${p.id}">📂 Привʼязати папку</button>`}
          <button class="togoal" data-vzpwgoal="${p.id}">⭐ У Цілі</button>
        </div>
      </div>`; }).join('')}
      <button class="vz-addpw" data-vz="addplan">＋ Віджет-план · напр. «Англійська мова — план на місяць»</button>

      <div class="vz-links">
        <button class="vz-lchip" data-vzgo="fin"><span>💶 Фінанси</span><b>${fin.bal}</b>${fin.envPct!=null?`<small>конверти ${fin.envPct}%</small>`:`<small style="color:var(--muted)">баланс</small>`}</button>
        <button class="vz-lchip" data-vzgo="plan"><span>📅 День</span><b>${day.done}/${day.total}</b><small${day.total&&day.done>=day.total?'':' style="color:var(--muted)"'}>блоки сьогодні</small></button>
        <button class="vz-lchip" data-vzgo="goals"><span>🎯 Цілі</span><b>${gi?gi.avg+'%':'—'}</b><small style="color:var(--muted)">${gi?gi.done+'/'+gi.total+' готово':'додай першу'}</small></button>
        <button class="vz-lchip" data-vzgo="plan"><span>🔥 Серія</span><b>${stk} дн</b><small${stk?'':' style="color:var(--muted)"'}>звички поспіль</small></button>
        ${foldChips}
        <button class="vz-lchip add" data-vz="addfold" title="Привʼязати папку">＋</button>
      </div>

      <div class="vz-coach">
        <div class="av">✦</div>
        <div>
          <b>Флоу · коуч</b>
          <p>${esc(vzCoachMsg(day,gi,stk,fin))}</p>
          <button data-vz="askai">Обговорити з Флоу</button>
        </div>
      </div>
    </div>`;
    // анімація кільця
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const r=c.querySelector('.vz-ring .fgc'); if(r) r.style.strokeDashoffset=String(CIRC*(1-fc.pct/100));
    }));
    // дії
    const on=(sel,fn)=>{ c.querySelectorAll(sel).forEach(el=>el.addEventListener('click',fn)); };
    on('[data-vz="statement"],[data-vz="statement-h"]',e=>{ e.stopPropagation(); vzEditStatement(); });
    on('[data-vz="tags"]',()=>vzEditTags());
    on('[data-vz="focus"]',()=>vzEditFocus());
    on('[data-vz="addstep"]',()=>vzAddStep());
    on('[data-vz="addfold"]',()=>vzAddFolderLink());
    on('[data-vz="askai"]',()=>{ if(window.aiChatSheet) window.aiChatSheet(); });
    on('[data-vz="focusmode"]',()=>{ vzFocus.on=true; vzFocus.i=0; vzFocus.sec=1500; renderVision(); });
    on('[data-vz="rzmenu"]',e=>{ e.stopPropagation(); vzRzMenu(); });
    c.querySelectorAll('[data-vzrz]').forEach(el=>el.addEventListener('click',()=>vzRzToggle(el.dataset.vzrz)));
    on('[data-vz="ktmenu"]',e=>{ e.stopPropagation(); vzKtMenu(); });
    c.querySelectorAll('[data-vzkt]').forEach(el=>el.addEventListener('click',()=>vzKtAnswer(el.dataset.vzkt)));
    c.querySelectorAll('[data-vztoggle]').forEach(el=>el.addEventListener('click',()=>{
      const s=vzData.steps.find(x=>x.id===el.dataset.vztoggle); if(!s) return;
      s.done=!s.done; vzSave(); renderVision(); try{window.platform.haptic('success');}catch(_){}
    }));
    c.querySelectorAll('[data-vzmenu],[data-vzmenu2]').forEach(el=>el.addEventListener('click',()=>{
      vzStepMenu(el.dataset.vzmenu||el.dataset.vzmenu2);
    }));
    c.querySelectorAll('[data-vzgo]').forEach(el=>el.addEventListener('click',()=>{
      const k=el.dataset.vzgo;
      if(k==='fin') goFinance(); else if(k==='plan') goPlanner(); else if(k==='goals') goGoals();
    }));
    c.querySelectorAll('[data-vzfold]').forEach(el=>el.addEventListener('click',()=>vzFolderChipMenu(el.dataset.vzfold)));
    // кроки → папки
    c.querySelectorAll('[data-vzstepgo]').forEach(el=>el.addEventListener('click',e=>{ e.stopPropagation(); goFolder(el.dataset.vzstepgo); }));
    // віджети-плани
    on('[data-vz="addplan"]',()=>vzAddPlan());
    c.querySelectorAll('[data-vzpwmenu]').forEach(el=>el.addEventListener('click',()=>vzPlanMenu(el.dataset.vzpwmenu)));
    c.querySelectorAll('[data-vzterm]').forEach(el=>el.addEventListener('click',()=>{
      const [pid,term]=el.dataset.vzterm.split(':'); const p=vzData.plans.find(x=>x.id===pid); if(!p) return;
      p.term=term; vzSave(); renderVision(); try{window.platform.haptic('light');}catch(_){}
    }));
    c.querySelectorAll('[data-vzpwit]').forEach(el=>el.addEventListener('click',()=>{
      const [pid,iid]=el.dataset.vzpwit.split(':'); const p=vzData.plans.find(x=>x.id===pid); if(!p) return;
      const it=p.items.find(x=>x.id===iid); if(!it) return;
      it.done=!it.done; vzSave(); renderVision(); try{window.platform.haptic('success');}catch(_){}
    }));
    c.querySelectorAll('[data-vzpwdel]').forEach(el=>el.addEventListener('click',e=>{
      e.stopPropagation();
      const [pid,iid]=el.dataset.vzpwdel.split(':'); const p=vzData.plans.find(x=>x.id===pid); if(!p) return;
      p.items=p.items.filter(x=>x.id!==iid); vzSave(); renderVision();
    }));
    c.querySelectorAll('[data-vzpwadd]').forEach(el=>el.addEventListener('click',()=>{
      const p=vzData.plans.find(x=>x.id===el.dataset.vzpwadd); if(p) vzPlanAddItem(p);
    }));
    c.querySelectorAll('[data-vzpwfold]').forEach(el=>el.addEventListener('click',()=>{
      const p=vzData.plans.find(x=>x.id===el.dataset.vzpwfold); if(p&&p.folder) goFolder(p.folder);
    }));
    c.querySelectorAll('[data-vzpwlink]').forEach(el=>el.addEventListener('click',()=>{
      const p=vzData.plans.find(x=>x.id===el.dataset.vzpwlink); if(!p) return;
      vzPickFolder('Папка для «'+p.title+'»',k=>{ p.folder=k; vzSave(); renderVision(); });
    }));
    c.querySelectorAll('[data-vzpwgoal]').forEach(el=>el.addEventListener('click',()=>{
      const p=vzData.plans.find(x=>x.id===el.dataset.vzpwgoal); if(p) vzPlanToGoal(p);
    }));
  }
  function goVision(){ try{ renderVision(); show('scr-vision'); }catch(e){ console.error('goVision',e); } }
  window.goVision=goVision; window.renderVision=renderVision;
  { const b=document.getElementById('vzBack'); if(b) b.onclick=()=>{ try{ goHome(); }catch(_){ show('scr-home'); } }; }

