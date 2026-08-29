  /* ============ GOALS (План на рік) ============ */
  let goalsData={ year:new Date().getFullYear(), mission:'', pointA:'', pointB:'', pathMode:'flow', tab:'goals', goals:[],
    planner:{ scope:'week', tasks:[], blocks:[] } };
  const GKEY='goals_data';
  function saveGoals(){ try{ const p=window.storage.set(GKEY,JSON.stringify(goalsData),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }

  /* ═══════════ AI-СТАРТ: Точка А/Б → готова система (цілі+кроки+розклад+конверти) ═══════════
     Ключ API живе НЕ тут, а на проксі (Cloudflare Worker) — сюди вписується лише URL проксі. */
  const AI_EP_KEY='ai_endpoint';
  const AI_EP_DEFAULT='https://flowai.life-yaroslav-kril.workers.dev';
  function aiEndpoint(){ try{ return (localStorage.getItem(AI_EP_KEY)||'').trim() || AI_EP_DEFAULT; }catch(_){ return AI_EP_DEFAULT; } }
  function aiConfig(cb){
    inputModal({title:'AI endpoint (URL твого Worker-проксі)', value:aiEndpoint(),
      placeholder:AI_EP_DEFAULT, onOk:(v)=>{
        prefSet(AI_EP_KEY,(v||'').trim()); if(cb) cb();
      }});
  }
  function aiSheetClose(){ const ov=document.getElementById('aiOv'); if(ov) ov.remove(); }
  function aiStartSheet(){
    const g=goalsData;
    aiSheetClose();
    const ov=document.createElement('div'); ov.className='ai-ov'; ov.id='aiOv';
    const A=(g.pointA||'').trim(), B=(g.pointB||'').trim();
    if(!A||!B){
      ov.innerHTML=`<div class="ai-sheet"><h3>✨ AI-старт</h3>
        <div class="sub">Спершу чесно заповни Точку А (де ти) і Точку Б (куди хочеш) — з них збереться вся система.</div>
        <div class="ai-actions"><button class="sec" data-aiclose>Зрозуміло, заповню</button></div></div>`;
    } else {
      ov.innerHTML=`<div class="ai-sheet"><h3>✨ Зібрати систему</h3>
        <div class="sub">З твоїх Точок А і Б згенерується чернетка: цілі з кроками, розклад у Планері, конверти в Грошах. Ти переглянеш і вибереш, що застосувати.</div>
        <div class="ai-ab"><b style="color:var(--owe,#e86e6e)">Точка А</b><p>${esc(A)}</p></div>
        <div class="ai-ab"><b style="color:var(--hab)">Точка Б</b><p>${esc(B)}</p></div>
        <div id="aiBody"></div>
        <div class="ai-actions" id="aiActs">
          <button class="pri" data-aigen>✨ Згенерувати з AI</button>
          <button class="sec" data-ailocal>📝 Базова чернетка без AI</button>
          <button class="ghost" data-aicfg>⚙️ Проксі підключено · змінити</button>
          <button class="ghost" data-aiclose>Закрити</button>
        </div></div>`;
    }
    ov.addEventListener('click',e=>{ if(e.target===ov) ov.remove(); });
    document.body.appendChild(ov);
    ov.querySelectorAll('[data-aiclose]').forEach(b=>b.onclick=()=>ov.remove());
    const cfg=ov.querySelector('[data-aicfg]'); if(cfg) cfg.onclick=()=>aiConfig(()=>{ aiStartSheet(); });
    const loc=ov.querySelector('[data-ailocal]'); if(loc) loc.onclick=()=>aiPreview(aiLocalDraft(),'чернетка без AI');
    const gen=ov.querySelector('[data-aigen]'); if(gen) gen.onclick=()=>{
      aiGenerate();
    };
  }
  async function aiGenerate(){
    const body=document.getElementById('aiBody'), acts=document.getElementById('aiActs');
    if(!body) return;
    if(acts) acts.style.display='none';
    body.innerHTML=`<div class="ai-load"><div class="orb"></div>Збираю систему з твоїх Точок…</div>`;
    try{
      const g=goalsData;
      const sys='Ти — тренер застосунку Frequency. З опису Точки А (стан зараз) і Точки Б (бажаний стан) людини склади стартову систему. '
        +'Відповідай ВИКЛЮЧНО валідним JSON без markdown, без пояснень, українською. Схема: '
        +'{"goals":[{"emoji":"🎯","name":"назва цілі","steps":["крок 1","крок 2","крок 3"],"schedule":{"dows":[1,3,6],"h":19,"endH":20,"title":"назва блоку"}}],'
        +'"envelopes":[{"name":"назва конверта","emoji":"🛟","goal":1500}]}. '
        +'Правила: 3-5 цілей, у кожної 3-5 конкретних кроків (перший — виконуваний сьогодні). schedule додавай лише де доречний регулярний блок; dows: 0=неділя…6=субота; h/endH — години 0-24. '
        +'1-2 конверти. Реалістично, без води, кроки — дії, не побажання.';
      const usr='Точка А: '+(g.pointA||'')+'\nТочка Б: '+(g.pointB||'')+'\nВже є цілей: '+(g.goals||[]).length;
      const res=await fetch(aiEndpoint(),{ method:'POST', headers:{'content-type':'application/json'},
        body:JSON.stringify({ system:sys, messages:[{role:'user',content:usr}] }) });
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data=await res.json();
      let txt='';
      if(Array.isArray(data.content)) txt=data.content.filter(x=>x&&x.type==='text').map(x=>x.text).join('\n');
      else if(typeof data.text==='string') txt=data.text;
      txt=(txt||'').replace(/```json|```/g,'').trim();
      const draft=JSON.parse(txt);
      if(!draft||!Array.isArray(draft.goals)||!draft.goals.length) throw new Error('порожня відповідь');
      aiPreview(draft,'AI-чернетка');
    }catch(e){
      console.error('aiGenerate',e);
      body.innerHTML=`<div class="ai-load">⚠️ Не вдалось: ${esc(String(e.message||e))}.<br>Перевір URL проксі або спробуй базову чернетку.</div>`;
      if(acts) acts.style.display='';
    }
  }
  // фолбек без AI: розумні дефолти з ключових слів Точок
  function aiLocalDraft(){
    const g=goalsData;
    const t=((g.pointA||'')+' '+(g.pointB||'')).toLowerCase();
    const goals=[];
    if(/англ|english|b1|b2/.test(t)) goals.push({emoji:'🇬🇧',name:'Англійська — стабільний ритм',
      steps:['Обрати курс або підручник','20 хв у перерві — 4 тижні поспіль','Пробний тест рівня'],
      schedule:{dows:[1,3,6],h:19,endH:20,title:'Англійська'}});
    if(/борг|кредит|debt|фінанс|конверт/.test(t)) goals.push({emoji:'💶',name:'Вийти з боргів',
      steps:['Зібрати всі борги в одному місці (Гроші → Борги)','Зафіксувати платіж/міс — тапни картку «Вільний від боргу»','Закрити найдорожчий борг першим']});
    if(/спорт|зал|біг|трену|тіло/.test(t)) goals.push({emoji:'💪',name:'Тіло та енергія',
      steps:['Обрати 2 фіксовані дні тренувань','4 тижні без пропусків (мікроверсія 15 хв рятує)','Сон 7+ годин'],
      schedule:{dows:[1,4],h:18,endH:19,title:'Спорт'}});
    if(/блог|контент|відео|youtube|reels|build|марафон/.test(t)) goals.push({emoji:'📹',name:'Контент build-in-public',
      steps:['Зафіксувати формат і платформу','Перші 10 постів без оцінки якості','Ритм 3 пости/тиждень'],
      schedule:{dows:[2,4,0],h:20,endH:21,title:'Пост у блог'}});
    if(/сон|сплю|спати|00:00|недосип/.test(t)) goals.push({emoji:'😴',name:'Сон 7+ годин',
      steps:['Лягати до 00:00','Вечірній блок «підготовка до сну» 23:15','14 днів поспіль'],
      schedule:{dows:[0,1,2,3,4,5,6],h:23,endH:23.5,title:'Підготовка до сну'}});
    if(/ai|аі|ші|модел|нейро/.test(t)) goals.push({emoji:'🤖',name:'Освоїти AI-інструменти',
      steps:['Обрати 1 інструмент на місяць','2 практики/тиждень по 45 хв','Перший реальний результат — у блог']});
    if(!goals.length) goals.push({emoji:'🎯',name:'Перша ціль на 90 днів',
      steps:['Сформулювати конкретний результат','Розбити на 3 кроки','Перший крок → 📅 у Планер сьогодні']});
    return { goals:goals.slice(0,5), envelopes:[{name:'Подушка безпеки',emoji:'🛟',goal:1500}] };
  }
  const DOW_SHORT=['нд','пн','вт','ср','чт','пт','сб'];
  function aiPreview(draft,label){
    const body=document.getElementById('aiBody'), acts=document.getElementById('aiActs');
    if(!body) return;
    if(acts) acts.style.display='none';
    window.__aiDraft=draft;
    const items=[];
    (draft.goals||[]).forEach((gd,i)=>{
      const sc=gd.schedule;
      const schTxt=(sc&&Array.isArray(sc.dows)&&sc.dows.length)?
        ' · 🗓 '+sc.dows.map(d=>DOW_SHORT[d]||'').filter(Boolean).join('·')+' о '+String(Math.floor(sc.h)).padStart(2,'0')+':00':'';
      items.push(`<div class="ai-item on" data-aitem="g${i}"><div class="ck">✓</div>
        <div class="tx"><b>${gd.emoji||'🎯'} ${esc(gd.name||'Ціль')}</b>
        <span>${(gd.steps||[]).length} кроків${schTxt}</span></div></div>`);
    });
    (draft.envelopes||[]).forEach((ed,i)=>{
      items.push(`<div class="ai-item on" data-aitem="e${i}"><div class="ck">✓</div>
        <div class="tx"><b>${ed.emoji||'✉️'} ${esc(ed.name||'Конверт')}</b>
        <span>конверт у Грошах${ed.goal?' · ціль '+fmt(parseInt(ed.goal)||0):''}</span></div></div>`);
    });
    body.innerHTML=`<div class="sub" style="margin:4px 0 10px">${esc(label||'Чернетка')} — тапни, щоб виключити зайве:</div>
      ${items.join('')}
      <div class="ai-actions">
        <button class="pri" data-aiapply>Застосувати вибране</button>
        <button class="ghost" data-aiback>‹ Назад</button>
      </div>`;
    body.querySelectorAll('[data-aitem]').forEach(el=>el.onclick=()=>{
      el.classList.toggle('on'); el.classList.toggle('off');
      const k=el.dataset.aitem, off=el.classList.contains('off');
      const idx=parseInt(k.slice(1),10);
      if(k[0]==='g'&&draft.goals[idx]) draft.goals[idx]._skip=off;
      if(k[0]==='e'&&draft.envelopes[idx]) draft.envelopes[idx]._skip=off;
    });
    const back=body.querySelector('[data-aiback]'); if(back) back.onclick=()=>aiStartSheet();
    const ap=body.querySelector('[data-aiapply]'); if(ap) ap.onclick=()=>{ aiApplyDraft(draft); };
  }
  function aiApplyDraft(draft){
    const colors=['#5b8def','#34c77b','#e8843c','#c77dff','#f0b429','#4ecdc4'];
    const p=plData(); const today=plTodayStr();
    let nG=0,nS=0,nE=0;
    (draft.goals||[]).forEach(gd=>{
      if(gd._skip) return;
      const gid='g_ai_'+Date.now()+'_'+Math.random().toString(36).slice(2,5);
      goalsData.goals.push({ id:gid, name:String(gd.name||'Ціль').slice(0,80), emoji:gd.emoji||'🎯',
        color:colors[goalsData.goals.length%colors.length],
        steps:(gd.steps||[]).slice(0,7).map(s=>({ id:'st_ai_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),
          name:String(s).slice(0,120), done:false })),
        track:{}, days:{}, folderKey:null, open:true });
      nG++;
      const sc=gd.schedule;
      if(sc && Array.isArray(sc.dows) && sc.dows.length && typeof sc.h==='number'){
        const h=Math.min(23,Math.max(0,sc.h));
        p.recurring.push({ id:'rt_ai_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),
          h:h, endH:Math.min(24,Math.max(h+0.5,(typeof sc.endH==='number'?sc.endH:h+1))),
          t:String(sc.title||gd.name||'Блок').slice(0,60), c:'', tag:'', folder:'',
          link:{type:'habit', goalId:gid, goalName:String(gd.name||'')},
          repeat:{type:'custom', dows:sc.dows.map(Number).filter(d=>d>=0&&d<=6)},
          startDate:today, active:true });
        nS++;
      }
    });
    (draft.envelopes||[]).forEach(ed=>{
      if(ed._skip) return;
      envelopes.push({ id:'env_ai_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),
        name:String(ed.name||'Конверт').slice(0,60), emoji:ed.emoji||'✉️',
        color:colors[envelopes.length%colors.length], goal:parseInt(ed.goal)||0,
        saved:0, ops:[], kind:'ціль', link:'main', linkLabel:'головна папка' });
      nE++;
    });
    saveGoals(); try{ saveEnvelopes(); }catch(_){}
    aiSheetClose();
    try{ renderGoals(); }catch(_){}
    try{ window.platform.haptic('medium'); }catch(_){}
    try{ plToast('✨ Створено: '+nG+' цілей · '+nS+' розкладів · '+nE+' конвертів'); }catch(_){}
  }

  function renderGoals(){
    const body=document.getElementById('goalsBody');
    if(!body) return;
    const g=goalsData;
    if(window.uiMode==='lite' && g.tab!=='goals') g.tab='goals';
    const doneCount=g.goals.filter(x=>x.done).length;
    const avg = g.goals.length ? Math.round(g.goals.reduce((s,x)=>s+(x.progress||0),0)/g.goals.length) : 0;
    document.getElementById('goalsSub').textContent = `${g.goals.length} цілей · ${doneCount} виконано · ${avg}% прогрес`;

    const missionTxt = g.mission && g.mission.trim() ? esc(g.mission) : 'Тисни, щоб додати — навіщо ти живеш і що твориш…';
    const missionCls = g.mission && g.mission.trim() ? 'gmission-filled' : 'gmission-empty';

    const paFilled = g.pointA && g.pointA.trim();
    const pbFilled = g.pointB && g.pointB.trim();
    const paTxt = paFilled ? esc(g.pointA) : 'хаос, відкладання…';
    const pbTxt = pbFilled ? esc(g.pointB) : 'дисципліна, реліз…';

    const tabs=[['goals','🎯 Цілі'],['path','🧭 Шлях'],['overview','📊 Огляд'],['q1','Q1'],['q2','Q2'],['q3','Q3'],['q4','Q4']];
    const tabsHtml=tabs.map(([k,l])=>`<button class="gtab ${g.tab===k?'on':''}" data-gtab="${k}">${l}</button>`).join('');

    body.innerHTML=`
      <div class="pl-toplvl"><button data-glvl>📅 Плани</button><button class="on">🎯 Горизонт</button></div>
      <div class="gyear">
        <button class="gyear-nav" data-yr="-1">‹</button>
        <div class="gyear-val">${g.year}</div>
        <button class="gyear-nav" data-yr="1">›</button>
      </div>
      <div class="gmission ${missionCls}" id="gMission">
        <span class="gm-ico">🌟</span><span class="gm-tx">${missionTxt}</span><span class="gm-edit">✎</span>
      </div>
      <div class="gaxis" id="gAxis">
        <div class="gaxis-row">
          <div class="gaxis-node gx-a" data-axis="a">
            <div class="gx-lbl">Точка А</div>
            <div class="gx-tx ${paFilled?'':'gx-empty'}">${paTxt}</div>
          </div>
          <div class="gaxis-arr">→</div>
          <div class="gaxis-node gx-b" data-axis="b">
            <div class="gx-lbl">Точка Б</div>
            <div class="gx-tx ${pbFilled?'':'gx-empty'}">${pbTxt}</div>
          </div>
        </div>
        <div class="gaxis-bar"></div>
      </div>
      <button class="ai-startbtn" id="gAiStart">✨ Зібрати систему з Точки А → Б</button>
      <div class="gtabs">${tabsHtml}</div>
      <div id="gTabBody"></div>`;

    body.querySelectorAll('[data-gtab]').forEach(b=>b.onclick=()=>{ g.tab=b.dataset.gtab; saveGoals(); renderGoals(); });
    { const pb=body.querySelector('[data-glvl]'); if(pb) pb.onclick=()=>{ try{ goPlanner(); }catch(e){ console.error('goPlans',e); } }; }
    body.querySelectorAll('[data-yr]').forEach(b=>b.onclick=()=>{ g.year+=parseInt(b.dataset.yr); saveGoals(); renderGoals(); });
    const mis=document.getElementById('gMission');
    if(mis) mis.onclick=()=>{ inputModal({title:'Місія / візія року', value:g.mission||'', placeholder:'Навіщо ти живеш і що твориш…', onOk:(v)=>{ g.mission=v; saveGoals(); renderGoals(); }}); };
    { const aib=document.getElementById('gAiStart'); if(aib) aib.onclick=()=>{ try{ aiStartSheet(); }catch(e){ console.error('aiStart',e); } }; }
    const ax=document.getElementById('gAxis');
    if(ax) ax.querySelectorAll('[data-axis]').forEach(n=>n.onclick=()=>{
      const which=n.dataset.axis;
      if(which==='a') inputModal({title:'Точка А — де я зараз', value:g.pointA||'', placeholder:'Чесно: звички, фінанси, стан…', onOk:(v)=>{ g.pointA=v; saveGoals(); renderGoals(); }});
      else inputModal({title:'Точка Б — куди йду', value:g.pointB||'', placeholder:'Дисципліна, фінанси під контролем, реліз…', onOk:(v)=>{ g.pointB=v; saveGoals(); renderGoals(); }});
    });

    renderGoalsTab();
  }

  /* ===== ЦІЛІ ДНЯ (денний чекліст усередині цілі, варіант 3) ===== */
  function dgDateStr(offset){ const d=new Date(); d.setDate(d.getDate()+(offset||0)); return d.toISOString().slice(0,10); }
  function dgWeekDates(){ const out=[]; const now=new Date(); const dow=(now.getDay()+6)%7; // Mon=0
    const mon=new Date(now); mon.setDate(now.getDate()-dow);
    for(let i=0;i<7;i++){ const d=new Date(mon); d.setDate(mon.getDate()+i); out.push(d.toISOString().slice(0,10)); } return out; }
  function dgListFor(gl,ds){ if(!gl.days) gl.days={}; if(!Array.isArray(gl.days[ds])) gl.days[ds]=[]; return gl.days[ds]; }
  // синхронізація: коли ВСІ денні цілі дня виконані → засвітити трекер today + 1 авто-крок (раз)
  function dgSync(gl,ds,todayStr){
    if(ds!==todayStr) return;            // авто-перенос лише за фактичний сьогоднішній день
    const list=dgListFor(gl,ds);
    if(!gl.track) gl.track={};
    const allDone = list.length>0 && list.every(it=>it.done);
    if(allDone){
      gl.track[ds]=true;
      if(!gl._autoStep){                  // авто-крок додаємо лише один раз на закриття дня
        if(!gl.steps) gl.steps=[];
        gl.steps.push({ id:'st_auto_'+Date.now(), name:'✅ День закрито · '+ds, done:true, auto:true });
        gl._autoStep=ds;
      }
    } else {
      // якщо день розкрили назад (додали нову ціль) — гасимо клітинку й прибираємо авто-крок цього дня
      if(gl._autoStep===ds){
        gl.steps=(gl.steps||[]).filter(s=>!(s.auto && s.name.includes(ds)));
        gl._autoStep=null;
        delete gl.track[ds];
      }
    }
  }
  function dayGoalsBlock(gl,todayStr){
    const view=gl._dayView||'today';
    const ds = view==='tom' ? dgDateStr(1) : todayStr;
    const segs=[['today','Сьогодні'],['tom','Завтра'],['week','Тиждень']];
    const segHtml=segs.map(([k,l])=>`<button class="${view===k?'on':''}" data-dgview="${gl.id}|${k}">${l}</button>`).join('');

    if(view==='week'){
      const week=dgWeekDates(); const dowS=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
      let total=0, done=0;
      const rows=week.map((wd,i)=>{
        const list=dgListFor(gl,wd); total+=list.length; done+=list.filter(x=>x.done).length;
        const cnt=list.length; const dn=list.filter(x=>x.done).length;
        const isToday=wd===todayStr;
        return `<div class="dg-item">
          <span class="dg-tx" style="${isToday?'font-weight:800':''}">${dowS[i]} · ${wd.slice(8)}.${wd.slice(5,7)}</span>
          <span class="dg-push ${cnt&&dn===cnt?'on':''}">${dn}/${cnt}</span></div>`;
      }).join('');
      const pct=total?Math.round(done/total*100):0;
      return `<div class="dgoals">
        <div class="dgoals-h"><span>🎯</span><span class="dh-t">Цілі дня</span><span class="dh-c">${done}/${total} за тиждень</span></div>
        <div class="dg-seg">${segHtml}</div>
        <div class="dg-prog"><i style="width:${pct}%"></i></div>
        ${rows||'<div class="dg-empty">Порожньо</div>'}
        <div class="dg-note">Тиждень — лише огляд. Додавай цілі у «Сьогодні» / «Завтра».</div>
      </div>`;
    }

    const list=dgListFor(gl,ds);
    const done=list.filter(x=>x.done).length;
    const pct=list.length?Math.round(done/list.length*100):0;
    const itemsHtml = list.length ? list.map(it=>`
      <div class="dg-item ${it.done?'done':''}" data-dgitem="${gl.id}|${ds}|${it.id}">
        <span class="dg-ck">✓</span>
        <span class="dg-tx">${esc(it.text)}</span>
        ${ds===todayStr?`<button class="dg-push ${it.done?'on':''}" data-dgpush="${gl.id}|${ds}|${it.id}" title="Занести в трекер вручну">↑</button>`:''}
        <span class="dg-del" data-dgdel="${gl.id}|${ds}|${it.id}">×</span>
      </div>`).join('') : `<div class="dg-empty">Цілей на ${view==='tom'?'завтра':'сьогодні'} ще нема</div>`;

    return `<div class="dgoals">
      <div class="dgoals-h"><span>🎯</span><span class="dh-t">Цілі дня</span><span class="dh-c">${done}/${list.length}</span></div>
      <div class="dg-seg">${segHtml}</div>
      <div class="dg-prog"><i style="width:${pct}%"></i></div>
      ${itemsHtml}
      <div class="dg-add">
        <input type="text" placeholder="Додати ціль на ${view==='tom'?'завтра':'сьогодні'}…" data-dgadd="${gl.id}|${ds}">
        <button data-dgaddbtn="${gl.id}|${ds}">+</button>
      </div>
      ${ds===todayStr?'<div class="dg-note">Закриєш усі — трекер засвітить сьогодні + додасть крок. «↑» — вручну.</div>':''}
    </div>`;
  }

  // ── вибір папки для цілі: список існуючих + нова + без папки ──
  function pickFolderForGoal(onPick){
    const existing=document.getElementById('goalFolderSheet'); if(existing) existing.remove();
    const sheet=document.createElement('div');
    sheet.className='fmenu-sheet'; sheet.id='goalFolderSheet';
    const keys=(typeof order!=='undefined'?order:Object.keys(folders)).filter(k=>folders[k] && folderVisible(k));
    const rows=keys.map(k=>{
      const f=folders[k];
      return `<button class="gfp-row" data-gfk="${k}">
        <span class="gfp-em">${f.emoji||'📁'}</span>
        <span class="gfp-nm">${esc(f.name||'Папка')}</span>
        <span class="gfp-chev">›</span></button>`;
    }).join('');
    sheet.innerHTML=`<div class="fmenu-in">
      <div class="fmenu-grip"></div>
      <div class="fmenu-title">Куди привʼязати ціль?</div>
      <button class="gfp-row gfp-new" data-gfnew="1"><span class="gfp-em">➕</span><span class="gfp-nm">Нова папка</span></button>
      ${rows?`<div class="gfp-sec">Існуючі папки</div>${rows}`:''}
      <button class="gfp-row gfp-none" data-gfnone="1"><span class="gfp-em">○</span><span class="gfp-nm">Без папки</span></button>
    </div>`;
    document.body.appendChild(sheet);
    const close=()=>sheet.remove();
    sheet.onclick=(e)=>{ if(e.target===sheet) close(); };
    sheet.querySelectorAll('[data-gfk]').forEach(b=>b.onclick=()=>{ close(); onPick(b.dataset.gfk); });
    sheet.querySelector('[data-gfnone]').onclick=()=>{ close(); onPick(null); };
    sheet.querySelector('[data-gfnew]').onclick=()=>{
      close();
      inputModal({ title:'Нова папка', placeholder:'Назва папки', emoji:true, emojiVal:'📁',
        onOk:(nm,emojiVal)=>{
          const used=order.length;
          const key='f_'+Date.now();
          folders[key]={ key, c:FOLDER_COLORS[used%FOLDER_COLORS.length],
            emoji:(emojiVal!==undefined?emojiVal:'📁'),
            name:(nm||('Папка '+(used+1))), pct:0, photo:'', flayout:'a', pinned:false, custom:true, widgets:[] };
          order.push(key); saveFolders();
          onPick(key);
        }});
    };
  }

  function renderGoalsTab(){
    const c=document.getElementById('gTabBody'); if(!c) return;
    const g=goalsData;
    if(g.tab==='planner'){ g.tab='goals'; }
    if(g.tab==='path'){ renderPath(c); return; }
    const rootHtml=`<div class="groot"><div class="groot-info">
      <div class="groot-h">🌱 Корінь екосистеми</div>
      <div class="groot-d">Цілі — основа. Кожна ціль породжує кроки та зʼєднує папки в єдину систему.</div></div>
      <div class="groot-flow">
        <div class="grf"><div class="grf-n">${g.goals.length}</div><div class="grf-l">🎯 Цілі</div></div>
        <span class="grf-arr">→</span>
        <div class="grf"><div class="grf-n">${g.goals.reduce((s,x)=>s+((x.steps||[]).length),0)}</div><div class="grf-l">📋 Кроки</div></div>
        <span class="grf-arr">→</span>
        <div class="grf"><div class="grf-n">${Object.keys(folders).length}</div><div class="grf-l">📁 Папки</div></div>
      </div></div>`;

    const monthShort=['Січ','Лют','Бер','Кві','Тра','Чер','Лип','Сер','Вер','Жов','Лис','Гру'];
    const dowShort=['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
    const now=new Date(); const todayStr=ymdLocal(now);
    const my=now.getFullYear(), mm=now.getMonth();
    const daysInMonth=new Date(my,mm+1,0).getDate();
    const mo=[];
    for(let d=1;d<=daysInMonth;d++){
      const dt=new Date(my,mm,d);
      mo.push({ day:d, dow:dowShort[dt.getDay()], ds:dt.toISOString().slice(0,10) });
    }

    const goalsHtml=g.goals.map(gl=>{
      const steps=gl.steps||[];
      const doneSteps=steps.filter(s=>s.done).length;
      const pct=steps.length?Math.round(doneSteps/steps.length*100):(gl.progress||0);
      const open=!!gl.open;
      const stepsHtml=steps.map(s=>`
        <div class="b-item ${s.done?'done':''}" data-step="${gl.id}|${s.id}">
          <span class="b-check">${s.done?'✓':'○'}</span><span class="b-tx">${esc(s.name)}</span>
          ${s.done?'':`<span class="b-plan" data-planstep="${gl.id}|${s.id}" title="У Планер сьогодні">📅</span>`}
          <span class="b-del" data-delstep="${gl.id}|${s.id}">×</span>
        </div>`).join('') || `<div class="b-empty">Кроків ще нема</div>`;
      const totalDays=mo.length;
      const trackedCount=gl.track?Object.keys(gl.track).filter(k=>k.startsWith(`${my}-${String(mm+1).padStart(2,'0')}`)).length:0;
      const gridHead=`<div class="gtrack-head">${mo.map(d=>`<span class="${d.ds===todayStr?'td-on':''}">${d.dow}<br>${d.day}</span>`).join('')}</div>`;
      const gridRow=`<div class="gtrack-row">${mo.map(d=>{
          const on=gl.track&&gl.track[d.ds];
          const todayCls=d.ds===todayStr?'today':'';
          return `<button class="gtd ${on?'on':''} ${todayCls}" data-track="${gl.id}|${d.ds}" style="--c:${gl.color||'#5b8def'}">${on?'✓':''}</button>`;
        }).join('')}</div>`;
      const dayGoalsHtml = dayGoalsBlock(gl, todayStr);
      const wishCover = gl.wishImg ? `<div class="gnode-cover" data-gwish="${gl.id}" style="background-image:url('${safeImg(gl.wishImg)}')"><div class="gnode-cover-ov"></div><span class="gnode-cover-tag">✨ з Карти бажань</span></div>` : '';
      return `<div class="gnode ${gl.wishImg?'has-cover':''}" data-goal="${gl.id}">
        ${wishCover}
        <div class="grow">
          <div class="grow-left">
            <span class="grow-car" data-toggle="${gl.id}">${open?'▾':'▸'}</span>
            <span class="grow-emoji">${gl.emoji||'🎯'}</span>
            <div class="grow-info" data-toggle="${gl.id}">
              <div class="grow-name${gl.folderKey&&folders[gl.folderKey]?' has-folder':''}"${gl.folderKey&&folders[gl.folderKey]?` data-goalfolder="${gl.folderKey}"`:''}>${esc(gl.name)}${gl.folderKey&&folders[gl.folderKey]?`<span class="gfolder-tag">${folders[gl.folderKey].emoji||'📁'}</span>`:''}</div>
              <div class="grow-meta">${trackedCount}/${totalDays} · ${pct}%</div>
            </div>
            <span class="grow-del" data-delgoal="${gl.id}">×</span>
          </div>
          <div class="gtrack" data-scrollme="1">
            ${gridHead}
            ${gridRow}
          </div>
        </div>
        <div class="branch ${open?'open':''}">
          ${dayGoalsHtml}
          ${stepsHtml}
          <button class="b-add" data-addstep="${gl.id}">+ Крок</button>
        </div>
      </div>`;
    }).join('');

    // ── Стрічка «Карта бажань»: цілі з фото-обкладинкою ──
    const wishGoals=(g.goals||[]).filter(x=>x.wishImg);
    let wishStripHtml='';
    if(wishGoals.length){
      const cards=wishGoals.map(gl=>{
        const steps=gl.steps||[]; const sd=steps.filter(s=>s.done).length;
        const pct=steps.length?Math.round(sd/steps.length*100):(gl.progress||0);
        return `<div class="wgs-card" data-wgoal="${gl.id}" style="background-image:url('${safeImg(gl.wishImg)}')">
          <div class="wgs-ov"></div>
          ${pct>=100?'<div class="wgs-done">✓</div>':''}
          <div class="wgs-foot">
            <div class="wgs-cap">${esc(gl.name)}</div>
            <div class="wgs-bar"><i style="width:${pct}%"></i></div>
          </div>
        </div>`;
      }).join('');
      wishStripHtml=`<div class="wgs-wrap">
        <div class="wgs-head"><span>✨ Карта бажань</span><span class="wgs-cnt">${wishGoals.length} цілей-мрій</span></div>
        <div class="wgs-row">${cards}<button class="wgs-add" data-wgadd="1"><span>＋</span><small>З карти</small></button></div>
      </div>`;
    } else {
      wishStripHtml=`<div class="wgs-wrap">
        <div class="wgs-head"><span>✨ Карта бажань</span></div>
        <button class="wgs-empty" data-wgadd="1">Перетвори мрію на ціль → обери фото з Карти бажань</button>
      </div>`;
    }

    c.innerHTML = rootHtml + wishStripHtml + `<div class="gnodes">${goalsHtml}</div>
      <button class="newbtn" id="gNewGoal">+ Нова ціль</button>`;

    // стрічка бажань: тап по картці → відкрити карту (там видно фото+прогрес), кнопка → теж карта
    c.querySelectorAll('[data-wgoal]').forEach(el=>el.onclick=()=>{ try{ goWishes(); }catch(_){} });
    const wgadd=c.querySelector('[data-wgadd]');
    if(wgadd) wgadd.onclick=()=>{ try{ goWishes(); }catch(_){} };
    c.querySelectorAll('[data-gwish]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); try{ goWishes(); }catch(_){} });

    // toggle open/close
    c.querySelectorAll('[data-toggle]').forEach(el=>el.onclick=()=>{
      const gl=g.goals.find(x=>x.id===el.dataset.toggle); if(!gl) return;
      gl.open=!gl.open; saveGoals(); renderGoalsTab();
    });
    // ── тап по назві цілі з папкою → відкрити папку + денний трекер ──
    c.querySelectorAll('[data-goalfolder]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const fk=el.dataset.goalfolder;
      if(folders[fk]){ window.__openDayTrackerInFolder=fk; goFolder(fk); }
    });
    // step check toggle
    c.querySelectorAll('[data-step]').forEach(el=>el.onclick=(e)=>{
      if(e.target.closest('[data-delstep]')) return;
      const [gid,sid]=el.dataset.step.split('|');
      const gl=g.goals.find(x=>x.id===gid); if(!gl) return;
      const st=(gl.steps||[]).find(s=>s.id===sid); if(!st) return;
      st.done=!st.done; saveGoals(); renderGoalsTab();
    });
    c.querySelectorAll('[data-delstep]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const [gid,sid]=el.dataset.delstep.split('|');
      const gl=g.goals.find(x=>x.id===gid); if(!gl) return;
      gl.steps=(gl.steps||[]).filter(s=>s.id!==sid); saveGoals(); renderGoalsTab();
    });
    // ЛАНЦЮГ: крок → блок у Планері
    c.querySelectorAll('[data-planstep]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const [gid,sid]=el.dataset.planstep.split('|');
      const gl=g.goals.find(x=>x.id===gid); if(!gl) return;
      const st=(gl.steps||[]).find(s=>s.id===sid); if(!st||st.done) return;
      if(typeof plScheduleStep==='function') plScheduleStep(gl,st);
    });
    c.querySelectorAll('[data-addstep]').forEach(el=>el.onclick=()=>{
      const gid=el.dataset.addstep;
      inputModal({title:'Новий крок', placeholder:'Назва кроку', onOk:(v)=>{
        if(!v) return;
        const gl=g.goals.find(x=>x.id===gid); if(!gl) return;
        if(!gl.steps) gl.steps=[];
        gl.steps.push({id:'st_'+Date.now(), name:v, done:false});
        gl.open=true; saveGoals(); renderGoalsTab();
      }});
    });
    // weekly track toggle
    c.querySelectorAll('[data-track]').forEach(el=>el.onclick=()=>{
      const [gid,ds]=el.dataset.track.split('|');
      const gl=g.goals.find(x=>x.id===gid); if(!gl) return;
      if(!gl.track) gl.track={};
      if(gl.track[ds]) delete gl.track[ds]; else gl.track[ds]=true;
      saveGoals(); renderGoalsTab();
    });
    // ── цілі дня: перемикач Сьогодні/Завтра/Тиждень ──
    c.querySelectorAll('[data-dgview]').forEach(el=>el.onclick=()=>{
      const [gid,view]=el.dataset.dgview.split('|');
      const gl=g.goals.find(x=>x.id===gid); if(!gl) return;
      gl._dayView=view; gl.open=true; saveGoals(); renderGoalsTab();
    });
    // ── цілі дня: чек/розчек ──
    c.querySelectorAll('[data-dgitem]').forEach(el=>el.onclick=(e)=>{
      if(e.target.closest('[data-dgpush]')||e.target.closest('[data-dgdel]')) return;
      const [gid,ds,iid]=el.dataset.dgitem.split('|');
      const gl=g.goals.find(x=>x.id===gid); if(!gl) return;
      const it=dgListFor(gl,ds).find(x=>x.id===iid); if(!it) return;
      it.done=!it.done; dgSync(gl,ds,todayStr); saveGoals(); renderGoalsTab();
    });
    // ── цілі дня: ручний перенос «↑» (позначає виконаною й синхронізує) ──
    c.querySelectorAll('[data-dgpush]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const [gid,ds,iid]=el.dataset.dgpush.split('|');
      const gl=g.goals.find(x=>x.id===gid); if(!gl) return;
      const it=dgListFor(gl,ds).find(x=>x.id===iid); if(!it) return;
      it.done=true; dgSync(gl,ds,todayStr); saveGoals(); renderGoalsTab();
    });
    // ── цілі дня: видалити пункт ──
    c.querySelectorAll('[data-dgdel]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const [gid,ds,iid]=el.dataset.dgdel.split('|');
      const gl=g.goals.find(x=>x.id===gid); if(!gl) return;
      gl.days[ds]=dgListFor(gl,ds).filter(x=>x.id!==iid);
      dgSync(gl,ds,todayStr); saveGoals(); renderGoalsTab();
    });
    // ── цілі дня: додати пункт ──
    function dgAdd(gid,ds,val){
      const gl=g.goals.find(x=>x.id===gid); if(!gl||!val.trim()) return;
      dgListFor(gl,ds).push({ id:'dg_'+Date.now(), text:val.trim(), done:false });
      gl.open=true; dgSync(gl,ds,todayStr); saveGoals(); renderGoalsTab();
    }
    c.querySelectorAll('[data-dgaddbtn]').forEach(el=>el.onclick=()=>{
      const [gid,ds]=el.dataset.dgaddbtn.split('|');
      const inp=c.querySelector(`[data-dgadd="${gid}|${ds}"]`);
      if(inp) dgAdd(gid,ds,inp.value);
    });
    c.querySelectorAll('[data-dgadd]').forEach(el=>el.onkeydown=(e)=>{
      if(e.key==='Enter'){ const [gid,ds]=el.dataset.dgadd.split('|'); dgAdd(gid,ds,el.value); }
    });
    c.querySelectorAll('[data-delgoal]').forEach(el=>el.onclick=()=>{
      const gid=el.dataset.delgoal;
      const gl=g.goals.find(x=>x.id===gid); if(!gl) return;
      confirmSheet({
        title:'Видалити ціль?',
        sub:'«'+gl.name+'»'+(gl.wishId?' · бажання залишиться в Карті.':''),
        okLabel:'Видалити',
        onOk:()=>{
          if(gl.wishId){ const w=wishes.find(x=>x.id===gl.wishId); if(w){ delete w.goalId; saveWishes(); } }
          g.goals=g.goals.filter(x=>x.id!==gid); saveGoals(); renderGoalsTab();
        }
      });
    });
    const nb=document.getElementById('gNewGoal');
    if(nb) nb.onclick=()=>{
      inputModal({title:'Нова ціль', placeholder:'Назва цілі', emoji:true, emojiVal:'🎯', onOk:(name,emojiVal)=>{
        if(!name) return;
        const colors=['#5b8def','#34c77b','#e8843c','#c77dff','#f0b429','#4ecdc4'];
        const idx=g.goals.length;
        pickFolderForGoal((folderKey)=>{
          g.goals.push({ id:'g_'+Date.now(), name, emoji:(emojiVal!==undefined?emojiVal:'🎯'),
            color:colors[idx%colors.length], steps:[], track:{}, days:{}, folderKey:folderKey||null, open:true });
          saveGoals(); renderGoalsTab();
        });
      }});
    };
    // auto-scroll month tracks to today
    c.querySelectorAll('[data-scrollme]').forEach(el=>{
      const todayBtn=el.querySelector('.gtd.today');
      if(todayBtn){ try{ el.scrollLeft = Math.max(0, todayBtn.offsetLeft - 60); }catch(_){} }
    });
  }

  function currentWeekDates(){
    const now=new Date();
    const dow=(now.getDay()+6)%7; // Mon=0
    const monday=new Date(now); monday.setDate(now.getDate()-dow);
    const out=[];
    for(let i=0;i<7;i++){ const d=new Date(monday); d.setDate(monday.getDate()+i); out.push(d.toISOString().slice(0,10)); }
    return out;
  }

