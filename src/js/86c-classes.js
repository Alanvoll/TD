/* ---------- 0.39 Anton (thread «Классы без в упор»): a class no longer gives anything to its neighbours, each class has its own rule.
   Страж: single-target enemy hits on own pets behind him in his column go into him (not rows or areas).
   Боец: every turn in a row with a ▲ attack makes his hits +K, up to +3K; a turn without one resets it.
   Целитель: each of his ▼ also heals the most wounded pet of the pack.
   Ловкач: after his ▲ hit he may step 1 cell sideways (chosen while planning, may skip).
   Мудрец: when his ▲ hits an enemy, that enemy's cards still to come this turn go 20 later (once per turn per enemy).
   No numbers were tuned (no balancing in this pass). Summons and bosses keep the old neighbour auras. ---------- */
const CLS_AU={guard:'cguard',fighter:'cfight',healer:'cheal',agile:'cagile',sage:'csage'},CLS_AUS=new Set(Object.values(CLS_AU));
const NAPMAX=3,CARE=1.5,SAGE_SLOW=1;// Боец: stacks of +K; Целитель: heal in K; Мудрец: initiative steps (×20)
Object.assign(AURA,{
  cguard:'одиночные удары врага по своим петам позади него в его столбце достаются ему. Удары по ряду и площади он не ловит',
  cfight:`каждый ход подряд, когда он сыграл верх ▲ с ударом, его удары сильнее на ${K} (до +${NAPMAX*K}). Ход без удара сверху сбрасывает разгон`,
  cheal:`каждая его карта, сыгранная низом ▼, ещё лечит самого раненого пета стаи на ${Math.round(CARE*K)}`,
  cagile:'после своего удара сверху ▲ может шагнуть на 1 клетку вбок (или остаться)',
  csage:`когда его карта сверху ▲ попадает во врага, оставшиеся карты этого врага в этом ходу срабатывают на ${SAGE_SLOW*INI_STEP} позже`});
Object.assign(AUB,{cguard:'🛡',cfight:'⚔️',cheal:'💚',cagile:'💨',csage:'🔮'});
Object.assign(AUS,{cguard:'прикрывает свой столбец',cfight:'разгоняется',cheal:'лечит низом',cagile:'бьёт и отходит',csage:'сбивает темп'});
for(const k in CLS)if(CLS_AU[k])CLS[k].au=CLS_AU[k];
for(const p of PETS)if(CLS_AU[p.cls])p.au=CLS_AU[p.cls];
MV.hop={t:'вбок на 1 клетку',d:[[0,-1],[0,1]]};
// Страж: who takes a single-target hit aimed at p
function coverOf(O,p,t){if(!t||!['cell','melee'].includes(t.area))return p;
  return alive(O).filter(q=>q.cls==='guard'&&q!==p&&q.c===p.c&&q.r<p.r&&!q.ghost&&!q.down&&!q.tok).sort((a,b)=>b.r-a.r)[0]||p}
// Мудрец: the slowed enemy's cards still to come this turn move 20 later; the rest of the queue is re-ordered by the usual rules
function sageLater(acts,i){const pf=G.turn%2===1,rest=acts.slice(i+1);
  for(const x of rest){const c=x.card&&x.card.pet?pet(x.S,x.card.pet):null;if(c&&c.slowT===G.turn&&!x.sgd){x.sgd=1;x.sp=Math.min(100,x.sp+SAGE_SLOW*INI_STEP)}}
  rest.sort((x,y)=>x.sp-y.sp||(x.kind==='burn'?0:1)-(y.kind==='burn'?0:1)||(isMoveAct(x)?0:1)-(isMoveAct(y)?0:1)||((x.S===G.P)===pf?0:1)-((y.S===G.P)===pf?0:1));
  acts.splice(i+1,rest.length,...rest)}
// Боец: extra damage from his run of attacking turns
const napB=c=>c&&c.cls==='fighter'&&c.nap>0?kl(c,Math.min(NAPMAX,c.nap)):0;
function napTurnEnd(){for(const S of [G.P,G.B])for(const p of S.pets)if(p.cls==='fighter')p.nap=p.napT===G.turn?Math.min(NAPMAX,(p.nap||0)+1):0}
// Целитель: after each of his ▼
function careHeal(S,c){if(!c||c.cls!=='healer'||!c.alive||c.down||c.ghost)return;
  const l=alive(S).filter(q=>!q.ghost&&!q.tok&&q.hp<q.max).sort((a,b)=>(b.max-b.hp)-(a.max-a.hp));if(!l.length)return;
  const q=l[0],h=Math.min(healAmt(Math.round(kl(c,CARE)*(c.leg?1+LEGV.heal:1))),q.max-q.hp);if(h<=0)return;
  q.hp+=h;bstHeal(S,q,h,0,c);ui.fx={};setFx(S,q,'💚 +'+h,'good');L(S,`💚 ${c.n} лечит ${q.n}: +${h} (Целитель).`);if(!SIMU){render();popFx();ui.fx={}}}
// Ловкач: a ▲ with damage of an agile creature may end with a sideways step
function agileHop(e){if(!HV()||!e||e.kind!=='card'||!e.card||!e.card.pet)return false;const t=T[e.card.t];if(!t||!t.dmg||STEP.has(t.area))return false;
  const S=G.P.plan&&G.P.plan.includes(e)?G.P:G.B,c=pet(S,e.card.pet);return!!(c&&c.cls==='agile')}
function hopFrom(S,e){const i=S.plan.indexOf(e);return projPos({...S,plan:S.plan.slice(0,i+1).map(x=>x===e?{...x,sdir2:null}:x)},e.card.pet)}
function hopDests(S,e){const c=pet(S,e.card.pet);if(!c||!c.alive||c.sz||noMove(c))return[];const[pr,pc]=hopFrom(S,e);return MV.hop.d.filter(d=>inb(pr+d[0],pc+d[1]))}
{const a0=stepAsk;stepAsk=function(){if(!ui.stepE||!G||!G.P||!G.P.plan||!G.P.plan.includes(ui.stepE)||ui.busy||G.over)ui.hop=0;a0();if(!ui.stepE)ui.hop=0;if(ui.stepE||!G||G.phase!=='battle'||!G.P||!HV()||ui.busy||G.over)return;
  for(const e of G.P.plan){if('sdir2' in e||!agileHop(e)||(halfStp(e)&&!('sdir' in e)))continue;
    if(!hopDests(G.P,e).length){e.sdir2=null;continue}
    ui.stepE=e;ui.hop=1;ui.mover=e.card.pet;ui.sel=null;ui.selDn=null;return}}}
{const s0=stepSet;stepSet=function(d){if(ui.hop&&ui.stepE){ui.stepE.sdir2=d||null;ui.hop=0;ui.stepE=null;ui.mover=null;ui.msg=null;render();return}ui.hop=0;return s0(d)}}
{const t0=stepTap;stepTap=function(side,r,c){if(!ui.hop)return t0(side,r,c);const e=ui.stepE,S=G.P;
  if(side==='p'){const[pr,pc]=hopFrom(S,e);const d=hopDests(S,e).find(d=>pr+d[0]===r&&pc+d[1]===c);if(d)return stepSet(d)}stepSet(null)}}
{const d0=dirsFor;dirsFor=function(p,...a){if(ui.hop&&ui.stepE&&ui.stepE.card&&ui.stepE.card.pet===p.id)return MV.hop.d;return d0(p,...a)}}
{const d1=detailHtml;detailHtml=function(){if(ui.hop&&ui.stepE&&!ui.busy){const e=ui.stepE,p=pet(G.P,e.card.pet);
  return`<div class="detail">${petIc(p,1)} ${p.n} (💨 Ловкач) после удара «${T[e.card.t].n}» может отскочить вбок на 1 клетку: тапни подсвеченную клетку или перетащи его. <button class="pill sm" data-act="st-skip">Остаться</button></div>`}return d1()}}
// bots: pick the safer side or stay
{const b0=botSteps;botSteps=function(S,O){b0(S,O);if(!HV()||!S.plan)return;
  for(const e of S.plan){if('sdir2' in e||!agileHop(e))continue;e.sdir2=null;const p=pet(S,e.card.pet),ds=hopDests(S,e);if(!ds.length)continue;const[pr,pc]=hopFrom(S,e);
    let best=null,bs=0;for(const d of ds){const v=(dangerAt(S,O,pr,pc)-dangerAt(S,O,pr+d[0],pc+d[1]))*(p.hp<p.max*.5?1.6:1)-.2+(Math.random()-.5)*(aiNoise(S.ai)||.25)*.3;if(v>bs){bs=v;best=d}}e.sdir2=best}}}
