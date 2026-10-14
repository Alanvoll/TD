/* ---------- «Стратег» bot. Builds many different plans (which cards go ▲, which go ▼, which stay in hand, who steps where),
   plays each one on copies of the battle against guessed enemy hands, and keeps the best.
   It never peeks: the enemy hand and both decks are reshuffled from the cards it cannot see before every look-ahead ---------- */
const SMART={cands:26,s1:4,top:0,s2:8,depth:0,w:{alive:4,el:1,elcap:14,hand:.35,front:.3,thr:1,sh:.6}};const SW=SMART.w;
let startTurnS=null;
function smartInit(){if(!resolveS)initSync();startTurnS=mkSync(startTurn,[['anyPlan(G.B,G.P)','nop()']])}
// a guessed world: enemy hand drawn from the cards we cannot see, our own deck order unknown too
function smartWorld(me){const S=me==='P'?G.P:G.B,O=me==='P'?G.B:G.P,all=shuffle([...O.hand,...O.deck].map(c=>c.uid));
  return{oh:all.slice(0,O.hand.length),od:all.slice(O.hand.length),sd:shuffle(S.deck.map(c=>c.uid)),seed:Math.floor(Math.random()*1e9)}}
function smartApply(S,O,w){const byU=new Map([...O.hand,...O.deck].map(c=>[c.uid,c]));O.hand=w.oh.map(u=>byU.get(u));O.deck=w.od.map(u=>byU.get(u));
  const sm=new Map(S.deck.map(c=>[c.uid,c]));S.deck=w.sd.map(u=>sm.get(u))}
// what a pet is worth: its health plus what its cards can still do to the enemy
function smartPetW(p){if(p.tok)return .3;const d=(p.cards||[]).reduce((a,k)=>{const t=T[k];if(!t)return a;return a+(t.dmg||0)*(t.area==='enemies'||t.area==='row'?2:1)+(t.trap?t.trap.dmg:0)+(t.heal||0)*.7+(t.shield||0)*.5+(t.stun||t.freeze?3*K:0)},0);return 1+Math.min(1.2,d/(12*K))*.5}
function smartSide(S,O){let v=0;
  for(const p of S.pets){if(!p.alive)continue;const w=smartPetW(p);if(p.tok){v+=p.hp*.3;continue}
    const hp=p.ghost?0:p.hp;v+=(hp+Math.min(p.shield,SHIELD_CAP)*SW.sh)*(p.ghost?0:1)+(p.ghost?(p.down?3:1)*K:SW.alive*K*(1+(w-1)*SW.thr));
    if(p.st)v-=(p.st.stun||0)*1.5*K+(p.st.burn||0)*.9*K+(p.st.slow?.4*K:0)+(p.st.root?.3*K:0)+(p.st.mark?.7*K:0)-(p.st.evade?.6*K:0)-(p.st.immune?.4*K:0);if(p.frozen)v-=1.5*K;
    if(p.r===0&&!p.ghost)v-=SW.front*K}
  // resources: elements we can actually spend, and cards in hand we can pay for
  const need=new Set(needEls(S));let el=0;for(const k of ELS)el+=need.has(k)?Math.min(S.pool[k],4):Math.min(S.pool[k],1)*.3;v+=Math.min(SW.elcap,el)*SW.el*K;
  v+=S.hand.filter(c=>c.t!=='step'&&pet(S,c.pet)&&pet(S,c.pet).alive).length*SW.hand*K;
  return v}
function smartEval(me){const S=G[me],O=me==='P'?G.B:G.P;let v=smartSide(S,O)-smartSide(O,S);
  if(G.over){const w=G.over==='draw'?0:(G.over==='win')===(me==='P')?1:-1;v+=w*400}return v}
// play the plan (and `depth` more turns with quick bots on both sides) on a copy of the battle
function smartSim(me,ser,w,depth,cache){const save=G,su={...ui},R0=Math.random;G=structuredClone(save);SIMU=true;
  try{const S=G[me],O=me==='P'?G.B:G.P;G.log=[];smartApply(S,O,w);Math.random=rngSeed(w.seed);
    if(!cache.op){const a=O.ai;O.ai='hard';botPlan(O,S);O.ai=a;cache.op=planSer(O.plan)}else planLoad(O,cache.op);
    planLoad(S,ser);ui.busy=false;resolveS();
    for(let d=0;d<depth&&!G.over;d++){startTurnS();for(const X of [S,O]){const a=X.ai;X.ai='hard';if(X.boss)X.ai=a;botPlan(X,X===S?O:S);X.ai=a}ui.busy=false;resolveS()}
    return smartEval(me)}
  finally{Math.random=R0;SIMU=false;G=save;for(const k of Object.keys(ui))if(!(k in su))delete ui[k];Object.assign(ui,su)}}
// candidate plans
function smartFill(S,O,first,keepN,thr){
  // ▲: the forced first pick, then greedily the best remaining card+target (hard-bot scoring)
  S.plan=[];const ctx={dmg:new Map()};
  const push=(card,opt,paid)=>{S.plan.push({kind:'card',card,paid,...opt});const t=T[card.t];
    if(t.dmg&&OFF.has(t.area)){const cs=t.area==='enemies'?offCells(t.area,null,pet(S,card.pet),O):offCells(t.area,opt.cell,null,O);for(const[r,c]of cs){const q=petAt(O,r,c);if(q)ctx.dmg.set(q,(ctx.dmg.get(q)||0)+t.dmg*.85)}}};
  if(first){const paid=payCard(S,first.card);if(paid)push(first.card,first.opt,paid)}
  if(first!==null)for(let k=0;k<12;k++){let best=null;
    for(const card of S.hand){if(S.plan.some(e=>e.card===card)||whyNot(S,card))continue;const paid=payCard(S,card);
      for(const opt of botOptions(S,O,card)){const sc=hardScore(S,O,card,opt,ctx)-(paid&&paid.hp?paid.hp/K*.8:0);if(!best||sc>best.sc)best={card,opt,paid,sc}}}
    if(!best||best.sc<thr)break;push(best.card,best.opt,best.paid)}
  // ▼: burn the rest, but keep the keepN most valuable cards we will be able to pay for next turn
  const free=S.hand.filter(c=>!S.plan.some(e=>e.card===c));
  const nx={...avail(S)};for(const c of free){addGain(nx,burnVal(S,c))}
  const keep=[];if(keepN){const cand=free.filter(c=>c.t!=='step').map(c=>({c,v:cardValue(S,O,c)+(T[c.t].grow&&(c.ch||0)<4?1.5:0)})).sort((a,b)=>b.v-a.v);
    for(const {c} of cand){if(keep.length>=keepN)break;const n2={...nx};addGain(n2,burnVal(S,c),null,-1);for(const o of keep)addGain(n2,burnVal(S,o),null,-1)
      if(pay(n2,costOf(S,c)))keep.push(c)}}
  for(const c of free)if(!keep.includes(c))S.plan.push({kind:'burn',card:c,...burnVal(S,c)});
}
function smartCands(S,O){const out=[],seen=new Set();
  const add=()=>{const sg=planSig(S.plan);if(!seen.has(sg)){seen.add(sg);out.push(planSer(S.plan))}};
  // first picks: the best few (card, target) by the hard bot's scoring, one per card, plus "nothing ▲"
  const ctx={dmg:new Map()},firsts=[];
  for(const card of S.hand){if(whyNot(S,card))continue;let b=null;
    for(const opt of botOptions(S,O,card)){const sc=hardScore(S,O,card,opt,ctx);if(!b||sc>b.sc)b={card,opt,sc}}
    if(b&&b.sc>0)firsts.push(b)}
  firsts.sort((a,b)=>b.sc-a.sc);
  for(const f of [undefined,...firsts.slice(0,6)])for(const kn of [0,1,2])for(const thr of [.6,2]){smartFill(S,O,f,kn,thr);add();if(out.length>=SMART.cands)return out}
  for(const kn of [0,1,2,9]){smartFill(S,O,null,kn,0);add()}
  return out}
function smartPlan(S,O){if(!startTurnS)smartInit();const me=S===G.P?'P':'B',ai0=S.ai,cands=[],seen=new Set();
  const add=pl=>{const sg=planSig(pl.map(e=>({...e,card:{uid:e.cu}})));if(!seen.has(sg)){seen.add(sg);cands.push(pl)}};
  try{for(const pl of smartCands(S,O))add(pl);S.ai='hard';botPlan(S,O);add(planSer(S.plan));S.ai='medium';botPlan(S,O);add(planSer(S.plan))}finally{S.ai=ai0}
  if(cands.length<2){planLoad(S,cands[0]||[]);return}
  // stage 1: this turn only, every candidate against the same guessed enemy hands
  const w1=Array.from({length:SMART.s1},()=>({w:smartWorld(me),c:{}}));
  let sc=cands.map(c=>({c,v:w1.reduce((a,x)=>a+smartSim(me,c,x.w,0,x.c),0)/w1.length}));
  sc.sort((a,b)=>b.v-a.v);
  // stage 2: the best few, played further ahead
  if(SMART.top>0){const w2=Array.from({length:SMART.s2},()=>({w:smartWorld(me),c:{}}));
    sc=sc.slice(0,SMART.top).map(x=>({c:x.c,v:w2.reduce((a,y)=>a+smartSim(me,x.c,y.w,SMART.depth,y.c),0)/w2.length}));sc.sort((a,b)=>b.v-a.v)}
  planLoad(S,sc[0].c)}
