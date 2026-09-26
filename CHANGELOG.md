# Changelog

Le versioni sono per singola guida. Ogni rilascio ha un tag git `<slug>-v<versione>`.

## 2026-09-26
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
