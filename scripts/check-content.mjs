// Fast content checks that run before every build (also in Amplify's build).
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const errors = [];
const err = (f, m) => errors.push(`${f}: ${m}`);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
}

for (const file of walk("content").filter((f) => f.endsWith(".md"))) {
  const raw = fs.readFileSync(file, "utf8");
  let parsed;
  try {
    parsed = matter(raw);
  } catch (e) {
    err(file, `invalid frontmatter: ${e.message}`);
    continue;
  }
  const { data } = parsed;
  if (raw.includes("—")) err(file, "contains an em dash");
  if (/wp-content|3\.105\.201\.141|User's blog/.test(raw)) err(file, "contains WordPress leftovers");
  if (!file.endsWith("recently-bought.md")) {
    if (!data.title) err(file, "missing title");
    if (!data.description) err(file, "missing description");
    else if (data.description.length < 110 || data.description.length > 155) err(file, `description is ${data.description.length} chars (110-155)`);
  }
  // Every /images/ reference must exist.
  for (const m of raw.matchAll(/\/images\/[\w./-]+\.(webp|png|jpg)/g)) {
    if (!fs.existsSync(path.join("public", m[0]))) err(file, `missing image ${m[0]}`);
  }
  if (file.includes(`${path.sep}blog${path.sep}`)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date))) err(file, "bad date");
    if (!data.image || !data.thumb) err(file, "missing image/thumb");
  }
}

if (errors.length) {
  console.error(`Content check failed:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log("Content check passed.");
