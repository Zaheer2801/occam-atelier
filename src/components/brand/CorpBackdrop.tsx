/** Decorative animated background: gradient mesh + drifting orbs + grid + noise. */
export const CorpBackdrop = ({ variant = "hero" }: { variant?: "hero" | "section" }) => {
  if (variant === "section") {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 corp-grid-bg opacity-40" />
        <div className="corp-orb corp-orb-purple corp-drift-2 w-[420px] h-[420px] -left-32 top-1/3" />
        <div className="corp-orb corp-orb-blue corp-drift-3 w-[360px] h-[360px] -right-24 bottom-0" />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 corp-mesh" />
      <div className="absolute inset-0 corp-grid-bg opacity-50" />
      <div className="corp-orb corp-orb-blue corp-drift-1 w-[520px] h-[520px] -left-24 -top-24" />
      <div className="corp-orb corp-orb-purple corp-drift-2 w-[480px] h-[480px] -right-32 top-10" />
      <div className="corp-orb corp-orb-cyan corp-drift-3 w-[360px] h-[360px] left-1/3 bottom-[-120px]" />
      <div className="absolute inset-0 corp-noise opacity-[0.4] mix-blend-overlay" />
      {/* fade to bg at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-corp-bg" />
    </div>
  );
};
