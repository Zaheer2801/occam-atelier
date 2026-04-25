import { useEffect, useRef, useState } from "react";

type Line =
  | { kind: "prompt"; text: string }
  | { kind: "log"; text: string }
  | { kind: "ok"; text: string }
  | { kind: "warn"; text: string };

const SCRIPT: Line[] = [
  { kind: "prompt", text: "ocas agent run --task 'find ML roles · sf'" },
  { kind: "log", text: "[plan] decompose → search → score → outreach" },
  { kind: "log", text: "[search] scanned 14,209 listings · 0.42s" },
  { kind: "ok", text: "[match] 28 roles ≥ 0.86 fit" },
  { kind: "log", text: "[draft] tailoring 12 outreach messages…" },
  { kind: "ok", text: "[sent] 12/12 · reply rate p50 ↑ 38%" },
  { kind: "warn", text: "[guard] PII redaction · OK" },
  { kind: "ok", text: "▲ run complete · 3 interviews booked" },
];

const TYPE_DELAY = 18;
const LINE_PAUSE = 320;

export const OcasTerminal = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const i = idxRef.current;
      if (i >= SCRIPT.length) {
        // restart for an "always live" feel
        t = setTimeout(() => {
          idxRef.current = 0;
          charRef.current = 0;
          setLines([]);
          setTyping("");
          tick();
        }, 2200);
        return;
      }
      const current = SCRIPT[i];
      const c = charRef.current;
      if (c < current.text.length) {
        charRef.current = c + 1;
        setTyping(current.text.slice(0, c + 1));
        t = setTimeout(tick, TYPE_DELAY);
      } else {
        setLines((ls) => [...ls, current]);
        setTyping("");
        idxRef.current = i + 1;
        charRef.current = 0;
        t = setTimeout(tick, LINE_PAUSE);
      }
    };
    tick();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, typing]);

  const colorFor = (k: Line["kind"]) =>
    k === "ok"
      ? "text-[hsl(var(--ocas-emerald))]"
      : k === "warn"
      ? "text-[hsl(var(--ocas-amber))]"
      : k === "prompt"
      ? "text-[hsl(var(--ocas-cyan))]"
      : "ocas-text-soft";

  const prefixFor = (k: Line["kind"]) =>
    k === "prompt" ? "$ " : k === "ok" ? "✔ " : k === "warn" ? "! " : "· ";

  const currentKind: Line["kind"] =
    SCRIPT[idxRef.current]?.kind ?? "log";

  return (
    <div className="relative h-full min-h-[260px] rounded-2xl overflow-hidden border border-white/10 bg-[hsl(230_30%_3%)]">
      {/* window chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--ocas-pink))/0.7]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--ocas-amber))/0.7]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--ocas-emerald))/0.7]" />
        <span className="ml-2 ocas-mono text-[10px] ocas-text-dim">
          ocas://agent · live
        </span>
      </div>
      <div
        ref={containerRef}
        className="relative ocas-mono text-[12px] leading-[1.55] p-4 h-[230px] overflow-hidden"
      >
        <div className="absolute inset-0 ocas-scanlines" />
        {lines.map((l, i) => (
          <div key={i} className={colorFor(l.kind)}>
            {prefixFor(l.kind)}
            {l.text}
          </div>
        ))}
        {typing && (
          <div className={colorFor(currentKind)}>
            {prefixFor(currentKind)}
            {typing}
            <span className="ocas-caret inline-block w-[7px] h-[12px] -mb-0.5 ml-0.5 bg-[hsl(var(--ocas-cyan))]" />
          </div>
        )}
      </div>
    </div>
  );
};