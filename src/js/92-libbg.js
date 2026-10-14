/* ---------- 0.39.1 Anton: every creature in the library gets its own fitting background, drawn in code.
   The family sets the place (forest, graveyard, workshop, lava field…), the creature's elements tint the sky,
   and the creature's name seeds the details (what stands where, moon or sun, how many props), so no two cards match. ---------- */
function libBgHash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function libBg(i){const p=PETS[i],els=petEls(p),c1=ELC[els[0]]||'#7a8cff',c2=ELC[els[1]||els[0]]||c1;
  let sd=libBgHash(p.n)||1;const R=()=>(sd=Math.imul(sd^(sd>>>15),2246822507)>>>0,(sd%100000)/100000),
    rr=(a,b)=>a+R()*(b-a),ri=(a,b)=>Math.floor(rr(a,b+1)),pick=a=>a[ri(0,a.length-1)],f=n=>n.toFixed(1);
  const W=100,H=137,hz=rr(78,92);
  const D='#05070f',D2='#0b0f1f';
  const orb=()=>{const t=R();if(t<.45){const x=rr(14,86),y=rr(12,34),r=rr(6,11);return`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r*2.6)}" fill="#fff6d0" opacity=".10"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#fff3c8" opacity=".85"/>${R()<.5?`<circle cx="${f(x+r*.45)}" cy="${f(y-r*.2)}" r="${f(r*.9)}" fill="${D2}" opacity=".9"/>`:''}`}return''};
  const stars=n=>{let s='';for(let k=0;k<n;k++)s+=`<circle cx="${f(rr(2,98))}" cy="${f(rr(2,hz-30))}" r="${f(rr(.3,.9))}" fill="#fff" opacity="${f(rr(.3,.9))}"/>`;return s};
  const hills=(y,amp,col,op)=>{let d=`M0 ${f(y)}`;const n=ri(3,5);for(let k=1;k<=n;k++){const x=W*k/n;d+=` Q${f(x-W/n/2)} ${f(y-rr(0,amp))} ${f(x)} ${f(y+rr(-amp/3,amp/3))}`}return`<path d="${d} V${H} H0Z" fill="${col}" opacity="${op}"/>`};
  const ground=col=>`<path d="M0 ${f(hz)} Q50 ${f(hz-rr(2,6))} 100 ${f(hz+rr(-2,2))} V${H} H0Z" fill="${col||D}"/>`;
  const side=()=>R()<.5?rr(-2,22):rr(78,102);
  const pine=(x,y,h)=>{let s='';for(let k=0;k<3;k++){const w=h*(.42-k*.09),yy=y-h*(.25+k*.25);s+=`<path d="M${f(x-w)} ${f(yy+h*.3)} L${f(x)} ${f(yy-h*.12)} L${f(x+w)} ${f(yy+h*.3)}Z"/>`}return s+`<rect x="${f(x-1)}" y="${f(y-h*.1)}" width="2" height="${f(h*.12)}"/>`};
  const deadTree=(x,y,s,fl)=>`<path transform="translate(${f(x)} ${f(y)}) scale(${f(fl?-s:s)} ${f(s)})" d="M-1.5 0 L-1 -20 L-7 -31 L-6 -32 L-.5 -24 L0 -39 L1.5 -39 L1.5 -26 L8 -35 L9 -34 L2.5 -22 L2 -12 L7 -16 L7.5 -15 L2 -8 L1.5 0Z"/>`;
  const tomb=(x,y,s)=>R()<.4?`<path d="M${f(x-.7*s)} ${f(y)}v${f(-6*s)}h${f(-2*s)}v${f(-1.6*s)}h${f(2*s)}v${f(-2*s)}h${f(1.4*s)}v${f(2*s)}h${f(2*s)}v${f(1.6*s)}h${f(-2*s)}v${f(6*s)}z"/>`:`<path d="M${f(x-2.6*s)} ${f(y)}v${f(-5*s)}a${f(2.6*s)} ${f(2.6*s)} 0 0 1 ${f(5.2*s)} 0v${f(5*s)}z"/>`;
  const leaf=(x,y,l,a,col)=>`<path transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})" d="M0 0 Q${f(l*.35)} ${f(-l*.28)} ${f(l)} 0 Q${f(l*.35)} ${f(l*.28)} 0 0Z" fill="${col}"/>`;
  const gear=(x,y,r,col,op)=>`<g opacity="${op}"><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="${col}" stroke-width="${f(r*.42)}" stroke-dasharray="${f(r*.45)} ${f(r*.38)}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r*.72)}" fill="none" stroke="${col}" stroke-width="${f(r*.3)}"/></g>`;
  const spark=(x,y,s,col)=>`<path d="M${f(x)} ${f(y-s)} L${f(x+s*.25)} ${f(y-s*.25)} L${f(x+s)} ${f(y)} L${f(x+s*.25)} ${f(y+s*.25)} L${f(x)} ${f(y+s)} L${f(x-s*.25)} ${f(y+s*.25)} L${f(x-s)} ${f(y)} L${f(x-s*.25)} ${f(y-s*.25)}Z" fill="${col}"/>`;
  const dots=(n,col,y0,y1,r0,r1)=>{let s='';for(let k=0;k<n;k++)s+=`<circle cx="${f(rr(3,97))}" cy="${f(rr(y0,y1))}" r="${f(rr(r0,r1))}" fill="${col}" opacity="${f(rr(.4,1))}"/>`;return s};
  let back='',front='',sky=[];
  switch(p.fam){
  case'beast':{sky=['#081226',c1,'#1d2a3a'];back=stars(ri(6,14))+orb()+hills(hz-rr(10,18),10,'#1d3550',.7)+hills(hz-rr(2,8),8,'#122438',.9);
    let t='';for(let k=0,n=ri(3,6);k<n;k++){const x=side(),h=rr(20,38);t+=pine(x,hz+rr(0,6),h)}front=ground('#08121c')+`<g fill="#060d16">${t}</g>`+dots(ri(3,7),'#fff3a0',hz-30,hz+10,.5,1);break}
  case'plant':{sky=['#06140f',c1,'#123a24'];back=orb()+hills(hz-rr(6,14),9,'#0f3a26',.8);
    let v='';for(let k=0,n=ri(2,4);k<n;k++){const x=rr(4,96);v+=`<path d="M${f(x)} -2 Q${f(x+rr(-10,10))} ${f(rr(18,30))} ${f(x+rr(-6,6))} ${f(rr(30,50))}" stroke="#0a2a1a" stroke-width="1.6" fill="none"/>`+leaf(x+rr(-6,6),rr(20,44),rr(5,8),rr(0,360),'#0f3a22')}
    let l='';for(let k=0,n=ri(4,7);k<n;k++){const x=side();l+=leaf(x,hz+rr(-2,10),rr(14,26),x<50?rr(-80,-20):rr(200,260),pick(['#0b2c1a','#0e3a20','#08241a']))}
    let fl='';for(let k=0,n=ri(2,5);k<n;k++){const x=rr(6,94),y=hz+rr(4,14),c=pick([c1,c2,'#ff8fc8','#ffe07a']);fl+=`<circle cx="${f(x)}" cy="${f(y)}" r="2.2" fill="${c}" opacity=".85"/><circle cx="${f(x)}" cy="${f(y)}" r=".9" fill="#fff6c0"/>`}
    front=v+ground('#06180f')+l+fl;break}
  case'insect':{sky=['#14100a',c1,'#3a2e14'];let hx='';const ox=rr(-10,40),oy=rr(4,30);for(let a=0;a<4;a++)for(let b=0;b<3;b++){const x=ox+a*13+(b%2)*6.5,y=oy+b*11;hx+=`<path d="M${f(x)} ${f(y-6.5)} l5.6 3.2 v6.5 l-5.6 3.2 l-5.6 -3.2 v-6.5Z" fill="none" stroke="#ffcf5a" stroke-opacity="${f(rr(.08,.2))}" stroke-width="1"/>`}
    back=hx+orb()+hills(hz-rr(4,12),7,'#2a2410',.8);let m='';for(let k=0,n=ri(2,4);k<n;k++){const x=side(),s=rr(.7,1.4),cc=pick(['#a8322a','#c46a1e','#6a4ab0']);m+=`<rect x="${f(x-1.4*s)}" y="${f(hz-2-7*s)}" width="${f(2.8*s)}" height="${f(9*s)}" fill="#d8ccb0" opacity=".6"/><path d="M${f(x-7*s)} ${f(hz-6*s)} Q${f(x)} ${f(hz-16*s)} ${f(x+7*s)} ${f(hz-6*s)}Z" fill="${cc}" opacity=".75"/>`}
    let g='';for(let k=0;k<ri(8,14);k++){const x=rr(0,100);g+=`<path d="M${f(x)} ${f(hz+8)} Q${f(x+rr(-3,3))} ${f(hz-rr(4,12))} ${f(x+rr(-5,5))} ${f(hz-rr(8,16))}" stroke="#1a2a0e" stroke-width="1" fill="none"/>`}
    front=ground('#100c06')+m+g+dots(ri(2,5),'#ffe58a',20,hz,.4,.9);break}
  case'magic':{sky=['#0c0824',c1,'#2a1a4a'];back=stars(ri(10,18))+`<circle cx="50" cy="${f(hz-28)}" r="${f(rr(26,34))}" fill="none" stroke="${c2}" stroke-opacity=".22" stroke-width="1" stroke-dasharray="3 2"/><circle cx="50" cy="${f(hz-28)}" r="${f(rr(16,22))}" fill="none" stroke="${c1}" stroke-opacity=".2" stroke-width=".8"/>`+orb();
    let c='';for(let k=0,n=ri(3,5);k<n;k++){const x=side(),y=rr(20,hz-10),s=rr(3,6),cc=pick([c1,c2]);c+=`<path d="M${f(x)} ${f(y-s*1.8)} L${f(x+s)} ${f(y)} L${f(x)} ${f(y+s*1.8)} L${f(x-s)} ${f(y)}Z" fill="${cc}" opacity=".5"/>`}
    let sp='';for(let k=0;k<ri(4,8);k++)sp+=spark(rr(4,96),rr(6,hz),rr(1,2.4),'#fff6d0');front=c+sp+ground('#0a0618');break}
  case'undead':{sky=['#06080f',c1,'#1c2430'];back=stars(ri(4,10))+(R()<.7?`<circle cx="${f(rr(20,80))}" cy="${f(rr(14,30))}" r="${f(rr(8,12))}" fill="#e8f0d8" opacity=".75"/>`:orb())+hills(hz-rr(6,14),8,'#18202a',.85);
    let b='';for(let k=0;k<ri(1,4);k++){const x=rr(10,90),y=rr(10,40),s=rr(1.5,3);b+=`<path d="M${f(x-s*2)} ${f(y)} q${f(s)} ${f(-s)} ${f(s*2)} 0 q${f(s)} ${f(-s)} ${f(s*2)} 0 q${f(-s)} ${f(-.2*s)} ${f(-s*2)} ${f(s*.8)} q${f(-s)} ${f(-s)} ${f(-s*2)} ${f(-s*.8)}Z" fill="${D}"/>`}
    let t='';for(let k=0,n=ri(3,6);k<n;k++)t+=tomb(side(),hz+rr(2,8),rr(1.1,1.9));
    front=b+ground('#06080d')+`<g fill="#04060a">${R()<.8?deadTree(side(),hz+4,rr(.8,1.2),R()<.5):''}${t}</g><rect x="0" y="${f(hz-4)}" width="100" height="10" fill="${c2}" opacity=".08"/>`;break}
  case'mech':{sky=['#0a0e14',c1,'#24303a'];let g='';for(let k=0,n=ri(2,4);k<n;k++)g+=gear(side(),rr(10,hz-10),rr(6,14),pick(['#c08a4a','#8aa0b8',c1]),f(rr(.12,.3)));
    back=g+`<rect x="${f(rr(4,20))}" y="${f(hz-rr(30,44))}" width="${f(rr(5,8))}" height="60" fill="#121820"/><rect x="${f(rr(76,90))}" y="${f(hz-rr(24,38))}" width="${f(rr(6,10))}" height="60" fill="#121820"/>`+dots(ri(3,6),'#cfd8e0',4,hz-30,.8,2.4).replace(/fill="#cfd8e0"/g,'fill="#cfd8e0" fill-opacity=".12"');
    const py=hz-rr(4,10);front=ground('#070a0e')+`<rect x="0" y="${f(py)}" width="100" height="2.4" fill="#5a4630" opacity=".7"/>`+dots(ri(4,8),'#ffb84a',py-1,py+3,.3,.6);break}
  case'elem':{const e=els[0];sky=['#070a18',c1,'#1a1a34'];back=stars(ri(4,10))+orb();
    if(e==='f'){let fl='';for(let k=0;k<ri(4,7);k++){const x=rr(0,100),h=rr(8,20);fl+=`<path d="M${f(x-4)} ${f(hz+4)} Q${f(x-3)} ${f(hz-h*.5)} ${f(x)} ${f(hz-h)} Q${f(x+3)} ${f(hz-h*.5)} ${f(x+4)} ${f(hz+4)}Z" fill="${pick(['#ff6a2a','#ffb03a'])}" opacity=".55"/>`}front=ground('#140603')+fl+dots(ri(5,9),'#ffb84a',20,hz,.4,.9)}
    else if(e==='w'){let wv='';for(let k=0;k<4;k++){const y=hz+k*6-4;wv+=`<path d="M0 ${f(y)} q6 -3 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 V${H} H0Z" fill="${pick(['#0b3060','#08264c','#103a70'])}" opacity="${f(.6+k*.1)}"/>`}front=wv+dots(ri(4,8),'#bfe8ff',20,hz-4,.5,1.4).replace(/fill="#bfe8ff"/g,'fill="none" stroke="#bfe8ff" stroke-width=".4"')}
    else if(e==='a'){let sw='';for(let k=0;k<ri(3,5);k++){const x=rr(5,90),y=rr(15,hz-8),r=rr(5,10);sw+=`<path d="M${f(x)} ${f(y)} a${f(r)} ${f(r)} 0 1 1 ${f(r)} ${f(r)} a${f(r/2)} ${f(r/2)} 0 1 1 ${f(-r/2)} ${f(-r/2)}" stroke="#d8fff4" stroke-opacity=".3" stroke-width="1" fill="none"/>`}front=sw+hills(hz,6,'#0c1c24',1)}
    else if(e==='e'){let rk='';for(let k=0;k<ri(3,6);k++){const x=side(),s=rr(6,14);rk+=`<path d="M${f(x-s)} ${f(hz+4)} L${f(x-s*.6)} ${f(hz-s*.8)} L${f(x+s*.2)} ${f(hz-s)} L${f(x+s)} ${f(hz-s*.3)} L${f(x+s*.9)} ${f(hz+4)}Z" fill="${pick(['#3a2c1c','#2a2014'])}"/>`}front=ground('#120d06')+rk}
    else if(e==='l'){let ry='';const x0=rr(30,70);for(let k=0;k<ri(5,8);k++){const a=rr(-60,60);ry+=`<path d="M${f(x0)} -5 L${f(x0+Math.tan(a*Math.PI/180)*hz-3)} ${f(hz)} L${f(x0+Math.tan(a*Math.PI/180)*hz+3)} ${f(hz)}Z" fill="#fff3c0" opacity="${f(rr(.05,.12))}"/>`}front=ry+ground('#141006')+dots(ri(4,8),'#fff6d0',10,hz,.4,1)}
    else if(e==='d'){front=`<circle cx="${f(rr(30,70))}" cy="${f(hz-30)}" r="${f(rr(16,24))}" fill="#000" opacity=".5"/><circle cx="50" cy="${f(hz-30)}" r="30" fill="none" stroke="${c1}" stroke-opacity=".25" stroke-width="2" stroke-dasharray="12 6"/>`+ground('#06030c')+dots(ri(4,8),c1,10,hz,.4,1)}
    else if(e==='n'){let pl='';for(let k=0;k<ri(2,4);k++){const x=side(),h=rr(24,46);pl+=`<rect x="${f(x-3)}" y="${f(hz-h)}" width="6" height="${f(h)}" fill="#16161e"/><rect x="${f(x-4.5)}" y="${f(hz-h-2)}" width="9" height="2.4" fill="#22222c"/>`}front=`<path d="M50 ${f(hz-50)} L72 ${f(hz-12)} L28 ${f(hz-12)}Z" fill="none" stroke="#efe8d6" stroke-opacity=".15"/>`+ground('#0a0a10')+pl}
    else{let sh='';for(let k=0;k<ri(4,7);k++){const x=rr(4,96),y=rr(10,hz),s=rr(2,5);sh+=`<path d="M${f(x)} ${f(y-s)} L${f(x+s*.6)} ${f(y+s*.4)} L${f(x-s*.5)} ${f(y+s*.7)}Z" fill="${pick([c1,'#ff3a6e'])}" opacity=".5"/>`}front=sh+ground('#12040a')}
    break}
  case'demon':{sky=['#120404',c1,'#4a1208'];back=orb().replace(/#fff3c8/g,'#ff9a5a').replace(/#fff6d0/g,'#ff7a3a')+hills(hz-rr(6,14),10,'#2a0806',.9);
    let sp='';for(let k=0,n=ri(3,6);k<n;k++){const x=side(),h=rr(12,30);sp+=`<path d="M${f(x-4)} ${f(hz+4)} L${f(x+rr(-1,1))} ${f(hz-h)} L${f(x+4)} ${f(hz+4)}Z"/>`}
    let cr='';for(let k=0;k<ri(2,4);k++){const x=rr(5,90),y=hz+rr(4,14);cr+=`<path d="M${f(x)} ${f(y)} l${f(rr(4,8))} ${f(rr(-2,2))} l${f(rr(3,7))} ${f(rr(-2,3))}" stroke="#ff7a2a" stroke-width="1" fill="none" opacity=".8"/>`}
    front=ground('#0e0302')+`<g fill="#080101">${sp}</g>`+cr+dots(ri(6,10),'#ffa040',10,hz+6,.3,.8);break}
  case'aberr':{sky=['#06030e',c1,'#1c0a2c'];back=stars(ri(12,20))+`<ellipse cx="${f(rr(30,70))}" cy="${f(rr(20,40))}" rx="${f(rr(16,26))}" ry="${f(rr(4,8))}" fill="none" stroke="${c2}" stroke-opacity=".25" stroke-width="1" transform="rotate(${f(rr(-20,20))} 50 30)"/>`;
    let ey='';for(let k=0;k<ri(1,3);k++){const x=side(),y=rr(14,hz-14),s=rr(2.2,4);ey+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(s*1.6)}" ry="${f(s)}" fill="#f0e0ff" opacity=".55"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(s*.6)}" fill="#8a1a5a"/>`}
    let tn='';for(let k=0;k<ri(2,4);k++){const x=side();tn+=`<path d="M${f(x)} ${f(H)} Q${f(x+rr(-14,14))} ${f(hz-rr(0,14))} ${f(x+rr(-8,8))} ${f(hz-rr(14,30))}" stroke="#14061e" stroke-width="${f(rr(3,5))}" stroke-linecap="round" fill="none"/>`}
    front=ey+ground('#07030c')+tn;break}
  case'dragon':{sky=['#0c0a18',c1,'#3a1e1a'];back=orb()+`<path d="M0 ${f(hz-8)} L${f(rr(10,22))} ${f(hz-rr(34,48))} L${f(rr(30,40))} ${f(hz-rr(14,24))} L${f(rr(48,58))} ${f(hz-rr(40,56))} L${f(rr(66,76))} ${f(hz-rr(18,28))} L${f(rr(84,92))} ${f(hz-rr(30,44))} L100 ${f(hz-10)} V${H} H0Z" fill="#241c30" opacity=".9"/>`+hills(hz-rr(2,8),8,'#16121e',1);
    const tx=side();front=ground('#0a0810')+`<g fill="#07050c"><rect x="${f(tx-4)}" y="${f(hz-24)}" width="8" height="26"/><path d="M${f(tx-5)} ${f(hz-24)} h10 v-3 h-2 v2 h-2 v-2 h-2 v2 h-2 v-2 h-2Z"/></g>`+dots(ri(2,5),'#ffb070',10,hz,.4,.8);break}
  default:{sky=['#0a0e1c',c1,'#1a2034'];back=stars(10)+orb();front=ground()}}
  const bg=`linear-gradient(${sky[0]} 0%,color-mix(in srgb,${sky[1]} 42%,${sky[0]}) 45%,color-mix(in srgb,${sky[2]} 70%,${c2}) ${f(hz-6)}%,${D} ${f(hz+8)}%)`;
  return`<span class="lbg" style="background:radial-gradient(60% 40% at 50% ${f(hz-28)}%,color-mix(in srgb,${c1} 28%,transparent),transparent 72%),${bg}"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${back}${front}</svg></span>`}

/* Anton 20:25: card borders look a little hand-drawn: two wobbly ink strokes in the quality colour, a bit different on every card */
function libInk(i){const p=PETS[i];let sd=(libBgHash(p.n+'#ink')||3);const R=()=>(sd=Math.imul(sd^(sd>>>15),2246822507)>>>0,(sd%100000)/100000),f=n=>n.toFixed(2);
  const path=(m,j)=>{const W=100,H=137,r=9,pts=[];const J=()=>(R()-.5)*j;
    const seg=(x1,y1,x2,y2,n)=>{for(let k=0;k<n;k++){const t=k/n;pts.push([x1+(x2-x1)*t+J(),y1+(y2-y1)*t+J()])}};
    seg(m+r,m,W-m-r,m,4);pts.push([W-m-r*.3+J(),m+r*.3+J()]);seg(W-m,m+r,W-m,H-m-r,5);pts.push([W-m-r*.3+J(),H-m-r*.3+J()]);
    seg(W-m-r,H-m,m+r,H-m,4);pts.push([m+r*.3+J(),H-m-r*.3+J()]);seg(m,H-m-r,m,m+r,5);pts.push([m+r*.3+J(),m+r*.3+J()]);
    let d=`M${f(pts[0][0])} ${f(pts[0][1])}`;for(let k=1;k<=pts.length;k++){const a=pts[k-1],b=pts[k%pts.length];d+=` Q${f(a[0])} ${f(a[1])} ${f((a[0]+b[0])/2)} ${f((a[1]+b[1])/2)}`}
    const o=R()*1.5;return d+` L${f(pts[0][0]+o)} ${f(pts[0][1]-o*.4)}`};
  const main=path(2.6,1.4),wear=()=>{let d=[];for(let k=0;k<14;k++)d.push(f(R()*1.6+.4),f(R()*30+14));return d.join(' ')},gaps=()=>{let d=[];for(let k=0;k<14;k++)d.push(f(R()*26+10),f(R()*2+.6));return d.join(' ')},
    scr=()=>{let o='';for(let k=0;k<5;k++){const side=Math.floor(R()*4),t=R()*.8+.1,x=side===0||side===2?6+t*88:side===1?97.4:2.6,y=side===1||side===3?8+t*121:side===2?134.4:2.6,l=R()*3+1.5,v=side===1||side===3;
      o+=`<path d="M${f(x-(v?.6:l/2))} ${f(y-(v?l/2:.6))} L${f(x+(v?.6:l/2))} ${f(y+(v?l/2:.6))}" stroke="#fff6dc" stroke-width=".8" opacity="${f(R()*.35+.25)}"/>`}return o};
  return`<svg class="lcd-ink" viewBox="0 0 100 137" preserveAspectRatio="none" aria-hidden="true"><path d="${path(2.6,1.6)}" stroke="#0a0d18" stroke-width="6.5" opacity=".75"/><path d="${main}" stroke="var(--qc)" stroke-width="3.8"/><path d="${main}" stroke="#1a1e2c" stroke-width="2.6" stroke-dasharray="${wear()}" opacity=".8"/><path d="${main}" stroke="#000" stroke-width="1" stroke-dasharray="${wear()}" opacity=".3"/><path d="${path(4.6,2.2)}" stroke="var(--qc)" stroke-width="1" opacity=".5" stroke-dasharray="${gaps()}"/>${scr()}</svg>`}

if(typeof document!=='undefined'&&document.body){const st=document.createElement('style');st.textContent=`
.lbg{position:absolute;inset:0;display:block}.lbg svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.lib .lcd{border-color:transparent!important;border-width:0!important}
.lib .lcd-ft{padding:14px 8px 8px}.lib .lcd-lv{right:8px;top:7px}.lib .lcd-lk{right:8px;top:6px}.lib .lcd-q{left:9px;top:9px}
.lcd-ink{position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;fill:none;overflow:visible}.lcd-ink path{vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}
.lib .lcd.rdy{box-shadow:0 3px 10px #0008!important}
.lcd.lock .lbg{filter:saturate(.25) brightness(.55)}
`;document.body.appendChild(st)}
// both pictures depend only on the creature: draw each once
{const bg0=libBg,ink0=libInk,cb=new Map(),ci=new Map();libBg=i=>{let v=cb.get(i);if(v==null){v=bg0(i);cb.set(i,v)}return v};libInk=i=>{let v=ci.get(i);if(v==null){v=ink0(i);ci.set(i,v)}return v}}
