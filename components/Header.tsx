import Link from "next/link";
import { site } from "@/lib/site";
import { NavMenu } from "./NavMenu";

export function Header() {
  return (
    <header className="relative z-40 bg-white">
      <div className="container flex h-[72px] items-center justify-between gap-4 md:h-[84px]">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
          <img src="/images/logo-96.webp" width={40} height={40} alt="" className="h-10 w-10" />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-heading text-[22px] font-bold text-accent-dark">{site.name}</span>
            <span className="text-sm font-bold text-accent-dark">{site.tagline}</span>
          </span>
        </Link>
        <NavMenu />
      </div>
    </header>
  );
}
