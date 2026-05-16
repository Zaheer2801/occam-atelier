const belowLabels = [
  "AI resume tailoring",
  "Mass applications",
  "Recruiter follow-ups",
  "Reply tracking & analytics",
  "Interview scheduling",
];

export const AtelierIceberg = () => (
  <section className="container max-w-7xl py-20">
    <div className="w-full">
      <svg
        viewBox="0 0 1200 360"
        className="w-full h-auto"
        preserveAspectRatio="none"
        role="img"
        aria-label="Iceberg metaphor: what you do vs. what Atelier handles"
      >
        {/* Background sky (cream) above waterline */}
        <rect x="0" y="0" width="1200" height="108" fill="#FAF3E0" />
        {/* Background water (dark navy) below waterline */}
        <rect x="0" y="108" width="1200" height="252" fill="#06111A" />

        {/* Above waterline: small yellow triangle (tip) */}
        <polygon points="600,18 540,108 660,108" fill="#FBC52A" />

        {/* "What you do" label above waterline */}
        <text x="600" y="55" textAnchor="middle" fill="#ED5C45" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="700" letterSpacing="2">
          WHAT YOU DO
        </text>
        <text x="600" y="78" textAnchor="middle" fill="#1C1510" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="800">
          Prepare. Show up. Sign.
        </text>

        {/* Waterline dashed */}
        <line x1="0" y1="108" x2="1200" y2="108" stroke="#FBC52A" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.6" />
        <text x="1180" y="102" textAnchor="end" fill="#9BA3AD" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1.5">
          the surface
        </text>

        {/* Below waterline: large iceberg mass (teal) */}
        <polygon points="600,108 360,360 840,360" fill="#0F4C6E" fillOpacity="0.85" />

        {/* Inside-mass labels */}
        {belowLabels.map((l, i) => (
          <text
            key={l}
            x="600"
            y={155 + i * 38}
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="Inter, sans-serif"
            fontSize="13"
            fontWeight="500"
            opacity="0.95"
          >
            {l}
          </text>
        ))}
      </svg>

      <div className="mt-8 text-center">
        <h3
          className="atelier-display font-extrabold text-[hsl(30_10%_10%)]"
          style={{ fontSize: "22px", fontWeight: 800 }}
        >
          Most of the work is invisible to you. That's the point.
        </h3>
        <p className="mt-2 text-sm text-[hsl(30_10%_40%)]">
          Atelier operates underneath. You surface for interviews.
        </p>
      </div>
    </div>
  </section>
);