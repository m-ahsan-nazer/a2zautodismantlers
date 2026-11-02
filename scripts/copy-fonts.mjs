// Copies self-hosted woff2 fonts from @fontsource packages into public/fonts.
import fs from "node:fs";
import path from "node:path";

const files = [
  ["@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", "inter-latin.woff2"],
  ["@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2", "barlow-condensed-700-latin.woff2"],
];
fs.mkdirSync("public/fonts", { recursive: true });
for (const [src, dest] of files) {
  fs.copyFileSync(path.join("node_modules", src), path.join("public/fonts", dest));
  console.log("copied", dest);
}
