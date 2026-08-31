  /* ============ DEBTS LOGIC ============ */
  const CUR={UAH:"₴",USD:"$",EUR:"€",PLN:"zł"};
  const KEY='debts';
  let kind='owe', items=[];

  document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.seg button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on'); kind=b.dataset.k;
  });
  document.getElementById('date').value=ymdLocal();

  function save(){
    try{ const p=window.storage.set(KEY,JSON.stringify(items),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
  }
  function fmt(n){ return Number(n).toLocaleString('uk-UA',{maximumFractionDigits:2}); }
  function initials(n){ return (n.trim()[0]||'?').toUpperCase(); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  // дозволяємо лише прості теги форматування у rich-нотатці
  function sanitizeRich(html){
    try{
      const tmp=document.createElement('div'); tmp.innerHTML=String(html||'');
      const allow={B:1,I:1,U:1,S:1,STRIKE:1,MARK:1,BR:1,DIV:1,SPAN:1,FONT:1,P:1};
      const walk=node=>{
        [...node.childNodes].forEach(n=>{
          if(n.nodeType===1){
            if(!allow[n.tagName]){ const txt=document.createTextNode(n.textContent); n.replaceWith(txt); return; }
            // прибрати всі атрибути крім підсвітки
            const bg=n.style && (n.style.backgroundColor||'');
            [...n.attributes].forEach(a=>n.removeAttribute(a.name));
            if((n.tagName==='SPAN'||n.tagName==='FONT'||n.tagName==='MARK') && bg){ n.style.backgroundColor=bg; }
            walk(n);
          }
        });
      };
      walk(tmp);
      return tmp.innerHTML;
    }catch(_){ return esc(html); }
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
    if(/^data:image\/(png|jpe?g|gif|webp|svg\+xml);/i.test(u)) return u.replace(/'/g,'%27').replace(/"/g,'%22');
    if(/^https?:\/\//i.test(u)) return u.replace(/'/g,'%27').replace(/"/g,'%22');
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
    items.unshift({ id:Date.now(), kind, name, cur, ops:[{id:Date.now(),type:'borrow',amount,date,note}] });
    document.getElementById('name').value=''; document.getElementById('amount').value=''; document.getElementById('note').value='';
    save(); render();
  };
  function del(id){ items=items.filter(i=>i.id!==id); save(); render(); if(curId===id) closeModal(); }

  function render(){
    document.getElementById('cnt').textContent=items.length;
    const tot=debtTotals(), curs=Object.keys(tot);
    const sumLine=k=>curs.length?curs.map(c=>`<div class="dsum">${fmt(tot[c][k])} <small>${CUR[c]||c}</small></div>`).join(''):'0 <small>₴</small>';
    document.getElementById('sumOwe').innerHTML=sumLine('owe');
    document.getElementById('sumOwed').innerHTML=sumLine('owed');
    const ne=document.getElementById('net');
    const nets=curs.map(c=>({c,n:tot[c].owed-tot[c].owe}));
    ne.textContent=nets.length?nets.map(x=>(x.n>0?'+':'')+fmt(x.n)+' '+(CUR[x.c]||x.c)).join(' · '):'0 ₴';
    ne.style.color=nets.length===1?(nets[0].n>0?'var(--owed)':nets[0].n<0?'var(--owe)':'var(--text)'):'var(--text)';

    const list=document.getElementById('list');
    if(!items.length){ list.innerHTML=`<div class="empty"><div class="e">🪙</div>Поки що порожньо.<br>Додай перший запис вище.</div>`; return; }
    list.innerHTML=items.map(i=>{
      const c=i.kind==='owe'?'var(--owe)':'var(--owed)';
      const bal=balance(i), settled=bal<=0.0001;
      const sign=i.kind==='owe'?'−':'+';
      const last=i.ops[i.ops.length-1];
      const d=last&&last.date?new Date(last.date).toLocaleDateString('uk-UA',{day:'numeric',month:'short',year:'numeric'}):'';
      const kindTxt=i.kind==='owe'?'Я винен':'Мені винні';
      const opsTxt=i.ops.length>1?` · ${i.ops.length} оп.`:'';
      const amtHtml=settled?`<div class="settled">✓ Погашено</div>`:`<div class="amt">${sign}${fmt(bal)} ${CUR[i.cur]||i.cur}</div>`;
      const syncBtn = (!settled)
        ? (i.synced
            ? `<button class="debt-sync done" data-debtsync="${i.id}" onclick="event.stopPropagation()">✓ у фінансах</button>`
            : `<button class="debt-sync" data-debtsync="${i.id}" onclick="event.stopPropagation()">→ у фінанси</button>`)
        : '';
      return `<div class="item clickable" style="--c:${c}" onclick="openModal(${i.id})">
        <div class="who">${initials(i.name)}</div>
        <div class="mid"><div class="nm">${esc(i.name)}</div><div class="meta">${kindTxt}${d?' · '+d:''}${opsTxt}</div>${syncBtn}</div>
        ${amtHtml}<div class="chev">›</div></div>`;
    }).join('');
    document.querySelectorAll('[data-debtsync]').forEach(b=>b.onclick=(ev)=>{ ev.stopPropagation(); toggleDebtSync(b.dataset.debtsync); });
  }

  function toggleDebtSync(id){
    const i=items.find(x=>String(x.id)===String(id)); if(!i) return;
    const bal=balance(i);
    if(i.synced){
      // прибрати пов'язану операцію
      if(i.finOpId){ finOps=finOps.filter(o=>String(o.id)!==String(i.finOpId)); saveFinOps(); }
      i.synced=false; i.finOpId=null;
    } else {
      if(!(bal>0)) return;
      // всі валюти дозволені — сума йде як є, валюта зазначена у назві
      const opId=Date.now()+'_'+Math.random().toString(36).slice(2,6);
      const last=i.ops[i.ops.length-1];
      const date=(last&&last.date)?last.date:ymdLocal();
      // я винен → майбутня витрата; мені винні → майбутній дохід
      const type=i.kind==='owe'?'out':'in';
      const label=(i.kind==='owe'?'Борг (я винен) · ':'Борг (мені винні) · ')+i.name+(i.cur&&i.cur!=='UAH'?' ('+(CUR[i.cur]||i.cur)+')':'');
      let _mc; try{ ensureCards(); _mc=mainCard().id; }catch(_){}
      finOps.push({ id:opId, type, amount:bal, label, date, _debtId:i.id, card:_mc });
      i.synced=true; i.finOpId=opId;
      saveFinOps();
    }
    save(); render(); try{ renderFinance(); }catch(_){}
  }

  /* ---- modal ---- */
  let curId=null, pendingType=null;
  function openModal(id){ curId=id; pendingType=null;
    document.getElementById('prompt').classList.add('hidden'); document.getElementById('pAmount').value='';
    renderModal(); document.getElementById('modal').classList.add('open'); }
  function closeModal(){ document.getElementById('modal').classList.remove('open'); curId=null; }
  document.getElementById('modal').onclick=e=>{ if(e.target.id==='modal') closeModal(); };

  function renderModal(){
    const i=items.find(x=>x.id===curId); if(!i){ closeModal(); return; }
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
        <div class="hamt">${sign}${fmt(o.amount)} ${sym}</div>
        ${canDel?`<button class="hx" onclick="delOp(${o.id})">×</button>`:''}</div>`;
    }).join('');
  }
  function askOp(type){ pendingType=type;
    const i=items.find(x=>x.id===curId), p=document.getElementById('prompt');
    let title = type==='repay' ? (i.kind==='owe'?'Скільки ти віддав?':'Скільки тобі повернули?')
                               : (i.kind==='owe'?'Скільки ще позичив?':'Скільки ще дав у борг?');
    document.getElementById('pTitle').textContent=title; p.classList.remove('hidden');
    const inp=document.getElementById('pAmount'); inp.value=''; inp.focus();
  }
  document.getElementById('pOk').onclick=commitOp;
  document.getElementById('pAmount').addEventListener('keydown',e=>{ if(e.key==='Enter') commitOp(); });
  function commitOp(){
    const i=items.find(x=>x.id===curId), amt=parseFloat(document.getElementById('pAmount').value);
    if(!i||!(amt>0)){ document.getElementById('pAmount').focus(); return; }
    let amount=amt;
    if(pendingType==='repay'){ const bal=balance(i); if(amount>bal) amount=bal; }
    i.ops.push({id:Date.now(),type:pendingType,amount,date:ymdLocal(),note:''});
    document.getElementById('prompt').classList.add('hidden'); pendingType=null;
    save(); renderModal(); render();
  }
  function delOp(opId){
    const i=items.find(x=>x.id===curId); if(!i||i.ops.length<=1) return;
    i.ops=i.ops.filter(o=>o.id!==opId); save(); renderModal(); render();
  }

