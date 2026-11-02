import type { RecentCase } from "@/lib/recent";
import { formatMonth } from "@/lib/recent";
import { Icon } from "./Icon";
import type { IconName } from "./icon-paths";

const TYPE_ICON: Record<RecentCase["type"], IconName> = { car: "car", suv: "car", "4wd": "truck", ute: "truck", truck: "truck", van: "van" };

export function RecentCards({ items, headingLevel = 3 }: { items: RecentCase[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <li key={`${c.month}-${c.vehicle}-${c.area}`} className="flex flex-col rounded-md border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky text-accent-dark">
              <Icon name={TYPE_ICON[c.type]} className="h-6 w-6 fill-current" />
            </span>
            <div className="leading-tight">
              <H className="text-base">
                {c.year ? `${c.year} ` : ""}
                {c.vehicle}
              </H>
              <p className="text-sm">
                {c.area} · {formatMonth(c.month)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[15px]">
            <strong className="text-navy">Condition:</strong> {c.problem}
          </p>
          <p className="mt-1 text-[15px]">
            <strong className="text-navy">Why they sold:</strong> {c.reason}
          </p>
        </li>
      ))}
    </ul>
  );
}
