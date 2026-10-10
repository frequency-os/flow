  /* ════════ Прев'ю «Що таке Frequency» (54-intro.js, 10.10.2026) ════════
     Три картки на весь екран перед «Стартовим набором» (53-starter.js): прев'ю каже, НАВІЩО
     програма, набір показує, ЯК вона виглядає в житті. На кожній картці — «живий екран»,
     зібраний з тих самих стилів і фото прикладу (starter-assets.js), а не скріншот.
       • показ: акаунт порожній (starterActive — та сама перевірка, що в набору) і на цьому
         пристрої прев'ю ще не бачили; позначка flow_intro — лише після «Почати»/«Пропустити»;
       • у дані й хмару не пише нічого;
       • «Ще → Про застосунок → Що таке Frequency» відкриває ті самі картки будь-коли.
     Гортання — нативний горизонтальний скрол зі scroll-snap: свайп пальцем без бібліотек. */
  const IN_KEY='flow_intro';
  let inShownNow=false;
  function inSeen(){ try{ return !!localStorage.getItem(IN_KEY); }catch(_){ return false; } }
  function inMark(){ try{ localStorage.setItem(IN_KEY,'seen'); }catch(_){} }
  // викликає starterRender: лише коли набір справді показується
  function introMaybe(){
    if(inShownNow||inSeen()) return;
    inShownNow=true;
    introOpen();
  }
  const inPh=(a,cls)=>`<i class="in-ph ${cls||''}" ${stBg(a)}></i>`;
  function inSlides(){
    return [
      { t:'Мрії, гроші й справи — в одному місці', d:'Не п\'ять застосунків, а одне твоє життя.',
        v:`<div class="in-v1">
            <div class="in-col">${['sea','run','home','study','travel'].map(a=>inPh(a,'in-'+a)).join('')}</div>
            <div class="in-tiles">${ST_FOLDERS.map(f=>`<span class="in-tile" style="--c:${f.c}">${inPh(f.a)}<b>${f.emoji} ${esc(f.name)}</b></span>`).join('')}</div>
          </div>` },
      { t:'Від мрії до сьогодні', d:'Велика мета розкладається на маленькі кроки дня.',
        v:`<div class="in-v2">
            <div class="in-step in-wish">${inPh('run')}<span><small>Мрія</small><b>Пробігти 10 км у горах</b></span></div>
            <i class="in-arr" aria-hidden="true"></i>
            <div class="in-step"><span class="in-ic">🎯</span><span><small>Ціль року</small><b>10 км до серпня</b><em class="in-bar"><i style="width:35%"></i></em></span></div>
            <i class="in-arr" aria-hidden="true"></i>
            <div class="in-step in-today"><span class="in-ic">☀️</span><span><small>Сьогодні · 7:00</small><b>Пробіжка 3 км</b></span><span class="in-ok">✓</span></div>
          </div>` },
      { t:'Бачиш свій ріст', d:'Кожен день лишає слід — і через місяць видно, як ти змінився.',
        v:`<div class="in-v3">
            <div class="in-wk"><b>57<small>%</small></b><span>цього тижня · <b>4/7</b></span>
              <div class="in-dots">${['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map((d,i)=>`<span class="${i<4?'on':''}"><em>${d}</em><i></i></span>`).join('')}</div></div>
            <div class="in-done">${inPh('sea')}<span class="in-veil"></span><span class="in-done-t"><small>Ціль досягнуто ✓</small><b>Зустріти світанок біля моря</b></span></div>
          </div>` },
    ];
  }
  function introOpen(){
    const old=document.querySelector('.in-ov'); if(old) old.remove();
    // фото прикладу — той самий лінивий файл, що й у набору
    try{ stLoad(); }catch(_){}
    const S=inSlides();
    const ov=document.createElement('div');
    ov.className='in-ov'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-label','Що таке Frequency');
    ov.innerHTML=`<div class="in-top"><div class="in-pg">${S.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>
        <button class="in-skip" data-inskip>Пропустити</button></div>
      <div class="in-track">${S.map((s,i)=>`<section class="in-slide" data-i="${i}">
          <div class="in-vis">${s.v}</div>
          <h2>${esc(s.t)}</h2><p>${esc(s.d)}</p></section>`).join('')}</div>
      <div class="in-foot"><button class="in-next" data-innext>Далі</button></div>`;
    document.body.appendChild(ov);
    const track=ov.querySelector('.in-track'), next=ov.querySelector('[data-innext]');
    const cur=()=>Math.round(track.scrollLeft/Math.max(1,track.clientWidth));
    const sync=()=>{
      const i=cur();
      ov.querySelectorAll('.in-pg i').forEach((d,k)=>d.classList.toggle('on',k===i));
      next.textContent=i>=S.length-1?'Почати':'Далі';
    };
    const close=()=>{ inMark(); ov.remove(); document.removeEventListener('keydown',onKey); };
    const onKey=e=>{ if(e.key==='Escape') close(); };
    track.addEventListener('scroll',()=>requestAnimationFrame(sync),{passive:true});
    next.onclick=()=>{ const i=cur(); if(i>=S.length-1) close(); else track.scrollTo({left:(i+1)*track.clientWidth,behavior:'smooth'}); };
    ov.querySelector('[data-inskip]').onclick=close;
    document.addEventListener('keydown',onKey);
    try{ window.platform.haptic('light'); }catch(_){}
  }
  // фото доїхали, поки картки відкриті — домальовуємо їх без перезапуску гортання
  function introRefresh(){
    const ov=document.querySelector('.in-ov'); if(!ov) return;
    const S=inSlides();
    ov.querySelectorAll('.in-slide .in-vis').forEach((v,i)=>{ if(S[i]) v.innerHTML=S[i].v; });
  }
  try{ window.introOpen=introOpen; }catch(_){}
