
(function(){
"use strict";
try{
  if(window.__fd26Month) return; window.__fd26Month=true;

  var DOWU=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
  var MPAL=['#e8843c','#5b8def','#8b7cff','#34c77b','#f0b429'];
  var MAXMF=3;

  /* ── іконографія: SVG-штрих 1.9 + крапкові акценти ── */
  var ICO={
    cal:'<rect x="3" y="4.6" width="18" height="16.4" rx="4"/><path d="M8 2.8v3.4M16 2.8v3.4M3 9.9h18"/><circle cx="8.3" cy="14.4" r="1.2" fill="currentColor" stroke="none"/><path d="M12.4 14.4h4M8.3 17.6h8.1" opacity=".55"/>',
    target:'<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.7" opacity=".55"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    compass:'<circle cx="12" cy="12" r="8.6"/><path d="M15.4 8.6l-2.1 4.7-4.7 2.1 2.1-4.7z" fill="currentColor" stroke="none"/>',
    week:'<rect x="3" y="4.6" width="18" height="16.4" rx="4"/><path d="M3 9.9h18M9 9.9V21M15 9.9V21"/>',
    layers:'<path d="M12 3.2l8.3 4.5-8.3 4.5-8.3-4.5z"/><path d="M4.2 12.3l7.8 4.2 7.8-4.2" opacity=".7"/><path d="M4.2 16.5l7.8 4.2 7.8-4.2" opacity=".4"/>',
    inbox:'<path d="M5.4 4.6h13.2a2 2 0 0 1 1.9 1.4l2 6v5a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2v-5l2-6a2 2 0 0 1 1.9-1.4z"/><path d="M2.7 12h5l1.5 2.8h5.6l1.5-2.8h5"/>',
    arw:'<path d="M4.5 12h13.4"/><path d="M13.2 7.3l4.7 4.7-4.7 4.7"/>',
    chevD:'<polyline points="6 9.2 12 15.2 18 9.2"/>',
    chevR:'<polyline points="9.2 6 15.2 12 9.2 18"/>',
    plus:'<path d="M12 5.4v13.2M5.4 12h13.2"/>',
    split:'<circle cx="5.6" cy="12" r="2.1"/><path d="M7.7 12h4.1M11.8 12c2.8 0 2.8-5 5.6-5H20M11.8 12c2.8 0 2.8 5 5.6 5H20"/><polyline points="17.6 4.6 20 7 17.6 9.4"/><polyline points="17.6 14.6 20 17 17.6 19.4"/>',
    gauge:'<path d="M4.4 15.8a7.8 7.8 0 1 1 15.2 0"/><path d="M12 15.8l3.5-4.7"/><circle cx="12" cy="15.8" r="1.3" fill="currentColor" stroke="none"/>',
    wand:'<path d="M5.4 18.6L14.6 9.4"/><path d="M17.6 3.9l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" fill="currentColor" stroke="none"/><path d="M8.2 3.6l.55 1.35L10.1 5.5l-1.35.55L8.2 7.4l-.55-1.35L6.3 5.5l1.35-.55z" fill="currentColor" stroke="none" opacity=".8"/><path d="M18.6 12.6l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5z" fill="currentColor" stroke="none" opacity=".6"/>',
    check:'<polyline points="4.6 12.6 9.8 17.8 19.4 6.8"/>',
    trash:'<path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7M6.3 6.5l.9 12.2a2 2 0 0 0 2 1.8h5.6a2 2 0 0 0 2-1.8l.9-12.2"/>'
  };
  function ic(n,sz){ sz=sz||14;
    return '<svg class="i" width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24" aria-hidden="true">'+(ICO[n]||'')+'</svg>'; }
  function ringSm(pc,col){ var r=10, C=2*Math.PI*r;
    return '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" style="transform:rotate(-90deg)">'+
      '<circle cx="13" cy="13" r="'+r+'" fill="none" stroke="rgba(255,255,255,.09)" stroke-width="2.6"/>'+
      '<circle cx="13" cy="13" r="'+r+'" fill="none" stroke="'+(col||'#8b7cff')+'" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-Math.max(0,Math.min(1,pc)))).toFixed(1)+'"/></svg>'; }

  function esc2(s){ try{ return esc(s); }catch(_){ return String(s==null?'':s); } }
  function escA(s){ try{ return escAttr(s); }catch(_){ return String(s==null?'':s).replace(/"/g,'&quot;'); } }
  function nz(n){ return Math.round(n*10)/10; }

  /* ── ключ місяця та сховище фокусів: p.fd26mf['YYYY-MM'] ── */
  function curYm(p){ return p.calMonth || plTodayStr().slice(0,7); }
  function mfList(p,ym){
    if(!p.fd26mf || typeof p.fd26mf!=='object') p.fd26mf={};
    var ks=Object.keys(p.fd26mf).sort();
    while(ks.length>8){ delete p.fd26mf[ks[0]]; ks.shift(); }   // не ростемо вічно
    if(!Array.isArray(p.fd26mf[ym])) p.fd26mf[ym]=[];
    return p.fd26mf[ym];
  }
  function goalById(id){
    try{ return (goalsData.goals||[]).find(function(g){ return (g.id||g.name)===id; })||null; }catch(_){ return null; }
  }
  function mfColor(f,i){
    var g=f&&f.goalId?goalById(f.goalId):null;
    return (g&&g.color)||f.color||MPAL[i%MPAL.length];
  }
  function mfEmoji(f){
    var g=f&&f.goalId?goalById(f.goalId):null;
    return (g&&g.emoji)||f.emoji||ic('target',14);
  }
  function prevYm(ym){ var y=+ym.slice(0,4), mo=+ym.slice(5,7)-1;
    if(mo<1){ mo=12; y--; } return y+'-'+String(mo).padStart(2,'0'); }
  function ritDone(p,ym){ if(!p.fd26mrit||typeof p.fd26mrit!=='object') p.fd26mrit={};
    return p.fd26mrit[ym]||null; }
  function mondayOf(ds){
    var d=new Date(ds+'T12:00:00'); var dow=(d.getDay()+6)%7;
    d.setDate(d.getDate()-dow); return ymdLocal(d);
  }

  /* ── читання блоків дня БЕЗ мутації сховища (як у plMonthCalHTML) ── */
  function blocksRO(p,ds){
    var saved=Array.isArray(p.blocksByDay[ds])?p.blocksByDay[ds]:[];
    var skip=(p.recurSkip&&p.recurSkip[ds])||[];
    var extra=[];
    (p.recurring||[]).forEach(function(tpl){
      if(skip.indexOf(tpl.id)>=0) return;
      try{ if(!plRecurMatchesDay(tpl,ds)) return; }catch(_){ return; }
      if(saved.some(function(b){ return b.fromRecur===tpl.id; })) return;
      extra.push({h:tpl.h,endH:tpl.endH,t:tpl.t,c:tpl.c,link:tpl.link,fromRecur:tpl.id});
    });
    return saved.concat(extra);
  }

  /* ── зведення місяця: години по цілях, тижні, дні ── */
  function monthStats(p,ym){
    var yy=+ym.slice(0,4), mm=+ym.slice(5,7);
    var dim=new Date(yy,mm,0).getDate();
    var CAP=Math.max(1,p.dayEnd-p.dayStart);
    var byGoal={}, totalUsed=0, totalCap=0, weeks=[], wmap={};
    for(var d=1;d<=dim;d++){
      var ds=ym+'-'+String(d).padStart(2,'0');
      var list=blocksRO(p,ds), used=0, dayGoal={};
      list.forEach(function(b){
        var e=(b.endH!=null)?b.endH:(b.h+(b.span||1));
        var dur=Math.max(0,Math.min(e,p.dayEnd)-Math.max(b.h,p.dayStart));
        if(dur<=0) return;
        used+=dur;
        var k=(b.link&&b.link.goalId)||'_none';
        byGoal[k]=(byGoal[k]||0)+dur;
        dayGoal[k]=(dayGoal[k]||0)+dur;
      });
      used=Math.min(used,CAP);
      totalUsed+=used; totalCap+=CAP;
      var mon=mondayOf(ds);
      if(!wmap[mon]){ wmap[mon]={mon:mon,days:[],used:0,cap:0,byGoal:{}}; weeks.push(wmap[mon]); }
      var w=wmap[mon];
      w.days.push({ds:ds,d:d,used:used,byGoal:dayGoal});
      w.used+=used; w.cap+=CAP;
      Object.keys(dayGoal).forEach(function(k){ w.byGoal[k]=(w.byGoal[k]||0)+dayGoal[k]; });
    }
    weeks.sort(function(a,b){ return a.mon<b.mon?-1:1; });
    return {byGoal:byGoal,used:totalUsed,cap:totalCap,free:Math.max(0,totalCap-totalUsed),weeks:weeks,CAP:CAP,dim:dim};
  }

  /* ── зв'язок місяць → тиждень: створити фокус поточного тижня ── */
  function ensureWeekFx(p,mf){
    var wk0=mondayOf(plTodayStr());
    if(!p.fd26fx||typeof p.fd26fx!=='object') p.fd26fx={};
    if(!Array.isArray(p.fd26fx[wk0])) p.fd26fx[wk0]=[];
    var arr=p.fd26fx[wk0];
    var ex=null;
    arr.forEach(function(f){ if(f.mfId===mf.id) ex=f; });
    if(ex) return ex;
    if(arr.length>=3) return null;
    var nf={id:'fx_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
            name:mf.name, goalId:mf.goalId||'', mfId:mf.id};
    arr.push(nf); return nf;
  }
  function weekFxFor(p,mfId){
    var wk0=mondayOf(plTodayStr());
    var arr=(p.fd26fx&&p.fd26fx[wk0])||[];
    var r=null; arr.forEach(function(f){ if(f.mfId===mfId) r=f; });
    return r;
  }
  /* скільки задач тижня працює на цей фокус місяця */
  function tasksForMf(p,mfId){
    var wf=weekFxFor(p,mfId);
    return (p.tasks||[]).filter(function(t){
      if(t.mf26===mfId) return true;
      return !!(wf && t.fx26===wf.id);
    });
  }

  function toast(m){ try{ plToast(m); }catch(_){} }

  /* ══════════ РЕНДЕР КАРТКИ ══════════ */
  function cardHTML(p){
    var ym=curYm(p), st=monthStats(p,ym), fxs=mfList(p,ym);
    var MN=(typeof PL_MONTH_NAMES!=='undefined')?PL_MONTH_NAMES:['','','','','','','','','','','',''];
    var mname=MN[(+ym.slice(5,7))-1]||'';
    var goals=[];
    try{ goals=(goalsData.goals||[]).slice(); }catch(_){}

    var wkTasks=(p.tasks||[]).filter(function(t){ return t.scope==='week' && !t.done; }).length;
    var moTasks=(p.tasks||[]).filter(function(t){ return t.scope==='month' && !t.done; });
    var planned=fxs.reduce(function(a,f){ return a+(+f.hours||0); },0);

    /* рівні */
    var arw='<div class="a">'+ic('arw',11)+'</div>';
    var lv='<div class="f26m-lv">'+
      '<div class="n" data-f26m-lvl="goals">'+ic('compass',13)+'<b>'+goals.length+'</b><span>ЦІЛІ</span></div>'+arw+
      '<div class="n cur" data-f26m-lvl="focus">'+ic('target',13)+'<b>'+fxs.length+'</b><span>ФОКУСИ</span></div>'+arw+
      '<div class="n" data-f26m-lvl="week">'+ic('week',13)+'<b>'+wkTasks+'</b><span>ТИЖНІ</span></div>'+arw+
      '<div class="n'+(moTasks.length?' debt':'')+'" data-f26m-lvl="dist">'+ic('inbox',13)+'<b>'+moTasks.length+'</b><span>БЕЗ ТИЖНЯ</span></div>'+
    '</div>';

    /* цілі, які живить місяць */
    var maxG=1; goals.forEach(function(g){ var h=st.byGoal[g.id||g.name]||0; if(h>maxG) maxG=h; });
    var goalsHtml=goals.length? goals.map(function(g){
      var key=g.id||g.name, h=st.byGoal[key]||0, cc=g.color||'#5b8def';
      return '<div class="f26m-g'+(h?'':' zero')+'" data-f26m-goal="'+escA(key)+'">'+
        '<div class="e" style="background:color-mix(in srgb,'+cc+' 20%,transparent);color:'+cc+'">'+(g.emoji||ic('compass',14))+'</div>'+
        '<div class="m"><h6>'+esc2(g.name||'Ціль')+'</h6>'+
        '<div class="f26m-bar"><i style="width:'+(h/maxG*100).toFixed(0)+'%;background:'+cc+'"></i></div></div>'+
        '<span class="v">'+nz(h)+' год</span></div>';
    }).join('') : '<div class="f26m-empty">Ще нема цілей. Додай їх у Горизонті — місяць почне їх живити.</div>';

    /* фокуси місяця */
    var fxHtml=fxs.map(function(f,i){
      var cc=mfColor(f,i), g=f.goalId?goalById(f.goalId):null;
      var fact=f.goalId?(st.byGoal[f.goalId]||0):0;
      var plan=+f.hours||0;
      var pc=plan?Math.min(100,fact/plan*100):0;
      var ts=tasksForMf(p,f.id), dn=ts.filter(function(t){return t.done;}).length;
      var wf=weekFxFor(p,f.id);
      var meta=[];
      meta.push(ts.length?('<b>'+ts.length+' задач</b>'+(dn?' · '+dn+' готово':'')):'<u>без задач</u>');
      meta.push(wf?('<b>'+ic('week',10)+' у тижні</b>'):'<u>не в тижні</u>');
      return '<div class="f26m-f" data-f26m-fx="'+escA(f.id)+'" style="box-shadow:inset 3px 0 0 '+cc+'">'+
        '<div class="e" style="background:color-mix(in srgb,'+cc+' 20%,transparent);color:'+cc+'">'+mfEmoji(f)+'</div>'+
        '<div class="m"><div class="t"><h5>'+esc2(f.name)+'</h5>'+
        '<span>'+(plan?(nz(fact)+' / '+plan+' год'):(nz(fact)+' год')) +'</span></div>'+
        '<div class="f26m-bar"><i style="width:'+pc.toFixed(0)+'%;background:'+cc+';box-shadow:0 0 8px '+cc+'55"></i></div>'+
        '<div class="f">'+meta.join(' · ')+(g?' · '+esc2(g.name):'')+'</div></div></div>';
    }).join('');
    if(fxs.length<MAXMF){
      fxHtml+='<button class="f26m-ghost" data-f26m-fxadd>'+ic('plus',13)+'Додати фокус'+(fxs.length?' ('+(MAXMF-fxs.length)+' вільно)':' місяця')+'</button>';
    }
    if(!fxs.length){
      fxHtml='<div class="f26m-empty">Обери до 3 фокусів — усе інше місяця буде другорядним.</div>'+fxHtml;
    }

    /* тижні */
    var td=plTodayStr(), curMon=mondayOf(td);
    function paceHTML(){
      if(!fxs.length || dayN<=0) return '';
      var lines='', anyPlan=false;
      fxs.forEach(function(f,i){
        var plan=+f.hours||0; if(!plan) return; anyPlan=true;
        var fact=f.goalId?(st.byGoal[f.goalId]||0):0;
        var expct=plan*dayN/st.dim, delta=fact-expct;
        var daysLeft=Math.max(1,st.dim-dayN);
        var need=Math.max(0,(plan-fact)/daysLeft);
        var cc=mfColor(f,i);
        var stat = fact>=plan ? '<b>закрито</b>'
          : (delta>=-1 ? '<b>у темпі</b> · '+nz(need)+' год/день'
                       : '<u>відстає на '+nz(-delta)+' год</u> · треба '+nz(need)+' год/день');
        lines+='<div class="f26m-pc"><span class="dot" style="background:'+cc+'"></span>'+
          '<span class="nm">'+esc2(f.name)+'</span><span class="st">'+stat+'</span></div>';
      });
      if(!anyPlan) return '';
      var tPc=dayN/st.dim;
      return '<div class="f26m-lbl">'+ic('gauge',12)+'Пульс місяця</div>'+
        '<div class="f26m-pace">'+
        '<div class="tp"><span>День <b>'+dayN+'</b> з '+st.dim+'</span><span>минуло '+Math.round(tPc*100)+'%</span></div>'+
        '<div class="f26m-bar tm"><i style="width:'+(tPc*100).toFixed(0)+'%"></i></div>'+
        lines+'</div>';
    }
    var wksHtml=st.weeks.map(function(w,i){
      var pc=w.cap?w.used/w.cap*100:0, hot=pc>85;
      var segs='';
      Object.keys(w.byGoal).forEach(function(k){
        var g=k!=='_none'?goalById(k):null;
        var cc=(g&&g.color)||'rgba(143,138,168,.55)';
        segs+='<i style="width:'+(w.used?(w.byGoal[k]/w.cap*100):0).toFixed(1)+'%;background:'+cc+'"></i>';
      });
      var d0=+w.days[0].d, d1=+w.days[w.days.length-1].d;
      var open=(p._f26mw===w.mon);
      var det='';
      if(open){
        var pad=(new Date(w.days[0].ds+'T12:00:00').getDay()+6)%7;
        var cells='';
        for(var q=0;q<pad;q++) cells+='<div></div>';
        w.days.forEach(function(dd){
          var stk='';
          Object.keys(dd.byGoal).forEach(function(k){
            var g2=k!=='_none'?goalById(k):null;
            var cc2=(g2&&g2.color)||'rgba(143,138,168,.5)';
            stk+='<i style="height:'+(dd.byGoal[k]/st.CAP*26).toFixed(1)+'px;background:'+cc2+'"></i>';
          });
          cells+='<div class="c'+(dd.ds===td?' td':'')+'" data-f26m-day="'+escA(dd.ds)+'">'+
            '<div class="dd">'+DOWU[(new Date(dd.ds+'T12:00:00').getDay()+6)%7]+'</div>'+
            '<div class="nn">'+dd.d+'</div><div class="st">'+stk+'</div>'+
            '<div class="hh">'+(dd.used?nz(dd.used)+'г':'—')+'</div></div>';
        });
        det='<div class="f26m-wd">'+cells+'</div>';
      }
      return '<div class="f26m-w'+(w.mon===curMon?' cur':'')+(hot?' hot':'')+(open?' on':'')+'" data-f26m-wk="'+escA(w.mon)+'">'+
        '<div class="n">Т'+(i+1)+'</div><div class="m">'+
        '<div class="t"><span class="d">'+d0+'–'+d1+' '+(mname||'').toLowerCase()+(w.mon===curMon?' · зараз':'')+'</span>'+
        '<span class="h">'+nz(w.used)+' / '+w.cap+' год</span></div>'+
        '<div class="f26m-bar">'+segs+'<i style="width:'+Math.max(0,100-pc).toFixed(1)+'%;background:rgba(255,255,255,.05)"></i></div>'+
        '</div><span class="ar">'+ic('chevR',12)+'</span></div>'+det;
    }).join('');

    var sub=mname+' '+ym.slice(0,4)+' · '+fxs.length+' фокус'+(fxs.length===1?'':(fxs.length>=2&&fxs.length<=4?'и':'ів'))+
            ' · вільно '+Math.round(st.free)+' год';
    var over=planned>st.free;
    var tdYm=plTodayStr().slice(0,7), dayN=(ym<tdYm)?st.dim:(ym>tdYm?0:+plTodayStr().slice(8,10));
    var mRing='<div class="f26m-ring" title="День '+dayN+' з '+st.dim+'">'+ringSm(dayN/st.dim)+'<b>'+dayN+'</b></div>';

    return '<div class="f26m'+(p.collapsed.f26mplan?'':' open')+'" id="f26mCard">'+
      '<div class="f26m-h" data-f26m-fold>'+
        '<div class="f26m-hi">'+ic('cal',17)+'</div>'+
        '<div style="flex:1;min-width:0"><h4>Планування місяця</h4><div class="sb">'+esc2(sub)+'</div></div>'+
        mRing+'<span class="f26m-pill'+(over?' warm':'')+'">'+Math.round(st.used)+' / '+Math.round(st.cap)+'</span>'+
        '<div class="f26m-chev">'+ic('chevD',13)+'</div>'+
      '</div>'+
      '<div class="f26m-fold"><div><div class="f26m-in">'+
        lv+
        '<div class="f26m-hint">Тап по «БЕЗ ТИЖНЯ» — розкласти задачі місяця. Порожній рівень означає розрив у ланцюгу.</div>'+
        '<div class="f26m-lbl">'+ic('compass',12)+'Цілі, які живить місяць</div>'+goalsHtml+
        '<div class="f26m-hint">Ціль з <b>0 год</b> цього місяця — це не ціль, а бажання.</div>'+
        '<div class="f26m-lbl">'+ic('target',12)+'Фокус місяця · '+fxs.length+' / '+MAXMF+'</div>'+fxHtml+
        (planned?('<div class="f26m-hint">Заплановано <b>'+planned+' год</b> із вільних <b>'+Math.round(st.free)+' год</b>.'+
          (over?' <em>Фокуси не влазять у бюджет — зменш або звільни години.</em>':'')+'</div>'):'')+
        paceHTML()+
        '<div class="f26m-lbl">'+ic('layers',12)+'Розподіл по тижнях</div>'+wksHtml+
        '<div class="f26m-hint">Тап по тижню розкриє дні. Порожня колонка — не «вільний день», а <b>непризначений ресурс</b>.</div>'+
        (moTasks.length?'<button class="f26m-cta" data-f26m-dist>'+ic('split',14)+'Розкласти '+moTasks.length+' задач по тижнях</button>':'')+
        '<button class="f26m-cta cool" data-f26m-rit>'+ic('wand',14)+'<span>'+(ritDone(p,ym)?'Ритуал місяця · пройдено':'Спланувати місяць · 4 кроки')+'</span></button>'+
      '</div></div></div>'+
    '</div>';
  }

  /* ══════════ ШТОРКА: фокус місяця ══════════ */
  function fxSheet(p,id){
    var ym=curYm(p), fxs=mfList(p,ym);
    var f=id?fxs.filter(function(x){return x.id===id;})[0]:null;
    var goals=[]; try{ goals=(goalsData.goals||[]); }catch(_){}
    var ov=document.createElement('div'); ov.className='pl-sheet-ov';
    ov.innerHTML='<div class="pl-sheet">'+
      '<div class="pl-sheet-grab"></div>'+
      '<div class="pl-sheet-h">'+(f?'Фокус місяця':'Новий фокус місяця')+'</div>'+
      '<label class="pl-sheet-l">Що головне цього місяця?</label>'+
      '<input class="pl-sheet-in" id="mfName" placeholder="Напр. Запустити проєкт" value="'+escA(f?f.name:'')+'">'+
      '<label class="pl-sheet-l">🔗 Ціль (звідки береться сенс)</label>'+
      '<select class="pl-sheet-in" id="mfGoal"><option value="">— без цілі —</option>'+
        goals.map(function(g){ var k=g.id||g.name;
          return '<option value="'+escA(k)+'"'+((f&&f.goalId===k)?' selected':'')+'>'+(g.emoji||'🎯')+' '+esc2(g.name||'Ціль')+'</option>';
        }).join('')+'</select>'+
      '<label class="pl-sheet-l">Скільки годин віддаєш цього місяця</label>'+
      '<input class="pl-sheet-in" id="mfHours" type="number" inputmode="numeric" placeholder="Напр. 40" value="'+(f&&f.hours?f.hours:'')+'">'+
      '<div class="pl-sheet-btns">'+
        (f?'<button class="f26m-fxdel" id="mfDel">Видалити</button>':'')+
        '<button class="pl-sheet-cancel" id="mfCancel">Скасувати</button>'+
        '<button class="pl-sheet-ok" id="mfOk">'+(f?'Зберегти':'Додати')+'</button>'+
      '</div></div>';
    document.body.appendChild(ov);
    var close=function(){ ov.remove(); };
    ov.addEventListener('click',function(e){ if(e.target===ov) close(); });
    ov.querySelector('#mfCancel').onclick=close;
    var del=ov.querySelector('#mfDel');
    if(del) del.onclick=function(){
      var i=fxs.map(function(x){return x.id;}).indexOf(f.id);
      if(i>=0) fxs.splice(i,1);
      (p.tasks||[]).forEach(function(t){ if(t.mf26===f.id) delete t.mf26; });
      saveGoals(); close(); plRerender(); toast('Фокус прибрано');
    };
    ov.querySelector('#mfOk').onclick=function(){
      var nm=(ov.querySelector('#mfName').value||'').trim();
      if(!nm){ ov.querySelector('#mfName').focus(); return; }
      var gid=ov.querySelector('#mfGoal').value||'';
      var hrs=parseFloat((ov.querySelector('#mfHours').value||'').replace(',','.'))||0;
      if(f){ f.name=nm; f.goalId=gid; f.hours=hrs; }
      else{
        if(fxs.length>=MAXMF){ toast('Максимум '+MAXMF+' фокуси'); close(); return; }
        fxs.push({id:'mf_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),
                  name:nm, goalId:gid, hours:hrs, color:MPAL[fxs.length%MPAL.length]});
      }
      saveGoals(); close(); plRerender(); toast(f?'Збережено':'🎯 Фокус місяця додано');
    };
    setTimeout(function(){ var i=ov.querySelector('#mfName'); if(i) i.focus(); },100);
  }

  /* ══════════ ШТОРКА: розкласти задачі по тижнях ══════════ */
  function distSheet(p){
    var ym=curYm(p), fxs=mfList(p,ym), st=monthStats(p,ym);
    var tasks=(p.tasks||[]).filter(function(t){ return t.scope==='month' && !t.done; });
    if(!tasks.length){ toast('Немає задач місяця'); return; }
    var curMon=mondayOf(plTodayStr());
    var pick={}; // taskId -> {fx, wk}
    var ov=document.createElement('div'); ov.className='pl-sheet-ov';
    var rows=tasks.map(function(t){
      var fxb=fxs.map(function(f,i){
        return '<button data-c data-mfpick="'+escA(t.id)+'|'+escA(f.id)+'" style="--fc:'+mfColor(f,i)+'"'+
               (t.mf26===f.id?' class="on"':'')+'>'+mfEmoji(f)+' '+esc2(f.name)+'</button>';
      }).join('');
      var wkb=st.weeks.map(function(w,i){
        return '<button data-wkpick="'+escA(t.id)+'|'+escA(w.mon)+'"'+
               (t.wk26===w.mon?' class="on"':'')+'>Т'+(i+1)+(w.mon===curMon?' ·зараз':'')+'</button>';
      }).join('');
      return '<div class="f26m-drow" style="display:block">'+
        '<div class="tt">'+esc2(t.t)+'</div>'+
        (fxs.length?'<div class="f26m-dsel">'+fxb+'</div>':'')+
        '<div class="f26m-dsel">'+wkb+'</div></div>';
    }).join('');
    ov.innerHTML='<div class="pl-sheet" style="max-height:82vh;overflow:auto">'+
      '<div class="pl-sheet-grab"></div>'+
      '<div class="pl-sheet-h">Розкласти по тижнях</div>'+
      '<div style="font:600 11px/1.5 Manrope;color:var(--muted);margin-bottom:6px">Обери фокус і тиждень. Задача, кинута в поточний тиждень, одразу переїде в тижневий план.</div>'+
      rows+
      '<div class="pl-sheet-btns"><button class="pl-sheet-cancel" id="dsCancel">Закрити</button>'+
      '<button class="pl-sheet-ok" id="dsOk">Застосувати</button></div></div>';
    document.body.appendChild(ov);
    var close=function(){ ov.remove(); };
    ov.addEventListener('click',function(e){ if(e.target===ov) close(); });
    ov.querySelector('#dsCancel').onclick=close;
    ov.querySelectorAll('[data-mfpick]').forEach(function(b){
      b.onclick=function(){
        var pr=b.dataset.mfpick.split('|'), tid=pr[0], fid=pr[1];
        b.parentNode.querySelectorAll('button').forEach(function(x){ x.classList.remove('on'); });
        b.classList.add('on');
        pick[tid]=pick[tid]||{}; pick[tid].fx=fid;
      };
    });
    ov.querySelectorAll('[data-wkpick]').forEach(function(b){
      b.onclick=function(){
        var pr=b.dataset.wkpick.split('|'), tid=pr[0], mon=pr[1];
        b.parentNode.querySelectorAll('button').forEach(function(x){ x.classList.remove('on'); });
        b.classList.add('on');
        pick[tid]=pick[tid]||{}; pick[tid].wk=mon;
      };
    });
    ov.querySelector('#dsOk').onclick=function(){
      var moved=0;
      Object.keys(pick).forEach(function(tid){
        var t=(p.tasks||[]).filter(function(x){return x.id===tid;})[0]; if(!t) return;
        var sel=pick[tid];
        if(sel.fx) t.mf26=sel.fx;
        if(sel.wk){
          t.wk26=sel.wk;
          if(sel.wk===curMon){
            t.scope='week'; moved++;
            if(sel.fx){
              var mf=mfList(p,ym).filter(function(x){return x.id===sel.fx;})[0];
              if(mf){ var wf=ensureWeekFx(p,mf); if(wf) t.fx26=wf.id; }
            }
          }
        }
      });
      saveGoals(); close(); plRerender();
      toast(moved?('→ '+moved+' у тижневий план'):'Розкладено');
    };
  }


  /* ══════════ РИТУАЛ: спланувати місяць за 4 кроки ══════════ */
  function ritualSheet(p){
    var ym=curYm(p), step=0;
    var STEPS=['Озирнись','Фокуси','Години','Запуск'];
    var ov=document.createElement('div'); ov.className='pl-sheet-ov';
    ov.innerHTML='<div class="pl-sheet f26z" style="max-height:84vh;overflow:auto">'+
      '<div class="pl-sheet-grab"></div>'+
      '<div class="pl-sheet-h" style="display:flex;align-items:center;gap:8px">'+ic('wand',15)+'Планування місяця</div>'+
      '<div class="f26z-dots" id="rzDots"></div>'+
      '<div id="rzBody"></div>'+
      '<div class="pl-sheet-btns">'+
        '<button class="pl-sheet-cancel" id="rzBack">Назад</button>'+
        '<button class="pl-sheet-ok" id="rzNext">Далі</button>'+
      '</div></div>';
    document.body.appendChild(ov);
    var close=function(){ ov.remove(); };
    ov.addEventListener('click',function(e){ if(e.target===ov) close(); });

    function dots(){
      var el=ov.querySelector('#rzDots');
      el.innerHTML=STEPS.map(function(nm,i){
        return '<div class="d'+(i===step?' on':(i<step?' ok':''))+'"><i>'+(i<step?ic('check',9):(i+1))+'</i><span>'+nm+'</span></div>';
      }).join('');
    }
    function body(){
      var pp=plData(), fxs=mfList(pp,ym), st=monthStats(pp,ym);
      var el=ov.querySelector('#rzBody'), h='';

      if(step===0){
        /* озирнись: факт минулого місяця */
        var pym=prevYm(ym), pst=monthStats(pp,pym);
        var pairs=Object.keys(pst.byGoal).filter(function(k){return k!=='_none';})
          .map(function(k){ var g=goalById(k); return {n:(g&&g.name)||'Без цілі', c:(g&&g.color)||'#8f8aa8', h:pst.byGoal[k]}; })
          .sort(function(a,b){ return b.h-a.h; }).slice(0,4);
        var mx=pairs.length?pairs[0].h:1;
        h='<div class="f26z-big">Куди пішов минулий місяць</div>';
        h+=pairs.length? pairs.map(function(x){
            return '<div class="f26m-pc"><span class="dot" style="background:'+x.c+'"></span>'+
              '<span class="nm">'+esc2(x.n)+'</span><span class="st"><b>'+nz(x.h)+' год</b></span></div>'+
              '<div class="f26m-bar" style="margin:2px 0 8px"><i style="width:'+(x.h/mx*100).toFixed(0)+'%;background:'+x.c+'"></i></div>';
          }).join('')
          :'<div class="f26m-empty">Даних за минулий місяць нема — тоді просто дивимось уперед.</div>';
        h+='<div class="f26m-hint">Чесний погляд назад — половина плану вперед. Цього місяця вільно <b>'+Math.round(st.free)+' год</b>.</div>';
      }

      if(step===1){
        /* фокуси: список + швидке додавання з цілей */
        h='<div class="f26z-big">Обери до '+MAXMF+' фокусів</div>';
        h+=fxs.length? fxs.map(function(f,i){
            var cc=mfColor(f,i);
            return '<div class="f26m-pc"><span class="dot" style="background:'+cc+'"></span>'+
              '<span class="nm">'+esc2(f.name)+'</span>'+
              '<button class="f26z-x" data-rzdel="'+escA(f.id)+'">'+ic('trash',12)+'</button></div>';
          }).join('')
          :'<div class="f26m-empty">Поки жодного. Тапни ціль нижче або додай свій.</div>';
        var used={}; fxs.forEach(function(f){ if(f.goalId) used[f.goalId]=1; });
        var chips='';
        (goalsData.goals||[]).forEach(function(g){
          var k=g.id||g.name; if(used[k]) return;
          chips+='<button data-c data-rzgoal="'+escA(k)+'" style="--fc:'+(g.color||'#8b7cff')+'">'+(g.emoji||'')+' '+esc2(g.name||'Ціль')+'</button>';
        });
        if(chips) h+='<div class="pl-sheet-l" style="margin-top:14px">З твоїх цілей</div><div class="f26m-dsel">'+chips+'</div>';
        h+='<button class="f26m-ghost" data-rzown style="margin-top:12px">'+ic('plus',13)+'Свій фокус</button>';
        h+='<div class="f26m-hint">Три — це стеля. Дисципліна фокусу — список «ні», а не список «так».</div>';
      }

      if(step===2){
        /* години */
        h='<div class="f26z-big">Скільки годин на кожен</div>';
        h+=fxs.length? fxs.map(function(f,i){
            var cc=mfColor(f,i);
            return '<div class="f26m-pc" style="gap:10px"><span class="dot" style="background:'+cc+'"></span>'+
              '<span class="nm">'+esc2(f.name)+'</span>'+
              '<input class="f26z-hin" type="number" inputmode="numeric" data-rzh="'+escA(f.id)+'" value="'+(+f.hours||'')+'" placeholder="0"></div>';
          }).join('')
          :'<div class="f26m-empty">Спершу додай фокуси на кроці 2.</div>';
        var sum=fxs.reduce(function(a,f){return a+(+f.hours||0);},0);
        h+='<div class="f26m-hint" id="rzSum">Разом <b>'+sum+' год</b> із вільних <b>'+Math.round(st.free)+'</b>. '+
           (sum>st.free*.85?'<u>Понад 85% — не лишаєш буфера на життя.</u>':'Буфер '+Math.round(st.free-sum)+' год — здорово.')+'</div>';
      }

      if(step===3){
        /* запуск */
        var moT=(pp.tasks||[]).filter(function(t){return t.scope==='month'&&!t.done;}).length;
        var inWk=0; fxs.forEach(function(f){ if(weekFxFor(pp,f.id)) inWk++; });
        h='<div class="f26z-big">Запуск</div>'+
          '<div class="f26m-pc"><span class="dot" style="background:#8b7cff"></span><span class="nm">Фокусів</span><span class="st"><b>'+fxs.length+'</b></span></div>'+
          '<div class="f26m-pc"><span class="dot" style="background:#8b7cff"></span><span class="nm">Годин заплановано</span><span class="st"><b>'+fxs.reduce(function(a,f){return a+(+f.hours||0);},0)+'</b></span></div>'+
          '<div class="f26m-pc"><span class="dot" style="background:#8b7cff"></span><span class="nm">Фокусів у поточному тижні</span><span class="st"><b>'+inWk+' / '+fxs.length+'</b></span></div>'+
          (fxs.length?'<button class="f26m-cta cool" data-rztoweek style="margin-top:14px">'+ic('week',14)+'<span>Перенести фокуси в тиждень</span></button>':'')+
          (moT?'<button class="f26m-cta cool" data-rzdist>'+ic('split',14)+'<span>Розкласти '+moT+' задач по тижнях</span></button>':'')+
          '<div class="f26m-hint">Після запуску великі камені мають стояти в календарі перші — решта потім.</div>';
      }

      el.innerHTML=h;
      dots();
      ov.querySelector('#rzBack').style.visibility=step?'visible':'hidden';
      ov.querySelector('#rzNext').textContent=(step===3)?'Готово':'Далі';

      /* локальні біндінги кроку */
      el.querySelectorAll('[data-rzdel]').forEach(function(b){ b.onclick=function(){
        var i=fxs.map(function(x){return x.id;}).indexOf(b.dataset.rzdel);
        if(i>=0){ var fid=fxs[i].id; fxs.splice(i,1);
          (pp.tasks||[]).forEach(function(t){ if(t.mf26===fid) delete t.mf26; });
          saveGoals(); body(); } }; });
      el.querySelectorAll('[data-rzgoal]').forEach(function(b){ b.onclick=function(){
        if(fxs.length>=MAXMF){ toast('Максимум '+MAXMF); return; }
        var g=goalById(b.dataset.rzgoal); if(!g) return;
        fxs.push({id:'mf_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),
          name:g.name||'Фокус', goalId:b.dataset.rzgoal, hours:0, color:g.color||MPAL[fxs.length%MPAL.length]});
        saveGoals(); body(); }; });
      var own=el.querySelector('[data-rzown]');
      if(own) own.onclick=function(){ fxSheet(pp,null); };
      el.querySelectorAll('[data-rzh]').forEach(function(inp){ inp.onchange=function(){
        var f=fxs.filter(function(x){return x.id===inp.dataset.rzh;})[0]; if(!f) return;
        f.hours=parseFloat((inp.value||'').replace(',','.'))||0; saveGoals(); body(); }; });
      var twk=el.querySelector('[data-rztoweek]');
      if(twk) twk.onclick=function(){
        var added=0, full=false;
        fxs.forEach(function(f){ var wf=ensureWeekFx(pp,f); if(wf) added++; else if(!weekFxFor(pp,f.id)) full=true; });
        saveGoals(); body();
        toast(full?'У тижні вже 3 фокуси':('→ фокуси в тижні ('+added+')'));
      };
      var dst=el.querySelector('[data-rzdist]');
      if(dst) dst.onclick=function(){ close(); distSheet(plData()); };
    }

    ov.querySelector('#rzBack').onclick=function(){ if(step>0){ step--; body(); } };
    ov.querySelector('#rzNext').onclick=function(){
      if(step<3){ step++; body(); return; }
      var pp=plData(); if(!pp.fd26mrit||typeof pp.fd26mrit!=='object') pp.fd26mrit={};
      pp.fd26mrit[ym]=plTodayStr();
      saveGoals(); close(); plRerender(); toast('Місяць спланований');
    };
    body();
  }

  /* ══════════ згортання бюджету + тижневі рядки ══════════ */
  function enhanceBudget(root,p){
    var bd=root.querySelector('.pl-budget');
    if(!bd || bd.dataset.f26m) return;
    bd.dataset.f26m='1';
    var head=bd.querySelector('.pl-budget-h'); if(!head) return;
    var rest=[]; Array.prototype.forEach.call(bd.children,function(ch){ if(ch!==head) rest.push(ch); });
    var fold=document.createElement('div'); fold.className='f26m-fold';
    var box=document.createElement('div');
    fold.appendChild(box);
    rest.forEach(function(n){ box.appendChild(n); });
    bd.appendChild(fold);
    var chev=document.createElement('div'); chev.className='f26m-chev';
    chev.innerHTML=ic('chevD',13);
    var hr=head.querySelector('.pl-budget-hr')||head;
    hr.appendChild(chev);
    head.style.cursor='pointer';
    if(!p.collapsed.f26mbud) bd.classList.add('f26m-open');
    head.addEventListener('click',function(e){
      if(e.target.closest('.pl-budget-gear')) return;
      var pp=plData();
      pp.collapsed.f26mbud=!(pp.collapsed.f26mbud===false)?false:true;
      bd.classList.toggle('f26m-open',pp.collapsed.f26mbud===false);
      try{ saveGoals(); }catch(_){}
    });
  }

  /* ══════════ вставка в екран місяця ══════════ */
  function inject(c){
    try{
      var p=plData();
      if(p.collapsed.f26mplan===undefined){ p.collapsed.f26mplan=false; try{ saveGoals(); }catch(_){} }
      if(p.collapsed.f26mbud===undefined){ p.collapsed.f26mbud=true; try{ saveGoals(); }catch(_){} }
      if(c.querySelector('#f26mCard')) return;
      var anchor=c.querySelector('.seclbl')||c.querySelector('.pl-budget');
      var box=document.createElement('div');
      box.innerHTML=cardHTML(p);
      var node=box.firstChild;
      if(anchor) anchor.parentNode.insertBefore(node,anchor); else c.appendChild(node);
      enhanceBudget(c,p);
    }catch(e){ console.error('f26m inject',e); }
  }

  /* ══════════ делеговані кліки ══════════ */
  document.addEventListener('click',function(e){
    try{
      var t=e.target;
      var fold=t.closest&&t.closest('[data-f26m-fold]');
      if(fold){ var card=document.getElementById('f26mCard'); if(!card) return;
        var p=plData(); p.collapsed.f26mplan=card.classList.contains('open');
        card.classList.toggle('open');
        if(card.classList.contains('open')){ card.classList.add('stg');
          setTimeout(function(){ try{ card.classList.remove('stg'); }catch(_){} },700); }
        try{ saveGoals(); }catch(_){} return; }

      var lvl=t.closest&&t.closest('[data-f26m-lvl]');
      if(lvl){
        var k=lvl.dataset.f26mLvl;
        if(k==='goals'){ try{ goGoals(); }catch(_){} }
        else if(k==='focus'){ var p2=plData(); if(mfList(p2,curYm(p2)).length<MAXMF) fxSheet(p2,null); }
        else if(k==='dist'){ distSheet(plData()); }
        else if(k==='week'){ var p3=plData(); p3.scope='week'; saveGoals(); plRerender(); }
        return;
      }
      var fx=t.closest&&t.closest('[data-f26m-fx]');
      if(fx){ fxSheet(plData(),fx.dataset.f26mFx); return; }
      if(t.closest&&t.closest('[data-f26m-fxadd]')){ fxSheet(plData(),null); return; }
      if(t.closest&&t.closest('[data-f26m-dist]')){ distSheet(plData()); return; }
      if(t.closest&&t.closest('[data-f26m-rit]')){ ritualSheet(plData()); return; }

      if(t.closest&&t.closest('[data-f26m-toweek]')){
        var p4=plData(), added=0, full=false;
        mfList(p4,curYm(p4)).forEach(function(f){
          var wf=ensureWeekFx(p4,f); if(wf) added++; else full=true;
        });
        saveGoals(); plRerender();
        toast(full?'У тижні вже 3 фокуси':('→ фокуси в тижні ('+added+')'));
        return;
      }
      var wk=t.closest&&t.closest('[data-f26m-wk]');
      if(wk){
        var p5=plData(); var mon=wk.dataset.f26mWk;
        p5._f26mw=(p5._f26mw===mon)?null:mon;
        plRerender(); return;
      }
      var day=t.closest&&t.closest('[data-f26m-day]');
      if(day){
        var p6=plData(); p6.selDate=day.dataset.f26mDay; p6.scope='day';
        saveGoals(); plRerender(); return;
      }
      var gg=t.closest&&t.closest('[data-f26m-goal]');
      if(gg){ try{ goGoals(); }catch(_){} return; }
    }catch(err){ console.error('f26m click',err); }
  },false);

  /* ══════════ хук рендера ══════════ */
  var _rp=window.renderPlanner;
  if(typeof _rp==='function'){
    window.renderPlanner=function(c){
      _rp(c);
      try{
        var p=plData();
        if(p && p.scope==='month' && window.uiMode!=='lite') inject(c);
      }catch(e){ console.error('f26m hook',e); }
    };
  }
}catch(e){ console.error('fd26js-month',e); }
})();
