
(function(){
"use strict";
try{
  if(window.__fdPl26) return; window.__fdPl26=true;
  var DN=["Нд","Пн","Вт","Ср","Чт","Пт","Сб"];
  var MN=["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"];
  function fdDs(){ try{ var p=plData(); return p.selDate||plTodayStr(); }catch(_){ return ''; } }
  function fdBlockById(id){ try{ return (plBlocksFor(fdDs())||[]).find(function(b){return String(b.id)===String(id)}); }catch(_){ return null; } }
  function fdDateLbl(){ try{ var ds=fdDs(); var o=new Date(ds+"T12:00:00");
    return (ds===plTodayStr()?"Сьогодні · ":"")+DN[o.getDay()]+", "+o.getDate()+" "+MN[o.getMonth()]; }catch(_){ return ''; } }

  /* ══ Кабіна блоку (G) ══ */
  var fdCabId=null;
  function fdCabinEl(){
    var el=document.getElementById('fdCabin');
    if(!el){ el=document.createElement('div'); el.id='fdCabin'; el.className='fd-cab'; document.body.appendChild(el); }
    return el;
  }
  window.fdOpenCabin=function(bid){ try{ fdCabId=bid; fdCabinEl().classList.add('on'); fdDrawCabin(); }catch(e){ console.error('fdOpenCabin',e); } };
  function fdCloseCabin(){ try{ var el=document.getElementById('fdCabin'); if(el) el.classList.remove('on'); fdCabId=null; plRerender(); }catch(_){} }
  function fdDrawCabin(){
    var b=fdBlockById(fdCabId); var el=fdCabinEl();
    if(!b){ fdCloseCabin(); return; }
    if(!Array.isArray(b.subtasks)) b.subtasks=[];
    var cc=(typeof PL_COL!=='undefined'&&PL_COL[b.c])||'#5b8def';
    var end=plBlockEnd(b), eh=Math.min(end,24);
    var isToday=fdDs()===plTodayStr();
    var now=new Date(); var nowDec=now.getHours()+now.getMinutes()/60;
    var live=isToday&&nowDec>=b.h&&nowDec<eh;
    var p=live?((nowDec-b.h)/(Math.max(.1,eh-b.h))):(b.done?1:0);
    var dn=b.subtasks.filter(function(s){return s.done}).length;
    var fkeys=(typeof order!=='undefined'&&Array.isArray(order))?order:Object.keys(typeof folders!=='undefined'?folders:{});
    var chips='<button class="'+(!b.folder?'on':'')+'" style="--fc:#6f7890" data-fdfol="">— без папки</button>'+
      fkeys.filter(function(k){return !!folders[k]}).map(function(k){ var f=folders[k];
        return '<button class="'+(b.folder===k?'on':'')+'" style="--fc:'+(f.c||'#8b7cff')+'" data-fdfol="'+escAttr(k)+'">'+(f.emoji||'📁')+' '+esc(f.name||k)+'</button>';
      }).join('');
    var tds=b.subtasks.map(function(s,i){ var txt=s.text||s.t||'';
      return '<div class="fd-tdrow'+(s.done?' dn':'')+'"><button class="ck" data-fdtd="'+i+'">✓</button><div class="tt" data-i18n-skip="1">'+esc(txt)+'</div><button class="del" data-fdtddel="'+i+'">✕</button></div>';
    }).join('');
    var prog=b.subtasks.length?'<div class="fd-tdprog"><i style="width:'+(dn/b.subtasks.length*100)+'%"></i></div>':'';
    el.innerHTML=
      '<div class="fd-cab-h"><button class="fd-cab-back" id="fdCabBack">‹</button>'+
        '<div class="fd-cab-t"><b>'+esc(b.t)+'</b><small>'+fdDateLbl()+'</small></div></div>'+
      '<div class="fd-cab-b">'+
        '<div class="fd-cab-hero" style="--bc:'+cc+'"><h3>'+esc(b.t)+'</h3>'+
          '<div class="sub">'+plHM(b.h)+'–'+plHM(eh)+(end>24?' (→ наст. день)':'')+(live?(' · іде зараз · '+Math.round(p*100)+'%'):(b.done?' · виконано ✓':''))+'</div>'+
          '<div class="bar"><i style="width:'+(p*100).toFixed(1)+'%"></i></div></div>'+
        '<div class="fd-sec"><div class="sh">📁 Папка / проєкт</div><div class="fd-fchips">'+chips+'</div></div>'+
        '<div class="fd-sec"><div class="sh">☑ Туду блоку <span class="r">'+dn+'/'+b.subtasks.length+'</span></div>'+prog+
          (tds||'<div style="font-size:12px;color:var(--muted,#8f8aa8);font-weight:700">Поки порожньо — додай перший крок.</div>')+
          '<div class="fd-addrow"><input id="fdTdNew" placeholder="Новий пункт" enterkeyhint="done"><button class="go" id="fdTdGo">＋</button></div></div>'+
        '<div class="fd-sec"><div class="sh">📝 Нотатка блоку</div><textarea class="fd-note" id="fdNote" placeholder="Все важливе про цей блок…"></textarea></div>'+
        '<div class="fd-cab-acts">'+
          '<button class="fd-cab-done" id="fdCabDone">'+(b.done?'↺ Не виконано':'✓ Виконано')+'</button>'+
          '<button class="fd-cab-edit" id="fdCabEdit">⚙️ Час і налаштування</button></div>'+
      '</div>';
    document.getElementById('fdCabBack').onclick=fdCloseCabin;
    el.querySelectorAll('[data-fdfol]').forEach(function(x){ x.onclick=function(){
      var k=x.dataset.fdfol; if(k){ b.folder=k; } else { delete b.folder; }
      saveGoals(); fdDrawCabin(); }; });
    el.querySelectorAll('[data-fdtd]').forEach(function(x){ x.onclick=function(){
      var s=b.subtasks[+x.dataset.fdtd]; if(s){ s.done=!s.done; saveGoals(); fdDrawCabin(); } }; });
    el.querySelectorAll('[data-fdtddel]').forEach(function(x){ x.onclick=function(){
      b.subtasks.splice(+x.dataset.fdtddel,1); saveGoals(); fdDrawCabin(); }; });
    var tg=document.getElementById('fdTdGo'), ti=document.getElementById('fdTdNew');
    tg.onclick=function(){ var v=(ti.value||'').trim(); if(!v) return;
      b.subtasks.push({text:v,done:false}); saveGoals(); fdDrawCabin();
      setTimeout(function(){ var n=document.getElementById('fdTdNew'); if(n) n.focus(); },60); };
    ti.addEventListener('keydown',function(e){ if(e.key==='Enter') tg.click(); });
    var nt=document.getElementById('fdNote'); nt.value=b.note||'';
    nt.onchange=function(){ b.note=nt.value; saveGoals(); };
    document.getElementById('fdCabDone').onclick=function(){
      try{ if(typeof plCompleteBlock==='function'){ plCompleteBlock(b.id); } else { b.done=!b.done; saveGoals(); } }catch(_){ b.done=!b.done; saveGoals(); }
      setTimeout(fdDrawCabin,80);
    };
    document.getElementById('fdCabEdit').onclick=function(){
      var id=b.id; fdCloseCabin(); setTimeout(function(){ try{ plEditBlock(id); }catch(_){} },90);
    };
  }

  /* ══ пост-рендер планера ══ */
  function fdEnhance(c){
    var p=plData(); if(p.scope!=='day') return;
    /* 1) матриця важливого — над «Зараз» */
    try{
      var ml=c.querySelector('[data-plcoll="mx"]');
      var anchor=c.querySelector('.pl-nowcard')||c.querySelector('.pl-nownext')||c.querySelector('.pl-rollover')||c.querySelector('.pl-flow');
      if(ml&&anchor&&anchor.parentNode){
        var mx=c.querySelector('.pl-mx'); var mclr=c.querySelector('[data-mxclear]');
        var frag=document.createDocumentFragment();
        frag.appendChild(ml); if(mx) frag.appendChild(mx); if(mclr) frag.appendChild(mclr);
        anchor.parentNode.insertBefore(frag,anchor);
      }
    }catch(_){}
    /* 2) тап по блоку стрічки → Кабіна */
    c.querySelectorAll('[data-plblk]').forEach(function(el){
      el.onclick=function(){ window.fdOpenCabin(el.dataset.plblk); };
    });
    /* 3) нау-кард: міні-чіпи + тап → Кабіна */
    try{
      var nc=c.querySelector('.pl-nowcard');
      if(nc&&!nc.__fd){
        var info=plNowInfo(); var b=info&&info.cur;
        if(b){
          nc.__fd=1;
          if(!Array.isArray(b.subtasks)) b.subtasks=[];
          var dn=b.subtasks.filter(function(s){return s.done}).length;
          var chips='';
          if(b.folder&&typeof folders!=='undefined'&&folders[b.folder]){ var f=folders[b.folder];
            chips+='<span class="fd-ncchip fd-ncfol" style="--fc:'+(f.c||'#8b7cff')+'">'+(f.emoji||'📁')+' '+esc(f.name||'Папка')+'</span>'; }
          if(b.subtasks.length) chips+='<span class="fd-ncchip">☑ '+dn+'/'+b.subtasks.length+'</span>';
          if(b.note) chips+='<span class="fd-ncchip">📝 нотатка</span>';
          chips+='<span class="fd-ncchip fd-nchint">відкрити ›</span>';
          var div=document.createElement('div'); div.className='fd-ncmini'; div.innerHTML=chips;
          nc.appendChild(div);
          nc.classList.add('fd-nctap');
          nc.addEventListener('click',function(e){ if(e.target.closest('button')) return; window.fdOpenCabin(b.id); });
        }
      }
    }catch(_){}
  }

  var _rp=window.renderPlanner;
  if(typeof _rp==='function'){
    window.renderPlanner=function(c){ _rp(c); try{ fdEnhance(c); }catch(e){ console.error('fdEnhance',e); } };
  }
  /* якщо кабіна відкрита — жити з оновленнями */
  setInterval(function(){ try{
    var el=document.getElementById('fdCabin');
    if(el&&el.classList.contains('on')&&fdCabId&&document.activeElement&&document.activeElement.tagName!=='TEXTAREA'&&document.activeElement.tagName!=='INPUT') fdDrawCabin();
  }catch(_){} },60000);
}catch(e){ console.error('fd26js-planner',e); }
})();
