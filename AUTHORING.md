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
2. **Dentro la guida** — la barra fissa delle sezioni (scritta a mano) e il pannello **Indice** con tutti gli h2 e h3 (blocco condiviso `toc`: si costruisce da solo).
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
- Diagrammi dove servono: schemi a box (`.diag`, `.box`), grafici SVG disegnati in JS con i token, tabelle di confronto.
- Ogni affermazione tecnica verificabile va controllata (documentazione ufficiale, paper originali) prima del rilascio; quando un laboratorio semplifica, lo si dice.

## 8. Blocchi condivisi

`shared/toc.html` e `shared/xref.html` sono inseriti in ogni guida tra i marcatori:

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
