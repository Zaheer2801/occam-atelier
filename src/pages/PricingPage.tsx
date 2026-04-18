import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CorpHeader } from "@/components/brand/CorpHeader";
import { CorpFooter } from "@/components/brand/CorpFooter";
import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import { useCorpReveal } from "@/hooks/useCorpReveal";
import { Check, Minus, ArrowUpRight, Plus } from "lucide-react";

type Tier = {
  name: string;
  price: { monthly: number; annual: number };
  desc: string;
  cta: string;
  to: string;
  features: string[];
  highlight?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Starter",
    price: { monthly: 49, annual: 39 },
    desc: "For job seekers getting their search organized.",
    cta: "Start free trial",
    to: "/auth/signup",
    features: [
      "Up to 50 auto-applications / month",
      "ATS-optimized resume scan",
      "Application tracking dashboard",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: { monthly: 149, annual: 119 },
    desc: "For serious career moves with hands-on support.",
    cta: "Start Your Journey",
    to: "/auth/signup",
    highlight: true,
    features: [
      "Unlimited auto-applications",
      "Dedicated marketing specialist",
      "Recruiter outreach campaigns",
      "1:1 mock interview sessions",
      "Priority support (2h response)",
      "Real-time analytics & funnel",
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: 0, annual: 0 },
    desc: "For teams, bootcamps, and outplacement.",
    cta: "Talk to sales",
    to: "/contact",
    features: [
      "Everything in Professional",
      "Multi-seat workspace",
      "White-label options",
      "Custom integrations & SSO",
      "Dedicated success manager",
      "SLA-backed uptime",
    ],
  },
];

const compare: { feature: string; values: (boolean | string)[] }[] = [
  { feature: "Auto-applications", values: ["50/mo", "Unlimited", "Unlimited"] },
  { feature: "ATS resume optimization", values: [true, true, true] },
  { feature: "Application dashboard", values: [true, true, true] },
  { feature: "Dedicated specialist", values: [false, true, true] },
  { feature: "Recruiter outreach", values: [false, true, true] },
  { feature: "Mock interviews", values: ["—", "Monthly", "Weekly"] },
  { feature: "Analytics & funnel", values: ["Basic", "Advanced", "Advanced"] },
  { feature: "Priority support", values: ["Email", "2h response", "1h response"] },
  { feature: "Multi-seat workspace", values: [false, false, true] },
  { feature: "SSO & SAML", values: [false, false, true] },
  { feature: "Custom integrations", values: [false, false, true] },
  { feature: "Dedicated CSM", values: [false, false, true] },
];

const faqs = [
  { q: "Do you offer a free trial?", a: "Yes — every paid plan includes a 14-day free trial. No credit card required to start." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel before the trial ends and pay nothing. Monthly plans cancel any time." },
  { q: "What's the difference between Starter and Professional?", a: "Professional adds a dedicated marketing specialist, recruiter outreach, mock interviews, and unlimited applications." },
  { q: "Do you offer student discounts?", a: "Yes — email hello@ocas.software with proof of student status to claim your discount." },
  { q: "Can I switch plans later?", a: "Absolutely. Upgrade or downgrade at any time; changes prorate to your next bill." },
  { q: "What payment methods do you accept?", a: "All major credit cards via Stripe. Enterprise customers can pay by invoice." },
];

const Tick = ({ value }: { value: boolean | string }) => {
  if (value === true) return <Check className="h-4 w-4 text-corp-cyan mx-auto" />;
  if (value === false) return <Minus className="h-4 w-4 text-corp-dim mx-auto" />;
  return <span className="text-sm text-corp-text">{value}</span>;
};

const FaqItem = ({ q, a, i }: { q: string; a: string; i: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="corp-card overflow-hidden corp-reveal" style={{ transitionDelay: `${i * 50}ms` }}>
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="font-display font-semibold text-corp-text">{q}</span>
        <span className="shrink-0 h-7 w-7 rounded-full border border-corp-border grid place-items-center text-corp-muted">
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-corp-muted leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
};

const PricingPage = () => {
  const ref = useCorpReveal();
  const [annual, setAnnual] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.className;
    html.classList.remove("dark");
    return () => {
      html.className = prev;
    };
  }, []);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="corporate min-h-screen flex flex-col">
      <CorpHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden pt-24 pb-12">
          <CorpBackdrop variant="hero" />
          <div className="container relative text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.22em] text-corp-cyan font-semibold mb-4">
              Pricing
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-corp-text leading-[1.05]">
              Simple, transparent <span className="corp-text-gradient">pricing</span>.
            </h1>
            <p className="mt-7 text-corp-muted text-lg">
              Invest in your career with plans designed for every stage of your
              job search. All plans include a 14-day free trial.
            </p>

            {/* Billing toggle */}
            <div className="mt-9 inline-flex items-center gap-1 corp-glass rounded-full p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!annual ? "corp-gradient text-white" : "text-corp-muted hover:text-corp-text"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${annual ? "corp-gradient text-white" : "text-corp-muted hover:text-corp-text"}`}
              >
                Annual <span className="text-[10px] opacity-80">(save 20%)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="relative py-12">
          <div className="container grid md:grid-cols-3 gap-6">
            {tiers.map((t, i) => (
              <div
                key={t.name}
                className={`corp-card p-8 corp-reveal relative ${t.highlight ? "border-corp-purple/50 shadow-[0_30px_80px_-30px_hsl(var(--corp-purple)/0.5)]" : ""}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 corp-gradient text-white text-[10px] uppercase tracking-[0.22em] font-mono px-3 py-1 rounded-full">
                    Most popular
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold text-corp-text">{t.name}</h3>
                <p className="mt-2 text-sm text-corp-muted min-h-[40px]">{t.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  {t.price.monthly === 0 ? (
                    <span className="font-display text-5xl font-extrabold corp-text-gradient">Custom</span>
                  ) : (
                    <>
                      <span className="font-display text-5xl font-extrabold corp-text-gradient">
                        ${annual ? t.price.annual : t.price.monthly}
                      </span>
                      <span className="text-corp-dim text-sm">/mo</span>
                    </>
                  )}
                </div>
                <Link
                  to={t.to}
                  className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                    t.highlight
                      ? "corp-gradient text-white"
                      : "border border-corp-border text-corp-text hover:bg-corp-surface-2"
                  }`}
                >
                  {t.cta} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <ul className="mt-7 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-corp-muted">
                      <Check className="h-4 w-4 text-corp-cyan mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-corp-dim">
            ✓ 14-day free trial &nbsp;•&nbsp; ✓ Cancel anytime &nbsp;•&nbsp; ✓ No hidden fees
          </p>
        </section>

        {/* Comparison */}
        <section className="relative py-20">
          <CorpBackdrop variant="section" />
          <div className="container">
            <div className="text-center max-w-2xl mx-auto corp-reveal">
              <p className="text-xs uppercase tracking-[0.22em] text-corp-purple font-semibold mb-4">
                Compare
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-corp-text">
                Compare <span className="corp-text-gradient">plans</span>.
              </h2>
            </div>
            <div className="mt-10 corp-card overflow-hidden corp-reveal">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-corp-border/60 bg-corp-surface-2/40">
                      <th className="text-left p-4 font-display text-corp-text">Feature</th>
                      {tiers.map((t) => (
                        <th key={t.name} className="text-center p-4 font-display text-corp-text">
                          {t.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compare.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={`border-b border-corp-border/40 ${i % 2 ? "bg-corp-surface-2/20" : ""}`}
                      >
                        <td className="p-4 text-corp-muted">{row.feature}</td>
                        {row.values.map((v, vi) => (
                          <td key={vi} className="p-4 text-center">
                            <Tick value={v} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-20">
          <CorpBackdrop variant="section" />
          <div className="container max-w-3xl">
            <div className="text-center corp-reveal">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-corp-text">
                Pricing questions, <span className="corp-text-gradient">answered</span>.
              </h2>
            </div>
            <div className="mt-10 grid gap-4">
              {faqs.map((f, i) => (
                <FaqItem key={f.q} {...f} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24">
          <div className="container">
            <div className="corp-card p-10 md:p-14 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 -z-10 opacity-40 blur-3xl"
                style={{ background: "var(--corp-gradient)" }}
                aria-hidden
              />
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-corp-text">
                Still not <span className="corp-text-gradient">sure?</span>
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-corp-muted">
                Try us risk-free for 14 days. If you don't love it, cancel before
                the trial ends and pay nothing.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/auth/signup"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white corp-gradient hover:-translate-y-0.5 transition-transform"
                >
                  Start free trial <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-corp-text border border-corp-border hover:bg-corp-surface-2 transition-colors"
                >
                  Talk to sales
                </Link>
              </div>
              <p className="mt-5 text-xs text-corp-dim">
                No credit card required • Cancel anytime • 30-day guarantee
              </p>
            </div>
          </div>
        </section>
      </main>
      <CorpFooter />
    </div>
  );
};

export default PricingPage;
