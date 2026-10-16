/* ---------- 0.43: with 294 drawn creatures the library got three times longer and slow on a phone.
   1) each library background is drawn once into a picture (the same drawing as before), so a tile carries a small link, not a whole drawing;
   2) tiles far off screen are not laid out until they scroll near, so opening the creature window over the library stays quick. ---------- */
if(typeof libBg==='function'&&typeof document!=='undefined'&&typeof Blob!=='undefined'&&typeof URL!=='undefined'&&URL.createObjectURL){
  const bg1=libBg,cu=new Map();
  libBg=i=>{let v=cu.get(i);if(v!=null)return v;const s=bg1(i),m=/^<span class="lbg" style="([^"]*)"><svg ([^>]*)>([\s\S]*)<\/svg><\/span>$/.exec(s);
    if(!m){cu.set(i,s);return s}
    const u=URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" ${m[2]}>${m[3]}</svg>`],{type:'image/svg+xml'}));
    v=`<span class="lbg" style="${m[1]}"><i class="lbgs" style="background-image:url(${u})"></i></span>`;cu.set(i,v);return v}}
if(typeof document!=='undefined'){const st=document.createElement('style');
  st.textContent=`.lbg .lbgs{position:absolute;inset:0;display:block;background-position:50% 100%;background-size:cover;background-repeat:no-repeat}
.lcd,div.pt{content-visibility:auto;contain-intrinsic-size:auto 150px}
/* 0.43 critic fixes (in a style added last, so the earlier screen styles do not override them):
   drawn creatures on the field get a soft light edge and a little more colour, so they stand out from the dark cells,
   and stand slightly smaller on the cell bottom, so health bars do not cover the creature behind */
.grid .cell .av.art .cri{filter:drop-shadow(0 0 1.2px #ffffffc8) drop-shadow(0 0 3px #ffffff4a) saturate(1.15) brightness(1.12)}
.grid .cell:not(.big) .av.art{scale:.86;transform-origin:50% 100%}
/* small portraits (card corner, team chips) show the head, in a round frame with a light ring */
.zc .zpet{border-radius:50%;overflow:hidden;background:radial-gradient(70% 70% at 50% 40%,#3a4a6a,#1a2234);box-shadow:0 0 0 1.5px #ffffff8c}
.zc .zpet .cri{object-fit:contain;object-position:50% 0;transform:scale(1.7);transform-origin:50% 4%}
.zc .zpet .cri{width:20px;height:20px}
.tbar .ts{border-radius:50%!important}
.tbar .ts .em{border-radius:50%!important;overflow:hidden;box-shadow:0 0 0 1.5px #ffffff8c,0 3px 0 #070A12!important}
.tbar .ts .em .cri{object-position:50% 0;transform:scale(1.45);transform-origin:50% 4%}
.tbar .ts .fmb,.tbar .ts .clb{width:14px!important;height:14px!important;font-size:8px!important;line-height:12px!important}
.tbar .ts .fmb{left:-6px!important;bottom:-6px!important}.tbar .ts .clb{right:-6px!important;bottom:-6px!important}
.tbar .ts .tx{top:-8px!important;right:-8px!important}
.qc.done{opacity:.55!important}
.lcd-art{padding-top:24px!important}
.lib .lcd-nm[style*="font-size:11px"]{font-size:11px!important}
.lcd-ft{padding-top:22px!important;margin-top:-22px!important;background:linear-gradient(transparent,#070c15f4 46%)!important}
.lbig .sil0{display:flex;width:100%;height:100%}
.pk .pt-av .cri{width:46px!important;height:46px!important;margin-top:0!important}
.pt-av .lvb{bottom:-9px!important}
.tbar .ts{aspect-ratio:1}
.grid.enemyg .cell .av.art .cri{filter:drop-shadow(0 0 1.2px #ffffffd8) drop-shadow(0 0 3px #ffffff55) saturate(1.2) brightness(1.22)}
`;
  document.head.appendChild(st)}
/* the creature window fits the screen by halving the step (a few measurements instead of up to forty); same sizes as before */
if(typeof lsFit==='function'){lsFit=function(){const bx=document.querySelector('.lsheet'),pn=bx&&bx.querySelector('.ls-pn');if(!pn)return;
  pn.style.zoom='';const c=bx.querySelector('.lslc'),av=innerHeight-20,set=v=>bx.style.setProperty('--cz',v.toFixed(3)),fits=()=>bx.scrollHeight<=av;
  const cz0=Math.min(1,c?(c.clientWidth-8)/121:.8);set(cz0);if(fits())return;
  set(.56);if(fits()){let lo=.56,hi=cz0;for(let k=0;k<6;k++){const m=(lo+hi)/2;set(m);if(fits())lo=m;else hi=m}set(lo);return}
  let lo=.6,hi=1;pn.style.zoom='.6';if(!fits())return;for(let k=0;k<6;k++){const m=(lo+hi)/2;pn.style.zoom=m.toFixed(2);if(fits())lo=m;else hi=m}pn.style.zoom=lo.toFixed(2)}}
/* backgrounds are drawn in quiet moments after start, a few at a time, so the first visit to the library is quick too */
if(typeof libBg==='function'&&typeof requestIdleCallback==='function'){let k=0;
  // the first screen of the library (its pictures and backgrounds) is also decoded ahead
  const warm=()=>{try{for(const i of libList().slice(0,15)){const p=PETS[i],a=new Image();a.src=crS(p);a.decode().catch(()=>{});const u=/url\(([^)]+)\)/.exec(libBg(i));if(u){const b=new Image();b.src=u[1];b.decode().catch(()=>{})}}}catch(e){}};
  const step=d=>{while(k<PETS.length&&d.timeRemaining()>4)libBg(k++);if(k<PETS.length)requestIdleCallback(step);else warm()};requestIdleCallback(step)}
