// every «Задача» must still be won by its stored solution. usage: node puzcheck.mjs FILE.html
import {load} from './harness.mjs';
const c=load(process.argv[2],`globalThis.PZ={n:()=>PUZ.length,async run(i){const z=PUZ[i];puzBuild(z);const P=G.P;P.plan=[];for(const e of z.sol){const o={...e};delete o.cu;o.card=P.hand.find(c=>c.uid===e.cu);P.plan.push(o)}await resolve();return G.over||null}}`);
const bad=[];for(let i=0;i<c.PZ.n();i++){let ok=0;for(let k=0;k<4;k++)if(await c.PZ.run(i)==='win')ok++;if(ok<4)bad.push(i+':'+ok)}
console.log('puzzles',c.PZ.n(),'not solved by stored solution:',bad.length,bad.join(' '));
