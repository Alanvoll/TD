/* ---------- 0.39.1 Anton: the main screen is a game lobby, drawn in code (SVG + CSS).
   0.39.3 Anton 20:38: «elements overlap, text doesn't fit, looks worse than hypercasual; make it hand-painted».
   Now everything is painted: brush-textured sky, hills and castle with ink outlines and moonlit rims,
   buttons are worn painted plates and medallions with scuffs, ink-drawn icons instead of emoji,
   a storybook title. Layout: nothing overlaps at 360×640 … 412×915 (pets sized from the free space,
   moon away from the title, bottom bar no longer climbs onto the play buttons).
   Only the look changes: every button runs the same action as before. ---------- */

/* shared paint: filters (wobbly ink edge, brush texture, sky streaks) + plate colours, drawn once per screen */
const LB_DEFS_IN=(()=>{
  const lg=(id,a,b,c)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  return`<filter id="lbR" color-interpolation-filters="sRGB" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.2" xChannelSelector="R" yChannelSelector="G"/></filter>
  <filter id="lbP" color-interpolation-filters="sRGB" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".06 .55" numOctaves="3" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="g"/>
    <feComposite in="SourceGraphic" in2="g" operator="arithmetic" k1=".8" k2=".6" k3="0" k4="0" result="b"/><feComposite in="b" in2="SourceGraphic" operator="in" result="c"/>
    <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="2" result="w"/><feDisplacementMap in="c" in2="w" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter>
  <filter id="lbS" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".004 .045" numOctaves="3" seed="12" result="n"/><feColorMatrix in="n" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="g"/>
    <feComposite in="SourceGraphic" in2="g" operator="arithmetic" k1=".7" k2=".65" k3="0" k4="0" result="b"/><feComposite in="b" in2="SourceGraphic" operator="in"/></filter>
  <filter id="lbB" color-interpolation-filters="sRGB" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".02 .09" numOctaves="2" seed="7" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="18" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="1.6"/></filter>
  ${lg('lbgGold','#ffe7a6','#e9a940','#9c5214')}${lg('lbgSlate','#6370bd','#38418a','#1d2350')}${lg('lbgWood','#3b3360','#241e40','#15122a')}
  ${lg('lbgParch','#f4e6bd','#dcc18a','#b39050')}${lg('lbgViolet','#8a78ea','#5141b4','#2c2172')}
  <radialGradient id="lbgRim" cx=".38" cy=".3"><stop offset="0" stop-color="#ffe9ad"/><stop offset=".55" stop-color="#d39a45"/><stop offset="1" stop-color="#7a4513"/></radialGradient>
  <radialGradient id="lbgDisc" cx=".38" cy=".3"><stop offset="0" stop-color="#5b6bc0"/><stop offset=".6" stop-color="#2b3270"/><stop offset="1" stop-color="#171b42"/></radialGradient>
`})();
/* 0.39.4 Anton 21:04 «главный экран тормозит»: every painted piece is now a ready picture (an SVG image),
   so the phone paints the brush filters once instead of on every frame; only cheap moves stay animated */
const lbImg=(vb,body,par)=>'url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${par?` preserveAspectRatio="${par}"`:''}><defs>${LB_DEFS_IN}</defs>${body}</svg>`)+'")';

/* a worn painted plate behind a button: hand-drawn edge, brush texture, ink outline, top light, scuffs */
const LB_PL_D='M3.2 6.4 Q2.6 2.4 7.4 2.8 L28 2.1 L52 2.9 L76 1.9 L93 2.7 Q97.9 2.3 97.4 7.2 L97.9 20 L97.2 33.4 Q97.6 38 92.8 37.5 L70 38.3 L46 37.4 L22 38.2 L6.8 37.6 Q2.1 37.9 2.6 33.2 L2.1 20Z';
function lbPlateBody(k){const sc={Gold:['#fff3c8','#7a3c08'],Slate:['#c9d2ff','#0d1030'],Wood:['#b9a8ff','#06050f'],Parch:['#fffaf0','#6b4a1c'],Violet:['#e4dcff','#170f45']}[k];
  return`<path d="${LB_PL_D}" fill="url(#lbg${k})" filter="url(#lbP)"/>
  <path d="M9 7.5 Q50 5 91 7.2" stroke="${sc[0]}" stroke-opacity=".5" stroke-width="1.6" fill="none"/>
  <path d="M12 31 l7 -1.6 M63 9.5 l9 .8 M80 29 l6 -2.4 M30 12 l4 1.4 M44 33 l7 .4" stroke="${sc[1]}" stroke-opacity=".38" stroke-width="1.1" fill="none"/>
  <path d="M18 9.5 l5 -.6 M84 12 l3 2 M36 30.5 l6 -.8" stroke="${sc[0]}" stroke-opacity=".32" stroke-width="1" fill="none"/>
  <path d="${LB_PL_D}" fill="none" stroke="#100b1a" stroke-width="2.6" filter="url(#lbR)"/>`}
const lbPlate=k=>`<i class="lb-pl lbp-${k}"></i>`;
/* round worn medallion (gold rim, blue painted disc) */
const LB_MD_BODY=`
  <circle cx="30" cy="31.5" r="28.6" fill="#0b0918" filter="url(#lbR)"/>
  <circle cx="30" cy="30" r="26.4" fill="url(#lbgRim)" filter="url(#lbP)"/>
  <path d="M47 41 l3 2.2 M41 51.5 l2.4 -3 M9 37 l3.2 1 M17 9.5 l2 2.6 M52 21 l-3 1.4" stroke="#4a2608" stroke-opacity=".7" stroke-width="1.3" stroke-linecap="round"/>
  <circle cx="30" cy="30" r="20.6" fill="url(#lbgDisc)" filter="url(#lbP)"/>
  <circle cx="30" cy="30" r="20.6" fill="none" stroke="#120c1c" stroke-width="2"/>
  <path d="M13.5 22 A18 18 0 0 1 25 11.5" stroke="#ffffff" stroke-opacity=".28" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M9.5 18 A23 23 0 0 1 21 6.8" stroke="#fff6d8" stroke-opacity=".7" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <circle cx="30" cy="30" r="26.4" fill="none" stroke="#120c1c" stroke-width="2.2" filter="url(#lbR)"/>`;
const LB_MD='<i class="lb-md"></i>';

/* ink-drawn icons in the creature-art manner: thick dark outline, flat paint, one highlight */
const LB_IC_SRC=(()=>{const o='stroke="#150d0a" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"',h='fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.8" stroke-linecap="round"';
  const w=b=>`<g filter="url(#lbR)">${b}</g>`;
  const sword=`<path d="M10 8.5 L14.5 8 L35 28.5 L31.5 32 L11 11.5Z" fill="#dfe6f2" ${o}/><path d="M13 10.6 L32 29.6" ${h}/><path d="M28 35.5 L35.5 28 M32 31.5 L38.5 38" fill="none" ${o}/><path d="M31 32.5 L37.5 39" stroke="#8a4f1c" stroke-width="3.4" stroke-linecap="round"/><circle cx="39" cy="39.5" r="2.4" fill="#f2c25a" ${o}/>`;
  return{
  trophy:w(`<path d="M15 9h18v8c0 7-4 11.5-9 11.5S15 24 15 17z" fill="#f5c34e" ${o}/><path d="M15 12.5H9.5c0 6 2.6 8.5 6.4 8.8M33 12.5h5.5c0 6-2.6 8.5-6.4 8.8" fill="none" ${o}/><path d="M21.5 28.5h5v5.5h-5z" fill="#c7802a" ${o}/><path d="M14.5 34h19v5.5h-19z" fill="#8c4f22" ${o}/><path d="M19 12.5v6" ${h}/>`),
  crown:w(`<path d="M8 34 L9.5 15 L17.5 23.5 L24 11 L30.5 23.5 L38.5 15 L40 34Z" fill="#f5c34e" ${o}/><path d="M8 34h32v5.5H8z" fill="#c7802a" ${o}/><circle cx="24" cy="27.5" r="3" fill="#e2483f" ${o}/><circle cx="15" cy="29" r="2" fill="#5fa8ff" ${o}/><circle cx="33" cy="29" r="2" fill="#5fa8ff" ${o}/><path d="M12.5 19.5l1 9" ${h}/>`),
  puzzle:w(`<path d="M10 14h9a4.5 4.5 0 1 1 9 0h9v8.5a4.5 4.5 0 1 1 0 9V40h-8.5a4.5 4.5 0 1 0-9 0H10v-8.5a4.5 4.5 0 1 0 0-9z" fill="#6cc46a" ${o}/><path d="M14 18v9" ${h}/>`),
  scroll:w(`<path d="M15 9h20a4 4 0 0 1 4 4v24H19a4 4 0 0 1-4-4z" fill="#f1dfb0" ${o}/><path d="M11 13a4 4 0 0 1 8 0v20" fill="#d9bd7e" ${o}/><path d="M19 37a4 4 0 0 1-8 0" fill="#d9bd7e" ${o}/><path d="M23 17h11M23 22h11M23 27h8" stroke="#7a5326" stroke-width="2" stroke-linecap="round"/>`),
  medal:w(`<path d="M15 5.5h7l4.5 10-4.5 5-7-15z" fill="#e2483f" ${o}/><path d="M33 5.5h-7l-4.5 10 4.5 5 7-15z" fill="#4f8de0" ${o}/><circle cx="24" cy="30.5" r="11" fill="#f5c34e" ${o}/><path d="M24 23.5l2 4.4 4.6.4-3.5 3 1.1 4.6-4.2-2.5-4.2 2.5 1.1-4.6-3.5-3 4.6-.4z" fill="#fff1b8" stroke="#a9681c" stroke-width="1.4" stroke-linejoin="round"/>`),
  book:w(`<path d="M5.5 13.5c6.5-2.5 12.5-2 18.5 2 6-4 12-4.5 18.5-2v23c-6.5-2-12.5-1.5-18.5 2.5-6-4-12-4.5-18.5-2.5z" fill="#f1dfb0" ${o}/><path d="M24 15.5v23.5" fill="none" ${o}/><path d="M9.5 19.5c4-1 7.5-.6 11 1M9.5 25c4-1 7.5-.6 11 1M27.5 20.5c3.5-1.6 7-2 11-1M27.5 26c3.5-1.6 7-2 11-1" stroke="#7a5326" stroke-width="1.7" fill="none" stroke-linecap="round"/><path d="M5.5 36.5c6.5-2 12.5-1.5 18.5 2.5 6-4 12-4.5 18.5-2.5" fill="none" stroke="#b5434a" stroke-width="3"/>`),
  swords:w(`${sword}<g transform="translate(48 0) scale(-1 1)">${sword}</g>`),
  compass:w(`<circle cx="24" cy="24" r="16.5" fill="#c7802a" ${o}/><circle cx="24" cy="24" r="12" fill="#f4e6bd" ${o}/><path d="M24 12.5 L28 24 L24 35.5 L20 24Z" fill="#fff" ${o}/><path d="M24 12.5 L28 24 L20 24Z" fill="#e2483f" stroke="#150d0a" stroke-width="1.6" stroke-linejoin="round"/><circle cx="24" cy="24" r="2" fill="#150d0a"/><path d="M12.5 15a14 14 0 0 1 7-5" ${h}/>`),
  paw:w(`<path d="M24 23.5c-6 0-11 6.5-11 10.5 0 3.6 3 5.2 6 4.6 2-.4 3.3-1.1 5-1.1s3 .7 5 1.1c3 .6 6-1 6-4.6 0-4-5-10.5-11-10.5z" fill="#c98a5a" ${o}/><ellipse cx="11.5" cy="20" rx="3.6" ry="4.6" fill="#c98a5a" ${o}/><ellipse cx="18.5" cy="12.5" rx="3.8" ry="5" fill="#c98a5a" ${o}/><ellipse cx="29.5" cy="12.5" rx="3.8" ry="5" fill="#c98a5a" ${o}/><ellipse cx="36.5" cy="20" rx="3.6" ry="4.6" fill="#c98a5a" ${o}/><path d="M18 29.5c1.6-2 3.6-2.8 6-2.8" ${h}/>`),
  bag:w(`<path d="M17.5 17c-7 5.5-9.5 20.5 6.5 21.5 16-1 13.5-16 6.5-21.5z" fill="#b57a45" ${o}/><path d="M17 11.5h14l-3.5 5.5h-7z" fill="#8c5428" ${o}/><path d="M18 17h12" fill="none" ${o}/><circle cx="24" cy="29" r="5" fill="#f5c34e" ${o}/><path d="M14.5 25c.6-2.6 1.6-4.4 3-5.6" ${h}/>`),
  gem:w(`<path d="M11 18 L17 10 H31 L37 18 L24 38Z" fill="#5fb8ff" ${o}/><path d="M11 18H37M17 10l3 8 4 20M31 10l-3 8-4 20M20 18l4-8 4 8" fill="none" stroke="#150d0a" stroke-width="1.4" stroke-linejoin="round"/><path d="M14.5 17l3.5-4.5" ${h}/>`),
  menu:w(`<path d="M11 15.5 Q24 14 37 15.8M11 24 Q24 22.8 37 24.4M11 32.5 Q24 31.2 37 32.8" fill="none" stroke="#150d0a" stroke-width="6" stroke-linecap="round"/><path d="M11 15.5 Q24 14 37 15.8M11 24 Q24 22.8 37 24.4M11 32.5 Q24 31.2 37 32.8" fill="none" stroke="#ffe7a6" stroke-width="3" stroke-linecap="round"/>`),
  star:w(`<path d="M24 7l4.8 10.3 11.2 1.3-8.3 7.6 2.3 11.1L24 31.7l-10 5.6 2.3-11.1L8 18.6l11.2-1.3z" fill="#f5c34e" ${o}/><path d="M17.5 21l3-.4" ${h}/>`)}})();

const LB_IC=Object.fromEntries(Object.keys(LB_IC_SRC).map(k=>[k,`<i class="lb-ic lbi-${k}"></i>`]));

/* the painted night scene, one picture with stars, lit windows and paper grain */
const LBY_SCENE=(()=>{
  const ink='stroke="#07061a" stroke-width="2.6" stroke-linejoin="round" filter="url(#lbR)"';
  const tomb=(x,y,s,k)=>k?`<path d="M${x-1.2*s} ${y}v${-9*s}h${-3*s}v${-2.4*s}h${3*s}v${-3*s}h${2.4*s}v${3*s}h${3*s}v${2.4*s}h${-3*s}v${9*s}z"/>`:`<path d="M${x-4*s} ${y}v${-8*s}a${4*s} ${4*s} 0 0 1 ${8*s} 0v${8*s}z"/>`;
  const tree=(x,y,s,f)=>`<path transform="translate(${x} ${y}) scale(${f?-s:s} ${s})" d="M-3 0 L-2 -40 L-14 -62 L-12 -64 L-1 -48 L0 -78 L3 -78 L3 -52 L16 -70 L18 -68 L5 -44 L4 -24 L14 -32 L15 -30 L4 -16 L3 0Z"/>`;
  const M1='M-10 440 L30 404 L58 418 L96 372 L132 408 L160 388 L192 412 L232 362 L266 398 L300 378 L340 402 L372 382 L410 398 V540 H-10Z';
  const CAS='M232 476 V374 L240 352 L248 374 V394 H262 V378 L270 360 L278 378 V394 H282 V352 L291 320 L300 300 L309 320 L318 352 V394 H326 V374 L334 356 L342 374 V476Z';
  const H2='M-10 476 Q60 444 120 466 T240 460 T410 452 V570 H-10Z';
  const GR='M-10 524 Q100 498 200 512 T410 506 V810 H-10Z';
  let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;let stars='';
  for(let i=0;i<40;i++){const x=(rnd()*400).toFixed(1),y=(rnd()*340).toFixed(1),r=(rnd()*1.1+.5).toFixed(2),o=(rnd()*.6+.35).toFixed(2);
    stars+=rnd()<.25?`<path opacity="${o}" d="M${x} ${y-r*2.6}L${+x+r*.6} ${y}L${x} ${+y+r*2.6}L${x-r*.6} ${y}Z M${x-r*2.6} ${y}L${x} ${y-r*.6}L${+x+r*2.6} ${y}L${x} ${+y+r*.6}Z"/>`:`<circle opacity="${o}" cx="${x}" cy="${y}" r="${r}"/>`}
  const wins=[[254,386],[263,386],[289,366],[300,354],[300,368],[333,382],[342,382],[318,330]].map(([x,y])=>`<rect x="${x}" y="${y}" width="4" height="7" rx="2"/>`).join('');
  return`<defs>
    <filter id="lsGrain" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="21"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1"/></filter>
    <radialGradient id="lsMoonG"><stop offset="0" stop-color="#fff4cf" stop-opacity=".35"/><stop offset=".4" stop-color="#f7d98e" stop-opacity=".12"/><stop offset="1" stop-color="#f7d98e" stop-opacity="0"/></radialGradient>
    <linearGradient id="lsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0e2c"/><stop offset=".3" stop-color="#1a1f55"/><stop offset=".5" stop-color="#352c72"/><stop offset=".62" stop-color="#5a3b7c"/><stop offset=".72" stop-color="#2a2150"/><stop offset="1" stop-color="#0b0b1c"/></linearGradient>
    <radialGradient id="lsMoon" cx=".4" cy=".36"><stop offset="0" stop-color="#fffbe8"/><stop offset=".65" stop-color="#f6e1a2"/><stop offset="1" stop-color="#d9b062"/></radialGradient>
    <linearGradient id="lsM1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4592"/><stop offset="1" stop-color="#241f4e"/></linearGradient>
    <linearGradient id="lsM2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26225a"/><stop offset="1" stop-color="#15133a"/></linearGradient>
    <linearGradient id="lsGr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f48"/><stop offset=".4" stop-color="#10122c"/><stop offset="1" stop-color="#06070f"/></linearGradient>
    <radialGradient id="lsHz" cx=".5" cy=".5"><stop offset="0" stop-color="#b48cff" stop-opacity=".42"/><stop offset="1" stop-color="#8a5cff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect x="-10" y="-10" width="420" height="820" fill="url(#lsSky)" filter="url(#lbS)"/>
  <g fill="#fff6dc">${stars}</g>
  <circle cx="300" cy="172" r="90" fill="url(#lsMoonG)"/>
  <g filter="url(#lbB)" opacity=".55">
    <path d="M-20 120 Q80 96 170 118 T380 108" stroke="#2e3a86" stroke-width="26" fill="none" stroke-linecap="round"/>
    <path d="M40 300 Q150 280 260 300 T430 290" stroke="#5a4796" stroke-width="20" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M-30 210 Q60 196 140 214" stroke="#3c3f92" stroke-width="16" fill="none" stroke-linecap="round" opacity=".8"/>
  </g>
    <g filter="url(#lbP)"><circle cx="300" cy="172" r="31" fill="url(#lsMoon)"/></g>
  <g fill="#c99d4f" opacity=".38" filter="url(#lbR)"><circle cx="289" cy="163" r="6"/><circle cx="311" cy="185" r="4.4"/><circle cx="312" cy="160" r="3"/><circle cx="293" cy="186" r="2.6"/></g>
  <circle cx="300" cy="172" r="31" fill="none" stroke="#5a3d1a" stroke-opacity=".5" stroke-width="1.6" filter="url(#lbR)"/>
  <g filter="url(#lbB)">
    <path d="M18 196 Q60 176 110 190 Q150 174 196 192" stroke="#8f86d6" stroke-opacity=".22" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M226 330 Q280 314 340 328 Q370 320 410 330" stroke="#c0b4ff" stroke-opacity=".2" stroke-width="12" fill="none" stroke-linecap="round"/>
  </g>
  <ellipse cx="200" cy="452" rx="320" ry="96" fill="url(#lsHz)"/>
  <path d="${M1}" fill="url(#lsM1)" filter="url(#lbP)"/>
  <path d="M58 418 L96 372 L112 388 M232 362 L266 398 M300 378 L340 402 L372 382" stroke="#a99cf0" stroke-opacity=".45" stroke-width="2.2" fill="none" stroke-linecap="round" filter="url(#lbR)"/>
  <path d="${M1}" fill="none" ${ink}/>
  <g transform="translate(34 0)"><path d="${CAS}" fill="#17133a" filter="url(#lbP)"/>
  <path d="M309 320 L318 352 V394 M278 378 V394 M342 374 V470" stroke="#8f7fe0" stroke-opacity=".5" stroke-width="1.8" fill="none" filter="url(#lbR)"/>
  <path d="${CAS}" fill="none" ${ink}/>
  <path d="M296 300 L300 284 L304 300Z" fill="#17133a" ${ink}/><path d="M300.8 278 V288" stroke="#07061a" stroke-width="1.6"/><path d="M300.8 278 L311 281 L300.8 284.5Z" fill="#c94a4a" stroke="#07061a" stroke-width="1.2"/><g fill="#ffcf6a">${wins}</g></g>
  <path d="${H2}" fill="url(#lsM2)" filter="url(#lbP)"/><path d="${H2}" fill="none" ${ink}/>
  <path d="M10 466 Q60 446 112 462" stroke="#7b6fd0" stroke-opacity=".35" stroke-width="2" fill="none" filter="url(#lbR)"/>
  <g fill="#0d0b24" ${ink}>${tree(40,476,1.05)}${tree(372,470,.9,1)}${tree(124,472,.6)}</g>
  <path d="${GR}" fill="url(#lsGr)" filter="url(#lbP)"/><path d="${GR}" fill="none" ${ink}/>
  <path d="M-10 524 Q100 498 200 512" stroke="#8a7ce0" stroke-opacity=".28" stroke-width="2" fill="none" filter="url(#lbR)"/>
  <g fill="#0b0a1e" ${ink}>${tomb(30,532,1.4,0)}${tomb(58,536,1.1,1)}${tomb(84,530,.9,0)}${tomb(330,530,1.2,1)}${tomb(356,534,1.5,0)}${tomb(382,528,1,0)}${tomb(305,534,.8,0)}</g>
  <g filter="url(#lbB)" opacity=".5"><path d="M-10 610 Q120 590 230 606 T420 600" stroke="#2c2f6a" stroke-width="22" fill="none"/><path d="M-10 700 Q140 684 260 698 T420 692" stroke="#1d1f4c" stroke-width="26" fill="none"/></g>
  <rect x="-10" y="-10" width="420" height="820" filter="url(#lsGrain)" opacity=".1"/>`})();

/* the only moving bits: a few twinkles, drifting fog and fireflies (opacity/transform only, no repaint) */
const LBY_TW=[[8,6],[22,15],[47,4],[63,12],[86,8],[36,24],[74,27],[12,33]].map(([x,y],i)=>`<i style="left:${x}%;top:${y}%;animation-delay:${-i*.7}s;animation-duration:${3+i%3}s"></i>`).join('');

const LBY_RUNES_BODY=`<defs><radialGradient id="lsRg"><stop offset="0" stop-color="#9fd0ff" stop-opacity=".45"/><stop offset=".6" stop-color="#5a6cff" stop-opacity=".14"/><stop offset="1" stop-color="#5a6cff" stop-opacity="0"/></radialGradient></defs>
  <circle r="98" fill="url(#lsRg)"/><g filter="url(#lbR)"><circle r="86" fill="none" stroke="#dcecff" stroke-opacity=".65" stroke-width="3"/><circle r="78" fill="none" stroke="#bfe1ff" stroke-opacity=".4" stroke-width="1.6" stroke-dasharray="7 6"/>
  ${[...Array(12).keys()].map(i=>`<path transform="rotate(${i*30})" d="M0 -84 l3.4 6 l-3.4 6 l-3.4 -6z" fill="#eef6ff" fill-opacity=".85"/>`).join('')}
  <circle r="58" fill="none" stroke="#ffe7a3" stroke-opacity=".55" stroke-width="2.2"/><path d="M0 -58 L50 29 L-50 29Z M0 58 L-50 -29 L50 -29Z" fill="none" stroke="#ffe7a3" stroke-opacity=".35" stroke-width="1.6"/></g>`;

function lbyTeam(){const own=i=>PETS[i]&&mp(PETS[i].n).un;let l=(META.lastQ||[]).filter(own);
  if(l.length<3)l=l.concat(PETS.map((p,i)=>i).filter(i=>own(i)&&!l.includes(i)));return l.slice(0,3)}
const lbyFF=[...Array(8).keys()].map(i=>`<i style="left:${(i*37+11)%100}%;top:${48+(i*23)%40}%;animation-delay:${-(i*1.7)%9}s;animation-duration:${7+i%5}s"></i>`).join('');

/* 0.39.5 Anton 21:16 «слишком перегружен, сделай проще»: only the pack, one big «Забег» and two quick fights stay on the screen;
   the six other places (Лига, Логова, Задачи, Задания, Награды, Кодекс) moved behind «Ещё» in the bottom bar; no fireflies, fog or twinkles */
renderMenu=function(){
  const lg=LEAGUES[lgOf(rk().pts)],up=PETS.filter(p=>canQUp(p.n)).length,qr=questReady(),ar=achReady();
  const dot=n=>n?`<span class="lby-dot">${n}</span>`:'';
  const rb=(act,ic,t,n)=>`<button class="lby-rb" data-act="${act}"><span class="lby-rbi">${LB_MD}${LB_IC[ic]}${dot(n)}</span><span class="lby-rbt">${t}</span></button>`;
  const t=lbyTeam(),R=META.run;
  setApp(`<div class="lby">
  <div class="lby-bg"><div class="lby-scene"></div></div>
  <div class="lby-in">
    <div class="lby-hud">
      <button class="lby-me" data-act="m-rank"><span class="lby-av">${LB_MD}${LB_IC.paw}</span><span class="lby-mt">${lbPlate('Wood')}<b>${lg.ic} ${lg.n}</b><span>${plN(rk().pts,'очко','очка','очков',1)}</span></span></button>
      <span class="lby-cur">${lbPlate('Wood')}${LB_IC.gem}<b>${META.stones}</b></span>
      <button class="lby-gear${ui.mm?' on':''}" data-act="mm-menu" aria-label="Меню">${lbPlate('Slate')}${LB_IC.menu}</button>
    </div>
    <div class="lby-logo"><div class="lby-lt">Бой стаи</div><div class="lby-ver">v${VER} · сборка ${BUILD}</div></div>
    <div class="lby-stage">
      <button class="lby-arena" data-act="m-lib" aria-label="Стая"><span class="lby-ring"><i></i></span>
        ${t.map((i,k)=>`<span class="lby-pet q${k}"><span class="lby-sh"></span>${petIc(PETS[i],1)}</span>`).join('')}</button>
    </div>
    <button class="lby-go" data-act="m-run">${lbPlate('Gold')}<span class="lby-goi">${LB_IC.compass}</span><span class="lby-got"><b${R?' class="lby-cont"':''}>${R?'Продолжить забег':'Забег'}</b><small>${R?`акт ${R.act+1} · ❤ ${R.lives}`:'бои, находки, боссы'}</small></span></button>
    <div class="lby-play">
      <button class="lby-sb" data-act="m-quick">${lbPlate('Slate')}${LB_IC.swords}<b>Быстрый бой</b></button>
      <button class="lby-sb" data-act="m-quick4">${lbPlate('Slate')}<span class="lby-4">4</span><b>Бой четвёрок</b></button>
    </div>
    <div class="lby-nav">${lbPlate('Wood')}
      <button data-act="m-lib"><span class="lby-ni">${LB_IC.paw}${dot(up)}</span><span class="lby-nt">Стая</span></button>
      <button class="on" data-act="mm-home">${lbPlate('Slate')}<span class="lby-onr"></span><span class="lby-ni">${LB_IC.swords}</span><span class="lby-nt">Бой</span></button>
      <button data-act="m-shop"><span class="lby-ni">${LB_IC.bag}</span><span class="lby-nt">Лавка</span></button>
      <button class="${ui.lmore?'op':''}" data-act="mm-more"><span class="lby-ni">${LB_IC.scroll}${dot(qr+ar)}</span><span class="lby-nt">Ещё</span></button>
    </div>
  </div>
  ${ui.lmore?`<div class="lby-more" data-act="mm-morex"><div class="lby-sheet">
    ${rb('m-quests','scroll','Задания',qr)}${rb('m-ach','medal','Награды',ar)}${rb('m-rank','trophy','Лига',0)}
    ${rb('m-lair','crown','Логова',0)}${rb('m-puz','puzzle','Задачи',0)}${rb('m-codex','book','Кодекс',0)}</div></div>`:''}
  ${ui.mm?`<div class="lmenu-over" data-act="mm-x"><div class="lmenu-pop lb-pop"><button class="pill lmi" data-act="fs">⛶<span class="lmi-l">Весь экран</span></button><button class="pill lmi" data-act="lay-open">🎛<span class="lmi-l">Вид экрана боя</span></button><button class="pill lmi" data-act="m-cheat">🛠<span class="lmi-l">Читы</span></button><span class="m lb-pv">v${VER} · сборка ${BUILD}</span></div></div>`:''}
  </div>`)};
if(typeof modeClick==='function'){const mc1=modeClick;modeClick=function(act){
  if(act==='mm-home')return true;
  if(act==='mm-more'){ui.lmore=!ui.lmore;render();return true}
  if(act==='mm-morex'){ui.lmore=false;render();return true}
  if(ui.lmore)ui.lmore=false;
  if(act==='m-shop'){ui.mm=false;CTX=null;G={phase:'lib'};ui.lp=null;ui.shop=true;render();return true}
  return mc1(act)}}
// the lobby owns the whole screen: no page scroll behind it
if(typeof setApp==='function'){const sa1=setApp;setApp=function(h){const r=sa1(h);if(typeof document!=='undefined'&&document.body)document.body.classList.toggle('lby-on',typeof G!=='undefined'&&!!G&&G.phase==='menu');return r}}

if(typeof document!=='undefined'&&document.body){const st=document.createElement('style');const imgCss=['Gold','Slate','Wood','Parch','Violet'].map(k=>`.lbp-${k}{background-image:${lbImg('0 0 100 40',lbPlateBody(k),'none')}}`).join('\n')+'\n'+
  Object.entries(LB_IC_SRC).map(([k,b])=>`.lbi-${k}{background-image:${lbImg('0 0 48 48',b)}}`).join('\n')+
  `\n.lb-md{background-image:${lbImg('0 0 60 60',LB_MD_BODY)}}\n.lby-scene{background-image:${lbImg('0 0 400 800',LBY_SCENE,'xMidYMid slice')}}\n.lby-ring i{background-image:${lbImg('-100 -100 200 200',LBY_RUNES_BODY)}}`;
  st.textContent=imgCss+`
body.lby-on{overflow:hidden;height:100dvh}
.lby{position:fixed;inset:0;z-index:1;overflow:hidden;color:#fff;touch-action:manipulation;-webkit-user-select:none;user-select:none;--lbf:"Philosopher","Rubik",Georgia,serif;--lbw:700}
.lby-bg{position:absolute;inset:0;background:#0a0b1a}
.lby-scene{position:absolute;inset:0;background-color:#0a0b1a;background-position:center;background-size:cover;background-repeat:no-repeat}
.lby-tw i{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff6dc;box-shadow:0 0 4px 1px #fff6dc88;animation:lsTw 4s ease-in-out infinite;will-change:opacity}
.lby-bg:after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(120% 80% at 50% 45%,transparent 55%,#05040ccc 100%)}
@keyframes lsTw{0%,100%{opacity:.9}50%{opacity:.25}}
.lby-fog{position:absolute;left:-50%;width:200%;height:26%;pointer-events:none;will-change:transform;background:radial-gradient(40% 50% at 25% 50%,#a99cff22,transparent 70%),radial-gradient(35% 45% at 70% 55%,#a99cff1c,transparent 70%);animation:lsFog 40s linear infinite}
.lby-fog.f1{top:52%}.lby-fog.f2{top:70%;animation-duration:55s;animation-direction:reverse;opacity:.8}
@keyframes lsFog{0%{transform:translateX(0)}50%{transform:translateX(18%)}100%{transform:translateX(0)}}
.lby-ff i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff3a0;box-shadow:0 0 6px 2px #ffe06a99;animation:lsFF 8s ease-in-out infinite;opacity:0;will-change:transform,opacity}
@keyframes lsFF{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}50%{transform:translate(18px,-26px)}80%{opacity:.8}100%{opacity:0;transform:translate(-10px,-48px)}}
.lby-in{position:relative;z-index:1;height:100%;box-sizing:border-box;max-width:460px;margin:0 auto;display:flex;flex-direction:column;padding:max(10px,env(safe-area-inset-top)) 12px max(8px,env(safe-area-inset-bottom))}
.lby :where(button){position:relative;font:inherit;background:none;border:0;padding:0;color:inherit;-webkit-tap-highlight-color:transparent}
.lb-pl{position:absolute;inset:0;z-index:0;pointer-events:none;background-position:center;background-size:100% 100%;background-repeat:no-repeat}
.lb-md{position:absolute;inset:0;background-position:center;background-size:contain;background-repeat:no-repeat}
.lb-ic{position:relative;z-index:1;display:block;width:100%;height:100%;background-position:center;background-size:contain;background-repeat:no-repeat;pointer-events:none}
/* top bar */
.lby-hud{display:flex;align-items:center;gap:8px}
.lby-me{display:flex;align-items:center;flex:1;min-width:0;text-align:left}
.lby-av{position:relative;z-index:2;display:block;width:48px;height:48px;flex:none;}
.lby-av .lb-ic{position:absolute;left:23%;top:23%;width:54%;height:54%}
.lby-mt{position:relative;display:flex;flex-direction:column;min-width:0;padding:5px 12px 6px 20px;margin-left:-12px}
.lby-mt b,.lby-mt span{position:relative;z-index:1}
.lby-mt b{font-family:var(--lbf);font-weight:700;font-size:16px;line-height:1.05;color:#ffe9b0;text-shadow:0 1px 0 #120c1c,0 2px 2px #000}
.lby-mt>span:last-child{font-size:12px;color:#ddd8ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 0 #000}
.lby-cur{position:relative;display:flex;align-items:center;gap:4px;padding:5px 12px 5px 6px;flex:none}
.lby-cur .lb-ic{width:24px;height:24px}.lby-cur b{position:relative;z-index:1;font-size:15px;color:#e6f3ff;text-shadow:0 1px 0 #000}
.lby-gear{width:44px;height:42px;flex:none;display:flex;align-items:center;justify-content:center}
.lby-gear .lb-ic{width:30px;height:30px}
/* title: painted gold letters on a dark brush stroke, away from the moon */
.lby-logo{position:relative;text-align:center;margin-top:8px;align-self:flex-start;margin-left:4px}
.lby-logo:before{content:"";position:absolute;left:-14px;right:-18px;top:16%;bottom:12%;z-index:-1;border-radius:46% 54% 50% 50%/60% 50% 50% 40%;background:radial-gradient(closest-side,#07061acc,#07061a88 70%,transparent)}
.lby-lt{font-family:var(--lbf);font-weight:700;font-size:clamp(36px,11.5vw,50px);line-height:1;letter-spacing:.01em;filter:drop-shadow(0 3px 0 #2a1405);
  background:linear-gradient(#fff6d6 8%,#ffd773 42%,#e39433 70%,#b8641c 92%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:1.6px #2a1405;paint-order:stroke fill}
.lby-ver{font-size:11px;color:#d9d4ffcc;margin-top:1px;text-align:left;padding-left:3px;text-shadow:0 1px 2px #000}
/* stage */
.lby-stage{flex:1;min-height:0;display:flex;align-items:stretch;gap:6px;margin-top:2px}
.lby-side{display:flex;flex-direction:column;justify-content:center;gap:10px;width:64px;flex:none}
.lby-rb{display:flex;flex-direction:column;align-items:center;gap:2px}
.lby-rbi{position:relative;display:block;width:58px;height:58px;}
.lby-rbi .lb-ic{position:absolute;left:20%;top:20%;width:60%;height:60%}
.lby-rb:active .lby-rbi{transform:scale(.93)}
.lby-rbt{font-size:12.5px;font-weight:700;color:#fff3d6;text-shadow:0 1px 0 #120c1c,0 -1px 0 #120c1c,1px 0 0 #120c1c,-1px 0 0 #120c1c,0 2px 4px #000}
.lby-dot{position:absolute;z-index:3;right:-4px;top:-3px;min-width:20px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:10px;background:#e8433f;border:2px solid #150d0a;color:#fff;font-size:11.5px;font-weight:800;line-height:16px;text-align:center;animation:lsDot 1.6s ease-in-out infinite}
@keyframes lsDot{50%{transform:scale(1.15)}}
.lby-arena{position:relative;flex:1;min-width:0;display:block;container-type:size}
.lby-ring{position:absolute;left:50%;bottom:0;width:min(104cqw,74cqh);aspect-ratio:1;transform:translateX(-50%) perspective(500px) rotateX(70deg);transform-origin:50% 70%;pointer-events:none}
.lby-ring i{display:block;width:100%;height:100%;background-position:center;background-size:contain;background-repeat:no-repeat;animation:lsRot 30s linear infinite;will-change:transform}
@keyframes lsRot{to{transform:rotate(360deg)}}
.lby-beam{position:absolute;left:50%;bottom:10%;width:80%;height:70%;transform:translateX(-50%);background:radial-gradient(50% 60% at 50% 100%,#8fb8ff38,transparent 70%);animation:lsMg 5s ease-in-out infinite;will-change:opacity}
@keyframes lsMg{50%{opacity:.6}}
.lby-pet{position:absolute;display:block}
.lby-bob{position:absolute;inset:0;will-change:transform;display:flex;align-items:flex-end;justify-content:center;animation:lsBob 3.4s ease-in-out infinite;font-size:48px}
.lby-pet img{position:relative;z-index:1;width:100%;height:100%;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 0 1px #000) drop-shadow(0 8px 6px #0009)}
.lby-pet.q0{left:50%;bottom:3cqh;width:min(52cqw,46cqh);height:min(52cqw,46cqh);transform:translateX(-50%);z-index:3}
.lby-pet.q1,.lby-pet.q2{bottom:calc(3cqh + min(52cqw,46cqh)*.8);width:min(36cqw,31cqh);height:min(36cqw,31cqh);z-index:2}
.lby-pet.q1{left:1cqw}.lby-pet.q2{right:1cqw}
.lby-pet.q1 .lby-bob{animation-delay:-1.2s}.lby-pet.q2 .lby-bob{animation-delay:-2.3s}
.lby-sh{position:absolute;left:18%;right:18%;bottom:-4px;height:12px;border-radius:50%;background:radial-gradient(closest-side,#000b,transparent)}
@keyframes lsBob{50%{transform:translateY(-5px)}}
/* goal: a parchment strip */
.lby-goal{display:flex;align-items:center;gap:10px;margin:6px 0 0;padding:6px 14px 7px 8px;text-align:left;color:#3a230c;font-size:13px;font-weight:600;line-height:1.2;}
.lby-gi{position:relative;z-index:1;width:28px;height:28px;flex:none}.lby-gt{position:relative;z-index:1}
/* play row */
.lby-play{display:flex;align-items:stretch;gap:8px;margin-top:8px}
.lby-sb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;width:74px;flex:none;padding:7px 3px 8px;color:#fff;}
.lby-sb .lb-ic{width:30px;height:30px}.lby-sb b{position:relative;z-index:1;font-size:12px;line-height:1.1;text-align:center;text-shadow:0 1px 0 #0d1030,0 -1px 0 #0d1030,1px 0 0 #0d1030,-1px 0 0 #0d1030}
.lby-4{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;width:28px;height:28px;margin:1px 0;border-radius:8px 6px 9px 7px;background:#f4e6bd;border:2px solid #150d0a;color:#3a1a05;font-family:var(--lbf);font-weight:700;font-size:19px;line-height:1}
.lby-sb:active,.lby-go:active{transform:translateY(3px)}
.lby-go{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 8px 11px;overflow:hidden;color:#3a1a05;}
.lby-goi{position:relative;z-index:1;width:36px;height:36px;flex:none}
.lby-got{position:relative;z-index:1;display:flex;flex-direction:column;align-items:flex-start;min-width:0}
.lby-got b{font-family:var(--lbf);font-weight:700;font-size:clamp(22px,6.6vw,28px);line-height:1;color:#3a1a05;text-shadow:0 1px 0 #fff3c6}
.lby-got b.lby-cont{font-size:clamp(18px,5.2vw,25px)}
.lby-got small{font-size:13px;font-weight:700;color:#3a2208;line-height:1.15;white-space:nowrap;text-shadow:0 0 1px #fff0c899,0 1px 0 #fff0c899}
.lby-shine{position:absolute;z-index:1;top:0;bottom:0;left:0;width:24%;background:linear-gradient(100deg,transparent,#ffffff70,transparent);animation:lsSh 3.6s ease-in-out infinite;pointer-events:none;will-change:transform}
@keyframes lsSh{0%,60%{transform:translateX(-170%) skewX(-20deg)}100%{transform:translateX(560%) skewX(-20deg)}}
/* bottom bar: a dark painted plank, the current tab on a violet plate, nothing climbs out of the bar */
.lby-nav{position:relative;display:grid;grid-template-columns:1fr 1fr 1fr;align-items:stretch;gap:6px;margin-top:9px;padding:5px 6px;}
.lby-nav>button{display:flex;flex-direction:column;align-items:center;gap:0;padding:4px 2px 5px;color:#d9d4ff;font-size:12.5px;font-weight:700;text-shadow:0 1px 0 #000}
.lby-nav>button.on{color:#ffe7a6}
.lby-onr{position:absolute!important;inset:3px;border:2px solid #e8c77a;border-radius:6px 4px 7px 5px;opacity:.85;pointer-events:none}
.lby-nav>button>*:not(.lb-pl){position:relative;z-index:1}
.lby-ni{position:relative;display:block;width:30px;height:30px}.lby-ni .lby-dot{right:-14px;top:-4px}
.lb-pop .lb-pv{font-size:10px;text-align:center;padding:4px 0 0}
@media (max-height:700px){.lby-logo{margin-top:4px}.lby-lt{font-size:34px}.lby-rbi{width:50px;height:50px}.lby-side{gap:6px}.lby-rbt{font-size:12px}
  .lby-goal{padding:4px 12px 5px 6px;font-size:13px}.lby-gi{width:24px;height:24px}.lby-play{margin-top:6px}.lby-nav{margin-top:6px}.lby-ni{width:26px;height:26px}.lby-goi{width:34px;height:34px}}
@media (max-width:370px){.lby-side{width:58px}.lby-sb{width:70px}.lby-go{gap:5px;padding-left:6px;padding-right:6px}.lby-goi{width:32px;height:32px}.lby-got small{font-size:12px}}
@media (prefers-reduced-motion:reduce){.lby *,.lby{animation:none!important}}
/* 0.39.5 simpler layout */
.lby-stage{margin-top:0}.lby-arena{width:100%}
.lby-ring{width:min(92cqw,60cqh)}.lby-ring i{animation:none}
.lby-pet{animation:none}
.lby-pet.q0{bottom:4cqh;width:min(46cqw,52cqh);height:min(46cqw,52cqh)}
.lby-pet.q1,.lby-pet.q2{bottom:calc(6cqh + min(46cqw,52cqh)*.55);width:min(30cqw,34cqh);height:min(30cqw,34cqh)}
.lby-pet.q1{left:8cqw}.lby-pet.q2{right:8cqw}
.lby .lby-go{flex:none;width:100%;margin-top:6px;padding:12px 14px 13px;gap:10px}
.lby .lby-goi{width:42px;height:42px}.lby-got b{font-size:30px}.lby-got b.lby-cont{font-size:24px}.lby-got small{font-size:13px}
.lby .lby-play{margin-top:8px}
.lby .lby-sb{flex:1;width:auto;flex-direction:row;gap:8px;padding:9px 8px 10px}
.lby .lby-sb b{font-size:14px;white-space:nowrap}.lby .lby-sb .lb-ic{width:26px;height:26px}.lby .lby-4{width:24px;height:24px;font-size:16px}
.lby-nav{grid-template-columns:repeat(4,1fr)}
.lby-more{position:absolute;inset:0;z-index:5;display:flex;align-items:flex-end;justify-content:center;background:#05040ca6;padding:0 12px max(78px,calc(env(safe-area-inset-bottom) + 78px))}
.lby-sheet{position:relative;display:grid;background:linear-gradient(#2d2650,#17132c);border:2.5px solid #100b1a;border-radius:14px 10px 16px 12px;box-shadow:inset 0 1.5px 0 #b9a8ff55,0 8px 20px #000a;grid-template-columns:repeat(3,1fr);gap:14px 8px;width:100%;max-width:436px;padding:18px 10px 16px}
.lby-sheet>.lby-rb{position:relative;z-index:1}
@media (max-height:700px){.lby .lby-go{padding:9px 12px 10px}.lby .lby-goi{width:36px;height:36px}.lby-got b{font-size:26px}.lby .lby-sb{padding:7px 8px 8px}.lby-more{padding-bottom:70px}}
`;document.body.appendChild(st)}
// the first screen is drawn before this file loads: draw the lobby right away
try{const tp=document.createElement('template');if(tp.content&&typeof tp.content.querySelector==='function'&&typeof G!=='undefined'&&G&&G.phase==='menu'&&typeof app!=='undefined'&&app&&typeof render==='function')render()}catch(e){}
