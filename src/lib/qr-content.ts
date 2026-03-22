export type ContentType = "website" | "phone" | "email" | "wifi" | "text";

export type WifiSecurity = "WPA" | "WEP" | "nopass";

export interface WebsiteContent {
  type: "website";
  url: string;
}

export interface PhoneContent {
  type: "phone";
  phone: string;
}

export interface EmailContent {
  type: "email";
  email: string;
  subject: string;
  body: string;
}

export interface WifiContent {
  type: "wifi";
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
}

export interface TextContent {
  type: "text";
  text: string;
}

export type QRContent = WebsiteContent | PhoneContent | EmailContent | WifiContent | TextContent;

export const CONTENT_TYPE_OPTIONS: { label: string; value: ContentType }[] = [
  { label: "Website", value: "website" },
  { label: "Phone", value: "phone" },
  { label: "Email", value: "email" },
  { label: "Wi-Fi", value: "wifi" },
  { label: "Plain text", value: "text" },
];

export function defaultContent(type: ContentType): QRContent {
  switch (type) {
    case "website": return { type: "website", url: "" };
    case "phone": return { type: "phone", phone: "" };
    case "email": return { type: "email", email: "", subject: "", body: "" };
    case "wifi": return { type: "wifi", ssid: "", password: "", security: "WPA", hidden: false };
    case "text": return { type: "text", text: "" };
  }
}

export function encodeContent(content: QRContent): string {
  switch (content.type) {
    case "website":
      return content.url;
    case "phone":
      return `tel:${content.phone}`;
    case "email": {
      const params: string[] = [];
      if (content.subject) params.push(`subject=${encodeURIComponent(content.subject)}`);
      if (content.body) params.push(`body=${encodeURIComponent(content.body)}`);
      return `mailto:${content.email}${params.length ? "?" + params.join("&") : ""}`;
    }
    case "wifi": {
      const esc = (s: string) => s.replace(/[\\;,:""]/g, "\\$&");
      return `WIFI:T:${content.security};S:${esc(content.ssid)};P:${esc(content.password)};H:${content.hidden ? "true" : "false"};;`;
    }
    case "text":
      return content.text;
  }
}

export function getCopyLabel(type: ContentType): string {
  return type === "website" ? "Copy Link" : "Copy Content";
}

export function getCopyValue(content: QRContent): string {
  return encodeContent(content);
}
