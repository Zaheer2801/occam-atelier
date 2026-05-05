import { Link, useLocation } from "react-router-dom";
import { Grid3x3 } from "lucide-react";

const links = [
  { label: "Product", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Contact", href: "#contact" },
];

export const AtelierNav = () => {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[hsl(44_56%_94%_/_0.85)] border-b border-[hsl(36_24%_86%)]">
      <nav className="container max-w-7xl flex items-center justify-between h-16">
        <Link to="/atelier" className="flex items-center gap-2">
          <span className="atelier-display text-xl font-extrabold tracking-tight">Atelier</span>
          <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-[hsl(46_96%_58%)] text-[hsl(30_10%_10%)]">
            by OCAS
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[hsl(30_10%_25%)]">
          {links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} className="hover:text-[hsl(8_84%_55%)] transition-colors">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="hover:text-[hsl(8_84%_55%)] transition-colors">
                {l.label}
              </a>
            )
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/auth/signin"
            className="text-sm font-semibold text-[hsl(30_10%_10%)] hover:text-[hsl(8_84%_55%)] transition-colors"
          >
            Sign in
          </Link>
          <Link to="/auth/signup" className="atelier-cta-coral !py-2.5 !px-5 text-sm">
            Get started
          </Link>
          <button
            aria-label="menu"
            className="ml-1 hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[hsl(8_84%_60%)] text-[hsl(8_84%_55%)]"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  );
};
