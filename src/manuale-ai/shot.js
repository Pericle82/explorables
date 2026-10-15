const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(500);
const [sel,file,w]=process.argv.slice(2);await p.setViewportSize({width:+(w||1100),height:900});const e=await p.$(sel);await e.scrollIntoViewIfNeeded();await e.screenshot({path:file});await b.close();})();
