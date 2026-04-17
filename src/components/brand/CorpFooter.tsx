import { Link } from "react-router-dom";
import { OcasLogo } from "@/components/brand/OcasLogo";

export const CorpFooter = () => (
  <footer className="relative border-t border-corp-border/60 mt-24">
    <div className="container py-14 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2 space-y-4">
        <OcasLogo variant="connected" mode="color" size={36} />
        <p className="text-sm text-corp-muted max-w-sm">
          OCAS Software LLC builds intelligent automation tools for ambitious careers.
          Maker of <span className="text-corp-text">OCAS Atelier</span>.
        </p>
        <p className="text-xs text-corp-dim font-mono">© {new Date().getFullYear()} OCAS Software LLC</p>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-[0.2em] text-corp-dim mb-4">Products</h4>
        <ul className="space-y-2 text-sm text-corp-muted">
          <li><Link to="/atelier" className="hover:text-corp-text">OCAS Atelier</Link></li>
          <li><Link to="/auth/signin" className="hover:text-corp-text">Sign in</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-[0.2em] text-corp-dim mb-4">Company</h4>
        <ul className="space-y-2 text-sm text-corp-muted">
          <li><Link to="/brand" className="hover:text-corp-text">Brand</Link></li>
          <li><a href="mailto:hello@ocas.software" className="hover:text-corp-text">Contact</a></li>
        </ul>
      </div>
    </div>
  </footer>
);
