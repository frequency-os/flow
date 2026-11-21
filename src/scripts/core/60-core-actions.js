  /* ════════ Frequency Core — реєстр дій (60-core-actions.js, 17.11.2026) ════════
     Етап 2 задуму (prompts/frequency-core.md). Кожна дія, що ЗАПИСУЄ дані, описана
     тут один раз, і її однаково кличе кнопка людини і (з етапу 3) агент Флоу:
         Core.run('money.expense', {amount:300, label:'Кава', goalId:'g1'}, {by:'human'})
     Один шлях для всіх:
       1. ready  — ключі дії справді прочитано зі сховища (storeKeyReady). Ні → нічого не пишемо,
                   кажемо «ще звіряється». «Не прочитано» ≠ «порожньо» (урок 24.09).
       2. check  — поля перевірено й приведено до формату, який пишуть наявні екрани.
       3. by:'flow' → шторка «Так / Ні» (aiToolConfirm, 12-ai-agent.js) — без «Так» запису нема.
       4. run    — запис НАЯВНИМИ save-функціями (saveFinOps, saveFolders, saveGoals, envAddOp):
                   формат даних той самий, нових ключів сховища нема.
       5. undo   — «Скасувати» 5 с (flowUndoToast, 23-board.js); журнал у сховищі — етап 3 (рішення А).
     Усі записи — з дії людини (тап) або після її «Так»: автоматичних записів тут нема,
     тож saveFolders() без {auto:true} — правильно. 57-core.js лишається «лише читає». */
  (function(){
    const caLang=()=>{ try{ return (window.flowLang&&window.flowLang())==='en'?'en':'uk'; }catch(_){ return 'uk'; } };
    const CA_T={
      uk:{wait:'Дані ще звіряються з хмарою — спробуй за хвилину', amount:'Вкажи суму', noGoal:'Мету не знайдено',
        noStep:'Цей крок уже зроблено або його нема', noEnv:'Конверт не знайдено', hasFolder:'У мети вже є папка',
        unknown:'Невідома дія', cancelled:'Скасовано', in:'Дохід', out:'Витрата', folder:n=>'Папка '+n, top:'Поповнення',
        doneIn:(m)=>'Записано +'+m, doneOut:(m)=>'Записано −'+m, doneEnv:(m,n)=>'+'+m+' у «'+n+'»', doneStep:n=>'Крок «'+n+'» зроблено',
        doneFolder:n=>'Папку «'+n+'» створено', flowTitle:'Флоу хоче зробити дію',
        sayIn:(m,l)=>'Дохід '+m+' — «'+l+'»', sayOut:(m,l)=>'Витрата '+m+' — «'+l+'»', sayEnv:(m,n)=>'Покласти '+m+' у конверт «'+n+'»',
        sayStep:(s,g)=>'Відмітити зробленим крок «'+s+'» у меті «'+g+'»', sayFolder:n=>'Створити папку «'+n+'»'},
      en:{wait:'Still syncing with the cloud — try again in a minute', amount:'Enter an amount', noGoal:'Goal not found',
        noStep:'This step is already done or missing', noEnv:'Envelope not found', hasFolder:'This goal already has a folder',
        unknown:'Unknown action', cancelled:'Cancelled', in:'Income', out:'Expense', folder:n=>'Folder '+n, top:'Top-up',
        doneIn:(m)=>'Saved +'+m, doneOut:(m)=>'Saved −'+m, doneEnv:(m,n)=>'+'+m+' to “'+n+'”', doneStep:n=>'Step “'+n+'” done',
        doneFolder:n=>'Folder “'+n+'” created', flowTitle:'Flow wants to act',
        sayIn:(m,l)=>'Income '+m+' — “'+l+'”', sayOut:(m,l)=>'Expense '+m+' — “'+l+'”', sayEnv:(m,n)=>'Put '+m+' into envelope “'+n+'”',
        sayStep:(s,g)=>'Mark step “'+s+'” done in goal “'+g+'”', sayFolder:n=>'Create folder “'+n+'”'}
    };
    const caT=k=>CA_T[caLang()][k];
    function caReady(keys){ try{ return typeof window.storeKeyReady!=='function'||keys.every(k=>window.storeKeyReady(k)===true); }catch(_){ return false; } }
    const caStr=(v,n)=>String(v==null?'':v).replace(/[\r\n]+/g,' ').trim().slice(0,n);
    const caAmt=v=>Math.round(parseFloat(String(v==null?'':v).replace(',','.'))*100)/100;
    const caGoal=id=>id?(goalsData.goals||[]).find(g=>g&&String(g.id)===String(id))||null:null;
    const caFresh=()=>{ try{ renderFinance(); }catch(_){} try{ if(typeof wgRefresh==='function') wgRefresh(); }catch(_){} };

    /* ── дії ── поля описані й тут (fields), щоб на етапі 3 з них вийшов опис інструмента для Флоу */
    const ACTIONS={};
    function caMoney(type){
      return {
        id: type==='in'?'money.income':'money.expense',
        fields:{amount:'number>0', label:'text≤80', goalId:'id?', folderKey:'id?', cur:'code?', src:'code?', env:'text?'},
        keys:['fin_ops','envelopes'],
        check(inp){
          const amount=caAmt(inp.amount); if(!(amount>0&&amount<1e9)) return {why:caT('amount')};
          const label=caStr(inp.label,80)||caStr(inp.env,60)||caT(type);
          const cur=(inp.cur&&curOk(inp.cur)&&inp.cur!==mainCur())?String(inp.cur):'';
          const goalId=(!cur&&inp.goalId&&wlGoal(inp.goalId))?String(inp.goalId):'';
          const folderKey=(inp.folderKey&&wlFolderName(inp.folderKey))?String(inp.folderKey):'';
          const src=(type==='in'&&inp.src&&WL_SRC[inp.src]&&inp.src!=='main')?String(inp.src):'';
          // env — дослівно як назва конверта (без trim): за нею wlMonthCats збирає категорію місяця
          return {val:{amount, label, cur, goalId, folderKey, src, env:String(inp.env==null?'':inp.env).slice(0,60)}};
        },
        say(v){ const m=money(v.amount,v.cur||undefined); return type==='in'?caT('sayIn')(m,v.label):caT('sayOut')(m,v.label); },
        run(v,by){
          // той самий обʼєкт, що й шторка Гаманця (46-wallet.js, wlOpSheet) — порядок полів теж
          const op={ id:Date.now()+'_'+Math.random().toString(36).slice(2,6), type, amount:v.amount, label:v.label, date:ymdLocal(), card:mainCard().id };
          if(v.env) op.env=v.env;
          if(v.cur) op.cur=v.cur; else if(v.goalId) op.goalId=v.goalId;
          if(v.folderKey) op.folderKey=v.folderKey;
          if(v.src) op.src=v.src;
          if(by==='flow') op._src='ai';
          finOps.push(op); saveFinOps(); caFresh();
          try{ flowReact(type==='in'?'income':'spend',{amount:v.amount}); }catch(_){}
          try{ if(typeof rlOnOp==='function') rlOnOp(op); }catch(err){ console.error('rlOnOp',err); }   // правила: скарбничка / зарплата / бюджет
          const m=money(v.amount,v.cur||undefined);
          return { msg: type==='in'?caT('doneIn')(m):caT('doneOut')(m), op,
            undo(){ const i=finOps.indexOf(op); if(i>=0){ finOps.splice(i,1); saveFinOps(); } caFresh(); } };   // саме цей обʼєкт
        }
      };
    }
    ACTIONS['money.income']=caMoney('in');
    ACTIONS['money.expense']=caMoney('out');

    ACTIONS['envelope.add']={
      id:'envelope.add', fields:{envId:'id', amount:'number>0', label:'text≤60'}, keys:['fin_ops','envelopes'],
      check(inp){
        const e=(envelopes||[]).find(x=>x&&String(x.id)===String(inp.envId)); if(!e) return {why:caT('noEnv')};
        const amount=caAmt(inp.amount); if(!(amount>0&&amount<1e9)) return {why:caT('amount')};
        return {val:{e, amount, label:caStr(inp.label,60)||caT('top')}};
      },
      say(v){ return caT('sayEnv')(money(v.amount,envCur(v.e)||undefined),v.e.name||''); },
      run(v){
        envAddOp(v.e,'in',v.amount,v.label); caFresh();   // envAddOp сам пише конверт і finOps (08-finance.js:27)
        const eop=v.e.ops[0];
        return { msg:caT('doneEnv')(money(v.amount,envCur(v.e)||undefined),v.e.name||''),
          undo(){ if(eop&&eop.id) envDelOp(v.e,eop.id); caFresh(); } };
      }
    };

    ACTIONS['step.done']={
      id:'step.done', fields:{goalId:'id', stepId:'id'}, keys:['goals_data'],
      check(inp){
        const g=caGoal(inp.goalId); if(!g) return {why:caT('noGoal')};
        const st=(g.steps||[]).find(s=>s&&String(s.id)===String(inp.stepId)&&!s.done); if(!st) return {why:caT('noStep')};
        return {val:{g, st}};
      },
      say(v){ return caT('sayStep')(v.st.name||v.st.t||'',v.g.name||''); },
      run(v){
        v.st.done=true; saveGoals();
        const fresh=()=>{ try{ renderGoals(); }catch(_){} try{ if(typeof jnRender==='function') jnRender(); }catch(_){} };
        fresh();
        return { msg:caT('doneStep')(v.st.name||v.st.t||''), undo(){ v.st.done=false; saveGoals(); fresh(); } };
      }
    };

    ACTIONS['folder.create']={
      id:'folder.create', fields:{name:'text≤60', emoji:'emoji?', parent:'id?', goalId:'id?', tab:'id?'}, keys:['folders_cfg'],
      ready(inp){ return foldersLoaded===true&&(!inp.goalId||caReady(['goals_data'])); },   // папки цієї сесії прочитано
      check(inp){
        const used=order.length;
        const parent=(typeof inp.parent==='string'&&folders[inp.parent])?inp.parent:'';
        const g=inp.goalId?caGoal(inp.goalId):null;
        if(inp.goalId&&!g) return {why:caT('noGoal')};
        if(g&&g.folderKey&&folders[g.folderKey]) return {why:caT('hasFolder')};
        const name=caStr(inp.name,120)||caT('folder')(used+1);
        // як «＋ Папка» (16-dashboard.js, createFolder): порожнє поле — 📁, не передали — по колу;
        // 16 — як maxlength поля емодзі в inputModal (прапор чи «родина» — кілька символів)
        const emoji=inp.emoji!==undefined?(caStr(inp.emoji,16)||'📁'):FOLDER_EMOJIS[used%FOLDER_EMOJIS.length];
        // своя вкладка Огляду (36-chats.js) — лише для папки верхнього рівня; підпапка йде за батьком
        const tab=(!parent&&typeof inp.tab==='string'&&utById(inp.tab))?inp.tab:'';
        return {val:{name, emoji, parent, g, used, tab}};
      },
      say(v){ return caT('sayFolder')(v.name); },
      run(v){
        const key='f_'+Date.now();
        folders[key]={ key, c:FOLDER_COLORS[v.used%FOLDER_COLORS.length], emoji:v.emoji, icon:folderIconFor(v.emoji),
          name:v.name, pct:0, photo:'', flayout:'a', pinned:false, custom:true, widgets:[] };
        if(v.parent) folders[key].parent=v.parent;
        if(v.tab) folders[key].tab=v.tab;
        order.push(key);
        saveFolders();
        let prev;
        if(v.g){ prev=v.g.folderKey; v.g.folderKey=key; saveGoals(); }   // «привʼязати місію» = folderKey (54-links.js)
        try{ renderDashboard(); }catch(_){}
        return { msg:caT('doneFolder')(v.name), key,
          undo(){
            if(v.g&&v.g.folderKey===key){ if(prev) v.g.folderKey=prev; else delete v.g.folderKey; saveGoals(); }
            folderDelete(key);   // надгробок + прибирання + запис — як видалення з меню папки
            try{ renderDashboard(); }catch(_){}
          } };
      }
    };

    /* ── один шлях для всіх ── */
    const listeners=[];
    // і подія на document (як flowsync): файли з меншим номером не можуть кликати Core.onChange при старті
    const notify=()=>{ listeners.slice().forEach(fn=>{ try{ fn(); }catch(_){} });
      try{ document.dispatchEvent(new CustomEvent('flowcorechange')); }catch(_){} };
    async function run(id, inp, opts){
      opts=opts||{}; inp=inp||{};
      const by=opts.by==='flow'?'flow':'human';
      const a=ACTIONS[id]; if(!a) return {ok:false, why:caT('unknown')};
      const ready=a.ready?a.ready(inp):true;
      if(!ready||!caReady(a.keys)){ if(!opts.quiet) try{ plToast(caT('wait')); }catch(_){} return {ok:false, why:caT('wait')}; }
      const c=a.check(inp);
      if(!c||!c.val){ const why=(c&&c.why)||caT('unknown'); if(!opts.quiet) try{ plToast(why); }catch(_){} return {ok:false, why}; }
      if(by==='flow'){
        // без «Так» людини Флоу нічого не пише (етап 3 підключить сюди інструменти агента)
        let ok=false; try{ ok=await aiToolConfirm(a.say(c.val),{title:caT('flowTitle')}); }catch(_){ ok=false; }
        if(!ok) return {ok:false, why:caT('cancelled'), cancelled:true};
        if(!(a.ready?a.ready(inp):true)||!caReady(a.keys)) return {ok:false, why:caT('wait')};   // поки людина думала — дані могли перечитатись
      }
      let r;
      try{ r=a.run(c.val,by)||{}; }catch(err){ console.error('Core.run '+id,err); return {ok:false, why:String(err&&err.message||err)}; }
      notify();
      if(opts.undo!==false&&typeof r.undo==='function'&&typeof flowUndoToast==='function'){
        flowUndoToast(r.msg||'', ()=>{ r.undo(); notify(); }, 5000);
      }
      try{ window.platform.haptic('light'); }catch(_){}
      return {ok:true, msg:r.msg||'', key:r.key, op:r.op};
    }
    const C=window.Core||(window.Core={});
    C.run=run;
    C.actions={ list:()=>Object.keys(ACTIONS), get:id=>ACTIONS[id]?{id, fields:ACTIONS[id].fields, keys:ACTIONS[id].keys.slice()}:null };
    C.onChange=fn=>{ if(typeof fn==='function') listeners.push(fn); };
  })();
