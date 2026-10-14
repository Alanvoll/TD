import {load} from './harness.mjs';
const [F,N,seed,ai]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5]||'hard'];
const c=load(F,`;globalThis.ST=async function(N,seed,ai){Math.random=rngSeed(seed);META.cheat=META.cheat||{};META.cheat.sand=true;const idx=PETS.map((p,i)=>i);
let up=0,dn=0,turns=0,sides=0,pool=0,w=0;
for(let i=0;i<N;i++){const s=shuffle(idx);const A=s.slice(0,5),B=s.slice(5,10);CTX=null;TEAM=A;NEXT={enemyIdx:B,ai};G={phase:'battle'};resetPlace();PLACE=smartPlace(A.map(i=>PETS[i]),5);newGame();G.P.ai=ai;
 let t=0;while(!G.over&&t++<45){anyPlan(G.P,G.B);for(const S of [G.P,G.B]){up+=S.plan.filter(e=>e.kind==='card').length;dn+=S.plan.filter(e=>e.kind==='burn').length;pool+=ELS.reduce((a,k)=>a+S.pool[k],0);sides++}await resolve()}
 turns+=G.turn;w+=G.over==='win'?1:0}
return JSON.stringify({turns:+(turns/N).toFixed(1),up:+(up/sides).toFixed(2),dn:+(dn/sides).toFixed(2),pool:+(pool/sides).toFixed(1)})}`);
console.log(await c.ST(N,seed,ai));
