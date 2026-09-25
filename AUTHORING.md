# Regole per scrivere una guida Explorables

Ogni nuova guida parte da `templates/guide.html` e rispetta queste regole. Il template contiene già tema, struttura e navigazione; qui c'è il perché e ciò che il template non può imporre da solo.

## 1. Come si crea

```bash
node scripts/new-guide.mjs <slug> "Titolo"      # copia il template in docs/<slug>.html
# … scrivi la guida …
node scripts/sync-shared.mjs                     # allinea i blocchi condivisi
node scripts/release.mjs <slug> 1.0 "Prima versione" --title "…" --description "…" --tags "a,b"
npm run preview                                  # http://localhost:4173
```

Il file resta un **frammento HTML autonomo**: niente `<!doctype>`, `<html>`, `<head>`, `<body>`; inizia con `<title>`, `<link>` dei font e `<style>`. Tutto CSS e JS inline, nessuna dipendenza esterna oltre a Google Fonts. Così la stessa guida funziona sia sul sito sia come artifact di Claude.

## 2. Struttura della pagina

Nell'ordine, sempre:

| Blocco | Markup | Regola |
|---|---|---|
| Intestazione | `<header class="hero">` con `.eyebrow`, `h1`, `.lede`, `.cards` | Il titolo è una tesi («Dal testo grezzo al modello che ragiona»), non un'etichetta. Le `.cards` sono la mappa delle sezioni. |
| Barra delle sezioni | `<nav class="toc"><div class="in">…</div></nav>` | **Figlia diretta di `.wrap`, fuori dall'`header`**, altrimenti non resta fissa. Un link breve per sezione (`1 · Nome`). |
| Sezioni | `<section class="st" id="…">` con `.sec-head` (`.eyebrow` + `h2`) | `id` brevi e stabili: servono ai link dall'esterno. Eyebrow = numero e nome esteso; h2 = la tesi della sezione. |
| Sottosezioni | `<h3 id="…" class="anchor">` | Entrano da sole nell'indice. Gli `h3` dentro `.lab` no. |
| Laboratori | `<div class="lab">` con `.lab-head` (h3 + `.tag`) | Vedi §5. |
| Definizioni | `<dl class="gloss">` con `div > dt + dd + .ex` | Diventano automaticamente bersagli dei riferimenti incrociati. |
| Riepilogo | `<section class="st" id="sum">` con `table.sum` | Sempre l'ultima sezione. |
| Piè di pagina | `<footer>` | Fonti e avvertenze sui laboratori semplificati. |

## 3. Navigazione: tre livelli, tutti obbligatori

1. **Tra le guide** — il pulsante «☰ Explorables» in basso a sinistra. Lo aggiunge `scripts/build.mjs` a ogni pagina: non va scritto nella guida.
2. **Dentro la guida** — la barra fissa delle sezioni (scritta a mano: solo link `<a>` dentro `.in`, niente pulsanti) e il pannello **Indice** (blocco condiviso `toc`: si costruisce da solo). Il componente mette i link della barra in una striscia scorrevole e il pulsante «☰ Indice n/N» accanto, senza sovrapporsi; il pannello si apre sotto la barra, raggruppa per parte (`.part`, se presenti) e sezione, mostra le sottosezioni (h3) solo della sezione aperta e ha una ricerca.
3. **Tra i concetti** — i riferimenti incrociati con anteprima (blocco condiviso `xref`, configurato da `window.XREF_CONFIG`, §4).

## 4. Riferimenti incrociati

Nel testo, ogni rimando va scritto in modo esplicito («vedi la sezione 3», «il caso 2», «il documento sul training») e poi registrato in `XREF_CONFIG`:

```js
window.XREF_CONFIG = {
  skip: ".lab,.cards,",               // aree da non toccare (i laboratori si ridisegnano)
  ids: [{ sel: "h3", text: "Testo dell'h3", id: "id-da-dare" }],   // id per elementi che non ne hanno
  rules: [
    { re: "sezione 3", to: "#s3", flags: "i", first: false },     // ogni occorrenza
    { re: "MVCC", to: "#mvcc" },                                   // sigla: maiuscole esatte, prima occorrenza per sezione
    { re: "write skew", to: "#skew", flags: "i" },
    { re: "guida sul training", to: "https://pericle82.github.io/explorables/training-llm/#sft",
      k: "Altra guida", t: "Anatomia del Training LLM", body: "<p>Riassunto in una frase.</p>", flags: "i", first: false }
  ],
  gloss: { selector: "dl.gloss", skip: ["Termine troppo generico"], extra: { "Termine": ["alias"] } }
};
```

- Le sigle e i termini tecnici si collegano solo alla **prima occorrenza per sezione**; i rimandi espliciti («sezione 3») sempre.
- Non collegare parole generiche («modello», «dati»): meglio pochi link utili che un testo tutto sottolineato.
- I rimandi ad altre guide usano l'URL assoluto del sito, con anteprima scritta a mano.

## 5. Laboratori

- Ogni sezione importante ha almeno un laboratorio; ogni laboratorio ha **un'istruzione in una frase** (che cosa muovere, che cosa osservare) e un **callout** che commenta il risultato.
- L'etichetta `.tag` dice onestamente che cos'è: **matematica reale**, **comportamento reale**, **simulazione**, **valori illustrativi**. I limiti del modello vanno scritti in una `.note`.
- Stato iniziale già significativo: il laboratorio mostra qualcosa prima di qualsiasi clic.
- Solo JS vanilla, id con prefisso della sezione (`s3Slider`), nessuna libreria.

## 6. Tema

- **Font**: Source Serif 4 (titoli), IBM Plex Sans (testo), JetBrains Mono (etichette, codice, dati).
- **Colori**: solo tramite i token del template (`--bg`, `--surface`, `--surface-2`, `--ink`, `--muted`, `--line`, `--grid`, `--accent`, `--accent-soft`, `--good`, `--bad`, `--warn` e le versioni `-soft`). Mai colori letterali nei componenti.
- **Tema chiaro e scuro**: il template definisce entrambi; ogni nuovo token va aggiunto in tutti e tre i blocchi (`:root`, media query scura, `[data-theme="dark"]`).
- **Accento**: l'unica cosa che cambia tra una guida e l'altra. Scegline uno:

| Accento | Chiaro (`--accent` / `--accent-soft`) | Scuro (`--accent` / `--accent-soft`) | Usato da |
|---|---|---|---|
| Verde petrolio | `#1E6B58` / `#D3E7DF` | `#5DC2A3` / `#1C3A30` | training-llm |
| Blu acciaio | `#2C5C8F` / `#DBE6F2` | `#7FB2E5` / `#1B2C40` | assistente-agente, transazioni |
| Ambra | `#8A5A0B` / `#F2E4C8` | `#E2AA4E` / `#3A2D14` | — |
| Bordeaux | `#8A3048` / `#F3DCE2` | `#E08AA0` / `#3D1C26` | — |
| Ardesia | `#4A5A7A` / `#E0E5EE` | `#A6B4D4` / `#232B3A` | — |

- Deve funzionare a 400 px di larghezza: griglie che vanno a una colonna, tabelle e diagrammi larghi dentro `.scroll-x`.

## 7. Scrittura

- In italiano. **Ogni acronimo ha il significato esteso tra parentesi** alla prima occorrenza nella sezione.
- Prima l'intuizione, con un'analogia o un esempio reale; poi il meccanismo; poi i dettagli e le eccezioni.
- Diagrammi dove servono: i componenti `.vx-*` (§11), grafici SVG disegnati in JS con i token, tabelle di confronto. **Mai schemi disegnati con caratteri dentro `<pre>`** (┌─┐, frecce, colonne allineate a spazi): su telefono non si leggono e gli screen reader li leggono carattere per carattere.
- Ogni affermazione tecnica verificabile va controllata (documentazione ufficiale, paper originali) prima del rilascio; quando un laboratorio semplifica, lo si dice.

## 8. Blocchi condivisi

`shared/vx.html`, `shared/toc.html` e `shared/xref.html` sono inseriti in ogni guida tra i marcatori:

```html
<!-- xpl:shared toc:start … -->  …  <!-- xpl:shared toc:end -->
```

Non si modificano dentro le guide: si modifica il file in `shared/` e si esegue `node scripts/sync-shared.mjs`, che aggiorna tutte le guide e il template. `npm run build` avvisa se una guida non è allineata.

## 9. Versioni

- Minore (1.4 → 1.5): contenuti o laboratori aggiunti, correzioni. Maggiore (1.x → 2.0): revisione profonda.
- Ogni rilascio passa da `scripts/release.mjs` (aggiorna `docs.json` e `CHANGELOG.md`) e ha un tag `<slug>-v<versione>`.

## 10. Esame a risposta aperta

La pagina `/esame/` raccoglie domande aperte sulle guide, valutate da un esaminatore AI (intelligenza artificiale) con la chiave API dell'utente, salvata solo nel suo browser.

- Le domande di una guida stanno in `exams/<slug>.json` (vedi `exams/transazioni.json`): `id`, `title`, `difficulty` (media, alta, molto alta), `time` in secondi, `maxChars`, `chapters`, `prompt`, `criteria` (ognuno con `id`, `weight`, `text`).
- Il materiale che l'esaminatore riceve è estratto dalla guida a ogni build: servono sezioni con id stabili `<section class="st" id="cap-N">` (o `<section id="cap-N">`), e `chapters` elenca i numeri N rilevanti per la domanda. Tieni il materiale per domanda sotto i 60.000 caratteri circa.
- Domande sfidanti: un caso concreto da ragionare, non una definizione da ripetere. I criteri descrivono i concetti attesi, verificabili nel materiale; pesi da 1 a 3.
- Il voto è calcolato dalla pagina: criteri pesati (pieno 1, parziale ½), meno 1 per ogni errore grave e ¼ per ogni imprecisione.

## 11. Componenti visivi (`.vx-*`)

Il blocco condiviso `vx` (`shared/vx.html`) porta in ogni guida i componenti per codice, schemi e diagrammi. Usano solo i token del tema, quindi funzionano in chiaro e scuro, e sotto i 640 px vanno in colonna. Esempi completi di tutti i tipi: `docs/transazioni.html`.

| Serve per | Componente | Markup essenziale |
|---|---|---|
| Codice vero (SQL, Kotlin…) | Scheda codice | `.vx.vx-code` > `.vx-code-h` (titolo + `button.vx-copy`) + `pre > code > span.ln` per riga (`.ln.hl` per la riga da evidenziare). Colori: `.tk-kw` `.tk-str` `.tk-num` `.tk-cm`, `.tk-an` per i commenti con «←», `.tk-ty` per le annotazioni. Ogni `.ln` finisce con un a capo |
| Due transazioni nel tempo | Linea temporale | `.vx-race` > `.vx-head` (facoltativo) + `.vx-race-g` (celle `.hd`, `.t`, `.c`; `.c.span` su due colonne) + `.vx-verdict.bad/.good` |
| Passo singolo | Blocco | `.vx-step` con `.ok` `.err` `.wait` `.info`, dettaglio in `<small>` |
| Dove sta un dato (RAM, log, disco) | Contenitori | `.vx-state` (`.two`, `.one`) > `.vx-box` (`.ram` tratteggiato, `.acc`) > `h5` + `.vx-rec` (`.new`, `.old`) + `.vx-badge` (`.dirty` `.clean` `.stale` `.ok`) |
| Tabelle, anche con grandezze | Tabella | `.vx-table` dentro `.scroll-x`; `td.m` per numeri; `.vx-bars` con `.vx-bar` (`.b` in rosso) |
| Casi o scenari da confrontare | Schede | `.vx-cards` > `.vx-card` > `h5 > small` + `.vx-line` + `.vx-out.go/.wait/.bad/.acc` |
| Livelli (cache, strati) | Pila | `.vx-stack`: coppie `.vx-layer` (`.first` `.cont` `.last` `.solo`; `.vol` `.dur` `.app`) + `.vx-note` (`.hot`) |
| Versioni o stati in sequenza | Catena | `.vx-chain` > `.vx-ver` (`.cur`) + `.vx-arrow` + `.vx-chips` |
| Passi numerati | Lista | `ol.vx-steps` (`li.hot/.good/.bad`; `.vx-li` per testo + valore a destra) |
| A contro B, prima e dopo | Coppia | `.vx-pair` con `.vx-arrow` al centro (su telefono la freccia ruota); `.vx-col` per una colonna di elementi |
| Flusso con decisione | Flusso | `.vx-flow` > `.vx-node` (`.code`, `.acc`) + `.vx-down` + `.vx-branch` |
| Sequenze nel tempo su righe | Tempo | `.vx-tl` > `.vx-axis` + `.vx-tl-r` (etichetta + `.vx-seq` di `.vx-step`) |
| Messaggi tra nodi, grafi | SVG | `.vx.vx-svg` (`.s` se piccolo) con classi `.bx` `.bxa` `.ac` `.acf` `.gd` `.gdf` `.mut` `.ln`, e una `p.vx-sr` con la descrizione in parole |
| Altro | Varie | `.vx-cells`/`.vx-cell` (settori, pagine), `.vx-split` (barra divisa), `.vx-map` (A → B), `.vx-formula`, `.vx-cap` (etichetta sopra), `.vx-foot` (conclusione sotto) |

Regole:

- Il testo resta testo: niente immagini di schemi. L'esame estrae il testo della guida e scarta gli `<svg>`, quindi ogni SVG ha la sua `p.vx-sr` in parole.
- Tra pezzi affiancati lascia uno spazio nel markup (`</b> <span>`, `testo <small>`): non si vede, ma tiene separate le parole nel testo estratto.
- I riferimenti incrociati non entrano nei componenti (`.vx` è escluso). Una scheda che deve essere un bersaglio («il caso 2») prende un attributo e la guida la registra: in transazioni `data-xcase="2"` e `data-xscen="B"` diventano `#casi-2` e `#scenari-b`, e l'anteprima mostra la scheda.
