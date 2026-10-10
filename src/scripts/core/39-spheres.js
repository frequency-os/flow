  /* ════════ Сфери: папка + будівля в «Моєму світі» ════════
     Сфера — це звичайна папка з полем sphere:{tpl,bld}. Працюєш у ній як завжди
     (блоки, сторінки, чати); вкладка «Сфери» на Огляді показує головне по кожній,
     а гра (misto.html) бачить ті самі цифри через flowWorldBridge.spheres() і
     нічого в папках не змінює. Шаблон створює папку одразу з потрібними блоками.
     Поки що лише для розробника (ворота upDevOn), як і «Мій світ».
     Позначка пишеться тільки з дії людини (меню папки чи «Нова сфера») —
     автоматичних записів тут нема. */

  // значки — лінійні, білі на кольоровій заливці (стиль B)
  const SPH_ICONS={
    wallet:'<path d="M3.5 7.5h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3z"/><path d="M3.5 8V6.5a2.5 2.5 0 0 1 2.5-2.5h10"/><path d="M16 14h2"/>',
    dumbbell:'<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
    book:'<path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5V20"/>',
    server:'<rect x="4" y="3.5" width="16" height="7" rx="2"/><rect x="4" y="13.5" width="16" height="7" rx="2"/><path d="M8 7h.01M8 17h.01M12 7h4M12 17h4"/>',
    video:'<rect x="3" y="6.5" width="12.5" height="11" rx="2.5"/><path d="m15.5 10.5 5-3v9l-5-3"/>',
    nosmoke:'<circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/><path d="M7.5 12.5h6"/>',
    home:'<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.5V19a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19v-8.5"/>',
    star:'<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'
  };
  function sphIcon(name){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(SPH_ICONS[name]||SPH_ICONS.star)+'</svg>'; }

  /* Шаблони: блоки — ті самі, що в палітрі документа (дефолти як у 03-premium-pack).
     «План» = віджет «Час папки» (dtime, 48-widgets.js) — замість старого wplanday (10.10.2026). */
  const SPH_TPL={
    fin:{n:'Кабінет фінансів', d:'Дохід, витрати, ціль місяця', ic:'wallet', c:'#22c55e', bld:'bank', em:'💰',
      chips:['Доходи','Витрати','Гаманець'],
      blocks:()=>[{type:'wgmoney',kind:'in',src:'extra',label:'Доходи',goal:0},{type:'wgmoney',kind:'out',label:'Витрати',goal:0},{type:'wgwallet'}]},
    sport:{n:'Спорт', d:'Тренування, звичка, план', ic:'dumbbell', c:'#f97316', bld:'gym', em:'🏋️',
      chips:['Хітмапа','План'],
      blocks:()=>[{type:'heatmap',title:'Тренування',marks:{}},{type:'dtime',sz:'m',gw:12,gh:2,period:'day'}]},
    learn:{n:'Навчання', d:'Серія днів, уроки', ic:'book', c:'#eab308', bld:'school', em:'📚',
      chips:['Серія','План'],
      blocks:()=>[{type:'heatmap',title:'Заняття',marks:{}},{type:'dtime',sz:'m',gw:12,gh:2,period:'day'}]},
    work:{n:'Робота', d:'Заробіток, зміни, план', ic:'server', c:'#3b82f6', bld:'dc', em:'⚡',
      chips:['Заробіток','Хітмапа','План'],
      blocks:()=>[{type:'wgmoney',kind:'in',src:'main',label:'Заробіток',goal:0},
                  {type:'heatmap',title:'Зміни',marks:{}},{type:'dtime',sz:'m',gw:12,gh:2,period:'day'}]},
    brand:{n:'Бренд / контент', d:'Публікації, план', ic:'video', c:'#a855f7', bld:'media', em:'🎬',
      chips:['Хітмапа','План'],
      blocks:()=>[{type:'heatmap',title:'Публікації',marks:{}},{type:'dtime',sz:'m',gw:12,gh:2,period:'day'}]},
    habit:{n:'Звичка', d:'Дні без зриву, економія', ic:'nosmoke', c:'#14b8a6', bld:'park', em:'🌿',
      chips:['Хітмапа','Відлік'],
      blocks:()=>[{type:'heatmap',title:'Дні без зриву',marks:{}},{type:'countdown',title:'Мета',target:'',label:''}]},
    home:{n:'Дім', d:'Побут, сон, свої справи', ic:'home', c:'#6366f1', bld:'home', em:'🏠',
      chips:['Хітмапа','План'],
      blocks:()=>[{type:'heatmap',title:'Сон вчасно',marks:{}},{type:'dtime',sz:'m',gw:12,gh:2,period:'day'}]}
  };
  const SPH_ORDER=['fin','sport','learn','work','brand','habit','home'];

  function sphOn(){ try{ return !!(window.upDevOn&&window.upDevOn()); }catch(_){ return false; } }
  // лише власні ключі шаблонів: «constructor» чи «__proto__» з хмари шаблоном не стануть
  function sphTpl(f){ return (f&&f.sphere&&SPH_ORDER.includes(f.sphere.tpl))?SPH_TPL[f.sphere.tpl]:null; }
  function sphKeys(){ try{ return orderedFolderKeys().filter(k=>folders[k]&&sphTpl(folders[k])); }catch(_){ return []; } }

  // усі блоки документа папки разом із вкладеними (сторінки, групи, тогли)
  function sphBlocks(key){
    const out=[];
    const walk=arr=>(Array.isArray(arr)?arr:[]).forEach(b=>{ if(!b) return; out.push(b); if(Array.isArray(b.children)) walk(b.children); });
    try{ walk(boards[key]); }catch(_){}
    return out;
  }
  function sphStreak(marks){
    let n=0; const d=new Date();
    if(!(marks&&marks[ymdLocal(d)]>0)) d.setDate(d.getDate()-1);   // сьогодні ще може бути попереду
    for(let i=0;i<400;i++){ if(marks&&marks[ymdLocal(d)]>0){ n++; d.setDate(d.getDate()-1); } else break; }
    return n;
  }
  function sphWeek(marks){
    let n=0; const d=new Date(); const dow=(d.getDay()+6)%7;
    for(let i=0;i<=dow;i++){ const x=new Date(d); x.setDate(d.getDate()-i); if(marks&&marks[ymdLocal(x)]>0) n++; }
    return n;
  }

  /* Підсумок сфери з її блоків: головний рядок, відсоток для смужки, досвід і рівень.
     Лише читання. */
  function sphStats(key){
    const f=folders[key], T=sphTpl(f); if(!f||!T) return null;
    const bl=sphBlocks(key), find=t=>bl.find(b=>b.type===t);
    const proj=find('wgmoney'), heat=find('heatmap');   // «Прогрес» і «Канбан» прибрано 10.10.2026
    const r={line:'', pct:null, nums:[], xp:0};
    let inc=0, exp=0, ops=0;
    // гроші сфери — операції Гаманця з міткою цієї папки (віджети «Доходи»/«Витрати», 48-widgets.js)
    if(proj){ try{ wlMonthOps(wlYm()).forEach(o=>{ if(String(o.folderKey||'')!==String(key)) return; if(_isRealIncome(o)) inc+=+o.amount||0; else if(_isRealExpense(o)) exp+=+o.amount||0; ops++; }); }catch(_){}
      r.nums.push({k:'Дохід',v:money(inc),tone:'in'},{k:'Витрати',v:money(exp),tone:'out'},{k:'Прибуток',v:money(inc-exp)}); }
    let envPct=null, envTxt='';
    if(proj&&+proj.goal>0){ envPct=Math.min(100,Math.round(inc/proj.goal*100)); envTxt=fmt(inc)+' з '+money(proj.goal); r.goal={name:String(proj.label||'Доходи'),txt:envTxt,pct:envPct}; }
    let streak=0, week=0, marks=0;
    if(heat){ const m=heat.marks||{}; streak=sphStreak(m); week=sphWeek(m); marks=Object.keys(m).filter(k=>m[k]>0).length;
      r.nums.push({k:'Серія',v:streak+' дн.'},{k:'Цей тиждень',v:String(week)}); }
    const tpl=f.sphere.tpl;
    if(tpl==='fin'||tpl==='work'){ r.line = envTxt ? envTxt+' · ціль' : (proj ? 'прибуток '+money(inc-exp) : 'додай віджет «Доходи»'); r.pct = envPct; }
    else if(tpl==='habit'){ r.line = heat ? streak+' '+(streak%10===1&&streak%100!==11?'день':'днів')+' без зриву' : 'додай «Хітмапу»'; r.pct = heat ? Math.min(100,Math.round(streak/30*100)) : null; }
    else { r.line = heat ? week+' за тиждень · серія '+streak : 'відкрий і додай блоки'; r.pct = heat ? Math.min(100,Math.round(week/5*100)) : null; }   // тиждень важливіший за ручний «Прогрес»
    // досвід: кожна відмітка і запис грошей — це дія в житті
    r.xp = marks*10 + ops*5;
    r.lv = 1+Math.floor(r.xp/100);
    return r;
  }

  /* ── вкладка «Сфери» на Огляді ── */
  function sphRenderList(){
    const host=document.getElementById('sphereList'); if(!host) return;
    const keys=sphKeys();
    let h='';
    if(!keys.length) h+=`<div class="sph-empty"><b>Сфер ще нема</b><span>Сфера — це папка твого життя (робота, зал, доходи), яка в «Моєму світі» стає будівлею. Створи з шаблону або зроби сферою наявну папку через її меню.</span></div>`;
    keys.forEach(k=>{
      const f=folders[k], T=sphTpl(f), s=sphStats(k)||{line:'',pct:null,lv:1};
      /* сфера — це папка: колір і значок беремо з папки (як на плитці й у меню), шаблон — лише підписом.
         «⋯» відкриває ту саму шторку налаштувань, що й у папки (10.10.2026) */
      h+=`<div class="sph-item"><button class="sph-row" data-sph="${esc(k)}" style="--sc:${safeColor(f.c,T.c)}">
        <span class="sph-ic"><svg class="ico" aria-hidden="true"><use href="#${esc(folderIcon(f))}"/></svg></span>
        <span class="sph-body"><span class="sph-top"><b data-i18n-skip="1">${f.pinned?'<span class="chl-pin" aria-label="закріплено">📌</span>':''}${esc(f.name)}</b><span class="sph-lv">рів. ${s.lv}</span></span>
          <small data-i18n-skip="1">${esc(T.n)}${s.line?' · '+esc(s.line):''}</small>
          ${s.pct!=null?`<span class="sph-bar"><i style="width:${s.pct}%"></i></span>`:''}</span></button>
        <button class="sph-more" data-sphmore="${esc(k)}" aria-label="Налаштування сфери «${escAttr(f.name)}»" title="Налаштування">⋯</button></div>`;
    });
    h+=`<button class="sph-new" id="sphNewBtn"><span>＋</span>Нова сфера</button>`;
    host.innerHTML=h;
    host.querySelectorAll('[data-sph]').forEach(b=>b.onclick=()=>goFolder(b.dataset.sph));
    host.querySelectorAll('[data-sphmore]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); openFolderMenu(b.dataset.sphmore); });
    const nb=document.getElementById('sphNewBtn'); if(nb) nb.onclick=()=>sphTemplateSheet(null);
  }
  // викликає chatsHomeSync (36-chats.js) при кожному малюванні Огляду
  function sphHomeSync(active){
    const btn=document.getElementById('sphTabBtn'), list=document.getElementById('sphereList');
    const on=sphOn();
    if(btn) btn.hidden=!on;
    try{ const c=document.getElementById('sphCountBadge'); if(c) c.textContent=sphKeys().length; }catch(_){}
    if(list) list.hidden=!(on&&active);
    // «＋» біля вкладок — та сама кругла кнопка, що ⚙ у папок і «＋» у чатів
    const add=document.getElementById('sphAddBtn');
    if(add){ add.hidden=!(on&&active); if(!add.__init){ add.__init=true; add.onclick=()=>sphTemplateSheet(null); } }
    if(on&&active) sphRenderList();
  }

  /* ── шаблони: нова сфера або перетворити наявну папку ── */
  function sphTemplateSheet(fkey){
    const f=fkey?folders[fkey]:null;
    const cur=f&&f.sphere?f.sphere.tpl:'';
    chSheet(f?('Сфера для «'+esc(f.name)+'»'):'Нова сфера',
      `<p class="sph-sub">${f?'Папка лишається як є — додаються шапка сфери й будівля в «Моєму світі». Блоки шаблону додам у кінець документа.':'Шаблон створить папку з блоками. Блоки потім міняєш як хочеш. У грі на карті зʼявиться будівля.'}</p>
       <div class="sph-tpls">${SPH_ORDER.map(t=>{ const T=SPH_TPL[t]; return `<button class="sph-tp${cur===t?' on':''}" data-tpl="${t}" style="--sc:${T.c}">
         <span class="sph-ic">${sphIcon(T.ic)}</span><b>${T.n}</b><small>${T.d}</small>
         <span class="sph-chips">${T.chips.map(x=>`<i>${x}</i>`).join('')}</span></button>`; }).join('')}</div>
       <button class="sph-cancel" data-sphx="1">Скасувати</button>
       ${f&&f.sphere?`<button class="ch-sheet-row" data-sphoff="1"><span class="ic e">✖️</span><span>Прибрати зі сфер<small>Папка й усі блоки лишаються</small></span></button>`:''}`,
      (ov,close)=>{
        // шторка з 7 шаблонами вища за телефон — своя прокрутка і явне «Скасувати»
        const sh=ov.querySelector('.ch-sheet'); if(sh) sh.classList.add('sph-sheet');
        const x=ov.querySelector('[data-sphx]'); if(x) x.onclick=close;
        ov.querySelectorAll('[data-tpl]').forEach(b=>b.onclick=()=>{ close(); const t=b.dataset.tpl;
          if(f) setTimeout(()=>sphConvert(fkey,t),150); else setTimeout(()=>sphCreate(t),150); });
        const off=ov.querySelector('[data-sphoff]'); if(off) off.onclick=()=>{ close(); delete f.sphere; saveFolders(); renderDashboard(); chToast('«'+f.name+'» більше не сфера'); };
      });
  }
  function sphNewBlocks(t, fkey){
    return SPH_TPL[t].blocks().map((b,i)=>{ const o=Object.assign({id:'sp'+Date.now().toString(36)+i+Math.random().toString(36).slice(2,5)}, b);
      if(o.type==='wplanday') o.pfolder=fkey; return o; });
  }
  function sphCreate(t){
    const T=SPH_TPL[t]; if(!T) return;
    inputModal({ title:'Нова сфера · '+T.n, placeholder:'Назва, напр. «'+T.n+'»', value:t==='fin'?'Додаткові доходи':'', emoji:true, emojiVal:T.em,
      onOk:(name, emojiVal)=>{
        const nm=(name||'').trim()||T.n;
        const used=order.length, key='f_'+Date.now();
        const em=(emojiVal!==undefined&&emojiVal!=='')?emojiVal:T.em;
        folders[key]={ key, c:T.c, emoji:em, icon:folderIconFor(em), name:nm, pct:0, photo:'', flayout:'a', pinned:false, custom:true, widgets:[],
          sphere:{tpl:t, bld:T.bld} };
        order.push(key);
        boards[key]=sphNewBlocks(t,key);
        saveBoard(); saveFolders(); renderDashboard();
        try{ window.platform.haptic('medium'); }catch(_){}
        goFolder(key);
      }});
  }
  function sphConvert(fkey,t){
    const f=folders[fkey], T=SPH_TPL[t]; if(!f||!T) return;
    const had=!!f.sphere;
    f.sphere={tpl:t, bld:T.bld};
    // блоки шаблону додаємо лише в папку без них (не дублюємо при зміні шаблону)
    const have=new Set(sphBlocks(fkey).map(b=>b.type));
    const add=sphNewBlocks(t,fkey).filter(b=>!have.has(b.type));
    if(add.length){ if(!Array.isArray(boards[fkey])) boards[fkey]=[]; boards[fkey].push(...add); saveBoard(); }
    saveFolders(); renderDashboard();
    chToast(had?('Шаблон сфери: '+T.n):('«'+f.name+'» тепер сфера'+(add.length?' · +'+add.length+' блоки':'')));
  }

  /* ── шапка сфери у документі папки ── */
  function sphRenderHead(){
    const host=document.getElementById('pgSphere'); if(!host) return;
    let fk=''; try{ const base=String(boardKey||'').split('__sp_')[0]; fk=folders[base]?base:''; }catch(_){}
    const f=fk?folders[fk]:null, T=sphTpl(f);
    if(!T||!sphOn()){ host.hidden=true; host.innerHTML=''; return; }
    const s=sphStats(fk)||{lv:1,xp:0,nums:[]};
    host.hidden=false; host.style.setProperty('--sc',T.c);
    host.innerHTML=`<span class="sph-ic">${sphIcon(T.ic)}</span>
      <span class="sph-hb"><small>Сфера · рівень ${s.lv} · ${s.xp} XP</small><b>${esc(T.n)}</b>
        <span class="sph-hn">${(s.nums||[]).slice(0,3).map(n=>`<i class="${n.tone||''}">${esc(n.k)} <b>${esc(n.v)}</b></i>`).join('')}</span></span>
      <button class="sph-go" id="sphGoWorld" aria-label="Відкрити в «Моєму світі»">У грі ›</button>`;
    const g=document.getElementById('sphGoWorld'); if(g) g.onclick=()=>{ try{ goWorld({focus:fk}); }catch(_){} };
  }

  /* ── для гри: список сфер із цифрами (лише читання) ── */
  function sphForWorld(){
    if(!sphOn()) return [];
    return sphKeys().map(k=>{ const f=folders[k], T=sphTpl(f), s=sphStats(k)||{};
      return {key:k, name:String(f.name||''), tpl:f.sphere.tpl, bld:T.bld, color:T.c, tname:T.n,
        lv:s.lv||1, xp:s.xp||0, line:String(s.line||''), pct:s.pct, nums:(s.nums||[]).map(n=>({k:n.k,v:n.v,tone:n.tone||''})), goal:s.goal||null}; });
  }

  function spheresInit(){
    // документ зберігся (дохід, відмітка в хітмапі…) — шапка сфери показує свіжі цифри
    const pb=window.__flowPageBridge;
    if(pb && typeof pb.save==='function' && !pb.save.__sph){
      const os=pb.save;
      const ws=function(){ const r=os.apply(this,arguments); try{ if(document.getElementById('scr-page').classList.contains('active')) sphRenderHead(); }catch(_){} return r; };
      ws.__sph=true; pb.save=ws;
    }
    // віджети на кшталт «Проєкту» пишуть повз міст — тож стежимо й за перемальовуванням документа
    const ed=document.getElementById('pgEditor');
    if(ed && !ed.__sph && typeof MutationObserver==='function'){
      ed.__sph=true; let t=0;
      new MutationObserver(()=>{ clearTimeout(t); t=setTimeout(()=>{ try{ if(!document.getElementById('pgSphere').hidden) sphRenderHead(); }catch(_){} },250); })
        .observe(ed,{childList:true,subtree:true});
    }
    if(typeof window.openFlowPage==='function' && !window.openFlowPage.__sph){
      const orig=window.openFlowPage;
      const wrapped=function(opts){ orig(opts); try{ sphRenderHead(); }catch(e){ console.error('sphHead',e); } };
      wrapped.__sph=true; if(orig.__chats) wrapped.__chats=true; window.openFlowPage=wrapped;
    }
  }
  try{ window.sphHomeSync=sphHomeSync; window.sphForWorld=sphForWorld; window.sphTemplateSheet=sphTemplateSheet; window.spheresInit=spheresInit; }catch(_){}
