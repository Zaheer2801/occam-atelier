import { useState } from "react";

interface Preferences {
  target_locations: string[];
  work_arrangement: "remote" | "hybrid" | "onsite" | "flexible";
  salary_floor_usd: number;
  company_sizes: string[];
  industries_to_avoid: string[];
  visa_status: string;
  needs_sponsorship: boolean;
  notice_period_days: number;
  willing_to_relocate: boolean;
  dnc_companies: string[];
  show_ai_disclosure: boolean;
}

interface Props {
  targetRole: string;
  targetIndustry?: string;
  onComplete: (prefs: Preferences) => void;
}

const ARRANGEMENTS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
  { value: "flexible", label: "Flexible" },
] as const;

const COMPANY_SIZES = ["Startup (<50)", "Small (50–200)", "Mid (200–1k)", "Large (1k–10k)", "Enterprise (10k+)"];

const VISA_OPTIONS = [
  "US Citizen",
  "Green Card",
  "H-1B (active)",
  "H-1B (needs transfer)",
  "OPT/CPT",
  "TN Visa",
  "Other — no sponsorship needed",
  "Need sponsorship",
];

export const Step5Preferences = ({ targetRole, targetIndustry, onComplete }: Props) => {
  const [prefs, setPrefs] = useState<Preferences>({
    target_locations: [],
    work_arrangement: "flexible",
    salary_floor_usd: 80000,
    company_sizes: [],
    industries_to_avoid: [],
    visa_status: "US Citizen",
    needs_sponsorship: false,
    notice_period_days: 14,
    willing_to_relocate: false,
    dnc_companies: [],
    show_ai_disclosure: targetIndustry === "tech" || !targetIndustry,
  });

  const [locationInput, setLocationInput] = useState("");
  const [avoidInput, setAvoidInput] = useState("");
  const [dncInput, setDncInput] = useState("");

  const addTag = (field: "target_locations" | "industries_to_avoid" | "dnc_companies", input: string, clear: () => void) => {
    if (!input.trim()) return;
    setPrefs((p) => ({ ...p, [field]: [...new Set([...p[field], input.trim()])] }));
    clear();
  };

  const removeTag = (field: "target_locations" | "industries_to_avoid" | "dnc_companies", val: string) => {
    setPrefs((p) => ({ ...p, [field]: p[field].filter((x) => x !== val) }));
  };

  const toggleSize = (s: string) =>
    setPrefs((p) => ({
      ...p,
      company_sizes: p.company_sizes.includes(s) ? p.company_sizes.filter((x) => x !== s) : [...p.company_sizes, s],
    }));

  const inputStyle = {
    background: "var(--aa-bg-input)",
    border: "1px solid var(--aa-border-default)",
    color: "var(--aa-text-primary)",
    borderRadius: "var(--aa-radius-md)",
    padding: "8px 12px",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
  };

  const labelStyle = { color: "var(--aa-text-secondary)", fontSize: "0.8125rem", marginBottom: 6, display: "block" as const };
  const sectionStyle = { marginBottom: 20 };

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl mb-1"
        style={{ fontFamily: "DM Serif Display, Georgia, serif", color: "var(--aa-text-primary)" }}
      >
        Your preferences
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--aa-text-secondary)" }}>
        These control which jobs we apply to. Everything is adjustable later.
      </p>

      {/* Target locations */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Target locations (city, state, or "Remote")</label>
        <div className="flex gap-2 mb-2">
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (addTag("target_locations", locationInput, () => setLocationInput("")), e.preventDefault())}
            placeholder="e.g. Austin TX · Remote"
          />
          <button
            onClick={() => addTag("target_locations", locationInput, () => setLocationInput(""))}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ background: "var(--aa-brand)", color: "var(--aa-text-inverse)" }}
          >
            Add
          </button>
        </div>
        <Tags items={prefs.target_locations} onRemove={(v) => removeTag("target_locations", v)} />
      </div>

      {/* Work arrangement */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Work arrangement</label>
        <div className="flex gap-2 flex-wrap">
          {ARRANGEMENTS.map((a) => (
            <button
              key={a.value}
              onClick={() => setPrefs((p) => ({ ...p, work_arrangement: a.value }))}
              className="text-sm px-4 py-1.5 rounded-full"
              style={{
                background: prefs.work_arrangement === a.value ? "var(--aa-brand)" : "var(--aa-bg-surface)",
                color: prefs.work_arrangement === a.value ? "var(--aa-text-inverse)" : "var(--aa-text-secondary)",
                border: `1px solid ${prefs.work_arrangement === a.value ? "var(--aa-brand)" : "var(--aa-border-subtle)"}`,
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Salary floor */}
      <div style={sectionStyle}>
        <label style={labelStyle}>
          Minimum salary — never apply below ${prefs.salary_floor_usd.toLocaleString()}
        </label>
        <input
          type="range"
          min={40000}
          max={300000}
          step={5000}
          value={prefs.salary_floor_usd}
          onChange={(e) => setPrefs((p) => ({ ...p, salary_floor_usd: Number(e.target.value) }))}
          className="w-full"
          style={{ accentColor: "var(--aa-brand)" }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace" }}>
          <span>$40k</span><span>$300k</span>
        </div>
      </div>

      {/* Company size */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Company sizes (leave blank for any)</label>
        <div className="flex gap-2 flex-wrap">
          {COMPANY_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{
                background: prefs.company_sizes.includes(s) ? "var(--aa-brand-subtle)" : "var(--aa-bg-surface)",
                color: prefs.company_sizes.includes(s) ? "var(--aa-brand)" : "var(--aa-text-secondary)",
                border: `1px solid ${prefs.company_sizes.includes(s) ? "var(--aa-brand-border)" : "var(--aa-border-subtle)"}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Visa status */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Visa / work authorisation</label>
        <select
          style={{ ...inputStyle }}
          value={prefs.visa_status}
          onChange={(e) => {
            const ns = e.target.value;
            setPrefs((p) => ({ ...p, visa_status: ns, needs_sponsorship: ns === "Need sponsorship" }));
          }}
        >
          {VISA_OPTIONS.map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>

      {/* Notice period */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Notice period</label>
        <div className="flex gap-2 flex-wrap">
          {[0, 7, 14, 30, 60, 90].map((d) => (
            <button
              key={d}
              onClick={() => setPrefs((p) => ({ ...p, notice_period_days: d }))}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{
                background: prefs.notice_period_days === d ? "var(--aa-brand)" : "var(--aa-bg-surface)",
                color: prefs.notice_period_days === d ? "var(--aa-text-inverse)" : "var(--aa-text-secondary)",
                border: `1px solid ${prefs.notice_period_days === d ? "var(--aa-brand)" : "var(--aa-border-subtle)"}`,
              }}
            >
              {d === 0 ? "Immediate" : `${d} days`}
            </button>
          ))}
        </div>
      </div>

      {/* DNC companies */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Companies to never contact (optional)</label>
        <div className="flex gap-2 mb-2">
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={dncInput}
            onChange={(e) => setDncInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (addTag("dnc_companies", dncInput, () => setDncInput("")), e.preventDefault())}
            placeholder="e.g. Previous employer"
          />
          <button
            onClick={() => addTag("dnc_companies", dncInput, () => setDncInput(""))}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-default)", color: "var(--aa-text-secondary)" }}
          >
            Add
          </button>
        </div>
        <Tags items={prefs.dnc_companies} onRemove={(v) => removeTag("dnc_companies", v)} />
      </div>

      {/* AI disclosure */}
      <div
        className="flex items-start gap-3 rounded-xl p-4 mb-6"
        style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-subtle)" }}
      >
        <input
          type="checkbox"
          id="ai-disclosure"
          checked={prefs.show_ai_disclosure}
          onChange={(e) => setPrefs((p) => ({ ...p, show_ai_disclosure: e.target.checked }))}
          style={{ accentColor: "var(--aa-brand)", marginTop: 2 }}
        />
        <label htmlFor="ai-disclosure" className="text-sm" style={{ color: "var(--aa-text-secondary)" }}>
          Include AI assistance disclosure in application submissions{" "}
          <span style={{ color: "var(--aa-text-tertiary)" }}>
            (recommended for tech/startup; leave off for finance, healthcare, government)
          </span>
        </label>
      </div>

      <button
        onClick={() => onComplete(prefs)}
        className="w-full text-sm font-medium py-2.5 rounded-lg"
        style={{ background: "var(--aa-brand)", color: "var(--aa-text-inverse)" }}
      >
        Save preferences — continue
      </button>
    </div>
  );
};

const Tags = ({ items, onRemove }: { items: string[]; onRemove: (v: string) => void }) => (
  <div className="flex flex-wrap gap-1.5 mt-1">
    {items.map((item) => (
      <span
        key={item}
        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
        style={{ background: "var(--aa-brand-subtle)", color: "var(--aa-brand)", border: "1px solid var(--aa-brand-border)" }}
      >
        {item}
        <button onClick={() => onRemove(item)} style={{ color: "var(--aa-brand)", lineHeight: 1 }}>×</button>
      </span>
    ))}
  </div>
);
