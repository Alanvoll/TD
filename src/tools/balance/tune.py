# hp tune from analysis: writes hp.json (name->hp) applied on top of the build
import json,sys
pref,k,thr=sys.argv[1],float(sys.argv[2]),float(sys.argv[3])
names=json.load(open('names.json'));A=json.load(open(pref+'_an.json'))
try:hp=json.load(open('hp.json'))
except Exception:hp={}
ch=0
for i,(n,h0,fam,cls) in enumerate(names):
  w=A['wr'][i];cur=hp.get(n,h0)
  if abs(w-50)<thr:continue
  nh=round(cur*(1+(50-w)*k));nh=max(round(h0*0.65),min(round(h0*1.45),nh))
  if nh!=cur:hp[n]=nh;ch+=1
json.dump(hp,open('hp.json','w'),ensure_ascii=False);print('changed',ch)
