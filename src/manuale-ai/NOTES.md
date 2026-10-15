# manuale-ai — Manuale AI: i concetti dell'intelligenza artificiale, uno sopra l'altro

Sorgenti in questa cartella. `python3 build.py` genera `manuale-ai.html` e lo copia in `docs/`. Con `TAG=<nome> python3 build.py` genera solo `test-<nome>.html` per le prove (utile con più agenti in parallelo). Test: `node check.js g7 …` (errori JS, 400 px, screenshot in `shots/`), `node smoke.js` (clic su tutti i controlli).

## Struttura
- `data.json`: il testo, un capitolo per voce (`entries`), con i campi «In una frase», «Definizione», «Da dove viene», «A cosa serve», «Dove tutti sbagliano», «Esempi e analogie», «Collegamenti»; più l'elenco degli acronimi (`acr`). I riferimenti «#N Titolo» diventano link.
- `figs/gNN.html` (e `gNNa`, `gNNb`…): figure e blocchi aggiuntivi di un capitolo; la prima riga `<!-- after: Campo -->` sceglie dopo quale campo compaiono. Regole in `BRIEF.md`. `figs/map.html`: la mappa dei prerequisiti.
- `build.py`: assembla tutto; le parti (I–IV) e i loro intervalli sono in `PARTS`.

## Decisioni di Joe (non tornare indietro)
- È un **manuale** fatto di **capitoli**, non un glossario fatto di voci.
- **Nessun riferimento** alla serie di video da cui nascono gli appunti né al suo autore (né nel testo, né in figure, né in note di versione, né in questo repo).
- **Nessun conteggio totale** dei capitoli: ne arriveranno altri. Gli intervalli per parte sono calcolati dai dati.
- Mantenere i cenni storici dentro i capitoli e l'ordine dei concetti per prerequisito. La linea del tempo complessiva («La storia in una riga») è stata **eliminata** su richiesta.
- Accento: Terracotta.

## Storico delle richieste
- v1.1–1.2: tolti i video; «manuale» al posto di «glossario»; niente conteggi; riscritta la frase «riconoscere un gatto non si lascia ridurre a regole» (non piaceva).
- v1.3: cap. 1, famiglie dell'IA e differenza dal software classico (da dove viene la logica della decisione); figura «Lo stesso compito, quattro approcci»; cap. 4, matrioske con le altre famiglie.
- v1.4: cap. 2, laboratorio delle case spiegato come lo legge Joe: grafico di sinistra = dati, retta = funzione prezzo stimato, w e b a mano mostrano lo scostamento, «20 passi» aggiunge 20 passi di correzione; l'errore tende al minimo della retta migliore (≈ 18,9), non a zero.
- v1.5–1.6: cap. 9, caso strawberry: che cosa arriva al modello (il tokenizzatore spezza prima del modello), come risponde (non conta, produce la risposta più probabile), perché scrivere la parola lettera per lettera aiuta (il testo scritto rientra e ripassa dal tokenizzatore). Evitare contraddizioni del tipo «sanno contare / non contano».
- v1.7: cap. 1, Deep Blue spiegato (albero delle mosse + formula di valutazione scritta da persone = procedura classica) e confrontato con il gatto (nessuno sa scrivere la formula dai pixel); schema dei tre metodi; storia in ordine cronologico.
- v1.8: cap. 7, differenza tra peso e parametro (parametro = ogni numero regolato; peso = moltiplica un ingresso; bias = sposta la soglia), con tabella.
