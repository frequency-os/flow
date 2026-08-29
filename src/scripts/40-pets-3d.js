
/* ════════ FD26 · 3D-рендер напарників ════════
   Живиться через делегацію в petSVG(): window.fd26PetSVG(id,size).
   Сумісність із рештою апки:
   — id основного градієнта лишився 'pg'+id+size (petSVGSleep клеїть повіки з url(#pg…));
   — очі на cx 36/64, cy 48 (повіки сну накривають повністю);
   — один '</svg' + '>' у розмітці (petSVGSleep робить replace по ньому);
   — невідомий id або pet3d='0' → return null → легасі-рендер. */
(function(){
'use strict';
try{
  if(window.__fd26pets) return; window.__fd26pets=1;

  /* власна палітра (FLOW_PETS — const у чужому скоупі, не тягнемось туди) */
  var FD={
    spark:{glow:'#ff9d5c',c:['#ff9d5c','#ff5c8a']},
    luna:{glow:'#8b7bff',c:['#8b7bff','#5c6cff']},
    mo:{glow:'#5ce0c8',c:['#5ce0c8','#4c9ee8']},
    bublik:{glow:'#ff8ad4',c:['#ff8ad4','#c86cff']},
    volt:{glow:'#5cc8ff',c:['#5cc8ff','#6c7cff']},
    tor:{glow:'#c89058',c:['#c89058','#6e4a28'],male:1},
    blade:{glow:'#5ce0a8',c:['#565e70','#1f222c'],male:1},
    drake:{glow:'#ff7a5c',c:['#e06a52','#7a2e30'],male:1},
    rex:{glow:'#9aa8c8',c:['#96a2bc','#454e64'],male:1},
    dev:{glow:'#5ce0a8',c:['#2a2e3d','#12141f'],male:1}
  };
  var ORD={spark:0,luna:1,mo:2,bublik:3,volt:4,tor:5,blade:6,drake:7,rex:8,dev:2};

  function hx(c){c=c.replace('#','');return [parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)];}
  function mixc(c,t,k){var a=hx(c),b=hx(t);function f(i){return Math.round(a[i]+(b[i]-a[i])*k);}
    return '#'+[f(0),f(1),f(2)].map(function(n){return ('0'+n.toString(16)).slice(-2);}).join('');}
  function lt(c,k){return mixc(c,'#ffffff',k);} function dk(c,k){return mixc(c,'#07060e',k);}
  function wm(c,k){return mixc(c,'#ffb070',k);}

  var HEAD='M50 15 C73 15 87 34 87 56 C87 77 71 91 50 91 C29 91 13 77 13 56 C13 34 27 15 50 15 Z';

  /* ── спільні defs: один раз на документ ── */
  function ensureDefs(){
    if(document.getElementById('fd26defs')) return;
    var s='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs id="fd26defs">'
      +'<filter id="fdSoft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2"/></filter>'
      +'<filter id="fdSoftXS" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".6"/></filter>'
      +'<filter id="fdDsh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="1.8" stdDeviation="1.5" flood-color="#000" flood-opacity=".38"/></filter>'
      +'<filter id="fdDshS" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="1" stdDeviation=".9" flood-color="#000" flood-opacity=".3"/></filter>'
      +'<radialGradient id="fdEyeDk" cx=".35" cy=".3" r=".9"><stop offset="0%" stop-color="#3a3f58"/><stop offset="55%" stop-color="#14172a"/><stop offset="100%" stop-color="#07080f"/></radialGradient>'
      +'<radialGradient id="fdEyeGrn" cx=".35" cy=".3" r=".9"><stop offset="0%" stop-color="#b2f8d8"/><stop offset="60%" stop-color="#5ce0a8"/><stop offset="100%" stop-color="#1e7a54"/></radialGradient>'
      +'<radialGradient id="fdEyeAmb" cx=".35" cy=".3" r=".9"><stop offset="0%" stop-color="#ffe0a0"/><stop offset="60%" stop-color="#ffb347"/><stop offset="100%" stop-color="#b56a14"/></radialGradient>'
      +'<linearGradient id="fdBeakG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffd28a"/><stop offset="100%" stop-color="#e8923a"/></linearGradient>'
      +'<linearGradient id="fdBoltG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff2b0"/><stop offset="100%" stop-color="#ffc93c"/></linearGradient>'
      +'<linearGradient id="fdHornG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f8dc8e"/><stop offset="100%" stop-color="#c89a3e"/></linearGradient>'
      +'<radialGradient id="fdMuzzG" cx=".4" cy=".3" r=".9"><stop offset="0%" stop-color="#f4e4c8"/><stop offset="100%" stop-color="#c8a878"/></radialGradient>'
      +'<radialGradient id="fdBellyG" cx=".45" cy=".3" r=".9"><stop offset="0%" stop-color="#ffffff" stop-opacity=".38"/><stop offset="100%" stop-color="#ffffff" stop-opacity=".06"/></radialGradient>'
      +'</defs></svg>';
    var host=document.body||document.documentElement;
    host.insertAdjacentHTML('afterbegin',s);
    /* зерно: крихітний canvas-шум → pattern (без feTurbulence — дешевше для слабких Android) */
    try{
      var cv=document.createElement('canvas'); cv.width=cv.height=64;
      var cx=cv.getContext('2d'), im=cx.createImageData(64,64);
      for(var i=0;i<im.data.length;i+=4){ var v=200+Math.random()*55|0;
        im.data[i]=v; im.data[i+1]=v; im.data[i+2]=v; im.data[i+3]=Math.random()*90|0; }
      cx.putImageData(im,0,0);
      var NS='http://www.w3.org/2000/svg';
      var pat=document.createElementNS(NS,'pattern');
      pat.setAttribute('id','fdGrainP'); pat.setAttribute('width','64'); pat.setAttribute('height','64');
      pat.setAttribute('patternUnits','userSpaceOnUse');
      var img=document.createElementNS(NS,'image');
      img.setAttribute('href',cv.toDataURL()); img.setAttribute('width','64'); img.setAttribute('height','64');
      pat.appendChild(img);
      document.getElementById('fd26defs').appendChild(pat);
    }catch(_){}
  }

  /* ── вуха: тінь на голову + внутрішня тінь + SSS-просвічування краю ── */
  function ears(id,g,gi,p){
    var f='fill="url(#'+g+')"', d='fill="url(#'+gi+')"';
    var sc=lt(wm(p.glow,.55),.25);
    var sss=function(pt){return '<path d="'+pt+'" class="fd-sss" fill="none" stroke="'+sc+'" stroke-width="2.6" stroke-linecap="round" filter="url(#fdSoft)"/>';};
    if(id==='spark'||id==='dev') return '<g filter="url(#fdDsh)"><path d="M22 38 L13 9 L41 26 Z" '+f+'/><path d="M78 38 L87 9 L59 26 Z" '+f+'/></g>'
      +'<path d="M23 33 L18 15 L34 25 Z" fill="#1a0f1e" opacity=".7"/><path d="M77 33 L82 15 L66 25 Z" fill="#1a0f1e" opacity=".7"/>'
      +sss('M14 12 L21 32')+sss('M86 12 L79 32');
    if(id==='luna') return '<g filter="url(#fdDsh)"><path d="M24 30 L15 10 L39 24 Z" '+f+'/><path d="M76 30 L85 10 L61 24 Z" '+f+'/></g>'
      +'<path d="M25 27 L19 14 L34 23 Z" '+d+' opacity=".5"/><path d="M75 27 L81 14 L66 23 Z" '+d+' opacity=".5"/>'
      +sss('M16 12 L23 27')+sss('M84 12 L77 27');
    if(id==='mo') return '<g filter="url(#fdDsh)"><path d="M25 36 L17 11 L43 26 Z" '+f+'/><path d="M75 36 L83 11 L57 26 Z" '+f+'/></g>'
      +'<path d="M26 32 L21 16 L37 25 Z" fill="#ffb0d8" opacity=".55"/><path d="M74 32 L79 16 L63 25 Z" fill="#ffb0d8" opacity=".55"/>'
      +sss('M18 14 L24 33')+sss('M82 14 L76 33');
    if(id==='bublik') return '<g filter="url(#fdDsh)"><ellipse cx="15" cy="37" rx="12" ry="6.5" '+f+' transform="rotate(-32 15 37)"/><ellipse cx="85" cy="37" rx="12" ry="6.5" '+f+' transform="rotate(32 85 37)"/>'
      +'<ellipse cx="11" cy="52" rx="10.5" ry="5.5" '+f+' transform="rotate(-6 11 52)"/><ellipse cx="89" cy="52" rx="10.5" ry="5.5" '+f+' transform="rotate(6 89 52)"/></g>'
      +sss('M7 32 Q13 28 20 31')+sss('M93 32 Q87 28 80 31')+sss('M3 51 Q8 48 14 49')+sss('M97 51 Q92 48 86 49');
    if(id==='tor') return '<g filter="url(#fdDsh)"><circle cx="25" cy="23" r="13.5" '+f+'/><circle cx="75" cy="23" r="13.5" '+f+'/></g>'
      +'<circle cx="25" cy="23" r="6.5" '+d+'/><circle cx="75" cy="23" r="6.5" '+d+'/>'
      +sss('M14 18 A13.5 13.5 0 0 1 25 9.5')+sss('M86 18 A13.5 13.5 0 0 0 75 9.5');
    if(id==='blade') return '<g filter="url(#fdDsh)"><path d="M24 34 L13 7 L43 24 Z" '+f+'/><path d="M76 34 L87 7 L57 24 Z" '+f+'/></g>'
      +'<path d="M25 30 L18 13 L36 23 Z" fill="#14161e" opacity=".8"/><path d="M75 30 L82 13 L64 23 Z" fill="#14161e" opacity=".8"/>'
      +sss('M14 10 L22 30')+sss('M86 10 L78 30');
    if(id==='drake') return '<g filter="url(#fdDsh)"><path d="M32 26 C25 11 31 0 42 5 C49 9 44 22 40 30 Z" fill="url(#fdHornG)"/><path d="M68 26 C75 11 69 0 58 5 C51 9 56 22 60 30 Z" fill="url(#fdHornG)"/></g>'
      +sss('M29 18 C27 10 31 4 38 5')+sss('M71 18 C73 10 69 4 62 5');
    if(id==='rex') return '<g filter="url(#fdDsh)"><path d="M22 30 C13 21 15 8 26 11 C35 14 34 28 32 36 Z" '+f+'/><path d="M78 30 C87 21 85 8 74 11 C65 14 66 28 68 36 Z" '+f+'/></g>'
      +'<path d="M24 27 C19 21 20 13 26 15 C31 17 30 26 29 31 Z" '+d+' opacity=".7"/><path d="M76 27 C81 21 80 13 74 15 C69 17 70 26 71 31 Z" '+d+' opacity=".7"/>'
      +sss('M17 22 C14 15 17 10 23 11')+sss('M83 22 C86 15 83 10 77 11');
    return '';
  }

  /* ── очі: нерухома основа + рухома група .fd-look; координати 36/64 як у легасі ── */
  function eyes(id,p){
    var out='';
    if(id==='blade'||id==='dev'){
      out='<ellipse cx="36" cy="48" rx="7.5" ry="8.2" fill="url(#fdEyeGrn)"/><ellipse cx="64" cy="48" rx="7.5" ry="8.2" fill="url(#fdEyeGrn)"/>'
        +'<g class="fd-look"><ellipse cx="36" cy="48.5" rx="2.5" ry="6.6" fill="#0a0c16"/><ellipse cx="64" cy="48.5" rx="2.5" ry="6.6" fill="#0a0c16"/>'
        +'<circle cx="38.4" cy="44.6" r="1.8" fill="#fff" opacity=".95"/><circle cx="66.4" cy="44.6" r="1.8" fill="#fff" opacity=".95"/></g>'
        +'<path d="M31 52 A7.5 8 0 0 0 41 52" stroke="#aef5d4" stroke-width="1.2" fill="none" opacity=".5"/><path d="M59 52 A7.5 8 0 0 0 69 52" stroke="#aef5d4" stroke-width="1.2" fill="none" opacity=".5"/>';
    } else if(id==='drake'){
      out='<ellipse cx="36" cy="48" rx="7.5" ry="8" fill="url(#fdEyeAmb)"/><ellipse cx="64" cy="48" rx="7.5" ry="8" fill="url(#fdEyeAmb)"/>'
        +'<g class="fd-look"><ellipse cx="36" cy="48.5" rx="3" ry="6.2" fill="#0a0c16"/><ellipse cx="64" cy="48.5" rx="3" ry="6.2" fill="#0a0c16"/>'
        +'<circle cx="38.4" cy="44.8" r="1.9" fill="#fff"/><circle cx="66.4" cy="44.8" r="1.9" fill="#fff"/></g>';
    } else {
      var r=id==='luna'?9.4:7.8;
      out='<g class="fd-look">'
        +'<circle cx="36" cy="48" r="'+r+'" fill="url(#fdEyeDk)"/><circle cx="64" cy="48" r="'+r+'" fill="url(#fdEyeDk)"/>'
        +'<circle cx="'+(36+r*.32).toFixed(1)+'" cy="'+(48-r*.38).toFixed(1)+'" r="'+(r*.34).toFixed(1)+'" fill="#fff"/><circle cx="'+(64+r*.32).toFixed(1)+'" cy="'+(48-r*.38).toFixed(1)+'" r="'+(r*.34).toFixed(1)+'" fill="#fff"/>'
        +'<circle cx="'+(36-r*.3).toFixed(1)+'" cy="'+(48-r*.1).toFixed(1)+'" r="'+(r*.15).toFixed(1)+'" fill="#fff" opacity=".8"/><circle cx="'+(64-r*.3).toFixed(1)+'" cy="'+(48-r*.1).toFixed(1)+'" r="'+(r*.15).toFixed(1)+'" fill="#fff" opacity=".8"/>'
        +'<path d="M'+(36-r*.6).toFixed(1)+' '+(48+r*.5).toFixed(1)+' A'+r+' '+r+' 0 0 0 '+(36+r*.6).toFixed(1)+' '+(48+r*.5).toFixed(1)+'" stroke="'+p.glow+'" stroke-width="1.4" fill="none" opacity=".55"/>'
        +'<path d="M'+(64-r*.6).toFixed(1)+' '+(48+r*.5).toFixed(1)+' A'+r+' '+r+' 0 0 0 '+(64+r*.6).toFixed(1)+' '+(48+r*.5).toFixed(1)+'" stroke="'+p.glow+'" stroke-width="1.4" fill="none" opacity=".55"/>'
        +'</g>';
    }
    if(p.male) out+='<path d="M27 39 Q36 34 45 40" stroke="#0b0d1a" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M55 40 Q64 34 73 39" stroke="#0b0d1a" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
    return out;
  }

  /* ── мордочки ── */
  function extra(id,p){
    var c1=p.c[0];
    if(id==='spark') return '<g filter="url(#fdDshS)"><ellipse cx="50" cy="58" rx="4.2" ry="3.2" fill="#2a1226"/></g><ellipse cx="48.8" cy="57" rx="1.4" ry="1" fill="#fff" opacity=".5"/>'
      +'<path d="M45 62 Q50 66 55 62" stroke="#2a1226" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
      +'<path d="M50 61 L50 63" stroke="#2a1226" stroke-width="2" stroke-linecap="round"/>';
    if(id==='dev') return '<ellipse cx="50" cy="58" rx="4" ry="3" fill="#5ce0a8" opacity=".9"/>'
      +'<path d="M40 68 L44 71 L40 74 M48 74 L56 74" stroke="#5ce0a8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>';
    if(id==='mo') return '<path d="M45 57 Q50 62 55 57" stroke="#123230" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
      +'<g filter="url(#fdDshS)"><ellipse cx="50" cy="54" rx="2.6" ry="2" fill="#123230"/></g>'
      +'<g stroke="#123230" stroke-width="1.6" opacity=".55" stroke-linecap="round"><path d="M20 54 L7 51"/><path d="M20 60 L8 61"/><path d="M80 54 L93 51"/><path d="M80 60 L92 61"/></g>';
    if(id==='luna') return '<g filter="url(#fdDshS)"><path d="M50 53 L44.5 60 L55.5 60 Z" fill="url(#fdBeakG)"/></g><path d="M46 55 L50 54" stroke="#fff" stroke-width="1.2" opacity=".5" stroke-linecap="round"/>';
    if(id==='volt') return '<g filter="url(#fdDshS)"><path d="M50 52 L43.5 60 L56.5 60 Z" fill="url(#fdBeakG)"/></g>'
      +'<g class="fd-bolt" filter="url(#fdDshS)"><path d="M50 66 L44 77 L49.5 77 L46.5 87 L57 74 L51.5 74 L56 66 Z" fill="url(#fdBoltG)"/></g>';
    if(id==='bublik') return '<path d="M42 57 Q50 65 58 57" stroke="#5c1440" stroke-width="2.8" fill="none" stroke-linecap="round"/>'
      +'<path d="M46 60.5 Q50 63 54 60.5" stroke="#ff5c9a" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>';
    if(id==='tor') return '<g filter="url(#fdDsh)"><ellipse cx="50" cy="62" rx="12" ry="9.5" fill="url(#fdMuzzG)"/></g><ellipse cx="50" cy="57.5" rx="4.4" ry="3.3" fill="#2a1a10"/>'
      +'<ellipse cx="48.8" cy="56.5" rx="1.4" ry="1" fill="#fff" opacity=".45"/>'
      +'<path d="M50 60 L50 64 M46 66.5 Q50 69.5 54 66.5" stroke="#2a1a10" stroke-width="2.1" fill="none" stroke-linecap="round"/>';
    if(id==='blade') return '<path d="M46.5 58 L50 61.5 L53.5 58" stroke="#0a0c16" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
      +'<g stroke="#0a0c16" stroke-width="1.4" opacity=".5" stroke-linecap="round"><path d="M21 54 L9 52"/><path d="M21 60 L10 61"/><path d="M79 54 L91 52"/><path d="M79 60 L90 61"/></g>';
    if(id==='drake') return '<path d="M43 58 Q50 63 57 58" stroke="#3a1214" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
      +'<g filter="url(#fdDshS)"><path d="M45 59.5 L44 65 L48.5 60.5 Z M55 59.5 L56 65 L51.5 60.5 Z" fill="#fdf6ea"/></g>'
      +'<ellipse cx="45" cy="53" rx="1.7" ry="2.3" fill="#3a1214" opacity=".75"/><ellipse cx="55" cy="53" rx="1.7" ry="2.3" fill="#3a1214" opacity=".75"/>';
    if(id==='rex') return '<g filter="url(#fdDsh)"><ellipse cx="42" cy="62" rx="9.5" ry="8" fill="'+lt(c1,.12)+'" opacity=".9"/><ellipse cx="58" cy="62" rx="9.5" ry="8" fill="'+lt(c1,.12)+'" opacity=".9"/></g>'
      +'<ellipse cx="50" cy="55" rx="4.6" ry="3.5" fill="#1c2030"/><ellipse cx="48.6" cy="54" rx="1.5" ry="1" fill="#fff" opacity=".45"/>'
      +'<path d="M42 66.5 Q50 70.5 58 66.5" stroke="#1c2030" stroke-width="2.3" fill="none" stroke-linecap="round"/>'
      +'<path d="M44.5 66.5 L44.5 61.5 L48.5 65.5 Z M55.5 66.5 L55.5 61.5 L51.5 65.5 Z" fill="#fdf6ea"/>';
    return '';
  }

  /* ═══ головний рендер ═══ */
  window.fd26PetSVG=function(id,size){
    try{
      if((localStorage.getItem('pet3d')||'1')==='0') return null;      // вимикач скіна
      var p=FD[id]; if(!p) return null;                                 // невідомий → легасі
      ensureDefs();
      var c1=p.c[0], c2=p.c[1];
      var g='pg'+id+Math.round(size);                                   // сумісність з petSVGSleep!
      var gi='pgi'+id+Math.round(size);
      var delay=(ORD[id]||0)*380;
      var st=delay?' style="animation-delay:'+delay+'ms"':'';
      var cheeks=p.male
        ?'<ellipse cx="26" cy="59" rx="5" ry="3.4" fill="'+p.glow+'" opacity=".18"/><ellipse cx="74" cy="59" rx="5" ry="3.4" fill="'+p.glow+'" opacity=".18"/>'
        :'<ellipse cx="26" cy="58" rx="6" ry="4.2" fill="#ff7ac8" opacity=".5" filter="url(#fdSoft)"/><ellipse cx="74" cy="58" rx="6" ry="4.2" fill="#ff7ac8" opacity=".5" filter="url(#fdSoft)"/>';
      var belly=id==='volt'
        ?'<ellipse cx="50" cy="67" rx="24" ry="22" fill="url(#fdBellyG)"/>'
        :id==='luna'
        ?'<circle cx="36" cy="48" r="15.5" fill="#fff" opacity=".13"/><circle cx="64" cy="48" r="15.5" fill="#fff" opacity=".13"/><ellipse cx="50" cy="67" rx="22" ry="17" fill="url(#fdBellyG)" opacity=".7"/>'
        :'<ellipse cx="50" cy="67" rx="22" ry="17" fill="url(#fdBellyG)" opacity="'+(p.male?'.5':'.75')+'"/>';
      return '<svg viewBox="0 0 100 100" width="'+size+'" height="'+size+'" data-fd-pet style="display:block;overflow:visible">'
        +'<defs>'
        +'<radialGradient id="'+g+'" cx=".34" cy=".26" r=".95">'
          +'<stop offset="0%" stop-color="'+lt(c1,.42)+'"/>'
          +'<stop offset="34%" stop-color="'+lt(c1,.1)+'"/>'
          +'<stop offset="68%" stop-color="'+mixc(c1,c2,.7)+'"/>'
          +'<stop offset="100%" stop-color="'+dk(c2,.38)+'"/></radialGradient>'
        +'<radialGradient id="'+gi+'" cx=".4" cy=".35" r=".9"><stop offset="0%" stop-color="'+dk(c2,.15)+'"/><stop offset="100%" stop-color="'+dk(c2,.5)+'"/></radialGradient>'
        +'</defs>'
        +'<ellipse class="fd-glowp" cx="50" cy="94" rx="27" ry="6" fill="'+p.glow+'" filter="url(#fdSoft)" opacity=".4"'+st+'/>'
        +'<ellipse cx="50" cy="93.5" rx="17" ry="3" fill="#000" opacity=".4" filter="url(#fdSoft)"/>'
        +'<g class="fd-tilt"><g class="fd-body"'+st+'>'
          +'<g class="fd-ears"'+st+'>'+ears(id,g,gi,p)+'</g>'
          +'<path d="'+HEAD+'" fill="url(#'+g+')"/>'
          /* ambient occlusion знизу */
          +'<path d="M50 91 C31 91 15 79 13 60 C21 82 35 87.5 50 87.5 C65 87.5 79 82 87 60 C85 79 69 91 50 91 Z" fill="'+dk(c2,.55)+'" opacity=".55" filter="url(#fdSoft)"/>'
          /* фрезнель-кант */
          +'<path d="'+HEAD+'" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5" filter="url(#fdSoftXS)" opacity=".8"/>'
          /* два джерела: ember справа (вогнище) + фіолет зліва (ніч) */
          +'<path class="fd-rimw" d="M84 38 C90 50 88 68 78 78" stroke="#ffb08a" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#fdSoft)"/>'
          +'<path class="fd-rimc" d="M16 38 C10 50 12 68 22 78" stroke="#8b7cff" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#fdSoft)"/>'
          /* глянець — їде за світлом */
          +'<g class="fd-spec"><ellipse cx="38" cy="25" rx="17" ry="9" fill="#fff" opacity=".28" filter="url(#fdSoft)" transform="rotate(-18 38 25)"/>'
          +'<ellipse cx="30" cy="33" rx="4.5" ry="2.6" fill="#fff" opacity=".5" transform="rotate(-24 30 33)"/></g>'
          +belly
          +'<g class="fd-eyes"'+st+'>'+eyes(id,p)+'</g>'
          +extra(id,p)+cheeks
          /* зерно поверх, обрізане формою голови; якщо патерн не зібрався — не малюємо */
          +'<path d="'+HEAD+'" fill="url(#fdGrainP) none" opacity=".07" style="mix-blend-mode:overlay"/>'
        +'</g></g>'
        +'</svg>';
    }catch(e){ console.error('fd26PetSVG',e); return null; }            // будь-що пішло не так → легасі
  };

  /* реєстр ключів */
  try{
    if(Array.isArray(window.FLOW_KEYS)){
      if(window.FLOW_KEYS.indexOf('pet3d')<0) window.FLOW_KEYS.push('pet3d');
      if(window.FLOW_KEYS.indexOf('pet3d_fx')<0) window.FLOW_KEYS.push('pet3d_fx');
    }
  }catch(_){}

  /* ═══ інтерактивне світло + погляд (опційний шар) ═══ */
  try{
    var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    var fxOn=(localStorage.getItem('pet3d_fx')||'1')==='1';
    if(!reduce&&fxOn){
      var px=null,py=null,glx=0,gly=0,dirty=false,lastInput=0,useGyro=false,raf=false;
      var setL=function(x,y){ glx=Math.max(-1,Math.min(1,x)); gly=Math.max(-1,Math.min(1,y)); dirty=true; kick(); };
      var frame=function(){
        raf=false;
        if(!dirty) return;
        dirty=false;
        document.documentElement.style.setProperty('--fdlx',glx.toFixed(3));
        document.documentElement.style.setProperty('--fdly',gly.toFixed(3));
        if(px!=null){
          var svgs=document.querySelectorAll('svg[data-fd-pet]');
          for(var i=0;i<svgs.length;i++){
            var r=svgs[i].getBoundingClientRect();
            if(!r.width) continue;
            var dx=px-(r.left+r.width/2), dy=py-(r.top+r.height*.48);
            var m=Math.max(Math.hypot(dx,dy),1), k=Math.min(1,m/140);
            svgs[i].style.setProperty('--fdex',(dx/m*k).toFixed(3));
            svgs[i].style.setProperty('--fdey',(dy/m*k).toFixed(3));
          }
        }
      };
      var kick=function(){ if(!raf){ raf=true; requestAnimationFrame(frame); } };
      document.addEventListener('pointermove',function(e){
        if(useGyro) return;
        px=e.clientX; py=e.clientY; lastInput=Date.now();
        setL((px/innerWidth)*2-1,(py/innerHeight)*2-1);
      },{passive:true});
      document.addEventListener('pointerdown',function(e){
        px=e.clientX; py=e.clientY; lastInput=Date.now();
        if(!useGyro) setL((px/innerWidth)*2-1,(py/innerHeight)*2-1);
      },{passive:true});
      /* гіроскоп: тільки там, де не треба дозволу (Android/десктоп); iOS лишається на дотику */
      try{
        if(typeof DeviceOrientationEvent!=='undefined'&&!DeviceOrientationEvent.requestPermission){
          addEventListener('deviceorientation',function(e){
            if(e.gamma==null) return;
            useGyro=true; lastInput=Date.now();
            setL(Math.max(-1,Math.min(1,e.gamma/28)),Math.max(-1,Math.min(1,(e.beta-45)/32)));
          });
        }
      }catch(_){}
      /* idle: без вводу 4с — випадкові погляди, як у живих */
      setInterval(function(){
        try{
          if(Date.now()-lastInput<4000) return;
          if(document.hidden) return;
          var svgs=document.querySelectorAll('svg[data-fd-pet]');
          if(!svgs.length) return;
          var ex=(Math.random()*2-1)*.7, ey=(Math.random()*2-1)*.5;
          for(var i=0;i<svgs.length;i++){
            svgs[i].style.setProperty('--fdex',ex.toFixed(2));
            svgs[i].style.setProperty('--fdey',ey.toFixed(2));
          }
          setL(ex*.5,ey*.4);
        }catch(_){}
      },3200);
    }
  }catch(_){}

}catch(e){ console.error('fd26 init',e); }
})();
