import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { URLInput } from "@/components/URLInput";
import { CustomizationControls } from "@/components/CustomizationControls";
import { QRPreview } from "@/components/QRPreview";
import { DownloadActions } from "@/components/DownloadActions";
import { DEFAULT_SETTINGS, type QRSettings } from "@/lib/qr-defaults";
import { validateUrl } from "@/lib/qr-validation";
import { downloadPng, downloadSvg } from "@/lib/qr-download";

export default function Index() {
  const [settings, setSettings] = useState<QRSettings>({ ...DEFAULT_SETTINGS });

  const { valid: isValid } = validateUrl(settings.url);

  const update = useCallback((patch: Partial<QRSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          Static QR Code Generator
        </h1>
        <p className="mt-2 text-muted-foreground text-base max-w-md mx-auto">
          Create and download a clean static QR code from any valid link.
        </p>
      </header>

      {/* Main shell */}
      <main className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
          {/* Left: Controls — on mobile, URL first then controls after preview */}
          <Card className="shadow-sm fade-in order-1 lg:order-1" style={{ animationDelay: "80ms" }}>
            <CardContent className="p-6 space-y-8">
              <URLInput url={settings.url} onChange={(url) => update({ url })} />
              <CustomizationControls settings={settings} onChange={update} />
              <div>
                <p className="section-label">Actions</p>
                <Button
                  variant="ghost"
                  onClick={reset}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to defaults
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: Preview + Download */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-8 fade-in" style={{ animationDelay: "160ms" }}>
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="section-label">Preview</p>
                  <QRPreview settings={settings} isValid={isValid} />
                </div>
                <DownloadActions
                  disabled={!isValid}
                  onDownloadPng={() => downloadPng(settings)}
                  onDownloadSvg={() => downloadSvg(settings)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Mobile reorder: on mobile, preview shows between URL and controls via CSS order */}
        </div>
      </main>
    </div>
  );
}
