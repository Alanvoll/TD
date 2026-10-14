/* ---------- 0.36.1 Anton: a button to put the game in full screen and back (⛶ in the menu and battle top bars) ---------- */
const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
function fsToggle(){const d=document,e=d.documentElement;
  try{if(fsEl()){(d.exitFullscreen||d.webkitExitFullscreen).call(d);return}
    const req=e.requestFullscreen||e.webkitRequestFullscreen;if(!req)throw 0;
    const r=req.call(e,{navigationUI:'hide'});if(r&&r.catch)r.catch(()=>msg('Браузер не дал включить весь экран.'))}
  catch(_){msg('Браузер не дал включить весь экран.')}}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-act="fs"]');if(!b)return;ev.stopPropagation();ev.preventDefault();fsToggle()},true);
