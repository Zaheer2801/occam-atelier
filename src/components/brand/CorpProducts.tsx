import { Link } from "react-router-dom";
import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import {
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  FileText,
  LifeBuoy,
  LayoutDashboard,
  Users,
} from "lucide-react";

type Service = {
  icon: typeof Briefcase;
  tag: string;
  title: string;
  body: string;
  bullets: string[];
};

const services: Service[] = [
  {
    icon: Briefcase,
    tag: "Staffing",
    title: "IT Staffing & Placements",
    body: "We connect ambitious engineers, analysts, and product folks with roles at growth-stage companies across the US.",
    bullets: ["Full-stack, Cloud, Data, Security", "W2 & C2C engagements", "Direct hire & contract"],
  },
  {
    icon: GraduationCap,
    tag: "Training",
    title: "Career Coaching & Training",
    body: "Hands-on coaching that turns experience into offers — interview drills, role positioning, and market intel.",
    bullets: ["1:1 mock interviews", "Role-tailored prep tracks", "Salary & negotiation playbooks"],
  },
  {
    icon: FileText,
    tag: "Marketing",
    title: "Resume & Profile Marketing",
    body: "ATS-optimized resumes, LinkedIn rewrites, and targeted outreach so the right recruiters find you first.",
    bullets: ["Keyword & ATS tuning", "LinkedIn + portfolio polish", "Targeted recruiter outreach"],
  },
  {
    icon: LifeBuoy,
    tag: "Support",
    title: "On-the-Job Support",
    body: "Once you're placed, our senior bench is on call to help you ramp and ship in your first 90 days.",
    bullets: ["Senior mentor on-call", "Architecture & code review", "Stay-onboarding playbook"],
  },
];

export const CorpProducts = () => {
  return (
    <section id="products" className="relative py-28">
      <CorpBackdrop variant="section" />
      <div className="container">
        <div className="max-w-2xl corp-reveal">
          <p className="text-xs uppercase tracking-[0.22em] text-corp-cyan font-semibold mb-4">
            What we do
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-corp-text">
            A full stack of <span className="corp-text-gradient">career services</span>.
          </h2>
          <p className="mt-5 text-corp-muted text-lg">
            OCAS Software pairs an expert services team with a modern client
            workspace so candidates, recruiters, and managers can win — together.
          </p>
        </div>

        {/* Services grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="corp-card p-7 corp-reveal hover:border-corp-purple/40 transition-colors"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl corp-gradient-soft border border-corp-border grid place-items-center shrink-0">
                  <s.icon className="h-5 w-5 text-corp-text" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.22em] font-mono text-corp-cyan">
                    {s.tag}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-corp-text">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-corp-muted leading-relaxed">{s.body}</p>
                  <ul className="mt-4 space-y-1.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-corp-muted">
                        <span className="h-1 w-1 rounded-full bg-corp-purple" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured: client workspace */}
        <div className="mt-16 corp-reveal corp-card relative overflow-hidden p-8 md:p-12">
          <div
            className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--corp-gradient)" }}
            aria-hidden
          />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] font-mono text-corp-cyan">
                Inside the workspace
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl corp-gradient grid place-items-center text-white">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div className="font-display text-2xl text-corp-text">Client Workspace</div>
              </div>
              <h3 className="mt-6 font-display text-3xl md:text-4xl font-extrabold tracking-tight text-corp-text">
                One quiet workspace for every career.
              </h3>
              <p className="mt-4 text-corp-muted">
                Where our clients track applications, recruiters run pipelines,
                and managers see the full picture in real time.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/auth/signin"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white corp-gradient hover:-translate-y-0.5 transition-transform"
                >
                  Sign in <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/atelier"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-corp-text border border-corp-border hover:bg-corp-surface-2 transition-colors"
                >
                  Take a tour
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
                  <span className="ml-3 font-mono text-[10px] text-corp-dim">portal · today</span>
                </div>
                {[
                  { icon: Briefcase, t: "Auto-applied to 12 roles", s: "Stripe · Vercel · Linear" },
                  { icon: Users, t: "3 recruiter intros booked", s: "Northwind · Helio · Vector" },
                  { icon: LayoutDashboard, t: "Reply rate ↑ 38% this week", s: "5 interviews scheduled" },
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
              <div className="absolute -bottom-4 -left-4 corp-glass rounded-xl px-3 py-2 text-xs text-corp-text shadow-xl">
                <span className="text-corp-cyan">●</span> Live
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
