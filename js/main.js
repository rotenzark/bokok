/* ===== BOKOK · main.js ===== */
(function(){
  'use strict';

  /* ---------- INTRO ---------- */
  var intro=document.getElementById('intro'),skip=document.getElementById('intro-skip');
  function closeIntro(){if(intro){intro.classList.add('done');}try{sessionStorage.setItem('bok_seen','1');}catch(e){}}
  var seen=false;try{seen=sessionStorage.getItem('bok_seen')==='1';}catch(e){}
  if(seen&&intro){intro.parentNode.removeChild(intro);}
  else if(intro){setTimeout(closeIntro,2100);if(skip)skip.addEventListener('click',closeIntro);}

  /* ---------- HEADER SCROLL ---------- */
  var header=document.getElementById('site-header');
  function onScroll(){if(header)header.classList.toggle('scrolled',window.scrollY>12);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* ---------- BURGER / NAV ---------- */
  var burger=document.getElementById('burger'),nav=document.querySelector('.nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');});});
  }

  /* ---------- ORARI DINAMICI ---------- */
  // getDay() 0=Dom..6=Sab. Lun–Sab 11:30–23:30 continuato · Dom 11:30–22:00
  var TABLE={
    0:[[11.5,22]],
    1:[[11.5,23.5]],
    2:[[11.5,23.5]],
    3:[[11.5,23.5]],
    4:[[11.5,23.5]],
    5:[[11.5,23.5]],
    6:[[11.5,23.5]]
  };
  var DAYS_IT=['dom','lun','mar','mer','gio','ven','sab'];
  var DAYS_EN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function fmt(h){h=h%24;var H=Math.floor(h),M=Math.round((h-H)*60);return H+':'+(M<10?'0'+M:''+M);}
  function nowRome(){var s=new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'});return new Date(s);}
  function computeLive(){
    var d=nowRome(),day=d.getDay(),hour=d.getHours()+d.getMinutes()/60;
    var wins=TABLE[day]||[],openNow=false,closeAt=null;
    for(var i=0;i<wins.length;i++){if(hour>=wins[i][0]&&hour<wins[i][1]){openNow=true;closeAt=wins[i][1];break;}}
    var nextOpen=null,nextDay=null;
    if(!openNow){
      for(var j=0;j<wins.length;j++){if(wins[j][0]>hour){nextOpen=wins[j][0];nextDay=day;break;}}
      if(nextOpen===null){for(var k=1;k<=7;k++){var dd=(day+k)%7,w2=TABLE[dd];if(w2&&w2.length){nextOpen=w2[0][0];nextDay=dd;break;}}}
    }
    return {openNow:openNow,closeAt:closeAt,nextOpen:nextOpen,nextDay:nextDay,day:day};
  }
  function renderLive(){
    var dot=document.getElementById('live-dot'),txt=document.getElementById('live-text');
    if(!dot||!txt)return;
    var L=computeLive(),en=document.documentElement.lang==='en',DAYS=en?DAYS_EN:DAYS_IT;
    dot.className='';
    if(L.openNow){
      dot.classList.add('open');
      txt.textContent=en?('Open now · until '+fmt(L.closeAt)):('Aperto ora · fino alle '+fmt(L.closeAt));
    }else{
      dot.classList.add('closed');
      if(L.nextOpen!==null){
        var sameDay=L.nextDay===L.day;
        var dl=DAYS[L.nextDay];
        if(en)txt.textContent='Closed · opens '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
        else txt.textContent='Chiuso · apre '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
      }else{txt.textContent=en?'Closed':'Chiuso';}
    }
  }

  /* ---------- I18N ---------- */
  var EN={
    'intro.skip':'Enter →',
    'brand.sub':'珍宝阁 · Sarpi',
    'nav.storia':'The library','nav.menu':'The menu','nav.mano':'Handmade','nav.dove':'Find us',
    'cta.book':'Book',
    'hero.eyebrow':'Via Paolo Sarpi · Chinatown',
    'hero.tag':'珍宝阁 · the treasure room',
    'hero.sub':'Would you eat <b>Chinese dumplings in a library?</b> At Bokok, Hong Kong’s <b>handmade dim sum</b> is enjoyed among walls lined with books — poetry, even, to browse while you wait. <em>A tea room, and a chest of treasures.</em>',
    'hero.cta1':'Book a table','hero.cta2':'The menu',
    'hero.live':'Checking hours…','hero.f2':'★ 4.2 · 1500+ reviews',
    'storia.kicker':'The library',
    'storia.h2':'You eat<br>among the books.',
    'storia.p1':'Bokok means <b>«the treasure room»</b> (珍宝阁). Since <b>2019</b>, in the heart of Chinatown, it’s a <b>cha chaan teng</b> — a Hong Kong tea room — with a twist: the walls, from floor to ceiling, are <b>shelves of books</b>.',
    'storia.p2':'You sit at a wooden table, pick up a book of poetry while the dumplings arrive, and eat <em>as if in a library</em>. Here, the treasures are two: those to read, and those to taste.',
    'storia.s1':'the treasure room','storia.s2b':'Hong Kong','storia.s2':'Cantonese cooking','storia.s3b':'By hand','storia.s3':'dim sum, one by one',
    'menu.kicker':'The menu','menu.h2':'The shelves of flavour',
    'menu.sub':'Each shelf a collection. Choose your title.',
    'sh.1t':'Steamed dim sum','sh.1a':'Mixed steamed dumplings','sh.1ap':'the favourites, coloured by hand','sh.1b':'Xiao long bao','sh.1bp':'the soup-filled dumplings','sh.1c':'Shumai &amp; mushroom dumplings','sh.1cp':'a classic of the counter',
    'sh.2t':'Bao &amp; buns','sh.2a':'Classic bao','sh.2ap':'«exceptional», say the guests','sh.2b':'Sheng jian bao','sh.2bp':'pan-seared, crisp underneath','sh.2c':'Rice noodle roll','sh.2cp':'cheung fun, silky soft',
    'sh.3t':'Noodles &amp; ramen','sh.3a':'Tonkotsu ramen','sh.3ap':'long-cooked broth, egg and pork','sh.3b':'Stir-fried noodles','sh.3bp':'from the wok, crisp with veg','sh.3c':'Wonton soup','sh.3cp':'dumplings in broth, «SUPER»',
    'sh.4t':'The big dishes','sh.4a':'Roast duck','sh.4ap':'lacquered, the Cantonese classic','sh.4b':'Pork belly','sh.4bp':'braised, tender and glossy','sh.4c':'Sautéed greens of the day','sh.4cp':'crisp, steamed or from the wok',
    'menu.note':'The menu is longer than this: ask for our suggestions, or leaf through the carte like a good book.',
    'mano.kicker':'Handmade','mano.h2':'One by one,<br>from the window.',
    'mano.p':'Through the window onto the street you can watch the cooks <b>fold the dumplings by hand</b>, one by one, before steaming them. No shortcuts: it’s the slow gesture that makes the difference between a dumpling and a <b>dim sum</b>.',
    'gallery.kicker':'At the table','gallery.h2':'The treasures on the plate',
    'rev.kicker':'Voices','rev.h2':'“Cared for in every detail”','rev.g1':'Google review · <span>★★★★★</span>','rev.g2':'Google review · <span>★★★★★</span>','rev.g3':'Google review · <span>★★★★★</span>',
    'dove.kicker':'Find us','dove.h2':'On Via Paolo Sarpi,<br>in the heart of Chinatown.',
    'dove.addr':'Address','dove.addr2':'— Chinatown','dove.hours':'Hours','dove.hoursv':'Every day · Mon–Sat 11:30–23:30 · Sun 11:30–22:00',
    'dove.social':'Instagram','dove.phone':'Phone','dove.call':'Book a table','dove.route':'Get directions',
    'faq.h2':'Frequently asked questions',
    'faq.q1':'Where is Bokok?','faq.a1':'On Via Paolo Sarpi 25, in the heart of Chinatown in Milan. The dining room is a library: the walls are lined with books.',
    'faq.q2':'What kind of cooking do you do?','faq.a2':'Hong Kong and Cantonese cuisine: handmade dim sum, steamed dumplings, bao, noodles, ramen, rice noodle rolls, roast duck and the great classics.',
    'faq.q3':'Is it true you eat in a library?','faq.a3':'Yes: Bokok is «the treasure room» (珍宝阁), a Hong Kong-style tea room with walls lined with books — poetry too, to browse while you wait.',
    'faq.q4':'When are you open?','faq.a4':'Every day, continuous service: Monday to Saturday 11:30–23:30, Sunday 11:30–22:00. Booking is possible.',
    'foot.sub':'Hong Kong dim sum in a library · Sarpi, Milan',
    'foot.where':'Where','foot.hours':'Hours','foot.hours2':'Mon–Sat 11:30–23:30','foot.hours3':'Sun 11:30–22:00','foot.contact':'Contact',
    'foot.disclaimer':'Demonstration site. Content and photos gathered from public sources (Google Maps); hours, dishes and details are indicative, to be confirmed with the restaurant.',
    'ab.call':'Book','ab.menu':'The menu','ab.route':'Directions'
  };
  var IT={};
  function snapshotIT(){document.querySelectorAll('[data-i18n]').forEach(function(el){IT[el.getAttribute('data-i18n')]=el.innerHTML;});}
  function applyLang(lang){
    var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(dict[k]!==undefined)el.innerHTML=dict[k];
      else if(IT[k]!==undefined)el.innerHTML=IT[k];
    });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-lang')===lang);});
    try{sessionStorage.setItem('bok_lang',lang);}catch(e){}
    renderLive();
  }
  snapshotIT();
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){applyLang(b.getAttribute('data-lang'));});});
  var savedLang='it';try{savedLang=sessionStorage.getItem('bok_lang')||'it';}catch(e){}
  if(savedLang==='en')applyLang('en');else renderLive();

  /* ---------- REVEAL ---------- */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{threshold:0.1,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---------- LIGHTBOX ---------- */
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),lbClose=document.getElementById('lb-close');
  document.querySelectorAll('.g-item').forEach(function(fig){
    fig.addEventListener('click',function(){
      var full=fig.getAttribute('data-full');if(!full)return;
      lbImg.src=full;var im=fig.querySelector('img');lbImg.alt=im?im.alt:'';
      lb.classList.add('open');lb.setAttribute('aria-hidden','false');
    });
  });
  function closeLb(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');setTimeout(function(){lbImg.src='';},300);}
  if(lbClose)lbClose.addEventListener('click',closeLb);
  if(lb)lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb();});

  /* ---------- LIVE tick ---------- */
  setInterval(renderLive,60000);
})();
