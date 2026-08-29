
  window.__quotaHit = false;
  window.showQuotaBanner = function(msg){
    try{
      window.__quotaHit = true;
      var b=document.getElementById('quotaBanner'); if(!b) return;
      if(msg){ var m=document.getElementById('quotaBannerMsg'); if(m) m.textContent=msg; }
      b.style.display='block';
    }catch(_){}
  };
