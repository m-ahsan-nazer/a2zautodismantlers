import Link from "next/link";
import { footerColumns, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-white text-[15px]">
      <div className="container grid gap-10 py-12 md:grid-cols-[1fr_2fr] md:gap-0 md:py-14">
        <div className="flex flex-col justify-between gap-8 md:border-r md:border-line md:pr-10">
          <div>
            <p className="font-bold text-accent-dark">General Enquiries</p>
            <a href={site.phone.href} className="text-lg text-navy hover:text-accent-dark">
              {site.phone.display}
            </a>
          </div>
          <p className="text-sm">
            &copy; {year} {site.name}.{" "}
            <Link href="/" className="underline-offset-2 hover:underline">
              Christchurch car wreckers
            </Link>{" "}
            and auto dismantlers.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:pl-10">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <Link href={col.href} className="font-bold text-navy hover:text-accent-dark">
                {col.title}
              </Link>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-navy hover:text-accent-dark hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
