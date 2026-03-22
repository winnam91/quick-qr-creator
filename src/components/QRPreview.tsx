import { useCallback, useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import QRCode from "qrcode";
import type { QRSettings } from "@/lib/qr-defaults";
import { getEffectiveErrorCorrection, getLogoPaddingPx } from "@/lib/qr-defaults";
import { QrCode } from "lucide-react";

interface QRPreviewProps {
  encodedValue: string;
  settings: QRSettings;
  isValid: boolean;
}

export interface QRPreviewHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

function drawLogoOnCanvas(canvas: HTMLCanvasElement, settings: QRSettings) {
  if (!settings.logoDataUrl) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
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

    // Clip logo to shape if circle
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
  };
  img.src = settings.logoDataUrl;
}

export const QRPreview = forwardRef<QRPreviewHandle, QRPreviewProps>(
  ({ encodedValue, settings, isValid }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState(false);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    const render = useCallback(async () => {
      if (!canvasRef.current || !isValid || !encodedValue) return;
      try {
        const ec = getEffectiveErrorCorrection(settings);
        await QRCode.toCanvas(canvasRef.current, encodedValue, {
          width: Math.min(settings.size, 320),
          margin: settings.margin,
          errorCorrectionLevel: ec,
          color: {
            dark: settings.fgColor,
            light: settings.transparentBg ? "#00000000" : settings.bgColor,
          },
        });
        drawLogoOnCanvas(canvasRef.current, settings);
        setError(false);
      } catch {
        setError(true);
      }
    }, [encodedValue, settings, isValid]);

    useEffect(() => {
      render();
    }, [render]);

    return (
      <div className="preview-surface aspect-square w-full max-w-[340px] mx-auto p-6">
        {isValid && !error && encodedValue ? (
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <QrCode className="w-12 h-12 opacity-30" strokeWidth={1.5} />
            <p className="text-sm text-center">Enter valid content to preview your QR code</p>
          </div>
        )}
      </div>
    );
  }
);

QRPreview.displayName = "QRPreview";
