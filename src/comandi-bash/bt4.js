const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(500);
const t=(await p.$$('.term'))[2];const inp=await t.$('input');
for(const c of ["ss -ltnp","sudo ss -ltnp","lsof -iTCP -sTCP:LISTEN -n -P","kill -9 $(lsof -ti:3000)","lsof -ti:3000","netstat -tlnp"]){await inp.fill(c);await inp.press('Enter');}
console.log(await (await t.$('.term-out')).textContent());console.log(errs);await b.close();})();
