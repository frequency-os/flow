  /* ============ VALUES / «Створи себе» ============ */
  const VAL_KEY='values_state';
  const VALUES_LIBRARY=[
    'Свобода','Чесність','Розвиток','Сім’я','Здоров’я','Творчість','Любов','Стабільність',
    'Пригоди','Дисципліна','Незалежність','Доброта','Сміливість','Мудрість','Дружба','Гроші',
    'Визнання','Спокій','Справедливість','Вірність','Відповідальність','Краса','Влада','Знання',
    'Допомога іншим','Самовираження','Успіх','Автентичність','Гумор','Турбота','Амбіції','Баланс',
    'Простота','Духовність','Лідерство','Майстерність','Енергія','Довіра','Вдячність','Зростання',
    'Сенс','Вплив','Радість','Терпіння','Рішучість','Витривалість','Гнучкість','Порядок',
    'Пристрасть','Щедрість','Скромність','Оптимізм','Цілісність','Сила','Затишок','Свіжість',
    'Пізнання','Командність','Самоповага','Спадщина'
  ];
  let valState={
    selected:[],          // обрані цінності (бібліотека)
    rank:[],              // [{name, why}] — топ-опори в порядку
    vision:{},            // {q_id: text}
    anti:{},              // {q_id: text}
    focusName:'',         // цінність дня
    focusDate:'',         // дата останнього вибору фокусу
    streak:0,
    lastDone:'',          // YYYY-MM-DD коли востаннє відмічено
    journal:[]            // [{date, focus, text}]
  };
  let valTab='compass';

  async function loadValues(){
    try{ const r=await window.storage.get(VAL_KEY,false); if(r&&r.value) valState=Object.assign(valState,JSON.parse(r.value)); }catch(_){}
  }
  function saveValues(){ try{ const p=window.storage.set(VAL_KEY,JSON.stringify(valState),false); if(p&&p.catch)p.catch(()=>{}); }catch(_){} }
  function todayStr(){ return ymdLocal(); }
  function dmy(s){ try{ const d=new Date(s); return d.toLocaleDateString('uk-UA',{day:'numeric',month:'short'}); }catch(_){ return s; } }

  const VISION_Q=[
    {id:'who', em:'🌟', q:'Хто я через 3 роки?', hint:'Опиши себе як уже сталу людину: характер, як тримаєш себе, що в тобі головне.'},
    {id:'do',  em:'⚙️', q:'Чим я займаюсь і що створюю?', hint:'Робота, проєкти, контент, гроші — як виглядає твій звичайний день.'},
    {id:'why', em:'❤️', q:'Заради чого я це роблю?', hint:'Твоє «навіщо». Що змінюється у світі / у твоєму житті завдяки тобі.'},
    {id:'who2',em:'🤝', q:'Хто поряд зі мною?', hint:'Стосунки, оточення, з ким будуєш життя і яким є у цих зв’язках.'},
    {id:'feel',em:'🧘', q:'Що я відчуваю щодня?', hint:'Стан, який хочеш переживати як норму — не виняток.'},
  ];
  const ANTI_Q=[
    {id:'never',em:'🚫', q:'Яким я точно НЕ хочу стати?', hint:'Опиши версію себе, від якої тікаєш. Часто напрям видно через те, чого уникаєш.'},
    {id:'stop', em:'🪓', q:'Що я хочу прибрати з життя?', hint:'Звички, люди, шаблони, які тягнуть назад.'},
    {id:'cost', em:'⏳', q:'Що буде, якщо нічого не змінити?', hint:'Чесно — куди приведе нинішня траєкторія через 5 років.'},
  ];
  const DAILY_AM=[
    {id:'am1', q:'Як я можу прожити сьогодні за своєю головною цінністю?'},
    {id:'am2', q:'Одна дія сьогодні, якою я наближаюсь до образу себе?'},
  ];
  const DAILY_PM=[
    {id:'pm1', q:'Де сьогодні я був(ла) собою? Де — ні?'},
    {id:'pm2', q:'Що завтра зроблю інакше?'},
  ];

  function renderValues(){
    const body=document.getElementById('valuesBody'); if(!body) return;
    const tabs=[['compass','🧭 Компас'],['vision','🌅 Бачення'],['anti','🚫 Анти'],['daily','🔥 Щодня']];
    const idx=tabs.findIndex(t=>t[0]===valTab);
    const chips=tabs.map(([k,l])=>`<button class="v-chip ${valTab===k?'on':''}" data-vtab="${k}">${l}</button>`).join('');
    const dots=tabs.map((t,i)=>`<i class="${i===idx?'on':''}"></i>`).join('');
    body.innerHTML=`<div class="v-chips">${chips}</div><div id="vPane"></div><div class="v-dots">${dots}</div>`;
    body.querySelectorAll('[data-vtab]').forEach(b=>b.onclick=()=>{ valTab=b.dataset.vtab; renderValues(); });
    const pane=document.getElementById('vPane');
    let sx=0;
    pane.addEventListener('touchstart',e=>{ sx=e.touches[0].clientX; },{passive:true});
    pane.addEventListener('touchend',e=>{ const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)<50)return;
      let ni=idx+(dx<0?1:-1); if(ni<0)ni=tabs.length-1; if(ni>=tabs.length)ni=0; valTab=tabs[ni][0]; renderValues(); },{passive:true});
    if(valTab==='compass') renderCompass(pane);
    else if(valTab==='vision') renderValVision(pane);
    else if(valTab==='anti') renderAnti(pane);
    else renderDaily(pane);
  }

  function renderCompass(p){
    const sel=valState.selected;
    const tags=VALUES_LIBRARY.map(v=>`<div class="v-tag ${sel.includes(v)?'sel':''}" data-vt="${escAttr(v)}">${esc(v)}</div>`).join('');
    const rankHtml = valState.rank.length ? valState.rank.map((r,i)=>`
      <div class="v-rankitem">
        <div class="num">${i+1}</div>
        <div class="body">
          <div class="t">${esc(r.name)}</div>
          <div class="why" data-why="${i}">${r.why?esc(r.why):'<span style="opacity:.6">+ навіщо ця цінність для тебе</span>'}</div>
        </div>
        <div class="arrows">
          <button data-up="${i}" ${i===0?'disabled style=opacity:.3':''}>▲</button>
          <button data-down="${i}" ${i===valState.rank.length-1?'disabled style=opacity:.3':''}>▼</button>
        </div>
      </div>`).join('') : '<div class="v-empty">Обери цінності зі списку нижче, потім познач до 5 головних — вони стануть твоїми опорами для рішень.</div>';

    p.innerHTML=`
      <div class="v-hero">
        <div class="hl">Крок 1 · Компас</div>
        <div class="hv">Спочатку зрозумій, на чому стоїш</div>
        <div class="hs">Не знаєш, куди йдеш — почни з того, що для тебе по-справжньому важливо. Обери все, що відгукується, далі залиш 5 опор. За ними звірятимеш кожне рішення.</div>
      </div>
      <div class="v-sec">Твої опори <span class="n">${valState.rank.length}/5</span></div>
      <div class="v-rank">${rankHtml}</div>
      <div class="v-sec">Бібліотека цінностей <span class="n">тапни, щоб обрати</span></div>
      <div class="v-grid">${tags}</div>
      <button class="v-btn ghost" id="vAddCustom" style="margin-top:14px">+ Додати свою цінність</button>
    `;

    p.querySelectorAll('[data-vt]').forEach(t=>t.onclick=()=>{
      const name=t.dataset.vt;
      const i=valState.selected.indexOf(name);
      if(i>=0){ valState.selected.splice(i,1); valState.rank=valState.rank.filter(r=>r.name!==name); }
      else{ valState.selected.push(name); if(valState.rank.length<5) valState.rank.push({name,why:''}); }
      saveValues(); renderCompass(p);
    });
    p.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.up; [valState.rank[i-1],valState.rank[i]]=[valState.rank[i],valState.rank[i-1]]; saveValues(); renderCompass(p); });
    p.querySelectorAll('[data-down]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.down; [valState.rank[i+1],valState.rank[i]]=[valState.rank[i],valState.rank[i+1]]; saveValues(); renderCompass(p); });
    p.querySelectorAll('[data-why]').forEach(el=>el.onclick=()=>{ const i=+el.dataset.why;
      inputModal({title:'Навіщо тобі «'+valState.rank[i].name+'»?', value:valState.rank[i].why||'', placeholder:'Чому це важливо саме для тебе',
        onOk:(v)=>{ valState.rank[i].why=v; saveValues(); renderCompass(p); }}); });
    p.querySelector('#vAddCustom').onclick=()=>{
      inputModal({title:'Своя цінність', placeholder:'Напр. Майстерність', onOk:(v)=>{ if(!v)return;
        if(!VALUES_LIBRARY.includes(v)) VALUES_LIBRARY.push(v);
        if(!valState.selected.includes(v)){ valState.selected.push(v); if(valState.rank.length<5) valState.rank.push({name:v,why:''}); }
        saveValues(); renderCompass(p); }});
    };
  }

  function renderEditCards(p, list, store, heroTitle, heroSub, step){
    const cards=list.map(q=>`
      <div class="v-card">
        <div class="q"><span class="em">${q.em}</span>${esc(q.q)}</div>
        <div class="hint">${esc(q.hint)}</div>
        <textarea data-vq="${q.id}" placeholder="Пиши вільно, без оцінок…">${esc(valState[store][q.id]||'')}</textarea>
      </div>`).join('');
    p.innerHTML=`
      <div class="v-hero">
        <div class="hl">${step}</div>
        <div class="hv">${heroTitle}</div>
        <div class="hs">${heroSub}</div>
      </div>
      ${cards}
      <div class="v-note" style="margin-top:6px">Зберігається автоматично. Повертайся й переписуй — образ себе уточнюється з часом.</div>`;
    p.querySelectorAll('[data-vq]').forEach(t=>{
      t.oninput=()=>{ valState[store][t.dataset.vq]=t.value; saveValues(); };
    });
  }
  function renderValVision(p){
    renderEditCards(p, VISION_Q, 'vision',
      'Куди ти йдеш', 'Образ себе, до якого рухаєшся. Пиши в теперішньому часі — ніби це вже ти. Це твоя ціль як людини, а не список завдань.', 'Крок 2 · Бачення');
  }
  function renderAnti(p){
    renderEditCards(p, ANTI_Q, 'anti',
      'Чого ти точно не хочеш', 'Інколи напрям видно ясніше через те, від чого тікаєш. Назви це чесно — і відштовхуйся.', 'Крок 3 · Анти-бачення');
  }

  function renderDaily(p){
    const today=todayStr();
    if(valState.lastDone){
      const diff=Math.round((new Date(today)-new Date(valState.lastDone))/864e5);
      if(diff>1) valState.streak=0;
    }
    if(valState.focusDate!==today){
      const pool=valState.rank.length?valState.rank.map(r=>r.name):valState.selected;
      if(pool.length){ valState.focusName=pool[Math.floor(Math.random()*pool.length)]; valState.focusDate=today; saveValues(); }
    }
    const doneToday=valState.lastDone===today;
    const focusObj=valState.rank.find(r=>r.name===valState.focusName);
    const noVals=!valState.rank.length && !valState.selected.length;

    const amCards=DAILY_AM.map(q=>`
      <div class="v-card"><div class="q">🌅 ${esc(q.q)}</div>
      <textarea data-jq="${q.id}" placeholder="Коротко, чесно…"></textarea></div>`).join('');
    const pmCards=DAILY_PM.map(q=>`
      <div class="v-card"><div class="q">🌙 ${esc(q.q)}</div>
      <textarea data-jq="${q.id}" placeholder="Коротко, чесно…"></textarea></div>`).join('');

    const journal=valState.journal.slice(-7).reverse().map(j=>`
      <div class="v-jentry"><div class="d">${dmy(j.date)} · ${esc(j.focus||'')}</div><div class="tx">${esc(j.text)}</div></div>`).join('');

    p.innerHTML=`
      <div class="v-streak">
        <div><div class="big">${valState.streak}🔥</div><div class="lab">днів поспіль</div></div>
        <div style="flex:1"><div style="font-weight:700;font-size:14px">Щоденна звірка з собою</div>
        <div style="font-size:12.5px;color:var(--muted);margin-top:3px;line-height:1.45">2 хвилини вранці й увечері. Так цінності перестають бути словами й стають тобою.</div></div>
      </div>
      ${noVals?'<div class="v-empty">Спершу обери цінності у вкладці «Компас» — тоді тут з’явиться цінність дня.</div>':`
      <div class="v-focus">
        <div class="lab">Цінність дня</div>
        <div class="nm">${esc(valState.focusName||'—')}</div>
        ${focusObj&&focusObj.why?`<div class="ds">${esc(focusObj.why)}</div>`:'<div class="ds">Сьогодні дій так, щоб увечері міг сказати: я прожив день за цією цінністю.</div>'}
      </div>
      <div class="v-sec">🌅 Ранок</div>${amCards}
      <div class="v-sec">🌙 Вечір</div>${pmCards}
      ${doneToday?'<div class="v-done">✓ Сьогодні вже відмічено. Завтра — нова звірка.</div>':'<button class="v-btn" id="vDoneBtn">Зберегти день і відмітити ✓</button>'}
      ${journal?`<div class="v-sec" style="margin-top:22px">Останні записи</div>${journal}`:''}
      `}`;

    const btn=p.querySelector('#vDoneBtn');
    if(btn) btn.onclick=()=>{
      const parts=[];
      p.querySelectorAll('[data-jq]').forEach(t=>{ if(t.value.trim()) parts.push('• '+t.value.trim()); });
      const text=parts.join('\n')|| '(без нотаток)';
      valState.journal.push({date:today, focus:valState.focusName, text});
      if(valState.lastDone!==today){ valState.streak=(valState.streak||0)+1; valState.lastDone=today; }
      saveValues(); renderDaily(p);
    };
  }

