  /* ════════ Налаштування віджета «Даних» (19.11.2026, макет «Налаштування віджетів») ════════
     Скляна шторка з двома вкладками: «Загальні» (назва, колір, фон, шапка, розмір, дублювати, видалити) і «<Цей віджет>».
     Шестерні ⚙ більше нема: шторка відкривається тапом по шапці, утриманням віджета (ПКМ на компʼютері) і тапом у режимі «Змінити».
     Розмір — клітинки сітки: телефон 4 колонки, компʼютер (≥760) 8 колонок, свій на кожному пристрої: b.ws = {m:[w,h], d:[w,h]}.
     Без b.ws віджет живе як раніше (sz S/M/L) — нічого не мігруємо. Зміни видно одразу в прев'ю, а в блок пишуться при закритті шторки,
     лише ті поля, що в WS_KEYS (дані місій, Планера й Гаманця шторка не чіпає — лише вигляд віджета). */
  // var, а не const: віджет може намалюватись раніше, ніж виконався цей файл (порядок core) — тоді значення ще undefined, а не «мертва зона»
  var WD_ROWS=5;
  var WD_SZ_CELL={s:[2,2],m:[4,2],l:[4,4]};
  var WD_CC=['#ff8a5c','#ff5d8f','#b67cff','#6d8bff','#38c7e0','#34c77b','#ffcc4d'];
  function wdDev(){ return (window.innerWidth||0)>=760?'d':'m'; }
  function wdCols(dev){ return dev==='d'?8:4; }
  // клітинки віджета на пристрої: збережені (обрізані до сітки) або з S/M/L
  function wdCell(b,dev){
    dev=dev||wdDev();
    const c=b&&b.ws&&typeof b.ws==='object'?b.ws[dev]:null;
    if(Array.isArray(c)&&c.length===2){ const w=Math.round(+c[0]), h=Math.round(+c[1]);
      if(w>=1&&h>=1) return [Math.min(w,wdCols(dev)),Math.min(h,5)]; }
    const t=wdSzOld(b); return t==='l'?[4,4]:t==='m'?[4,2]:[2,2];
  }
  // що показати в цій площі: xs — значок і число · row — рядок · s / m / l — як раніше
  function wdTierOf(w,h,dev){
    const n=dev==='d'?w*.8:w;   // колонка компʼютера (~62 px) вужча за колонку телефона (~78 px)
    if(n<=1&&h<=2) return 'xs';
    if(h<=1) return n<=1.5?'xs':'row';
    if(h>=4||(h>=3&&n>=3)) return 'l';
    return n>=3?'m':'s';
  }
  function wdTier(b){ if(!b||!b.ws) return ''; const dev=wdDev(), c=wdCell(b,dev); return wdTierOf(c[0],c[1],dev); }
  // нові клітинки + старі sz/gw/gh (їх читають чат папки, «Полотно» і старі дошки)
  function wdSetCell(b,dev,w,h){
    w=Math.max(1,Math.min(wdCols(dev),Math.round(+w)||1)); h=Math.max(1,Math.min(WD_ROWS,Math.round(+h)||1));
    const ws=b.ws&&typeof b.ws==='object'?b.ws:{}; ws[dev]=[w,h]; b.ws=ws;
    const t=wdTierOf(w,h,dev), sz=t==='l'?'l':t==='m'?'m':'s';
    b.sz=sz; b.gw=WD_SZ[sz].gw; b.gh=WD_SZ[sz].gh;
  }
  function wdCcOf(b){ return b&&b.cc&&Array.isArray(WD_CC)&&WD_CC.includes(b.cc)?b.cc:''; }
  // перетнули межу телефон ↔ компʼютер — віджети перемальовуються під свою сітку
  var wdDevNow=wdDev();
  window.addEventListener('resize',()=>{ const d=wdDev(); if(d!==wdDevNow){ wdDevNow=d; try{ wdRedraw(); }catch(_){} } });

  // ── шторка ──
  var WS_KEYS=['ws','sz','gw','gh','hd','cc','bg','nohd','goalId','period','show','title','label','target','tm','dir','units','sty','yearly','end','goal','main','tapmk','ev','q'];
  var WS_PAL=[['glass','Скло'],['frost','Матове'],['solid','Колір']];
  function wsName(b){ return b.type==='countdown'?String(b.title||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,60):String(b.hd||'').slice(0,40); }
  function wdSheet(id,opt){
    opt=opt||{};
    let b0=null; try{ b0=getBlock(id); }catch(_){} if(!b0||!wdIs(b0.type)) return;
    const old=document.querySelector('.ws-ov'); if(old){ try{ old.__wsClose&&old.__wsClose(); }catch(_){} old.remove(); }
    const m=WD_META[b0.type], fk=wgCtxFolder(), dev=wdDev();
    const d=JSON.parse(JSON.stringify(b0));   // чернетка: прев'ю малюється з неї, у блок — при закритті
    const was={}; WS_KEYS.forEach(k=>{ was[k]=JSON.stringify(d[k]); });   // з чим порівнювати при закритті
    let tab=opt.tab==='own'?'own':'gen';
    // розмір однієї клітинки — з живої дошки (якщо віджет на екрані), інакше типовий
    const cellEl=document.querySelector('[data-wghost="'+CSS.escape(String(id))+'"]');
    const boardEl=cellEl&&cellEl.closest('.pg-board.wboard');
    let cw=80, rh=76, gap=12;
    if(boardEl){ const cs=getComputedStyle(boardEl), g=parseFloat(cs.columnGap)||12, cols=wdCols(dev);
      cw=(boardEl.getBoundingClientRect().width-g*(cols-1))/cols; rh=parseFloat(cs.gridAutoRows)||76; gap=g; }

    const ov=document.createElement('div'); ov.className='ws-ov'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.setAttribute('aria-label','Налаштування віджета «'+m.t+'»');
    ov.innerHTML=`<div class="ws-sh"><div class="ws-grab" aria-hidden="true"></div>
      <div class="ws-hd"><b>${m.ic} ${esc(m.t)}</b><button class="ws-done" data-wsdone>Готово</button></div>
      <div class="ws-pv" aria-hidden="true"><div class="ws-pvc"><div class="wg-host ws-pvh"></div></div></div>
      <div class="ws-tabs" role="tablist"><button role="tab" data-wstab="gen">Загальні</button><button role="tab" data-wstab="own">${esc(b0.type==='countdown'?m.t:m.h)}</button></div>
      <div class="ws-body"></div></div>`;
    document.body.appendChild(ov);
    const sh=ov.querySelector('.ws-sh'), body=ov.querySelector('.ws-body'), pvc=ov.querySelector('.ws-pvc'), pvh=ov.querySelector('.ws-pvh');
    pvh.setAttribute('inert','');
    const pvDraw=()=>{
      const c=wdCell(d,dev), w=Math.min(c[0]*cw+(c[0]-1)*gap, sh.clientWidth-32), h=c[1]*rh+(c[1]-1)*gap;
      pvc.style.width=Math.max(70,Math.round(w))+'px'; pvc.style.height=Math.round(Math.min(h,dev==='d'?300:260))+'px';
      try{ wgFill(pvh,d,fk); }catch(_){}
    };
    const seg=(k,opts,v)=>`<span class="ws-seg">${opts.map(([x,l])=>`<button data-wsset="${k}" data-v="${esc(String(x))}" class="${String(x)===String(v)?'on':''}" aria-pressed="${String(x)===String(v)}">${l}</button>`).join('')}</span>`;
    const tg=(k,on,lbl)=>`<button class="ws-it ws-sw" data-wstg="${k}" role="switch" aria-checked="${!!on}"><span>${lbl}</span><i class="${on?'on':''}"></i></button>`;
    const row=(lbl,ctl,cls)=>`<div class="ws-it${cls?' '+cls:''}"><span>${lbl}</span>${ctl}</div>`;
    const grp=(t,inner)=>`<div class="ws-grp">${t?`<div class="ws-gt">${t}</div>`:''}${inner}</div>`;

    function genHTML(){
      const c=wdCell(d,dev), cols=wdCols(dev);
      let cells=''; for(let r=1;r<=WD_ROWS;r++) for(let k=1;k<=cols;k++) cells+=`<button data-wspk="${k},${r}" class="${k<=c[0]&&r<=c[1]?'in':''}" aria-label="${k} на ${r}"></button>`;
      const cc=wdCcOf(d), bg=d.bg==='frost'||d.bg==='solid'?d.bg:'glass';
      return grp('Вигляд',
          row('Назва',`<input class="ws-in" data-wsname maxlength="${d.type==='countdown'?60:40}" value="${esc(wsName(d))}" placeholder="${esc(d.type==='countdown'?'Новий рік, відпустка…':m.h)}">`)
          +row('Колір',`<span class="ws-cc"><button data-wscc="" class="fold${cc?'':' on'}" aria-label="Колір папки" aria-pressed="${!cc}"></button>${WD_CC.map(x=>`<button data-wscc="${x}" style="--s:${x}" class="${cc===x?'on':''}" aria-label="Колір ${x}" aria-pressed="${cc===x}"></button>`).join('')}</span>`,'wrap')
          +row('Фон',seg('bg',WS_PAL,bg))
          +tg('nohd',!d.nohd,'Показувати назву'))
        +grp('Розмір · '+(dev==='d'?'на компʼютері':'на телефоні'),
          `<div class="ws-pk" style="--cols:${cols}">${cells}</div><div class="ws-pkl"><span>Тапни клітинку або тягни ↘ у «Змінити»</span><b>${c[0]} × ${c[1]}</b></div>`)
        +`<div class="ws-acts"><button data-wsdup>Дублювати</button><button class="red" data-wsdel>Видалити</button></div>`;
    }
    function ownHTML(){
      const t=d.type;
      if(t==='countdown'){
        const c=tmCfgOf(d), units=new Set(c.units);
        return grp('Відлік',
            `<div class="ws-it"><span>Дата</span><input class="ws-in sm" type="date" data-wsdate value="${esc(c.target)}"></div>`
            +`<div class="ws-it"><span>Час</span><input class="ws-in sm" type="time" data-wstime value="${esc(c.tm)}"></div>`
            +row('Напрям',seg('dir',[['down','До дати'],['up','Від дати']],c.dir))
            +row('Стиль',seg('sty',TM_STY.map(([k,l])=>[k,l.replace(' 3D','')]),c.sty))
            +tg('yearly',c.yearly,'Щороку (день народження, річниця)'))
          +grp('Що показувати',`<div class="ws-chips">${TM_U.map(u=>`<button data-wsu="${u}" class="${units.has(u)?'on':''}" aria-pressed="${units.has(u)}">${TM_N[u][2][0].toUpperCase()+TM_N[u][2].slice(1)}</button>`).join('')}</div>`
            +tg('show.date',c.date,'Дата під цифрами'))
          +(c.dir==='down'?grp('Коли настане',`<div class="ws-it">${seg('end',[['conf','🎉 Святкувати'],['quiet','Тихо'],['up','Рахувати «від»']],d.end==='quiet'||d.end==='up'?d.end:'conf')}</div>`):'');
      }
      let h='';
      if(t!=='dtime'&&t!=='dcal'&&t!=='dtasks'){
        const goals=wlMissions(), fm=wgFolderMission(fk), gid=d.goalId&&goals.some(g=>String(g.id)===String(d.goalId))?String(d.goalId):'';
        h+=grp('Джерело',`<div class="ws-chips">
          <button data-wsg="" class="${gid?'':'on'}">📁 Місія цієї папки${fm?' · '+esc(String(fm.name||'').slice(0,20)):' (нема)'}</button>
          ${goals.map(g=>`<button data-wsg="${esc(g.id)}" class="${String(g.id)===gid?'on':''}">${safeEmoji(g.emoji,'🎯')} ${esc(String(g.name||'Місія').slice(0,24))}</button>`).join('')}</div>`);
      }
      let main='';
      if(m.per) main+=row('Період',seg('period',m.per,wdPer(d)));
      if(t==='dmission') main+=row('Головне число',seg('main',[['pct','%'],['steps','Кроки'],['days','Дні']],d.main==='steps'||d.main==='days'?d.main:'pct'));
      if(t==='dhabit'&&wdPer(d)==='week') main+=row('Ціль на тиждень',`<span class="ws-step"><button data-wsst="goal" data-n="-1" aria-label="Менше">−</button><b>${wsGoal(d)||'—'}</b><button data-wsst="goal" data-n="1" aria-label="Більше">＋</button></span>`);
      if(t==='dhabit') main+=tg('tapmk',!!d.tapmk,'Позначати день тапом по віджету');
      if(t==='dtime'&&wdPer(d)!=='day') main+=row('Ціль годин',`<span class="ws-step"><button data-wsst="goal" data-n="-1" aria-label="Менше">−</button><b>${wsGoal(d)||'—'}</b><button data-wsst="goal" data-n="1" aria-label="Більше">＋</button></span>`);
      if(t==='dcal') main+=row('Події',seg('ev',[['fold','Цієї папки'],['all','Весь Планер']],d.ev==='all'?'all':'fold'));
      if(t==='dsave') main+=row('Кнопка «＋»',seg('q',[['0','Сума'],['100','100'],['500','500'],['1000','1000']],String(wsQ(d))))
        +`<button class="ws-it ws-go" data-wsgo="save"><span>🐷 Ціль скарбнички</span><em>›</em></button>`;
      if(t==='dcounter') main+=`<button class="ws-it ws-go" data-wsgo="counter"><span>🔢 Вибрати чи змінити лічильник</span><em>›</em></button>`;
      if(main) h+=grp(m.h,main);
      h+=grp('Показувати',m.show.map(([k,l])=>tg('show.'+k,wdOn(d,k),l)).join(''));
      return h;
    }
    function draw(){
      ov.querySelectorAll('[data-wstab]').forEach(x=>{ const on=x.dataset.wstab===tab; x.classList.toggle('on',on); x.setAttribute('aria-selected',String(on)); });
      body.innerHTML=tab==='gen'?genHTML():ownHTML();
      pvDraw();
    }
    // ── запис при закритті: лише поля вигляду, у свіжий блок (поки шторка відкрита, синк міг підмінити дошку) ──
    let closed=false;
    function commit(){
      // лише поля, які людина змінила: дата, що прийшла синком з іншого пристрою, поки шторка відкрита, не затирається старою
      const ch=WS_KEYS.filter(k=>JSON.stringify(d[k])!==was[k]); if(!ch.length) return false;
      const q=getBlock(id); if(!q||q.type!==d.type) return false;
      ch.forEach(k=>{ if(d[k]===undefined) delete q[k]; else q[k]=JSON.parse(JSON.stringify(d[k])); });
      saveBoard(); return true;
    }
    function close(){ if(closed) return; closed=true; const ch=commit(); ov.classList.add('out'); setTimeout(()=>ov.remove(),220); if(ch) wdRedraw(); document.removeEventListener('keydown',onKey,true); }
    ov.__wsClose=()=>{ if(!closed){ closed=true; if(commit()) wdRedraw(); document.removeEventListener('keydown',onKey,true); } };
    function onKey(e){ if(e.key==='Escape'){ e.stopPropagation(); close(); } }
    document.addEventListener('keydown',onKey,true);
    ov.addEventListener('click',e=>{ if(e.target===ov){ close(); return; }
      const x=e.target.closest('button'); if(!x||!ov.contains(x)) return;
      if(x.dataset.wsdone!==undefined){ close(); return; }
      if(x.dataset.wstab){ tab=x.dataset.wstab; draw(); return; }
      if(x.dataset.wscc!==undefined){ if(x.dataset.wscc) d.cc=x.dataset.wscc; else delete d.cc; draw(); return; }
      if(x.dataset.wsset){ const k=x.dataset.wsset, v=x.dataset.v;
        if(k==='bg'){ if(v==='glass') delete d.bg; else d.bg=v; }
        else if(k==='dir'){ if(v==='up') d.dir='up'; else delete d.dir; }
        else if(k==='sty'){ if(v==='flip') delete d.sty; else d.sty=v; }
        else if(k==='end'){ if(v==='conf') delete d.end; else d.end=v; }
        else if(k==='main'){ if(v==='pct') delete d.main; else d.main=v; }
        else if(k==='ev'){ if(v==='all') d.ev='all'; else delete d.ev; }
        else if(k==='q'){ if(v==='0') delete d.q; else d.q=+v; }
        else if(k==='period'){ d.period=v; }
        draw(); return; }
      if(x.dataset.wstg){ const k=x.dataset.wstg;
        if(k==='nohd'){ if(d.nohd) delete d.nohd; else d.nohd=true; }
        else if(k==='yearly'){ if(d.yearly) delete d.yearly; else d.yearly=true; }
        else if(k==='tapmk'){ if(d.tapmk) delete d.tapmk; else d.tapmk=true; }
        else if(k.slice(0,5)==='show.'){ const s=k.slice(5), on=wdOn(d,s), sh2=d.show&&typeof d.show==='object'?d.show:{};
          if(on) sh2[s]=false; else delete sh2[s]; if(Object.keys(sh2).length) d.show=sh2; else delete d.show; }
        draw(); return; }
      if(x.dataset.wsu){ const c=tmCfgOf(d), us=new Set(c.units), u=x.dataset.wsu;
        if(us.has(u)){ if(us.size===1){ plToast('Хоча б одна одиниця'); return; } us.delete(u); } else us.add(u);
        const L=TM_U.filter(z=>us.has(z)); if(L.join()===TM_DEF.join()) delete d.units; else d.units=L; draw(); return; }
      if(x.dataset.wsg!==undefined){ if(x.dataset.wsg) d.goalId=x.dataset.wsg; else delete d.goalId; draw(); return; }
      if(x.dataset.wsst){ const mx=d.type==='dhabit'?7:(wdPer(d)==='month'?200:60), v=(wsGoal(d)||0)+(+x.dataset.n<0?-1:1);
        if(v<=0) delete d.goal; else d.goal=Math.min(mx,v); draw(); return; }
      if(x.dataset.wspk){ const [w,h]=x.dataset.wspk.split(',').map(Number); wdSetCell(d,dev,w,h); draw(); return; }
      if(x.dataset.wsgo){ const k=x.dataset.wsgo; close();
        const q=wdGoal(getBlock(id)||d,fk); if(!q||!q.id){ plToast('Спершу вибери місію'); return; }
        if(k==='save') wdSaveGoalSheet(q.id); else wdCounterSheet(id,q.id,String(d.cid||'')); return; }
      if(x.dataset.wsdup!==undefined){ close(); wdDup(id); return; }
      if(x.dataset.wsdel!==undefined){ closed=true; ov.remove(); document.removeEventListener('keydown',onKey,true); wdRemove(id); return; }
    });
    ov.addEventListener('input',e=>{
      const x=e.target;
      if(x.matches('[data-wsname]')){ const v=String(x.value||'').replace(/\s+/g,' ').trim();
        if(d.type==='countdown'){ d.title=v.slice(0,60); d.label=d.title; } else if(v) d.hd=v.slice(0,40); else delete d.hd;
        try{ wgFill(pvh,d,fk); }catch(_){} return; }
      if(x.matches('[data-wsdate]')){ const v=String(x.value||''); if(/^\d{4}-\d{2}-\d{2}$/.test(v)){ d.target=v; try{ wgFill(pvh,d,fk); }catch(_){} } return; }
      if(x.matches('[data-wstime]')){ const v=String(x.value||'').slice(0,5); if(/^([01]\d|2[0-3]):[0-5]\d$/.test(v)&&v!=='00:00') d.tm=v; else delete d.tm; try{ wgFill(pvh,d,fk); }catch(_){} }
    });
    // розмір на сітці-вибирачі: наведення підсвічує прямокутник (компʼютер)
    ov.addEventListener('pointerover',e=>{ const x=e.target.closest('[data-wspk]'); if(!x) return; const [w,h]=x.dataset.wspk.split(',').map(Number);
      ov.querySelectorAll('[data-wspk]').forEach(y=>{ const [a,c]=y.dataset.wspk.split(',').map(Number); y.classList.toggle('hov',a<=w&&c<=h&&!y.classList.contains('in')); }); });
    ov.addEventListener('pointerout',e=>{ if(e.target.closest&&e.target.closest('.ws-pk')&&!(e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest('.ws-pk'))) ov.querySelectorAll('.ws-pk .hov').forEach(y=>y.classList.remove('hov')); });
    draw();
    void ov.offsetWidth; ov.classList.add('on');   // примусовий перерахунок замість кадру анімації: прихована вкладка кадрів не дає, і шторка лишалась би за краєм
    try{ window.platform.haptic('light'); }catch(_){}
    if(opt.tab==='own'&&d.type==='countdown'&&!tmCfgOf(d).target) setTimeout(()=>{ try{ ov.querySelector('[data-wsdate]').focus(); }catch(_){} },120);
  }
  function wsGoal(b){ const v=Math.round(+b.goal||0); return v>0?v:0; }
  function wsQ(b){ return [100,500,1000].includes(+b.q)?+b.q:0; }

  // ── дублювати: копія поруч, без місця на «Полотні» ──
  function wdDup(id){
    const arr=findParentArr(curBoard(),id), i=arr?arr.findIndex(x=>x&&String(x.id)===String(id)):-1; if(i<0) return;
    const c=JSON.parse(JSON.stringify(arr[i])); c.id='w'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); delete c.cv;
    arr.splice(i+1,0,c); saveBoard(); wdRedraw(); plToast('Віджет скопійовано');
  }
  // ── прибрати: лише вікно; місія, трекер і блоки Планера лишаються. «Скасувати» повертає на те саме місце ──
  function wdRemove(id){
    const arr=findParentArr(curBoard(),id), i=arr?arr.findIndex(x=>x&&String(x.id)===String(id)):-1; if(i<0) return;
    const prevId=i>0&&arr[i-1]?String(arr[i-1].id):'', nextId=arr[i+1]?String(arr[i+1].id):'';
    const was=arr.splice(i,1)[0]; saveBoard(); wdRedraw();
    const t=was.type, msg=t==='countdown'?'Відлік прибрано':'Віджет прибрано — дані в '+((t==='dtime'||t==='dcal'||t==='dtasks')?'Планері':'місії')+' лишились';
    // «Скасувати» шукає дошку наново: за ці секунди звірка з хмарою могла перечитати boards, і старий масив уже не в дошці
    flowUndoToast(msg,()=>{
      const B=curBoard(), live=x=>{ const st=[B]; while(st.length){ const L=st.pop(); if(L===x) return true; (L||[]).forEach(q=>{ if(q&&Array.isArray(q.children)) st.push(q.children); }); } return false; };
      const a2=(prevId&&findParentArr(B,prevId))||(nextId&&findParentArr(B,nextId))||(live(arr)?arr:null);   // був єдиним — той самий масив, якщо він ще в дошці
      if(!a2){ plToast('Дошку оновлено з іншого пристрою — додай віджет знову'); return; }
      if(findBlockDeep(B,was.id)) return;
      const j=prevId?a2.findIndex(x=>x&&String(x.id)===prevId)+1:Math.max(0,a2.findIndex(x=>x&&String(x.id)===nextId));
      a2.splice(Math.min(j,a2.length),0,was); saveBoard(); wdRedraw(); });
  }

  // ── утримати віджет (або ПКМ на компʼютері) → налаштування, як на домашньому екрані iPhone ──
  (function(){
    let t=0, x0=0, y0=0, swallow=false;
    const hostOf=el=>{ const h=el&&el.closest&&el.closest('[data-wghost]'); if(!h||h.closest('.ws-ov')) return null; const w=h.querySelector('.wg-t.wd'); return w?h:null; };
    const stop=()=>{ clearTimeout(t); t=0; };
    document.addEventListener('pointerdown',e=>{
      if(e.button>0) return; const h=hostOf(e.target); if(!h||h.closest('.wb-edit')) return;
      x0=e.clientX; y0=e.clientY; stop();
      t=setTimeout(()=>{ t=0; swallow=true; setTimeout(()=>{ swallow=false; },700); wdSheet(h.dataset.wghost); },520);
    },true);
    document.addEventListener('pointermove',e=>{ if(t&&Math.hypot(e.clientX-x0,e.clientY-y0)>8) stop(); },true);
    ['pointerup','pointercancel','scroll'].forEach(n=>document.addEventListener(n,stop,true));
    document.addEventListener('click',e=>{ if(swallow&&hostOf(e.target)){ e.preventDefault(); e.stopPropagation(); swallow=false; } },true);
    document.addEventListener('contextmenu',e=>{ const h=hostOf(e.target); if(!h) return; e.preventDefault(); stop(); if(!swallow) wdSheet(h.dataset.wghost); },true);
  })();
