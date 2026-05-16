import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import character from "@/assets/atelier-character.png";
import spiral from "@/assets/atelier-deco-spiral.png";

export const AtelierHero = () => (
  <section className="container max-w-7xl pt-10 pb-16 md:pt-14 md:pb-24">
    <div className="atelier-card-yellow relative overflow-hidden p-8 sm:p-12 md:p-16 min-h-[600px]">
      {/* corner squares decoration (top-right) */}
      <div className="absolute top-6 right-6 grid grid-cols-2 gap-1.5 z-20">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="h-3 w-3 rounded-sm bg-[hsl(8_84%_60%)]" />
        ))}
      </div>

      {/* floating spiral top */}
      <img
        src={spiral}
        alt=""
        aria-hidden
        loading="eager"
        width={220}
        height={220}
        className="absolute top-2 left-1/3 w-32 sm:w-44 md:w-52 atelier-float-slow pointer-events-none select-none z-10"
      />

      {/* small floating coin bottom-left */}
      <img
        src={spiral}
        alt=""
        aria-hidden
        loading="lazy"
        width={120}
        height={120}
        className="absolute -left-4 bottom-6 w-20 md:w-28 atelier-float pointer-events-none select-none opacity-90 z-10"
        style={{ filter: "hue-rotate(60deg)" }}
      />

      <div className="relative z-10 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div>
          <p className="atelier-display text-2xl font-extrabold mb-12">Atelier by OCAS</p>
          <h1 className="atelier-display atelier-display-xl">
            Stop applying.
          </h1>
          <p className="mt-3 text-2xl sm:text-3xl font-light text-[hsl(30_10%_15%)]">
            Start landing.
          </p>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[hsl(30_10%_20%)]">
            Most job seekers burn 6–8 hours a day on applications — exhausted before the
            interview even starts. Atelier gives you a team of recruiters, marketers, and
            AI that applies, follows up, and tracks results on your behalf. You just prepare.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link to="/auth/signup" className="atelier-cta-coral">
              Get My Team
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/auth/signin" className="atelier-cta-ink">
              Sign in to portal
            </Link>
          </div>
        </div>

        {/* character */}
        <div className="relative flex justify-center md:justify-end">
          <img
            src={character}
            alt="Atelier character — your career partner"
            width={1024}
            height={1024}
            className="w-full max-w-[460px] md:max-w-[520px] atelier-bob drop-shadow-[0_30px_40px_rgba(0,0,0,0.18)]"
          />
        </div>
      </div>
    </div>
  </section>
);
