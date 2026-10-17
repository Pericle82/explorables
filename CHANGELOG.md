# Changelog

Le versioni sono per singola guida. Ogni rilascio ha un tag git `<slug>-v<versione>`.

## 2026-10-17
- **Da Assistente ad Agente** (`assistente-agente`) v1.7: Correzione: nel capitolo 1 i limiti sono tre più un vincolo pratico, la lunghezza massima del contesto
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.10: Correzioni: capitolo 38, 14.336 × 32 = 458.752 filtri per token; capitolo 37, i due terzi dei parametri valgono per i transformer di allora (in Llama 3 sono quattro quinti); capitolo 24, il modello da 27 miliardi entra in 32 GB perché i pesi sono compressi a 4 bit
- **Neural Network Driving** (`neural-network-driving`) v1.4: Correzioni: la rete ha 82 parametri (72 pesi e 10 bias), non 82 pesi; nel grafo gli archi sono 72, non centinaia; le copie della pista sono una per auto
- **Anatomia del Training LLM** (`training-llm`) v2.7: Correzioni: l'MLP di un 7B ha tre matrici 4.096 × 11.008 per strato, non due; l'allargamento della MLP è 4d nel transformer originale e 11.008 ≈ 2,7d in Llama 2 7B; divisione per √dk nell'attention; «Vettore» al posto di «Scheda» nella tabella re/regina
- **Machine learning: dalla retta che impara all'agente che decide** (`machine-learning`) v1.4: Capitolo 14: corretto il conto del ritorno del rover (12,5 a sinistra e 10 a destra, non 25 e 20), con una riga che spiega i termini; esame a risposta aperta con 13 domande
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.9: Formattazione per la lettura: frasi chiave evidenziate, termini definiti, riquadri (sintesi, attenzione, esempio), calcoli in riquadri per formule, una mappa concettuale per capitolo
- **Machine learning: dalla retta che impara all'agente che decide** (`machine-learning`) v1.3: Formattazione per la lettura: frasi chiave evidenziate, termini definiti, riquadri (sintesi, attenzione, esempio), calcoli in riquadri per formule, una mappa concettuale per capitolo
- **Dentro l'inferenza** (`inferenza-llm`) v1.2: Formattazione per la lettura: frasi chiave evidenziate, termini definiti, riquadri (sintesi, attenzione, esempio), calcoli in riquadri per formule, una mappa concettuale per capitolo
- **Neural Network Driving** (`neural-network-driving`) v1.3: Formattazione per la lettura: frasi chiave evidenziate, termini definiti, riquadri (sintesi, attenzione, esempio), calcoli in riquadri per formule, una mappa concettuale per capitolo
- **Ingegneria dei sistemi LLM** (`ai-engineering`) v1.4: Formattazione per la lettura: frasi chiave evidenziate, termini definiti, riquadri (sintesi, attenzione, esempio), calcoli in riquadri per formule, una mappa concettuale per capitolo
- **Encoder, decoder, esperti** (`architetture-llm`) v1.3: Formattazione per la lettura: frasi chiave evidenziate, termini definiti, riquadri (sintesi, attenzione, esempio), calcoli in riquadri per formule, una mappa concettuale per capitolo
- **Quando il COMMIT non basta più** (`transazioni`) v2.15: Formattazione per la lettura: frasi chiave evidenziate, termini definiti, riquadri (sintesi, attenzione, esempio), calcoli in riquadri per formule, una mappa concettuale per capitolo
- **Da Assistente ad Agente** (`assistente-agente`) v1.6: Formattazione per la lettura: frasi chiave evidenziate, termini definiti, riquadri (sintesi, attenzione, esempio), calcoli in riquadri per formule, una mappa concettuale per capitolo
- **Anatomia del Training LLM** (`training-llm`) v2.6: Formattazione per la lettura: frasi chiave evidenziate, termini definiti, riquadri (sintesi, attenzione, esempio), calcoli in riquadri per formule, una mappa concettuale per capitolo

## 2026-10-16
- **Anatomia del Training LLM** (`training-llm`) v2.5: Capitolo 2: frasi di lunghezza diversa nella stessa rete, con un esempio a matrici (X n × 2, attention n × n calcolata, W 2 × 2) e uno step di training reale su una frase corta e una lunga; packing, padding e perché esiste una lunghezza massima del contesto
- **Machine learning: dalla retta che impara all'agente che decide** (`machine-learning`) v1.2: Capitolo 4: esempio svolto di normalizzazione per media (mean normalization) sulle superfici delle case del capitolo 1, con il confronto tra media vera e punto medio e l'uso degli stessi valori in previsione
- **Dentro l'inferenza** (`inferenza-llm`) v1.1: Capitolo 1: rimando al laboratorio sulla softmax della guida sul machine learning
- **Ingegneria dei sistemi LLM** (`ai-engineering`) v1.3: Sezione 5: la soglia del guardrail collegata a precisione e recall della guida sul machine learning, e perché qui conta il tasso di falsi positivi
- **Machine learning: dalla retta che impara all'agente che decide** (`machine-learning`) v1.1: Capitolo 8: rimando a Neural Network Driving come esempio di rete allenata senza gradiente, per evoluzione
- **Neural Network Driving** (`neural-network-driving`) v1.2: Rimandi alla guida sul machine learning: lettura consigliata sulle reti neurali, capitolo 7 dal forward pass, capitolo 3 dalla discesa del gradiente, capitolo 9 dalla generalizzazione

## 2026-10-15
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.8: Capitolo 7: peso e parametro, che differenza c'è (parametro è ogni numero regolato dall'addestramento, peso è il parametro che moltiplica un ingresso, bias quello che sposta la soglia), con tabella sul nodo a tre ingressi e sul laboratorio delle case, e perché nel parlare comune pesi e parametri sono usati come sinonimi

## 2026-10-14
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.7: Capitolo 1: storia riordinata e Deep Blue spiegato (albero delle mosse, voto alle posizioni con una formula scritta da programmatori e maestri, in fondo una procedura classica che funziona perché negli scacchi le regole si sanno scrivere, a differenza dei pixel di una foto); schema dei tre modi di sostituire la procedura (ricerca, regole degli esperti, machine learning); rimossa la linea del tempo

## 2026-10-13
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.6: Capitolo 9, caso strawberry riscritto: che cosa arriva al modello (il tokenizzatore lo spezza in pezzi, prima del modello), come il modello risponde (non esegue un conteggio, produce la risposta più probabile), e perché scrivere la parola lettera per lettera aiuta (il testo scritto rientra e passa dallo stesso tokenizzatore, ogni lettera isolata diventa un token)
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.5: Capitolo 9: il caso strawberry passo per passo (che cosa vediamo noi, che cosa riceve il modello, perché l'ortografia dei pezzi non arriva, perché i modelli recenti rispondono giusto scrivendo la parola lettera per lettera) con figura a tre viste
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.4: Capitolo 2: laboratorio delle case spiegato passo per passo (dati, retta come funzione, errori, manopole a mano, passi di correzione) e a che cosa tende l'errore: al minimo della retta migliore (≈ 18,9), non a zero; linea del minimo nel grafico dell'errore
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.3: Capitolo 1: che cosa c'è dentro l'etichetta «intelligenza artificiale» (ricerca, sistemi esperti, pianificazione e ottimizzazione, ragionamento con l'incertezza, machine learning; visione, linguaggio e robotica come campi di applicazione) e che cosa distingue un software classico (da dove viene la logica della decisione), con la figura «Lo stesso compito, quattro approcci»; capitolo 4: le altre famiglie accanto al machine learning nelle matrioske
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.2: Da glossario a manuale: titolo, capitoli al posto di voci, nessun conteggio totale (i capitoli potranno aumentare); riscritta la frase sul limite delle regole (compiti che a noi riescono senza sforzo e che nessuno sa scomporre in istruzioni)
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.1: Testo reso autonomo dalle fonti; spiegazione e laboratorio «Scrivi tu le regole del gatto»; nel laboratorio delle case spiegato a che cosa servono le manopole w e b, con la stima di una casa nuova
- **Manuale AI: i concetti dell’intelligenza artificiale, uno sopra l’altro** (`manuale-ai`) v1.0: Prima versione: i concetti dall'intelligenza artificiale alla funzione di attivazione, in ordine di prerequisito, con cenni storici, mappa dei prerequisiti, linea del tempo 1637–2024 e una figura per capitolo (laboratori con calcolo reale su BPE, similarità coseno, temperatura, Q·K·V, RoPE, maschera causale, funzioni di attivazione)

## 2026-10-04
- **Machine learning: dalla retta che impara all'agente che decide** (`machine-learning`) v1.0: Prima versione: guida originale sul programma della Machine Learning Specialization in 14 capitoli, riepilogo e glossario, 16 laboratori con la matematica reale (retta e costo, discesa del gradiente, scaling, regressione logistica, overfitting, rete neurale, softmax, curve di apprendimento, precisione e recall, entropia, k-means, anomalie, filtro collaborativo, rover e Bellman)
- **Anatomia del Training LLM** (`training-llm`) v2.4: Dalla chat sui dubbi ricorrenti: la rete a finestra fissa numero per numero (concatenazione, W₁ riga per neurone, regola delle dimensioni, perché non scala), «vettore lungo o matrice?» nell'attention, laboratorio X → O con tutte le matrici di una testa (Q, K, V, QKᵀ, softmax causale, AV, pesi casuali vs del modello), tabella parametri vs attivazioni, due nuove FAQ (come si compongono i vettori; W_q/W_k/W_v da un solo training); correzioni di concordanza dopo scheda → vettore

## 2026-10-03
- **Anatomia del Training LLM** (`training-llm`) v2.3: Riscrittura completa (v2.0–2.3). Capitolo 1 dal basso: contare, perché non basta, rete neurale (neurone dell'ombrello, rete 3→2→1), finestra fissa, reti ricorrenti, attention, che cos'è un transformer, un transformer in miniatura eseguibile numero per numero, re − uomo + donna, le domande che vengono a tutti (chi morde chi, KV cache, finestra di contesto). Capitolo 2: dall'errore ai pesi (cross-entropy, gradiente p − y, backpropagation con laboratorio, learning rate, batch/epoch, memoria di training). Parte II: cinque fasi con filo problema → dati → loss → esempio → limite e lo stesso prompt seguito fase per fase. Capitolo 9 di approfondimento: BPE, algebra in otto passi, matrice E e RoPE, attention a tre matrici, softmax e temperatura, conti dei 7B, backprop a due strati.
- **Anatomia del Training LLM** (`training-llm`) v1.16: «Da zero» punto 7: le domande che vengono a tutti (ingressi e pesi, strato d'ingresso, dove stanno gli embedding e KV cache, ordine e posizione con il laboratorio «chi morde chi?», finestra di contesto)

## 2026-10-02
- **Anatomia del Training LLM** (`training-llm`) v1.15: «Da zero» punto 6: da 7B a 4.096, cosa vuol dire entrare nella rete, come si parlano le schede (laboratorio sull'attenzione)
- **Anatomia del Training LLM** (`training-llm`) v1.14: Nuova sottosezione «Da zero»: neurone, rete, apprendimento, parole come numeri (re/regina con assi etichettati), perché entrano tutti i token insieme
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
