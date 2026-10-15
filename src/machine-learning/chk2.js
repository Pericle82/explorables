const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(600);
await p.click('#fsScale button:nth-child(2)');console.log((await p.textContent('#fsRead')).replace(/\s+/g,' '));console.log((await p.textContent('#fsMsg')).slice(0,160));
const e=await p.$('#fsChart');await e.scrollIntoViewIfNeeded();await e.screenshot({path:__dirname+'/fs2.png'});
await p.$eval('#ofD',e=>{e.value=7;e.dispatchEvent(new Event('input'))});console.log((await p.textContent('#ofRead')).replace(/\s+/g,' '));
await p.$eval('#ofL',e=>{e.value=-1;e.dispatchEvent(new Event('input'))});console.log((await p.textContent('#ofRead')).replace(/\s+/g,' '));console.log((await p.textContent('#ofMsg')).slice(0,100));
const o=await p.$('#ofChart');await o.scrollIntoViewIfNeeded();await o.screenshot({path:__dirname+'/of.png'});
await b.close();})();
