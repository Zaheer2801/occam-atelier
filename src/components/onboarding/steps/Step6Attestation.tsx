import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

const CHECKBOXES = [
  {
    key: "accurate",
    label: "I confirm all information in my profile is accurate and complete.",
  },
  {
    key: "authorised",
    label: "I am legally authorised to work in my stated location.",
  },
  {
    key: "mechanical",
    label: "I understand OCAS Atelier submits applications mechanically and does not verify my credentials or employment history.",
  },
  {
    key: "responsibility",
    label: "I accept full responsibility for the accuracy of all application materials submitted on my behalf.",
  },
] as const;

type CheckKey = (typeof CHECKBOXES)[number]["key"];

interface Props {
  profileSummary: {
    name: string;
    email: string;
    targetRole: string;
    skills: string[];
    experienceEntries: number;
    preferences: { salary_floor_usd: number; work_arrangement: string; target_locations: string[] };
  };
  onComplete: (attestation: Record<CheckKey, boolean>) => void;
  submitting?: boolean;
}

export const Step6Attestation = ({ profileSummary, onComplete, submitting }: Props) => {
  const [checked, setChecked] = useState<Record<CheckKey, boolean>>({
    accurate: false,
    authorised: false,
    mechanical: false,
    responsibility: false,
  });

  const allChecked = Object.values(checked).every(Boolean);

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl mb-1"
        style={{ fontFamily: "DM Serif Display, Georgia, serif", color: "var(--aa-text-primary)" }}
      >
        Confirm &amp; activate
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--aa-text-secondary)" }}>
        Review your profile summary, then confirm four statements to begin.
      </p>

      {/* Summary */}
      <div
        className="rounded-xl p-4 mb-6 space-y-2"
        style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-subtle)" }}
      >
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace" }}>
          Profile summary
        </p>
        <SummaryRow label="Name" value={profileSummary.name} />
        <SummaryRow label="Email" value={profileSummary.email} />
        <SummaryRow label="Target role" value={profileSummary.targetRole} />
        <SummaryRow label="Skills" value={`${profileSummary.skills.length} detected`} />
        <SummaryRow label="Experience" value={`${profileSummary.experienceEntries} roles`} />
        <SummaryRow
          label="Salary floor"
          value={`$${profileSummary.preferences.salary_floor_usd.toLocaleString()}`}
        />
        <SummaryRow label="Work style" value={profileSummary.preferences.work_arrangement} />
        {profileSummary.preferences.target_locations.length > 0 && (
          <SummaryRow
            label="Locations"
            value={profileSummary.preferences.target_locations.join(", ")}
          />
        )}
      </div>

      {/* Checkboxes */}
      <div className="space-y-4 mb-6">
        {CHECKBOXES.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-start gap-3 cursor-pointer"
          >
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={checked[key]}
                onChange={(e) => setChecked((p) => ({ ...p, [key]: e.target.checked }))}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded flex items-center justify-center transition-all"
                style={{
                  background: checked[key] ? "var(--aa-brand)" : "var(--aa-bg-input)",
                  border: `2px solid ${checked[key] ? "var(--aa-brand)" : "var(--aa-border-default)"}`,
                  boxShadow: checked[key] ? "var(--aa-shadow-brand)" : undefined,
                }}
                onClick={() => setChecked((p) => ({ ...p, [key]: !p[key] }))}
              >
                {checked[key] && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--aa-text-inverse)" }} />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm" style={{ color: checked[key] ? "var(--aa-text-primary)" : "var(--aa-text-secondary)" }}>
              {label}
            </span>
          </label>
        ))}
      </div>

      {/* Activate button */}
      <button
        disabled={!allChecked || submitting}
        onClick={() => allChecked && onComplete(checked)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all"
        style={{
          background: allChecked ? "var(--aa-brand)" : "var(--aa-bg-surface)",
          color: allChecked ? "var(--aa-text-inverse)" : "var(--aa-text-tertiary)",
          border: `1px solid ${allChecked ? "var(--aa-brand)" : "var(--aa-border-subtle)"}`,
          boxShadow: allChecked && !submitting ? "var(--aa-shadow-brand)" : undefined,
          cursor: allChecked && !submitting ? "pointer" : "not-allowed",
        }}
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShieldCheck className="h-4 w-4" />
        )}
        {submitting ? "Activating…" : "Activate my search"}
      </button>

      {!allChecked && (
        <p className="text-center text-xs mt-3" style={{ color: "var(--aa-text-tertiary)" }}>
          All four statements must be confirmed to proceed.
        </p>
      )}
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-baseline gap-4">
    <span className="text-xs" style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace", flexShrink: 0 }}>
      {label}
    </span>
    <span className="text-sm text-right" style={{ color: "var(--aa-text-primary)" }}>{value}</span>
  </div>
);
