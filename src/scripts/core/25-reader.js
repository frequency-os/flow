  /* ============================================================
     ЧИТАЛКА КНИГ  (TXT, MD, EPUB, PDF)
     — файли книг лежать у IndexedDB (мегабайти, офлайн, не в CloudStorage)
     — у блоці board зберігаються лише метадані: прогрес, закладки, налаштування
     ============================================================ */
  const BookDB=(function(){
    const DB='flow_books', STORE='books'; let _db=null;
    function open(){
      return new Promise((res,rej)=>{
        if(_db) return res(_db);
        if(!window.indexedDB) return rej(new Error('no-idb'));
        const r=indexedDB.open(DB,1);
        r.onupgradeneeded=()=>{ const db=r.result; if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE); };
        r.onsuccess=()=>{ _db=r.result; res(_db); };
        r.onerror=()=>rej(r.error||new Error('idb-open'));
      });
    }
    return {
      async put(id,blob){ const db=await open(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(blob,id); tx.oncomplete=()=>res(true); tx.onerror=()=>rej(tx.error); }); },
      async get(id){ const db=await open(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readonly'); const rq=tx.objectStore(STORE).get(id); rq.onsuccess=()=>res(rq.result||null); rq.onerror=()=>rej(rq.error); }); },
      async del(id){ try{ const db=await open(); return new Promise(res=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).delete(id); tx.oncomplete=()=>res(true); tx.onerror=()=>res(false); }); }catch(_){ return false; } }
    };
  })();

  /* ============ DocDB — сховище файлів документів агенції (IndexedDB) ============ */
  const DocDB=(function(){
    const DB='flow_docs', STORE='docs'; let _db=null;
    function open(){
      return new Promise((res,rej)=>{
        if(_db) return res(_db);
        if(!window.indexedDB) return rej(new Error('no-idb'));
        const r=indexedDB.open(DB,1);
        r.onupgradeneeded=()=>{ const db=r.result; if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE); };
        r.onsuccess=()=>{ _db=r.result; res(_db); };
        r.onerror=()=>rej(r.error||new Error('idb-open'));
      });
    }
    return {
      async put(id,blob){ const db=await open(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(blob,id); tx.oncomplete=()=>res(true); tx.onerror=()=>rej(tx.error); }); },
      async get(id){ const db=await open(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readonly'); const rq=tx.objectStore(STORE).get(id); rq.onsuccess=()=>res(rq.result||null); rq.onerror=()=>rej(rq.error); }); },
      async del(id){ try{ const db=await open(); return new Promise(res=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).delete(id); tx.oncomplete=()=>res(true); tx.onerror=()=>res(false); }); }catch(_){ return false; } }
    };
  })();

  // прикріпити файл до документа клієнта: doc — обʼєкт {id,text,done,...}
  function agAttachFile(c, doc){
    const inp=document.createElement('input'); inp.type='file';
    inp.accept='image/*,application/pdf,.doc,.docx';
    inp.onchange=async()=>{
      const f=inp.files&&inp.files[0]; if(!f) return;
      if(f.size>12*1024*1024){ try{flowAlert('Файл завеликий (макс 12 МБ)');}catch(_){}; return; }
      const fid='doc_'+c.id+'_'+doc.id+'_'+Date.now();
      try{
        await DocDB.put(fid, f);
        doc.fileId=fid; doc.fileName=f.name; doc.fileType=f.type||''; doc.fileSize=f.size;
        if(!doc.done) doc.done=true; // прикріпив файл → документ вважається наданим
        saveBoard(); renderClient();
        try{ window.platform.haptic('success'); }catch(_){}
      }catch(e){ try{flowAlert('Не вдалося зберегти файл');}catch(_){} }
    };
    inp.click();
  }
  // прикріпити файл із бібліотеки: створює новий документ у цього клієнта + завантажує файл
  function agAttachFromLibrary(c){
    // збираємо всі файли з усіх ІНШИХ клієнтів
    const pool=[];
    agClients().forEach(oc=>{ (oc.docs||[]).forEach(d=>{ if(d.fileId){ pool.push({oc, d}); } }); });
    const items=[{ic:'⬆️', label:'Завантажити новий файл', onClick:()=>{
      inputModal({title:'Назва документа', placeholder:'Напр. Паспорт', onOk:(t)=>{ if(!(t||'').trim())return;
        const nd={id:'d'+Date.now(),text:t.trim(),done:false}; (c.docs=c.docs||[]).push(nd); saveBoard(); agAttachFile(c,nd); }});
    }}];
    // додаємо посилання на наявні (копіює метадані, файл шариться за тим самим fileId)
    pool.slice(0,15).forEach(({oc,d})=>{ if(oc.id===c.id) return;
      items.push({ic:agFileIcon(d.fileType), label:(d.fileName||'файл')+' — '+oc.name, onClick:()=>{
        const nd={id:'d'+Date.now()+Math.random().toString(36).slice(2,4), text:d.text||d.fileName||'документ', done:true,
          fileId:d.fileId, fileName:d.fileName, fileType:d.fileType, fileSize:d.fileSize, sharedFrom:oc.id};
        (c.docs=c.docs||[]).push(nd); saveBoard(); renderClient();
        try{ window.platform.haptic('success'); }catch(_){}
      }});
    });
    actionSheet({title:'Прикріпити файл', sub:'Новий або з бібліотеки', items});
  }
  // відкрити / скачати файл документа
  async function agOpenFile(doc){
    if(!doc.fileId) return;
    try{
      const blob=await DocDB.get(doc.fileId);
      if(!blob){ try{flowAlert('Файл не знайдено');}catch(_){}; return; }
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download=doc.fileName||'document';
      // спершу пробуємо відкрити у новій вкладці (для перегляду), інакше — завантаження
      const isImg=/^image\//.test(doc.fileType||''); const isPdf=/pdf/i.test(doc.fileType||'');
      if(isImg||isPdf){ window.open(url,'_blank'); } else { a.click(); }
      setTimeout(()=>URL.revokeObjectURL(url), 60000);
    }catch(e){ try{flowAlert('Помилка відкриття файлу');}catch(_){} }
  }
  async function agRemoveFile(c, doc){
    if(!doc.fileId) return;
    const fid=doc.fileId;
    delete doc.fileId; delete doc.fileName; delete doc.fileType; delete doc.fileSize; delete doc.sharedFrom;
    // видаляємо blob лише якщо його більше ніхто не використовує
    let stillUsed=false;
    agClients().forEach(cl=>{ (cl.docs||[]).forEach(d=>{ if(d.fileId===fid) stillUsed=true; }); });
    if(!stillUsed){ try{ await DocDB.del(fid); }catch(_){} }
    saveBoard(); renderClient();
  }
  function agFileMenu(c, doc){
    actionSheet({title:esc(doc.fileName||'Файл'), sub:agFileSizeStr(doc.fileSize), items:[
      {ic:'👁', label:'Відкрити / переглянути', onClick:()=>agOpenFile(doc)},
      {ic:'⬇️', label:'Скачати', onClick:()=>agDownloadFile(doc)},
      {ic:'🔄', label:'Замінити файл', onClick:()=>agAttachFile(c,doc)},
      {ic:'🗑', label:'Видалити файл', danger:true, onClick:()=>agRemoveFile(c,doc)},
    ]});
  }
  async function agDownloadFile(doc){
    if(!doc.fileId) return;
    try{ const blob=await DocDB.get(doc.fileId); if(!blob)return;
      const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=doc.fileName||'document'; a.click();
      setTimeout(()=>URL.revokeObjectURL(url),60000);
    }catch(_){}
  }
  function agFileSizeStr(b){ if(!b)return ''; if(b<1024)return b+' Б'; if(b<1048576)return Math.round(b/1024)+' КБ'; return (b/1048576).toFixed(1)+' МБ'; }
  function agFileIcon(t){ if(/^image\//.test(t||''))return '🖼'; if(/pdf/i.test(t||''))return '📕'; if(/word|doc/i.test(t||''))return '📘'; return '📎'; }
  /* Вантажить бібліотеку. Приймає список адрес і пробує їх по черзі:
     спершу локальну копію з vendor/ (працює без інтернету), і лише якщо
     її нема — CDN. Так читалка живе і в застосунку, і в браузері. */
  function loadScriptOnce(src){
    const list = Array.isArray(src) ? src.slice() : [src];
    const abs = u => { try{ return new URL(u, location.href).href; }catch(_){ return u; } };
    function tryOne(i){
      if(i >= list.length) return Promise.reject(new Error('cdn-fail'));
      const url = abs(list[i]);
      if([...document.scripts].some(s=>s.src===url)) return Promise.resolve();
      return new Promise((res,rej)=>{
        const s=document.createElement('script'); s.src=url;
        let done=false;
        const fin=ok=>{ if(done) return; done=true; ok?res():rej(new Error('load-fail')); };
        s.onload=()=>fin(true); s.onerror=()=>fin(false);
        document.head.appendChild(s);
        setTimeout(()=>fin(false), 12000);
      }).catch(()=>tryOne(i+1));
    }
    return tryOne(0);
  }

  // вибір файлу книги з пристрою
  function pickBookFile(blockId){
    const inp=document.createElement('input');
    inp.type='file';
    inp.accept='.txt,.md,.markdown,.epub,.pdf,text/plain,application/epub+zip,application/pdf';
    inp.onchange=async()=>{
      const file=inp.files&&inp.files[0]; if(!file) return;
      const b=getBlock(blockId); if(!b) return;
      const name=file.name||'book';
      const ext=(name.split('.').pop()||'').toLowerCase();
      const fmt = ext==='epub'?'epub' : ext==='pdf'?'pdf' : (ext==='md'||ext==='markdown')?'md' : 'txt';
      const bookId = b.bookId || ('bk_'+Date.now()+'_'+Math.random().toString(36).slice(2,7));
      try{
        await BookDB.put(bookId, file);
        b.bookId=bookId; b.fmt=fmt; b.needsFile=false;
        b.progress=0; b.loc=0; b.bookmarks=[];
        if((!b.title || b.title==='Нова книга') && name){ b.title=name.replace(/\.[^.]+$/,''); }
        saveBoard(); renderBoard();
        openReader(blockId);
      }catch(e){
        flowAlert('Не вдалося зберегти книгу: '+(e&&e.message||e)+'\nМожливо, замало місця на пристрої.');
      }
    };
    inp.click();
  }

  // ── налаштування читання (спільні для всіх книг) ──
  let rdrCfg={ theme:'dark', font:'serif', size:19, lh:1.6, width:680, mode:'focus' };
  const RDR_CFG_KEY='readerCfg';
  function loadRdrCfg(){
    try{ window.storage.get(RDR_CFG_KEY).then(r=>{ if(r&&r.value){ try{ Object.assign(rdrCfg, JSON.parse(r.value)); applyRdrCfg(); }catch(_){}} }).catch(()=>{}); }catch(_){}
  }
  function saveRdrCfg(){ try{ const p=window.storage.set(RDR_CFG_KEY, JSON.stringify(rdrCfg)); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function applyRdrCfg(){
    const s=document.getElementById('scr-reader'); if(!s) return;
    s.classList.remove('rt-light','rt-sepia','rt-dark','rt-night','rf-serif','rf-sans','rf-mono','rm-focus','rm-eink','rm-aurora');
    s.classList.add('rt-'+rdrCfg.theme,'rf-'+rdrCfg.font,'rm-'+(rdrCfg.mode||'focus'));
    s.style.setProperty('--rdr-size', rdrCfg.size+'px');
    s.style.setProperty('--rdr-lh', rdrCfg.lh);
    s.style.setProperty('--rdr-width', rdrCfg.width+'px');
    const sv=document.getElementById('rdrSizeVal'); if(sv) sv.textContent=rdrCfg.size;
    const lv=document.getElementById('rdrLhVal'); if(lv) lv.textContent=rdrCfg.lh.toFixed(1);
    const wv=document.getElementById('rdrWidthVal'); if(wv) wv.textContent=rdrCfg.width;
    document.querySelectorAll('#rdrThemes [data-rtheme]').forEach(b=>b.classList.toggle('on',b.dataset.rtheme===rdrCfg.theme));
    document.querySelectorAll('#rdrFonts [data-rfont]').forEach(b=>b.classList.toggle('on',b.dataset.rfont===rdrCfg.font));
    document.querySelectorAll('#rdrModes [data-rmode]').forEach(b=>b.classList.toggle('on',b.dataset.rmode===(rdrCfg.mode||'focus')));
    try{ updateRdrProgressUI(); }catch(_){}
  }

  // ── стан активної книги в читалці ──
  let rdrBook=null;      // посилання на блок
  let pdfPages=[], pdfRenderDpr=2, pdfZoom=1;  // стан PDF-рендеру (оголошено заздалегідь)
  let rdrChapters=[];    // [{title, el}] для TOC
  let rdrRestoreTo=0;    // частка прокрутки для відновлення

  function setRdrLoading(on,txt){
    const l=document.getElementById('rdrLoading'); if(!l) return;
    if(txt){ const t=document.getElementById('rdrLoadTxt'); if(t) t.textContent=txt; }
    l.classList.toggle('on',!!on);
  }

  async function openReader(blockId){
    const b=getBlock(blockId); if(!b||!b.bookId){ pickBookFile(blockId); return; }
    rdrBook=b; rdrChapters=[];
    pdfPages=[]; pdfZoom=1;
    const _zc=document.getElementById('rdrZoom'); if(_zc) _zc.style.display='none';
    document.getElementById('scr-reader').classList.remove('rdr-immersive');
    applyRdrCfg();
    document.getElementById('rdrTitle').textContent=b.title||'Книга';
    document.getElementById('rdrAuthor').textContent=b.author||'';
    const content=document.getElementById('rdrContent');
    content.innerHTML='';
    show('scr-reader');
    setRdrLoading(true,'Відкриваю книгу…');
    try{
      const blob=await BookDB.get(b.bookId);
      if(!blob){ throw new Error('Файл книги не знайдено на цьому пристрої. Завантаж його знову.'); }
      rdrRestoreTo=(typeof b.loc==='number'&&b.loc>0)?b.loc:0;
      if(b.fmt==='txt'||b.fmt==='md'){ await renderTextBook(blob, b.fmt); }
      else if(b.fmt==='epub'){ await renderEpub(blob); }
      else if(b.fmt==='pdf'){ await renderPdf(blob); }
      else { await renderTextBook(blob,'txt'); }
      buildToc();
      setRdrLoading(false);
      // відновлення позиції
      requestAnimationFrame(()=>{ requestAnimationFrame(()=>{ restoreScroll(); }); });
    }catch(e){
      setRdrLoading(false);
      content.innerHTML=`<div style="padding:30px 6px;color:var(--rdr-mut);text-align:center;line-height:1.6">
        <div style="font-size:34px;margin-bottom:10px">😕</div>
        <b style="color:var(--rdr-fg)">Не вдалося відкрити</b><br>${esc(e&&e.message||String(e))}</div>`;
    }
  }

  // TXT / Markdown
  async function renderTextBook(blob, fmt){
    const raw=await blob.text();
    const content=document.getElementById('rdrContent');
    if(fmt==='md'){ content.innerHTML=mdToHtml(raw); }
    else {
      // звичайний текст → абзаци
      const parts=raw.replace(/\r\n/g,'\n').split(/\n{2,}/);
      content.innerHTML=parts.map(p=>{
        const t=p.trim(); if(!t) return '';
        // груба евристика заголовків глав
        if(/^(розділ|глава|chapter|part|частина)\b/i.test(t) && t.length<80){
          return `<h2 class="rdr-chap">${esc(t)}</h2>`;
        }
        return `<p>${esc(t).replace(/\n/g,'<br>')}</p>`;
      }).join('');
    }
  }

  // мінімальний безпечний Markdown → HTML (без зовнішніх бібліотек)
  function mdToHtml(md){
    let s=esc(md.replace(/\r\n/g,'\n'));
    const lines=s.split('\n'); const out=[]; let inCode=false, listBuf=[];
    const flushList=()=>{ if(listBuf.length){ out.push('<ul>'+listBuf.map(x=>`<li>${x}</li>`).join('')+'</ul>'); listBuf=[]; } };
    for(let ln of lines){
      if(/^```/.test(ln)){ if(inCode){ out.push('</pre>'); inCode=false; } else { flushList(); out.push('<pre>'); inCode=true; } continue; }
      if(inCode){ out.push(ln+'\n'); continue; }
      if(/^###\s+/.test(ln)){ flushList(); out.push('<h3 class="rdr-chap">'+ln.replace(/^###\s+/,'')+'</h3>'); continue; }
      if(/^##\s+/.test(ln)){ flushList(); out.push('<h2 class="rdr-chap">'+ln.replace(/^##\s+/,'')+'</h2>'); continue; }
      if(/^#\s+/.test(ln)){ flushList(); out.push('<h1 class="rdr-chap">'+ln.replace(/^#\s+/,'')+'</h1>'); continue; }
      if(/^>\s?/.test(ln)){ flushList(); out.push('<blockquote>'+ln.replace(/^>\s?/,'')+'</blockquote>'); continue; }
      if(/^(\-{3,}|\*{3,})$/.test(ln.trim())){ flushList(); out.push('<hr>'); continue; }
      if(/^[\-\*]\s+/.test(ln)){ listBuf.push(inlineMd(ln.replace(/^[\-\*]\s+/,''))); continue; }
      if(!ln.trim()){ flushList(); continue; }
      flushList(); out.push('<p>'+inlineMd(ln)+'</p>');
    }
    flushList(); if(inCode) out.push('</pre>');
    return out.join('');
  }
  function inlineMd(t){
    return t
      .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>')
      .replace(/(^|[^*])\*([^*]+)\*/g,'$1<i>$2</i>')
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  // EPUB — розпаковка zip через JSZip (CDN) + витяг HTML по spine
  async function renderEpub(blob){
    setRdrLoading(true,'Готую EPUB…');
    try{ await loadScriptOnce(['vendor/jszip.min.js','https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js']); }
    catch(_){ throw new Error('Для EPUB потрібен інтернет (перший раз). Спробуй у звичайному браузері або під\u0027єднай мережу.'); }
    const zip=await window.JSZip.loadAsync(blob);
    // знайти OPF
    const container=await readZipText(zip,'META-INF/container.xml');
    let opfPath='';
    const m=container&&container.match(/full-path="([^"]+)"/); if(m) opfPath=m[1];
    if(!opfPath) throw new Error('Пошкоджений EPUB (немає OPF).');
    const opf=await readZipText(zip,opfPath);
    const baseDir=opfPath.includes('/')?opfPath.slice(0,opfPath.lastIndexOf('/')+1):'';
    // manifest id→href
    const manifest={};
    (opf.match(/<item\b[^>]*>/g)||[]).forEach(it=>{
      const id=(it.match(/id="([^"]+)"/)||[])[1];
      const href=(it.match(/href="([^"]+)"/)||[])[1];
      if(id&&href) manifest[id]=decodeURIComponent(href);
    });
    // spine порядок
    const spine=(opf.match(/<itemref\b[^>]*>/g)||[]).map(s=>(s.match(/idref="([^"]+)"/)||[])[1]).filter(Boolean);
    const content=document.getElementById('rdrContent'); content.innerHTML='';
    let idx=0;
    for(const id of spine){
      const href=manifest[id]; if(!href) continue;
      const full=normalizeZipPath(baseDir+href);
      let html=await readZipText(zip,full); if(html==null) continue;
      html=stripEpubHtml(html);
      const wrap=document.createElement('section'); wrap.className='rdr-chap';
      // заголовок глави з <title> або першого h1/h2
      let title=(html.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i)||[])[1];
      title=title?title.replace(/<[^>]+>/g,'').trim():('Розділ '+(++idx));
      wrap.dataset.chap=title;
      wrap.innerHTML=html;
      content.appendChild(wrap);
    }
    // вбудувати зображення з zip
    await embedEpubImages(zip, baseDir, content);
    if(!content.children.length) throw new Error('Не вдалося прочитати вміст EPUB.');
  }
  async function readZipText(zip,path){ const f=zip.file(path); if(!f) return null; try{ return await f.async('string'); }catch(_){ return null; } }
  function normalizeZipPath(p){ const parts=[]; p.split('/').forEach(seg=>{ if(seg==='..') parts.pop(); else if(seg!=='.'&&seg!=='') parts.push(seg); }); return parts.join('/'); }
  function stripEpubHtml(html){
    let body=(html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)||[])[1]||html;
    body=body.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'')
             .replace(/ on\w+="[^"]*"/gi,'').replace(/<link[^>]*>/gi,'');
    return body;
  }
  async function embedEpubImages(zip, baseDir, root){
    const imgs=[...root.querySelectorAll('img,image')];
    for(const im of imgs){
      let src=im.getAttribute('src')||im.getAttribute('xlink:href')||im.getAttribute('href'); if(!src) continue;
      if(/^https?:|^data:/.test(src)) continue;
      const path=normalizeZipPath(baseDir+decodeURIComponent(src));
      const f=zip.file(path); if(!f){ im.remove(); continue; }
      try{
        const b64=await f.async('base64');
        const ext=(path.split('.').pop()||'png').toLowerCase();
        const mime=ext==='jpg'||ext==='jpeg'?'image/jpeg':ext==='gif'?'image/gif':ext==='svg'?'image/svg+xml':'image/png';
        if(im.tagName.toLowerCase()==='img'){ im.src='data:'+mime+';base64,'+b64; }
        else { const ni=document.createElement('img'); ni.src='data:'+mime+';base64,'+b64; im.replaceWith(ni); }
      }catch(_){ im.remove(); }
    }
  }

  // PDF — рендер сторінок у canvas через pdf.js (CDN)
  async function renderPdf(blob){
    setRdrLoading(true,'Готую PDF…');
    try{ await loadScriptOnce(['vendor/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js']); }
    catch(_){ throw new Error('Для PDF потрібен інтернет (перший раз). TXT, MD та EPUB працюють офлайн.'); }
    const pdfjsLib=window.pdfjsLib;
    // У Telegram WebView воркер pdf.js блокується політикою безпеки → працюємо в основному
    // потоці (disableWorker). Щоб pdf.js не писав "Deprecated API: no workerSrc", задаємо
    // валідний URL воркера (його НЕ вантажать через disableWorker, але попередження зникає).
    pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const buf=await blob.arrayBuffer();
    const pdf=await pdfjsLib.getDocument({ data:buf, disableWorker:true, isEvalSupported:false }).promise;
    const content=document.getElementById('rdrContent'); content.innerHTML='';
    // РОЗДІЛЬНІСТЬ: рендеримо з запасом (×2.5 від екранної щільності), щоб дрібний текст
    // у щільних таблицях був чіткий, а не замилений. Обмежуємо стелею, щоб не з'їсти пам'ять.
    const baseDpr=Math.min(window.devicePixelRatio||1, 2);
    const SHARP=2.5;                          // коефіцієнт «надмірної» роздільності
    const renderDpr=Math.min(baseDpr*SHARP, 4);
    const scrollW=(document.getElementById('rdrScroll').clientWidth||700);
    pdfPages=[]; pdfRenderDpr=renderDpr;
    for(let i=1;i<=pdf.numPages;i++){
      setRdrLoading(true,`Сторінка ${i}/${pdf.numPages}…`);
      const page=await pdf.getPage(i);
      const vp0=page.getViewport({scale:1});
      // ширина показу = вся ширина екрана мінус відступи; з урахуванням зуму користувача
      const dispW=Math.min(scrollW-28, rdrCfg.width) * (pdfZoom||1);
      const scale=(dispW/vp0.width)*renderDpr;
      const vp=page.getViewport({scale});
      const canvas=document.createElement('canvas');
      canvas.className='rdr-pdfpage rdr-chap'; canvas.dataset.chap='Стор. '+i;
      canvas.width=vp.width; canvas.height=vp.height;
      canvas.style.width=(vp.width/renderDpr)+'px'; canvas.style.height=(vp.height/renderDpr)+'px';
      const ctx=canvas.getContext('2d',{alpha:false});
      await page.render({canvasContext:ctx, viewport:vp, intent:'display'}).promise;
      content.appendChild(canvas);
      pdfPages.push(page);
      if(i%3===0) await new Promise(r=>setTimeout(r,0)); // не блокувати UI
    }
    if(!pdf.numPages) throw new Error('Порожній PDF.');
    // показати зум-контрол лише для PDF
    const zc=document.getElementById('rdrZoom'); if(zc) zc.style.display='flex';
  }
  // перемалювати всі сторінки під новий зум (швидко, без перепарсингу файлу)
  async function repaintPdfZoom(){
    if(!pdfPages.length) return;
    const content=document.getElementById('rdrContent');
    const canvases=[...content.querySelectorAll('.rdr-pdfpage')];
    const scrollW=(document.getElementById('rdrScroll').clientWidth||700);
    for(let i=0;i<pdfPages.length;i++){
      const page=pdfPages[i], canvas=canvases[i]; if(!canvas) continue;
      const vp0=page.getViewport({scale:1});
      const dispW=Math.min(scrollW-28, rdrCfg.width)*pdfZoom;
      const scale=(dispW/vp0.width)*pdfRenderDpr;
      const vp=page.getViewport({scale});
      canvas.width=vp.width; canvas.height=vp.height;
      canvas.style.width=(vp.width/pdfRenderDpr)+'px'; canvas.style.height=(vp.height/pdfRenderDpr)+'px';
      const ctx=canvas.getContext('2d',{alpha:false});
      await page.render({canvasContext:ctx, viewport:vp, intent:'display'}).promise;
      if(i%3===0) await new Promise(r=>setTimeout(r,0));
    }
  }

  // ── TOC з усіх .rdr-chap ──
  function buildToc(){
    rdrChapters=[];
    const content=document.getElementById('rdrContent');
    content.querySelectorAll('.rdr-chap').forEach((el,i)=>{
      const title=el.dataset.chap || el.textContent.trim().slice(0,60) || ('Розділ '+(i+1));
      rdrChapters.push({title, el});
    });
    // оцінка обсягу для «хвилин до кінця» (E-ink)
    try{ rdrTotalWords=(content.textContent||'').trim().split(/\s+/).filter(Boolean).length; }catch(_){ rdrTotalWords=0; }
  }

  // ── прокрутка / прогрес ──
  function scrollFraction(){
    const sc=document.getElementById('rdrScroll');
    const max=sc.scrollHeight-sc.clientHeight;
    return max>0 ? sc.scrollTop/max : 0;
  }
  function restoreScroll(){
    const sc=document.getElementById('rdrScroll');
    const max=sc.scrollHeight-sc.clientHeight;
    sc.scrollTop = Math.round((rdrRestoreTo||0)*max);
    updateRdrProgressUI();
  }
  let rdrSaveTimer=null;
  let rdrTotalWords=0;     // для оцінки часу (E-ink)
  const RDR_WPM=170;       // середня швидкість читання
  function updateRdrProgressUI(){
    const f=scrollFraction(); const pct=Math.round(f*100);
    const fill=document.getElementById('rdrProgFill'); if(fill) fill.style.width=pct+'%';
    const pe=document.getElementById('rdrPct'); if(pe) pe.textContent=pct+'%';
    const seek=document.getElementById('rdrSeek'); if(seek && document.activeElement!==seek) seek.value=Math.round(f*1000);
    const sc=document.getElementById('rdrScroll');
    // поточна глава
    if(rdrChapters.length){
      const top=sc.scrollTop+90;
      let cur=rdrChapters[0].title;
      for(const c of rdrChapters){ if(c.el.offsetTop<=top) cur=c.title; else break; }
      const ce=document.getElementById('rdrChapter'); if(ce) ce.textContent=cur;
    }
    // режим E-ink: скільки хвилин лишилось
    const me=document.getElementById('rdrMin');
    if(me){
      if((rdrCfg.mode==='eink') && rdrTotalWords>0){
        const left=Math.max(1,Math.round(rdrTotalWords*(1-f)/RDR_WPM));
        me.textContent='~ '+left+' хв до кінця';
      } else { me.textContent=''; }
    }
    // режим Focus: підсвітити абзац у центрі екрана
    if(rdrCfg.mode==='focus'){
      const content=document.getElementById('rdrContent');
      const mid=sc.scrollTop+sc.clientHeight*0.4;
      const ps=content.querySelectorAll('p,li');
      let best=null,bd=1e9;
      ps.forEach(p=>{ const c=p.offsetTop+p.offsetHeight/2; const d=Math.abs(c-mid); if(d<bd){bd=d;best=p;} });
      ps.forEach(p=>p.classList.toggle('rdr-active',p===best));
    }
    // зберегти позицію (рідко)
    if(rdrBook){
      rdrBook.loc=f; rdrBook.progress=pct;
      if(rdrSaveTimer) clearTimeout(rdrSaveTimer);
      rdrSaveTimer=setTimeout(()=>{ try{ saveBoard(); }catch(_){} }, 700);
    }
  }

  // ── ініціалізація обробників читалки (один раз) ──
  function initReader(){
    const sc=document.getElementById('rdrScroll'); if(!sc||sc.__init) return; sc.__init=true;
    loadRdrCfg();   // підтягти збережені налаштування читалки (тема/шрифт/розмір) — раніше не викликалось, тож вони не переживали перезапуск
    sc.addEventListener('scroll', ()=>{ requestAnimationFrame(updateRdrProgressUI); }, {passive:true});

    document.getElementById('rdrBack').onclick=()=>{
      if(rdrBook){ try{ saveBoard(); }catch(_){} }
      const bid=rdrBook?rdrBook.id:null; rdrBook=null;
      // повертаємось на дошку, де лежить книга
      show('scr-space'); renderBoard();
    };
    document.getElementById('rdrSeek').oninput=e=>{
      const f=parseInt(e.target.value)/1000;
      const max=sc.scrollHeight-sc.clientHeight; sc.scrollTop=Math.round(f*max);
    };

    // налаштування
    const cfgSheet=document.getElementById('rdrCfgSheet');
    document.getElementById('rdrCfg').onclick=()=>cfgSheet.classList.add('on');
    document.getElementById('rdrCfgClose').onclick=()=>cfgSheet.classList.remove('on');
    cfgSheet.onclick=e=>{ if(e.target===cfgSheet) cfgSheet.classList.remove('on'); };
    document.querySelectorAll('#rdrModes [data-rmode]').forEach(btn=>btn.onclick=()=>{
      rdrCfg.mode=btn.dataset.rmode; applyRdrCfg(); saveRdrCfg();
      // прокрутка/підсвітка одразу оновлюються
      requestAnimationFrame(updateRdrProgressUI);
    });
    document.querySelectorAll('#rdrThemes [data-rtheme]').forEach(btn=>btn.onclick=()=>{ rdrCfg.theme=btn.dataset.rtheme; applyRdrCfg(); saveRdrCfg(); });
    document.querySelectorAll('#rdrFonts [data-rfont]').forEach(btn=>btn.onclick=()=>{ rdrCfg.font=btn.dataset.rfont; applyRdrCfg(); saveRdrCfg(); });
    document.querySelectorAll('[data-rsize]').forEach(btn=>btn.onclick=()=>{ rdrCfg.size=Math.max(13,Math.min(30,rdrCfg.size+parseInt(btn.dataset.rsize))); applyRdrCfg(); saveRdrCfg(); });
    document.querySelectorAll('[data-rlh]').forEach(btn=>btn.onclick=()=>{ rdrCfg.lh=Math.max(1.2,Math.min(2.4, +(rdrCfg.lh+parseInt(btn.dataset.rlh)*0.1).toFixed(1))); applyRdrCfg(); saveRdrCfg(); });
    document.querySelectorAll('[data-rwidth]').forEach(btn=>btn.onclick=()=>{ rdrCfg.width=Math.max(480,Math.min(1000, rdrCfg.width+parseInt(btn.dataset.rwidth)*40)); applyRdrCfg(); saveRdrCfg(); });

    // закладки / зміст
    const bmSheet=document.getElementById('rdrBmSheet');
    document.getElementById('rdrBmList').onclick=()=>{ openBmSheet('toc'); };
    document.getElementById('rdrBmClose').onclick=()=>bmSheet.classList.remove('on');
    bmSheet.onclick=e=>{ if(e.target===bmSheet) bmSheet.classList.remove('on'); };
    document.querySelectorAll('[data-bmtab]').forEach(btn=>btn.onclick=()=>{
      document.querySelectorAll('[data-bmtab]').forEach(x=>x.classList.toggle('on',x===btn));
      const toc=btn.dataset.bmtab==='toc';
      document.getElementById('rdrTocList').style.display=toc?'':'none';
      document.getElementById('rdrMarksList').style.display=toc?'none':'';
    });
    document.getElementById('rdrBmAdd').onclick=addBookmark;

    // ── повноекранний режим ──
    const enterFull=()=>{ document.getElementById('scr-reader').classList.add('rdr-immersive'); };
    const exitFull =()=>{ document.getElementById('scr-reader').classList.remove('rdr-immersive'); };
    document.getElementById('rdrFull').onclick=enterFull;
    document.getElementById('rdrFullExit').onclick=exitFull;
    // зум PDF
    let zoomTimer=null;
    const applyZoom=()=>{
      const zv=document.getElementById('rdrZoomVal'); if(zv) zv.textContent=Math.round(pdfZoom*100)+'%';
      if(zoomTimer) clearTimeout(zoomTimer);
      setRdrLoading(true,'Масштабую…');
      zoomTimer=setTimeout(async()=>{ await repaintPdfZoom(); setRdrLoading(false); }, 180);
    };
    document.getElementById('rdrZoomIn').onclick=()=>{ pdfZoom=Math.min(3, +(pdfZoom+0.25).toFixed(2)); applyZoom(); };
    document.getElementById('rdrZoomOut').onclick=()=>{ pdfZoom=Math.max(0.5, +(pdfZoom-0.25).toFixed(2)); applyZoom(); };
    // тап по тексту в зануреному режимі — показати панелі назад
    document.getElementById('rdrContent').addEventListener('click', e=>{
      const s=document.getElementById('scr-reader');
      if(s.classList.contains('rdr-immersive') && !e.target.closest('a,button')){ exitFull(); }
    });
  }

  function openBmSheet(tab){
    const bmSheet=document.getElementById('rdrBmSheet');
    // зміст
    const tocList=document.getElementById('rdrTocList');
    if(rdrChapters.length){
      tocList.innerHTML=rdrChapters.map((c,i)=>`<div class="rdr-bm-item" data-toc="${i}"><span class="bm-t">${esc(c.title)}</span><span class="bm-pct">›</span></div>`).join('');
      tocList.querySelectorAll('[data-toc]').forEach(el=>el.onclick=()=>{
        const c=rdrChapters[parseInt(el.dataset.toc)]; if(c){ c.el.scrollIntoView({behavior:'smooth',block:'start'}); bmSheet.classList.remove('on'); }
      });
    } else { tocList.innerHTML=`<div class="rdr-bm-empty">У цій книзі немає глав для змісту.</div>`; }
    // закладки
    renderMarks();
    // активна вкладка
    document.querySelectorAll('[data-bmtab]').forEach(x=>x.classList.toggle('on',x.dataset.bmtab===tab));
    tocList.style.display=tab==='toc'?'':'none';
    document.getElementById('rdrMarksList').style.display=tab==='toc'?'none':'';
    bmSheet.classList.add('on');
  }
  function renderMarks(){
    const wrap=document.getElementById('rdrMarksList');
    const marks=(rdrBook&&Array.isArray(rdrBook.bookmarks))?rdrBook.bookmarks:[];
    if(!marks.length){ wrap.innerHTML=`<div class="rdr-bm-empty">Ще немає закладок.<br>Тисни 🔖 угорі, щоб зберегти місце.</div>`; return; }
    wrap.innerHTML=marks.slice().sort((a,b)=>a.f-b.f).map(m=>`<div class="rdr-bm-item" data-mk="${m.id}">
      <span class="bm-t">${esc(m.label||'Закладка')}</span><span class="bm-pct">${Math.round(m.f*100)}%</span>
      <button class="bm-del" data-mkdel="${m.id}" title="Видалити">×</button></div>`).join('');
    wrap.querySelectorAll('[data-mk]').forEach(el=>el.onclick=e=>{
      if(e.target.closest('[data-mkdel]')) return;
      const m=marks.find(x=>String(x.id)===el.dataset.mk); if(!m) return;
      const sc=document.getElementById('rdrScroll'); const max=sc.scrollHeight-sc.clientHeight;
      sc.scrollTop=Math.round(m.f*max);
      document.getElementById('rdrBmSheet').classList.remove('on');
    });
    wrap.querySelectorAll('[data-mkdel]').forEach(el=>el.onclick=e=>{
      e.stopPropagation();
      rdrBook.bookmarks=rdrBook.bookmarks.filter(x=>String(x.id)!==el.dataset.mkdel);
      saveBoard(); renderMarks();
    });
  }
  function addBookmark(){
    if(!rdrBook) return;
    if(!Array.isArray(rdrBook.bookmarks)) rdrBook.bookmarks=[];
    const f=scrollFraction();
    // підпис = поточна глава або відсоток
    let label=Math.round(f*100)+'%';
    if(rdrChapters.length){ const sc=document.getElementById('rdrScroll'); const top=sc.scrollTop+90;
      for(const c of rdrChapters){ if(c.el.offsetTop<=top) label=c.title; else break; } }
    rdrBook.bookmarks.push({ id:Date.now(), f, label, ts:Date.now() });
    saveBoard();
    window.platform.haptic('light');
    // короткий фідбек
    const btn=document.getElementById('rdrBmAdd'); if(btn){ btn.textContent='✓'; setTimeout(()=>btn.textContent='🔖',900); }
  }

  // photo: pick from device, downscale, store as compact dataURL
