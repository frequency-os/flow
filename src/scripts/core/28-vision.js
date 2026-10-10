  /* ════════ ВІЗІЯ: дані без екрана ════════
     Екран прибрано 10.10.2026, дані лишились для Флоу і бекапу: vision_v1
     читає loadOnce (27-canvas.js) у vzData, агент Флоу бачить його через
     flowToolRead({what:"vision"}) у 12-ai-agent.js. Сюди нічого не пишемо. */
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
