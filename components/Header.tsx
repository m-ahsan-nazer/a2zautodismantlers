import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-coal text-white shadow-md">
      <div className="hidden border-b border-white/10 bg-coal-800 text-sm md:block">
        <div className="container flex h-9 items-center justify-between">
          <p className="flex items-center gap-2 text-white/90">
            <Icon name="pin" className="h-4 w-4 fill-current text-amber" />
            {site.address.street}, {site.address.suburb}, {site.address.city}
          </p>
          <p className="text-white/90">Free removal across Christchurch and Canterbury</p>
        </div>
      </div>
      <div className="container flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href="/" className="shrink-0" aria-label={`${site.name} home`}>
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[0.95rem] font-semibold">
            {nav.map((item) =>
              item.children ? (
                <li key={item.label} className="group relative">
                  <Link href={item.href} className="flex items-center gap-1 rounded px-3 py-2 hover:text-amber">
                    {item.label}
                    <Icon name="caret" className="h-3.5 w-3.5 fill-current" />
                  </Link>
                  <ul className="invisible absolute left-0 top-full min-w-[13rem] rounded-md bg-white py-2 text-coal opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block px-4 py-2 hover:bg-paper hover:text-brand-dark">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.label}>
                  <Link href={item.href} className="rounded px-3 py-2 hover:text-amber">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.phone.href} className="btn-amber hidden sm:inline-flex">
            <Icon name="phone" />
            {site.phone.display}
          </a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
