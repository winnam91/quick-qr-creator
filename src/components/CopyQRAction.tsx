import { Button } from "@/components/ui/button";
import { ClipboardCopy, Check, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";

interface CopyQRActionProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  disabled: boolean;
}

export function CopyQRAction({ canvasRef, disabled }: CopyQRActionProps) {
  const [state, setState] = useState<"idle" | "success" | "error">("idle");

  const handleCopy = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No blob"))), "image/png");
      });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setState("success");
      setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2200);
    }
  }, [canvasRef]);

  const icon = state === "success" ? <Check className="w-4 h-4" /> : state === "error" ? <AlertCircle className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />;
  const text = state === "success" ? "Copied!" : state === "error" ? "Failed to copy" : "Copy QR Image";

  return (
    <div>
      <p className="section-label">Copy</p>
      <Button
        variant="outline"
        onClick={handleCopy}
        disabled={disabled}
        className="w-full h-11 gap-2"
      >
        {icon}
        {text}
      </Button>
    </div>
  );
}
