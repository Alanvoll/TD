import json,collections,re,sys
r=sys.argv[1];k0=float(sys.argv[2])
T=json.load(open(f'teams_{r}.json'));N=json.load(open('names.json'));A=json.load(open(f'{r}_an.json'))
R=[json.loads(l) for i in range(4) for l in open(f'tv{r}_{i}.jsonl') if l.strip()]
c=collections.Counter(i for x in R if x['w']/x['n']>=.7 for i in T[x['i']])
F='/mnt/project-files/pack-battle/src/js/63-roster2.js';s=open(F).read()
m=re.search(r'const HP32=(\{.*?\});',s);B=json.loads(m.group(1));ch=[]
for i,(n,h,f,cl) in enumerate(N):
  k=c.get(i,0);w=A['wr'][i];cur=B.get(n,h)
  f_=1-k0*k if k>=3 else 1
  if k<3 and w<47.5: f_=1+.01*(47.5-w)*2   # lift creatures that fell low, outside strong fives
  if w-50*0<46.5 and k>=3: f_=max(f_,1-k0*2)  # do not push weak ones much lower
  nh=round(cur*f_)
  if nh!=cur:B[n]=nh;ch.append((n,cur,nh))
s=s[:m.start(1)]+json.dumps(B,ensure_ascii=False,separators=(',',':'))+s[m.end(1):];open(F,'w').write(s);print(len(ch),ch[:40])
