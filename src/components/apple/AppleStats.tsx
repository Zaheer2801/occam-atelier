const stats = [
  { value: "12k+", label: "Applications submitted" },
  { value: "3.4×", label: "More interview calls" },
  { value: "27 days", label: "Average time to offer" },
  { value: "92%", label: "Client satisfaction" },
];

export const AppleStats = () => (
  <section className="py-20 bg-[hsl(var(--apple-surface-2))]">
    <div className="container max-w-6xl">
      <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="apple-display text-4xl sm:text-5xl text-[hsl(var(--apple-ink))]">
              {s.value}
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--apple-muted))] uppercase tracking-wider">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
