import { describe, expect, it } from "vitest";
import { EMPTY_QUOTE, isSpam, normalisePhone, normalisePlate, validateQuote } from "@/lib/validate";

const ok = { ...EMPTY_QUOTE, phone: "021 123 4567" };

describe("validateQuote", () => {
  it("accepts a phone number on its own", () => {
    expect(validateQuote(ok)).toEqual({});
  });
  it("requires a phone number", () => {
    expect(validateQuote(EMPTY_QUOTE).phone).toBeTruthy();
  });
  it.each(["0800 030 027", "+64 21 555 1234", "(03) 389 1234", "027-555-1234"])("accepts NZ phone %s", (phone) => {
    expect(validateQuote({ ...ok, phone }).phone).toBeUndefined();
  });
  it.each(["12345", "abc", "+1 415 555 0100"])("rejects bad phone %s", (phone) => {
    expect(validateQuote({ ...ok, phone }).phone).toBeTruthy();
  });
  it("validates optional email", () => {
    expect(validateQuote({ ...ok, email: "not-an-email" }).email).toBeTruthy();
    expect(validateQuote({ ...ok, email: "a@b.co.nz" }).email).toBeUndefined();
  });
  it("validates optional licence plate", () => {
    expect(validateQuote({ ...ok, plate: "abc 123" }).plate).toBeUndefined();
    expect(validateQuote({ ...ok, plate: "TOOLONG1" }).plate).toBeTruthy();
  });
  it("limits message length", () => {
    expect(validateQuote({ ...ok, message: "x".repeat(2001) }).message).toBeTruthy();
  });
  it("normalises input", () => {
    expect(normalisePhone("(03) 389-1234")).toBe("033891234");
    expect(normalisePlate("abc 123")).toBe("ABC123");
  });
  it("flags the honeypot", () => {
    expect(isSpam({ ...ok, company: "spam co" })).toBe(true);
    expect(isSpam(ok)).toBe(false);
  });
});
