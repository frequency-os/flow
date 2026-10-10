  /* ═══════════ значки файлів, «Відлік», обробники кліків документа ═══════════ */
  function pgFileIc(name){
    var ext=(name.split('.').pop()||'').toLowerCase();
    if(/pdf/.test(ext))return '📕'; if(/docx?|pages/.test(ext))return '📘';
    if(/xlsx?|csv|numbers/.test(ext))return '📗'; if(/pptx?|key/.test(ext))return '📙';
    if(/zip|rar|7z/.test(ext))return '🗜️'; if(/mp3|wav|m4a/.test(ext))return '🎵';
    if(/mp4|mov|avi/.test(ext))return '🎬'; if(/png|jpe?g|gif|webp|heic/.test(ext))return '🖼️';
    return '📄';
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
  if(window.visInterval) window.visInterval(cdTick,1000,{now:true}); else setInterval(cdTick,1000);

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
    /* ── плашка старого блока (прибрані типи, 10.10.2026): «Прибрати» — видалити блок із документа ── */
    var orm=e.target.closest&&e.target.closest('[data-pgoldrm]');
    if(orm){var lor=locate(orm.dataset.pgoldrm);
      if(lor){var orArr=lor.arr,orIdx=lor.idx,orBlk=lor.block;
        orArr.splice(orIdx,1);
        pushOp(function(){orArr.splice(Math.min(orIdx,orArr.length),0,orBlk);},
               function(){var i=orArr.indexOf(orBlk);if(i>-1)orArr.splice(i,1);});
        save();render();}
      return;}
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
  /* ── В1 (10.10.2026): картинка обкладинки — у сховищі фото (PhotoDB + хмара фото), а в ключі
     flowPgCovers лише посилання «idb:pc_…». Раніше кожна обкладинка лежала тут як data-URL
     1200×760 у трьох копіях (localStorage, flowapp_, черга відправки) і вичерпувала памʼять iPhone.
     Новий id на кожне фото: інший пристрій, що вже має старе фото з тим самим id, інакше не оновив би його.
     Лише для НОВИХ обкладинок (дія людини). Автоматичного переносу старих нема: памʼять covers — тільки
     локальна копія, і фоновий запис затер би в хмарі обкладинки, змінені на іншому пристрої. */
  function covIsData(u){ return typeof u==='string' && u.slice(0,11)==='data:image/'; }
  function covStore(k,dataUrl){
    var id='pc_'+String(k).replace(/[^A-Za-z0-9_-]/g,'').slice(0,40)+'_'+Date.now().toString(36);
    try{ return (window.photoPut?window.photoPut(id,dataUrl):Promise.resolve(dataUrl)).then(function(r){ return r||dataUrl; },function(){ return dataUrl; }); }
    catch(_){ return Promise.resolve(dataUrl); }
  }
  // стерти фото, лише якщо на нього більше не посилається жодна обкладинка (перенос чат↔папка ділить посилання)
  function covDropImg(ref){
    try{
      if(!ref || !window.photoIsRef || !window.photoIsRef(ref)) return;
      for(var kk in covers){ if(covers[kk] && covers[kk].img===ref) return; }
      if(window.photoDel) window.photoDel(ref);
    }catch(_){}
  }
  // адреса для css url(): safeImg розвʼязує «idb:…» через photoSrc; поки фото вантажиться — порожньо, перемалюємо
  var covRetryT=null, covRetryN={};
  function covImgUrl(c){
    var u=''; try{ u=safeImg(c&&c.img); }catch(_){ u=''; }
    if(u){ if(c&&c.img) delete covRetryN[c.img]; return u; }
    // фото ще вантажиться з IndexedDB/хмари — кілька повторів, далі не смикаємо мережу
    if(c && c.img && !covRetryT && (covRetryN[c.img]||0)<5){
      covRetryN[c.img]=(covRetryN[c.img]||0)+1;
      covRetryT=setTimeout(function(){ covRetryT=null; try{ renderCover(); covEdSync(); }catch(_){} },500);
    }
    return u;
  }
  var covSaveT=null;
  function saveCovers(){
    if(covSaveT){ clearTimeout(covSaveT); covSaveT=null; }
    try{ localStorage.setItem(COVKEY,JSON.stringify(covers)); }catch(_){}
    try{ var p=window.storage&&window.storage.set&&window.storage.set(COVKEY,JSON.stringify(covers),false); if(p&&p.catch)p.catch(function(){}); }catch(_){}
  }
  /* Під час жесту (перетягування, повзунки) зберігаємо не на кожен рух, а раз —
     коли палець зупинився на 400 мс або відпустив. Інакше кожен touchmove
     серіалізував і писав УСІ обкладинки з фото (сотні КБ) двічі — жест смикався.
     Екран оновлюється одразу (renderCover), відкладається лише запис. */
  function saveCoversSoon(){
    if(covSaveT) clearTimeout(covSaveT);
    covSaveT=setTimeout(saveCovers,400);
  }
  function flushCovers(){ if(covSaveT) saveCovers(); }
  // застосунок ховають/закривають посеред жесту — відкладене не губимо.
  // visibilitychange слухаємо на window у фазі перехоплення (true): так він
  // спрацює РАНІШЕ за sbOnHide (той на document, зареєстрований раніше), і
  // обкладинка потрапить у партію, яку sbOnHide одразу шле в хмару. Інакше
  // вона чекала б 500 мс таймера, якого у фоні iOS може вже не бути.
  try{
    window.addEventListener('pagehide',flushCovers);
    window.addEventListener('visibilitychange',function(){ if(document.visibilityState==='hidden')flushCovers(); },true);
  }catch(_){}
  var COV_GRADS=[
    'radial-gradient(120% 100% at 15% 0%,#41508f 0%,transparent 55%),radial-gradient(110% 90% at 85% 15%,#7b4a9e 0%,transparent 50%),radial-gradient(130% 120% at 60% 100%,#173a5e 0%,#0f1115 78%)',
    'linear-gradient(135deg,#0f2b1e,#1f6f4a 60%,#4ee69a)',
    'linear-gradient(135deg,#3a1f14,#a4502a 55%,#ffb37c)',
    'linear-gradient(135deg,#141a33,#31418f 55%,#7c8cff)'
  ];
  var covEl=document.getElementById('pgCover');
  /* міст для Каналу папки (core/35-channel.js): та сама обкладинка, той самий ключ —
     що поставив у Каналі, те й бачиш у документі, і навпаки */
  try{
    window.__pgCovers={
      grads:COV_GRADS,
      get:function(k){ return covers[k]||null; },
      keys:function(){ return Object.keys(covers); },   // видалення папки прибирає і її обкладинки (04-folders-nav.js)
      set:function(k,c){
        var old=covers[k]&&covers[k].img;
        var done=function(){ covers[k]=c; saveCovers(); try{ renderCover(); }catch(_){} };
        if(c && covIsData(c.img)) return covStore(k,c.img).then(function(ref){ c.img=ref; done(); });
        done(); return Promise.resolve();
      },
      clear:function(k){ var old=covers[k]&&covers[k].img; delete covers[k]; saveCovers(); try{ renderCover(); }catch(_){} covDropImg(old); },
      // лише з памʼяті, без запису: папку видалили на іншому пристрої, і він уже
      // прибрав її обкладинку в хмарі — наша копія могла б бути застарілою
      forget:function(k){ delete covers[k]; }
    };
  }catch(_){}
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
      if(c.img){ var _u=covImgUrl(c); img.style.backgroundImage=_u?"url('"+_u+"')":'none';
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
          var data=cv.toDataURL('image/jpeg',0.72);
          covStore(k,data).then(function(ref){
            var _pc=covers[k]||{}, _old=_pc.img;
            covers[k]={img:ref, pos:_pc.pos==null?50:_pc.pos,dark:_pc.dark==null?30:_pc.dark,h:_pc.h||176};
            saveCovers(); renderCover(); try{ covEdSync(); }catch(_){}
          });
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
    if(c.img){ var _cu=covImgUrl(c); im.style.background='#000'; im.style.backgroundImage=_cu?"url('"+_cu+"')":'none';
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
      if(e.target.closest('[data-covedclear]')){ var _ok=covKey(), _o=covers[_ok]&&covers[_ok].img; delete covers[_ok]; saveCovers(); renderCover(); covEdClose(); covDropImg(_o); return; }
    });
    b.querySelector('[data-coveddark]').addEventListener('input',function(){
      var c=covEdState(); if(!c)return; c.dark=+this.value; saveCoversSoon(); renderCover(); covEdSync(true);
    });
    b.querySelector('[data-covedh]').addEventListener('input',function(){
      var c=covEdState(); if(!c)return; c.h=+this.value; saveCoversSoon(); renderCover(); covEdSync(true);
    });
    // повзунок відпустили — зберегти одразу, не чекаючи таймера
    b.querySelector('[data-coveddark]').addEventListener('change',flushCovers);
    b.querySelector('[data-covedh]').addEventListener('change',flushCovers);
    var pv=b.querySelector('[data-covedprev]');
    function dgStart(y){ var c=covEdState(); covEdDrag={y:y,p:c?c.pos:50}; }
    function dgMove(y){
      if(!covEdDrag)return; var c=covEdState(); if(!c||!c.img)return;
      c.pos=Math.max(0,Math.min(100,covEdDrag.p+(covEdDrag.y-y)/1.6));
      saveCoversSoon(); renderCover(); covEdSync(true);
    }
    function dgEnd(){ covEdDrag=null; flushCovers(); }
    pv.addEventListener('touchstart',function(e){ dgStart(e.touches[0].clientY); },{passive:true});
    pv.addEventListener('touchmove',function(e){ e.preventDefault(); dgMove(e.touches[0].clientY); },{passive:false});
    pv.addEventListener('touchend',dgEnd);
    pv.addEventListener('touchcancel',dgEnd);
    pv.addEventListener('mousedown',function(e){ e.preventDefault(); dgStart(e.clientY); });
    document.addEventListener('mousemove',function(e){ if(covEdDrag)dgMove(e.clientY); });
    document.addEventListener('mouseup',function(){ if(covEdDrag)dgEnd(); });
    return b;
  }
  function covEdOpen(){ if(!covKey())return; covEdBuild(); covEdSync(); covEdBox.classList.add('on'); }
  function covEdClose(){ flushCovers(); if(covEdBox)covEdBox.classList.remove('on'); renderCover(); }

