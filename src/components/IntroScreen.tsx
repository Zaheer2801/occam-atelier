import { useState, useEffect } from "react";

interface Props {
  onDone: () => void;
}

const PHASES = [
  { id: 1, line1: "You apply.", line2: null,         accent: false, at: 700  },
  { id: 2, line1: "Silence.",  line2: null,          accent: false, at: 2400 },
  { id: 3, line1: "Every",     line2: "single day.", accent: false, at: 4000 },
  { id: 4, line1: "Not",       line2: "anymore.",    accent: true,  at: 5600 },
];
const LOGO_AT  = 7200;
const EXIT_AT  = 9200;

export const IntroScreen = ({ onDone }: Props) => {
  const [phase, setPhase]     = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    PHASES.forEach((p, i) => {
      timers.push(setTimeout(() => setPhase(i + 1), p.at));
    });
    timers.push(setTimeout(() => setShowLogo(true), LOGO_AT));
    timers.push(setTimeout(() => handleExit(), EXIT_AT));

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleExit = () => {
    setLeaving(true);
    setTimeout(onDone, 750);
  };

  const cur = PHASES.find((p) => p.id === phase) ?? null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "hsl(220,55%,4%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.75s ease",
      }}
    >
      <style>{`
        @keyframes orb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(160px,-120px) scale(1.2); }
          66%      { transform: translate(-80px,140px) scale(0.85); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0) scale(1.1); }
          50%     { transform: translate(-200px,80px) scale(0.8); }
        }
        @keyframes orb3 {
          0%,100% { transform: translate(0,0); }
          40%     { transform: translate(100px,-160px) scale(1.15); }
          80%     { transform: translate(-120px,60px) scale(0.9); }
        }
        @keyframes arcSpin1 {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @keyframes arcSpin2 {
          from { transform: rotate(0deg);    }
          to   { transform: rotate(-360deg); }
        }
        @keyframes orbit1 {
          from { transform: rotate(0deg)   translateX(280px) rotate(0deg);   }
          to   { transform: rotate(360deg) translateX(280px) rotate(-360deg);}
        }
        @keyframes orbit2 {
          from { transform: rotate(180deg) translateX(200px) rotate(-180deg); }
          to   { transform: rotate(540deg) translateX(200px) rotate(-540deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(90deg)  translateX(340px) rotate(-90deg);  }
          to   { transform: rotate(450deg) translateX(340px) rotate(-450deg); }
        }
        @keyframes textIn {
          from { opacity:0; transform: translateY(28px) scale(0.96); filter: blur(10px); }
          to   { opacity:1; transform: translateY(0)    scale(1);    filter: blur(0);    }
        }
        @keyframes textOut {
          from { opacity:1; transform: translateY(0)     scale(1);    filter: blur(0);    }
          to   { opacity:0; transform: translateY(-20px) scale(1.03); filter: blur(6px);  }
        }
        @keyframes logoIn {
          from { opacity:0; transform: scale(0.85) translateY(16px); filter:blur(8px); }
          to   { opacity:1; transform: scale(1)    translateY(0);    filter:blur(0);   }
        }
        @keyframes diamondSpin {
          from { transform: rotate(45deg) scale(0); opacity:0; }
          50%  { transform: rotate(45deg) scale(1.1); opacity:1; }
          to   { transform: rotate(45deg) scale(1); opacity:1; }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 40px 8px hsl(214,88%,52%,0.4); }
          50%     { box-shadow: 0 0 80px 20px hsl(214,88%,52%,0.7); }
        }
        @keyframes skipFadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
      `}</style>

      {/* ── COLOUR ORBS ───────────────────────────────────────────── */}
      <div style={{
        position:"absolute", width:700, height:700,
        borderRadius:"50%",
        background:"radial-gradient(circle, hsl(214,88%,52%,0.18) 0%, transparent 70%)",
        top:"10%", left:"5%",
        animation:"orb1 18s ease-in-out infinite",
        filter:"blur(40px)", pointerEvents:"none",
      }}/>
      <div style={{
        position:"absolute", width:500, height:500,
        borderRadius:"50%",
        background:"radial-gradient(circle, hsl(194,80%,55%,0.14) 0%, transparent 70%)",
        bottom:"5%", right:"8%",
        animation:"orb2 22s ease-in-out infinite",
        filter:"blur(50px)", pointerEvents:"none",
      }}/>
      <div style={{
        position:"absolute", width:400, height:400,
        borderRadius:"50%",
        background:"radial-gradient(circle, hsl(220,60%,65%,0.12) 0%, transparent 70%)",
        top:"40%", right:"20%",
        animation:"orb3 16s ease-in-out infinite",
        filter:"blur(35px)", pointerEvents:"none",
      }}/>

      {/* ── ROTATING ARC RINGS ────────────────────────────────────── */}
      <div style={{
        position:"absolute", inset:0, display:"flex",
        alignItems:"center", justifyContent:"center", pointerEvents:"none",
      }}>
        <svg width="900" height="900" viewBox="0 0 900 900" style={{
          position:"absolute",
          animation:"arcSpin1 40s linear infinite",
          opacity:0.12,
        }}>
          <circle cx="450" cy="450" r="380" fill="none"
            stroke="hsl(214,88%,70%)" strokeWidth="1"
            strokeDasharray="60 30" />
          <circle cx="450" cy="450" r="300" fill="none"
            stroke="hsl(194,80%,65%)" strokeWidth="0.8"
            strokeDasharray="40 60" />
        </svg>
        <svg width="700" height="700" viewBox="0 0 700 700" style={{
          position:"absolute",
          animation:"arcSpin2 28s linear infinite",
          opacity:0.1,
        }}>
          <circle cx="350" cy="350" r="320" fill="none"
            stroke="hsl(214,88%,60%)" strokeWidth="1.2"
            strokeDasharray="80 20" />
        </svg>
        {/* Large faint outer ring */}
        <svg width="1200" height="1200" viewBox="0 0 1200 1200" style={{
          position:"absolute",
          animation:"arcSpin1 70s linear infinite",
          opacity:0.06,
        }}>
          <circle cx="600" cy="600" r="560" fill="none"
            stroke="hsl(214,88%,80%)" strokeWidth="1" />
        </svg>
      </div>

      {/* ── ORBITING PARTICLES ────────────────────────────────────── */}
      <div style={{
        position:"absolute", inset:0, display:"flex",
        alignItems:"center", justifyContent:"center", pointerEvents:"none",
      }}>
        {/* Particle 1 — bright, larger */}
        <div style={{ animation:"orbit1 14s linear infinite" }}>
          <div style={{
            width:10, height:10, borderRadius:"50%",
            background:"hsl(214,88%,80%)",
            boxShadow:"0 0 16px 6px hsl(214,88%,60%,0.8)",
          }}/>
        </div>
        {/* Particle 2 — small */}
        <div style={{ position:"absolute", animation:"orbit2 20s linear infinite" }}>
          <div style={{
            width:5, height:5, borderRadius:"50%",
            background:"hsl(194,80%,75%)",
            boxShadow:"0 0 10px 4px hsl(194,80%,60%,0.7)",
          }}/>
        </div>
        {/* Particle 3 — tiny */}
        <div style={{ position:"absolute", animation:"orbit3 30s linear infinite" }}>
          <div style={{
            width:4, height:4, borderRadius:"50%",
            background:"white",
            boxShadow:"0 0 8px 3px rgba(255,255,255,0.6)",
          }}/>
        </div>
      </div>

      {/* ── SKIP BUTTON ───────────────────────────────────────────── */}
      <button
        onClick={handleExit}
        style={{
          position:"absolute", top:28, right:36,
          display:"flex", alignItems:"center", gap:6,
          background:"rgba(255,255,255,0.07)",
          border:"1px solid rgba(255,255,255,0.15)",
          color:"rgba(255,255,255,0.6)",
          borderRadius:999, padding:"8px 18px",
          fontSize:13, fontFamily:"ui-monospace,monospace",
          letterSpacing:"0.08em", cursor:"pointer",
          animation:"skipFadeIn 1s ease 1.5s both",
          transition:"background 0.2s, color 0.2s, border-color 0.2s",
          zIndex:10,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
          (e.currentTarget as HTMLButtonElement).style.color = "white";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
        }}
      >
        Skip &nbsp;›
      </button>

      {/* ── PHASE TEXT ────────────────────────────────────────────── */}
      {cur && !showLogo && (
        <div key={cur.id} style={{
          textAlign:"center",
          animation:"textIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
          position:"absolute",
        }}>
          <p style={{
            fontFamily:'"Instrument Serif", Georgia, serif',
            fontSize:"clamp(42px, 7vw, 84px)",
            fontStyle: cur.id === 2 ? "italic" : "normal",
            fontWeight:400,
            lineHeight:1.1,
            color: cur.accent ? "hsl(214,88%,72%)" : "rgba(255,255,255,0.92)",
            margin:0,
            textShadow: cur.accent
              ? "0 0 60px hsl(214,88%,52%,0.5)"
              : "0 0 40px rgba(255,255,255,0.1)",
          }}>
            {cur.line1}
          </p>
          {cur.line2 && (
            <p style={{
              fontFamily:'"Instrument Serif", Georgia, serif',
              fontSize:"clamp(42px, 7vw, 84px)",
              fontStyle: cur.accent ? "italic" : "normal",
              fontWeight:400,
              lineHeight:1.1,
              color: cur.accent ? "hsl(214,88%,72%)" : "rgba(255,255,255,0.55)",
              margin:"8px 0 0",
              textShadow: cur.accent ? "0 0 60px hsl(214,88%,52%,0.5)" : "none",
            }}>
              {cur.line2}
            </p>
          )}
        </div>
      )}

      {/* ── LOGO REVEAL ───────────────────────────────────────────── */}
      {showLogo && (
        <div style={{
          textAlign:"center",
          animation:"logoIn 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
          position:"absolute",
          display:"flex", flexDirection:"column", alignItems:"center", gap:20,
        }}>
          {/* Diamond logo */}
          <div style={{
            width:52, height:52,
            background:"linear-gradient(135deg, hsl(214,88%,62%), hsl(220,55%,20%))",
            borderRadius:8,
            animation:"diamondSpin 0.9s cubic-bezier(0.22,1,0.36,1) forwards, glowPulse 2.5s ease-in-out 0.9s infinite",
          }}/>
          <div>
            <p style={{
              fontFamily:'"Instrument Serif", Georgia, serif',
              fontSize:"clamp(32px,5vw,60px)",
              fontWeight:400,
              color:"white",
              margin:0,
              letterSpacing:"-0.02em",
            }}>
              OCAS<span style={{ color:"hsl(214,88%,62%)" }}>.</span>
            </p>
            <p style={{
              fontFamily:"Geist, Inter, system-ui, sans-serif",
              fontSize:"clamp(13px,1.6vw,18px)",
              color:"rgba(255,255,255,0.45)",
              margin:"10px 0 0",
              letterSpacing:"0.18em",
              textTransform:"uppercase",
              fontWeight:500,
            }}>
              Stop applying. Start landing.
            </p>
          </div>
        </div>
      )}

      {/* Bottom vignette */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:160,
        background:"linear-gradient(to top, hsl(220,55%,3%), transparent)",
        pointerEvents:"none",
      }}/>
    </div>
  );
};
