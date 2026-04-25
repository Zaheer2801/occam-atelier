import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Command } from "lucide-react";

const nav = [
  { label: "AI Lab", href: "#ai-lab" },
  { label: "Academy", href: "#academy" },
  { label: "Marketing", href: "#marketing" },
  { label: "US Bridge", href: "#us-bridge" },
  { label: "Atelier", href: "/atelier" },
];

export const OcasNav = ({ onCommand }: { onCommand?: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-2xl bg-[hsl(var(--ocas-bg))/0.7] border-b border-white/5"
          : "backdrop-blur-md bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-14 text-[13px]">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--ocas-cyan))/0.5] animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[hsl(var(--ocas-cyan))]" />
          </span>
          <span className="ocas-text-gradient">OCAS</span>
          <span className="ocas-text-muted font-normal">Software</span>
          <span className="ml-2 hidden sm:inline ocas-mono text-[10px] ocas-text-dim border border-white/10 rounded px-1.5 py-0.5">
            EST. 2022
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 ocas-text-soft">
          {nav.map((n) =>
            n.href.startsWith("#") ? (
              <a
                key={n.href}
                href={n.href}
                className="hover:text-white transition-colors"
              >
                {n.label}
              </a>
            ) : (
              <NavLink
                key={n.href}
                to={n.href}
                className={({ isActive }) =>
                  `transition-colors hover:text-white ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                {n.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCommand}
            className="hidden md:inline-flex items-center gap-2 ocas-mono text-[11px] ocas-text-muted border border-white/10 hover:border-white/30 rounded-md px-2 py-1.5 transition-colors"
          >
            <Command className="h-3 w-3" /> K
          </button>
          <Link
            to="/auth/signin"
            className="hidden sm:inline ocas-text-soft hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link to="/atelier" className="ocas-cta-ghost">
            Open Atelier ›
          </Link>
        </div>
      </div>
    </header>
  );
};