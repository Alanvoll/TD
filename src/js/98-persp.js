// perspective field: the tilted board keeps its flat layout height, so pull it up by the difference to reclaim the freed space
function fitBoard(){for(const b of document.querySelectorAll('.board')){b.style.marginTop='';const lh=b.offsetHeight,vh=b.getBoundingClientRect().height;b.style.marginTop=(-(lh-vh)+4)+'px'}}
if(typeof MutationObserver!=='undefined')new MutationObserver(()=>{for(const b of document.querySelectorAll('.board'))if(!b.dataset.fit){b.dataset.fit=1;fitBoard();break}}).observe(document.body,{childList:true,subtree:true});
if(window.addEventListener)window.addEventListener('resize',()=>setTimeout(fitBoard,50));
