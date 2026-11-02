"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import { Icon } from "./Icon";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = nav.flatMap((n) => (n.children ? n.children : [n]));

  return (
    <div className="lg:hidden">
      <button
        ref={btn}
        type="button"
        className="grid h-12 w-12 place-items-center rounded-md hover:bg-white/10"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "menu"} className="h-7 w-7 fill-current" />
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-coal px-4 pb-10 pt-4 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        inert={!open}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="divide-y divide-white/10 text-lg font-semibold">
            {links.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} className="block py-3.5 hover:text-amber" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a href={site.phone.href} className="btn-amber mt-6 w-full text-lg">
          <Icon name="phone" />
          Call {site.phone.display}
        </a>
      </div>
    </div>
  );
}
