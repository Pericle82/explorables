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
