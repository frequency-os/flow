  /* ════════ Герої-напарники (48-hero.js): дівчина й хлопець у балаклавах, худі Frequency ════════
     Рішення Ярослава 09.10.2026: поруч зі звірками (FLOW_PETS) — два нові герої у стилі
     «загону Frequency». Вибираються в тій самій шторці «Твій напарник» і живуть у тому ж
     ключі ai_pet. Звірки лишаються як були.

     Кадри — готові картинки (src/web/hero-assets.js, ~0.6 МБ), а не SVG: 6 настроїв на
     героя, усі кадри збігаються піксель у піксель. Файл вантажиться ліниво — лише коли
     обрано героя або відкрито шторку вибору. Поки його нема, petSVG малює запасний кружечок.

     Настрій береться з даних програми (heroMood): ніч → вечір, бюджет місії перевищено →
     тривога, серія ≥5 днів → гордість, зараз іде блок у Планері → фокус, половина дня
     зроблена → усмішка, інакше — спокій. Поверх — реакції на події (heroReactTo).

     Шафа (крок 2, 09.10.2026): одяг — прозорий шар лише на тулуб (src/web/hero-outfits.js,
     вантажиться, коли відкрито шафу або вдягнуто не стандартне худі); свій напис на грудях
     малюється кодом поверх одягу. Вибір — ключ hero_look ({mia:{…}, rey:{…}}), пишеться
     цілком і ЛИШЕ кнопкою «Зберегти» в шафі; при старті не пишеться ніколи. */

  // голова в кружечку: центр і розмах кадру (у пікселях кадру 480 завширшки)
  const HERO_CROP={ girl:{cx:240,cy:178,span:300}, guy:{cx:240,cy:168,span:290}, fox:{cx:240,cy:150,span:370} };
  // центр грудей і ширина місця під напис (у пікселях кадру 480 завширшки)
  const HERO_CHEST={ girl:{x:240,y:440,w:170}, guy:{x:240,y:428,w:170}, fox:{x:240,y:442,w:170} };
  // 9 кадрів на героя, очі завжди відкриті (рішення Ярослава 10.10.2026: «щоб показував емоції, не заплющував»)
  const HERO_MOOD_NAME=['спокій','усмішка','фокус','тривога','гордість','вечір','здивування','захват','злість'];
  /* Реакція на подію (flowReact у 14-react.js кличе heroReactTo): на ~75 с герой показує емоцію,
     потім повертається до фонового настрою з heroMood. Звичайна витрата — без реакції,
     щоб не сварити за кожну каву; злість лише коли після витрати пробито бюджет місії. */
  const HERO_REACT={done:1, create:1, folder:1, goal:7, streak:7, celebrate:7, income:6, save:6};
  const HERO_REACT_MS=75000;
  let heroReact=null, heroReactT=null;
  const HERO_OUTFITS=[['logo','Худі з хвилею'],['plain','Фіолетове худі'],['cream','Кремове худі'],['black','Чорне худі'],['bomber','Бомбер'],['puffer','Пуховик']];
  const HERO_FONTS={
    block:{n:'Блок', f:"'Manrope',sans-serif", w:800, up:1, k:1},
    serif:{n:'Класика', f:"'Lora',Georgia,serif", w:700, up:0, k:1.05},
    hand:{n:'Від руки', f:"'Caveat','Manrope',cursive", w:700, up:0, k:1.35},
    mono:{n:'Моно', f:"ui-monospace,Menlo,monospace", w:700, up:1, k:.95}
  };
  const HERO_COLORS=['#ffffff','#1a1726','#ff8ab0','#b9a9ff','#f5c84c','#5fdc9a'];
  const HERO_TECH={emb:'Вишивка', puff:'Пуф', flat:'Принт'};
  const HERO_LOOK_DEF={outfit:'logo', text:'', font:'block', color:'#ffffff', tech:'emb', patch:'none', tat:'none'};
  /* Нашивки й тату (крок 3, 09.10.2026). need — що відкриває річ; рахується з наявних даних
     (рівень Журналу, віхи, призи, серія), нічого нового не зберігається. Річ, що знову
     закрилась (серія обнулилась), просто не малюється — вибір у hero_look лишається. */
  const HERO_ICON={
    wave:'<path d="M2 13 C4 6 6.5 5 8 10 C9.5 16 11 19 13 13 C14.5 8 15.5 2 17.5 6 C18.5 8.5 19.5 11 22 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    bolt:'<path d="M13 2 L5 14 L11 14 L9 22 L19 9 L13 9 Z" fill="currentColor"/>',
    heart:'<path d="M12 21 C5 15 2 11 2 7.5 C2 4.5 4.3 2.5 7 2.5 C9 2.5 10.8 3.6 12 5.4 C13.2 3.6 15 2.5 17 2.5 C19.7 2.5 22 4.5 22 7.5 C22 11 19 15 12 21 Z" fill="currentColor"/>',
    star:'<path d="M12 1.5 L14.6 9.4 L22.5 12 L14.6 14.6 L12 22.5 L9.4 14.6 L1.5 12 L9.4 9.4 Z" fill="currentColor"/>',
    crown:'<path d="M3 18 L4.5 7 L9.5 12 L12 4.5 L14.5 12 L19.5 7 L21 18 Z" fill="currentColor"/>',
    shield:'<path d="M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z" fill="currentColor"/>',
    fire:'<path d="M12 2 C13 7 18 9 18 15 A6 6 0 0 1 6 15 C6 11 9 10 9 6 C11 8 12 9 12 2 Z" fill="currentColor"/>',
    tear:'<path d="M12 2.5 C16 9 19 12.5 19 16 A7 7 0 0 1 5 16 C5 12.5 8 9 12 2.5 Z" fill="none" stroke="currentColor" stroke-width="2.6"/>'
  };
  const HERO_NEED={
    lvl3:{t:'рівень 3', ok:u=>u.lvl>=3},   lvl10:{t:'рівень 10', ok:u=>u.lvl>=10},
    ms:{t:'перша віха', ok:u=>u.ms},       prize:{t:'приз місії', ok:u=>u.prize},
    fire7:{t:'серія 7 днів', ok:u=>u.streak>=7}
  };
  const HERO_PATCHES={
    none:{n:'Без'},
    wave:{n:'Frequency', bg:'#6d5cf0', fg:'#ffffff'},
    bolt:{n:'Блискавка', bg:'#1b1726', fg:'#ffd75c'},
    heart:{n:'Серце', bg:'#ff8ab0', fg:'#ffffff'},
    star:{n:'Зірка', bg:'#22305e', fg:'#f5c84c', need:'lvl3'},
    crown:{n:'Корона', bg:'#f5c84c', fg:'#3a2a00', need:'prize'},
    shield:{n:'Щит', bg:'#2e9e6e', fg:'#ffffff', need:'lvl10'},
    fire:{n:'Вогонь', bg:'#ff6a3d', fg:'#ffffff', need:'fire7'}
  };
  const HERO_TATS={
    none:{n:'Без'}, heart:{n:'Серце'}, tear:{n:'Сльоза'},
    star:{n:'Зірка', need:'lvl3'}, wave:{n:'Хвиля', need:'ms'}, crown:{n:'Корона', need:'prize'}
  };
  // нашивка — на лівому рукаві (праворуч на кадрі); тату — на шкірі біля ока (у Міи ліве сердечко, у Лиса ліва блискавка вже намальовані)
  const HERO_PATCH_AT={ girl:{x:424,y:478,s:46,r:-9}, guy:{x:424,y:478,s:46,r:-9}, fox:{x:424,y:482,s:46,r:-9} };
  const HERO_TAT_AT={ girl:{x:306,y:201,s:15}, guy:{x:302,y:190,s:13}, fox:{x:306,y:203,s:14} };
  let heroLoading=false, heroOutfitsLoading=false;

  function heroOf(id){ const p=FLOW_PETS[id]; return p&&p.hero?p.hero:''; }
  function heroReady(kind){ return !!(window.HERO_A&&window.HERO_A[kind]&&window.HERO_A[kind].f); }

  /* вигляд героя з hero_look; усе, що прийшло зі сховища, звіряємо зі списками —
     зіпсований чи чужий запис дає стандартний вигляд, а не дірку в розмітці */
  function heroLookAll(){
    try{ const j=JSON.parse(localStorage.getItem('hero_look')||'null'); return j&&typeof j==='object'&&!Array.isArray(j)?j:{}; }catch(_){ return {}; }
  }
  function heroLookNorm(l){
    l=l&&typeof l==='object'?l:{};
    return {
      outfit: HERO_OUTFITS.some(o=>o[0]===l.outfit)?l.outfit:HERO_LOOK_DEF.outfit,
      text: String(l.text==null?'':l.text).replace(/[\u0000-\u001f]/g,'').slice(0,16),
      font: HERO_FONTS[l.font]?l.font:HERO_LOOK_DEF.font,
      color: HERO_COLORS.includes(l.color)?l.color:HERO_LOOK_DEF.color,
      tech: HERO_TECH[l.tech]?l.tech:HERO_LOOK_DEF.tech,
      patch: Object.prototype.hasOwnProperty.call(HERO_PATCHES,l.patch)?l.patch:'none',
      tat: Object.prototype.hasOwnProperty.call(HERO_TATS,l.tat)?l.tat:'none'
    };
  }
  function heroLook(id){ return heroLookNorm(heroLookAll()[id]); }

  function heroRerender(){
    try{ flowCapRender(); }catch(_){}
    try{ aiRenderHead(); }catch(_){}
    try{ if(document.querySelector('.ai-pet-stage')) aiRenderBody(); }catch(_){}
  }

  /* підвантажити кадри один раз; після — перемалювати все, де видно напарника */
  function heroLoad(){
    if(window.HERO_A||heroLoading) return;
    heroLoading=true;
    window.heroAssetsReady=function(){
      heroRerender();
      try{ const ov=document.getElementById('petOv');
        if(ov) ov.querySelectorAll('.pet-card[data-pet]').forEach(c=>{
          if(!heroOf(c.dataset.pet)) return;
          const box=c.querySelector('div'); if(box) box.innerHTML=petSVG(c.dataset.pet,56);
        }); }catch(_){}
      try{ heroWardRedraw(); }catch(_){}
    };
    const s=document.createElement('script');
    s.src='hero-assets.js'; s.async=true;
    s.onerror=()=>{ heroLoading=false; };   // офлайн без кешу — лишається запасний кружечок
    document.head.appendChild(s);
  }
  function heroOutfitsLoad(){
    if(window.HERO_O||heroOutfitsLoading) return;
    heroOutfitsLoading=true;
    window.heroOutfitsReady=function(){ heroRerender(); try{ heroWardRedraw(); }catch(_){} };
    const s=document.createElement('script');
    s.src='hero-outfits.js'; s.async=true;
    s.onerror=()=>{ heroOutfitsLoading=false; };   // без файлу герой просто в стандартному худі
    document.head.appendChild(s);
  }

  /* настрій 0–5 з даних програми; кожне джерело — у своєму try, щоб збій одного не валив інші */
  function heroOverBudget(){
    try{
      const ym=ymdLocal().slice(0,7), ops=wlMonthOps(ym);
      return wlMissions().some(g=>{ const bud=g.budget&&+g.budget.money>0?+g.budget.money:0;
        return bud>0 && wlAgg(ops,g.id).out>bud; });
    }catch(_){ return false; }
  }
  function heroReactTo(kind){
    try{
      if(!heroOf(petCur())) return;
      let m=HERO_REACT[kind];
      if(kind==='spend') m=heroOverBudget()?8:undefined;
      if(m==null) return;
      heroReact={m, until:Date.now()+HERO_REACT_MS};
      heroRerender();
      clearTimeout(heroReactT);
      heroReactT=setTimeout(()=>{ heroReact=null; heroRerender(); }, HERO_REACT_MS+50);
    }catch(_){}
  }
  function heroMood(){
    if(heroReact&&heroReact.until>Date.now()) return heroReact.m;
    const now=new Date(), h=now.getHours()+now.getMinutes()/60;
    if(h>=23||h<6) return 5;
    if(heroOverBudget()) return 3;
    try{ if(jnStreak()>=5) return 4; }catch(_){}
    try{
      const bl=jnDayBlocks(ymdLocal());
      if(bl.some(b=>!b.done && (+b.h||0)<=h && plBlockEnd(b)>h)) return 2;
      if(bl.length && bl.filter(b=>b.done).length/bl.length>=.5) return 1;
    }catch(_){}
    return 0;
  }

  /* свій напис на грудях: SVG-текст у координатах кадру (480 завширшки).
     Довгий напис із пробілом ділиться на два рядки — як принт «STAY ON WAVE» на бренд-кадрі */
  function heroChestLines(t){
    if(t.length<=9||t.indexOf(' ')<0) return [t];
    const w=t.split(/\s+/); let best=[t], bestMax=t.length;
    for(let i=1;i<w.length;i++){ const a=w.slice(0,i).join(' '), b=w.slice(i).join(' '), m=Math.max(a.length,b.length);
      if(m<bestMax){ bestMax=m; best=[a,b]; } }
    return best;
  }
  function heroChestText(kind,look,uid){
    const t=look.text.trim(); if(!t) return '';
    const F=HERO_FONTS[look.font], C=HERO_CHEST[kind];
    const lines=heroChestLines(F.up?t.toUpperCase():t);
    const longest=Math.max(...lines.map(l=>l.length));
    const fs=Math.round(Math.min(46, C.w/Math.max(3,longest)*1.75)*F.k);
    const lh=fs*1.02, y0=C.y-(lines.length-1)*lh/2;
    let style=`font-family:${F.f};font-weight:${F.w};font-size:${fs}px;letter-spacing:${F.up?'.04em':'0'}`;
    let extra='';
    if(look.tech==='puff') extra=` filter="url(#hp${uid})"`;
    if(look.tech==='emb') style+=`;paint-order:stroke;stroke:rgba(0,0,0,.28);stroke-width:1.2px`;
    const op=look.tech==='flat'?.9:1;
    const spans=lines.map((l,i)=>{
      const fit=l.length*fs*.62>C.w?` textLength="${C.w}" lengthAdjust="spacingAndGlyphs"`:'';
      return `<tspan x="${C.x}" y="${(y0+i*lh).toFixed(1)}"${fit}>${esc(l)}</tspan>`; }).join('');
    return `<text text-anchor="middle" dominant-baseline="middle" fill="${look.color}" fill-opacity="${op}" style="${style}"${extra}>${spans}</text>`;
  }

  /* що відкрито: рівень Журналу, віхи, призи, серія — з наявних даних, кожне у своєму try */
  function heroUnlocks(){
    const u={lvl:1, ms:false, prize:false, streak:0};
    try{ u.lvl=1+Math.floor(jnHeroXP()/JN_XP_LVL); }catch(_){}
    try{ u.ms=(goalsData.goals||[]).some(g=>g&&jnLevels(g).some(m=>m.done)); }catch(_){}
    try{ u.prize=pzGoals().some(g=>g.reward.claimed); }catch(_){}
    try{ u.streak=jnStreak(); }catch(_){}
    return u;
  }
  function heroItemOpen(item,u){ return !item.need || HERO_NEED[item.need].ok(u||heroUnlocks()); }
  function heroPatchSVG(kind,L,u){
    const it=HERO_PATCHES[L.patch]; if(!it||!it.bg||!heroItemOpen(it,u)) return '';
    const P=HERO_PATCH_AT[kind], h=P.s/2, k=P.s*.62/24;
    return `<g transform="translate(${P.x} ${P.y}) rotate(${P.r})">`
      +`<rect x="${-h}" y="${-h}" width="${P.s}" height="${P.s}" rx="8" fill="${it.bg}" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`
      +`<rect x="${-h+3}" y="${-h+3}" width="${P.s-6}" height="${P.s-6}" rx="6" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2" stroke-dasharray="3 2.4"/>`
      +`<g transform="translate(${-12*k} ${-12*k}) scale(${k.toFixed(3)})" style="color:${it.fg}">${HERO_ICON[L.patch]}</g></g>`;
  }
  function heroTatSVG(kind,L,u){
    const it=HERO_TATS[L.tat]; if(!it||L.tat==='none'||!heroItemOpen(it,u)) return '';
    const T=HERO_TAT_AT[kind], k=T.s/24;
    return `<g transform="translate(${T.x-T.s/2} ${T.y-T.s/2}) scale(${k.toFixed(3)})" style="color:#2a1c18" opacity=".82">${HERO_ICON[L.tat]}</g>`;
  }

  /* SVG-обгортка над кадром, щоб герой ліг усюди, де зараз стоїть petSVG():
     size<90 — голова в кружечку (аватар, плаваючий напарник), більше — весь бюст.
     Повертає null, поки кадри не підвантажились. look — для прев'ю в шафі. */
  function heroSVG(id,size,mood,look){
    const kind=heroOf(id); if(!kind) return null;
    if(!heroReady(kind)){ heroLoad(); return null; }
    const A=window.HERO_A[kind], m=(mood==null?heroMood():mood)|0;
    const L=look?heroLookNorm(look):heroLook(id);
    const src=A.f[Math.max(0,Math.min(A.f.length-1,m))]||A.f[0];
    let osrc='';
    if(L.outfit!=='logo'){
      if(window.HERO_O&&window.HERO_O[kind]&&window.HERO_O[kind][L.outfit]) osrc=window.HERO_O[kind][L.outfit];
      else heroOutfitsLoad();
    }
    const s=Math.round(size), uid=id+s+Math.round(Math.random()*1e6);
    const U=(L.patch!=='none'||L.tat!=='none')?heroUnlocks():null;
    const label=`${esc(FLOW_PETS[id].name)} — ${HERO_MOOD_NAME[m]}`;
    if(s>=90){
      // кадр вписано в квадрат 100×100 по висоті, по центру; усе всередині — у пікселях кадру
      const k=100/A.h, ox=(50-A.w*k/2).toFixed(2);
      const inner=`<image href="${src}" width="${A.w}" height="${A.h}"/>`
        +(osrc?`<image href="${osrc}" width="${A.w}" height="${A.h}"/>`:'')
        +(osrc?heroChestText(kind,L,uid):'')   // напис лише на одязі без лого
        +heroPatchSVG(kind,L,U)+heroTatSVG(kind,L,U);
      return `<svg viewBox="0 0 100 100" width="${s}" height="${s}" style="display:block;overflow:visible" role="img" aria-label="${label}">`
        +`<defs><filter id="hp${uid}" x="-10%" y="-30%" width="120%" height="160%"><feDropShadow dx="0" dy="2.5" stdDeviation="1.6" flood-color="#000" flood-opacity=".45"/><feDropShadow dx="0" dy="-1" stdDeviation=".4" flood-color="#fff" flood-opacity=".35"/></filter></defs>`
        +`<g transform="translate(${ox} 0) scale(${k.toFixed(5)})">${inner}</g></svg>`;
    }
    const c=HERO_CROP[kind], k=100/c.span, cid='hc'+uid;
    const tr=`translate(${(50-c.cx*k).toFixed(2)} ${(50-c.cy*k).toFixed(2)}) scale(${k.toFixed(5)})`;
    return `<svg viewBox="0 0 100 100" width="${s}" height="${s}" style="display:block;overflow:visible" role="img" aria-label="${label}">`
      +`<defs><clipPath id="${cid}"><circle cx="50" cy="50" r="49"/></clipPath></defs>`
      +`<circle cx="50" cy="50" r="49" fill="#2a2342"/>`
      +`<g clip-path="url(#${cid})"><g transform="${tr}"><image href="${src}" width="${A.w}" height="${A.h}"/>`
      +(osrc?`<image href="${osrc}" width="${A.w}" height="${A.h}"/>`:'')+heroTatSVG(kind,L,U)+`</g></g>`
      +`<circle cx="50" cy="50" r="49" fill="none" stroke="${FLOW_PETS[id].glow}" stroke-opacity=".55" stroke-width="2"/></svg>`;
  }

  /* ── Шафа героя: одяг + свій напис; зберігає лише кнопка «Зберегти» ── */
  let heroWard=null;   // {id, look} — чернетка відкритої шафи
  function heroWardRedraw(){
    const ov=document.getElementById('heroWardOv'); if(!ov||!heroWard) return;
    const L=heroWard.look;
    const pv=ov.querySelector('#hwPrev'); if(pv) pv.innerHTML=heroSVG(heroWard.id,210,0,L)||'';
    ov.querySelectorAll('[data-hw]').forEach(b=>{ const [k,v]=b.dataset.hw.split(':'); b.classList.toggle('on',String(L[k])===v); });
    const note=ov.querySelector('#hwNote');
    if(note) note.style.display=(L.text.trim()&&L.outfit==='logo')?'block':'none';
  }
  /* Записуємо ключ цілком, але основу беремо найсвіжішу — з window.storage (хмара), а не
     з сирої копії: інакше давно відкрита вкладка на іншому пристрої відкотила б вигляд
     іншого героя, змінений деінде. Хмара не відповіла чи прислала сміття — беремо місцеву. */
  async function heroWardSave(id,look){
    let all=heroLookAll();
    try{ const r=await window.storage.get('hero_look');
      const j=r&&r.value!=null?JSON.parse(r.value):null;
      if(j&&typeof j==='object'&&!Array.isArray(j)) all=j; }catch(_){}
    all[id]=look;
    try{ prefSet('hero_look', JSON.stringify(all)); }catch(_){}
    try{ window.platform.haptic('success'); }catch(_){}
    heroRerender();
    try{ flowReact('celebrate',{say:false}); }catch(_){}
  }
  /* кнопка нашивки/тату в шафі: значок + назва; закрита — із замочком і «за що» */
  function heroWardItem(field,key,it,U){
    const open=heroItemOpen(it,U);
    const ic=key==='none'?'○':`<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="color:${field==='patch'?it.fg:'currentColor'}">${HERO_ICON[key]}</svg>`;
    const sw=field==='patch'&&it.bg?` style="--hwbg:${it.bg}"`:'';
    return `<button type="button" class="hw-chip hw-item${field==='patch'&&it.bg?' hw-patch':''}${open?'':' locked'}" data-hw="${field}:${key}"${sw}`
      +(open?'':` aria-disabled="true" aria-label="${esc(it.n)} — закрито, відкривається за: ${HERO_NEED[it.need].t}"`)+`>`
      +`<span class="hw-ic">${ic}</span>${esc(it.n)}${open?'':`<small>🔒 ${HERO_NEED[it.need].t}</small>`}</button>`;
  }
  function heroWardrobe(id){
    id=id||petCur(); if(!heroOf(id)) return;
    heroLoad(); heroOutfitsLoad();
    heroWard={id, look:heroLook(id)};
    const old=document.getElementById('heroWardOv'); if(old) old.remove();
    const U=heroUnlocks();
    const chip=(k,v,t,extra)=>`<button type="button" class="hw-chip" data-hw="${k}:${v}"${extra||''}>${t}</button>`;
    const ov=document.createElement('div'); ov.className='ai-ov'; ov.id='heroWardOv';
    ov.innerHTML=`<div class="ai-sheet hw-sheet"><h3>👕 Шафа · ${esc(FLOW_PETS[id].name)}</h3>
      <div class="hw-prev" id="hwPrev" style="--pc:${FLOW_PETS[id].glow}"></div>
      <div class="hw-h">Одяг</div>
      <div class="hw-row">${HERO_OUTFITS.map(o=>chip('outfit',o[0],o[1])).join('')}</div>
      <div class="hw-h">Свій напис на грудях</div>
      <input type="text" id="hwText" class="hw-in" maxlength="16" placeholder="До 16 символів" autocomplete="off">
      <div class="hw-note" id="hwNote">На худі з хвилею напису нема місця — обери худі без лого, кремове, чорне, бомбер чи пуховик.</div>
      <div class="hw-row">${Object.keys(HERO_FONTS).map(k=>chip('font',k,HERO_FONTS[k].n,` style="font-family:${HERO_FONTS[k].f};font-weight:${HERO_FONTS[k].w}"`)).join('')}</div>
      <div class="hw-row">${HERO_COLORS.map(c=>chip('color',c,'',` style="background:${c}" aria-label="Колір ${c}"`).replace('hw-chip','hw-chip hw-sw')).join('')}</div>
      <div class="hw-row">${Object.keys(HERO_TECH).map(k=>chip('tech',k,HERO_TECH[k])).join('')}</div>
      <div class="hw-h">Нашивка на рукаві</div>
      <div class="hw-row">${Object.keys(HERO_PATCHES).map(k=>heroWardItem('patch',k,HERO_PATCHES[k],U)).join('')}</div>
      <div class="hw-h">Тату біля ока</div>
      <div class="hw-row">${Object.keys(HERO_TATS).map(k=>heroWardItem('tat',k,HERO_TATS[k],U)).join('')}</div>
      <div class="ai-actions"><button class="sec" data-hwclose>Скасувати</button><button class="pri" data-hwsave>Зберегти</button></div></div>`;
    document.body.appendChild(ov);
    const inp=ov.querySelector('#hwText'); inp.value=heroWard.look.text;
    inp.addEventListener('input',()=>{ heroWard.look.text=inp.value.slice(0,16); heroWardRedraw(); });
    ov.addEventListener('click',e=>{
      if(e.target===ov||e.target.closest('[data-hwclose]')){ ov.remove(); heroWard=null; return; }
      const b=e.target.closest('[data-hw]');
      if(b&&b.getAttribute('aria-disabled')==='true'){ try{ window.platform.haptic('light'); }catch(_){} return; }
      if(b){ const i=b.dataset.hw.indexOf(':'); heroWard.look[b.dataset.hw.slice(0,i)]=b.dataset.hw.slice(i+1);
        try{ window.platform.haptic('light'); }catch(_){} heroWardRedraw(); return; }
      if(e.target.closest('[data-hwsave]')){
        const id=heroWard.id, look=heroLookNorm(heroWard.look);
        ov.remove(); heroWard=null;
        heroWardSave(id,look);
      }
    });
    heroWardRedraw();
  }

  // герой обраний — кадри тягнемо після першого кадру, а настрій оновлюємо раз на 5 хв
  try{
    setTimeout(()=>{ try{ const id=petCur(); if(heroOf(id)){ heroLoad(); if(heroLook(id).outfit!=='logo') heroOutfitsLoad(); } }catch(_){} }, 1200);
    visInterval(()=>{ try{ if(heroOf(petCur())&&window.HERO_A) flowCapRender(); }catch(_){} }, 300000);
  }catch(_){}
  // вигляд, змінений на іншому пристрої: хмара не-null і відмінна від місцевої → перемалювати
  try{ prefCatchup('hero_look', ()=>heroRerender()); }catch(_){}
  try{ window.heroReactTo=heroReactTo; window.heroMood=heroMood; window.heroLoad=heroLoad; window.heroWardrobe=heroWardrobe; }catch(_){}
