import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do static QR codes expire?",
    a: "Static QR codes do not expire on their own. They continue to work as long as the linked URL or encoded information remains valid. A website QR code, for example, will keep directing to the same page indefinitely unless the page itself is removed.",
  },
  {
    q: "Is this QR code generator free?",
    a: "Yes. The generator is completely free to use with no usage limits, watermarks, or hidden charges.",
  },
  {
    q: "Do I need to sign up?",
    a: "No sign-up is required. You can create, customise, and download QR codes immediately without creating an account.",
  },
  {
    q: "Is this QR code generator private?",
    a: "The generator runs entirely client-side in your browser. Your content is not sent to a server, so your data stays on your device.",
  },
  {
    q: "Can I create a Wi-Fi QR code?",
    a: "Yes. Enter your network name (SSID), password, and security type (WPA/WPA2, WEP, or None). You can also mark the network as hidden. Scanning the QR code lets devices connect without manually typing the password.",
  },
  {
    q: "Can I create an email or phone QR code?",
    a: "Yes. The generator supports both. Email QR codes can prefill the recipient address, subject, and message body. Phone QR codes trigger a tap-to-call action when scanned.",
  },
  {
    q: "Can I add a logo to my QR code?",
    a: "Yes. Upload any image as a centre logo. The generator automatically uses the strongest error correction level to keep the code scannable even with a logo covering part of the pattern.",
  },
  {
    q: "Should I download PNG or SVG?",
    a: "Choose PNG for quick digital sharing — social media, presentations, documents. Choose SVG when you need the QR code for print materials, packaging, or any use where it will be scaled to a large size.",
  },
];

export function Faq() {
  return (
    <section className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">Frequently asked questions</h2>
      <Accordion type="multiple" className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-foreground">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
