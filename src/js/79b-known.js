/* 0.33.0 known elements, after the ×3 scaling so the multipliers are exact */
// cards that leaned on «любая» became harder to pay; their numbers went up to compensate (bot sims, 0.33.0)
for(const [k,m] of Object.entries({x_elder_grove:1.25,x_moth_lamp:1.25,x_octo_ink:1.25,x_dark_terror:1.2,x_siren_song:1.2})){const t=T[k];if(t)for(const f of ['dmg','heal','shield'])if(t[f])t[f]=Math.max(1,Math.round(t[f]*m))}
