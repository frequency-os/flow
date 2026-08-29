  /* ═══════════ ВІДЖЕТ «ХАБ ПРОЄКТІВ» (список карток, варіант A) ═══════════ */
  var phOpen={}, phStepAdd={}, phPick={};
  var PH_COLORS=['#7c8cff','#34c77b','#f0b429','#ff6b9d','#4ecdc4','#a78bfa'];
  function phHTML(b){
    var id=b.id; b.projects=b.projects||[];
    var mode=b.pmode==='half'?'half':'full';
    var br=bridge();
    var active=b.projects.length;
    var todayProg=0;

    var head='<div class="jr-top"><span class="jr-ic ph-ic">'+pgsIc('phub')+'</span>'
      +'<div class="jr-tt pg-empty" contenteditable="true" data-ph="Мої проєкти" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
      +'<div class="jr-mode">'
      +'<button class="'+(mode==='full'?'on':'')+'" data-phmode="'+id+'|full">Повний</button>'
      +'<button class="'+(mode==='half'?'on':'')+'" data-phmode="'+id+'|half">Напів</button></div></div>';

    if(mode==='half'){
      var avg=active?Math.round(b.projects.reduce(function(s,p){return s+ptProgress(p).pct;},0)/active):0;
      return '<div class="pg-content"><div class="jr ph" data-jrwrap="'+id+'">'+head
        +'<div class="pt-half">'+active+' проєкт'+(active===1?'':active<5?'и':'ів')+' · середній прогрес '+avg+'%</div>'
        +'<div class="jr-foot"><span class="jr-chip">'+active+' активн'+(active===1?'ий':'і')+'</span></div></div></div>';
    }

    var rows=b.projects.map(function(p,idx){
      p.steps=p.steps||[];
      var c=p.color||PH_COLORS[idx%PH_COLORS.length];
      var pr=ptProgress(p);
      var linkName=p.link&&br&&br.folderName?br.folderName(p.link):'';
      var opened=phOpen[id+'|'+p.id];
      if(pr.pct>0) todayProg++;

      var badge = p.link
        ? '<span class="ph-lk"><svg viewBox="0 0 24 24"><path d="M9 15 15 9M8 12a3 3 0 0 1 0-4l1-1a3 3 0 0 1 4 4M16 12a3 3 0 0 1 0 4l-1 1a3 3 0 0 1-4-4" stroke-linecap="round"/></svg>Папка «'+esc(linkName||'?')+'»</span>'
        : '<span class="ph-nofold">без папки</span>';

      var meta = pr.total
        ? pr.done+' з '+pr.total+' кроків'+(pr.fTot?' · '+pr.fDone+'/'+pr.fTot+' у папці':'')
        : 'ще без кроків';

      var row='<div class="ph-row" data-phrow="'+id+'|'+p.id+'">'
        +'<span class="ph-emo" style="--pc:'+c+'" data-phemo="'+id+'|'+p.id+'">'+(p.emoji||'🎯')+'</span>'
        +'<div class="ph-body"><div class="ph-name">'+esc(p.name||'Проєкт')+'  '+badge+'</div>'
        +'<div class="ph-bar"><i style="width:'+pr.pct+'%;background:'+c+'"></i></div>'
        +'<div class="ph-meta">'+meta+'</div></div>'
        +'<span class="ph-pct" style="color:'+c+'">'+pr.pct+'%</span></div>';

      var panel='';
      if(opened){
        var stepsHTML=p.steps.map(function(s){
          return '<div class="jt-row"><button class="jt-cb'+(s.done?' on':'')+'" data-phstep="'+id+'|'+p.id+'|'+s.id+'" style="'+(s.done?'--sc:'+c:'')+'"></button>'
            +'<span class="jt-t'+(s.done?' done':'')+'">'+esc(s.t)+'</span>'
            +'<button class="jt-x" data-phstepdel="'+id+'|'+p.id+'|'+s.id+'">✕</button></div>';
        }).join('');
        var stepAdd=phStepAdd[id+'|'+p.id]
          ? '<input class="jt-in" data-phstepinput="'+id+'|'+p.id+'" placeholder="Крок плану… (Enter)" autocomplete="off">'
          : '<button class="jt-add" data-phstepadd="'+id+'|'+p.id+'">＋ крок</button>';
        var linkCtl = p.link
          ? '<button class="ph-unlink" data-phunlink="'+id+'|'+p.id+'">🔗 «'+esc(linkName)+'» — відв\u2019язати</button>'
          : (phPick[id+'|'+p.id]
              ? '<div class="pt-picker">'+((br&&br.folderList?br.folderList():[]).map(function(f){
                  return '<button class="pt-pick-i" data-phlink="'+id+'|'+p.id+'|'+f.key+'"><span>'+(f.emoji||'📁')+'</span>'+esc(f.name)+'</button>';
                }).join('')||'<div class="pt-none">Немає папок</div>')
                +'<button class="pt-pick-x" data-phpickclose="'+id+'|'+p.id+'">Скасувати</button></div>'
              : '<button class="pt-linkbtn" data-phpick="'+id+'|'+p.id+'"><svg viewBox="0 0 24 24"><path d="M9 15 15 9M8 12a3 3 0 0 1 0-4l1-1a3 3 0 0 1 4 4M16 12a3 3 0 0 1 0 4l-1 1a3 3 0 0 1-4-4" stroke-linecap="round"/></svg> Прив\u2019язати папку</button>');
        panel='<div class="ph-panel">'
          +'<input class="ph-rename" data-phname="'+id+'|'+p.id+'" value="'+esc(p.name||'')+'" placeholder="Назва проєкту">'
          +linkCtl
          +'<div class="pt-sec" style="margin-top:10px">План</div>'
          +'<div class="pt-caps">'+stepsHTML+'<div class="jt-addwrap">'+stepAdd+'</div></div>'
          +'<button class="ph-del" data-phdel="'+id+'|'+p.id+'">Видалити проєкт</button></div>';
      }
      return row+panel;
    }).join('');

    var foot='<div class="jr-foot"><span class="jr-chip">Сьогодні прогрес у '+todayProg+' проєкт'+(todayProg===1?'і':'ах')+'</span>'
      +'<button class="jr-expico" data-phexport="'+id+'" title="Експорт для Claude">'
      +'<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0 4.5-4.5M12 15 7.5 10.5M4.5 19.5h15" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';

    return '<div class="pg-content"><div class="jr ph" data-jrwrap="'+id+'">'+head
      +'<div class="ph-list">'+rows+'</div>'
      +'<button class="ph-addp" data-phadd="'+id+'">＋ Новий проєкт</button>'+foot+'</div></div>';
  }
  function phExport(b){
    var md='# '+(b.title||'Мої проєкти')+'\n\n', br=bridge();
    (b.projects||[]).forEach(function(p){
      var pr=ptProgress(p);
      md+='## '+(p.emoji||'')+' '+(p.name||'Проєкт')+' — '+pr.pct+'%\n\n';
      if(p.link&&br&&br.folderName) md+='- Папка: '+br.folderName(p.link)+' ('+pr.fDone+'/'+pr.fTot+' задач)\n';
      (p.steps||[]).forEach(function(s){ md+='- ['+(s.done?'x':' ')+'] '+s.t+'\n'; });
      md+='\n';
    });
    var name='projects-'+jrYmd()+'.md';
    try{ var file=new File([md],name,{type:'text/markdown'});
      if(navigator.canShare&&navigator.canShare({files:[file]})){ navigator.share({files:[file],title:name}); return; } }catch(_){}
    try{ var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));
      a.download=name; document.body.appendChild(a); a.click();
      setTimeout(function(){ try{URL.revokeObjectURL(a.href);a.remove();}catch(_){} },1000);
    }catch(_){ try{ prompt('Скопіюй проєкти:',md); }catch(__){} }
  }

  function pgFileIc(name){
    var ext=(name.split('.').pop()||'').toLowerCase();
    if(/pdf/.test(ext))return '📕'; if(/docx?|pages/.test(ext))return '📘';
    if(/xlsx?|csv|numbers/.test(ext))return '📗'; if(/pptx?|key/.test(ext))return '📙';
    if(/zip|rar|7z/.test(ext))return '🗜️'; if(/mp3|wav|m4a/.test(ext))return '🎵';
    if(/mp4|mov|avi/.test(ext))return '🎬'; if(/png|jpe?g|gif|webp|heic/.test(ext))return '🖼️';
    return '📄';
  }
  function currentPtKey(id){ var l=locate(id); return l?(l.block.link||''):''; }
  function ptExport(b){
    var pr=ptProgress(b), br=bridge();
    var md='# Проєкт: '+(b.title||'')+'\n\n';
    md+='- Прогрес: '+pr.pct+'% ('+pr.done+'/'+pr.total+' кроків)\n';
    if(b.link&&br&&br.folderName) md+='- Прив\u2019язана папка: '+br.folderName(b.link)+' ('+pr.fDone+'/'+pr.fTot+' задач)\n';
    md+='\n## План\n\n';
    (b.steps||[]).forEach(function(s){ md+='- ['+(s.done?'x':' ')+'] '+s.t+'\n'; });
    md+='\n## Звички\n\n';
    (b.habits||[]).forEach(function(h){
      var days=Object.keys(h.marks||{}).filter(function(k){return h.marks[k];}).length;
      md+='- '+(h.emoji||'')+' '+h.name+' — серія '+ptHabStreak(h.marks||{})+' дн., всього '+days+' днів\n';
    });
    var name='project-'+(b.title||'flow').replace(/\s+/g,'-').toLowerCase()+'.md';
    try{ var file=new File([md],name,{type:'text/markdown'});
      if(navigator.canShare&&navigator.canShare({files:[file]})){ navigator.share({files:[file],title:name}); return; } }catch(_){}
    try{ var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));
      a.download=name; document.body.appendChild(a); a.click();
      setTimeout(function(){ try{URL.revokeObjectURL(a.href);a.remove();}catch(_){} },1000);
    }catch(_){ try{ prompt('Скопіюй проєкт:',md); }catch(__){} }
  }

  function jrExport(b){
    var e=b.entries||{}, td=b.todos||{};
    var days=Object.keys(e).concat(Object.keys(td)).filter(function(k,i,a){return a.indexOf(k)===i;})
      .filter(function(k){return (e[k]||'').trim()||(td[k]||[]).length;}).sort().reverse();
    if(!days.length){ return; }
    var md='# '+(b.title||'Щоденник')+'\n\n';
    days.forEach(function(ymd){
      var d=jrParse(ymd);
      md+='## '+String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear()
        +' ('+JR_WD[d.getDay()]+')\n\n';
      if((e[ymd]||'').trim()) md+=e[ymd].trim()+'\n\n';
      (td[ymd]||[]).forEach(function(t){ md+='- ['+(t.done?'x':' ')+'] '+t.t+'\n'; });
      if((td[ymd]||[]).length) md+='\n';
    });
    var name='journal-'+jrYmd()+'.md';
    try{
      var file=new File([md],name,{type:'text/markdown'});
      if(navigator.canShare&&navigator.canShare({files:[file]})){ navigator.share({files:[file],title:name}); return; }
    }catch(_){}
    try{
      var a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));
      a.download=name; document.body.appendChild(a); a.click();
      setTimeout(function(){ try{URL.revokeObjectURL(a.href);a.remove();}catch(_){} },1000);
    }catch(_){ try{ prompt('Скопіюй текст щоденника:',md); }catch(__){} }
  }
  function cdTick(){
    var els=editor.querySelectorAll('[data-pgcdwrap]');
    if(!els.length)return;
    var now=Date.now();
    els.forEach(function(w){
      var t=w.getAttribute('data-target'); if(!t)return;
      var target=new Date(t+'T23:59:59').getTime(); if(isNaN(target))return;
      var diff=target-now;
      if(diff<=0){
        var dl=w.querySelector('.pgcd-dl'); if(dl)dl.textContent='настав 🎉';
        var dq=w.querySelector('[data-cdd]'); if(dq)dq.textContent='0';
        ['[data-cdh]','[data-cdm]','[data-cds]'].forEach(function(sel){var e2=w.querySelector(sel);if(e2)e2.textContent='00';});
        return;
      }
      var s=Math.floor(diff/1000);
      var dd=Math.floor(s/86400); s-=dd*86400;
      var hh=Math.floor(s/3600); s-=hh*3600;
      var mm=Math.floor(s/60); s-=mm*60;
      var q=function(sel){return w.querySelector(sel);};
      if(q('[data-cdd]'))q('[data-cdd]').textContent=dd;
      if(q('[data-cdh]'))q('[data-cdh]').textContent=String(hh).padStart(2,'0');
      if(q('[data-cdm]'))q('[data-cdm]').textContent=String(mm).padStart(2,'0');
      if(q('[data-cds]'))q('[data-cds]').textContent=String(s).padStart(2,'0');
    });
  }
  setInterval(cdTick,1000);

  // ── скляний календар для «Відліку» ──
  var CAL_MONTHS=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
  var calWrap=document.createElement('div');
  calWrap.id='pgCalWrap';
  calWrap.innerHTML='<div class="pgcal-back"></div><div class="pgcal glass-card"><div class="pgcal-hd">'
    +'<button class="pgcal-nav" data-calnav="-1">‹</button>'
    +'<div class="pgcal-m" id="pgCalTitle"></div>'
    +'<button class="pgcal-nav" data-calnav="1">›</button></div>'
    +'<div class="pgcal-wd">Пн Вт Ср Чт Пт Сб Нд</div>'
    +'<div class="pgcal-grid" id="pgCalGrid"></div>'
    +'<div class="pgcal-ft"><button data-caltoday>Сьогодні</button><button data-calclear>Прибрати дату</button></div>'
    +'</div>';
  document.body.appendChild(calWrap);
  var calId=null, calY=0, calM=0;
  function calYmd(y,m,d){ return y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'); }
  function openCal(bid){
    var loc=locate(bid); if(!loc)return;
    calId=bid;
    var t=loc.block.target, d=t?new Date(t+'T00:00:00'):new Date();
    if(isNaN(+d))d=new Date();
    calY=d.getFullYear(); calM=d.getMonth();
    buildCal(); calWrap.classList.add('show');
  }
  function closeCal(){ calWrap.classList.remove('show'); calId=null; }
  function buildCal(){
    document.getElementById('pgCalTitle').textContent=CAL_MONTHS[calM]+' '+calY;
    var loc=calId?locate(calId):null;
    var sel=loc&&loc.block.target?loc.block.target:'';
    var today=new Date(); var todayYmd=calYmd(today.getFullYear(),today.getMonth(),today.getDate());
    var first=new Date(calY,calM,1);
    var startIdx=(first.getDay()+6)%7; /* Пн=0 */
    var dim=new Date(calY,calM+1,0).getDate();
    var html='';
    for(var i=0;i<startIdx;i++)html+='<span class="pgcal-d off"></span>';
    for(var d2=1;d2<=dim;d2++){
      var ymd=calYmd(calY,calM,d2);
      var cls='pgcal-d'+(ymd===sel?' sel':'')+(ymd===todayYmd?' today':'');
      html+='<button class="'+cls+'" data-calday="'+ymd+'">'+d2+'</button>';
    }
    document.getElementById('pgCalGrid').innerHTML=html;
  }
  calWrap.addEventListener('click',function(e){
    if(e.target.closest('.pgcal-back')){ closeCal(); return; }
    var nav=e.target.closest('[data-calnav]');
    if(nav){ calM+=+nav.dataset.calnav; if(calM<0){calM=11;calY--;} if(calM>11){calM=0;calY++;} buildCal(); return; }
    var day=e.target.closest('[data-calday]');
    if(day){
      var loc=locate(calId); if(loc){ loc.block.target=day.dataset.calday; save(); render(); cdTick(); }
      closeCal(); return;
    }
    if(e.target.closest('[data-caltoday]')){
      var t=new Date(); var loc2=locate(calId);
      if(loc2){ loc2.block.target=calYmd(t.getFullYear(),t.getMonth(),t.getDate()); save(); render(); cdTick(); }
      closeCal(); return;
    }
    if(e.target.closest('[data-calclear]')){
      var loc3=locate(calId); if(loc3){ loc3.block.target=''; save(); render(); }
      closeCal(); return;
    }
  });
  editor.addEventListener('click',function(e){
    /* ── лог рішень ── */
    var dm=e.target.closest&&e.target.closest('[data-dlmode]');
    if(dm){var m0=dm.dataset.dlmode.split('|');var ld=locate(m0[0]);if(ld){ld.block.dmode=m0[1];save();render();}return;}
    var dn=e.target.closest&&e.target.closest('[data-dlnew]');
    if(dn){dlNew[dn.dataset.dlnew]=true;render();
      var t0=editor.querySelector('[data-dltext="'+dn.dataset.dlnew+'"]');if(t0)t0.focus();return;}
    var dc=e.target.closest&&e.target.closest('[data-dlcancel]');
    if(dc){delete dlNew[dc.dataset.dlcancel];render();return;}
    var dd=e.target.closest&&e.target.closest('[data-dldays]');
    if(dd){var d0=dd.dataset.dldays.split('|');dlDays[d0[0]]=+d0[1];
      var wrap=dd.closest('.dl-days');
      wrap.querySelectorAll('.dl-dchipb').forEach(function(x){x.classList.toggle('on',x===dd);});return;}
    var ds=e.target.closest&&e.target.closest('[data-dlsave]');
    if(ds){var sid=ds.dataset.dlsave;var ls=locate(sid);if(!ls)return;
      var tt=(editor.querySelector('[data-dltext="'+sid+'"]')||{}).value||'';
      var ex=(editor.querySelector('[data-dlexp="'+sid+'"]')||{}).value||'';
      if(!tt.trim())return;
      ls.block.decisions=ls.block.decisions||[];
      ls.block.decisions.push({id:'d'+Date.now(),text:tt.trim(),expect:ex.trim(),
        created:jrYmd(),days:dlDays[sid]||30,fact:'',verdict:'',reviewed:''});
      delete dlNew[sid];save();render();return;}
    var dr=e.target.closest&&e.target.closest('[data-dlrow]');
    if(dr){var k0=dr.dataset.dlrow;dlOpen[k0]=!dlOpen[k0];render();return;}
    var dv=e.target.closest&&e.target.closest('[data-dlverd]');
    if(dv){var v0=dv.dataset.dlverd.split('|');var lv=locate(v0[0]);if(!lv)return;
      var dec=(lv.block.decisions||[]).find(function(x){return String(x.id)===v0[1];});if(!dec)return;
      var fta=editor.querySelector('[data-dlfact="'+v0[0]+'|'+v0[1]+'"]');
      if(fta)dec.fact=fta.value.trim();
      dec.verdict=v0[2];dec.reviewed=jrYmd();save();render();return;}
    var da=e.target.closest&&e.target.closest('[data-dlarch]');
    if(da){dlArch[da.dataset.dlarch]=!dlArch[da.dataset.dlarch];render();return;}
    var dx=e.target.closest&&e.target.closest('[data-dlexport]');
    if(dx){var lx2=locate(dx.dataset.dlexport);if(lx2)dlExport(lx2.block);return;}
    /* ── код: копіювати ── */
    var cc=e.target.closest&&e.target.closest('[data-pgcodecopy]');
    if(cc){var lcc=locate(cc.dataset.pgcodecopy);if(lcc){var txt=txtOf(lcc.block)||'';
      try{navigator.clipboard.writeText(txt);}catch(_){}
      cc.textContent='скопійовано ✓';setTimeout(function(){try{cc.textContent='копіювати';}catch(_){}} ,1400);}return;}
    /* ═══ PREMIUM PACK V1 · нативні обробники ═══ */
    var prc=e.target.closest&&e.target.closest('[data-pgprcopy]');
    if(prc){var lpr=locate(prc.dataset.pgprcopy);
      if(lpr){try{navigator.clipboard.writeText(lpr.block.ptext||'');}catch(_){ }
        try{window.platform.haptic('medium');}catch(_){ }
        prc.textContent='✓ скопійовано';
        setTimeout(function(){try{prc.textContent='копіювати';}catch(_){ }},1400);}
      return;}
    var hm=e.target.closest&&e.target.closest('[data-pghm]');
    if(hm){var hm0=hm.dataset.pghm.split('|');var lhm=locate(hm0[0]);
      if(lhm){var mb=lhm.block; mb.marks=mb.marks||{};
        mb.marks[hm0[1]]=((mb.marks[hm0[1]]||0)+1)%5;
        hm.className='pghm-c lv'+(mb.marks[hm0[1]]||0)+(hm.classList.contains('td')?' td':'');
        try{window.platform.haptic('medium');}catch(_){ }
        save();
        var wrap=hm.closest('.pghm'), st=wrap&&wrap.querySelector('.pghm-st');
        if(st){var tot=0;for(var mk in mb.marks){if(mb.marks[mk]>0)tot++;}
          var days=wrap.querySelectorAll('.pghm-c'),str=0;
          for(var di=days.length-1;di>=0;di--){ if(!days[di].className.match(/lv0/)) str++; else break; }
          st.textContent='🔥 '+str+' · '+tot+'/84';}}
      return;}
    var ka=e.target.closest&&e.target.closest('[data-pgkpiadd]');
    if(ka){pgAsk('Нове значення KPI','число, напр. 1250','',function(v){
      var l=locate(ka.dataset.pgkpiadd);if(!l)return;
      l.block.points=l.block.points||[];
      l.block.points.push({d:new Date().toISOString().slice(0,10),v:parseFloat(v.replace(',','.'))||0});
      save();render();});return;}
    var ca=e.target.closest&&e.target.closest('[data-pgchadd]');
    if(ca){pgAsk('Точка графіка','мітка | число (напр. Пн | 4)','',function(v){
      var l=locate(ca.dataset.pgchadd);if(!l)return;
      var pr=v.split('|').map(function(s){return s.trim();});
      var lab=pr.length>1?pr[0]:''; var num=pr.length>1?pr[1]:pr[0];
      l.block.points=l.block.points||[];
      l.block.points.push({l:lab,v:parseFloat(String(num).replace(',','.'))||0});
      save();render();});return;}
    var cv=e.target.closest&&e.target.closest('[data-pgchview]');
    if(cv){var cv0=cv.dataset.pgchview.split('|');var lcv=locate(cv0[0]);
      if(lcv){lcv.block.view=cv0[1];try{window.platform.haptic('select');}catch(_){ }save();render();}return;}
    var tb=e.target.closest&&e.target.closest('[data-pgtab]');
    if(tb){var tb0=tb.dataset.pgtab.split('|');var ltb=locate(tb0[0]);
      if(ltb){var blk=ltb.block, ii=parseInt(tb0[1]);
        if((parseInt(blk.ti)||0)===ii){
          pgAsk('Назва вкладки','',(blk.tabs[ii]&&blk.tabs[ii].name)||'',function(v){
            var l2=locate(tb0[0]);if(l2&&l2.block.tabs[ii]){l2.block.tabs[ii].name=v;save();render();}});
        } else { blk.ti=ii; try{window.platform.haptic('select');}catch(_){ } save();render(); }}
      return;}
    var ta=e.target.closest&&e.target.closest('[data-pgtabadd]');
    if(ta){var lta=locate(ta.dataset.pgtabadd);
      if(lta){var bb=lta.block;bb.tabs=bb.tabs||[];
        bb.tabs.push({name:'Таб '+(bb.tabs.length+1),text:''});bb.ti=bb.tabs.length-1;save();render();}return;}
    var ac=e.target.closest&&e.target.closest('[data-pgacc]');
    if(ac){var ac0=ac.dataset.pgacc.split('|');var lac=locate(ac0[0]);
      if(lac&&lac.block.secs[ac0[1]]){lac.block.secs[ac0[1]].open=lac.block.secs[ac0[1]].open?0:1;
        try{window.platform.haptic('light');}catch(_){ }save();render();}return;}
    var aa=e.target.closest&&e.target.closest('[data-pgaccadd]');
    if(aa){var laa=locate(aa.dataset.pgaccadd);
      if(laa){var ba=laa.block;ba.secs=ba.secs||[];
        ba.secs.push({name:'Секція '+(ba.secs.length+1),text:'',open:1});save();render();}return;}
    var es=e.target.closest&&e.target.closest('[data-pgemset]');
    if(es){pgAsk('Посилання YouTube','https://youtu.be/…','',function(v){
      var l=locate(es.dataset.pgemset);if(l){l.block.url=v;l.block.play=0;save();render();}});return;}
    var ep=e.target.closest&&e.target.closest('[data-pgemplay]');
    if(ep){var lep=locate(ep.dataset.pgemplay);
      if(lep){lep.block.play=1;render();lep.block.play=0;}return;}
    var aus=e.target.closest&&e.target.closest('[data-pgauset]');
    if(aus){pgAsk('Посилання на mp3','https://…/track.mp3','',function(v){
      var l=locate(aus.dataset.pgauset);
      if(l){l.block.url=v;try{l.block.name=decodeURIComponent(v.split('/').pop()||'Аудіо');}catch(_){l.block.name='Аудіо';}save();render();}});return;}
    var aup=e.target.closest&&e.target.closest('[data-pgauplay]');
    if(aup){var auId=aup.dataset.pgauplay;
      var au=editor.querySelector('[data-pgauel="'+auId+'"]');if(!au)return;
      var w=aup.closest('.pgau'),bar=w&&w.querySelector('.pgau-bar i'),tm=w&&w.querySelector('.pgau-t');
      if(au.paused){au.play();aup.textContent='⏸';}else{au.pause();aup.textContent='▶';}
      au.ontimeupdate=function(){if(au.duration&&bar&&tm){bar.style.width=(au.currentTime/au.duration*100)+'%';
        var m=Math.floor(au.currentTime/60),s=Math.floor(au.currentTime%60);
        tm.textContent=m+':'+String(s).padStart(2,'0');}};
      au.onended=function(){aup.textContent='▶';if(bar)bar.style.width='0%';};return;}
    var ask=e.target.closest&&e.target.closest('[data-pgauseek]');
    if(ask){var au2=editor.querySelector('[data-pgauel="'+ask.dataset.pgauseek+'"]');
      if(au2&&au2.duration){var r=ask.getBoundingClientRect();
        au2.currentTime=(e.clientX-r.left)/r.width*au2.duration;}return;}
    var fc=e.target.closest&&e.target.closest('[data-pgfctap]');
    if(fc){var lfc=locate(fc.dataset.pgfctap);
      if(lfc){var fb=lfc.block,fnow=Date.now();
        if(fb.end&&fb.end>fnow){fb.end=0;}
        else{fb.end=fnow+(fb.mode==='rest'?5:25)*60000;try{window.platform.haptic('medium');}catch(_){ }}
        save();render();}return;}
    /* ── прогрес-смуга: пресети + перемикач авто/ручний ── */
    var pb=e.target.closest&&e.target.closest('[data-pgbarset]');
    if(pb){var pb0=pb.dataset.pgbarset.split('|');var lpb=locate(pb0[0]);if(lpb){lpb.block.value=+pb0[1];save();render();}return;}
    var pba=e.target.closest&&e.target.closest('[data-pgbarauto]');
    if(pba){var lpba=locate(pba.dataset.pgbarauto);if(lpba){lpba.block.auto=!lpba.block.auto;save();render();}return;}
    /* ── огляд тижня: AI-підсумок сторінки, перегенеровується (SPECblocksv2 §6) ── */
    var wrg=e.target.closest&&e.target.closest('[data-pgwrgen]');
    if(wrg){
      var wrId=wrg.dataset.pgwrgen;
      var wrLoc=locate(wrId); if(!wrLoc)return;
      wrLoc.block.loading=true; save(); render();
      var wrPageTxt=''; try{ wrPageTxt=String((editor&&editor.innerText)||'').slice(0,4000); }catch(_){}
      Promise.resolve(aiPageAsk('Зроби короткий огляд цього тижня по цій сторінці: що зроблено, що в процесі, на чому сфокусуватись далі. 4-6 речень, без вступних фраз.',wrPageTxt)).then(function(ans){
        var l2=locate(wrId); if(!l2)return;
        l2.block.loading=false; l2.block.summary=String(ans||'').trim().slice(0,2000)||'…';
        var _d=new Date();
        l2.block.updatedAt=String(_d.getDate()).padStart(2,'0')+'.'+String(_d.getMonth()+1).padStart(2,'0')+' '+String(_d.getHours()).padStart(2,'0')+':'+String(_d.getMinutes()).padStart(2,'0');
        save(); render();
      }).catch(function(e){
        var l2=locate(wrId); if(!l2)return;
        l2.block.loading=false; l2.block.summary='⚠️ '+String(e&&e.message||e); save(); render();
      });
      return;
    }
    /* ── файл: прикріпити / відкрити / видалити ── */
    var fp=e.target.closest&&e.target.closest('[data-pgfilepick]');
    if(fp){var fid=fp.dataset.pgfilepick;var inp=document.createElement('input');inp.type='file';
      inp.onchange=function(){var f=inp.files&&inp.files[0];if(!f)return;
        if(f.size>4*1024*1024){alert('Файл завеликий (макс. 4 МБ для збереження в Frequency).');return;}
        var rd=new FileReader();rd.onload=function(){var lf=locate(fid);if(lf){lf.block.data=rd.result;lf.block.fname=f.name;
          lf.block.fsize=(f.size<1024?f.size+' Б':f.size<1048576?Math.round(f.size/1024)+' КБ':(f.size/1048576).toFixed(1)+' МБ');save();render();}};
        rd.readAsDataURL(f);};
      inp.click();return;}
    var fo=e.target.closest&&e.target.closest('[data-pgfileopen]');
    if(fo&&!e.target.closest('[data-pgfiledel]')){var lfo=locate(fo.dataset.pgfileopen);
      if(lfo&&lfo.block.data){try{var a=document.createElement('a');a.href=lfo.block.data;a.download=lfo.block.fname||'file';a.click();}catch(_){}}return;}
    var fd=e.target.closest&&e.target.closest('[data-pgfiledel]');
    if(fd){e.stopPropagation();var lfd=locate(fd.dataset.pgfiledel);if(lfd){lfd.block.data='';lfd.block.fname='';lfd.block.fsize='';save();render();}return;}
    /* ── Вкладення: прикріпити файл замість URL (перемикає sub на 'file') ── */
    var attf=e.target.closest&&e.target.closest('[data-pgattfile]');
    if(attf){var afid=attf.dataset.pgattfile;var ainp=document.createElement('input');ainp.type='file';
      ainp.onchange=function(){var af=ainp.files&&ainp.files[0];if(!af)return;
        if(af.size>4*1024*1024){alert('Файл завеликий (макс. 4 МБ для збереження в Frequency).');return;}
        var ard=new FileReader();ard.onload=function(){var laf=locate(afid);if(laf){laf.block.sub='file';laf.block.data=ard.result;laf.block.fname=af.name;
          laf.block.fsize=(af.size<1024?af.size+' Б':af.size<1048576?Math.round(af.size/1024)+' КБ':(af.size/1048576).toFixed(1)+' МБ');save();render();}};
        ard.readAsDataURL(af);};
      ainp.click();return;}
    /* ── Картка (пресет «фото»): вибір фонового фото ── */
    var cph=e.target.closest&&e.target.closest('[data-pgcardphoto]');
    if(cph){ pgPickPhoto(cph.dataset.pgcardphoto); return; }
    /* ── видалити ряд колонок цілком (SPECblocksv2 §4.1) ── */
    var rdel=e.target.closest&&e.target.closest('[data-pgrowdel]');
    if(rdel){
      var rdLoc=locate(rdel.dataset.pgrowdel);
      if(rdLoc){
        var rdArr=rdLoc.arr,rdIdx=rdLoc.idx,rdBlk=rdLoc.block;
        rdArr.splice(rdIdx,1);
        pushOp(function(){rdArr.splice(Math.min(rdIdx,rdArr.length),0,rdBlk);},
               function(){var i=rdArr.indexOf(rdBlk);if(i>-1)rdArr.splice(i,1);});
        save();render();
      }
      return;
    }
    /* ── трекер звичок ── */
    var hbm=e.target.closest&&e.target.closest('[data-hbmode]');
    if(hbm){var hbm0=hbm.dataset.hbmode.split('|');var lhbm=locate(hbm0[0]);if(lhbm){lhbm.block.hmode=hbm0[1];save();render();}return;}
    var hba=e.target.closest&&e.target.closest('[data-hbadd]');
    if(hba){hbAdd[hba.dataset.hbadd]=true;render();
      var hbi=editor.querySelector('[data-hbinput="'+hba.dataset.hbadd+'"]');if(hbi)hbi.focus();return;}
    var hbmk=e.target.closest&&e.target.closest('[data-hbmark]');
    if(hbmk){var hbk0=hbmk.dataset.hbmark.split('|');var lhbk=locate(hbk0[0]);
      if(lhbk){var hh=(lhbk.block.habits||[]).find(function(x){return x.id===hbk0[1];});
        if(hh){hh.marks=hh.marks||{};if(hh.marks[hbk0[2]])delete hh.marks[hbk0[2]];else hh.marks[hbk0[2]]=true;save();render();}}return;}
    var hbe=e.target.closest&&e.target.closest('[data-hbemo]');
    if(hbe){e.stopPropagation();var hbe0=hbe.dataset.hbemo.split('|');var lhbe=locate(hbe0[0]);
      if(lhbe){var he=(lhbe.block.habits||[]).find(function(x){return x.id===hbe0[1];});
        if(he){inputModal({title:'Емодзі звички',value:he.emoji||'✅',onOk:function(v){he.emoji=(v||'✅').trim().slice(0,2)||'✅';save();render();}});}}return;}
    var hbd=e.target.closest&&e.target.closest('[data-hbdel]');
    if(hbd){var hbd0=hbd.dataset.hbdel.split('|');var lhbd=locate(hbd0[0]);
      if(lhbd){lhbd.block.habits=(lhbd.block.habits||[]).filter(function(x){return x.id!==hbd0[1];});save();render();}return;}
    var hbx=e.target.closest&&e.target.closest('[data-hbexport]');
    if(hbx){var lhbx=locate(hbx.dataset.hbexport);if(lhbx)hbExport(lhbx.block);return;}
    /* ── хаб проєктів ── */
    var hm=e.target.closest&&e.target.closest('[data-phmode]');
    if(hm){var hm0=hm.dataset.phmode.split('|');var lhm=locate(hm0[0]);if(lhm){lhm.block.pmode=hm0[1];save();render();}return;}
    var hadd=e.target.closest&&e.target.closest('[data-phadd]');
    if(hadd){var lha=locate(hadd.dataset.phadd);if(lha){lha.block.projects=lha.block.projects||[];
      var pid='p'+Date.now();
      lha.block.projects.push({id:pid,name:'Новий проєкт',emoji:'🎯',color:PH_COLORS[lha.block.projects.length%PH_COLORS.length],link:'',steps:[]});
      phOpen[hadd.dataset.phadd+'|'+pid]=true;save();render();}return;}
    var hemo=e.target.closest&&e.target.closest('[data-phemo]');
    if(hemo){e.stopPropagation();var em0=hemo.dataset.phemo.split('|');var lem=locate(em0[0]);
      if(lem){var pe=(lem.block.projects||[]).find(function(x){return x.id===em0[1];});
        if(pe){inputModal({title:'Емодзі проєкту',value:pe.emoji||'🎯',onOk:function(v){pe.emoji=(v||'🎯').trim().slice(0,2)||'🎯';save();render();}});}}return;}
    var hrow=e.target.closest&&e.target.closest('[data-phrow]');
    if(hrow){var rk=hrow.dataset.phrow;phOpen[rk]=!phOpen[rk];render();return;}
    var hpick=e.target.closest&&e.target.closest('[data-phpick]');
    if(hpick){phPick[hpick.dataset.phpick]=true;render();return;}
    var hpx=e.target.closest&&e.target.closest('[data-phpickclose]');
    if(hpx){delete phPick[hpx.dataset.phpickclose];render();return;}
    var hlink=e.target.closest&&e.target.closest('[data-phlink]');
    if(hlink){var hl0=hlink.dataset.phlink.split('|');var lhl=locate(hl0[0]);
      if(lhl){var pp2=(lhl.block.projects||[]).find(function(x){return x.id===hl0[1];});
        if(pp2){pp2.link=hl0[2];delete phPick[hl0[0]+'|'+hl0[1]];save();render();}}return;}
    var hunlink=e.target.closest&&e.target.closest('[data-phunlink]');
    if(hunlink){var hu0=hunlink.dataset.phunlink.split('|');var lhu=locate(hu0[0]);
      if(lhu){var pp3=(lhu.block.projects||[]).find(function(x){return x.id===hu0[1];});if(pp3){pp3.link='';save();render();}}return;}
    var hsa=e.target.closest&&e.target.closest('[data-phstepadd]');
    if(hsa){phStepAdd[hsa.dataset.phstepadd]=true;render();
      var hsi=editor.querySelector('[data-phstepinput="'+hsa.dataset.phstepadd+'"]');if(hsi)hsi.focus();return;}
    var hst=e.target.closest&&e.target.closest('[data-phstep]');
    if(hst){var hs0=hst.dataset.phstep.split('|');var lhs=locate(hs0[0]);
      if(lhs){var pp4=(lhs.block.projects||[]).find(function(x){return x.id===hs0[1];});
        if(pp4){var st4=(pp4.steps||[]).find(function(x){return x.id===hs0[2];});if(st4){st4.done=!st4.done;save();render();}}}return;}
    var hsd=e.target.closest&&e.target.closest('[data-phstepdel]');
    if(hsd){var hd0=hsd.dataset.phstepdel.split('|');var lhd2=locate(hd0[0]);
      if(lhd2){var pp5=(lhd2.block.projects||[]).find(function(x){return x.id===hd0[1];});
        if(pp5){pp5.steps=(pp5.steps||[]).filter(function(x){return x.id!==hd0[2];});save();render();}}return;}
    var hdel=e.target.closest&&e.target.closest('[data-phdel]');
    if(hdel){var hde0=hdel.dataset.phdel.split('|');var lhde=locate(hde0[0]);
      if(lhde){confirmSheet({title:'Видалити проєкт?',onOk:function(){
        lhde.block.projects=(lhde.block.projects||[]).filter(function(x){return x.id!==hde0[1];});
        delete phOpen[hde0[0]+'|'+hde0[1]];save();render();}});}return;}
    var hex=e.target.closest&&e.target.closest('[data-phexport]');
    if(hex){var lhex=locate(hex.dataset.phexport);if(lhex)phExport(lhex.block);return;}
    /* ── проєкт-трекер ── */
    var pm=e.target.closest&&e.target.closest('[data-ptmode]');
    if(pm){var m1=pm.dataset.ptmode.split('|');var l1=locate(m1[0]);if(l1){l1.block.pmode=m1[1];save();render();}return;}
    var pp=e.target.closest&&e.target.closest('[data-ptpick]');
    if(pp){ptPick[pp.dataset.ptpick]=true;render();return;}
    var ppx=e.target.closest&&e.target.closest('[data-ptpickclose]');
    if(ppx){delete ptPick[ppx.dataset.ptpickclose];render();return;}
    var pl=e.target.closest&&e.target.closest('[data-ptlink]');
    if(pl){var l2p=pl.dataset.ptlink.split('|');var l2=locate(l2p[0]);if(l2){l2.block.link=l2p[1];delete ptPick[l2p[0]];save();render();}return;}
    var pu=e.target.closest&&e.target.closest('[data-ptunlink]');
    if(pu){var l3=locate(pu.dataset.ptunlink);if(l3){l3.block.link='';save();render();}return;}
    var pst=e.target.closest&&e.target.closest('[data-ptstep]');
    if(pst){var s0=pst.dataset.ptstep.split('|');var ls=locate(s0[0]);
      if(ls){var st=(ls.block.steps||[]).find(function(x){return String(x.id)===s0[1];});if(st){st.done=!st.done;save();render();}}return;}
    var psd=e.target.closest&&e.target.closest('[data-ptstepdel]');
    if(psd){var sd=psd.dataset.ptstepdel.split('|');var lsd=locate(sd[0]);
      if(lsd){lsd.block.steps=(lsd.block.steps||[]).filter(function(x){return String(x.id)!==sd[1];});save();render();}return;}
    var psa=e.target.closest&&e.target.closest('[data-ptstepadd]');
    if(psa){ptStepAdd[psa.dataset.ptstepadd]=true;render();
      var si=editor.querySelector('[data-ptstepinput="'+psa.dataset.ptstepadd+'"]');if(si)si.focus();return;}
    var ph=e.target.closest&&e.target.closest('[data-pthab]');
    if(ph){var h0=ph.dataset.pthab.split('|');var lh=locate(h0[0]);
      if(lh){var hb=(lh.block.habits||[]).find(function(x){return String(x.id)===h0[1];});
        if(hb){hb.marks=hb.marks||{};if(hb.marks[h0[2]])delete hb.marks[h0[2]];else hb.marks[h0[2]]=true;save();render();}}return;}
    var phd=e.target.closest&&e.target.closest('[data-pthabdel]');
    if(phd){var hd=phd.dataset.pthabdel.split('|');var lhd=locate(hd[0]);
      if(lhd){lhd.block.habits=(lhd.block.habits||[]).filter(function(x){return String(x.id)!==hd[1];});save();render();}return;}
    var pha=e.target.closest&&e.target.closest('[data-pthabadd]');
    if(pha){ptHabAdd[pha.dataset.pthabadd]=true;render();
      var hi=editor.querySelector('[data-pthabinput="'+pha.dataset.pthabadd+'"]');if(hi)hi.focus();return;}
    var pex=e.target.closest&&e.target.closest('[data-ptexport]');
    if(pex){var lex=locate(pex.dataset.ptexport);if(lex)ptExport(lex.block);return;}
    /* ── щоденник: туду ── */
    var ja=e.target.closest&&e.target.closest('[data-jtadd]');
    if(ja){jrTdAdd[ja.dataset.jtadd]=true;render();
      var ip=editor.querySelector('[data-jtinput="'+ja.dataset.jtadd+'"]');if(ip)ip.focus();return;}
    var jtg=e.target.closest&&e.target.closest('[data-jttoggle]');
    if(jtg){var g=jtg.dataset.jttoggle.split('|');var lg=locate(g[0]);
      if(lg){var it=((lg.block.todos||{})[g[1]]||[]).find(function(x){return String(x.id)===g[2];});
        if(it){it.done=!it.done;save();render();}}return;}
    var jdl=e.target.closest&&e.target.closest('[data-jtdel]');
    if(jdl){var dl0=jdl.dataset.jtdel.split('|');var ll=locate(dl0[0]);
      if(ll&&ll.block.todos&&ll.block.todos[dl0[1]]){
        ll.block.todos[dl0[1]]=ll.block.todos[dl0[1]].filter(function(x){return String(x.id)!==dl0[2];});
        save();render();}return;}
    /* ── щоденник ── */
    var jm=e.target.closest&&e.target.closest('[data-jrmode]');
    if(jm){var m=jm.dataset.jrmode.split('|');var l1=locate(m[0]);if(l1){l1.block.jmode=m[1];save();render();}return;}
    var jr=e.target.closest&&e.target.closest('[data-jrrow]');
    if(jr){var k1=jr.dataset.jrrow;jrOpen[k1]=!jrOpen[k1];if(!jrOpen[k1])delete jrEdit[k1];render();return;}
    var je=e.target.closest&&e.target.closest('[data-jredit]');
    if(je){jrEdit[je.dataset.jredit]=true;render();
      var ta=editor.querySelector('[data-jrpast="'+je.dataset.jredit+'"]');if(ta){ta.focus();}return;}
    var jd=e.target.closest&&e.target.closest('[data-jrdone]');
    if(jd){delete jrEdit[jd.dataset.jrdone];save();render();return;}
    var jx=e.target.closest&&e.target.closest('[data-jrexport]');
    if(jx){var lx=locate(jx.dataset.jrexport);if(lx)jrExport(lx.block);return;}
    var _co=e.target&&e.target.closest&&e.target.closest('[data-pgcovopen]');
    if(_co){
      e.preventDefault(); e.stopPropagation();
      try{ covEdOpen(); }catch(_){}
      return;
    }
    var _wh2=e.target&&e.target.closest&&e.target.closest('[data-pgwinh]');
    if(_wh2){
      var _lw=locate(_wh2.dataset.pgwinh);
      if(_lw){var _st=[110,140,200,280];var _ci=_st.indexOf(_lw.block.h||140);_lw.block.h=_st[(_ci+1)%_st.length];save();render();}
      return;
    }
    var _wa=e.target&&e.target.closest&&e.target.closest('[data-pgwinadd]');
    if(_wa){
      e.preventDefault(); e.stopPropagation();
      var _lw2=locate(_wa.dataset.pgwinadd); if(!_lw2)return;
      if(!Array.isArray(_lw2.block.children))_lw2.block.children=[];
      var _nbw={id:uid(),type:'note',text:''};
      _lw2.block.children.push(_nbw); _lw2.block.open=true;
      save(); render();
      slashCtx=_nbw.id; openSlash();
      return;
    }
    var ad=e.target&&e.target.closest&&e.target.closest('[data-pgaddafter]');
    if(ad){
      e.preventDefault(); e.stopPropagation();
      var lc=locate(ad.dataset.pgaddafter); if(!lc)return;
      var nb={id:uid(),type:'note',text:''};
      lc.arr.splice(lc.idx+1,0,nb);
      save(); render();
      slashCtx=nb.id; openSlash();
      return;
    }
    var badd=e.target&&e.target.closest&&e.target.closest('[data-pgboardadd]');
    if(badd){
      e.preventDefault(); e.stopPropagation();
      var blc=locate(badd.dataset.pgboardadd); if(!blc||blc.block.type!=='board')return;
      var bnb={id:uid(),type:'note',text:'',gw:4,gh:2};
      blc.block.children=blc.block.children||[]; blc.block.children.push(bnb);
      save(); render();
      slashCtx=bnb.id; openSlash();
      return;
    }
    var up=e.target&&e.target.closest&&e.target.closest('[data-pgup]');
    if(up){ pgPath.pop(); render(); return; }
    var ent=e.target&&e.target.closest&&e.target.closest('[data-pgenter]');
    if(ent&&!e.target.closest('[data-edit]')){
      pgPath.push(ent.dataset.pgenter);
      render(); try{scr.scrollTop=0;}catch(_){}
      return;
    }
    var sw=e.target&&e.target.closest&&e.target.closest('[data-pgspace]');
    if(sw){
      if(pgSgBusy)return;
      var _sgw=sw.closest&&sw.closest('.pgsg');
      if(_sgw){
        pgSgBusy=true;
        Array.prototype.forEach.call(_sgw.querySelectorAll('.pgsg-b'),function(x){x.classList.toggle('on',x===sw);});
        pgSgPlace();
        setTimeout(function(){
          pgSgBusy=false;
          if(bridge().switchSpace)bridge().switchSpace(sw.dataset.pgspace);
          pgPath=[]; render(); renderCover(); cdTick();
        },240);
        return;
      }
      if(bridge().switchSpace)bridge().switchSpace(sw.dataset.pgspace);
      pgPath=[]; render(); renderCover(); cdTick(); return;
    }
    if(e.target&&e.target.closest&&e.target.closest('[data-pgspadd]')){
      if(bridge().addSpace)bridge().addSpace();
      pgPath=[]; render(); renderCover(); cdTick(); return;
    }
    var c=e.target&&e.target.closest&&e.target.closest('[data-pgcdcal]');
    if(c){ e.preventDefault(); openCal(c.dataset.pgcdcal); return; }
    var m=e.target&&e.target.closest&&e.target.closest('[data-pgcdmore]');
    if(m){ e.preventDefault(); openBmenu(m.dataset.pgcdmore); return; }
  });
  editor.addEventListener('change',function(e){
    var li=e.target&&e.target.closest&&e.target.closest('[data-pglink]');
    if(li){
      var loc2=locate(li.dataset.pglink); if(!loc2)return;
      var v=(li.value||'').trim();
      loc2.block.url=v;
      if(loc2.block.type==='attach'){ /* автовизначення підтипу «Вкладення» за URL (SPECblocksv2 §3.1) */
        if(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))[\w-]{11}/.test(v)) loc2.block.sub='video';
        else if(/\.(mp3|m4a|wav|ogg|aac)(\?|#|$)/i.test(v)){
          loc2.block.sub='audio';
          if(!loc2.block.name){ try{ loc2.block.name=decodeURIComponent(v.split('/').pop()||'Аудіо'); }catch(_){ loc2.block.name='Аудіо'; } }
        }
        else loc2.block.sub='link';
      }
      save(); render();
    }
  });
  function pgPickPhoto(bid,onDone){
    var inp=document.createElement('input');
    inp.type='file'; inp.accept='image/*';
    inp.onchange=function(){
      var f=inp.files&&inp.files[0]; if(!f)return;
      var reader=new FileReader();
      reader.onload=function(){
        var img=new Image();
        img.onload=function(){
          var max=1100, w2=img.width, h2=img.height;
          var r=Math.min(1,max/w2,max/h2); w2=Math.round(w2*r); h2=Math.round(h2*r);
          var cv=document.createElement('canvas'); cv.width=w2; cv.height=h2;
          cv.getContext('2d').drawImage(img,0,0,w2,h2);
          var loc=locate(bid); if(!loc)return;
          loc.block.data=cv.toDataURL('image/jpeg',0.72);
          loc.block.pos=null;
          save(); render();
          if(onDone) onDone();
        };
        img.src=reader.result;
      };
      reader.readAsDataURL(f);
    };
    inp.click();
  }
  var PGPH_SIZES=[['sm','Компактне',180],['md','Стандартне',340],['lg','Велике',480],['xl','Максимум',680]];
  var pgSzBox=null;
  function pgSzBuild(){
    if(pgSzBox)return pgSzBox;
    var maxH=PGPH_SIZES[PGPH_SIZES.length-1][2];
    var b=document.createElement('div'); b.className='pgsz-ov'; b.id='pgSzOv';
    var cards=PGPH_SIZES.map(function(s){
      var barPct=Math.round(22+ (s[2]/maxH)*78); // 22%..100% висоти прев'ю
      return '<button class="pgsz-opt" data-pgszopt="'+s[0]+'">'
        +'<span class="pgsz-frame"><span class="pgsz-bar" style="height:'+barPct+'%"></span><span class="pgsz-chk">✓</span></span>'
        +'<b>'+s[1]+'</b></button>';
    }).join('');
    b.innerHTML='<div class="pgsz-in"><div class="pgsz-grip"></div>'
      +'<div class="pgsz-title">Розмір фото</div>'
      +'<div class="pgsz-sub">або потягни за кутик знизу-справа</div>'
      +'<div class="pgsz-grid">'+cards+'</div>'
      +'<button class="pgsz-cancel" data-pgszcancel>Скасувати</button></div>';
    document.body.appendChild(b); pgSzBox=b;
    b.addEventListener('click',function(e){
      if(e.target===b||e.target.closest('[data-pgszcancel]')){ pgSzClose(); return; }
      var opt=e.target.closest('[data-pgszopt]');
      if(opt&&pgSzBox.__bid){
        var s=PGPH_SIZES.filter(function(x){return x[0]===opt.dataset.pgszopt;})[0];
        var loc=locate(pgSzBox.__bid);
        if(loc&&s){ loc.block.h=s[2]; save(); render(); }
        pgSzClose();
      }
    });
    return b;
  }
  function pgSzSync(bid){
    var loc=locate(bid); var h=loc&&loc.block.h||340;
    var closest=PGPH_SIZES.reduce(function(a,c){ return Math.abs(c[2]-h)<Math.abs(a[2]-h)?c:a; });
    pgSzBox.querySelectorAll('[data-pgszopt]').forEach(function(el){
      el.classList.toggle('on', el.dataset.pgszopt===closest[0]);
    });
  }
  function pgSzClose(){ if(pgSzBox) pgSzBox.classList.remove('on'); }
  function pgPhotoSizeSheet(bid){
    pgSzBuild(); pgSzBox.__bid=bid; pgSzSync(bid); pgSzBox.classList.add('on');
  }
  function pgPhotoMenu(bid){
    var loc=locate(bid); if(!loc||!loc.block.data)return;
    actionSheet({ title:'Фото',
      items:[
        { ic:'crop', label:'Кадрувати', sub:'зсув і масштаб пальцями', onClick:function(){
          var l2=locate(bid); if(!l2)return;
          openPhotoCropEditor({ img:l2.block.data, pos:l2.block.pos, title:'Кадрувати фото',
            onSave:function(pos){ l2.block.pos=pos; save(); render(); } });
        } },
        { ic:'resize', label:'Розмір', onClick:function(){ pgPhotoSizeSheet(bid); } },
        { ic:'refresh', label:'Замінити фото', onClick:function(){ pgPickPhoto(bid); } }
      ] });
  }
  editor.addEventListener('click',function(e){
    var pm=e.target&&e.target.closest&&e.target.closest('[data-pgphotomenu]');
    if(pm){ pgPhotoMenu(pm.dataset.pgphotomenu); return; }
    var pb=e.target&&e.target.closest&&e.target.closest('[data-pgphoto]');
    if(!pb)return;
    pgPickPhoto(pb.dataset.pgphoto);
  });
  // ── ручка знизу-справа: тягни пальцем/мишкою — міняєш висоту фото наживо ──
  var pgRz=null;
  editor.addEventListener('pointerdown',function(e){
    var rz=e.target&&e.target.closest&&e.target.closest('[data-pgphotorz]'); if(!rz)return;
    e.preventDefault();
    var bid=rz.dataset.pgphotorz; var loc=locate(bid); if(!loc)return;
    var img=rz.parentElement&&rz.parentElement.querySelector('img'); if(!img)return;
    pgRz={ bid:bid, startY:e.clientY, startH:img.getBoundingClientRect().height, img:img };
    try{ rz.setPointerCapture(e.pointerId); }catch(_){}
  });
  document.addEventListener('pointermove',function(e){
    if(!pgRz)return;
    var h=Math.max(140,Math.min(900, pgRz.startH+(e.clientY-pgRz.startY)));
    pgRz.img.style.height=h+'px'; pgRz.img.style.maxHeight='none';
  });
  document.addEventListener('pointerup',function(){
    if(!pgRz)return;
    var loc=locate(pgRz.bid);
    if(loc) loc.block.h=Math.round(parseFloat(pgRz.img.style.height)||pgRz.startH);
    pgRz=null; save();
  });

  // ── обкладинка сторінки («Фото-хіро») ──
  var COVKEY='flowPgCovers';
  var covers={};
  try{ covers=JSON.parse(localStorage.getItem(COVKEY)||'{}')||{}; }catch(_){ covers={}; }
  try{
    var _cp=window.storage&&window.storage.get&&window.storage.get(COVKEY);
    if(_cp&&_cp.then)_cp.then(function(r){
      if(r&&r.value){ try{ var v=JSON.parse(r.value)||{}; covers=Object.assign({},v,covers); renderCover(); }catch(_){} }
    }).catch(function(){});
  }catch(_){}
  function saveCovers(){
    try{ localStorage.setItem(COVKEY,JSON.stringify(covers)); }catch(_){}
    try{ var p=window.storage&&window.storage.set&&window.storage.set(COVKEY,JSON.stringify(covers),false); if(p&&p.catch)p.catch(function(){}); }catch(_){}
  }
  var COV_GRADS=[
    'radial-gradient(120% 100% at 15% 0%,#41508f 0%,transparent 55%),radial-gradient(110% 90% at 85% 15%,#7b4a9e 0%,transparent 50%),radial-gradient(130% 120% at 60% 100%,#173a5e 0%,#0f1115 78%)',
    'linear-gradient(135deg,#0f2b1e,#1f6f4a 60%,#4ee69a)',
    'linear-gradient(135deg,#3a1f14,#a4502a 55%,#ffb37c)',
    'linear-gradient(135deg,#141a33,#31418f 55%,#7c8cff)'
  ];
  var covEl=document.getElementById('pgCover');
  function pgHasCov(){ try{ return !!covers[covKey()]; }catch(_){ return false; } }
  function covKey(){ try{ return (bridge()&&bridge().curKey())||''; }catch(_){ return ''; } }
  function covMenuHTML(){
    var sw=COV_GRADS.map(function(g,i){
      return '<button class="pgcov-sw" data-covgrad="'+i+'" style="background:'+g+'"></button>';
    }).join('');
    return '<div class="pgcov-menu" data-covmenu><div class="pgcov-row">'+sw+'</div>'
      +'<div class="pgcov-act"><button data-covphoto>Фото</button><button data-covclear>Прибрати</button></div></div>';
  }
  function renderCover(){
    if(!covEl)return;
    var k=covKey(), c=covers[k];
    if(!c){
      covEl.className='pg-cover empty';
      covEl.innerHTML='<button class="pgcov-add" data-covopen>'+pgsIc('photo')+'Додати обкладинку</button>'+covMenuHTML();
    }else{
      covEl.className='pg-cover has';
      covEl.innerHTML='<div class="pgcov-img"></div><button class="pgcov-btn" data-covopen>Обкладинка</button>'+covMenuHTML();
      var img=covEl.querySelector('.pgcov-img');
      if(c.img){ img.style.backgroundImage='url('+c.img+')';
        img.style.backgroundPosition='50% '+(c.pos==null?50:c.pos)+'%'; }
      else{ img.style.background=COV_GRADS[c.g||0]; }
      covEl.style.setProperty('--covh',(c.h||176)+'px');
      covEl.style.setProperty('--covdark',((c.dark==null?30:c.dark)/100));
    }
    try{
      var _t=document.getElementById('pgTitle');
      if(_t){ _t.style.position='relative'; _t.style.zIndex='2';
        _t.style.marginTop=(c?Math.max(64,(c.h||176)-80):62)+'px'; _t.style.marginBottom='12px'; }
      /* значки в одну капсулу */
      var _th=document.getElementById('pgTheme'), _wb=document.getElementById('pgWideBtn');
      if(_th&&_wb&&_wb.parentNode!==_th) _th.appendChild(_wb);
      var _sp=document.getElementById('scr-page');
      if(_sp) _sp.classList.toggle('pg-hascov', !!c);
      var _cc=document.querySelector('.pgmeta .pgm-c.cov');
      if(_cc){ _cc.textContent=(c?'обкладинка':'＋ обкладинка');
        _cc.classList.toggle('set',!!c); }
    }catch(_){}
  }
  function covPickPhoto(){
    var k=covKey(); if(!k)return;
    var inp=document.createElement('input');
    inp.type='file'; inp.accept='image/*';
    inp.onchange=function(){
      var f=inp.files&&inp.files[0]; if(!f)return;
      var reader=new FileReader();
      reader.onload=function(){
        var img=new Image();
        img.onload=function(){
          var maxW=1200, maxH=760, w=img.width, h2=img.height;
          var r=Math.min(1,maxW/w,maxH/h2); w=Math.round(w*r); h2=Math.round(h2*r);
          var cv=document.createElement('canvas'); cv.width=w; cv.height=h2;
          cv.getContext('2d').drawImage(img,0,0,w,h2);
          var _pc=covers[k]||{};
          covers[k]={img:cv.toDataURL('image/jpeg',0.72),
            pos:_pc.pos==null?50:_pc.pos,dark:_pc.dark==null?30:_pc.dark,h:_pc.h||176};
          saveCovers(); renderCover(); try{ covEdSync(); }catch(_){}
        };
        img.src=reader.result;
      };
      reader.readAsDataURL(f);
    };
    inp.click();
  }
  if(covEl)covEl.addEventListener('click',function(e){
    var k=covKey(); if(!k)return;
    var menu=covEl.querySelector('[data-covmenu]');
    if(e.target.closest('[data-covopen]')){ covEdOpen(); return; }
    var sw=e.target.closest('[data-covgrad]');
    if(sw){ covers[k]={g:+sw.dataset.covgrad}; saveCovers(); renderCover(); return; }
    if(e.target.closest('[data-covphoto]')){ if(menu)menu.classList.remove('on'); covPickPhoto(); return; }
    if(e.target.closest('[data-covclear]')){ delete covers[k]; saveCovers(); renderCover(); return; }
  });
  document.addEventListener('click',function(e){
    if(!covEl)return;
    var menu=covEl.querySelector('[data-covmenu]');
    if(menu&&menu.classList.contains('on')&&!covEl.contains(e.target))menu.classList.remove('on');
  });

  /* ── Редактор обкладинки ── */
  var covEdBox=null, covEdDrag=null;
  function covEdState(){
    var k=covKey(); if(!k)return null;
    var c=covers[k]; if(!c){ c={g:0}; covers[k]=c; }
    if(c.pos==null)c.pos=50; if(c.dark==null)c.dark=30; if(c.h==null)c.h=176;
    return c;
  }
  function covEdSync(skipInputs){
    var b=covEdBox; if(!b)return; var c=covEdState(); if(!c)return;
    var im=b.querySelector('[data-covedimg]');
    if(c.img){ im.style.background='#000'; im.style.backgroundImage='url('+c.img+')';
      im.style.backgroundSize='cover'; im.style.backgroundPosition='50% '+c.pos+'%'; }
    else { im.style.backgroundImage='none'; im.style.background=COV_GRADS[c.g||0]; }
    b.style.setProperty('--cd',(c.dark/100));
    b.querySelector('.coved-hint').style.display=c.img?'':'none';
    if(!skipInputs){
      b.querySelector('[data-coveddark]').value=c.dark;
      b.querySelector('[data-covedh]').value=c.h;
    }
  }
  function covEdBuild(){
    if(covEdBox)return covEdBox;
    var b=document.createElement('div'); b.className='coved'; b.id='covEd';
    b.innerHTML='<div class="coved-hd"><button class="coved-x" data-covedclose>✕</button>'
      +'<span class="coved-t">Обкладинка</span>'
      +'<button class="coved-ok" data-covedclose>Готово</button></div>'
      +'<div class="coved-prev" data-covedprev><div class="coved-img" data-covedimg></div>'
      +'<div class="coved-fr"></div><div class="coved-hint">Тягни вгору-вниз, щоб вибрати кадр</div></div>'
      +'<div class="coved-body">'
      +'<div class="coved-lbl">Затемнення</div>'
      +'<input class="coved-rng" type="range" min="0" max="80" step="1" data-coveddark>'
      +'<div class="coved-lbl">Висота</div>'
      +'<input class="coved-rng" type="range" min="110" max="280" step="2" data-covedh>'
      +'<div class="coved-lbl">Готові</div><div class="coved-grid" data-covedgrid></div></div>'
      +'<div class="coved-foot"><button class="coved-b pri" data-covedphoto>З галереї</button>'
      +'<button class="coved-b dan" data-covedclear>Прибрати</button></div>';
    document.body.appendChild(b); covEdBox=b;
    b.querySelector('[data-covedgrid]').innerHTML=COV_GRADS.map(function(g,i){
      return '<button class="coved-sw" data-covedg="'+i+'" style="background:'+g+'"></button>';
    }).join('');
    b.addEventListener('click',function(e){
      var c=covEdState(); if(!c)return;
      if(e.target.closest('[data-covedclose]')){ covEdClose(); return; }
      var sw=e.target.closest('[data-covedg]');
      if(sw){ delete c.img; c.g=+sw.dataset.covedg; saveCovers(); renderCover(); covEdSync(); return; }
      if(e.target.closest('[data-covedphoto]')){ covPickPhoto(); return; }
      if(e.target.closest('[data-covedclear]')){ delete covers[covKey()]; saveCovers(); renderCover(); covEdClose(); return; }
    });
    b.querySelector('[data-coveddark]').addEventListener('input',function(){
      var c=covEdState(); if(!c)return; c.dark=+this.value; saveCovers(); renderCover(); covEdSync(true);
    });
    b.querySelector('[data-covedh]').addEventListener('input',function(){
      var c=covEdState(); if(!c)return; c.h=+this.value; saveCovers(); renderCover(); covEdSync(true);
    });
    var pv=b.querySelector('[data-covedprev]');
    function dgStart(y){ var c=covEdState(); covEdDrag={y:y,p:c?c.pos:50}; }
    function dgMove(y){
      if(!covEdDrag)return; var c=covEdState(); if(!c||!c.img)return;
      c.pos=Math.max(0,Math.min(100,covEdDrag.p+(covEdDrag.y-y)/1.6));
      saveCovers(); renderCover(); covEdSync(true);
    }
    pv.addEventListener('touchstart',function(e){ dgStart(e.touches[0].clientY); },{passive:true});
    pv.addEventListener('touchmove',function(e){ e.preventDefault(); dgMove(e.touches[0].clientY); },{passive:false});
    pv.addEventListener('touchend',function(){ covEdDrag=null; });
    pv.addEventListener('mousedown',function(e){ e.preventDefault(); dgStart(e.clientY); });
    document.addEventListener('mousemove',function(e){ if(covEdDrag)dgMove(e.clientY); });
    document.addEventListener('mouseup',function(){ covEdDrag=null; });
    return b;
  }
  function covEdOpen(){ if(!covKey())return; covEdBuild(); covEdSync(); covEdBox.classList.add('on'); }
  function covEdClose(){ if(covEdBox)covEdBox.classList.remove('on'); renderCover(); }

