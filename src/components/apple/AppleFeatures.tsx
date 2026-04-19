import { Bot, Workflow, BarChart3, Inbox, ShieldCheck, Layers } from "lucide-react";

const items = [
  { icon: Bot, title: "AI application engine", body: "Auto-tailor resumes and cover letters per role with on-brand copy." },
  { icon: Workflow, title: "Pipeline automation", body: "Apply, track, and nurture across hundreds of openings — no spreadsheets." },
  { icon: Inbox, title: "Unified inbox", body: "Recruiter messages, invites, and follow-ups in one calm view." },
  { icon: BarChart3, title: "Outcome analytics", body: "See which roles, companies, and channels actually convert." },
  { icon: Layers, title: "Curated role library", body: "Hand-picked tracks across software, product, design, and ops." },
  { icon: ShieldCheck, title: "Privacy-first", body: "Your resume never trains public models. Encrypted at rest and in transit." },
];

export const AppleFeatures = () => (
  <section className="py-24">
    <div className="container max-w-6xl">
      <div className="max-w-2xl">
        <p className="apple-eyebrow uppercase">Built for outcomes</p>
        <h2 className="apple-display apple-display-lg mt-3 text-[hsl(var(--apple-ink))]">
          Everything you need.
          <br />
          <span className="text-[hsl(var(--apple-muted))]">Nothing you don't.</span>
        </h2>
      </div>
      <div className="mt-14 grid gap-px bg-[hsl(var(--apple-line))] md:grid-cols-3 rounded-3xl overflow-hidden border border-[hsl(var(--apple-line))]">
        {items.map((it) => (
          <div key={it.title} className="bg-white p-8 sm:p-10">
            <it.icon className="h-6 w-6 text-[hsl(var(--apple-accent))]" strokeWidth={1.6} />
            <h3 className="mt-5 text-lg font-semibold text-[hsl(var(--apple-ink))]">{it.title}</h3>
            <p className="mt-2 text-[hsl(var(--apple-ink-soft))] leading-relaxed text-[15px]">{it.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
