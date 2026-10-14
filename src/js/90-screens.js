/* ---------- 0.38.8 Anton: screens outside the battle.
   1) placement is done right on the creature pick screen (no separate «Расстановка» step before a battle);
   2) library creature cards are drawn as game cards (frame by quality, scene behind the art, level, family, elements, fragments);
   3) the main screen looks like a game lobby; daily and weekly quests move to their own page («Задания»), achievements already have one.
   Only screens change here, no rules. ---------- */

/* ----- 1) placement on the pick screen. PLACE[k] is the cell of TEAM[k]; PLACE._t remembers which team it was laid out for,
   so adding or removing a creature keeps everyone else where they stood ----- */
function pkSync(){
  if(!Array.isArray(PLACE))PLACE=START.slice(0,TN).map(x=>[...x]);
  const t=Array.isArray(PLACE._t)?PLACE._t:TEAM.slice(),pos=new Map(),key=c=>c[0]+','+c[1],used=new Set(),out=[];
  t.forEach((pi,k)=>{if(PLACE[k])pos.set(pi,PLACE[k])});
  TEAM.forEach((pi,k)=>{const c=pos.get(pi);if(c&&c[0]<ROWS&&c[1]<COLS&&!used.has(key(c))){out[k]=[c[0],c[1]];used.add(key(c))}});
  const all=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)all.push([r,c]);
  const free=START.filter(c=>c[1]<COLS).concat(all).filter(c=>!used.has(key(c)));
  TEAM.forEach((pi,k)=>{if(!out[k]){const c=free.find(x=>!used.has(key(x)));out[k]=[c[0],c[1]];used.add(key(c))}});
  out._t=TEAM.slice();PLACE=out;if(ui.ps!=null&&ui.ps>=TEAM.length)ui.ps=null}
function pkGridHtml(){
  let g=`<div class="pkg" style="grid-template-columns:repeat(${COLS},1fr)">`;
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const i=PLACE.findIndex(x=>x[0]===r&&x[1]===c),p=i>=0&&i<TEAM.length?PETS[TEAM[i]]:null;
    g+=`<button class="pkc ${ui.ps===i&&p?'sel':''} ${ui.ps!=null&&i!==ui.ps?'dest':''}" data-pcell="${r},${c}">${p?`<span class="pkp">${petIc(p,1)}</span>`:''}</button>`}
  return`<div class="pkw"><div class="pkhd"><span class="pkf">▲ фронт</span><span class="m">${TEAM.length?(ui.ps!=null?'Теперь тапни клетку.':'Тапни существо, потом клетку. Соседи по сторонам усиливают друг друга.'):'Добавь существ «+», они встанут сюда.'}</span></div>${g}</div>
  ${TEAM.length?`<div class="pkb"><button class="pill sm" data-act="place-smart">Умно</button><button class="pill sm" data-act="place-rand">Случайно</button></div>`:''}</div>`}
if(typeof renderPick==='function'){const rp0=renderPick;renderPick=function(){pkSync();return rp0()}}

/* ----- 2) library cards ----- */
const SCN=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40' preserveAspectRatio='none'%3E%3Cpath d='M0 26 L10 20 L18 24 L28 14 L36 21 L46 17 L56 23 L66 12 L74 19 L84 15 L94 22 L104 16 L112 21 L120 18 V40 H0Z' fill='%23ffffff' fill-opacity='.07'/%3E%3Cpath d='M0 32 Q15 25 30 30 T60 29 T90 31 T120 28 V40 H0Z' fill='%23060b14' fill-opacity='.85'/%3E%3Cpath d='M14 31 v-5 a3 3 0 0 1 6 0 v5Z M98 30 v-6 a3.5 3.5 0 0 1 7 0 v6Z M52 30 h1.6 v-4 h1.8 v-1.6 h-1.8 v-2 h-1.6 v2 h-1.8 v1.6 h1.8Z' fill='%23060b14'/%3E%3C/svg%3E")`;
libTile=function(i){const p=PETS[i],m=mp(p.n),need=m.un?QUP[m.q]:{fr:UNLOCK_FR},fp=need?Math.min(1,m.fr/need.fr):1,ready=m.un?canQUp(p.n):false;
  const els=petEls(p),ec=ELC[els[0]]||'#5AA9F0',qc=m.un?qC(m.q):'#46526A',f=FAM[p.fam]||{ic:'',n:''};
  const nmS=p.n.length>11?'font-size:11px':p.n.length>8?'font-size:12px':'';
  return`<button class="lcd ${m.un?'':'lock'} ${ready?'rdy':''}" data-act="lib-${i}" style="--qc:${qc};--ec:${ec}">
  <span class="lcd-sc"></span>
  <span class="lcd-q" title="${m.un?QN[m.q]:''}"></span>${m.un?`<span class="lcd-lv">Ур. ${m.lv}</span>`:'<span class="lcd-lk">🔒</span>'}
  <span class="lcd-art">${m.un?qArt(p,m.q,1):`<span class="sil0">${petIc(p,1)}</span>`}</span>
  <span class="lcd-ft"><span class="lcd-nm" style="${nmS}">${m.un?p.n:'???'}</span>
  <span class="lcd-row"><span class="lcd-fm" title="${f.n}">${f.ic}${m.un?'':' '+f.n}</span>${m.un?`<span class="lcd-el">${els.map(e=>`<span class="lcd-e">${EI(e,1)}</span>`).join('')}</span>`:''}</span>
  <span class="lcd-bar"><span class="lcd-bi">🧩</span><span class="lcd-tr"><i style="width:${fp*100}%"></i></span><b>${m.fr}${need?'/'+need.fr:''}</b></span></span>
  ${ready?'<span class="lcd-up">▲</span>':''}</button>`};

/* ----- 3) main screen + quests page ----- */
function heroTeam(){const own=i=>PETS[i]&&mp(PETS[i].n).un;let l=(META.lastQ||[]).filter(own);
  if(l.length<3)l=l.concat(PETS.map((p,i)=>i).filter(i=>own(i)&&!l.includes(i)));return l.slice(0,3)}
function questReady(){return questsToday().filter(q=>q.p>=QDEF[q.k].g&&!q.cl).length+questsWeek().filter(q=>!q.cl&&q.p>=WDEF[q.k].g).length}
renderMenu=function(){
  const lg=LEAGUES[lgOf(rk().pts)],up=PETS.filter(p=>canQUp(p.n)).length,qr=questReady(),ar=achReady(),own=PETS.filter(p=>mp(p.n).un).length;
  const dot=n=>n?`<span class="qdot">${n}</span>`:'';
  const tile=(act,ic,t,s)=>`<button class="mt" data-act="${act}"><span class="mt-ic">${ic}</span><b>${t}</b><span class="mt-s">${s}</span></button>`;
  const ht=heroTeam();
  setApp(`<div class="lb-top"><span class="lb-me"><span class="lb-av">🐾</span><span><b>Стая</b><span class="lb-lg">${lg.ic} ${lg.n}</span></span></span>
  <span class="lb-r"><span class="lb-cur">💎 <b>${META.stones}</b></span><button class="pill lb-mb${ui.mm?' on':''}" data-act="mm-menu">☰</button></span></div>
  <div class="lb-hero"><div class="lb-logo">Бой стаи</div>
  <div class="lb-team">${ht.map((i,k)=>`<span class="lb-pet p${k}">${petIc(PETS[i],1)}</span>`).join('')}</div><div class="lb-plat"></div></div>
  ${typeof renderRun==='function'?`<button class="lb-go" data-act="m-run"><span class="lb-goi">🧭</span><span><b>${META.run?'Продолжить забег':'Забег'}</b><span>${META.run?`Акт ${META.run.act+1}, ❤ ${META.run.lives}`:'Путь через три земли: бои, находки, боссы'}</span></span></button>`:''}
  ${typeof goalHtml==='function'?goalHtml():''}
  <div class="mtg">
  ${tile('m-quick','⚔️','Быстрый бой','против бота')}
  ${tile('m-quick4','4️⃣','Бой четвёрок','4 на 4, поле 3×4')}
  ${tile('m-rank','🏆','Лига',`${plN(rk().pts,'очко','очка','очков',1)}`)}
  ${tile('m-lair','👑','Логова',`⭐ ${Object.keys(BOSSES).reduce((a,k)=>a+lairOf(k).t,0)} из ${Object.keys(BOSSES).length*3}`)}
  ${tile('m-puz','🧩','Задачи',`${Object.keys(pzs().done).length} из ${PUZ.length}`)}
  ${tile('m-codex','📖','Кодекс',`${cdxCount()} из ${cdxTotal()}`)}
  </div>
  <div class="lb-ver">v${VER} · сборка ${BUILD}</div>
  <div class="lb-nav"><button data-act="m-lib"><span class="lb-ni">📚${dot(up)}</span>Библиотека<small>${own} из ${PETS.length}</small></button><button data-act="m-quests"><span class="lb-ni">📋${dot(qr)}</span>Задания<small>день и неделя</small></button><button data-act="m-ach"><span class="lb-ni">🏅${dot(ar)}</span>Достижения<small>${ACH.filter(a=>META.ach&&META.ach[a.k]).length} из ${ACH.length}</small></button></div>
  ${ui.mm?`<div class="lmenu-over" data-act="mm-x"><div class="lmenu-pop lb-pop"><button class="pill lmi" data-act="fs">⛶<span class="lmi-l">Весь экран</span></button><button class="pill lmi" data-act="lay-open">🎛<span class="lmi-l">Вид экрана боя</span></button><button class="pill lmi" data-act="m-cheat">🛠<span class="lmi-l">Читы</span></button><span class="m lb-pv">v${VER} · сборка ${BUILD}</span></div></div>`:''}`)};
function renderQuests(){const qd=questsToday().filter(q=>q.p>=QDEF[q.k].g&&!q.cl).length,wd=questsWeek().filter(q=>!q.cl&&q.p>=WDEF[q.k].g).length;
  setApp(`<div class="top"><button class="pill sm" data-act="m-menu">‹ Меню</button><div class="title">Задания</div><span class="m">💎 ${META.stones}</span></div>
  <div class="msec" style="margin-top:2px">Задания дня${qd?` <span class="qdot">${qd}</span>`:''}</div><div class="qlist">${questsHtml()}</div>
  <div class="msec">Задания недели${wd?` <span class="qdot">${wd}</span>`:''} <span class="m" style="font-size:11px;font-weight:400;text-transform:none;letter-spacing:0">ещё ${weekLeft()}</span></div><div class="qlist">${weekHtml()}</div>`)}
if(typeof renderScreen==='function'){const rs0=renderScreen;renderScreen=function(){if(G&&G.phase==='quests'){syncRar();return renderQuests()}return rs0()}}
if(typeof modeClick==='function'){const mc0=modeClick;modeClick=function(act){
  if(act==='m-quests'){ui.mm=false;CTX=null;G={phase:'quests'};render();return true}
  if(act==='mm-menu'){ui.mm=!ui.mm;render();return true}
  if(act==='mm-x'){if(bgHit(act)){ui.mm=false;render()}return true}
  return mc0(act)}}

/* a pick in the main-screen list closes the list, then the action runs */
if(typeof document!=='undefined')document.addEventListener('click',e=>{if(ui.mm&&e.target.closest&&e.target.closest('.lb-pop [data-act]'))ui.mm=false},true);

/* the pick screen: placement grid under the team bar, and the main button starts the battle */
if(typeof setApp==='function'){const sa0=setApp;setApp=function(h){
  const ph=typeof G!=='undefined'&&G?G.phase:null;
  if(ph==='pick'&&Array.isArray(PLACE)){const t=document.createElement('template');t.innerHTML=h;const f=t.content;
    const tb=f.querySelector('.tbar');if(tb)tb.insertAdjacentHTML('afterend',pkGridHtml());
    const b=f.querySelector('[data-act="to-place"]');if(b){b.dataset.act='start';if(TEAM.length>=TN)b.textContent='В бой'}
    const hint=[...f.querySelectorAll('.m')].find(x=>/«\+»: сразу в стаю/.test(x.textContent));if(hint)hint.remove();
    h=t.innerHTML}
  return sa0(h)}}

if(typeof document!=='undefined'&&document.body){const st=document.createElement('style');st.textContent=`
/* placement on the pick screen */
.pkw{margin-top:6px;padding:6px 6px 7px;border-radius:14px;background:linear-gradient(#18243a,#111a29);border:1px solid #2F3F58}
.pkhd{display:flex;gap:8px;align-items:baseline;margin:0 2px 5px}.pkhd .m{font-size:11px;line-height:1.2}
.pkf{font-size:10px;font-weight:700;color:#FFB0A6;white-space:nowrap;letter-spacing:.04em}
.pkg{display:grid;gap:4px}
.pkc{position:relative;aspect-ratio:1/.78;border-radius:8px;background:#223047;border:1px solid #2F3F58;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:0}
.pkc.sel{border-color:var(--gold);box-shadow:0 0 0 2px color-mix(in srgb,var(--gold) 45%,transparent) inset}
.pkc.dest{background:color-mix(in srgb,var(--ally) 22%,#223047);border-color:color-mix(in srgb,var(--ally) 60%,transparent)}
.pkp{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:26px}.pkp img{width:94%;height:94%;object-fit:contain}
.pkb{display:flex;gap:6px;justify-content:flex-end;margin-top:6px}
/* library cards */
.lib .lcd{position:relative;display:flex;flex-direction:column;aspect-ratio:3/4.1;min-width:0;padding:0;border-radius:13px;overflow:hidden;text-align:left;color:var(--fg);
  border:2px solid var(--qc);background:linear-gradient(#1d2c47,#0d1522);box-shadow:0 3px 10px #0008,inset 0 0 0 1px #ffffff10,inset 0 0 18px color-mix(in srgb,var(--qc) 25%,transparent)}
.lcd-sc{position:absolute;inset:0;background:${SCN} bottom/100% 46% no-repeat,radial-gradient(70% 45% at 50% 40%,color-mix(in srgb,var(--ec) 42%,transparent),transparent 72%),radial-gradient(12px 12px at 78% 16%,#fff3c8aa,transparent 70%),linear-gradient(#22345a,#121c30 70%)}
.lcd-q{position:absolute;left:6px;top:6px;width:13px;height:13px;transform:rotate(45deg);border-radius:3px;background:var(--qc);box-shadow:0 0 8px var(--qc),inset 0 0 0 2px #0006;z-index:2}
.lcd-lv{position:absolute;right:5px;top:5px;z-index:2;font-size:11px;font-weight:800;padding:2px 6px;border-radius:7px;background:#0b111bcc;border:1px solid #ffffff22}
.lcd-lk{position:absolute;right:5px;top:4px;z-index:2;font-size:14px}
.lcd-art{position:relative;z-index:1;flex:1;display:flex;align-items:flex-end;justify-content:center;min-height:0;padding:16px 4px 0}
.lcd-art .qa,.lcd-art .sil0{display:flex;align-items:flex-end;justify-content:center;width:100%;height:100%;font-size:44px}
.lcd-art img{width:100%;height:100%;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 4px 4px #000a)}
.lcd.lock .lcd-art img{filter:brightness(0) drop-shadow(0 0 6px #7a8bb055);opacity:.75}
.lcd-ft{position:relative;z-index:2;display:flex;flex-direction:column;gap:3px;padding:14px 6px 6px;margin-top:-14px;background:linear-gradient(transparent,#070c15ee 38%)}
.lcd-nm{font-family:var(--disp,inherit);font-size:13px;font-weight:800;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 2px #000,0 0 6px #000}
.lcd-row{display:flex;align-items:center;gap:3px;min-height:18px}
.lcd-fm{flex:1;min-width:0;font-size:10px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lcd-el{display:flex;gap:2px}.lcd-e{display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:5px;background:#0b111b;border:1px solid #ffffff26}.lcd-e .ei{width:13px;height:13px}
.lcd-bar{display:flex;align-items:center;gap:3px}.lcd-bi{font-size:10px}
.lcd-tr{flex:1;height:5px;border-radius:3px;background:#ffffff18;overflow:hidden}.lcd-tr i{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,#3FA9F5,#6FE0FF)}
.lcd-bar b{font-size:9.5px;font-weight:700;color:var(--mut)}
.lcd.rdy{box-shadow:0 0 0 2px #E9C46A88,0 0 14px #E9C46A66}.lcd.rdy .lcd-tr i{background:linear-gradient(90deg,#E9C46A,#FFE59A)}
.lcd-up{position:absolute;left:50%;top:5px;transform:translateX(-50%);z-index:3;font-size:11px;font-weight:900;color:#1A1206;background:#E9C46A;border-radius:6px;padding:1px 6px}
.lcd.lock{border-color:#46526A}.lcd.lock .lcd-sc{filter:saturate(.3) brightness(.7)}
/* main screen */
.lb-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.lb-me{display:flex;align-items:center;gap:8px}.lb-me b{display:block;font-size:15px;line-height:1.1}
.lb-av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:21px;background:radial-gradient(circle at 35% 30%,#3a5584,#16233a);border:2px solid var(--gold);box-shadow:0 0 10px #E9C46A44}
.lb-lg{font-size:11px;color:var(--mut)}
.lb-r{display:flex;align-items:center;gap:6px}
.lb-cur{padding:5px 11px;border-radius:999px;background:#0b111b;border:1px solid #5AA9F055;font-size:13px}.lb-cur b{color:#BFE3FF}
.lb-mb{font-size:16px;padding:6px 12px}
.lb-hero{position:relative;height:210px;border-radius:18px;overflow:hidden;border:1px solid #33456a;
  background:${SCN} bottom/100% 55% no-repeat,radial-gradient(36px 36px at 80% 22%,#fff6d0,#f3dc9a 45%,transparent 72%),radial-gradient(90px 90px at 80% 22%,#f3dc9a33,transparent 70%),
  radial-gradient(1.5px 1.5px at 12% 18%,#fff,transparent),radial-gradient(1.5px 1.5px at 30% 9%,#fff,transparent),radial-gradient(1px 1px at 46% 24%,#fff,transparent),radial-gradient(1.5px 1.5px at 62% 12%,#fff,transparent),radial-gradient(1px 1px at 92% 40%,#fff,transparent),radial-gradient(1px 1px at 22% 36%,#fff,transparent),
  linear-gradient(#1a2550,#2a2a5c 45%,#162038)}
.lb-logo{position:absolute;left:0;right:0;top:12px;text-align:center;font-family:var(--disp,inherit);font-size:34px;font-weight:900;letter-spacing:.02em;color:#FFE7A3;
  text-shadow:0 2px 0 #9a5a12,0 4px 0 #4a2a08,0 0 18px #ffb84a66;-webkit-text-stroke:1px #6a3c0c}
.lb-team{position:absolute;left:0;right:0;bottom:22px;display:flex;justify-content:center;align-items:flex-end;gap:2px;z-index:1}
.lb-pet{display:flex;align-items:flex-end;justify-content:center;width:96px;height:100px;font-size:52px;animation:lbB 3.2s ease-in-out infinite}
.lb-pet.p1{width:118px;height:122px;animation-delay:-1.1s}.lb-pet.p2{animation-delay:-2s}
.lb-pet img{width:100%;height:100%;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 6px 5px #000b)}
@keyframes lbB{50%{transform:translateY(-4px)}}
.lb-plat{position:absolute;left:12%;right:12%;bottom:12px;height:26px;border-radius:50%;background:radial-gradient(closest-side,#7fb8ff55,#3b5c9a33 60%,transparent)}
.lb-go{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:12px 16px;border-radius:16px;color:#2A1A05;
  background:linear-gradient(#FFE08A,#E9B44A 55%,#C98A2A);border:2px solid #FFF0B8;box-shadow:0 4px 0 #8a5a14,0 8px 16px #0008}
.lb-go:active{transform:translateY(2px);box-shadow:0 2px 0 #8a5a14,0 4px 10px #0008}
.lb-goi{font-size:30px}.lb-go b{display:block;font-size:19px;font-weight:900}.lb-go span span{font-size:12px;opacity:.8}
.mtg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.mt{display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 4px 9px;border-radius:14px;background:linear-gradient(#22324d,#172234);border:1px solid #33466a;box-shadow:0 3px 0 #0c1320;color:var(--fg)}
.mt:active{transform:translateY(2px);box-shadow:0 1px 0 #0c1320}
.mt-ic{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:25px;background:radial-gradient(circle at 35% 30%,#3a5584,#121c2e);border:2px solid #4a6290}
.mt b{font-size:12.5px;line-height:1.1;text-align:center}.mt-s{font-size:10px;color:var(--mut);text-align:center;line-height:1.15}
.lb-ver{text-align:center;font-size:10px;color:var(--mut);opacity:.7;margin-top:2px}
.lb-nav{position:sticky;bottom:6px;z-index:5;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px;border-radius:18px;background:#0e1626f0;border:1px solid #33466a;box-shadow:0 -4px 16px #0009;margin-top:4px}
.lb-nav button{display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px 2px;border-radius:12px;color:var(--fg);font-size:12px;font-weight:700;background:linear-gradient(#22324d,#172234)}
.lb-nav small{font-size:9.5px;font-weight:400;color:var(--mut)}
.lb-ni{position:relative;font-size:24px;line-height:1.1}.lb-ni .qdot{position:absolute;right:-12px;top:-2px}
.lb-pop .lb-pv{font-size:10px;text-align:center;padding:4px 0 0}
`;document.body.appendChild(st)}
