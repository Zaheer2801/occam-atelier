import { Link } from "react-router-dom";

const nav = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Atelier", href: "/atelier" },
  { label: "Contact", href: "/contact" },
];

export const AppleNav = () => (
  <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/70 border-b border-[hsl(var(--apple-line))]">
    <div className="container flex items-center justify-between h-12 text-[13px]">
      <Link to="/" className="font-semibold tracking-tight text-[hsl(var(--apple-ink))]">
        OCAS<span className="text-[hsl(var(--apple-muted))] font-normal"> Software</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-[hsl(var(--apple-ink-soft))]">
        {nav.map((n) => (
          <Link
            key={n.href}
            to={n.href}
            className="hover:text-[hsl(var(--apple-ink))] transition-colors"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <Link to="/atelier" className="text-[hsl(var(--apple-accent))] hover:underline">
        Open Atelier →
      </Link>
    </div>
  </header>
);
