const ROWS=3,COLS=5,START=[[1,1],[0,2],[2,1],[1,3],[2,3]];
const MAXPLAY=99,CAP=10;
// 0.32.0 growth: all hp-type numbers ×3 (SC). K is the runtime unit of flat effects (auras, burn, storm), = old 2 × SC.
// Сила: a creature number (20 at level 1), cards deal % of it; base card numbers are written for Сила 20.
const SC=3,K=2*SC,SILA0=20;
const SCF=['dmg','heal','shield','hpcost','chain','exec','grow']; // card fields in hp units (scaled ×SC at load)
const lvGrow=lv=>1+.015*((lv||1)-1);
// effective Сила of a creature: its base (grows with level) × 20% per bonus point (elites, talismans, boss phases)
const silaOf=c=>c?(c.sila||SILA0)*(1+.2*(c.pw||0)):SILA0;
// healing from a card: Сила, and +25% for a Legendary healer
const hlv=(c,v)=>v?Math.round(sm(c,v)*(c&&c.leg&&c.cls==='healer'?1+LEGV.heal:1)):0;
// flat effects (auras, family passives, burn, reflect) grow with the creature's level like its cards do
// class aura strengths (balance knobs): fox only boosts single-target hits when foxST
const AURAV={foxST:1,bat:1,frog:1,hog:1};
const kl=(p,m=1)=>Math.max(1,Math.round(m*K*(p&&p.sila?p.sila/SILA0:1)));
const sm=(c,v)=>v?Math.max(1,Math.round(v*silaOf(c)/SILA0)):0;
const ELS=['f','w','e','a','l','d','n','z'];const z0=()=>Object.fromEntries(ELS.map(k=>[k,0]));
const ELN={f:'Огонь',w:'Вода',e:'Земля',a:'Воздух',l:'Свет',d:'Тьма',n:'Порядок',z:'Хаос',r:'Самая бедная стихия'};
const OFF=new Set(['cell','hline','row','col','cross','sq2','melee','enemies']);
const DEF=new Set(['self','ally','allies']);
const STEP=new Set(['step']);
const AUTO=new Set(['enemies','self','allies']);
const AREA={row:'весь ряд',cell:'одна клетка',hline:'линия из 3 клеток',col:'весь столбец',cross:'крест',sq2:'квадрат 2×2',melee:'ближайший враг в выбранном столбце',enemies:'все враги',self:'на себя',ally:'свой пет',allies:'все свои',step:'по схеме карты'};
const T={
  // enemy cards: factions (h_), the golem boss (b_) and a few older ones they still use. Pet cards are built from CT below.
  acid:{n:"Кислота",cost:{e:1,any:1},spd:2,area:"cross",dmg:4,strip:1,burn:1,sub:{draw:1,short:"рука +1",txt:"Лимит руки +1 на следующий ход."},el:"e",dg:"w"},
  b_fall:{n:"Камнепад",cost:{},spd:2,area:"sq2",dmg:6,burn:2,el:"e"},
  b_fist:{n:"Каменный кулак",cost:{},spd:3,area:"cross",dmg:6,burn:2,el:"e"},
  b_quake:{n:"Землетрясение",cost:{},spd:1,area:"enemies",dmg:4,burn:2,el:"e"},
  b_shard:{n:"Осколок",cost:{},spd:4,area:"summon",txt:"Призывает Осколок (5 хп). Пока Осколки живы, голем в начале хода получает щит 1 за каждый. Не больше двух.",burn:2,el:"e"},
  b_skin:{n:"Каменная кожа",cost:{},spd:5,area:"self",shield:10,burn:2,el:"e"},
  h_aimed:{n:"Прицельный",cost:{a:1,any:1},spd:2,area:"cell",dmg:10,burn:1,el:"a"},
  h_bait:{n:"Приманка",cost:{e:1},spd:5,area:"cell",trap:{dmg:8,ic:"🍖"},burn:2,el:"e"},
  h_banner:{n:"Знамя",cost:{f:1},spd:5,area:"allies",shield:2,cleanse:1,burn:2,el:"f"},
  h_bite:{n:"Хватка гончей",cost:{},spd:4,area:"melee",dmg:6,burn:2,el:"f"},
  h_bless:{n:"Благословение",cost:{},spd:5,area:"allies",shield:2,burn:2,el:"l"},
  h_bolt:{n:"Болт",cost:{a:1},spd:4,area:"cell",dmg:8,burn:2,el:"a"},
  h_bomb:{n:"Бомба",cost:{e:1,any:1},spd:2,area:"cross",dmg:6,burn:1,el:"e"},
  h_chant:{n:"Песнопение",cost:{},spd:2,area:"allies",heal:4,burn:2,el:"d"},
  h_chase:{n:"Погоня",cost:{f:1},spd:4,area:"cell",dmg:6,mark:2,burn:2,el:"f"},
  h_club:{n:"Дубина",cost:{},spd:3,area:"melee",dmg:8,burn:2,el:"e"},
  h_curse:{n:"Проклятие",cost:{d:1},spd:3,area:"cell",dmg:4,ign:3,burn:2,el:"d"},
  h_decree:{n:"Указ",cost:{l:1,any:1},spd:1,area:"enemies",dmg:4,stun:1,burn:1,el:"l"},
  h_drainS:{n:"Иссушение",cost:{d:1},spd:3,area:"melee",dmg:6,drain:1,burn:2,el:"d"},
  h_elixir:{n:"Эликсир",cost:{w:1,any:1},spd:3,area:"allies",heal:4,shield:2,burn:1,el:"w"},
  h_flask:{n:"Колба",cost:{w:1},spd:3,area:"sq2",dmg:4,ign:2,burn:2,el:"w"},
  h_knife:{n:"Нож",cost:{},spd:4,area:"melee",dmg:6,burn:2,el:"e"},
  h_lance:{n:"Копьё",cost:{e:1,any:1},spd:2,area:"melee",dmg:10,burn:1,el:"e"},
  h_mend:{n:"Исцеление",cost:{l:1},spd:4,area:"ally",heal:8,cleanse:1,burn:2,el:"l"},
  h_netthrow:{n:"Бросок сети",cost:{e:1},spd:4,area:"cell",dmg:4,root:2,burn:2,el:"e"},
  h_order:{n:"Приказ",cost:{f:1},spd:5,area:"allies",shield:4,burn:2,el:"f"},
  h_pierce:{n:"Пробивающий",cost:{a:1,any:1},spd:2,area:"col",dmg:6,strip:1,burn:1,el:"a"},
  h_potion:{n:"Зелье",cost:{},spd:4,area:"ally",heal:8,burn:2,el:"w"},
  h_punch:{n:"Удар поршнем",cost:{z:1},spd:2,area:"melee",dmg:8,burn:2,el:"z"},
  h_rally:{n:"Сплочение",cost:{f:1,any:1},spd:3,area:"allies",heal:4,burn:1,el:"f"},
  h_rift:{n:"Разлом",cost:{d:1,any:1},spd:1,area:"enemies",dmg:4,ign:1,burn:1,el:"d"},
  h_shieldwall:{n:"Стена щитов",cost:{e:1,any:1},spd:5,area:"allies",shield:4,burn:1,el:"e"},
  h_shot:{n:"Выстрел",cost:{a:1},spd:4,area:"col",dmg:6,burn:2,el:"a"},
  h_slash:{n:"Рубящий удар",cost:{e:1},spd:3,area:"hline",dmg:6,burn:2,el:"e"},
  h_smite:{n:"Кара",cost:{l:1,any:1},spd:2,area:"col",dmg:6,burn:1,el:"l"},
  h_snare:{n:"Капкан",cost:{},spd:5,area:"cell",trap:{dmg:6,ic:"🪤"},burn:2,el:"e"},
  h_stab:{n:"Удар в спину",cost:{},spd:5,area:"cell",dmg:8,exec:4,burn:2,el:"d"},
  h_volley:{n:"Залп",cost:{a:1,any:1},spd:2,area:"row",dmg:4,burn:1,el:"a"},
  h_whip:{n:"Кнут",cost:{f:1,any:1},spd:3,area:"hline",dmg:6,stun:1,burn:1,el:"f"},
  h_wrench:{n:"Ключ",cost:{},spd:3,area:"melee",dmg:6,burn:2,el:"e"},
  h_zap:{n:"Разряд",cost:{z:1,any:1},spd:3,area:"hline",dmg:4,stun:1,burn:1,el:"z"},
  howl:{n:"Вой",cost:{},spd:5,area:"allies",shield:2,burn:2,sub:{draw:1,short:"рука +1",txt:"Лимит руки +1 на следующий ход."},el:"a",dg:"a"},
  nightj:{n:"Прыжок из тьмы",cost:{a:1,any:1},spd:3,area:"cross",dmg:4,mark:2,burn:1,sub:{draw:1,short:"рука +1",txt:"Лимит руки +1 на следующий ход."},el:"a",dg:"a"},
  shadow:{n:"Тень",cost:{},spd:5,area:"self",evade:2,burn:2,sub:{markCol:2,short:"метка ближайшему",txt:"Метка на 2 хода ближайшему врагу в столбце."},el:"d",dg:"d"},
  shellS:{n:"Раковина",cost:{e:1},spd:5,area:"allies",shield:2,burn:2,sub:{colDmg:2,short:"2 урона ближайшему в столбце",txt:"2 урона ближайшему врагу в столбце этого пета."},el:"e",dg:"e"},
  thick:{n:"Толстокожесть",cost:{},spd:5,area:"self",shield:8,burn:2,sub:{colDmg:2,short:"2 урона ближайшему в столбце",txt:"2 урона ближайшему врагу в столбце этого пета."},el:"e",dg:"e"},
};
const PETS=[];
// Initiative 1–100: after both sides plan, every played half (▲ or ▼) fires in initiative order, 1 first; on a tie ▼ goes before ▲.
// ▲: card data keeps a 1–5 tempo (spd, 5 = fast), initiative is 90…10 by tempo plus a fixed per-card spread, so ties are rare.
// ▼: its own number 5–60 per card (▼ used to always fire first, so it stays mostly early).
// One tempo step = INI_STEP: effects that made a card "1 faster" now take 20 off its initiative.
const INI_STEP=20;
function cardIni(k){const t=T[k];if(t.ini==null){const b=k.replace(/\+$/,'');let h=0;for(const ch of b)h=(h*31+ch.charCodeAt(0))%9973;t.ini=Math.max(1,Math.min(100,(6-t.spd)*INI_STEP-10+h%19-9))}return t.ini}
function cardIniDn(k){const t=T[k];if(t.iniD==null){const b=k.replace(/\+$/,'');let h=7;for(const ch of b)h=(h*37+ch.charCodeAt(0))%10007;t.iniD=5+h%56}return t.iniD}
const MV={
  diag:{t:'по диагонали на 1 клетку',d:[[-1,-1],[-1,1],[1,-1],[1,1]]},
  orth:{t:'по прямой на 1 клетку',d:[[0,-1],[0,1],[-1,0],[1,0]]},
  king:{t:'на 1 клетку в любую сторону',d:[[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[-1,1],[1,-1],[1,1]]},
  knight:{t:'буквой Г, как шахматный конь, перелетая через всех',d:[[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]]},
  diag2:{t:'по диагонали на 1 или 2 клетки',d:[[-1,-1],[-1,1],[1,-1],[1,1],[-2,-2],[-2,2],[2,-2],[2,2]]},
  side:{t:'вбок на 1 или 2 клетки, как краб',d:[[0,-1],[0,1],[0,-2],[0,2]]},
  none:{t:'не двигается',d:[]},
  rook2:{t:'по прямой на 1 или 2 клетки',d:[[0,-1],[0,1],[-1,0],[1,0],[0,-2],[0,2],[-2,0],[2,0]]},
};
// battle speed ×1/×2/×3 (Опции, saved) and a tap during the turn skips the rest of its animation
const spdNow=()=>typeof META!=='undefined'&&META&&META.spd||1;
function fxRate(){try{const v=ui.skip?16:spdNow();for(const a of document.getAnimations()){const t=a.effect&&a.effect.target;if(t&&t.closest&&(t.closest('#fxl')||t.classList.contains('av')))a.playbackRate=v}}catch(e){}}
const sleep=ms=>new Promise(r=>{fxRate();setTimeout(r,ui.skip?0:ms/spdNow())});
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const inb=(r,c)=>r>=0&&r<ROWS&&c>=0&&c<COLS;
const sumv=o=>Object.values(o||{}).reduce((a,b)=>a+b,0);

// 0.34 two full halves: helpers live here so every later file can call them (more in 83-halves.js)
const HV=()=>!(typeof CTX!=='undefined'&&CTX&&CTX.kind==='puz');
const DNK={};
// the ▼ action of a card, shown as a card of its own (key "<card>~dn"): the old ▼ effect as it was, no target to pick.
// Шаг has no ▼ action yet (Anton decides).
function dnKey(k){
  if(k in DNK)return DNK[k];const t=T[k];let d=null;
  if(t&&t.sub&&!STEP.has(t.area)){const s=t.sub;d={n:t.n,el:t.el,cost:{},spd:t.spd,scaled:1,dtx:s.txt};
    if(s.colDmg){d.area='melee';d.reach=0;d.dmg=s.colDmg}else if(s.frontDmg){d.area='row';d.dmg=s.frontDmg}
    else if(s.markCol){d.area='melee';d.reach=0;d.mark=s.markCol}else if(s.heal){d.area='self';d.heal=s.heal}
    else if(s.shield){d.area='self';d.shield=s.shield}else if(s.evade){d.area='self';d.evade=s.evade}
    else if(s.allHeal){d.area='allies';d.heal=s.allHeal}else if(s.allShield){d.area='allies';d.shield=s.allShield}
    else if(s.draw){d.area='self';d.draw=s.draw;if(s.dur)d.dur=s.dur}else d=null}
  // 0.35: a ▼ may carry a step (stD); a card with a step but no ▼ effect gets a ▼ that is only the step
  if(t&&t.stD){if(!d)d={n:t.n,el:t.el,cost:{},spd:t.spd,scaled:1,area:'self',dtx:'',only:1};d.stp=t.stD}
  let dk=null;if(d){dk=k+'~dn';d.dnOf=k;T[dk]=d}
  return DNK[k]=dk}
const dnT=k=>{const d=dnKey(k);return d?T[d]:null};
const HAND_BASE=5,HAND_MAX=9;
// 0.34: the hand refills to living pets + 1 (bosses and puzzles keep 5)
const handSize=S=>Math.min(HAND_MAX,(HV()&&!S.boss&&S.pets?S.pets.filter(p=>p.alive&&!p.tok).length+1:HAND_BASE)+(S.hb||0)+S.lim.reduce((a,x)=>a+x.n,0));
const healAmt=h=>G.stormAt?Math.ceil(h/2):h;
const STORM=12,SHIELD_CAP=5*K,INCOME=1,STARTP=2;
const cst=(t,k)=>k==='burn'?t.ign||0:t[k]||0;
const sv=(p,k)=>(p&&p.st&&p.st[k])||0;
const noMove=p=>p.frozen>0||sv(p,'root')>0||!!p.down;
const noAct=p=>p.frozen>0||sv(p,'stun')>0;
const NEG=['stun','root','slow','burn','mark'];
const STN={stun:'оглушение',root:'сковывание',slow:'замедление',burn:'поджог',immune:'иммунитет',mark:'метка',evade:'уклонение'};
const STI={stun:'💫',root:'⛓',slow:'🐌',burn:'🔥',immune:'✨',mark:'🎯',evade:'💨'};
const STD={stun:'его карты не играются вверх ▲, но вниз ▼ можно, и двигать пета тоже можно',tough:'оглушить или заморозить его нельзя. Появляется на 2 хода, когда оглушение или заморозка заканчивается',root:'его нельзя двигать',slow:'инициатива его карт +40, они срабатывают позже',burn:'теряет '+K+' здоровья в конце хода',ghost:'нежить: погиб, но до конца следующего хода остаётся в бою. Урона не получает, его карты играются',down:'механизм: отключён до конца хода, его карты не срабатывают. Со следующего хода вернётся с 10% здоровья',mark:'следующий удар по нему на '+2*K+' сильнее',immune:'плохие эффекты на него не действуют',evade:'следующий удар по нему промахнётся',frozen:'не двигается, и его карты не играются вверх ▲, но вниз ▼ можно',shield:'поглощает урон'};
const hz=n=>n+' '+(n%10===1&&n%100!==11?'ход':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'хода':'ходов');
function petFx(p){const l=[];if(!p)return l;if(p.frozen>0)l.push({k:'frozen',ic:'❄️',n:'заморозка',v:p.frozen,neg:1});
  if(p.st)for(const k in p.st)if(p.st[k]>0)l.push({k,ic:STI[k],n:STN[k],v:p.st[k],neg:NEG.includes(k)?1:0});
  if(p.tough>0)l.push({k:'tough',ic:'💪',n:'стойкость',v:p.tough,neg:0});if(p.down)l.push({k:'down',ic:'⚙️',n:'отключён',v:p.ghost,neg:1});else if(p.ghost)l.push({k:'ghost',ic:'👻',n:'призрак',v:p.ghost,neg:0});if(p.shield)l.push({k:'shield',ic:'🛡',n:'щит',v:p.shield,neg:0,amt:1});return l.sort((a,b)=>b.neg-a.neg)}
const FXL=[['frozen','❄️','заморозка',1],['stun','💫','оглушение',1],['root','⛓','сковывание',1],['slow','🐌','замедление',1],['burn','🔥','поджог',1],['mark','🎯','метка',1],['tough','💪','стойкость',0],['shield','🛡','щит',0],['evade','💨','уклонение',0],['immune','✨','иммунитет',0],['ghost','👻','призрак',0],['down','⚙️','отключён',1]];
const fxLegend=()=>FXL.map(([k,ic,n,neg])=>`<div class="fxr ${neg?'ng':'ps'}"><span class="fxi">${ic}</span><span><b>${n[0].toUpperCase()+n.slice(1)}</b><br><span class="m">${STD[k]}</span></span></div>`).join('');
function fxSheet(){
  let now='';
  if(G&&G.P&&G.phase!=='pick'){const row=(S,who)=>alive(S).filter(p=>petFx(p).length).map(p=>`<div class="fxnow"><span>${petIc(p,1)}</span><span class="m">${who}</span>${petFx(p).map(f=>`<span class="bd ${f.neg?'ng':'ps'}">${f.ic}${f.v}</span>`).join('')}</div>`).join('');
    const r=row(G.P,'твой')+row(G.B,'враг');if(r)now=`<h3>Сейчас в бою</h3>${r}`}
  return`<div class="over" data-act="fxs-close"><div class="box hintbox"><div style="display:flex;align-items:center;justify-content:space-between"><h2 style="margin:0">Эффекты</h2><button class="pill sm" data-act="fxs-close">✕</button></div>
  <div class="m">Красные плохие, зелёные хорошие. Число у пета: сколько ходов эффект ещё действует, у щита: сколько урона он поглотит.</div>${now}<h3>Все эффекты</h3>${fxLegend()}</div></div>`;
}
const fxLine=f=>`<div class="fxr ${f.neg?'ng':'ps'}"><span class="fxi">${f.ic}</span><span><b>${f.n[0].toUpperCase()+f.n.slice(1)}</b> ${f.amt?f.v:'· ещё '+hz(f.v)}<br><span class="m">${STD[f.k]}</span></span></div>`;
const TOUGH=2;const ccOn=p=>p.frozen>0||sv(p,'stun')>0;const ccBlock=p=>p.tough>0||ccOn(p);
function canSt(p,k){if(!p||!p.alive||p.ghost)return false;if(k==='stun'&&ccBlock(p))return false;if(NEG.includes(k)){if(sv(p,'immune')>0)return false;if(p.sz&&(k==='stun'||k==='root'))return false;}return true}
function applySt(p,k,n){if(!canSt(p,k))return false;p.st=p.st||{};p.st[k]=Math.max(sv(p,k),n);if(k==='burn'&&typeof BST_A!=='undefined'&&BST_A)p.burnBy=BST_A;return true}
function cleanse(p){let n=0;if(p.st)for(const k of NEG)if(p.st[k]){if(k==='stun')p.tough=TOUGH;delete p.st[k];n++}if(p.frozen){p.frozen=0;p.tough=TOUGH;n++}return n}
const addShield=(p,v)=>{p.shield=Math.min(SHIELD_CAP,p.shield+v)};
let G,ui={sel:null,mover:null,hover:null,busy:false,flash:null,fx:{},rules:false};

function mkSide(bot,team,pos){
  const defs=team.map(pi=>typeof pi==='object'?pi:PETS[pi]);
  const pets=defs.map((p,i)=>{let hp=p.hp,cards=p.cards;
    const o={id:(bot?'b':'p')+i,n:p.n,ic:p.ic,au:p.au,els:p.els||cardEls(cards),fam:p.fam,cls:p.cls,pw:p.pw||0,sila:Math.round(SILA0*lvGrow(p.lv)*10)/10,leg:(p.q||0)>=4,sp:p.sp||0,max:hp,hp,base:hp,mv:p.mv,r:pos[i][0],c:pos[i][1],shield:0,frozen:0,alive:true,cards,boss:p.boss,lv:p.lv,q:p.q,pi:p.pi!=null?p.pi:(typeof team[i]==='number'?team[i]:null)};
    if(o.leg&&o.cls==='guard')o.shield=Math.round(hp*LEGV.guard);if(o.leg&&o.cls==='agile')o.st={evade:9};
    return o});
  let u=0;const deck=[];
  pets.forEach(p=>p.cards.forEach(t=>deck.push({uid:(bot?'B':'P')+(u++),t,pet:p.id})));
  if(!HV())pets.forEach(()=>deck.push({uid:(bot?'B':'P')+(u++),t:'step',pet:null})); // 0.35: no Шаг cards in the deck, steps live on the cards (puzzles keep them)
  return {bot,pets,pool:startPool(pets),deck:shuffle(deck),hand:[],discard:[],plan:[],lim:[],gen:z0(),traps:[]};
}
let VS='pack',AI='auto';
const BOSS_DECK=['b_fist','b_fist','b_fall','b_fall','b_quake','b_skin','b_skin','b_shard','b_shard'];
function smartPlace(defs,n){
  // try many layouts: neighbours boost each other, sturdy pets in front, fragile ones behind
  let best=null,bs=-1e9;const N=ROWS*COLS;
  for(let it=0;it<260;it++){const cells=shuffle([...Array(N).keys()]).slice(0,n).map(k=>[Math.floor(k/COLS),k%COLS]);let sc=0;
    for(let i=0;i<n;i++){const d=defs[i],[r,c]=cells[i];let nb=0;for(let j=0;j<n;j++)if(j!==i&&Math.abs(cells[j][0]-r)+Math.abs(cells[j][1]-c)===1)nb++;
      sc+=Math.min(nb,3)*(HK.nbw??1.2);const sturdy=d.hp>=16*K||d.role==='def',frag=d.hp<=12*K||d.role==='sup';
      if(r===0)sc+=(sturdy?1.5:frag?-1.5:0)*(HK.fw??1);if(r===ROWS-1)sc+=(frag?1:0)*(HK.fw??1);
      const melee=(d.cards||[]).filter(k=>T[k]&&T[k].area==='melee').length;sc+=melee*(r===0?.5:-.2)*(HK.fw??1)}
    const colsUsed=new Set(cells.map(x=>x[1])).size;sc+=colsUsed*(HK.cw??.3);
    if(sc>bs){bs=sc;best=cells}}
  return best}
function newGame(){
  ui.bst=false;for(const k in lastPos)delete lastPos[k];
  const bt=shuffle(petPool()).slice(0,5),cells=shuffle([...Array(ROWS*COLS).keys()]).slice(0,5).map(k=>[Math.floor(k/COLS),k%COLS]);
  const nx=NEXT;NEXT=null;let eTeam=bt,eAI=AI,boss=VS==='boss'&&!CTX||!!(CTX&&CTX.kind==='lair');
  if(nx){eTeam=nx.enemy||nx.enemyIdx||bt;eAI=nx.ai||AI;if(eTeam.length!==5)cells.length=eTeam.length;while(cells.length<eTeam.length){const k=Math.floor(Math.random()*ROWS*COLS),rc=[Math.floor(k/COLS),k%COLS];if(!cells.some(x=>x[0]===rc[0]&&x[1]===rc[1]))cells.push(rc)}}
  if(eAI==='hard'||eAI==='smart'||eAI==='master'||HK.smartAll||eAI==='auto'&&autoLv()>=5){const dd=eTeam.map(x=>typeof x==='object'?x:PETS[x]);const sp=smartPlace(dd,eTeam.length);cells.length=0;cells.push(...sp)}
  const useM=metaMode()&&!sandbox();if(useM&&!nx&&!boss&&!CTX)eTeam=mirrorTeam(eTeam);
  const isRun=CTX&&CTX.kind==='run'&&META.run;if(isRun)META.run.place=(PLACE||START).map(x=>[...x]);
  const PT=isRun?META.run.team.map(runDef):useM?TEAM.map(myDef):TEAM,PP=PLACE||START;const rb=isRun&&nx&&nx.bossK;if(rb)boss=true;
  G={phase:'battle',turn:0,P:mkSide(false,PT,PP),B:rb?mkBossX(nx.bossK,hpAsc(META.run)*(META.run.asc>=7?1.2:1)):boss?(CTX&&CTX.kind==='lair'?mkLair(CTX):mkBossX(QBOSS,qbMult())):Object.assign(mkSide(true,eTeam,cells),{ai:eAI}),boss,over:null,log:[],stormAt:0,fact:nx&&nx.fact};
  ui.sel=null;ui.info=null;ui.card=null;ui.seen=new Set();ui.deaths=[];ui.mover=null;ui.busy=false;ui.flash=null;ui.fx={};
  if(isRun){G.run=true;G.emod=nx&&nx.mod}
  startTurn();
  if(isRun){runBattleStart(nx);anyPlan(G.B,G.P);render()}
  if(G.B.bk)cdxMark('boss',G.B.bk);if(G.emod)cdxMark('el',G.emod);
  if(!SIMU&&CTX&&CTX.kind==='rank'){rk().pend=1;saveMeta()}
  if(!SIMU&&!CTX&&!sandbox()&&Array.isArray(TEAM)&&TEAM.every(x=>typeof x==='number')){META.lastQ=TEAM.slice();META.lastQP=(PLACE||START).map(x=>[...x]);saveMeta()}
  ui.bIntro=!SIMU&&G.B.bk&&!(CTX&&CTX.kind==='puz')?G.B.bk:null;
  if(!SIMU)ui.auto=!!META.autoOn&&!(CTX&&CTX.kind==='puz');// Auto stays on from fight to fight until the player turns it off
}
const other=S=>S===G.P?G.B:G.P;
const pet=(S,id)=>S.pets.find(p=>p.id===id);
const petAt=(S,r,c)=>S.pets.find(p=>p.alive&&(p.sz?r>=p.r&&r<p.r+p.sz&&c>=p.c&&c<p.c+p.sz:p.r===r&&p.c===c));
const alive=S=>S.pets.filter(p=>p.alive);
function capPool(pool){while(sumv(pool)>CAP){let bk=ELS[0];for(const k of ELS)if(pool[k]>pool[bk])bk=k;pool[bk]--}}
// the poorest of the team's elements; a tie goes to the first one in ELS order (0.33.0: known in advance, never random)
const leastOf=(pool,l)=>{const a=l&&l.length?l:ELS;let m=Infinity;for(const e of a)if(pool[e]<m)m=pool[e];return a.find(e=>pool[e]===m)};
const stepEl=S=>leastOf(S.pool,needEls(S));
function draw(S,n){
  if(S.deck.length<n&&S.discard.length){S.deck=shuffle(S.discard).concat(S.deck);S.discard=[]}
  for(let i=0;i<n&&S.deck.length;i++){
    const c=S.deck.pop();
    if(S.hand.length<handSize(S)){S.hand.push(c);continue}
    const b=burnVal(S,c),bel=b.el==='r'?stepEl(S):b.el;S.pool[bel]+=b.n;S.discard.push(c);
    G.log.push(`${S.bot?'<span class="op">Соперник:</span>':'<span class="me">Ты:</span>'} рука полна, «${T[c.t].n}» сгорает за +${b.n} ${ELN[bel].toLowerCase()}.`);
  }
}

const isAtk=c=>{const t=T[c.t];return !!(t.dmg||t.trap)};
function ensureAttack(S){
  if(!S.hand.length||S.hand.some(isAtk))return;
  let i=S.deck.findIndex(isAtk);
  if(i<0){const j=S.discard.findIndex(isAtk);if(j<0)return;S.deck.unshift(S.discard.splice(j,1)[0]);i=0}
  const a=S.deck.splice(i,1)[0],k=S.hand.findIndex(c=>!STEP.has(T[c.t].area));
  S.deck.unshift(S.hand.splice(k<0?0:k,1,a)[0]);
}
function startTurn(){ui.queue=null;ui.qi=-1;
  G.turn++;
  if(G.boss&&(!G.B.bk||BOSSES[G.B.bk].golem)){const b=G.B.pets[0];b.weak=[b.r+Math.floor(Math.random()*2),b.c+Math.floor(Math.random()*2)]}
  factionTurn();if(G.run||G.B.bk)runTurnHook();
  for(const S of [G.P,G.B]){
    if(INCOME&&!S.boss&&G.turn>1){const els=needEls(S);for(let i=0;i<INCOME&&els.length;i++){let bk=els[0];for(const k of els)if(S.pool[k]<S.pool[bk])bk=k;S.pool[bk]+=1+(S.incB||0);S.inc=bk}}
    for(const c of S.hand){const t=T[c.t];if(t.grow)c.ch=Math.min(4*K,(c.ch||0)+t.grow)}
    capPool(S.pool);
    draw(S,Math.max(0,handSize(S)-S.hand.length));ensureAttack(S);S.lim=S.lim.map(x=>({...x,t:x.t-1})).filter(x=>x.t>0);capPool(S.pool);S.plan=[];
  }
  anyPlan(G.B,G.P);
  ui.sel=null;ui.mover=null;
  render();
}

function avail(S){const a={...S.pool};for(const e of S.plan)if(e.paid)for(const k of ELS)a[k]-=e.paid[k];return a}
// v30: Приток feeds only elements the living pets' cards actually cost
const needEls=S=>{const s=new Set();for(const q of alive(S))for(const k of (q.cards||[]))for(const e in (T[k]&&T[k].cost)||{})s.add(e);if(!s.size)for(const q of alive(S))q.els.forEach(e=>s.add(e));return ELS.filter(e=>s.has(e))};
function demonPay(S,card){
  const c=card.pet?pet(S,card.pet):null;if(!c||c.fam!=='demon'||!c.alive||c.ghost)return null;
  const cs=costOf(S,card),a=avail(S),paid=z0();let miss=0;
  for(const k of ELS){const v=cs[k]||0,u=Math.min(v,Math.max(0,a[k]));a[k]-=u;paid[k]+=u;miss+=v-u}
  if(!miss)return paid;
  const hp=miss*kl(c,2),used=S.plan.filter(e=>e.paid&&e.paid.hp&&e.card&&e.card.pet===c.id).reduce((x,e)=>x+e.paid.hp,0);
  if(c.hp-used-hp<1)return null;paid.hp=hp;return paid}
const payCard=(S,card)=>pay(avail(S),costOf(S,card))||demonPay(S,card);
function pay(av,cost){
  const a={...av},paid=z0();
  let short=0;for(const k of ELS){const v=cost[k]||0,u=Math.min(v,a[k]);a[k]-=u;paid[k]+=u;short+=v-u}
  if(short)return null;
  return paid;
}
const AUB={hog:"🛡",fox:"⚔️",frog:"💚",bat:"💨",owl:"🔮",boss:"✶",shard:"🪨"},AUS={hog:"щит соседям",fox:"+2 урона соседям",frog:"лечит соседей",bat:"соседи раньше",owl:"соседям ▼ +1",boss:"уязвимое место",shard:"щит голему"};
const AURA={hog:"в начале хода соседи получают щит 2, если щита меньше",fox:"удары соседей по одной цели наносят +2 урона",frog:"в конце хода соседи лечатся на 2",bat:"инициатива карт соседей −20",owl:"карты соседей, ушедшие в сброс несыгранными, дают на 1 стихию больше",boss:"клетка со знаком ✶ это уязвимое место: удар по ней наносит двойной урон. Каждый ход место меняется. Лёд и толчок на голема не действуют",shard:"пока Осколок жив, голем в начале хода получает щит 1",tok:"призванное существо, ничего не усиливает"};
const petEls=q=>q.els;const cardEls=cards=>ELS.filter(e=>cards.some(k=>T[k]&&T[k].el===e));
const FAM={};
const nbrs=(S,p)=>alive(S).filter(q=>q!==p&&Math.abs(q.r-p.r)+Math.abs(q.c-p.c)===1);
const hasAura=(S,p,k)=>!!p&&nbrs(S,p).some(q=>q.au===k);
// what the side's pool will be after this turn's plan (costs paid, ▼ and card gains added), optionally without one card's entry
function projPool(S,skip){const p=avail(S),need=needEls(S);
  // 0.34: a played ▼ gives nothing; every card left in hand goes to the discard and gives its elements
  if(HV()){let r=0;for(const c of S.hand){if(c===skip||S.plan.some(e=>e.card===c))continue;if(c.t==='step'){r++;continue}const b=burnVal(S,c);p[b.el]+=b.n}for(let i=0;i<r;i++)p[leastOf(p,need)]++}
  for(const e of S.plan){if(e.card===skip)continue;
  if(e.kind==='burn'&&!HV())p[e.el==='r'?leastOf(p,need):e.el]+=e.n;else if(e.card&&T[e.card.t].gen)for(const k in T[e.card.t].gen)p[k]+=T[e.card.t].gen[k]}return p}
// Шаг ▼ gives the poorest element, picked when you plan it and shown on the card; Приток goes to the poorest element after the turn
const stepPick=(S,card)=>leastOf(projPool(S,card),needEls(S));
const incNext=S=>leastOf(projPool(S),needEls(S));
const burnVal=(S,card)=>{if(card.t==='step')return{el:G&&S.pool?stepPick(S,card):'r',n:1+(G&&G.run&&S===G.P&&hasT('lightstep')?1:0)};const p=card.pet?pet(S,card.pet):null;return{el:T[card.t].dg||T[card.t].el||'a',n:T[card.t].burn+(hasAura(S,p,'owl')?1:0)+(p&&p.fam==='elem'?1:0)}};
const maxPlay=S=>S.maxPlay||MAXPLAY;
const cardsPlanned=S=>S.plan.filter(e=>e.kind==='card').length;
const costOf=(S,card)=>T[card.t].cost;
function whyInfo(S,card){
  const t=T[card.t],c=card.pet?pet(S,card.pet):null;
  if(c&&!c.alive)return{ic:'💀',tx:'пал',long:c.n+' пал.'};
  if(c&&noAct(c)&&!STEP.has(t.area))return c.frozen>0?{ic:'❄️',tx:'заморожен',long:c.n+' заморожен ещё '+hz(c.frozen)+': не двигается, и его карты не играются вверх ▲, но вниз ▼ можно.'}:{ic:'💫',tx:'оглушён',long:c.n+' оглушён ещё '+hz(sv(c,'stun'))+': его карты не играются вверх ▲, но вниз ▼ можно, и двигать пета тоже можно.'};
  if(cardsPlanned(S)>=maxPlay(S))return{ic:maxPlay(S)+'/'+maxPlay(S),tx:'лимит карт',long:'Не больше '+maxPlay(S)+' карт за ход.'};
  if(t.hpcost&&c&&c.hp<=t.hpcost)return{ic:'❤️',tx:'мало здоровья',long:c.n+': мало здоровья, карта стоит '+t.hpcost+' хп.'};
  const cs=costOf(S,card);
  if(!payCard(S,card)){const a=avail(S),m=ELS.filter(e=>(cs[e]||0)>(a[e]||0));
    const ic=m.map(e=>EI(e,1)).join('');
    return{ic,tx:'не хватает',long:'Не хватает стихий: '+m.map(e=>EI(e,1)+' ещё '+((cs[e]||0)-(a[e]||0))).join(', ')+'.'}}
  return null;
}
function whyNot(S,card){const w=whyInfo(S,card);return w?w.long:null}
function projPos(S,id){
  const p=pet(S,id);let r=p.r,c=p.c;
  for(const e of S.plan){const d=e.petT===id&&e.dir?e.dir:e.card&&e.card.pet===id&&e.sdir?e.sdir:null;if(d){const nr=r+d[0],nc=c+d[1];if(inb(nr,nc)){r=nr;c=nc}}}
  return[r,c];
}
function dirsFor(p){if(typeof ui!=='undefined'&&ui.stepE&&ui.stepE.card&&ui.stepE.card.pet===p.id){const h=halfStp(ui.stepE);if(h)return MV[h.m].d}return MV[p.mv].d}
function curStep(){const P=G.P,u=(drag&&drag.stepUid)||ui.sel;const c=u&&P.hand.find(k=>k.uid===u);return c&&STEP.has(T[c.t].area)?c:null}
function offCells(area,cell,caster,O){
  const out=(l)=>l.filter(([r,c])=>inb(r,c));
  if(area==='melee'){const col=cell?cell[1]:caster?caster.c:null;if(col==null||!O)return[];for(let r=0;r<ROWS;r++)if(petAt(O,r,col))return[[r,col]];return[]}
  if(area==='enemies')return alive(O).map(p=>[p.r,p.c]);
  const[r,c]=cell;
  if(area==='cell')return[[r,c]];
  if(area==='hline')return out([[r,c-1],[r,c],[r,c+1]]);
  if(area==='col'){const l=[];for(let i=0;i<ROWS;i++)l.push([i,c]);return l}
  if(area==='row'){const l=[];for(let i=0;i<COLS;i++)l.push([r,i]);return l}
  if(area==='cross')return out([[r,c],[r-1,c],[r+1,c],[r,c-1],[r,c+1]]);
  if(area==='sq2')return out([[r,c],[r,c+1],[r-1,c],[r-1,c+1]]);
  return[];
}

// screens are rebuilt as HTML on every tap. Instead of replacing the whole page, unchanged parts keep their DOM
// (no style recalc, live creatures keep moving) and changed blocks are patched a few levels deep.
// Animation clock offsets (--d, --b, animation-delay) are ignored when comparing: they only keep a re-render in phase
const appKey=h=>h.replace(/--[db]:-?[\d.]+s|animation-delay:-?[\d.]+m?s/g,'');
function morphKids(par,nw,depth){const old=[...par.childNodes];
  for(let i=0;i<nw.length;i++){const n=nw[i],o=old[i];
    if(n.nodeType!==1){if(o&&o.nodeType===n.nodeType){if(o.nodeValue!==n.nodeValue)o.nodeValue=n.nodeValue}else if(o)par.replaceChild(n,o);else par.appendChild(n);continue}
    const k=appKey(n.outerHTML);n._k=k;
    if(o&&o.nodeType===1&&o._k===k)continue;
    if(o&&o.nodeType===1&&depth>0&&o.tagName===n.tagName&&o.childNodes.length===n.childNodes.length&&!(n.classList&&n.classList.contains('crl'))){
      for(const a of [...o.attributes])if(!n.hasAttribute(a.name))o.removeAttribute(a.name);
      for(const a of [...n.attributes])if(o.getAttribute(a.name)!==a.value)o.setAttribute(a.name,a.value);
      morphKids(o,[...n.childNodes],depth-1);o._k=k;o._fit=0;continue}
    if(o)par.replaceChild(n,o);else par.appendChild(n)}
  for(let i=nw.length;i<old.length;i++)old[i].remove()}
function setApp(h){const t=document.createElement('template');t.innerHTML=h;if(!t.content||!t.content.childNodes){app.innerHTML=h;return}morphKids(app,[...t.content.childNodes],4)}
