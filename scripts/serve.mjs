// Anteprima locale del sito generato.  Uso: node scripts/serve.mjs  →  http://localhost:4173
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const TYPES = { ".html": "text/html; charset=utf-8", ".json": "application/json", ".md": "text/markdown; charset=utf-8", ".css": "text/css", ".js": "text/javascript" };
const port = Number(process.env.PORT) || 4173;

createServer(async (req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(DIST, p);
  try { if ((await stat(file)).isDirectory()) file = join(file, "index.html"); } catch {}
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Non trovato. Hai eseguito node scripts/build.mjs?");
  }
}).listen(port, () => console.log(`Anteprima su http://localhost:${port}`));
