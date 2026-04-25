import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

/**
 * Years-in-business kinetic counter.
 * Established 2019 → live count.
 */
const useYearsSince = (year: number) => {
  const [years, setYears] = useState(0);
  useEffect(() => {
    const target = new Date().getFullYear() - year;
    let start = 0;
    const dur = 1400;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setYears(Math.round(start + (target - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [year]);
  return years;
};

export const OcasHero = ({ onCommand }: { onCommand?: () => void }) => {
  const years = useYearsSince(2019);
  const heroRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on headline
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--mx", `${x * 6}px`);
      el.style.setProperty("--my", `${y * 6}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden pt-20 pb-32"
    >
      {/* Layered backdrops */}
      <div className="absolute inset-0 -z-30 ocas-mesh-bg" />
      <div className="absolute inset-0 -z-20 ocas-grid-bg opacity-60" />
      <div className="absolute inset-0 -z-10 ocas-noise opacity-40" />
      <div className="ocas-orb ocas-orb-cyan w-[520px] h-[520px] -top-40 -left-40 ocas-drift" />
      <div
        className="ocas-orb ocas-orb-violet w-[440px] h-[440px] top-10 -right-32 ocas-drift"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="ocas-orb ocas-orb-pink w-[360px] h-[360px] bottom-0 left-1/3 ocas-drift"
        style={{ animationDelay: "-12s" }}
      />

      {/* Established 2022 badge */}
      <div className="absolute top-6 right-6 z-10 hidden md:flex items-center gap-2 ocas-glass px-3 py-2 rounded-full">
        <span className="ocas-pulse-dot w-2 h-2 rounded-full bg-[hsl(var(--ocas-cyan))]" />
        <span className="ocas-mono text-[10px] tracking-[0.18em] ocas-text-soft uppercase">
          Est. OCAS LLC · 2022
        </span>
      </div>

      <div className="container max-w-6xl text-center relative">
        <div className="inline-flex items-center gap-2 ocas-eyebrow mx-auto">
          <span className="ocas-eyebrow-dot" />
          Building the future of work · {new Date().getFullYear()}
        </div>

        <h1
          className="ocas-display ocas-display-xl mt-6 max-w-5xl mx-auto"
          style={{
            transform: "translate(var(--mx, 0), var(--my, 0))",
            transition: "transform .12s ease-out",
          }}
        >
          Powering{" "}
          <span className="ocas-text-sweep">AI innovation</span>{" "}
          &amp; global careers
          <br />
          <span className="ocas-text-soft">since</span>{" "}
          <span className="ocas-mono text-[hsl(var(--ocas-cyan))] font-bold">
            {years > 0 ? years + " yrs" : "—"}
          </span>
          <span className="ocas-text-soft"> ago.</span>
        </h1>

        <p className="mt-7 mx-auto max-w-2xl text-lg sm:text-xl ocas-text-soft leading-relaxed">
          OCAS Software builds agentic AI tools, upskills the next-gen
          workforce, and bridges talent to the US market — engineered by a team
          that has shipped since 2019.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/auth/signup" className="ocas-cta">
            Start your journey <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button type="button" onClick={onCommand} className="ocas-cta-ghost">
            <Sparkles className="h-4 w-4" /> Ask &amp; Act
          </button>
        </div>

        {/* Stat strip */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { v: years > 0 ? years + "+" : "—", l: "Years shipping" },
            { v: "1.2k+", l: "Careers launched" },
            { v: "48", l: "US tech hubs" },
            { v: "24/7", l: "AI agents on" },
          ].map((s) => (
            <div
              key={s.l}
              className="ocas-glass px-4 py-3 rounded-2xl text-left"
            >
              <div className="ocas-mono text-xl font-semibold text-white">
                {s.v}
              </div>
              <div className="text-[11px] ocas-text-muted uppercase tracking-[0.16em] mt-1">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};