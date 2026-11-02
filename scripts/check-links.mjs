// Every internal link, anchor and asset in out/ must resolve.
import fs from "node:fs";
import path from "node:path";
import { OUT, htmlFiles, urlPathOf } from "./lib-out.mjs";

const ASSET_EXT = /\.(webp|png|jpg|jpeg|svg|ico|woff2|css|js|json|txt|xml|webmanifest|pdf)$/i;
const files = htmlFiles();
const idsByPath = new Map();
for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  idsByPath.set(urlPathOf(f), new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const errors = [];
for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  const from = urlPathOf(f);
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g), ...html.matchAll(/\ssrcSet="([^"]+)"|\ssrcset="([^"]+)"/g)]
    .flatMap((m) => (m[0].toLowerCase().includes("srcset") ? (m[1] || m[2]).split(",").map((s) => s.trim().split(" ")[0]) : [m[1]]));
  for (let ref of refs) {
    if (!ref || /^(https?:|mailto:|tel:|data:|\/\/)/.test(ref)) continue;
    ref = ref.replace(/&amp;/g, "&");
    let [p, hash] = ref.split("#");
    if (!p) {
      if (hash && !idsByPath.get(from).has(hash)) errors.push(`${from}: missing anchor #${hash}`);
      continue;
    }
    p = p.split("?")[0];
    if (!p.startsWith("/")) p = path.posix.join(from, p);
    if (ASSET_EXT.test(p)) {
      if (!fs.existsSync(path.join(OUT, p))) errors.push(`${from}: missing asset ${p}`);
      continue;
    }
    if (!p.endsWith("/")) {
      errors.push(`${from}: link without trailing slash ${p}`);
      continue;
    }
    if (!idsByPath.has(p)) {
      errors.push(`${from}: broken link ${p}`);
      continue;
    }
    if (hash && !idsByPath.get(p).has(hash)) errors.push(`${from}: missing anchor ${p}#${hash}`);
  }
}

if (errors.length) {
  console.error(`Link check failed (${errors.length}):\n  ${[...new Set(errors)].join("\n  ")}`);
  process.exit(1);
}
console.log(`Link check passed: ${files.length} pages.`);
