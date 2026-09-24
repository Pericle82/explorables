// Registra una nuova versione di una guida (o ne aggiunge una nuova) in docs.json e CHANGELOG.md.
//
// Aggiornare una guida esistente:
//   node scripts/release.mjs transazioni 2.1 "Nuovo laboratorio sui deadlock"
//
// Aggiungere una guida nuova (il file docs/<slug>.html deve già esistere):
//   node scripts/release.mjs kafka-internals 1.0 "Prima versione" \
//     --title "Dentro Kafka" --description "Log, partizioni, consumer group…" --tags "kafka,streaming"
//
// Lo script non fa commit: stampa i comandi git da eseguire.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flags = {};
const pos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) flags[args[i].slice(2)] = args[++i];
  else pos.push(args[i]);
}
const [slug, version, notes] = pos;
const fail = (m) => { console.error("Errore: " + m); process.exit(1); };
if (!slug || !version || !notes) fail('uso: node scripts/release.mjs <slug> <versione> "<note>" [--title … --description … --tags a,b --artifact url]');
if (!/^\d+(\.\d+){1,2}$/.test(version)) fail(`versione "${version}" non valida (usa 1.2 oppure 1.2.3)`);
if (!existsSync(join(ROOT, "docs", `${slug}.html`))) fail(`manca il file docs/${slug}.html`);

const cmp = (a, b) => { const x = a.split(".").map(Number), y = b.split(".").map(Number); for (let i = 0; i < 3; i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d; } return 0; };
const today = new Date().toISOString().slice(0, 10);
const path = join(ROOT, "docs.json");
const manifest = JSON.parse(readFileSync(path, "utf8"));
let doc = manifest.docs.find((d) => d.slug === slug);

if (doc) {
  if (cmp(version, doc.version) <= 0) fail(`la versione ${version} deve essere maggiore dell'attuale ${doc.version}`);
  for (const k of ["title", "description", "artifact"]) if (flags[k]) doc[k] = flags[k];
  if (flags.tags) doc.tags = flags.tags.split(",").map((s) => s.trim()).filter(Boolean);
} else {
  if (!flags.title || !flags.description) fail("guida nuova: servono --title e --description");
  doc = { slug, title: flags.title, description: flags.description, tags: (flags.tags || "").split(",").map((s) => s.trim()).filter(Boolean), history: [] };
  if (flags.artifact) doc.artifact = flags.artifact;
  manifest.docs.push(doc);
}
doc.version = version;
doc.updated = today;
doc.history = [{ version, date: today, notes }, ...(doc.history || [])];
writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n");

// CHANGELOG: raggruppato per data, la più recente in alto
const clPath = join(ROOT, "CHANGELOG.md");
let cl = existsSync(clPath) ? readFileSync(clPath, "utf8") : "# Changelog\n";
const entry = `- **${doc.title}** (\`${slug}\`) v${version}: ${notes}`;
const heading = `## ${today}`;
if (cl.includes(heading + "\n")) cl = cl.replace(heading + "\n", `${heading}\n${entry}\n`);
else cl = cl.replace(/^(# Changelog\n(?:\n?[^#\n].*\n)*)/, `$1\n${heading}\n${entry}\n`);
writeFileSync(clPath, cl);

const tag = `${slug}-v${version}`;
console.log(`Registrata ${slug} v${version} (${today}).\n\nProssimi passi:\n  node scripts/build.mjs        # controlla che il sito si generi\n  git add -A\n  git commit -m "${slug}: v${version} — ${notes.replace(/"/g, "'")}"\n  git tag ${tag}\n  git push && git push origin ${tag}`);
