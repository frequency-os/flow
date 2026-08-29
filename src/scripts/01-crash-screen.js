
/* аварійний екран: показує помилку замість білого екрана */
(function(){
  function show(msg){
    try{
      var d=document.createElement('div');
      d.style.cssText='position:fixed;left:8px;right:8px;top:8px;z-index:999999;background:#2a1215;color:#ffb4b4;border:1px solid #7a2e35;border-radius:12px;padding:10px 12px;font:12px/1.5 -apple-system,Menlo,monospace;white-space:pre-wrap;word-break:break-word;max-height:45vh;overflow:auto;';
      d.textContent='⚠️ '+msg;
      (document.body||document.documentElement).appendChild(d);
    }catch(_){}
  }
  window.addEventListener('error',function(e){
    show((e.message||'Script error')+(e.lineno?('\nрядок '+e.lineno+(e.colno?':'+e.colno:'')):''));
  });
  window.addEventListener('unhandledrejection',function(e){
    var r=e&&e.reason; show('Promise: '+((r&&(r.message||r))||'невідома помилка'));
  });
})();
