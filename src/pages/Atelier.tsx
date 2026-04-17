import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Workflow, BarChart3, ShieldCheck, Bot, Inbox, Layers } from "lucide-react";
import { CorpShell } from "@/components/brand/CorpShell";
import { useCorpReveal } from "@/hooks/useCorpReveal";

const features = [
  {
    icon: Bot,
    title: "AI application engine",
    body: "Auto-tailor resumes and cover letters per role with on-brand copy and verifiable claims.",
  },
  {
    icon: Workflow,
    title: "Pipeline automation",
    body: "Apply, track, and nurture across hundreds of openings without spreadsheets or copy-paste fatigue.",
  },
  {
    icon: Inbox,
    title: "Unified inbox",
    body: "Recruiter messages, interview invites, and follow-ups consolidated into a single calm view.",
  },
  {
    icon: BarChart3,
    title: "Outcome analytics",
    body: "See exactly which roles, companies, and channels convert — and where to double down.",
  },
  {
    icon: Layers,
    title: "Role library",
    body: "Curated tracks for software, product, design, and operations roles across markets.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first",
    body: "Your resume and history never train public models. Encrypted at rest and in transit.",
  },
];

const workflow = [
  { step: "01", title: "Onboard", body: "Upload your resume. Atelier parses it into a structured profile in seconds." },
  { step: "02", title: "Target", body: "Pick role tracks. We map them to live openings across our network." },
  { step: "03", title: "Automate", body: "We tailor, submit, and track. You stay in the loop — not the weeds." },
  { step: "04", title: "Land", body: "Interview prep, offer comparisons, and negotiation playbooks built in." },
];

const Atelier = () => {
  const ref = useCorpReveal();
  return (
    <CorpShell variant="hero">
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        {/* Hero */}
        <section className="container pt-16 pb-24 md:pt-24 md:pb-32 corp-reveal">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="corp-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-corp-muted">
                <Sparkles className="h-3.5 w-3.5 text-corp-cyan" />
                <span>OCAS Atelier — for clients & operators</span>
              </div>
              <h1 className="mt-6 font-display text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                <span className="block">The dashboard that</span>
                <span className="block corp-text-sweep">runs your career.</span>
              </h1>
              <p className="mt-6 text-lg text-corp-muted max-w-xl">
                Atelier is the daily workspace for clients, employees, and managers — automating the application pipeline so humans focus on the conversations that matter.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/auth/sign-in"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white corp-gradient shadow-[0_18px_50px_-12px_hsl(var(--corp-purple)/0.6)] hover:-translate-y-0.5 transition-all"
                >
                  Open Atelier
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  to="/auth/sign-up"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-corp-text border border-corp-border hover:border-corp-text/40 hover:bg-corp-surface/40 transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>

            {/* Mock window */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl corp-gradient-soft blur-2xl -z-10" />
              <div className="corp-card relative overflow-hidden corp-scan">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-corp-border bg-corp-surface-2/60">
                  <span className="h-2.5 w-2.5 rounded-full bg-corp-pink/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-corp-cyan/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-corp-purple/80" />
                  <span className="ml-3 text-[11px] font-mono text-corp-dim">atelier.ocas.software / dashboard</span>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-baseline justify-between">
                    <p className="font-display text-xl font-bold">Pipeline overview</p>
                    <p className="text-xs font-mono text-corp-cyan">Live</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { v: "248", l: "Submitted" },
                      { v: "37", l: "Interviews" },
                      { v: "6", l: "Offers" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-xl border border-corp-border bg-corp-bg p-4">
                        <p className="font-display text-2xl font-extrabold corp-text-gradient">{s.v}</p>
                        <p className="text-[11px] text-corp-muted mt-1">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      { c: "Northwind Labs", r: "Senior Frontend Engineer", s: "Interview" },
                      { c: "Helio AI", r: "Product Designer", s: "Submitted" },
                      { c: "Vector & Co", r: "Operations Manager", s: "Offer" },
                    ].map((row) => (
                      <div key={row.c} className="flex items-center justify-between rounded-lg border border-corp-border bg-corp-surface/60 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold">{row.c}</p>
                          <p className="text-xs text-corp-muted">{row.r}</p>
                        </div>
                        <span className="text-[11px] font-mono px-2 py-1 rounded-full border border-corp-border text-corp-cyan">
                          {row.s}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container py-20 corp-reveal">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-corp-cyan">Inside Atelier</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold tracking-tight">
              Every tool your team needs, none of the noise.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="corp-card p-6 hover:border-corp-text/30 transition-colors">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg corp-gradient-soft border border-corp-border">
                  <f.icon className="h-5 w-5 text-corp-text" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-corp-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section className="container py-20 corp-reveal">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-corp-cyan">How it flows</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold tracking-tight">
              From upload to offer, on autopilot.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((w) => (
              <div key={w.step} className="corp-card p-6 relative overflow-hidden">
                <p className="font-mono text-xs text-corp-cyan">{w.step}</p>
                <h3 className="mt-3 font-display text-xl font-bold">{w.title}</h3>
                <p className="mt-2 text-sm text-corp-muted">{w.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container py-20 corp-reveal">
          <div className="relative overflow-hidden rounded-3xl border border-corp-border p-10 md:p-16 text-center">
            <div className="absolute inset-0 -z-10 corp-mesh opacity-80" />
            <div className="absolute inset-0 -z-10 corp-grid-bg opacity-40" />
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
              Open <span className="corp-text-gradient">OCAS Atelier</span>.
            </h2>
            <p className="mt-4 text-corp-muted max-w-xl mx-auto">
              Sign in to your dashboard or create a new client account to get matched with our automation team.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/auth/sign-in"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white corp-gradient shadow-[0_18px_50px_-12px_hsl(var(--corp-purple)/0.6)] hover:-translate-y-0.5 transition-all"
              >
                Launch Atelier
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/brand"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-corp-text border border-corp-border hover:border-corp-text/40 transition-colors"
              >
                View brand system
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CorpShell>
  );
};

export default Atelier;
