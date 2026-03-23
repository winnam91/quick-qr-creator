export function LogoReliability() {
  return (
    <section className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">Add a logo without hurting scan reliability</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
        <p>
          Placing a logo in the centre of a QR code covers part of the data. To compensate, the generator automatically switches to the highest error correction level (H), which rebuilds up to 30% of damaged data.
        </p>
        <p>
          Strong contrast between the QR modules and the background matters just as much as error correction. Keep the foreground dark and the background light for the most reliable scans.
        </p>
        <p>
          Oversized logos can still reduce scan performance even with high error correction. The generator constrains the logo to a safe size range, but you should always test the final code with a phone camera before printing or distributing at scale.
        </p>
      </div>
    </section>
  );
}
