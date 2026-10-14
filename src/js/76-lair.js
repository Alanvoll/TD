/* ---------- 0.14.0: «Логова боссов». Each boss has 3 tiers with a fixed strength; pick 5 from the collection and beat it.
   First clear of a tier pays stones and fragments; the best (fewest) turns are kept ---------- */
const LAIR_T=[
  {n:'Обычный',ic:'⭐',lv:5,q:1,pw:0,st:20,fr:5,need:'Подойдёт стая около 5 уровня.'},
  {n:'Героический',ic:'⭐⭐',lv:12,q:2,pw:0,st:40,fr:10,need:'Нужна стая около 12 уровня, качество Редкий.'},
  {n:'Легендарный',ic:'⭐⭐⭐',lv:20,q:4,pw:0,st:80,fr:15,need:'Для стаи 20 уровня, качество Легендарный.'}];
const LAIRF={forest:1.1,queen:1,hydra:1.1,witch:1.1,golem:1,ash:.9};
const lairOf=k=>{META.lair=META.lair||{};return META.lair[k]=META.lair[k]||{t:0,b:[0,0,0]}};
const LAIR_TF=[1.08,1.35,1.6];const lairMult=(k,t)=>(QBF[k]||1)*(LAIRF[k]||1)*LAIR_TF[t]*metaMul(LAIR_T[t].lv,LAIR_T[t].q);
function mkLair(c){const B=mkBossX(c.bk,lairMult(c.bk,c.tier)),b=B.pets[0];b.pw=(b.pw||0)+LAIR_T[c.tier].pw;return B}
function lairStart(k,t){CTX={kind:'lair',bk:k,tier:t};NEXT=null;G={phase:'pick'};resetPlace();TEAM=TEAM.filter(i=>mp(PETS[i].n).un||sandbox());ui.pv=null;ui.psheet=false;render()}
function renderLair(){const done=Object.keys(BOSSES).reduce((a,k)=>a+lairOf(k).t,0);
  setApp(`<div class="top"><button class="pill sm" data-act="m-menu">‹ Меню</button><div class="title">Логова боссов</div><span class="m">${done}/${Object.keys(BOSSES).length*3} ⭐</span></div>
  <div class="m" style="font-size:12px;margin:-2px 0 8px">Собери стаю из библиотеки против босса. Колода босса открыта. Первая победа на каждой сложности даёт камни и осколки.</div>
  <div class="qlist">${rushHtml()}${Object.entries(BOSSES).map(([k,B])=>{const L=lairOf(k),op=ui.lairOpen===k;
    return`<div class="lair ${L.t>=3?'cl':''}"><div class="lair-h" data-act="lo-${k}"><span class="lair-ic">${petIc({n:B.n,ic:B.ic},1)}</span><span style="flex:1"><b>${B.n}</b><div class="m" style="font-size:11px">${B.rule}</div></span><span class="lair-st">${[0,1,2].map(i=>`<i class="${i<L.t?'on':''}">★</i>`).join('')}</span></div>
    <div class="lair-t">${LAIR_T.map((T,i)=>{const lock=i>L.t,best=L.b[i];return`<button class="pill sm ${i===L.t?'on':''}" data-act="la-${k}-${i}" ${lock?'disabled':''}>${lock?'🔒':T.ic} ${T.n}${best?`<span class="m"> · ${best} х.</span>`:''}</button>`}).join('')}</div>
    ${typeof featLine==='function'?featLine(k):''}
    ${op?`<div class="lair-d"><div class="m" style="font-size:11px;margin:4px 0">${LAIR_T[Math.min(L.t,2)].need} Здоровье ${LAIR_T.map((T,i)=>Math.round(B.hp*K/2*lairMult(k,i))).join(' / ')}.</div>${[...new Set(B.deck)].map(c=>`<div class="lair-c"><b>${T[c].n}</b> ×${B.deck.filter(x=>x===c).length} <span class="m">${cardTxt(T[c],{pw:0})}</span></div>`).join('')}${(B.ph||[]).map(p=>`<div class="m" style="font-size:11px">На ${Math.round(p.at*100)}% здоровья: ${(p.add||[]).length?'добавляет '+[...new Set(p.add)].map(c=>T[c].n).join(', '):p.say}.</div>`).join('')}</div>`:`<div class="m lair-more" data-act="lo-${k}">Колода босса ▾</div>`}</div>`}).join('')}</div>`)}
// lair battle over: best turns and first-clear reward, then the feat, then the weekly hunt
function lairOver(){const c=CTX,L=lairOf(c.bk),T=LAIR_T[c.tier],was=c.rush&&c.rush.paid;
  if(G.over==='win'){questEv('lair');
    if(!L.b[c.tier]||G.turn<L.b[c.tier])L.b[c.tier]=G.turn;
    if(L.t<=c.tier){L.t=c.tier+1;c.first=true;G.rw=G.rw||[];giveSt(T.st,G.rw);
      const lk=shuffle(PETS.filter(p=>!mp(p.n).un));if(lk.length){const p=lk[0];giveFr(p.n,T.fr,G.rw)}else giveSt(T.fr*2,G.rw)}
    saveMeta()}
  const f=FEAT[c.bk];
  if(f&&G.over==='win'&&c.tier>=1&&!featDone(c.bk)){const ok=f.t?G.turn<=f.t:G.P.pets.filter(p=>!p.tok).every(p=>p.alive);
    if(ok){lairOf(c.bk).f=1;c.feat=true;G.rw=G.rw||[];giveSt(50,G.rw);const lk=shuffle(PETS.filter(p=>!mp(p.n).un));if(lk.length)giveFr(lk[0].n,10,G.rw);else giveSt(20,G.rw);saveMeta()}
    else c.featMiss=true}
  if(c.rush){const R=c.rush,s=rushS();
  if(G.over==='win'){R.i++;R.hp=G.P.pets.map(p=>p.alive?p.hp:0);s.best=Math.max(s.best,R.i);
    if(R.i>=R.list.length&&!s.done){s.done=true;R.paid=true;G.rw=G.rw||[];giveSt(60,G.rw);const lk=shuffle(PETS.filter(p=>!mp(p.n).un));if(lk.length)giveFr(lk[0].n,10,G.rw);else giveSt(20,G.rw)}}
    saveMeta();if(!was&&R.paid){META.rushWins=(META.rushWins||0)+1;saveMeta()}}}
function lairOverHtml(){const c=CTX,B=BOSSES[c.bk],T=LAIR_T[c.tier];
  const body=G.over==='win'?`<div class="m">Босс «${B.n}» повержен на сложности ${T.ic} ${T.n} за ${plN(G.turn,"ход","хода","ходов",1)}.${c.first?' Первая победа: награда ниже.':' Лучший результат: '+lairOf(c.bk).b[c.tier]+' х.'}</div>`:`<div class="m">Попробуй другую стаю или расстановку. Колода босса открыта в Логовах.</div>`;
  const o={body,btn:`<button class="btn" data-act="m-lair">К логовам</button><button class="btn main" data-act="la-${c.bk}-${c.tier}">Ещё раз</button>`};
  if(c&&c.feat)o.body+=`<div class="feat ok" style="margin-top:6px">🏅 Подвиг выполнен: ${featTxt(c.bk)}.</div>`;
  else if(c&&c.featMiss)o.body+=`<div class="feat" style="margin-top:6px">🏅 До подвига не хватило: ${featTxt(c.bk)}.</div>`;
  if(c.rush){const R=c.rush;
  if(G.over==='win'&&R.i<R.list.length){o.body+=`<div class="m" style="margin-top:6px">⚔️ Охота: ${R.i} из ${R.list.length}. Дальше: <b>${BOSSES[R.list[R.i]].n}</b>. Выжившие подлечатся на 50%, павшие встанут с четвертью здоровья.</div>`;o.btn=`<button class="btn" data-act="m-lair">Сдаться</button><button class="btn main" data-act="rush-next">Следующий босс</button>`}
  else{o.body+=`<div class="m" style="margin-top:6px">⚔️ Охота ${G.over==='win'?'пройдена: все три босса повержены!':'окончена: '+R.i+' из '+R.list.length+'.'}</div>`;o.btn=`<button class="btn" data-act="m-lair">К логовам</button><button class="btn main" data-act="rush-go">Заново</button>`}}
  return o}
function lairClick(act){
  if(act==='m-lair'){CTX=null;NEXT=null;G={phase:'lair'};resetPlace();render();return true}
  if(act.startsWith('lo-')){const k=act.slice(3);ui.lairOpen=ui.lairOpen===k?null:k;render();return true}
  if(act.startsWith('la-')){const[,k,t]=act.split('-');if(BOSSES[k]&&+t<=lairOf(k).t)lairStart(k,+t);return true}
  return false}
ACH.push({k:'lair1',ic:'👑',n:'Охотник за логовами',t:'Победи всех боссов в Логовах на ⭐',g:()=>[Object.keys(BOSSES).filter(k=>lairOf(k).t>=1).length,Object.keys(BOSSES).length],st:40},
  {k:'lair3',ic:'🐉',n:'Повелитель логов',t:'Победи всех боссов в Логовах на ⭐⭐⭐',g:()=>[Object.keys(BOSSES).filter(k=>lairOf(k).t>=3).length,Object.keys(BOSSES).length],st:200});

/* ---------- 0.15.0: three more bosses, one per land: Паучья матка (web), Костяной король (raises your dead), Грозовой титан (charge) ---------- */
Object.assign(T,{
  bs_sbite:BC({n:'Ядовитый укус',spd:3,area:'melee',dmg:9,ign:2,el:'z'}),bs_webshot:BC({n:'Сеть',spd:4,area:'cell',dmg:4,root:2,el:'n'}),
  bs_webrain:BC({n:'Паутинный дождь',spd:2,area:'enemies',dmg:2,slow:1,el:'n'}),bs_cocoon:BC({n:'Кокон',spd:5,area:'self',shield:8,heal:4,el:'e'}),
  bs_brood:BC({n:'Паучата',spd:4,area:'summon',sum:{n:'Паучонок',ic:'🕷',hp:8,mv:'none',au:'fox'},txt:'Призывает Паучонка (8 хп). Паучонок усиливает удары соседей на 2. Не больше двух.',el:'n'}),
  bs_venom:BC({n:'Ядовитый поток',spd:2,area:'row',dmg:6,ign:2,el:'z'}),
  bs_soul:BC({n:'Похищение души',spd:3,area:'cell',dmg:7,mark:2,el:'d'}),bs_scepter:BC({n:'Удар скипетром',spd:3,area:'melee',dmg:10,el:'d'}),
  bs_grave:BC({n:'Могильный холод',spd:4,area:'col',dmg:5,slow:2,el:'w'}),bs_bonewall:BC({n:'Стена костей',spd:5,area:'self',shield:12,el:'e'}),
  bs_call:BC({n:'Зов мёртвых',spd:4,area:'summon',sum:{n:'Костяной слуга',ic:'💀',hp:10,mv:'none',au:'fox'},txt:'Призывает Костяного слугу (10 хп). Слуга усиливает удары соседей на 2. Не больше двух.',el:'d'}),
  bs_deathwave:BC({n:'Волна смерти',spd:2,area:'enemies',dmg:4,mark:1,el:'d'}),
  bs_bolt:BC({n:'Молния',spd:3,area:'cell',dmg:9,el:'a'}),bs_chain:BC({n:'Цепная молния',spd:3,area:'hline',dmg:5,stun:1,el:'a'}),
  bs_static:BC({n:'Статика',spd:2,area:'enemies',dmg:2,slow:1,el:'a'}),bs_quake:BC({n:'Каменный удар',spd:3,area:'row',dmg:6,push:1,el:'e'}),
  bs_rune:BC({n:'Руна камня',spd:5,area:'self',shield:12,el:'e'}),bs_tempest:BC({n:'Буря',spd:2,area:'enemies',dmg:5,el:'a'}),
});
Object.assign(BOSSES,{
  spider:{n:'Паучья матка',ic:'🕷',hp:190,mp:2,web:1,deck:['bs_sbite','bs_sbite','bs_webshot','bs_webshot','bs_webrain','bs_webrain','bs_brood','bs_brood','bs_cocoon'],
    rule:'Паутина: в начале каждого хода опутывает одно твоё существо, оно не может двигаться. Призывает паучат. На половине здоровья играет 3 карты, в колоде появляется Ядовитый поток.',
    ph:[{at:.5,mp:3,add:['bs_venom','bs_venom'],say:'Матка защищает кладку!'}]},
  boneking:{n:'Костяной король',ic:'👑',hp:170,mp:2,raise:6,deck:['bs_soul','bs_soul','bs_scepter','bs_scepter','bs_grave','bs_grave','bs_bonewall','bs_call','bs_call'],
    rule:'Когда твоё существо погибает, король поднимает Костяного слугу (не больше двух) и лечится на 18. На половине здоровья играет 3 карты, в колоде появляется Волна смерти.',
    ph:[{at:.5,mp:3,add:['bs_deathwave','bs_deathwave'],say:'Мёртвые встают!'}]},
  storm:{n:'Грозовой титан',ic:'⚡',hp:300,mp:2,charge:3,deck:['bs_bolt','bs_bolt','bs_bolt','bs_chain','bs_chain','bs_static','bs_quake','bs_quake','bs_rune','bs_rune'],
    rule:'Заряд: копит молнию, каждый 3-й ход Разряд бьёт всех твоих на 15 (щит помогает). На половине здоровья Разряд каждый 2-й ход, в колоде появляется Буря.',
    ph:[{at:.5,add:['bs_tempest','bs_tempest'],say:'Небо раскалывается!'}]},
});
ACTS[0].bosses.push('spider');ACTS[1].bosses.push('boneking');ACTS[2].bosses.push('storm');
Object.assign(QBF,{spider:.7,boneking:.6,storm:.45});Object.assign(LAIRF,{spider:1,boneking:1,storm:.95});
const stormN=B=>B.ph>0?2:3;
function boss2Turn(){const P=G.P,B=G.B,bk=B.bk&&BOSSES[B.bk];if(!bk||!B.pets[0].alive)return;
  if(bk.web){const l=shuffle(alive(P).filter(p=>!p.tok&&!sv(p,'root')&&canSt(p,'root')));if(l.length){applySt(l[0],'root',1);setFx(P,l[0],'🕸 паутина','bad');G.log.push(`Паутина: <b>${l[0].n}</b> опутан и не может двигаться.`)}}
  if(bk.charge&&G.turn>1){B.chg=(B.chg||0)+1;if(B.chg>=stormN(B)){B.chg=0;for(const p of alive(P)){BST_A=null;hit(P,p,5*SC)};G.log.push(`<b>${bk.n}</b>: Разряд! ${5*SC} урона всем твоим.`);banner(B,'⚡','Разряд!')}}}
function bossRaise(){const B=G.B,bk=B.bk&&BOSSES[B.bk];if(!bk||!bk.raise)return;const b=B.pets[0];if(!b.alive)return;
  if(b.hp<b.max){b.hp=Math.min(b.max,b.hp+bk.raise*SC)}
  if(alive(B).filter(p=>p.tok).length>=2)return;
  const free=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(!petAt(B,r,c))free.push([r,c]);if(!free.length)return;
  const near=free.filter(([r,c])=>r>=b.r-1&&r<=b.r+b.sz&&c>=b.c-1&&c<=b.c+b.sz),[r,c]=(near.length?near:free)[Math.floor(Math.random()*(near.length||free.length))];
  const sh={id:'bt'+B.pets.length,n:'Костяной слуга',ic:'💀',au:'fox',els:[],max:10*SC,hp:10*SC,base:10*SC,mv:'none',r,c,shield:0,frozen:0,alive:true,tok:true,cards:[]};B.pets.push(sh);
  setFx(B,sh,'поднят','info');G.log.push(`<b>${bk.n}</b> поднимает Костяного слугу и лечится на ${bk.raise*SC}.`)}

/* ---------- 0.24.0: three more bosses, one per land: Лесной морок (swaps your creatures), Пиявочный владыка (drains the healthiest), Хранитель часов (rewinds damage) ---------- */
Object.assign(T,{
  bs_tclaw:BC({n:'Когти морока',spd:3,area:'melee',dmg:8,el:'d'}),bs_glamour:BC({n:'Наваждение',spd:4,area:'cell',dmg:5,stun:1,el:'z'}),
  bs_wisps:BC({n:'Блуждающие огни',spd:2,area:'enemies',dmg:2,ign:1,el:'z'}),bs_mask:BC({n:'Маска',spd:5,area:'self',shield:8,evade:1,el:'d'}),
  bs_double:BC({n:'Двойник',spd:4,area:'summon',sum:{n:'Двойник',ic:'🎭',hp:9,mv:'none',au:'fox'},txt:'Призывает Двойника (9 хп). Двойник усиливает удары соседей на 2. Не больше двух.',el:'z'}),
  bs_dance:BC({n:'Хоровод масок',spd:3,area:'row',dmg:6,mark:1,el:'z'}),
  bs_suck:BC({n:'Присоска',spd:3,area:'melee',dmg:8,slow:1,el:'w'}),bs_slime:BC({n:'Болотная слизь',spd:3,area:'row',dmg:4,slow:2,el:'w'}),
  bs_bleed:BC({n:'Кровопускание',spd:4,area:'cell',dmg:6,mark:2,el:'d'}),bs_swarm:BC({n:'Рой пиявок',spd:2,area:'enemies',dmg:2,ign:1,el:'w'}),
  bs_hide:BC({n:'Толстая шкура',spd:5,area:'self',shield:10,el:'e'}),bs_maw:BC({n:'Жадная пасть',spd:3,area:'cross',dmg:7,mark:1,el:'d'}),
  bs_pend:BC({n:'Маятник',spd:3,area:'melee',dmg:10,el:'n'}),bs_gears:BC({n:'Шестерни',spd:3,area:'hline',dmg:6,el:'e'}),
  bs_stop:BC({n:'Остановка',spd:4,area:'cell',dmg:4,stun:1,el:'n'}),bs_sand:BC({n:'Песок времени',spd:2,area:'enemies',dmg:2,slow:2,el:'n'}),
  bs_bronze:BC({n:'Бронзовый панцирь',spd:5,area:'self',shield:12,el:'e'}),bs_midnight:BC({n:'Полночь',spd:2,area:'enemies',dmg:6,el:'n'}),
});
Object.assign(BOSSES,{
  trick:{n:'Лесной морок',ic:'🎭',hp:150,mp:2,swap:1,deck:['bs_tclaw','bs_tclaw','bs_glamour','bs_glamour','bs_wisps','bs_wisps','bs_mask','bs_double','bs_double'],
    rule:'Морок: в начале каждого хода меняет местами два твоих существа. Призывает Двойников. На половине здоровья играет 3 карты, путает дважды за ход, в колоде появляется Хоровод масок.',
    ph:[{at:.5,mp:3,add:['bs_dance','bs_dance'],say:'Кто из вас настоящий?'}]},
  leech:{n:'Пиявочный владыка',ic:'🪱',hp:150,mp:2,leech:2,deck:['bs_suck','bs_suck','bs_suck','bs_slime','bs_slime','bs_bleed','bs_bleed','bs_swarm','bs_hide'],
    rule:'Кровь: в начале каждого хода высасывает 6 здоровья у твоего самого здорового существа (щит не спасает) и лечится на столько же. На половине здоровья играет 3 карты, высасывает 12, в колоде появляется Жадная пасть.',
    ph:[{at:.5,mp:3,add:['bs_maw','bs_maw'],say:'Владыка жаждет!'}]},
  clock:{n:'Хранитель часов',ic:'🕰',hp:280,mp:2,rewind:3,deck:['bs_pend','bs_pend','bs_pend','bs_gears','bs_gears','bs_stop','bs_stop','bs_sand','bs_bronze','bs_bronze'],
    rule:'Перемотка: каждый 3-й ход возвращает себе 40% здоровья, потерянного за два прошлых хода. Бей резко, а не понемногу. На половине здоровья перематывает каждый 2-й ход, в колоде появляется Полночь.',
    ph:[{at:.5,add:['bs_midnight','bs_midnight'],say:'Время пошло вспять!'}]},
});
ACTS[0].bosses.push('trick');ACTS[1].bosses.push('leech');ACTS[2].bosses.push('clock');
Object.assign(QBF,{trick:.8,leech:.6,clock:.45});Object.assign(LAIRF,{trick:1.08,leech:1,clock:1});
const clockN=B=>B.ph>0?2:3;
function boss3Turn(){const P=G.P,B=G.B,bk=B.bk&&BOSSES[B.bk];if(!bk||!B.pets[0].alive)return;const b=B.pets[0];
  if(bk.swap&&G.turn>1){for(let n=0;n<(B.ph>0?2:1);n++){const l=shuffle(alive(P).filter(p=>!p.tok));if(l.length<2)break;const [x,y]=l;[x.r,y.r]=[y.r,x.r];[x.c,y.c]=[y.c,x.c];
    setFx(P,x,'🎭','info');setFx(P,y,'🎭','info');G.log.push(`Морок: <b>${x.n}</b> и <b>${y.n}</b> меняются местами.`)}}
  if(bk.leech&&G.turn>1){const l=alive(P).filter(p=>!p.tok&&!p.ghost).sort((a,c)=>c.hp-a.hp);const p=l[0];if(p){const v=Math.min(p.hp,(B.ph>0?4:bk.leech)*SC);
    BST_A=null;bstHit(P,p,v);p.hp-=v;if(v)p.hurtT=G.turn;b.hp=Math.min(b.max,b.hp+v);setFx(P,p,'🩸 −'+v,'bad');G.log.push(`<b>${bk.n}</b> высасывает ${v} здоровья у <b>${p.n}</b>.`);if(p.hp<=0)die(P,p)}}
  if(bk.rewind){B.hh=B.hh||{};B.hh[G.turn]=b.hp;if(G.turn>2){B.rw=(B.rw||0)+1;if(B.rw>=clockN(B)){B.rw=0;const was=B.hh[G.turn-2];if(was>b.hp){const v=Math.round((was-b.hp)*.4);b.hp=Math.min(b.max,b.hp+v);
    setFx(B,b,'🕰 +'+v,'good');G.log.push(`<b>${bk.n}</b>: Перемотка! Возвращает ${v} здоровья.`);banner(B,'🕰','Перемотка!')}}}}}

/* ---------- 0.15.1: ten more run events, most tied to one land (act) ---------- */
const rndM=R=>R.team[Math.floor(Math.random()*R.team.length)];
EVENTS.push(
  {k:'web',act:0,n:'Паутина поперёк тропы',ic:'🕸',t:'Тропу затянула паутина. В ней висит кокон, и он шевелится.',ch:[
    {t:'Разрезать кокон: внутри существо, оно пойдёт с тобой (гость)',need:R=>R.team.length<5,f:R=>{const o=petOffer(R,[]);if(!o)return'Кокон пуст.';o.guest=!mp(PETS[o.pi].n).un;return takeOffer(o)}},
    {t:'Сжечь паутину: +30 золота из старых коконов, одно существо обожглось (−20%)',f:R=>{R.gold+=30;const m=rndM(R),d=runDef(m);m.hp=Math.max(1,m.hp-Math.round(d.hp*.2));return`+30 золота. ${PETS[m.pi].n} обжёгся.`}},
    {t:'Обойти',f:()=>''}]},
  {k:'mushring',act:0,n:'Ведьмин круг',ic:'🍄',t:'Грибы растут ровным кругом. Внутри тихо и пахнет грозой.',ch:[
    {t:'Встать в круг: половина шансов на Силу +20% случайному существу, иначе вся стая теряет 20%',f:R=>{if(Math.random()<.5){const m=rndM(R);m.pwB++;return`${PETS[m.pi].n}: Сила +20% до конца забега.`}hurtTeam(R,.2);return'Круг рассердился. Стая ранена.'}},
    {t:'Собрать грибы: лечение 20%',f:R=>{healTeam(R,.2);return'Стая подкрепилась.'}}]},
  {k:'wolfden',act:0,n:'Волчье логово',ic:'🐺',t:'Из норы доносится рычание. У входа блестят кости и монеты.',ch:[
    {t:'Выманить вожака: бой, потом талисман',f:R=>{R.evFight={kind:'fight',tal:0};return'Волки выходят!'}},{t:'Уйти тихо',f:()=>''}]},
  {k:'bogfire',act:1,n:'Болотные огни',ic:'🔥',t:'Над трясиной пляшут огоньки и зовут за собой.',ch:[
    {t:'Пойти за огнями: половина шансов на +70 золота, иначе бой с элитой',f:R=>{if(Math.random()<.5){R.gold+=70;return'Огни привели к кладу: +70 золота.'}R.evFight={kind:'elite',tal:0};return'Огни завели в ловушку!'}},
    {t:'Не ходить',f:()=>''}]},
  {k:'leech',act:1,n:'Пиявки',ic:'🩸',t:'Брод кишит пиявками. Другой путь стоит денег у перевозчика.',ch:[
    {t:'Идти вброд: все теряют 15% здоровья',f:R=>{hurtTeam(R,.15);return'Пиявки напились.'}},{t:'Заплатить перевозчику 25 золота',need:R=>R.gold>=25,f:R=>{R.gold-=25;return'Переправились сухими.'}}]},
  {k:'herbhut',act:1,n:'Хижина травницы',ic:'🛖',t:'Старая травница варит что-то в котле.',ch:[
    {t:'Купить зелье за 35 золота: лечение 60%',need:R=>R.gold>=35,f:R=>{R.gold-=35;healTeam(R,.6);return'Стая почти здорова.'}},
    {t:'Помочь с травами: убрать одну карту из колоды',f:R=>{R.pick={mode:'rm',back:'map'};return''}},{t:'Уйти',f:()=>''}]},
  {k:'library',act:2,n:'Древняя библиотека',ic:'📚',t:'Пыльные полки до потолка. Книги шепчут.',ch:[
    {t:'Читать до утра: улучшить карту на выбор, все теряют 10%',f:R=>{hurtTeam(R,.1);R.pick={mode:'up',back:'map'};return''}},
    {t:'Вынести редкий том: +20 💎',f:R=>{META.stones+=20;return'+20 💎 в библиотеку.'}}]},
  {k:'core',act:2,n:'Ядро голема',ic:'💠',t:'Среди обломков пульсирует светящийся кристалл.',ch:[
    {t:'Вставить в существо: случайное существо +25% здоровья до конца забега',f:R=>{const m=rndM(R);m.hpB+=.25;return`${PETS[m.pi].n}: здоровье +25%.`}},
    {t:'Продать кристалл: +55 золота',f:R=>{R.gold+=55;return'+55 золота.'}}]},
  {k:'rift',act:2,n:'Разлом',ic:'🌀',t:'В воздухе висит трещина. Из неё тянет силой.',ch:[
    {t:'Шагнуть: два случайных существа Сила +20%, вся стая теряет 25%',f:R=>{const l=shuffle(R.team.slice()).slice(0,2);for(const m of l)m.pwB++;hurtTeam(R,.25);return l.map(m=>PETS[m.pi].n).join(' и ')+': Сила +20%.'}},
    {t:'Закрыть разлом: лечение 30%',f:R=>{healTeam(R,.3);return'Стало спокойнее.'}}]},
  {k:'smith',n:'Оружейник',ic:'🗡',t:'Кузнец точит когти и клыки за умеренную плату.',ch:[
    {t:'Заплатить 45: случайное существо Сила +20% до конца забега',need:R=>R.gold>=45,f:R=>{R.gold-=45;const m=rndM(R);m.pwB++;return`${PETS[m.pi].n}: Сила +20%.`}},{t:'Уйти',f:()=>''}]},
);

