import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Users, Clock, AlertTriangle, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface MarketData {
  open_roles_estimate: number;
  median_salary_usd: number;
  salary_range_low: number;
  salary_range_high: number;
  top_hiring_companies: string[];
  demand_trend: "growing" | "stable" | "declining";
  demand_trend_12mo_pct: number;
  competitive_density: "low" | "medium" | "high" | "extreme";
  avg_applicants_per_role: number;
  time_to_hire_days: number;
  market_assessment: string;
  honest_warning: string | null;
}

interface Props {
  targetRole: string;
  targetLocation?: string;
  onComplete: (data: MarketData) => void;
}

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);
const fmtSalary = (n: number) => `$${Math.round(n / 1000)}k`;

export const Step4MarketReality = ({ targetRole, targetLocation, onComplete }: Props) => {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/onboarding/market-reality`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_role: targetRole, target_location: targetLocation }),
        });
        if (!res.ok) throw new Error(await res.text());
        setData(await res.json());
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Market data fetch failed.");
      } finally {
        setLoading(false);
      }
    })();
  }, [targetRole, targetLocation]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--aa-brand)" }} />
        <p className="text-sm" style={{ color: "var(--aa-text-secondary)" }}>
          Pulling market data for {targetRole}…
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm mb-4" style={{ color: "var(--aa-danger)" }}>{error}</p>
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

  const TrendIcon = data.demand_trend === "growing"
    ? <TrendingUp className="h-4 w-4" style={{ color: "var(--aa-success)" }} />
    : data.demand_trend === "declining"
    ? <TrendingDown className="h-4 w-4" style={{ color: "var(--aa-danger)" }} />
    : <Minus className="h-4 w-4" style={{ color: "var(--aa-warning)" }} />;

  const densityColor = {
    low: "var(--aa-success)", medium: "var(--aa-warning)",
    high: "var(--aa-danger)", extreme: "var(--aa-danger)",
  }[data.competitive_density];

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl mb-1"
        style={{ fontFamily: "DM Serif Display, Georgia, serif", color: "var(--aa-text-primary)" }}
      >
        Market reality
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--aa-text-secondary)" }}>
        {targetRole} · {targetLocation || "US"}
      </p>

      {/* Honest warning */}
      {data.honest_warning && (
        <div
          className="flex gap-3 rounded-xl p-4 mb-5"
          style={{ background: "var(--aa-warning-subtle)", border: "1px solid var(--aa-warning-border)" }}
        >
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "var(--aa-warning)" }} />
          <p className="text-sm" style={{ color: "var(--aa-warning)" }}>{data.honest_warning}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Open roles" value={fmt(data.open_roles_estimate)} />
        <StatCard
          label="Median salary"
          value={fmtSalary(data.median_salary_usd)}
          sub={`${fmtSalary(data.salary_range_low)}–${fmtSalary(data.salary_range_high)} range`}
        />
        <StatCard
          label="12-month trend"
          value={`${data.demand_trend_12mo_pct > 0 ? "+" : ""}${data.demand_trend_12mo_pct}%`}
          icon={TrendIcon}
        />
        <StatCard label="Avg applicants/role" value={fmt(data.avg_applicants_per_role)} icon={<Users className="h-4 w-4" style={{ color: "var(--aa-text-tertiary)" }} />} />
        <StatCard
          label="Competition"
          value={data.competitive_density}
          valueColor={densityColor}
        />
        <StatCard
          label="Time to hire"
          value={`${data.time_to_hire_days}d`}
          icon={<Clock className="h-4 w-4" style={{ color: "var(--aa-text-tertiary)" }} />}
        />
      </div>

      {/* Assessment */}
      <div
        className="rounded-xl p-4 mb-5"
        style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-subtle)" }}
      >
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace" }}>
          Assessment
        </p>
        <p className="text-sm" style={{ color: "var(--aa-text-primary)", lineHeight: 1.6 }}>
          {data.market_assessment}
        </p>
      </div>

      {/* Top companies */}
      {data.top_hiring_companies?.length > 0 && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace" }}>
            Actively hiring
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.top_hiring_companies.map((co) => (
              <span
                key={co}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-subtle)", color: "var(--aa-text-secondary)" }}
              >
                {co}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => onComplete(data)}
        className="w-full text-sm font-medium py-2.5 rounded-lg"
        style={{ background: "var(--aa-brand)", color: "var(--aa-text-inverse)" }}
      >
        I understand — continue
      </button>
    </div>
  );
};

const StatCard = ({
  label, value, sub, icon, valueColor,
}: {
  label: string; value: string; sub?: string; icon?: React.ReactNode; valueColor?: string;
}) => (
  <div
    className="rounded-xl p-3"
    style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-subtle)" }}
  >
    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace" }}>
      {label}
    </p>
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-lg font-semibold" style={{ color: valueColor || "var(--aa-text-primary)", fontFamily: "monospace" }}>
        {value}
      </span>
    </div>
    {sub && <p className="text-xs mt-0.5" style={{ color: "var(--aa-text-tertiary)" }}>{sub}</p>}
  </div>
);
