/* ---------- 0.40 Anton (2026-10-14): mixed elements on cards.
   ▲ may cost up to three different elements (cost map); ▼ may have its own cost (card field dcost = {element:count}),
   otherwise it stays 1 of the card's element; the discard may give several elements (card field gain, see burnVal).
   A card and a creature use at most 3 different elements (checked on load, see elCheck).
   A team uses at most 4 different elements: picking is blocked past 4, random enemies are built within 4. ---------- */
const EL_CARD_MAX=3,EL_TEAM_MAX=4;
{const d1=dnKey;dnKey=function(k){const had=k in DNK,dk=d1(k);if(dk&&!had&&T[k]&&T[k].dcost&&!T[dk].only)T[dk].cost={...T[k].dcost};return dk}}
// every element a card touches: ▲ cost, ▼ cost, discard gain (and its own element)
function cardElSet(k){const t=T[k],s=new Set();if(!t)return s;if(t.el&&ELS.includes(t.el))s.add(t.el);
  for(const e in t.cost||{})if(ELS.includes(e)&&t.cost[e])s.add(e);const d=dnT(k);if(d)for(const e in d.cost||{})if(ELS.includes(e)&&d.cost[e])s.add(e);
  for(const e in t.gain||{})if(ELS.includes(e)&&t.gain[e])s.add(e);if(t.dg&&ELS.includes(t.dg))s.add(t.dg);return s}
cardEls=cards=>ELS.filter(e=>cards.some(k=>cardElSet(k).has(e)));
for(const p of PETS)p.els=cardEls(p.cards||[]);
// data check: cards or creatures over 3 elements are listed in the console (the balance thread fixes the data)
const elCheck=()=>{const bad=[];for(const p of PETS){if(p.els.length>EL_CARD_MAX)bad.push(p.n+': '+p.els.length);for(const k of p.cards||[])if(cardElSet(k).size>EL_CARD_MAX)bad.push(p.n+' / '+T[k].n)}return bad};
{const b=elCheck();if(b.length)console.warn('Больше трёх стихий:',b.join('; '))}
// team cap
const teamEls=ids=>{const s=new Set();for(const i of ids){const p=typeof i==='object'?i:PETS[i];for(const e of (p&&p.els)||[])s.add(e)}return s};
const teamElsOk=ids=>teamEls(ids).size<=EL_TEAM_MAX;
// picks up to n from list keeping the team within 4 elements; strict: never go over (a saved team may come back shorter)
function capPick(list,n,of=x=>x,strict){const out=[];for(const x of list){if(out.length>=n)break;if(teamElsOk(out.concat([x]).map(of)))out.push(x)}
  if(!strict)for(const x of list){if(out.length>=n)break;if(!out.includes(x))out.push(x)}return out}
const CAP_MSG='В команде не больше '+EL_TEAM_MAX+' разных стихий.';
