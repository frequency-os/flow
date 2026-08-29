
/* ════════════════ FDV · Голосовий острівець (Dynamic Island) ════════════════
   Повністю АДИТИВНИЙ шар: жодних правок чужих функцій.
   — Перехоплює тапи по #aiMic / #fsMic на capture-фазі → свій запис.
   — VAD: авто-стоп після ~1.7с тиші (адаптивний поріг шуму).
   — Після запису: транскрипція через воркер /transcribe → aiChatSend/flowSpotSend.
   — Плеєр останнього голосового у капсулі (play/pause + доріжка).
   — Wake «Спарк»: кнопка-«голос» у рядку вводу; SpeechRecognition, фолбек —
     Whisper-чанки по ~2.6с через воркер (тільки коли є звук — економія кредитів).
   Вимикач: localStorage.setItem('fd_isl','0') → стара поведінка байт-у-байт.
   Ключі: fd_isl (кіл-світч), fd_wake (стан wake) — реєструються у FLOW_KEYS. */
(function(){
'use strict';
try{
  if(window.__fdVoice) return; window.__fdVoice=1;

  var ON_KEY='fd_isl', WAKE_KEY='fd_wake';
  function fdOn(){ try{ return localStorage.getItem(ON_KEY)!=='0'; }catch(_){ return true; } }
  try{ if(Array.isArray(window.FLOW_KEYS)){
    ['fd_isl','fd_wake','fd_tts','fd_tts_voice'].forEach(function(k){
      if(window.FLOW_KEYS.indexOf(k)<0) window.FLOW_KEYS.push(k); });
  } }catch(_){}

  /* ── проби глобалів головного скрипта (top-level function/const видно звідси) ── */
  function G(n){ try{ var v=(0,eval)(n); return v; }catch(_){ try{ return window[n]; }catch(__){ return undefined; } } }
  function Gf(n){ var v=G(n); return typeof v==='function'?v:null; }
  function toast(m){ var f=Gf('plToast'); if(f){ try{ f(m); return; }catch(_){}} try{ console.log('[fdv]',m); }catch(_){}}
  function endpoint(){
    var f=Gf('aiEndpoint'); if(f){ try{ var u=f(); if(u) return u; }catch(_){}}
    try{ var v=(localStorage.getItem('ai_endpoint')||'').trim(); if(v) return v; }catch(_){}
    return 'https://flowai.life-yaroslav-kril.workers.dev';
  }
  function petName(){
    try{ var P=G('FLOW_PETS'), c=Gf('petCur'); if(P&&c&&P[c()]&&P[c()].name) return P[c()].name; }catch(_){}
    return 'Спарк';
  }
  function haptic(){ try{ var T=window.Telegram; T&&T.WebApp&&T.WebApp.HapticFeedback&&T.WebApp.HapticFeedback.impactOccurred('light'); }catch(_){ } try{ navigator.vibrate&&navigator.vibrate(25); }catch(_){}}

  /* ═══ Професійний голос Флоу: нейронний TTS через воркер (/tts, Edge-нейроголоси uk-UA),
     фолбек — системний. Перехоплюємо speechSynthesis.speak/cancel, тому працює для всіх
     озвучок апки без правок aiSpeak. Вимкнути: localStorage.fd_tts='0'. ═══ */
  /* реєстр голосів для перемикача (label → id, характер) */
  window.FDV_VOICES=[
    {id:'uk-UA-OstapNeural',   t:'Остап',   d:'укр · чоловічий',    rate:'+2%', pitch:'-2Hz'},
    {id:'uk-UA-PolinaNeural',  t:'Поліна',  d:'укр · жіночий',      rate:'+2%', pitch:'+0Hz'},
    {id:'en-US-AndrewMultilingualNeural', t:'Ендрю', d:'теплий, жвавий', rate:'+3%', pitch:'+0Hz'},
    {id:'en-US-AvaMultilingualNeural',    t:'Ава',   d:'мʼякий, живий',  rate:'+3%', pitch:'+0Hz'},
    {id:'en-US-BrianMultilingualNeural',  t:'Браян', d:'спокійний',      rate:'+2%', pitch:'-2Hz'},
    {id:'en-US-EmmaMultilingualNeural',   t:'Емма',  d:'бадьорий',       rate:'+4%', pitch:'+0Hz'}
  ];
  function ttsVoiceCfg(){
    var id='uk-UA-OstapNeural';
    try{ id=localStorage.getItem('fd_tts_voice')||id; }catch(_){}
    var v=window.FDV_VOICES.filter(function(x){return x.id===id;})[0];
    return v||{id:id,rate:'+2%',pitch:'+0Hz'};
  }
  /* прибираємо те, що робить озвучку «роботом»: markdown, код, зайві символи.
     ЕМОДЗІ НЕ ЧИСТИМО ТУТ — вони летять у /tts як підказка настрою (радість/сум/спокій),
     воркер сам їх зчитує в SSML-просодію і тоді вже вирізає перед синтезом. */
  function ttsClean(s){
    s=String(s||'');
    try{
      s=s.replace(/```[\s\S]*?```/g,' ');                 // блоки коду
      s=s.replace(/`[^`]*`/g,' ');                          // інлайн-код
      s=s.replace(/https?:\/\/\S+/g,' ');                   // посилання
      s=s.replace(/[*_#>~|]+/g,' ');                        // markdown-символи
      s=s.replace(/\s*[·•—–-]\s*/g,', ');                    // роздільники → природна пауза
      s=s.replace(/\$(\d)/g,'$1 доларів');
      s=s.replace(/(\d)\s*€/g,'$1 євро').replace(/€/g,' євро');
      s=s.replace(/(\d)\s*₴/g,'$1 гривень').replace(/₴/g,' гривень');
      s=s.replace(/\s{2,}/g,' ').replace(/\s+([,.!?])/g,'$1').trim();
    }catch(_){}
    return s;
  }
  var __ttsLastWarn=0;
  function ttsWarnOnce(msg){
    var now=Date.now();
    if(now-__ttsLastWarn<120000) return; // не частіше ніж раз на 2 хв
    __ttsLastWarn=now;
    try{ plToast(msg); }catch(_){}
  }
  (function(){
    try{
      var ss=window.speechSynthesis; if(!ss||typeof ss.speak!=='function') return;
      var origSpeak=ss.speak.bind(ss), origCancel=(typeof ss.cancel==='function')?ss.cancel.bind(ss):function(){};
      var curA=null, seq=0, ttsDead=false;
      function stopA(){ try{ if(curA){ curA.pause(); curA.src=''; } }catch(_){ } curA=null; }
      ss.cancel=function(){ seq++; stopA(); try{ origCancel(); }catch(_){}};
      ss.speak=function(u){
        try{
          var txt=ttsClean((u&&u.text)||'');
          if(!txt.trim()) return;
          var off=false; try{ off=localStorage.getItem('fd_tts')==='0'; }catch(_){}
          if(off||ttsDead){ return origSpeak(u); }
          var my=++seq; stopA(); try{ origCancel(); }catch(_){}
          var vc=ttsVoiceCfg();
          fetch(endpoint().replace(/\/+$/,'')+'/tts',{method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({text:txt.slice(0,700),voice:vc.id,rate:vc.rate||'+2%',pitch:vc.pitch||'+0Hz'})})
          .then(function(r){
            if(r.status===404||r.status===405){ ttsDead=true; throw new Error('no /tts'); } // старий воркер
            if(!r.ok) throw new Error('http '+r.status);
            var engine=r.headers.get('X-TTS-Engine')||'';
            if(engine==='edge') ttsWarnOnce('🔊 основний голос зараз недоступний — звучить запасний');
            return r.blob();
          })
          .then(function(b){
            if(my!==seq) return;                      // вже скасовано/замінено
            if(!b||b.size<600) throw new Error('empty');
            stopA();
            curA=new Audio(URL.createObjectURL(b));
            curA.onended=function(){ if(my===seq) curA=null; };
            var pp=curA.play();
            if(pp&&pp.catch) pp.catch(function(){ if(my===seq) origSpeak(u); });
          })
          .catch(function(){ if(my===seq){ ttsWarnOnce('🔊 нейронний голос недоступний — тимчасово системний'); try{ origSpeak(u); }catch(_){} } });
        }catch(e){ try{ origSpeak(u); }catch(_){} }
      };
    }catch(e){ console.error('fdv tts',e); }
  })();

  /* ── SVG (штрих 1.9, як у таббарі) ── */
  function sv(inner){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+inner+'</svg>'; }
  var I={
    mic:  sv('<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/>'),
    voice:sv('<path d="M3 10v4M7 7v10M11 4v16M15 8v8M19 6v12M21.5 10v4"/>'),
    x:    sv('<path d="M18 6 6 18M6 6l12 12"/>'),
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="4" height="14" rx="1.4"/><rect x="13.5" y="5" width="4" height="14" rx="1.4"/></svg>',
    check:sv('<path d="M20 6 9 17l-5-5"/>')
  };

  /* ── стилі ── */
  var css=''
  +'.fdv-isl{position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);left:50%;z-index:100000;'
  +'  width:min(362px,calc(100% - 24px));height:70px;border-radius:35px;'
  +'  transform:translateX(-50%) translateY(-52px) scale(.2);transform-origin:50% -20%;opacity:0;pointer-events:none;overflow:hidden;'
  +'  display:flex;align-items:center;'
  +'  background:linear-gradient(160deg,rgba(30,22,44,.96),rgba(14,10,26,.96));'
  +'  backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);'
  +'  border:1px solid rgba(255,157,92,.22);'
  +'  box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 18px 50px rgba(0,0,0,.55),0 0 44px rgba(255,120,90,.12);'
  +'  transition:transform .55s cubic-bezier(.22,1.36,.36,1),opacity .3s ease}'
  +'.fdv-isl.open{transform:translateX(-50%) translateY(0) scale(1);opacity:1;pointer-events:auto}'
  +'.fdv-isl.play{border-color:rgba(139,124,255,.3);box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 18px 50px rgba(0,0,0,.55),0 0 40px rgba(120,110,255,.14)}'
  +'.fdv-rec,.fdv-playui{display:flex;align-items:center;gap:9px;width:100%;padding:0 9px}'
  +'.fdv-mic{width:46px;height:46px;flex:none;border-radius:50%;display:grid;place-items:center;color:#fff;position:relative;'
  +'  background:linear-gradient(135deg,#ff9d5c,#ff5c8a)}'
  +'.fdv-mic svg{width:19px;height:19px}'
  +'.fdv-isl.open:not(.play) .fdv-mic::after{content:"";position:absolute;inset:-5px;border-radius:50%;'
  +'  border:2px solid rgba(255,140,110,.5);animation:fdvPulse 1.2s ease-out infinite}'
  +'@keyframes fdvPulse{0%{transform:scale(.85);opacity:.9}100%{transform:scale(1.35);opacity:0}}'
  +'.fdv-mid{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px}'
  +'.fdv-wave{width:100%;height:30px;display:block}'
  +'.fdv-st{font-size:10.5px;color:#8f8aa8;line-height:1;height:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .3s ease}'
  +'.fdv-st.hush{color:#ff9d5c}'
  +'.fdv-tm{flex:none;font:600 13px/1 ui-monospace,"SF Mono",Menlo,monospace;color:#ff9d5c;min-width:36px;text-align:right}'
  +'.fdv-x{width:36px;height:36px;flex:none;border-radius:50%;border:0;cursor:pointer;'
  +'  background:rgba(255,255,255,.06);color:#8f8aa8;display:grid;place-items:center;transition:transform .2s cubic-bezier(.22,1.36,.36,1)}'
  +'.fdv-x:active{transform:scale(.88)}.fdv-x svg{width:14px;height:14px}'
  +'.fdv-stop{width:42px;height:42px;flex:none;border-radius:50%;border:1px solid rgba(255,255,255,.08);cursor:pointer;'
  +'  background:rgba(255,255,255,.07);color:#eceaf6;display:grid;place-items:center;transition:transform .2s cubic-bezier(.22,1.36,.36,1)}'
  +'.fdv-stop:active{transform:scale(.9)}'
  +'.fdv-stop i{width:13px;height:13px;border-radius:3.5px;background:currentColor;display:block}'
  +'.fdv-sil{position:absolute;left:0;bottom:0;height:3px;width:0%;border-radius:2px;'
  +'  background:linear-gradient(90deg,#ff9d5c,#ff5c8a)}'
  +'.fdv-pb{width:40px;height:40px;flex:none;border-radius:50%;border:0;cursor:pointer;color:#fff;display:grid;place-items:center;'
  +'  background:linear-gradient(135deg,#8b7cff,#6e5df0);transition:transform .25s cubic-bezier(.22,1.36,.36,1)}'
  +'.fdv-pb:active{transform:scale(.9)}.fdv-pb svg{width:15px;height:15px}'
  +'.fdv-ptm{font:600 12px/1 ui-monospace,"SF Mono",Menlo,monospace;color:#c4a8ff;min-width:34px;text-align:right}'
  +'.fdv-fly{position:fixed;z-index:100001;width:44px;height:44px;border-radius:16px;display:grid;place-items:center;color:#fff;'
  +'  background:linear-gradient(135deg,#ff9d5c,#ff5c8a);box-shadow:0 8px 30px rgba(255,120,90,.4);pointer-events:none;'
  +'  transition:transform .5s cubic-bezier(.22,1.36,.36,1),border-radius .5s cubic-bezier(.22,1.36,.36,1),opacity .25s ease .35s}'
  +'.fdv-fly svg{width:19px;height:19px}'
  +'.fdv-wakebtn{position:relative}'
  +'.fdv-wakebtn.on{color:#c4a8ff!important;border-color:rgba(139,124,255,.4)!important;'
  +'  background:linear-gradient(135deg,rgba(139,124,255,.3),rgba(139,124,255,.12))!important;'
  +'  animation:fdvEar 3s ease-in-out infinite}'
  +'@keyframes fdvEar{0%,100%{box-shadow:0 0 0 0 rgba(139,124,255,0)}50%{box-shadow:0 0 16px 2px rgba(139,124,255,.35)}}'
  +'.fdv-heard{position:fixed;top:calc(env(safe-area-inset-top,0px) + 96px);left:50%;transform:translate(-50%,0) scale(.7);z-index:100002;'
  +'  display:flex;align-items:center;gap:9px;padding:10px 18px;border-radius:24px;opacity:0;pointer-events:none;'
  +'  background:linear-gradient(160deg,rgba(30,22,44,.96),rgba(14,10,26,.96));'
  +'  border:1px solid rgba(255,157,92,.3);color:#eceaf6;'
  +'  box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 14px 44px rgba(0,0,0,.5),0 0 40px rgba(255,120,90,.15);'
  +'  font-size:14px;font-weight:600;transition:opacity .3s ease,transform .5s cubic-bezier(.22,1.36,.36,1)}'
  +'.fdv-heard.on{opacity:1;transform:translate(-50%,0) scale(1)}'
  +'.fdv-heard svg{width:18px;height:18px;color:#ff9d5c}'
  +'@media (prefers-reduced-motion:reduce){.fdv-isl,.fdv-fly,.fdv-heard{transition:none!important}'
  +'  .fdv-mic::after,.fdv-wakebtn.on{animation:none!important}}'
  +'.fdv-vsheet{position:fixed;inset:0;z-index:100003;display:none;align-items:flex-end;justify-content:center;'
  +'  background:rgba(4,3,10,.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}'
  +'.fdv-vsheet.open{display:flex}'
  +'.fdv-vcard{width:100%;max-width:440px;margin:0 8px calc(10px + env(safe-area-inset-bottom));border-radius:26px;padding:14px 12px 10px;'
  +'  background:linear-gradient(160deg,rgba(26,20,40,.98),rgba(14,10,26,.98));'
  +'  border:1px solid rgba(255,255,255,.1);box-shadow:0 -10px 50px rgba(0,0,0,.5);'
  +'  transform:translateY(18px);transition:transform .4s cubic-bezier(.22,1.36,.36,1)}'
  +'.fdv-vsheet.open .fdv-vcard{transform:translateY(0)}'
  +'.fdv-vh{display:flex;align-items:center;gap:8px;padding:2px 8px 10px;color:#eceaf6;font-weight:700;font-size:15px}'
  +'.fdv-vh svg{width:18px;height:18px;color:#c4a8ff}'
  +'.fdv-vrow{display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:16px;cursor:pointer;transition:background .2s ease}'
  +'.fdv-vrow:active{background:rgba(255,255,255,.05)}'
  +'.fdv-vrow.sel{background:linear-gradient(135deg,rgba(139,124,255,.22),rgba(139,124,255,.08))}'
  +'.fdv-vplay{width:38px;height:38px;flex:none;border-radius:50%;border:0;cursor:pointer;color:#fff;display:grid;place-items:center;'
  +'  background:linear-gradient(135deg,#8b7cff,#6e5df0)}.fdv-vplay svg{width:15px;height:15px}'
  +'.fdv-vmeta{flex:1;min-width:0}.fdv-vmeta b{display:block;color:#eceaf6;font-size:14.5px}'
  +'.fdv-vmeta small{display:block;color:#8f8aa8;font-size:11.5px;margin-top:1px}'
  +'.fdv-vtick{width:20px;flex:none;color:#8b7cff}.fdv-vtick svg{width:18px;height:18px}'
  +'.fdv-vclose{margin:8px 8px 2px;width:calc(100% - 16px);padding:12px;border-radius:16px;border:1px solid rgba(255,255,255,.1);'
  +'  background:rgba(255,255,255,.05);color:#eceaf6;font:600 14px inherit;cursor:pointer}';
  try{
    var stl=document.createElement('style'); stl.id='fdVoiceCss'; stl.textContent=css;
    document.head.appendChild(stl);
  }catch(e){ console.error('fdv css',e); }

  /* ── DOM острівця ── */
  var isl=null;
  function ensureIsl(){
    if(isl) return isl;
    isl=document.createElement('div'); isl.className='fdv-isl'; isl.id='fdvIsl';
    isl.innerHTML=''
      +'<div class="fdv-rec" id="fdvRecUI">'
      +'  <div class="fdv-mic" id="fdvMicSlot">'+I.mic+'</div>'
      +'  <div class="fdv-mid"><canvas class="fdv-wave" id="fdvWave"></canvas><div class="fdv-st" id="fdvSt">Слухаю…</div></div>'
      +'  <div class="fdv-tm" id="fdvTm">0:00</div>'
      +'  <button class="fdv-x" id="fdvCancel" aria-label="Скасувати">'+I.x+'</button>'
      +'  <button class="fdv-stop" id="fdvStop" aria-label="Зупинити й надіслати"><i></i></button>'
      +'  <div class="fdv-sil" id="fdvSil"></div>'
      +'</div>'
      +'<div class="fdv-playui" id="fdvPlayUI" style="display:none">'
      +'  <button class="fdv-pb" id="fdvPb">'+I.play+'</button>'
      +'  <canvas class="fdv-wave" id="fdvPwave" style="flex:1;min-width:0"></canvas>'
      +'  <span class="fdv-ptm" id="fdvPtm">0:00</span>'
      +'  <button class="fdv-x" id="fdvPx" aria-label="Закрити">'+I.x+'</button>'
      +'</div>';
    document.body.appendChild(isl);
    isl.querySelector('#fdvStop').onclick=function(){ REC.stop(true); };
    isl.querySelector('#fdvCancel').onclick=function(){ REC.stop(false); };
    isl.querySelector('#fdvPx').onclick=function(){ hideIsl(); };
    return isl;
  }
  function hideIsl(){ if(!isl) return; isl.classList.remove('open');
    playerReset(); setTimeout(function(){ if(isl) isl.classList.remove('play'); },300); }

  /* ── canvas-хелпери ── */
  function ctx2d(c){ try{ return (c&&c.getContext&&c.getContext('2d'))||null; }catch(_){ return null; } }
  function fit(c){ var d=window.devicePixelRatio||1, r=c.getBoundingClientRect();
    var W=Math.max(1,Math.round(r.width*d)), H=Math.max(1,Math.round(r.height*d));
    if(c.width!==W||c.height!==H){ c.width=W; c.height=H; } return d; }
  function bar(x,px,y,pw,h){ x.beginPath();
    if(x.roundRect) x.roundRect(px,y,pw,h,pw/2); else x.rect(px,y,pw,h); x.fill(); }

  /* ═══ ЗАПИС: двигун ═══ */
  var REC={ active:false, ctx:'ai' };
  var stream=null,audioCtx=null,analyser=null,dataArr=null,mrec=null,chunks=[],recBlob=null;
  var histLive=[],recHist=[],t0=0,timerIv=null,raf=null;
  var SIL_MS=1700,MIN_SPEECH=700,noiseFloor=0.03,spokeAt=0,speechMs=0,lastFrame=0;
  function nowMs(){ return (window.performance&&performance.now)?performance.now():Date.now(); }

  async function micOn(){
    if(analyser) return true;
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia) return false;
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:true});
      var AC=window.AudioContext||window.webkitAudioContext;
      if(AC){
        audioCtx=new AC();
        if(audioCtx.state==='suspended'){ try{ await audioCtx.resume(); }catch(_){}}
        var src=audioCtx.createMediaStreamSource(stream);
        analyser=audioCtx.createAnalyser(); analyser.fftSize=512; analyser.smoothingTimeConstant=.5;
        src.connect(analyser); dataArr=new Uint8Array(analyser.frequencyBinCount);
      }
      return true;
    }catch(e){ return false; }
  }
  function micOff(){
    try{ if(stream) stream.getTracks().forEach(function(t){t.stop()}); }catch(_){}
    try{ if(audioCtx) audioCtx.close(); }catch(_){}
    stream=null; audioCtx=null; analyser=null; dataArr=null;
  }
  function level(){
    if(!analyser) return 0.25+Math.random()*.1; // без аналізатора — нейтральна хвиля, VAD не спрацює
    analyser.getByteFrequencyData(dataArr);
    var s=0,n=Math.min(80,dataArr.length); for(var i=2;i<n;i++) s+=dataArr[i];
    return Math.min(1,(s/(n-2)/255)*2.6);
  }
  function chime(up){
    try{
      var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
      var own=!(audioCtx&&audioCtx.state==='running');
      var ctx=own?new AC():audioCtx;
      var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;
      o.type='sine';
      if(up){ o.frequency.setValueAtTime(620,t); o.frequency.exponentialRampToValueAtTime(920,t+.14); }
      else  { o.frequency.setValueAtTime(760,t); o.frequency.exponentialRampToValueAtTime(480,t+.16); }
      g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(0.05,t+.02);
      g.gain.exponentialRampToValueAtTime(0.0001,t+.18);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+.2);
      if(own) setTimeout(function(){ try{ ctx.close(); }catch(_){} },350);
    }catch(_){}
  }
  function drawLive(v){
    var c=document.getElementById('fdvWave'); if(!c) return;
    var d=fit(c), x=ctx2d(c); if(!x) return;
    var N=29,bw=c.width/N,mid=c.height/2;
    if(!histLive.length) for(var i=0;i<N;i++) histLive.push(.05);
    histLive.push(v); if(histLive.length>N) histLive.shift();
    x.clearRect(0,0,c.width,c.height);
    var g=x.createLinearGradient(0,0,c.width,0);
    g.addColorStop(0,'#8b7cff'); g.addColorStop(.55,'#ff9d5c'); g.addColorStop(1,'#ff5c8a');
    x.fillStyle=g;
    for(var i=0;i<N;i++){ var h=Math.max(3*d,histLive[i]*c.height*.92);
      bar(x,i*bw+bw*.22,mid-h/2,bw*.56,h); }
  }
  function loop(){
    if(!REC.active) return;
    var now=nowMs(), dt=lastFrame?now-lastFrame:16; lastFrame=now;
    var v=level();
    drawLive(v); recHist.push(v);
    if(recHist.length>2400) recHist.splice(0,600);
    if(analyser){
      if(v<noiseFloor*1.5+0.02) noiseFloor=noiseFloor*.97+v*.03;
      var thr=Math.max(0.07,noiseFloor*3+0.045);
      var st=document.getElementById('fdvSt'),bp=document.getElementById('fdvSil');
      if(v>thr){ spokeAt=now; speechMs+=dt;
        if(st){ st.textContent='Слухаю…'; st.classList.remove('hush'); } if(bp) bp.style.width='0%';
      } else if(speechMs>MIN_SPEECH&&spokeAt){
        var sil=now-spokeAt,k=Math.min(1,sil/SIL_MS);
        if(st){ st.textContent='Тиша… завершую'; st.classList.add('hush'); }
        if(bp) bp.style.width=(k*100)+'%';
        if(sil>=SIL_MS){ REC.stop(true); return; }
      }
    }
    raf=requestAnimationFrame(loop);
  }
  function tick(){ var s=Math.floor((Date.now()-t0)/1000),el=document.getElementById('fdvTm');
    if(el) el.textContent=Math.floor(s/60)+':'+('0'+(s%60)).slice(-2); }

  function flyIn(fromEl){
    try{
      ensureIsl();
      isl.classList.remove('play');
      isl.querySelector('#fdvRecUI').style.display='flex';
      isl.querySelector('#fdvPlayUI').style.display='none';
      isl.classList.add('open');
      var red=false; try{ red=matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(_){}
      if(red||!fromEl||!fromEl.getBoundingClientRect) return;
      var m=fromEl.getBoundingClientRect(); if(!m.width) return;
      var fly=document.createElement('div'); fly.className='fdv-fly'; fly.innerHTML=I.mic;
      fly.style.left=m.left+'px'; fly.style.top=m.top+'px';
      document.body.appendChild(fly);
      var slot=isl.querySelector('#fdvMicSlot').getBoundingClientRect();
      requestAnimationFrame(function(){
        fly.style.transform='translate('+(slot.left-m.left)+'px,'+(slot.top-m.top)+'px) scale('+((slot.width||46)/(m.width||44))+')';
        fly.style.borderRadius='50%'; fly.style.opacity='0';
      });
      setTimeout(function(){ if(fly.parentNode) fly.remove(); },560);
    }catch(e){ console.error('fdv fly',e); }
  }

  REC.start=async function(ctxName,fromEl){
    if(REC.active) return;
    REC.active=true; REC.ctx=ctxName||'ai';
    histLive=[]; recHist=[]; chunks=[]; recBlob=null;
    noiseFloor=0.03; spokeAt=0; speechMs=0; lastFrame=0;
    try{ var f=Gf('aiSpeakStop'); f&&f(); }catch(_){}
    wakePause();
    var ok=await micOn();
    if(!ok){ REC.active=false; wakeResume();
      toast(micDenyMsg()); return; }
    chime(true); haptic();
    if(typeof MediaRecorder!=='undefined'&&stream){
      try{
        var mime=MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported('audio/mp4')?'audio/mp4'
          :(MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'');
        mrec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
        mrec.ondataavailable=function(e){ if(e.data&&e.data.size) chunks.push(e.data); };
        mrec.start();
      }catch(e){ mrec=null; }
    }
    t0=Date.now(); tick(); timerIv=setInterval(tick,250);
    var st=document.getElementById('fdvSt'); ensureIsl();
    st=isl.querySelector('#fdvSt'); st.textContent='Слухаю…'; st.classList.remove('hush');
    isl.querySelector('#fdvSil').style.width='0%';
    flyIn(fromEl);
    raf=requestAnimationFrame(loop);
  };
  REC.stop=function(commit){
    if(!REC.active) return;
    REC.active=false;
    clearInterval(timerIv); if(raf) cancelAnimationFrame(raf);
    var dur=(Date.now()-t0)/1000;
    if(commit) chime(false);
    var finish=function(){
      micOff();
      if(commit&&recBlob&&recBlob.size>1200&&(speechMs>300||!analyserWas||dur>1.2)) afterRec(dur);
      else{ hideIsl(); if(commit) toast('🎙 Занадто коротко — спробуй ще'); }
      wakeResume();
    };
    var analyserWas=!!analyser;
    if(mrec&&mrec.state!=='inactive'){
      var mr=mrec; mrec=null;
      mr.onstop=function(){ try{ recBlob=new Blob(chunks,{type:mr.mimeType||'audio/mp4'}); }catch(_){}
        finish(); };
      try{ mr.stop(); }catch(e){ finish(); }
    } else { mrec=null; finish(); }
  };

  /* ── після запису: транскрипція + плеєр ── */
  async function transcribe(blob){
    try{
      var url=endpoint().replace(/\/+$/,'')+'/transcribe';
      var b64=await new Promise(function(res,rej){
        var r=new FileReader();
        r.onload=function(){ var s=String(r.result); res(s.slice(s.indexOf(',')+1)); };
        r.onerror=function(){ rej(new Error('read')); };
        r.readAsDataURL(blob);
      });
      var res=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({audio_b64:b64,mime:blob.type||''})});
      var j={}; try{ j=await res.json(); }catch(_){}
      if(!res.ok){ toast('⚠️ Розпізнавання: '+((j&&j.error)||('HTTP '+res.status))); return ''; }
      return (j&&j.text||'').trim();
    }catch(e){ toast('⚠️ Транскрипція не вдалась: '+String(e&&e.message||e)); return ''; }
  }
  function routeSend(ctxName,text){
    try{
      if(ctxName==='wake') ctxName=document.getElementById('aiScr')?'ai':'spot';
      if(ctxName==='spot'&&!document.getElementById('flowSpot')&&window.flowSpotOpen){
        try{ window.flowSpotOpen(); }catch(_){}
        setTimeout(function(){ routeSend('spot-ready',text); },380); return;
      }
      if(ctxName==='ai'){
        var f=Gf('aiChatSend');
        if(f){ f('🎙 '+text); return; }
        var inp=document.getElementById('aiInput'),b=document.getElementById('aiSend');
        if(inp&&b){ inp.value='🎙 '+text; b.click(); return; }
      } else {
        var fs=Gf('flowSpotSend');
        if(fs){ fs(text); return; }
        var fi=document.getElementById('fsInput'),fb=document.getElementById('fsSend');
        if(fi&&fb){ fi.value=text; fb.click(); return; }
      }
      toast('⚠️ Не знайшов, куди надіслати текст');
    }catch(e){ console.error('fdv send',e); }
  }
  async function afterRec(dur){
    var st=isl&&isl.querySelector('#fdvSt');
    if(st){ st.textContent='Розпізнаю…'; st.classList.remove('hush'); }
    var ctxName=REC.ctx, blob=recBlob, hist=recHist.slice();
    var text=await transcribe(blob);
    showPlayer(blob,hist,dur);
    if(text) routeSend(ctxName,text);
    else toast('🎙 Не розчув — скажи чіткіше і трохи довше');
  }

  /* ── плеєр останнього голосового ── */
  var pAudio=null,pPlaying=false,pRaf=null;
  function downsample(arr,n){
    if(!arr||!arr.length){ arr=[]; for(var i=0;i<n;i++) arr.push(.15+Math.random()*.5); }
    var out=[],step=arr.length/n;
    for(var i=0;i<n;i++){ var a=Math.floor(i*step),b=Math.max(a+1,Math.floor((i+1)*step)),m=0;
      for(var j=a;j<b&&j<arr.length;j++) m=Math.max(m,arr[j]); out.push(m); }
    return out;
  }
  function drawP(bars,progress){
    var c=document.getElementById('fdvPwave'); if(!c) return;
    var d=fit(c),x=ctx2d(c); if(!x) return;
    var N=bars.length,bw=c.width/N,mid=c.height/2;
    x.clearRect(0,0,c.width,c.height);
    for(var i=0;i<N;i++){ var h=Math.max(3*d,bars[i]*c.height*.9);
      x.fillStyle=(i/N<=progress)?'#ff9d5c':'rgba(196,168,255,.45)';
      bar(x,i*bw+bw*.2,mid-h/2,bw*.6,h); }
  }
  function fmt(s){ s=Math.round(s); return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2); }
  function playerReset(){
    pPlaying=false; if(pRaf) cancelAnimationFrame(pRaf);
    try{ if(pAudio){ pAudio.pause(); } }catch(_){} pAudio=null;
    var b=document.getElementById('fdvPb'); if(b) b.innerHTML=I.play;
  }
  function showPlayer(blob,hist,dur){
    ensureIsl(); dur=Math.max(1,dur||1);
    playerReset();
    var bars=downsample(hist,38);
    isl.classList.add('open','play');
    isl.querySelector('#fdvRecUI').style.display='none';
    isl.querySelector('#fdvPlayUI').style.display='flex';
    var tm=isl.querySelector('#fdvPtm'); tm.textContent=fmt(dur);
    requestAnimationFrame(function(){ drawP(bars,0); });
    var btn=isl.querySelector('#fdvPb');
    btn.onclick=function(){
      if(pPlaying){ playerReset(); drawP(bars,0); tm.textContent=fmt(dur); return; }
      pPlaying=true; btn.innerHTML=I.pause;
      if(blob&&window.URL&&URL.createObjectURL){
        try{
          pAudio=new Audio(URL.createObjectURL(blob));
          pAudio.ontimeupdate=function(){ if(!pAudio) return;
            var D=(pAudio.duration&&isFinite(pAudio.duration))?pAudio.duration:dur;
            drawP(bars,Math.min(1,pAudio.currentTime/D)); tm.textContent=fmt(pAudio.currentTime); };
          pAudio.onended=function(){ playerReset(); drawP(bars,0); tm.textContent=fmt(dur); };
          pAudio.play().catch(function(){ playerReset(); });
          return;
        }catch(_){}
      }
      var s0=nowMs();
      (function pl(){ var p=(nowMs()-s0)/(dur*1000);
        if(p>=1||!pPlaying){ playerReset(); drawP(bars,0); tm.textContent=fmt(dur); return; }
        drawP(bars,p); tm.textContent=fmt(dur*p); pRaf=requestAnimationFrame(pl); })();
    };
    // авто-ховаємо плеєр через 45с бездіяльності
    setTimeout(function(){ if(isl&&isl.classList.contains('play')&&!pPlaying) hideIsl(); },45000);
  }

  /* ═══ Перехоплення тапів по нативних мікрофонах ═══ */
  document.addEventListener('click',function(e){
    try{
      if(!fdOn()) return;
      var t=e.target&&e.target.closest?e.target.closest('#aiMic,#fsMic'):null;
      if(!t) return;
      e.preventDefault(); e.stopPropagation();
      if(REC.active){ REC.stop(true); return; }
      if(isl&&isl.classList.contains('play')) hideIsl();
      REC.start(t.id==='fsMic'?'spot':'ai',t);
    }catch(err){ console.error('fdv click',err); }
  },true);

  /* ═══ Wake «Спарк»: кнопка-голос + слухання ═══ */
  function wakeStored(){ try{ return localStorage.getItem(WAKE_KEY)==='1'; }catch(_){ return false; } }
  var wakeOn=false, wakeWant=false;
  var SRCls=window.SpeechRecognition||window.webkitSpeechRecognition;
  var wakeSR=null;
  var wStream=null,wCtx=null,wAn=null,wArr=null,wBusy=0;
  function nameRE(){
    /* Whisper чує «Спарк» по-різному: «спарк», «с парк», «парк», «спарку», «spark»…
       Ловимо всі типові варіанти + імʼя поточного напарника. */
    var parts=['с\\s*п\\s*арк\\w*','spark\\w*','sparc','шпарк\\w*','іскр\\w*','искр\\w*','флоу','flow',
      '(^|[^а-яїієґa-z])парк(у|о|е|ом)?($|[^а-яїієґa-z])'];
    try{ var n=petName(); if(n) parts.push(String(n).toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\w*'); }catch(_){}
    return new RegExp(parts.join('|'),'i');
  }
  function wakeSetUI(){
    document.querySelectorAll('.fdv-wakebtn').forEach(function(b){ b.classList.toggle('on',wakeOn); });
  }
  function heardToast(){
    var h=document.getElementById('fdvHeard');
    if(!h){ h=document.createElement('div'); h.className='fdv-heard'; h.id='fdvHeard';
      h.innerHTML=I.voice+'<span></span>'; document.body.appendChild(h); }
    h.querySelector('span').textContent=petName()+' почув тебе!';
    h.classList.add('on'); setTimeout(function(){ h.classList.remove('on'); },1200);
  }
  function wakeTrigger(){
    if(REC.active||!wakeOn) return;
    wakePause(); haptic(); chime(true); heardToast();
    setTimeout(function(){ REC.start('wake',document.getElementById('aiMic')||document.getElementById('fsMic')||null); },250);
  }
  /* — шлях 1: SpeechRecognition — */
  function srStart(){
    try{
      wakeSR=new SRCls(); wakeSR.lang='uk-UA'; wakeSR.continuous=true; wakeSR.interimResults=true;
      var re=nameRE();
      wakeSR.onresult=function(e){ for(var i=e.resultIndex;i<e.results.length;i++){
        var t=(e.results[i][0]&&e.results[i][0].transcript)||'';
        if(re.test(t)){ wakeTrigger(); return; } } };
      wakeSR.onerror=function(ev){
        var er=ev&&ev.error;
        if(er==='not-allowed'||er==='service-not-allowed'||er==='audio-capture'){
          try{ wakeSR.onend=null; wakeSR.stop(); }catch(_){} wakeSR=null;
          whisperStart(); // фолбек на Whisper-чанки
        } };
      wakeSR.onend=function(){ if(wakeWant&&!REC.active&&wakeSR) setTimeout(function(){ try{ wakeSR&&wakeSR.start(); }catch(_){} },350); };
      wakeSR.start();
      return true;
    }catch(e){ wakeSR=null; return false; }
  }
  /* — шлях 2: Whisper-чанки через воркер —
     ДВА рекордери зі зсувом на пів вікна: вікна перекриваються, тож «Спарк»,
     що потрапив на межу чанка, гарантовано цілий хоча б в одному з них.
     Тихі чанки не надсилаються (семплер рівня) — економія кредитів. */
  var W_CHUNK=2400, W_HALF=1200, W_LVL=0.06, W_MIN=1500;
  var wSlots={}, wSamp=null, wLvlLog=[], wDual=true;
  async function whisperStart(){
    if(wStream) return;
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){
      toast('🎙 Виклик голосом недоступний у цьому середовищі'); wakeOff(); return; }
    try{
      wStream=await navigator.mediaDevices.getUserMedia({audio:true});
      var AC=window.AudioContext||window.webkitAudioContext;
      if(AC){ wCtx=new AC(); if(wCtx.state==='suspended'){ try{ await wCtx.resume(); }catch(_){}}
        var src=wCtx.createMediaStreamSource(wStream);
        wAn=wCtx.createAnalyser(); wAn.fftSize=512; wAn.smoothingTimeConstant=.5;
        src.connect(wAn); wArr=new Uint8Array(wAn.frequencyBinCount); }
      wLvlLog=[]; clearInterval(wSamp);
      wSamp=setInterval(function(){ try{
        wLvlLog.push({t:Date.now(),v:wLevel()});
        if(wLvlLog.length>40) wLvlLog.shift();
      }catch(_){} },110);
      wSlotRun('a',0);
      if(wDual) wSlotRun('b',W_HALF);
      toast('👂 '+petName()+' слухає — скажи «Привіт, '+petName()+'»');
    }catch(e){ toast('🎙 Нема доступу до мікрофона'); wakeOff(); }
  }
  function wLevel(){ if(!wAn) return 1; wAn.getByteFrequencyData(wArr);
    var s=0,n=Math.min(80,wArr.length); for(var i=2;i<n;i++) s+=wArr[i];
    return Math.min(1,(s/(n-2)/255)*2.6); }
  function wMaxSince(t0){
    var m=0; for(var i=0;i<wLvlLog.length;i++) if(wLvlLog[i].t>=t0&&wLvlLog[i].v>m) m=wLvlLog[i].v;
    return wAn?m:1;
  }
  function wSlotRun(slot,delay){
    clearTimeout(wSlots[slot]&&wSlots[slot].timer);
    wSlots[slot]={timer:setTimeout(function(){ wSlotCycle(slot); },delay)};
  }
  function wSlotCycle(slot){
    if(!wakeWant||!wStream) return;
    if(REC.active||document.hidden||wBusy>=2){ wSlotRun(slot,1000); return; }
    var ch=[], t0=Date.now(), mr=null;
    try{
      var mime=MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported('audio/mp4')?'audio/mp4'
        :(MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'');
      mr=new MediaRecorder(wStream,mime?{mimeType:mime}:undefined);
    }catch(e){
      if(slot==='b'){ wDual=false; return; }   // другий рекордер не підтримується — тихо у соло-режим
      wSlotRun(slot,2000); return;
    }
    wSlots[slot].mr=mr;
    mr.ondataavailable=function(e){ if(e.data&&e.data.size) ch.push(e.data); };
    mr.onstop=async function(){
      if(wSlots[slot]) wSlots[slot].mr=null;
      var blob=null; try{ blob=new Blob(ch,{type:(mr&&mr.mimeType)||'audio/mp4'}); }catch(_){}
      if(wakeWant&&blob&&blob.size>W_MIN&&wMaxSince(t0)>W_LVL){
        wBusy++;
        try{
          var t=await transcribe(blob);
          wBusy--;
          if(t&&wakeWant&&!REC.active&&nameRE().test(t)){ wakeTrigger(); return; }
        }catch(_){ wBusy--; }
      }
      if(wakeWant) wSlotRun(slot,0);
    };
    try{ mr.start(); }catch(e){
      if(wSlots[slot]) wSlots[slot].mr=null;
      if(slot==='b'){ wDual=false; return; }
      wSlotRun(slot,2000); return;
    }
    setTimeout(function(){ try{ if(mr.state!=='inactive') mr.stop(); }catch(_){} },W_CHUNK);
  }
  function whisperStop(){
    clearInterval(wSamp); wSamp=null; wLvlLog=[];
    Object.keys(wSlots).forEach(function(k){
      try{ clearTimeout(wSlots[k].timer); }catch(_){}
      try{ var m=wSlots[k].mr; if(m&&m.state!=='inactive'){ m.onstop=null; m.stop(); } }catch(_){}
    });
    wSlots={};
    try{ if(wStream) wStream.getTracks().forEach(function(t){t.stop()}); }catch(_){}
    try{ if(wCtx) wCtx.close(); }catch(_){}
    wStream=null; wCtx=null; wAn=null; wBusy=0;
  }
  function wakeStart(){
    wakeWant=true;
    if(SRCls){ if(!srStart()) whisperStart(); }
    else whisperStart();
  }
  function wakePause(){
    try{ if(wakeSR){ wakeSR.onend=null; wakeSR.stop(); wakeSR=null; } }catch(_){}
    whisperStop();
  }
  function wakeResume(){ if(wakeOn&&wakeWant&&fdOn()) setTimeout(function(){ if(wakeOn&&!REC.active) wakeStart(); },450); }
  function wakeOff(){
    wakeOn=false; wakeWant=false; wakePause(); wakeSetUI();
    try{ localStorage.setItem(WAKE_KEY,'0'); }catch(_){}
  }
  function wakeToggle(){
    if(wakeOn){ wakeOff(); toast('👂 Виклик голосом вимкнено'); return; }
    wakeOn=true; try{ localStorage.setItem(WAKE_KEY,'1'); }catch(_){}
    wakeSetUI(); wakeStart();
  }

  /* ── меню вибору голосу диктора ── */
  var vSheet=null, vPrev=null;
  function voiceSheet(){
    if(vSheet) return vSheet;
    vSheet=document.createElement('div'); vSheet.className='fdv-vsheet'; vSheet.id='fdvVSheet';
    var cur=''; try{ cur=localStorage.getItem('fd_tts_voice')||'uk-UA-OstapNeural'; }catch(_){ cur='uk-UA-OstapNeural'; }
    var rows=(window.FDV_VOICES||[]).map(function(v){
      return '<div class="fdv-vrow'+(v.id===cur?' sel':'')+'" data-vid="'+v.id+'">'
        +'<button class="fdv-vplay" data-vplay="'+v.id+'">'+I.play+'</button>'
        +'<div class="fdv-vmeta"><b>'+v.t+'</b><small>'+v.d+'</small></div>'
        +'<span class="fdv-vtick">'+(v.id===cur?I.check:'')+'</span></div>';
    }).join('');
    vSheet.innerHTML='<div class="fdv-vcard">'
      +'<div class="fdv-vh">'+I.voice+'<span>Голос Спарка</span></div>'
      +rows
      +'<button class="fdv-vclose">Закрити</button></div>';
    document.body.appendChild(vSheet);
    vSheet.addEventListener('click',function(e){
      if(e.target===vSheet||e.target.closest('.fdv-vclose')){ closeVoiceSheet(); return; }
      var pv=e.target.closest&&e.target.closest('[data-vplay]');
      if(pv){ e.stopPropagation(); previewVoice(pv.getAttribute('data-vplay')); return; }
      var row=e.target.closest&&e.target.closest('[data-vid]');
      if(row){ pickVoice(row.getAttribute('data-vid')); }
    });
    return vSheet;
  }
  function openVoiceSheet(){ voiceSheet(); refreshVoiceSel(); vSheet.classList.add('open'); haptic(); }
  function closeVoiceSheet(){ if(vSheet) vSheet.classList.remove('open'); try{ if(vPrev){ vPrev.pause(); vPrev=null; } }catch(_){} }
  function refreshVoiceSel(){
    if(!vSheet) return; var cur=''; try{ cur=localStorage.getItem('fd_tts_voice')||'uk-UA-OstapNeural'; }catch(_){}
    vSheet.querySelectorAll('[data-vid]').forEach(function(r){
      var on=r.getAttribute('data-vid')===cur; r.classList.toggle('sel',on);
      var t=r.querySelector('.fdv-vtick'); if(t) t.innerHTML=on?I.check:'';
    });
  }
  function pickVoice(id){
    try{ localStorage.setItem('fd_tts_voice',id); }catch(_){}
    refreshVoiceSel(); haptic();
    var v=(window.FDV_VOICES||[]).filter(function(x){return x.id===id;})[0];
    toast('🔊 Голос: '+((v&&v.t)||id));
    previewVoice(id);
  }
  function previewVoice(id){
    try{ if(vPrev){ vPrev.pause(); vPrev=null; } }catch(_){}
    var v=(window.FDV_VOICES||[]).filter(function(x){return x.id===id;})[0]||{id:id};
    fetch(endpoint().replace(/\/+$/,'')+'/tts',{method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({text:'Привіт! Я '+((v&&v.t)||'Спарк')+'. Так звучатиме твій напарник.',voice:id,rate:v.rate||'+2%',pitch:v.pitch||'+0Hz'})})
    .then(function(r){ if(!r.ok) throw 0; return r.blob(); })
    .then(function(b){ if(!b||b.size<600) throw 0; vPrev=new Audio(URL.createObjectURL(b)); var p=vPrev.play(); if(p&&p.catch)p.catch(function(){}); })
    .catch(function(){ toast('⚠️ Прев\u2019ю недоступне — задеплой воркер із /tts'); });
  }
  /* long-press (600мс) на кнопці-голос → меню диктора */
  function bindLongPress(btn){
    if(!btn||btn.__fdvLP) return; btn.__fdvLP=1;
    var tmr=null, moved=false;
    var start=function(){ moved=false; tmr=setTimeout(function(){ tmr=null; openVoiceSheet(); },600); };
    var cancel=function(){ if(tmr){ clearTimeout(tmr); tmr=null; } };
    btn.addEventListener('touchstart',start,{passive:true});
    btn.addEventListener('touchmove',function(){ moved=true; cancel(); },{passive:true});
    btn.addEventListener('touchend',cancel);
    btn.addEventListener('mousedown',start);
    btn.addEventListener('mouseup',cancel);
    btn.addEventListener('mouseleave',cancel);
  }

  /* ── кнопка-«голос» у рядках вводу (AI-екран і Спарк-спот) ── */
  function injectWakeBtns(){
    try{
      var aiIn=document.querySelector('#aiScr .ai-in');
      if(aiIn&&!aiIn.querySelector('.fdv-wakebtn')){
        var b=document.createElement('button');
        b.className='ai-mic fdv-wakebtn'; b.id='fdvWakeAi'; b.title='Тап — виклик голосом · утримання — вибір диктора';
        b.innerHTML=I.voice; b.onclick=function(ev){ ev.stopPropagation(); wakeToggle(); };
        var mic=aiIn.querySelector('#aiMic');
        if(mic) aiIn.insertBefore(b,mic); else aiIn.appendChild(b);
        b.classList.toggle('on',wakeOn); bindLongPress(b);
      }
      var fsIn=document.querySelector('#flowSpot .fs-in');
      if(fsIn&&!fsIn.querySelector('.fdv-wakebtn')){
        var b2=document.createElement('button');
        b2.className='fs-mic fdv-wakebtn'; b2.id='fdvWakeFs'; b2.title='Тап — виклик голосом · утримання — вибір диктора';
        b2.innerHTML=I.voice; b2.onclick=function(ev){ ev.stopPropagation(); wakeToggle(); };
        var fm=fsIn.querySelector('#fsMic');
        if(fm&&fm.parentNode===fsIn) fsIn.insertBefore(b2,fm); else fsIn.appendChild(b2);
        b2.classList.toggle('on',wakeOn); bindLongPress(b2);
      }
    }catch(e){}
  }
  try{
    new MutationObserver(function(){ injectWakeBtns(); }).observe(document.body,{childList:true,subtree:false});
  }catch(_){}
  injectWakeBtns();

  /* батарея: у фоні глушимо wake-мікрофон, повертаємось — відновлюємо */
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){ if(wakeOn) wakePause(); }
    else wakeResume();
  });

  /* відновлення стану wake після рестарту апки */
  if(fdOn()&&wakeStored()){ wakeOn=true; wakeWant=true; wakeSetUI();
    setTimeout(function(){ if(wakeOn) wakeStart(); },1500); }

}catch(e){ console.error('fdVoice init',e); }
})();
