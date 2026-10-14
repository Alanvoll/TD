/* ---------- 0.16.0: «Лига». Ladder against bots: win points, climb six leagues, each league has stronger enemies and a smarter bot.
   You never drop below the league you reached. First time in a league pays stones ---------- */
const LEAGUES=[
  {n:'Бронза',ic:'🥉',at:0,lv:2,q:0,ai:'easy',st:0},
  {n:'Серебро',ic:'🥈',at:150,lv:5,q:1,ai:'medium',st:20},
  {n:'Золото',ic:'🥇',at:350,lv:9,q:1,ai:'medium',st:40},
  {n:'Платина',ic:'🛡',at:600,lv:13,q:2,ai:'hard',st:60},
  {n:'Алмаз',ic:'🔷',at:900,lv:17,q:3,ai:'master',st:100},
  {n:'Легенда',ic:'👑',at:1300,lv:23,q:4,ai:'smart',st:200}];
const rk=()=>{META.rank=META.rank||{pts:0,best:0,top:0,streak:0,w:0,l:0,h:[]};return META.rank};
const lgOf=pts=>{let i=0;for(let k=0;k<LEAGUES.length;k++)if(pts>=LEAGUES[k].at)i=k;return i};
function rankEnemy(){const L=LEAGUES[lgOf(rk().pts)],ids=capPick(shuffle([...PETS.keys()]),5);
  return ids.map(i=>{const lv=Math.max(1,Math.min(25,L.lv+Math.floor(Math.random()*3)-1));return metaDef(i,lv,L.q,[0,1,2].map(s=>lv>=5+5*s&&Math.random()<.5?1:0))})}
function rankStart(){CTX={kind:'rank'};const L=LEAGUES[lgOf(rk().pts)];NEXT={enemy:rankEnemy(),ai:L.ai};G={phase:'pick'};resetPlace();
  TEAM=TEAM.filter(i=>mp(PETS[i].n).un||sandbox());ui.pv=null;ui.psheet=false;render()}
function renderRank(){const R=rk(),i=lgOf(R.pts),L=LEAGUES[i],N=LEAGUES[i+1];
  const pr=N?Math.round(100*(R.pts-L.at)/(N.at-L.at)):100;
  setApp(`<div class="top"><button class="pill sm" data-act="m-menu">‹ Меню</button><div class="title">Лига</div><span class="m">💎 ${META.stones}</span></div>
  <div class="lg-card"><div class="lg-ic">${L.ic}</div><div style="flex:1"><b style="font-size:18px">${L.n}</b><div class="m" style="font-size:12px">${plN(R.pts,"очко","очка","очков",1)}${N?` · до лиги «${N.n}» ${N.at-R.pts}`:' · вершина'}</div>
  <div class="xpb"><i style="width:${pr}%"></i><span>${N?R.pts+' / '+N.at:'👑'}</span></div></div></div>
  <div class="m" style="font-size:12px;margin:6px 0">Соперник: существа ур. ${L.lv}±1, бот «${{easy:'Лёгкий',medium:'Средний',hard:'Сложный',master:'Мастер',smart:'Стратег'}[L.ai]}». Победа +30 очков (серия побед до +15), поражение −20. Ниже своей лиги не опустишься.</div>
  <div class="lg-row">${LEAGUES.map((x,k)=>`<span class="lg-l ${k<=R.top?'on':''} ${k===i?'cur':''}"><span>${x.ic}</span><small>${x.n}</small>${x.st&&k>R.top?`<small class="m">💎${x.st}</small>`:''}</span>`).join('')}</div>
  <div class="m" style="font-size:12px;margin:8px 0 4px">Побед ${R.w}, поражений ${R.l}${R.streak>1?`, серия ${R.streak} 🔥`:''}. Рекорд: ${plN(R.best,"очко","очка","очков",1)}.</div>
  ${R.h.length?`<div class="lg-h">${R.h.map(x=>`<span class="${x>0?'w':'l'}">${x>0?'+':''}${x}</span>`).join('')}</div>`:''}
  <div class="acts" style="margin-top:12px"><button class="btn main" data-act="rk-go">⚔️ Найти соперника</button></div>`)}
function rankOver(){if(G.over==='win')questEv('rank');const R=rk(),win=G.over==='win';let d=0;R.pend=0;
  if(win){R.streak++;d=30+Math.min(15,5*(R.streak-1));R.w++}else if(G.over==='lose'){R.streak=0;d=-20;R.l++}
  R.pts=Math.max(LEAGUES[R.top].at,R.pts+d);R.best=Math.max(R.best,R.pts);R.h=[d,...R.h].slice(0,12);G.rkD=d;
  const i1=lgOf(R.pts);if(i1>R.top){G.rw=G.rw||[];for(let k=R.top+1;k<=i1;k++)giveSt(LEAGUES[k].st,G.rw);R.top=i1;G.rkUp=i1}
  saveMeta()}
function rankOverHtml(){const R=rk(),L=LEAGUES[lgOf(R.pts)],d=G.rkD||0;
  const body=`<div class="m">${d>0?`+${plN(d,"очко","очка","очков",1)}`:d<0?`${d} очков`:'Ничья, очки не меняются'}. ${L.ic} ${L.n}: ${R.pts}.${R.streak>1?` Серия ${R.streak} 🔥`:''}</div>${G.rkUp!=null?`<div class="rwr new">🎉 Новая лига: <b>${LEAGUES[G.rkUp].ic} ${LEAGUES[G.rkUp].n}</b>!</div>`:''}`;
  return{body,btn:`<button class="btn" data-act="m-rank">К лиге</button><button class="btn main" data-act="rk-go">Следующий бой</button>`}}
function rankClick(act){
  if(act==='m-rank'){CTX=null;NEXT=null;G={phase:'rank'};resetPlace();render();return true}
  if(act==='rk-go'){rankStart();return true}
  return false}
ACH.push({k:'rank2',ic:'🥇',n:'Золотая лига',t:'Дойди до лиги «Золото»',g:()=>[rk().top,2],st:40},{k:'rank5',ic:'👑',n:'Легенда',t:'Дойди до лиги «Легенда»',g:()=>[rk().top,5],st:150});

// a Лига fight closed mid-battle (reload, closed app) counts as a loss on the next start
function rankPendCheck(){const R=rk();if(!R.pend)return;R.pend=0;R.streak=0;R.l++;const d=-20;R.pts=Math.max(LEAGUES[R.top].at,R.pts+d);R.h=[d,...R.h].slice(0,12);saveMeta();
  setTimeout(()=>toast('Прошлый бой Лиги не доигран: засчитано поражение, −20 очков.'),300)}
try{if(typeof META!=='undefined'&&META)rankPendCheck()}catch(e){}
