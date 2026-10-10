  /* ============ ЦІННОСТІ («Створи себе»): дані без екрана ============
     Екран прибрано 10.10.2026, дані лишились для Флоу і бекапу: values_state
     (бекап, синк) дочитує loadValues при старті (27-canvas.js), сюди нічого не пишемо.
     todayStr() — спільний хелпер дати (09-goals.js, 10-planner.js). */
  const VAL_KEY='values_state';
  let valState={
    selected:[],          // обрані цінності (бібліотека)
    rank:[],              // [{name, why}] — топ-опори в порядку
    vision:{},            // {q_id: text}
    anti:{},              // {q_id: text}
    focusName:'',         // цінність дня
    focusDate:'',         // дата останнього вибору фокусу
    streak:0,
    lastDone:'',          // YYYY-MM-DD коли востаннє відмічено
    journal:[]            // [{date, focus, text}]
  };

  async function loadValues(){
    try{ const r=await window.storage.get(VAL_KEY,false); if(r&&r.value) valState=Object.assign(valState,JSON.parse(r.value)); }catch(_){}
  }
  function todayStr(){ return ymdLocal(); }
