
(function(){
  // === Радіальне меню дій блока (концепт 04) ===
  // Делегує на існуючі приховані .tctl-кнопки блока — жодного дублювання логіки.
  const rmenu=document.getElementById('rmenu');
  const ring=document.getElementById('rmenuRing');
  const center=document.getElementById('rmenuCenter');
  let activeTile=null;

  function clickIn(tile,sel){ const b=tile.querySelector(sel); if(b){ b.click(); return true; } return false; }

  function buildOpts(tile){
    // прибираємо старі опції (лишаємо center)
    ring.querySelectorAll('.rmenu-opt,.rmenu-sizes').forEach(n=>n.remove());

    const has=sel=>!!tile.querySelector(sel);
    const opts=[];
    if(has('[data-mv$="|up"]'))   opts.push({em:'🔼',lb:'Вгору', act:t=>clickIn(t,'[data-mv$="|up"]'),  keep:true});
    if(has('[data-mv$="|down"]')) opts.push({em:'🔽',lb:'Вниз',  act:t=>clickIn(t,'[data-mv$="|down"]'),keep:true});
    if(has('[data-pin]'))  opts.push({em:'📌',lb:'Закріп', act:t=>clickIn(t,'[data-pin]')});
    if(has('[data-dup]'))  opts.push({em:'⧉', lb:'Копія',  act:t=>clickIn(t,'[data-dup]')});
    if(has('[data-collapse]')) opts.push({em:tile.querySelector('[data-collapse]').textContent.includes('▸')?'▸':'▾',lb:'Згорнути',act:t=>clickIn(t,'[data-collapse]')});
    if(has('[data-del]'))  opts.push({em:'🗑',lb:'Видалити',act:t=>clickIn(t,'[data-del]'),danger:true});

    const n=opts.length, R=82;
    opts.forEach((o,i)=>{
      const a=(-90 + i*(360/n))*Math.PI/180;
      const tx=Math.cos(a)*R, ty=Math.sin(a)*R;
      const d=document.createElement('div');
      d.className='rmenu-opt'+(o.danger?' danger':'');
      d.style.setProperty('--tx',tx+'px'); d.style.setProperty('--ty',ty+'px');
      d.style.transform=`translate(${tx-31}px,${ty-31}px)`;
      d.style.animationDelay=(i*0.025)+'s';
      d.innerHTML=`<div class="rm-em">${o.em}</div><div class="rm-lb">${o.lb}</div>`;
      d.onclick=ev=>{ ev.stopPropagation();
        const keepOpen=o.keep && (o.lb==='Вгору'||o.lb==='Вниз');
        o.act(activeTile);
        // рух змінює DOM → беремо свіжий tile за tileid
        if(keepOpen){ const id=activeTile.dataset.tileid;
          requestAnimationFrame(()=>{ const fresh=document.querySelector('.tile[data-tileid="'+id+'"]');
            if(fresh){ activeTile=fresh; buildOpts(fresh); } else closeRadial(); });
        } else closeRadial();
      };
      ring.appendChild(d);
    });

    // розміри (якщо блок їх підтримує)
    const szBtns=[...tile.querySelectorAll('.szbtn[data-size]')];
    if(szBtns.length){
      const wrap=document.createElement('div'); wrap.className='rmenu-sizes';
      const map={'auto':'Авто','s':'Малий','w':'Широкий','l':'Високий'};
      szBtns.forEach(sb=>{
        const key=(sb.dataset.size.split('|')[1]||'');
        const b=document.createElement('button');
        b.textContent=map[key]||key; if(sb.classList.contains('on'))b.classList.add('on');
        b.onclick=ev=>{ ev.stopPropagation(); const id=activeTile.dataset.tileid;
          sb.click();
          requestAnimationFrame(()=>{ const fresh=document.querySelector('.tile[data-tileid="'+id+'"]');
            if(fresh){ activeTile=fresh; buildOpts(fresh); } else closeRadial(); });
        };
        wrap.appendChild(b);
      });
      ring.appendChild(wrap);
    }
  }

  window.openRadialMenu=function(tile){
    activeTile=tile;
    const nm=(tile.querySelector('.tt,.headinput,.cardtitle,.pgc-nm,.bookc-title')||{}).value
            || (tile.querySelector('.tt,.headinput')||{}).value || '';
    const typeLabel=(tile.querySelector('.tt')&&tile.querySelector('.tt').placeholder)||'';
    center.innerHTML = nm ? `<b>${nm.replace(/[<>&]/g,'')}</b><span>дії блока</span>` : '<span>Дії блока</span>';
    buildOpts(tile);
    rmenu.classList.add('on'); rmenu.setAttribute('aria-hidden','false');
  };

  function closeRadial(){ rmenu.classList.remove('on'); rmenu.setAttribute('aria-hidden','true'); activeTile=null; }
  rmenu.addEventListener('click',e=>{ if(e.target===rmenu) closeRadial(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&rmenu.classList.contains('on')) closeRadial(); });

  // === Поповер водяного «＋»: 4 типи секцій ===
  const bnpop=document.getElementById('bnpop');
  let bnpopAdd=null, bnpopTarget=null, bnpopBackdrop=null;
  if(!bnpopBackdrop){ bnpopBackdrop=document.createElement('div'); bnpopBackdrop.className='bnpop-backdrop'; document.body.appendChild(bnpopBackdrop); }
  function closeBnpop(){ bnpop.classList.remove('on'); bnpopBackdrop.classList.remove('on'); bnpop.setAttribute('aria-hidden','true'); bnpopAdd=null; bnpopTarget=null; }
  bnpopBackdrop.addEventListener('click',closeBnpop);
  window.openBentoPop=function(anchor, blockId, addFn){
    bnpopAdd=addFn; bnpopTarget=blockId;
    bnpop.classList.add('on'); bnpopBackdrop.classList.add('on'); bnpop.setAttribute('aria-hidden','false');
    // позиціювання: над кнопкою, в межах екрана
    const r=anchor.getBoundingClientRect();
    const pw=bnpop.offsetWidth, ph=bnpop.offsetHeight;
    let left=r.left, top=r.top - ph - 8;
    if(top<8){ top=r.bottom+8; }                       // не влазить зверху — пробуємо знизу
    if(top+ph>window.innerHeight-8){ top=window.innerHeight-ph-8; } // все одно не влазить — притискаємо до низу екрана
    if(top<8) top=8;
    if(left+pw>window.innerWidth-8) left=window.innerWidth-pw-8;
    if(left<8) left=8;
    bnpop.style.left=left+'px'; bnpop.style.top=top+'px';
  };
  bnpop.querySelectorAll('[data-bnpop]').forEach(btn=>btn.onclick=e=>{
    e.stopPropagation();
    const type=btn.dataset.bnpop;
    if(bnpopAdd && bnpopTarget) bnpopAdd(bnpopTarget, type);
    closeBnpop();
  });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&bnpop.classList.contains('on')) closeBnpop(); });
})();
