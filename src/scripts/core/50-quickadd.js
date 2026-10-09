  /* ════════ Швидкий запис з посилання (50-quickadd.js, 10.10.2026) ════════
     Для Apple Pay через Команди iPhone (автоматизація «Транзакція») і будь-яких ярликів:
       …/flow/?add=out&amount=230&label=Сільпо          — витрата
       …/flow/?add=in&amount=5000&label=Клієнт&cur=EUR  — дохід у балансі €
     Посилання НІЧОГО не пише саме: лише відкриває шторку Гаманця з уже вписаною сумою й назвою,
     запис — після тапу «Записати» людиною. Дані з адреси — недовірені: сума лише число > 0, назва ≤ 80
     символів (у поле через esc), валюта — лише код із CUR_LIST і лише якщо такий баланс уже є.
     Після прочитання параметри прибираються з адреси (history.replaceState), щоб оновлення сторінки не відкривало шторку знову. */

  // «230», «230,5», «1 230,50», «1,230.50» (англ. iPhone), «1.230,50» — останній роздільник = дробовий, решта — тисячі
  function qaNum(v){
    let t=String(v||'').replace(/[^\d.,]/g,''); if(!t) return 0;
    const li=Math.max(t.lastIndexOf('.'),t.lastIndexOf(','));
    if(li>=0){ const tail=t.slice(li+1); t=(tail.length===3&&(t.match(/[.,]/g)||[]).length===1&&t.indexOf(',')===li)?t.replace(/[.,]/g,'')   // «1,230» — тисячі
      :t.slice(0,li).replace(/[.,]/g,'')+'.'+tail; }
    const n=Math.round(parseFloat(t)*100)/100; return n>0&&n<1e9?n:0;
  }
  function qaParse(){
    let sp; try{ sp=new URLSearchParams(location.search); }catch(_){ return null; }
    const add=sp.get('add'); if(add!=='in'&&add!=='out') return null;
    const amount=qaNum(sp.get('amount'));
    const label=String(sp.get('label')||sp.get('merchant')||'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,80);
    const cur=String(sp.get('cur')||'').toUpperCase().slice(0,3);
    return {type:add, amount, label, cur};
  }
  function qaClearUrl(){
    try{ const u=new URL(location.href); ['add','amount','label','merchant','cur'].forEach(k=>u.searchParams.delete(k)); history.replaceState(history.state,'',u.pathname+(u.search||'')+u.hash); }catch(_){}
  }
  // чекаємо, поки load() прочитав Гаманець (інакше шторка відкриється над порожніми даними), максимум ~15 с
  function qaRun(){
    const q=qaParse(); if(!q) return;
    try{ if(window.top!==window.self){ qaClearUrl(); return; } }catch(_){ return; }   // у чужій рамці — нічого не відкриваємо (прихований клік)
    let tries=0;
    const go=()=>{
      tries++;
      const ready=!!window.__migReport&&!(window.storeKeyReady&&!window.storeKeyReady('fin_ops'));
      if(!ready&&tries<30){ setTimeout(go,500); return; }
      qaClearUrl();
      if(!ready){ try{ plToast('Гаманець ще не завантажився — запиши вручну'); }catch(_){} return; }
      try{ goFinance(); }catch(_){}
      let cur='';
      try{ if(q.cur&&curOk(q.cur)&&q.cur!==mainCur()&&wlCurList().includes(q.cur)) cur=q.cur; }catch(_){}
      setTimeout(()=>{ try{ wlOpSheet(q.type,'',{label:q.label, amount:q.amount, cur:cur||undefined, fromLink:true}); }catch(err){ console.error('quickadd',err); } },200);
    };
    setTimeout(go,300);
  }
  try{ qaRun(); }catch(_){}

  // ── інструкція: як підключити Apple Pay через Команди ──
  function qaGuide(){
    const base=location.origin+location.pathname;
    jnOverlay(`<div class="jn-ed-h"><b>💳 Apple Pay → Frequency</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Після кожної оплати карткою з Гаманця Apple iPhone сам відкриє Frequency із сумою й магазином — лишиться тапнути «Записати».</small>
      <ol class="qa-steps">
        <li>Відкрий <b>Команди</b> → <b>Автоматизація</b> → <b>＋</b> → <b>Транзакція</b>.</li>
        <li>Вибери свої картки, познач <b>«Запускати одразу»</b>.</li>
        <li>Дія: <b>Відкрити URL</b>. Встав адресу нижче, а замість <code>СУМА</code> і <code>МАГАЗИН</code> підстав змінні <b>Сума</b> і <b>Продавець</b> з транзакції.</li>
      </ol>
      <div class="qa-url" id="qaUrl">${esc(base)}?add=out&amp;amount=СУМА&amp;label=МАГАЗИН</div>
      <div class="jn-ed-foot"><button class="jn-btn ghost" data-qacopy>Скопіювати адресу</button><button class="jn-btn" data-qatry>Спробувати</button></div>
      <small class="mo-note">Посилання відкривається в Safari, тож увійди там у той самий акаунт — запис синхронізується з застосунком. Сам застосунок нічого не записує без твого тапу.</small>`, ov=>{
      ov.querySelector('[data-qacopy]').onclick=()=>{ const t=base+'?add=out&amount=СУМА&label=МАГАЗИН'; try{ navigator.clipboard.writeText(t).then(()=>plToast('Скопійовано'),()=>plToast('Не вдалося скопіювати')); }catch(_){ plToast('Не вдалося скопіювати'); } };
      ov.querySelector('[data-qatry]').onclick=()=>{ ov.remove(); try{ wlOpSheet('out','',{label:'Перевірка Apple Pay — не записуй'}); }catch(_){} plToast('Так виглядатиме шторка після оплати. Закрий її — це лише перевірка'); };   // без суми: випадковий тап нічого не запише
    });
  }
