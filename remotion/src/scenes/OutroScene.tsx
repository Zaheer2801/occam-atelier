import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInstrument } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadGeist } from "@remotion/google-fonts/Inter";

const { fontFamily: serifFont } = loadInstrument("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: sansFont } = loadGeist("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame: frame - 6, fps, config: { damping: 18, stiffness: 110 } });
  const titleOpacity = interpolate(titleEnter, [0, 1], [0, 1]);
  const titleY = interpolate(titleEnter, [0, 1], [50, 0]);

  const subEnter = spring({ frame: frame - 28, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subEnter, [0, 1], [0, 1]);

  const wordmarkOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, #1e1b4b 0%, #0b0b14 60%, #000 100%)",
      }}
    >
      {/* Soft moving glow */}
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 60%)",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame / 30) * 0.05})`,
          filter: "blur(40px)",
        }}
      />

      {/* Centered editorial closer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          paddingInline: 160,
        }}
      >
        <div
          style={{
            fontFamily: sansFont,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontSize: 18,
            marginBottom: 40,
            opacity: subOpacity,
          }}
        >
          The Professional's Journey
        </div>

        <div
          style={{
            fontFamily: serifFont,
            color: "#ffffff",
            fontSize: 168,
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          Build the career
          <br />
          you actually <em style={{ color: "#fcd34d" }}>want.</em>
        </div>

        <div
          style={{
            fontFamily: sansFont,
            color: "rgba(255,255,255,0.7)",
            fontSize: 28,
            marginTop: 48,
            opacity: subOpacity,
          }}
        >
          OCAS Software LLC
        </div>

        <div
          style={{
            fontFamily: sansFont,
            color: "rgba(255,255,255,0.5)",
            fontSize: 20,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginTop: 18,
            opacity: wordmarkOpacity,
          }}
        >
          ocas.software
        </div>
      </div>
    </AbsoluteFill>
  );
};
