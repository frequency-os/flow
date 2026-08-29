  /* ============ SPENDING LOGIC ============ */
  const SKEY='spend';
  let spends=[];

  const CATS={
    food:    {name:'Продукти',  emoji:'🛒', color:'#34c77b', words:['продукт','їжа','супермаркет','атб','сільпо','market','магазин','овоч','хліб','молок','м\'ясо']},
    cafe:    {name:'Кафе/кава', emoji:'☕', color:'#c9883a', words:['кава','кофе','coffee','латте','капучино','чай','перекус','снек']},
    eat:     {name:'Ресторани', emoji:'🍽️', color:'#e8843c', words:['обід','вечер','сніданок','ресторан','кафе','піца','суші','бургер','їдальня','доставк']},
    transport:{name:'Транспорт',emoji:'🚌', color:'#5b8def', words:['проїзд','таксі','taxi','uber','bolt','метро','автобус','бензин','паливо','заправ','транспорт']},
    health:  {name:'Здоров\'я', emoji:'💊', color:'#ff6b9d', words:['аптек','ліки','лікар','стоматолог','медиц','здоров','вітамін']},
    fun:     {name:'Розваги',   emoji:'🎬', color:'#c77dff', words:['кіно','кино','гра','game','розваг','концерт','клуб','бар','підписк','spotify','netflix','youtube']},
    home:    {name:'Дім',       emoji:'🏠', color:'#9b8cff', words:['оренда','комуналк','квартир','світло','газ','вода','інтернет','побут','хімія']},
    clothes: {name:'Одяг',      emoji:'👕', color:'#4ecdc4', words:['одяг','взуття','кросівк','куртк','футболк','штани','магазин одягу']},
    other:   {name:'Інше',      emoji:'📦', color:'#8b93a3', words:[]},
  };
  const CAT_ORDER=['food','cafe','eat','transport','health','fun','home','clothes','other'];

  function categorize(text){
    const t=text.toLowerCase();
    const tagM=t.match(/#(\S+)/);
    if(tagM){ for(const k in CATS){ if(k===tagM[1]||CATS[k].name.toLowerCase().startsWith(tagM[1])) return k; } }
    for(const k of CAT_ORDER){ if(CATS[k].words.some(w=>t.includes(w))) return k; }
    return 'other';
  }

  // parse a free line like "кава 80, обід 220, таксі 180 #транспорт"
  function parseLine(line){
    const out=[];
    line.split(/[,;\n]+/).forEach(chunk=>{
      const c=chunk.trim(); if(!c) return;
      const m=c.match(/(\d+(?:[.,]\d+)?)/);
      if(!m) return;
      const amount=parseFloat(m[1].replace(',','.'));
      if(!(amount>0)) return;
      let label=c.replace(m[1],'').replace(/#\S+/,'').replace(/грн|₴|uah/gi,'').trim();
      if(!label) label='Витрата';
      const cat=categorize(c);
      out.push({ id:Date.now()+Math.random(), label:label[0].toUpperCase()+label.slice(1), amount, cat, date:ymdLocal() });
    });
    return out;
  }

  function saveSpend(){
    try{ const p=window.storage.set(SKEY,JSON.stringify(spends),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
  }
  /* ОДНА КНИГА: витрати парсера живуть у finOps з cat і _src:'spend'.
     spendOps() — зріз для екрана витрат. Старий масив spends лишається
     тільки як legacy-сховище до міграції. */
  function spendOps(){ return finOps.filter(o=>o._src==='spend'); }
  function migrateSpendsToFin(){
    if(!Array.isArray(spends)||!spends.length) return;
    let cid=''; try{ ensureCards(); cid=mainCard().id; }catch(_){}
    const seen=new Set(finOps.map(o=>String(o.id)));   // ідемпотентність: id детерміновані
    let ch=false;
    spends.forEach(x=>{
      const id='sp_'+String(x.id||'').replace(/[^0-9a-z.]/gi,'');
      if(!x || !(x.amount>0) || seen.has(id)) return;
      finOps.push({ id, type:'out', amount:x.amount, label:x.label||'Витрата', date:x.date||ymdLocal(), card:cid, cat:x.cat||'other', _src:'spend' });
      ch=true;
    });
    spends=[]; saveSpend();
    if(ch) saveFinOps();
  }
  function spendTotal(){ return spendOps().reduce((s,x)=>s+x.amount,0); }
  function spendSummary(){ return spendOps().length? fmt(spendTotal())+' ₴' : '—'; }

  document.getElementById('spAdd').onclick=()=>{
    const inp=document.getElementById('spInput');
    const parsed=parseLine(inp.value);
    if(!parsed.length){ inp.focus(); return; }
    let cid=''; try{ ensureCards(); cid=mainCard().id; }catch(_){}
    parsed.forEach(p=>finOps.unshift({ id:'sp_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), type:'out', amount:p.amount, label:p.label, date:p.date, card:cid, cat:p.cat, _src:'spend' }));
    inp.value=''; saveFinOps(); renderSpend(); renderDashboard();
  };
  document.getElementById('spInput').addEventListener('keydown',e=>{ if(e.key==='Enter') document.getElementById('spAdd').click(); });

  function delSpend(id){ finOps=finOps.filter(x=>String(x.id)!==String(id)); saveFinOps(); renderSpend(); renderDashboard(); }

  function renderSpend(){
    const list=spendOps();
    const total=spendTotal();
    document.getElementById('spTotal').innerHTML=fmt(total)+' <small>₴</small>';
    document.getElementById('spCount').textContent=list.length;
    document.getElementById('spLogCount').textContent=list.length;

    // category breakdown
    const sums={};
    list.forEach(x=>{ sums[x.cat]=(sums[x.cat]||0)+x.amount; });
    const cats=document.getElementById('spCats');
    const present=CAT_ORDER.filter(k=>sums[k]>0).sort((a,b)=>sums[b]-sums[a]);
    if(!present.length){ cats.innerHTML=''; }
    else{
      cats.innerHTML=present.map(k=>{
        const C=CATS[k], v=sums[k], pct=Math.round(v/total*100);
        return `<div class="catrow" style="--cc:${C.color}">
          <div class="ct"><div class="cn"><span class="ci">${C.emoji}</span>${C.name}<span class="cp">${pct}%</span></div>
          <div class="cv">${fmt(v)} ₴</div></div>
          <div class="catbar"><i style="width:${pct}%"></i></div></div>`;
      }).join('');
    }

    // log
    const log=document.getElementById('spLog');
    if(!list.length){ log.innerHTML=`<div class="empty"><div class="e">🧾</div>Поки що порожньо.<br>Впиши витрати одним рядком вище.</div>`; }
    else{
      log.innerHTML=list.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,40).map(x=>{
        const C=CATS[x.cat]||CATS.other;
        const d=new Date(x.date).toLocaleDateString('uk-UA',{day:'numeric',month:'short'});
        return `<div class="splog" style="--cc:${C.color}">
          <div class="si">${C.emoji}</div>
          <div class="sm"><div class="snm">${esc(x.label)}</div><div class="smeta">${C.name} · ${d}</div></div>
          <div class="sv">${fmt(x.amount)} ₴</div>
          <button class="sx" onclick="delSpend('${x.id}')">×</button></div>`;
      }).join('');
    }

    // tools
    const tools=document.getElementById('spTools');
    tools.innerHTML = list.length
      ? `<button class="toolbtn" onclick="exportSpend()">📋 Скопіювати підсумок для чату</button>
         <button class="toolbtn" onclick="clearSpend()">🗑️ Очистити всі витрати</button>`
      : '';
  }

  function exportSpend(){
    const total=spendTotal(), sums={};
    spendOps().forEach(x=>{ sums[x.cat]=(sums[x.cat]||0)+x.amount; });
    let txt='Витрати, всього '+fmt(total)+' ₴:\n';
    CAT_ORDER.filter(k=>sums[k]>0).sort((a,b)=>sums[b]-sums[a])
      .forEach(k=>{ txt+='- '+CATS[k].name+': '+fmt(sums[k])+' ₴\n'; });
    try{ navigator.clipboard.writeText(txt); }catch(_){}
    const btn=event.target; const old=btn.textContent; btn.textContent='✓ Скопійовано'; setTimeout(()=>btn.textContent=old,1500);
  }
  function clearSpend(){ confirmSheet({title:'Видалити всі витрати?', onOk:()=>{ finOps=finOps.filter(o=>o._src!=='spend'); saveFinOps(); renderSpend(); renderDashboard(); }}); }

