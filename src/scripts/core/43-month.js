  /* ════════ Журнал · Місяць (43-month.js, етап 7, 09.10.2026) ════════
     Вкладка «Місяць» у Журналі: картки місій (рік по кварталах + рівні місяця), гроші місяця
     (дві цілі людини проти факту з Гаманця), календар днів. Тап по картці — сторінка місії
     (Шлях · Папка · Чати). Цілі грошей — goalsData.hero.money['YYYY-MM']={earn,spend}, лише після «Зберегти».
     Новий ключ сховища не потрібен; рендер нічого не пише. */

  const moState={ym:''};
  const MO_NAMES=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
  const MO_SHORT=['Січ','Лют','Бер','Кві','Тра','Чер','Лип','Сер','Вер','Жов','Лис','Гру'];
  const MO_Q=['I','II','III','IV'];

  function moYm(){ if(!/^\d{4}-\d{2}$/.test(moState.ym)) moState.ym=ymdLocal().slice(0,7); return moState.ym; }
  function moShift(ym,n){ let y=+ym.slice(0,4), m=+ym.slice(5,7)+n; while(m<1){ m+=12; y--; } while(m>12){ m-=12; y++; } return y+'-'+String(m).padStart(2,'0'); }
  function moDim(ym){ return new Date(+ym.slice(0,4), +ym.slice(5,7), 0).getDate(); }
  function moQ(ym){ return Math.floor((+ym.slice(5,7)-1)/3); }
  function moTitle(ym){ return MO_NAMES[+ym.slice(5,7)-1]+(ym.slice(0,4)!==ymdLocal().slice(0,4)?' '+ym.slice(0,4):''); }
  function moMoney(n){ return '₴'+Math.round(+n||0).toLocaleString('uk-UA'); }
  // частка місяця, що минула: для риски на смужках грошей
  function moPassed(ym){ const td=ymdLocal(), cur=td.slice(0,7); if(ym<cur) return 1; if(ym>cur) return 0; return (+td.slice(8))/moDim(ym); }
  function moLate(m,ym){ if(m.done) return false; const td=ymdLocal(); if(m.due) return m.due<td; return ym<td.slice(0,7); }
  function moMissions(){ return (goalsData.goals||[]).filter(g=>g&&g.id&&jnStatus(g)!=='archive'&&jnRole(g)!=='wait')
    .sort((a,b)=>(jnRole(a)==='main'?0:1)-(jnRole(b)==='main'?0:1)); }

  function moQuarters(gl,year){
    const lv=jnLevels(gl).filter(m=>m.ym.slice(0,4)===year);
    return [0,1,2,3].map(q=>{ const L=lv.filter(m=>moQ(m.ym)===q); return {n:L.length, done:L.filter(m=>m.done).length}; });
  }
  function moCard(gl,ym){
    const c=safeColor(gl.color,'#3ec7b4'), qs=moQuarters(gl,ym.slice(0,4)), cq=moQ(ym);
    const mlv=jnLevels(gl).filter(m=>m.ym===ym);
    const path=(gl.from||gl.to)?esc(gl.from||'?')+' → '+esc(gl.to||'?')+' · ':'';
    return `<button class="mo-c" data-mom="${esc(gl.id)}" style="--c:${c}">
      <span class="mo-c-t"><span class="mo-c-em">${safeEmoji(gl.emoji,'🎯')}</span>
        <span class="mo-c-n"><b>${esc(gl.name||'Місія')}</b><small>${path}${jnPct(gl)}%${jnRole(gl)==='main'?' · головна':''}</small></span><span class="mo-c-go" aria-hidden="true">›</span></span>
      <span class="mo-qs">${qs.map((q,i)=>`<span class="${i===cq?'cur':''}"><i style="width:${q.n?Math.round(q.done/q.n*100):0}%"></i></span>`).join('')}</span>
      <span class="mo-ql">${MO_Q.map((q,i)=>`<span class="${i===cq?'on':''}">${q} кв</span>`).join('')}</span>
      <span class="mo-lv">${mlv.length?mlv.map(m=>`<span class="${m.done?'ok':moLate(m,ym)?'late':''}">${m.done?'✓ ':''}${esc(m.t)}${!m.done&&m.due?' · '+jnDateTxt(m.due):''}</span>`).join('')
        :'<span class="none">рівнів на цей місяць нема</span>'}</span>
    </button>`;
  }
  function moMoneyHTML(ym){
    const h=jnHero(), g=(h.money&&typeof h.money==='object'&&h.money[ym])||null;
    const ops=(()=>{ try{ return walletOps().filter(o=>o&&String(o.date||'').slice(0,7)===ym&&!String(o.id||'').startsWith('start_')); }catch(_){ return []; } })();
    const inc=ops.filter(o=>o.type==='in').reduce((s,o)=>s+(+o.amount||0),0), out=ops.filter(o=>o.type==='out').reduce((s,o)=>s+(+o.amount||0),0);
    const mark=Math.round(moPassed(ym)*100);
    const bar=(val,goal,cls)=>`<span class="mo-bar ${cls}"><i style="width:${goal>0?Math.min(100,Math.round(val/goal*100)):0}%"></i>${goal>0&&mark>0&&mark<100?`<s style="left:${mark}%"></s>`:''}</span>`;
    if(!g||!(+g.earn>0||+g.spend>0)) return `<div class="mo-card"><div class="mo-h"><span>Гроші · ${esc(MO_NAMES[+ym.slice(5,7)-1].toLowerCase())}</span></div>
      <div class="mo-fact"><span>Зароблено <b>${moMoney(inc)}</b></span><span>Витрачено <b>${moMoney(out)}</b></span></div>
      <button class="mo-set" data-moset>Задати цілі місяця</button></div>`;
    const earn=+g.earn||0, spend=+g.spend||0;
    return `<div class="mo-card"><div class="mo-h"><span>Гроші · ${esc(MO_NAMES[+ym.slice(5,7)-1].toLowerCase())}</span><button data-moset>змінити</button></div>
      ${earn?`<div class="mo-m"><span class="mo-m-r"><span>Заробити</span><span>${moMoney(inc)} / ${moMoney(earn)}</span></span>${bar(inc,earn,'in')}</div>`:''}
      ${spend?`<div class="mo-m"><span class="mo-m-r"><span>Витратити не більше</span><span>${moMoney(out)} / ${moMoney(spend)}</span></span>${bar(out,spend,out>spend?'over':'out')}</div>`:''}
      ${mark>0&&mark<100?`<small class="mo-note">риска — скільки місяця минуло (${mark}%)</small>`:''}</div>`;
  }
  function moCalHTML(ym){
    const td=ymdLocal(), first=new Date(ym+'-01T12:00:00'), lead=(first.getDay()+6)%7, dim=moDim(ym);
    const days=[]; for(let d=1;d<=dim;d++) days.push(ym+'-'+String(d).padStart(2,'0'));
    const hrs=days.map(ds=>{ let bl=[]; try{ bl=plBlocksDisplay(ds); }catch(_){} return {ds, h:bl.reduce((s,b)=>s+dyHrs(b),0), cols:[...new Set(bl.map(b=>dyColor(b)).filter(Boolean))].slice(0,3)}; });
    const max=Math.max(1,...hrs.map(x=>x.h));
    return `<div class="mo-card"><div class="mo-h"><span>Дні</span><span class="mo-hint">тап — відкрити день</span></div>
      <div class="mo-cal">${DY_DOW.map(d=>`<b>${d}</b>`).join('')}${'<span class="e"></span>'.repeat(lead)}
      ${hrs.map(x=>{ const lvl=x.h?Math.min(3,1+Math.floor(x.h/max*2.999)):0;
        return `<button class="mo-d${x.ds===td?' td':''}${x.ds>td?' fut':''} h${lvl}" data-moday="${x.ds}" aria-label="${+x.ds.slice(8)} ${JN_MON[+ym.slice(5,7)-1]}${x.h?', '+dyNum(x.h)+' год':''}">${+x.ds.slice(8)}<i>${x.cols.map(c=>`<u style="background:${c}"></u>`).join('')}</i></button>`; }).join('')}</div></div>`;
  }
  function moMonthHTML(){
    const ym=moYm(), ms=moMissions(), cur=ymdLocal().slice(0,7);
    const lv=ms.reduce((a,g)=>a.concat(jnLevels(g).filter(m=>m.ym===ym)),[]);
    const dayTxt=ym===cur?'день '+(+ymdLocal().slice(8))+' з '+moDim(ym):(ym<cur?'минулий місяць':'наступний місяць');
    return `<div class="mo-nav"><button data-moshift="-1" aria-label="Попередній місяць">‹</button>
        <div><b>${esc(moTitle(ym))}</b><small>${dayTxt}${lv.length?' · '+lv.filter(m=>m.done).length+' з '+lv.length+' рівнів':''}</small>${ym!==cur?'<button class="mo-now" data-mothis>Цей місяць</button>':''}</div>
        <button data-moshift="1" aria-label="Наступний місяць">›</button></div>
      ${ms.length?ms.map(g=>moCard(g,ym)).join(''):`<div class="dy-empty"><b>Ще нема місій</b><span>Створи місію в Журналі — тут зʼявиться її шлях по кварталах і рівні місяця.</span></div>`}
      ${moMoneyHTML(ym)}
      ${moCalHTML(ym)}
      <div class="jn-pad"></div>`;
  }
  function moBind(c,opt){
    c.querySelectorAll('[data-moshift]').forEach(b=>b.onclick=()=>{ moState.ym=moShift(moYm(),+b.dataset.moshift); jnRender(); });
    { const t=c.querySelector('[data-mothis]'); if(t) t.onclick=()=>{ moState.ym=''; jnRender(); }; }
    c.querySelectorAll('[data-mom]').forEach(b=>b.onclick=()=>{ const g=(goalsData.goals||[]).find(x=>String(x.id)===b.dataset.mom); if(g) moMissionPage(g,'path'); });
    c.querySelectorAll('[data-moset]').forEach(b=>b.onclick=()=>moMoneySheet(moYm()));
    c.querySelectorAll('[data-moday]').forEach(b=>b.onclick=()=>{ if(opt&&opt.onOpenDay) opt.onOpenDay(b.dataset.moday); });
  }

  // цілі грошей місяця — пишуться лише кнопкою «Зберегти»; порожні поля = ціль не задано
  function moMoneySheet(ym){
    const h=jnHero(), g=(h.money&&h.money[ym])||{};
    jnOverlay(`<div class="jn-ed-h"><b>Гроші · ${esc(moTitle(ym).toLowerCase())}</b><button data-jnx aria-label="Закрити">✕</button></div>
      <small class="dy-fm-sub">Скільки хочеш заробити і скільки готовий витратити цього місяця. Факт рахується із записів Гаманця.</small>
      <label class="jn-f"><span>Заробити, ₴</span><input id="moEarn" type="number" inputmode="numeric" min="0" step="100" value="${+g.earn>0?+g.earn:''}" placeholder="Напр. 30000"></label>
      <label class="jn-f"><span>Витратити не більше, ₴</span><input id="moSpend" type="number" inputmode="numeric" min="0" step="100" value="${+g.spend>0?+g.spend:''}" placeholder="Напр. 15000"></label>
      <div class="jn-ed-foot"><button class="jn-btn" data-mosave>Зберегти</button></div>`, ov=>{
      ov.querySelector('[data-mosave]').onclick=()=>{
        const e=Math.max(0,Math.round(+ov.querySelector('#moEarn').value||0)), s=Math.max(0,Math.round(+ov.querySelector('#moSpend').value||0));
        const hh=jnHero(); if(!hh.money||typeof hh.money!=='object'||Array.isArray(hh.money)) hh.money={};   // масив із хмари мовчки загубив би ключ місяця
        if(e||s) hh.money[ym]={earn:e, spend:s}; else delete hh.money[ym];
        saveGoals(); ov.remove(); jnRender();
      };
    });
  }

  /* ── Сторінка місії: шапка в кольорі місії, вкладки Шлях · Папка · Чати ── */
  function moMissionPage(gl,tab){
    const old=document.querySelector('.mo-mp'); if(old) old.remove();
    const ov=document.createElement('div'); ov.className='mo-mp'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    document.body.appendChild(ov);
    const draw=()=>{
      const g=(goalsData.goals||[]).find(x=>String(x.id)===String(gl.id)); if(!g){ ov.remove(); return; }
      const c=safeColor(g.color,'#3ec7b4'), pct=jnPct(g), fk=g.folderKey&&typeof folders!=='undefined'&&folders[g.folderKey]?g.folderKey:'';
      let chats=[]; try{ if(fk&&window.chatsForFolder) chats=window.chatsForFolder(fk); }catch(_){}
      ov.style.setProperty('--c',c);
      ov.innerHTML=`<div class="mo-mp-in">
        <div class="mo-mp-top"><button data-mpx>‹ Назад</button><button data-mped>Редагувати</button></div>
        <div class="mo-mp-hero"><span class="mo-mp-em">${safeEmoji(g.emoji,'🎯')}</span>
          <small>${jnRole(g)==='main'?'головна місія':'місія'}${g.to?' · мета: '+esc(g.to):''}</small><b>${esc(g.name||'Місія')}</b>
          <span class="mo-mp-p"><span>${pct}%</span><i><u style="width:${pct}%"></u></i><span>${(g.from||g.to)?esc(g.from||'?')+' → '+esc(g.to||'?'):''}</span></span></div>
        <div class="mo-tabs" role="tablist">${[['path','Шлях'],['folder','Папка'],['chats','Чати'+(chats.length?' · '+chats.length:'')]].map(([k,l])=>`<button role="tab" data-mptab="${k}"${tab===k?' class="on" aria-selected="true"':''}>${l}</button>`).join('')}</div>
        <div class="mo-mp-body">${tab==='folder'?moFolderTab(g,fk):tab==='chats'?moChatsTab(g,fk,chats):moPathTab(g)}</div>
      </div>`;
      ov.querySelector('[data-mpx]').onclick=()=>ov.remove();
      ov.querySelector('[data-mped]').onclick=()=>{ ov.remove(); jnEditor(g); };
      ov.querySelectorAll('[data-mptab]').forEach(b=>b.onclick=()=>{ tab=b.dataset.mptab; draw(); });
      ov.querySelectorAll('[data-mpfolder]').forEach(b=>b.onclick=()=>{ ov.remove(); try{ goFolder(fk); }catch(_){} });
      ov.querySelectorAll('[data-mpchat]').forEach(b=>b.onclick=()=>{ ov.remove(); try{ goChat(b.dataset.mpchat); }catch(_){} });
      ov.querySelectorAll('[data-mplv]').forEach(b=>b.onclick=()=>{ ov.remove(); jnEditor(g); });
    };
    draw();
  }
  // Шлях: роки рівнів → квартали; поточний квартал розкладено по місяцях
  function moPathTab(g){
    const lv=jnLevels(g), cur=ymdLocal().slice(0,7);
    if(!lv.length) return `<div class="dy-empty"><b>Рівнів ще нема</b><span>Розбий місію на рівні з датами — вони стануть шляхом по кварталах і місяцях.</span></div>
      <button class="mo-set" data-mplv>＋ Додати рівні</button>`;
    const years=[...new Set(lv.map(m=>m.ym.slice(0,4)).concat([cur.slice(0,4)]))].sort();
    let h='<div class="mo-tl">';
    years.forEach(y=>{
      h+=`<div class="mo-y">${y}</div>`;
      [0,1,2,3].forEach(q=>{
        const L=lv.filter(m=>m.ym.slice(0,4)===y&&moQ(m.ym)===q);
        const isCur=y===cur.slice(0,4)&&q===moQ(cur), past=(y+'-'+String(q*3+3).padStart(2,'0'))<cur;
        if(!L.length&&!isCur) return;
        const done=L.length&&L.every(m=>m.done);
        h+=`<div class="mo-tq${done?' done':''}${isCur?' cur':''}"><div class="mo-tq-h"><b>${MO_Q[q]} квартал</b><small>${L.length?L.filter(m=>m.done).length+' з '+L.length:'рівнів нема'}${isCur?' · зараз':past&&!done&&L.length?' · не завершено':''}</small></div>`;
        if(isCur){
          h+='<div class="mo-tm">'+[0,1,2].map(i=>{ const ym=y+'-'+String(q*3+1+i).padStart(2,'0'), ML=L.filter(m=>m.ym===ym);
            return `<div class="mo-tm-r${ym===cur?' now':''}"><span>${MO_SHORT[q*3+i]}</span><span class="mo-lv">${ML.length?ML.map(m=>`<span class="${m.done?'ok':moLate(m,ym)?'late':''}">${m.done?'✓ ':''}${esc(m.t)}</span>`).join(''):'<span class="none">—</span>'}</span></div>`; }).join('')+'</div>';
        } else if(L.length){
          h+=`<div class="mo-lv">${L.map(m=>`<span class="${m.done?'ok':moLate(m,m.ym)?'late':''}">${m.done?'✓ ':''}${esc(m.t)}</span>`).join('')}</div>`;
        }
        h+='</div>';
      });
    });
    return h+`</div><button class="mo-set" data-mplv>＋ Рівень або змінити шлях</button>`;
  }
  function moFolderTab(g,fk){
    if(!fk) return `<div class="dy-empty"><b>Папки місії ще нема</b><span>Тут будуть трекер місяця, нотатки й бачення цієї місії. Створення папки місії — наступний крок.</span></div>`;
    const f=folders[fk];
    return `<button class="mo-fl" data-mpfolder><span class="mo-fl-em">${safeEmoji(f.emoji,'📁')}</span><span><b>${esc(f.name||'Папка')}</b><small>папка місії · трекери, нотатки, документи</small></span><i>›</i></button>
      <small class="mo-note">Вміст папки прямо тут (трекер місяця, нотатки, бачення) — наступний крок.</small>`;
  }
  function moChatsTab(g,fk,chats){
    if(!fk) return `<div class="dy-empty"><b>Чатів місії ще нема</b><span>Чати привʼязуються до папки місії. Коли зʼявиться папка, тут будуть її чати.</span></div>`;
    if(!chats.length) return `<div class="dy-empty"><b>Чатів ще нема</b><span>Привʼяжи чат до папки «${esc((folders[fk]&&folders[fk].name)||'')}» — він зʼявиться тут.</span></div>
      <button class="mo-set" data-mpfolder>Відкрити папку</button>`;
    return chats.map(ch=>`<button class="mo-fl" data-mpchat="${esc(ch.id)}"><span class="mo-fl-em">${safeEmoji(ch.emoji,'💬')}</span><span><b>${esc(ch.name||'Чат')}</b><small>чат папки місії</small></span><i>›</i></button>`).join('');
  }
