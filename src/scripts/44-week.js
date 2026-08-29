
(function(){
"use strict";
try{
  if(window.__fd26Week) return; window.__fd26Week=true;
  var DOWU=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
  var MONU=['січ','лют','бер','кві','тра','чер','лип','сер','вер','жов','лис','гру'];
  var FXPAL=['#f0b429','#c77dff','#34c77b','#2fb6c4','#ff6b9d','#5b8def'];
  var CAP=3, MAXFX=3;
  var pickId=null, selDs='';

  /* ── дати тижня Пн..Нд, тільки через ymdLocal ── */
  function wkDates(){
    var now=new Date(); var dow=(now.getDay()+6)%7;
    var mon=new Date(now); mon.setDate(now.getDate()-dow);
    var out=[]; for(var i=0;i<7;i++){ var d=new Date(mon); d.setDate(mon.getDate()+i); out.push(ymdLocal(d)); }
    return out;
  }
  function dayLbl(ds,wk){ var i=wk.indexOf(ds); return i>=0?DOWU[i]:''; }
  function plu(n){ var m10=n%10,m100=n%100; if(m10===1&&m100!==11) return n+' задача'; if(m10>=2&&m10<=4&&(m100<10||m100>=20)) return n+' задачі'; return n+' задач'; }
  function dnum(ds){ try{ return parseInt(ds.slice(8,10),10); }catch(_){ return ''; } }

  /* ── фокуси тижня: p.fd26fx[monday] = [{id,name,goalId}] ── */
  function fxList(p,wk0){
    if(!p.fd26fx||typeof p.fd26fx!=='object') p.fd26fx={};
    // прунимо старі тижні (лишаємо поточний + попередній за датою)
    var keys=Object.keys(p.fd26fx).sort();
    while(keys.length>2&&keys[0]<wk0){ delete p.fd26fx[keys[0]]; keys.shift(); }
    if(!Array.isArray(p.fd26fx[wk0])) p.fd26fx[wk0]=[];
    return p.fd26fx[wk0];
  }
  function fxColor(fx,i){
    try{ if(fx&&fx.goalId){ var g=(goalsData.goals||[]).find(function(x){return (x.id||x.name)===fx.goalId;}); if(g&&g.color) return g.color; } }catch(_){}
    return (fx&&fx.color)||FXPAL[i%FXPAL.length];
  }
  /* ── burndown-історія: p.fd26bd[monday][ds]=remain на ранок ── */
  function bdHist(p,wk0){
    if(!p.fd26bd||typeof p.fd26bd!=='object') p.fd26bd={};
    var keys=Object.keys(p.fd26bd).sort();
    while(keys.length>2&&keys[0]<wk0){ delete p.fd26bd[keys[0]]; keys.shift(); }
    if(!p.fd26bd[wk0]||typeof p.fd26bd[wk0]!=='object') p.fd26bd[wk0]={};
    return p.fd26bd[wk0];
  }
  function weekTasks(p){ return p.tasks.filter(function(t){return t.scope==='week';}); }
  function ddlIn(t,wk){ return t.ddl && wk.indexOf(t.ddl)>=0; }

  /* ══ ГОЛОВНИЙ РЕНДЕР ══ */
  function fdWeekRender(c){
    var p=plData();
    var wk=wkDates(), wk0=wk[0], td=plTodayStr(), tdi=wk.indexOf(td); if(tdi<0) tdi=0;
    var fxs=fxList(p,wk0);
    var tasks=weekTasks(p);
    var total=tasks.length, doneN=tasks.filter(function(t){return t.done;}).length;
    var pct=total?Math.round(doneN/total*100):0;
    var free=tasks.filter(function(t){return !t.done && !ddlIn(t,wk);});
    var daysLeft=7-tdi;

    /* снапшот burndown: перший рендер дня фіксує «лишалось на ранок» */
    var hist=bdHist(p,wk0), changed=false;
    if(total>0 && hist[td]===undefined){ hist[td]=total-doneN; changed=true; }
    if(p.collapsed.fd26bd===undefined){ p.collapsed.fd26bd=true; changed=true; }
    if(changed){ try{ saveGoals(); }catch(_){} }

    /* hero: фокуси */
    var fxHtml;
    if(fxs.length){
      fxHtml=fxs.map(function(f,i){
        var ts=tasks.filter(function(t){return t.fx26===f.id;});
        var dn=ts.filter(function(t){return t.done;}).length;
        var pp=ts.length?Math.round(dn/ts.length*100):0;
        var cc=fxColor(f,i);
        return '<div class="f26w-fxrow'+(i===0?' prime':'')+'"><div class="n">'+(i+1)+'</div>'+
          '<h5>'+esc(f.name)+'</h5>'+
          '<div class="pr"><i style="width:'+pp+'%;background:'+(i===0?'linear-gradient(90deg,#ff9d5c,#ff5c8a)':cc)+'"></i></div>'+
          '<div class="c">'+dn+'/'+ts.length+'</div></div>';
      }).join('');
    } else {
      fxHtml='<div class="f26w-fxempty">Обери до 3 фокусів тижня — <b data-f26fxedit>налаштувати</b></div>';
    }
    var ring157=157-Math.round(157*pct/100);
    var hero='<div class="f26w-hero f26w-glass">'+
      '<div class="f26w-top"><div class="f26w-ring">'+
        '<svg width="56" height="56" viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill="none" stroke="rgba(139,124,255,.16)" stroke-width="5.5"/>'+
        '<circle cx="30" cy="30" r="25" fill="none" stroke="var(--accent,#8b7cff)" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="157" stroke-dashoffset="'+ring157+'"/></svg>'+
        '<b>'+pct+'%</b></div>'+
      '<div class="f26w-ti"><h3>Тиждень · '+dnum(wk0)+'–'+dnum(wk[6])+' '+MONU[new Date(wk[6]+'T12:00:00').getMonth()]+'</h3>'+
        '<p>'+doneN+'/'+total+' задач'+(free.length?' · <b>'+free.length+' без дня</b>':'')+' · '+(daysLeft>1?('ще '+daysLeft+' '+(daysLeft>=5?'днів':'дні')):'останній день')+'</p></div></div>'+
      '<div class="f26w-fx" data-f26fxedit style="cursor:pointer">'+fxHtml+'</div></div>';

    /* burndown */
    var bdHtml='';
    if(total>0){
      bdHtml='<div class="f26w-bd f26w-glass'+(p.collapsed.fd26bd?'':' open')+'" id="f26wBd">'+
        '<div class="f26w-bdh" data-f26bdtoggle><div class="ic">📉</div>'+
        '<div class="x"><h4>Burndown</h4><p id="f26wBdSub"></p></div>'+
        '<svg class="f26w-spark" id="f26wSpark" viewBox="0 0 56 22"></svg>'+
        '<div class="f26w-chev"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>'+
        '<div class="f26w-bdb"><div class="f26w-bdin"><svg class="f26w-bdsvg" id="f26wBdSvg" viewBox="0 0 360 128"></svg>'+
        '<div class="f26w-bdlg"><span><i style="background:rgba(143,138,168,.5)"></i>ідеал</span><span><i style="background:#8b7cff"></i>факт</span><span><i style="background:rgba(139,124,255,.45)"></i>прогноз</span></div></div></div></div>';
    }

    /* пул «без дня» */
    var poolHtml=free.length?free.map(function(t){
      var fi=fxs.findIndex(function(f){return f.id===t.fx26;});
      var cc=fi>=0?fxColor(fxs[fi],fi):(PL_COL[t.c]||'#5b8def');
      return '<div class="f26w-chip'+(pickId===t.id?' pick':'')+'" data-f26pick="'+escAttr(t.id)+'"><span class="dot" style="background:'+cc+'"></span>'+esc(t.t)+'</div>';
    }).join(''):'<div class="f26w-poolempty">Все має свій день ✨</div>';

    /* карта тижня */
    function mapCells(){
      return wk.map(function(ds,i){
        var cnt=tasks.filter(function(t){return t.ddl===ds;}).length;
        var pp=Math.min(100,Math.round(cnt/CAP*100));
        var cls=(i===tdi?' today':'')+(i<tdi?' past':'')+(cnt>CAP?' over':'')+(selDs===ds?' sel':'')+((pickId&&i>=tdi)?' pulse':'');
        return '<div class="f26w-wd'+cls+'" data-f26day="'+escAttr(ds)+'"><span class="n">'+DOWU[i]+'</span><span class="d">'+dnum(ds)+'</span>'+
          '<div class="load"><i style="height:'+pp+'%"></i></div><span class="cnt">'+(cnt||'·')+'</span></div>';
      }).join('')+'<div class="f26w-peek'+(selDs?' on':'')+'" id="f26wPeek"></div>';
    }

    /* групи задач по фокусах */
    function taskRow(t){
      var fi=fxs.findIndex(function(f){return f.id===t.fx26;});
      var cc=fi>=0?fxColor(fxs[fi],fi):(PL_COL[t.c]||'#5b8def');
      var prio=t.p?'<span class="f26w-prio" style="background:'+(PL_PRIO[t.p]||'#5b8def')+'">P'+t.p+'</span>':'';
      var subs=t.subs||[]; var sd=subs.filter(function(s){return s.d;}).length;
      var mt=[];
      if(t.tag) mt.push(esc(t.tag));
      if(subs.length) mt.push('☑ '+sd+'/'+subs.length+(t.open?' ▾':' ▸'));
      var inWk=ddlIn(t,wk);
      var dayCls=!inWk?'':(t.ddl===td?' today set':' set');
      var dayTxt=!inWk?'→ день':(t.ddl===td?'сьогодні':dayLbl(t.ddl,wk));
      var subsHtml='';
      if(subs.length&&t.open){
        subsHtml='<div class="f26w-subs">'+subs.map(function(s,i){
          return '<div class="f26w-sub'+(s.d?' dn':'')+'" data-f26sub="'+escAttr(t.id)+'|'+i+'"><span class="sc">✓</span><span>'+esc(s.t)+'</span></div>';
        }).join('')+'</div>';
      }
      return '<div class="f26w-t'+(t.done?' done':'')+'">'+
        '<div class="f26w-trow">'+
          '<div class="f26w-ck" data-f26ck="'+escAttr(t.id)+'">✓</div>'+
          '<div class="f26w-tx"'+(subs.length?' data-f26open="'+escAttr(t.id)+'"':'')+'>'+
            '<div class="tt" data-i18n-skip="1">'+prio+esc(t.t)+'</div>'+(mt.length?'<div class="mt">'+mt.join(' · ')+'</div>':'')+'</div>'+
          '<button class="f26w-fxd'+(fi>=0?' set':'')+'" data-f26fxcyc="'+escAttr(t.id)+'" title="фокус"'+(fi>=0?' style="background:'+cc+'"':'')+'></button>'+
          '<button class="f26w-day'+dayCls+'" data-f26daypick="'+escAttr(t.id)+'">'+dayTxt+'</button>'+
          '<span class="f26w-del" data-f26del="'+escAttr(t.id)+'">×</span>'+
        '</div>'+subsHtml+'</div>';
    }
    var groupsHtml='';
    fxs.forEach(function(f,i){
      var ts=tasks.filter(function(t){return t.fx26===f.id;});
      if(!ts.length) return;
      var dn=ts.filter(function(t){return t.done;}).length;
      groupsHtml+='<div class="f26w-gh"><span class="dot" style="background:'+fxColor(f,i)+'"></span>'+esc(f.name)+'<span class="c">'+dn+'/'+ts.length+'</span></div>'+
        ts.map(taskRow).join('');
    });
    var other=tasks.filter(function(t){ return !fxs.some(function(f){return f.id===t.fx26;}); });
    if(other.length){
      if(fxs.length) groupsHtml+='<div class="f26w-gh"><span class="dot" style="background:#6f7890"></span>Інше<span class="c">'+other.filter(function(t){return t.done;}).length+'/'+other.length+'</span></div>';
      groupsHtml+=other.map(taskRow).join('');
    }
    if(!tasks.length) groupsHtml='<div class="pl-empty">Поки порожньо. Додай першу задачу тижня.</div>';

    var toplvl='<div class="pl-toplvl"><button class="on">📅 Плани</button><button data-plhor>🎯 Горизонт</button></div>';
    var segs=[['day','День'],['week','Тиждень'],['month','Місяць']];
    var segHtml='<div class="pl-seg">'+segs.map(function(s){return '<button class="'+(p.scope===s[0]?'on':'')+'" data-plscope="'+s[0]+'">'+s[1]+'</button>';}).join('')+'</div>';

    c.innerHTML=toplvl+segHtml+hero+bdHtml+
      '<div class="f26w-lbl">📥 Без дня <span class="r" data-f26add>+ задача</span></div>'+
      '<div class="f26w-pool f26w-glass" id="f26wPool">'+poolHtml+'</div>'+
      '<div class="f26w-hint'+(pickId?' on':'')+'">Тапни день на карті — задача ляже туди ↓</div>'+
      '<div class="f26w-lbl">🗺 Карта тижня</div>'+
      '<div class="f26w-map f26w-glass'+(pickId?' target':'')+'" id="f26wMap">'+mapCells()+'</div>'+
      '<div class="f26w-lbl">✅ По фокусах</div>'+groupsHtml+
      '<button class="f26w-add" data-f26add>+ Нова задача</button>'+
      '<div class="f26w-rit"><div class="ic">📈</div><div class="x"><h6>Ревʼю тижня</h6><p>10 хв: що спрацювало · переноси · нові фокуси</p></div>'+
      '<button class="go" data-f26rev>Почати</button></div>';

    /* ── байндінги ── */
    var hb=c.querySelector('[data-plhor]'); if(hb) hb.onclick=function(){ try{ goGoals(); }catch(e){ console.error(e); } };
    c.querySelectorAll('[data-plscope]').forEach(function(b){ b.onclick=function(){ p.scope=b.dataset.plscope; saveGoals(); plRerender(); }; });
    c.querySelectorAll('[data-f26fxedit]').forEach(function(el){ el.onclick=function(e){ e.stopPropagation(); fdFxSheet(); }; });
    var bt=c.querySelector('[data-f26bdtoggle]'); if(bt) bt.onclick=function(){ p.collapsed.fd26bd=!p.collapsed.fd26bd; saveGoals();
      var el=document.getElementById('f26wBd'); if(el) el.classList.toggle('open',!p.collapsed.fd26bd); };
    c.querySelectorAll('[data-f26pick]').forEach(function(el){ el.onclick=function(){
      pickId=(pickId===el.dataset.f26pick)?null:el.dataset.f26pick; fdWeekRender(c); }; });
    c.querySelectorAll('[data-f26day]').forEach(function(el){ el.onclick=function(){
      var ds=el.dataset.f26day;
      if(pickId){ var t=p.tasks.find(function(x){return x.id===pickId;}); if(t){ t.ddl=ds; } pickId=null; selDs=ds; saveGoals(); fdWeekRender(c); return; }
      selDs=(selDs===ds)?'':ds; fdWeekRender(c); }; });
    c.querySelectorAll('[data-f26ck]').forEach(function(el){ el.onclick=function(){
      var t=p.tasks.find(function(x){return x.id===el.dataset.f26ck;}); if(t){ t.done=!t.done; saveGoals(); fdWeekRender(c); } }; });
    c.querySelectorAll('[data-f26open]').forEach(function(el){ el.onclick=function(){
      var t=p.tasks.find(function(x){return x.id===el.dataset.f26open;}); if(t){ t.open=!t.open; saveGoals(); fdWeekRender(c); } }; });
    c.querySelectorAll('[data-f26sub]').forEach(function(el){ el.onclick=function(){
      var pr=el.dataset.f26sub.split('|'); var t=p.tasks.find(function(x){return x.id===pr[0];});
      if(t&&t.subs&&t.subs[+pr[1]]){ t.subs[+pr[1]].d=!t.subs[+pr[1]].d; saveGoals(); fdWeekRender(c); } }; });
    c.querySelectorAll('[data-f26fxcyc]').forEach(function(el){ el.onclick=function(){
      if(!fxs.length){ fdFxSheet(); return; }
      var t=p.tasks.find(function(x){return x.id===el.dataset.f26fxcyc;}); if(!t) return;
      var idx=fxs.findIndex(function(f){return f.id===t.fx26;});
      var nx=idx+1; if(nx>=fxs.length){ delete t.fx26; } else { t.fx26=fxs[nx].id; }
      saveGoals(); fdWeekRender(c); }; });
    c.querySelectorAll('[data-f26del]').forEach(function(el){ el.onclick=function(){
      var i=p.tasks.findIndex(function(x){return x.id===el.dataset.f26del;});
      if(i>=0){ p.tasks.splice(i,1); saveGoals(); fdWeekRender(c); } }; });
    c.querySelectorAll('[data-f26daypick]').forEach(function(el){ el.onclick=function(){ fdDaySheet(el.dataset.f26daypick); }; });
    c.querySelectorAll('[data-f26add]').forEach(function(el){ el.onclick=function(){ try{ plAdd(); }catch(e){ console.error(e); } }; });
    var rv=c.querySelector('[data-f26rev]'); if(rv) rv.onclick=function(){ try{ plWeekReviewSheet(); }catch(e){ console.error(e); } };

    /* peek */
    if(selDs){
      var pk=document.getElementById('f26wPeek');
      if(pk){
        var list=tasks.filter(function(t){return t.ddl===selDs;});
        var i2=wk.indexOf(selDs);
        pk.innerHTML='<b>'+DOWU[i2]+', '+dnum(selDs)+'</b> · '+plu(list.length)+(list.length>CAP?' — <span style="color:#ff5c8a">&gt; норми '+CAP+'</span>':'')+
          (list.length?list.map(function(t){
            var fi=fxs.findIndex(function(f){return f.id===t.fx26;});
            var cc=fi>=0?fxColor(fxs[fi],fi):(PL_COL[t.c]||'#5b8def');
            return '<div class="row"><span class="dot" style="background:'+cc+'"></span><span style="'+(t.done?'text-decoration:line-through;opacity:.55':'')+'">'+esc(t.t)+'</span><span class="rm" data-f26unday="'+escAttr(t.id)+'">↩</span></div>';
          }).join(''):'<div class="row">Порожньо — день для маневру</div>');
        pk.querySelectorAll('[data-f26unday]').forEach(function(el){ el.onclick=function(e){ e.stopPropagation();
          var t=p.tasks.find(function(x){return x.id===el.dataset.f26unday;}); if(t){ t.ddl=''; saveGoals(); fdWeekRender(c); } }; });
      }
    }
    /* burndown draw */
    if(total>0) fdDrawBd(p,wk,tdi,tasks,hist);
  }

  /* ══ burndown ══ */
  function fdDrawBd(p,wk,tdi,tasks,hist){
    var total=tasks.length, doneN=tasks.filter(function(t){return t.done;}).length, remain=total-doneN;
    var dNow=tdi+0.5, tempo=dNow>0?doneN/dNow:0;
    var finDay=tempo>0?Math.ceil(tdi+remain/tempo):99;
    var idealRemain=total*(1-dNow/7);
    var behind=remain>idealRemain+0.6;
    var sub=document.getElementById('f26wBdSub');
    if(sub) sub.innerHTML='лишилось <b>'+remain+'</b> · темп '+tempo.toFixed(1)+'/день · '+
      (remain===0?'<b>готово ✓</b>':(tempo>0&&finDay<=6?'фініш ~<b>'+DOWU[Math.min(finDay,6)]+'</b>':'<b class="warn">не встигаєш</b>'))+
      (remain>0?(behind?' · <b class="warn">позаду</b>':' · <b>у графіку</b>'):'');
    var X0=34,X1=350,Y0=12,Y1=106;
    function x(d){ return X0+(X1-X0)*d/6; }
    function y(r){ return Y1-(Y1-Y0)*Math.max(0,Math.min(total,r))/total; }
    var pts=[]; for(var i=0;i<=tdi;i++){ var v=hist[wk[i]]; if(v===undefined) v=(pts.length?null:total);
      if(v===null){ v=parseFloat(pts[pts.length-1].split(',')[1]); pts.push(x(i)+','+v); } else pts.push(x(i)+','+y(v)); }
    pts.push(x(dNow)+','+y(remain));
    var fx=x(dNow), fy=y(remain);
    var projEnd=tempo>0?Math.max(0,remain-tempo*(6-dNow)):remain;
    var svg=document.getElementById('f26wBdSvg');
    if(svg) svg.innerHTML='<line x1="'+X0+'" y1="'+(Y0-2)+'" x2="'+X0+'" y2="'+Y1+'" stroke="rgba(143,138,168,.25)"/>'+
      '<line x1="'+X0+'" y1="'+Y1+'" x2="'+X1+'" y2="'+Y1+'" stroke="rgba(143,138,168,.25)"/>'+
      '<text x="'+(X0-8)+'" y="'+(Y0+4)+'" fill="#8f8aa8" font-size="9" text-anchor="end">'+total+'</text>'+
      '<text x="'+(X0-8)+'" y="'+(Y1+2)+'" fill="#8f8aa8" font-size="9" text-anchor="end">0</text>'+
      '<polyline points="'+X0+','+Y0+' '+X1+','+Y1+'" fill="none" stroke="rgba(143,138,168,.4)" stroke-width="1.5" stroke-dasharray="4 4"/>'+
      '<polyline points="'+pts.join(' ')+'" fill="none" stroke="#8b7cff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<polyline points="'+fx+','+fy+' '+x(6)+','+y(projEnd)+'" fill="none" stroke="rgba(139,124,255,.4)" stroke-width="2" stroke-dasharray="3 5"/>'+
      '<circle cx="'+fx+'" cy="'+fy+'" r="4.5" fill="#ff9d5c"></circle>'+
      '<g fill="#8f8aa8" font-size="9" text-anchor="middle">'+DOWU.map(function(d,i){return '<text x="'+x(i)+'" y="120"'+(i===tdi?' fill="#ff9d5c" font-weight="700"':'')+'>'+d+'</text>';}).join('')+'</g>';
    var sp=document.getElementById('f26wSpark');
    if(sp){
      function sx(d){ return 2+52*d/6; } function sy(r){ return 19-16*Math.max(0,Math.min(total,r))/total; }
      var spts=[]; for(var j=0;j<=tdi;j++){ var v2=hist[wk[j]]; if(v2===undefined) v2=total; spts.push(sx(j)+','+sy(v2)); }
      spts.push(sx(tdi+0.5)+','+sy(remain));
      sp.innerHTML='<polyline points="'+sx(0)+','+sy(total)+' '+sx(6)+','+sy(0)+'" fill="none" stroke="rgba(143,138,168,.35)" stroke-width="1" stroke-dasharray="2 3"/>'+
        '<polyline points="'+spts.join(' ')+'" fill="none" stroke="#8b7cff" stroke-width="1.8" stroke-linecap="round"/>'+
        '<circle cx="'+sx(tdi+0.5)+'" cy="'+sy(remain)+'" r="2.6" fill="#ff9d5c"/>';
    }
  }

  /* ══ шит: вибір дня для задачі ══ */
  function fdDaySheet(tid){
    var p=plData(); var t=p.tasks.find(function(x){return x.id===tid;}); if(!t) return;
    var wk=wkDates(), td=plTodayStr();
    var ov=document.createElement('div'); ov.className='pl-sheet-ov';
    ov.innerHTML='<div class="pl-sheet"><div class="pl-sheet-grab"></div>'+
      '<div class="pl-sheet-h">Коли: '+esc(t.t)+'</div>'+
      '<div class="f26w-dgrid">'+wk.map(function(ds,i){
        return '<button class="f26w-dbtn'+(t.ddl===ds?' on':'')+(ds===td?' tdy':'')+'" data-ds="'+escAttr(ds)+'">'+DOWU[i]+'<small>'+dnum(ds)+(ds===td?' · сьогодні':'')+'</small></button>';
      }).join('')+
      '<button class="f26w-dbtn none" data-ds="">Без дня</button></div></div>';
    function close(){ try{ ov.remove(); }catch(_){} }
    ov.onclick=function(e){ if(e.target===ov) close(); };
    ov.querySelectorAll('[data-ds]').forEach(function(b){ b.onclick=function(){
      t.ddl=b.dataset.ds||''; saveGoals(); close(); plRerender(); }; });
    document.body.appendChild(ov);
  }

  /* ══ шит: фокуси тижня ══ */
  function fdFxSheet(){
    var p=plData(); var wk0=wkDates()[0]; var fxs=fxList(p,wk0);
    var ov=document.createElement('div'); ov.className='pl-sheet-ov';
    function draw(){
      var rows=fxs.length?fxs.map(function(f,i){
        return '<div class="f26w-fxli"><span class="dot" style="background:'+fxColor(f,i)+'"></span><b>'+esc(f.name)+'</b>'+
          '<button class="rm" data-fxrm="'+i+'">✕</button></div>';
      }).join(''):'<div style="font-size:12.5px;color:var(--muted,#8f8aa8);font-weight:700;padding:8px 2px">Фокус — це те, заради чого існує цей тиждень. Максимум 3.</div>';
      ov.innerHTML='<div class="pl-sheet"><div class="pl-sheet-grab"></div>'+
        '<div class="pl-sheet-h">🔥 Фокуси тижня</div>'+rows+
        (fxs.length<MAXFX?'<div class="fd-addrow" style="margin-top:12px"><input id="f26wFxNew" placeholder="Напр. Запуск агенції — 3 ліди" enterkeyhint="done"><button class="go" id="f26wFxGo">＋</button></div>':'')+
        '<button class="pl-weekbtn" id="f26wFxOk" style="margin-top:12px">Готово</button></div>';
      ov.querySelectorAll('[data-fxrm]').forEach(function(b){ b.onclick=function(){
        var f=fxs[+b.dataset.fxrm]; if(!f) return;
        p.tasks.forEach(function(t){ if(t.fx26===f.id) delete t.fx26; });
        fxs.splice(+b.dataset.fxrm,1); saveGoals(); draw(); }; });
      var gi=ov.querySelector('#f26wFxNew'), go=ov.querySelector('#f26wFxGo');
      if(go){ go.onclick=function(){ var v=(gi.value||'').trim(); if(!v) return;
        fxs.push({id:'fx_'+Date.now(), name:v}); saveGoals(); draw();
        setTimeout(function(){ var n=ov.querySelector('#f26wFxNew'); if(n) n.focus(); },60); };
        gi.addEventListener('keydown',function(e){ if(e.key==='Enter') go.click(); }); }
      var ok=ov.querySelector('#f26wFxOk'); if(ok) ok.onclick=close;
    }
    function close(){ try{ ov.remove(); }catch(_){} plRerender(); }
    ov.onclick=function(e){ if(e.target===ov) close(); };
    draw(); document.body.appendChild(ov);
  }

  /* ══ хук: перехоплюємо рендер тижня, все інше — як було ══ */
  var _rp=window.renderPlanner;
  if(typeof _rp==='function'){
    window.renderPlanner=function(c){
      try{
        var p=plData();
        if(p && p.scope==='week' && window.uiMode!=='lite'){ fdWeekRender(c); return; }
      }catch(e){ console.error('fd26week',e); }
      _rp(c);
    };
  }
}catch(e){ console.error('fd26js-week',e); }
})();
