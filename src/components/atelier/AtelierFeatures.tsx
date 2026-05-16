import { Bot, Workflow, Inbox, BarChart3, Layers, ShieldCheck } from "lucide-react";

const features = [
  { icon: Bot, title: "AI application engine", body: "Auto-tailor resumes and cover letters per role with on-brand copy." },
  { icon: Workflow, title: "Pipeline automation", body: "Apply, track, and nurture across hundreds of openings — no spreadsheets." },
  { icon: Inbox, title: "Unified inbox", body: "Recruiter messages, interview invites, and follow-ups in one calm view." },
  { icon: BarChart3, title: "Outcome analytics", body: "See exactly which roles and channels convert. Double down on what works." },
  { icon: Layers, title: "Role library", body: "Curated tracks for software, product, design, and operations roles." },
  { icon: ShieldCheck, title: "Privacy-first", body: "Your data never trains public models. Encrypted at rest and in transit." },
];

export const AtelierFeatures = () => (
  <section id="features" className="container max-w-7xl py-20">
    <div className="max-w-2xl mb-12">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(8_84%_55%)]">Inside Atelier</p>
      <h2 className="mt-3 atelier-display atelier-display-lg">
        Every tool your team needs.
        <br />
        None of the noise.
      </h2>
    </div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {features.map((f) => (
        <div key={f.title} className="atelier-card-cream p-7">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(46_96%_58%)] text-[hsl(30_10%_10%)]">
            <f.icon className="h-5 w-5" />
          </div>
          <h3 className="mt-5 atelier-display text-lg font-bold">{f.title}</h3>
          <p className="mt-2 text-sm text-[hsl(30_10%_35%)] leading-relaxed">{f.body}</p>
        </div>
      ))}
    </div>
  </section>
);
