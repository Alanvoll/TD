/* ---------- 0.33.0 (Anton 2026-10-13): only known elements. «Любая» in a ▲ cost becomes more of the card's own element ---------- */
for(const k in T){const t=T[k],c=t.cost;if(c&&c.any){const e=t.el&&t.el!=='*'?t.el:Object.keys(c).find(x=>x!=='any');c[e]=(c[e]||0)+c.any;delete c.any}}
