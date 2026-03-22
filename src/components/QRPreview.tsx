import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import type { QRSettings } from "@/lib/qr-defaults";
import { QrCode } from "lucide-react";

interface QRPreviewProps {
  settings: QRSettings;
  isValid: boolean;
}

export function QRPreview({ settings, isValid }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  const render = useCallback(async () => {
    if (!canvasRef.current || !isValid) return;
    try {
      await QRCode.toCanvas(canvasRef.current, settings.url, {
        width: Math.min(settings.size, 320),
        margin: settings.margin,
        errorCorrectionLevel: settings.errorCorrection,
        color: {
          dark: settings.fgColor,
          light: settings.transparentBg ? "#00000000" : settings.bgColor,
        },
      });
      setError(false);
    } catch {
      setError(true);
    }
  }, [settings, isValid]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="preview-surface aspect-square w-full max-w-[340px] mx-auto p-6">
      {isValid && !error ? (
        <canvas ref={canvasRef} className="w-full h-full object-contain" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
          <QrCode className="w-12 h-12 opacity-30" strokeWidth={1.5} />
          <p className="text-sm text-center">Enter a valid URL to preview your QR code</p>
        </div>
      )}
    </div>
  );
}
