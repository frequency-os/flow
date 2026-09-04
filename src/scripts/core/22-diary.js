  /* ============ ЩОДЕННИК ============ */
  const DIARY_KEY='diary_entries_v1';
  const DIAINS_KEY='diary_insights_v1';   // кеш AI: настрій по днях + збережені аналізи тижнів
  const DIABOOKS_KEY='diary_books_v1';    // зошити: {books:[{id,name,emoji,color}], entries:{bookId:[{id,text,ts,audio?}]}}
  let diaryEntries={};              // { 'YYYY-MM-DD': {text, ts, mood?, audio?} } — mood 1..5, поставлений рукою
  let diaInsights={mood:{},weeks:{}}; // mood: {'YYYY-MM-DD': 1..5 (оцінка AI)}, weeks: {'пн тижня': {text,ts}}
  let diaBooks={books:[],entries:{}};
  let diaSelDate='';                // який день зараз відкритий у полі вводу
  let diaSaveTimer=null;
  let diaTab='write';               // активна вкладка: write | view | books
  let diaViewWeek='';               // понеділок тижня, відкритого на вкладці «Огляд»
  let diaCurBook='';                // відкритий зошит ('' — полиця)
  const DIA_MONTHS=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
  const DIA_MOODS=['😞','😕','😐','🙂','🤩'];
  function diaEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function diaPlural(n,a,b,c){ const m10=n%10,m100=n%100; if(m10===1&&m100!==11) return a; if(m10>=2&&m10<=4&&(m100<10||m100>=20)) return b; return c; }
  function saveDiaryEntries(){
    try{ const p=window.storage.set(DIARY_KEY,JSON.stringify(diaryEntries),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){}
    try{ if(typeof renderHeroStreak==='function') renderHeroStreak(); }catch(_){}
  }
  function saveDiaInsights(){ try{ const p=window.storage.set(DIAINS_KEY,JSON.stringify(diaInsights),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function saveDiaBooks(){ try{ const p=window.storage.set(DIABOOKS_KEY,JSON.stringify(diaBooks),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function diaFmtDate(ymd){
    try{
      const p=String(ymd).split('-').map(Number);
      const d=new Date(p[0],p[1]-1,p[2]);
      // рік показуємо лише для записів не цьогорічних — інакше «5 січня» з різних років не розрізнити
      const cy=new Date().getFullYear();
      return d.getDate()+' '+DIA_MONTHS[d.getMonth()]+(p[0]!==cy ? ' '+p[0] : '');
    }catch(_){ return ymd; }
  }
  function diaFmtYmd(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  // 'YYYY-MM-DD' для дня зі зсувом off від сьогодні (не залежить від хелперів інших модулів)
  function diaDs(off){ const d=new Date(); d.setDate(d.getDate()+(off||0)); return diaFmtYmd(d); }
  function diaAddDays(ds,n){ const p=String(ds).split('-').map(Number); const d=new Date(p[0],p[1]-1,p[2]); d.setDate(d.getDate()+n); return diaFmtYmd(d); }
  function diaMonday(ds){ const p=String(ds).split('-').map(Number); const d=new Date(p[0],p[1]-1,p[2]); d.setDate(d.getDate()-((d.getDay()+6)%7)); return diaFmtYmd(d); }
  // «25–31 серпня» або «31 серпня – 6 вересня» для тижня, що починається з понеділка mon
  function diaFmtRange(mon){
    try{
      const p=String(mon).split('-').map(Number);
      const d1=new Date(p[0],p[1]-1,p[2]); const d7=new Date(p[0],p[1]-1,p[2]+6);
      const yr=(d7.getFullYear()!==new Date().getFullYear())?' '+d7.getFullYear():'';
      if(d1.getMonth()===d7.getMonth()) return d1.getDate()+'–'+d7.getDate()+' '+DIA_MONTHS[d1.getMonth()]+yr;
      return d1.getDate()+' '+DIA_MONTHS[d1.getMonth()]+' – '+d7.getDate()+' '+DIA_MONTHS[d7.getMonth()]+yr;
    }catch(_){ return mon; }
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
  // ds — необовʼязкова дата 'YYYY-MM-DD' (глобальний пошук); onclick передає Event — відсіюємо
  function goDiary(ds){ diaSelDate=(typeof ds==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(ds))?ds:plTodayStr();
    diaViewWeek=diaMonday(diaSelDate); renderDiary(); diaShowTab('write'); show('scr-diary'); }
  window.goDiary=goDiary;
  // місток для глобального пошуку: всі записи (щоденник + зошити)
  window.flowSearchDiary=function(){
    const out=[];
    try{ Object.keys(diaryEntries||{}).forEach(ds=>{ const e=diaryEntries[ds]; if(e&&e.text) out.push({date:ds, book:'', text:e.text}); }); }catch(_){}
    try{ (diaBooks.books||[]).forEach(b=>{ (diaBooks.entries[b.id]||[]).forEach(e=>{ if(e&&e.text) out.push({date:'', book:b.name||'Зошит', text:e.text}); }); }); }catch(_){}
    return out;
  };

  /* ── вкладки: Запис / Огляд / Зошити ── */
  function diaShowTab(t){
    diaTab=t;
    document.querySelectorAll('#diaTabs [data-diatab]').forEach(b=>b.classList.toggle('on',b.dataset.diatab===t));
    const pw=document.getElementById('diaPaneWrite'), pv=document.getElementById('diaPaneView'), pb=document.getElementById('diaPaneBooks');
    if(pw) pw.style.display=(t==='write')?'':'none';
    if(pv) pv.style.display=(t==='view')?'':'none';
    if(pb) pb.style.display=(t==='books')?'':'none';
    if(t==='view'){ renderDiaView(); diaMoodBatch(); }
    if(t==='books') renderDiaBooks();
  }
  { document.querySelectorAll('#diaTabs [data-diatab]').forEach(b=>{ b.onclick=()=>diaShowTab(b.dataset.diatab); }); }

  /* ── настрій дня: смайлик рукою має пріоритет над оцінкою AI ── */
  function diaMoodOf(ds){
    const e=diaryEntries[ds];
    if(e&&e.mood>=1) return {v:e.mood,src:'me'};
    const a=diaInsights.mood&&diaInsights.mood[ds];
    if(a>=1) return {v:a,src:'ai'};
    return null;
  }
  function diaSetMood(v){
    const e=diaryEntries[diaSelDate]||{text:'',ts:Date.now()};
    if(e.mood===v) delete e.mood; else e.mood=v;
    if((e.text&&e.text.trim())||e.audio||e.mood) diaryEntries[diaSelDate]=e;
    else delete diaryEntries[diaSelDate];
    saveDiaryEntries(); renderDiary();
    try{ window.platform.haptic('light'); }catch(_){}
  }
  function diaRenderStreak(){
    const stEl=document.getElementById('diaStreakLine'); if(!stEl) return;
    const st=diaStreakCalc();
    stEl.innerHTML='🔥 <b>стрік '+st.s+' '+diaPlural(st.s,'день','дні','днів')+'</b> · найкращий — '+st.best;
  }
  function renderDiary(){
    const dEl=document.getElementById('diaTodayDate');
    const inp=document.getElementById('diaInput');
    const listEl=document.getElementById('diaList');
    const calEl=document.getElementById('diaCal');
    const stEl=document.getElementById('diaStreakLine');
    const auEl=document.getElementById('diaAudioRow');
    const micEl=document.getElementById('diaMicBtn');
    const moodEl=document.getElementById('diaMoodRow');
    if(!dEl||!inp||!listEl) return;
    const isToday = diaSelDate===plTodayStr();
    dEl.textContent = (isToday?'Сьогодні · ':'') + diaFmtDate(diaSelDate);
    inp.value = (diaryEntries[diaSelDate]&&diaryEntries[diaSelDate].text) || '';
    if(moodEl){
      const cur=(diaryEntries[diaSelDate]||{}).mood||0;
      moodEl.innerHTML=DIA_MOODS.map((m,i)=>'<button class="dia-mood-b'+(cur===i+1?' on':'')+'" data-diamood="'+(i+1)+'" title="Настрій дня">'+m+'</button>').join('');
      moodEl.querySelectorAll('[data-diamood]').forEach(b=>{ b.onclick=()=>diaSetMood(+b.dataset.diamood); });
    }
    const days=Object.keys(diaryEntries)
      .filter(k=>diaryEntries[k]&&diaryEntries[k].text&&diaryEntries[k].text.trim()&&k!==diaSelDate)
      .sort().reverse();
    listEl.innerHTML = days.length ? days.slice(0,60).map(k=>{
      const e=diaryEntries[k];
      const m=diaMoodOf(k);
      return '<div class="dia-entry" data-diaopen="'+k+'"><div class="de-date">'+diaFmtDate(k)+(m?' · '+DIA_MOODS[m.v-1]:'')+'</div><div class="de-txt">'+diaEsc(e.text)+'</div></div>';
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
    diaRenderStreak();
    // спільна стрічка: записи зошитів за відкритий день (джерело даних — самі зошити)
    const dbEl=document.getElementById('diaDayBooks');
    if(dbEl){
      const rows=[];
      (diaBooks.books||[]).forEach(b=>{
        (diaBooks.entries[b.id]||[]).forEach(e=>{
          if(diaFmtYmd(new Date(e.ts))!==diaSelDate) return;
          rows.push({b,e});
        });
      });
      rows.sort((x,y)=>x.e.ts-y.e.ts);
      dbEl.innerHTML=rows.length ? '<div class="dia-list-head">Із зошитів цього дня</div><div class="dia-list">'
        +rows.map(r=>'<div class="dia-entry" data-diagobook="'+r.b.id+'"><div class="de-date" style="color:'+diaEsc(r.b.color)+'">'
          +diaEsc(r.b.emoji+' '+r.b.name)+(r.e.audio?' · 🎙 '+diaFmtDur(r.e.audio.dur||0):'')+'</div>'
          +'<div class="de-txt">'+diaEsc(r.e.text||'')+'</div></div>').join('')+'</div>' : '';
      dbEl.querySelectorAll('[data-diagobook]').forEach(el=>{
        el.onclick=()=>{ diaCurBook=el.dataset.diagobook; diaShowTab('books'); };
      });
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
        const prev=diaryEntries[diaSelDate];
        if(v.trim()){
          diaryEntries[diaSelDate]=Object.assign(prev||{},{text:v,ts:Date.now()});
          // текст змінився — стара AI-оцінка настрою за цей день більше не актуальна
          if(diaInsights.mood&&diaInsights.mood[diaSelDate]){ delete diaInsights.mood[diaSelDate]; saveDiaInsights(); }
        }
        else if(prev&&(prev.audio||prev.mood)){ prev.text=''; prev.ts=Date.now(); }
        else delete diaryEntries[diaSelDate];
        saveDiaryEntries();
        // оновлюємо стрік і крапку в календарі, не чіпаючи поле вводу (щоб не збити курсор)
        try{
          diaRenderStreak();
          const cell=document.querySelector('[data-diacal="'+diaSelDate+'"]');
          if(cell){ const has=diaHasEntry(diaSelDate); cell.classList.toggle('done',has); if(has) cell.classList.remove('miss'); }
        }catch(_){}
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

  /* ══════════ вкладка «Огляд»: настрій + аналіз тижня ══════════ */
  function diaWeekDss(mon){ const r=[]; for(let i=0;i<7;i++) r.push(diaAddDays(mon,i)); return r; }
  function diaWeekAvg(mon){ let s=0,n=0; diaWeekDss(mon).forEach(ds=>{ const m=diaMoodOf(ds); if(m){ s+=m.v; n++; } }); return n?s/n:0; }
  function renderDiaView(){
    const tEl=document.getElementById('diaWeekTitle'); if(!tEl) return;
    const cur=diaMonday(plTodayStr());
    if(!diaViewWeek) diaViewWeek=cur;
    const mon=diaViewWeek;
    tEl.textContent=(mon===cur?'Цей тиждень · ':'Тиждень · ')+diaFmtRange(mon);
    // тренд проти попереднього тижня
    const trEl=document.getElementById('diaWeekTrend');
    if(trEl){
      const a=diaWeekAvg(mon), b=diaWeekAvg(diaAddDays(mon,-7));
      if(a&&b){
        trEl.textContent=(a-b>0.3)?'настрій ↑':((b-a>0.3)?'настрій ↓':'настрій →');
        trEl.style.color=(a-b>0.3)?'var(--owed)':((b-a>0.3)?'var(--owe)':'var(--muted)');
      } else trEl.textContent='';
    }
    // стовпчики тижня: свій смайлик — насичений, оцінка AI — прозоріший
    const bEl=document.getElementById('diaWeekBars');
    if(bEl){
      bEl.innerHTML=diaWeekDss(mon).map(ds=>{
        const m=diaMoodOf(ds);
        const h=m?Math.round(m.v/5*100):8;
        const tip=diaFmtDate(ds)+(m?' · '+DIA_MOODS[m.v-1]+(m.src==='ai'?' (оцінка AI)':''):' · нема запису');
        return '<div class="dwb '+(m?m.src:'no')+'" style="height:'+h+'%" title="'+diaEsc(tip)+'"></div>';
      }).join('');
    }
    // збережений аналіз тижня
    const out=document.getElementById('diaWeekOut'), btn=document.getElementById('diaWeekBtn');
    const saved=diaInsights.weeks&&diaInsights.weeks[mon];
    if(out&&!(btn&&btn.disabled)){
      if(saved&&saved.text){ out.style.display='block'; out.textContent=saved.text; }
      else { out.style.display='none'; out.textContent=''; }
    }
    if(btn&&!btn.disabled) btn.textContent=(saved&&saved.text)?'🧠 Оновити аналіз тижня':'🧠 Повний аналіз тижня';
    // настрій за 30 днів
    const mo=document.getElementById('diaMonthBars');
    if(mo){
      const cells=[];
      for(let i=29;i>=0;i--){
        const ds=diaDs(-i); const m=diaMoodOf(ds);
        cells.push('<div class="dwb sm '+(m?m.src:'no')+'" style="height:'+(m?Math.round(m.v/5*100):6)+'%" title="'+diaEsc(diaFmtDate(ds))+'"></div>');
      }
      mo.innerHTML=cells.join('');
    }
    // минулі тижні зі записами
    const wl=document.getElementById('diaWeeksList');
    if(wl){
      const mons={};
      Object.keys(diaryEntries).filter(diaHasEntry).forEach(ds=>{ const m=diaMonday(ds); mons[m]=(mons[m]||0)+1; });
      mons[cur]=mons[cur]||0;   // поточний тиждень у списку завжди
      const list=Object.keys(mons).sort().reverse().slice(0,10);
      wl.innerHTML=list.map(m=>{
        const n=mons[m]; const an=diaInsights.weeks&&diaInsights.weeks[m];
        return '<div class="dia-week-row'+(m===mon?' on':'')+'" data-diaweek="'+m+'">'
          +'<span class="dwr-ic">🧠</span>'
          +'<span class="dwr-t">'+diaFmtRange(m)+' · '+n+' '+diaPlural(n,'запис','записи','записів')+(an?' · аналіз збережено':'')+'</span>'
          +'<span class="dwr-ch">›</span></div>';
      }).join('');
      wl.querySelectorAll('[data-diaweek]').forEach(el=>{ el.onclick=()=>{ diaViewWeek=el.dataset.diaweek; renderDiaView(); }; });
    }
  }
  // 🧠 аналіз одного тижня; результат зберігається назавжди у diaInsights.weeks
  async function diaWeekAnalyze(){
    const btn=document.getElementById('diaWeekBtn');
    const out=document.getElementById('diaWeekOut');
    if(!btn||!out) return;
    const mon=diaViewWeek||diaMonday(plTodayStr());
    const days=diaWeekDss(mon).filter(diaHasEntry);
    if(!days.length){ try{ flowAlert('За цей тиждень ще нема текстових записів.'); }catch(_){} return; }
    const body=days.map(k=>diaFmtDate(k)+':\n'+diaryEntries[k].text).join('\n\n---\n\n');
    btn.disabled=true; btn.textContent='Аналізую…';
    out.style.display='block'; out.textContent='';
    try{
      const txt=await aiCall(
        'Ти — уважний і чесний аналітик щоденника. Тобі дають записи людини за один тиждень (від старіших до новіших). '
        +'Знайди РЕАЛЬНІ повторювані патерни (тригери, стани, звички — хороші й погані) на основі того, що людина сама написала — '
        +'без загальних банальностей і без вигаданих фактів. Дай 2-4 конкретні спостереження і 1-3 практичні поради на наступний тиждень. '
        +'Пиши стисло, по суті, українською мовою, без вступних фраз на кшталт "Я проаналізував записи".',
        [{role:'user',content:body}],
        (partial)=>{ out.textContent=partial; }
      );
      if(txt){ diaInsights.weeks=diaInsights.weeks||{}; diaInsights.weeks[mon]={text:txt,ts:Date.now()}; saveDiaInsights(); }
    }catch(e){ out.textContent='Не вдалося проаналізувати: '+(e.message||'спробуй пізніше.'); }
    btn.disabled=false;
    renderDiaView();
  }
  { const b=document.getElementById('diaWeekBtn'); if(b) b.onclick=diaWeekAnalyze; }
  // 🧠 батч-оцінка настрою: один виклик на всі дні без смайлика і без кешу
  let diaMoodBusy=false;
  async function diaMoodBatch(){
    if(diaMoodBusy) return;
    const days=[];
    for(let i=0;i<35;i++){
      const ds=diaDs(-i); const e=diaryEntries[ds];
      if(e&&e.text&&e.text.trim()&&!(e.mood>=1)&&!(diaInsights.mood&&diaInsights.mood[ds]>=1)) days.push(ds);
    }
    if(!days.length) return;
    diaMoodBusy=true;
    const note=document.getElementById('diaMoodNote');
    if(note) note.textContent='AI оцінює настрій…';
    try{
      const body=days.sort().map(ds=>ds+':\n'+String(diaryEntries[ds].text).slice(0,400)).join('\n\n---\n\n');
      const txt=await aiCall(
        'Оціни емоційний стан людини за кожен день за її записами в щоденнику, шкала 1-5 '
        +'(1 — дуже важкий день, 2 — поганий, 3 — нейтральний, 4 — хороший, 5 — чудовий). '
        +'Відповідай ЛИШЕ валідним JSON виду {"2026-09-01":3} з усіма наданими датами, без пояснень і тексту довкола.',
        [{role:'user',content:body}]);
      const m=String(txt||'').match(/\{[\s\S]*\}/);
      if(m){
        const obj=JSON.parse(m[0]); diaInsights.mood=diaInsights.mood||{};
        for(const k in obj){ const v=Math.round(+obj[k]); if(days.indexOf(k)>=0&&v>=1&&v<=5) diaInsights.mood[k]=v; }
        saveDiaInsights();
      }
    }catch(_){}
    if(note) note.textContent='';
    diaMoodBusy=false;
    if(diaTab==='view') renderDiaView();
  }

  /* ══════════ вкладка «Зошити»: окремі папки під свої теми ══════════ */
  const DIA_BOOK_EMOJIS=['🙏','💡','🌙','📖','✈️','❤️'];
  const DIA_BOOK_COLORS=['#34c77b','#e8843c','#c4a8ff','#5b8def'];
  let diaNewEmoji=DIA_BOOK_EMOJIS[0], diaNewColor=DIA_BOOK_COLORS[0];
  function renderDiaBooks(){
    const grid=document.getElementById('diaBooksGrid'); if(!grid) return;
    const home=document.getElementById('diaBooksHome'), view=document.getElementById('diaBookView');
    const book=diaBooks.books.find(b=>b.id===diaCurBook);
    if(home) home.style.display=book?'none':'';
    if(view) view.style.display=book?'':'none';
    if(book){ renderDiaBook(book); return; }
    grid.innerHTML=diaBooks.books.map(b=>{
      const n=(diaBooks.entries[b.id]||[]).length;
      return '<div class="dia-book" style="--bc:'+diaEsc(b.color)+'" data-diabook="'+b.id+'">'
        +'<div class="db-ic">'+diaEsc(b.emoji)+'</div><div class="db-t">'+diaEsc(b.name)+'</div>'
        +'<div class="db-n">'+n+' '+diaPlural(n,'запис','записи','записів')+'</div></div>';
    }).join('');
    grid.querySelectorAll('[data-diabook]').forEach(el=>{ el.onclick=()=>{ diaCurBook=el.dataset.diabook; renderDiaBooks(); }; });
    // пікери форми створення (поле назви не перемальовуємо, щоб не губити введене)
    const em=document.getElementById('diaBookEmojis'), co=document.getElementById('diaBookColors');
    if(em){
      em.innerHTML=DIA_BOOK_EMOJIS.map(e=>'<button class="dbp'+(e===diaNewEmoji?' on':'')+'" data-de="'+e+'">'+e+'</button>').join('');
      em.querySelectorAll('[data-de]').forEach(b=>{ b.onclick=()=>{ diaNewEmoji=b.dataset.de; renderDiaBooks(); }; });
    }
    if(co){
      co.innerHTML=DIA_BOOK_COLORS.map(c=>'<button class="dbp dot'+(c===diaNewColor?' on':'')+'" style="--bc:'+c+'" data-dc="'+c+'"></button>').join('');
      co.querySelectorAll('[data-dc]').forEach(b=>{ b.onclick=()=>{ diaNewColor=b.dataset.dc; renderDiaBooks(); }; });
    }
  }
  function renderDiaBook(book){
    const t=document.getElementById('diaBookTitle'); if(t) t.textContent=book.emoji+' '+book.name;
    const l=document.getElementById('diaBookList'); if(!l) return;
    const arr=(diaBooks.entries[book.id]||[]).slice().sort((a,b)=>b.ts-a.ts);
    l.innerHTML=arr.length?arr.map(e=>{
      const d=new Date(e.ts);
      const au=e.audio?'<button class="db-play" data-dbplay="'+e.id+'" style="background:none;border:0;color:'+diaEsc(book.color)+';cursor:pointer;padding:0;font-size:13px">▶ 🎙 '+diaFmtDur(e.audio.dur||0)+'</button>':'';
      return '<div class="dia-entry db-entry"><div><div class="de-date" style="color:'+diaEsc(book.color)+'">'+d.getDate()+' '+DIA_MONTHS[d.getMonth()]+'</div>'
        +'<div class="de-txt db-txt">'+diaEsc(e.text)+'</div>'+au+'</div>'
        +'<button class="db-del" data-dbdel="'+e.id+'" title="Видалити запис">✕</button></div>';
    }).join(''):'<div class="dia-empty">Перший запис — у полі зверху.</div>';
    l.querySelectorAll('[data-dbplay]').forEach(b=>{
      b.onclick=()=>{
        const e=(diaBooks.entries[book.id]||[]).find(x=>x.id===b.dataset.dbplay);
        if(e&&e.audio) diaPlayAudio(e.audio.a);
      };
    });
    l.querySelectorAll('[data-dbdel]').forEach(b=>{
      b.onclick=()=>{
        confirmSheet({title:'Видалити запис?',okLabel:'Видалити',onOk:()=>{
          diaBooks.entries[book.id]=(diaBooks.entries[book.id]||[]).filter(x=>x.id!==b.dataset.dbdel);
          saveDiaBooks(); renderDiaBooks();
        }});
      };
    });
  }
  { const b=document.getElementById('diaBookNewBtn');
    if(b) b.onclick=()=>{
      const f=document.getElementById('diaBookForm');
      if(f){ f.style.display=(f.style.display==='none')?'':'none'; if(f.style.display!=='none') renderDiaBooks(); }
    };
  }
  { const b=document.getElementById('diaBookCreate');
    if(b) b.onclick=()=>{
      const inp=document.getElementById('diaBookName');
      const name=((inp&&inp.value)||'').trim();
      if(!name){ try{ flowAlert('Дай зошиту назву.'); }catch(_){} return; }
      diaBooks.books.push({id:'b'+Date.now(),name:name,emoji:diaNewEmoji,color:diaNewColor});
      if(inp) inp.value='';
      const f=document.getElementById('diaBookForm'); if(f) f.style.display='none';
      saveDiaBooks(); renderDiaBooks();
    };
  }
  { const b=document.getElementById('diaBookBack'); if(b) b.onclick=()=>{ diaCurBook=''; renderDiaBooks(); }; }
  { const b=document.getElementById('diaBookAdd');
    if(b) b.onclick=()=>{
      const inp=document.getElementById('diaBookInput');
      const v=((inp&&inp.value)||'').trim(); if(!v) return;
      if(!diaBooks.books.find(x=>x.id===diaCurBook)) return;
      (diaBooks.entries[diaCurBook]=diaBooks.entries[diaCurBook]||[]).push({id:'e'+Date.now(),text:v,ts:Date.now()});
      if(inp) inp.value='';
      saveDiaBooks(); renderDiaBooks();
      try{ window.platform.haptic('light'); }catch(_){}
    };
  }
  { const b=document.getElementById('diaBookMenu');
    if(b) b.onclick=()=>{
      const book=diaBooks.books.find(x=>x.id===diaCurBook); if(!book) return;
      confirmSheet({title:'Видалити зошит «'+book.name+'»?',sub:'Разом з усіма його записами. Це незворотно.',okLabel:'Видалити зошит',onOk:()=>{
        diaBooks.books=diaBooks.books.filter(x=>x.id!==book.id);
        delete diaBooks.entries[book.id];
        diaCurBook=''; saveDiaBooks(); renderDiaBooks();
      }});
    };
  }

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
        const tm=document.getElementById('diaRecTm'); if(tm) tm.textContent='';
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

  // 🎙 голос у зошиті: стоп → НОВИЙ запис зошита з аудіо (+текст з поля, якщо був)
  let diaBookRec=null, diaBookRecT=null, diaBookRecSec=0;
  async function diaBookRecord(){
    if(diaBookRec){ try{ diaBookRec.stop(); }catch(_){} return; }
    if(!diaBooks.books.find(x=>x.id===diaCurBook)) return;
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mime=MediaRecorder.isTypeSupported('audio/mp4')?'audio/mp4':(MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'');
      const bookId=diaCurBook;
      diaBookRec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
      const chunks=[]; diaBookRecSec=0;
      diaBookRec.ondataavailable=e=>{ if(e.data&&e.data.size) chunks.push(e.data); };
      diaBookRec.onstop=()=>{
        stream.getTracks().forEach(t=>t.stop());
        clearInterval(diaBookRecT); const sec=diaBookRecSec; const mt=diaBookRec.mimeType||'audio/mp4'; diaBookRec=null;
        const tm=document.getElementById('diaBookRecTm'); if(tm) tm.textContent='';
        const mb=document.getElementById('diaBookMicBtn'); if(mb) mb.classList.remove('live');
        const blob=new Blob(chunks,{type:mt});
        if(blob.size<1200){ try{ flowAlert('🎙 Закоротко, спробуй ще раз.'); }catch(_){} return; }
        const fr=new FileReader();
        fr.onload=()=>{
          const inp=document.getElementById('diaBookInput');
          const txt=((inp&&inp.value)||'').trim();
          (diaBooks.entries[bookId]=diaBooks.entries[bookId]||[]).push({id:'e'+Date.now(),text:txt,ts:Date.now(),audio:{a:fr.result,dur:sec}});
          if(inp) inp.value='';
          saveDiaBooks(); renderDiaBooks();
          try{ window.platform.haptic('medium'); }catch(_){}
        };
        fr.readAsDataURL(blob);
      };
      diaBookRec.start();
      diaBookRecT=setInterval(()=>{ diaBookRecSec++; const t=document.getElementById('diaBookRecTm'); if(t) t.textContent='● '+diaFmtDur(diaBookRecSec); },1000);
      const mb=document.getElementById('diaBookMicBtn'); if(mb) mb.classList.add('live');
      try{ flowAlert('🎙 Говори — тап ще раз, щоб зупинити'); }catch(_){}
    }catch(e){ diaBookRec=null; try{ flowAlert('⚠️ Нема доступу до мікрофона'); }catch(_){} }
  }
  { const b=document.getElementById('diaBookMicBtn'); if(b) b.onclick=diaBookRecord; }

  // безпека: не пишемо тихо у фоні, якщо застосунок згорнули
  document.addEventListener('visibilitychange',function(){
    if(document.hidden&&diaRec){ try{ diaRec.stop(); }catch(_){} }
    if(document.hidden&&diaBookRec){ try{ diaBookRec.stop(); }catch(_){} }
  });
