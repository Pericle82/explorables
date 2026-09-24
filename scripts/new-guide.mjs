// Crea una nuova guida da templates/guide.html.
// Uso: node scripts/new-guide.mjs <slug> "Titolo della guida"
// Poi: scrivi il contenuto in docs/<slug>.html e registra la versione 1.0 con scripts/release.mjs.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const [slug, title] = process.argv.slice(2);
if (!slug || !title) { console.error('Uso: node scripts/new-guide.mjs <slug> "Titolo della guida"'); process.exit(1); }
if (!/^[a-z0-9-]+$/.test(slug)) { console.error("Lo slug può contenere solo lettere minuscole, cifre e trattini."); process.exit(1); }
const dest = join(ROOT, "docs", `${slug}.html`);
if (existsSync(dest)) { console.error(`docs/${slug}.html esiste già.`); process.exit(1); }
const tpl = readFileSync(join(ROOT, "templates", "guide.html"), "utf8").replace("{{Nome della guida, 2–4 parole}}", title);
writeFileSync(dest, tpl);
console.log(`Creata docs/${slug}.html dal template.
Regole di scrittura: AUTHORING.md. Quando è pronta:
  node scripts/release.mjs ${slug} 1.0 "Prima versione" --title "${title}" --description "…" --tags "…"
  npm run preview`);
