import json,sys,re
F='/mnt/project-files/pack-battle/src/js/78-later.js'
L=open(F).read().split('\n')
idx=[k for k,l in enumerate(L) if l.startswith('const PUZ=')][0]
line=L[idx]; pre='const PUZ='; body=line[len(pre):]; end=body.rstrip().endswith(';')
arr=json.loads(body.rstrip().rstrip(';'))
for a in sys.argv[1:]:
    i,f=a.split(':'); i=int(i); t=open(f).read().strip().split('\n')[-1]
    if t.startswith('{'):
        o=json.loads(t); arr[i]['sol']=o['sol']
        for b,h in zip(arr[i]['B'],o['hp3']): b['hp3']=h
    else: arr[i]['sol']=json.loads(t)
    print(i,'patched')
L[idx]=pre+json.dumps(arr,ensure_ascii=False,separators=(',',':'))+(';' if end else '')
open(F,'w').write('\n'.join(L))
