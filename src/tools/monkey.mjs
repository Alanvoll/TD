// random clicking through the whole app; reports page errors with the click trail.
// usage: node monkey.mjs FILE.html CLICKS SEED [coverage.json]
import {createRequire} from 'module';const require=createRequire(import.meta.url);
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const [F,N0,S0,COV]=process.argv.slice(2);const N=+N0||300,seed=+S0||1;let rs=seed;const rnd=()=>{rs=(rs*1103515245+12345)%2147483648;return rs/2147483648};
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const pg=await b.newPage({viewport:{width:400,height:860}});const errs=[];const trail=[];
pg.on('pageerror',e=>errs.push({e:e.message,stack:(e.stack||'').split('\n').slice(0,3).join(' | '),trail:trail.slice(-8).join(' > ')}));
pg.on('dialog',d=>d.accept());
if(COV)await pg.coverage.startJSCoverage({reportAnonymousScripts:true});
await pg.goto('file://'+F);await pg.waitForTimeout(500);
await pg.evaluate(()=>{const _s=window.setTimeout;window.setTimeout=(f,ms,...a)=>_s(f,Math.min(ms||0,30),...a)});
for(let i=0;i<N;i++){
  const n=await pg.evaluate(()=>[...document.querySelectorAll('[data-act],[data-pick],[data-pcell],[data-cell],[data-view],[data-qt]')].filter(e=>!e.disabled&&e.offsetParent!==null).length);
  if(!n){await pg.waitForTimeout(100);continue}
  const k=Math.floor(rnd()*n);
  const d=await pg.evaluate(k=>{const e=[...document.querySelectorAll('[data-act],[data-pick],[data-pcell],[data-cell],[data-view],[data-qt]')].filter(e=>!e.disabled&&e.offsetParent!==null)[k];if(!e)return'';const a=e.dataset.act||'';
    if(['ch-reset','ch-sand'].includes(a))return'skip';e.click();return a||JSON.stringify(e.dataset)},k);
  trail.push(d);
  if(rnd()<.08)await pg.evaluate(()=>{const g=document.querySelector('[data-act="go"].main,[data-act="start"],[data-act="rs-go"],[data-act="run-rw"],[data-act="run-map"],[data-act="auto"]');if(g&&!g.disabled)g.click()});
  await pg.waitForTimeout(30);
}
const st=await pg.evaluate(()=>({phase:G&&G.phase,run:!!META.run,stats:META.stats}));
console.log('seed',seed,'clicks',N,'errors',errs.length,JSON.stringify(st));
const seen=new Set();for(const e of errs){if(seen.has(e.e))continue;seen.add(e.e);console.log('ERR',e.e,'\n   ',e.stack,'\n   trail:',e.trail)}
if(COV){const c=await pg.coverage.stopJSCoverage();const fs=await import('fs');fs.writeFileSync(COV,JSON.stringify(c.filter(x=>x.source&&x.source.length>100000).map(x=>({functions:x.functions}))))}
await b.close();
