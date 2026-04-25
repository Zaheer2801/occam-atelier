/**
 * Stylized US "success map" with glowing nodes over major tech hubs.
 * Pure SVG — no map libs.
 */
const HUBS = [
  { city: "SF", x: 90, y: 165, delay: "0s" },
  { city: "LA", x: 110, y: 215, delay: "0.4s" },
  { city: "Seattle", x: 110, y: 90, delay: "0.8s" },
  { city: "Austin", x: 280, y: 245, delay: "1.2s" },
  { city: "Dallas", x: 295, y: 225, delay: "0.2s" },
  { city: "Denver", x: 220, y: 175, delay: "0.6s" },
  { city: "Chicago", x: 360, y: 155, delay: "1.0s" },
  { city: "ATL", x: 410, y: 240, delay: "1.4s" },
  { city: "Boston", x: 500, y: 130, delay: "0.3s" },
  { city: "NYC", x: 490, y: 150, delay: "0.7s" },
  { city: "Miami", x: 450, y: 295, delay: "1.1s" },
];

export const OcasUSMap = () => (
  <div className="relative h-full min-h-[260px] rounded-2xl overflow-hidden border border-white/10 bg-[hsl(230_25%_5%)]">
    <div className="absolute inset-0 ocas-grid-bg opacity-40" />
    <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
      <span className="ocas-eyebrow">
        <span className="ocas-eyebrow-dot" />
        US reach · live
      </span>
      <span className="ocas-mono text-[10px] ocas-text-dim">
        {HUBS.length} hubs
      </span>
    </div>
    <svg
      viewBox="0 0 600 360"
      className="w-full h-full block"
      role="img"
      aria-label="US tech hubs map"
    >
      <defs>
        <radialGradient id="ocas-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(187 100% 60%)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="hsl(187 100% 60%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ocas-stroke" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(187 100% 60%)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(262 90% 66%)" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Stylized US silhouette path (low-fidelity, decorative) */}
      <path
        d="M70,170 C60,120 100,80 160,75 C220,70 250,95 290,90 C330,85 380,70 440,80 C490,88 530,110 540,150 C548,182 530,210 510,220 C500,260 460,300 410,310 C360,320 300,310 250,300 C200,290 150,290 120,275 C90,260 70,225 70,170 Z"
        fill="hsl(230 30% 8%)"
        stroke="url(#ocas-stroke)"
        strokeWidth="1"
        opacity="0.85"
      />

      {/* Connection lines from SF → others */}
      {HUBS.slice(1).map((h) => (
        <line
          key={"l-" + h.city}
          x1={HUBS[0].x}
          y1={HUBS[0].y}
          x2={h.x}
          y2={h.y}
          stroke="url(#ocas-stroke)"
          strokeWidth="0.4"
          opacity="0.35"
        />
      ))}

      {/* Hubs */}
      {HUBS.map((h) => (
        <g key={h.city}>
          <circle
            cx={h.x}
            cy={h.y}
            r="14"
            fill="url(#ocas-glow)"
            opacity="0.9"
          >
            <animate
              attributeName="r"
              values="8;18;8"
              dur="3s"
              begin={h.delay}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.9;0.2;0.9"
              dur="3s"
              begin={h.delay}
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={h.x}
            cy={h.y}
            r="2.5"
            fill="hsl(187 100% 70%)"
          />
          <text
            x={h.x + 8}
            y={h.y - 6}
            fill="hsl(220 30% 92%)"
            fontSize="9"
            fontFamily="ui-monospace, Menlo, monospace"
            opacity="0.85"
          >
            {h.city}
          </text>
        </g>
      ))}
    </svg>
  </div>
);