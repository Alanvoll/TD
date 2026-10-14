// headless loader for the «Бой стаи» single-file prototype: stubs the DOM, removes waits, exposes sim helpers
import fs from 'fs';import vm from 'vm';
export function load(file,extra=''){
  const html=fs.readFileSync(file,'utf8');
  const a=html.indexOf('<script>')+8,b=html.lastIndexOf('</script>');
  let js=html.slice(a,b);
  js=js.replace(/const sleep=ms=>new Promise\(r=>[^\n]*\n/,'let sleep=ms=>Promise.resolve();\n');
  js=js.replace(/\(function warm\(\)\{/,'(function warm(){return;');
  const el=()=>{const e={style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},dataset:{},children:[],appendChild(c){return c},insertAdjacentHTML(){},remove(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},getBoundingClientRect(){return{left:0,top:0,width:0,height:0}},animate(){return{}},cloneNode(){return el()},set innerHTML(v){},get innerHTML(){return''},set textContent(v){},content:{firstChild:null}};return e};
  const store=new Map();
  const ctx={console,structuredClone,Math,JSON,Date,Promise,Object,Array,Set,Map,Number,String,Boolean,Error,RegExp,Uint8Array,isNaN,parseInt,parseFloat,
    document:{createElement:el,getElementById:()=>el(),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},head:el(),body:el(),hidden:false,elementFromPoint:()=>null},
    localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},
    performance:{now:()=>Date.now()},URL:{createObjectURL:()=>''},Blob:function(){},Image:function(){return el()},atob:s=>Buffer.from(s,'base64').toString('binary'),
    setInterval:()=>0,setTimeout:(f)=>0,clearTimeout(){},requestAnimationFrame:()=>0,innerHeight:800,innerWidth:400,navigator:{vibrate(){}},location:{search:'',hash:''},
  };
  ctx.globalThis=ctx;ctx.window=ctx;
  vm.createContext(ctx);
  vm.runInContext(js+'\n'+HELP+'\n'+extra,ctx,{filename:file});
  return ctx;
}
const HELP=`
render=function(){};
globalThis.H={
  get G(){return G},get PETS(){return PETS},get T(){return T},get META(){return META},
  setTeam(t){TEAM=t},cardEls:x=>cardEls(x),setNext(n){NEXT=n},setCtx(c){CTX=c},setAI(a){AI=a},
  // one bot-vs-bot battle; teams are PETS indices (or defs). returns 'win' (side A) / 'lose' / 'draw'
  async battle(A,B,o={}){
    CTX=o.ctx||null;TEAM=A;PLACE=o.placeA||null;NEXT={enemyIdx:B,ai:o.aiB||'medium'};if(o.enemy)NEXT={enemy:o.enemy,ai:o.aiB||'medium',fact:o.fact};
    G={phase:'battle'};resetPlace();
    PLACE=o.placeA||smartPlace(A.map(x=>typeof x==='object'?x:PETS[x]),A.length);
    if(o.before)o.before();
    newGame();G.P.ai=o.aiA||'medium';
    let guard=0;
    while(!G.over&&guard++<60){(typeof anyPlan==='function'?anyPlan:botPlan)(G.P,G.B);await resolve()}
    return {res:G.over||'draw',turns:G.turn};
  },
};`;
