const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/net::/.test(m.text()))errs.push(m.text())});
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const n=await p.evaluate(async()=>{let c=0;const sl=ms=>new Promise(r=>setTimeout(r,ms));
 for(const f of document.querySelectorAll('.fig, #mappa, #storia')){
  for(const r of f.querySelectorAll('input[type=range]')){for(const v of [r.min,r.max,(+r.min+ +r.max)/2]){r.value=v;r.dispatchEvent(new Event('input',{bubbles:true}));r.dispatchEvent(new Event('change',{bubbles:true}));c++;}}
  for(const bt of f.querySelectorAll('button')){bt.click();c++;}
  for(const g of f.querySelectorAll('svg [data-i],svg g[role=button],svg [tabindex],.tok[data-i],td[data-r]')){g.dispatchEvent(new MouseEvent('click',{bubbles:true}));c++;}
 }
 await sl(3000);
 for(const f of document.querySelectorAll('.fig')){for(const bt of f.querySelectorAll('button'))bt.click();}
 await sl(500);return c;});
console.log('azioni',n,'errori',JSON.stringify(errs));
const bad=await p.evaluate(()=>[...document.querySelectorAll('.fig svg text')].filter(t=>/NaN|undefined|Infinity/.test(t.textContent)).length+[...document.querySelectorAll('.fig .readout, .fig .callout')].filter(t=>/NaN|undefined/.test(t.textContent)).length);
console.log('testi con NaN/undefined',bad);await b.close();})();
