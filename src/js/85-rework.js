/* ---------- 0.35 Anton (thread «Переработка карт и существ»): cards brought to the 12:50 element rule — a card's element sets
   its character, exceptions are explained in the name. No numbers were tuned (no balancing in this pass).
   1) ▲ effects that did not fit the element: the card changes element (its cost moves with it) or gets a name that explains it.
   2) ▼ effects: every element has the ▼ kinds that fit it; a ▼ that did not fit is swapped for the nearest fitting kind
      from the same list of ▼ effects (self-defence stays self-defence, team stays team), damage ▼ fits every element. ---------- */
const RW_EL={fly_digest:'d',mosq_flit:'d',djinn_wish:'l',cerb_stance:'n',banshee_veil:'n',bhound_rattle:'d',swift_jet:'a',amoeba_culture:'w',eyes_blink:'d'};
// 0.35.1 Anton «перераспредели стихии немного, без баланса»: every creature whose three cards had one element gets one card
// of a second element that fits it (Саламандра stays: every one of its card names says fire), so random fives are less one-coloured
Object.assign(RW_EL,{bear_hide:'n',wolf_howl:'a',oak_bark:'l',fly_sap:'w',beetle_toss:'a',mosq_buzz:'a',uni_hoof:'e',grif_rend:'e',siren_song:'z',
  zombie_rise:'z',vamp_mist:'w',robot_laser:'l',golem_skin:'n',fire_sparks:'l',wind_storm:'z',chaos_curse:'d',dragon_scales:'n',drake_dash:'a',
  gold_wing:'n',boar_charge:'a',firefly_flash:'f',ghoul_feast:'z',mwolf_jaw:'n',swift_blade:'n',icy_wall:'n',magma_erupt:'e',dew_rain:'l',
  leechling_ichor:'w',pearl_gift:'l',windwing_soar:'l'});
const RW_N={bee_dance:'Медовый танец',wyv_glide:'Отдых на ветру',boar_bristle:'Щетина и отскок',thorn_lash:'Жгучий терновый хлыст',phoenix_ash:'Целебный пепел',kitsune_illusion:'Морок-щит',leechling_ichor:'Целебный ихор',leechling_clot:'Высосать яд',leechling_swarm:'Лечебные пиявки'};
// ▼ kinds that fit each element (damage ▼ fits all); order = what a misfit is swapped to first
const DN_OK={f:{self:[],team:[],draw:'colDmg',mark:'colDmg'},w:{self:['heal','shield'],team:['allHeal'],draw:'draw',mark:'colDmg'},
  e:{self:['shield'],team:['allShield'],draw:'shield',mark:'colDmg'},a:{self:['evade'],team:[],draw:'draw',mark:'markCol'},
  l:{self:['heal','shield'],team:['allHeal','allShield'],draw:'draw',mark:'markCol'},d:{self:['evade','heal'],team:[],draw:'markCol',mark:'markCol'},
  n:{self:['shield','heal'],team:['allShield','allHeal'],draw:'shield',mark:'colDmg'},z:{self:['evade'],team:[],draw:'draw',mark:'colDmg'}};
const DN_KEY={heal:'hl',shield:'sh',evade:'evd',allHeal:'ahl',allShield:'ash',draw:'drw',markCol:'mrk',colDmg:'col',frontDmg:'frt'};
function dnFit(el,kind){const o=DN_OK[el];if(!o)return kind;
  if(kind==='colDmg'||kind==='frontDmg')return kind;
  if(kind==='heal'||kind==='shield'||kind==='evade')return o.self.includes(kind)?kind:o.self[0]||'colDmg';
  if(kind==='allHeal'||kind==='allShield')return o.team.includes(kind)?kind:o.team[0]||(o.self[0]||'frontDmg');
  if(kind==='draw')return o.draw;if(kind==='markCol')return o.mark;return kind}
const subOf=key=>{const s={...SB[key]};for(const f of ['shield','heal','colDmg','frontDmg','allShield','allHeal'])if(s[f])s[f]*=SC;const[a,b]=subTexts(s);s.short=a;s.txt=b;return s};
const RW_LOG=[];
{const petBases=new Set();for(const p of PETS)for(const k of [...p.cards,...(p.alt||[])])if(T[k]&&T[k].base)petBases.add(T[k].base);
 const remap=(cost,a,b)=>{if(!cost||!(a in cost))return cost;const c={...cost};c[b]=(c[b]||0)+c[a];delete c[a];return c};
 for(const b in RW_EL){const ct=CT[b];if(!ct)continue;const a=ct.el,n=RW_EL[b];ct.el=n;ct.cost=remap(ct.cost,a,n);if(CUP[b]&&CUP[b].cost)CUP[b].cost=remap(CUP[b].cost,a,n)}
 for(const b in RW_N){if(CT[b])CT[b].n=RW_N[b];if(CUP[b]&&CUP[b].n)CUP[b].n=RW_N[b]+'+'}
 for(const k in T){const t=T[k];if(!t||!t.base||!petBases.has(t.base)||t.dnOf)continue;
   if(RW_EL[t.base]){const a=t.el,n=RW_EL[t.base];t.el=n;t.dg=n;t.cost=remap(t.cost,a,n)}
   if(RW_N[t.base])t.n=RW_N[t.base]+(t.up&&!/\+$/.test(RW_N[t.base])?'+':'');
   if(t.sub){const kind=Object.keys(t.sub).find(f=>DN_KEY[f]),to=kind&&dnFit(t.el,kind);if(to&&to!==kind){RW_LOG.push([k,kind,to]);t.sub=subOf(DN_KEY[to])}}}
 for(const p of PETS){const els=new Set((p.cards||[]).map(k=>T[k]&&T[k].el));p.els=ELS.filter(e=>els.has(e))}
 for(const k in DNK){if(DNK[k])delete T[DNK[k]];delete DNK[k]}}
