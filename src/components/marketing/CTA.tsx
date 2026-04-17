import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => (
  <section className="container py-20">
    <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 md:p-16 text-center shadow-glow">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_50%)]" />
      <h2 className="relative font-display text-3xl md:text-5xl font-bold text-primary-foreground">
        Ready to land your next role?
      </h2>
      <p className="relative mt-4 text-primary-foreground/80 max-w-xl mx-auto">
        Start free. No credit card required. Cancel anytime.
      </p>
      <Button asChild size="lg" variant="secondary" className="relative mt-8 h-12 px-7">
        <Link to="/auth/signup">Get started free <ArrowRight className="h-4 w-4" /></Link>
      </Button>
    </div>
  </section>
);
