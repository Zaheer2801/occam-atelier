import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroCharacter from "@/assets/hero-character.png";
import decorSpiral from "@/assets/decor-spiral.png";
import decorStack from "@/assets/decor-stack.png";

export const Hero = () => (
  <section className="relative pt-28 pb-20 overflow-hidden">
    <div className="container relative z-10">
      {/* Outline frame around the yellow card */}
      <div className="relative yellow-card-outline">
        <div className="yellow-card relative overflow-hidden px-8 sm:px-14 md:px-20 py-16 md:py-24 min-h-[560px]">
          {/* Floating decorative spiral, top-left of card */}
          <img
            src={decorSpiral}
            alt=""
            aria-hidden="true"
            width={180}
            height={180}
            className="absolute -top-14 left-24 md:left-40 w-32 md:w-44 float-slow drop-shadow-xl pointer-events-none select-none"
          />

          {/* Tiny grid icon top-right */}
          <div className="absolute top-8 right-10 grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="block h-2 w-2 rounded-[2px] bg-primary" />
            ))}
          </div>

          {/* Mint stack, bottom-left */}
          <img
            src={decorStack}
            alt=""
            aria-hidden="true"
            width={120}
            height={120}
            className="absolute -bottom-8 left-10 w-20 md:w-28 float-fast drop-shadow-xl pointer-events-none select-none"
          />

          <div className="grid md:grid-cols-2 gap-8 items-center relative">
            {/* Left: copy */}
            <div className="animate-fade-up">
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-foreground">
                The Right People
              </h1>
              <p className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl text-foreground/85 font-semibold tracking-tight">
                For your right team
              </p>
              <p className="mt-6 max-w-md text-foreground/70 leading-relaxed">
                Right Job is the best platform for you to find top talent and great
                people for your company.
              </p>
              <div className="mt-9">
                <Button
                  asChild
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-9 text-base shadow-glow"
                >
                  <Link to="/auth/signup">Apply Now</Link>
                </Button>
              </div>
            </div>

            {/* Right: 3D character */}
            <div className="relative h-[420px] md:h-[520px] flex items-end justify-center md:justify-end">
              <img
                src={heroCharacter}
                alt="Friendly person sitting in a yellow chair"
                width={1024}
                height={1024}
                className="relative z-10 w-[340px] md:w-[460px] drop-shadow-2xl wobble"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
