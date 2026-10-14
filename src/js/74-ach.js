/* ---------- 0.12.0: achievements (one-time goals that pay upgrade stones) ---------- */
const ownL=()=>PETS.filter(p=>mp(p.n).un);
const ACH=[
  {k:'win1',ic:'⚔️',n:'Первая кровь',t:'Выиграй бой',g:()=>[META.stats.wins,1],st:10},
  {k:'win10',ic:'⚔️',n:'Боец',t:'Выиграй 10 боёв',g:()=>[META.stats.wins,10],st:20},
  {k:'win50',ic:'🗡',n:'Ветеран',t:'Выиграй 50 боёв',g:()=>[META.stats.wins,50],st:40},
  {k:'win200',ic:'🏆',n:'Легенда арены',t:'Выиграй 200 боёв',g:()=>[META.stats.wins,200],st:100},
  {k:'kill50',ic:'💀',n:'Охотник',t:'Победи 50 вражеских существ',g:()=>[META.stats.kills||0,50],st:20},
  {k:'kill300',ic:'☠️',n:'Гроза леса',t:'Победи 300 вражеских существ',g:()=>[META.stats.kills||0,300],st:60},
  {k:'own15',ic:'📚',n:'Собиратель',t:'Открой 15 существ',g:()=>[ownL().length,15],st:20},
  {k:'own25',ic:'📚',n:'Хранитель',t:'Открой 25 существ',g:()=>[ownL().length,25],st:50},
  {k:'own50',ic:'📖',n:'Вся стая',t:'Открой всех существ',g:()=>[ownL().length,PETS.length],st:200},
  {k:'lv10',ic:'⬆',n:'Подрос',t:'Подними существо до 10 уровня',g:()=>[Math.max(...ownL().map(p=>mp(p.n).lv)),10],st:25},
  {k:'lv20',ic:'⏫',n:'Вершина',t:'Подними существо до 20 уровня',g:()=>[Math.max(...ownL().map(p=>mp(p.n).lv)),20],st:80},
  {k:'q2',ic:'💠',n:'Редкость',t:'Подними качество существа до «Редкий»',g:()=>[Math.max(...ownL().map(p=>mp(p.n).q)),2],st:20},
  {k:'q4',ic:'🌟',n:'Легендарный',t:'Подними качество существа до «Легендарный»',g:()=>[Math.max(...ownL().map(p=>mp(p.n).q)),4],st:100},
  {k:'run1',ic:'🧭',n:'В путь',t:'Начни Забег',g:()=>[META.stats.runs||0,1],st:10},
  {k:'boss3',ic:'👑',n:'Убийца боссов',t:'Победи 3 боссов в Забеге',g:()=>[META.stats.bosses||0,3],st:30},
  {k:'boss12',ic:'👑',n:'Гроза владык',t:'Победи 12 боссов в Забеге',g:()=>[META.stats.bosses||0,12],st:80},
  {k:'runw',ic:'🏁',n:'Три земли',t:'Пройди Забег',g:()=>[META.stats.runWins||0,1],st:60},
  {k:'asc3',ic:'🔺',n:'Восхождение',t:'Пройди Забег на сложности 🔺3',g:()=>[META.ascTop||0,3],st:80},
  {k:'asc10',ic:'🔥',n:'Без страха',t:'Пройди Забег на сложности 🔺10',g:()=>[(META.ascTop||0),10],st:300},
];
function achTrack(){const s=META.stats;s.kills=(s.kills||0)+(G.kills||0);
  if(CTX&&CTX.kind==='run'&&G.over==='win'){s.wins++;s.battles++;if(G.boss){s.bosses=(s.bosses||0)+1}}
  if(CTX&&CTX.kind==='run'&&G.over!=='win')s.battles++}
const achState=a=>{const[c,g]=a.g();return{c:Math.min(c,g),g,done:c>=g,cl:!!(META.ach&&META.ach[a.k])}};
const achReady=()=>ACH.filter(a=>{const s=achState(a);return s.done&&!s.cl}).length;
function renderAch(){const n=ACH.filter(a=>META.ach&&META.ach[a.k]).length;
  setApp(`<div class="top"><button class="pill sm" data-act="m-menu">‹ Меню</button><div class="title">Достижения</div><span class="m">💎 ${META.stones}</span></div><div class="msec" style="margin-top:2px">Профиль</div>${statsHtml()}<div class="msec">Достижения</div>
  <div class="m" style="font-size:12px;margin:-2px 0 6px">Получено ${n} из ${ACH.length}. За каждое дают камни 💎.</div><div class="qlist">${ACH.map(a=>{const s=achState(a);
    return`<div class="qst ${s.cl?'cl':''}"><span class="ach-ic">${a.ic}</span><span style="flex:1"><b>${a.n}</b><div class="m" style="font-size:11px">${a.t}</div><div class="xpb sm"><i style="width:${100*s.c/s.g}%"></i><span>${s.c}/${s.g}</span></div></span><span class="m" style="font-size:11px">💎${a.st}</span>${s.cl?'<span class="m">✓</span>':(s.done?`<button class="pill on" data-act="ac-${a.k}">Забрать</button>`:'')}</div>`}).join('')}</div>`)}
function achClick(act){
  if(act==='m-ach'){CTX=null;G={phase:'ach'};render();return true}
  if(act.startsWith('ac-')){const a=ACH.find(x=>x.k===act.slice(3));if(a){const s=achState(a);if(s.done&&!s.cl){META.ach=META.ach||{};META.ach[a.k]=1;META.stones+=a.st;saveMeta();toast(`${a.ic} ${a.n}: 💎 +${a.st}`)}}render();return true}
  return false}

