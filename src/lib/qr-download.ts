import QRCode from "qrcode";
import type { QRSettings } from "./qr-defaults";

export async function downloadPng(settings: QRSettings) {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, settings.url, {
    width: settings.size,
    margin: settings.margin,
    errorCorrectionLevel: settings.errorCorrection,
    color: {
      dark: settings.fgColor,
      light: settings.transparentBg ? "#00000000" : settings.bgColor,
    },
  });
  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function downloadSvg(settings: QRSettings) {
  const svgString = await QRCode.toString(settings.url, {
    type: "svg",
    width: settings.size,
    margin: settings.margin,
    errorCorrectionLevel: settings.errorCorrection,
    color: {
      dark: settings.fgColor,
      light: settings.transparentBg ? "#00000000" : settings.bgColor,
    },
  });
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const link = document.createElement("a");
  link.download = "qrcode.svg";
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}
