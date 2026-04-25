const ITEMS = [
  "AI Lab",
  "Agentic Workflows",
  "RAG · Tool-use",
  "Career Bridge",
  "US Placements",
  "ATS-tuned Resumes",
  "LinkedIn Marketing",
  "Recruiter Outreach",
  "Live Coaching",
  "Salary Negotiation",
  "On-the-Job Support",
  "Established 2019",
];

export const OcasMarquee = () => (
  <section className="relative py-12 border-y border-white/5 bg-white/[0.015] overflow-hidden">
    <div className="container max-w-6xl">
      <p className="text-center ocas-mono text-[10px] tracking-[0.22em] uppercase ocas-text-dim mb-6">
        Trusted across teams, industries, and time zones
      </p>
    </div>
    <div className="relative">
      <div className="ocas-marquee flex gap-10 whitespace-nowrap min-w-[200%]">
        {[...ITEMS, ...ITEMS].map((it, i) => (
          <div
            key={i}
            className="flex items-center gap-3 ocas-text-soft text-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--ocas-cyan))]" />
            <span className="ocas-mono uppercase tracking-[0.16em] text-[11px]">
              {it}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[hsl(var(--ocas-bg))] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[hsl(var(--ocas-bg))] to-transparent" />
    </div>
  </section>
);