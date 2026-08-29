  /* ═══ PREMIUM PACK V1 · збереження текстів, pgAsk, тікер фокуса ═══ */
  editor.addEventListener('focusout',function(e){
    var pr=e.target.closest&&e.target.closest('[data-pgprtxt]');
    if(pr){var lp=locate(pr.dataset.pgprtxt);
      if(lp){lp.block.ptext=pr.textContent;save();
        var w=pr.closest('.pgpr'),ln=w&&w.querySelector('.pgpr-len');
        if(ln)ln.textContent=pr.textContent.length? pr.textContent.length+' зн.':'';}return;}
    var tt=e.target.closest&&e.target.closest('[data-pgtabtxt]');
    if(tt){var t0=tt.dataset.pgtabtxt.split('|');var l=locate(t0[0]);
      if(l&&l.block.tabs&&l.block.tabs[t0[1]]){l.block.tabs[t0[1]].text=tt.textContent;save();}return;}
    var at=e.target.closest&&e.target.closest('[data-pgacctxt]');
    if(at){var a0=at.dataset.pgacctxt.split('|');var l2=locate(a0[0]);
      if(l2&&l2.block.secs&&l2.block.secs[a0[1]]){l2.block.secs[a0[1]].text=at.textContent;save();}return;}
  });
  function pgAsk(title, ph, val, cb){
    var ov=document.createElement('div'); ov.className='pgask-ov';
    ov.innerHTML='<div class="pgask"><div class="pgask-t">'+esc(title)+'</div>'
      +'<input class="pgask-in" placeholder="'+esc(ph||'')+'" value="'+esc(val||'')+'">'
      +'<div class="pgask-b"><button class="c">Скасувати</button><button class="ok">Готово</button></div></div>';
    document.body.appendChild(ov);
    var inp=ov.querySelector('.pgask-in'); setTimeout(function(){inp.focus();},60);
    var close=function(){ov.remove();};
    ov.querySelector('.c').onclick=close;
    ov.addEventListener('click',function(ev){if(ev.target===ov)close();});
    var ok=function(){var v=inp.value.trim();close();if(v)cb(v);};
    ov.querySelector('.ok').onclick=ok;
    inp.onkeydown=function(ev){if(ev.key==='Enter')ok();};
  }
  /* ── редактор умови показу блока (SPECblocksv2 §5.3) ── */
  function openCondSheet(blockId){
    var loc=locate(blockId); if(!loc)return;
    var b=loc.block, c=b.cond||{on:false,days:[],deadline:'',deadlineN:7,metric:null};
    var showMetric=(b.type==='pbar'||b.type==='kpi');
    var WD=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
    var selDays=(c.days||[]).slice();
    var ov=document.createElement('div'); ov.className='pgask-ov';
    var daysHtml=WD.map(function(w,i){return '<button class="cond-day'+(selDays.indexOf(i)>-1?' on':'')+'" data-cd="'+i+'">'+w+'</button>';}).join('');
    ov.innerHTML='<div class="pgask cond-card">'
      +'<div class="pgask-t">Умова показу</div>'
      +'<label class="cond-onrow"><input type="checkbox" id="condOnChk"'+(c.on?' checked':'')+'> Умова активна</label>'
      +'<div class="cond-lbl">День тижня (нічого — будь-який)</div>'
      +'<div class="cond-days">'+daysHtml+'</div>'
      +'<div class="cond-lbl">Дедлайн — показати коли лишилось ≤ N днів</div>'
      +'<div class="cond-row"><input type="date" class="cond-inp" id="condDate" value="'+esc(c.deadline||'')+'">'
      +'<input type="number" class="cond-inp cond-n" id="condN" min="1" placeholder="днів" value="'+(c.deadlineN||7)+'"></div>'
      +(showMetric?('<div class="cond-lbl">'+(b.type==='pbar'?'Прогрес':'Значення KPI')+'</div>'
        +'<div class="cond-row"><select class="cond-inp" id="condOp"><option value="lt"'+(!c.metric||c.metric.op==='lt'?' selected':'')+'>менше</option><option value="gt"'+(c.metric&&c.metric.op==='gt'?' selected':'')+'>більше</option></select>'
        +'<input type="number" class="cond-inp cond-n" id="condVal" placeholder="поріг" value="'+(c.metric?c.metric.v:'')+'"></div>'):'')
      +'<div class="pgask-b"><button class="c">Скасувати</button><button class="ok">Зберегти</button></div>'
      +'</div>';
    document.body.appendChild(ov);
    ov.querySelectorAll('.cond-day').forEach(function(btn){
      btn.onclick=function(){
        var d=+btn.dataset.cd, i=selDays.indexOf(d);
        if(i>-1) selDays.splice(i,1); else selDays.push(d);
        btn.classList.toggle('on');
      };
    });
    var close=function(){ov.remove();};
    ov.querySelector('.c').onclick=close;
    ov.addEventListener('click',function(ev){if(ev.target===ov)close();});
    ov.querySelector('.ok').onclick=function(){
      var l=locate(blockId); if(!l){close();return;}
      var onChk=ov.querySelector('#condOnChk').checked;
      var dateV=ov.querySelector('#condDate').value;
      var nV=+ov.querySelector('#condN').value||7;
      var newCond={on:onChk,days:selDays,deadline:dateV||'',deadlineN:nV,metric:null};
      if(showMetric){
        var opV=ov.querySelector('#condOp').value, valEl=ov.querySelector('#condVal');
        var valV=valEl?valEl.value:'';
        if(valV!=='') newCond.metric={op:opV,v:+valV};
      }
      var before=l.block.cond?JSON.parse(JSON.stringify(l.block.cond)):null;
      l.block.cond=newCond;
      pushOp(
        function(){var l2=locate(blockId);if(l2)l2.block.cond=before;},
        function(){var l3=locate(blockId);if(l3)l3.block.cond=JSON.parse(JSON.stringify(newCond));}
      );
      save();close();render();
    };
  }
  /* ── редактор стилю заголовка: шрифт / колір / контур / виділення ── */
  function openHeadingStyleSheet(blockId){
    var loc=locate(blockId); if(!loc)return;
    var b=loc.block;
    if(b.type!=='h1'&&b.type!=='h2'&&b.type!=='h3')return;
    var fonts=[['def','Звичайний',''],['serif','Класика',PGH_FONTS.serif],['script','Підпис',PGH_FONTS.script],['mono','Код',PGH_FONTS.mono]];
    var colors=['','#f3f5f8','#ff6b9d','#34c77b','#f0b429','#6a7dff','#c77dff','#4ecdc4'];
    var selFont=b.hfont||'def', selClr=b.hclr||'';
    var ov=document.createElement('div'); ov.className='pgask-ov';
    var fontHtml=fonts.map(function(f){return '<button class="hstyle-font'+(selFont===f[0]?' on':'')+'" data-hf="'+f[0]+'" style="'+(f[2]?'font-family:'+f[2]+';':'')+'">'+f[1]+'</button>';}).join('');
    var colorHtml=colors.map(function(c){return '<button class="hstyle-clr'+(selClr===c?' on':'')+'" data-hc="'+c+'" style="background:'+(c||'var(--pg-field)')+'">'+(c?'':'✕')+'</button>';}).join('');
    ov.innerHTML='<div class="pgask cond-card">'
      +'<div class="pgask-t">Стиль заголовка</div>'
      +'<div class="cond-lbl">Шрифт</div>'
      +'<div class="hstyle-fonts">'+fontHtml+'</div>'
      +'<div class="cond-lbl">Колір</div>'
      +'<div class="hstyle-clrs">'+colorHtml+'</div>'
      +'<label class="cond-onrow"><input type="checkbox" id="hOutChk"'+(b.hout?' checked':'')+'> Контур (порожні літери)</label>'
      +'<label class="cond-onrow"><input type="checkbox" id="hHlChk"'+(b.hhl?' checked':'')+'> Виділення тлом</label>'
      +'<div class="pgask-b"><button class="c">Скасувати</button><button class="ok">Зберегти</button></div>'
      +'</div>';
    document.body.appendChild(ov);
    ov.querySelectorAll('.hstyle-font').forEach(function(btn){
      btn.onclick=function(){ selFont=btn.dataset.hf; ov.querySelectorAll('.hstyle-font').forEach(function(x){x.classList.toggle('on',x===btn);}); };
    });
    ov.querySelectorAll('.hstyle-clr').forEach(function(btn){
      btn.onclick=function(){ selClr=btn.dataset.hc; ov.querySelectorAll('.hstyle-clr').forEach(function(x){x.classList.toggle('on',x===btn);}); };
    });
    var close=function(){ov.remove();};
    ov.querySelector('.c').onclick=close;
    ov.addEventListener('click',function(ev){if(ev.target===ov)close();});
    ov.querySelector('.ok').onclick=function(){
      var l=locate(blockId); if(!l){close();return;}
      var before={hfont:l.block.hfont,hclr:l.block.hclr,hout:l.block.hout,hhl:l.block.hhl};
      l.block.hfont=selFont; l.block.hclr=selClr;
      l.block.hout=ov.querySelector('#hOutChk').checked;
      l.block.hhl=ov.querySelector('#hHlChk').checked;
      var after={hfont:l.block.hfont,hclr:l.block.hclr,hout:l.block.hout,hhl:l.block.hhl};
      pushOp(
        function(){var l2=locate(blockId);if(l2)Object.assign(l2.block,before);},
        function(){var l3=locate(blockId);if(l3)Object.assign(l3.block,after);}
      );
      save();close();render();
    };
  }
  if(!window.__pgFcTick){
    window.__pgFcTick=setInterval(function(){
      var scrEl=document.getElementById('scr-page');
      if(!scrEl||!scrEl.classList.contains('active'))return;
      editor.querySelectorAll('.pgfc.run').forEach(function(w){
        var l=locate(w.dataset.pgfcid); if(!l)return;
        var fb=l.block, fnow=Date.now();
        if(!fb.end||fb.end<=fnow){
          if(fb.end){
            var fy=(function(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})();
            if(fb.mode!=='rest'){fb.done=(fb.done||0)+1;fb.doneD=fy;fb.mode='rest';}
            else fb.mode='work';
            fb.end=0; try{window.platform.haptic('heavy');}catch(_){ }
            save();render();
          }
          return;
        }
        var tot=(fb.mode==='rest'?5:25)*60000, left=fb.end-fnow;
        var mm=Math.floor(left/60000), ss=Math.floor(left%60000/1000);
        var tEl=w.querySelector('.pgfc-t'); if(tEl)tEl.textContent=mm+':'+String(ss).padStart(2,'0');
        var fg=w.querySelector('.fgc');
        if(fg){var C=2*Math.PI*26; fg.style.strokeDashoffset=C*(1-left/tot);}
      });
    },1000);
  }

  /* якір: ставимо меню одразу ПІД блоком, який додаємо (всі екрани) */
  function positionSlash(){
    slash.classList.remove('anch');
    slash.style.left='';slash.style.top='';slash.style.width='';slash.style.maxHeight='';
    if(!slashCtx)return;
    var row=null;
    try{row=editor.querySelector('.pgb[data-id="'+String(slashCtx).replace(/"/g,'\\"')+'"]');}catch(_){}
    if(!row)return;
    var r=row.getBoundingClientRect(),
        vw=window.innerWidth,
        vh=(window.visualViewport?window.visualViewport.height:window.innerHeight);
    var topBar=document.querySelector('#scr-page .pg-top');
    var safeTop=topBar?Math.max(0,topBar.getBoundingClientRect().bottom):0; /* липка шапка — інакше меню лізе під неї */
    var W=Math.min(560,vw-24),
        H=Math.min(vw<760?340:400,Math.round(vh*.52)),
        below=vh-r.bottom-16, above=r.top-safeTop-16, top;
    if(below>=Math.min(H,220)){ H=Math.min(H,below); top=r.bottom+8; }      /* під блоком */
    else if(above>=220){ H=Math.min(H,above); top=Math.max(safeTop+8,r.top-H-8); }  /* над блоком, але не під шапкою */
    else { top=Math.max(safeTop+8,vh-H-12); }                              /* fallback */
    var left=Math.max(12,Math.min(r.left,vw-W-12));
    slash.classList.add('anch');
    slash.style.left=left+'px';slash.style.top=top+'px';
    slash.style.width=W+'px';slash.style.maxHeight=Math.round(H)+'px';
  }
  function openSlash(){
    pgsCat='base';buildSlash('');ssearch.value='';positionSlash();
    slash.classList.add('show');backdrop.classList.add('show');
    /* автофокус лише на десктопі: на iOS клавіатура зсуває viewport і тапи по fixed-меню промахуються */
    if(window.innerWidth>=760) setTimeout(function(){ssearch.focus();},60);
  }
  function closeSlash(){slash.classList.remove('show');slash.classList.remove('anch');backdrop.classList.remove('show');slashCtx=null;}
  ssearch.addEventListener('input',function(){buildSlash(ssearch.value);});
  function applySlash(k){
    try{ if(k&&k!=='note'){ pgLastSet(k); pgRecentAdd(k); } }catch(_){}
    if(!slashCtx){closeSlash();return;}
    var loc=locate(slashCtx);if(!loc){closeSlash();return;}
    var b=loc.block;
    var BT=(bridge()&&bridge().blockTypes())||{};
    function bTitle(t,fb){ return (BT[t]&&BT[t].title)||fb; }
    if(k==='divider'){b.type='divider';}
    else if(k==='db'){b.type='db';b.dbName=b.title||'Нова база';b.view='table';b.cols=[{k:'name',t:'Назва'},{k:'status',t:'Статус'},{k:'note',t:'Нотатка'}];b.rows=[{name:'Запис 1',status:'Нова',note:''}];}
    else if(k==='callout'){b.type='callout';b.emo='💡';}
    else if(k==='toggle'){b.type='toggle';b.open=true;b.children=b.children||[{id:uid(),type:'note',text:''}];}
    else if(k==='win'){b.type='win';b.open=true;b.h=b.h||140;b.title=b.title||'';delete b.text;b.children=b.children||[{id:uid(),type:'note',text:''}];}
    else if(k==='task'){b.type='task';if(b.done==null)b.done=false;}
    else if(k==='page'){b.type='page';b.title=b.title||'';b.children=b.children||[];}
    else if(k==='group'){b.type='group';b.title=b.title||'';b.children=b.children||[];}
    else if(k==='photo'){b.type='photo';b.title=b.title||'Фото';}
    else if(k==='link'){b.type='link';b.url=b.url||'';}
    /* ── віджети: ті ж дефолти, що й на дошці ── */
    else if(k==='progress'){b.type='progress';b.title=b.title||'Прогрес';if(b.value==null)b.value=0;}
    else if(k==='countdown'){b.type='countdown';b.title=b.title||'Відлік';b.target=b.target||'';b.label=b.label||'';}
    else if(k==='fin'){b.type='fin';b.title='Фінанси';}
    else if(k==='calendar'){b.type='calendar';b.title=b.title||'Календар';b.marks=b.marks||{};
      if(!b.ym){var _d=new Date();b.ym=_d.getFullYear()+'-'+String(_d.getMonth()+1).padStart(2,'0');}}
    else if(k==='journal'){b.type='journal';b.title=b.title||'Щоденник';b.entries=b.entries||{};b.jmode=b.jmode||'full';}
    else if(k==='decision'){b.type='decision';b.title=b.title||'Лог рішень';b.decisions=b.decisions||[];b.dmode=b.dmode||'full';}
    else if(k==='ptracker'){b.type='ptracker';b.title=b.title||'Новий проєкт';b.emoji=b.emoji||'🎯';b.color=b.color||'#7c8cff';b.link=b.link||'';b.steps=b.steps||[];b.habits=b.habits||[];b.pmode=b.pmode||'full';}
    else if(k==='phub'){b.type='phub';b.title=b.title||'Мої проєкти';b.projects=b.projects||[];b.pmode=b.pmode||'full';}
    else if(k==='habits'){b.type='habits';b.title=b.title||'Звички';b.habits=b.habits||[];b.hmode=b.hmode||'full';}
    else if(k==='code'){b.type='code';b.text=b.text||'';b.lang=b.lang||'';}
    else if(k==='section'){b.type='section';b.text=b.text||'';}
    else if(k==='pbar'){b.type='pbar';b.title=b.title||'';b.value=b.value||0;if(b.auto==null)b.auto=false;}
    else if(k==='weekreview'){b.type='weekreview';b.title=b.title||'Огляд тижня';b.summary=b.summary||'';b.updatedAt=b.updatedAt||null;b.loading=false;}
    else if(k==='file'){b.type='file';b.data='';b.fname='';b.fsize='';}
    else if(k==='wpult'||k==='wpipe'||k==='wportal'){b.type=k;b.title=bTitle(k,b.title||'Віджет');}
    else if(k==='wstack'){b.type='wstack';b.title=bTitle('wstack','Фокус-стек');if(b.idx==null)b.idx=0;}
    else if(k==='wtline'){b.type='wtline';b.title=bTitle('wtline','Таймлайн');}
    else if(k==='wplanday'||k==='wplanmonth'){
      b.type=k;b.title=bTitle(k,'План');
      try{var _bk=(bridge()&&bridge().curKey&&bridge().curKey())||'';var _bf=String(_bk).split('__sp_')[0];
        if(_bf&&_bf!=='all')b.pfolder=_bf;}catch(_){}
    }
    else if(k==='envelope'){b.type='envelope';b.title=b.title||'Конверт';if(b.envId===undefined)b.envId=null;}
    else if(k==='festival'){b.type='festival';b.title=b.title||'Нова подія';b.emojiF=b.emojiF||'🎪';
      b.date=b.date||'';b.dateEnd=b.dateEnd||'';b.place=b.place||'';if(b.budget==null)b.budget=0;
      b.cur=b.cur||'€';b.ops=b.ops||[];b.program=b.program||[];}
    /* ── проєктні блоки ── */
    else if(k==='project'){b.type='project';b.title=b.title||'Проєкт';b.ops=b.ops||[];
      if(b.expected==null)b.expected=0;b.cur=b.cur||'€';b.deadline=b.deadline||'';if(b.pview==null)b.pview=1;}
    else if(k==='kanban'){b.type='kanban';b.title=b.title||'Канбан';
      if(!Array.isArray(b.cols)||!b.cols.length||typeof b.cols[0]==='string'){
        var _n=Date.now();b.cols=[{id:'kc'+_n,name:'Заявки',cards:[]},{id:'kc'+(_n+1),name:'В роботі',cards:[]},{id:'kc'+(_n+2),name:'Готово',cards:[]}];
      }
      delete b.rows;}
    else if(k==='contacts'){b.type='contacts';b.title=b.title||'Контакти';b.people=b.people||[];}
    else if(k==='caseline'){b.type='caseline';b.title=b.title||'Таймлайн справи';b.events=b.events||[];}
    /* ═══ PREMIUM PACK V1 ═══ */
    else if(k==='prompt'){b.type='prompt';b.title=b.title||'';b.ptext=b.ptext||'';}
    else if(k==='heatmap'){b.type='heatmap';b.title=b.title||'Звичка';b.marks=b.marks||{};}
    else if(k==='kpi'){b.type='kpi';b.title=b.title||'KPI';b.unit=b.unit||'';b.points=b.points||[];}
    else if(k==='chart'){b.type='chart';b.title=b.title||'Графік';b.points=b.points||[];b.view=b.view||'bar';}
    else if(k==='tabs'){b.type='tabs';b.title=b.title||'';if(!Array.isArray(b.tabs)||!b.tabs.length)b.tabs=[{name:'Нотатки',text:''}];if(b.ti==null)b.ti=0;}
    else if(k==='accord'){b.type='accord';b.title=b.title||'';if(!Array.isArray(b.secs)||!b.secs.length)b.secs=[{name:'Секція',text:'',open:1}];}
    else if(k==='embed'){b.type='embed';b.title=b.title||'Відео';b.url=b.url||'';b.play=0;}
    else if(k==='audio'){b.type='audio';b.title=b.title||'';b.url=b.url||'';b.name=b.name||'';}
    else if(k==='wfocus'){b.type='wfocus';b.title=b.title||'Фокус';b.mode=b.mode||'work';if(b.end==null)b.end=0;if(b.done==null)b.done=0;b.doneD=b.doneD||'';}
    else if(k==='ai'){
      var bid=slashCtx; closeSlash();
      pgAsk('Спитати Флоу','напр. Перетвори нотатки на план з кроками','',function(q){
        q=String(q||'').trim(); if(!q) return;
        var l0=locate(bid); if(!l0) return;
        l0.block.type='note'; l0.block.text='✦ Флоу думає…'; save(); render();
        var pageTxt=''; try{ pageTxt=String((editor&&editor.innerText)||'').slice(0,4000); }catch(_){}
        Promise.resolve(aiPageAsk(q,pageTxt)).then(function(ans){
          var l2=locate(bid); if(!l2) return;
          l2.block.type='note'; l2.block.text=String(ans||'').trim().slice(0,4000)||'…';
          save(); render();
        }).catch(function(e){
          var l2=locate(bid); if(!l2) return;
          l2.block.text='⚠️ '+String(e&&e.message||e); save(); render();
        });
      });
      return;
    }
    else if(k==='card'){
      if(b.type!=='card'){
        var srcT=b.type, bg0='plain';
        if(srcT==='glass') bg0='glass';
        else if(srcT==='quote'||srcT==='callout') bg0='color';
        var kids0=(srcT==='win'&&Array.isArray(b.children))?b.children:[{id:uid(),type:'note',text:''}];
        var h0=b.h||140, text0=(b.text!=null?b.text:''), title0=(b.title!=null?b.title:'');
        var accent0=(srcT==='quote'), icon0=(srcT==='callout')?(b.emo||'💡'):'';
        b.type='card'; b.bg=bg0; b.accent=accent0; b.icon=icon0; b.text=text0; b.title=title0; b.h=h0;
        if(bg0==='plain'||bg0==='photo') b.children=kids0; else delete b.children;
        delete b.emo;
      } else {
        /* вже Картка — повторний вибір «Картки» циклічно перемикає пресет (SPECblocksv2 §3.1 «Перетворити на…») */
        var order=['plain','color','glass','photo']; var ci=order.indexOf(b.bg);
        b.bg=order[(ci+1+order.length)%order.length];
        if((b.bg==='plain'||b.bg==='photo')&&!Array.isArray(b.children)) b.children=[{id:uid(),type:'note',text:''}];
      }
    }
    else if(k==='attach'){
      if(b.type!=='attach'){
        var srcT2=b.type, sub0='link';
        if(srcT2==='file') sub0='file'; else if(srcT2==='embed') sub0='video'; else if(srcT2==='audio') sub0='audio';
        b.type='attach'; b.sub=sub0; b.url=b.url||''; b.title=b.title||'';
      } else {
        var aorder=['link','video','audio','file']; var aci=aorder.indexOf(b.sub);
        b.sub=aorder[(aci+1+aorder.length)%aorder.length];
      }
    }
    else if(k==='board'){ b.type='board'; b.children=Array.isArray(b.children)?b.children:[]; }
    else{b.type=k;}
    var was=slashCtx;
    if(turnSnap&&turnSnap.id===was){
      var tsBefore=turnSnap.before,tsAfter=JSON.parse(JSON.stringify(b)),tsId=was;
      pushOp(
        function(){var l=locate(tsId);if(l){var blk=l.block;Object.keys(blk).forEach(function(kk){delete blk[kk];});Object.assign(blk,tsBefore);}},
        function(){var l=locate(tsId);if(l){var blk=l.block;Object.keys(blk).forEach(function(kk){delete blk[kk];});Object.assign(blk,tsAfter);}}
      );
      turnSnap=null;
    }
    closeSlash();save();render();
    var el=editor.querySelector('[data-edit="'+was+'"]');if(el)caretEnd(el);
    /* показати результат: доскролити до нового блоку + спалах */
    var rb=editor.querySelector('.pgb[data-id="'+was+'"]');
    if(rb){
      try{rb.scrollIntoView({block:'center',behavior:'smooth'});}catch(_){try{rb.scrollIntoView();}catch(__){}}
      rb.classList.add('pg-born');
      setTimeout(function(){try{rb.classList.remove('pg-born');}catch(_){}},900);
    }
  }
  backdrop.onclick=function(){closeSlash();closeBmenu();};

  // ── drag & drop ──
  var drag=null;
  editor.addEventListener('touchstart',dstart,{passive:false});
  editor.addEventListener('mousedown',dstart);
  function dstart(e){
    var g=e.target.closest('[data-pggrip]');if(!g)return;e.preventDefault();
    var id=g.dataset.pggrip,row=g.closest('.pgb');
    drag={id:id,row:row,startY:(e.touches?e.touches[0].clientY:e.clientY),moved:false,target:null,mode:null};
    row.classList.add('dragging');
    document.addEventListener('touchmove',dmove,{passive:false});document.addEventListener('mousemove',dmove);
    document.addEventListener('touchend',dend);document.addEventListener('mouseup',dend);
    drag.hold=setTimeout(function(){if(drag&&!drag.moved){openBmenu(id);cancelDrag();}},400);
  }
  /* «привид» блока під курсором під час перетягування (SPECblocksv2 §4.2) */
  function ghostMake(row){
    try{
      var rc=row.getBoundingClientRect();
      var g=document.createElement('div'); g.className='pg-ghost'; g.style.width=rc.width+'px';
      g.innerHTML=row.innerHTML;
      document.body.appendChild(g);
      return g;
    }catch(_){ return null; }
  }
  function ghostMove(g,x,y){ if(g){ g.style.left=(x+16)+'px'; g.style.top=(y+16)+'px'; } }
  function ghostKill(g){ try{ if(g&&g.parentNode) g.parentNode.removeChild(g); }catch(_){} }
  function clearMarks(){editor.querySelectorAll('.drop-before,.drop-after,.drop-into,.drop-left,.drop-right').forEach(function(el){el.classList.remove('drop-before','drop-after','drop-into','drop-left','drop-right');});}
  function dmove(e){
    if(!drag)return;
    var y=e.touches?e.touches[0].clientY:e.clientY,x=e.touches?e.touches[0].clientX:e.clientX;
    if(Math.abs(y-drag.startY)>6&&!drag.moved){drag.moved=true;clearTimeout(drag.hold);drag.ghost=ghostMake(drag.row);}
    if(!drag.moved)return;e.preventDefault();clearMarks();
    if(drag.ghost)ghostMove(drag.ghost,x,y);
    var rows=[].slice.call(editor.querySelectorAll('.pgb')).filter(function(r){return r!==drag.row;});
    var tgt=null,best=1e9;
    rows.forEach(function(r){var rc=r.getBoundingClientRect();var mid=rc.top+rc.height/2;var d=Math.abs(y-mid);if(d<best){best=d;tgt=r;}});
    if(!tgt)return;
    var rc=tgt.getBoundingClientRect(),rel=(y-rc.top)/rc.height;drag.target=tgt.dataset.id;
    var tb=locate(tgt.dataset.id);
    var canNest=tb&&(tb.block.type==='toggle'||tb.block.type==='task'||tb.block.type==='note'||tb.block.type==='bullet'||tb.block.type==='card');
    var xrel=(x-rc.left)/rc.width;
    if(rc.width>=260&&rel>0.18&&rel<0.82&&(xrel<0.22||xrel>0.78)){
      drag.mode=xrel<0.22?'left':'right';
      tgt.classList.add(drag.mode==='left'?'drop-left':'drop-right');
    }
    else if(x>rc.left+60&&canNest&&rel>0.25&&rel<0.75){drag.mode='into';tgt.classList.add('drop-into');}
    else if(rel<0.5){drag.mode='before';tgt.classList.add('drop-before');}
    else{drag.mode='after';tgt.classList.add('drop-after');}
  }
  function dend(){
    if(!drag)return;clearTimeout(drag.hold);
    document.removeEventListener('touchmove',dmove);document.removeEventListener('mousemove',dmove);
    document.removeEventListener('touchend',dend);document.removeEventListener('mouseup',dend);
    if(drag.moved&&drag.target&&drag.id!==drag.target){
      var pos=drag.mode==='into'?'inside':drag.mode;
      var rD=moveBlock(drag.id,drag.target,pos);
      if(rD){pushOp(function(){undoMove(rD);},function(){redoMove(rD);});save();}
    }
    ghostKill(drag.ghost);
    clearMarks();if(drag.row)drag.row.classList.remove('dragging');drag=null;render();
  }
  function cancelDrag(){
    if(!drag)return;
    document.removeEventListener('touchmove',dmove);document.removeEventListener('mousemove',dmove);
    document.removeEventListener('touchend',dend);document.removeEventListener('mouseup',dend);
    ghostKill(drag.ghost);
    clearMarks();if(drag.row)drag.row.classList.remove('dragging');drag=null;
  }
  /* ── розтягування колонок за роздільник (SPECblocksv2 §4.1) ── */
  (function(){
    var rd=null;
    function rdStart(e){
      var d=e.target.closest&&e.target.closest('[data-pgcoldiv]'); if(!d)return; e.preventDefault();
      var parts=d.dataset.pgcoldiv.split('|'), rowId=parts[0], ci=+parts[1];
      var rowLoc=locate(rowId); if(!rowLoc||rowLoc.block.type!=='row')return;
      var cols=rowLoc.block.children; if(!cols[ci]||!cols[ci+1])return;
      var wrapEl=d.closest('.pg-row'); if(!wrapEl)return;
      rd={rowId:rowId,ci:ci,cols:cols,totalW:wrapEl.getBoundingClientRect().width,
          startX:(e.touches?e.touches[0].clientX:e.clientX),w1:cols[ci].width,w2:cols[ci+1].width};
      document.addEventListener('touchmove',rdMove,{passive:false});document.addEventListener('mousemove',rdMove);
      document.addEventListener('touchend',rdEnd);document.addEventListener('mouseup',rdEnd);
    }
    function rdMove(e){
      if(!rd)return; e.preventDefault();
      var x=e.touches?e.touches[0].clientX:e.clientX;
      var dx=(x-rd.startX)/Math.max(1,rd.totalW);
      var minW=0.15; /* мінімальна ширина колонки — не звужується далі (SPECblocksv2 §4.2) */
      var total=rd.w1+rd.w2;
      var nw1=Math.max(minW,Math.min(total-minW,rd.w1+dx)), nw2=total-nw1;
      rd.cols[rd.ci].width=nw1; rd.cols[rd.ci+1].width=nw2;
      var wrapEl=editor.querySelector('.pg-row[data-id="'+rd.rowId+'"]');
      if(wrapEl){
        var colEls=wrapEl.querySelectorAll(':scope > .pg-col');
        if(colEls[rd.ci])colEls[rd.ci].style.setProperty('--cw',nw1);
        if(colEls[rd.ci+1])colEls[rd.ci+1].style.setProperty('--cw',nw2);
      }
    }
    function rdEnd(){
      if(!rd)return;
      document.removeEventListener('touchmove',rdMove);document.removeEventListener('mousemove',rdMove);
      document.removeEventListener('touchend',rdEnd);document.removeEventListener('mouseup',rdEnd);
      save(); rd=null;
    }
    editor.addEventListener('touchstart',rdStart,{passive:false});
    editor.addEventListener('mousedown',rdStart);
  })();
  /* ── ресайз віджета в дошці за кут, прилипання до сітки (SPECblocksv2 §4.3) ── */
  (function(){
    var bz=null, ROWH=64; /* фіксований крок висоти — має збігатися з --pgboardrow у CSS */
    function bzStart(e){
      var h=e.target.closest&&e.target.closest('[data-pgboardrz]'); if(!h)return; e.preventDefault();
      var itemId=h.dataset.pgboardrz;
      var cell=h.closest('.pg-bitem'), boardEl=h.closest('.pg-board'); if(!cell||!boardEl)return;
      var loc=locate(itemId); if(!loc)return;
      bz={id:itemId,block:loc.block,cell:cell,
          colW:boardEl.getBoundingClientRect().width/12,
          startX:(e.touches?e.touches[0].clientX:e.clientX),startY:(e.touches?e.touches[0].clientY:e.clientY),
          w0:loc.block.gw||4,h0:loc.block.gh||2};
      document.addEventListener('touchmove',bzMove,{passive:false});document.addEventListener('mousemove',bzMove);
      document.addEventListener('touchend',bzEnd);document.addEventListener('mouseup',bzEnd);
    }
    function bzMove(e){
      if(!bz)return; e.preventDefault();
      var x=e.touches?e.touches[0].clientX:e.clientX,y=e.touches?e.touches[0].clientY:e.clientY;
      var dW=Math.round((x-bz.startX)/Math.max(1,bz.colW)), dH=Math.round((y-bz.startY)/ROWH);
      bz.block.gw=Math.max(2,Math.min(12,bz.w0+dW));
      bz.block.gh=Math.max(1,Math.min(8,bz.h0+dH));
      bz.cell.style.setProperty('--gw',bz.block.gw); bz.cell.style.setProperty('--gh',bz.block.gh);
    }
    function bzEnd(){
      if(!bz)return;
      document.removeEventListener('touchmove',bzMove);document.removeEventListener('mousemove',bzMove);
      document.removeEventListener('touchend',bzEnd);document.removeEventListener('mouseup',bzEnd);
      save(); bz=null;
    }
    editor.addEventListener('touchstart',bzStart,{passive:false});
    editor.addEventListener('mousedown',bzStart);
  })();

  // ── block menu ──
  var bmenu=document.getElementById('pgBmenu'),bmId=null;
  function openBmenu(id){bmId=id;bmenu.classList.add('show');backdrop.classList.add('show');}
  /* ── довге натискання на блок → меню (видалити / закріпити / дублювати) ── */
  (function(){
    var lp=null;
    function clearLP(){ if(lp){clearTimeout(lp.t);lp=null;} }
    function start(e){
      var tgt=e.target; if(!tgt||!tgt.closest)return;
      if(tgt.closest('input,textarea,select,button,a,[data-pgaddafter],[data-pggrip],.pg-addrow'))return;
      var row=tgt.closest('.pgb'); if(!row||!row.dataset.id)return;
      var ce=tgt.closest('[contenteditable="true"]');
      /* у текстових полях довгий тап лишаємо системі (виділення тексту), КРІМ віджетів */
      if(ce && !tgt.closest('.pgwidget'))return;
      var p=e.touches?e.touches[0]:e;
      lp={x:p.clientX,y:p.clientY,t:setTimeout(function(){
        lp=null;
        try{window.platform&&window.platform.haptic&&window.platform.haptic('medium');}catch(_){}
        openBmenu(row.dataset.id);
      },450)};
    }
    function move(e){
      if(!lp)return;
      var p=e.touches?e.touches[0]:e;
      if(Math.abs(p.clientX-lp.x)>8||Math.abs(p.clientY-lp.y)>8)clearLP();
    }
    editor.addEventListener('touchstart',start,{passive:true});
    editor.addEventListener('mousedown',start);
    editor.addEventListener('touchmove',move,{passive:true});
    editor.addEventListener('mousemove',move);
    ['touchend','touchcancel','mouseup','mouseleave'].forEach(function(ev){editor.addEventListener(ev,clearLP,{passive:true});});
    /* на віджетах контекстне меню/callout iOS не потрібне */
    editor.addEventListener('contextmenu',function(e){
      if(e.target&&e.target.closest&&e.target.closest('.pgwidget'))e.preventDefault();
    });
  })();
  function closeBmenu(){bmenu.classList.remove('show');backdrop.classList.remove('show');bmId=null;}
  bmenu.addEventListener('click',function(e){
    var it=e.target.closest('[data-pgact]');if(!it||!bmId)return;
    var act=it.dataset.pgact,loc=locate(bmId);if(!loc){closeBmenu();return;}
    if(act==='del'){
      var dArr=loc.arr,dIdx=loc.idx,dBlk=loc.block;
      dArr.splice(dIdx,1);
      pushOp(function(){dArr.splice(Math.min(dIdx,dArr.length),0,dBlk);},
             function(){var i=dArr.indexOf(dBlk);if(i>-1)dArr.splice(i,1);});
    }
    else if(act==='dup'){
      var cp=JSON.parse(JSON.stringify(loc.block));cp.id=uid();
      var uArr=loc.arr,origBlk=loc.block;
      uArr.splice(loc.idx+1,0,cp);
      pushOp(function(){var i=uArr.indexOf(cp);if(i>-1)uArr.splice(i,1);},
             function(){var i2=uArr.indexOf(origBlk);uArr.splice(i2>-1?i2+1:uArr.length,0,cp);});
    }
    else if(act==='pin'){
      var pBlk=loc.block,pWas=!!pBlk.pinned;
      pBlk.pinned=!pWas;
      pushOp(function(){pBlk.pinned=pWas;},function(){pBlk.pinned=!pWas;});
    }
    else if(act==='indent'){
      if(loc.idx>0){
        var pvId=loc.arr[loc.idx-1].id;
        var rI=moveBlock(bmId,pvId,'inside');
        if(rI)pushOp(function(){undoMove(rI);},function(){redoMove(rI);});
      }
    }
    else if(act==='outdent'){
      if(loc.parent){
        var rO=moveBlock(bmId,loc.parent.id,'after');
        if(rO)pushOp(function(){undoMove(rO);},function(){redoMove(rO);});
      }
    }
    else if(act==='turn'){turnSnap={id:bmId,before:JSON.parse(JSON.stringify(loc.block))};closeBmenu();slashCtx=bmId;openSlash();return;}
    else if(act==='cond'){closeBmenu();openCondSheet(bmId);return;}
    else if(act==='hstyle'){closeBmenu();openHeadingStyleSheet(bmId);return;}
    save();closeBmenu();render();
  });

  // ── тема ──
  var THKEY='flowPageTheme';
  function applyTheme(t){scr.classList.toggle('pg-paper',t==='paper');
    document.querySelectorAll('#pgTheme [data-pgtheme]').forEach(function(b){b.classList.toggle('on',b.dataset.pgtheme===t);});
    try{localStorage.setItem(THKEY,t);}catch(_){}}
  document.getElementById('pgTheme').addEventListener('click',function(e){var b=e.target.closest('[data-pgtheme]');if(b)applyTheme(b.dataset.pgtheme);});
  document.getElementById('pgUndoBtn').onclick=function(){doUndo();};
  document.getElementById('pgShowHiddenBtn').onclick=function(){
    pgShowHidden=!pgShowHidden;
    this.classList.toggle('on',pgShowHidden);
    this.title=pgShowHidden?'Ховати блоки з умовою знову':'Показати сховані умовою блоки';
    render();
  };
  var savedTheme='ink';try{savedTheme=localStorage.getItem(THKEY)||'ink';}catch(_){}

  // ── назва сторінки → назва папки ──
  var pgTitle=document.getElementById('pgTitle');
  pgTitle.addEventListener('input',function(){/* назва папки редагується в самому Flow; тут лише показ */});

  // ── back ──
  document.getElementById('pgBack').onclick=function(){
    var g=window.__flowExitPage; if(g){g();return;}
    if(window.__show)window.__show('scr-home');
  };

  // ── кнопка «+ Додати блок»: створює порожній рядок і одразу відкриває меню ──
  var addBtn=document.getElementById('pgAddBlock');
  if(addBtn) addBtn.onclick=function(){
    if(!bridge())return;
    var nb={id:uid(),type:'note',text:''};
    pgResolve().arr.push(nb); save(); render();
    slashCtx=nb.id; openSlash();
  };

  // ── віджет «Відлік»: живий циферблат ──
  var CD_MONTHS=['січ','лют','бер','кві','тра','чер','лип','сер','вер','жов','лис','гру'];
  function cdFmt(t){
    if(!t)return '';
    var d=new Date(t+'T00:00:00'); if(isNaN(+d))return t;
    return d.getDate()+' '+CD_MONTHS[d.getMonth()]+' '+d.getFullYear();
  }
  function cdHTML(b){
    var id=b.id, tgt=b.target||'';
    var head='<div class="pgcd-hd"><span class="pgcd-ic">'+pgsIc('countdown')+'</span>'
      +'<div class="pgcd-tt pg-empty" contenteditable="true" data-ph="Назва відліку…" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
      +'<button class="pgcd-dt" data-pgcdcal="'+id+'">'+(tgt?cdFmt(tgt):'обрати дату')+'</button>'
      +'<button class="pgcd-more" data-pgcdmore="'+id+'">⋯</button></div>';
    var body=tgt
      ? '<div class="pgcd-big"><span class="pgcd-days" data-cdd>—</span><span class="pgcd-dl">днів</span></div>'
        +'<div class="pgcd-segs">'
        +'<div class="pgcd-seg"><b data-cdh>—</b><span>год</span></div>'
        +'<div class="pgcd-seg"><b data-cdm>—</b><span>хв</span></div>'
        +'<div class="pgcd-seg"><b data-cds>—</b><span>сек</span></div></div>'
      : '<div class="pgcd-empty">Тапни «обрати дату» — і відлік оживе.</div>';
    return '<div class="pg-content"><div class="pgcd" data-pgcdwrap data-target="'+esc(tgt)+'">'+head+body+'</div></div>';
  }

