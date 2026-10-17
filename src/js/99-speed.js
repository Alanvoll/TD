/* ---------- 0.44.1 Anton («бой очень сильно лагает»): the battle re-measured the whole screen on almost every draw.
   1) every draw patches the board's attributes, which dropped its perspective fit, so the board was measured again (two full layouts);
      now the fit is kept while nothing that changes the board's size has changed;
   2) on tall phones the hand tried to grow on every draw when there was no room for it (a full restyle of the page each time);
      now it tries twice per screen layout and then reuses the answer. Same sizes as before. ---------- */
if(typeof fitBoard==='function'&&typeof document!=='undefined'){const fb0=fitBoard,fbC=new WeakMap();
  const sig=b=>{const B=document.body;return[innerWidth,innerHeight,B.className.replace(/\b(dragging|nt-meas)\b/g,''),B.dataset.hcl,B.dataset.tight,B.dataset.tn,B.dataset.lay,B.getAttribute('style'),app.className,
    b.childElementCount,...[...b.children].map(e=>e.className+'|'+(e.getAttribute('style')||''))].join('/')};
  fitBoard=function(){const bs=[...document.querySelectorAll('.board')];
    if(bs.length&&bs.every(b=>{const c=fbC.get(b);return c&&c.k===sig(b)})){for(const b of bs)b.style.marginTop=fbC.get(b).m;return}
    fb0();for(const b of bs)fbC.set(b,{k:sig(b),m:b.style.marginTop})}}
if(typeof ntGrow==='function'&&typeof document!=='undefined'){const ng0=ntGrow;let gk='',gn=0,gz='';
  ntGrow=function(){const hd=app.querySelector('.hand.mini:not(.lpl)');if(!hd)return ng0();
    const k=[layFitK,innerWidth,innerHeight,hd.childElementCount].join('|');if(k!==gk){gk=k;gn=0}
    if(gn>=2){if(gz&&!hd.style.zoom)hd.style.zoom=gz;return}
    gn++;ng0();gz=hd.style.zoom||''}}
/* 3) the screen switches between two layouts every turn (cards in hand / the order of play). Each switch searched the fit anew
      (up to 7 full measurements, a visible stall on small phones); a layout already found is now reused while it still fits. */
if(typeof layFit==='function'&&typeof document!=='undefined'){const lf1=layFit,lfC=new Map(),B=document.body;
  const lfKey=()=>{const hd=app.querySelector('.hand.mini');return[innerWidth,innerHeight,typeof TN!=='undefined'?TN:5,LAY,hd?hd.children.length:0,[...app.children].map(e=>e.className).filter(c=>!/^(over|toast|detail)\b|\bnt-tip\b/.test(c)).join('|')].join('/')};
  const put=(a,v)=>{if(v==null)delete B.dataset[a];else B.dataset[a]=v},prop=(a,v)=>{if(v)B.style.setProperty(a,v);else B.style.removeProperty(a)};
  layFit=function(on){if(!on)return lf1(on);
    const k=lfKey(),c=k!==layFitK&&lfC.get(k);
    if(c){B.dataset.bfit=1;put('hcl',c.hcl);put('tight',c.tight);put('tn',c.tn);prop('--bw',c.bw);prop('--hz',c.hz);fitBoard();layFitK=k;if(layOver()>0)layFitK=''}
    const n=layFitN,v=lf1(on);
    if(layFitN!==n&&layFitK)lfC.set(layFitK,{hcl:B.dataset.hcl,tight:B.dataset.tight,tn:B.dataset.tn,bw:B.style.getPropertyValue('--bw'),hz:B.style.getPropertyValue('--hz')});
    return v}}
