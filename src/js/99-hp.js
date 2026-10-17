/* ---------- 0.44.1 Anton: health bars stand UNDER each creature (own and enemy), not high above the head.
   The field is a 3D scene, so a creature in the row in front would hide the bar of the one behind it.
   The bar keeps its place under the creature's feet (invisible there), and a copy is drawn on a flat layer over the field exactly at that place. ---------- */
const hpl=typeof document!=='undefined'&&document.body?document.createElement('div'):null,hpEls=new Map();
if(hpl){hpl.id='hpl';document.body.appendChild(hpl);
  const st=document.createElement('style');st.textContent=`
body .board .grid.field .cell .pet>.hp,body .board .grid.field .cell .pet>.hpn{visibility:hidden}
#hpl{position:fixed;inset:0;pointer-events:none;z-index:4;overflow:hidden}
#hpl .hpo{position:absolute;left:0;top:0;display:flex;flex-direction:column;align-items:center;transform-origin:0 0}
#hpl .hpo .hp{overflow:hidden;flex:none}#hpl .hpo .hp i{display:block;height:100%}
#hpl .hpo .hpn{position:relative;white-space:nowrap;width:max-content;font-variant-numeric:tabular-nums}`;document.head.appendChild(st)}
const hpCss=(e,ks)=>{const s=getComputedStyle(e);return ks.map(k=>k+':'+s.getPropertyValue(k)).join(';')};
function hpSync(){if(!hpl)return;
  const on=typeof G!=='undefined'&&G&&G.phase==='battle',seen=new Set();
  if(on)for(const pe of app.querySelectorAll('.board .grid.field .cell .pet[data-pid]')){
    const hp=pe.querySelector(':scope>.hp'),hn=pe.querySelector(':scope>.hpn'),id=pe.dataset.pid;if(!hp||!hn)continue;
    const w=hp.offsetWidth,r=hp.getBoundingClientRect();if(!w||!r.width)continue;seen.add(id);
    let d=hpEls.get(id);if(!d){d=document.createElement('div');d.className='hpo';d.innerHTML='<div class="hp"><i></i></div><div class="hpn"></div>';hpl.appendChild(d);hpEls.set(id,d)}
    // far creatures are drawn small; their number never gets smaller than 9 px on screen
    const fs=parseFloat(getComputedStyle(hn).fontSize)||9,s=Math.max(r.width/w,9/fs),tf=`translate(${(r.left+r.width/2-w/2*s).toFixed(1)}px,${r.top.toFixed(1)}px) scale(${s.toFixed(3)})`;
    if(d._tf!==tf){d.style.transform=tf;d._tf=tf}
    const b=d.firstChild,i=b.firstChild,n=d.lastChild,hi=hp.firstElementChild;
    const k=[w,hp.offsetHeight,hpCss(hp,['border-radius','background-color','box-shadow']),hi?hpCss(hi,['background-color','background-image','border-radius']):'',
      hpCss(hn,['font-size','line-height','font-weight','font-family','color','text-shadow','margin-top','letter-spacing'])].join('|');
    if(d._k!==k){d._k=k;const p=k.split('|');d.style.width=w+'px';b.style.cssText=`width:${w}px;height:${p[1]}px;${p[2]}`;i.style.cssText=p[3];n.style.cssText=p[4]}
    const iw=hi?hi.style.width:'0';if(i.style.width!==iw)i.style.width=iw;
    if(n.textContent!==hn.textContent)n.textContent=hn.textContent;
    if(d.hidden)d.hidden=false}
  for(const[id,d]of hpEls)if(!seen.has(id)){d.remove();hpEls.delete(id)}}
if(hpl&&typeof setApp==='function'){const sa0=setApp;setApp=function(h){const v=sa0.apply(this,arguments);hpSync();return v}}
if(hpl&&typeof addEventListener==='function')addEventListener('resize',()=>{requestAnimationFrame(hpSync);setTimeout(hpSync,120)});
// the creature's order numbers and effect badges sat on its feet; the feet are now above the health bar
if(hpl){const st=document.createElement('style');st.textContent=`body .board .grid.field .cell .pet .ovl,body .board .grid.field .cell .pet .ovr{bottom:24px}`;document.head.appendChild(st)}
