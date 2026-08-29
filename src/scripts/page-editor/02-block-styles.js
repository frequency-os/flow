  function equalizeWidths(cols){ var n=cols.length||1; cols.forEach(function(c){ c.width=1/n; }); }

  /* ── стиль заголовка: колір / шрифт / контур / виділення, як в Instagram-текстах ── */
  var PGH_FONTS={serif:"'Lora',Georgia,serif",mono:"ui-monospace,'SF Mono',Menlo,monospace",script:"'Caveat',cursive"};
  function headingStyle(b){
    var st='';
    if(PGH_FONTS[b.hfont]) st+='font-family:'+PGH_FONTS[b.hfont]+';';
    if(b.hout){
      var oc=b.hclr||'currentColor';
      st+='-webkit-text-stroke:1.3px '+oc+';-webkit-text-fill-color:transparent;paint-order:stroke fill;';
    } else if(b.hclr){ st+='color:'+b.hclr+';'; }
    return {style:st,cls:(b.hhl?' pgh-hl':'')};
  }

  // ── умовне відображення блоків (SPECblocksv2 §5.3) ──
  var pgShowHidden=false;
  function pbarAutoValue(b){
    var loc=locate(b.id); var sibs=(loc&&loc.arr)||[];
    var tks=sibs.filter(function(x){return x.type==='task';});
    return tks.length?Math.round(tks.filter(function(x){return x.done;}).length/tks.length*100):0;
  }
  function condMet(b){
    var c=b&&b.cond; if(!c||!c.on) return true;
    var any=false, ok=true;
    if(c.days&&c.days.length){
      any=true; var wd=(new Date().getDay()+6)%7; /* 0=Пн … 6=Нд */
      if(c.days.indexOf(wd)===-1) ok=false;
    }
    if(c.deadline){
      any=true;
      var today=new Date(); today.setHours(0,0,0,0);
      var dl=new Date(c.deadline+'T00:00:00');
      var diff=Math.round((dl-today)/86400000);
      if(!(diff>=0 && diff<(c.deadlineN||7))) ok=false;
    }
    if(c.metric&&(b.type==='pbar'||b.type==='kpi')){
      any=true;
      var val = b.type==='pbar' ? (b.auto?pbarAutoValue(b):(+b.value||0))
              : ((b.points&&b.points.length)?(+b.points[b.points.length-1].v||0):0);
      if(c.metric.op==='lt'){ if(!(val<c.metric.v)) ok=false; } else { if(!(val>c.metric.v)) ok=false; }
    }
    return any?ok:true;
  }
  /* ── ліворуч/праворуч: покласти блок у нову або сусідню колонку (SPECblocksv2 §4.1) ──
     Випадок А: ціль уже в колонці ряду → додаємо нову колонку поруч.
     Випадок Б: ціль ще без ряду → створюємо новий ряд з двох колонок (ціль + перенесений блок). */
  function moveBlockSide(src,targetId,side){
    var block=src.block, fromArr=src.arr, fromIdx=src.idx;
    var t0=locate(targetId); if(!t0) return null;
    var parentIsCol=t0.parent&&t0.parent.type==='col';
    var colLoc=parentIsCol?locate(t0.parent.id):null;
    var rowParent=(colLoc&&colLoc.parent&&colLoc.parent.type==='row')?colLoc.parent:null;

    if(rowParent){
      var rowChildrenArr=colLoc.arr, sameArr=(fromArr===rowChildrenArr);
      var beforeA=snapshotArr(rowChildrenArr), beforeB=sameArr?null:snapshotArr(fromArr);
      fromArr.splice(fromIdx,1);
      var col2=locate(t0.parent.id);
      if(!col2||!col2.parent||col2.parent.type!=='row'){
        restoreArr(rowChildrenArr,beforeA); if(!sameArr)restoreArr(fromArr,beforeB); return null;
      }
      var insAt=side==='left'?col2.idx:col2.idx+1;
      var newCol={id:uid(),type:'col',width:1,children:[block]};
      col2.arr.splice(insAt,0,newCol);
      equalizeWidths(col2.arr);
      return {kind:'side',arrA:rowChildrenArr,beforeA:beforeA,afterA:snapshotArr(col2.arr),
              arrB:sameArr?null:fromArr,beforeB:beforeB,afterB:sameArr?null:snapshotArr(fromArr)};
    }

    var targetArr=t0.arr, sameArr2=(fromArr===targetArr);
    var beforeA2=snapshotArr(fromArr), beforeB2=sameArr2?null:snapshotArr(targetArr);
    fromArr.splice(fromIdx,1);
    var t1=locate(targetId); if(!t1){ restoreArr(fromArr,beforeA2); return null; }
    t1.arr.splice(t1.idx,1);
    var colA={id:uid(),type:'col',width:1,children:[t1.block]};
    var colB={id:uid(),type:'col',width:1,children:[block]};
    var newRow={id:uid(),type:'row',children:side==='left'?[colB,colA]:[colA,colB]};
    t1.arr.splice(t1.idx,0,newRow);
    return {kind:'side',arrA:fromArr,beforeA:beforeA2,afterA:snapshotArr(fromArr),
            arrB:sameArr2?null:t1.arr,beforeB:beforeB2,afterB:sameArr2?null:snapshotArr(t1.arr)};
  }
  function undoMove(res){
    if(res.kind==='side'){ restoreArr(res.arrA,res.beforeA); if(res.arrB)restoreArr(res.arrB,res.beforeB); return; }
    var i=res.toArr.indexOf(res.block); if(i>-1) res.toArr.splice(i,1);
    res.fromArr.splice(Math.min(res.fromIdx,res.fromArr.length),0,res.block);
  }
  function redoMove(res){
    if(res.kind==='side'){ restoreArr(res.arrA,res.afterA); if(res.arrB)restoreArr(res.arrB,res.afterB); return; }
    var i=res.fromArr.indexOf(res.block); if(i>-1) res.fromArr.splice(i,1);
    res.toArr.splice(Math.min(res.toIdx,res.toArr.length),0,res.block);
  }

  // ── undo/redo: стек операцій, не знімки сторінки, 50 кроків (SPECblocksv2 §2.3) ──
  var undoStack=[],redoStack=[],UNDO_MAX=50,turnSnap=null;
  function pushOp(undoFn,redoFn){
    undoStack.push({undo:undoFn,redo:redoFn});
    if(undoStack.length>UNDO_MAX)undoStack.shift();
    redoStack.length=0; syncUndoBtn();
  }
  function doUndo(){ var op=undoStack.pop(); if(!op)return; op.undo(); redoStack.push(op); save(); render(); syncUndoBtn(); }
  function doRedo(){ var op=redoStack.pop(); if(!op)return; op.redo(); undoStack.push(op); save(); render(); syncUndoBtn(); }
  function syncUndoBtn(){ var b=document.getElementById('pgUndoBtn'); if(b) b.disabled=!undoStack.length; }
  document.addEventListener('keydown',function(e){
    if(!scr||!scr.classList.contains('active'))return;
    if(e.code!=='KeyZ'||!(e.ctrlKey||e.metaKey))return;
    var ae=document.activeElement;
    if(ae&&(ae.isContentEditable||ae.tagName==='INPUT'||ae.tagName==='TEXTAREA'))return; // нативний undo тексту має пріоритет
    e.preventDefault();
    if(e.shiftKey) doRedo(); else doUndo();
  });

  var STATUS_COLORS={'Нова':'#5b8def','В роботі':'#e8843c','Готово':'#34c77b','Оплачено':'#34c77b','Пауза':'#ff6b9d','Скасовано':'#8b93a3'};
  var STATUS_ORDER=['Нова','В роботі','Готово','Оплачено','Пауза','Скасовано'];
  function dbColType(c){ return c.type || (c.k==='status'?'status':(c.k==='name'?'text':'text')); }
  function dbFmtNum(v){ var n=parseFloat(String(v).replace(/\s/g,'').replace(',','.')); if(isNaN(n))return v||''; return n.toLocaleString('uk-UA'); }

  function inner(b){
    var t=b.type,id=b.id;
    /* нотатка = суцільний абзац на аркуші, без рамок */
    if(t==='note'||t==='quick')return '<div class="pg-content pg-empty" contenteditable="true" data-ph="Пишіть…" data-edit="'+id+'">'+esc(txtOf(b))+'</div>';
    if(t==='h1'){var hs1=headingStyle(b);return '<div class="pg-content pgc-h1'+hs1.cls+' pg-empty" style="'+hs1.style+'" contenteditable="true" data-ph="Заголовок 1" data-edit="'+id+'">'+esc(b.text||b.title||'')+'</div>';}
    if(t==='h2'){var hs2=headingStyle(b);return '<div class="pg-content pgc-h2'+hs2.cls+' pg-empty" style="'+hs2.style+'" contenteditable="true" data-ph="Заголовок 2" data-edit="'+id+'">'+esc(b.text||b.title||'')+'</div>';}
    if(t==='h3'){var hs3=headingStyle(b);return '<div class="pg-content pgc-h3'+hs3.cls+' pg-empty" style="'+hs3.style+'" contenteditable="true" data-ph="Заголовок 3" data-edit="'+id+'">'+esc(b.text||b.title||'')+'</div>';}
    if(t==='quote')return '<div class="pg-content pgc-quote pg-empty" contenteditable="true" data-ph="Цитата…" data-edit="'+id+'">'+esc(txtOf(b))+'</div>';
    if(t==='glass')return '<div class="pg-content"><div class="pgc-glass"><div class="pg-empty" contenteditable="true" data-ph="Напиши щось — зʼявиться на склі…" data-edit="'+id+'">'+esc(txtOf(b))+'</div></div></div>';
    if(t==='callout')return '<div class="pg-content pgc-callout"><span class="clx">'+(b.emo||'💡')+'</span><div class="cltx pg-empty" contenteditable="true" data-ph="Виноска…" data-edit="'+id+'">'+esc(txtOf(b))+'</div></div>';
    if(t==='divider'||t==='head')return '<div class="pg-content pg-div"><hr></div>';
    if(t==='code'){
      var lang=b.lang||'';
      return '<div class="pg-content pgc-code"><div class="pgcode-h"><span class="pgcode-lang" contenteditable="true" data-pgcodelang="'+id+'" data-ph="мова">'+esc(lang)+'</span>'
        +'<button class="pgcode-copy" data-pgcodecopy="'+id+'">копіювати</button></div>'
        +'<pre class="pgcode-pre pg-empty" contenteditable="true" data-ph="код…" data-edit="'+id+'" spellcheck="false">'+esc(txtOf(b))+'</pre></div>';
    }
    if(t==='section')return '<div class="pg-content pgc-section"><span class="pgsec-line"></span>'
      +'<span class="pgsec-t pg-empty" contenteditable="true" data-ph="Назва секції" data-edit="'+id+'">'+esc(txtOf(b))+'</span>'
      +'<span class="pgsec-line"></span></div>';
    if(t==='file'){
      if(b.data)return '<div class="pg-content"><div class="pgfile" data-pgfileopen="'+id+'"><span class="pgf-ic">'+pgFileIc(b.fname||'')+'</span>'
        +'<div class="pgf-b"><div class="pgf-n">'+esc(b.fname||'Файл')+'</div><div class="pgf-s">'+(b.fsize||'')+' · тап відкрити</div></div>'
        +'<button class="pgf-x" data-pgfiledel="'+id+'">✕</button></div></div>';
      return '<div class="pg-content"><button class="pgfile-empty" data-pgfilepick="'+id+'"><span class="pgf-ic">📎</span><span>Прикріпити файл</span></button></div>';
    }
    if(t==='pbar'){
      var pv,tks;
      if(b.auto){
        var pgLoc=locate(id); var sibs=(pgLoc&&pgLoc.arr)||[];
        tks=sibs.filter(function(x){return x.type==='task';});
        pv=pbarAutoValue(b);
      } else { pv=Math.max(0,Math.min(100,parseInt(b.value)||0)); }
      return '<div class="pg-content"><div class="pgbar" data-pgbarwrap="'+id+'">'
        +'<div class="pgbar-top"><span class="pgbar-t pg-empty" contenteditable="true" data-ph="Мета…" data-edit="'+id+'">'+esc(b.title||'')+'</span>'
        +'<button class="pgbar-auto'+(b.auto?' on':'')+'" data-pgbarauto="'+id+'" title="Авто: % виконаних задач поруч">'+(b.auto?'⚡ авто':'ручний')+'</button>'
        +'<span class="pgbar-pct">'+pv+'%</span></div>'
        +'<div class="pgbar-track"><i style="width:'+pv+'%"></i></div>'
        +(b.auto?(tks&&tks.length?'':'<div style="font-size:12px;color:var(--pg-mut);padding:2px 0">немає задач поруч — додай Завдання в цей самий блок</div>')
          :'<div class="pgbar-chips">'+[0,25,50,75,100].map(function(p){return '<button class="pgbar-chip'+(pv===p?' on':'')+'" data-pgbarset="'+id+'|'+p+'">'+p+'</button>';}).join('')+'</div>')
        +'</div></div>';
    }
    /* ═══ PREMIUM PACK V1 · нативні рендери сторінки ═══ */
    if(t==='weekreview'){
      return '<div class="pg-content"><div class="pgpr">'
        +'<div class="pghm-top"><span class="pgpr-badge">✦</span>'
        +'<span class="pghm-t pg-empty" contenteditable="true" data-ph="Огляд тижня…" data-edit="'+id+'">'+esc(b.title||'')+'</span>'
        +'<button class="pgpr-copy" data-pgwrgen="'+id+'"'+(b.loading?' disabled':'')+'>'+(b.loading?'…':(b.summary?'↻ оновити':'✦ згенерувати'))+'</button></div>'
        +(b.summary?'<div style="margin-top:7px;font-size:13px;line-height:1.55;color:var(--pg-fg2,var(--pg-fg))">'+esc(b.summary).replace(/\n/g,'<br>')+'</div>'+(b.updatedAt?'<div style="font-size:11px;color:var(--pg-mut);margin-top:6px">оновлено '+esc(b.updatedAt)+'</div>':'')
          :'<div style="font-size:12px;color:var(--pg-mut);padding:4px 0">AI підсумує цю сторінку — що зроблено, що в процесі, куди фокус далі</div>')
        +'</div></div>';
    }
    if(t==='prompt'){
      var prTxt=b.ptext||'';
      var prLen=prTxt.length;
      return '<div class="pg-content"><div class="pgpr">'
        +'<div class="pghm-top">'
        +'<span class="pgpr-badge">⌘</span>'
        +'<span class="pghm-t pg-empty" contenteditable="true" data-ph="Назва промта…" data-edit="'+id+'">'+esc(b.title||'')+'</span>'
        +'<span class="pgpr-len">'+(prLen? prLen+' зн.':'')+'</span>'
        +'<button class="pgpr-copy" data-pgprcopy="'+id+'">копіювати</button></div>'
        +'<div class="pgpr-tx pg-empty" contenteditable="true" data-ph="Текст промта… Змінні бери у {дужки}." data-pgprtxt="'+id+'">'+esc(prTxt)+'</div>'
        +'</div></div>';
    }
    if(t==='heatmap'){
      var hmMarks=b.marks||{};
      var hmToday=(function(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})();
      var hmEnd=new Date(); var hmDow=(hmEnd.getDay()+6)%7;
      var hmStart=new Date(hmEnd); hmStart.setDate(hmEnd.getDate()-(11*7+hmDow));
      var hmCells='', hmStreakArr=[];
      for(var hd=new Date(hmStart); hd<=hmEnd; hd.setDate(hd.getDate()+1)){
        var ds=hd.getFullYear()+'-'+String(hd.getMonth()+1).padStart(2,'0')+'-'+String(hd.getDate()).padStart(2,'0');
        hmStreakArr.push(ds);
        hmCells+='<i class="pghm-c lv'+(hmMarks[ds]||0)+(ds===hmToday?' td':'')+'" data-pghm="'+id+'|'+ds+'"></i>';
      }
      var hmTotal=0; for(var hk in hmMarks){ if(hmMarks[hk]>0) hmTotal++; }
      var hmStreak=0; for(var hi=hmStreakArr.length-1;hi>=0;hi--){ if(hmMarks[hmStreakArr[hi]]>0) hmStreak++; else break; }
      return '<div class="pg-content"><div class="pghm">'
        +'<div class="pghm-top"><span class="pghm-t pg-empty" contenteditable="true" data-ph="Звичка…" data-edit="'+id+'">'+esc(b.title||'')+'</span>'
        +'<span class="pghm-st">🔥 '+hmStreak+' · '+hmTotal+'/84</span></div>'
        +'<div class="pghm-grid">'+hmCells+'</div></div></div>';
    }
    if(t==='kpi'){
      var kpPts=(b.points||[]).slice(-30);
      var kpIn;
      if(!kpPts.length){
        kpIn='<button class="pgpp-empty" data-pgkpiadd="'+id+'">＋ Перше значення</button>';
      } else {
        var kpCur=kpPts[kpPts.length-1].v, kpPrev=kpPts.length>1?kpPts[kpPts.length-2].v:kpCur;
        var kpD=kpPrev? Math.round((kpCur-kpPrev)/Math.abs(kpPrev)*1000)/10 : 0;
        var kpUp=kpD>=0;
        var kpMin=Infinity,kpMax=-Infinity; kpPts.forEach(function(p){if(p.v<kpMin)kpMin=p.v;if(p.v>kpMax)kpMax=p.v;});
        var kpR=(kpMax-kpMin)||1, kpPoly='';
        kpPts.forEach(function(p,i){ kpPoly+=(i? ' ':'')+((i/Math.max(kpPts.length-1,1))*90)+','+(30-3-((p.v-kpMin)/kpR)*24); });
        kpIn='<div class="pgkpi-row">'
          +'<div class="pgkpi-l"><b class="pgkpi-v">'+esc(String(kpCur))+'</b><span class="pgkpi-u">'+esc(b.unit||'')+'</span>'
          +'<span class="pgkpi-d '+(kpUp?'up':'dn')+'">'+(kpUp?'▲':'▼')+' '+Math.abs(kpD)+'%</span></div>'
          +'<svg class="pgkpi-s" viewBox="0 0 90 30"><polyline points="'+kpPoly+'"/></svg>'
          +'<button class="pgkpi-add" data-pgkpiadd="'+id+'">＋</button></div>';
      }
      return '<div class="pg-content"><div class="pgkpi">'
        +'<span class="pghm-t pg-empty" contenteditable="true" data-ph="KPI…" data-edit="'+id+'">'+esc(b.title||'')+'</span>'
        +kpIn+'</div></div>';
    }
    if(t==='chart'){
      var chPts=(b.points||[]).slice(-30), chView=b.view||'bar', chIn;
      if(!chPts.length){
        chIn='<button class="pgpp-empty" data-pgchadd="'+id+'">＋ Перша точка</button>';
      } else {
        var chMax=1; chPts.forEach(function(p){ if(p.v>chMax) chMax=p.v; });
        if(chView==='bar'){
          chIn='<div class="pgch-bars">'+chPts.map(function(p){
            return '<span class="pgch-b"><i style="height:'+Math.max(5,p.v/chMax*100)+'%"></i><em>'+esc(p.l||'')+'</em></span>';
          }).join('')+'</div>';
        } else {
          var chPoly=''; chPts.forEach(function(p,i){ chPoly+=(i?' ':'')+((i/Math.max(chPts.length-1,1))*280)+','+(64-5-(p.v/chMax)*54); });
          chIn='<svg class="pgch-line" viewBox="0 0 280 64" preserveAspectRatio="none"><polyline points="'+chPoly+'"/></svg>';
        }
      }
      return '<div class="pg-content"><div class="pgch">'
        +'<div class="pghm-top"><span class="pghm-t pg-empty" contenteditable="true" data-ph="Графік…" data-edit="'+id+'">'+esc(b.title||'')+'</span>'
        +'<span class="pgch-ctrl"><button class="pgch-v'+(chView==='bar'?' on':'')+'" data-pgchview="'+id+'|bar">▮▮</button>'
        +'<button class="pgch-v'+(chView==='line'?' on':'')+'" data-pgchview="'+id+'|line">〜</button>'
        +'<button class="pgch-v" data-pgchadd="'+id+'">＋</button></span></div>'
        +chIn+'</div></div>';
    }
    if(t==='tabs'){
      if(!Array.isArray(b.tabs)||!b.tabs.length) b.tabs=[{name:'Нотатки',text:''}];
      var tbI=Math.min(parseInt(b.ti)||0, b.tabs.length-1);
      var tbHeads=b.tabs.map(function(tt,i){
        return '<button class="pgtb-h'+(i===tbI?' on':'')+'" data-pgtab="'+id+'|'+i+'">'+esc(tt.name||('Таб '+(i+1)))+'</button>';
      }).join('');
      return '<div class="pg-content"><div class="pgtb">'
        +'<div class="pgtb-heads">'+tbHeads+'<button class="pgtb-h pgtb-add" data-pgtabadd="'+id+'">＋</button></div>'
        +'<div class="pgtb-body pg-empty" contenteditable="true" data-ph="Текст вкладки…" data-pgtabtxt="'+id+'|'+tbI+'">'+esc((b.tabs[tbI]&&b.tabs[tbI].text)||'')+'</div>'
        +'<div class="pgpp-hint">тап по активному табу — перейменувати</div></div></div>';
    }
    if(t==='accord'){
      if(!Array.isArray(b.secs)||!b.secs.length) b.secs=[{name:'Секція',text:'',open:1}];
      var acRows=b.secs.map(function(s,i){
        return '<div class="pgac'+(s.open?' open':'')+'">'
          +'<button class="pgac-h" data-pgacc="'+id+'|'+i+'"><span class="pgac-a">›</span>'+esc(s.name||('Секція '+(i+1)))+'</button>'
          +(s.open? '<div class="pgac-tx pg-empty" contenteditable="true" data-ph="Текст…" data-pgacctxt="'+id+'|'+i+'">'+esc(s.text||'')+'</div>' : '')
          +'</div>';
      }).join('');
      return '<div class="pg-content"><div class="pgacw">'+acRows
        +'<button class="pgpp-ghost" data-pgaccadd="'+id+'">＋ секція</button></div></div>';
    }
    if(t==='embed'){
      var emM=(b.url||'').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
      var emVid=emM?emM[1]:null, emIn;
      if(!emVid){
        emIn='<button class="pgpp-empty" data-pgemset="'+id+'">＋ Посилання YouTube</button>';
      } else if(b.play){
        emIn='<div class="pgem"><iframe src="https://www.youtube.com/embed/'+emVid+'?autoplay=1&playsinline=1" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>';
      } else {
        emIn='<button class="pgem pgem-th" data-pgemplay="'+id+'" style="background-image:url(\'https://i.ytimg.com/vi/'+emVid+'/hqdefault.jpg\')"><span class="pgem-p">▶</span></button>';
      }
      return '<div class="pg-content">'+emIn+'</div>';
    }
    if(t==='audio'){
      if(!(b.url||'').trim()){
        return '<div class="pg-content"><button class="pgpp-empty" data-pgauset="'+id+'">＋ Посилання на аудіо</button></div>';
      }
      return '<div class="pg-content"><div class="pgau">'
        +'<button class="pgau-b" data-pgauplay="'+id+'">▶</button>'
        +'<div class="pgau-m"><b class="pgau-n">'+esc(b.name||'Аудіо')+'</b>'
        +'<div class="pgau-bar" data-pgauseek="'+id+'"><i></i></div></div>'
        +'<span class="pgau-t">0:00</span>'
        +'<audio preload="none" data-pgauel="'+id+'" src="'+esc(b.url)+'"></audio></div></div>';
    }
    if(t==='wfocus'){
      var fcNow=Date.now();
      var fcYmd=(function(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})();
      if(b.doneD!==fcYmd){ b.done=0; b.doneD=fcYmd; }
      var fcRun=b.end&&b.end>fcNow;
      var fcTot=(b.mode==='rest'?5:25)*60000;
      var fcLeft=fcRun? b.end-fcNow : fcTot;
      var fcMm=Math.floor(fcLeft/60000), fcSs=Math.floor(fcLeft%60000/1000);
      var fcC=2*Math.PI*26;
      return '<div class="pg-content"><div class="pgfc'+(fcRun?' run':'')+'" data-pgfcid="'+id+'">'
        +'<button class="pgfc-r" data-pgfctap="'+id+'">'
        +'<svg viewBox="0 0 60 60"><circle class="bgc" cx="30" cy="30" r="26"/>'
        +'<circle class="fgc" cx="30" cy="30" r="26" stroke-dasharray="'+fcC+'" stroke-dashoffset="'+(fcC*(1-(fcRun?fcLeft/fcTot:1)))+'"/></svg>'
        +'<b class="pgfc-t">'+fcMm+':'+String(fcSs).padStart(2,'0')+'</b></button>'
        +'<div class="pgfc-i"><span class="pgfc-m">'+(b.mode==='rest'?'☕ Перерва':'🍅 Фокус')+'</span>'
        +'<span class="pgfc-c">'+(new Array(Math.min(b.done||0,8)+1).join('●')||'—')+' сьогодні</span>'
        +'<span class="pgfc-h">'+(fcRun?'тап — стоп':'тап — старт '+(b.mode==='rest'?'5':'25')+' хв')+'</span></div></div></div>';
    }
    if(t==='task')return '<div class="pg-content"><div class="pg-todo '+(b.done?'done':'')+'"><div class="box" data-pgtodo="'+id+'">'+(b.done?'✓':'')+'</div><div class="tx pg-empty" contenteditable="true" data-ph="Завдання…" data-edit="'+id+'">'+esc(txtOf(b))+'</div></div></div>';
    if(t==='bullet')return '<div class="pg-content"><div class="pg-bul"><span class="dot"></span><div class="tx pg-empty" contenteditable="true" data-ph="Пункт…" data-edit="'+id+'">'+esc(txtOf(b))+'</div></div></div>';
    if(t==='num')return '<div class="pg-content"><div class="pg-num"><span class="n" data-pgnum>1.</span><div class="tx pg-empty" contenteditable="true" data-ph="Пункт…" data-edit="'+id+'">'+esc(txtOf(b))+'</div></div></div>';
    if(t==='toggle')return '<div class="pg-content pg-tg '+(b.open?'open':'')+'"><div class="tgh"><span class="tga" data-pgtoggle="'+id+'">▸</span><div class="tgt pg-empty" contenteditable="true" data-ph="Тогл…" data-edit="'+id+'">'+esc(txtOf(b))+'</div></div><div class="tgb"><div data-pgchild="'+id+'"></div></div></div>';
    if(t==='win'){
      var _wh=b.h||140;
      return '<div class="pg-content pgwin'+(b.open===false?' closed':'')+'" style="--wh:'+_wh+'px">'
        +'<div class="pgwin-b"><span class="pgwin-d" data-pgtoggle="'+id+'"></span>'
        +'<div class="pgwin-t pg-empty" contenteditable="true" data-ph="Назва вікна…" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
        +'<button class="pgwin-h" data-pgwinh="'+id+'">'+_wh+'</button></div>'
        +'<div class="pgwin-s"><div data-pgchild="'+id+'"></div></div>'
        +'<button class="pgwin-a" data-pgwinadd="'+id+'">＋ Блок у вікно</button></div>';
    }
    /* ── Картка: об'єднує Вікно/Скло/Виноска/Цитата під одним типом (SPECblocksv2 §3.1) ── */
    if(t==='card'){
      if(b.bg==='glass'){
        return '<div class="pg-content"><div class="pgc-glass"><div class="pg-empty" contenteditable="true" data-ph="Напиши щось — зʼявиться на склі…" data-edit="'+id+'">'+esc(b.text||'')+'</div></div></div>';
      }
      if(b.bg==='color'){
        if(b.accent) return '<div class="pg-content pgc-quote pg-empty" contenteditable="true" data-ph="Картка…" data-edit="'+id+'">'+esc(b.text||'')+'</div>';
        return '<div class="pg-content pgc-callout"><span class="clx">'+(b.icon||'💡')+'</span><div class="cltx pg-empty" contenteditable="true" data-ph="Картка…" data-edit="'+id+'">'+esc(b.text||'')+'</div></div>';
      }
      var _cwh=b.h||140;
      var _cbg=(b.bg==='photo'&&b.data)?(' background-image:url(\''+b.data+'\');background-size:cover;background-position:center;'):'';
      return '<div class="pg-content pgwin'+(b.open===false?' closed':'')+'" style="--wh:'+_cwh+'px;'+_cbg+'">'
        +'<div class="pgwin-b"><span class="pgwin-d" data-pgtoggle="'+id+'"></span>'
        +'<div class="pgwin-t pg-empty" contenteditable="true" data-ph="Назва картки…" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
        +(b.bg==='photo'?'<button class="pgwin-h" data-pgcardphoto="'+id+'" title="Фото">🖼</button>':'<button class="pgwin-h" data-pgwinh="'+id+'">'+_cwh+'</button>')
        +'</div><div class="pgwin-s"><div data-pgchild="'+id+'"></div></div>'
        +'<button class="pgwin-a" data-pgwinadd="'+id+'">＋ Блок у картку</button></div>';
    }
    /* ── Вкладення: об'єднує Файл/Відео/Аудіо/Посилання, підтип визначається за вставленим URL (SPECblocksv2 §3.1) ── */
    if(t==='attach'){
      var sub=b.sub||'link';
      if(sub==='file'){
        if(b.data)return '<div class="pg-content"><div class="pgfile" data-pgfileopen="'+id+'"><span class="pgf-ic">'+pgFileIc(b.fname||'')+'</span>'
          +'<div class="pgf-b"><div class="pgf-n">'+esc(b.fname||'Файл')+'</div><div class="pgf-s">'+(b.fsize||'')+' · тап відкрити</div></div>'
          +'<button class="pgf-x" data-pgfiledel="'+id+'">✕</button></div></div>';
        return '<div class="pg-content"><button class="pgfile-empty" data-pgfilepick="'+id+'"><span class="pgf-ic">📎</span><span>Прикріпити файл</span></button></div>';
      }
      if(sub==='video'){
        var emM=(b.url||'').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
        var emVid=emM?emM[1]:null, emIn;
        if(!emVid) emIn='<button class="pgpp-empty" data-pgemset="'+id+'">＋ Посилання YouTube</button>';
        else if(b.play) emIn='<div class="pgem"><iframe src="https://www.youtube.com/embed/'+emVid+'?autoplay=1&playsinline=1" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>';
        else emIn='<button class="pgem pgem-th" data-pgemplay="'+id+'" style="background-image:url(\'https://i.ytimg.com/vi/'+emVid+'/hqdefault.jpg\')"><span class="pgem-p">▶</span></button>';
        return '<div class="pg-content">'+emIn+'</div>';
      }
      if(sub==='audio'){
        if(!(b.url||'').trim()) return '<div class="pg-content"><button class="pgpp-empty" data-pgauset="'+id+'">＋ Посилання на аудіо</button></div>';
        return '<div class="pg-content"><div class="pgau"><button class="pgau-b" data-pgauplay="'+id+'">▶</button>'
          +'<div class="pgau-m"><b class="pgau-n">'+esc(b.name||'Аудіо')+'</b><div class="pgau-bar" data-pgauseek="'+id+'"><i></i></div></div>'
          +'<span class="pgau-t">0:00</span><audio preload="none" data-pgauel="'+id+'" src="'+esc(b.url)+'"></audio></div></div>';
      }
      var _au=b.url||'';
      return '<div class="pg-content"><div class="pglk"><span class="pglk-ic">'+pgsIc('link')+'</span>'
        +'<div class="pglk-b"><div class="pglk-t pg-empty" contenteditable="true" data-ph="Назва…" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
        +'<input class="pglk-u" type="url" inputmode="url" placeholder="Встав посилання (YouTube / mp3 / будь-що)…" value="'+esc(_au)+'" data-pglink="'+id+'"></div>'
        +'<button class="pgf-x" data-pgattfile="'+id+'" title="Або прикріпити файл">📎</button>'
        +(_au?'<a class="pglk-go" href="'+esc(_au)+'" target="_blank" rel="noopener">↗</a>':'')
        +'</div></div>';
    }
    if(t==='db'||t==='table')return dbHTML(b);
    // будь-який інший тип Flow показуємо як текст-плейсхолдер із назвою
    var BT=bridge().blockTypes()||{};
    var lbl=(BT[t]&&BT[t].title)||t;
    if(t==='page'||t==='group'){
      var kidsN=(b.children||[]).length;
      return '<div class="pg-content"><div class="pgrow" data-pgenter="'+id+'" style="--sc:'+(t==='page'?'#7c8cff':'#f0b429')+'">'
        +'<span class="pgrow-ic">'+pgsIc(t==='page'?'pagefile':'folder')+'</span>'
        +'<div class="pgrow-t pg-empty" contenteditable="true" data-ph="'+(t==='page'?'Нова сторінка…':'Нова папка…')+'" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
        +(kidsN?'<span class="pgrow-n">'+kidsN+'</span>':'')
        +'<span class="pgrow-go">›</span></div></div>';
    }
    if(t==='countdown')return cdHTML(b);
    if(t==='journal')return jrHTML(b);
    if(t==='decision')return dlHTML(b);
    if(t==='ptracker')return ptHTML(b);
    if(t==='phub')return phHTML(b);
    if(t==='habits')return hbHTML(b);
    if(t==='photo'){
      var _pp=b.pos;
      var _pxf=_pp?('transform:translate('+_pp.x+'%,'+_pp.y+'%) scale('+_pp.scale+');'):'';
      var _hStyle=b.h?('height:'+b.h+'px;max-height:none;'):'';
      if(b.data)return '<div class="pg-content"><div class="pgph"><img src="'+b.data+'" alt="" style="'+_pxf+_hStyle+'">'
        +'<button class="pgph-menu" data-pgphotomenu="'+id+'">⋮</button>'
        +'<div class="pgph-rz" data-pgphotorz="'+id+'" title="Потягни, щоб змінити розмір"></div>'
        +'</div></div>';
      return '<div class="pg-content"><button class="pgph-empty" data-pgphoto="'+id+'">'+pgsIc('photo')+'<span>Тапни, щоб обрати фото</span></button></div>';
    }
    if(t==='link'){
      var u=b.url||'';
      return '<div class="pg-content"><div class="pglk">'
        +'<span class="pglk-ic">'+pgsIc('link')+'</span>'
        +'<div class="pglk-b"><div class="pglk-t pg-empty" contenteditable="true" data-ph="Назва посилання…" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
        +'<input class="pglk-u" type="url" inputmode="url" placeholder="https://…" value="'+esc(u)+'" data-pglink="'+id+'"></div>'
        +(u?'<a class="pglk-go" href="'+esc(u)+'" target="_blank" rel="noopener">↗</a>':'')
        +'</div></div>';
    }
    /* вже вставлені віджети/проєктні блоки показуємо чипом (у меню їх поки нема) */
    /* віджети та проєктні блоки — ЖИВІ тайли дошки прямо на сторінці */
    var PG_TILE_TYPES={progress:1,fin:1,envelope:1,calendar:1,wpult:1,wstack:1,wpipe:1,wtline:1,wportal:1,wplanday:1,wplanmonth:1,project:1,kanban:1,contacts:1,caseline:1,festival:1};
    if(PG_TILE_TYPES[t]) return '<div class="pg-content pgwidget" data-pgwhost="'+id+'"></div>';
    /* невідомі типи — інформативний чип */
    var PGS_WCHIP={
      progress:{t:'Прогрес',d:'Шкала виконання',c:'#34c77b',ic:'progress'},
      fin:{t:'Фінанси',d:'Зведення з модуля',c:'#f0b429',ic:'fin'},
      envelope:{t:'Конверт',d:'Накопичення на ціль',c:'#c77dff',ic:'envelope'},
      calendar:{t:'Календар',d:'Місяць з відмітками',c:'#5b8def',ic:'calendar'},
      wpult:{t:'Пульт проєктів',d:'Наступний крок кожного проєкту',c:'#7c8cff',ic:'pult'},
      wstack:{t:'Фокус-стек',d:'Обліт проєктів по одному',c:'#ff6b9d',ic:'stack'},
      wpipe:{t:'Пайплайн',d:'Проєкти за статусами',c:'#4ecdc4',ic:'pipe'},
      wtline:{t:'Таймлайн',d:'Дедлайни на стрічці тижнів',c:'#e8843c',ic:'tline'},
      wplanday:{t:'План на день',d:'Точки проєкту сьогодні',c:'#6a7dff',ic:'calendar'},
      wplanmonth:{t:'План на місяць',d:'Календар точок проєкту',c:'#8b5cf6',ic:'calendar'},
      project:{t:'Проєкт',d:'Дохід − витрати = прибуток',c:'#34c77b',ic:'project'},
      kanban:{t:'Канбан',d:'Заявки → в роботі → готово',c:'#5b8def',ic:'kanban'},
      contacts:{t:'Контакти',d:'Партнери, клієнти, сервіси',c:'#4ecdc4',ic:'contacts'},
      caseline:{t:'Таймлайн справи',d:'Хронологія подій з датами',c:'#e8843c',ic:'caseline'},
      festival:{t:'Фестиваль · Подія',d:'Відлік, програма, бюджет',c:'#c77dff',ic:'fest'},
      wportal:{t:'Портал',d:'Стрибок у будь-яку папку',c:'#c77dff',ic:'portal'}
    };
    var ci=PGS_WCHIP[t]||null;
    if(ci){
      return '<div class="pg-content"><div class="pgst-wchip" style="--sc:'+ci.c+'">'+
        '<span class="wcic">'+pgsIc(ci.ic)+'</span>'+
        '<div class="wcb"><div class="wct" contenteditable="true" data-edit="'+id+'">'+esc(txtOf(b)||lbl)+'</div>'+
        '<div class="wcd">'+ci.d+'</div></div></div></div>';
    }
    return '<div class="pg-content pgc-callout"><span class="clx">'+((BT[t]&&BT[t].emoji)||'🧩')+'</span><div class="cltx" contenteditable="true" data-edit="'+id+'">'+esc(txtOf(b)||lbl)+'</div></div>';
  }

  function dbEnsure(b){
    if(b.type==='table'){
      // конвертувати стару таблицю Flow у нову модель БД
      if(!b.cols||!b.cols[0]||typeof b.cols[0]==='string'){
        var oldCols=Array.isArray(b.cols)?b.cols:['Назва','Значення'];
        var newCols=oldCols.map(function(c,i){return {k:'c'+i,t:c};});
        var newRows=(b.rows||[]).map(function(r){var o={};newCols.forEach(function(c,i){o[c.k]=(r&&r[i])||'';});return o;});
        b.cols=newCols;b.rows=newRows;
      }
      b.view=b.view||'table';
    } else {
      b.cols=b.cols||[{k:'name',t:'Назва'},{k:'status',t:'Статус'},{k:'note',t:'Нотатка'}];
      b.rows=b.rows||[{name:'Запис 1',status:'Нова',note:''}];
      b.view=b.view||'table';
    }
    return b;
  }
  function dbHTML(b){
    dbEnsure(b);
    var name=b.dbName||b.title||'База';
    var tabs=['table','board'].map(function(v){return '<div class="pg-db-tab '+(b.view===v?'on':'')+'" data-pgdbview="'+b.id+'|'+v+'">'+(v==='table'?'⊞ Таблиця':'▦ Дошка')+'</div>';}).join('');
    var body;
    if(b.view==='board'){
      var groups={};(b.rows||[]).forEach(function(r){var s=r.status||'—';(groups[s]=groups[s]||[]).push(r);});
      var cols=Object.keys(STATUS_COLORS).concat(Object.keys(groups).filter(function(k){return !STATUS_COLORS[k];}));
      body='<div class="pg-db-board">'+cols.map(function(st){
        var rs=groups[st]||[];var col=STATUS_COLORS[st]||'#8b93a3';
        return '<div class="pg-db-col"><div class="pg-db-colh"><span class="pg-pill" style="color:'+col+';background:color-mix(in srgb,'+col+' 15%,transparent)">'+esc(st)+'</span><span class="cnt">'+rs.length+'</span></div>'+
          rs.map(function(r){return '<div class="pg-db-mini">'+esc(r.name||'')+'<div class="ms">'+esc(r.note||'')+'</div></div>';}).join('')+'</div>';
      }).join('')+'</div>';
    }else{
      var cols=b.cols||[];
      // заголовки колонок (редаговані) + кнопка типу
      var head='<div class="pg-db-row hr">'+cols.map(function(c,ci){
        var ty=dbColType(c), tIc=ty==='num'?'#':ty==='status'?'◔':'T';
        return '<div class="pg-db-cell hc '+(c.k==='name'?'cn':'')+(ty==='num'?' cnum':'')+'">'
          +'<span class="pg-db-hi" contenteditable="true" data-pgdbhcol="'+b.id+'|'+ci+'">'+esc(c.t)+'</span>'
          +'<button class="pg-db-ct" data-pgdbctype="'+b.id+'|'+ci+'" title="Тип колонки">'+tIc+'</button>'
          +(cols.length>1?'<button class="pg-db-cx" data-pgdbcdel="'+b.id+'|'+ci+'" title="Видалити колонку">✕</button>':'')
          +'</div>';
      }).join('')+'<div class="pg-db-cell hc addc"><button class="pg-db-addcol" data-pgdbaddcol="'+b.id+'">＋</button></div></div>';
      // рядки
      var rows=(b.rows||[]).map(function(r,ri){
        return '<div class="pg-db-row" data-pgdbrowwrap="'+b.id+'|'+ri+'">'+cols.map(function(c){
          var v=r[c.k]||'', ty=dbColType(c);
          if(ty==='status'){var col=STATUS_COLORS[v]||'#8b93a3';return '<div class="pg-db-cell"><span class="pg-pill" data-pgdbstatus="'+b.id+'|'+ri+'|'+c.k+'" style="color:'+col+';background:color-mix(in srgb,'+col+' 15%,transparent)">'+esc(v||'—')+'</span></div>';}
          if(ty==='num')return '<div class="pg-db-cell cnum" contenteditable="true" inputmode="decimal" data-pgdbcell="'+b.id+'|'+ri+'|'+c.k+'">'+esc(v)+'</div>';
          return '<div class="pg-db-cell '+(c.k==='name'?'cn':'')+'" contenteditable="true" data-pgdbcell="'+b.id+'|'+ri+'|'+c.k+'">'+esc(v)+'</div>';
        }).join('')+'<div class="pg-db-cell rx"><button class="pg-db-rdel" data-pgdbrdel="'+b.id+'|'+ri+'" title="Видалити рядок">✕</button></div></div>';
      }).join('');
      // підсумок числових колонок
      var hasNum=cols.some(function(c){return dbColType(c)==='num';});
      var totalRow='';
      if(hasNum&&(b.rows||[]).length){
        totalRow='<div class="pg-db-row tr">'+cols.map(function(c,ci){
          if(dbColType(c)==='num'){
            var sum=(b.rows||[]).reduce(function(s,r){var n=parseFloat(String(r[c.k]||'').replace(/\s/g,'').replace(',','.'));return s+(isNaN(n)?0:n);},0);
            return '<div class="pg-db-cell cnum tv">'+dbFmtNum(sum)+'</div>';
          }
          return '<div class="pg-db-cell '+(ci===0?'tl':'')+'">'+(ci===0?'Разом':'')+'</div>';
        }).join('')+'<div class="pg-db-cell rx"></div></div>';
      }
      body='<div class="pg-db-grid">'+head+rows+totalRow+'<div class="pg-db-add" data-pgdbadd="'+b.id+'">＋ Новий запис</div></div>';
    }
    return '<div class="pg-content"><div class="pg-db"><div class="pg-db-h"><span class="dbi">🗂️</span><input class="dbn" value="'+esc(name)+'" data-pgdbname="'+b.id+'"></div><div class="pg-db-tabs">'+tabs+'</div>'+body+'</div></div>';
  }

  var pgSgBusy=false;
  function pgSgPlace(){
    try{
      var sg=editor.querySelector('.pgsg'); if(!sg)return;
      var b=sg.querySelector('.pgsg-b.on'), ind=sg.querySelector('.pgsg-ind');
      if(!b||!ind)return;
      ind.style.left=b.offsetLeft+'px'; ind.style.width=b.offsetWidth+'px';
    }catch(_){}
  }
  var PGLAST='flowPgLastBlock';
  function pgLastGet(){ try{ return localStorage.getItem(PGLAST)||''; }catch(_){ return ''; } }
  function pgLastSet(k){ try{ localStorage.setItem(PGLAST,k); }catch(_){} }
  /* «Нещодавні» в палітрі — до 5 останніх, окремо від pgLastGet/Set вище (SPECblocksv2 §3.2) */
  var PGRECENT='flowPgRecentBlocks';
  function pgRecentGet(){ try{ var a=JSON.parse(localStorage.getItem(PGRECENT)||'[]'); return Array.isArray(a)?a:[]; }catch(_){ return []; } }
  function pgRecentAdd(k){ try{ var a=pgRecentGet().filter(function(x){return x!==k;}); a.unshift(k); localStorage.setItem(PGRECENT,JSON.stringify(a.slice(0,5))); }catch(_){} }
  function renderList(arr,host){
    arr.forEach(function(b){
      var met=condMet(b);
      if(!met&&!pgShowHidden) return; /* умова не виконана — блок реально не рендериться */
      if(b.type==='row'){ renderRowBlock(b,host); return; }
      if(b.type==='board'){ renderBoardBlock(b,host); return; }
      var row=document.createElement('div');row.className='pgb'+(b.pinned?' pinned':'')+(!met?' pg-condhidden':'');row.dataset.id=b.id;
      row.innerHTML='<button class="pg-addrow" data-pgaddafter="'+b.id+'" title="Додати блок нижче">＋</button>'
        +inner(b)
        +'<span class="pg-grip" data-pggrip="'+b.id+'">⠿</span>'
        +(!met?'<span class="pg-condtag" title="Показується лише коли виконана умова">◐ умова</span>':'');
      host.appendChild(row);
      if(b.children&&b.children.length){
        if(b.type==='toggle'||b.type==='win'||b.type==='card'){var slot=row.querySelector('[data-pgchild="'+b.id+'"]');if(slot)renderList(b.children,slot);}
        else{var w=document.createElement('div');w.className='pg-child';renderList(b.children,w);host.appendChild(w);}
      }
    });
  }
  /* ── дошка: сітка 12 колонок, авто-укладання нативним CSS Grid (SPECblocksv2 §4.3) ── */
  function renderBoardBlock(rb,host){
    var wrap=document.createElement('div'); wrap.className='pg-board'; wrap.dataset.id=rb.id;
    var items=Array.isArray(rb.children)?rb.children:[];
    items.forEach(function(it){
      if(!condMet(it)&&!pgShowHidden) return;
      var cell=document.createElement('div'); cell.className='pg-bitem'+(!condMet(it)?' pg-condhidden':'');
      cell.style.setProperty('--gw',it.gw||4); cell.style.setProperty('--gh',it.gh||2);
      renderList([it],cell);
      var rz=document.createElement('span'); rz.className='pg-brz'; rz.dataset.pgboardrz=it.id; rz.textContent='◢';
      cell.appendChild(rz);
      wrap.appendChild(cell);
    });
    host.appendChild(wrap);
    var foot=document.createElement('div'); foot.className='pg-bfoot';
    foot.innerHTML='<button class="pg-badd" data-pgboardadd="'+rb.id+'">＋ Віджет у дошку</button>'
      +'<button class="pg-rowdel" data-pgrowdel="'+rb.id+'" title="Видалити дошку">✕</button>';
    host.appendChild(foot);
  }
  /* ── ряд колонок: горизонтальний контейнер, кожна колонка — своя вертикальна renderList (SPECblocksv2 §4.1) ── */
  function renderRowBlock(rb,host){
    var wrap=document.createElement('div'); wrap.className='pg-row'; wrap.dataset.id=rb.id;
    var cols=Array.isArray(rb.children)?rb.children:[];
    cols.forEach(function(col,ci){
      var colEl=document.createElement('div'); colEl.className='pg-col'; colEl.dataset.id=col.id;
      colEl.style.setProperty('--cw',col.width||(1/cols.length));
      renderList(col.children||[],colEl);
      wrap.appendChild(colEl);
      if(ci<cols.length-1){
        var div=document.createElement('div'); div.className='pg-coldiv'; div.dataset.pgcoldiv=rb.id+'|'+ci;
        wrap.appendChild(div);
      }
    });
    var rm=document.createElement('button'); rm.className='pg-rowdel'; rm.dataset.pgrowdel=rb.id; rm.title='Видалити ряд'; rm.textContent='✕';
    wrap.appendChild(rm);
    host.appendChild(wrap);
  }
  function renumber(){var n=1;editor.querySelectorAll('[data-pgnum]').forEach(function(el){el.textContent=(n++)+'.';});}

  var pgPath=[];
  function pgResolve(){
    var arr=bridge().getBlocks(), cont=null;
    for(var i=0;i<pgPath.length;i++){
      var f=null;
      for(var j=0;j<arr.length;j++){ if(String(arr[j].id)===String(pgPath[i])){f=arr[j];break;} }
      if(!f||!Array.isArray(f.children)){ pgPath.length=i; break; }
      cont=f; arr=f.children;
    }
    return {arr:arr,cont:cont};
  }
  function pgHeaStrip(){
    /* чипи просторів (лише на корені) + хлібний рядок при вкладеності */
    var out=document.createDocumentFragment();
    try{
      var _mr=document.createElement('div'); _mr.className='pgmeta';
      var _mn=(pgResolve().arr||[]).length;
      var _md=new Date();
      var _mw=(_mn%10===1&&_mn%100!==11)?'блок':((_mn%10>=2&&_mn%10<=4&&(_mn%100<10||_mn%100>=20))?'блоки':'блоків');
      _mr.innerHTML='<span class="pgm-c acc">'+(pgPath.length?'Вкладена':'Сторінка')+'</span>'
        +'<span class="pgm-c">'+_mn+' '+_mw+'</span>'
        +'<span class="pgm-c">ред. '+String(_md.getDate()).padStart(2,'0')+'.'+String(_md.getMonth()+1).padStart(2,'0')+'</span>'
        +'<span class="pgm-c cov'+(pgHasCov()?' set':'')+'" data-pgcovopen>'+(pgHasCov()?'обкладинка':'＋ обкладинка')+'</span>';
      out.appendChild(_mr);
    }catch(_){}
    if(!pgPath.length&&bridge().spaces){
      var sps=bridge().spaces()||[];
      if(sps.length){
        var row=document.createElement('div'); row.className='pgsg';
        row.innerHTML='<span class="pgsg-ind"></span>'+sps.map(function(s){
          return '<button class="pgsg-b'+(s.on?' on':'')+'" data-pgspace="'+s.id+'">'
            +'<span class="e">'+(s.emoji||'🧩')+'</span><span class="t">'+esc(s.name)+'</span>'
            +(s.n?'<span class="bdg">'+s.n+'</span>':'')+'</button>';
        }).join('')+'<button class="pgsg-b plus" data-pgspadd>＋</button>';
        out.appendChild(row);
      }
    }
    if(pgPath.length){
      var r=pgResolve(), c=r.cont;
      var nav=document.createElement('div'); nav.className='pgnav';
      nav.innerHTML='<button class="pgnav-b" data-pgup>‹</button>'
        +'<span class="pgnav-e">'+((c&&c.emoji)||(c&&c.type==='page'?'📄':'📁'))+'</span>'
        +'<span class="pgnav-t">'+esc((c&&c.title)||(c&&c.type==='page'?'Сторінка':'Папка'))+'</span>';
      out.appendChild(nav);
    }
    return out;
  }
  function render(){
    if(!bridge())return;
    var res=pgResolve();
    var arr=res.arr;
    var active=document.activeElement,aid=active&&active.dataset&&active.dataset.edit;
    editor.innerHTML='';
    editor.appendChild(pgHeaStrip());
    try{ requestAnimationFrame(pgSgPlace); }catch(_){ try{ pgSgPlace(); }catch(__){} }
    // банер: якщо цю папку прив'язано до проєкт-трекера
    try{
      var br0=bridge(), ck=br0&&br0.curKey?br0.curKey():'';
      var fk=String(ck).split('__sp_')[0];
      var links = fk && br0 && br0.ptrackersFor ? br0.ptrackersFor(fk) : [];
      if(links&&links.length){
        var fp = br0.folderProgress?br0.folderProgress(fk):{done:0,total:0,pct:0};
        var bn=document.createElement('div'); bn.className='pt-banner';
        bn.innerHTML='<span class="ptb-ic">'+(links[0].emoji||'🎯')+'</span>'
          +'<div class="ptb-body"><div class="ptb-t">Зв\u2019язано з проєктом «'+esc(links[0].title||'')+'»</div>'
          +'<div class="ptb-s">кожне «виконано» тут = крок у проєкті</div></div>'
          +'<span class="ptb-pct">'+(fp.pct||0)+'%</span>';
        editor.appendChild(bn);
      }
    }catch(_){}
    if(!arr || !arr.length){
      // порожня сторінка — видима заглушка з викликом до дії
      var empty=document.createElement('div');
      empty.className='pg-emptystate';
      var _lb=pgLastGet(), _lbT='';
      try{ if(_lb){ var _lf=CATALOG.filter(function(c){return c.k===_lb;})[0]; if(_lf)_lbT=_lf.t; } }catch(_){}
      empty.innerHTML='<div class="pg-es-ic"></div>'
        +'<div class="pg-es-t">Тут поки порожньо</div>'
        +'<div class="pg-es-d">Почни з чогось одного — решту додаси по ходу</div>'
        +'<div class="pg-es-qk">'
          +'<button class="pri" data-pgqk="note">Текст</button>'
          +'<button data-pgqk="task">Завдання</button>'
          +'<button data-pgqk="card">Картка</button>'
          +'<button data-pgqk="_more">Ще…</button>'
        +'</div>'
        +(_lbT?'<div class="pg-es-last" data-pgqk="'+_lb+'">↩ Минулого разу ти починав з <b>'+esc(_lbT)+'</b></div>':'');
      empty.onclick=function(e){
        var q=e.target&&e.target.closest&&e.target.closest('[data-pgqk]');
        var k=(q&&q.dataset.pgqk)||'note';
        var nb={id:uid(),type:'note',text:''};
        pgResolve().arr.push(nb); save();
        if(k==='_more'){ render(); slashCtx=nb.id; openSlash(); return; }
        if(k!=='note'){ slashCtx=nb.id; applySlash(k); return; }
        render();
        var el=editor.querySelector('[data-edit="'+nb.id+'"]'); if(el)caretEnd(el);
      };
      editor.appendChild(empty);
      return;
    }
    renderList(arr,editor);
    renumber();
    fillWidgetHosts();
    if(aid){var el=editor.querySelector('[data-edit="'+aid+'"]');if(el)caretEnd(el);}
  }
  /* живі віджети: вставляємо справжні тайли дошки і біндимо їхні обробники */
  function fillWidgetHosts(){
    var br=bridge(); if(!br||!br.tileHTML)return;
    var hosts=editor.querySelectorAll('[data-pgwhost]');
    if(!hosts.length)return;
    hosts.forEach(function(h){
      var html=''; try{ html=br.tileHTML(h.dataset.pgwhost)||''; }catch(_){}
      h.innerHTML=html||'<div style="color:var(--pg-mut);font-size:12px;padding:8px 2px">Віджет недоступний</div>';
    });
    try{ if(br.bindWidgets) br.bindWidgets(editor); }catch(_){}
  }
  /* коли дошка перерендерилась після дії у віджеті — оновлюємо сторінку */
  window.__pgWidgetsSync=function(){
    try{
      var scr=document.getElementById('scr-page');
      if(scr&&scr.classList.contains('active')) render();
    }catch(_){}
  };
  function caretEnd(el){el.focus();try{var r=document.createRange();r.selectNodeContents(el);r.collapse(false);var s=window.getSelection();s.removeAllRanges();s.addRange(r);}catch(e){}}

  // ── input / slash ──
  var slashCtx=null;
  editor.addEventListener('input',function(e){
    var phn=e.target.closest&&e.target.closest('[data-phname]');
    if(phn){var pn0=phn.dataset.phname.split('|');var lpn=locate(pn0[0]);
      if(lpn){var pnp=(lpn.block.projects||[]).find(function(x){return x.id===pn0[1];});
        if(pnp){pnp.name=phn.value;
          var nameEl=editor.querySelector('[data-phrow="'+pn0[0]+'|'+pn0[1]+'"] .ph-name');
          if(nameEl){nameEl.childNodes[0]&&(nameEl.childNodes[0].textContent=phn.value+'  ');}
          save();}}return;}
    var df=e.target.closest&&e.target.closest('[data-dlfact]');
    if(df){var f0=df.dataset.dlfact.split('|');var lf=locate(f0[0]);
      if(lf){var dec=(lf.block.decisions||[]).find(function(x){return String(x.id)===f0[1];});
        if(dec){dec.fact=df.value;save();}}return;}
    var jt=e.target.closest&&e.target.closest('[data-jrtoday]');
    if(jt){var lj=locate(jt.dataset.jrtoday);if(lj){lj.block.entries=lj.block.entries||{};lj.block.entries[jrYmd()]=jt.value;save();}return;}
    var jp=e.target.closest&&e.target.closest('[data-jrpast]');
    if(jp){var pp=jp.dataset.jrpast.split('|');var lp=locate(pp[0]);if(lp){lp.block.entries=lp.block.entries||{};lp.block.entries[pp[1]]=jp.value;save();}return;}
    var cl=e.target.closest&&e.target.closest('[data-pgcodelang]');
    if(cl){var lcl=locate(cl.dataset.pgcodelang);if(lcl){lcl.block.lang=cl.textContent;save();}return;}
    var hc=e.target.closest('[data-pgdbhcol]');
    if(hc){var hp=hc.dataset.pgdbhcol.split('|');var lh=locate(hp[0]);if(lh&&lh.block.cols[+hp[1]]){lh.block.cols[+hp[1]].t=hc.textContent;save();}return;}
    var c=e.target.closest('[data-pgdbcell]');
    if(c){var p=c.dataset.pgdbcell.split('|');var l=locate(p[0]);if(l){l.block.rows[p[1]][p[2]]=c.textContent;save();}return;}
    var nm=e.target.closest('[data-pgdbname]');
    if(nm){var l2=locate(nm.dataset.pgdbname);if(l2){l2.block.dbName=nm.value;l2.block.title=nm.value;save();}return;}
    var el=e.target.closest('[data-edit]');if(!el)return;
    var id=el.dataset.edit,loc=locate(id);if(!loc)return;
    var txt=el.textContent;
    if(txt==='/'&&(loc.block.type==='note')&&!txtOf(loc.block).replace('/','').trim()){
      el.textContent='';setTxt(loc.block,'');slashCtx=id;openSlash();return;
    }
    setTxt(loc.block,txt);save();
  });

  editor.addEventListener('keydown',function(e){
    var el=e.target.closest('[data-edit]');if(!el)return;
    var id=el.dataset.edit,loc=locate(id);if(!loc)return;
    if(e.key==='Enter'&&!e.shiftKey&&loc.block.type!=='callout'){
      e.preventDefault();
      var contin=(loc.block.type==='task'||loc.block.type==='bullet'||loc.block.type==='num');
      if(contin&&!txtOf(loc.block).trim()){loc.block.type='note';setTxt(loc.block,'');save();render();var e0=editor.querySelector('[data-edit="'+id+'"]');if(e0)caretEnd(e0);return;}
      var nb={id:uid(),type:contin?loc.block.type:'note',text:'',title:''};
      if(contin&&loc.block.type==='task')nb.done=false;
      loc.arr.splice(loc.idx+1,0,nb);save();render();
      var ne=editor.querySelector('[data-edit="'+nb.id+'"]');if(ne)caretEnd(ne);
      return;
    }
    if(e.key==='Backspace'&&!el.textContent.trim()){
      if(loc.arr.length>1||loc.parent){
        e.preventDefault();var pi=loc.idx-1;loc.arr.splice(loc.idx,1);save();render();
        if(pi>=0&&loc.arr[pi]){var pe=editor.querySelector('[data-edit="'+loc.arr[pi].id+'"]');if(pe)caretEnd(pe);}
        return;
      }
    }
  });

  editor.addEventListener('click',function(e){
    var td=e.target.closest('[data-pgtodo]');
    if(td){var l=locate(td.dataset.pgtodo);if(l){l.block.done=!l.block.done;save();render();}return;}
    var tg=e.target.closest('[data-pgtoggle]');
    if(tg){var l2=locate(tg.dataset.pgtoggle);if(l2){l2.block.open=!l2.block.open;save();render();}return;}
    var dv=e.target.closest('[data-pgdbview]');
    if(dv){var p=dv.dataset.pgdbview.split('|');var l3=locate(p[0]);if(l3){l3.block.view=p[1];save();render();}return;}
    var da=e.target.closest('[data-pgdbadd]');
    if(da){var l4=locate(da.dataset.pgdbadd);if(l4){var nr={};(l4.block.cols||[]).forEach(function(c){nr[c.k]=dbColType(c)==='status'?'Нова':'';});if(l4.block.cols&&l4.block.cols[0])nr[l4.block.cols[0].k]='';l4.block.rows.push(nr);save();render();}return;}
    var dcx=e.target.closest('[data-pgdbcdel]');
    if(dcx){var cp=dcx.dataset.pgdbcdel.split('|');var lcx=locate(cp[0]);
      if(lcx){var ci=+cp[1],col=lcx.block.cols[ci];if(col){confirmSheet({title:'Видалити колонку «'+(col.t||'')+'»?',onOk:function(){
        lcx.block.cols.splice(ci,1);(lcx.block.rows||[]).forEach(function(r){delete r[col.k];});save();render();}});}}return;}
    var dct=e.target.closest('[data-pgdbctype]');
    if(dct){var tp=dct.dataset.pgdbctype.split('|');var lct=locate(tp[0]);
      if(lct){var col2=lct.block.cols[+tp[1]];if(col2){
        actionSheet({title:'Тип колонки «'+(col2.t||'')+'»',items:[
          {ic:'🇹',label:'Текст',onClick:function(){col2.type='text';save();render();}},
          {ic:'#️⃣',label:'Число',sub:'вирівнювання + підсумок',onClick:function(){col2.type='num';save();render();}},
          {ic:'◔',label:'Статус',sub:'кольоровий тег',onClick:function(){col2.type='status';(lct.block.rows||[]).forEach(function(r){if(!r[col2.k])r[col2.k]='Нова';});save();render();}}
        ]});}}return;}
    var dac=e.target.closest('[data-pgdbaddcol]');
    if(dac){var lac=locate(dac.dataset.pgdbaddcol);
      if(lac){inputModal({title:'Назва нової колонки',placeholder:'Напр. Дедлайн',onOk:function(nm){
        if(!(nm||'').trim())return;var key='c'+Date.now();lac.block.cols.push({k:key,t:nm.trim(),type:'text'});
        (lac.block.rows||[]).forEach(function(r){r[key]='';});save();render();}});}return;}
    var drx=e.target.closest('[data-pgdbrdel]');
    if(drx){var rp=drx.dataset.pgdbrdel.split('|');var lrx=locate(rp[0]);
      if(lrx){lrx.block.rows.splice(+rp[1],1);save();render();}return;}
    var ds=e.target.closest('[data-pgdbstatus]');
    if(ds){var pp=ds.dataset.pgdbstatus.split('|');var l5=locate(pp[0]);
      if(l5){var items=STATUS_ORDER.map(function(st){var col=STATUS_COLORS[st];
        return {ic:'●',label:st,color:col,onClick:function(){l5.block.rows[pp[1]][pp[2]]=st;save();render();}};});
        actionSheet({title:'Статус',items:items});}return;}
  });

  // ── slash menu ──
  var slash=document.getElementById('pgSlash'),slist=document.getElementById('pgSlashList'),
      ssearch=document.getElementById('pgSlashSearch'),backdrop=document.getElementById('pgBackdrop');
  var srail=document.getElementById('pgstRail');
  var pgsCat='base', pgsSel=0, pgsShown=[];
  function pgsFiltered(f){
    f=(f||'').toLowerCase().trim();
    if(f) return CATALOG.filter(function(i){
      if(i.t.toLowerCase().includes(f)||i.d.toLowerCase().includes(f)) return true;
      var syn=PGS_SYN[i.k];
      if(syn) for(var s=0;s<syn.length;s++){ if(syn[s].toLowerCase().includes(f)) return true; }
      return false;
    });
    return CATALOG.filter(function(i){return i.cat===pgsCat;});
  }
  function buildRail(){
    srail.innerHTML='';
    PGS_CATS.forEach(function(c){
      var el=document.createElement('div');el.className='pgst-cat'+(pgsCat===c.id?' on':'');
      el.innerHTML=pgsIc(c.ic)+c.t;
      el.onclick=function(){pgsCat=c.id;ssearch.value='';buildSlash('');};
      srail.appendChild(el);
    });
  }
  function buildSlash(f){
    pgsShown=pgsFiltered(f); pgsSel=0;
    buildRail(); slist.innerHTML='';
    if(!f&&pgsCat==='base'){
      var rk=pgRecentGet();
      var recentItems=rk.map(function(k){return CATALOG.filter(function(c){return c.k===k;})[0];}).filter(Boolean);
      if(recentItems.length){
        var rhead=document.createElement('div'); rhead.className='pg-ssec'; rhead.textContent='Нещодавні';
        slist.appendChild(rhead);
        recentItems.forEach(function(i){
          var rel=document.createElement('div');rel.className='pg-sitem pgs-recent';rel.style.setProperty('--sc',i.c);
          rel.dataset.k=i.k;
          rel.innerHTML='<span class="sic">'+pgsIc(i.ic)+'</span><div class="sb"><div class="st">'+i.t+'</div><div class="sd">'+i.d+'</div></div>';
          slist.appendChild(rel);
        });
        var mhead=document.createElement('div'); mhead.className='pg-ssec'; mhead.textContent='Усі блоки';
        slist.appendChild(mhead);
      }
    }
    pgsShown.forEach(function(i,idx){
      var el=document.createElement('div');el.className='pg-sitem'+(idx===0?' on':'');el.style.setProperty('--sc',i.c);
      el.dataset.k=i.k;
      el.innerHTML='<span class="sic">'+pgsIc(i.ic)+'</span><div class="sb"><div class="st">'+i.t+'</div><div class="sd">'+i.d+'</div></div>';
      el.onmouseenter=function(){
        pgsSel=idx;
        slist.querySelectorAll('.pg-sitem:not(.pgs-recent)').forEach(function(x,j){x.classList.toggle('on',j===idx);});
      };
      slist.appendChild(el);
    });
  }
  /* один тап — одразу вставка (делегування: стабільно працює на iOS); працює й для «Нещодавні» — той самий data-k */
  slist.addEventListener('click',function(e){
    var it=e.target&&e.target.closest&&e.target.closest('.pg-sitem');
    if(it&&it.dataset.k)applySlash(it.dataset.k);
  });
  /* клавіатура на десктопі: ↑↓ вибір, Enter — вставити, / відкриває палітру (SPECblocksv2 §3.2). «Нещодавні» — лише тапом/кліком, поза стрілочною навігацією */
  ssearch.addEventListener('keydown',function(e){
    if(!pgsShown.length)return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){
      e.preventDefault();
      pgsSel=(pgsSel+(e.key==='ArrowDown'?1:-1)+pgsShown.length)%pgsShown.length;
      var rows=slist.querySelectorAll('.pg-sitem:not(.pgs-recent)');
      rows.forEach(function(x,j){x.classList.toggle('on',j===pgsSel);});
      if(rows[pgsSel])rows[pgsSel].scrollIntoView({block:'nearest'});
    }else if(e.key==='Enter'){
      e.preventDefault();
      if(pgsShown[pgsSel])applySlash(pgsShown[pgsSel].k);
    }
  });
  /* нове туду: Enter — додати і писати далі, blur — додати і закрити */
  editor.addEventListener('keydown',function(e){
    /* "/" на порожньому блоці — відкриває палітру, заякорену біля нього (SPECblocksv2 §3.2) */
    var ced=e.target.closest&&e.target.closest('[data-edit]');
    if(ced&&e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!ced.textContent.trim()){
      e.preventDefault();
      slashCtx=ced.dataset.edit; openSlash();
      return;
    }
    /* нова звичка в трекері */
    var hbi=e.target.closest&&e.target.closest('[data-hbinput]');
    if(hbi&&e.key==='Enter'){e.preventDefault();var hbv=hbi.value.trim();hbi.value='';if(!hbv)return;
      var lhbi=locate(hbi.dataset.hbinput);if(!lhbi)return;lhbi.block.habits=lhbi.block.habits||[];
      lhbi.block.habits.push({id:'h'+Date.now(),name:hbv,emoji:'✅',marks:{}});save();render();
      var nn=editor.querySelector('[data-hbinput="'+lhbi.block.id+'"]');if(nn)nn.focus();return;}
    /* крок плану в хабі проєктів */
    var hsp=e.target.closest&&e.target.closest('[data-phstepinput]');
    if(hsp&&e.key==='Enter'){e.preventDefault();var hv2=hsp.value.trim();hsp.value='';if(!hv2)return;
      var hp0=hsp.dataset.phstepinput.split('|');var lhp=locate(hp0[0]);if(!lhp)return;
      var php=(lhp.block.projects||[]).find(function(x){return x.id===hp0[1];});if(!php)return;
      php.steps=php.steps||[];php.steps.push({id:'s'+Date.now(),t:hv2,done:false});save();render();
      var nhi=editor.querySelector('[data-phstepinput="'+hp0[0]+'|'+hp0[1]+'"]');if(nhi)nhi.focus();return;}
    /* крок плану проєкту */
    var sp=e.target.closest&&e.target.closest('[data-ptstepinput]');
    if(sp&&e.key==='Enter'){e.preventDefault();var v=sp.value.trim();sp.value='';if(!v)return;
      var l=locate(sp.dataset.ptstepinput);if(!l)return;l.block.steps=l.block.steps||[];
      l.block.steps.push({id:'s'+Date.now(),t:v,done:false});save();render();
      var ni=editor.querySelector('[data-ptstepinput="'+l.block.id+'"]');if(ni)ni.focus();return;}
    /* звичка проєкту */
    var hp=e.target.closest&&e.target.closest('[data-pthabinput]');
    if(hp&&e.key==='Enter'){e.preventDefault();var hv=hp.value.trim();hp.value='';if(!hv)return;
      var lh=locate(hp.dataset.pthabinput);if(!lh)return;lh.block.habits=lh.block.habits||[];
      lh.block.habits.push({id:'h'+Date.now(),name:hv,emoji:'✅',marks:{}});save();render();
      var nh=editor.querySelector('[data-pthabinput="'+lh.block.id+'"]');if(nh)nh.focus();return;}
    var ip=e.target.closest&&e.target.closest('[data-jtinput]');
    if(ip&&e.key==='Enter'){
      e.preventDefault();
      var v=ip.value.trim(); ip.value='';
      if(!v)return;
      var l=locate(ip.dataset.jtinput); if(!l)return;
      var y=jrYmd(); l.block.todos=l.block.todos||{};
      (l.block.todos[y]=l.block.todos[y]||[]).push({id:'t'+Date.now(),t:v,done:false});
      save();render();
      var ni=editor.querySelector('[data-jtinput="'+l.block.id+'"]'); if(ni)ni.focus();
    }
  });
  editor.addEventListener('focusout',function(e){
    var ip=e.target.closest&&e.target.closest('[data-jtinput]');
    if(!ip)return;
    var bid=ip.dataset.jtinput, v=ip.value.trim();
    if(v){var l=locate(bid);
      if(l){var y=jrYmd();l.block.todos=l.block.todos||{};
        (l.block.todos[y]=l.block.todos[y]||[]).push({id:'t'+Date.now(),t:v,done:false});save();}}
    delete jrTdAdd[bid];
    setTimeout(function(){ if(!jrTdAdd[bid]) render(); },80);
  });

