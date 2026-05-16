const principles = [
  { n: "01", text: "Automation handles the volume. Humans handle the judgment." },
  { n: "02", text: "Your next role is a distribution problem, not a résumé problem." },
  { n: "03", text: "We succeed when you sign an offer. Not before." },
];

export const AtelierPrinciples = () => (
  <section className="w-full py-12" style={{ backgroundColor: "#FAF0D7" }}>
    <div className="container max-w-7xl">
      <p className="text-center text-xs font-mono uppercase tracking-widest text-[hsl(8_84%_55%)]">
        What we believe
      </p>
      <div className="mt-8 grid gap-8 md:grid-cols-3 md:divide-x md:divide-[#E8D9BE]">
        {principles.map((p) => (
          <div key={p.n} className="px-6 text-center md:text-left">
            <p className="font-mono text-[11px] tracking-[0.18em] text-[hsl(8_84%_55%)]">{p.n}</p>
            <div className="mt-2 h-[2px] w-8 bg-[hsl(8_84%_55%)] mx-auto md:mx-0" />
            <p className="mt-4 atelier-display text-lg font-extrabold text-[hsl(30_10%_10%)] leading-snug">
              {p.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);