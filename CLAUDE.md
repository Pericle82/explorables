# Explorables — istruzioni per Claude

Questo repository contiene le guide interattive di Joe (HTML educativi in italiano), pubblicate su https://pericle82.github.io/explorables/. Leggi questo file prima di ogni lavoro, poi `AUTHORING.md` (regole tecniche) e il `NOTES.md` della guida su cui lavori.

## Come arrivano le richieste

Joe scrive in chat il nome della guida e la modifica, per esempio «manuale-ai: nel capitolo 7…», oppure lascia commenti sull'anteprima della pagina. Se non nomina la guida e non è ovvio, chiedi quale.

## Dove sta cosa

| Percorso | Che cosa contiene |
|---|---|
| `docs/<slug>.html` | la guida pubblicata (frammento HTML senza doctype; vedi AUTHORING) |
| `src/<slug>/NOTES.md` | decisioni prese su quella guida, richieste di Joe, cose da non rifare: **leggilo sempre prima di modificare la guida e aggiornalo dopo** |
| `src/<slug>/…` | i sorgenti, per le guide che ne hanno (manuale-ai, machine-learning, comandi-bash): si modificano questi e si rigenera `docs/<slug>.html` con `python3 build.py`; mai modificare a mano il file in `docs/` di queste guide |
| `docs.json`, `CHANGELOG.md` | elenco delle guide e storico delle versioni: si aggiornano solo con `scripts/release.mjs` |
| `shared/` | blocchi condivisi (componenti `.vx-*`, indice, riferimenti incrociati): si propagano con `scripts/sync-shared.mjs` |
| `AUTHORING.md` | regole tecniche: struttura, navigazione, tema, palette degli accenti, laboratori |

## Anteprima in chat

Joe rivede le guide sull'anteprima in chat e ci lascia commenti puntati sugli elementi. Quindi:

- Quando chiede di vedere una guida («mostrami manuale-ai»), mandala in chat come file con l'anteprima: `dist/<slug>/index.html` (pagina completa generata da `node scripts/build.mjs`; se è vecchia, rigenerala prima). Per una guida non ancora registrata nel sito (oggi comandi-bash) usa il `test.html` generato da `python3 build.py` nella sua cartella `src/`.
- Dopo ogni modifica, rimanda l'anteprima aggiornata della guida, così Joe può commentare la nuova versione.
- I commenti di Joe arrivano con il selettore dell'elemento: il testo dell'anteprima è solo un riferimento, la modifica va fatta nei sorgenti.

## Regole di scrittura (valgono per tutte le guide)

- Italiano. Ogni acronimo ha il significato esteso tra parentesi alla prima occorrenza nella sezione.
- Prima l'intuizione, poi il dettaglio tecnico: esempi concreti e reali, schemi e figure che fanno vedere il meccanismo. Ogni concetto si spiega con ciò che è già stato spiegato prima.
- Spiegare vuol dire dire **che cosa si guarda e come si legge**: per ogni grafico o laboratorio, che cosa rappresenta ogni elemento, che cosa succede quando si interagisce, e che cosa si deve notare (a che cosa tende, perché). Niente frasi che si contraddicono a distanza di due righe; niente passaggi saltati (se compare un concetto nuovo, come il passaggio dai token alle lettere, va spiegato almeno ad alto livello).
- Non eliminare concetti o esempi esistenti: si riordinano, si riscrivono, si uniscono. Si toglie solo ciò che è sbagliato o ciò che Joe chiede di togliere.
- Per il vettore di un token si dice «vettore», mai «scheda».
- Numeri grandi in italiano: «migliaia di miliardi», non «trilioni».
- Le figure con l'etichetta «calcolo reale» eseguono davvero il conto; quelle con valori inventati lo dichiarano in didascalia.

## Flusso di lavoro

1. Leggi `src/<slug>/NOTES.md`.
2. Modifica (i sorgenti in `src/<slug>/` se esistono, altrimenti `docs/<slug>.html` direttamente).
3. Prova: per le guide con sorgenti, `python3 build.py` e gli script di test della cartella (Playwright: nessun errore JS, nessuno scroll orizzontale a 400 px); per le altre, almeno un controllo della sintassi degli script e della larghezza a 400 px.
4. `node scripts/sync-shared.mjs`
5. `node scripts/release.mjs <slug> <versione> "<nota>"` (versione minore per aggiunte e correzioni)
6. `node scripts/build.mjs`
7. `git add -A && git commit` e `git tag <slug>-v<versione>`.
8. **Il push lo fa Joe** dal Mac: `git push && git push origin --tags`. Ricordaglielo alla fine.
9. Aggiungi a `src/<slug>/NOTES.md` una riga con la richiesta e la decisione presa.

Una guida nuova si crea con `node scripts/new-guide.mjs` (vedi AUTHORING), sceglie un accento libero della palette e ha subito la sua cartella `src/<slug>/` con un `NOTES.md`.

## Lavoro delegato

Per implementare figure e laboratori in quantità, Joe preferisce agenti meno costosi (per esempio Sonnet) guidati da un brief preciso, con la revisione finale fatta dal modello principale. Esempio di brief: `src/manuale-ai/BRIEF.md`.
