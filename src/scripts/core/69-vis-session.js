  /* ════════ Сеанс візуалізації (В2, 28.11.2026) ════════
     Три хвилини по фото мрії «фокус дня», 5 кроків: результат → процес → перешкода → план → відчуття.
     На чому стоїть:
       • PETTLEP — образні тренування спортсменів: від першої особи, усіма відчуттями;
       • Taylor & Pham (UCLA): уявляти процес, а не лише фініш;
       • WOOP (Gabriele Oettingen): мрія + перешкода + план «якщо — то» (поля w.woop, 06-wishes.js).
     Відкривається з кроку «Візуалізація» в ранку (ritualBind) і з кнопки під колодою Карти.
     Сам нічого не пише в ранок: по «Завершити» кличе onDone(відчуття), а зараховує той, хто відкрив.
     Пише лише поле WOOP мрії — і лише коли людина сама його заповнила (wishWoopSet). */
  const VS_T={
    uk:{close:'Закрити', back:'Назад', next:'Далі', finish:'Завершити', yours:'Твої слова', add:'＋ Записати',
      noObs:'Перешкоди ще нема — запиши одну, з нею уява працює краще.', noPlan:'Плану ще нема — одне речення «якщо — то».',
      feels:[['calm','спокій'],['joy','радість'],['drive','азарт'],['doubt','сумнів'],['anxious','тривога']],
      steps:[
        {k:'Результат', t:'Ти вже там. Що бачиш перед собою?', sub:'Своїми очима, від першої особи — не як у кіно збоку. Що чути? Який запах?', sec:40, woop:'res'},
        {k:'Процес', t:'Як пройшла дорога сюди? Прокрути один звичайний день шляху.', sub:'Уявляти процес, а не лише фініш, — так готуються краще.', sec:40},
        {k:'Перешкода', t:'Що в тобі самому може завадити?', sub:'Не обставини — звичка, страх, втома.', sec:30, woop:'obs'},
        {k:'План', t:'Якщо це станеться — що ти зробиш?', sub:'Уяви, як спрацьовує твій план «якщо — то».', sec:30, woop:'plan'},
        {k:'Відчуття', t:'Що зараз відчуваєш у тілі?', sub:'Познач — за тиждень побачиш, як це змінюється.', sec:20, feel:true}
      ]},
    en:{close:'Close', back:'Back', next:'Next', finish:'Finish', yours:'Your words', add:'＋ Write it',
      noObs:'No obstacle yet — write one, imagery works better with it.', noPlan:'No plan yet — one “if — then” sentence.',
      feels:[['calm','calm'],['joy','joy'],['drive','drive'],['doubt','doubt'],['anxious','anxious']],
      steps:[
        {k:'Outcome', t:'You are already there. What do you see?', sub:'Through your own eyes, first person — not like watching a film. What do you hear? Smell?', sec:40, woop:'res'},
        {k:'Process', t:'How did the road here go? Play one ordinary day of the journey.', sub:'Imagining the process, not just the finish line, prepares you better.', sec:40},
        {k:'Obstacle', t:'What in you could get in the way?', sub:'Not circumstances — a habit, a fear, tiredness.', sec:30, woop:'obs'},
        {k:'Plan', t:'If it happens — what will you do?', sub:'Imagine your “if — then” plan kicking in.', sec:30, woop:'plan'},
        {k:'Feeling', t:'What do you feel in your body right now?', sub:'Mark it — in a week you will see how it changes.', sec:20, feel:true}
      ]}
  };
  const vsT=()=>VS_T[(typeof ritEn==='function'&&ritEn())?'en':'uk'];

  // мрія «фокус дня» — той самий вибір, що й у колоді Карти (renderWishDeck)
  function visFocusWish(){
    if(!Array.isArray(wishes)||!wishes.length) return null;
    let seed=0; try{ const s=ymdLocal(); for(let i=0;i<s.length;i++) seed=(seed*31+s.charCodeAt(i))>>>0; }catch(_){}
    return wishes[seed%wishes.length];
  }

  let vsTimer=null;
  function visSession(opts){
    opts=opts||{};
    const w=visFocusWish(); if(!w) return;
    const old=document.getElementById('visSess'); if(old) old.remove();
    const st={i:0, left:0, feel:''};
    const ov=document.createElement('div'); ov.className='vs'; ov.id='visSess';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    document.body.appendChild(ov);
    const stop=()=>{ if(vsTimer){ clearInterval(vsTimer); vsTimer=null; } };
    const close=()=>{ stop(); ov.remove(); };
    const fmt=n=>Math.floor(n/60)+':'+String(n%60).padStart(2,'0');

    const draw=()=>{
      const t=vsT(), S=t.steps, s=S[st.i], last=st.i===S.length-1;
      const img=w.type==='video'?(w.thumb||''):(w.img||'');
      const wo=(w.woop&&typeof w.woop==='object')?w.woop:{};
      let extra='';
      if(s.woop){
        const v=typeof wo[s.woop]==='string'?wo[s.woop].trim():'';
        if(v) extra=`<div class="vs-quote"><small>${esc(t.yours)}</small><span>${esc(v)}</span></div>`;
        else if(s.woop!=='res') extra=`<div class="vs-miss"><span>${esc(s.woop==='obs'?t.noObs:t.noPlan)}</span>
          <button type="button" class="vs-chip" data-vsfill="${esc(s.woop)}">${esc(t.add)}</button></div>`;
      }
      if(s.feel) extra=`<div class="vs-feels" role="group" aria-label="${esc(s.k)}">${t.feels.map(([k,l])=>
        `<button type="button" class="vs-chip ${st.feel===k?'on':''}" data-vsfeel="${k}" aria-pressed="${st.feel===k?'true':'false'}">${esc(l)}</button>`).join('')}</div>`;
      ov.setAttribute('aria-label', w.cap||s.k);
      ov.innerHTML=`<div class="vs-bg" style="background-image:url('${safeImg(img)}');${(typeof wishFocusBg==='function')?wishFocusBg(w):''}"></div>
        <div class="vs-veil"></div>
        <div class="vs-in">
          <div class="vs-top">
            <button type="button" class="vs-x" aria-label="${esc(t.close)}">✕</button>
            <span class="vs-cap">${esc(w.cap||'')}</span><span class="vs-sp"></span></div>
          <div class="vs-segs">${S.map((_,j)=>`<i class="${j<=st.i?'on':''}"></i>`).join('')}</div>
          <div class="vs-card">
            <div class="vs-row"><small class="vs-k">${st.i+1}/${S.length} · ${esc(s.k)}</small>
              <span class="vs-tm" aria-live="off">${fmt(st.left)}</span></div>
            <b class="vs-t">${esc(s.t)}</b>
            <div class="vs-sub">${esc(s.sub)}</div>
            ${extra}
            <div class="vs-bot">
              ${st.i>0?`<button type="button" class="vs-back">${esc(t.back)}</button>`:''}
              <button type="button" class="vs-next">${esc(last?t.finish:t.next)}</button></div>
          </div></div>`;
      ov.querySelector('.vs-x').onclick=close;
      const bk=ov.querySelector('.vs-back'); if(bk) bk.onclick=()=>go(st.i-1);
      ov.querySelector('.vs-next').onclick=()=>{
        if(!last){ go(st.i+1); return; }
        close();
        try{ if(typeof opts.onDone==='function') opts.onDone(st.feel); }catch(e){ console.error('visSession onDone',e); }
      };
      ov.querySelectorAll('[data-vsfeel]').forEach(b=>b.onclick=()=>{
        st.feel=st.feel===b.dataset.vsfeel?'':b.dataset.vsfeel; draw(); });
      ov.querySelectorAll('[data-vsfill]').forEach(b=>b.onclick=()=>{
        const k=b.dataset.vsfill, f=(typeof WISH_WOOP!=='undefined')?WISH_WOOP.find(x=>x[0]===k):null; if(!f) return;
        const en=vsT()===VS_T.en;
        inputModal({title:en?f[2]:f[1], value:'', placeholder:en?f[4]:f[3], onOk:v=>{
          if(v===null||v===undefined||!String(v).trim()) return;
          wishWoopSet(w,k,v);
          if(document.getElementById('visSess')===ov) draw(); }});
      });
    };
    // таймер лише підказує темп: на нулі — легкий відгук, крок не перемикається сам
    const go=i=>{
      const S=vsT().steps; st.i=Math.max(0,Math.min(S.length-1,i)); st.left=S[st.i].sec;
      stop(); draw();
      vsTimer=setInterval(()=>{
        if(!document.getElementById('visSess')){ stop(); return; }
        if(st.left<=0) return;
        st.left--;
        const tm=ov.querySelector('.vs-tm'); if(tm) tm.textContent=fmt(st.left);
        if(st.left===0){ try{ window.platform.haptic('light'); }catch(_){} }
      },1000);
    };
    go(0);
  }
  window.visSession=visSession;
