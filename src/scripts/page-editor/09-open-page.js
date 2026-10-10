  /* ═══════════ публічний вхід у редактор документа: window.openFlowPage ═══════════
     (шторку блока «Щоденник» прибрано 10.10.2026 разом із самим типом блока) */
  // ── публічний вхід ──
  try{ window.__pgRender=render; }catch(_){}
  // opts.focusId — прокрутити до блока й підсвітити (стрибок із Каналу папки)
  window.openFlowPage=function(opts){
    // без мосту папки сторінці нема що показати — повертаємось на Огляд.
    // Раніше тут був екран «Простір» (scr-space), але 14.09 його видалено:
    // show() знімав active з усіх екранів і падав на відсутньому — білий екран.
    if(!bridge()){ if(window.__show)window.__show('scr-home'); return; }
    applyTheme(pageThemeDefault());
    pgPath=[];
    undoStack.length=0; redoStack.length=0; syncUndoBtn(); // не переносити історію між різними сторінками
    pgTitle.value=bridge().folderName()||'Сторінка';
    render();
    renderCover();
    cdTick();
    if(window.__show)window.__show('scr-page');
    var fid=opts&&opts.focusId;
    if(fid){
      // __show скидає прокрутку ще й через 80 мс — стрибаємо після цього
      setTimeout(function(){
        try{
          var el=editor.querySelector('.pgb[data-id="'+String(fid).replace(/["\\]/g,'')+'"]');
          if(!el) return;
          el.scrollIntoView({block:'center'});
          el.classList.add('pg-flash');
          setTimeout(function(){ el.classList.remove('pg-flash'); },1600);
        }catch(_){}
      },140);
    }
  };
})();
