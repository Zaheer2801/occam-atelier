const stats = [
  { value: "50+", label: "Applications placed in 2026 alone" },
  { value: "3×", label: "More recruiter replies vs. solo applicants *" },
  { value: "14 days", label: "Average time to first interview *" },
];

const quotes = [
  {
    quote:
      "I spent 3 months applying every day and got nowhere. Atelier sent 40 applications in my first week. I had 2 interviews by day 10.",
    name: "Rahul S.",
    role: "Software Engineer · Placed in Dallas, TX",
  },
  {
    quote:
      "The follow-up automation alone changed everything. Recruiters actually remembered me. I stopped feeling invisible.",
    name: "Priya M.",
    role: "Product Manager · Placed in Toronto, CA",
  },
];

export const AtelierProof = () => (
  <section className="container max-w-7xl py-20">
    <div className="grid gap-5 md:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="atelier-card-cream p-8">
          <p className="atelier-display text-5xl md:text-6xl font-extrabold text-[hsl(8_84%_55%)]">
            {s.value}
          </p>
          <p className="mt-3 text-sm text-[hsl(30_10%_35%)]">{s.label}</p>
        </div>
      ))}
    </div>
    <p className="mt-4 text-xs text-[hsl(30_10%_45%)]">* Based on beta cohort, Jan–Apr 2026</p>

    <div className="mt-12 grid gap-5 md:grid-cols-2">
      {quotes.map((q) => (
        <div key={q.name} className="atelier-card-cream p-8">
          <span className="atelier-display text-6xl leading-none text-[hsl(8_84%_55%)]">"</span>
          <p className="mt-2 italic text-[hsl(30_10%_20%)] leading-relaxed">{q.quote}</p>
          <p className="mt-6 font-bold text-[hsl(30_10%_10%)]">{q.name}</p>
          <p className="text-sm text-[hsl(30_10%_40%)]">{q.role}</p>
        </div>
      ))}
    </div>
  </section>
);