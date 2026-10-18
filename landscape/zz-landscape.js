/* ---------- landscape test (Anton 2026-10-18, «Горизонтальный экран»): the battle screen laid out for a phone held sideways.
   Separate page alanvoll.github.io/TD/landscape/; the main game stays portrait. Only the look changes: rules, cards and bots are the same.
   Your field on the left, the enemy's on the right (fronts face each other in the middle), the hand along the bottom,
   buttons in the side columns. Both fields are turned a quarter: a field's rows become columns, its columns become rows. ---------- */
const LZ_ON=typeof document!=='undefined'&&!!document.body;
const lzOn=()=>LZ_ON&&innerWidth>innerHeight&&typeof G!=='undefined'&&G&&G.phase==='battle';
if(LZ_ON){document.body.classList.add('ls');
  // cell positions on the turned fields: your row r → column (ROWS-r) (front on the right), enemy row r → column r+1 (front on the left); column c → row c+1
  let pos='';for(let r=0;r<3;r++)for(let c=0;c<5;c++){
    pos+=`body.ls .board .grid.field:not(.enemyg)>[data-cell="p,${r},${c}"]{grid-column-start:${3-r}!important;grid-row-start:${c+1}!important}`;
    pos+=`body.ls .board .grid.field.enemyg>[data-cell="b,${r},${c}"]{grid-column-start:${r+1}!important;grid-row-start:${c+1}!important}`}
  const st=document.createElement('style');st.id='ls-css';st.textContent=`
.ls-turn{display:none}
@media (orientation:landscape){
body.ls:has(#app>.board){padding:0;overflow:hidden}
body.ls #app:has(>.board){position:relative;max-width:none;height:100vh;height:100dvh;box-sizing:border-box;margin:0;padding:6px 10px 4px;
  display:grid;grid-template-columns:var(--lsL,150px) minmax(0,1fr) var(--lsR,150px);
  grid-template-rows:auto auto auto minmax(0,1fr) var(--lsH,150px);
  grid-template-areas:"top board opp" "front board bact" "el board bact" "piles board bact" "piles hand acts";gap:4px 10px;align-items:start}
body.ls #app>.top{grid-area:top}body.ls[data-bfit] #app>.top{position:static}
body.ls #app>.sb-opp{grid-area:opp}
body.ls #app>.board{grid-area:board;position:absolute;left:0;top:0;width:100%!important;margin:0;
  flex-direction:row-reverse;gap:14px;height:100%}
body.ls #app>.front{grid-area:front}
body.ls #app>.sb-el{grid-area:el}
body.ls #app>.sb-piles{grid-area:piles}
body.ls #app>.tl{grid-area:hand;align-self:center;margin:0;position:relative;z-index:2}body.ls #app>.tl-cap{grid-area:hand;align-self:end;margin:0 0 4px}
body.ls #app>.hand.mini{grid-area:hand;align-self:end;min-height:0}
body.ls #app>.bact{grid-area:bact;flex-direction:column;margin:0!important;gap:6px}
body.ls #app>.acts{grid-area:acts;flex-direction:column;align-self:end;gap:6px}
body.ls #app>.acts .btn{min-height:40px;padding-block:6px;white-space:nowrap;font-size:clamp(13px,2.4vh,17px)}
body.ls #app>.sb-piles>.side-name{display:none}
/* the turned fields */
body.ls .board .grid.field{flex:1 1 0;grid-template-columns:repeat(3,1fr)!important;grid-template-rows:none!important;grid-auto-rows:1fr;aspect-ratio:auto!important;height:100%;width:auto!important}
body.ls .board .grid.field .cell{aspect-ratio:auto!important;min-height:0;height:auto}
${pos}
body.ls #app>.sb-el{flex-direction:column;align-items:flex-start;gap:4px}
body.ls #app>.sb-el .pool{display:flex;flex-wrap:wrap;gap:4px;justify-content:flex-start}
body.ls #app>.sb-piles{flex-direction:column;align-items:stretch;gap:4px}
body.ls #app>.sb-piles .piles{display:flex;flex-wrap:wrap;gap:4px}
body.ls #app>.sb-piles .pill{min-height:34px;padding:4px 10px}
body.ls #app>.bact .pill{flex:0 0 auto;min-height:38px}
body.ls[data-bfit] #app>.sb-opp{display:block;text-align:right;padding:0;margin:0;min-height:0}body.ls #app>.sb-opp .pool{display:flex;flex-wrap:nowrap;justify-content:flex-end;gap:2px;width:100%;margin-top:4px}
body.ls #app>.front .qhint{display:none}body.ls #app>.front,body.ls #app>.front .qs{height:auto;flex-wrap:wrap;justify-content:flex-start;gap:4px}body.ls #app>.front::before{display:none}
body.ls #app>.hand.mini{zoom:var(--lsZ,.6)!important;padding-top:8px!important;margin-top:0!important}
/* sideways the hand lies flat (no fan tilt), so the cards stand straight and fully on screen */
body.ls #app>.hand.mini.lfan>.card{--r:0deg!important;--y:0px!important}body.ls #app>.hand.mini.lfan>.card.lup{--y:-10px!important}
body.ls #app>.bact .pill,body.ls #app>.sb-piles .pill,body.ls #app>.acts .btn{min-height:44px!important}
body.ls #app>.front>*,body.ls #app>.front .qs>*{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
body.ls #app>.front .qc{max-width:calc(var(--lsL,150px) - 4px);box-sizing:border-box;display:flex;align-items:center;min-width:0}body.ls #app>.front .qc>i{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
body.ls #app>.sb-el .pool{flex-wrap:nowrap!important;gap:2px!important}body.ls #app>.sb-el .pool .chip{padding-inline:4px}
/* the result window: the list scrolls, its buttons stay at the bottom */
body.ls .over .box>.acts{position:sticky;bottom:-16px;margin-bottom:-16px;padding:22px 0 16px;background:linear-gradient(180deg,rgba(28,36,54,0),#1C2436 14px);z-index:2;margin-inline:-16px;padding-inline:16px}
body.ls .over .box{box-sizing:border-box;max-height:calc(100dvh - 16px);overflow-y:auto}
/* other screens stay as in the portrait game: the main menu keeps its tall layout and scrolls */
body.ls .lby{overflow-y:auto;overflow-x:hidden}
body.ls .lby-in{height:auto;min-height:max(100%,760px)}
}
@media (orientation:portrait){body.ls .ls-turn{display:flex;position:fixed;inset:0;z-index:9999;background:#0B111Ef7;color:#E8ECF4;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:24px;font-size:17px}
body.ls .ls-turn b{font-size:44px;line-height:1}}
`;document.head.appendChild(st);
  const tn=document.createElement('div');tn.className='ls-turn';tn.innerHTML='<b>⤾</b><div>Поверни телефон боком.<br>Это пробная горизонтальная версия экрана боя.</div>';document.body.appendChild(tn);
  // full screen also turns the screen sideways where the phone allows it (Android)
  document.addEventListener('fullscreenchange',()=>{try{if(document.fullscreenElement&&screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}catch(_){}});
  // the portrait screen fit is not used sideways: the side columns and the hand row have fixed places
  if(typeof layFit==='function'){const lf0=layFit;layFit=function(on){if(on&&lzOn())return lzFit();return lf0(on)}}
  if(typeof ntGrow==='function'){const ng0=ntGrow;ntGrow=function(){if(lzOn())return;return ng0()}}
  if(typeof fitBoard==='function'){const fb0=fitBoard;fitBoard=function(){if(lzOn())return lzBoard();return fb0()}}
  addEventListener('resize',()=>{if(typeof render==='function')requestAnimationFrame(()=>render())});
}
function lzFit(){const B=document.body;B.dataset.bfit=1;delete B.dataset.tight;B.style.removeProperty('--bw');
  const W=innerWidth,H=innerHeight,sm=H<380;
  B.style.setProperty('--lsL',(sm?128:Math.min(170,Math.round(W*.17)))+'px');B.style.setProperty('--lsR',(sm?134:Math.min(160,Math.round(W*.16)))+'px');
  B.style.setProperty('--lsH',Math.round(H*.38)+'px');
  B.dataset.hcl=sm?'':'m';B.style.removeProperty('--hz');
  // the hand is scaled to fit its row
  const hd=app.querySelector('#app>.hand.mini');
  // sideways the enemy field is to the right of the hand, so a drag often starts more sideways than up: the hand never scrolls here, so any direction drags
  if(hd)hd.classList.remove('scr');
  if(hd){B.style.setProperty('--lsZ',1);const h=hd.getBoundingClientRect().height,av=Math.round(H*.38);
    if(h>0)B.style.setProperty('--lsZ',Math.max(.4,Math.min(1,(av-24)/h)).toFixed(3))
    // never past the bottom of the screen, whatever the cards show
    for(let i=0;i<6;i++){const b=hd.getBoundingClientRect().bottom;if(b<=H-2)break;const z=parseFloat(getComputedStyle(B).getPropertyValue('--lsZ'))||1;B.style.setProperty('--lsZ',(z*.96).toFixed(3))}}
  lzBoard()}
// the tilted board looks shorter than the room it takes (it leans back from its bottom edge): stretch it so the picture fills its area
function lzBoard(){const bd=app.querySelector('#app>.board');if(!bd)return;bd.style.height='';bd.style.marginTop='';
  bd.style.transform='none';const r0=bd.getBoundingClientRect();bd.style.transform='';if(!(r0.height>0))return;
  // the board sits on its own in its grid area (taken out of the flow), so it can be taller than the area without pushing the side columns
  const T=r0.height-12;let h=r0.height;for(let i=0;i<3;i++){const v=bd.getBoundingClientRect().height;if(!(v>0))return;const k=T/v;if(Math.abs(k-1)<.02)break;h=Math.min(T*1.8,h*k);bd.style.setProperty('height',Math.floor(h)+'px','important')}
  // then move it so the picture's top meets the area's top
  bd.style.setProperty('margin-top',Math.round(r0.top+12-bd.getBoundingClientRect().top)+'px','important')}
