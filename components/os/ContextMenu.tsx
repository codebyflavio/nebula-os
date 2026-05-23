"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/stores/themeStore";
import { useOSStore } from "@/stores/osStore";
import { useWallpaperStore, PRESETS } from "@/stores/wallpaperStore";
import { openApp } from "@/lib/openApp";
import { toast } from "./Toast";
import {
  Terminal, RefreshCw, Palette, Info, Search, Layers,
} from "lucide-react";

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  divider?: boolean;
  danger?: boolean;
}

interface MenuState {
  x: number;
  y: number;
  open: boolean;
}

export default function ContextMenu() {
  const [menu, setMenu] = useState<MenuState>({ x: 0, y: 0, open: false });
  const ref = useRef<HTMLDivElement>(null);
  const { themes, activeThemeId, setTheme } = useThemeStore();
  const { setWallpaper } = useWallpaperStore();
  const { openSpotlight } = useOSStore();
  const [themeSubmenu, setThemeSubmenu] = useState(false);

  const close = useCallback(() => {
    setMenu((m) => ({ ...m, open: false }));
    setThemeSubmenu(false);
  }, []);

  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      // Only on the desktop background (not inside windows or dock)
      const target = e.target as HTMLElement;
      if (target.closest(".window-frame") || target.closest(".glass[class*='dock']") || target.closest("[data-no-context]")) return;
      e.preventDefault();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const menuW = 220;
      const menuH = 200;
      const x = Math.min(e.clientX, vw - menuW - 8);
      const y = Math.min(e.clientY, vh - menuH - 8);
      setThemeSubmenu(false);
      setMenu({ x, y, open: true });
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("contextmenu", onContext);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("contextmenu", onContext);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  function run(fn: () => void) {
    close();
    fn();
  }

  const ITEMS: MenuItem[] = [
    {
      label: "Open Terminal",
      icon: <Terminal size={13} />,
      action: () => run(() => openApp("terminal")),
    },
    {
      label: "Spotlight Search",
      icon: <Search size={13} />,
      action: () => run(openSpotlight),
    },
    {
      label: "Change Theme",
      icon: <Palette size={13} />,
      action: () => setThemeSubmenu((v) => !v),
      divider: true,
    },
    {
      label: "About NebulaOS",
      icon: <Info size={13} />,
      action: () => run(() => {
        openApp("settings");
        toast("NebulaOS", "Version 1.0.0 · build 2025.05.22", "info");
      }),
    },
    {
      label: "Refresh Desktop",
      icon: <RefreshCw size={13} />,
      action: () => run(() => toast("Desktop", "Refreshed.", "success")),
    },
  ];

  return (
    <AnimatePresence>
      {menu.open && (
        <motion.div
          ref={ref}
          className="glass fixed"
          data-no-context
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.12 } }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          style={{
            left: menu.x,
            top: menu.y,
            zIndex: 9800,
            minWidth: 210,
            borderRadius: 12,
            padding: "4px",
            background: "rgba(6,8,22,0.94)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {ITEMS.map((item, i) => (
            <div key={i}>
              {i > 0 && item.divider && (
                <div
                  className="my-1 mx-2"
                  style={{ height: 1, background: "rgba(255,255,255,0.06)" }}
                />
              )}
              <button
                onClick={item.action}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-sm hover:bg-white/10"
                style={{
                  color: item.danger ? "#EF4444" : "var(--text-secondary)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <span style={{ color: item.danger ? "#EF4444" : "var(--text-muted)" }}>
                  {item.icon}
                </span>
                {item.label}
                {item.label === "Change Theme" && (
                  <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>▶</span>
                )}
              </button>

              {/* Theme submenu */}
              {item.label === "Change Theme" && themeSubmenu && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-1 mx-2 mb-1 rounded-lg overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => run(() => {
                        setTheme(t.id);
                        const match = PRESETS.find((p) => p.id === t.id);
                        if (match) setWallpaper(t.id);
                        toast("Theme", `Switched to ${t.name}`, "success");
                      })}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-white/10 text-xs"
                      style={{ color: activeThemeId === t.id ? t.accentPrimary : "var(--text-secondary)" }}
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          background: t.accentPrimary,
                          boxShadow: activeThemeId === t.id ? `0 0 6px ${t.accentPrimary}` : "none",
                        }}
                      />
                      {t.name}
                      {activeThemeId === t.id && (
                        <span className="ml-auto">✓</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
