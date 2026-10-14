# Balance sim tools (0.32.1)

Copied from the night working dir /tmp/claude-0/rb. Run them from a scratch dir that holds a built game (`python3 build.py VER BUILD dir/g.html`) and a copy of ../harness.mjs; some scripts expect names.json (`NAMES=1 F=g.html node fights.mjs > names.json`) and pets.json.

- `F=g.html node fights.mjs N seed hard hpz.json > p_1.jsonl` random 5v5 at lv1 (env PRE = js run first). Run 4 seeds as p_1..p_4, then `python3 an.py p` → p_an.json (win %, contribution, pairs).
- `GF=g.html bash runL.sh pref N lv q` level/quality slice; random first/second card per slot; `anM.py` gives per-slot card deltas (best/worst abilities).
- `tune.py` → hp.json (HP32 overrides); `tuneAlt.py` → altk.json, merged into ALTK by `bake2.py`.
- `search.py pref` → teams.json (strong fives from the pair model); `teams.mjs` verifies them in real fights.
- `mkrep.py` writes the rebalance report.
- `pzhp.mjs` / `pzpatch.py` re-solve «Задачи» after rule changes (with ../puzfix.mjs).
