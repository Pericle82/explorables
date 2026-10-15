const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/net::/.test(m.text()))errs.push(m.text())});
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const t=async id=>(await p.textContent(id)).trim().replace(/\s+/g,' ').slice(0,150);
console.log('nn0',await t('#nnRead'));await p.click('#nnStep10');await p.waitForTimeout(300);console.log('nn1k',await t('#nnRead'),await t('#nnMsg'));
await p.click('#nnStep10');console.log('nn2k',await t('#nnRead'));
await p.click('#nnH button:nth-child(1)');await p.click('#nnStep10');console.log('nnH1',await t('#nnRead'),await t('#nnMsg'));
console.log('sm',await t('#smRead'));console.log('lc',await t('#lcRead'),await t('#lcMsg'));
for(const i of [2,3,4]){await p.click('#lcModel button:nth-child('+i+')');console.log('lc'+i,await t('#lcRead'));}
console.log('pr',await t('#prRead'));console.log('dt',await t('#dtRead'),await t('#dtMsg'));
for(const i of [2,3]){await p.click('#dtF button:nth-child('+i+')');console.log('dt'+i,await t('#dtRead'));}
console.log('ERRS',errs);
await p.click('#nnH button:nth-child(3)');await p.click('#nnStep10');await p.click('#nnStep10');const e=await p.$('#nnChart');await e.scrollIntoViewIfNeeded();const lab=await p.evaluateHandle(el=>el.closest('.lab'),e);await lab.asElement().screenshot({path:__dirname+'/nn.png'});
const l=await p.$('#lcChart');await l.scrollIntoViewIfNeeded();await l.screenshot({path:__dirname+'/lc.png'});
await p.setViewportSize({width:400,height:800});await p.waitForTimeout(300);console.log('sw',await p.evaluate(()=>document.documentElement.scrollWidth));
await b.close();})();
