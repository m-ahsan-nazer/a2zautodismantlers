// Copies self-hosted woff2 fonts (latin subset) from @fontsource packages into public/fonts.
import fs from "node:fs";
import path from "node:path";

const files = [
  ["@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2", "nunito-latin.woff2"],
  ["@fontsource/poppins/files/poppins-latin-600-normal.woff2", "poppins-600-latin.woff2"],
  ["@fontsource/poppins/files/poppins-latin-700-normal.woff2", "poppins-700-latin.woff2"],
];
fs.mkdirSync("public/fonts", { recursive: true });
for (const [src, dest] of files) {
  fs.copyFileSync(path.join("node_modules", src), path.join("public/fonts", dest));
  console.log("copied", dest);
}
