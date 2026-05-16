import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/atelier" className={`flex items-center gap-2.5 ${className}`}>
    <div className="flex flex-col leading-none">
      <div className="flex items-center gap-2">
        <span className="atelier-display text-xl font-extrabold tracking-tight text-[hsl(30_10%_10%)]">
          OCAS
        </span>
        <span className="rounded-full bg-[hsl(46_96%_58%)] px-2 py-0.5 text-[11px] font-bold text-[hsl(8_84%_55%)]">
          Atelier
        </span>
      </div>
      <span
        className="mt-1 font-mono uppercase tracking-[0.14em] text-[hsl(30_10%_45%)]"
        style={{ fontSize: "9px" }}
      >
        Outsource · Connect · Apply · Succeed
      </span>
    </div>
  </Link>
);
