import { describe, expect, it } from "vitest";
import { gtagBootstrap, tagConfig } from "@/lib/analytics";

describe("Google tag config", () => {
  it("loads nothing without IDs", () => {
    expect(tagConfig({}).ids).toEqual([]);
  });
  it("uses the Ads tag and optional GA4 tag, rejecting junk", () => {
    const c = tagConfig({ NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-761452231", NEXT_PUBLIC_GA_ID: "G-ABC123XYZ" });
    expect(c.ids).toEqual(["AW-761452231", "G-ABC123XYZ"]);
    expect(tagConfig({ NEXT_PUBLIC_GOOGLE_ADS_ID: "aw-1');alert(1)//" }).ids).toEqual([]);
  });
  it("only accepts conversion labels when an Ads ID is set", () => {
    expect(tagConfig({ NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: "AbC-123_x" }).leadLabel).toBeUndefined();
    expect(tagConfig({ NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-761452231", NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: "AbC-123_x" }).leadLabel).toBe("AbC-123_x");
  });
  it("bootstrap configures every tag and tracks phone clicks", () => {
    const js = gtagBootstrap(tagConfig({ NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-761452231", NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL: "CallLbl1" }));
    expect(js).toContain(`gtag('config',"AW-761452231")`);
    expect(js).toContain("phone_call_click");
    expect(js).toContain(`send_to:"AW-761452231/CallLbl1"`);
    expect(() => new Function(js)).not.toThrow();
  });
});
