
  window.__quotaHit = false;
  /* Банер служить двом бідам: переповнена памʼять (заголовок за замовчуванням)
     і «сховище не відповіло» — тоді заголовок треба свій, інакше текст про
     папки йде під шапкою «Памʼять пристрою заповнена» і збиває з пантелику. */
  window.showQuotaBanner = function(msg, title){
    try{
      window.__quotaHit = true;
      var b=document.getElementById('quotaBanner'); if(!b) return;
      if(msg){ var m=document.getElementById('quotaBannerMsg'); if(m) m.textContent=msg; }
      if(title){ var t=document.getElementById('quotaBannerTitle'); if(t) t.textContent=title; }
      b.style.display='block';
    }catch(_){}
  };
