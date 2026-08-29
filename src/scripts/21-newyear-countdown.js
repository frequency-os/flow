
(function(){
  var MONTHS=['Січ','Лют','Бер','Кві','Тра','Чер','Лип','Сер','Вер','Жов','Лис','Гру'];
  function midnight(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate());}
  function targetDate(){return new Date(new Date().getFullYear()+1,0,1,0,0,0,0);}
  function daysInYear(y){return ((y%4===0&&y%100!==0)||y%400===0)?366:365;}

  // ── дрібний віджет на головному ──
  function tickWidget(){
    var d=document.getElementById('nycD');if(!d)return;
    var t=targetDate(),diff=t-new Date();if(diff<0)diff=0;
    var s=Math.floor(diff/1000);
    var dd=Math.floor(s/86400);s-=dd*86400;
    var h=Math.floor(s/3600);s-=h*3600;
    var m=Math.floor(s/60);s-=m*60;
    d.textContent=dd;
    document.getElementById('nycH').textContent=String(h).padStart(2,'0');
    document.getElementById('nycM').textContent=String(m).padStart(2,'0');
    document.getElementById('nycS').textContent=String(s).padStart(2,'0');
    var tt=document.getElementById('nycTitle');if(tt)tt.textContent='До '+t.getFullYear()+' року';
  }

  // ── великий екран ──
  var curView='grid';
  function tickHero(){
    var d=document.getElementById('nyD');if(!d)return;
    var t=targetDate(),now=new Date(),diff=t-now;if(diff<0)diff=0;
    var s=Math.floor(diff/1000);
    var dd=Math.floor(s/86400);s-=dd*86400;
    var h=Math.floor(s/3600);s-=h*3600;
    var m=Math.floor(s/60);s-=m*60;
    d.textContent=dd;
    document.getElementById('nyH').textContent=String(h).padStart(2,'0');
    document.getElementById('nyM').textContent=String(m).padStart(2,'0');
    document.getElementById('nyS').textContent=String(s).padStart(2,'0');
    var y=now.getFullYear(),total=daysInYear(y);
    var start=new Date(y,0,1);
    var passed=Math.floor((midnight(now)-start)/86400000);
    var left=total-passed;
    document.getElementById('nyDone').textContent=passed;
    document.getElementById('nyLeft').textContent=left;
    var hd=document.getElementById('nycHead');if(hd)hd.textContent='До '+t.getFullYear()+' року';
  }

  function renderView(){
    var host=document.getElementById('nycView');if(!host)return;
    var now=new Date(),y=now.getFullYear(),today=midnight(now);
    if(curView==='grid'){
      var html='';
      for(var mo=0;mo<12;mo++){
        html+='<div class="nyg-mlabel">'+MONTHS[mo]+'</div><div class="nyg">';
        var dim=new Date(y,mo+1,0).getDate();
        for(var day=1;day<=dim;day++){
          var cur=new Date(y,mo,day);
          var cls='nyg-d';
          if(cur<today)cls+=' past';
          else if(+cur===+today)cls+=' today';
          html+='<div class="'+cls+'">'+day+'</div>';
        }
        html+='</div>';
      }
      host.innerHTML=html;
    }else if(curView==='bar'){
      var total=daysInYear(y),start=new Date(y,0,1);
      var passed=Math.floor((today-start)/86400000);
      var pct=Math.round(passed/total*1000)/10;
      var mo2='';
      for(var i=0;i<12;i++){
        var dim2=new Date(y,i+1,0).getDate();
        var mfill;
        if(now.getMonth()>i)mfill=100;
        else if(now.getMonth()<i)mfill=0;
        else mfill=Math.round(now.getDate()/dim2*100);
        mo2+='<div class="nyb-mo"><div class="dot"><i style="width:'+mfill+'%"></i></div>'+MONTHS[i]+'</div>';
      }
      host.innerHTML='<div class="nyb-wrap"><div class="nyb-top">'+
        '<div class="nyb-pct">'+pct+'%</div>'+
        '<div class="nyb-sub">'+passed+' / '+total+' днів</div></div>'+
        '<div class="nyb-track"><div class="nyb-fill" style="width:'+pct+'%"></div></div>'+
        '<div class="nyb-months">'+mo2+'</div></div>';
    }else{
      var rows='',start3=new Date(y,0,1);
      var from=Math.max(0,Math.floor((today-start3)/86400000)-7);
      var total3=daysInYear(y);
      var to=Math.min(total3,from+30);
      for(var n=from;n<to;n++){
        var cur3=new Date(y,0,1+n);
        var cls3='nyl-row';
        if(cur3<today)cls3+=' done';
        else if(+cur3===+today)cls3+=' today';
        var lbl=cur3.getDate()+' '+MONTHS[cur3.getMonth()];
        var mark=(cur3<today)?'✓':((+cur3===+today)?'●':'');
        rows+='<div class="'+cls3+'"><span class="n">День '+(n+1)+'</span>'+
          '<span class="lbl">'+lbl+'</span><span class="chk">'+mark+'</span></div>';
      }
      host.innerHTML='<div class="nyl">'+rows+'</div>';
    }
  }

  function refreshScreen(){ tickHero(); renderView(); }
  window.__nycRefresh=refreshScreen;

  document.addEventListener('DOMContentLoaded',function(){
    var back=document.getElementById('nycBack');
    if(back)back.onclick=function(){var g=window.goMore;if(g)g();else if(window.__show)window.__show('scr-more');};
    document.querySelectorAll('[data-nycview]').forEach(function(b){
      b.onclick=function(){
        document.querySelectorAll('[data-nycview]').forEach(function(x){x.classList.remove('on');});
        b.classList.add('on');curView=b.dataset.nycview;renderView();
      };
    });
    tickWidget();tickHero();
    setInterval(function(){
      tickWidget();
      if(document.getElementById('scr-nyc')&&document.getElementById('scr-nyc').classList.contains('active'))tickHero();
    },1000);
  });

  window.goNYC=function(){
    var sh=window.__show||window.show;
    if(sh)sh('scr-nyc');
    refreshScreen();
  };
})();
