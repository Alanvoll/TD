/* ---------- 0.10.0: «Забег» — a roguelike run over three lands ---------- */
const ACTS=[
  {n:'Лес',ic:'🌲',land:'Тёмный лес',packs:['wolves','grove','swarm','flytrap','poach'],bosses:['forest','queen'],bg:'#16241B'},
  {n:'Болото',ic:'🐸',land:'Гнилая трясина',packs:['grave','deep','hell','bog','cult'],bosses:['hydra','witch'],bg:'#1B2125'},
  {n:'Руины',ic:'🏛',land:'Забытые руины',packs:['mech','elem','drag','court','alch','order'],bosses:['golem','ash'],bg:'#22202A'},
];
const PACKS={
  wolves:{n:'Волчья стая',ic:'🐺',l:['Волк','Волк','Лиса','Медведь','Сова']},
  grove:{n:'Лесные стражи',ic:'🌳',l:['Дубовик','Колючник','Олень','Лотосовик','Солнечник']},
  swarm:{n:'Рой',ic:'🐝',l:['Пчела','Комар','Богомол','Паук','Жук-носорог']},
  flytrap:{n:'Хищные цветы',ic:'🪴',l:['Мухолов','Колючник','Паук','Лиса','Мухолов']},
  poach:{n:'Браконьеры',ic:'🪤',fact:'poach'},
  grave:{n:'Погост',ic:'⚰️',l:['Скелет','Зомби','Призрак','Лич','Вампир']},
  deep:{n:'Глубинные',ic:'🦑',l:['Кальмар','Осьминог','Медуза','Слизень','Глазун']},
  hell:{n:'Адская свора',ic:'🔥',l:['Цербер','Бес','Козлорог','Тенекот','Демон хаоса']},
  bog:{n:'Трясина',ic:'🫧',l:['Слизень','Зомби','Медуза','Комар','Лотосовик']},
  cult:{n:'Культисты',ic:'🕯',fact:'cult'},
  mech:{n:'Механический легион',ic:'⚙️',l:['Робот','Мехскорпион','Ремонтник','Мехзмей','Дрон']},
  elem:{n:'Буйство стихий',ic:'🌀',l:['Голем','Огневик','Водяной','Вихрик','Искрун']},
  drag:{n:'Драконье гнездо',ic:'🐉',l:['Каменный дракон','Дракончик','Златокрыл','Виверна','Тёмный дракон']},
  court:{n:'Волшебный двор',ic:'✨',l:['Единорог','Грифон','Фея','Джинн','Русалка']},
  alch:{n:'Алхимики',ic:'⚗️',fact:'alch'},
  order:{n:'Орден',ic:'🛡',fact:'order'},
};
const ELM={
  rabid:{n:'Бешеные',ic:'😡',t:'Сила +20%',f:d=>({...d,pw:(d.pw||0)+1})},
  armored:{n:'Бронированные',ic:'🛡',t:'начинают бой со щитом 18',f:d=>({...d,sh0:18})},
  tough:{n:'Живучие',ic:'❤️',t:'здоровье +30%',f:d=>({...d,hp:Math.round(d.hp*1.3)})},
  swift:{n:'Стремительные',ic:'💨',t:'инициатива их карт −20',f:d=>({...d,sp:(d.sp||0)+1})},
  undying:{n:'Неупокоенные',ic:'👻',t:'как нежить: после гибели остаются ещё на ход',f:d=>({...d,fam:'undead'})},
  thorny:{n:'Колючие',ic:'🌵',t:'как аберрации: бьют в ответ на удар',f:d=>({...d,fam:'aberr'})},
  leader:{n:'С вожаком',ic:'👑',t:'первый: здоровье ×1.6 и Сила +40%',f:(d,i)=>i===0?{...d,hp:Math.round(d.hp*1.6),pw:(d.pw||0)+2}:d},
  mages:{n:'Колдуны',ic:'🔮',t:'начинают бой с +2 каждой своей стихии',pool:2},
  regen:{n:'Растущие',ic:'🌿',t:'как растения: лечатся в конце хода без урона',f:d=>({...d,fam:'plant'})},
};
/* bosses: big 2×2, open deck, phases */
const BC=(o)=>({cost:{},burn:2,...o});
Object.assign(T,{
  bs_stomp:BC({n:'Топот',spd:2,area:'row',dmg:6,el:'e'}),bs_antler:BC({n:'Рога владыки',spd:3,area:'melee',dmg:10,push:1,el:'n'}),
  bs_roots:BC({n:'Цепкие корни',spd:4,area:'col',dmg:4,root:2,el:'e'}),bs_spores:BC({n:'Споры',spd:3,area:'enemies',dmg:2,slow:2,el:'n'}),
  bs_bark:BC({n:'Кора',spd:5,area:'self',shield:10,el:'e'}),bs_sprout:BC({n:'Росток',spd:4,area:'summon',sum:{n:'Росток',ic:'🌱',hp:12,mv:'none',au:'frog'},txt:'Призывает Росток (12 хп). Росток лечит соседей на 2 в конце хода. Не больше двух.',el:'n'}),
  bs_wrath:BC({n:'Гнев леса',spd:2,area:'cross',dmg:8,el:'e'}),
  bs_qsting:BC({n:'Жало королевы',spd:4,area:'cell',dmg:8,slow:2,el:'a'}),bs_swarm:BC({n:'Рой трутней',spd:4,area:'summon',sum:{n:'Трутень',ic:'🐝',hp:10,mv:'none',au:'fox'},txt:'Призывает Трутня (10 хп). Трутень усиливает удары соседей на 2. Не больше двух.',el:'a'}),
  bs_acid:BC({n:'Кислотный дождь',spd:2,area:'enemies',dmg:3,ign:2,el:'z'}),bs_chitin:BC({n:'Хитин',spd:5,area:'self',shield:8,el:'e'}),
  bs_buzz:BC({n:'Гул',spd:3,area:'hline',dmg:5,stun:1,el:'a'}),bs_frenzy:BC({n:'Ярость роя',spd:3,area:'sq2',dmg:7,el:'a'}),
  bs_hbite:BC({n:'Укус головы',spd:3,area:'melee',dmg:8,el:'w'}),bs_spit:BC({n:'Кислотный плевок',spd:4,area:'cell',dmg:6,ign:2,el:'z'}),
  bs_htail:BC({n:'Хлёст хвостом',spd:3,area:'hline',dmg:5,push:1,el:'w'}),bs_bog:BC({n:'Трясина',spd:2,area:'enemies',dmg:2,slow:2,el:'w'}),
  bs_regrow:BC({n:'Новая голова',spd:5,area:'self',heal:12,el:'w'}),
  bs_hex:BC({n:'Порча',spd:3,area:'cell',dmg:4,mark:2,ign:2,el:'d'}),bs_croak:BC({n:'Квак',spd:1,area:'enemies',dmg:2,stun:1,el:'z'}),
  bs_tongue:BC({n:'Язык',spd:4,area:'melee',dmg:8,pull:1,el:'w'}),bs_brew:BC({n:'Варево',spd:2,area:'self',heal:10,cleanse:1,el:'d'}),
  bs_tad:BC({n:'Головастики',spd:4,area:'summon',sum:{n:'Головастик',ic:'🐸',hp:8,mv:'none',au:'owl'},txt:'Призывает Головастика (8 хп). Не больше двух.',el:'w'}),
  bs_bogcurse:BC({n:'Проклятие трясины',spd:2,area:'row',dmg:6,slow:2,el:'d'}),
  bs_firerain:BC({n:'Огненный ливень',spd:2,area:'row',dmg:7,ign:2,el:'f'}),bs_ashclaw:BC({n:'Пепельный коготь',spd:3,area:'melee',dmg:10,el:'f'}),
  bs_tailsw:BC({n:'Удар хвостом',spd:3,area:'hline',dmg:6,push:1,el:'e'}),bs_roar:BC({n:'Рёв',spd:4,area:'enemies',dmg:2,stun:1,el:'d'}),
  b_rage:BC({n:'Ярость голема',spd:2,area:'enemies',dmg:4,slow:1,el:'e'}),b_crush:BC({n:'Сокрушение',spd:3,area:'sq2',dmg:8,el:'e'}),
  bs_ashscale:BC({n:'Чешуя из пепла',spd:5,area:'self',shield:12,el:'e'}),bs_inferno:BC({n:'Инферно',spd:1,area:'enemies',dmg:6,ign:2,el:'f'}),
});
const BOSSES={
  forest:{n:'Владыка леса',ic:'🦌',hp:150,mp:2,deck:['bs_stomp','bs_stomp','bs_antler','bs_antler','bs_roots','bs_roots','bs_spores','bs_bark','bs_bark','bs_sprout'],
    rule:'Призывает Ростки, они лечат его, если стоят рядом. На половине здоровья играет 3 карты, в колоде появляется Гнев леса.',
    ph:[{at:.5,mp:3,add:['bs_wrath','bs_wrath'],say:'Владыка в гневе!'}]},
  queen:{n:'Королева роя',ic:'🐝',hp:100,mp:2,deck:['bs_qsting','bs_qsting','bs_qsting','bs_swarm','bs_swarm','bs_acid','bs_acid','bs_chitin','bs_chitin','bs_buzz'],
    rule:'Трутни рядом с ней усиливают её удары. На половине здоровья играет 3 карты, в колоде появляется Ярость роя.',
    ph:[{at:.5,mp:3,add:['bs_frenzy','bs_frenzy'],say:'Рой в ярости!'}]},
  hydra:{n:'Болотная гидра',ic:'🐍',hp:160,mp:3,deck:['bs_hbite','bs_hbite','bs_hbite','bs_spit','bs_spit','bs_htail','bs_htail','bs_bog','bs_bog','bs_regrow'],
    rule:'Три головы: играет 3 карты. В конце хода лечится на 18, если не горит 🔥. На половине здоровья отращивает четвёртую голову.',
    regen:6,ph:[{at:.5,mp:4,say:'Выросла четвёртая голова!'}]},
  witch:{n:'Жабья ведьма',ic:'🐸',hp:240,mp:2,deck:['bs_hex','bs_hex','bs_croak','bs_croak','bs_tongue','bs_tongue','bs_brew','bs_brew','bs_tad'],
    rule:'Сглаз: каждый ход крадёт 1 стихию из твоего самого большого запаса. На половине здоровья играет 3 карты, в колоде появляется Проклятие трясины.',
    steal:1,ph:[{at:.5,mp:3,add:['bs_bogcurse','bs_bogcurse'],say:'Ведьма проклинает трясину!'}]},
  golem:{n:'Древний голем',ic:'🗿',hp:340,mp:2,golem:1,deck:BOSS_DECK,
    rule:'Уязвимое место ✶ получает двойной урон и каждый ход перемещается. Осколки дают ему щит. На половине здоровья в ярости: 3 карты за ход.'},
  ash:{n:'Пепельный дракон',ic:'🐲',hp:240,mp:2,deck:['bs_firerain','bs_firerain','bs_ashclaw','bs_ashclaw','bs_ashclaw','bs_tailsw','bs_tailsw','bs_roar','bs_ashscale','bs_ashscale'],
    rule:'Две фазы. На 2/3 здоровья играет 3 карты, в колоде появляется Инферно. На 1/3 его Сила +40%.',
    ph:[{at:.66,mp:3,add:['bs_inferno','bs_inferno'],say:'Дракон взлетает!'},{at:.33,pw:2,say:'Последнее пламя!'}]},
};
function mkBossX(key,mult){const B=BOSSES[key],hp=Math.round(B.hp*K/2*(mult||1));
  const b={id:'b0',n:B.n,ic:B.ic,au:B.golem?'boss':null,els:[],max:hp,hp,base:hp,mv:'none',r:ROWS-2,c:Math.max(0,Math.floor((COLS-2)/2)),sz:2,shield:0,frozen:0,alive:true,cards:B.deck,pw:0,sp:0};
  return {bot:true,boss:true,bk:key,maxPlay:B.mp,pets:[b],pool:z0(),deck:shuffle(B.deck.map((t,i)=>({uid:'B'+i,t,pet:'b0'}))),hand:[],discard:[],plan:[],lim:[],keep:new Set(),gen:z0(),traps:[],ph:0}}
function bossPhase(){const B=G.B,bk=B.bk&&BOSSES[B.bk];if(!bk||!bk.ph)return;const b=B.pets[0];if(!b.alive)return;
  while(B.ph<bk.ph.length&&b.hp<=b.max*bk.ph[B.ph].at){const p=bk.ph[B.ph++];if(p.mp)B.maxPlay=p.mp;if(p.pw)b.pw=(b.pw||0)+p.pw;
    (p.add||[]).forEach((t,i)=>B.deck.push({uid:'BP'+B.ph+i,t,pet:b.id}));G.log.push(`<b>${b.n}</b>: ${p.say}`);banner(B,petIc(b,1),p.say)}}
/* ---------- talismans ---------- */
const TAL={
  oak:{n:'Дубовый оберег',ic:'🛡',r:0,t:'В начале боя все твои получают щит 12.'},
  pouch:{n:'Мешочек стихий',ic:'👝',r:0,t:'В начале боя +1 к каждой стихии твоих карт.'},
  horn:{n:'Боевой рог',ic:'📯',r:0,t:'В первом ходу боя инициатива твоих карт −20.'},
  firstblood:{n:'Первая кровь',ic:'🗡',r:0,t:'В начале боя каждый враг получает 9 урона.'},
  banner:{n:'Знамя стаи',ic:'🚩',r:1,t:'Сила +20% всем твоим существам.'},
  sandals:{n:'Крылатые сандалии',ic:'🪽',r:1,t:'Инициатива карт всех твоих существ −20.'},
  extra:{n:'Лишний карман',ic:'🎒',r:1,t:'Рука на 1 карту больше.'},
  lightstep:{n:'Лёгкий шаг',ic:'👣',r:0,t:'Несыгранный Шаг даёт 2 стихии вместо 1.'},
  heart:{n:'Сердце леса',ic:'💚',r:0,t:'В конце каждого хода самый раненый из твоих лечится на 9.'},
  collar:{n:'Шипастый ошейник',ic:'🌵',r:0,t:'Кто ударит твоё существо картой, получает 3 урона в ответ.'},
  shell:{n:'Панцирь черепахи',ic:'🐢',r:1,t:'Твои существа получают на 3 урона меньше от каждого удара.'},
  fang:{n:'Клык вожака',ic:'🦷',r:0,t:'Удары по врагам с половиной здоровья или меньше сильнее на 6.'},
  rage:{n:'Ярость берсерка',ic:'😤',r:0,t:'Твои раненые (половина здоровья или меньше) бьют на 6 сильнее.'},
  crystal:{n:'Кристалл притока',ic:'💠',r:1,t:'Приток даёт 2 стихии вместо 1.'},
  hourglass:{n:'Песочные часы',ic:'⏳',r:0,t:'Буря начинается на 3 хода позже.'},
  phoenix:{n:'Перо феникса',ic:'🪶',r:2,t:'Один раз за бой первое павшее твоё существо возвращается с 30% здоровья.'},
  purse:{n:'Кошель удачи',ic:'💰',r:0,t:'Золота за бои на 30% больше.'},
  coupon:{n:'Скидочная грамота',ic:'🏷',r:0,t:'Лавка на 25% дешевле.'},
  clover:{n:'Четырёхлистник',ic:'🍀',r:1,t:'В наградах после боя на 1 вариант больше.'},
  kit:{n:'Аптечка',ic:'🩹',r:0,t:'После каждого боя все твои лечатся на 20%.'},
  totem:{n:'Тотем жизни',ic:'❤️',r:1,t:'Здоровье всех твоих существ +15%.'},
  crown:{n:'Корона королей',ic:'👑',r:1,t:'Элиты и боссы дают вдвое больше золота.'},
  eternal:{n:'Вечный огонь',ic:'🕯',r:0,t:'Поджог от твоих карт длится на 1 ход дольше.'},
  frost:{n:'Ледяное сердце',ic:'❄️',r:1,t:'Оглушение, замедление и сковывание от твоих карт длятся на 1 ход дольше.'},
  raven:{n:'Глаз ворона',ic:'🐦‍⬛',r:0,t:'В начале боя все враги получают метку на 2 хода.'},
  quiver:{n:'Колчан',ic:'🏹',r:0,t:'Удары в одну клетку и «ближайшему в столбце» сильнее на 3.'},
  storm:{n:'Буревестник',ic:'🌩',r:0,t:'Широкие удары (линия, ряд, столбец, крест, квадрат, все) сильнее на 3.'},
  moss:{n:'Целебный мох',ic:'🌿',r:0,t:'Лечение от твоих карт сильнее на 6.'},
  stone:{n:'Каменная кожа',ic:'🪨',r:0,t:'Щиты от твоих карт больше на 6.'},
  vamp:{n:'Клык вампира',ic:'🧛',r:1,t:'Твоё существо, нанёсшее урон картой, лечится на 3.'},
  balloon:{n:'Запасная жизнь',ic:'🎈',r:1,t:'Сразу +1 жизнь.',now:R=>{R.lives++}},
  chest:{n:'Тяжёлый сундук',ic:'🪙',r:0,t:'Сразу +120 золота.',now:R=>{R.gold+=120}},
  mentor:{n:'Книга наставника',ic:'📘',r:1,t:'Опыт существ за забег вдвое больше.'},
  trophy:{n:'Охотничий трофей',ic:'🦴',r:0,t:'За каждого побеждённого врага +3 золота.'},
  meteor:{n:'Метеор',ic:'☄️',r:1,t:'В начале 3-го хода каждый враг получает 18 урона.'},
  dew:{n:'Чистая роса',ic:'💧',r:0,t:'В начале каждого хода с одного твоего существа снимаются плохие эффекты.'},
  scroll:{n:'Свиток спешки',ic:'📜',r:0,t:'Инициатива Шага −40.'},
  pack:{n:'Тотем стаи',ic:'🐺',r:1,t:'Если в бою 5 твоих существ, все они бьют на 3 сильнее.'},
  laststand:{n:'Последний рубеж',ic:'🏰',r:1,t:'Когда у тебя остаётся одно существо, оно получает щит 30 и Силу +40%.'},
  mirror:{n:'Зеркало ведьмы',ic:'🪞',r:2,t:'В начале боя все твои получают иммунитет к плохим эффектам на 2 хода.'},
};
const hasT=k=>!!(META.run&&META.run.talis.includes(k)&&G&&G.run);
function talDmg(S,caster,t,p){if(!G||!G.run||S!==G.P)return 0;let d=0;
  if(hasT('fang')&&p.hp<=p.max/2)d+=2;if(caster&&hasT('rage')&&caster.hp<=caster.max/2)d+=2;
  if(hasT('quiver')&&['cell','melee'].includes(t.area))d+=1;if(hasT('storm')&&!['cell','melee'].includes(t.area))d+=1;
  if(hasT('pack')&&S.pets.filter(q=>!q.tok).length>=5)d+=1;
  if(caster&&caster.fam&&hasT('fm_'+caster.fam))d+=1;return d*SC}
const talDef=(S,d)=>G&&G.run&&S===G.P&&hasT('shell')?Math.max(1,d-SC):d;
const talH=S=>G&&G.run&&S===G.P&&hasT('moss')?2*SC:0,talSh=S=>G&&G.run&&S===G.P&&hasT('stone')?2*SC:0;
const talExt=(S,k)=>!G||!G.run||S!==G.P?0:(k==='burn'&&hasT('eternal')?1:0)+(['stun','slow','root'].includes(k)&&hasT('frost')?1:0);
function talSpd(x){if(!G||!G.run||x.S!==G.P)return 0;let v=0;if(G.turn===1&&hasT('horn'))v++;if(hasT('scroll')&&x.card&&x.card.t==='step')v+=2;return v}
function runTurnHook(){boss3Turn();boss2Turn();if(!G.run&&!G.B.bk)return;const P=G.P,B=G.B,bk=B.bk&&BOSSES[B.bk];
  if(bk&&bk.steal&&G.turn>1){let bx=null;for(const k of ELS)if(P.pool[k]>0&&(!bx||P.pool[k]>P.pool[bx]))bx=k;if(bx){P.pool[bx]--;G.log.push(`Сглаз: ведьма крадёт 1 ${ELN[bx].toLowerCase()}.`)}}
  if(hasT('dew')){const l=alive(P).filter(p=>p.st&&NEG.some(k=>p.st[k])||p.frozen);if(l.length){cleanse(l[0])}}
  if(G.turn===3&&hasT('meteor'))for(const p of alive(B)){BST_A=null;hit(B,p,6*SC)};
  if(hasT('laststand')){const l=alive(P).filter(p=>!p.tok);if(l.length===1&&!l[0].lastst){l[0].lastst=1;addShield(l[0],10*SC);l[0].pw=(l[0].pw||0)+2}}
  checkOver()}
function runEndHook(){if(!G.run&&!G.B.bk)return;const B=G.B,bk=B.bk&&BOSSES[B.bk];
  if(bk&&bk.regen){const b=B.pets[0];if(b.alive&&!sv(b,'burn')&&b.hp<b.max){const h=Math.min(bk.regen*SC,b.max-b.hp);b.hp+=h;bstHeal(B,b,h,1);G.log.push(`${b.n} отращивает головы: +${h}.`)}}
  if(hasT('heart')){const l=alive(G.P).filter(p=>!p.ghost&&p.hp<p.max).sort((a,b)=>a.hp/a.max-b.hp/b.max);if(l[0]){const h=Math.min(l[0].max-l[0].hp,healAmt(3*SC));l[0].hp+=h;bstHeal(G.P,l[0],h,1)}}}
/* ---------- run state ---------- */
const ASC=['Обычный путь','Враги крепче: +10% здоровья','Меньше золота: −25%','Элиты злее: Сила +20%','Жизней 2 вместо 3','Враги быстрее: инициатива их карт −20','Лагерь лечит слабее: 25%','Боссы крепче: +20% здоровья','Лавка дороже: +25%','Враги ещё крепче: +15% здоровья','Одна жизнь'];
const RUNV=1;
function newRun(team,asc,daily){const R={v:RUNV,asc,daily:daily?dayKey():null,act:0,lives:asc>=10?1:asc>=4?2:3,gold:asc>=2?40:60,team:team.map(pi=>mkMember(pi,false,!!daily)),talis:[],map:null,pos:null,scr:'map',stepD:0,
  st:{fights:0,elites:0,bosses:0,nodes:0,kills:0,gold:0},log:[],t0:Date.now(),seenEv:[]};
  R.map=daily?withSeed(daySeed(),()=>genMap(0)):genMap(0);META.run=R;META.stats.runs=(META.stats.runs||0)+1;saveMeta();return R}
function mkMember(pi,guest,fix){const p=PETS[pi],m=mp(p.n);fix=fix||!!(META.run&&META.run.daily);if(fix)guest=!m.un;
  const lv=fix?5:guest?Math.max(1,runAvgLv()):m.lv,q=fix?1:guest?Math.min(4,Math.max(0,Math.round(runAvgQ()))):m.q;
  const sl=fix||guest?[0,0,0]:m.sl,cards=p.cards.map((k,j)=>sl[j]&&p.alt&&p.alt[j]&&altOpen(q,j)?p.alt[j]:k);
  return {pi,guest,lv,q,cards,hp:null,rlv:0,hpB:0,pwB:0}}
const runAvgLv=()=>{const R=META.run;if(!R||!R.team.length)return 1;return Math.round(R.team.reduce((a,m)=>a+m.lv,0)/R.team.length)};
const runAvgQ=()=>{const R=META.run;if(!R||!R.team.length)return 0;return R.team.reduce((a,m)=>a+m.q,0)/R.team.length};
// battle definition of a run member: meta level + run levels (ignore the quality cap), run upgrades in m.cards
function runDef(m){const lv=Math.min(25,m.lv+m.rlv),d=metaDef(m.pi,lv,m.q,null);d.cards=m.cards.slice();d.els=cardEls(d.cards);
  d.hp=Math.round(d.hp*(1+m.hpB)*(hasTR('totem')?1.15:1));d.pw+=m.pwB+(hasTR('banner')?1:0);d.sp=(d.sp||0)+(hasTR('sandals')?1:0);
  if(m.hp==null)m.hp=d.hp;d.hpNow=Math.min(m.hp,d.hp);return d}
const hasTR=k=>!!(META.run&&META.run.talis.includes(k));
/* map: 8 rows per act, row 7 is the boss; rows of 2–4 nodes, each linked to 1–2 nodes above */
const NT={fight:{ic:'⚔️',n:'Бой'},elite:{ic:'💀',n:'Элита'},event:{ic:'❓',n:'Событие'},camp:{ic:'🔥',n:'Лагерь'},shop:{ic:'🛒',n:'Лавка'},treasure:{ic:'🎁',n:'Сокровище'},boss:{ic:'👑',n:'Босс'}};
function genMap(act){const rows=[];
  for(let r=0;r<8;r++){const n=r===7?1:r===6?3:r===0?3:2+Math.floor(Math.random()*3);const row=[];
    for(let i=0;i<n;i++){let k;
      if(r===7)k='boss';else if(r===6)k='camp';else if(r===0)k='fight';else if(r===3&&i===Math.floor(n/2))k='treasure';
      else{const x=Math.random(),eW=r>=2?(META.run&&META.run.asc>=2?.2:.14):0,sW=r>=2?.1:0,cW=r>=3&&r<=5?.08:0;
        k=x<eW?'elite':x<eW+sW?'shop':x<eW+sW+cW?'camp':x<eW+sW+cW+.22?'event':'fight'}
      row.push({k,x:(i+.5)/n,to:[],done:false})}
    rows.push(row)}
  for(let r=0;r<7;r++){const a=rows[r],b=rows[r+1];
    a.forEach((nd,i)=>{const j=Math.round(i*(b.length-1)/Math.max(1,a.length-1));nd.to=[j];if(Math.random()<.45){const j2=j+(Math.random()<.5?-1:1);if(j2>=0&&j2<b.length)nd.to.push(j2)}});
    b.forEach((nd,j)=>{if(!a.some(x=>x.to.includes(j))){let bi=0,bd=9;a.forEach((x,i)=>{const d=Math.abs(x.x-nd.x);if(d<bd){bd=d;bi=i}});a[bi].to.push(j)}})}
  // no two elites/shops in a row along a link
  for(let r=0;r<6;r++)rows[r].forEach(nd=>nd.to.forEach(j=>{const nx=rows[r+1][j];if(nd.k===nx.k&&['elite','shop','camp'].includes(nd.k))nx.k='fight'}));
  // every land has at least one shop
  if(!rows.some(r=>r.some(n=>n.k==='shop'))){const r5=rows[5],m=r5[Math.floor(r5.length/2)];m.k='shop'}
  return{act,rows,boss:ACTS[act].bosses[Math.floor(Math.random()*ACTS[act].bosses.length)]}}
const canGo=(R,r,i)=>{if(!R.pos)return r===0;return r===R.pos.r+1&&R.map.rows[R.pos.r][R.pos.i].to.includes(i)};
/* ---------- enemies ---------- */
function encLv(R,r,elite){const base=Math.round(runAvgLv()*.5)+[-1,4,8][R.act]+Math.floor(r*.6)+(elite?(R.act?2:1):0);return Math.max(1,Math.min(20,base))}
function encQ(R,r,elite){return Math.min(4,R.act+(r>=5||elite?1:0))}
function hpAsc(R){let m=1;if(R.asc>=1)m+=.1;if(R.asc>=9)m+=.15;return m}
function makeEnc(R,r,kind){
  const A=ACTS[R.act],elite=kind==='elite',tn=R.team.length;
  const size=Math.max(2,R.act===0?Math.min(4,r<=1&&!elite?tn-1:tn):Math.min(R.act===1&&r<=2&&!elite?4:5,tn+(r>=4?1:0)+(elite?1:0)));
  const pk=A.packs[Math.floor(Math.random()*A.packs.length)],P=PACKS[pk];const lv=encLv(R,r,elite),q=encQ(R,r,elite);
  let defs;
  if(P.fact){const F=FACT[P.fact];defs=[];if(elite||r>=5)defs.push({...F.boss});while(defs.length<size)defs.push({...F.units[Math.floor(Math.random()*F.units.length)]});
    defs=defs.map(d=>({...d,hp:Math.round(d.hp*metaMul(lv,q)),pw:(d.pw||0)+lvPw(lv),lv,q}))}
  else defs=shuffle(P.l.slice()).slice(0,size).map(n=>metaDef(PETS.findIndex(p=>p.n===n),lv,q,[0,1,2].map(()=>Math.random()<.5?1:0)));
  defs=defs.map(d=>({...d,hp:Math.round(d.hp*hpAsc(R)),sp:(d.sp||0)+(R.asc>=5?1:0)}));
  let mod=null;if(elite){const ks=Object.keys(ELM);mod=ks[Math.floor(Math.random()*ks.length)];const M=ELM[mod];if(M.f)defs=defs.map((d,i)=>M.f(d,i));if(R.asc>=3)defs=defs.map(d=>({...d,pw:(d.pw||0)+1}))}
  return{defs,pack:pk,mod,fact:P.fact||null,lv,q}}
/* ---------- battle start / end ---------- */
function runFight(kind){const R=META.run,{r,i}=R.pos,nd=R.map.rows[r][i];
  let e=nd.enc;if(!e){e=kind==='boss'?{boss:R.map.boss}:R.daily?withSeed(daySeed()+R.act*7919+r*131+i*17,()=>makeEnc(R,r,kind)):makeEnc(R,r,kind);nd.enc=e;saveMeta()}
  CTX={kind:'run',node:kind};TEAM=R.team.map(m=>m.pi);
  NEXT={enemy:e.defs,ai:R.asc>=8&&kind==='elite'?'master':R.act>=2||R.act===1&&kind!=='fight'?'hard':'medium',fact:e.fact,bossK:e.boss||null,mod:e.mod};
  G={phase:'place'};resetPlace();PLACE=R.place&&R.place.length===TEAM.length?R.place.map(x=>[...x]):smartPlace(TEAM.map(i=>PETS[i]),TEAM.length);ui.ps=null;render()}
function runBattleStart(nx){const R=META.run;if(!R)return;G.run=true;G.node=CTX.node;const P=G.P,B=G.B;
  if(R.stepD){if(R.stepD<0){for(let i=0;i<-R.stepD;i++){const j=P.deck.findIndex(c=>c.t==='step');if(j>=0&&P.deck.filter(c=>c.t==='step').length>2)P.deck.splice(j,1)}}else for(let i=0;i<R.stepD;i++)P.deck.push({uid:'PS'+i,t:'step',pet:null});shuffle(P.deck)}
  if(hasTR('extra'))P.hb=1;if(hasTR('crystal'))P.incB=1;if(hasTR('hourglass'))G.stDelay=3;
  if(hasTR('oak'))for(const p of P.pets)addShield(p,4*SC);
  if(hasTR('pouch'))for(const e of needEls(P))P.pool[e]++;
  if(hasTR('mirror'))for(const p of P.pets)applySt(p,'immune',3);
  if(hasTR('raven'))for(const p of B.pets)applySt(p,'mark',3);
  if(hasTR('firstblood'))for(const p of B.pets)if(!p.sz){p.hp=Math.max(1,p.hp-3*SC)}else p.hp-=3*SC;
  if(nx&&nx.mod&&ELM[nx.mod].pool)for(const e of needEls(B))B.pool[e]+=ELM[nx.mod].pool;
  for(const p of B.pets)if(p.sh0)p.shield=p.sh0;
  for(const p of P.pets)if(p.hpNow!=null)p.hp=Math.max(1,Math.min(p.max,p.hpNow));
  // the opening hand was drawn before the bigger hand: top it up
  if(P.hb)draw(P,Math.max(0,handSize(P)-P.hand.length));
  if(B.boss)botPlan(B,P);
  for(const p of P.pets)if(!p.tok&&p.fam&&hasTR('fm_'+p.fam))addShield(p,3*SC);
  if(hasTR('bond')){const c={};for(const p of P.pets)if(!p.tok&&p.fam)c[p.fam]=(c[p.fam]||0)+1;if(Math.max(0,...Object.values(c))>=3)for(const p of P.pets)addShield(p,5*SC)}}
function runAfterBattle(){const R=META.run;if(!R||CTX.done)return;CTX.done=true;const win=G.over==='win',kind=CTX.node;
  const byPi=new Map(G.P.pets.filter(p=>p.pi!=null).map(p=>[p.pi,p]));
  for(const m of R.team){const p=byPi.get(m.pi);if(!p)continue;const mx=p.max;m.hp=p.alive&&!p.ghost?p.hp:Math.round(mx*.25);if(win)m.hp=Math.min(mx,m.hp+Math.round(mx*.35));if(hasTR('kit'))m.hp=Math.min(mx,m.hp+Math.round(mx*.2))}
  const log=[];R.st.kills+=G.kills||0;
  if(win){R.st.nodes++;if(kind==='elite')R.st.elites++;else if(kind==='boss')R.st.bosses++;else R.st.fights++;
    let g=kind==='boss'?90:kind==='elite'?45:14+Math.floor(Math.random()*7);if(hasTR('crown')&&kind!=='fight')g*=2;if(hasTR('purse'))g=Math.round(g*1.3);if(R.asc>=2)g=Math.round(g*.75);
    g+=hasTR('trophy')?3*(G.kills||0):0;R.gold+=g;R.st.gold+=g;log.push({k:'gold',v:g});
    for(const m of R.team){m.rlv=Math.min(10,m.rlv+1)}
    const xp=(kind==='fight'?6:10)*(hasTR('mentor')?2:1);for(const m of R.team)if(!m.guest){addXp(PETS[m.pi].n,xp,log);log.push({k:'xp',n:PETS[m.pi].n,v:xp})}
    questEv('win');if(!G.P.pets.some(p=>!p.tok&&!p.alive))questEv('flawless');if(G.turn<=8)questEv('quick');
    {const fc={};for(const p of G.P.pets)if(!p.tok)fc[p.fam]=(fc[p.fam]||0)+1;if(Object.values(fc).some(v=>v>=2))questEv('fam2')}
    R.offers=rewardSet(kind);R.scr='reward'}
  else{R.lives--;for(const m of R.team){const d=runDef(m);m.hp=Math.max(m.hp,Math.round(d.hp*.5))}R.st.nodes++;
    if(R.lives<=0){R.scr='end';R.result='lose'}else{R.scr='map';if(kind!=='boss')markDone(R)}}
  if(win&&kind==='boss'){for(const m of R.team)m.hp=runDef(m).hp}
  G.rw=log;saveMeta()}
function markDone(R){const nd=R.map.rows[R.pos.r][R.pos.i];nd.done=true}
/* ---------- rewards ---------- */
function upOffer(R,ex){const l=[];R.team.forEach((m,mi)=>m.cards.forEach((k,ci)=>{if(!/\+$/.test(k)&&!ex.some(o=>o.mi===mi&&o.ci===ci))l.push({k:'up',mi,ci})}));return l.length?l[Math.floor(Math.random()*l.length)]:null}
function petOffer(R,ex){const inT=new Set(R.team.map(m=>m.pi).concat(ex.filter(o=>o.k==='pet').map(o=>o.pi)));
  const own=PETS.map((p,i)=>i).filter(i=>mp(PETS[i].n).un&&!inT.has(i)),lock=PETS.map((p,i)=>i).filter(i=>!mp(PETS[i].n).un&&!inT.has(i));
  const guest=!own.length||Math.random()<.3&&lock.length;const l=guest?lock:own;if(!l.length)return null;return{k:'pet',pi:l[Math.floor(Math.random()*l.length)],guest:!!guest}}
function talOffer(R,ex,minR=0){const fams=runFams(R),l=Object.keys(TAL).filter(k=>!(TAL[k].fam&&!fams.includes(TAL[k].fam))&&!R.talis.includes(k)&&!ex.some(o=>o.tk===k)&&TAL[k].r>=minR);return l.length?{k:'tal',tk:l[Math.floor(Math.random()*l.length)]}:null}
function rewardSet(kind){const R=META.run,o=[],n=3+(hasTR('clover')?1:0);
  const push=x=>{if(x)o.push(x)};
  if(kind==='elite'||kind==='boss'){for(let i=0;i<n;i++)push(talOffer(R,o,kind==='boss'?1:0));if(R.team.length<5)push(petOffer(R,o))}
  else{if(R.team.length<5)push(petOffer(R,o));while(o.length<n){const x=Math.random();push(x<.12?talOffer(R,o):x<.24&&R.team.length<5?petOffer(R,o):upOffer(R,o));if(o.length<n&&Math.random()<.02)break}}
  if(R.forecast){R.forecast=0;push(upOffer(R,o))}
  if(kind==='fight'&&Math.random()<.4){const a=altOffer(R,o);if(a){const k=o.findIndex(x=>x.k==='up');if(k>=0)o[k]=a;else o.push(a)}}
  return o}
function takeOffer(o){const R=META.run;
  if(o.k==='pet'&&R.team.length<5){const m=mkMember(o.pi,o.guest);R.team.push(m);R.place=null;return`${PETS[o.pi].n} в стае${o.guest?' (гость)':''}!`}
  if(o.k==='up'){const m=R.team[o.mi];if(!m)return'';const k=m.cards[o.ci];m.cards[o.ci]=upCard(k);return`${T[k].n} → ${T[m.cards[o.ci]].n}`}
  if(o.k==='alt'){const m=R.team[o.mi];if(!m||!m.cards[o.j])return'';const old=m.cards[o.j];m.cards[o.j]=o.to;return`${PETS[m.pi].n}: ${T[old].n} → ${T[o.to].n}`}
  if(o.k==='tal'){R.talis.push(o.tk);if(TAL[o.tk].now)TAL[o.tk].now(R);cdxMark('tal',o.tk);return`${TAL[o.tk].ic} ${TAL[o.tk].n}`}
  if(o.k==='gold'){R.gold+=o.v;return`🪙 +${o.v}`}
  if(o.k==='heal'){healTeam(R,o.v);return`💚 лечение`}
  return''}
function healTeam(R,f){for(const m of R.team){const d=runDef(m);m.hp=Math.min(d.hp,m.hp+Math.round(d.hp*f))}}
function offerHtml(o,i,act,price){const R=META.run;
  if(o.k==='pet'){const p=PETS[o.pi],m=o.guest?null:mp(p.n),lv=o.guest?runAvgLv():m.lv,q=o.guest?Math.round(runAvgQ()):m.q;
    return`<button class="draft rof" data-act="${act}${i}"><span class="rwa">${qArt(p,q,1)}</span><span style="flex:1"><b>${p.n}</b> ${o.guest?'<span class="gtag">гость</span>':''}<div class="m" style="font-size:11px">ур. ${lv} · ${QN[q]} · ${FAM[p.fam].ic} ${FAM[p.fam].n} · ${CLS[p.cls].ic} ${CLS[p.cls].n}</div><div class="m" style="font-size:11px">${p.cards.map(k=>T[k].n).join(' · ')}</div>${o.guest?'<div class="m" style="font-size:10px">Гость: его ещё нет в библиотеке. За забег с ним получишь его осколки.</div>':''}</span>${price?`<span class="prc">🪙${price}</span>`:''}</button>`}
  if(o.k==='up'){const m=R.team[o.mi],k=m.cards[o.ci],p=PETS[m.pi];
    return`<button class="draft rof" data-act="${act}${i}"><span class="rwa">${petIc(p,1)}</span><span style="flex:1"><b>${T[k].n} → ${T[upCard(k)].n}</b><div class="m" style="font-size:11px">${p.n}: ${upDiff(k,runDef(m))}</div><div class="m" style="font-size:10px">${cardTxt(T[upCard(k)],runDef(m))}</div></span>${price?`<span class="prc">🪙${price}</span>`:''}</button>`}
  if(o.k==='tal'){const t=TAL[o.tk];return`<button class="draft rof" data-act="${act}${i}"><span class="rwa">${t.ic}</span><span style="flex:1"><b>${t.n}</b> <span class="rtag r${t.r}">${['обычный','редкий','легендарный'][t.r]}</span><div class="m" style="font-size:11px">${t.t}</div></span>${price?`<span class="prc">🪙${price}</span>`:''}</button>`}
  if(o.k==='alt'){const m=R.team[o.mi];if(!m||!m.cards[o.j])return'';const p=PETS[m.pi];
  return`<button class="draft rof" data-act="${act}${i}"><span class="rwa">${petIc(p,1)}</span><span style="flex:1"><b>Переучить: ${T[m.cards[o.j]].n} → ${T[o.to].n}</b><div class="m" style="font-size:11px">${p.n} меняет карту до конца забега.</div><div class="m" style="font-size:10px">${cardTxt(T[o.to],p)}</div></span>${price?`<span class="prc">🪙${price}</span>`:''}</button>`}
  if(o.k==='heal')return`<button class="draft rof" data-act="${act}${i}"><span class="rwa">💚</span><span style="flex:1"><b>Лечение</b><div class="m" style="font-size:11px">Вся стая лечится на ${Math.round(o.v*100)}%.</div></span>${price?`<span class="prc">🪙${price}</span>`:''}</button>`;
  if(o.k==='rm')return`<button class="draft rof" data-act="${act}${i}"><span class="rwa">✂️</span><span style="flex:1"><b>Убрать карту</b><div class="m" style="font-size:11px">Выбери карту, которая уйдёт из колоды до конца забега.</div></span>${price?`<span class="prc">🪙${price}</span>`:''}</button>`;
  return''}
/* ---------- shop / camp / events ---------- */
function shopGen(R){const o=[],pr=(v)=>Math.round(v*(hasTR('coupon')?.75:1)*(R.asc>=8?1.25:1));
  for(let i=0;i<2&&R.team.length<5;i++){const x=petOffer(R,o);if(x){x.p=pr(x.guest?70:60);o.push(x)}}
  for(let i=0;i<3;i++){const x=upOffer(R,o);if(x){x.p=pr(40);o.push(x)}}
  for(let i=0;i<2;i++){const x=talOffer(R,o);if(x){x.p=pr([90,130,170][TAL[x.tk].r]);o.push(x)}}
  const a=altOffer(R,o);if(a){a.p=pr(35);o.push(a)}
  o.push({k:'heal',v:.35,p:pr(25)},{k:'rm',p:pr(50)});return o}
const EVENTS=[
  {k:'altar',n:'Заброшенный алтарь',ic:'🕯',t:'Среди мха стоит старый алтарь. На нём лежат монеты и горит свеча.',ch:[
    {t:'Помолиться: случайная карта стаи улучшится',f:R=>upRandom(R,1)},{t:'Забрать подношения: +60 золота, все теряют 15% здоровья',f:R=>{R.gold+=60;hurtTeam(R,.15);return'+60 золота, стая ранена.'}},{t:'Уйти',f:()=>''}]},
  {k:'stranger',n:'Раненый странник',ic:'🧙',t:'У дороги сидит раненый странник и просит о помощи.',ch:[
    {t:'Помочь (−30 золота): получить талисман',need:R=>R.gold>=30,f:R=>{R.gold-=30;return giveTal(R)}},{t:'Пройти мимо',f:()=>''}]},
  {k:'spring',n:'Целебный родник',ic:'⛲',t:'Чистая вода бьёт из камня.',ch:[
    {t:'Испить: вся стая лечится на 50%',f:R=>{healTeam(R,.5);return'Стая отдохнула.'}},{t:'Искупать одного: случайное существо +20% здоровья до конца забега',f:R=>{const m=R.team[Math.floor(Math.random()*R.team.length)];m.hpB+=.2;return`${PETS[m.pi].n}: здоровье +20%.`}}]},
  {k:'nest',n:'Гнездо грифона',ic:'🪺',t:'В гнезде лежит золотое яйцо. Хозяин где-то рядом.',ch:[
    {t:'Украсть яйцо: бой с элитой, потом редкий талисман',f:R=>{R.evFight={kind:'elite',tal:1};return'Грифон заметил тебя!'}},{t:'Обойти',f:()=>''}]},
  {k:'trader',n:'Бродячий торговец',ic:'🧳',t:'Торговец предлагает свёрток. Что внутри, не говорит.',ch:[
    {t:'Купить свёрток за 50 золота: случайный талисман',need:R=>R.gold>=50,f:R=>{R.gold-=50;return giveTal(R)}},{t:'Отказаться',f:()=>''}]},
  {k:'train',n:'Тренировочная поляна',ic:'🎯',t:'Поляна для тренировок. Можно потренироваться до седьмого пота.',ch:[
    {t:'Тренироваться: 2 случайные карты улучшатся, все теряют 20% здоровья',f:R=>{const s=upRandom(R,2);hurtTeam(R,.2);return s}},{t:'Отдохнуть: лечение 25%',f:R=>{healTeam(R,.25);return'Стая отдохнула.'}}]},
  {k:'guest',n:'Встреча',ic:'🐾',t:'Из кустов выходит существо и смотрит на твою стаю.',ch:[
    {t:'Позвать с собой (гость)',need:R=>R.team.length<5,f:R=>{const o=petOffer(R,[]);if(!o)return'';o.guest=!mp(PETS[o.pi].n).un;return takeOffer(o)}},{t:'Угостить и отпустить: +25 золота за доброту',f:R=>{R.gold+=25;return'+25 золота.'}}]},
  {k:'mirror',n:'Тёмное зеркало',ic:'🪞',t:'В зеркале твоя стая выглядит сильнее, чем есть.',ch:[
    {t:'Вглядеться: копия случайной карты добавится в колоду',f:R=>{const m=R.team[Math.floor(Math.random()*R.team.length)],k=m.cards[Math.floor(Math.random()*m.cards.length)];m.cards.push(k);return`${PETS[m.pi].n}: копия «${T[k].n}».`}},
    {t:'Разбить: −1 жизнь, 2 талисмана',need:R=>R.lives>1,f:R=>{R.lives--;return giveTal(R)+' '+giveTal(R)}},{t:'Уйти',f:()=>''}]},
  {k:'mimic',n:'Подозрительный сундук',ic:'📦',t:'Сундук стоит посреди тропы. Кажется, он дышит.',ch:[
    {t:'Открыть',f:R=>{if(Math.random()<.5){R.gold+=100;return'Внутри 100 золота!'}hurtTeam(R,.25);return'Это мимик! Стая потеряла 25% здоровья.'}},{t:'Не трогать',f:()=>''}]},
  {k:'shaman',n:'Старый шаман',ic:'🪶',t:'Шаман предлагает очищающий ритуал.',ch:[
    {t:'Ритуал: убрать одну карту из колоды',f:R=>{R.pick={mode:'rm',back:'map'};return''}},{t:'Вежливо отказаться',f:()=>''}]},
  {k:'fair',n:'Ярмарка',ic:'🎪',t:'Зазывала предлагает сыграть в напёрстки.',ch:[
    {t:'Поставить 30 золота: половина шансов выиграть 90',need:R=>R.gold>=30,f:R=>{R.gold-=30;if(Math.random()<.5){R.gold+=90;return'Угадал! +90 золота.'}return'Не угадал.'}},{t:'Пройти мимо',f:()=>''}]},
  {k:'star',n:'Звёздный камень',ic:'🌠',t:'Упавшая звезда ещё тёплая.',ch:[
    {t:'Коснуться: +12 опыта всем существам стаи',f:R=>{for(const m of R.team)if(!m.guest)addXp(PETS[m.pi].n,12);return'Стая получила опыт.'}},{t:'Отколоть кусочек: +15 💎',f:R=>{META.stones+=15;return'+15 камней.'}}]},
  {k:'ambush',n:'Засада',ic:'🏹',t:'Тропу перегородили. Придётся драться или отступить.',ch:[
    {t:'Принять бой: двойное золото за победу',f:R=>{R.evFight={kind:'fight',gold2:1};return'В бой!'}},{t:'Отступить: все теряют 20% здоровья',f:R=>{hurtTeam(R,.2);return'Стая отступила с потерями.'}}]},
  {k:'book',n:'Книга заклинаний',ic:'📕',t:'На пне лежит раскрытая книга.',ch:[
    {t:'Изучить: улучшить карту на выбор',f:R=>{R.pick={mode:'up',back:'map'};return''}},{t:'Сжечь: случайное существо Сила +20% до конца забега',f:R=>{const m=R.team[Math.floor(Math.random()*R.team.length)];m.pwB++;return`${PETS[m.pi].n}: Сила +20%.`}}]},
  {k:'spirit',n:'Лесной дух',ic:'🌳',t:'Дух леса просит даров.',ch:[
    {t:'Дать 40 золота: вся стая +10% здоровья до конца забега',need:R=>R.gold>=40,f:R=>{R.gold-=40;for(const m of R.team)m.hpB+=.1;return'Стая окрепла.'}},{t:'Уйти',f:()=>''}]},
  {k:'pact',n:'Кровавый договор',ic:'🩸',t:'Незнакомец протягивает свиток и перо.',ch:[
    {t:'Подписать: вся стая Сила +20%, −1 жизнь',need:R=>R.lives>1,f:R=>{R.lives--;for(const m of R.team)m.pwB++;return'Стая стала сильнее.'}},{t:'Отказаться',f:()=>''}]},
  {k:'camp2',n:'Брошенный лагерь',ic:'⛺',t:'Чужой лагерь, костёр ещё дымится.',ch:[
    {t:'Обыскать: +35 золота',f:R=>{R.gold+=35;return'+35 золота.'}},{t:'Переночевать: лечение 30%',f:R=>{healTeam(R,.3);return'Стая отдохнула.'}}]},
  {k:'rune',n:'Рунный камень',ic:'🗿',t:'Руны светятся слабым светом.',ch:[
    {t:'Забрать камень: талисман',f:R=>giveTal(R)},{t:'Прочесть руны: +20 опыта случайному существу',f:R=>{const l=R.team.filter(m=>!m.guest);const m=l[Math.floor(Math.random()*l.length)];if(m)addXp(PETS[m.pi].n,20);return m?`${PETS[m.pi].n}: +20 опыта.`:''}}]},
  {k:'river',n:'Бурная река',ic:'🌊',t:'Через реку есть брод, а на дне что-то блестит.',ch:[
    {t:'Нырнуть: все теряют 15% здоровья, +45 золота',f:R=>{hurtTeam(R,.15);R.gold+=45;return'+45 золота.'}},{t:'Перейти вброд',f:()=>''}]},
  {k:'oracle',n:'Гадалка',ic:'🔮',t:'Гадалка предлагает узнать будущее.',ch:[
    {t:'Заплатить 20: следующая награда будет на 1 вариант больше',need:R=>R.gold>=20,f:R=>{R.gold-=20;R.forecast=1;return'Будущее стало яснее.'}},{t:'Уйти',f:()=>''}]},
  {k:'forge',n:'Кузница гномов',ic:'⚒',t:'Гномы готовы поработать за плату.',ch:[
    {t:'Заплатить 60: улучшить 3 случайные карты',need:R=>R.gold>=60,f:R=>{R.gold-=60;return upRandom(R,3)}},{t:'Уйти',f:()=>''}]},
  {k:'knight',n:'Призрачный рыцарь',ic:'👻',t:'Рыцарь вызывает твою стаю на поединок.',ch:[
    {t:'Принять вызов: бой с элитой, потом талисман',f:R=>{R.evFight={kind:'elite',tal:0};return'Рыцарь поднимает меч.'}},{t:'Поклониться и уйти',f:()=>''}]},
  {k:'hive',n:'Дикий улей',ic:'🍯',t:'Улей полон мёда.',ch:[
    {t:'Забрать мёд: лечение 40%, но одно существо теряет 15% (укусы)',f:R=>{healTeam(R,.4);const m=R.team[Math.floor(Math.random()*R.team.length)];const d=runDef(m);m.hp=Math.max(1,m.hp-Math.round(d.hp*.15));return'Сладко, но больно.'}},{t:'Не трогать',f:()=>''}]},
  {k:'well',n:'Колодец желаний',ic:'🪙',t:'Говорят, колодец исполняет желания.',ch:[
    {t:'Бросить 25 золота: 60% шанс улучшить случайную карту',need:R=>R.gold>=25,f:R=>{R.gold-=25;return Math.random()<.6?upRandom(R,1):'Ничего не случилось.'}},{t:'Бросить всё золото (от 80): редкий талисман',need:R=>R.gold>=80,f:R=>{R.gold=0;const o=talOffer(R,[],1);if(o)takeOffer(o);return o?`${TAL[o.tk].ic} ${TAL[o.tk].n}`:''}},{t:'Уйти',f:()=>''}]},
  {k:'cart',n:'Сломанная повозка',ic:'🛒',t:'У повозки сломалось колесо.',ch:[
    {t:'Помочь: один Шаг уходит из колоды (колода плотнее)',f:R=>{R.stepD--;return'В колоде на 1 Шаг меньше.'}},{t:'Забрать груз: +45 золота',f:R=>{R.gold+=45;return'+45 золота.'}}]},
];
function upRandom(R,n){const out=[];for(let i=0;i<n;i++){const o=upOffer(R,[]);if(!o)break;out.push(takeOffer(o))}return out.join('; ')||'Нечего улучшать.'}
function hurtTeam(R,f){for(const m of R.team){const d=runDef(m);m.hp=Math.max(1,m.hp-Math.round(d.hp*f))}}
function giveTal(R){const o=talOffer(R,[]);if(!o)return'';return takeOffer(o)}
function pickEvent(R){const all=EVENTS.filter(e=>e.act==null||e.act===R.act),l=all.filter(e=>!R.seenEv.includes(e.k));const e=(l.length?l:all)[Math.floor(Math.random()*(l.length||all.length))];R.seenEv.push(e.k);cdxMark('ev',e.k);return e.k}
/* ---------- end of run: rewards to the meta ---------- */
function runFinish(R){if(R.paid)return R.paid;const log=[],acts=R.act+(R.result==='win'?1:0);
  const st=R.st.nodes*3+R.st.bosses*25+(R.result==='win'?60+R.asc*10:0);giveSt(st,log);
  for(const m of R.team){const n=PETS[m.pi].n;const v=m.guest?4*Math.max(1,acts):2*Math.max(1,acts);giveFr(n,v,log)}
  if(R.result==='win'){META.stats.runWins=(META.stats.runWins||0)+1;META.ascTop=Math.max(META.ascTop||0,R.asc);META.asc=Math.max(META.asc||0,Math.min(10,R.asc+1))}
  META.rh=[{d:Date.now(),res:R.result,asc:R.asc,act:R.act,team:R.team.map(m=>m.pi),nodes:R.st.nodes},...(META.rh||[])].slice(0,20);
  if(R.daily){META.drun=META.drun||{};const o=META.drun[R.daily],sc=R.st.nodes+(R.result==='win'?100:0);if(!o||sc>o.sc)META.drun[R.daily]={sc,res:R.result,act:R.act,nodes:R.st.nodes}}
  R.paid=log;saveMeta();return log}

const dailyTeam=()=>withSeed(daySeed()+99,()=>shuffle([...PETS.keys()]).slice(0,3));
let QBOSS='golem';
const QBF={forest:.85,queen:.85,hydra:.4,witch:.55,golem:.4,ash:.35};
const qbMult=()=>{const f=QBF[QBOSS]||1;if(!metaMode()||sandbox()||!TEAM.length)return f;const l=TEAM.map(i=>mp(PETS[i].n));return f*metaMul(Math.round(l.reduce((a,m)=>a+m.lv,0)/l.length),Math.round(l.reduce((a,m)=>a+m.q,0)/l.length))};

/* ---------- 0.10.0: «Забег» screens ---------- */
const RS={team:[],asc:0};
const runHp=m=>{const d=runDef(m);return[Math.min(m.hp==null?d.hp:m.hp,d.hp),d.hp]};
function runTop(R,title){return`<div class="top"><button class="pill sm" data-act="m-menu">‹ Меню</button><div class="title">${title}</div><span class="rstat">❤ ${R.lives} · 🪙 ${R.gold}</span></div>`}
function runTeamStrip(R){return`<div class="rteam">${R.team.map((m,mi)=>{const p=PETS[m.pi],[h,mx]=runHp(m);return`<button class="rtm" data-act="rt-${mi}"><span class="rwa">${qArt(p,m.q,1)}</span><span class="rtm-lv">${Math.min(20,m.lv+m.rlv)}</span><span class="rtm-n">${p.n}${m.guest?' 🎫':''}</span><span class="rhp"><i style="width:${Math.round(100*h/mx)}%"></i><b>${h}/${mx}</b></span></button>`}).join('')}</div>`}
function runTalStrip(R){return R.talis.length?`<button class="rtal" data-act="rtal">${R.talis.map(k=>TAL[k].ic).join(' ')}<span class="m" style="font-size:11px"> талисманы ${R.talis.length}</span></button>`:`<div class="m" style="font-size:11px">Талисманов пока нет. Их дают элиты, боссы, сокровища и лавка.</div>`}
function runMapHtml(R){const rows=R.map.rows,RH=62,H=rows.length*RH+36,y=r=>H-(r*RH+18+RH/2);
  let ln='';rows.forEach((row,r)=>row.forEach((nd,i)=>nd.to.forEach(j=>{const b=rows[r+1][j],on=R.pos&&R.pos.r===r&&R.pos.i===i||(!R.pos&&r===0&&false),walked=nd.done&&b.done;
    ln+=`<line x1="${nd.x*100}" y1="${y(r)}" x2="${b.x*100}" y2="${y(r+1)}" class="${walked?'wk':on?'nx':''}" vector-effect="non-scaling-stroke"/>`})));
  let nb='';rows.forEach((row,r)=>row.forEach((nd,i)=>{const can=canGo(R,r,i)&&!(R.pos&&!rows[R.pos.r][R.pos.i].done),cur=R.pos&&R.pos.r===r&&R.pos.i===i;
    nb+=`<button class="rnd k-${nd.k} ${nd.done?'dn':''} ${can?'can':''} ${cur?'cur':''}" style="left:${nd.x*100}%;top:${y(r)}px" ${can||cur&&!nd.done?`data-act="rn-${r}-${i}"`:''} title="${NT[nd.k].n}">${NT[nd.k].ic}${nd.k==='boss'?`<span class="rnb">${BOSSES[R.map.boss].n}</span>`:''}</button>`}));
  return`<div class="rmap" style="height:${H}px;background:${ACTS[R.act].bg}">${decoHtml(R)}<svg viewBox="0 0 100 ${H}" preserveAspectRatio="none">${ln}</svg>${nb}</div>
  <div class="rleg">${['fight','elite','event','camp','shop','treasure','boss'].map(k=>`<span>${NT[k].ic} ${NT[k].n}</span>`).join('')}</div>`}
function runStartHtml(){const own=PETS.map((p,i)=>i).filter(i=>mp(PETS[i].n).un).sort((a,b)=>mp(PETS[b].n).lv-mp(PETS[a].n).lv||mp(PETS[b].n).q-mp(PETS[a].n).q);
  RS.asc=Math.min(RS.asc,META.asc||0);
  const tile=i=>{const p=PETS[i],m=mp(p.n),on=RS.team.includes(i);return`<button class="ltl ${on?'rdy':''}" data-act="rs-${i}" style="--qc:${qC(m.q)}"><span class="lt-art">${qArt(p,m.q,1)}</span><span class="lt-lv">${m.lv}</span><span class="fmb">${FAM[p.fam].ic}</span><span class="lt-nm">${p.n}</span>${on?`<span class="rsn">${RS.team.indexOf(i)+1}</span>`:''}</button>`};
  const hist=(META.rh||[]).slice(0,5).map(h=>`<div class="rhist">${h.res==='win'?'🏆':'💀'} <span>${h.team.map(i=>petIc(PETS[i],1)).join('')}</span><span class="m">сложн. ${h.asc} · акт ${h.act+1} · точек ${h.nodes}</span></div>`).join('');
  return`<div class="top"><button class="pill sm" data-act="m-menu">‹ Меню</button><div class="title">Забег</div><span class="m">💎 ${META.stones}</span></div>
  <div class="rintro">Три земли: ${ACTS.map(a=>a.ic+' '+a.n).join(', ')}. На каждой карта с развилками: бои, элиты, события, лагерь, лавка, сокровище и босс в конце. Стая растёт прямо в забеге: новые существа, улучшенные карты «+», талисманы. За забег существа получают опыт, а в конце ты получаешь камни и осколки.</div>
  ${(()=>{const dt=dailyTeam(),dr=(META.drun||{})[dayKey()];return`<div class="rdaily"><div style="flex:1"><b>📅 Забег дня</b><div class="m" style="font-size:11px">Одна стая на всех: уровень 5, Необычные. Карта и враги сегодня одни и те же.${dr?` Твой лучший: ${dr.res==='win'?'🏆 пройден':'акт '+(dr.act+1)+', точек '+dr.nodes}.`:''}</div><div class="rdt">${dt.map(i=>qArt(PETS[i],1,1)).join('')}</div></div><button class="btn main" data-act="rs-daily">Начать</button></div>`})()}
  <h3>Выбери троих (${RS.team.length}/3)</h3><div class="m" style="font-size:12px;margin-bottom:4px">Остальные присоединятся по пути.</div>
  <div class="lib">${own.map(tile).join('')}</div>
  <h3>Сложность</h3><div class="modes">${Array.from({length:(META.asc||0)+1},(_,a)=>`<button class="pill sm ${RS.asc===a?'on':''}" data-act="ra-${a}">${a?'🔺'+a:'Обычная'}</button>`).join('')}</div>
  <div class="m" style="font-size:12px;margin-top:4px">${RS.asc?ASC.slice(1,RS.asc+1).map((t,i)=>`🔺${i+1} ${t}`).join('<br>'):'Победа открывает следующий уровень сложности (всего 10).'}</div>
  ${hist?`<h3>Прошлые забеги</h3>${hist}`:''}
  <div class="acts" style="position:sticky;bottom:0;padding:8px 0;background:var(--bg)"><button class="btn main" data-act="rs-go" ${RS.team.length===3?'':'disabled'}>В путь</button></div>`}
function runPickHtml(R){const pk=R.pick,up=pk.mode==='up';
  return`${runTop(R,up?'Улучшить карту':'Убрать карту')}<div class="m" style="font-size:13px;margin-bottom:6px">${up?'Выбери карту: она станет «+» до конца забега.':'Выбери карту: она уйдёт из колоды до конца забега. У существа остаётся минимум 2 карты.'}</div>
  ${R.team.map((m,mi)=>{const p=PETS[m.pi],d=runDef(m);return`<div class="rpk"><div class="rpk-h">${petIc(p,1)} <b>${p.n}</b></div><div class="slr">${m.cards.map((k,ci)=>{const lock=up?(/\+$/.test(k)?'уже улучшена':''):(m.cards.length<=2?'последние 2 карты':'');
    return up&&!lock?`<button class="lcard" data-act="rpk-${mi}-${ci}" style="--pc:${elVar(T[k].el)}"><div class="h"><span>${T[k].n} → ${T[upCard(k)].n}</span></div><div class="lc-tx">${upDiff(k,d)}</div></button>`:cardMini(k,d,lock,false,`rpk-${mi}-${ci}`)}).join('')}</div></div>`}).join('')}
  ${up||HV()?'':(()=>{const n=Math.min(R.team.length,5)+(R.stepD||0);return`<div class="rpk"><div class="rpk-h">👣 <b>Шаги</b> <span class="m">в колоде ${n}</span></div><button class="draft rof" data-act="rpk-step" ${n>2?'':'disabled'}><span class="rwa">👣</span><span><b>Убрать один Шаг</b><div class="m" style="font-size:11px">${n>2?'Меньше Шагов в руке, чаще приходят карты существ.':'Меньше двух Шагов не бывает.'}</div></span></button></div>`})()}
  <div class="acts"><button class="btn" data-act="rpk-x">${pk.refund?'Отмена (вернуть 🪙'+pk.refund+')':'Отказаться'}</button></div>`}
function renderRun(){const R=META.run;
  if(!R){setApp(runStartHtml());return}
  let h='';
  if(R.scr==='map'){const nd=R.pos&&R.map.rows[R.pos.r][R.pos.i];
    h=`${runTop(R,(R.daily?'📅 ':ACTS[R.act].ic+' ')+'Акт '+(R.act+1)+': '+ACTS[R.act].n)}${runTeamStrip(R)}${runTalStrip(R)}
    <div class="m" style="font-size:12px;margin:6px 0 2px">${nd&&!nd.done?'Эта точка ещё не пройдена: тапни её, чтобы вернуться.':R.pos?'Выбери следующую точку на карте. Путь идёт снизу вверх.':'Выбери, откуда начать путь. Путь идёт снизу вверх, к боссу.'}${R.asc?' · сложность 🔺'+R.asc:''}</div>
    ${runMapHtml(R)}<div style="display:flex;justify-content:flex-end;margin-top:8px"><button class="pill sm" data-act="r-quit">🏳 Сдаться</button></div>`}
  else if(R.scr==='reward'){const o=R.offers||[];
    h=`${runTop(R,'Награда')}${rewardsHtml(R.rwLog)}<h3>Выбери одно</h3>${o.map((x,i)=>offerHtml(x,i,'rr-')).join('')||'<div class="m">Нечего предложить.</div>'}
    <div class="acts"><button class="btn" data-act="rr-skip">Пропустить: +10 🪙</button></div>`}
  else if(R.scr==='treasure'){h=`${runTop(R,'🎁 Сокровище')}<div class="m">В старом сундуке два талисмана. Унести можно один.</div>${(R.offers||[]).map((x,i)=>offerHtml(x,i,'rr-')).join('')}<div class="acts"><button class="btn" data-act="rr-skip">Оставить: +10 🪙</button></div>`}
  else if(R.scr==='camp'){const f=R.asc>=6?25:40;
    h=`${runTop(R,'🔥 Лагерь')}${runTeamStrip(R)}<div class="m">Костёр трещит. Можно сделать одно дело.</div>
    ${R.campUp?`<h3>Какую карту улучшить?</h3>${R.campUp.map((x,i)=>offerHtml(x,i,'cu-')).join('')}<div class="acts"><button class="btn" data-act="cp-back">Назад</button></div>`:
    `<button class="draft rof" data-act="cp-rest"><span class="rwa">💤</span><span><b>Отдых</b><div class="m" style="font-size:11px">Вся стая лечится на ${f}% здоровья.</div></span></button>
    <button class="draft rof" data-act="cp-up"><span class="rwa">⚒</span><span><b>Точить когти</b><div class="m" style="font-size:11px">Улучшить одну карту из трёх на выбор.</div></span></button>
    <button class="draft rof" data-act="cp-train"><span class="rwa">🎯</span><span><b>Тренировка</b><div class="m" style="font-size:11px">Вся стая +1 уровень до конца забега.</div></span></button>`}`}
  else if(R.scr==='shop'){
    h=`${runTop(R,'🛒 Лавка')}<div class="m">Торговец раскладывает товар.</div>${R.shop.map((x,i)=>x.sold?`<div class="draft rof sold"><span class="rwa">✓</span><span class="m">Продано</span></div>`:offerHtml(x,i,'sh-',x.p).replace('<button ',`<button ${R.gold<x.p?'disabled ':''}`)).join('')}
    <div class="acts"><button class="btn main" data-act="sh-leave">Уйти</button></div>`}
  else if(R.scr==='event'){const e=EVENTS.find(x=>x.k===R.ev);
    h=`${runTop(R,'❓ Событие')}<div class="rev"><div class="rev-ic">${e.ic}</div><div><b>${e.n}</b><br>${e.t}</div></div>
    ${R.evRes!=null?`<div class="rev-res">${R.evRes||'Ничего не произошло.'}</div><div class="acts">${R.evFight?`<button class="btn main" data-act="ev-fight">В бой</button>`:`<button class="btn main" data-act="ev-ok">Дальше</button>`}</div>`:
    e.ch.map((c,j)=>`<button class="draft rof" data-act="ec-${j}" ${c.need&&!c.need(R)?'disabled':''}><span>${c.t}</span></button>`).join('')}`}
  else if(R.scr==='pick')h=runPickHtml(R);
  else if(R.scr==='end'){const log=runFinish(R),win=R.result==='win';
    h=`<div class="top"><div class="title">${win?'🏆 Забег пройден!':'💀 Забег окончен'}</div></div>
    <div class="rintro">${win?`Все три земли пройдены${R.asc?' на сложности 🔺'+R.asc:''}.${R.asc<10?' Открыта сложность 🔺'+Math.min(10,R.asc+1)+'.':''}`:`Стая дошла до акта ${R.act+1}: ${ACTS[R.act].n}.`}</div>
    <div class="rstats"><span>⚔️ боёв ${R.st.fights}</span><span>💀 элит ${R.st.elites}</span><span>👑 боссов ${R.st.bosses}</span><span>🗡 врагов ${R.st.kills}</span><span>🪙 ${R.st.gold}</span></div>
    ${runTeamStrip(R)}${runTalStrip(R)}<h3>Добыча</h3>${rewardsHtml(log)}<div class="acts"><button class="btn main" data-act="r-close">В меню</button></div>`}
  if(ui.rtal)h+=`<div class="over" data-act="rtal-x"><div class="box"><h2>Талисманы</h2>${R.talis.map(k=>`<div class="shi"><span class="rwa">${TAL[k].ic}</span><span><b>${TAL[k].n}</b><div class="m" style="font-size:12px">${TAL[k].t}</div></span></div>`).join('')}<div class="acts"><button class="btn main" data-act="rtal-x">Закрыть</button></div></div></div>`;
  if(ui.rt!=null&&R.team[ui.rt]){const m=R.team[ui.rt],p=PETS[m.pi],d=runDef(m),[hh,mx]=runHp(m);
    h+=`<div class="over" data-act="rt-x"><div class="box lsheet" style="--qc:${qC(m.q)}"><div class="lhero"><span class="lbig">${qArt(p,m.q)}</span><div><h2>${p.n}</h2><div class="m">${QN[m.q]} · ур. ${m.lv+(m.rlv||0)}${m.rlv?' ('+m.lv+' в Библиотеке +'+m.rlv+' в забеге)':''}${m.guest?' · гость':''}</div><div class="stt"><span>❤ ${hh}/${mx}</span><span>💪 ${d.pw}</span></div></div></div>
    <div class="slr">${m.cards.map(k=>cardMini(k,d)).join('')}</div><div class="acts"><button class="btn main" data-act="rt-x">Закрыть</button></div></div></div>`}
  setApp(h)}
function runLeave(){const R=META.run;if(!R)return;const nd=R.pos&&R.map.rows[R.pos.r][R.pos.i];if(nd)nd.done=true;
  R.offers=null;R.shop=null;R.ev=null;R.evRes=null;R.evFight=null;R.campUp=null;R.pick=null;R.scr='map';
  if(nd&&nd.k==='boss')runNextAct(R);saveMeta()}
function runNextAct(R){if(R.act>=ACTS.length-1){R.result='win';R.scr='end';return}
  R.act++;R.map=R.daily?withSeed(daySeed()+R.act*7919,()=>genMap(R.act)):genMap(R.act);R.pos=null;for(const m of R.team)m.hp=runDef(m).hp;toast(`${ACTS[R.act].ic} Акт ${R.act+1}: ${ACTS[R.act].land}. Стая полностью вылечилась.`)}
function runEnter(r,i){const R=META.run,nd=R.map.rows[r][i];R.pos={r,i};questEv('node');saveMeta();
  if(['fight','elite','boss'].includes(nd.k)){runFight(nd.k);return}
  if(nd.k==='event'){if(!R.ev){R.ev=pickEvent(R);R.evRes=null}R.scr='event'}
  else if(nd.k==='camp'){R.scr='camp';R.campUp=null}
  else if(nd.k==='shop'){if(!R.shop)R.shop=shopGen(R);R.scr='shop'}
  else if(nd.k==='treasure'){if(!R.offers){const a=talOffer(R,[]),b=a&&talOffer(R,[a]);R.offers=[a,b].filter(Boolean)}R.scr='treasure'}
  saveMeta();render()}
function runPickDone(){const R=META.run,pk=R.pick;R.pick=null;if(pk.back==='shop'){R.scr='shop';saveMeta()}else runLeave()}
function runClick(act){
  if(act==='m-run'){CTX=null;NEXT=null;G={phase:'run'};resetPlace();RS.team=[];RS.asc=META.asc||0;ui.rt=null;ui.rtal=false;render();return true}
  if(!G||G.phase!=='run'&&G.phase!=='battle'&&G.phase!=='place')return false;
  const R=META.run;
  if(act==='run-map'||act==='run-rw'||act==='run-end'){if(!R)return false;
    if(act==='run-rw'){R.rwLog=G.rw;const b=R.evBonus;if(b){if(b.gold2){const g=(G.rw||[]).find(x=>x.k==='gold');if(g){R.gold+=g.v;R.rwLog=[...R.rwLog,{k:'gold',v:g.v}]}}if(b.tal!=null){const o=talOffer(R,R.offers||[],b.tal);if(o)(R.offers=R.offers||[]).unshift(o)}}}
    R.evBonus=null;CTX=null;G={phase:'run'};saveMeta();render();return true}
  if(G.phase==='place'&&act==='to-pick'&&CTX&&CTX.kind==='run'){CTX=null;G={phase:'run'};render();return true}
  if(G.phase!=='run')return false;
  if(act==='rs-daily'&&!R){newRun(dailyTeam(),0,true);render();return true}
  if(act.startsWith('rs-')&&!R){if(act==='rs-go'){if(RS.team.length===3){newRun(RS.team.slice(),RS.asc);render()}return true}
    const i=+act.slice(3);if(RS.team.includes(i))RS.team=RS.team.filter(x=>x!==i);else if(RS.team.length<3)RS.team.push(i);render();return true}
  if(act.startsWith('ra-')){RS.asc=+act.slice(3);render();return true}
  if(!R)return false;
  if(act==='rtal'){ui.rtal=true;render();return true}
  if(act==='rtal-x'){if(bgHit(act)||LASTE&&LASTE.target.tagName==='BUTTON'){ui.rtal=false;render()}return true}
  if(act.startsWith('rt-')){if(act==='rt-x'){if(bgHit(act)||LASTE&&LASTE.target.tagName==='BUTTON'){ui.rt=null;render()}}else{ui.rt=+act.slice(3);render()}return true}
  if(act.startsWith('rn-')){const[r,i]=act.slice(3).split('-').map(Number);runEnter(r,i);return true}
  if(act==='r-quit'){askYes('Сдаться и закончить забег? Добыча за пройденное сохранится.','🏳 Сдаться',()=>{R.result='lose';R.scr='end';saveMeta();render()});return true}
  if(act==='r-close'){runFinish(R);META.run=null;saveMeta();G={phase:'menu'};render();return true}
  if(act.startsWith('rr-')){if(act==='rr-skip'){R.gold+=10;runLeave();render();return true}
    const o=(R.offers||[])[+act.slice(3)];if(!o)return true;if(o.k==='rm'){R.pick={mode:'rm',back:'map'};R.scr='pick';render();return true}
    toast(takeOffer(o));runLeave();render();return true}
  if(act==='cp-rest'){healTeam(R,R.asc>=6?.25:.4);toast('Стая отдохнула.');runLeave();render();return true}
  if(act==='cp-up'){const l=[];for(let i=0;i<3;i++){const o=upOffer(R,l);if(o)l.push(o)}R.campUp=l;saveMeta();render();return true}
  if(act==='cp-back'){R.campUp=null;render();return true}
  if(act.startsWith('cu-')){const o=R.campUp[+act.slice(3)];if(o)toast(takeOffer(o));runLeave();render();return true}
  if(act==='cp-train'){for(const m of R.team)m.rlv=Math.min(12,m.rlv+1);toast('Вся стая +1 уровень.');runLeave();render();return true}
  if(act.startsWith('sh-')){if(act==='sh-leave'){runLeave();render();return true}
    const o=R.shop[+act.slice(3)];if(!o||o.sold||R.gold<o.p)return true;
    if(o.k==='pet'&&R.team.length>=5){toast('В стае уже 5 существ.');render();return true}
    R.gold-=o.p;o.sold=1;if(o.k==='rm'){R.pick={mode:'rm',back:'shop',refund:o.p,oi:+act.slice(3)};R.scr='pick'}else toast(takeOffer(o));saveMeta();render();return true}
  if(act.startsWith('ec-')){const e=EVENTS.find(x=>x.k===R.ev),c=e.ch[+act.slice(3)];if(!c||c.need&&!c.need(R))return true;
    R.evRes=c.f(R)||'';if(R.pick){R.pick.back='map';R.scr='pick'}saveMeta();render();return true}
  if(act==='ev-ok'){runLeave();render();return true}
  if(act==='ev-fight'){const f=R.evFight;R.evFight=null;R.evBonus=f;R.evRes=null;runFight(f.kind);return true}
  if(act.startsWith('rpk-')){const pk=R.pick;if(!pk)return true;
    if(act==='rpk-x'){if(pk.refund){R.gold+=pk.refund;if(R.shop[pk.oi])R.shop[pk.oi].sold=0}runPickDone();render();return true}
    if(act==='rpk-step'){if(pk.mode==='up'||Math.min(R.team.length,5)+(R.stepD||0)<=2)return true;R.stepD=(R.stepD||0)-1;toast('👣 Один Шаг убран из колоды.');runPickDone();render();return true}
    const[mi,ci]=act.slice(4).split('-').map(Number),m=R.team[mi];if(!m)return true;const k=m.cards[ci];
    if(pk.mode==='up'){if(/\+$/.test(k))return true;m.cards[ci]=upCard(k);toast(`${T[k].n} → ${T[m.cards[ci]].n}`)}
    else{if(m.cards.length<=2)return true;m.cards.splice(ci,1);toast(`«${T[k].n}» убрана из колоды.`)}
    runPickDone();render();return true}
  return false}
function runCheat(k){const R=META.run;if(!R)return;
  if(k==='gold')R.gold+=200;if(k==='life')R.lives++;if(k==='talis')toast(giveTal(R));
  if(k==='skip'&&G.phase==='run'){if(R.scr!=='map'&&R.scr!=='end'||R.pos&&!R.map.rows[R.pos.r][R.pos.i].done)runLeave();else{const rows=R.map.rows,r=R.pos?R.pos.r+1:0;if(r<rows.length){const i=rows[r].findIndex((_,j)=>canGo(R,r,j));if(i>=0){R.pos={r,i};runLeave()}}}}
  if(k==='act'&&G.phase==='run'){R.pos={r:R.map.rows.length-1,i:0};runLeave()}}

