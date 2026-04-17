import { useEffect, useRef } from "react";

/** Reveal-on-scroll: add `corp-reveal` to elements; this hook flips them to `is-in`. */
export const useCorpReveal = () => {
  const root = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const scope = root.current ?? document;
    const els = scope.querySelectorAll<HTMLElement>(".corp-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return root;
};
