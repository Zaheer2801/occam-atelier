import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar } from "lucide-react";

export const CorpCTA = () => (
  <section id="get-started" className="relative py-28">
    <div className="container">
      <div className="relative overflow-hidden corp-card p-10 md:p-16 text-center">
        <div
          className="absolute inset-0 -z-10 opacity-40 blur-3xl"
          style={{ background: "var(--corp-gradient)" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 corp-grid-bg opacity-50" />

        <h2 className="font-display text-4xl md:text-6xl tracking-tight text-corp-text max-w-3xl mx-auto leading-[1.05]">
          Ready to transform <span className="corp-italic corp-text-gradient">your job search?</span>
        </h2>
        <p className="mt-5 max-w-xl mx-auto text-corp-muted text-lg">
          Join career professionals who've landed their dream roles with us.
          Start today — no credit card required.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auth/signup"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white corp-gradient hover:-translate-y-0.5 transition-transform"
          >
            Start Your Journey
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-corp-text border border-corp-border hover:bg-corp-surface-2 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Schedule a Demo
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-corp-dim">
          <span>✓ Setup in 5 minutes</span>
          <span>✓ Cancel anytime</span>
          <span>✓ No credit card required</span>
        </div>
      </div>
    </div>
  </section>
);
