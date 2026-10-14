// deterministic regression: seeded bot-vs-bot battles (quick fight, all AIs, lair bosses, run encounters); prints one digest line per group
// usage: node regress.mjs FILE.html [N]
import {load} from './harness.mjs';
const F=process.argv[2],N=+process.argv[3]||60;
const c=load(F,`
globalThis.RG=async function(N){const out={};const R0=Math.random;
 const seed=s=>{Math.random=rngSeed(s)};
 const fight=async(tag,i,setup)=>{seed(1000+i);META.cheat=META.cheat||{};META.cheat.sand=true;CTX=null;NEXT=null;
   G={phase:'battle'};resetPlace();setup();newGame();
   let t=0;while(!G.over&&t++<45){(typeof anyPlan==='function'?anyPlan:botPlan)(G.P,G.B);await resolve()}
   const hp=S=>S.pets.reduce((a,p)=>a+(p.alive?p.hp:0),0);(out[tag]=out[tag]||[]).push((G.over||'-')[0]+G.turn+':'+hp(G.P)+'/'+hp(G.B))};
 for(const ai of ['easy','medium','hard','master'])for(let i=0;i<N;i++)await fight('q-'+ai,i,()=>{TEAM=shuffle(PETS.map((p,i)=>i)).slice(0,5);PLACE=smartPlace(TEAM.map(i=>PETS[i]),5);NEXT={enemyIdx:shuffle(PETS.map((p,i)=>i)).slice(0,5),ai};G.P&&0});
 for(const k of Object.keys(BOSSES))for(let t=0;t<3;t++)await fight('lair',t,()=>{TEAM=shuffle(PETS.map((p,i)=>i)).slice(0,5);PLACE=smartPlace(TEAM.map(i=>PETS[i]),5);CTX={kind:'lair',bk:k,tier:t}});
 Math.random=R0;let h='';for(const k in out){let x=0;for(const s of out[k])for(const ch of s)x=(x*31+ch.charCodeAt(0))>>>0;h+=k+' '+out[k].length+' '+x.toString(16)+' w'+out[k].filter(s=>s[0]==='w').length+'\\n'}return h}`);
const t0=Date.now();console.log(await c.RG(N));console.error('ms',Date.now()-t0);
