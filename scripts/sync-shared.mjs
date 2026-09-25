// Aggiorna nelle guide i blocchi condivisi (tema di navigazione, indice, riferimenti incrociati)
// copiandoli da shared/<nome>.html. Ogni blocco nelle guide è delimitato da:
//   <!-- xpl:shared <nome>:start … -->  …  <!-- xpl:shared <nome>:end -->
// Uso: node scripts/sync-shared.mjs          → aggiorna i file in docs/
//      node scripts/sync-shared.mjs --check  → segnala i blocchi non allineati (exit 1), senza modificare
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const RE = /<!-- xpl:shared ([a-z0-9-]+):start[^>]*-->\n([\s\S]*?)\n<!-- xpl:shared \1:end -->/g;
const targets = [...readdirSync(join(ROOT, "docs")).filter((f) => f.endsWith(".html")).map((f) => join("docs", f)), join("templates", "guide.html")];
let stale = 0, updated = 0;
for (const rel of targets) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) continue;
  const src = readFileSync(path, "utf8");
  const out = src.replace(RE, (all, name, body) => {
    const sp = join(ROOT, "shared", `${name}.html`);
    if (!existsSync(sp)) { console.warn(`${rel}: blocco «${name}» senza shared/${name}.html`); return all; }
    const fresh = readFileSync(sp, "utf8").trim();
    if (fresh === body.trim()) return all;
    stale++; console.log(`${check ? "da aggiornare" : "aggiornato"}: ${rel} · ${name}`);
    // ricostruisce il blocco per posizione: marcatore di apertura (una riga) + contenuto + marcatore di chiusura
    const open = all.slice(0, all.indexOf("\n") + 1);
    return open + fresh + `\n<!-- xpl:shared ${name}:end -->`;
  });
  if (!check && out !== src) { writeFileSync(path, out); updated++; }
}
if (check && stale) { console.error(`${stale} blocchi non allineati: esegui node scripts/sync-shared.mjs`); process.exit(1); }
if (!check) console.log(updated ? `${updated} file aggiornati.` : "Tutti i blocchi condivisi sono già allineati.");
