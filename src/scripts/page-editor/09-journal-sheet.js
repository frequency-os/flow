  /* ══════════════════════════════════════════════════════════════════════
     ЩОДЕННИК · аркуш у стилі нотаток + місяць + зведення AI
     Надбудова над наявним віджетом «journal». Дані ті самі:
       b.entries[ymd]  — плоский текст (стрік, прев'ю, експорт, AI)
       b.rich[ymd]     — той самий запис із розміткою (нове)
       b.tags[ymd]     — мітки дня (нове)
       b.reports[key]  — зведення AI (нове)
     Плоский текст лишається джерелом правди для старого коду,
     тому нічого з наявного не ламається.
     ══════════════════════════════════════════════════════════════════════ */
  var JE_Q=[
    'Що вийшло краще, ніж ти очікував?',
    'Що сьогодні забрало найбільше енергії?',
    'Де ти сьогодні відступив від того, що вирішив?',
    'Хто або що вибило тебе з рівноваги?',
    'За що сьогодні можеш себе поважати?',
    'Що ти відкладаєш уже не перший день?',
    'Який момент дня прожив би інакше?'
  ];
  function jeQ(ymd){ var s=0; for(var i=0;i<ymd.length;i++) s=(s*31+ymd.charCodeAt(i))>>>0; return JE_Q[s%JE_Q.length]; }
  var JE_TAGS=[['win','перемога'],['trig','тригер'],['stuck','застряг']];
  /* JR_MON у родовому відмінку («16 серпня»), для шапки місяця потрібен називний */
  var JE_MONN=['Січень','Лютий','Березень','Квітень','Травень','Червень',
               'Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];

  /* ── розмітка ⇄ плоский текст ─────────────────────────────────────── */
  function jeText(html){
    if(!html) return '';
    var d=document.createElement('div'); d.innerHTML=html;
    d.querySelectorAll('.je-chk').forEach(function(n){
      var on=n.classList.contains('on');
      n.textContent=(on?'[x] ':'[ ] ')+(n.querySelector('span')?n.querySelector('span').textContent:n.textContent);
    });
    d.querySelectorAll('br').forEach(function(n){ n.replaceWith('\n'); });
    ['div','p','h2','h3','blockquote','li'].forEach(function(t){
      d.querySelectorAll(t).forEach(function(n){ n.append('\n'); });
    });
    return (d.textContent||'').replace(/\n{3,}/g,'\n\n').trim();
  }
  function jeRich(b,ymd){
    b.rich=b.rich||{};
    if(b.rich[ymd]!=null) return b.rich[ymd];
    var t=(b.entries||{})[ymd]||'';
    if(!t.trim()) return '';
    return t.split('\n').map(function(l){ return '<div>'+esc(l)+'</div>'; }).join('');
  }
  function jeWords(t){ t=(t||'').trim(); return t?t.split(/\s+/).length:0; }
  function jeIsoWeek(d){
    var x=new Date(d.getFullYear(),d.getMonth(),d.getDate());
    x.setDate(x.getDate()+3-((x.getDay()+6)%7));
    var w1=new Date(x.getFullYear(),0,4);
    return 1+Math.round(((x-w1)/86400000-3+((w1.getDay()+6)%7))/7);
  }

  /* ── повноекранний аркуш ───────────────────────────────────────────── */
  var jeCur=null;      /* {id, ymd} */
  var jeSaveT=null;

  function jeOpen(id,ymd){
    var l=locate(id); if(!l) return;
    jeCur={id:id,ymd:ymd};
    var ov=document.createElement('div');
    ov.className='je-ov'; ov.id='jeOv';
    ov.innerHTML=jeShell(l.block,ymd);
    document.body.appendChild(ov);
    requestAnimationFrame(function(){ ov.classList.add('in'); });
    var body=ov.querySelector('#jeBody');
    if(body){
      body.innerHTML=jeRich(l.block,ymd);
      if(!body.textContent.trim()) body.classList.add('empty');
      if(ymd===jrYmd()) setTimeout(function(){ try{ body.focus(); }catch(_){} },260);
    }
    jeViewport();
  }
  function jeClose(){
    jeFlush();
    var ov=document.getElementById('jeOv'); if(!ov) return;
    ov.classList.remove('in');
    setTimeout(function(){ try{ ov.remove(); }catch(_){} jeCur=null; render(); },220);
  }

  function jeShell(b,ymd){
    var d=jrParse(ymd), today=jrYmd();
    var txt=(b.entries||{})[ymd]||'';
    var tags=(b.tags||{})[ymd]||[];
    var meta='Т'+jeIsoWeek(d)+' · '+jeWords(txt)+' сл.';
    var st=jrStreak(b,today); if(st>1) meta+=' · стрік '+st;
    var lbl=JR_WD[d.getDay()]+', '+d.getDate()+' '+JR_MON[d.getMonth()].toLowerCase();
    if(ymd===today) lbl='Сьогодні, '+d.getDate()+' '+JR_MON[d.getMonth()].toLowerCase();
    return ''
    +'<div class="je-hd">'
      +'<button class="je-cir" data-jeback>‹</button>'
      +'<div class="je-caps"><button data-jemic title="Диктувати">🎙</button>'
        +'<button data-jedel title="Очистити">🗑</button></div>'
      +'<button class="je-done" data-jedone>✓</button>'
    +'</div>'
    +'<div class="je-sheet">'
      +'<div class="je-dh">'+esc(lbl)+'</div>'
      +'<div class="je-dm">'+esc(meta)+'</div>'
      +'<div class="je-q">'+esc(jeQ(ymd))+'</div>'
      +'<div class="je-body" id="jeBody" contenteditable="true" data-ph="Пиши як пишеться"></div>'
      +'<div class="je-tags">'+JE_TAGS.map(function(t){
          return '<button class="je-tag'+(tags.indexOf(t[0])>=0?' on':'')+'" data-jetag="'+t[0]+'">'+t[1]+'</button>';
        }).join('')+'</div>'
    +'</div>'
    +'<div class="je-aa" id="jeAa">'
      +'<div class="je-aag">'
        +'<button class="je-aai" data-jefmt="h2"><b style="font-size:16px">Заголовок</b><s>title</s></button>'
        +'<button class="je-aai" data-jefmt="h3"><b style="font-size:13.5px">Підзаголовок</b><s>heading</s></button>'
        +'<button class="je-aai on" data-jefmt="p"><b style="font-weight:500;font-size:12.5px">Основний текст</b><s>body</s></button>'
        +'<button class="je-aai mono" data-jefmt="pre"><b>Моноширинний</b><s>mono</s></button>'
      +'</div>'
      +'<div class="je-aar">'
        +'<button class="je-aab" data-jecmd="bold" style="font-weight:800">B</button>'
        +'<button class="je-aab" data-jecmd="italic" style="font-style:italic">I</button>'
        +'<button class="je-aab" data-jecmd="underline" style="text-decoration:underline">U</button>'
        +'<button class="je-aab" data-jecmd="strikeThrough" style="text-decoration:line-through">S</button>'
      +'</div>'
      +'<div class="je-aar">'
        +'<button class="je-aab" data-jechk>☑</button>'
        +'<button class="je-aab" data-jecmd="insertUnorderedList">•</button>'
        +'<button class="je-aab" data-jecmd="insertOrderedList">1.</button>'
        +'<button class="je-aab" data-jefmt="blockquote">❝</button>'
      +'</div>'
    +'</div>'
    +'<div class="je-tools">'
      +'<button class="je-t aa" data-jeaa>Аа</button>'
      +'<button class="je-t" data-jechk>☑</button>'
      +'<button class="je-t" data-jefmt="blockquote">❝</button>'
      +'<button class="je-t" data-jefmt="h3">H</button>'
      +'<button class="je-t" data-jemic>🎙</button>'
      +'<button class="je-t" data-jeprev>‹</button>'
      +'<button class="je-t" data-jenext>›</button>'
    +'</div>';
  }

  /* панель тримається над клавіатурою */
  function jeViewport(){
    var vv=window.visualViewport; if(!vv) return;
    var fn=function(){
      var ov=document.getElementById('jeOv'); if(!ov) return;
      var gap=Math.max(0,(window.innerHeight-vv.height-vv.offsetTop));
      ov.style.setProperty('--kb',gap+'px');
    };
    vv.addEventListener('resize',fn); vv.addEventListener('scroll',fn); fn();
  }

  function jeFlush(){
    clearTimeout(jeSaveT);
    if(!jeCur) return;
    var body=document.getElementById('jeBody'); if(!body) return;
    var l=locate(jeCur.id); if(!l) return;
    var b=l.block, ymd=jeCur.ymd;
    b.rich=b.rich||{}; b.entries=b.entries||{};
    var html=body.innerHTML;
    b.rich[ymd]=html;
    b.entries[ymd]=jeText(html);
    save();
  }
  function jeQueue(){ clearTimeout(jeSaveT); jeSaveT=setTimeout(jeFlush,600); }

  /* вставка блока з розміткою */
  function jeWrap(tag){
    var body=document.getElementById('jeBody'); if(!body) return;
    body.focus();
    try{
      if(tag==='p') document.execCommand('formatBlock',false,'div');
      else document.execCommand('formatBlock',false,tag);
    }catch(_){}
    jeQueue();
  }
  function jeCheck(){
    var body=document.getElementById('jeBody'); if(!body) return;
    body.focus();
    var row='<div class="je-chk"><i></i><span>&#8203;</span></div>';
    try{ document.execCommand('insertHTML',false,row); }catch(_){}
    jeQueue();
  }

  /* ── місячна сітка ─────────────────────────────────────────────────── */
  function jeMonthHTML(b){
    var id=b.id, e=b.entries||{}, today=jrYmd();
    var cur=b.mcur||today.slice(0,7);
    var y=+cur.slice(0,4), m=+cur.slice(5,7)-1;
    var first=new Date(y,m,1), shift=(first.getDay()+6)%7;
    var days=new Date(y,m+1,0).getDate();
    var cells='';
    for(var i=0;i<shift;i++){
      var pd=new Date(y,m,-(shift-i-1));
      cells+='<div class="je-md off">'+pd.getDate()+'</div>';
    }
    var filled=0;
    for(var d=1;d<=days;d++){
      var ymd=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      var has=((e[ymd]||'').trim())?true:false; if(has)filled++;
      var tg=((b.tags||{})[ymd]||[]);
      cells+='<div class="je-md'+(has?' w':'')+(ymd===today?' td':'')+'" data-jeday="'+id+'|'+ymd+'">'+d
        +(tg.indexOf('trig')>=0?'<u class="tr"></u>':(tg.indexOf('win')>=0?'<u class="wn"></u>':''))+'</div>';
    }
    var st=jrStreak(b,today);
    return '<div class="je-mh"><h3>'+JE_MONN[m]+' '+y+'</h3>'
      +'<div class="je-arr"><button data-jemon="'+id+'|-1">‹</button><button data-jemon="'+id+'|1">›</button></div></div>'
      +'<div class="je-msub">'+filled+' із '+days+' записано'+(st>1?' · 🔥 '+st:'')+'</div>'
      +'<div class="je-mg"><s>пн</s><s>вт</s><s>ср</s><s>чт</s><s>пт</s><s>сб</s><s>нд</s>'+cells+'</div>';
  }

  /* ── зведення AI ───────────────────────────────────────────────────── */
  function jeMon(d){ var x=new Date(d); x.setDate(x.getDate()-((x.getDay()+6)%7)); x.setHours(0,0,0,0); return x; }
  function jeWkKey(d){ return 'w:'+jrYmd(jeMon(d)); }
  function jeMoKey(d){ return 'm:'+d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'); }
  function jeEntries(b,from,to){
    var out=[], e=b.entries||{}, cur=new Date(from);
    while(cur<=to){
      var ymd=jrYmd(cur), t=(e[ymd]||'').trim();
      if(t){
        var tg=((b.tags||{})[ymd]||[]).map(function(k){
          var f=JE_TAGS.filter(function(x){return x[0]===k;})[0]; return f?f[1]:k; });
        out.push('['+ymd+(tg.length?' · '+tg.join(', '):'')+']\n'+t);
      }
      cur=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate()+1);
    }
    return out;
  }
  function jeG(n){ try{ return (0,eval)(n); }catch(_){ return undefined; } }
  function jeFacts(from,to){
    var out=[], RIT=jeG('RIT'), fin=jeG('finOps'), pd=jeG('plData'), pdat=null;
    try{ if(typeof pd==='function') pdat=pd(); }catch(_){}
    var cur=new Date(from);
    while(cur<=to){
      var ymd=jrYmd(cur), bits=[];
      try{ if(RIT&&RIT.days) bits.push('ритуал'+((RIT.days[ymd]||{}).done?'+':'-')); }catch(_){}
      try{ if(Array.isArray(fin)){ var sp=0;
        fin.forEach(function(o){ if(o&&o.type==='out'&&String(o.date||'').slice(0,10)===ymd) sp+=(+o.amount||0); });
        if(sp>0) bits.push('витрати '+Math.round(sp)); } }catch(_){}
      try{ if(pdat&&pdat.blocksByDay&&Array.isArray(pdat.blocksByDay[ymd])){
        var a=pdat.blocksByDay[ymd];
        if(a.length) bits.push('завдання '+a.filter(function(x){return x&&x.done;}).length+'/'+a.length); } }catch(_){}
      if(bits.length) out.push(ymd+': '+bits.join(', '));
      cur=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate()+1);
    }
    return out.join('\n');
  }
  function jePending(b){
    var jobs=[], today=new Date(); today.setHours(0,0,0,0);
    b.reports=b.reports||{};
    var wk=jeMon(today);
    for(var i=1;i<=8;i++){
      var f=new Date(wk); f.setDate(f.getDate()-7*i);
      var t=new Date(f); t.setDate(t.getDate()+6);
      var k=jeWkKey(f);
      if(!b.reports[k] && jeEntries(b,f,t).length>=3) jobs.push({k:k,from:f,to:t,kind:'w'});
    }
    for(var m=1;m<=3;m++){
      var f2=new Date(today.getFullYear(),today.getMonth()-m,1);
      var t2=new Date(today.getFullYear(),today.getMonth()-m+1,0);
      var k2=jeMoKey(f2);
      if(!b.reports[k2] && jeEntries(b,f2,t2).length>=5) jobs.push({k:k2,from:f2,to:t2,kind:'m'});
    }
    jobs.sort(function(a,c){ return a.from-c.from; });
    return jobs;
  }
  var JE_SYS_W='Ти читаєш щоденник людини за тиждень і шукаєш патерни, яких вона сама не бачить. '
    +'Українською, стисло, без лестощів і без моралі. Звертайся на «ти». Формат:\n'
    +'**Патерни** — рівно три пункти через «- », кожен спирається на конкретні дати або збіги.\n'
    +'**Гіпотеза** — одне речення про ймовірну причину.\n'
    +'**Експеримент** — одна конкретна дія на наступний тиждень.\n'
    +'Не більше 130 слів. Якщо даних мало — скажи прямо і не вигадуй.';
  var JE_SYS_M='Ти дивишся на місяць щоденника і на тижневі зведення разом. Не переказуй місяць, '
    +'а порівняй тижні. Українською, на «ти», без лестощів. Формат:\n'
    +'**Зникло** — що перестало зʼявлятись.\n**Тримається** — що повторюється попри те, що щоразу фіксується як помилка.\n'
    +'**Зрушення** — де видно реальну зміну, з датами.\n**Що робити** — одна річ на наступний місяць.\n'
    +'Не більше 180 слів.';
  var jeBusy=false, jeOpenRep=null, jeAutoDone={};

  async function jeGen(b,job){
    if(jeBusy) return;
    var toast=window.__flowToast||function(){};
    var ents=jeEntries(b,job.from,job.to); if(!ents.length) return;
    jeBusy=true; render();
    try{
      var prev='';
      if(job.kind==='m'){
        prev=Object.keys(b.reports||{}).filter(function(k){
          return k.charAt(0)==='w' && k.slice(2)>=jrYmd(job.from) && k.slice(2)<=jrYmd(job.to);
        }).sort().map(function(k){ return '— '+(b.reports[k].t||''); }).join('\n');
      }
      var facts=jeFacts(job.from,job.to);
      var user='ЗАПИСИ:\n'+ents.join('\n\n')
        +(facts?'\n\nФАКТИ З ЗАСТОСУНКУ (ритуал, витрати, завдання):\n'+facts:'')
        +(prev?'\n\nТИЖНЕВІ ЗВЕДЕННЯ ЦЬОГО МІСЯЦЯ:\n'+prev:'');
      var sys=(job.kind==='m')?JE_SYS_M:JE_SYS_W, txt='', raw=window.__flowAiRaw;
      if(typeof raw==='function'){
        var r=await raw({model:(job.kind==='m')?'claude-sonnet-4-6':'claude-haiku-4-5-20251001',
          system:sys,max_tokens:900,messages:[{role:'user',content:user}]});
        txt=(r&&r.content||[]).filter(function(x){return x.type==='text';})
          .map(function(x){return x.text;}).join('\n').trim();
      }else{
        var ac=jeG('aiCall');
        if(typeof ac!=='function') throw new Error('AI недоступний');
        txt=String(await ac(sys,[{role:'user',content:user}])||'').trim();
      }
      if(!txt) throw new Error('порожня відповідь');
      b.reports=b.reports||{};
      b.reports[job.k]={t:txt,n:ents.length,ts:Date.now()};
      save(); toast('📔 Зведення готове');
    }catch(err){ try{ toast('⚠️ Зведення не вдалось: '+String(err.message||err)); }catch(_){} }
    jeBusy=false; render();
  }
  function jeAuto(b){
    if(jeAutoDone[b.id]||jeBusy) return; jeAutoDone[b.id]=true;
    try{ var j=jePending(b); if(j.length) setTimeout(function(){ jeGen(b,j[0]); },1400); }catch(_){}
  }
  function jeMd(t){
    return esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')
      .split('\n').map(function(l){ l=l.trim(); if(!l) return '';
        if(/^[-•]\s+/.test(l)) return '<div class="je-li">'+l.replace(/^[-•]\s+/,'')+'</div>';
        return '<p>'+l+'</p>'; }).join('');
  }
  function jeAiHTML(b){
    jeAuto(b);
    var keys=Object.keys(b.reports||{}).sort().reverse();
    var pend=jePending(b);
    var head='<div class="je-aih"><span>Зведення</span>'
      +'<button class="je-gen" data-jegen="'+b.id+'">'+(jeBusy?'…':'Зібрати')+'</button></div>';
    if(!keys.length){
      return head+'<div class="je-empty">Зʼявляються самі: у неділю за тиждень і першого числа за місяць.'
        +(pend.length?' Готово до збору: '+pend.length+'.':' Потрібно щонайменше три записи за період.')+'</div>';
    }
    return head+keys.map(function(k){
      var r=b.reports[k]||{}, open=(jeOpenRep===k);
      var ttl=(k.charAt(0)==='w')
        ? 'Тиждень з '+k.slice(2).slice(8)+'.'+k.slice(2).slice(5,7)
        : 'Місяць '+k.slice(2);
      return '<div class="je-rep'+(open?' on':'')+'">'
        +'<div class="je-rt" data-jerep="'+k+'"><b>'+ttl+'</b><span>'+(r.n||0)+' зап.</span></div>'
        +(open?'<div class="je-rb">'+jeMd(r.t||'')+'</div>':'')+'</div>';
    }).join('');
  }

  /* ── події ─────────────────────────────────────────────────────────── */
  document.addEventListener('click',function(e){
    var t=e.target; if(!t||!t.closest) return;
    var od=t.closest('[data-jeday]');
    if(od){ e.preventDefault(); var pr=od.dataset.jeday.split('|'); jeOpen(pr[0],pr[1]); return; }
    var mv=t.closest('[data-jemon]');
    if(mv){ e.preventDefault(); var pm=mv.dataset.jemon.split('|'), lm=locate(pm[0]);
      if(lm){ var bb=lm.block, c=(bb.mcur||jrYmd().slice(0,7)).split('-');
        var nd=new Date(+c[0],+c[1]-1+(+pm[1]),1);
        bb.mcur=nd.getFullYear()+'-'+String(nd.getMonth()+1).padStart(2,'0');
        save(); render(); } return; }
    var gn=t.closest('[data-jegen]');
    if(gn){ e.preventDefault(); var lg=locate(gn.dataset.jegen);
      if(lg){ var jb=jePending(lg.block);
        if(!jb.length){ try{ (window.__flowToast||function(){})('Немає завершених періодів із достатньою кількістю записів'); }catch(_){}
        } else jeGen(lg.block,jb[0]); } return; }
    var rp=t.closest('[data-jerep]');
    if(rp){ e.preventDefault(); jeOpenRep=(jeOpenRep===rp.dataset.jerep)?null:rp.dataset.jerep; render(); return; }
    if(t.closest('[data-jeback]')||t.closest('[data-jedone]')){ e.preventDefault(); jeClose(); return; }
    if(!document.getElementById('jeOv')) return;
    var aa=t.closest('[data-jeaa]');
    if(aa){ e.preventDefault(); var p=document.getElementById('jeAa');
      if(p) p.classList.toggle('on'); aa.classList.toggle('on'); return; }
    var fb=t.closest('[data-jefmt]'); if(fb){ e.preventDefault(); jeWrap(fb.dataset.jefmt); return; }
    var cb=t.closest('[data-jecmd]');
    if(cb){ e.preventDefault(); var body=document.getElementById('jeBody');
      if(body){ body.focus(); try{ document.execCommand(cb.dataset.jecmd,false,null); }catch(_){} jeQueue(); } return; }
    if(t.closest('[data-jechk]')){ e.preventDefault(); jeCheck(); return; }
    var tg=t.closest('[data-jetag]');
    if(tg){ e.preventDefault();
      var l=locate(jeCur&&jeCur.id); if(!l) return;
      var b=l.block; b.tags=b.tags||{};
      var arr=b.tags[jeCur.ymd]=b.tags[jeCur.ymd]||[];
      var k=tg.dataset.jetag, ix=arr.indexOf(k);
      if(ix>=0) arr.splice(ix,1); else arr.push(k);
      tg.classList.toggle('on',ix<0); save(); return; }
    var ck=t.closest('.je-chk');
    if(ck && (t.tagName==='I'||t.closest('i'))){ ck.classList.toggle('on'); jeQueue(); return; }
    var nav=t.closest('[data-jeprev]')||t.closest('[data-jenext]');
    if(nav){ e.preventDefault();
      var step=nav.hasAttribute('data-jeprev')?-1:1;
      var d=jrParse(jeCur.ymd); d.setDate(d.getDate()+step);
      if(jrYmd(d)>jrYmd()) return;
      jeFlush(); var id=jeCur.id, nd=jrYmd(d);
      var ov=document.getElementById('jeOv'); if(ov) ov.remove();
      jeOpen(id,nd); return; }
    if(t.closest('[data-jedel]')){ e.preventDefault();
      var body2=document.getElementById('jeBody');
      if(body2){ body2.innerHTML=''; body2.classList.add('empty'); jeFlush(); } return; }
    var mic=t.closest('[data-jemic]');
    if(mic){ e.preventDefault(); jeMic(mic); return; }
  },true);

  document.addEventListener('input',function(e){
    var b=e.target&&e.target.closest&&e.target.closest('#jeBody');
    if(!b) return;
    b.classList.toggle('empty',!b.textContent.trim());
    jeQueue();
  });

  /* диктування в аркуш */
  var jeRec=null,jeStream=null;
  async function jeMic(btn){
    var toast=window.__flowToast||function(){};
    if(jeRec){ try{ jeRec.stop(); }catch(_){} return; }
    try{
      jeStream=await navigator.mediaDevices.getUserMedia({audio:true});
      var mime=MediaRecorder.isTypeSupported('audio/mp4')?'audio/mp4'
        :(MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'');
      jeRec=new MediaRecorder(jeStream,mime?{mimeType:mime}:undefined);
      var ch=[];
      jeRec.ondataavailable=function(ev){ if(ev.data&&ev.data.size)ch.push(ev.data); };
      jeRec.onstop=async function(){
        try{ jeStream.getTracks().forEach(function(x){x.stop();}); }catch(_){}
        var blob=new Blob(ch,{type:mime||'audio/mp4'});
        jeRec=null; jeStream=null;
        document.querySelectorAll('[data-jemic]').forEach(function(n){ n.classList.remove('live'); });
        if(blob.size<1200){ toast('🎙 Закоротко'); return; }
        var tr=window.__flowTranscribe;
        if(typeof tr!=='function'){ toast('⚠️ Розпізнавання недоступне'); return; }
        var txt=await tr(blob); if(!txt) return;
        var body=document.getElementById('jeBody');
        if(body){ body.focus();
          try{ document.execCommand('insertHTML',false,'<div>'+esc(txt)+'</div>'); }
          catch(_){ body.innerHTML+='<div>'+esc(txt)+'</div>'; }
          body.classList.remove('empty'); jeFlush(); }
      };
      jeRec.start();
      document.querySelectorAll('[data-jemic]').forEach(function(n){ n.classList.add('live'); });
      toast('🎙 Говори — тапни ще раз, щоб зупинити');
    }catch(err){ jeRec=null; toast('⚠️ Мікрофон недоступний'); }
  }
  document.addEventListener('visibilitychange',function(){
    if(document.hidden&&jeRec){ try{ jeRec.stop(); }catch(_){} }
    if(document.hidden) jeFlush();
  });

  // ── публічний вхід ──
  try{ window.__pgRender=render; }catch(_){}
  // opts.focusId — прокрутити до блока й підсвітити (стрибок із Каналу папки)
  window.openFlowPage=function(opts){
    if(!bridge()){ if(window.__show)window.__show('scr-space'); return; }
    applyTheme(savedTheme);
    pgPath=[];
    undoStack.length=0; redoStack.length=0; syncUndoBtn(); // не переносити історію між різними сторінками
    pgTitle.value=bridge().folderName()||'Сторінка';
    render();
    renderCover();
    cdTick();
    if(window.__show)window.__show('scr-page');
    var fid=opts&&opts.focusId;
    if(fid){
      // __show скидає прокрутку ще й через 80 мс — стрибаємо після цього
      setTimeout(function(){
        try{
          var el=editor.querySelector('.pgb[data-id="'+String(fid).replace(/["\\]/g,'')+'"]');
          if(!el) return;
          el.scrollIntoView({block:'center'});
          el.classList.add('pg-flash');
          setTimeout(function(){ el.classList.remove('pg-flash'); },1600);
        }catch(_){}
      },140);
    }
  };
})();
