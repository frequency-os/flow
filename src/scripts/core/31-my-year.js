  /* ════════ МІЙ РІК (dev): план на рік = цілі «Дерева цілей» + сфера + квартал ════════
     Одиниця плану — наявна ціль (goalsData.goals): додаємо їй поля sphere (id сфери
     Апгрейду) та yq (квартал 1..4). Ціль «у плані року» ⇔ має yq. Нових ключів
     сховища немає — все живе в goals_data. Прогрес і зв'язок з планером — наявні:
     goalPctP() і block.link.goalId. Екран під тим самим dev-прапорцем, що Апгрейд. */
  (function(){
    function myEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    function myGoalKey(g){ return g.id||g.name; }
    function myPlanGoals(){ return (goalsData.goals||[]).filter(g=>+g.yq>=1&&+g.yq<=4); }
    function myQNow(){ return Math.floor(new Date().getMonth()/3)+1; }
    const MY_Q_LABEL={1:'Квартал 1 · січ–бер',2:'Квартал 2 · кві–чер',3:'Квартал 3 · лип–вер',4:'Квартал 4 · жов–гру'};
    const MY_MON=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];

    let mySpheres=[]; // знімок сфер Апгрейду для чипів/кольорів

    function mySphere(id){ return mySpheres.find(s=>s.id===id)||null; }
    function myWeekDays(){
      const d=new Date(), dow=(d.getDay()+6)%7, out=[];
      for(let i=0;i<7;i++) out.push(ymdLocal(new Date(d.getTime()+(i-dow)*86400000)));
      return out;
    }
    /* блоки планера цього тижня, привʼязані до цілі */
    function myWeekBlocks(goalKey){
      let total=0, done=0;
      try{
        const byDay=plData().blocksByDay||{};
        myWeekDays().forEach(ds=>{
          (Array.isArray(byDay[ds])?byDay[ds]:[]).forEach(b=>{
            if(b&&b.link&&b.link.goalId===goalKey){ total++; if(b.done) done++; }
          });
        });
      }catch(_){}
      return {total, done};
    }

    function myGoalCard(g){
      const pct=goalPctP(g);
      const sp=mySphere(g.sphere);
      const col=sp?sp.c:'var(--accent)';
      const wk=myWeekBlocks(myGoalKey(g));
      const sub=[sp?(sp.emo+' '+sp.name):'без сфери', wk.total?(wk.done+'/'+wk.total+' блоків цього тижня'):null].filter(Boolean).join(' · ');
      return `<button class="my-card" data-mygoal="${myEsc(myGoalKey(g))}">
        <span class="my-dot" style="border-color:${myEsc(col)}"></span>
        <div class="my-card-h"><b>${myEsc((g.emoji?g.emoji+' ':'')+g.name)}</b><i style="color:${myEsc(col)}">${pct}%</i></div>
        <div class="my-bar"><i style="width:${pct}%;background:${myEsc(col)}"></i></div>
        <div class="my-sub">${myEsc(sub)}</div>
      </button>`;
    }
    function myGoalRowFuture(g){
      const sp=mySphere(g.sphere);
      return `<button class="my-card ghost" data-mygoal="${myEsc(myGoalKey(g))}">
        <div class="my-card-h"><b>${myEsc((g.emoji?g.emoji+' ':'')+g.name)}</b></div>
        <div class="my-sub">${myEsc(sp?(sp.emo+' '+sp.name):'без сфери')}</div>
      </button>`;
    }

    function renderMyYear(){
      const host=document.getElementById('myYearBody'); if(!host) return;
      const plan=myPlanGoals(), qNow=myQNow();
      const doneN=plan.filter(g=>goalPctP(g)>=100).length;
      const today=new Date();

      const chips=mySpheres.map(s=>{
        const on=plan.some(g=>g.sphere===s.id&&goalPctP(g)<100&&+g.yq===qNow);
        return `<button class="my-chip${on?' on':''}" data-mysph="${myEsc(s.id)}" style="--sc:${myEsc(s.c)}">
          <span>${myEsc(s.emo)}</span><b>РІВ ${s.level}</b></button>`;
      }).join('');

      const segs=plan.map(g=>`<i class="${goalPctP(g)>=100?'on':''}"></i>`).join('')||'<i></i>';

      let path='';
      for(let q=1;q<=4;q++){
        const list=plan.filter(g=>+g.yq===q);
        if(q<qNow){
          if(!list.length) continue; // порожній минулий квартал не показуємо
          const d=list.filter(g=>goalPctP(g)>=100).length;
          path+=`<div class="my-past"><span class="my-node done"></span>${MY_Q_LABEL[q]} · <b>${d}/${list.length} ✓</b></div>`;
          continue;
        }
        if(q===qNow){
          path+=`<div class="my-here"><span class="my-node here"></span>Ти тут · ${today.getDate()} ${MY_MON[today.getMonth()]}</div>`;
          path+=`<div class="my-qlbl now">${MY_Q_LABEL[q]} · зараз</div>`;
          path+= list.length? list.map(myGoalCard).join('') : `<div class="my-empty">У цьому кварталі порожньо — додай ціль</div>`;
        } else {
          path+=`<div class="my-qlbl">${MY_Q_LABEL[q]}</div>`;
          path+= list.length? list.map(myGoalRowFuture).join('') : `<div class="my-empty">поки порожньо</div>`;
        }
      }

      let wish='';
      try{
        const n=(Array.isArray(wishes)?wishes:[]).length;
        if(n) wish=`<button class="my-wish" data-mywish>🗺 <span>На Карті бажань — ${n} ${pluralUk(n,'бажання','бажання','бажань')}. Може, щось у план?</span><b>Глянути →</b></button>`;
      }catch(_){}

      host.innerHTML=`
        <div class="my-count"><b>${doneN}<span>/${plan.length}</span></b>
          <small>${plan.length?'цілей закрито · '+today.getDate()+' '+MY_MON[today.getMonth()]:'план порожній — почни з першої цілі'}</small></div>
        <div class="my-segs">${segs}</div>
        <div class="my-chips">${chips}</div>
        <div class="my-path">${path}</div>
        ${wish}`;

      host.querySelectorAll('[data-mysph]').forEach(el=>el.addEventListener('click',()=>mySphereSheet(el.dataset.mysph)));
      host.querySelectorAll('[data-mygoal]').forEach(el=>el.addEventListener('click',()=>myGoalSheet(el.dataset.mygoal)));
      const w=host.querySelector('[data-mywish]'); if(w) w.addEventListener('click',()=>{ if(window.goWishes) window.goWishes(); });
    }

    /* ── шторки ── */
    function mySheet(html){
      const old=document.querySelector('.mh-sheet.my-sheet'); if(old) old.remove();
      const ov=document.createElement('div'); ov.className='mh-sheet my-sheet';
      ov.innerHTML=`<div class="mh-sheet-in">${html}</div>`;
      ov.addEventListener('click',e=>{ if(e.target===ov) ov.remove(); });
      document.body.appendChild(ov);
      return ov;
    }
    function mySphereSheet(id){
      const s=mySphere(id); if(!s) return;
      const goals=(goalsData.goals||[]).filter(g=>g.sphere===id);
      const rows=goals.map(g=>{
        const pct=goalPctP(g);
        const inPlan=+g.yq>=1;
        return `<div class="my-sh-row"><b>${myEsc((g.emoji?g.emoji+' ':'')+g.name)}</b>
          <span>${inPlan?('К'+g.yq+' · '+pct+'%'):'поза планом'}</span></div>`;
      }).join('')||'<div class="my-empty">У сфері ще немає цілей</div>';
      mySheet(`<div class="mh-grip"></div>
        <div class="mh-sheet-h"><div class="mh-ico" style="background:color-mix(in srgb,${myEsc(s.c)} 18%,transparent)">${myEsc(s.emo)}</div>
          <div><h3>${myEsc(s.name)}</h3><span>рівень ${s.level} · ${s.xp}/100 досвіду</span></div></div>
        <div class="my-bar big"><i style="width:${s.xp}%;background:${myEsc(s.c)}"></i></div>
        <div class="my-sh-lbl">Цілі сфери</div>${rows}
        <div class="my-sh-note">Повний екран сфери з чатом — наступний крок розробки</div>`);
    }
    function myGoalSheet(key){
      const g=(goalsData.goals||[]).find(x=>myGoalKey(x)===key); if(!g) return;
      const ov=mySheet(`<div class="mh-grip"></div>
        <div class="mh-sheet-h"><div class="mh-ico" style="background:var(--sel)">🎯</div>
          <div><h3>${myEsc(g.name)}</h3><span>${goalPctP(g)}% · кроки живуть у «Дереві цілей»</span></div></div>
        <button class="my-sh-btn" data-a="tree">🌳 Відкрити в Дереві цілей</button>
        <button class="my-sh-btn" data-a="sphere">Сфера: ${myEsc(mySphere(g.sphere)?mySphere(g.sphere).name:'не вибрана')}</button>
        <button class="my-sh-btn" data-a="q">Квартал: ${g.yq?('К'+g.yq):'—'}</button>
        <button class="my-sh-btn warn" data-a="out">Прибрати з плану року</button>`);
      ov.querySelectorAll('.my-sh-btn').forEach(b=>b.addEventListener('click',()=>{
        const a=b.dataset.a; ov.remove();
        if(a==='tree'){ try{ goalsData.tab='goals'; }catch(_){} if(typeof goGoals==='function') goGoals(); return; }
        if(a==='sphere'){ myPickSphere(s=>{ g.sphere=s; saveGoals(); renderMyYear(); }); return; }
        if(a==='q'){ myPickQuarter(q=>{ g.yq=q; saveGoals(); renderMyYear(); }); return; }
        if(a==='out'){ delete g.yq; saveGoals(); renderMyYear(); }
      }));
    }
    function myPickSphere(cb){
      const ov=mySheet(`<div class="mh-grip"></div><div class="my-sh-lbl">Яка сфера?</div>`+
        mySpheres.map(s=>`<button class="my-sh-btn" data-s="${myEsc(s.id)}">${myEsc(s.emo)} ${myEsc(s.name)}</button>`).join(''));
      ov.querySelectorAll('[data-s]').forEach(b=>b.addEventListener('click',()=>{ ov.remove(); cb(b.dataset.s); }));
    }
    function myPickQuarter(cb){
      const ov=mySheet(`<div class="mh-grip"></div><div class="my-sh-lbl">Який квартал?</div>`+
        [1,2,3,4].map(q=>`<button class="my-sh-btn" data-q="${q}">${MY_Q_LABEL[q]}</button>`).join(''));
      ov.querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>{ ov.remove(); cb(+b.dataset.q); }));
    }
    /* «＋ Ціль»: наявна ціль поза планом або нова */
    function myAddSheet(){
      const free=(goalsData.goals||[]).filter(g=>!(+g.yq>=1));
      const rows=free.map(g=>`<button class="my-sh-btn" data-g="${myEsc(myGoalKey(g))}">${myEsc((g.emoji?g.emoji+' ':'')+g.name)}</button>`).join('');
      const ov=mySheet(`<div class="mh-grip"></div><div class="my-sh-lbl">Що додати в план року?</div>
        ${rows||'<div class="my-empty">Всі наявні цілі вже в плані</div>'}
        <button class="my-sh-btn new" data-new>＋ Нова ціль</button>`);
      const pick=(g)=>{ ov.remove(); myPickSphere(s=>myPickQuarter(q=>{ g.sphere=s; g.yq=q; saveGoals(); renderMyYear(); })); };
      ov.querySelectorAll('[data-g]').forEach(b=>b.addEventListener('click',()=>{
        const g=free.find(x=>myGoalKey(x)===b.dataset.g); if(g) pick(g);
      }));
      const nb=ov.querySelector('[data-new]');
      if(nb) nb.addEventListener('click',()=>{
        ov.remove();
        if(typeof inputModal!=='function') return;
        inputModal({title:'Нова ціль року', placeholder:'Напр. Пробігти 10 км', onOk:v=>{
          v=(v||'').trim(); if(!v) return;
          const g={id:'g_'+Date.now(), name:v, emoji:'🎯', steps:[]};
          goalsData.goals=goalsData.goals||[]; goalsData.goals.push(g);
          pick(g);
        }});
      });
    }

    function goMyYear(){
      (async()=>{
        try{
          const prof=window.upProfile?await window.upProfile():null;
          mySpheres=(prof&&prof.spheres)?prof.spheres:[];
          renderMyYear();
          const sh=window.__show||window.show||(typeof show==='function'?show:null);
          if(sh) sh('scr-myyear');
        }catch(e){ console.error('goMyYear',e); }
      })();
    }
    window.goMyYear=goMyYear; window.renderMyYear=renderMyYear;

    { const b=document.getElementById('myBack'); if(b) b.onclick=()=>{ if(window.goUpgrade) window.goUpgrade(); }; }
    { const b=document.getElementById('myAdd'); if(b) b.onclick=()=>myAddSheet(); }
  })();
