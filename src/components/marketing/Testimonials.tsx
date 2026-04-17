import { Star } from "lucide-react";

const items = [
  { n: "Maya Chen", r: "Product Designer @ Linear", q: "OCAS submitted 60 applications in my first week. I had three interviews by Friday." },
  { n: "Jordan Reyes", r: "Frontend Engineer @ Vercel", q: "The AI resume tailoring is wild. My response rate doubled overnight." },
  { n: "Priya Patel", r: "Growth Lead @ Stripe", q: "I stopped dreading job hunting. The dashboard alone is worth it." },
];

export const Testimonials = () => (
  <section className="container py-24">
    <div className="text-center max-w-2xl mx-auto mb-14">
      <p className="text-sm font-medium text-primary mb-3">Loved by job seekers</p>
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
        Real people, <span className="text-gradient">real offers</span>
      </h2>
    </div>
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((t) => (
        <div key={t.n} className="glass rounded-2xl p-7 hover-lift">
          <div className="flex gap-0.5 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-warning text-warning" />
            ))}
          </div>
          <p className="text-foreground/90 leading-relaxed mb-6">"{t.q}"</p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center font-display font-semibold text-primary-foreground text-sm">
              {t.n.split(" ").map((s) => s[0]).join("")}
            </div>
            <div>
              <div className="font-semibold text-sm">{t.n}</div>
              <div className="text-xs text-muted-foreground">{t.r}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
