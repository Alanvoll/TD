/* ---------- 0.34 Anton: both card halves are full actions (thread «Две полноценные половины карты») ----------
   Every card has a top ▲ and a bottom ▼ action; a card is played with one of them. ▼ is the old ▼ effect, no target to pick.
   Hand refills to living pets + 1 each turn. Cards left unplayed go to the discard at the end of planning and give their
   discard elements (shown apart on the card). Played halves only spend elements. ▲ and ▼ keep their own initiative.
   Mini card: grab the top part to play ▲, the bottom part to play ▼; tap opens the big card.
   Puzzles keep the old rules (HV() is false there). Bots and balance are untouched. */
function whyDnInfo(S,card){const c=card.pet?pet(S,card.pet):null;
  if(c&&!c.alive)return{ic:'💀',tx:'пал',long:c.n+' пал.'};
  if(!dnKey(card.t))return{ic:'✕',tx:'нет ▼',long:'У этой карты нет нижнего действия.'};
  return null}
const whyDn=(S,card)=>{const w=whyDnInfo(S,card);return w?w.long:null};
// the selected card is being aimed with its ▼ half
const isDnSel=()=>!!ui.sel&&ui.selDn===ui.sel;
const selT=card=>card&&isDnSel()&&card.uid===ui.sel?dnT(card.t):card?T[card.t]:null;
function planPush(S,card,o,dn){if(dn)S.plan.push({kind:'burn',card,...burnVal(S,card),...o});else S.plan.push({kind:'card',card,paid:payCard(S,card),...o})}
// discard elements: hollow icons on a dark band, never mixed with the solid cost icons
function gainHtml(S,card){const b=burnVal(S,card),g=b.g||{[b.el]:b.n};let h='';for(const k in g)for(let i=0;i<g[k];i++)h+=`<i class="ei gn ei-${k}" title="${ELN[k]||''}"></i>`;return h}
function dnCostHtml(d){return d&&d.cost?costHtml(d):''}

/* mini card: ▲ part on top, ▼ part below the line, discard band at the bottom */
const _cardHtmlZ=cardHtml;
cardHtml=function(card,mini){
  if(!HV())return _cardHtmlZ(card,mini);
  if(!mini)return bigCardHV(card);
  const isNew=ui.seen&&G.P.hand.includes(card)&&!ui.seen.has(card.uid);
  const S=G.P,t=T[card.t],c=card.pet?pet(S,card.pet):null,d=dnT(card.t);
  const pi=S.plan.findIndex(e=>e.card===card),pe=pi>=0?S.plan[pi]:null,inH=S.hand.includes(card);
  const cls=['card','mini','zc','hv'];if(isNew)cls.push('new');if(ui.sel===card.uid)cls.push(isDnSel()?'seld':'selu');
  if(pe)cls.push(pe.kind==='burn'?'pld':'plu');
  const wu=pe?null:whyInfo(S,card),wd=pe?null:whyDnInfo(S,card);if(wu)cls.push('disu');if(wd)cls.push('disd');
  const ci=cardIni(card.t),es=inH?ini({kind:'card',card,S}):ci,di=cardIniDn(card.t),ed=inH?ini({kind:'burn',card,S}):di;
  const sc=(v,b)=>v>b?'sdn':v<b?'sup':'';
  const tag=pe?`<span class="badge ${pe.kind==='burn'?'bd':''}">${pe.kind==='burn'?'▼':'▲'}${planNo(S).get(pe)||pi+1}</span>`:'';
  const zr0=(x,small)=>!x?'<span class="zt">—</span>':STEP.has(x.area)?`${zoneSvg('step',small?13:18)}${small?'':'<span class="zt">Шаг</span>'}`:x.only?'':(()=>{const m=zMain(x,c,card);return`${zoneSvg(x.area,small?13:18,x.reach)}${m?`<span class="zm">${m[0]}${m[1]}</span>`:''}`})();
  const zr=zr0,sti=x=>{const st=stOf(x);return st?`<span class="zst" title="Шаг ${MV[st.m].t}">${moveIcon(st.m)}</span>`:''},wst=(x,h)=>{const st=stOf(x);if(!st)return h||'<span></span>';return`<span class="zfw">${st.f?sti(x)+(h||''):(h||'')+sti(x)}</span>`};
  const fx=STEP.has(t.area)?[]:zFx(t,c),fxH=fx.length?`<span class="zfx">${fx[0]}${fx.length>1?'<i class="zmore">+'+(fx.length-1)+'</i>':''}</span>`:'';
  const dfx=d&&!STEP.has(d.area)?zFx(d,c):[],dfxH=dfx.length?`<span class="zfx">${dfx[0]}</span>`:'';
  return`<button class="${cls.join(' ')}" data-card="${card.uid}" style="--pc:${t.el?elVar(t.el):'var(--mut)'}" aria-label="${t.n}">
<span class="z1" data-half="u"><span class="zpet">${c?petIc(c,1):'👣'}</span><span class="zcost">${costHtml(t)}${hpNeedH(S,card)}</span></span>
<span class="z2" data-half="u"><span class="zz">${zr(t)}</span></span>
<span class="zu" data-half="u">${wst(t,fxH)}<span class="zi ${sc(es,ci)}">⏱${es}</span></span>
<span class="zg4"><span class="zgain">${gainHtml(S,card)}</span></span>
<span class="zv zlo" data-half="d">${wst(d,dfxH)}<span class="zi ${sc(ed,di)}">⏱${ed}</span></span>
<span class="zd zlo" data-half="d"><span class="zz">${zr(d)}</span></span>
<span class="zb zlo" data-half="d"><b class="zdn">▼</b><span class="zcost">${dnCostHtml(d)}</span></span>
${tag}${wu&&!wd?`<span class="why">${wu.ic}</span>`:''}</button>`};

/* big card (hand sheet, piles): both halves written out, discard band apart */
function bigCardHV(card){
  const S=G.P,t=T[card.t],c=card.pet?pet(S,card.pet):null,d=dnT(card.t);
  const pi=S.plan.findIndex(e=>e.card===card),pe=pi>=0?S.plan[pi]:null,inH=S.hand.includes(card);
  const cls=['card','bc','hv'];if(ui.sel===card.uid)cls.push(isDnSel()?'seld':'selu');if(pe)cls.push(pe.kind==='burn'?'pld':'plu');
  const wu=pe?null:whyInfo(S,card);if(wu)cls.push('disu');
  const ci=cardIni(card.t),es=inH?ini({kind:'card',card,S}):ci,di=cardIniDn(card.t),ed=inH?ini({kind:'burn',card,S}):di;
  const tag=pe?`<span class="badge ${pe.kind==='burn'?'bd':''}">${pe.kind==='burn'?'▼':'▲'}${planNo(S).get(pe)||pi+1}</span>`:'';
  const ic=c?petIc(c,1):'👣',ar=STEP.has(t.area)&&c?moveIcon(c.mv):shapeIcon(t.area);
  const fs=(base,len)=>t.n.length>len?`font-size:${Math.max(base-3,base*len/t.n.length).toFixed(1)}px`:'';
  const tx0=x=>!x?'—':x.dtx?x.dtx:x.only?'':STEP.has(x.area)?'Двигает любого своего пета по его схеме':effect(x,c,card);
  const tx=x=>withStep(tx0(x),stOf(x));
  return`<button class="${cls.join(' ')}" data-card="${card.uid}" style="--pc:${t.el?elVar(t.el):'var(--mut)'}">
<div class="bc-h" data-half="u"><span class="mc-spd">▲ ⏱${es}</span><span class="bc-cost">${costHtml(t)}${hpNeedH(S,card)}</span></div>
<div class="bc-art" data-half="u"><span class="bc-ic">${ic}</span><span class="bc-ar">${ar}</span>${wu?`<span class="bc-why">${wu.ic} ${wu.tx}</span>`:''}</div>
<div class="bc-nm" data-half="u" style="${fs(13,12)}">${t.n}</div>
<div class="bc-tx" data-half="u">${tx(t)}</div>
<div class="bc-g" title="Если карту не сыграть, в конце хода она уйдёт в сброс и даст эти стихии">${gainHtml(S,card)}</div>
<div class="bc-dn" data-half="d"><div class="bc-tx">${tx(d)}</div><div class="bc-dh">${d&&!STEP.has(d.area)?`<span class="bc-ar">${shapeIcon(d.area)}</span>`:'<span></span>'}<span class="bc-cost">${dnCostHtml(d)}</span><span class="dnspd">▼ ⏱${ed}</span></div></div>${tag}</button>`}

/* card window: ▲ and ▼ each with its own button */
const _cardModal0=cardModal;
cardModal=function(){
  if(!HV())return _cardModal0();
  const S=G.P,card=S.hand.find(c=>c.uid===ui.card);if(!card){ui.card=null;return''}
  const t=T[card.t],d=dnT(card.t),c=card.pet?pet(S,card.pet):null,pe=S.plan.find(e=>e.card===card);
  const wu=pe?null:whyNot(S,card),wd=pe?null:whyDn(S,card);
  const es=ini({kind:'card',card,S}),ed=ini({kind:'burn',card,S});
  const dsec=!d?'<div class="m">Нет нижнего действия.</div>':`${d.dtx?`<div>${d.dtx}</div>`:''}${stepLine(d.stp)}`;
  return`<div class="over" data-act="m-close"><div class="box bigcard" style="--pc:${t.el?elVar(t.el):'var(--mut)'}">
  <div class="c-top"><span style="font-size:15px;font-weight:600">${c?petIc(c,1)+' '+c.n+' · ':''}${t.n}</span></div>
  <div class="sec"><h4>▲ Верх <span class="spdp">⏱ ${es}</span> <span class="c-cost">${costHtml(t)}</span></h4>${wu?`<div class="mwhy">Верх сейчас нельзя: ${wu}</div>`:''}<div>${STEP.has(t.area)?'Двигает любого своего пета по его схеме.':cardTxt(t,c,card)}</div>${stepLine(t.stU)}${STEP.has(t.area)?'':silaHtml(t,c)}${hpNeedH(S,card,1)}${STEP.has(t.area)?'':`<div class="m">Цель: ${AREA[t.area]}.</div>${bigArea(t)}`}</div>
  <div class="sec"><h4>▼ Низ <span class="spdp">⏱ ${ed}</span> <span class="c-cost">${dnCostHtml(d)}</span></h4>${wd?`<div class="mwhy">${wd}</div>`:''}${dsec}</div>
  <div class="sec gsec"><h4>♻ Если не сыграть</h4><div>В конце хода карта уйдёт в сброс и даст: ${gainHtml(S,card)}</div></div>
  ${c&&petFx(c).length?`<div class="sec"><h4>Эффекты на ${c.n}</h4>${petFx(c).map(fxLine).join('')}</div>`:''}
  ${pe?'':'<div class="m" style="font-size:12px">Можно и перетащить: за верх карты сыграешь ▲, за низ ▼.</div>'}
  <div class="acts">${pe?`<button class="btn main" data-act="m-unplan">Вернуть в руку</button>`:`${wu?'':'<button class="btn main" data-act="m-play">▲ Сыграть верх</button>'}${wd?'':'<button class="btn main dnb" data-act="m-dn">▼ Сыграть низ</button>'}`}<button class="btn" data-act="m-close">Закрыть</button></div></div></div>`};
// «▼ Сыграть низ»: auto areas go straight to the plan, the rest wait for a tap on the field
document.addEventListener('click',e=>{const a=e.target.closest('[data-act="m-dn"]');if(!a||!G||G.phase!=='battle')return;
  const S=G.P,card=S.hand.find(c=>c.uid===ui.card);ui.card=null;if(!card||whyDn(S,card))return render();const d=dnT(card.t);ui.mover=null;ui.peek=null;ui.handOpen=false;
  planPush(S,card,{},1);ui.sel=null;ui.selDn=null;ui.msg=null;
  render()});
document.addEventListener('click',e=>{const a=e.target.closest('[data-act="m-play"]');if(a)ui.selDn=null},true);

if(typeof document!=='undefined'&&document.head&&document.head.insertAdjacentHTML)document.head.insertAdjacentHTML('beforeend',`<style>
.hand.mini>.card.mini.zc.hv{height:100px;grid-template-rows:12px 15px 11px 13px 11px 15px 12px;gap:1px;padding:2px 3px!important;overflow:hidden;background:linear-gradient(180deg,color-mix(in srgb,var(--pc) 22%,#1A2433) 0%,#18212E 38%,#18212E 62%,color-mix(in srgb,var(--pc) 22%,#1A2433) 100%)!important;box-shadow:inset 0 2px 0 color-mix(in srgb,var(--pc) 75%,transparent),inset 0 -2px 0 color-mix(in srgb,var(--pc) 75%,transparent)!important}
.zc.hv .zu,.zc.hv .zv{display:flex;align-items:center;overflow:hidden;justify-content:space-between;gap:2px;font-size:9px;font-weight:700;color:#C7CDD6}
.zc.hv .zz{display:flex;align-items:center;gap:1px;flex:none}
.zc.hv .z2,.zc.hv .zd{display:flex;align-items:center;justify-content:center;gap:2px;font-size:12px}.zc.hv .z2 .zm,.zc.hv .zd .zm{font-size:14px}
.zc.hv .zb{display:flex;align-items:center;justify-content:space-between;gap:2px}.zc.hv .zdn{color:#C9F2CF;font-size:11px}
.zc.hv .zg4{display:flex;align-items:center;justify-content:center;margin:0 -3px;background:#00000045;border-top:1px dashed #ffffff30;border-bottom:1px dashed #ffffff30}
.zc.hv .why{top:24%}
.zgain{display:flex;align-items:center;justify-content:center;gap:1px;color:#9AA3AE;font-size:9px}
.ei.gn{width:10px;height:10px;border-radius:50%;box-shadow:0 0 0 1px #EDEFF2aa;opacity:.85;transform:scale(.82);margin:0 1px}
.bc .ei.gn,.box .ei.gn{width:15px;height:15px;transform:none;margin:0 2px}
.zc.hv.disu .z1,.zc.hv.disu .z2,.bc.hv.disu .bc-h,.bc.hv.disu .bc-tx:first-of-type{opacity:.38}
.zc.hv.disd .zlo{opacity:.38}
.zc.hv.selu .z1,.zc.hv.selu .z2{box-shadow:inset 0 0 0 2px var(--gold)}
.zc.hv.seld .zlo{box-shadow:inset 0 0 0 2px #8EE8BE}
.card.hv.plu,.card.hv.pld{opacity:.55}
.badge.bd{background:#2E6B57}
.bc.hv .bc-dn{padding:3px 0 0;text-align:left}
.bc.hv .bc-dh{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:11px;margin-top:3px}.dnspd{font-weight:700;color:#C9F2CF;background:#0006;border-radius:7px;padding:0 4px;line-height:15px}
.bc.hv .bc-g{border-top:1px dashed #ffffff30;border-bottom:1px dashed #ffffff30;background:#00000045;margin:4px -6px 0;padding:3px 6px;display:flex;align-items:center;justify-content:center;gap:2px}
.box .gsec{background:#00000026;border-radius:10px;padding:8px}
.btn.dnb{background:#2E6B57;color:#EDEFF2}
</style>`);
