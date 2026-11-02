// Renders public/og.jpg (1200x630) with Playwright from the logo and a yard photo.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const b64 = (p) => fs.readFileSync(p).toString("base64");
const photo = `data:image/webp;base64,${b64("public/images/yard-banner-1280.webp")}`;
const logo = `data:image/png;base64,${b64("public/logo-512.png")}`;
const font = (f) => `data:font/woff2;base64,${b64(path.join("public/fonts", f))}`;

const html = `<!doctype html><html><head><style>
@font-face{font-family:P;font-weight:700;src:url(${font("poppins-700-latin.woff2")})}
@font-face{font-family:N;font-weight:200 1000;src:url(${font("nunito-latin.woff2")})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;position:relative;font-family:N;color:#fff;overflow:hidden}
.bg{position:absolute;inset:0;background:url(${photo}) center/cover}
.ov{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,36,72,.95) 0%,rgba(0,36,72,.82) 55%,rgba(0,36,72,.35) 100%)}
.c{position:absolute;left:72px;top:70px;right:72px}
.brand{display:flex;align-items:center;gap:22px}
.brand img{width:104px;height:104px}
.name{font-family:P;font-weight:700;font-size:44px;line-height:1.1}
.tag{font-size:26px;font-weight:700;color:#9cc7f5}
h1{font-family:P;font-weight:700;font-size:70px;line-height:1.08;margin-top:58px;max-width:860px}
.sub{font-size:30px;margin-top:22px;font-weight:600;color:#e6f0ff}
.ph{position:absolute;left:72px;bottom:56px;display:inline-block;background:#cb4a1f;font-family:P;font-weight:700;font-size:38px;padding:12px 28px;border-radius:6px}
</style></head><body><div class="bg"></div><div class="ov"></div>
<div class="c"><div class="brand"><img src="${logo}"><div><div class="name">A2Z Auto Dismantlers</div><div class="tag">We Buy Wrecked Cars</div></div></div>
<h1>Christchurch Car Wreckers</h1><div class="sub">Cash for cars · Free removal · Same-day payment</div></div>
<div class="ph">0800 0300 27</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og.jpg", type: "jpeg", quality: 82 });
await browser.close();
console.log("wrote public/og.jpg", fs.statSync("public/og.jpg").size, "bytes");
