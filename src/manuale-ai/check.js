// uso: node check.js [g07 g12 ...]  -> errori JS, larghezza a 400px, screenshot delle figure richieste in shots/
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/net::/.test(m.text()))errs.push(m.text())});
const TAG=process.env.TAG||'';await p.goto(`file://${__dirname}/test${TAG?'-'+TAG:''}.html`);await p.waitForTimeout(800);
require('fs').mkdirSync(__dirname+'/shots',{recursive:true});
const want=process.argv.slice(2);
for(const w of want){const n=w.replace(/^g0?/,'');const sec=await p.$(`#g${n} .fig`)||await p.$(`#${w}`);if(!sec){console.log('nessuna figura per',w);continue;}
  for(const vw of [1100,400]){await p.setViewportSize({width:vw,height:900});await sec.scrollIntoViewIfNeeded();await p.waitForTimeout(150);await sec.screenshot({path:`${__dirname}/shots/${w}-${vw}.png`});}
  await p.setViewportSize({width:1100,height:900});}
await p.setViewportSize({width:400,height:800});await p.waitForTimeout(200);
const sw=await p.evaluate(()=>document.documentElement.scrollWidth);
const wide=await p.evaluate(()=>[...document.querySelectorAll('.fig,.lab')].filter(e=>e.scrollWidth>e.clientWidth+2&&!e.closest('.scroll-x')).map(e=>(e.closest('section')||{}).id));
console.log(JSON.stringify({errs,scrollWidth400:sw,figureTroppoLarghe:wide}));
await b.close();})();
