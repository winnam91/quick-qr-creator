import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { QRSettings, ErrorCorrectionLevel } from "@/lib/qr-defaults";
import { SIZE_OPTIONS, ERROR_CORRECTION_OPTIONS, MARGIN_OPTIONS } from "@/lib/qr-defaults";

interface CustomizationControlsProps {
  settings: QRSettings;
  onChange: (patch: Partial<QRSettings>) => void;
}

export function CustomizationControls({ settings, onChange }: CustomizationControlsProps) {
  return (
    <div>
      <p className="section-label">Customize</p>
      <div className="space-y-5">
        {/* Size */}
        <div className="control-group">
          <Label htmlFor="qr-size" className="control-label">Size</Label>
          <Select value={String(settings.size)} onValueChange={(v) => onChange({ size: Number(v) })}>
            <SelectTrigger id="qr-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="control-group">
            <Label htmlFor="fg-color" className="control-label">Foreground</Label>
            <div className="flex items-center gap-2">
              <Input
                id="fg-color"
                type="color"
                value={settings.fgColor}
                onChange={(e) => onChange({ fgColor: e.target.value })}
                className="w-10 h-10 p-1 cursor-pointer rounded-md"
                aria-label="Foreground color"
              />
              <span className="text-xs text-muted-foreground font-mono">{settings.fgColor}</span>
            </div>
          </div>
          <div className="control-group">
            <Label htmlFor="bg-color" className="control-label">Background</Label>
            <div className="flex items-center gap-2">
              <Input
                id="bg-color"
                type="color"
                value={settings.bgColor}
                onChange={(e) => onChange({ bgColor: e.target.value })}
                className="w-10 h-10 p-1 cursor-pointer rounded-md"
                disabled={settings.transparentBg}
                aria-label="Background color"
              />
              <span className="text-xs text-muted-foreground font-mono">
                {settings.transparentBg ? "none" : settings.bgColor}
              </span>
            </div>
          </div>
        </div>

        {/* Transparent toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="transparent-bg" className="control-label">Transparent background</Label>
          <Switch
            id="transparent-bg"
            checked={settings.transparentBg}
            onCheckedChange={(v) => onChange({ transparentBg: v })}
            aria-label="Toggle transparent background"
          />
        </div>

        {/* Margin */}
        <div className="control-group">
          <Label htmlFor="qr-margin" className="control-label">Margin (quiet zone)</Label>
          <Select value={String(settings.margin)} onValueChange={(v) => onChange({ margin: Number(v) })}>
            <SelectTrigger id="qr-margin">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MARGIN_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error correction */}
        <div className="control-group">
          <Label htmlFor="qr-ec" className="control-label">Error correction</Label>
          <Select value={settings.errorCorrection} onValueChange={(v) => onChange({ errorCorrection: v as ErrorCorrectionLevel })}>
            <SelectTrigger id="qr-ec">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ERROR_CORRECTION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label} — {o.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
