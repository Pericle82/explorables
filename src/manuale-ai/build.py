#!/usr/bin/env python3
"""Costruisce glossario-ai.html da data.json + figs/*.html.
Uso: python3 build.py            -> glossario-ai.html e test.html
"""
import json, re, os, glob, html
from collections import Counter

D = json.load(open('data.json', encoding='utf-8'))
E = {e['n']: e for e in D['entries']}

PARTS = [
    (1, 8, 'Parte I', 'Le fondamenta: dall’idea di macchina intelligente al modello addestrato',
     'Intelligenza artificiale, machine learning, reti neurali e deep learning sono scatole una dentro l’altra; modello, parametro, peso e addestramento sono le parole per dire che cosa resta dentro la scatola alla fine.', 'p1'),
    (9, 16, 'Parte II', 'Dal testo ai numeri: token, vocabolario, embedding',
     'Prima di qualunque calcolo il testo va spezzato in pezzi e ogni pezzo va trasformato in una lista di numeri. Qui si vede come, e che cosa significa la distanza tra due di queste liste.', 'p2'),
    (17, 24, 'Parte III', 'Il modello linguistico al lavoro: un token alla volta',
     'Che cos’è un LLM visto da fuori: un sistema che prevede il prossimo token, lo aggiunge al testo e ricomincia, dentro una finestra di contesto di dimensione finita.', 'p3'),
    (25, 38, 'Parte IV', 'Dentro il transformer: strati, attention e posizione',
     'L’architettura del 2017 che sta sotto quasi tutti i modelli linguistici attuali, scomposta pezzo per pezzo: dagli strati all’attention, dalla posizione dei token alla rete che elabora ogni vettore.', 'p4'),
]
SHORT = {0: 'Intro', 1: 'IA', 2: 'ML', 3: 'Rete', 4: 'Deep', 5: 'Modello', 6: 'Parametro', 7: 'Peso', 8: 'Addestr.',
         9: 'Token', 10: 'Tokenizz.', 11: 'Vocab.', 12: 'BPE', 13: 'Embedding', 14: 'Latente', 15: 'Coseno', 16: 'Dimens.',
         17: 'LLM', 18: 'Autoregr.', 19: 'Prossimo', 20: 'Generativo', 21: 'Prompt', 22: 'Completion', 23: 'Context', 24: 'Inferenza',
         25: 'Transformer', 26: 'Layer', 27: 'Encoder', 28: 'Decoder', 29: 'Attention', 30: 'Self-att.', 31: 'Q K V', 32: 'Multi-head',
         33: 'Posizione', 34: 'RoPE', 35: 'Mask', 36: 'Att. map', 37: 'FFN', 38: 'Attivazione'}

def esc(s):
    return html.escape(s, quote=False)

def refs(s):
    # "#6 Parametro" -> link; titoli lunghi riconosciuti esattamente, altrimenti solo "#6"
    def rp(m):
        n = int(m.group(1))
        if n not in E:
            return m.group(0)
        t = E[n]['title']
        rest = m.group(2) or ''
        if rest.startswith(' ' + t):
            return f'<a class="ref" href="#g{n}">#{n} {t}</a>' + rest[len(t) + 1:]
        return f'<a class="ref" href="#g{n}">#{n}</a>' + rest
    return re.sub(r'#(\d{1,2})\b((?: [^,;.)\n]*)?)', rp, s)

def inline(s, years=False):
    s = esc(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<i>\1</i>', s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<a href="\2">\1</a>', s)
    s = refs(s)
    if years:
        s = re.sub(r'(?<![\d.,])(1[6-9]\d\d|20[0-2]\d)(?![\d.,]\d)', r'<span class="year">\1</span>', s)
    return s

def block(txt, years=False):
    out, para, items = [], [], []
    def flush():
        if para:
            out.append('<p>' + inline(' '.join(para), years) + '</p>'); para.clear()
        if items:
            out.append('<ul>' + ''.join('<li>' + inline(i, years) + '</li>' for i in items) + '</ul>'); items.clear()
    for line in txt.splitlines():
        l = line.strip()
        if not l:
            flush(); continue
        if l.startswith('- '):
            if para:
                out.append('<p>' + inline(' '.join(para), years) + '</p>'); para.clear()
            items.append(l[2:])
        else:
            if items:
                flush()
            para.append(l)
    flush()
    return ''.join(out)

def tsec(ts):
    p = [int(x) for x in ts.split(':')]
    return p[0] * 60 + p[1] if len(p) == 2 else p[0] * 3600 + p[1] * 60 + p[2]

def video_list(e):
    v = e['fields'].get('Struttura del video', '')
    lis = []
    for l in v.splitlines():
        m = re.match(r'-\s*`([\d:]+)`\s*[–-]\s*(.+)', l.strip())
        if m:
            sep = '&' if '?' in e['url'] else '?'
            lis.append(f'<li><a href="{e["url"]}{sep}t={tsec(m.group(1))}s">{m.group(1)}</a><span>{inline(m.group(2))}</span></li>')
    if not lis:
        return ''
    return f'<details class="vid"><summary>Struttura del video · {len(lis)} passaggi, clicca un minuto per aprirlo lì</summary><ol>{"".join(lis)}</ol></details>'

def links(e):
    c = e['fields'].get('Collegamenti', '')
    nums = [int(x) for x in re.findall(r'#(\d{1,2})\b', c.split('.')[0] if '.' in c else c)]
    seen = []
    for x in nums:
        if x in E and x not in seen and x != e['n']:
            seen.append(x)
    prev = [x for x in seen if x < e['n']]
    nxt = [x for x in seen if x > e['n']]
    note = ''
    m = re.match(r'^[^.]*\.\s*(.+)$', c, re.S)
    if m and m.group(1).strip():
        note = '<span class="muted" style="font-size:.84rem">' + inline(m.group(1).strip()) + '</span>'
    ch = lambda x, cls: f'<a class="chip {cls}" href="#g{x}"><b>#{x}</b>{E[x]["title"]}</a>'
    out = '<div class="links">'
    if prev:
        out += '<span class="lbl">Si appoggia su</span>' + ''.join(ch(x, 'prev') for x in prev)
    if nxt:
        out += '<span class="lbl">Porta a</span>' + ''.join(ch(x, '') for x in nxt)
    out += note + '</div>'
    return out

def figs_for(n):
    return [one(p) for p in sorted(glob.glob(f'figs/g{n:02d}.html') + glob.glob(f'figs/g{n:02d}[a-z].html'))]

def one(p):
    s = open(p, encoding='utf-8').read()
    after = 'Definizione'
    m = re.match(r'\s*<!--\s*after:\s*(.+?)\s*-->', s)
    if m:
        after = m.group(1)
    scripts = '\n'.join(re.findall(r'<script>(.*?)</script>', s, re.S))
    s = re.sub(r'<script>.*?</script>', '', s, flags=re.S)
    s = re.sub(r'^\s*<!--\s*after:.*?-->', '', s)
    return s.strip(), after, scripts

FIELD_CLASS = {'Da dove viene': 'hist', 'Dove tutti sbagliano': 'warn', 'Esempi e analogie': 'ex'}
FIELD_LABEL = {}
SKIP = {'In una frase', 'Struttura del video', 'Collegamenti'}

ALL_SCRIPTS = []

def entry(e, part_label=''):
    n = e['n']
    FS = figs_for(n)
    for i, (_, _, sc) in enumerate(FS):
        if sc:
            ALL_SCRIPTS.append((f'{n}.{i}', sc))
    done = set()
    h = [f'<section class="st entry" id="g{n}">',
         f'<div class="sec-head"><span class="eyebrow">#{n} · {esc(part_label)}</span><h2>{esc(e["title"])}</h2></div>',
         f'<p class="oneline">{inline(e["fields"]["In una frase"])}</p>']
    for k in e['order']:
        if k in SKIP:
            continue
        cls = FIELD_CLASS.get(k, '')
        h.append(f'<div class="fld {cls}"><h3>{esc(FIELD_LABEL.get(k, k))}</h3>{block(e["fields"][k], years=(k == "Da dove viene"))}</div>')
        for i, (f, after, _) in enumerate(FS):
            if f and k == after:
                h.append(f); done.add(i)
    for i, (f, _, _) in enumerate(FS):
        if f and i not in done:
            h.append(f)
    h.append(links(e))
    h.append('</section>')
    return '\n'.join(h)

def read(p):
    return open(p, encoding='utf-8').read() if os.path.exists(p) else ''

head = read('head.html').rstrip()
head = head[:-len('</style>')] + read('base.css') + read('extra.css') + '</style>\n\n'

body = ['<div class="wrap">', '<header class="hero">',
        '<span class="eyebrow">Manuale · concetti in ordine di prerequisito · cenni storici e figure interattive</span>',
        '<h1>Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro</h1>',
        '<p class="lede">Le parole che si sentono ogni volta che si parla di intelligenza artificiale, spiegate una alla volta e <b>in ordine di prerequisito</b>: ogni capitolo usa solo concetti già spiegati nei capitoli precedenti. Per ciascuna: la definizione in una frase, da dove viene (con la storia, dal 1637 al 2024), a che cosa serve, dove tutti sbagliano, gli esempi, e una figura per vederla funzionare.</p>',
        '<aside class="vx vx-prereq" aria-label="Per andare oltre"><span class="eyebrow">Per andare oltre</span><p>Ogni capitolo è un primo gradino. Per vedere gli stessi concetti al lavoro, con i calcoli completi: <a href="https://pericle82.github.io/explorables/training-llm/">Anatomia del Training LLM</a> e <a href="https://pericle82.github.io/explorables/machine-learning/">Machine learning</a>.</p></aside>',
        '<div class="cards">',
        '<a href="#g0"><small>Inizio</small><b>Come leggere il manuale</b><span>la mappa dei prerequisiti</span></a>']
for a, b, lab, title, intro, pid in PARTS:
    body.append(f'<a href="#{pid}"><small>{lab} · #{a}–#{b}</small><b>{esc(title.split(":")[0])}</b><span>{esc(", ".join(E[x]["title"] for x in range(a, b + 1)))}</span></a>')
body.append('<a href="#acr"><small>Appendice</small><b>Acronimi</b><span>dall’API alla RoPE, con il capitolo in cui compaiono</span></a>')
body.append('</div></header>')
body.append('<nav class="toc" aria-label="Capitoli"><div class="in">' + ''.join(f'<a href="#g{n}">#{n} {SHORT[n]}</a>' for n in range(0, 39)) + '<a href="#acr">Acronimi</a></div></nav>')

# introduzione (#0) + panoramiche
body.append(entry(E[0], 'Introduzione'))
for extra in ['figs/map.html', 'figs/timeline.html']:
    s = read(extra)
    if s:
        ALL_SCRIPTS.append((extra, '\n'.join(re.findall(r'<script>(.*?)</script>', s, re.S))))
        body.append(re.sub(r'<script>.*?</script>', '', s, flags=re.S))

for a, b, lab, title, intro, pid in PARTS:
    body.append(f'<div class="part" id="{pid}"><p class="part-label">{lab} · #{a}–#{b}</p><h2 class="part-title" id="toc-{pid}">{esc(title)}</h2><p class="part-intro">{esc(intro)}</p></div>')
    for n in range(a, b + 1):
        body.append(entry(E[n], title.split(':')[0]))

acr = ''.join(
    (lambda m: f'<div><dt>{esc(m.group(1))}</dt><dd>{inline(m.group(2))}</dd></div>')(re.match(r'\*\*(.+?)\*\*\s*—\s*(.+)', a))
    for a in D['acr'])
body.append(f'<section class="st" id="acr"><div class="sec-head"><span class="eyebrow">Appendice</span><h2>Gli acronimi</h2></div><dl class="gloss acr">{acr}</dl></section>')
body.append('<footer>Le figure e i laboratori con l’etichetta «calcolo reale» eseguono davvero il conto descritto; gli altri sono illustrazioni con valori scelti per essere leggibili, come indicato nelle didascalie.</footer>')
body.append('</div>')
B = '\n'.join(body)

js = read('lib.js') + '\n'
for n, sc in ALL_SCRIPTS:
    if sc.strip():
        js += f'\n/* ---- figura {n} ---- */\ntry{{(function(){{\n{sc}\n}})();}}catch(err){{console.error("figura {n}",err);}}\n'
js += '\n/* scroll spy */\n(function(){const links=[...document.querySelectorAll("nav.toc a")],secs=links.map(a=>document.querySelector(a.getAttribute("href")));function spy(){let c=0;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<140)c=i;});links.forEach((a,i)=>a.classList.toggle("on",i===c));}addEventListener("scroll",spy,{passive:true});spy();})();\n'
out = head + B + '\n<script>\n' + js + '</script>\n' + read('xref.html') + read('shared.html')
TAG = os.environ.get('TAG', '')
if not TAG:
    open('manuale-ai.html', 'w', encoding='utf-8').write(out)
open(f'test{"-"+TAG if TAG else ""}.html', 'w', encoding='utf-8').write('<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + out + '</body></html>')
SD = f'/tmp/gl{TAG}'
os.makedirs(SD, exist_ok=True)
for i, sc in enumerate(re.findall(r'<script[^>]*>(.*?)</script>', out, re.S)):
    open(f'{SD}/s{i}.js', 'w').write(sc)
import subprocess
bad = [f for f in sorted(glob.glob(SD + '/s*.js')) if subprocess.run(['node', '--check', f], capture_output=True).returncode]
print('errori di sintassi JS in:', bad or 'nessuno')
ids = re.findall(r'id="([^"]+)"', B)
print('dup ids:', [k for k, v in Counter(ids).items() if v > 1], '| size', len(out), '| figure:', len(glob.glob('figs/g*.html')))

# copia nel sito: docs/manuale-ai.html
import os as _os, shutil as _sh
if _os.path.isdir('../../docs') and not _os.environ.get('TAG'):
    _sh.copyfile('manuale-ai.html', '../../docs/manuale-ai.html'); print('copiato in docs/manuale-ai.html')
