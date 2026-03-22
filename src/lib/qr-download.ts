import QRCode from "qrcode";
import type { QRSettings } from "./qr-defaults";
import { getEffectiveErrorCorrection } from "./qr-defaults";

function getQROptions(settings: QRSettings) {
  return {
    width: settings.size,
    margin: settings.margin,
    errorCorrectionLevel: getEffectiveErrorCorrection(settings),
    color: {
      dark: settings.fgColor,
      light: settings.transparentBg ? "#00000000" : settings.bgColor,
    },
  };
}

async function drawLogo(canvas: HTMLCanvasElement, settings: QRSettings): Promise<void> {
  if (!settings.logoDataUrl) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const logoRatio = settings.logoSize / 100;
      const logoW = canvas.width * logoRatio;
      const logoH = canvas.height * logoRatio;
      const x = (canvas.width - logoW) / 2;
      const y = (canvas.height - logoH) / 2;
      const pad = Math.round(canvas.width * 0.01);
      ctx.fillStyle = settings.transparentBg ? "#ffffff" : settings.bgColor;
      ctx.fillRect(x - pad, y - pad, logoW + pad * 2, logoH + pad * 2);
      ctx.drawImage(img, x, y, logoW, logoH);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = settings.logoDataUrl!;
  });
}

export async function downloadPng(encodedValue: string, settings: QRSettings) {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, encodedValue, getQROptions(settings));
  await drawLogo(canvas, settings);
  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function downloadSvg(encodedValue: string, settings: QRSettings) {
  const svgString = await QRCode.toString(encodedValue, {
    type: "svg",
    ...getQROptions(settings),
  });

  if (settings.logoDataUrl) {
    // Insert logo into SVG
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svg = doc.documentElement;
    const w = parseFloat(svg.getAttribute("width") || "256");
    const h = parseFloat(svg.getAttribute("height") || "256");
    const logoRatio = settings.logoSize / 100;
    const lw = w * logoRatio;
    const lh = h * logoRatio;
    const lx = (w - lw) / 2;
    const ly = (h - lh) / 2;
    const pad = Math.round(w * 0.01);

    const rect = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(lx - pad));
    rect.setAttribute("y", String(ly - pad));
    rect.setAttribute("width", String(lw + pad * 2));
    rect.setAttribute("height", String(lh + pad * 2));
    rect.setAttribute("fill", settings.transparentBg ? "#ffffff" : settings.bgColor);
    svg.appendChild(rect);

    const image = doc.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("x", String(lx));
    image.setAttribute("y", String(ly));
    image.setAttribute("width", String(lw));
    image.setAttribute("height", String(lh));
    image.setAttribute("href", settings.logoDataUrl);
    svg.appendChild(image);

    const serializer = new XMLSerializer();
    const finalSvg = serializer.serializeToString(svg);
    const blob = new Blob([finalSvg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = "qrcode.svg";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  } else {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = "qrcode.svg";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
