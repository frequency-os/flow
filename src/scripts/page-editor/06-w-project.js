  /* ═══════════ ВІДЖЕТ «ПРОЄКТ-ТРЕКЕР» (хаб + звʼязок з папкою) ═══════════ */
  var ptStepAdd={}, ptHabAdd={}, ptPick={};
  var PT_WD=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
  function ptWeekDays(){ /* пн..нд поточного тижня як ymd */
    var t=jrParse(jrYmd()), dow=(t.getDay()+6)%7, mon=new Date(t); mon.setDate(t.getDate()-dow);
    var a=[]; for(var i=0;i<7;i++){ var d=new Date(mon); d.setDate(mon.getDate()+i); a.push(jrYmd(d)); } return a;
  }
  function ptHabStreak(marks){ var n=0,d=jrParse(jrYmd());
    if(!marks[jrYmd()]) d.setDate(d.getDate()-1);
    while(marks[jrYmd(d)]){ n++; d.setDate(d.getDate()-1); } return n; }
  function ptProgress(b){
    /* план-кроки + виконані задачі у прив'язаній папці */
    var steps=b.steps||[], sDone=steps.filter(function(s){return s.done;}).length, sTot=steps.length;
    var fDone=0,fTot=0;
    if(b.link){ var br=bridge(); if(br&&br.folderProgress){ var fp=br.folderProgress(b.link)||{}; fDone=fp.done||0; fTot=fp.total||0; } }
    var done=sDone+fDone, tot=sTot+fTot;
    return { done:done, total:tot, pct: tot?Math.round(done/tot*100):0, sDone:sDone, sTot:sTot, fDone:fDone, fTot:fTot };
  }
  function ptHTML(b){
    var id=b.id; b.steps=b.steps||[]; b.habits=b.habits||[];
    var mode=b.pmode==='half'?'half':'full';
    var c=b.color||'#7c8cff';
    var pr=ptProgress(b);
    var br=bridge();
    var linkName=b.link&&br&&br.folderName?br.folderName(b.link):'';
    var todayY=jrYmd();
    var habTodayDone=b.habits.filter(function(h){return (h.marks||{})[todayY];}).length;

    var head='<div class="jr-top"><span class="jr-ic pt-ic" style="--pc:'+c+'">'+(b.emoji||'🎯')+'</span>'
      +'<div class="jr-tt pg-empty" contenteditable="true" data-ph="Назва проєкту" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
      +'<div class="jr-mode">'
      +'<button class="'+(mode==='full'?'on':'')+'" data-ptmode="'+id+'|full">Повний</button>'
      +'<button class="'+(mode==='half'?'on':'')+'" data-ptmode="'+id+'|half">Напів</button></div></div>';

    /* рядок звʼязку з папкою */
    var linkRow = b.link
      ? '<div class="pt-link on" data-ptunlink="'+id+'"><svg viewBox="0 0 24 24"><path d="M9 15 15 9M8 12a3 3 0 0 1 0-4l1-1a3 3 0 0 1 4 4M16 12a3 3 0 0 1 0 4l-1 1a3 3 0 0 1-4-4" stroke-linecap="round"/></svg>'
        +'<span>Папка «'+esc(linkName||'?')+'»</span>'
        +(pr.fTot?'<b>'+pr.fDone+'/'+pr.fTot+' задач</b>':'<b>немає задач</b>')
        +'<i class="pt-unlink">відв\u2019язати</i></div>'
      : (ptPick[id]
          ? '<div class="pt-picker">'+((br&&br.folderList?br.folderList():[]).filter(function(f){return f.key!==currentPtKey(id);}).map(function(f){
              return '<button class="pt-pick-i" data-ptlink="'+id+'|'+f.key+'"><span>'+(f.emoji||'📁')+'</span>'+esc(f.name)+'</button>';
            }).join('')||'<div class="pt-none">Немає інших папок</div>')
            +'<button class="pt-pick-x" data-ptpickclose="'+id+'">Скасувати</button></div>'
          : '<button class="pt-linkbtn" data-ptpick="'+id+'"><svg viewBox="0 0 24 24"><path d="M9 15 15 9M8 12a3 3 0 0 1 0-4l1-1a3 3 0 0 1 4 4M16 12a3 3 0 0 1 0 4l-1 1a3 3 0 0 1-4-4" stroke-linecap="round"/></svg> Прив\u2019язати папку</button>');

    /* прогрес-бар */
    var progBlock='<div class="pt-prog"><div class="pt-pbar"><i style="width:'+pr.pct+'%;background:'+c+'"></i></div>'
      +'<span class="pt-ppct" style="color:'+c+'">'+pr.pct+'%</span></div>'
      +(pr.total?'<div class="pt-pmeta">'+pr.done+' з '+pr.total+' кроків'
        +(pr.fTot?' · '+pr.fDone+'/'+pr.fTot+' у папці':'')
        +(pr.sTot?' · '+pr.sDone+'/'+pr.sTot+' у плані':'')+'</div>':'');

    if(mode==='half'){
      return '<div class="pg-content"><div class="jr pt" data-jrwrap="'+id+'">'+head
        +'<div class="pt-half">'+(b.link?'🔗 «'+esc(linkName)+'» · ':'')+pr.pct+'% · звички сьогодні '+habTodayDone+'/'+b.habits.length+'</div>'
        +'<div class="jr-foot"><span class="jr-chip">'+pr.pct+'% готово</span></div></div></div>';
    }

    /* ПЛАН — кроки-віхи */
    var stepsHTML=b.steps.map(function(s){
      return '<div class="jt-row"><button class="jt-cb'+(s.done?' on':'')+'" data-ptstep="'+id+'|'+s.id+'" style="'+(s.done?'--sc:'+c:'')+'"></button>'
        +'<span class="jt-t'+(s.done?' done':'')+'">'+esc(s.t)+'</span>'
        +'<button class="jt-x" data-ptstepdel="'+id+'|'+s.id+'">✕</button></div>';
    }).join('');
    var stepAdd=ptStepAdd[id]
      ? '<input class="jt-in" data-ptstepinput="'+id+'" placeholder="Крок плану… (Enter)" autocomplete="off">'
      : '<button class="jt-add" data-ptstepadd="'+id+'">＋ крок</button>';
    var planSec='<div class="pt-sec">План</div><div class="pt-caps">'+stepsHTML+'<div class="jt-addwrap">'+stepAdd+'</div></div>';

    /* ЗВИЧКИ — список з тижнем (варіант 1) */
    var week=ptWeekDays(), todayIdx=(jrParse(jrYmd()).getDay()+6)%7;
    var habHTML=b.habits.map(function(h){
      h.marks=h.marks||{};
      var streak=ptHabStreak(h.marks), hc=h.color||c;
      var cells=week.map(function(ymd,i){
        var on=h.marks[ymd]?'on':'', today=i===todayIdx?'today':'';
        return '<button class="pt-hd '+on+' '+today+'" data-pthab="'+id+'|'+h.id+'|'+ymd+'" style="'+(on?'--hc:'+hc:'')+'">'+PT_WD[i][0]+'</button>';
      }).join('');
      return '<div class="pt-hrow"><span class="pt-hemo" style="--hc:'+hc+'">'+(h.emoji||'✅')+'</span>'
        +'<div class="pt-hbody"><div class="pt-hname">'+esc(h.name)+'</div>'
        +'<div class="pt-hsub">'+(streak>1?'серія '+streak+' дн. 🔥':streak===1?'серія 1 день':'ще не почато')+'</div></div>'
        +'<div class="pt-hweek">'+cells+'</div>'
        +'<button class="jt-x pt-hdel" data-pthabdel="'+id+'|'+h.id+'">✕</button></div>';
    }).join('');
    var habAdd=ptHabAdd[id]
      ? '<input class="jt-in" data-pthabinput="'+id+'" placeholder="Нова звичка… (Enter)" autocomplete="off">'
      : '<button class="jt-add" data-pthabadd="'+id+'">＋ звичка</button>';
    var habSec='<div class="pt-sec">Звички <span class="pt-secc">'+habTodayDone+'/'+b.habits.length+' сьогодні</span></div>'
      +'<div class="pt-habs">'+habHTML+'<div class="jt-addwrap">'+habAdd+'</div></div>';

    var foot='<div class="jr-foot"><span class="jr-chip">'+pr.pct+'% · '+b.habits.length+' звич.'
      +(b.link?' · 🔗 папка':'')+'</span>'
      +'<button class="jr-expico" data-ptexport="'+id+'" title="Експорт для Claude">'
      +'<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0 4.5-4.5M12 15 7.5 10.5M4.5 19.5h15" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';

    return '<div class="pg-content"><div class="jr pt" data-jrwrap="'+id+'" style="--pc:'+c+'">'
      +head+linkRow+progBlock+planSec+habSec+foot+'</div></div>';
  }
