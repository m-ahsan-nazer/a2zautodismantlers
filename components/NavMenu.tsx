"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";
import { Icon } from "./Icon";

export function NavMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  // The root layout stays mounted across client navigation, so close on route change.
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
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkCls = (href: string) =>
    `block font-heading text-[15px] font-semibold uppercase ${isCurrent(href) ? "text-accent-dark" : "text-body hover:text-accent-dark"}`;

  return (
    <>
      <nav aria-label="Main" className="hidden lg:block">
        <ul className="flex items-center">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className={`${linkCls(n.href)} px-4 py-3`} aria-current={isCurrent(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        ref={btn}
        type="button"
        className="grid h-12 w-12 place-items-center text-body lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "menu"} className="h-6 w-6 fill-current" />
        <span className="sr-only">Menu</span>
      </button>
      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full border-t border-line bg-white shadow-card lg:hidden ${open ? "" : "hidden"}`}
        inert={!open}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="container divide-y divide-line">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={`${linkCls(n.href)} py-3.5`} aria-current={isCurrent(n.href) ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
