"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/stores/osStore";
import { APP_REGISTRY } from "@/lib/apps";
import { openApp } from "@/lib/openApp";
import { Search, Terminal, Folder, Globe, FileText, Music, Calendar, Settings, LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  terminal: Terminal,
  folder: Folder,
  globe: Globe,
  "file-text": FileText,
  music: Music,
  calendar: Calendar,
  settings: Settings,
};

interface Result {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  type: "app";
}

function buildResults(query: string): Result[] {
  const q = query.toLowerCase().trim();
  if (!q) return APP_REGISTRY.map((a) => ({
    id: a.id,
    label: a.name,
    sublabel: "Application",
    icon: a.icon,
    type: "app" as const,
  }));
  return APP_REGISTRY
    .filter((a) => a.name.toLowerCase().includes(q) || a.id.includes(q))
    .map((a) => ({
      id: a.id,
      label: a.name,
      sublabel: "Application",
      icon: a.icon,
      type: "app" as const,
    }));
}

export default function Spotlight() {
  const { spotlightOpen, closeSpotlight } = useOSStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = buildResults(query);

  useEffect(() => {
    if (spotlightOpen) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [spotlightOpen]);

  // Global keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === "Space") {
        e.preventDefault();
        useOSStore.getState().toggleSpotlight();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { closeSpotlight(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && results[selected]) { launch(results[selected]); }
  }

  function launch(r: Result) {
    openApp(r.id);
    closeSpotlight();
  }

  return (
    <AnimatePresence>
      {spotlightOpen && (
        <motion.div
          className="spotlight-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeSpotlight(); }}
        >
          <motion.div
            className="glass selectable"
            initial={{ opacity: 0, scale: 0.94, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{
              width: 600,
              maxWidth: "calc(100vw - 40px)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-3 px-5"
              style={{
                height: 56,
                borderBottom: results.length > 0 ? "1px solid var(--glass-border)" : "none",
              }}
            >
              <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search apps, files, commands…"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                }}
              />
              <kbd
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--glass-border)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div style={{ maxHeight: 320, overflowY: "auto", padding: "6px 8px" }}>
                {results.map((r, i) => {
                  const Icon = ICONS[r.icon] ?? Terminal;
                  return (
                    <button
                      key={r.id}
                      onClick={() => launch(r)}
                      onMouseEnter={() => setSelected(i)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors"
                      style={{
                        background: i === selected ? "rgba(99,102,241,0.18)" : "transparent",
                        color: "var(--text-primary)",
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{
                          width: 32,
                          height: 32,
                          background: i === selected
                            ? "rgba(99,102,241,0.25)"
                            : "rgba(255,255,255,0.06)",
                        }}
                      >
                        <Icon
                          size={16}
                          style={{
                            color: i === selected ? "var(--accent-indigo)" : "var(--text-secondary)",
                          }}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">{r.label}</span>
                        <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                          {r.sublabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {results.length === 0 && query && (
              <div
                className="flex flex-col items-center justify-center py-10"
                style={{ color: "var(--text-muted)" }}
              >
                <Search size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                <span className="text-sm">No results for "{query}"</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
