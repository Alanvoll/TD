/* ---------- resolution ---------- */
function L0(S,html){G.log.push(`<span class="${S.bot?'op':'me'}">${S.bot?'Соперник':'Ты'}:</span> ${html}`)}
function L(S,html){L0(S,html);flushDeaths()}
// a death is written after the line of the blow that caused it
function flushDeaths(){const q=G.dq;if(!q||!q.length)return;G.dq=[];for(const[S,h]of q)L0(S,h)}
const isMoveAct=x=>x.card&&STEP.has(T[x.card.t].area);
// order of a planned turn: initiative, then ▼ before ▲, then steps before other cards, then the side that moves first this turn, then plan order
function sortActs(acts){const pf=G.turn%2===1;for(const x of acts)x.sp=ini(x);
  return acts.sort((x,y)=>x.sp-y.sp||(x.kind==='burn'?0:1)-(y.kind==='burn'?0:1)||(isMoveAct(x)?0:1)-(isMoveAct(y)?0:1)||((x.S===G.P)===pf?0:1)-((y.S===G.P)===pf?0:1))}
function planQueue(S){return sortActs(S.plan.map(e=>({...e,S,src:e})))}
function planNo(S){const m=new Map();let n=0;for(const x of planQueue(S))if(x.kind==='card')m.set(x.src,++n);return m}
// effective initiative of a planned half: the card's ▲ or ▼ number, moved by the creature's effects
function ini(x){const c=x.card.pet?pet(x.S,x.card.pet):x.card.t==='step'&&x.petT?pet(x.S,x.petT):null;
  const fast=(G.run?talSpd(x):0)+(c&&c.sp||0)+(hasAura(x.S,c,'bat')?AURAV.bat:0)-(sv(c,'slow')>0?2:0)+(c&&c.leg&&c.cls==='sage'?LEGV.sage:0);return Math.max(1,Math.min(100,(x.kind==='burn'?cardIniDn(x.card.t):cardIni(x.card.t))-fast*INI_STEP))}
const fxl=document.createElement('div');fxl.id='fxl';document.body.appendChild(fxl);
const ELC={f:'#FF8A4C',w:'#5BB8FF',e:'#C9A15B',a:'#9EE6D0',l:'#FFF2B8',d:'#B08CFF',n:'#8CE07A',z:'#FFE04A'};
const sideKey=S=>S===G.P?'p':'b';
function cellC(sk,r,c){const el=app.querySelector(`[data-cell="${sk},${r},${c}"]`);if(!el)return null;const b=el.getBoundingClientRect();return{x:b.left+b.width/2,y:b.top+b.height/2}}
function fxAdd(cls,x,y,html){const d=document.createElement('div');d.className=cls;d.style.left=x+'px';d.style.top=y+'px';if(html)d.innerHTML=html;fxl.appendChild(d);return d}
function burst(x,y,col,n){for(let i=0;i<n;i++){const d=fxAdd('fx-pt',x,y);d.style.background=col;const a=Math.random()*6.28,r=18+Math.random()*26;d.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r}px) scale(.3)`,opacity:0}],{duration:450+Math.random()*200,easing:'ease-out'}).onfinish=()=>d.remove()}}
function banner(S,ic,name){if(SIMU)return;fxl.querySelectorAll('.ban').forEach(b=>b.remove());const d=fxAdd('ban '+(S===G.P?'me':'op'),0,0,`<span>${ic}</span><span>${name}</span>`);d.style.left='';d.style.top='';d.animate([{opacity:0,transform:'translate(-50%,-30%) scale(.9)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.15},{opacity:1,offset:.8},{opacity:0}],{duration:900,easing:'ease-out'}).onfinish=()=>d.remove()}
async function shoot(src,O,cells){
  const a=cellC(sideKey(src.S),src.p.r,src.p.c);if(!a)return;
  const av=app.querySelector(`[data-cell="${sideKey(src.S)},${src.p.r},${src.p.c}"] .av`);
  if(av)av.animate([{transform:'scale(1)'},{transform:`translateY(${src.S===G.P?-8:8}px) scale(1.15)`},{transform:'scale(1)'}],{duration:260});
  const tg=cells.map(([r,c])=>cellC(sideKey(O),r,c)).filter(Boolean);if(!tg.length)return;
  const col=ELC[src.el]||'#fff';
  for(const b of tg){const d=fxAdd('fx-pj',a.x,a.y);d.style.color=col;d.animate([{transform:'translate(0,0) scale(.6)'},{transform:`translate(${b.x-a.x}px,${b.y-a.y}px) scale(1.1)`}],{duration:280,easing:'cubic-bezier(.4,0,.8,.6)'}).onfinish=()=>{d.remove();burst(b.x,b.y,col,5)}}
  await sleep(280);
}
function popFx(){if(SIMU)return;
  for(const k in ui.fx){const f=ui.fx[k],sk=k[0],[r,c]=k.slice(1).split('-').map(Number),p=cellC(sk,r,c);if(!p)continue;
    const col=f.cls==='bad'?'#FF7A6A':f.cls==='good'?'#8CF09A':'#9CCBFF';
    const d=fxAdd('fx-num',p.x,p.y-6,f.txt);d.style.color=col;d.animate([{transform:'translate(-50%,-30%) scale(.6)',opacity:0},{transform:'translate(-50%,-90%) scale(1.15)',opacity:1,offset:.25},{transform:'translate(-50%,-160%) scale(1)',opacity:0}],{duration:900,easing:'ease-out'}).onfinish=()=>d.remove();
    if(f.cls==='good')burst(p.x,p.y,'#8CF09A',4);if(f.cls==='info')burst(p.x,p.y,'#9CCBFF',4)}
  for(const g of ui.deaths||[]){const p=cellC(g.sk,g.r,g.c);if(!p)continue;const d=fxAdd('fx-gh',p.x,p.y,g.ic);d.animate([{opacity:1,transform:'translate(-50%,-50%) scale(1)'},{opacity:0,transform:'translate(-50%,-150%) scale(1.4) rotate(12deg)'}],{duration:900,easing:'ease-out'}).onfinish=()=>d.remove();burst(p.x,p.y,'#C8CDD6',8)}
  ui.deaths=[];
  for(const o of ui.cardOut||[]){const p=cellC(o.sk,o.r,o.c);if(!p)continue;const tg=o.sk==='p'?app.querySelector('[data-act="pile-deck"]'):app.querySelector('.side-bar .side-name');const b=tg&&tg.getBoundingClientRect();const tx=b?b.left+b.width/2:p.x,ty=b?b.top+b.height/2:p.y-60;
    const d=fxAdd('fx-out',p.x,p.y,'👣 Шаг −1');d.animate([{opacity:0,transform:'translate(-50%,-50%) scale(.6)'},{opacity:1,transform:'translate(-50%,-90%) scale(1.1)',offset:.2},{opacity:1,left:p.x+'px',top:(p.y-20)+'px',offset:.45},{opacity:0,left:tx+'px',top:ty+'px',transform:'translate(-50%,-50%) scale(.5)'}],{duration:1500,easing:'ease-in-out',fill:'forwards'}).onfinish=()=>d.remove()}
  ui.cardOut=[];
}
async function fxStep(S,cells,cls,apply,src){
  ui.flash={side:S===G.P?'p':'b',keys:new Set(cells.map(([r,c])=>r+'-'+c)),cls};ui.fx={};
  render();
  if(src&&cls==='hit')await shoot(src,S,cells.length?cells:[]);else await sleep(320);
  if(apply)apply();
  render();popFx();await sleep(560);
  ui.flash=null;ui.fx={};
}
function setFx(S,p,txt,cls){if(SIMU)return;ui.fx[(S===G.P?'p':'b')+p.r+'-'+p.c]={txt,cls}}
function hitMap(O,cells){const m=new Map();for(const[r,c]of cells){const p=petAt(O,r,c);if(!p)continue;const w=!!(p.weak&&p.weak[0]===r&&p.weak[1]===c);m.set(p,m.get(p)||w)}return m}
function hit(S,p,d){
  if(p.ghost){setFx(S,p,'👻','info');return 0}
  if(p.fam==='magic')d=Math.min(d,kl(p,3));
  if(G.run)d=talDef(S,d);
  const ab=Math.min(p.shield,d);p.shield-=ab;const rest=d-ab;if(rest>0)bstHit(S,p,Math.min(rest,p.hp));if(ab)bstAbs(S,p,ab);if(S===G.B&&rest>0)(G.dmgOut=(G.dmgOut||0)+Math.min(rest,p.hp));p.hp=Math.max(0,p.hp-rest);if(rest>0)p.hurtT=G.turn;
  setFx(S,p,rest?'-'+rest:'щит','bad');
  if(p.hp<=0)die(S,p);
  return rest;
}
function die(S,p,final){
  if(!final&&G.run&&S===G.P&&!p.tok&&!G.phx&&hasT('phoenix')){G.phx=1;p.hp=Math.round(p.max*.3);p.st={};p.frozen=0;p.ghost=0;setFx(S,p,'🪶 феникс','good');L(S,`<b>${p.n}</b> возрождается (Перо феникса).`);return}
  if(!final&&p.fam==='mech'&&!p.revived){p.revived=true;p.down=true;p.ghost=1;p.hp=0;p.st={};p.frozen=0;p.shield=0;setFx(S,p,'⚙️ отключён','info');L(S,`<b>${p.n}</b> отключается: его карты в этом ходу не сработают, со следующего хода он вернётся с 10% здоровья (механизмы).`);return}
  if(!final&&p.fam==='undead'&&!p.ghostUsed){p.ghostUsed=true;p.ghost=2;p.hp=0;p.st={};p.frozen=0;p.shield=0;setFx(S,p,'👻 ещё ход','info');L(S,`<b>${p.n}</b> погиб, но остаётся ещё на ход (нежить).`);return}
  p.ghost=0;if(S===G.B&&!p.tok)G.kills=(G.kills||0)+1;
  if(S===G.P&&!p.tok&&G.B&&G.B.bk)bossRaise();
  if(!SIMU)(ui.deaths=ui.deaths||[]).push({sk:sideKey(S),r:p.r,c:p.c,ic:petIc(p,1)});
  if(G.fact==='cult'&&S===G.B)G.ritual=Math.max(0,(G.ritual||0)-2);
  p.alive=false;
  const f=c=>c.pet!==p.id;
  S.deck=S.deck.filter(f);S.hand=S.hand.filter(f);S.discard=S.discard.filter(f);
  let stepGone=false;if(!p.tok){const all=[...S.deck,...S.hand,...S.discard].filter(c=>c.t==='step').length;if(all>1){let i=S.deck.findIndex(c=>c.t==='step');if(i>=0)S.deck.splice(i,1);else{i=S.discard.findIndex(c=>c.t==='step');if(i>=0)S.discard.splice(i,1);else S.stepDebt=(S.stepDebt||0)+1}stepGone=true}}
  if(stepGone&&!SIMU)(ui.cardOut=ui.cardOut||[]).push({sk:sideKey(S),r:p.r,c:p.c});
  (G.dq=G.dq||[]).push([S,`<b>${p.n}</b> пал, его карты уходят из колоды${stepGone?', и с ним 1 Шаг':''}.`]);
}
async function checkTraps(S){
  for(const tr of [...S.traps]){
    const p=petAt(S,tr.r,tr.c);if(!p)continue;
    S.traps=S.traps.filter(x=>x!==tr);
    await fxStep(S,[[tr.r,tr.c]],'hit',()=>{BST_A=null;const d=hit(S,p,tr.dmg);if(p.alive&&tr.freeze&&!p.sz&&!ccBlock(p)){p.frozen=2;setFx(S,p,(d?'-'+d+' ':'')+'лёд','bad')}});
    G.log.push(`<b>Ловушка</b> ${tr.ic} сработала: ${p.n}.`);
  }
}
async function doMove(S,p,dir,label){
  const nr=p.r+dir[0],nc=p.c+dir[1];
  if(!inb(nr,nc)){L(S,`${p.n} упёрся в край.`);return}
  const from=[p.r,p.c],o=petAt(S,nr,nc);
  if(o){o.r=p.r;o.c=p.c}
  p.r=nr;p.c=nc;
  L(S,`${label?'«'+label+'»: ':''}${p.n} ${o?'меняется местами с '+o.n:'сдвигается'}.`);
  await fxStep(S,[from,[nr,nc]],'move');
  await checkTraps(S);
}
// 0.35: a card half with a step: the step goes before or after the effect, as the card says; the player may skip it (sdir null)
async function exec(x){const st=x.card&&(x.kind==='card'||x.kind==='burn')?halfStp(x):null;
  if(!st||!x.sdir)await execMain(x);
  else{const S=x.S,c=x.card.pet?pet(S,x.card.pet):null;
    const go=async()=>{if(!c||!c.alive||c.down)return;if(x.kind==='card'&&noAct(c))return;
      if(noMove(c)){L(S,`${c.n}: шаг сорван (не может двигаться).`);return}
      await doMove(S,c,x.sdir,'👣 '+T[x.card.t].n)};
    if(st.f){await go();await execMain(x)}else{await execMain(x);await go()}}
  // 0.39 classes: Целитель heals after his ▼, Ловкач may step aside after his ▲ hit
  {const S=x.S,c=x.card&&x.card.pet?pet(S,x.card.pet):null;
    if(x.kind==='burn')careHeal(S,c);
    if(x.kind==='card'&&x.sdir2&&x.hitAny&&c&&c.alive&&!c.down&&!c.sz&&!noMove(c)&&!noAct(c))await doMove(S,c,x.sdir2,'💨 Отскок')}}
async function execMain(x){
  const S=x.S,O=other(S);BST_A=x.card&&x.card.pet?{S,id:x.card.pet}:null;
  if(x.kind==='burn'&&HV()&&!dnKey(x.card.t)){L(S,`▼ «${T[x.card.t].n}»: нет действия.`);return}
  if(x.kind==='burn'){
    const t=T[x.card.t],sb=t.sub;if(!sb)return;
    const c=x.card.pet?pet(S,x.card.pet):null;
    if(!c||!c.alive||c.down){L(S,`▼ «${t.n}»: эффект отменён.`);return}
    if(sb.evade){await fxStep(S,[[c.r,c.c]],'good',()=>{applySt(c,'evade',sb.evade);setFx(S,c,'💨 уклонение','info')});L(S,`▼ «${t.n}»: ${sb.short}.`);return}
    if(sb.markCol){const cl=offCells('melee',null,c,O)[0],q=cl&&petAt(O,cl[0],cl[1]);await fxStep(O,cl?[cl]:[],'hit',()=>{if(q&&applySt(q,'mark',sb.markCol))setFx(O,q,'🎯','bad')},{S,p:c});L(S,`▼ «${t.n}»: ${q?'метка на '+q.n:'мимо'}.`);return}
    if(sb.colDmg||sb.frontDmg){
      const cells=sb.colDmg?offCells('melee',null,c,O):alive(O).filter(p=>p.r===0).map(p=>[p.r,p.c]);
      const names=[];
      banner(S,petIc(c,1),'▼ '+t.n);await fxStep(O,cells,'hit',()=>{for(const[p,crit]of hitMap(O,cells)){const d=hit(O,p,(sm(c,sb.colDmg||sb.frontDmg)+napB(c))*(crit?2:1));names.push(p.n+(crit?' ✶':'')+(d?' −'+d:' (щит)'))}},{S,p:c});
      L(S,`▼ «${t.n}»: ${names.length?names.join(', '):'мимо'}.`);return;
    }
    const l=(sb.allShield||sb.allHeal)?alive(S):[c];
    await fxStep(S,l.map(p=>[p.r,p.c]),'good',()=>{for(const p of l){
      if(sb.shield||sb.allShield){const v=sm(c,sb.shield||sb.allShield);addShield(p,v,c,S);setFx(S,p,'щит '+v,'info')}
      if(sb.heal||sb.allHeal){const h=Math.min(healAmt(hlv(c,sb.heal||sb.allHeal)),p.max-p.hp);p.hp+=h;bstHeal(S,p,h,0,c);setFx(S,p,'+'+h,'good')}
    }
    if(sb.draw){S.lim.push({n:sb.draw,t:sb.dur||1});setFx(S,c,'рука +1','info')}});
    L(S,`▼ «${t.n}»: ${sb.short}.`);return;
  }
  const t=T[x.card.t],caster=x.card.pet?pet(S,x.card.pet):null;
  if(caster&&!caster.alive){L(S,`«${t.n}» отменена: ${caster.n} пал.`);return}
  if(caster&&caster.down){L(S,`«${t.n}» отменена: ${caster.n} отключён.`);return}
  if(caster&&noAct(caster)&&!STEP.has(t.area)){L(S,`«${t.n}» отменена: ${caster.n} ${caster.frozen>0?'заморожен':'оглушён'}.`);banner(S,caster.frozen>0?'❄️':'💫',`«${t.n}» сорвана`);setFx(S,caster,(caster.frozen>0?'❄️':'💫')+' сорвано','bad');render();await sleep(650);return}
  for(const k of ELS)S.gen[k]+=(t.gen&&t.gen[k])||0;
  if(caster&&caster.cls==='fighter'&&t.dmg)caster.napT=G.turn;
  banner(S,caster?petIc(caster,1):'👣',t.n);
  if(t.hpcost&&caster){caster.hp=Math.max(1,caster.hp-t.hpcost);L(S,`${caster.n} платит ${t.hpcost} здоровья.`)}
  if(x.paid&&x.paid.hp&&caster){caster.hp=Math.max(1,caster.hp-x.paid.hp);setFx(S,caster,'❤−'+x.paid.hp,'bad');L(S,`${caster.n} платит ${x.paid.hp} здоровья вместо стихий (демоны).`)}
  if(STEP.has(t.area)){
    const p=pet(S,x.petT);
    if(!p.alive||noMove(p)){L(S,`«${t.n}» отменена.`);return}
    return doMove(S,p,x.dir,t.n);
  }
  if(t.area==='self'){
    await fxStep(S,[[caster.r,caster.c]],'good',()=>{
      if(t.shield){const v=sm(caster,t.shield)+(G.run?talSh(S):0);addShield(caster,v,caster,S);setFx(S,caster,'щит '+v,'info')}
      if(t.heal){const h=Math.min(healAmt(hlv(caster,t.heal)+(G.run?talH(S):0)),caster.max-caster.hp);caster.hp+=h;bstHeal(S,caster,h,0,caster);setFx(S,caster,'+'+h,'good')}
      if(t.cleanse&&cleanse(caster))setFx(S,caster,'очищен','good');
      if(t.immune){applySt(caster,'immune',t.immune);setFx(S,caster,'✨ иммунитет','info')}
      if(t.evade){applySt(caster,'evade',t.evade);if(!t.shield&&!t.heal)setFx(S,caster,'💨 уклонение','info')}
      if(t.draw){S.lim.push({n:t.draw,t:t.dur||1});setFx(S,caster,'рука +1','info')}
    });
    L(S,`«${t.n}» (${caster.n}).`);return;
  }
  if(t.area==='ally'||t.area==='allies'||OWN.has(t.area)){
    const l=ownTargets(S,t,x,caster);
    await fxStep(S,l.map(p=>[p.r,p.c]),'good',()=>{for(const p of l){
      if(t.heal){const h=Math.min(healAmt(hlv(caster,t.heal)+(G.run?talH(S):0)),p.max-p.hp);p.hp+=h;bstHeal(S,p,h,0,caster);setFx(S,p,'+'+h,'good')}
      if(t.shield){const v=sm(caster,t.shield)+(G.run?talSh(S):0);addShield(p,v,caster,S);setFx(S,p,'щит '+v,'info')}
      if(t.cleanse&&cleanse(p))setFx(S,p,'очищен','good');
      if(t.immune){applySt(p,'immune',t.immune);if(!t.heal&&!t.shield)setFx(S,p,'✨','info')}
      if(t.evade){applySt(p,'evade',t.evade);if(!t.heal&&!t.shield)setFx(S,p,'💨','info')}
    }});
    L(S,`«${t.n}»${(t.area==='ally'||OWN.has(t.area))&&l.length?' на '+l.map(p=>p.n).join(', '):OWN.has(t.area)?': в клетках никого нет':''}.`);return;
  }
  if(t.area==='summon'){
    const free=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(!petAt(S,r,c))free.push([r,c]);
    if(alive(S).filter(p=>p.tok).length>=2||!free.length){L(S,`«${t.n}»: места нет.`);return}
    const near=caster?free.filter(([r,c])=>Math.abs(r-caster.r)+Math.abs(c-caster.c)===1):[];
    const[r,c]=(near.length?near:free)[Math.floor(Math.random()*(near.length||free.length))];
    const sm=t.sum||{n:'Осколок',ic:'🪨',hp:5*K,mv:'none',au:'shard'};
    const sh={id:(S.bot?'b':'p')+'t'+(S.pets.length),n:sm.n,ic:sm.ic,au:sm.au||'tok',els:[],max:sm.hp,hp:sm.hp,base:sm.hp,mv:sm.mv,r,c,shield:0,frozen:0,alive:true,tok:true,cards:[]};S.pets.push(sh);
    await fxStep(S,[[r,c]],'good',()=>setFx(S,sh,'призван','info'));L(S,`«${t.n}»: появляется ${sm.n}.`);return;
  }
  if(t.trap){
    const[r,c]=x.cell;
    O.traps=O.traps.filter(q=>!(q.r===r&&q.c===c));
    O.traps.push({r,c,turns:2,...t.trap,dmg:sm(caster,t.trap.dmg)});
    await fxStep(O,[[r,c]],'move');
    L(S,`«${t.n}» в клетку ${r+1}-${c+1}.`);
    await checkTraps(O);return;
  }
  const cells=offCells(t.area,x.cell,caster,O);
  const names=[];let pushed=false,drained=0;const hitL=[];
  await fxStep(O,cells.length?cells:[],'hit',()=>{
    for(const[p0,crit]of hitMap(O,cells)){const p=coverOf(O,p0,t);if(p!==p0)names.push('🛡 '+p.n+' закрывает '+p0.n);
      if(t.dmg&&sv(p,'evade')){delete p.st.evade;setFx(O,p,'💨 мимо','info');names.push(p.n+' уклонился');continue}
      if(caster&&caster.cls==='sage'&&HV()&&p.alive&&p.slowT!==G.turn){p.slowT=G.turn;G.rs=1;names.push('🔮 '+p.n+' позже на '+SAGE_SLOW*INI_STEP)}
      if(t.strip){p.shield=0;if(p.st){delete p.st.immune;delete p.st.evade}}
      let base=dmgBase(S,O,caster,t,p,x.ch);const hadMark=base&&sv(p,'mark');base=dmgFinal(O,t,p,base);if(hadMark)delete p.st.mark;
      const d=base?hit(O,p,base*(crit?2:1)):0;if(base){hitL.push(p);x.hitAny=1;if(caster&&caster.leg)caster.legHit=1}if(d&&G.run&&caster&&caster.alive){if(O===G.P&&hasT('collar'))hit(S,caster,SC);if(S===G.P&&hasT('vamp'))caster.hp=Math.min(caster.max,caster.hp+SC)}
      if(t.drain)drained+=d;
      const ext=(k)=>(caster&&caster.fam==='insect'?1:0)+(G.run?talExt(S,k):0);
      const sts=[];for(const k of NEG)if(cst(t,k)&&applySt(p,k,cst(t,k)+ext(k)))sts.push(STI[k]);
      if(sts.length&&p.alive){setFx(O,p,(d?'-'+d+' ':'')+sts.join(''),'bad');names.push(p.n+' '+sts.join(''))}
      if(!base){if(!sts.length&&!t.strip)names.push(p.n+': не действует');continue}if(caster&&caster.alive&&p.fam==='aberr'&&!p.ghost){const ba=BST_A;BST_A={S:other(S),id:p.id};const r2=hit(S,caster,kl(p));BST_A=ba;names.push('отдача по '+caster.n+(r2?' −'+r2:''))}names.push(p.n+(crit?' ✶':'')+(d?' −'+d:' (щит)'));if(crit)setFx(O,p,'✶ −'+d,'bad');
      if(p.alive&&t.freeze&&!p.sz&&!ccBlock(p)){p.frozen=2;setFx(O,p,(d?'-'+d+' ':'')+'лёд','bad')}
      if(p.alive&&t.push&&!p.sz&&inb(p.r+1,p.c)&&!petAt(O,p.r+1,p.c)){p.r+=1;pushed=true}
      if(p.alive&&t.pull&&!p.sz&&inb(p.r-1,p.c)&&!petAt(O,p.r-1,p.c)){p.r-=1;pushed=true}
    }
    const ch=t.chain||0;
    if(ch&&hitL.length){const f=hitL[0];let l=alive(O).filter(q=>!hitL.includes(q));if(!t.chain)l=l.filter(q=>Math.abs(q.r-f.r)+Math.abs(q.c-f.c)===1);const q=l[Math.floor(Math.random()*l.length)];if(q){const d=hit(O,q,sm(caster,ch));names.push('⚡ '+q.n+(d?' −'+d:' (щит)'))}}
    if(drained&&caster&&caster.alive&&!caster.ghost){const h=Math.min(drained,caster.max-caster.hp);if(h){caster.hp+=h;bstHeal(S,caster,h,0,caster);setFx(S,caster,'+'+h,'good')}}
  },caster&&{S,p:caster,el:t.el});
  L(S,`«${t.n}»: ${names.length?names.join(', '):'мимо'}.`);
  if(pushed)await checkTraps(O);
}
async function resolve(){
  if(ui.busy||G.over)return;
  ui.busy=true;ui.skip=false;ui.sel=null;ui.mover=null;G.log=[`<b>Ход ${G.turn}</b>`];
  const acts=[],poor=[];
  for(const S of [G.P,G.B]){
    S.gen=z0();
    for(const p of alive(S))if(hasAura(S,p,'hog')&&!p.ghost)p.shield=Math.max(p.shield,kl(p,AURAV.hog));
    if(S.boss){const b=S.pets[0],n=alive(S).filter(p=>p.au==='shard').length;if(b.alive&&n)addShield(b,n*K)}
    for(const e of S.plan){
      if(e.card){e.ch=e.card.ch||0;e.card.ch=0}
      const hv=HV();if(e.kind==='burn'&&e.el!=='r'&&!hv)S.pool[e.el]+=e.n;const a={...e,S};acts.push(a);if(e.el==='r'&&!hv)poor.push(a);
      if(e.paid)for(const k of ELS)S.pool[k]-=e.paid[k];
      if(e.card){S.hand=S.hand.filter(c=>c!==e.card);if(e.card.t==='step'&&S.stepDebt>0)S.stepDebt--;else S.discard.push(e.card)}
    }
    S.plan=[];
    for(const a of poor.splice(0)){a.el=stepEl(S);S.pool[a.el]+=a.n}
    // 0.34: cards not played this turn go to the discard and give their elements
    if(HV()&&S.hand.length){const got=z0();let r=0;
      for(const c of S.hand){const b=burnVal(S,c);if(b.el==='r'&&!b.g)r+=b.n;else{addGain(S.pool,b);addGain(got,b)}if(c.t==='step'&&S.stepDebt>0)S.stepDebt--;else S.discard.push(c)}
      for(let i=0;i<r;i++){const e=stepEl(S);S.pool[e]++;got[e]++}
      G.log.push(`${S.bot?'<span class="op">Соперник:</span>':'<span class="me">Ты:</span>'} в сброс ${S.hand.length} ${S.hand.length===1?'карта':S.hand.length<5?'карты':'карт'}, стихии: ${ELS.filter(k=>got[k]).map(k=>'+'+got[k]+' '+ELN[k].toLowerCase()).join(', ')}.`);S.hand=[]}
  }
  if(!SIMU){let u=0,d=0;for(const a of acts)if(a.S===G.P){if(a.kind==='burn')d++;else if(a.kind==='card')u++}if(u)questEv('up',u);if(d)questEv('down',d)}
  sortActs(acts);ui.queue=acts;ui.qi=-1;
  if(!acts.length)G.log.push('Никто ничего не сыграл.');
  render();
  G.rs=0;
  for(let i=0;i<acts.length;i++){if(G.over)break;ui.qi=i;render();await exec(acts[i]);if(G.rs){G.rs=0;sageLater(acts,i)}flushDeaths();checkOver()}
  napTurnEnd();
  ui.qi=acts.length;
  for(const S of [G.P,G.B]){
    for(const k of ELS)S.pool[k]+=S.gen[k];capPool(S.pool);
    for(const p of S.pets){if(p.tough>0)p.tough--;if(p.frozen>0&&--p.frozen<=0)p.tough=TOUGH}
    S.traps=S.traps.filter(x=>--x.turns>0);
  }
  for(const S of [G.P,G.B])for(const p of alive(S))if(hasAura(S,p,'frog')&&p.hp<p.max&&!G.stormAt&&!p.ghost){const h=Math.min(p.max-p.hp,kl(p,AURAV.frog));p.hp+=h;bstHeal(S,p,h,1)}
  for(const S of [G.P,G.B])for(const p of alive(S))if(p.fam==='plant'&&!p.ghost&&p.hp<p.max&&p.hurtT!==G.turn){const h=Math.min(p.max-p.hp,healAmt(kl(p)));p.hp+=h;bstHeal(S,p,h,1)}
  {let any=false;ui.fx={};for(const S of [G.P,G.B])for(const p of alive(S))if(sv(p,'burn')>0&&!p.ghost){any=true;const bd=kl(p);BST_A=p.burnBy||null;bstHit(S,p,Math.min(bd,p.hp));BST_A=null;p.hp=Math.max(0,p.hp-bd);setFx(S,p,'🔥 −'+bd,'bad');L(S,`${p.n} горит: −${bd}.`);if(p.hp<=0)die(S,p)}
   if(any){render();popFx();await sleep(600);ui.fx={}}
   for(const S of [G.P,G.B])for(const p of S.pets)if(p.st)for(const k in p.st){if(--p.st[k]<=0){delete p.st[k];if(k==='stun')p.tough=TOUGH}}}
  {let gone=false;for(const S of [G.P,G.B])for(const p of alive(S))if(p.ghost&&--p.ghost<=0){gone=true;if(p.down){p.down=false;p.hp=Math.max(1,Math.round(p.max*.1));setFx(S,p,'⚙️ снова в строю','good');L(S,`<b>${p.n}</b> снова в строю с ${p.hp} здоровья.`)}else{die(S,p,true);setFx(S,p,'👻','info')}}if(gone){render();popFx();await sleep(400);ui.fx={}}}
  if(G.run||G.B.bk)runEndHook();
  checkOver();
  if(!G.stormAt&&!G.over&&(G.boss?G.turn>=STORM+3+(G.stDelay||0):(G.turn>=STORM+(G.stDelay||0)||alive(G.P).filter(p=>!p.tok).length<=2||alive(G.B).filter(p=>!p.tok).length<=2))){G.stormAt=G.turn;G.log.push('<b>Буря начинается</b>: лечение вдвое слабее.')}
  if(G.stormAt&&!G.over){
    const d=(G.turn-G.stormAt+1)*K;G.log.push(`<b>Буря</b>: все петы теряют ${d} здоровья.`);
    const hitAll=()=>{BST_A=null;for(const S of [G.P,G.B])for(const p of alive(S).filter(q=>!q.ghost)){p.hp=Math.max(0,p.hp-d);setFx(S,p,'-'+d,'bad');if(p.hp<=0)die(S,p)}};
    const hs=S=>alive(S).reduce((t,p)=>t+p.hp,0),hp0=hs(G.P),hb0=hs(G.B);ui.fx={};hitAll();render();popFx();await sleep(900);ui.fx={};
    if(!alive(G.P).length&&!alive(G.B).length&&hp0!==hb0){G.over=hp0>hb0?'win':'lose';G.log.push('Буря добила всех. Побеждает стая, у которой было больше здоровья.')}
    checkOver();
  }
  flushDeaths();ui.busy=false;ui.skip=false;
  checkOver();
  if(!G.over)startTurn();else render();
}
function checkOver(){
  if(G.over)return;
  if(G.boss){const bs=G.B.pets[0];
    if(G.B.bk)bossPhase();
    if(bs.alive&&!G.enraged&&bs.hp<=bs.max/2&&(!G.B.bk||BOSSES[G.B.bk].golem)){G.enraged=true;G.B.maxPlay=3;G.B.deck.push({uid:'BR1',t:'b_rage',pet:bs.id},{uid:'BR2',t:'b_crush',pet:bs.id});G.log.push('<b>Голем в ярости</b>: теперь играет 3 карты за ход, в колоде появились Ярость и Сокрушение.');banner(G.B,'🗿','Голем в ярости!')}
    if(!bs.alive){G.B.pets.forEach(p=>p.alive=false);G.over=alive(G.P).length?'win':'draw';return}}
  const a=alive(G.P).filter(p=>!p.tok).length,b=alive(G.B).filter(p=>!p.tok).length;
  if(!a||!b){G.over=!b&&a?'win':!a&&b?'lose':'draw';for(const S of [G.P,G.B])if(!alive(S).filter(p=>!p.tok).length)S.pets.forEach(p=>p.alive=false)}
}

