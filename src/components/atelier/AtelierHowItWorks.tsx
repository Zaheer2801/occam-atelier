const steps = [
  { step: "01", title: "Upload", body: "Drop your resume. Atelier parses it into a full career profile in under 60 seconds." },
  { step: "02", title: "Target", body: "Tell us your role, level, and locations. We map you to live openings across our network." },
  { step: "03", title: "We Apply", body: "Your team tailors and submits applications around the clock. Track every one in real time." },
  { step: "04", title: "You Prepare", body: "We handle follow-ups, reply tracking, and interview scheduling. You focus on showing up ready." },
];

export const AtelierHowItWorks = () => (
  <section id="how" className="container max-w-7xl py-20">
    <div className="max-w-2xl mb-12">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(8_84%_55%)]">How it flows</p>
      <h2 className="mt-3 atelier-display atelier-display-lg">From upload to offer. You barely lift a finger.</h2>
    </div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((s) => (
        <div key={s.step} className="atelier-card-cream p-7 relative">
          <p className="font-mono text-xs text-[hsl(8_84%_55%)] font-semibold">{s.step}</p>
          <h3 className="mt-3 atelier-display text-xl font-bold">{s.title}</h3>
          <p className="mt-2 text-sm text-[hsl(30_10%_35%)]">{s.body}</p>
        </div>
      ))}
    </div>
  </section>
);
