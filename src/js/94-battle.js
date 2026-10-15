/* ---------- 0.41.10 Anton (thread «Бой: клетки, карты и тормоза»): no plate about the creature's step.
   After a half with a step is played, the step cells still light up: tap one (or drag the creature) to step.
   Anything else simply leaves the creature where it is. A tap on a creature whose step is chosen takes that step back. ---------- */
{const d0=detailHtml;detailHtml=function(){if(ui.stepE&&!ui.busy)return'';return d0()}}
// a press anywhere but a lit step cell or the stepping creature: no step this time, and the press does what it does
document.addEventListener('pointerdown',e=>{const E=ui.stepE;if(!E||typeof G==='undefined'||!G||G.phase!=='battle'||ui.busy)return;
  const cl=e.target.closest&&e.target.closest('[data-cell]');
  if(cl&&cl.dataset.cell){const[sd,r,c]=cl.dataset.cell.split(',');const p=sd==='p'&&petAt(G.P,+r,+c);
    if(sd==='p'&&(cl.classList.contains('dest')||(p&&p.id===E.card.pet)))return}
  if(ui.hop)E.sdir2=null;else E.sdir=null;ui.hop=0;ui.stepE=null;ui.mover=null;
  requestAnimationFrame(()=>{if(typeof G!=='undefined'&&G&&G.phase==='battle')render()})},true);
// tap on your creature with a chosen step: the latest step (or Ловкач hop) of that creature is taken back and its cells light up again
{const t0=tapCell;tapCell=function(side,r,c){
  if(side==='p'&&!ui.stepE&&!ui.sel&&!ui.mover&&!ui.busy&&G&&!G.over&&HV()){const p=petAt(G.P,r,c);
    const e=p&&[...G.P.plan].reverse().find(x=>x.card&&x.card.pet===p.id&&(x.sdir||x.sdir2));
    if(e){if(e.sdir2)delete e.sdir2;else delete e.sdir;ui.info=null;ui.msg=null;return render()}}
  return t0(side,r,c)}}
// a chosen step shows as the creature's faded figure on the cell it will step to; a tap there takes the step back too
{const g0=ghostMarks;ghostMarks=function(){const g=g0(),S=G.P;if(!HV())return g;
  S.plan.forEach((e,i)=>{if(!e.card||!e.card.pet||!(e.sdir||e.sdir2))return;const p=pet(S,e.card.pet);if(!p||!p.alive)return;
    const[r,c]=projPos({...S,plan:S.plan.slice(0,i+1)},p.id);if(r===p.r&&c===p.c)return;g[r+'-'+c]={n:p.n,ic:p.ic,e,stp:1}});return g}}
// (the step figure carries no label)
{const h0=gridHtml;gridHtml=function(S,side){let h=h0(S,side);if(side!=='p'||!HV())return h;
  for(const g of Object.values(ghostMarks()))if(g.stp)h=h.split(`<span class="pn" style="color:var(--ally)">${g.n}</span>`).join('');return h}}
{const t0=tapCell;tapCell=function(side,r,c){
  if(side==='p'&&!ui.stepE&&!ui.sel&&!ui.mover&&!ui.busy&&G&&!G.over&&HV()){const gh=ghostMarks()[r+'-'+c];
    if(gh&&gh.e){const e=gh.e;if(e.sdir2)delete e.sdir2;else delete e.sdir;ui.info=null;ui.msg=null;return render()}}
  return t0(side,r,c)}}
if(typeof document!=='undefined'&&document.head)document.head.insertAdjacentHTML('beforeend','<style>.grid .cell.ghostc .sil.pl{opacity:.75}.grid .cell.ghostc{outline:2px dashed #8CF09A;outline-offset:-3px}</style>');
// a tap on the creature while its Ловкач hop is being offered takes back the step itself (the hop goes with it)
{const t0=tapCell;tapCell=function(side,r,c){const E=ui.stepE;
  if(side==='p'&&E&&ui.hop&&!ui.busy&&G&&!G.over){const p=petAt(G.P,r,c);
    if(p&&p.id===E.card.pet){delete E.sdir;delete E.sdir2;ui.hop=0;ui.stepE=null;ui.mover=null;ui.info=null;ui.msg=null;return render()}}
  return t0(side,r,c)}}
