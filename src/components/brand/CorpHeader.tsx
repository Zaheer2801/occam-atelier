import { Link } from "react-router-dom";
import { OcasLogo } from "@/components/brand/OcasLogo";

const nav = [
  { label: "Products", href: "#products" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "About", href: "#about" },
  { label: "Brand", href: "/brand" },
];

export const CorpHeader = () => (
  <header className="sticky top-0 z-50 w-full">
    <div className="absolute inset-0 -z-10 backdrop-blur-xl bg-corp-bg/60 border-b border-corp-border/60" />
    <div className="container flex items-center justify-between h-16">
      <Link to="/" aria-label="OCAS Software home" className="flex items-center">
        <OcasLogo variant="connected" mode="color" size={34} animate />
      </Link>
      <nav className="hidden md:flex items-center gap-7 text-sm text-corp-muted">
        {nav.map((n) =>
          n.href.startsWith("/") ? (
            <Link key={n.href} to={n.href} className="hover:text-corp-text transition-colors">
              {n.label}
            </Link>
          ) : (
            <a key={n.href} href={n.href} className="hover:text-corp-text transition-colors">
              {n.label}
            </a>
          )
        )}
      </nav>
      <div className="flex items-center gap-3">
        <Link
          to="/auth/signin"
          className="hidden sm:inline-flex text-sm text-corp-muted hover:text-corp-text transition-colors"
        >
          Sign in
        </Link>
        <Link
          to="/auth/signin"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white corp-gradient shadow-[0_8px_30px_-8px_hsl(var(--corp-purple)/0.6)] hover:shadow-[0_12px_36px_-8px_hsl(var(--corp-purple)/0.8)] transition-shadow"
        >
          Launch Atelier
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  </header>
);
