/* ---------- 0.41.11 Anton (answers to the night interface questions) ----------
   Shop: a purchase needs a second tap «Купить за 💎 N?»; a price you cannot pay says «Не хватает 💎 N» on tap.
   Battle: a tap on the opponent's element stock says what it is. */
{const s0=shopSheet;shopSheet=function(){const of=shopToday();let h=s0();
  of.forEach((o,i)=>{if(o.b)return;const a=`data-act="buy-${i}"`;
    // an unpayable price stays tappable (a disabled button gets no tap at all), it only looks dim
    h=h.replace(`${a} disabled>`,`${a} data-short="1">`);
    if(ui.shConf===i)h=h.replace(new RegExp(`(<button class="pill )on(" ${a}[^>]*>)💎 ${o.cost}<`),`$1on shconf$2Купить за 💎 ${o.cost}?<`)});
  return h.replace(/· сейчас /g,'·&nbsp;сейчас&nbsp;')}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-act^="buy-"]');
  if(!b){if(ui.shConf!=null&&!(e.target.closest&&e.target.closest('.over .box'))){ui.shConf=null}return}
  const i=+b.dataset.act.slice(4),o=shopToday()[i];if(!o||o.b)return;
  if(META.stones<o.cost){e.stopPropagation();e.preventDefault();toast('Не хватает 💎 '+(o.cost-META.stones));return render()}
  if(ui.shConf!==i){e.stopPropagation();e.preventDefault();ui.shConf=i;return render()}
  ui.shConf=null},true);
document.addEventListener('click',e=>{if(typeof G==='undefined'||!G||G.phase!=='battle')return;const p=e.target.closest&&e.target.closest('#app>.sb-opp .pool');
  if(!p)return;toast('Стихии соперника: его запас на этот ход');render()},true);
if(typeof document!=='undefined'&&document.head)document.head.insertAdjacentHTML('beforeend',`<style>
.shi .pill[data-short]{opacity:.55}
.ghost.ghalf{z-index:60!important;opacity:.97!important;background-color:#1E2739!important}
.shi .pill.shconf{white-space:nowrap;min-width:0;padding-inline:12px;outline:2px solid var(--gold);outline-offset:1px;color:var(--gold)}
/* a long window keeps its «Закрыть» at the bottom of the screen, not at the end of the scroll */
.over>.box>.acts:last-child:has([data-act$="-close"],[data-act="lfl-x"]) {position:sticky;bottom:-1px;z-index:2;padding-top:10px;background:linear-gradient(to top,#151D2E 75%,rgba(21,29,46,0));box-shadow:0 30px 0 #151D2E}
.over>.box>button.btn.main:last-child[data-act$="-close"]{position:sticky;bottom:0;z-index:2}
/* every window closes with the same stone button (gold stays for «В бой») */
.over .box .btn.main:is([data-act="fxs-close"],[data-act="lay-close"],[data-act="hint-close"],[data-act="rules-close"],[data-act="lfl-x"]){background:linear-gradient(180deg,#3A465F,#283247)!important;color:#E6ECF8!important;border-color:#4A5878!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 3px 0 #0B111E,0 30px 0 14px #151D2E,0 -10px 16px 4px #151D2E!important;text-shadow:none!important}
.capl{margin:2px 0 4px;padding:8px 10px;border-radius:10px;background:#1E2537;box-shadow:inset 3px 0 0 var(--gold);font-size:13px;line-height:1.3;color:var(--fg)}
</style>`);
