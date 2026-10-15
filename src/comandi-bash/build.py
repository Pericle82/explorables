head=open('head.html',encoding='utf-8').read().rstrip()
head=head[:-len('</style>')]+open('extra.css',encoding='utf-8').read()+'</style>\n\n'
out=head+open('body.html',encoding='utf-8').read()+'\n'+open('script.html',encoding='utf-8').read()+open('shared.html',encoding='utf-8').read()
open('comandi-bash.html','w',encoding='utf-8').write(out)
open('test.html','w',encoding='utf-8').write('<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+out+'</body></html>')
import re
for i,sc in enumerate(re.findall(r'<script[^>]*>(.*?)</script>',out,re.S)): open(f'/tmp/b{i}.js','w').write(sc)
print(len(out))

# copia nel sito: docs/comandi-bash.html
import os as _os, shutil as _sh
if _os.path.isdir('../../docs') and not _os.environ.get('TAG'):
    _sh.copyfile('comandi-bash.html', '../../docs/comandi-bash.html'); print('copiato in docs/comandi-bash.html')
