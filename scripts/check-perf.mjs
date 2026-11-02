// Weight budgets on the built site.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { OUT, htmlFiles, urlPathOf } from "./lib-out.mjs";

const KB = 1024;
const BUDGET = { html: 220 * KB, jsPerPageGzip: 200 * KB, image: 150 * KB, font: 60 * KB };
const errors = [];

for (const f of htmlFiles()) {
  const html = fs.readFileSync(f, "utf8");
  const size = Buffer.byteLength(html);
  if (size > BUDGET.html) errors.push(`${urlPathOf(f)}: HTML ${Math.round(size / KB)}KB > ${BUDGET.html / KB}KB`);
  const scripts = [...new Set([...html.matchAll(/<script[^>]+src="(\/_next\/[^"]+\.js)"/g)].map((m) => m[1]))];
  const js = scripts.reduce((n, s) => n + zlib.gzipSync(fs.readFileSync(path.join(OUT, s))).length, 0);
  if (js > BUDGET.jsPerPageGzip) errors.push(`${urlPathOf(f)}: JS ${Math.round(js / KB)}KB gzip > ${BUDGET.jsPerPageGzip / KB}KB`);
}
for (const dir of ["images", "fonts"]) {
  for (const f of fs.readdirSync(path.join(OUT, dir))) {
    const s = fs.statSync(path.join(OUT, dir, f)).size;
    const limit = dir === "fonts" ? BUDGET.font : BUDGET.image;
    if (s > limit) errors.push(`${dir}/${f}: ${Math.round(s / KB)}KB > ${limit / KB}KB`);
  }
}
const og = fs.statSync(path.join(OUT, "og.jpg")).size;
if (og > 200 * KB) errors.push(`og.jpg ${Math.round(og / KB)}KB`);

if (errors.length) {
  console.error(`Perf budget failed:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log("Perf budgets passed.");
