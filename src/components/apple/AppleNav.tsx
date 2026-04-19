import { Link, NavLink } from "react-router-dom";

const nav = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Atelier", href: "/atelier" },
  { label: "Contact", href: "/contact" },
];

export const AppleNav = () => (
  <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/75 border-b border-[hsl(var(--apple-line))]">
    <div className="container flex items-center justify-between h-12 text-[13px]">
      <Link
        to="/"
        className="font-semibold tracking-tight text-[hsl(var(--apple-ink))] flex items-center gap-1.5"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[hsl(var(--apple-accent))]" />
        OCAS
        <span className="text-[hsl(var(--apple-muted))] font-normal">Software</span>
      </Link>
      <nav className="hidden md:flex items-center gap-7 text-[hsl(var(--apple-ink-soft))]">
        {nav.map((n) => (
          <NavLink
            key={n.href}
            to={n.href}
            className={({ isActive }) =>
              `transition-colors hover:text-[hsl(var(--apple-ink))] ${
                isActive ? "text-[hsl(var(--apple-ink))]" : ""
              }`
            }
          >
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-5">
        <Link
          to="/auth/signin"
          className="hidden sm:inline text-[hsl(var(--apple-ink-soft))] hover:text-[hsl(var(--apple-ink))] transition-colors"
        >
          Sign in
        </Link>
        <Link
          to="/atelier"
          className="text-[hsl(var(--apple-accent))] hover:underline"
        >
          Open Atelier ›
        </Link>
      </div>
    </div>
  </header>
);
