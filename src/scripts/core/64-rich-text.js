  /* ════════ Оформлений текст у блоках (19.11.2026, макет «Текст у папці», варіант A «Тиха панель») ════════
     Текст лишається РЯДКОМ у тому самому полі блоку (b.text) — лише з легкими позначками, як у Markdown:
       **жирний**  *курсив*  ~~закреслений~~  ==маркер==  [текст](https://…)
     Старі нотатки без позначок не змінюються, міграції нема. Стара збірка (Mac до перезбирання) покаже зірочки — і все.
     Безпека: txHTML СПЕРШУ екранує весь текст (esc), а потім вмикає лише наші пʼять позначок. Посилання — лише https:, http:, mailto:.
     Чужий HTML (вставка з сайту) ніколи не потрапляє в документ: txFromDom переводить його в позначки, а показує знову txHTML. */
  var TX_RICH={note:1,bullet:1,num:1,task:1,toggle:1,quote:1,callout:1,glass:1};
  var TX_URL=/^(https?:\/\/|mailto:)[^\s<>"'`]{1,800}$/i;
  // позначка: перший і останній символ — не пробіл (тож «5 * 3 * 2» лишається арифметикою)
  var TX_MARKS=[
    [/\*\*([^\s*](?:[^*\n]*?[^\s*])?)\*\*/g,'b'],
    [/~~([^\s~](?:[^~\n]*?[^\s~])?)~~/g,'s'],
    [/==([^\s=](?:[^=\n]*?[^\s=])?)==/g,'mark'],
    [/(^|[^*\w])\*([^\s*](?:[^*\n]*?[^\s*])?)\*(?![*\w])/g,'i']
  ];
  var TX_LINK=/\[([^\]\n]{1,300})\]\(((?:https?:\/\/|mailto:)[^\s)<>"'`]{1,800})\)/gi;
  // текст → безпечний HTML; o.links:false — посилання як підкреслений текст (усередині кнопки посилання не можна)
  function txHTML(s,o){
    o=o||{};
    const links=[];
    // посилання — спершу і в «сховок»: позначки всередині адреси (?a==b) не мають ламати HTML
    // свої керівні символи з тексту прибираємо, щоб ніхто не підробив «сховок» посилань
    let src=String(s==null?'':s).replace(/[\u0001\u0002]/g,'').replace(TX_LINK,(m,t,u)=>{ links.push([t,u]); return '\u0001'+(links.length-1)+'\u0002'; });
    let h=esc(src);
    TX_MARKS.forEach(([re,tag])=>{ h=h.replace(re,tag==='i'?(m,pre,x)=>pre+'<i>'+x+'</i>':(m,x)=>'<'+tag+'>'+x+'</'+tag+'>'); });
    h=h.replace(/\u0001(\d+)\u0002/g,(m,n)=>{ const L=links[+n]; if(!L) return '';
      let t=esc(L[0]); TX_MARKS.forEach(([re,tag])=>{ t=t.replace(re,tag==='i'?(mm,pre,x)=>pre+'<i>'+x+'</i>':(mm,x)=>'<'+tag+'>'+x+'</'+tag+'>'); });
      if(o.links===false||!TX_URL.test(L[1])) return '<span class="tx-a">'+t+'</span>';
      return '<a class="tx-a" href="'+esc(L[1])+'" target="_blank" rel="noopener noreferrer">'+t+'</a>'; });
    return h.replace(/[\u0001\u0002]/g,'');
  }
  // текст без позначок — для пошуку, Флоу, назв і прев'ю
  function txPlain(s){
    let t=String(s==null?'':s).replace(TX_LINK,(m,x)=>x);
    TX_MARKS.forEach(([re,tag])=>{ t=t.replace(re,tag==='i'?(m,pre,x)=>pre+x:(m,x)=>x); });
    return t;
  }
  // те саме, але адреса посилання не губиться: «текст (https://…)» — коли рядок стає заголовком
  function txPlainKeep(s){ return txPlain(String(s==null?'':s).replace(TX_LINK,(m,t,u)=>t+' ('+u+')')); }
  function txHas(s){ const t=String(s==null?'':s); return t!==txPlain(t); }
  // DOM поля (або вставленого HTML) → рядок з позначками. Невідомі теги — лише їхній текст
  var TX_BLOCK={DIV:1,P:1,LI:1,H1:1,H2:1,H3:1,H4:1,H5:1,H6:1,TR:1,BLOCKQUOTE:1,PRE:1,UL:1,OL:1,TABLE:1};
  // яка позначка в тега (або '' — звичайний)
  function txMarkOf(c){
    if(!c||c.nodeType!==1) return '';
    const tg=c.tagName;
    if(tg==='B'||tg==='STRONG') return '**'; if(tg==='I'||tg==='EM') return '*'; if(tg==='S'||tg==='STRIKE'||tg==='DEL') return '~~'; if(tg==='MARK') return '==';
    if(tg==='SPAN'&&c.style){ const st=c.style;
      if(/bold|[6-9]00/.test(st.fontWeight||'')) return '**'; if(st.fontStyle==='italic') return '*'; if(/line-through/.test((st.textDecoration||'')+(st.textDecorationLine||''))) return '~~'; }
    return '';
  }
  // сусідні однакові теги (<b>a</b><b>b</b>) зливаємо ще в DOM — інакше вийшло б «**a****b**».
  // Текст при цьому не чіпаємо: «*****» чи «=====» у звичайному тексті лишаються як є
  function txMerge(n){
    for(let c=n.firstChild;c;){ const nx=c.nextSibling, w=txMarkOf(c);
      if(w&&nx&&nx.nodeType===1&&txMarkOf(nx)===w){ while(nx.firstChild) c.appendChild(nx.firstChild); nx.remove(); continue; }
      if(c.nodeType===1) txMerge(c); c=nx; }
  }
  function txFromDom(root){
    let out='';
    root=root.cloneNode(true); txMerge(root);   // копія: живе поле під курсором не змінюємо
    // позначка обгортає кожен рядок окремо (позначки не переходять через перенос) і не захоплює пробіли з країв
    const wrapLine=(w,inner)=>{ const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(inner); if(!m[2]) return inner; return m[1]+w+m[2]+w+m[3]; };
    const wrapOut=(w,inner)=>inner.split('\n').map(seg=>wrapLine(w,seg)).join('\n');
    function sub(n){ const keep=out; out=''; walk(n); const r=out; out=keep; return r; }
    function walk(n){
      n.childNodes.forEach(c=>{
        if(c.nodeType===3){ out+=c.nodeValue; return; }
        if(c.nodeType!==1) return;
        const tg=c.tagName;
        if(tg==='BR'){ out+='\n'; return; }
        if(tg==='SCRIPT'||tg==='STYLE'||tg==='TEMPLATE'||tg==='NOSCRIPT') return;
        if(TX_BLOCK[tg]&&out&&!/\n$/.test(out)) out+='\n';
        if(tg==='A'){ const href=String(c.getAttribute('href')||'').trim(), inner=sub(c).replace(/[\[\]\n]/g,' ');
          out+=TX_URL.test(href)&&inner.trim()?'['+inner+']('+href.replace(/[)\s]/g,encodeURIComponent)+')':inner; return; }
        const w=txMarkOf(c);
        if(w){ out+=wrapOut(w,sub(c)); return; }
        walk(c);
        if(TX_BLOCK[tg]&&!/\n$/.test(out)) out+='\n';
      });
    }
    walk(root);
    // лише один хвостовий перенос (його додає сам браузер — <br> наприкінці поля); решту тексту не чіпаємо
    return out.replace(/\n$/,'');
  }
  // вставлений HTML → позначки: розбираємо в інертному документі (скрипти й картинки там не вантажаться)
  function txFromHTML(html){
    try{ const d=new DOMParser().parseFromString(String(html||''),'text/html'); return txFromDom(d.body); }catch(_){ return ''; }
  }

  /* ════════ «Живий текст» (19.11.2026, варіант B етап 1): дати, суми й @папки стають фішками ════════
     Фішки — лише ПОКАЗ: у збережений текст нічого не додається (txFromDom читає їх як звичайний текст).
     Тап по фішці відкриває картку з дією, а дія — наявна шторка застосунку (блок Планера, запис Гаманця) з підставленими
     значеннями. Записує тільки сама шторка, коли людина натисне «Зберегти». */
  var TX_MON=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
  var TX_DOW=[['нд','неділ'],['пн','понеділ'],['вт','вівтор'],['ср','серед'],['чт','четвер'],['пт','пʼятниц|п\'ятниц|пятниц'],['сб','субот']];
  var TX_CUR={'₴':'UAH','грн':'UAH','гривень':'UAH','гривні':'UAH','гривня':'UAH','$':'USD','usd':'USD','€':'EUR','eur':'EUR','zł':'PLN','£':'GBP'};
  // шматок тексту → {ds:'YYYY-MM-DD', h:число годин|null} або null
  function txDateOf(raw){
    const t=String(raw||'').toLowerCase().replace(/[ʼ’]/g,'ʼ'), now=new Date(), d=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
    let ok=false, m;
    if(/післязавтра/.test(t)){ d.setDate(d.getDate()+2); ok=true; }
    else if(/завтра/.test(t)){ d.setDate(d.getDate()+1); ok=true; }
    else if(/сьогодні/.test(t)){ ok=true; }
    else if((m=/(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?/.exec(t))){ const y=m[3]?+m[3]:now.getFullYear(), mo=+m[2]-1, dd=+m[1];
      if(mo>=0&&mo<12&&dd>=1&&dd<=31){ d.setFullYear(y,mo,dd); ok=d.getMonth()===mo; } }
    else if((m=new RegExp('(\\d{1,2})\\s+('+TX_MON.join('|')+')').exec(t))){ d.setMonth(TX_MON.indexOf(m[2]),+m[1]); ok=true; }
    else { for(let i=0;i<7;i++){ const re=new RegExp('(^|[^а-яіїєґ])('+TX_DOW[i][0]+'|'+TX_DOW[i][1]+')'); if(re.test(t)){ const add=(i-d.getDay()+7)%7; d.setDate(d.getDate()+add); ok=true; break; } } }
    const tm=/([01]?\d|2[0-3]):([0-5]\d)/.exec(t), h=tm?(+tm[1])+(+tm[2])/60:null;
    if(!ok&&h===null) return null;
    return {ds:ymdLocal(d), h};
  }
  function txMoneyOf(raw){
    const m=/(\d[\d\s ]{0,9}(?:[.,]\d{1,2})?)\s*(₴|грн|гривень|гривні|гривня|\$|usd|€|eur|zł|£)/i.exec(String(raw||''))||/(\$|€|£)\s*(\d[\d\s ]{0,9}(?:[.,]\d{1,2})?)/.exec(String(raw||''));
    if(!m) return null;
    const num=/\d/.test(m[1])?m[1]:m[2], sym=/\d/.test(m[1])?m[2]:m[1];
    const v=parseFloat(String(num).replace(/[\s ]/g,'').replace(',','.')); if(!(v>0)) return null;
    return {v, cur:TX_CUR[String(sym).toLowerCase()]||'UAH'};
  }
  // папки для @: довші назви першими, щоб «@Спорт зал» не впіймало «@Спорт»
  function txFolderList(){ try{ return Object.keys(folders||{}).filter(k=>folders[k]&&folders[k].name).map(k=>[k,String(folders[k].name)]).sort((a,b)=>b[1].length-a[1].length); }catch(_){ return []; } }
  const txReEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  // готовий HTML (з txHTML) → той самий HTML, де у ТЕКСТІ (не в тегах і не в посиланнях) дати, суми й @папки обгорнуто фішками
  function txChips(html){
    const fl=txFolderList();
    const fRe=fl.length?new RegExp('@('+fl.map(f=>txReEsc(esc(f[1]))).join('|')+')(?![\\wа-яіїєґ])','gi'):null;
    // день тижня — лише повні форми або скорочення окремим словом; ліва межа — окрема група (без «погляду назад»: його не знає старіший Safari)
    const DW='понеділ(?:ок|ка|ку)|вівтор(?:ок|ка|ку)|серед(?:а|у|и)|четвер(?:га|гу)?|(?:пʼятниц|п&#39;ятниц|пятниц)(?:я|ю|і)|субот(?:а|у|и)|неділ(?:я|ю|і)|пн|вт|ср|чт|пт|сб|нд';
    const dRe=new RegExp('(^|[^а-яіїєґa-z0-9])((?:(?:в|у|до|на)\\s+)?(?:сьогодні|післязавтра|завтра|\\d{2}\\.\\d{2}(?:\\.\\d{4})?|\\d{1,2}\\.\\d{1,2}\\.\\d{4}|\\d{1,2}\\s+(?:'+TX_MON.join('|')+')|(?:'+DW+'))(?![а-яіїєґa-z0-9])(?:,?\\s{0,3}(?:о|об)?\\s{0,3}(?:[01]?\\d|2[0-3]):[0-5]\\d)?|(?:о|об)\\s{1,3}(?:[01]?\\d|2[0-3]):[0-5]\\d)(?![\\d])','gi');
    // число: пробіл усередині — лише між цифрами («1 200»), тож хвостовий пробіл у фішку не потрапляє
    const NUM='\\d(?:\\d|[\\s\\u00a0](?=\\d)){0,9}(?:[.,]\\d{1,2})?';
    const mRe=new RegExp('(^|[^\\d.,])('+NUM+'\\s*(?:₴|грн|гривень|гривні|гривня|\\$|usd|€|eur|zł|£)(?![а-яіїєґa-z])|(?:\\$|€|£)\\s*'+NUM+')','gi');
    let inA=0;
    return String(html).split(/(<[^>]+>)/).map(part=>{
      if(!part) return part;
      if(part[0]==='<'){ if(/^<a[\s>]/i.test(part)) inA++; else if(/^<\/a>/i.test(part)) inA=Math.max(0,inA-1); return part; }
      if(inA) return part;
      let s=part;
      if(fRe) s=s.replace(fRe,(m,name)=>{ const f=fl.find(x=>esc(x[1]).toLowerCase()===name.toLowerCase()); return f?'<span class="tx-chip f" data-txf="'+esc(f[0])+'">'+m+'</span>':m; });
      // далі лише в тексті поза вже готовими фішками
      const each=(str,fn)=>str.replace(/(<span[^>]*>[\s\S]*?<\/span>)|([^<]+)/g,(m,sp,txt)=>sp?sp:fn(txt));
      s=each(s,t=>t.replace(mRe,(m,pre,x)=>pre+'<span class="tx-chip m">'+x+'</span>'));
      s=each(s,t=>t.replace(dRe,(m,pre,x)=>txDateOf(x.replace(/&#39;/g,"'"))?pre+'<span class="tx-chip d">'+x+'</span>':m));
      return s;
    }).join('');
  }
  // картка дії над фішкою; el — сама фішка, fk — папка, де стоїть текст
  // назва для блоку чи витрати: текст рядка до першої фішки, без прийменника й розділових знаків у кінці
  function txLead(el){
    const f=el.closest('[data-edit]')||el.parentElement; if(!f) return '';
    let t=''; for(const n of f.childNodes){ if(n.nodeType===1&&n.classList&&n.classList.contains('tx-chip')) break; t+=n.textContent||''; }
    t=t.replace(/\s+/g,' ').trim().replace(/(?:[\s,.;:—–-]+|\s(?:в|у|до|на|о|об|з|за|і|та))+$/i,'').trim();
    if(!t){ const rest=(f.textContent||'').replace(el.textContent||'',' '); t=rest.replace(/\s+/g,' ').replace(/^[\s,.;:—–-]+|[\s,.;:—–-]+$/g,''); }
    return t.slice(0,80);
  }
  function txChipCard(el,fk){
    document.querySelectorAll('.tx-card').forEach(x=>x.remove());
    const raw=el.textContent||'';
    let ic='', head='', sub='', acts=[];
    if(el.classList.contains('d')){ const d=txDateOf(raw); if(!d) return;
      const dt=new Date(d.ds+'T12:00:00'), dow=['Нд','Пн','Вт','Ср','Чт','Пт','Сб'][dt.getDay()];
      ic='📅'; head=dow+', '+dt.getDate()+' '+TX_MON[dt.getMonth()]+(d.h!==null?' · '+plHM(d.h):'');
      const title=txLead(el);
      // день Планера ставимо лише на час шторки: закрили без «Зберегти» — повертаємо, як було, і нічого не пишемо
      acts=[['Додати блок у Планер',()=>{ const p=plData(), was=p.selDate, n0=plBlocksFor(d.ds).length; p.selDate=d.ds;
        plBlockSheet(null,d.h!==null?d.h:null,{folder:fk&&folders[fk]?fk:'',title});
        const ov=[...document.querySelectorAll('.pl-sheet-ov')].pop();
        if(ov){ const mo=new MutationObserver(()=>{ if(ov.isConnected) return; mo.disconnect();
          const q=plData(); if(q.selDate===d.ds&&plBlocksFor(d.ds).length===n0) q.selDate=was; }); mo.observe(document.body,{childList:true}); } }],
            ['Відкрити цей день',()=>{ try{ goJournal({tab:'day',ds:d.ds}); }catch(_){} }]]; }
    else if(el.classList.contains('m')){ const mv=txMoneyOf(raw); if(!mv) return;
      ic='💸'; head=raw.trim();
      const label=txLead(el);
      // валюту передаємо, лише якщо такий баланс уже є: шторка Гаманця інакше додала б його одразу, ще до «Зберегти»
      let curOk=false; try{ curOk=mv.cur!==mainCur()&&wlCurList().includes(mv.cur); }catch(_){}
      const o=t=>()=>wlOpSheet(t,'',Object.assign({amount:mv.v,label},fk&&folders[fk]?{folderKey:fk}:{},curOk?{cur:mv.cur}:{}));
      acts=[['Записати витрату',o('out')],['Записати дохід',o('in')]]; }
    else if(el.classList.contains('f')){ const k=el.dataset.txf; if(!k||!folders[k]) return;
      ic='📁'; head=String(folders[k].name||'Папка');
      acts=[['Відкрити папку',()=>{ try{ goFolder(k); }catch(_){} }]]; }
    else return;
    sub=el.classList.contains('f')?'Згадка папки':'Нічого не записано, поки не натиснеш';
    const card=document.createElement('div'); card.className='tx-card'; card.setAttribute('role','dialog'); card.setAttribute('aria-label',head);
    card.innerHTML=`<b>${ic} ${esc(head)}</b><small>${esc(sub)}</small><div class="tx-card-a">${acts.map((a,i)=>`<button type="button" data-txa="${i}" class="${i?'g':''}">${esc(a[0])}</button>`).join('')}</div>`;
    if(document.querySelector('#scr-page.pg-paper')) card.classList.add('paper');
    document.body.appendChild(card);
    const r=el.getBoundingClientRect(), w=Math.min(300,window.innerWidth-24), h=card.offsetHeight;
    card.style.width=w+'px'; card.style.left=Math.max(12,Math.min(window.innerWidth-w-12,r.left+r.width/2-w/2))+'px';
    card.style.top=(r.bottom+8+h>window.innerHeight-90?Math.max(12,r.top-h-8):r.bottom+8)+'px';
    const close=()=>{ card.remove(); document.removeEventListener('pointerdown',out,true); document.removeEventListener('keydown',key,true); };
    const out=e=>{ if(!card.contains(e.target)) close(); };
    const key=e=>{ if(e.key==='Escape') close(); };
    setTimeout(()=>{ document.addEventListener('pointerdown',out,true); document.addEventListener('keydown',key,true); },0);
    card.addEventListener('click',e=>{ const b=e.target.closest('[data-txa]'); if(!b) return; const a=acts[+b.dataset.txa]; close(); try{ a[1](); }catch(err){ console.error('txChipCard',err); } });
    try{ card.querySelector('button').focus({preventScroll:true}); }catch(_){}
  }
