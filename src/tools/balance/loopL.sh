#!/bin/bash
prev=$1;shift
for r in "$@"; do python3 tuneAlt.py $prev ${G:-1} c >> loopL.log; GF=g.html bash runL.sh $r ${NN:-3000} 25 4 > $r.out 2>&1
python3 an.py $r >/dev/null 2>&1; python3 -c "
import json;A=json.load(open('${r}_an.json'));w=A['wr'];R=json.load(open('${r}_slots.json'));print('$r','min',round(min(w),1),'max',round(max(w),1),'out',sum(1 for x in w if x<45 or x>55),'slots|d|>8',sum(1 for x in R if abs(x['d'])>8))" >> loopL.log; prev=$r; done; echo DONE >> loopL.log
