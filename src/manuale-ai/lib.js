/* helper condivisi dalle figure: window.G */
window.G=(function(){
const NS="http://www.w3.org/2000/svg";
const $=s=>document.querySelector(s);
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function el(tag,attrs,parent,txt){const e=document.createElementNS(NS,tag);for(const k in attrs||{})e.setAttribute(k,attrs[k]);if(txt!=null)e.textContent=txt;if(parent)parent.appendChild(e);return e;}
function clear(n){while(n.firstChild)n.removeChild(n.firstChild);}
const fmt=(v,d=1)=>(Math.abs(v)<0.5*Math.pow(10,-d)?0:v).toLocaleString("it-IT",{minimumFractionDigits:d,maximumFractionDigits:d}).replace("-","−");
function seg(sel,cb){const g=$(sel);g.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));cb(b.dataset.v);});return ()=>g.querySelector('[aria-pressed="true"]').dataset.v;}
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const redraws=[];function onTheme(f){redraws.push(f);}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>redraws.forEach(f=>f()));
new MutationObserver(()=>redraws.forEach(f=>f())).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
return {NS,$,css,el,clear,fmt,seg,rng,onTheme};
})();
