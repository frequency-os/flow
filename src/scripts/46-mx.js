
(function(){
"use strict";
try{
  if(window.__fd26Mx) return; window.__fd26Mx=true;

  var QK=['q1','q2','q3','q4'];
  var QMETA={
    q1:{lbl:'Важл+Терм', full:'Важливо + терміново', s:'Гаси',                c:'#ff6b7d', em:'🔥'},
    q2:{lbl:'Важливо',   full:'Важливо',             s:'Плануй',              c:'#8b7cff', em:'🎯'},
    q3:{lbl:'Терміново', full:'Терміново',           s:'Швидко або делегуй',  c:'#f0b429', em:'⚡'},
    q4:{lbl:'Потім',     full:'Потім',               s:'Мінімізуй',           c:'#6f7890', em:'💤'}
  };
  var DN=["Нд","Пн","Вт","Ср","Чт","Пт","Сб"];
  var MN=["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"];
  function esc2(s){ try{ return esc(s); }catch(_){ return String(s==null?'':s); } }
  function escA(s){ try{ return escAttr(s); }catch(_){ return String(s==null?'':s).replace(/"/g,'&quot;'); } }
  function toast(m){ try{ plToast(m); }catch(_){} }
  function dsel(){ try{ var p=plData(); return p.selDate||plTodayStr(); }catch(_){ return ''; } }
  function dateLbl(){ try{ var ds=dsel(); var o=new Date(ds+"T12:00:00");
    return (ds===plTodayStr()?"Сьогодні · ":"")+DN[o.getDay()]+", "+o.getDate()+" "+MN[o.getMonth()]; }catch(_){ return ''; } }
  function folMeta(k){ try{ var f=(typeof folders!=='undefined')&&folders[k];
    if(f) return {em:f.emoji||'📁', name:f.name||k}; }catch(_){} return null; }

  /* ── висота клавіатури → --fdkb (щоб поле вводу не ховалось) ── */
  if(window.visualViewport && !window.__fdKbFix){
    window.__fdKbFix=1;
    var vv=window.visualViewport;
    var updKb=function(){ try{
      var kb=Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      document.documentElement.style.setProperty('--fdkb', (kb>80?kb:0)+'px');
    }catch(_){} };
    vv.addEventListener('resize',updKb); vv.addEventListener('scroll',updKb); updKb();
  }
  /* фокус у полі всередині повноекранних вікон — підкрутити його у видиму зону */
  document.addEventListener('focusin',function(e){
    try{
      var t=e.target; if(!t||!t.closest) return;
      if(!t.matches('input,textarea')) return;
      if(!t.closest('.fdx,.fd-cab')) return;
      setTimeout(function(){ try{ t.scrollIntoView({block:'center',behavior:'smooth'}); }catch(_){} },260);
    }catch(_){}
  });

  var curQ='q1', moreId=null, el=null;

  function shell(){
    var e=document.getElementById('fdxWin');
    if(!e){
      e=document.createElement('div'); e.id='fdxWin'; e.className='fdx';
      e.innerHTML=
        '<div class="fdx-h"><button class="fdx-back" id="fdxBack" aria-label="Назад">‹</button>'+
          '<div class="fdx-t"><b>Матриця · що важливе</b><small id="fdxDate">—</small></div></div>'+
        '<div class="fdx-b" id="fdxBody">'+
          '<div class="fdx-tabs" id="fdxTabs"></div>'+
          '<div class="fdx-add"><input id="fdxIn" placeholder="Нова задача" enterkeyhint="done" '+
            'autocomplete="off" autocapitalize="sentences" spellcheck="true"><button class="go" id="fdxGo">＋</button></div>'+
          '<div id="fdxList"></div>'+
          '<div class="fdx-foot" id="fdxFoot"></div>'+
          '<div class="fdx-hint">Тап по тексту — виконано · ⇄ — перекинути в інший квадрат · '+
            '🕐 — блоком у розклад · довгий тап — папка та «у задачі дня». '+
            '<b>Правило: q1 гасиш, q2 плануєш першим.</b></div>'+
        '</div>';
      document.body.appendChild(e);
      e.querySelector('#fdxBack').onclick=close;
      e.querySelector('#fdxGo').onclick=addFromInput;
      e.querySelector('#fdxIn').addEventListener('keydown',function(ev){ if(ev.key==='Enter'){ ev.preventDefault(); addFromInput(); } });
    }
    return e;
  }
  function open(q){
    curQ=QMETA[q]?q:'q1'; moreId=null;
    el=shell(); el.classList.add('on');
    el.querySelector('#fdxDate').textContent=dateLbl();
    paint();
    setTimeout(function(){ try{ var i=el.querySelector('#fdxIn'); if(i) i.focus(); }catch(_){} },260);
  }
  function close(){
    try{ if(el) el.classList.remove('on'); }catch(_){}
    moreId=null;
    try{ document.documentElement.style.setProperty('--fdkb','0px'); }catch(_){}
    try{ plRerender(); }catch(_){}
  }
  window.fdMxOpen=open;

  function list(){ var p=plData(); if(!Array.isArray(p.matrix[curQ])) p.matrix[curQ]=[]; return p.matrix[curQ]; }
  function find(id){ return list().find(function(x){ return String(x.id)===String(id); }); }

  function addFromInput(){
    if(!el) return;
    var inp=el.querySelector('#fdxIn'); if(!inp) return;
    var v=(inp.value||'').trim(); if(!v) return;
    list().push({id:'m_'+Date.now(), t:v, done:false});
    inp.value='';
    try{ saveGoals(); }catch(_){}
    paint();                       /* перемальовуємо тільки список — фокус і клавіатура лишаються */
    try{ inp.focus(); }catch(_){}
  }

  /* ── малюємо тільки таби + список + футер (поле вводу не чіпаємо) ── */
  function paint(){
    if(!el||!el.classList.contains('on')) return;
    var p=plData(), meta=QMETA[curQ], items=list();
    el.style.setProperty('--tc',meta.c);

    el.querySelector('#fdxTabs').innerHTML=QK.map(function(k){
      var n=(p.matrix[k]||[]).filter(function(i){ return !i.done; }).length;
      return '<button class="'+(k===curQ?'on':'')+'" style="--tc:'+QMETA[k].c+'" data-fdxq="'+k+'">'+
        QMETA[k].em+' '+esc2(QMETA[k].lbl)+' · '+n+'</button>';
    }).join('');

    el.querySelector('#fdxList').innerHTML=items.length? items.map(function(it){
      var fm=it.folder?folMeta(it.folder):null;
      var more='';
      if(String(moreId)===String(it.id)){
        var mv=QK.filter(function(k){ return k!==curQ; }).map(function(k){
          return '<button data-fdxmv="'+escA(it.id)+'|'+k+'">'+QMETA[k].em+' '+esc2(QMETA[k].lbl)+'</button>'; }).join('');
        var fols='';
        try{
          if(typeof folders!=='undefined'){
            var keys=(typeof orderedFolderKeys==='function')?orderedFolderKeys():Object.keys(folders);
            fols=keys.filter(function(k){ return !!folders[k]; }).slice(0,6).map(function(k){
              return '<button data-fdxfol="'+escA(it.id)+'|'+escA(k)+'">'+(folders[k].emoji||'📁')+' '+esc2(folders[k].name||k)+'</button>'; }).join('');
          }
        }catch(_){}
        more='<div class="fdx-more"><button data-fdxday="'+escA(it.id)+'">☀ У задачі дня</button>'+mv+fols+
          (it.folder?'<button data-fdxfol="'+escA(it.id)+'|">📁 прибрати папку</button>':'')+
          '<button class="del" data-fdxdel="'+escA(it.id)+'">Видалити</button></div>';
      }
      return '<div class="fdx-it'+(it.done?' done':'')+'" data-fdxrow="'+escA(it.id)+'">'+
          '<button class="fdx-ck" data-fdxck="'+escA(it.id)+'">✓</button>'+
          '<div class="fdx-tx" data-fdxck="'+escA(it.id)+'">'+esc2(it.t)+
            (fm?'<br><span class="fol">'+fm.em+' '+esc2(fm.name)+'</span>':'')+'</div>'+
          '<div class="fdx-act">'+
            '<button data-fdxmv2="'+escA(it.id)+'" title="В інший квадрат">⇄</button>'+
            '<button data-fdxsch="'+escA(it.id)+'" title="Блоком у розклад">🕐</button>'+
            '<button data-fdxdel="'+escA(it.id)+'" title="Видалити">✕</button>'+
          '</div></div>'+more;
    }).join('') : '<div class="fdx-empty">Порожньо. Додай задачу — вона привʼяжеться до цього дня.</div>';

    var anyDone=items.some(function(i){ return i.done; });
    el.querySelector('#fdxFoot').innerHTML=anyDone?'<button data-fdxclr>Прибрати виконані</button>':'';
    bind();
  }

  function bind(){
    var q=function(s){ return el.querySelectorAll(s); };
    q('[data-fdxq]').forEach(function(b){ b.onclick=function(){ curQ=b.dataset.fdxq; moreId=null; paint(); }; });
    q('[data-fdxck]').forEach(function(b){ b.onclick=function(){
      var it=find(b.dataset.fdxck); if(!it) return; it.done=!it.done;
      try{ saveGoals(); }catch(_){} paint(); }; });
    q('[data-fdxmv2]').forEach(function(b){ b.onclick=function(ev){ ev.stopPropagation();
      var it=find(b.dataset.fdxmv2); if(!it) return;
      var p=plData(), nx=QK[(QK.indexOf(curQ)+1)%4];
      p.matrix[curQ]=p.matrix[curQ].filter(function(x){ return x!==it; });
      if(!Array.isArray(p.matrix[nx])) p.matrix[nx]=[];
      p.matrix[nx].push(it); curQ=nx; moreId=null;
      try{ saveGoals(); }catch(_){} paint(); toast(QMETA[nx].em+' → '+QMETA[nx].lbl); }; });
    q('[data-fdxmv]').forEach(function(b){ b.onclick=function(){
      var pr=b.dataset.fdxmv.split('|'), it=find(pr[0]); if(!it) return;
      var p=plData();
      p.matrix[curQ]=p.matrix[curQ].filter(function(x){ return x!==it; });
      if(!Array.isArray(p.matrix[pr[1]])) p.matrix[pr[1]]=[];
      p.matrix[pr[1]].push(it); curQ=pr[1]; moreId=null;
      try{ saveGoals(); }catch(_){} paint(); toast(QMETA[pr[1]].em+' Перенесено'); }; });
    q('[data-fdxsch]').forEach(function(b){ b.onclick=function(ev){ ev.stopPropagation();
      var id=b.dataset.fdxsch; close();
      setTimeout(function(){ try{ plMxSchedule(curQ,id); }catch(e){ console.error('fdx sch',e); } },120); }; });
    q('[data-fdxday]').forEach(function(b){ b.onclick=function(){
      var it=find(b.dataset.fdxday); if(!it) return;
      var p=plData(), cols=['val','hab','fin','skl','cyan','gold'];
      p.tasks.push({id:'t_'+Date.now(), scope:'day', t:it.t, c:cols[p.tasks.length%cols.length],
        p:(curQ==='q1'?1:(curQ==='q2'?2:3)), tag:'', done:false, open:false, subs:[]});
      moreId=null; try{ saveGoals(); }catch(_){} paint(); toast('☀ У задачі дня'); }; });
    q('[data-fdxfol]').forEach(function(b){ b.onclick=function(){
      var i=b.dataset.fdxfol.indexOf('|'), it=find(b.dataset.fdxfol.slice(0,i)); if(!it) return;
      var k=b.dataset.fdxfol.slice(i+1);
      if(k) it.folder=k; else delete it.folder;
      moreId=null; try{ saveGoals(); }catch(_){} paint(); }; });
    q('[data-fdxdel]').forEach(function(b){ b.onclick=function(ev){ ev.stopPropagation();
      var it=find(b.dataset.fdxdel); if(!it) return;
      var p=plData(); p.matrix[curQ]=p.matrix[curQ].filter(function(x){ return x!==it; });
      moreId=null; try{ saveGoals(); }catch(_){} paint(); }; });
    var clr=el.querySelector('[data-fdxclr]');
    if(clr) clr.onclick=function(){
      var p=plData(); p.matrix[curQ]=(p.matrix[curQ]||[]).filter(function(i){ return !i.done; });
      try{ saveGoals(); }catch(_){} paint(); };
    /* довгий тап по рядку — додаткові дії */
    q('[data-fdxrow]').forEach(function(row){
      var tm=null, id=row.dataset.fdxrow;
      var start=function(){ clearTimeout(tm); tm=setTimeout(function(){
        moreId=(String(moreId)===String(id))?null:id; paint();
        try{ window.platform.haptic('medium'); }catch(_){}
      },500); };
      var stop=function(){ clearTimeout(tm); };
      row.addEventListener('touchstart',start,{passive:true});
      row.addEventListener('touchend',stop); row.addEventListener('touchmove',stop);
      row.addEventListener('mousedown',start); row.addEventListener('mouseup',stop);
      row.addEventListener('mouseleave',stop);
    });
  }

  /* тап по квадрату в планері відкриває вікно (крім кнопок усередині) */
  document.addEventListener('click',function(e){
    try{
      var t=e.target;
      if(t.closest&&(t.closest('[data-mxadd]')||t.closest('[data-mxdone]')||t.closest('[data-mxsch]'))) return;
      var mq=t.closest&&t.closest('.pl-mq');
      if(!mq) return;
      var k=QK.filter(function(x){ return mq.classList.contains(x); })[0];
      if(k) open(k);
    }catch(err){ console.error('fdx open',err); }
  },false);
}catch(e){ console.error('fd26js-mx',e); }
})();
