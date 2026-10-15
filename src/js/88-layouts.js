/* ---------- 0.37.0 Anton (thread «Варианты экрана боя»): battle-screen layouts to try, switched in the menu
   (main menu «Вид экрана боя» and the battle «Опции» window). Only the look and the controls change: card size, where things sit,
   how a card is read and played. Rules, bots and balance are untouched. «Как сейчас» stays the default.
   The battle screen markup is reshaped here just before it is drawn (setApp), so the rest of the code keeps working as is. ---------- */
// 0.38.0 Anton: the battle screen never scrolls, hand cards a bit larger and in ONE row; «Лупа» is not a variant any more but how every card behaves.
// So the variants with several rows of cards (Крупная рука, Список, Сетка карт) and «Лупа» left the list (their code below stays unused).
const LAYS=[
 {k:'fan',ic:'🃏',n:'Веер (обычный)',d:'Карты веером с лёгким наклоном. Тап поднимает карту целиком, второй тап опускает её обратно, долгое нажатие показывает её крупно. Тянуть можно любую.'},
 {k:'base',ic:'▦',n:'Ровный ряд',d:'Как было раньше: карты ровным рядом, тап открывает руку.'},
 {k:'tap',ic:'👆',n:'Тап вместо перетаскивания',d:'Тап по карте: под рукой панель с полным текстом, цели на поле подсвечены. Тапни цель или нажми «Сыграть». Поле не закрывается.'},
 {k:'focus',ic:'🎯',n:'Карта в фокусе',d:'Одна карта крупно с полным текстом, под ней значки остальных. Тап по значку переносит карту в фокус.'},
 {k:'drawer',ic:'🗂',n:'Нижняя шторка',d:'Тап по руке открывает низкую шторку с крупными картами в ряд, поле остаётся видно. Карту тянешь прямо из шторки.'},
 {k:'thumb',ic:'🤚',n:'Одной рукой',d:'Все кнопки внизу под большим пальцем, сверху только поле. «В бой» самая крупная.'},
 {k:'plan',ic:'⏩',n:'План полосой',d:'Сыгранная карта уходит из руки в полосу «Ход» и встаёт по порядку срабатывания.'},
];
const LAYK=new Set(LAYS.map(l=>l.k));
// 0.38.4 Anton: the fan is the usual hand now, so the choice is kept under a new key (old saved «Как сейчас» → fan)
let LAY=(()=>{try{const v=localStorage.getItem('pb-lay2');return LAYK.has(v)?v:'fan'}catch(e){return'fan'}})();
const layOf=k=>LAYS.find(l=>l.k===k)||LAYS[0];
// a layout is drawn only in a normal battle (puzzles keep the old card rules and the old screen)
const layOn=()=>LAY!=='base'&&typeof G!=='undefined'&&G&&G.phase==='battle'&&!!G.P&&HV();
const layIdle=()=>!ui.busy&&!G.over;
// cards whose halves are tapped to pick them (instead of opening the hand window)
const LAY_HALFTAP=new Set(['tap','list','focus','grid']);

/* ----- shared bits ----- */
function layFrag(h){const t=document.createElement('template');t.innerHTML=h;return t.content}
function layCard(uid){return G.P.hand.find(c=>c.uid===uid)}
function layClear(){ui.lh=null;ui.sel=null;ui.selDn=null;ui.msg=null}
const layAuto=(card,dn)=>dn||AUTO.has(T[card.t].area);
// wide card: ▲ on the left, the discard band in the middle, ▼ on the right (list rows, focus card, tap panel)
function wideCard(card,big){
  const S=G.P,t=T[card.t],d=dnT(card.t),c=card.pet?pet(S,card.pet):null;
  const pi=S.plan.findIndex(e=>e.card===card),pe=pi>=0?S.plan[pi]:null;
  const cls=['card','lw'];if(big)cls.push('lwb');if(pe)cls.push(pe.kind==='burn'?'pld':'plu');
  const wu=pe?null:whyInfo(S,card),wd=pe?null:whyDnInfo(S,card);if(wu)cls.push('disu');if(wd)cls.push('disd');
  if(ui.lh&&ui.lh.uid===card.uid)cls.push(ui.lh.dn?'lhd':'lhu');else if(ui.sel===card.uid)cls.push(isDnSel()?'lhd':'lhu');
  const ci=cardIni(card.t),es=ini({kind:'card',card,S}),di=cardIniDn(card.t),ed=ini({kind:'burn',card,S});
  const sc=(v,b)=>v>b?'sdn':v<b?'sup':'';
  const tx0=x=>!x?'—':x.dtx?x.dtx:x.only?'':STEP.has(x.area)?'Двигает любого своего пета по его схеме':effect(x,c,card);
  const tx=x=>withStep(tx0(x),stOf(x))||'—';
  const zn=x=>x&&!STEP.has(x.area)&&!x.only?zoneSvg(x.area,big?20:16,x.reach):'';
  const tag=pe?`<span class="badge ${pe.kind==='burn'?'bd':''}">${pe.kind==='burn'?'▼':'▲'}${planNo(S).get(pe)||pi+1}</span>`:'';
  return`<button class="${cls.join(' ')}" data-card="${card.uid}" style="--pc:${t.el?elVar(t.el):'var(--mut)'}" aria-label="${t.n}">
<span class="lw-u" data-half="u"><span class="lw-h"><span class="lw-pet">${c?petIc(c,1):'👣'}</span><b class="lw-nm">${t.n}</b><span class="lw-cost">${costHtml(t)}${hpNeedH(S,card)}</span><span class="zi ${sc(es,ci)}">▲⏱${es}</span></span>
<span class="lw-tx">${zn(t)}<span>${wu?`<i class="lw-why">${wu.ic} ${wu.tx}</i> `:''}${tx(t)}</span></span></span>
<span class="lw-g" title="Если не сыграть, даст эти стихии">${gainHtml(S,card)}</span>
<span class="lw-d" data-half="d"><span class="lw-h"><b class="zdn">▼</b><span class="lw-cost">${dnCostHtml(d)}</span><span class="zi ${sc(ed,di)}">⏱${ed}</span></span>
<span class="lw-tx">${zn(d)}<span>${wd?`<i class="lw-why">${wd.ic} ${wd.tx}</i> `:''}${tx(d)}</span></span></span>${tag}</button>`}

// tap on a half: first tap picks it (targets light up), a target tap or a second tap on the same half plays it, tap on a planned card returns it
function halfTap(card,dn){
  const S=G.P,pe=S.plan.find(x=>x.card===card);
  if(pe){unplan(card);layClear();return render()}
  const why=dn?whyDn(S,card):whyNot(S,card);
  if(why){layClear();ui.lh={uid:card.uid,dn,why};return render()}
  const auto=layAuto(card,dn);
  if(ui.lh&&ui.lh.uid===card.uid&&ui.lh.dn===dn){if(auto){planPush(S,card,{},dn?1:0);layClear();return render()}layClear();return render()}
  ui.lh={uid:card.uid,dn};ui.card=null;ui.handOpen=false;ui.mover=null;ui.peek=null;ui.msg=null;ui.info=null;
  if(auto){ui.sel=null;ui.selDn=null}else{ui.sel=card.uid;ui.selDn=null}
  render()}
function layOk(){const card=ui.lh&&layCard(ui.lh.uid);if(!card)return;const dn=ui.lh.dn;
  if(layAuto(card,dn)&&!(dn?whyDn(G.P,card):whyNot(G.P,card))){planPush(G.P,card,{},dn?1:0);layClear()}render()}
// the line that says what the picked half will do and how to play it
function layConfHtml(){const lh=ui.lh,card=lh&&layCard(lh.uid);if(!card)return'';const t=lh.dn?dnT(card.t):T[card.t],nm=`${lh.dn?'▼':'▲'} «${T[card.t].n}»`;
  if(lh.why)return`<div class="lconf"><span>${nm}: <span class="lbad">${lh.why}</span></span><button class="pill" data-act="lay-x" aria-label="Отмена">✕</button></div>`;
  if(layAuto(card,lh.dn))return`<div class="lconf"><span>${nm}: подсвечено, на кого сработает.</span><button class="btn main ${lh.dn?'dnb':''}" data-act="lay-ok">${lh.dn?'▼':'▲'} Сыграть</button><button class="pill" data-act="lay-x" aria-label="Отмена">✕</button></div>`;
  return`<div class="lconf"><span>${nm}: тапни цель на поле${t.area==='ally'?' (своё существо)':''}.</span><button class="pill" data-act="lay-x" aria-label="Отмена">✕</button></div>`}
// light the cells an auto half will hit
function layPaint(f){const lh=ui.lh,card=lh&&!lh.why&&layCard(lh.uid);if(!card||!layAuto(card,lh.dn))return;
  let list=[];try{list=dragCells({uid:card.uid,dn:lh.dn},null)}catch(e){}
  for(const[s,r,c,m]of list){const q=s==='b'?petAt(G.B,r,c):petAt(G.P,r,c),el=f.querySelector(`[data-cell="${s},${q&&q.sz?q.r:r},${q&&q.sz?q.c:c}"]`)||f.querySelector(`[data-cell="${s},${r},${c}"]`);if(el)el.classList.add(m?'prev2':'prev')}}
function layMark(f){const lh=ui.lh;if(!lh)return;const el=f.querySelector(`.hand [data-card="${lh.uid}"],.lfoc [data-card="${lh.uid}"]`);if(el)el.classList.add(lh.dn?'lhd':'lhu')}

/* ----- the reshaping itself ----- */
function layTx(f){
  const S=G.P,kids=[...f.children],board=kids.find(e=>e.classList.contains('board')),bi=kids.indexOf(board);
  for(const b of kids)if(b.classList.contains('side-bar'))b.classList.add(b.querySelector('.piles')?'sb-piles':kids.indexOf(b)<bi?'sb-opp':'sb-el');
  const hand=f.querySelector('.hand.mini'),acts=kids.find(e=>e.classList.contains('acts')),bact=kids.find(e=>e.classList.contains('bact'));
  // forget a picked half that is no longer pickable
  if(ui.lh){const c=layCard(ui.lh.uid);if(!c||!layIdle()||!LAY_HALFTAP.has(LAY)||S.plan.some(e=>e.card===c)||(!ui.lh.why&&!layAuto(c,ui.lh.dn)&&ui.sel!==ui.lh.uid))ui.lh=null}
  const cardsOf=()=>hand?[...hand.querySelectorAll(':scope>[data-card]')].map(e=>layCard(e.dataset.card)).filter(Boolean):[];
  const after=(ref,node)=>ref&&ref.parentNode.insertBefore(node,ref.nextSibling);
  const L=LAY;
  if(L==='big'&&hand){const n=hand.children.length;hand.classList.remove('scr');hand.classList.add('lybig');hand.style.setProperty('--cols',Math.max(2,Math.ceil(n/2)))}
  if(L==='fan'&&hand){const els=[...hand.children],n=els.length,m=(n-1)/2;
    hand.classList.add('lfan');hand.style.setProperty('--ov',n>1?`calc((100% - 46px - ${n}*var(--fw))/${n-1})`:'0px');
    els.forEach((e,i)=>{const up=e.dataset.card===ui.lfan&&!['pl','burned','plu','pld'].some(x=>e.classList.contains(x));e.style.setProperty('--r',(up?0:(i-m)*2.5)+'deg');e.style.setProperty('--y',(up?-22:Math.abs(i-m)*Math.abs(i-m)*1.6)+'px');e.style.setProperty('--s',up?1.3:1);e.style.zIndex=up?30:i+1;if(up)e.classList.add('lup');layPlayed(e,up)})}
  if((L==='list'||L==='grid')&&hand){const cs=cardsOf();hand.classList.remove('scr');hand.classList.add(L==='list'?'lwl':'lgr');
    hand.innerHTML=cs.map(c=>L==='list'?wideCard(c):cardHtml(c)).join('');
    // grid: the creature icon moves next to the name, the big art row goes, so three cards fit in a row and two rows on screen
    if(L==='grid')for(const k of hand.children){const art=k.querySelector('.bc-art'),nm=k.querySelector('.bc-nm');if(!art||!nm)continue;
      const ic=art.querySelector('.bc-ic'),why=art.querySelector('.bc-why');if(ic)nm.prepend(ic);if(why)nm.after(why);art.remove()}
    layMark(f)}
  if(L==='focus'&&hand){const cs=cardsOf();hand.classList.add('lth');
    if(!cs.some(c=>c.uid===ui.lfoc))ui.lfoc=(cs.find(c=>!S.plan.some(e=>e.card===c))||cs[0]||{}).uid;
    const fc=cs.find(c=>c.uid===ui.lfoc);for(const e of hand.children)if(e.dataset.card===ui.lfoc)e.classList.add('lsel');
    if(fc){const w=document.createElement('div');w.className='lfoc';w.innerHTML=wideCard(fc,1);hand.parentNode.insertBefore(w,hand)}layMark(f)}
  if(L==='tap'&&hand&&layIdle()){layMark(f);const lh=ui.lh,card=lh&&layCard(lh.uid);
    if(card){const S2=G.P,wu=whyNot(S2,card),wd=whyDn(S2,card),t=lh.dn?dnT(card.t):T[card.t],auto=layAuto(card,lh.dn);
      const p=document.createElement('div');p.className='lpanel';
      p.innerHTML=`<div class="lfoc">${wideCard(card,1)}</div><div class="lp-acts"><button class="btn ${!lh.dn?'on':''}" data-act="lay-hu" ${wu?'disabled':''}>▲ Верх</button><button class="btn ${lh.dn?'on':''}" data-act="lay-hd" ${wd?'disabled':''}>▼ Низ</button>${lh.why?'':auto?`<button class="btn main ${lh.dn?'dnb':''}" data-act="lay-ok">Сыграть</button>`:'<span class="lp-hint">Тапни цель на поле</span>'}<button class="pill" data-act="lay-x" aria-label="Закрыть">✕</button></div>${lh.why?`<div class="lbad">${lh.why}</div>`:''}`;
      after(hand,p)}}
  if((L==='list'||L==='grid'||L==='focus')&&hand&&layIdle()&&ui.lh){const x=layFrag(layConfHtml());after(hand,x.firstElementChild||document.createTextNode(''))}
  if(LAY_HALFTAP.has(L))layPaint(f);
  if(L==='plan'&&hand&&layIdle()){const front=kids.find(e=>e.classList.contains('front')),no=planNo(S),pf=G.turn%2===1;
    const pl=[...hand.querySelectorAll(':scope>[data-card]')].map(e=>({e,pe:S.plan.find(x=>x.card&&x.card.uid===e.dataset.card)})).filter(x=>x.pe);
    pl.sort((a,b)=>(no.get(a.pe)||0)-(no.get(b.pe)||0));
    const row=document.createElement('div');row.className='lplan';
    row.innerHTML=`<div class="lp-hd"><b>Ход</b><span class="qpri ${pf?'me':'op'}">⚑ ${pf?'ты':'враг'} первый</span><span class="m">${pl.length?'по порядку срабатывания, тап вернёт':'сыгранные карты встанут сюда по порядку'}</span></div>`;
    const strip=document.createElement('div');strip.className='hand mini lpl';for(const x of pl)strip.appendChild(x.e);row.appendChild(strip);
    if(front)front.replaceWith(row);else if(hand.previousElementSibling)hand.parentNode.insertBefore(row,hand.previousElementSibling)}
  // tall hands: Авто / Совет / speed and «Отменить план» shrink to icons in the «В бой» row, so the hand fits without scrolling
  if(['list','grid','focus','tap'].includes(L)&&acts&&bact){const clr=acts.querySelector('[data-act="clear"]');
    for(const b of [...bact.querySelectorAll('.pill[data-act]')].reverse()){const a=b.dataset.act;b.classList.add('lic');b.title=a==='autoplay'?'Авто':a==='advice'?'Совет':'Темп';b.textContent=b.textContent.replace(/Авто|Совет/g,'').trim();acts.insertBefore(b,acts.firstChild)}
    if(clr){clr.classList.add('lic');clr.title='Отмена';clr.setAttribute('aria-label','Отменить план');clr.textContent='↺';acts.insertBefore(clr,acts.querySelector('.btn.main'))}
    bact.remove()}
  if(L==='thumb'){const top=kids.find(e=>e.classList.contains('top')),tb=document.createElement('div');tb.className='ltool';
    const lab={fxs:'Эффекты',hint:'Помощь',log:'Журнал',settings:'Опции',fs:'Экран',autoplay:'Авто',advice:'Совет',bspd:'Темп'};
    const mv=[...(top?top.querySelectorAll('.pill[data-act]'):[]),...(bact?bact.querySelectorAll('.pill[data-act]'):[])];
    for(const b of mv){const a=b.dataset.act,ic=b.textContent.replace(/Авто|Совет|✓/g,'').trim();b.innerHTML=`<span>${ic}${a==='autoplay'&&ui.auto?' ✓':''}</span><small>${lab[a]||''}</small>`;tb.appendChild(b)}
    if(top){const sp=top.lastElementChild;if(sp&&!sp.children.length)sp.remove()}
    if(bact)bact.replaceWith(tb);else if(acts)acts.parentNode.insertBefore(tb,acts);
    const el=kids.find(e=>e.classList.contains('sb-el'));if(el)el.classList.add('lbot')}
}

/* 0.39.6 Anton: a played card must look played — it sinks lower, goes grey, and a stamp on the played half says ▲/▼ and its number */
function layPlayed(e,up){const k=e.classList;if(!['pl','burned','plu','pld'].some(x=>k.contains(x)))return;
  const dn=k.contains('burned')||k.contains('pld'),b=e.querySelector('.badge'),no=b?b.textContent.replace(/[▲▼]/g,''):'';
  // 0.41.10 Anton: a played card is never raised; it shrinks toward its bottom edge (so it never covers the buttons), and a small button takes the play back
  e.classList.add('lpd');e.style.setProperty('--s',.8);
  const st=document.createElement('div');st.className='lpst '+(dn?'d':'u');st.innerHTML=`<b>${dn?'▼':'▲'}${no}</b><span>сыграна</span>`;e.appendChild(st);
  const ub=document.createElement('span');ub.className='lpun';ub.setAttribute('role','button');ub.setAttribute('aria-label','Отменить ход этой картой');ub.innerHTML='<b>↺</b><span>отмена</span>';e.appendChild(ub)}

/* ----- the switcher ----- */
function layPickHtml(){return`<div class="over lay-over" data-act="lay-close"><div class="box"><div class="boxhd"><h2>Вид экрана боя</h2></div>
  <div class="m" style="font-size:12px;margin-bottom:6px">Меняются только экран и управление, правила те же. Выбор запоминается. В задачах всегда обычный вид.</div>
  <div class="laylist">${LAYS.map(l=>`<button class="layi ${l.k===LAY?'on':''}" data-act="lay-set" data-lay="${l.k}"><span class="layic">${l.ic}</span><span><b>${l.n}${l.k===LAY?' ✓':''}</b><span class="m">${l.d}</span></span></button>`).join('')}</div>
  <button class="btn main" data-act="lay-close">Готово</button></div></div>`}
const _setAppLay=setApp;
setApp=function(h){
  const ph=typeof G!=='undefined'&&G?G.phase:null,on=layOn();
  if(on)document.body.dataset.lay=LAY;else delete document.body.dataset.lay;
  if(!on&&ph!=='menu'&&ph!=='battle'&&!ui.layPick){layFit(false);return _setAppLay(h)}
  const f=layFrag(h);
  try{
    if(ph==='battle')layTop(f);
    if(on)layTx(f);
    if(ph==='battle'){layTurn(f);for(const el of f.querySelectorAll('.card.hv[data-card]'))layWhy(el)}
    if(ph==='menu'){const mn=f.querySelector('.menu');if(mn)mn.appendChild(layFrag(`<button class="mi" data-act="lay-open"><span class="mic">🎛</span><span><b>Вид экрана боя</b><span class="m">Сейчас: ${layOf(LAY).n}. Ещё ${LAYS.length-1} вариантов раскладки, карт и управления.</span></span></button>`))}
    if(ph==='battle'){const sb=f.querySelector('.over[data-act="set-close"] .box');if(sb){const h2=sb.querySelector('h2');const x=layFrag(`<button class="btn lay-setb" data-act="lay-open">🎛 Вид экрана: ${layOf(LAY).n}</button>`);if(h2&&h2.nextElementSibling)sb.insertBefore(x,h2.nextElementSibling.nextSibling);else sb.appendChild(x)}}
    if(ui.layPick)f.appendChild(layFrag(layPickHtml()));
  }catch(e){console.error(e)}
  morphKids(app,[...f.childNodes],4);
  // a board patched only through its cells' classes loses its perspective fit (no new nodes for the fit watcher): refit it here
  if(ph==='battle'&&typeof fitBoard==='function')for(const b of document.querySelectorAll('.board'))if(!b.dataset.fit){b.dataset.fit=1;fitBoard();break}
  layFit(ph==='battle')};

/* ----- 0.38.7 Anton: the top-right buttons fold into one «Меню» button; the «Ход N / первым ходит …» title goes,
   «Ход N» moves onto the centre line ----- */
const LMENU={fxs:'Эффекты',hint:'Помощь',log:'Журнал',settings:'Опции',fs:'Весь экран'};
let layTurnTxt='';
function layTop(f){const top=f.querySelector('.top');if(!top)return;const ttl=top.querySelector('.title');
  layTurnTxt=ttl&&ttl.firstChild&&ttl.firstChild.nodeType===3?ttl.firstChild.textContent.trim():'';if(ttl)ttl.remove();
  const bs=[...top.querySelectorAll('.pill[data-act]')];if(!bs.length)return;
  const wrap=bs[0].parentElement;
  const mb=layFrag(`<button class="pill lmenu-b${ui.lmenu?' on':''}" data-act="lay-menu" aria-label="Меню">☰ Меню</button>`);
  if(ui.lmenu){const pop=document.createElement('div');pop.className='lmenu-pop';
    for(const b of bs){const l=LMENU[b.dataset.act]||b.title||'';b.classList.add('lmi');b.removeAttribute('title');if(l)b.appendChild(layFrag(`<span class="lmi-l">${l}</span>`));pop.appendChild(b)}
    const ov=layFrag('<div class="lmenu-over" data-act="lay-menu-x"></div>');ov.firstChild.appendChild(pop);f.appendChild(ov)}
  else bs.forEach(b=>b.remove());
  if(wrap&&wrap!==top)wrap.replaceWith(mb);else top.appendChild(mb)}
/* 0.38.7 Anton: a half that can't be played is darkened (not faded) and says what is missing, on mini and big cards */
function layWhy(el,cd){if(typeof G==='undefined'||!G||!G.P||!HV())return;const card=cd||G.P.hand.find(c=>c.uid===el.dataset.card);if(!card)return;
  if(G.P.plan.some(x=>x.card===card))return;
  const lab=(w,k)=>{const d=document.createElement('div');d.className='lxo '+k;d.innerHTML=`<span class="lxi">${w.ic||''}</span><span class="lxt">${w.tx}</span>`;return d};
  const wu=whyInfo(G.P,card),wd=whyDnInfo(G.P,card);
  el.classList.toggle('disu',!!wu);el.classList.toggle('disd',!!wd);el.classList.remove('dis');
  for(const o of el.querySelectorAll('.lxo,.why,.bc-why'))o.remove();
  if(el.classList.contains('zc')){if(wu)el.appendChild(lab(wu,'u'));if(wd)el.appendChild(lab(wd,'d'))}
  else{const a=el.querySelector('.bc-art'),dn=el.querySelector('.bc-dn');if(wu&&a)a.appendChild(lab(wu,'u'));if(wd&&dn)dn.appendChild(lab(wd,'d'))}}
function layTurn(f){if(!layTurnTxt)return;const t=layFrag(`<span class="lturn">${layTurnTxt}</span>`);
  const fr=f.querySelector('.front .qs')||f.querySelector('.front')||f.querySelector('.lplan .lp-hd');if(fr)fr.insertBefore(t,fr.firstChild)}

/* ----- 0.38.0: the battle screen fits the phone screen and never scrolls -----
   Larger hand cards when there is room; when there is not: normal cards, then a smaller board, then tighter gaps. */
function layOver(){const r=app.getBoundingClientRect(),pb=parseFloat(getComputedStyle(document.body).paddingBottom)||0;return Math.ceil(r.bottom+pb-innerHeight)}
// 0.41.10: the fit is searched again only when the screen size or the set of rows changed (or it no longer fits);
// otherwise every draw kept re-measuring the whole screen a dozen times, which made the battle lag on short phones
let layFitK='',layFitN=0;
function layFit(on){const B=document.body;
  if(!on){layFitK='';if(B.dataset.bfit){delete B.dataset.bfit;delete B.dataset.hcl;delete B.dataset.tight;B.style.removeProperty('--bw');B.style.removeProperty('--hz')}return}
  const hd=app.querySelector('.hand.mini'),k=[innerWidth,innerHeight,typeof TN!=='undefined'?TN:5,LAY,hd?hd.children.length:0,[...app.children].map(e=>e.className).filter(c=>!/^(over|toast|detail)\b|\bnt-tip\b/.test(c)).join('|')].join('/');
  if(k===layFitK&&B.dataset.bfit&&layOver()<=0)return;
  layFitK=k;layFitN++;{const hz=app.querySelector('.hand.mini');if(hz)hz.style.zoom=''}
  B.dataset.bfit=1;delete B.dataset.tight;B.style.removeProperty('--hz');B.dataset.tn=typeof TN!=='undefined'?TN:5;
  const bd=app.querySelector('.board'),refit=()=>{if(bd&&typeof fitBoard==='function')fitBoard()};
  // shrink the board (down to minW % of the width) until the screen fits; true when it does
  const squeeze=minW=>{let o=layOver();if(o<=0)return true;if(!bd)return false;const h=bd.getBoundingClientRect().height;if(!(h>0))return false;
    // the tilted board's height shrinks a bit slower than its width, so step down until it fits
    let w=Math.floor(100*(h-o-2)/h);for(let k=0;k<6;k++){if(w<minW)return false;B.style.setProperty('--bw',w+'%');refit();o=layOver();if(o<=0)return true;w-=Math.max(2,Math.ceil(100*o/h))}return false};
  // larger cards first: 150 px, then 126 px, then the usual size; the board gives way down to 78 % before the cards shrink
  // 0.38.6 Anton: the fan overlaps cards, so they can be bigger still: an extra 182 px size, and the board may give way a little more
  const fan=LAY==='fan'&&layOn(),minW=fan?66:78;
  // 0.41.11 Anton: on a small phone the cards get smaller first and the board keeps its full width; it gives way only with the smallest cards
  if(innerHeight<=700){delete B.dataset.hcl;B.style.removeProperty('--bw');for(const z of [1,.92,.85,.8]){if(z<1)B.style.setProperty('--hz',z);refit();if(layOver()<=0)return}
    if(squeeze(minW))return;B.dataset.tight=1;B.style.removeProperty('--bw');refit();squeeze(55);return}
  for(const t of fan?['xl','l','m','']:['l','m',''])
    {if(t)B.dataset.hcl=t;else delete B.dataset.hcl;B.style.removeProperty('--bw');refit();if(squeeze(minW))return}
  B.dataset.tight=1;B.style.removeProperty('--bw');refit();squeeze(55)}
if(typeof addEventListener==='function')addEventListener('resize',()=>{if(typeof G!=='undefined'&&G&&G.phase==='battle')requestAnimationFrame(()=>layFit(true))});

/* ----- input ----- */
document.addEventListener('click',e=>{
  // a pick in the «Меню» list closes the list; the button's own action still runs
  if(ui.lmenu&&e.target.closest&&e.target.closest('.lmenu-pop [data-act]')){ui.lmenu=false;requestAnimationFrame(()=>render())}
  const a=e.target.closest&&e.target.closest('[data-act^="lay-"]');
  // night 159: a pick inside the list sits under the list's backdrop (lay-menu-x); let it through to its own action instead of eating it here
  if(a&&a.dataset.act==='lay-menu-x'&&e.target!==a)return;
  if(a){const act=a.dataset.act;e.stopPropagation();e.preventDefault();
    if(act==='lay-open'){ui.set=false;ui.layPick=true;return render()}
    if(act==='lay-menu'){ui.lmenu=!ui.lmenu;return render()}
    if(act==='lay-menu-x'){if(e.target===a){ui.lmenu=false;render()}return}
    if(act==='lay-close'){if(e.target===a||a.tagName==='BUTTON'){ui.layPick=false;render()}return}
    if(act==='lay-set'){LAY=a.dataset.lay;try{localStorage.setItem('pb-lay2',LAY)}catch(_){}ui.layPick=false;ui.lh=null;ui.lfan=null;ui.lfoc=null;ui.handOpen=false;
      if(typeof G!=='undefined'&&G&&G.phase==='battle'&&ui.sel)ui.sel=null;ui.toast='Вид экрана: '+layOf(LAY).n;ui.toastT=Date.now();return render()}
    if(!G||G.phase!=='battle'||!layIdle())return;
    if(act==='lay-x'){layClear();return render()}
    if(act==='lay-ok')return layOk();
    if(act==='lay-hu'||act==='lay-hd'){const card=ui.lh&&layCard(ui.lh.uid);if(!card)return;const dn=act==='lay-hd';if(ui.lh.dn===dn&&!ui.lh.why)return;ui.lh=null;ui.sel=null;return halfTap(card,dn)}
    return}
  // 0.38.7 Anton: a tap on a card already played this turn takes it back (every view, flat row too)
  if(typeof G!=='undefined'&&G&&G.phase==='battle'&&G.P&&HV()&&!ui.busy&&!G.over&&!ui.stepE&&Date.now()-suppress>=400){
    const c0=e.target.closest&&e.target.closest('.hand.mini [data-card]');
    if(c0&&!c0.closest('.over,.hsheet')){const cd=layCard(c0.dataset.card);if(cd&&G.P.plan.some(x=>x.card===cd)){e.stopPropagation();e.preventDefault();unplan(cd);layClear();ui.lfan=null;return render()}}}
  if(!layOn()||!layIdle()||ui.stepE||Date.now()-suppress<400)return;
  const c=e.target.closest&&e.target.closest('[data-card]');if(!c||c.closest('.over,.hsheet'))return;
  const card=layCard(c.dataset.card);if(!card)return;
  const inHand=!!c.closest('.hand.mini:not(.lpl)');
  // tap: the mini card picks its ▲ (or ▼ if ▲ can't be played); the panel card's halves pick themselves
  if(LAY==='tap'&&inHand){e.stopPropagation();const pe=G.P.plan.find(x=>x.card===card);if(pe){unplan(card);layClear();return render()}
    if(ui.lh&&ui.lh.uid===card.uid){layClear();return render()}
    ui.lh=null;ui.sel=null;return halfTap(card,!!whyNot(G.P,card)&&!whyDn(G.P,card))}
  if(LAY==='focus'&&inHand){e.stopPropagation();if(ui.lfoc!==card.uid){ui.lfoc=card.uid;layClear();return render()}
    const pe=G.P.plan.find(x=>x.card===card);if(pe){unplan(card);layClear();return render()}return}
  if(LAY_HALFTAP.has(LAY)&&(c.closest('.lfoc')||c.closest('.lwl,.lgr'))){e.stopPropagation();const hf=e.target.closest('[data-half]');
    return halfTap(card,!!hf&&hf.dataset.half==='d')}
  // 0.41.11 Anton: a second tap on the raised card lowers it again (no card window any more: the long press shows the card big);
  // a tap on another card while one waits for its target drops the first and picks the new one
  if(LAY==='fan'&&inHand){e.stopPropagation();if(ui.lfan!==card.uid){if(ui.sel&&ui.sel!==card.uid){layClear();ui.mover=null}ui.lfan=card.uid;return render()}ui.lfan=null;if(ui.sel===card.uid)layClear();return render()}
},true);

// Лупа: hold a hand card still to see it big above the hand
const peekEl=document.createElement('div');peekEl.className='lpeek';peekEl.hidden=true;document.body.appendChild(peekEl);
let pk=null;
function peekHide(){if(pk&&pk.t)clearTimeout(pk.t);peekEl.hidden=true;const was=pk&&pk.on;pk=null;return was}
document.addEventListener('pointerdown',e=>{if(typeof G==='undefined'||!G||G.phase!=='battle'||!G.P||ui.busy)return;const c=e.target.closest&&e.target.closest('.hand [data-card]');if(!c)return;
  const card=layCard(c.dataset.card);if(!card)return;peekHide();
  pk={x:e.clientX,y:e.clientY,id:e.pointerId,t:setTimeout(()=>{if(!pk)return;const h=c.closest('.hand')||app.querySelector('.hand');const top=h?h.getBoundingClientRect().top:innerHeight*.6;
    peekEl.innerHTML=cardHtml(card).replace(/ data-card="[^"]*"/,'').replace('<button','<div').replace(/<\/button>\s*$/,'</div>');if(peekEl.firstElementChild)layWhy(peekEl.firstElementChild,card);
    peekEl.hidden=false;peekEl.style.bottom=Math.max(8,Math.min(innerHeight-top+8,innerHeight-peekEl.offsetHeight*1.65-8))+'px';pk.on=true;try{navigator.vibrate&&navigator.vibrate(8)}catch(_){}},260)}},true);
document.addEventListener('pointermove',e=>{if(pk&&e.pointerId===pk.id&&Math.hypot(e.clientX-pk.x,e.clientY-pk.y)>=10)peekHide()},true);
document.addEventListener('pointerup',e=>{if(pk&&e.pointerId===pk.id&&peekHide())suppress=Date.now()},true);
document.addEventListener('pointercancel',()=>peekHide(),true);
document.addEventListener('contextmenu',e=>{if(layOn()&&e.target.closest&&e.target.closest('.hand [data-card],.lfoc'))e.preventDefault()});

// шторка: a sideways swipe in the drawer scrolls the cards instead of grabbing one
document.addEventListener('pointermove',e=>{if(!drag||drag.on||!layOn()||LAY!=='drawer'||e.pointerId!==drag.id||!drag.el||!drag.el.closest('.hgrid'))return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>=10&&Math.abs(dx)>Math.abs(dy))drag=null},true);
// wide and big cards: a mini card follows the finger instead, so it does not cover the field and the aim ring stays close
document.addEventListener('pointermove',()=>{if(!drag||!drag.on||!drag.g||drag._lw||!layOn()||!drag.uid||!drag.el||!drag.el.matches('.lw,.bc'))return;drag._lw=1;
  const card=layCard(drag.uid);if(!card)return;const w=document.createElement('div');w.className='hand mini ghost lyghost';w.innerHTML=cardHtml(card,true);
  w.style.width='64px';w.style.height='100px';w.style.transform=drag.g.style.transform;drag.g.replaceWith(w);drag.g=w;drag.w=64;drag.h=100;drag.hot=Math.round(100*.75/2+14)},{passive:true});

if(typeof document!=='undefined'&&document.body){const st=document.createElement('style');st.textContent=`
.lay-over .laylist{display:flex;flex-direction:column;gap:6px;margin:4px 0 10px}
.layi{display:flex;gap:10px;align-items:flex-start;text-align:left;padding:9px 10px;border-radius:12px;background:#ffffff08;border:1px solid #ffffff14;color:var(--fg);min-height:48px}
.layi.on{border-color:var(--gold);background:color-mix(in srgb,var(--gold) 12%,transparent)}
.layi b{display:block;font-size:14px}.layi .m{display:block;font-size:12px;line-height:1.3;margin-top:2px}
.layic{flex:none;width:30px;height:30px;border-radius:9px;background:#0005;display:flex;align-items:center;justify-content:center;font-size:17px}
.lay-setb{width:100%;margin:6px 0}

/* крупная рука и веер: высокие мини-карты с крупными цифрами */
body[data-lay=big] .hand.mini>.card.mini.zc.hv,body[data-lay=thumb] .hand.mini>.card.mini.zc.hv{height:150px!important;grid-template-rows:18px 24px 17px 19px 17px 24px 18px!important;gap:1.5px!important;padding:3px 4px!important}
body[data-lay=big] .zc.hv .zu,body[data-lay=big] .zc.hv .zv,body[data-lay=thumb] .zc.hv .zu,body[data-lay=thumb] .zc.hv .zv{font-size:12.5px}
body[data-lay=big] .zc.hv .zm,body[data-lay=thumb] .zc.hv .zm{font-size:19px}
body[data-lay=big] .zc.hv .zt,body[data-lay=thumb] .zc.hv .zt{font-size:14px}
body[data-lay=big] .zc .zpet .cri,body[data-lay=thumb] .zc .zpet .cri{width:22px;height:22px}
body[data-lay=big] .zc .zcost .rr,body[data-lay=thumb] .zc .zcost .rr{width:15px;height:15px}
body[data-lay=big] .zc.hv .zz svg.zg,body[data-lay=thumb] .zc.hv .zz svg.zg{width:22px;height:auto}
body[data-lay=big] .zc.hv .zdn,body[data-lay=thumb] .zc.hv .zdn{font-size:14px}
body[data-lay=big] .zc.hv .ei.gn,body[data-lay=thumb] .zc.hv .ei.gn{width:13px;height:13px}
body[data-lay=big] .hand.mini .badge,body[data-lay=thumb] .hand.mini .badge{width:22px;height:22px;font-size:12px}

body[data-lay=big] .hand.mini.lybig{display:grid!important;grid-template-columns:repeat(var(--cols),minmax(0,1fr));gap:6px;overflow:visible}
body[data-lay=big] .hand.mini.lybig>.card{flex:none!important;min-width:0;touch-action:none}
body[data-lay=big] .zc.hv .zu,body[data-lay=big] .zc.hv .zv{font-size:14px}
body[data-lay=big] .zc.hv .zm{font-size:22px}
body[data-lay=big] .zc .zpet .cri{width:26px;height:26px}
body[data-lay=big] .zc .zcost .rr{width:17px;height:17px}
body[data-lay=big] .zc.hv .zz svg.zg{width:26px}
body[data-lay=big] .zc.hv .ei.gn{width:15px;height:15px}
/* веер */
body[data-lay=fan] .hand.mini.lfan{display:flex!important;justify-content:center;overflow:visible!important;padding:30px 0 6px;margin-top:-18px}
body[data-lay=fan]{--fw:84px}body[data-lay=fan][data-hcl=m]{--fw:94px}body[data-lay=fan][data-hcl=l]{--fw:106px}body[data-lay=fan][data-hcl=xl]{--fw:120px}
body[data-lay=fan] .hand.mini.lfan>.card{flex:0 0 var(--fw)!important;width:var(--fw);min-width:var(--fw)!important;margin-left:min(4px,var(--ov));transform:translateY(var(--y)) rotate(var(--r)) scale(var(--s,1));transform-origin:50% 100%;transition:transform .15s;box-shadow:-5px 0 10px #000c!important;border:1.5px solid color-mix(in srgb,var(--pc) 72%,#0B1018)!important;border-radius:11px!important}
body[data-lay=fan] .hand.mini.lfan>.card:first-child{margin-left:0}
body[data-lay=fan] .hand.mini.lfan>.card.lup{outline:2px solid var(--gold);outline-offset:0}
body[data-lay=fan] .hand.mini.lfan>.card,body[data-lay=fan] .hand.mini.lfan>.card>*,body[data-lay=fan] .hand.mini.lfan>.card .bc-art>*{opacity:1!important}
body[data-lay=fan] .hand.mini.lfan>.card.burned{filter:brightness(.55) saturate(.45)}
body[data-lay=fan] .hand.mini.lfan>.card.pl{filter:brightness(.7)}
body[data-lay=fan] .hand.mini.lfan>.card.lup{filter:none}
body[data-lay=fan] .hand.mini.lfan>.card.lpd{filter:none;border-color:#5B6577!important;border-style:dashed!important;background:#151B26!important}
body[data-lay=fan] .hand.mini.lfan>.card.lpd>*:not(.lpst):not(.lpun){filter:grayscale(1) brightness(.42)}
body[data-lay=fan] .hand.mini.lfan>.card.lpd>.badge{display:none}
body[data-lay=fan] .hand.mini.lfan>.card.lpd.lup>*:not(.lpst){filter:grayscale(.6) brightness(.7)}
.lpun{position:absolute;left:2px;top:3px;z-index:6;width:44px;height:54px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;border-radius:10px;background:#2A3550;border:1.5px solid #9FB2D6;color:#EAF0FF;line-height:1}
.lpun b{font-size:22px;font-weight:800}.lpun span{font-size:10px;font-weight:700}
body[data-lay=fan] .hand.mini.lfan>.card.lpd>.lpun{filter:none}
body[data-lay=fan] .hand.mini.lfan>.card.lpd{transform-origin:0 100%}
body[data-lay=fan] .hand.mini.lfan>.card.lpd .lpst{left:2px;width:44px}body[data-lay=fan] .hand.mini.lfan>.card.lpd .lpst.u{top:64px}body[data-lay=fan] .hand.mini.lfan>.card.lpd .lpst.d{top:64px;bottom:auto}
.lpst{position:absolute;left:3px;width:46px;z-index:5;display:flex;flex-direction:column;align-items:center;gap:1px;padding:4px 0 3px;border-radius:9px;background:#0E1420ee;border:2px solid var(--gold);box-shadow:0 2px 8px #000c;pointer-events:none;color:var(--gold);line-height:1}
.lpst.u{top:54px}.lpst.d{bottom:24%;border-color:#4FC79A;color:#8FE3BF}
.lpst b{font-size:17px;font-weight:800}.lpst span{font-size:9px;font-weight:700;letter-spacing:.2px}

body .lyghost{display:block!important;overflow:visible;padding:0;contain:none}body .lyghost>.card{width:64px;height:100px!important}
/* лупа */
.lpeek{position:fixed;left:50%;width:150px;transform:translateX(-50%) scale(1.65);transform-origin:50% 100%;z-index:45;pointer-events:none;filter:drop-shadow(0 10px 24px #000c)}
.lpeek>.card{width:150px;margin:0}
body .hand .card{-webkit-touch-callout:none}
.lpeek{isolation:isolate}
.lpeek>.card{opacity:1!important;filter:none!important;background-color:#1A2535!important;box-shadow:0 0 0 1px #0008}
.lpeek>.card::before{opacity:1!important}

/* широкая карта: ▲ слева, полоса стихий за сброс посередине, ▼ справа */
.card.lw{display:grid!important;grid-template-columns:minmax(0,1.25fr) auto minmax(0,1fr);gap:0;padding:0!important;height:auto!important;min-height:48px;border-radius:10px;overflow:hidden;text-align:left;
 background:linear-gradient(90deg,color-mix(in srgb,var(--pc) 20%,#1A2433),#18212E 45%,#18212E 60%,color-mix(in srgb,var(--pc) 14%,#1A2433))!important;box-shadow:inset 3px 0 0 color-mix(in srgb,var(--pc) 80%,transparent)!important;border:1px solid #ffffff14}
.lw-u,.lw-d{display:flex;flex-direction:column;gap:2px;padding:3px 6px;min-width:0}
.lw-h{display:flex;align-items:center;gap:4px;min-width:0;line-height:1}
.lw-pet{flex:none;display:flex}.lw-pet .cri{width:18px;height:18px}
.lw-nm{font-size:11.5px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--fg)}
.lw-cost{display:flex;gap:1px;align-items:center;flex:none}.lw-cost .rr{width:13px;height:13px;margin:0}.lw-cost .hpc{font-size:10px}
.lw .zi{flex:none;font-size:10.5px;font-weight:700;color:#9AA3AE}.lw .zi.sdn{color:#FF9C8F}.lw .zi.sup{color:#8EE8BE}
.lw-d .lw-h{justify-content:space-between}.lw-d .zdn{color:#C9F2CF;font-size:12px}
.lw-tx{display:flex;align-items:flex-start;gap:4px;font-size:10.5px;line-height:1.15;color:#C7CDD6;min-width:0}
.lw-tx>span{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.lw-tx svg.zg{flex:none;margin-top:1px}
.lw-why{font-style:normal;color:#FFB0A6;font-weight:700}
.lw-g{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0 3px;background:#00000045;border-left:1px dashed #ffffff30;border-right:1px dashed #ffffff30}
.lw-g .ei.gn{width:12px;height:12px}
.lw.disu .lw-u,.lw.disd .lw-d{opacity:.4}
.lw.plu,.lw.pld{opacity:.55}
.lw.lhu .lw-u{box-shadow:inset 0 0 0 2px var(--gold);border-radius:10px 0 0 10px}
.lw.lhd .lw-d{box-shadow:inset 0 0 0 2px #8EE8BE;border-radius:0 10px 10px 0}
.lw .badge{top:3px;right:3px}
.lwb{min-height:96px}.lwb .lw-h{flex-wrap:wrap;row-gap:4px}.lwb .lw-nm{font-size:14px;order:9;flex-basis:100%;white-space:normal}.lwb .lw-tx{font-size:13px;line-height:1.3}.lwb .lw-tx>span{-webkit-line-clamp:5}
.lwb .lw-pet .cri{width:24px;height:24px}.lwb .lw-cost .rr{width:16px;height:16px}.lwb .zi{font-size:12.5px}.lwb .lw-u,.lwb .lw-d{padding:7px 8px;gap:5px}.lwb .lw-g .ei.gn{width:15px;height:15px}

/* список */
body[data-lay=list] .hand.mini.lwl{display:flex!important;flex-direction:column;gap:4px;overflow:visible}
body[data-lay=list] .hand.mini.lwl>.card{flex:none!important;width:100%;touch-action:none}

/* фокус: крупная карта и значки остальных */
body[data-lay=focus] .lfoc>.card{width:100%;touch-action:none}
body[data-lay=focus] .hand.mini.lth>.card.mini.zc.hv{height:70px!important;grid-template-rows:16px 18px 13px 15px!important;touch-action:pan-x}
body[data-lay=focus] .lfoc .lwb{min-height:130px}body[data-lay=focus] .lfoc .lwb .lw-tx{font-size:14px}body[data-lay=focus] .lfoc .lwb .lw-nm{font-size:16px}
body[data-lay=focus] .hand.mini.lth>.card .zu,body[data-lay=focus] .hand.mini.lth>.card .zv,body[data-lay=focus] .hand.mini.lth>.card .zd{display:none!important}
body[data-lay=focus] .hand.mini.lth>.card.lsel{outline:2px solid var(--gold);outline-offset:1px}

/* сетка карт: большие карты по три в ряд */
body[data-lay=grid] .hand.mini.lgr{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;overflow:visible}
body[data-lay=grid] .hand.mini.lgr>.card.bc{flex:none!important;min-height:0;height:auto;padding:0 0 3px;gap:0;touch-action:none}
body[data-lay=grid] .lgr .bc-nm{display:flex;align-items:center;gap:4px;font-size:12px;margin:2px 0 1px;text-align:left;line-height:1.1}
body[data-lay=grid] .lgr .bc-nm .bc-ic{flex:none;width:22px;height:22px;min-width:0;padding:0;margin:0;font-size:14px;display:flex;align-items:center;justify-content:center;background:none;border:0;box-shadow:none}body[data-lay=grid] .lgr .bc-ic .cri{width:22px;height:22px}
body[data-lay=grid] .lgr .bc-why{position:static;transform:none;align-self:flex-start;display:inline-flex;margin:1px 4px;padding:1px 6px;font-size:10px}
body[data-lay=grid] .lgr .bc-tx{font-size:10px;line-height:1.16;padding:1px 5px 3px}
body[data-lay=grid] .lgr .bc-h{height:19px}body[data-lay=grid] .lgr .bc-h .mc-spd{top:2px;left:2px}body[data-lay=grid] .lgr .bc-cost{top:1px;right:1px}
body[data-lay=grid] .lgr .bc-nm{white-space:normal;font-size:11.5px}
body[data-lay=grid] .lgr .bc-g{margin:1px 0;padding:1px 6px}body[data-lay=grid] .lgr .bc-g .ei.gn{width:12px;height:12px}
body[data-lay=grid] .lgr .bc-dn{padding:1px 0 0}body[data-lay=grid] .lgr .bc-dh{margin-top:0;font-size:10px}
body[data-lay=grid] .lgr .card.lhu [data-half=u]{background:color-mix(in srgb,var(--gold) 14%,transparent)}
body[data-lay=grid] .lgr .card.lhu{box-shadow:0 0 0 2px var(--gold)!important}
body[data-lay=grid] .lgr .card.lhd{box-shadow:0 0 0 2px #8EE8BE!important}
body[data-lay=grid] .lgr .card.lhd .bc-dn{background:#8EE8BE1f}

/* тап: панель выбранной карты под рукой */
.lpanel{position:fixed;left:50%;transform:translateX(-50%);bottom:10px;width:min(436px,calc(100vw - 24px));z-index:30;box-shadow:0 -6px 24px #000c;display:flex;flex-direction:column;gap:6px;padding:6px;border-radius:12px;background:var(--panel);border:1px solid #2B3B52}
.lpanel .lfoc>.card{width:100%}
.lp-acts{display:flex;gap:6px;align-items:center}
.lp-acts .btn{flex:1;min-height:44px;padding:0 6px}.lp-acts .btn.on{box-shadow:0 0 0 2px var(--gold) inset}.lp-acts .pill{min-width:44px;min-height:44px;justify-content:center}
.lp-hint{flex:1.2;text-align:center;font-size:12px;color:var(--gold)}
.lbad{color:#FFB0A6;font-size:12px}
body[data-lay=tap] .hand.mini>.card.lhu{box-shadow:0 0 0 2px var(--gold)!important}
body[data-lay=tap] .hand.mini>.card.lhd{box-shadow:0 0 0 2px #8EE8BE!important}

/* строка подтверждения у списка, сетки и фокуса */
.lconf{position:fixed;left:50%;transform:translateX(-50%);bottom:10px;width:min(436px,calc(100vw - 24px));z-index:30;box-shadow:0 -6px 24px #000c;display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:12px;background:var(--panel);border:1px solid #2B3B52;font-size:12.5px;line-height:1.3}
.lconf>span{flex:1}.lconf .btn{flex:none;min-height:44px;padding:0 12px}.lconf .pill{min-width:44px;min-height:44px;justify-content:center}

body[data-lay] .acts .lic{flex:0 0 46px;min-height:46px;padding:0;display:flex;align-items:center;justify-content:center;font-size:16px;border-radius:12px}
body[data-lay] .acts .btn.lic{font-size:20px}
body[data-lay] .acts .pill.lic.on{font-size:13px}
body[data-lay]:has(.lconf) #app{padding-bottom:70px}body[data-lay]:has(.lpanel) #app{padding-bottom:190px}
body[data-lay] .acts .lic{flex-direction:column;gap:0;line-height:1.1}body[data-lay] .acts .lic::after{content:attr(title);font-size:9.5px;color:var(--mut);font-weight:500}
body[data-lay] .acts .btn.lic{font-size:17px}
body[data-lay=drawer]:has(.hsheet) .hand.mini{visibility:hidden}
body[data-lay=drawer] .hs-top .pill{min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;font-size:15px}
.lplan .hand.mini.lpl>.card{overflow:visible!important}
body[data-lay=plan] .hand.mini:not(.lpl)>.card{flex:0 0 calc((100% - 25px)/6)!important}
/* шторка: низкая, карты в ряд, поле видно */
body[data-lay=drawer] .hs-back{background:transparent}
body[data-lay=drawer] .hsheet{max-height:none;overflow:visible;padding-top:8px;border-radius:18px 18px 0 0}
body[data-lay=drawer] .hsheet .hs-top{margin-bottom:4px}
body[data-lay=drawer] .hsheet .hs-pool{margin-bottom:6px}
body[data-lay=drawer] .hsheet .hgrid{display:flex!important;flex-wrap:nowrap;overflow-x:auto;gap:8px;scroll-snap-type:x mandatory;padding:4px 2px 6px;scrollbar-width:none}
body[data-lay=drawer] .hsheet .hgrid::-webkit-scrollbar{display:none}
body[data-lay=drawer] .hsheet .hgrid>.card{flex:0 0 46%;scroll-snap-align:start;touch-action:pan-x}
body[data-lay=drawer] .hsheet .hs-bot{margin-top:4px}

/* одной рукой */
body[data-lay=thumb] #app{min-height:calc(100vh - 34px)}
body[data-lay=thumb] .sb-el.lbot{margin-top:auto}
body[data-lay=thumb] .top .title{font-size:20px}
body[data-lay=thumb] .ltool{display:grid;grid-template-columns:repeat(auto-fit,minmax(40px,1fr));gap:5px}
body[data-lay=thumb] .ltool .pill{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-height:48px;padding:3px 2px;border-radius:12px;font-size:15px;margin:0!important}
body[data-lay=thumb] .ltool .pill::after{display:none!important}
body[data-lay=thumb] .ltool .pill small{font-size:10px;color:var(--mut);line-height:1}
body[data-lay=thumb] .ltool .pill.on small{color:var(--gold-ink)}
body[data-lay=thumb] .acts .btn:not(.main){flex:0 0 32%;font-size:12.5px;white-space:nowrap;padding:0 6px}
body[data-lay=thumb] .acts .btn.main{min-height:58px;font-size:18px}

/* план полосой */
.lplan{display:flex;flex-direction:column;gap:4px;padding:5px 6px 6px;border-radius:12px;background:#0004;border:1px dashed #E9C46A55}
.lp-hd{display:flex;align-items:center;gap:8px;font-size:12px}.lp-hd .m{font-size:11px;flex:1;text-align:right}.lp-hd .qpri{position:static}
.lplan .hand.mini.lpl{display:flex!important;gap:5px;min-height:108px;padding:7px 4px 1px;overflow-x:auto}
.lplan .hand.mini.lpl>.card{flex:0 0 calc((100% - 20px)/5.4)!important;opacity:1!important}

/* 0.38.7 unplayable halves: darkened, never see-through, with what is missing */
body .card.hv.dis>*,body .card.hv.dis .bc-art>*{opacity:1!important}
body .zc.hv.disu .z1,body .zc.hv.disu .z2,body .zc.hv.disu .zu,body .zc.hv.disd .zlo{opacity:1!important;filter:brightness(.32) saturate(.35)}
body .bc.hv.disu .bc-h,body .bc.hv.disu .bc-art>*:not(.lxo),body .bc.hv.disu .bc-nm,body .bc.hv.disu .bc-tx,body .bc.hv.disd .bc-dn>*:not(.lxo){opacity:1!important;filter:brightness(.32) saturate(.35)}
.zc.hv>.lxo{grid-column:1/-1;z-index:3;align-self:center;justify-self:center;pointer-events:none}
/* in the fan only the left strip of a card shows: the label sits there */
body[data-lay=fan] .lfan>.zc.hv:not(.lup):not(:last-child)>.lxo{justify-self:start;margin-left:1px;max-width:50px}
body[data-lay=fan] .lfan>.zc.hv:not(.lup):not(:last-child)>.lxo .lxt{display:none}
body[data-lay=fan] .lfan>.zc.hv:not(.lup):not(:last-child)>.lxo .lxi{font-size:14px}body[data-lay=fan] .lfan>.zc.hv:not(.lup):not(:last-child)>.lxo .lxi .ei{width:17px;height:17px}
.zc.hv>.z1{grid-row:1}.zc.hv>.z2{grid-row:2}.zc.hv>.zu{grid-row:3}.zc.hv>.zg4{grid-row:4}.zc.hv>.zv{grid-row:5}.zc.hv>.zd{grid-row:6}.zc.hv>.zb{grid-row:7}
.zc.hv>.lxo.u{grid-row:1/4}.zc.hv>.lxo.d{grid-row:5/8}
.lxo{display:flex;flex-direction:column;align-items:center;gap:1px;padding:2px 5px;border-radius:8px;background:#0b0f16e6;border:1px solid #FFB0A688;color:#FFB0A6;line-height:1.05;text-align:center;max-width:96%}
.lxo .lxi{display:flex;gap:1px;align-items:center;justify-content:center;font-size:12px}.lxo .lxi .ei{width:14px;height:14px}
.lxo .lxt{font-size:9px;font-weight:600;white-space:nowrap}
.bc-art,.bc-dn{position:relative}
.bc-art>.lxo,.bc-dn>.lxo{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;pointer-events:none;padding:4px 9px}
.bc-art>.lxo .lxt,.bc-dn>.lxo .lxt{font-size:12px}.bc-art>.lxo .lxi .ei,.bc-dn>.lxo .lxi .ei{width:18px;height:18px}
/* 0.38.8 Anton: mini cards a little taller, the element band always exactly in the middle */
body[data-bfit] .hand.mini:not(.lpl)>.card.mini.zc.hv{grid-template-rows:1fr 1.3fr .95fr auto .95fr 1.3fr 1fr!important;align-content:stretch}
body[data-bfit] .hand.mini:not(.lpl)>.card.mini.zc.hv>*{min-height:0}
body[data-bfit]:not([data-hcl]) .hand.mini:not(.lpl)>.card.mini.zc.hv{height:112px!important}
body[data-bfit][data-hcl=m] .hand.mini:not(.lpl)>.card.mini.zc.hv{height:142px!important}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl)>.card.mini.zc.hv{height:168px!important}
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl)>.card.mini.zc.hv{height:204px!important}
/* 0.38.7 library */
.lib{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}
.lib .ltl{font-size:13px;padding:10px 3px 7px}
.lib .lt-art{zoom:1.4}
.lib .lt-nm{font-size:13px}
.lib .lt-lv{font-size:12px}
.lt-el{display:flex;gap:3px;justify-content:center;align-items:center;min-height:18px}.lt-el .ei{width:18px;height:18px}
/* 0.38.7 top «Меню» */
body .top .lmenu-b{margin-left:auto;min-height:36px;padding:0 14px;font-weight:600}
body .top .lmenu-b.on{background:var(--gold);color:var(--gold-ink)}
.lmenu-over{position:fixed;inset:0;z-index:40;background:#0006}
.lmenu-pop{position:absolute;top:max(54px,calc(env(safe-area-inset-top) + 50px));right:max(12px,calc((100vw - 460px)/2));display:flex;flex-direction:column;gap:6px;padding:8px;border-radius:14px;background:var(--panel);border:1px solid var(--line);box-shadow:0 12px 30px #000c;min-width:190px}
.lmenu-pop .pill.lmi{display:flex;align-items:center;gap:10px;justify-content:flex-start;min-height:44px;padding:0 14px;margin:0!important;font-size:17px;text-align:left}
.lmenu-pop .pill.lmi::after{display:none!important}
.lmenu-pop .lmi-l{font-size:14px;font-weight:500;color:var(--fg)}
.lturn{font-weight:700;font-size:13px;color:var(--fg);white-space:nowrap;padding:3px 9px;border-radius:999px;background:#0005;border:1px solid var(--line);margin-right:6px}
.front .qs{align-items:center}
/* 0.38.0 no scrolling in battle */
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl)>.card.mini.zc.hv{height:182px!important;grid-template-rows:22px 29px 20px 23px 20px 29px 22px!important;gap:2px!important;padding:3px 5px!important}
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl) .zc.hv .zu,body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl) .zc.hv .zv{font-size:15px}
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl) .zc.hv .zm{font-size:23px}
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl) .zc.hv .zt{font-size:17px}
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl) .zc .zpet .cri{width:27px;height:27px}
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl) .zc .zcost .rr{width:18px;height:18px}
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl) .zc.hv .zz svg.zg{width:27px;height:auto}
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl) .zc.hv .zdn{font-size:17px}
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl) .zc.hv .ei.gn{width:16px;height:16px}
body[data-bfit][data-hcl=xl] .hand.mini:not(.lpl) .badge{width:26px;height:26px;font-size:14px}

html:has(body[data-bfit]){overflow:hidden;overscroll-behavior:none;height:100%}
body[data-bfit]{box-sizing:border-box;margin:0;height:100dvh;overflow:hidden;overscroll-behavior:none;padding-block:max(8px,env(safe-area-inset-top)) max(8px,env(safe-area-inset-bottom))}
body[data-bfit] #app{min-height:100%}
body[data-bfit] .board{width:var(--bw,100%);margin-inline:auto}body[data-bfit] .hand.mini:not(.lpl){zoom:var(--hz,1)}
body[data-bfit][data-tight] #app{gap:5px}
/* Anton 0.38.3: in «Бой четвёрок» the hand has fewer cards, so it sits in the middle */
body[data-bfit][data-tn="4"] .hand.mini:not(.lpl){justify-content:center}
body[data-bfit][data-tn="4"]:not([data-lay=drawer]) .hgrid{display:flex;flex-wrap:wrap;justify-content:center}
body[data-bfit][data-tn="4"]:not([data-lay=drawer]) .hgrid>.card{flex:0 0 calc((100% - 14px)/3);min-width:0}
body[data-bfit][data-tight] .lplan .hand.mini.lpl{min-height:0;padding-top:5px}
body[data-bfit][data-tight] .lplan .hand.mini.lpl>.card{zoom:.72}
body[data-bfit][data-lay=thumb] #app{min-height:100%}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl)>.card.mini.zc.hv{height:150px!important;grid-template-rows:18px 24px 17px 19px 17px 24px 18px!important;gap:1.5px!important;padding:3px 4px!important}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl) .zc.hv .zu,body[data-bfit][data-hcl=l] .hand.mini:not(.lpl) .zc.hv .zv{font-size:12.5px}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl) .zc.hv .zm{font-size:19px}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl) .zc.hv .zt{font-size:14px}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl) .zc .zpet .cri{width:22px;height:22px}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl) .zc .zcost .rr{width:15px;height:15px}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl) .zc.hv .zz svg.zg{width:22px;height:auto}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl) .zc.hv .zdn{font-size:14px}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl) .zc.hv .ei.gn{width:13px;height:13px}
body[data-bfit][data-hcl=l] .hand.mini:not(.lpl) .badge{width:22px;height:22px;font-size:12px}
body[data-bfit][data-hcl=m] .hand.mini:not(.lpl)>.card.mini.zc.hv{height:127px!important;grid-template-rows:15px 20px 14px 16px 14px 20px 15px!important;gap:1.5px!important;padding:3px 4px!important}
body[data-bfit][data-hcl=m] .hand.mini:not(.lpl) .zc.hv .zu,body[data-bfit][data-hcl=m] .hand.mini:not(.lpl) .zc.hv .zv{font-size:11.5px}
body[data-bfit][data-hcl=m] .hand.mini:not(.lpl) .zc.hv .zm{font-size:16.5px}
body[data-bfit][data-hcl=m] .hand.mini:not(.lpl) .zc.hv .zt{font-size:12.5px}
body[data-bfit][data-hcl=m] .hand.mini:not(.lpl) .zc .zpet .cri{width:19px;height:19px}
body[data-bfit][data-hcl=m] .hand.mini:not(.lpl) .zc .zcost .rr{width:13px;height:13px}
body[data-bfit][data-hcl=m] .hand.mini:not(.lpl) .zc.hv .zz svg.zg{width:19px;height:auto}
body[data-bfit][data-hcl=m] .hand.mini:not(.lpl) .zc.hv .zdn{font-size:12.5px}
body[data-bfit][data-hcl=m] .hand.mini:not(.lpl) .zc.hv .ei.gn{width:12px;height:12px}
`;document.body.appendChild(st)}
