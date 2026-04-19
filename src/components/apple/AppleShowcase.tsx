import { Link } from "react-router-dom";

export const AppleShowcase = () => (
  <section className="py-12">
    <div className="container max-w-7xl">
      <div className="max-w-2xl mb-10">
        <p className="apple-eyebrow uppercase">Two products. One platform.</p>
        <h2 className="apple-display apple-display-lg mt-3 text-[hsl(var(--apple-ink))]">
          Pick how you want
          <br />
          <span className="text-[hsl(var(--apple-muted))]">to land your next role.</span>
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
      {/* Dark tile — Atelier product */}
      <article className="apple-tile-dark p-10 sm:p-14 flex flex-col justify-between min-h-[460px] relative overflow-hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-3">Atelier</p>
          <h2 className="apple-display apple-display-lg">
            Your personal
            <br />
            career department.
          </h2>
          <p className="mt-5 max-w-md text-white/70 leading-relaxed">
            A pod of marketers, recruiters and coaches — backed by smart
            automation — applying, tracking, and following up on your behalf.
          </p>
        </div>
        <div className="mt-8 flex items-center gap-6">
          <Link to="/atelier" className="apple-cta-ghost text-white">
            Explore Atelier <span aria-hidden>›</span>
          </Link>
          <Link to="/features" className="apple-cta-ghost text-white/70 hover:text-white">
            What's included <span aria-hidden>›</span>
          </Link>
        </div>
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "hsl(211 100% 60%)" }}
        />
      </article>

      {/* Light tile — Right Job */}
      <article className="apple-card p-10 sm:p-14 flex flex-col justify-between min-h-[460px] relative overflow-hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--apple-muted))] mb-3">
            Right Job
          </p>
          <h2 className="apple-display apple-display-lg text-[hsl(var(--apple-ink))]">
            Land the role
            <br />
            you actually want.
          </h2>
          <p className="mt-5 max-w-md text-[hsl(var(--apple-ink-soft))] leading-relaxed">
            Curated opportunities, tailored applications, and real-time
            visibility into every reply, interview, and offer.
          </p>
        </div>
        <div className="mt-8 flex items-center gap-6">
          <Link to="/right-job" className="apple-cta-ghost">
            Explore Right Job <span aria-hidden>›</span>
          </Link>
          <Link to="/pricing" className="apple-cta-ghost text-[hsl(var(--apple-muted))] hover:text-[hsl(var(--apple-accent))]">
            Pricing <span aria-hidden>›</span>
          </Link>
        </div>
        <div
          className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "hsl(46 96% 58%)" }}
        />
      </article>
      </div>
    </div>
  </section>
);
