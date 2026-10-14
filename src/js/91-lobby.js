/* ---------- 0.39.1 Anton: the main screen is a game lobby, drawn in code (SVG + CSS):
   a living night scene (stars, moon, clouds, castle with lit windows, graveyard, fog, fireflies),
   the player's pack standing on a glowing rune circle, round buttons for modes on both sides,
   a big «Забег» button with quick fights beside it, and a bottom bar (Стая · Бой · Лавка).
   Only the look changes: every button runs the same action as before. ---------- */

const LBY_SCENE=(()=>{
  let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
  const stars=[0,1,2].map(g=>{let s='';for(let i=0;i<16;i++){const x=(rnd()*400).toFixed(1),y=(rnd()*330).toFixed(1),r=(rnd()*1.1+.4).toFixed(2);s+=`<circle cx="${x}" cy="${y}" r="${r}"/>`}return`<g class="ls-st s${g}" fill="#fff">${s}</g>`}).join('');
  const tomb=(x,y,s,k)=>k?`<path d="M${x-1.2*s} ${y}v${-9*s}h${-3*s}v${-2.4*s}h${3*s}v${-3*s}h${2.4*s}v${3*s}h${3*s}v${2.4*s}h${-3*s}v${9*s}z"/>`:`<path d="M${x-4*s} ${y}v${-8*s}a${4*s} ${4*s} 0 0 1 ${8*s} 0v${8*s}z"/>`;
  const tree=(x,y,s,f)=>`<path transform="translate(${x} ${y}) scale(${f?-s:s} ${s})" d="M-3 0 L-2 -40 L-14 -62 L-12 -64 L-1 -48 L0 -78 L3 -78 L3 -52 L16 -70 L18 -68 L5 -44 L4 -24 L14 -32 L15 -30 L4 -16 L3 0Z"/>`;
  const wins=[[254,384],[263,384],[289,364],[300,352],[300,366],[333,380],[342,380],[318,328]].map(([x,y],i)=>`<rect class="ls-w w${i%3}" x="${x}" y="${y}" width="4" height="7" rx="2"/>`).join('');
  return`<svg class="ls-svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="lsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b24"/><stop offset=".35" stop-color="#161a4a"/><stop offset=".55" stop-color="#2e2766"/><stop offset=".66" stop-color="#4a3270"/><stop offset=".8" stop-color="#1a1636"/><stop offset="1" stop-color="#0a0b1a"/></linearGradient>
    <radialGradient id="lsMoonG"><stop offset="0" stop-color="#fff4cf" stop-opacity=".55"/><stop offset=".35" stop-color="#f7d98e" stop-opacity=".18"/><stop offset="1" stop-color="#f7d98e" stop-opacity="0"/></radialGradient>
    <radialGradient id="lsMoon" cx=".4" cy=".38"><stop offset="0" stop-color="#fffbe8"/><stop offset=".7" stop-color="#f6e2a6"/><stop offset="1" stop-color="#e2bf6e"/></radialGradient>
    <linearGradient id="lsM1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3a7a"/><stop offset="1" stop-color="#231f4c"/></linearGradient>
    <linearGradient id="lsM2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f1d48"/><stop offset="1" stop-color="#141333"/></linearGradient>
    <linearGradient id="lsGr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121633"/><stop offset="1" stop-color="#05060f"/></linearGradient>
    <radialGradient id="lsHz" cx=".5" cy="0"><stop offset="0" stop-color="#8a5cff" stop-opacity=".35"/><stop offset="1" stop-color="#8a5cff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="400" height="800" fill="url(#lsSky)"/>
  ${stars}
  <circle class="ls-mg" cx="306" cy="150" r="120" fill="url(#lsMoonG)"/>
  <circle cx="306" cy="150" r="40" fill="url(#lsMoon)"/>
  <g fill="#d9b86a" opacity=".35"><circle cx="292" cy="140" r="7"/><circle cx="318" cy="166" r="5"/><circle cx="320" cy="136" r="3.5"/><circle cx="298" cy="168" r="3"/></g>
  <g class="ls-cl c1" fill="#8f86d6" opacity=".16"><ellipse cx="90" cy="190" rx="90" ry="14"/><ellipse cx="140" cy="180" rx="60" ry="12"/></g>
  <g class="ls-cl c2" fill="#b0a6ff" opacity=".12"><ellipse cx="300" cy="235" rx="110" ry="12"/><ellipse cx="250" cy="226" rx="50" ry="9"/></g>
  <ellipse cx="200" cy="470" rx="300" ry="90" fill="url(#lsHz)"/>
  <path d="M0 430 L30 400 L60 415 L95 370 L130 405 L160 385 L190 410 L230 360 L265 395 L300 375 L340 400 L370 380 L400 395 V520 H0Z" fill="url(#lsM1)"/>
  <g fill="#120f2e">
    <path d="M232 470 V372 L240 352 L248 372 V392 H262 V376 L270 360 L278 376 V392 H282 V350 L291 318 L300 300 L309 318 L318 350 V392 H326 V372 L334 356 L342 372 V470Z"/>
    <path d="M296 300 L300 284 L304 300Z"/><rect x="299" y="276" width="1.6" height="10"/><path d="M300.8 276 L310 279 L300.8 282Z" fill="#c94a4a"/>
  </g>
  <g fill="#ffcf6a">${wins}</g>
  <path d="M0 470 Q60 440 120 462 T240 458 T400 450 V560 H0Z" fill="url(#lsM2)"/>
  <g fill="#0c0b22">${tree(40,470,1.05)}${tree(372,466,.9,1)}${tree(120,468,.6)}</g>
  <path d="M0 520 Q100 496 200 510 T400 505 V800 H0Z" fill="url(#lsGr)"/>
  <g fill="#0a0a1c">${tomb(30,528,1.4,0)}${tomb(58,532,1.1,1)}${tomb(84,526,.9,0)}${tomb(330,526,1.2,1)}${tomb(356,530,1.5,0)}${tomb(382,524,1,0)}${tomb(305,530,.8,0)}</g>
  <path d="M0 560 Q200 540 400 560" stroke="#6f5bd6" stroke-opacity=".12" stroke-width="10" fill="none"/>
  </svg>`})();

const LBY_RUNES=`<svg viewBox="-100 -100 200 200" aria-hidden="true"><defs><radialGradient id="lsRg"><stop offset="0" stop-color="#9fd0ff" stop-opacity=".55"/><stop offset=".6" stop-color="#5a6cff" stop-opacity=".18"/><stop offset="1" stop-color="#5a6cff" stop-opacity="0"/></radialGradient></defs>
  <circle r="98" fill="url(#lsRg)"/><circle r="86" fill="none" stroke="#bfe1ff" stroke-opacity=".7" stroke-width="2"/><circle r="78" fill="none" stroke="#bfe1ff" stroke-opacity=".45" stroke-width="1" stroke-dasharray="6 5"/>
  <g class="ls-rr">${[...Array(12).keys()].map(i=>`<g transform="rotate(${i*30})"><path d="M0 -82 l3 6 l-3 6 l-3 -6z" fill="#e6f3ff" fill-opacity=".85"/></g>`).join('')}</g>
  <circle r="58" fill="none" stroke="#ffe7a3" stroke-opacity=".55" stroke-width="1.5"/><path d="M0 -58 L50 29 L-50 29Z M0 58 L-50 -29 L50 -29Z" fill="none" stroke="#ffe7a3" stroke-opacity=".35" stroke-width="1.2"/></svg>`;

function lbyTeam(){const own=i=>PETS[i]&&mp(PETS[i].n).un;let l=(META.lastQ||[]).filter(own);
  if(l.length<3)l=l.concat(PETS.map((p,i)=>i).filter(i=>own(i)&&!l.includes(i)));return l.slice(0,3)}
const lbyFF=[...Array(14).keys()].map(i=>`<i style="left:${(i*37+11)%100}%;top:${48+(i*23)%40}%;animation-delay:${-(i*1.7)%9}s;animation-duration:${7+i%5}s"></i>`).join('');

renderMenu=function(){
  const lg=LEAGUES[lgOf(rk().pts)],up=PETS.filter(p=>canQUp(p.n)).length,qr=questReady(),ar=achReady();
  const dot=n=>n?`<span class="lby-dot">${n}</span>`:'';
  const rb=(act,ic,t,n)=>`<button class="lby-rb" data-act="${act}"><span class="lby-rbi">${ic}${dot(n)}</span><span class="lby-rbt">${t}</span></button>`;
  const t=lbyTeam(),g=typeof goalNext==='function'?goalNext():null,R=META.run;
  setApp(`<div class="lby">
  <div class="lby-bg">${LBY_SCENE}<div class="lby-fog f1"></div><div class="lby-fog f2"></div><div class="lby-ff">${lbyFF}</div></div>
  <div class="lby-in">
    <div class="lby-hud">
      <button class="lby-me" data-act="m-rank"><span class="lby-av"><span>🐾</span></span><span class="lby-mt"><b>Стая</b><span>${lg.ic} ${lg.n} · ${plN(rk().pts,'очко','очка','очков',1)}</span></span></button>
      <span class="lby-cur"><span class="lby-gem">💎</span><b>${META.stones}</b></span>
      <button class="lby-gear${ui.mm?' on':''}" data-act="mm-menu" aria-label="Меню">☰</button>
    </div>
    <div class="lby-logo"><div class="lby-lt">Бой стаи</div><div class="lby-ver">v${VER} · сборка ${BUILD}</div></div>
    <div class="lby-stage">
      <div class="lby-side">${rb('m-rank','🏆','Лига',0)}${rb('m-lair','👑','Логова',0)}${rb('m-puz','🧩','Задачи',0)}</div>
      <button class="lby-arena" data-act="m-lib" aria-label="Библиотека"><span class="lby-beam"></span><span class="lby-ring">${LBY_RUNES}</span>
        ${t.map((i,k)=>`<span class="lby-pet q${k}"><span class="lby-sh"></span>${petIc(PETS[i],1)}</span>`).join('')}</button>
      <div class="lby-side">${rb('m-quests','📜','Задания',qr)}${rb('m-ach','🏅','Награды',ar)}${rb('m-codex','📖','Кодекс',0)}</div>
    </div>
    ${g?`<button class="lby-goal" data-act="${g.a}"><span class="lby-gi">${g.ic}</span><span>${g.t}</span></button>`:''}
    <div class="lby-play">
      <button class="lby-sb" data-act="m-quick"><span>⚔️</span><b>Быстрый<br>бой</b></button>
      <button class="lby-go" data-act="m-run"><span class="lby-shine"></span><span class="lby-goi">🧭</span><span class="lby-got"><b>${R?'Продолжить':'Забег'}</b><small>${R?`акт ${R.act+1} · ❤ ${R.lives}`:'бои, находки, боссы'}</small></span></button>
      <button class="lby-sb" data-act="m-quick4"><span class="lby-4">4</span><b>Бой<br>четвёрок</b></button>
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
.lby{position:fixed;inset:0;z-index:1;overflow:hidden;color:#fff}
.lby-bg{position:absolute;inset:0;background:#0a0b1a}
.ls-svg{position:absolute;inset:0;width:100%;height:100%}
.ls-st{animation:lsTw 4s ease-in-out infinite}.ls-st.s1{animation-delay:-1.3s;animation-duration:5s}.ls-st.s2{animation-delay:-2.6s;animation-duration:3.4s}
@keyframes lsTw{0%,100%{opacity:.9}50%{opacity:.25}}
.ls-mg{animation:lsMg 6s ease-in-out infinite;transform-origin:306px 150px}@keyframes lsMg{50%{opacity:.7;transform:scale(1.06)}}
.ls-cl{animation:lsCl 60s linear infinite}.ls-cl.c2{animation-duration:85s;animation-direction:reverse}@keyframes lsCl{0%{transform:translateX(-60px)}50%{transform:translateX(60px)}100%{transform:translateX(-60px)}}
.ls-w{animation:lsW 3s steps(1) infinite}.ls-w.w1{animation-delay:-1s;animation-duration:4.4s}.ls-w.w2{animation-delay:-2.2s;animation-duration:2.6s}@keyframes lsW{0%,100%{opacity:1}47%{opacity:.55}50%{opacity:1}83%{opacity:.75}}
.lby-fog{position:absolute;left:-50%;width:200%;height:26%;pointer-events:none;background:radial-gradient(40% 50% at 25% 50%,#a99cff22,transparent 70%),radial-gradient(35% 45% at 70% 55%,#a99cff1c,transparent 70%);animation:lsFog 40s linear infinite}
.lby-fog.f1{top:52%}.lby-fog.f2{top:70%;animation-duration:55s;animation-direction:reverse;opacity:.8}
@keyframes lsFog{0%{transform:translateX(0)}50%{transform:translateX(18%)}100%{transform:translateX(0)}}
.lby-ff i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff3a0;box-shadow:0 0 6px 2px #ffe06a99;animation:lsFF 8s ease-in-out infinite;opacity:0}
@keyframes lsFF{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}50%{transform:translate(18px,-26px)}80%{opacity:.8}100%{opacity:0;transform:translate(-10px,-48px)}}
.lby-in{position:relative;z-index:1;height:100%;box-sizing:border-box;max-width:460px;margin:0 auto;display:flex;flex-direction:column;padding:max(10px,env(safe-area-inset-top)) 12px max(8px,env(safe-area-inset-bottom))}
/* top bar */
.lby-hud{display:flex;align-items:center;gap:8px}
.lby-me{display:flex;align-items:center;gap:8px;flex:1;min-width:0;text-align:left;color:#fff}
.lby-av{width:46px;height:46px;flex:none;border-radius:50%;padding:3px;background:conic-gradient(from 200deg,#ffe7a3,#b4661c,#ffe7a3,#8a4a12,#ffe7a3);box-shadow:0 3px 8px #0009}
.lby-av>span{display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:50%;font-size:22px;background:radial-gradient(circle at 35% 30%,#4a5fa0,#151b3c)}
.lby-mt{display:flex;flex-direction:column;min-width:0;padding:3px 12px 3px 10px;margin-left:-14px;border-radius:0 12px 12px 0;background:linear-gradient(90deg,#0b0f24cc,#0b0f2499);border:1px solid #ffffff1a;border-left:0}
.lby-mt b{font-family:var(--display);font-size:13px;letter-spacing:.02em;padding-left:6px}.lby-mt span{font-size:10.5px;color:#c9c6ef;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:6px}
.lby-cur{display:flex;align-items:center;gap:5px;padding:4px 12px 4px 4px;border-radius:999px;background:linear-gradient(#0b0f24e6,#141a3ae6);border:1.5px solid #6fb2ff66;box-shadow:inset 0 1px 0 #ffffff1a}
.lby-gem{display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle,#2a5aa8,#0f2148);font-size:13px}.lby-cur b{font-size:14px;color:#d6ecff}
.lby-gear{width:40px;height:40px;border-radius:12px;font-size:19px;color:#ffe7a3;background:linear-gradient(#3a3474,#1c1940);border:1.5px solid #ffe7a355;box-shadow:0 3px 0 #0b0920}
/* logo */
.lby-logo{text-align:center;margin-top:10px}
.lby-lt{display:inline-block;font-family:var(--display);font-size:clamp(34px,11vw,46px);font-weight:900;line-height:1.05;letter-spacing:.02em;text-transform:uppercase;
  background:linear-gradient(#fffbe6 10%,#ffd66b 45%,#e08a23 70%,#ffcf5a 90%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(1px 0 0 #3a1a05) drop-shadow(-1px 0 0 #3a1a05) drop-shadow(0 1px 0 #3a1a05) drop-shadow(0 -1px 0 #3a1a05) drop-shadow(0 4px 0 #5a2c08) drop-shadow(0 0 14px #ffb84a66)}
.lby-ver{font-size:9.5px;color:#c9c6efaa;margin-top:2px}
/* stage */
.lby-stage{flex:1;min-height:0;display:flex;align-items:stretch;gap:4px;margin-top:4px}
.lby-side{display:flex;flex-direction:column;justify-content:center;gap:12px;width:64px;flex:none}
.lby-rb{display:flex;flex-direction:column;align-items:center;gap:3px;color:#fff}
.lby-rbi{position:relative;display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;font-size:26px;
  background:radial-gradient(circle at 35% 28%,#5866b8,#232a63 60%,#141838);box-shadow:0 0 0 3px #0c0f26,0 0 0 5px #c79a45,0 5px 10px #000a,inset 0 2px 0 #ffffff33}
.lby-rb:active .lby-rbi{transform:scale(.93)}
.lby-rbt{font-size:11px;font-weight:700;text-shadow:0 1px 2px #000,0 0 6px #000;margin-top:3px}
.lby-dot{position:absolute;right:-4px;top:-4px;min-width:19px;height:19px;padding:0 5px;border-radius:10px;background:#ff4d5e;border:2px solid #0c0f26;color:#fff;font-size:11px;font-weight:800;line-height:15px;text-align:center;animation:lsDot 1.6s ease-in-out infinite}
@keyframes lsDot{50%{transform:scale(1.15)}}
.lby-arena{position:relative;flex:1;min-width:0;display:block}
.lby-ring{position:absolute;left:50%;bottom:2%;width:min(108%,290px);aspect-ratio:1;transform:translateX(-50%) perspective(500px) rotateX(70deg);transform-origin:50% 60%}
.lby-ring svg{width:100%;height:100%;animation:lsRot 30s linear infinite}
@keyframes lsRot{to{transform:rotate(360deg)}}
.lby-beam{position:absolute;left:50%;bottom:16%;width:70%;height:70%;transform:translateX(-50%);background:radial-gradient(50% 60% at 50% 100%,#8fb8ff40,transparent 70%);animation:lsMg 5s ease-in-out infinite}
.lby-pet{position:absolute;bottom:14%;display:flex;align-items:flex-end;justify-content:center;font-size:56px;animation:lsBob 3.4s ease-in-out infinite}
.lby-pet img{width:100%;height:100%;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 0 1px #000) drop-shadow(0 8px 6px #0009)}
.lby-pet.q0{left:50%;width:min(64%,210px);height:min(62%,220px);margin-left:calc(min(64%,210px)/-2);bottom:8%;z-index:2}
.lby-pet.q1{left:2%;width:min(46%,150px);height:min(46%,160px);bottom:24%;animation-delay:-1.2s;z-index:1}
.lby-pet.q2{right:2%;width:min(46%,150px);height:min(46%,160px);bottom:24%;animation-delay:-2.3s;z-index:1}
.lby-sh{position:absolute;left:15%;right:15%;bottom:-4px;height:12px;border-radius:50%;background:radial-gradient(closest-side,#000a,transparent)}
@keyframes lsBob{50%{transform:translateY(-6px)}}
/* goal + play */
.lby-goal{display:flex;align-items:center;gap:8px;margin:6px auto 0;max-width:100%;padding:6px 12px 6px 6px;border-radius:999px;text-align:left;color:#f4ecd2;font-size:11.5px;line-height:1.2;
  background:linear-gradient(90deg,#2a1f12ee,#3a2a16ee);border:1px solid #c79a4588;box-shadow:0 3px 8px #0008}
.lby-gi{display:flex;align-items:center;justify-content:center;width:26px;height:26px;flex:none;border-radius:50%;background:#c79a45;font-size:15px}
.lby-play{display:flex;align-items:stretch;gap:8px;margin-top:8px}
.lby-sb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:78px;flex:none;padding:6px 2px;border-radius:16px;color:#fff;
  background:linear-gradient(#4b5bc4,#2b3484 60%,#20286a);border:2px solid #9fb0ff88;box-shadow:0 4px 0 #141a48,0 6px 12px #0009,inset 0 2px 0 #ffffff33}
.lby-sb span{font-size:22px;line-height:1}.lby-sb b{font-size:10.5px;line-height:1.1;text-align:center}
.lby-4{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:7px;background:#ffe7a3;color:#2a1a05;font-family:var(--display);font-weight:900;font-size:17px!important}
.lby-sb:active,.lby-go:active{transform:translateY(3px);box-shadow:0 1px 0 #141a48,0 3px 6px #0009}
.lby-go{position:relative;flex:1;min-width:0;display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 10px;border-radius:18px;overflow:hidden;color:#3a1a05;
  background:linear-gradient(#fff1b0,#ffcf4a 40%,#e9971f 75%,#c96d14);border:2.5px solid #fff6cf;box-shadow:0 5px 0 #7a3c08,0 8px 18px #000a,0 0 24px #ffb84a55,inset 0 -3px 0 #a8550e55}
.lby-goi{font-size:32px;filter:drop-shadow(0 2px 0 #fff8)}
.lby-got{display:flex;flex-direction:column;align-items:flex-start;min-width:0}.lby-got b{font-family:var(--display);font-size:clamp(19px,5.6vw,24px);font-weight:900;text-transform:uppercase;line-height:1;text-shadow:0 1px 0 #fff8}
.lby-got small{font-size:11px;font-weight:600;opacity:.8;white-space:nowrap}
.lby-shine{position:absolute;top:0;bottom:0;left:-40%;width:30%;background:linear-gradient(100deg,transparent,#ffffffa0,transparent);transform:skewX(-20deg);animation:lsSh 3.2s ease-in-out infinite}
@keyframes lsSh{0%,60%{left:-40%}100%{left:130%}}
/* bottom bar */
.lby-nav{display:grid;grid-template-columns:1fr 1.2fr 1fr;align-items:end;gap:6px;margin-top:10px;padding:6px 8px;border-radius:20px;background:linear-gradient(#1b1f44f2,#0c0f26f2);border:1.5px solid #c79a4566;box-shadow:0 -2px 14px #0009,inset 0 1px 0 #ffffff14}
.lby-nav button{display:flex;flex-direction:column;align-items:center;gap:1px;padding:4px 2px;border-radius:14px;color:#c9c6ef;font-size:11.5px;font-weight:700}
.lby-nav button.on{color:#fff;margin-top:-20px;padding:8px 2px 5px;background:linear-gradient(#6a5cff,#3a2fa8);border:2px solid #c7bfff;box-shadow:0 4px 0 #1c1660,0 0 16px #6a5cff88}
.lby-ni{position:relative;font-size:24px;line-height:1.1}.lby-nav .on .lby-ni{font-size:28px}.lby-ni .lby-dot{right:-12px;top:-4px}
.lb-pop .lb-pv{font-size:10px;text-align:center;padding:4px 0 0}
@media (max-height:640px){.lby-logo{margin-top:4px}.lby-lt{font-size:30px}.lby-rbi{width:48px;height:48px;font-size:22px}.lby-side{gap:8px}.lby-goal{display:none}}
@media (prefers-reduced-motion:reduce){.lby *,.lby{animation:none!important}}
`;document.body.appendChild(st)}
// the first screen is drawn before this file loads: draw the lobby right away
try{const tp=document.createElement('template');if(tp.content&&typeof tp.content.querySelector==='function'&&typeof G!=='undefined'&&G&&G.phase==='menu'&&typeof app!=='undefined'&&app&&typeof render==='function')render()}catch(e){}
