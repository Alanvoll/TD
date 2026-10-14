/* ---------- render ---------- */
const EI=(k,sm)=>`<i class="ei ei-${k}${sm?' sm':''}" title="${ELN[k]}"></i>`;
const chips=o=>ELS.filter(k=>o[k]).map(k=>`<span class="chip">${o[k]}${EI(k)}</span>`).join('');
function costHtml(t){let h='';for(const k of ELS)for(let i=0;i<(t.cost[k]||0);i++)h+=`<i class="ei rr ei-${k}" title="${ELN[k]}"></i>`;return h}
// enemy cell key at a big pet's anchor (a big pet is drawn once, at its top-left cell)
const anc=(r,c)=>{const q=petAt(G.B,r,c);return q&&q.sz?q.r+'-'+q.c:r+'-'+c};
// «ближайший в столбце» hits the nearest enemy; the enemies behind it in that column can be hit instead if it falls or moves first
function behindKeys(h){const o=new Set();if(!h)return o;const first=petAt(G.B,h[0],h[1]);for(let r=h[0]+1;r<ROWS;r++){const q=petAt(G.B,r,h[1]);if(q&&q!==first)o.add(q.sz?q.r+'-'+q.c:r+'-'+h[1])}return o}
const pnsHtml=l=>l.map(n=>String(n)[0]==='?'?`<span class="pn mb" title="может попасть, если ближний выбудет">${String(n).slice(1)}</span>`:`<span class="pn">${n}</span>`).join('');
function planMarks(){
  const S=G.P,m={b:{},p:{}},no=planNo(S);
  S.plan.forEach((e,i)=>{
    const n=no.get(e)||i+1;
    if((e.kind==='burn'&&!(HV()&&(e.cell||e.petT)))||(e.card&&STEP.has(T[e.card.t].area))){return}
    const t=e.kind==='burn'?dnT(e.card.t):T[e.card.t],caster=e.card.pet?pet(S,e.card.pet):null;
    if(OFF.has(t.area)){const l=offCells(t.area,e.cell,caster,G.B);for(const[r,c]of l){const k=anc(r,c);(m.b[k]=m.b[k]||[]).push(n)}
      if(t.area==='melee')for(const k of behindKeys(l[0]))(m.b[k]=m.b[k]||[]).push('?'+n)}
    else{const l=t.area==='ally'?[pet(S,e.petT)]:t.area==='self'?[caster]:alive(S);for(const p of l)(m.p[p.r+'-'+p.c]=m.p[p.r+'-'+p.c]||[]).push(n)}
  });
  return m;
}
function ghostMarks(){
  const S=G.P,g={};
  S.plan.forEach((e,i)=>{if(e.dir){const[r,c]=projPos({...S,plan:S.plan.slice(0,i+1)},e.petT);g[r+'-'+c]={n:i+1,ic:pet(S,e.petT).ic}}});
  return g;
}
function gridHtml(S,side){
  const P=G.P,card=ui.sel?P.hand.find(c=>c.uid===ui.sel):null,t=card?selT(card):null;
  const marks=planMarks()[side],ghosts=side==='p'?ghostMarks():{};
  let prev=new Set(),valid=false,dests=new Set();
  let prev2=new Set();
  if(t&&OFF.has(t.area)&&side==='b'){valid=true;if(ui.hover){const l=offCells(t.area,ui.hover,null,G.B);for(const[r,c]of l)prev.add(anc(r,c));if(t.area==='melee')for(const k of behindKeys(l[0]))prev2.add(k)}}
  const moveKind=t&&STEP.has(t.area)?t.area:null;
  let silIc=ui.mover?petIc(pet(P,ui.mover),1):null;
  if(!HV()&&!ui.sel&&!ui.mover&&ui.info&&ui.info.side===side){const ip=pet(S,ui.info.id);if(ip&&ip.alive){silIc=petIc(ip,1);for(const d of dirsFor(ip))if(inb(ip.r+d[0],ip.c+d[1]))dests.add((ip.r+d[0])+'-'+(ip.c+d[1]))}}
  if(side==='p'&&ui.mover&&(moveKind||ui.stepE)){const[pr,pc]=projPos(P,ui.mover);for(const d of dirsFor(pet(P,ui.mover),curStep()))if(inb(pr+d[0],pc+d[1]))dests.add((pr+d[0])+'-'+(pc+d[1]))}
  const rows=[...Array(ROWS).keys()];if(side==='b')rows.reverse();
  let h=`<div class="grid field ${side==='b'?'enemyg':''}" style="grid-template-columns:repeat(${COLS},1fr);--asp:.9">`;
  const drawn=new Set();
  for(const r of rows)for(let c=0;c<COLS;c++){
    let k=r+'-'+c,p=petAt(S,r,c),cls=['cell'],span='';if((r+c)%2)cls.push('dk');
    if(p&&p.sz){if(drawn.has(p))continue;drawn.add(p);cls.push('big');span=` style="grid-row:span ${p.sz};grid-column:span ${p.sz}" data-span="${p.r},${p.c}"`}
    if(valid)cls.push('valid');
    if(prev.has(k))cls.push('prev');else if(prev2.has(k))cls.push('prev2');
    if(marks[k])cls.push(marks[k].some(n=>String(n)[0]!=='?')?'planned':'planned2');
    if(dests.has(k))cls.push('dest');
    if(ui.flash&&ui.flash.side===side&&ui.flash.keys.has(k))cls.push('fl-'+ui.flash.cls);
    if(ui.fx[side+k]&&ui.fx[side+k].cls==='bad')cls.push('shk');
    if(p&&side==='p'&&(ui.mover===p.id||(card&&card.pet===p.id)))cls.push('sel');
    if(p)cls.push('occ');
    let inner='';
    if(p){
      const nb=nbrs(S,p);for(const q of nb){const up=side==='b'?q.r>p.r:q.r<p.r;cls.push(q.r===p.r?(q.c<p.c?'ll':'lr'):(up?'lt':'lb'))}
      if(side==='p'&&!noMove(p))cls.push('drg');
      const bd=petFx(p).map(f=>`<span class="bd ${f.neg?'ng':'ps'}">${f.ic}${f.v}</span>`).join('');
      const avc=[p.down?'down':p.ghost?'ghst':'',p.frozen?'frz':p.shield?'shd':'',p.hp<=p.max*.35?'low':'',sv(p,'stun')?'stn':'',sv(p,'slow')?'slw':'',ui.fx[side+k]&&ui.fx[side+k].cls==='bad'?'hurt':'',ui.fx[side+k]&&ui.fx[side+k].cls==='good'?'glad':''].filter(Boolean).join(' ');
      inner=`<div class="pet" data-pid="${p.id}"><div class="av ${avc}${artK(p)?' art':''}${p.q?' qv q'+p.q:''}" style="animation-delay:-${(p.c*400+p.r*700)%2400}ms"><span class="em${artK(p)?' art':''}" style="animation-delay:-${(p.c*530+p.r*290)%2000}ms">${petIc(p,0,-((p.c*530+p.r*290)%2400)/1000)}</span></div><div class="pname">${p.n}</div><div class="hp"><i style="width:${100*p.hp/p.max}%"></i></div><div class="hpn">${p.ghost?'👻 ещё ход':p.hp+'/'+p.max}</div>${marks[k]?`<div class="ovl">${pnsHtml(marks[k])}</div>`:''}${bd?`<div class="ovr">${bd}</div>`:''}</div>`;
    }
    else if(marks[k])inner+=`<span class="pns">${pnsHtml(marks[k])}</span>`;
    if(ghosts[k]){inner+=`<span class="sil pl">${petIc(ghosts[k],1)}</span><span class="pn" style="color:var(--ally)">${ghosts[k].n}</span>`;cls.push('ghostc')}
    if(dests.has(k)&&silIc)inner+=`<span class="sil">${silIc}</span>`;
    const tr=S.traps.find(x=>x.r===r&&x.c===c);if(tr)inner+=`<span class="trap">${tr.ic}${tr.turns}</span>`;
    const fx=ui.fx[side+k];if(fx)inner+=`<div class="fx ${fx.cls}">${fx.txt}</div>`;
    if(p&&p.sz&&p.weak){const top=side==='b'?p.weak[0]===p.r+1:p.weak[0]===p.r,left=p.weak[1]===p.c;inner+=`<span class="weak" style="left:${left?'25%':'75%'};top:${top?'25%':'75%'}">✶</span>`}
    h+=`<button class="${cls.join(' ')}"${span} data-cell="${side},${p&&p.sz?p.r:r},${p&&p.sz?p.c:c}" aria-label="ряд ${r+1}, столбец ${c+1}">${inner}</button>`;
  }
  return h+'</div>';
}
function moveIcon(mv){const D=MV[mv]?MV[mv].d:[];let h='<span class="shape m5">';for(let r=-2;r<=2;r++)for(let c=-2;c<=2;c++)h+=`<i class="${!r&&!c?'o':D.some(d=>d[0]===r&&d[1]===c)?'g':''}"></i>`;return h+'</span>'}
function shapeIcon(area){return zoneSvg(area,18)}
const ART={cell:'в клетку',hline:'по линии из 3 клеток',row:'по всему ряду',col:'по всему столбцу',cross:'крестом',sq2:'по квадрату 2×2',melee:'ближайшему врагу в выбранном столбце',enemies:'всем врагам'};
const ARW={cell:'Враг в клетке',hline:'Враги на линии из 3 клеток',row:'Враги в ряду',col:'Враги в столбце',cross:'Враги в кресте',sq2:'Враги в квадрате 2×2',melee:'Ближайший враг в столбце',enemies:'Все враги'};
const numH=(v,b)=>v===b?String(v):`<b class="${v>b?'nup':'ndn'}">${v}</b>`;
const shownDmg=(t,c,card)=>sm(c,(t.dmg||0)+(card&&card.ch||0));
function cardTxt(t,c,card){
  if(t.area==='summon'||STEP.has(t.area))return t.txt||'';
  if(t.trap)return`Ловушка в клетку соперника на 2 хода. Когда там окажется враг: ${numH(sm(c,t.trap.dmg),t.trap.dmg)} урона${t.trap.freeze?' и заморозка':''}.`;
  const fx=[];if(t.stun)fx.push('оглушение на '+hz(t.stun));if(t.freeze)fx.push('заморозка');if(t.root)fx.push('сковывание на '+hz(t.root));if(t.slow)fx.push('замедление на '+hz(t.slow));if(t.ign)fx.push('поджог на '+hz(t.ign));if(t.mark)fx.push('метка на '+hz(t.mark));if(t.push)fx.push('толкает на ряд назад');if(t.pull)fx.push('притягивает на ряд вперёд');
  let s='';
  if(OFF.has(t.area)){
    if(t.dmg)s=(t.strip?'Снимает щит, уклонение и иммунитет, потом ':'')+numH(shownDmg(t,c,card),t.dmg)+' урона '+ART[t.area]+(fx.length?', '+fx.join(', '):'')+'.';
    else s=ARW[t.area]+': '+fx.join(', ')+'.';
    if(t.exec)s+=` По раненому (половина здоровья или меньше) ещё +${numH(sm(c,t.exec),t.exec)}.`;
    if(t.drain)s+=' Пет лечится на нанесённый урон.';
    if(t.chain)s+=` Хаос перескакивает на другого врага: ещё ${numH(sm(c,t.chain),t.chain)}.`;
  }else{
    const l=[];if(t.shield)l.push('щит '+numH(sm(c,t.shield),t.shield));if(t.heal)l.push('+'+numH(hlv(c,t.heal),t.heal)+' здоровья');if(t.cleanse)l.push('снимает плохие эффекты');if(t.immune)l.push('иммунитет к плохим эффектам на '+hz(t.immune));if(t.evade)l.push('уклонение на '+hz(t.evade)+': первый удар по нему мимо');if(t.draw)l.push('лимит руки +'+t.draw+(t.dur>1?' на '+hz(t.dur):''));
    s=(t.area==='self'?'Себе: ':t.area==='ally'?'Своему пету: ':'Всем своим: ')+l.join(', ')+'.';
  }
  if(t.grow)s+=` Пока карта лежит в руке, каждый ход +${t.grow} урона (до +${4*K}).`;
  if(t.hpcost)s+=` Стоит ещё ${t.hpcost} здоровья.`;
  return s}
function effect(t,c,card){const l=[];if(t.strip)l.push('снимает щит');if(t.trap)l.push('ловушка: '+numH(sm(c,t.trap.dmg),t.trap.dmg)+' урона'+(t.trap.freeze?', лёд':''));if(t.dmg)l.push(numH(shownDmg(t,c,card),t.dmg)+' урона'+(t.area==='melee'?' первому в столбце':''));if(t.heal)l.push('+'+numH(hlv(c,t.heal),t.heal)+' здоровья');if(t.shield)l.push('щит '+numH(sm(c,t.shield),t.shield));if(t.draw)l.push('рука +'+t.draw+(t.dur>1?' на '+t.dur+' хода':''));if(t.freeze)l.push('лёд');for(const k of NEG)if(cst(t,k))l.push(STN[k]+' '+cst(t,k)+' х.');if(t.cleanse)l.push('снимает плохие эффекты');if(t.immune)l.push('иммунитет '+t.immune+' х.');if(t.push)l.push('толчок');if(t.pull)l.push('притягивает');if(t.mark&&!NEG.includes('mark'))l.push('метка '+t.mark+' х.');if(t.evade)l.push('уклонение');if(t.drain)l.push('вампиризм');if(t.exec)l.push('+'+t.exec+' по раненым');if(t.chain)l.push('⚡ +'+t.chain+' другому');if(t.grow)l.push('растёт в руке');if(t.hpcost)l.push('стоит '+t.hpcost+' хп');if(t.sum)l.push('призыв: '+t.sum.n+' '+t.sum.hp+' хп');return l.join(', ')}
const elVar=el=>`var(--${{f:'fire',w:'water',e:'earth',a:'air',l:'light',d:'dark',n:'nature',z:'zap'}[el]})`;
function hpNeed(S,card){const e=S.plan.find(x=>x.card===card);if(e)return e.paid&&e.paid.hp||0;if(!S.hand.includes(card)||pay(avail(S),costOf(S,card)))return 0;const d=demonPay(S,card);return d&&d.hp||0}
function hpNeedH(S,card,long){const h=hpNeed(S,card);return h?(long?`<div class="mwhy" style="color:#FFC9C2">Не хватает стихий: демон заплатит ${h} здоровья.</div>`:`<span class="hpc">❤${h}</span>`):''}
function miniUp(t,c,card){const v=t.dmg?'⚔'+shownDmg(t,c,card):t.trap?'⚔'+sm(c,t.trap.dmg):t.heal?'♥'+hlv(c,t.heal):t.shield?'🛡'+sm(c,t.shield):'';return v?`<span class="mc-up">${v}</span>`:''}
function cardHtml(card,mini){
  const isNew=ui.seen&&G.P.hand.includes(card)&&!ui.seen.has(card.uid);
  const S=G.P,t=T[card.t],c=card.pet?pet(S,card.pet):null;
  const pi=S.plan.findIndex(e=>e.card===card);
  const burned=pi>=0&&S.plan[pi].kind==='burn';const cls=['card'];if(isNew)cls.push('new');if(ui.sel===card.uid)cls.push('selc');const inH=S.hand.includes(card);if(burned)cls.push('burned');else if(pi>=0)cls.push('pl');else if(whyNot(S,card))cls.push('dis');const wi=pi<0&&cls.includes('dis')?whyInfo(S,card):null;
  const ci=cardIni(card.t),es=inH?ini({kind:'card',card,S}):ci,spdH=`<span class="mc-spd ${es>ci?'sdn':es<ci?'sup':''}">⏱${es}</span>`;const di=cardIniDn(card.t),ed=inH?ini({kind:'burn',card,S}):di,dnH=`<span class="mc-spd dn ${ed>di?'sdn':ed<di?'sup':''}">⏱${ed}</span>`;
  const tag=burned?`<span class="burntag">▼</span>`:pi>=0?`<span class="badge">${planNo(S).get(S.plan[pi])||pi+1}</span>`:'';
  const st=`--pc:${t.el?elVar(t.el):'var(--mut)'}`,ic=c?petIc(c,1):'👣',cost=costHtml(t)+hpNeedH(S,card);
  const fs=(n,base,len)=>t.n.length>len?`font-size:${Math.max(base-3,base*len/t.n.length).toFixed(1)}px`:'';
  if(mini)return`<button class="${cls.join(' ')} mini" data-card="${card.uid}" style="${st}">${spdH}<span class="mc-cost">${cost}</span><span class="mc-ic${STEP.has(t.area)?' stp':''}">${ic}</span>${miniUp(t,c,card)}<span class="mc-bot">${dnH.replace('mc-spd dn','mc-dn').replace('⏱','<b>▼</b>⏱')}<span class="mc-dg">+${burnVal(S,card).n}${EI(burnVal(S,card).el,1)}</span></span><span class="mc-nm" style="${t.n.length>11&&t.n.includes(' ')?'white-space:normal;font-size:8.5px;line-height:1':fs(t.n,10,9)}">${t.n}</span>${tag}${wi?`<span class="why">${wi.ic}</span>`:''}</button>`;
  const b=burnVal(S,card),ar=STEP.has(t.area)&&c?moveIcon(c.mv):shapeIcon(t.area);
  return`<button class="${cls.join(' ')} bc" data-card="${card.uid}" style="${st}"><div class="bc-h">${spdH}<span class="bc-cost">${cost}</span></div><div class="bc-art"><span class="bc-ic">${ic}</span><span class="bc-ar">${ar}</span>${wi?`<span class="bc-why">${wi.ic} ${wi.tx}</span>`:''}</div><div class="bc-nm" style="${fs(t.n,13,12)}">${t.n}</div><div class="bc-tx">${STEP.has(t.area)?'Двигает любого своего пета по его схеме':effect(t,c,card)}</div><div class="bc-f" data-burnc="${card.uid}">${dnH}<span class="c-bn">▼ +${b.n}${EI(b.el,1)}</span>${t.sub?`<span class="c-bs">${t.sub.short}</span>`:''}</div>${tag}</button>`;
}
function petInfo(){
  const S=ui.info.side==='p'?G.P:G.B,p=pet(S,ui.info.id);if(!p||!p.alive)return'';
  const got=nbrs(S,p).filter(q=>AURA[q.au]&&q.au!=='tok').map(q=>`${petIc(q,1)} ${AURA[q.au]}`);
  const stl=petFx(p).map(fxLine).join(''),F=FAM[p.fam],C=CLS[p.cls],st=statLine(p);
  return`<div class="detail pinfo"><h3>${petIc(p,1)} ${p.n} <span class="m">${p.down?'⚙️':p.ghost?'👻':p.hp+'/'+p.max}</span></h3>${stl}
  ${F?`<div>${F.ic} <b>${F.n}</b>: ${F.t[0]}.</div>`:''}<div>${C?C.ic+' <b>'+C.n+'</b>':AUB[p.au]||''}: ${AURA[p.au]||'соседям ничего не даёт'}.</div>${st?`<div class="m">${st}.</div>`:''}
  ${got.length?`<div class="m">От соседей: ${got.join('; ')}.</div>`:''}${p.mv&&MV[p.mv]&&!p.sz&&!HV()?`<div class="m">Ходит ${MV[p.mv].t}. Куда он может шагнуть, видно на поле.</div>`:''}${HV()?stepInfo(p):''}</div>`;
}
function detailHtml(){
  if(ui.info&&!ui.sel&&!ui.busy){const h=petInfo();if(h)return h}
  if(ui.busy)return'';
  const S=G.P;let hint='';
  if(ui.msg)hint=`<span style="color:#FFB0A6">${ui.msg}</span>`;
  else if(ui.mover){const m=pet(S,ui.mover);hint=`${petIc(m,1)} ${m.n}: перетащи на клетку с силуэтом или тапни её.`}
  return hint?`<div class="detail">${hint}</div>`:'';
}
let TEAM=[],PLACE=null;
const petPool=()=>[...PETS.keys()];
function petCardsHtml(pi){
  const p=PETS[pi];
  const one=(k,t)=>{const sp=cardIni(k);return`<div class="pcard" style="--pc:${elVar(t.el)}"><div class="h"><span>${t.n} ${shapeIcon(t.area)}</span><span class="c-cost">${costHtml(t)}</span></div><div>${cardTxt(t,p)}</div>${HV()&&(t.stU||t.stD)?`<div class="m" style="font-size:12px">${t.stU?`👣 ▲ шаг ${MV[t.stU.m].t}, ${t.stU.f?'до':'после'} эффекта. `:''}${t.stD?`👣 ▼ шаг ${MV[t.stD.m].t}, ${t.stD.f?'до':'после'} эффекта.`:''}</div>`:''}<div class="m" style="font-size:12px"><span class="spdp">⏱ ${sp}</span> <span class="spdp">▼ ⏱ ${cardIniDn(k)}</span> +${t.burn+(p.fam==='elem'?1:0)} ${EI(t.dg||t.el,1)}${t.sub?', '+t.sub.short:''}.</div></div>`};
  if(metaMode()&&!sandbox()&&mp(p.n).un&&G&&G.phase!=='battle')return petSlotsHtml(pi,one);
  return (metaMode()&&!sandbox()&&mp(p.n).un?curCards(pi):p.cards).map(k=>one(k,T[k])).join('');
}
function teamSums(){const g=z0(),c=z0();for(const i of TEAM){const p=PETS[i];for(const k of p.cards){const t=T[k];g[t.dg||t.el]+=t.burn+(p.fam==='elem'?1:0);for(const e in t.cost)c[e]+=t.cost[e]}}return{g,c}}
// v29: team rating fitted on 60k bot-vs-bot battles (logistic model: pets + family tiers)
function rateScore(team){let s=RATE70.b||0;const c={};for(const i of team){s+=RATE70.p[PETS[i].n]||0;const k=PETS[i].cls;c[k]=(c[k]||0)+1}for(const k in RATE70.c)if(c[k])s+=RATE70.c[k];for(const k in RATE70.c3||{})if(c[k]>=3)s+=RATE70.c3[k];return{s,c}}
function teamRating(){
  if(TEAM.length<5)return`<div class="m">Оценка стаи появится, когда выберешь всех пятерых.</div>`;
  const {n,c}=rateGrade(),s=rateScore(TEAM).s,win=Math.round(100/(1+Math.exp(-s)));
  const why=[],cl=new Set(TEAM.map(i=>PETS[i].cls));
  for(const k of ['guard','healer'])if(!cl.has(k))why.push('нет ни одного '+(k==='guard'?'Стража':'Целителя'));
  const many=Object.keys(CLS).filter(k=>TEAM.filter(i=>PETS[i].cls===k).length>=3);for(const k of many){const n=TEAM.filter(i=>PETS[i].cls===k).length;why.push('перекос: '+['','','','три','четыре','пять'][n]+' '+{guard:'Стража',fighter:'Бойца',healer:'Целителя',agile:'Ловкача',sage:'Мудреца'}[k])}
  const weak=TEAM.filter(i=>(RATE70.p[PETS[i].n]||0)<-0.06).map(i=>PETS[i].n);if(weak.length)why.push('слабее остальных в боях ботов: '+weak.join(', '));
  const strong=TEAM.filter(i=>(RATE70.p[PETS[i].n]||0)>0.06).map(i=>PETS[i].n);if(strong.length)why.push('сильные: '+strong.join(', '));
  return`<div><b style="color:${c}">Оценка: ${n}</b> <span class="m">· примерно ${win}% побед против случайной стаи</span></div>${why.length?`<div class="m" style="margin-top:2px">${why.map(x=>x[0].toUpperCase()+x.slice(1)).join('. ')}.</div>`:''}`;
}
function famSummary(team){
  const fams=[...new Set(team.map(i=>PETS[i].fam))],cls={};for(const i of team){const k=PETS[i].cls;cls[k]=(cls[k]||0)+1}
  return`<div style="display:flex;flex-direction:column;gap:3px;margin-top:6px"><div><b>Классы:</b> ${Object.entries(cls).map(([k,v])=>CLS[k].ic+' '+CLS[k].n+(v>1?' ×'+v:'')).join(', ')}</div>${fams.map(f=>`<div>${FAM[f].ic} <b>${FAM[f].n}</b> <span class="m">· ${FAM[f].t[0]}</span></div>`).join('')}</div>`;
}
function rateGrade(){const {s}=rateScore(TEAM),q=RATE70.q;let g=0;while(g<4&&s>q[g])g++;return{g,n:['Плохо','Неплохо','Хорошо','Отлично','Супер'][g],c:['#FFB0A6','#F2D29B','#EDEFF2','#CFEFDD','#FFE08A'][g]}}
let RATE70={"p":{"Медведь":0.061,"Волк":0.002,"Олень":-0.021,"Лиса":0.047,"Сова":-0.058,"Дубовик":-0.002,"Колючник":0.069,"Лотосовик":-0.037,"Мухолов":0.06,"Солнечник":-0.082,"Жук-носорог":-0.009,"Богомол":-0.051,"Пчела":-0.02,"Комар":0.027,"Паук":0.026,"Единорог":-0.029,"Грифон":0.042,"Фея":-0.032,"Джинн":-0.032,"Русалка":0.047,"Скелет":0.064,"Зомби":0.053,"Призрак":0.054,"Вампир":-0.038,"Лич":-0.01,"Робот":0.002,"Мехскорпион":-0.025,"Ремонтник":0.006,"Мехзмей":-0.074,"Дрон":-0.01,"Голем":0.001,"Огневик":-0.016,"Водяной":-0.007,"Вихрик":-0.083,"Искрун":-0.038,"Цербер":0.056,"Бес":0.055,"Козлорог":0.006,"Тенекот":-0.046,"Демон хаоса":0.018,"Слизень":0.057,"Кальмар":-0.022,"Медуза":0.026,"Глазун":0.025,"Осьминог":-0.052,"Каменный дракон":0.008,"Дракончик":-0.003,"Златокрыл":-0.015,"Виверна":0.045,"Тёмный дракон":-0.045},"c":{"guard":0.134,"fighter":0.059,"healer":0.11,"agile":0.015,"sage":0.081},"c3":{"guard":-0.177,"fighter":-0.037,"healer":-0.08,"agile":-0.104,"sage":-0.04},"b":-0.254,"q":[-0.142,-0.027,0.077,0.179]};
const statLine=p=>[`⚔ Сила ${Math.round(silaOf(p))}: от неё считаются числа его карт`,p.leg&&LEGT[p.cls]?`👑 Черта: ${LEGT[p.cls]}`:'',p.sp?`⏱ Инициатива его карт ${p.sp>0?'−':'+'}${Math.abs(p.sp)*INI_STEP}: они срабатывают ${p.sp>0?'раньше':'позже'}`:''].filter(Boolean).join('. ');
function petSheet(v){
  const p=PETS[v],inT=TEAM.includes(v),full=TEAM.length>=5&&!inT,C=CLS[p.cls],F=FAM[p.fam],st=statLine(p);
  return`<div class="over" data-act="ps-close"><div class="box psheet">
  <div class="psh"><span class="pbig">${petLive(p)}</span><div><h2>${p.n}</h2><div class="m"><b style="color:${rarC(p)}">${GRADE[p.rar].n}</b>${metaMode()&&!sandbox()?' · ур. '+mp(p.n).lv:''} · ${metaMode()&&!sandbox()?myDef(v).hp:p.hp} хп · ${petEls(p).map(e=>EI(e,1)).join('')} · ${C.ic} ${C.n} · ${F.ic} ${F.n}</div></div></div>
  <div class="fxr ps"><span class="fxi">${F.ic}</span><span><b>${F.n}</b><br><span class="m">${F.t[0][0].toUpperCase()+F.t[0].slice(1)}.</span></span></div>
  <div class="fxr ps"><span class="fxi">${C.ic}</span><span><b>${C.n}</b><br><span class="m">${AURA[p.au][0].toUpperCase()+AURA[p.au].slice(1)} (соседи по сторонам).</span></span></div>
  ${st?`<div class="m">${st}.</div>`:''}
  ${HV()?stepCardsTxt(p):`<div class="m">Ходит ${moveIcon(p.mv)} ${MV[p.mv].t}. Двигается картой 👣 Шаг.</div>`}
  ${petCardsHtml(v)}
  <div class="acts stk"><button class="btn" data-act="ps-x">Закрыть</button><button class="btn main" data-act="ps-tog" ${full?'disabled':''}>${inT?'Убрать из стаи':full?'Стая полная':'Взять в стаю'}</button></div>
  </div></div>`;
}
function deckSheet(){
  const {g,c}=teamSums();
  const row=o=>ELS.filter(k=>g[k]||c[k]).map(k=>`<span class="chip" style="${o[k]?'':'opacity:.35'}">${o[k]}${EI(k,1)}</span>`).join('');
  const short=ELS.filter(k=>c[k]>g[k]);
  return`<div class="over" data-act="dk-close"><div class="box psheet"><h2>Колода стаи <span class="m">${TEAM.length*3} ${plN(TEAM.length*3,'карта','карты','карт')}</span></h2>
  ${TEAM.length?`<div class="detail" style="font-size:12px">${teamRating()}${famSummary(TEAM)}</div>
  <div class="detail" style="font-size:12px"><div class="bal"><span>▼ дают</span>${row(g)}</div><div class="bal"><span>Карты тратят</span>${row(c)}</div>
  
  ${short.map(k=>`<div style="color:#FFB0A6;margin-top:4px">${EI(k,1)} не хватает: картам нужно ${c[k]}, ▼ дают ${g[k]}.</div>`).join('')}</div>
  ${TEAM.map(i=>`<div class="dkp">${petIc(PETS[i],1)} <b>${PETS[i].n}</b></div><div class="dkl">${petCardsHtml(i)}</div>`).join('')}`:'<div class="m">Стая пока пустая.</div>'}
  <div class="acts stk"><button class="btn main" data-act="dk-x">Закрыть</button></div></div></div>`;
}
const SORTN={def:'обычная',q:'качество',name:'имя',hp:'здоровье',el:'стихия',fam:'семейство',cls:'класс'};
function fltSheet(pool,n){const F=ui.flt,cb=(act,on,txt)=>`<button class="pill sm cbx ${on?'on':''}" data-act="${act}"><span class="cb"></span>${txt}</button>`;
  return`<div class="over" data-act="fw-close"><div class="box fbox"><h2>Фильтры</h2>
  <div class="m" style="font-size:11px">Внутри группы подходит любой из отмеченных. Ничего не отмечено: все.</div>
  <h4>Стихии карт</h4><div class="modes">${ELS.map(k=>cb('fe-'+k,F.el.includes(k),EI(k,1)+' '+ELN[k])).join('')}</div>
  <h4>Семейства</h4><div class="modes">${Object.entries(FAM).filter(([f])=>pool.some(i=>PETS[i].fam===f)).map(([f,x])=>cb('ff-'+f,F.fam.includes(f),x.ic+' '+x.n)).join('')}</div>
  <h4>Классы</h4><div class="modes">${Object.entries(CLS).map(([r,x])=>cb('fr-'+r,F.role.includes(r),x.ic+' '+x.n)).join('')}</div>
  <h4>Сортировка</h4><div class="modes">${Object.entries(SORTN).map(([k,v])=>`<button class="pill sm ${F.sort===k?'on':''}" data-act="fs-${k}">${v}</button>`).join('')}</div>
  <div class="acts"><button class="btn" data-act="fclr">Сбросить</button><button class="btn main" data-act="fw-x">Показать ${n}</button></div></div></div>`}
function oppSheet(){
  return`<div class="over" data-act="op-close"><div class="box"><h2>Соперник</h2>
  <div class="modes"><button class="pill ${VS==='pack'?'on':''}" data-act="vs-pack">Стая</button><button class="pill ${VS==='boss'?'on':''}" data-act="vs-boss">🗿 Босс</button></div>
  ${VS==='pack'?`<div class="m" style="font-size:12px">Сложность</div><div class="modes">${[['auto','Авто'],['easy','Лёгкий'],['medium','Средний'],['hard','Сложный'],['master','Мастер'],['smart','Стратег']].map(([k,n])=>`<button class="pill ${AI===k?'on':''}" data-act="ai-${k}">${n}</button>`).join('')}</div><div class="m" style="font-size:12px">${{auto:`Подстраивается под тебя. Сейчас уровень ${autoLv()} из 10.`,easy:'Часто ошибается.',medium:'Бьёт по видимым целям.',hard:'Предугадывает шаги и добивает раненых. Видит только то же, что и ты.',master:'Просчитывает ход вперёд: перебирает свои планы против догадок о твоей руке. Твоих карт не видит.',smart:'Самый сильный. Перебирает десятки планов: что сыграть вверх ▲, что вниз ▼ ради стихий, что оставить в руке, кого сдвинуть. Каждый проигрывает против догадок о твоей руке. Твоих карт не видит.'}[AI]}</div>`:`<div class="modes">${Object.entries(BOSSES).map(([k,b])=>[k,b.ic+' '+b.n]).map(([k,n])=>`<button class="pill sm ${QBOSS===k?'on':''}" data-act="qb-${k}">${n}</button>`).join('')}</div><div class="m" style="font-size:12px">${BOSSES[QBOSS].rule}</div>`}
  <div class="acts"><button class="btn main" data-act="op-x">Готово</button></div></div></div>`;
}
function renderPick(){
  ui.flt=ui.flt||{el:[],fam:[],role:[],sort:'def'};const F=ui.flt;
  const pool=metaMode()&&!sandbox()?petPool().filter(i=>META.pets[PETS[i].n].un):petPool();
  let list=pool.filter(i=>(!F.el.length||petEls(PETS[i]).some(e=>F.el.includes(e)))&&(!F.fam.length||F.fam.includes(PETS[i].fam))&&(!F.role.length||F.role.includes(PETS[i].cls)));
  const so={q:(a,b)=>PETS[b].rar-PETS[a].rar||PETS[a].n.localeCompare(PETS[b].n,'ru'),name:(a,b)=>PETS[a].n.localeCompare(PETS[b].n,'ru'),hp:(a,b)=>PETS[b].hp-PETS[a].hp,el:(a,b)=>ELS.indexOf(petEls(PETS[a])[0])-ELS.indexOf(petEls(PETS[b])[0])||PETS[a].n.localeCompare(PETS[b].n,'ru'),fam:(a,b)=>Object.keys(FAM).indexOf(PETS[a].fam)-Object.keys(FAM).indexOf(PETS[b].fam)||Object.keys(CLS).indexOf(PETS[a].cls)-Object.keys(CLS).indexOf(PETS[b].cls),cls:(a,b)=>Object.keys(CLS).indexOf(PETS[a].cls)-Object.keys(CLS).indexOf(PETS[b].cls)||Object.keys(FAM).indexOf(PETS[a].fam)-Object.keys(FAM).indexOf(PETS[b].fam)}[F.sort];if(so)list.sort(so);
  const pill=(act,on,txt)=>`<button class="pill sm ${on?'on':''}" data-act="${act}">${txt}</button>`;
  const ttl=CTX&&CTX.kind==='lair'?BOSSES[CTX.bk].ic+' '+BOSSES[CTX.bk].n+' · '+LAIR_T[CTX.tier].ic:'Твоя стая';
  const nf=F.el.length+F.fam.length+F.role.length,rg=TEAM.length===5?rateGrade():null;
  let h=`<div class="top"><button class="pill sm" data-act="m-menu">‹ Меню</button><div class="title">${ttl}</div><span class="modes"></span></div>
  <div class="tbar"><div class="tm">${[0,1,2,3,4].map(k=>{const i=TEAM[k];return i==null?`<span class="ts empty"></span>`:`<button class="ts" data-view="${i}" style="border-color:${rarC(PETS[i])}"><span class="em">${petIc(PETS[i],1)}</span>${FAM[PETS[i].fam]?`<span class="fmb">${FAM[PETS[i].fam].ic}</span><span class="clb">${CLS[PETS[i].cls].ic}</span>`:''}<span class="tx" data-qt="${i}">✕</span></button>`}).join('')}</div>
  <div class="tside"><button class="pill sm" data-act="deck" ${TEAM.length?'':'disabled'}>🃏 Колода</button><button class="pill sm" data-act="fxs">💫 Эффекты</button>${rg?`<button class="pill sm" data-act="deck" style="color:${rg.c}">${rg.n}</button>`:`<span class="m" style="font-size:12px">${TEAM.length}/5</span>`}</div></div>
  
  <div class="flt fl1"><button class="pill sm ${nf||F.sort!=='def'?'on':''}" data-act="fopen">⚙ Фильтры${nf?' · '+nf:''}</button>${nf?pill('fclr',false,'✕ Сбросить'):''}<span class="m" style="font-size:11px;margin-left:auto">${list.length===pool.length?'Все '+pool.length:list.length+' из '+pool.length}${F.sort!=='def'?' · по '+SORTN[F.sort]:''}</span></div>
  <div class="pk">${list.length?list.map(i=>{const q=PETS[i],on=TEAM.includes(i),full=TEAM.length>=5&&!on;return`<div class="pt ${on?'on':''}" data-view="${i}" data-r="${q.rar}" style="--qc:${rarC(q)}">${FAM[q.fam]?`<span class="fmb" title="${FAM[q.fam].n}">${FAM[q.fam].ic}</span><span class="clb" title="${CLS[q.cls].n}">${CLS[q.cls].ic}</span>`:''}<button class="qt ${on?'on':''}" data-qt="${i}" ${full?'disabled':''}>${on?'✓':'+'}</button><span class="pt-av">${qArt(q,metaMode()&&!sandbox()?mp(q.n).q:0,1)}${metaMode()&&!sandbox()?`<span class="lvb" style="background:${qC(mp(q.n).q)}">${mp(q.n).lv}</span>`:''}</span><span class="pnm" style="font-size:${q.n.length>12?10.5:q.n.length>9?11.5:12.5}px">${q.n}</span><span class="pels">${petEls(q).map(e=>EI(e,1)).join('')}</span></div>`}).join(''):'<div class="m">Никого не нашлось, сбрось фильтр.</div>'}</div>
  <div class="m" style="font-size:11px;text-align:center;margin-top:6px">Тап по пету: что он умеет. «+»: сразу в стаю.</div>
  <div class="acts stk">${CTX?'':`<button class="btn" data-act="opp">${VS==='boss'?'🗿 Босс':'Соперник: '+{auto:'авто',easy:'лёгкий',medium:'средний',hard:'сложный',master:'мастер',smart:'стратег'}[AI]}</button>`}<button class="btn main" data-act="to-place" ${TEAM.length<5?'disabled':''}>${TEAM.length<5?'Ещё '+(5-TEAM.length):'Расставить'}</button></div>`;
  if(ui.pv!=null&&ui.psheet)h+=petSheet(ui.pv);
  if(ui.deck)h+=deckSheet();
  if(ui.fxs)h+=fxSheet();
  if(ui.opp)h+=oppSheet();
  if(ui.fwin)h+=fltSheet(pool,list.length);
  setApp(h);
}
function renderPlace(){
  let g=`<div class="grid" style="grid-template-columns:repeat(${COLS},1fr);--asp:.9">`;
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const i=PLACE.findIndex(x=>x[0]===r&&x[1]===c),p=i>=0?PETS[TEAM[i]]:null;
    g+=`<button class="cell ${ui.ps===i&&i>=0?'sel':''} ${ui.ps!=null&&i!==ui.ps?'dest':''}" data-pcell="${r},${c}">${p?`<div class="pet"><div class="av${artK(p)?' art':''}">${petIc(p,0,-((r*3+c)%5)*.6)}</div><div class="pname">${p.n}</div></div>`:''}</button>`;
  }
  g+='</div>';
  setApp(`<div class="top"><div class="title">${CTX&&CTX.kind==='run'?(NEXT&&NEXT.bossK?'👑 '+BOSSES[NEXT.bossK].n:NEXT&&NEXT.mod?'💀 Элита: '+ELM[NEXT.mod].ic+' '+ELM[NEXT.mod].n:'⚔️ '+(PACKS[(META.run.map.rows[META.run.pos.r][META.run.pos.i].enc||{}).pack]||{n:'Бой'}).n):CTX&&CTX.kind==='duel'?(CTX.stage==='pick1'?'Игрок 1: расстановка':'Игрок 2: расстановка'):CTX&&CTX.kind==='tower'?'Башня, этаж '+CTX.floor:CTX&&CTX.kind==='daily'?'Испытание дня':'Расстановка'}</div></div>
  <div class="m" style="font-size:13px;margin:4px 0">Тапни пета, потом клетку. Соседи по сторонам усиливают друг друга.</div>
  <div class="front"><span class="side-name" style="font-size:10px">фронт, сюда смотрит соперник</span></div>${g}
  <div class="legend">${TEAM.map(i=>PETS[i]).map(p=>`<span>${petIc(p,1)} <b>${AUB[p.au]} ${AUS[p.au]}</b></span>`).join('')}</div>
  <div class="acts stk"><button class="btn" data-act="to-pick">Назад</button><button class="btn" data-act="place-rand">Случайно</button><button class="btn" data-act="place-smart">Умно</button><button class="btn main" data-act="start">В бой</button></div>`);
}
function resetPlace(){PLACE=START.map(x=>[...x])}
function phaseClick(e){
  const a=e.target.closest('[data-qt],[data-act],[data-view],[data-pick],[data-pcell]');if(!a)return;
  const tog=v=>{if(TEAM.includes(v))TEAM=TEAM.filter(x=>x!==v);else if(TEAM.length<5)TEAM.push(v)};
  if(a.dataset.qt!=null){if(!a.disabled)tog(+a.dataset.qt);return render()}
  if(a.dataset.view!=null){ui.pv=+a.dataset.view;ui.psheet=true;return render()}
  if(a.dataset.pick!=null){const v=+a.dataset.pick;ui.pv=v;if(TEAM.includes(v))TEAM=TEAM.filter(x=>x!==v);else if(TEAM.length<5)TEAM.push(v);return render()}
  if(a.dataset.pcell){const[r,c]=a.dataset.pcell.split(',').map(Number),i=PLACE.findIndex(x=>x[0]===r&&x[1]===c);
    if(ui.ps==null){if(i>=0)ui.ps=i}else{if(i>=0&&i!==ui.ps)PLACE[i]=PLACE[ui.ps];if(i!==ui.ps)PLACE[ui.ps]=[r,c];ui.ps=null}
    return render()}
  const act=a.dataset.act;
  if(act&&modeClick(act))return;
  if(act&&act.startsWith('ai-')){AI=act.slice(3);render()}
  else if(act==='vs-pack'||act==='vs-boss'){VS=act.slice(3);render()}
  else if(act&&act.startsWith('qb-')){QBOSS=act.slice(3);render()}
  else if(act==='ps-close'||act==='ps-x'){if(act==='ps-x'||e.target===a){ui.psheet=false;render()}}
  else if(act==='ps-tog'){tog(ui.pv);ui.psheet=false;render()}
  else if(act==='deck'){ui.deck=true;render()}
  else if(act==='dk-close'||act==='dk-x'){if(act==='dk-x'||e.target===a){ui.deck=false;render()}}
  else if(act==='opp'){ui.opp=true;render()}
  else if(act==='op-close'||act==='op-x'){if(act==='op-x'||e.target===a){ui.opp=false;render()}}
  else if(act==='fopen'){ui.fwin=true;render()}
  else if(act==='fw-close'||act==='fw-x'){if(act==='fw-x'||e.target===a){ui.fwin=false;render()}}
  else if(act==='fclr'){ui.flt={el:[],fam:[],role:[],sort:'def'};render()}
  else if(/^f[efrs]-/.test(act)){const k={e:'el',f:'fam',r:'role',s:'sort'}[act[1]],v=act.slice(3),bx=document.querySelector('.fbox'),st=bx?bx.scrollTop:0;
    if(k==='sort')ui.flt.sort=v;else{const l=ui.flt[k];ui.flt[k]=l.includes(v)?l.filter(x=>x!==v):[...l,v]}
    render();const nb=document.querySelector('.fbox');if(nb)nb.scrollTop=st}
  else if(act==='pick-toggle'){const v=ui.pv??TEAM[0];if(TEAM.includes(v))TEAM=TEAM.filter(x=>x!==v);else if(TEAM.length<5)TEAM.push(v);render()}
  else if(act==='to-place'&&TEAM.length===5){G.phase='place';if(!PLACE)resetPlace();ui.ps=null;render()}
  else if(act==='to-pick'){G.phase='pick';render()}
  else if(act==='place-smart'){const sp=smartPlace(TEAM.map(i=>PETS[i]),TEAM.length);PLACE=sp.concat(START.filter(x=>!sp.some(y=>y[0]===x[0]&&y[1]===x[1]))).slice(0,5);ui.ps=null;render()}
  else if(act==='place-rand'){PLACE=shuffle([...Array(ROWS*COLS).keys()]).slice(0,5).map(k=>[Math.floor(k/COLS),k%COLS]);ui.ps=null;render()}
  else if(act==='start'){
    newGame()}
}

