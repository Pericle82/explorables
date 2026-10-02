# Changelog

Le versioni sono per singola guida. Ogni rilascio ha un tag git `<slug>-v<versione>`.

## 2026-10-02
- **Anatomia del Training LLM** (`training-llm`) v1.13: Capitolo 0 per chi parte da zero: quadro d'insieme con laboratorio sul percorso di un token; percorso di algebra riscritto con esempi numerici semplici e approfondimenti in riquadri richiudibili «Dove ritorna nel modello»
- **Anatomia del Training LLM** (`training-llm`) v1.12: Nuova sottosezione sui tensori (rango, shape, fette, broadcasting, reshape e transpose delle teste) con schema e laboratorio; le formule principali della guida in riquadri dedicati
- **Anatomia del Training LLM** (`training-llm`) v1.11: Richiamo di algebra approfondito: vettori e residual stream, prodotto scalare e √d_k, norma e alte dimensioni, matrici come trasformazioni, shape e FLOP, non linearità, basso rango e LoRA; sette laboratori a matematica reale
- **Encoder, decoder, esperti** (`architetture-llm`) v1.2: Rimando alla guida sull'inferenza per il ciclo di generazione e la cache KV
- **Ingegneria dei sistemi LLM** (`ai-engineering`) v1.2: Allucinazione e grounding nel RAG; prompt caching del provider distinto dalla cache del gateway; prefill e decode nel TTFT; inferenza tra le letture consigliate
- **Da Assistente ad Agente** (`assistente-agente`) v1.5: Nuova sottosezione sul prompt con laboratorio; JSON valido con structured outputs e decodifica vincolata; rimando alla guida sull'inferenza
- **Anatomia del Training LLM** (`training-llm`) v1.10: Nuove sottosezioni: backpropagation e regola della catena con laboratorio; basi di RL e reward model (Bradley-Terry) prima di DPO; glossario con scaling laws e benchmark
- **Dentro l'inferenza** (`inferenza-llm`) v1.0: Prima versione: ciclo di generazione, campionamento (top-k, top-p, min-p), cache KV, prefill contro decode, batching e PagedAttention, decodifica speculativa, output strutturato
- **Neural Network Driving** (`neural-network-driving`) v1.1: Revisione: modello a bicicletta (il raggio non dipende dalla velocità), crossover a un punto, discesa del gradiente e apprendimento supervisionato; letture consigliate in testa
- **Ingegneria dei sistemi LLM** (`ai-engineering`) v1.1: Revisione: nota e callout della cache coerenti con il laboratorio, temperatura e determinismo, laboratorio RRF, scala di Landis e Koch, durata del test con utenti; letture consigliate in testa; rimandi alle guide sugli agenti e sul training
- **Da Assistente ad Agente** (`assistente-agente`) v1.4: Revisione: correzioni di italiano e acronimi, descrizione dei tool, callout sull'accumulo degli errori; letture consigliate in testa; rimando all'ingegneria dei sistemi LLM per budget, ripresa ed evals
- **Encoder, decoder, esperti** (`architetture-llm`) v1.1: Revisione: note del calcolatore corrette sui preset, capacità dei MoE, Llama 4 Maverick, bilanciamento con bias in DeepSeek-V3, rinormalizzazione non universale; letture consigliate in testa; rimando al capitolo sugli strati del training
- **Anatomia del Training LLM** (`training-llm`) v1.9: Revisione: «migliaia di miliardi» al posto di «trilioni», MLP SwiGLU coerente con il conto di Llama 2 7B, AdamW, notazione DPO, reward hacking anche con RLVR; letture consigliate in testa; rimando alla guida sulle architetture

## 2026-09-30
- **Quando il COMMIT non basta più** (`transazioni`) v2.14: Capitolo 3: il WAL è un log fisico — ogni nota contiene l'indirizzo della modifica (file, pagina, offset); distinzione esplicita tra l'indirizzo nella nota (quale pagina caricare) e l'LSN nell'header della pagina (se applicare).
- **Quando il COMMIT non basta più** (`transazioni`) v2.13: Capitolo 3: definizione dell'LSN (indirizzo della nota nel log: ordina e localizza) introdotta dove il log compare per la prima volta; nuova sezione «Dopo il crash: come si trova l'ultima nota scritta?» (file di controllo e redo point, scansione del log in avanti fino al primo CRC non valido, nessuna scansione delle pagine dati); riepilogo e autodiagnosi aggiornati.

## 2026-09-29
- **Neural Network Driving** (`neural-network-driving`) v1.0: Prima versione: mondo simulato (modello a bicicletta), sensori a raycasting, rete 8-6-4 con grafo interattivo, neuroevoluzione con simulazione in pista, dal video al repo a tappe.

## 2026-09-28
- **Ingegneria dei sistemi LLM** (`ai-engineering`) v1.0: Prima versione: i sei strati del portfolio ai-engineering-portfolio (async, gateway, RAG, agenti, memoria, eval, capstone) con laboratori su percentili e cache, circuit breaker, RRF e recall@k, macchina a stati con crash e ripresa, selezione dei ricordi, kappa di Cohen e soglia dei guardrail

## 2026-09-27
- **Quando il COMMIT non basta più** (`transazioni`) v2.12: Capitolo 3: chi applica la modifica alla pagina (nessun processo in ascolto sul WAL); abort prima del commit: le note nel WAL restano, la pagina sporca in PostgreSQL vs InnoDB
- **Quando il COMMIT non basta più** (`transazioni`) v2.11: Capitolo 3: come funziona il checksum (CRC) delle note del log, in scrittura e in lettura al riavvio; voce nel glossario

## 2026-09-26
- **Quando il COMMIT non basta più** (`transazioni`) v2.10: Corretta la frase sull'autocommit nel capitolo 2: la finestra SELECT/UPDATE è identica con o senza BEGIN, perché solo l'UPDATE prende il lock
- **Quando il COMMIT non basta più** (`transazioni`) v2.9: Capitolo 2: separati i due problemi di SELECT+if+UPDATE — il crash a metà lo risolve la transazione, la finestra concorrente no perché la SELECT non prende lock; tabella riassuntiva
- **Quando il COMMIT non basta più** (`transazioni`) v2.8: Chiarito che lo snapshot governa solo le letture: l'UPDATE lavora sulla versione corrente della riga, non sullo snapshot della SELECT; confronto READ_COMMITTED / REPEATABLE_READ
- **Quando il COMMIT non basta più** (`transazioni`) v2.7: Relazione tra transazione e lock (il lock nasce dall'istruzione, la transazione ne decide la durata) e a che cosa serve una transazione per le sole letture
- **Quando il COMMIT non basta più** (`transazioni`) v2.6: Autocommit: un'istruzione, una transazione, e i tre casi in cui più istruzioni condividono il confine (trigger e cascate, funzioni, driver senza autocommit); lock in MVCC: la SELECT prima dell'UPDATE non prende il lock esclusivo, salvo FOR UPDATE

## 2026-09-25
- **Encoder, decoder, esperti** (`architetture-llm`) v1.0: Prima versione: BERT contro GPT, famiglie di architetture, modelli densi e a esperti (MoE), come sceglie il router. Laboratori su maschera di attenzione, calcolatore denso/sparso e router a 8 esperti.
- **Quando il COMMIT non basta più** (`transazioni`) v2.5: I 68 schemi in testo monospazio diventano componenti web: schede codice con Copia, linee temporali T1/T2, contenitori RAM/log/disco, tabelle con barre, schede dei casi, pile, catene di versioni e diagrammi SVG. Nuovo blocco condiviso vx per tutte le guide.
- **Quando il COMMIT non basta più** (`transazioni`) v2.4: Indice rivisto: pulsante fuori dalla barra (nessuna sovrapposizione), pannello sotto la barra, sezioni comprimibili, ricerca e posizione corrente; sostituito l'indice precedente con il componente condiviso, come nelle altre guide
- **Da Assistente ad Agente** (`assistente-agente`) v1.3: Indice rivisto: pulsante fuori dalla barra (nessuna sovrapposizione), pannello sotto la barra, sezioni comprimibili, ricerca e posizione corrente
- **Anatomia del Training LLM** (`training-llm`) v1.8: Indice rivisto: pulsante fuori dalla barra (nessuna sovrapposizione), pannello sotto la barra, sezioni comprimibili, ricerca e posizione corrente

## 2026-09-24
- **Quando il COMMIT non basta più** (`transazioni`) v2.3: Id stabili per i capitoli (cap-1 … cap-17), usati dall'esame a risposta aperta e dai link esterni
- **Da Assistente ad Agente** (`assistente-agente`) v1.2: Pannello Indice con tutte le sezioni, come in transazioni
- **Anatomia del Training LLM** (`training-llm`) v1.7: Pannello Indice con tutti i capitoli e le sottosezioni, come in transazioni
- **Da Assistente ad Agente** (`assistente-agente`) v1.1: Riferimenti incrociati con anteprima, anche verso la guida sul training (SFT, DPO, RLVR); termini chiave e sezioni collegati con popup
- **Anatomia del Training LLM** (`training-llm`) v1.6: Riferimenti incrociati con anteprima: capitoli, fasi (SFT, DPO, GRPO, RLVR, OPD), concetti base e termini del glossario diventano link con popup
- **Quando il COMMIT non basta più** (`transazioni`) v2.2: Riferimenti incrociati con anteprima: capitoli, parti, casi, passi, scenari e termini del glossario diventano link; al passaggio del mouse (o al primo tocco) un popup mostra il contenuto collegato
- **Quando il COMMIT non basta più** (`transazioni`) v2.1: Indice di navigazione interna sempre visibile: la barra delle parti resta fissa in alto durante lo scorrimento, con il pulsante Indice per l'elenco completo dei capitoli
- **Quando il COMMIT non basta più** (`transazioni`) v2.0: revisione dei contenuti (circa 75 correzioni), nuovo stile, cinque nuovi laboratori (lock e MVCC, crash recovery, anomalie per motore e livello, 2PC, quorum).
- **Da Assistente ad Agente** (`assistente-agente`) v1.0: prima versione.
- **Anatomia del Training LLM** (`training-llm`) v1.5: richiamo di algebra, capitolo sugli strati, vocabolario BPE visibile, inizializzazione della matrice di embedding.
- **Anatomia del Training LLM** (`training-llm`) v1.4: sezione sugli embedding.
- **Anatomia del Training LLM** (`training-llm`) v1.3: BPE con pre-tokenizzazione e lunghezza massima del token.

## 2026-09-23
- **Anatomia del Training LLM** (`training-llm`) v1.2: dataset, BPE passo per passo, batch/step/epoch, training dal vivo.
- **Anatomia del Training LLM** (`training-llm`) v1.1: capitolo sui concetti base.
- **Anatomia del Training LLM** (`training-llm`) v1.0: prima versione.
