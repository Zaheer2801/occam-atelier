import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

const STEPS = [
  { label: "Resume" },
  { label: "Explore" },
  { label: "Skills" },
  { label: "Market" },
  { label: "Prefs" },
  { label: "Confirm" },
];

interface Props {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  onBack?: () => void;
  children: ReactNode;
}

export const OnboardingShell6 = ({ step, onBack, children }: Props) => {
  const pct = Math.round((step / STEPS.length) * 100);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--aa-bg-page)" }}
    >
      {/* Top progress bar */}
      <div className="h-0.5 w-full" style={{ background: "var(--aa-border-subtle)" }}>
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            background: "var(--aa-brand)",
            transition: "width var(--aa-transition-slow)",
          }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        {onBack && step > 1 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm"
            style={{ color: "var(--aa-text-secondary)" }}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <div className="w-16" />
        )}

        {/* Logo wordmark */}
        <span
          className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "var(--aa-brand)", fontFamily: "var(--font-mono, monospace)" }}
        >
          OCAS Atelier
        </span>

        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace" }}
        >
          {step} / {STEPS.length}
        </span>
      </header>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 px-6 pb-6">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                style={{
                  background: done
                    ? "var(--aa-brand)"
                    : active
                    ? "var(--aa-brand)"
                    : "var(--aa-bg-elevated)",
                  color: done || active ? "var(--aa-text-inverse)" : "var(--aa-text-tertiary)",
                  boxShadow: active ? "0 0 0 3px var(--aa-brand-border)" : undefined,
                  border: done || active ? "none" : "1px solid var(--aa-border-subtle)",
                }}
              >
                {done ? "✓" : n}
              </div>
              <span
                className="text-[10px] uppercase tracking-wider hidden sm:block"
                style={{
                  color: active ? "var(--aa-brand)" : done ? "var(--aa-text-secondary)" : "var(--aa-text-tertiary)",
                  fontFamily: "monospace",
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-16">
        <div
          className="w-full max-w-2xl rounded-2xl p-6 md:p-8"
          style={{
            background: "var(--aa-bg-elevated)",
            border: "1px solid var(--aa-border-default)",
            boxShadow: "var(--aa-shadow-lg)",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};
