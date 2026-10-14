#!/bin/bash
# quick check of the current src: build to scratch, regression digest, short monkey run
set -e
T=/tmp/claude-0/sim
python3 /mnt/project-files/pack-battle/src/build.py ${VER:-dev} 0 $T/dev.html >/dev/null
cd /mnt/project-files/pack-battle/src/tools
node regress.mjs $T/dev.html ${N:-30} 2>&1 | grep -v '^$'
for s in ${SEEDS:-1 2}; do node monkey.mjs $T/dev.html ${CL:-400} $s; done
node smoke.mjs $T/dev.html 2>&1 | grep -v "agent-proxy\|google\|gvt1\|For details\|^$"
node puzcheck.mjs $T/dev.html
