import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Home } from "lucide-react";
import { OcasNav } from "@/components/ocas/OcasNav";
import { OcasFooter } from "@/components/ocas/OcasFooter";

/**
 * Catch-all 404 for any unknown route — including legacy marketing paths
 * such as /pricing, /about, /contact, /features, /brand, /right-job that
 * were consolidated into the OCAS homepage.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add("ocas");
    document.body.style.backgroundColor = "hsl(230 25% 4%)";
    return () => {
      document.documentElement.classList.remove("ocas");
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    console.warn("404: route not found:", location.pathname);
  }, [location.pathname]);

  // Map legacy marketing paths to the in-page anchor that replaced them.
  const suggestion = useMemo(() => {
    const p = location.pathname.toLowerCase();
    const map: Record<string, { label: string; to: string }> = {
      "/about": { label: "About OCAS", to: "/#ai-lab" },
      "/features": { label: "What we do", to: "/#ai-lab" },
      "/pricing": { label: "Talk to us", to: "/#us-bridge" },
      "/contact": { label: "Talk to us", to: "/#us-bridge" },
      "/brand": { label: "OCAS homepage", to: "/" },
      "/right-job": { label: "Atelier portal", to: "/atelier" },
    };
    return map[p] ?? null;
  }, [location.pathname]);

  return (
    <div className="ocas min-h-screen flex flex-col">
      <OcasNav />
      <main className="flex-1 relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-30 ocas-mesh-bg" />
        <div className="absolute inset-0 -z-20 ocas-grid-bg opacity-50" />
        <div className="ocas-orb ocas-orb-cyan w-[420px] h-[420px] -top-20 -left-20 ocas-drift" />
        <div
          className="ocas-orb ocas-orb-violet w-[360px] h-[360px] bottom-0 -right-20 ocas-drift"
          style={{ animationDelay: "-6s" }}
        />

        <section className="container max-w-3xl text-center pt-28 pb-24 relative">
          <span className="ocas-eyebrow mx-auto">
            <span className="ocas-eyebrow-dot" />
            Error · 404
          </span>
          <h1 className="ocas-display ocas-display-xl mt-6">
            This page <span className="ocas-text-gradient">moved on.</span>
          </h1>
          <p className="mt-6 ocas-text-soft text-lg leading-relaxed">
            We've consolidated our site into a single homepage. The path you
            tried —{" "}
            <span className="ocas-mono text-[hsl(var(--ocas-cyan))] break-all">
              {location.pathname}
            </span>{" "}
            — no longer exists.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="ocas-cta">
              <Home className="h-4 w-4" /> Back to home
            </Link>
            {suggestion && (
              <Link to={suggestion.to} className="ocas-cta-ghost">
                {suggestion.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </section>
      </main>
      <OcasFooter />
    </div>
  );
};

export default NotFound;
