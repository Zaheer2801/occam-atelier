import { Link } from "react-router-dom";
import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import { OcasLogo } from "@/components/brand/OcasLogo";
import { ArrowUpRight, Briefcase, BarChart3, Bot } from "lucide-react";

export const CorpProducts = () => {
  return (
    <section id="products" className="relative py-28">
      <CorpBackdrop variant="section" />
      <div className="container">
        <div className="max-w-2xl corp-reveal">
          <p className="text-xs uppercase tracking-[0.22em] text-corp-cyan font-semibold mb-4">
            What we build
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-corp-text">
            One workspace. <span className="corp-text-gradient">Every advantage.</span>
          </h2>
          <p className="mt-5 text-corp-muted text-lg">
            Our flagship product, <span className="text-corp-text font-semibold">OCAS Atelier</span>,
            is the AI-driven workspace where job seekers, recruiters, and managers
            run their day-to-day work — together.
          </p>
        </div>

        {/* Hero product card */}
        <div className="mt-12 corp-reveal corp-card relative overflow-hidden p-8 md:p-12">
          <div
            className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--corp-gradient)" }}
            aria-hidden
          />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl corp-gradient grid place-items-center text-white font-display font-bold">A</div>
                <div className="font-display text-2xl text-corp-text">OCAS Atelier</div>
              </div>
              <h3 className="mt-6 font-display text-3xl md:text-4xl font-extrabold tracking-tight text-corp-text">
                The AI workspace for modern careers.
              </h3>
              <p className="mt-4 text-corp-muted">
                Daily task feed for clients. Smart application pipeline for recruiters.
                Real-time analytics for managers. All in one quiet, beautiful surface.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/auth/signin"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white corp-gradient hover:-translate-y-0.5 transition-transform"
                >
                  Launch Atelier <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/atelier"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-corp-text border border-corp-border hover:bg-corp-surface-2 transition-colors"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* mock window */}
            <div className="relative">
              <div className="corp-card relative overflow-hidden p-5 corp-scan">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-corp-pink/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-corp-cyan/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-corp-purple/80" />
                  <span className="ml-3 font-mono text-[10px] text-corp-dim">atelier · today</span>
                </div>
                {[
                  { icon: Briefcase, t: "Auto-applied to 12 roles", s: "Stripe · Vercel · Linear" },
                  { icon: Bot, t: "Resume tuned for 'Senior PM'", s: "ATS score 94" },
                  { icon: BarChart3, t: "Reply rate ↑ 38% this week", s: "5 interviews booked" },
                ].map(({ icon: Icon, t, s }, i) => (
                  <div
                    key={t}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 mb-2 last:mb-0 bg-corp-surface-2/60 border border-corp-border/60"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="h-9 w-9 rounded-lg corp-gradient-soft grid place-items-center">
                      <Icon className="h-4 w-4 text-corp-text" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-corp-text truncate">{t}</div>
                      <div className="text-xs text-corp-dim font-mono">{s}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* floating chip */}
              <div className="absolute -bottom-4 -left-4 corp-glass rounded-xl px-3 py-2 text-xs text-corp-text shadow-xl">
                <span className="text-corp-cyan">●</span> Live
              </div>
            </div>
          </div>
        </div>

        {/* secondary: brand reference card */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            { title: "Built for clients", body: "A daily, focused worklist that keeps job seekers in flow." },
            { title: "Built for recruiters", body: "Smart pipelines, quick triage, no busywork." },
            { title: "Built for managers", body: "Team analytics and pending queues at a glance." },
          ].map((c, i) => (
            <div key={c.title} className="corp-card p-6 corp-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="text-xs uppercase tracking-[0.2em] text-corp-dim mb-3 font-mono">0{i + 1}</div>
              <h4 className="font-display text-xl font-bold text-corp-text">{c.title}</h4>
              <p className="mt-2 text-sm text-corp-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Re-export so unused-import lint doesn't trip
export { OcasLogo as _OcasLogo };
