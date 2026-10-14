/* ---------- 0.9.0: meta game. Library, 5 qualities, levels up to 20, alt cards per slot, quests, shop, cheats ---------- */
// quality no longer caps the level (Anton 2026-10-13): every creature levels to MAXLV; QNEED is the level needed to raise quality
const MAXLV=25,QNEED=[5,10,15,20],QUP=[{fr:10,st:10},{fr:20,st:30},{fr:40,st:80},{fr:80,st:200}],UNLOCK_FR=10;
const xpNeed=lv=>3+2*lv;
const mp=n=>META.pets[n];
// 0.32.0: level gives +1.5% hp and Сила per level; quality gives cards (2nd card per slot at Необычный/Редкий/Эпический) and a Legendary trait
const metaMul=(lv,q)=>lvGrow(lv);
const lvPw=lv=>0;
const altOpen=(q,j)=>(q||0)>=j+1;
// Legendary trait, one per class (first pass)
const LEGV={sage:.25,guard:.2,hit:.8,heal:.2};// Legendary trait strengths (sage: initiative steps)
const LEGT={guard:'начинает бой со щитом в 20% здоровья',fighter:'первый удар за бой сильнее на 80%',healer:'лечение от его карт сильнее на 20%',agile:'первый удар по нему за бой проходит мимо',sage:'инициатива его карт −5'};
// card details: what the numbers are counted from
function silaHtml(t,c){const l=[],P=v=>Math.round(100*v/SILA0)+'%';if(t.dmg)l.push('урон '+P(t.dmg));if(t.trap)l.push('ловушка '+P(t.trap.dmg));if(t.heal)l.push('лечение '+P(t.heal));if(t.shield)l.push('щит '+P(t.shield));
  return l.length?`<div class="m" style="font-size:12px">${l.join(', ')} Силы${c&&c.sila?` · Сила ${c.n}: ${Math.round(silaOf(c))}`:''}</div>`:''}
// a battle definition of pet i at a given level / quality / card choice
function metaDef(i,lv,q,sl,ups){const p=PETS[i];
  const cards=p.cards.map((k,j)=>{let c=sl&&sl[j]&&p.alt&&p.alt[j]&&altOpen(q,j)?p.alt[j]:k;if(ups&&ups[j])c=upCard(c);return c});
  return {...p,hp:Math.round(p.hp*metaMul(lv,q)),pw:(p.pw||0)+lvPw(lv),cards,lv,q,pi:i,els:cardEls(cards)}}
function myDef(i){const m=mp(PETS[i].n);return metaDef(i,m.lv,m.q,m.sl)}
const curCards=i=>{const m=mp(PETS[i].n),p=PETS[i];return p.cards.map((k,j)=>m.sl[j]&&p.alt&&p.alt[j]&&altOpen(m.q,j)?p.alt[j]:k)};
// modes that use your collection and its progress
const metaMode=()=>!CTX||['run','quick','lair','rank'].includes(CTX.kind);
const sandbox=()=>!!(META.cheat&&META.cheat.sand);
function addXp(n,v,log){const m=mp(n);if(!m.un)return 0;m.xp+=v;let up=0;
  while(m.lv<MAXLV&&m.xp>=xpNeed(m.lv)){m.xp-=xpNeed(m.lv);m.lv++;up++}
  if(m.lv>=MAXLV)m.xp=0;
  if(up&&log)log.push({k:'lv',n,lv:m.lv});return up}
function giveFr(n,v,log){const m=mp(n);m.fr+=v;if(log)log.push({k:'fr',n,v});
  if(!m.un&&m.fr>=UNLOCK_FR){m.un=true;m.fr-=UNLOCK_FR;if(log)log.push({k:'new',n})}}
function giveSt(v,log){META.stones+=v;if(log&&v)log.push({k:'st',v})}
const canQUp=n=>{const m=mp(n),c=QUP[m.q];return m.un&&c&&m.lv>=QNEED[m.q]&&m.fr>=c.fr&&META.stones>=c.st};
function qUp(n){const m=mp(n),c=QUP[m.q];if(!canQUp(n))return false;m.fr-=c.fr;META.stones-=c.st;m.q++;addXp(n,0);saveMeta();return true}
const QN=['Обычный','Необычный','Редкий','Эпический','Легендарный'];
const qC=q=>GRADE[q||0].c;
// art with the quality look around it (aura, sparks, halo); q 0 has none
const qArt=(p,q,still)=>`<span class="qa q${q||0}">${petIc(p,still)}</span>`;
function migrateMeta(){
  // 0.32.0: hp ×3 for a run in progress
  if(META.v>=2&&!META.sc3){META.sc3=1;if(META.run&&META.run.team)for(const m of META.run.team)if(m.hp!=null)m.hp*=SC;saveMeta()}
  if(META.v>=2)return;META.sc3=1;
  for(const p of PETS){const m=META.pets[p.n];m.q=m.gr||0;delete m.gr;m.lv=1;m.xp=0;m.sl=[0,0,0];if(m.un){addXp(p.n,0)}}
  META.v=2;META.quests=null;META.shop=null;META.stats={wins:0,battles:0,runs:0,runWins:0};META.cheat={};saveMeta()}
function ensureMeta(){migrateMeta();for(const p of PETS){const m=META.pets[p.n];if(m.q==null)m.q=0;if(!m.lv)m.lv=1;if(m.xp==null)m.xp=0;if(!m.sl)m.sl=[0,0,0]}
  META.stats=META.stats||{wins:0,battles:0,runs:0,runWins:0};META.cheat=META.cheat||{};META.rh=META.rh||[];META.asc=META.asc||0}
ensureMeta();
/* ----- daily quests ----- */
const QDEF={
  win3:{t:'Выиграй 3 боя',g:3,ev:'win',rw:{st:15}},
  down15:{t:'Сыграй 15 карт вниз ▼',g:15,ev:'down',rw:{st:10}},
  up25:{t:'Сыграй 25 карт вверх ▲',g:25,ev:'up',rw:{st:10}},
  flawless:{t:'Победи, не потеряв ни одного существа',g:1,ev:'flawless',rw:{st:20}},
  dmg300:{t:'Нанеси 300 урона',g:300,ev:'dmg',rw:{st:12}},
  quick8:{t:'Победи за 8 ходов или быстрее',g:1,ev:'quick',rw:{st:15}},
  run3:{t:'Пройди 3 точки Забега',g:3,ev:'node',rw:{st:15}},
  kills8:{t:'Победи 8 вражеских существ',g:8,ev:'kill',rw:{st:10}},
  fam:{t:'Выиграй бой, где в стае 2+ существа одного семейства',g:1,ev:'fam2',rw:{fr:5}},
};
function questsToday(){const d=dayKey();if(!META.quests||META.quests.day!==d){const ks=shuffle(Object.keys(QDEF)).slice(0,3);META.quests={day:d,list:ks.map(k=>({k,p:0,cl:false}))};saveMeta()}return META.quests.list}
function questEv(ev,v=1){let ch=false;for(const q of questsToday()){const D=QDEF[q.k];if(D.ev===ev&&q.p<D.g){q.p=Math.min(D.g,q.p+v);ch=true}}if(ch)saveMeta();
  ch=false;for(const q of questsWeek()){const D=WDEF[q.k];if(D.ev===ev&&q.p<D.g){q.p=Math.min(D.g,q.p+v);ch=true}}if(ch)saveMeta()}
function questClaim(i){const q=questsToday()[i],D=QDEF[q.k];if(q.cl||q.p<D.g)return null;q.cl=true;const log=[];if(D.rw.st)giveSt(D.rw.st,log);
  if(D.rw.fr){const own=PETS.filter(p=>mp(p.n).un);const p=own[Math.floor(Math.random()*own.length)];if(p)giveFr(p.n,D.rw.fr,log)}saveMeta();return log}
/* ----- shop: 4 daily fragment offers for stones ----- */
function shopToday(){const d=dayKey();if(!META.shop||META.shop.day!==d){const lock=shuffle(PETS.filter(p=>!mp(p.n).un).map(p=>p.n)),own=shuffle(PETS.filter(p=>mp(p.n).un).map(p=>p.n));
  const l=[...lock.slice(0,2),...own.slice(0,2)];while(l.length<4&&own.length>l.length)l.push(own[l.length]);
  META.shop={day:d,offers:l.map((n,i)=>({n,fr:i<2?5:8,cost:i<2?20:15,b:false}))};saveMeta()}return META.shop.offers}
/* ----- rewards after a regular battle (not Забег, it has its own) ----- */
function battleRewards(){
  const win=G.over==='win',log=[],mine=G.P.pets.filter(p=>!p.tok&&p.pi!=null);
  if(!metaMode()||sandbox()||SIMU)return log;
  const boss=G.boss||(NEXT_INFO&&NEXT_INFO.boss),xp=win?(boss?10:6):2;
  for(const p of mine){const n=PETS[p.pi].n,l0=mp(n).lv;addXp(n,xp,log);log.push({k:'xp',n,v:xp,lv0:l0})}
  META.stats.battles++;
  if(win){META.stats.wins++;giveSt(boss?8:({medium:4,hard:5,master:6,smart:7}[G.B.ai]||3),log);// harder opponents pay more
    if(Math.random()<.45){const lock=PETS.filter(q=>!mp(q.n).un),pool=Math.random()<.6&&lock.length?lock:mine.map(q=>PETS[q.pi]);const q=pool[Math.floor(Math.random()*pool.length)];if(q)giveFr(q.n,3,log)}
    questEv('win');if(G.turn<=8)questEv('quick');if(!G.P.pets.some(p=>!p.tok&&!p.alive))questEv('flawless');
    const fc={};for(const p of mine)fc[p.fam]=(fc[p.fam]||0)+1;if(Object.values(fc).some(v=>v>=2))questEv('fam2')}
  else giveSt(1,log);
  saveMeta();return log}
let NEXT_INFO=null;
function rewardsHtml(log){if(!log||!log.length)return'';
  const xp=log.filter(x=>x.k==='xp'),lv=new Map(log.filter(x=>x.k==='lv').map(x=>[x.n,x.lv])),rest=log.filter(x=>!['xp','lv'].includes(x.k));
  const pp=n=>PETS.find(p=>p.n===n);
  return`<div class="rwl">${xp.map(x=>{const m=mp(x.n),cap=m.lv>=MAXLV;return`<div class="rwp ${lv.has(x.n)?'up':''}"><span class="rwa">${qArt(pp(x.n),m.q,1)}</span><span class="m">+${x.v} оп.</span>${lv.has(x.n)?`<b class="rwlv">ур. ${lv.get(x.n)}!</b>`:`<span class="m" style="font-size:10px">ур. ${m.lv} в Библиотеке${cap?' · максимальный':''}</span>`}</div>`}).join('')}</div>
  ${rest.map(x=>x.k==='st'?`<div class="rwr">💎 <b>+${x.v}</b> ${plN(x.v,'камень','камня','камней')}</div>`:x.k==='fr'?`<div class="rwr">${petIc(pp(x.n),1)} 🧩 <b>+${x.v}</b> ${x.n}${mp(x.n).un?'':` · ${mp(x.n).fr}/${UNLOCK_FR}`}</div>`:x.k==='new'?`<div class="rwr new">✨ <b>${x.n}</b> теперь в библиотеке!</div>`:x.k==='gold'?`<div class="rwr">🪙 <b>+${x.v}</b> золота</div>`:'').join('')}`}
/* ----- library ----- */
const LIBF={show:'all',fam:null,sort:'q'};
function libList(){let l=PETS.map((p,i)=>i);
  if(LIBF.show==='own')l=l.filter(i=>mp(PETS[i].n).un);if(LIBF.show==='lock')l=l.filter(i=>!mp(PETS[i].n).un);
  if(LIBF.fam)l=l.filter(i=>PETS[i].fam===LIBF.fam);
  const s={q:(a,b)=>(mp(PETS[b].n).un-mp(PETS[a].n).un)||mp(PETS[b].n).q-mp(PETS[a].n).q||mp(PETS[b].n).lv-mp(PETS[a].n).lv||PETS[a].n.localeCompare(PETS[b].n,'ru'),
    lv:(a,b)=>(mp(PETS[b].n).un-mp(PETS[a].n).un)||mp(PETS[b].n).lv-mp(PETS[a].n).lv,name:(a,b)=>PETS[a].n.localeCompare(PETS[b].n,'ru'),
    fam:(a,b)=>Object.keys(FAM).indexOf(PETS[a].fam)-Object.keys(FAM).indexOf(PETS[b].fam)||Object.keys(CLS).indexOf(PETS[a].cls)-Object.keys(CLS).indexOf(PETS[b].cls),
    fr:(a,b)=>mp(PETS[b].n).fr-mp(PETS[a].n).fr}[LIBF.sort];if(s)l.sort(s);return l}
function libTile(i){const p=PETS[i],m=mp(p.n),need=m.un?QUP[m.q]:{fr:UNLOCK_FR},fp=need?Math.min(1,m.fr/need.fr):1,ready=m.un?canQUp(p.n):false;
  return`<button class="ltl ${m.un?'':'lock'} ${ready?'rdy':''}" data-act="lib-${i}" style="--qc:${m.un?qC(m.q):'#3A4658'}">
  <span class="lt-art">${m.un?qArt(p,m.q,1):`<span class="sil0">${petIc(p,1)}</span>`}</span>
  ${m.un?`<span class="lt-lv">${m.lv}</span>`:''}<span class="fmb">${FAM[p.fam].ic}</span>
  <span class="lt-nm" style="${m.un&&p.n.length>11&&p.n.includes(' ')?'white-space:normal;line-height:1.05;font-size:10px':m.un&&p.n.length>8?`font-size:${Math.max(8,11*8/p.n.length).toFixed(1)}px`:''}">${m.un?p.n:'???'}</span>
  <span class="lt-bar"><i style="width:${fp*100}%"></i><b>🧩 ${m.fr}${need?'/'+need.fr:''}</b></span>${ready?'<span class="lt-up">▲</span>':''}</button>`}
function renderLib(){
  const own=PETS.filter(p=>mp(p.n).un).length,l=libList(),pill=(a,on,t)=>`<button class="pill sm ${on?'on':''}" data-act="${a}">${t}</button>`;
  let h=`<div class="top"><button class="pill sm" data-act="m-menu">‹ Меню</button><div class="title">Библиотека</div><span class="m">💎 ${META.stones}</span></div>
  <div class="m" style="font-size:12px;margin:-2px 0 6px">Открыто ${own} из ${PETS.length}. Тапни существо: уровень, качество, карты.</div>
  <div class="modes">${pill('lf-all',LIBF.show==='all','Все')}${pill('lf-own',LIBF.show==='own','Открытые')}${pill('lf-lock',LIBF.show==='lock','Закрытые')}<button class="pill sm" data-act="lib-shop">🛒 Лавка</button></div>
  <div class="modes" style="margin-top:4px">${pill('lfam-',!LIBF.fam,'Все семейства')}${Object.entries(FAM).map(([k,f])=>pill('lfam-'+k,LIBF.fam===k,f.ic)).join('')}</div>
  <div class="modes" style="margin-top:4px"><span class="m" style="font-size:11px;align-self:center">Сортировка</span>${[['q','качество'],['lv','уровень'],['fr','осколки'],['fam','семейство'],['name','имя']].map(([k,t])=>pill('ls-'+k,LIBF.sort===k,t)).join('')}</div>
  <div class="lib">${l.map(libTile).join('')}</div>`;
  if(ui.lp!=null)h+=libSheet(ui.lp);
  if(ui.shop)h+=shopSheet();
  setApp(h)}
function cardMini(k,p,lock,on,act){const t=T[k];return`<button class="lcard ${on?'on':''} ${lock?'lk':''}" ${act&&!lock?`data-act="${act}"`:''} style="--pc:${elVar(t.el)}"><div class="h"><span>${t.n} ${shapeIcon(t.area)}</span><span class="c-cost">${costHtml(t)}</span></div><div class="lc-tx">${cardTxt(t,p)}</div><div class="m" style="font-size:11px"><span class="spdp">⏱ ${cardIni(k)}</span> <span class="spdp">▼ ⏱ ${cardIniDn(k)}</span> +${t.burn+(p.fam==='elem'?1:0)} ${EI(t.dg||t.el,1)}${t.sub?', '+t.sub.short:''}</div>${lock?`<div class="lc-lock">🔒 ${lock}</div>`:on?'<div class="lc-on">✓ в колоде</div>':''}</button>`}
function libSheet(i){const p=PETS[i],m=mp(p.n),F=FAM[p.fam],C=CLS[p.cls],d=myDef(i),qc=QUP[m.q],cap=MAXLV,need=QNEED[m.q];
  const looks=QN.map((n,q)=>`<button class="qlook ${q===(ui.lq??m.q)?'on':''} ${q>m.q||!m.un?'dk':''}" data-act="lq-${q}" style="--qc:${qC(q)}">${q<=m.q&&m.un?qArt(p,q,1):`<span class="sil0">${petIc(p,1)}</span>`}</button>`).join('');
  const lq=ui.lq??m.q,seen=m.un&&lq<=m.q;
  const xpPct=m.lv>=cap?100:Math.round(100*m.xp/xpNeed(m.lv));
  const slots=p.cards.map((k,j)=>{const a=p.alt&&p.alt[j],op=altOpen(m.q,j);const pd={...p,sila:SILA0*lvGrow(m.lv),pw:p.pw||0,leg:m.q>=4};return`<div class="slot"><div class="m" style="font-size:11px">Ячейка ${j+1}</div><div class="slr">${cardMini(k,pd,'',!m.sl[j]||!a||!op,`sl-${i}-${j}-0`)}${a?cardMini(a,pd,!op||!m.un?'откроется на качестве «'+QN[j+1]+'»':'',m.sl[j]&&op,`sl-${i}-${j}-1`):''}</div></div>`}).join('');
  return`<div class="over" data-act="lp-close"><div class="box psheet lsheet" style="--qc:${qC(lq)}">
  <div class="lhero"><span class="lbig qa q${seen?lq:0}">${m.un&&seen?petLive(p):`<span class="sil0">${petLive(p)}</span>`}</span>
  <div><h2>${m.un?p.n:'Не изучено'}</h2><div class="m"><b style="color:${qC(lq)}">${QN[lq]}</b>${m.un?` · ур. ${m.lv} из ${cap}`:''}</div><div class="m" style="font-size:12px">${F.ic} ${F.n} · ${C.ic} ${C.n}</div></div></div>
  <div class="qrow">${looks}</div><div class="m" style="font-size:11px;text-align:center;margin-top:-4px">${seen?'Облик на этом качестве.':'Облик откроется, когда поднимешь качество.'}</div>
  ${m.un?`<div class="xpb"><i style="width:${xpPct}%"></i><span>${m.lv>=cap?'Максимальный уровень':`опыт ${m.xp}/${xpNeed(m.lv)}`}</span></div>
  <div class="stt"><span>❤ ${d.hp}${d.hp!==p.hp?` <span class="m">(${p.hp}+${d.hp-p.hp})</span>`:''}</span><span>⚔ Сила ${Math.round(silaOf({sila:SILA0*lvGrow(m.lv),pw:p.pw}))}</span><span>${moveIcon(p.mv)}</span>${pstHtml(p.n)}</div>`:`<div class="m">Собери ${UNLOCK_FR} осколков 🧩, чтобы открыть. Сейчас ${m.fr}/${UNLOCK_FR}. Осколки дают победы, Забег, задания и лавка.</div>`}
  <div class="fxr ps"><span class="fxi">${F.ic}</span><span><b>${F.n}</b><br><span class="m">${F.t[0][0].toUpperCase()+F.t[0].slice(1)}.</span></span></div>
  <div class="fxr ps"><span class="fxi">${C.ic}</span><span><b>${C.n}</b><br><span class="m">${AURA[p.au][0].toUpperCase()+AURA[p.au].slice(1)} (соседи по сторонам).</span></span></div>
  <h3 style="margin:8px 0 2px">Карты</h3><div class="m" style="font-size:11px">В каждой ячейке одна из двух карт. Вторая открывается качеством: в 1-й ячейке на Необычном, во 2-й на Редком, в 3-й на Эпическом. Тапни, чтобы выбрать.</div>${slots}
  ${m.un?(qc?`<div class="qup"><div><b>Качество → <span style="color:${qC(m.q+1)}">${QN[m.q+1]}</span></b><div class="m" style="font-size:11px">${m.q<3?'Вторая карта в ячейке '+(m.q+1):'Черта Легендарного: '+LEGT[p.cls]}, новый облик.${m.lv<need?' Нужен '+need+' уровень.':''}</div><div class="m" style="font-size:12px">🧩 ${m.fr}/${qc.fr} · 💎 ${META.stones}/${qc.st}</div></div><button class="btn main" data-act="qup-${i}" ${canQUp(p.n)?'':'disabled'}>Поднять</button></div>`:`<div class="qup"><b style="color:${qC(4)}">Высшее качество</b></div>`):''}${frxHtml(p,i)}
  <div class="m" style="font-size:11px">Уровень: +1,5% здоровья и Силы за уровень, до 25-го. Качество открывает вторые карты и черту Легендарного, уровень качество не ограничивает, но для повышения нужен минимальный уровень: 5, 10, 15 и 20.${m.q>=4?' <b>Черта:</b> '+LEGT[p.cls]+'.':''}</div>
  <div class="acts"><button class="btn main" data-act="lp-x">Закрыть</button></div></div></div>`}
function shopSheet(){const of=shopToday();
  return`<div class="over" data-act="sh-close"><div class="box"><h2>Лавка <span class="m">💎 ${META.stones}</span></h2><div class="m" style="font-size:12px">Осколки за камни. Товары меняются каждый день.</div>
  ${of.map((o,i)=>{const p=PETS.find(q=>q.n===o.n),m=mp(o.n);return`<div class="shi"><span class="rwa">${m.un?qArt(p,m.q,1):`<span class="sil0">${petIc(p,1)}</span>`}</span><span style="flex:1"><b>${m.un?o.n:'Неизвестное существо'}</b><div class="m" style="font-size:11px">🧩 ${o.fr} осколков · сейчас ${m.fr}${m.un?'':'/'+UNLOCK_FR}</div></span><button class="pill ${o.b?'':'on'}" data-act="buy-${i}" ${o.b||META.stones<o.cost?'disabled':''}>${o.b?'куплено':'💎 '+o.cost}</button></div>`}).join('')}
  <div class="acts"><button class="btn main" data-act="sh-x">Закрыть</button></div></div></div>`}
function questsHtml(){const l=questsToday();return l.map((q,i)=>{const D=QDEF[q.k],done=q.p>=D.g;return`<div class="qst ${q.cl?'cl':''}"><span style="flex:1"><b>${D.t}</b><div class="xpb sm"><i style="width:${100*q.p/D.g}%"></i><span>${q.p}/${D.g}</span></div></span><span class="m" style="font-size:11px">${D.rw.st?'💎'+D.rw.st:'🧩'+D.rw.fr}</span>${q.cl?'<span class="m">✓</span>':`<button class="pill sm ${done?'on':''}" data-act="qc-${i}" ${done?'':'disabled'}>Забрать</button>`}</div>`}).join('')}
/* ----- cheats ----- */
function cheatSheet(){const b=(a,t)=>`<button class="btn ${ui.chOk===a?'chok':''}" data-act="ch-${a}">${ui.chOk===a&&!t.startsWith('✓')?'✓ ':''}${t}</button>`;const sand=sandbox();
  return`<div class="over" data-act="ch-close"><div class="box"><h2>🛠 Читы</h2><div class="m" style="font-size:12px">Для тестов. Всё сохраняется в браузере.</div>
  <div class="chg">${b('st','💎 +500 камней')}${b('fr','🧩 +50 осколков всем')}${b('un','🔓 Открыть всех')}${b('lv','⬆ Уровень для качества')}${b('q','⭐ Качество +1 всем')}${b('max','👑 Всё на максимум')}${b('alt','🃏 Все вторые карты')}${b('qr','📋 Задания выполнены')}${b('sand',(sand?'✓ ':'')+'🧪 Песочница: все без прокачки')}${b('reset','🗑 Сбросить прогресс')}</div>
  ${G&&G.phase==='battle'&&!G.over?`<h3>Бой</h3><div class="chg">${b('win','🏆 Победить сейчас')}${b('lose','💀 Проиграть сейчас')}${b('heal','💚 Вылечить своих')}${b('el','✨ +5 всех стихий')}</div>`:''}
  ${META.run?`<h3>Забег</h3><div class="chg">${b('gold','🪙 +200 золота')}${b('life','❤ +1 жизнь')}${b('skip','⏭ Пропустить точку')}${b('talis','🔮 Случайный талисман')}${b('act','🗺 Следующий акт')}</div>`:''}
  <div class="chg">${b('asc','🔺 Все уровни сложности')}${b('lairs','👑 Открыть сложности Логов')}${b('rkup','🏆 +300 очков Лиги')}${b('cdx','📖 Открыть Кодекс')}${b('exp','📤 Скопировать сохранение')}${b('imp','📥 Вставить сохранение')}</div>
  <div class="acts"><button class="btn main" data-act="ch-x">Закрыть</button></div></div></div>`}
function cheat(k){const all=PETS.map(p=>p.n);
  if(k==='lairs'){for(const b of Object.keys(BOSSES))lairOf(b).t=Math.max(lairOf(b).t,2);saveMeta();toast('👑 Все сложности Логов открыты.');chOk('lairs');render();return}
  if(k==='rkup'){const R=rk();R.pts+=300;R.best=Math.max(R.best,R.pts);saveMeta();toast('🏆 +300 очков Лиги.');chOk('rkup');render();return}
  if(k==='cdx'){const c=cdx();for(const[s]of CDX_TABS)for(const x of cdxList(s))c[s][x.k]=1;saveMeta();toast('📖 Кодекс открыт.');chOk('cdx');render();return}
  if(k==='exp'){const code=btoa(unescape(encodeURIComponent(JSON.stringify(META))));
    try{navigator.clipboard.writeText(code).then(()=>{toast('📤 Сохранение скопировано. Вставь его на другом устройстве.');render()},()=>askYes('Скопируй код сохранения:','Готово',()=>{},1,code))}catch(e){askYes('Скопируй код сохранения:','Готово',()=>{},1,code)}return}
  if(k==='imp'){askYes('Вставь код сохранения:','📥 Загрузить',code=>{if(!code)return;
    try{const m=JSON.parse(decodeURIComponent(escape(atob(code.trim()))));if(!m||!m.pets)throw 0;META=m;ensureMeta();saveMeta();G={phase:'menu'};ui.cheat=false;toast('📥 Сохранение загружено.');render()}catch(e){toast('Код не подошёл.');render()}},1);return}
  if(k==='st')META.stones+=500;
  if(k==='fr')for(const n of all)giveFr(n,50);
  if(k==='un')for(const n of all)mp(n).un=true;
  if(k==='lv')for(const n of all){const m=mp(n);if(m.un){m.lv=Math.max(m.lv,QNEED[m.q]||MAXLV);m.xp=0}}
  if(k==='q')for(const n of all){const m=mp(n);if(m.un&&m.q<4){m.lv=Math.max(m.lv,QNEED[m.q]);m.q++}}
  if(k==='max')for(const n of all){const m=mp(n);m.un=true;m.q=4;m.lv=25;m.xp=0}
  if(k==='alt')for(const n of all){const m=mp(n);if(m.un&&m.q<3){m.q=3;m.lv=Math.max(m.lv,15)}}
  if(k==='qr')for(const q of questsToday())q.p=QDEF[q.k].g;
  if(k==='sand')META.cheat.sand=!META.cheat.sand;
  if(k==='asc')META.asc=10;
  if(k==='reset'){askYes('Сбросить весь прогресс? Это нельзя отменить.','🗑 Сбросить',()=>{try{localStorage.removeItem(META_KEY)}catch(e){}loadMeta();ensureMeta();saveMeta();CTX=null;G={phase:'menu'};ui.cheat=false;ui.set=false;toast('🗑 Прогресс сброшен.');render()});return}
  if(G&&G.phase==='battle'&&!G.over){
    ui.set=false;ui.cheat=false;
    if(k==='win'){G.B.pets.forEach(p=>{p.alive=false;p.hp=0});checkOver()}
    if(k==='lose'){G.P.pets.forEach(p=>{p.alive=false;p.hp=0});checkOver()}
    if(k==='heal')for(const p of alive(G.P))p.hp=p.max;
    if(k==='el')for(const e of ELS)G.P.pool[e]+=5;
  }
  if(META.run&&typeof runCheat==='function')runCheat(k);
  const MSG={st:'💎 +500 камней.',fr:'🧩 +50 осколков всем.',un:'🔓 Все существа открыты.',lv:'⬆ Уровни подняты до нужных для качества.',q:'⭐ Качество +1 всем.',max:'👑 Всё на максимуме.',alt:'🃏 Вторые карты открыты.',qr:'📋 Задания выполнены.',sand:META.cheat.sand?'🧪 Песочница включена.':'🧪 Песочница выключена.',asc:'🔺 Все уровни сложности открыты.',win:'🏆 Победа.',lose:'💀 Поражение.',heal:'💚 Свои вылечены.',el:'✨ +5 всех стихий.',gold:'🪙 +200 золота.',life:'❤ +1 жизнь.',skip:'⏭ Точка пропущена.',talis:'🔮 Талисман добавлен.',act:'🗺 Следующий акт.'};
  if(MSG[k])toast(MSG[k]);chOk(k);saveMeta();render()}
// cheat button feedback: the pressed button shows ✓ for a moment (Anton: unclear whether it worked)
function chOk(k){ui.chOk=k;clearTimeout(ui.chOkT);ui.chOkT=setTimeout(()=>{ui.chOk=null;if(ui.cheat)render()},1500)}

function mirrorTeam(idx){const own=TEAM.map(i=>mp(PETS[i].n));if(!own.length)return idx;
  const lv=Math.round(own.reduce((a,m)=>a+m.lv,0)/own.length),q=Math.round(own.reduce((a,m)=>a+m.q,0)/own.length);
  return idx.map(i=>typeof i==='object'?i:metaDef(i,lv,q,[0,1,2].map(()=>Math.random()<.5?1:0)))}
function renderMenu(){
  const own=PETS.filter(p=>mp(p.n).un).length,ql=questsToday(),qd=ql.filter(q=>q.p>=QDEF[q.k].g&&!q.cl).length;
  const mi=(act,ic,t,s,cls='')=>`<button class="mi ${cls}" data-act="${act}"><span class="mic">${ic}</span><span><b>${t}</b><span class="m">${s}</span></span></button>`;
  setApp(`<div class="top"><div class="title">Бой стаи</div><span style="display:flex;gap:6px;align-items:center"><span class="m" style="font-size:13px">💎 ${META.stones}</span><button class="pill sm" data-act="fs" title="Во весь экран">⛶</button><button class="pill sm" data-act="m-cheat">🛠</button></span></div>
  <div class="m" style="font-size:11px;margin-top:-4px">v${VER} · сборка ${BUILD}</div>
  ${typeof goalHtml==='function'?goalHtml():''}<div class="menu">
  ${typeof renderRun==='function'?mi('m-run','🧭','Забег',META.run?`Продолжить: акт ${META.run.act+1}, ❤ ${META.run.lives}.`:'Путь через три земли: бои, находки, боссы.','main'):''}
  ${mi('m-lib','📚','Библиотека'+(PETS.filter(p=>canQUp(p.n)).length?` <span class="qdot">${PETS.filter(p=>canQUp(p.n)).length}</span>`:''),`Открыто ${own} из ${PETS.length}. Уровни, качество, карты, лавка.`)}
  </div><div class="msec">Режимы</div><div class="menu mmodes">
  ${mi('m-rank','🏆','Лига',`${LEAGUES[lgOf(rk().pts)].ic} ${LEAGUES[lgOf(rk().pts)].n}, ${plN(rk().pts,'очко','очка','очков',1)}. Бои против всё более сильных ботов.`)}
  ${mi('m-lair','👑','Логова боссов',`Боссов: ${Object.keys(BOSSES).length}, у каждого три сложности. Звёзд: ${Object.keys(BOSSES).reduce((a,k)=>a+lairOf(k).t,0)} из ${Object.keys(BOSSES).length*3}.`)}
  ${mi('m-quick','⚔️','Быстрый бой','Против бота твоего уровня или босса.')}
  ${mi('m-puz','🧩','Задачи',`Победи за один ход. Решено ${Object.keys(pzs().done).length} из ${PUZ.length}.`)}
  ${mi('m-codex','📖','Кодекс',`Открыто ${cdxCount()} из ${cdxTotal()}: боссы, элиты, талисманы, события.`)}
  ${mi('m-ach','🏅','Достижения'+(achReady()?` <span class="qdot">${achReady()}</span>`:''),`Получено ${ACH.filter(a=>META.ach&&META.ach[a.k]).length} из ${ACH.length}. Награды камнями.`)}
  </div>
  <h3 style="margin:12px 0 4px">Задания дня${qd?` <span class="qdot">${qd}</span>`:''}</h3><div class="qlist">${questsHtml()}</div><h3 style="margin:12px 0 4px">Задания недели${questsWeek().filter(q=>!q.cl&&q.p>=WDEF[q.k].g).length?` <span class="qdot">${questsWeek().filter(q=>!q.cl&&q.p>=WDEF[q.k].g).length}</span>`:''} <span class="m" style="font-size:11px;font-weight:400">ещё ${weekLeft()}</span></h3><div class="qlist">${weekHtml()}</div>`)}
let LASTE=null;document.addEventListener('click',e=>{LASTE=e},true);
const bgHit=act=>!LASTE||(LASTE.target&&LASTE.target.dataset&&LASTE.target.dataset.act===act);
function toast(t){ui.toast=t;ui.toastT=Date.now()}
function metaClick(act){
  if(act==='m-cheat'){ui.cheat=true;render();return true}
  if(act==='ch-x'||act==='ch-close'){if(act==='ch-x'||bgHit(act)){ui.cheat=false;render()}return true}
  if(act.startsWith('ch-')){cheat(act.slice(3));return true}
  if(act.startsWith('qc-')){const l=questClaim(+act.slice(3));if(l)toast(l.map(x=>x.k==='st'?'💎 +'+x.v:x.k==='fr'?'🧩 +'+x.v+' '+x.n:x.k==='new'?'✨ '+x.n+' открыт!':'').join(' · '));render();return true}
  if(G.phase!=='lib')return false;
  if(act.startsWith('lf-')){LIBF.show=act.slice(3);render();return true}
  if(act.startsWith('lfam-')){LIBF.fam=act.slice(5)||null;render();return true}
  if(act.startsWith('ls-')){LIBF.sort=act.slice(3);render();return true}
  if(act.startsWith('lib-')&&act!=='lib-shop'){ui.lp=+act.slice(4);ui.lq=null;render();return true}
  if(act.startsWith('lq-')){ui.lq=+act.slice(3);render();return true}
  if(act==='lp-x'||act==='lp-close'){if(act==='lp-x'||bgHit(act)){ui.lp=null;render()}return true}
  if(act.startsWith('sl-')){const[i,j,v]=act.slice(3).split('-').map(Number),m=mp(PETS[i].n);if(m.un&&(v===0||altOpen(m.q,j))){m.sl[j]=v;saveMeta()}render();return true}
  if(act.startsWith('qup-')){const p=PETS[+act.slice(4)];if(qUp(p.n)){ui.lq=null;toast(`${p.n}: качество ${QN[mp(p.n).q]}!`)}render();return true}
  if(act==='lib-shop'){ui.shop=true;render();return true}
  if(act==='sh-x'||act==='sh-close'){if(act==='sh-x'||bgHit(act)){ui.shop=false;render()}return true}
  if(act.startsWith('buy-')){const o=shopToday()[+act.slice(4)];if(o&&!o.b&&META.stones>=o.cost){META.stones-=o.cost;o.b=true;const l=[];giveFr(o.n,o.fr,l);if(l.some(x=>x.k==='new'))toast('✨ '+o.n+' теперь в библиотеке!');saveMeta()}render();return true}
  return false}

