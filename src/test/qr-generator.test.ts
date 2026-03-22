import { describe, it, expect } from "vitest";
import { validateUrl, validateContent } from "@/lib/qr-validation";
import { DEFAULT_SETTINGS } from "@/lib/qr-defaults";
import { encodeContent, defaultContent, type QRContent } from "@/lib/qr-content";

describe("URL validation", () => {
  it("rejects empty string", () => {
    expect(validateUrl("").valid).toBe(false);
  });
  it("rejects invalid URL", () => {
    expect(validateUrl("not-a-url").valid).toBe(false);
  });
  it("rejects non-http protocols", () => {
    expect(validateUrl("ftp://example.com").valid).toBe(false);
  });
  it("accepts valid https URL", () => {
    const r = validateUrl("https://example.com");
    expect(r.valid).toBe(true);
    expect(r.message).toBe("");
  });
  it("accepts valid http URL", () => {
    expect(validateUrl("http://example.com").valid).toBe(true);
  });
});

describe("Default settings", () => {
  it("has expected defaults", () => {
    expect(DEFAULT_SETTINGS.size).toBe(256);
    expect(DEFAULT_SETTINGS.fgColor).toBe("#000000");
    expect(DEFAULT_SETTINGS.bgColor).toBe("#ffffff");
    expect(DEFAULT_SETTINGS.transparentBg).toBe(false);
    expect(DEFAULT_SETTINGS.margin).toBe(4);
    expect(DEFAULT_SETTINGS.errorCorrection).toBe("M");
    expect(DEFAULT_SETTINGS.logoDataUrl).toBeNull();
    expect(DEFAULT_SETTINGS.logoSize).toBe(20);
  });
});

describe("Content type validation", () => {
  it("website: valid URL passes", () => {
    expect(validateContent({ type: "website", url: "https://example.com" }).valid).toBe(true);
  });
  it("website: empty fails", () => {
    expect(validateContent({ type: "website", url: "" }).valid).toBe(false);
  });
  it("phone: non-empty passes", () => {
    expect(validateContent({ type: "phone", phone: "+1234567890" }).valid).toBe(true);
  });
  it("phone: empty fails", () => {
    expect(validateContent({ type: "phone", phone: "" }).valid).toBe(false);
  });
  it("email: valid email passes", () => {
    expect(validateContent({ type: "email", email: "a@b.com", subject: "", body: "" }).valid).toBe(true);
  });
  it("email: invalid email fails", () => {
    expect(validateContent({ type: "email", email: "notvalid", subject: "", body: "" }).valid).toBe(false);
  });
  it("wifi: valid passes", () => {
    expect(validateContent({ type: "wifi", ssid: "Net", password: "pass", security: "WPA", hidden: false }).valid).toBe(true);
  });
  it("wifi: empty ssid fails", () => {
    expect(validateContent({ type: "wifi", ssid: "", password: "pass", security: "WPA", hidden: false }).valid).toBe(false);
  });
  it("wifi: no password needed for nopass", () => {
    expect(validateContent({ type: "wifi", ssid: "Net", password: "", security: "nopass", hidden: false }).valid).toBe(true);
  });
  it("wifi: password required for WPA", () => {
    expect(validateContent({ type: "wifi", ssid: "Net", password: "", security: "WPA", hidden: false }).valid).toBe(false);
  });
  it("text: non-empty passes", () => {
    expect(validateContent({ type: "text", text: "hello" }).valid).toBe(true);
  });
  it("text: empty fails", () => {
    expect(validateContent({ type: "text", text: "" }).valid).toBe(false);
  });
});

describe("Content encoding", () => {
  it("website encodes URL directly", () => {
    expect(encodeContent({ type: "website", url: "https://example.com" })).toBe("https://example.com");
  });
  it("phone encodes tel:", () => {
    expect(encodeContent({ type: "phone", phone: "+1234" })).toBe("tel:+1234");
  });
  it("email encodes mailto with params", () => {
    const result = encodeContent({ type: "email", email: "a@b.com", subject: "Hi", body: "Hello" });
    expect(result).toContain("mailto:a@b.com");
    expect(result).toContain("subject=Hi");
    expect(result).toContain("body=Hello");
  });
  it("email encodes mailto without optional params", () => {
    expect(encodeContent({ type: "email", email: "a@b.com", subject: "", body: "" })).toBe("mailto:a@b.com");
  });
  it("wifi encodes WIFI format", () => {
    const result = encodeContent({ type: "wifi", ssid: "MyNet", password: "pass123", security: "WPA", hidden: false });
    expect(result).toBe("WIFI:T:WPA;S:MyNet;P:pass123;H:false;;");
  });
  it("wifi encodes hidden network", () => {
    const result = encodeContent({ type: "wifi", ssid: "Secret", password: "pw", security: "WEP", hidden: true });
    expect(result).toContain("H:true");
  });
  it("text encodes plaintext directly", () => {
    expect(encodeContent({ type: "text", text: "hello world" })).toBe("hello world");
  });
});

describe("Default content", () => {
  it("website default has empty url", () => {
    const c = defaultContent("website");
    expect(c.type).toBe("website");
    expect((c as any).url).toBe("");
  });
  it("wifi default has WPA security", () => {
    const c = defaultContent("wifi");
    expect((c as any).security).toBe("WPA");
  });
});
