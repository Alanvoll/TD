// lower enemy hp of a puzzle (new units) until it has a stable solution. usage: node pzhp.mjs FILE INDEX
import {load} from '/mnt/project-files/pack-battle/src/tools/harness.mjs';
const EX=`globalThis.pzTry2=function(plan){const save=G;G=structuredClone(save);SIMU=true;try{if(!resolveS)initSync();G.log=[];const P=G.P;P.plan=[];for(const e of plan){const o={...e};delete o.cu;o.card=P.hand.find(c=>c.uid===e.cu);P.plan.push(o)}ui.busy=false;resolveS();return G.over==='win'}finally{SIMU=false;G=save}};
globalThis.pzSolve2=function(z,limit){puzBuild(z);const P=G.P,B=G.B;const sols=[];let combos=0;const hand=P.hand.slice();
  function rec(j){if(combos>limit)return;if(j===hand.length){combos++;const pl=P.plan.map(e=>{const o={...e};o.cu=e.card.uid;delete o.card;return o});if(pzTry2(pl))sols.push(pl);return}
    rec(j+1);const card=hand[j];if(whyNot(P,card))return;const paid=payCard(P,card);if(!paid)return;const seen=new Set();
    for(const opt of botOptions(P,B,card)){const key=JSON.stringify(opt);if(seen.has(key))continue;seen.add(key);P.plan.push({kind:'card',card,paid,...opt});rec(j+1);P.plan.pop()}}
  rec(0);return {sols:sols.length,combos,all:sols}};
globalThis.pzGet=i=>PUZ[i];globalThis.SCv=()=>SC;`;
const c=load(process.argv[2],EX);const i=+process.argv[3];
const base=JSON.parse(JSON.stringify(c.pzGet(i)));
for(let d=1;d<=24;d++){const z=JSON.parse(JSON.stringify(base));for(const b of z.B)b.hp3=Math.max(1,b.hp*c.SCv()-d);const s=c.pzSolve2(z,60000);
  let ok=null;for(const pl of s.all){let k=0;for(let q=0;q<8;q++){c.puzBuild(z);if(c.pzTry2(pl))k++}if(k===8){ok=pl;break}}
  if(ok){console.log(JSON.stringify({i,d,hp3:z.B.map(b=>b.hp3),sols:s.sols,combos:s.combos,sol:ok}));break}}
