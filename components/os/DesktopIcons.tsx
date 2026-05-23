"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { openApp } from "@/lib/openApp";
import { Terminal, Folder, Globe, FileText, Music, Calendar, Settings, LucideIcon } from "lucide-react";

interface DesktopIcon {
  appId: string;
  label: string;
  Icon: LucideIcon;
  color: string;
  gridX: number;
  gridY: number;
}

const ICONS: DesktopIcon[] = [
  { appId: "terminal", label: "Terminal", Icon: Terminal, color: "#6366F1", gridX: 0, gridY: 0 },
  { appId: "files",    label: "Files",    Icon: Folder,   color: "#F59E0B", gridX: 0, gridY: 1 },
  { appId: "browser",  label: "Browser",  Icon: Globe,    color: "#06B6D4", gridX: 0, gridY: 2 },
  { appId: "notes",    label: "Notes",    Icon: FileText, color: "#A855F7", gridX: 0, gridY: 3 },
];

const ICON_SIZE = 72;
const GAP = 16;
const MARGIN_TOP = 28 + 12; // below menubar
const MARGIN_RIGHT = 16;

export default function DesktopIcons() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50 }}>
      {ICONS.map((icon) => {
        const right = MARGIN_RIGHT;
        const top = MARGIN_TOP + icon.gridY * (ICON_SIZE + GAP);
        const isSelected = selected === icon.appId;

        return (
          <motion.button
            key={icon.appId}
            className="absolute flex flex-col items-center gap-1.5 pointer-events-auto rounded-xl p-2 select-none"
            style={{
              right,
              top,
              width: ICON_SIZE,
              background: isSelected ? "rgba(99,102,241,0.18)" : "transparent",
              border: isSelected ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
            }}
            onClick={() => setSelected(isSelected ? null : icon.appId)}
            onDoubleClick={() => { openApp(icon.appId); setSelected(null); }}
            whileTap={{ scale: 0.92 }}
          >
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: 44,
                height: 44,
                background: `${icon.color}22`,
                border: `1px solid ${icon.color}44`,
                boxShadow: isSelected ? `0 0 16px ${icon.color}44` : "none",
              }}
            >
              <icon.Icon size={22} strokeWidth={1.5} style={{ color: icon.color }} />
            </div>
            <span
              className="text-center leading-tight"
              style={{
                fontSize: 10,
                color: "var(--text-secondary)",
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                maxWidth: 64,
                wordBreak: "break-word",
              }}
            >
              {icon.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
