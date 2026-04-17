import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import { Bot, Workflow, ShieldCheck, LineChart, Zap, Globe } from "lucide-react";

const items = [
  { icon: Bot, t: "Agentic Automation", b: "Long-running agents that browse, apply, and follow up — supervised, never spammy." },
  { icon: Workflow, t: "Human-in-the-loop", b: "Every important step routes back to a human. Quiet by default, loud when it matters." },
  { icon: LineChart, t: "Career Analytics", b: "Funnels, response rates, time-to-interview — all of it, in real time." },
  { icon: ShieldCheck, t: "Privacy first", b: "Your resume, your search, your data. Encrypted at rest, scoped by role." },
  { icon: Zap, t: "Edge-fast", b: "Workspace built on edge functions. Sub-100ms feedback for every action." },
  { icon: Globe, t: "Global by default", b: "Localized job sources, time zones, and currencies — wherever your career lives." },
];

export const CorpCapabilities = () => (
  <section id="capabilities" className="relative py-28">
    <CorpBackdrop variant="section" />
    <div className="container">
      <div className="max-w-2xl corp-reveal">
        <p className="text-xs uppercase tracking-[0.22em] text-corp-purple font-semibold mb-4">Capabilities</p>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-corp-text">
          Engineering, with <span className="corp-text-gradient">human taste.</span>
        </h2>
        <p className="mt-5 text-corp-muted text-lg">
          The same primitives power our workspace today and the products we ship tomorrow.
        </p>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <div
            key={it.t}
            className="group corp-card p-6 corp-reveal hover:border-corp-text/30 transition-colors"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="h-11 w-11 rounded-xl corp-gradient-soft grid place-items-center group-hover:scale-110 transition-transform">
              <it.icon className="h-5 w-5 text-corp-text" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-corp-text">{it.t}</h3>
            <p className="mt-2 text-sm text-corp-muted">{it.b}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
