/* ---------- 0.34 Anton: card zone icons (thread «Шаги забивают руку»). ----------
   Every zone is a small code-drawn glyph standing before the number. Red = enemies, green = own, gold = the pet itself.
   Cells = "exactly so many cells" (can be shifted to the edge); a solid bar with arrows = the whole row/column; first in column = pale bar, bright front cell.
   Optional t.reach (0..3) draws the distance marker under the glyph: gold square = the pet's column, squares on each side = columns it may reach. No marker = anywhere.
   Mini card: pet + cost / zone + main number / effects + ▲⏱ / ▼⏱ + element + ▼ effect. The name is on the big card.
   Effect icons are drafts (Anton: zones final, effect icons not yet). */
const ZR=(x,y,w,h,r,c,o)=>`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"${o?` opacity="${o}"`:''}/>`;
const ZSIDE=a=>a==='self'?'zs':DEF.has(a)||a==='summon'||a==='step'?'zo':'ze';
function zoneBody(a,c){
  if(a&&a[1]==='_'&&a[0]==='o')a=a.slice(2);
  switch(a){
    case'cell':case'ally':case'trapc':return ZR(8,8,12,12,2.5,c);
    case'hline':return[1,10,19].map(x=>ZR(x,9,8,10,2,c)).join('');
    case'sq2':return[[5,5],[14.5,5],[5,14.5],[14.5,14.5]].map(([x,y])=>ZR(x,y,8.5,8.5,2,c)).join('');
    case'cross':return[[10,1],[1,10],[10,10],[19,10],[10,19]].map(([x,y])=>ZR(x,y,8,8,2,c)).join('');
    case'row':return ZR(0,9,28,10,3,c)+'<path class="zk" d="M2.5 14 l4 -3 v6z M25.5 14 l-4 -3 v6z"/>';
    case'col':return ZR(9,0,10,28,3,c)+'<path class="zk" d="M14 2.5 l-3 4 h6z M14 25.5 l-3 -4 h6z"/>';
    case'melee':return ZR(9,0,10,28,3,c,.3)+ZR(9,19,10,9,2.5,c);
    case'enemies':case'allies':return ZR(11,3,14,14,3,c,.45)+ZR(7,7,14,14,3,c,.7)+ZR(3,11,14,14,3,c);
    case'self':return'<circle class="zs" cx="14" cy="14" r="8"/>';
    case'summon':return`<circle class="${c}" cx="14" cy="14" r="11" opacity=".35"/><path class="${c}" d="M12 6h4v6h6v4h-6v6h-4v-6h-6v-4h6z"/>`;
    case'step':return`<path class="${c}" d="M14 2 l5 6 h-3.5 v5 h-3 v-5 h-3.5z M14 26 l5 -6 h-3.5 v-5 h-3 v5 h-3.5z M2 14 l6 -5 v3.5 h5 v3 h-5 v3.5z M26 14 l-6 -5 v3.5 h-5 v3 h5 v3.5z"/>`;
  }
  return ZR(8,8,12,12,2.5,c)}
function zoneReach(d,c){let h='';const n=2*d+1,st=Math.min(5.6,28/n),sz=st-.9,x0=14-n*st/2+.45;
  for(let i=0;i<n;i++)h+=ZR((x0+i*st).toFixed(2),28.6,sz.toFixed(2),Math.min(sz,5).toFixed(2),1,i===d?'zs':c);return h}
// sz = height of the zone part in px; side 'e'/'o' forces the colour (hint page)
function zoneSvg(a,sz,reach,side){const c=side?'z'+side:ZSIDE(a),r=reach!=null&&reach>=0&&reach<=3,h=r?sz*34/28:sz;
  return`<svg class="zg" width="${sz}" height="${h.toFixed(1)}" viewBox="0 0 28 ${r?34:28}" aria-hidden="true">${zoneBody(a,c)}${r?zoneReach(reach,c):''}</svg>`}

const ZFI=Object.fromEntries(FXL.map(([k,ic])=>[k,ic]));
const zPips=n=>n>0&&n<5?`<i class="zp">${'<b></b>'.repeat(n)}</i>`:n?`<i class="zn">${n}</i>`:'';
// main number of the ▲ half
function zMain(t,c,card){if(t.dmg)return['⚔',shownDmg(t,c,card)];if(t.trap)return['⚔',sm(c,t.trap.dmg)];if(t.heal)return['❤',hlv(c,t.heal)];if(t.shield)return['🛡',sm(c,t.shield)];return null}
// everything else the ▲ half does, as icon + number/pips
function zFx(t,c){const L=[];
  if(t.trap)L.push(t.trap.ic||'🪤');
  if(t.heal&&t.dmg)L.push('❤'+hlv(c,t.heal));
  if(t.shield&&(t.dmg||t.heal||t.trap))L.push('🛡'+sm(c,t.shield));
  if(t.freeze)L.push(ZFI.frozen);
  for(const k of NEG){const v=cst(t,k);if(v)L.push(ZFI[k]+zPips(v))}
  if(t.strip)L.push('<s class="zx">🛡</s>');
  if(t.exec)L.push('💔+'+sm(c,t.exec));
  if(t.chain)L.push('⚡+'+sm(c,t.chain));
  if(t.drain)L.push('🩸');
  if(t.push)L.push('⇧');if(t.pull)L.push('⇩');
  if(t.cleanse)L.push('🧹');
  if(t.immune)L.push(ZFI.immune+zPips(t.immune));
  if(t.evade)L.push(ZFI.evade+zPips(t.evade));
  if(t.draw)L.push('✋+'+t.draw);
  if(t.grow)L.push('⚔↑');
  if(t.hpcost)L.push(`<i class="zneg">❤−${t.hpcost}</i>`);
  if((t.sum||t.txt)&&!STEP.has(t.area))L.push('✱');
  return L}
// what the ▼ half does besides the element (who it hits is on the big card: the row is too narrow for a zone glyph)
function zSub(s){if(!s)return'';
  if(s.shield||s.allShield)return'🛡'+(s.shield||s.allShield);if(s.heal||s.allHeal)return'❤'+(s.heal||s.allHeal);
  if(s.colDmg||s.frontDmg)return'⚔'+(s.colDmg||s.frontDmg);if(s.draw)return'✋+'+s.draw;if(s.markCol)return ZFI.mark;if(s.evade)return ZFI.evade;return''}

const _cardHtml0=cardHtml;
cardHtml=function(card,mini){
  if(!mini)return _cardHtml0(card,mini);
  const isNew=ui.seen&&G.P.hand.includes(card)&&!ui.seen.has(card.uid);
  const S=G.P,t=T[card.t],c=card.pet?pet(S,card.pet):null;
  const pi=S.plan.findIndex(e=>e.card===card);
  const burned=pi>=0&&S.plan[pi].kind==='burn';const cls=['card','mini','zc'];if(isNew)cls.push('new');if(ui.sel===card.uid)cls.push('selc');const inH=S.hand.includes(card);if(burned)cls.push('burned');else if(pi>=0)cls.push('pl');else if(whyNot(S,card))cls.push('dis');const wi=pi<0&&cls.includes('dis')?whyInfo(S,card):null;
  const ci=cardIni(card.t),es=inH?ini({kind:'card',card,S}):ci,di=cardIniDn(card.t),ed=inH?ini({kind:'burn',card,S}):di;
  const sc=(v,b)=>v>b?'sdn':v<b?'sup':'';
  const tag=burned?`<span class="burntag">▼</span>`:pi>=0?`<span class="badge">${planNo(S).get(S.plan[pi])||pi+1}</span>`:'';
  const m=STEP.has(t.area)?null:zMain(t,c,card),fx=zFx(t,c),b=burnVal(S,card);
  const r2=STEP.has(t.area)?`${zoneSvg('step',20)}<span class="zt">Шаг</span>`:`${zoneSvg(t.area,20,t.reach)}${m?`<span class="zm">${m[0]}${m[1]}</span>`:''}`;
  const fxH=fx.length>2?fx.slice(0,1).join('')+'<i class="zmore">+'+(fx.length-1)+'</i>':fx.join('');
  return`<button class="${cls.join(' ')}" data-card="${card.uid}" style="--pc:${t.el?elVar(t.el):'var(--mut)'}" aria-label="${t.n}">
<span class="z1"><span class="zpet">${c?petIc(c,1):'👣'}</span><span class="zcost">${costHtml(t)}${hpNeedH(S,card)}</span></span>
<span class="z2">${r2}</span>
<span class="z3"><span class="zfx">${fxH}</span><span class="zi ${sc(es,ci)}">⏱${es}</span></span>
<span class="z4"><span class="zl"><b>▼</b><span class="zel">${b.n}${EI(b.el,1)}</span><span class="zsub">${zSub(t.sub)}</span></span><span class="zi ${sc(ed,di)}">⏱${ed}</span></span>
${tag}${wi?`<span class="why">${wi.ic}</span>`:''}</button>`};

// rows that don't fit shrink their font instead of being cut
function zFit(){for(const r of document.querySelectorAll('.zc .z2,.zc .zu,.zc .z3,.zc .z4,.zc .zv,.zc .zd,.zc .zb')){if(r.dataset.zf)continue;r.dataset.zf=1;let f=r.classList.contains('z2')||r.classList.contains('zd')?12:r.classList.contains('zu')||r.classList.contains('zv')?9:10,g=0;while(r.scrollWidth>r.clientWidth+1&&f>6&&g++<12){f-=.5;r.style.fontSize=f+'px'}}};
if(typeof MutationObserver!=='undefined'&&typeof document!=='undefined'&&document.body)new MutationObserver(()=>{if(document.querySelector('.zc .z4:not([data-zf])'))zFit()}).observe(document.body,{childList:true,subtree:true});

/* hint page: second tab of the 💫 effects sheet */
function zoneHelp(){
  const Z=[['cell','Клетка','одна клетка на выбор'],['hline','Тройка','3 клетки в ряд'],['sq2','Квадрат','2 × 2'],['cross','Крест','клетка и 4 соседа'],['row','Ряд','весь ряд целиком'],['col','Столбец','весь столбец целиком'],['melee','Первый в столбце','ближайший враг в столбце'],['enemies','Все враги',''],['allies','Все свои',''],['ally','Свой','один свой пет'],['self','Себе','сам пет'],['summon','Призыв','']];
  const zr=Z.map(([a,n,s])=>`<div class="zh"><span>${zoneSvg(a,22)}</span><span><b>${n}</b>${s?`<br><span class="m">${s}</span>`:''}</span></div>`).join('');
  const rr=[0,1,2,3].map(d=>`<div class="zh zc2">${zoneSvg('melee',20,d,'e')}<span class="m">${d?'на '+d:'свой столбец'}</span></div>`).join('');
  const F=[[ZFI.stun,'оглушение'],[ZFI.frozen,'заморозка'],[ZFI.root,'сковывание'],[ZFI.slow,'замедление'],[ZFI.burn,'поджог'],[ZFI.mark,'метка'],[ZFI.evade,'уклонение'],[ZFI.immune,'иммунитет'],['🧹','снимает плохие эффекты'],['<s class="zx">🛡</s>','снимает щит'],['💔+4','ещё урон по раненым'],['⚡+3','перескок на другого врага'],['🩸','лечится на урон'],['⇧','толчок'],['⇩','притягивает'],['✋+1','рука +1'],['⚔↑','растёт в руке'],['✱','особое правило: на большой карте']];
  const fr=F.map(([i,n])=>`<div class="zh"><span class="zfi">${i}</span><span>${n}</span></div>`).join('');
  return`<div class="over" data-act="fxs-close"><div class="box hintbox">${zoneTabs('Значки карт')}
  <h3>Как читать карту в руке</h3>
  <div class="zdemo"><span class="zc demo"><span class="z1"><span class="zpet">🐺</span><span class="zcost">${EI('f')}</span></span><span class="z2">${zoneSvg('hline',20)}<span class="zm">⚔12</span></span><span class="z3"><span class="zfx">${ZFI.mark}${zPips(2)}</span><span class="zi">⏱55</span></span><span class="z4"><span class="zl"><b>▼</b><span class="zel">1${EI('f',1)}</span><span class="zsub">🛡4</span></span><span class="zi">⏱30</span></span></span>
  <ol class="m"><li>Чья карта и цена ▲</li><li>Куда бьёт и главное число</li><li>Эффекты (точки = ходы) и ⏱ ▲</li><li>▼: стихия, бонус и ⏱ ▼</li></ol></div>
  <div class="m">Название и полный текст на большой карте: тапни руку.</div>
  <h3>Зоны</h3><div class="m">Красная бьёт врагов, зелёная помогает своим, жёлтая сам пет. Квадратики: ровно столько клеток. Полоса со стрелками: весь ряд или столбец.</div>
  <div class="zgrid">${zr}</div>
  <h3>Дистанция</h3><div class="m">Метка под зоной: жёлтый квадрат это столбец пета, по бокам на сколько столбцов он достаёт. Нет метки: куда угодно.</div>
  <div class="zgrid">${rr}</div>
  <h3>Эффекты</h3><div class="m">Значки эффектов временные, будут перерисованы.</div>
  <div class="zgrid">${fr}</div><div class="acts"><button class="btn main" data-act="fxs-close">Закрыть</button></div></div></div>`}
function zoneTabs(on){return`<div class="ztabs"><span>${['Эффекты','Значки карт'].map(n=>`<button class="pill ${n===on?'on':''}" data-fxt="${n==='Эффекты'?'e':'z'}">${n}</button>`).join('')}</span></div>`}
const _fxSheet0=fxSheet;
fxSheet=function(){if(ui.fxTab==='z')return zoneHelp();
  return _fxSheet0().replace(/<div style="display:flex;align-items:center;justify-content:space-between"><h2 style="margin:0">Эффекты<\/h2><button class="pill sm" data-act="fxs-close">✕<\/button><\/div>/,zoneTabs('Эффекты'))};
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-fxt]');if(!b)return;e.stopPropagation();ui.fxTab=b.dataset.fxt;render()},true);

if(typeof document!=='undefined'&&document.head&&document.head.insertAdjacentHTML)document.head.insertAdjacentHTML('beforeend',`<style>
.ze{fill:#E8654F}.zo{fill:#4FC38A}.zs{fill:#F7CF5A}.zk{fill:#131C28}.zg{display:inline-block;flex:none;vertical-align:middle}
.hand.mini>.card.mini.zc{display:grid!important;grid-template-rows:15px 26px 14px 15px;gap:1px;padding:3px 3px 2px!important;align-content:start;text-align:left}
.zc>span{display:flex;align-items:center;min-width:0;white-space:nowrap;line-height:1}
.zc .z1{justify-content:space-between;gap:2px}.zc .zpet{font-size:13px;display:flex}.zc .zpet .cri{width:16px;height:16px}
.zc .zcost{display:flex;gap:1px;align-items:center}.zc .zcost .rr{width:12px;height:12px;margin:0}.zc .zcost .hpc{font-size:9px}
.zc .z2{gap:3px;justify-content:center}.zc .zm{font-weight:800;font-size:16px;color:#EDEFF2;letter-spacing:-.02em}.zc .zt{font-weight:700;font-size:12px}
.zc .z3,.zc .z4{overflow:hidden;justify-content:space-between;gap:2px;letter-spacing:-.02em;font-size:10px;font-weight:700;color:#C7CDD6}
.zc .z4{border-top:1px dashed #ffffff22;padding-top:1px}.zc .zl{display:flex;align-items:center;gap:1px;flex:none}.zc .zi,.zc .zfx{flex:none}.zc .zl>b{color:#C9F2CF;font-weight:700;font-size:.9em}
.zc .zfx{display:flex;align-items:center;gap:2px;overflow:hidden}.zc .zi{color:#9AA3AE}.zc .zi.sdn{color:#FF9C8F}.zc .zi.sup{color:#8EE8BE}.zc .zi b{color:#C9F2CF;font-weight:700}
.zc .zel{display:inline-flex;align-items:center;color:#C9F2CF}.zc .zel .ei{width:10px;height:10px}.zc .zsub{display:inline-flex;align-items:center;gap:1px}
.zp{display:inline-flex;gap:1px;margin-left:1px}.zp b{width:3px;height:3px;border-radius:50%;background:currentColor}.zn{font-style:normal;font-size:9px}
.zx{text-decoration:line-through;text-decoration-color:#E8654F;text-decoration-thickness:2px}.zneg{font-style:normal;color:#FF9C8F}.zmore{font-style:normal;font-size:9px;color:#9AA3AE;margin-left:1px}
.ztabs{display:flex;align-items:center;justify-content:space-between;gap:6px}.ztabs>span{display:flex;gap:4px;flex-wrap:wrap}
.zgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px;margin:6px 0 4px}
.zh{display:flex;align-items:center;gap:8px;background:#ffffff0a;border-radius:9px;padding:6px 8px;font-size:12px;line-height:1.25}.zh>span:first-child{flex:none;display:flex}.zh.zc2{flex-direction:column;gap:3px}
.zfi{min-width:34px;justify-content:center;font-weight:700}
.zdemo{display:flex;gap:12px;align-items:center;margin:6px 0}.zdemo ol{margin:0;padding-left:18px;font-size:12px;line-height:1.5}
.zc.demo{display:grid;grid-template-rows:15px 26px 14px 15px;gap:1px;padding:3px 4px 2px;width:74px;height:76px;box-sizing:border-box;border-radius:10px;flex:none;background:linear-gradient(180deg,color-mix(in srgb,var(--fire) 16%,#1A2433) 0%,#18212E 70%);box-shadow:inset 0 2px 0 var(--fire)}
</style>`);
