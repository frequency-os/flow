
/* ════════ FD26T · активація шару тем + SVG-іконки хрому ════════
   Вимикач: localStorage.fd26t='0' → клас не додається, все як було. */
(function(){
'use strict';
try{
  if(window.__fd26t) return; window.__fd26t=1;
  if((localStorage.getItem('fd26t')||'1')==='0') return;
  document.documentElement.classList.add('fd26t');
  try{
    if(Array.isArray(window.FLOW_KEYS) && window.FLOW_KEYS.indexOf('fd26t')<0) window.FLOW_KEYS.push('fd26t');
  }catch(_){}

  /* штрихові іконки в стилі таббару: stroke 1.9, currentColor */
  function ic(p,extra){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" '
      +'stroke-linecap="round" stroke-linejoin="round"'+(extra||'')+'>'+p+'</svg>';
  }
  var I={
    bolt:'<path d="M13 2.5 5.5 13.5h5L11 21.5l7.5-11h-5z" fill="currentColor" stroke="none"/>',
    wave:'<path d="M2 12c2.3 0 2.3-6.8 4.6-6.8s2.3 13.6 4.6 13.6 2.3-13.6 4.6-13.6 2.3 6.8 4.6 6.8 2.3-3.7 4.6-3.7" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" pathLength="100" class="fd-wave-draw"/>',
    gear:'<circle cx="12" cy="12" r="3.1"/><path d="M12 2.8v2.3M12 18.9v2.3M2.8 12h2.3M18.9 12h2.3M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7"/>',
    dots:'<circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
    panel:'<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M14.5 4.5v15"/>',
    folder:'<path d="M3.5 8.5a2 2 0 0 1 2-2h3.2a1.5 1.5 0 0 1 1.2.6l1 1.3a1.5 1.5 0 0 0 1.2.6H18.5a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z"/>',
    tree:'<path d="M12 3 8.2 8.5h2L6.5 13.5h3L6 18.5h12l-3.5-5h3L13.8 8.5h2L12 3z"/><path d="M12 18.5V21"/>'
  };

  function run(){
    try{
      /* лого → векторна хвиля (строк на градієнті, білий) */
      var lg=document.querySelector('#scr-home .logo');
      if(lg && !lg.querySelector('svg')){ lg.style.color='#fff'; lg.innerHTML=ic(I.wave); }

      /* шестерня без id, три крапки, тумблер віджетів */
      var top=document.querySelector('#scr-home .top');
      if(top){
        top.querySelectorAll('.icon-btn').forEach(function(b){
          if(b.id==='themeToggle') return; /* його малює CSS-маска за data-theme */
          if(b.querySelector('svg')) return;
          if(b.id==='homeMoreBtn') b.innerHTML=ic(I.dots);
          else if(b.id==='homeWidgetsToggle') b.innerHTML=ic(I.panel);
          else if(!b.id) b.innerHTML=ic(I.gear);
        });
      }

      /* «📁 Папки» → svg + текст (фікс гігантської емодзі у світлій темі) */
      document.querySelectorAll('#scr-home .sec h3').forEach(function(h){
        if(h.querySelector('svg')) return;
        var raw=h.textContent||'';
        if(raw.indexOf('Папки')<0) return;
        var t=raw.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu,'').trim();
        h.innerHTML=ic(I.folder)+'<span>'+(t||'Папки')+'</span>';
      });


      /* лічильник → компактний рядок ПІД картою бажань.
         Раніше вузол переносився всередину #summaryCard. Тепер на нижньому
         краї картки стоїть скляна полиця з кнопками «Карта бажань» і
         «Щоденник» — місця під лічильник там більше немає. Вузол лишається
         там, де він у розмітці (одразу під карткою), а клас .nyc-strip
         вмикає той самий компактний рядок. Перенос прибрано, тому й
         stopPropagation більше не потрібен: лічильник уже не всередині
         клікабельної картки. */
      var nyc=document.getElementById('nyCountdown');
      if(nyc) nyc.classList.add('nyc-strip');

      /* 🎄 → штрихова ялинка */
      var ny=document.querySelector('#scr-home .nyc-emoji');
      if(ny && !ny.querySelector('svg')) ny.innerHTML=ic(I.tree);
    }catch(e){ console.error('fd26t icons',e); }
  }


  /* ═══ ІКОНАЙЗЕР · емодзі хрому → штрихові SVG (переживає перерендери) ═══
     Працює ЛИШЕ у службових вузлах (меню, швидкі дії, плитки інструментів) —
     користувацькі емодзі (обкладинки папок, нотатки) не чіпає. */
  var P={
    pin:'<path d="M12 17v4M8.5 3.5h7l-1 6 3 3.5H6.5l3-3.5-1-6z"/>',
    pencil:'<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5 4 20z"/><path d="M13.5 7l3 3"/>',
    folder:'<path d="M3.5 8.5a2 2 0 0 1 2-2h3.2a1.5 1.5 0 0 1 1.2.6l1 1.3a1.5 1.5 0 0 0 1.2.6H18.5a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z"/>',
    palette:'<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.8 2-1.8 0-1.5-1.3-1.9-1.3-3 0-1 .8-1.7 2-1.7H17a4 4 0 0 0 4-4C21 6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7" r="1" fill="currentColor" stroke="none"/>',
    smile:'<circle cx="12" cy="12" r="8.5"/><path d="M8.7 14.2a4.4 4.4 0 0 0 6.6 0"/><path d="M9.3 9.8h.01M14.7 9.8h.01" stroke-width="2.4"/>',
    trash:'<path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7M6.5 6.5l.8 12a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12"/><path d="M10 10.5v5.5M14 10.5v5.5"/>',
    hide:'<path d="M3.5 12s3-6 8.5-6 8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6z"/><path d="M4.5 4.5l15 15"/>',
    cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v3.5M16 3v3.5"/>',
    x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    mail:'<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/>',
    swap:'<path d="M4 8.5h13l-3-3M20 15.5H7l3 3"/>',
    plus:'<path d="M12 5.5v13M5.5 12h13"/>',
    minus:'<path d="M5.5 12h13"/>',
    chart:'<path d="M4 19.5V4.5M4 19.5h16"/><path d="M7.5 15.5l3.5-4 3 2.5 4.5-6"/>',
    card:'<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M6.5 14.5h4"/>',
    repeat:'<path d="M17.5 4.5l3 3-3 3M6.5 19.5l-3-3 3-3"/><path d="M20.5 7.5H8a4 4 0 0 0-4 4M3.5 16.5H16a4 4 0 0 0 4-4"/>',
    hands:'<path d="M12 12.5 9.5 10a2 2 0 0 0-2.8 0L4 12.7l4.6 4.6a3 3 0 0 0 4.2 0l6.9-6.8a2 2 0 0 0-2.8-2.9L14 10.5"/>',
    trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 5.5H5a3 3 0 0 0 3 4M16 5.5h3a3 3 0 0 1-3 4M12 13v3.5M8.5 20h7M10 16.5h4v3.5h-4z"/>',
    clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    receipt:'<path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4v-17z"/><path d="M9 8.5h6M9 12h6"/>',
    inbox:'<path d="M12 3.5v9M8.5 9l3.5 3.5L15.5 9"/><path d="M4 14.5v3a2.5 2.5 0 0 0 2.5 2.5h11a2.5 2.5 0 0 0 2.5-2.5v-3"/>',
    rocket:'<path d="M12 15.5c5.5-3.5 7-8 6.7-10.2C16.5 5 12 6.5 8.5 12L12 15.5z"/><path d="M8.5 12l-3.7.9L7 10.5M12 15.5l-.9 3.7 2.4-2.2M6.5 17.5c-.8.8-1.5 2.3-1.5 2.3s1.5-.7 2.3-1.5"/><circle cx="13.6" cy="10.3" r="1.15"/>',
    file:'<path d="M6.5 3.5h7l4 4v13h-11v-17z"/><path d="M13 3.5v4.5h4.5"/>'
  };
  var EMAP={'📌':'pin','📍':'pin','✏️':'pencil','📂':'folder','📁':'folder','🎨':'palette','😀':'smile',
    '🗑️':'trash','🗑':'trash','🕶️':'hide','🕶':'hide','📅':'cal','🗓':'cal','✖️':'x','✉️':'mail',
    '⇄':'swap','＋':'plus','−':'minus','📈':'chart','💳':'card','🔁':'repeat','🤝':'hands','🏆':'trophy',
    '⏱':'clock','🧾':'receipt','📥':'inbox','📤':'inbox','🚀':'rocket','📄':'file'};
  var SEL='.fmi,.frole-e,.incx-acts button i,.fhx-tile .i,.fuz-b b,.fuz-sec .lnk,.fuz-all span,.ana-row span,.incx-exp .ic,.lit-act .ic';
  function emKey(s){ s=s.replace(/\uFE0F/g,''); for(var k in EMAP){ if(s.indexOf(k.replace(/\uFE0F/g,''))===0) return k; } return null; }
  function iconize(el){
    try{
      if(el.querySelector('svg')||el.dataset.fdIco) return;
      for(var n=el.firstChild;n;n=n.nextSibling){
        if(n.nodeType!==3) { if(n.nodeType===1) break; continue; }
        var raw=n.nodeValue, s=raw.replace(/^\s+/,'');
        if(!s) continue;
        var k=emKey(s); if(!k) return;
        var kk=k.replace(/\uFE0F/g,'');
        var rest=s.replace(/\uFE0F/g,'').slice(kk.length).replace(/^\s+/,' ');
        var w=document.createElement('span');
        w.innerHTML=ic(P[EMAP[k]]);
        el.insertBefore(w.firstChild,n);
        n.nodeValue=rest;
        el.dataset.fdIco='1';
        return;
      }
    }catch(_){}
  }
  function iconizeIn(root){
    try{
      if(root.nodeType!==1) return;
      if(root.matches && root.matches(SEL)) iconize(root);
      if(root.querySelectorAll) root.querySelectorAll(SEL).forEach(iconize);
    }catch(_){}
  }
  try{
    iconizeIn(document.body||document.documentElement);
    var pend=false, box=[];
    new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var a=muts[i].addedNodes;
        for(var j=0;j<a.length;j++) if(a[j].nodeType===1) box.push(a[j]);
      }
      if(box.length && !pend){ pend=true; requestAnimationFrame(function(){
        pend=false; var b=box; box=[];
        for(var i=0;i<b.length;i++) iconizeIn(b[i]);
      }); }
    }).observe(document.body||document.documentElement,{childList:true,subtree:true});
  }catch(e){ console.error('fd26t iconizer',e); }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run);
  else run();
}catch(e){ console.error('fd26t init',e); }
})();
