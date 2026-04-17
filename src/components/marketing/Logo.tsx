import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`}>
    <div className="relative h-8 w-8 rounded-lg gradient-primary shadow-glow flex items-center justify-center">
      <span className="font-display font-bold text-primary-foreground text-sm">A</span>
    </div>
    <div className="font-display font-bold text-lg leading-none">
      <span className="text-gradient">OCAS</span>
      <span className="text-foreground/80 font-medium ml-1">Atelier</span>
    </div>
  </Link>
);
