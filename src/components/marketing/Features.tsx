import { Zap, TrendingUp, Layers, Shield, Bot, Target } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const items = [
  { icon: Zap, title: "Real-time intelligence", desc: "Live data from job boards, ATS, and your inbox feed accurate decisions." },
  { icon: TrendingUp, title: "Measurable impact", desc: "Track applications, interviews, and offers with data-backed insights." },
  { icon: Layers, title: "Seamless integration", desc: "Connect resume, LinkedIn, and job boards in a single workspace." },
  { icon: Bot, title: "AI auto-apply", desc: "Tailored applications submitted while you sleep — never miss a window." },
  { icon: Shield, title: "Privacy-first", desc: "Your data is encrypted at rest. We never sell anything to anyone." },
  { icon: Target, title: "Role targeting", desc: "Smart filters surface only roles that actually match your profile." },
];

export const Features = () => {
  const { ref, shown } = useReveal();
  return (
    <section className="container py-24" id="features" ref={ref}>
      <div className="max-w-2xl mx-auto text-center mb-14">
        <p className="text-sm font-medium text-primary mb-3">Why OCAS</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          Everything you need to <span className="text-gradient">land faster</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          A complete toolkit replacing the dozen tools you're juggling today.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <div
            key={it.title}
            className={`group glass rounded-2xl p-7 hover-lift ${shown ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
          >
            <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow mb-5 group-hover:scale-110 transition-transform">
              <it.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">{it.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
