import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`}>
    <div className="font-display text-xl text-foreground">
      Right <span className="text-primary">Job</span>
    </div>
  </Link>
);
