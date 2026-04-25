import { ReactNode } from "react";
import { Logo } from "@/components/marketing/Logo";
import { useForceLightTheme } from "@/hooks/useTheme";
import character from "@/assets/atelier-character.png";
import spiral from "@/assets/atelier-deco-spiral.png";

export const AuthLayout = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => {
  useForceLightTheme();
  return (
    <div className="atelier min-h-screen relative overflow-hidden bg-background">
      {/* Ambient gradient */}
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      {/* Floating decorative spirals */}
      <img
        src={spiral}
        alt=""
        aria-hidden="true"
        width={220}
        height={220}
        className="hidden md:block absolute -top-8 -left-8 w-44 atelier-float-slow opacity-80 pointer-events-none select-none"
      />
      <img
        src={spiral}
        alt=""
        aria-hidden="true"
        width={160}
        height={160}
        className="hidden md:block absolute bottom-10 right-10 w-28 atelier-float opacity-80 pointer-events-none select-none"
        style={{ filter: "hue-rotate(60deg)" }}
      />

      <div className="relative min-h-screen grid lg:grid-cols-[1.05fr_1fr]">
        {/* Left brand panel — visible on lg+ */}
        <aside className="hidden lg:flex relative items-center justify-center p-12 overflow-hidden">
          <div className="atelier-card-yellow relative w-full max-w-xl p-10 overflow-hidden">
            <div className="absolute top-5 right-5 grid grid-cols-2 gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="h-2.5 w-2.5 rounded-sm bg-[hsl(8_84%_60%)]" />
              ))}
            </div>
            <p className="atelier-display text-xl font-extrabold mb-8">Atelier</p>
            <h2 className="atelier-display atelier-display-lg leading-[0.95]">
              Your career<br/>partner.
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[hsl(30_10%_20%)]">
              A pod of recruiters, marketers, and coaches — backed by smart automation,
              applying and following up on your behalf.
            </p>
            <img
              src={character}
              alt=""
              aria-hidden
              width={1024}
              height={1024}
              className="mt-6 w-72 mx-auto atelier-bob drop-shadow-[0_24px_30px_rgba(0,0,0,0.18)]"
            />
          </div>
        </aside>

        {/* Right form panel */}
        <main className="flex items-center justify-center px-4 sm:px-8 py-10 sm:py-14">
          <div className="relative w-full max-w-md">
            <div className="flex justify-center mb-6"><Logo /></div>
            <div className="bg-card/80 backdrop-blur-xl border border-white/40 rounded-3xl p-7 sm:p-9 shadow-elevated">
              <h1 className="font-display text-[28px] leading-tight text-center text-foreground">{title}</h1>
              {subtitle && <p className="text-center text-sm text-muted-foreground mt-2">{subtitle}</p>}
              <div className="mt-7">{children}</div>
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Protected by industry-standard encryption.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
