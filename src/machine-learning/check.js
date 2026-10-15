const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/net::/.test(m.text()))errs.push(m.text())});
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const t=async id=>{try{return (await p.textContent(id)).trim().replace(/\s+/g,' ').slice(0,120)}catch(e){return 'MISSING '+id}};
const ids=process.argv.slice(2);const r={};for(const id of ids)r[id]=await t(id);
console.log(JSON.stringify({errs,...r},null,1));
await p.setViewportSize({width:400,height:800});await p.waitForTimeout(300);console.log('sw',await p.evaluate(()=>document.documentElement.scrollWidth));
for(const [id,f] of (process.env.SHOTS||'').split(',').filter(Boolean).map(s=>s.split(':'))){await p.setViewportSize({width:1100,height:900});const e=await p.$(id);if(!e)continue;await e.scrollIntoViewIfNeeded();const lab=await p.evaluateHandle(el=>el.closest('.lab')||el,e);await lab.asElement().screenshot({path:__dirname+'/'+f+'.png'});}
await b.close();})();
