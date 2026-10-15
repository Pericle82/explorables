const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(500);
const r=[];for(let i=0;i<30;i++){await p.click('#kmNew');await p.click('#kmRun');r.push((await p.textContent('#kmRead')).match(/J([\d,]+)/)[1]);}
console.log(r.join(' '));await b.close();})();
