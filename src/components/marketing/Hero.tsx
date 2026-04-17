import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => (
  <section className="relative pt-32 pb-24 overflow-hidden">
    <div className="absolute inset-0 gradient-hero pointer-events-none" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.15),transparent_50%)] pointer-events-none" />

    <div className="container relative z-10">
      <div className="max-w-3xl mx-auto text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Trusted by 500+ professionals</span>
        </div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl tracking-tight leading-[1.05]">
          Automate your career
          <br />
          search with <span className="text-gradient">AI</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          OCAS Atelier auto-applies, tailors your resume to every role, and gives you real-time
          insights — so you can focus on interviews, not data entry.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" asChild className="gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90 h-12 px-7">
            <Link to="/auth/signup">Get started free <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-7 backdrop-blur">
            <PlayCircle className="h-5 w-5" /> Watch demo
          </Button>
        </div>
      </div>

      <div className="relative mt-20 max-w-5xl mx-auto animate-float">
        <div className="absolute -inset-4 gradient-primary blur-3xl opacity-30 rounded-3xl" />
        <div className="relative glass rounded-2xl p-2 shadow-elevated">
          <div className="rounded-xl overflow-hidden bg-background/60 border border-border/60">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 text-xs text-muted-foreground">app.ocas.software/dashboard</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { l: "Applications", v: "247", c: "from-primary/20" },
                { l: "Interviews", v: "32", c: "from-accent/20" },
                { l: "Offers", v: "5", c: "from-success/20" },
                { l: "Response rate", v: "13%", c: "from-info/20" },
              ].map((s) => (
                <div key={s.l} className={`rounded-xl border border-border/60 bg-gradient-to-br ${s.c} to-transparent p-4`}>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                  <div className="text-2xl font-display font-bold mt-1">{s.v}</div>
                </div>
              ))}
              <div className="md:col-span-4 rounded-xl border border-border/60 bg-card/50 p-4 mt-2">
                <div className="text-xs text-muted-foreground mb-3">Recent applications</div>
                <div className="space-y-2">
                  {[
                    ["Senior Product Designer", "Linear", "Interview"],
                    ["Frontend Engineer", "Vercel", "Screening"],
                    ["Growth Lead", "Stripe", "Applied"],
                  ].map(([p, c, s]) => (
                    <div key={p} className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0">
                      <span className="font-medium">{p}</span>
                      <span className="text-muted-foreground hidden sm:inline">{c}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full gradient-card">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
