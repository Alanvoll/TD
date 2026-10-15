/* ---------- Ночь (2026-10-15): screen tweaks for the night look; the look itself is night.css ---------- */
// 0.41.10 Anton: the battle tiles are no longer stretched to fill tall phones (that fill also re-measured the screen 20+ times per draw and made the battle lag)
// Spare height on tall phones: only the hand cards grow a little (up to 1.2×), measured once per new fit
if(typeof layFit==='function'){const lf0=layFit;layFit=function(on){if(on&&typeof app!=='undefined'){const d=app.querySelector(':scope>.detail');if(d)d.classList.add('nt-tip')}
  const n0=layFitN,r=lf0(on);if(!on)return r;
  if(layFitN!==n0)ntGrow();else{const hd=app.querySelector(':scope>.hand.mini:not(.lpl)'),ba=app.querySelector(':scope>.bact');
    // the first fit can run before the screen settles; a large empty gap above the buttons later still lets the hand grow
    if(hd&&ba&&!hd.style.zoom&&ba.getBoundingClientRect().top-hd.getBoundingClientRect().bottom>40)ntGrow()}return r}}
function ntGrow(){if(innerHeight<=700)return;const hd=app.querySelector('.hand.mini:not(.lpl)');if(!hd)return;const B=document.body;B.classList.add('nt-meas');app.style.minHeight='0';
  const sp=-layOver();if(sp>20){const h=hd.getBoundingClientRect().height,z=Math.floor(Math.min(1.2,1+(sp-8)/h)*100)/100;hd.style.zoom=z;
    if(layOver()>0)hd.style.zoom=z>1.04?+((1+z)/2).toFixed(2):'';if(layOver()>0)hd.style.zoom=''}
  app.style.minHeight='';B.classList.remove('nt-meas')}

/* main screen: the night scene redrawn in the colours of the battle reference (deep blue, pale moon, castle on the hill,
   graves and dead trees, a stone yard where the pack stands). One static picture, nothing moves. */
const NT_LBY=(()=>{let sd=11;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
  let stars='';for(let i=0;i<46;i++){const x=(rnd()*400).toFixed(1),y=(rnd()*300).toFixed(1),r=(rnd()*1+.35).toFixed(2),o=(rnd()*.55+.25).toFixed(2);stars+=`<circle cx="${x}" cy="${y}" r="${r}" opacity="${o}"/>`}
  const cross=(x,y,s)=>`<path d="M${x-1*s} ${y}v${-8*s}h${-2.6*s}v${-2*s}h${2.6*s}v${-2.6*s}h${2*s}v${2.6*s}h${2.6*s}v${2*s}h${-2.6*s}v${8*s}z"/>`;
  const stone=(x,y,s)=>`<path d="M${x-3.6*s} ${y}v${-7*s}a${3.6*s} ${3.6*s} 0 0 1 ${7.2*s} 0v${7*s}z"/>`;
  const tree=(x,y,s,f)=>`<path transform="translate(${x} ${y}) scale(${f?-s:s} ${s})" d="M-3 0 L-2 -40 L-14 -62 L-12 -64 L-1 -48 L0 -78 L3 -78 L3 -52 L16 -70 L18 -68 L5 -44 L4 -24 L14 -32 L15 -30 L4 -16 L3 0Z"/>`;
  const spire=(x,b,w,h)=>`<path d="M${x-w} ${b} V${b-h} L${x} ${b-h-w*2.6} L${x+w} ${b-h} V${b}Z"/>`;
  const castle=`<g fill="#0d1428">${spire(268,430,7,58)}${spire(292,430,9,86)}${spire(318,430,12,118)}${spire(344,430,8,74)}${spire(366,430,6,50)}<rect x="250" y="392" width="130" height="40"/></g>`;
  const wins=[[288,372],[314,350],[322,350],[318,384],[342,396],[296,400]].map(([x,y])=>`<rect x="${x}" y="${y}" width="3.4" height="6" rx="1.7"/>`).join('');
  return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05091a"/><stop offset=".4" stop-color="#0f1a36"/><stop offset=".56" stop-color="#1b2a4e"/><stop offset=".7" stop-color="#121c36"/><stop offset="1" stop-color="#070b16"/></linearGradient>
  <radialGradient id="g"><stop offset="0" stop-color="#dfeaff" stop-opacity=".32"/><stop offset=".45" stop-color="#a9c2ee" stop-opacity=".08"/><stop offset="1" stop-color="#a9c2ee" stop-opacity="0"/></radialGradient>
  <radialGradient id="m" cx=".42" cy=".4"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#e3ecfb"/><stop offset="1" stop-color="#b9c9e6"/></radialGradient>
  <radialGradient id="y" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#2c3a5c"/><stop offset="1" stop-color="#121a2e"/></radialGradient></defs>
  <rect width="400" height="800" fill="url(#a)"/><g fill="#fff">${stars}</g>
  <circle cx="318" cy="168" r="96" fill="url(#g)"/><circle cx="318" cy="168" r="28" fill="url(#m)"/>
  <g fill="#9fb2d6" opacity=".22"><circle cx="309" cy="160" r="5"/><circle cx="327" cy="178" r="3.6"/><circle cx="328" cy="156" r="2.4"/></g>
  <path d="M0 440 L40 410 L80 424 L120 392 L160 418 L200 398 L240 420 L280 404 L320 422 L360 400 L400 414 V520 H0Z" fill="#16213f"/>
  ${castle}<g fill="#ffcf7a" opacity=".85">${wins}</g>
  <path d="M0 470 Q70 446 140 462 T280 456 T400 448 V560 H0Z" fill="#111a33"/>
  <g fill="#0a1022">${tree(34,480,1.1)}${tree(378,474,.95,1)}${tree(118,474,.55)}</g>
  <g fill="#0b1124">${cross(24,530,1.3)}${stone(52,534,1.1)}${cross(80,528,.9)}${stone(322,530,1)}${cross(350,534,1.4)}${stone(380,528,1.1)}${cross(300,532,.8)}</g>
  <path d="M0 520 Q100 500 200 510 T400 504 V800 H0Z" fill="#0c1326"/>
  <ellipse cx="200" cy="640" rx="210" ry="70" fill="url(#y)" opacity=".75"/>
  </svg>`})();
/* other screens: the same scene without the moon, which showed through gaps between panels as a grey stain */
const NT_SCN=NT_LBY.replace(/<circle cx="318"[^\n]*\n\s*<g fill="#9fb2d6"[^\n]*\n/,'');
if(typeof document!=='undefined'&&document.documentElement){const r=document.documentElement.style,u=v=>'url("data:image/svg+xml,'+encodeURIComponent(v)+'")';r.setProperty('--nt-lby',u(NT_LBY));r.setProperty('--nt-scn',u(NT_SCN))}

/* run map: on a short phone the nodes you can go to were below the screen edge; bring them into view once per step */
if(typeof render==='function'){const rn0=render;render=function(){const r=rn0.apply(this,arguments);
  try{if(typeof G!=='undefined'&&G&&G.phase==='run'&&typeof document!=='undefined'){const c=document.querySelector('.rmap .rnd.can');
    const k=c&&c.style.left+c.style.top+document.querySelectorAll('.rmap .rnd.can').length;
    if(c&&k!==ui.ntMapK){ui.ntMapK=k;const b=c.getBoundingClientRect();if(b.bottom>innerHeight-8||b.top<0){const m=c.closest('.rmap');const th=(document.querySelector('#app>.top')||{}).offsetHeight||0;if(m&&m.offsetHeight<=innerHeight-16-th){m.scrollIntoView({block:'start'});scrollBy(0,-th-4)}else c.scrollIntoView({block:'center'})}}}}catch(e){}
  return r}}

/* battle: the tip line («Тапни клетку врага…») no longer pushes the buttons off the screen — it floats over the top edge of the hand */
function ntTip(){try{if(typeof G==='undefined'||!G||G.phase!=='battle'||!document.body.dataset.bfit)return;const d=app.querySelector(':scope>.detail'),h=app.querySelector(':scope>.hand');
  if(!d)return;d.classList.add('nt-tip');const a=app.getBoundingClientRect(),y=h?h.getBoundingClientRect().top:a.bottom-200;/* a prompt that asks to tap a cell (step, target) must not cover the field: it lies over the top of the hand instead, which is not used meanwhile */
  const onHand=!!(ui.stepE||ui.sel||d.querySelector('[data-act="st-skip"]'));
  d.style.top=(onHand?Math.max(0,y-a.top-2):Math.max(0,y-a.top-d.offsetHeight-2))+'px'}catch(e){}}
if(typeof render==='function'){const rn1=render;let ntTap=0;if(typeof document!=='undefined')document.addEventListener('pointerdown',()=>{ntTap=Date.now()},true);
  render=function(){const pk=Date.now()-ntTap<1500&&document.querySelector('#app .pk'),y0=pk&&pk.getBoundingClientRect().top;const r=rn1.apply(this,arguments);ntTip();
    /* team pick: rows above the list grow when the first creature is added; scroll by the same amount so the list stays under the finger */
    if(pk){const p2=document.querySelector('#app .pk');if(p2){const d=p2.getBoundingClientRect().top-y0;if(d)scrollBy(0,d)}}return r}}
