import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

/**
 * The persistent yellow Atelier banner — the homepage's primary CTA.
 * It does NOT route directly to login. Instead it leads to the public
 * Atelier marketing page where the user can read about the product and
 * choose to sign up or sign in deliberately.
 */
export const AppleAtelierBanner = () => (
  <section className="py-10">
    <div className="container max-w-7xl">
      <div className="apple-tile-yellow p-10 sm:p-16 relative overflow-hidden">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-center relative z-10">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-semibold opacity-70 mb-3">
              The Atelier Portal
            </p>
            <h2 className="apple-display apple-display-lg">
              Your dedicated
              <br />
              career department,
              <br />
              one click away.
            </h2>
            <p className="mt-5 max-w-lg text-[15px] sm:text-base leading-relaxed opacity-80">
              Real humans + smart automation managing your job search end to
              end. Existing client? Visit the portal — you'll choose to sign in
              from there.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link
              to="/atelier"
              className="inline-flex items-center gap-2 bg-black text-white px-7 py-4 rounded-full text-sm font-medium hover:bg-black/85 transition-colors"
            >
              Visit the Atelier
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-25 blur-3xl"
          style={{ background: "hsl(8 84% 60%)" }}
          aria-hidden
        />
      </div>
    </div>
  </section>
);
