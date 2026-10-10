  /* ════════ Блок «Таблиця» (тип tbl, 10.10.2026 — обʼєднання макетів A·B·C, етап 1) ════════
     b.cols  = [{id, t, ty}]  ty: text · num · check · date · status · plan («🔗 з Планера» — нічого не зберігає)
     b.rows  = [{id, c:{colId:значення}}]            — режим «вільні рядки»
     b.mode  = 'days' → рядки = дні місяця b.ym ('YYYY-MM'), значення в b.days = {'YYYY-MM-DD': {colId:значення}}
     b.chart = colId числової колонки для графіка в режимі днів.
     Таблиця — звичайний блок документа (ключ board), нового ключа нема. Структурні зміни — з «Скасувати» редактора. */
  var TB_TY={text:['Текст','Тт'],num:['Число','#'],check:['Галочка','☑'],date:['Дата','📅'],status:['Статус','◔'],plan:['🔗 з Планера','🔗']};
  var TB_ST=['Заплановано','У роботі','Готово'], TB_STC={'Заплановано':'#f0a020','У роботі':'#5b8def','Готово':'#34c77b'};
  var TB_MAXC=20, TB_MAXR=500;
  function tbId(p){ return p+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function tbInit(b){
    b.type='tbl'; b.title=b.title&&String(b.title).trim()?b.title:'Таблиця'; delete b.text;
    b.cols=[{id:tbId('c'),t:'Назва',ty:'text'},{id:tbId('c'),t:'Статус',ty:'status'},{id:tbId('c'),t:'Дата',ty:'date'}];
    b.rows=[{id:tbId('r'),c:{}},{id:tbId('r'),c:{}},{id:tbId('r'),c:{}}];
  }
  function tbHasTy(t){ return Object.prototype.hasOwnProperty.call(TB_TY,String(t||'')); }
  function tbOkId(x){ return x&&x.id&&String(x.id).indexOf('|')<0; }   /* '|' — роздільник у data-атрибутах */
  function tbCols(b){ return Array.isArray(b.cols)?b.cols.filter(function(c){ return tbOkId(c)&&tbHasTy(c.ty); }).slice(0,TB_MAXC):[]; }
  function tbRows(b){ return Array.isArray(b.rows)?b.rows.filter(function(r){ return tbOkId(r)&&r.c&&typeof r.c==='object'&&!Array.isArray(r.c); }).slice(0,TB_MAXR):[]; }
  function tbYm(b){ var m=/^(\d{4})-(\d{2})$/.exec(b.ym||''); return m&&+m[2]>=1&&+m[2]<=12?b.ym:ymdLocal().slice(0,7); }
  function tbDays(b){ var ym=tbYm(b), n=new Date(+ym.slice(0,4),+ym.slice(5,7),0).getDate(), out=[]; for(var d=1;d<=n;d++) out.push(ym+'-'+(d<10?'0':'')+d); return out; }
  function tbFolder(){ try{ return typeof pgFolderKey==='function'?(pgFolderKey()||''):''; }catch(_){ return ''; } }
  // «🔗 з Планера»: хвилини виконаних блоків цієї папки за дату рядка (лише читання)
  function tbPlanMin(ds,fk){
    if(!fk||!/^\d{4}-\d{2}-\d{2}$/.test(ds||'')) return 0;
    var bl=[]; try{ bl=plBlocksDisplay(ds); }catch(_){}
    return Math.round(bl.filter(function(x){ return x&&x.done&&x.folder===fk; }).reduce(function(s,x){ return s+Math.max(0,Math.min(plBlockEnd(x),24)-(+x.h||0)); },0)*60);
  }
  function tbRowDate(b,row,cols){ if(row.ds) return row.ds; var dc=cols.find(function(c){ return c.ty==='date'; }); return dc?String(row.c[dc.id]||''):''; }
  function tbNum(v){ var n=parseFloat(String(v==null?'':v).replace(',','.').replace(/\s/g,'')); return isFinite(n)?n:0; }
  function tbFmt(n){ return String(Math.round(n*100)/100).replace('.',','); }
  function tbCellHTML(b,row,col,fk,cols){
    var key=esc(b.id)+'|'+esc(row.id)+'|'+esc(col.id), v=row.c[col.id];
    if(col.ty==='check') return '<button class="tb-ck'+(v?' on':'')+'" data-tcheck="'+key+'" role="checkbox" aria-checked="'+(!!v)+'" aria-label="Галочка">'+(v?'✓':'')+'</button>';
    if(col.ty==='status'){ var s=TB_ST.indexOf(v)>=0?v:''; return '<button class="tb-st'+(s?'':' none')+'" data-tstat="'+key+'" style="--sc:'+(TB_STC[s]||'#8b93a3')+'">'+(s?esc(s):'—')+'</button>'; }
    if(col.ty==='date') return '<input class="tb-dt" type="date" data-tdate="'+key+'" value="'+esc(/^\d{4}-\d{2}-\d{2}$/.test(v||'')?v:'')+'" aria-label="Дата">';
    if(col.ty==='plan'){ var ds=tbRowDate(b,row,cols), m=tbPlanMin(ds,fk); return '<span class="tb-plan" title="Хвилини виконаних блоків папки в Планері">'+(ds?(m?m+' хв':'0'):'—')+' <i>🔗</i></span>'; }
    return '<div class="tb-tx'+(col.ty==='num'?' num':'')+'" contenteditable="true"'+(col.ty==='num'?' inputmode="decimal"':'')+' data-tc="'+key+'">'+esc(v==null?'':String(v))+'</div>';
  }
  function tbHTML(b){
    var cols=tbCols(b), fk=tbFolder(), days=b.mode==='days';
    var rows=days?tbDays(b).map(function(ds){ var c=(b.days&&typeof b.days==='object'&&b.days[ds]&&typeof b.days[ds]==='object'&&!Array.isArray(b.days[ds]))?b.days[ds]:{}; return {id:ds,ds:ds,c:c}; }):tbRows(b);
    var td=ymdLocal();
    var head='<div class="tb-tr tb-hd">'+(days?'<div class="tb-th tb-day">День</div>':'')+cols.map(function(c){
        return '<button class="tb-th" data-tbcol="'+esc(b.id)+'|'+esc(c.id)+'"><i>'+TB_TY[c.ty][1]+'</i><span data-i18n-skip="1">'+esc(String(c.t||'').slice(0,40))+'</span></button>'; }).join('')
      +(cols.length<TB_MAXC?'<button class="tb-th tb-addc" data-taddcol="'+esc(b.id)+'" aria-label="Додати колонку">＋</button>':'<div class="tb-th"></div>')+'</div>';
    var body=rows.map(function(r){
      var dlab=days?('<div class="tb-td tb-day">'+esc(['Нд','Пн','Вт','Ср','Чт','Пт','Сб'][new Date(r.ds+'T12:00:00').getDay()])+' <b>'+(+r.ds.slice(8))+'</b></div>'):'';
      return '<div class="tb-tr'+(r.ds===td?' today':'')+'">'+dlab+cols.map(function(c){ return '<div class="tb-td">'+tbCellHTML(b,r,c,fk,cols)+'</div>'; }).join('')
        +(days?'<div class="tb-td"></div>':'<button class="tb-rx" data-trowdel="'+esc(b.id)+'|'+esc(r.id)+'" aria-label="Видалити рядок">✕</button>')+'</div>'; }).join('');
    // «Разом»: числа — сума, галочки — «n з m», Планер — сума хвилин
    var sum='<div class="tb-tr tb-sum">'+(days?'<div class="tb-td tb-day">Разом</div>':'')+cols.map(function(c,ci){
      var t='';
      if(c.ty==='num') t=tbFmt(rows.reduce(function(s,r){ return s+tbNum(r.c[c.id]); },0));
      else if(c.ty==='check') t=rows.filter(function(r){ return r.c[c.id]; }).length+' з '+rows.length;
      else if(c.ty==='plan') t=rows.reduce(function(s,r){ return s+tbPlanMin(tbRowDate(b,r,cols),fk); },0)+' хв';
      else if(c.ty==='status') t=rows.filter(function(r){ return r.c[c.id]==='Готово'; }).length+' готово';
      else if(ci===0&&!days) t='Разом';
      return '<div class="tb-td">'+esc(t)+'</div>'; }).join('')+'<div class="tb-td"></div></div>';
    // графік (режим днів): стовпчики вибраної числової колонки
    var chart='';
    if(days){ var cc=cols.find(function(c){ return c.id===b.chart&&(c.ty==='num'||c.ty==='plan'); })||cols.find(function(c){ return c.ty==='plan'||c.ty==='num'; });
      if(cc){ var vals=rows.map(function(r){ return cc.ty==='plan'?tbPlanMin(r.ds,fk):tbNum(r.c[cc.id]); }), mx=Math.max.apply(null,vals.concat([1]));
        chart='<div class="tb-chart" aria-label="Графік «'+esc(cc.t)+'»"><small>'+esc(cc.t)+' по днях</small><div class="tb-bars">'+vals.map(function(v,i){ return '<i class="'+(rows[i].ds===td?'td':'')+'" style="height:'+(v?Math.max(6,Math.round(v/mx*100)):2)+'%" title="'+(+rows[i].ds.slice(8))+': '+tbFmt(v)+'"></i>'; }).join('')+'</div></div>'; } }
    var ym=tbYm(b);
    return '<div class="pg-content tb" data-tbl="'+esc(b.id)+'">'
      +'<div class="tb-top"><div class="tb-name" contenteditable="true" data-tname="'+esc(b.id)+'" data-i18n-skip="1">'+esc(String(b.title||'Таблиця'))+'</div>'
      +(days?'<span class="tb-mon"><button data-tmon="'+esc(b.id)+'|-1" aria-label="Попередній місяць">‹</button><b>'+esc((typeof MO_NAMES!=='undefined'?MO_NAMES[+ym.slice(5,7)-1]:ym.slice(5,7))+' '+ym.slice(0,4))+'</b><button data-tmon="'+esc(b.id)+'|1" aria-label="Наступний місяць">›</button></span>':'')
      +'<button class="tb-cfg" data-tcfg="'+esc(b.id)+'" aria-label="Налаштування таблиці">⚙</button></div>'
      +chart+'<div class="tb-scroll"><div class="tb-grid'+(days?' days':'')+'" style="--n:'+(cols.length+(days?1:0))+';--m:'+cols.length+'">'+head+body+sum+'</div></div>'
      +(days||rows.length>=TB_MAXR?'':'<button class="tb-addr" data-taddrow="'+esc(b.id)+'">＋ рядок</button>')+'</div>';
  }
  /* ── дії: усе лише з тапу; структурні — з «Скасувати» (pushOp на тих самих обʼєктах) ── */
  function tbLoc(id){ var l=locate(id); return l&&l.block&&l.block.type==='tbl'?l.block:null; }
  function tbCellObj(b,rid){ if(b.mode==='days'){ if(!/^\d{4}-\d{2}-\d{2}$/.test(rid)) return null; if(!b.days||typeof b.days!=='object'||Array.isArray(b.days)) b.days={}; if(!b.days[rid]||typeof b.days[rid]!=='object'||Array.isArray(b.days[rid])) b.days[rid]={}; return b.days[rid]; }
    var r=tbRows(b).find(function(x){ return String(x.id)===String(rid); }); return r?r.c:null; }
  function tbSetUndo(obj,k,nv){ var had=Object.prototype.hasOwnProperty.call(obj,k), ov=obj[k];
    var put=function(v,h){ if(h) obj[k]=v; else delete obj[k]; };
    put(nv,nv!==''&&nv!=null&&nv!==false);
    pushOp(function(){ put(ov,had); },function(){ put(nv,nv!==''&&nv!=null&&nv!==false); }); }
  editor.addEventListener('input',function(e){
    var c=e.target.closest&&e.target.closest('[data-tc]');
    if(c){ var p=c.dataset.tc.split('|'), b=tbLoc(p[0]); if(!b) return; var o=tbCellObj(b,p[1]); if(!o) return;
      var v=c.textContent.slice(0,500); if(v.trim()) o[p[2]]=v; else delete o[p[2]]; save(); return; }
    var n=e.target.closest&&e.target.closest('[data-tname]');
    if(n){ var bn=tbLoc(n.dataset.tname); if(bn){ bn.title=n.textContent.slice(0,80); save(); } }
  });
  /* вийшов з клітинки (і не перейшов в іншу клітинку таблиці) — перемалювати, щоб оновився рядок «Разом» */
  editor.addEventListener('focusout',function(e){
    if(!(e.target.closest&&e.target.closest('[data-tc]'))) return;
    /* фокус лишився в таблиці (інша клітинка, дата, назва) — не перемальовуємо, щоб не зірвати введення */
    setTimeout(function(){ var a=document.activeElement; if(a&&a.closest&&a.closest('.tb')) return; render(); },60);
  });
  editor.addEventListener('keydown',function(e){
    var c=e.target.closest&&e.target.closest('[data-tc],[data-tname]'); if(!c) return;
    if(e.key==='Enter'){ e.preventDefault(); c.blur(); }   /* Enter у клітинці — не новий блок, а кінець правки */
  });
  editor.addEventListener('change',function(e){
    var d=e.target.closest&&e.target.closest('[data-tdate]'); if(!d) return;
    var p=d.dataset.tdate.split('|'), b=tbLoc(p[0]); if(!b) return; var o=tbCellObj(b,p[1]); if(!o) return;
    var v=/^\d{4}-\d{2}-\d{2}$/.test(d.value)?d.value:''; tbSetUndo(o,p[2],v); save(); render();
  });
  editor.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-tcheck],[data-tstat],[data-taddrow],[data-taddcol],[data-trowdel],[data-tbcol],[data-tcfg],[data-tmon]'); if(!t) return;
    e.preventDefault(); e.stopPropagation();
    var ds=t.dataset;
    if(ds.tcheck||ds.tstat){ var p=(ds.tcheck||ds.tstat).split('|'), b=tbLoc(p[0]); if(!b) return; var o=tbCellObj(b,p[1]); if(!o) return;
      if(ds.tcheck) tbSetUndo(o,p[2],!o[p[2]]);
      else { var i=TB_ST.indexOf(o[p[2]]); tbSetUndo(o,p[2],i>=TB_ST.length-1?'':TB_ST[i+1]); }
      save(); render(); return; }
    if(ds.taddrow){ var b2=tbLoc(ds.taddrow); if(!b2) return; if(!Array.isArray(b2.rows)) b2.rows=[]; if(b2.rows.length>=TB_MAXR) return;
      var row={id:tbId('r'),c:{}}, arr=b2.rows; arr.push(row);
      pushOp(function(){ var i=arr.indexOf(row); if(i>=0) arr.splice(i,1); },function(){ if(arr.indexOf(row)<0) arr.push(row); });
      save(); render(); return; }
    if(ds.trowdel){ var p2=ds.trowdel.split('|'), b3=tbLoc(p2[0]); if(!b3||!Array.isArray(b3.rows)) return;
      var arr3=b3.rows, idx=arr3.findIndex(function(x){ return x&&String(x.id)===p2[1]; }); if(idx<0) return;
      var gone=arr3.splice(idx,1)[0];
      pushOp(function(){ if(arr3.indexOf(gone)<0) arr3.splice(Math.min(idx,arr3.length),0,gone); },function(){ var j=arr3.indexOf(gone); if(j>=0) arr3.splice(j,1); });
      save(); render(); try{ if(typeof window.__flowToast==='function') window.__flowToast('Рядок видалено — «Скасувати» вгорі поверне'); }catch(_){} return; }
    if(ds.taddcol){ tbColSheet(ds.taddcol,''); return; }
    if(ds.tbcol){ var p3=ds.tbcol.split('|'); tbColSheet(p3[0],p3[1]); return; }
    if(ds.tcfg){ tbCfgSheet(ds.tcfg); return; }
    if(ds.tmon){ var p4=ds.tmon.split('|'), b4=tbLoc(p4[0]); if(!b4) return; var ym=tbYm(b4), y=+ym.slice(0,4), m=+ym.slice(5,7)+(+p4[1]||0);
      if(m<1){ m=12; y--; } if(m>12){ m=1; y++; } b4.ym=y+'-'+(m<10?'0':'')+m; save(); render(); return; }
  });
  // колонка: назва + тип; нова — додається в кінець; видалити — зі «Скасувати»
  function tbColSheet(bid,cid){
    var b=tbLoc(bid); if(!b) return; var col=cid?tbCols(b).find(function(c){ return c.id===cid; }):null;
    var ty=col&&tbHasTy(col.ty)?col.ty:'text';
    var ov=document.createElement('div'); ov.className='pgask-ov';
    var draw=function(){
      ov.innerHTML='<div class="pgask cond-card tbsheet"><div class="pgask-t">'+(col?'Колонка':'Нова колонка')+'</div>'
        +'<input class="tbs-in" id="tbColT" maxlength="40" placeholder="Назва колонки" value="'+esc(col?col.t:'')+'">'
        +'<div class="cond-lbl">Тип</div><div class="tbs-ty">'+Object.keys(TB_TY).map(function(k){ return '<button data-tty="'+k+'" class="'+(k===ty?'on':'')+'"><i>'+TB_TY[k][1]+'</i>'+TB_TY[k][0]+'</button>'; }).join('')+'</div>'
        +(ty==='plan'?'<small class="pglay-hint">Хвилини виконаних блоків цієї папки за дату рядка — рахуються з Планера самі.'+(b.mode==='days'?'':' Потрібна колонка «Дата».')+'</small>':'')
        +(col?'<button class="tbs-del" data-tcoldel>Видалити колонку</button>':'')
        +'<div class="pgask-b"><button class="c">Скасувати</button><button class="ok">Зберегти</button></div></div>';
      ov.querySelectorAll('[data-tty]').forEach(function(x){ x.onclick=function(){ var tv=ov.querySelector('#tbColT').value; ty=x.dataset.tty; draw(); ov.querySelector('#tbColT').value=tv; }; });
      ov.querySelector('.c').onclick=function(){ ov.remove(); };
      var dl=ov.querySelector('[data-tcoldel]'); if(dl) dl.onclick=function(){
        var arr=b.cols, i=arr.indexOf(col); if(i<0){ ov.remove(); return; } arr.splice(i,1);
        pushOp(function(){ if(arr.indexOf(col)<0) arr.splice(Math.min(i,arr.length),0,col); },function(){ var j=arr.indexOf(col); if(j>=0) arr.splice(j,1); });
        ov.remove(); save(); render(); };
      ov.querySelector('.ok').onclick=function(){
        var t=String(ov.querySelector('#tbColT').value||'').trim().slice(0,40)||TB_TY[ty][0];
        if(col){ var ot=col.t, oty=col.ty; col.t=t; col.ty=ty; pushOp(function(){ col.t=ot; col.ty=oty; },function(){ col.t=t; col.ty=ty; }); }
        else { if(!Array.isArray(b.cols)) b.cols=[]; if(tbCols(b).length>=TB_MAXC){ ov.remove(); return; } var nc={id:tbId('c'),t:t,ty:ty}, arr2=b.cols; arr2.push(nc);
          pushOp(function(){ var j=arr2.indexOf(nc); if(j>=0) arr2.splice(j,1); },function(){ if(arr2.indexOf(nc)<0) arr2.push(nc); }); }
        ov.remove(); save(); render(); };
    };
    ov.onclick=function(e){ if(e.target===ov) ov.remove(); };
    draw(); document.body.appendChild(ov);
  }
  // ⚙ таблиці: режим рядків (вільні / дні місяця) і колонка графіка
  function tbCfgSheet(bid){
    var b=tbLoc(bid); if(!b) return; var mode=b.mode==='days'?'days':'free', ch=b.chart||'';
    var nums=tbCols(b).filter(function(c){ return c.ty==='num'||c.ty==='plan'; });
    var ov=document.createElement('div'); ov.className='pgask-ov';
    var draw=function(){
      ov.innerHTML='<div class="pgask cond-card tbsheet"><div class="pgask-t">Таблиця</div>'
        +'<div class="cond-lbl">Рядки</div><div class="tbs-ty two"><button data-tmode="free" class="'+(mode==='free'?'on':'')+'"><i>☰</i>Вільні рядки</button><button data-tmode="days" class="'+(mode==='days'?'on':'')+'"><i>📅</i>Дні місяця</button></div>'
        +'<small class="pglay-hint">«Дні місяця» — рядок на кожен день, зверху графік. Вільні рядки при цьому не губляться — повернешся, вони на місці.</small>'
        +(mode==='days'&&nums.length?'<div class="cond-lbl">Графік</div><div class="tbs-ty">'+nums.map(function(c){ return '<button data-tch="'+esc(c.id)+'" class="'+((ch||nums[0].id)===c.id?'on':'')+'"><i>'+TB_TY[c.ty][1]+'</i><span data-i18n-skip="1">'+esc(c.t)+'</span></button>'; }).join('')+'</div>':'')
        +'<div class="pgask-b"><button class="c">Скасувати</button><button class="ok">Зберегти</button></div></div>';
      ov.querySelectorAll('[data-tmode]').forEach(function(x){ x.onclick=function(){ mode=x.dataset.tmode; draw(); }; });
      ov.querySelectorAll('[data-tch]').forEach(function(x){ x.onclick=function(){ ch=x.dataset.tch; draw(); }; });
      ov.querySelector('.c').onclick=function(){ ov.remove(); };
      ov.querySelector('.ok').onclick=function(){
        var om=b.mode, oc=b.chart;
        if(mode==='days') b.mode='days'; else delete b.mode; if(ch) b.chart=ch;
        var nm=b.mode, nc=b.chart;
        pushOp(function(){ if(om) b.mode=om; else delete b.mode; if(oc) b.chart=oc; else delete b.chart; },function(){ if(nm) b.mode=nm; else delete b.mode; if(nc) b.chart=nc; else delete b.chart; });
        ov.remove(); save(); render(); };
    };
    ov.onclick=function(e){ if(e.target===ov) ov.remove(); };
    draw(); document.body.appendChild(ov);
  }
