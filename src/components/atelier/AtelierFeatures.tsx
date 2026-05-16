import { Bot, Workflow, Inbox, BarChart3, Layers, ShieldCheck } from "lucide-react";

const features = [
  { icon: Bot, title: "AI Application Engine", body: "Resumes and cover letters tailored per role, per company, automatically. No copy-paste." },
  { icon: Workflow, title: "Pipeline Automation", body: "We apply to hundreds of openings across USA, Canada, and India. You see every move." },
  { icon: Inbox, title: "Unified Inbox", body: "Recruiter replies, rejections, and interview invites — all in one place. No inbox chaos." },
  { icon: BarChart3, title: "Outcome Analytics", body: "Track positive replies, rejection patterns, and interview conversion rates in real time." },
  { icon: Layers, title: "Follow-up Automation", body: "System detects when to follow up and sends it automatically. Recruiters remember you." },
  { icon: ShieldCheck, title: "Built for Affordability", body: "Genuine results without agency pricing. OCAS exists because great talent shouldn't need a $5,000 recruiter." },
];

export const AtelierFeatures = () => (
  <section id="features" className="container max-w-7xl py-20">
    <div className="max-w-2xl mb-12">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(8_84%_55%)]">Inside Atelier</p>
      <h2 className="mt-3 atelier-display atelier-display-lg">
        Your career department. Fully staffed.
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
