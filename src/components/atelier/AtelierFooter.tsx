export const AtelierFooter = () => (
  <footer className="border-t border-[hsl(36_24%_86%)] bg-[hsl(44_56%_96%)]">
    <div className="container max-w-7xl py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-[hsl(30_10%_35%)]">
      <div>
        <p>
          <span className="font-semibold text-[hsl(30_10%_10%)]">Atelier</span> — a product of OCAS Software LLC
        </p>
        <p className="mt-1 text-xs font-mono uppercase tracking-widest text-[hsl(30_10%_45%)]">
          Outsource · Connect · Apply · Succeed
        </p>
        <p className="mt-1 text-xs text-[hsl(30_10%_45%)]">India · USA · Canada</p>
        <p className="mt-2 text-xs text-[hsl(30_10%_45%)]">© 2022–2025 OCAS Software LLC · All rights reserved.</p>
      </div>
      <div className="flex items-center gap-6">
        <a href="#features" className="hover:text-[hsl(8_84%_55%)]">Product</a>
        <a href="#how" className="hover:text-[hsl(8_84%_55%)]">How it works</a>
        <a href="#contact" className="hover:text-[hsl(8_84%_55%)]">Contact us</a>
      </div>
    </div>
  </footer>
);
