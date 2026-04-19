import { Link } from "react-router-dom";
import heroImg from "@/assets/apple-hero.jpg";

export const AppleHero = () => (
  <section className="relative pt-24 pb-12 text-center overflow-hidden">
    {/* Soft ambient gradient backdrop */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[620px] -z-10"
      style={{
        background:
          "radial-gradient(60% 50% at 50% 0%, hsl(var(--apple-accent) / 0.10), transparent 70%), linear-gradient(180deg, hsl(var(--apple-surface-2)) 0%, transparent 100%)",
      }}
    />

    <div className="container max-w-5xl">
      <p className="apple-eyebrow uppercase">OCAS Software LLC</p>
      <h1 className="apple-display apple-display-xl mt-3 text-[hsl(var(--apple-ink))]">
        The career platform,
        <br />
        <span className="text-[hsl(var(--apple-muted))]">reimagined.</span>
      </h1>
      <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-[hsl(var(--apple-ink-soft))] leading-relaxed">
        Intelligent automation paired with a dedicated team of marketing
        specialists, recruiters, and coaches — so the right roles find you,
        faster.
      </p>
      <div className="mt-9 flex items-center justify-center gap-6 flex-wrap">
        <Link to="/features" className="apple-cta">
          Learn more
        </Link>
        <Link to="/pricing" className="apple-cta-ghost">
          See pricing <span aria-hidden>›</span>
        </Link>
      </div>

      {/* Trust strip */}
      <div className="mt-10 flex items-center justify-center gap-6 text-[12px] text-[hsl(var(--apple-muted))]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live onboarding
        </span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">No long-term contract</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">Cancel anytime</span>
      </div>
    </div>

    <div className="container max-w-6xl mt-14">
      <div className="rounded-[28px] overflow-hidden border border-[hsl(var(--apple-line))] shadow-[0_40px_80px_-40px_hsl(220_13%_9%/0.25)] bg-white">
        <img
          src={heroImg}
          alt="OCAS Software product preview"
          width={1920}
          height={1080}
          className="w-full h-auto block"
        />
      </div>
    </div>
  </section>
);
