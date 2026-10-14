  /* ════════ Блок «Папка» (12.10.2026) ════════
     Одна справжня папка застосунку прямо в документі — не віджет і не група.
     Блок зберігає лише ключ папки {type:'fold', folder:'f_…'}; назва, колір, іконка — живі з folders.
     Нова папка створюється звичайним createFolder (дія людини) всередині поточної папки. */
  function fdLoc(id){ var l=locate(id); return l&&l.block&&l.block.type==='fold'?l.block:null; }
  function fdOk(k){ return !!(k&&typeof folders!=='undefined'&&folders[k]&&(typeof folderVisible!=='function'||folderVisible(k))); }
  function fdIco(f){ return '<span class="fd-ic" style="--c:'+(typeof safeColor==='function'?safeColor(f.c,'#6a7dff'):'#6a7dff')+'"><svg class="ico" aria-hidden="true"><use href="#'+esc(folderIcon(f))+'"/></svg></span>'; }
  function fdHTML(b){
    var id=esc(b.id), k=b.folder;
    if(!fdOk(k)) return '<div class="pg-content"><button class="fd fd-empty" data-fdpick="'+id+'"><span class="fd-ic fd-ic0">'+pgsIc('folder')+'</span>'
      +'<span class="fd-t"><b>'+(k?'Папку видалено':'Папка')+'</b><small>Вибрати наявну або створити нову</small></span><span class="fd-go">＋</span></button></div>';
    var f=folders[k], kids=0; try{ kids=groupKids(k).length; }catch(_){}
    var sub=kids?(kids+' '+(kids===1?'папка':kids<5?'папки':'папок')+' всередині'):'Відкрити папку';
    return '<div class="pg-content"><div class="fd" style="--c:'+(typeof safeColor==='function'?safeColor(f.c,'#6a7dff'):'#6a7dff')+'">'
      +'<button class="fd-open" data-fdopen="'+id+'">'+fdIco(f)
      +'<span class="fd-t"><b data-i18n-skip="1">'+(typeof prioDot==='function'?prioDot(k):'')+esc(String(f.name||'Папка').slice(0,60))+'</b><small>'+sub+'</small></span><span class="fd-go">›</span></button>'
      +'<button class="fd-ch" data-fdpick="'+id+'" aria-label="Змінити папку" title="Змінити папку">⇄</button></div></div>';
  }
  function fdSet(bid,k){
    var b=fdLoc(bid); if(!b||!fdOk(k)) return; var ov=b.folder||'';
    if(ov===k) return; b.folder=k;
    pushOp(function(){ if(ov) b.folder=ov; else delete b.folder; },function(){ b.folder=k; });
    save(); render();
  }
  // дерево папок для вибору: верхній рівень і вкладені (до 3 рівнів), без проєктів і без поточної папки
  function fdTree(cur){
    var out=[], seen=Object.create(null);
    var walk=function(keys,d){ keys.forEach(function(k){ if(seen[k]||!fdOk(k)||k==='work') return; seen[k]=1;
      if(k!==cur) out.push({k:k,d:d}); if(d<2){ try{ walk(childFolderKeys(k),d+1); }catch(_){} } }); };
    try{ walk(topFolderKeys(),0); }catch(_){}
    return out.slice(0,200);
  }
  function fdPick(bid){
    var b=fdLoc(bid); if(!b) return; var cur=tbFolder();
    var ov=document.createElement('div'); ov.className='pgask-ov';
    var list=fdTree(cur);
    ov.innerHTML='<div class="pgask fdsheet"><div class="pgask-t">Папка в документі</div>'
      +'<button class="fds-new" data-fdnew>＋ Нова папка'+(cur&&folders[cur]?' в «<span data-i18n-skip="1">'+esc(String(folders[cur].name||'').slice(0,30))+'</span>»':'')+'</button>'
      +'<div class="fds-list">'+(list.length?list.map(function(x){ var f=folders[x.k];
        return '<button class="fds-i'+(x.k===b.folder?' on':'')+'" data-fdk="'+esc(x.k)+'" style="--d:'+x.d+'">'+fdIco(f)+'<span data-i18n-skip="1">'+esc(String(f.name||'Папка').slice(0,40))+'</span></button>'; }).join(''):'<small class="fds-none">Інших папок ще нема — створи нову.</small>')
      +'</div><div class="pgask-b"><button class="c">Скасувати</button></div></div>';
    ov.onclick=function(e){ if(e.target===ov) ov.remove(); };
    ov.querySelector('.c').onclick=function(){ ov.remove(); };
    ov.querySelectorAll('[data-fdk]').forEach(function(x){ x.onclick=function(){ ov.remove(); fdSet(bid,x.dataset.fdk); }; });
    ov.querySelector('[data-fdnew]').onclick=function(){ ov.remove();
      try{ createFolder(cur&&folders[cur]?cur:'',{onCreated:function(k){ fdSet(bid,k); }}); }catch(_){} };
    document.body.appendChild(ov);
  }
  editor.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-fdpick],[data-fdopen]'); if(!t) return;
    e.preventDefault(); e.stopPropagation();
    if(t.dataset.fdpick){ fdPick(t.dataset.fdpick); return; }
    var b=fdLoc(t.dataset.fdopen); if(!b||!fdOk(b.folder)) return; var k=b.folder;
    try{ if(groupKids(k).length&&typeof openGroupAsChosen==='function'){ openGroupAsChosen(k,tbFolder()); return; } }catch(_){}
    try{ goFolder(k); }catch(_){}
  });
