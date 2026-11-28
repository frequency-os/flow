  /* оформлений текст у полі (19.11.2026): позначки → <b> <i> <s> <mark> <a>, усе інше екрановано (core/64-rich-text.js) */
  function txRich(b){ try{ if(typeof txHTML==='function'){ var h=txHTML(txtOf(b)); return typeof txChips==='function'?txChips(h):h; } }catch(_){} return esc(txtOf(b)); }   /* + фішки дат, сум і @папок (лише показ) */
  function txIsRich(b){ return !!(b&&typeof TX_RICH!=='undefined'&&TX_RICH[b.type]); }

  /* ── Пости з соцмереж (27.11.2026, етап 1 — без мережі) ──
     Мережу, тип і автора дістаємо лише з самої адреси: сторінку поста
     не завантажуємо (браузер не пустить через CORS — це етап 2, воркер).
     Обкладинка — власне фото (скрін поста), лежить у блоці полем cover. */
  var PG_NETS=[
    [/(^|\.)instagram\.com$/,'Instagram','IG','#c13584'],
    [/(^|\.)(tiktok\.com)$/,'TikTok','TT','#25232b'],
    [/(^|\.)(youtube\.com|youtu\.be)$/,'YouTube','YT','#d93025'],
    [/(^|\.)threads\.(net|com)$/,'Threads','Th','#3a3a40'],
    [/(^|\.)(x\.com|twitter\.com)$/,'X','X','#2b2b30'],
    [/(^|\.)(t\.me|telegram\.me)$/,'Telegram','TG','#2a9fd6'],
    [/(^|\.)(facebook\.com|fb\.watch)$/,'Facebook','FB','#1877f2'],
    [/(^|\.)(pinterest\.[a-z.]+|pin\.it)$/,'Pinterest','P','#e60023'],
    [/(^|\.)linkedin\.com$/,'LinkedIn','in','#0a66c2'],
    [/(^|\.)reddit\.com$/,'Reddit','R','#ff4500'],
    [/(^|\.)spotify\.com$/,'Spotify','S','#1db954']
  ];
  var PG_NOT_AUTHOR={p:1,reel:1,reels:1,tv:1,stories:1,explore:1,i:1,home:1,search:1,watch:1,shorts:1,embed:1,channel:1,c:1,share:1,video:1,s:1,login:1,hashtag:1,pin:1,r:1,in:1,company:1,feed:1,groups:1,events:1};
  function pgYtId(u){ var m=String(u||'').match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([\w-]{11})/); return m?m[1]:''; }
  function pgSocial(u){
    var h=safeHref(u); if(!h||!/^https?:\/\//i.test(h)) return null;
    var url; try{ url=new URL(h); }catch(_){ return null; }
    var host=url.hostname.toLowerCase().replace(/^(www|m|vm|vt|mobile)\./,'');
    var seg=url.pathname.split('/').filter(Boolean).map(function(s){ try{ return decodeURIComponent(s); }catch(_){ return s; } });
    var net=null; for(var i=0;i<PG_NETS.length;i++){ if(PG_NETS[i][0].test(host)){ net=PG_NETS[i]; break; } }
    var r={host:host, n:net?net[1]:host, a:net?net[2]:(host.charAt(0)||'•').toUpperCase(), c:net?net[3]:'', kind:'', author:'', yt:'', social:!!net};
    var s0=seg[0]||'', s1=seg[1]||'';
    var who=function(x){ x=String(x||'').replace(/^@/,''); return /^[\w.\-]{1,40}$/.test(x)&&!PG_NOT_AUTHOR[x.toLowerCase()]?x:''; };
    if(!net){ r.kind=''; return r; }
    switch(net[1]){
      case 'Instagram':
        if(s0==='reel'||s0==='reels'||s0==='tv') r.kind='reels'; else if(s0==='p') r.kind='пост'; else if(s0==='stories'){ r.kind='сторіс'; r.author=who(s1); }
        else { r.author=who(s0); if(s1==='reel'||s1==='p') r.kind=s1==='p'?'пост':'reels'; else if(r.author) r.kind='профіль'; }
        break;
      case 'TikTok':
        if(s0.charAt(0)==='@'){ r.author=who(s0); r.kind=s1==='video'?'відео':(s1==='photo'?'фото':'профіль'); } else r.kind='відео';
        break;
      case 'YouTube':
        r.yt=pgYtId(h); r.kind=s0==='shorts'?'Shorts':(r.yt?'відео':'');
        if(s0.charAt(0)==='@'){ r.author=who(s0); if(!r.yt) r.kind='канал'; }
        break;
      case 'Threads': case 'X':
        r.author=who(s0); r.kind=(s1==='post'||s1==='status')?'пост':(r.author?'профіль':'');
        break;
      case 'Telegram':
        if(s0==='s'){ r.author=who(s1); r.kind=/^\d+$/.test(seg[2]||'')?'пост':'канал'; }
        else { r.author=who(s0); r.kind=/^\d+$/.test(s1)?'пост':(r.author?'канал':''); }
        break;
      case 'Spotify':   /* open.spotify.com/intl-uk/track/… — мовну частину пропускаємо */
        var sp=/^intl-/.test(s0)?s1:s0;
        r.kind={track:'трек',album:'альбом',playlist:'плейлист',episode:'епізод',show:'подкаст',artist:'виконавець'}[sp]||'';
        break;
      default:
        r.kind='';
    }
    return r;
  }
  /* рядок, у якому лише адреса (або позначка-посилання на саму адресу) → адреса; інакше '' */
  function pgUrlOnly(t){
    var s=String(t==null?'':t).trim();
    var m=/^\[([^\]\n]{1,300})\]\(((?:https?:\/\/)[^\s)<>"'`]{1,800})\)$/i.exec(s);
    if(m) s=m[2];
    if(!/^https?:\/\/[^\s<>"'`]{3,800}$/i.test(s)) return '';
    return safeHref(s)?s:'';
  }
  /* підтип «Вкладення» за адресою — той самий, що й у полі адреси блоку */
  function pgAttSub(v){
    if(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/))[\w-]{11}/.test(v)) return 'video';
    if(/\.(mp3|m4a|wav|ogg|aac)(\?|#|$)/i.test(v)) return 'audio';
    return 'link';
  }
  function pgLinkCard(b,id){
    var u=b.url||'', s=pgSocial(u)||{n:'Посилання',a:'•',c:'',kind:'',author:'',yt:'',social:false};
    var go=safeHref(u), cov=b.cover&&/^(data:image\/|idb:)/.test(String(b.cover))?safeImg(b.cover):'';
    var who=s.author?'@'+s.author:s.n, sub=s.author?s.n+(s.kind?' · '+s.kind:''):(s.kind||(s.social?'':'сайт'));
    var media='';
    if(cov) media='<div class="pgsc-cv"><img src="'+esc(cov)+'" alt="" decoding="async" loading="lazy"></div>';
    else if(s.yt) media=b.play
      ? '<div class="pgem pgsc-em"><iframe src="https://www.youtube.com/embed/'+s.yt+'?autoplay=1&playsinline=1" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>'
      : '<button class="pgem pgem-th pgsc-em" data-pgemplay="'+id+'" aria-label="Дивитись відео" style="background-image:url(\'https://i.ytimg.com/vi/'+s.yt+'/hqdefault.jpg\')"><span class="pgem-p">▶</span></button>';
    var hasNote=b.note!=null;
    return '<div class="pg-content"><div class="pgsc'+(s.social?' soc':'')+'"'+(s.c?' style="--nc:'+s.c+'"':'')+'>'
      +'<div class="pgsc-h"><span class="pgsc-b" aria-hidden="true">'+esc(s.a)+'</span>'
      +'<div class="pgsc-m"><b data-i18n-skip="1">'+esc(who)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div>'
      +(go?'<a class="pgsc-go" href="'+esc(go)+'" target="_blank" rel="noopener" aria-label="Відкрити">↗</a>':'')+'</div>'
      +media
      +'<div class="pgsc-t pg-empty" contenteditable="true" data-ph="Назва (необовʼязково)…" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
      +(b.desc?'<div class="pgsc-d" data-i18n-skip="1">'+esc(b.desc)+'</div>':'')
      +(hasNote?'<div class="pgsc-n pg-empty" contenteditable="true" data-ph="Нотатка: чим це корисне…" data-pglknote="'+id+'">'+esc(b.note||'')+'</div>':'')
      +'<div class="pgsc-a">'
        +(hasNote?'':'<button data-pglknoteadd="'+id+'">＋ Нотатка</button>')
        +'<button data-pglkcover="'+id+'">'+(cov?'Змінити фото':'＋ Фото')+'</button>'
        +(cov?'<button data-pglkcoverdel="'+id+'">Прибрати фото</button>':'')
        +'<button data-pglkurl="'+id+'">Змінити посилання</button>'
        +(go&&/^https?:/i.test(go)?'<button data-pglkpv="'+id+'">'+(b.pvAt?'Оновити прев\'ю':'Підтягнути прев\'ю')+'</button>':'')
      +'</div></div></div>';
  }
  function equalizeWidths(cols){ var n=cols.length||1; cols.forEach(function(c){ c.width=1/n; }); }

  /* ── стиль заголовка: колір / шрифт / контур / виділення, як в Instagram-текстах ── */
  var PGH_FONTS={serif:"'Lora',Georgia,serif",mono:"ui-monospace,'SF Mono',Menlo,monospace",script:"'Caveat',cursive"};
  /* Колір заголовка зберігається як hex з палітри (03-premium-pack.js). На світлому аркуші
     світлі відтінки зникали (білий — 1.1:1), тому малюємо через змінну: у темному документі
     діє сам hex, у світлому — темніша пара з 23-doc-readable.css. Дані не змінюються. */
  var PGH_CLR_VAR={'#f3f5f8':'white','#ff6b9d':'pink','#34c77b':'green','#f0b429':'amber','#6a7dff':'blue','#c77dff':'purple','#4ecdc4':'teal'};
  function headingClr(c){
    c=String(c||'').toLowerCase();
    if(!/^#[0-9a-f]{3,8}$/.test(c)) return '';
    return PGH_CLR_VAR[c] ? 'var(--pgh-'+PGH_CLR_VAR[c]+','+c+')' : c;
  }
  function headingStyle(b){
    var st='';
    if(Object.prototype.hasOwnProperty.call(PGH_FONTS,b.hfont)) st+='font-family:'+PGH_FONTS[b.hfont]+';';
    var hc=headingClr(b.hclr);
    if(b.hout){
      var oc=hc||'currentColor';
      st+='-webkit-text-stroke:1.3px '+oc+';-webkit-text-fill-color:transparent;paint-order:stroke fill;';
    } else if(hc){ st+='color:'+hc+';'; }
    return {style:st,cls:(b.hhl?' pgh-hl':'')};
  }

  // ── умовне відображення блоків (SPECblocksv2 §5.3) ──
  var pgShowHidden=false;
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
  /* дія може відмовитись (повернути false), щоб не загубити текст — тоді запис лишається на місці і нічого не пишемо */
  function doUndo(){ var op=undoStack.pop(); if(!op)return; if(op.undo()===false){ undoStack.push(op); syncUndoBtn(); return; } redoStack.push(op); save(); render(); syncUndoBtn(); }
  function doRedo(){ var op=redoStack.pop(); if(!op)return; if(op.redo()===false){ redoStack.push(op); syncUndoBtn(); return; } undoStack.push(op); save(); render(); syncUndoBtn(); }
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

  /* типи блоків, прибрані з коду 10.10.2026 (ізольовані, ні з чим у застосунку не повʼязані).
     Документи, де вони ще лежать, малюють замість них плашку з кнопкою «Прибрати». */
  var PG_GONE={journal:'Щоденник',decision:'Лог рішень',ptracker:'Проєкт-трекер',phub:'Проєкти',habits:'Трекер звичок',
    pbar:'Прогрес',chart:'Графік',progress:'Прогрес',kanban:'Канбан',contacts:'Контакти',caseline:'Таймлайн справи',
    wpult:'Пульт проєктів',wstack:'Фокус-стек',wpipe:'Пайплайн',wtline:'Таймлайн',wportal:'Портал'};
  function inner(b){
    var t=b.type,id=esc(b.id);   // id з даних іде в атрибути data-*=" " — екрануємо (звичайні id від uid() не змінюються)
    /* віджети «Гроші» (core/48-widgets.js) — живі плитки; старі фінансові віджети прибрано 09.10.2026 */
    if(typeof wgIs==='function'&&wgIs(t)) return '<div class="pg-content pgwg" data-wghost="'+id+'"></div>';
    /* трекер місії (старий блок calendar у її папці) — живий «Трекер цілі» (core/48-widgets.js wdTrkCal, 23.11.2026);
       якщо в папці вже є окремий віджет «Трекер цілі» цієї місії — ховаємо, щоб не було двох однакових */
    if(t==='calendar'&&typeof wdTrkCal==='function'){ var tfk=wgCtxFolder();
      if(wdTrkCal(b,tfk)) return wdTrkDup(tfk)?'<div class="pg-content pgtrk-hid" hidden></div>':'<div class="pg-content pgwg" data-wghost="'+id+'"></div>'; }
    var PG_OLD_FIN={fin:'Фінанси',envelope:'Конверт',project:'Проєкт',festival:'Фестиваль',kpi:'KPI'};
    if(PG_OLD_FIN[t]) return '<div class="pg-content"><div class="pg-oldw">🗂 Старий віджет «'+PG_OLD_FIN[t]+'» — прибирається в <b>Ще → Дані → Старі віджети</b>. Нові — у меню «/» → Гроші.</div></div>';
    /* прибрані 10.10.2026 ізольовані блоки — у старих документах лишається плашка з «Прибрати» */
    if(Object.prototype.hasOwnProperty.call(PG_GONE,t)) return '<div class="pg-content"><div class="pg-oldw">Старий блок «'+PG_GONE[t]+'» — більше не підтримується. <button type="button" class="pg-oldw-rm" data-pgoldrm="'+id+'">Прибрати</button></div></div>';
    /* нотатка = суцільний абзац на аркуші, без рамок */
    if(t==='note'||t==='quick')return '<div class="pg-content pg-empty" contenteditable="true" data-ph="Пишіть…" data-edit="'+id+'">'+(t==='quick'?esc(txtOf(b)):txRich(b))+'</div>';   /* quick пишеться як простий текст — без оформлення */
    if(t==='h1'){var hs1=headingStyle(b);return '<div class="pg-content pgc-h1'+hs1.cls+' pg-empty" style="'+hs1.style+'" contenteditable="true" data-ph="Заголовок 1" data-edit="'+id+'">'+esc(b.text||b.title||'')+'</div>';}
    if(t==='h2'){var hs2=headingStyle(b);return '<div class="pg-content pgc-h2'+hs2.cls+' pg-empty" style="'+hs2.style+'" contenteditable="true" data-ph="Заголовок 2" data-edit="'+id+'">'+esc(b.text||b.title||'')+'</div>';}
    if(t==='h3'){var hs3=headingStyle(b);return '<div class="pg-content pgc-h3'+hs3.cls+' pg-empty" style="'+hs3.style+'" contenteditable="true" data-ph="Заголовок 3" data-edit="'+id+'">'+esc(b.text||b.title||'')+'</div>';}
    if(t==='quote')return '<div class="pg-content pgc-quote pg-empty" contenteditable="true" data-ph="Цитата…" data-edit="'+id+'">'+txRich(b)+'</div>';
    if(t==='glass')return '<div class="pg-content"><div class="pgc-glass"><div class="pg-empty" contenteditable="true" data-ph="Напиши щось — зʼявиться на склі…" data-edit="'+id+'">'+txRich(b)+'</div></div></div>';
    if(t==='callout')return '<div class="pg-content pgc-callout"><span class="clx">'+esc(b.emo||'💡')+'</span><div class="cltx pg-empty" contenteditable="true" data-ph="Виноска…" data-edit="'+id+'">'+txRich(b)+'</div></div>';
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
    if(t==='task')return '<div class="pg-content"><div class="pg-todo '+(b.done?'done':'')+'"><div class="box" data-pgtodo="'+id+'">'+(b.done?'✓':'')+'</div><div class="tx pg-empty" contenteditable="true" data-ph="Завдання…" data-edit="'+id+'">'+txRich(b)+'</div></div></div>';
    if(t==='bullet')return '<div class="pg-content"><div class="pg-bul"><span class="dot"></span><div class="tx pg-empty" contenteditable="true" data-ph="Пункт…" data-edit="'+id+'">'+txRich(b)+'</div></div></div>';
    if(t==='num')return '<div class="pg-content"><div class="pg-num"><span class="n" data-pgnum>1.</span><div class="tx pg-empty" contenteditable="true" data-ph="Пункт…" data-edit="'+id+'">'+txRich(b)+'</div></div></div>';
    if(t==='toggle')return '<div class="pg-content pg-tg '+(b.open?'open':'')+'"><div class="tgh"><span class="tga" data-pgtoggle="'+id+'">▸</span><div class="tgt pg-empty" contenteditable="true" data-ph="Тогл…" data-edit="'+id+'">'+txRich(b)+'</div></div><div class="tgb"><div data-pgchild="'+id+'"></div></div></div>';
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
        if(emVid) return pgLinkCard(b,id);   /* YouTube — картка поста з мініатюрою (27.11.2026) */
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
      if(safeHref(_au)) return pgLinkCard(b,id);   /* є адреса — картка поста/сайту (27.11.2026) */
      return '<div class="pg-content"><div class="pglk"><span class="pglk-ic">'+pgsIc('link')+'</span>'
        +'<div class="pglk-b"><div class="pglk-t pg-empty" contenteditable="true" data-ph="Назва…" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
        +'<input class="pglk-u" type="url" inputmode="url" placeholder="Встав посилання (YouTube / mp3 / будь-що)…" value="'+esc(_au)+'" data-pglink="'+id+'"></div>'
        +'<button class="pgf-x" data-pgattfile="'+id+'" title="Або прикріпити файл">📎</button>'
        +(safeHref(_au)?'<a class="pglk-go" href="'+esc(safeHref(_au))+'" target="_blank" rel="noopener">↗</a>':'')   /* лише http(s)/mailto (SEC-6) */
        +'</div></div>';
    }
    if(t==='fold')return fdHTML(b);   /* «Папка» (05-fold.js) */
    if(t==='subs')return sbHTML(b);   /* «Підпапки» — стрічка-сторіс (05-fold.js) */
    if(t==='tbl')return tbHTML(b);   /* «Таблиця» (04-table.js) */
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
      if(safeHref(u)) return pgLinkCard(b,id);
      return '<div class="pg-content"><div class="pglk">'
        +'<span class="pglk-ic">'+pgsIc('link')+'</span>'
        +'<div class="pglk-b"><div class="pglk-t pg-empty" contenteditable="true" data-ph="Назва посилання…" data-edit="'+id+'">'+esc(b.title||'')+'</div>'
        +'<input class="pglk-u" type="url" inputmode="url" placeholder="https://…" value="'+esc(u)+'" data-pglink="'+id+'"></div>'
        +(safeHref(u)?'<a class="pglk-go" href="'+esc(safeHref(u))+'" target="_blank" rel="noopener">↗</a>':'')   /* лише http(s)/mailto (SEC-6) */
        +'</div></div>';
    }
    /* вже вставлені віджети/проєктні блоки показуємо чипом (у меню їх поки нема) */
    /* віджети та проєктні блоки — ЖИВІ тайли дошки прямо на сторінці */
    var PG_TILE_TYPES={calendar:1,wplanday:1,wplanmonth:1};
    if(PG_TILE_TYPES[t]) return '<div class="pg-content pgwidget" data-pgwhost="'+id+'"></div>';
    /* невідомі типи — інформативний чип */
    var PGS_WCHIP={
      calendar:{t:'Календар',d:'Місяць з відмітками',c:'#5b8def',ic:'calendar'},
      wplanday:{t:'План на день',d:'Точки проєкту сьогодні',c:'#6a7dff',ic:'calendar'},
      wplanmonth:{t:'План на місяць',d:'Календар точок проєкту',c:'#8b5cf6',ic:'calendar'}
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
      if(b.bw===33||b.bw===50||b.bw===67){ row.dataset.bw=b.bw; if(b.al==='c'||b.al==='r') row.dataset.al=b.al; }   /* «Розташування й колонки» */
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
    /* wboard — дошка віджетів «Дані»: на телефоні 2 колонки, як віджети iPhone (CSS 32-widgets.css) */
    var wrap=document.createElement('div'); wrap.className='pg-board'+(rb.wboard?' wboard':'')+(rb.wboard&&window.__wbEdit===rb.id?' wb-edit':''); wrap.dataset.id=rb.id;
    var items=Array.isArray(rb.children)?rb.children:[];
    items.forEach(function(it){
      if(!condMet(it)&&!pgShowHidden) return;
      var cell=document.createElement('div'); cell.className='pg-bitem'+(!condMet(it)?' pg-condhidden':'');
      cell.style.setProperty('--gw',it.gw||4); cell.style.setProperty('--gh',it.gh||2);
      /* віджети «Дані» мають розміри S/M/L — ширину на телефоні й ноуті задає CSS за data-sz */
      if(typeof wdIs==='function'&&wdIs(it.type)) cell.dataset.sz=wdSz(it);
      /* дошка віджетів (19.11.2026): розмір — клітинки, свій на телефоні (4 колонки) і компʼютері (8), CSS 41-widget-sheet.css */
      if(rb.wboard&&typeof wdCell==='function'&&(wdIs(it.type)||wgHasSettings(it.type)&&it.ws)){
        var cm=wdCell(it,'m'), cd=wdCell(it,'d');
        cell.dataset.sz=wdSz(it);
        cell.style.setProperty('--wcm',cm[0]); cell.style.setProperty('--whm',cm[1]); cell.style.setProperty('--wcd',cd[0]); cell.style.setProperty('--whd',cd[1]);
        cell.classList.add('wb-cell');
      }
      renderList([it],cell);
      if(cell.classList.contains('wb-cell')){
        var wx=document.createElement('button'); wx.className='wb-x'; wx.dataset.wbx=it.id; wx.setAttribute('aria-label','Прибрати віджет');
        wx.innerHTML='<span>✕</span>'; cell.appendChild(wx);
      }
      var rz=document.createElement('span'); rz.className='pg-brz'; rz.dataset.pgboardrz=it.id; rz.textContent='◢';
      cell.appendChild(rz);
      wrap.appendChild(cell);
    });
    host.appendChild(wrap);
    var foot=document.createElement('div'); foot.className='pg-bfoot';
    var ed=rb.wboard&&window.__wbEdit===rb.id;
    foot.innerHTML='<button class="pg-badd" data-pgboardadd="'+esc(rb.id)+'">'+(rb.wboard?'＋ Віджет':'＋ Віджет у дошку')+'</button>'
      +(rb.wboard&&items.length?'<button class="wb-ed'+(ed?' on':'')+'" data-wbed="'+esc(rb.id)+'" aria-pressed="'+ed+'">'+(ed?'Готово':'Змінити')+'</button>':'')
      +'<button class="pg-rowdel" data-pgrowdel="'+esc(rb.id)+'" title="Видалити дошку">✕</button>';
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
    /* Лише хлібний рядок при вкладеності.
       Чипи «Сторінка · N блоків · ред. дата · + обкладинка» і рядок просторів
       прибрано 05.09.2026: теми й обкладинка тепер живуть у Каналі папки
       (core/35-channel.js), а тут вони дублювали назву і займали верх аркуша. */
    var out=document.createDocumentFragment();
    if(pgPath.length){
      var r=pgResolve(), c=r.cont;
      var nav=document.createElement('div'); nav.className='pgnav';
      nav.innerHTML='<button class="pgnav-b" data-pgup>‹</button>'
        +'<span class="pgnav-e">'+esc((c&&c.emoji)||(c&&c.type==='page'?'📄':'📁'))+'</span>'
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
    if(!arr || !arr.length){
      /* порожня сторінка — «чистий аркуш» (15.11.2026, варіант A «Пустота»): лише бліде
         «Почни писати…» на місці першого рядка. Рамку з «Текст · Завдання · Картка · Ще…»
         прибрано: ті самі дії вже є в нижньому полі (＋ і перемикач типу рядка). */
      var empty=document.createElement('div');
      empty.className='pg-es-quiet';
      empty.setAttribute('role','button'); empty.tabIndex=0;
      empty.textContent='Почни писати…';
      empty.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); empty.click(); } });
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
    try{ if(typeof wgFillPage==='function') wgFillPage(editor); }catch(_){}   // віджети «Гроші»
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
    var txt=txIsRich(loc.block)&&typeof txFromDom==='function'?txFromDom(el):el.textContent;
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
  /* магазин блоків (core/62-block-store.js): у меню лише взяті; базові блоки поза магазином — завжди */
  function pgsGotOk(i){ try{ return typeof window.bsGot!=='function'||window.bsGot(i.k); }catch(_){ return true; } }
  function pgsMatch(i,f){
    if(i.t.toLowerCase().includes(f)||i.d.toLowerCase().includes(f)) return true;
    var syn=PGS_SYN[i.k];
    if(syn) for(var s=0;s<syn.length;s++){ if(syn[s].toLowerCase().includes(f)) return true; }
    return false;
  }
  // скільки невзятих блоків цього розділу (чи пошуку) лежить у магазині — для рядка «Ще … в Магазині»
  function pgsHiddenN(f){ f=(f||'').toLowerCase().trim();
    return CATALOG.filter(function(i){ return !pgsGotOk(i)&&(f?pgsMatch(i,f):i.cat===pgsCat); }).length; }
  function pgsShopOpen(){ try{ closeSlash(); }catch(_){} try{ if(typeof window.bsOpen==='function') window.bsOpen({}); }catch(_){} }
  function pgsFiltered(f){
    f=(f||'').toLowerCase().trim();
    if(f) return CATALOG.filter(function(i){ return pgsGotOk(i)&&pgsMatch(i,f); });
    return CATALOG.filter(function(i){return i.cat===pgsCat&&pgsGotOk(i);});
  }
  function buildRail(){
    srail.innerHTML='';
    PGS_CATS.forEach(function(c){
      var el=document.createElement('div');el.className='pgst-cat'+(pgsCat===c.id?' on':'');
      el.innerHTML=pgsIc(c.ic)+c.t;
      el.onclick=function(){pgsCat=c.id;ssearch.value='';buildSlash('');};
      srail.appendChild(el);
    });
    var shop=document.createElement('div'); shop.className='pgst-cat pgs-shop';
    var nn=0; try{ nn=typeof window.bsNewCount==='function'?window.bsNewCount():0; }catch(_){}
    shop.innerHTML='🛍 Магазин'+(nn?'<b>'+nn+'</b>':''); shop.setAttribute('role','button'); shop.tabIndex=0;
    shop.onclick=pgsShopOpen; shop.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pgsShopOpen(); } };
    srail.appendChild(shop);
  }
  function buildSlash(f){
    pgsShown=pgsFiltered(f); pgsSel=0;
    buildRail(); slist.innerHTML='';
    if(!f&&pgsCat==='base'){
      var rk=pgRecentGet();
      var recentItems=rk.map(function(k){return CATALOG.filter(function(c){return c.k===k;})[0];}).filter(function(i){ return i&&pgsGotOk(i); });
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
    var hid=pgsHiddenN(f);
    if(hid){ var more=document.createElement('div'); more.className='pg-sitem pgs-more'; more.setAttribute('role','button'); more.tabIndex=0;
      more.textContent='＋ Ще '+hid+' '+(typeof pluralUk==='function'?pluralUk(hid,'блок','блоки','блоків'):'блоків')+' в Магазині ›';
      more.onclick=function(e){ e.stopPropagation(); pgsShopOpen(); }; slist.appendChild(more); }
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
  });

