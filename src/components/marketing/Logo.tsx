import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/atelier" className={`flex items-start gap-2.5 ${className}`}>
    <div>
      <div className="flex items-center gap-2">
        <span className="atelier-display text-xl font-extrabold text-[hsl(30_10%_10%)] tracking-tight">
          OCAS
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-[hsl(46_96%_58%)] text-[hsl(8_84%_55%)] font-bold">
          Atelier
        </span>
      </div>
      <p className="text-[9px] font-mono uppercase tracking-widest text-[hsl(30_10%_45%)] mt-0.5">
        Outsource · Connect · Apply · Succeed
      </p>
    </div>
  </Link>
);
