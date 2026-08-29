  /* ═══════════ ВІДЖЕТ «ЛОГ РІШЕНЬ» ═══════════ */
  var dlNew={}, dlOpen={}, dlArch={}, dlDays={};
  function dlDaysLeft(dec){
    var due=jrParse(dec.created); due.setDate(due.getDate()+(dec.days||30));
    return Math.ceil((due-jrParse(jrYmd()))/86400000);
  }
  function dlHTML(b){
    var id=b.id, list=b.decisions=b.decisions||[];
    var mode=b.dmode==='half'?'half':'full';
    var due=list.filter(function(d){return !d.verdict&&dlDaysLeft(d)<=0;});
    var wait=list.filter(function(d){return !d.verdict&&dlDaysLeft(d)>0;}).sort(function(a,c){return dlDaysLeft(a)-dlDaysLeft(c);});
    var done=list.filter(function(d){return d.verdict;}).slice().reverse();
    var score=done.reduce(function(s,d){return s+(d.verdict==='yes'?1:d.verdict==='part'?0.5:0);},0);
    var rate=done.length?Math.round(score/done.length*100):null;

    var head='<div class="jr-top"><span class="jr-ic dl-ic">'+pgsIc('decision')+'</span>'
      +'<div class="jr-tt pg-empty" contenteditable="true" data-ph="Лог рішень" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
      +'<div class="jr-mode">'
      +'<button class="'+(mode==='full'?'on':'')+'" data-dlmode="'+id+'|full">Повний</button>'
      +'<button class="'+(mode==='half'?'on':'')+'" data-dlmode="'+id+'|half">Напів</button></div></div>';

    if(mode==='half'){
      var line=due.length
        ? '<div class="dl-half dl-half-due">⚠️ '+due.length+' рішен'+(due.length===1?'ня чекає':'ь чекають')+' перевірки — перемкни в «Повний»</div>'
        : wait.length
          ? '<div class="dl-half">Наступна перевірка через '+dlDaysLeft(wait[0])+' дн. · активних: '+wait.length+'</div>'
          : '<div class="dl-half">Немає активних рішень</div>';
      return '<div class="pg-content"><div class="jr dl">'+head+line
        +'<div class="jr-foot"><span class="jr-chip">'+(rate!=null?'влучність '+rate+'% · ':'')+list.length+' ріш.</span></div></div></div>';
    }

    /* композер нового рішення */
    var days=dlDays[id]||30;
    var composer=dlNew[id]
      ? '<div class="dl-new"><textarea class="jr-ta dl-ta" data-dltext="'+id+'" placeholder="Яке рішення я приймаю?"></textarea>'
        +'<textarea class="jr-ta dl-ta dl-ta2" data-dlexp="'+id+'" placeholder="Що очікую в результаті?"></textarea>'
        +'<div class="dl-days">'+[7,14,30,90].map(function(n){
            return '<button class="dl-dchipb'+(days===n?' on':'')+'" data-dldays="'+id+'|'+n+'">'+n+' дн.</button>';
          }).join('')
        +'</div><div class="dl-newbtns"><button class="jr-done" data-dlsave="'+id+'">Зафіксувати</button>'
        +'<button class="jr-editb" data-dlcancel="'+id+'">Скасувати</button></div></div>'
      : '<button class="dl-addbtn" data-dlnew="'+id+'">＋ Нове рішення</button>';

    function rowHTML(dec,kind){
      var key=id+'|'+dec.id, opened=dlOpen[key];
      var d=jrParse(dec.created), left=dlDaysLeft(dec);
      var chip = kind==='due' ? '<span class="dl-tag dl-tag-due">час перевірити</span>'
        : kind==='wait' ? '<span class="dl-tag">через '+left+' дн.</span>'
        : '<span class="dl-tag dl-v-'+dec.verdict+'">'+(dec.verdict==='yes'?'✓ збулось':dec.verdict==='part'?'〰 частково':'✕ ні')+'</span>';
      var row='<div class="jr-row'+(opened?' open':'')+'" data-dlrow="'+key+'">'
        +'<span class="jr-dchip"><b>'+d.getDate()+'</b><span>'+JR_MON[d.getMonth()].slice(0,3)+'</span></span>'
        +'<span class="jr-prev">'+esc(dec.text||'')+'</span>'+chip+'</div>';
      var full='';
      if(opened){
        var inner='<div class="dl-lbl">Очікував</div><div class="jr-read">'+esc(dec.expect||'—')+'</div>';
        if(dec.verdict){
          inner+='<div class="dl-lbl">Що сталось</div><div class="jr-read">'+esc(dec.fact||'—')+'</div>';
        } else {
          inner+='<div class="dl-lbl">Що сталось насправді?</div>'
            +'<textarea class="jr-ta jr-ta-past" data-dlfact="'+key+'">'+esc(dec.fact||'')+'</textarea>'
            +'<div class="dl-verd">'
            +'<button class="dl-vb dl-vb-yes" data-dlverd="'+key+'|yes">✓ Збулось</button>'
            +'<button class="dl-vb dl-vb-part" data-dlverd="'+key+'|part">〰 Частково</button>'
            +'<button class="dl-vb dl-vb-no" data-dlverd="'+key+'|no">✕ Ні</button></div>'
            +(kind==='wait'?'<div class="dl-hint">Ще '+left+' дн. до планової перевірки — але можна закрити достроково</div>':'');
        }
        full='<div class="jr-full">'+inner+'</div>';
      }
      return row+full;
    }

    var dueHtml=due.length?'<div class="dl-sec dl-sec-due">Час перевірити</div>'+due.map(function(x){return rowHTML(x,'due');}).join(''):'';
    var waitHtml=wait.length?'<div class="dl-sec">Чекають</div>'+wait.map(function(x){return rowHTML(x,'wait');}).join(''):'';
    var archHtml='';
    if(done.length){
      archHtml='<button class="dl-archbtn" data-dlarch="'+id+'">Архів · '+done.length+(dlArch[id]?' ▴':' ▾')+'</button>'
        +(dlArch[id]?done.slice(0,10).map(function(x){return rowHTML(x,'done');}).join(''):'');
    }
    var empty=!list.length?'<div class="dl-empty">Зафіксуй перше рішення і що від нього очікуєш — через обраний строк я підійму його на перевірку.</div>':'';

    var foot='<div class="jr-foot"><span class="jr-chip">'
      +(rate!=null?'влучність '+rate+'%':'без перевірених')+' · '+list.length+' ріш.</span>'
      +'<button class="jr-expico" data-dlexport="'+id+'" title="Експорт для Claude">'
      +'<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0 4.5-4.5M12 15 7.5 10.5M4.5 19.5h15" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';

    return '<div class="pg-content"><div class="jr dl">'+head+composer+empty
      +'<div class="jr-past">'+dueHtml+waitHtml+'</div>'+archHtml+foot+'</div></div>';
  }
  function dlExport(b){
    var list=b.decisions||[]; if(!list.length)return;
    var md='# '+(b.title||'Лог рішень')+'\n\n';
    var fmt=function(y){var d=jrParse(y);return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear();};
    list.slice().reverse().forEach(function(d){
      md+='## '+fmt(d.created)+' — '+d.text+'\n\n'
        +'- Очікував: '+(d.expect||'—')+'\n'
        +'- Строк перевірки: '+(d.days||30)+' дн.\n'
        +(d.verdict?('- Вердикт: '+(d.verdict==='yes'?'збулось':d.verdict==='part'?'частково':'не збулось')
          +(d.reviewed?' ('+fmt(d.reviewed)+')':'')+'\n- Що сталось: '+(d.fact||'—')+'\n'):'- Статус: чекає перевірки\n')+'\n';
    });
    var name='decisions-'+jrYmd()+'.md';
    try{
      var file=new File([md],name,{type:'text/markdown'});
      if(navigator.canShare&&navigator.canShare({files:[file]})){ navigator.share({files:[file],title:name}); return; }
    }catch(_){}
    try{
      var a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));
      a.download=name; document.body.appendChild(a); a.click();
      setTimeout(function(){ try{URL.revokeObjectURL(a.href);a.remove();}catch(_){} },1000);
    }catch(_){ try{ prompt('Скопіюй лог рішень:',md); }catch(__){} }
  }

