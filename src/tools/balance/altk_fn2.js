function applyAltK(A){const STF=['stun','slow','root','mark','ign','evade','immune','strip','pull','push'];for(const k in A){const t=T[k],o=A[k];if(!t||t.altk2)continue;t.altk2=1;const m=o.m||1,r=v=>v>0?Math.max(1,Math.round(v*m)):v;
  if(m!==1){for(const f of SCF)if(typeof t[f]==='number')t[f]=r(t[f]);if(t.trap&&typeof t.trap.dmg==='number')t.trap={...t.trap,dmg:r(t.trap.dmg)};if(t.sum&&typeof t.sum.hp==='number')t.sum={...t.sum,hp:r(t.sum.hp)}}
  if(o.st)for(const f in o.st)if(typeof t[f]==='number')t[f]=Math.max(1,Math.min(3,t[f]+o.st[f]))}}
