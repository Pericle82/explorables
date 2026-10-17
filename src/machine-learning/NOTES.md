# machine-learning — Machine learning: dalla retta che impara all'agente che decide

Guida originale sul programma della Machine Learning Specialization (DeepLearning.AI, Andrew Ng), scritta dal sillabo del corso (non dalle trascrizioni). Un unico documento, 14 capitoli in tre parti più riepilogo e glossario.

Sorgenti: `p1.html`–`p3.html` (testo per parte), `js1.js`–`js3.js` (laboratori), `extra.css`, `xref.html`. `python3 build.py` genera `machine-learning.html` e lo copia in `docs/`. Test: `check.js`, `chk2.js`–`chk5.js`.

## Decisioni
- 16 laboratori con matematica reale su dati generati con seme fisso.
- Accento: Prugna.
- 16/10/2026 (v1.1): rimando a neural-network-driving #s4 nel capitolo 8, dopo la backpropagation, come esempio di rete allenata senza gradiente (sovrapposizione con NND sezione 3 ridotta a rimandi reciproci).
- 16/10/2026 (v1.2): capitolo 4, esempio svolto di normalizzazione per media (traduzione scelta per *mean normalization*, la stessa usata nel capitolo 13) sulle sei superfici del capitolo 1 (μ = 88,3, range 80): valori in un tratto largo 1 dentro [−1, 1], media zero, confronto con il punto medio 90; in previsione si riusano μ, min e max del training set. Niente μ nelle intestazioni delle tabelle: `.vx-table` le mette in maiuscolo (μ diventa M).
- 17/10/2026 (v1.3): richiesta di Joe «i documenti sono difficili da leggere»: formattazione per la lettura secondo AUTHORING.md §12 (`<mark>` sulle frasi chiave, `<dfn>`, riquadri `.rd`, calcoli in `.vx-math`, mappe `.vx-cmap`). Il testo non cambia.
- 17/10/2026: richiesta di Joe «come per la teoria sul db, esami a risposta aperta per gli altri documenti»: `exams/machine-learning.json` con 13 domande. Nella stessa occasione (v1.4) corretto il conto del rover nel capitolo 14: dalla casella 4 con γ = 0,5 i ritorni sono 12,5 (sinistra, γ³ · 100) e 10 (destra, γ² · 40), non 25 e 20; il laboratorio già usava 100γ³ contro 40γ².
