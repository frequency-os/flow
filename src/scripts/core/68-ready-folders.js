  /* ════════ Готові папки (22.11.2026) — відділ Магазину блоків (62-block-store.js, вкладка «Готові папки»; файл 68-ready-folders.js) ════════
     «Встановити» = звичайна папка з набором блоків: її можна перейменувати, ставити підпапки, звʼязки, свої блоки.
     Створюється ЛИШЕ тапом людини (inputModal → назва й емодзі), при старті нічого не пишеться.
     «Робота» — папка з блоком «Календар годин» (67-work-panel.js); одна на акаунт: якщо вже є — «Відкрити».
     Решта — шаблони колишніх Сфер (39-spheres.js SPH_TPL), без шапки сфери: просто папка з блоками.
     Позначка походження в папці: ready:'<ключ>' (лише для «Відкрити» й для схованої заводської Роботи). */
  const RF_SPH_EN={fin:['Finance desk','Income, spending, monthly target',['Income','Spending','Wallet']],sport:['Sport','Workouts, habit, plan',['Heatmap','Plan']],
    learn:['Learning','Day streak, lessons',['Streak','Plan']],brand:['Brand / content','Posts, plan',['Heatmap','Plan']],
    habit:['Habit','Days without slips, savings',['Heatmap','Countdown']],home:['Home','Chores, sleep, your tasks',['Heatmap','Plan']]};
  function rfItems(){
    const L=[{k:'robota',em:'💼',c:'#5b8def',uk:['Робота','Календар годин → зарплата → конверти',['Календар годин','Зарплата','Конверти']],
      en:['Work','Hours calendar → salary → envelopes',['Hours calendar','Salary','Envelopes']],blocks:()=>[{type:'wgworkpanel'}]}];
    try{ SPH_ORDER.filter(t=>t!=='work'&&SPH_TPL[t]).forEach(t=>{ const T=SPH_TPL[t], en=RF_SPH_EN[t]||[T.n,T.d,T.chips];
      L.push({k:t,em:T.em,c:T.c,uk:[T.n,T.d,T.chips],en,blocks:T.blocks}); }); }catch(_){}
    return L;
  }
  function rfFind(k){ return rfItems().find(x=>x.k===k)||null; }
  // уже встановлена «Робота» (одна на акаунт); для інших шаблонів можна ставити скільки завгодно
  function rfInstalled(k){ if(k!=='robota') return ''; try{ return Object.keys(folders).find(fk=>folders[fk]&&folders[fk].ready==='robota'&&!folders[fk].deleted&&(typeof folderVisible!=='function'||folderVisible(fk)))||''; }catch(_){ return ''; } }
  function rfStoreHTML(en){
    return `<p class="bs-lead">${en?'A ready folder is a normal folder with blocks already in place: rename it, add subfolders, links and your own blocks.':'Готова папка — звичайна папка, де блоки вже стоять: перейменовуй, додавай підпапки, звʼязки й свої блоки.'}</p>
      <div class="rf-list">${rfItems().map(it=>{ const T=en?it.en:it.uk, have=rfInstalled(it.k);
        const c=/^#[0-9a-f]{6}$/i.test(String(it.c||''))?it.c:'#6a7dff';   // колір і емодзі — поки з констант, але перевіряємо: шаблони колись можуть прийти ззовні
        return `<div class="rf-card" style="--c:${c}"><div class="rf-top"><span class="rf-em" aria-hidden="true">${esc(String(it.em||''))}</span><span class="rf-tx"><b>${esc(T[0])}</b><small>${esc(T[1])}</small></span></div>
          <div class="rf-chips">${(T[2]||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div>
          <button class="rf-get${have?' have':''}" data-rfinst="${esc(it.k)}">${have?(en?'Open':'Відкрити'):(en?'Install':'Встановити')}</button></div>`; }).join('')}</div>`;
  }
  function rfInstall(k){
    const it=rfFind(k); if(!it) return;
    const have=rfInstalled(k); if(have){ goFolder(have); return; }
    const en=(typeof bsLang==='function'&&bsLang()==='en'), T=en?it.en:it.uk;
    inputModal({ title:(en?'New folder · ':'Нова папка · ')+T[0], placeholder:T[0], value:T[0], emoji:true, emojiVal:it.em,
      onOk:(name, emojiVal)=>{
        if(foldersLoaded!==true){ try{ plToast(en?'Folders are still loading — try in a moment':'Папки ще завантажуються — спробуй за мить'); }catch(_){} return; }   // як fmDuplicate і folder.create у Ядрі
        const nm=String(name||'').trim().slice(0,60)||T[0];
        const em=(emojiVal!==undefined&&emojiVal!=='')?emojiVal:it.em;
        const key='f_'+Date.now();
        folders[key]={ key, c:it.c, emoji:em, icon:folderIconFor(em), name:nm, pct:0, photo:'', flayout:'a', pinned:false, custom:true, widgets:[], ready:k };
        order.push(key);
        boards[key]=it.blocks().map((b,i)=>{ const o=Object.assign({id:'rf'+Date.now().toString(36)+i+Math.random().toString(36).slice(2,5)},b);
          if(o.type==='wplanday') o.pfolder=key; return o; });
        saveBoard(); saveFolders(); renderDashboard();   // тап людини — звичайний запис (не {auto:true})
        try{ window.platform.haptic('medium'); }catch(_){}
        goFolder(key);
      }});
  }
