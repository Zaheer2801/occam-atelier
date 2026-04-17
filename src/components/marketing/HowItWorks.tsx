const steps = [
  { n: "01", t: "Upload & analyze", d: "Share your resume and goals. AI builds your profile in seconds." },
  { n: "02", t: "Automate applications", d: "We auto-apply to relevant roles with tailored cover letters." },
  { n: "03", t: "Track & optimize", d: "Monitor progress in real time and refine your strategy with data." },
];

export const HowItWorks = () => (
  <section id="how" className="container py-24">
    <div className="text-center max-w-2xl mx-auto mb-14">
      <p className="text-sm font-medium text-primary mb-3">How it works</p>
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
        Three steps to <span className="text-gradient">your next role</span>
      </h2>
    </div>
    <div className="relative grid gap-6 md:grid-cols-3">
      <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      {steps.map((s) => (
        <div key={s.n} className="relative text-center">
          <div className="relative z-10 mx-auto h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow font-display font-bold text-primary-foreground">
            {s.n}
          </div>
          <h3 className="font-display font-semibold text-xl mt-6">{s.t}</h3>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm">{s.d}</p>
        </div>
      ))}
    </div>
  </section>
);
