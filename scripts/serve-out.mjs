// Serves out/ like production: brotli/gzip for text, immutable caching for hashed assets and fonts,
// trailing-slash directories to index.html, and the real 404 page.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const args = process.argv.slice(2);
const port = Number(args[args.indexOf("--port") + 1]) || 4173;
const root = path.resolve("out");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "application/javascript", ".json": "application/json",
  ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".webmanifest": "application/manifest+json",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2",
};
const TEXT = new Set([".html", ".css", ".js", ".json", ".txt", ".xml", ".webmanifest", ".svg"]);

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p.includes("..")) return null;
  let f = path.join(root, p);
  if (p.endsWith("/")) f = path.join(f, "index.html");
  if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  if (!path.extname(p) && fs.existsSync(path.join(f, "index.html"))) return { redirect: `${p}/` };
  return null;
}

http
  .createServer((req, res) => {
    const r = resolveFile(req.url || "/");
    if (r && typeof r === "object") {
      res.writeHead(301, { Location: r.redirect });
      return res.end();
    }
    const file = r || path.join(root, "404.html");
    const status = r ? 200 : 404;
    const ext = path.extname(file);
    const headers = {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": /\/_next\/static\/|\/fonts\//.test(file) ? "public, max-age=31536000, immutable" : ext === ".html" ? "no-cache" : "public, max-age=604800",
    };
    let body = fs.readFileSync(file);
    const ae = String(req.headers["accept-encoding"] || "");
    if (TEXT.has(ext)) {
      if (ae.includes("br")) {
        body = zlib.brotliCompressSync(body);
        headers["Content-Encoding"] = "br";
      } else if (ae.includes("gzip")) {
        body = zlib.gzipSync(body);
        headers["Content-Encoding"] = "gzip";
      }
      headers["Vary"] = "Accept-Encoding";
    }
    res.writeHead(status, headers);
    res.end(req.method === "HEAD" ? undefined : body);
  })
  .listen(port, "127.0.0.1", () => console.log(`Serving out/ on http://127.0.0.1:${port}`));
