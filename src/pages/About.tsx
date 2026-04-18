import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CorpHeader } from "@/components/brand/CorpHeader";
import { CorpFooter } from "@/components/brand/CorpFooter";
import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import { useCorpReveal } from "@/hooks/useCorpReveal";
import {
  Heart,
  Shield,
  Sparkles,
  Users,
  Target,
  Zap,
  ArrowUpRight,
} from "lucide-react";

const values = [
  { icon: Heart, t: "Human first", b: "Automation should serve people, not replace them. Every important moment routes back to a human." },
  { icon: Shield, t: "Privacy by default", b: "Your data is yours. Encrypted at rest, scoped by role, never sold." },
  { icon: Sparkles, t: "Quiet excellence", b: "Calm interfaces, clear outcomes. We earn attention by reducing it." },
  { icon: Users, t: "Built with clients", b: "Every feature ships from real conversations with real job seekers." },
  { icon: Target, t: "Outcome obsessed", b: "Vanity metrics don't pay rent. We measure offers signed, not buttons clicked." },
  { icon: Zap, t: "Move with intent", b: "Ship fast, iterate faster. Then polish until it disappears." },
];

const About = () => {
  const ref = useCorpReveal();

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
        <section className="relative isolate overflow-hidden pt-24 pb-20">
          <CorpBackdrop variant="hero" />
          <div className="container relative text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.22em] text-corp-cyan font-semibold mb-4">
              About OCAS
            </p>
            <h1 className="font-display text-5xl md:text-7xl tracking-tight text-corp-text leading-[1.0]">
              We're on a mission to{" "}
              <span className="corp-italic corp-text-gradient">humanize the job search.</span>
            </h1>
            <p className="mt-7 text-corp-muted text-lg">
              OCAS Software LLC builds intelligent automation tools that empower
              career growth — because finding work shouldn't feel like work.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="relative py-20">
          <CorpBackdrop variant="section" />
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-10 corp-reveal">
              <div className="corp-card p-8">
                <p className="text-[10px] uppercase tracking-[0.22em] font-mono text-corp-pink">
                  The problem we saw
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold text-corp-text">
                  Talented people, broken funnel.
                </h2>
                <p className="mt-4 text-sm text-corp-muted leading-relaxed">
                  Our founder watched friends and family spend 40+ hours a week
                  on applications, get zero responses from "black hole"
                  submissions, and slowly lose confidence — while companies
                  drowned in unqualified applicants because ATS systems filtered
                  great candidates out on keyword mismatches.
                </p>
              </div>

              <div className="corp-card p-8">
                <p className="text-[10px] uppercase tracking-[0.22em] font-mono text-corp-cyan">
                  The solution
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold text-corp-text">
                  Automation that serves humans.
                </h2>
                <p className="mt-4 text-sm text-corp-muted leading-relaxed">
                  OCAS — Operational Career Automation System — combines
                  AI-powered automation for scale, human marketing specialists
                  for strategy, real-time analytics for transparency, and ATS
                  optimization for visibility.
                </p>
              </div>
            </div>

            {/* Founder quote */}
            <div className="mt-12 corp-card relative overflow-hidden p-10 md:p-14 text-center corp-reveal">
              <div
                className="absolute inset-0 -z-10 opacity-30 blur-3xl"
                style={{ background: "var(--corp-gradient)" }}
                aria-hidden
              />
              <p className="font-display text-2xl md:text-3xl text-corp-text leading-snug max-w-2xl mx-auto">
                "We're not just building software. We're building confidence,
                opportunity, and career transformation."
              </p>
              <p className="mt-6 text-sm text-corp-muted font-mono">
                — Zaheer, Founder & CEO
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="relative py-20">
          <CorpBackdrop variant="section" />
          <div className="container">
            <div className="max-w-2xl corp-reveal">
              <p className="text-xs uppercase tracking-[0.22em] text-corp-purple font-semibold mb-4">
                Our values
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-corp-text">
                What <span className="corp-text-gradient">drives us</span>.
              </h2>
            </div>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((v, i) => (
                <div
                  key={v.t}
                  className="corp-card p-7 corp-reveal"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="h-11 w-11 rounded-xl corp-gradient-soft border border-corp-border grid place-items-center">
                    <v.icon className="h-5 w-5 text-corp-text" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-corp-text">{v.t}</h3>
                  <p className="mt-2 text-sm text-corp-muted leading-relaxed">{v.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24">
          <div className="container">
            <div className="corp-card p-10 md:p-14 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 -z-10 opacity-40 blur-3xl"
                style={{ background: "var(--corp-gradient)" }}
                aria-hidden
              />
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-corp-text">
                Want to work with us?
              </h2>
              <p className="mt-4 text-corp-muted">
                We're a small, dedicated team obsessed with your career success.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/auth/signup"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white corp-gradient hover:-translate-y-0.5 transition-transform"
                >
                  Start Your Journey <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-corp-text border border-corp-border hover:bg-corp-surface-2 transition-colors"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CorpFooter />
    </div>
  );
};

export default About;
