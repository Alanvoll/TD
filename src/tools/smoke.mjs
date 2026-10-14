// scripted runs through every mode: lair (+feat), weekly hunt, league, puzzle, quick boss, run battle; autoplay to the end.
// usage: node smoke.mjs FILE.html
import {createRequire} from 'module';const require=createRequire(import.meta.url);
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const F=process.argv[2];
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const SC={
  lair:['js:cheat("max");cheat("lairs")','act:m-lair','act:la-forest-1','js:TEAM=[0,1,2,3,4]','click:to-place','click:start'],
  rush:['js:cheat("max")','act:m-lair','act:rush-go','js:TEAM=[5,6,7,8,9]','click:to-place','click:start'],
  rank:['js:cheat("max")','act:m-rank','click:rk-go','js:TEAM=[0,1,2,3,4]','click:to-place','click:start'],
  puz:['act:m-puz','click:pz-0'],
  quick:['js:cheat("max")','act:m-quick','js:VS="boss";QBOSS="hydra";TEAM=[10,11,12,13,14]','click:to-place','click:start'],
  quickp:['act:m-quick','js:AI="master";TEAM=[20,21,22,23,24]','click:to-place','click:start'],
  run:['js:cheat("max")','act:m-run','js:RS.team=[0,1,2]','click:rs-go','click:rn-','click:start'],
  codex:['js:cheat("cdx")','act:m-codex'],ach:['act:m-ach'],lib:['act:m-lib'],
};
let bad=0;
for(const [name,steps] of Object.entries(SC)){
  const pg=await b.newPage({viewport:{width:400,height:860}});const errs=[];
  pg.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1]));pg.on('dialog',d=>d.accept());
  await pg.goto('file://'+F);await pg.waitForTimeout(300);
  await pg.evaluate(()=>{localStorage.clear();const _s=window.setTimeout;window.setTimeout=(f,ms,...a)=>_s(f,Math.min(ms||0,5),...a)});
  for(const s of steps){const [k,v]=[s.slice(0,s.indexOf(':')),s.slice(s.indexOf(':')+1)];
    await pg.evaluate(([k,v])=>{if(k==='js')(0,eval)(v);else if(k==='act'){modeClick(v)}else{const e=document.querySelector(`[data-act="${v}"]`)||document.querySelector(`[data-act^="${v}"]`);if(e)e.click();else throw new Error('no button '+v+' in '+G.phase)}render()},[k,v]).catch(e=>errs.push('step '+s+': '+e.message));
    await pg.waitForTimeout(50)}
  // in battle: let the Мастер play until it is over
  let ph=await pg.evaluate(()=>G.phase);
  if(ph==='battle'){await pg.evaluate(()=>{ui.bIntro=null;ui.auto=true;render()});
    for(let i=0;i<300;i++){await pg.waitForTimeout(50);if(await pg.evaluate(()=>!!G.over))break}}
  const st=await pg.evaluate(()=>({phase:G.phase,over:G.over||null,turn:G.turn||0,html:app.innerHTML.length}));
  console.log(name.padEnd(7),JSON.stringify(st),errs.length?'ERR '+errs.slice(0,3).join(' | '):'ok');if(errs.length)bad++;
  await pg.close()}
await b.close();process.exit(bad?1:0);
