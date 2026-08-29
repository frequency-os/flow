  /* ═══════════ ВІДЖЕТ «ЩОДЕННИК» (варіант A — стрічка днів) ═══════════ */
  var JR_WD=['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
  var JR_MON=['Січня','Лютого','Березня','Квітня','Травня','Червня','Липня','Серпня','Вересня','Жовтня','Листопада','Грудня'];
  var jrOpen={};   /* які минулі дні розгорнуті: 'blockId|ymd' -> true */
  var jrEdit={};   /* які минулі дні у режимі редагування */
  function jrYmd(d){ d=d||new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function jrParse(ymd){ var p=ymd.split('-').map(Number); return new Date(p[0],p[1]-1,p[2]); }
  function jrStreak(b,today){
    var n=0, d=jrParse(today);
    if(!((b.entries||{})[today]||'').trim()) d.setDate(d.getDate()-1); /* сьогодні ще пусто — рахуємо від вчора */
    while(((b.entries||{})[jrYmd(d)]||'').trim()){ n++; d.setDate(d.getDate()-1); }
    return n;
  }
  function jrHTML(b){
    var id=b.id, e=b.entries=b.entries||{}, td=b.todos=b.todos||{};
    var today=jrYmd(), tD=jrParse(today);
    var mode=(b.jmode==='half'||b.jmode==='month'||b.jmode==='ai')?b.jmode:'full';
    var todayTxt=e[today]||'', todayTd=td[today]||[];
    var firstLine=(todayTxt.trim().split('\n')[0]||'').slice(0,90);
    var doneN=todayTd.filter(function(x){return x.done;}).length;

    var head='<div class="jr-top"><span class="jr-ic">'+pgsIc('journal')+'</span>'
      +'<div class="jr-tt pg-empty" contenteditable="true" data-ph="Щоденник" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
      +'<div class="jr-mode jr-mode4">'
      +'<button class="'+(mode==='full'?'on':'')+'" data-jrmode="'+id+'|full">День</button>'
      +'<button class="'+(mode==='month'?'on':'')+'" data-jrmode="'+id+'|month">Місяць</button>'
      +'<button class="'+(mode==='ai'?'on':'')+'" data-jrmode="'+id+'|ai">Аналіз</button>'
      +'<button class="'+(mode==='half'?'on':'')+'" data-jrmode="'+id+'|half">Напів</button></div></div>';

    function todosHTML(ymd,list,compact){
      if(!list||!list.length) return '';
      return '<div class="jt-list'+(compact?' jt-compact':'')+'">'+list.map(function(t){
        return '<div class="jt-row"><button class="jt-cb'+(t.done?' on':'')+'" data-jttoggle="'+id+'|'+ymd+'|'+t.id+'"></button>'
          +'<span class="jt-t'+(t.done?' done':'')+'">'+esc(t.t)+'</span>'
          +'<button class="jt-x" data-jtdel="'+id+'|'+ymd+'|'+t.id+'">✕</button></div>';
      }).join('')+'</div>';
    }
    var addTodo = jrTdAdd[id]
      ? '<input class="jt-in" data-jtinput="'+id+'" placeholder="Нове туду… (Enter)" autocomplete="off">'
      : '<button class="jt-add" data-jtadd="'+id+'">＋ туду</button>';

    var progChip = todayTd.length?'<span class="jt-prog'+(doneN===todayTd.length?' all':'')+'">'+doneN+'/'+todayTd.length+' ✓</span>':'';

    var wm = mode==='full'?'<span class="jr-wm">'+tD.getDate()+'</span>':'';

    /* нові режими: місячна сітка та зведення AI */
    if(mode==='month'||mode==='ai'){
      return '<div class="pg-content"><div class="jr jr2 jew" data-jrwrap="'+id+'">'+head
        +(mode==='month'?jeMonthHTML(b):jeAiHTML(b))+'</div></div>';
    }

    var todosBlock = (todayTd.length||jrTdAdd[id])
      ? '<div class="jt-caps">'+todosHTML(today,todayTd)+'<div class="jt-addwrap">'+addTodo+'</div></div>'
      : '<div class="jt-addwrap jt-addwrap-bare">'+addTodo+'</div>';

    var todayCard = mode==='half'
      ? '<div class="jr-dline jr-dline-sm"><span class="jr-dnum">'+tD.getDate()+'</span>'
        +'<span class="jr-dmon">'+JR_MON[tD.getMonth()]+' · '+JR_WD[tD.getDay()]+'</span>'
        +progChip+'<span class="jr-live">сьогодні</span></div>'
        +'<div class="jr-snippet">'+(firstLine?esc(firstLine)+'…':'Запису ще немає')+'</div>'
        +todosHTML(today,todayTd.filter(function(x){return !x.done;}).slice(0,3),true)
      : '<div class="jr-dline"><span class="jr-dnum">'+tD.getDate()+'</span>'
        +'<span class="jr-dmon">'+JR_MON[tD.getMonth()]+' · '+JR_WD[tD.getDay()]+'</span>'
        +progChip+'<button class="je-openb" data-jeday="'+id+'|'+today+'">аркуш ↗</button></div>'
        +'<textarea class="jr-ta" data-jrtoday="'+id+'" placeholder="Аркуш чистий. Що сьогодні було важливим?">'+esc(todayTxt)+'</textarea>'
        +todosBlock;

    var past='';
    if(mode==='full'){
      var days=Object.keys(e).concat(Object.keys(td)).filter(function(k,i,a){return a.indexOf(k)===i;})
        .filter(function(k){return k!==today&&((e[k]||'').trim()||(td[k]||[]).length);})
        .sort().reverse().slice(0,14);
      past=days.map(function(ymd){
        var d=jrParse(ymd), txt=e[ymd]||'', dtd=td[ymd]||[];
        var prev=(txt.trim().split('\n')[0]||(dtd.length?dtd.length+' туду':'')).slice(0,80);
        var dDone=dtd.filter(function(x){return x.done;}).length;
        var opened=jrOpen[id+'|'+ymd], editing=jrEdit[id+'|'+ymd];
        var row='<div class="jr-row'+(opened?' open':'')+'" data-jrrow="'+id+'|'+ymd+'">'
          +'<span class="jr-dchip"><b>'+d.getDate()+'</b><span>'+JR_WD[d.getDay()]+'</span></span>'
          +'<span class="jr-prev">'+esc(prev)+'</span>'
          +(dtd.length?'<span class="jt-prog'+(dDone===dtd.length?' all':'')+'">'+dDone+'/'+dtd.length+'</span>':'')
          +'<span class="jr-dot"></span></div>';
        var full='';
        if(opened){
          full=editing
            ? '<div class="jr-full"><textarea class="jr-ta jr-ta-past" data-jrpast="'+id+'|'+ymd+'">'+esc(txt)+'</textarea>'
              +todosHTML(ymd,dtd)
              +'<button class="jr-done" data-jrdone="'+id+'|'+ymd+'">Готово</button></div>'
            : '<div class="jr-full">'+(txt?'<div class="jr-read">'+esc(txt).replace(/\n/g,'<br>')+'</div>':'')
              +todosHTML(ymd,dtd)
              +'<button class="jr-editb" data-jredit="'+id+'|'+ymd+'">✏️ Редагувати</button></div>';
        }
        return row+full;
      }).join('');
      if(past) past='<div class="jr-past">'+past+'</div>';
    }

    var total=Object.keys(e).filter(function(k){return (e[k]||'').trim();}).length;
    var streak=jrStreak(b,today);
    var foot='<div class="jr-foot"><span class="jr-chip">'+total+' запис'+(total===1?'':total<5&&total>0?'и':'ів')
      +(streak>1?' · серія '+streak+' дн. 🔥':'')+'</span>'
      +'<button class="jr-expico" data-jrexport="'+id+'" title="Експорт для Claude">'
      +'<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0 4.5-4.5M12 15 7.5 10.5M4.5 19.5h15" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';

    return '<div class="pg-content"><div class="jr jr2" data-jrwrap="'+id+'">'+wm+head+todayCard+past+foot+'</div></div>';
  }
  var jrTdAdd={}; /* у якого віджета відкрите поле нового туду */
