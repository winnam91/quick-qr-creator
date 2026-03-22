export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRSettings {
  url: string;
  size: number;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  margin: number;
  errorCorrection: ErrorCorrectionLevel;
}

export const DEFAULT_SETTINGS: QRSettings = {
  url: "",
  size: 256,
  fgColor: "#000000",
  bgColor: "#ffffff",
  transparentBg: false,
  margin: 4,
  errorCorrection: "M",
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
