import re,sys,glob
head=open('head.html',encoding='utf-8').read().rstrip()
head=head[:-len('</style>')]+open('extra.css',encoding='utf-8').read()+'</style>\n\n'
parts=[open(p,encoding='utf-8').read() for p in ['p1.html','p2.html','p3.html'] if __import__('os').path.exists(p)]
body=''.join(parts)
if 'p3.html' not in [p for p in ['p3.html'] if __import__('os').path.exists(p)]:
    body+='\n</div>\n'  # chiusura provvisoria del wrap
js=''.join(open(p,encoding='utf-8').read() for p in ['js1.js','js2.js','js3.js'] if __import__('os').path.exists(p))
script='<script>\n(function(){\n'+js+'\n/* scroll spy */\nconst links=[...document.querySelectorAll("nav.toc a")],secs=links.map(a=>document.querySelector(a.getAttribute("href")));function spy(){let c=0;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<140)c=i;});links.forEach((a,i)=>a.classList.toggle("on",i===c));}addEventListener("scroll",spy,{passive:true});spy();\nfunction all(){'+''.join(f'if(typeof {f}==="function"&&document.querySelector("#{sel}")){f}();' for f,sel in [('drawLR','lrChart'),('drawGD','gdChart'),('drawFS','fsChart'),('drawLG','lgChart'),('drawOF','ofChart'),('drawNN','nnChart'),('drawAct','actChart'),('drawSM','smBars'),('drawLC','lcChart'),('drawPR','prRead'),('drawDT','dtRead'),('drawKM','kmChart'),('drawAD','adChart'),('drawCF','cfTable'),('drawRL','rlGrid')])+'}\nall();matchMedia("(prefers-color-scheme: dark)").addEventListener("change",all);new MutationObserver(all).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});\n})();\n</script>\n'
xref=open('xref.html',encoding='utf-8').read() if __import__('os').path.exists('xref.html') else ''
out=head+body+'\n'+script+xref+open('shared.html',encoding='utf-8').read()
open('machine-learning.html','w',encoding='utf-8').write(out)
open('test.html','w',encoding='utf-8').write('<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+out+'</body></html>')
for i,sc in enumerate(re.findall(r'<script[^>]*>(.*?)</script>',out,re.S)): open(f'/tmp/m{i}.js','w').write(sc)
from collections import Counter
ids=re.findall(r'id="([^"]+)"',body);print('dup',[k for k,v in Counter(ids).items() if v>1],len(out))

# copia nel sito: docs/machine-learning.html
import os as _os, shutil as _sh
if _os.path.isdir('../../docs') and not _os.environ.get('TAG'):
    _sh.copyfile('machine-learning.html', '../../docs/machine-learning.html'); print('copiato in docs/machine-learning.html')
