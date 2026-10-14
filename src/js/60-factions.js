/* ---------- enemy factions in runs: humanoid packs with their own rule (Браконьеры, Культисты, Алхимики, Орден) ---------- */
const FACT={
  poach:{n:"Браконьеры",ic:"🪤",land:"Лесная опушка",rule:"Капканы: каждый ход ставят бесплатную ловушку (2 урона) рядом с твоими петами.",
    units:[{n:"Ловчий",ic:"🧔",hp:28,mv:"orth",au:"hog",cards:["h_netthrow","h_club","h_snare"]},{n:"Стрелок",ic:"🤠",hp:22,mv:"rook2",au:"bat",cards:["h_shot","h_aimed","h_volley"]},{n:"Капканщик",ic:"🧑‍🌾",hp:24,mv:"side",au:"bat",cards:["h_snare","h_bait","h_knife"]},{n:"Гончая",ic:"🐕",hp:24,mv:"king",au:"fox",cards:["h_bite","h_chase","howl"]}],
    boss:{n:"Главарь",ic:"🦹",hp:52,mv:"king",au:"fox",cards:["h_whip","h_club","h_order"],boss:1}},
  cult:{n:"Культисты",ic:"🕯",land:"Туманное болото",rule:"Ритуал: каждый ход +1 к ритуалу. На 6 все твои петы получают 3 урона. Каждый павший культист сбивает ритуал на 2.",
    units:[{n:"Аколит",ic:"🧙",hp:24,mv:"diag",au:"owl",cards:["h_curse","h_drainS","h_chant"]},{n:"Жрица",ic:"🧙‍♀️",hp:22,mv:"king",au:"frog",cards:["h_mend","h_smite","h_bless"]},{n:"Тень",ic:"👤",hp:20,mv:"knight",au:"bat",cards:["h_stab","shadow","nightj"]},{n:"Аколит",ic:"🧙",hp:24,mv:"diag",au:"owl",cards:["h_curse","h_drainS","h_chant"]}],
    boss:{n:"Верховный жрец",ic:"🧛",hp:48,mv:"orth",au:"owl",cards:["h_rift","h_drainS","h_curse"],boss:1}},
  alch:{n:"Алхимики",ic:"⚗️",land:"Каменные копи",rule:"Перегонка: каждый ход крадут 1 стихию из твоего самого большого запаса.",
    units:[{n:"Алхимик",ic:"🧑‍🔬",hp:24,mv:"king",au:"frog",cards:["h_flask","h_potion","acid"]},{n:"Подмастерье",ic:"👨‍🔧",hp:26,mv:"orth",au:"hog",cards:["h_bomb","h_wrench","shellS"]},{n:"Механоид",ic:"🤖",hp:36,mv:"orth",au:"hog",cards:["h_zap","thick","h_punch"]},{n:"Алхимик",ic:"🧑‍🔬",hp:24,mv:"king",au:"owl",cards:["h_flask","h_potion","h_bomb"]}],
    boss:{n:"Магистр",ic:"👨‍🔬",hp:44,mv:"king",au:"frog",cards:["h_elixir","h_flask","h_bomb"],boss:1}},
  order:{n:"Орден",ic:"🛡",land:"Старая крепость",rule:"Строй: в начале хода их передний ряд получает щит не меньше 2.",
    units:[{n:"Рыцарь",ic:"🤺",hp:34,mv:"orth",au:"hog",cards:["h_slash","h_shieldwall","h_lance"]},{n:"Арбалетчик",ic:"💂",hp:24,mv:"rook2",au:"bat",cards:["h_bolt","h_pierce","h_shot"]},{n:"Знаменосец",ic:"🧑‍✈️",hp:28,mv:"king",au:"fox",cards:["h_banner","h_slash","h_rally"]},{n:"Рыцарь",ic:"🤺",hp:34,mv:"orth",au:"hog",cards:["h_slash","h_lance","h_shieldwall"]}],
    boss:{n:"Король",ic:"🤴",hp:54,mv:"king",au:"fox",cards:["h_decree","h_lance","h_shieldwall"],boss:1}},
};
