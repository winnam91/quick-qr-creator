import QRCode from "qrcode";
import type { QRSettings } from "./qr-defaults";
import { getEffectiveErrorCorrection, getLogoPaddingPx } from "./qr-defaults";

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
      const pad = getLogoPaddingPx(settings.logoPadding, logoW);
      const containerW = logoW + pad * 2;
      const containerH = logoH + pad * 2;
      const cx = (canvas.width - containerW) / 2;
      const cy = (canvas.height - containerH) / 2;

      if (settings.logoBg === "white") {
        ctx.save();
        if (settings.logoShape === "circle") {
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, containerW / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
        } else {
          const r = Math.round(containerW * 0.08);
          ctx.beginPath();
          ctx.roundRect(cx, cy, containerW, containerH, r);
          ctx.closePath();
          ctx.clip();
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(cx, cy, containerW, containerH);
        ctx.restore();
      }

      if (settings.logoShape === "circle") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, logoW / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      const lx = (canvas.width - logoW) / 2;
      const ly = (canvas.height - logoH) / 2;
      ctx.drawImage(img, lx, ly, logoW, logoH);

      if (settings.logoShape === "circle") {
        ctx.restore();
      }

      resolve();
    };
    img.onerror = () => resolve();
    img.src = settings.logoDataUrl!;
  });
}

export async function renderFullCanvas(encodedValue: string, settings: QRSettings): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, encodedValue, getQROptions(settings));
  await drawLogo(canvas, settings);
  return canvas;
}

export async function downloadPng(encodedValue: string, settings: QRSettings) {
  const canvas = await renderFullCanvas(encodedValue, settings);
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
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svg = doc.documentElement;
    const w = parseFloat(svg.getAttribute("width") || "256");
    const h = parseFloat(svg.getAttribute("height") || "256");
    const logoRatio = settings.logoSize / 100;
    const lw = w * logoRatio;
    const lh = h * logoRatio;
    const pad = getLogoPaddingPx(settings.logoPadding, lw);
    const containerW = lw + pad * 2;
    const containerH = lh + pad * 2;
    const containerX = (w - containerW) / 2;
    const containerY = (h - containerH) / 2;
    const lx = (w - lw) / 2;
    const ly = (h - lh) / 2;

    if (settings.logoBg === "white") {
      if (settings.logoShape === "circle") {
        const circle = doc.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", String(w / 2));
        circle.setAttribute("cy", String(h / 2));
        circle.setAttribute("r", String(containerW / 2));
        circle.setAttribute("fill", "#ffffff");
        svg.appendChild(circle);
      } else {
        const rect = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", String(containerX));
        rect.setAttribute("y", String(containerY));
        rect.setAttribute("width", String(containerW));
        rect.setAttribute("height", String(containerH));
        rect.setAttribute("rx", String(Math.round(containerW * 0.08)));
        rect.setAttribute("fill", "#ffffff");
        svg.appendChild(rect);
      }
    }

    // Clip logo to shape
    const clipId = "logo-clip";
    const defs = doc.createElementNS("http://www.w3.org/2000/svg", "defs");
    const clipPath = doc.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clipPath.setAttribute("id", clipId);
    if (settings.logoShape === "circle") {
      const clipCircle = doc.createElementNS("http://www.w3.org/2000/svg", "circle");
      clipCircle.setAttribute("cx", String(w / 2));
      clipCircle.setAttribute("cy", String(h / 2));
      clipCircle.setAttribute("r", String(lw / 2));
      clipPath.appendChild(clipCircle);
    } else {
      const clipRect = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
      clipRect.setAttribute("x", String(lx));
      clipRect.setAttribute("y", String(ly));
      clipRect.setAttribute("width", String(lw));
      clipRect.setAttribute("height", String(lh));
      clipPath.appendChild(clipRect);
    }
    defs.appendChild(clipPath);
    svg.insertBefore(defs, svg.firstChild);

    const image = doc.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("x", String(lx));
    image.setAttribute("y", String(ly));
    image.setAttribute("width", String(lw));
    image.setAttribute("height", String(lh));
    image.setAttribute("href", settings.logoDataUrl);
    image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", settings.logoDataUrl);
    image.setAttribute("clip-path", `url(#${clipId})`);
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
