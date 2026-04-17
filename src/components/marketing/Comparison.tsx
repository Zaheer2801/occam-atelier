import { Check, X } from "lucide-react";

const rows = [
  ["AI auto-apply", true, false, false],
  ["Resume tailored per role", true, false, true],
  ["Real-time analytics", true, true, false],
  ["ATS keyword matching", true, false, false],
  ["Interview prep tools", true, false, false],
  ["Dedicated success manager", true, false, false],
];

export const Comparison = () => (
  <section className="container py-24">
    <div className="text-center max-w-2xl mx-auto mb-12">
      <p className="text-sm font-medium text-primary mb-3">Comparison</p>
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
        Why teams pick <span className="text-gradient">OCAS</span>
      </h2>
    </div>
    <div className="glass rounded-2xl overflow-x-auto">
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="border-b border-border/60">
            <th className="text-left p-5 font-medium text-muted-foreground">Feature</th>
            <th className="p-5 font-display font-semibold text-gradient">OCAS</th>
            <th className="p-5 text-muted-foreground">Job boards</th>
            <th className="p-5 text-muted-foreground">Resume tools</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, ...vals], i) => (
            <tr key={i} className="border-b border-border/40 last:border-0">
              <td className="p-5 font-medium">{label}</td>
              {vals.map((v, j) => (
                <td key={j} className="p-5 text-center">
                  {v ? <Check className="h-4 w-4 text-success inline" /> : <X className="h-4 w-4 text-muted-foreground inline" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
