/* ---------- 0.43 Anton (2026-10-16): the drawn creatures from the «Стая» roster replace the 100 code-drawn ones.
   Nothing new in the rules: every new creature takes the cards of an old creature of its family and class (its template):
   the same effects, numbers, areas and steps. Only the card names and the card elements change, to fit the picture.
   An «heir» keeps the template's elements exactly (puzzles, run packs and old saves move to it).
   A creature has no element of its own: its elements are the elements of its cards (at most 3, team at most 4).
   Data: R3 in 86f1-r3data.js; numbers from the balance thread: R3HP (health) and R3UP (card number multipliers). ---------- */
{
const ELR={'огонь':'f','вода':'w','воздух':'a','земля':'e','свет':'l','тьма':'d','хаос':'z','порядок':'n'};
const byN={};for(const p of PETS)byN[p.n]=p;
const OLDI={};PETS.forEach((p,i)=>OLDI[p.n]=i);
const HEIR={},KMAP={},SIG={},NEW=[];
const mapO=(o,M)=>{if(!o)return o;const r={};for(const e in o){const n=M[e]||e;r[n]=(r[n]||0)+o[e]}return r};
const canon=v=>v&&typeof v==='object'&&!Array.isArray(v)?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canon(v[k])).join(',')+'}':JSON.stringify(v);
const sigOf=t=>{const o={};for(const f in t)if(!['n','base','altk','dnOf'].includes(f))o[f]=t[f];return canon(o)};
function clone(k,M,name,nk,heir){
  const out={};
  for(const [src,dst,nm] of [[k,nk,name],[k+'+',nk+'+',name+'+']]){const t0=T[src];if(!t0)continue;const t=JSON.parse(JSON.stringify(t0));
    if(t.el)t.el=M[t.el]||t.el;if(t.dg)t.dg=M[t.dg]||t.dg;for(const f of['cost','dcost','gain'])if(t[f])t[f]=mapO(t[f],M);
    t.n=nm;delete t.dnOf;out[dst]=t}
  // same ▲ + ▼ + elements as a card already made = the same card (one card, one name). If that card has another name
  // (it was made for a different body), this one gets a slightly different main number, so it is its own card with its own name
  const VAR=[1,1.1,0.9,1.2,0.8,1.3,0.7,1.4,1.5];
  const sc=(x,v)=>{let y=Math.max(1,Math.round(x*v));if(y===x)y=Math.max(1,x+(v>1?1:-1));return y};
  for(const v of VAR){const c={};let ok=v===1;for(const x in out){const t=JSON.parse(JSON.stringify(out[x]));if(v!==1){let done=0;for(const f of['dmg','heal','shield','exec','chain'])if(t[f]){t[f]=sc(t[f],v);done=1;break}
        if(!done&&t.trap&&t.trap.dmg){t.trap.dmg=sc(t.trap.dmg,v);done=1}
        if(!done&&t.sub)for(const f of['colDmg','frontDmg','shield','allShield','heal','allHeal'])if(t.sub[f]){t.sub[f]=sc(t.sub[f],v);done=1;break}
        if(done)ok=1}
      c[x]=t}
    if(!ok)break;
    const s=sigOf(c[nk]),o=SIG[s];if(o&&(T[o].n===name||heir&&v===1))return o;if(o)continue;SIG[s]=nk;Object.assign(T,c);return nk}
  // nothing to vary: the same card as another body, it keeps the name it got first
  const o=SIG[sigOf(out[nk])];if(o)return o;throw new Error('R3: no card for '+name)}
// heirs first: they keep the template's cards exactly (puzzles depend on them); an old card two old creatures shared stays one card. The others vary around them
const R3o=[...R3.filter(r=>r[5]),...R3.filter(r=>!r[5])],NI3={};R3.forEach((r,i)=>NI3[r[0]]=i);const NEWi=[];
for(const [n,img,fam,cls,tn,heir,em,names] of R3o){
  const t=byN[tn];if(!t)throw new Error('R3: no template '+tn);
  const M={};for(const pr of (em?em.split(','):[])){const[a,b]=pr.split('>');M[ELR[a]||a]=ELR[b]||b}
  const old=[...t.cards,...(t.alt||[])];
  const ks=old.map((k,i)=>{const nk=clone(k,M,names[i],'c3_'+img+'_'+i,heir);if(heir)KMAP[n+'|'+k]=nk;return nk});
  const p={...t,n,img,ic:'',fam,cls,cards:ks.slice(0,3),alt:ks.slice(3),tpl:tn};delete p.gen2;
  if(typeof R3HP!=='undefined'&&R3HP[n])p.hp=R3HP[n];
  NEWi[NI3[n]]=p;if(heir)HEIR[tn]=n}
NEW.push(...NEWi);
// card number tuning from the balance thread (×m on the main numbers of a card and its «+» copy)
if(typeof R3UP!=='undefined')for(const k0 in R3UP)for(const k of[k0,k0+'+']){const t=T[k],m=R3UP[k0];if(!t||m===1)continue;
  for(const f of['dmg','heal','shield','exec','chain'])if(t[f])t[f]=Math.max(1,Math.round(t[f]*m));
  if(t.trap&&t.trap.dmg)t.trap={...t.trap,dmg:Math.max(1,Math.round(t.trap.dmg*m))}}
if(typeof R3DN!=='undefined')for(const k0 in R3DN)for(const k of[k0,k0+'+']){const t=T[k],m=R3DN[k0];if(!t||!t.sub||m===1)continue;const s={...t.sub};
  for(const f of['colDmg','frontDmg','shield','allShield','heal','allHeal'])if(s[f])s[f]=Math.max(1,Math.round(s[f]*m));t.sub=s;delete DNK[k];delete T[k+'~dn']}
PETS.length=0;for(const p of NEW){p.els=cardEls(p.cards||[]);PETS.push(p)}
globalThis.R3HEIR=HEIR;
// everything that named an old creature now names its heir
const hn=n=>HEIR[n]||n;
for(let i=0;i<START_UNLOCK.length;i++)START_UNLOCK[i]=hn(START_UNLOCK[i]);
for(const k in PACKS)if(PACKS[k].l)PACKS[k].l=PACKS[k].l.map(hn);
for(const z of PUZ){const pn=z.P.map(x=>x.n);for(const x of z.P)x.n=hn(x.n);for(const x of z.B)x.n=hn(x.n);
  for(const h of z.hand||[]){const o=pn[h.p],nk=o&&KMAP[hn(o)+'|'+h.t];if(nk)h.t=nk}}
for(const o in PUZMAX)if(HEIR[o]){PUZMAX[HEIR[o]]=PUZMAX[o];delete PUZMAX[o]}
RATE70.p=typeof R3RATE!=='undefined'?R3RATE:{};
// old saves: progress of an old creature moves to its heir; teams and runs saved by number are cleared
if(META&&!META.r3){const P=META.pets||{},np={};
  for(const o in P){const n=HEIR[o];if(n)np[n]=P[o]}
  META.pets=np;
  if(META.pst){const s={};for(const o in META.pst)if(HEIR[o])s[HEIR[o]]=META.pst[o];META.pst=s}
  const NI={};PETS.forEach((p,i)=>NI[p.n]=i);const oldN=Object.keys(OLDI);
  META.lastQ=(META.lastQ||[]).map(i=>{const o=oldN.find(n=>OLDI[n]===i);return o&&HEIR[o]?NI[HEIR[o]]:null}).filter(i=>i!=null);
  delete META.run;META.shop=null;delete META.frx;META.r3=1}
for(const p of PETS)META.pets[p.n]=META.pets[p.n]||{xp:0,fr:0,gr:0,un:START_UNLOCK.includes(p.n)};
ensureMeta();syncRar();saveMeta();
}
