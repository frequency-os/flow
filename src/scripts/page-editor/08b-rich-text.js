  /* ═══════════ Оформлення тексту (19.11.2026, макет «Текст у папці», A «Тиха панель») ═══════════
     Телефон: скляна панель над клавіатурою, поки курсор у тексті: Aa · B · I · S · маркер · посилання · завдання · список · сховати.
     Компʼютер: та сама панель бульбашкою над виділеними словами; ⌘/Ctrl+B · I · ⇧X (закреслити) · ⇧H (маркер) · K (посилання).
     Швидкі набори на початку порожнього рядка: «# » «## » «### » «- » «1. » «[] ».
     Дані: у блок пишеться рядок з позначками (core/64-rich-text.js: txFromDom → **…**), показ — txHTML. Чужий HTML при вставці
     спершу стає позначками, тож у документ не потрапляє жоден сторонній тег чи атрибут. */
  var rbBar=document.createElement('div'), rbEl=null, rbBusy=false, rbAa=null;
  rbBar.className='pg-rbar'; rbBar.setAttribute('role','toolbar'); rbBar.setAttribute('aria-label','Оформлення тексту');
  var RB_BTN=[['aa','Aa','Стиль рядка'],['b','<b>B</b>','Жирний'],['i','<i>I</i>','Курсив'],['s','<s>S</s>','Закреслений'],['hl','<span class="rb-hl">A</span>','Маркер'],['ln','🔗','Посилання'],
    ['|'],['task','☑','Завдання'],['bullet','•','Список'],['kb','⌄','Сховати клавіатуру']];
  rbBar.innerHTML=RB_BTN.map(function(x){ return x[0]==='|'?'<span class="rb-sep" aria-hidden="true"></span>'
    :'<button type="button" class="rb-'+x[0]+'" data-rb="'+x[0]+'" aria-label="'+x[2]+'" title="'+x[2]+'">'+x[1]+'</button>'; }).join('');
  document.body.appendChild(rbBar);
  function rbPhone(){ try{ return window.matchMedia('(hover:none)').matches||window.innerWidth<1024; }catch(_){ return true; } }
  // поле з оформленням, у якому зараз курсор (або null)
  function rbField(){
    var s=window.getSelection(); if(!s||!s.rangeCount) return null;
    var n=s.anchorNode; var el=n&&(n.nodeType===1?n:n.parentElement); el=el&&el.closest&&el.closest('[data-edit]');
    if(!el||!editor.contains(el)) return null;
    var lc=locate(el.dataset.edit); return lc&&txIsRich(lc.block)?el:null;
  }
  function rbHide(){ rbBar.classList.remove('on','bub'); document.body.classList.remove('pg-rb-on'); rbEl=null; rbAaClose(); }
  function rbPlace(){
    var el=rbField(); if(!el||rbBusy){ if(!rbBusy) rbHide(); return; }
    var s=window.getSelection(), phone=rbPhone();
    if(!phone&&s.isCollapsed){ rbHide(); return; }   // компʼютер — лише над виділеним
    rbEl=el; rbBar.classList.add('on'); rbBar.classList.toggle('bub',!phone); document.body.classList.toggle('pg-rb-on',phone);
    pgMenuTheme(rbBar); rbSync();
    if(phone){
      var vv=window.visualViewport, bottom=vv?Math.max(0,window.innerHeight-(vv.height+vv.offsetTop)):0;
      rbBar.style.left=''; rbBar.style.top=''; rbBar.style.bottom=(bottom+8)+'px';
    } else {
      var r=s.getRangeAt(0).getBoundingClientRect(), w=rbBar.offsetWidth||300;
      rbBar.style.bottom=''; rbBar.style.top=Math.max(8,r.top-rbBar.offsetHeight-10)+'px';
      rbBar.style.left=Math.max(8,Math.min(window.innerWidth-w-8,r.left+r.width/2-w/2))+'px';
    }
  }
  // які кнопки «увімкнені» там, де курсор
  function rbSync(){
    var s=window.getSelection(), n=s&&s.anchorNode, el=n&&(n.nodeType===1?n:n.parentElement), on={};
    for(var x=el;x&&x!==rbEl&&x!==document.body;x=x.parentElement){ var t=x.tagName;
      if(t==='B'||t==='STRONG')on.b=1; if(t==='I'||t==='EM')on.i=1; if(t==='S'||t==='STRIKE'||t==='DEL')on.s=1; if(t==='MARK')on.hl=1; if(t==='A')on.ln=1; }
    var lc=rbEl&&locate(rbEl.dataset.edit); if(lc){ if(lc.block.type==='task')on.task=1; if(lc.block.type==='bullet')on.bullet=1; }
    rbBar.querySelectorAll('[data-rb]').forEach(function(b){ var k=b.dataset.rb; b.classList.toggle('on',!!on[k]); if(k!=='aa'&&k!=='kb') b.setAttribute('aria-pressed',String(!!on[k])); });
    var desk=!rbPhone(); ['task','bullet','kb'].forEach(function(k){ var b=rbBar.querySelector('[data-rb="'+k+'"]'); if(b) b.hidden=desk; });
    var sp=rbBar.querySelector('.rb-sep'); if(sp) sp.hidden=desk;
  }
  // записати поле в блок (позначки) — так само, як це робить набір тексту
  function rbSave(el){ el=el||rbEl; if(!el) return; var lc=locate(el.dataset.edit); if(!lc) return; setTxt(lc.block,txFromDom(el)); save(); }
  document.addEventListener('selectionchange',function(){ if(!rbBusy) setTimeout(rbPlace,0); });
  if(window.visualViewport){ window.visualViewport.addEventListener('resize',function(){ if(rbEl) rbPlace(); }); window.visualViewport.addEventListener('scroll',function(){ if(rbEl) rbPlace(); }); }
  // кнопки панелі не забирають фокус у тексту — інакше на iPhone ховається клавіатура
  rbBar.addEventListener('pointerdown',function(e){ e.preventDefault(); });
  rbBar.addEventListener('mousedown',function(e){ e.preventDefault(); });
  rbBar.addEventListener('click',function(e){ var b=e.target.closest('[data-rb]'); if(b) rbDo(b.dataset.rb); });
  function rbDo(k){
    var el=rbEl||rbField(); if(!el) return;
    if(k==='kb'){ try{ document.activeElement.blur(); }catch(_){} rbHide(); return; }
    if(k==='aa'){ rbAaOpen(el); return; }
    if(k==='b'||k==='i'||k==='s'){
      try{ document.execCommand('styleWithCSS',false,false); }catch(_){}
      document.execCommand(k==='b'?'bold':k==='i'?'italic':'strikeThrough',false,null);
      rbSave(el); rbSync(); return; }
    if(k==='hl'){ rbMark(el); return; }
    if(k==='ln'){ rbLink(el); return; }
    if(k==='task'||k==='bullet'){ var lc=locate(el.dataset.edit); if(!lc) return;
      rbSave(el); lc.block.type=lc.block.type===k?'note':k; if(lc.block.type==='task'&&lc.block.done==null) lc.block.done=false;
      var id=lc.block.id; save(); render(); var ne=editor.querySelector('[data-edit="'+id+'"]'); if(ne) caretEnd(ne); }
  }
  // маркер: виділене — у <mark>; курсор у маркері — зняти
  function rbMark(el){
    var s=window.getSelection(); if(!s.rangeCount) return;
    var n=s.anchorNode, m=n&&(n.nodeType===1?n:n.parentElement); m=m&&m.closest&&m.closest('mark');
    if(m&&el.contains(m)){ var p=m.parentNode; while(m.firstChild) p.insertBefore(m.firstChild,m); p.removeChild(m); rbSave(el); rbSync(); return; }
    if(s.isCollapsed){ try{ plToast('Виділи слова для маркера'); }catch(_){} return; }
    var r=s.getRangeAt(0); if(!el.contains(r.commonAncestorContainer)) return;
    var mk=document.createElement('mark'); mk.appendChild(r.extractContents()); r.insertNode(mk);
    s.removeAllRanges(); var r2=document.createRange(); r2.selectNodeContents(mk); s.addRange(r2);
    rbSave(el); rbSync();
  }
  // посилання: адресу питаємо в шторці; виділення памʼятаємо, поки вона відкрита
  function rbUrl(v){ v=String(v||'').trim(); if(!v) return '';
    if(!/^[a-z][a-z0-9+.-]*:/i.test(v)&&/^[^\s/]+\.[^\s]{2,}/.test(v)) v='https://'+v;
    return TX_URL.test(v)?v:''; }
  function rbLink(el){
    var s=window.getSelection(); if(!s.rangeCount) return;
    var n=s.anchorNode, a=n&&(n.nodeType===1?n:n.parentElement); a=a&&a.closest&&a.closest('a');
    if(a&&el.contains(a)){
      var href=a.getAttribute('href')||'';
      rbBusy=true; rbHide();
      pgAsk('Посилання · '+href.slice(0,40),'https://…',href,function(v){
        rbBusy=false; var u=rbUrl(v); if(!u){ plToast('Потрібна адреса сайту, напр. example.com'); return; }
        a.setAttribute('href',u); rbSave(el); });
      // «Скасувати» в шторці — просто зняти «зайнятість»
      setTimeout(function(){ var ov=document.querySelector('.pgask-ov'); if(!ov){ rbBusy=false; return; }
        var x=document.createElement('button'); x.className='c rb-unlink'; x.textContent='Прибрати посилання';
        x.onclick=function(){ ov.remove(); rbBusy=false; var p=a.parentNode; while(a.firstChild) p.insertBefore(a.firstChild,a); p.removeChild(a); rbSave(el); };
        var bt=ov.querySelector('.pgask-b'); if(bt) bt.insertBefore(x,bt.firstChild);
        var obs=new MutationObserver(function(){ if(!ov.isConnected){ rbBusy=false; obs.disconnect(); } }); obs.observe(document.body,{childList:true}); },80);
      return; }
    if(s.isCollapsed){ try{ plToast('Виділи слова, які стануть посиланням'); }catch(_){} return; }
    var range=s.getRangeAt(0).cloneRange(); if(!el.contains(range.commonAncestorContainer)) return;
    rbBusy=true; rbHide();
    pgAsk('Посилання','https://…','',function(v){
      var u=rbUrl(v); rbBusy=false; if(!u){ plToast('Потрібна адреса сайту, напр. example.com'); return; }
      el.focus(); var s2=window.getSelection(); s2.removeAllRanges(); s2.addRange(range);
      document.execCommand('createLink',false,u); rbSave(el);
    });
    setTimeout(function(){ var ov=document.querySelector('.pgask-ov'); if(!ov){ rbBusy=false; return; }
      var obs=new MutationObserver(function(){ if(!ov.isConnected){ rbBusy=false; obs.disconnect(); } }); obs.observe(document.body,{childList:true}); },80);
  }
  // Aa: тип рядка + стиль заголовка
  var RB_TYPES=[['note','Текст'],['h1','Заголовок 1'],['h2','Заголовок 2'],['h3','Заголовок 3'],['bullet','Список'],['num','Нумерований'],['task','Завдання'],['toggle','Тогл']];
  function rbAaClose(){ if(rbAa){ rbAa.remove(); rbAa=null; } }
  function rbAaOpen(el){
    if(rbAa){ rbAaClose(); return; }
    var lc=locate(el.dataset.edit); if(!lc) return;
    rbAa=document.createElement('div'); rbAa.className='pg-rbaa'; rbAa.setAttribute('role','menu'); pgMenuTheme(rbAa);
    rbAa.innerHTML=RB_TYPES.map(function(t){ return '<button type="button" role="menuitemradio" aria-checked="'+(lc.block.type===t[0])+'" class="'+(lc.block.type===t[0]?'on':'')+'" data-rbt="'+t[0]+'">'+t[1]+'</button>'; }).join('');
    document.body.appendChild(rbAa);
    var br=rbBar.getBoundingClientRect();
    rbAa.style.left=Math.max(8,br.left)+'px'; rbAa.style.top=Math.max(8,br.top-rbAa.offsetHeight-8)+'px';
    rbAa.addEventListener('pointerdown',function(e){ e.preventDefault(); });
    rbAa.addEventListener('mousedown',function(e){ e.preventDefault(); });
    rbAa.addEventListener('click',function(e){ var b=e.target.closest('[data-rbt]'); if(!b) return;
      var l2=locate(el.dataset.edit); if(!l2) return; rbSave(el);
      var to=b.dataset.rbt, id=l2.block.id;
      // у заголовку оформлення всередині нема — позначки прибираємо, щоб не світились зірочки
      if(!TX_RICH[to]) setTxt(l2.block,txPlainKeep(txtOf(l2.block)));   // адреса посилання лишається текстом у дужках
      l2.block.type=to; if(to==='task'&&l2.block.done==null) l2.block.done=false;
      rbAaClose(); save(); render(); var ne=editor.querySelector('[data-edit="'+id+'"]'); if(ne) caretEnd(ne); });
  }
  document.addEventListener('pointerdown',function(e){ if(rbAa&&!rbAa.contains(e.target)&&!rbBar.contains(e.target)) rbAaClose(); },true);

  // поле втратило фокус — набрані руками **…** одразу стають жирним (показ з позначок)
  editor.addEventListener('focusout',function(e){
    if(rbBusy) return;
    var el=e.target&&e.target.closest&&e.target.closest('[data-edit]'); if(!el) return;
    var lc=locate(el.dataset.edit); if(!lc||!txIsRich(lc.block)) return;
    var h=txRich(lc.block); if(el.innerHTML!==h) el.innerHTML=h;
    setTimeout(function(){ if(!rbField()) rbHide(); },0);
  });
  // клавіші компʼютера
  editor.addEventListener('keydown',function(e){
    if(!(e.metaKey||e.ctrlKey)||e.altKey) return;
    var el=rbField(); if(!el) return; rbEl=el;
    var k=(e.key||'').toLowerCase();
    if(e.shiftKey&&k==='x'){ e.preventDefault(); rbDo('s'); }
    else if(e.shiftKey&&k==='h'){ e.preventDefault(); rbDo('hl'); }
    else if(!e.shiftKey&&k==='k'){ e.preventDefault(); rbDo('ln'); }
    else if(!e.shiftKey&&(k==='b'||k==='i')){ e.preventDefault(); rbDo(k); }
  });
  // швидкі набори на початку рядка «Текст»
  var RB_MD=[[/^###\s/,'h3'],[/^##\s/,'h2'],[/^#\s/,'h1'],[/^[-*•]\s/,'bullet'],[/^1[.)]\s/,'num'],[/^\[\s?\]\s/,'task']];
  editor.addEventListener('input',function(e){
    var el=e.target&&e.target.closest&&e.target.closest('[data-edit]'); if(!el) return;
    var lc=locate(el.dataset.edit); if(!lc||lc.block.type!=='note') return;
    var raw=el.textContent||'';
    // лише рядок, де є тільки сам набір (щойно надрукований), — старий текст «- …» не перетворюється сам
    for(var i=0;i<RB_MD.length;i++){ var m=RB_MD[i][0].exec(raw); if(!m||raw.replace(/\u00a0/g,' ')!==m[0].replace(/\u00a0/g,' ')) continue;
      var to=RB_MD[i][1], rest=txtOf(lc.block).replace(RB_MD[i][0],'');
      setTxt(lc.block,TX_RICH[to]?rest:txPlainKeep(rest)); lc.block.type=to; if(to==='task') lc.block.done=false;
      var id=lc.block.id; save(); render(); var ne=editor.querySelector('[data-edit="'+id+'"]'); if(ne) caretEnd(ne);
      return; }
  });
  // вставка й перетягування: чужий HTML → позначки → наш HTML; кілька рядків лишаються переносами
  // (перетягнутий шматок сторінки інакше жив би в полі сирим — з чужими картинками, що вантажаться з мережі)
  editor.addEventListener('drop',rbIn);
  editor.addEventListener('paste',rbIn);
  function rbIn(e){
    var el=e.target&&e.target.closest&&e.target.closest('[data-edit]'); if(!el) return;
    var lc=locate(el.dataset.edit); if(!lc||!txIsRich(lc.block)) return;
    var cd=e.type==='drop'?e.dataTransfer:e.clipboardData; if(!cd) return;
    if(e.type==='drop'&&document.caretRangeFromPoint){ try{ var cr=document.caretRangeFromPoint(e.clientX,e.clientY); if(cr){ el.focus(); var sd=window.getSelection(); sd.removeAllRanges(); sd.addRange(cr); } }catch(_){} }
    var html=cd.getData('text/html'), plain=cd.getData('text/plain');
    if(!html&&!plain) return;
    e.preventDefault();
    var marks=html?txFromHTML(html):plain;
    if(!marks.trim()) marks=plain||'';
    document.execCommand('insertHTML',false,txHTML(marks).replace(/\n/g,'<br>'));
    rbSave(el);
  }
  // тап по посиланню в тексті: поки курсора в полі нема — відкрити адресу (інакше це просто текст для редагування)
  var rbPre=null;   // що було у фокусі ДО дотику: сам дотик уже переносить фокус у поле
  editor.addEventListener('pointerdown',function(){ rbPre=document.activeElement; },true);
  editor.addEventListener('click',function(e){
    /* фішка дати, суми чи @папки: картка з дією (64-rich-text.js txChipCard); поки пишеш у полі — це просто текст */
    var ch=e.target&&e.target.closest&&e.target.closest('[data-edit] .tx-chip');
    if(ch){ var cf=ch.closest('[data-edit]'); if(rbPre!==cf){ e.preventDefault(); e.stopPropagation(); if(typeof txChipCard==='function') txChipCard(ch,typeof wgCtxFolder==='function'?wgCtxFolder():''); } return; }   /* картка — поки фішка ще в полі; фокус забирає сама картка */
    var a=e.target&&e.target.closest&&e.target.closest('[data-edit] a.tx-a, [data-edit] a[href]'); if(!a) return;
    var ce=a.closest('[data-edit]'); if(rbPre===ce&&!(e.metaKey||e.ctrlKey)) return;
    var u=a.getAttribute('href')||''; if(!TX_URL.test(u)) return;
    e.preventDefault();
    // справжній сайт — у підказці: підпис посилання може вдавати іншу адресу
    try{ var host=/^mailto:/i.test(u)?u.slice(7):new URL(u).host; plToast('Відкриваю '+host); }catch(_){}
    try{ window.open(u,'_blank','noopener'); }catch(_){}
  },true);
