import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import heroBg from "@/assets/corp-hero-bg.jpg";

export const CorpHero = () => {
  return (
    <section className="relative isolate overflow-hidden min-h-[92vh] flex items-center justify-center">
      {/* Full-bleed editorial background */}
      <img
        src={heroBg}
        alt=""
        width={1920}
        height={1080}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Cinematic darkening + subtle brand tint */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/45 to-black/80" />
      <div
        className="absolute inset-0 -z-10 mix-blend-overlay opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--corp-blue) / 0.25), transparent 60%)",
        }}
      />

      <div className="container relative text-center px-6">
        <div className="text-[11px] sm:text-xs uppercase tracking-[0.4em] text-white/70 font-mono">
          Product Story
        </div>

        <h1 className="mt-6 font-display tracking-tight text-white text-5xl sm:text-7xl md:text-8xl leading-[0.98] max-w-5xl mx-auto">
          The career platform,
          <br />
          <span className="corp-italic">reimagined.</span>
        </h1>

        <p className="mt-8 mx-auto max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed font-light">
          OCAS Software pairs intelligent automation with a dedicated team of
          marketing specialists, recruiters, and coaches — so the right roles
          find you, faster.
        </p>

        <div className="mt-12 flex justify-center">
          <Link
            to="/auth/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-8 py-4 text-sm sm:text-base font-medium shadow-2xl hover:bg-white/90 transition"
          >
            Discover OCAS Software
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-[10px] uppercase tracking-[0.3em] font-mono">
        Scroll
      </div>
    </section>
  );
};
