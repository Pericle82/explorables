/* ================= helpers ================= */
const NS="http://www.w3.org/2000/svg";
const $=s=>document.querySelector(s);
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function el(tag,attrs,parent,txt){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(txt!=null)e.textContent=txt;if(parent)parent.appendChild(e);return e;}
function clear(n){while(n.firstChild)n.removeChild(n.firstChild);}
const fmt=(v,d=1)=>(Math.abs(v)<0.5*Math.pow(10,-d)?0:v).toLocaleString("it-IT",{minimumFractionDigits:d,maximumFractionDigits:d}).replace("-","−");
function seg(id,cb){const g=$(id);g.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));cb(b.dataset.v);});return ()=>g.querySelector('[aria-pressed="true"]').dataset.v;}
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
/* assi + mappatura; ritorna {X,Y} */
function axes(svg,{W,H,x0,x1,y0,y1,L=50,R=14,T=14,B=36,xt=[],yt=[],xf=v=>v,yf=v=>v,xl="",yl=""}){clear(svg);const pw=W-L-R,ph=H-T-B;const X=v=>L+(v-x0)/(x1-x0)*pw,Y=v=>T+ph-(v-y0)/(y1-y0)*ph;
  yt.forEach(v=>{el("line",{x1:L,x2:W-R,y1:Y(v),y2:Y(v),class:"gl"},svg);el("text",{x:L-6,y:Y(v)+4,"text-anchor":"end"},svg,yf(v));});
  xt.forEach(v=>{el("line",{x1:X(v),x2:X(v),y1:T,y2:T+ph,class:"gl"},svg);el("text",{x:X(v),y:H-B+16,"text-anchor":"middle"},svg,xf(v));});
  el("line",{x1:L,x2:W-R,y1:T+ph,y2:T+ph,class:"ax"},svg);el("line",{x1:L,x2:L,y1:T,y2:T+ph,class:"ax"},svg);
  if(xl)el("text",{x:W-R,y:H-4,"text-anchor":"end"},svg,xl);if(yl)el("text",{x:L+4,y:T+10},svg,yl);
  return {X,Y,L,T,pw,ph,clip:(x,y)=>[Math.max(L,Math.min(W-R,x)),Math.max(T,Math.min(T+ph,y))]};}
function path(svg,pts,attrs){const d=pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+","+p[1].toFixed(1)).join("");return el("path",Object.assign({d,fill:"none"},attrs),svg);}
/* risolve A w = b (Gauss con pivot) */
function solve(A,b){const n=b.length;A=A.map(r=>r.slice());b=b.slice();for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];[b[c],b[p]]=[b[p],b[c]];const d=A[c][c]||1e-12;for(let r=c+1;r<n;r++){const f=A[r][c]/d;for(let k=c;k<n;k++)A[r][k]-=f*A[c][k];b[r]-=f*b[c];}}const w=new Array(n).fill(0);for(let r=n-1;r>=0;r--){let s=b[r];for(let k=r+1;k<n;k++)s-=A[r][k]*w[k];w[r]=s/(A[r][r]||1e-12);}return w;}

/* ================= dataset case ================= */
const HX=[50,65,80,95,110,130],HY=[150,185,210,265,290,350],HM=6;
const Hopt=(()=>{const mx=HX.reduce((a,b)=>a+b)/HM,my=HY.reduce((a,b)=>a+b)/HM;let sxy=0,sxx=0;for(let i=0;i<HM;i++){sxy+=(HX[i]-mx)*(HY[i]-my);sxx+=(HX[i]-mx)**2;}const w=sxy/sxx;return {w,b:my-w*mx};})();
function Jlin(w,b){let s=0;for(let i=0;i<HM;i++)s+=(w*HX[i]+b-HY[i])**2;return s/(2*HM);}

/* ---- 2 · retta e costo ---- */
function drawLR(){const w=+$("#lrW").value,b=+$("#lrB").value;$("#lrWo").textContent=fmt(w,2);$("#lrBo").textContent=fmt(b,0);
  const svg=$("#lrChart"),A=axes(svg,{W:460,H:300,x0:30,x1:150,y0:0,y1:450,xt:[50,75,100,125,150],yt:[0,100,200,300,400],xl:"superficie (m²)",yl:"prezzo (k€)"});
  path(svg,[[A.X(30),A.Y(w*30+b)],[A.X(150),A.Y(w*150+b)]],{stroke:css("--accent"),"stroke-width":2.5});
  let rows="";for(let i=0;i<HM;i++){const yh=w*HX[i]+b,e=yh-HY[i];el("line",{x1:A.X(HX[i]),x2:A.X(HX[i]),y1:A.Y(HY[i]),y2:A.Y(Math.max(0,Math.min(450,yh))),stroke:css("--bad"),"stroke-width":1.5,"stroke-dasharray":"3 3"},svg);el("circle",{cx:A.X(HX[i]),cy:A.Y(HY[i]),r:5,fill:css("--ink"),stroke:css("--surface"),"stroke-width":1.5},svg);}
  const J=Jlin(w,b),Jmin=Jlin(Hopt.w,Hopt.b);
  $("#lrRead").innerHTML=`<div><small>costo J(w, b)</small><strong>${fmt(J,1)}</strong></div><div><small>minimo possibile</small><strong>${fmt(Jmin,1)}</strong></div><div><small>stima per 100 m²</small><strong>${fmt(w*100+b,0)} k€</strong></div>`;
  const terms=HX.map((x,i)=>`(${fmt(w*x+b,0)}−${HY[i]})²`).join(" + ");
  $("#lrF").innerHTML=`J = 1/(2·6) · [ ${terms} ] = <b>${fmt(J,1)}</b>`;
  const r=J/Jmin;$("#lrMsg").innerHTML=r<1.15?"<b>Sei praticamente al minimo.</b> Gli errori residui non si possono eliminare: i punti non stanno su una retta. Qualunque altra coppia (w, b) dà un costo più alto.":r<3?"<b>Vicino, ma non al minimo.</b> Guarda il segno degli errori: se sono quasi tutti dello stesso segno, b va spostato; se cambiano segno da sinistra a destra, è la pendenza w a essere sbagliata.":"<b>Costo alto.</b> La retta è lontana dai punti: alcune linee tratteggiate sono lunghe, e il quadrato le fa pesare moltissimo. È questa amplificazione che rende la discesa del gradiente così decisa quando è lontana dal minimo.";}
["#lrW","#lrB"].forEach(s=>$(s).addEventListener("input",drawLR));

/* ---- 3 · discesa su J(w) ---- */
function dJdw(w,b){let s=0;for(let i=0;i<HM;i++)s+=(w*HX[i]+b-HY[i])*HX[i];return s/HM;}
function drawGD(){const w0=+$("#gdW0").value,a=+$("#gdA").value,N=+$("#gdN").value;$("#gdW0o").textContent=fmt(w0,1);$("#gdAo").textContent=a.toExponential(1).replace("e-","·10⁻");$("#gdNo").textContent=N;
  const b=Hopt.b,svg=$("#gdChart"),ymax=40000;const A=axes(svg,{W:560,H:260,x0:-1,x1:6,y0:0,y1:ymax,xt:[-1,0,1,2,3,4,5,6],yt:[0,10000,20000,30000,40000],yf:v=>v?(v/1000)+"k":"0",xl:"w",yl:"J(w) con b = "+fmt(b,1)});
  const curve=[];for(let i=0;i<=140;i++){const w=-1+7*i/140;curve.push([A.X(w),A.Y(Math.min(ymax,Jlin(w,b)))]);}path(svg,curve,{stroke:css("--muted"),"stroke-width":1.6});
  let w=w0;const pts=[[w,Jlin(w,b)]];let div=false;for(let i=0;i<N;i++){w=w-a*dJdw(w,b);pts.push([w,Jlin(w,b)]);if(!isFinite(w)||Math.abs(w)>1e6){div=true;break;}}
  for(let i=1;i<pts.length;i++){const p=A.clip(A.X(pts[i-1][0]),A.Y(Math.min(ymax,pts[i-1][1]))),q=A.clip(A.X(pts[i][0]),A.Y(Math.min(ymax,pts[i][1])));el("line",{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:css("--accent"),"stroke-width":1.5,opacity:.8},svg);}
  pts.forEach((p,i)=>{if(p[0]<-1||p[0]>6)return;el("circle",{cx:A.X(p[0]),cy:A.Y(Math.min(ymax,p[1])),r:i===pts.length-1?6:3.5,fill:i===0?css("--warn"):i===pts.length-1?css("--ink"):css("--accent"),stroke:css("--surface"),"stroke-width":1.5},svg);});
  el("text",{x:A.X(Hopt.w),y:A.Y(0)-6,"text-anchor":"middle"},svg,"minimo");
  const last=pts[pts.length-1],g=dJdw(last[0],b);
  $("#gdRead").innerHTML=`<div><small>w dopo ${pts.length-1} passi</small><strong>${isFinite(last[0])?fmt(last[0],3):"∞"}</strong></div><div><small>J</small><strong>${isFinite(last[1])?fmt(Math.min(last[1],1e9),1):"∞"}</strong></div><div><small>∂J/∂w qui</small><strong>${isFinite(g)?fmt(g,0):"∞"}</strong></div><div><small>w ottimo</small><strong>${fmt(Hopt.w,3)}</strong></div>`;
  const dev=Math.abs(last[0]-Hopt.w);
  $("#gdMsg").innerHTML=div||Math.abs(pts[pts.length-1][0]-Hopt.w)>Math.abs(w0-Hopt.w)*1.2?"<b>Divergenza:</b> ogni passo scavalca il minimo e atterra più lontano del precedente; J cresce invece di scendere. Il learning rate è troppo grande per la pendenza di questa ciotola: con x intorno a 100, la derivata è enorme e serve un α dell'ordine di 10⁻⁴.":Math.sign(pts[1][0]-pts[0][0])!==Math.sign(pts[pts.length-1][0]-pts[pts.length-2][0])&&pts.length>2?"<b>Oscillazione convergente:</b> il passo salta oltre il minimo e rimbalza da una parte all'altra, ma ogni volta più vicino. Funziona, ma un α un po' più piccolo arriverebbe prima e senza scosse.":dev<0.02?"<b>Convergenza:</b> la pallina è sul fondo, la derivata è quasi zero e i passi sono diventati impercettibili: con α fisso la discesa rallenta da sola. Guarda quanto erano lunghi i primi passi rispetto agli ultimi.":dev<0.3?"<b>Quasi arrivata:</b> i passi si accorciano perché la pendenza diminuisce. Aggiungi iterazioni, non α.":"<b>Troppo lento:</b> dopo tutti questi passi la pallina è ancora sul pendio. Il learning rate è prudente: puoi alzarlo di un fattore 3 finché la discesa resta liscia.";}
["#gdW0","#gdA","#gdN"].forEach(s=>$(s).addEventListener("input",drawGD));

/* ---- 4 · scaling: curve di livello ---- */
const FS_R=rng(7);const FS_X1=[],FS_X2=[],FS_Y=[];for(let i=0;i<24;i++){const s=50+Math.round(FS_R()*80),r=1+Math.round(FS_R()*4);FS_X1.push(s);FS_X2.push(r);FS_Y.push(2*s+15*r+20+(FS_R()-0.5)*30);}
function zs(a){const m=a.reduce((x,y)=>x+y)/a.length,sd=Math.sqrt(a.reduce((x,y)=>x+(y-m)**2,0)/a.length);return {v:a.map(x=>(x-m)/sd),m,sd};}
let fsMode="raw";const getFs=seg("#fsScale",v=>{fsMode=v;drawFS();});
function fsData(){if(fsMode==="raw")return {x1:FS_X1,x2:FS_X2};return {x1:zs(FS_X1).v,x2:zs(FS_X2).v};}
/* costo profilo: b ottimo per ogni (w1,w2) → J = (w−w*)ᵀA(w−w*) + Jmin con dati centrati */
function fsModel(){const {x1,x2}=fsData();const n=x1.length,c=a=>{const m=a.reduce((p,q)=>p+q)/n;return a.map(v=>v-m);};const X1=c(x1),X2=c(x2),Y=c(FS_Y);
  const s11=X1.reduce((p,v)=>p+v*v,0)/(2*n),s22=X2.reduce((p,v)=>p+v*v,0)/(2*n),s12=X1.reduce((p,v,i)=>p+v*X2[i],0)/(2*n),s1y=X1.reduce((p,v,i)=>p+v*Y[i],0)/(2*n),s2y=X2.reduce((p,v,i)=>p+v*Y[i],0)/(2*n);
  const wst=solve([[s11,s12],[s12,s22]],[s1y,s2y]);const Jmin=Y.reduce((p,v,i)=>p+(v-wst[0]*X1[i]-wst[1]*X2[i])**2,0)/(2*n);
  const J=(w1,w2)=>{const d1=w1-wst[0],d2=w2-wst[1];return Jmin+s11*d1*d1+2*s12*d1*d2+s22*d2*d2;};
  const grad=(w1,w2)=>{const d1=w1-wst[0],d2=w2-wst[1];return [2*(s11*d1+s12*d2),2*(s12*d1+s22*d2)];};
  return {wst,Jmin,J,grad,A:[[s11,s12],[s12,s22]]};}
function drawFS(){const aRel=+$("#fsA").value,N=+$("#fsN").value;$("#fsNo").textContent=N;
  const M=fsModel(),svg=$("#fsChart");const raw=fsMode==="raw";
  /* finestra attorno al minimo: ampiezza data dalla scala dei pesi */
  const span1=30,span2=30; /* stesse unità sui due assi: la forma della valle è reale */const x0=M.wst[0]-span1,x1=M.wst[0]+span1,y0=M.wst[1]-span2,y1=M.wst[1]+span2;
  const A=axes(svg,{W:460,H:340,x0,x1,y0,y1,xt:[x0,M.wst[0],x1],yt:[y0,M.wst[1],y1],xf:v=>fmt(v,0),yf:v=>fmt(v,0),xl:raw?"w₁ (peso della superficie)":"w₁ (superficie, z-score)",yl:raw?"w₂ (peso delle stanze)":"w₂ (stanze, z-score)"});
  /* ellissi di livello: autovettori di A */
  const [[a,b],[,c]]=M.A;const th=0.5*Math.atan2(2*b,a-c);const ct=Math.cos(th),st=Math.sin(th);const l1=a*ct*ct+2*b*ct*st+c*st*st,l2=a*st*st-2*b*ct*st+c*ct*ct;
  const Jmax=Math.max(M.J(x0,y0),M.J(x1,y1),M.J(x0,y1),M.J(x1,y0));
  for(let k=1;k<=7;k++){const lev=(Jmax-M.Jmin)*Math.pow(k/7,2);const r1=Math.sqrt(lev/l1),r2=Math.sqrt(lev/l2);const pts=[];for(let i=0;i<=72;i++){const t=i/72*2*Math.PI;const u=r1*Math.cos(t),v=r2*Math.sin(t);const w1=M.wst[0]+u*ct-v*st,w2=M.wst[1]+u*st+v*ct;pts.push(A.clip(A.X(w1),A.Y(w2)));}path(svg,pts,{stroke:css("--muted"),"stroke-width":1,opacity:.7});}
  /* discesa: α convertito nella scala giusta per il caso */
  const alpha=aRel*(raw?1.2e-5:0.012);let w1=M.wst[0]+(raw?6:-22),w2=M.wst[1]+24;const tr=[[w1,w2]];let steps=0;for(let i=0;i<N;i++){const g=M.grad(w1,w2);w1-=alpha*g[0];w2-=alpha*g[1];tr.push([w1,w2]);steps++;if(!isFinite(w1)||Math.abs(w1-M.wst[0])>span1*50)break;}
  for(let i=1;i<tr.length;i++){const p=A.clip(A.X(tr[i-1][0]),A.Y(tr[i-1][1])),q=A.clip(A.X(tr[i][0]),A.Y(tr[i][1]));el("line",{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:css("--accent"),"stroke-width":1.6},svg);}
  tr.forEach((p,i)=>{const q=A.clip(A.X(p[0]),A.Y(p[1]));el("circle",{cx:q[0],cy:q[1],r:i===tr.length-1?5:2.5,fill:i===0?css("--warn"):i===tr.length-1?css("--ink"):css("--accent")},svg);});
  el("circle",{cx:A.X(M.wst[0]),cy:A.Y(M.wst[1]),r:4,fill:"none",stroke:css("--good"),"stroke-width":2},svg);
  const last=tr[tr.length-1],Jl=M.J(last[0],last[1]),ratio=l1/l2;const ok=Math.hypot((last[0]-M.wst[0])/span1,(last[1]-M.wst[1])/span2)<0.03;
  $("#fsAo").textContent=aRel;$("#fsRead").innerHTML=`<div><small>rapporto tra le curvature</small><strong>${fmt(Math.max(ratio,1/ratio),0)} : 1</strong></div><div><small>J dopo ${steps} passi</small><strong>${isFinite(Jl)?fmt(Jl,0):"∞"}</strong></div><div><small>J minimo</small><strong>${fmt(M.Jmin,0)}</strong></div><div><small>w ottimi</small><strong>${fmt(M.wst[0],raw?2:0)} · ${fmt(M.wst[1],raw?1:0)}</strong></div>`;
  $("#fsMsg").innerHTML=raw?`<b>Feature grezze: una valle lunga e strettissima</b> (le curvature stanno ${fmt(Math.max(ratio,1/ratio),0)} a 1). La pendenza punta quasi sempre contro la parete vicina, non verso il fondo: la discesa zigzaga lungo w₁ e avanza pochissimo lungo w₂. ${ok?"È arrivata, ma guarda quanti passi sprecati a zigzag.":"Dopo "+steps+" passi è ancora lontana dal centro; alzando α oltre un certo punto diverge lungo w₁ prima di arrivare lungo w₂."}`:`<b>Con lo z-score la valle è quasi una ciotola rotonda</b> (curvature ${fmt(Math.max(ratio,1/ratio),1)} a 1): la pendenza punta verso il fondo e ogni passo è utile. ${ok?"Arrivata in "+steps+" passi. Stesso problema, stessi dati: è cambiata solo l'unità di misura delle feature.":"Alza α o i passi: con la ciotola rotonda si può essere molto più aggressivi."}`;}
["#fsA","#fsN"].forEach(s=>$(s).addEventListener("input",drawFS));

/* ---- 5 · logistica ---- */
const LG_X=[0.8,1.2,1.6,2.0,2.4,2.7,3.1,3.6,4.2,5.0],LG_Y=[0,0,0,0,1,0,1,1,1,1];
const sig=z=>1/(1+Math.exp(-z));
function drawLG(){const w=+$("#lgW").value,b=+$("#lgB").value;$("#lgWo").textContent=fmt(w,1);$("#lgBo").textContent=fmt(b,1);
  const svg=$("#lgChart"),A=axes(svg,{W:460,H:280,x0:0,x1:6,y0:-0.05,y1:1.05,xt:[0,1,2,3,4,5,6],yt:[0,0.5,1],yf:v=>fmt(v,1),xl:"dimensione (cm)",yl:"f(x) = P(maligno)"});
  const curve=[];for(let i=0;i<=120;i++){const x=6*i/120;curve.push([A.X(x),A.Y(sig(w*x+b))]);}path(svg,curve,{stroke:css("--accent"),"stroke-width":2.5});
  const xb=-b/w;if(xb>0&&xb<6){el("line",{x1:A.X(xb),x2:A.X(xb),y1:A.T,y2:A.T+A.ph,stroke:css("--ink"),"stroke-dasharray":"4 4"},svg);el("text",{x:A.X(xb)+4,y:A.T+12},svg,"confine x = "+fmt(xb,2));}
  el("line",{x1:A.L,x2:A.L+A.pw,y1:A.Y(0.5),y2:A.Y(0.5),class:"gl"},svg);
  let J=0,rows="",wrong=0;LG_X.forEach((x,i)=>{const f=sig(w*x+b),y=LG_Y[i],L=y?-Math.log(f):-Math.log(1-f);J+=L/LG_X.length;const pred=f>=0.5?1:0;if(pred!==y)wrong++;
    el("circle",{cx:A.X(x),cy:A.Y(y),r:5.5,fill:y?css("--bad"):css("--good"),stroke:css("--surface"),"stroke-width":1.5},svg);
    rows+=`<tr><td class="mono">${fmt(x,1)}</td><td class="mono">${y}</td><td class="mono">${fmt(f,2)}</td><td class="mono">${fmt(L,2)}</td><td>${pred===y?'<span class="pill ok">ok</span>':'<span class="pill ko">errato</span>'}</td></tr>`;});
  $("#lgTable").innerHTML=`<tr><th>x</th><th>y</th><th>f(x)</th><th>perdita</th><th>soglia 0,5</th></tr>${rows}`;
  $("#lgRead").innerHTML=`<div><small>costo J (media delle perdite)</small><strong>${fmt(J,3)}</strong></div><div><small>errori con soglia 0,5</small><strong>${wrong} / ${LG_X.length}</strong></div><div><small>confine −b/w</small><strong>${fmt(xb,2)} cm</strong></div>`;
  $("#lgMsg").innerHTML=wrong>3?"<b>Il confine è nel posto sbagliato.</b> Sposta b finché la linea tratteggiata cade tra i benigni e i maligni: intorno a 2,5 cm. Nota che il punto a 2,4 (maligno) e quello a 2,7 (benigno) si sovrappongono: nessun confine li separa entrambi.":wrong>1?"<b>Confine quasi giusto.</b> Guarda la colonna delle perdite: i due esempi «fuori posto» intorno a 2,5 cm costano molto, e nessun w o b può azzerarli. Il minimo del costo è un compromesso.":J>0.35?"<b>Classifica bene ma è poco sicura:</b> la S è morbida, f sta vicino a 0,5 per molti esempi e la perdita resta alta anche sugli esempi corretti. Alza w per irrigidirla.":"<b>Costo basso.</b> Con una S ripida gli esempi lontani dal confine hanno f vicino a 0 o 1 e perdita quasi nulla; il costo che resta viene dai due esempi sovrapposti. Se alzi ancora w, il costo scende di un soffio ma la perdita sui due punti ambigui esplode: è il segnale che senza regolarizzazione la discesa del gradiente continuerebbe a crescere w.";}
["#lgW","#lgB"].forEach(s=>$(s).addEventListener("input",drawLG));

/* ---- 6 · overfitting ---- */
const OF_R=rng(31);const OF_X=[],OF_Y=[];for(let i=0;i<12;i++){const x=40+90*i/11+ (OF_R()-0.5)*6;OF_X.push(x);OF_Y.push(60+2.2*x+0.012*(x-85)**2*1.6+(OF_R()-0.5)*44);}
const OF_TR=[0,1,3,4,6,7,9,10],OF_TE=[2,5,8,11];
function polyFit(d,lam){/* z-score per feature sul training, y centrata; ridge su w, b libero */
  const feats=x=>Array.from({length:d},(_,k)=>Math.pow(x,k+1));
  const Xtr=OF_TR.map(i=>feats(OF_X[i]));const mu=[],sd=[];for(let k=0;k<d;k++){const col=Xtr.map(r=>r[k]);const m=col.reduce((a,b)=>a+b)/col.length;const s=Math.sqrt(col.reduce((a,b)=>a+(b-m)**2,0)/col.length)||1;mu.push(m);sd.push(s);}
  const Z=Xtr.map(r=>r.map((v,k)=>(v-mu[k])/sd[k]));const ytr=OF_TR.map(i=>OF_Y[i]);const ym=ytr.reduce((a,b)=>a+b)/ytr.length;const yc=ytr.map(v=>v-ym);const m=Z.length;
  const A=Array.from({length:d},(_,i)=>Array.from({length:d},(_,j)=>Z.reduce((s,r)=>s+r[i]*r[j],0)/m+(i===j?lam/m:0)));const bv=Array.from({length:d},(_,i)=>Z.reduce((s,r,n)=>s+r[i]*yc[n],0)/m);
  const w=solve(A,bv);const f=x=>{const z=feats(x).map((v,k)=>(v-mu[k])/sd[k]);return ym+z.reduce((s,v,k)=>s+v*w[k],0);};
  const err=idx=>idx.reduce((s,i)=>s+(f(OF_X[i])-OF_Y[i])**2,0)/(2*idx.length);return {f,w,etr:err(OF_TR),ete:err(OF_TE)};}
function drawOF(){const d=+$("#ofD").value,ll=+$("#ofL").value,lam=ll<=-6?0:Math.pow(10,ll);$("#ofDo").textContent=d;$("#ofLo").textContent=lam?("10^"+fmt(ll,2).replace(",00","")):"0";
  const M=polyFit(d,lam),svg=$("#ofChart"),A=axes(svg,{W:460,H:300,x0:30,x1:140,y0:100,y1:420,xt:[40,60,80,100,120,140],yt:[100,200,300,400],xl:"superficie (m²)",yl:"prezzo (k€)"});
  const curve=[];for(let i=0;i<=200;i++){const x=30+110*i/200;const y=Math.max(100,Math.min(420,M.f(x)));curve.push([A.X(x),A.Y(y)]);}path(svg,curve,{stroke:css("--accent"),"stroke-width":2.5});
  OF_TR.forEach(i=>el("circle",{cx:A.X(OF_X[i]),cy:A.Y(OF_Y[i]),r:5,fill:css("--ink"),stroke:css("--surface"),"stroke-width":1.5},svg));
  OF_TE.forEach(i=>el("circle",{cx:A.X(OF_X[i]),cy:A.Y(OF_Y[i]),r:5,fill:css("--surface"),stroke:css("--bad"),"stroke-width":2},svg));
  const wmax=Math.max(...M.w.map(Math.abs));
  $("#ofRead").innerHTML=`<div><small>errore di training</small><strong>${fmt(M.etr,0)}</strong></div><div><small>errore di test</small><strong style="color:${M.ete>M.etr*3?"var(--bad)":"var(--good)"}">${fmt(M.ete,0)}</strong></div><div><small>parametri</small><strong>${d} + b</strong></div><div><small>|w| massimo (scalato)</small><strong>${fmt(wmax,0)}</strong></div>`;
  let m;if(d===1&&lam<1)m="<b>Grado 1: underfitting.</b> La retta non può seguire la curvatura dei dati: l'errore è alto sia sul training sia sul test, e nessun λ lo aggiusta. Il modello ha un pregiudizio (alto bias) che i dati non confermano.";
  else if(d<=3&&lam<1)m="<b>Grado "+d+": il compromesso buono.</b> La curva segue la forma dei dati senza inseguire i singoli punti: errore di training e di test sono vicini. È il modello che generalizza.";
  else if(d>=6&&lam<0.01)m=`<b>Grado ${d} senza regolarizzazione: overfitting.</b> Il polinomio passa quasi per tutti i punti pieni (errore di training ${fmt(M.etr,0)}) ma oscilla tra un punto e l'altro e sbaglia i punti vuoti (errore di test ${fmt(M.ete,0)}). Nota i pesi enormi: la curva si contorce solo perché i w possono essere grandi.`;
  else if(d>=6&&lam>=0.01&&lam<10)m=`<b>Grado ${d} con λ = ${$("#ofLo").textContent}: la tassa funziona.</b> I pesi si sono ristretti (|w| massimo ${fmt(wmax,0)}), la curva si è addolcita e l'errore di test è sceso pur tenendo tutte le feature. Questo è il punto della regolarizzazione: flessibilità disponibile, usata solo dove i dati la chiedono.`;
  else if(lam>=10)m="<b>λ troppo grande: underfitting per eccesso di tassa.</b> Tutti i w sono schiacciati verso zero e resta quasi solo b: una linea piatta, con errore alto ovunque. Il valore giusto di λ sta in mezzo, e si sceglie guardando l'errore su dati non usati per adattare (capitolo 9).";
  else m="<b>Zona intermedia.</b> Confronta errore di training e di test: quando il secondo è molto più alto del primo il modello sta imparando il rumore; quando sono entrambi alti è troppo rigido.";
  $("#ofMsg").innerHTML=m;}
["#ofD","#ofL"].forEach(s=>$(s).addEventListener("input",drawOF));
