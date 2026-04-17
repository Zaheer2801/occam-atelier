import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Starter", monthly: 29, yearly: 24,
    desc: "Perfect for active job seekers",
    features: ["50 auto-applications/month", "Basic resume optimization", "Email support", "Application tracking"],
    cta: "Start free trial",
  },
  {
    name: "Professional", monthly: 79, yearly: 64,
    desc: "For serious career changers",
    features: ["Unlimited auto-applications", "Advanced AI resume tailoring", "Priority support", "Interview prep tools", "LinkedIn optimization", "Weekly strategy calls"],
    cta: "Get started", popular: true,
  },
  {
    name: "Enterprise", monthly: null, yearly: null,
    desc: "For teams and organizations",
    features: ["White-label solution", "API access", "Dedicated account manager", "Custom integrations", "SLA guarantee", "Analytics dashboard"],
    cta: "Contact sales",
  },
];

export const Pricing = () => {
  const [yearly, setYearly] = useState(false);
  return (
    <section id="pricing" className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-sm font-medium text-primary mb-3">Pricing</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          Simple, <span className="text-gradient">transparent pricing</span>
        </h2>
        <div className="mt-8 inline-flex items-center gap-3 glass rounded-full px-4 py-2">
          <span className={`text-sm ${!yearly && "font-semibold"}`}>Monthly</span>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <span className={`text-sm ${yearly && "font-semibold"}`}>Yearly <span className="text-xs text-success ml-1">−17%</span></span>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
        {tiers.map((t) => (
          <div key={t.name} className={`relative rounded-2xl p-8 flex flex-col ${t.popular ? "gradient-border shadow-glow" : "glass"}`}>
            {t.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold gradient-primary text-primary-foreground">
                Most popular
              </span>
            )}
            <div>
              <h3 className="font-display font-bold text-xl">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                {t.monthly == null ? (
                  <span className="font-display font-bold text-4xl">Custom</span>
                ) : (
                  <>
                    <span className="font-display font-bold text-5xl">${yearly ? t.yearly : t.monthly}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </>
                )}
              </div>
            </div>
            <ul className="mt-8 space-y-3 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" /> <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild className={`mt-8 ${t.popular ? "gradient-primary text-primary-foreground border-0 shadow-glow" : ""}`} variant={t.popular ? "default" : "outline"}>
              <Link to="/auth/signup">{t.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};
