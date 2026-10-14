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
  <span class="lcd-sc">${typeof libBg==='function'?libBg(i):''}</span>
  <span class="lcd-q" title="${m.un?QN[m.q]:''}"></span>${m.un?`<span class="lcd-lv">Ур. ${m.lv}</span>`:'<span class="lcd-lk">🔒</span>'}
  <span class="lcd-art">${m.un?qArt(p,m.q,1):`<span class="sil0">${petIc(p,1)}</span>`}</span>
  <span class="lcd-ft"><span class="lcd-nm" style="${nmS}">${m.un?p.n:'???'}</span>
  <span class="lcd-row"><span class="lcd-fm" title="${f.n}">${f.ic}${m.un?'':' '+f.n}</span>${m.un?`<span class="lcd-el">${els.map(e=>`<span class="lcd-e">${EI(e,1)}</span>`).join('')}</span>`:''}</span>
  <span class="lcd-bar"><span class="lcd-bi">🧩</span><span class="lcd-tr"><i style="width:${fp*100}%"></i></span><b>${m.fr}${need?'/'+need.fr:''}</b></span></span>
  ${ready?'<span class="lcd-up">▲</span>':''}${typeof libInk==='function'?libInk(i):''}</button>`};

/* ----- 3) main screen + quests page ----- */
function heroTeam(){const own=i=>PETS[i]&&mp(PETS[i].n).un;let l=(META.lastQ||[]).filter(own);
  if(l.length<3)l=l.concat(PETS.map((p,i)=>i).filter(i=>own(i)&&!l.includes(i)));return l.slice(0,3)}
function questReady(){return questsToday().filter(q=>q.p>=QDEF[q.k].g&&!q.cl).length+questsWeek().filter(q=>!q.cl&&q.p>=WDEF[q.k].g).length}
function renderQuests(){const qd=questsToday().filter(q=>q.p>=QDEF[q.k].g&&!q.cl).length,wd=questsWeek().filter(q=>!q.cl&&q.p>=WDEF[q.k].g).length;
  setApp(`<div class="top"><button class="pill sm" data-act="m-menu">‹ Меню</button><div class="title">Задания</div><span class="m">💎 ${META.stones}</span></div>
  <div class="msec" style="margin-top:2px">Задания дня${qd?` <span class="qdot">${qd}</span>`:''}</div><div class="qlist">${questsHtml()}</div>
  <div class="msec">Задания недели${wd?` <span class="qdot">${wd}</span>`:''} <span class="m" style="font-size:11px;font-weight:400;text-transform:none;letter-spacing:0">ещё ${weekLeft()}</span></div><div class="qlist">${weekHtml()}</div>`)}
if(typeof renderScreen==='function'){const rs0=renderScreen;renderScreen=function(){if(G&&G.phase==='quests'){syncRar();return renderQuests()}return rs0()}}
if(typeof modeClick==='function'){const mc0=modeClick;modeClick=function(act){
  if(act==='m-quests'){ui.mm=false;CTX=null;G={phase:'quests'};render();return true}
  if(/^lt-[cgt]$/.test(act)){ui.ltab=act[3];render();return true}
  if(act==='lfl-open'){ui.lflt=true;render();return true}
  if(act==='lfl-x'){if(bgHit(act)||(LASTE&&LASTE.target&&LASTE.target.closest&&LASTE.target.closest('button[data-act="lfl-x"]'))){ui.lflt=false;render()}return true}
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
  if(ph==='lib'){const t=document.createElement('template');t.innerHTML=h;const f=t.content,ms=[...f.children].filter(x=>x.classList.contains('modes'));
    if(ms.length>=3){const shop=ms[0].querySelector('[data-act="lib-shop"]');if(shop)shop.remove();
      const n=(LIBF.show!=='all'?1:0)+(LIBF.fam?1:0)+(LIBF.sort!=='q'?1:0);
      for(const b of ms[1].querySelectorAll('[data-act^="lfam-"]')){const k=b.dataset.act.slice(5);if(k&&FAM[k])b.textContent=FAM[k].ic+' '+FAM[k].n}
      const lb=ms[2].querySelector('span.m');if(lb)lb.remove();
      ms[0].insertAdjacentHTML('beforebegin',`<div class="lfb"><button class="pill sm ${n?'on':''}" data-act="lfl-open">⚙ Фильтры и сортировка${n?' · '+n:''}</button><button class="pill sm" data-act="lib-shop">🛒 Лавка</button></div>`);
      if(ui.lflt){const ov=document.createElement('div');ov.className='over';ov.dataset.act='lfl-x';ov.innerHTML='<div class="box lflbox"><div class="boxhd"><h2>Фильтры и сортировка</h2><button class="xb" data-act="lfl-x" aria-label="Закрыть">✕</button></div></div>';
        const bx=ov.firstChild;[['Показать',ms[0]],['Семейства',ms[1]],['Сортировка',ms[2]]].forEach(([t,m])=>{const h4=document.createElement('h4');h4.textContent=t;m.removeAttribute('style');bx.append(h4,m)});
        bx.insertAdjacentHTML('beforeend','<div class="acts"><button class="btn main" data-act="lfl-x">Готово</button></div>');f.appendChild(ov)}
      else ms.forEach(m=>m.remove());
      h=t.innerHTML}}
  if(ph==='lib'&&ui.lp!=null){const t=document.createElement('template');t.innerHTML=h;const bx=t.content.querySelector('.lsheet');if(bx){lsTabs(bx);h=t.innerHTML}}
  const r=sa0(h);if(ph==='lib'&&ui.lp!=null)lsFit();return r}}
/* Anton 20:37: the creature window fits one screen: a short header, then tabs (cards · growth · traits); if it is still too tall the tab content shrinks to fit */
function lsTabs(bx){const kids=[...bx.children],q=sel=>kids.filter(k=>k.matches(sel));
  const hero=q('.lhero')[0],xp=q('.xpb')[0],stt=q('.stt')[0],qrow=q('.qrow')[0],ups=q('.qup'),fx=q('.fxr'),slots=q('.slot'),acts=q('.acts')[0];
  if(!hero||!slots.length)return;
  const qcap=qrow&&qrow.nextElementSibling&&qrow.nextElementSibling.matches('.m')?qrow.nextElementSibling:null;
  const lock=!xp?kids.find(k=>k.matches('.m')&&/осколков/.test(k.textContent)):null;
  const note=kids.filter(k=>k.matches('.m')).pop();
  const info=hero.lastElementChild;if(info){if(stt)info.appendChild(stt);if(xp)info.appendChild(xp);if(lock)info.appendChild(lock)}
  const tab=ui.ltab||'c',rdy=bx.querySelector('[data-act^="qup-"]:not([disabled])');
  const tabs=document.createElement('div');tabs.className='ls-tabs';tabs.innerHTML=`<button class="${tab==='c'?'on':''}" data-act="lt-c">Карты</button><button class="${tab==='g'?'on':''}" data-act="lt-g">Прокачка${rdy?' <span class="qdot">!</span>':''}</button><button class="${tab==='t'?'on':''}" data-act="lt-t">Особенности</button>`;
  const pn=document.createElement('div');pn.className='ls-pn';
  if(tab==='c'){pn.append(...slots);pn.insertAdjacentHTML('beforeend','<div class="m ls-cap">Вторая карта ячейки открывается качеством. Тапни карту, чтобы выбрать.</div>')}
  else if(tab==='g'){if(qrow)pn.appendChild(qrow);if(qcap)pn.appendChild(qcap);pn.append(...ups)}
  else{pn.append(...fx);if(note&&note!==lock&&note!==qcap)pn.appendChild(note)}
  bx.replaceChildren(hero,tabs,pn);if(acts)bx.appendChild(acts)}
function lsFit(){const bx=document.querySelector('.lsheet'),pn=bx&&bx.querySelector('.ls-pn');if(!pn)return;pn.style.zoom='';
  const av=innerHeight-24;for(let z=1;bx.scrollHeight>av&&z>.56;){z-=.03;pn.style.zoom=z.toFixed(2)}}
if(typeof addEventListener==='function')addEventListener('resize',()=>{if(typeof G!=='undefined'&&G&&G.phase==='lib'&&ui.lp!=null)lsFit()});

if(typeof document!=='undefined'&&document.body){const st=document.createElement('style');st.textContent=`
.lsheet.psheet{max-height:calc(100dvh - 24px);overflow:hidden;display:flex;flex-direction:column;gap:8px}
.lsheet .lhero{gap:10px}.lsheet .lbig{width:92px;height:92px}.lsheet .lhero h2{margin:0}.lsheet .lhero>div:last-child{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.lsheet .stt{margin:2px 0 0;gap:8px;flex-wrap:wrap;font-size:13px}.lsheet .xpb{margin:2px 0 0}
.ls-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:3px;border-radius:12px;background:#0b111b}
.ls-tabs button{padding:7px 2px;border-radius:9px;font-size:12.5px;font-weight:700;color:var(--mut)}.ls-tabs button.on{background:var(--panel2);color:var(--fg);box-shadow:inset 0 0 0 1px var(--qc)}
.ls-pn{display:flex;flex-direction:column;gap:8px;min-height:0}.ls-pn .slot{display:flex;flex-direction:column;gap:3px}.ls-cap{font-size:11px;text-align:center}
.lsheet>.acts{margin-top:0}
.lfb{display:flex;gap:6px;flex-wrap:wrap}
.lflbox h4{margin:10px 0 4px}.lflbox .modes{flex-wrap:wrap}
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
`;document.body.appendChild(st)}
