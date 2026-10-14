/* ---------- 0.11.0: «Мастер» bot. It builds several plans, plays each one turn ahead on a copy of the battle
   against guessed enemy hands (drawn at random from cards it cannot see, so it never peeks) and keeps the best ---------- */
let SIMU=false;const nop=()=>0;
let resolveS=null,execS,execMainS,doMoveS,checkTrapsS;
function fxStepS(S,cells,cls,apply){if(apply)apply()}
function mkSync(f,map){let s=f.toString().replace(/\basync\s+/g,'').replace(/\bawait\s+/g,'');for(const[a,b]of map)s=s.split(a).join(b);return(0,eval)('('+s+')')}
function initSync(){const m=[['fxStep(','fxStepS('],['checkTraps(','checkTrapsS('],['doMove(','doMoveS('],['execMain(','execMainS('],['exec(','execS('],['sleep(','nop('],['shoot(','nop(']];
  resolveS=mkSync(resolve,[...m,['startTurn()','nop()']]);execS=mkSync(exec,m);execMainS=mkSync(execMain,m);doMoveS=mkSync(doMove,m);checkTrapsS=mkSync(checkTraps,m)}
const MASTER={cands:7,samples:3};
const planSig=pl=>pl.map(e=>[e.kind,e.card?e.card.uid:'',e.cell,e.petT,e.dir].join(':')).sort().join('|');
const planSer=pl=>pl.map(e=>{const o={...e};delete o.card;o.cu=e.card?e.card.uid:null;return o});
function planLoad(S,ser){S.plan=[];for(const e of ser){const o={...e};delete o.cu;if(e.cu!=null){o.card=S.hand.find(c=>c.uid===e.cu);if(!o.card)continue}S.plan.push(o)}}
function evalSide(S){let v=0;
  for(const p of S.pets){if(!p.alive)continue;if(p.tok){v+=p.hp*.3;continue}
    v+=p.hp+p.shield*.6+6*K-(p.ghost?5*K:0);if(p.st)v-=(p.st.stun||0)*1.5*K+(p.st.burn||0)*.8*K+(p.st.slow?.5*K:0)+(p.st.root?.3*K:0)+(p.st.mark?.6*K:0);if(p.frozen)v-=1.5*K}
  return v+Math.min(12,sumv(S.pool))*.35*K/2}
function oppSample(me){const O=me==='P'?G.B:G.P,all=shuffle([...O.hand,...O.deck]);return{hand:all.slice(0,O.hand.length).map(c=>c.uid)}}
function simEval(me,ser,smp){const save=G,su={...ui};G=structuredClone(save);SIMU=true;
  try{const S=G[me],O=me==='P'?G.B:G.P;G.log=[];
    const all=[...O.hand,...O.deck],hs=new Set(smp.hand);O.hand=all.filter(c=>hs.has(c.uid));O.deck=all.filter(c=>!hs.has(c.uid));
    if(!smp.plan){const a=O.ai;O.ai=!a||a==='master'||a==='auto'?'hard':a;botPlan(O,S);O.ai=a;smp.plan=planSer(O.plan)}else planLoad(O,smp.plan);
    planLoad(S,ser);ui.busy=false;resolveS();
    let v=evalSide(S)-evalSide(O);if(G.over){const w=G.over==='draw'?0:(G.over==='win')===(me==='P')?1:-1;v+=w*500}return v}
  finally{SIMU=false;G=save;for(const k of Object.keys(ui))if(!(k in su))delete ui[k];Object.assign(ui,su)}}
function masterPlan(S,O){if(!resolveS)initSync();const me=S===G.P?'P':'B',ai0=S.ai,cands=[],seen=new Set();
  const add=()=>{const sg=planSig(S.plan);if(!seen.has(sg)){seen.add(sg);cands.push(planSer(S.plan))}};
  try{S.ai='hard';botPlan(S,O);add();for(let i=0;i<14&&cands.length<MASTER.cands;i++){S.ai=i%3===2?'easy':'medium';botPlan(S,O);add()}}finally{S.ai=ai0}
  if(cands.length>1){const smps=Array.from({length:MASTER.samples},()=>oppSample(me));let best=cands[0],bs=-1e9;
    for(const c of cands){let v=0;for(const s of smps)v+=simEval(me,c,s);if(v>bs){bs=v;best=c}}planLoad(S,best)}else planLoad(S,cands[0])}
const anyPlan=(S,O)=>S.boss?botPlan(S,O):S.ai==='smart'?smartPlan(S,O):S.ai==='master'?masterPlan(S,O):botPlan(S,O);
// 💡 advice: the Мастер lays out the player's cards (it sees only what the player sees)
function masterClick(act){if(act!=='advice'||!G||G.phase!=='battle'||G.over||ui.busy)return false;
  masterPlan(G.P,G.B);ui.sel=null;ui.mover=null;toast('💡 Мастер разложил карты. Можно поменять или нажать «В бой».');render();return true}

