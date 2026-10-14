/* ---------- 0.36 Anton (night 2026-10-13): the ▼ half has an element too. It costs 1 element of its card's element
   (spend only, never gain), paid like ▲: from the pool, demons may pay with health. A ▼ that is only a step stays free.
   Bots and the player can play a ▼ only when they can pay; a bot's ▼ it cannot pay goes to the discard instead. ---------- */
const DN_COST=1;
{const d0=dnKey;dnKey=function(k){const had=k in DNK,dk=d0(k);if(dk&&!had){const d=T[dk];if(!d.only&&d.el)d.cost={[d.el]:DN_COST}}return dk}
 for(const k in DNK){if(DNK[k])delete T[DNK[k]];delete DNK[k]}}
const dnCost=card=>{const d=HV()?dnT(card.t):null;return d&&d.cost||{}};
function demonPayC(S,card,cs){
  const c=card.pet?pet(S,card.pet):null;if(!c||c.fam!=='demon'||!c.alive||c.ghost)return null;
  const a=avail(S),paid=z0();let miss=0;
  for(const k of ELS){const v=cs[k]||0,u=Math.min(v,Math.max(0,a[k]));a[k]-=u;paid[k]+=u;miss+=v-u}
  if(!miss)return paid;
  const hp=miss*kl(c,2),used=S.plan.filter(e=>e.paid&&e.paid.hp&&e.card&&e.card.pet===c.id).reduce((x,e)=>x+e.paid.hp,0);
  if(c.hp-used-hp<1)return null;paid.hp=hp;return paid}
const dnPay=(S,card)=>{const cs=dnCost(card);return pay(avail(S),cs)||demonPayC(S,card,cs)};
{const w0=whyDnInfo;whyDnInfo=function(S,card){const w=w0(S,card);if(w||!HV())return w;
  if(!dnPay(S,card)){const cs=dnCost(card),a=avail(S),m=ELS.filter(e=>(cs[e]||0)>(a[e]||0));
    return{ic:m.map(e=>EI(e,1)).join(''),tx:'не хватает',long:'Не хватает стихий на ▼: '+m.map(e=>EI(e,1)+' ещё '+((cs[e]||0)-(a[e]||0))).join(', ')+'.'}}
  return null}}
{const p0=planPush;planPush=function(S,card,o,dn){if(!dn||!HV())return p0(S,card,o,dn);const paid=dnPay(S,card);if(!paid)return;p0(S,card,{...o,paid},dn)}}
{const b0=doBurn;doBurn=function(card){if(!HV())return b0(card);const S=G.P;if(ui.busy||G.over)return;
  const pi=S.plan.findIndex(e=>e.card===card);if(pi>=0)S.plan.splice(pi,1);
  const w=whyDn(S,card);if(w){ui.sel=null;ui.msg=w;ui.peek=card.uid;return render()}
  planPush(S,card,{},1);ui.sel=null;ui.peek=null;ui.msg=null;ui.mover=null;render()}}
// bots push their ▼ without paying: pay them in plan order, drop the ones they cannot pay (those cards go to the discard)
function settleDn(S){if(!HV()||!S.plan)return;
  for(let i=0;i<S.plan.length;i++){const e=S.plan[i];if(e.kind!=='burn'||e.paid||!e.card)continue;
    const paid=dnPay(S,e.card);if(paid)e.paid=paid;else{S.plan.splice(i,1);i--}}}
{const b0=botPlan;botPlan=function(S,O){const r=b0(S,O);settleDn(S);return r}}
{const f0=smartFill;smartFill=function(S,O,...a){const r=f0(S,O,...a);settleDn(S);return r}}
{const s0=smartPlan;smartPlan=function(S,O){const r=s0(S,O);settleDn(S);return r}}
{const m0=masterPlan;masterPlan=function(S,O){const r=m0(S,O);settleDn(S);return r}}
// bots weigh each card's ▼ against its ▲ and against keeping the element: the ▼ is scored as its own small card
function dnOpts(S,card){const d=dnT(card.t),c=card.pet?pet(S,card.pet):null;if(!d||!c||!c.alive)return[];
  if(d.only)return[];if(d.area==='melee')return[{cell:[0,c.c]}];if(d.area==='row')return[{cell:[0,0]}];return[{}]}
{const bc0=botCards;botCards=function(S,O){if(!HV()||S.boss)return bc0(S,O);
  S.plan=S.plan.filter(e=>e.kind!=='card'&&!(e.kind==='burn'&&e.bv));
  const hard=aiHard(S),ctx={dmg:new Map()},thr=hard?.6:1;
  for(let k=0;k<12;k++){let best=null;
    for(const card of S.hand){if(S.plan.some(e=>e.card===card))continue;
      if(!whyNot(S,card)){const paid=payCard(S,card);
        for(const opt of botOptions(S,O,card)){const sc=(hard?hardScore(S,O,card,opt,ctx):botScore(S,O,card,opt))+Math.random()*aiNoise(S.ai)-(paid&&paid.hp?paid.hp/K*.8:0);if(!best||sc>best.sc)best={card,opt,paid,sc}}}
      if(!whyDn(S,card)){const paid=dnPay(S,card),px={...card,t:dnKey(card.t)};
        for(const opt of dnOpts(S,card)){const sc=(hard?hardScore(S,O,px,opt,ctx):botScore(S,O,px,opt))+Math.random()*aiNoise(S.ai)-(paid&&paid.hp?paid.hp/K*.8:0)-sumv(dnCost(card))*.3;if(!best||sc>best.sc)best={card,opt,paid,sc,dn:1}}}}
    if(!best||best.sc<thr)break;
    S.plan.push(best.dn?{kind:'burn',card:best.card,paid:best.paid,bv:1,...burnVal(S,best.card)}:{kind:'card',card:best.card,paid:best.paid,...best.opt});
    if(hard){const t=best.dn?dnT(best.card.t):T[best.card.t];if(t.dmg&&OFF.has(t.area)){const cs=t.area==='enemies'?offCells(t.area,null,pet(S,best.card.pet),O):offCells(t.area,best.opt.cell,pet(S,best.card.pet),O);for(const[r,c]of cs){const q=petAt(O,r,c);if(q)ctx.dmg.set(q,(ctx.dmg.get(q)||0)+t.dmg*.85)}}}}}}
// the old «▼ every leftover card» of the bots is gone with a priced ▼: leftovers they did not choose go to the discard
{const b1=botPlan;botPlan=function(S,O){const r=b1(S,O);if(HV()&&!S.boss&&S.ai!=='easy')S.plan=S.plan.filter(e=>e.kind!=='burn'||e.bv);settleDn(S);return r}}
// a ▼ now costs an element like most ▲ do, so its numbers grow by DN_MUL (health-type values; evade, draw and mark stay)
const DN_MUL=1.5;
{const seen=new Set();for(const k in T){const s=T[k]&&T[k].sub;if(!s||seen.has(s))continue;seen.add(s);
  for(const f of ['shield','heal','colDmg','frontDmg','allShield','allHeal'])if(s[f])s[f]=Math.round(s[f]*DN_MUL);
  const[a,b]=subTexts(s);s.short=a;s.txt=b}
 for(const k in DNK){if(DNK[k])delete T[DNK[k]];delete DNK[k]}}
