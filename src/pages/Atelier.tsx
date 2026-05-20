import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, LayoutDashboard } from "lucide-react";
import { AtelierNav } from "@/components/atelier/AtelierNav";
import { AtelierHowItWorks } from "@/components/atelier/AtelierHowItWorks";
import { AtelierFeatures } from "@/components/atelier/AtelierFeatures";
import { AtelierContact } from "@/components/atelier/AtelierContact";
import { AtelierFooter } from "@/components/atelier/AtelierFooter";
import character from "@/assets/atelier-character.png";

const Atelier = () => (
  <div className="atelier min-h-screen flex flex-col atelier-grid-bg">
    <AtelierNav />
    <main className="flex-1">

      {/* PORTAL HERO */}
      <section className="container max-w-7xl pt-10 pb-16 md:pt-14 md:pb-24">
        <div className="atelier-card-yellow relative overflow-hidden p-8 sm:p-12 md:p-16">
          <div className="relative z-10 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full bg-[hsl(8_84%_55%)] text-white mb-6">
                <LayoutDashboard className="h-3 w-3" /> Dashboard access
              </span>
              <h1 className="atelier-display atelier-display-xl">
                Your team is<br />ready.
              </h1>
              <p className="mt-4 text-lg font-light text-[hsl(30_10%_15%)]">
                Sign in to your Atelier portal and pick up where your team left off.
              </p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[hsl(30_10%_25%)]">
                Atelier is the workspace where your job search runs. Track every application, read recruiter replies, monitor your pipeline, and review analytics — all in one place.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/auth/signin" className="atelier-cta-coral">
                  Sign in to portal
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/auth/signup" className="atelier-cta-ink">
                  Create account
                </Link>
              </div>
              <p className="mt-5 text-sm text-[hsl(30_10%_35%)]">
                Not a client yet?{" "}
                <Link to="/" className="font-semibold text-[hsl(8_84%_55%)] underline-offset-4 hover:underline inline-flex items-center gap-1">
                  Learn about OCAS <ArrowUpRight className="h-3 w-3" />
                </Link>
              </p>
            </div>
            <div className="hidden md:flex justify-end">
              <img
                src={character}
                alt="Atelier — your career team"
                width={1024}
                height={1024}
                className="w-80 atelier-bob drop-shadow-[0_30px_40px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <AtelierHowItWorks />

      {/* WHAT'S INSIDE */}
      <AtelierFeatures />

      {/* SUPPORT / CONTACT */}
      <AtelierContact />

    </main>
    <AtelierFooter />
  </div>
);

export default Atelier;
