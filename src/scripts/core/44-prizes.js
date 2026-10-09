  /* ════════ Призи і скарбничка (44-prizes.js, етап 8, 09.10.2026) ════════
     Приз — поле місії g.reward={t, sum, emoji, lv:''|id рівня, envId?, claimed?:'YYYY-MM-DD'}.
     Скарбничка призу — звичайний «конверт накопичень» Фінансів (envelopes, 08-finance.js) з kind:'приз', goalId.
     Гроші справжні: «Відкласти» = envAddOp(e,'in') (у Гаманці запис −₴, баланс зменшується);
     «Повернути»/«Забрати» = рух 'out' у конверті + запис 'in' у Гаманці з _tr:true (переказ, не дохід).
     Конверт створюється лише при першому «Відкласти». Усі записи — тільки після натискання людини. */

  function pzGoals(){ return (goalsData.goals||[]).filter(g=>g&&g.id&&g.reward&&typeof g.reward==='object'&&String(g.reward.t||'').trim()); }
  // запасний пошук за goalId: envId у goals_data може загубитись при синку двох пристроїв — гроші в конверті мають знаходитись
  function pzEnv(g){ if(!g) return null; const id=g.reward&&g.reward.envId, L=envelopes||[];
    return (id&&L.find(e=>e&&String(e.id)===String(id)))||L.find(e=>e&&e.kind==='приз'&&String(e.goalId||'')===String(g.id))||null; }
  function pzSaved(g){ const e=pzEnv(g); return e?Math.max(0,envSaved(e)):0; }
  function pzPrice(g){ return Math.max(0,Math.round(+g.reward.sum||0)); }
  // умова: увесь шлях (усі рівні; без рівнів — 100%) або конкретний рівень
  function pzUnlocked(g){
    const lv=jnLevels(g), id=g.reward.lv;
    if(id){ const m=lv.find(x=>String(x.id)===String(id)); return !!(m&&m.done); }
    return lv.length?lv.every(m=>m.done):jnPct(g)>=100;
  }
  function pzLeftLevels(g){ const lv=jnLevels(g), id=g.reward.lv; if(id){ const m=lv.find(x=>String(x.id)===String(id)); return m&&!m.done?1:0; } return lv.filter(m=>!m.done).length; }
  function pzReady(g){ return !g.reward.claimed&&pzUnlocked(g)&&pzSaved(g)>=pzPrice(g); }
  // отриманий приз, у скарбничці якого знову є гроші (напр. видалили рух «Приз забрано»), лишається видимим — щоб їх можна було повернути
  function pzActive(){ return pzGoals().filter(g=>!g.reward.claimed||pzSaved(g)>0); }
  function pzTotal(){ return pzActive().reduce((s,g)=>s+pzSaved(g),0); }
  function pzEmoji(g){ return safeEmoji(g.reward.emoji,'🎁'); }
  function pzK(n){ return moneyK(n); }
  function pzCond(g){ const left=pzLeftLevels(g), id=g.reward.lv;
    if(pzUnlocked(g)) return '✓ умову виконано';
    if(id){ const m=jnLevels(g).find(x=>String(x.id)===String(id)); return '🔒 рівень «'+(m?m.t:'?')+'»'; }
    return '🔒 ще '+left+' '+pluralUk(left,'рівень','рівні','рівнів'); }

  // ── Журнал (варіант Б): значок 🏆 у шапці і смужка лише коли є новина ──
  function pzPillHTML(){ if(!pzGoals().length) return ''; return `<button class="pz-pill" data-pzopen aria-label="Скарбничка призів">🏆 ${pzK(pzTotal())}</button>`; }
  function pzStripHTML(){
    const act=pzActive(); if(!act.length) return '';
    const ready=act.find(pzReady);
    if(ready) return `<button class="pz-strip ready" data-pzjar="${esc(ready.id)}"><span class="pz-strip-em">${pzEmoji(ready)}</span><span><b>${esc(ready.reward.t)} — можна забрати!</b><small>${pzK(pzSaved(ready))} відкладено · умову виконано</small></span><i>🎁</i></button>`;
    // «зовсім близько»: зібрано ≥80% або лишився 1 рівень
    const near=act.map(g=>({g, money:pzPrice(g)?pzSaved(g)/pzPrice(g):1, left:pzLeftLevels(g)})).filter(x=>x.money>=0.8||x.left<=1).sort((a,b)=>(a.left-b.left)||(b.money-a.money))[0];
    if(!near) return '';
    const g=near.g, rest=Math.max(0,pzPrice(g)-pzSaved(g)), left=near.left;
    const parts=[rest?pzK(rest):'', left?(left+' '+pluralUk(left,'рівень','рівні','рівнів')):''].filter(Boolean);
    return `<button class="pz-strip" data-pzjar="${esc(g.id)}"><span class="pz-strip-em">${pzEmoji(g)}</span><span><b>До «${esc(g.reward.t)}» — ${esc(parts.join(' і '))}</b><small>${esc(g.name||'Місія')}</small></span><i>›</i></button>`;
  }
  function pzBind(c){
    c.querySelectorAll('[data-pzopen]').forEach(b=>b.onclick=()=>pzScreen());
    c.querySelectorAll('[data-pzjar]').forEach(b=>b.onclick=()=>{ const g=pzGoals().find(x=>String(x.id)===b.dataset.pzjar); if(g) pzJarSheet(g); });
  }

  // ── Скарбничка: екран з баночками ──
  function pzMonthSaved(ym){
    const ids=new Set(pzGoals().map(g=>{ const e=pzEnv(g); return e&&e.id; }).filter(Boolean).map(String));   // через pzEnv — і без envId
    return (finOps||[]).filter(o=>o&&o.envId&&ids.has(String(o.envId))&&String(o.date||'').slice(0,7)===ym)
      .reduce((s,o)=>s+(o.type==='out'&&!o.envSpend?(+o.amount||0):(o.type==='in'&&!o.pzClaim?-(+o.amount||0):0)),0);   // «Забрати» — не відміна відкладання
  }
  function pzScreen(){
    const old=document.querySelector('.pz-scr'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='pz-scr mo-mp'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    document.body.appendChild(ov);
    const draw=()=>{
      const act=pzActive(), done=pzGoals().filter(g=>g.reward.claimed);
      let free=0; try{ free=walletBalance(); }catch(_){}
      const mon=Math.max(0,pzMonthSaved(ymdLocal().slice(0,7)));
      ov.innerHTML=`<div class="mo-mp-in">
        <div class="mo-mp-top"><button data-pzx>‹ Назад</button></div>
        <div class="pz-h"><b>🏆 Скарбничка</b><small>призи за місії · справжні гроші з Гаманця</small></div>
        <div class="pz-tot"><small>відкладено на призи</small><b>${pzK(pzTotal())}</b><small>у Гаманці вільно ${pzK(free)}${mon?' · цього місяця відклав '+pzK(mon):''}</small></div>
        <div class="pz-grid">${act.map(g=>{ const sv=pzSaved(g), pr=pzPrice(g), pct=pr?Math.min(100,Math.round(sv/pr*100)):(sv?100:0), rd=pzReady(g);
          return `<button class="pz-jar${rd?' ready':''}" data-pzjar="${esc(g.id)}" style="--c:${safeColor(g.color,'#f0b429')}">
            <span class="pz-jb"><i style="height:${pct}%"></i><em>${pzEmoji(g)}</em></span>
            <b>${esc(g.reward.t)}</b><small>${pzK(sv)} / ${pzK(pr)}</small><small class="pz-c">${rd?'✓ можна забрати':esc(pzCond(g))}</small></button>`; }).join('')}
          <button class="pz-jar add" data-pznew><span class="pz-jb"><em>＋</em></span><b>Новий приз</b><small>до будь-якої місії</small></button></div>
        ${done.length?`<div class="mo-h" style="margin-top:4px"><span>Отримані призи</span></div>${done.map(g=>`<div class="mo-fl"><span class="mo-fl-em">${pzEmoji(g)}</span><span><b>${esc(g.reward.t)}</b><small>${esc(g.name||'')} · ${jnDateTxt(g.reward.claimed)}</small></span><i>🏅</i></div>`).join('')}`:''}
      </div>`;
      ov.querySelector('[data-pzx]').onclick=()=>{ ov.remove(); try{ jnRender(); }catch(_){} };
      ov.querySelectorAll('[data-pzjar]').forEach(b=>b.onclick=()=>{ const g=pzGoals().find(x=>String(x.id)===b.dataset.pzjar); if(g) pzJarSheet(g,draw); });
      { const n=ov.querySelector('[data-pznew]'); if(n) n.onclick=()=>pzNewPrize(); }
    };
    draw();
  }
  // новий приз = місія без призу → редактор місії (блок «Приз» там)
  function pzNewPrize(){
    const ms=(goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)!=='archive'&&!(g.reward&&String(g.reward.t||'').trim()));
    if(!ms.length){ actionSheet({title:'Усі місії вже мають приз', sub:'Створи нову місію в Журналі — і додай їй приз у редакторі.', items:[{ic:'target', label:'Зрозуміло', onClick:()=>{}}]}); return; }
    actionSheet({title:'До якої місії приз?', sub:'Приз додається в редакторі місії', items:ms.map(g=>({ic:'target', label:(g.emoji?String(g.emoji)+' ':'')+(g.name||'Місія'), onClick:()=>{ const s=document.querySelector('.pz-scr'); if(s) s.remove(); jnEditor(g); }}))});
  }

  // ── Баночка: відкласти / повернути / забрати ──
  function pzJarSheet(g,after){
    const sv=pzSaved(g), pr=pzPrice(g), rd=pzReady(g), items=[];
    if(rd) items.push({ic:'target', label:'Забрати приз', sub:pzK(sv)+' повернуться на рахунок — на «'+g.reward.t+'»', primary:true, onClick:()=>pzCelebrate(g,after)});
    items.push({ic:'plus', label:'Відкласти', sub:pr>sv?'бракує '+pzK(pr-sv):'уже зібрано', primary:!rd, onClick:()=>pzAmountSheet(g,'in',after)});
    if(sv>0) items.push({ic:'refresh', label:'Повернути в Гаманець', sub:'зі скарбнички '+pzK(sv), onClick:()=>pzAmountSheet(g,'back',after)});
    items.push({ic:'edit', label:'Змінити приз', sub:'назва, ціна, умова — у редакторі місії', onClick:()=>{ const s=document.querySelector('.pz-scr'); if(s) s.remove(); jnEditor(g); }});
    actionSheet({title:(g.reward.emoji?String(g.reward.emoji)+' ':'')+g.reward.t, sub:pzK(sv)+' з '+pzK(pr)+' · '+pzCond(g)+' · '+(g.name||'Місія'), items});
  }
  function pzAmountSheet(g,mode,after){
    const sv=pzSaved(g), pr=pzPrice(g); let free=0; try{ free=walletBalance(); }catch(_){}
    const max=mode==='in'?Math.max(0,free):sv, need=Math.max(0,pr-sv);
    const chips=(mode==='in'?[500,1000,2000,5000]:[500,1000,2000]).filter(v=>v<max);
    const full=mode==='in'?(need>0&&need<=max?need:0):sv;
    jnOverlay(`<div class="jn-ed-h"><b>${mode==='in'?'Відкласти на':'Повернути з'} «${esc(g.reward.t)}»</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">${pzK(sv)} з ${pzK(pr)} · ${mode==='in'?'у Гаманці вільно '+pzK(free):'повернеться на рахунок'}</small>
      <label class="jn-f"><span>Сума, ${curSym()}</span><input id="pzAmt" type="number" inputmode="numeric" min="1" step="100" max="${max}" value="${full||''}" placeholder="0"></label>
      <div class="pz-chips">${chips.map(v=>`<button data-pzv="${v}">${v.toLocaleString('uk-UA')}</button>`).join('')}${full?`<button data-pzv="${full}">${mode==='in'?'усе, що бракує':'усе'} · ${full.toLocaleString('uk-UA')}</button>`:''}</div>
      <small class="mo-note">${mode==='in'?'У Гаманці зʼявиться запис «У конверт: '+esc(g.reward.t)+'». Повернути можна будь-коли.':'У Гаманці зʼявиться запис-переказ, у доходи він не рахується.'}</small>
      <div class="jn-ed-foot"><button class="jn-btn" data-pzok>${mode==='in'?'Відкласти':'Повернути'}</button></div>`, ov=>{
      const inp=ov.querySelector('#pzAmt');
      ov.querySelectorAll('[data-pzv]').forEach(b=>b.onclick=()=>{ inp.value=b.dataset.pzv; });
      ov.querySelector('[data-pzok]').onclick=()=>{
        const a=Math.round(+inp.value||0);
        if(!(a>0)){ plToast('Вкажи суму'); return; }
        if(a>max){ plToast(mode==='in'?'У Гаманці вільно лише '+pzK(max):'У скарбничці лише '+pzK(max)); return; }
        ov.remove();
        if(mode==='in') pzDeposit(g,a); else pzWithdraw(g,a,'Повернуто в Гаманець');
        try{ jnRender(); }catch(_){} if(after) after();
      };
    });
  }
  function pzDeposit(g,a){
    const q=(goalsData.goals||[]).find(x=>String(x.id)===String(g.id)); if(!q||!q.reward) return;
    let e=pzEnv(q);
    if(!e){
      e={id:'env_pz_'+Date.now().toString(36)+Math.random().toString(36).slice(2,5), name:String(q.reward.t).slice(0,60), emoji:safeEmoji(q.reward.emoji,'🎁'),
        goal:pzPrice(q), color:safeColor(q.color,'#f0b429'), kind:'приз', goalId:String(q.id), ops:[]};
      envelopes.push(e); q.reward.envId=e.id; saveGoals();
    }
    envAddOp(e,'in',a,'Відкладено на приз');
    plToast('🏆 '+pzK(a)+' — у скарбничку «'+q.reward.t+'»');
  }
  // гроші зі скарбнички назад на рахунок: рух 'out' у конверті + переказ 'in' у Гаманці (_tr — не дохід)
  function pzWithdraw(g,a,label){
    const e=pzEnv(g); if(!e) return false;
    a=Math.min(Math.round(a), pzSaved(g)); if(!(a>0)) return false;
    envMigrate(e);
    const date=ymdLocal(), finId='fin_'+Date.now()+Math.random().toString(36).slice(2,6);
    // окремий тип 'back': старий нормалізатор (інші пристрої зі старою збіркою) реагує лише на t:'out' і не сховає цей запис як витрату
    e.ops.unshift({id:'eop_'+Date.now()+Math.random().toString(36).slice(2,5), t:'back', label:label||'Повернуто в Гаманець', amount:a, date, finOpId:finId, back:true});
    e.saved=e.ops.reduce((s,o)=>s+(o.t==='in'?o.amount:-o.amount),0);
    let card; try{ card=mainCard().id; }catch(_){}
    finOps.push({id:finId, type:'in', amount:a, label:'Зі скарбнички: '+e.name, date, env:e.name, envId:e.id, card, _tr:true, pzClaim:label==='Приз забрано'||undefined});
    saveEnvelopes(); saveFinOps();
    plToast('↩ '+pzK(a)+' повернуто на рахунок');
    return true;
  }
  function pzCelebrate(g,after){
    const sv=pzSaved(g);
    const old=document.querySelector('.jn-cel'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='jn-cel'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.style.setProperty('--c','#f0b429');
    ov.innerHTML=`<div class="jn-cel-in"><span class="jn-conf" aria-hidden="true">${'<i></i>'.repeat(14)}</span>
      <span class="jn-cel-ok">${pzEmoji(g)}</span><b>Приз твій!</b>
      <p>${esc(g.name||'Місія')} — умову виконано. Скарбничка «${esc(g.reward.t)}» — ${pzK(sv)}. Гроші повернуться на рахунок, щоб ти витратив їх саме на це.</p>
      <span class="jn-cel-chips"><span>🏅 Приз отримано</span></span>
      <button class="jn-cel-go" data-pzclaim>Забрати ${pzK(sv)}</button><button class="jn-cel-undo" data-pzlater>Не зараз</button></div>`;
    document.body.appendChild(ov);
    ov.querySelector('[data-pzlater]').onclick=()=>ov.remove();
    ov.querySelector('[data-pzclaim]').onclick=()=>{
      const q=(goalsData.goals||[]).find(x=>String(x.id)===String(g.id));
      if(q&&q.reward&&pzReady(q)){
        pzWithdraw(q,pzSaved(q),'Приз забрано');
        q.reward.claimed=ymdLocal(); saveGoals();
      }
      ov.remove(); try{ jnRender(); }catch(_){} if(after) after();
    };
  }
