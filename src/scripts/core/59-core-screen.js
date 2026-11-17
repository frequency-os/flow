  /* ════════ Екран «Ядро» — Сузір'я (59-core-screen.js, 17.11.2026) ════════
     Задум погоджено 17.11.2026 (prompts/frequency-core.md, етап 1; макети — у чаті):
       рівень 1 «Усе життя» — великі зірки = цілі (не архівні), головні більші;
       рівень 2 «Мета»      — ціль у центрі, довкола все привʼязане: кроки, гроші, час, папка, чати;
       рівень 3 «Вузол»     — шторка: значення + переходи в наявні екрани.
     Дані — лише з Core.graph() (57-core.js), який тільки читає. Цей екран НІЧОГО не записує:
     дії з даними (поповнити, повʼязати, створити) прийдуть з реєстром дій, етап 2.
     Поки за воротами розробника: вхід — «Ще → Розробка → Ядро» (29-more-screen.js). */
  (function(){
    const crLang=()=>{ try{ return (window.flowLang&&window.flowLang())==='en'?'en':'uk'; }catch(_){ return 'uk'; } };
    const CR_T={
      uk:{title:'Ядро', life:'Усе життя', back:'Ще', backLife:'Усе життя', me:'я', wait:'Звіряємо з хмарою…',
        emptyH:'Тут зʼявиться твоє сузірʼя', emptyP:'Кожна мета стане зіркою, а довкола неї — гроші, кроки, папки й час, що до неї ведуть.',
        emptyGo:'Поставити мету', hint:'Торкнись зірки, щоб наблизитись', more:'Ще цілі',
        steps:'кроки', money:'гроші', time:'час', folder:'папка', chats:'чати', link:'＋',
        nextH:'Наступний крок', noNext:'Кроків ще нема — додай перший на сторінці місії.', openGoal:'Відкрити місію',
        moneyH:'Гроші місії за місяць', moneySub:(i,o)=>'надійшло '+i+' · витрачено '+o, moneyWait:'Гаманець ще звіряється',
        openWallet:'Відкрити Гаманець', timeH:'Час за 7 днів', timeV:(b,d)=>d+' з '+b+' справ зроблено', timeNone:'Справ місії за тиждень нема',
        openJournal:'Відкрити тиждень у Журналі', stepsH:'Кроки місії', stepsV:(d,t)=>d+' з '+t,
        folderH:'Папка місії', folderNone:'не привʼязано', folderHow:'Папку привʼязують на сторінці місії.', openFolder:'Відкрити папку',
        chatsH:'Чати папки', openChat:n=>'Відкрити «'+n+'»', close:'Закрити', pct:'%', toGoal:'до мети',
        markDone:n=>'Позначити «'+n+'» зробленим', addOut:'＋ Витрата для мети', addIn:'＋ Дохід для мети',
        newFolder:'Створити папку для мети', folderPh:'Назва папки'},
      en:{title:'Core', life:'Whole life', back:'More', backLife:'Whole life', me:'me', wait:'Syncing with the cloud…',
        emptyH:'Your constellation will appear here', emptyP:'Each goal becomes a star, surrounded by the money, steps, folders and time that lead to it.',
        emptyGo:'Set a goal', hint:'Tap a star to zoom in', more:'More goals',
        steps:'steps', money:'money', time:'time', folder:'folder', chats:'chats', link:'＋',
        nextH:'Next step', noNext:'No steps yet — add the first one on the mission page.', openGoal:'Open mission',
        moneyH:'Mission money this month', moneySub:(i,o)=>'in '+i+' · out '+o, moneyWait:'Wallet is still syncing',
        openWallet:'Open Wallet', timeH:'Time over 7 days', timeV:(b,d)=>d+' of '+b+' tasks done', timeNone:'No mission tasks this week',
        openJournal:'Open the week in Journal', stepsH:'Mission steps', stepsV:(d,t)=>d+' of '+t,
        folderH:'Mission folder', folderNone:'not linked', folderHow:'Link a folder on the mission page.', openFolder:'Open folder',
        chatsH:'Folder chats', openChat:n=>'Open “'+n+'”', close:'Close', pct:'%', toGoal:'of the goal',
        markDone:n=>'Mark “'+n+'” done', addOut:'＋ Expense for this goal', addIn:'＋ Income for this goal',
        newFolder:'Create a folder for this goal', folderPh:'Folder name'}
    };
    const crT=k=>CR_T[crLang()][k];
    let crGoalId='';                       // '' — рівень «Усе життя», інакше — відкрита мета
    const CR_MAX=8;                        // більше зірок на 375 px — каша; решта — рядком нижче

    function crGoalObj(id){ return (goalsData.goals||[]).find(g=>g&&String(g.id)===String(id))||null; }
    function crMoney(n){ try{ return money(n); }catch(_){ return String(Math.round(n)); } }
    /* точка на колі навколо центру (50,50) у відсотках «неба» */
    function crAt(i,n,r,start){ const a=(start==null?-90:start)+360*i/Math.max(1,n); const rad=a*Math.PI/180;
      return {x:50+r*Math.cos(rad), y:50+r*Math.sin(rad)}; }
    function crLine(a,b,dash){ return '<line x1="'+a.x.toFixed(1)+'" y1="'+a.y.toFixed(1)+'" x2="'+b.x.toFixed(1)+'" y2="'+b.y.toFixed(1)+'"'+(dash?' class="dash"':'')+'/>'; }
    function crStar(o){   // o: {x,y,cls,act,id,c,big,small,label,aria}
      return '<button class="cr-star '+(o.cls||'')+'" style="left:'+o.x.toFixed(1)+'%;top:'+o.y.toFixed(1)+'%'+(o.c?';--c:'+o.c:'')+'"'
        +' data-cr="'+o.act+'"'+(o.id!=null?' data-id="'+esc(o.id)+'"':'')+' aria-label="'+esc(o.aria||'')+'">'
        +'<span class="cr-dot"><b>'+o.big+'</b>'+(o.small?'<small>'+o.small+'</small>':'')+'</span>'
        +(o.label?'<span class="cr-lab">'+o.label+'</span>':'')+'</button>';
    }

    function crLifeHTML(G){
      if(!G.goals.length) return '<div class="cr-empty"><h2>'+esc(crT('emptyH'))+'</h2><p>'+esc(crT('emptyP'))+'</p>'
        +'<button class="cr-pri" data-cr="newgoal">'+esc(crT('emptyGo'))+'</button></div>';
      const shown=G.goals.slice(0,CR_MAX), rest=G.goals.slice(CR_MAX), C={x:50,y:50};
      let lines='', stars='';
      shown.forEach((g,i)=>{
        const p=crAt(i,shown.length, i%2?36:31);
        lines+=crLine(C,p);
        stars+=crStar({x:p.x,y:p.y,cls:g.role==='main'?'lg':'md',act:'goal',id:g.id,c:g.color||'',
          big:esc(String(g.pct))+crT('pct'), label:esc(g.name||'—'), aria:g.name+' — '+g.pct+'%'});
      });
      const restHTML=rest.length?'<div class="cr-rest"><span class="cr-mu">'+esc(crT('more'))+'</span>'
        +rest.map(g=>'<button class="cr-chip" data-cr="goal" data-id="'+esc(g.id)+'">'+esc(g.name||'—')+' · '+g.pct+'%</button>').join('')+'</div>':'';
      return '<div class="cr-sky"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'+lines+'</svg>'
        +'<div class="cr-me" style="left:50%;top:50%">'+esc(crT('me'))+'</div>'+stars+'</div>'
        +'<p class="cr-hint">'+esc(crT('hint'))+'</p>'+restHTML;
    }

    function crGoalHTML(g){
      const L=g.links||{}, C={x:50,y:50}, nodes=[];
      const st=L.steps||{done:0,total:0};
      nodes.push({act:'steps', cls:'k-steps', big:st.total?st.done+'/'+st.total:crT('link'), label:crT('steps'), empty:!st.total});
      const m=L.money;
      if(m) nodes.push({act:'money', cls:'k-money', big:m.ready?esc(crMoney(m.net)):'…', label:crT('money'), empty:!(m.inc||m.out),
        aria:crT('money')+': '+(m.ready?crMoney(m.net):'…')});
      const t=L.time||{blocks:0,done:0};
      nodes.push({act:'time', cls:'k-time', big:t.blocks?t.done+'/'+t.blocks:'0', label:crT('time'), empty:!t.blocks});
      nodes.push({act:'folder', cls:'k-folder', big:L.folder?(esc(L.folder.emoji.slice(0,4))||'▢'):crT('link'), label:L.folder?esc(L.folder.name||crT('folder')):crT('folder'), empty:!L.folder,
        aria:crT('folder')+': '+(L.folder?(L.folder.name||'—'):crT('folderNone'))});
      if(L.folder) nodes.push({act:'chats', cls:'k-chats', big:String((L.chats||[]).length), label:crT('chats'), empty:!(L.chats||[]).length});
      let lines='', stars='';
      nodes.forEach((n,i)=>{ const p=crAt(i,nodes.length, 36, -126); lines+=crLine(C,p,n.empty);
        stars+=crStar({x:p.x,y:p.y,cls:'sm '+n.cls+(n.empty?' empty':''),act:n.act,big:n.big,label:n.label,aria:n.aria||(n.label+': '+n.big)}); });   // aria — сирий текст: crStar сам екранує (інакше «&amp;» вголос)
      stars+=crStar({x:50,y:50,cls:'xl',act:'mission',c:g.color||'',big:esc(String(g.pct))+crT('pct'),small:esc(crT('toGoal')),aria:g.name+' — '+g.pct+'%'});
      const nx=st.next?'<b>'+esc(st.next)+'</b>':'<span class="cr-mu">'+esc(crT('noNext'))+'</span>';
      return '<div class="cr-sky"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'+lines+'</svg>'+stars+'</div>'
        +'<div class="cr-card"><small>'+esc(crT('nextH'))+'</small>'+nx
        +'<button class="cr-sec" data-cr="mission">'+esc(crT('openGoal'))+'</button></div>';
    }

    function crRender(){
      const body=document.getElementById('crBody'), ttl=document.getElementById('crTitle'), bk=document.getElementById('crBack');
      if(!body) return;
      let G=null; try{ G=window.Core.graph(); }catch(e){ console.error('Core.graph',e); }
      const g=crGoalId&&G?G.goals.find(x=>x.id===crGoalId):null;
      if(crGoalId&&!g) crGoalId='';        // мету видалили чи заархівували — назад до неба
      if(ttl) ttl.textContent=g?(g.name||'—'):crT('title');
      if(bk) bk.textContent='‹ '+(g?crT('backLife'):crT('back'));
      if(!G||!G.ready){ body.innerHTML='<p class="cr-wait">'+esc(crT('wait'))+'</p>'; return; }
      body.innerHTML=g?crGoalHTML(g):crLifeHTML(G);
      body.querySelectorAll('[data-cr]').forEach(b=>b.addEventListener('click',()=>crAct(b.dataset.cr,b.dataset.id,b)));
    }

    function crAct(act,id,btn){
      try{ window.platform.haptic('light'); }catch(_){}
      if(act==='goal'){ crGoalId=String(id||''); crRender(); try{ document.body.scrollTop=0; }catch(_){} return; }
      if(act==='newgoal'){ crGo(()=>goJournal({tab:'year'})); return; }
      const raw=crGoalObj(crGoalId); if(!raw) return;
      if(act==='mission'){ crGo(()=>moMissionPage(raw)); return; }
      let G=null; try{ G=window.Core.graph(); }catch(_){}
      const g=G&&G.goals.find(x=>x.id===crGoalId); if(!g) return;
      crSheet(act,g,raw,btn);
    }
    function crGo(fn){ try{ fn(); }catch(e){ console.error('core: перехід',e); } }

    /* ── рівень 3: шторка вузла. Лише показ і переходи — записів нема ── */
    function crSheet(kind,g,raw,from){
      const L=g.links||{}; let h='', v='', sub='', acts=[];
      if(kind==='steps'){ const s=L.steps||{}; h=crT('stepsH'); v=s.total?crT('stepsV')(s.done,s.total):'—'; sub=s.next||crT('noNext');
        acts=[[crT('openGoal'),()=>moMissionPage(raw)]];
        // дії з даними — лише через реєстр (60-core-actions.js): ready → перевірка → запис → «Скасувати»
        if(s.nextId) acts.unshift([crT('markDone')(s.next),()=>window.Core.run('step.done',{goalId:g.id, stepId:s.nextId}),'do']); }
      else if(kind==='money'){ const m=L.money||{}; h=crT('moneyH');
        v=m.ready?crMoney(m.net):'…'; sub=m.ready?crT('moneySub')(crMoney(m.inc),crMoney(m.out)):crT('moneyWait');
        // шторка Гаманця з уже вибраною місією; її запис іде через Core.run (46-wallet.js)
        acts=[[crT('addOut'),()=>wlOpSheet('out',g.id),'do'],[crT('addIn'),()=>wlOpSheet('in',g.id),'do'],[crT('openWallet'),()=>goFinance()]]; }
      else if(kind==='time'){ const t=L.time||{}; h=crT('timeH'); v=t.blocks?crT('timeV')(t.blocks,t.done):crT('timeNone');
        acts=[[crT('openJournal'),()=>goJournal({tab:'week'})]]; }
      else if(kind==='folder'){ h=crT('folderH');
        if(L.folder){ v=L.folder.name||'—'; const fk=L.folder.key; acts=[[crT('openFolder'),()=>goFolder(fk)]]; }
        else { v=crT('folderNone'); sub=crT('folderHow');
          acts=[[crT('newFolder'),()=>inputModal({title:crT('newFolder'), value:String(g.name||'').slice(0,60), placeholder:crT('folderPh'), emoji:true,
              emojiVal:String(raw.emoji||''), emojiPh:'📁', onOk:(name,em)=>window.Core.run('folder.create',{name, emoji:em, goalId:g.id})}),'do'],
            [crT('openGoal'),()=>moMissionPage(raw)]]; } }
      else if(kind==='chats'){ h=crT('chatsH'); v=String((L.chats||[]).length);
        acts=(L.chats||[]).slice(0,4).map(c=>[crT('openChat')(c.name||'—'),()=>goChat(c.id)]); }
      else return;

      const old=document.querySelector('.cr-ov'); if(old) old.remove();
      const ov=document.createElement('div'); ov.className='cr-ov'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
      ov.setAttribute('aria-label',h);
      ov.innerHTML='<div class="cr-sheet"><div class="cr-grip"></div>'
        +'<div class="cr-sh-top"><h2>'+esc(h)+'</h2><button class="cr-x" aria-label="'+esc(crT('close'))+'">✕</button></div>'
        +'<div class="cr-sh-v">'+esc(v)+'</div>'+(sub?'<p class="cr-sh-sub">'+esc(sub)+'</p>':'')
        +acts.map((a,i)=>'<button class="cr-act'+(a[2]==='do'?' do':'')+'" data-i="'+i+'">'+esc(a[0])+(a[2]==='do'?'':'<span aria-hidden="true">›</span>')+'</button>').join('')
        +'</div>';
      document.body.appendChild(ov);
      let done=false;
      const close=()=>{ if(done) return; done=true; document.removeEventListener('keydown',key); ov.classList.remove('show');
        setTimeout(()=>{ try{ ov.remove(); }catch(_){} },200); try{ if(from&&from.isConnected) from.focus(); }catch(_){} };
      const key=e=>{ if(e.key==='Escape') close(); };
      document.addEventListener('keydown',key);
      ov.addEventListener('click',e=>{ if(e.target===ov) close(); });
      ov.querySelector('.cr-x').onclick=close;
      ov.querySelectorAll('.cr-act').forEach(b=>b.onclick=()=>{ const a=acts[+b.dataset.i]; close(); if(a) crGo(a[1]); });
      requestAnimationFrame(()=>{ ov.classList.add('show'); const f=ov.querySelector('.cr-act')||ov.querySelector('.cr-x'); try{ f.focus(); }catch(_){} });
    }

    function goCore(){ crGoalId=''; crRender(); show('scr-core'); try{ document.body.scrollTop=0; }catch(_){} }
    { const bk=document.getElementById('crBack'); if(bk) bk.onclick=()=>{
        if(crGoalId){ crGoalId=''; crRender(); return; }
        if(window.goMore) window.goMore(); else show('scr-home'); }; }
    // дані підтягнулись з хмари чи змінилась мова — якщо Ядро відкрите, перемальовуємо
    const crLive=()=>{ const s=document.getElementById('scr-core'); if(s&&s.classList.contains('active')) crRender(); };
    try{ document.addEventListener('flowsync',crLive); document.addEventListener('flowlangchange',crLive); }catch(_){}
    // записали чи скасували через реєстр — небо одразу інше. Подією, а не Core.onChange:
    // реєстр (60-…) виконується ПІСЛЯ цього файла, тож у цю мить Core.onChange ще нема
    try{ document.addEventListener('flowcorechange',crLive); }catch(_){}
    window.goCore=goCore;
  })();
