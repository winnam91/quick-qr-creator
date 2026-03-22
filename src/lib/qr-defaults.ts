export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRSettings {
  size: number;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  margin: number;
  errorCorrection: ErrorCorrectionLevel;
  logoDataUrl: string | null;
  logoSize: number;
}

export const DEFAULT_SETTINGS: QRSettings = {
  size: 256,
  fgColor: "#000000",
  bgColor: "#ffffff",
  transparentBg: false,
  margin: 4,
  errorCorrection: "M",
  logoDataUrl: null,
  logoSize: 20,
};

export const SIZE_OPTIONS = [
  { label: "Small (128)", value: 128 },
  { label: "Medium (256)", value: 256 },
  { label: "Large (512)", value: 512 },
  { label: "XL (1024)", value: 1024 },
];

export const ERROR_CORRECTION_OPTIONS: { label: string; value: ErrorCorrectionLevel; description: string }[] = [
  { label: "L", value: "L", description: "~7% recovery" },
  { label: "M", value: "M", description: "~15% recovery" },
  { label: "Q", value: "Q", description: "~25% recovery" },
  { label: "H", value: "H", description: "~30% recovery" },
];

export const MARGIN_OPTIONS = [
  { label: "None", value: 0 },
  { label: "Small", value: 2 },
  { label: "Standard", value: 4 },
  { label: "Large", value: 6 },
];

export const LOGO_SIZE_OPTIONS = [
  { label: "Small (15%)", value: 15 },
  { label: "Medium (20%)", value: 20 },
  { label: "Large (25%)", value: 25 },
];

/** When a logo is present, enforce at least this error correction level */
export function getEffectiveErrorCorrection(settings: QRSettings): ErrorCorrectionLevel {
  if (!settings.logoDataUrl) return settings.errorCorrection;
  const order: ErrorCorrectionLevel[] = ["L", "M", "Q", "H"];
  const current = order.indexOf(settings.errorCorrection);
  const minimum = order.indexOf("H");
  return order[Math.max(current, minimum)];
}
