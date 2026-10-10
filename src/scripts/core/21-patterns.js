  /* ============ ПАТЕРНИ: дані без екрана ============
     Екран прибрано 10.10.2026, дані лишились для Флоу і бекапу.
     Ключі: patterns_chains (розібрані зриви), patterns_score (рахунок перехвату),
     patterns_transform (цикли заміни патернів) — їх читає loadOnce (27-canvas.js).
     Агент Флоу (flowToolPatterns у 12-ai-agent.js) показує цикли заміни і, після
     згоди людини, відмічає «новий/старий спрацював» через patTCheck.
     Дати — тільки ymdLocal. */
  const PAT_CKEY='patterns_chains', PAT_SKEY='patterns_score', PAT_TKEY='patterns_transform';
  let patChains=[], patScore={win:0,lose:0}, patTrans=[];
  function patSaveTrans(){ try{ const p=window.storage.set(PAT_TKEY,JSON.stringify(patTrans),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }

  // скільки днів минуло від старту циклу (YYYY-MM-DD, місцевий час)
  function patDaysFrom(startYmd){
    const pr=String(startYmd||'').split('-');
    if(pr.length!==3) return 0;
    const s=new Date(+pr[0],+pr[1]-1,+pr[2]);
    const n=new Date(); const n0=new Date(n.getFullYear(),n.getMonth(),n.getDate());
    return Math.max(0,Math.round((n0-s)/86400000));
  }
  // відмітка за сьогодні: kind 'o' — спрацював старий патерн, 'n' — новий
  function patTCheck(id,kind){
    const p=patTrans.find(x=>x.id===id); if(!p) return;
    if(!p.checks||typeof p.checks!=='object') p.checks={};
    const k=ymdLocal(); if(!p.checks[k]) p.checks[k]={o:0,n:0};
    p.checks[k][kind]++; patSaveTrans();
    try{ window.platform.haptic('light'); }catch(_){}
  }
  // підсумок за останні 7 днів
  function patLast7(p){
    let o=0,n=0; const now=new Date(); const ch=(p&&p.checks)||{};
    for(let i=0;i<7;i++){ const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);
      const c=ch[ymdLocal(d)]; if(c){ o+=c.o; n+=c.n; } }
    return {o,n};
  }
