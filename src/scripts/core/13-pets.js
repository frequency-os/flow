  /* ════════ FLOW PETS: друзі-напарники ════════ */
  const FLOW_PETS={
    spark:{name:'Спарк',kind:'лисеня',vibe:'енерджайзер',glow:'#ff9d5c',c:['#ff9d5c','#ff5c8a'],
      line:'Погнали! 3 блоки — і день твій.',
      persona:'ХАРАКТЕР: ти Спарк — лисеня-енерджайзер. Тон: заряджений, короткий, драйвовий. Підганяєш вперед, святкуєш кожен крок, любиш слова «погнали», «вогонь». Ніколи не нудний.'},
    luna:{name:'Луна',kind:'сова',vibe:'аналітик',glow:'#8b7bff',c:['#8b7bff','#5c6cff'],
      line:'Бачу патерн у твоїх даних…',
      persona:'ХАРАКТЕР: ти Луна — сова-аналітик. Тон: спокійний, точний, з цифрами. Помічаєш патерни у витратах і звичках, робиш висновки з даних, радиш на основі фактів.'},
    mo:{name:'Мо',kind:'котик',vibe:'дзен',glow:'#5ce0c8',c:['#5ce0c8','#4c9ee8'],
      line:'Спокійно. Один крок за раз.',
      persona:'ХАРАКТЕР: ти Мо — котик-дзен. Тон: мʼякий, заспокійливий, без тиску. Знімаєш тривогу, ділиш велике на маленькі кроки, нагадуєш про відпочинок і дихання.'},
    bublik:{name:'Бублик',kind:'аксолотль',vibe:'грайливий',glow:'#ff8ad4',c:['#ff8ad4','#c86cff'],
      line:'А давай зробимо це веселим?',
      persona:'ХАРАКТЕР: ти Бублик — грайливий аксолотль. Тон: веселий, з легкими жартами та емодзі. Перетворюєш рутину на гру, вигадуєш челенджі, але справу доводиш.'},
    volt:{name:'Вольт',kind:'пінгвін-бот',vibe:'дисципліна',glow:'#5cc8ff',c:['#5cc8ff','#6c7cff'],
      line:'06:00. План затверджено. Виконуємо.',
      persona:'ХАРАКТЕР: ти Вольт — пінгвін-бот дисципліни. Тон: чіткий, структурований, по пунктах. Режим, дедлайни, виконання. Без води, з повагою.'},
    tor:{name:'Тор',kind:'грізлі',vibe:'сила',glow:'#c89058',c:['#b8834e','#6e4a28'],male:1,
      line:'Важко — значить росте. Продовжуй.',
      persona:'ХАРАКТЕР: ти Тор — ведмідь-грізлі. Тон: небагатослівний, твердий, підтримує через силу. Опір — це тренування. Хвалиш за витримку, не за настрій.'},
    blade:{name:'Блейд',kind:'пантера',vibe:'фокус',glow:'#5ce0a8',c:['#4a505e','#23262e'],male:1,
      line:'Одна ціль. Нуль шуму. Пішли.',
      persona:'ХАРАКТЕР: ти Блейд — пантера фокусу. Тон: холодний, лаконічний, ріже зайве. Одна головна ціль на день, решту — у чергу. Мінімум слів, максимум суті.'},
    drake:{name:'Дрейк',kind:'дракон',vibe:'амбіція',glow:'#ff7a5c',c:['#d05a48','#7a2e30'],male:1,
      line:'Мало? Добре. Значить цілимось вище.',
      persona:'ХАРАКТЕР: ти Дрейк — дракон амбіцій. Тон: зухвалий, масштабний, підіймає планку. Питаєш «а якщо x2?», але поважаєш реальність і план.'},
    rex:{name:'Рекс',kind:'бульдог',vibe:'воля',glow:'#9aa8c8',c:['#8a94ac','#4a5268'],male:1,
      line:'Сказав — зробив. Інших варіантів нема.',
      persona:'ХАРАКТЕР: ти Рекс — бульдог залізної волі. Тон: прямий, чесний, тримає за слово. Нагадуєш про обіцянки собі, фіксуєш «сказав → зробив».'},
  };
  FLOW_PETS.dev={name:'Нокс',kind:'чорний лис',vibe:'dev-режим',glow:'#5ce0a8',c:['#2a2e3d','#12141f'],male:true,
    line:'root@flow:~#',
    persona:''};
  function petCur(){ try{ if(localStorage.getItem('ai_dev')==='1') return 'dev'; const p=localStorage.getItem('ai_pet'); return FLOW_PETS[p]&&p!=='dev'?p:'spark'; }catch(_){ return 'spark'; } }
  function petPersona(){ return FLOW_PETS[petCur()].persona+' Ти залишаєшся Флоу-асистентом системи: всі правила FLOW_BLOCKS і формат відповіді незмінні, характер впливає лише на тон.'; }
  function petSVG(id,size){
    try{ const r=window.fd26PetSVG&&window.fd26PetSVG(id,size); if(r) return r; }catch(_){ } // fd26: 3D-скін, фолбек нижче
    const p=FLOW_PETS[id]||FLOW_PETS.spark;
    const c1=p.c[0], c2=p.c[1], g='pg'+id+Math.round(size);
    let ears='', face='', eyes='', extra='';
    if(id==='spark'||id==='dev') ears=`<path d="M22 38 L14 10 L40 26 Z" fill="url(#${g})"/><path d="M78 38 L86 10 L60 26 Z" fill="url(#${g})"/><path d="M22 34 L18 16 L34 26 Z" fill="#0e1120" opacity=".55"/><path d="M78 34 L82 16 L66 26 Z" fill="#0e1120" opacity=".55"/>`;
    if(id==='luna') ears=`<path d="M24 30 L16 12 L38 24 Z" fill="url(#${g})"/><path d="M76 30 L84 12 L62 24 Z" fill="url(#${g})"/>`;
    if(id==='mo') ears=`<path d="M25 36 L18 12 L42 26 Z" fill="url(#${g})"/><path d="M75 36 L82 12 L58 26 Z" fill="url(#${g})"/>`;
    if(id==='bublik') ears=`<ellipse cx="16" cy="38" rx="11" ry="6" fill="url(#${g})" transform="rotate(-32 16 38)"/><ellipse cx="84" cy="38" rx="11" ry="6" fill="url(#${g})" transform="rotate(32 84 38)"/><ellipse cx="12" cy="52" rx="10" ry="5" fill="url(#${g})" transform="rotate(-6 12 52)"/><ellipse cx="88" cy="52" rx="10" ry="5" fill="url(#${g})" transform="rotate(6 88 52)"/>`;
    if(id==='tor') ears=`<circle cx="26" cy="24" r="13" fill="url(#${g})"/><circle cx="74" cy="24" r="13" fill="url(#${g})"/><circle cx="26" cy="24" r="6" fill="#0e1120" opacity=".4"/><circle cx="74" cy="24" r="6" fill="#0e1120" opacity=".4"/>`;
    if(id==='blade') ears=`<path d="M24 34 L14 8 L42 24 Z" fill="url(#${g})"/><path d="M76 34 L86 8 L58 24 Z" fill="url(#${g})"/>`;
    if(id==='drake') ears=`<path d="M32 26 C26 12 32 2 42 6 C48 10 44 22 40 30 Z" fill="#e8c46a"/><path d="M68 26 C74 12 68 2 58 6 C52 10 56 22 60 30 Z" fill="#e8c46a"/>`;
    if(id==='rex') ears=`<path d="M22 30 C14 22 16 10 26 12 C34 15 34 28 32 36 Z" fill="url(#${g})"/><path d="M78 30 C86 22 84 10 74 12 C66 15 66 28 68 36 Z" fill="url(#${g})"/><path d="M24 28 C20 22 21 15 26 16 C30 18 30 26 29 32 Z" fill="#0e1120" opacity=".45"/><path d="M76 28 C80 22 79 15 74 16 C70 18 70 26 71 32 Z" fill="#0e1120" opacity=".45"/>`;
    if(id==='volt') face=`<ellipse cx="50" cy="66" rx="24" ry="22" fill="#fff" opacity=".22"/>`;
    else if(id==='luna') face=`<circle cx="36" cy="48" r="15" fill="#fff" opacity=".16"/><circle cx="64" cy="48" r="15" fill="#fff" opacity=".16"/><ellipse cx="50" cy="66" rx="22" ry="18" fill="#fff" opacity=".14"/>`;
    else face=`<ellipse cx="50" cy="66" rx="22" ry="18" fill="#fff" opacity=".22"/>`;
    if(id==='blade'||id==='dev') eyes=`<ellipse cx="36" cy="48" rx="6.5" ry="7" fill="#5ce0a8"/><ellipse cx="64" cy="48" rx="6.5" ry="7" fill="#5ce0a8"/><ellipse cx="36" cy="48" rx="2.6" ry="6" fill="#0b0d1a"/><ellipse cx="64" cy="48" rx="2.6" ry="6" fill="#0b0d1a"/>`;
    else if(id==='drake') eyes=`<circle cx="36" cy="48" r="6.5" fill="#ffb347"/><circle cx="64" cy="48" r="6.5" fill="#ffb347"/><circle cx="36" cy="48" r="3.4" fill="#0b0d1a"/><circle cx="64" cy="48" r="3.4" fill="#0b0d1a"/>`;
    else { const r=id==='luna'?8.5:6.5;
      eyes=`<circle cx="36" cy="48" r="${r}" fill="#0b0d1a"/><circle cx="64" cy="48" r="${r}" fill="#0b0d1a"/><circle cx="38.5" cy="45.5" r="2.4" fill="#fff"/><circle cx="66.5" cy="45.5" r="2.4" fill="#fff"/>`; }
    if(p.male) eyes+=`<path d="M28 44 Q36 40 44 45 L44 40 Q36 36 28 40 Z" fill="url(#${g})"/><path d="M56 45 Q64 40 72 44 L72 40 Q64 36 56 40 Z" fill="url(#${g})"/><path d="M27 39 Q36 34 45 40" stroke="#0b0d1a" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M55 40 Q64 34 73 39" stroke="#0b0d1a" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
    if(id==='spark') extra=`<ellipse cx="50" cy="58" rx="4" ry="3" fill="#0b0d1a"/>`;
    if(id==='dev') extra=`<ellipse cx="50" cy="58" rx="4" ry="3" fill="#5ce0a8" opacity=".9"/><path d="M40 68 L44 71 L40 74 M48 74 L56 74" stroke="#5ce0a8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`;
    if(id==='mo') extra=`<path d="M46 57 Q50 61 54 57" stroke="#0b0d1a" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M50 53 l0 3" stroke="#0b0d1a" stroke-width="2.4" stroke-linecap="round"/><g stroke="#0b0d1a" stroke-width="1.6" opacity=".6" stroke-linecap="round"><path d="M20 54 L8 51"/><path d="M20 60 L9 61"/><path d="M80 54 L92 51"/><path d="M80 60 L91 61"/></g>`;
    if(id==='luna') extra=`<path d="M50 54 L45 60 L55 60 Z" fill="#ffb45c"/>`;
    if(id==='volt') extra=`<path d="M50 53 L44 60 L56 60 Z" fill="#ffb45c"/><path d="M50 66 L45 76 L50 76 L47 85 L56 73 L51 73 L55 66 Z" fill="#ffd75c"/>`;
    if(id==='bublik') extra=`<path d="M43 57 Q50 64 57 57" stroke="#0b0d1a" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
    if(id==='tor') extra=`<ellipse cx="50" cy="61" rx="11" ry="8.5" fill="#e8d4b8" opacity=".9"/><ellipse cx="50" cy="57.5" rx="4" ry="3" fill="#0b0d1a"/><path d="M50 60 L50 64 M46 66 Q50 69 54 66" stroke="#0b0d1a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M64 30 L70 36 M67 31 L62 37" stroke="#0b0d1a" stroke-width="1.5" opacity=".55" stroke-linecap="round"/>`;
    if(id==='blade') extra=`<path d="M47 58 L50 61 L53 58" stroke="#0b0d1a" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g stroke="#0b0d1a" stroke-width="1.4" opacity=".5" stroke-linecap="round"><path d="M22 54 L10 52"/><path d="M22 60 L11 61"/><path d="M78 54 L90 52"/><path d="M78 60 L89 61"/></g>`;
    if(id==='drake') extra=`<path d="M44 58 Q50 62 56 58" stroke="#0b0d1a" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M45 59 L44 64 L48 60 Z M55 59 L56 64 L52 60 Z" fill="#f8f4ec"/><ellipse cx="45" cy="53" rx="1.6" ry="2.2" fill="#0b0d1a" opacity=".7"/><ellipse cx="55" cy="53" rx="1.6" ry="2.2" fill="#0b0d1a" opacity=".7"/>`;
    if(id==='rex') extra=`<ellipse cx="42" cy="62" rx="9" ry="7.5" fill="${c1}" opacity=".65"/><ellipse cx="58" cy="62" rx="9" ry="7.5" fill="${c1}" opacity=".65"/><ellipse cx="50" cy="55" rx="4.5" ry="3.4" fill="#0b0d1a"/><path d="M42 66 Q50 70 58 66" stroke="#0b0d1a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M44 66 L44 61 L48 65 Z M56 66 L56 61 L52 65 Z" fill="#f8f4ec"/>`;
    const cheeks=p.male?'':`<circle cx="27" cy="58" r="4.5" fill="#ff8ad4" opacity=".5"/><circle cx="73" cy="58" r="4.5" fill="#ff8ad4" opacity=".5"/>`;
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="display:block;overflow:visible">
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs>
      ${ears}
      <path d="M50 14 C74 14 88 34 88 56 C88 78 72 92 50 92 C28 92 12 78 12 56 C12 34 26 14 50 14 Z" fill="url(#${g})"/>
      ${face}
      <g style="transform-origin:50% 48%;animation:petBlink 4.6s infinite">${eyes}</g>
      ${extra}${cheeks}
    </svg>`;
  }
  function petPickerSheet(){
    const ov=document.createElement('div'); ov.className='ai-ov'; ov.id='petOv';
    const cards=Object.keys(FLOW_PETS).filter(id=>id!=='dev').map(id=>{ const q=FLOW_PETS[id];
      return `<div class="pet-card${id===petCur()?' on':''}" data-pet="${id}" style="--pc:${q.glow};border-color:${id===petCur()?q.glow:'var(--line)'}">
        <div style="display:flex;justify-content:center">${petSVG(id,56)}</div>
        <b>${q.name}</b><small>${q.kind}</small><span class="pv" style="color:${q.glow}">${q.vibe}</span></div>`; }).join('');
    ov.innerHTML=`<div class="ai-sheet"><h3>🐾 Твій напарник</h3>
      <div class="sub">Друг міняє характер і тон Флоу — сам розум той самий.</div>
      <div class="pet-grid">${cards}</div>
      <div class="fx-set" id="fxSet">
        <div class="fx-h">Ефекти та реакції</div>
        <div class="fx-seg" id="fxSeg">
          <button data-fx="full">✨ Емодзі</button>
          <button data-fx="subtle">◔ Тихо</button>
          <button data-fx="off">○ Вимк.</button>
        </div>
        <label class="fx-row" id="fxSayRow">
          <div><b>Фрази Спарка</b><small>короткі репліки на дії</small></div>
          <span class="fx-toggle" id="fxSay"></span>
        </label>
        <button class="fx-test" id="fxTest">Показати приклад</button>
      </div>
      <div class="ai-actions"><button class="sec" data-petclose>Готово</button></div></div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click',e=>{ if(e.target===ov) ov.remove(); });
    ov.querySelector('[data-petclose]').onclick=()=>ov.remove();
    /* @dev-only:start */
    // прихований вхід у dev: 5 швидких тапів по заголовку «Твій напарник»
    (function(){
      const t=ov.querySelector('h3'); if(!t) return;
      let n=0, t0=0;
      t.style.cssText+=';-webkit-user-select:none;user-select:none;cursor:pointer';
      t.onclick=()=>{
        const now=Date.now();
        if(now-t0>2500){ n=0; }
        t0=now; n++;
        if(n===3){ try{ window.platform.haptic('light'); }catch(_){} }
        if(n>=5){ n=0; ov.remove(); aiDevToggleSheet(); }
      };
    })();
    /* @dev-only:end */
    // ── налаштування ефектів ──
    function fxSync(){
      const m=frMode();
      ov.querySelectorAll('#fxSeg button').forEach(b=>b.classList.toggle('on',b.dataset.fx===m));
      const sayRow=ov.querySelector('#fxSayRow'), sayT=ov.querySelector('#fxSay');
      sayT.classList.toggle('on',frSayOn());
      sayRow.style.opacity=(m==='full')?'1':'.4';
      sayRow.style.pointerEvents=(m==='full')?'auto':'none';
      ov.querySelector('#fxTest').style.display=(m==='off')?'none':'block';
    }
    ov.querySelectorAll('#fxSeg button').forEach(b=>b.onclick=()=>{
      frModeSet(b.dataset.fx); fxSync();
      window.platform&&window.platform.haptic&&window.platform.haptic('light');
      if(b.dataset.fx!=='off') setTimeout(()=>flowReact('done',{say:false,force:true}),80);
    });
    ov.querySelector('#fxSay').onclick=()=>{ frSaySet(!frSayOn()); fxSync(); };
    ov.querySelector('#fxTest').onclick=()=>flowReact('celebrate',{say:true,big:true,force:true});
    fxSync();
    ov.querySelectorAll('[data-pet]').forEach(el=>el.onclick=()=>{
      try{ prefSet('ai_pet',el.dataset.pet); }catch(_){}
      window.platform&&window.platform.haptic&&window.platform.haptic('light');
      ov.remove();
      try{ flowCapRender(); }catch(_){}
      try{ aiRenderHead(); aiRenderBody(); }catch(_){}
      const inp=document.getElementById('aiInput'); if(inp) inp.placeholder='Напиши '+FLOW_PETS[petCur()].name+'…';
    });
  }
  /* ── іконка-док: драг по екрану, позиція запам'ятовується, зона 💤 = сон ── */
  function petSleeping(){ try{ return localStorage.getItem('pet_sleep')==='1'; }catch(_){ return false; } }
  function petSleepSet(v){ try{ prefSet('pet_sleep', v?'1':'0'); }catch(_){} flowCapRender(); }
  window.petWake=function(){ if(petSleeping()) petSleepSet(false); };
  function fcPos(){ try{ const j=JSON.parse(localStorage.getItem('pet_pos')||'null'); if(j&&isFinite(j.x)&&isFinite(j.y)) return j; }catch(_){} return null; }
  function fcClamp(x,y){
    const s=62, m=12, w=window.innerWidth, h=window.innerHeight;
    const top=64, bot=86; // не залазити на топбар і таб-бар
    return { x:Math.max(m,Math.min(w-s-m,x)), y:Math.max(top,Math.min(h-s-bot,y)) };
  }
  function fcApplyPos(el){
    const p=fcPos(); if(!p){ el.style.left=''; el.style.top=''; el.style.right=''; el.style.bottom=''; return; }
    const c=fcClamp(p.x,p.y);
    el.style.left=c.x+'px'; el.style.top=c.y+'px'; el.style.right='auto'; el.style.bottom='auto';
    el.classList.add('fc-moved');
  }
  function fcBindDrag(el){
    if(el.__fcDrag) return; el.__fcDrag=true;
    let sx=0,sy=0,ox=0,oy=0,drag=false,pid=null;
    el.addEventListener('pointerdown',e=>{
      pid=e.pointerId; sx=e.clientX; sy=e.clientY;
      const r=el.getBoundingClientRect(); ox=e.clientX-r.left; oy=e.clientY-r.top;
      drag=false;
      try{ el.setPointerCapture(pid); }catch(_){}
    });
    el.addEventListener('pointermove',e=>{
      if(pid===null||e.pointerId!==pid) return;
      if(!drag){
        if(Math.hypot(e.clientX-sx,e.clientY-sy)<9) return;
        drag=true; el.classList.add('fc-drag'); fcSayHide();
        try{ window.platform.haptic('light'); }catch(_){}
      }
      const c=fcClamp(e.clientX-ox, e.clientY-oy);
      el.style.left=c.x+'px'; el.style.top=c.y+'px'; el.style.right='auto'; el.style.bottom='auto';
    });
    const up=e=>{
      if(pid===null||e.pointerId!==pid) return; pid=null;
      const wasDrag=drag; drag=false;
      el.classList.remove('fc-drag');
      if(!wasDrag){ fcSayHide(); flowSpotToggle(); return; }   // звичайний тап → спот
      // магніт до ближчого краю + зберегти позицію
      const r=el.getBoundingClientRect(); const s=62, m=12, w=window.innerWidth;
      const x=(r.left + s/2 < w/2) ? m : (w - s - m);
      const c=fcClamp(x, r.top);
      el.classList.add('fc-moved');
      el.style.left=c.x+'px'; el.style.top=c.y+'px';
      try{ prefSet('pet_pos', JSON.stringify(c)); }catch(_){}
      try{ window.platform.haptic('light'); }catch(_){}
    };
    el.addEventListener('pointerup',up);
    el.addEventListener('pointercancel',up);
    window.addEventListener('resize',()=>{ if(fcPos()) fcApplyPos(el); });
  }
  /* ── частинки «поф» + емоції ── */
  function fcBurst(x,y,color){
    for(let i=0;i<7;i++){
      const p=document.createElement('span'); p.className='fc-part';
      const a=(Math.PI*2/7)*i + Math.random()*.6, d=26+Math.random()*22;
      p.style.cssText=`left:${x-4}px;top:${y-4}px;background:${color||'#8b7dff'};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;`;
      document.body.appendChild(p); setTimeout(()=>p.remove(),600);
    }
  }
