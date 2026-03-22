import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, AlertTriangle } from "lucide-react";
import { useRef, useCallback } from "react";
import { LOGO_SIZE_OPTIONS } from "@/lib/qr-defaults";

interface LogoUploadProps {
  logoDataUrl: string | null;
  logoSize: number;
  onLogoChange: (dataUrl: string | null) => void;
  onSizeChange: (size: number) => void;
}

export function LogoUpload({ logoDataUrl, logoSize, onLogoChange, onSizeChange }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onLogoChange(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [onLogoChange]);

  return (
    <div>
      <p className="section-label">Logo</p>
      <div className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp"
          onChange={handleFile}
          className="hidden"
          aria-label="Upload logo image"
        />

        {logoDataUrl ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md border border-border overflow-hidden flex-shrink-0 bg-[hsl(var(--surface))]">
              <img src={logoDataUrl} alt="Logo preview" className="w-full h-full object-contain" />
            </div>
            <Button variant="ghost" size="sm" onClick={() => onLogoChange(null)} className="gap-1.5 text-muted-foreground hover:text-destructive">
              <X className="w-3.5 h-3.5" />
              Remove
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => inputRef.current?.click()} className="gap-2">
            <Upload className="w-4 h-4" />
            Upload logo
          </Button>
        )}

        {logoDataUrl && (
          <div className="control-group">
            <Label htmlFor="logo-size" className="control-label">Logo size</Label>
            <Select value={String(logoSize)} onValueChange={(v) => onSizeChange(Number(v))}>
              <SelectTrigger id="logo-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOGO_SIZE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {logoDataUrl && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted rounded-md p-2.5">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>Error correction is set to H (highest) when a logo is present to ensure scan reliability.</span>
          </div>
        )}
      </div>
    </div>
  );
}
