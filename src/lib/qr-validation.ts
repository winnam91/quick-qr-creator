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
