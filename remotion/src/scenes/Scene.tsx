import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInstrument } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadGeist } from "@remotion/google-fonts/Inter";

const { fontFamily: serifFont } = loadInstrument("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: sansFont } = loadGeist("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

export type Act = {
  id: number;
  chapter: string;
  eyebrow: string;
  title: string;
  body: string;
  char: string;
  palette: { bg1: string; bg2: string; accent: string; glow: string };
};

export const Scene: React.FC<{ act: Act; index: number; total: number }> = ({ act, index, total }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Character walks from -10% to 35% of screen width
  const charX = interpolate(p, [0, 1], [-10, 35]);
  // Subtle bob driven by frame
  const bob = Math.sin(frame / 3) * 8;

  // Title staggered reveal
  const titleEnter = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 110 } });
  const titleY = interpolate(titleEnter, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleEnter, [0, 1], [0, 1]);

  const eyebrowEnter = spring({ frame: frame - 0, fps, config: { damping: 200 } });
  const eyebrowOpacity = interpolate(eyebrowEnter, [0, 1], [0, 1]);

  const bodyEnter = spring({ frame: frame - 26, fps, config: { damping: 200 } });
  const bodyOpacity = interpolate(bodyEnter, [0, 1], [0, 1]);
  const bodyY = interpolate(bodyEnter, [0, 1], [16, 0]);

  // Camera-like pan: very slow horizontal drift on the background
  const panX = interpolate(p, [0, 1], [0, -40]);

  // Cinematic light beam from upper-right
  const beamOpacity = interpolate(frame, [0, 30, durationInFrames - 20, durationInFrames], [0, 0.7, 0.7, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(115deg, ${act.palette.bg1} 0%, ${act.palette.bg2} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Distant cityscape silhouette / horizon */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(ellipse at 70% 60%, ${act.palette.glow}55 0%, transparent 55%)`,
          transform: `translateX(${panX}px)`,
        }}
      />

      {/* Ambient orbs */}
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          background: `${act.palette.glow}55`,
          filter: "blur(120px)",
          left: "55%",
          top: "10%",
          transform: `translate(${Math.sin(frame / 40) * 30}px, ${Math.cos(frame / 50) * 24}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 540,
          height: 540,
          borderRadius: "50%",
          background: `${act.palette.accent}33`,
          filter: "blur(100px)",
          left: "10%",
          bottom: "5%",
          transform: `translate(${Math.cos(frame / 45) * 26}px, ${Math.sin(frame / 55) * 20}px)`,
        }}
      />

      {/* Floor / horizon line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "16%",
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${act.palette.accent}aa 50%, transparent 100%)`,
        }}
      />

      {/* Cinematic light beam */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(120deg, transparent 55%, ${act.palette.glow}33 65%, transparent 80%)`,
          opacity: beamOpacity,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* Character */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: `${charX}%`,
          height: "70%",
          transform: `translateY(${bob}px)`,
          filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))",
        }}
      >
        <Img
          src={staticFile(act.char)}
          style={{ height: "100%", width: "auto", objectFit: "contain" }}
        />
        {/* Soft ground shadow */}
        <div
          style={{
            position: "absolute",
            bottom: -12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 220,
            height: 16,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            filter: "blur(12px)",
          }}
        />
      </div>

      {/* Chapter / Eyebrow (top-right of typography area) */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: "26%",
          width: "44%",
          color: act.palette.accent,
          fontFamily: sansFont,
          fontSize: 18,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          opacity: eyebrowOpacity,
          display: "flex",
          gap: 24,
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.55)" }}>{act.chapter}</span>
        <span>· {act.eyebrow}</span>
      </div>

      {/* Big editorial title */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: "32%",
          width: "44%",
          fontFamily: serifFont,
          fontWeight: 400,
          fontSize: 132,
          lineHeight: 0.98,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          whiteSpace: "pre-line",
        }}
      >
        {act.title}
      </div>

      {/* Body line */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: "67%",
          width: "44%",
          fontFamily: sansFont,
          fontWeight: 400,
          fontSize: 28,
          lineHeight: 1.4,
          color: "rgba(255,255,255,0.78)",
          opacity: bodyOpacity,
          transform: `translateY(${bodyY}px)`,
        }}
      >
        {act.body}
      </div>

      {/* Step indicator (bottom-right) */}
      <div
        style={{
          position: "absolute",
          right: 110,
          bottom: 110,
          fontFamily: sansFont,
          fontWeight: 500,
          fontSize: 16,
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};
