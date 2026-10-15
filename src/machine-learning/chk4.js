const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/net::/.test(m.text()))errs.push(m.text())});
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const t=async id=>(await p.textContent(id)).trim().replace(/\s+/g,' ').slice(0,160);
const out={};
out.km0=await t('#kmRead');await p.click('#kmStep');await p.click('#kmStep');out.km2=await t('#kmRead');await p.click('#kmRun');out.kmRun=await t('#kmRead');out.kmMsg=await t('#kmMsg');
await p.click('#kmK button[data-v="2"]');await p.click('#kmRun');out.kmK2=await t('#kmRead')+' | '+await t('#kmMsg');
await p.click('#kmK button[data-v="3"]');for(let i=0;i<5;i++){await p.click('#kmNew');await p.click('#kmRun');out['kmNew'+i]=(await t('#kmRead')).slice(0,80);}
out.ad0=await t('#adRead');await p.$eval('#adE',e=>{e.value=-2;e.dispatchEvent(new Event('input'))});out.adE2=await t('#adRead');
await p.click('#adT button[data-v="log"]');out.adLog=await t('#adRead')+' | '+await t('#adMsg');
for(const v of [-1.5,-2.5,-3.5,-5]){await p.$eval('#adE',(e,v)=>{e.value=v;e.dispatchEvent(new Event('input'))},v);out['adLog'+v]=await t('#adRead');}
out.cf0=await t('#cfRead');await p.click('#cfStep');out.cf200=await t('#cfRead');for(let i=0;i<7;i++)await p.click('#cfStep');out.cf1600=await t('#cfRead');out.cfTable=(await t('#cfTable')).slice(0,400);
out.rl0=await t('#rlRead');await p.click('#rlStep');out.rl1=await t('#rlRead');await p.click('#rlRun');out.rlRun=await t('#rlRead')+' | '+await t('#rlMsg');
await p.$eval('#rlG',e=>{e.value=0.3;e.dispatchEvent(new Event('input'))});await p.click('#rlRun');out.rlG03=await t('#rlRead');
await p.$eval('#rlG',e=>{e.value=0.9;e.dispatchEvent(new Event('input'))});await p.click('#rlRun');out.rlG09=await t('#rlRead');
await p.$eval('#rlP',e=>{e.value=0.3;e.dispatchEvent(new Event('input'))});await p.click('#rlRun');out.rlP=await t('#rlRead')+' | '+await t('#rlMsg');
out.xref=await p.evaluate(()=>document.querySelectorAll('.xref,[data-xref],a.xr').length);
console.log(JSON.stringify({errs,...out},null,1));
await p.setViewportSize({width:400,height:800});await p.waitForTimeout(300);console.log('sw',await p.evaluate(()=>document.documentElement.scrollWidth));
for(const [id,f] of [['#kmChart','km'],['#adChart','ad'],['#cfTable','cf'],['#rlGrid','rl']]){await p.setViewportSize({width:1100,height:900});const e=await p.$(id);await e.scrollIntoViewIfNeeded();const lab=await p.evaluateHandle(el=>el.closest('.lab'),e);await lab.asElement().screenshot({path:__dirname+'/'+f+'.png'});}
await p.setViewportSize({width:400,height:800});const e=await p.$('#rlGrid');await e.scrollIntoViewIfNeeded();await (await p.evaluateHandle(el=>el.closest('.lab'),e)).asElement().screenshot({path:__dirname+'/rl400.png'});
await b.close();})();
