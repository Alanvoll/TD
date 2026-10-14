#!/bin/bash
# lv1 20k -> analysis -> search -> verify top 60 (K 300)
r=$1
for s in 1 2 3 4; do F=g.html node fights.mjs ${NF:-5000} $((s+100*${#r}+${r: -1})) hard hp0.json > ${r}_$s.jsonl 2>${r}_$s.err & done; wait
python3 an.py $r > /dev/null 2>&1
python3 -c "
import json;A=json.load(open('${r}_an.json'));w=A['wr'];print('$r','min',round(min(w),1),'max',round(max(w),1),'out',sum(1 for x in w if x<45 or x>55))" >> five.log
python3 search.py $r >> five.log; cp teams.json teams_$r.json
for i in 0 1 2 3; do F=g.html node teams.mjs teams_$r.json $((i*15)) $((i*15+15)) 300 $((90+i)) hp0.json > tv${r}_$i.jsonl 2>tv${r}_$i.err & done; wait
python3 -c "
import json;T=json.load(open('teams_$r.json'));N=json.load(open('names.json'))
R=[json.loads(l) for i in range(4) for l in open(f'tv${r}_{i}.jsonl') if l.strip()];R.sort(key=lambda r:-r['w']/r['n'])
print('$r fives>=70',sum(1 for r in R if r['w']/r['n']>=.7),'of',len(R),'best',round(100*R[0]['w']/R[0]['n'],1))" >> five.log
echo DONE $r >> five.log
