import { cn } from "@/lib/utils";

type Variant = "connected" | "wordmark" | "monogram";
type Mode = "color" | "reversed" | "mono";

interface Props {
  variant?: Variant;
  mode?: Mode;
  animate?: boolean;
  showWordmark?: boolean;
  className?: string;
  size?: number;
}

const GradientDef = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="hsl(var(--corp-blue))" />
      <stop offset="100%" stopColor="hsl(var(--corp-purple))" />
    </linearGradient>
  </defs>
);

const ConnectedIcon = ({ animate, mode, size = 40 }: { animate?: boolean; mode: Mode; size?: number }) => {
  const stroke = mode === "mono" ? "currentColor" : "url(#ocas-grad-c)";
  const fill = mode === "mono" ? "currentColor" : "url(#ocas-grad-c)";
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden className="shrink-0">
      <GradientDef id="ocas-grad-c" />
      {/* outer connected ring */}
      <circle
        cx="50" cy="50" r="38"
        fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round"
        className={animate ? "corp-draw" : ""}
      />
      {/* nodes */}
      {[0, 72, 144, 216, 288].map((deg) => {
        const r = 38;
        const x = 50 + r * Math.cos((deg - 90) * Math.PI / 180);
        const y = 50 + r * Math.sin((deg - 90) * Math.PI / 180);
        return <circle key={deg} cx={x} cy={y} r="5" fill={fill} />;
      })}
      {/* inner pulse core */}
      <circle cx="50" cy="50" r="7" fill={fill} className={animate ? "corp-pulse-soft" : ""} />
    </svg>
  );
};

const MonogramIcon = ({ mode, size = 40 }: { mode: Mode; size?: number }) => {
  const fill = mode === "mono" ? "currentColor" : "url(#ocas-grad-m)";
  const text = mode === "reversed" ? "hsl(var(--corp-bg))" : "white";
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden className="shrink-0">
      <GradientDef id="ocas-grad-m" />
      <rect x="4" y="4" width="92" height="92" rx="22" fill={fill} />
      <text
        x="50" y="58" textAnchor="middle"
        fontFamily="Inter, sans-serif" fontWeight="800" fontSize="26"
        fill={text} letterSpacing="1"
      >OCAS</text>
    </svg>
  );
};

const ArrowIcon = ({ mode, size = 40, animate }: { mode: Mode; size?: number; animate?: boolean }) => {
  const stroke = mode === "mono" ? "currentColor" : "url(#ocas-grad-a)";
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden className="shrink-0">
      <GradientDef id="ocas-grad-a" />
      <path
        d="M20 78 L50 22 L80 78 M34 60 L66 60"
        fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
        className={animate ? "corp-draw" : ""}
      />
    </svg>
  );
};

export const OcasLogo = ({
  variant = "connected",
  mode = "color",
  animate = false,
  showWordmark = true,
  className,
  size = 40,
}: Props) => {
  const Icon =
    variant === "monogram" ? <MonogramIcon mode={mode} size={size} /> :
    variant === "wordmark" ? <ArrowIcon mode={mode} size={size} animate={animate} /> :
    <ConnectedIcon mode={mode} size={size} animate={animate} />;

  const wordmarkColor =
    mode === "mono" ? "text-current" :
    mode === "reversed" ? "text-corp-bg" :
    "text-corp-text";

  return (
    <div className={cn("inline-flex items-center gap-3 group", className)}>
      {Icon}
      {showWordmark && (
        <div className={cn("flex flex-col leading-none", wordmarkColor)}>
          <span className="font-sans text-[1.05rem] tracking-tight font-semibold">
            OCAS <span className="corp-text-gradient font-semibold">Software</span>
          </span>
          <span className="text-[0.6rem] uppercase tracking-[0.28em] mt-1 text-corp-dim font-mono">
            LLC
          </span>
        </div>
      )}
    </div>
  );
};

export default OcasLogo;
