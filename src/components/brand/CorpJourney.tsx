import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, BarChart3, BellRing, Trophy } from "lucide-react";
import act1 from "@/assets/journey/act-1-struggle.png";
import act2 from "@/assets/journey/act-2-connection.png";
import act3 from "@/assets/journey/act-3-strategy.png";
import act4 from "@/assets/journey/act-4-momentum.png";
import act5 from "@/assets/journey/act-5-success.png";

type Act = {
  id: number;
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
  image: string;
  /** subtle tinted overlay matching corporate dark theme */
  tint: string;
  accent: string;
};

const ACTS: Act[] = [
  {
    id: 1,
    eyebrow: "Who we are",
    title: "Reaching the right",
    highlight: "platform",
    body:
      "OCAS Software LLC turns the chaos of the modern job search into a clear, accountable system — so the work you put in actually compounds.",
    image: act1,
    tint: "from-slate-950/90 via-slate-900/70 to-slate-950/90",
    accent: "text-slate-300",
  },
  {
    id: 2,
    eyebrow: "What we do",
    title: "Connecting to the right",
    highlight: "team",
    body:
      "A dedicated marketing pod — real humans backed by smart automation — becomes your personal career department from day one.",
    image: act2,
    tint: "from-slate-950/90 via-indigo-950/60 to-slate-950/90",
    accent: "text-indigo-300",
  },
  {
    id: 3,
    eyebrow: "How we do it",
    title: "Doing the right",
    highlight: "market work",
    body:
      "Tailored applications, ATS-tuned resumes, targeted outreach, and follow-ups — orchestrated daily with strategic human oversight.",
    image: act3,
    tint: "from-slate-950/90 via-sky-950/60 to-slate-950/90",
    accent: "text-sky-300",
  },
  {
    id: 4,
    eyebrow: "Live dashboard",
    title: "Getting the",
    highlight: "interview calls",
    body:
      "Watch every application, reply, and interview land in real time. No anxiety, no guesswork — just clear momentum you can measure.",
    image: act4,
    tint: "from-slate-950/90 via-violet-950/60 to-slate-950/90",
    accent: "text-violet-300",
  },
  {
    id: 5,
    eyebrow: "Success",
    title: "Getting the",
    highlight: "dream job",
    body:
      "From overwhelmed to overjoyed. Offers in hand, terms negotiated, story rewritten. Your dream role isn't luck — it's the system working.",
    image: act5,
    tint: "from-slate-950/90 via-amber-950/50 to-slate-950/90",
    accent: "text-amber-300",
  },
];

const ACT_ICONS = [Zap, Sparkles, BarChart3, BellRing, Trophy];

export const CorpJourney = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeAct, setActiveAct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        const p = total > 0 ? scrolled / total : 0;
        setProgress(p);
        const idx = Math.min(ACTS.length - 1, Math.floor(p * ACTS.length + 0.0001));
        setActiveAct(idx);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Local progress within the active act (0..1)
  const localP = (progress * ACTS.length) - activeAct;
  // Character horizontal travel: 8% → 58%
  const charLeft = 8 + progress * 50;
  // Subtle character scale "breathing" as act starts
  const charScale = 0.96 + Math.sin(localP * Math.PI) * 0.04;

  return (
    <section
      ref={wrapperRef}
      aria-label="The professional's journey"
      className="relative bg-corp-bg"
      style={{ height: `${ACTS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Base corp dark background */}
        <div className="absolute inset-0 bg-corp-bg" />

        {/* Cross-fading tint overlays — subtle, theme-matched */}
        {ACTS.map((act, i) => (
          <div
            key={`bg-${act.id}`}
            className={`absolute inset-0 bg-gradient-to-br ${act.tint} transition-opacity duration-1000`}
            style={{ opacity: activeAct === i ? 1 : 0 }}
          />
        ))}

        {/* Texture overlays */}
        <div className="absolute inset-0 corp-grid-bg opacity-[0.18] pointer-events-none" />
        <div className="absolute inset-0 corp-noise opacity-[0.12] mix-blend-overlay pointer-events-none" />

        {/* Soft radial spotlight that follows the character */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(60% 60% at ${charLeft}% 70%, hsl(var(--corp-accent) / 0.18), transparent 60%)`,
          }}
        />

        {/* Progress rail */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-white/10 z-30">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-violet-400 to-amber-300 transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Act milestones */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-3">
          {ACTS.map((a, i) => {
            const Icon = ACT_ICONS[i];
            return (
              <div
                key={`dot-${a.id}`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
                  i === activeAct
                    ? "border-white/40 bg-white/10 text-white"
                    : i < activeAct
                    ? "border-white/20 bg-white/5 text-white/70"
                    : "border-white/10 text-white/30"
                }`}
                aria-hidden
              >
                <Icon className="h-3 w-3" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
                  0{a.id}
                </span>
              </div>
            );
          })}
        </div>

        {/* Floating accent particles per act */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {ACTS.map((a, i) => (
            <div
              key={`particles-${a.id}`}
              className={`absolute inset-0 transition-opacity duration-700 ${
                activeAct === i ? "opacity-100" : "opacity-0"
              }`}
            >
              {Array.from({ length: 12 }).map((_, j) => (
                <div
                  key={j}
                  className={`absolute h-1 w-1 rounded-full bg-current ${a.accent}`}
                  style={{
                    left: `${(j * 83) % 100}%`,
                    top: `${(j * 47) % 100}%`,
                    opacity: 0.4,
                    animation: `journey-float ${4 + (j % 4)}s ease-in-out ${j * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Walking ground line */}
        <div className="absolute bottom-[12%] inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Character */}
        <div
          className="absolute bottom-[10%] z-20 will-change-transform transition-[left] duration-150 ease-out"
          style={{
            left: `${charLeft}%`,
            transform: `translateX(-30%) scale(${charScale})`,
          }}
        >
          <div className="relative">
            <div className="animate-[journey-bob_1.6s_ease-in-out_infinite]">
              {ACTS.map((a, i) => (
                <img
                  key={`char-${a.id}`}
                  src={a.image}
                  alt=""
                  width={768}
                  height={1024}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute bottom-0 left-0 h-[62vh] max-h-[680px] w-auto object-contain transition-all duration-700 ${
                    activeAct === i
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  }`}
                  style={{
                    filter:
                      "drop-shadow(0 30px 40px rgba(0,0,0,0.55)) drop-shadow(0 0 60px hsl(var(--corp-accent) / 0.25))",
                  }}
                />
              ))}
              <div className="h-[62vh] max-h-[680px] w-[280px] sm:w-[340px]" aria-hidden />
            </div>
            {/* shadow under feet */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-44 h-3 rounded-full bg-black/50 blur-md" />
          </div>
        </div>

        {/* Text card */}
        <div className="absolute right-4 sm:right-10 lg:right-20 top-1/2 -translate-y-1/2 z-20 w-[min(92vw,460px)]">
          {ACTS.map((a, i) => {
            const isActive = activeAct === i;
            const Icon = ACT_ICONS[i];
            return (
              <div
                key={`text-${a.id}`}
                className={`absolute inset-0 transition-all duration-700 ${
                  isActive
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-6 blur-sm pointer-events-none"
                }`}
              >
                <div className="corp-glass rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 ${a.accent}`}>
                      <Icon className="h-3 w-3" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
                        Act 0{a.id} / 0{ACTS.length}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-[0.25em] ${a.accent}`}>
                      {a.eyebrow}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-5 leading-[1.05]">
                    {a.title}{" "}
                    <span className={`corp-italic ${a.accent}`}>
                      {a.highlight}
                    </span>
                  </h2>
                  <p className="text-white/75 text-base sm:text-lg leading-relaxed">
                    {a.body}
                  </p>
                  {i === ACTS.length - 1 && (
                    <Link
                      to="/auth/signup"
                      className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-amber-200 transition-all duration-300 hover:gap-3 hover:shadow-[0_10px_40px_-10px_rgba(252,211,77,0.6)]"
                    >
                      Start your journey <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
          {/* sizer */}
          <div className="invisible corp-glass rounded-2xl p-6 sm:p-8" aria-hidden>
            <div className="text-xs">spacer</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl">Reaching the right platform</h2>
            <p className="text-base sm:text-lg leading-relaxed">{ACTS[0].body}</p>
            <div className="mt-7 h-12" />
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-white/50 text-[10px] font-mono uppercase tracking-[0.3em] transition-opacity duration-500 flex items-center gap-2 ${
            progress < 0.04 ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-px w-8 bg-white/30" />
          scroll to begin
          <span className="h-px w-8 bg-white/30" />
        </div>
      </div>

      <style>{`
        @keyframes journey-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes journey-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-30px) translateX(10px); opacity: 0.6; }
        }
      `}</style>
    </section>
  );
};
