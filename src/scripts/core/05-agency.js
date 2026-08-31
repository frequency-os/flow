  /* ============ AGENCY DASHBOARD (окремий екран, як «Робота») ============ */
  const AGENCY_KEY='f_agsk_seed';
  let agencyOrigin='';
  let agTab='home';
  function agBoard(){ return Array.isArray(boards[AGENCY_KEY])?boards[AGENCY_KEY]:[]; }
  function agFindType(type){ return agBoard().find(b=>b&&b.type===type); }
  function agFindAll(type){ return agBoard().filter(b=>b&&b.type===type); }
  function agProjBlock(){ return agBoard().find(b=>b&&b.type==='project'); }

  function goAgency(){
    // 🕶️ Агенція — лише за кодом доступу (Vault)
    if(!vaultOpen){ vaultPinSheet((vaultCfg&&vaultCfg.h)?'unlock':'setup', ()=>goAgency()); return; }
    agencyOrigin=currentFolderKey||AGENCY_KEY;
    if(!Array.isArray(boards[AGENCY_KEY])){ try{ seedAgencySlovakia(); }catch(_){} }
    renderAgency(); show('scr-agency'); setTimeout(agMovePill,60); try{agEnterFx();}catch(_){}
  }

  function renderAgency(){
    try{ renderAgHome(); }catch(_){} try{ renderAgPartners(); }catch(_){} renderAgFin(); renderAgCli(); try{ renderAgDocs(); }catch(_){} renderAgMkt(); renderAgOps();
    // active pane
    document.querySelectorAll('#agTabs .ag-tab').forEach(t=>t.classList.toggle('on', t.dataset.agp===agTab));
    document.querySelectorAll('#scr-agency .ag-pane').forEach(p=>p.classList.toggle('on', p.dataset.agpane===agTab));
    agMovePill();
  }
  function agEnterFx(){ try{ const p=document.querySelector('#scr-agency .ag-pane.on'); if(!p)return;
    p.classList.remove('ag-enter'); void p.offsetWidth; p.classList.add('ag-enter');
    setTimeout(()=>{ try{p.classList.remove('ag-enter');}catch(_){} },800); }catch(_){} }
  function agMovePill(){
    const seg=document.getElementById('agTabs'); const pill=document.getElementById('agSegPill');
    const on=seg&&seg.querySelector('.ag-tab.on'); if(!seg||!pill||!on) return;
    const r=on.getBoundingClientRect(), sr=seg.getBoundingClientRect();
    pill.style.left=(r.left-sr.left+seg.scrollLeft)+'px'; pill.style.width=r.width+'px';
    try{ on.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}); }catch(_){}
  }


  /* ============ AGENCY OVERVIEW (Огляд: кільця + стрічка дій) ============ */
  function agRing(pct, color, label){
    const p=Math.max(0,Math.min(100,Math.round(pct)));
    const C=2*Math.PI*15.5; const off=C*(1-p/100);
    return `<div class="ag-ring"><div class="ag-ringwrap">
      <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--field)" stroke-width="4"/>
      <circle cx="18" cy="18" r="15.5" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg>
      <div class="rv">${p}%</div></div><div class="rlbl">${esc(label)}</div></div>`;
  }

  // зібрати найтерміновіші дії по всіх клієнтах
  function agTodayItems(){
    const items=[];
    agClients().forEach(c=>{
      if(c.stage==='Готово') return;
      const owe=agClientOwe(c); const [dd,dt]=agClientDocsDone(c);
      let dLeft=null; if(c.deadline){ dLeft=Math.ceil((new Date(c.deadline)-new Date())/864e5); }
      // пріоритет: прострочений дедлайн > борг+близький дедлайн > борг > документи > заявка
      let pr=5, color='var(--accent)', sub=[];
      if(owe>0){ sub.push('борг '+fmt(owe)+'€'); pr=Math.min(pr,2); color='var(--owe)'; }
      if(dt>0 && dd<dt){ sub.push('документи '+dd+'/'+dt); pr=Math.min(pr,3); if(owe<=0)color='var(--warn)'; }
      if(c.stage==='Заявка'){ sub.push('нова заявка'); pr=Math.min(pr,4); if(owe<=0&&!(dt>0&&dd<dt))color='var(--accent)'; }
      if(dLeft!=null){ if(dLeft<0){ sub.unshift('прострочено '+(-dLeft)+'дн'); pr=Math.min(pr,1); color='var(--owe)'; }
        else if(dLeft<=7){ sub.push('дедлайн '+dLeft+'дн'); pr=Math.min(pr,2); } }
      if(sub.length===0) return; // нема що робити
      items.push({ c, pr, color, label:agClientNext(c), sub:sub.join(' · ') });
    });
    items.sort((a,b)=>a.pr-b.pr);
    return items;
  }

  const AG_STG_COLORS={'Заявка':'#8a93a8','Консультація':'#5b8def','Оплата':'#f0b429','В роботі':'#6a7dff','Подано':'#c77dff','Готово':'#34c77b'};
  function agMonthsBack(n){
    const M=['Січ','Лют','Бер','Кві','Тра','Чер','Лип','Сер','Вер','Жов','Лис','Гру'];
    const out=[]; const now=new Date();
    for(let i=n-1;i>=0;i--){ const d=new Date(now.getFullYear(), now.getMonth()-i, 1);
      out.push({k:d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'), lbl:M[d.getMonth()]}); }
    return out;
  }
  function agAdvanceStage(c){
    const i=AG_STAGES.indexOf(c.stage);
    if(i>=0 && i<AG_STAGES.length-1){ c.stage=AG_STAGES[i+1];
      if(c.stage==='Подано'&&!c.submitted)c.submitted=ymdLocal();
      saveBoard(); renderAgency(); try{window.platform.haptic('select');}catch(_){} }
  }

  function renderAgHome(){
    const el=document.getElementById('agPaneHome'); if(!el) return;
    const clients=agClients();
    // ── здоров'я ──
    let docD=0, docT=0, paidSum=0, totSum=0;
    clients.forEach(c=>{ const [d,t]=agClientDocsDone(c); docD+=d; docT+=t; paidSum+=agClientPaid(c); totSum+=(+c.total||0); });
    const docPct = docT? docD/docT*100 : 0;
    const payPct = totSum? paidSum/totSum*100 : 0;
    const funPct = clients.length? (clients.filter(c=>['В роботі','Подано','Готово'].includes(c.stage)).length/clients.length*100) : 0;
    // ── фінанси коротко ──
    const proj=agProjBlock();
    const ops=proj?(proj.ops||[]):[];
    const inc = ops.filter(o=>o.t==='in').reduce((s,o)=>s+(+o.amount||0),0);
    const exp = ops.filter(o=>o.t==='out').reduce((s,o)=>s+(+o.amount||0),0);
    const bal = inc-exp;
    const oweTotal = clients.reduce((s,c)=>s+agClientOwe(c),0);
    // ── дохід по місяцях (спарклайн + тренд) ──
    const months=agMonthsBack(6);
    const byM={}; months.forEach(m=>byM[m.k]=0);
    ops.forEach(o=>{ if(o.t==='in'){ const k=String(o.date||'').slice(0,7); if(k in byM) byM[k]+=(+o.amount||0); } });
    const maxM=Math.max(1,...months.map(m=>byM[m.k]));
    const nowK=months[months.length-1].k, prevK=months[months.length-2].k;
    const dInc=byM[nowK]-byM[prevK];
    const trendHtml=(byM[nowK]>0||byM[prevK]>0)
      ? `<span class="ag-trend ${dInc<0?'dn':''}">${dInc>=0?'↑':'↓'} ${fmt(Math.abs(dInc))}€ vs мин. міс</span>` : '';
    const sparkHtml=months.map(m=>{
      const h=byM[m.k]>0?Math.max(10,Math.round(byM[m.k]/maxM*100)):5;
      return `<div class="sb ${m.k===nowK?'now':''}" title="${fmt(byM[m.k])}€"><i style="height:${h}%"></i><b>${m.lbl}</b></div>`;
    }).join('');
    // ── воронка по етапах ──
    const stgCounts=AG_STAGES.map(s=>({s, n:clients.filter(c=>c.stage===s).length}));
    const totCl=clients.length||1;
    const funBar=stgCounts.filter(x=>x.n>0).map(x=>`<i style="width:${(x.n/totCl*100).toFixed(1)}%;background:${AG_STG_COLORS[x.s]||'var(--accent)'}"></i>`).join('');
    const funLeg=stgCounts.map(x=>`<span class="fl" data-funstg="${esc(x.s)}" style="${x.n?'color:var(--text)':''}"><s style="background:${AG_STG_COLORS[x.s]||'var(--accent)'}"></s>${esc(x.s)} · ${x.n}</span>`).join('');
    // ── стрічка дій (зі швидкими кнопками) ──
    const today=agTodayItems();
    const feedHtml = today.length
      ? today.slice(0,6).map(it=>`<div class="ag-trow" data-todo="${esc(it.c.id)}">
          <span class="ag-tdot" style="background:${it.color}"></span>
          <div class="tx">${esc(it.c.name)}<small>${esc(it.label)} · ${esc(it.sub)}</small></div>
          <div class="qa">
            ${agClientOwe(it.c)>0?`<button class="qpay" data-qpay="${esc(it.c.id)}" title="Прийняти оплату">💶</button>`:''}
            ${it.c.stage!=='Готово'?`<button class="qadv" data-qadv="${esc(it.c.id)}" title="Наступний етап">→</button>`:''}
          </div></div>`).join('')
      : '<div class="empty">Все під контролем — термінових дій нема ✨</div>';
    // ── останні рухи ──
    const acts=ops.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,4);
    const actHtml=acts.map(o=>`<div class="ag-arow">
        <div class="ai">${o.t==='in'?'💶':'📤'}</div>
        <div class="at">${esc(o.label||(o.t==='in'?'Дохід':'Витрата'))}<small>${esc(o.date||'')}</small></div>
        <div class="aa ${o.t==='in'?'in':'out'}">${o.t==='in'?'+':'−'}${fmt(o.amount)}€</div>
      </div>`).join('');

    el.innerHTML=`
      <div class="ag-hero2">
        <div class="hl"><span>Баланс агенції</span>${trendHtml}</div>
        <div class="big">${fmt(bal)} €</div>
        <div class="ag-spark">${sparkHtml}</div>
        <div class="cells">
          <div class="cell" data-goto="fin"><div class="k">Дохід</div><div class="v" style="color:#34c77b">${fmt(inc)}€</div></div>
          <div class="cell" data-goto="cli"><div class="k">Клієнтів</div><div class="v">${clients.length}</div></div>
          <div class="cell" data-goto="cli"><div class="k">Борги</div><div class="v" style="color:${oweTotal>0?'var(--warn)':'#34c77b'}">${fmt(oweTotal)}€</div></div>
        </div>
      </div>

      <div class="ag-fun">
        <div class="fh"><span>📊 Воронка</span><span>тисни на етап</span></div>
        <div class="ag-funbar">${funBar}</div>
        <div class="ag-funleg">${funLeg}</div>
      </div>

      <div class="ag-rings">
        ${agRing(docPct,'var(--accent)','Документи')}
        ${agRing(payPct,'#34c77b','Оплати')}
        ${agRing(funPct,'#c77dff','Воронка')}
      </div>

      <div class="ag-today">
        <div class="th">⚡ Що робити ${today.length?('· '+today.length):''}</div>
        ${feedHtml}
      </div>

      ${actHtml?`<div class="ag-actlist"><div class="ag-doc-group" style="margin:10px 0 2px">Останні рухи</div>${actHtml}</div>`:''}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px">
        <button class="v3-btn2 agc-add" style="margin:0;background:linear-gradient(135deg,#34c77b,#2aa869);color:#06160e;border:0" data-homepay="1">💶 Оплата клієнта</button>
        <button class="agc-add" style="margin:0" data-homecli="1">＋ Новий клієнт</button>
      </div>
    `;
    // wiring
    el.querySelectorAll('[data-todo]').forEach(r=>r.onclick=()=>openClient(r.dataset.todo));
    el.querySelectorAll('[data-qpay]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation();
      const c=agClientById(b.dataset.qpay); if(c) agAddPayment(c, ()=>renderAgency()); });
    el.querySelectorAll('[data-qadv]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation();
      const c=agClientById(b.dataset.qadv); if(c) agAdvanceStage(c); });
    el.querySelectorAll('[data-goto]').forEach(cell=>cell.onclick=()=>{ agTab=cell.dataset.goto; renderAgency(); });
    el.querySelectorAll('[data-funstg]').forEach(f=>f.onclick=()=>{ agCliStageF=f.dataset.funstg; agCliQ=''; agTab='cli'; renderAgency(); });
    const rings=el.querySelectorAll('.ag-ring'); const rTabs=['doc','fin','cli'];
    rings.forEach((r,i)=>{ r.style.cursor='pointer'; r.onclick=()=>{ agTab=rTabs[i]||'home'; renderAgency(); }; });
    const hp=el.querySelector('[data-homepay]');
    if(hp) hp.onclick=(e)=>{ agRipple(e); const b=agProjBlock(); if(b&&b.splitPreset&&+b.splitPreset.amount>0){ projSplitPreset(b); setTimeout(()=>{agTab='fin';renderAgency();},90);} else { agTab='cli'; renderAgency(); } };
    const hc=el.querySelector('[data-homecli]');
    if(hc) hc.onclick=()=>agAddClientFlow('Заявка');
  }

  function agRipple(e){
    try{ const t=e.currentTarget; const r=document.createElement('span'); r.className='ag-rip';
      const b=t.getBoundingClientRect(); r.style.left=(e.clientX-b.left)+'px'; r.style.top=(e.clientY-b.top)+'px';
      t.appendChild(r); setTimeout(()=>r.remove(),600);
    }catch(_){}
  }

  /* ============ DOCUMENT VAULT (спільне сховище файлів агенції) ============ */
  function renderAgDocs(){
    const el=document.getElementById('agPaneDoc'); if(!el) return;
    const clients=agClients();
    // зібрати всі файли з усіх клієнтів
    let totalFiles=0, totalSize=0;
    const groups=[];
    clients.forEach(c=>{
      const files=(c.docs||[]).filter(d=>d.fileId);
      if(files.length){ groups.push({c, files}); totalFiles+=files.length; files.forEach(f=>totalSize+=(+f.fileSize||0)); }
    });
    const missing=[]; // документи без файлів — щоб бачити, чого бракує
    clients.forEach(c=>{ (c.docs||[]).forEach(d=>{ if(!d.fileId) missing.push({c,d}); }); });

    const groupsHtml=groups.length ? groups.map(g=>`
      <div class="ag-doc-group">${esc(g.c.name)}${g.c.service?' · '+esc(g.c.service):''}</div>
      ${g.files.map(f=>`<div class="ag-doc-item" data-vfile="${esc(g.c.id)}|${esc(f.id)}">
        <div class="ag-doc-ic">${agFileIcon(f.fileType)}</div>
        <div class="ag-doc-main"><div class="ag-doc-nm">${esc(f.fileName||'файл')}</div><div class="ag-doc-meta">${esc(f.text||'')} · ${agFileSizeStr(f.fileSize)}</div></div>
        <span class="ag-doc-dl" data-vdl="${esc(g.c.id)}|${esc(f.id)}">⬇️</span>
      </div>`).join('')}
    `).join('') : '<div class="ag-note" style="color:var(--muted)">Ще нема прикріплених файлів. Прикріпи їх у картці клієнта (кнопка 📎 біля документа).</div>';

    el.innerHTML=`
      <div class="ag-kpis">
        <div class="ag-kpi"><div class="v">${totalFiles}</div><div class="l">Файлів</div></div>
        <div class="ag-kpi"><div class="v" style="color:#c77dff">${agFileSizeStr(totalSize)||'0'}</div><div class="l">Обсяг</div></div>
        <div class="ag-kpi"><div class="v" style="color:${missing.length>0?'var(--warn)':'#34c77b'}">${missing.length}</div><div class="l">Без файлу</div></div>
      </div>
      <div class="ag-callout tip"><span>📁</span><span>Усі документи клієнтів в одному місці. Тап — відкрити, ⬇️ — скачати. Файли зберігаються локально на пристрої.</span></div>
      <button class="agc-add" data-vupload="1" style="margin-bottom:12px">⬆️ Завантажити файл і прив'язати до клієнта</button>
      ${groupsHtml}
      ${missing.length?`<div class="ag-doc-group">Очікують файл (${missing.length})</div>`+missing.slice(0,20).map(m=>`<div class="ag-doc-item" data-vmiss="${esc(m.c.id)}|${esc(m.d.id)}" style="opacity:.75"><div class="ag-doc-ic" style="background:color-mix(in srgb,var(--warn) 14%,transparent)">📎</div><div class="ag-doc-main"><div class="ag-doc-nm">${esc(m.d.text||'документ')}</div><div class="ag-doc-meta">${esc(m.c.name)} — прикріпити</div></div><span class="ag-doc-dl">＋</span></div>`).join(''):''}
    `;
    // wiring
    const up=el.querySelector('[data-vupload]');
    if(up) up.onclick=()=>agVaultUpload();
    el.querySelectorAll('[data-vfile]').forEach(row=>row.onclick=(e)=>{ if(e.target.closest('[data-vdl]'))return;
      const [cid,fid]=row.dataset.vfile.split('|'); const c=agClientById(cid); const d=c&&(c.docs||[]).find(x=>String(x.id)===String(fid)); if(d) agFileMenu(c,d); });
    el.querySelectorAll('[data-vdl]').forEach(x=>x.onclick=(e)=>{ e.stopPropagation();
      const [cid,fid]=x.dataset.vdl.split('|'); const c=agClientById(cid); const d=c&&(c.docs||[]).find(y=>String(y.id)===String(fid)); if(d) agDownloadFile(d); });
    el.querySelectorAll('[data-vmiss]').forEach(row=>row.onclick=()=>{ const [cid,did]=row.dataset.vmiss.split('|');
      const c=agClientById(cid); const d=c&&(c.docs||[]).find(x=>String(x.id)===String(did)); if(d) agAttachFile(c,d); });
  }

  // завантажити файл у сховище і прив'язати до клієнта (двосторонній зв'язок)
  function agVaultUpload(){
    const clients=agClients();
    if(!clients.length){ actionSheet({title:'Спершу створи клієнта', items:[{ic:'＋',label:'Новий клієнт',onClick:()=>agAddClientFlow('Заявка')}]}); return; }
    const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*,application/pdf,.doc,.docx';
    inp.onchange=async()=>{
      const f=inp.files&&inp.files[0]; if(!f) return;
      if(f.size>12*1024*1024){ try{flowAlert('Файл завеликий (макс 12 МБ)');}catch(_){}; return; }
      // вибір клієнта
      actionSheet({title:'Кому належить файл?', sub:esc(f.name), items:
        clients.map(c=>({ic:'👤', label:c.name+(c.service?' · '+c.service:''), onClick:()=>{
          // назва документа
          inputModal({title:'Назва документа', value:f.name.replace(/\.[^.]+$/,''), placeholder:'Напр. Паспорт', onOk:async(nm)=>{
            const fid='doc_'+c.id+'_up_'+Date.now();
            try{
              await DocDB.put(fid,f);
              const doc={id:'d'+Date.now()+Math.random().toString(36).slice(2,4), text:(nm||f.name).trim(), done:true, fileId:fid, fileName:f.name, fileType:f.type||'', fileSize:f.size};
              (c.docs=c.docs||[]).push(doc);
              saveBoard(); renderAgDocs();
              try{ window.platform.haptic('success'); }catch(_){}
              try{ flowAlert('Файл прив\u2019язано до «'+c.name+'»'); }catch(_){}
            }catch(e){ try{flowAlert('Не вдалося зберегти файл');}catch(_){} }
          }});
        }}))
      });
    };
    inp.click();
  }
  function agBindSwipe(w){
    const row=w.querySelector('.agc-row'); if(!row) return;
    let x0=null, moved=false;
    const start=x=>{ x0=x; moved=false; };
    const move=x=>{ if(x0==null)return; const d=x-x0; if(Math.abs(d)>10)moved=true;
      if(d<-30){ w.classList.add('swiped'); } else if(d>30){ w.classList.remove('swiped'); } };
    const end=()=>{ x0=null; };
    row.addEventListener('touchstart',e=>start(e.touches[0].clientX),{passive:true});
    row.addEventListener('touchmove',e=>move(e.touches[0].clientX),{passive:true});
    row.addEventListener('touchend',end,{passive:true});
    // клік відкриває тільки якщо не свайпали
    row.addEventListener('click',e=>{ if(moved){ e.stopPropagation(); e.preventDefault(); } }, true);
  }

  // ---- ФІНАНСИ ----
  function agEnvById(id){ return envelopes.find(e=>String(e.id)===String(id)); }
  function renderAgFin(){
    const el=document.getElementById('agPaneFin'); if(!el) return;
    const proj=agProjBlock();
    const inc = proj ? (proj.ops||[]).filter(o=>o.t==='in').reduce((s,o)=>s+(+o.amount||0),0) : 0;
    const exp = proj ? (proj.ops||[]).filter(o=>o.t==='out').reduce((s,o)=>s+(+o.amount||0),0) : 0;
    const net = inc-exp;
    const clients = (typeof agClients==='function') ? agClients().length : 0;
    const envBlocks=agFindAll('envelope');
    const envHtml=envBlocks.map(eb=>{
      const e=agEnvById(eb.envId); if(!e) return '';
      const sv=(typeof envSaved==='function')?envSaved(e):(+e.saved||0);
      const goal=+e.goal||0, pct=goal?Math.min(100,Math.round(sv/goal*100)):0;
      const cur=(e.link? '€':'€');
      return `<div class="ag-env" style="--ec:${e.color||'#5b8def'}">
        <div class="fill" style="width:${pct}%"></div>
        <div class="top"><span style="font-size:19px">${e.emoji||'✉️'}</span><span class="nm">${esc(e.name)}</span>
          <span class="amt">${fmt(sv)} <small>/ ${fmt(goal)}</small></span></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="eact"><button class="ag-env-in" data-agenvin="${e.id}">+ Поповнити</button>
          <button class="ag-env-out" data-agenvout="${e.id}">Витрата</button></div></div>`;
    }).join('');
    const splitLbl = (proj&&proj.splitPreset&&+proj.splitPreset.amount>0)
      ? `💶 Клієнт +${+proj.splitPreset.amount}€` : '+ Дохід';
    el.innerHTML=`
      <div class="ag-fin">
        <div class="lbl">Баланс агенції</div>
        <div class="big">${fmt(net)} €</div>
        <div class="row">
          <div class="cell"><div class="k">Дохід</div><div class="vv in">${fmt(inc)} €</div></div>
          <div class="cell"><div class="k">Розхід</div><div class="vv out">${fmt(exp)} €</div></div>
          <div class="cell"><div class="k">Клієнтів</div><div class="vv">${clients}</div></div>
        </div>
      </div>
      <div class="ag-proj">
        <div class="ag-chd" style="margin-bottom:8px"><div class="ic">💼</div><div class="t">Прибуток агенції</div><div class="m">50/50</div></div>
        <div class="net">${fmt(net)} €</div>
        <div class="eq">Дохід <b>${fmt(inc)} €</b> − Витрати <b>${fmt(exp)} €</b> = Прибуток</div>
        <div class="acts">
          <button class="ag-pa-in" data-agsplit="1">${splitLbl}</button>
          <button class="ag-pa-env" data-agdist="1">Розподілити ↦</button>
        </div>
      </div>
      <div class="ag-callout"><span>📐</span><span>З кожних 500€: <b>20% (100€)</b> → Податки/Резерв, <b>15% (75€)</b> → Reinvest. Решта <b>325€</b> — 50/50.</span></div>
      <div class="ag-chd"><div class="ic">✉️</div><div class="t">Конверти</div></div>
      ${envHtml||'<div class="ag-note" style="color:var(--muted)">Конвертів нема.</div>'}
      <button class="cp-del" data-agreset="1" style="margin-top:14px">↺ Скинути всі оплати</button>
    `;
    const rst=el.querySelector('[data-agreset]');
    if(rst) rst.onclick=()=>agResetAllPayments();
    // wiring
    const sp=el.querySelector('[data-agsplit]');
    if(sp) sp.onclick=()=>{ const b=agProjBlock(); if(!b) return;
      if(b.splitPreset&&+b.splitPreset.amount>0){ projSplitPreset(b); } else { projAddMovement(b,'in'); }
      setTimeout(renderAgency,80); };
    const dist=el.querySelector('[data-agdist]');
    if(dist) dist.onclick=()=>{ const b=agProjBlock(); if(b){ projDistributeToEnvelope(b); setTimeout(renderAgency,80); } };
    el.querySelectorAll('[data-agenvin]').forEach(btn=>btn.onclick=()=>{
      const e=agEnvById(btn.dataset.agenvin); if(!e) return;
      inputModal({title:'Поповнити «'+e.name+'» (€)', placeholder:'Напр. 100', onOk:(v)=>{
        const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0))return;
        let cid; try{ ensureCards(); cid=_projCardId(); }catch(_){}
        envAddOp(e,'in',n,'Поповнення',cid); renderAgency();
      }});
    });
    el.querySelectorAll('[data-agenvout]').forEach(btn=>btn.onclick=()=>{
      const e=agEnvById(btn.dataset.agenvout); if(!e) return;
      inputModal({title:'Витрата з «'+e.name+'» (€)', placeholder:'Сума', onOk:(v)=>{
        const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0))return;
        envAddOp(e,'out',n,'Витрата'); renderAgency();
      }});
    });
  }

  // ---- КЛІЄНТИ ----
  let agRegSort={col:null,dir:1};
  function agKanHtml(b){
    if(!b) return '';
    const cols=(b.cols||[]).map(col=>{
      const cards=(col.cards||[]).map(cd=>`<div class="ag-kcard" data-agkcard="${b.id}|${col.id}|${cd.id}">${esc(cd.t||'Картка')}${cd.m?`<div class="cm">${esc(cd.m)}</div>`:''}</div>`).join('');
      return `<div class="ag-kcol"><div class="ag-kcol-h"><span>${esc(col.name||'')}</span><span class="n">${(col.cards||[]).length}</span></div>${cards}<button class="ag-kadd" data-agkadd="${b.id}|${col.id}">＋ картка</button></div>`;
    }).join('');
    return `<div class="ag-kan">${cols}</div>`;
  }
  let agCliQ='', agCliStageF='';
  function renderAgCli(){
    const el=document.getElementById('agPaneCli'); if(!el) return;
    const clients=agClients();
    // ── лічильники по етапах + борги ──
    const stageCount={}; AG_STAGES.forEach(s=>stageCount[s]=0);
    let oweTotal=0, inWork=0;
    clients.forEach(c=>{ stageCount[c.stage]=(stageCount[c.stage]||0)+1; oweTotal+=agClientOwe(c); if(c.stage!=='Готово')inWork++; });
    // ── воронка з клієнтів (канбан по етапах) ──
    const kanCols=AG_STAGES.map(s=>{
      const cs=clients.filter(c=>c.stage===s);
      const cards=cs.map(c=>{ const owe=agClientOwe(c); const [dd,dt]=agClientDocsDone(c);
        return `<div class="ag-kcard" data-clcard="${esc(c.id)}"><span data-i18n-skip="1">${esc(c.name)}</span>${c.service?` · ${esc(c.service)}`:''}<div class="cm">${owe>0?('борг '+fmt(owe)+'€'):'сплачено ✓'}${dt>0?(' · '+dd+'/'+dt+' док'):''}</div></div>`;
      }).join('');
      return `<div class="ag-kcol"><div class="ag-kcol-h"><span>${esc(s)}</span><span class="n">${cs.length}</span></div>${cards}<button class="ag-kadd" data-claddstage="${esc(s)}">＋ клієнт</button></div>`;
    }).join('');
    // ── список клієнтів з пошуком і фільтром ──
    const rowHtml=(c)=>{ const col=agColorFor(c.id); const owe=agClientOwe(c), paid=agClientPaid(c);
      return `<div class="ag-swipe" data-swipe="${esc(c.id)}">
        <div class="ag-swipe-actions"><button class="adv" data-swadv="${esc(c.id)}">→ Етап</button><button class="pay" data-swpay="${esc(c.id)}">💶</button></div>
        <div class="agc-row" data-clopen="${esc(c.id)}">
        <div class="agc-av" style="background:${col}">${esc(agInit(c.name))}</div>
        <div class="agc-main"><div class="agc-nm"><span data-i18n-skip="1">${esc(c.name)}</span>${c.service?` <span class="ag-badge ${/živ/i.test(c.service)?'ag-b-ziv':/pob/i.test(c.service)?'ag-b-pob':'ag-b-tp'}">${esc(c.service)}</span>`:''}</div>
          <div class="agc-next">${esc(agClientNext(c))}</div></div>
        <div class="agc-right"><div class="agc-stage">${esc(c.stage)}</div><div class="agc-pay ${owe>0?'owe':'paid'}">${owe>0?('−'+fmt(owe)+'€'):fmt(paid)+'€'}</div></div>
      </div></div>`; };
    const buildList=()=>{
      const q=(agCliQ||'').trim().toLowerCase();
      const flt=clients.filter(c=>{
        if(agCliStageF && c.stage!==agCliStageF) return false;
        if(q && !((c.name||'').toLowerCase().includes(q)||(c.service||'').toLowerCase().includes(q)||(c.phone||'').includes(q))) return false;
        return true; });
      if(!flt.length) return '<div class="ag-note" style="color:var(--muted)">'+(clients.length?'Нікого не знайдено за цим фільтром.':'Клієнтів ще нема. Додай першого.')+'</div>';
      return flt.map(rowHtml).join('');
    };

    el.innerHTML=`
      <div class="ag-kpis">
        <div class="ag-kpi"><div class="v">${clients.length}</div><div class="l">Клієнтів</div></div>
        <div class="ag-kpi"><div class="v" style="color:#34c77b">${inWork}</div><div class="l">В роботі</div></div>
        <div class="ag-kpi"><div class="v" style="color:${oweTotal>0?'var(--warn)':'#34c77b'}">${fmt(oweTotal)}€</div><div class="l">Борги</div></div>
      </div>
      <button class="agc-add" data-cladd="1">＋ Новий клієнт</button>
      <div class="ag-card"><div class="ag-chd"><div class="ic">📋</div><div class="t">Воронка клієнтів</div></div><div class="ag-kan">${kanCols}</div></div>
      <div class="ag-card"><div class="ag-chd"><div class="ic">👥</div><div class="t">Усі клієнти</div></div>
        <div class="ag-clitools">
          <input class="ag-search" id="agCliSearch" placeholder="🔎 Пошук: імʼя, послуга, телефон…" value="${esc(agCliQ)}">
          <div class="ag-stgchips">
            <button class="${!agCliStageF?'on':''}" data-stgf="">Всі · ${clients.length}</button>
            ${AG_STAGES.map(s=>`<button class="${agCliStageF===s?'on':''}" data-stgf="${esc(s)}">${esc(s)} · ${stageCount[s]||0}</button>`).join('')}
          </div>
        </div>
        <div id="agCliList">${buildList()}</div>
      </div>
    `;
    // wiring
    el.querySelector('[data-cladd]').onclick=()=>agAddClientFlow('Заявка');
    el.querySelectorAll('[data-claddstage]').forEach(b=>b.onclick=()=>agAddClientFlow(b.dataset.claddstage));
    el.querySelectorAll('[data-clcard]').forEach(r=>r.onclick=()=>openClient(r.dataset.clcard));
    const listWrap=el.querySelector('#agCliList');
    const wireList=(scope)=>{
      scope.querySelectorAll('[data-clopen]').forEach(r=>r.onclick=()=>openClient(r.dataset.clopen));
      scope.querySelectorAll('[data-swipe]').forEach(w=>agBindSwipe(w));
      scope.querySelectorAll('[data-swadv]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation();
        const c=agClientById(b.dataset.swadv); if(c) agAdvanceStage(c); });
      scope.querySelectorAll('[data-swpay]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation();
        const c=agClientById(b.dataset.swpay); if(c) agAddPayment(c, ()=>renderAgency()); });
    };
    wireList(listWrap);
    const sInp=el.querySelector('#agCliSearch');
    if(sInp) sInp.oninput=()=>{ agCliQ=sInp.value; listWrap.innerHTML=buildList(); wireList(listWrap); };
    el.querySelectorAll('[data-stgf]').forEach(b=>b.onclick=()=>{ agCliStageF=b.dataset.stgf||''; renderAgCli(); });
  }

  function agWireKanban(scope){
    scope.querySelectorAll('[data-agkadd]').forEach(btn=>btn.onclick=()=>{ const [bid,cid]=btn.dataset.agkadd.split('|');
      const b=getBlock(bid); if(b){ kbwAddCard(b,cid); setTimeout(renderAgency,60); } });
    scope.querySelectorAll('[data-agkcard]').forEach(c=>c.onclick=()=>{ const [bid,cid,card]=c.dataset.agkcard.split('|');
      const b=getBlock(bid); if(b){ kbwCardMenu(b,cid,card); setTimeout(renderAgency,60); } });
  }

  // ---- УНІВЕРСАЛЬНІ КОНТРОЛІ БЛОКІВ АГЕНЦІЇ ----
  function agBlockById(id){ return agBoard().find(b=>b&&String(b.id)===String(id)); }
  function agTextModal(o){
    try{
      const ov=document.createElement('div'); ov.className='imodal';
      ov.innerHTML=`<div class="im-in"><div class="im-grip"></div>
        <div class="im-title">${esc(o.title||'Текст')}</div>
        <textarea class="ag-ta" placeholder="${escAttr(o.placeholder||'Пиши тут…')}"></textarea>
        <div class="im-btns"><button type="button" class="im-cancel">Скасувати</button><button type="button" class="im-ok">Готово</button></div></div>`;
      document.body.appendChild(ov);
      const ta=ov.querySelector('textarea'); ta.value=o.value||'';
      setTimeout(()=>{ try{ ta.focus(); }catch(_){} },60);
      const close=()=>ov.remove();
      ov.querySelector('.im-cancel').onclick=close;
      ov.onclick=e=>{ if(e.target===ov) close(); };
      ov.querySelector('.im-ok').onclick=()=>{ const v=ta.value; close(); if(o.onOk) o.onOk(v); };
    }catch(_){}
  }
  function agMakeBlock(b){ try{ if(!Array.isArray(boards[AGENCY_KEY])) boards[AGENCY_KEY]=[]; boards[AGENCY_KEY].push(b); saveBoard(); renderAgency(); try{window.platform.haptic('success');}catch(_){} }catch(_){} }
  function agRenameBlock(b){ inputModal({title:'Назва блоку', value:b.title||'', onOk:v=>{ if((v||'').trim()){ b.title=v.trim(); saveBoard(); renderAgency(); } }}); }
  function agDatePrompt(title, cur, cb){
    inputModal({title:title+' (РРРР-ММ-ДД)', value:cur||'', placeholder:ymdLocal(), onOk:v=>{ v=(v||'').trim();
      if(!v||/^\d{4}-\d{2}-\d{2}$/.test(v)) cb(v); else flowAlert('Формат дати: РРРР-ММ-ДД'); }});
  }
  const agHd=(ic,b,extra)=>`<div class="ag-chd"><div class="ic">${ic}</div><div class="t ag-tap" data-agttl="${esc(b.id)}" title="Перейменувати">${esc(b.title||'')}</div><div class="ag-hact">${extra||''}</div></div>`;
  const agMissBtn=(label,attr)=>`<button class="agc-add ag-miss" ${attr}="1">＋ ${label}</button>`;
  const agNoteHtml=(b)=>`<div class="ag-note ag-tap" data-agnedit="${esc(b.id)}">${esc(b.text||'')||'<span style="color:var(--muted)">Порожньо — торкнись, щоб написати</span>'}</div>`;
  function agWireCommon(el){
    el.querySelectorAll('[data-agttl]').forEach(t=>t.onclick=()=>{ const b=agBlockById(t.dataset.agttl); if(b) agRenameBlock(b); });
    el.querySelectorAll('[data-agnedit]').forEach(n=>n.onclick=()=>{ const b=agBlockById(n.dataset.agnedit); if(!b) return;
      agTextModal({title:b.title||'Нотатка', value:b.text||'', onOk:v=>{ b.text=v; saveBoard(); renderAgency(); }}); });
  }

  // ---- МАРКЕТИНГ ----
  function renderAgMkt(){
    const el=document.getElementById('agPaneMkt'); if(!el) return;
    const plan=agFindAll('kanban').find(b=>/контент/i.test(b.title||''));
    const chans=agFindAll('check').find(b=>/канал/i.test(b.title||''));
    const offer=agFindAll('note').find(b=>/офер|скрипт/i.test(b.title||''));
    const tick='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#08160e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';
    const chHtml=chans?(chans.items||[]).map(it=>`
      <div class="ag-chk ${it.done?'done':''}" data-agchk="${chans.id}|${it.id}">
        <div class="ag-box">${tick}</div><div class="ag-lbl">${esc(it.text||'')}</div>
        <div class="ag-rowact"><button data-agchedit="${chans.id}|${it.id}" title="Редагувати">✎</button><button class="del" data-agchdel="${chans.id}|${it.id}" title="Видалити">✕</button></div>
      </div>`).join(''):'';
    el.innerHTML=`
      ${plan?`<div class="ag-card">${agHd('🎬',plan,`<button class="ag-hbtn" data-agkcol="${esc(plan.id)}">＋ колонка</button>`)}${agKanHtml(plan)}</div>`
            :agMissBtn('Створити «Контент-план»','data-mkplan')}
      ${chans?`<div class="ag-card">${agHd('📡',chans)}${chHtml||'<div class="ag-note" style="color:var(--muted)">Каналів ще нема — додай перший.</div>'}<button class="ag-inline-add" data-agchadd="${esc(chans.id)}">＋ додати канал</button></div>`
            :agMissBtn('Створити «Канали залучення»','data-mkchan')}
      ${offer?`<div class="ag-card">${agHd('💡',offer,`<button class="ag-hbtn" data-agnbtn="${esc(offer.id)}">✎</button>`)}${agNoteHtml(offer)}</div>`
            :agMissBtn('Створити «Офер і скрипт»','data-mkoffer')}
    `;
    agWireKanban(el); agWireCommon(el);
    el.querySelectorAll('[data-agnbtn]').forEach(b=>b.onclick=()=>{ const blk=agBlockById(b.dataset.agnbtn); if(!blk) return;
      agTextModal({title:blk.title||'Нотатка', value:blk.text||'', onOk:v=>{ blk.text=v; saveBoard(); renderAgency(); }}); });
    // чекліст: toggle / edit / delete / add
    el.querySelectorAll('[data-agchk]').forEach(row=>row.onclick=()=>{ const [bid,iid]=row.dataset.agchk.split('|');
      const b=agBlockById(bid); if(!b)return; const it=(b.items||[]).find(x=>String(x.id)===String(iid)); if(!it)return;
      it.done=!it.done; saveBoard(); renderAgMkt(); try{window.platform.haptic('select');}catch(_){} });
    el.querySelectorAll('[data-agchedit]').forEach(btn=>btn.onclick=(e)=>{ e.stopPropagation();
      const [bid,iid]=btn.dataset.agchedit.split('|'); const b=agBlockById(bid); if(!b)return;
      const it=(b.items||[]).find(x=>String(x.id)===String(iid)); if(!it)return;
      inputModal({title:'Канал', value:it.text||'', onOk:v=>{ if((v||'').trim()){ it.text=v.trim(); saveBoard(); renderAgMkt(); } }}); });
    el.querySelectorAll('[data-agchdel]').forEach(btn=>btn.onclick=(e)=>{ e.stopPropagation();
      const [bid,iid]=btn.dataset.agchdel.split('|'); const b=agBlockById(bid); if(!b)return;
      const it=(b.items||[]).find(x=>String(x.id)===String(iid)); if(!it)return;
      confirmSheet({title:'Видалити «'+(it.text||'пункт')+'»?', onOk:()=>{ b.items=(b.items||[]).filter(x=>String(x.id)!==String(iid)); saveBoard(); renderAgMkt(); }}); });
    el.querySelectorAll('[data-agchadd]').forEach(btn=>btn.onclick=()=>{ const b=agBlockById(btn.dataset.agchadd); if(!b)return;
      inputModal({title:'Новий канал', placeholder:'Напр. YouTube Shorts', onOk:v=>{ if(!(v||'').trim())return;
        (b.items=b.items||[]).push({id:'ch'+Date.now(), text:v.trim(), done:false}); saveBoard(); renderAgMkt(); }}); });
    // канбан: нова колонка
    el.querySelectorAll('[data-agkcol]').forEach(btn=>btn.onclick=()=>{ const b=agBlockById(btn.dataset.agkcol); if(!b)return;
      inputModal({title:'Нова колонка', placeholder:'Напр. Ідеї на потім', onOk:v=>{ if(!(v||'').trim())return;
        (b.cols=b.cols||[]).push({id:'kc'+Date.now(), name:v.trim(), cards:[]}); saveBoard(); renderAgMkt(); }}); });
    // створення відсутніх блоків
    const mp=el.querySelector('[data-mkplan]'); if(mp) mp.onclick=()=>agMakeBlock({id:'b_mk_'+Date.now(),type:'kanban',title:'Контент-план',
      cols:['Ідея','Сценарій','Знято','Монтаж','Опубліковано'].map((n,i)=>({id:'kc_mk'+i+'_'+Date.now(),name:n,cards:[]}))});
    const mc=el.querySelector('[data-mkchan]'); if(mc) mc.onclick=()=>agMakeBlock({id:'b_ch_'+Date.now(),type:'check',title:'Канали залучення',items:[]});
    const mo=el.querySelector('[data-mkoffer]'); if(mo) mo.onclick=()=>agMakeBlock({id:'b_of_'+Date.now(),type:'note',title:'Офер і скрипт',text:''});
  }

  // ---- ОПЕРАЦІЙКА ----
  function renderAgOps(){
    const el=document.getElementById('agPaneOps'); if(!el) return;
    const cd=agFindType('countdown');
    const tl=agFindType('caseline');
    const partners=agFindAll('contacts').find(b=>/партнер|сервіс/i.test(b.title||''));
    const dev=agFindAll('note').find(b=>/розвит|гіпотез/i.test(b.title||''));
    let days='—', past=false;
    if(cd&&cd.target){ const diff=Math.ceil((new Date(cd.target)-new Date())/864e5); past=diff<0; days=Math.max(0,diff); }
    const tlHtml=tl?(tl.events||[]).slice().sort((a,b)=>String(a.d).localeCompare(String(b.d))).map(e=>{
      const done=/✅/.test(e.t)||String(e.d)<ymdLocal();
      return `<div class="ag-tli ag-tap ${done?'done':''}" data-agev="${tl.id}|${esc(e.id)}"><div class="d">${esc(e.d||'')}</div><div class="tt">${esc((e.t||'').replace('✅','').trim())}</div></div>`;
    }).join(''):'';
    const ptHtml=partners?(partners.people||[]).map(p=>`<div class="ag-ct ag-tap" data-agct="${partners.id}|${esc(p.id)}">
        <div class="ag-ct-av" style="background:${p.color||'#6a7dff'}">${esc((p.name||'?')[0])}</div>
        <div style="flex:1;min-width:0"><div class="ag-ct-nm">${esc(p.name)}</div><div class="ag-ct-no">${esc(p.note||'')||'<span style=\'color:var(--muted)\'>+ нотатка / контакт</span>'}</div></div>
        <span class="ag-ct-go">⋯</span></div>`).join(''):'';
    el.innerHTML=`
      ${cd?`<div class="ag-cd ag-tap" data-agcd="${esc(cd.id)}"><div class="n">${days}</div><div class="cl">${esc(cd.label||'днів до дати')}</div><div class="${past?'ag-cd-past':'ag-cd-hint'}">${past?'дата минула — торкнись, щоб оновити':'торкнись, щоб змінити дату'}</div></div>`
          :agMissBtn('Створити зворотний відлік','data-opcd')}
      ${tl?`<div class="ag-card">${agHd('🕓',tl,`<button class="ag-hbtn" data-agevadd="${esc(tl.id)}">＋ подія</button>`)}<div class="ag-tl">${tlHtml||'<div class="ag-note" style="color:var(--muted)">Подій ще нема.</div>'}</div></div>`
          :agMissBtn('Створити «Таймлайн запуску»','data-optl')}
      ${partners?`<div class="ag-card">${agHd('🤝',partners,`<button class="ag-hbtn" data-agctadd="${esc(partners.id)}">＋ контакт</button>`)}${ptHtml||'<div class="ag-note" style="color:var(--muted)">Контактів ще нема.</div>'}</div>`
          :agMissBtn('Створити «Партнери й сервіси»','data-oppt')}
      ${dev?`<div class="ag-card">${agHd('🚀',dev,`<button class="ag-hbtn" data-agnbtn="${esc(dev.id)}">✎</button>`)}${agNoteHtml(dev)}</div>`
          :agMissBtn('Створити «Розвиток · гіпотези»','data-opdev')}
    `;
    agWireCommon(el);
    el.querySelectorAll('[data-agnbtn]').forEach(b=>b.onclick=()=>{ const blk=agBlockById(b.dataset.agnbtn); if(!blk) return;
      agTextModal({title:blk.title||'Нотатка', value:blk.text||'', onOk:v=>{ blk.text=v; saveBoard(); renderAgency(); }}); });
    // countdown: меню редагування
    const cdel=el.querySelector('[data-agcd]');
    if(cdel) cdel.onclick=()=>{ const b=agBlockById(cdel.dataset.agcd); if(!b) return;
      actionSheet({title:b.title||'Відлік', sub:(b.target||'дата не задана'), items:[
        {ic:'📅', label:'Змінити дату', onClick:()=>agDatePrompt('Цільова дата', b.target, v=>{ b.target=v; saveBoard(); renderAgOps(); })},
        {ic:'✎', label:'Підпис під числом', onClick:()=>inputModal({title:'Підпис', value:b.label||'', onOk:v=>{ b.label=(v||'').trim(); saveBoard(); renderAgOps(); }})},
        {ic:'🏷️', label:'Назва блоку', onClick:()=>agRenameBlock(b)}
      ]}); };
    // таймлайн: додати / меню події
    el.querySelectorAll('[data-agevadd]').forEach(btn=>btn.onclick=()=>{ const b=agBlockById(btn.dataset.agevadd); if(!b)return;
      agDatePrompt('Дата події', ymdLocal(), d=>{ if(!d) d=ymdLocal();
        inputModal({title:'Що станеться?', placeholder:'Напр. Перший платний клієнт', onOk:t=>{ if(!(t||'').trim())return;
          (b.events=b.events||[]).push({id:'ev'+Date.now(), d:d, t:t.trim()}); saveBoard(); renderAgOps(); }}); }); });
    el.querySelectorAll('[data-agev]').forEach(row=>row.onclick=()=>{ const [bid,eid]=row.dataset.agev.split('|');
      const b=agBlockById(bid); if(!b)return; const ev=(b.events||[]).find(x=>String(x.id)===String(eid)); if(!ev)return;
      const isDone=/✅/.test(ev.t);
      actionSheet({title:(ev.t||'').replace('✅','').trim()||'Подія', sub:ev.d||'', items:[
        {ic:isDone?'↺':'✅', label:isDone?'Зняти позначку':'Виконано', onClick:()=>{ ev.t=isDone?ev.t.replace('✅','').trim():((ev.t||'').trim()+' ✅'); saveBoard(); renderAgOps(); try{window.platform.haptic('success');}catch(_){} }},
        {ic:'✎', label:'Текст', onClick:()=>inputModal({title:'Текст події', value:(ev.t||'').replace('✅','').trim(), onOk:v=>{ if((v||'').trim()){ ev.t=v.trim()+(isDone?' ✅':''); saveBoard(); renderAgOps(); } }})},
        {ic:'📅', label:'Дата', onClick:()=>agDatePrompt('Дата події', ev.d, v=>{ if(v){ ev.d=v; saveBoard(); renderAgOps(); } })},
        {ic:'🗑', label:'Видалити', onClick:()=>confirmSheet({title:'Видалити подію?', onOk:()=>{ b.events=(b.events||[]).filter(x=>String(x.id)!==String(eid)); saveBoard(); renderAgOps(); }})}
      ]}); });
    // контакти: додати / меню
    el.querySelectorAll('[data-agctadd]').forEach(btn=>{ btn.onclick=()=>{ const b=agBlockById(btn.dataset.agctadd); if(!b)return;
      inputModal({title:'Новий контакт — імʼя', placeholder:'Напр. Юрист Мартін', onOk:(nm)=>{ if(!(nm||'').trim())return;
        inputModal({title:'Нотатка / телефон / @', placeholder:'+421… або @username', onOk:(no)=>{
          const cs=['#34c77b','#e8843c','#c77dff','#5b8def','#6a7dff','#f0b429','#ff6b9d'];
          (b.people=b.people||[]).push({id:'pt'+Date.now(), name:nm.trim(), note:(no||'').trim(), link:'', color:cs[(b.people||[]).length%cs.length]});
          saveBoard(); renderAgOps();
        }});
      }});
    }; });
    el.querySelectorAll('[data-agct]').forEach(row=>row.onclick=()=>{ const [bid,pid]=row.dataset.agct.split('|');
      const b=agBlockById(bid); if(!b)return; const p=(b.people||[]).find(x=>String(x.id)===String(pid)); if(!p)return;
      const cs=['#34c77b','#e8843c','#c77dff','#5b8def','#6a7dff','#f0b429','#ff6b9d'];
      actionSheet({title:p.name||'Контакт', sub:p.note||'', items:[
        {ic:'✎', label:'Імʼя', onClick:()=>inputModal({title:'Імʼя', value:p.name||'', onOk:v=>{ if((v||'').trim()){ p.name=v.trim(); saveBoard(); renderAgOps(); } }})},
        {ic:'📝', label:'Нотатка / контакт', onClick:()=>inputModal({title:'Нотатка', value:p.note||'', placeholder:'+421… / @username / умови', onOk:v=>{ p.note=(v||'').trim(); saveBoard(); renderAgOps(); }})},
        {ic:'🎨', label:'Змінити колір', onClick:()=>{ const i=cs.indexOf(p.color); p.color=cs[(i+1+cs.length)%cs.length]; saveBoard(); renderAgOps(); }},
        {ic:'🗑', label:'Видалити', onClick:()=>confirmSheet({title:'Видалити «'+(p.name||'контакт')+'»?', onOk:()=>{ b.people=(b.people||[]).filter(x=>String(x.id)!==String(pid)); saveBoard(); renderAgOps(); }})}
      ]}); });
    // створення відсутніх блоків
    const oc=el.querySelector('[data-opcd]'); if(oc) oc.onclick=()=>agMakeBlock({id:'b_cd_'+Date.now(),type:'countdown',title:'Ключова дата',target:'',label:'днів до дати'});
    const ot=el.querySelector('[data-optl]'); if(ot) ot.onclick=()=>agMakeBlock({id:'b_tl_'+Date.now(),type:'caseline',title:'Таймлайн запуску',events:[]});
    const op=el.querySelector('[data-oppt]'); if(op) op.onclick=()=>agMakeBlock({id:'b_pt_'+Date.now(),type:'contacts',title:'Партнери й сервіси',people:[]});
    const od=el.querySelector('[data-opdev]'); if(od) od.onclick=()=>agMakeBlock({id:'b_dv_'+Date.now(),type:'note',title:'Розвиток · гіпотези',text:''});
  }


  /* ============ ДОДАТКОВІ ПРОСТОРИ (листки) ============ */
  // Простори існують у КОНТЕКСТІ: загальний Простір (ctx='__root__') або всередині папки (ctx=folderKey).
  // Кожен простір контексту має свій boardKey: головний = baseKey, додаткові = baseKey+'__sp_'+id.
  let switcherStyle=(window.innerWidth<640?'stories':'cards'); // pills | segment | cards | dropdown | foldertabs | stories
  const SWKEY='switcher_style';
  try{ const s=localStorage.getItem(SWKEY); if(s) switcherStyle=s; }catch(_){}
  prefCatchup(SWKEY, v=>{ if(v) switcherStyle=v; });

  // мапа просторів: { ctx: [ {id,name,emoji,color} ] }, та активні: { ctx: id }
  let spacesMap={}, activeSpaceMap={};
  const SPMKEY='spaces_map_v2', ACMKEY='active_space_map_v2';
  try{ const r=localStorage.getItem(SPMKEY); if(r){ const p=JSON.parse(r); if(p&&typeof p==='object') spacesMap=p; } }catch(_){}
  try{ const r=localStorage.getItem(ACMKEY); if(r){ const p=JSON.parse(r); if(p&&typeof p==='object') activeSpaceMap=p; } }catch(_){}
  prefCatchup(SPMKEY, v=>{ try{ const p=JSON.parse(v); if(p&&typeof p==='object') spacesMap=p; }catch(_){} });
  prefCatchup(ACMKEY, v=>{ try{ const p=JSON.parse(v); if(p&&typeof p==='object') activeSpaceMap=p; }catch(_){} });

  /* ============ CLIENTS ENTITY (єдина сутність клієнта) ============ */
  const AG_STAGES=['Заявка','Консультація','Оплата','В роботі','Подано','Готово'];
  const AG_SERVICES=['TP','živnosť','pobyt'];
  let clientOpenId=null;

  // масив клієнтів живе окремим блоком у дошці папки: {type:'agclients', list:[...]}
  function agClientsBlock(){
    let b=agBoard().find(x=>x&&x.type==='agclients');
    if(!b){ b={id:'agclients_root', type:'agclients', list:[]}; try{ boards[AGENCY_KEY].push(b); saveBoard(); }catch(_){} }
    if(!Array.isArray(b.list)) b.list=[];
    return b;
  }
  function agClients(){ return agClientsBlock().list; }
  function agClientById(id){ return agClients().find(c=>String(c.id)===String(id)); }

  function agClientPaid(c){ return (c.payments||[]).reduce((s,p)=>s+(+p.amount||0),0); }
  function agClientOwe(c){ return Math.max(0,(+c.total||0)-agClientPaid(c)); }
  function agClientDocsDone(c){ const d=c.docs||[]; return [d.filter(x=>x.done).length, d.length]; }
  function agInit(nm){ const p=String(nm||'').trim().split(/\s+/).filter(Boolean); return (p.length?(p[0][0]+(p[1]?p[1][0]:'')):'•').toUpperCase(); }
  function agColorFor(id){ const cs=['#6a7dff','#34c77b','#e8843c','#c77dff','#5b8def','#ff6b9d','#f0b429','#4ecdc4']; let h=0; String(id).split('').forEach(ch=>h=(h*31+ch.charCodeAt(0))>>>0); return cs[h%cs.length]; }

  // наступна дія (людською мовою) — для списку й дашборда
  function agClientNext(c){
    const [dd,dt]=agClientDocsDone(c);
    const owe=agClientOwe(c);
    if(c.stage==='Готово') return 'Завершено ✓';
    if(owe>0 && (c.payments||[]).length===0) return 'Чекає аванс';
    if(dt>0 && dd<dt) return 'Зібрати документи ('+dd+'/'+dt+')';
    if(owe>0) return 'Чекає доплату '+fmt(owe)+'€';
    if(c.stage!=='Подано'&&c.stage!=='Готово') return 'Можна подавати';
    return 'В роботі';
  }

  // створити клієнта; повертає обʼєкт
  function agCreateClient(name, service, stage){
    const c={ id:'cl_'+Date.now()+Math.random().toString(36).slice(2,5),
      name:(name||'Новий клієнт').trim(), contact:'', service:service||'', stage:stage||'Заявка',
      created:ymdLocal(), submitted:'', deadline:'',
      total:500, payments:[], docs:[], note:'',
      photoId:'', phone:'', email:'', telegram:'', address:'', birth:'', passport:'', extra:'' };
    agClientsBlock().list.push(c); saveBoard();
    return c;
  }

  function agAddClientFlow(preStage){
    inputModal({title:'Новий клієнт — імʼя', placeholder:'Напр. Олена Коваль', onOk:(nm)=>{
      if(!(nm||'').trim()) return;
      actionSheet({ title:'Послуга', sub:esc(nm), items:
        AG_SERVICES.map(s=>({ic:(s==='TP'?'🛡️':s==='živnosť'?'💼':'🏠'), label:s, onClick:()=>{
          const c=agCreateClient(nm,s,preStage||'Заявка');
          openClient(c.id);
        }})).concat([{ic:'—', label:'Без послуги', onClick:()=>{ const c=agCreateClient(nm,'',preStage||'Заявка'); openClient(c.id); }}])
      });
    }});
  }

  function openClient(id){ clientOpenId=id; renderClient(); show('scr-client'); }

  function renderClient(){
    const c=agClientById(clientOpenId); if(!c){ goAgency(); return; }
    document.getElementById('clientName').textContent=c.name||'Клієнт';
    const col=agColorFor(c.id);
    const paid=agClientPaid(c), owe=agClientOwe(c), tot=+c.total||0;
    const payPct=tot?Math.min(100,Math.round(paid/tot*100)):0;
    const [dd,dt]=agClientDocsDone(c);
    const tick='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#08160e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';

    // stages
    const stgHtml=AG_STAGES.map(s=>{ const idx=AG_STAGES.indexOf(s), cur=AG_STAGES.indexOf(c.stage);
      return `<button class="cp-stg ${s===c.stage?'on':(idx<cur?'done-stage':'')}" data-cpstage="${esc(s)}">${idx<cur?'✓ ':''}${esc(s)}</button>`; }).join('');

    // payments
    const pmtHtml=(c.payments||[]).length ? (c.payments||[]).map(p=>`<div class="cp-pmt" data-cppedit="${esc(p.id)}" style="cursor:pointer"><span class="pa">+${fmt(p.amount)}€</span><span>${esc(p.label||'платіж')} ✎</span><span class="pd">${esc(p.date||'')}</span><span class="px" data-cppdel="${esc(p.id)}">✕</span></div>`).join('') : '<div class="ag-note" style="color:var(--muted);font-size:12.5px">Платежів ще нема.</div>';

    // docs
    const docHtml=(c.docs||[]).length ? (c.docs||[]).map(d=>{
      const fileBit = d.fileId
        ? `<span class="dfile" data-cpfile="${esc(d.id)}">${agFileIcon(d.fileType)} ${esc(d.fileName||'файл')}</span>`
        : `<span class="dattach" data-cpattach="${esc(d.id)}">📎</span>`;
      return `<div class="cp-doc ${d.done?'done':''}" data-cpdoc="${esc(d.id)}"><div class="box">${tick}</div><div class="l">${esc(d.text||'')}${fileBit}</div><span class="dx" data-cpdocdel="${esc(d.id)}">✕</span></div>`;
    }).join('') : '<div class="ag-note" style="color:var(--muted);font-size:12.5px">Документів нема. Додай кнопкою «＋».</div>';

    // deadline countdown
    let ddBadge='';
    if(c.deadline){ const left=Math.ceil((new Date(c.deadline)-new Date())/864e5);
      const cls=left<0?'over':(left<=7?'warn':'ok'); const txt=left<0?('прострочено '+(-left)+'дн'):(left+' дн');
      ddBadge=`<span class="cp-ddleft ${cls}">${txt}</span>`; }

    document.getElementById('clientBody').innerHTML=`
      <div class="cp-hero">
        <div class="row1">
          <div class="cp-photo" data-cpphoto="1" style="background:${col}">
            <div class="av" style="width:100%;height:100%;background:${col};border-radius:18px" id="cpAvatar">${esc(agInit(c.name))}</div>
            <div class="cam">📷</div>
          </div>
          <div style="flex:1;min-width:0">
            <div class="nm" data-cpedit="name" data-i18n-skip="1">${esc(c.name)} ✎</div>
            <div class="ct">${c.service?esc(c.service):'<span style="opacity:.6">без послуги</span>'} · ${esc(c.stage)}</div>
          </div>
        </div>
        <div class="cp-stages">${stgHtml}</div>
      </div>

      <div class="cp-sec cp-collap ${c._contactsOpen?'open':''}" id="cpContacts">
        <div class="cp-collap-head" data-cpcollap="1">
          <div class="ic">👤</div>
          <div style="flex:1;min-width:0"><div class="t">Контакти й дані</div><div class="sub">${agContactSummary(c)}</div></div>
          <span class="chev">▶</span>
        </div>
        <div class="cp-collap-body"><div class="cp-collap-body-inner">
        <div class="cp-info-row" data-cpedit="phone"><div class="cp-info-ic">📱</div><div class="cp-info-main"><div class="cp-info-k">Телефон</div><div class="cp-info-v ${c.phone?'':'empty'}">${c.phone?esc(c.phone):'додати'}</div></div><span class="cp-info-act">✎</span></div>
        <div class="cp-info-row" data-cpedit="telegram"><div class="cp-info-ic">✈️</div><div class="cp-info-main"><div class="cp-info-k">Telegram</div><div class="cp-info-v ${c.telegram?'':'empty'}">${c.telegram?esc(c.telegram):'додати'}</div></div><span class="cp-info-act">✎</span></div>
        <div class="cp-info-row" data-cpedit="email"><div class="cp-info-ic">✉️</div><div class="cp-info-main"><div class="cp-info-k">Email</div><div class="cp-info-v ${c.email?'':'empty'}">${c.email?esc(c.email):'додати'}</div></div><span class="cp-info-act">✎</span></div>
        <div class="cp-info-row" data-cpedit="address"><div class="cp-info-ic">📍</div><div class="cp-info-main"><div class="cp-info-k">Адреса / ubytovanie</div><div class="cp-info-v ${c.address?'':'empty'}">${c.address?esc(c.address):'додати'}</div></div><span class="cp-info-act">✎</span></div>
        <div class="cp-info-row" data-cpedit="birth"><div class="cp-info-ic">🎂</div><div class="cp-info-main"><div class="cp-info-k">Дата народження</div><div class="cp-info-v ${c.birth?'':'empty'}">${c.birth?esc(c.birth):'додати'}</div></div><span class="cp-info-act">✎</span></div>
        <div class="cp-info-row" data-cpedit="passport"><div class="cp-info-ic">🪪</div><div class="cp-info-main"><div class="cp-info-k">Паспорт / № документа</div><div class="cp-info-v ${c.passport?'':'empty'}">${c.passport?esc(c.passport):'додати'}</div></div><span class="cp-info-act">✎</span></div>
        <div class="cp-info-row" data-cpedit="extra"><div class="cp-info-ic">📋</div><div class="cp-info-main"><div class="cp-info-k">Додаткова інформація</div><div class="cp-info-v ${c.extra?'':'empty'}">${c.extra?esc(c.extra):'додати'}</div></div><span class="cp-info-act">✎</span></div>
        </div></div>
      </div>

      <div class="cp-sec">
        <div class="cp-sec-h"><div class="ic">💶</div><div class="t">Оплата</div><button class="add" data-cppay="1">+ платіж</button></div>
        <div class="cp-payrow"><span>Сплачено ${fmt(paid)}€</span><span>${owe>0?('лишилось '+fmt(owe)+'€'):'повністю ✓'}</span></div>
        <div class="cp-paybar"><i style="width:${payPct}%"></i></div>
        <div class="cp-paysum"><span data-cpedit="total">Сума: ${fmt(tot)}€ ✎</span><span>${(c.payments||[]).length} платеж(ів)</span></div>
        ${pmtHtml}
      </div>

      <div class="cp-sec">
        <div class="cp-sec-h"><div class="ic">📄</div><div class="t">Документи</div><span class="m" style="color:var(--muted);font-size:12px;font-weight:700;margin-left:auto;margin-right:8px">${dd}/${dt}</span><button class="add" data-cpdocadd="1">＋</button></div>
        ${docHtml}
        <button class="cp-doc-fromlib" data-cpdoclib="1">📁 Прикріпити файл із бібліотеки</button>
      </div>

      <div class="cp-sec">
        <div class="cp-sec-h"><div class="ic">📅</div><div class="t">Дати й терміни</div></div>
        <div class="cp-date" data-cpedit="created"><span class="dl">Реєстрація</span><span class="dv ${c.created?'':'empty'}">${c.created?esc(c.created):'—'}</span></div>
        <div class="cp-date" data-cpedit="submitted"><span class="dl">Подано</span><span class="dv ${c.submitted?'':'empty'}">${c.submitted?esc(c.submitted):'ще ні'}</span></div>
        <div class="cp-date" data-cpedit="deadline"><span class="dl">Дедлайн</span><span style="display:flex;align-items:center"><span class="dv ${c.deadline?'':'empty'}">${c.deadline?esc(c.deadline):'—'}</span>${ddBadge}</span></div>
      </div>

      <div class="cp-sec">
        <div class="cp-sec-h"><div class="ic">📝</div><div class="t">Нотатки</div><button class="add" data-cpedit="note">✎</button></div>
        <div class="ag-note">${c.note?esc(c.note):'<span style="color:var(--muted)">Порожньо</span>'}</div>
      </div>

      <button class="cp-del" data-cpdel="1">🗑 Видалити клієнта</button>
    `;
    wireClient(c);
  }

  // короткий підсумок контактів для згорнутого стану
  function agContactSummary(c){
    const parts=[];
    if(c.phone) parts.push('📱 '+c.phone);
    if(c.telegram) parts.push('✈️ '+c.telegram);
    if(c.email) parts.push('✉️');
    if(c.address) parts.push('📍');
    if(c.passport) parts.push('🪪');
    if(!parts.length) return 'Тапни щоб додати телефон, Telegram…';
    return esc(parts.join('  ·  '));
  }
  // меню фото
  function agPhotoMenu(c){
    if(c.photoId){
      actionSheet({title:'Фото клієнта', items:[
        {ic:'🔍', label:'Переглянути', onClick:()=>agPhotoView(c)},
        {ic:'🔄', label:'Замінити', onClick:()=>agPhotoUpload(c)},
        {ic:'🗑', label:'Видалити', danger:true, onClick:async()=>{ try{await DocDB.del(c.photoId);}catch(_){}; delete c.photoId; saveBoard(); renderClient(); }},
      ]});
    } else {
      agPhotoUpload(c);
    }
  }
  function agPhotoUpload(c){
    const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
    inp.onchange=async()=>{ const f=inp.files&&inp.files[0]; if(!f)return; if(f.size>8*1024*1024){try{flowAlert('Фото завелике (макс 8 МБ)');}catch(_){};return;}
      const pid='photo_'+c.id+'_'+Date.now(); try{ if(c.photoId){try{await DocDB.del(c.photoId);}catch(_){}} await DocDB.put(pid,f); c.photoId=pid; saveBoard(); renderClient(); try{window.platform.haptic('success');}catch(_){} }catch(_){ try{flowAlert('Не вдалося зберегти фото');}catch(_){} } };
    inp.click();
  }
  async function agPhotoView(c){
    if(!c.photoId) return;
    try{ const blob=await DocDB.get(c.photoId); if(!blob)return;
      const url=URL.createObjectURL(blob);
      let ov=document.getElementById('agPhotoOverlay');
      if(!ov){ ov=document.createElement('div'); ov.id='agPhotoOverlay'; ov.className='ag-photo-overlay'; document.body.appendChild(ov); }
      ov.innerHTML='<img src="'+url+'"><div class="ag-photo-close">✕</div>';
      ov.classList.add('show');
      const close=()=>{ ov.classList.remove('show'); setTimeout(()=>{ov.innerHTML='';URL.revokeObjectURL(url);},250); };
      ov.onclick=close;
    }catch(_){ try{flowAlert('Не вдалося відкрити фото');}catch(_){} }
  }

  function wireClient(c){
    const body=document.getElementById('clientBody');
    // згортання блоку контактів
    const collapHead=body.querySelector('[data-cpcollap]');
    if(collapHead) collapHead.onclick=()=>{ c._contactsOpen=!c._contactsOpen;
      const box=document.getElementById('cpContacts'); if(box) box.classList.toggle('open', c._contactsOpen);
      try{window.platform.haptic('select');}catch(_){} };
    // фото клієнта: завантажити з IndexedDB, якщо є
    if(c.photoId){ (async()=>{ try{ const blob=await DocDB.get(c.photoId); if(blob){ const url=URL.createObjectURL(blob);
      const av=document.getElementById('cpAvatar'); if(av){ av.innerHTML=''; av.style.background='none'; const im=document.createElement('img'); im.src=url; im.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:18px'; av.appendChild(im); } } }catch(_){} })(); }
    // тап на фото → меню
    const ph=body.querySelector('[data-cpphoto]');
    if(ph) ph.onclick=()=>agPhotoMenu(c);
    // прикріпити файл із бібліотеки (двобічний звʼязок)
    const lib=body.querySelector('[data-cpdoclib]');
    if(lib) lib.onclick=()=>agAttachFromLibrary(c);
    // stage
    body.querySelectorAll('[data-cpstage]').forEach(b=>b.onclick=()=>{ c.stage=b.dataset.cpstage;
      if(c.stage==='Подано'&&!c.submitted) c.submitted=ymdLocal();
      saveBoard(); renderClient(); try{window.platform.haptic('select');}catch(_){} });
    // payment add → у фінанси + авто-розподіл
    const pay=body.querySelector('[data-cppay]');
    if(pay) pay.onclick=()=>agAddPayment(c);
    body.querySelectorAll('[data-cppedit]').forEach(row=>row.onclick=(e)=>{ if(e.target.closest('[data-cppdel]'))return;
      agEditPayment(c, row.dataset.cppedit); });
    body.querySelectorAll('[data-cppdel]').forEach(x=>x.onclick=(e)=>{ e.stopPropagation();
      const pid=x.dataset.cppdel; agRemovePayment(c,pid); });
    // docs
    const da=body.querySelector('[data-cpdocadd]');
    if(da) da.onclick=()=>actionSheet({title:'Додати документ', items:[
      {ic:'⬆️', label:'Завантажити файл', onClick:()=>{
        const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*,application/pdf,.doc,.docx';
        inp.onchange=async()=>{ const f=inp.files&&inp.files[0]; if(!f)return; if(f.size>12*1024*1024){try{flowAlert('Файл завеликий (макс 12 МБ)');}catch(_){}; return;}
          inputModal({title:'Назва документа', value:f.name.replace(/\.[^.]+$/,''), placeholder:'Напр. Паспорт', onOk:async(nm)=>{
            const fid='doc_'+c.id+'_up_'+Date.now();
            try{ await DocDB.put(fid,f); (c.docs=c.docs||[]).push({id:'d'+Date.now(),text:(nm||f.name).trim(),done:true,fileId:fid,fileName:f.name,fileType:f.type||'',fileSize:f.size}); saveBoard(); renderClient(); try{window.platform.haptic('success');}catch(_){} }catch(_){ try{flowAlert('Помилка');}catch(_){} }
          }}); };
        inp.click();
      }},
      {ic:'📝', label:'Додати як пункт (без файлу)', onClick:()=>inputModal({title:'Новий документ', placeholder:'Напр. Паспорт (скан)', onOk:(t)=>{
        if(!(t||'').trim())return; (c.docs=c.docs||[]).push({id:'d'+Date.now(),text:t.trim(),done:false}); saveBoard(); renderClient(); }})},
    ]});
    body.querySelectorAll('[data-cpdoc]').forEach(row=>row.onclick=(e)=>{ if(e.target.closest('[data-cpdocdel]')||e.target.closest('[data-cpfile]')||e.target.closest('[data-cpattach]'))return;
      const d=(c.docs||[]).find(x=>String(x.id)===String(row.dataset.cpdoc)); if(d){ d.done=!d.done; saveBoard(); renderClient(); } });
    body.querySelectorAll('[data-cpattach]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation();
      const d=(c.docs||[]).find(x=>String(x.id)===String(el.dataset.cpattach)); if(d) agAttachFile(c,d); });
    body.querySelectorAll('[data-cpfile]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation();
      const d=(c.docs||[]).find(x=>String(x.id)===String(el.dataset.cpfile)); if(d) agFileMenu(c,d); });
    body.querySelectorAll('[data-cpdocdel]').forEach(x=>x.onclick=(e)=>{ e.stopPropagation();
      const d=(c.docs||[]).find(dd=>String(dd.id)===String(x.dataset.cpdocdel));
      if(d&&d.fileId){ const fid=d.fileId; c.docs=(c.docs||[]).filter(dd=>String(dd.id)!==String(x.dataset.cpdocdel));
        let used=false; agClients().forEach(cl=>{(cl.docs||[]).forEach(dd=>{if(dd.fileId===fid)used=true;});});
        if(!used){ try{ DocDB.del(fid); }catch(_){} } }
      else { c.docs=(c.docs||[]).filter(dd=>String(dd.id)!==String(x.dataset.cpdocdel)); }
      saveBoard(); renderClient(); });
    // editable fields
    body.querySelectorAll('[data-cpedit]').forEach(el=>el.onclick=()=>{ const f=el.dataset.cpedit;
      if(f==='total'){ inputModal({title:'Повна сума (€)', value:String(+c.total||''), placeholder:'500', onOk:(v)=>{ const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(n>=0){ c.total=n; saveBoard(); renderClient(); } }}); return; }
      if(f==='name'){ inputModal({title:'Імʼя клієнта', value:c.name||'', placeholder:'Олена Коваль', onOk:(v)=>{ if((v||'').trim()){ c.name=v.trim(); saveBoard(); renderClient(); } }}); return; }
      if(f==='note'){ inputModal({title:'Нотатки', value:c.note||'', placeholder:'Будь-що важливе', onOk:(v)=>{ c.note=(v||'').trim(); saveBoard(); renderClient(); }}); return; }
      // прості текстові поля профілю
      const textFields={phone:'Телефон',telegram:'Telegram',email:'Email',address:'Адреса / ubytovanie',passport:'Паспорт / № документа',extra:'Додаткова інформація'};
      if(textFields[f]){ const ph={phone:'+380… / +421…',telegram:'@username',email:'name@mail.com',address:'місто, вулиця',passport:'серія/номер',extra:'будь-що важливе'}[f]||'';
        inputModal({title:textFields[f], value:c[f]||'', placeholder:ph, onOk:(v)=>{ c[f]=(v||'').trim(); saveBoard(); renderClient(); }}); return; }
      // date fields
      const lbl={created:'Реєстрація',submitted:'Подано',deadline:'Дедлайн',birth:'Дата народження'}[f]||f;
      inputModal({title:lbl+' (РРРР-ММ-ДД)', value:c[f]||'', placeholder:'2026-07-15', onOk:(v)=>{ v=(v||'').trim();
        if(!v||/^\d{4}-\d{2}-\d{2}$/.test(v)){ c[f]=v; saveBoard(); renderClient(); } else flowAlert('Формат дати: РРРР-ММ-ДД'); }});
    });
    // delete client
    const del=body.querySelector('[data-cpdel]');
    if(del) del.onclick=()=>confirmSheet({title:'Видалити «'+(c.name||'клієнта')+'»?', sub:'Дію не відмінити', onOk:()=>{
      agClientsBlock().list=agClients().filter(x=>String(x.id)!==String(c.id)); saveBoard(); goAgency(); }});
  }

  // додати платіж: питаємо суму + підпис, кладемо у клієнта, у finOps як дохід, і авто-розкид по конвертах пропорційно
  // застосувати похідні рухи платежу (проєкт + конверти + finOps), позначені payId — для точного видалення/редагування
  function agApplyPaymentEffects(c, pay){
    const proj=agProjBlock(); const today=ymdLocal(); const n=+pay.amount||0;
    const finId='fin_'+pay.id;
    if(proj){ (proj.ops=proj.ops||[]).push({id:'pop_'+pay.id,t:'in',amount:n,label:c.name+' · '+(pay.label||'платіж'),date:pay.date||today,src:'клієнт',finOpId:finId,clientId:c.id,payId:pay.id}); }
    try{ finOps.push({id:finId,type:'in',amount:n,label:'Клієнт: '+c.name+' · '+(pay.label||'платіж'),date:pay.date||today,proj:proj?proj.id:undefined,card:_projCardId(),clientId:c.id,payId:pay.id}); }catch(_){}
    // авто-розподіл по конвертах — кожен переказ теж мітимо payId
    try{
      const rules=(proj&&proj.splitPreset&&Array.isArray(proj.splitPreset.rules))?proj.splitPreset.rules:[];
      rules.forEach(r=>{ const e=envelopes.find(x=>String(x.id)===String(r.envId)); if(!e)return;
        const sum=Math.round(n*(+r.pct)*100)/100; if(sum>0){ let cid; try{cid=_projCardId();}catch(_){}
          (e.ops=e.ops||[]).unshift({id:'eo_'+pay.id+'_'+String(r.envId), t:'in', amount:sum, label:'Авто: '+c.name, date:pay.date||today, card:cid, payId:pay.id});
          try{ e.saved=(e.ops||[]).reduce((s,o)=>s+(o.t==='in'?+o.amount:-(+o.amount)),0); }catch(_){}
          // дзеркало у finOps як резерв (щоб баланс співпадав із логікою envAddOp)
          try{ finOps.push({id:'fin_'+pay.id+'_'+String(r.envId), type:'out', amount:sum, label:'Резерв: '+(e.name||'конверт'), date:pay.date||today, env:e.id, envSpend:true, payId:pay.id}); }catch(_){}
        } });
    }catch(_){}
  }
  // прибрати всі похідні рухи платежу за payId
  function agUnapplyPaymentEffects(pay){
    const pid=pay.id;
    const proj=agProjBlock();
    if(proj&&Array.isArray(proj.ops)) proj.ops=proj.ops.filter(o=>o.payId!==pid);
    envelopes.forEach(e=>{ if(Array.isArray(e.ops)){ e.ops=e.ops.filter(o=>o.payId!==pid);
      try{ e.saved=(e.ops||[]).reduce((s,o)=>s+(o.t==='in'?+o.amount:-(+o.amount)),0); }catch(_){} } });
    try{ finOps=finOps.filter(f=>f.payId!==pid); }catch(_){}
  }

  function agAddPayment(c, after){
    const owe=agClientOwe(c);
    inputModal({title:'Сума платежу (€)', value:owe>0?String(owe):'', placeholder:'Напр. 250', onOk:(v)=>{
      const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0)) return;
      inputModal({title:'Підпис платежу', value:( (c.payments||[]).length===0?'Аванс':'Доплата'), placeholder:'Аванс / Доплата', onOk:(label)=>{
        const pay={id:'p'+Date.now()+Math.random().toString(36).slice(2,4), amount:n, label:(label||'платіж').trim(), date:ymdLocal()};
        (c.payments=c.payments||[]).push(pay);
        agApplyPaymentEffects(c, pay);
        saveBoard(); try{saveFinOps();}catch(_){} try{renderFinance();}catch(_){}
        if(typeof after==='function'){ after(); } else { renderClient(); }
        try{ window.platform.haptic('success'); }catch(_){}
      }});
    }});
  }
  function agRemovePayment(c, pid){
    const p=(c.payments||[]).find(x=>String(x.id)===String(pid)); if(!p) return;
    confirmSheet({title:'Видалити платіж '+fmt(p.amount)+'€?', onOk:()=>{
      agUnapplyPaymentEffects(p);
      c.payments=(c.payments||[]).filter(x=>String(x.id)!==String(pid));
      saveBoard(); try{saveFinOps();}catch(_){} try{renderFinance();}catch(_){} renderClient();
    }});
  }
  // редагувати платіж: сума + підпис, з перерахунком похідних рухів
  function agEditPayment(c, pid){
    const p=(c.payments||[]).find(x=>String(x.id)===String(pid)); if(!p) return;
    actionSheet({title:'Платіж '+fmt(p.amount)+'€', sub:esc(p.label||''), items:[
      {ic:'✏️', label:'Змінити суму', onClick:()=>{
        inputModal({title:'Нова сума (€)', value:String(+p.amount||''), placeholder:'250', onOk:(v)=>{
          const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0))return;
          agUnapplyPaymentEffects(p); p.amount=n; agApplyPaymentEffects(c,p);
          saveBoard(); try{saveFinOps();}catch(_){} try{renderFinance();}catch(_){} renderClient();
        }}); }},
      {ic:'🏷️', label:'Змінити підпис', onClick:()=>{
        inputModal({title:'Підпис', value:p.label||'', placeholder:'Аванс / Доплата', onOk:(v)=>{
          agUnapplyPaymentEffects(p); p.label=(v||'платіж').trim(); agApplyPaymentEffects(c,p);
          saveBoard(); try{saveFinOps();}catch(_){} renderClient();
        }}); }},
      {ic:'📅', label:'Змінити дату', onClick:()=>{
        inputModal({title:'Дата (РРРР-ММ-ДД)', value:p.date||ymdLocal(), placeholder:'2026-07-14', onOk:(v)=>{
          v=(v||'').trim(); if(v&&!/^\d{4}-\d{2}-\d{2}$/.test(v)){ flowAlert('Формат: РРРР-ММ-ДД'); return; }
          agUnapplyPaymentEffects(p); p.date=v||ymdLocal(); agApplyPaymentEffects(c,p);
          saveBoard(); try{saveFinOps();}catch(_){} renderClient();
        }}); }},
      {ic:'🗑', label:'Видалити платіж', danger:true, onClick:()=>agRemovePayment(c,pid)},
    ]});
  }
  // повне скидання всіх оплат агенції (клієнти + проєкт + конверти + finOps)
  function agResetAllPayments(){
    confirmSheet({title:'Скинути ВСІ оплати?', sub:'Видалить усі платежі клієнтів, обнулить конверти й прибере повʼязані фінанси агенції. Самих клієнтів і документи не чіпає.', onOk:()=>{
      // 1) клієнти: обнулити платежі
      agClients().forEach(c=>{ c.payments=[]; });
      // 2) проєкт агенції: повністю обнулити всі рухи
      const proj=agProjBlock(); let projId=null;
      if(proj){ projId=proj.id; proj.ops=[]; }
      // 3) агенційні конверти: повністю обнулити
      const agEnvIds=new Set(agFindAll('envelope').map(eb=>String(eb.envId)));
      envelopes.forEach(e=>{
        if(agEnvIds.has(String(e.id))){ e.ops=[]; e.saved=0; }
        else if(Array.isArray(e.ops)){ e.ops=e.ops.filter(o=>!o.payId);
          try{ e.saved=(e.ops||[]).reduce((s,o)=>s+(o.t==='in'?+o.amount:-(+o.amount)),0); }catch(_){}
        }
      });
      // 4) finOps: прибрати все агенційне
      try{ finOps=finOps.filter(f=>{
        if(f.payId||f.clientId) return false;
        if(projId&&f.proj===projId) return false;
        if(f.env&&agEnvIds.has(String(f.env))) return false;
        if(/^Клієнт:|^Проєкт: Прибуток агенції|^Виплата партнеру|^Резерв:/i.test(f.label||'')) return false;
        return true;
      }); }catch(_){}
      // 5) виплати партнерам теж скинути
      try{ const pb=agPartnersBlock(); if(pb) pb.payouts=[]; }catch(_){}
      saveBoard(); try{saveFinOps();}catch(_){} try{saveEnvelopes();}catch(_){} try{renderFinance();}catch(_){}
      try{ renderAgency(); }catch(_){}
      try{ flowAlert('Оплати скинуто. Баланс і конверти обнулено.'); }catch(_){}
    }});
  }


  /* ============ PARTNERSHIP (розподіл прибутку між партнерами) ============ */
  function agPartnersBlock(){
    let b=agBoard().find(x=>x&&x.type==='partners');
    if(!b){ b={ id:'partners_root', type:'partners',
      people:[ {id:'me', name:'Я', role:'Маркетинг, контент, залучення', pct:50, color:'#6a7dff'},
               {id:'partner', name:'Партнерка', role:'Клієнти, подача, юридичка', pct:50, color:'#c77dff'} ],
      terms:[ {id:'t1', who:'me', text:'Веду маркетинг, контент і залучення клієнтів'},
              {id:'t2', who:'partner', text:'Веду клієнтів, подачу документів і юридичні питання'},
              {id:'t3', who:'both', text:'Податки (20%) і реінвест (15%) знімаються з кожного платежу до розподілу'} ],
      termsNote:'Прибуток ділиться після конвертів. Виплати — за домовленістю.',
      payouts:[] };
      try{ boards[AGENCY_KEY].push(b); saveBoard(); }catch(_){}
    }
    if(!Array.isArray(b.people)) b.people=[];
    if(!Array.isArray(b.terms)) b.terms=[];
    if(!Array.isArray(b.payouts)) b.payouts=[];
    return b;
  }

  // Пул до розподілу = загальний дохід − конверти − інші витрати проєкту (не конвертні) − вже виплачене
  function agProfitPool(){
    const proj=agProjBlock();
    const inc = proj ? (proj.ops||[]).filter(o=>o.t==='in').reduce((s,o)=>s+(+o.amount||0),0) : 0;
    // сума в конвертах (те, що зарезервовано)
    let envTotal=0;
    agFindAll('envelope').forEach(eb=>{ const e=agEnvById(eb.envId); if(e){ envTotal += (typeof envSaved==='function')?envSaved(e):(+e.saved||0); } });
    // інші витрати проєкту, що НЕ є авто-переказами в конверти (label не починається з "Авто")
    const otherExp = proj ? (proj.ops||[]).filter(o=>o.t==='out' && !/^авто/i.test(o.label||'')).reduce((s,o)=>s+(+o.amount||0),0) : 0;
    const pb=agPartnersBlock();
    const paidOut=(pb.payouts||[]).reduce((s,p)=>s+(+p.amount||0),0);
    const distributable = Math.max(0, inc - envTotal - otherExp); // скільки взагалі підлягає розподілу
    return { inc, envTotal, otherExp, distributable, paidOut, remaining: Math.max(0, distributable - paidOut) };
  }
  function agPartnerShare(p, pool){ return Math.round((pool.distributable*(+p.pct||0)/100)*100)/100; }
  function agPartnerPaid(pb, pid){ return (pb.payouts||[]).filter(x=>x.partnerId===pid).reduce((s,x)=>s+(+x.amount||0),0); }
  function agPartnerDue(pb, p, pool){ return Math.round((agPartnerShare(p,pool)-agPartnerPaid(pb,p.id))*100)/100; }

  function renderAgPartners(){
    const host=document.getElementById('agPanePtr'); if(!host) return;
    const pb=agPartnersBlock(); const pool=agProfitPool();
    const totalPct=pb.people.reduce((s,p)=>s+(+p.pct||0),0);
    const pctWarn = totalPct!==100 ? `<div class="ag-callout" style="margin-top:0">⚠️ Сума часток = ${totalPct}% (має бути 100%)</div>` : '';

    const peopleHtml=pb.people.map(p=>{
      const share=agPartnerShare(p,pool), paid=agPartnerPaid(pb,p.id), due=agPartnerDue(pb,p,pool);
      const hist=(pb.payouts||[]).filter(x=>x.partnerId===p.id).slice().reverse().map(x=>`<div class="pt-hrow"><span class="ha">−${fmt(x.amount)}€</span><span>${esc(x.note||'виплата')}</span><span class="hd">${esc(x.date||'')}</span><span class="hx" data-ptpodel="${esc(x.id)}">✕</span></div>`).join('');
      return `<div class="pt-card">
        <div class="top">
          <div class="pt-av" style="background:${p.color||'#6a7dff'}">${esc(agInit(p.name))}</div>
          <div style="flex:1;min-width:0"><div class="pt-nm" data-ptname="${esc(p.id)}">${esc(p.name)} ✎</div><div class="pt-role" data-ptrole="${esc(p.id)}">${esc(p.role||'+ роль')}</div></div>
          <div class="pt-pctbtn" data-ptpct="${esc(p.id)}"><div class="p">${+p.pct||0}%</div><div class="pl">частка ✎</div></div>
        </div>
        <div class="pt-money">
          <div class="cell"><div class="k">Належить</div><div class="v">${fmt(share)}€</div></div>
          <div class="cell"><div class="k">Виплачено</div><div class="v">${fmt(paid)}€</div></div>
          <div class="cell"><div class="k">До виплати</div><div class="v due">${fmt(Math.max(0,due))}€</div></div>
        </div>
        <button class="pt-payout" data-ptpayout="${esc(p.id)}">💸 Зафіксувати виплату</button>
        ${hist?`<div class="pt-hist">${hist}</div>`:''}
      </div>`;
    }).join('');

    const termsHtml=(pb.terms||[]).map(t=>{
      const who=t.who==='both'?'Обидва':(pb.people.find(x=>x.id===t.who)||{}).name||'—';
      const cls=t.who==='partner'?'p2':'';
      return `<div class="pt-term"><span class="who ${cls}">${esc(who)}</span><span class="tx" data-pttermedit="${esc(t.id)}">${esc(t.text)}</span><span class="tdel" data-pttermdel="${esc(t.id)}">✕</span></div>`;
    }).join('');

    host.innerHTML=`
      <div class="pt-pool">
        <div class="lbl">Прибуток до розподілу (після конвертів)</div>
        <div class="big">${fmt(pool.distributable)}€</div>
        <div class="brk">
          <span>Дохід ${fmt(pool.inc)}€</span>
          <span>− конверти ${fmt(pool.envTotal)}€</span>
          ${pool.otherExp>0?`<span>− витрати ${fmt(pool.otherExp)}€</span>`:''}
          <span>− виплачено ${fmt(pool.paidOut)}€</span>
          <span style="color:#34c77b;background:color-mix(in srgb,#34c77b 14%,transparent)">= лишок ${fmt(pool.remaining)}€</span>
        </div>
      </div>
      ${pctWarn}
      ${peopleHtml}
      <div class="ag-card">
        <div class="ag-chd"><div class="ic">📜</div><div class="t">Умови договору</div></div>
        ${termsHtml||'<div class="ag-note" style="color:var(--muted);font-size:12.5px">Пунктів нема.</div>'}
        <button class="pt-addterm" data-ptaddterm="1">＋ додати пункт</button>
        <div class="ag-note" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--hair)" data-pttermsnote="1">${pb.termsNote?esc(pb.termsNote):'<span style="color:var(--muted)">+ загальні умови (натисни щоб додати)</span>'}</div>
      </div>
    `;
    wirePartners(pb, pool);
  }

  function wirePartners(pb, pool){
    const host=document.getElementById('agPanePtr');
    const rep=()=>{ saveBoard(); renderAgPartners(); renderAgFin(); };
    host.querySelectorAll('[data-ptname]').forEach(el=>el.onclick=()=>{ const p=pb.people.find(x=>x.id===el.dataset.ptname); if(!p)return;
      inputModal({title:'Імʼя партнера', value:p.name, onOk:v=>{ if((v||'').trim()){ p.name=v.trim(); rep(); } }}); });
    host.querySelectorAll('[data-ptrole]').forEach(el=>el.onclick=()=>{ const p=pb.people.find(x=>x.id===el.dataset.ptrole); if(!p)return;
      inputModal({title:'Роль / відповідальність', value:p.role||'', placeholder:'За що відповідає', onOk:v=>{ p.role=(v||'').trim(); rep(); } }); });
    host.querySelectorAll('[data-ptpct]').forEach(el=>el.onclick=()=>{ const p=pb.people.find(x=>x.id===el.dataset.ptpct); if(!p)return;
      inputModal({title:'Частка (%)', value:String(+p.pct||0), placeholder:'50', onOk:v=>{ const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(n>=0&&n<=100){ p.pct=n;
        // авто-балансування: якщо рівно 2 партнери — другому ставимо решту
        if(pb.people.length===2){ const other=pb.people.find(x=>x.id!==p.id); if(other) other.pct=Math.round((100-n)*100)/100; }
        rep(); } }}); });
    host.querySelectorAll('[data-ptpayout]').forEach(el=>el.onclick=()=>{ const p=pb.people.find(x=>x.id===el.dataset.ptpayout); if(!p)return;
      const due=Math.max(0,agPartnerDue(pb,p,pool));
      inputModal({title:'Виплата «'+p.name+'» (€)', value:due>0?String(due):'', placeholder:'Сума', onOk:v=>{ const n=parseFloat((v||'').replace(',','.').replace(/[^\d.]/g,'')); if(!(n>0))return;
        pb.payouts.push({id:'po'+Date.now(), partnerId:p.id, amount:n, date:ymdLocal(), note:'виплата '+p.name});
        // виплата = витрата з балансу агенції: додаємо out у проєкт + finOps
        const proj=agProjBlock(); const finId='fin_'+Date.now()+Math.random().toString(36).slice(2,5);
        if(proj){ (proj.ops=proj.ops||[]).push({id:'pop_'+Date.now(),t:'out',amount:n,label:'Виплата: '+p.name,date:ymdLocal(),finOpId:finId,payoutId:'set'}); }
        try{ finOps.push({id:finId,type:'out',amount:n,label:'Виплата партнеру: '+p.name,date:ymdLocal(),proj:proj?proj.id:undefined,card:_projCardId()}); saveFinOps(); }catch(_){}
        saveBoard(); renderAgPartners(); renderAgFin(); try{window.platform.haptic('success');}catch(_){}
      }});
    });
    host.querySelectorAll('[data-ptpodel]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const id=el.dataset.ptpodel;
      const po=(pb.payouts||[]).find(x=>x.id===id); if(!po)return;
      confirmSheet({title:'Прибрати виплату '+fmt(po.amount)+'€?', onOk:()=>{ pb.payouts=pb.payouts.filter(x=>x.id!==id);
        // прибрати з проєкту/finOps відповідний out
        const proj=agProjBlock(); if(proj&&Array.isArray(proj.ops)){ const op=proj.ops.find(o=>o.t==='out'&&+o.amount===+po.amount&&/^Виплата/.test(o.label||'')); if(op){ if(op.finOpId){try{finOps=finOps.filter(f=>f.id!==op.finOpId);}catch(_){}} proj.ops=proj.ops.filter(o=>o!==op); } }
        saveBoard(); try{saveFinOps();}catch(_){} renderAgPartners(); renderAgFin(); }});
    });
    // terms
    host.querySelectorAll('[data-pttermedit]').forEach(el=>el.onclick=()=>{ const t=pb.terms.find(x=>x.id===el.dataset.pttermedit); if(!t)return;
      inputModal({title:'Пункт договору', value:t.text, onOk:v=>{ if((v||'').trim()){ t.text=v.trim(); rep(); } }}); });
    host.querySelectorAll('[data-pttermdel]').forEach(el=>el.onclick=(e)=>{ e.stopPropagation();
      pb.terms=pb.terms.filter(x=>x.id!==el.dataset.pttermdel); rep(); });
    const at=host.querySelector('[data-ptaddterm]');
    if(at) at.onclick=()=>{ actionSheet({title:'Хто відповідає?', items:
      pb.people.map(p=>({ic:'👤',label:p.name,onClick:()=>ptNewTerm(pb,p.id)})).concat([{ic:'🤝',label:'Обидва',onClick:()=>ptNewTerm(pb,'both')}]) }); };
    const tn=host.querySelector('[data-pttermsnote]');
    if(tn) tn.onclick=()=>inputModal({title:'Загальні умови', value:pb.termsNote||'', placeholder:'Відсотки, коли розподіл, хто що покриває…', onOk:v=>{ pb.termsNote=(v||'').trim(); rep(); }});
  }
  function ptNewTerm(pb, who){
    inputModal({title:'Новий пункт', placeholder:'Хто за що відповідає', onOk:v=>{ if(!(v||'').trim())return;
      pb.terms.push({id:'t'+Date.now(), who:who, text:v.trim()}); saveBoard(); renderAgPartners(); }});
  }

  function saveSpacesMeta(){ try{ prefSet(SPMKEY,JSON.stringify(spacesMap)); prefSet(ACMKEY,JSON.stringify(activeSpaceMap)); prefSet(SWKEY,switcherStyle); }catch(_){} }

  // який зараз контекст: загальний Простір чи папка
  function curCtx(){
    if(spaceFromFolder && spaceFromFolder!=='__general__'){ return currentFolderKey||spaceFromFolder; }
    return '__root__';
  }
  function ctxBaseKey(ctx){ return ctx==='__root__' ? 'all' : ctx; }
  function ctxDefaultMeta(ctx){
    if(ctx==='__root__') return {id:'main',name:'Головний',emoji:'🧩',color:'#7c9cf5'};
    const f=folders[ctx];
    return {id:'main',name:(f&&f.name)||'Головний', emoji:(f&&f.emoji&&f.emoji.trim())||'📁', color:'#7c9cf5'};
  }
  // список просторів контексту (гарантує головний)
  function spacesFor(ctx){
    if(!Array.isArray(spacesMap[ctx]) || !spacesMap[ctx].length){ spacesMap[ctx]=[ctxDefaultMeta(ctx)]; }
    if(!spacesMap[ctx].some(s=>s.id==='main')){ spacesMap[ctx].unshift(ctxDefaultMeta(ctx)); }
    return spacesMap[ctx];
  }
  function activeSpaceFor(ctx){ const a=activeSpaceMap[ctx]; const list=spacesFor(ctx); return list.some(s=>s.id===a)?a:'main'; }
  function spaceByIdIn(ctx,id){ return spacesFor(ctx).find(s=>s.id===id)||spacesFor(ctx)[0]; }
  function keyForSpaceIn(ctx,id){ const base=ctxBaseKey(ctx); return id==='main'?base:(base+'__sp_'+id); }
  function spaceCountIn(ctx,id){ const arr=boards[keyForSpaceIn(ctx,id)]; return Array.isArray(arr)?arr.length:0; }

  // перейти в активний простір ЗАГАЛЬНОГО простору (з нав-кнопки)
  function goActiveSpace(){
    spaceFromFolder='__general__'; currentFolderKey=null; folderPath=[];
    const a=activeSpaceFor('__root__');
    boardKey=keyForSpaceIn('__root__',a);
    if(!boards[boardKey]) boards[boardKey]=[];
    syncBlocks(); renderBoard(); show('scr-space');
  }
  // перемкнути простір у поточному контексті
  function switchSpace(id){
    const ctx=curCtx();
    activeSpaceMap[ctx]=id; saveSpacesMeta();
    folderPath=[]; // виходимо на корінь простору
    boardKey=keyForSpaceIn(ctx,id);
    if(!boards[boardKey]) boards[boardKey]=[];
    window.platform.haptic('light');
    syncBlocks(); renderBoard();
  }
  function addSpace(){
    const ctx=curCtx();
    const list=spacesFor(ctx);
    const palette=['#ff6b9d','#34c77b','#f0b429','#c77dff','#4ecdc4','#e8843c','#9b8cff','#5b8def'];
    const emojis=['🎬','💼','💡','🚀','📚','🏆','🎨','⚡','❤️','🎯','📸','🧠'];
    const id='s'+Date.now().toString(36);
    const n=list.length;
    list.push({id,name:'Простір '+(n+1),emoji:emojis[n%emojis.length],color:palette[n%palette.length]});
    boards[keyForSpaceIn(ctx,id)]=[]; activeSpaceMap[ctx]=id; saveSpacesMeta(); saveBoard();
    window.platform.haptic('medium');
    folderPath=[]; boardKey=keyForSpaceIn(ctx,id); syncBlocks(); renderBoard();
    setTimeout(()=>openSpaceSettings(id),120);
  }
  function deleteSpace(id){
    const ctx=curCtx();
    if(id==='main'){ flowAlert('Головний простір видалити не можна.'); return; }
    const sp=spaceByIdIn(ctx,id);
    confirmSheet({title:'Видалити простір «'+sp.name+'»?', sub:'Разом з усіма блоками.', onOk:()=>{
    delete boards[keyForSpaceIn(ctx,id)];
    spacesMap[ctx]=spacesFor(ctx).filter(s=>s.id!==id);
    if(activeSpaceFor(ctx)===id) activeSpaceMap[ctx]='main';
    saveSpacesMeta(); saveBoard();
    folderPath=[]; boardKey=keyForSpaceIn(ctx,'main'); syncBlocks(); renderBoard();
    }});
  }

  // РЕНДЕР перемикача в обраному стилі (для поточного контексту: Простір або папка)
  function renderSpaceSwitcher(){
    const host=document.getElementById('spaceSwitcher');
    if(!host) return;
    // ховаємо, якщо ми заглибились у вкладену папку/сторінку (не на корені простору)
    const inNested = (typeof folderPath!=='undefined') && folderPath.length>0;
    const ctx=curCtx();
    const isFinVal = boardKey==='fin'||boardKey==='val';
    if(inNested || isFinVal){ host.style.display='none'; host.innerHTML=''; return; }
    host.style.display='';
    host.className='space-switcher sw-'+switcherStyle;
    const list=spacesFor(ctx);
    const A=activeSpaceFor(ctx);
    const cnt=id=>spaceCountIn(ctx,id);
    if(switcherStyle==='pills'){
      host.innerHTML=list.map(s=>`<button class="sw-pill ${s.id===A?'on':''}" style="--sc:${s.color}" data-sp="${s.id}">${s.emoji} ${esc(s.name)}</button>`).join('')
        +`<button class="sw-pill add" data-spadd>＋</button>`;
    } else if(switcherStyle==='segment'){
      host.innerHTML=`<div class="sw-seg">${list.map(s=>`<button class="${s.id===A?'on':''}" data-sp="${s.id}">${s.emoji} ${esc(s.name)}</button>`).join('')}<button class="sw-plus" data-spadd>＋</button></div>`;
    } else if(switcherStyle==='cards'){
      host.innerHTML=`<div class="sw-cards">${list.map(s=>`<button class="sw-card ${s.id===A?'on':''}" style="--sc:${s.color}" data-sp="${s.id}">
        <span class="sc-e">${s.emoji}</span><span class="sc-n">${esc(s.name)}</span><span class="sc-c">${cnt(s.id)} блок.</span></button>`).join('')}
        <button class="sw-card add" data-spadd><span class="pl">＋</span><span>Новий</span></button></div>`;
    } else if(switcherStyle==='dropdown'){
      const cur=spaceByIdIn(ctx,A);
      host.innerHTML=`<button class="sw-dd-btn" data-spdd style="--sc:${cur.color}"><span class="dd-e">${cur.emoji}</span><span class="dd-n">${esc(cur.name)}</span><span class="dd-car">▾</span></button>
        <div class="sw-dd-menu" id="swDdMenu">${list.map(s=>`<button class="sw-dd-item ${s.id===A?'on':''}" data-sp="${s.id}"><span>${s.emoji}</span><span class="ddi-n">${esc(s.name)}</span><span class="ddi-c">${cnt(s.id)}</span></button>`).join('')}
        <button class="sw-dd-item add" data-spadd><span>＋</span><span class="ddi-n">Новий простір</span></button></div>`;
    } else if(switcherStyle==='stories'){
      host.innerHTML=list.map(s=>`<button class="sw-story ${s.id===A?'on':''}" style="--sc:${s.color}" data-sp="${s.id}">
        <span class="ring"><span class="in">${s.emoji}</span></span><small>${esc(s.name)}</small></button>`).join('')
        +`<button class="sw-story add" data-spadd><span class="ring"><span class="in">＋</span></span><small>Новий</small></button>`;
    } else if(switcherStyle==='foldertabs'){
      host.innerHTML=`<div class="sw-ftabs">${list.map(s=>`<button class="sw-ftab ${s.id===A?'on':''}" style="--sc:${s.color}" data-sp="${s.id}">${s.emoji} ${esc(s.name)}</button>`).join('')}<button class="sw-ftab add" data-spadd>＋</button></div>`;
    }
    host.querySelectorAll('[data-sp]').forEach(el=>el.onclick=()=>{ const id=el.dataset.sp; if(id!==A) switchSpace(id); });
    host.querySelectorAll('[data-spadd]').forEach(el=>el.onclick=()=>addSpace());
    const ddBtn=host.querySelector('[data-spdd]');
    if(ddBtn){ ddBtn.onclick=()=>{ const m=document.getElementById('swDdMenu'); if(m) m.classList.toggle('open'); ddBtn.classList.toggle('open'); }; }
  }

  // НАЛАШТУВАННЯ просторів поточного контексту
  function openSpaceSettings(focusId){
    document.querySelectorAll('.spcfg-ov').forEach(o=>o.remove());
    const ctx=curCtx();
    const list=spacesFor(ctx);
    const ctxName = ctx==='__root__' ? 'Простір' : ((folders[ctx]&&folders[ctx].name)||'Папка');
    const STYLES=[['stories','Сторі','◉ ◉'],['pills','Піл-таби','● ● ●'],['segment','Сегмент','▭▭▭'],['cards','Картки','▢ ▢'],['dropdown','Дропдаун','▾'],['foldertabs','Вкладки','◳◳']];
    const ov=document.createElement('div'); ov.className='spcfg-ov';
    ov.innerHTML=`<div class="spcfg-in">
      <div class="spcfg-grip"></div>
      <div class="spcfg-h">Простори · ${esc(ctxName)}</div>
      <div class="spcfg-sec">Стиль перемикача</div>
      <div class="spcfg-styles">${STYLES.map(([k,n,p])=>`<button class="spcfg-style ${switcherStyle===k?'on':''}" data-style="${k}"><span class="ss-p">${p}</span><span class="ss-n">${n}</span></button>`).join('')}</div>
      <div class="spcfg-sec">Стиль карток</div>
      <div class="spcfg-styles" style="grid-template-columns:repeat(3,1fr)">${[['classic','Класика','▢'],['glass','Скло','◇'],['bento','Бенто','▧']].map(([k,n,p])=>`<button class="spcfg-style ${cardSkin===k?'on':''}" data-cardskin="${k}"><span class="ss-p">${p}</span><span class="ss-n">${n}</span></button>`).join('')}</div>
      <div class="spcfg-sec">Простори тут</div>
      <div class="spcfg-list">${list.map(s=>`<div class="spcfg-row ${s.id===focusId?'flash':''}" data-row="${s.id}" style="--sc:${s.color}">
        <button class="spcfg-emoji" data-spemoji="${s.id}">${s.emoji}</button>
        <input class="spcfg-name" value="${escAttr(s.name)}" data-spname="${s.id}" placeholder="Назва простору">
        <span class="spcfg-cnt">${spaceCountIn(ctx,s.id)}</span>
        ${s.id==='main'?'<span class="spcfg-lock" title="Головний">🏠</span>':`<button class="spcfg-del" data-spdel="${s.id}">🗑️</button>`}
      </div>`).join('')}</div>
      <button class="spcfg-add" data-spaddnew>＋ Додати простір</button>
      <button class="spcfg-close" data-spclose>Готово</button>
    </div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(()=>ov.classList.add('open'));
    const close=()=>{ ov.classList.remove('open'); setTimeout(()=>ov.remove(),200); };
    ov.addEventListener('click',e=>{ if(e.target===ov) close(); });
    ov.querySelector('[data-spclose]').onclick=close;
    ov.querySelector('[data-spaddnew]').onclick=()=>{ close(); addSpace(); };
    ov.querySelectorAll('[data-style]').forEach(b=>b.onclick=()=>{
      switcherStyle=b.dataset.style; saveSpacesMeta();
      ov.querySelectorAll('[data-style]').forEach(x=>x.classList.toggle('on',x===b));
      renderSpaceSwitcher();
      window.platform.haptic('select');
    });
    ov.querySelectorAll('[data-cardskin]').forEach(b=>b.onclick=()=>{
      setCardSkin(b.dataset.cardskin);
      ov.querySelectorAll('[data-cardskin]').forEach(x=>x.classList.toggle('on',x===b));
      renderBoard();
    });
    ov.querySelectorAll('[data-spname]').forEach(inp=>inp.onblur=()=>{
      const sp=spaceByIdIn(ctx,inp.dataset.spname); if(sp){ sp.name=inp.value.trim()||sp.name; saveSpacesMeta(); renderSpaceSwitcher(); renderBoard(); }
    });
    ov.querySelectorAll('[data-spemoji]').forEach(btn=>btn.onclick=()=>{
      const sp=spaceByIdIn(ctx,btn.dataset.spemoji); if(!sp) return;
      inputModal({title:'Емодзі простору', value:sp.emoji, placeholder:'напр. 🌌', onOk:(v)=>{ const pick=(v||'').trim().slice(0,2); if(pick){ sp.emoji=pick; btn.textContent=sp.emoji; saveSpacesMeta(); renderSpaceSwitcher(); } }});
    });
    ov.querySelectorAll('[data-spdel]').forEach(btn=>btn.onclick=()=>{ close(); deleteSpace(btn.dataset.spdel); });
  }

  function goSpaceFor(key){
    try{
      boardKey=key;
      if(!boards[key]) boards[key]=[];
      if(typeof syncBlocks==='function') syncBlocks();
      const tb=(typeof tabByKey==='function')?tabByKey(key):null;
      const isFolderBuiltin = (typeof BUILTIN_TABS!=='undefined') && BUILTIN_TABS.some(t=>t.key===key) && key!=='all';
      spaceFromFolder = (tb && tb.folder) ? tb.folder : (isFolderBuiltin ? key : (currentFolderKey||null));
      // ЧИСТА ПАПКА: виставляємо клас ДО renderBoard, щоб порожній аркуш не показував «Тисни +»
      { const fromFolder = spaceFromFolder && spaceFromFolder!=='__general__' && spaceFromFolder!=='__root__';
        document.body.classList.toggle('folder-clean', !!fromFolder); }
      // НОВИЙ РЕДАКТОР: папки відкриваються у Notion-стилі. Fallback — стара дошка.
      if(typeof window.openFlowPage==='function'){
        window.__flowExitPage=function(){ try{ if(typeof goHome==='function'){ goHome(); return; } }catch(_){} if(window.__show)window.__show('scr-home'); };
        window.openFlowPage();
      } else {
        renderBoard();
        show('scr-space');
      }
    }catch(e){ console.error('goSpaceFor', e); renderBoard(); show('scr-space'); }
  }
  let spaceFromFolder=null;

  // FAB visible only on space screen
  function show(id){
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('fab').classList.toggle('show', id==='scr-space');
    document.querySelectorAll('.nav a').forEach(a=>a.classList.remove('on'));
    if(id==='scr-home'){ document.getElementById('navHome').classList.add('on');
      const bm=document.getElementById('brandMark');
      if(bm){ bm.classList.remove('lg-play'); void bm.offsetWidth; bm.classList.add('lg-play'); } }
    if(id==='scr-finance'){ const nf=document.getElementById('navFinance'); if(nf) nf.classList.add('on'); }
    if(id==='scr-goals'){ const np=document.getElementById('navPlanner'); if(np) np.classList.add('on'); }
    if(id==='scr-planner'){ const np=document.getElementById('navPlanner'); if(np) np.classList.add('on'); }
    if(id==='scr-projects'||id==='scr-work'||id==='scr-agency'||id==='scr-client'){ const npr=document.getElementById('navProjects'); if(npr) npr.classList.add('on'); }
    // синхронізація десктопного сайдбару
    const dmap={'scr-home':'home','scr-folder':'home','scr-space':'home','scr-goals':'planner','scr-projects':'projects',
                'scr-finance':'finance','scr-planner':'planner','scr-values':'finance','scr-debts':'finance','scr-income':'finance','scr-analytics':'finance','scr-finlit':'finance','scr-spend':'finance','scr-work':'projects','scr-agency':'projects','scr-client':'projects','scr-wishes':'home','scr-more':'more','scr-nyc':'more','scr-page':'home','scr-patterns':'home','scr-vision':'home'};
    const dkey=dmap[id]||'home';
    document.querySelectorAll('.dsb-i').forEach(b=>b.classList.toggle('on', b.dataset.dnav===dkey));
    // прапорець для 3-панельного режиму Простору
    document.body.classList.toggle('in-space', id==='scr-space');
    // ЧИСТА ПАПКА: якщо простір відкрито з папки (а не з головного Огляду) — ховаємо всі панелі
    { const fromFolder = id==='scr-space' && spaceFromFolder && spaceFromFolder!=='__general__' && spaceFromFolder!=='__root__';
      document.body.classList.toggle('folder-clean', !!fromFolder); }
    document.body.classList.toggle('in-home', id==='scr-home');
    document.body.classList.toggle('in-reader', id==='scr-reader');
    if(id==='scr-space'){ try{ renderSpaceSwitcher(); }catch(_){} }
    if(id==='scr-reader'){ try{ initReader(); applyRdrCfg(); }catch(_){} }
    if(id==='scr-nyc'){ try{ if(window.__nycRefresh) window.__nycRefresh(); }catch(_){} }
    if(id==='scr-space') renderPaneList();
    if(id==='scr-home'){ try{ renderRightRail(); }catch(_){} }
    // ВАЖЛИВО: <html> має overflow:hidden, а <body> — position:fixed зі своїм
    // overflow-y:auto. Тобто реальний скрол — на body, а не на window/html.
    // window.scrollTo() тут ЗАВЖДИ був no-op — ось чому попередні спроби
    // скинути прокрутку при перемиканні екрану іноді "не працювали".
    try{ document.body.scrollTop = 0; }catch(_){}
    try{ window.scrollTo({top:0, behavior:'instant'}); }catch(_){} // про всяк випадок, якщо колись зміниться CSS
    setTimeout(()=>{ try{ document.body.scrollTop = 0; }catch(_){} }, 80);
  }
  try{ window.__show=show; }catch(_){}

  document.getElementById('navHome').onclick = goHome;
  document.getElementById('navFinance').onclick = goFinance;
  document.getElementById('navPlanner').onclick = ()=>{ goPlanner(); };
  { const npr=document.getElementById('navProjects'); if(npr) npr.onclick = ()=>{ try{ goProjects(); }catch(e){ console.error('navProjects',e); } }; }
  { const b=document.getElementById('spaceCfgBtn'); if(b) b.onclick=()=>openSpaceSettings(); }

  // ── меню «⋯» Простору: другорядні дії однією шторкою ──
  function openSpaceMore(){
    document.querySelectorAll('#spaceMoreSheet').forEach(x=>x.remove());
    const items=[
      ['zenToggle','⛶','Повний екран (zen)'],
      ['spaceFullToggle','🖥️','Простір на весь екран'],
      ['spaceLayoutToggle','◫','Лейаут: класичний / три панелі'],
      ['canvasToggle','🧲','Вільне полотно'],
      ['boardWideToggle','↔️','Ширина дошки'],
      ['proThemeToggle','✨','Pro-стиль'],
      ['spaceClear','🗑️','Очистити дошку'],
    ];
    const m=document.createElement('div'); m.className='fmenu-sheet'; m.id='spaceMoreSheet';
    m.innerHTML=`<div class="fmenu-in"><div class="fmenu-grip"></div>
      <div class="fmenu-title">Дії простору</div>
      ${items.map(([id,e,t])=>`<button class="fmi ${id==='spaceClear'?'danger':''}" data-proxy="${id}">${e} ${t}</button>`).join('')}
    </div>`;
    m.onclick=e=>{ if(e.target===m) m.remove(); };
    document.body.appendChild(m);
    m.querySelectorAll('[data-proxy]').forEach(b=>b.onclick=()=>{
      m.remove();
      const t=document.getElementById(b.dataset.proxy);
      if(t) t.click();
    });
  }
  { const b=document.getElementById('spaceMoreBtn'); if(b) b.onclick=openSpaceMore; }

  // ── профіль у футері сайдбара: Telegram-акаунт + меню функцій ──
  function dsbFillUser(){
    try{
      const u=window.Telegram&&Telegram.WebApp&&Telegram.WebApp.initDataUnsafe&&Telegram.WebApp.initDataUnsafe.user;
      const g=(window.sbUser&&window.sbUser())||null;
      const av=document.getElementById('dsbAv'), nm=document.getElementById('dsbNm');
      if(!av||!nm) return;
      if(u){
        const name=[u.first_name,u.last_name].filter(Boolean).join(' ')||u.username||'Користувач';
        nm.innerHTML=esc(name)+'<small>'+(u.username?'@'+esc(u.username):'Telegram')+'</small>';
        if(customAvatar){ av.style.background='url('+customAvatar+') center/cover'; av.textContent=''; }
        else if(u.photo_url){ av.style.background='url('+u.photo_url+') center/cover'; av.textContent=''; }
        else{ av.style.background=''; av.textContent=(name[0]||'F').toUpperCase(); av.style.display='grid'; av.style.placeItems='center'; av.style.fontWeight='800'; av.style.color='#fff'; }
      }else if(g){
        const gname=(g.user_metadata&&g.user_metadata.full_name)||g.email||'Google';
        nm.innerHTML=esc(gname)+'<small>'+esc(g.email||'Google')+'</small>';
        const pic=g.user_metadata&&g.user_metadata.avatar_url;
        if(customAvatar){ av.style.background='url('+customAvatar+') center/cover'; av.textContent=''; }
        else if(pic){ av.style.background='url('+pic+') center/cover'; av.textContent=''; }
        else{ av.style.background=''; av.textContent=(gname[0]||'G').toUpperCase(); av.style.display='grid'; av.style.placeItems='center'; av.style.fontWeight='800'; av.style.color='#fff'; }
      }else{
        /* Telegram прибрано 2026-08-29 — раніше тут стояло «відкрий через
           Telegram», що тепер просто неправда: вхід іде через Google.
           На native лишаємо нейтральний текст: рецензент App Store не має
           бачити пропозицію відкрити апку деінде (правило 2.1). */
        nm.innerHTML=window.FLOW_NATIVE
          ? 'Цей пристрій<small>дані зберігаються локально</small>'
          : 'Гість<small>увійди, щоб дані були на всіх пристроях</small>';
        if(customAvatar){ av.style.background='url('+customAvatar+') center/cover'; av.textContent=''; }
        else{ av.style.background=''; av.textContent='F'; av.style.display='grid'; av.style.placeItems='center'; av.style.fontWeight='800'; av.style.color='#fff'; }
      }
    }catch(e){ console.error('dsbFillUser',e); }
  }
  window.dsbFillUser=dsbFillUser;
  function dsbProfileSheet(){
    const old=document.getElementById('dsbProf'); if(old){ old.remove(); return; }
    const u=(window.Telegram&&Telegram.WebApp&&Telegram.WebApp.initDataUnsafe&&Telegram.WebApp.initDataUnsafe.user)||null;
    const g=(window.sbUser&&window.sbUser())||null;
    const name=u?([u.first_name,u.last_name].filter(Boolean).join(' ')||u.username||'Користувач')
      :(g?((g.user_metadata&&g.user_metadata.full_name)||g.email||'Google'):(window.FLOW_NATIVE?'Цей пристрій':'Гість'));
    const sub=u?(u.username?'@'+esc(u.username):'Telegram')
      :(g?esc(g.email||'Google'):(window.FLOW_NATIVE?'дані зберігаються локально':'Frequency'));
    const gPic=g&&g.user_metadata&&g.user_metadata.avatar_url;
    const photo=customAvatar||(u&&u.photo_url)||gPic||'';
    const ov=document.createElement('div'); ov.id='dsbProf'; ov.className='dsb-prof';
    ov.innerHTML=`<div class="dsb-prof-in">
      <div class="dpr-head">
        <div class="dpr-av">${photo?'<img src="'+photo+'" alt="">':(esc((name[0]||'F').toUpperCase()))}</div>
        <div class="dpr-nm">${esc(name)}<small>${sub}</small></div>
      </div>
      <button class="dpr-i" data-act="ai">✨ Відкрити Флоу</button>
      ${window.FLOW_NATIVE ? '' : '<button class="dpr-i" data-act="proxy">⚙️ AI-проксі</button>'}
      <button class="dpr-i" data-act="theme">🌓 Змінити тему</button>
      <button class="dpr-i" data-act="settings">⚙️ Всі налаштування</button>
    </div>`;
    ov.onclick=e=>{ if(e.target===ov) ov.remove(); };
    document.body.appendChild(ov);
    ov.querySelectorAll('.dpr-i').forEach(b=>b.onclick=()=>{
      const a=b.dataset.act; ov.remove();
      if(a==='ai'&&window.aiChatSheet) window.aiChatSheet();
      else if(a==='proxy'&&typeof aiConfig==='function') aiConfig(()=>{});
      else if(a==='theme'){ const t=document.getElementById('themeToggle'); if(t) t.click(); }
      else if(a==='settings'&&window.openSettingsSheet) window.openSettingsSheet();
    });
  }
  { const f=document.getElementById('dsbFoot'); if(f) f.onclick=dsbProfileSheet; }
  dsbFillUser();

  /* ═══ НАЛАШТУВАННЯ ═══
     Живуть як картка на екрані «Ще» (той самий стиль, що й картка бекапу —
     перевірена, стабільна верстка, без багів кастомної шторки). Мова, тема,
     AI-проксі, і (тільки в dev-режимі) переклад власного контенту. */
  function renderSettingsCard(){
    const host=document.getElementById('settingsCard'); if(!host) return;
    const lang=(window.flowLang&&window.flowLang())||'uk';
    const devOn=(typeof aiDevOn==='function')&&aiDevOn();
    const ctOn=(function(){ try{ return localStorage.getItem('dev_translate_content')==='1'; }catch(_){ return false; } })();
    host.innerHTML = `
      <div class="bkp-t">⚙️ Налаштування</div>
      <div class="stg-list">
        <div class="stg-row">
          <div class="stg-ic c-lang">🌐</div>
          <div class="stg-tx"><div class="stg-tt">Мова інтерфейсу</div><div class="stg-sub">Interface language</div></div>
          <div class="stg-seg" id="stgLangSeg">
            <button data-l="uk" class="${lang==='uk'?'on':''}">UA</button>
            <button data-l="en" class="${lang==='en'?'on':''}">EN</button>
          </div>
        </div>
        <div class="stg-row">
          <div class="stg-ic c-theme">🎨</div>
          <div class="stg-tx"><div class="stg-tt">Набір стилю</div><div class="stg-sub">${THEME_SETS[themeSetOf(theme)].name}</div></div>
          <div class="stg-seg" id="stgThemeSetSeg">
            ${Object.keys(THEME_SETS).map(id=>`<button data-ts="${id}" class="${themeSetOf(theme)===id?'on':''}">${THEME_SETS[id].name}</button>`).join('')}
          </div>
        </div>
        <div class="stg-row">
          <div class="stg-ic c-theme">🌓</div>
          <div class="stg-tx"><div class="stg-tt">Тема</div><div class="stg-sub">${THEME_META[theme]?THEME_META[theme][1]:'Світла / темна'}</div></div>
          <button class="stg-go" id="stgThemeBtn">Перемкнути</button>
        </div>
        <div class="stg-row">
          <div class="stg-ic c-theme">✨</div>
          <div class="stg-tx"><div class="stg-tt">Живе скло</div><div class="stg-sub">Новий вигляд Огляду · аврора та рідкий метал</div></div>
          <button class="stg-sw ${homeGlass?'on':''}" id="stgHomeGlassSw" aria-label="Живе скло"></button>
        </div>
        ${window.FLOW_NATIVE ? '' : `
        <div class="stg-row">
          <div class="stg-ic c-ai">🤖</div>
          <div class="stg-tx"><div class="stg-tt">AI-проксі</div><div class="stg-sub">Endpoint та ключ</div></div>
          <button class="stg-go" id="stgProxyBtn">Відкрити</button>
        </div>`}
        ${devOn ? `
        <div class="stg-row">
          <div class="stg-ic c-dev">🧪</div>
          <div class="stg-tx"><div class="stg-tt">Перекладати мій контент</div><div class="stg-sub">Папки, сторінки, нотатки → EN · dev</div></div>
          <button class="stg-sw ${ctOn?'on':''}" id="stgCtSw" aria-label="Перекладати контент"></button>
        </div>` : ''}
      </div>
    `;
    host.querySelectorAll('#stgLangSeg button').forEach(b=>b.onclick=()=>{
      const l=b.dataset.l;
      if(l!==lang && window.flowSetLang) window.flowSetLang(l);
      renderSettingsCard();
    });
    const tb=document.getElementById('stgThemeBtn'); if(tb) tb.onclick=()=>{ toggleTheme(); };
    { const seg=document.getElementById('stgThemeSetSeg');
      if(seg) seg.querySelectorAll('[data-ts]').forEach(b=>b.onclick=()=>setThemeSet(b.dataset.ts)); }
    const hgs=document.getElementById('stgHomeGlassSw'); if(hgs) hgs.onclick=()=>{ homeGlass=!homeGlass; applyHomeGlass(); saveHomeGlass(); renderSettingsCard(); };
    const pb=document.getElementById('stgProxyBtn'); if(pb) pb.onclick=()=>{ if(typeof aiConfig==='function') aiConfig(()=>{}); };
    const cs=document.getElementById('stgCtSw'); if(cs) cs.onclick=()=>{ if(typeof devContentTranslateToggleSheet==='function') devContentTranslateToggleSheet(); setTimeout(renderSettingsCard,50); };
  }
  window.renderSettingsCard = renderSettingsCard;
  document.addEventListener('flowlangchange', renderSettingsCard);
  function openSettings(){
    if(typeof goMore==='function') goMore();
    const host=document.getElementById('settingsCard'); if(!host) return;
    host.hidden=!host.hidden;
    if(window.__settingsScrollT){ clearTimeout(window.__settingsScrollT); window.__settingsScrollT=null; }
    if(!host.hidden){
      renderSettingsCard();
      window.__settingsScrollT=setTimeout(()=>{
        // скролимо, лише якщо картка реально виходить за межі видимої області —
        // якщо вона й так уже вміщується на екрані, зайвий стрибок не потрібен
        const r=host.getBoundingClientRect();
        const fits = r.top>=0 && r.bottom<=(window.innerHeight||document.documentElement.clientHeight);
        if(!fits) host.scrollIntoView({behavior:'smooth',block:'start'});
      },50);
    }
  }
  window.openSettingsSheet = openSettings; // збережено для сумісності викликів нижче
  { const gb=document.getElementById('dashSettingsBtn'); if(gb) gb.onclick=openSettings; }

  // ── сторінка папки: режим «на весь екран» ↔ «вузька колонка» ──
  { const wb=document.getElementById('pgWideBtn'), pg=document.getElementById('scr-page');
    if(wb&&pg){
      // водяна стрілка виходу із zen
      const zb=document.createElement('button');
      zb.className='pg-zenback'; zb.innerHTML='‹'; zb.title='Повернутись';
      document.body.appendChild(zb);
      function setZen(on){
        pg.classList.toggle('pg-zen',on);
        pg.classList.toggle('pg-wide',on);
        document.body.classList.toggle('pg-zen-on',on);
        try{ localStorage.setItem('pg_wide',on?'1':'0'); }catch(_){}
      }
      zb.onclick=()=>setZen(false);
      try{ if(localStorage.getItem('pg_wide')==='1') setZen(true); }catch(_){}
      wb.onclick=()=>setZen(!pg.classList.contains('pg-zen'));
    } }

  // ── бекап: експорт/імпорт усіх даних у файл (шлях до iCloud Drive через «Файли») ──
  (function(){
    var ex=document.getElementById('bkpExport'), im=document.getElementById('bkpImport'), note=document.getElementById('bkpNote');
    if(!ex||!im)return;
    function setNote(t){ if(note)note.textContent=t; }
    ex.onclick=function(){
      try{
        var data={_flow_backup:1, ts:new Date().toISOString(), keys:{}};
        for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); data.keys[k]=localStorage.getItem(k); }
        var json=JSON.stringify(data);
        var name='flow-backup-'+new Date().toISOString().slice(0,10)+'.json';
        var blob=new Blob([json],{type:'application/json'});
        var file=null; try{ file=new File([blob],name,{type:'application/json'}); }catch(_){}
        if(file && navigator.canShare && navigator.canShare({files:[file]})){
          navigator.share({files:[file],title:'Frequency бекап'})
            .then(function(){ setNote('Готово. У шиті обери «Зберегти у Файли» → iCloud Drive.'); })
            .catch(function(){ setNote('Скасовано.'); });
          return;
        }
        var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name;
        document.body.appendChild(a); a.click(); a.remove();
        setNote('Файл завантажено ('+Math.round(json.length/1024)+' КБ).');
      }catch(e){ setNote('Не вдалося: '+((e&&e.message)||e)); }
    };
    im.onclick=function(){
      var inp=document.createElement('input'); inp.type='file'; inp.accept='.json,application/json';
      inp.onchange=function(){
        var f=inp.files&&inp.files[0]; if(!f)return;
        var rd=new FileReader();
        rd.onload=function(){
          try{
            var data=JSON.parse(rd.result);
            if(!data||data._flow_backup!==1||!data.keys){ setNote('Це не файл бекапу Flow.'); return; }
            var n=Object.keys(data.keys).length;
            if(!confirm('Відновити бекап від '+(data.ts?data.ts.slice(0,16).replace('T',' '):'?')+'? Поточні дані на цьому пристрої буде замінено ('+n+' ключів).'))return;
            Object.keys(data.keys).forEach(function(k){ try{ localStorage.setItem(k,data.keys[k]); }catch(_){} });
            setNote('Відновлено. Перезавантажую…');
            setTimeout(function(){ location.reload(); },600);
          }catch(e){ setNote('Помилка читання: '+((e&&e.message)||e)); }
        };
        rd.readAsText(f);
      };
      inp.click();
    };
  })();

  // ── десктопний сайдбар: ті самі дії, що й мобільна навігація ──
  document.querySelectorAll('.dsb-i').forEach(b=>b.onclick=()=>{
    const k=b.dataset.dnav;
    if(k==='home') goHome();
    else if(k==='ai'){ if(window.aiChatSheet) window.aiChatSheet(); }
    else if(k==='folders'){ goHome(); setTimeout(()=>{ const el=document.getElementById('folderGrid'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); },120); }
    /* «Простір» прибрано з навігації — всі дошки живуть у папках */
    else if(k==='finance') goFinance();
    else if(k==='planner') goPlanner();
    else if(k==='projects'){ try{ goProjects(); }catch(e){ console.error('dnav projects',e); } }
    else if(k==='more') goMore();
  });

  // ── перемикач лейауту Простору (класичний ↔ три панелі), лише десктоп ──
  let spaceLayout='classic';
  try{ const sl=localStorage.getItem('spacelayout'); if(sl) spaceLayout=sl; }catch(_){}
  prefCatchup('spacelayout', v=>{ if(v) spaceLayout=v; });
  function applySpaceLayout(){
    document.body.classList.toggle('space-3pane', spaceLayout==='3pane');
    const btn=document.getElementById('spaceLayoutToggle');
    if(btn) btn.title = spaceLayout==='3pane' ? 'Лейаут: три панелі (тап → класичний)' : 'Лейаут: класичний (тап → три панелі)';
    if(spaceLayout==='3pane') renderPaneList();
  }
  { const b=document.getElementById('spaceLayoutToggle');
    if(b) b.onclick=()=>{ spaceLayout = spaceLayout==='3pane'?'classic':'3pane';
      try{ prefSet('spacelayout', spaceLayout); }catch(_){}
      applySpaceLayout(); renderBoard(); }; }

  // ── ЗГОРТАННЯ ЛІВОЇ ПАНЕЛІ + ПОВНОЕКРАННИЙ ПРОСТІР (десктоп) ──
  let sidebarCollapsed=false, spaceFull=false;
  try{ sidebarCollapsed = localStorage.getItem('sidebarcol')==='1'; }catch(_){}
  try{ spaceFull = localStorage.getItem('spacefull')==='1'; }catch(_){}
  prefCatchup('sidebarcol', v=>{ sidebarCollapsed = v==='1'; try{applyChrome();}catch(_){} });
  prefCatchup('spacefull', v=>{ spaceFull = v==='1'; try{applyChrome();}catch(_){} });
  function applyChrome(){
    document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
    document.body.classList.toggle('space-full', spaceFull);
    const ft=document.getElementById('spaceFullToggle');
    if(ft) ft.classList.toggle('on', spaceFull);
  }
  { const c=document.getElementById('sidebarCollapse');
    if(c) c.onclick=()=>{ sidebarCollapsed=true; try{prefSet('sidebarcol','1');}catch(_){} applyChrome(); }; }
  { const r=document.getElementById('sidebarReveal');
    if(r) r.onclick=()=>{ sidebarCollapsed=false; try{prefSet('sidebarcol','0');}catch(_){} applyChrome(); }; }
  { const f=document.getElementById('spaceFullToggle');
    if(f) f.onclick=()=>{ spaceFull=!spaceFull; try{prefSet('spacefull',spaceFull?'1':'0');}catch(_){}
      applyChrome(); try{window.platform.haptic('select');}catch(_){} }; }
  try{ applyChrome(); }catch(_){}

  // список блоків поточного рівня для лівої панелі (3-pane)
  function renderPaneList(){
    const el=document.getElementById('paneList'); if(!el) return;
    if(typeof currentLevelArr!=='function'){ el.innerHTML=''; return; }
    const arr=currentLevelArr();
    const ico=(t)=> (typeof blockIcon==='function')? blockIcon(t,16) : '';
    const subFor=(b)=>{
      if(isContainer(b)) return (b.children||[]).length+' елем.';
      if(b.type==='link') return (b.url||'').replace(/^https?:\/\//,'').split('/')[0]||'посилання';
      if(b.type==='check'||b.type==='list') return ((b.items||[]).length)+' пункт.';
      if(b.type==='note'||b.type==='quick') return 'текст';
      return (BLOCK_TYPES[b.type]||{}).title||'';
    };
    el.innerHTML = `<div class="pane-list-h">${folderPath&&folderPath.length?'У папці':'Блоки простору'}</div>`+
      arr.map(b=>{
        const t=BLOCK_TYPES[b.type]||{color:'#5b8def',title:'Блок'};
        const title = b.title || (b.text? String(b.text).slice(0,24) : t.title);
        return `<div class="pane-item" data-panejump="${b.id}" style="--pc:${t.color}">
          <span class="pi-ico">${ico(b.type)}</span>
          <span style="min-width:0"><span class="pi-nm">${esc(title)}</span><span class="pi-sub">${esc(subFor(b))}</span></span>
        </div>`;
      }).join('');
    el.querySelectorAll('[data-panejump]').forEach(it=>it.onclick=()=>{
      const b=getBlock(it.dataset.panejump);
      if(b&&isContainer(b)){ folderPath.push(it.dataset.panejump); renderBoard(); }
      else {
        const node=document.querySelector('[data-tileid="'+it.dataset.panejump+'"]');
        if(node) node.scrollIntoView({behavior:'smooth',block:'center'});
      }
    });
  }
  // ── Варіант 3: панель віджетів на Огляді (десктоп) ──
  let homeWidgets=false;
  try{ homeWidgets = localStorage.getItem('homewidgets')==='1'; }catch(_){}
  prefCatchup('homewidgets', v=>{ homeWidgets = v==='1'; });
  function applyHomeWidgets(){
    document.body.classList.toggle('home-widgets', homeWidgets);
    // якщо ми зараз на Огляді — гарантуємо клас in-home для показу панелі
    if(document.getElementById('scr-home')?.classList.contains('active')){
      document.body.classList.add('in-home');
    }
    if(homeWidgets) try{ renderRightRail(); }catch(_){}
  }
  { const b=document.getElementById('homeWidgetsToggle');
    if(b) b.onclick=()=>{ homeWidgets=!homeWidgets;
      try{ prefSet('homewidgets', homeWidgets?'1':'0'); }catch(_){}
      applyHomeWidgets(); }; }

  /* ── перемикач теми ──
     Три старі теми (dark / black / light) лишились як були — вони живуть
     у наборі «classic» і гортаються тією ж каруселлю, що й раніше.
     Додано два нові набори: desk («Робочий стіл») і studio («Студія»),
     у кожного своя світла й темна пара. Кнопка в шапці всередині нового
     набору не гортає по колу, а перемикає світло↔темно — з семи тем
     карусель була б незручною. Сам набір обирають у Налаштуваннях. */
  const THEME_SETS={
    classic:{ name:'Класична',      light:'light',        dark:'dark' },
    desk:   { name:'Робочий стіл',  light:'desk-light',   dark:'desk-dark' },
    studio: { name:'Студія',        light:'studio-light', dark:'studio-dark' },
  };
  // [значок, назва, колір шапки платформи, id SVG-іконки або '' для емодзі]
  const THEME_META={
    dark:          ['🌙','Frequency-дарк',        '#0c0e14',''],
    black:         ['⚫','Чорна (AMOLED)',        '#000000',''],
    light:         ['☀️','Світла',                '#f4f6fb',''],
    'desk-light':  ['', 'Робочий стіл · світла',  '#f6f7f9','i-sun'],
    'desk-dark':   ['', 'Робочий стіл · темна',   '#101317','i-moon'],
    'studio-light':['', 'Студія · світла',        '#f7f7f6','i-sun'],
    'studio-dark': ['', 'Студія · темна',         '#0e1011','i-moon'],
  };
  const THEME_KEYS=Object.keys(THEME_META);
  const isTheme=v=>THEME_KEYS.indexOf(v)>=0;
  // до якого набору належить тема (для перемикача в Налаштуваннях)
  function themeSetOf(t){
    for(const id in THEME_SETS){ const s=THEME_SETS[id]; if(s.light===t||s.dark===t) return id; }
    return 'classic'; // 'black' теж класика
  }
  function themeIsDark(t){ return t!=='light' && t!=='desk-light' && t!=='studio-light'; }
  let theme='dark';
  try{ const t=localStorage.getItem('flowtheme'); if(isTheme(t)) theme=t; }catch(_){}
  function applyTheme(){
    const r=document.documentElement;
    // 'dark' — тема за замовчуванням, вона живе на голому :root без атрибута
    if(theme==='dark') r.removeAttribute('data-theme');
    else r.setAttribute('data-theme',theme);
    // Клас-прапорець для стилів, спільних усім новим наборам: рівні поверхні
    // замість градієнтів, лінійні іконки замість емодзі. Один клас замість
    // дублювання селекторів [data-theme^="desk-"],[data-theme^="studio-"].
    const flat=themeSetOf(theme)!=='classic';
    r.classList.toggle('t-flat', flat);
    /* Другий прапорець — «це світла тема». У коді десятки правил написані як
       html[data-theme="light"]: вони знають лише про стару світлу тему й для
       desk-light / studio-light не спрацьовували, через що цілі екрани
       (AI-чат, тиждень, місяць) лишались темними посеред світлої теми.
       Замість переписувати кожне правило під кожну нову тему — один клас,
       який ті селектори отримують додатковою копією. */
    r.classList.toggle('t-light', flat && !themeIsDark(theme));
    const m=THEME_META[theme]||THEME_META.dark;
    const b=document.getElementById('themeToggle');
    if(b){
      if(m[3]) b.innerHTML=`<svg class="ico"><use href="#${m[3]}"/></svg>`;
      else b.textContent=m[0];
      b.title='Тема: '+m[1];
    }
    // синхронізувати колір шапки Telegram, якщо доступно
    window.platform.setBgColor(m[2]);
  }
  prefCatchup('flowtheme', v=>{ if(isTheme(v)){ theme=v; applyTheme(); } });
  function setTheme(t){
    if(!isTheme(t)||t===theme) return;
    theme=t;
    try{ prefSet('flowtheme', theme); }catch(_){}
    applyTheme();
    try{ if(typeof renderSettingsCard==='function') renderSettingsCard(); }catch(_){}
    try{ if(typeof plToast==='function'){ const m=THEME_META[theme]; plToast((m[0]?m[0]+' ':'')+m[1]); } }catch(_){}
    window.platform.haptic('light');
  }
  // вибір набору з Налаштувань: лишаємось на тій самій половині (світло/темно)
  function setThemeSet(id){
    const s=THEME_SETS[id]; if(!s) return;
    setTheme(themeIsDark(theme) ? s.dark : s.light);
  }
  function toggleTheme(){
    const set=themeSetOf(theme);
    // класика: стара карусель dark → black → light → dark, без змін
    if(set==='classic'){ setTheme(theme==='dark' ? 'black' : theme==='black' ? 'light' : 'dark'); return; }
    const s=THEME_SETS[set];
    setTheme(themeIsDark(theme) ? s.light : s.dark);
  }
  { const b=document.getElementById('themeToggle'); if(b) b.onclick=toggleTheme; }
  /* Обгортки для інших частин програми. Імена НАВМИСНО інші, ніж у самих
     функцій: файли складаються в один глобальний скоуп, тож window.themeSetOf
     затер би функцію themeSetOf і вона почала б викликати саму себе. */
  try{ window.flowSetThemeSet=setThemeSet; window.flowThemeSet=()=>themeSetOf(theme); window.FLOW_THEME_SETS=THEME_SETS; }catch(_){}

  // ── PRO-СТИЛЬ (Quiet Luxe + aurora + bento hero) ── увімкнено за замовчуванням
  let proTheme=true;
  try{ const p=localStorage.getItem('flowprotheme'); if(p==='0') proTheme=false; }catch(_){}
  function applyProTheme(){
    document.body.classList.toggle('theme-pro', proTheme);
    const b=document.getElementById('proThemeToggle');
    if(b){ b.classList.toggle('on', proTheme); b.title = proTheme?'Pro-стиль увімкнено (тап → вимкнути)':'Pro-стиль вимкнено (тап → увімкнути)'; }
  }
  prefCatchup('flowprotheme', v=>{ proTheme = v!=='0'; applyProTheme(); });
  function toggleProTheme(){
    proTheme=!proTheme;
    try{ prefSet('flowprotheme', proTheme?'1':'0'); }catch(_){}
    applyProTheme();
    try{ if(document.body.classList.contains('in-space')) renderBoard(); }catch(_){}
    try{ window.platform.haptic('light'); }catch(_){}
  }
  { const b=document.getElementById('proThemeToggle'); if(b) b.onclick=toggleProTheme; }

  // ── СТИЛЬ КАРТОК: класика / скло / бенто (вибір у налаштуваннях простору) ──
  let cardSkin='classic';
  try{ const cs=localStorage.getItem('flowcardskin'); if(cs==='glass'||cs==='bento') cardSkin=cs; }catch(_){}
  function applyCardSkin(){
    document.body.classList.toggle('cardskin-glass', cardSkin==='glass');
    document.body.classList.toggle('cardskin-bento', cardSkin==='bento');
    document.querySelectorAll('[data-cardskin]').forEach(b=>b.classList.toggle('on', b.dataset.cardskin===cardSkin));
  }
  prefCatchup('flowcardskin', v=>{ if(v==='classic'||v==='glass'||v==='bento'){ cardSkin=v; applyCardSkin(); } });
  function setCardSkin(v){
    cardSkin=v;
    try{ prefSet('flowcardskin', v); }catch(_){}
    applyCardSkin();
    window.platform.haptic('select');
  }
  try{ applyCardSkin(); }catch(_){}
  try{ applyProTheme(); }catch(_){}

  // ── ZEN / повноекранний Простір (моб+десктоп): ховає хедер, перемикач, нав-бар ──
  let zenMode=false;
  function applyZen(){
    document.body.classList.toggle('space-zen', zenMode);
    const b=document.getElementById('zenToggle');
    if(b) b.classList.toggle('on', zenMode);
    // у Telegram розгорнути на повну висоту, якщо можна
    try{ if(zenMode) window.platform.expand(); }catch(_){}
  }
  function setZen(on){ zenMode=on; applyZen(); try{ window.platform.haptic(on?'medium':'light'); }catch(_){}
    try{ if(document.body.classList.contains('in-space')) renderBoard(); }catch(_){} }
  { const b=document.getElementById('zenToggle'); if(b) b.onclick=()=>setZen(!zenMode); }
  { const x=document.getElementById('zenExit'); if(x) x.onclick=()=>setZen(false); }

  // кнопки панелі полотна
  { const zi=document.getElementById('czIn'); if(zi) zi.onclick=()=>{ setZoom(getZoom()+0.2,true); try{window.platform.haptic('select');}catch(_){} }; }
  { const zo=document.getElementById('czOut'); if(zo) zo.onclick=()=>{ setZoom(getZoom()-0.2,true); try{window.platform.haptic('select');}catch(_){} }; }
  { const zv=document.getElementById('czVal'); if(zv) zv.onclick=()=>{ setZoom(1,true); try{window.platform.haptic('light');}catch(_){} }; }
  { const zf=document.getElementById('czFit'); if(zf) zf.onclick=()=>{ fitAll(); }; }
  { const zt=document.getElementById('czTidy'); if(zt) zt.onclick=()=>{ tidyCanvas(); }; }
  { const zs=document.getElementById('czSnap'); if(zs) zs.onclick=()=>{ toggleSnap(); }; }
  { const sk=document.getElementById('czSkin'); if(sk) sk.onclick=()=>{ cycleCanvasSkin(); }; }
  { const ze=document.getElementById('czExit'); if(ze) ze.onclick=()=>{ if(isCanvasMode()) toggleCanvasMode(); }; }
  // міні-мапа: тап → стрибок у відповідну точку полотна
  { const mm=document.getElementById('canvasMinimap'); if(mm) mm.onclick=e=>{
      const board=document.getElementById('board'); if(!board||!mm._scale) return;
      const r=mm.getBoundingClientRect();
      const px=(e.clientX-r.left)/mm._scale, py=(e.clientY-r.top)/mm._scale; // лог. координати
      const z=getZoom();
      board.scrollLeft = px*z - board.clientWidth/2;
      board.scrollTop  = py*z - board.clientHeight/2;
      flashMinimap();
    }; }
  // вихід із Простору автоматично знімає zen
  try{
    document.querySelectorAll('.nav a').forEach(a=>{
      a.addEventListener('click',()=>{ if(zenMode) setZen(false); });
    });
  }catch(_){}

  // ЗІБРАТИ ВСЕ: акуратно скласти блоки в стрічку (скидає ручні позиції)
  function tidyCanvas(){
    if(!isCanvasMode()) return;
    confirmSheet({title:'Зібрати всі блоки в акуратну стрічку?', sub:'Поточні позиції скинуться.', okLabel:'Зібрати', onOk:()=>{
    currentLevelArr().forEach(b=>{ b.fx=null; b.fy=null; });
    saveBoard(); renderBoard();
    try{ window.platform.haptic('medium'); }catch(_){}
    }});
  }
  window.__fitAll=fitAll; window.__tidyCanvas=tidyCanvas;

  // ── фічу «ручний десктопний режим» видалено; чистимо старі збережені прапорці,
  //    щоб у користувачів не лишався зламаний viewport зі старих версій ──
  try{
    localStorage.removeItem('forcedesktop');
    localStorage.removeItem('forcemobile');
    if(typeof prefSet==='function'){ prefSet('forcedesktop','0'); prefSet('forcemobile','0'); }
  }catch(_){}

  // наповнення правої панелі: конфігуроване користувачем (вибір/порядок/вимкнення)
  const RR_DEFS={tasks:'🎯 Завдання', streak:'🔥 Streak', bal:'💰 Баланс', tip:'⚡ Підказка'};
  function rrCfg(){
    try{ const j=JSON.parse(localStorage.getItem('rrail_cfg')||''); 
      if(Array.isArray(j)&&j.length&&j.every(x=>x&&RR_DEFS[x.id])) return j; }catch(_){}
    return [{id:'tasks',on:true},{id:'streak',on:true},{id:'bal',on:true},{id:'tip',on:true}];
  }
  function rrSave(c){ try{ localStorage.setItem('rrail_cfg',JSON.stringify(c)); }catch(_){} }
  function rrCfgSheet(){
    const old=document.getElementById('rrCfgOv'); if(old){ old.remove(); return; }
    const ov=document.createElement('div'); ov.id='rrCfgOv'; ov.className='dsb-prof';
    const draw=()=>{
      const cfg=rrCfg();
      ov.innerHTML=`<div class="dsb-prof-in" style="left:auto;right:14px;bottom:auto;top:80px;width:270px">
        <div class="dpr-head" style="border-bottom:none;padding-bottom:6px"><div class="dpr-nm">Панель «Сьогодні»<small>що показувати і в якому порядку</small></div></div>
        ${cfg.map((w,i)=>`<div class="rrcfg-row">
          <label><input type="checkbox" data-rron="${i}" ${w.on?'checked':''}> ${RR_DEFS[w.id]}</label>
          <span class="rrcfg-mv"><button data-rrup="${i}" ${i===0?'disabled':''}>↑</button><button data-rrdn="${i}" ${i===cfg.length-1?'disabled':''}>↓</button></span>
        </div>`).join('')}
      </div>`;
      ov.querySelectorAll('[data-rron]').forEach(c=>c.onchange=()=>{ const cf=rrCfg(); cf[+c.dataset.rron].on=c.checked; rrSave(cf); renderRightRail(); draw(); });
      ov.querySelectorAll('[data-rrup]').forEach(b=>b.onclick=()=>{ const cf=rrCfg(), i=+b.dataset.rrup; [cf[i-1],cf[i]]=[cf[i],cf[i-1]]; rrSave(cf); renderRightRail(); draw(); });
      ov.querySelectorAll('[data-rrdn]').forEach(b=>b.onclick=()=>{ const cf=rrCfg(), i=+b.dataset.rrdn; [cf[i+1],cf[i]]=[cf[i],cf[i+1]]; rrSave(cf); renderRightRail(); draw(); });
    };
    ov.onclick=e=>{ if(e.target===ov) ov.remove(); };
    document.body.appendChild(ov); draw();
  }
  function renderRightRail(){
    const el=document.getElementById('rightRail'); if(!el) return;
    // завдання сьогодні — з блоків Простору типу task
    let taskTotal=0, taskDone=0;
    try{
      const walk=(arr)=>arr.forEach(b=>{
        if(b.type==='task'){ taskTotal++; if(b.done) taskDone++; }
        if(isContainer(b)&&Array.isArray(b.children)) walk(b.children);
      });
      Object.values(boards||{}).forEach(arr=>{ if(Array.isArray(arr)) walk(arr); });
    }catch(_){}
    // streak звичок (якщо доступно) — фолбек на 0
    let streak=0;
    try{ if(typeof habitStreak==='number') streak=habitStreak; }catch(_){}
    // фінансовий баланс
    let bal=null;
    try{ if(typeof items!=='undefined'){ let owe=0,owed=0; items.forEach(i=>{ if(i.cur==='UAH'){const v=balance(i); i.kind==='owe'?owe+=v:owed+=v;} }); bal=owed-owe; } }catch(_){}

    const W={
      tasks:`<div class="wgt" style="--wc:#5b8def"><div class="wh"><div class="wi">🎯</div><div><div class="wn">${taskTotal?taskTotal:'0'} завдань</div></div></div>
        <div class="wd">${taskTotal?`${taskDone} виконано · ${taskTotal-taskDone} лишилось`:'Додай завдання у папці'}</div></div>`,
      streak:`<div class="wgt" style="--wc:#34c77b"><div class="wh"><div class="wi">🔥</div><div><div class="wn">Streak ${streak} дн.</div></div></div>
        <div class="wd">${streak?'Звички тримаються':'Почни звичку сьогодні'}</div></div>`,
      bal:(bal!==null?`<div class="wgt" style="--wc:#e8843c"><div class="wh"><div class="wi">💰</div><div><div class="wn">Баланс</div></div></div>
        <div class="wbig" style="color:${bal<0?'var(--owe)':'var(--owed)'}">${(bal>0?'+':'')+ (typeof fmt==='function'?fmt(bal):bal)} ₴</div>
        <div class="wd">борги · чистий</div></div>`:''),
      tip:`<div class="wgt" style="--wc:#c77dff"><div class="wh"><div class="wi">⚡</div><div><div class="wn">Швидко</div></div></div>
        <div class="wd">Відкрий папку, щоб додати блок</div></div>`
    };
    el.innerHTML = `<div class="rrail-h">Сьогодні <button class="rrcfg-btn" id="rrCfgBtn" title="Налаштувати панель">⚙</button></div>`
      + rrCfg().filter(w=>w.on).map(w=>W[w.id]||'').join('');
    const g=el.querySelector('#rrCfgBtn'); if(g) g.onclick=rrCfgSheet;
  }

  function goGoals(){ try{ renderGoals(); show('scr-goals'); }catch(e){ console.error('goGoals',e); } }

  /* ════════ ЕКРАН «ПРОЄКТИ»: заводські (Робота, Агенція СЛ) + папки-проєкти ════════ */
  function prjHexToRgb(hex){
    try{
      let h=String(hex||'').replace('#','').trim();
      if(h.length===3) h=h.split('').map(c=>c+c).join('');
      const n=parseInt(h,16); if(isNaN(n)) return '106,125,255';
      return ((n>>16)&255)+','+((n>>8)&255)+','+(n&255);
    }catch(_){ return '106,125,255'; }
  }
  function prjTileHTML(o){
    // o: {k, emo, c:'r,g,b', t, d, badge?, badgeC?}
    const badge = o.badge?`<span class="mh-badge" ${o.badgeC?`style="background:${o.badgeC};color:#fff"`:''}>${o.badge}</span>`:'';
    return `<button class="mh-tile" data-prj="${o.k}" style="--mc:rgb(${o.c})">
      <div class="mh-orb" style="background:rgb(${o.c})"></div>
      <div class="mh-ico" style="background:rgba(${o.c},.18)">${o.emo}</div>
      <h4>${o.t}</h4><p>${o.d}</p>${badge}</button>`;
  }
  function renderProjects(){
    const host=document.getElementById('projectsBody'); if(!host) return;
    // заводські проєкти (🕶️ Агенція видима лише коли Vault розблоковано)
    const factory=[
      {k:'work',   emo:'💼', c:'106,125,255', t:'Робота',      d:'Зміни, ставка та зарплата'},
    ];
    if(vaultOpen) factory.push({k:'agency', emo:'🇸🇰', c:'91,141,239', t:'Агенція СЛ', d:'Клієнти, документи, фінанси', badge:'🕶️'});
    // папки-проєкти користувача (агенція вже є заводською — не дублюємо)
    const mine=projFolderKeys().filter(k=>k!==AGENCY_KEY).map(k=>{
      const f=folders[k];
      const st=projStatusMeta(f.status||'active');
      const pr=folderProgress(k);
      const dl=dueLabel(f.due);
      const bits=[];
      if(pr.total) bits.push(pr.done+'/'+pr.total+' · '+pr.pct+'%');
      if(dl&&dl.t) bits.push(dl.t);
      return {k:'f:'+k, emo:(f.emoji||'🚀'), c:prjHexToRgb(f.c), t:esc(f.name||'Проєкт'),
        d:bits.length?bits.join(' · '):'ще без кроків', badge:st[1], badgeC:st[2]};
    });
    host.innerHTML=
      `<div class="mh-lbl">⚡ Заводські</div>
       <div class="mh-grid">${factory.map(prjTileHTML).join('')}</div>
       <div class="mh-lbl mt">🚀 Мої проєкти</div>
       ${mine.length?`<div class="mh-grid">${mine.map(prjTileHTML).join('')}</div>`
         :`<div class="prj-empty">Тут зʼявляться твої проєкти. Створи перший — і він житиме на цій вкладці.</div>`}
       <button class="prj-add" data-prj="add">＋ Новий проєкт</button>`;
    host.querySelectorAll('[data-prj]').forEach(b=>b.addEventListener('click',()=>{
      const k=b.dataset.prj;
      try{ window.platform.haptic('light'); }catch(_){}
      if(k==='work'){ goWork(); return; }
      if(k==='agency'){ goAgency(); return; }
      if(k==='add'){ if(typeof createProjectFolder==='function') createProjectFolder(); return; }
      if(k.indexOf('f:')===0){ goFolder(k.slice(2)); return; }
    }));
  }
  function goProjects(){ try{ renderProjects(); show('scr-projects'); }catch(e){ console.error('goProjects',e); } }
  try{ window.goProjects=goProjects; window.renderProjects=renderProjects; }catch(_){}
  // 🕶️ непомітний вхід у Vault: довге утримання на заголовку «Проєкти»
  try{ const lp=document.querySelector('#scr-projects .brand'); if(lp) vaultAttachLongPress(lp); }catch(_){}
  function goPlanner(){ try{ const c=document.getElementById('plannerBody'); if(c) renderPlanner(c); show('scr-planner'); const sb=document.getElementById('plSettingsBtn'); if(sb) sb.onclick=()=>plRangeSheet(); const ab=document.getElementById('plAiBtn'); if(ab) ab.onclick=()=>aiChatSheet(); }catch(e){ console.error('goPlanner',e); } }
  function goValues(){ try{ renderValues(); show('scr-values'); }catch(e){ console.error('goValues',e); } }
  document.getElementById('valBack').onclick = () => { currentFolderKey=null; goHome(); };
  function goWishes(){ try{ renderWishes(); show('scr-wishes'); }catch(e){ console.error('goWishes',e); } }
  window.goWishes=goWishes;
  document.getElementById('wishBack').onclick = goHome;
  { const sc=document.getElementById('summaryCard'); if(sc) sc.onclick=goWishes; }
  document.getElementById('spaceBack').onclick = ()=>{
    if(folderPath.length){ folderPath.pop(); renderBoard(); return; }  // вийти на рівень вище
    // ЧИСТА ПАПКА: назад одразу до списку папок
    spaceFromFolder=null; currentFolderKey=null;
    goHome();
  };
  document.getElementById('folderBack').onclick = goHome;
  document.getElementById('debtsBack').onclick = () => goFolder('fin');
  document.getElementById('spendBack').onclick = () => goFolder('fin');
  { const wb=document.getElementById('workBack'); if(wb) wb.onclick=()=>{
      if(!workOrigin || workOrigin==='work') goProjects();
      else { renderFolder(workOrigin); show('scr-folder'); }
  }; }
  { const sb=document.getElementById('wkSpacesBtn'); if(sb) sb.onclick=()=>{ renderFolder(workOrigin||'work'); show('scr-folder'); }; }
  // ── AGENCY DASHBOARD wiring ──
  document.querySelectorAll('#agTabs .ag-tab').forEach(t=>t.onclick=()=>{ agTab=t.dataset.agp; renderAgency(); try{agEnterFx();}catch(_){}
    try{ window.platform.haptic('select'); }catch(_){} });
  { const ab=document.getElementById('agencyBack'); if(ab) ab.onclick=()=>{ goProjects(); }; }
  { const asb=document.getElementById('agencySpacesBtn'); if(asb) asb.onclick=()=>{ goSpaceFor(AGENCY_KEY); }; }
  { const cb=document.getElementById('clientBack'); if(cb) cb.onclick=()=>{ agTab='cli'; goAgency(); }; }
  document.getElementById('finBack').onclick = () => { currentFolderKey=null; goHome(); };
  (function(){ const d=document.getElementById('e2Dim'); if(d) d.onclick=()=>{ try{closeEnvSheet();}catch(_){}}; })();

