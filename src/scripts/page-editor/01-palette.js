
/* ═══════════ РЕДАКТОР СТОРІНКИ (Notion-стиль) — читає/пише реальні boards Flow ═══════════ */
(function(){
  /* «Студія»: категорії + преміальні лінійні іконки (feather-стиль) */
  var PGS_CATS=[
    {id:'base',   t:'Базові',    ic:'text'},
    {id:'struct', t:'Структура', ic:'toggle'},
    {id:'media',  t:'Медіа',     ic:'photo'},
    {id:'data',   t:'Дані',      ic:'db'},
    {id:'ai',     t:'AI',        ic:'text'},
  ];
  var CATALOG=[
    {cat:'ai', k:'ai',   t:'Флоу AI',     d:'AI-дія з цією сторінкою', c:'#9b8cff', ic:'text'},
    {cat:'ai', k:'weekreview', t:'Огляд тижня', d:'AI-підсумок цієї сторінки, перегенерується', c:'#9b8cff', ic:'journal'},
    {cat:'base', k:'note', t:'Текст',       d:'Звичайний абзац',      c:'#5b8def', ic:'text'},
    {cat:'base', k:'h1',   t:'Заголовок 1', d:'Великий',              c:'#f3f5f8', ic:'h1'},
    {cat:'base', k:'h2',   t:'Заголовок 2', d:'Середній',             c:'#c7cad3', ic:'h2'},
    {cat:'base', k:'h3',   t:'Заголовок 3', d:'Малий',                c:'#8b93a3', ic:'h3'},
    {cat:'base', k:'task', t:'Завдання',    d:'Задача з галочкою',    c:'#34c77b', ic:'task'},
    {cat:'base', k:'bullet',t:'Маркер',     d:'Список з крапками',    c:'#5b8def', ic:'bullet'},
    {cat:'base', k:'num',  t:'Нумерований', d:'Список 1. 2. 3.',      c:'#9b8cff', ic:'num'},
    {cat:'media', k:'photo',t:'Фото',        d:'Картинка з пристрою',  c:'#ff6b9d', ic:'photo'},
    {cat:'media', k:'attach',t:'Вкладення',  d:'Посилання, відео, аудіо чи файл — визначає саме', c:'#4ecdc4', ic:'link'},
    {cat:'struct',k:'page', t:'Сторінка',  d:'Вкладений аркуш',      c:'#7c8cff', ic:'pagefile'},
    {cat:'struct',k:'toggle',t:'Тогл',      d:'Згортається',          c:'#5b8def', ic:'toggle'},
    {cat:'struct',k:'card', t:'Картка',    d:'Скло / колір / фото / рамка + вкладені блоки', c:'#7c8cff', ic:'win'},
    {cat:'struct',k:'board', t:'Дошка',   d:'Сітка 12 колонок для віджетів, ресайз за кут', c:'#e8843c', ic:'db'},
    {cat:'struct',k:'divider',t:'Роздільник',d:'Лінія між секціями',  c:'#8b93a3', ic:'divider'},
    {cat:'base',k:'code',   t:'Код',        d:'Моноширинний + копіювати', c:'#4ecdc4', ic:'code'},
    {cat:'data',k:'pbar',   t:'Прогрес',    d:'Смуга виконання 0–100%, або авто з задач', c:'#34c77b', ic:'pbar'},
    {cat:'data',k:'envelope', t:'Конверт',  d:'Бюджет/накопичення під ціль — з Грошей',   c:'#c77dff', ic:'envelope'},
    {cat:'data',k:'wplanday', t:'План на день', d:'Точки з Планера для папки-проєкту',    c:'#5b8def', ic:'countdown'},
    {cat:'data',k:'wplanmonth',t:'План на місяць', d:'Ритм проєкту за місяць з Планера',  c:'#5b8def', ic:'calendar'},
    {cat:'data',  k:'countdown',t:'Відлік',  d:'Живий таймер до дати',  c:'#e8843c', ic:'countdown'},
    {cat:'data',  k:'journal',  t:'Щоденник', d:'Записи на кожен день',  c:'#7c8cff', ic:'journal'},
    {cat:'data',  k:'decision', t:'Лог рішень', d:'Рішення → очікування → перевірка', c:'#f0b429', ic:'decision'},
    {cat:'data',  k:'phub', t:'Проєкти', d:'Хаб цілей зі звʼязком з папками', c:'#7c8cff', ic:'phub'},
    {cat:'data',  k:'habits', t:'Трекер звичок', d:'Щоденні звички + серії', c:'#34c77b', ic:'habits'},
    /* ═══ PREMIUM PACK V1 ═══ */
    {cat:'struct',k:'tabs',   t:'Таби',      d:'Кілька вкладок в одному блоці', c:'#9b8cff', ic:'tabs'},
    {cat:'data',  k:'heatmap', t:'Хітмапа',   d:'12 тижнів звички клітинками',   c:'#34c77b', ic:'heatmap'},
    {cat:'data',  k:'kpi',     t:'KPI',       d:'Число + дельта + спарклайн',    c:'#6a7dff', ic:'kpi'},
    {cat:'data',  k:'chart',   t:'Графік',    d:'Точки даних: bar або line',     c:'#5b8def', ic:'chartW'},
    {cat:'data',  k:'wfocus',  t:'Фокус',     d:'Помодоро 25/5 із кільцем',      c:'#e8843c', ic:'wfocus'},
  ];
  /* синоніми UA/EN/транслітом для пошуку в палітрі (SPECblocksv2 §3.2) */
  var PGS_SYN={
    task:['todo','to-do','задача','чек','check','checkbox'],
    note:['text','текст','параграф','paragraph','абзац'],
    h1:['heading','заголовок','title'], h2:['heading','заголовок'], h3:['heading','заголовок'],
    bullet:['list','список','ul','маркований'],
    num:['numbered','нумерований','ol'],
    photo:['image','img','картинка','фото','picture'],
    attach:['file','video','audio','link','посилання','відео','аудіо','файл','youtube','mp3','вкладення'],
    page:['subpage','page','сторінка'],
    toggle:['collapse','тогл','дропдаун','accordion','акордеон'],
    card:['window','вікно','glass','скло','callout','виноска','quote','цитата','box','рамка','картка'],
    divider:['hr','лінія','separator','роздільник'],
    db:['database','база','таблиця','table','board','дошка'],
    code:['code','код','snippet'],
    pbar:['progress','прогрес','бар'],
    countdown:['timer','таймер','відлік','deadline','дедлайн'],
    journal:['diary','щоденник'],
    decision:['decision','рішення','log'],
    phub:['projects','проєкти','goals','цілі'],
    habits:['habit','звички','streak','трекер'],
    tabs:['tabs','вкладки','таби'],
    heatmap:['heatmap','хітмапа','calendar','активність'],
    kpi:['kpi','метрика','число'],
    chart:['chart','графік','graph','діаграма'],
    wfocus:['focus','фокус','pomodoro','помодоро'],
    ai:['ai','ші','штучний','флоу']
  };
  /* видалені з палітри Акордеон/Секція/Промт/Папку(group), і зведені в Картку/Вкладення типи —
     їхній рендер і applySlash-кейси навмисно лишені нижче незмінними: старі сторінки читаються як і раніше (SPECblocksv2 §3.1) */
  var PGS_ICONS={
    win:'<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 9.5h18" stroke-linecap="round"/><path d="M6.5 13h8M6.5 16h5" stroke-linecap="round" opacity=".65"/>',
    text:'<path d="M4 7V5h16v2M12 5v14M9 19h6" stroke-linecap="round"/>',
    promptB:'<rect x="2" y="3" width="20" height="18" rx="3"/><path d="M6 8l4 4-4 4M12 16h6" stroke-linecap="round" stroke-linejoin="round"/>',
    /* ═══ PREMIUM PACK V1 ═══ */
    tabs:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M3 11h18M8 7V4h5v3" stroke-linecap="round"/>',
    accord:'<rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="12" width="18" height="8" rx="1.5"/><path d="M17 6.5l1.5 1 1.5-1" stroke-linecap="round" stroke-linejoin="round"/>',
    embed:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/>',
    audioW:'<path d="M4 10v4M8 6v12M12 9v6M16 4v16M20 8v8" stroke-linecap="round"/>',
    heatmap:'<rect x="3" y="3" width="4" height="4" rx="1"/><rect x="10" y="3" width="4" height="4" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1" fill="currentColor" stroke="none"/><rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor" stroke="none"/><rect x="17" y="10" width="4" height="4" rx="1"/><rect x="3" y="17" width="4" height="4" rx="1"/><rect x="10" y="17" width="4" height="4" rx="1" fill="currentColor" stroke="none"/><rect x="17" y="17" width="4" height="4" rx="1"/>',
    kpi:'<path d="M3 17l6-6 4 4 8-8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7h6v6" stroke-linecap="round" stroke-linejoin="round"/>',
    chartW:'<path d="M4 20V10M10 20V4M16 20v-8M21 20H3" stroke-linecap="round"/>',
    wfocus:'<circle cx="12" cy="13" r="8"/><path d="M12 13l3-3M12 3v2M9 3h6" stroke-linecap="round"/>',
    h1:'<path d="M4 6v12M12 6v12M4 12h8M17 18V9l-3 2" stroke-linecap="round" stroke-linejoin="round"/>',
    h2:'<path d="M4 6v12M12 6v12M4 12h8M16 18c0-2 4-3 4-6a2 2 0 0 0-4 0" stroke-linecap="round" stroke-linejoin="round"/>',
    h3:'<path d="M4 6v12M12 6v12M4 12h8M16 10a2 2 0 1 1 3 1.5a2 2 0 1 1-3 1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    task:'<path d="M9 11.5l2.5 2.5L17 8" stroke-linecap="round" stroke-linejoin="round"/><rect x="3.5" y="3.5" width="17" height="17" rx="4"/>',
    bullet:'<path d="M9 6h11M9 12h11M9 18h11" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1.3" fill="currentColor" stroke="none"/>',
    num:'<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M4 16h2a1 1 0 0 1 0 2l-2 2h3" stroke-linecap="round" stroke-linejoin="round"/>',
    toggle:'<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>',
    quote:'<path d="M6 17h3l2-4V7H5v6h3zM14 17h3l2-4V7h-6v6h3z" stroke-linejoin="round"/>',
    glass:'<rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" fill-opacity=".12" stroke="none"/><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M7 9h10M7 13h6" stroke-linecap="round" opacity=".7"/>',
    callout:'<path d="M9 18h6M10 21h4M12 3a7 7 0 0 0-4 12c.6.5 1 1.4 1 2h6c0-.6.4-1.5 1-2a7 7 0 0 0-4-12z" stroke-linecap="round" stroke-linejoin="round"/>',
    divider:'<path d="M3 12h18" stroke-linecap="round"/>',
    db:'<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke-linecap="round"/>',
    progress:'<rect x="3" y="9.5" width="18" height="5" rx="2.5"/><rect x="3" y="9.5" width="11" height="5" rx="2.5" fill="currentColor" stroke="none"/>',
    countdown:'<circle cx="12" cy="13" r="8"/><path d="M12 13V9.5M9.5 2.5h5" stroke-linecap="round"/>',
    fin:'<path d="M12 2v20M17 6H9.5a3.2 3.2 0 0 0 0 6.4h5a3.2 3.2 0 0 1 0 6.4H6.5" stroke-linecap="round" stroke-linejoin="round"/>',
    calendar:'<rect x="3" y="4.5" width="18" height="17" rx="3"/><path d="M3 10h18M8 2.5v4M16 2.5v4" stroke-linecap="round"/>',
    pult:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" stroke-linecap="round"/><path d="M1.5 14h5M9.5 8h5M17.5 16h5" stroke-linecap="round"/>',
    pipe:'<path d="M4 20V9M10 20V4M16 20v-8M22 20H2" stroke-linecap="round"/>',
    project:'<rect x="3" y="6.5" width="18" height="14" rx="3"/><path d="M8.5 6.5V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 12h18" stroke-linecap="round"/>',
    kanban:'<rect x="3" y="3" width="5.4" height="18" rx="1.6"/><rect x="9.4" y="3" width="5.4" height="12" rx="1.6"/><rect x="15.8" y="3" width="5.2" height="8" rx="1.6"/>',
    contacts:'<circle cx="9" cy="8" r="3.4"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke-linecap="round"/><path d="M16 4.5a3.8 3.8 0 0 1 0 7.4M18 20c0-2.3-1-4.3-2.5-5.5" stroke-linecap="round"/>',
    caseline:'<path d="M5.5 3v18" stroke-linecap="round"/><circle cx="5.5" cy="6.5" r="1.8" fill="currentColor" stroke="none"/><circle cx="5.5" cy="13.5" r="1.8" fill="currentColor" stroke="none"/><path d="M10.5 6.5h10M10.5 13.5h7.5M10.5 19.5h5" stroke-linecap="round"/>',
    code:'<path d="M9 8 5 12l4 4M15 8l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/>',
    section:'<path d="M3 12h5M16 12h5M10 12h4" stroke-linecap="round"/>',
    pbar:'<rect x="3" y="9" width="18" height="6" rx="3"/><rect x="3" y="9" width="10" height="6" rx="3" fill="currentColor" stroke="none"/>',
    file:'<path d="M14 3v5h5M14 3H6a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5V8z" stroke-linejoin="round"/>',
    habits:'<path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>',
    phub:'<path d="M3 7.5 5 4h6l2 3.5M3 7.5h18v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" stroke-linejoin="round"/>',
    ptracker:'<path d="M3 7.5 5 4h6l2 3.5M3 7.5h18v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" stroke-linejoin="round"/><path d="M9 14h6" stroke-linecap="round"/>',
    decision:'<path d="M12 21v-8M12 13C12 9.5 8.5 9 6.5 6M12 13c0-3.5 3.5-4 5.5-7" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 8.5 6.5 6 9 6.8M19 8.5 17.5 6 15 6.8" stroke-linecap="round" stroke-linejoin="round"/>',
    journal:'<path d="M5 4h11l3 3v13H5z" stroke-linejoin="round"/><path d="M8 10h8M8 14h8M8 18h5" stroke-linecap="round"/>',
    portal:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5c3 2.4 3 14.6 0 17M3.5 12h17" stroke-linecap="round"/>',
    envelope:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6" stroke-linecap="round" stroke-linejoin="round"/>',
    stack:'<rect x="6.5" y="3.5" width="13" height="15" rx="2.5"/><path d="M4.5 7.5v11a2.5 2.5 0 0 0 2.5 2.5h9" stroke-linecap="round"/>',
    tline:'<path d="M3 12h18M7 12V8M12 12v-2M17 12V7" stroke-linecap="round"/><circle cx="7" cy="15.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="17" cy="15.5" r="1.4" fill="currentColor" stroke="none"/>',
    fest:'<path d="M12 3l7 15c-4.5 2.5-9.5 2.5-14 0z" stroke-linejoin="round"/><path d="M12 3c1.5 1.5 1.5 3.5 0 5" stroke-linecap="round"/>',
    photo:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21" stroke-linecap="round" stroke-linejoin="round"/>',
    link:'<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7L12.5 19" stroke-linecap="round" stroke-linejoin="round"/>',
    pagefile:'<path d="M6 2.5h8l4.5 4.5V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" stroke-linejoin="round"/><path d="M14 2.5V7h4.5M8.5 12h7M8.5 16h5" stroke-linecap="round"/>',
    folder:'<path d="M3 6.5a1.5 1.5 0 0 1 1.5-1.5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-12z" stroke-linejoin="round"/>'
  };
  function pgsIc(k){ return '<svg viewBox="0 0 24 24">'+(PGS_ICONS[k]||PGS_ICONS.text)+'</svg>'; }
  function pgsDemo(k){
    if(k==='progress')return 'Марафон · 64%<div class="pgst-bar"><i style="width:64%"></i></div>';
    if(k==='countdown')return 'До переїзду<div class="pgst-cnt"><b>43</b><b>дн</b><b>12</b><b>год</b></div>';
    if(k==='fin')return '<div style="display:flex;justify-content:space-between;align-items:baseline"><b style="color:#f0b429;font-size:14px">€ ···</b><span>цей місяць</span></div><div class="pgst-bar"><i style="width:48%;background:#f0b429"></i></div>';
    if(k==='calendar')return '<div class="pgst-cal"><i></i><i></i><i class="on"></i><i></i><i></i><i class="on"></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>';
    if(k==='wpult')return '<div class="pgst-prow"><span class="pgst-dot" style="background:#34c77b"></span>Проєкт А · наступний крок</div><div class="pgst-prow"><span class="pgst-dot" style="background:#e8843c"></span>Проєкт Б · наступний крок</div>';
    if(k==='wpipe')return '<div class="pgst-kan"><div><i class="a"></i><i class="a"></i><i></i></div><div><i class="a"></i></div><div><i class="a"></i><i></i></div></div>';
    if(k==='kanban')return '<div class="pgst-kan"><div><i class="a"></i><i></i><i></i></div><div><i class="a"></i><i class="a"></i></div><div><i></i></div></div>';
    if(k==='contacts')return '<div class="pgst-ava"><i style="background:#5b8def"></i><i style="background:#e8843c"></i><i style="background:#34c77b"></i><i style="background:#c77dff"></i></div>';
    if(k==='caseline')return '<div class="pgst-prow"><span class="pgst-dot" style="background:#e8843c"></span>12 лип · подія</div><div class="pgst-prow"><span class="pgst-dot" style="background:#5b8def"></span>18 лип · подія</div>';
    if(k==='project')return '<div style="display:flex;justify-content:space-between"><span>Дохід − витрати</span><b style="color:#34c77b">= прибуток</b></div><div class="pgst-bar"><i style="width:70%"></i></div>';
    if(k==='wportal')return 'Тап — і ти в потрібній папці, без блукання по рівнях.';
    if(k==='db')return '<div class="pgst-kan"><div><i class="a"></i><i></i></div><div><i class="a"></i><i></i></div><div><i class="a"></i><i></i></div></div>';
    if(k==='toggle')return '▸ Заголовок, що ховає вміст усередині.';
    if(k==='divider')return '<div style="height:1px;background:var(--pg-line);margin:8px 0"></div>';
    /* ═══ PREMIUM PACK V1 ═══ */
    if(k==='prompt')return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><b style="font-size:10px">Промт для рілсів</b><span style="background:rgba(199,125,255,.18);color:#c77dff;border-radius:6px;padding:2px 6px;font-size:8px">копіювати</span></div><div style="font-size:9px;opacity:.6;font-family:ui-monospace,monospace">Ти — сценарист коротких відео. Напиши хук про {тему}…</div>';
    if(k==='heatmap')return '<div class="pgst-cal"><i class="on"></i><i class="on"></i><i></i><i class="on"></i><i></i><i class="on"></i><i class="on"></i><i></i><i class="on"></i><i></i><i></i><i class="on"></i><i></i><i></i></div>';
    if(k==='kpi')return '<div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:16px">1 250 <span style="font-size:10px;opacity:.7">€</span></b><span style="color:#34c77b;font-size:10px">▲ 12%</span></div><div class="pgst-bar"><i style="width:62%;background:#6a7dff"></i></div>';
    if(k==='chart')return '<div style="display:flex;align-items:flex-end;gap:3px;height:26px"><i style="flex:1;background:#5b8def;border-radius:2px;height:40%"></i><i style="flex:1;background:#5b8def;border-radius:2px;height:70%"></i><i style="flex:1;background:#5b8def;border-radius:2px;height:55%"></i><i style="flex:1;background:#5b8def;border-radius:2px;height:100%"></i><i style="flex:1;background:#5b8def;border-radius:2px;height:80%"></i></div>';
    if(k==='tabs')return '<div style="display:flex;gap:4px"><span style="background:#9b8cff;color:#fff;border-radius:99px;padding:2px 8px;font-size:9px">План</span><span style="background:rgba(255,255,255,.08);border-radius:99px;padding:2px 8px;font-size:9px">Ідеї</span><span style="background:rgba(255,255,255,.08);border-radius:99px;padding:2px 8px;font-size:9px">Нотатки</span></div>';
    if(k==='accord')return '<div class="pgst-prow">▾ Розгорнута секція</div><div class="pgst-prow" style="opacity:.55">▸ Згорнута секція</div>';
    if(k==='embed')return '<div style="aspect-ratio:16/9;max-height:34px;background:rgba(255,107,157,.18);border-radius:6px;display:flex;align-items:center;justify-content:center">▶</div>';
    if(k==='audio')return '<div style="display:flex;align-items:center;gap:6px"><span style="width:18px;height:18px;border-radius:50%;background:#c77dff;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:8px">▶</span><span class="pgst-bar" style="flex:1;margin:0"><i style="width:35%;background:#c77dff"></i></span></div>';
    if(k==='wfocus')return '<div style="display:flex;align-items:center;gap:8px"><b style="font-size:14px">25:00</b><span>🍅 тап = старт фокуса</span></div>';
    return 'Тап «Вставити» — блок з\u2019явиться на сторінці.';
  }

  function bridge(){ return window.__flowPageBridge||null; }
  var editor=document.getElementById('pgEditor');
  var scr=document.getElementById('scr-page');
  var uid=function(){ return 'pg'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); };
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

  // нормалізація блока Flow → редактор розуміє
  function txtOf(b){ return b.text!=null?b.text:(b.title!=null?b.title:''); }
  function setTxt(b,v){ if(b.type==='note'||b.type==='task'||b.type==='bullet'||b.type==='num'||b.type==='quote'||b.type==='glass'||b.type==='callout'||b.type==='toggle'||b.type==='h1'||b.type==='h2'||b.type==='h3'){ b.text=v; } else { b.title=v; } }

  function locate(id,arr,parent){
    arr=arr||bridge().getBlocks();
    for(var i=0;i<arr.length;i++){
      if(String(arr[i].id)===String(id))return{block:arr[i],arr:arr,idx:i,parent:parent||null};
      if(arr[i].children){var r=locate(id,arr[i].children,arr[i]);if(r)return r;}
    }
    return null;
  }
  function save(){ var b=bridge(); if(b) b.save(); }

  // ── moveBlock: єдина точка переміщення блоків (SPECblocksv2 §2.1) ──
  // position: 'before' | 'after' | 'inside' | 'left' | 'right' (left/right — створюють/розширюють колонки, §4.1)
  function moveBlock(id,targetId,position){
    if(!id||!targetId||id===targetId) return null;
    var src=locate(id); if(!src) return null;
    var isDesc=src.block.children && locate(targetId,src.block.children);
    if(isDesc) return null; // не можна перенести блок усередину власного нащадка
    if(position==='left'||position==='right') return moveBlockSide(src,targetId,position);
    var block=src.block, fromArr=src.arr, fromIdx=src.idx;
    fromArr.splice(fromIdx,1);
    var t0=locate(targetId);
    if(!t0){ fromArr.splice(fromIdx,0,block); return null; } // ціль зникла — відкат
    var toArr,toIdx;
    if(position==='inside'){
      t0.block.children=t0.block.children||[];
      if(t0.block.type==='toggle') t0.block.open=true;
      if(t0.block.type==='board'){ if(block.gw==null)block.gw=4; if(block.gh==null)block.gh=2; }
      toArr=t0.block.children; toIdx=toArr.length; toArr.push(block);
    } else {
      toArr=t0.arr; toIdx=(position==='after')?t0.idx+1:t0.idx;
      toArr.splice(toIdx,0,block);
    }
    return {block:block,fromArr:fromArr,fromIdx:fromIdx,toArr:toArr,toIdx:toIdx};
  }
  function snapshotArr(arr){ return JSON.parse(JSON.stringify(arr)); }
  function restoreArr(arr,snap){ arr.length=0; for(var i=0;i<snap.length;i++) arr.push(snap[i]); }
