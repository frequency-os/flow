  /* ════════ АПГРЕЙД (dev): персонаж, сфери життя, заявлений шлях ════════
     Оболонка над наявними системами: власних даних мінімум (профіль сфер +
     заявлений шлях + зрізи), решту читаємо з планера/цілей/щоденника.
     Екран видно лише в dev-режимі: акаунт Ярослава або прапорець flow_dev. */
  (function(){
    const UPKEY='upgrade_profile_v1';
    const UP_DEV_EMAIL='life.yaroslav.kril@gmail.com';
    const UP_XP_LEVEL=100; // досвіду на рівень сфери
    const UP_DEF_SPHERES=[
      {id:'health', name:'Здоровʼя', emo:'💪', c:'#34c77b'},
      {id:'craft',  name:'Справа',   emo:'🔥', c:'#e8843c'},
      {id:'money',  name:'Фінанси',  emo:'💰', c:'#f0b429'},
      {id:'people', name:'Стосунки', emo:'💛', c:'#ff6b9d'},
      {id:'growth', name:'Розвиток', emo:'📚', c:'#5b8def'},
      {id:'sense',  name:'Сенс',     emo:'✨', c:'#c4a8ff'},
    ];
    let upData=null, upLoaded=false;

    function upEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    function upNorm(){
      if(!upData||typeof upData!=='object') upData={};
      if(typeof upData.path!=='string') upData.path='';
      if(typeof upData.pathDate!=='string') upData.pathDate='';
      if(!Array.isArray(upData.spheres)||!upData.spheres.length)
        upData.spheres=UP_DEF_SPHERES.map(s=>({...s, level:1, xp:0}));
      upData.spheres.forEach(s=>{
        if(typeof s.name!=='string') s.name='Сфера';
        if(typeof s.emo!=='string') s.emo='●';
        if(typeof s.c!=='string') s.c='#8b7cff';
        s.level=Math.max(1, Math.round(+s.level||1));
        s.xp=Math.max(0, Math.min(UP_XP_LEVEL, Math.round(+s.xp||0)));
      });
      if(!Array.isArray(upData.snapshots)) upData.snapshots=[];
    }
    async function upLoad(){
      if(upLoaded) return;
      try{
        const r=await window.storage.get(UPKEY);
        const d=r&&r.value?JSON.parse(r.value):null;
        if(d&&typeof d==='object') upData=d;
      }catch(_){}
      upNorm(); upLoaded=true;
    }
    function upSave(){ try{ const p=window.storage.set(UPKEY,JSON.stringify(upData)); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }

    /* dev-ворота: бачить лише власник акаунта або пристрій із flow_dev=1 */
    function upDevOn(){
      try{ if(localStorage.getItem('flow_dev')==='1') return true; }catch(_){}
      try{ const u=window.sbUser&&window.sbUser(); if(u&&String(u.email||'').toLowerCase()===UP_DEV_EMAIL) return true; }catch(_){}
      return false;
    }
    window.upDevOn=upDevOn;

    function upOverall(){
      const ss=upData.spheres;
      const lvl=Math.max(1, Math.round(ss.reduce((a,s)=>a+s.level,0)/ss.length));
      const pct=Math.round(ss.reduce((a,s)=>a+s.xp,0)/(ss.length*UP_XP_LEVEL)*100);
      return {lvl, pct};
    }
    function upUserName(){
      try{ const u=window.platform.user(); if(u&&u.first_name) return u.first_name; }catch(_){}
      try{ const u=window.sbUser&&window.sbUser(); if(u&&u.email) return String(u.email).split('@')[0]; }catch(_){}
      return 'Ти';
    }
    function upAvatarHTML(){
      try{
        if(typeof customAvatar==='string'&&customAvatar)
          return `<div class="up-av" style="background:url(${customAvatar.replace(/'/g,'%27').replace(/"/g,'%22')}) center/cover"></div>`;
      }catch(_){}
      return `<div class="up-av">🧑‍🚀</div>`;
    }

    function upSphereCard(s,i){
      const pct=Math.round(s.xp/UP_XP_LEVEL*100);
      return `<button class="up-card" data-upsp="${i}">
        <div class="up-card-h"><span class="up-card-ico" style="background:${upEsc(s.c)}22">${upEsc(s.emo)}</span><b>${upEsc(s.name)}</b></div>
        <div class="up-card-m"><span>рів. ${s.level}</span><span style="color:${upEsc(s.c)}">${pct}%</span></div>
        <div class="up-bar"><i style="width:${pct}%;background:${upEsc(s.c)}"></i></div>
      </button>`;
    }

    function renderUpgrade(){
      const host=document.getElementById('upgradeBody'); if(!host) return;
      const o=upOverall();
      const pathHTML = upData.path
        ? `<button class="up-path" data-uppath>«${upEsc(upData.path)}»</button>`
        : `<button class="up-path empty" data-uppath>Шлях ще не заявлено — розкажи, куди йдеш</button>`;
      host.innerHTML=`
        <div class="up-hero">
          <div class="up-ring" style="background:conic-gradient(var(--accent) 0 ${Math.max(2,o.pct)}%, var(--card) ${Math.max(2,o.pct)}% 100%)">
            <div class="up-ring-in">${upAvatarHTML()}</div>
          </div>
          <div class="up-lvl">Рівень ${o.lvl}</div>
          <div class="up-name">${upEsc(upUserName())}</div>
          ${pathHTML}
        </div>
        <div class="up-xp">
          <div class="up-xp-t"><span>Досвід шляху</span><b>${upData.spheres.reduce((a,s)=>a+s.xp,0)} / ${upData.spheres.length*UP_XP_LEVEL}</b></div>
          <div class="up-bar big"><i style="width:${o.pct}%"></i></div>
        </div>
        <div class="up-grid">${upData.spheres.map(upSphereCard).join('')}</div>
        <button class="up-cta" data-upanalyze>✦ Проаналізувати мій рух</button>
        <div class="up-cta-sub">${upLastSnapLine()}</div>`;

      host.querySelectorAll('[data-uppath]').forEach(el=>el.addEventListener('click',upEditPath));
      host.querySelectorAll('[data-upsp]').forEach(el=>el.addEventListener('click',()=>upEditSphere(+el.dataset.upsp)));
      const an=host.querySelector('[data-upanalyze]'); if(an) an.addEventListener('click',upAnalyze);
    }
    function upLastSnapLine(){
      const sn=upData.snapshots[upData.snapshots.length-1];
      if(!sn) return 'AI звірить твої дні із заявленим шляхом';
      try{
        const p=String(sn.d).split('-').map(Number);
        const MN=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
        return 'Останній зріз: '+p[2]+' '+MN[p[1]-1];
      }catch(_){ return 'Останній зріз: '+upEsc(sn.d); }
    }

    function upEditPath(){
      if(typeof inputModal!=='function') return;
      inputModal({title:'Мій шлях — куди я йду', value:upData.path, onOk:v=>{
        upData.path=String(v||'').trim();
        if(upData.path&&!upData.pathDate) upData.pathDate=new Date().toISOString().slice(0,10);
        upSave(); renderUpgrade();
      }});
    }
    function upEditSphere(i){
      const s=upData.spheres[i]; if(!s||typeof inputModal!=='function') return;
      inputModal({title:'Назва сфери', value:s.name, onOk:v=>{
        if(v&&v.trim()) s.name=v.trim().slice(0,24);
        upSave(); renderUpgrade();
      }});
    }
    /* ── AI-аналіз руху: планер + щоденник проти заявленого шляху ── */

    /* дні періоду: від останнього зрізу (не включно), максимум 14 днів назад.
       Читаємо blocksByDay напряму, БЕЗ plBlocksFor — щоб не матеріалізувати
       повторювані блоки в минулі дні (побічний запис у дані планера). */
    function upCollectDays(){
      const last=upData.snapshots.length?String(upData.snapshots[upData.snapshots.length-1].d||''):'';
      const days=[];
      let byDay={}; try{ const p=plData(); byDay=p.blocksByDay||{}; }catch(_){}
      for(let i=13;i>=0;i--){
        const ds=ymdLocal(new Date(Date.now()-i*86400000));
        if(last && ds<=last) continue;
        const list=Array.isArray(byDay[ds])?byDay[ds]:[];
        const items=list.map(b=>(b.done?'[x] ':'[ ] ')+String(b.t||'').slice(0,60)).filter(s=>s.trim().length>4);
        let dia=''; try{ const e=(typeof diaryEntries==='object'&&diaryEntries)?diaryEntries[ds]:null; if(e&&e.text) dia=String(e.text).replace(/\s+/g,' ').slice(0,220); }catch(_){}
        if(items.length||dia) days.push({ds, items, dia});
      }
      return days;
    }
    function upBuildPrompt(days){
      const sys='Ти — «дзеркало руху» в застосунку Frequency. Людина заявила свій шлях і сфери життя. '
        +'Тобі дають її реальні дні: блоки планера ([x] — зроблено, [ ] — ні) та записи щоденника. '
        +'Оціни ЧЕСНО, чи ці дні працювали на заявлений шлях — окремо по кожній сфері. '
        +'Відповідай ЛИШЕ валідним JSON одним рядком, без markdown і пояснень: '
        +'{"summary":"2-3 речення підсумку українською, звертайся на ти, чесно і по-людськи","spheres":[{"id":"...","verdict":"одне чесне речення по цій сфері","xp":0}]} '
        +'де xp — ціле число 0..30: 0 — жодного руху в сфері за період, 30 — потужний стабільний рух. '
        +'Використовуй ЛИШЕ передані id сфер, кожну сферу згадай рівно один раз. '
        +'Якщо даних по сфері немає — так і скажи у verdict і дай xp 0-3. Не вигадуй фактів поза наданим контекстом.';
      const lines=[];
      lines.push('ЗАЯВЛЕНИЙ ШЛЯХ: «'+upData.path+'»'+(upData.pathDate?' (заявлено '+upData.pathDate+')':''));
      lines.push('СФЕРИ: '+upData.spheres.map(s=>s.id+' — '+s.name).join('; '));
      lines.push('ДНІ ('+days.length+'):');
      days.forEach(d=>{
        let ln=d.ds+': '+(d.items.length?d.items.join('; '):'планер порожній');
        if(d.dia) ln+=' · Щоденник: «'+d.dia+'»';
        lines.push(ln);
      });
      return {sys, user:lines.join('\n')};
    }
    function upParseVerdict(txt){
      let t=String(txt||'').replace(/```json|```/g,'').trim();
      const a=t.indexOf('{'), b=t.lastIndexOf('}');
      if(a<0||b<=a) throw new Error('no json');
      const d=JSON.parse(t.slice(a,b+1));
      if(typeof d.summary!=='string'||!Array.isArray(d.spheres)) throw new Error('bad shape');
      const out={summary:d.summary.trim().slice(0,600), gains:{}, verdicts:{}};
      d.spheres.forEach(x=>{
        if(!x||typeof x.id!=='string') return;
        if(!upData.spheres.some(s=>s.id===x.id)) return;
        out.gains[x.id]=Math.max(0,Math.min(30,Math.round(+x.xp||0)));
        out.verdicts[x.id]=String(x.verdict||'').trim().slice(0,200);
      });
      if(!Object.keys(out.gains).length) throw new Error('no spheres');
      return out;
    }
    function upSheet(bodyHTML){
      const old=document.querySelector('.mh-sheet.up-sheet'); if(old) old.remove();
      const ov=document.createElement('div'); ov.className='mh-sheet up-sheet';
      ov.innerHTML=`<div class="mh-sheet-in">
        <div class="mh-grip"></div>
        <div class="mh-sheet-h">
          <div class="mh-ico" style="background:rgba(139,124,255,.18)">✦</div>
          <div><h3>AI-аналіз руху</h3><span>звірка днів із заявленим шляхом</span></div></div>
        <div class="mh-sheet-body up-vd-body">${bodyHTML}</div>
      </div>`;
      ov.addEventListener('click',e=>{ if(e.target===ov) ov.remove(); });
      document.body.appendChild(ov);
      return ov;
    }
    function upApplyVerdict(v){
      upData.spheres.forEach(s=>{
        const add=v.gains[s.id]||0;
        s.xp+=add;
        while(s.xp>=UP_XP_LEVEL){ s.xp-=UP_XP_LEVEL; s.level++; }
      });
      upData.snapshots.push({
        d:ymdLocal(), summary:v.summary, gains:v.gains, verdicts:v.verdicts,
        levels:upData.spheres.map(s=>({id:s.id, level:s.level, xp:s.xp}))
      });
      if(upData.snapshots.length>60) upData.snapshots=upData.snapshots.slice(-60);
      upSave(); renderUpgrade();
      try{ window.platform.haptic('success'); }catch(_){}
    }
    async function upAnalyze(){
      try{ window.platform.haptic('light'); }catch(_){}
      if(!upData.path){ upEditPath(); return; }
      const days=upCollectDays();
      if(!days.length){
        upSheet('За цей період у планері й щоденнику порожньо — AI нема з чого робити висновок. Поживи кілька днів у застосунку і повертайся.');
        return;
      }
      const ov=upSheet('<div class="up-vd-wait">✦ Дивлюся на твої дні…<br><small>'+days.length+' дн. · планер + щоденник</small></div>');
      let v;
      try{
        const p=upBuildPrompt(days);
        const txt=await aiCall(p.sys,[{role:'user',content:p.user}]);
        v=upParseVerdict(txt);
      }catch(e){
        console.error('upAnalyze',e);
        const body=ov.querySelector('.up-vd-body');
        if(body) body.innerHTML='Не вдалося отримати аналіз — перевір зʼєднання і спробуй ще раз.<br><small style="color:var(--muted)">'+upEsc(String(e&&e.message||e))+'</small>';
        return;
      }
      const total=Object.values(v.gains).reduce((a,x)=>a+x,0);
      const rows=upData.spheres.map(s=>{
        const add=v.gains[s.id]; if(add==null) return '';
        return `<div class="up-vd-row">
          <span class="up-card-ico" style="background:${upEsc(s.c)}22">${upEsc(s.emo)}</span>
          <div class="up-vd-tx"><b>${upEsc(s.name)}</b><small>${upEsc(v.verdicts[s.id]||'')}</small></div>
          <span class="up-vd-xp" style="color:${upEsc(s.c)}">+${add}</span>
        </div>`;
      }).join('');
      const body=ov.querySelector('.up-vd-body');
      if(!body) return;
      body.innerHTML=`<p class="up-vd-sum">${upEsc(v.summary)}</p>${rows}
        <button class="up-cta up-vd-ok">Зарахувати ріст · +${total} досвіду</button>
        <button class="up-vd-no">Не зараховувати</button>`;
      const okB=body.querySelector('.up-vd-ok');
      if(okB) okB.addEventListener('click',()=>{ upApplyVerdict(v); ov.remove(); });
      const noB=body.querySelector('.up-vd-no');
      if(noB) noB.addEventListener('click',()=>ov.remove());
    }

    function goUpgrade(){
      (async()=>{
        try{
          await upLoad(); renderUpgrade();
          const sh=window.__show||window.show||(typeof show==='function'?show:null);
          if(sh) sh('scr-upgrade');
        }catch(e){ console.error('goUpgrade',e); }
      })();
    }
    window.goUpgrade=goUpgrade;

    { const b=document.getElementById('upBack'); if(b) b.onclick=()=>{ if(window.goMore) window.goMore(); }; }
  })();
