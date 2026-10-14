/* seeded random (Забег дня) */
function rngSeed(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function withSeed(seed,f){const o=Math.random;Math.random=rngSeed(seed);try{return f()}finally{Math.random=o}}
/* meta save */
const META_KEY='packBattleMeta1';
const START_UNLOCK=['Медведь','Волк','Олень','Лиса','Сова','Дубовик','Лотосовик','Пчела','Грифон','Солнечник'];
const syncRar=()=>{for(const p of PETS)p.rar=META&&META.pets[p.n]?META.pets[p.n].q||0:0};
const rarC=p=>GRADE[p.rar??2].c;
const RENAMED={'Древень':'Дубовик','Кактус':'Колючник','Лотос':'Лотосовик','Мухоловка':'Мухолов','Подсолнух':'Солнечник','Глыба':'Голем','Пламень':'Огневик','Родник':'Водяной','Вихрь':'Вихрик','Молния':'Искрун','Глаз':'Глазун'};
let META;
function loadMeta(){try{META=JSON.parse(localStorage.getItem(META_KEY))}catch(e){META=null}
  if(!META||!META.pets)META={pets:{},stones:0};
  for(const a in RENAMED)if(META.pets[a]&&!META.pets[RENAMED[a]]){META.pets[RENAMED[a]]=META.pets[a];delete META.pets[a]}
  for(const p of PETS){META.pets[p.n]=META.pets[p.n]||{xp:0,fr:0,gr:0,un:START_UNLOCK.includes(p.n)}}}
function saveMeta(){try{localStorage.setItem(META_KEY,JSON.stringify(META))}catch(e){}}
loadMeta();syncRar();
const GRADE=[{n:'Обычный',c:'#C9CED6'},{n:'Необычный',c:'#6FD38A'},{n:'Редкий',c:'#5AA9F0'},{n:'Эпический',c:'#B07CF0'},{n:'Легендарный',c:'#F2A64A'}];
let CTX=null; // {kind:'run'|'lair'|'rank'|'puz', ...}
let NEXT=null; // {enemy:[defs], ai, fact, bossK, mod}
/* faction rules hook, called at turn start */
function factionTurn(){const f=G.fact;if(!f)return;const B=G.B,P=G.P;
  if(f==='poach'&&G.turn>1){const cand=[];for(const p of alive(P))for(const d of [[0,1],[0,-1],[1,0],[-1,0]]){const r=p.r+d[0],c=p.c+d[1];if(inb(r,c)&&!petAt(P,r,c)&&!P.traps.some(x=>x.r===r&&x.c===c))cand.push([r,c])}
    if(cand.length){const[r,c]=cand[Math.floor(Math.random()*cand.length)];P.traps.push({r,c,turns:2,dmg:2*K,ic:'🪤'});G.log.push('Браконьеры ставят капкан.')}}
  if(f==='cult'&&G.turn>1){G.ritual=(G.ritual||0)+1;if(G.ritual>=6){G.ritual=0;for(const p of alive(P)){BST_A=null;hit(P,p,3*K)}G.log.push(`<b>Ритуал свершился</b>: все твои петы получают ${3*K} урона.`);checkOver()}}
  if(f==='alch'&&G.turn>1){let bk=null;for(const k of ELS)if(P.pool[k]>0&&(!bk||P.pool[k]>P.pool[bk]))bk=k;if(bk){P.pool[bk]--;G.log.push(`Алхимики крадут 1 ${ELN[bk].toLowerCase()}.`)}}
  if(f==='order')for(const p of alive(B))if(p.r===0)p.shield=Math.max(p.shield,2*K);
}
function factionBar(){const f=G.fact&&FACT[G.fact];if(!f)return'';return`<div class="fbar">${f.ic} <b>${f.n}</b>: ${f.rule}${G.fact==='cult'?` <b>Ритуал ${G.ritual||0}/6</b>`:''}</div>`}
