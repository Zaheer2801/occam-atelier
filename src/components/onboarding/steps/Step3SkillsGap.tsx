import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Star, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface GapData {
  strong_match: string[];
  declining_demand: string[];
  missing_critical: string[];
  differentiators: string[];
  gap_closure_plan: Array<{
    skill: string;
    priority: string;
    resource: string;
    free_alternative: string;
  }>;
}

interface Props {
  skills: string[];
  targetRole: string;
  onComplete: (gap: GapData) => void;
}

const CATEGORIES = [
  { key: "strong_match",      label: "Strong match",        icon: TrendingUp,    color: "var(--aa-success)" },
  { key: "declining_demand",  label: "Declining demand",    icon: TrendingDown,  color: "var(--aa-warning)" },
  { key: "missing_critical",  label: "Critical gaps",       icon: AlertTriangle, color: "var(--aa-danger)" },
  { key: "differentiators",   label: "Would differentiate", icon: Star,          color: "var(--aa-brand)" },
] as const;

export const Step3SkillsGap = ({ skills, targetRole, onComplete }: Props) => {
  const [data, setData] = useState<GapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/onboarding/skills-gap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidate_skills: skills, target_role: targetRole }),
        });
        if (!res.ok) throw new Error(await res.text());
        setData(await res.json());
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Skills gap analysis failed.");
      } finally {
        setLoading(false);
      }
    })();
  }, [skills, targetRole]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--aa-brand)" }} />
        <p className="text-sm" style={{ color: "var(--aa-text-secondary)" }}>
          Analysing your skills against {targetRole} requirements…
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm mb-4" style={{ color: "var(--aa-danger)" }}>{error || "No data"}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm px-4 py-2 rounded-lg"
          style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-default)", color: "var(--aa-text-secondary)" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl mb-1"
        style={{ fontFamily: "DM Serif Display, Georgia, serif", color: "var(--aa-text-primary)" }}
      >
        Skills gap
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--aa-text-secondary)" }}>
        Your skills vs. what {targetRole} roles demand right now
      </p>

      <div className="space-y-5 mb-6">
        {CATEGORIES.map(({ key, label, icon: Icon, color }) => {
          const items = data[key] as string[];
          if (!items?.length) return null;
          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4" style={{ color }} />
                <span className="text-xs uppercase tracking-widest" style={{ color, fontFamily: "monospace" }}>
                  {label}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((sk) => (
                  <span
                    key={sk}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "var(--aa-bg-surface)",
                      border: `1px solid ${color}44`,
                      color: "var(--aa-text-primary)",
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {data.gap_closure_plan?.length > 0 && (
        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-subtle)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace" }}>
            Gap closure plan — top priorities
          </p>
          <div className="space-y-3">
            {data.gap_closure_plan.slice(0, 3).map((item) => (
              <div key={item.skill}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: item.priority === "high" ? "var(--aa-danger-subtle)" : "var(--aa-warning-subtle)",
                      color: item.priority === "high" ? "var(--aa-danger)" : "var(--aa-warning)",
                      fontFamily: "monospace",
                    }}
                  >
                    {item.priority}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--aa-text-primary)" }}>
                    {item.skill}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--aa-text-secondary)" }}>{item.resource}</p>
                <p className="text-xs" style={{ color: "var(--aa-text-tertiary)" }}>Free: {item.free_alternative}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => onComplete(data)}
        className="w-full text-sm font-medium py-2.5 rounded-lg"
        style={{ background: "var(--aa-brand)", color: "var(--aa-text-inverse)" }}
      >
        Continue
      </button>
    </div>
  );
};
