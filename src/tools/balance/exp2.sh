#!/bin/bash
# usage: exp.sh name "PRE js" -> top14 teams x 160 fights each, prints mean and per-team
n=$1;pre="$2"
for s in 0 1 2 3; do PRE="$pre" F=g10.html timeout 3000 node teams.mjs top70.json $((s*4)) $((s*4+4>14?14:s*4+4)) 160 $((1300+s)) hpz.json > ey_${n}_$s.jsonl 2>/dev/null & done; wait
cat ey_${n}_*.jsonl | python3 -c "
import sys,json;R=[json.loads(l) for l in sys.stdin if l.strip()];R.sort(key=lambda r:r['i'])
print('$n','mean',round(100*sum(r['w'] for r in R)/sum(r['n'] for r in R),1),' '.join(str(round(100*r['w']/r['n'])) for r in R))"
