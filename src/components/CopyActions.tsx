import { Button } from "@/components/ui/button";
import { Copy, Check, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import type { QRContent } from "@/lib/qr-content";
import { getCopyLabel, getCopyValue } from "@/lib/qr-content";

interface CopyActionsProps {
  content: QRContent;
  disabled: boolean;
}

export function CopyActions({ content, disabled }: CopyActionsProps) {
  const [state, setState] = useState<"idle" | "success" | "error">("idle");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getCopyValue(content));
      setState("success");
      setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2200);
    }
  }, [content]);

  const label = getCopyLabel(content.type);
  const icon = state === "success" ? <Check className="w-4 h-4" /> : state === "error" ? <AlertCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />;
  const text = state === "success" ? "Copied!" : state === "error" ? "Failed to copy" : label;

  return (
    <div>
      <p className="section-label">Quick Actions</p>
      <Button
        variant="outline"
        onClick={handleCopy}
        disabled={disabled}
        className="gap-2"
      >
        {icon}
        {text}
      </Button>
    </div>
  );
}
