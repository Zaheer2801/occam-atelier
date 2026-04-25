import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, Search, Sparkles, X } from "lucide-react";

type Action = {
  id: string;
  label: string;
  hint: string;
  keywords: string[];
  run: () => void;
};

/**
 * "Ask & Act" persistent command bar.
 * - Floating frosted pill at bottom (always visible)
 * - Cmd/Ctrl+K opens full console
 * - Routes to common app destinations & answers basic intents
 */
export const OcasCommandBar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo<Action[]>(
    () => [
      {
        id: "us-job",
        label: "Find me a US job",
        hint: "→ Right Job · curated US openings",
        keywords: ["us", "job", "career", "right", "placement"],
        run: () => navigate("/right-job"),
      },
      {
        id: "ai-tools",
        label: "Show me AI tools",
        hint: "→ AI Lab pillar",
        keywords: ["ai", "tools", "agent", "lab", "llm"],
        run: () => {
          const el = document.getElementById("ai-lab");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "atelier",
        label: "Open Atelier portal",
        hint: "→ Candidate workspace",
        keywords: ["atelier", "portal", "workspace"],
        run: () => navigate("/atelier"),
      },
      {
        id: "signup",
        label: "Create my account",
        hint: "→ /auth/signup",
        keywords: ["sign", "up", "register", "join"],
        run: () => navigate("/auth/signup"),
      },
      {
        id: "signin",
        label: "Sign in",
        hint: "→ /auth/signin",
        keywords: ["sign", "in", "login"],
        run: () => navigate("/auth/signin"),
      },
      {
        id: "atelier",
        label: "Open Atelier portal",
        hint: "→ /atelier",
        keywords: ["atelier", "portal", "career"],
        run: () => navigate("/atelier"),
      },
    ],
    [navigate]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    else setQ("");
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(s) ||
        a.keywords.some((k) => k.includes(s))
    );
  }, [q, actions]);

  const runFirst = () => {
    if (filtered[0]) {
      filtered[0].run();
      setOpen(false);
    }
  };

  return (
    <>
      {/* Floating pill */}
      <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto group flex items-center gap-3 ocas-glass rounded-full pl-4 pr-2 py-2 shadow-2xl hover:border-[hsl(var(--ocas-cyan))/0.5] transition-all"
        >
          <Sparkles className="h-4 w-4 text-[hsl(var(--ocas-cyan))]" />
          <span className="text-sm ocas-text-soft">
            Ask &amp; Act —{" "}
            <span className="ocas-text-muted hidden sm:inline">
              try “find me a US job”
            </span>
          </span>
          <span className="ocas-mono text-[10px] ocas-text-muted border border-white/10 rounded px-1.5 py-1 flex items-center gap-1">
            <Command className="h-3 w-3" /> K
          </span>
        </button>
      </div>

      {/* Console overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] px-4 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl ocas-glass rounded-3xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="h-4 w-4 ocas-text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runFirst();
                }}
                placeholder="Ask anything — “find me a US job”, “show AI tools”…"
                className="flex-1 bg-transparent outline-none text-white placeholder:ocas-text-dim text-sm"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ocas-text-muted hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center ocas-text-muted text-sm">
                  No matches. Try “pricing” or “Atelier”.
                </div>
              ) : (
                filtered.map((a, i) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      a.run();
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      i === 0
                        ? "bg-white/[0.06]"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-sm text-white">{a.label}</span>
                    <span className="ocas-mono text-[11px] ocas-text-muted">
                      {a.hint}
                    </span>
                  </button>
                ))
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 ocas-mono text-[10px] ocas-text-dim">
              <span>↵ run · esc close</span>
              <span>OCAS · Ask &amp; Act</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};