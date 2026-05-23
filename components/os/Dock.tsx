"use client";
import { useRef, createContext, useContext, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/stores/windowStore";
import { DOCK_APPS, APP_COLORS, getApp } from "@/lib/apps";
import { openApp } from "@/lib/openApp";
import {
  Terminal, Folder, Globe, FileText, Music,
  Calendar, Settings, Calculator, Activity,
  Clock, LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  terminal:   Terminal,
  folder:     Folder,
  globe:      Globe,
  "file-text":FileText,
  music:      Music,
  calendar:   Calendar,
  settings:   Settings,
  calculator: Calculator,
  activity:   Activity,
  clock:      Clock,
};

// Context shares the mouseX motion value across all dock items
const MouseXCtx = createContext<ReturnType<typeof useMotionValue<number>> | null>(null);

const BASE      = 48;   // resting icon size px
const MAX_SCALE = 1.85; // peak magnification
const SPREAD    = 110;  // influence radius px

// ── Single dock item ────────────────────────────────────────
function DockItem({ appId }: { appId: string }) {
  const app     = useContext(MouseXCtx);    // re-named below
  const mouseX  = useContext(MouseXCtx)!;
  const ref      = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const appDef   = getApp(appId);
  const windows  = useWindowStore((s) => s.windows);
  const isOpen   = windows.some((w) => w.appId === appId && !w.isMinimized);
  const hasWin   = windows.some((w) => w.appId === appId);
  const isMin    = windows.some((w) => w.appId === appId && w.isMinimized);

  // Magnification
  const distance = useTransform(mouseX, (mx) => {
    const el = ref.current;
    if (!el) return Infinity;
    const { left, width } = el.getBoundingClientRect();
    return Math.abs(mx - (left + width / 2));
  });
  const scaleTw   = useTransform(distance, [0, SPREAD], [MAX_SCALE, 1], { clamp: true });
  const scale     = useSpring(scaleTw, { stiffness: 320, damping: 24, mass: 0.4 });
  const yLift     = useTransform(scale, [1, MAX_SCALE], [0, -(BASE * (MAX_SCALE - 1)) / 2 - 4]);

  if (!appDef) return null;
  const Icon   = ICON_MAP[appDef.icon] ?? Terminal;
  const colors = APP_COLORS[appId] ?? { from: "#6366f1", to: "#6366f1", glow: "rgba(99,102,241,0.5)" };

  return (
    <motion.div
      ref={ref}
      style={{ scale, y: yLift, originY: 1 }}
      className="relative flex flex-col items-center cursor-pointer select-none"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => openApp(appId)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute bottom-full mb-2 px-2.5 py-1 rounded-lg text-xs font-medium pointer-events-none whitespace-nowrap"
            style={{
              background: "rgba(6,8,22,0.92)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-primary)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
              zIndex: 10,
            }}
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.12 }}
          >
            {appDef.name}
            {/* Tooltip arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-1"
              style={{
                width: 6, height: 6,
                background: "rgba(6,8,22,0.92)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderTop: "none",
                borderLeft: "none",
                transform: "translateX(-50%) rotate(45deg)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon container */}
      <div
        className="flex items-center justify-center rounded-2xl transition-shadow duration-200"
        style={{
          width: BASE,
          height: BASE,
          background: `linear-gradient(145deg, ${colors.from}, ${colors.to})`,
          boxShadow: hovered
            ? `inset 0 1px 0 rgba(255,255,255,0.3), 0 0 24px ${colors.glow}, 0 8px 32px rgba(0,0,0,0.5)`
            : `inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Inner icon shine layer */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, transparent 60%)",
          }}
        />
        <Icon size={22} strokeWidth={1.6} color="rgba(255,255,255,0.95)" />
      </div>

      {/* Running dot */}
      <div className="mt-1 flex justify-center" style={{ height: 4 }}>
        {hasWin && (
          <motion.div
            className="rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              width: isMin ? 6 : 4,
              height: 4,
              background: isMin ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.8)",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ── Dock separator ──────────────────────────────────────────
function Separator() {
  return (
    <div
      className="self-center flex-shrink-0 mx-1"
      style={{
        width: 1,
        height: 28,
        background: "rgba(255,255,255,0.1)",
        borderRadius: 1,
      }}
    />
  );
}

// ── Dock shell ──────────────────────────────────────────────
export default function Dock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-center items-end"
      style={{ height: "var(--dock-h)", zIndex: 8500, paddingBottom: 8 }}
    >
      <MouseXCtx.Provider value={mouseX}>
        <motion.div
          data-no-context
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex items-end gap-2 px-3 py-2 rounded-[22px]"
          style={{
            background: "rgba(10,12,30,0.72)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.1), 0 -1px 0 rgba(255,255,255,0.04), 0 8px 48px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          {DOCK_APPS.map((id, i) =>
            id === "---"
              ? <Separator key={`sep-${i}`} />
              : <DockItem key={id} appId={id} />
          )}
        </motion.div>
      </MouseXCtx.Provider>
    </div>
  );
}
