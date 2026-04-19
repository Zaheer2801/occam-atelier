const stats = [
  { value: "12k+", label: "Applications submitted" },
  { value: "3.4×", label: "More interview calls" },
  { value: "27 days", label: "Average time to offer" },
  { value: "92%", label: "Client satisfaction" },
];

export const AppleStats = () => (
  <section className="py-24 bg-[hsl(var(--apple-surface-2))] border-y border-[hsl(var(--apple-line))]">
    <div className="container max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="apple-eyebrow uppercase">By the numbers</p>
        <h2 className="apple-display apple-display-lg mt-3 text-[hsl(var(--apple-ink))]">
          Outcomes, not promises.
        </h2>
      </div>
      <div className="grid gap-y-12 sm:grid-cols-2 md:grid-cols-4 text-center divide-x divide-[hsl(var(--apple-line))]">
        {stats.map((s) => (
          <div key={s.label} className="px-4">
            <div className="apple-display text-4xl sm:text-5xl text-[hsl(var(--apple-ink))]">
              {s.value}
            </div>
            <p className="mt-2 text-[12px] text-[hsl(var(--apple-muted))] uppercase tracking-[0.18em]">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
