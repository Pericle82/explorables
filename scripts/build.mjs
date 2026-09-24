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

// --- menu di navigazione tra le guide (iniettato in ogni pagina) ---
const NAV_CSS = `.xpl-nav{--xb:rgba(255,255,255,.94);--xi:#16191c;--xm:#5b6268;--xl:rgba(0,0,0,.14);--xa:#2f5d7c;--xs:#e3ecf2;position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:1000;font:14px/1.4 "IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--xi);display:flex;flex-direction:column;align-items:flex-start;gap:8px}
@media (prefers-color-scheme:dark){.xpl-nav{--xb:rgba(24,27,30,.95);--xi:#e7eaec;--xm:#9aa3aa;--xl:rgba(255,255,255,.16);--xa:#8dbcdc;--xs:#1f3140}}
:root[data-theme="light"] .xpl-nav{--xb:rgba(255,255,255,.94);--xi:#16191c;--xm:#5b6268;--xl:rgba(0,0,0,.14);--xa:#2f5d7c;--xs:#e3ecf2}
:root[data-theme="dark"] .xpl-nav{--xb:rgba(24,27,30,.95);--xi:#e7eaec;--xm:#9aa3aa;--xl:rgba(255,255,255,.16);--xa:#8dbcdc;--xs:#1f3140}
.xpl-btn{all:unset;box-sizing:border-box;cursor:pointer;font:600 12px/1 ui-monospace,"JetBrains Mono",Menlo,Consolas,monospace;padding:9px 12px;border-radius:999px;background:var(--xb);color:var(--xi);border:1px solid var(--xl);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 4px 16px -8px rgba(0,0,0,.4)}
.xpl-btn small{color:var(--xm);font-weight:400;margin-left:4px}
.xpl-btn:focus-visible,.xpl-panel a:focus-visible{outline:2px solid var(--xa);outline-offset:2px}
.xpl-panel{width:min(330px,calc(100vw - 24px));max-height:min(70vh,520px);overflow:auto;background:var(--xb);border:1px solid var(--xl);border-radius:12px;padding:12px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 12px 32px -12px rgba(0,0,0,.45)}
.xpl-panel a{color:var(--xi);text-decoration:none}
.xpl-all{display:block;font-weight:600;padding:6px 8px;border-radius:6px}
.xpl-all:hover,.xpl-panel li a:hover,.xpl-pn a:hover{background:var(--xs)}
.xpl-h{margin:10px 8px 4px;font:600 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--xm)}
.xpl-panel ul{list-style:none;margin:0;padding:0}
.xpl-panel li a{display:flex;justify-content:space-between;gap:10px;align-items:baseline;padding:7px 8px;border-radius:6px}
.xpl-panel li a small{font:11px/1 ui-monospace,Menlo,monospace;color:var(--xm);flex-shrink:0}
.xpl-panel li a[aria-current="page"]{background:var(--xs);box-shadow:inset 3px 0 0 var(--xa);font-weight:600}
.xpl-pn{display:flex;justify-content:space-between;gap:8px;margin-top:8px;padding-top:8px;border-top:1px solid var(--xl)}
.xpl-pn a{font-size:13px;padding:6px 8px;border-radius:6px;color:var(--xa)!important}
.xpl-v{margin:8px 8px 0;font-size:12px;color:var(--xm)}
@media print{.xpl-nav{display:none}}`;
const NAV_JS = `(function(){var n=document.querySelector(".xpl-nav"),b=n.querySelector(".xpl-btn"),p=n.querySelector(".xpl-panel");
function set(o){p.hidden=!o;b.setAttribute("aria-expanded",o?"true":"false");if(o){var c=p.querySelector("[aria-current]")||p.querySelector("a");c&&c.focus();}}
b.addEventListener("click",function(){set(p.hidden);});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!p.hidden){set(false);b.focus();}});
document.addEventListener("click",function(e){if(!p.hidden&&!n.contains(e.target))set(false);});})();`;

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
  const i = docs.indexOf(d);
  const prev = docs[(i - 1 + docs.length) % docs.length], next = docs[(i + 1) % docs.length];
  const items = docs.map((x) => `<li><a href="../${esc(x.slug)}/"${x === d ? ' aria-current="page"' : ""}><span>${esc(x.title)}</span><small>v${esc(x.version)}</small></a></li>`).join("");
  const nav = `<nav class="xpl-nav" aria-label="Navigazione tra le guide">
<div class="xpl-panel" id="xpl-panel" hidden>
  <a class="xpl-all" href="../">← Tutte le guide</a>
  <p class="xpl-h">Guide</p>
  <ul>${items}</ul>
  ${docs.length > 1 ? `<div class="xpl-pn"><a href="../${esc(prev.slug)}/" title="${esc(prev.title)}">← Precedente</a><a href="../${esc(next.slug)}/" title="${esc(next.title)}">Successiva →</a></div>` : ""}
  <p class="xpl-v">Questa guida: versione ${esc(d.version)} del ${esc(fmtDate(d.updated))}</p>
</div>
<button class="xpl-btn" type="button" aria-expanded="false" aria-controls="xpl-panel"><span aria-hidden="true">☰</span> ${esc(site.title)} <small>v${esc(d.version)}</small></button>
</nav>`;
  const page = `<!doctype html>
<html lang="${esc(site.lang || "it")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${esc(d.description)}">
<meta name="explorables-version" content="${esc(d.version)}">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}
${NAV_CSS}</style>
${head}</head>
<body>
${body}
${nav}
<script>${NAV_JS}</script>
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
