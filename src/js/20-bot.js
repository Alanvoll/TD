/* ---------- bot ---------- */
function botOptions(S,O,card){
  const t=T[card.t];
  if(t.area==='melee'){const l=[];for(let c=0;c<COLS;c++)l.push({cell:[0,c]});return l}
  if(t.area==='enemies'||t.area==='self'||t.area==='allies'||t.area==='summon')return[{}];
  if(OFF.has(t.area)){const l=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)l.push({cell:[r,c]});return l}
  if(t.area==='ally')return alive(S).map(p=>({petT:p.id}));
  if(STEP.has(t.area)){const l=[];for(const p of alive(S))if(!noMove(p))for(const d of dirsFor(p,card))if(inb(p.r+d[0],p.c+d[1]))l.push({petT:p.id,dir:d});return l}
  return[];
}
function stVal(t,q){let v=0;if(!q)return 0;
  if(t.stun&&canSt(q,'stun')&&!sv(q,'stun'))v+=2+threatOf(q)/K*.12;
  if(t.root&&canSt(q,'root')&&!sv(q,'root'))v+=.8;
  if(t.slow&&canSt(q,'slow')&&!sv(q,'slow'))v+=.7;
  if(t.ign&&canSt(q,'burn'))v+=Math.max(0,t.ign-sv(q,'burn'))*.9;
  if(t.strip)v+=q.shield/K*.8+(sv(q,'immune')?.5:0)+(sv(q,'evade')?1:0);
  if(t.mark&&canSt(q,'mark')&&!sv(q,'mark'))v+=.9;
  return v}
function allyFxVal(t,l){let v=0;for(const p of l){if(t.cleanse)v+=(p.st?NEG.filter(k=>p.st[k]).length:0)*1.6+(p.frozen?1.6:0);if(t.immune)v+=.35}return v}
function botScore(S,O,card,opt){
  const t=T[card.t],caster=card.pet?pet(S,card.pet):null;let s=sumv(t.gen)*0.9;
  if(t.trap){
    const[r,c]=opt.cell,p=petAt(O,r,c);
    if(O.traps.some(x=>x.r===r&&x.c===c))return -1;
    if(p)s+=Math.min(t.trap.dmg,p.hp)/K*.8+(t.trap.freeze?1.5:0);
    else if(alive(O).some(q=>Math.abs(q.r-r)+Math.abs(q.c-c)===1))s+=.9;
    return s;
  }
  if(OFF.has(t.area)){
    let hits=0;
    for(const[r,c]of offCells(t.area,opt.cell,caster,O)){const p=petAt(O,r,c);if(!p||p.ghost)continue;hits++;let dg=t.dmg?cardDmg(S,O,caster,t,p,card.ch):0;if(sv(p,'evade'))dg=0;s+=Math.min(dg,p.hp)/K*(t.drain?1.4:1)+stVal(t,p)+(p.tok?-.5:0);if(dg&&dg>=p.hp)s+=4;if(t.freeze&&!ccBlock(p))s+=2;if(t.push||t.pull)s+=.5}
    if(t.chain&&hits)s+=t.chain/K*.8;
    if(!hits)s-=1.5;
  }
  if(t.heal){const l=t.area==='ally'?[pet(S,opt.petT)]:t.area==='self'?[caster]:alive(S);for(const p of l)s+=Math.min(t.heal,p.ghost?0:p.max-p.hp)/K*.8}
  if(t.cleanse||t.immune)s+=allyFxVal(t,t.area==='ally'?[pet(S,opt.petT)]:t.area==='self'?[caster]:alive(S));
  if(t.shield){if(t.area==='self')s+=caster.hp<caster.max*.7?2:.5;else s+=alive(S).length*.5}
  if(t.draw)s+=1.2;
  if(t.area==='summon')s+=alive(S).filter(p=>p.tok).length<2?(t.sum?2.2:3.5):-5;
  if(t.evade){const l=t.area==='self'?[caster]:alive(S);for(const p of l)if(!sv(p,'evade'))s+=p.hp<p.max*.7?1.3:.5}
  if(t.hpcost)s-=t.hpcost/K*.7;
  if(STEP.has(t.area)){const p=pet(S,opt.petT);s+=p.hp<p.max*.5?2.2:.2}
  return s;
}
/* ---------- smart AI (hard): sees only public info ---------- */
const NOISE={easy:6,medium:1.4,hard:.25};const autoLv=()=>(META&&META.auto)||3;const aiNoise=a=>a==='auto'?Math.max(.25,4-autoLv()*.4):NOISE[a||'medium'];const aiHard=S=>S.ai==='hard'||S.ai==='auto'&&autoLv()>=5;let HK={max:1,thr:3.5,smart:1};

function threatOf(p){return PETS.find(q=>q.n===p.n)?.cards.reduce((a,k)=>a+(T[k].dmg||0)+(T[k].trap?T[k].trap.dmg:0),0)||6*K}
function occMap(O,fast){
  // where each enemy pet may stand when our card lands; slow cards (after steps) spread over its legal moves
  const m=new Map();
  for(const q of alive(O)){const l=[[q.r,q.c,1]];
    if(!fast&&!noMove(q)&&!q.sz){const ds=dirsFor(q).filter(d=>inb(q.r+d[0],q.c+d[1])&&!petAt(O,q.r+d[0],q.c+d[1]));
      if(ds.length){const pm=O.hand.length?.3:.1;l[0][2]=1-pm;for(const d of ds)l.push([q.r+d[0],q.c+d[1],pm/ds.length])}}
    m.set(q,l)}
  return m;
}
function dangerAt(S,O,r,c){
  let d=0;for(const q of alive(O))if(q.c===c)d+=1.2;
  if(r===0)d+=1;else if(r===ROWS-1)d-=.4;
  return d;
}
function dmgBase(S,O,caster,t,p,ch){
  if(!t.dmg)return 0;
  const b=sm(caster,t.dmg+(ch||0))*(caster&&caster.leg&&caster.cls==='fighter'&&!caster.legHit?1+LEGV.hit:1)+kl(caster)*((hasAura(S,caster,'fox')&&(!AURAV.foxST||t.area==='cell'||t.area==='melee')?1:0)
    +(caster&&caster.fam==='beast'&&caster.hp<=caster.max/2?1:0)+(caster&&caster.fam==='dragon'&&p.hp<=p.max/2?1:0))
    +(t.exec&&p.hp<=p.max/2?sm(caster,t.exec):0)+(G&&G.run?talDmg(S,caster,t,p):0);
  return Math.max(0,Math.round(b))}
function dmgFinal(O,t,p,b){
  if(!b)return 0;if(sv(p,'mark'))b+=kl(p,2);const wide=!['cell','melee'].includes(t.area);
  if(wide&&nbrs(O,p).length>=2)b=Math.max(0,b-kl(p));
  return b}
function cardDmg(S,O,caster,t,p,ch){
  if(!t.dmg||p.ghost)return 0;let b=dmgFinal(O,t,p,dmgBase(S,O,caster,t,p,ch));if(p.fam==='magic')b=Math.min(b,kl(p,3));return b}
function hardScore(S,O,card,opt,ctx){
  const t=T[card.t],caster=card.pet?pet(S,card.pet):null;let s=0;
  const remain=q=>q.hp+q.shield-(ctx.dmg.get(q)||0);
  const valHit=(q,dmg,cov)=>{if(sv(q,'evade')||q.ghost)return 0;if(t.dmg)dmg=cardDmg(S,O,caster,t,q,card.ch);const rem=remain(q);if(rem<=0)return 0;const eff=Math.min(dmg,rem);let v=eff/K*cov*(t.drain?1.3:1);if(dmg>=rem)v+=cov*(q.tok?1:(5+threatOf(q)/K*.25)+(q.boss?3:0));if(q.tok)v*=.4;return v};
  if(t.trap){
    const[r,c]=opt.cell,p=petAt(O,r,c);
    if(O.traps.some(x=>x.r===r&&x.c===c))return -1;
    if(p)return valHit(p,t.trap.dmg,1)+(t.trap.freeze?1.5:0);
    let v=0;for(const[q,l]of occMap(O,false))for(const[rr,cc,pr]of l)if(rr===r&&cc===c&&!(rr===q.r&&cc===q.c))v+=pr*Math.min(t.trap.dmg,q.hp)/K*1.6;
    return v-.5;
  }
  if(OFF.has(t.area)){
    const fast=ini({kind:'card',card,S})<20,occ=occMap(O,fast);
    const dm=t.dmg||0;
    if(t.area==='enemies'){for(const[r,c]of offCells(t.area,null,caster,O)){const q=petAt(O,r,c);if(q)s+=(t.dmg?valHit(q,dm,fast?1:.8):0)+stVal(t,q)*(fast?1:.85)}}
    else{const cells=new Set(offCells(t.area,opt.cell,caster,O).map(([r,c])=>r+'-'+c));
      for(const[q,l]of occ){let cov=0;for(const[r,c,pr]of l)if(cells.has(r+'-'+c))cov+=pr;if(cov>0){s+=(t.dmg?valHit(q,dm,cov):0)+stVal(t,q)*cov;if(t.freeze&&!ccBlock(q))s+=cov*1.5;if(t.push)s+=cov*.4}}}
    if(s<.3)return -2;
    return s;
  }
  if(t.cleanse||t.immune)s+=allyFxVal(t,t.area==='ally'?[pet(S,opt.petT)]:t.area==='self'?[caster]:alive(S))*1.1;
  if(t.heal){const l=t.area==='ally'?[pet(S,opt.petT)]:t.area==='self'?[caster]:alive(S);for(const p of l){const miss=p.ghost?0:p.max-p.hp;s+=Math.min(t.heal,miss)/K*(p.hp<p.max*.5?1.3:.7)}}
  if(t.shield){const l=t.area==='self'?[caster]:alive(S);for(const p of l){const exp=Math.max(0,1.5+dangerAt(S,O,p.r,p.c))*1.2*K;s+=Math.min(t.shield,Math.max(0,exp-p.shield),SHIELD_CAP-p.shield)/K*.8}}
  if(t.draw)s+=1;
  if(t.area==='summon')s+=alive(S).filter(p=>p.tok).length<2?(t.sum?2.2:3.5):-5;
  if(t.evade){const l=t.area==='self'?[caster]:alive(S);for(const p of l)if(!sv(p,'evade'))s+=Math.max(0,.6+dangerAt(S,O,p.r,p.c)*.4)}
  if(t.hpcost)s-=t.hpcost/K*.7;if(t.drain)s+=.8;if(t.chain)s+=t.chain/K*.7;
  if(STEP.has(t.area)){
    const p=pet(S,opt.petT),[pr,pc]=projPos(S,p.id),nr=pr+opt.dir[0],nc=pc+opt.dir[1];
    const nb=(r,c)=>alive(S).filter(q=>q!==p&&Math.abs(q.r-r)+Math.abs(q.c-c)===1).length;
    const low=p.hp<p.max*.5?1.6:1;
    s+=(dangerAt(S,O,pr,pc)-dangerAt(S,O,nr,nc))*low+(nb(nr,nc)-nb(pr,pc))*.7;
    if(O.traps.some(x=>x.r===nr&&x.c===nc))s-=0;
    s-=.6;
  }
  return s;
}
function botPlan(S,O){
  S.plan=[];
  botCards(S,O);
  if(S.boss)return;
  const ai=S.ai||'medium';
  const free=S.hand.filter(c=>!S.plan.some(e=>e.card===c));
  if(ai==='easy'||ai==='auto'&&autoLv()<=1){for(const c of free)if(Math.random()<.5)S.plan.push({kind:'burn',card:c,...burnVal(S,c)});return}
  free.sort((a,b)=>cardValue(S,O,b)-cardValue(S,O,a));
  // keep the best leftover card (and a second for hard if it is a strong card), burn the rest for next turn's elements
  let keep;
  if(ai==='hard'||ai==='auto'&&autoLv()>=7){
    const after=avail(S);keep=[];
    const cand=free.map(c=>({c,v:cardValue(S,O,c)+(T[c.t].grow&&(c.ch||0)<4?1.5:0)})).sort((a,b)=>b.v-a.v);
    for(const {c,v} of cand){if(keep.length>=HK.max||v<HK.thr)break;
      const nx={...after};for(const o of free)if(o!==c&&!keep.includes(o)){const b=burnVal(S,o);nx[b.el==='r'?leastOf(nx,needEls(S)):b.el]+=b.n}
      const els=needEls(S);if(els.length)nx[els[0]]+=1;
      if(pay(nx,costOf(S,c)))keep.push(c)}
  }else keep=free.slice(0,1);
  for(const c of free)if(!keep.includes(c))S.plan.push({kind:'burn',card:c,...burnVal(S,c)});
}
function cardValue(S,O,card){let m=0;for(const opt of botOptions(S,O,card))m=Math.max(m,botScore(S,O,card,opt));return m-sumv(T[card.t].cost)*.3}
function botCards(S,O){
  S.plan=S.plan.filter(e=>e.kind!=='card');
  const hard=aiHard(S)&&!S.boss,ctx={dmg:new Map()};
  for(let k=0;k<maxPlay(S);k++){
    let best=null;
    for(const card of S.hand){
      if(S.plan.some(e=>e.card===card))continue;
      if(whyNot(S,card))continue;
      const paid=payCard(S,card);
      for(const opt of botOptions(S,O,card)){const sc=(hard?hardScore(S,O,card,opt,ctx):botScore(S,O,card,opt))+Math.random()*aiNoise(S.ai)-(paid&&paid.hp?paid.hp/K*.8:0);if(!best||sc>best.sc)best={card,opt,paid,sc}}
    }
    if(!best||best.sc<(hard?.6:1))break;
    S.plan.push({kind:'card',card:best.card,paid:best.paid,...best.opt});
    if(hard){const t=T[best.card.t];if(t.dmg&&OFF.has(t.area)){const cs=t.area==='enemies'?offCells(t.area,null,pet(S,best.card.pet),O):offCells(t.area,best.opt.cell,null,O);for(const[r,c]of cs){const q=petAt(O,r,c);if(q)ctx.dmg.set(q,(ctx.dmg.get(q)||0)+t.dmg*.85)}}}
  }
}

