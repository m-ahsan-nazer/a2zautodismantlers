/** Fields match the Contact Form 7 form on the WordPress site. */
export type QuoteInput = {
  phone: string;
  plate: string;
  address: string;
  email: string;
  message: string;
  /** Honeypot: real people leave this empty. */
  company: string;
};

export type QuoteErrors = Partial<Record<keyof QuoteInput, string>>;

export const EMPTY_QUOTE: QuoteInput = { phone: "", plate: "", address: "", email: "", message: "", company: "" };

const NZ_PHONE = /^(\+?64|0)[2-9]\d{6,9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PLATE = /^[A-Z0-9]{1,6}$/;

export function normalisePhone(raw: string): string {
  return raw.replace(/[\s().-]/g, "");
}

export function normalisePlate(raw: string): string {
  return raw.replace(/[\s-]/g, "").toUpperCase();
}

export function validateQuote(input: QuoteInput): QuoteErrors {
  const e: QuoteErrors = {};

  const phone = normalisePhone(input.phone);
  if (!phone) e.phone = "Please enter your contact number.";
  else if (!NZ_PHONE.test(phone)) e.phone = "Please enter a valid New Zealand phone number.";

  const plate = normalisePlate(input.plate);
  if (plate && !PLATE.test(plate)) e.plate = "Please enter a valid licence plate (up to 6 letters and numbers).";

  if (input.address.length > 200) e.address = "Please shorten the address.";

  const email = input.email.trim();
  if (email && !EMAIL.test(email)) e.email = "Please enter a valid email address, or leave it blank.";

  if (input.message.length > 2000) e.message = "Please keep your message under 2000 characters.";
  return e;
}

export function isSpam(input: QuoteInput): boolean {
  return input.company.trim().length > 0;
}
