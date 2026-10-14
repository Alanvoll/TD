# second-card tuning: make each slot's second card as strong as its first. usage: python3 tuneAlt.py prefix [gain]
import json,sys
pref=sys.argv[1];g=float(sys.argv[2]) if len(sys.argv)>2 else 1.0
rows=json.load(open(pref+'_slots.json'));C=json.load(open('altcards.json'))
try:K=json.load(open('altk.json'))
except Exception:K={}
ch=0
for r in rows:
  d=r['d'];k=r['ka']
  if abs(d)<3 or k not in C or C[k]['shared']:continue
  o=K.get(k,{'m':1,'s':0})
  nm=o['m']*(1-.011*d*g)
  if C[k]['num'] and .55<=nm<=1.7:o['m']=round(nm,3)
  else:
    o['m']=round(max(.55,min(1.7,nm)),3)
    st=C[k].get('st',[])
    if st and abs(d)>=5:
      f=st[0];o.setdefault('st',{});cur=C[k]['stv'][0]+o['st'].get(f,0);step=-1 if d>0 else 1
      if 1<=cur+step<=3:o['st'][f]=o['st'].get(f,0)+step
  K[k]=o;ch+=1
json.dump(K,open('altk.json','w'),ensure_ascii=False,indent=0);print('changed',ch)
# creature level: pets still outside 47-53 at this level get all their second cards nudged
if len(sys.argv)>3:
  A=json.load(open(pref+'_an.json'));P=json.load(open('pets.json'));n2=0
  for i,p in enumerate(P):
    w=A['wr'][i]
    if abs(w-50)<3:continue
    for a in p['alt']:
      if not a or a[0] not in C or C[a[0]]['shared']:continue
      o=K.get(a[0],{'m':1,'s':0});o['m']=round(max(.55,min(1.7,o['m']*(1-.012*(w-50)))),3);K[a[0]]=o;n2+=1
  json.dump(K,open('altk.json','w'),ensure_ascii=False,indent=0);print('creature nudges',n2)
