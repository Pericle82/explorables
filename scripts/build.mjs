// Genera il sito statico in dist/ a partire da docs.json e dai file in docs/.
// Nessuna dipendenza: basta Node 18+.  Uso: node scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const manifest = JSON.parse(readFileSync(join(ROOT, "docs.json"), "utf8"));
const { site, docs } = manifest;

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MONTHS = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
const fmtDate = (iso) => { if (!iso) return "data non nota"; const [y, m, d] = iso.split("-").map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const today = new Date().toISOString().slice(0, 10);

// --- validazione del manifest ---
const errors = [];
const slugs = new Set();
for (const d of docs) {
  for (const k of ["slug", "title", "description", "version", "updated"]) if (!d[k]) errors.push(`${d.slug ?? "?"}: manca il campo "${k}"`);
  if (!/^[a-z0-9-]+$/.test(d.slug ?? "")) errors.push(`${d.slug}: lo slug può contenere solo lettere minuscole, cifre e trattini`);
  if (slugs.has(d.slug)) errors.push(`${d.slug}: slug duplicato`);
  slugs.add(d.slug);
  if (!existsSync(join(ROOT, "docs", `${d.slug}.html`))) errors.push(`${d.slug}: manca il file docs/${d.slug}.html`);
  if (d.history?.[0] && d.history[0].version !== d.version) errors.push(`${d.slug}: la prima voce di history (${d.history[0].version}) non coincide con version (${d.version})`);
}
if (errors.length) { console.error("Manifest non valido:\n  " + errors.join("\n  ")); process.exit(1); }

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// --- pagine dei documenti ---
// I file in docs/ sono nello stesso formato pubblicato come artifact: senza doctype, <html>, <head>, <body>.
// Qui si spostano in <head> i tag iniziali (title, link, meta, style) e si aggiunge lo scheletro.
function splitHead(src) {
  let head = "", rest = src.replace(/^﻿/, "");
  const re = /^\s*(<title>[\s\S]*?<\/title>|<link\b[^>]*>|<meta\b[^>]*>|<style\b[^>]*>[\s\S]*?<\/style>)/i;
  let m;
  while ((m = rest.match(re))) { head += m[1] + "\n"; rest = rest.slice(m[0].length); }
  return { head, body: rest.trim() };
}

for (const d of docs) {
  const src = readFileSync(join(ROOT, "docs", `${d.slug}.html`), "utf8");
  if (/<!doctype/i.test(src.slice(0, 200))) { errors.push(`${d.slug}: il file contiene già un doctype; salva il frammento senza scheletro`); continue; }
  const { head, body } = splitHead(src);
  const page = `<!doctype html>
<html lang="${esc(site.lang || "it")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${esc(d.description)}">
<meta name="explorables-version" content="${esc(d.version)}">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}
.xpl-home{position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:90;font:600 12px/1 ui-monospace,Menlo,Consolas,monospace;padding:8px 11px;border-radius:999px;text-decoration:none;color:#111;background:rgba(255,255,255,.88);border:1px solid rgba(0,0,0,.15);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
@media (prefers-color-scheme:dark){.xpl-home{color:#eee;background:rgba(20,20,20,.85);border-color:rgba(255,255,255,.18)}}
@media print{.xpl-home{display:none}}</style>
${head}</head>
<body>
${body}
<a class="xpl-home" href="../" title="Tutte le guide · versione ${esc(d.version)} del ${esc(fmtDate(d.updated))}">← ${esc(site.title)} · v${esc(d.version)}</a>
</body>
</html>
`;
  mkdirSync(join(DIST, d.slug), { recursive: true });
  writeFileSync(join(DIST, d.slug, "index.html"), page);
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }

// --- pagina iniziale ---
const sorted = [...docs].sort((a, b) => (b.updated || "").localeCompare(a.updated || "") || a.title.localeCompare(b.title));
const allTags = [...new Set(docs.flatMap((d) => d.tags || []))].sort((a, b) => a.localeCompare(b));
const tagKey = (t) => t.toLowerCase().replace(/\s+/g, "-");

const cards = sorted.map((d) => {
  const last = d.history?.[0];
  const hist = (d.history || []).map((h) => `<li><span>v${esc(h.version)} · ${esc(fmtDate(h.date))}</span>${esc(h.notes)}</li>`).join("");
  const text = [d.title, d.description, ...(d.tags || [])].join(" ").toLowerCase();
  return `<article class="card" data-tags="${esc((d.tags || []).map(tagKey).join(" "))}" data-text="${esc(text)}">
  <div class="tags">${(d.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
  <h2><a href="${esc(d.slug)}/">${esc(d.title)}</a></h2>
  <p>${esc(d.description)}</p>
  ${last ? `<div class="news"><b>Novità v${esc(last.version)}:</b> ${esc(last.notes)}</div>` : ""}
  ${(d.history || []).length > 1 ? `<details><summary>Cronologia delle versioni</summary><ol>${hist}</ol></details>` : ""}
  <div class="meta"><span>versione <b>${esc(d.version)}</b></span><span>aggiornata il ${esc(fmtDate(d.updated))}</span></div>
</article>`;
}).join("\n");

const chips = allTags.map((t) => `<button class="chip" aria-pressed="false" data-tag="${esc(tagKey(t))}">${esc(t)}</button>`).join("");
const latest = sorted[0]?.updated;
const tpl = readFileSync(join(ROOT, "templates", "index.html"), "utf8");
const fill = { LANG: site.lang || "it", TITLE: site.title, SUBTITLE: site.subtitle, AUTHOR: site.author || "", COUNT: String(docs.length), UPDATED: fmtDate(latest), BUILT: fmtDate(today), CHIPS: chips, CARDS: cards };
const index = tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in fill ? (["CHIPS", "CARDS"].includes(k) ? fill[k] : esc(fill[k])) : `{{${k}}}`));
writeFileSync(join(DIST, "index.html"), index);

// --- file di servizio ---
copyFileSync(join(ROOT, "CHANGELOG.md"), join(DIST, "CHANGELOG.md"));
writeFileSync(join(DIST, "docs.json"), JSON.stringify(manifest, null, 2));
writeFileSync(join(DIST, ".nojekyll"), "");

console.log(`Sito generato in dist/: ${docs.length} guide + pagina iniziale.`);
for (const d of sorted) console.log(`  /${d.slug}/  v${d.version}  (${d.updated})`);
