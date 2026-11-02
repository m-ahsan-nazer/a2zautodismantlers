import { Icon } from "./Icon";

/** Five gold stars filled to the exact rating (e.g. 4.2 fills 84%). */
export function RatingStars({ value, className = "h-4 w-4 md:h-5 md:w-5" }: { value: number; className?: string }) {
  const stars = [0, 1, 2, 3, 4].map((i) => (
    <Icon key={i} name="starFill" className={`${className} shrink-0 fill-current`} />
  ));
  return (
    <span className="relative inline-flex" role="img" aria-label={`Rated ${value} out of 5 on Google`}>
      <span className="flex gap-0.5 text-[#fbbc04]/25">{stars}</span>
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${(value / 5) * 100}%` }}>
        <span className="flex w-max gap-0.5 text-[#fbbc04]">{stars}</span>
      </span>
    </span>
  );
}
