// random 5v5 fights, bot AI on both sides; writes JSON lines {a:[idx],b:[idx],r:1|0|.5}
// usage: node fights.mjs N seed ai [hpfile.json]
import {load} from './harness.mjs';import fs from 'fs';
const [N,seed,ai,hpf]=[+process.argv[2],+process.argv[3],process.argv[4]||'hard',process.argv[5]];
const hp=hpf?fs.readFileSync(hpf,'utf8'):'{}';
const c=load(process.env.F||'g.html',(process.env.PRE||'')+`;globalThis.RUN=async function(N,seed,ai){const H2=${hp};for(const p of PETS)if(H2[p.n])p.hp=H2[p.n];if(globalThis.process&&0){}${process.env.LEG?"for(const p of PETS){p.q=4;p.lv=25}":""}
 Math.random=rngSeed(seed);META.cheat=META.cheat||{};META.cheat.sand=true;const out=[];const idx=PETS.map((p,i)=>i);
 for(let i=0;i<N;i++){const s=shuffle(idx);const A=s.slice(0,5),B=s.slice(5,10);CTX=null;TEAM=A;PLACE=smartPlace(A.map(i=>PETS[i]),5);NEXT={enemyIdx:B,ai};
  G={phase:'battle'};resetPlace();PLACE=smartPlace(A.map(i=>PETS[i]),5);newGame();G.P.ai=ai;
  let t=0;while(!G.over&&t++<45){anyPlan(G.P,G.B);await resolve()}
  out.push(JSON.stringify({a:A,b:B,r:G.over==='win'?1:G.over==='lose'?0:.5,t:G.turn}))}
 return out.join('\\n')}
globalThis.NAMES=()=>JSON.stringify(PETS.map(p=>[p.n,p.hp,p.fam,p.cls]))`);
if(process.env.NAMES){console.log(c.NAMES());process.exit(0)}
const t0=Date.now();console.log(await c.RUN(N,seed,ai));console.error('ms',Date.now()-t0);
