  /* ═══════════ НАГАДУВАННЯ (на завданнях) ═══════════ */
  // зберігаємо у блоці task: b.remindAt (ISO). Нотифікація — системна, якщо дозволена, інакше шторка.
  function setTaskReminder(id){
    const b=getBlock(id); if(!b) return;
    const cur=b.remindAt? new Date(b.remindAt): null;
    const def=cur? toLocalInput(cur): toLocalInput(new Date(Date.now()+3600e3));
    inputModal({title:'Нагадати про «'+(b.title||'завдання')+'»', value:def, placeholder:'РРРР-ММ-ДД ГГ:ХХ', onOk:(val)=>{
    if(val===null||val===undefined) return;
    if(val.trim()===''){ b.remindAt=null; saveBoard(); renderBoard(); return; }
    const dt=parseLocalInput(val.trim());
    if(!dt||isNaN(dt.getTime())){ flowAlert('Не вдалося розпізнати дату. Формат: 2026-07-01 09:30'); return; }
    b.remindAt=dt.toISOString();
    saveBoard(); renderBoard();
    scheduleReminder(b);
    try{ window.platform.haptic('light'); }catch(_){}
    }});
  }
  function toLocalInput(d){
    const p=n=>String(n).padStart(2,'0');
    return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());
  }
  function remindLabel(iso){
    try{ const d=new Date(iso); const p=n=>String(n).padStart(2,'0');
      const today=new Date(); const isToday=d.toDateString()===today.toDateString();
      const tmrw=new Date(Date.now()+864e5); const isTmrw=d.toDateString()===tmrw.toDateString();
      const time=p(d.getHours())+':'+p(d.getMinutes());
      if(isToday) return 'сьогодні '+time;
      if(isTmrw) return 'завтра '+time;
      return p(d.getDate())+'.'+p(d.getMonth()+1)+' '+time;
    }catch(_){ return ''; }
  }
  function parseLocalInput(s){
    const m=s.match(/(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})/);
    if(!m) return null;
    return new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5]);
  }
  // активні таймери в межах сесії (для нагадувань у найближчі ~24 год)
  const reminderTimers={};
  function scheduleReminder(b){
    if(!b||!b.remindAt) return;
    const when=new Date(b.remindAt).getTime();
    const delay=when-Date.now();
    if(reminderTimers[b.id]){ clearTimeout(reminderTimers[b.id]); delete reminderTimers[b.id]; }
    if(delay<=0||delay>24*3600e3) return; // далеке — спрацює при наступному відкритті
    reminderTimers[b.id]=setTimeout(()=>{ fireReminder(b); },delay);
  }
  function fireReminder(b){
    const msg='⏰ '+(b.title||'Нагадування');
    try{
      if('Notification'in window && Notification.permission==='granted'){
        new Notification('Frequency',{ body:msg });
      } else { flowAlert(msg); }
    }catch(_){ try{ flowAlert(msg); }catch(__){} }
    window.platform.haptic('warning');
  }
  // при завантаженні — перепланувати найближчі нагадування з усіх дошок
  function rescheduleAllReminders(){
    try{
      Object.keys(boards).forEach(k=>{
        const stack=[...(boards[k]||[])];
        while(stack.length){
          const b=stack.pop();
          if(b&&b.remindAt&&b.type==='task') scheduleReminder(b);
          if(b&&isContainer(b)&&Array.isArray(b.children)) stack.push(...b.children);
        }
      });
    }catch(_){}
  }
  // показати прострочені нагадування, які мали спрацювати поки застосунок був закритий
  function checkDueReminders(){
    const now=Date.now(); const due=[];
    try{
      Object.keys(boards).forEach(k=>{
        const stack=[...(boards[k]||[])];
        while(stack.length){
          const b=stack.pop();
          if(b&&b.remindAt&&b.type==='task'&&!b.remindFired){
            if(new Date(b.remindAt).getTime()<=now){ due.push(b); b.remindFired=true; }
          }
          if(b&&isContainer(b)&&Array.isArray(b.children)) stack.push(...b.children);
        }
      });
    }catch(_){}
    if(due.length){
      saveBoard();
      const names=due.slice(0,4).map(b=>'• '+(b.title||'завдання')).join('\n');
      const extra=due.length>4?`\n…і ще ${due.length-4}`:'';
      setTimeout(()=>{ try{ flowAlert('⏰ Нагадування, що настали:\n'+names+extra); }catch(_){} },400);
    }
  }
  window.flowSetTaskReminder=setTaskReminder;

  // ===== Нагадування для блоків Планера (окрема черга, той самий механізм показу) =====
  function plScheduleReminder(b){
    if(!b||!b.remindAt) return;
    const when=new Date(b.remindAt).getTime();
    const delay=when-Date.now();
    const key='pl_'+b.id;
    if(reminderTimers[key]){ clearTimeout(reminderTimers[key]); delete reminderTimers[key]; }
    if(delay<=0||delay>24*3600e3) return;
    reminderTimers[key]=setTimeout(()=>{ plFireReminder(b); },delay);
  }
  function plFireReminder(b){
    const msg='⏰ '+(b.t||'Блок часу')+(b.h!=null?' · '+plHM(b.h):'');
    try{
      if('Notification'in window && Notification.permission==='granted'){
        new Notification('Frequency — Планер',{ body:msg });
      } else { flowAlert(msg); }
    }catch(_){ try{ flowAlert(msg); }catch(__){} }
    try{ window.platform.haptic('warning'); }catch(_){}
  }
  // перепланувати нагадування блоків на сьогодні/завтра (в межах вікна 24г таймерів)
  function plRescheduleReminders(){
    try{
      const p=plData();
      [plTodayStr(), (()=>{ const d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10); })()].forEach(ds=>{
        (p.blocksByDay[ds]||[]).forEach(b=>{ if(b&&b.remindAt&&!b.done) plScheduleReminder(b); });
      });
    }catch(_){}
  }
  // показати прострочені нагадування блоків, поки застосунок був закритий
  function plCheckDueReminders(){
    try{
      const p=plData(); const now=Date.now(); const due=[];
      Object.keys(p.blocksByDay||{}).forEach(ds=>{
        (p.blocksByDay[ds]||[]).forEach(b=>{
          if(b&&b.remindAt&&!b.done&&!b.remindFired && new Date(b.remindAt).getTime()<=now){ due.push(b); b.remindFired=true; }
        });
      });
      if(due.length){
        saveGoals();
        const names=due.slice(0,4).map(b=>'• '+(b.t||'блок')).join('\n');
        const extra=due.length>4?`\n…і ще ${due.length-4}`:'';
        setTimeout(()=>{ try{ flowAlert('⏰ Нагадування планера:\n'+names+extra); }catch(_){} },500);
      }
    }catch(_){}
  }

  function saveBoard(){
    try{ const p=window.storage.set(BKEY,JSON.stringify(boards),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
  }

  // фабрика блока (лише конструювання, без вставки) — для водяного «＋»
  function buildBlock(type){
    if(type==='photo') return null; // фото йде окремим асинхронним шляхом
    const base={ id:Date.now()+Math.random(), type, title:(BLOCK_TYPES[type]||{}).title||'' };
    if(type==='bento') Object.assign(base,{title:'',sections:[{id:Date.now()+1,type:'text',text:''}]});
    if(type==='note')  Object.assign(base,{text:'',title:''});
    if(type==='quick') Object.assign(base,{text:'',title:''});
    if(type==='check') Object.assign(base,{items:[{id:Date.now(),text:'',done:false}],title:''});
    if(type==='list')  Object.assign(base,{items:[{id:Date.now(),text:''}],title:'Список'});
    if(type==='table') Object.assign(base,{title:'Таблиця',cols:['Назва','Значення'],rows:[['',''],['','']]});
    if(type==='task')  Object.assign(base,{text:'',due:'',done:false,prio:'none',title:'Завдання'});
    if(type==='link')  Object.assign(base,{url:'',label:'',title:'Посилання'});
    if(type==='head')  Object.assign(base,{title:'Нова секція'});
    /* PREMIUM PACK V1 */
    if(type==='heatmap') Object.assign(base,{title:'Звичка',marks:{}});
    if(type==='kpi')     Object.assign(base,{title:'KPI',unit:'',points:[]});
    if(type==='chart')   Object.assign(base,{title:'Графік',points:[],view:'bar'});
    if(type==='tabs')    Object.assign(base,{title:'',tabs:[{name:'Нотатки',text:''}],ti:0});
    if(type==='accord')  Object.assign(base,{title:'',secs:[{name:'Секція',text:'',open:1}]});
    if(type==='code')    Object.assign(base,{title:'Код',text:'',lang:'js'});
    if(type==='embed')   Object.assign(base,{title:'Відео',url:'',play:0});
    if(type==='audio')   Object.assign(base,{title:'',url:'',name:''});
    if(type==='wfocus')  Object.assign(base,{title:'Фокус',mode:'work',end:0,done:0,doneD:''});
    if(type==='fin')   Object.assign(base,{title:'Фінанси'});
    if(type==='envelope') Object.assign(base,{title:'Конверт',envId:null});
    if(type==='project') Object.assign(base,{title:'Проєкт',ops:[],expected:0,cur:'€',deadline:'',unlocked:false,pview:1});
    if(type==='divider') Object.assign(base,{title:''});
    if(type==='quote') Object.assign(base,{text:'',title:'Цитата'});
    if(type==='glass') Object.assign(base,{text:'',title:'Скло'});
    if(type==='progress') Object.assign(base,{value:0,title:'Прогрес'});
    if(type==='calendar') Object.assign(base,{title:'Календар',marks:{},ym:ymLocal()});
    if(type==='countdown') Object.assign(base,{title:'Відлік',target:'',label:''});
    if(type==='toggle') Object.assign(base,{title:'Заголовок тоглу',text:'',open:false});
    if(type==='callout') Object.assign(base,{text:'',tone:'tip'});
    if(type==='numlist') Object.assign(base,{items:['']});
    if(type==='h1') Object.assign(base,{text:'Заголовок'});
    if(type==='h2') Object.assign(base,{text:'Підзаголовок'});
    if(type==='h3') Object.assign(base,{text:'Малий заголовок'});
    if(type==='group') Object.assign(base,{title:'Нова папка',children:[],open:true});
    if(type==='page')  Object.assign(base,{title:'Нова сторінка',children:[],open:true});
    if(type==='book')  Object.assign(base,{title:'Нова книга',author:'',fmt:'',bookId:'',progress:0,loc:0,bookmarks:[],added:Date.now(),needsFile:true});
    if(type==='wstack') Object.assign(base,{title:'Фокус-стек',idx:0});
    if(type==='wpult'||type==='wpipe'||type==='wtline'||type==='wportal') base.title=BLOCK_TYPES[type].title;
    if(type==='wplanday'||type==='wplanmonth'){ base.title=BLOCK_TYPES[type].title; try{ const cx=curCtx(); if(cx!=='__root__') base.pfolder=cx; }catch(_){} }
    if(type==='kanban') Object.assign(base,{title:'Канбан',cols:[
      {id:'kc'+Date.now(),name:'Заявки',cards:[]},
      {id:'kc'+(Date.now()+1),name:'В роботі',cards:[]},
      {id:'kc'+(Date.now()+2),name:'Готово',cards:[]}]});
    if(type==='contacts') Object.assign(base,{title:'Контакти',people:[]});
    if(type==='caseline') Object.assign(base,{title:'Таймлайн справи',events:[]});
    if(type==='festival') Object.assign(base,{title:'Нова подія',emojiF:'🎪',date:'',dateEnd:'',place:'',budget:0,cur:'€',ops:[],program:[]});
    return base;
  }

