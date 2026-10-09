  /* ════════ Герої-напарники (48-hero.js): дівчина й хлопець у балаклавах, худі Frequency ════════
     Рішення Ярослава 09.10.2026: поруч зі звірками (FLOW_PETS) — два нові герої у стилі
     «загону Frequency». Вибираються в тій самій шторці «Твій напарник» і живуть у тому ж
     ключі ai_pet, тож окремого сховища не треба. Звірки лишаються як були.

     Кадри — готові картинки (src/web/hero-assets.js, ~0.6 МБ), а не SVG: 6 настроїв на
     героя, усі кадри збігаються піксель у піксель. Файл вантажиться ліниво — лише коли
     обрано героя або відкрито шторку вибору. Поки його нема, petSVG малює запасний кружечок.

     Настрій береться з даних програми (heroMood): ніч → сонний, бюджет місії перевищено →
     тривога, серія ≥5 днів → гордий, зараз іде блок у Планері → фокус, половина дня
     зроблена → бадьорий, інакше — спокій. */

  // голова в кружечку: центр і розмах кадру (у пікселях кадру 480 завширшки)
  const HERO_CROP={ girl:{cx:240,cy:178,span:300}, guy:{cx:240,cy:152,span:290} };
  const HERO_MOOD_NAME=['спокій','бадьорий','фокус','тривога','гордий','сонний'];
  let heroLoading=false;

  function heroOf(id){ const p=FLOW_PETS[id]; return p&&p.hero?p.hero:''; }
  function heroReady(kind){ return !!(window.HERO_A&&window.HERO_A[kind]&&window.HERO_A[kind].f); }

  /* підвантажити кадри один раз; після — перемалювати все, де видно напарника */
  function heroLoad(){
    if(window.HERO_A||heroLoading) return;
    heroLoading=true;
    window.heroAssetsReady=function(){
      try{ flowCapRender(); }catch(_){}
      try{ aiRenderHead(); }catch(_){}
      try{ const ov=document.getElementById('petOv');
        if(ov) ov.querySelectorAll('.pet-card[data-pet]').forEach(c=>{
          if(!heroOf(c.dataset.pet)) return;
          const box=c.querySelector('div'); if(box) box.innerHTML=petSVG(c.dataset.pet,56);
        }); }catch(_){}
    };
    const s=document.createElement('script');
    s.src='hero-assets.js'; s.async=true;
    s.onerror=()=>{ heroLoading=false; };   // офлайн без кешу — лишається запасний кружечок
    document.head.appendChild(s);
  }

  /* настрій 0–5 з даних програми; кожне джерело — у своєму try, щоб збій одного не валив інші */
  function heroMood(){
    const now=new Date(), h=now.getHours()+now.getMinutes()/60;
    if(h>=23||h<6) return 5;
    try{
      const ym=ymdLocal().slice(0,7), ops=wlMonthOps(ym);
      const over=wlMissions().some(g=>{ const bud=g.budget&&+g.budget.money>0?+g.budget.money:0;
        return bud>0 && wlAgg(ops,g.id).out>bud; });
      if(over) return 3;
    }catch(_){}
    try{ if(jnStreak()>=5) return 4; }catch(_){}
    try{
      const bl=jnDayBlocks(ymdLocal());
      if(bl.some(b=>!b.done && (+b.h||0)<=h && plBlockEnd(b)>h)) return 2;
      if(bl.length && bl.filter(b=>b.done).length/bl.length>=.5) return 1;
    }catch(_){}
    return 0;
  }

  /* SVG-обгортка над кадром, щоб герой ліг усюди, де зараз стоїть petSVG():
     size<90 — голова в кружечку (аватар, плаваючий напарник), більше — весь бюст.
     Повертає null, поки кадри не підвантажились. */
  function heroSVG(id,size,mood){
    const kind=heroOf(id); if(!kind) return null;
    if(!heroReady(kind)){ heroLoad(); return null; }
    const A=window.HERO_A[kind], m=(mood==null?heroMood():mood)|0;
    const src=A.f[Math.max(0,Math.min(5,m))]||A.f[0];
    const s=Math.round(size);
    if(s>=90){
      return `<svg viewBox="0 0 100 100" width="${s}" height="${s}" style="display:block;overflow:visible" role="img" aria-label="${esc(FLOW_PETS[id].name)} — ${HERO_MOOD_NAME[m]}">`
        +`<image href="${src}" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMax meet"/></svg>`;
    }
    const c=HERO_CROP[kind], k=100/c.span, cid='hc'+id+s;
    return `<svg viewBox="0 0 100 100" width="${s}" height="${s}" style="display:block;overflow:visible" role="img" aria-label="${esc(FLOW_PETS[id].name)} — ${HERO_MOOD_NAME[m]}">`
      +`<defs><clipPath id="${cid}"><circle cx="50" cy="50" r="49"/></clipPath></defs>`
      +`<circle cx="50" cy="50" r="49" fill="#2a2342"/>`
      +`<image href="${src}" clip-path="url(#${cid})" x="${(50-c.cx*k).toFixed(2)}" y="${(50-c.cy*k).toFixed(2)}" width="${(A.w*k).toFixed(2)}" height="${(A.h*k).toFixed(2)}"/>`
      +`<circle cx="50" cy="50" r="49" fill="none" stroke="${FLOW_PETS[id].glow}" stroke-opacity=".55" stroke-width="2"/></svg>`;
  }

  // герой обраний — кадри тягнемо після першого кадру, а настрій оновлюємо раз на 5 хв
  try{
    setTimeout(()=>{ try{ if(heroOf(petCur())) heroLoad(); }catch(_){} }, 1200);
    visInterval(()=>{ try{ if(heroOf(petCur())&&window.HERO_A) flowCapRender(); }catch(_){} }, 300000);
  }catch(_){}
  try{ window.heroMood=heroMood; window.heroLoad=heroLoad; }catch(_){}
