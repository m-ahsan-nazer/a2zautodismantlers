/**
 * Single source of truth for business facts. Everything here is copied from the
 * live WordPress site (a2zautodismantlers.nz) and rendered on every page and in
 * structured data, so keep it accurate.
 */
export const site = {
  name: "A2Z Auto Dismantlers",
  legalName: "A2Z Auto Dismantlers Limited",
  tagline: "We Buy Wrecked Cars",
  url: "https://www.a2zautodismantlers.nz",
  locale: "en-NZ",
  ogLocale: "en_NZ",
  description:
    "A2Z Auto Dismantlers has over 15 years of experience in auto dismantling and operates as a licensed second-hand car dealer in Christchurch.",
  phone: {
    display: "0800 0300 27",
    href: "tel:+64800030027",
    e164: "+64800030027",
  },
  address: {
    street: "122A Wainoni Road",
    suburb: "Avondale",
    city: "Christchurch",
    postcode: "8061",
    region: "Canterbury",
    country: "NZ",
  },
  foundingYear: 2008,
  nzbn: "9429030335448",
} as const;

export const fullAddress = `${site.address.street}, ${site.address.suburb}, ${site.address.city} ${site.address.postcode}`;

export type NavItem = { label: string; href: string };

/** Main menu, same order as the WordPress site. */
export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Cash For Cars", href: "/cash-for-cars/" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal/" },
  { label: "Sell My Car", href: "/sell-my-car/" },
  { label: "Contact Us", href: "/contact-us/" },
];

/** Footer menu columns, same as the WordPress site. */
export const footerColumns: { title: string; href: string; links: NavItem[] }[] = [
  {
    title: "Cash Now Service",
    href: "/cash-for-cars/",
    links: [
      { label: "Cash For Cars", href: "/cash-for-cars/" },
      { label: "Cash For Trucks", href: "/cash-for-cars/#cash-for-trucks" },
      { label: "Cash For Vans", href: "/cash-for-cars/#cash-for-vans" },
    ],
  },
  {
    title: "Scrap Car Removal Service",
    href: "/scrap-car-removal/",
    links: [
      { label: "Scrap Car Removal", href: "/scrap-car-removal/" },
      { label: "Scrap Truck Removal", href: "/scrap-car-removal/#scrap-truck" },
      { label: "Scrap Van Removal", href: "/scrap-car-removal/#scrap-van" },
    ],
  },
  {
    title: "Sell My Car Service",
    href: "/sell-my-car/",
    links: [
      { label: "Sell My Car", href: "/sell-my-car/" },
      { label: "Sell Vehicle Fast", href: "/sell-my-car/#sell-car-fast" },
    ],
  },
  {
    title: "About Us",
    href: "/about-us/",
    links: [
      { label: "Contact Us", href: "/contact-us/" },
      { label: "Blog", href: "/blog/" },
      { label: "Privacy Policy", href: "/privacy-policy/" },
    ],
  },
];

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${p}`;
}
