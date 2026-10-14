/* ---------- 0.28.0: 50 more creatures, a second one for every family x class ---------- */
// row: name, emoji, family, class, hp, move, Сила, (unused), three own cards, three second cards (one per slot)
// card: [key, name, element, cost, speed, area, effects, ▼ preset]
{const R2=[
 // ===== Звери =====
 ['Кабан','🐗','beast','guard',40,'orth',0,-1,
  [['boar_tusk','Удар клыком','e',{e:1},3,'melee',{dmg:6,push:1},'sh'],['boar_charge','Кабаний разгон','e',{e:1,any:1},2,'hline',{dmg:5,slow:1},'col'],['boar_bristle','Щетина дыбом','e',{e:1},5,'self',{shield:9,evade:1},'hl']],
  [['boar_gore','Подсечка','e',{e:1},3,'melee',{dmg:5,root:1},'col'],['boar_wall','Кабанья стена','e',{e:1},4,'allies',{shield:3},'sh'],['boar_mud','Грязевая ванна','w',{w:1},5,'self',{heal:7,cleanse:1},'sh']]],
 ['Саблезуб','🐅','beast','fighter',27,'king',1,0,
  [['sabre_fang','Саблезубый укус','f',{f:1},3,'melee',{dmg:9},'hl'],['sabre_pounce','Прыжок из засады','d',{d:1},4,'cell',{dmg:6,mark:2},'col'],['sabre_roar','Рык хищника','f',{f:1,any:1},3,'row',{dmg:4,slow:1},'frt']],
  [['sabre_rip','Разрыв','f',{f:1},3,'cell',{dmg:5,ign:2},'col'],['sabre_stalk','Засада','d',{d:1},5,'cell',{dmg:4,exec:4},'evd'],['sabre_maul','Терзание','f',{f:1,any:1},2,'melee',{dmg:12},'hl']]],
 ['Енот','🦝','beast','healer',28,'king',0,0,
  [['racc_paw','Цепкая лапка','n',{n:1},4,'melee',{dmg:5},'hl'],['racc_herbs','Лесные травы','n',{n:1},3,'ally',{heal:8,cleanse:1},'ahl'],['racc_stash','Запасы','l',{l:1},4,'allies',{heal:3},'drw']],
  [['racc_trick','Воришка','n',{n:1},5,'cell',{dmg:4,strip:1},'evd'],['racc_bandage','Перевязка','n',{n:1},4,'ally',{heal:6,shield:3},'hl'],['racc_wash','Омовение','w',{w:1},3,'allies',{heal:2,cleanse:1},'ahl']]],
 ['Хорёк','🦡','beast','agile',25,'knight',1,1,
  [['ferret_dart','Бросок хорька','a',{a:1},5,'cell',{dmg:6},'evd'],['ferret_bite','Острые зубки','e',{e:1},4,'melee',{dmg:7,exec:3},'col'],['ferret_dodge','Юркость','a',{a:1},5,'self',{evade:1,shield:4},'hl']],
  [['ferret_burrow','Подкоп','e',{e:1},3,'cell',{dmg:5,root:1},'col'],['ferret_flurry','Шквал укусов','a',{a:1,any:1},4,'hline',{dmg:4,mark:1},'evd'],['ferret_musk','Едкий мускус','d',{d:1},4,'cross',{dmg:2,slow:2},'col']]],
 ['Лунный заяц','🐇','beast','sage',24,'diag2',0,0,
  [['hare_kick','Лунный пинок','l',{l:1},4,'cell',{dmg:8},'hl'],['hare_moon','Лунная дорожка','l',{l:1,any:1},3,'col',{dmg:5,stun:1},'drw'],['hare_dream','Сонная трава','d',{d:1},4,'sq2',{dmg:2,slow:2},'mrk']],
  [['hare_glow','Серебряный свет','l',{l:1},5,'cross',{dmg:3,mark:2},'drw'],['hare_hop','Прыг-скок','a',{a:1},5,'allies',{evade:1},'hl'],['hare_eclipse','Затмение','d',{d:1,any:1},2,'row',{dmg:5,stun:1},'mrk']]],
 // ===== Растения (существа-растения, не сами растения) =====
 ['Пнище','🪵','plant','guard',42,'orth',0,-1,
  [['stump_slam','Удар пнём','e',{e:1},3,'melee',{dmg:6},'sh'],['stump_roots','Цепкие корни','n',{n:1},3,'hline',{dmg:3,root:2},'col'],['stump_rings','Годовые кольца','e',{e:1},5,'self',{shield:8,heal:3},'hl']],
  [['stump_crush','Трухлявый обвал','e',{e:1,any:1},2,'sq2',{dmg:4},'sh'],['stump_moss','Мшистый покров','n',{n:1},4,'allies',{shield:3},'hl'],['stump_sap','Живица','n',{n:1},4,'self',{heal:9,cleanse:1},'sh']]],
 ['Терновник','🥀','plant','fighter',29,'king',1,0,
  [['thorn_lash','Терновый хлыст','n',{n:1},3,'hline',{dmg:4,ign:1},'col'],['thorn_spear','Шип-копьё','d',{d:1},3,'cell',{dmg:8},'hl'],['thorn_bramble','Ежевичная западня','n',{n:1},5,'cell',{trap:{dmg:9,ic:'🥀'}},'col']],
  [['thorn_whip','Кровавый шип','d',{d:1},4,'cell',{dmg:5,drain:1},'hl'],['thorn_burst','Взрыв шипов','n',{n:1,any:1},3,'cross',{dmg:4},'frt'],['thorn_wither','Увядание','d',{d:1},4,'col',{dmg:3,slow:2},'mrk']]],
 ['Мандрагора','🌱','plant','healer',25,'side',0,0,
  [['mandra_shriek','Крик мандрагоры','d',{d:1},3,'cross',{dmg:2,stun:1},'col'],['mandra_root','Целебный корень','n',{n:1},4,'ally',{heal:9},'ahl'],['mandra_bloom','Цветущий корень','l',{l:1,any:1},2,'allies',{heal:4,cleanse:1},'drw']],
  [['mandra_spores','Сонные споры','n',{n:1},4,'row',{dmg:2,slow:1},'ahl'],['mandra_ward','Листва-щит','n',{n:1},4,'ally',{shield:7},'hl'],['mandra_tea','Корневой отвар','l',{l:1},3,'allies',{heal:3},'ahl']]],
 ['Лозохлыст','🌿','plant','agile',26,'diag2',1,1,
  [['vine_snap','Щелчок лозы','a',{a:1},5,'cell',{dmg:6},'evd'],['vine_grab','Захват лозой','n',{n:1},4,'hline',{dmg:3,pull:1},'col'],['vine_swing','Раскачка','a',{a:1},5,'self',{evade:1,heal:4},'hl']],
  [['vine_strangle','Удушение','n',{n:1},4,'cell',{dmg:4,root:2},'col'],['vine_flurry','Вихрь лоз','a',{a:1,any:1},4,'sq2',{dmg:4},'evd'],['vine_sting','Жгучий ус','f',{f:1},4,'cell',{dmg:5,ign:2},'evd']]],
 ['Древень','🌲','plant','sage',28,'rook2',0,-1,
  [['elder_branch','Древний сук','e',{e:1},3,'melee',{dmg:6},'sh'],['elder_whisper','Шёпот леса','n',{n:1},4,'enemies',{dmg:2,mark:2},'drw'],['elder_grove','Священная роща','n',{n:1,any:1},2,'allies',{shield:3,heal:3},'mrk']],
  [['elder_roots','Корни мира','e',{e:1},3,'row',{dmg:3,root:1},'col'],['elder_wisdom','Мудрость веков','l',{l:1},5,'allies',{heal:4,draw:1},'drw'],['elder_curse','Гнилая порча','d',{d:1},4,'col',{dmg:4,ign:2},'mrk']]],
 // ===== Насекомые =====
 ['Скарабей','🪲','insect','guard',38,'orth',0,-1,
  [['scarab_horn','Рог скарабея','e',{e:1},3,'melee',{dmg:6,push:1},'sh'],['scarab_sun','Солнечный шар','l',{l:1},3,'cell',{dmg:6,ign:1},'col'],['scarab_shell','Священный панцирь','l',{l:1},5,'self',{shield:9,immune:1},'hl']],
  [['scarab_roll','Перекат','e',{e:1},4,'hline',{dmg:4},'sh'],['scarab_ward','Знак скарабея','l',{l:1},4,'allies',{shield:3},'hl'],['scarab_sand','Пыльная буря','a',{a:1,any:1},2,'row',{dmg:3,slow:1},'col']]],
 ['Шершень','🐝','insect','fighter',26,'diag2',1,1,
  [['hornet_sting','Жало шершня','f',{f:1},4,'cell',{dmg:7,ign:1},'col'],['hornet_swarm','Рой шершней','a',{a:1,any:1},3,'sq2',{dmg:4},'frt'],['hornet_frenzy','Ярость роя','f',{f:1},5,'cell',{dmg:5,exec:4},'evd']],
  [['hornet_venom','Яд шершня','f',{f:1},4,'cell',{dmg:4,ign:3},'col'],['hornet_buzz','Гул','a',{a:1},4,'enemies',{dmg:2,slow:1},'evd'],['hornet_dive','Пике на жертву','a',{a:1},5,'cell',{dmg:6,mark:1},'hl']]],
 ['Светлячок','✨','insect','healer',23,'diag2',0,1,
  [['firefly_flash','Вспышка','l',{l:1},4,'cross',{dmg:2,stun:1},'col'],['firefly_glow','Тёплый свет','l',{l:1},4,'ally',{heal:8},'ahl'],['firefly_swarm','Хоровод огней','l',{l:1,any:1},3,'allies',{heal:3,evade:1},'drw']],
  [['firefly_beam','Светлый луч','l',{l:1},4,'col',{dmg:3,mark:1},'ahl'],['firefly_lamp','Фонарик','l',{l:1},5,'ally',{shield:5,cleanse:1},'hl'],['firefly_dusk','Сумеречный свет','n',{n:1},3,'allies',{heal:3},'ahl']]],
 ['Кузнечик','🦗','insect','agile',24,'knight',1,1,
  [['hopper_kick','Удар лапкой','a',{a:1},5,'cell',{dmg:6},'evd'],['hopper_leap','Дальний прыжок','a',{a:1},5,'self',{evade:1,shield:3},'hl'],['hopper_song','Стрекот','z',{z:1},4,'cross',{dmg:2,slow:2},'col']],
  [['hopper_bite','Хрустящий укус','e',{e:1},4,'melee',{dmg:7},'evd'],['hopper_plague','Саранча','z',{z:1,any:1},3,'row',{dmg:4},'frt'],['hopper_saw','Пила-лапа','a',{a:1},4,'hline',{dmg:3,mark:1},'evd']]],
 ['Моль-ведунья','🦋','insect','sage',25,'diag2',0,0,
  [['moth_dust','Пыльца забвения','d',{d:1},4,'sq2',{dmg:2,slow:2},'mrk'],['moth_omen','Дурной знак','d',{d:1},5,'cell',{dmg:4,mark:3},'drw'],['moth_lamp','Танец у огня','f',{f:1,any:1},3,'col',{dmg:5,ign:2},'col']],
  [['moth_veil','Мотыльковая вуаль','d',{d:1},4,'allies',{evade:1},'drw'],['moth_hex','Сглаз','z',{z:1},3,'cell',{dmg:4,stun:1},'mrk'],['moth_ash','Пепельные крылья','f',{f:1},4,'cross',{dmg:3,ign:1},'col']]],
 // ===== Магические =====
 ['Сфинкс','🦁','magic','guard',37,'orth',0,-1,
  [['sphinx_paw','Лапа сфинкса','e',{e:1},3,'melee',{dmg:6},'sh'],['sphinx_riddle','Загадка','n',{n:1},4,'cell',{dmg:3,stun:1},'drw'],['sphinx_ward','Каменный взор','l',{l:1},5,'allies',{shield:3},'hl']],
  [['sphinx_sand','Пески времени','e',{e:1,any:1},2,'row',{dmg:3,slow:2},'sh'],['sphinx_seal','Печать','n',{n:1},4,'cell',{dmg:4,strip:1},'col'],['sphinx_aegis','Эгида','l',{l:1},5,'self',{shield:9,cleanse:1},'hl']]],
 ['Мантикора','🦂','magic','fighter',29,'king',1,0,
  [['manti_tail','Хвост мантикоры','d',{d:1},3,'cell',{dmg:6,ign:2},'col'],['manti_volley','Залп шипов','d',{d:1,any:1},3,'hline',{dmg:5},'frt'],['manti_maul','Львиный удар','f',{f:1},3,'melee',{dmg:8},'hl']],
  [['manti_roar','Рёв мантикоры','f',{f:1},4,'enemies',{dmg:2,slow:1},'frt'],['manti_venom','Ядовитый шип','d',{d:1},4,'cell',{dmg:4,exec:4},'col'],['manti_frenzy','Неистовство','f',{f:1,any:1},2,'melee',{dmg:11},'hl']]],
 ['Феникс','🐦','magic','healer',24,'diag2',0,0,
  [['phoenix_flame','Огонь феникса','f',{f:1},4,'cell',{dmg:6,ign:1},'hl'],['phoenix_tear','Слеза феникса','l',{l:1},3,'ally',{heal:9,cleanse:1},'ahl'],['phoenix_rebirth','Пламя возрождения','f',{f:1,any:1},2,'allies',{heal:4},'drw']],
  [['phoenix_wing','Огненное крыло','f',{f:1},4,'hline',{dmg:3,ign:1},'ahl'],['phoenix_glow','Тёплое оперение','l',{l:1},4,'ally',{heal:5,immune:1},'hl'],['phoenix_ash','Пепел','f',{f:1},4,'allies',{heal:2,shield:2},'ahl']]],
 ['Кицунэ','🦊','magic','agile',25,'knight',1,1,
  [['kitsune_fire','Лисье пламя','f',{f:1},5,'cell',{dmg:6,ign:1},'evd'],['kitsune_illusion','Лисий морок','z',{z:1},5,'self',{evade:1,shield:3},'hl'],['kitsune_tails','Девять хвостов','z',{z:1,any:1},3,'sq2',{dmg:4,mark:1},'col']],
  [['kitsune_trick','Обман кицунэ','z',{z:1},5,'cell',{dmg:4,strip:1},'evd'],['kitsune_spirit','Дух-огонёк','f',{f:1},4,'cross',{dmg:3},'col'],['kitsune_charm','Лисьи чары','n',{n:1},4,'cell',{dmg:3,stun:1},'evd']]],
 ['Кот-баюн','🐈','magic','sage',26,'rook2',0,0,
  [['bayun_claw','Когти баюна','d',{d:1},4,'cell',{dmg:5},'col'],['bayun_lullaby','Баюшки-баю','n',{n:1,any:1},3,'row',{dmg:2,stun:1},'drw'],['bayun_tale','Сказка','n',{n:1},4,'allies',{heal:2,shield:2},'mrk']],
  [['bayun_purr','Мурлыканье','n',{n:1},4,'allies',{heal:3},'drw'],['bayun_gaze','Кошачий взгляд','d',{d:1},4,'cell',{dmg:3,slow:2,mark:2},'mrk'],['bayun_spell','Заговор','d',{d:1,any:1},2,'col',{dmg:5,stun:1},'col']]],
 // ===== Нежить =====
 ['Мумия','🧟','undead','guard',38,'orth',0,-1,
  [['mummy_fist','Удар мумии','e',{e:1},3,'melee',{dmg:6},'sh'],['mummy_wraps','Бинты','d',{d:1},4,'hline',{dmg:2,root:2},'col'],['mummy_tomb','Саркофаг','e',{e:1},5,'self',{shield:10},'hl']],
  [['mummy_curse','Проклятие фараона','d',{d:1,any:1},3,'cell',{dmg:5,ign:3},'sh'],['mummy_dust','Пыль гробниц','e',{e:1},4,'sq2',{dmg:2,slow:1},'col'],['mummy_wrapall','Пелены','d',{d:1},4,'allies',{shield:3},'hl']]],
 ['Упырь','🧛','undead','fighter',28,'king',1,0,
  [['ghoul_bite','Укус упыря','d',{d:1},3,'melee',{dmg:7,drain:1},'hl'],['ghoul_claws','Гнилые когти','d',{d:1},4,'cell',{dmg:5,ign:2},'col'],['ghoul_feast','Пир','d',{d:1,any:1},3,'hline',{dmg:5},'hl']],
  [['ghoul_hunger','Голод','d',{d:1},3,'cell',{dmg:5,exec:5},'col'],['ghoul_howl','Вой мертвеца','z',{z:1},4,'enemies',{dmg:2,slow:1},'frt'],['ghoul_rend','Разрывание','e',{e:1},3,'melee',{dmg:8},'hl']]],
 ['Банши','👻','undead','healer',24,'side',0,0,
  [['banshee_wail','Плач банши','d',{d:1},3,'row',{dmg:3,slow:1},'col'],['banshee_veil','Саван','d',{d:1},4,'ally',{shield:6,heal:3},'ahl'],['banshee_lament','Скорбная песнь','l',{l:1,any:1},2,'allies',{heal:4},'drw']],
  [['banshee_scream','Вопль','z',{z:1},3,'cross',{dmg:2,stun:1},'ahl'],['banshee_mist','Призрачный туман','d',{d:1},4,'allies',{evade:1},'hl'],['banshee_soul','Возврат души','l',{l:1},4,'ally',{heal:8},'ahl']]],
 ['Костяная гончая','🐕','undead','agile',25,'knight',1,1,
  [['bhound_bite','Костяной укус','d',{d:1},4,'melee',{dmg:7},'evd'],['bhound_chase','Погоня','a',{a:1},5,'cell',{dmg:5,mark:2},'col'],['bhound_howl','Могильный вой','d',{d:1},4,'col',{dmg:3,slow:2},'evd']],
  [['bhound_lunge','Рывок','a',{a:1},5,'cell',{dmg:6},'evd'],['bhound_pack','Свора','d',{d:1,any:1},3,'hline',{dmg:4,exec:2},'col'],['bhound_rattle','Стук костей','e',{e:1},5,'self',{shield:5,evade:1},'hl']]],
 ['Блуждающий череп','💀','undead','sage',22,'rook2',0,0,
  [['skull_bolt','Мёртвый огонь','f',{f:1},4,'cell',{dmg:6,ign:1},'col'],['skull_hex','Проклятие черепа','d',{d:1},4,'sq2',{dmg:2,mark:2},'drw'],['skull_drain','Вытягивание жизни','d',{d:1,any:1},3,'col',{dmg:4,drain:1},'mrk']],
  [['skull_chatter','Стук зубов','d',{d:1},4,'cell',{dmg:3,stun:1},'mrk'],['skull_flare','Блуждающий огонь','f',{f:1},3,'cross',{dmg:3},'col'],['skull_rot','Тлен','d',{d:1},4,'enemies',{dmg:1,ign:2},'drw']]],
 // ===== Механизмы =====
 ['Стальной краб','🦀','mech','guard',40,'side',0,-1,
  [['crab_pincer','Стальная клешня','w',{w:1},3,'melee',{dmg:6,root:1},'sh'],['crab_plate','Стальной панцирь','e',{e:1},5,'self',{shield:10},'hl'],['crab_steam','Пар','w',{w:1},4,'hline',{dmg:3,slow:1},'col']],
  [['crab_vice','Тиски','w',{w:1},3,'melee',{dmg:5,stun:1},'sh'],['crab_shield','Щит-панцирь','e',{e:1},4,'allies',{shield:3},'hl'],['crab_bubble','Пена','w',{w:1},5,'self',{heal:6,shield:3},'sh']]],
 ['Механоволк','🐺','mech','fighter',27,'king',1,0,
  [['mwolf_jaw','Стальная челюсть','z',{z:1},3,'melee',{dmg:8},'hl'],['mwolf_shock','Шоковый клык','z',{z:1},4,'cell',{dmg:5,chain:3},'col'],['mwolf_hunt','Протокол охоты','z',{z:1,any:1},3,'hline',{dmg:4,mark:2},'frt']],
  [['mwolf_saw','Циркулярка','f',{f:1},3,'melee',{dmg:6,ign:2},'hl'],['mwolf_scan','Захват цели','n',{n:1},5,'cell',{dmg:4,exec:4},'col'],['mwolf_overload','Перегруз','z',{z:1,any:1},2,'cross',{dmg:5},'frt']]],
 ['Шестерёнок','⚙️','mech','healer',27,'orth',0,0,
  [['gear_spin','Зубчатый удар','e',{e:1},4,'melee',{dmg:5},'sh'],['gear_oil','Смазка','n',{n:1},4,'ally',{heal:8,cleanse:1},'ahl'],['gear_tune','Подкрутка','n',{n:1,any:1},2,'allies',{heal:3,shield:2},'drw']],
  [['gear_spark','Искра','z',{z:1},4,'cell',{dmg:4,chain:2},'ahl'],['gear_patch','Заплатка','n',{n:1},4,'ally',{shield:6,heal:2},'hl'],['gear_wind','Завод пружины','n',{n:1},4,'allies',{heal:3},'ahl']]],
 ['Мехастриж','🐦','mech','agile',24,'diag',1,1,
  [['swift_blade','Крыло-лезвие','a',{a:1},5,'cell',{dmg:6},'evd'],['swift_dive','Форсаж','a',{a:1,any:1},5,'hline',{dmg:4,mark:1},'col'],['swift_jet','Реактивный рывок','z',{z:1},5,'self',{evade:1,shield:3},'hl']],
  [['swift_rivet','Заклёпки','e',{e:1},5,'cross',{dmg:3},'evd'],['swift_zap','Электрокрыло','z',{z:1},4,'cell',{dmg:5,chain:2},'evd'],['swift_smoke','Дымовая завеса','a',{a:1},4,'allies',{evade:1},'hl']]],
 ['Часовой филин','🦉','mech','sage',26,'rook2',0,0,
  [['clockowl_beam','Линза','l',{l:1},4,'col',{dmg:4,mark:1},'drw'],['clockowl_tick','Тиканье','n',{n:1},4,'cell',{dmg:3,stun:1},'mrk'],['clockowl_gears','Механизм времени','n',{n:1,any:1},2,'enemies',{dmg:2,slow:1},'drw']],
  [['clockowl_chime','Бой часов','n',{n:1},4,'cross',{dmg:3,slow:1},'mrk'],['clockowl_scan','Обзор','l',{l:1},5,'enemies',{mark:2,dmg:1},'drw'],['clockowl_rewind','Завод назад','n',{n:1},4,'ally',{heal:6,cleanse:1},'hl']]],
 // ===== Элементали =====
 ['Льдистый','🧊','elem','guard',38,'orth',0,-1,
  [['icy_fist','Ледяной кулак','w',{w:1},3,'melee',{dmg:6,slow:1},'sh'],['icy_wall','Ледяная стена','w',{w:1},4,'allies',{shield:3},'hl'],['icy_crust','Наледь','w',{w:1},5,'self',{shield:10},'sh']],
  [['icy_shard','Осколок льда','w',{w:1},4,'cell',{dmg:4,freeze:1},'sh'],['icy_frost','Иней','w',{w:1,any:1},2,'row',{dmg:3,slow:1},'col'],['icy_thaw','Оттепель','n',{n:1},4,'self',{heal:8,cleanse:1},'sh']]],
 ['Магмовик','🌋','elem','fighter',28,'king',1,-1,
  [['magma_fist','Магмовый кулак','f',{f:1},3,'melee',{dmg:8,ign:1},'hl'],['magma_spit','Плевок лавой','f',{f:1},3,'cell',{dmg:6,ign:2},'col'],['magma_erupt','Извержение','f',{f:1,any:1},2,'sq2',{dmg:5},'frt']],
  [['magma_flow','Лавовый поток','e',{e:1},3,'col',{dmg:4,ign:1},'col'],['magma_rock','Вулканическая бомба','e',{e:1},3,'cell',{dmg:7},'hl'],['magma_crust','Корка','e',{e:1},5,'self',{shield:7},'frt']]],
 ['Росинка','💦','elem','healer',26,'side',0,0,
  [['dew_splash','Брызги','w',{w:1},4,'cell',{dmg:5},'hl'],['dew_drop','Живая вода','w',{w:1},4,'ally',{heal:9},'ahl'],['dew_rain','Тёплый дождь','w',{w:1,any:1},2,'allies',{heal:4,cleanse:1},'drw']],
  [['dew_mist','Туманная завеса','w',{w:1},4,'allies',{evade:1},'ahl'],['dew_bubble','Водяной пузырь','w',{w:1},4,'ally',{shield:7},'hl'],['dew_ripple','Рябь','n',{n:1},4,'row',{dmg:2,slow:1},'ahl']]],
 ['Песчаник','🏜️','elem','agile',26,'knight',1,1,
  [['sand_blade','Песчаный клинок','e',{e:1},5,'cell',{dmg:6},'evd'],['sand_storm','Самум','a',{a:1,any:1},3,'row',{dmg:4,slow:1},'col'],['sand_dune','Уйти в дюну','e',{e:1},5,'self',{evade:1,shield:4},'hl']],
  [['sand_whirl','Песчаный вихрь','a',{a:1},4,'cross',{dmg:3,mark:1},'evd'],['sand_glass','Стекло','f',{f:1},4,'cell',{dmg:5,ign:1},'evd'],['sand_trap','Зыбучий песок','e',{e:1},5,'cell',{trap:{dmg:8,ic:'⏳'}},'col']]],
 ['Звёздник','🌟','elem','sage',23,'diag',0,0,
  [['star_ray','Звёздный луч','l',{l:1},4,'col',{dmg:5},'drw'],['star_fall','Звездопад','l',{l:1,any:1},2,'enemies',{dmg:3},'mrk'],['star_sign','Созвездие','n',{n:1},4,'cross',{dmg:2,stun:1},'col']],
  [['star_shine','Сияние','l',{l:1},4,'allies',{heal:2,shield:2},'drw'],['star_comet','Комета','f',{f:1},3,'cell',{dmg:7},'mrk'],['star_void','Тёмная материя','z',{z:1},4,'sq2',{dmg:3,slow:1},'drw']]],
 // ===== Демоны =====
 ['Горгул','🗿','demon','guard',38,'orth',0,-1,
  [['gargoyle_claw','Каменный коготь','e',{e:1},3,'melee',{dmg:6},'sh'],['gargoyle_stone','Окаменение','d',{d:1},4,'cell',{dmg:3,stun:1},'col'],['gargoyle_perch','Каменная стража','e',{e:1},5,'allies',{shield:3},'hl']],
  [['gargoyle_dive','Падение с карниза','e',{e:1,any:1},2,'sq2',{dmg:4},'sh'],['gargoyle_skin','Гранитная кожа','e',{e:1},5,'self',{shield:9,immune:1},'hl'],['gargoyle_glare','Злой взгляд','d',{d:1},4,'hline',{dmg:3,mark:2},'col']]],
 ['Рогач','👹','demon','fighter',29,'king',1,0,
  [['horned_gore','Удар рогами','f',{f:1},3,'melee',{dmg:8,push:1},'hl'],['horned_fury','Адская ярость','f',{f:1,any:1},3,'hline',{dmg:5},'frt'],['horned_brand','Клеймо','d',{d:1},4,'cell',{dmg:5,ign:2},'col']],
  [['horned_stomp','Копытом оземь','e',{e:1},3,'cross',{dmg:4},'frt'],['horned_blood','Кровопускание','d',{d:1},4,'cell',{dmg:6,drain:1},'hl'],['horned_rage','Бешенство','f',{f:1},4,'melee',{dmg:6,exec:4},'col']]],
 ['Пиявень','🩸','demon','healer',27,'side',0,0,
  [['leechling_suck','Присоска','d',{d:1},4,'cell',{dmg:5,drain:1},'hl'],['leechling_ichor','Ихор','d',{d:1},4,'ally',{heal:9},'ahl'],['leechling_pact','Кровный договор','d',{d:1,any:1},2,'allies',{heal:5,hpcost:4},'drw']],
  [['leechling_clot','Сгусток','d',{d:1},4,'ally',{shield:6,cleanse:1},'hl'],['leechling_spit','Кислая слюна','z',{z:1},4,'hline',{dmg:3,ign:1},'ahl'],['leechling_swarm','Рой пиявок','d',{d:1},3,'allies',{heal:3},'ahl']]],
 ['Огненная гончая','🐕‍🦺','demon','agile',25,'knight',1,1,
  [['hellhound_bite','Пылающий укус','f',{f:1},4,'melee',{dmg:7,ign:1},'evd'],['hellhound_dash','Огненный рывок','f',{f:1},5,'hline',{dmg:3,ign:2},'col'],['hellhound_smoke','Серный дым','d',{d:1},5,'self',{evade:1,shield:3},'hl']],
  [['hellhound_pounce','Прыжок гончей','f',{f:1},5,'cell',{dmg:6},'evd'],['hellhound_breath','Адское дыхание','f',{f:1,any:1},3,'cross',{dmg:4,ign:1},'col'],['hellhound_scent','Чутьё','d',{d:1},5,'cell',{dmg:3,mark:3},'evd']]],
 ['Пожиратель душ','👺','demon','sage',27,'rook2',0,0,
  [['souleater_rip','Вырвать душу','d',{d:1},4,'cell',{dmg:7,drain:1},'col'],['souleater_dread','Страх души','z',{z:1,any:1},3,'sq2',{dmg:2,stun:1},'mrk'],['souleater_feast','Пир душ','d',{d:1},4,'enemies',{dmg:3},'drw']],
  [['souleater_chain','Цепи душ','d',{d:1},3,'hline',{dmg:4,root:2,drain:1},'mrk'],['souleater_void','Пустота','z',{z:1},4,'cell',{dmg:4,strip:1},'col'],['souleater_whisper','Шёпот бездны','z',{z:1},4,'col',{dmg:3,slow:2},'drw']]],
 // ===== Аберрации =====
 ['Мимик','📦','aberr','guard',39,'side',0,-1,
  [['mimic_chomp','Хлоп крышкой','e',{e:1},3,'melee',{dmg:7},'sh'],['mimic_lure','Блеск золота','z',{z:1},5,'cell',{trap:{dmg:9,ic:'📦'}},'col'],['mimic_lid','Крышка','e',{e:1},5,'self',{shield:9},'hl']],
  [['mimic_tongue','Язык-хлыст','z',{z:1},3,'hline',{dmg:3,pull:1},'sh'],['mimic_gold','Фальшивое золото','n',{n:1},4,'cell',{dmg:3,stun:1},'col'],['mimic_hide','Притвориться','e',{e:1},5,'self',{shield:6,heal:4},'sh']]],
 ['Ракоскорп','🦞','aberr','fighter',30,'side',1,0,
  [['crusta_claw','Двойная клешня','w',{w:1},3,'melee',{dmg:8},'hl'],['crusta_sting','Хвостовое жало','z',{z:1},4,'cell',{dmg:5,ign:2},'col'],['crusta_slam','Таранный удар','w',{w:1,any:1},2,'hline',{dmg:5,push:1},'frt']],
  [['crusta_snip','Отщип','w',{w:1},4,'cell',{dmg:5,strip:1},'col'],['crusta_frenzy','Бешеные клешни','z',{z:1},3,'melee',{dmg:6,exec:4},'hl'],['crusta_spray','Чернильная струя','w',{w:1},4,'col',{dmg:3,slow:1},'frt']]],
 ['Амёбик','🦠','aberr','healer',26,'side',0,0,
  [['amoeba_engulf','Обволакивание','z',{z:1},4,'cell',{dmg:5,drain:1},'hl'],['amoeba_split','Деление','w',{w:1},4,'ally',{heal:9},'ahl'],['amoeba_goo','Живая слизь','w',{w:1,any:1},2,'allies',{heal:4,cleanse:1},'drw']],
  [['amoeba_pseudo','Ложноножка','z',{z:1},3,'hline',{dmg:3,pull:1},'ahl'],['amoeba_membrane','Мембрана','w',{w:1},4,'ally',{shield:7},'hl'],['amoeba_culture','Колония','z',{z:1},4,'allies',{heal:3},'ahl']]],
 ['Многоглаз','👀','aberr','agile',24,'knight',0,1,
  [['eyes_stare','Пристальный взгляд','z',{z:1},5,'cell',{dmg:6,mark:1},'evd'],['eyes_blink','Мигание','z',{z:1},5,'self',{evade:1,shield:3},'hl'],['eyes_rays','Лучи из глаз','l',{l:1,any:1},3,'cross',{dmg:4},'col']],
  [['eyes_dazzle','Ослепление','l',{l:1},4,'cell',{dmg:3,stun:1},'evd'],['eyes_watch','Тысяча глаз','z',{z:1},5,'enemies',{mark:2,dmg:1},'evd'],['eyes_lash','Ресницы-плети','z',{z:1},4,'hline',{dmg:4},'col']]],
 ['Мозгоед','🧠','aberr','sage',25,'rook2',0,0,
  [['brain_blast','Псионический удар','z',{z:1},4,'cell',{dmg:8},'col'],['brain_control','Контроль разума','z',{z:1,any:1},3,'cell',{dmg:3,stun:2},'mrk'],['brain_wave','Мозговая волна','d',{d:1},4,'row',{dmg:3,slow:1},'drw']],
  [['brain_leech','Пожирание мыслей','d',{d:1},4,'cell',{dmg:4,drain:1},'mrk'],['brain_scream','Пси-крик','z',{z:1},3,'cross',{dmg:3},'col'],['brain_shield','Пси-барьер','n',{n:1},4,'allies',{shield:3},'drw']]],
 // ===== Драконы =====
 ['Василиск','🐊','dragon','guard',37,'orth',-1,-1,
  [['basil_bite','Укус василиска','e',{e:1},3,'melee',{dmg:7},'sh'],['basil_gaze','Каменящий взгляд','d',{d:1},4,'cell',{dmg:3,stun:1},'col'],['basil_scales','Чешуя-броня','e',{e:1},5,'self',{shield:10},'hl']],
  [['basil_venom','Яд василиска','d',{d:1},4,'cell',{dmg:4,ign:3},'col'],['basil_coil','Кольца','e',{e:1},3,'melee',{dmg:5,root:2},'sh'],['basil_hiss','Шипение','d',{d:1,any:1},2,'row',{dmg:3,slow:1},'sh']]],
 ['Саламандра','🦎','dragon','fighter',27,'king',1,0,
  [['salam_breath','Огненный выдох','f',{f:1,any:1},2,'hline',{dmg:5,ign:1},'frt'],['salam_bite','Жгучий укус','f',{f:1},3,'melee',{dmg:8},'hl'],['salam_tail','Огненный хвост','f',{f:1},4,'cell',{dmg:6},'col']],
  [['salam_ember','Угли','f',{f:1},4,'sq2',{dmg:3,ign:1},'frt'],['salam_skin','Огнеупорная кожа','f',{f:1},5,'self',{shield:6,cleanse:1},'hl'],['salam_lunge','Бросок саламандры','e',{e:1},4,'cell',{dmg:6,exec:3},'col']]],
 ['Жемчужный дракон','🐉','dragon','healer',27,'side',0,0,
  [['pearl_breath','Жемчужное дыхание','w',{w:1,any:1},2,'hline',{dmg:4},'ahl'],['pearl_gift','Дар жемчуга','w',{w:1},4,'ally',{heal:9},'ahl'],['pearl_tide','Прилив','w',{w:1},3,'allies',{heal:3,shield:1},'drw']],
  [['pearl_shell','Перламутр','l',{l:1},4,'ally',{shield:6,cleanse:1},'hl'],['pearl_wave','Волна дракона','w',{w:1},4,'col',{dmg:4},'ahl'],['pearl_glow','Лунный жемчуг','l',{l:1},4,'allies',{heal:3},'ahl']]],
 ['Ветрокрыл','🪽','dragon','agile',25,'diag2',1,1,
  [['windwing_claw','Когти на лету','a',{a:1},5,'cell',{dmg:6},'evd'],['windwing_gust','Порыв крыльев','a',{a:1,any:1},4,'row',{dmg:3,push:1},'col'],['windwing_soar','Взмыть','a',{a:1},5,'self',{evade:1,shield:4},'hl']],
  [['windwing_breath','Ледяной ветер','w',{w:1},4,'hline',{dmg:3,slow:1},'evd'],['windwing_strike','Удар с высоты','a',{a:1},4,'cell',{dmg:5,exec:3},'evd'],['windwing_tail','Хлёст хвоста','a',{a:1},4,'cross',{dmg:3},'col']]],
 ['Морской змей','🐍','dragon','sage',28,'side',0,0,
  [['seaserp_breath','Пар из пасти','w',{w:1,any:1},2,'col',{dmg:5},'drw'],['seaserp_whirl','Пучина','w',{w:1},3,'sq2',{dmg:2,pull:1},'mrk'],['seaserp_song','Песнь глубин','d',{d:1},4,'row',{dmg:2,stun:1},'col']],
  [['seaserp_coil','Удушающие кольца','w',{w:1},3,'cell',{dmg:4,root:2},'mrk'],['seaserp_storm','Шторм','z',{z:1},4,'enemies',{dmg:2},'drw'],['seaserp_deep','Зов бездны','d',{d:1},4,'cell',{dmg:5,mark:2},'col']]],
];
 const cards=l=>l.map(([k,n,el,cost,spd,area,fx,sub])=>{CT[k]={n,el,cost,spd,area,...fx,sub};return k});
 const slots={};
 for(const[n,ic,fam,cls,hp,mv,pw,,own,alt]of R2){const ks=cards(own).map(mkCard),els=new Set(ks.map(k=>T[k].el));
   PETS.push({n,ic,fam,cls,hp,mv,pw,cards:ks,els:ELS.filter(e=>els.has(e)),au:CLS[cls].au,role:CLS[cls].role,gen2:1});slots[n]=cards(alt)}
 ALT_SLOTS(slots);
}

// 0.31.0 rebalance (Anton 2026-10-12 «Запускай»): hp re-tuned on 60k Сложный-vs-Сложный fights
const HPT={"Кот-баюн": 49, "Морской змей": 48, "Мозгоед": 39, "Пожиратель душ": 34, "Кузнечик": 32, "Василиск": 38, "Лунный заяц": 34, "Ветрокрыл": 36, "Многоглаз": 29, "Сфинкс": 32, "Скарабей": 35, "Магмовик": 28, "Пиявень": 29, "Хорёк": 30, "Паук": 34, "Песчаник": 37, "Блуждающий череп": 25, "Лозохлыст": 33, "Горгул": 34, "Мантикора": 28, "Сова": 24, "Грифон": 26, "Феникс": 29, "Кальмар": 28, "Часовой филин": 40, "Глазун": 29, "Рогач": 30, "Моль-ведунья": 27, "Искрун": 24, "Дубовик": 32, "Лич": 26, "Ракоскорп": 22, "Русалка": 22, "Лотосовик": 20, "Вампир": 28, "Вихрик": 23, "Скелет": 25, "Амёбик": 19, "Банши": 22, "Солнечник": 24, "Костяная гончая": 22, "Светлячок": 16, "Механоволк": 20, "Терновник": 19, "Ремонтник": 27, "Шестерёнок": 19, "Стальной краб": 34, "Древень": 16, "Мумия": 30, "Пнище": 35, "Упырь": 17, "Мимик": 20, "Кицунэ": 29, "Демон хаоса": 24, "Джинн": 27, "Фея": 22, "Тёмный дракон": 30, "Каменный дракон": 36, "Льдистый": 33, "Цербер": 27, "Робот": 34, "Медуза": 22, "Зомби": 20, "Мехзмей": 31, "Мухолов": 28, "Призрак": 22, "Жемчужный дракон": 24, "Мехастриж": 29, "Медведь": 36, "Мандрагора": 22, "Водяной": 29, "Слизень": 29, "Звёздник": 36, "Мехскорпион": 23, "Огневик": 22, "Пчела": 36, "Златокрыл": 29, "Комар": 24, "Лиса": 30, "Саламандра": 30, "Тенекот": 28, "Бес": 22, "Шершень": 25, "Осьминог": 31, "Росинка": 25, "Богомол": 23, "Саблезуб": 28, "Голем": 33, "Огненная гончая": 24, "Дракончик": 28, "Колючник": 28, "Олень": 29, "Волк": 26, "Жук-носорог": 36, "Единорог": 32, "Дрон": 31, "Козлорог": 28, "Виверна": 29, "Енот": 30, "Кабан": 35};

for(const p of PETS)if(HPT[p.n])p.hp=HPT[p.n];
for(const p of PETS)p.hp*=SC;
/* 0.32.1 hp after the growth-system rebalance (new units, Сложный bot fights at lv1) */
const HP32={"Медведь":94,"Волк":90,"Олень":81,"Дубовик":114,"Солнечник":89,"Жук-носорог":108,"Богомол":67,"Пчела":108,"Паук":83,"Единорог":82,"Грифон":88,"Фея":60,"Джинн":100,"Русалка":77,"Зомби":71,"Мехскорпион":78,"Ремонтник":76,"Мехзмей":79,"Огневик":70,"Искрун":108,"Бес":69,"Слизень":116,"Кальмар":92,"Глазун":69,"Осьминог":120,"Дракончик":78,"Виверна":86,"Кабан":127,"Саблезуб":64,"Хорёк":66,"Пнище":103,"Мандрагора":88,"Лозохлыст":88,"Скарабей":98,"Шершень":59,"Светлячок":55,"Кузнечик":99,"Сфинкс":85,"Мантикора":63,"Кот-баюн":115,"Мумия":89,"Упырь":54,"Механоволк":60,"Мехастриж":88,"Часовой филин":120,"Льдистый":95,"Магмовик":63,"Песчаник":116,"Звёздник":124,"Горгул":73,"Пиявень":75,"Мимик":61,"Амёбик":65,"Саламандра":72,"Ветрокрыл":105,"Морской змей":182,"Колючник":79,"Мухолов":66,"Призрак":58,"Робот":93,"Вихрик":68,"Цербер":72,"Козлорог":75,"Демон хаоса":69,"Каменный дракон":118,"Терновник":51,"Росинка":92,"Рогач":76,"Тёмный дракон":106,"Василиск":114,"Лиса":60,"Сова":75,"Лотосовик":72,"Вампир":103,"Дрон":97,"Голем":89,"Тенекот":64,"Костяная гончая":56,"Огненная гончая":54,"Многоглаз":100,"Жемчужный дракон":71,"Златокрыл":97,"Древень":55,"Моль-ведунья":103,"Пожиратель душ":89,"Комар":58,"Скелет":72,"Лунный заяц":106,"Феникс":82,"Кицунэ":98,"Банши":88,"Стальной краб":108,"Шестерёнок":66,"Мозгоед":106,"Медуза":64,"Блуждающий череп":72};
for(const p of PETS)if(HP32[p.n])p.hp=HP32[p.n];
 // 0.32.0: hp ×3
for(const p of PETS){const a=ALTS[p.n];if(a)p.alt=a.map(mkCard)}
// «+» version of a card: hand-made per template (CUP), otherwise +K to its main number
function upCard(k){if(!k||k==='step'||/\+$/.test(k))return k;const u=k+'+';if(T[u])return u;const t=T[k];if(!t)return k;
  const s=CUP[t.base]||{},c={...t,cost:{...t.cost},sub:t.sub?{...t.sub}:t.sub,up:1};
  if(s.cost){c.cost={};for(const e in s.cost)c.cost[e==='*'?t.el:e]=s.cost[e];if(!sumv(c.cost))c.cost[t.el]=1}
  for(const f in s.add||{}){const v=s.add[f];if(f==='trap')c.trap={...c.trap,...Object.fromEntries(Object.entries(v).map(([a,b])=>[a,typeof b==='number'?(c.trap[a]||0)+(a==='dmg'?b*SC:b):b]))};else c[f]=(c[f]||0)+(SCF.includes(f)?v*SC:v)}
  for(const f in s.set||{})c[f]=typeof s.set[f]==='object'&&s.set[f]&&!Array.isArray(s.set[f])?{...(c[f]||{}),...s.set[f]}:s.set[f];
  if(!s.add&&!s.set&&!s.cost){if(c.dmg)c.dmg+=K;else if(c.trap)c.trap={...c.trap,dmg:c.trap.dmg+K};else if(c.heal)c.heal+=K;else if(c.shield)c.shield+=K;else c.spd=Math.min(5,c.spd+1)}
  if(c.cost.any){c.cost[t.el]=(c.cost[t.el]||0)+c.cost.any;delete c.cost.any}// 0.33.0: only known elements
  c.spd=Math.max(1,Math.min(5,c.spd));delete c.ini;delete c.iniD;c.burn=sumv(c.cost)>=2?1:2;
  c.n=s.n||(t.n+'+');T[u]=c;return u}
// what an upgrade changes, in words, for the reward screen
// c: the pet as it is now (level, Сила), so the numbers match what its card shows
function upDiff(k,c){const a=T[k],b=T[upCard(k)],l=[];if(!a||!b)return'';
  const v=(t,f)=>!c||!t[f]?t[f]||0:f==='dmg'?shownDmg(t,c):f==='heal'?hlv(c,t[f]):f==='shield'||f==='exec'||f==='chain'?sm(c,t[f]):t[f];
  const num=['dmg','heal','shield','spd','stun','root','slow','ign','mark','exec','chain','evade','immune','drain','push','pull','strip','cleanse','freeze','draw'];
  const nm={dmg:'урон',heal:'лечение',shield:'щит',spd:'темп',stun:'оглушение',root:'сковывание',slow:'замедление',ign:'поджог',mark:'метка',exec:'по раненым',chain:'цепь',evade:'уклонение',immune:'иммунитет',drain:'вампиризм',push:'толчок',pull:'притягивание',strip:'снимает щит',cleanse:'очищение',freeze:'заморозка',draw:'рука'};
  for(const f of num){const x=v(a,f),y=v(b,f);if(x!==y)l.push(y>x&&x?`${nm[f]} ${x}→${y}`:y>x?`+${nm[f]}${y>1?' '+y:''}`:`${nm[f]} ${x}→${y}`)}
  if(a.trap&&b.trap&&a.trap.dmg!==b.trap.dmg)l.push(`ловушка ${c?sm(c,a.trap.dmg):a.trap.dmg}→${c?sm(c,b.trap.dmg):b.trap.dmg}`);if(a.trap&&b.trap&&!a.trap.freeze&&b.trap.freeze)l.push('ловушка морозит');
  if(sumv(a.cost)!==sumv(b.cost)||JSON.stringify(a.cost)!==JSON.stringify(b.cost))l.push(`цена ${sumv(a.cost)}→${sumv(b.cost)}`);
  return l.join(', ')}


