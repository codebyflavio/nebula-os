"use client";
import { useWallpaperStore } from "@/stores/wallpaperStore";

// CSS patterns keyed by patternId
function PatternLayer({ patternId, bg }: { patternId: string; bg: string }) {
  const patterns: Record<string, React.CSSProperties> = {
    grid: {
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(99,102,241,0.12) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(99,102,241,0.12) 0px, transparent 1px, transparent 40px)",
      backgroundSize: "40px 40px",
    },
    dots: {
      backgroundImage:
        "radial-gradient(circle, rgba(99,102,241,0.3) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    },
    lines: {
      backgroundImage:
        "repeating-linear-gradient(45deg, rgba(99,102,241,0.10) 0px, rgba(99,102,241,0.10) 1px, transparent 0px, transparent 28px)",
      backgroundSize: "28px 28px",
    },
    circuit: {
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(6,182,212,0.09) 0px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, rgba(6,182,212,0.09) 0px, transparent 1px, transparent 24px)",
      backgroundSize: "24px 24px",
    },
  };

  return (
    <div className="absolute inset-0" style={{ background: bg }}>
      <div className="absolute inset-0" style={patterns[patternId] ?? {}} />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
}

const STARS = [
  { x: 5.2,  y: 12.4, r: 0.8,  o: 0.6 }, { x: 14.7, y: 3.1,  r: 1.2,  o: 0.8 },
  { x: 23.5, y: 28.9, r: 0.6,  o: 0.5 }, { x: 31.8, y: 7.6,  r: 1.0,  o: 0.7 },
  { x: 42.1, y: 19.3, r: 0.7,  o: 0.6 }, { x: 51.4, y: 35.7, r: 1.4,  o: 0.9 },
  { x: 63.2, y: 8.2,  r: 0.9,  o: 0.7 }, { x: 72.6, y: 22.4, r: 0.6,  o: 0.5 },
  { x: 81.9, y: 41.8, r: 1.1,  o: 0.8 }, { x: 91.3, y: 15.6, r: 0.8,  o: 0.6 },
  { x: 8.4,  y: 55.3, r: 1.3,  o: 0.8 }, { x: 18.7, y: 68.9, r: 0.7,  o: 0.5 },
  { x: 29.1, y: 48.2, r: 1.0,  o: 0.7 }, { x: 37.5, y: 72.6, r: 0.8,  o: 0.6 },
  { x: 48.3, y: 59.1, r: 1.2,  o: 0.8 }, { x: 57.6, y: 81.4, r: 0.6,  o: 0.5 },
  { x: 68.2, y: 63.8, r: 1.4,  o: 0.9 }, { x: 77.4, y: 76.2, r: 0.9,  o: 0.7 },
  { x: 86.8, y: 54.7, r: 0.7,  o: 0.6 }, { x: 95.1, y: 87.3, r: 1.1,  o: 0.8 },
  { x: 3.7,  y: 82.1, r: 0.8,  o: 0.6 }, { x: 11.2, y: 91.5, r: 1.0,  o: 0.7 },
  { x: 22.8, y: 78.3, r: 1.3,  o: 0.9 }, { x: 44.6, y: 93.7, r: 0.7,  o: 0.5 },
  { x: 55.9, y: 86.4, r: 0.9,  o: 0.7 }, { x: 65.3, y: 96.8, r: 1.2,  o: 0.8 },
  { x: 74.7, y: 89.1, r: 0.6,  o: 0.5 }, { x: 83.4, y: 97.2, r: 1.0,  o: 0.7 },
  { x: 93.8, y: 74.5, r: 0.8,  o: 0.6 }, { x: 16.3, y: 44.8, r: 1.5,  o: 0.9 },
  { x: 33.9, y: 61.2, r: 0.7,  o: 0.5 }, { x: 46.2, y: 45.3, r: 1.1,  o: 0.8 },
  { x: 59.4, y: 52.7, r: 0.8,  o: 0.6 }, { x: 70.8, y: 36.4, r: 1.3,  o: 0.9 },
  { x: 88.1, y: 67.9, r: 0.6,  o: 0.5 },
];

export default function Wallpaper() {
  const { activePreset } = useWallpaperStore();

  // ── Image ──────────────────────────────────────────────────
  if (activePreset.type === "image" && activePreset.imageUrl) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${activePreset.imageUrl})`,
            backgroundSize: activePreset.imageFit === "contain" ? "contain" : "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Darkening overlay so UI stays readable */}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN_SVG, opacity: 0.03, mixBlendMode: "overlay" }}
        />
      </div>
    );
  }

  // ── Solid ──────────────────────────────────────────────────
  if (activePreset.type === "solid") {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ background: activePreset.color }}>
        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN_SVG, opacity: 0.03, mixBlendMode: "overlay" }}
        />
      </div>
    );
  }

  // ── Pattern ────────────────────────────────────────────────
  if (activePreset.type === "pattern") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <PatternLayer patternId={activePreset.patternId!} bg={activePreset.bg ?? "#020617"} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN_SVG, opacity: 0.025, mixBlendMode: "overlay" }}
        />
      </div>
    );
  }

  // ── Gradient (default) ─────────────────────────────────────
  const gradient = (activePreset.layers ?? []).join(", ");

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: activePreset.bg ?? "#020617" }}
    >
      {/* Animated orb layers */}
      {activePreset.animate ? (
        <>
          <div className="absolute inset-0 animate-nebula-drift-1" style={{ background: gradient, opacity: 0.9 }} />
          <div className="absolute inset-0 animate-nebula-drift-2" style={{ background: gradient, opacity: 0.5 }} />
          <div className="absolute inset-0 animate-nebula-drift-3" style={{ background: gradient, opacity: 0.3 }} />
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: gradient }} />
      )}

      {/* Star field */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.o} />
        ))}
      </svg>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG, opacity: 0.025, mixBlendMode: "overlay" }}
      />
    </div>
  );
}

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;
