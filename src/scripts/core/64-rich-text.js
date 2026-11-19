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
