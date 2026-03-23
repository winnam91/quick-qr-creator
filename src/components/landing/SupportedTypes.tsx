import { Globe, Phone, Mail, Wifi, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const types = [
  {
    icon: Globe,
    title: "Website QR codes",
    text: "Link to any valid URL. Share landing pages, portfolios, product pages, or documents instantly. Anyone who scans the code is taken directly to the website.",
  },
  {
    icon: Phone,
    title: "Phone QR codes",
    text: "Encode a phone number so scanning triggers a tap-to-call action. Ideal for business cards, flyers, and customer support materials where quick contact matters.",
  },
  {
    icon: Mail,
    title: "Email QR codes",
    text: "Create a QR code that opens a prefilled email with a recipient address, subject line, and message body. Useful for feedback forms, support requests, and event RSVPs.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi QR codes",
    text: "Share network access without typing passwords. Encode your SSID, password, and security type so guests can connect by scanning. Supports WPA, WEP, and open networks.",
  },
  {
    icon: FileText,
    title: "Plain text QR codes",
    text: "Encode any raw text directly into a QR code. Share notes, reference codes, serial numbers, or simple information without needing a URL or online service.",
  },
];

export function SupportedTypes() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Supported QR code types</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Generate QR codes for websites, phone numbers, emails, Wi-Fi networks, and plain text — all from one tool.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((t) => (
          <Card key={t.title} className="shadow-sm">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <t.icon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">{t.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
