import { Link } from "react-router-dom";
import { OcasLogo } from "@/components/brand/OcasLogo";
import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const CorpHero = () => {
  return (
    <section className="relative isolate overflow-hidden pt-20 pb-32 md:pt-28 md:pb-40">
      <CorpBackdrop variant="hero" />

      <div className="container relative">
        {/* eyebrow */}
        <div className="flex justify-center">
          <div className="corp-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-corp-muted">
            <Sparkles className="h-3.5 w-3.5 text-corp-cyan" />
            <span>Automation for Human Potential</span>
          </div>
        </div>

        {/* animated logo above headline */}
        <div className="mt-10 flex justify-center">
          <div className="relative">
            {/* halo */}
            <div
              className="absolute inset-0 -z-10 corp-pulse-soft rounded-full"
              style={{ boxShadow: "var(--corp-glow-purple)" }}
            />
            <OcasLogo variant="connected" mode="color" size={88} animate showWordmark={false} />
            {/* orbiting accents */}
            <span className="pointer-events-none absolute left-1/2 top-1/2 -ml-1 -mt-1 block h-2 w-2 rounded-full bg-corp-cyan corp-orbit" />
            <span className="pointer-events-none absolute left-1/2 top-1/2 -ml-1 -mt-1 block h-1.5 w-1.5 rounded-full bg-corp-pink corp-orbit-slow" />
          </div>
        </div>

        {/* headline */}
        <h1 className="mt-10 text-center font-display font-extrabold tracking-tight text-5xl md:text-7xl leading-[1.05]">
          <span className="block text-corp-text">The intelligent</span>
          <span className="block corp-text-sweep">automation company</span>
          <span className="block text-corp-text">powering careers.</span>
        </h1>

        <p className="mt-7 mx-auto max-w-2xl text-center text-lg text-corp-muted">
          OCAS Software is a full-service IT careers firm — staffing, coaching,
          resume marketing, and on-the-job support — built around a modern
          workspace for clients and teams.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/right-job"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white corp-gradient shadow-[0_18px_50px_-12px_hsl(var(--corp-purple)/0.6)] hover:shadow-[0_22px_60px_-12px_hsl(var(--corp-purple)/0.8)] transition-all hover:-translate-y-0.5"
          >
            Get started
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <a
            href="#products"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-corp-text border border-corp-border/80 hover:border-corp-text/40 hover:bg-corp-surface/40 transition-colors"
          >
            Explore services
          </a>
        </div>

        {/* trust strip */}
        <div className="mt-16 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.22em] text-corp-dim">
          <span className="h-px w-10 bg-corp-border" />
          <span>Trusted by career professionals worldwide</span>
          <span className="h-px w-10 bg-corp-border" />
        </div>

        {/* logo marquee */}
        <div className="mt-6 overflow-hidden mask-gradient">
          <div className="corp-marquee flex gap-14 whitespace-nowrap text-corp-dim">
            {[...Array(2)].flatMap((_, k) =>
              ["Northwind", "Stripeline", "Helio Labs", "Vector & Co", "Quantica", "Nimbus AI", "Fieldnote", "Lumen Studio"].map((b) => (
                <span key={`${k}-${b}`} className="font-display text-2xl tracking-tight opacity-60">
                  {b}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
