# slot/card analysis for fightsM data: usage python3 anM.py prefix
import json,glob,sys,collections
pref=sys.argv[1];P=json.load(open('pets.json'))
F=[json.loads(l) for f in sorted(glob.glob(pref+'_*.jsonl')) for l in open(f) if l.strip()]
S=collections.defaultdict(lambda:[0,0]) # (pet,slot,choice)->[wins,n]
for g in F:
  for side,sl,w in ((g['a'],g['sa'],g['r']),(g['b'],g['sb'],1-g['r'])):
    for i,s in zip(side,sl):
      for j,ch in enumerate(s):
        o=S[(i,j,int(ch))];o[0]+=w;o[1]+=1
rows=[]
for i,p in enumerate(P):
  for j,a in enumerate(p['alt']):
    if not a:continue
    b0=S[(i,j,0)];b1=S[(i,j,1)]
    if b0[1]<50 or b1[1]<50:continue
    w0=100*b0[0]/b0[1];w1=100*b1[0]/b1[1]
    rows.append(dict(pet=p['n'],slot=j+1,base=p['cards'][j][1],alt=a[1],kb=p['cards'][j][0],ka=a[0],wb=round(w0,1),wa=round(w1,1),d=round(w1-w0,1),n=min(b0[1],b1[1])))
json.dump(rows,open(pref+'_slots.json','w'),ensure_ascii=False)
rows.sort(key=lambda r:-abs(r['d']))
print('games',len(F),'slots',len(rows))
for r in rows[:25]:print(f"{r['pet']:16} {r['slot']} {r['base']:22} {r['wb']:5} | {r['alt']:22} {r['wa']:5}  d {r['d']:+5} n{r['n']}")
