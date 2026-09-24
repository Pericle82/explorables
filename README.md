# Explorables

Interactive explainers on LLMs, AI agents and databases: versioned single-file HTML guides (in Italian), published to GitHub Pages.

Guide interattive in italiano: ogni guida è un unico file HTML autonomo, con laboratori che si eseguono nel browser. Il repository tiene la storia delle versioni; il sito pubblica sempre l'ultima.

| Guida | Percorso | Versione |
|---|---|---|
| Anatomia del Training LLM | `/training-llm/` | 1.5 |
| Da Assistente ad Agente | `/assistente-agente/` | 1.0 |
| Quando il COMMIT non basta più | `/transazioni/` | 2.0 |

## Struttura

```
explorables/
├── exams/<slug>.json      domande a risposta aperta della guida, per la pagina /esame/
├── docs.json              manifest: titolo, descrizione, tag, versione e cronologia di ogni guida
├── docs/<slug>.html       sorgente di ogni guida (frammento HTML, identico a quello pubblicato come artifact)
├── templates/
│   ├── index.html         modello della pagina iniziale
│   ├── exam.html          pagina dell'esame a risposta aperta
│   └── guide.html         modello di partenza per ogni nuova guida (tema, struttura, navigazione)
├── shared/                componenti condivisi inseriti in ogni guida
│   ├── toc.html           pannello «Indice» con tutti i capitoli
│   └── xref.html          riferimenti incrociati con anteprima
├── AUTHORING.md           regole per scrivere una guida
├── scripts/
│   ├── build.mjs          genera dist/: una pagina per guida + la pagina iniziale
│   ├── new-guide.mjs      crea docs/<slug>.html dal template
│   ├── sync-shared.mjs    ricopia shared/ dentro le guide e il template
│   ├── release.mjs        registra una nuova versione in docs.json e CHANGELOG.md
│   └── serve.mjs          anteprima locale di dist/
├── CHANGELOG.md
└── .github/workflows/pages.yml   a ogni push su main: build e pubblicazione su GitHub Pages
```

Non ci sono dipendenze: basta Node 18 o successivo. `dist/` è generata e non va nel repository.

## Messa online (una volta sola)

1. Crea su GitHub un repository vuoto chiamato `explorables`.
2. Collega questa cartella e fai il push:
   ```bash
   git remote add origin git@github.com:<utente>/explorables.git
   git push -u origin main --tags
   ```
3. Nel repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Il workflow parte da solo a ogni push su `main`. Il sito sarà su `https://<utente>.github.io/explorables/`.

Nota: un sito GitHub Pages è pubblico. Con un repository privato serve un piano GitHub a pagamento, e il sito resta comunque pubblico.

## Aggiornare una guida

1. Sostituisci `docs/<slug>.html` con la nuova versione.
2. Registra la versione:
   ```bash
   node scripts/release.mjs transazioni 2.1 "Nuovo laboratorio sui deadlock"
   ```
3. Controlla in locale, poi pubblica:
   ```bash
   npm run preview                     # http://localhost:4173
   git add -A
   git commit -m "transazioni: v2.1 — Nuovo laboratorio sui deadlock"
   git tag transazioni-v2.1
   git push && git push origin transazioni-v2.1
   ```

## Aggiungere una guida

Segui [AUTHORING.md](AUTHORING.md). In breve: `node scripts/new-guide.mjs <slug> "Titolo"` crea il file dal template; quando è pronto:

```bash
node scripts/release.mjs kafka-internals 1.0 "Prima versione" \
  --title "Dentro Kafka" --description "Log, partizioni, consumer group…" --tags "kafka,streaming"
```

La pagina iniziale si aggiorna da sola alla build successiva.

## Esame a risposta aperta

La pagina `/esame/` propone domande aperte (da `exams/*.json`) con tempo e caratteri limitati. Le risposte le valuta Claude tramite l'API di Anthropic, chiamata direttamente dal browser con la chiave che l'utente inserisce nella pagina (salvata solo nel suo browser); il materiale di riferimento è estratto dalle guide a ogni build (`dist/esame/context/`). Senza chiave è disponibile l'autovalutazione sui criteri. Dettagli in AUTHORING.md, §10.

## Convenzioni di versione

- **Minore** (1.4 → 1.5): nuove sezioni o laboratori, correzioni.
- **Maggiore** (1.x → 2.0): revisione profonda o riscrittura.
- Ogni rilascio ha un tag `<slug>-v<versione>`: `git checkout transazioni-v2.0 -- docs/transazioni.html` recupera una versione precedente.

## Formato dei file in `docs/`

Sono frammenti HTML senza `<!doctype>`, `<html>`, `<head>` e `<body>`: iniziano con `<title>`, `<link>` e `<style>`, seguiti dal contenuto. È lo stesso formato degli artifact di Claude, quindi una guida aggiornata lì si copia qui senza modifiche. `build.mjs` aggiunge lo scheletro della pagina e il menu di navigazione tra le guide: il pulsante «☰ Explorables» in basso a sinistra apre l'elenco delle guide (con quella corrente evidenziata), il link alla pagina iniziale e i collegamenti a guida precedente e successiva.
