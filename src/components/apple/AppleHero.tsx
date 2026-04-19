import { Link } from "react-router-dom";
import heroImg from "@/assets/apple-hero.jpg";

export const AppleHero = () => (
  <section className="relative pt-20 pb-10 text-center overflow-hidden">
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
      <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
        <Link to="/features" className="apple-cta">
          Learn more
        </Link>
        <Link to="/pricing" className="apple-cta-ghost">
          See pricing <span aria-hidden>›</span>
        </Link>
      </div>
    </div>

    <div className="container max-w-6xl mt-14">
      <div className="rounded-[28px] overflow-hidden border border-[hsl(var(--apple-line))] shadow-[0_40px_80px_-40px_hsl(220_13%_9%/0.25)]">
        <img
          src={heroImg}
          alt="OCAS Software product preview"
          width={1920}
          height={1280}
          className="w-full h-auto block"
        />
      </div>
    </div>
  </section>
);
