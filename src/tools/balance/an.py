# analysis of fights: per-creature win%, ridge-logistic contribution with pair terms, pair win rates
import json,sys,glob,itertools,numpy as np
pref=sys.argv[1]
names=json.load(open('names.json'));n=len(names)
F=[json.loads(l) for f in sorted(glob.glob(pref+'_*.jsonl')) for l in open(f) if l.strip()]
w=np.zeros(n);g=np.zeros(n)
for x in F:
  for i in x['a']:g[i]+=1;w[i]+=x['r']
  for i in x['b']:g[i]+=1;w[i]+=1-x['r']
wr=100*w/g
# pairs (same team)
pw={};pg={}
for x in F:
  for side,r in((x['a'],x['r']),(x['b'],1-x['r'])):
    for p in itertools.combinations(sorted(side),2):pg[p]=pg.get(p,0)+1;pw[p]=pw.get(p,0)+r
# logistic with creature terms + pair terms, ridge
P=sorted(pg);pid={p:k for k,p in enumerate(P)};m=n+len(P)+1
IDX=[];SG=[];y=[]
for x in F:
  if x['r']==.5:continue
  ii=[];ss=[]
  for s,side in((1,x['a']),(-1,x['b'])):
    for i in side:ii.append(i);ss.append(s)
    for p in itertools.combinations(sorted(side),2):ii.append(n+pid[p]);ss.append(s)
  ii.append(m-1);ss.append(1);IDX.append(ii);SG.append(ss);y.append(x['r'])
IDX=np.array(IDX);SG=np.array(SG,dtype=float);y=np.array(y);N=len(y)
lam=np.full(m,1.0);lam[n:m-1]=8.0;lam[m-1]=0
b=np.zeros(m)
for it in range(1500):
  z=np.clip((b[IDX]*SG).sum(1),-30,30);pr=1/(1+np.exp(-z))
  gr=np.zeros(m);np.add.at(gr,IDX,SG*(pr-y)[:,None]);gr=gr/N+lam*b/N
  b-=2.0*gr
bc=b[:n]-b[:n].mean()
contrib=100*(1/(1+np.exp(-bc))-.5)  # win% change for a team when swapping an average creature for this one
pairb=b[n:m-1]
json.dump({'wr':wr.tolist(),'g':g.tolist(),'beta':b[:n].tolist(),'contrib':contrib.tolist(),'pairs':{f'{a},{c}':[pw[(a,c)]/pg[(a,c)]*100,pg[(a,c)],float(pairb[pid[(a,c)]])] for a,c in P},'side':float(b[m-1]),'nf':len(F)},open(pref+'_an.json','w'))
o=np.argsort(-wr)
print('fights',len(F),'sideA beta',round(b[m-1],3),'outside 45-55:',int(((wr<45)|(wr>55)).sum()))
for i in list(o[:8])+list(o[-8:]):print(f'{names[i][0]:18s} {wr[i]:5.1f} contrib {contrib[i]:+5.1f} hp {names[i][1]}')
pp=sorted(((pw[p]/pg[p]*100,pg[p],p) for p in P if pg[p]>=60),reverse=True)
print('top pairs');[print(f'  {names[a][0]}+{names[c][0]} {v:.1f}% n{k}') for v,k,(a,c) in pp[:8]]
print('pairs >=70%:',sum(1 for v,k,_ in pp if v>=70))
