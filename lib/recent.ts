import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** One anonymised vehicle we bought. Never store names, contact details, plates or street addresses here. */
export type RecentCase = {
  vehicle: string;
  year?: string;
  type: "car" | "van" | "ute" | "suv" | "truck" | "4wd";
  /** Broad area only (e.g. "East Christchurch"), never a street or suburb plus details. */
  area: string;
  problem: string;
  reason: string;
  month: string; // YYYY-MM
};

export function getRecent(): RecentCase[] {
  const file = path.join(process.cwd(), "content", "recently-bought.md");
  if (!fs.existsSync(file)) return [];
  const { data } = matter(fs.readFileSync(file, "utf8"));
  const items = (Array.isArray(data.items) ? data.items : []) as RecentCase[];
  return [...items].sort((a, b) => b.month.localeCompare(a.month));
}

export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-NZ", { month: "long", year: "numeric", timeZone: "UTC" });
}
