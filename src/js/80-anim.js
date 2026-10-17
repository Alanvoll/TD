/* v26: pet animation helpers */
const lastPos={};
function flipGrab(){const m={};document.querySelectorAll('.pet[data-pid]').forEach(e=>{m[e.dataset.pid]=e.querySelector('.av').getBoundingClientRect()});return m}
function flipPlay(before){
  if(!G||!G.P)return;
  for(const S of [G.P,G.B])for(const p of S.pets){
    const key=p.id,pos=p.r+','+p.c,was=lastPos[key];lastPos[key]=pos;
    if(!was||was===pos||!p.alive||!before[key])continue;
    const el=document.querySelector(`.pet[data-pid="${key}"] .av`);if(!el||!el.animate)continue;
    const a=before[key],b=el.getBoundingClientRect(),dx=a.left-b.left,dy=a.top-b.top;
    el.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:`translate(${dx/2}px,${dy/2-16}px) scale(1.12)`,offset:.5},{transform:'translate(0,0)'}],{duration:340,easing:'ease-out'});
  }
}
const FID=[
  [{transform:'translateY(0)'},{transform:'translateY(-8px) scale(1.05,.95)',offset:.4},{transform:'translateY(0) scale(1.08,.92)',offset:.75},{transform:'none'}],
  [{transform:'rotate(0)'},{transform:'rotate(-14deg)',offset:.3},{transform:'rotate(10deg)',offset:.65},{transform:'none'}],
  [{transform:'scaleX(1)'},{transform:'scaleX(-1)',offset:.5},{transform:'scaleX(1)'}],
  [{transform:'scale(1)'},{transform:'scale(.8,1.2)',offset:.3},{transform:'scale(1.15,.85)',offset:.6},{transform:'none'}],
  [{transform:'translateX(0)'},{transform:'translateX(-3px)',offset:.2},{transform:'translateX(3px)',offset:.4},{transform:'translateX(-2px)',offset:.6},{transform:'none'}]];
setInterval(()=>{if(document.hidden)return;const ems=[...document.querySelectorAll('.cell .av:not(.frz):not(.stn) .em, .pk .em')];if(!ems.length)return;const e=ems[Math.floor(Math.random()*ems.length)];if(e.animate)e.animate(FID[Math.floor(Math.random()*FID.length)],{duration:700,easing:'ease-in-out',composite:e.classList.contains('art')?'replace':'add'})},1300);

function qChip(x,st){
  const S=x.S,side=S===G.P?'me':'op',t=x.card?T[x.card.t]:null,pp=id=>id!=null?pet(S,id):null;
  if(x.kind==='burn'){const c=pp(x.card.pet);return`<div class="qc dn ${side} ${st}">▼<b>${x.sp}</b>${c?petIc(c,1):x.card.t==='step'?'👣':''}</div>`}
  if(isMoveAct(x)){const q=pp(x.petT);return`<div class="qc mv ${side} ${st}"><b>${x.sp}</b>👣${q?petIc(q,1):''}</div>`}
  const c=pp(x.card.pet);return`<div class="qc ${side} ${st}">▲<b>${x.sp}</b>${c?petIc(c,1):''}<i>${t.n}</i></div>`;
}
// timeline shown instead of the hand while a turn resolves: one row per side (enemy on top, you below), ▼ chips dashed.
// Time mode: a column per moment something fires (▼ before ▲ inside a cell). Speed mode: a column per action in order.
function tlIc(x){const pp=id=>id!=null?pet(x.S,id):null;if(isMoveAct(x)){const q=pp(x.petT);return`👣${q?petIc(q,1):''}`}
  const c=pp(x.card.pet);return c?petIc(c,1):x.card.t==='step'?'👣':''}
// turn-order strip (proposal 3 of the order research): while planning it shows your cards in the order they will fire,
// a ⚑ marker for the side that goes first on equal ⏱, and while dragging a card, where it would land (gh) and which of your cards it pushes later (lt).
function frontHtml(){const extra=drag&&drag.on?ui.qprev:null;
  if(ui.busy&&ui.queue)return`<div class="front"><span class="side-name" style="font-size:10px">фронт</span></div>`;
  if(ui.queue||G.over){const q=ui.queue||[];if(!q.length)return`<div class="front"><span class="side-name" style="font-size:10px">фронт</span></div>`;
    return`<div class="front q"><div class="qs" id="qs">${q.map((x,i)=>qChip(x,i<ui.qi?'done':i===ui.qi?'cur':'')).join('')}</div></div>`}
  const S=G.P,pf=G.turn%2===1,q=sortActs([...S.plan.map(e=>({...e,S,src:e})),...(extra?[{...extra,S,src:extra,ghost:1}]:[])]),gi=q.findIndex(x=>x.ghost);
  const pri=`<div class="qpri ${pf?'me':'op'}">⚑ ${pf?'ты':'враг'} первый</div>`;
  if(!q.length)return`<div class="front q"><div class="qs" id="qs">${pri}<span class="qhint">порядок твоих карт</span></div></div>`;
  return`<div class="front q"><div class="qs" id="qs">${pri}${q.map((x,i)=>qChip(x,x.ghost?'gh':gi>=0&&i>gi?'lt':'')).join('')}</div></div>`;
}
let renderReady=false,renderK='';
// draws the current screen, then the overlays that sit on top of any screen
function render(){if(SIMU)return;
  if(!renderReady){renderReady=true;for(const k of Object.keys(T))if(k!=='step'&&!/\+$|_up$/.test(k))try{upCard(k)}catch(e){}}
  if(CTX&&CTX.kind==='puz'&&G&&G.phase==='battle'&&!G.over&&!ui.busy&&G.turn>=2){G.over='lose';onOverRecorded()}
  renderScreen();
  if(ui.cheat)app.insertAdjacentHTML('beforeend',cheatSheet());
  if(ui.ask)app.insertAdjacentHTML('beforeend',askHtml());
  if(ui.toast&&Date.now()-ui.toastT<2600){app.insertAdjacentHTML('beforeend',`<div class="toast">${ui.toast}</div>`);clearTimeout(ui.toastTm);ui.toastTm=setTimeout(()=>{ui.toast=null;const t=app.querySelector('.toast');if(t)t.remove()},2600-(Date.now()-ui.toastT))}
  const h=hintNow();if(h)app.insertAdjacentHTML('beforeend',`<div class="hint1 h-${h}"><div>💡 ${HINTS[h]}</div><button class="pill sm on" data-act="hint1-${h}">Понятно</button></div>`);
  const a=G&&G.phase==='battle'&&G.run&&META.run?META.run.act:-1;for(let i=0;i<3;i++)app.classList.toggle('act'+i,a===i);
  if(ui.auto&&G&&G.phase==='battle'&&!G.over&&!ui.busy&&!ui.autoT)ui.autoT=setTimeout(()=>{ui.autoT=null;if(ui.auto&&G.phase==='battle'&&!G.over&&!ui.busy){masterPlan(G.P,G.B);resolve()}},900);
  if(G&&(G.phase!=='battle'||G.over))ui.auto=false;
  if(ui.bIntro&&G&&G.phase==='battle'&&!G.over&&G.turn<=1&&!ui.busy&&!ui.auto&&G.B&&G.B.bk===ui.bIntro&&BOSSES[ui.bIntro])app.insertAdjacentHTML('beforeend',bossIntroHtml(ui.bIntro));
  if(G&&G.phase==='menu'&&!META.welcome&&!(META.stats&&META.stats.battles))
  app.insertAdjacentHTML('beforeend',`<div class="over"><div class="box" style="text-align:center"><div style="font-size:44px">🐾</div><h2>Добро пожаловать в «Бой стаи»</h2><div class="m" style="font-size:13px;margin:6px 0 10px">Начни с 🧭 Забега. Правила боя всегда в бою: «☰ Меню» → «Помощь».</div><div class="acts"><button class="btn main" data-act="wl-no">Начать</button></div></div></div>`);
  if(CTX&&CTX.kind==='puz'&&G&&G.phase==='battle'&&!G.over)app.insertAdjacentHTML('afterbegin',`<div class="pzbar"><span>🧩 <b>Задача ${CTX.i+1}</b>: победи за этот ход. Враги не ходят.</span><button class="pill sm" data-act="pz-reset">↺ Сброс</button></div>`);
  {const k=G.phase+'|'+(CTX&&CTX.kind||'');if(k!==renderK){renderK=k;try{window.scrollTo(0,0)}catch(e){}}}
  if(G.over&&typeof fxl!=='undefined')fxl.querySelectorAll('.ban,.fx-out').forEach(e=>e.remove());
  try{fitMini()}catch(e){}try{fitNames()}catch(e){}
}
function renderScreen(){syncRar();
  if(G.phase==='lair')return renderLair();
  if(G.phase==='rank')return renderRank();
  if(G.phase==='codex')return renderCodex();
  if(G.phase==='puzlist')return renderPuzList();
  if(G.phase==='lib')return renderLib();
  if(G.phase==='run')return renderRun();
  if(G.phase==='ach')return renderAch();
  if(G.phase==='menu')return renderMenu();
  if(G.phase==='pick')return renderPick();
  if(G.phase==='place')return renderPlace();
  const P=G.P,B=G.B,av=avail(P);
  const roleTag=`<span class="m" style="font-size:12px;white-space:nowrap">первым ходит ${G.turn%2===1?'ты':'враг'}</span>`;
  let h=`<div class="top"><div class="title" style="display:flex;flex-direction:column;line-height:1.1">Ход ${G.turn}${roleTag}</div><span style="display:flex;gap:6px"><button class="pill" data-act="fxs" title="Эффекты">💫</button><button class="pill" data-act="hint">?</button><button class="pill" data-act="log">📜</button><button class="pill" data-act="settings">⚙</button><button class="pill" data-act="fs" title="Во весь экран">⛶</button></span></div>
  ${factionBar()}
  <div class="side-bar">${G.boss?`<span class="side-name">${B.bk?BOSSES[B.bk].ic+' '+BOSSES[B.bk].n:'🗿 Голем'}<br>${maxPlay(B)} карты за ход${B.bk&&BOSSES[B.bk].charge?' · ⚡ заряд '+(B.chg||0)+'/'+stormN(B):''}${B.pets[0].shield?' · щит '+B.pets[0].shield:''}</span><button class="pill" data-act="boss-deck">Колода босса</button>`:`<span class="side-name">${G.emod?'💀 '+ELM[G.emod].ic+' '+ELM[G.emod].n+': '+ELM[G.emod].t:'Соперник'}</span>`}${G.boss?'':`<span class="pool">${chips(B.pool)||'<span class="m">нет стихий</span>'}</span>`}</div>
  <div class="board">${gridHtml(B,'b')}${gridHtml(P,'p')}</div>
  ${frontHtml()}
  
  <div class="side-bar"><span class="side-name">Стихии${!G.over&&!P.boss?` · <span title="Приток: в начале следующего хода +1 к самой бедной стихии стаи">приток → ${EI(ui.busy&&P.inc?P.inc:incNext(P),1)}</span>`:''}</span><span class="pool">${ELS.filter(k=>av[k]||P.pets.some(q=>q.alive&&petEls(q).includes(k))).map(k=>`<span class="chip" style="${av[k]?'':'opacity:.35'}">${av[k]}${EI(k)}</span>`).join('')}</span></div>
  ${ui.busy&&ui.queue?tlHtml():`<div class="side-bar"><span class="piles"><button class="pill" data-act="hand-open">▲ Рука ${P.hand.length}/${handSize(P)}</button><button class="pill" data-act="pile-deck">Колода ${P.deck.length}</button><button class="pill" data-act="pile-disc">Сброс ${P.discard.length}</button></span><span class="side-name">карт ${cardsPlanned(P)}</span></div>
  <div class="hand mini ${P.hand.length>5?'scr':''}">${P.hand.map(c=>cardHtml(c,true)).join('')}</div>`}
  ${ui.handOpen&&!ui.card&&!ui.mover&&!ui.busy&&!G.over?`<div class="hs-back" data-act="hand-close"></div><div class="hsheet"><div class="hs-top"><b>Рука</b><span class="m" style="font-size:12px">карт ${cardsPlanned(P)}</span><button class="pill sm" data-act="hand-close">✕</button></div><div class="hs-pool">${ELS.filter(k=>av[k]||P.pets.some(q=>q.alive&&petEls(q).includes(k))).map(k=>`<span class="chip" style="${av[k]?'':'opacity:.35'}">${av[k]}${EI(k)}</span>`).join('')}</div><div class="hgrid">${P.hand.map(c=>cardHtml(c)).join('')}</div><div class="hs-bot">${burnRestBtn(P)}<button class="btn main hs-go" data-act="go">В бой</button></div></div>`:''}
  ${detailHtml()}
  ${!G.over&&!(CTX&&CTX.kind==='puz')?`<div class="bact"><button class="pill ${ui.auto?'on':''}" data-act="autoplay">🤖 Авто${ui.auto?' ✓':''}</button><button class="pill" data-act="advice">💡 Совет</button><button class="pill" data-act="bspd">⏩ ×${spdNow()}</button></div>`:''}
  <div class="acts"><button class="btn" data-act="clear" ${ui.busy||!P.plan.length?'disabled':''}>Отменить план</button><button class="btn main" data-act="go" ${ui.busy||G.over?'disabled':''}>В бой</button></div>
`;
  if(G.over){onOverRecorded();h+=overHtml()}
  if(ui.card)h+=cardModal();
  if(ui.set)h+=`<div class="over" data-act="set-close"><div class="box"><h2>Настройки</h2><div class="m" style="font-size:11px">v${VER} · сборка ${BUILD}</div>
   <div class="m" style="font-size:12px;margin-top:10px">Существа на поле</div><div class="modes"><button class="pill ${LIVEART?'on':''}" data-act="live-on">Живые</button><button class="pill ${LIVEART?'':'on'}" data-act="live-off">Лёгкие, если тормозит</button></div>
   <div class="modes"><button class="btn" data-act="rules">Правила и эффекты</button><button class="btn" data-act="to-menu">Выйти в меню</button></div><button class="btn" data-act="m-cheat">🛠 Читы</button>
   <button class="btn main" data-act="set-close">Закрыть</button></div></div>`;
  if(ui.bdeck){const all=[...B.deck,...B.hand,...B.discard],cnt={};for(const c of all)cnt[c.t]=(cnt[c.t]||0)+1;
    h+=`<div class="over" data-act="bdeck-close"><div class="box"><h2>Колода босса · ${all.length}</h2><div class="m" style="font-size:12px">${B.bk?BOSSES[B.bk].n:'Голем'} не тратит стихии и играет ${maxPlay(B)} карты за ход из руки в ${HAND_BASE}. Здоровье ${B.pets[0].hp}/${B.pets[0].max}. ${B.bk?BOSSES[B.bk].rule:'Уязвимое место ✶ получает двойной урон и каждый ход перемещается. На половине здоровья голем впадает в ярость.'}</div>${Object.keys(cnt).map(k=>`<div class="pcard" style="--pc:var(--earth)"><div class="h"><span>${T[k].n} ×${cnt[k]} ${shapeIcon(T[k].area)}</span><span class="spdp">⏱ ${cardIni(k)}</span></div><div>${cardTxt(T[k])}</div></div>`).join('')}<button class="btn main" style="margin-top:8px" data-act="bdeck-close">Закрыть</button></div></div>`}
  if(ui.fxs)h+=fxSheet();
  if(ui.hint){const fams=S=>[...new Set(alive(S).map(p=>p.fam).filter(f=>FAM[f]))].map(f=>`${FAM[f].ic} <b>${FAM[f].n}</b>: ${FAM[f].t[0]}`).join('<br>')||'нет';
    h+=`<div class="over" data-act="hint-close"><div class="box hintbox"><div class="boxhd"><h2>Подсказка</h2></div>
    <h3>Как идёт ход</h3><div class="m">1. Рука добирается до числа живых петов + 1, со второго хода приходит ещё 1 стихия.<br>2. У каждой карты два действия: верх ▲ и низ ▼. С карты играешь одно из них: тяни карту за верх на цель или за низ на поле. Обе половины стоят стихий: низ ▼ стоит 1 стихию своей карты (если это не только шаг). Сама половина стихий не даёт.<br>3. Несыгранные карты в конце хода уходят в сброс и дают стихии, отмеченные полосой посередине карты.<br>4. «В бой»: карты обеих сторон срабатывают вперемешку по инициативе ⏱, у ▲ и ▼ она своя.<br>5. Лишние стихии остаются на следующий ход. Ближе к концу боя приходит Буря и ранит всех каждый ход.</div>
    <h3>Эффекты</h3><div class="m">Красные плохие, зелёные хорошие. Число у пета: сколько ходов ещё действует (у щита: сколько урона поглотит).</div>${fxLegend()}<h3>Стихии</h3><div class="ellg">${ELS.map(k=>`<span>${EI(k)} ${ELN[k]}</span>`).join('')}</div><div class="m"><span class="spdp">⏱ 15</span> инициатива карты: меньше число, раньше она сработает. Карты обеих сторон срабатывают вперемешку по инициативе. У ▼ своё число, оно внизу карты; при равенстве ▼ раньше ▲. Зелёное число: карта сейчас раньше обычного, красное: позже.</div>
    <h3>Классы</h3><div class="m">У каждого класса своё правило, оно работает на самого пета, где бы он ни стоял.</div>${P.pets.filter(p=>p.alive&&AURA[p.au]&&p.au!=='tok').map(p=>`<div>${petIc(p,1)} <b>${p.n}</b>${CLS[p.cls]?' '+CLS[p.cls].ic+' '+CLS[p.cls].n:''}: ${AURA[p.au]}</div>`).join('')}
    <div><b>Строй:</b> пет с 2+ соседями по сторонам получает на ${K} меньше от широких ударов.</div>
    <h3>Семейства</h3><div class="m">У каждого семейства своё свойство, оно работает и у одного пета.</div><div><b>Твои:</b><br>${fams(P)}</div><div><b>Соперника:</b><br>${fams(B)}</div>
    <h3>Соперник</h3><div>Рука ${B.hand.length}, колода ${B.deck.length}, сброс ${B.discard.length}.</div>
    <button class="btn main" data-act="hint-close">Понятно</button></div></div>`}
  if(ui.log)h+=`<div class="over" data-act="log-close"><div class="box"><h2>Журнал хода</h2><div class="log">${G.log.length?G.log.join('<br>'):'Пока пусто.'}</div><button class="btn main" data-act="log-close">Закрыть</button></div></div>`;
  if(ui.pile){const P2=G.P,list=(ui.pile==='deck'?P2.deck:P2.discard).slice().sort((a,b)=>(a.pet||'').localeCompare(b.pet||'')||a.t.localeCompare(b.t));
    const cards=list.map(c=>cardHtml(c).replace(/ data-card="[^"]*"/,'').replace(/ data-burnc="[^"]*"/,'').replace('<button','<div').replace(/<\/button>$/,'</div>')).join('');
    h+=`<div class="over" data-act="pile-close"><div class="box"><h2>${ui.pile==='deck'?'Колода':'Сброс'} · ${list.length}</h2><div class="m" style="font-size:12px">${ui.pile==='deck'?'Порядок скрыт, карты отсортированы по петам.':'Сыгранные карты. Они вернутся в колоду, когда в ней не хватит карт на добор.'}</div><div class="hand pilegrid">${cards||'<span class="m">Пусто.</span>'}</div><button class="btn main" data-act="pile-close">Закрыть</button></div></div>`}
  if(ui.rules)h+=`<div class="over" data-act="rules-close"><div class="box"><h2>Как играть</h2><ul>
  <li><b>У каждой стороны 5 петов</b> на своей сетке 3×5. Верхний ряд твоей сетки и нижний ряд сетки соперника это фронт.</li>
  <li><b>Колода</b>: 15 карт петов, по 3 от каждого. Каждый ход рука добирается до числа живых петов + 1.</li>
  <li><b>👣 Шаг</b> есть на некоторых картах, сверху ▲ или снизу ▼: у каждого пета хотя бы один шаг сверху и один снизу. Шагает пет этой карты, по схеме, нарисованной на карте (зелёная рамка). Если значок шага стоит перед эффектом, пет сначала шагает, потом действует; если после, то наоборот. Когда сыграешь такую половину, подсветятся клетки: тапни нужную или перетащи пета. Не нужен шаг — просто играй дальше. Тап по пету отменяет выбранный шаг. Если на клетке свой пет, они меняются местами.</li>
  <li><b>Мини-карта в руке</b>: карта одинаковая сверху и снизу: верхняя часть ▲ (цена, цель и сила, ⏱), нижняя часть ▼ (то же для низа, цена в самом низу). Полоса посередине: стихии, которые карта даст, если её не сыграть. Цена: сплошные значки, стихии сброса: значки в кружке. Чем меньше ⏱, тем раньше срабатывает. Тап по карте открывает её целиком.</li>
  <li><b>У каждой карты два действия.</b> Схвати карту за верх, чтобы сыграть ▲, и брось на цель. Схвати за низ и брось на поле или под руку, чтобы сыграть ▼: низ делает своё действие сам, цель выбирать не нужно. Низ стоит 1 стихию карты, как и верх. Без перетаскивания: тапни карту, нажми «▲ Сыграть верх» или «▼ Сыграть низ». С карты играется одно действие. Несыгранные карты в конце хода уходят в сброс и дают стихии из полосы посередине на следующий ход, несыгранные стихии копятся до 10. <b>Приток:</b> каждый ход стая сама даёт +1 к той своей стихии, которой у тебя меньше всего; при равенстве по порядку стихий. Куда он придёт, видно заранее рядом со стихиями: «приток →».</li>
  <li><b>Погибший пет</b> забирает из колоды свои карты. <b>Буря</b> начинается с 12-го хода или раньше, когда у кого-то осталось 2 пета: в конце хода все петы теряют здоровье, с каждым ходом больше, а лечение вдвое слабее.</li>
  <li><b>Ход.</b> Оба втайне выбирают карты, сколько хватит стихий. Затем все карты обеих сторон срабатывают по <b>инициативе</b> ⏱ от 1 до 100: меньше число, раньше карта. У ▲ и ▼ каждой карты своя инициатива. При равенстве ▼ раньше ▲, потом тот, у кого первый ход. Удары бьют по клеткам: если пет успел уйти, удар мимо.</li>
  <li><b>Очередь.</b> Полоса между сетками показывает порядок твоих карт, пока планируешь. В бою вместо руки виден таймлайн обеих сторон. Зелёная рамка твоя, красная соперника, золотая срабатывает сейчас. Число на плашке это инициатива карты. Метка ⚑ показывает, кто ходит первым при равной ⏱. Пока тянешь карту, пунктирная плашка показывает, когда она сработает, а твои карты после неё бледнеют со стрелкой ↓.</li>
  <li><b>Семейство</b> у каждого пета одно из десяти, и у каждого семейства своё свойство. Оно работает даже у одного пета: ${Object.values(FAM).map(f=>f.ic+' '+f.n+': '+f.t[0]).join('; ')}.</li>
  <li><b>Класс</b> даёт пету своё правило: ${Object.values(CLS).map(c=>c.ic+' '+c.n+': '+AURA[c.au]).join('; ')}.</li>
  <li><b>Сила.</b> У каждого существа есть ⚔ Сила, обычно около 20. Карта бьёт, лечит и даёт щит в процентах от Силы своего существа, на карте сразу написано итоговое число. Сила растёт с уровнем.</li>
  <li><b>Строй.</b> Пет, у которого 2 или больше соседей по сторонам, получает на ${K} урона меньше от широких ударов (линия, ряд, столбец, крест, квадрат, все враги).</li>
  <li><b>Щит</b> держится, пока его не собьют, и не бывает больше ${SHIELD_CAP} при Силе 20. Этот потолок растёт вместе с Силой существа, как и числа его карт. Быстрый щит защищает уже в этом ходу, медленный пригодится в следующем.</li>
  <li><b>Ловушки</b> ставятся в клетку соперника в момент своей инициативы и живут 2 хода. Ловушка срабатывает, когда в её клетке оказывается враг.</li>
  <li><b>Эффекты</b> описаны в шпаргалке 💫. Вампиризм лечит на нанесённый урон. ⚡ Цепь: хаос перескакивает на другого врага.</li>
  <li><b>Победа</b>, когда у соперника не осталось петов.</li></ul>
  <button class="btn main" data-act="rules-close">Понятно</button></div></div>`;
  const before=flipGrab();
  setApp(h);
  flipPlay(before);
  {const qs=document.getElementById('qs'),c=qs&&qs.querySelector('.qc.cur');if(c)qs.scrollLeft=c.offsetLeft-qs.clientWidth/2+c.offsetWidth/2}
  {const ts=document.getElementById('tls'),c=ts&&(ts.querySelector('.tlb.cur')||ts.querySelector('.tlnow'));if(c)ts.scrollLeft=c.offsetLeft-ts.clientWidth/2+c.offsetWidth/2}
  ui.seen=new Set(P.hand.map(c=>c.uid));
}

document.getElementById('app').addEventListener('click',e=>{
  if(Date.now()-suppress<400)return;
  {const fa=e.target.closest('[data-act="fxs"],[data-act="fxs-close"]');if(fa){if(fa.dataset.act==='fxs'){ui.fxs=true;render()}else if(e.target===fa||fa.tagName==='BUTTON'){ui.fxs=false;render()}return}}
  if(G.phase!=='battle')return phaseClick(e);
  {const ma=e.target.closest('[data-act]');if(ma&&modeClick(ma.dataset.act))return}
  const bc=e.target.closest('[data-burnc]');
  if(bc){const S=G.P,card=S.hand.find(c=>c.uid===bc.dataset.burnc);if(!card)return;const e2=S.plan.find(x=>x.card===card);if(e2&&e2.kind==='burn')return tapCard(card.uid);return doBurn(card)}
  const a=e.target.closest('[data-act],[data-card],[data-cell]');if(!a)return;
  if(a.dataset.card){if(a.closest('.hand.mini')&&!ui.busy&&!G.over){ui.handOpen=true;ui.card=null;return render()}return tapCard(a.dataset.card)}
  if(a.dataset.cell){const[s,r,c]=a.dataset.cell.split(',');return tapCell(s,+r,+c)}
  const act=a.dataset.act;
  if(act==='hand-close'){ui.handOpen=false;render();return}
  if(act==='hand-open'){if(!ui.busy&&!G.over){ui.handOpen=true;ui.card=null;render()}return}
  if(act==='rules'){ui.set=false;ui.rules=true;render()}
  else if(act==='pile-deck'||act==='pile-disc'){ui.pile=act==='pile-deck'?'deck':'disc';render()}
  else if(act==='pile-close'){if(e.target===a||a.tagName==='BUTTON'){ui.pile=null;render()}}
  else if(act==='log'){ui.log=true;render()}
  else if(act==='hint'){ui.hint=true;render()}
  else if(act==='settings'){ui.set=true;render()}
  else if(act==='set-close'){if(e.target===a||a.tagName==='BUTTON'){ui.set=false;render()}}
  else if(act==='live-on'||act==='live-off'){LIVEART=act==='live-on';try{localStorage.setItem('pb-live',LIVEART?'1':'0')}catch(e){}render()}
  else if(act==='to-menu'&&!ui.busy){ui.set=false;
    // leaving a Лига fight counts as a loss (playtest: it was a free escape)
    if(G&&G.phase==='battle'&&!G.over&&CTX&&CTX.kind==='rank'){askYes('Выйти из боя Лиги? Это засчитается как поражение (−20 очков).','Выйти',()=>{G.over='lose';rankOver();modeClick('m-menu')});return}
    modeClick('m-menu')}
  else if(act==='boss-deck'){ui.bdeck=true;render()}
  else if(act==='bdeck-close'){if(e.target===a||a.tagName==='BUTTON'){ui.bdeck=false;render()}}
  else if(act==='log-close'){if(e.target===a||a.tagName==='BUTTON'){ui.log=false;render()}}
  else if(act==='hint-close'){if(e.target===a||a.tagName==='BUTTON'){ui.hint=false;render()}}
  else if(act==='m-close'){if(e.target===a||a.tagName==='BUTTON'){ui.card=null;render()}}
  else if(act==='m-play'){const S=G.P,card=S.hand.find(c=>c.uid===ui.card);ui.card=null;if(card&&!whyNot(S,card)){const t=T[card.t];ui.mover=null;ui.peek=null;ui.handOpen=false;
    if(AUTO.has(t.area)){S.plan.push({kind:'card',card,paid:payCard(S,card)});ui.sel=null;ui.msg=null}
    else{ui.sel=card.uid;ui.msg=STEP.has(t.area)?'Тапни существо, которое пойдёт, потом подсвеченную клетку.':t.area==='ally'?'Тапни своё существо, на которое сыграть карту.':OWN.has(t.area)?'Тапни свою клетку, куда сыграть карту.':'Тапни клетку врага, куда сыграть карту.'}}render()}
  else if(act==='m-burn'){const card=G.P.hand.find(c=>c.uid===ui.card);ui.card=null;if(card)doBurn(card)}
  else if(act==='m-unplan'){const card=G.P.hand.find(c=>c.uid===ui.card);ui.card=null;if(card)unplan(card);render()}
  else if(act==='rules-close'){if(e.target===a||a.tagName==='BUTTON'){ui.rules=false;render()}}
  else if(act==='clear'){G.P.plan=[];ui.sel=null;ui.mover=null;ui.msg=null;render()}
  else if(act==='burn-rest'){burnRest()}
  else if(act==='go'){ui.handOpen=false;resolve()}
  else if(act==='burn'){const S=G.P,card=S.hand.find(c=>c.uid===(ui.sel||ui.peek));if(card)doBurn(card)}
  else if(act==='again'){G={phase:'pick'};render()}
});
document.getElementById('app').addEventListener('pointerover',e=>{
  if(e.pointerType!=='mouse')return;
  const a=e.target.closest('[data-cell]');if(!a||!ui.sel)return;
  const[s,r,c]=a.dataset.cell.split(',');
  const nh=s==='b'?[+r,+c]:null,np=s==='p'?[+r,+c]:null;
  if(String(nh)!==String(ui.hover)||String(np)!==String(ui.hoverP)){ui.hover=nh;ui.hoverP=np;render()}
});

function burnRestBtn(S){if(HV())return''; // 0.34: the «▼ Все вниз» button is gone, unplayed cards are discarded by themselves (puzzles keep it)
  const rest=S.hand.filter(c=>!S.plan.some(e=>e.card===c)),bn=S.plan.filter(e=>e.kind==='burn').length;
  return`<button class="hs-burn ${rest.length||bn?'on':''}" data-burn data-act="burn-rest">${rest.length?`▼ Все вниз · ${rest.length}`:bn?'↩ Вернуть в руку':'▼ Вниз'}</button>`}
function burnRest(){
  const S=G.P;if(ui.busy||G.over)return;
  const rest=S.hand.filter(c=>!S.plan.some(e=>e.card===c));
  if(rest.length)for(const c of rest)S.plan.push({kind:'burn',card:c,...burnVal(S,c)});
  else S.plan=S.plan.filter(e=>e.kind!=='burn');
  ui.sel=null;ui.peek=null;ui.msg=null;ui.mover=null;render();
}
function doBurn(card){
  const S=G.P;if(ui.busy||G.over)return;
  const pi=S.plan.findIndex(e=>e.card===card);if(pi>=0)S.plan.splice(pi,1);
  S.plan.push({kind:'burn',card,...burnVal(S,card)});
  ui.sel=null;ui.peek=null;ui.msg=null;ui.mover=null;render();
}
