  /* ============ ПІДСУМКИ БОРГІВ ============
     Колишній 17-folder-render.js: старий екран папки з віджетами (scr-folder)
     видалено 14.09.2026 разом із Простором — папки відкриваються Каналом
     (35-channel.js). Тут лишились лише підсумки боргів для агента й Огляду. */
  function debtTotals(){
    const tot={};
    items.forEach(i=>{ const b=balance(i); if(!(b>0.0001)) return; const c=i.cur||'UAH'; if(!tot[c]) tot[c]={owe:0,owed:0}; tot[c][i.kind==='owe'?'owe':'owed']+=b; });
    return tot;
  }
  function debtSummary(){
    if(!items.length) return '—';
    const tot=debtTotals(), curs=Object.keys(tot);
    if(!curs.length) return '0 ₴';
    return curs.map(c=>{ const n=tot[c].owed-tot[c].owe; return (n>0?'+':'')+fmt(n)+' '+(CUR[c]||c); }).join(' · ');
  }

