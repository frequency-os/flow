  /* ════════ Правила гри (47-rules.js, 09.10.2026) ════════
     Готові звʼязки «коли → тоді» між Журналом, папками, Гаманцем і призами. Кожне правило вмикається
     й має число (n). Налаштування — goalsData.hero.rules[id]={on,n} (пишуться лише з «Книги правил»).
     Лічильник — hero.ruleStats[id]={n,sum}, журнал дисципліни — hero.ruleLog=[{ds,id,ok}] (до 300).
     Гроші правила лише ПРОПОНУЮТЬ (картка «Відкласти? / Не зараз»), записують — після тапу людини.
     Автоматично діє лише «Трекер сам» (✓ у трекері папки місії) — це наслідок «Зроблено», знімається разом із ним. */

  const RL=[
    {id:'trk',    grp:'Справи й місії', em:'✅', t:'Трекер сам',          flow:['справа місії ✓','✓ у трекері папки'], on:true},
    {id:'easy',   grp:'Справи й місії', em:'🪶', t:'Легший крок',         flow:['{n} {d} без руху','15 хв сьогодні?'], on:true, n:3, unit:'днів', min:1, max:30},
    {id:'streak', grp:'Справи й місії', em:'🔥', t:'Серія',               flow:['{n} {d} поспіль','медаль +100 XP'], on:true, n:7, unit:'днів', min:2, max:60},
    {id:'jar',    grp:'Гроші',          em:'🏆', t:'Скарбничка',          flow:['дохід місії','{n}% на приз?'], on:true, n:10, unit:'%', min:1, max:100},
    {id:'salary', grp:'Гроші',          em:'💼', t:'Зарплата по конвертах',flow:['дохід ≥ {n} або «зарплата»','розподіл за шаблоном'], on:true, n:10000, unit:'cur', min:100, max:10000000},
    {id:'budget', grp:'Гроші',          em:'⚠️', t:'Бюджет місії',         flow:['витрати > бюджет','попередження'], on:true},
    {id:'quest',  grp:'Гроші',          em:'💰', t:'Квест місяця',         flow:['ціль місяця ✓','свято'], on:true},
  ];
  function rlDef(id){ return RL.find(r=>r.id===id)||null; }
  function rlCfg(id){ const d=rlDef(id)||{}, h=jnHero(), c=(h.rules&&typeof h.rules==='object'&&h.rules[id])||{};
    return {on:typeof c.on==='boolean'?c.on:!!d.on, n:(typeof c.n==='number'&&isFinite(c.n))?c.n:d.n}; }
  function rlOn(id){ return rlCfg(id).on; }
  function rlN(id){ return rlCfg(id).n; }
  function rlUnit(r,n){ return r.unit==='днів'?pluralUk(n,'день','дні','днів'):(r.unit||''); }
  function rlFlow(r){ const n=rlN(r.id); return r.flow.map(s=>s.replace('{n}', r.unit==='cur'?money(n):String(n)).replace('{d}',rlUnit(r,n))); }
  // лічильник і журнал — лише разом із дією людини (прийняла / відхилила / зробила)
  function rlMark(id,ok,sum){
    const h=jnHero();
    if(!h.ruleStats||typeof h.ruleStats!=='object'||Array.isArray(h.ruleStats)) h.ruleStats={};
    let st=h.ruleStats[id]; if(!st||typeof st!=='object'||Array.isArray(st)) st={n:0,sum:0}; if(ok){ st.n=(+st.n||0)+1; if(sum) st.sum=(+st.sum||0)+Math.round(sum); } else st.miss=(+st.miss||0)+1; h.ruleStats[id]=st;
    if(!Array.isArray(h.ruleLog)) h.ruleLog=[];
    h.ruleLog.push({ds:ymdLocal(), id, ok:!!ok}); if(h.ruleLog.length>300) h.ruleLog=h.ruleLog.slice(-300);
  }
  function rlDiscipline(){
    const h=jnHero(), log=Array.isArray(h.ruleLog)?h.ruleLog:[], from=dyAddDays(ymdLocal(),-6);
    const w=log.filter(x=>x&&typeof x.ds==='string'&&x.ds>=from); return {ok:w.filter(x=>x.ok).length, all:w.length};
  }

  // ── картка-пропозиція внизу екрана (одна за раз) ──
  function rlOffer(em,title,text,yes,no,onYes,onNo){
    const old=document.querySelector('.rl-offer'); if(old) old.remove();
    const el=document.createElement('div'); el.className='rl-offer'; el.setAttribute('role','dialog');
    el.innerHTML=`<div class="rl-offer-h"><span>${safeEmoji(em,'✨')}</span><b>Правило «${esc(title)}»</b><button data-rlx aria-label="Закрити">✕</button></div><p>${esc(text)}</p>
      <div class="rl-offer-b"><button class="y" data-rly>${esc(yes)}</button><button data-rln>${esc(no)}</button></div>`;
    document.body.appendChild(el);
    const close=()=>el.remove();
    el.querySelector('[data-rly]').onclick=()=>{ close(); onYes(); };
    el.querySelector('[data-rln]').onclick=()=>{ close(); if(onNo) onNo(); };
    el.querySelector('[data-rlx]').onclick=()=>{ close(); if(onNo) onNo(); };
  }

  // ── 1) «Трекер сам» + 2) «Серія»: після «Зроблено» / зняття (хук у plCompleteBlock) ──
  function rlOnBlockDone(b,ds,done){
    const gid=b&&b.link&&b.link.goalId; const g=gid?(goalsData.goals||[]).find(x=>String(x.id||x.name)===String(gid)):null;
    // board пишеться цілком (усі папки) — лише коли сховище довірене, інакше стара копія перетре правки з інших пристроїв
    const trusted=!(window.sbDataTrusted&&!window.sbDataTrusted());
    if(g&&trusted&&rlOn('trk')&&typeof moOwnFolder==='function'&&moOwnFolder(g.folderKey)){
      const t=moTracker(g.folderKey);
      if(t){
        if(done&&!t.marks[ds]){ t.marks[ds]=true; b.rlTrk=true; rlMark('trk',true); saveBoard(); saveGoals(); }
        else if(done){ delete b.rlTrk; }   // ✓ уже стояла (руками) — не наша, не знімаємо
        else if(!done&&b.rlTrk){
          // знімаємо лише позначку, яку поставило правило, і лише якщо цього дня інших зроблених справ місії нема
          const other=plBlocksFor(ds).find(x=>x!==b&&x.done&&x.link&&String(x.link.goalId)===String(gid));
          if(other) other.rlTrk=true;   // ✓ лишається — тепер вона «належить» іншій зробленій справі
          else { delete t.marks[ds]; saveBoard(); }
          delete b.rlTrk; saveGoals();
        }
      }
    }
    // зняли «Зроблено» (руками, відкатом Флоу чи видаленням) — медаль, яку дала ця справа, теж знімається
    if(!done&&b&&b.rlMedal){ const h=jnHero(), n0=Array.isArray(h.medals)?h.medals.length:0;
      if(n0){ h.medals=h.medals.filter(m=>!(m&&m.id===b.rlMedal)); if(h.medals.length<n0) h.bonusXp=Math.max(0,(+h.bonusXp||0)-100); }
      delete b.rlMedal; saveGoals(); }
    if(done&&rlOn('streak')){
      const s=jnStreak(), N=Math.max(2,Math.round(rlN('streak')||7)), h=jnHero();
      if(s>0&&s%N===0){
        if(!Array.isArray(h.medals)) h.medals=[];
        const mid='streak'+s+'_'+ymdLocal();   // одна медаль на серію за сьогодні, хоч би який день відмічали
        if(!h.medals.some(m=>m&&m.id===mid)){
          h.medals.push({id:mid, t:'Серія '+s+' '+pluralUk(s,'день','дні','днів'), ds}); h.bonusXp=(+h.bonusXp||0)+100; b.rlMedal=mid;
          rlMark('streak',true); saveGoals();
          setTimeout(()=>{ try{ plToast('🔥 Серія '+s+' '+pluralUk(s,'день','дні','днів')+'! Медаль +100 XP'); }catch(_){} },900);
        }
      }
    }
  }

  // ── 3) «Скарбничка» і 4) «Зарплата» (дохід), 5) «Бюджет» (витрата): після запису операції в Гаманці ──
  function rlOnOp(op){
    if(!op||!opMain(op)) return;   // правила (скарбничка, зарплата, бюджет) — лише головна валюта (етап 3 навчить інших)
    if(op.type==='in'){
      const sal=rlOn('salary')&&(+op.amount>=Math.max(1,+rlN('salary')||10000)||/зарплат|salary|зп\b/i.test(String(op.label||'')));
      if(sal&&(envelopes||[]).length){ setTimeout(()=>rlSalarySheet(+op.amount),250); return; }
      const g=op.goalId?(goalsData.goals||[]).find(x=>String(x.id)===String(op.goalId)):null;
      if(rlOn('jar')&&g&&g.reward&&String(g.reward.t||'').trim()&&!g.reward.claimed&&typeof pzSaved==='function'){
        const rest=Math.max(0,Math.round(+g.reward.sum||0)-pzSaved(g)); let free=0; try{ free=walletBalance(); }catch(_){}
        const amt=Math.min(rest, Math.round(+op.amount*(+rlN('jar')||10)/100), Math.floor(free));
        if(amt>0) setTimeout(()=>rlOffer('🏆','Скарбничка', (op.label||'Дохід')+' +'+wlMoney(op.amount)+' · '+(g.name||'')+'. Відкласти '+rlN('jar')+'% ('+wlMoney(amt)+') на «'+g.reward.t+'»?',
          'Відкласти '+wlMoney(amt),'Не зараз',()=>{ let f2=0; try{ f2=walletBalance(); }catch(_){} const a2=Math.min(amt,Math.floor(f2)); if(!(a2>0)){ plToast('Зараз вільних грошей нема'); return; } pzDeposit(g,a2); rlMark('jar',true,a2); saveGoals(); try{ renderFinance(); }catch(_){} }, ()=>{ rlMark('jar',false); saveGoals(); }),250);
      }
    } else if(op.type==='out'&&rlOn('budget')&&op.goalId){
      const g=(goalsData.goals||[]).find(x=>String(x.id)===String(op.goalId)), bud=g&&g.budget&&+g.budget.money>0?+g.budget.money:0;
      if(bud){ const a=wlAgg(wlMonthOps(wlYm()),g.id);
        if(a.out>bud&&a.out-(+op.amount||0)<=bud){ rlMark('budget',false); saveGoals(); setTimeout(()=>{ try{ plToast('⚠️ «'+(g.name||'Місія')+'»: витрати '+wlMoney(a.out)+' — більше бюджету '+wlMoney(bud)); }catch(_){} },250); } }
    }
  }

  // ── «Зарплата по конвертах»: розподіл за шаблоном hero.salarySplit=[{envId,pct}] ──
  function rlSalarySheet(total){
    const envs=(envelopes||[]).filter(e=>e&&e.id), h=jnHero(), tpl=Array.isArray(h.salarySplit)?h.salarySplit:[];
    const pctOf=e=>{ const r=tpl.find(x=>x&&String(x.envId)===String(e.id)); return r?Math.max(0,Math.min(100,+r.pct||0)):0; };
    jnOverlay(`<div class="jn-ed-h"><b>💼 Розподілити ${wlMoney(total)}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Відсотки по конвертах і скарбничках. Решта лишається вільною. Шаблон запамʼятається.</small>
      <div class="rl-split">${envs.map(e=>`<label class="rl-sp"><span>${safeEmoji(e.emoji,'✉️')}</span><span class="rl-sp-n">${esc(e.name)}</span>
        <input type="number" inputmode="numeric" min="0" max="100" step="5" data-rlpct="${esc(e.id)}" value="${pctOf(e)||''}" placeholder="0" aria-label="Відсоток для ${esc(e.name)}"><i>%</i><b data-rlamt="${esc(e.id)}"></b></label>`).join('')}</div>
      <div class="rl-split-tot" id="rlTot"></div>
      <div class="jn-ed-foot"><button class="jn-btn" data-rlgo>Розкласти</button></div>`, ov=>{
      const upd=()=>{ let sum=0; ov.querySelectorAll('[data-rlpct]').forEach(i=>{ const p=Math.max(0,Math.min(100,+i.value||0)); sum+=p;
          const b=ov.querySelector('[data-rlamt="'+CSS.escape(i.dataset.rlpct)+'"]'); if(b) b.textContent=p?wlMoney(Math.round(total*p/100)):''; });
        const t=ov.querySelector('#rlTot'); t.textContent=sum>100?'Разом '+sum+'% — більше 100%':'Розкласти '+sum+'% ('+wlMoney(Math.round(total*sum/100))+') · вільними '+wlMoney(total-Math.round(total*sum/100));
        t.classList.toggle('bad',sum>100); return sum; };
      ov.querySelectorAll('[data-rlpct]').forEach(i=>i.oninput=upd); upd();
      ov.querySelector('[data-rlgo]').onclick=()=>{
        const sum=upd(); if(sum>100){ plToast('Разом більше 100%'); return; }
        const rows=[...ov.querySelectorAll('[data-rlpct]')].map(i=>({envId:i.dataset.rlpct, pct:Math.max(0,Math.min(100,Math.round(+i.value||0)))})).filter(r=>r.pct>0);
        let free=0; try{ free=walletBalance(); }catch(_){}
        const need=rows.reduce((s,r)=>s+Math.round(total*r.pct/100),0);
        if(need>free){ plToast('У Гаманці вільно лише '+wlMoney(free)); return; }
        rows.forEach(r=>{ const e=envelopes.find(x=>String(x.id)===String(r.envId)); const a=Math.round(total*r.pct/100); if(e&&a>0) envAddOp(e,'in',a,'Розподіл зарплати'); });
        h.salarySplit=rows; rlMark('salary',true,need); saveGoals();
        ov.remove(); try{ renderFinance(); }catch(_){} plToast('💼 Розкладено '+wlMoney(need)+' по '+rows.length+' '+pluralUk(rows.length,'конверту','конвертах','конвертах'));
      };
    });
  }

  // ── «Легший крок»: місія без руху N днів → картка на Журналі ──
  function rlEasyCand(){
    if(!rlOn('easy')) return null;
    const N=Math.max(1,Math.round(rlN('easy')||3)), td=ymdLocal(), by=plData().blocksByDay||{};
    const days=Object.keys(by).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&d<=td).sort().slice(-60);
    const last={}; days.forEach(d=>(by[d]||[]).forEach(b=>{ if(b&&b.done&&b.link&&b.link.goalId) last[String(b.link.goalId)]=d; }));
    let planned=new Set(); try{ planned=new Set(jnDayBlocks(td).map(jnBlockGoal).filter(Boolean).map(String)); }catch(_){}
    for(const g of (goalsData.goals||[])){
      if(!g||!g.id||jnStatus(g)!=='active'||jnRole(g)==='wait') continue;
      if(planned.has(String(g.id))) continue;   // на сьогодні справа місії вже стоїть — не пропонуємо ще одну
      const l=last[String(g.id)]; if(!l) continue;   // ще ніколи не рухали — не тиснемо
      const gap=Math.round((new Date(td+'T12:00:00')-new Date(l+'T12:00:00'))/864e5);
      if(gap<N) continue;
      // один ключ на місію: дата останнього «не зараз»
      let skip=false; try{ skip=localStorage.getItem('flow_rl_easy_'+g.id)===td; }catch(_){}
      if(!skip) return {g,gap};
    }
    return null;
  }
  function rlJournalHTML(){
    let h='';
    const d=rlDiscipline();
    if(d.all>=3) h+=`<button class="rl-disc" data-rlbook><span class="rl-ring" style="--p:${Math.round(d.ok/d.all*100)}"><em>${Math.round(d.ok/d.all*100)}%</em></span><span><b>Дисципліна тижня</b><small>правила дотримано ${d.ok} з ${d.all} ${pluralUk(d.all,'разу','разів','разів')}</small></span><i>›</i></button>`;
    const c=rlEasyCand();
    if(c) h+=`<div class="rl-card" style="--c:${safeColor(c.g.color,'#3ec7b4')}"><div class="rl-card-h"><span>🪶</span><b>Правило «Легший крок»</b></div>
      <p>«${esc(c.g.name||'Місія')}» — ${c.gap} ${pluralUk(c.gap,'день','дні','днів')} без руху. Почни з 15 хвилин сьогодні?</p>
      <div class="rl-offer-b"><button class="y" data-rleasy="${esc(c.g.id)}">Поставити 15 хв</button><button data-rleasyno="${esc(c.g.id)}">Не зараз</button></div></div>`;
    return h;
  }
  function rlJournalBind(c){
    c.querySelectorAll('[data-rlbook]').forEach(b=>b.onclick=()=>rlBook());
    c.querySelectorAll('[data-rleasy]').forEach(b=>b.onclick=()=>{
      const g=(goalsData.goals||[]).find(x=>String(x.id)===b.dataset.rleasy); if(!g) return;
      const td=ymdLocal(); let ds=td, h=dyFreeSlot(td,0.25);
      if(h===null){ ds=dyAddDays(td,1); h=dyFreeSlot(ds,0.25); }   // сьогодні місця нема — завтра
      if(h===null){ plToast('Нема вільних 15 хв ні сьогодні, ні завтра'); return; }
      const link={type:'habit', goalId:g.id, goalName:g.name||''};
      plBlocksFor(ds).push({id:dyNewId(), h, endH:h+0.25, t:(g.name||'Місія')+' · 15 хв', c:'val', link, tag:plLinkTag(link), folder:'', done:false, micro:true});
      if(ds!==td){ try{ localStorage.setItem('flow_rl_easy_'+g.id,td); }catch(_){} }
      rlMark('easy',true); saveGoals(); jnRender(); plToast('🪶 15 хв '+(ds===td?'сьогодні':'завтра')+' о '+plHM(h)+' — почни з малого');
    });
    c.querySelectorAll('[data-rleasyno]').forEach(b=>b.onclick=()=>{ try{ localStorage.setItem('flow_rl_easy_'+b.dataset.rleasyno,ymdLocal()); }catch(_){} rlMark('easy',false); saveGoals(); jnRender(); });
  }

  // ── «Книга правил»: картки «подія → наслідок», лічильник, перемикач, число ──
  function rlBook(){
    const old=document.querySelector('.rl-book'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='rl-book mo-mp'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    document.body.appendChild(ov);
    const draw=()=>{
      const h=jnHero(), st=(h.ruleStats&&typeof h.ruleStats==='object')?h.ruleStats:{}, d=rlDiscipline();
      const grps=[...new Set(RL.map(r=>r.grp))];
      ov.innerHTML=`<div class="mo-mp-in"><div class="mo-mp-top"><button data-rlbx>‹ Назад</button></div>
        <div class="pz-h"><b>📖 Книга правил</b><small>як твої дії рухають гру · ${RL.filter(r=>rlOn(r.id)).length} з ${RL.length} увімкнено</small></div>
        ${d.all?`<div class="rl-disc"><span class="rl-ring" style="--p:${Math.round(d.ok/d.all*100)}"><em>${Math.round(d.ok/d.all*100)}%</em></span><span><b>Дисципліна тижня</b><small>правила дотримано ${d.ok} з ${d.all}</small></span></div>`:''}
        ${grps.map(gr=>`<div class="mo-h" style="margin-top:6px"><span>${esc(gr)}</span></div><div class="rl-grid">${RL.filter(r=>r.grp===gr).map(r=>{ const on=rlOn(r.id), s=st[r.id]||{};
          const stat=r.id==='budget'?(s.miss?'попереджень: '+s.miss:'бюджет не перевищено'):r.id==='jar'||r.id==='salary'?(s.sum?'відкладено '+wlMoney(s.sum):'ще не спрацювало'):(s.n?'спрацювало '+s.n+'×':'ще не спрацювало');
          return `<div class="rl-bk${on?'':' off'}"><div class="rl-bk-t"><span>${r.em}</span><b>${esc(r.t)}</b></div>
            <div class="rl-bk-f">${rlFlow(r).map(x=>`<span>${esc(x)}</span>`).join('<i>→</i>')}</div>
            <div class="rl-bk-s"><small>${esc(stat)}</small>${r.n!==undefined?`<button class="rl-n" data-rln2="${r.id}">${r.unit==='cur'?money(rlN(r.id)):rlN(r.id)+(r.unit==='%'?'%':' '+esc(rlUnit(r,rlN(r.id))))}</button>`:''}
            <button class="rl-tg${on?' on':''}" data-rltg="${r.id}" role="switch" aria-checked="${on}" aria-label="${esc(r.t)}"></button></div></div>`; }).join('')}</div>`).join('')}
        <small class="mo-note">Правила, що чіпають гроші, лише пропонують — записують після твого тапу. «Трекер сам» знімає свою ✓, якщо зняти «Зроблено».</small></div>`;
      ov.querySelector('[data-rlbx]').onclick=()=>{ ov.remove(); try{ jnRender(); }catch(_){} };
      ov.querySelectorAll('[data-rltg]').forEach(b=>b.onclick=()=>{ const id=b.dataset.rltg, hh=jnHero(); if(!hh.rules||typeof hh.rules!=='object'||Array.isArray(hh.rules)) hh.rules={};
        hh.rules[id]=Object.assign({},hh.rules[id]||{},{on:!rlOn(id)}); saveGoals(); draw(); });
      ov.querySelectorAll('[data-rln2]').forEach(b=>b.onclick=()=>{ const r=rlDef(b.dataset.rln2); if(!r) return;
        inputModal({title:r.t+' — '+(r.unit==='cur'?'сума, '+curSym():r.unit), value:String(rlN(r.id)), placeholder:String(r.n), onOk:v=>{
          const n=Math.round(parseFloat(String(v||'').replace(',','.'))); if(!isFinite(n)) return;
          const hh=jnHero(); if(!hh.rules||typeof hh.rules!=='object'||Array.isArray(hh.rules)) hh.rules={};
          hh.rules[r.id]=Object.assign({},hh.rules[r.id]||{},{n:Math.max(r.min||0,Math.min(r.max||1e9,n))}); saveGoals(); draw(); }}); });
    };
    draw();
  }

  // ── шаблон зарплати без доходу (з Налаштувань гри / Плану): ті самі відсотки, лише зберегти ──
  function rlSalaryTpl(){
    const envs=(envelopes||[]).filter(e=>e&&e.id), h=jnHero(), tpl=Array.isArray(h.salarySplit)?h.salarySplit:[];
    if(!envs.length){ plToast('Спершу створи конверт у Гаманці'); return; }
    const pctOf=e=>{ const r=tpl.find(x=>x&&String(x.envId)===String(e.id)); return r?Math.max(0,Math.min(100,+r.pct||0)):0; };
    jnOverlay(`<div class="jn-ed-h"><b>💼 Шаблон зарплати</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Коли прийде зарплата, Гаманець запропонує розкласти її так. Нічого не переказує зараз.</small>
      <div class="rl-split">${envs.map(e=>`<label class="rl-sp"><span>${safeEmoji(e.emoji,'✉️')}</span><span class="rl-sp-n">${esc(e.name)}</span>
        <input type="number" inputmode="numeric" min="0" max="100" step="5" data-rlpct="${esc(e.id)}" value="${pctOf(e)||''}" placeholder="0" aria-label="Відсоток для ${esc(e.name)}"><i>%</i></label>`).join('')}</div>
      <div class="rl-split-tot" id="rlTot"></div>
      <div class="jn-ed-foot"><button class="jn-btn" data-rlsave>Зберегти шаблон</button></div>`, ov=>{
      const upd=()=>{ let s=0; ov.querySelectorAll('[data-rlpct]').forEach(i=>s+=Math.max(0,Math.min(100,+i.value||0)));
        const t=ov.querySelector('#rlTot'); t.textContent=s>100?'Разом '+s+'% — більше 100%':'Разом '+s+'% · вільними лишиться '+(100-s)+'%'; t.classList.toggle('bad',s>100); return s; };
      ov.querySelectorAll('[data-rlpct]').forEach(i=>i.oninput=upd); upd();
      ov.querySelector('[data-rlsave]').onclick=()=>{ if(upd()>100){ plToast('Разом більше 100%'); return; }
        h.salarySplit=[...ov.querySelectorAll('[data-rlpct]')].map(i=>({envId:i.dataset.rlpct, pct:Math.max(0,Math.min(100,Math.round(+i.value||0)))})).filter(r=>r.pct>0);
        saveGoals(); ov.remove(); plToast('💼 Шаблон збережено'); try{ if(document.querySelector('.wl-card')) renderFinance(); }catch(_){} };
    });
  }

  /* ════ План місяця (вкладка Гаманця): hero.plan[ym]={in:[{id,t,amt,day}],out:[…]} ════
     Факт рядка = операції з planId цього рядка за місяць. Регулярні платежі (fin_recurring) — у витратах, лише читання.
     Прогноз на кінець місяця = вільно зараз + ще не отримані доходи плану − ще не сплачені витрати плану й регулярні. */
  function rlPlan(ym,create){
    const h=jnHero(); if(!h.plan||typeof h.plan!=='object'||Array.isArray(h.plan)){ if(!create) return null; h.plan={}; }
    let p=h.plan[ym];
    if(!p||typeof p!=='object'||Array.isArray(p)){ if(!create) return null; p=h.plan[ym]={in:[],out:[]}; }
    // пошкоджені рядки (null, не-обʼєкт) не валять вкладку
    p.in=Array.isArray(p.in)?p.in.filter(r=>r&&typeof r==='object'&&!Array.isArray(r)):[]; p.out=Array.isArray(p.out)?p.out.filter(r=>r&&typeof r==='object'&&!Array.isArray(r)):[];
    return p;
  }
  function rlPlanFact(ym,id){ return (finOps||[]).filter(o=>o&&o.planId===id&&String(o.date||'').slice(0,7)===ym).reduce((s,o)=>s+(+o.amount||0),0); }
  function rlPrevYm(ym){ const y=+ym.slice(0,4), m=+ym.slice(5,7); return m===1?(y-1)+'-12':y+'-'+String(m-1).padStart(2,'0'); }
  // прогноз на кінець місяця — той самий і для вкладки «План», і для віджета Гаманця (48-widgets.js)
  function rlRecurring(){ return (typeof recurring!=='undefined'&&Array.isArray(recurring)?recurring:[]).filter(r=>r&&+r.amount>0); }
  function rlForecast(ym){
    const p=rlPlan(ym,false)||{in:[],out:[]}; let free=0; try{ free=walletBalance(); }catch(_){}
    const left=(rows)=>rows.reduce((s,r)=>s+Math.max(0,(+r.amt||0)-rlPlanFact(ym,r.id)),0);
    const recLeft=rlRecurring().filter(r=>r.lastYM!==ym).reduce((s,r)=>s+(+r.amount||0),0);
    return Math.round(free+left(p.in)-left(p.out)-recLeft);
  }
  // ще не закриті рядки плану (дохід і витрати), від найближчого дня
  function rlPlanOpen(ym){
    const p=rlPlan(ym,false)||{in:[],out:[]}, out=[];
    ['in','out'].forEach(k=>p[k].forEach(r=>{ const rest=Math.max(0,(+r.amt||0)-rlPlanFact(ym,r.id)); if(rest>0) out.push({k,r,rest}); }));
    return out.sort((a,b)=>(+a.r.day||99)-(+b.r.day||99));   // прострочені (день уже минув) — першими
  }
  function rlPlanHTML(ym){
    const p=rlPlan(ym,false)||{in:[],out:[]}, all=wlAgg(wlMonthOps(ym));
    const recs=rlRecurring();
    const pIn=p.in.reduce((s,r)=>s+(+r.amt||0),0), pOut=p.out.reduce((s,r)=>s+(+r.amt||0),0)+recs.reduce((s,r)=>s+(+r.amount||0),0);
    const fc=rlForecast(ym);
    const row=(r,k)=>{ const f=rlPlanFact(ym,r.id), ok=f>=(+r.amt||0)&&f>0;
      return `<button class="rl-pr${ok?' ok':''}" data-rlpr="${k}|${esc(r.id)}"><span class="rl-pr-d">${r.day?esc(String(r.day)):'—'}</span><span class="rl-pr-n"><b>${esc(r.t||'Без назви')}</b><small>${ok?'✓ записано '+wlMoney(f):f?'частково '+wlMoney(f):'тапни, коли '+(k==='in'?'прийде':'сплатиш')}</small></span><b class="${k}">${k==='in'?'+':'−'}${wlMoney(r.amt)}</b></button>`; };
    const prev=rlPlan(rlPrevYm(ym),false), canCopy=!p.in.length&&!p.out.length&&prev&&(prev.in.length||prev.out.length);
    return `<div class="rl-fc"><small>Прогноз на кінець місяця</small><b class="${fc<0?'neg':''}">${fc<0?'−':''}${wlMoney(Math.abs(fc))}</b>
        <span class="wl-sp"><span>план доходу <b>${wlMoney(pIn)}</b> · є ${wlMoney(all.inc)}</span><span>план витрат <b>${wlMoney(pOut)}</b> · є ${wlMoney(all.out)}</span></span></div>
      ${canCopy?`<button class="mo-set" data-rlcopy>Взяти план з минулого місяця</button>`:''}
      <div class="wl-sec"><span>Доходи</span><button data-rladd="in">＋ дохід</button></div>
      ${p.in.length?p.in.slice().sort((a,b)=>(+a.day||99)-(+b.day||99)).map(r=>row(r,'in')).join(''):'<div class="dy-empty"><span>Зарплата, оплата від клієнта — що чекаєш цього місяця.</span></div>'}
      <div class="wl-sec"><span>Витрати</span><button data-rladd="out">＋ витрата</button></div>
      ${p.out.slice().sort((a,b)=>(+a.day||99)-(+b.day||99)).map(r=>row(r,'out')).join('')}
      ${recs.map(r=>`<div class="rl-pr rec${r.lastYM===ym?' ok':''}"><span class="rl-pr-d">${r.day?esc(String(r.day)):'🔁'}</span><span class="rl-pr-n"><b>${safeEmoji(r.emoji,'🔁')} ${esc(r.name||'Регулярний')}</b><small>регулярний${r.lastYM===ym?' · списано':''}</small></span><b class="out">−${wlMoney(r.amount)}</b></div>`).join('')}
      ${!p.out.length&&!recs.length?'<div class="dy-empty"><span>Оренда, звʼязок, навчання — великі витрати місяця.</span></div>':''}
      <button class="mo-set" data-rlsal>💼 Шаблон зарплати по конвертах</button>`;
  }
  function rlPlanBind(c,ym){
    c.querySelectorAll('[data-rladd]').forEach(b=>b.onclick=()=>rlPlanEdit(ym,b.dataset.rladd,null));
    c.querySelectorAll('[data-rlpr]').forEach(b=>b.onclick=()=>{ const [k,id]=b.dataset.rlpr.split('|'); rlPlanRowMenu(ym,k,id); });
    { const s=c.querySelector('[data-rlsal]'); if(s) s.onclick=rlSalaryTpl; }
    { const cp=c.querySelector('[data-rlcopy]'); if(cp) cp.onclick=()=>{ const prev=rlPlan(rlPrevYm(ym),false); if(!prev) return; const p=rlPlan(ym,true);
      const cl=r=>({id:'pl'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), t:String(r.t||'').slice(0,60), amt:Math.max(0,Math.round(+r.amt||0)), day:r.day||null});
      p.in=prev.in.map(cl); p.out=prev.out.map(cl); saveGoals(); renderFinance(); plToast('План скопійовано'); }; }
  }
  function rlPlanEdit(ym,k,id){
    const p=rlPlan(ym,true), r=id?p[k].find(x=>x.id===id):null;
    jnOverlay(`<div class="jn-ed-h"><b>${r?'Змінити':(k==='in'?'＋ Дохід у план':'− Витрата в план')}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <label class="jn-f"><span>Що</span><input id="rlT" maxlength="60" value="${esc(r?r.t:'')}" placeholder="${k==='in'?'Зарплата, аванс, клієнт…':'Оренда, звʼязок, курс…'}"></label>
      <label class="jn-f"><span>Сума, ${curSym()}</span><input id="rlA" type="number" inputmode="decimal" min="0" step="1" value="${r?esc(String(r.amt)):''}" placeholder="Напр. 20000"></label>
      <label class="jn-f"><span>День місяця (необовʼязково)</span><input id="rlD" type="number" inputmode="numeric" min="1" max="31" value="${r&&r.day?esc(String(r.day)):''}" placeholder="Напр. 5"></label>
      <div class="jn-ed-foot"><button class="jn-btn" data-rlok>Зберегти</button></div>`, ov=>{
      ov.querySelector('[data-rlok]').onclick=()=>{
        const t=String(ov.querySelector('#rlT').value||'').trim().slice(0,60), amt=Math.round(parseFloat(String(ov.querySelector('#rlA').value||'').replace(',','.'))||0);
        const dd=parseInt(ov.querySelector('#rlD').value,10), day=dd>=1&&dd<=31?dd:null;
        if(!t){ plToast('Напиши, що це'); return; } if(!(amt>0)){ plToast('Вкажи суму'); return; }
        if(r) Object.assign(r,{t,amt,day}); else p[k].push({id:'pl'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), t, amt, day});
        saveGoals(); ov.remove(); renderFinance(); };
    });
  }
  function rlPlanRowMenu(ym,k,id){
    const p=rlPlan(ym,false); const r=p&&Array.isArray(p[k])?p[k].find(x=>x.id===id):null; if(!r) return;
    const f=rlPlanFact(ym,id), rest=Math.max(0,(+r.amt||0)-f), items=[];
    if(rest>0) items.push({ic:'plus', label:(k==='in'?'Прийшло':'Сплатив')+' · '+wlMoney(rest), sub:'запише '+(k==='in'?'дохід':'витрату')+' в Гаманець сьогодні', onClick:()=>{
      inputModal({title:(k==='in'?'Скільки прийшло':'Скільки сплатив')+', '+curSym(), value:String(rest), placeholder:String(rest), onOk:v=>{
        const amount=Math.round(parseFloat(String(v||'').replace(',','.'))*100)/100; if(!(amount>0)) return;
        const op={id:Date.now()+'_'+Math.random().toString(36).slice(2,6), type:k, amount, label:String(r.t||'').slice(0,80), date:ymdLocal(), card:mainCard().id, planId:r.id};
        finOps.push(op); saveFinOps(); renderFinance();
        try{ flowReact(k==='in'?'income':'spend',{amount}); }catch(_){}
        rlOnOp(op); }}); }});
    items.push({ic:'edit', label:'Змінити', onClick:()=>rlPlanEdit(ym,k,id)});
    items.push({ic:'trash', label:'Прибрати з плану', sub:f?'записані операції лишаться в Гаманці':'', danger:true, onClick:()=>{ const pp=rlPlan(ym,false); if(!pp) return; pp[k]=pp[k].filter(x=>x.id!==id); saveGoals(); renderFinance(); }});
    actionSheet({title:r.t||'План', sub:(k==='in'?'+':'−')+wlMoney(r.amt)+(f?' · записано '+wlMoney(f):''), items});
  }
