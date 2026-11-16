  /* ════════ Frequency Core (57-core.js, 16.11.2026) — «знімок життя» ════════
     Задум погоджено 16.11.2026, варіант В, етап 0 (схема — у чаті сесії):
       модулі (Гаманець, Цілі, Фокус, Журнал, Папки) → Core.snapshot() → відчуття
       «відстань до мети» (етап 1), «ранок з Коучем» (етап 2), «записав → розійшлося» (етап 3).
     Правила ядра:
       • Лише ЧИТАЄ. Жодного storage.set, save*() чи зміни глобальних масивів — тому
         нових ключів у FLOW_KEYS нема і даним нічого не загрожує.
       • «Не прочитано» ≠ «порожньо» (урок зникання папок 24.09): кожен розділ має
         ready — чи справді його ключ прочитано зі сховища (storeKeyReady). Поки
         ready:false, числам розділу вірити не можна — показуй «ще звіряється».
       • Розділ, що впав із помилкою, стає null, а не нулями: нуль — це відповідь,
         null — «не знаю».
       • Правило грошей те саме, що в Гаманці й Журналі (wlAgg / wlMonthOps), щоб
         ядро й екрани ніколи не показували різні суми.
     Файл останній за номером, хоча його читатимуть інші: Core.snapshot() кличуть
     уже після завантаження всіх файлів, тож порядок виконання не ламається. */
  (function(){
    const CORE_VERSION=1;
    function coreReady(key){ try{ return typeof window.storeKeyReady!=='function'||window.storeKeyReady(key)===true; }catch(_){ return false; } }
    function corePart(fn){ try{ return fn(); }catch(err){ try{ console.warn('Core: розділ не зібрано', err); }catch(_){} return null; } }

    /* Сума конверта без побічних дій. envSaved() (08-finance.js:18) не годиться:
       вона мігрує старий конверт (додає запис «Старт» з новим id) і пише e.saved. */
    function coreEnvSaved(e){
      if(!Array.isArray(e.ops)) return +e.saved||0;
      return e.ops.reduce((s,o)=>s+(o&&o.t==='in'?+o.amount||0:-(+(o&&o.amount)||0)),0);
    }
    function coreMoney(){
      const ym=ymLocal(), m=wlAgg(wlMonthOps(ym)), d=wlDebtTotals();
      return {
        ready: coreReady('fin_ops'),
        cur: mainCur(),
        month: {ym, inc:m.inc, out:m.out, net:m.inc-m.out},
        balance: walletBalance(),
        debts: {owe:d.owe, owed:d.owed, otherCur:d.other},
        envelopes: (envelopes||[]).filter(Boolean).map(e=>({name:String(e.name||''), saved:coreEnvSaved(e), goal:+e.goal||0}))
      };
    }
    function coreGoals(){
      const list=(goalsData.goals||[]).filter(g=>g&&jnStatus(g)!=='archive').map(g=>{
        const st=(g.steps||[]).filter(Boolean);
        return {id:String(g.id||''), name:String(g.name||''), emoji:g.emoji||'🎯', role:jnRole(g), status:jnStatus(g),
          steps:st.length, done:st.filter(s=>s.done).length};
      });
      let pointB=false;
      try{ pointB=!!(ylLetter().text||'').trim(); }catch(_){}
      if(!pointB) pointB=!!String(goalsData.pointB||'').trim();
      return {ready: coreReady('goals_data'), pointB, list};
    }
    function coreDay(){
      const ds=ymdLocal(), bl=jnDayBlocks(ds);
      return {ready: coreReady('goals_data'), ds, blocks:bl.length, done:bl.filter(b=>b&&b.done).length,
        streak: plStreak(), focusToday: fcHadToday()};
    }
    function coreWeek(){
      const p=plData(); let blocks=0, done=0;
      for(let i=0;i<7;i++){ const d=new Date(); d.setDate(d.getDate()-i);
        const l=Array.isArray(p.blocksByDay[ymdLocal(d)])?p.blocksByDay[ymdLocal(d)]:[];
        blocks+=l.length; done+=l.filter(b=>b&&b.done).length; }
      return {ready: coreReady('goals_data'), blocks, done};
    }
    function coreDiary(){
      const st=diaStreakCalc();
      return {ready: coreReady('diary_entries_v1'), today: diaHasEntry(ymdLocal()), streak: st.s};
    }
    function coreNotes(){
      return {ready: coreReady('folders_cfg')&&coreReady('chats_v1'),
        folders: Object.keys(folders||{}).length, chats: (chats||[]).length};
    }

    /* Один знімок на зараз. Нічого не кешує: дешевий, кличте коли треба. */
    function snapshot(){
      return {
        v: CORE_VERSION,
        at: new Date().toISOString(),
        money: corePart(coreMoney),
        goals: corePart(coreGoals),
        day:   corePart(coreDay),
        week:  corePart(coreWeek),
        diary: corePart(coreDiary),
        notes: corePart(coreNotes)
      };
    }
    window.Core={ version:CORE_VERSION, snapshot };
  })();
