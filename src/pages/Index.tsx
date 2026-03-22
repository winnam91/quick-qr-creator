import { useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { TypeSelector } from "@/components/TypeSelector";
import { ContentForm } from "@/components/ContentForm";
import { CopyActions } from "@/components/CopyActions";
import { CustomizationControls } from "@/components/CustomizationControls";
import { LogoUpload } from "@/components/LogoUpload";
import { QRPreview, type QRPreviewHandle } from "@/components/QRPreview";
import { DownloadActions } from "@/components/DownloadActions";
import { CopyQRAction } from "@/components/CopyQRAction";
import { DEFAULT_SETTINGS, type QRSettings } from "@/lib/qr-defaults";
import { defaultContent, encodeContent, type QRContent, type ContentType } from "@/lib/qr-content";
import { validateContent } from "@/lib/qr-validation";
import { downloadPng, downloadSvg } from "@/lib/qr-download";

export default function Index() {
  const [settings, setSettings] = useState<QRSettings>({ ...DEFAULT_SETTINGS });
  const [content, setContent] = useState<QRContent>(defaultContent("website"));
  const previewRef = useRef<QRPreviewHandle>(null);

  const { valid: isValid } = validateContent(content);
  const encodedValue = isValid ? encodeContent(content) : "";

  const updateSettings = useCallback((patch: Partial<QRSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleTypeChange = useCallback((type: ContentType) => {
    setContent(defaultContent(type));
  }, []);

  const reset = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
    setContent(defaultContent("website"));
  }, []);

  const canvasRef = { current: previewRef.current?.getCanvas() ?? null } as React.RefObject<HTMLCanvasElement>;

  return (
    <div className="min-h-screen bg-background">
      <header className="pt-12 pb-8 px-4 text-center fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          Static QR Code Generator
        </h1>
        <p className="mt-2 text-muted-foreground text-base max-w-md mx-auto">
          Create and download a clean static QR code from any valid link.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
          {/* Left: Controls */}
          <Card className="shadow-sm fade-in order-1 lg:order-1" style={{ animationDelay: "80ms" }}>
            <CardContent className="p-6 space-y-8">
              <TypeSelector value={content.type} onChange={handleTypeChange} />
              <ContentForm content={content} onChange={setContent} />
              <CopyActions content={content} disabled={!isValid} />
              <CustomizationControls settings={settings} onChange={updateSettings} />
              <LogoUpload
                logoDataUrl={settings.logoDataUrl}
                logoSize={settings.logoSize}
                onLogoChange={(dataUrl) => updateSettings({ logoDataUrl: dataUrl })}
                onSizeChange={(size) => updateSettings({ logoSize: size })}
              />
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

          {/* Right: Preview + Download + Copy */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-8 fade-in order-2 lg:order-2" style={{ animationDelay: "160ms" }}>
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="section-label">Preview</p>
                  <QRPreview ref={previewRef} encodedValue={encodedValue} settings={settings} isValid={isValid} />
                </div>
                <DownloadActions
                  disabled={!isValid}
                  onDownloadPng={() => downloadPng(encodedValue, settings)}
                  onDownloadSvg={() => downloadSvg(encodedValue, settings)}
                />
                <CopyQRAction canvasRef={canvasRef} disabled={!isValid} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
