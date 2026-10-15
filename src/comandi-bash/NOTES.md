# comandi-bash — La shell, un comando alla volta

**Non ancora pubblicata**: il file `docs/comandi-bash.html` esiste ma la guida non è in `docs.json`. Si registra con `release.mjs` solo quando Joe lo decide.

Sorgenti in questa cartella: `head.html`, `extra.css`, `body.html` (testo e schede), `script.html` (il terminale simulato), `shared.html`. `python3 build.py` genera `comandi-bash.html` e lo copia in `docs/`. Test: `node bt4.js` e simili (Playwright).

## Decisioni di Joe
- La guida si costruisce **un comando alla volta, su richiesta di Joe**: non completarla di propria iniziativa.
- Ogni comando ha una scheda con la stessa struttura: Che cosa fa · Come si scrive · Gli usi che contano · Linux · macOS · Dove si inciampa · Prova (terminale simulato con i pulsanti dei comandi).
- Il terminale simulato impara ogni comando quando entra nella guida: file system finto, pipe, `;`, `$(…)`, `$?`, sudo; note macOS (canale `mac`) e suggerimenti (canale `hint`). Nei pulsanti `data-try` il separatore è `§` e le virgolette nei comandi vanno scritte `&quot;`.
- Accento: Oliva.

## Schede presenti
- Capitolo 0: terminale e shell, bash e zsh, grammatica di un comando, Linux e macOS, come chiedere aiuto, quattro gesti.
- Pipe; awk (e cut) per estrarre valori da tabelle; lsof -i con awk e `lsof -t`.
- «Chi occupa una porta»: `lsof -iTCP:PORTA -sTCP:LISTEN -n -P`, ss, netstat (forma Linux e macOS), `lsof -ti`, `kill` e `kill -9`, la 4173 di `vite preview` (richiesta di Joe del 15/10).
