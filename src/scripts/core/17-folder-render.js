  /* ============ FOLDER RENDER ============ */
  let folderView='list';      // 'list' | 'grid'
  let currentFolderKey=null;
  document.getElementById('folderView').onclick=()=>{
    folderView = folderView==='list' ? 'grid' : 'list';
    if(currentFolderKey) renderFolder(currentFolderKey);
  };
  function renderFolder(key){
    currentFolderKey=key;
    const f=folders[key];
    document.getElementById('folderHead').style.setProperty('--c',f.c);
    document.getElementById('fEy').textContent=f.name;
    document.getElementById('fName').textContent=f.name;
    const em=document.getElementById('fEm');
    em.textContent=f.emoji; em.style.setProperty('--c',f.c);
    document.getElementById('folderBack').style.setProperty('--c',f.c);

    const body=document.getElementById('folderBody');
    // built-in folder board
    const bcnt=(boards[key]||[]).length;
    const boardCard=`<div class="wcard boardcard" style="--c:${f.c}" data-board="${key}">
      <div class="wem">🧩</div>
      <div class="wmid"><div class="wt">Дошка папки</div><div class="wd">Нотатки, чеклісти, таблиці, фото</div></div>
      <div class="wv">${bcnt?bcnt+' бл.':'+'}</div><div class="chev">›</div></div>`;

    // user-created boards for this folder
    const customCards=tabsForFolder(key).map(cb=>{
      const n=(boards[cb.key]||[]).length;
      return `<div class="wcard customboard" style="--c:${cb.color}" data-board="${cb.key}">
        <div class="wem">${cb.emoji}</div>
        <div class="wmid"><div class="wt">${esc(cb.label)}</div><div class="wd">Моя дошка</div></div>
        <div class="wv">${n?n+' бл.':'+'}</div>
        <button class="cbdel" data-cbdel="${cb.key}" title="Видалити">×</button>
        <div class="chev">›</div></div>`;
    }).join('');

    const wids=widgetsForFolder(key);
    const builtIds=(f.widgets||[]).map(w=>w.id);
    const widgetCards=wids.map(id=>{
      const w=WIDGET_CATALOG[id]; if(!w) return '';
      let val='';
      if(id==='debts'){ val=debtSummary(); }
      if(id==='spend'){ val=spendSummary(); }
      if(id==='envelopes'){ try{ val=envSummary(); }catch(_){ val=''; } }
      if(id==='income'){ try{ val=incomeSummary(); }catch(_){ val=''; } }
      if(id==='worktrack'){ try{ val=workSummary&&workSummary(); }catch(_){ val=''; } }
      if(id==='planday'){ try{ val=plFolderDayVal(key); }catch(_){ val=''; } }
      if(id==='planmonth'){ try{ val=plFolderMonthVal(key); }catch(_){ val=''; } }
      const removable = !builtIds.includes(id); // вбудовані не прибираються
      const rmBtn = removable ? `<button class="cbdel" data-wrm="${id}" title="Прибрати з папки">×</button>` : '';
      return `<div class="wcard" style="--c:${f.c}" data-w="${id}">
        <div class="wem">${w.emoji}</div>
        <div class="wmid"><div class="wt">${w.t}</div><div class="wd">${w.d}</div></div>
        <div class="wv">${val||''}</div>${rmBtn}<div class="chev">›</div></div>`;
    }).join('');

    // картка "+ Віджет"
    const addWidgetCard=`<div class="wcard newboard" data-addwidget="${key}" style="--c:${f.c}">
      <div class="wem">🧩</div>
      <div class="wmid"><div class="wt">+ Віджет</div><div class="wd">Додати трекер, борги, витрати…</div></div></div>`;

    const newCard=`<div class="wcard newboard" data-newboard="${key}" style="--c:${f.c}">
      <div class="wem">➕</div>
      <div class="wmid"><div class="wt">Нова дошка</div><div class="wd">Створити свою дошку в цій папці</div></div></div>`;

    // ── денний трекер цілей, привʼязаних до цієї папки ──
    const todayStrF=ymdLocal();
    const linkedGoals=(goalsData.goals||[]).filter(gl=>gl.folderKey===key);
    let goalTrackHtml='';
    try{
      goalTrackHtml = linkedGoals.length ? `<div class="fld-goals" id="fldGoals">`
        + linkedGoals.map(gl=>{
            let inner=''; try{ inner=dayGoalsBlock(gl, todayStrF)||''; }catch(_){ inner=''; }
            return `<div class="fld-goal-wrap" data-fgoal="${gl.id}">
              <div class="fld-goal-h"><span class="fgh-em">${gl.emoji||'🎯'}</span><span class="fgh-nm">${esc(gl.name)}</span></div>
              ${inner}
            </div>`;
          }).join('')
        + `</div>` : '';
    }catch(_){ goalTrackHtml=''; }

    // ── вкладені папки цієї папки ──
    const subKeys=childFolderKeys(key);
    const subFoldersHtml = subKeys.length ? `<div class="fld-subs" id="fldSubs">`
      + subKeys.map(sk=>{ const sf=folders[sk];
          const sem=(sf.emoji&&sf.emoji.trim())?sf.emoji:esc((sf.name||'?').trim().charAt(0).toUpperCase());
          const sub2=childFolderKeys(sk).length; const sub2Badge=sub2?`<span class="fsub-mini">📁 ${sub2}</span>`:'';
          return `<div class="wcard subfolder" style="--c:${sf.c}" data-subfolder="${sk}">
            <div class="wem">${sem}</div>
            <div class="wmid"><div class="wt">${esc(sf.name)}</div><div class="wd">Папка${sub2?' · '+sub2+' вкладених':''}</div></div>
            ${sub2Badge}<div class="chev">›</div></div>`; }).join('')
      + `</div>` : '';

    body.innerHTML = goalTrackHtml + subFoldersHtml + `<div class="wlist ${folderView==='grid'?'gridview':''}">`
      + boardCard + customCards + widgetCards + addWidgetCard + newCard + `</div>`;

    document.getElementById('folderView').textContent = folderView==='grid' ? '🔲' : '📃';
    const bc=body.querySelector('.boardcard'); if(bc) bc.onclick=()=>goSpaceFor(key);
    body.querySelectorAll('[data-subfolder]').forEach(el=>{ el.onclick=()=>goFolder(el.dataset.subfolder); });
    body.querySelectorAll('.customboard').forEach(el=>{
      el.onclick=(e)=>{ if(e.target.closest('.cbdel')) return; goSpaceFor(el.dataset.board); };
    });
    body.querySelectorAll('[data-cbdel]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation(); delCustomBoard(el.dataset.cbdel, key);
    });
    const nb=body.querySelector('[data-newboard]'); if(nb) nb.onclick=()=>createCustomBoard(key);
    const aw=body.querySelector('[data-addwidget]'); if(aw) aw.onclick=()=>openWidgetPicker(key);
    body.querySelectorAll('[data-wrm]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      confirmSheet({title:'Прибрати віджет із цієї папки?', sub:'Дані лишаться.', okLabel:'Прибрати', onOk:()=>removeWidgetFromFolder(key, el.dataset.wrm)});
    });
    body.querySelectorAll('.wcard[data-w]').forEach(el=>{
      el.onclick=(e)=>{
        if(e.target.closest('.cbdel')) return;
        const w=WIDGET_CATALOG[el.dataset.w];
        if(w && typeof w.open==='function') w.open();
      };
    });

    // ── денний трекер цілей у папці: ті самі дані, re-render папки ──
    const gg=goalsData;
    const reF=()=>{ saveGoals(); renderFolder(key); };
    body.querySelectorAll('[data-dgview]').forEach(el=>el.onclick=()=>{
      const [gid,view]=el.dataset.dgview.split('|');
      const gl=gg.goals.find(x=>x.id===gid); if(!gl) return; gl._dayView=view; reF();
    });
    body.querySelectorAll('[data-dgitem]').forEach(el=>el.onclick=(e)=>{
      if(e.target.closest('[data-dgpush]')||e.target.closest('[data-dgdel]')) return;
      const [gid,ds,iid]=el.dataset.dgitem.split('|');
      const gl=gg.goals.find(x=>x.id===gid); if(!gl) return;
      const it=dgListFor(gl,ds).find(x=>x.id===iid); if(!it) return;
      it.done=!it.done; dgSync(gl,ds,todayStrF); reF();
    });
    body.querySelectorAll('[data-dgpush]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const [gid,ds,iid]=el.dataset.dgpush.split('|');
      const gl=gg.goals.find(x=>x.id===gid); if(!gl) return;
      const it=dgListFor(gl,ds).find(x=>x.id===iid); if(!it) return;
      it.done=true; dgSync(gl,ds,todayStrF); reF();
    });
    body.querySelectorAll('[data-dgdel]').forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const [gid,ds,iid]=el.dataset.dgdel.split('|');
      const gl=gg.goals.find(x=>x.id===gid); if(!gl) return;
      gl.days[ds]=dgListFor(gl,ds).filter(x=>x.id!==iid); dgSync(gl,ds,todayStrF); reF();
    });
    function dgAddF(gid,ds,val){
      const gl=gg.goals.find(x=>x.id===gid); if(!gl||!val.trim()) return;
      dgListFor(gl,ds).push({ id:'dg_'+Date.now(), text:val.trim(), done:false });
      dgSync(gl,ds,todayStrF); reF();
    }
    body.querySelectorAll('[data-dgaddbtn]').forEach(el=>el.onclick=()=>{
      const [gid,ds]=el.dataset.dgaddbtn.split('|');
      const inp=body.querySelector(`[data-dgadd="${gid}|${ds}"]`);
      if(inp) dgAddF(gid,ds,inp.value);
    });
    body.querySelectorAll('[data-dgadd]').forEach(el=>el.onkeydown=(e)=>{
      if(e.key==='Enter'){ const [gid,ds]=el.dataset.dgadd.split('|'); dgAddF(gid,ds,el.value); }
    });
    // авто-скрол до денного трекера, якщо прийшли тапом по назві цілі
    if(window.__openDayTrackerInFolder===key){
      window.__openDayTrackerInFolder=null;
      requestAnimationFrame(()=>{ const fg=document.getElementById('fldGoals');
        if(fg){ try{ fg.scrollIntoView({behavior:'smooth',block:'start'}); }catch(_){} } });
    }
  }

  function openWidgetPicker(key){
    const taken=widgetsForFolder(key);
    const avail=Object.keys(WIDGET_CATALOG).filter(id=>!taken.includes(id));
    const list=document.getElementById('wpkList');
    if(!avail.length){
      list.innerHTML=`<div class="fh-empty">Усі доступні віджети вже додані в цю папку.</div>`;
    } else {
      list.innerHTML=avail.map(id=>{
        const w=WIDGET_CATALOG[id];
        return `<div class="wpk-item" data-wpk="${id}">
          <div class="wpk-em">${w.emoji}</div>
          <div class="wpk-mid"><b>${w.t}</b><small>${w.d}</small></div>
          <div class="wpk-add">+</div></div>`;
      }).join('');
      list.querySelectorAll('[data-wpk]').forEach(b=>b.onclick=()=>{
        addWidgetToFolder(key, b.dataset.wpk);
        document.getElementById('wpkBack').classList.remove('on');
      });
    }
    document.getElementById('wpkTitle').textContent='Додати віджет · '+(folders[key]?folders[key].name:'');
    document.getElementById('wpkBack').classList.add('on');
  }

  function createCustomBoard(fkey){
    inputModal({ title:'Нова дошка', placeholder:'Назва дошки',
      onOk:(name)=>{
        const used=customBoards.length;
        const nm = name || ('Дошка '+(used+1));
        const key='cb_'+Date.now();
        customBoards.push({ key, label:nm, emoji:BOARD_EMOJIS[used % BOARD_EMOJIS.length],
          color:BOARD_COLORS[used % BOARD_COLORS.length], folder:fkey });
        boards[key]=[];
        saveCustomBoards(); saveBoard();
        goSpaceFor(key);
      }});
  }
  function delCustomBoard(key, fkey){
    const cb=customBoards.find(c=>c.key===key);
    if(!cb) return;
    confirmSheet({title:'Видалити дошку «'+cb.label+'»?', sub:'Разом з усіма блоками.', onOk:()=>{
    customBoards=customBoards.filter(c=>c.key!==key);
    delete boards[key];
    saveCustomBoards(); saveBoard();
    renderFolder(fkey);
    }});
  }
  function debtTotals(){
    const tot={};
    items.forEach(i=>{ const b=balance(i); if(!(b>0.0001)) return; const c=i.cur||'UAH'; if(!tot[c]) tot[c]={owe:0,owed:0}; tot[c][i.kind==='owe'?'owe':'owed']+=b; });
    return tot;
  }
  function debtSummary(){
    if(!items.length) return '—';
    const tot=debtTotals(), curs=Object.keys(tot);
    if(!curs.length) return '0 ₴';
    return curs.map(c=>{ const n=tot[c].owed-tot[c].owe; return (n>0?'+':'')+fmt(n)+' '+(CUR[c]||c); }).join(' · ');
  }

