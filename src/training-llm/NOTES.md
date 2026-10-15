# training-llm — Anatomia del Training LLM

Si modifica direttamente `docs/training-llm.html` (nessun sorgente separato).

## Decisioni di Joe
- Capitolo 1 intuitivo prima di tutto: costruisce il transformer dal basso (contare → perché non basta → rete neurale → finestra fissa → reti ricorrenti → attention → transformer → modello in miniatura eseguibile). I dettagli (RoPE, query/key/value, conti dei 7B) vanno nel capitolo 9 «Approfondimenti».
- «vettore», mai «scheda», per l'embedding di un token. «migliaia di miliardi», non «trilioni».
- Laboratori «reali dove possibile».
- v2.4: dai dubbi di una chat di Joe: concatenazione vs combinazione pesata (attention), che cos'è W₁ e la regola delle dimensioni, vettore lungo o matrice, parametri vs attivazioni (W_q/W_k/W_v da un unico training, Q/K/V ricalcolati).
- Un'altra sessione ha lavorato in parallelo sul repo via PR in passato: prima di modificare, controllare `git log` e lo stato del remoto.
- Accento: Verde petrolio.
