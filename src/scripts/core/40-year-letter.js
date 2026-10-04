  /* ════════ РІК: лист із точки Б + дорога віх по місяцях (екран «Цілі») ════════
     Лист замінює на екрані місію й Точки А/Б. Старі поля НЕ видаляються: поки
     листа нема, редактор складає з них чернетку, а записується вона лише після
     «Зберегти» людиною. Усе живе в goals_data, нового ключа сховища нема:
       goalsData.letter = {text, date:'YYYY-MM-DD', wishId}
       ціль.sentence    = речення з листа, до якого веде ціль
       ціль.ms          = [{id, ym:'YYYY-MM', t, done}] — віхи по місяцях
     Старі збірки на інших пристроях цих полів не показують, але й не зрізають:
     goalsData зберігається й читається цілком (saveGoals, Object.assign у loadOnce). */
  const YL_MON=['січень','лютий','березень','квітень','травень','червень','липень','серпень','вересень','жовтень','листопад','грудень'];
  const YL_MON_G=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
  let ylMidOpen=false;   // розгорнуті далекі місяці дороги (лише на час сесії)

  function ylLetter(){
    const L=goalsData.letter;
    if(!L||typeof L!=='object') return {text:'',date:'',wishId:''};
    return {text:typeof L.text==='string'?L.text:'', date:typeof L.date==='string'?L.date:'', wishId:typeof L.wishId==='string'?L.wishId:''};
  }
  function ylDefaultDate(){ const d=new Date(); d.setFullYear(d.getFullYear()+1); return ymdLocal(d); }
  function ylDate(L){ return /^\d{4}-\d{2}-\d{2}$/.test(L.date||'') ? L.date : ylDefaultDate(); }
  function ylDateTxt(ds){ const p=ds.split('-'); return (+p[2])+' '+YL_MON_G[(+p[1])-1]+' '+p[0]; }
  // назва місяця; рік дописуємо, коли він не поточний («жовтень 2027» ≠ цей жовтень)
  function ylMonName(ym){ const n=YL_MON[(+ym.slice(5,7))-1]||ym; return ym.slice(0,4)===ymdLocal().slice(0,4) ? n : n+' '+ym.slice(0,4); }
  function ylYmAdd(ym,n){ const d=new Date(+ym.slice(0,4), (+ym.slice(5,7))-1+n, 1); return ymdLocal(d).slice(0,7); }
  function ylGoalMs(gl){ return Array.isArray(gl.ms) ? gl.ms.filter(m=>m&&typeof m==='object'&&/^\d{4}-\d{2}$/.test(m.ym||'')) : []; }
  function ylColor(gl){ return safeColor(gl.color,'#5b8def'); }
  // речення «проявилось»: усі віхи цілі зроблено, а якщо віх нема — ціль на 100%
  function ylLit(gl){ const ms=ylGoalMs(gl); return ms.length ? ms.every(m=>m.done) : goalPctP(gl)>=100; }
  function ylSentences(text){ return (String(text||'').match(/[^.!?…\n]+[.!?…]*/g)||[]).map(s=>s.trim()).filter(s=>s.length>2); }
  // цілі, чиє речення справді є в листі
  function ylLinked(L){ const t=L.text; return (goalsData.goals||[]).filter(gl=>typeof gl.sentence==='string'&&gl.sentence.trim()&&t.indexOf(gl.sentence.trim())>=0); }

  // лист з підсвіченими реченнями цілей (колір цілі; бліде — ще не проявилось)
  function ylLetterHtml(L){
    const t=L.text, ranges=[];
    ylLinked(L).forEach(gl=>{ const s=gl.sentence.trim(), i=t.indexOf(s); ranges.push({i, e:i+s.length, gl}); });
    ranges.sort((a,b)=>a.i-b.i);
    let out='', pos=0;
    ranges.forEach(r=>{
      if(r.i<pos) return;   // речення двох цілей перекриваються — підсвічуємо перше
      out+=esc(t.slice(pos,r.i))+`<mark class="yl-s ${ylLit(r.gl)?'lit':''}" style="--c:${ylColor(r.gl)}">${esc(t.slice(r.i,r.e))}</mark>`;
      pos=r.e;
    });
    return out+esc(t.slice(pos));
  }
  function ylWish(L){ try{ return (wishes||[]).find(w=>w&&w.id===L.wishId)||null; }catch(_){ return null; } }
  function ylWishCover(w){ return w ? safeImg(w.type==='video'?w.thumb:w.img) : ''; }

  /* ── блок на екрані «Цілі»: картка листа + дорога ── */
  function ylBlockHtml(){
    const L=ylLetter(), g=goalsData, date=ylDate(L), dTxt=ylDateTxt(date);
    let card;
    if(!L.text.trim()){
      const old=[g.mission,g.pointA,g.pointB].some(x=>typeof x==='string'&&x.trim());
      card=`<div class="ylet ylet-empty">
        <div class="ylet-eb">Лист із точки Б</div>
        <div class="ylet-h">Напиши собі з ${esc(dTxt)}</div>
        <div class="ylet-p">Як минає день, що в тебе є, що змінилось. Пиши як є, без цілей і цифр — Флоу розкладе це на цілі й віхи по місяцях.</div>
        ${old?'<div class="ylet-p ylet-note">Твої Місія й Точки А/Б стануть чернеткою листа.</div>':''}
        <div class="ylet-btns"><button class="ylet-pri" data-yl="edit">Написати лист</button></div>
      </div>`;
    } else {
      const lk=ylLinked(L), n=lk.filter(ylLit).length, m=lk.length;
      const cov=ylWishCover(ylWish(L));
      const ex=L.text.trim().replace(/\s+/g,' ');
      card=`<div class="ylet">
        ${cov?`<div class="ylet-cov" style="background-image:url('${cov}')"></div>`:''}
        <div class="ylet-eb">Лист · ${esc(dTxt)}</div>
        <button class="ylet-q" data-yl="read">«${esc(ex.length>150?ex.slice(0,150).trim()+'…':ex)}»</button>
        ${m?`<div class="ylet-meter"><span><b>${n} з ${m}</b> ${m===1?'речення':'речень'} проявилось</span></div><div class="ylet-bar"><i style="width:${Math.round(n/m*100)}%"></i></div>`:''}
        <div class="ylet-btns">
          <button data-yl="read">Читати</button>
          <button data-yl="edit">✎ Змінити</button>
          <button class="ylet-pri" data-yl="ai">✨ Флоу, розклади</button>
        </div>
      </div>`;
    }
    return card+ylRoadHtml(L,date);
  }

  function ylRoadHtml(L,date){
    const goals=(goalsData.goals||[]).filter(gl=>ylGoalMs(gl).length);
    if(!goals.length && !L.text.trim()) return '';
    const cur=ymdLocal().slice(0,7), end=date.slice(0,7);
    const byYm={};
    goals.forEach(gl=>ylGoalMs(gl).forEach(m=>{ (byYm[m.ym]=byYm[m.ym]||[]).push({gl,m}); }));
    const chips=(ym,add)=>{
      const list=byYm[ym]||[];
      return `<div class="yr-chips">${list.map(({gl,m})=>`<button class="yms ${m.done?'done':''}" data-yms="${esc(gl.id)}|${esc(m.id)}" style="--c:${ylColor(gl)}">${esc(m.t)}</button>`).join('')}${add?`<button class="yms-add" data-ymadd="${ym}">+ віха</button>`:''}</div>`;
    };
    const cnt=ym=>{ const l=byYm[ym]||[]; return {d:l.filter(x=>x.m.done).length, t:l.length}; };
    const rows=[];
    const prev=ylYmAdd(cur,-1);
    if(byYm[prev]){ const c=cnt(prev); rows.push(`<div class="yr-st past"><div class="yr-h"><span>${ylMonName(prev)}</span><span>${c.d}/${c.t}</span></div>${chips(prev,false)}</div>`); }
    // поточний і два наступні — розгорнуті; далі до точки Б — одним рядком
    const near=[cur, ylYmAdd(cur,1), ylYmAdd(cur,2)].filter(ym=>ym<=end);
    near.forEach((ym,i)=>{
      const c=cnt(ym);
      rows.push(`<div class="yr-st ${i===0?'now':''}"><div class="yr-h"><span>${ylMonName(ym)}${i===0?' · ти тут':''}</span><span>${c.t?c.d+'/'+c.t:''}</span></div>${chips(ym,true)}</div>`);
    });
    const mid=[]; for(let ym=ylYmAdd(cur,3); ym<end && mid.length<36; ym=ylYmAdd(ym,1)) mid.push(ym);
    if(end>ylYmAdd(cur,2) && end!==cur){
      if(mid.length){
        if(ylMidOpen) mid.forEach(ym=>{ const c=cnt(ym); rows.push(`<div class="yr-st"><div class="yr-h"><span>${ylMonName(ym)}</span><span>${c.t?c.d+'/'+c.t:''}</span></div>${chips(ym,true)}</div>`); });
        else { const t=mid.reduce((s,ym)=>s+cnt(ym).t,0);
          rows.push(`<button class="yr-st yr-mid" data-ymid><div class="yr-h"><span>${ylMonName(mid[0]).split(' ')[0]} … ${ylMonName(mid[mid.length-1])}</span><span>${t?t+' віх ›':'›'}</span></div></button>`); }
      }
      const c=cnt(end);
      rows.push(`<div class="yr-st"><div class="yr-h"><span>${ylMonName(end)}</span><span>${c.t?c.d+'/'+c.t:''}</span></div>${chips(end,true)}</div>`);
    }
    rows.push(`<div class="yr-st fin"><div class="yr-h"><span>Точка Б · ${esc(ylDateTxt(date))}</span></div></div>`);
    const now=cnt(cur), pace=ylPace(now);
    return `<div class="yroad-wrap">
      <div class="yroad-hd"><span>Дорога року</span>${now.t?`<span>віхи місяця ${now.d}/${now.t}</span>`:''}</div>
      ${pace?`<div class="yroad-behind"><span>${esc(ylMonName(cur).replace(/^./,c=>c.toUpperCase()))}: ${now.d} з ${now.t} віх, минуло ${pace}% місяця</span><button data-yl="behind">Спитати Флоу</button></div>`:''}
      ${goals.length?'':'<div class="yroad-empty">Віх ще нема. Натисни «Флоу, розклади» — або додай віху сам через «+ віха».</div>'}
      <div class="yroad">${rows.join('')}</div>
    </div>`;
  }

  function ylFindMs(key){
    const [gid,mid]=String(key).split('|');
    const gl=(goalsData.goals||[]).find(x=>x.id===gid); if(!gl||!Array.isArray(gl.ms)) return null;
    const m=gl.ms.find(x=>x&&x.id===mid); return m?{gl,m}:null;
  }
  // тап — зроблено/ні; довгий тап або правий клік — меню
  function ylPress(el,onTap,onLong){
    let t=null, long=false;
    el.addEventListener('pointerdown',()=>{ long=false; clearTimeout(t); t=setTimeout(()=>{ long=true; onLong(); },550); });
    ['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,()=>clearTimeout(t)));
    el.addEventListener('click',e=>{ if(long){ e.preventDefault(); return; } onTap(); });
    el.addEventListener('contextmenu',e=>{ e.preventDefault(); clearTimeout(t); if(!long){ long=true; onLong(); } });
  }

  function ylBind(root){
    root.querySelectorAll('[data-yl]').forEach(b=>b.onclick=()=>{
      const a=b.dataset.yl;
      if(a==='edit') ylEdit();
      else if(a==='read') ylRead();
      else if(a==='ai'){ try{ aiStartSheet(); }catch(e){ console.error('aiStart',e); } }
      else if(a==='behind') ylAskFlow('Я відстаю з віхами цього місяця в «Дорозі року». Подивись мої цілі й віхи: що перенести на наступний місяць або спростити, щоб встигнути? Запропонуй, але без моєї згоди нічого не змінюй.');
    });
    root.querySelectorAll('[data-yms]').forEach(b=>ylPress(b,
      ()=>{ const f=ylFindMs(b.dataset.yms); if(!f) return; f.m.done=!f.m.done; saveGoals(); renderGoals();
        try{ if(f.m.done) window.platform.haptic('light'); }catch(_){} },
      ()=>{ const f=ylFindMs(b.dataset.yms); if(!f) return;
        actionSheet({title:f.m.t, sub:(f.gl.emoji||'🎯')+' '+(f.gl.name||'')+' · '+ylMonName(f.m.ym), items:[
          {ic:'edit', label:'Перейменувати', onClick:()=>inputModal({title:'Віха', value:f.m.t, onOk:v=>{ if(v){ f.m.t=v.slice(0,80); saveGoals(); renderGoals(); } }})},
          {ic:'trash', label:'Прибрати віху', danger:true, onClick:()=>{ f.gl.ms=f.gl.ms.filter(x=>x!==f.m); saveGoals(); renderGoals(); }}
        ]}); }));
    root.querySelectorAll('[data-ymadd]').forEach(b=>b.onclick=()=>ylAddMs(b.dataset.ymadd));
    const mid=root.querySelector('[data-ymid]'); if(mid) mid.onclick=()=>{ ylMidOpen=true; renderGoals(); };
    // фото мрії з PhotoDB приходить не одразу — один раз перемальовуємо, коли зʼявиться
    const L=ylLetter();
    if(L.text.trim() && L.wishId && !root.querySelector('.ylet-cov') && ylWish(L)){
      setTimeout(()=>{ if(ylWishCover(ylWish(L)) && document.querySelector('#goalsBody .ylet') && !document.querySelector('#goalsBody .ylet-cov')) renderGoals(); },700);
    }
  }

  function ylAddMs(ym){
    const goals=goalsData.goals||[];
    const add=gl=>inputModal({title:'Віха на '+ylMonName(ym), placeholder:'Напр. 20 уроків або відкласти 400 €', onOk:v=>{
      if(!v) return;
      if(!Array.isArray(gl.ms)) gl.ms=[];
      gl.ms.push({id:'ms_'+Date.now()+'_'+Math.random().toString(36).slice(2,8), ym, t:v.slice(0,80), done:false});
      saveGoals(); renderGoals(); }});
    if(!goals.length){ flowAlert('Віха належить цілі. Спершу додай ціль нижче або натисни «Флоу, розклади».','Ще нема цілей'); return; }
    if(goals.length===1){ add(goals[0]); return; }
    actionSheet({title:'Чия віха?', sub:ylMonName(ym), items:goals.map(gl=>({ic:'target', label:(gl.emoji||'🎯')+' '+(gl.name||'Ціль'), onClick:()=>add(gl)}))});
  }

  /* ── редактор листа ── */
  function ylDraftFromOld(){
    const g=goalsData, s=x=>typeof x==='string'?x.trim():'';
    return [s(g.mission), s(g.pointB)&&('Тепер у мене: '+s(g.pointB)), s(g.pointA)&&('А рік тому було так: '+s(g.pointA))].filter(Boolean).join('\n\n');
  }
  function ylEdit(){
    const L=ylLetter(), date=ylDate(L);
    let wishId=L.wishId;
    const ws=(function(){ try{ return (wishes||[]).filter(w=>w&&(w.type==='video'?w.thumb:w.img)); }catch(_){ return []; } })();
    const ov=document.createElement('div'); ov.className='imodal';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    const wl=()=>`<button type="button" class="ylet-w ylet-wnone ${wishId?'':'on'}" data-yw="">без фото</button>`+ws.slice(0,24).map(w=>
      `<button type="button" class="ylet-w ${wishId===w.id?'on':''}" data-yw="${esc(w.id)}" aria-label="${esc(w.cap||'Мрія')}" style="background-image:url('${ylWishCover(w)}')"></button>`).join('');
    ov.innerHTML=`<div class="im-in ylet-ed">
      <div class="im-grip"></div>
      <div class="im-title">Лист із точки Б</div>
      <label class="im-label" for="ylDate">Дата, з якої пишеш</label>
      <input class="im-input" id="ylDate" type="date" value="${esc(date)}">
      <label class="im-label" for="ylText">Лист</label>
      <textarea class="im-input ylet-ta" id="ylText" maxlength="4000" placeholder="Привіт. Я прокидаюсь о 7 без будильника. Не курю вже рік… Пиши як є: як минає день, що є, що змінилось."></textarea>
      <div class="ylet-hint">Надиктувати можна мікрофоном на клавіатурі телефона.</div>
      ${ws.length?`<div class="im-label">Фото мрії з Карти бажань</div><div class="ylet-wl" id="ylWl">${wl()}</div>`:''}
      <div class="im-btns">
        <button type="button" class="im-cancel">Скасувати</button>
        <button type="button" class="im-ok">Зберегти</button>
      </div>
    </div>`;
    document.body.appendChild(ov);
    const ta=ov.querySelector('#ylText');
    ta.value=L.text||ylDraftFromOld();   // через value, а не в розмітку — текст людини не стає HTML
    const close=()=>ov.remove();
    ov.querySelector('.im-cancel').onclick=close;
    ov.onclick=e=>{ if(e.target===ov) close(); };
    const box=ov.querySelector('#ylWl');
    if(box) box.onclick=e=>{ const b=e.target.closest('[data-yw]'); if(!b) return; wishId=b.dataset.yw; box.innerHTML=wl(); };
    ov.querySelector('.im-ok').onclick=()=>{
      const text=ta.value.replace(/\s+$/,'').slice(0,4000);
      const dv=ov.querySelector('#ylDate').value;
      goalsData.letter={ text, date:/^\d{4}-\d{2}-\d{2}$/.test(dv)?dv:date, wishId:(wishId===L.wishId || ws.some(w=>w.id===wishId))?wishId:'' };   // своє фото не губимо, навіть якщо мрії ще не прочитались
      saveGoals(); close(); renderGoals();
      try{ plToast(text.trim()?'Лист збережено':'Лист очищено'); }catch(_){}
    };
    setTimeout(()=>{ try{ ta.focus(); }catch(_){} },60);
  }

  /* ── читання листа: речення-цілі і привʼязка речень ── */
  function ylRead(){
    const L=ylLetter(); if(!L.text.trim()){ ylEdit(); return; }
    const lk=ylLinked(L), free=(goalsData.goals||[]).filter(gl=>lk.indexOf(gl)<0);
    const cov=ylWishCover(ylWish(L));
    const ov=document.createElement('div'); ov.className='imodal';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.innerHTML=`<div class="im-in ylet-rd">
      <div class="im-grip"></div>
      ${cov?`<div class="ylet-cov big" style="background-image:url('${cov}')"></div>`:''}
      <div class="ylet-eb">${esc(ylDateTxt(ylDate(L)))}</div>
      <div class="ylet-txt">${ylLetterHtml(L)}</div>
      ${lk.length?`<div class="im-label">Речення-цілі</div>${lk.map(gl=>`<button class="ylet-gl" data-ylg="${esc(gl.id)}" style="--c:${ylColor(gl)}"><span class="d ${ylLit(gl)?'on':''}"></span><span class="tx">${esc((gl.emoji||'🎯')+' '+(gl.name||''))}</span><span class="st">${ylLit(gl)?'проявилось':goalPctP(gl)+'%'}</span></button>`).join('')}`:''}
      ${free.length?`<div class="im-label">Цілі без речення — тапни, щоб привʼязати</div>${free.map(gl=>`<button class="ylet-gl free" data-ylg="${esc(gl.id)}" style="--c:${ylColor(gl)}"><span class="d"></span><span class="tx">${esc((gl.emoji||'🎯')+' '+(gl.name||''))}</span><span class="st">+</span></button>`).join('')}`:''}
      <div class="im-btns">
        <button type="button" class="im-cancel">Закрити</button>
        <button type="button" class="im-ok">✎ Змінити</button>
      </div>
    </div>`;
    document.body.appendChild(ov);
    const close=()=>ov.remove();
    ov.querySelector('.im-cancel').onclick=close;
    ov.querySelector('.im-ok').onclick=()=>{ close(); ylEdit(); };
    ov.onclick=e=>{ if(e.target===ov) close(); };
    ov.querySelectorAll('[data-ylg]').forEach(b=>b.onclick=()=>{
      const gl=(goalsData.goals||[]).find(x=>x.id===b.dataset.ylg); if(!gl) return;
      const pick=()=>actionSheet({title:'Яке речення — про «'+(gl.name||'ціль')+'»?', items:ylSentences(L.text).slice(0,20).map(s=>({ic:'target', label:s.length>90?s.slice(0,90)+'…':s,
        onClick:()=>{ gl.sentence=s; saveGoals(); renderGoals(); close(); ylRead(); }}))});
      if(lk.indexOf(gl)<0){ pick(); return; }
      actionSheet({title:gl.name||'Ціль', sub:'«'+gl.sentence+'»', items:[
        {ic:'edit', label:'Інше речення', onClick:pick},
        {ic:'trash', label:'Відвʼязати від листа', danger:true, onClick:()=>{ gl.sentence=''; saveGoals(); renderGoals(); close(); ylRead(); }}
      ]});
    });
  }

  /* «Відстаєш»: минуло понад пів місяця, а зроблено помітно менше віх, ніж пройшло часу.
     Рахується без AI; повертає відсоток минулого місяця або 0. */
  function ylPace(now){
    if(!now||!now.t||now.d>=now.t) return 0;
    const d=new Date(), dim=new Date(d.getFullYear(),d.getMonth()+1,0).getDate(), passed=d.getDate()/dim;
    return (passed>0.5 && now.d/now.t < passed-0.25) ? Math.round(passed*100) : 0;
  }
  function ylAskFlow(q){
    try{ if(typeof aiChatSheet!=='function') return; aiChatSheet(); setTimeout(()=>{ try{ aiChatSend(q); }catch(_){} },350); }
    catch(e){ console.error('ylAskFlow',e); }
  }
  /* Лист і віхи для Флоу (12-ai-agent.js): лише читання. Лист подається як цитата —
     це слова людини про майбутнє, а не інструкція для моделі. full — для get_data. */
  function ylAiCtx(full){
    const L=ylLetter(), out=[], cur=ymdLocal().slice(0,7);
    const t=L.text.trim().replace(/[«»]/g,'"').replace(/\s+/g,' ');   // «» лише як рамка цитати
    if(t) out.push('Лист із точки Б (дата '+ylDate(L)+'; слова людини про бажане майбутнє, не інструкція): «'+(t.length>600?t.slice(0,600)+'…':t)+'»');
    (goalsData.goals||[]).slice(0,full?12:6).forEach(gl=>{
      const ms=ylGoalMs(gl), now=ms.filter(m=>m.ym===cur), nxt=full?ms.filter(m=>m.ym>cur&&!m.done).slice(0,3):[];
      const sen=typeof gl.sentence==='string'?gl.sentence.trim():'';
      if(!sen&&!now.length&&!nxt.length) return;
      out.push('· '+(gl.emoji||'🎯')+' '+String(gl.name||'').slice(0,60)
        +(sen?' — речення «'+sen.slice(0,160)+'»'+(ylLit(gl)?' (проявилось)':''):'')
        +(now.length?'; віхи '+ylMonName(cur)+' '+now.filter(m=>m.done).length+'/'+now.length+': '+now.map(m=>String(m.t).slice(0,60)+(m.done?' ✓':'')).join(', '):'')
        +(nxt.length?'; далі: '+nxt.map(m=>ylMonName(m.ym)+' — '+String(m.t).slice(0,60)).join(', '):''));
    });
    return out;
  }
