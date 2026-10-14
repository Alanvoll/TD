/* ---------- drag and drop ---------- */
const HOT=56;
let drag=null,suppress=0;
const app=document.getElementById('app');
const hotEl=document.createElement('div');hotEl.className='hot';hotEl.hidden=true;document.body.appendChild(hotEl);
const burnEl=document.createElement('div');burnEl.className='burnfix';burnEl.hidden=true;document.body.appendChild(burnEl);
const inBurn=e=>e.clientY>innerHeight-120;
function cellAtXY(x,y){const el=document.elementFromPoint(x,y);const c=el&&el.closest('[data-cell]');if(!c)return null;const[s,r,cc]=c.dataset.cell.split(',');if(c.dataset.span){const b=c.getBoundingClientRect(),up=y<b.top+b.height/2,rt=x>b.left+b.width/2;return{s,r:+r+(s==='b'?(up?1:0):(up?0:1)),c:+cc+(rt?1:0)}}return{s,r:+r,c:+cc}}
function overBoard(x,y){const el=document.elementFromPoint(x,y);return!!(el&&el.closest('.grid'))}
function destDir(id,cell){
  if(!cell||cell.s!=='p')return null;
  const P=G.P,[pr,pc]=projPos(P,id);
  return dirsFor(pet(P,id),curStep()).find(d=>pr+d[0]===cell.r&&pc+d[1]===cell.c)||null;
}
// «ближайший в столбце»: the nearest enemy is the target, the ones behind it in that column may be hit instead (marked as possible)
function meleeLine(h,out){if(!h)return;out.push(['b',h[0],h[1]]);for(const k of behindKeys(h)){const[r,c]=k.split('-').map(Number);out.push(['b',r,c,1])}}
function dragCells(d,cell){
  const S=G.P,out=[];
  if(d.petMove){if(destDir(d.petMove,cell))out.push(['p',cell.r,cell.c]);return out}
  const card=S.hand.find(c=>c.uid===d.uid),t=d.dn?dnT(card.t):T[card.t],caster=card.pet?pet(S,card.pet):null;
  if(d.dn){if(!caster)return out;if(t.area==='melee')meleeLine(offCells('melee',null,caster,G.B)[0],out);else if(t.area==='row')alive(G.B).filter(p=>p.r===0).forEach(p=>out.push(['b',p.r,p.c]));else if(t.area==='allies')alive(S).forEach(p=>out.push(['p',p.r,p.c]));else out.push(['p',caster.r,caster.c]);return out}
  if(t.area==='enemies')offCells(t.area,null,caster,G.B).forEach(([r,c])=>out.push(['b',r,c]));
  else if(t.area==='melee'){if(cell&&cell.s==='b'){const h=offCells('melee',[cell.r,cell.c],caster,G.B);if(h.length)meleeLine(h[0],out);else for(let r=0;r<ROWS;r++)out.push(['b',r,cell.c])}}
  else if(t.area==='self')out.push(['p',caster.r,caster.c]);
  else if(t.area==='allies')alive(S).forEach(p=>out.push(['p',p.r,p.c]));
  else if(!cell)return out;
  else if(OFF.has(t.area)){if(cell.s==='b')offCells(t.area,[cell.r,cell.c],caster,G.B).forEach(([r,c])=>out.push(['b',r,c]))}
  else if(t.area==='ally'){if(cell.s==='p'&&petAt(S,cell.r,cell.c))out.push(['p',cell.r,cell.c])}
  else if(STEP.has(t.area)){const q=cell.s==='p'?petAt(S,cell.r,cell.c):null;if(q&&!noMove(q))out.push(['p',cell.r,cell.c])}
  return out;
}
function belowHand(e){const h=app.querySelector('.hand');if(!h)return false;const b=h.getBoundingClientRect();return e.clientY>b.bottom+6}
function showDests(id){
  const P=G.P,p=pet(P,id),[pr,pc]=projPos(P,id);
  for(const d of dirsFor(p,curStep())){const r=pr+d[0],c=pc+d[1];if(!inb(r,c))continue;
    const el=app.querySelector(`[data-cell="p,${r},${c}"]`);if(!el)continue;
    el.classList.add('dest');const sp=document.createElement('span');sp.className='sil';sp.innerHTML=petIc(p,1);el.appendChild(sp)}
}
// a big pet spans several cells but is drawn once, at its anchor cell
function cellEl(s,r,c){const q=s==='b'?petAt(G.B,r,c):s==='p'?petAt(G.P,r,c):null;return app.querySelector(`[data-cell="${s},${q&&q.sz?q.r:r},${q&&q.sz?q.c:c}"]`)||app.querySelector(`[data-cell="${s},${r},${c}"]`)}
function paintDrag(list){
  app.querySelectorAll('.cell.prev,.cell.prev2').forEach(x=>x.classList.remove('prev','prev2'));
  for(const[s,r,c,m]of list){const el=cellEl(s,r,c);if(el)el.classList.add(m?'prev2':'prev')}
}
app.addEventListener('pointerdown',e=>{if(ui.busy&&G&&G.phase==='battle'&&!ui.skip){ui.skip=true;fxRate()}
  if(ui.busy||G.over||(!HV()&&e.target.closest('[data-burnc]')))return;
  const base={x:e.clientX,y:e.clientY,on:false,id:e.pointerId};
  const c=e.target.closest('[data-card]');
  // 0.34: grabbing the lower part of a card (▼ rows) plays its ▼ half
  if(c){const hf=e.target.closest('[data-half]');drag={...base,uid:c.dataset.card,el:c,dn:HV()&&!!hf&&hf.dataset.half==='d'};return}
  if(ui.stepE){const cl=e.target.closest('[data-cell]');if(!cl)return;const[sd,r,cc]=cl.dataset.cell.split(',');const p=sd==='p'&&petAt(G.P,+r,+cc);if(p&&p.id===ui.stepE.card.pet)drag={...base,petMove:p.id,stepE:1};return}
  const selStep=ui.sel&&G.P.hand.find(k=>k.uid===ui.sel&&STEP.has(T[k.t].area));
  const cl=e.target.closest('[data-cell]');if(!cl||(ui.sel&&!selStep))return;
  const[sd,r,cc]=cl.dataset.cell.split(',');if(sd!=='p')return;
  const p=petAt(G.P,+r,+cc);if(!p||noMove(p))return;
  {
    const free=G.P.hand.filter(k=>STEP.has(T[k.t].area)&&!G.P.plan.some(x=>x.card===k)&&!whyNot(G.P,k));
    if(!selStep)return;
    if(free.includes(selStep))drag={...base,petMove:p.id,stepUid:selStep.uid};
    else drag={...base,petMove:p.id,noStep:true};
  }
});
document.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const S=G.P;
  if(!drag.on){
    if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<10)return;
    if(drag.uid&&!drag.viaPet&&Math.abs(e.clientX-drag.x)>Math.abs(e.clientY-drag.y)&&drag.el&&drag.el.closest('.hand.scr')){drag=null;return}
    let src;
    if(drag.petMove){
      if(drag.noStep){drag=null;msg('Не хватает стихий на «Шаг».');return}
      ui.sel=null;ui.mover=drag.petMove;ui.info=null;ui.msg=null;ui.peek=null;showDests(drag.petMove);
      const p=pet(S,drag.petMove);src=app.querySelector(`[data-cell="p,${p.r},${p.c}"] .av`);
    }else{
      const card=S.hand.find(c=>c.uid===drag.uid);if(!card){drag=null;return}
      const pi=S.plan.findIndex(x=>x.card===card);
      if(pi>=0)S.plan.splice(pi,1);
      drag.why=drag.dn?whyDn(S,card):whyNot(S,card);
      ui.info=null;ui.msg=null;ui.peek=null;
      if(!drag.why){ui.sel=card.uid;ui.selDn=drag.dn?card.uid:null;ui.mover=null}else{ui.sel=null;ui.mover=null}
      if(drag.viaPet){const vp=pet(S,drag.viaPet);src=app.querySelector(`[data-cell="p,${vp.r},${vp.c}"] .av`)}else src=drag.el||app.querySelector(`[data-card="${card.uid}"]`);
    }
    if(!src){drag=null;return}
    const g=src.cloneNode(true);g.classList.add('ghost');g.style.width=src.offsetWidth+'px';g.style.height=src.offsetHeight+'px';document.body.appendChild(g);
    src.style.opacity='.3';
    drag.on=true;document.body.classList.add('dragging');drag.g=g;drag.w=src.offsetWidth;drag.h=src.offsetHeight;hotEl.hidden=false;
    // 0.35.1 Anton: the aim ring sits just above the dragged card, the card stays under the finger
    drag.hot=Math.round(drag.h*.75/2+14);
    if(!drag.petMove&&HV()){if(drag.dn&&!drag.why){burnEl.innerHTML='▼ сюда: сыграть низ';burnEl.hidden=false}}
    else if(!drag.petMove){const cd=S.hand.find(c=>c.uid===drag.uid),b=burnVal(S,cd);burnEl.innerHTML=`▼ +${b.n} ${EI(b.el)}`;burnEl.hidden=false}
  }
  e.preventDefault();
  drag.g.style.transform=`translate(${e.clientX-drag.w/2}px,${e.clientY-drag.h/2}px) scale(.75)`;
  hotEl.style.transform=`translate(${e.clientX}px,${e.clientY-drag.hot}px)`;
  const z=app.querySelector('.burnzone');
  if(!drag.petMove&&(!HV()||drag.dn)){const ov=inBurn(e)||belowHand(e);burnEl.classList.toggle('hit',ov);if(z)z.classList.toggle('over',ov)}
  const hc=drag.why||(!drag.petMove&&inBurn(e))?[]:dragCells(drag,cellAtXY(e.clientX,e.clientY-drag.hot));
  paintDrag(hc);previewOrder(e,hc);
},{passive:false});
// show in the order strip where the dragged card would fire
function previewOrder(e,hc){const S=G.P;let x=null;
  if(drag.petMove){if(drag.stepUid&&hc.length){const card=S.hand.find(c=>c.uid===drag.stepUid);if(card)x={kind:'card',card,petT:drag.petMove,dir:[0,0]}}}
  else if(!drag.why){const card=S.hand.find(c=>c.uid===drag.uid);
    if(card&&(!HV()||drag.dn)&&(inBurn(e)||belowHand(e)))x={kind:'burn',card,...burnVal(S,card)};
    else if(card&&hc.length){x={kind:drag.dn?'burn':'card',card};if(STEP.has(T[card.t].area)){const q=petAt(S,hc[0][1],hc[0][2]);if(q)x.petT=q.id}}}
  const k=x?x.kind+(x.card&&x.card.uid):'';if(k===drag.pk&&app.querySelector('.qs .gh')||k===drag.pk&&!x)return;drag.pk=k;ui.qprev=x;
  const f=app.querySelector('.front');if(!f)return;const sc=f.querySelector('.qs'),sl=sc?sc.scrollLeft:0;f.outerHTML=frontHtml();
  const g=app.querySelector('.qs .gh');if(g)g.scrollIntoView({block:'nearest',inline:'nearest'});else{const s2=app.querySelector('.qs');if(s2)s2.scrollLeft=sl}}
function endDrag(e){
  if(!drag||e.pointerId!==drag.id)return;
  const d=drag;drag=null;ui.qprev=null;if(!d.on)return;
  suppress=Date.now();if(d.g)d.g.remove();hotEl.hidden=true;burnEl.hidden=true;burnEl.classList.remove('hit');
  const S=G.P,up=e.type==='pointerup',hx=e.clientX,hy=e.clientY-(d.hot||HOT);
  const cell=up?cellAtXY(hx,hy):null,board=up&&overBoard(hx,hy);
  const fe=up?document.elementFromPoint(e.clientX,e.clientY):null;document.body.classList.remove('dragging');
  ui.msg=null;ui.peek=null;
  const done=()=>{ui.sel=null;ui.mover=null;render()};
  if(d.petMove&&d.stepE){const dir=destDir(d.petMove,cell);if(dir)stepSet(dir);else render();return}
  if(d.petMove){const dir=destDir(d.petMove,cell);
    if(dir){if(d.stepUid){const card=S.hand.find(c=>c.uid===d.stepUid);planPush(S,card,{petT:d.petMove,dir},isDnSel()&&ui.sel===d.stepUid)}else S.plan.push({kind:'move',petT:d.petMove,dir})}
    return done()}
  const card=S.hand.find(c=>c.uid===d.uid);if(!card)return done();
  if(up&&(inBurn(e)||belowHand(e)||(fe&&fe.closest('[data-burn]')))){ui.mover=null;if(HV()&&!d.dn)return done();if(d.why)return done();return doBurn(card)}
  if(d.why){ui.sel=null;ui.mover=null;ui.msg=d.why;ui.peek=card.uid;return render()}
  if(d.dn){if(board)planPush(S,card,{},1);return done()}
  const t=T[card.t];
  if(AUTO.has(t.area)){if(board)planPush(S,card,{},d.dn);return done()}
  if(OFF.has(t.area)){if(cell&&cell.s==='b')planPush(S,card,{cell:[cell.r,cell.c]},d.dn);return done()}
  if(t.area==='ally'){const p=cell&&cell.s==='p'?petAt(S,cell.r,cell.c):null;if(p)planPush(S,card,{petT:p.id},d.dn);return done()}
  if(STEP.has(t.area)){const q=cell&&cell.s==='p'?petAt(S,cell.r,cell.c):null;if(q&&!noMove(q)){ui.sel=card.uid;ui.selDn=d.dn?card.uid:null;ui.mover=q.id;ui.msg='Теперь перетащи '+q.n+' на подсвеченную клетку или тапни её.';return render()}return done()}
  done();
}
document.addEventListener('pointerup',endDrag);
document.addEventListener('pointercancel',endDrag);
G={phase:'menu'};resetPlace();render();

