import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene } from "./scenes/Scene";
import { OutroScene } from "./scenes/OutroScene";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

const SCENE_FRAMES = 130; // ~4.3s per act
const TRANSITION_FRAMES = 18;
const OUTRO_FRAMES = 110;

// 5 scenes + outro, with 5 transitions (4 between scenes + 1 into outro)
// Each transition shortens total by TRANSITION_FRAMES
export const TOTAL_FRAMES =
  SCENE_FRAMES * 5 + OUTRO_FRAMES - TRANSITION_FRAMES * 5;

const ACTS = [
  {
    id: 1,
    chapter: "Chapter 01",
    eyebrow: "Who we are",
    title: "Reaching the\nright platform",
    body: "Career chaos becomes a clear, accountable system.",
    char: "characters/act-1.png",
    palette: { bg1: "#0b1220", bg2: "#1f2937", accent: "#94a3b8", glow: "#475569" },
  },
  {
    id: 2,
    chapter: "Chapter 02",
    eyebrow: "What we do",
    title: "Connecting to\nthe right team",
    body: "A dedicated marketing pod becomes your career department.",
    char: "characters/act-2.png",
    palette: { bg1: "#0b1a2a", bg2: "#1e3a5f", accent: "#7dd3fc", glow: "#0ea5e9" },
  },
  {
    id: 3,
    chapter: "Chapter 03",
    eyebrow: "How we do it",
    title: "Doing the\nright market work",
    body: "Tailored applications, ATS-tuned resumes, daily outreach.",
    char: "characters/act-3.png",
    palette: { bg1: "#0e1d3a", bg2: "#1e40af", accent: "#a5b4fc", glow: "#3b82f6" },
  },
  {
    id: 4,
    chapter: "Chapter 04",
    eyebrow: "Live dashboard",
    title: "Getting the\ninterview calls",
    body: "Every reply and interview lands in real time.",
    char: "characters/act-4.png",
    palette: { bg1: "#0b2d2a", bg2: "#0e7490", accent: "#67e8f9", glow: "#22d3ee" },
  },
  {
    id: 5,
    chapter: "Chapter 05",
    eyebrow: "Success",
    title: "Getting\nthe job",
    body: "From overwhelmed to overjoyed. Story rewritten.",
    char: "characters/act-5.png",
    palette: { bg1: "#3b1d1a", bg2: "#a16207", accent: "#fcd34d", glow: "#f59e0b" },
  },
];

/** Persistent vignette + film grain over the whole video */
const FilmOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const grainOffset = (frame * 13) % 100;
  return (
    <>
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Subtle drifting noise */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.10 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
          backgroundPosition: `${grainOffset}px ${grainOffset}px`,
          mixBlendMode: "overlay",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      {/* Letterbox bars */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 70, background: "#000" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 70, background: "#000" }} />
      </AbsoluteFill>
    </>
  );
};

const ProgressRail: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 78,
        left: 80,
        right: 80,
        height: 2,
        background: "rgba(255,255,255,0.12)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: `${p * 100}%`,
          height: "100%",
          background: "linear-gradient(90deg, #94a3b8, #7dd3fc, #a5b4fc, #67e8f9, #fcd34d)",
        }}
      />
    </div>
  );
};

const TopBar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 92,
      left: 80,
      right: 80,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 50,
      color: "rgba(255,255,255,0.7)",
      fontFamily: "Geist, Inter, sans-serif",
      fontSize: 14,
      letterSpacing: "0.25em",
      textTransform: "uppercase",
    }}
  >
    <div>OCAS Software · The Professional's Journey</div>
    <div>1080 · 30fps</div>
  </div>
);

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {ACTS.map((act, i) => (
          <>
            <TransitionSeries.Sequence key={`s-${act.id}`} durationInFrames={SCENE_FRAMES}>
              <Scene act={act} index={i} total={ACTS.length} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              key={`t-${act.id}`}
              presentation={fade()}
              timing={springTiming({
                config: { damping: 200 },
                durationInFrames: TRANSITION_FRAMES,
              })}
            />
          </>
        ))}
        <TransitionSeries.Sequence key="outro" durationInFrames={OUTRO_FRAMES}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Persistent overlays */}
      <Sequence from={0}>
        <ProgressRail />
        <TopBar />
        <FilmOverlay />
      </Sequence>
    </AbsoluteFill>
  );
};
