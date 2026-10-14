// finds a fresh solution for a «Задача» after rule changes. usage: node puzfix.mjs FILE.html INDEX
import {load} from './harness.mjs';
const EX=`
globalThis.pzB=i=>puzBuild(PUZ[i]);
globalThis.puzTry=function(plan){const save=G;G=structuredClone(save);SIMU=true;try{if(!resolveS)initSync();G.log=[];const P=G.P;P.plan=[];
  for(const e of plan){const o={...e};delete o.cu;o.card=P.hand.find(c=>c.uid===e.cu);P.plan.push(o)}ui.busy=false;resolveS();return G.over==='win'}finally{SIMU=false;G=save}};
globalThis.puzSolve=function(i,limit){const z=PUZ[i];puzBuild(z);const P=G.P,B=G.B;const sols=[];let combos=0;const hand=P.hand.slice();
  function rec(j){if(combos>limit)return;
    if(j===hand.length){combos++;const pl=P.plan.map(e=>{const o={...e};o.cu=e.card.uid;delete o.card;return o});if(puzTry(pl))sols.push(pl);return}
    rec(j+1);const card=hand[j];if(whyNot(P,card))return;const paid=payCard(P,card);if(!paid)return;const seen=new Set();
    for(const opt of botOptions(P,B,card)){const key=JSON.stringify(opt);if(seen.has(key))continue;seen.add(key);P.plan.push({kind:'card',card,paid,...opt});rec(j+1);P.plan.pop()}}
  rec(0);return {sols:sols.length,combos,all:sols}};`;
const c=load(process.argv[2],EX);const i=+process.argv[3];
const s=c.puzSolve(i,60000);
// keep a solution that wins every time (resolution has some randomness)
let best=null;for(const pl of s.all){let ok=0;for(let k=0;k<8;k++){c.pzB(i);if(c.puzTry(pl))ok++}if(ok===8){best=pl;break}}
console.error('puzzle',i,'solutions',s.sols,'of',s.combos);console.log(JSON.stringify(best));
