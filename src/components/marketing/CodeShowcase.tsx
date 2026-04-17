import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const lines = [
  { c: "muted-foreground", t: "// Define your target role" },
  { c: "primary", t: "const target = " },
  { c: "foreground", t: "{ role: 'Senior Designer', remote: true }" },
  { c: "muted-foreground", t: "" },
  { c: "muted-foreground", t: "// Let OCAS do the heavy lifting" },
  { c: "primary", t: "await ocas." },
  { c: "accent", t: "autoApply" },
  { c: "foreground", t: "(target)" },
  { c: "muted-foreground", t: "" },
  { c: "success", t: "✓ 47 applications submitted" },
  { c: "success", t: "✓ 8 interviews scheduled" },
];

export const CodeShowcase = () => {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => Math.min(v + 1, lines.length)), 350);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="container py-24">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div>
          <p className="text-sm font-medium text-primary mb-3">Automation in action</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            One workflow, <span className="text-gradient">hundreds of applications</span>
          </h2>
          <p className="text-muted-foreground mt-4">
            Configure your target role once. OCAS submits perfectly tailored applications,
            tracks responses, and surfaces what's working.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Smart form filling on 200+ ATS platforms",
              "Resume tailored per role with AI",
              "Cover letters that read human",
              "Real-time status updates",
            ].map((it) => (
              <li key={it} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-1 shadow-elevated">
          <div className="rounded-xl bg-background/80 p-6 font-mono text-sm min-h-[320px]">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            </div>
            {lines.slice(0, n).map((l, i) => (
              <div key={i} className={`text-${l.c} animate-fade-in leading-relaxed`}>
                {l.t || "\u00A0"}
              </div>
            ))}
            {n < lines.length && <span className="inline-block w-2 h-4 bg-primary animate-pulse" />}
          </div>
        </div>
      </div>
    </section>
  );
};
