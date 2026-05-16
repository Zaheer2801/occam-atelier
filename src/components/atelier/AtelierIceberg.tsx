export const AtelierIceberg = () => (
  <section className="container max-w-7xl py-20">
    <div className="rounded-3xl overflow-hidden bg-[#06111A]">
      <svg viewBox="0 0 800 360" className="w-full h-auto block" preserveAspectRatio="xMidYMid meet">
        {/* Above water - yellow tip */}
        <polygon points="400,30 340,120 460,120" fill="#FBC52A" />
        <text x="400" y="62" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontSize="10" fill="#E85D3A" letterSpacing="2">
          WHAT YOU DO
        </text>
        <text x="400" y="92" textAnchor="middle" fontFamily="Geist, system-ui" fontWeight="800" fontSize="14" fill="#1C1510">
          Prepare. Show up. Sign.
        </text>

        {/* Waterline */}
        <line x1="0" y1="125" x2="800" y2="125" stroke="#FAF0D7" strokeOpacity="0.4" strokeDasharray="6 6" />
        <text x="790" y="120" textAnchor="end" fontFamily="ui-monospace, Menlo, monospace" fontSize="9" fill="#FAF0D7" fillOpacity="0.5" letterSpacing="1">
          the surface
        </text>

        {/* Iceberg base */}
        <polygon points="340,125 460,125 540,330 260,330" fill="#0F4C6E" fillOpacity="0.85" />

        {/* Labels inside */}
        {[
          "AI resume tailoring",
          "Mass applications",
          "Recruiter follow-ups",
          "Reply tracking & analytics",
          "Interview scheduling",
        ].map((t, i) => (
          <text
            key={t}
            x="400"
            y={165 + i * 32}
            textAnchor="middle"
            fontFamily="Geist, system-ui"
            fontSize="13"
            fontWeight="500"
            fill="#FFFFFF"
          >
            {t}
          </text>
        ))}
      </svg>
    </div>
    <div className="text-center mt-10 max-w-2xl mx-auto">
      <h3 className="atelier-display text-[22px] font-extrabold text-[hsl(30_10%_10%)]">
        Most of the work is invisible to you. That's the point.
      </h3>
      <p className="mt-2 text-sm text-[hsl(30_10%_45%)]">
        Atelier operates underneath. You surface for interviews.
      </p>
    </div>
  </section>
);