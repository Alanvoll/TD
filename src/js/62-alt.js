/* ---------- 0.9.0: second card per slot (WoW pet battles style) and «+» upgrades ---------- */
const CUP={},ALTS={};
function ALT_CT(o){Object.assign(CT,o)}
function ALT_SLOTS(o){Object.assign(ALTS,o)}
function CARD_UP(o){Object.assign(CUP,o)}
// alt cards for families: beast, plant, insect, magic, undead
ALT_CT({
  // ===== Звери =====
  // Медведь: wide paw swipe instead of a focused claw; a roar that slows a line instead of a grapple; a guard wall for the team instead of own hide
  bear_swipe:{n:'Размах лапой',el:'e',cost:{},spd:3,area:'hline',dmg:3,sub:'col'},
  bear_roar:{n:'Медвежий рёв',el:'e',cost:{e:1},spd:4,area:'hline',dmg:3,slow:2,sub:'sh'},
  bear_guard:{n:'Медвежий заслон',el:'e',cost:{e:1},spd:4,area:'allies',shield:3,sub:'hl'},
  // Волк: reach-a-wounded-target lunge instead of melee bite; fast lone flank instead of a 2-cost line hunt; pack call (team shield) instead of a debuff howl
  wolf_lunge:{n:'Бросок на горло',el:'f',cost:{f:1},spd:3,area:'cell',dmg:6,exec:3,sub:'hl'},
  wolf_flank:{n:'Обход с фланга',el:'f',cost:{f:1},spd:5,area:'cell',dmg:5,mark:2,sub:'col'},
  wolf_call:{n:'Зов стаи',el:'f',cost:{f:1},spd:4,area:'allies',shield:2,sub:'frt'},
  // Олень: antler charge through a line; single-target shield+cleanse instead of mass trickle heal; slow mass heal instead of a big single-target save
  deer_charge:{n:'Рогатый натиск',el:'n',cost:{n:1,any:1},spd:2,area:'hline',dmg:5,push:1,sub:'ahl'},
  deer_glade:{n:'Лесная тень',el:'n',cost:{},spd:3,area:'ally',shield:4,cleanse:1,sub:'hl'},
  deer_aura:{n:'Свет рогов',el:'l',cost:{l:1,any:1},spd:2,area:'allies',heal:4,sub:'drw'},
  // Лиса: costed bite (more dmg) instead of free claw; spreading fire trail instead of single fox fire; slip away (evade+draw) instead of a feint hit
  fox_trail:{n:'Огненный след',el:'f',cost:{f:1,any:1},spd:3,area:'hline',dmg:3,ign:2,sub:'evd'},
  fox_hide:{n:'Лисья уловка',el:'f',cost:{},spd:5,area:'self',evade:1,draw:1,sub:'mrk'},
  // Сова: slow silent night strike with mark instead of a fast costly dive; owl wisdom (self shield+draw) instead of scouting; ill omen marks all instead of a stunning cross
  owl_silent:{n:'Бесшумный налёт',el:'d',cost:{d:1},spd:2,area:'cell',dmg:6,mark:2,sub:'hl'},
  owl_wisdom:{n:'Совиная мудрость',el:'a',cost:{},spd:5,area:'self',shield:2,draw:1,sub:'mrk'},
  owl_omen:{n:'Дурное знамение',el:'d',cost:{d:1},spd:3,area:'enemies',dmg:1,mark:1,sub:'col'},

  // ===== Растения =====
  // Дубовик: ranged acorn with slow instead of melee branch; focused root grip instead of a column root; self-fortify instead of team bark
  oak_acorn:{n:'Жёлудь',el:'e',cost:{},spd:3,area:'cell',dmg:3,slow:1,sub:'sh'},
  oak_grasp:{n:'Хватка корней',el:'e',cost:{e:1},spd:3,area:'cell',dmg:5,root:2,sub:'sh'},
  oak_stand:{n:'Вековой ствол',el:'e',cost:{e:1},spd:4,area:'self',shield:6,heal:3,sub:'ash'},
  // Колючник: burst of spines in a cross instead of a row volley; bristle up (self shield) instead of a thorny hug; slow burning thorn instead of a quick spine
  cact_burst:{n:'Колючий взрыв',el:'f',cost:{f:1,any:1},spd:3,area:'cross',dmg:4,sub:'frt'},
  cact_stance:{n:'Колючая стойка',el:'e',cost:{e:1},spd:5,area:'self',shield:7,sub:'col'},
  cact_dart:{n:'Жгучая колючка',el:'f',cost:{},spd:2,area:'cell',dmg:4,ign:2,sub:'col'},
  // Лотосовик: petal whirl that slows a line instead of a marking beam; lily-pad shield instead of nectar heal; fast team cleanse+shield instead of slow team heal
  lotus_petal:{n:'Вихрь лепестков',el:'w',cost:{w:1},spd:3,area:'hline',dmg:3,slow:1,sub:'ahl'},
  lotus_pad:{n:'Лист кувшинки',el:'w',cost:{},spd:4,area:'ally',shield:5,sub:'ahl'},
  lotus_pure:{n:'Чистые воды',el:'w',cost:{w:1,any:1},spd:4,area:'allies',shield:2,cleanse:1,sub:'hl'},
  // Мухолов: vine lash that pulls a target in instead of a bite; digesting bite (drain) instead of a snap+root; sweet lure (mark) instead of a sap trap
  fly_vine:{n:'Хлёст лозой',el:'n',cost:{n:1},spd:4,area:'cell',dmg:4,pull:1,sub:'hl'},
  fly_digest:{n:'Переваривание',el:'n',cost:{n:1},spd:3,area:'melee',dmg:5,drain:1,sub:'evd'},
  fly_lure:{n:'Приманка',el:'n',cost:{},spd:5,area:'cell',dmg:2,mark:2,sub:'col'},
  // Солнечник: blinding flash (stun) instead of a column beam; warm ray for an ally instead of self photosynthesis; scorching column instead of a seed hail
  sun_blind:{n:'Ослепить',el:'l',cost:{l:1},spd:3,area:'cell',dmg:3,stun:1,sub:'ahl'},
  sun_warmth:{n:'Тёплый луч',el:'l',cost:{},spd:4,area:'ally',heal:4,shield:2,sub:'drw'},
  sun_heat:{n:'Полуденный жар',el:'f',cost:{f:1,any:1},spd:3,area:'col',dmg:4,ign:2,sub:'drw'},

  // ===== Насекомые =====
  // Жук-носорог: protect an ally with his body instead of self shell; burrow and root a column instead of a toss; horn sweep over a line instead of a heavy single horn
  beetle_brace:{n:'Живой щит',el:'e',cost:{e:1},spd:5,area:'ally',shield:6,sub:'hl'},
  beetle_dig:{n:'Взрыть землю',el:'e',cost:{e:1,any:1},spd:3,area:'col',dmg:4,root:1,sub:'sh'},
  beetle_sweep:{n:'Взмах рогом',el:'e',cost:{e:1},spd:3,area:'hline',dmg:5,sub:'sh'},
  // Богомол: double scythe on a line instead of an executing strike; pinning grab instead of a finisher; lurk (evade+shield) instead of a lunge
  mantis_scythe:{n:'Двойной серп',el:'a',cost:{a:1,any:1},spd:3,area:'hline',dmg:5,sub:'sh'},
  mantis_grip:{n:'Хватка богомола',el:'n',cost:{},spd:3,area:'cell',dmg:4,root:2,sub:'col'},
  mantis_wait:{n:'Затаиться',el:'n',cost:{n:1},spd:5,area:'self',evade:1,shield:4,sub:'mrk'},
  // Пчела: swarm over a square instead of a single sting; wax comb shield instead of honey heal; royal jelly (big single heal) instead of a team dance
  bee_swarm:{n:'Рой',el:'a',cost:{a:1},spd:3,area:'sq2',dmg:2,slow:1,sub:'ahl'},
  bee_wax:{n:'Восковые соты',el:'l',cost:{},spd:3,area:'ally',shield:6,sub:'ahl'},
  bee_jelly:{n:'Маточное молочко',el:'l',cost:{l:1,a:1},spd:3,area:'ally',heal:9,sub:'drw'},
  // Комар: fever spread in a cross (burn) instead of a single drain; cloud of mosquitoes on all instead of a fast line buzz; flit away instead of a prick
  mosq_fever:{n:'Лихорадка',el:'z',cost:{z:1,any:1},spd:3,area:'cross',dmg:2,ign:2,sub:'evd'},
  mosq_cloud:{n:'Туча комаров',el:'z',cost:{z:1,any:1},spd:3,area:'enemies',dmg:2,slow:1,sub:'col'},
  mosq_flit:{n:'Мельтешение',el:'z',cost:{},spd:5,area:'self',evade:1,heal:2,sub:'col'},
  // Паук: thrown net roots a line instead of a hidden trap; venom fang melee hit instead of a burning poison; drop on a thread and drag a target instead of a cocoon stun
  spider_net:{n:'Ловчая сеть',el:'d',cost:{d:1},spd:4,area:'hline',dmg:2,root:2,sub:'col'},
  spider_fang:{n:'Ядовитый клык',el:'z',cost:{z:1},spd:3,area:'melee',dmg:7,slow:1,sub:'hl'},
  spider_drop:{n:'Спуск на нити',el:'d',cost:{d:1,any:1},spd:5,area:'cell',dmg:6,pull:1,sub:'drw'},

  // ===== Магические =====
  // Единорог: horn lance that reaches any cell and strips buffs instead of a melee finisher; strong single aura instead of a thin team shield; rearing hooves over a line
  uni_pierce:{n:'Рог-копьё',el:'l',cost:{l:1},spd:3,area:'cell',dmg:6,strip:1,sub:'ahl'},
  uni_aura:{n:'Аура чистоты',el:'l',cost:{l:1},spd:4,area:'ally',shield:6,immune:2,sub:'ash'},
  uni_rear:{n:'На дыбы',el:'l',cost:{},spd:3,area:'hline',dmg:3,sub:'sh'},
  // Грифон: talon strike (cheap melee) instead of a costly dive; marking beak peck instead of a rending finisher; screech that slows a cross instead of a wing push
  grif_talon:{n:'Когти грифона',el:'a',cost:{a:1},spd:3,area:'melee',dmg:7,sub:'sh'},
  grif_beak:{n:'Клевок',el:'a',cost:{a:1},spd:4,area:'cell',dmg:5,mark:2,sub:'sh'},
  grif_screech:{n:'Клёкот',el:'a',cost:{},spd:3,area:'cross',dmg:2,slow:1,sub:'col'},
  // Фея: sleeping dust slows a square instead of damaging it; fairy ring heals all instead of one; glimmer (shield+cleanse) instead of heal+evade
  fairy_sleep:{n:'Сонная пыльца',el:'n',cost:{n:1},spd:3,area:'sq2',dmg:2,slow:2,sub:'drw'},
  fairy_circle:{n:'Круг фей',el:'l',cost:{l:1},spd:3,area:'allies',heal:3,sub:'sh'},
  fairy_glimmer:{n:'Мерцание',el:'n',cost:{},spd:5,area:'ally',shield:4,cleanse:1,sub:'ahl'},
  // Джинн: whirlwind pillar down a column instead of a pushing line; granted wish (heal) instead of a mirage; quicksand row with root instead of a sandstorm square
  djinn_pillar:{n:'Смерч-столп',el:'a',cost:{a:1},spd:3,area:'col',dmg:5,slow:1,sub:'evd'},
  djinn_wish:{n:'Желание',el:'a',cost:{},spd:4,area:'ally',heal:5,sub:'mrk'},
  djinn_dune:{n:'Песчаная воронка',el:'e',cost:{e:1,any:1},spd:3,area:'row',dmg:3,root:1,sub:'drw'},
  // Русалка: whirlpool cross instead of a column wave; lullaby puts one to sleep instead of slowing all; sea foam heals+cleanses instead of a pearl stun
  mermaid_vortex:{n:'Водоворот',el:'w',cost:{w:1},spd:2,area:'cross',dmg:3,slow:1,sub:'drw'},
  siren_lullaby:{n:'Колыбельная',el:'w',cost:{w:1,any:1},spd:2,area:'cell',dmg:2,stun:2,sub:'drw'},
  mermaid_foam:{n:'Морская пена',el:'w',cost:{},spd:3,area:'ally',heal:4,cleanse:1,sub:'ahl'},

  // ===== Нежить =====
  // Скелет: bone spear down a column instead of a single throw; wall of bones for the team instead of a personal shield; reassemble (heal+cleanse) instead of a shield bash
  bone_spear:{n:'Костяное копьё',el:'n',cost:{},spd:2,area:'col',dmg:3,sub:'sh'},
  bone_wall:{n:'Стена костей',el:'n',cost:{n:1,any:1},spd:4,area:'allies',shield:3,sub:'ash'},
  bone_mend:{n:'Собрать кости',el:'d',cost:{d:1},spd:4,area:'self',heal:5,cleanse:1,sub:'sh'},
  // Зомби: dead grip (root) instead of a bite; stench slows a line instead of a single rotten hit; rotten flesh absorbs (shield) instead of regrowing (heal)
  zombie_grab:{n:'Мёртвая хватка',el:'d',cost:{d:1},spd:2,area:'melee',dmg:5,root:2,sub:'hl'},
  zombie_stench:{n:'Трупный смрад',el:'d',cost:{},spd:3,area:'hline',dmg:2,slow:1,sub:'col'},
  zombie_flesh:{n:'Гнилая плоть',el:'d',cost:{d:1},spd:5,area:'self',shield:7,sub:'sh'},
  // Призрак: grave chill slows a line instead of freezing one; spectral veil (evade) instead of a plain heal; wail marks a cross instead of draining one
  ghost_chill:{n:'Могильный холод',el:'w',cost:{w:1},spd:4,area:'hline',dmg:2,slow:2,sub:'sh'},
  ghost_veil:{n:'Призрачный покров',el:'n',cost:{},spd:5,area:'ally',evade:1,heal:2,sub:'ahl'},
  ghost_wail:{n:'Стон',el:'d',cost:{d:1},spd:3,area:'cross',dmg:3,mark:1,sub:'hl'},
  // Вампир: charming gaze (stun) instead of a drain; a single fast bat instead of a swarm; cape (shield) instead of turning to mist
  vamp_charm:{n:'Чары',el:'d',cost:{d:1},spd:3,area:'cell',dmg:3,stun:1,sub:'evd'},
  vamp_bat:{n:'Летучая мышь',el:'d',cost:{d:1},spd:5,area:'cell',dmg:6,sub:'evd'},
  vamp_cape:{n:'Плащ ночи',el:'d',cost:{},spd:5,area:'self',shield:4,sub:'mrk'},
  // Лич: dark bolt (fast plain damage) instead of an ice freeze; blizzard square instead of a row nova; plague burns all instead of cursing one
  lich_bolt:{n:'Стрела тьмы',el:'d',cost:{d:1},spd:4,area:'cell',dmg:6,sub:'sh'},
  lich_blizzard:{n:'Пурга',el:'w',cost:{w:1,any:1},spd:2,area:'sq2',dmg:4,slow:2,sub:'drw'},
  lich_plague:{n:'Мор',el:'d',cost:{d:1,any:1},spd:2,area:'enemies',dmg:2,ign:1,sub:'col'},
});

// per creature: [slot1Alt, slot2Alt, slot3Alt]
ALT_SLOTS({
  'Медведь':['bear_swipe','bear_roar','bear_guard'],
  'Волк':['wolf_lunge','wolf_flank','wolf_call'],
  'Олень':['deer_charge','deer_glade','deer_aura'],
  'Лиса':['bite@f','fox_trail','fox_hide'],
  'Сова':['owl_silent','owl_wisdom','owl_omen'],
  'Дубовик':['oak_acorn','oak_grasp','oak_stand'],
  'Колючник':['cact_burst','cact_stance','cact_dart'],
  'Лотосовик':['lotus_petal','lotus_pad','lotus_pure'],
  'Мухолов':['fly_vine','fly_digest','fly_lure'],
  'Солнечник':['sun_blind','sun_warmth','sun_heat'],
  'Жук-носорог':['beetle_brace','beetle_dig','beetle_sweep'],
  'Богомол':['mantis_scythe','mantis_grip','mantis_wait'],
  'Пчела':['bee_swarm','bee_wax','bee_jelly'],
  'Комар':['mosq_fever','mosq_cloud','mosq_flit'],
  'Паук':['spider_net','spider_fang','spider_drop'],
  'Единорог':['uni_pierce','uni_aura','uni_rear'],
  'Грифон':['grif_talon','grif_beak','grif_screech'],
  'Фея':['fairy_sleep','fairy_circle','fairy_glimmer'],
  'Джинн':['djinn_pillar','djinn_wish','djinn_dune'],
  'Русалка':['mermaid_vortex','siren_lullaby','mermaid_foam'],
  'Скелет':['bone_spear','bone_wall','bone_mend'],
  'Зомби':['zombie_grab','zombie_stench','zombie_flesh'],
  'Призрак':['ghost_chill','ghost_veil','ghost_wail'],
  'Вампир':['vamp_charm','vamp_bat','vamp_cape'],
  'Лич':['lich_bolt','lich_blizzard','lich_plague'],
});

// upgrades («+» versions)
CARD_UP({
  // shared templates
  claw:{add:{dmg:1,mark:1}},
  bite:{add:{dmg:2}},
  shell:{add:{shield:2}},
  ram:{add:{dmg:2}},
  sting:{add:{dmg:1,mark:1}},
  dive:{cost:{a:1}},
  blood:{add:{dmg:2}},
  // Медведь
  bear_hug:{add:{dmg:2}},
  bear_hide:{add:{shield:2}},
  bear_swipe:{add:{dmg:1}},
  bear_roar:{add:{dmg:1,mark:1}},
  bear_guard:{add:{shield:1}},
  // Волк
  wolf_hunt:{add:{dmg:1}},
  wolf_howl:{add:{dmg:1}},
  wolf_lunge:{add:{dmg:1,exec:1}},
  wolf_flank:{add:{dmg:2}},
  wolf_call:{add:{shield:1}},
  // Олень
  deer_antler:{add:{dmg:2}},
  deer_dew:{add:{heal:1}},
  deer_spirit:{cost:{l:1}},
  deer_charge:{add:{dmg:1,slow:1}},
  deer_glade:{add:{shield:2}},
  deer_aura:{add:{heal:1}},
  // Лиса
  fox_fire:{add:{ign:1}},
  fox_feint:{add:{dmg:2}},
  fox_trail:{add:{dmg:1}},
  fox_hide:{add:{shield:2}},
  // Сова
  owl_eye:{add:{dmg:1}},
  owl_hoot:{add:{dmg:2}},
  owl_silent:{add:{dmg:2}},
  owl_wisdom:{add:{shield:2}},
  owl_omen:{add:{mark:1}},
  // Дубовик
  oak_branch:{add:{dmg:2}},
  oak_roots:{add:{dmg:2}},
  oak_bark:{add:{shield:1}},
  oak_acorn:{add:{dmg:2}},
  oak_grasp:{add:{dmg:2}},
  oak_stand:{add:{shield:2}},
  // Колючник
  cact_needles:{add:{dmg:1}},
  cact_hug:{add:{dmg:2}},
  cact_spine:{add:{dmg:2}},
  cact_burst:{add:{dmg:1}},
  cact_stance:{add:{shield:2}},
  cact_dart:{add:{ign:1,dmg:1}},
  // Лотосовик
  lotus_nectar:{add:{heal:2}},
  lotus_bloom:{add:{heal:1}},
  lotus_petal:{add:{dmg:1}},
  lotus_pad:{add:{shield:2}},
  lotus_pure:{add:{shield:1}},
  // Мухолов
  fly_snap:{add:{dmg:2}},
  fly_sap:{set:{trap:{dmg:10,ic:'🍯'}}},
  fly_vine:{add:{dmg:2}},
  fly_digest:{add:{dmg:2}},
  fly_lure:{add:{dmg:2}},
  // Солнечник
  sun_bath:{add:{heal:2}},
  sun_seeds:{add:{dmg:1}},
  sun_blind:{add:{dmg:2}},
  sun_warmth:{add:{heal:2}},
  sun_heat:{add:{dmg:1,ign:1}},
  // Жук-носорог
  beetle_toss:{add:{dmg:2}},
  beetle_horn:{add:{dmg:2}},
  beetle_brace:{add:{shield:2}},
  beetle_dig:{add:{dmg:2}},
  beetle_sweep:{add:{dmg:1,push:1}},
  // Богомол
  mantis_strike:{add:{exec:2}},
  mantis_slash:{add:{dmg:1,exec:1}},
  mantis_lunge:{add:{dmg:2}},
  mantis_scythe:{add:{dmg:1}},
  mantis_grip:{add:{dmg:2}},
  mantis_wait:{add:{shield:2}},
  // Пчела
  bee_honey:{add:{heal:2}},
  bee_dance:{add:{heal:1}},
  bee_swarm:{add:{dmg:1}},
  bee_wax:{add:{shield:2}},
  bee_jelly:{add:{immune:1}},
  // Комар
  mosq_buzz:{add:{dmg:1}},
  mosq_prick:{add:{mark:1}},
  mosq_fever:{add:{ign:1}},
  mosq_cloud:{add:{dmg:1}},
  mosq_flit:{add:{heal:2}},
  // Паук
  spider_web:{set:{trap:{dmg:8,freeze:1,ic:'🕸'}}},
  spider_venom:{add:{dmg:2}},
  spider_cocoon:{add:{dmg:2}},
  spider_net:{add:{dmg:2}},
  spider_fang:{add:{slow:1}},
  spider_drop:{add:{dmg:2}},
  // Единорог
  uni_horn:{add:{dmg:2}},
  uni_shield:{add:{shield:1}},
  uni_hoof:{add:{dmg:2}},
  uni_pierce:{add:{dmg:2}},
  uni_aura:{add:{shield:2}},
  uni_rear:{add:{dmg:1,push:1}},
  // Грифон
  grif_rend:{add:{dmg:2}},
  grif_wing:{add:{dmg:1}},
  grif_beak:{add:{dmg:2}},
  grif_screech:{add:{dmg:1}},
  // Фея
  fairy_dust:{add:{dmg:1}},
  fairy_heal:{add:{heal:2}},
  fairy_wings:{add:{heal:2}},
  fairy_sleep:{add:{dmg:1}},
  fairy_circle:{add:{heal:1}},
  fairy_glimmer:{add:{shield:2}},
  // Джинн
  djinn_whirl:{add:{dmg:1}},
  djinn_mirage:{add:{shield:2}},
  djinn_sand:{add:{dmg:1}},
  djinn_pillar:{add:{dmg:1}},
  djinn_wish:{add:{heal:1},set:{cleanse:1}},
  djinn_dune:{add:{dmg:1}},
  // Русалка
  siren_song:{add:{dmg:1}},
  mermaid_pearl:{add:{dmg:2}},
  mermaid_vortex:{add:{dmg:1}},
  siren_lullaby:{add:{dmg:2}},
  mermaid_foam:{add:{heal:2}},
  // Скелет
  bone_throw:{add:{dmg:2}},
  bone_shield:{add:{shield:2}},
  bone_bash:{add:{dmg:2}},
  bone_spear:{add:{dmg:1}},
  bone_wall:{add:{shield:1}},
  bone_mend:{add:{heal:2}},
  // Зомби
  zombie_rot:{add:{dmg:2}},
  zombie_rise:{add:{heal:2}},
  zombie_grab:{add:{dmg:2}},
  zombie_stench:{add:{dmg:1}},
  zombie_flesh:{add:{shield:2}},
  // Призрак
  ghost_comfort:{add:{heal:2}},
  ghost_drain:{add:{dmg:2}},
  ghost_chill:{add:{dmg:1}},
  ghost_veil:{add:{heal:2}},
  ghost_wail:{add:{dmg:1}},
  // Вампир
  vamp_swarm:{add:{dmg:1}},
  vamp_mist:{add:{heal:2}},
  vamp_charm:{add:{dmg:2}},
  vamp_bat:{add:{dmg:1,mark:1}},
  vamp_cape:{add:{shield:2}},
  // Лич
  lich_nova:{add:{dmg:1}},
  lich_curse:{add:{dmg:2}},
  lich_bolt:{add:{dmg:2}},
  lich_blizzard:{add:{dmg:1}},
  lich_plague:{add:{ign:1}},
});

// alt cards: new templates — families mech, elem, demon, aberr, dragon
ALT_CT({
  // Робот
  robot_magnet:{n:'Магнит',el:'n',cost:{n:1},spd:3,area:'hline',dmg:3,pull:1,sub:'sh'},
  robot_dome:{n:'Защитное поле',el:'n',cost:{n:1,any:1},spd:4,area:'allies',shield:4,sub:'ash'},
  robot_rocket:{n:'Ракета',el:'f',cost:{},spd:2,area:'cell',dmg:5,ign:1,sub:'sh'},
  // Мехскорпион
  scorp_tail:{n:'Хвост-кнут',el:'n',cost:{n:1},spd:3,area:'hline',dmg:3,slow:2,sub:'ahl'},
  scorp_pinch:{n:'Щипок клешнёй',el:'n',cost:{n:1},spd:4,area:'cell',dmg:5,pull:1,sub:'frt'},
  scorp_napalm:{n:'Лужа напалма',el:'f',cost:{},spd:5,area:'cell',trap:{dmg:7,ic:'🔥'},sub:'col'},
  // Ремонтник
  fix_plate:{n:'Латка брони',el:'n',cost:{},spd:5,area:'ally',shield:5,sub:'hl'},
  fix_tune:{n:'Наладка',el:'n',cost:{n:1,any:1},spd:3,area:'allies',heal:3,cleanse:1,sub:'sh'},
  fix_staple:{n:'Скобомёт',el:'e',cost:{e:1},spd:3,area:'cell',dmg:4,root:2,sub:'sh'},
  // Мехзмей
  snake_fang:{n:'Электроклык',el:'z',cost:{z:1},spd:3,area:'melee',dmg:6,mark:2,sub:'drw'},
  snake_shed:{n:'Сброс обшивки',el:'n',cost:{n:1},spd:5,area:'self',heal:3,evade:1,cleanse:1,sub:'mrk'},
  snake_whip:{n:'Хлёст хвостом',el:'z',cost:{},spd:4,area:'hline',dmg:3,slow:1,sub:'evd'},
  // Дрон
  drone_bomb:{n:'Сброс бомбы',el:'z',cost:{z:1,any:1},spd:2,area:'sq2',dmg:5,sub:'drw'},
  drone_aim:{n:'Наводка',el:'n',cost:{n:1},spd:5,area:'cell',dmg:3,mark:3,sub:'drw'},
  drone_emp:{n:'ЭМ-импульс',el:'z',cost:{},spd:3,area:'cross',dmg:2,strip:1,sub:'col'},
  // Голем
  golem_fist:{n:'Каменный кулак',el:'e',cost:{e:1},spd:3,area:'melee',dmg:5,stun:1,sub:'sh'},
  golem_shards:{n:'Осколки',el:'e',cost:{},spd:4,area:'hline',dmg:3,sub:'hl'},
  golem_boulder:{n:'Валун',el:'e',cost:{e:1,any:1},spd:2,area:'col',dmg:5,root:1,sub:'ash'},
  // Огневик
  fire_jet:{n:'Струя пламени',el:'f',cost:{f:1},spd:3,area:'hline',dmg:3,ign:1,sub:'frt'},
  fire_wall:{n:'Стена огня',el:'f',cost:{f:1,any:1},spd:2,area:'col',dmg:4,ign:2,sub:'frt'},
  fire_flash:{n:'Слепящая вспышка',el:'l',cost:{},spd:5,area:'cell',dmg:2,stun:1,sub:'col'},
  // Водяной
  water_jet:{n:'Водомёт',el:'w',cost:{w:1},spd:4,area:'cell',dmg:5,push:1,sub:'drw'},
  water_rain:{n:'Светлый дождь',el:'l',cost:{l:1,any:1},spd:2,area:'allies',heal:4,sub:'ahl'},
  water_bubble:{n:'Пузырь',el:'w',cost:{},spd:5,area:'ally',shield:3,cleanse:1,sub:'hl'},
  // Вихрик
  wind_pull:{n:'Воронка',el:'a',cost:{a:1},spd:3,area:'hline',dmg:3,pull:1,sub:'evd'},
  wind_tornado:{n:'Ураган',el:'a',cost:{a:1,any:1},spd:2,area:'row',dmg:4,slow:1,sub:'drw'},
  wind_dust:{n:'Пыльный вихрь',el:'a',cost:{},spd:4,area:'cell',dmg:3,slow:2,sub:'evd'},
  // Искрун
  spark_arc:{n:'Дуга',el:'z',cost:{z:1},spd:3,area:'hline',dmg:4,mark:1,sub:'drw'},
  spark_cloud:{n:'Грозовая туча',el:'z',cost:{z:1,any:1},spd:1,area:'row',dmg:5,sub:'drw'},
  spark_static:{n:'Статика',el:'a',cost:{a:1},spd:4,area:'cell',dmg:3,stun:1,sub:'col'},
  // Цербер
  cerb_chain:{n:'Цепь пса',el:'d',cost:{d:1},spd:3,area:'cell',dmg:4,pull:1,root:1,sub:'hl'},
  cerb_breath:{n:'Три пасти огня',el:'f',cost:{f:1,any:1},spd:2,area:'cross',dmg:4,ign:1,sub:'sh'},
  cerb_stance:{n:'Стойка стража',el:'d',cost:{},spd:5,area:'self',shield:5,cleanse:1,sub:'sh'},
  // Бес
  imp_tail:{n:'Хвост беса',el:'d',cost:{},spd:4,area:'cell',dmg:4,slow:1,sub:'col'},
  imp_ball:{n:'Огненный шар',el:'f',cost:{f:1},spd:3,area:'cell',dmg:6,ign:1,sub:'frt'},
  imp_throw:{n:'Бросок вил',el:'d',cost:{d:1,any:1},spd:3,area:'cell',dmg:7,pull:1,sub:'frt'},
  // Козлорог
  goat_butt:{n:'Бодание',el:'d',cost:{d:1},spd:3,area:'melee',dmg:5,slow:2,sub:'sh'},
  goat_pact:{n:'Тёмный договор',el:'d',cost:{d:1},spd:4,area:'ally',heal:7,cleanse:1,hpcost:3,sub:'hl'},
  goat_seal:{n:'Огненная печать',el:'f',cost:{f:1},spd:3,area:'allies',shield:3,sub:'hl'},
  // Тенекот
  cat_slip:{n:'Кошачья тень',el:'d',cost:{},spd:5,area:'self',evade:1,shield:3,sub:'col'},
  cat_stalk:{n:'Выслеживание',el:'d',cost:{d:1},spd:3,area:'col',dmg:2,mark:3,sub:'drw'},
  cat_claws:{n:'Когти тьмы',el:'d',cost:{d:1},spd:4,area:'hline',dmg:4,sub:'evd'},
  // Демон хаоса
  chaos_bolt:{n:'Сгусток хаоса',el:'z',cost:{z:1},spd:2,area:'cross',dmg:4,strip:1,sub:'drw'},
  chaos_storm:{n:'Буря хаоса',el:'z',cost:{z:1,any:1},spd:2,area:'enemies',dmg:3,ign:1,sub:'drw'},
  chaos_madness:{n:'Безумие',el:'d',cost:{},spd:3,area:'cell',dmg:2,stun:1,sub:'col'},
  // Слизень
  slime_coat:{n:'Слизистый покров',el:'w',cost:{},spd:5,area:'self',shield:4,cleanse:1,sub:'hl'},
  slime_trail:{n:'Липкий след',el:'w',cost:{},spd:5,area:'cell',trap:{dmg:5,freeze:1,ic:'🫧'},sub:'sh'},
  slime_engulf:{n:'Поглощение',el:'z',cost:{z:1,any:1},spd:3,area:'melee',dmg:6,drain:1,sub:'ash'},
  // Кальмар
  squid_grab:{n:'Захват щупальцем',el:'w',cost:{w:1},spd:3,area:'cell',dmg:5,root:2,sub:'col'},
  squid_ink:{n:'Чернильный выброс',el:'w',cost:{},spd:5,area:'self',evade:1,heal:3,sub:'evd'},
  squid_crush:{n:'Сокрушение',el:'z',cost:{z:1,any:1},spd:2,area:'melee',dmg:10,sub:'hl'},
  // Медуза
  jelly_dome:{n:'Прозрачный купол',el:'w',cost:{w:1},spd:4,area:'ally',shield:5,sub:'ahl'},
  jelly_pulse:{n:'Пульсация',el:'w',cost:{},spd:3,area:'ally',heal:5,sub:'sh'},
  jelly_shock:{n:'Удар током',el:'z',cost:{z:1},spd:4,area:'cell',dmg:3,stun:1,sub:'hl'},
  // Глазун
  eye_hypno:{n:'Гипноз',el:'z',cost:{z:1},spd:3,area:'cell',dmg:3,pull:1,slow:2,sub:'evd'},
  eye_fan:{n:'Веер лучей',el:'d',cost:{d:1,any:1},spd:3,area:'row',dmg:3,mark:1,sub:'col'},
  eye_shut:{n:'Сомкнуть веко',el:'z',cost:{},spd:5,area:'self',evade:1,cleanse:1,sub:'evd'},
  // Осьминог
  octo_arms:{n:'Восемь рук',el:'d',cost:{d:1,any:1},spd:3,area:'cross',dmg:3,slow:1,sub:'col'},
  octo_cloud:{n:'Чернильное облако',el:'w',cost:{w:1,any:1},spd:4,area:'allies',evade:1,sub:'drw'},
  octo_drag:{n:'Утащить на дно',el:'w',cost:{},spd:3,area:'cell',dmg:4,pull:1,sub:'col'},
  // Каменный дракон
  stone_stomp:{n:'Топот',el:'e',cost:{e:1,any:1},spd:1,area:'enemies',dmg:3,slow:1,sub:'frt'},
  stone_guard:{n:'Каменный заслон',el:'e',cost:{},spd:4,area:'ally',shield:5,sub:'ash'},
  stone_jaws:{n:'Каменная пасть',el:'e',cost:{e:1},spd:3,area:'melee',dmg:7,slow:1,sub:'sh'},
  // Дракончик
  drake_spit:{n:'Огненный плевок',el:'f',cost:{f:1,any:1},spd:3,area:'sq2',dmg:4,ign:1,sub:'frt'},
  drake_rake:{n:'Раздирание',el:'f',cost:{f:1},spd:4,area:'cell',dmg:5,mark:2,sub:'hl'},
  drake_roar:{n:'Рык дракончика',el:'f',cost:{},spd:4,area:'cross',dmg:2,slow:1,sub:'col'},
  // Златокрыл (alt1 = shared 'beam')
  gold_ray:{n:'Золотой луч',el:'l',cost:{l:1},spd:3,area:'col',dmg:4,mark:1,sub:'ahl'},
  gold_hymn:{n:'Золотой гимн',el:'l',cost:{l:1},spd:3,area:'ally',heal:8,cleanse:1,sub:'hl'},
  gold_scale:{n:'Золотая чешуя',el:'l',cost:{},spd:5,area:'allies',shield:2,sub:'ahl'},
  // Виверна
  wyv_swoop:{n:'Налёт',el:'a',cost:{a:1},spd:4,area:'hline',dmg:4,mark:1,sub:'hl'},
  wyv_spit:{n:'Кислотный плевок',el:'z',cost:{z:1},spd:3,area:'cross',dmg:2,ign:2,sub:'evd'},
  wyv_glide:{n:'Парение',el:'a',cost:{},spd:5,area:'self',evade:1,heal:3,sub:'evd'},
  // Тёмный дракон
  dark_devour:{n:'Пожирающая тьма',el:'d',cost:{d:1,any:1},spd:3,area:'cell',dmg:6,drain:1,sub:'frt'},
  dark_dread:{n:'Волна страха',el:'z',cost:{z:1,any:1},spd:3,area:'enemies',dmg:2,slow:2,sub:'hl'},
  dark_haze:{n:'Морок',el:'d',cost:{},spd:5,area:'cell',dmg:2,mark:2,strip:1,sub:'col'},
});

ALT_SLOTS({
  // Робот: push-melee -> pull a line in; self-wall -> team shield; column laser -> slow heavy rocket (new el f)
  'Робот':['robot_magnet','robot_dome','robot_rocket'],
  // Мехскорпион: single slow sting -> line whip; big rooting claws -> cheap fast pinch+pull; flamethrower line -> napalm trap
  'Мехскорпион':['scorp_tail','scorp_pinch','scorp_napalm'],
  // Ремонтник: self shell -> patch an ally; big single repair -> small team tune-up+cleanse; nail dmg -> stapler root
  'Ремонтник':['fix_plate','fix_tune','fix_staple'],
  // Мехзмей: chain zap -> cheap marking fang; root coil -> defensive shed; fast single strike -> line tail whip
  'Мехзмей':['snake_fang','snake_shed','snake_whip'],
  // Дрон: chain zap -> 2x2 bomb; mark-all scan -> heavy single target designation; stun jammer -> cross EMP that strips buffs
  'Дрон':['drone_bomb','drone_aim','drone_emp'],
  // Голем: ram push -> stunning fist; self skin -> cheap line shards; row quake -> column boulder with root
  'Голем':['golem_fist','golem_shards','golem_boulder'],
  // Огневик: melee burn fist -> line jet; cross blast -> column fire wall; spark -> blinding flash (new el l)
  'Огневик':['fire_jet','fire_wall','fire_flash'],
  // Водяной: column wave -> fast single jet w/ push; big single heal -> team rain; heal+shield splash -> shield+cleanse bubble
  'Водяной':['water_jet','water_rain','water_bubble'],
  // Вихрик: push gust -> pulling funnel; 2x2 storm -> row hurricane w/ slow; burst slice -> slowing dust devil
  'Вихрик':['wind_pull','wind_tornado','wind_dust'],
  // Искрун: chain -> line arc w/ mark; slow all-enemies ball -> cheaper row cloud; cross overload -> single stun
  'Искрун':['spark_arc','spark_cloud','spark_static'],
  // Цербер: bite -> chain pull+root; triple line bite -> cross fire breath; team shield -> self stance+cleanse
  'Цербер':['cerb_chain','cerb_breath','cerb_stance'],
  // Бес: claw -> ranged slowing tail; cross hellfire -> focused fireball; melee fork -> thrown fork with pull
  'Бес':['imp_tail','imp_ball','imp_throw'],
  // Козлорог: push ram -> slowing butt; team blood heal -> single heal+cleanse pact; line flame -> team fire ward
  'Козлорог':['goat_butt','goat_pact','goat_seal'],
  // Тенекот: claw -> evasive shadow; cross pounce -> column stalk/mark; execute strike -> line shadow claws
  'Тенекот':['cat_slip','cat_stalk','cat_claws'],
  // Демон хаоса: chain -> cross bolt that strips; 2x2 rift -> all-enemy chaos storm; mark+slow curse -> stun madness (new el d)
  'Демон хаоса':['chaos_bolt','chaos_storm','chaos_madness'],
  // Слизень: shell -> cleansing slime coat; slow glob -> freezing slime trap; row ooze -> draining engulf
  'Слизень':['slime_coat','slime_trail','slime_engulf'],
  // Кальмар: line tentacle pull -> single grab+root; melee beak -> ink escape; fast dash -> slow heavy crush
  'Кальмар':['squid_grab','squid_ink','squid_crush'],
  // Медуза: stinging thread -> protective dome; team glow -> single pulse heal; line burn -> single stun shock
  'Медуза':['jelly_dome','jelly_pulse','jelly_shock'],
  // Глазун: stun gaze -> hypnotic pull+slow; column beam -> row fan w/ mark; blink-mark -> defensive shut eye
  'Глазун':['eye_hypno','eye_fan','eye_shut'],
  // Осьминог: line tentacles -> cross of arms; all-enemy ink -> team ink cloud (evade); root squeeze -> drag (pull)
  'Осьминог':['octo_arms','octo_cloud','octo_drag'],
  // Каменный дракон: row breath -> slow all-enemy stomp; self scales -> guard an ally; line tail push -> heavy melee jaws
  'Каменный дракон':['stone_stomp','stone_guard','stone_jaws'],
  // Дракончик: row breath -> 2x2 spit; melee burn bite -> ranged marking rake; fast dash -> cross roar w/ slow
  'Дракончик':['drake_spit','drake_rake','drake_roar'],
  // Златокрыл: row light breath -> column beam w/ mark; team glow -> big single hymn+cleanse; single wing-shield -> team scales
  'Златокрыл':['gold_ray','gold_hymn','gold_scale'],
  // Виверна: burst dive -> line swoop w/ mark; single poison tail -> cross acid spit; line shriek -> evasive glide
  'Виверна':['wyv_swoop','wyv_spit','wyv_glide'],
  // Тёмный дракон: row breath -> single draining devour; single 2-turn stun -> all-enemy dread slow; column shadow -> fast mark+strip
  'Тёмный дракон':['dark_devour','dark_dread','dark_haze'],
});

CARD_UP({
  // shared templates
  ice:{add:{dmg:2}},
  tent:{add:{dmg:1,slow:1}},
  wave:{add:{dmg:2}},
  breath:{add:{dmg:2}},
  discharge:{add:{chain:2}},
  beam:{add:{dmg:1,mark:1}},
  // Механизмы base
  robot_piston:{add:{dmg:2}},
  robot_armor:{add:{cleanse:1}},
  robot_laser:{add:{dmg:1,mark:1}},
  scorp_claws:{add:{spd:1}},
  scorp_flame:{add:{dmg:1,ign:1}},
  fix_repair:{add:{immune:1}},
  fix_nails:{add:{dmg:2}},
  coil_shock:{add:{dmg:2}},
  snake_strike:{add:{dmg:1,mark:1}},
  drone_scan:{add:{mark:1}},
  drone_jam:{add:{dmg:2}},
  // Механизмы alts
  robot_magnet:{add:{dmg:1,slow:1}},
  robot_dome:{add:{shield:1},set:{spd:5}},
  robot_rocket:{add:{dmg:2}},
  scorp_tail:{add:{dmg:1,mark:1}},
  scorp_pinch:{add:{dmg:1,root:1}},
  scorp_napalm:{set:{trap:{dmg:9,ic:'🔥'}}},
  fix_plate:{add:{shield:1,cleanse:1}},
  fix_tune:{add:{heal:1}},
  fix_staple:{add:{dmg:2}},
  snake_fang:{add:{dmg:2}},
  snake_shed:{add:{heal:2}},
  snake_whip:{add:{dmg:1,slow:1}},
  drone_bomb:{add:{dmg:1},set:{spd:3}},
  drone_aim:{add:{dmg:2}},
  drone_emp:{add:{dmg:1,slow:1}},
  // Элементали base
  golem_skin:{add:{shield:2}},
  golem_quake:{add:{slow:1}},
  fire_fist:{add:{dmg:2}},
  fire_blast:{add:{ign:1}},
  fire_sparks:{add:{dmg:1,ign:1}},
  water_spring:{add:{immune:1}},
  water_splash:{add:{shield:2}},
  wind_gust:{add:{dmg:2}},
  wind_storm:{add:{push:1}},
  wind_slice:{add:{dmg:2}},
  spark_ball:{cost:{z:1,any:1}},
  spark_over:{add:{dmg:2}},
  // Элементали alts
  golem_fist:{add:{dmg:2}},
  golem_shards:{add:{dmg:1,slow:1}},
  golem_boulder:{add:{dmg:1,root:1}},
  fire_jet:{add:{dmg:1,ign:1}},
  fire_wall:{add:{dmg:2}},
  fire_flash:{add:{mark:1}},
  water_jet:{add:{dmg:2}},
  water_rain:{add:{cleanse:1}},
  water_bubble:{add:{shield:2}},
  wind_pull:{add:{dmg:1,slow:1}},
  wind_tornado:{add:{dmg:1}},
  wind_dust:{add:{dmg:2}},
  spark_arc:{add:{dmg:1,slow:1}},
  spark_cloud:{add:{slow:1}},
  spark_static:{add:{dmg:2}},
  // Демоны base
  cerb_bite:{add:{dmg:1,ign:1}},
  cerb_gate:{add:{shield:1}},
  imp_fire:{add:{dmg:1,ign:1}},
  imp_fork:{add:{push:1,dmg:1}},
  goat_rite:{add:{heal:1},set:{hpcost:3}},
  goat_flame:{add:{dmg:1,ign:1}},
  cat_pounce:{add:{dmg:1,slow:1}},
  cat_shadow:{add:{exec:2}},
  chaos_rift:{add:{dmg:1},set:{spd:2}},
  chaos_curse:{add:{dmg:2}},
  // Демоны alts
  cerb_chain:{add:{dmg:2}},
  cerb_breath:{add:{dmg:1,ign:1}},
  cerb_stance:{add:{shield:2}},
  imp_tail:{add:{dmg:2}},
  imp_ball:{add:{dmg:1,ign:1}},
  imp_throw:{add:{dmg:2}},
  goat_butt:{add:{dmg:2}},
  goat_pact:{add:{heal:2},set:{hpcost:2}},
  goat_seal:{add:{shield:1},set:{spd:4}},
  cat_slip:{add:{shield:2}},
  cat_stalk:{add:{dmg:2}},
  cat_claws:{add:{dmg:1,mark:1}},
  chaos_bolt:{add:{dmg:2}},
  chaos_storm:{add:{dmg:1}},
  chaos_madness:{add:{dmg:2,mark:1}},
  // Аберрации base
  slime_glob:{add:{dmg:2}},
  slime_ooze:{add:{dmg:1}},
  squid_beak:{add:{dmg:2}},
  squid_dash:{add:{dmg:1,mark:1}},
  jelly_glow:{add:{heal:1}},
  jelly_burn:{add:{dmg:2}},
  eye_gaze:{add:{dmg:2}},
  eye_beam:{add:{mark:1,dmg:1}},
  eye_blink:{add:{dmg:2}},
  octo_ink:{add:{dmg:1}},
  octo_squeeze:{add:{dmg:2}},
  // Аберрации alts
  slime_coat:{add:{shield:2}},
  slime_trail:{set:{trap:{dmg:7,freeze:1,ic:'🫧'}}},
  slime_engulf:{add:{dmg:2}},
  squid_grab:{add:{dmg:2}},
  squid_ink:{add:{heal:2}},
  squid_crush:{add:{push:1,slow:1}},
  jelly_dome:{add:{shield:1,cleanse:1}},
  jelly_pulse:{add:{heal:2}},
  jelly_shock:{add:{dmg:2}},
  eye_hypno:{add:{dmg:2}},
  eye_fan:{add:{dmg:1}},
  eye_shut:{add:{heal:3}},
  octo_arms:{add:{dmg:1,slow:1}},
  octo_cloud:{add:{heal:2}},
  octo_drag:{add:{dmg:1,slow:1}},
  // Драконы base
  dragon_scales:{add:{shield:2}},
  dragon_tail:{add:{dmg:2}},
  drake_bite:{add:{dmg:1,ign:1}},
  drake_dash:{add:{dmg:2}},
  gold_glow:{add:{heal:1}},
  gold_wing:{add:{shield:2}},
  wyv_tail:{add:{dmg:2}},
  wyv_shriek:{add:{dmg:1,slow:1}},
  dark_terror:{add:{dmg:2}},
  dark_shadow:{add:{dmg:1,mark:1}},
  // Драконы alts
  stone_stomp:{add:{dmg:1}},
  stone_guard:{add:{shield:1,cleanse:1}},
  stone_jaws:{add:{dmg:2}},
  drake_spit:{add:{dmg:1}},
  drake_rake:{add:{dmg:2}},
  drake_roar:{add:{dmg:1,mark:1}},
  gold_hymn:{add:{heal:2}},
  gold_scale:{add:{shield:1,cleanse:1}},
  wyv_swoop:{add:{dmg:2}},
  wyv_spit:{add:{dmg:1,ign:1}},
  wyv_glide:{add:{heal:2}},
  dark_devour:{add:{dmg:2}},
  dark_dread:{add:{dmg:1}},
  dark_haze:{add:{dmg:2}},
});

/* 0.10.0: alt-card balance pass after 120k bot battles (keep every alt within about ±6% of the base card) */
{const F={
  siren_lullaby:{area:'enemies',dmg:3,stun:1,spd:4},vamp_charm:{dmg:5},djinn_dune:{dmg:4,root:2,spd:4},imp_ball:{area:'hline',dmg:5,ign:2},
  octo_cloud:{cost:{w:1},shield:2},spark_cloud:{cost:{z:1},dmg:5,slow:1},owl_wisdom:{area:'allies',shield:3,spd:5},sun_blind:{area:'col',dmg:4,stun:1},
  sun_warmth:{heal:6,shield:3,spd:5},bee_jelly:{heal:10,cleanse:1,cost:{l:1}},drone_aim:{area:'cross',dmg:3,mark:2},mosq_flit:{heal:4,evade:2},
  zombie_grab:{dmg:7},zombie_stench:{dmg:3,slow:2},scorp_napalm:{trap:{dmg:9,ic:'🔥'}},golem_boulder:{dmg:6,spd:3},
  cat_stalk:{dmg:3,spd:4},dark_devour:{dmg:7},deer_glade:{shield:6,spd:4},wind_tornado:{dmg:5},fox_hide:{shield:3},
  lotus_petal:{dmg:4},cerb_breath:{dmg:5},cerb_stance:{shield:8},eye_hypno:{dmg:5},jelly_pulse:{heal:7},bear_guard:{shield:4},fix_staple:{dmg:5},
  dark_dread:{slow:1},robot_dome:{shield:3},lich_plague:{cost:{d:1,any:2}},drone_bomb:{dmg:4}};
 for(const k in F)if(CT[k])CT[k]={...CT[k],...F[k]};else console.warn('altfix: no template',k)}
/* 0.21.2: second pass after another 120k battles: 13 alt cards were more than 8% off the base card */
{const F={
  wolf_call:{shield:3,spd:5},goat_pact:{heal:9},dark_dread:{slow:0},lich_plague:{dmg:1,ign:1},slime_trail:{trap:{dmg:3,freeze:1,ic:'🫧'}},
  spider_net:{dmg:4,root:2},spider_fang:{dmg:7,ign:2,slow:1},spark_cloud:{cost:{z:1},dmg:7,slow:1,spd:2},vamp_bat:{dmg:5},chaos_madness:{dmg:3},spark_static:{dmg:4},
  vamp_charm:{dmg:6,spd:4},chaos_storm:{dmg:2},eye_hypno:{dmg:6,spd:4}};
 for(const k in F)if(F[k]&&CT[k])CT[k]={...CT[k],...F[k]};else if(F[k])console.warn('altfix2: no template',k)}

