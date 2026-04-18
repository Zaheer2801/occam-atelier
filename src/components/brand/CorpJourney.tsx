import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import act1 from "@/assets/journey/act-1-struggle.png";
import act2 from "@/assets/journey/act-2-connection.png";
import act3 from "@/assets/journey/act-3-strategy.png";
import act4 from "@/assets/journey/act-4-momentum.png";
import act5 from "@/assets/journey/act-5-success.png";

type Act = {
  id: number;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  /** background gradient (Tailwind classes inside .corporate scope) */
  bg: string;
};

const ACTS: Act[] = [
  {
    id: 1,
    eyebrow: "Who we are",
    title: "Reaching the right platform",
    body:
      "OCAS Software LLC turns the chaos of the modern job search into a clear, accountable system — so the work you put in actually compounds.",
    image: act1,
    bg: "from-slate-900 via-slate-800 to-slate-900",
  },
  {
    id: 2,
    eyebrow: "What we do",
    title: "Connecting to the right team",
    body:
      "A dedicated marketing pod — real humans backed by smart automation — becomes your personal career department from day one.",
    image: act2,
    bg: "from-slate-900 via-indigo-950 to-slate-900",
  },
  {
    id: 3,
    eyebrow: "How we do it",
    title: "Doing the right market work",
    body:
      "Tailored applications, ATS-tuned resumes, targeted outreach, and follow-ups — orchestrated daily with strategic human oversight.",
    image: act3,
    bg: "from-indigo-950 via-blue-950 to-cyan-950",
  },
  {
    id: 4,
    eyebrow: "Live dashboard",
    title: "Getting the interview calls",
    body:
      "Watch every application, reply, and interview land in real time. No anxiety, no guesswork — just clear momentum you can measure.",
    image: act4,
    bg: "from-cyan-950 via-sky-900 to-indigo-900",
  },
  {
    id: 5,
    eyebrow: "Success",
    title: "Getting the job",
    body:
      "From overwhelmed to overjoyed. Offers in hand, terms negotiated, story rewritten. Your dream role isn't luck — it's the system working.",
    image: act5,
    bg: "from-amber-900 via-fuchsia-900 to-indigo-900",
  },
];

export const CorpJourney = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..1 across the entire pinned section
  const [activeAct, setActiveAct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      // how far we've scrolled into the wrapper, clamped 0..1
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      setProgress(p);
      // figure out which act we're in (5 equal chunks)
      const idx = Math.min(ACTS.length - 1, Math.floor(p * ACTS.length + 0.0001));
      setActiveAct(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Character horizontal travel: 6% (left margin) → 60% (so text card on right has room)
  const charLeft = 6 + progress * 54; // percent

  return (
    <section
      ref={wrapperRef}
      aria-label="The professional's journey"
      className="relative"
      // 5 acts × ~viewport → enough scroll room to feel cinematic
      style={{ height: `${ACTS.length * 100}vh` }}
    >
      {/* sticky cinema viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Cross-fading background scenes */}
        {ACTS.map((act, i) => (
          <div
            key={`bg-${act.id}`}
            className={`absolute inset-0 bg-gradient-to-br ${act.bg} transition-opacity duration-700`}
            style={{ opacity: activeAct === i ? 1 : 0 }}
          />
        ))}

        {/* Subtle grid + noise overlays for texture */}
        <div className="absolute inset-0 corp-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute inset-0 corp-noise opacity-[0.18] mix-blend-overlay pointer-events-none" />

        {/* Progress rail (top) */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-white/10 z-30">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Act milestones */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-3">
          {ACTS.map((a, i) => (
            <div
              key={`dot-${a.id}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                i <= activeAct
                  ? "w-10 bg-white"
                  : "w-2 bg-white/30"
              }`}
              aria-hidden
            />
          ))}
        </div>

        {/* Walking ground line */}
        <div className="absolute bottom-[14%] inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Character */}
        <div
          className="absolute bottom-[14%] z-20 will-change-transform"
          style={{
            left: `${charLeft}%`,
            transform: "translateX(-30%)",
          }}
        >
          <div className="relative">
            {/* gentle bob */}
            <div className="animate-[journey-bob_1.4s_ease-in-out_infinite]">
              {ACTS.map((a, i) => (
                <img
                  key={`char-${a.id}`}
                  src={a.image}
                  alt=""
                  width={768}
                  height={1024}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute bottom-0 left-0 h-[58vh] max-h-[640px] w-auto object-contain transition-opacity duration-500 ${
                    activeAct === i ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ filter: "drop-shadow(0 24px 32px rgba(0,0,0,0.45))" }}
                />
              ))}
              {/* spacer to keep absolute children sized */}
              <div className="h-[58vh] max-h-[640px] w-[280px] sm:w-[340px]" aria-hidden />
            </div>
            {/* shadow under feet */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-3 rounded-full bg-black/40 blur-md" />
          </div>
        </div>

        {/* Text card — pinned right, swaps per act */}
        <div className="absolute right-4 sm:right-10 lg:right-20 top-1/2 -translate-y-1/2 z-20 w-[min(92vw,440px)]">
          {ACTS.map((a, i) => {
            const isActive = activeAct === i;
            return (
              <div
                key={`text-${a.id}`}
                className={`absolute inset-0 transition-all duration-700 ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <div className="corp-glass rounded-2xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/60">
                      Act {a.id} / {ACTS.length}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-sky-300">
                      {a.eyebrow}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
                    {a.title.split(" ").slice(0, -2).join(" ")}{" "}
                    <span className="corp-italic text-sky-200">
                      {a.title.split(" ").slice(-2).join(" ")}
                    </span>
                  </h2>
                  <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                    {a.body}
                  </p>
                  {i === ACTS.length - 1 && (
                    <Link
                      to="/auth/signup"
                      className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-sky-200 transition"
                    >
                      Start your journey <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
          {/* keeps the absolute container sized */}
          <div className="invisible corp-glass rounded-2xl p-6 sm:p-8" aria-hidden>
            <div className="text-xs">spacer</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl">Reaching the right platform</h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {ACTS[0].body}
            </p>
            <div className="mt-6 h-12" />
          </div>
        </div>

        {/* Scroll hint (only at start) */}
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-mono uppercase tracking-[0.2em] transition-opacity duration-500 ${
            progress < 0.04 ? "opacity-100" : "opacity-0"
          }`}
        >
          scroll to walk →
        </div>
      </div>

      <style>{`
        @keyframes journey-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  );
};
