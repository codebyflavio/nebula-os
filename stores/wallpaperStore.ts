import { create } from "zustand";

export type WallpaperType = "gradient" | "solid" | "pattern" | "image";

export interface WallpaperPreset {
  id: string;
  name: string;
  type: WallpaperType;
  preview: string; // CSS background string for thumbnail
  // gradient
  bg?: string;
  layers?: string[];
  animate?: boolean;
  // solid
  color?: string;
  // pattern
  patternId?: string;
  // image
  imageUrl?: string;
  imageFit?: "cover" | "contain" | "center";
}

export const PRESETS: WallpaperPreset[] = [
  // ── Gradients ──────────────────────────────────────────────
  {
    id: "nebula",
    name: "Nebula",
    type: "gradient",
    bg: "#020617",
    animate: true,
    layers: [
      "radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.22) 0%, transparent 55%)",
      "radial-gradient(ellipse at 80% 70%, rgba(6,182,212,0.14) 0%, transparent 55%)",
      "radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    ],
    preview:
      "radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.5) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(6,182,212,0.4) 0%, transparent 55%), #020617",
  },
  {
    id: "aurora",
    name: "Aurora",
    type: "gradient",
    bg: "#011a0f",
    animate: true,
    layers: [
      "radial-gradient(ellipse at 25% 40%, rgba(16,185,129,0.25) 0%, transparent 55%)",
      "radial-gradient(ellipse at 75% 60%, rgba(6,182,212,0.16) 0%, transparent 55%)",
      "radial-gradient(ellipse at 50% 80%, rgba(52,211,153,0.12) 0%, transparent 60%)",
    ],
    preview:
      "radial-gradient(ellipse at 25% 40%, rgba(16,185,129,0.6) 0%, transparent 55%), radial-gradient(ellipse at 75% 60%, rgba(6,182,212,0.4) 0%, transparent 55%), #011a0f",
  },
  {
    id: "crimson",
    name: "Crimson",
    type: "gradient",
    bg: "#130205",
    animate: true,
    layers: [
      "radial-gradient(ellipse at 30% 35%, rgba(239,68,68,0.22) 0%, transparent 55%)",
      "radial-gradient(ellipse at 70% 65%, rgba(249,115,22,0.14) 0%, transparent 55%)",
      "radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.12) 0%, transparent 60%)",
    ],
    preview:
      "radial-gradient(ellipse at 30% 35%, rgba(239,68,68,0.6) 0%, transparent 55%), radial-gradient(ellipse at 70% 65%, rgba(249,115,22,0.4) 0%, transparent 55%), #130205",
  },
  {
    id: "solar",
    name: "Solar",
    type: "gradient",
    bg: "#0d0a02",
    animate: true,
    layers: [
      "radial-gradient(ellipse at 30% 30%, rgba(245,158,11,0.22) 0%, transparent 55%)",
      "radial-gradient(ellipse at 70% 70%, rgba(234,179,8,0.14) 0%, transparent 55%)",
      "radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.12) 0%, transparent 60%)",
    ],
    preview:
      "radial-gradient(ellipse at 30% 30%, rgba(245,158,11,0.6) 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(234,179,8,0.4) 0%, transparent 55%), #0d0a02",
  },
  {
    id: "ocean",
    name: "Ocean",
    type: "gradient",
    bg: "#020d1a",
    animate: true,
    layers: [
      "radial-gradient(ellipse at 20% 60%, rgba(14,165,233,0.22) 0%, transparent 55%)",
      "radial-gradient(ellipse at 80% 30%, rgba(6,182,212,0.16) 0%, transparent 55%)",
      "radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.10) 0%, transparent 60%)",
    ],
    preview:
      "radial-gradient(ellipse at 20% 60%, rgba(14,165,233,0.6) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(6,182,212,0.4) 0%, transparent 55%), #020d1a",
  },
  {
    id: "rose",
    name: "Rose",
    type: "gradient",
    bg: "#130a10",
    animate: true,
    layers: [
      "radial-gradient(ellipse at 30% 40%, rgba(236,72,153,0.22) 0%, transparent 55%)",
      "radial-gradient(ellipse at 70% 60%, rgba(168,85,247,0.16) 0%, transparent 55%)",
      "radial-gradient(ellipse at 50% 20%, rgba(244,63,94,0.12) 0%, transparent 50%)",
    ],
    preview:
      "radial-gradient(ellipse at 30% 40%, rgba(236,72,153,0.6) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(168,85,247,0.4) 0%, transparent 55%), #130a10",
  },
  {
    id: "forest",
    name: "Forest",
    type: "gradient",
    bg: "#020f05",
    animate: true,
    layers: [
      "radial-gradient(ellipse at 40% 50%, rgba(34,197,94,0.18) 0%, transparent 55%)",
      "radial-gradient(ellipse at 70% 30%, rgba(16,185,129,0.12) 0%, transparent 50%)",
      "radial-gradient(ellipse at 20% 80%, rgba(132,204,22,0.10) 0%, transparent 55%)",
    ],
    preview:
      "radial-gradient(ellipse at 40% 50%, rgba(34,197,94,0.5) 0%, transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(16,185,129,0.3) 0%, transparent 50%), #020f05",
  },
  {
    id: "galaxy",
    name: "Galaxy",
    type: "gradient",
    bg: "#040210",
    animate: true,
    layers: [
      "radial-gradient(ellipse at 15% 25%, rgba(139,92,246,0.25) 0%, transparent 50%)",
      "radial-gradient(ellipse at 85% 75%, rgba(59,130,246,0.20) 0%, transparent 50%)",
      "radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.15) 0%, transparent 60%)",
    ],
    preview:
      "radial-gradient(ellipse at 15% 25%, rgba(139,92,246,0.7) 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, rgba(59,130,246,0.5) 0%, transparent 50%), #040210",
  },

  // ── Solids ─────────────────────────────────────────────────
  {
    id: "black",
    name: "Pure Black",
    type: "solid",
    color: "#000000",
    preview: "#000000",
  },
  {
    id: "space",
    name: "Deep Space",
    type: "solid",
    color: "#020617",
    preview: "#020617",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    type: "solid",
    color: "#0a0a0f",
    preview: "#0a0a0f",
  },
  {
    id: "slate",
    name: "Dark Slate",
    type: "solid",
    color: "#0f172a",
    preview: "#0f172a",
  },
  {
    id: "charcoal",
    name: "Charcoal",
    type: "solid",
    color: "#1c1c1e",
    preview: "#1c1c1e",
  },
  {
    id: "dark-green",
    name: "Deep Forest",
    type: "solid",
    color: "#071a0a",
    preview: "#071a0a",
  },

  // ── Patterns ───────────────────────────────────────────────
  {
    id: "pattern-grid",
    name: "Grid",
    type: "pattern",
    patternId: "grid",
    bg: "#020617",
    preview: "repeating-linear-gradient(0deg, rgba(99,102,241,0.15) 0px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(99,102,241,0.15) 0px, transparent 1px, transparent 32px), #020617",
  },
  {
    id: "pattern-dots",
    name: "Dots",
    type: "pattern",
    patternId: "dots",
    bg: "#020617",
    preview: "radial-gradient(circle, rgba(99,102,241,0.35) 1px, transparent 1px), #020617",
  },
  {
    id: "pattern-lines",
    name: "Diagonal",
    type: "pattern",
    patternId: "lines",
    bg: "#020617",
    preview: "repeating-linear-gradient(45deg, rgba(99,102,241,0.12) 0px, rgba(99,102,241,0.12) 1px, transparent 0px, transparent 50%), #020617",
  },
  {
    id: "pattern-circuit",
    name: "Circuit",
    type: "pattern",
    patternId: "circuit",
    bg: "#020617",
    preview: "repeating-linear-gradient(0deg, rgba(6,182,212,0.12) 0px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(6,182,212,0.12) 0px, transparent 1px, transparent 20px), #020617",
  },
];

interface WallpaperStore {
  activeId: string;
  activePreset: WallpaperPreset;
  customImageUrl: string;

  setWallpaper: (id: string) => void;
  setCustomImage: (url: string) => void;
}

export const useWallpaperStore = create<WallpaperStore>((set) => ({
  activeId: "nebula",
  activePreset: PRESETS[0],
  customImageUrl: "",

  setWallpaper: (id) => {
    const preset = PRESETS.find((p) => p.id === id) ?? PRESETS[0];
    set({ activeId: id, activePreset: preset });
  },

  setCustomImage: (url) => {
    const customPreset: WallpaperPreset = {
      id: "custom",
      name: "Custom",
      type: "image",
      imageUrl: url,
      imageFit: "cover",
      preview: `url(${url})`,
    };
    set({ activeId: "custom", activePreset: customPreset, customImageUrl: url });
  },
}));
