  /* ════════ «Новий старт» — майстер фінансів з нуля (52-fresh-start.js, 10.10.2026) ════════
     Для нового Гаманця і після «Почати фінанси з нуля» (51-money-reset.js). Веде за руку, 4 кроки:
       1 Залишок — «Скільки зараз на рахунку?» (op start_…, не дохід місяця) + баланс в іншій валюті
       2 Конверти — стандартний набір (wlEnvStarter, 46-wallet.js) і «розкласти залишок за лімітами»
       3 Дохід — Робота по годинах (екран Роботи) / фіксована зарплата / пропустити
       4 План місяця — складається з кроків 2–3, пишеться лише після «Готово» і лише в порожній План
     Після майстра — плашка «Сьогодні»: перший тиждень записів (7 днів з витратами чи доходами).
     Стан майстра — лише на цьому пристрої (localStorage flow_fs). Усі записи — тапом людини
     і лише коли Гаманець звірено з хмарою (fsTrusted), як у «Почати фінанси з нуля». */
  const FS_KEY='flow_fs', FS_DAYS=7;
  function fsGet(){ try{ const v=JSON.parse(localStorage.getItem(FS_KEY)||'null'); return v&&typeof v==='object'&&!Array.isArray(v)?v:{}; }catch(_){ return {}; } }
  function fsSet(patch){ const v=Object.assign(fsGet(),patch); try{ localStorage.setItem(FS_KEY,JSON.stringify(v)); }catch(_){} return v; }
  function fsClear(){ try{ localStorage.removeItem(FS_KEY); }catch(_){} }
  function fsTrusted(keys){
    if(typeof window.sbDataTrusted==='function'&&!window.sbDataTrusted()) return false;
    return !(window.storeKeyReady&&!(keys||['fin_ops']).every(k=>window.storeKeyReady(k)));
  }
  const fsBusy=()=>plToast('Гаманець ще звіряється з хмарою — спробуй за хвилину');
  function fsStartOp(){ return (finOps||[]).find(o=>o&&String(o.id||'').startsWith('start_')&&!o.cur)||null; }
  // «порожньо» = нема конвертів і нема записів, крім самого стартового залишку
  function fsWalletEmpty(){ return !(envelopes||[]).length&&!(finOps||[]).some(o=>o&&!String(o.id||'').startsWith('start_')); }
  // майстер показується: почато й не закінчено — або Гаманець порожній і майстра тут ще не проходили
  function fsActive(){ const s=fsGet(); if(s.done) return false; return !!s.step||fsWalletEmpty(); }
  function fsStep(){ const n=+fsGet().step; return n>=1&&n<=4?n:1; }
  const FS_STEPS=[['💰','Залишок','скільки зараз на рахунку'],['🗂','Конверти','на що йдуть гроші'],['💼','Дохід','звідки гроші'],['📅','План місяця','що чекати й що платити']];
  function fsNum(v){ const a=Math.round(parseFloat(String(v||'').replace(/\s/g,'').replace(',','.').replace(/[^\d.]/g,''))*100)/100; return Number.isFinite(a)&&a>0&&a<1e9?a:0; }
  function fsHead(n){ return `<div class="jn-ed-h"><b>Новий старт · крок ${n}/4</b><button data-jnx aria-label="Закрити">✕</button></div>
    <div class="fs-dots">${FS_STEPS.map((s,i)=>`<i class="${i+1<n?'ok':i+1===n?'on':''}"></i>`).join('')}</div>`; }
  function fsGo(n){ fsSet({step:n}); try{ renderFinance(); }catch(_){} [null,fsStep1,fsStep2,fsStep3,fsStep4][n](); }

  /* ── картка в Огляді Гаманця ── */
  function wlStartHTML(){
    if(!fsTrusted()) return '';   // офлайн-копія «[]» ≠ справді порожній Гаманець (інший пристрій міг уже записати)
    if(fsActive()){
      const n=fsStep();
      return `<div class="wl-start"><b>Новий старт</b><small>4 кроки — і Гаманець показує правду. Можна перервати й продовжити потім.</small>
        <div class="fs-list">${FS_STEPS.map(([em,t,sub],i)=>`<div class="fs-li${i+1<n?' ok':i+1===n?' on':''}"><span>${i+1<n?'✓':em}</span><span><b>${t}</b><small>${sub}</small></span></div>`).join('')}</div>
        <button class="fs-go" data-fsgo>${n===1?'Почати':'Продовжити · крок '+n+'/4'}</button></div>`;
    }
    return fsTodayHTML();
  }
  function wlStartBind(c){
    const g=c.querySelector('[data-fsgo]'); if(g) g.onclick=()=>fsGo(fsStep());
    fsTodayBind(c);
  }

  /* ── крок 1: залишок ── */
  function fsStep1(){
    const st=fsStartOp();
    jnOverlay(`${fsHead(1)}<small class="dy-fm-sub">Скільки грошей зараз на картці й готівкою разом? Це стартова точка — вона не рахується як дохід місяця.</small>
      ${st?`<div class="wl-start-ok">✓ Записано: ${esc(money(st.amount))}</div>`:`<label class="jn-f"><span>Зараз на рахунку, ${esc(curSym())}</span><input id="fsBal" type="text" inputmode="decimal" placeholder="Напр. 12000" autocomplete="off"></label>`}
      <button class="mo-set" data-fscur>＋ Є ще гроші в іншій валюті</button>
      <div class="jn-ed-foot"><button class="jn-btn" data-fsok>${st?'Далі':'Записати і далі'}</button></div>`, ov=>{
      ov.querySelector('[data-fscur]').onclick=()=>{ ov.remove(); try{ wlCurAdd(); }catch(_){} };
      ov.querySelector('[data-fsok]').onclick=()=>{
        if(!fsStartOp()){
          const a=fsNum((ov.querySelector('#fsBal')||{}).value); if(!a){ plToast('Введи суму числом, напр. 12000'); return; }
          if(!fsTrusted()) return fsBusy();
          let card; try{ ensureCards(); card=mainCard().id; }catch(_){}
          finOps.push({id:'start_'+Date.now(), type:'in', amount:a, label:'Стартовий залишок', date:ymdLocal(), card});
          saveFinOps(); plToast('💰 Старт: '+money(a));
        }
        ov.remove(); fsGo(2);
      };
      const i=ov.querySelector('#fsBal'); if(i) setTimeout(()=>i.focus(),60);
    });
  }

  /* ── крок 2: конверти + розкласти залишок ── */
  function fsMainEnvs(){ return (envelopes||[]).filter(e=>e&&!envCur(e)); }
  function fsStep2(){
    const have=fsMainEnvs();
    jnOverlay(`${fsHead(2)}<small class="dy-fm-sub">Конверт — гроші, відкладені на одну справу: продукти, кафе, житло. Ліміт — скільки готовий витратити за місяць.</small>
      ${have.length?`<div class="wl-start-ok">✓ Конвертів: ${have.length}</div>`:''}
      <button class="mo-set" data-fstpl>🗂 ${have.length?'Додати ще зі стандартних':'Вибрати зі стандартних'}</button>
      <div class="jn-ed-foot"><button class="jn-btn ghost" data-fsskip>Пропустити</button><button class="jn-btn" data-fsok>Далі</button></div>`, ov=>{
      ov.querySelector('[data-fstpl]').onclick=()=>{ ov.remove(); wlEnvStarter(()=>{ try{ renderFinance(); }catch(_){} fsSplit(); }); };
      ov.querySelector('[data-fsskip]').onclick=()=>{ ov.remove(); fsGo(3); };
      ov.querySelector('[data-fsok]').onclick=()=>{ ov.remove(); fsMainEnvs().length?fsSplit():fsGo(3); };
    });
  }
  // що покласти в кожен конверт: до його ліміту, поки є вільні гроші (лише головна валюта)
  function fsSplitPlan(){
    let free=0; try{ free=Math.max(0,curFree()); }catch(_){}
    const rows=[];
    fsMainEnvs().forEach(e=>{ const need=Math.max(0,Math.round(((+e.goal||0)-(+e.saved||0))*100)/100), a=Math.min(need,free); if(a>0){ rows.push({e,a}); free-=a; } });
    return {rows, left:Math.round(free*100)/100};
  }
  function fsSplit(){
    const {rows,left}=fsSplitPlan();
    if(!rows.length){ fsGo(3); return; }
    jnOverlay(`${fsHead(2)}<small class="dy-fm-sub">Розкласти залишок по конвертах за лімітами? Гроші лишаються твої — просто «підписані».</small>
      <div class="fs-split">${rows.map(r=>`<div><span>${safeEmoji(r.e.emoji,'✉️')} ${esc(r.e.name||'Конверт')}</span><b>${esc(money(r.a))}</b></div>`).join('')}
        <div class="fs-split-l"><span>Лишиться вільних</span><b>${esc(money(left))}</b></div></div>
      <div class="jn-ed-foot"><button class="jn-btn ghost" data-fsno>Пізніше</button><button class="jn-btn" data-fsok>Розкласти</button></div>`, ov=>{
      ov.querySelector('[data-fsno]').onclick=()=>{ ov.remove(); fsGo(3); };
      ov.querySelector('[data-fsok]').onclick=()=>{
        if(!fsTrusted(['fin_ops',ENVKEY])) return fsBusy();
        const p=fsSplitPlan(); let n=0;   // перерахунок у мить тапу — баланс міг змінитись
        p.rows.forEach(r=>{ envAddOp(r.e,'in',r.a,'Новий старт'); n++; });
        if(n){ saveEnvelopes(); saveFinOps(); plToast('🗂 Розкладено по '+n+' '+pluralUk(n,'конверту','конвертах','конвертах')); }
        ov.remove(); fsGo(3);
      };
    });
  }

  /* ── крок 3: дохід ── */
  function fsStep3(){
    const s=fsGet(), inc=s.inc&&typeof s.inc==='object'?s.inc:null;
    let wk=null; try{ wk=typeof wkMoneyInfo==='function'?wkMoneyInfo():null; }catch(_){}
    jnOverlay(`${fsHead(3)}<small class="dy-fm-sub">Звідки приходять гроші? Це піде в План місяця як очікуваний дохід.</small>
      <div class="fs-opts">
        <button data-fsinc="work"${s.inc==='work'?' class="on"':''}><span>⏱</span><span><b>Робота по годинах</b><small>${wk&&wk.has?'години вже є — Frequency порахує зарплату сам':'ставка і календар змін — зарплата рахується сама'}</small></span></button>
        <button data-fsinc="fix"${inc?' class="on"':''}><span>💼</span><span><b>Фіксована зарплата</b><small>однакова сума щомісяця</small></span></button>
      </div>
      <div class="fs-fix"${inc?'':' hidden'}>
        <label class="jn-f"><span>Сума на місяць, ${esc(curSym())}</span><input id="fsAmt" type="text" inputmode="decimal" value="${inc?esc(String(inc.amt)):''}" placeholder="Напр. 30000" autocomplete="off"></label>
        <label class="jn-f"><span>День зарплати (необовʼязково)</span><input id="fsDay" type="number" inputmode="numeric" min="1" max="31" value="${inc&&inc.day?esc(String(inc.day)):''}" placeholder="Напр. 5"></label>
      </div>
      <div class="jn-ed-foot"><button class="jn-btn ghost" data-fsskip>Пропустити</button><button class="jn-btn" data-fsok>Далі</button></div>`, ov=>{
      let pick=s.inc==='work'?'work':inc?'fix':'';
      ov.querySelectorAll('[data-fsinc]').forEach(b=>b.onclick=()=>{
        pick=b.dataset.fsinc; ov.querySelectorAll('[data-fsinc]').forEach(x=>x.classList.toggle('on',x===b));
        ov.querySelector('.fs-fix').hidden=pick!=='fix';
        if(pick==='fix') setTimeout(()=>ov.querySelector('#fsAmt').focus(),60);
      });
      ov.querySelector('[data-fsskip]').onclick=()=>{ fsSet({inc:null}); ov.remove(); fsGo(4); };
      ov.querySelector('[data-fsok]').onclick=()=>{
        if(pick==='work'){
          // ставку й день виплати людина задає на екрані Роботи; повернеться — картка продовжить з кроку 4
          fsSet({inc:'work', step:4}); ov.remove(); plToast('Задай ставку й день зарплати — потім повернись у Гаманець');
          try{ goWork(); }catch(_){} return;
        }
        if(pick==='fix'){
          const amt=fsNum(ov.querySelector('#fsAmt').value); if(!amt){ plToast('Вкажи суму зарплати'); return; }
          const dd=parseInt(ov.querySelector('#fsDay').value,10);
          fsSet({inc:{amt:Math.round(amt), day:dd>=1&&dd<=31?dd:null}});
        } else fsSet({inc:null});
        ov.remove(); fsGo(4);
      };
    });
  }

  /* ── крок 4: План місяця ── */
  function fsPlanRows(){
    const s=fsGet(), rows={in:[],out:[]};
    // flow_fs — локальне сховище, тож перевіряємо ще раз, перш ніж писати в План (він їде в хмару)
    if(s.inc&&typeof s.inc==='object'){ const amt=fsNum(s.inc.amt), d=parseInt(s.inc.day,10); if(amt) rows.in.push({t:'Зарплата', amt:Math.round(amt), day:d>=1&&d<=31?d:null}); }
    // рядок-конверт закривається поповненням конверта (rlPlanFact, 47-rules.js), а не витратою з нього
    fsMainEnvs().filter(e=>+e.goal>0).forEach(e=>rows.out.push({t:String(e.name||'Конверт').slice(0,60), amt:Math.round(+e.goal), day:null, envId:e.id}));
    return rows;
  }
  function fsStep4(){
    const ym=wlYm(), s=fsGet(), r=fsPlanRows(), p=rlPlan(ym,false), busy=!!(p&&(p.in.length||p.out.length));
    let wk=0; try{ const i=wkMoneyInfo(ym); wk=i&&!i.skip?Math.round(i.earned||0):0; }catch(_){}
    const inSum=r.in.reduce((a,x)=>a+x.amt,0), outSum=r.out.reduce((a,x)=>a+x.amt,0), incAll=inSum+(s.inc==='work'?wk:0);
    jnOverlay(`${fsHead(4)}<small class="dy-fm-sub">${busy?'План цього місяця вже є — його не чіпаю. Подивись підсумок і заверши.':'Ось План місяця з твоїх відповідей. Змінити можна будь-коли у вкладці «План».'}</small>
      <div class="fs-split">
        ${r.in.map(x=>`<div><span>＋ ${esc(x.t)}${x.day?' · '+esc(String(x.day))+' числа':''}</span><b>${esc(money(x.amt))}</b></div>`).join('')}
        ${s.inc==='work'?`<div><span>＋ Робота${wk?' (зароблено цього місяця)':' — зʼявиться з першими годинами'}</span><b>${wk?esc(money(wk)):'—'}</b></div>`:''}
        ${r.out.map(x=>`<div><span>− ${esc(x.t)}</span><b>${esc(money(x.amt))}</b></div>`).join('')}
        ${!r.in.length&&!r.out.length&&s.inc!=='work'?'<div><span>Поки порожньо — додаси доходи й витрати у вкладці «План»</span></div>':''}
        ${incAll||outSum?`<div class="fs-split-l"><span>${incAll>=outSum?'Лишиться після конвертів':'Конверти більші за дохід на'}</span><b>${esc(money(Math.abs(incAll-outSum)))}</b></div>`:''}
      </div>
      <div class="jn-ed-foot"><button class="jn-btn ghost" data-fsback>Назад</button><button class="jn-btn" data-fsok>Готово</button></div>`, ov=>{
      ov.querySelector('[data-fsback]').onclick=()=>{ ov.remove(); fsGo(3); };
      ov.querySelector('[data-fsok]').onclick=()=>{
        if(!busy&&(r.in.length||r.out.length)){
          if(!fsTrusted(['fin_ops','goals_data'])) return fsBusy();
          const pp=rlPlan(ym,true);
          if(!pp.in.length&&!pp.out.length){   // ще раз у мить тапу: план міг прийти з іншого пристрою
            const nid=()=>'pl'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
            r.in.forEach(x=>pp.in.push(Object.assign({id:nid()},x)));
            r.out.forEach(x=>pp.out.push(Object.assign({id:nid()},x)));
            saveGoals();
          }
        }
        fsSet({done:true, step:0, doneAt:ymdLocal()}); ov.remove();
        try{ renderFinance(); }catch(_){}
        plToast('🎉 Гаманець готовий. Тепер записуй витрати щодня');
      };
    });
  }

  /* ── «Сьогодні»: перший тиждень записів ── */
  function fsDays(){
    const s=fsGet(), from=String(s.doneAt||'');
    const d=new Set((finOps||[]).filter(o=>o&&!o._autoSal&&(_isExpAny(o)||_isIncAny(o))&&!String(o.id||'').startsWith('start_')&&String(o.date||'')>=from).map(o=>String(o.date||'').slice(0,10)));
    return d.size;
  }
  function fsTodayHTML(){
    const s=fsGet(); if(!s.done||s.hideToday) return '';
    const n=fsDays(); if(n>=FS_DAYS) return '';
    const td=ymdLocal(), today=(finOps||[]).some(o=>o&&!o._autoSal&&_isExpAny(o)&&String(o.date||'').slice(0,10)===td);
    return `<div class="fs-today"><div class="fs-today-h"><b>Сьогодні</b><button data-fstx aria-label="Сховати">✕</button></div>
      <small>${today?'✓ Сьогодні вже є запис. Ще щось купив — додай.':'Що купив сьогодні? Запиши — 10 секунд.'}</small>
      <div class="fs-week"><span style="--p:${Math.round(n/FS_DAYS*100)}"></span><small>записано ${n} з ${FS_DAYS} днів — звичка, після якої Гаманець бачить правду</small></div>
      <div class="fs-today-a"><button class="pri" data-fsout>− Витрата</button><button data-fsap>💳 Apple Pay</button></div></div>`;
  }
  function fsTodayBind(c){
    const o=c.querySelector('[data-fsout]'); if(o) o.onclick=()=>wlOpSheet('out');
    const a=c.querySelector('[data-fsap]'); if(a) a.onclick=()=>{ try{ qaGuide(); }catch(_){} };
    const x=c.querySelector('[data-fstx]'); if(x) x.onclick=()=>{ fsSet({hideToday:true}); try{ renderFinance(); }catch(_){} };
  }
