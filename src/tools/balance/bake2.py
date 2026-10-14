# merge the relative tuning in altk.json into the ALTK table already baked into 79-scale.js
import json,re
F='/mnt/project-files/pack-battle/src/js/79-scale.js';s=open(F).read()
m=re.search(r'const ALTK=(\{.*?\});\n',s);B=json.loads(m.group(1));R=json.load(open('altk.json'))
for k,o in R.items():
  b=B.get(k,{});mm=round(b.get('m',1)*o.get('m',1),3)
  st=dict(b.get('st',{}))
  for f,v in (o.get('st') or {}).items():st[f]=st.get(f,0)+v
  st={f:v for f,v in st.items() if v}
  n={}
  if mm!=1:n['m']=mm
  if st:n['st']=st
  if n:B[k]=n
  else:B.pop(k,None)
s=s[:m.start(1)]+json.dumps(B,ensure_ascii=False,separators=(',',':'))+s[m.end(1):]
open(F,'w').write(s);print(len(B))
