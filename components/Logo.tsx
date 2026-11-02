import { site } from "@/lib/site";

/** Wordmark. Replace with the real logo artwork when available. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-10 w-10 place-items-center rounded-md bg-brand font-display text-xl leading-none text-white" aria-hidden="true">
        A2Z
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl uppercase tracking-wide">A2Z Auto</span>
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] opacity-90">Dismantlers</span>
      </span>
      <span className="sr-only">{site.name}</span>
    </span>
  );
}
