  /* ═══════════ ВІДЖЕТ «ТРЕКЕР ЗВИЧОК» (список з тижнем) ═══════════ */
  var hbAdd={};
  var HB_COLORS=['#34c77b','#7c8cff','#f0b429','#ff6b9d','#4ecdc4','#a78bfa'];
  function hbHTML(b){
    var id=b.id; b.habits=b.habits||[];
    var mode=b.hmode==='half'?'half':'full';
    var todayY=jrYmd();
    var doneToday=b.habits.filter(function(h){return (h.marks||{})[todayY];}).length;

    var head='<div class="jr-top"><span class="jr-ic hb-ic">'+pgsIc('habits')+'</span>'
      +'<div class="jr-tt pg-empty" contenteditable="true" data-ph="Звички" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
      +'<div class="jr-mode">'
      +'<button class="'+(mode==='full'?'on':'')+'" data-hbmode="'+id+'|full">Повний</button>'
      +'<button class="'+(mode==='half'?'on':'')+'" data-hbmode="'+id+'|half">Напів</button></div></div>';

    if(mode==='half'){
      return '<div class="pg-content"><div class="jr hb" data-jrwrap="'+id+'">'+head
        +'<div class="pt-half">Сьогодні '+doneToday+' з '+b.habits.length+' звичок ✓</div>'
        +'<div class="jr-foot"><span class="jr-chip">'+b.habits.length+' звич.</span></div></div></div>';
    }

    var week=ptWeekDays(), todayIdx=(jrParse(todayY).getDay()+6)%7;
    var rows=b.habits.map(function(h,idx){
      h.marks=h.marks||{};
      var streak=ptHabStreak(h.marks), hc=h.color||HB_COLORS[idx%HB_COLORS.length];
      var weekN=week.filter(function(y){return h.marks[y];}).length;
      var sub=streak>1?('серія '+streak+' дн.'+(streak>=7?' 🔥':''))
        :streak===1?'серія 1 день':'ще не почато';
      var cells=week.map(function(ymd,i){
        var on=h.marks[ymd]?'on':'', today=i===todayIdx?'today':'';
        return '<button class="pt-hd '+on+' '+today+'" data-hbmark="'+id+'|'+h.id+'|'+ymd+'" style="'+(on?'--hc:'+hc:'')+'">'+PT_WD[i][0]+'</button>';
      }).join('');
      return '<div class="pt-hrow"><span class="pt-hemo" style="--hc:'+hc+'" data-hbemo="'+id+'|'+h.id+'">'+(h.emoji||'✅')+'</span>'
        +'<div class="pt-hbody"><div class="pt-hname">'+esc(h.name)+'</div>'
        +'<div class="pt-hsub">'+sub+' · '+weekN+'/7 тиждень</div></div>'
        +'<div class="pt-hweek">'+cells+'</div>'
        +'<button class="jt-x pt-hdel" data-hbdel="'+id+'|'+h.id+'">✕</button></div>';
    }).join('');

    var add=hbAdd[id]
      ? '<input class="jt-in" data-hbinput="'+id+'" placeholder="Нова звичка… (Enter)" autocomplete="off">'
      : '<button class="jt-add" data-hbadd="'+id+'">＋ Нова звичка</button>';

    var foot='<div class="jr-foot"><span class="jr-chip">'+b.habits.length+' звич'+(b.habits.length===1?'ка':b.habits.length<5?'ки':'ок')
      +' · сьогодні '+doneToday+'/'+b.habits.length+'</span>'
      +'<button class="jr-expico" data-hbexport="'+id+'" title="Експорт для Claude">'
      +'<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0 4.5-4.5M12 15 7.5 10.5M4.5 19.5h15" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';

    return '<div class="pg-content"><div class="jr hb" data-jrwrap="'+id+'">'+head
      +'<div class="pt-habs">'+rows+'<div class="jt-addwrap">'+add+'</div></div>'+foot+'</div></div>';
  }
  function hbExport(b){
    var md='# '+(b.title||'Звички')+'\n\n';
    (b.habits||[]).forEach(function(h){
      var marks=h.marks||{}, days=Object.keys(marks).filter(function(k){return marks[k];}).sort();
      md+='## '+(h.emoji||'')+' '+h.name+'\n\n'
        +'- Серія: '+ptHabStreak(marks)+' дн.\n- Всього відмічено: '+days.length+' днів\n';
      if(days.length) md+='- Останні: '+days.slice(-7).join(', ')+'\n';
      md+='\n';
    });
    var name='habits-'+jrYmd()+'.md';
    try{ var file=new File([md],name,{type:'text/markdown'});
      if(navigator.canShare&&navigator.canShare({files:[file]})){ navigator.share({files:[file],title:name}); return; } }catch(_){}
    try{ var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));
      a.download=name; document.body.appendChild(a); a.click();
      setTimeout(function(){ try{URL.revokeObjectURL(a.href);a.remove();}catch(_){} },1000);
    }catch(_){ try{ prompt('Скопіюй звички:',md); }catch(__){} }
  }

