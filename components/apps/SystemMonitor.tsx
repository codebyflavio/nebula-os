"use client";
import { useState, useEffect, useRef } from "react";
import { AppProps } from "@/types";
import { Cpu, MemoryStick, Wifi, HardDrive } from "lucide-react";

const MAX_POINTS = 60;

interface Metric {
  cpu: number;
  ram: number;
  net: number;
  disk: number;
}

function generateMetric(prev?: Metric): Metric {
  const rand = (base: number, variance: number) =>
    Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance));
  return {
    cpu:  rand(prev?.cpu  ?? 35, 20),
    ram:  rand(prev?.ram  ?? 58, 8),
    net:  rand(prev?.net  ?? 40, 30),
    disk: rand(prev?.disk ?? 20, 10),
  };
}

const PROCESSES = [
  { name: "nebula-wm",      cpu: 2.1,  ram: 128  },
  { name: "renderer",       cpu: 8.4,  ram: 512  },
  { name: "terminal",       cpu: 0.3,  ram: 64   },
  { name: "browser",        cpu: 12.6, ram: 1024 },
  { name: "music-daemon",   cpu: 1.8,  ram: 96   },
  { name: "fs-watcher",     cpu: 0.1,  ram: 32   },
  { name: "notification",   cpu: 0.2,  ram: 48   },
  { name: "theme-engine",   cpu: 0.4,  ram: 80   },
  { name: "spotlight",      cpu: 0.5,  ram: 72   },
  { name: "system",         cpu: 3.2,  ram: 256  },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const w = 100, h = 36;
  const pts = data.slice(-MAX_POINTS);
  const step = w / (MAX_POINTS - 1);
  const path = pts
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / 100) * h}`)
    .join(" ");
  const fill = pts
    .map((v, i) => `${i * step},${h - (v / 100) * h}`)
    .join(" ") + ` ${(pts.length - 1) * step},${h} 0,${h}`;

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={fill}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      <path d={path} stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

function MetricCard({
  label, icon: Icon, value, color, data, unit = "%",
}: {
  label: string;
  icon: any;
  value: number;
  color: string;
  data: number[];
  unit?: string;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl p-4 gap-2"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--glass-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={13} style={{ color }} />
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {label}
          </span>
        </div>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color, fontFamily: "var(--font-mono)" }}
        >
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <div style={{ height: 36 }}>
        <Sparkline data={data} color={color} />
      </div>
      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}80` }}
        />
      </div>
    </div>
  );
}

export default function SystemMonitor({ windowId }: AppProps) {
  const [history, setHistory] = useState<Metric[]>(() =>
    Array.from({ length: MAX_POINTS }, () => generateMetric())
  );
  const [tab, setTab] = useState<"overview" | "processes">("overview");

  useEffect(() => {
    const id = setInterval(() => {
      setHistory((h) => {
        const last = h[h.length - 1];
        return [...h.slice(-MAX_POINTS + 1), generateMetric(last)];
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const latest = history[history.length - 1];

  return (
    <div className="flex flex-col h-full" style={{ background: "rgba(4,6,20,0.98)" }}>
      {/* Tabs */}
      <div
        className="flex items-center gap-1 px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: "var(--glass-border)", background: "rgba(8,10,28,0.5)" }}
      >
        {(["overview", "processes"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs capitalize transition-colors"
            style={{
              background: tab === t ? "rgba(99,102,241,0.2)" : "transparent",
              color: tab === t ? "var(--accent-indigo)" : "var(--text-muted)",
              border: tab === t ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
        <div className="flex-1" />
        <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          Live · 1s
        </span>
      </div>

      {tab === "overview" ? (
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start">
          <MetricCard label="CPU"     icon={Cpu}        value={latest.cpu}  color="#6366F1" data={history.map(h => h.cpu)}  />
          <MetricCard label="Memory"  icon={MemoryStick} value={latest.ram}  color="#06B6D4" data={history.map(h => h.ram)}  />
          <MetricCard label="Network" icon={Wifi}        value={latest.net}  color="#A855F7" data={history.map(h => h.net)}  unit=" MB/s" />
          <MetricCard label="Disk"    icon={HardDrive}   value={latest.disk} color="#10B981" data={history.map(h => h.disk)} />

          {/* System info */}
          <div
            className="col-span-2 rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}
          >
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>
              SYSTEM INFO
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
              {[
                ["OS",      "NebulaOS 1.0.0"],
                ["Kernel",  "nebula-5.15.0"],
                ["Arch",    "x86_64"],
                ["CPU",     "Nebula Core i9 · 16 cores"],
                ["Memory",  "32 GB DDR5"],
                ["Storage", "2 TB NVMe"],
                ["Uptime",  "2h 34m"],
                ["Tasks",   `${PROCESSES.length} running`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{k}</span>
                  <span className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col">
          <div
            className="grid text-xs px-4 py-2 border-b flex-shrink-0"
            style={{
              gridTemplateColumns: "1fr 80px 80px",
              borderColor: "var(--glass-border)",
              color: "var(--text-muted)",
              background: "rgba(8,10,28,0.4)",
            }}
          >
            <span>Process</span>
            <span className="text-right">CPU</span>
            <span className="text-right">RAM (MB)</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {PROCESSES.map((p, i) => (
              <div
                key={p.name}
                className="grid px-4 py-2.5 hover:bg-white/5 transition-colors text-xs border-b"
                style={{
                  gridTemplateColumns: "1fr 80px 80px",
                  borderColor: "rgba(255,255,255,0.03)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "var(--accent-cyan)" }}
                  />
                  <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                    {p.name}
                  </span>
                </div>
                <span
                  className="text-right tabular-nums"
                  style={{ color: p.cpu > 10 ? "#F59E0B" : "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                >
                  {(p.cpu * (0.85 + Math.random() * 0.3)).toFixed(1)}%
                </span>
                <span
                  className="text-right tabular-nums"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                >
                  {p.ram}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
