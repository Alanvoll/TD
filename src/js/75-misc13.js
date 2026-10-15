/* ---------- 0.13.0: per-creature stats, save export/import, «Переучить» run reward, land decor ---------- */
function pstTrack(){META.pst=META.pst||{};if(SIMU||!G.P)return;
  for(const p of G.P.pets){if(p.tok||p.pi==null)continue;const n=PETS[p.pi]&&PETS[p.pi].n;if(!n)continue;const s=META.pst[n]=META.pst[n]||{b:0,w:0};s.b++;if(G.over==='win')s.w++;const bs=G.bst&&G.bst['P'+p.id];if(bs){s.d=(s.d||0)+bs.d;s.k=(s.k||0)+bs.k}}}
const pstHtml=n=>{const s=META.pst&&META.pst[n];return s&&s.b?`<span title="боёв и побед">📊 ${plN(s.b,'бой','боя','боёв',1)}, ${Math.round(100*s.w/s.b)}% побед${s.d?` · ⚔ ${s.d} урона`:''}${s.k?` · 💀 добил ${s.k}`:''}</span>`:''};
/* run reward: swap a creature's card in a slot to the other card of that slot (base ↔ second), for this run only */
function altOffer(R,ex){const l=[];
  R.team.forEach((m,mi)=>{const p=PETS[m.pi];if(!p.alt)return;for(let s=0;s<3;s++){if(!p.alt[s])continue;const b=x=>x.replace(/\+$/,'');
    const j=m.cards.findIndex(k=>b(k)===p.cards[s]||b(k)===p.alt[s]);if(j<0||ex.some(o=>o.k==='alt'&&o.mi===mi&&o.j===j))continue;
    const cur=b(m.cards[j]),to=cur===p.cards[s]?p.alt[s]:p.cards[s];l.push({k:'alt',mi,j,to:/\+$/.test(m.cards[j])?upCard(to):to})}});
  return l.length?l[Math.floor(Math.random()*l.length)]:null}
/* land decor on the run map: scattered plants and stones, fixed per map */
const DECO=[['🌲','🌳','🍄','🌿','🌲','🪵'],['🪷','🌾','🫧','🍄','🪵','🌿'],['🏛','🪨','🗿','🕯','🪨','🌵']];
function decoHtml(R){if(!R.map.deco){const d=[];for(let i=0;i<14;i++)d.push([Math.round(Math.random()*92+2),Math.round(Math.random()*94+2),Math.floor(Math.random()*6),Math.random()<.5?1:0]);R.map.deco=d}
  return`<div class="rdeco">${R.map.deco.map(([x,y,k,f])=>`<span style="left:${x}%;top:${y}%;${f?'transform:scaleX(-1)':''}">${DECO[R.act][k]}</span>`).join('')}</div>`}

/* 🤖 autoplay: the Мастер plays the player's turns (handy for testing and watching) */
function autoClick(act){if(act==='autoplay')ui.bIntro=null;if(act==='bspd'){META.spd=spdNow()%3+1;saveMeta();toast('Скорость боя ×'+META.spd+'. Тап по экрану во время хода пропускает анимацию.');render();return true}
if(act!=='autoplay'||!G||G.phase!=='battle')return false;ui.auto=!ui.auto;META.autoOn=false;saveMeta();toast(ui.auto?'🤖 Автобой: Мастер играет за тебя до конца этого боя. Нажми 🤖 ещё раз, чтобы выключить.':'🤖 Автобой выключен.');render();return true}

