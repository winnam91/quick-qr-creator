import type { QRContent } from "./qr-content";

export function validateUrl(url: string): { valid: boolean; message: string } {
  if (!url.trim()) {
    return { valid: false, message: "Please enter a URL." };
  }
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, message: "URL must start with http:// or https://." };
    }
    return { valid: true, message: "" };
  } catch {
    return { valid: false, message: "Enter a valid URL (e.g. https://example.com)." };
  }
}

function validateEmail(email: string): { valid: boolean; message: string } {
  if (!email.trim()) return { valid: false, message: "Please enter an email address." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, message: "Enter a valid email address." };
  return { valid: true, message: "" };
}

function validatePhone(phone: string): { valid: boolean; message: string } {
  if (!phone.trim()) return { valid: false, message: "Please enter a phone number." };
  return { valid: true, message: "" };
}

function validateWifi(ssid: string, password: string, security: string): { valid: boolean; message: string } {
  if (!ssid.trim()) return { valid: false, message: "Please enter a network name (SSID)." };
  if (security !== "nopass" && !password.trim()) return { valid: false, message: "Please enter a password." };
  return { valid: true, message: "" };
}

function validateText(text: string): { valid: boolean; message: string } {
  if (!text.trim()) return { valid: false, message: "Please enter some text." };
  return { valid: true, message: "" };
}

export function validateContent(content: QRContent): { valid: boolean; message: string } {
  switch (content.type) {
    case "website": return validateUrl(content.url);
    case "phone": return validatePhone(content.phone);
    case "email": return validateEmail(content.email);
    case "wifi": return validateWifi(content.ssid, content.password, content.security);
    case "text": return validateText(content.text);
  }
}
