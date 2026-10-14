// random 5v5 fights at a given level/quality; every slot picks base or second card at random (where quality opens it)
// usage: F=html node fightsM.mjs N seed ai lv q [hp.json]  -> JSON lines {a,b,sa,sb,r}
import {load} from './harness.mjs';import fs from 'fs';
const [N,seed,ai,lv,q,hpf]=[+process.argv[2],+process.argv[3],process.argv[4]||'hard',+process.argv[5]||1,+process.argv[6]||0,process.argv[7]];
const hp=hpf?fs.readFileSync(hpf,'utf8'):'{}';
const c=load(process.env.F||'g.html',(process.env.PRE||'')+`;globalThis.RUN=async function(N,seed,ai,lv,q){const H2=${hp};for(const p of PETS)if(H2[p.n])p.hp=H2[p.n];
 Math.random=rngSeed(seed);META.cheat=META.cheat||{};META.cheat.sand=true;const out=[];const idx=PETS.map((p,i)=>i);
 const mk=i=>{const p=PETS[i],sl=p.cards.map((k,j)=>p.alt&&p.alt[j]&&altOpen(q,j)&&Math.random()<.5?1:0);return {d:metaDef(i,lv,q,sl),sl:sl.join('')}};
 for(let i=0;i<N;i++){const s=shuffle(idx);const A=s.slice(0,5),B=s.slice(5,10);const DA=A.map(mk),DB=B.map(mk);
  CTX=null;TEAM=DA.map(x=>x.d);NEXT={enemy:DB.map(x=>x.d),ai};
  G={phase:'battle'};resetPlace();PLACE=smartPlace(TEAM,5);newGame();G.P.ai=ai;
  let t=0;while(!G.over&&t++<45){anyPlan(G.P,G.B);await resolve()}
  out.push(JSON.stringify({a:A,b:B,sa:DA.map(x=>x.sl),sb:DB.map(x=>x.sl),r:G.over==='win'?1:G.over==='lose'?0:.5,t:G.turn}))}
 return out.join('\\n')}`);
const t0=Date.now();console.log(await c.RUN(N,seed,ai,lv,q));console.error('ms',Date.now()-t0);
