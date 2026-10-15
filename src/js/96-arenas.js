/* ---------- 0.42.0 Арены (Anton 2026-10-15, after Auto Brawl Chess «Арены»): the look of the battle field can be changed.
   An arena = the colour of the field tiles, the ground under the field and the night scene around it. Nothing else changes in battle.
   Picked in the «Арены» window (from the lobby menu and from Стая): big preview, a strip of arenas, «Выбрать».
   How players get arenas was not given: every arena is open and free to pick. The choice is kept in META.arena. ---------- */
const ARN_SVG=(sky,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1">${sky.map((c,i)=>`<stop offset="${(i/(sky.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient></defs><rect width="400" height="800" fill="url(#s)"/>${body}</svg>`;
const arnDots=(sd,n,y0,y1,col,r0,r1,o0,o1)=>{let s='';const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
  for(let i=0;i<n;i++)s+=`<circle cx="${(rnd()*400).toFixed(1)}" cy="${(y0+rnd()*(y1-y0)).toFixed(1)}" r="${(r0+rnd()*(r1-r0)).toFixed(2)}" fill="${col}" opacity="${(o0+rnd()*(o1-o0)).toFixed(2)}"/>`;return s};
const arnGlow=(id,col,o)=>`<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${o}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
const ARENAS=[
 {id:'night',n:'Ночное кладбище',d:'Синий камень, кресты и замок на холме.'},
 {id:'forest',r:'0 0 0 2px #4E8A5A88,0 0 22px #7CFF9A33',n:'Лунный лес',d:'Мшистые плиты, старые деревья и светлячки.',
  t:['#43604B','#37503F','#2D4334','#3A5442','#2F4537','#26392D','#77A07E','#13201A'],f:['#132018','#0A120D'],p:['#0B140F','#18281D'],
  g:'radial-gradient(70% 60% at 50% 45%,#22402B 0%,#16291C 60%,#0E1A12 100%)',
  s:ARN_SVG(['#050E0B','#0B1F18','#123026','#0A1712'],`<defs>${arnGlow('m','#E6FFE0',.35)}${arnGlow('f','#C8FF7A',.6)}</defs>
   <circle cx="392" cy="190" r="70" fill="url(#m)"/><circle cx="392" cy="190" r="24" fill="#EAF7E2" opacity=".9"/>
   <path d="M0 420 Q60 380 120 400 T240 390 T400 380 V800 H0Z" fill="#0E2219"/>
   ${[[30,1.3],[110,.9],[300,1.1],[372,1.5],[200,.7]].map(([x,s])=>`<g fill="#06110C" transform="translate(${x} 470) scale(${s})"><rect x="-6" y="-120" width="12" height="130"/><circle cx="0" cy="-130" r="38"/><circle cx="-26" cy="-108" r="26"/><circle cx="26" cy="-104" r="28"/></g>`).join('')}
   <path d="M0 500 Q100 470 200 486 T400 476 V800 H0Z" fill="#0A1A12"/>
   ${arnDots(5,26,180,560,'url(#f)',3,7,.5,1)}${arnDots(9,26,180,560,'#E4FF9A',.8,1.6,.5,.95)}
   ${[[44,560],[88,572],[330,566],[362,578]].map(([x,y])=>`<g><rect x="${x-2}" y="${y-10}" width="4" height="12" fill="#BFE8D2"/><ellipse cx="${x}" cy="${y-11}" rx="10" ry="6" fill="#5FE3BE" opacity=".85"/></g>`).join('')}
   <path d="M0 600 Q120 580 220 594 T400 588 V800 H0Z" fill="#07130D"/>`)},
 {id:'ice',r:'0 0 0 2px #BFE2FFAA,0 0 22px #9CD0FF55',n:'Ледяное озеро',d:'Голубой лёд, снег и северное сияние.',
  t:['#3F6688','#355876','#2C4A64','#385D7E','#2F4F6C','#27425B','#8FBCE0','#14243A'],f:['#152740','#0C182A'],p:['#0D1A2C','#1B3150'],
  g:'radial-gradient(70% 60% at 50% 45%,#2E4D73 0%,#1F3756 60%,#142640 100%)',
  s:ARN_SVG(['#050C1E','#0C1D3D','#163262','#0E2142'],`<path d="M-20 170 Q80 110 180 160 T420 120" stroke="#6CF2C2" stroke-width="34" fill="none" opacity=".16"/>
   <path d="M-20 220 Q100 160 200 210 T420 170" stroke="#7DB8FF" stroke-width="26" fill="none" opacity=".14"/>
   ${arnDots(21,40,0,380,'#FFFFFF',.4,1.3,.3,.85)}
   <path d="M0 470 L60 340 L110 410 L170 300 L240 420 L300 330 L360 400 L400 350 V560 H0Z" fill="#1A3256"/>
   <path d="M60 340 L76 374 L46 372Z M170 300 L192 346 L150 342Z M300 330 L320 370 L282 366Z" fill="#CFE6FF" opacity=".55"/>
   <path d="M0 500 Q100 480 200 492 T400 486 V800 H0Z" fill="#132849"/>
   ${[[24,560,26],[58,580,40],[350,566,34],[384,586,22],[316,590,18]].map(([x,y,h])=>`<path d="M${x-7} ${y} L${x} ${y-h} L${x+7} ${y}Z" fill="#9CCBF2" opacity=".45"/>`).join('')}
   <path d="M0 600 Q120 584 220 596 T400 590 V800 H0Z" fill="#0E1F3A"/>${arnDots(33,30,380,800,'#E8F4FF',.6,1.6,.3,.7)}`)},
 {id:'lava',r:'0 0 0 2px #FF6A1FAA,0 0 26px #FF5A1A99',n:'Огненный разлом',d:'Чёрный камень, лава и красное небо.',
  t:['#4A3434','#3C2A2A','#302121','#402C2C','#342424','#2A1C1C','#C0603A','#160808'],f:['#22100E','#140807'],p:['#2A0E08','#4A1A0C'],
  g:'radial-gradient(70% 60% at 50% 45%,#3A1A14 0%,#24110D 62%,#170A08 100%)',
  s:ARN_SVG(['#0E0305','#2A0A0A','#4A1410','#1A0606'],`<defs>${arnGlow('l','#FF6A1F',.55)}</defs>
   <circle cx="250" cy="360" r="170" fill="url(#l)"/>
   <path d="M120 470 L210 300 L236 312 L262 300 L360 470Z" fill="#1A0705"/><path d="M212 300 Q236 270 260 300Z" fill="#FF7A2A" opacity=".8"/>
   <path d="M0 470 L50 420 L90 450 L130 410 L170 470 Z M300 470 L340 424 L372 448 L400 420 V470Z" fill="#160604"/>
   <path d="M0 480 Q100 460 200 474 T400 466 V800 H0Z" fill="#120504"/>
   <path d="M-10 560 Q80 520 150 556 T300 540 T420 560" stroke="#FF5A1A" stroke-width="10" fill="none" opacity=".35"/>
   <path d="M-10 560 Q80 520 150 556 T300 540 T420 560" stroke="#FFB04A" stroke-width="3" fill="none" opacity=".85"/>
   <path d="M30 700 Q120 660 210 690 T420 676" stroke="#FF5A1A" stroke-width="8" fill="none" opacity=".3"/>
   <path d="M30 700 Q120 660 210 690 T420 676" stroke="#FFB04A" stroke-width="2.4" fill="none" opacity=".8"/>
   ${arnDots(41,40,120,780,'#FF9A3C',.6,1.8,.35,.9)}`)},
 {id:'crystal',r:'0 0 0 2px #B48CFF99,0 0 24px #A070FF66',n:'Кристальный грот',d:'Фиолетовые плиты и светящиеся кристаллы.',
  t:['#54497A','#483F6A','#3D355C','#4D4470','#423A62','#373053','#A698D6','#1C1630'],f:['#1A1130','#0E091C'],p:['#140C26','#261843'],
  g:'radial-gradient(70% 60% at 50% 45%,#33224F 0%,#22163A 62%,#160E28 100%)',
  s:ARN_SVG(['#06030E','#140A28','#22123E','#0E0820'],`<defs>${arnGlow('c','#B88CFF',.4)}</defs>
   <path d="M0 0 H400 V60 L380 140 L360 70 L330 180 L300 60 L270 120 L240 50 L200 150 L170 60 L140 110 L110 40 L80 160 L50 60 L20 120 L0 70Z" fill="#05020B"/>
   <circle cx="70" cy="520" r="110" fill="url(#c)"/><circle cx="340" cy="560" r="120" fill="url(#c)"/>
   <path d="M0 480 Q100 450 200 470 T400 460 V800 H0Z" fill="#0F0820"/>
   ${[[60,560,1.2],[110,580,.8],[330,590,1.3],[380,570,.9],[20,620,.7]].map(([x,y,s])=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 0 L-8 -70 L0 -84 L8 -70 L14 0Z" fill="#8A5CF0" opacity=".85"/><path d="M0 -84 L8 -70 L14 0 L0 0Z" fill="#C8A8FF" opacity=".55"/><path d="M-30 0 L-26 -40 L-18 -48 L-12 -38 L-12 0Z" fill="#6D45C8" opacity=".85"/><path d="M16 0 L20 -34 L28 -42 L34 -30 L32 0Z" fill="#9E78F2" opacity=".75"/></g>`).join('')}
   <path d="M0 630 Q120 610 220 622 T400 616 V800 H0Z" fill="#0A0518"/>${arnDots(51,30,160,780,'#D9C4FF',.5,1.4,.3,.8)}`)},
 {id:'sunken',r:'0 0 0 2px #5FD0C288,0 0 22px #5FD0C244',n:'Затонувший храм',d:'Морская глубина, колонны и пузыри.',
  t:['#3F7477','#346265','#2A5255','#386A6A','#2E5859','#26494B','#86C8C3','#0F2628'],f:['#0F2A2C','#08181A'],p:['#08191B','#14383A'],
  g:'radial-gradient(70% 60% at 50% 45%,#1C4446 0%,#123134 62%,#0B2224 100%)',
  s:ARN_SVG(['#02121A','#06303A','#0A4048','#04212A'],`<path d="M90 0 L150 0 L230 520 L130 520Z M240 0 L280 0 L330 460 L270 460Z" fill="#BFFFF6" opacity=".05"/>
   ${[[50,480,150],[350,470,180],[100,500,90]].map(([x,y,h])=>`<g fill="#062A30"><rect x="${x-14}" y="${y-h}" width="28" height="${h}"/><rect x="${x-20}" y="${y-h-10}" width="40" height="12"/></g>`).join('')}
   <path d="M250 330 L310 300 L360 330Z" fill="#062A30"/>
   <path d="M0 490 Q100 466 200 480 T400 472 V800 H0Z" fill="#05242A"/>
   ${[[20,620],[60,600],[340,610],[380,630],[300,640]].map(([x,y])=>`<path d="M${x} ${y} q-10 -30 0 -60 q10 -30 0 -60" stroke="#0E5446" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}
   ${[[70,420,6],[78,380,4],[66,350,3],[320,400,5],[328,360,3.5],[200,300,4],[206,270,2.6]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#A8F2E8" stroke-width="1.2" opacity=".6"/>`).join('')}
   <path d="M0 640 Q120 620 220 632 T400 626 V800 H0Z" fill="#031A1F"/>${arnDots(61,24,0,780,'#BFFFF6',.5,1.2,.2,.6)}`)},
 {id:'pumpkin',r:'0 0 0 2px #FF9A2A99,0 0 24px #FF8A1A55',n:'Тыквенная ночь',d:'Полная луна, тыквы и огни деревни.',
  t:['#6A4A2E','#5A3E27','#4B3320','#5E4229','#503722','#432E1C','#D08A48','#22150A'],f:['#141C34','#0B1122'],p:['#1E140C','#33231A'],
  g:'radial-gradient(70% 60% at 50% 45%,#26304E 0%,#1A2238 62%,#111729 100%)',
  s:ARN_SVG(['#060A1E','#101A40','#1C2A5C','#0C1430'],`<defs>${arnGlow('m','#FFE7A8',.4)}${arnGlow('o','#FF9A2A',.45)}</defs>
   ${arnDots(71,40,0,330,'#FFFFFF',.4,1.2,.3,.85)}<circle cx="390" cy="190" r="80" fill="url(#m)"/><circle cx="390" cy="190" r="28" fill="#FFF2C8"/>
   <path d="M0 450 L20 450 L20 400 L44 376 L68 400 L68 450 L90 450 L90 380 L120 350 L150 380 L150 450 L260 450 L260 410 L284 388 L308 410 L308 450 L330 450 L330 370 L362 340 L394 370 L394 450 L400 450 V520 H0Z" fill="#0B1024"/>
   <g fill="#FFB648">${[[36,410],[50,410],[104,392],[128,404],[278,420],[350,384],[372,404]].map(([x,y])=>`<rect x="${x}" y="${y}" width="6" height="9" rx="1"/>`).join('')}</g>
   <path d="M0 480 Q100 462 200 474 T400 468 V800 H0Z" fill="#0D142C"/>
   ${[[46,580,1.2],[92,600,.8],[340,590,1.1],[378,612,.75]].map(([x,y,s])=>`<g transform="translate(${x} ${y}) scale(${s})"><circle r="40" fill="url(#o)"/><ellipse rx="22" ry="16" fill="#E2701C"/><ellipse rx="9" ry="16" fill="#C95A12"/><rect x="-2" y="-21" width="4" height="7" fill="#3E5A1E"/><path d="M-12 -4 L-6 -9 L-4 -2Z M12 -4 L6 -9 L4 -2Z M-10 5 Q0 11 10 5 Q0 8 -10 5Z" fill="#FFD36B"/></g>`).join('')}
   <path d="M0 640 Q120 622 220 634 T400 628 V800 H0Z" fill="#090E20"/>`)},
 {id:'castle',r:'0 0 0 2px #C4AA8899,0 0 22px #FFB34744',n:'Двор замка',d:'Старый камень, факелы и знамёна.',
  t:['#736A5C','#62594D','#544C41','#695F52','#5A5246','#4C453B','#B8AA92','#24201A'],f:['#211A15','#140F0C'],p:['#17110C','#2C2219'],
  g:'radial-gradient(70% 60% at 50% 45%,#3A3029 0%,#29211C 62%,#1C1612 100%)',
  s:ARN_SVG(['#060814','#0E1226','#171B30','#0C0D16'],`<defs>${arnGlow('t','#FFB347',.55)}</defs>${arnDots(81,30,0,220,'#FFFFFF',.4,1.1,.3,.8)}
   <path d="M0 470 V250 ${Array.from({length:20},(_,i)=>`h10 v-14 h10 v14`).join(' ')} V470Z" fill="#191826"/>
   <path d="M150 470 V330 a50 50 0 0 1 100 0 V470Z" fill="#0A0A12"/>
   ${[[60,260],[340,260]].map(([x,y])=>`<path d="M${x-16} ${y} h32 v90 l-16 -14 l-16 14Z" fill="#7A1F2B"/><path d="M${x-6} ${y+30} l6 -10 l6 10 l-6 10Z" fill="#E7B65A" opacity=".8"/>`).join('')}
   ${[[120,330],[280,330],[20,380],[380,380]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="56" fill="url(#t)"/><rect x="${x-3}" y="${y}" width="6" height="22" fill="#3A2A1C"/><ellipse cx="${x}" cy="${y-4}" rx="6" ry="10" fill="#FFB347"/><ellipse cx="${x}" cy="${y-2}" rx="3" ry="5" fill="#FFF0B8"/>`).join('')}
   <path d="M0 470 H400 V800 H0Z" fill="#14110F"/><path d="M0 470 H400 V486 H0Z" fill="#221C17"/>
   ${arnDots(91,22,480,780,'#3A3027',3,9,.5,.9)}`)},
];
const arnById=id=>ARENAS.find(a=>a.id===id)||ARENAS[0];
const arnCur=()=>arnById(typeof META!=='undefined'&&META&&META.arena);
const arnUrl=v=>'url("data:image/svg+xml,'+encodeURIComponent(v)+'")';
// scene of an arena: the default one is the night scene already used everywhere
const arnScn=a=>a.s?arnUrl(a.s):'var(--nt-scn)';
if(typeof document!=='undefined'&&document.head){
  let css='';
  for(const a of ARENAS){if(!a.t)continue;const[l0,l1,l2,k0,k1,k2,hi,lo]=a.t;
    css+=`[data-ar="${a.id}"]{--ar-l:linear-gradient(180deg,${l0} 0%,${l1} 24%,${l2} 100%);--ar-k:linear-gradient(180deg,${k0} 0%,${k1} 22%,${k2} 100%);--ar-hi:${hi};--ar-lo:${lo};--ar-f:linear-gradient(180deg,${a.f[0]},${a.f[1]});--ar-p:linear-gradient(180deg,${a.p[0]},${a.p[1]});--ar-g:${a.g};--ar-r:${a.r};--ar-s:${arnUrl(a.s)}}\n`}
  css+=`[data-ar="night"]{--ar-s:var(--nt-scn)}
/* the field takes the arena's tiles; highlights (!important in night.css) stay as they are */
[data-ar]:not([data-ar="night"]) .board .grid.field,[data-ar]:not([data-ar="night"]) .board .grid.field.enemyg{background:var(--ar-f)}
[data-ar]:not([data-ar="night"]) .board .grid.field .cell{background:var(--ar-l);box-shadow:inset 0 1.5px 0 var(--ar-hi),inset 1.5px 0 0 #ffffff12,inset -1px 0 0 #00000040,inset 0 -4px 0 var(--ar-lo),0 2px 0 #05080F}
[data-ar]:not([data-ar="night"]) .board .grid.field .cell.dk{background:var(--ar-k)}
/* a dark shadow under every creature: a creature never sits straight on a tile of its own colour */
[data-ar]:not([data-ar="night"]) .board .grid.field .cell.occ::before{content:'';position:absolute;left:10%;right:10%;bottom:6%;height:46%;border-radius:50%;background:radial-gradient(closest-side,#000000b0 34%,#00000000 66%,#ffffff1c 82%,#ffffff00 100%);pointer-events:none}
[data-ar]:not([data-ar="night"]) .board .grid.field.enemyg::after{background:var(--ar-p)}
/* the ground under both fields: one slab on the same tilted plane, a little wider than the fields */
[data-ar]:not([data-ar="night"]) .board{position:relative}
[data-ar]:not([data-ar="night"]) .board::before{content:'';position:absolute;inset:-10px -8px -8px;border-radius:16px;background:var(--ar-g);
  box-shadow:inset 0 0 0 1px #ffffff10,var(--ar-r),0 6px 0 #0000006b;transform:translateZ(-1px);pointer-events:none}
/* the scene around the battle */
body[data-bfit][data-ar]:not([data-ar="night"])::before{background:
    radial-gradient(95% 65% at 50% 38%,transparent 55%,rgba(3,5,12,.6) 100%),linear-gradient(180deg,rgba(7,11,22,.3) 0%,rgba(7,11,22,.28) 34%,rgba(7,11,22,.86) 46%,rgba(7,11,22,.9) 100%),
    #070B16 var(--ar-s) center top/cover no-repeat}
/* ----- the «Арены» window ----- */
.arn{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;background:#070B16 var(--ar-s,var(--nt-scn)) center/cover no-repeat;color:var(--nt-t1,#F1F4FA);overflow:hidden}
.arn::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,8,16,.72) 0%,rgba(5,8,16,.18) 26%,rgba(5,8,16,.12) 62%,rgba(5,8,16,.82) 100%);pointer-events:none}
.arn>*{position:relative;width:100%;max-width:460px;box-sizing:border-box}
.arn-hd{display:flex;align-items:center;gap:10px;padding:10px 12px 0}
.arn-hd .pill{min-height:44px;height:44px;padding:0 14px;border-radius:22px;color:var(--nt-t1,#F1F4FA);font:600 13px var(--body);background:linear-gradient(180deg,#34415C,#1E2739);box-shadow:inset 0 1px 0 #ffffff2a,inset 0 -2px 0 #0007,0 0 0 1.5px #4E5E7E,0 3px 0 #080C16,0 4px 10px #0007}
.arn-hd .arn-n{min-width:64px;text-align:right;font:600 13px var(--body);color:var(--nt-t2,#B8C3D6);font-variant-numeric:tabular-nums}
.arn-hd b{font:700 18px/1.2 var(--display);flex:1;text-align:center;text-shadow:0 2px 0 #000a}
.arn-nm{margin-top:auto;padding:6px 16px 0;text-align:center}
.arn-nm h2{margin:0;font:800 25px/1.15 var(--display);color:#FFE6A3;text-shadow:0 2px 0 #3A2408,0 0 2px #000,0 3px 10px #000c}
.arn-nm div{font-size:13px;color:var(--nt-t2,#B8C3D6);margin-top:3px;text-shadow:0 1px 2px #000}
.arn-st{flex:0 1 auto;min-height:0;margin-bottom:auto;display:flex;align-items:center;justify-content:center;padding:24px 18px 8px}
.arn-st .board{width:100%;max-width:400px;gap:26px}
.arn-st .grid.field{pointer-events:none}
.arn-st .grid.field .cell .pet{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
.arn-st .grid.field .cell .cri{width:50px;height:50px;object-fit:contain;display:block}
.arn-hp{font:800 9.5px/12px var(--body);padding:0 4px;border-radius:4px;background:#2E8F57;color:#fff;box-shadow:0 0 0 1px #000;margin-bottom:1px;white-space:nowrap}.arn-hp.en{background:#B8404A}
.arn-st .grid.field.enemyg{position:relative}
.arn-st .grid.field.enemyg::after{display:block;content:'';position:absolute;left:3%;right:3%;top:calc(100% + 7px);height:12px;border-radius:6px;background:var(--ar-p,linear-gradient(180deg,#0A1020,#141C30));box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 0 0 1px #05080F}
.arn-ls{display:flex;gap:8px;overflow-x:auto;padding:8px 12px 6px;scrollbar-width:none;scroll-snap-type:x proximity}
.arn-ls::-webkit-scrollbar{display:none}
.arn-ls.fr{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent)}
.arn-ls.fl{-webkit-mask-image:linear-gradient(90deg,transparent,#000 28px);mask-image:linear-gradient(90deg,transparent,#000 28px)}
.arn-ls.fl.fr{-webkit-mask-image:linear-gradient(90deg,transparent,#000 28px,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(90deg,transparent,#000 28px,#000 calc(100% - 28px),transparent)}
.arn-t{flex:0 0 auto;width:84px;height:98px;border-radius:12px;border:0;padding:0;position:relative;overflow:hidden;scroll-snap-align:center;cursor:pointer;
  background:#070B16 var(--ar-s,var(--nt-scn)) center 62%/cover no-repeat;box-shadow:inset 0 0 0 1.5px #ffffff26,0 3px 0 #000a}
.arn-t i{position:absolute;left:12%;right:12%;top:30%;height:44%;border-radius:4px;transform:perspective(120px) rotateX(38deg);
  background:repeating-conic-gradient(var(--ar-c1,#36435E) 0 25%,var(--ar-c2,#222C40) 0 50%) 0 0/40% 33.4%;box-shadow:0 0 0 2px #0A0F1A,0 4px 0 #0008}
.arn-t span{position:absolute;left:0;right:0;bottom:0;padding:12px 3px 4px;letter-spacing:-.2px;font:700 12px/1.12 var(--body);overflow-wrap:normal;color:#fff;text-align:center;background:linear-gradient(180deg,transparent,#000c 45%)}
.arn-t.on{box-shadow:inset 0 0 0 3px #FFE6A3,0 3px 0 #000a}
.arn-t em{position:absolute;right:4px;top:4px;width:20px;height:20px;border-radius:10px;background:#46C37B;color:#fff;font:800 12px/20px var(--body);font-style:normal;box-shadow:0 1px 0 #0008}
.lib-arn{min-height:44px!important;height:44px!important;flex:1 0 auto;justify-content:center}
.arn-go{padding:6px 16px calc(12px + env(safe-area-inset-bottom,0px))}
.arn-go .btn{width:100%;min-height:52px;font-size:17px}
.arn-go .arn-ok{display:flex;align-items:center;justify-content:center;gap:6px;min-height:52px;border-radius:14px;background:rgba(10,15,28,.85);box-shadow:inset 0 0 0 1px #46C37B88;color:#8CF0B0;font:700 16px var(--body)}
@media (min-height:800px){.arn-st{padding:24px 8px 8px}.arn-st .board{max-width:400px;gap:36px}.arn-st .grid.field .cell .cri{width:60px;height:60px}.arn-hp{font-size:11px;line-height:14px}}
@media (max-height:680px){.arn-nm h2{font-size:21px}.arn-nm div{font-size:12px}.arn-t{height:92px}.arn-st .board{max-width:310px}.arn-st .grid.field .cell .cri{width:40px;height:40px}.arn-go .btn,.arn-go .arn-ok{min-height:48px}}
`;
  for(const a of ARENAS)if(a.t)css+=`.arn-t[data-ar="${a.id}"]{--ar-c1:${a.t[1]};--ar-c2:${a.t[4]}}\n`;
  document.head.insertAdjacentHTML('beforeend','<style id="arenas">'+css+'</style>')}
// a still field for the preview: both sides, the player's last team stands on its front row
function arnBoard(){const tm=typeof lbyTeam==='function'?lbyTeam():[0,1,2],en=[0,1,2,3,4,5,6,7,8,9].filter(i=>!tm.includes(i)&&PETS[i]).slice(0,3);
  const cells=(e)=>{let h='';const tl=e?en:tm,pos=e?[[1,0],[2,2],[1,4]]:[[0,1],[0,3],[1,2]];
  for(let r=0;r<3;r++)for(let c=0;c<5;c++){const k=pos.findIndex(([pr,pc])=>pr===r&&pc===c),p=k>=0&&PETS[tl[k]],hp=p?60+((k*37+(e?11:0))%50):0;
    h+=`<div class="cell${(r+c)%2?' dk':''}${p?' occ':''}${!e&&r===1&&c===1?' dest':''}">${p?`<div class="pet"><span class="arn-hp${e?' en':''}">${hp}/${hp}</span>${petIc(p,1)}</div>`:''}</div>`}return h};
  return`<div class="board"><div class="grid field enemyg">${cells(1)}</div><div class="grid field">${cells(0)}</div></div>`}
function arnHtml(){const v=arnById(ui.arn),cur=arnCur();
  return`<div class="arn" data-ar="${v.id}">
  <div class="arn-hd"><button class="pill" data-arn="x">‹ Назад</button><b>Арены</b><span class="arn-n">${ARENAS.indexOf(v)+1} из ${ARENAS.length}</span></div>
  <div class="arn-nm"><h2>${v.n}</h2><div>${v.d}</div></div>
  <div class="arn-st">${arnBoard()}</div>
  <div class="arn-ls">${ARENAS.map(a=>`<button class="arn-t${a.id===v.id?' on':''}" data-ar="${a.id}" data-arn="v-${a.id}" aria-label="${a.n}"><i></i>${a.id===cur.id?'<em>✓</em>':''}<span>${a.n}</span></button>`).join('')}</div>
  <div class="arn-go">${v.id===cur.id?'<div class="arn-ok">✓ Выбрана для боёв</div>':`<button class="btn main" data-arn="pick">Выбрать</button>`}</div>
  </div>`}
// the strip fades only on a side where more arenas are hidden
function arnFade(l){const x=l.scrollLeft;l.classList.toggle('fl',x>2);l.classList.toggle('fr',x<l.scrollWidth-l.clientWidth-2)}
// the battle wears the chosen arena; the attribute is touched only when it changes
function arnApply(){if(typeof document==='undefined'||!document.body)return;const B=document.body,id=typeof G!=='undefined'&&G&&G.phase==='battle'?arnCur().id:'';
  if((B.dataset.ar||'')!==id){if(id)B.dataset.ar=id;else delete B.dataset.ar}}
if(typeof render==='function'){const rn=render;render=function(){const r=rn.apply(this,arguments);arnApply();
  if(ui.arn&&typeof app!=='undefined'){app.insertAdjacentHTML('beforeend',arnHtml());const s=app.querySelector('.arn-t.on'),l=app.querySelector('.arn-ls');if(s&&l){l.scrollLeft=s.offsetLeft-(l.clientWidth-s.offsetWidth)/2;arnFade(l);l.addEventListener('scroll',()=>arnFade(l),{passive:true})}}
  return r}}
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-arn]');if(!b)return;
  e.stopPropagation();e.preventDefault();const a=b.dataset.arn;
  if(a==='open'){ui.mm=false;ui.arn=arnCur().id;ui.arnSc=null}
  else if(a==='x')ui.arn=null;
  else if(a==='pick'){META.arena=ui.arn;saveMeta()}
  else if(a.startsWith('v-'))ui.arnSc=ui.arn=a.slice(2);
  render()},true);
// the way in: «Арены» in the lobby menu and next to «Лавка» in Стая
if(typeof renderMenu==='function'){const rm=renderMenu;renderMenu=function(){const r=rm.apply(this,arguments);
  const p=app.querySelector('.lb-pop');if(p&&!p.querySelector('[data-arn]')){const f=p.querySelector('[data-act="lay-open"]');(f||p.firstChild).insertAdjacentHTML('afterend','<button class="pill lmi" data-arn="open">🏟<span class="lmi-l">Арены</span></button>')}
  return r}}
if(typeof render==='function'){const rn2=render;render=function(){const r=rn2.apply(this,arguments);
  if(typeof G!=='undefined'&&G&&G.phase==='lib'&&!ui.shop&&ui.lp==null){const s=app.querySelector('[data-act="lib-shop"]')||app.querySelector('[data-act="lfl-open"]');
    if(s&&!app.querySelector('.lib-arn'))s.insertAdjacentHTML('afterend','<button class="pill sm lib-arn" data-arn="open">🏟 Арены</button>')}
  return r}}
