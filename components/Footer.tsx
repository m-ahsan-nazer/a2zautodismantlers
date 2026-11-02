import Link from "next/link";
import { footerCompany, footerServices, formatTime, fullAddress, site } from "@/lib/site";
import { getLocations } from "@/lib/content";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Footer() {
  const locations = getLocations();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-coal pb-24 text-white/90 md:pb-0">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-white" />
          <p className="mt-4 text-sm leading-relaxed">
            Christchurch car wreckers and auto dismantlers since {site.foundingYear}. Licensed second-hand dealer. We buy cars, vans,
            utes, 4WDs and trucks in any condition.
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={site.phone.href} className="flex items-center gap-2 font-semibold text-amber hover:underline">
                <Icon name="phone" className="h-4 w-4 fill-current" />
                {site.phone.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:underline">
                <Icon name="envelope" className="h-4 w-4 fill-current" />
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.mapsUrl} className="flex items-start gap-2 hover:underline" rel="noopener" target="_blank">
                <Icon name="pin" className="mt-0.5 h-4 w-4 fill-current" />
                {fullAddress}
              </a>
            </li>
          </ul>
        </div>
        <FooterList title="Services" items={footerServices} />
        <FooterList title="Areas we cover" items={[{ label: "All locations", href: "/locations/" }, ...locations.map((l) => ({ label: l.name, href: l.path }))]} />
        <div>
          <FooterList title="Company" items={footerCompany} />
          <h2 className="mb-3 mt-8 font-display text-xl text-white">Opening hours</h2>
          <dl className="space-y-1 text-sm">
            {site.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4">
                <dt>{h.days}</dt>
                <dd>
                  {formatTime(h.opens)} to {formatTime(h.closes)}
                </dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt>{site.closedDays}</dt>
              <dd>Closed</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.legalName}. NZBN {site.nzbn}.
          </p>
          <p>Car wreckers, auto dismantlers and vehicle recyclers in Christchurch, NZ.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="mb-3 font-display text-xl text-white">{title}</h2>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.href + i.label}>
            <Link href={i.href} className="hover:text-amber hover:underline">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
