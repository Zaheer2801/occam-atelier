import { ReactNode, useEffect } from "react";
import { CorpHeader } from "@/components/brand/CorpHeader";
import { CorpFooter } from "@/components/brand/CorpFooter";
import { CorpBackdrop } from "@/components/brand/CorpBackdrop";

interface Props {
  children: ReactNode;
  variant?: "hero" | "section";
}

/**
 * Wraps a route in the corporate (.corporate scope) dark theme so the brand
 * tokens defined in index.css apply, and ensures the page background is dark.
 */
export const CorpShell = ({ children, variant = "section" }: Props) => {
  useEffect(() => {
    document.documentElement.classList.add("corporate");
    return () => document.documentElement.classList.remove("corporate");
  }, []);

  return (
    <div className="corporate min-h-screen bg-corp-bg text-corp-text font-sans antialiased relative">
      <CorpBackdrop variant={variant} />
      <CorpHeader />
      <main className="relative">{children}</main>
      <CorpFooter />
    </div>
  );
};

export default CorpShell;
