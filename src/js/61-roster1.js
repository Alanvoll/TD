/* ---------- v0.7.0: 50 pets (10 families x 5 classes), numbers x2, generic Шаг ---------- */
// 0.7.1: cards follow the creature body; every pet has 2-3 own cards and at most 1 shared
// ▼ presets
const SB={
  sh:{shield:4},hl:{heal:4},col:{colDmg:2},frt:{frontDmg:2},ash:{allShield:2},ahl:{allHeal:2},drw:{draw:1},mrk:{markCol:2},evd:{evade:1}};
function subTexts(s){
  if(s.shield)return['щит '+s.shield+' себе','Пет получает щит '+s.shield+'.'];
  if(s.heal)return['+'+s.heal+' здоровья себе','Пет лечится на '+s.heal+'.'];
  if(s.colDmg)return[s.colDmg+' урона ближайшему в столбце',s.colDmg+' урона ближайшему врагу в столбце этого пета.'];
  if(s.frontDmg)return[s.frontDmg+' урона по фронту',s.frontDmg+' урона всем врагам в переднем ряду.'];
  if(s.allShield)return['щит '+s.allShield+' всем','Все свои получают щит '+s.allShield+'.'];
  if(s.allHeal)return['+'+s.allHeal+' здоровья всем','Все свои лечатся на '+s.allHeal+'.'];
  if(s.draw)return['рука +1','Лимит руки +1 на следующий ход.'];
  if(s.markCol)return['метка ближайшему','Метка на '+s.markCol+' хода ближайшему врагу в столбце.'];
  if(s.evade)return['уклонение себе','Пет уклоняется от первого удара в этом ходу.'];
  return['',''];
}
// card templates; every card has its own element (el). cost '*' = the element written after @ in a pet's list; nv = the name of that element's variant (a different element is a different card)
// shared cards: one meaning, same body part (claws, fangs, shell, horns, sting, wings, tentacles, breath...)
const CT={
  claw:{n:'Удар когтем',el:'e',cost:{},spd:3,area:'melee',dmg:5,sub:'col'},
  bite:{n:'Укус',cost:{'*':1},spd:3,area:'melee',dmg:8,sub:'hl',nv:{d:'Гнилой укус',n:'Цепкий укус'}},
  shell:{n:'Панцирь',el:'e',cost:{},spd:5,area:'self',shield:6,sub:'hl'},
  ram:{n:'Таран',cost:{'*':1},spd:2,area:'melee',dmg:9,push:1,sub:'sh',nv:{d:'Адский таран'}},
  sting:{n:'Жало',cost:{'*':1},spd:4,area:'cell',dmg:5,slow:2,sub:'ahl',nv:{f:'Раскалённое жало',w:'Жгучая нить'}},
  dive:{n:'Пикирование',el:'a',cost:{a:1,any:1},spd:5,area:'cell',dmg:9,sub:'hl'},
  blood:{n:'Кровопийца',cost:{'*':1},spd:4,area:'cell',dmg:5,drain:1,sub:'evd',nv:{z:'Хоботок'}},
  ice:{n:'Ледяное касание',el:'w',cost:{w:1},spd:3,area:'cell',dmg:4,freeze:1,sub:'sh'},
  tent:{n:'Хлёст щупалец',cost:{'*':1,any:1},spd:3,area:'hline',dmg:4,pull:1,sub:'col',nv:{d:'Тёмные щупальца'}},
  wave:{n:'Волна',el:'w',cost:{w:1},spd:2,area:'col',dmg:6,sub:'drw'},
  breath:{n:'Дыхание дракона',cost:{'*':1,any:1},spd:2,area:'row',dmg:6,sub:'frt',nv:{e:'Каменное дыхание',f:'Огненное дыхание',l:'Сияющее дыхание',d:'Тёмное дыхание'}},
  discharge:{n:'Разряд',el:'z',cost:{z:1,any:1},spd:3,area:'cell',dmg:6,chain:4,sub:'drw'},
  beam:{n:'Луч света',el:'l',cost:{l:1},spd:3,area:'col',dmg:5,mark:2,sub:'ahl'},
  // Звери
  bear_hug:{n:'Медвежья хватка',el:'e',cost:{e:1},spd:3,area:'melee',dmg:7,root:2,sub:'sh'},
  bear_hide:{n:'Толстая шкура',el:'e',cost:{e:1},spd:5,area:'self',shield:10,cleanse:1,sub:'hl'},
  wolf_hunt:{n:'Охота стаей',el:'f',cost:{f:1,any:1},spd:3,area:'hline',dmg:4,mark:2,sub:'col'},
  wolf_howl:{n:'Вой',el:'f',cost:{f:1},spd:4,area:'enemies',dmg:2,slow:1,sub:'frt'},
  deer_antler:{n:'Рога',el:'n',cost:{n:1},spd:3,area:'melee',dmg:8,push:1,sub:'ahl'},
  deer_dew:{n:'Лесная роса',el:'n',cost:{},spd:2,area:'allies',heal:3,sub:'hl'},
  deer_spirit:{n:'Дух леса',el:'l',cost:{l:1,any:1},spd:4,area:'ally',heal:10,cleanse:1,immune:2,sub:'drw'},
  fox_fire:{n:'Лисий огонь',el:'f',cost:{f:1},spd:4,area:'cell',dmg:7,ign:2,sub:'evd'},
  fox_feint:{n:'Обманный финт',el:'f',cost:{},spd:5,area:'cell',dmg:4,strip:1,sub:'evd'},
  owl_eye:{n:'Зоркий глаз',el:'a',cost:{},spd:5,area:'col',dmg:3,mark:2,sub:'drw'},
  owl_hoot:{n:'Ночной крик',el:'d',cost:{d:1},spd:3,area:'cross',dmg:2,stun:1,sub:'col'},
  // Растения
  oak_branch:{n:'Удар веткой',el:'e',cost:{},spd:3,area:'melee',dmg:5,push:1,sub:'sh'},
  oak_roots:{n:'Корни',el:'e',cost:{e:1},spd:3,area:'col',dmg:2,root:2,sub:'sh'},
  oak_bark:{n:'Дубовая кора',el:'e',cost:{e:1,any:1},spd:2,area:'allies',shield:4,sub:'ash'},
  cact_needles:{n:'Залп игл',el:'f',cost:{f:1,any:1},spd:3,area:'row',dmg:3,strip:1,sub:'frt'},
  cact_hug:{n:'Колючие объятия',el:'e',cost:{e:1},spd:3,area:'melee',dmg:8,root:1,sub:'col'},
  cact_spine:{n:'Иголка',el:'f',cost:{},spd:4,area:'cell',dmg:6,sub:'col'},
  lotus_nectar:{n:'Нектар',el:'l',cost:{},spd:3,area:'ally',heal:7,sub:'ahl'},
  lotus_bloom:{n:'Цветение',el:'w',cost:{w:1,any:1},spd:2,area:'allies',heal:3,cleanse:1,sub:'hl'},
  fly_snap:{n:'Захлоп',el:'n',cost:{n:1},spd:5,area:'cell',dmg:7,root:1,sub:'evd'},
  fly_sap:{n:'Липкий сок',el:'n',cost:{},spd:5,area:'cell',trap:{dmg:8,ic:'🍯'},sub:'col'},
  sun_bath:{n:'Фотосинтез',el:'l',cost:{},spd:5,area:'self',heal:6,draw:1,sub:'ahl'},
  sun_seeds:{n:'Град семечек',el:'f',cost:{f:1,any:1},spd:2,area:'enemies',dmg:3,sub:'drw'},
  // Насекомые
  beetle_toss:{n:'Подбросить',el:'e',cost:{e:1,any:1},spd:3,area:'melee',dmg:7,push:1,slow:2,sub:'sh'},
  beetle_horn:{n:'Рог жука',el:'e',cost:{e:1},spd:2,area:'melee',dmg:9,sub:'sh'},
  mantis_strike:{n:'Удар серпами',el:'a',cost:{a:1,any:1},spd:4,area:'cell',dmg:8,exec:4,sub:'sh'},
  mantis_slash:{n:'Добивание',el:'a',cost:{},spd:4,area:'cell',dmg:5,exec:2,sub:'col'},
  mantis_lunge:{n:'Молниеносный выпад',el:'n',cost:{n:1},spd:5,area:'melee',dmg:8,sub:'evd'},
  bee_honey:{n:'Мёд',el:'l',cost:{},spd:4,area:'ally',heal:5,cleanse:1,sub:'ahl'},
  bee_dance:{n:'Танец пчёл',el:'a',cost:{a:1,any:1},spd:2,area:'allies',heal:2,evade:1,sub:'drw'},
  mosq_buzz:{n:'Звон',el:'z',cost:{z:1},spd:5,area:'hline',dmg:4,slow:2,sub:'col'},
  mosq_prick:{n:'Укол',el:'z',cost:{},spd:5,area:'cell',dmg:4,mark:1,sub:'evd'},
  spider_web:{n:'Паутина',el:'d',cost:{},spd:5,area:'cell',trap:{dmg:6,freeze:1,ic:'🕸'},sub:'col'},
  spider_venom:{n:'Яд',el:'z',cost:{z:1},spd:3,area:'cell',dmg:5,ign:3,sub:'hl'},
  spider_cocoon:{n:'Кокон',el:'d',cost:{d:1,any:1},spd:4,area:'cell',dmg:4,stun:2,sub:'drw'},
  // Магические
  uni_horn:{n:'Рог света',el:'l',cost:{l:1},spd:3,area:'melee',dmg:7,exec:6,sub:'ahl'},
  uni_shield:{n:'Сияющий щит',el:'l',cost:{l:1,any:1},spd:5,area:'allies',shield:2,cleanse:1,sub:'ash'},
  uni_hoof:{n:'Удар копытом',el:'l',cost:{},spd:3,area:'melee',dmg:5,push:1,sub:'sh'},
  grif_rend:{n:'Разорвать',el:'a',cost:{a:1},spd:3,area:'melee',dmg:7,exec:4,sub:'sh'},
  grif_wing:{n:'Удар крылом',el:'a',cost:{},spd:4,area:'hline',dmg:3,push:1,sub:'col'},
  fairy_dust:{n:'Пыльца фей',el:'n',cost:{n:1},spd:3,area:'sq2',dmg:5,sub:'drw'},
  fairy_heal:{n:'Исцеление',el:'l',cost:{l:1},spd:4,area:'ally',heal:8,immune:2,sub:'sh'},
  fairy_wings:{n:'Крылышки',el:'l',cost:{},spd:5,area:'ally',heal:4,evade:1,sub:'ahl'},
  djinn_whirl:{n:'Вихрь джинна',el:'a',cost:{a:1},spd:5,area:'hline',dmg:6,push:1,sub:'evd'},
  djinn_mirage:{n:'Мираж',el:'a',cost:{},spd:5,area:'ally',evade:1,shield:3,sub:'mrk'},
  djinn_sand:{n:'Песчаная буря',el:'e',cost:{e:1,any:1},spd:4,area:'sq2',dmg:5,slow:1,sub:'drw'},
  siren_song:{n:'Песнь сирены',el:'w',cost:{w:1,any:1},spd:2,area:'enemies',dmg:4,slow:2,sub:'drw'},
  mermaid_pearl:{n:'Жемчужина',el:'w',cost:{},spd:4,area:'cell',dmg:3,stun:1,sub:'ahl'},
  // Нежить
  bone_throw:{n:'Бросок кости',el:'n',cost:{},spd:3,area:'cell',dmg:4,sub:'sh'},
  bone_shield:{n:'Костяной щит',el:'n',cost:{n:1},spd:5,area:'self',shield:8,sub:'ash'},
  bone_bash:{n:'Удар щитом',el:'d',cost:{d:1},spd:3,area:'melee',dmg:6,push:1,sub:'sh'},
  zombie_rot:{n:'Гнилой удар',el:'d',cost:{},spd:3,area:'melee',dmg:4,slow:2,sub:'col'},
  zombie_rise:{n:'Неупокоенный',el:'d',cost:{d:1},spd:5,area:'self',heal:6,sub:'sh'},
  ghost_comfort:{n:'Утешение',el:'n',cost:{},spd:5,area:'ally',heal:6,sub:'ahl'},
  ghost_drain:{n:'Высасывание',el:'d',cost:{d:1},spd:3,area:'melee',dmg:6,drain:1,sub:'hl'},
  vamp_swarm:{n:'Стая мышей',el:'d',cost:{d:1,any:1},spd:4,area:'sq2',dmg:3,sub:'evd'},
  vamp_mist:{n:'Туман',el:'d',cost:{},spd:5,area:'self',evade:1,heal:2,sub:'mrk'},
  lich_nova:{n:'Ледяная волна',el:'w',cost:{w:1,any:1},spd:2,area:'row',dmg:5,slow:2,sub:'drw'},
  lich_curse:{n:'Проклятие',el:'d',cost:{d:1},spd:3,area:'cell',dmg:4,mark:2,ign:3,sub:'col'},
  // Механизмы
  robot_piston:{n:'Поршень',el:'n',cost:{n:1},spd:3,area:'melee',dmg:5,push:1,sub:'sh'},
  robot_armor:{n:'Бронеплиты',el:'n',cost:{n:1,any:1},spd:5,area:'self',shield:10,sub:'ash'},
  robot_laser:{n:'Лазер',el:'n',cost:{},spd:3,area:'col',dmg:3,sub:'sh'},
  scorp_claws:{n:'Клешни',el:'n',cost:{n:1,any:1},spd:2,area:'melee',dmg:9,root:1,sub:'frt'},
  scorp_flame:{n:'Огнемёт',el:'f',cost:{},spd:3,area:'hline',dmg:2,ign:2,sub:'col'},
  fix_repair:{n:'Починка',el:'n',cost:{n:1},spd:4,area:'ally',heal:10,cleanse:1,sub:'sh'},
  fix_nails:{n:'Гвоздомёт',el:'e',cost:{e:1},spd:3,area:'cell',dmg:6,sub:'sh'},
  coil_shock:{n:'Электрокольца',el:'n',cost:{n:1},spd:4,area:'cell',dmg:6,root:2,sub:'evd'},
  snake_strike:{n:'Бросок змеи',el:'z',cost:{},spd:5,area:'cell',dmg:5,sub:'evd'},
  drone_scan:{n:'Сканер',el:'n',cost:{n:1},spd:5,area:'enemies',mark:1,dmg:2,sub:'drw'},
  drone_jam:{n:'Глушилка',el:'z',cost:{},spd:4,area:'cell',dmg:2,stun:1,sub:'col'},
  // Элементали
  golem_skin:{n:'Каменная кожа',el:'e',cost:{},spd:5,area:'self',shield:4,immune:1,sub:'hl'},
  golem_quake:{n:'Трещина',el:'e',cost:{e:1,any:1},spd:1,area:'row',dmg:6,sub:'ash'},
  fire_fist:{n:'Огненный кулак',el:'f',cost:{f:1},spd:3,area:'melee',dmg:6,ign:2,sub:'frt'},
  fire_blast:{n:'Взрыв',el:'f',cost:{f:1,any:1},spd:2,area:'cross',dmg:6,sub:'frt'},
  fire_sparks:{n:'Искры',el:'f',cost:{},spd:4,area:'cell',dmg:4,ign:1,sub:'col'},
  water_spring:{n:'Источник',el:'l',cost:{l:1},spd:3,area:'ally',heal:10,cleanse:1,sub:'ahl'},
  water_splash:{n:'Целебные брызги',el:'w',cost:{},spd:4,area:'ally',heal:5,shield:2,sub:'hl'},
  wind_gust:{n:'Порыв',el:'a',cost:{a:1},spd:5,area:'cell',dmg:7,push:1,sub:'evd'},
  wind_storm:{n:'Смерч',el:'a',cost:{a:1,any:1},spd:2,area:'sq2',dmg:6,sub:'drw'},
  wind_slice:{n:'Воздушный клинок',el:'a',cost:{},spd:5,area:'cell',dmg:5,sub:'evd'},
  spark_ball:{n:'Шаровая молния',el:'z',cost:{z:1,any:2},spd:1,area:'enemies',dmg:5,sub:'drw'},
  spark_over:{n:'Перегрузка',el:'a',cost:{a:1},spd:3,area:'cross',dmg:4,slow:2,sub:'col'},
  // Демоны
  cerb_bite:{n:'Тройной укус',el:'d',cost:{d:1,any:1},spd:3,area:'hline',dmg:6,ign:1,sub:'sh'},
  cerb_gate:{n:'Страж врат',el:'f',cost:{},spd:5,area:'allies',shield:2,sub:'sh'},
  imp_fire:{n:'Адское пламя',el:'f',cost:{f:1},spd:3,area:'cross',dmg:3,ign:2,sub:'frt'},
  imp_fork:{n:'Вилы',el:'d',cost:{d:1,any:1},spd:2,area:'melee',dmg:9,sub:'frt'},
  goat_rite:{n:'Кровавый обряд',el:'d',cost:{},spd:3,area:'allies',heal:4,hpcost:4,sub:'hl'},
  goat_flame:{n:'Пламя преисподней',el:'f',cost:{f:1},spd:2,area:'hline',dmg:4,ign:1,sub:'hl'},
  cat_pounce:{n:'Прыжок из тьмы',el:'d',cost:{d:1,any:1},spd:4,area:'cross',dmg:4,mark:2,sub:'drw'},
  cat_shadow:{n:'Удар из тени',el:'z',cost:{z:1},spd:5,area:'cell',dmg:6,exec:4,sub:'evd'},
  chaos_rift:{n:'Разлом',el:'z',cost:{z:1,any:1},spd:1,area:'sq2',dmg:6,ign:2,sub:'drw'},
  chaos_curse:{n:'Порча',el:'z',cost:{},spd:4,area:'cell',dmg:3,mark:2,slow:2,sub:'col'},
  // Аберрации
  slime_glob:{n:'Ком слизи',el:'w',cost:{w:1},spd:2,area:'cell',dmg:5,slow:2,sub:'sh'},
  slime_ooze:{n:'Лужа слизи',el:'z',cost:{z:1,any:1},spd:4,area:'row',dmg:3,slow:2,sub:'ash'},
  squid_beak:{n:'Клюв',el:'w',cost:{},spd:3,area:'melee',dmg:6,sub:'col'},
  squid_dash:{n:'Рывок кальмара',el:'z',cost:{z:1},spd:5,area:'cell',dmg:7,sub:'evd'},
  jelly_glow:{n:'Свечение',el:'w',cost:{},spd:3,area:'allies',heal:2,cleanse:1,sub:'ahl'},
  jelly_burn:{n:'Ожог',el:'z',cost:{z:1},spd:3,area:'hline',dmg:4,slow:2,sub:'hl'},
  eye_gaze:{n:'Взгляд',el:'z',cost:{z:1},spd:5,area:'cell',dmg:4,stun:1,sub:'evd'},
  eye_beam:{n:'Луч глаза',el:'d',cost:{d:1,any:1},spd:4,area:'col',dmg:5,sub:'col'},
  eye_blink:{n:'Моргание',el:'z',cost:{},spd:5,area:'cell',dmg:4,mark:2,sub:'evd'},
  octo_ink:{n:'Чернила',el:'w',cost:{w:1,any:1},spd:5,area:'enemies',slow:2,dmg:3,sub:'drw'},
  octo_squeeze:{n:'Присоски',el:'d',cost:{},spd:3,area:'cell',dmg:5,root:2,sub:'col'},
  // Драконы
  dragon_scales:{n:'Чешуя',el:'e',cost:{},spd:5,area:'self',shield:4,sub:'ash'},
  dragon_tail:{n:'Удар хвостом',el:'e',cost:{e:1},spd:3,area:'hline',dmg:4,push:1,sub:'sh'},
  drake_bite:{n:'Огненный укус',el:'f',cost:{f:1},spd:3,area:'melee',dmg:7,ign:1,sub:'hl'},
  drake_dash:{n:'Наскок',el:'f',cost:{},spd:4,area:'cell',dmg:5,sub:'col'},
  gold_glow:{n:'Золотое сияние',el:'l',cost:{l:1},spd:2,area:'allies',heal:3,sub:'hl'},
  gold_wing:{n:'Крыло-щит',el:'l',cost:{},spd:4,area:'ally',shield:4,heal:2,sub:'ahl'},
  wyv_tail:{n:'Ядовитый хвост',el:'z',cost:{z:1},spd:4,area:'cell',dmg:5,ign:2,sub:'evd'},
  wyv_shriek:{n:'Визг',el:'a',cost:{},spd:5,area:'hline',dmg:3,slow:1,sub:'evd'},
  dark_terror:{n:'Ужас',el:'z',cost:{z:1,any:1},spd:4,area:'cell',dmg:5,stun:2,sub:'hl'},
  dark_shadow:{n:'Тень крыльев',el:'d',cost:{},spd:4,area:'col',dmg:4,slow:1,sub:'col'},
};
// families: one passive each, works for a single pet
Object.assign(FAM,{
  beast:{n:'Звери',ic:'🐾',t:['когда здоровья половина или меньше, его удары наносят +'+K+' урона']},
  plant:{n:'Растения',ic:'🌿',t:['в конце хода лечится на '+K+', если в этом ходу не получал урона']},
  insect:{n:'Насекомые',ic:'🐞',t:['его плохие эффекты на врагах длятся на 1 ход дольше']},
  magic:{n:'Магические',ic:'✨',t:['за один удар получает не больше '+3*K+' урона']},
  undead:{n:'Нежить',ic:'💀',t:['погибнув, становится призраком до конца следующего хода: урона не получает, его карты играются, затем погибает']},
  mech:{n:'Механизмы',ic:'⚙️',t:['один раз за бой после гибели отключается до конца хода (его карты не срабатывают), со следующего хода возвращается с 10% здоровья']},
  elem:{n:'Элементали',ic:'🌀',t:['его карты, ушедшие в сброс несыгранными, дают на 1 стихию больше']},
  demon:{n:'Демоны',ic:'😈',t:['если не хватает стихий на его карту, платит '+2*K+' здоровья за каждую недостающую']},
  aberr:{n:'Аберрации',ic:'👁️',t:['кто ударит его картой, получает '+K+' урона в ответ']},
  dragon:{n:'Драконы',ic:'🐉',t:['его удары по врагам с половиной здоровья или меньше наносят +'+K+' урона']},
});
const CLS={
  guard:{n:'Страж',ic:'🛡',au:'hog',role:'def'},
  fighter:{n:'Боец',ic:'⚔️',au:'fox',role:'atk'},
  healer:{n:'Целитель',ic:'💚',au:'frog',role:'sup'},
  agile:{n:'Ловкач',ic:'💨',au:'bat',role:'atk'},
  sage:{n:'Мудрец',ic:'🔮',au:'owl',role:'ctl'},
};
// name, emoji, family, class, hp, move, Сила, (unused), cards (a pet has no element of its own, every card has one)
const R70=[
  ['Медведь','🐻','beast','guard',40,'orth',0,0,['claw','bear_hug','bear_hide']],
  ['Волк','🐺','beast','fighter',25,'king',1,0,['bite@f','wolf_hunt','wolf_howl']],
  ['Олень','🦌','beast','healer',29,'king',0,0,['deer_antler','deer_dew','deer_spirit']],
  ['Лиса','🦊','beast','agile',30,'knight',1,1,['claw','fox_fire','fox_feint']],
  ['Сова','🦉','beast','sage',26,'rook2',0,0,['dive','owl_eye','owl_hoot']],
  ['Дубовик','🌳','plant','guard',38,'orth',0,-1,['oak_branch','oak_roots','oak_bark']],
  ['Колючник','🌵','plant','fighter',30,'orth',1,0,['cact_needles','cact_hug','cact_spine']],
  ['Лотосовик','🪷','plant','healer',23,'side',0,0,['beam','lotus_nectar','lotus_bloom']],
  ['Мухолов','🪴','plant','agile',28,'diag2',0,1,['bite@n','fly_snap','fly_sap']],
  ['Солнечник','🌻','plant','sage',24,'rook2',0,0,['beam','sun_bath','sun_seeds']],
  ['Жук-носорог','🪲','insect','guard',42,'orth',0,-1,['shell','beetle_toss','beetle_horn']],
  ['Богомол','🦗','insect','fighter',31,'king',1,0,['mantis_strike','mantis_slash','mantis_lunge']],
  ['Пчела','🐝','insect','healer',27,'diag2',0,1,['sting@l','bee_honey','bee_dance']],
  ['Комар','🦟','insect','agile',24,'knight',1,1,['blood@z','mosq_buzz','mosq_prick']],
  ['Паук','🕷️','insect','sage',30,'diag2',0,0,['spider_web','spider_venom','spider_cocoon']],
  ['Единорог','🦄','magic','guard',35,'knight',0,-1,['uni_horn','uni_shield','uni_hoof']],
  ['Грифон','🦅','magic','fighter',28,'diag2',1,0,['dive','grif_rend','grif_wing']],
  ['Фея','🧚','magic','healer',26,'king',0,0,['fairy_dust','fairy_heal','fairy_wings']],
  ['Джинн','🧞','magic','agile',26,'knight',0,1,['djinn_whirl','djinn_mirage','djinn_sand']],
  ['Русалка','🧜','magic','sage',20,'side',0,0,['wave','siren_song','mermaid_pearl']],
  ['Скелет','💀','undead','guard',32,'orth',0,-1,['bone_throw','bone_shield','bone_bash']],
  ['Зомби','🧟','undead','fighter',28,'orth',1,-1,['bite@d','zombie_rot','zombie_rise']],
  ['Призрак','👻','undead','healer',25,'diag2',0,0,['ice','ghost_comfort','ghost_drain']],
  ['Вампир','🦇','undead','agile',26,'knight',0,1,['blood@d','vamp_swarm','vamp_mist']],
  ['Лич','☠️','undead','sage',29,'side',0,0,['ice','lich_nova','lich_curse']],
  ['Робот','🤖','mech','guard',34,'orth',0,-1,['robot_piston','robot_armor','robot_laser']],
  ['Мехскорпион','🦂','mech','fighter',24,'orth',1,0,['sting@f','scorp_claws','scorp_flame']],
  ['Ремонтник','🐢','mech','healer',29,'orth',0,0,['shell','fix_repair','fix_nails']],
  ['Мехзмей','🐍','mech','agile',27,'diag',1,1,['discharge','coil_shock','snake_strike']],
  ['Дрон','🛸','mech','sage',25,'rook2',0,0,['discharge','drone_scan','drone_jam']],
  ['Голем','🪨','elem','guard',36,'orth',0,-1,['ram@e','golem_skin','golem_quake']],
  ['Огневик','🔥','elem','fighter',27,'king',1,0,['fire_fist','fire_blast','fire_sparks']],
  ['Водяной','💧','elem','healer',32,'side',0,0,['wave','water_spring','water_splash']],
  ['Вихрик','🌪️','elem','agile',29,'knight',1,1,['wind_gust','wind_storm','wind_slice']],
  ['Искрун','⚡','elem','sage',24,'diag',0,0,['discharge','spark_ball','spark_over']],
  ['Цербер','🐕','demon','guard',30,'king',0,0,['bite@f','cerb_bite','cerb_gate']],
  ['Бес','👿','demon','fighter',26,'king',1,0,['claw','imp_fire','imp_fork']],
  ['Козлорог','🐐','demon','healer',31,'orth',0,0,['ram@d','goat_rite','goat_flame']],
  ['Тенекот','🐈‍⬛','demon','agile',26,'knight',0,1,['claw','cat_pounce','cat_shadow']],
  ['Демон хаоса','😈','demon','sage',29,'rook2',0,0,['discharge','chaos_rift','chaos_curse']],
  ['Слизень','🐌','aberr','guard',36,'side',0,-1,['shell','slime_glob','slime_ooze']],
  ['Кальмар','🦑','aberr','fighter',31,'side',0,0,['tent@w','squid_beak','squid_dash']],
  ['Медуза','🪼','aberr','healer',26,'side',0,0,['sting@w','jelly_glow','jelly_burn']],
  ['Глазун','👁️','aberr','agile',25,'knight',0,1,['eye_gaze','eye_beam','eye_blink']],
  ['Осьминог','🐙','aberr','sage',30,'side',0,0,['tent@d','octo_ink','octo_squeeze']],
  ['Каменный дракон','🦕','dragon','guard',35,'orth',-1,-1,['breath@e','dragon_scales','dragon_tail']],
  ['Дракончик','🐲','dragon','fighter',29,'king',1,0,['breath@f','drake_bite','drake_dash']],
  ['Златокрыл','🐉','dragon','healer',27,'diag2',0,0,['breath@l','gold_glow','gold_wing']],
  ['Виверна','🦎','dragon','agile',26,'knight',1,1,['dive','wyv_tail','wyv_shriek']],
  ['Тёмный дракон','🦖','dragon','sage',29,'rook2',1,0,['breath@d','dark_terror','dark_shadow']],
];
// builds T entries for a template (variant per element when the cost has '*')
function mkCard(spec){
  const[base,e0]=spec.split('@'),tp=CT[base];if(!tp)throw new Error('no card '+base);
  const wild=tp.cost&&tp.cost['*'];if(wild&&!e0)throw new Error('no element for '+spec);
  const el=wild?e0:tp.el,key='x_'+(wild?base+'@'+el:base);if(!el)throw new Error('card without element '+base);
  if(!T[key]){const cost={};for(const c in tp.cost)cost[c==='*'?el:c]=tp.cost[c];
    const t={...tp,cost,base,el,dg:el,n:(tp.nv&&tp.nv[el])||tp.n};delete t.nv;
    t.sub=tp.sub?{...SB[tp.sub]}:null;if(t.sub){const[a,b]=subTexts(t.sub);t.sub.short=a;t.sub.txt=b}else delete t.sub;
    if(!sumv(cost))cost[el]=1; // no free ▲: a card that had no cost now takes 1 of its own element
    t.burn=sumv(cost)>=2?1:2;T[key]=t}
  return key}
PETS.length=0;
for(const[n,ic,fam,cls,hp,mv,pw,,cards]of R70){
  const ks=cards.map(mkCard),els=new Set(ks.map(k=>T[k].el));
  PETS.push({n,ic,fam,cls,hp,mv,pw,cards:ks,els:ELS.filter(e=>els.has(e)),au:CLS[cls].au,role:CLS[cls].role})}
T.step={n:'Шаг',cost:{},spd:3,area:'step',burn:1,txt:'Двигает любого своего пета по его схеме хода. Если там свой пет, они меняются местами. Инициатива Шага своя, у замедленного пета на 40 позже.'};
