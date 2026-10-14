/* ---------- first-time hints: shown once, remembered in META.hints ---------- */
const HINTS={
  lib:'Это все существа. Открытые цветные, закрытые тёмные. Тапни существо: уровень, качество и выбор карт. Осколки 🧩 открывают новых и повышают качество.',
  runmap:'Путь идёт снизу вверх к боссу. Светятся точки, куда можно пойти. 💀 элиты сильнее, но дают талисманы. 🔥 лагерь лечит.',
  boss:'Босс не прячет карты: кнопка «Колода босса» показывает всё, что он может сыграть. На половине здоровья он становится опаснее.',
  elite:'Элита: у врагов особое свойство, оно написано над их полем.',
  shop:'В лавке тратится золото 🪙 забега. После забега оно пропадает, так что не копи.',
  reward:'После победы выбери одно: новое существо в стаю (до 5), талисман или улучшение карты «+».',
};
function hintNow(){if(!G)return null;META.hints=META.hints||{};let k=null;
  if(G.phase==='lib')k='lib';else if(G.phase==='run'&&META.run){const s=META.run.scr;k=s==='map'?'runmap':s==='shop'?'shop':s==='reward'?'reward':null}
  else if(G.phase==='battle'&&G.run&&!G.over){k=G.boss?'boss':G.emod?'elite':null}
  return k&&!META.hints[k]?k:null}
function hintClick(act){if(act.startsWith('hint1-')){META.hints[act.slice(6)]=1;saveMeta();render();return true}return false}

