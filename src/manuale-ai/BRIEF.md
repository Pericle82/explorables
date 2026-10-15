# Brief per chi scrive le figure del Manuale AI

Stai lavorando a una pagina HTML educativa in italiano, «Manuale AI», costruita da `src/manuale-ai/build.py` a partire da `data.json` (un capitolo per capitolo, numerati da #0; il testo si modifica solo se la richiesta riguarda il testo). Il tuo compito è solo scrivere **figure** (grafici, diagrammi, piccoli laboratori interattivi) che aiutino a capire ciascun capitolo. Leggi il capitolo in `data.json` (campi: "In una frase", "Definizione", "Da dove viene", "A cosa serve", "Dove tutti sbagliano", "Esempi e analogie") prima di disegnarne la figura, e **usa gli esempi e le analogie del capitolo stessa** (es. il palazzo di impiegati, le manopole, il prezzo delle case, Cerere di Gauss…): la figura deve far vedere quello che il testo racconta, non introdurre un argomento nuovo.

## Il contratto

- Un file per capitolo: `figs/gNN.html` (più figure: `gNNa.html`, `gNNb.html`…, in ordine alfabetico) (NN a due cifre: `g07.html`). Scrivi SOLO i file che ti sono assegnati. Non modificare build.py, extra.css, lib.js, data.json né i file di altri.
- Contenuto del file: un frammento HTML che inizia con `<figure class="fig">` e finisce con `</figure>`, seguito facoltativamente da UN blocco `<script>…</script>`.
- Prima riga facoltativa `<!-- after: Da dove viene -->` per mettere la figura dopo un altro campo (default: dopo «Definizione»). Valori validi: Definizione, Da dove viene, A cosa serve, Dove tutti sbagliano, Esempi e analogie. Usa «Da dove viene» per figure storiche.
- Dentro la figure: `<p class="fig-title">Titolo breve</p>`, poi il contenuto, poi `<figcaption>` con 1–3 frasi che dicono come leggere la figura e, se è interattiva, che cosa provare. Se i numeri sono inventati per chiarezza, dillo nella caption.
- Tutti gli id iniziano con il prefisso del capitolo: `g07-…`. Lo script trova gli elementi con questi id; se non li trova esce (`if(!G.$("#g07-svg"))return;`).
- Lo script viene avvolto automaticamente in `try{(function(){ … })();}catch…`: scrivi direttamente le istruzioni, niente variabili globali, niente `export`.

## Helper disponibili (oggetto globale `G`, già caricato)

`G.$(sel)`, `G.css("--accent")` (legge un token di colore), `G.el(tag, attrs, parent, testo)` crea un elemento SVG, `G.clear(nodo)`, `G.fmt(num, decimali)` formatta all'italiana (virgola, segno meno tipografico), `G.seg("#id", cb)` collega un gruppo di bottoni `.seg` (ritorna una funzione che legge il valore scelto), `G.rng(seme)` generatore casuale riproducibile, `G.onTheme(fn)` richiama fn quando cambia il tema chiaro/scuro (usalo se nell'SVG metti colori letti con G.css; in alternativa usa `fill="var(--accent)"` direttamente negli attributi/stili, che si aggiorna da solo — è preferibile).

## Stile (obbligatorio)

- Colori SOLO tramite variabili CSS: `var(--ink)`, `var(--muted)`, `var(--line)`, `var(--grid)`, `var(--surface)`, `var(--surface-2)`, `var(--bg)`, `var(--accent)`, `var(--accent-soft)`, `var(--good)`, `var(--good-soft)`, `var(--bad)`, `var(--bad-soft)`, `var(--warn)`, `var(--warn-soft)`. Mai esadecimali. Funziona così sia il tema chiaro sia quello scuro.
- Classi già pronte: `.grid2` (due colonne, una sotto 760px), `.stack`, `.row`, `.controls` + `.ctl` (con `<label>` e `<input type="range">`, `<output>` nella label), `.seg` (gruppo di `<button aria-pressed>` con `data-v`), `.btn` e `.btn.ghost`, `.readout` (righe di `<div><small>etichetta</small><strong>valore</strong></div>`), `.callout` (messaggio evidenziato), `.note`, `.bars` + `.barrow` (`<div class="barrow"><span>etichetta</span><div class="track"><div class="fill" style="width:40%"></div></div><span class="v">40%</span></div>`), `.gtable` (tabelle), `.scroll-x` (contenitore che scorre in orizzontale), `.tokens` + `.tok` (pillole monospace per token), `.diag` + `.box` + `.arr` (diagramma a scatole con frecce, va a capo da solo), `.pill`, `.mono`, `.muted`, `.tag` (etichetta nell'angolo: usala come `<span class="tag">calcolo reale</span>` oppure `illustrazione`).
- SVG: `viewBox` sempre, `width` non fisso (la classe `.fig svg` lo rende al 100%), `role="img"` e `aria-label`. Testo nell'SVG: eredita font e `fill:var(--ink)`; usa `font-size` 11–13. Tieni le larghezze del viewBox tra 320 e 720 e pensa a come appare a 400 px di schermo: testo leggibile (non sotto ~9px effettivi), niente sovrapposizioni. Se un diagramma è intrinsecamente largo, mettilo in `<div class="scroll-x">` con `min-width` sull'SVG.
- Niente librerie esterne, niente immagini esterne, niente `localStorage`, niente `alert/confirm`, niente animazioni infinite (un'animazione che parte da un bottone va bene).
- Italiano. Ogni acronimo, alla prima occorrenza nella figura, con il significato esteso tra parentesi.
- Sobrio: una figura per capitolo, chiara, che spieghi un'idea. Interattiva quando l'interazione insegna qualcosa (cursore che cambia un peso e mostra l'effetto, bottone che fa un passo di un algoritmo), statica quando basta guardare. Se fai un calcolo, che sia vero (etichetta «calcolo reale»).
- Coerenza con il testo: numeri e date come nel capitolo (es. AlexNet 15,3% contro 26,2%; GPT-3 175 miliardi di parametri, 350 GB).

## Come provare

```
cd src/manuale-ai
TAG=<tuo-nome> python3 build.py          # costruisce test-<tuo-nome>.html e controlla la sintassi JS
TAG=<tuo-nome> node check.js g07 g08     # errori JS, larghezza a 400px, screenshot in shots/g07-1100.png e shots/g07-400.png
```
Guarda gli screenshot con lo strumento Read (sono immagini) e correggi finché: nessun errore JS, `scrollWidth400` = 400, nessuna figura nella lista `figureTroppoLarghe`, testo leggibile e non sovrapposto a entrambe le larghezze. Usa sempre il TAG (altri lavorano in parallelo). Alla fine cancella i tuoi `test-<tuo-nome>.html`.

## Consegna

Rispondi con un elenco breve: per ogni file scritto, una riga con che cosa mostra e se è interattivo; più eventuali problemi non risolti. Niente altro.
