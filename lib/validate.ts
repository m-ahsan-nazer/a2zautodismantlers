export type QuoteInput = {
  name: string;
  phone: string;
  email: string;
  suburb: string;
  vehicle: string;
  year: string;
  condition: string;
  message: string;
  /** Honeypot: real people leave this empty. */
  company: string;
};

export type QuoteErrors = Partial<Record<keyof QuoteInput, string>>;

export const CONDITIONS = ["Running", "Not running", "Damaged or written off", "Unsure"] as const;

const NZ_PHONE = /^(\+?64|0)[2-9]\d{6,9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalisePhone(raw: string): string {
  return raw.replace(/[\s()-]/g, "");
}

export function validateQuote(input: QuoteInput): QuoteErrors {
  const e: QuoteErrors = {};
  const name = input.name.trim();
  if (name.length < 2) e.name = "Please enter your name.";
  else if (name.length > 80) e.name = "Please shorten your name.";

  const phone = normalisePhone(input.phone);
  if (!phone) e.phone = "Please enter a phone number so we can call with your quote.";
  else if (!NZ_PHONE.test(phone)) e.phone = "Please enter a valid New Zealand phone number.";

  const email = input.email.trim();
  if (email && !EMAIL.test(email)) e.email = "Please enter a valid email address, or leave it blank.";

  if (input.vehicle.trim().length < 2) e.vehicle = "Please tell us the make and model.";
  else if (input.vehicle.length > 120) e.vehicle = "Please shorten the vehicle description.";

  const year = input.year.trim();
  if (year) {
    const n = Number(year);
    const max = new Date().getFullYear() + 1;
    if (!/^\d{4}$/.test(year) || n < 1950 || n > max) e.year = "Please enter a four digit year.";
  }

  if (input.condition && !(CONDITIONS as readonly string[]).includes(input.condition)) {
    e.condition = "Please choose a condition from the list.";
  }
  if (input.suburb.length > 80) e.suburb = "Please shorten the suburb.";
  if (input.message.length > 2000) e.message = "Please keep your message under 2000 characters.";
  return e;
}

export function isSpam(input: QuoteInput): boolean {
  return input.company.trim().length > 0;
}
