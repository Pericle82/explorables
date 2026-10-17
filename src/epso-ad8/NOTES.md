# epso-ad8 — Preparazione EPSO AD 8

Si modifica direttamente `docs/epso-ad8.html`. Accento: Ardesia.

## Decisioni
- 17/10/2026 (v1.0): richiesta di Joe «prepara due nuovi documenti, uno per AD 7 e l'altro per AD 8; usa le altre guide come link diretto per gli argomenti già trattati, crea il contenuto per quelli che mancano». Bando EPSO/AD/430/26 (GU C/2026/4668), settori AI e cybersicurezza; capitoli 1–12 seguono l'Allegato II, `#sum` mappa ogni mansione al capitolo.
- Gli argomenti già spiegati altrove stanno in riquadri `aside.vx-prereq.gia` («Già trattato nelle guide») con link al capitolo esatto; `.gia` è in `skip` di XREF_CONFIG. Non linkare comandi-bash: non è pubblicata.
- Ogni capitolo ha un'esercitazione a scelta multipla: `<div class="qz" data-quiz="capN">`, domande in `window.QUIZ` nello script, opzioni mescolate a ogni giro. Domande non ufficiali (lo dice il capitolo 1).
- Norme aggiornate a ottobre 2026; da ricontrollare lo stato del Digital Omnibus (AI Act, GDPR).
- `exams/epso-ad8.json` con 7 domande.
