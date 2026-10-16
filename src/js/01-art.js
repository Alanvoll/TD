/* ART-BEGIN: 0.43 (Anton 2026-10-16): creatures are the drawn pictures from the «Стая» roster (Codex art), not code drawings.
   Every creature has p.img (its roster number). The picture sits next to the page as a file cr/<n>.webp (≈288 px, enough for the field, lists and the creature window on a phone).
   Lists load it lazily; the field keeps the cheap CSS breathing. */
let LIVEART=true;try{LIVEART=localStorage.getItem('pb-live')!=='0'}catch(e){}
// battle units carry only the name: find the picture number by name
let PIMG=null;
const artK=p=>{if(!p)return null;if(p.img)return p.img;if(!PIMG||PIMG.n!==PETS.length){PIMG={n:PETS.length};for(const q of PETS)PIMG[q.n]=q.img}return PIMG[p.n]||null};
const crS=p=>'cr/'+artK(p)+'.webp',crB=crS;
const artOff=p=>{const k=(p.id||'')+p.n;let h=0;for(let i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))%9973;return h%400/100};
// still: a plain image (lists, cards). On the field the creature breathes (a CSS transform on the wrapper; «Лёгкие» turns it off)
const petIc=(p,still)=>{if(!artK(p))return p.ic||'';const im=`<img class="cri" src="${crS(p)}" alt=""${still?' loading="lazy"':''} decoding="async" draggable="false">`;
  if(still||!LIVEART)return im;const d=(-(performance.now()/1000+artOff(p))).toFixed(2);return`<span class="crw" style="--d:${d}s">${im}</span>`};
const petLive=p=>artK(p)?`<img class="cra crbig" src="${crB(p)}" alt="" decoding="async" draggable="false">`:(p.ic||'');
function hydrateLive(){}
/* ART-END */
