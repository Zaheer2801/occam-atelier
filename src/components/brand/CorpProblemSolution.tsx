import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import { AlertTriangle, Clock, EyeOff, TrendingDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const pains = [
  {
    icon: Clock,
    title: "Hours wasted on applications",
    body: "40+ hours a week filling out the same forms — with nothing to show for it.",
  },
  {
    icon: EyeOff,
    title: '"Black hole" submissions',
    body: "Resumes vanish into ATS systems and never get a human read.",
  },
  {
    icon: TrendingDown,
    title: "Confidence eroding",
    body: "Endless rejections turn a job hunt into a months-long grind.",
  },
];

export const CorpProblemSolution = () => (
  <section className="relative py-24">
    <CorpBackdrop variant="section" />
    <div className="container">
      <div className="max-w-3xl mx-auto text-center corp-reveal">
        <p className="text-xs uppercase tracking-[0.22em] text-corp-pink font-semibold mb-4">
          The Problem
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-corp-text">
          The job search is broken.{" "}
          <span className="corp-text-gradient">We fixed it.</span>
        </h2>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {pains.map((p, i) => (
          <div
            key={p.title}
            className="corp-card p-7 corp-reveal"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="h-11 w-11 rounded-xl border border-corp-border bg-corp-surface-2/60 grid place-items-center">
              <p.icon className="h-5 w-5 text-corp-pink" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-corp-text">{p.title}</h3>
            <p className="mt-2 text-sm text-corp-muted leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>

      {/* Solution band */}
      <div className="mt-16 corp-reveal corp-card relative overflow-hidden p-8 md:p-12">
        <div
          className="absolute -top-32 -left-32 w-[460px] h-[460px] rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--corp-gradient)" }}
          aria-hidden
        />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 corp-glass rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-mono text-corp-cyan">
              <AlertTriangle className="h-3 w-3" />
              There's a better way
            </div>
            <h3 className="mt-5 font-display text-3xl md:text-4xl font-extrabold tracking-tight text-corp-text">
              AI-powered automation, paired with human expertise.
            </h3>
            <p className="mt-4 text-corp-muted max-w-2xl">
              Upload your resume once. Our system and dedicated marketing
              specialists handle the rest — while you focus on preparing for
              interviews.
            </p>
          </div>
          <Link
            to="/auth/signup"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white corp-gradient hover:-translate-y-0.5 transition-transform whitespace-nowrap"
          >
            See how it works <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);
