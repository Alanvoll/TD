# model-based search for strong teams (creature + pair betas), plus random teams for the baseline
import json,random,itertools,sys
pref=sys.argv[1];A=json.load(open(pref+'_an.json'));n=len(A['beta']);be=A['beta']
pb={tuple(map(int,k.split(','))):v[2] for k,v in A['pairs'].items()}
sc=lambda t:sum(be[i] for i in t)+sum(pb.get(tuple(sorted(p)),0) for p in itertools.combinations(t,2))
random.seed(7);found={}
for r in range(400):
  t=random.sample(range(n),5)
  while True:
    best=sc(t);bt=None
    for k in range(5):
      for x in range(n):
        if x in t:continue
        u=t[:k]+[x]+t[k+1:];s=sc(u)
        if s>best+1e-9:best,bt=s,u
    if not bt:break
    t=bt
  found[tuple(sorted(t))]=sc(t)
# add near-optimal variants: single swaps of found teams with high score
cand=sorted(found.items(),key=lambda x:-x[1])
pool=dict(cand)
for t,_ in cand[:40]:
  for k in range(5):
    for x in range(n):
      if x in t:continue
      u=tuple(sorted(t[:k]+(x,)+t[k+1:]));pool[u]=sc(u)
top=[list(t) for t,_ in sorted(pool.items(),key=lambda x:-x[1])[:150]]
rnd=[random.sample(range(n),5) for _ in range(150)]
json.dump(top+rnd,open('teams.json','w'));print(len(found),'local optima; top score',round(cand[0][1],2),'teams',len(top+rnd))
