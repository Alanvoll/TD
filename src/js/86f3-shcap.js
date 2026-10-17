/* ---------- 0.44 Anton (2026-10-17): shield and heal cards are played like attacks, only on own cells, with all attack shapes.
   «Своему пету» becomes one own cell. «Всем своим» shield/heal cards each take one shape (line of 3, row, column, cross,
   square 2×2 or still all own), picked from the card key so a card always gets the same shape; their numbers grow by the
   same ratio attacks have between that shape and «все враги». Cards «на себя» and cards without heal or shield stay as they were. */
const OWN_K={o_hline:1.93,o_row:2.16,o_col:2.07,o_cross:1.37,o_sq2:1.67,allies:1},OWN_L=Object.keys(OWN_K);
const ownHash=s=>{let h=7;for(const ch of s)h=(h*31+ch.charCodeAt(0))>>>0;return h};
for(const k in T){const t=T[k];if(!t||!(t.heal||t.shield))continue;
  if(t.area==='ally')t.area='o_cell';
  else if(t.area==='allies'){const a=OWN_L[ownHash(k)%OWN_L.length],m=OWN_K[a];t.area=a;
    if(m!==1){if(t.heal)t.heal=Math.max(1,Math.round(t.heal*m));if(t.shield)t.shield=Math.max(1,Math.round(t.shield*m))}}}
/* 0.43.1 (Anton 2026-10-17): a card never shows a shield bigger than the cap it can actually give (30 at base Сила). */
for(const k in T){const t=T[k];if(!t)continue;if(t.shield>SHIELD_CAP)t.shield=SHIELD_CAP;if(t.sub&&t.sub.shield>SHIELD_CAP)t.sub.shield=SHIELD_CAP}
