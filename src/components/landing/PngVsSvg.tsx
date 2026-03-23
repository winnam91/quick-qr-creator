import { Card, CardContent } from "@/components/ui/card";
import { Image, FileCode } from "lucide-react";

export function PngVsSvg() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">PNG vs SVG: which format should you download?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <Card className="shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">PNG</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Best for quick sharing. Use PNG when you need to insert the QR code into slides, documents, social media posts, or everyday digital materials. It works everywhere with no extra steps.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">SVG</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Best for print and scaling. SVG stays perfectly sharp at any size, making it ideal for business cards, posters, packaging, and professional print workflows where quality matters.
            </p>
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground text-center max-w-lg mx-auto">
        Choose SVG when the QR code needs to look crisp in print. Choose PNG for quick everyday digital use.
      </p>
    </section>
  );
}
