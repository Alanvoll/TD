# report for 0.32.x rebalance. usage: python3 mkrep.py lv1pref Lpref teamsjson verifyglob out.md [smartpref]
import json,sys,glob,collections
lp,Lp,tj,vg,out=sys.argv[1:6];sp=sys.argv[6] if len(sys.argv)>6 else None;mpf=sys.argv[7] if len(sys.argv)>7 else None
N=json.load(open('names.json'));P=json.load(open('pets.json'))
A=json.load(open(lp+'_an.json'));L=json.load(open(Lp+'_an.json'));S=json.load(open(sp+'_an.json')) if sp else None;M=json.load(open(mpf+'_an.json')) if mpf else None
FAM={'beast':'Звери','plant':'Растения','insect':'Насекомые','magic':'Магические','undead':'Нежить','mech':'Механизмы','elem':'Элементали','demon':'Демоны','aberr':'Аберрации','dragon':'Драконы'}
CLS={'guard':'Страж','fighter':'Боец','healer':'Целитель','agile':'Ловкач','sage':'Мудрец'}
T=json.load(open(tj));R=[json.loads(l) for f in sorted(glob.glob(vg)) for l in open(f) if l.strip()];R.sort(key=lambda r:-r['w']/r['n'])
top=R[:15];cnt=collections.Counter(i for r in top for i in T[r['i']])
def rng(X):v=X['wr'];return min(v),max(v),sum(1 for x in v if x<45 or x>55)
o=[]
a0,a1,an=rng(A);b0,b1,bn=rng(L)
pairs=sorted(((v[0],v[1],k) for k,v in A['pairs'].items() if v[1]>=150),reverse=True)
o.append(f"""# Ребаланс 0.32.1 · сборка 112

Как считал: случайные пятёрки из всех 100 существ, бот «Сложный» с обеих сторон (он в 40 раз быстрее «Стратега», поэтому подгонка шла на нём). Проверены два среза: 1-й уровень (обычное качество, первые карты) и Легендарные 25-го уровня (в каждой ячейке случайно первая или вторая карта, черты Легендарного включены).

## Итог

- **1-й уровень** ({A['nf']} боёв): все 100 существ в {a0:.1f}–{a1:.1f}%, вне 45–55%: {an}.
- **Легендарные, ур. 25** ({L['nf']} боёв): все 100 в {b0:.1f}–{b1:.1f}%, вне 45–55%: {bn}.
- **Пары** (1-й уровень, от 150 боёв): лучшая {pairs[0][0]:.1f}%, выше 70%: {sum(1 for p in pairs if p[0]>=70)}.
- **Сильнейшие пятёрки** (поиск по модели, потом по 300 боёв против случайных пятёрок): выше 70% — {sum(1 for r in R if r['w']/r['n']>=.7)} из {len(R)}, лучшая {100*R[0]['w']/R[0]['n']:.1f}%. В 0.31.0 было 22 из 32, лучшая 78%.
""")
if M:
  m0,m1,mn=rng(M);o.append(f"- **Середина роста: 10-й уровень, Редкие** ({M['nf']} боёв, вторые карты в двух первых ячейках случайно): {m0:.1f}–{m1:.1f}%, вне 45–55%: {mn}.\n")
if S:
  s0,s1,sn=rng(S);o.append(f"- **Проверка «Стратегом»** ({S['nf']} боёв, 1-й уровень, «Стратег» с обеих сторон): {s0:.1f}–{s1:.1f}%, вне 45–55%: {sn}. Выборка меньше, разброс ±3–4 п. на существо.\n")
o.append("\n## Сильнейшие пятёрки (1-й уровень, по 300 боёв против случайных)\n\n| % побед | Пятёрка |\n|---|---|\n")
for r in R[:15]:o.append(f"| {100*r['w']/r['n']:.1f} | {' + '.join(P[i]['n'] for i in T[r['i']])} |\n")
o.append("\n## Лучшие пары (1-й уровень)\n\n| Пара | % побед | Боёв |\n|---|---|---|\n")
for w,g,k in pairs[:12]:a,b=map(int,k.split(','));o.append(f"| {N[a][0]} + {N[b][0]} | {w:.1f} | {g} |\n")
# abilities
sl=json.load(open(Lp+'_slots.json'))
cards=[]
for r in sl:cards+= [(r['wa'],r['alt'],r['pet'],r['slot'],r['wb'],r['base']),(r['wb'],r['base'],r['pet'],r['slot'],r['wa'],r['alt'])]
cards.sort(reverse=True)
o.append("\n## Лучшие и худшие способности\n\nСчитал на Легендарных 25-го уровня, где в каждой ячейке случайно стоит одна из двух карт. «% побед» — как часто выигрывала стая, когда у существа в этой ячейке была эта карта. Рядом — вторая карта той же ячейки: разница между ними показывает силу самой карты, без силы существа.\n\n**Лучшие 12**\n\n| Карта | Существо, ячейка | % побед | Другая карта ячейки |\n|---|---|---|---|\n")
for w,n,p,s,w2,n2 in cards[:12]:o.append(f"| {n} | {p}, {s} | {w:.1f} | {n2} {w2:.1f} |\n")
o.append("\n**Худшие 12**\n\n| Карта | Существо, ячейка | % побед | Другая карта ячейки |\n|---|---|---|---|\n")
for w,n,p,s,w2,n2 in cards[::-1][:12]:o.append(f"| {n} | {p}, {s} | {w:.1f} | {n2} {w2:.1f} |\n")
sl.sort(key=lambda r:-abs(r['d']))
o.append("\n**Самые неравные ячейки** (после подгонки)\n\n| Существо, ячейка | Первая карта | Вторая карта | Разница |\n|---|---|---|---|\n")
for r in sl[:10]:o.append(f"| {r['pet']}, {r['slot']} | {r['base']} {r['wb']} | {r['alt']} {r['wa']} | {r['d']:+.1f} |\n")
# classes/families
def grp(X,key):
  d=collections.defaultdict(list)
  for i,p in enumerate(P):d[key(p)].append(X['wr'][i])
  return {k:sum(v)/len(v) for k,v in d.items()}
o.append("\n## Классы и семейства (среднее % побед)\n\n| | 1-й ур. | Легенд. 25 |"+(" Стратег |" if S else "")+"\n|---|---|---|"+("---|" if S else "")+"\n")
for key,M in ((lambda p:p['cls'],CLS),(lambda p:p['fam'],FAM)):
  g1=grp(A,key);g2=grp(L,key);g3=grp(S,key) if S else None
  for k in M:o.append(f"| {M[k]} | {g1[k]:.1f} | {g2[k]:.1f} |"+(f" {g3[k]:.1f} |" if S else "")+"\n")
o.append("\n## Все существа\n\n- **% побед**: доля побед пятёрок, где оно было.\n- **Вклад**: на сколько пунктов меняется % побед пятёрки, если поставить его вместо среднего существа (1-й уровень, с учётом пар).\n- **Топ-5%**: в скольких из 15 сильнейших найденных пятёрок оно есть.\n\n| Существо | Семейство | Класс | Здоровье ур.1 | % побед ур.1 | Вклад | Топ-5% | % побед Легенд. 25 |"+(" Стратег |" if S else "")+"\n|---|---|---|---|---|---|---|---|"+("---|" if S else "")+"\n")
for i in sorted(range(len(P)),key=lambda i:-A['wr'][i]):
  o.append(f"| {P[i]['n']} | {FAM[P[i]['fam']]} | {CLS[P[i]['cls']]} | {N[i][1]} | {A['wr'][i]:.1f} | {A['contrib'][i]:+.1f} | {cnt.get(i,0)} | {L['wr'][i]:.1f} |"+(f" {S['wr'][i]:.1f} |" if S else "")+"\n")
open(out,'w').write(''.join(o));print('ok',len(''.join(o)))
