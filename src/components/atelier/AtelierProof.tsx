const stats = [
  { n: "50+", l: "Applications placed in 2026 alone" },
  { n: "3×", l: "More recruiter replies vs. solo applicants *" },
  { n: "14 days", l: "Average time to first interview *" },
];

const testimonials = [
  {
    q: "I spent 3 months applying every day and got nowhere. Atelier sent 40 applications in my first week. I had 2 interviews by day 10.",
    n: "Rahul S.",
    r: "Software Engineer · Placed in Dallas, TX",
  },
  {
    q: "The follow-up automation alone changed everything. Recruiters actually remembered me. I stopped feeling invisible.",
    n: "Priya M.",
    r: "Product Manager · Placed in Toronto, CA",
  },
];

export const AtelierProof = () => (
  <section className="container max-w-7xl py-20">
    <div className="grid gap-5 md:grid-cols-3">
      {stats.map((s) => (
        <div key={s.l} className="atelier-card-cream p-8 text-center">
          <p className="atelier-display text-5xl md:text-6xl font-extrabold text-[hsl(8_84%_55%)]">{s.n}</p>
          <p className="mt-3 text-sm text-[hsl(30_10%_35%)]">{s.l}</p>
        </div>
      ))}
    </div>
    <p className="mt-4 text-xs text-[hsl(30_10%_45%)] italic">* Based on beta cohort, Jan–Apr 2026</p>

    <div className="mt-12 grid gap-5 md:grid-cols-2">
      {testimonials.map((t) => (
        <div key={t.n} className="atelier-card-cream p-8">
          <p className="atelier-display text-6xl leading-none text-[hsl(8_84%_55%)]">“</p>
          <p className="mt-2 italic text-[15px] leading-relaxed text-[hsl(30_10%_20%)]">{t.q}</p>
          <p className="mt-5 font-bold text-[hsl(30_10%_10%)]">{t.n}</p>
          <p className="text-xs text-[hsl(30_10%_45%)]">{t.r}</p>
        </div>
      ))}
    </div>
  </section>
);