import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export const CorpCTA = () => (
  <section id="about" className="relative py-28">
    <div className="container">
      <div className="relative overflow-hidden corp-card p-10 md:p-16 text-center">
        <div
          className="absolute inset-0 -z-10 opacity-40 blur-3xl"
          style={{ background: "var(--corp-gradient)" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 corp-grid-bg opacity-50" />

        <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-corp-text max-w-3xl mx-auto leading-tight">
          Build the career <span className="corp-text-gradient">you actually want.</span>
        </h2>
        <p className="mt-5 max-w-xl mx-auto text-corp-muted text-lg">
          Sign in to OCAS Atelier and let the workspace do the heavy lifting.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auth/signin"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white corp-gradient hover:-translate-y-0.5 transition-transform"
          >
            Launch Atelier
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <a
            href="mailto:hello@ocas.software"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-corp-text border border-corp-border hover:bg-corp-surface-2 transition-colors"
          >
            Talk to us
          </a>
        </div>
      </div>
    </div>
  </section>
);
