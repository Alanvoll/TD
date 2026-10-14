#!/bin/bash
# usage: runL.sh prefix N lv q [ai]   (applies altk.json)
p=$1;N=$2;lv=$3;q=$4;ai=${5:-hard}
PRE="$(cat altk_fn3.js);$EXTRA;applyAltK3($(cat altk.json 2>/dev/null || echo '{}'));"
for s in 1 2 3 4; do PRE="$PRE" F=${GF:-g4.html} timeout 5000 node fightsM.mjs $N $((700+s)) $ai $lv $q hp.json > ${p}_$s.jsonl 2>${p}_$s.err & done; wait
python3 anM.py $p | head -12; python3 an.py $p 2>&1 | tail -30
