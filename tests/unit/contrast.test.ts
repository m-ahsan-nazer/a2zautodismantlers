import { describe, expect, it } from "vitest";
import config from "../../tailwind.config";

const c = config.theme!.extend!.colors as Record<string, string | Record<string, string>>;
const col = (k: string, v = "DEFAULT") => (typeof c[k] === "string" ? (c[k] as string) : (c[k] as Record<string, string>)[v]);

function lum(hex: string) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const WHITE = "#ffffff";
const pairs: [string, string, string][] = [
  ["body text on white", col("body"), WHITE],
  ["body text on sky", col("body"), col("sky")],
  ["navy on sky", col("navy"), col("sky")],
  ["eyebrow (accent deep) on sky", col("accent", "deep"), col("sky")],
  ["accent dark on sky", col("accent", "dark"), col("sky")],
  ["accent dark on white", col("accent", "dark"), WHITE],
  ["white on orange button", WHITE, col("orange")],
  ["white on blue button", WHITE, col("accent", "dark")],
  ["white on submit button", WHITE, col("submit")],
  ["orange-dark error text on white", col("orange", "dark"), WHITE],
  ["placeholder on field", "#5f6773", col("field")],
];

describe("colour contrast (WCAG AA 4.5:1)", () => {
  it.each(pairs)("%s", (_n, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
