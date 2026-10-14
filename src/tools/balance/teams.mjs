// each team in TEAMS json vs K random enemy teams; prints {i,w,n} per team
// usage: node teams.mjs teams.json from to K seed [hp.json]
import {load} from './harness.mjs';import fs from 'fs';
const [tf,fr,to,K,seed,hpf]=process.argv.slice(2);const TE=fs.readFileSync(tf,'utf8');const hp=hpf?fs.readFileSync(hpf,'utf8'):'{}';
const c=load(process.env.F||'g.html',(process.env.PRE||'')+`;globalThis.RUN=async function(fr,to,K,seed){const H2=${hp};for(const p of PETS)if(H2[p.n])p.hp=H2[p.n];const TE=${TE};
 Math.random=rngSeed(seed);META.cheat=META.cheat||{};META.cheat.sand=true;const out=[];const idx=PETS.map((p,i)=>i);
 for(let k=fr;k<to;k++){const A=TE[k];let w=0;for(let i=0;i<K;i++){const B=shuffle(idx.filter(x=>!A.includes(x))).slice(0,5);CTX=null;TEAM=A;NEXT={enemyIdx:B,ai:'hard'};
  G={phase:'battle'};resetPlace();PLACE=smartPlace(A.map(i=>PETS[i]),5);newGame();G.P.ai='hard';
  let t=0;while(!G.over&&t++<45){anyPlan(G.P,G.B);await resolve()}w+=G.over==='win'?1:G.over==='lose'?0:.5}
  out.push(JSON.stringify({i:k,w,n:K}))}return out.join('\\n')}`);
console.log(await c.RUN(+fr,+to,+K,+seed));
