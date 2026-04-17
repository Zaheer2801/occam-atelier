import { Link } from "react-router-dom";
import { forwardRef } from "react";

export const Logo = forwardRef<HTMLAnchorElement, { className?: string }>(
  ({ className = "" }, ref) => (
    <Link ref={ref} to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="font-display text-xl text-foreground">
        OCAS <span className="text-primary">Atelier</span>
      </div>
    </Link>
  )
);
Logo.displayName = "Logo";
