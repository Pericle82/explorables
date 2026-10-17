# training-llm — Anatomia del Training LLM

Si modifica direttamente `docs/training-llm.html` (nessun sorgente separato).

## Decisioni di Joe
- Capitolo 1 intuitivo prima di tutto: costruisce il transformer dal basso (contare → perché non basta → rete neurale → finestra fissa → reti ricorrenti → attention → transformer → modello in miniatura eseguibile). I dettagli (RoPE, query/key/value, conti dei 7B) vanno nel capitolo 9 «Approfondimenti».
- «vettore», mai «scheda», per l'embedding di un token. «migliaia di miliardi», non «trilioni».
- Laboratori «reali dove possibile».
- v2.4: dai dubbi di una chat di Joe: concatenazione vs combinazione pesata (attention), che cos'è W₁ e la regola delle dimensioni, vettore lungo o matrice, parametri vs attivazioni (W_q/W_k/W_v da un unico training, Q/K/V ricalcolati).
- Un'altra sessione ha lavorato in parallelo sul repo via PR in passato: prima di modificare, controllare `git log` e lo stato del remoto.
- Accento: Verde petrolio.
- 16/10/2026 (v2.5): Joe non capiva come una frase di lunghezza variabile entri in una rete con nodi d'ingresso fissi e chiedeva un esempio con matrici sull'addestramento. Messo nel capitolo 2 (#c-varlen, dopo «Il ritmo»), non in machine-learning o architetture-llm: lab reale con vocabolario di 5 token su un cerchio (d = 2), attention senza W_q/W_k, si allena solo W 2 × 2; allenare sulla frase corta migliora anche la lunga. Rimando dalla FAQ «nodi d'ingresso» del capitolo 1 e voce nella mappa del capitolo 2.
- 17/10/2026 (v2.6): richiesta di Joe «i documenti sono difficili da leggere»: formattazione per la lettura secondo AUTHORING.md §12 (`<mark>` sulle frasi chiave, `<dfn>`, riquadri `.rd`, calcoli in `.vx-math`, mappe `.vx-cmap`). Il testo non cambia.
- 17/10/2026: richiesta di Joe «come per la teoria sul db, esami a risposta aperta per gli altri documenti»: `exams/training-llm.json` con 13 domande. Le sezioni hanno id propri: l'esame le mappa in `sections` (1–3 capitoli, 4–8 le cinque fasi, «9A»…«9G» i tratti di «Approfondimenti» tra gli h3 A–G, perché la sezione intera supera i 60.000 caratteri).
- 17/10/2026 (v2.7): Joe «correggi le guide» (errori trovati scrivendo l'esame): MLP del 7B con tre matrici 4.096 × 11.008 (SwiGLU) al cap. 1; «circa 4d» precisato come transformer originale, 11.008 ≈ 2,7d in Llama 2 7B (capp. 9B, 9D e mappa); √d_k nella nota e nella mappa di 9D; intestazione «Vettore» nella tabella re/regina.
