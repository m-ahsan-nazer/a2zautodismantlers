/**
 * Single source of truth for business facts. Anything here is rendered on
 * every page and in structured data, so keep it accurate.
 */
export const site = {
  name: "A2Z Auto Dismantlers",
  legalName: "A2Z Auto Dismantlers Limited",
  shortName: "A2Z Auto",
  url: "https://www.a2zautodismantlers.nz",
  locale: "en-NZ",
  ogLocale: "en_NZ",
  tagline: "Car wreckers and auto dismantlers in Christchurch",
  description:
    "Christchurch car wreckers and auto dismantlers. We pay cash for cars, vans, utes, 4WDs and trucks in any condition, with free removal across Canterbury.",
  phone: {
    display: "0800 030 027",
    href: "tel:+64800030027",
    e164: "+64800030027",
  },
  email: "info@a2zautodismantlers.nz",
  address: {
    street: "122A Wainoni Road",
    suburb: "Avondale",
    city: "Christchurch",
    postcode: "8061",
    region: "Canterbury",
    country: "NZ",
  },
  geo: { lat: -43.5155, lng: 172.6905 },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=A2Z+Auto+Dismantlers+122A+Wainoni+Road+Christchurch",
  foundingYear: 2008,
  nzbn: "9429030335448",
  hours: [
    { days: "Monday to Friday", schema: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
    { days: "Saturday", schema: ["Saturday"], opens: "08:00", closes: "14:00" },
  ],
  closedDays: "Sunday",
  serviceRegions: ["Christchurch", "Selwyn District", "Waimakariri District", "Canterbury"],
  vehicleTypes: ["cars", "vans", "utes", "4WDs", "SUVs", "trucks"],
} as const;

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "We Buy",
    href: "/cash-for-cars/",
    children: [
      { label: "Cash for Cars", href: "/cash-for-cars/" },
      { label: "Cash for Trucks", href: "/cash-for-trucks/" },
      { label: "Cash for 4WDs", href: "/cash-for-4wds/" },
      { label: "Sell My Car", href: "/sell-my-car/" },
    ],
  },
  { label: "Scrap Car Removal", href: "/scrap-car-removal/" },
  { label: "Auto Dismantlers", href: "/auto-dismantlers-christchurch/" },
  { label: "Locations", href: "/locations/" },
  { label: "About", href: "/about-us/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact-us/" },
];

export const footerServices: NavItem[] = [
  { label: "Car Wreckers Christchurch", href: "/" },
  { label: "Auto Dismantlers", href: "/auto-dismantlers-christchurch/" },
  { label: "Cash for Cars", href: "/cash-for-cars/" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal/" },
  { label: "Cash for Trucks", href: "/cash-for-trucks/" },
  { label: "Cash for 4WDs", href: "/cash-for-4wds/" },
  { label: "Sell My Car", href: "/sell-my-car/" },
  { label: "Used Auto Parts", href: "/used-auto-parts/" },
];

export const footerCompany: NavItem[] = [
  { label: "About Us", href: "/about-us/" },
  { label: "Locations", href: "/locations/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact Us", href: "/contact-us/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
];

/** Formats "08:00" as "8am" / "17:00" as "5pm". */
export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${p}`;
}

export const fullAddress = `${site.address.street}, ${site.address.suburb}, ${site.address.city} ${site.address.postcode}`;
