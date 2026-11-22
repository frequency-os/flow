  /* ════════ Магазин блоків (62-block-store.js, 18.11.2026) — вітрина «Полиця Pro», будова 3 «без міграції» ════════
     Блоки вже вшиті в застосунок (page-editor/01-palette.js, CATALOG). «Отримати» лише кладе блок у меню «＋ Блок»,
     «Прибрати» — ховає з меню; у папках, де блок уже стоїть, він працює далі (App Store забороняє докачувати код).
     Ключ blocks_got = {v:1, got:[k…], at} — легке налаштування (prefSet: сирий ключ + синк), є у FLOW_KEYS.
     Поки ключа нема — взятими вважаються ВСІ нинішні блоки магазину: це лише рахується, при старті нічого не пишеться.
     Пишеться тільки тапом людини «Отримати»/«Прибрати». Невідомі ключі в got (з новіших версій) не викидаємо.
     Блок із полем since новіше за BS_BASE — «Нове»: у меню нема, поки людина його не візьме. Агент Флоу і шаблони
     створюють блоки як раніше — магазин керує лише меню. Тексти — двома мовами (flowLang). */
  var BS_KEY='blocks_got', BS_BASE='2026-11-18';
  var BS_SPH=[['all','Усе','All'],['trk','Трекери','Trackers'],['health','Здоровʼя','Health'],['money','Гроші','Money'],['work','Робота','Work'],['study','Навчання','Study'],['goals','Цілі','Goals'],['home','Дім','Home']];
  /* k → сфери, значок, колір, звʼязок, прев'ю; тексти uk/en: n назва, s одне речення, d опис, st три кроки.
     ПРАВИЛО: кожен НОВИЙ запис тут — з since:'РРРР-ММ-ДД' пізніше за BS_BASE. Без since блок у людей, що вже
     тапали «Отримати/Прибрати», мовчки зник би з меню (у їхньому збереженому списку його нема). */
  var BS_ITEMS={
    countdown:{sp:['goals','health','home'],ic:'⏳',c:'#5ec8ff',pv:'cd',ln:['Сам по собі','Standalone'],
      uk:{n:'Відлік часу',s:'До дати чи від дати — роки … секунди',d:'Рахує час до події або від неї: Новий рік, відпустка, «скільки не палю». Цифри тікають щосекунди, три стилі: флип 3D, велике число, кільця.',st:['Назви й обери дату (з часом, «щороку»)','Вибери одиниці: роки … секунди','Дивись, як тікає — у документі й у чаті']},
      en:{n:'Countdown',s:'To a date or since a date — years … seconds',d:'Counts time to an event or since it: New Year, a trip, days without smoking. Digits tick every second, three styles: 3D flip, big number, rings.',st:['Name it and pick a date (time, yearly)','Choose units: years … seconds','Watch it tick — in documents and chats']}},
    dcal:{sp:['work','study','home'],ic:'📅',c:'#7fb0ff',pv:'cal',ln:['Планер','Planner'],
      uk:{n:'Календар папки',s:'Місяць справ цієї папки з Планера',d:'Показує місяць: у які дні в папці є справи з Планера й події. Тап по дню — що заплановано.',st:['Додай у папку','Плануй як завжди — справи з міткою папки стають крапками','Тап по дню — список і перехід у День']},
      en:{n:'Folder calendar',s:'This folder’s month from the Planner',d:'A month view: which days have this folder’s Planner blocks and events. Tap a day to see the plan.',st:['Add it to a folder','Plan as usual — tagged blocks become dots','Tap a day for its list']}},
    dtime:{sp:['work','study'],ic:'⏱',c:'#ffd27a',pv:'time',ln:['Планер','Planner'],
      uk:{n:'Час папки',s:'Скільки годин папки сьогодні',d:'Смуга дня з блоками Планера цієї папки й рискою «зараз». Скільки заплановано й зроблено — за день, тиждень чи місяць.',st:['Додай у папку','«＋ блок» прямо з віджета','Тиждень — стовпчики по днях']},
      en:{n:'Folder time',s:'Hours of this folder today',d:'A day strip with this folder’s Planner blocks and a “now” line. Planned and done — per day, week or month.',st:['Add it to a folder','“+ block” right from the widget','Week view — bars by day']}},
    dtasks:{sp:['work','study','home','goals'],ic:'✅',c:'#34c77b',pv:'tasks',ln:['План','Plan'],since:'2026-11-19',
      uk:{n:'Справи папки',s:'Що зробити сьогодні в цій папці',d:'Справи на сьогодні з міткою папки — і з часом, і без. Галочка прямо у віджеті, ☆ — у Головне, «＋ справа» одразу з міткою папки. Тап — відкриває План.',st:['Додай у папку','«＋ справа» прямо з віджета','Відмічай — План знає одразу']},
      en:{n:'Folder tasks',s:'What to do today in this folder',d:'Today’s tasks tagged with this folder — timed or not. Tick right in the widget, ☆ adds to Focus, “+ task” comes tagged with the folder. Tap opens Plan.',st:['Add it to a folder','“+ task” right from the widget','Tick it — Plan knows at once']}},
    dmission:{sp:['goals','work'],ic:'🎯',c:'#a99cff',pv:'mis',ln:['Місія','Mission'],
      uk:{n:'Місія папки',s:'Прогрес, наступний крок, дедлайн',d:'Кільце прогресу місії, наступний крок і скільки днів до дедлайну. Тап — сторінка місії.',st:['Повʼяжи місію','Відмічай віхи — кільце росте','Наступний крок завжди зверху']},
      en:{n:'Folder mission',s:'Progress, next step, deadline',d:'Mission progress ring, the next step and days to the deadline. Tap to open the mission.',st:['Link a mission','Tick milestones — the ring grows','The next step is always on top']}},
    dhabit:{sp:['health','goals','study','trk'],ic:'🔥',c:'#ff8a4c',pv:'hab',ln:['Місія','Mission'],
      uk:{n:'Трекер цілі',s:'Позначка щодня · 5 виглядів',d:'Повʼяжи ціль із папкою — і щодня один тап «зробив». Ланцюг, Шлях, Сезон, Росток чи Кільце: вигляд міняється будь-коли, позначки ті самі. Ритм і вихідні — у налаштуваннях.',st:['Додай у папку з ціллю','Вибери вигляд','Тапай «✓» щодня']},
      en:{n:'Goal tracker',s:'A daily check · 5 looks',d:'Link a goal to a folder and tap “done” once a day. Chain, Path, Season, Sprout or Ring: switch the look any time, the marks stay. Rhythm and rest days are in the settings.',st:['Add it to a goal folder','Pick a look','Tap “✓” every day']}},
    dcount:{sp:['goals','trk'],ic:'🏁',c:'#9b8cff',pv:'dcount',ln:['Місія','Mission'],
      uk:{n:'Відлік до мети',s:'Скільки днів до фінішу місії',d:'Дні до останньої віхи місії і найближчий крок.',st:['Повʼяжи місію з датою фінішу','Дивись, скільки лишилось','Наступна віха — під числом']},
      en:{n:'Days to goal',s:'Days until the mission finish',d:'Days to the mission’s last milestone and the next step.',st:['Link a mission with a finish date','See what’s left','Next milestone under the number']}},
    dsave:{sp:['money','goals','trk'],ic:'🐷',c:'#ffc261',pv:'save',ln:['Гаманець','Wallet'],
      uk:{n:'Скарбничка',s:'Скільки зібрано на мету',d:'Доходи з міткою місії складаються в суму, смужка — скільки лишилось до цілі. «＋ ₴» — відкласти з віджета.',st:['Задай ціль','«＋ ₴» — дохід у Гаманець','«Зібрано ✓», коли дійшов']},
      en:{n:'Savings jar',s:'How much is saved for the goal',d:'Mission-tagged income adds up, the bar shows what’s left. “+ ₴” saves right from the widget.',st:['Set a target','“+ ₴” records income in the Wallet','“Saved ✓” when you get there']}},
    dcounter:{sp:['health','study','goals','trk'],ic:'🔢',c:'#f0b429',pv:'cnt',ln:['Місія','Mission'],
      uk:{n:'Лічильник',s:'Будь-яке число з метою',d:'Слова, кілограми, сторінки, кілометри: число, мета й смужка, «−» і «＋» на віджеті.',st:['Назви лічильник і мету','Тисни «＋» або впиши число','Відсоток і смужка']},
      en:{n:'Counter',s:'Any number with a target',d:'Words, kilos, pages, kilometres: a number, a target and a bar, “−” and “+” on the widget.',st:['Name it and set a target','Tap “+” or type a value','Percent and bar']}},
    dphoto:{sp:['health','home','goals','trk'],ic:'📸',c:'#ff7a9a',pv:'photo',ln:['Місія','Mission'],
      uk:{n:'Фото-прогрес',s:'Було → стало',d:'Перше й останнє фото місії поруч — видно зміну, якої не помічаєш щодня.',st:['Додай перше фото','Фотографуй час від часу','Порівнюй «було → стало»']},
      en:{n:'Photo progress',s:'Before → after',d:'The first and latest mission photos side by side — change you don’t notice day to day.',st:['Add the first photo','Take photos now and then','Compare before → after']}},
    wgin:{sp:['money','work'],ic:'💚',c:'#22b573',pv:'in',ln:['Гаманець','Wallet'],
      uk:{n:'Доходи',s:'Гроші цієї папки з ціллю',d:'Доходи з міткою папки цього місяця: основний, додатковий чи пасивний. Ціль місяця і «＋».',st:['Вибери тип доходу','«＋» — дохід у Гаманці з міткою','Смужка до цілі місяця']},
      en:{n:'Income',s:'This folder’s money with a target',d:'This month’s folder-tagged income: main, side or passive. Monthly target and “+”.',st:['Choose the income type','“+” adds tagged income','Bar to the monthly target']}},
    wgout:{sp:['money','home'],ic:'🧾',c:'#ff6a3d',pv:'out',ln:['Гаманець','Wallet'],
      uk:{n:'Витрати',s:'Скільки пішло, з лімітом',d:'Витрати папки за місяць і ліміт. Біля межі смужка попереджає.',st:['Задай ліміт','«＋ витрата» — у Гаманець з міткою','Тримай межу']},
      en:{n:'Spending',s:'What went out, with a limit',d:'The folder’s spending this month and a limit. Near the limit the bar warns you.',st:['Set a limit','“+ expense” goes to the Wallet','Stay under the line']}},
    wgwallet:{sp:['money'],ic:'👛',c:'#7f8cff',pv:'wallet',ln:['Гаманець','Wallet'],
      uk:{n:'Гаманець',s:'Баланс і прогноз місяця',d:'Баланс, прогноз місяця і кільця, «−» і «＋» прямо з віджета.',st:['Додай на сторінку','«−» витрата, «＋» дохід','Кільця — як іде місяць']},
      en:{n:'Wallet',s:'Balance and month forecast',d:'Balance, month forecast and rings, “−” and “+” right from the widget.',st:['Add it to a page','“−” expense, “+” income','Rings show the month']}},
    wgwork:{sp:['work','money'],ic:'⏱',c:'#5b8def',pv:'work',ln:['Робота','Work'],since:'2026-11-22',
      uk:{n:'Робота',s:'Години й зароблене за місяць',d:'Скільки годин відпрацьовано цього місяця і скільки це грошей за твоєю ставкою. «＋ Години» записує сьогоднішню зміну, тап — календар Роботи і зарплата.',st:['Додай у папку','«＋ Години» — запис на сьогодні','Сума за місяць росте сама']},
      en:{n:'Work',s:'Hours and earnings this month',d:'How many hours you worked this month and what that makes at your rate. “+ Hours” logs today’s shift, a tap opens the Work calendar and salary.',st:['Add it to a folder','“+ Hours” logs today','The month total grows by itself']}},
    wgmission:{sp:['money','goals'],ic:'🎯',c:'#34c77b',pv:'mmoney',ln:['Гаманець','Wallet'],
      uk:{n:'Гроші місії',s:'Дохід, бюджет і приз місії',d:'Скільки місія заробила і витратила, бюджет і приз.',st:['Повʼяжи місію','Мітка місії на операціях','Бюджет і приз — одним поглядом']},
      en:{n:'Mission money',s:'Income, budget and prize of a mission',d:'What the mission earned and spent, its budget and prize.',st:['Link a mission','Tag operations with it','Budget and prize at a glance']}},
    wgenv:{sp:['money','home'],ic:'✉️',c:'#f0a020',pv:'env',ln:['Гаманець','Wallet'],
      uk:{n:'Конверти й платежі',s:'Оренда, звʼязок, підписки',d:'Сума в конвертах і найближчі платежі з Плану місяця.',st:['Розклади гроші по конвертах','Додай платежі','Найближчі — зверху']},
      en:{n:'Envelopes & bills',s:'Rent, phone, subscriptions',d:'Money in envelopes and the next bills from the month plan.',st:['Split money into envelopes','Add bills','The nearest are on top']}},
    wgdebt:{sp:['money'],ic:'⚖️',c:'#ff4d6d',pv:'debt',ln:['Гаманець','Wallet'],
      uk:{n:'Борги й правила',s:'Хто кому винен',d:'Хто кому винен, скільки повернуто, і серія «без нових боргів».',st:['Запиши борг','Повертай частинами','Тримай серію правил']},
      en:{n:'Debts & rules',s:'Who owes whom',d:'Who owes whom, what’s been repaid, and your “no new debt” streak.',st:['Record a debt','Repay in parts','Keep the rules streak']}},
    tbl:{sp:['work','study','health'],ic:'▦',c:'#34c3b0',pv:'tbl',ln:['Планер (колонка)','Planner (column)'],
      uk:{n:'Таблиця',s:'Колонки, статуси, дати, графік',d:'Колонки: текст, число, галочка, дата, статус. Перемикається на Дошку й Календар, рахує «Разом».',st:['Додай — одразу Назва, Статус, Дата','Статус тапом, дата з календаря','Таблиця · Дошка · Календар']},
      en:{n:'Table',s:'Columns, statuses, dates, chart',d:'Columns: text, number, checkbox, date, status. Switches to Board and Calendar, sums totals.',st:['Add — Name, Status, Date are ready','Status by tap, date from a calendar','Table · Board · Calendar']}},
    weekreview:{sp:['study','work','goals'],ic:'✨',c:'#9b8cff',pv:'ai',ln:['Флоу AI','Flow AI'],
      uk:{n:'Огляд тижня',s:'Флоу підсумовує сторінку',d:'Флоу читає записи сторінки і пише короткий підсумок. Оновлюється лише за натисканням.',st:['Додай огляд','Натисни «Оновити»','Читай і дій']},
      en:{n:'Week review',s:'Flow sums up the page',d:'Flow reads the page and writes a short summary. Refreshes only when you tap.',st:['Add the review','Tap “Refresh”','Read and act']}},
    ai:{sp:['study','work'],ic:'🤖',c:'#9b8cff',pv:'ai',ln:['Флоу AI','Flow AI'],
      uk:{n:'Флоу AI',s:'AI-дія з цією сторінкою',d:'Попроси Флоу щось зробити з цією сторінкою: підсумувати, розбити на кроки, переписати.',st:['Додай блок','Напиши, що зробити','Прийми або відкинь результат']},
      en:{n:'Flow AI',s:'An AI action on this page',d:'Ask Flow to do something with this page: summarise, split into steps, rewrite.',st:['Add the block','Say what to do','Accept or discard']}}
  };
  var BS_REL={countdown:['dcount','dmission','dcal'],dcal:['dtime','tbl','countdown'],dtime:['dcal','tbl','dmission'],dtasks:['dtime','dcal','dmission'],dmission:['dhabit','dsave','countdown'],dhabit:['dmission','dcounter','dphoto'],dcount:['countdown','dmission'],dsave:['wgin','dmission','wgenv'],dcounter:['dhabit','tbl','dphoto'],dphoto:['dhabit','dcounter','dmission'],wgin:['wgout','dsave','wgwallet'],wgout:['wgin','wgenv','wgdebt'],wgwallet:['wgin','wgout','wgenv'],wgwork:['wgin','wgwallet','dtime'],wgmission:['dsave','dmission','wgin'],wgenv:['wgout','wgdebt','wgwallet'],wgdebt:['wgenv','wgout'],tbl:['dcal','dcounter','weekreview'],weekreview:['tbl','dmission'],ai:['weekreview','tbl']};
  function bsLang(){ try{ return (window.flowLang&&window.flowLang())==='en'?'en':'uk'; }catch(_){ return 'uk'; } }
  function bsT(it){ return it[bsLang()]||it.uk; }
  /* «Ще» (29-more-screen.js) і меню блоків малюються ще ДО цього файлу, а функції в збірці «спливають» раніше за var —
     тож поки BS_ITEMS не присвоєно, усе поводиться як «магазину ще нема»: усе взято, нових 0 */
  function bsReady(){ return typeof BS_ITEMS==='object'&&BS_ITEMS!==null; }
  function bsInStore(k){ return bsReady()&&Object.prototype.hasOwnProperty.call(BS_ITEMS,String(k||'')); }
  function bsIsNew(k){ const it=bsReady()?BS_ITEMS[k]:null; return !!(it&&it.since&&String(it.since)>BS_BASE); }
  // збережений вибір; null — людина ще не тапала (тоді все нинішнє взято)
  function bsRaw(){ try{ const v=JSON.parse(localStorage.getItem(BS_KEY)||'null'); return v&&typeof v==='object'&&Array.isArray(v.got)?v:null; }catch(_){ return null; } }
  function bsGot(k){ if(!bsInStore(k)) return true; const r=bsRaw(); return r?r.got.indexOf(k)>=0:!bsIsNew(k); }
  function bsNewCount(){ if(!bsReady()) return 0; return Object.keys(BS_ITEMS).filter(k=>bsIsNew(k)&&!bsGot(k)).length; }
  function bsSet(k,on){
    if(!bsInStore(k)) return;
    if(!bsTrusted()){ bsToast(bsLang()==='en'?'Syncing with the cloud — try again in a moment':'Звіряюсь із хмарою — спробуй за мить'); return false; }
    const r=bsRaw(); let got=r?r.got.filter(x=>typeof x==='string'):Object.keys(BS_ITEMS).filter(x=>!bsIsNew(x));
    got=got.filter(x=>x!==k); if(on) got.push(k);
    try{ prefSet(BS_KEY,JSON.stringify({v:1,got,at:Date.now()})); }catch(_){}
    try{ chHaptic(on?'medium':'select'); }catch(_){}
    bsRedraw();
  }
  // bsGot / bsNewCount / bsOpen — функції верхнього рівня збірки, тож уже доступні як window.* для page-editor і «Ще».
  // НЕ обгортати (window.bsOpen=o=>bsOpen(o)): у глобальній області це той самий запис — вийде безкінечний виклик.
  // значення з хмари прийшло після старту — перемалювати відкриту вітрину
  // на холодному старті сесії ще нема (prefCatchup бачить лише локальне) — доганяємо, коли вона зʼявилась і після звірок
  var bsCatchAt=0;
  function bsCatchup(){ const t=Date.now(); if(t-bsCatchAt<15000) return; bsCatchAt=t; try{ prefCatchup(BS_KEY,()=>bsRedraw()); }catch(_){} }
  bsCatchup();
  try{ document.addEventListener('flowsbready',()=>{ bsCatchAt=0; bsCatchup(); }); document.addEventListener('flowsync',bsCatchup); }catch(_){}
  // поки хмара не звірена (є вхід, а дані ще не довірені) — не пишемо: список цілком затер би вибір з іншого пристрою
  function bsTrusted(){ try{ return typeof window.sbDataTrusted!=='function'||window.sbDataTrusted(); }catch(_){ return true; } }

  /* ── прев'ю з прикладними даними (не дані людини) ── */
  /* вигляди «Трекера цілі» (22.11.2026, 48-widgets.js wdHabLook) — прев'ю з прикладними даними */
  var BS_LOOKS=[['chain','Ланцюг','Chain','Серія днів поспіль','Days in a row'],['path','Шлях','Path','66 днів клітинками, віхи','66 days in cells, milestones'],
    ['grid','Сезон','Season','Сітка тижнів, ритм','Weeks grid, your rhythm'],['plant','Росток','Sprout','Росте з кожним днем','Grows every day'],['ring','Кільце','Ring','Тиждень кільцем, тап — ✓','Week as a ring, tap — ✓']];
  function bsPv(k,sz,lk){
    const it=BS_ITEMS[k], t=bsT(it), en=bsLang()==='en', c=it.c, s=sz==='s';
    const h=(a)=>`<span class="bsw-h"><i style="background:${c}"></i>${a||esc(t.n)}</span>`;
    const big=(v,u)=>`<b class="bsw-big">${v}<small>${u||''}</small></b>`, sub=v=>`<small class="bsw-sub">${v}</small>`;
    const bar=p=>`<span class="bsw-bar"><i style="width:${p}%;background:${c}"></i></span>`;
    let x='';
    switch(it.pv){
      case 'cd': x=h()+`<b class="bsw-n">${en?'New Year':'Новий рік'}</b>`+(s?big(44,en?'days':'днів')+sub('02:10:05'):`<span class="bsw-flip">${[['44',en?'days':'дні'],['02',en?'hours':'год'],['10',en?'min':'хв'],['05',en?'sec':'с']].map(u=>`<span><span class="bsw-fd">${u[0].split('').map(d=>`<i>${d}</i>`).join('')}</span><small>${u[1]}</small></span>`).join('')}</span>`); break;
      case 'tasks': x=h()+big(3,en?'tasks':'справи')+(s?sub(en?'Easy run 6 km':'Легкий біг 6 км'):`<span class="bsw-tks"><span class="on"><i style="background:${c}"></i>${en?'Book the hall':'Забронювати зал'}</span><span><i></i>${en?'Easy run 6 km':'Легкий біг 6 км'}</span><span><i></i>${en?'Buy shoes':'Купити кросівки'}</span></span>`); break;
      case 'cal': { let g=''; for(let d=1;d<=30;d++) g+=`<span class="${d===17?'td':d>17?'f':''}">${d}${[3,5,8,13,15,19,21].includes(d)?'<u></u>':''}</span>`;
        x=s?h()+big(17,en?'Nov':'лист')+sub(en?'2 plans · run 18:00':'2 справи · біг 18:00'):h(en?'November':'Листопад')+`<span class="bsw-cal">${g}</span>`; break; }
      case 'time': x=h()+big('2,5',en?'h':'год')+`<span class="bsw-tl"><i style="left:6%;width:12%;background:${c}"></i><i style="left:60%;width:14%;background:${c};opacity:.6"></i><b style="left:48%"></b></span>`+(s?'':sub(en?'18:00 · Easy run 6 km':'18:00 · Легкий біг 6 км')); break;
      case 'mis': x=h()+`<span class="bsw-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" class="tr"/><circle cx="18" cy="18" r="15" pathLength="100" stroke-dasharray="62 100" style="stroke:${c}"/></svg><b>62%</b></span>`+(s?'':sub(en?'Next: sign up for the race':'Далі: зареєструватись на забіг')); break;
      case 'hab':
        if(lk==='path') x=h()+big(23,'/ 66')+`<span class="bsw-path">${Array.from({length:s?22:44},(_,i)=>`<i style="${i<23?'background:'+c:''}"></i>`).join('')}</span>`;
        else if(lk==='grid'){ let g=''; for(let i=0;i<(s?42:84);i++){ const v=(i*37+11)%10; g+=`<i style="${v>2?'background:'+c+';opacity:'+(v>7?1:v>5?.7:.4):''}"></i>`; }
          x=h()+big('72%',en?'12 weeks':'12 тижнів')+`<span class="bsw-hm${s?' s':''}">${g}</span>`; }
        else if(lk==='plant') x=h()+`<span class="bsw-pl" style="--fc:${c}">${typeof wdPlantSvg==='function'?wdPlantSvg(14):''}<span>${big(14,en?'days':'днів')}${sub(en?'Seedling · bush at 21':'Росток · кущ на 21')}</span></span>`;
        else if(lk==='ring') x=h()+`<span class="bsw-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" class="tr"/><circle cx="18" cy="18" r="15" pathLength="100" stroke-dasharray="71 100" style="stroke:${c}"/></svg><b>5/7</b></span>`+(s?'':sub(en?'this week · tap the ring':'цього тижня · тап по кільцю'));
        else x=h()+big(12,en?'days':'днів')+`<span class="bsw-d7">${[1,1,1,1,1,0,0].map(o=>`<i style="${o?'background:'+c:''}"></i>`).join('')}</span>`;
        break;
      case 'dcount': x=h()+big(31,en?'days left':'день лишилось')+(s?'':sub(en?'Half marathon · Dec 19':'Півмарафон · 19 грудня')); break;
      case 'save': x=h()+big('8 400',en?'of 12 000 ₴':'з 12 000 ₴')+bar(70)+(s?'':sub(en?'Sneakers · 70%':'Кросівки · 70%')); break;
      case 'cnt': x=h()+`<b class="bsw-n">${en?'Pages in English':'Сторінок англійською'}</b>`+big('214','/ 300')+bar(71); break;
      case 'photo': x=h()+`<span class="bsw-ba"><i style="background:linear-gradient(160deg,#5b4a3a,#2b2420)"></i><i style="background:linear-gradient(160deg,#ffb36b,#c04d8f)"></i></span>`+(s?'':sub(en?'12 photos · 78 days':'12 фото · 78 днів')); break;
      case 'in': x=h()+big('18 500','₴')+bar(74)+sub(en?'target 25 000':'ціль 25 000'); break;
      case 'out': x=h()+big('3 920',en?'of 5 000 ₴':'з 5 000 ₴')+bar(78)+sub(en?'1 080 ₴ left':'лишилось 1 080 ₴'); break;
      case 'wallet': x=h()+big('12 340','₴')+sub(en?'forecast +4 100 by month end':'прогноз +4 100 до кінця місяця'); break;
      case 'work': x=h()+big('14 400','₴')+(s?sub(en?'96 h this month':'96 год за місяць'):`<span class="bsw-d7">${[8,8,6,8,0,0,4].map(v=>`<i style="${v?'background:'+c+';opacity:'+(.35+v/12):''}"></i>`).join('')}</span>`+sub(en?'96 h · payday on the 31st':'96 год · виплата 31-го')); break;
      case 'mmoney': x=h()+big('+6 200','₴')+bar(55)+sub(en?'budget 11 000 · prize: trip':'бюджет 11 000 · приз: подорож'); break;
      case 'env': x=h()+big('9 600',en?'₴ in envelopes':'₴ у конвертах')+(s?'':`<span class="bsw-row"><b>${en?'Rent':'Оренда'}</b><span>${en?'Dec 1 · 8 000':'1 груд · 8 000'}</span></span>`); break;
      case 'debt': x=h()+big('−1 200',en?'₴ net':'₴ нетто')+bar(40)+(s?'':sub(en?'🔥 12 days without new debt':'🔥 12 днів без нових боргів')); break;
      case 'tbl': x=s?h()+`<b class="bsw-n">${en?'Workouts':'Тренування'}</b>`+big('44,2','km')+sub(en?'8 rows · 5 done':'8 рядків · 5 готово')
        :h(en?'Workouts':'Тренування')+`<span class="bsw-tbl">${[[en?'Intervals':'Інтервали','17.11','5,2'],[en?'Easy run':'Легкий біг','15.11','7'],[en?'Long run':'Довга','13.11','12']].map(r=>`<span><b>${r[0]}</b><i>${r[1]}</i><em>${r[2]}</em></span>`).join('')}</span>`; break;
      case 'ai': x=h()+`<span class="bsw-ai">${en?'<b>Week:</b> 3 of 4 runs, longest 12 km. Not ticked: “Buy gels”.':'<b>Тиждень:</b> 3 пробіжки з 4, найдовша — 12 км. Не відмічено «Купити гелі».'}</span>`; break;
    }
    return `<div class="bsw bsw-${sz}" aria-hidden="true">${x}</div>`;
  }

  /* ── вітрина ── */
  var bsState={sph:'all',q:'',open:'',look:''};
  function bsBtn(k,big){
    const g=bsGot(k), en=bsLang()==='en';
    return `<button class="bs-get${big?' big':''}${g?' got':''}" data-bsget="${esc(k)}" aria-pressed="${g}">${g?(big?(en?'In menu ✓':'У меню ✓'):'✓'):(en?'Get':'Отримати')}</button>`;
  }
  function bsRow(k){ const it=BS_ITEMS[k], t=bsT(it), en=bsLang()==='en';
    return `<div class="bs-app" role="button" tabindex="0" data-bsopen="${esc(k)}"><span class="bs-ico" style="--c:${it.c}">${it.ic}</span><span class="bs-tx"><b>${esc(t.n)}${bsIsNew(k)?`<span class="bs-new">${en?'NEW':'НОВЕ'}</span>`:''}</b><small>${esc(t.s)}</small></span>${bsBtn(k)}</div>`; }
  function bsHomeHTML(){
    const en=bsLang()==='en', q=bsState.q.trim().toLowerCase(), keys=Object.keys(BS_ITEMS);
    const match=k=>{ const t=bsT(BS_ITEMS[k]); return !q||(t.n+' '+t.s+' '+(BS_ITEMS[k].uk.n)).toLowerCase().includes(q); };
    const sp=bsState.sph, inSp=k=>sp==='all'||BS_ITEMS[k].sp.includes(sp);
    let h=`<div class="bs-chips" role="group">${BS_SPH.map(s=>`<button class="bs-chip${sp===s[0]?' on':''}" data-bssph="${s[0]}">${en?s[2]:s[1]}</button>`).join('')}</div>`;
    if(sp==='trk'&&!q) return h+bsTrkHTML(en);
    if(q||sp!=='all'){ const L=keys.filter(k=>match(k)&&inSp(k));
      return h+(L.length?`<div class="bs-shelf">${L.map(bsRow).join('')}</div>`:`<p class="bs-empty">${en?'Nothing found':'Нічого не знайшлось'}</p>`); }
    // прибрані людиною (не нові) — одразу зверху: сюди веде рядок «Ще N блоків у Магазині» з меню «＋ Блок»
    const off=keys.filter(k=>!bsGot(k)&&!bsIsNew(k));
    if(off.length) h+=`<div class="bs-sh"><b>${en?'Removed from the menu':'Прибрані з меню'}</b></div><div class="bs-shelf">${off.map(bsRow).join('')}</div>`;
    const f=keys.find(k=>bsIsNew(k)&&!bsGot(k))||'countdown', ft=bsT(BS_ITEMS[f]);
    h+=`<button class="bs-feat" data-bsopen="${f}"><span class="bs-eyebrow">${bsIsNew(f)?(en?'New':'Нове'):(en?'Pick of the week':'Вибір тижня')}</span><b>${esc(ft.n)}</b><small>${esc(ft.d)}</small>${bsPv(f,'m')}</button>`;
    [['health',en?'For health':'Для здоровʼя'],['money',en?'Money under control':'Гроші під контролем'],['work',en?'Work & study':'Робота й навчання'],['goals',en?'Goals':'Цілі']].forEach(([s,title])=>{
      const L=keys.filter(k=>BS_ITEMS[k].sp.includes(s)).slice(0,5);
      h+=`<div class="bs-sh"><b>${title}</b><button data-bssph="${s}">${en?'All ›':'Усі ›'}</button></div><div class="bs-shelf">${L.map(bsRow).join('')}</div>`; });
    return h;
  }
  // вкладка «Трекери»: один блок «Трекер цілі» і його пʼять виглядів, нижче — інші блоки прогресу місії
  function bsTrkHTML(en){
    const L=['dcounter','dphoto','dcount','dsave'].filter(bsInStore);
    return `<p class="bs-lead">${en?'Link a goal to a folder and mark each day with one tap. One tracker — five looks, switch any time.':'Повʼяжи ціль із папкою — і щодня один тап. Один трекер — пʼять виглядів, міняються будь-коли.'}</p>
      <div class="bs-shelf">${bsRow('dhabit')}</div>
      <div class="bs-looks">${BS_LOOKS.map(l=>`<button class="bs-look" data-bsopen="dhabit" data-bslook="${l[0]}"><span class="bs-lkt"><b>${en?l[2]:l[1]}</b><small>${esc(en?l[4]:l[3])}</small></span>${bsPv('dhabit','s',l[0])}</button>`).join('')}</div>
      ${L.length?`<div class="bs-sh"><b>${en?'More for progress':'Ще для прогресу'}</b></div><div class="bs-shelf">${L.map(bsRow).join('')}</div>`:''}`;
  }
  function bsPageHTML(k){
    const it=BS_ITEMS[k], t=bsT(it), en=bsLang()==='en', g=bsGot(k), sp=BS_SPH.find(s=>s[0]===it.sp[0])||BS_SPH[0];
    const selected=BS_LOOKS.find(l=>l[0]===bsState.look);
    const looks=selected?[selected,...BS_LOOKS.filter(l=>l!==selected)]:BS_LOOKS;
    return `<div class="bs-dh"><span class="bs-ico lg" style="--c:${it.c}">${it.ic}</span><div class="bs-dtx"><h3>${esc(t.n)}</h3><small>${esc(t.s)}</small>
        <div class="bs-acts">${bsBtn(k,true)}${g?`<button class="bs-rm" data-bsrm="${esc(k)}">${en?'Remove from menu':'Прибрати з меню'}</button>`:''}</div></div></div>
      <div class="bs-info"><div><small>${en?'Area':'Сфера'}</small><b>${en?sp[2]:sp[1]}</b></div><div><small>${en?'Linked to':'Звʼязок'}</small><b>${esc(it.ln[en?1:0])}</b></div><div><small>${en?'Sizes':'Розміри'}</small><b>S·M·L</b></div><div><small>${en?'Offline':'Офлайн'}</small><b>✓</b></div></div>
      <div class="bs-sec"><b>${en?'How it looks':'Як виглядає'}</b><small>${en?'Example data':'Приклад, не твої дані'}</small></div>
      <div class="bs-shots">${k==='dhabit'?looks.map(l=>`<div class="bs-shot"><small>${en?l[2]:l[1]}</small>${bsPv(k,'s',l[0])}</div>`).join('')
        :`<div class="bs-shot"><small>${en?'Small':'Малий'}</small>${bsPv(k,'s')}</div><div class="bs-shot m"><small>${en?'Wide':'Широкий'}</small>${bsPv(k,'m')}</div><div class="bs-shot m"><small>${en?'Large':'Великий'}</small>${bsPv(k,'l')}</div>`}</div>
      <div class="bs-sec"><b>${en?'What it does':'Що робить'}</b></div><p class="bs-desc">${esc(t.d)}</p>
      <div class="bs-sec"><b>${en?'How it works':'Як працює'}</b></div><div class="bs-steps">${t.st.map((s,i)=>`<div><i style="--c:${it.c}">${i+1}</i><span>${esc(s)}</span></div>`).join('')}</div>
      <div class="bs-sec"><b>${en?'Goes well with':'Поєднується з'}</b></div><div class="bs-rel">${(BS_REL[k]||[]).filter(bsInStore).map(r=>`<button data-bsopen="${r}"><span class="bs-ico" style="--c:${BS_ITEMS[r].c}">${BS_ITEMS[r].ic}</span>${esc(bsT(BS_ITEMS[r]).n)}</button>`).join('')}</div>
      <p class="bs-note">${en?'“Get” adds the block to the “+ Block” menu. “Remove” hides it from the menu — where it already stands, it keeps working.':'«Отримати» кладе блок у меню «＋ Блок». «Прибрати» ховає з меню — там, де блок уже стоїть, він працює далі.'}</p>`;
  }
  function bsRedraw(){
    const ov=document.getElementById('bsOv'); if(!ov) return;
    const en=bsLang()==='en', body=ov.querySelector('.bs-body'), y=body.scrollTop;
    const k=bsState.open, page=k&&bsInStore(k);
    ov.querySelector('.bs-title').textContent=page?'':(en?'Block store':'Магазин блоків');
    ov.querySelector('[data-bsback]').textContent=page?(en?'‹ Store':'‹ Магазин'):(en?'‹ Back':'‹ Назад');
    ov.querySelector('.bs-search').hidden=!!page;
    body.innerHTML=page?bsPageHTML(k):bsHomeHTML();
    body.scrollTop=y;
  }
  function bsToast(t){ try{ plToast(t); }catch(_){} }
  function bsOpen(o){
    if(!bsReady()) return;
    o=o||{}; bsState={sph:o.sph||'all',q:'',open:o.k&&bsInStore(o.k)?o.k:'',look:''};
    let ov=document.getElementById('bsOv'); if(ov) ov.remove();
    const en=bsLang()==='en';
    ov=document.createElement('div'); ov.id='bsOv'; ov.className='bs-ov'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('data-i18n-skip','1');
    ov.innerHTML=`<div class="bs-top"><button class="bs-back" data-bsback></button><b class="bs-title"></b><span class="bs-sp"></span><button class="bs-x" data-bsx aria-label="${en?'Close':'Закрити'}">✕</button></div>
      <div class="bs-search"><input type="search" id="bsQ" placeholder="${en?'Blocks, areas, “timer”…':'Блоки, сфери, «таймер»…'}" aria-label="${en?'Search blocks':'Пошук блоків'}"></div>
      <div class="bs-body"></div>`;
    document.body.appendChild(ov);
    const close=()=>{ ov.remove(); };
    ov.addEventListener('click',e=>{
      const t=e.target;
      if(t.closest('[data-bsx]')){ close(); return; }
      if(t.closest('[data-bsback]')){ if(bsState.open){ bsState.open=''; ov.querySelector('.bs-body').scrollTop=0; bsRedraw(); } else close(); return; }
      const g=t.closest('[data-bsget]'); if(g){ e.stopPropagation(); const k=g.dataset.bsget, on=!bsGot(k); if(bsSet(k,on)===false) return; if(on) bsToast(en?'In the “+ Block” menu ✓':'Є в меню «＋ Блок» ✓'); return; }
      const rm=t.closest('[data-bsrm]'); if(rm){ if(bsSet(rm.dataset.bsrm,false)===false) return; bsToast(en?'Removed from the menu — still works in folders':'Прибрано з меню — у папках працює далі'); return; }
      const s=t.closest('[data-bssph]'); if(s){ bsState.sph=s.dataset.bssph; bsState.open=''; ov.querySelector('.bs-body').scrollTop=0; bsRedraw(); return; }
      const op=t.closest('[data-bsopen]'); if(op){ bsState.open=op.dataset.bsopen; bsState.look=op.dataset.bslook||''; ov.querySelector('.bs-body').scrollTop=0; bsRedraw(); return; }
    });
    ov.addEventListener('keydown',e=>{ if(e.key==='Escape'){ close(); return; } if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-bsopen]')&&e.target.tagName!=='BUTTON'){ e.preventDefault(); e.target.click(); } });
    ov.querySelector('#bsQ').addEventListener('input',e=>{ bsState.q=e.target.value.slice(0,60); bsRedraw(); });
    bsRedraw();
    setTimeout(()=>{ try{ ov.querySelector('[data-bsback]').focus(); }catch(_){} },30);
  }
