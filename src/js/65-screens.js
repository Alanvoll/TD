/* ---------- screens ---------- */
const dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const daySeed=()=>{let h=7;for(const ch of dayKey())h=(h*31+ch.charCodeAt(0))>>>0;return h};
function overHtml(){
  const res=G.over==='win'?'Победа':G.over==='lose'?'Поражение':'Ничья';let body='',btn='';
  if(CTX&&CTX.kind==='puz'){const o=puzOverHtml();body=o.body;btn=o.btn}
  else if(CTX&&CTX.kind==='lair'){const o=lairOverHtml();body=o.body;btn=o.btn}
  else if(CTX&&CTX.kind==='rank'){const o=rankOverHtml();body=o.body;btn=o.btn}
  else if(CTX&&CTX.kind==='run'&&META.run){const R=META.run;body=`<div class="m">${G.over==='win'?'Путь свободен.':R.lives>0?'Стая отступает. Потеряна 1 жизнь, осталось ❤ '+R.lives+'.':'Жизни кончились.'}</div>`;btn=G.over==='win'?`<button class="btn main" data-act="run-rw">Награда</button>`:`<button class="btn main" data-act="run-map">${R.lives>0?'К карте':'Итоги'}</button>`}
  else btn=`<button class="btn" data-act="m-menu">В меню</button><button class="btn main" data-act="again">Ещё бой</button>`;
  return`<div class="over"><div class="box"><h2>${res}</h2>${body||`<div class="m">Ходов: ${G.turn}.</div>`}${rewardsHtml(G.rw)}<div class="acts" style="margin-top:10px">${btn}</div>${bstHtml()}</div></div>`;
}
function onOverRecorded(){ // called once when a battle ends
  if(!G.rwDone){G.rwDone=true;achTrack();pstTrack();if(G.dmgOut)questEv('dmg',G.dmgOut);if(G.kills)questEv('kill',G.kills);if(!(CTX&&CTX.kind==='run'))G.rw=battleRewards()}
  if(!CTX){if(G.B.ai==='auto'&&!G.autoRec&&!G.boss){G.autoRec=true;META.auto=Math.max(0,Math.min(10,autoLv()+(G.over==='win'?1:G.over==='lose'?-1:0)));saveMeta()}return}
  if(CTX.rec)return;CTX.rec=true;
  if(CTX.kind==='run'){runAfterBattle();return}
  if(CTX.kind==='lair'){lairOver();return}
  if(CTX.kind==='puz'){puzOver();return}
  if(CTX.kind==='rank'){rankOver();return}
}
function modeClick(act){
  if(rushClick(act)||slotClick(act)||bstClick(act)||frxClick(act)||weekClick(act)||puzClick(act)||welcomeClick(act)||introClick(act)||codexClick(act)||rankClick(act)||lairClick(act))return true;
  if(metaClick(act))return true;
  if(runClick(act))return true;
  if(hintClick(act)||masterClick(act)||achClick(act)||autoClick(act))return true;
  if(act==='m-menu'){CTX=null;NEXT=null;G={phase:'menu'};resetPlace();render();return true}
  if(act==='m-quick'){CTX=null;NEXT=null;G={phase:'pick'};resetPlace();
    // the last quick-fight pack and placement come back (playtest: it started from 0/5 every time)
    TEAM=(META.lastQ||[]).filter(i=>PETS[i]&&(!metaMode()||mp(PETS[i].n).un)).slice(0,5);if(META.lastQP&&TEAM.length===(META.lastQ||[]).length)PLACE=META.lastQP.map(x=>[...x]);ui.pv=null;ui.psheet=false;render();return true}
  if(act==='m-lib'){G={phase:'lib'};ui.lp=null;render();return true}
  return false;
}

