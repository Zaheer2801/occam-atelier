import { useEffect, useState } from "react";
import { OcasNav } from "@/components/ocas/OcasNav";
import { OcasHero } from "@/components/ocas/OcasHero";
import { OcasBento } from "@/components/ocas/OcasBento";
import { OcasMarquee } from "@/components/ocas/OcasMarquee";
import { OcasFAQ } from "@/components/ocas/OcasFAQ";
import { OcasFooter } from "@/components/ocas/OcasFooter";
import { OcasCommandBar } from "@/components/ocas/OcasCommandBar";

/**
 * OCAS Software LLC — homepage (2026 dark, bento, glassmorphism).
 * Scoped to the `.ocas` theme so the Atelier portal (/atelier) and the
 * Right Job yellow theme remain completely untouched.
 */
const Index = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("ocas");
    document.body.style.backgroundColor = "hsl(230 25% 4%)";
    return () => {
      document.documentElement.classList.remove("ocas");
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="ocas min-h-screen flex flex-col">
      <OcasNav onCommand={() => setPaletteOpen(true)} />
      <main className="flex-1">
        <OcasHero onCommand={() => setPaletteOpen(true)} />
        <OcasMarquee />
        <OcasBento />
        <OcasFAQ />
      </main>
      <OcasFooter />
      <OcasCommandBar open={paletteOpen} setOpen={setPaletteOpen} />
    </div>
  );
};

export default Index;
