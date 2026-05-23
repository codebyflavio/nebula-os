import { lazy } from "react";
import { AppDefinition } from "@/types";

const Terminal     = lazy(() => import("@/components/apps/Terminal"));
const Notes        = lazy(() => import("@/components/apps/Notes"));
const Browser      = lazy(() => import("@/components/apps/Browser"));
const Files        = lazy(() => import("@/components/apps/Files"));
const Settings     = lazy(() => import("@/components/apps/Settings"));
const MusicPlayer  = lazy(() => import("@/components/apps/MusicPlayer"));
const Calendar     = lazy(() => import("@/components/apps/Calendar"));
const Calculator   = lazy(() => import("@/components/apps/Calculator"));
const SystemMonitor= lazy(() => import("@/components/apps/SystemMonitor"));
const Clock        = lazy(() => import("@/components/apps/Clock"));

export const APP_REGISTRY: AppDefinition[] = [
  {
    id: "terminal",
    name: "Terminal",
    icon: "terminal",
    component: Terminal as any,
    defaultWidth: 680,
    defaultHeight: 440,
    minWidth: 400,
    minHeight: 280,
  },
  {
    id: "browser",
    name: "Browser",
    icon: "globe",
    component: Browser as any,
    defaultWidth: 900,
    defaultHeight: 600,
    minWidth: 480,
    minHeight: 360,
  },
  {
    id: "files",
    name: "Files",
    icon: "folder",
    component: Files as any,
    defaultWidth: 720,
    defaultHeight: 480,
    minWidth: 400,
    minHeight: 300,
  },
  {
    id: "notes",
    name: "Notes",
    icon: "file-text",
    component: Notes as any,
    defaultWidth: 560,
    defaultHeight: 420,
    minWidth: 320,
    minHeight: 240,
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: "calculator",
    component: Calculator as any,
    defaultWidth: 440,
    defaultHeight: 540,
    minWidth: 340,
    minHeight: 460,
    singleton: true,
  },
  {
    id: "music",
    name: "Music",
    icon: "music",
    component: MusicPlayer as any,
    defaultWidth: 380,
    defaultHeight: 560,
    minWidth: 320,
    minHeight: 420,
    singleton: true,
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "calendar",
    component: Calendar as any,
    defaultWidth: 580,
    defaultHeight: 480,
    minWidth: 400,
    minHeight: 360,
    singleton: true,
  },
  {
    id: "clock",
    name: "Clock",
    icon: "clock",
    component: Clock as any,
    defaultWidth: 340,
    defaultHeight: 520,
    minWidth: 300,
    minHeight: 420,
    singleton: true,
  },
  {
    id: "monitor",
    name: "System Monitor",
    icon: "activity",
    component: SystemMonitor as any,
    defaultWidth: 680,
    defaultHeight: 500,
    minWidth: 500,
    minHeight: 380,
    singleton: true,
  },
  {
    id: "settings",
    name: "Settings",
    icon: "settings",
    component: Settings as any,
    defaultWidth: 640,
    defaultHeight: 480,
    minWidth: 400,
    minHeight: 360,
    singleton: true,
  },
];

export function getApp(id: string): AppDefinition | undefined {
  return APP_REGISTRY.find((a) => a.id === id);
}

/** Ordered dock items — separator encoded as "---" */
export const DOCK_APPS = [
  "terminal", "browser", "files", "notes",
  "---",
  "calculator", "music", "calendar", "clock",
  "---",
  "monitor", "settings",
];

/** Per-app icon color tokens */
export const APP_COLORS: Record<string, { from: string; to: string; glow: string }> = {
  terminal:   { from: "#4f46e5", to: "#6366f1", glow: "rgba(99,102,241,0.5)"  },
  browser:    { from: "#0891b2", to: "#06b6d4", glow: "rgba(6,182,212,0.5)"   },
  files:      { from: "#d97706", to: "#f59e0b", glow: "rgba(245,158,11,0.5)"  },
  notes:      { from: "#9333ea", to: "#a855f7", glow: "rgba(168,85,247,0.5)"  },
  calculator: { from: "#ea580c", to: "#f97316", glow: "rgba(249,115,22,0.5)"  },
  music:      { from: "#db2777", to: "#ec4899", glow: "rgba(236,72,153,0.5)"  },
  calendar:   { from: "#059669", to: "#10b981", glow: "rgba(16,185,129,0.5)"  },
  clock:      { from: "#0d9488", to: "#14b8a6", glow: "rgba(20,184,166,0.5)"  },
  monitor:    { from: "#dc2626", to: "#ef4444", glow: "rgba(239,68,68,0.5)"   },
  settings:   { from: "#475569", to: "#64748b", glow: "rgba(100,116,139,0.5)" },
};
