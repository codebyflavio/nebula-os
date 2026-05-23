import { create } from "zustand";
import { Theme } from "@/types";

const themes: Theme[] = [
  {
    id: "nebula",
    name: "Nebula",
    bg: "#020617",
    glassBg: "rgba(8,10,28,0.78)",
    glassBorder: "rgba(255,255,255,0.08)",
    accentPrimary: "#6366F1",
    accentSecondary: "#06B6D4",
    accentTertiary: "#A855F7",
    wallpaperGradient:
      "radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.18) 0%, transparent 55%)," +
      "radial-gradient(ellipse at 80% 70%, rgba(6,182,212,0.12) 0%, transparent 55%)," +
      "radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.10) 0%, transparent 60%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    bg: "#021a0f",
    glassBg: "rgba(4,22,12,0.80)",
    glassBorder: "rgba(255,255,255,0.07)",
    accentPrimary: "#10B981",
    accentSecondary: "#06B6D4",
    accentTertiary: "#34D399",
    wallpaperGradient:
      "radial-gradient(ellipse at 30% 40%, rgba(16,185,129,0.18) 0%, transparent 55%)," +
      "radial-gradient(ellipse at 70% 60%, rgba(6,182,212,0.12) 0%, transparent 55%)," +
      "radial-gradient(ellipse at 50% 80%, rgba(52,211,153,0.10) 0%, transparent 60%)",
  },
  {
    id: "crimson",
    name: "Crimson",
    bg: "#130205",
    glassBg: "rgba(18,2,8,0.82)",
    glassBorder: "rgba(255,255,255,0.07)",
    accentPrimary: "#EF4444",
    accentSecondary: "#F97316",
    accentTertiary: "#EC4899",
    wallpaperGradient:
      "radial-gradient(ellipse at 25% 35%, rgba(239,68,68,0.18) 0%, transparent 55%)," +
      "radial-gradient(ellipse at 75% 65%, rgba(249,115,22,0.12) 0%, transparent 55%)," +
      "radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.10) 0%, transparent 60%)",
  },
  {
    id: "solar",
    name: "Solar",
    bg: "#0d0a02",
    glassBg: "rgba(20,16,4,0.80)",
    glassBorder: "rgba(255,255,255,0.07)",
    accentPrimary: "#F59E0B",
    accentSecondary: "#EAB308",
    accentTertiary: "#FBBF24",
    wallpaperGradient:
      "radial-gradient(ellipse at 30% 30%, rgba(245,158,11,0.18) 0%, transparent 55%)," +
      "radial-gradient(ellipse at 70% 70%, rgba(234,179,8,0.12) 0%, transparent 55%)," +
      "radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.10) 0%, transparent 60%)",
  },
];

interface ThemeStore {
  themes: Theme[];
  activeThemeId: string;
  activeTheme: Theme;
  setTheme: (id: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  themes,
  activeThemeId: "nebula",
  activeTheme: themes[0],
  setTheme: (id) => {
    const t = themes.find((th) => th.id === id);
    if (t) set({ activeThemeId: id, activeTheme: t });
  },
}));
