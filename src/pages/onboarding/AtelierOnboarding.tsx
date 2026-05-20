import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingShell6 } from "@/components/onboarding/OnboardingShell6";
import { Step1Upload } from "@/components/onboarding/steps/Step1Upload";
import { Step2CareerPaths } from "@/components/onboarding/steps/Step2CareerPaths";
import { Step3SkillsGap } from "@/components/onboarding/steps/Step3SkillsGap";
import { Step4MarketReality } from "@/components/onboarding/steps/Step4MarketReality";
import { Step5Preferences } from "@/components/onboarding/steps/Step5Preferences";
import { Step6Attestation } from "@/components/onboarding/steps/Step6Attestation";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface OnboardingState {
  profileJson: Record<string, unknown> | null;
  selectedPaths: string[];
  targetRole: string;
  gapData: Record<string, unknown> | null;
  marketData: Record<string, unknown> | null;
  preferences: Record<string, unknown> | null;
}

const initial: OnboardingState = {
  profileJson: null,
  selectedPaths: [],
  targetRole: "",
  gapData: null,
  marketData: null,
  preferences: null,
};

export default function AtelierOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [state, setState] = useState<OnboardingState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [geoBlocked, setGeoBlocked] = useState(false);

  // Geo-check + onboarding-complete check on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/onboarding/geo-check`, { method: "POST" });
        const data = await res.json();
        if (!data.allowed) { setGeoBlocked(true); return; }
      } catch {
        // fail open on geo-check error
      }
    })();
  }, []);

  const back = () => setStep((s) => Math.max(1, s - 1) as typeof step);
  const next = () => setStep((s) => Math.min(6, s + 1) as typeof step);

  // Step 1 complete
  const onStep1 = (profileJson: Record<string, unknown>) => {
    setState((s) => ({ ...s, profileJson }));
    next();
  };

  // Step 2 complete
  const onStep2 = (paths: string[], targetRole: string) => {
    setState((s) => ({ ...s, selectedPaths: paths, targetRole }));
    next();
  };

  // Step 3 complete
  const onStep3 = (gap: Record<string, unknown>) => {
    setState((s) => ({ ...s, gapData: gap }));
    next();
  };

  // Step 4 complete
  const onStep4 = (market: Record<string, unknown>) => {
    setState((s) => ({ ...s, marketData: market }));
    next();
  };

  // Step 5 complete
  const onStep5 = (prefs: Record<string, unknown>) => {
    setState((s) => ({ ...s, preferences: prefs }));
    next();
  };

  // Step 6 complete — submit attestation
  const onStep6 = async (attestation: Record<string, boolean>) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/onboarding/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: user.id,
          profile_json: state.profileJson,
          preferences: state.preferences || {},
          target_paths: state.selectedPaths,
          confirmed_accurate: attestation.accurate,
          confirmed_authorised: attestation.authorised,
          confirmed_understands_mechanical: attestation.mechanical,
          confirmed_responsibility: attestation.responsibility,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      navigate("/app/client/dashboard");
    } catch (e) {
      console.error("Onboarding complete failed:", e);
      // Still navigate — attestation failure is logged, don't block candidate
      navigate("/app/client/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  if (geoBlocked) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ background: "var(--aa-bg-page)" }}
      >
        <p className="text-2xl mb-3" style={{ fontFamily: "DM Serif Display, Georgia, serif", color: "var(--aa-text-primary)" }}>
          OCAS Atelier is US-only
        </p>
        <p className="text-sm" style={{ color: "var(--aa-text-secondary)" }}>
          We are currently available to candidates in the United States only.
          <br />
          EU / UK waitlist coming soon.
        </p>
      </div>
    );
  }

  const profile = state.profileJson as {
    full_name?: string; email?: string; skills?: string[];
    experience?: unknown[]; total_years_experience?: number;
  } | null;

  return (
    <OnboardingShell6 step={step} onBack={step > 1 ? back : undefined}>
      {step === 1 && <Step1Upload onComplete={onStep1} />}

      {step === 2 && profile && (
        <Step2CareerPaths
          skills={(profile.skills as string[]) || []}
          experienceYears={profile.total_years_experience || 0}
          onComplete={onStep2}
        />
      )}

      {step === 3 && (
        <Step3SkillsGap
          skills={(profile?.skills as string[]) || []}
          targetRole={state.targetRole}
          onComplete={onStep3}
        />
      )}

      {step === 4 && (
        <Step4MarketReality
          targetRole={state.targetRole}
          onComplete={onStep4}
        />
      )}

      {step === 5 && (
        <Step5Preferences
          targetRole={state.targetRole}
          onComplete={onStep5}
        />
      )}

      {step === 6 && profile && (
        <Step6Attestation
          profileSummary={{
            name: profile.full_name || "—",
            email: profile.email || user?.email || "—",
            targetRole: state.targetRole,
            skills: (profile.skills as string[]) || [],
            experienceEntries: profile.experience?.length || 0,
            preferences: {
              salary_floor_usd: (state.preferences as { salary_floor_usd?: number })?.salary_floor_usd || 0,
              work_arrangement: (state.preferences as { work_arrangement?: string })?.work_arrangement || "flexible",
              target_locations: (state.preferences as { target_locations?: string[] })?.target_locations || [],
            },
          }}
          onComplete={onStep6}
          submitting={submitting}
        />
      )}
    </OnboardingShell6>
  );
}
