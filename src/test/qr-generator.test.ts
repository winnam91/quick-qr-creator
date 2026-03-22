import { describe, it, expect } from "vitest";
import { validateUrl } from "@/lib/qr-validation";
import { DEFAULT_SETTINGS } from "@/lib/qr-defaults";

describe("URL validation", () => {
  it("rejects empty string", () => {
    const result = validateUrl("");
    expect(result.valid).toBe(false);
  });

  it("rejects invalid URL", () => {
    const result = validateUrl("not-a-url");
    expect(result.valid).toBe(false);
  });

  it("rejects non-http protocols", () => {
    const result = validateUrl("ftp://example.com");
    expect(result.valid).toBe(false);
  });

  it("accepts valid https URL", () => {
    const result = validateUrl("https://example.com");
    expect(result.valid).toBe(true);
    expect(result.message).toBe("");
  });

  it("accepts valid http URL", () => {
    const result = validateUrl("http://example.com");
    expect(result.valid).toBe(true);
  });
});

describe("Default settings", () => {
  it("has expected defaults", () => {
    expect(DEFAULT_SETTINGS.url).toBe("");
    expect(DEFAULT_SETTINGS.size).toBe(256);
    expect(DEFAULT_SETTINGS.fgColor).toBe("#000000");
    expect(DEFAULT_SETTINGS.bgColor).toBe("#ffffff");
    expect(DEFAULT_SETTINGS.transparentBg).toBe(false);
    expect(DEFAULT_SETTINGS.margin).toBe(4);
    expect(DEFAULT_SETTINGS.errorCorrection).toBe("M");
  });
});
