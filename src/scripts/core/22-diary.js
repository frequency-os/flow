  /* ============ ЩОДЕННИК ============ */
  const DIARY_KEY='diary_entries_v1';
  let diaryEntries={};              // { 'YYYY-MM-DD': {text, ts} }
  let diaSelDate='';                // який день зараз відкритий у полі вводу
  let diaSaveTimer=null;
  function diaEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function saveDiaryEntries(){
    try{ const p=window.storage.set(DIARY_KEY,JSON.stringify(diaryEntries),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
    try{ if(typeof renderHeroStreak==='function') renderHeroStreak(); }catch(_){}
  }
  function diaFmtDate(ymd){
    try{
      const p=String(ymd).split('-').map(Number);
      const d=new Date(p[0],p[1]-1,p[2]);
      const months=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
      // рік показуємо лише для записів не цьогорічних — інакше «5 січня» з різних років не розрізнити
      const cy=new Date().getFullYear();
      return d.getDate()+' '+months[d.getMonth()]+(p[0]!==cy ? ' '+p[0] : '');
    }catch(_){ return ymd; }
  }
  // 'YYYY-MM-DD' для дня зі зсувом off від сьогодні (не залежить від хелперів інших модулів)
  function diaDs(off){
    const d=new Date(); d.setDate(d.getDate()+(off||0));
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function diaHasEntry(ds){ return !!(diaryEntries[ds]&&diaryEntries[ds].text&&diaryEntries[ds].text.trim()); }
  function diaStreakCalc(){
    let s=0;
    for(let i=0;i<400;i++){ if(diaHasEntry(diaDs(-i))) s++; else if(i===0) continue; else break; }
    let best=0,cur=0;
    Object.keys(diaryEntries).filter(diaHasEntry).sort().forEach((ds,i,arr)=>{
      if(i>0){ const prev=new Date(arr[i-1]), me=new Date(ds); cur=((me-prev)<=90000000)?cur+1:1; }
      else cur=1;
      if(cur>best) best=cur;
    });
    return {s,best:Math.max(best,s)};
  }
  function diaCalHTML(){
    const DW=['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
    const cal=[];
    for(let i=-10;i<=2;i++){
      const dd=new Date(); dd.setDate(dd.getDate()+i);
      const ds=diaDs(i);
      const sel=ds===diaSelDate;
      cal.push('<div class="cd '+(sel?'today':'')+' '+(diaHasEntry(ds)?'done':(i<0?'miss':''))+'" data-diacal="'+ds+'"'
        +(ds===diaDs(0)?' id="diaTodayCell"':'')+'><s>'+DW[dd.getDay()]+'</s><b>'+dd.getDate()+'</b><i></i></div>');
    }
    return cal.join('');
  }
  function goDiary(){ diaSelDate=plTodayStr(); renderDiary(); show('scr-diary'); }
  window.goDiary=goDiary;
  function renderDiary(){
    const dEl=document.getElementById('diaTodayDate');
    const inp=document.getElementById('diaInput');
    const listEl=document.getElementById('diaList');
    const calEl=document.getElementById('diaCal');
    const stEl=document.getElementById('diaStreakLine');
    const auEl=document.getElementById('diaAudioRow');
    const micEl=document.getElementById('diaMicBtn');
    if(!dEl||!inp||!listEl) return;
    const isToday = diaSelDate===plTodayStr();
    dEl.textContent = (isToday?'Сьогодні · ':'') + diaFmtDate(diaSelDate);
    inp.value = (diaryEntries[diaSelDate]&&diaryEntries[diaSelDate].text) || '';
    const days=Object.keys(diaryEntries)
      .filter(k=>diaryEntries[k]&&diaryEntries[k].text&&diaryEntries[k].text.trim()&&k!==diaSelDate)
      .sort().reverse();
    listEl.innerHTML = days.length ? days.slice(0,60).map(k=>{
      const e=diaryEntries[k];
      return '<div class="dia-entry" data-diaopen="'+k+'"><div class="de-date">'+diaFmtDate(k)+'</div><div class="de-txt">'+diaEsc(e.text)+'</div></div>';
    }).join('') : '<div class="dia-empty">Тут з\'являться попередні записи, щойно ти збережеш перший.</div>';
    // календар + стрік
    if(calEl){
      calEl.innerHTML=diaCalHTML();
      calEl.querySelectorAll('[data-diacal]').forEach(el=>{
        el.onclick=()=>{ diaSelDate=el.dataset.diacal; renderDiary(); };
      });
      if(diaSelDate===diaDs(0)){
        requestAnimationFrame(()=>{ try{
          const t=document.getElementById('diaTodayCell'), c=t&&t.parentElement;
          if(c) c.scrollLeft=Math.max(0, t.offsetLeft-(c.clientWidth-t.offsetWidth)/2);
        }catch(_){} });
      }
    }
    if(stEl){
      const st=diaStreakCalc();
      stEl.innerHTML='🔥 <b>стрік '+st.s+' '+(st.s===1?'день':(st.s>=2&&st.s<=4?'дні':'днів'))+'</b> · найкращий — '+st.best;
    }
    // голосовий запис, прикріплений до відкритого дня
    const rec=diaryEntries[diaSelDate]&&diaryEntries[diaSelDate].audio;
    if(auEl){
      if(rec){
        auEl.style.display='flex';
        auEl.innerHTML='<button data-diaplay><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><polygon points="8 5 18 12 8 19" fill="currentColor" stroke="none"/></svg></button>'
          +'<span>Голосовий запис · '+diaFmtDur(rec.dur||0)+'</span>'
          +'<button class="dia-au-rm" data-diarm>Прибрати</button>';
        const pb=auEl.querySelector('[data-diaplay]'); if(pb) pb.onclick=()=>diaPlayAudio(rec.a);
        const rb=auEl.querySelector('[data-diarm]'); if(rb) rb.onclick=()=>{
          if(diaryEntries[diaSelDate]) delete diaryEntries[diaSelDate].audio;
          saveDiaryEntries(); renderDiary();
        };
      } else { auEl.style.display='none'; auEl.innerHTML=''; }
    }
    if(micEl) micEl.classList.toggle('live', !!diaRec);
  }
  window.renderDiary=renderDiary;
  { const b=document.getElementById('diaryBack'); if(b) b.onclick=()=>show('scr-home'); }
  { const inp=document.getElementById('diaInput');
    if(inp) inp.oninput=()=>{
      const hint=document.getElementById('diaSaveHint'); if(hint){ hint.textContent='Зберігаю…'; hint.style.opacity='1'; }
      if(diaSaveTimer) clearTimeout(diaSaveTimer);
      diaSaveTimer=setTimeout(()=>{
        const v=inp.value;
        if(v.trim()) diaryEntries[diaSelDate]={text:v,ts:Date.now()};
        else delete diaryEntries[diaSelDate];
        saveDiaryEntries();
        const hint2=document.getElementById('diaSaveHint');
        if(hint2){ hint2.textContent='Збережено'; setTimeout(()=>{ if(hint2) hint2.style.opacity='.65'; },900); }
      },700);
    };
  }
  { const l=document.getElementById('diaList');
    if(l) l.addEventListener('click',e=>{
      const it=e.target.closest('[data-diaopen]'); if(!it) return;
      diaSelDate=it.dataset.diaopen; renderDiary();
      const inp=document.getElementById('diaInput'); if(inp) inp.focus();
    });
  }
  // 🧠 АІ шукає патерни в останніх записах: тригери, стани, що повторюється, що варто змінити
  async function diaAnalyze(){
    const btn=document.getElementById('diaAnalyzeBtn');
    const out=document.getElementById('diaAiOut');
    if(!btn||!out) return;
    const inp=document.getElementById('diaInput');
    if(inp){ const v=inp.value; if(v.trim()){ diaryEntries[diaSelDate]={text:v,ts:Date.now()}; saveDiaryEntries(); } }
    const days=Object.keys(diaryEntries)
      .filter(k=>diaryEntries[k]&&diaryEntries[k].text&&diaryEntries[k].text.trim())
      .sort().reverse().slice(0,14).reverse();
    if(!days.length){ try{ flowAlert('Спершу напиши хоча б один запис.'); }catch(_){} return; }
    const body=days.map(k=>diaFmtDate(k)+':\n'+diaryEntries[k].text).join('\n\n---\n\n');
    btn.disabled=true; const oldTxt=btn.textContent; btn.textContent='Аналізую…';
    out.style.display='block'; out.textContent='';
    try{
      await aiCall(
        'Ти — уважний і чесний аналітик щоденника. Тобі дають записи людини за останні дні (від старіших до новіших). '
        +'Знайди РЕАЛЬНІ повторювані патерни (тригери, стани, звички — хороші й погані) на основі того, що людина сама написала — '
        +'без загальних банальностей і без вигаданих фактів. Дай 2-4 конкретні спостереження і 1-3 практичні поради, що варто спробувати змінити. '
        +'Пиши стисло, по суті, українською мовою, без вступних фраз на кшталт "Я проаналізував записи".',
        [{role:'user',content:body}],
        (partial)=>{ out.textContent=partial; }
      );
    }catch(e){ out.textContent='Не вдалося проаналізувати: '+(e.message||'спробуй пізніше.'); }
    btn.disabled=false; btn.textContent=oldTxt;
  }
  window.diaAnalyze=diaAnalyze;
  { const b=document.getElementById('diaAnalyzeBtn'); if(b) b.onclick=diaAnalyze; }

  // 🎙 голосовий запис для поточного відкритого дня (той самий підхід, що й у «Ранковому ритуалі»)
  let diaRec=null, diaRecT=null, diaRecSec=0;
  function diaFmtDur(sec){ sec=Math.max(0,sec|0); return (sec/60|0)+':'+String(sec%60).padStart(2,'0'); }
  function diaPlayAudio(a){ try{ const au=new Audio(a); au.play().catch(()=>{}); }catch(_){} }
  async function diaRecord(){
    if(diaRec){ try{ diaRec.stop(); }catch(_){} return; }
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mime=MediaRecorder.isTypeSupported('audio/mp4')?'audio/mp4':(MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'');
      diaRec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
      const chunks=[]; diaRecSec=0;
      diaRec.ondataavailable=e=>{ if(e.data&&e.data.size) chunks.push(e.data); };
      diaRec.onstop=()=>{
        stream.getTracks().forEach(t=>t.stop());
        clearInterval(diaRecT); const sec=diaRecSec; const mt=diaRec.mimeType||'audio/mp4'; diaRec=null;
        const blob=new Blob(chunks,{type:mt});
        if(blob.size<1200){ try{ flowAlert('🎙 Закоротко, спробуй ще раз.'); }catch(_){} renderDiary(); return; }
        const fr=new FileReader();
        fr.onload=()=>{
          const rec={a:fr.result,dur:sec};
          const e2=diaryEntries[diaSelDate]||{text:'',ts:Date.now()};
          e2.audio=rec; e2.ts=Date.now();
          diaryEntries[diaSelDate]=e2;
          saveDiaryEntries(); renderDiary();
          try{ window.platform.haptic('medium'); }catch(_){}
        };
        fr.readAsDataURL(blob);
      };
      diaRec.start();
      diaRecT=setInterval(()=>{ diaRecSec++; const t=document.getElementById('diaRecTm'); if(t) t.textContent='● '+diaFmtDur(diaRecSec); },1000);
      renderDiary();
      try{ flowAlert('🎙 Говори — тап ще раз, щоб зупинити'); }catch(_){}
    }catch(e){ diaRec=null; try{ flowAlert('⚠️ Нема доступу до мікрофона'); }catch(_){} }
  }
  window.diaRecord=diaRecord;
  { const b=document.getElementById('diaMicBtn'); if(b) b.onclick=diaRecord; }
  // безпека: не пишемо тихо у фоні, якщо застосунок згорнули
  document.addEventListener('visibilitychange',function(){
    if(document.hidden&&diaRec){ try{ diaRec.stop(); }catch(_){} }
  });

