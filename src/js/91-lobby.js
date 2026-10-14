/* ---------- 0.39.1 Anton: the main screen is a game lobby, drawn in code (SVG + CSS).
   0.39.7 Anton 21:26: no hand-painted look («убрать рисованный дизайн»), the layout and every button of build 142 stay.
   Plain clean style: flat dark-blue panels with thin borders, flat round mode buttons, one solid gold «Забег» button,
   the simple night scene without filters. Nothing on this screen moves (it must not lag on a phone),
   nothing overlaps from 360×640 to 412×915, taps react at once (no double-tap zoom delay).
   Only the look changes: every button runs the same action as before. ---------- */

const LBY_SCENE=(()=>{
  let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
  let stars='';for(let i=0;i<40;i++){const x=(rnd()*400).toFixed(1),y=(rnd()*330).toFixed(1),r=(rnd()*1.1+.4).toFixed(2),o=(rnd()*.6+.3).toFixed(2);stars+=`<circle cx="${x}" cy="${y}" r="${r}" opacity="${o}"/>`}
  const tomb=(x,y,s,k)=>k?`<path d="M${x-1.2*s} ${y}v${-9*s}h${-3*s}v${-2.4*s}h${3*s}v${-3*s}h${2.4*s}v${3*s}h${3*s}v${2.4*s}h${-3*s}v${9*s}z"/>`:`<path d="M${x-4*s} ${y}v${-8*s}a${4*s} ${4*s} 0 0 1 ${8*s} 0v${8*s}z"/>`;
  const tree=(x,y,s,f)=>`<path transform="translate(${x} ${y}) scale(${f?-s:s} ${s})" d="M-3 0 L-2 -40 L-14 -62 L-12 -64 L-1 -48 L0 -78 L3 -78 L3 -52 L16 -70 L18 -68 L5 -44 L4 -24 L14 -32 L15 -30 L4 -16 L3 0Z"/>`;
  const wins=[[288,386],[297,386],[323,366],[334,354],[334,368],[367,382],[376,382],[352,330]].map(([x,y])=>`<rect x="${x}" y="${y}" width="4" height="7" rx="2"/>`).join('');
  return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b24"/><stop offset=".35" stop-color="#151a46"/><stop offset=".55" stop-color="#29245e"/><stop offset=".66" stop-color="#3b2c66"/><stop offset=".8" stop-color="#171433"/><stop offset="1" stop-color="#0a0b1a"/></linearGradient>
    <radialGradient id="g"><stop offset="0" stop-color="#fff4cf" stop-opacity=".3"/><stop offset=".4" stop-color="#f7d98e" stop-opacity=".1"/><stop offset="1" stop-color="#f7d98e" stop-opacity="0"/></radialGradient>
    <radialGradient id="m" cx=".4" cy=".38"><stop offset="0" stop-color="#fffbe8"/><stop offset=".7" stop-color="#f6e2a6"/><stop offset="1" stop-color="#e2bf6e"/></radialGradient>
  </defs>
  <rect width="400" height="800" fill="url(#a)"/>
  <g fill="#fff">${stars}</g>
  <circle cx="300" cy="172" r="90" fill="url(#g)"/><circle cx="300" cy="172" r="30" fill="url(#m)"/>
  <g fill="#d9b86a" opacity=".3"><circle cx="290" cy="164" r="5.5"/><circle cx="311" cy="184" r="4"/><circle cx="312" cy="160" r="2.8"/></g>
  <path d="M0 430 L30 400 L60 415 L95 370 L130 405 L160 385 L190 410 L230 360 L265 395 L300 375 L340 400 L370 380 L400 395 V520 H0Z" fill="#2a2862"/>
  <path fill="#120f2e" d="M266 476 V374 L274 352 L282 374 V394 H296 V378 L304 360 L312 378 V394 H316 V352 L325 320 L334 300 L343 320 L352 352 V394 H360 V374 L368 356 L376 374 V476Z"/>
  <g fill="#ffcf6a">${wins}</g>
  <path d="M0 476 Q60 444 120 466 T240 460 T400 452 V570 H0Z" fill="#1b1942"/>
  <g fill="#0c0b22">${tree(40,476,1.05)}${tree(372,470,.9,1)}${tree(124,472,.6)}</g>
  <path d="M0 524 Q100 498 200 512 T400 506 V800 H0Z" fill="#10122c"/>
  <g fill="#0a0a1c">${tomb(30,532,1.4,0)}${tomb(58,536,1.1,1)}${tomb(84,530,.9,0)}${tomb(330,530,1.2,1)}${tomb(356,534,1.5,0)}${tomb(382,528,1,0)}${tomb(305,534,.8,0)}</g>
  </svg>`})();
const LBY_BG='url("data:image/svg+xml,'+encodeURIComponent(LBY_SCENE)+'")';

const LBY_RING='url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200"><defs><radialGradient id="r"><stop offset="0" stop-color="#9fd0ff" stop-opacity=".4"/><stop offset=".6" stop-color="#5a6cff" stop-opacity=".12"/><stop offset="1" stop-color="#5a6cff" stop-opacity="0"/></radialGradient></defs>
  <circle r="98" fill="url(#r)"/><circle r="86" fill="none" stroke="#bfe1ff" stroke-opacity=".6" stroke-width="2"/><circle r="78" fill="none" stroke="#bfe1ff" stroke-opacity=".35" stroke-width="1" stroke-dasharray="6 5"/>
  <circle r="58" fill="none" stroke="#ffe7a3" stroke-opacity=".45" stroke-width="1.5"/></svg>`)+'")';

function lbyTeam(){const own=i=>PETS[i]&&mp(PETS[i].n).un;let l=(META.lastQ||[]).filter(own);
  if(l.length<3)l=l.concat(PETS.map((p,i)=>i).filter(i=>own(i)&&!l.includes(i)));return l.slice(0,3)}

renderMenu=function(){
  const lg=LEAGUES[lgOf(rk().pts)],up=PETS.filter(p=>canQUp(p.n)).length,qr=questReady(),ar=achReady();
  const dot=n=>n?`<span class="lby-dot">${n}</span>`:'';
  const rb=(act,ic,t,n)=>`<button class="lby-rb" data-act="${act}"><span class="lby-rbi">${ic}${dot(n)}</span><span class="lby-rbt">${t}</span></button>`;
  const t=lbyTeam(),g=typeof goalNext==='function'?goalNext():null,R=META.run;
  setApp(`<div class="lby">
  <div class="lby-bg"></div>
  <div class="lby-in">
    <div class="lby-hud">
      <button class="lby-me" data-act="m-rank"><span class="lby-av">🐾</span><span class="lby-mt"><b>${lg.ic} ${lg.n}</b><span>${plN(rk().pts,'очко','очка','очков',1)}</span></span></button>
      <span class="lby-cur"><span>💎</span><b>${META.stones}</b></span>
      <button class="lby-gear${ui.mm?' on':''}" data-act="mm-menu" aria-label="Меню">☰</button>
    </div>
    <div class="lby-logo"><div class="lby-lt">Бой стаи</div><div class="lby-ver">v${VER} · сборка ${BUILD}</div></div>
    <div class="lby-stage">
      <div class="lby-side">${rb('m-rank','🏆','Лига',0)}${rb('m-lair','👑','Логова',0)}${rb('m-puz','🧩','Задачи',0)}</div>
      <button class="lby-arena" data-act="m-lib" aria-label="Библиотека"><span class="lby-ring"></span>
        ${t.map((i,k)=>`<span class="lby-pet q${k}"><span class="lby-sh"></span>${petIc(PETS[i],1)}</span>`).join('')}</button>
      <div class="lby-side">${rb('m-quests','📜','Задания',qr)}${rb('m-ach','🏅','Награды',ar)}${rb('m-codex','📖','Кодекс',0)}</div>
    </div>
    ${g?`<button class="lby-goal" data-act="${g.a}"><span class="lby-gi">${g.ic}</span><span>${g.t}</span></button>`:''}
    <div class="lby-play">
      <button class="lby-sb" data-act="m-quick"><span>⚔️</span><b>Быстрый бой</b></button>
      <button class="lby-go" data-act="m-run"><span class="lby-goi">🧭</span><span class="lby-got"><b${R?' class="lby-cont"':''}>${R?'Продолжить':'Забег'}</b><small>${R?`акт ${R.act+1} · ❤ ${R.lives}`:'бои, находки, боссы'}</small></span></button>
      <button class="lby-sb" data-act="m-quick4"><span class="lby-4">4</span><b>Бой четвёрок</b></button>
    </div>
    <div class="lby-nav">
      <button data-act="m-lib"><span class="lby-ni">📚${dot(up)}</span>Стая</button>
      <button class="on" data-act="mm-home"><span class="lby-ni">⚔️</span>Бой</button>
      <button data-act="m-shop"><span class="lby-ni">🛒</span>Лавка</button>
    </div>
  </div>
  ${ui.mm?`<div class="lmenu-over" data-act="mm-x"><div class="lmenu-pop lb-pop"><button class="pill lmi" data-act="fs">⛶<span class="lmi-l">Весь экран</span></button><button class="pill lmi" data-act="lay-open">🎛<span class="lmi-l">Вид экрана боя</span></button><button class="pill lmi" data-act="m-cheat">🛠<span class="lmi-l">Читы</span></button><span class="m lb-pv">v${VER} · сборка ${BUILD}</span></div></div>`:''}
  </div>`)};
if(typeof modeClick==='function'){const mc1=modeClick;modeClick=function(act){
  if(act==='mm-home')return true;
  if(act==='m-shop'){ui.mm=false;CTX=null;G={phase:'lib'};ui.lp=null;ui.shop=true;render();return true}
  return mc1(act)}}
// the lobby owns the whole screen: no page scroll behind it
if(typeof setApp==='function'){const sa1=setApp;setApp=function(h){const r=sa1(h);if(typeof document!=='undefined'&&document.body)document.body.classList.toggle('lby-on',typeof G!=='undefined'&&!!G&&G.phase==='menu');return r}}

if(typeof document!=='undefined'&&document.body){const st=document.createElement('style');st.textContent=`
body.lby-on{overflow:hidden;height:100dvh}
.lby{position:fixed;inset:0;z-index:1;overflow:hidden;color:#fff;touch-action:manipulation;-webkit-user-select:none;user-select:none;--pn:#141b33;--pn2:#1d2647;--bd:#33416e}
.lby-bg{position:absolute;inset:0;background:#0a0b1a ${LBY_BG} center/cover no-repeat}
.lby-in{position:relative;z-index:1;height:100%;box-sizing:border-box;max-width:460px;margin:0 auto;display:flex;flex-direction:column;padding:max(10px,env(safe-area-inset-top)) 12px max(8px,env(safe-area-inset-bottom))}
.lby :where(button){font:inherit;color:inherit;background:none;border:0;padding:0;-webkit-tap-highlight-color:transparent}
/* top bar */
.lby-hud{display:flex;align-items:center;gap:8px}
.lby-me{display:flex;align-items:center;gap:8px;flex:1;min-width:0;text-align:left}
.lby-av{display:flex;align-items:center;justify-content:center;width:44px;height:44px;flex:none;border-radius:50%;font-size:21px;background:var(--pn2);border:2px solid #c79a45}
.lby-mt{display:flex;flex-direction:column;min-width:0}
.lby-mt b{font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lby-mt span{font-size:12px;color:#b9c0dd;white-space:nowrap}
.lby-cur{display:flex;align-items:center;gap:5px;padding:5px 12px 5px 9px;border-radius:999px;background:var(--pn);border:1px solid var(--bd);font-size:14px}.lby-cur b{color:#d6ecff}
.lby-gear{width:42px;height:42px;flex:none;border-radius:12px;font-size:20px;color:#ffe7a3;background:var(--pn);border:1px solid var(--bd)}
/* title on the left, the moon is on the right */
.lby-logo{margin:10px 0 0 2px}
.lby-lt{font-family:var(--display);font-size:clamp(28px,8.6vw,36px);font-weight:700;line-height:1.05;letter-spacing:.02em;color:#ffd66b;text-shadow:0 2px 0 #5a2c08,0 4px 10px #000a}
.lby-ver{font-size:11px;color:#c9c6efbb;margin-top:2px}
/* stage */
.lby-stage{flex:1;min-height:0;display:flex;align-items:stretch;gap:6px;margin-top:2px}
.lby-side{display:flex;flex-direction:column;justify-content:center;gap:10px;width:64px;flex:none}
.lby-rb{display:flex;flex-direction:column;align-items:center;gap:3px}
.lby-rbi{position:relative;display:flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:50%;font-size:25px;background:var(--pn2);border:2px solid #c79a45;box-shadow:0 3px 8px #0008}
.lby-rb:active .lby-rbi{transform:scale(.93)}
.lby-rbt{font-size:12px;font-weight:700;text-shadow:0 1px 2px #000,0 0 4px #000}
.lby-dot{position:absolute;right:-4px;top:-3px;min-width:19px;height:19px;padding:0 5px;box-sizing:border-box;border-radius:10px;background:#e8433f;border:2px solid #0c0f26;color:#fff;font-size:11px;font-weight:800;line-height:15px;text-align:center}
.lby-arena{position:relative;flex:1;min-width:0;display:block;container-type:size}
.lby-ring{position:absolute;left:50%;bottom:0;width:min(104cqw,74cqh);aspect-ratio:1;transform:translateX(-50%) perspective(500px) rotateX(70deg);transform-origin:50% 70%;background:${LBY_RING} center/contain no-repeat;pointer-events:none}
.lby-pet{position:absolute;display:flex;align-items:flex-end;justify-content:center;font-size:48px}
.lby-pet img{position:relative;z-index:1;width:100%;height:100%;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 6px 5px #0009)}
.lby-pet.q0{left:50%;bottom:3cqh;width:min(52cqw,46cqh);height:min(52cqw,46cqh);transform:translateX(-50%);z-index:3}
.lby-pet.q1,.lby-pet.q2{bottom:calc(3cqh + min(52cqw,46cqh)*.8);width:min(36cqw,31cqh);height:min(36cqw,31cqh);z-index:2}
.lby-pet.q1{left:1cqw}.lby-pet.q2{right:1cqw}
.lby-sh{position:absolute;left:18%;right:18%;bottom:-4px;height:12px;border-radius:50%;background:radial-gradient(closest-side,#000b,transparent)}
/* goal */
.lby-goal{display:flex;align-items:center;gap:10px;margin-top:6px;padding:7px 12px 7px 8px;border-radius:12px;text-align:left;color:#e9ecf6;font-size:13px;line-height:1.25;background:var(--pn);border:1px solid var(--bd)}
.lby-gi{display:flex;align-items:center;justify-content:center;width:26px;height:26px;flex:none;border-radius:50%;background:var(--pn2);font-size:15px}
/* play row */
.lby-play{display:flex;align-items:stretch;gap:8px;margin-top:8px}
.lby-sb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:76px;flex:none;padding:7px 3px 8px;border-radius:14px;background:#2b3a7a;border:1px solid #4a5ba8;box-shadow:0 3px 0 #161f4a}
.lby-sb span{font-size:22px;line-height:1}.lby-sb b{font-size:12px;line-height:1.1;text-align:center}
.lby-4{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:7px;background:#ffe7a3;color:#2a1a05;font-family:var(--display);font-weight:700;font-size:17px!important}
.lby-sb:active,.lby-go:active{transform:translateY(2px);box-shadow:none}
.lby-go{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 8px;border-radius:16px;color:#2e1604;background:#f2b63c;border:1px solid #ffd77a;box-shadow:0 4px 0 #94560f}
.lby-goi{font-size:30px;line-height:1}
.lby-got{display:flex;flex-direction:column;align-items:flex-start;min-width:0}
.lby-got b{font-family:var(--display);font-size:clamp(18px,5.4vw,23px);font-weight:700;line-height:1.05}.lby-got b.lby-cont{font-size:clamp(15px,4.4vw,19px)}
.lby-got small{font-size:12px;font-weight:600;white-space:nowrap}
/* bottom bar: flat, the current tab is filled, nothing sticks out of the bar */
.lby-nav{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:9px;padding:5px;border-radius:16px;background:var(--pn);border:1px solid var(--bd)}
.lby-nav button{display:flex;flex-direction:column;align-items:center;gap:1px;padding:5px 2px;border-radius:12px;color:#b9c0dd;font-size:12px;font-weight:700}
.lby-nav button.on{color:#fff;background:#2b3a7a}
.lby-ni{position:relative;font-size:22px;line-height:1.1}.lby-ni .lby-dot{right:-14px;top:-4px}
.lb-pop .lb-pv{font-size:10px;text-align:center;padding:4px 0 0}
@media (max-height:700px){.lby-logo{margin-top:6px}.lby-rbi{width:48px;height:48px;font-size:22px}.lby-side{gap:6px}.lby-goal{padding:5px 10px 5px 6px}.lby-play{margin-top:6px}.lby-nav{margin-top:6px}}
@media (max-width:370px){.lby-side{width:58px}.lby-sb{width:70px}.lby-go{gap:5px;padding:9px 6px}.lby-goi{font-size:26px}.lby-got small{font-size:11px}}
`;document.body.appendChild(st)}
// the first screen is drawn before this file loads: draw the lobby right away
try{const tp=document.createElement('template');if(tp.content&&typeof tp.content.querySelector==='function'&&typeof G!=='undefined'&&G&&G.phase==='menu'&&typeof app!=='undefined'&&app&&typeof render==='function')render()}catch(e){}
