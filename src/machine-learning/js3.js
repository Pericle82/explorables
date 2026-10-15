/* ================= PARTE III ================= */
const PAL=["#6B3A7D","#2C7A7B","#B26A00","#1F5FA8","#8A1C3C","#5E6B1E"];
const PALD=["#C79BDC","#5FC3C4","#F0B35E","#7FB3F2","#E57A98","#B7C45A"];
const dark=()=>document.documentElement.getAttribute("data-theme")==="dark"||(!document.documentElement.getAttribute("data-theme")&&matchMedia("(prefers-color-scheme: dark)").matches);
const pal=i=>(dark()?PALD:PAL)[i%6];

/* ---- 11 · k-means ---- */
const KM_R=rng(1234);const KM_P=[];
[[0.28,0.30,0.08],[0.70,0.35,0.09],[0.50,0.75,0.07]].forEach(([cx,cy,s])=>{for(let i=0;i<30;i++){const u1=KM_R()||1e-9,u2=KM_R(),r=Math.sqrt(-2*Math.log(u1));KM_P.push([cx+s*r*Math.cos(6.2832*u2),cy+s*r*Math.sin(6.2832*u2)]);}});
let kmK=3,kmC=[],kmA=[],kmPhase="assign",kmIt=0,kmHist=[],kmSeed=1,kmDone=false;
const kmDist=(p,c)=>(p[0]-c[0])**2+(p[1]-c[1])**2;
function kmJ(){let s=0;KM_P.forEach((p,i)=>{if(kmA[i]>=0)s+=kmDist(p,kmC[kmA[i]]);});return s/KM_P.length;}
function kmInit(){const r=rng(kmSeed*97+kmK);const idx=[];while(idx.length<kmK){const i=Math.floor(r()*KM_P.length);if(!idx.includes(i))idx.push(i);}kmC=idx.map(i=>KM_P[i].slice());kmA=KM_P.map(()=>-1);kmPhase="assign";kmIt=0;kmHist=[];kmDone=false;}
function kmAssign(){let ch=0;KM_P.forEach((p,i)=>{let b=0,bd=Infinity;kmC.forEach((c,k)=>{const d=kmDist(p,c);if(d<bd){bd=d;b=k;}});if(b!==kmA[i])ch++;kmA[i]=b;});kmHist.push(kmJ());return ch;}
function kmMove(){kmC=kmC.map((c,k)=>{const m=KM_P.filter((p,i)=>kmA[i]===k);if(!m.length)return c;return [m.reduce((s,p)=>s+p[0],0)/m.length,m.reduce((s,p)=>s+p[1],0)/m.length];});kmIt++;}
function kmStepOnce(){if(kmPhase==="assign"){const ch=kmAssign();if(kmIt>0&&ch===0)kmDone=true;kmPhase="move";}else{kmMove();kmPhase="assign";}}
function drawKM(){const svg=$("#kmChart");clear(svg);const S=360,P=10,X=v=>P+v*(S-2*P),Y=v=>S-P-v*(S-2*P);
  el("rect",{x:P,y:P,width:S-2*P,height:S-2*P,fill:"none",stroke:css("--line")},svg);
  KM_P.forEach((p,i)=>el("circle",{cx:X(p[0]),cy:Y(p[1]),r:4.5,fill:kmA[i]>=0?pal(kmA[i]):css("--muted"),opacity:kmA[i]>=0?.85:.5},svg));
  kmC.forEach((c,k)=>{const x=X(c[0]),y=Y(c[1]);el("line",{x1:x-9,x2:x+9,y1:y,y2:y,stroke:css("--surface"),"stroke-width":5},svg);el("line",{x1:x,x2:x,y1:y-9,y2:y+9,stroke:css("--surface"),"stroke-width":5},svg);el("line",{x1:x-8,x2:x+8,y1:y,y2:y,stroke:pal(k),"stroke-width":3},svg);el("line",{x1:x,x2:x,y1:y-8,y2:y+8,stroke:pal(k),"stroke-width":3},svg);});
  const J=kmA[0]>=0?kmJ():NaN;
  $("#kmRead").innerHTML=`<div><small>iterazione</small><strong>${kmIt}</strong></div><div><small>prossimo passo</small><strong>${kmPhase==="assign"?"assegna":"sposta"}</strong></div><div><small>distorsione J</small><strong>${isNaN(J)?"—":fmt(J*1000,2)+"·10⁻³"}</strong></div><div><small>K</small><strong>${kmK}</strong></div>`;
  const jh=$("#kmJ");const n=Math.max(kmHist.length,2),ymax=Math.max(0.02,...kmHist.map(v=>v*1.05),0.001);
  const A=axes(jh,{W:400,H:160,x0:0,x1:n-1,y0:0,y1:ymax,L:54,B:30,xt:Array.from({length:n},(_,i)=>i).filter(i=>n<=8||i%Math.ceil(n/8)===0),yt:[0,ymax/2,ymax],yf:v=>fmt(v*1000,1),xl:"assegnazione n° · J in millesimi",yl:""});
  if(kmHist.length){path(jh,kmHist.map((v,i)=>[A.X(i),A.Y(v)]),{stroke:css("--accent"),"stroke-width":2});kmHist.forEach((v,i)=>el("circle",{cx:A.X(i),cy:A.Y(v),r:3,fill:css("--accent")},jh));}
  const empty=kmC.some((c,k)=>!kmA.includes(k))&&kmA[0]>=0;
  $("#kmMsg").innerHTML=kmA[0]<0?"<b>Centroidi appena pescati</b> tra i punti, a caso. Nessun punto è ancora assegnato: premi «Assegna / Sposta».":kmDone?(kmK===3?"<b>Convergenza:</b> nessun punto cambia cluster, quindi anche i centroidi non si muoverebbero più. Con K = 3 di solito i tre gruppi vengono trovati; prova «Nuova partenza» qualche volta per vedere se un'inizializzazione sfortunata divide un gruppo in due e ne fonde altri due (J finale più alta).":kmK<3?"<b>Convergenza</b> con K troppo piccolo: due gruppi reali condividono un centroide, e J resta alta. L'algoritmo non si lamenta: minimizza J per il K che gli hai dato.":"<b>Convergenza</b> con K più grande dei gruppi reali: qualche gruppo viene spezzato in due. J è più bassa che con K = 3 (più centroidi, distanze minori), ma non per questo il risultato è «migliore»: il gomito è a 3."):kmPhase==="move"?"<b>Assegnati.</b> Ogni punto ha preso il colore del centroide più vicino. Ora i centroidi non sono più al centro dei loro punti: «Sposta» li porterà lì, e J scenderà."+(empty?" Un centroide è rimasto senza punti: resta dov'è (oppure si elimina, o si ripesca).":""):"<b>Spostati.</b> Ogni centroide è la media dei suoi punti. Ma dopo lo spostamento alcuni punti possono essere più vicini a un altro centroide: la prossima «Assegna» li cambierà di colore.";}
seg("#kmK",v=>{kmK=+v;kmInit();drawKM();});
$("#kmStep").addEventListener("click",()=>{kmStepOnce();drawKM();});
$("#kmRun").addEventListener("click",()=>{let g=0;while(!kmDone&&g<200){kmStepOnce();g++;}if(kmPhase==="assign"){kmAssign();kmPhase="move";kmDone=true;}drawKM();});
$("#kmNew").addEventListener("click",()=>{kmSeed++;kmInit();drawKM();});
kmInit();

/* ---- 12 · anomalie ---- */
const AD_R=rng(55);const AD_N=[];for(let i=0;i<300;i++){const u1=AD_R()||1e-9,u2=AD_R();AD_N.push(Math.exp(1.0+0.45*Math.sqrt(-2*Math.log(u1))*Math.cos(6.2832*u2)));}
const AD_A=[11.5,13.2,16.8,19.5,24.0,0.22,9.4];
let adMode="raw";seg("#adT",v=>{adMode=v;drawAD();});
const adF=x=>adMode==="raw"?x:Math.log(x);
const gauss=(x,m,s)=>Math.exp(-((x-m)**2)/(2*s*s))/(s*Math.sqrt(2*Math.PI));
function drawAD(){const le=+$("#adE").value,eps=Math.pow(10,le);$("#adEo").textContent="10^"+fmt(le,2).replace(",00","");
  const xs=AD_N.map(adF),mu=xs.reduce((a,b)=>a+b)/xs.length,sd=Math.sqrt(xs.reduce((a,b)=>a+(b-mu)**2,0)/xs.length);
  const an=AD_A.map(adF),all=xs.concat(an);const x0=adMode==="raw"?0:Math.min(...all)-0.4,x1=adMode==="raw"?26:Math.max(...all)+0.4;
  const nb=40,bw=(x1-x0)/nb,bins=new Array(nb).fill(0);xs.forEach(v=>{const b=Math.min(nb-1,Math.max(0,Math.floor((v-x0)/bw)));bins[b]++;});
  const dens=bins.map(c=>c/(xs.length*bw)),pmax=Math.max(gauss(mu,mu,sd),...dens)*1.12;
  const svg=$("#adChart"),A=axes(svg,{W:560,H:260,x0,x1,y0:0,y1:pmax,xt:adMode==="raw"?[0,5,10,15,20,25]:[-2,-1,0,1,2,3],yt:[0,pmax/2,pmax],yf:v=>fmt(v,2),xl:adMode==="raw"?"vibrazione x":"log(x)",yl:"densità p"});
  /* zona anomala: dove p(x)<ε */
  const half=sd*Math.sqrt(Math.max(0,-2*Math.log(eps*sd*Math.sqrt(2*Math.PI))));const lo=mu-half,hi=mu+half;
  if(eps*sd*Math.sqrt(2*Math.PI)<1){if(lo>x0)el("rect",{x:A.X(x0),y:A.T,width:A.X(Math.min(lo,x1))-A.X(x0),height:A.ph,fill:css("--bad"),opacity:.08},svg);if(hi<x1)el("rect",{x:A.X(Math.max(hi,x0)),y:A.T,width:A.X(x1)-A.X(Math.max(hi,x0)),height:A.ph,fill:css("--bad"),opacity:.08},svg);}
  else el("rect",{x:A.X(x0),y:A.T,width:A.pw,height:A.ph,fill:css("--bad"),opacity:.08},svg);
  dens.forEach((d,i)=>el("rect",{x:A.X(x0+i*bw)+0.5,y:A.Y(d),width:Math.max(0,A.X(bw)-A.X(0)-1),height:A.Y(0)-A.Y(d),fill:css("--accent"),opacity:.35},svg));
  const cur=[];for(let i=0;i<=200;i++){const x=x0+(x1-x0)*i/200;cur.push([A.X(x),A.Y(Math.min(pmax,gauss(x,mu,sd)))]);}path(svg,cur,{stroke:css("--accent"),"stroke-width":2.2});
  el("line",{x1:A.L,x2:A.L+A.pw,y1:A.Y(Math.min(pmax,eps)),y2:A.Y(Math.min(pmax,eps)),stroke:css("--bad"),"stroke-dasharray":"5 4","stroke-width":1.5},svg);el("text",{x:A.L+A.pw-4,y:A.Y(Math.min(pmax,eps))-5,"text-anchor":"end",fill:css("--bad")},svg,"ε");
  const flagN=xs.filter(v=>gauss(v,mu,sd)<eps).length,flagA=an.filter(v=>gauss(v,mu,sd)<eps).length;
  an.forEach(v=>{const f=gauss(v,mu,sd)<eps;el("circle",{cx:A.X(Math.max(x0,Math.min(x1,v))),cy:A.Y(0)-7,r:5,fill:f?css("--bad"):"none",stroke:css("--bad"),"stroke-width":2},svg);});
  xs.forEach(v=>{if(gauss(v,mu,sd)<eps)el("circle",{cx:A.X(v),cy:A.Y(0)-7,r:3,fill:css("--ink"),opacity:.7},svg);});
  const tp=flagA,fp=flagN,fn=AD_A.length-flagA,prec=tp+fp?tp/(tp+fp):0,rec=tp/AD_A.length,f1=prec+rec?2*prec*rec/(prec+rec):0;
  $("#adRead").innerHTML=`<div><small>μ, σ stimati</small><strong>${fmt(mu,2)} · ${fmt(sd,2)}</strong></div><div><small>difettosi trovati</small><strong>${tp} / 7</strong></div><div><small>buoni segnalati (falsi allarmi)</small><strong>${fp}</strong></div><div><small>precisione · recall · F1</small><strong>${fmt(prec*100,0)}% · ${fmt(rec*100,0)}% · ${fmt(f1,2)}</strong></div>`;
  const skew=adMode==="raw";
  $("#adMsg").innerHTML=skew?(fp>15?"<b>Troppi falsi allarmi.</b> Sulla feature grezza la campana stimata non somiglia ai dati: la coda destra lunga gonfia σ e sposta μ, così la gaussiana è larga e piatta, e la soglia taglia nel posto sbagliato. Abbassa ε, oppure (meglio) passa a log(x).":fn>0?"<b>Alcuni difettosi sfuggono.</b> Con la coda lunga la gaussiana è così larga che anche valori molto alti hanno p(x) non troppo bassa; il piccolo valore anomalo 0,22 poi sta vicino al grosso dei dati. Guarda cosa cambia con log(x).":"<b>Tutti e sette presi</b>, ma osserva quanta parte della campana sta dove non ci sono dati (a sinistra dello zero): la gaussiana è un modello povero di questi dati. La trasformazione log la rende fedele."):(f1>0.9?"<b>Buona separazione.</b> In scala logaritmica i dati normali formano una campana quasi perfetta, μ e σ la descrivono bene e i difettosi stanno nelle due code: anche quello piccolo (0,22) finisce a sinistra, lontano. Questo ε sarebbe quello scelto dal cross-validation set.":fp>10?"<b>ε troppo alto:</b> segnali anche punti normali in coda. Precisione bassa. Abbassa ε finché i falsi allarmi scendono senza perdere difettosi: è esattamente la scelta che il cross-validation set fa massimizzando F1.":"<b>ε troppo basso:</b> la soglia è così severa che alcuni difettosi passano per normali. Alza ε; il miglior compromesso è dove F1 è massimo.");}
$("#adE").addEventListener("input",drawAD);

/* ---- 13 · filtro collaborativo ---- */
const CF_U=["Alice","Bruno","Carla","Dario"],CF_F=["Amore a Parigi","Fuga da Marte","Il caso Rossi","Risate in famiglia","Guerra stellare"];
const CF_Y=[[5,0,null,4,1],[5,null,2,5,0],[0,5,null,1,4],[null,4,1,0,5]];
let cfW,cfB,cfX,cfSteps,cfR;
function cfInit(){cfR=rng(9);const r=()=>(cfR()-0.5)*0.6;cfW=CF_U.map(()=>[r(),r()]);cfB=CF_U.map(()=>0);cfX=CF_F.map(()=>[r(),r()]);cfSteps=0;}
const cfPred=(j,i)=>cfW[j][0]*cfX[i][0]+cfW[j][1]*cfX[i][1]+cfB[j];
function cfCost(){let s=0;CF_Y.forEach((row,j)=>row.forEach((y,i)=>{if(y!=null)s+=(cfPred(j,i)-y)**2;}));const lam=0.1;let reg=0;cfW.forEach(w=>reg+=w[0]**2+w[1]**2);cfX.forEach(x=>reg+=x[0]**2+x[1]**2);return s/2+lam/2*reg;}
function cfTrain(n){const lam=0.1,a=0.02;for(let t=0;t<n;t++){const gW=cfW.map(w=>[lam*w[0],lam*w[1]]),gB=cfB.map(()=>0),gX=cfX.map(x=>[lam*x[0],lam*x[1]]);
  CF_Y.forEach((row,j)=>row.forEach((y,i)=>{if(y==null)return;const e=cfPred(j,i)-y;gW[j][0]+=e*cfX[i][0];gW[j][1]+=e*cfX[i][1];gB[j]+=e;gX[i][0]+=e*cfW[j][0];gX[i][1]+=e*cfW[j][1];}));
  cfW=cfW.map((w,j)=>[w[0]-a*gW[j][0],w[1]-a*gW[j][1]]);cfB=cfB.map((b,j)=>b-a*gB[j]);cfX=cfX.map((x,i)=>[x[0]-a*gX[i][0],x[1]-a*gX[i][1]]);cfSteps++;}}
function drawCF(){const t=$("#cfTable");let h="<thead><tr><th></th>"+CF_F.map(f=>`<th>${f}</th>`).join("")+"<th>gusti w<sup>(j)</sup></th></tr></thead><tbody>";
  CF_Y.forEach((row,j)=>{h+=`<tr><th>${CF_U[j]}</th>`+row.map((y,i)=>{const p=cfPred(j,i);return y==null?`<td style="color:var(--accent);font-weight:600">—  →  ${fmt(Math.max(0,Math.min(5,p)),1)}</td>`:`<td>${y} <small style="color:var(--muted)">(${fmt(p,1)})</small></td>`;}).join("")+`<td><small>${fmt(cfW[j][0],2)}, ${fmt(cfW[j][1],2)}</small></td></tr>`;});
  h+=`<tr><th>feature x<sup>(i)</sup></th>`+CF_F.map((f,i)=>`<td><small>${fmt(cfX[i][0],2)}, ${fmt(cfX[i][1],2)}</small></td>`).join("")+"<td></td></tr></tbody>";t.innerHTML=h;
  let se=0,n=0;CF_Y.forEach((row,j)=>row.forEach((y,i)=>{if(y!=null){se+=(cfPred(j,i)-y)**2;n++;}}));
  $("#cfRead").innerHTML=`<div><small>passi di gradiente</small><strong>${cfSteps}</strong></div><div><small>costo J</small><strong>${fmt(cfCost(),2)}</strong></div><div><small>errore medio sui voti noti</small><strong>${fmt(Math.sqrt(se/n),2)} stelle</strong></div>`;
  $("#cfMsg").innerHTML=cfSteps===0?"<b>Parametri casuali e piccoli:</b> tutte le previsioni sono vicine a zero, il costo è alto. I numeri in parentesi sono le ricostruzioni dei voti noti; le celle colorate sono i buchi da riempire.":cfSteps<400?"<b>Sta imparando.</b> I voti noti vengono ricostruiti sempre meglio e i buchi si riempiono di valori plausibili. Guarda Alice e Bruno (gusti simili) e Carla e Dario: i loro w<sup>(j)</sup> stanno diventando simili a coppie, e opposti tra le coppie.":cfSteps<1200?"<b>Quasi convergente.</b> Le due feature di ogni film ora separano i film «alla Alice/Bruno» da quelli «alla Carla/Dario»: film con voti simili hanno finito con x<sup>(i)</sup> vicini, senza che nessuno abbia detto che cosa misurano. Le previsioni nei buchi seguono quella logica (il film 3, votato poco e tiepidamente, resta incerto).":"<b>Convergenza.</b> La regolarizzazione impedisce ai parametri di crescere per azzerare l'errore sui 16 voti noti: resta un piccolo residuo, ma le previsioni nei buchi sono quelle ragionevoli. Con più utenti e più film le feature imparate diventano più stabili e significative.";}
$("#cfStep").addEventListener("click",()=>{cfTrain(200);drawCF();});
$("#cfReset").addEventListener("click",()=>{cfInit();drawCF();});
cfInit();

/* ---- 14 · rover e Bellman ---- */
const RL_R=[100,0,0,0,0,40];let rlQ,rlIt,rlDelta;
function rlInit(){rlQ=RL_R.map(()=>[0,0]);rlIt=0;rlDelta=NaN;}
const rlV=s=>(s===0||s===5)?RL_R[s]:Math.max(rlQ[s][0],rlQ[s][1]);
function rlBellman(){const g=+$("#rlG").value,p=+$("#rlP").value;const V=RL_R.map((_,s)=>rlV(s));let d=0;const nq=rlQ.map((q,s)=>{if(s===0||s===5)return [RL_R[s],RL_R[s]];const L=RL_R[s]+g*((1-p)*V[s-1]+p*V[s+1]),Rr=RL_R[s]+g*((1-p)*V[s+1]+p*V[s-1]);d=Math.max(d,Math.abs(L-q[0]),Math.abs(Rr-q[1]));return [L,Rr];});rlQ=nq;rlIt++;rlDelta=d;}
function drawRL(){const g=+$("#rlG").value,p=+$("#rlP").value;$("#rlGo").textContent=fmt(g,2);$("#rlPo").textContent=fmt(p,2);
  const grid=$("#rlGrid");let h="";let pol="";
  for(let s=0;s<6;s++){const term=s===0||s===5;const q=rlQ[s];const tie=Math.abs(q[0]-q[1])<1e-6;const left=!term&&!tie&&q[0]>q[1],right=!term&&!tie&&q[1]>q[0];pol+=term?"■":tie?"?":left?"←":"→";
    h+=`<div class="rl-cell${term?" term":""}${s===3?" start":""}"><div class="rl-r">R = ${RL_R[s]}</div>${term?`<div class="rl-arrow">■</div><div class="rl-q">fine</div>`:`<div class="rl-arrow">${rlIt===0?"·":tie?"← →":left?"←":"→"}</div><div class="rl-q">Q← <b>${fmt(q[0],1)}</b><br>Q→ <b>${fmt(q[1],1)}</b></div>`}<div class="rl-n">${s+1}${s===3?" · partenza":""}</div></div>`;}
  grid.innerHTML=h;
  $("#rlRead").innerHTML=`<div><small>passi di Bellman</small><strong>${rlIt}</strong></div><div><small>variazione massima</small><strong>${isNaN(rlDelta)?"—":fmt(rlDelta,3)}</strong></div><div><small>policy (caselle 1–6)</small><strong>${pol}</strong></div><div><small>Q(4, ←) · Q(4, →)</small><strong>${fmt(rlQ[3][0],1)} · ${fmt(rlQ[3][1],1)}</strong></div>`;
  const conv=rlIt>0&&rlDelta<1e-3;
  let m;if(rlIt===0)m="<b>Q azzerata.</b> Nessuna informazione sul futuro: ogni casella intermedia vale 0. Premi «Un passo»: la ricompensa delle estremità entra nelle caselle adiacenti (2 e 5), e a ogni passo si propaga di una casella, scontata di γ.";
  else if(!conv)m=`<b>Propagazione in corso.</b> Dopo ${rlIt} pass${rlIt===1?"o":"i"} l'informazione sulle ricompense è arrivata fino a ${rlIt} casell${rlIt===1?"a":"e"} di distanza dalle estremità. Bellman è una ricorsione: ogni passo allunga di uno l'orizzonte su cui Q è corretta.`;
  else{const s4r=rlQ[3][1]>rlQ[3][0];m=p>0?`<b>Convergenza in un ambiente stocastico.</b> Con probabilità ${fmt(p,2)} di scivolare, Q è un ritorno <i>atteso</i>: i valori sono più bassi (a volte si va nella direzione sbagliata) e le decisioni vicine al confine possono cambiare. Dalla casella 4 il rover va ${s4r?"a destra, verso il 40 sicuro e vicino":"a sinistra, verso il 100"}.`:s4r?`<b>Convergenza.</b> Con γ = ${fmt(g,2)} il rover è impaziente: dalla casella 4 preferisce il 40 a due passi (${fmt(rlQ[3][1],1)}) al 100 a tre passi (${fmt(rlQ[3][0],1)}). Alza γ e vedi dove la decisione si ribalta.`:`<b>Convergenza.</b> Con γ = ${fmt(g,2)} il rover è paziente: dalla casella 4 vale la pena fare tre passi verso il 100 (${fmt(rlQ[3][0],1)}) piuttosto che due verso il 40 (${fmt(rlQ[3][1],1)}). Sotto γ = 0,4 la decisione nella casella 4 si ribalta (100γ³ contro 40γ²); sopra circa 0,74 anche la casella 5 va a sinistra (100γ⁴ contro 40γ).`;}
  $("#rlMsg").innerHTML=m;}
$("#rlStep").addEventListener("click",()=>{rlBellman();drawRL();});
$("#rlRun").addEventListener("click",()=>{let k=0;do{rlBellman();k++;}while(rlDelta>1e-6&&k<500);drawRL();});
$("#rlReset").addEventListener("click",()=>{rlInit();drawRL();});
["#rlG","#rlP"].forEach(s=>$(s).addEventListener("input",()=>{rlInit();drawRL();}));
rlInit();
