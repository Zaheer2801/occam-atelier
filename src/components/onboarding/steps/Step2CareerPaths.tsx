import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, ChevronRight, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface CareerPath {
  title: string;
  demand_score: number;
  median_salary_usd: number;
  salary_range_low: number;
  salary_range_high: number;
  skill_overlap_pct: number;
  missing_skills: string[];
  demand_trend: "growing" | "stable" | "declining";
  rationale: string;
}

interface Props {
  skills: string[];
  experienceYears: number;
  onComplete: (selectedPaths: string[], targetRole: string) => void;
}

const QUESTIONS = [
  { key: "problems", label: "What kind of problems do you enjoy solving?" },
  { key: "energising", label: "What aspects of your past work energised you most?" },
  { key: "industries", label: "What industries interest you, even without direct experience?" },
];

export const Step2CareerPaths = ({ skills, experienceYears, onComplete }: Props) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [explored, setExplored] = useState(false);

  const explore = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/onboarding/career-paths`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills,
          experience_years: experienceYears,
          problems: answers.problems || "",
          energising: answers.energising || "",
          industries: answers.industries || "",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPaths(data.paths || []);
      setExplored(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load career paths.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (title: string) => {
    setSelected((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : prev.length < 2 ? [...prev, title] : prev
    );
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "growing") return <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--aa-success)" }} />;
    if (trend === "declining") return <TrendingDown className="h-3.5 w-3.5" style={{ color: "var(--aa-danger)" }} />;
    return <Minus className="h-3.5 w-3.5" style={{ color: "var(--aa-warning)" }} />;
  };

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl mb-2"
        style={{ fontFamily: "DM Serif Display, Georgia, serif", color: "var(--aa-text-primary)" }}
      >
        Career exploration
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--aa-text-secondary)" }}>
        Three questions. We map your answers to real market paths.
      </p>

      {!explored ? (
        <>
          <div className="space-y-5 mb-6">
            {QUESTIONS.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm mb-1.5" style={{ color: "var(--aa-text-primary)" }}>
                  {label}
                </label>
                <textarea
                  rows={2}
                  value={answers[key] || ""}
                  onChange={(e) => setAnswers((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder="Type your answer…"
                  className="w-full rounded-lg px-3 py-2 text-sm resize-none"
                  style={{
                    background: "var(--aa-bg-input)",
                    border: "1px solid var(--aa-border-default)",
                    color: "var(--aa-text-primary)",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--aa-brand)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--aa-border-default)")}
                />
              </div>
            ))}
          </div>

          {error && <p className="text-sm mb-4" style={{ color: "var(--aa-danger)" }}>{error}</p>}

          <button
            onClick={explore}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: "var(--aa-brand)", color: "var(--aa-text-inverse)" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
            {loading ? "Exploring paths…" : "Explore career paths"}
          </button>
        </>
      ) : (
        <>
          <p className="text-xs mb-4" style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace" }}>
            SELECT 1–2 PATHS TO TARGET
          </p>

          <div className="space-y-3 mb-6">
            {paths.map((path) => {
              const isSelected = selected.includes(path.title);
              return (
                <button
                  key={path.title}
                  onClick={() => toggle(path.title)}
                  className="w-full text-left rounded-xl p-4 transition-all"
                  style={{
                    background: isSelected ? "var(--aa-brand-subtle)" : "var(--aa-bg-surface)",
                    border: `${isSelected ? 2 : 1}px solid ${isSelected ? "var(--aa-brand)" : "var(--aa-border-subtle)"}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm" style={{ color: "var(--aa-text-primary)" }}>
                          {path.title}
                        </span>
                        <TrendIcon trend={path.demand_trend} />
                      </div>
                      <p className="text-xs mb-2" style={{ color: "var(--aa-text-secondary)" }}>
                        {path.rationale}
                      </p>
                      <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "monospace", color: "var(--aa-text-tertiary)" }}>
                        <span>${(path.median_salary_usd / 1000).toFixed(0)}k median</span>
                        <span>{path.skill_overlap_pct}% skill match</span>
                        <span style={{ color: path.demand_score > 70 ? "var(--aa-success)" : path.demand_score > 40 ? "var(--aa-warning)" : "var(--aa-danger)" }}>
                          {path.demand_score}/100 demand
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 border flex items-center justify-center"
                      style={{
                        borderColor: isSelected ? "var(--aa-brand)" : "var(--aa-border-default)",
                        background: isSelected ? "var(--aa-brand)" : "transparent",
                        color: "var(--aa-text-inverse)",
                        fontSize: 10,
                      }}
                    >
                      {isSelected && "✓"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setExplored(false)}
              className="text-sm px-4 py-2 rounded-lg"
              style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-default)", color: "var(--aa-text-secondary)" }}
            >
              Revise answers
            </button>
            <button
              disabled={selected.length === 0}
              onClick={() => onComplete(selected, selected[0])}
              className="flex-1 text-sm font-medium py-2 rounded-lg"
              style={{
                background: selected.length > 0 ? "var(--aa-brand)" : "var(--aa-bg-surface)",
                color: selected.length > 0 ? "var(--aa-text-inverse)" : "var(--aa-text-tertiary)",
                border: "none",
              }}
            >
              Continue with {selected.length > 0 ? selected.join(" + ") : "selection"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
