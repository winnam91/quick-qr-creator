import { useCallback, useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import QRCode from "qrcode";
import type { QRSettings } from "@/lib/qr-defaults";
import { getEffectiveErrorCorrection } from "@/lib/qr-defaults";
import { QrCode } from "lucide-react";

interface QRPreviewProps {
  encodedValue: string;
  settings: QRSettings;
  isValid: boolean;
}

export interface QRPreviewHandle {
  getCanvas: () => HTMLCanvasElement | null;
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

        // Draw logo if present
        if (settings.logoDataUrl) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            const img = new Image();
            img.onload = () => {
              const canvas = canvasRef.current!;
              const logoRatio = settings.logoSize / 100;
              const logoW = canvas.width * logoRatio;
              const logoH = canvas.height * logoRatio;
              const x = (canvas.width - logoW) / 2;
              const y = (canvas.height - logoH) / 2;
              const pad = 4;
              ctx.fillStyle = settings.transparentBg ? "#ffffff" : settings.bgColor;
              ctx.fillRect(x - pad, y - pad, logoW + pad * 2, logoH + pad * 2);
              ctx.drawImage(img, x, y, logoW, logoH);
            };
            img.src = settings.logoDataUrl;
          }
        }
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
