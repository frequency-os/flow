  /* ════════ Полотно папки (61-folder-canvas.js, 18.11.2026) ════════
     Вигляд папки «Полотно» поруч із Документ · Чат · Фото (36-chats.js → fhApplyView кличе fcRender).
     На полотні ті самі блоки, що в документі: віджети живі (wgFill), текст / завдання / таблиця — картками.
     «Змінити»: блок тягнеш куди завгодно, розмір — за кут, прилипання до сітки 8px і напрямні; «Вирівняти» — акуратні рядки.
     Свій стіл на кожному пристрої: місце зберігається в самому блоці, b.cv = {m:{x,y,w,h}, d:{x,y,w,h}}
     (m — телефон, вужче 1024px; d — компʼютер). Нового ключа сховища нема — блок синкається разом із документом папки.
     Пишеться ЛИШЕ тапом людини: коли відпустила блок (тоді фіксується весь стіл цього пристрою) або натиснула «Вирівняти».
     Поки на пристрої нічого не рухали — стіл розкладається сам (рахується, нічого не пише): телефон бере порядок
     із компʼютера, нова папка — порядок документа. Старі версії застосунку поле cv просто не бачать. */
  var FC_GAP=12, FC_SNAP=8;   // var, не const: 36-chats.js (раніше в збірці) може покликати fcRender ще до цього рядка
  var fcEdit='';   // папка, у якій зараз режим «Змінити» (лише в памʼяті)
  function fcDev(){ return innerWidth>=1024?'d':'m'; }
  function fcCols(){ return fcDev()==='d'?4:2; }
  function fcRectOk(r){ return r&&typeof r==='object'&&[r.x,r.y,r.w,r.h].every(v=>typeof v==='number'&&isFinite(v)); }
  function fcSaved(b,dev){ const r=b&&b.cv&&b.cv[dev]; return fcRectOk(r)?r:null; }
  // ті самі записи, що бачить чат: усе, і вкладене теж, крім службових і порожніх контейнерів
  function fcList(arr){
    const shell=b=>Array.isArray(b.children)&&b.children.length&&!fhPlain(b.text!=null?b.text:b.title);
    const out=[]; fhWalk(arr,b=>{ if(b&&b.id&&b.type!=='subs'&&b.type!=='divider'&&!shell(b)) out.push(b); });
    return out;
  }
  // типовий розмір картки: скільки колонок і яка висота
  function fcDefSize(b,C,cw){
    const t=b.type, span=n=>Math.min(C,n), H=(t==='h1'||t==='h2'||t==='h3');
    if(typeof wgIs==='function'&&wgIs(t)){
      const sz=typeof wdIs==='function'&&wdIs(t)?wdSz(b):'m';
      if(sz==='s') return {c:1,h:156};
      if(sz==='l') return {c:span(2),h:t==='dcal'?330:300};
      return {c:span(2),h:t==='countdown'?176:156};
    }
    if(t==='tbl') return {c:span(3),h:220};
    if(H) return {c:C,h:58};
    if(t==='task') return {c:span(2),h:54};
    if(t==='photo') return {c:1,h:176};
    if(FH_TEXTY[t]){ const len=fhPlain(b.text!=null?b.text:b.title).length, per=Math.max(20,Math.floor(cw*2/7.6));
      return {c:span(2),h:Math.max(64,Math.min(260,46+Math.ceil(len/per)*19))}; }
    return {c:1,h:104};
  }
  // розклад: збережені картки стоять, де поставили; решта — щільно в колонки (як цеглини), нижче або замість
  function fcLayout(list,W){
    const dev=fcDev(), C=fcCols(), cw=(W-(C-1)*FC_GAP)/C, pos={};
    let bottom=0; const free=[];
    list.forEach(b=>{ const r=fcSaved(b,dev);
      // межі — на випадок збитих чисел із хмари (y=1e9 дав би безкінечний порожній скрол)
      if(r){ const w=Math.max(80,Math.min(W,r.w)); pos[b.id]={x:Math.max(0,Math.min(W-w,r.x)),y:Math.max(0,Math.min(20000,r.y)),w,h:Math.max(48,Math.min(3000,r.h))}; bottom=Math.max(bottom,pos[b.id].y+pos[b.id].h); }
      else free.push(b); });
    // телефон без свого стола бере порядок компʼютера (зверху вниз, зліва направо); інакше — порядок документа
    const other=dev==='m'?'d':'m';
    if(free.length&&free.every(b=>fcSaved(b,other))) free.sort((a,c)=>{ const p=fcSaved(a,other), q=fcSaved(c,other); return (p.y-q.y)||(p.x-q.x); });
    const colH=new Array(C).fill(bottom?bottom+FC_GAP:0);
    free.forEach(b=>{ const s=fcDefSize(b,C,cw); let best=0, by=Infinity;
      for(let i=0;i+s.c<=C;i++){ const y=Math.max(...colH.slice(i,i+s.c)); if(y<by){ by=y; best=i; } }
      pos[b.id]={x:Math.round(best*(cw+FC_GAP)),y:by,w:Math.round(s.c*cw+(s.c-1)*FC_GAP),h:s.h};
      for(let i=best;i<best+s.c;i++) colH[i]=by+s.h+FC_GAP; });
    return pos;
  }
  // вміст картки (лише показ; дії — тими самими функціями, що й чат)
  function fcCardHTML(b){
    const t=b.type, id=esc(b.id);
    if(typeof wgIs==='function'&&wgIs(t)) return `<div class="pgwg fc-wg" data-wghost="${id}"></div>`;
    if(t==='tbl') return `<div class="fc-in fc-tbl">${fhTblHTML(b)}</div><button class="fc-open" data-fcopen="${id}">Відкрити ›</button>`;
    if(t==='task') return `<div class="fc-in fc-task${b.done?' done':''}"><button class="fh-box" data-fcdone="${id}" aria-pressed="${!!b.done}" aria-label="Готово">${b.done?chI('check'):''}</button><button class="fc-tx" data-fcedit="${id}" data-i18n-skip="1">${esc(fhLabel(b))}</button></div>`;
    if(t==='photo'&&b.data){ let u=''; try{ u=safeImg(b.data); }catch(_){} return `<div class="fc-ph" style="background-image:url('${esc(u)}')"></div>${b.title?`<span class="fc-cap" data-i18n-skip="1">${esc(fhPlain(b.title))}</span>`:''}`; }
    if(FH_TEXTY[t]) return `<button class="fc-in fc-text${(t==='h1'||t==='h2'||t==='h3')?' fc-h':''}" data-fcedit="${id}" data-i18n-skip="1">${esc(fhLabel(b))}</button>`;
    return `<div class="fc-in fc-gen"><b data-i18n-skip="1">${esc(fhLabel(b))}</b></div><button class="fc-open" data-fcopen="${id}">Відкрити ›</button>`;
  }
  function fcRender(box,arr,fk){
    const list=fcList(arr), edit=fcEdit===fk;
    box.classList.toggle('fc-editing',edit);
    if(!list.length){ box.innerHTML=`<div class="fhv-empty"><b>Полотно порожнє</b><span>Додай блок через «＋» або напиши внизу — він ляже на стіл.</span></div>`; return; }
    const W=Math.max(240,Math.round(box.clientWidth||((box.parentNode&&box.parentNode.clientWidth)||320)));
    const pos=fcLayout(list,W); let H=0; list.forEach(b=>{ const p=pos[b.id]; H=Math.max(H,p.y+p.h); });
    box.innerHTML=`<div class="fc-bar">${edit
        ?`<span class="fc-hint">Тягни блок · кут ◢ — розмір</span><button class="fc-btn" data-fcalign>Вирівняти</button><button class="fc-btn acc" data-fcdone-edit>Готово</button>`
        :`<span class="fc-hint">${fcDev()==='d'?'Стіл компʼютера':'Стіл телефона'}</span><button class="fc-btn" data-fcedit-mode>✎ Змінити</button>`}</div>`
      +`<div class="fc-desk" style="height:${Math.round(H+40)}px">`
      +list.map(b=>{ const p=pos[b.id], wg=typeof wgIs==='function'&&wgIs(b.type);
        return `<div class="fc-c${wg?' wg':''}" data-fc="${esc(b.id)}" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px">${fcCardHTML(b)}`
          +(edit?`<span class="fc-rs" data-fcrs="${esc(b.id)}" aria-hidden="true"></span>`:'')+`</div>`; }).join('')+`</div>`;
    box._fcPos=pos; box._fcW=W; box._fcFk=fk;
    if(typeof wgFill==='function') box.querySelectorAll('[data-wghost]').forEach(h=>{ const r=fhFind(h.dataset.wghost); if(r) wgFill(h,r.b,fk); });
    const on=(sel,fn)=>box.querySelectorAll(sel).forEach(el=>el.onclick=e=>{ if(box._fcMoved){ box._fcMoved=false; return; } fn(el,e); });
    on('[data-fcdone]',el=>{ const r=fhFind(el.dataset.fcdone); if(!r) return; r.b.done=!r.b.done; chHaptic('select'); fhCommit(); });
    on('[data-fcedit]',el=>{ if(!edit) fhEdit(el.dataset.fcedit); });
    on('[data-fcopen]',el=>{ if(!edit) fhPeekOpen(fk,el.dataset.fcopen); });
    on('[data-fcedit-mode]',()=>{ fcEdit=fk; chHaptic('select'); fhApplyView(); });
    on('[data-fcdone-edit]',()=>{ fcEdit=''; chHaptic('select'); fhApplyView(); });
    on('[data-fcalign]',()=>fcAlign(box,list));
    if(edit) fcBindDrag(box,list);
  }
  // стіл цього пристрою фіксується повністю: інакше нові блоки, що лягають «самі», наїжджали б на поставлені руками
  // keep — id картки, яку щойно рухали: вона пишеться завжди; уже поставлені інші не переписуємо
  // (у звуженому вікні їхні місця підрізані під ширину — записати їх означало б загубити широкий розклад)
  function fcFreeze(list,pos,dev,keep){ list.forEach(b=>{ const p=pos[b.id]; if(!p) return;
    if(keep&&b.id!==keep&&fcSaved(b,dev)) return;
    if(!b.cv||typeof b.cv!=='object'||Array.isArray(b.cv)) b.cv={};
    b.cv[dev]={x:Math.round(p.x),y:Math.round(p.y),w:Math.round(p.w),h:Math.round(p.h)}; }); }
  function fcAlign(box,list){
    const dev=fcDev(), was=list.map(b=>[String(b.id),b.cv&&b.cv[dev]?Object.assign({},b.cv[dev]):null]);
    list.forEach(b=>{ if(b.cv&&b.cv[dev]) delete b.cv[dev]; });
    const W=box._fcW||box.clientWidth, order=list.slice().sort((a,c)=>{ const p=box._fcPos[a.id], q=box._fcPos[c.id]; return (p.y-q.y)||(p.x-q.x); });
    fcFreeze(order,fcLayout(order,W),dev); chHaptic('medium'); fhCommit();
    // «Скасувати» повертає кожному блоку його попереднє місце на цьому пристрої. Шукаємо блок за id заново:
    // після збереження редактор перебудовує обʼєкти, старі посилання вже нікуди не ведуть
    try{ flowUndoToast('Вирівняно',()=>{ was.forEach(([id,r])=>{ const f=fhFind(id); if(!f) return; const b=f.b;
      if(!b.cv||typeof b.cv!=='object'||Array.isArray(b.cv)) b.cv={}; if(r) b.cv[dev]=r; else delete b.cv[dev]; }); fhCommit(); }); }catch(_){}
  }
  // «Змінити»: тягнути картку, розмір — за кут; прилипання до сітки й до країв сусідів
  function fcBindDrag(box,list){
    const desk=box.querySelector('.fc-desk'); if(!desk) return;
    const pos=box._fcPos, W=box._fcW, snap=v=>Math.round(v/FC_SNAP)*FC_SNAP;
    let d=null;
    const guides=(id,p)=>{ desk.querySelectorAll('.fc-g').forEach(g=>g.remove());
      const ex=[], ey=[]; Object.keys(pos).forEach(k=>{ if(k===id) return; const q=pos[k]; ex.push(q.x,q.x+q.w); ey.push(q.y,q.y+q.h); });
      [['x',p.x],['x',p.x+p.w]].forEach(([_,v])=>{ if(ex.some(e=>Math.abs(e-v)<1)){ const g=document.createElement('i'); g.className='fc-g v'; g.style.left=v+'px'; desk.appendChild(g); } });
      [['y',p.y],['y',p.y+p.h]].forEach(([_,v])=>{ if(ey.some(e=>Math.abs(e-v)<1)){ const g=document.createElement('i'); g.className='fc-g h'; g.style.top=v+'px'; desk.appendChild(g); } }); };
    // прилипнути до краю сусіда, якщо ближче за 10px
    const stick=(v,list2)=>{ let best=v, bd=10; list2.forEach(e=>{ const dd=Math.abs(e-v); if(dd<bd){ bd=dd; best=e; } }); return best; };
    desk.addEventListener('pointerdown',e=>{
      const card=e.target.closest('.fc-c'); if(!card) return;
      const id=card.dataset.fc, p=pos[id]; if(!p) return;
      d={id,card,rs:!!e.target.closest('[data-fcrs]'),sx:e.clientX,sy:e.clientY,p0:Object.assign({},p),moved:false};
      card.classList.add('fc-drag'); try{ card.setPointerCapture(e.pointerId); }catch(_){}
      e.preventDefault();
    });
    desk.addEventListener('pointermove',e=>{
      if(!d) return; const dx=e.clientX-d.sx, dy=e.clientY-d.sy; if(Math.abs(dx)+Math.abs(dy)>3) d.moved=true;
      const p=pos[d.id], ex=[], ey=[]; Object.keys(pos).forEach(k=>{ if(k===d.id) return; const q=pos[k]; ex.push(q.x,q.x+q.w+FC_GAP,q.x-FC_GAP); ey.push(q.y,q.y+q.h+FC_GAP,q.y-FC_GAP); });
      if(d.rs){
        p.w=Math.max(96,Math.min(W-p.x,snap(d.p0.w+dx))); p.h=Math.max(52,snap(d.p0.h+dy));
        p.w=stick(p.x+p.w,ex)-p.x; p.h=stick(p.y+p.h,ey)-p.y;
        d.card.style.width=p.w+'px'; d.card.style.height=p.h+'px';
      } else {
        p.x=Math.max(0,Math.min(W-p.w,snap(d.p0.x+dx))); p.y=Math.max(0,snap(d.p0.y+dy));
        p.x=stick(p.x,ex); p.y=stick(p.y,ey);
        d.card.style.left=p.x+'px'; d.card.style.top=p.y+'px';
      }
      guides(d.id,p);
      const need=p.y+p.h+40; if(need>desk.offsetHeight) desk.style.height=need+'px';
    });
    const end=()=>{ if(!d) return; const was=d; d=null;
      was.card.classList.remove('fc-drag'); desk.querySelectorAll('.fc-g').forEach(g=>g.remove());
      if(!was.moved) return;
      box._fcMoved=true; setTimeout(()=>{ box._fcMoved=false; },0);
      fcFreeze(list,pos,fcDev(),was.id); fhCommit(); };
    desk.addEventListener('pointerup',end); desk.addEventListener('pointercancel',end);
  }
  // ширина вікна змінилась (Mac тягнуть мишею, телефон повернули) — перемалювати полотно під нову ширину
  var fcRz=0;
  window.addEventListener('resize',()=>{ clearTimeout(fcRz); fcRz=setTimeout(()=>{ try{ const s=document.getElementById('scr-page'); if(s&&s.classList.contains('fh-v-canvas')) fhApplyView(); }catch(_){} },200); },{passive:true});
