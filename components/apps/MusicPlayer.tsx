"use client";
import { useState, useRef, useEffect } from "react";
import { AppProps } from "@/types";
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Shuffle, Repeat,
  Music,
} from "lucide-react";

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number; // seconds
  color: string;
}

const TRACKS: Track[] = [
  { id: 1, title: "Stellar Drift",   artist: "Nebula Audio",  duration: 214, color: "#6366F1" },
  { id: 2, title: "Void Walker",     artist: "Cosmic Beats",  duration: 187, color: "#06B6D4" },
  { id: 3, title: "Event Horizon",   artist: "Deep Space Mix", duration: 253, color: "#A855F7" },
  { id: 4, title: "Pulsar",          artist: "Binary Stars",  duration: 198, color: "#10B981" },
  { id: 5, title: "Dark Matter",     artist: "Nebula Audio",  duration: 231, color: "#F59E0B" },
  { id: 6, title: "Quasar Signal",   artist: "Orbital Sound", duration: 176, color: "#EF4444" },
];

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function MusicPlayer({ windowId }: AppProps) {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);       // 0-1
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = TRACKS[trackIdx];
  const elapsed = Math.floor(progress * track.duration);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) {
            if (repeat) return 0;
            next();
            return 0;
          }
          return p + 1 / track.duration;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, track.duration, repeat]); // eslint-disable-line react-hooks/exhaustive-deps

  function next() {
    if (shuffle) {
      setTrackIdx(Math.floor(Math.random() * TRACKS.length));
    } else {
      setTrackIdx((i) => (i + 1) % TRACKS.length);
    }
    setProgress(0);
  }

  function prev() {
    if (progress > 0.05) { setProgress(0); return; }
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(4,6,20,0.97)", userSelect: "none" }}
    >
      {/* Album art area */}
      <div
        className="flex flex-col items-center justify-center py-8 px-6 gap-4"
        style={{ flexShrink: 0 }}
      >
        <div
          className="relative flex items-center justify-center rounded-3xl"
          style={{
            width: 140,
            height: 140,
            background: `radial-gradient(circle at 35% 35%, ${track.color}55, ${track.color}22)`,
            border: `1px solid ${track.color}40`,
            boxShadow: `0 0 48px ${track.color}30`,
            animation: playing ? "spin-slow 8s linear infinite" : "none",
          }}
        >
          <Music size={48} strokeWidth={1.2} style={{ color: track.color, opacity: 0.8 }} />
          <div
            className="absolute inset-0 rounded-3xl"
            style={{ background: "rgba(0,0,0,0.2)" }}
          />
          {/* Center dot (vinyl) */}
          <div
            className="absolute w-3 h-3 rounded-full"
            style={{ background: "rgba(0,0,0,0.6)", border: "2px solid rgba(255,255,255,0.1)" }}
          />
        </div>

        <div className="text-center">
          <p
            className="text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {track.title}
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {track.artist}
          </p>
        </div>
      </div>

      {/* EQ bars when playing */}
      {playing && (
        <div className="flex justify-center gap-1 mb-2" style={{ height: 24 }}>
          {[1,2,3,4].map((i) => (
            <div
              key={i}
              className={`eq-bar animate-eq-bar-${i}`}
              style={{ background: track.color }}
            />
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="px-6 mb-4">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          <span>{fmt(elapsed)}</span>
          <span>{fmt(track.duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${track.color} ${progress * 100}%, rgba(255,255,255,0.1) ${progress * 100}%)`,
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-6 mb-4">
        <button
          onClick={() => setShuffle(!shuffle)}
          className="p-2 rounded-xl transition-colors"
          style={{ color: shuffle ? track.color : "var(--text-muted)" }}
        >
          <Shuffle size={16} />
        </button>
        <button
          onClick={prev}
          className="p-2 rounded-xl transition-colors hover:bg-white/10"
          style={{ color: "var(--text-secondary)" }}
        >
          <SkipBack size={22} />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className="flex items-center justify-center rounded-full transition-all hover:scale-105"
          style={{
            width: 52,
            height: 52,
            background: track.color,
            boxShadow: `0 0 24px ${track.color}60`,
          }}
        >
          {playing
            ? <Pause size={22} style={{ color: "#fff" }} />
            : <Play size={22} style={{ color: "#fff", marginLeft: 2 }} />
          }
        </button>
        <button
          onClick={next}
          className="p-2 rounded-xl transition-colors hover:bg-white/10"
          style={{ color: "var(--text-secondary)" }}
        >
          <SkipForward size={22} />
        </button>
        <button
          onClick={() => setRepeat(!repeat)}
          className="p-2 rounded-xl transition-colors"
          style={{ color: repeat ? track.color : "var(--text-muted)" }}
        >
          <Repeat size={16} />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-6 mb-4">
        <button onClick={() => setMuted(!muted)} style={{ color: "var(--text-muted)" }}>
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
          className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.4) ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(muted ? 0 : volume) * 100}%)`,
          }}
        />
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto border-t" style={{ borderColor: "var(--glass-border)" }}>
        {TRACKS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => { setTrackIdx(i); setProgress(0); setPlaying(true); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/5 text-left"
            style={{
              background: trackIdx === i ? "rgba(255,255,255,0.05)" : "transparent",
              borderLeft: trackIdx === i ? `2px solid ${t.color}` : "2px solid transparent",
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${t.color}22`, border: `1px solid ${t.color}40` }}
            >
              {trackIdx === i && playing
                ? <div className="flex gap-0.5 items-end h-3">
                    {[1,2,3].map((b) => (
                      <div key={b} className="w-0.5 rounded-full animate-pulse" style={{ height: 6 + b * 2, background: t.color }} />
                    ))}
                  </div>
                : <Music size={12} style={{ color: t.color }} />
              }
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span
                className="text-xs font-medium truncate"
                style={{ color: trackIdx === i ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                {t.title}
              </span>
              <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {t.artist}
              </span>
            </div>
            <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {fmt(t.duration)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
