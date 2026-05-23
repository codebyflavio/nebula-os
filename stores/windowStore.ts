import { create } from "zustand";
import { WindowState } from "@/types";

let zCounter = 100;

interface WindowStore {
  windows: WindowState[];

  openWindow: (win: Omit<WindowState, "zIndex" | "isFocused" | "isMinimized" | "isMaximized">) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeToggle: (id: string, viewportW: number, viewportH: number) => void;
  setPosition: (id: string, x: number, y: number) => void;
  setSize: (id: string, width: number, height: number) => void;
  setPositionAndSize: (id: string, x: number, y: number, w: number, h: number) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],

  openWindow: (win) => {
    const existing = get().windows.find((w) => w.id === win.id);
    if (existing) {
      // bring to front
      get().focusWindow(win.id);
      if (existing.isMinimized) get().restoreWindow(win.id);
      return;
    }
    zCounter += 1;
    set((s) => ({
      windows: [
        ...s.windows.map((w) => ({ ...w, isFocused: false })),
        {
          ...win,
          zIndex: zCounter,
          isFocused: true,
          isMinimized: false,
          isMaximized: false,
        },
      ],
    }));
  },

  closeWindow: (id) =>
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),

  focusWindow: (id) => {
    zCounter += 1;
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id
          ? { ...w, isFocused: true, zIndex: zCounter }
          : { ...w, isFocused: false }
      ),
    }));
  },

  minimizeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
      ),
    })),

  restoreWindow: (id) => {
    zCounter += 1;
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id
          ? { ...w, isMinimized: false, isFocused: true, zIndex: zCounter }
          : { ...w, isFocused: false }
      ),
    }));
  },

  maximizeToggle: (id, viewportW, viewportH) => {
    const menuH = 28;
    const dockH = 68;
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          const r = w.restoreRect!;
          return { ...w, isMaximized: false, x: r.x, y: r.y, width: r.width, height: r.height };
        } else {
          return {
            ...w,
            isMaximized: true,
            restoreRect: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: menuH,
            width: viewportW,
            height: viewportH - menuH - dockH,
          };
        }
      }),
    }));
  },

  setPosition: (id, x, y) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  setSize: (id, width, height) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, width, height } : w)),
    })),

  setPositionAndSize: (id, x, y, width, height) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y, width, height } : w)),
    })),
}));
