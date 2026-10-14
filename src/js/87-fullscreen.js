/* ---------- 0.36.1 Anton: a button to put the game in full screen and back (⛶ in the menu and battle top bars) ---------- */
const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
/* 0.37.1: iPhone Safari has no page fullscreen; the way there is «На экран Домой» (the GitHub copy opens as an app) */
const fsIOS=()=>/iPhone|iPod|iPad/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function fsToggle(){const d=document,e=d.documentElement;
  if(navigator.standalone){msg('Игра уже открыта на весь экран.');return}
  if(fsIOS()&&!fsEl()&&!(e.requestFullscreen||e.webkitRequestFullscreen)){msg('На iPhone весь экран так не включить. Открой игру в Safari по ссылке alanvoll.github.io/TD, нажми «Поделиться» → «На экран Домой» и запускай с иконки.');return}
  try{if(fsEl()){(d.exitFullscreen||d.webkitExitFullscreen).call(d);return}
    const req=e.requestFullscreen||e.webkitRequestFullscreen;if(!req)throw 0;
    const r=req.call(e,{navigationUI:'hide'});if(r&&r.catch)r.catch(()=>msg('Браузер не дал включить весь экран.'))}
  catch(_){msg('Браузер не дал включить весь экран.')}}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-act="fs"]');if(!b)return;ev.stopPropagation();ev.preventDefault();fsToggle()},true);
