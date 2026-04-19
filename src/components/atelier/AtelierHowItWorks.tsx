const steps = [
  { step: "01", title: "Onboard", body: "Upload your resume — Atelier parses it into a structured profile in seconds." },
  { step: "02", title: "Target", body: "Pick role tracks. We map them to live openings across our network." },
  { step: "03", title: "Automate", body: "We tailor, submit, and track. You stay in the loop — not the weeds." },
  { step: "04", title: "Land", body: "Interview prep, offer comparison, and negotiation playbooks built in." },
];

export const AtelierHowItWorks = () => (
  <section id="how" className="container max-w-7xl py-20">
    <div className="max-w-2xl mb-12">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(8_84%_55%)]">How it flows</p>
      <h2 className="mt-3 atelier-display atelier-display-lg">From upload to offer, on autopilot.</h2>
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
