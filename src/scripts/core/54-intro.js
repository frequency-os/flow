  /* ════════ Прев'ю «Що таке Frequency» — «День із життя» (54-intro.js, 10.10.2026) ════════
     П'ять карток перед «Стартовим набором» (53-starter.js), як один день: 7:00 ранковий ритуал →
     8:00 Карта бажань → 9:00 план дня по годинах → 21:00 вечір і Журнал → неділя, видно ріст.
     Прев'ю каже, НАВІЩО програма; набір показує, ЯК вона виглядає. На кожній картці — «живий
     екран», зібраний з тих самих стилів і фото прикладу (starter-assets.js), а не скріншот,
     і лише те, що програма справді вміє (ритуал, колаж, сітка годин, Журнал героя).
       • дві мови — тексти парами uk/en (stL/stLang з 53-starter.js), без родових форм;
       • показ: акаунт порожній (starterActive) і на цьому пристрої прев'ю ще не бачили; позначка
         flow_intro — лише після «Почати»/«Пропустити»; у дані й хмару не пише нічого;
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
    inOpen();
  }
  const IN_T={
    uk:{label:'Що таке Frequency', skip:'Пропустити', next:'Далі', start:'Почати', sunday:'Неділя',
      s:[
        {t:'Ранок задає тон', d:'Кілька простих кроків — і день починається з тебе, а не з телефона.'},
        {t:'Мрії перед очима', d:'Карта бажань нагадує щодня, заради чого ти все це робиш.'},
        {t:'Велика мета — маленькі кроки', d:'План дня по годинах, і кожен крок веде до мрії.'},
        {t:'Вечір підбиває підсумок', d:'Кілька рядків у щоденнику — і видно, що сьогодні вдалося.'},
        {t:'Бачиш свій ріст', d:'Кожен день лишає слід — і через місяць видно, як ти змінюєшся.'},
      ],
      rit:'Мій ранок', streak:'стрік 5 днів', steps:['Склянка води','Зарядка 10 хв','3 вдячності'], ritDone:'🔥 День зараховано',
      wish:'Пробігти 10 км у горах', price:'Ціна мрії: менше сидіти в телефоні',
      plan:[['7:00','Пробіжка 3 км','🎯 до мрії'],['10:00','Робота: проєкт',''],['13:00','Курс · урок 4',''],['19:00','Вечеря з рідними','']],
      diary:'Щоденник', diaryAlt:'Пробіжка вранці, урок курсу, вечір з рідними.',
      jr:'Журнал героя', jrSub:'сьогодні: 3 з 4 кроків',
      week:'цього тижня', done:'Ціль досягнуто ✓', goal:'Зустріти світанок біля моря',
      days:['Пн','Вт','Ср','Чт','Пт','Сб','Нд']},
    en:{label:'What is Frequency', skip:'Skip', next:'Next', start:'Get started', sunday:'Sunday',
      s:[
        {t:'Morning sets the tone', d:'A few simple steps — and the day starts with you, not your phone.'},
        {t:'Dreams in sight', d:'Your Wish map reminds you every day what it’s all for.'},
        {t:'Big goal, small steps', d:'An hour-by-hour plan, where every step leads to a dream.'},
        {t:'The evening sums it up', d:'A few lines in your diary — and you see what went well today.'},
        {t:'See yourself grow', d:'Every day leaves a trace — and a month later you can see how you’re changing.'},
      ],
      rit:'My morning', streak:'5-day streak', steps:['Glass of water','10-min workout','3 things I’m grateful for'], ritDone:'🔥 Day counted',
      wish:'Run 10 km in the mountains', price:'The price: less time on my phone',
      plan:[['7:00','Run 3 km','🎯 to a dream'],['10:00','Work: project',''],['13:00','Course · lesson 4',''],['19:00','Dinner with family','']],
      diary:'Diary', diaryAlt:'Morning run, a lesson of my course, an evening with family.',
      jr:'Hero journal', jrSub:'today: 3 of 4 steps',
      week:'this week', done:'Goal reached ✓', goal:'Watch a sunrise by the sea',
      days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']},
  };
  const inT=k=>IN_T[stLang()][k];
  const inPh=(a,cls)=>`<i class="in-ph ${cls||''}" ${stBg(a)}></i>`;
  const inTime=['7:00','8:00','9:00','21:00',null];
  function inSlides(){
    const S=inT('s');
    // щоденник — нейтральний текст без «втомився/втомилась»: у прикладі нема статі
    const diaryTxt=inT('diaryAlt');
    return [
      { v:`<div class="in-v-rit">
            <div class="in-rit-h"><b>${esc(inT('rit'))}</b><span>🔥 ${esc(inT('streak'))}</span></div>
            <div class="in-rit-cal">${inT('days').map((d,i)=>`<span class="${i<5?'ok':''}${i===4?' now':''}"><em>${esc(d)}</em><i></i></span>`).join('')}</div>
            ${inT('steps').map((t,i)=>`<div class="in-rit-step${i<2?' ok':''}"><span class="in-chk">${i<2?'✓':''}</span><b>${esc(t)}</b></div>`).join('')}
            <div class="in-rit-done">${esc(inT('ritDone'))}</div>
          </div>` },
      { v:`<div class="in-v1">
            <div class="in-col">${['sea','run','home','study','travel'].map(a=>inPh(a,'in-'+a)).join('')}</div>
            <div class="in-wcap">${inPh('run','in-wthumb')}<span><b>${esc(inT('wish'))}</b><small>${esc(inT('price'))}</small></span></div>
          </div>` },
      { v:`<div class="in-v-plan">${inT('plan').map(([h,t,tag],i)=>`<div class="in-hr${i===0?' on':''}"><em>${h}</em>
            <span class="in-blk"><b>${esc(t)}</b>${tag?`<small>${esc(tag)}</small>`:''}</span></div>`).join('')}</div>` },
      { v:`<div class="in-v-eve">
            <div class="in-diary"><small>📓 ${esc(inT('diary'))}</small><p>${esc(diaryTxt)}</p></div>
            <div class="in-jr"><span class="in-ic">🛡️</span><span><b>${esc(inT('jr'))}</b><small>${esc(inT('jrSub'))}</small></span>
              <em class="in-ring" style="--p:75"></em></div>
          </div>` },
      { v:`<div class="in-v3">
            <div class="in-wk"><b>57<small>%</small></b><span>${esc(inT('week'))} · <b>4/7</b></span>
              <div class="in-dots">${inT('days').map((d,i)=>`<span class="${i<4?'on':''}"><em>${esc(d)}</em><i></i></span>`).join('')}</div></div>
            <div class="in-done">${inPh('sea')}<span class="in-veil"></span><span class="in-done-t"><small>${esc(inT('done'))}</small><b>${esc(inT('goal'))}</b></span></div>
          </div>` },
    ].map((x,i)=>Object.assign(x,S[i],{time:inTime[i]||inT('sunday')}));
  }
  function inOpen(at){
    const old=document.querySelector('.in-ov'); if(old) old.remove();
    // фото прикладу — той самий лінивий файл, що й у набору
    try{ stLoad(); }catch(_){}
    const S=inSlides();
    const ov=document.createElement('div');
    // data-i18n-skip: тексти вже потрібною мовою — словниковий перекладач (01-base.js) їх не чіпає
    ov.className='in-ov'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.setAttribute('aria-label',inT('label')); ov.setAttribute('data-i18n-skip','1');
    ov.innerHTML=`<div class="in-top"><div class="in-pg">${S.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>
        <button class="in-skip" data-inskip>${esc(inT('skip'))}</button></div>
      <div class="in-track">${S.map((s,i)=>`<section class="in-slide" data-i="${i}">
          <div class="in-vis">${s.v}</div>
          <span class="in-time">${esc(s.time)}</span>
          <h2>${esc(s.t)}</h2><p>${esc(s.d)}</p></section>`).join('')}</div>
      <div class="in-foot"><button class="in-next" data-innext>${esc(inT('next'))}</button></div>`;
    document.body.appendChild(ov);
    const track=ov.querySelector('.in-track'), next=ov.querySelector('[data-innext]');
    const cur=()=>Math.round(track.scrollLeft/Math.max(1,track.clientWidth));
    const sync=()=>{
      const i=cur();
      ov.querySelectorAll('.in-pg i').forEach((d,k)=>d.classList.toggle('on',k===i));
      next.textContent=i>=S.length-1?inT('start'):inT('next');
    };
    const close=()=>{ inMark(); ov.remove(); document.removeEventListener('keydown',onKey); };
    const onKey=e=>{ if(e.key==='Escape') close(); };
    track.addEventListener('scroll',()=>requestAnimationFrame(sync),{passive:true});
    next.onclick=()=>{ const i=cur(); if(i>=S.length-1) close(); else track.scrollTo({left:(i+1)*track.clientWidth,behavior:'smooth'}); };
    ov.querySelector('[data-inskip]').onclick=close;
    ov.__inKey=onKey;
    document.addEventListener('keydown',onKey);
    if(at){ track.scrollLeft=at*track.clientWidth; sync(); }
    try{ window.platform.haptic('light'); }catch(_){}
  }
  // фото доїхали або мову перемкнули, поки картки відкриті — малюємо заново на тій самій картці
  function introRefresh(){
    const ov=document.querySelector('.in-ov'); if(!ov) return;
    const tr=ov.querySelector('.in-track');
    const at=tr?Math.round(tr.scrollLeft/Math.max(1,tr.clientWidth)):0;
    if(ov.__inKey) document.removeEventListener('keydown',ov.__inKey);
    inOpen(at);
  }
  document.addEventListener('flowlangchange',()=>{ try{ introRefresh(); }catch(_){} });
  /* назовні — під іншим ім'ям: функції ядра верхнього рівня і так живуть на window, тож
     window.introOpen=()=>introOpen() переписав би саму себе і викликав себе без кінця */
  try{ window.introOpen=()=>inOpen(); }catch(_){}
