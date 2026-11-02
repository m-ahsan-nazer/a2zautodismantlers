import { site } from "@/lib/site";
import { Icon } from "./Icon";
import { RatingStars } from "./RatingStars";
import type { IconName } from "./icon-paths";

const FLEET: { icon: IconName; label: string }[] = [
  { icon: "carSide", label: "Cars" },
  { icon: "vanFill", label: "Vans" },
  { icon: "truck", label: "Utes" },
  { icon: "truckTrailer", label: "Trucks" },
];

/** Proof cards that overlap the bottom of the owner photo on the homepage. */
export function StatCards() {
  return (
    <ul className="relative z-10 -mt-12 grid grid-cols-2 gap-3 px-2 md:-mt-16 md:gap-5 md:px-6">
      <li className="group min-w-0 rounded-xl border-b-4 border-[#fbbc04] bg-white p-4 shadow-[0_18px_40px_-12px_rgba(0,36,72,0.35)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 md:p-6">
        <div className="flex items-start justify-between gap-2">
          <span className="font-heading text-[30px] font-bold leading-none text-navy md:text-[42px]">{site.googleRating.value.toFixed(1)}</span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#4285f4]/10 md:h-11 md:w-11">
            <Icon name="google" className="h-5 w-5 fill-current text-[#4285f4] md:h-6 md:w-6" />
          </span>
        </div>
        <span className="mt-2 block">
          <RatingStars value={site.googleRating.value} />
        </span>
        <p className="mt-2 font-heading text-[15px] font-bold leading-tight text-navy md:text-lg">{site.googleRating.countLabel} Google reviews</p>
        <a
          href={site.googleReviewsUrl}
          rel="noopener"
          target="_blank"
          className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-accent-deep hover:underline"
        >
          Read reviews
          <Icon name="caretRight" className="h-3 w-3 fill-current transition group-hover:translate-x-0.5" />
        </a>
      </li>
      <li className="group relative min-w-0 overflow-hidden rounded-xl border-b-4 border-orange bg-[linear-gradient(160deg,#ffffff_0%,#edf5ff_70%)] p-4 text-navy shadow-[0_18px_40px_-12px_rgba(0,36,72,0.35)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 md:p-6">
        <Icon name="truckTrailer" className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 fill-current text-accent/[0.08] md:h-36 md:w-36" />
        <span className="relative font-heading text-[30px] font-bold leading-none md:text-[42px]">
          10,000<span className="text-orange">+</span>
        </span>
        <p className="relative mt-2 font-heading text-[15px] font-bold leading-tight md:text-lg">Vehicles bought</p>
        <ul className="relative mt-3 flex gap-1.5 md:gap-2">
          {FLEET.map((f) => (
            <li key={f.label} title={f.label} className="grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm ring-1 ring-accent/20 md:h-9 md:w-9">
              <Icon name={f.icon} className="h-4 w-4 fill-current text-orange md:h-5 md:w-5" />
              <span className="sr-only">{f.label}</span>
            </li>
          ))}
        </ul>
        <p className="relative mt-2 text-xs text-body md:text-sm">Cars, vans, utes &amp; trucks</p>
      </li>
    </ul>
  );
}
