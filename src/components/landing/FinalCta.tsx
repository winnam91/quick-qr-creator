import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export function FinalCta() {
  const scrollToGenerator = () => {
    document.getElementById("qr-generator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="text-center space-y-4 py-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Create your static QR code now</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Choose a type, enter your content, customise the design, and download — all in seconds, all for free.
      </p>
      <Button onClick={scrollToGenerator} size="lg" className="gap-2">
        <ArrowUp className="w-4 h-4" />
        Start generating
      </Button>
    </section>
  );
}
