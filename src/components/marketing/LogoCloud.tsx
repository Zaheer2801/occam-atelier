export const LogoCloud = () => (
  <section className="container py-12 border-y border-border/40">
    <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
      Our members landed roles at
    </p>
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
      {["LINEAR", "STRIPE", "VERCEL", "FIGMA", "NOTION", "AIRBNB", "SHOPIFY"].map((n) => (
        <span key={n} className="font-display font-bold text-xl text-muted-foreground tracking-tight">
          {n}
        </span>
      ))}
    </div>
  </section>
);
