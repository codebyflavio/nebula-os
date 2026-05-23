"use client";
import { useState, useEffect } from "react";
import { AppProps } from "@/types";
import { Plus, X } from "lucide-react";

interface TZEntry {
  id: string;
  label: string;
  tz: string;
  flag: string;
}

const DEFAULT_ZONES: TZEntry[] = [
  { id: "local",   label: "Local",         tz: Intl.DateTimeFormat().resolvedOptions().timeZone, flag: "🏠" },
  { id: "ny",      label: "New York",      tz: "America/New_York",   flag: "🗽" },
  { id: "london",  label: "London",        tz: "Europe/London",      flag: "🇬🇧" },
  { id: "paris",   label: "Paris",         tz: "Europe/Paris",       flag: "🇫🇷" },
  { id: "tokyo",   label: "Tokyo",         tz: "Asia/Tokyo",         flag: "🇯🇵" },
  { id: "dubai",   label: "Dubai",         tz: "Asia/Dubai",         flag: "🇦🇪" },
];

const AVAILABLE: TZEntry[] = [
  { id: "la",      label: "Los Angeles",   tz: "America/Los_Angeles", flag: "🌴" },
  { id: "chicago", label: "Chicago",       tz: "America/Chicago",     flag: "🏙️" },
  { id: "saopaulo",label: "São Paulo",     tz: "America/Sao_Paulo",   flag: "🇧🇷" },
  { id: "berlin",  label: "Berlin",        tz: "Europe/Berlin",       flag: "🇩🇪" },
  { id: "moscow",  label: "Moscow",        tz: "Europe/Moscow",       flag: "🇷🇺" },
  { id: "dubai2",  label: "Singapore",     tz: "Asia/Singapore",      flag: "🇸🇬" },
  { id: "sydney",  label: "Sydney",        tz: "Australia/Sydney",    flag: "🇦🇺" },
  { id: "beijing", label: "Beijing",       tz: "Asia/Shanghai",       flag: "🇨🇳" },
];

function getTime(tz: string) {
  const now = new Date();
  return {
    time: now.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
    date: now.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" }),
    h: parseInt(now.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", hour12: false })),
  };
}

function AnalogClock({ tz }: { tz: string }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tzDate = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const s = tzDate.getSeconds();
  const m = tzDate.getMinutes();
  const h = tzDate.getHours() % 12;

  const sDeg = s * 6;
  const mDeg = m * 6 + s * 0.1;
  const hDeg = h * 30 + m * 0.5;

  const r = 56;
  const cx = 64, cy = 64;

  function hand(angle: number, len: number, width: number, color: string) {
    const rad = ((angle - 90) * Math.PI) / 180;
    const x2 = cx + len * Math.cos(rad);
    const y2 = cy + len * Math.sin(rad);
    return <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />;
  }

  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      {/* Dial */}
      <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* Hour marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 - 90) * (Math.PI / 180);
        const x1 = cx + (r - 8) * Math.cos(a);
        const y1 = cy + (r - 8) * Math.sin(a);
        const x2 = cx + (r - 2) * Math.cos(a);
        const y2 = cy + (r - 2) * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.25)" strokeWidth={i % 3 === 0 ? 2 : 1} />;
      })}
      {/* Hands */}
      {hand(hDeg, 28, 3, "var(--text-primary)")}
      {hand(mDeg, 38, 2, "var(--accent-indigo)")}
      {hand(sDeg, 44, 1, "var(--accent-cyan)")}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3} fill="var(--accent-indigo)" />
    </svg>
  );
}

export default function Clock({ windowId }: AppProps) {
  const [zones, setZones] = useState<TZEntry[]>(DEFAULT_ZONES);
  const [tick, setTick] = useState(0);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  function addZone(z: TZEntry) {
    if (!zones.find((e) => e.id === z.id)) {
      setZones((prev) => [...prev, z]);
    }
    setShowAdd(false);
  }

  function removeZone(id: string) {
    setZones((prev) => prev.filter((z) => z.id !== id));
  }

  const localData = getTime(zones[0]?.tz ?? "UTC");

  return (
    <div className="flex flex-col h-full" style={{ background: "rgba(4,6,20,0.98)" }}>
      {/* Hero clock */}
      <div
        className="flex flex-col items-center justify-center py-6 gap-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.2)" }}
      >
        <AnalogClock tz={zones[0]?.tz ?? "UTC"} />
        <div className="flex flex-col items-center">
          <span
            className="text-4xl font-light tabular-nums"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}
          >
            {localData.time}
          </span>
          <span className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {localData.date} · {zones[0]?.label}
          </span>
        </div>
      </div>

      {/* World clocks list */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0">
        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>
          WORLD CLOCKS
        </span>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors hover:bg-white/10"
          style={{ color: "var(--accent-cyan)" }}
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {showAdd && (
        <div
          className="mx-4 mb-2 rounded-xl overflow-hidden flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)" }}
        >
          {AVAILABLE.filter((z) => !zones.find((e) => e.id === z.id)).map((z) => (
            <button
              key={z.id}
              onClick={() => addZone(z)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 transition-colors text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>{z.flag}</span> {z.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {zones.slice(1).map((zone) => {
          const data = getTime(zone.tz);
          const isDaytime = data.h >= 6 && data.h < 20;
          return (
            <div
              key={zone.id}
              className="flex items-center gap-3 px-4 py-3 border-b hover:bg-white/5 transition-colors group"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <span style={{ fontSize: 20 }}>{zone.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {zone.label}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isDaytime ? "rgba(245,158,11,0.15)" : "rgba(99,102,241,0.15)",
                      color: isDaytime ? "#F59E0B" : "var(--accent-indigo)",
                      fontSize: 10,
                    }}
                  >
                    {isDaytime ? "☀️ Day" : "🌙 Night"}
                  </span>
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{data.date}</span>
              </div>
              <span
                className="tabular-nums text-base font-medium"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
              >
                {data.time.slice(0, 5)}
              </span>
              <button
                onClick={() => removeZone(zone.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
