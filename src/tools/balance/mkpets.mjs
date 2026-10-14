import {load} from './harness.mjs';import fs from 'fs';
const c=load(process.env.F||'g.html',`globalThis.MK=()=>{const P=PETS.map(p=>({n:p.n,fam:p.fam,cls:p.cls,cards:p.cards.map(k=>[k,T[k].n]),alt:(p.alt||[]).map(k=>k&&T[k]?[k,T[k].n]:null)}));
const use={};for(const p of PETS)for(const k of [...p.cards,...(p.alt||[])])if(k)use[k]=(use[k]||0)+1;
const STF=['stun','slow','root','mark','ign','evade','immune','strip','pull','push'];const C={};
for(const p of PETS)for(const k of (p.alt||[])){if(!k||!T[k])continue;const t=T[k];const num=SCF.some(f=>typeof t[f]==='number'&&t[f]>0)||!!(t.trap&&t.trap.dmg)||!!(t.sum&&t.sum.hp);const st=STF.filter(f=>typeof t[f]==='number'&&t[f]>0);C[k]={shared:use[k]>1,num,st,stv:st.map(f=>t[f])}}
return JSON.stringify([P,C])}`);
const [P,C]=JSON.parse(c.MK());fs.writeFileSync('pets.json',JSON.stringify(P));fs.writeFileSync('altcards.json',JSON.stringify(C));console.log(P.length,Object.keys(C).length,Object.values(C).filter(x=>x.shared).length);
