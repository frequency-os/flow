  /* ════════ ЖИВИЙ ОГЛЯД: план дня · гаманець · щоденник (аудит Ф1+Ф8) ════════
     Три віджети з реальних даних під hero-карткою. Тільки читання:
     plBlocksDisplay (планер), finBalance/monthAgg (гроші), diaryEntries (щоденник).
     Порожній стан кожного — конкретна дія в один тап, а не опис порожнечі. */
  (function(){
    function hwEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    function hwFmt(n){ try{ return Math.round(n).toLocaleString('uk-UA'); }catch(_){ return String(Math.round(n)); } }
    function hwHour(h){ const hh=Math.floor(h), mm=Math.round((h-hh)*60); return String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0'); }

    // наступні (до 3) блоки сьогодні: ще не завершені за часом і не виконані
    function nextBlocks(){
      try{
        const ds=plTodayStr();
        const now=new Date(); const nowDec=now.getHours()+now.getMinutes()/60;
        return plBlocksDisplay(ds)
          .filter(b=>!b.done && (b.endH==null || b.endH>nowDec))
          .sort((a,b)=>(a.h||0)-(b.h||0)).slice(0,3);
      }catch(_){ return []; }
    }
    function diaryStreak(){
      try{
        let n=0; const d=new Date();
        const has=ds=>{ const e=diaryEntries[ds]; return !!(e&&e.text); };
        if(!has(ymdLocal(d))) d.setDate(d.getDate()-1); // сьогодні ще не писав — рахуємо від учора
        while(has(ymdLocal(d))){ n++; d.setDate(d.getDate()-1); }
        return n;
      }catch(_){ return 0; }
    }

    function cardHTML(cls,go,inner){ return `<button class="hw-card ${cls}" data-hw="${go}">${inner}</button>`; }
    // лінійна іконка зі спрайта index.html замість емодзі — один стиль малювання в ряду шапок
    function hwIco(id){ return `<svg class="hw-ico" aria-hidden="true"><use href="#${id}"/></svg>`; }

    /* ── згортання секції (рішення Ярослава 25.09.2026) ──
       Три картки їдять пів-екрана, а потрібні не щодня. Тап по заголовку «Огляд»
       їх ховає; щоб не втратити суть, числа переїжджають у сам заголовок збоку.
       Стан лежить у ключі 'homeov' поруч з іншими дрібними налаштуваннями. */
    const OV_KEY='homeov';
    let ovOpen=true;
    try{ ovOpen = localStorage.getItem(OV_KEY)!=='closed'; }catch(_){}
    try{ prefCatchup(OV_KEY, v=>{ ovOpen = v!=='closed'; applyOv(); }); }catch(_){}

    function applyOv(){
      const head=document.getElementById('homeOvHead'), row=document.getElementById('homeWidgetsRow'),
            mini=document.getElementById('homeOvMini');
      if(!head||!row) return;
      head.classList.toggle('closed', !ovOpen);
      head.setAttribute('aria-expanded', ovOpen?'true':'false');
      row.hidden=!ovOpen;
      if(mini) mini.hidden=ovOpen;
    }
    function toggleOv(){
      ovOpen=!ovOpen;
      try{ prefSet(OV_KEY, ovOpen?'open':'closed'); }catch(_){}
      try{ window.platform.haptic('light'); }catch(_){}
      applyOv();
      // сітка/список нижче зсунулись — котик має перерахувати, чи не накрив картку
      try{ requestAnimationFrame(()=>{ if(typeof fcCheckOverlap==='function') fcCheckOverlap(); }); }catch(_){}
    }
    // числа в заголовку: лише те, де справді є що показати
    function miniHTML(nb,bal,spent,st){
      const chip=(ic,val,tone)=>`<span class="ovm" style="--ovc:${tone}">${hwIco(ic)}${hwEsc(val)}</span>`;
      let h='';
      if(nb.length) h+=chip('fo-calendar', nb.length+' '+pluralUk(nb.length,'блок','блоки','блоків'), 'var(--val)');
      if(bal!==null && (bal!==0||spent>0)) h+=chip('fo-coin', hwFmt(bal)+' ₴', 'var(--fin)');
      if(st>0) h+=chip('fo-book', st+' '+pluralUk(st,'день','дні','днів'), 'var(--hab)');
      return h || `<span class="ovm ovm-mut">нічого нового</span>`;
    }

    function render(){
      const host=document.getElementById('homeWidgetsRow'); if(!host) return;
      // планер
      const nb=nextBlocks();
      const plInner = nb.length
        ? `<div class="hw-h">${hwIco('fo-calendar')}Далі сьогодні</div>`+nb.map(b=>
            `<div class="hw-blk"><i style="background:${(typeof PL_COL!=='undefined'&&PL_COL[b.c])||'#5b8def'}"></i><b>${hwHour(b.h||0)}</b><span>${hwEsc(b.t||'Блок')}</span></div>`).join('')
        : `<div class="hw-h">${hwIco('fo-calendar')}План на сьогодні</div><div class="hw-empty">День ще порожній</div><div class="hw-cta">＋ Додати перший блок</div>`;
      // гаманець
      let bal=null, spent=0;
      try{ bal=finBalance(); const m=monthAgg(ymLocal()); spent=m.out; }catch(_){}
      const finInner = (bal!==null && (bal!==0||spent>0))
        ? `<div class="hw-h">${hwIco('fo-coin')}Гаманець</div><div class="hw-big">${hwFmt(bal)} ₴</div><div class="hw-sub">витрачено цього місяця: ${hwFmt(spent)} ₴</div>`
        : `<div class="hw-h">${hwIco('fo-coin')}Гаманець</div><div class="hw-empty">Ще без записів</div><div class="hw-cta">＋ Записати витрату</div>`;
      // щоденник
      const st=diaryStreak();
      const diaInner = st>0
        ? `<div class="hw-h">${hwIco('fo-book')}Щоденник</div><div class="hw-big">${st} ${pluralUk(st,'день','дні','днів')}</div><div class="hw-sub">пишеш підряд — тримай хвилю</div>`
        : `<div class="hw-h">${hwIco('fo-book')}Щоденник</div><div class="hw-empty">Стрік ще не почався</div><div class="hw-cta">＋ Перший запис</div>`;

      host.innerHTML =
        cardHTML('hw-wide','planner',plInner)
        + `<div class="hw-pair">`
        + cardHTML('','fin',finInner)
        + cardHTML('','diary',diaInner)
        + `</div>`;
      host.querySelectorAll('[data-hw]').forEach(b=>b.onclick=()=>{
        try{ window.platform.haptic('light'); }catch(_){}
        const k=b.dataset.hw;
        try{
          if(k==='planner') goPlanner();
          else if(k==='fin'){ (bal!==null&&(bal!==0||spent>0)) ? goFinance() : goSpend(); }
          else if(k==='diary') window.goDiary();
        }catch(e){ console.error('homeWidget',e); }
      });
      // ті самі дані — у заголовок, щоб згорнутий «Огляд» лишався інформативним
      const mini=document.getElementById('homeOvMini');
      if(mini) mini.innerHTML=miniHTML(nb,bal,spent,st);
      const head=document.getElementById('homeOvHead');
      if(head&&!head.__init){ head.__init=true; head.onclick=toggleOv; }
      applyOv();
    }
    window.renderHomeWidgets=render;

    // рендер: старт (дані сховища вантажаться асинхронно — кілька спроб),
    // прихід/оновлення даних, повернення на Огляд, хвилинний тик
    try{ render(); }catch(_){}
    setTimeout(render,600); setTimeout(render,2000);
    try{
      prefCatchup('goals_data',render);
      prefCatchup('fin_ops',render);
      prefCatchup('diary_entries_v1',render);
    }catch(_){}
    document.addEventListener('click',e=>{
      const t=e.target;
      if(t.closest && (t.closest('#navHome')||t.closest('[data-dnav="home"]'))) setTimeout(render,60);
    });
    setInterval(render,60000);
  })();
