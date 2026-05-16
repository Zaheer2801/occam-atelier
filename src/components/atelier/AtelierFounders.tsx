const founders = [
  {
    initial: "N",
    name: "Narendra",
    role: "Founder · OCAS Software LLC",
    tags: "Vision · Operations · Growth",
  },
  {
    initial: "Z",
    name: "Zaheer",
    role: "Co-Founder · AI/ML & Supply Chain",
    tags: "Automation · Intelligence · Systems",
  },
];

export const AtelierFounders = () => (
  <section className="container max-w-7xl py-20">
    <div className="grid md:grid-cols-2 gap-12 items-start">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(8_84%_55%)]">
          Why we built this
        </p>
        <h2 className="mt-3 atelier-display atelier-display-lg">
          We were tired of watching great people get ignored.
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-[hsl(30_10%_25%)] max-w-lg">
          Job searching is broken on the candidate side. You spend 6–8 hours a day sending applications into silence — too exhausted to prepare for the interviews that matter. Narendra and Zaheer built OCAS in 2022 to fix that. Not with another job board. With a team that does the work for you.
        </p>
      </div>
      <div className="space-y-5">
        {founders.map((f) => (
          <div key={f.name} className="atelier-card-cream p-6 border-l-[3px] border-[hsl(8_84%_55%)] flex items-center gap-5">
            <div className="h-14 w-14 rounded-full bg-[hsl(46_96%_58%)] flex items-center justify-center atelier-display text-2xl font-extrabold text-[hsl(8_84%_55%)] shrink-0">
              {f.initial}
            </div>
            <div>
              <p className="atelier-display text-lg font-bold text-[hsl(30_10%_10%)]">{f.name}</p>
              <p className="text-sm text-[hsl(30_10%_35%)]">{f.role}</p>
              <p className="mt-1 text-xs font-mono uppercase tracking-widest text-[hsl(30_10%_45%)]">{f.tags}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);