import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { TypeSelector } from "@/components/TypeSelector";
import { ContentForm } from "@/components/ContentForm";
import { CopyActions } from "@/components/CopyActions";
import { CustomizationControls } from "@/components/CustomizationControls";
import { LogoUpload } from "@/components/LogoUpload";
import { QRPreview } from "@/components/QRPreview";
import { DownloadActions } from "@/components/DownloadActions";
import { CopyQRAction } from "@/components/CopyQRAction";
import { TrustBar } from "@/components/landing/TrustBar";
import { SupportedTypes } from "@/components/landing/SupportedTypes";
import { WhyStatic } from "@/components/landing/WhyStatic";
import { PngVsSvg } from "@/components/landing/PngVsSvg";
import { LogoReliability } from "@/components/landing/LogoReliability";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { DEFAULT_SETTINGS, type QRSettings } from "@/lib/qr-defaults";
import { defaultContent, encodeContent, type QRContent, type ContentType } from "@/lib/qr-content";
import { validateContent } from "@/lib/qr-validation";
import { downloadPng, downloadSvg } from "@/lib/qr-download";

export default function Index() {
  const [settings, setSettings] = useState<QRSettings>({ ...DEFAULT_SETTINGS });
  const [content, setContent] = useState<QRContent>(defaultContent("website"));

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="pt-14 pb-2 px-4 text-center fade-in max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
          Free Static QR Code Generator
        </h1>
        <p className="mt-3 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Create static QR codes for websites, phone numbers, emails, Wi-Fi networks, and plain text. Add a logo, customise colors, and download as PNG or SVG — no sign-up needed. Everything runs client-side in your browser for complete privacy.
        </p>
      </header>

      {/* Trust bar */}
      <div className="max-w-3xl mx-auto px-4 fade-in" style={{ animationDelay: "40ms" }}>
        <TrustBar />
      </div>

      {/* Generator */}
      <main id="qr-generator" className="max-w-4xl mx-auto px-4 pb-8 scroll-mt-8">
        <div className="text-center mb-6 fade-in" style={{ animationDelay: "60ms" }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Create your QR code in seconds</h2>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Choose a content type, enter your details, customise the appearance, add an optional logo, and download your QR code as PNG or SVG — instantly.
          </p>
        </div>

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
                logoShape={settings.logoShape}
                logoPadding={settings.logoPadding}
                logoBg={settings.logoBg}
                onLogoChange={(dataUrl) => updateSettings({ logoDataUrl: dataUrl })}
                onSizeChange={(size) => updateSettings({ logoSize: size })}
                onShapeChange={(shape) => updateSettings({ logoShape: shape })}
                onPaddingChange={(p) => updateSettings({ logoPadding: p })}
                onBgChange={(bg) => updateSettings({ logoBg: bg })}
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
                  <QRPreview encodedValue={encodedValue} settings={settings} isValid={isValid} />
                </div>
                <DownloadActions
                  disabled={!isValid}
                  onDownloadPng={() => downloadPng(encodedValue, settings)}
                  onDownloadSvg={() => downloadSvg(encodedValue, settings)}
                />
                <CopyQRAction encodedValue={encodedValue} settings={settings} disabled={!isValid} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* SEO content sections */}
      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-20">
        <SupportedTypes />
        <WhyStatic />
        <PngVsSvg />
        <LogoReliability />
        <Faq />
        <FinalCta />
      </div>
    </div>
  );
}
