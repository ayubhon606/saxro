(function(){
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp=function(v,a,b){return Math.min(b==null?1:b,Math.max(a==null?0:a,v))};
  var vw=window.innerWidth,vh=window.innerHeight,sy=window.pageYOffset,lastY=sy,vel=0,mx=.5,my=.5,tmx=.5,tmy=.5;
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
 
  var root=document.documentElement;
  /* preloader */
  var pre=$('#pre'),preN=$('#preN'),preBar=$('#preBar');
  function goLive(){root.classList.add('go');root.classList.remove('lock')}
  if(pre){
    if(reduce){pre.hidden=true;goLive()}
    else{
      root.classList.add('lock');
      var p0=null,loaded=document.readyState==='complete',finished=false;
      window.addEventListener('load',function(){loaded=true});
      var finish=function(){
        if(finished)return;finished=true;
        preN.textContent='100';preBar.style.transform='scaleX(1)';
        pre.classList.add('done');
        setTimeout(goLive,450);
        setTimeout(function(){pre.hidden=true},1500);
      };
      var pstep=function(t){
        if(!p0)p0=t;
        var k=clamp((t-p0)/1700),e=1-Math.pow(1-k,2.2);
        preN.textContent=Math.round(e*100);
        preBar.style.transform='scaleX('+e+')';
        if((k<1||!loaded)&&t-p0<4500){requestAnimationFrame(pstep);return}
        finish();
      };
      requestAnimationFrame(pstep);
      setTimeout(finish,6000);
    }
  } else {goLive()}
 
  /* split headings */
  if(!reduce){
    $$('.h2').forEach(function(h){
      var label=h.textContent.replace(/\s+/g,' ').trim(),ci=0;
      var walk=function(node){
        Array.prototype.slice.call(node.childNodes).forEach(function(n){
          if(n.nodeType===3){
            var frag=document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function(tok){
              if(!tok)return;
              if(/^\s+$/.test(tok)){frag.appendChild(document.createTextNode(' '));return}
              var w=document.createElement('span');w.className='sw';w.setAttribute('aria-hidden','true');
              tok.split('').forEach(function(c){var sp=document.createElement('span');sp.className='ch';sp.style.setProperty('--ci',ci++);sp.textContent=c;w.appendChild(sp)});
              frag.appendChild(w);
            });
            node.replaceChild(frag,n);
          } else if(n.nodeType===1){walk(n)}
        });
      };
      walk(h);
      h.setAttribute('aria-label',label);
      h.classList.remove('rv');h.classList.add('sp');
    });
  }
 
  /* reveal on scroll */
  var rv=$$('.rv,.sp'),crs=$$('.cr');
  if(!('IntersectionObserver' in window)||reduce){rv.concat(crs).forEach(function(e){e.classList.add('in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var t=e.target;t.classList.add('in');(t._cr||[]).forEach(function(c){c.classList.add('in')});io.unobserve(t)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rv.forEach(function(e){io.observe(e)});
    crs.forEach(function(c){var par=c.parentElement;if(!par._cr){par._cr=[];io.observe(par)}par._cr.push(c)});
  }
 
  /* count up */
  var counts=$$('[data-count]');
  function animateCount(el){
    var to=parseFloat(el.getAttribute('data-count')),t0=null;
    function step(t){if(!t0)t0=t;var p=clamp((t-t0)/1400);var e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window&&!reduce){
    counts.forEach(function(c){c.textContent='0'});
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){animateCount(e.target);cio.unobserve(e.target)}})},{threshold:.6});
    counts.forEach(function(c){cio.observe(c)});
  }
 
  /* manifesto words */
  var mani=$('#mani'),words=[];
  if(mani){
    var parts=mani.textContent.trim().split(/\s+/);
    mani.innerHTML=parts.map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');
    words=$$('.w',mani);
  }
 
  /* collections */
  var hs=$('#kolleksiya'),stick=$('.hs-stick',hs),track=$('#hsTrack'),hsBar=$('#hsBar'),hsDist=0;
  var mqs=$$('.mq').map(function(el){return{el:el,tr:el.firstElementChild,dir:el.getAttribute('data-dir')==='r'?1:-1,half:0}});
  var looks=$$('.look');
  var cta=$('.cta'),sun=$('#sun');
  var heroLetters=$$('.hero-word .l');
  var heroArches=$$('[data-hero]');
  var pars=$$('[data-par]');
  var nav=$('#nav'),prog=$('#prog');
 
  function measure(){
    vw=window.innerWidth;vh=window.innerHeight;
    mqs.forEach(function(m){m.half=m.tr.scrollWidth/2});
    if(document.documentElement.classList.contains('js')){
      hsDist=Math.max(0,track.scrollWidth-stick.clientWidth);
      hs.style.height=(hsDist+stick.offsetHeight)+'px';
    }
    looks.forEach(function(l){l._top=parseFloat(getComputedStyle(l).top)||0});
  }
 
  function frame(t){
    sy=window.pageYOffset;
    var doc=document.documentElement,maxS=doc.scrollHeight-vh;
    prog.style.transform='scaleX('+(maxS>0?clamp(sy/maxS):0)+')';
 
    vel+=((sy-lastY)-vel)*.12;
    mx+=(tmx-mx)*.06;my+=(tmy-my)*.06;
    nav.classList.toggle('solid',sy>40);
    if(!$('#links').classList.contains('open')){nav.classList.toggle('hide',sy>lastY+2&&sy>240)}
    if(sy<lastY-2)nav.classList.remove('hide');
    lastY=sy;
 
    if(!reduce){
      var hy=Math.min(sy,vh*1.3);
      heroLetters.forEach(function(l,i){l.style.translate='0 '+(-hy*(0.05+i*0.03))+'px'});
      heroArches.forEach(function(a){var d=parseFloat(a.getAttribute('data-hero'));a.style.translate=((mx-.5)*-d*220).toFixed(1)+'px '+(-hy*d)+'px'});
      pars.forEach(function(p){var r=p.parentElement.getBoundingClientRect();var c=r.top+r.height/2-vh/2;p.style.translate='0 '+(-c*parseFloat(p.getAttribute('data-par')))+'px'});
      mqs.forEach(function(m){
        if(!m.half)return;
        var pos=(sy*0.6+(t||0)*0.04)%m.half;
        m.tr.style.transform='translate3d('+(m.dir<0?-pos:pos-m.half)+'px,0,0) skewX('+clamp(-vel*.35,-14,14).toFixed(2)+'deg)';
      });
      looks.forEach(function(l,i){
        var nx=looks[i+1];if(!nx)return;
        var r=nx.getBoundingClientRect();
        var p=clamp((vh-r.top)/(vh-(l._top||0)));
        l.firstElementChild.style.transform='scale('+(1-0.06*p).toFixed(4)+')';
      });
      if(cta){var cr=cta.getBoundingClientRect();var cp=clamp((vh-cr.top)/(vh+cr.height));sun.style.transform='translate(-50%,-50%) scale('+(0.3+cp*1.3).toFixed(3)+')'}
    }
 
    if(words.length){
      var r=mani.getBoundingClientRect();
      var p=clamp((vh*0.85-r.top)/(r.height+vh*0.35));
      var n=words.length;
      for(var i=0;i<n;i++){var k=clamp(p*n*1.15-i);words[i].style.opacity=(0.2+0.8*k).toFixed(2)}
    }
 
    if(cx&&heroEl.getBoundingClientRect().bottom>0)drawCv(reduce?0:(t||0));
    if(fine&&!reduce){rx0+=(px0-rx0)*.16;ry0+=(py0-ry0)*.16;ring.style.transform='translate3d('+rx0.toFixed(1)+'px,'+ry0.toFixed(1)+'px,0)'}
    if(portal){
      var pr=portal.getBoundingClientRect(),pspan=pr.height-vh,pp=pspan>0?clamp(-pr.top/pspan):0;
      var e=clamp(pp/.72);e=e*e*(3-2*e);
      var w0=Math.min(vw*.62,300),h0=Math.min(vh*.68,520),rad=w0*.5*(1-e);
      pWin.style.width=(w0+(vw-w0)*e)+'px';pWin.style.height=(h0+(vh-h0)*e)+'px';
      pWin.style.borderRadius=rad+'px '+rad+'px 0 0';
      pSvg.style.transform='scale('+(1.3-.3*e).toFixed(3)+')';
      var tp=clamp((pp-.6)/.25);
      pTxt.style.opacity=tp;pTxt.style.transform='translateY('+((1-tp)*40)+'px)';
      pPre.style.opacity=1-clamp(pp/.2);
    }
    var hr=hs.getBoundingClientRect(),span=hr.height-stick.offsetHeight,hp=span>0?clamp(-hr.top/span):0;
    track.style.transform='translate3d('+(-hp*hsDist)+'px,0,0)';
    hsBar.style.transform='scaleX('+hp+')';
 
    requestAnimationFrame(frame);
  }
  measure();
  window.addEventListener('resize',measure);
  window.addEventListener('load',measure);
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(measure)}
  requestAnimationFrame(frame);
 
  /* story */
  var steps=$$('.step'),scenes=$$('.story .scene'),storyTag=$('#storyTag');
  function setStory(i){
    steps.forEach(function(st,k){st.classList.toggle('on',k===i)});
    scenes.forEach(function(sc,k){sc.classList.toggle('on',k===i)});
    storyTag.textContent=steps[i].getAttribute('data-name');
  }
  if(steps.length&&'IntersectionObserver' in window){
    var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){setStory(parseInt(e.target.getAttribute('data-s'),10))}})},{rootMargin:'-45% 0px -45% 0px'});
    steps.forEach(function(st){sio.observe(st)});
  }
 
  /* tilt, magnet, cursor */
  $$('.hero .arch,.card .arch,.fig .pic,.jc .pic').forEach(function(el){el.setAttribute('data-tilt','')});
  if(fine&&!reduce){
    $$('[data-tilt]').forEach(function(el){
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
        el.style.setProperty('--ry',((px-.5)*12).toFixed(2)+'deg');
        el.style.setProperty('--rx',((.5-py)*10).toFixed(2)+'deg');
        el.style.setProperty('--gx',(px*100).toFixed(1)+'%');
        el.style.setProperty('--gy',(py*100).toFixed(1)+'%');
      });
      el.addEventListener('pointerleave',function(){el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
    });
    $$('.btn,.cartbtn').forEach(function(b){
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.22)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'});
      b.addEventListener('pointerleave',function(){b.style.translate=''});
    });
    root.classList.add('has-cur');
  }
  var dot=$('#curDot'),ring=$('#curRing'),px0=-100,py0=-100,rx0=-100,ry0=-100;
  if(fine&&!reduce){
    document.addEventListener('pointermove',function(e){
      px0=e.clientX;py0=e.clientY;tmx=e.clientX/vw;tmy=e.clientY/vh;
      root.classList.add('cur-on');
      dot.style.transform='translate3d('+px0+'px,'+py0+'px,0)';
    });
    document.addEventListener('pointerover',function(e){
      var t=e.target;if(!t.closest)return;
      var act=t.closest('a,button,input,.mrow'),pic=t.closest('[data-tilt]');
      ring.classList.toggle('big',!!(act||pic));
      ring.classList.toggle('fill',!!pic&&!act);
    });
    document.addEventListener('mouseleave',function(){root.classList.remove('cur-on')});
  }
 
  /* live clock */
  var clockEl=$('#clock');
  function tick(){try{clockEl.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tashkent',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}catch(err){clockEl.textContent=''}}
  if(clockEl){tick();setInterval(tick,20000)}
 
  /* dunes canvas */
  var cv=$('#dunes'),cx=cv&&cv.getContext&&cv.getContext('2d'),heroEl=$('.hero'),W=0,H=0,grains=[];
  function sizeCv(){
    if(!cx)return;
    var r=heroEl.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);
    W=r.width;H=r.height;
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    cx.setTransform(dpr,0,0,dpr,0,0);
    grains=[];
    var n=Math.round(clamp(W/9,40,150));
    for(var i=0;i<n;i++)grains.push({x:Math.random()*W,y:H*(.25+Math.random()*.7),s:.6+Math.random()*1.8,v:.3+Math.random()*1.2,p:Math.random()*6.28});
  }
  var dl=[
    {b:.66,a:.05,f:1.6,sp:.00011,ph:0,c:'rgba(189,189,186,.38)'},
    {b:.76,a:.065,f:1.2,sp:-.00015,ph:2,c:'rgba(160,160,157,.46)'},
    {b:.87,a:.05,f:2.2,sp:.00019,ph:4,c:'rgba(120,120,118,.42)'}
  ];
  function drawCv(t){
    if(!cx||!W)return;
    cx.clearRect(0,0,W,H);
    var R=Math.min(W,H)*.15,sx=W*.8-(mx-.5)*40,sY=H*.27+Math.min(sy,H)*.28;
    cx.fillStyle='rgba(10,10,10,.92)';cx.beginPath();cx.arc(sx,sY,R,0,6.2832);cx.fill();
    cx.fillStyle='rgba(189,189,186,.4)';cx.beginPath();cx.arc(sx,sY,R*1.6,0,6.2832);cx.fill();
    dl.forEach(function(L,li){
      cx.fillStyle=L.c;cx.beginPath();cx.moveTo(0,H);
      for(var x=0;x<=W+8;x+=8){
        var u=x/W*6.2832,sh=t*L.sp+sy*.0016*(li+1)+(mx-.5)*.6;
        var y=H*L.b+Math.sin(u*L.f+sh+L.ph)*H*L.a+Math.sin(u*L.f*2.3-sh*1.4)*H*L.a*.35;
        cx.lineTo(x,y);
      }
      cx.lineTo(W,H);cx.closePath();cx.fill();
    });
    var wind=1+Math.abs(vel)*.35+Math.abs(mx-.5)*2;
    cx.fillStyle='rgba(90,90,88,.75)';
    for(var i=0;i<grains.length;i++){
      var g=grains[i];
      g.x+=g.v*wind*(mx<.5?-1:1)*.9+.3;
      g.y+=Math.sin(t*.001+g.p)*.35;
      if(g.x>W+4)g.x=-4;if(g.x<-4)g.x=W+4;
      cx.fillRect(g.x,g.y,g.s,g.s);
    }
  }
  sizeCv();
  window.addEventListener('resize',sizeCv);
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(sizeCv)}
 
  /* portal */
  var portal=$('#eshik'),pWin=$('#portalWin'),pTxt=$('#portalTxt'),pPre=$('#portalPre'),pSvg=pWin&&pWin.querySelector('svg');
 
  /* nav menu */
  var menuBtn=$('#menuBtn'),links=$('#links');
  menuBtn.addEventListener('click',function(){var o=links.classList.toggle('open');menuBtn.setAttribute('aria-expanded',o?'true':'false');nav.classList.remove('hide')});
  links.addEventListener('click',function(e){if(e.target.closest('a')){links.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}});
 
  /* colour dots */
  var names={sand:'Oq',cobalt:'Qora',moss:'Kul rang'};
  $$('.card').forEach(function(card){
    $$('.dots button',card).forEach(function(b){
      b.addEventListener('click',function(){
        card.setAttribute('data-c',b.getAttribute('data-set'));
        $$('.dots button',card).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
      });
    });
  });
 
  /* materials */
  var sw=$('#swatch'),swName=$('#swName'),rows=$$('.mrow');
  function setRow(b){
    rows.forEach(function(r){r.classList.toggle('on',r===b)});
    sw.style.setProperty('--w1',b.getAttribute('data-w1'));
    sw.style.setProperty('--w2',b.getAttribute('data-w2'));
    sw.style.setProperty('--sf',b.getAttribute('data-fg'));
    swName.textContent=b.getAttribute('data-name')+' · '+b.getAttribute('data-g')+' g/m²';
    sw.classList.remove('flip');void sw.offsetWidth;sw.classList.add('flip');
  }
  rows.forEach(function(b){
    b.addEventListener('mouseenter',function(){if(!b.classList.contains('on'))setRow(b)});
    b.addEventListener('focus',function(){if(!b.classList.contains('on'))setRow(b)});
    b.addEventListener('click',function(){setRow(b)});
  });
 
  /* cart */
  var cart=[],drawer=$('#drawer'),scrim=$('#scrim'),list=$('#cartList'),emptyBox=$('#cartEmpty'),foot=$('#cartFoot'),toastEl=$('#toast'),toastT;
  var fmt=function(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' so‘m'};
  function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove('show')},2400)}
  function renderCart(){
    var count=0,total=0;
    list.innerHTML='';
    cart.forEach(function(it,i){
      count+=it.qty;total+=it.qty*it.price;
      var li=document.createElement('li');
      li.innerHTML='<b></b><span class="p"></span><small></small><button type="button">Olib tashlash</button>';
      li.querySelector('b').textContent=it.name;
      li.querySelector('.p').textContent=fmt(it.price*it.qty);
      li.querySelector('small').textContent=it.color+' · '+it.qty+' dona';
      li.querySelector('button').addEventListener('click',function(){cart.splice(i,1);renderCart()});
      list.appendChild(li);
    });
    $('#cartCount').textContent=count;
    $('#cartTotal').textContent=fmt(total);
    emptyBox.hidden=cart.length>0;
    foot.hidden=cart.length===0;
    list.hidden=cart.length===0;
  }
  function openCart(){drawer.classList.add('open');scrim.classList.add('open');drawer.setAttribute('aria-hidden','false');$('#closeCart').focus()}
  function closeCart(){drawer.classList.remove('open');scrim.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
  $('#openCart').addEventListener('click',openCart);
  $('#closeCart').addEventListener('click',closeCart);
  $('#toColl').addEventListener('click',closeCart);
  scrim.addEventListener('click',closeCart);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeCart()});
  $$('[data-add]').forEach(function(b){
    b.addEventListener('click',function(){
      var card=b.closest('.card'),name=card.getAttribute('data-name'),price=parseInt(card.getAttribute('data-price'),10),color=names[card.getAttribute('data-c')];
      var found=cart.filter(function(x){return x.name===name&&x.color===color})[0];
      if(found)found.qty++;else cart.push({name:name,price:price,color:color,qty:1});
      renderCart();toast(name+' ('+color+') savatga qo‘shildi');
    });
  });
  $('#checkout').addEventListener('click',function(){toast('Demo sayt: to‘lov ulanmagan')});
  renderCart();
 
  /* newsletter */
  $('#news').addEventListener('submit',function(e){
    e.preventDefault();
    var input=$('#email'),msg=$('#newsMsg');
    if(!input.value||!input.checkValidity()){msg.textContent='Elektron pochtani to‘liq kiriting, masalan ism@pochta.uz.';input.focus();return}
    msg.textContent='Rahmat! Bu demo sahifa, manzil hech qayerga yuborilmaydi.';
    input.value='';
  });
})();