// Runs Lighthouse on every sitemap URL against out/ served like production.
// Usage: npm run test:lighthouse [-- --desktop] [-- --sample]
import { spawn } from "node:child_process";
import fs from "node:fs";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "playwright";

const desktop = process.argv.includes("--desktop");
const sample = process.argv.includes("--sample");
const PORT = 4321;
const SITE = "https://www.a2zautodismantlers.nz";
const MIN = { performance: desktop ? 95 : 90, accessibility: 100, "best-practices": 100, seo: 100 };

const xml = fs.readFileSync("out/sitemap.xml", "utf8");
let paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ""));
if (sample) paths = paths.filter((p) => ["/", "/cash-for-cars/", "/about-us/", "/blog/"].includes(p) || /2026\/09/.test(p));

const server = spawn("node", ["scripts/serve-out.mjs", "--port", String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new", "--no-sandbox"] });

const failures = [];
try {
  for (const p of paths) {
    const { lhr } = await lighthouse(`http://127.0.0.1:${PORT}${p}`, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: Object.keys(MIN),
      ...(desktop ? { formFactor: "desktop", screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } : {}),
    });
    const scores = Object.fromEntries(Object.keys(MIN).map((k) => [k, Math.round((lhr.categories[k].score ?? 0) * 100)]));
    const bad = Object.entries(scores).filter(([k, v]) => v < MIN[k]);
    // HTTPS is the only best-practice/SEO audit a local http server can't pass; Amplify serves HTTPS.
    console.log(`${bad.length ? "FAIL" : "ok  "} ${p.padEnd(62)} ${Object.values(scores).join(" / ")}  LCP ${Math.round(lhr.audits["largest-contentful-paint"].numericValue)}ms`);
    if (bad.length) {
      failures.push(p);
      for (const [cat] of bad) {
        for (const ref of lhr.categories[cat].auditRefs) {
          const a = lhr.audits[ref.id];
          if (ref.weight > 0 && a.score !== null && a.score < 0.9) console.log(`       ${cat}: ${a.id} (${a.displayValue ?? a.score})`);
        }
      }
    }
  }
} finally {
  await chrome.kill();
  server.kill();
}
if (failures.length) {
  console.error(`\nLighthouse below target on ${failures.length} page(s).`);
  process.exit(1);
}
console.log(`\nAll ${paths.length} pages meet perf ${MIN.performance}+ and 100 a11y / best practices / SEO (${desktop ? "desktop" : "mobile"}).`);
