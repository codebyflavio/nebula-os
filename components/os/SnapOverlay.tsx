"use client";
import { create } from "zustand";
import { AnimatePresence, motion } from "framer-motion";

export type SnapZone = "left" | "right" | "top" | null;

interface SnapStore {
  zone: SnapZone;
  setZone: (z: SnapZone) => void;
}

export const useSnapStore = create<SnapStore>((set) => ({
  zone: null,
  setZone: (zone) => set({ zone }),
}));

/** Call during drag to compute snap zone based on cursor position */
export function getSnapZone(cx: number, cy: number): SnapZone {
  const edgeX = 24;
  const edgeY = 40;
  if (cx <= edgeX) return "left";
  if (cx >= window.innerWidth - edgeX) return "right";
  if (cy <= edgeY + 28) return "top"; // near menubar = maximize
  return null;
}

/** Returns the window rect for a given snap zone */
export function snapRect(zone: SnapZone): { x: number; y: number; w: number; h: number } | null {
  if (!zone) return null;
  const menuH = 28;
  const dockH = 68;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const usable = vh - menuH - dockH;
  if (zone === "left")  return { x: 0,      y: menuH, w: vw / 2, h: usable };
  if (zone === "right") return { x: vw / 2, y: menuH, w: vw / 2, h: usable };
  if (zone === "top")   return { x: 0,      y: menuH, w: vw,     h: usable };
  return null;
}

export default function SnapOverlay() {
  const zone = useSnapStore((s) => s.zone);

  const styles: Record<NonNullable<SnapZone>, React.CSSProperties> = {
    left: {
      left: 0,
      top: 28,
      width: "50%",
      height: "calc(100vh - 28px - 68px)",
    },
    right: {
      right: 0,
      top: 28,
      width: "50%",
      height: "calc(100vh - 28px - 68px)",
    },
    top: {
      left: 0,
      top: 28,
      width: "100%",
      height: "calc(100vh - 28px - 68px)",
    },
  };

  return (
    <AnimatePresence>
      {zone && (
        <motion.div
          key={zone}
          className="fixed pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            ...styles[zone],
            zIndex: 9000,
            borderRadius: 12,
            background: "rgba(99,102,241,0.12)",
            border: "2px solid rgba(99,102,241,0.35)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
