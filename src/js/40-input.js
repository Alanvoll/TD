/* ---------- player input ---------- */
function msg(t){ui.msg=t;render()}
function tapCard(uid){
  if(ui.busy||G.over)return;
  const c=G.P.hand.find(k=>k.uid===uid),e=c&&G.P.plan.find(x=>x.card===c);
  if(e&&e.kind==='burn'){unplan(c);ui.card=null;ui.info=null;ui.msg=null;return render()}
  ui.card=uid;ui.info=null;ui.msg=null;render();
}
function unplan(card){
  const S=G.P,pi=S.plan.findIndex(e=>e.card===card);if(pi<0)return;
  S.plan.splice(pi,1);
}
function bigArea(t){
  if(['enemies','allies','self','ally','step','summon'].includes(t.area))return'';
  const ar=Math.min(1,ROWS-1),ac=Math.floor(COLS/2);
  let on;
  if(t.area==='melee'){on=new Set(['0-'+ac]);for(let r=1;r<ROWS;r++)on.add('f'+r+'-'+ac)}
  else on=new Set(offCells(t.area,[ar,ac],null,null).map(([r,c])=>r+'-'+c));
  let h=`<div class="mgrid" style="grid-template-columns:repeat(${COLS},1fr)">`;
  const own=OWN.has(t.area);
  for(let i=0;i<ROWS;i++){const r=own?i:ROWS-1-i;for(let c=0;c<COLS;c++)h+=`<i class="${on.has(r+'-'+c)?(OWN.has(t.area)?'g':'b'):on.has('f'+r+'-'+c)?'bf':''}"></i>`}
  return h+`</div><div class="m" style="font-size:11px">${own?'Твоё поле, фронт вверху.':'Поле соперника, фронт внизу.'}${t.area==='melee'?' Выбираешь любой столбец: удар летит по нему от фронта и бьёт первого, кто встретится.':' Пример: карта брошена в центр.'}</div>`;
}
function cardModal(){
  const S=G.P,card=S.hand.find(c=>c.uid===ui.card);if(!card){ui.card=null;return''}
  const t=T[card.t],c=card.pet?pet(S,card.pet):null,bv=burnVal(S,card),pe=S.plan.find(e=>e.card===card),why=pe?null:whyNot(S,card);
  const subTxt=`+${bv.n} ${ELN[bv.el].toLowerCase()}${EI(bv.el)}${t.sub?'. '+t.sub.txt:''}`;
  const btn=pe?`<button class="btn" data-act="m-unplan">${pe.kind==='burn'?'Вернуть карту в руку':'Убрать из плана'}</button>`:`<button class="btn" data-act="m-burn">▼ Вниз: +${bv.n} ${ELN[bv.el].toLowerCase()}</button>`;
  return`<div class="over" data-act="m-close"><div class="box bigcard" style="--pc:${t.el?elVar(t.el):'var(--mut)'}">
  <div class="c-top"><span style="font-size:15px;font-weight:600">${c?petIc(c,1)+' '+c.n+' · ':''}${t.n}</span><span class="c-cost">${costHtml(t)}</span></div>
  ${why?`<div class="mwhy">Сейчас нельзя сыграть: ${why}</div>`:''}
  <div class="sec"><h4>▲ Верх <span class="spdp">⏱ ${cardIni(card.t)}</span>${(()=>{const es=ini({kind:'card',card,S}),b=cardIni(card.t);return es!==b?` <span class="spdp ${es>b?'sdn':'sup'}">сейчас ⏱ ${es}</span>`:''})()}</h4><div>${cardTxt(t,c,card)}</div>${silaHtml(t,c)}${hpNeedH(S,card,1)}<div class="m">Цель: ${AREA[t.area]}.</div>${bigArea(t)}</div>
  <div class="sec"><h4>▼ Низ <span class="spdp">⏱ ${cardIniDn(card.t)}</span></h4><div>${subTxt}</div></div>
  ${c&&petFx(c).length?`<div class="sec"><h4>Эффекты на ${c.n}</h4>${petFx(c).map(fxLine).join('')}</div>`:''}
  ${why||pe?'':AUTO.has(t.area)?'<div class="m" style="font-size:12px">Перетащи карту на поле или нажми «▲ Сыграть»: цель выбирать не нужно.</div>':'<div class="m" style="font-size:12px">Перетащи карту на поле или нажми «▲ Сыграть» и тапни клетку.</div>'}
  <div class="acts">${why||pe?'':'<button class="btn main" data-act="m-play">▲ Сыграть</button>'}${btn}<button class="btn${why||pe?' main':''}" data-act="m-close">Закрыть</button></div></div></div>`;
}
function tapCell(side,r,c){
  if(!ui.sel&&!ui.mover&&!ui.stepE){const S=side==='p'?G.P:G.B,pp=petAt(S,r,c);
    if(pp){ui.info=ui.info&&ui.info.id===pp.id?null:{side,id:pp.id};ui.msg=null;ui.peek=null;render();return}}
  ui.info=null;
  if(ui.busy||G.over)return;
  if(ui.stepE){stepTap(side,r,c);return}
  const S=G.P,p=side==='p'?petAt(S,r,c):null;
  const card=ui.sel?S.hand.find(x=>x.uid===ui.sel):null;
  const t=card?selT(card):null,dn=isDnSel();
  if(card&&OFF.has(t.area)){
    if(side!=='b')return;
    planPush(S,card,{cell:[r,c]},dn);ui.sel=null;ui.selDn=null;ui.msg=null;render();return;
  }
  if(card&&OWN.has(t.area)){
    if(side!=='p')return;
    planPush(S,card,{cell:[r,c]},dn);ui.sel=null;ui.selDn=null;ui.msg=null;render();return;
  }
  if(card&&t.area==='ally'){
    if(!p)return;
    planPush(S,card,{petT:p.id},dn);ui.sel=null;ui.selDn=null;ui.msg=null;render();return;
  }
  const moveKind=card&&STEP.has(t.area)?t.area:null;
  if(!moveKind||side!=='p')return;
  if(ui.mover){
    const [pr,pc]=projPos(S,ui.mover);
    const d=dirsFor(pet(S,ui.mover),curStep()).find(d=>pr+d[0]===r&&pc+d[1]===c);
    if(d){
      planPush(S,card,{petT:ui.mover,dir:d},dn);
      ui.sel=null;ui.selDn=null;ui.mover=null;ui.msg=null;render();return;
    }
  }
  if(p&&!noMove(p)){
    const q=S.pets.find(x=>{const[a,b]=projPos(S,x.id);return x.alive&&a===r&&b===c});
    ui.mover=(q||p).id;ui.msg=null;render();return;
  }
  ui.mover=null;render();
}

