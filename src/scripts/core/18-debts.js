  /* ============ DEBTS LOGIC ============
     Весь core — один спільний <script>, тож імена тут глобальні. Тому все
     з префіксом debt*: загальні render/save/items колись перехопила б
     будь-яка інша частина програми. esc і fmt — у 01-base.js. */
  const CUR={UAH:"₴",USD:"$",EUR:"€",PLN:"zł",GBP:"£"};
  const DEBT_KEY='debts';
  let debtKind='owe', debtItems=[];

  document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.seg button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on'); debtKind=b.dataset.k;
  });
  document.getElementById('date').value=ymdLocal();

  function debtSave(){
    try{ const p=window.storage.set(DEBT_KEY,JSON.stringify(debtItems),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
  }
  function initials(n){ return (n.trim()[0]||'?').toUpperCase(); }
  /* Єдиний чистильник розмітки з нотаток і журналу (SEC-6, 10.10.2026).
     Розбираємо в ІНЕРТНОМУ документі (DOMParser): там нічого не вантажиться
     і не запускається — на відміну від div.innerHTML у живій сторінці, де
     <img onerror> спрацьовував уже під час «чистки». Лишаємо білий список
     тегів форматування; невідомі теги розгортаємо (текст лишається), а
     script/style/iframe… викидаємо разом із вмістом. Атрибути — усі геть,
     крім: маркера (background-color у span/font/mark), клас je-chk/on
     (пункт-галочка журналу) і href у посиланнях (лише http(s) і mailto). */
  function sanitizeRich(html){
    try{
      const RICH_TAGS={B:1,STRONG:1,I:1,EM:1,U:1,S:1,STRIKE:1,DEL:1,MARK:1,BR:1,DIV:1,SPAN:1,FONT:1,P:1,
        H1:1,H2:1,H3:1,H4:1,UL:1,OL:1,LI:1,BLOCKQUOTE:1,PRE:1,CODE:1,SUB:1,SUP:1,HR:1,A:1};
      const RICH_DROP={SCRIPT:1,STYLE:1,TEMPLATE:1,IFRAME:1,FRAME:1,FRAMESET:1,OBJECT:1,EMBED:1,APPLET:1,
        NOSCRIPT:1,TITLE:1,HEAD:1,META:1,LINK:1,BASE:1,SVG:1,MATH:1,FORM:1,TEXTAREA:1,SELECT:1};
      const doc=new DOMParser().parseFromString('<!doctype html><body>'+String(html||''),'text/html');
      const walk=node=>{
        [...node.childNodes].forEach(n=>{
          if(n.nodeType===3) return;
          if(n.nodeType!==1){ n.remove(); return; }          // коментарі та інше — геть
          const tag=String(n.tagName||'').toUpperCase();
          if(RICH_DROP[tag]){ n.remove(); return; }
          walk(n);
          if(!RICH_TAGS[tag]){ n.replaceWith(...n.childNodes); return; }
          // прибрати всі атрибути, крім підсвітки, галочки журналу й безпечного href
          const bg=String(n.style&&n.style.backgroundColor||'');
          const cls=String(n.getAttribute('class')||'').split(/\s+/).filter(c=>c==='je-chk'||c==='on').join(' ');
          const href=tag==='A'?safeHref(n.getAttribute('href')):'';
          [...n.attributes].forEach(a=>n.removeAttribute(a.name));
          if((tag==='SPAN'||tag==='FONT'||tag==='MARK') && /^(#[0-9a-f]{3,8}|rgba?\([\d.,\s%]+\)|[a-z]+)$/i.test(bg)) n.style.backgroundColor=bg;
          if(tag==='DIV' && cls) n.setAttribute('class',cls);
          if(href){ n.setAttribute('href',href); n.setAttribute('target','_blank'); n.setAttribute('rel','noopener noreferrer'); }
        });
      };
      walk(doc.body);
      return doc.body.innerHTML;
    }catch(_){ return esc(html); }
  }
  /* Адреса для посилання: лише http(s) і mailto. Без схеми («site.com») —
     вважаємо https. javascript:, data:, file: та інше — порожньо. */
  function safeHref(u){
    const raw=String(u==null?'':u).trim();
    if(!raw || /[\s\u0000-\u001f\u007f-\u009f]/.test(raw)) return '';   // «java\tscript:» теж сюди
    if(/^(https?:\/\/|mailto:)/i.test(raw)) return raw;
    if(/^[a-z][a-z0-9+.\-]*:/i.test(raw)||/^[\/\\]/.test(raw)) return '';
    return /^[^.]+\.[^.]/.test(raw)?'https://'+raw:'';
  }
  /* Імпорт бекапу: розмітка з чужого файлу йде крізь той самий чистильник
     ще до запису у сховище. Ходимо по JSON будь-якого ключа і чистимо
     html нотаток (type note/quick) і rich[день] журналу. Повертає рядок;
     якщо чистити нічого — той самий рядок без змін. */
  function sanitizeStoredRich(str){
    if(typeof str!=='string' || (str.indexOf('html')<0 && str.indexOf('rich')<0)) return str;
    let o; try{ o=JSON.parse(str); }catch(_){ return str; }
    let changed=false;
    const fix=h=>{ const c=sanitizeRich(h); if(c!==h) changed=true; return c; };
    const walk=(x,depth)=>{
      if(!x || typeof x!=='object' || depth>40) return;
      if(Array.isArray(x)){ x.forEach(y=>walk(y,depth+1)); return; }
      if(typeof x.html==='string' && (x.type==='note'||x.type==='quick')) x.html=fix(x.html);
      if(x.rich && typeof x.rich==='object' && !Array.isArray(x.rich))
        Object.keys(x.rich).forEach(k=>{ if(typeof x.rich[k]==='string') x.rich[k]=fix(x.rich[k]); });
      Object.keys(x).forEach(k=>{
        const v=x[k];
        // обгортка сховища {_v,d}: d — сам JSON рядком
        if(typeof v==='string' && /^\s*[\[{]/.test(v)){ const c=sanitizeStoredRich(v); if(c!==v){ x[k]=c; changed=true; } }
        else if(k!=='rich') walk(v,depth+1);
      });
    };
    walk(o,0);
    return changed?JSON.stringify(o):str;
  }
  // безпечне джерело зображення: лише data:image/* або http(s); інакше порожньо (захист від XSS у src/url())
  function safeImg(u){
    /* Знімки переїхали в IndexedDB, і в даних тепер лежить посилання
       `idb:ph_…` замість самого data-URL. Розв'язуємо його тут, у єдиній
       точці, крізь яку проходить кожне зображення — інакше довелося б
       правити півтора десятка місць рендеру. Звичайні data:/http адреси
       photoSrc повертає незмінними. */
    try{ if(window.photoSrc) u=window.photoSrc(u); }catch(_){}
    u=String(u==null?'':u).trim();
    /* переноси рядка, керівні символи й «\» дають змогу вийти з url('…') у сусідні CSS-властивості
       (шар на весь екран, картинка з чужого сервера) — таку адресу не пропускаємо; дужки кодуємо (10.10.2026) */
    if(/[\u0000-\u001f\u007f\\]/.test(u)) return '';
    const enc=s=>s.replace(/'/g,'%27').replace(/"/g,'%22').replace(/\(/g,'%28').replace(/\)/g,'%29');
    if(/^data:image\/(png|jpe?g|gif|webp|svg\+xml);/i.test(u)) return enc(u.replace(/ /g,'%20'));
    if(/^https?:\/\//i.test(u)) return /\s/.test(u)?'':enc(u);
    return '';
  }
  function balance(i){ return i.ops.reduce((s,o)=>s+(o.type==='borrow'?o.amount:-o.amount),0); }

  document.getElementById('add').onclick=()=>{
    const name=document.getElementById('name').value.trim();
    const amount=parseFloat(document.getElementById('amount').value);
    const cur=document.getElementById('cur').value;
    const date=document.getElementById('date').value;
    const note=document.getElementById('note').value.trim();
    if(!name||!(amount>0)){ (!name?document.getElementById('name'):document.getElementById('amount')).focus(); return; }
    debtItems.unshift({ id:Date.now(), kind:debtKind, name, cur, ops:[{id:Date.now(),type:'borrow',amount,date,note}] });
    document.getElementById('name').value=''; document.getElementById('amount').value=''; document.getElementById('note').value='';
    debtSave(); debtRender();
  };
  function debtDel(id){ debtItems=debtItems.filter(i=>i.id!==id); debtSave(); debtRender(); if(curId===id) closeModal(); }

  function debtRender(){
    document.getElementById('cnt').textContent=debtItems.length;
    const tot=debtTotals(), curs=Object.keys(tot);
    const sumLine=k=>curs.length?curs.map(c=>`<div class="dsum">${fmt(tot[c][k])} <small>${esc(CUR[c]||c)}</small></div>`).join(''):'0 <small>'+esc(curSym())+'</small>';
    document.getElementById('sumOwe').innerHTML=sumLine('owe');
    document.getElementById('sumOwed').innerHTML=sumLine('owed');
    const ne=document.getElementById('net');
    const nets=curs.map(c=>({c,n:tot[c].owed-tot[c].owe}));
    ne.textContent=nets.length?nets.map(x=>(x.n>0?'+':'')+fmt(x.n)+' '+(CUR[x.c]||x.c)).join(' · '):money(0);
    ne.style.color=nets.length===1?(nets[0].n>0?'var(--owed)':nets[0].n<0?'var(--owe)':'var(--text)'):'var(--text)';

    const list=document.getElementById('list');
    if(!debtItems.length){ list.innerHTML=`<div class="empty"><div class="e">🪙</div>Поки що порожньо.<br>Додай перший запис вище.</div>`; return; }
    list.innerHTML=debtItems.map(i=>{
      const c=i.kind==='owe'?'var(--owe)':'var(--owed)';
      const bal=balance(i), settled=bal<=0.0001;
      const sign=i.kind==='owe'?'−':'+';
      const last=i.ops[i.ops.length-1];
      const d=last&&last.date?new Date(last.date).toLocaleDateString('uk-UA',{day:'numeric',month:'short',year:'numeric'}):'';
      const kindTxt=i.kind==='owe'?'Я винен':'Мені винні';
      const opsTxt=i.ops.length>1?` · ${i.ops.length} оп.`:'';
      const amtHtml=settled?`<div class="settled">✓ Погашено</div>`:`<div class="amt">${sign}${fmt(bal)} ${esc(CUR[i.cur]||i.cur)}</div>`;
      const syncBtn = (!settled)
        ? (i.synced
            ? `<button class="debt-sync done" data-debtsync="${esc(i.id)}" onclick="event.stopPropagation()">✓ у фінансах</button>`
            : `<button class="debt-sync" data-debtsync="${esc(i.id)}" onclick="event.stopPropagation()">→ у фінанси</button>`)
        : '';
      return `<div class="item clickable" style="--c:${c}" data-debtopen="${esc(i.id)}">
        <div class="who">${esc(initials(i.name))}</div>
        <div class="mid"><div class="nm">${esc(i.name)}</div><div class="meta">${kindTxt}${d?' · '+d:''}${opsTxt}</div>${syncBtn}</div>
        ${amtHtml}<div class="chev">›</div></div>`;
    }).join('');
    document.querySelectorAll('[data-debtsync]').forEach(b=>b.onclick=(ev)=>{ ev.stopPropagation(); toggleDebtSync(b.dataset.debtsync); });
    // id боргу раніше вклеювався в onclick="openModal(…)" як JS-код: рядковий id (з хмари чи від AI)
    // або ламав клік, або виконувався. Тепер id лежить у data-атрибуті, а запис шукаємо за ним.
    list.querySelectorAll('[data-debtopen]').forEach(el=>el.onclick=()=>{
      const it=debtItems.find(x=>String(x.id)===el.dataset.debtopen); if(it) openModal(it.id); });
  }

  function toggleDebtSync(id){
    const i=debtItems.find(x=>String(x.id)===String(id)); if(!i) return;
    const bal=balance(i);
    if(i.synced){
      // прибрати пов'язану операцію
      if(i.finOpId){ finOps=finOps.filter(o=>String(o.id)!==String(i.finOpId)); saveFinOps(); }
      i.synced=false; i.finOpId=null;
    } else {
      if(!(bal>0)) return;
      // Гаманець у гривні: борг у €/$/zł переводимо за курсом (питаємо раз)
      finAskRate(i.cur||'UAH', rate=>{
        if(i.synced) return;                  // поки питали курс, вже синхронізували
        const opId=Date.now()+'_'+Math.random().toString(36).slice(2,6);
        const last=i.ops[i.ops.length-1];
        const date=(last&&last.date)?last.date:ymdLocal();
        // я винен → майбутня витрата; мені винні → майбутній дохід
        const type=i.kind==='owe'?'out':'in';
        const label=(i.kind==='owe'?'Борг (я винен) · ':'Борг (мені винні) · ')+i.name;
        let _mc; try{ ensureCards(); _mc=mainCard().id; }catch(_){}
        finOps.push(finOpFx({ id:opId, type, label, date, _debtId:i.id, card:_mc }, bal, i.cur||'UAH', rate));
        i.synced=true; i.finOpId=opId;
        saveFinOps();
        debtSave(); debtRender(); try{ renderFinance(); }catch(_){}
      });
      return;
    }
    debtSave(); debtRender(); try{ renderFinance(); }catch(_){}
  }

  /* ---- modal ---- */
  let curId=null, pendingType=null;
  function openModal(id){ curId=id; pendingType=null;
    document.getElementById('prompt').classList.add('hidden'); document.getElementById('pAmount').value='';
    renderModal(); document.getElementById('modal').classList.add('open'); }
  function closeModal(){ document.getElementById('modal').classList.remove('open'); curId=null; }
  document.getElementById('modal').onclick=e=>{ if(e.target.id==='modal') closeModal(); };

  function renderModal(){
    const i=debtItems.find(x=>x.id===curId); if(!i){ closeModal(); return; }
    const c=i.kind==='owe'?'var(--owe)':'var(--owed)', sym=CUR[i.cur]||i.cur;
    document.getElementById('modalIn').style.setProperty('--c',c);
    document.getElementById('mAv').textContent=initials(i.name);
    document.getElementById('mName').textContent=i.name;
    document.getElementById('mKind').textContent=(i.kind==='owe'?'Я винен · ':'Мені винні · ')+i.cur;
    const bal=balance(i), settled=bal<=0.0001, v=document.getElementById('mVal');
    v.textContent=settled?'0 '+sym:fmt(bal)+' '+sym; v.classList.toggle('zero',settled);
    document.getElementById('mDesc').textContent=settled?'Борг повністю погашено 🎉':(i.kind==='owe'?'Стільки ще треба віддати':'Стільки тобі ще винні');
    const pay=document.getElementById('opPay'), more=document.getElementById('opMore');
    if(i.kind==='owe'){ pay.innerHTML='↓ Я віддав<small>зменшити борг</small>'; more.innerHTML='↑ Позичив ще<small>збільшити борг</small>'; }
    else{ pay.innerHTML='↓ Мені повернули<small>зменшити борг</small>'; more.innerHTML='↑ Дав ще<small>збільшити борг</small>'; }
    pay.onclick=()=>askOp('repay'); more.onclick=()=>askOp('borrow');
    document.getElementById('mHist').innerHTML=i.ops.slice().reverse().map(o=>{
      const grows=o.type==='borrow', dir=grows?'up':'down', icon=grows?'↑':'↓', sign=grows?'+':'−';
      let label = o.type==='borrow' ? (i.kind==='owe'?'Позичив':'Дав у борг') : (i.kind==='owe'?'Віддав':'Повернули');
      const d=o.date?new Date(o.date).toLocaleDateString('uk-UA',{day:'numeric',month:'short',year:'numeric'}):'';
      const sub=[d,o.note].filter(Boolean).map(esc).join(' · ');
      const canDel=i.ops.length>1;
      return `<div class="hrow ${dir}"><div class="dot">${icon}</div>
        <div class="htxt"><b>${label}</b><span>${sub||'—'}</span></div>
        <div class="hamt">${sign}${fmt(o.amount)} ${esc(sym)}</div>
        ${canDel?`<button class="hx" data-debtopdel="${esc(o.id)}">×</button>`:''}</div>`;
    }).join('');
    // як і в списку: id операції — у data-атрибуті, а не в JS-коді onclick
    document.querySelectorAll('#mHist [data-debtopdel]').forEach(el=>el.onclick=()=>{
      const o=i.ops.find(x=>String(x.id)===el.dataset.debtopdel); if(o) delOp(o.id); });
  }
  function askOp(type){ pendingType=type;
    const i=debtItems.find(x=>x.id===curId), p=document.getElementById('prompt');
    let title = type==='repay' ? (i.kind==='owe'?'Скільки ти віддав?':'Скільки тобі повернули?')
                               : (i.kind==='owe'?'Скільки ще позичив?':'Скільки ще дав у борг?');
    document.getElementById('pTitle').textContent=title; p.classList.remove('hidden');
    const inp=document.getElementById('pAmount'); inp.value=''; inp.focus();
  }
  document.getElementById('pOk').onclick=commitOp;
  document.getElementById('pAmount').addEventListener('keydown',e=>{ if(e.key==='Enter') commitOp(); });
  function commitOp(){
    const i=debtItems.find(x=>x.id===curId), amt=parseFloat(document.getElementById('pAmount').value);
    if(!i||!(amt>0)){ document.getElementById('pAmount').focus(); return; }
    let amount=amt;
    if(pendingType==='repay'){ const bal=balance(i); if(amount>bal) amount=bal; }
    i.ops.push({id:Date.now(),type:pendingType,amount,date:ymdLocal(),note:''});
    document.getElementById('prompt').classList.add('hidden'); pendingType=null;
    debtSave(); renderModal(); debtRender();
  }
  function delOp(opId){
    const i=debtItems.find(x=>x.id===curId); if(!i||i.ops.length<=1) return;
    i.ops=i.ops.filter(o=>o.id!==opId); debtSave(); renderModal(); debtRender();
  }

