export function WhyStatic() {
  return (
    <section className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">Why use a static QR code</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
        <p>
          Static QR codes encode the content directly into the code itself. Once generated, the data lives inside the pattern of black and white modules — no redirect server sits in between.
        </p>
        <p>
          Because the content is baked in, static QR codes do not expire on their own. They continue working as long as the linked URL or encoded content remains valid. A website QR code will keep pointing to the same page, and a Wi-Fi QR code will keep connecting to the same network.
        </p>
        <p>
          Static codes are best when the destination will not need editing later. They do not require a redirect dashboard, tracking service, or ongoing subscription. If you need to change where a QR code points after printing, a dynamic QR code is the better choice — but for fixed content, static codes are simpler, faster, and free.
        </p>
      </div>
    </section>
  );
}
