import { ShieldCheck, Lock, Download, QrCode } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "No sign-up required" },
  { icon: Lock, label: "Client-side privacy" },
  { icon: Download, label: "PNG & SVG download" },
  { icon: QrCode, label: "Static QR codes" },
];

export function TrustBar() {
  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-10 py-6">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-muted-foreground text-sm">
          <item.icon className="w-4 h-4 text-primary" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
