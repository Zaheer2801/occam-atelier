import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import character from "@/assets/atelier-character.png";

export const AtelierCTA = () => (
  <section className="container max-w-7xl py-16">
    <div className="atelier-card-yellow relative overflow-hidden p-10 md:p-16">
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-center relative z-10">
        <div>
          <h2 className="atelier-display atelier-display-lg">
            Ready when you are.
          </h2>
          <p className="mt-4 max-w-lg text-[hsl(30_10%_20%)]">
            Open the Atelier portal to sign in, or create a new client account and we'll
            match you with our automation team within 24 hours.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/auth/signup" className="atelier-cta-coral">
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/auth/signin" className="atelier-cta-ink">
              Sign in
            </Link>
          </div>
        </div>
        <div className="hidden md:flex justify-end">
          <img
            src={character}
            alt=""
            aria-hidden
            width={1024}
            height={1024}
            loading="lazy"
            className="w-72 atelier-bob drop-shadow-[0_24px_30px_rgba(0,0,0,0.18)]"
          />
        </div>
      </div>
    </div>
  </section>
);
