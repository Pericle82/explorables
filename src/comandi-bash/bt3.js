const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/net::/.test(m.text()))errs.push(m.text())});
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const T='.term:nth-of-type(1)';
const terms=await p.$$('.term');const t2=terms[2];
const inp=await t2.$('input');
const run=async c=>{await inp.fill(c);await inp.press('Enter');};
const btns=await t2.$$('.term-try button');for(const bt of btns){await bt.click();}

const txt=await (await t2.$('.term-out')).textContent();console.log(txt);console.log('ERRS',errs);
await t2.scrollIntoViewIfNeeded();await t2.screenshot({path:__dirname+'/term3.png'});
await p.setViewportSize({width:400,height:800});await p.waitForTimeout(300);console.log('sw',await p.evaluate(()=>document.documentElement.scrollWidth));
await b.close();})();
