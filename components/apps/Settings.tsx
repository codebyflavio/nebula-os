"use client";
import { useState, useRef } from "react";
import { AppProps } from "@/types";
import { useThemeStore } from "@/stores/themeStore";
import { useWallpaperStore, PRESETS, WallpaperPreset } from "@/stores/wallpaperStore";
import { CheckCircle, Upload, Link, Image, RefreshCw } from "lucide-react";

const SECTIONS = [
  { id: "wallpaper",   label: "Wallpaper" },
  { id: "appearance",  label: "Appearance" },
  { id: "about",       label: "About" },
];

const PRESET_GROUPS = [
  { label: "Gradients", ids: ["nebula","aurora","crimson","solar","ocean","rose","forest","galaxy"] },
  { label: "Solid",     ids: ["black","space","obsidian","slate","charcoal","dark-green"] },
  { label: "Patterns",  ids: ["pattern-grid","pattern-dots","pattern-lines","pattern-circuit"] },
];

function WallpaperThumb({ preset, active, onClick }: { preset: WallpaperPreset; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-1.5 group"
      title={preset.name}
    >
      <div
        className="relative w-full rounded-xl overflow-hidden transition-all duration-150"
        style={{
          aspectRatio: "16/9",
          border: active ? "2px solid var(--accent-indigo)" : "2px solid rgba(255,255,255,0.08)",
          boxShadow: active ? "0 0 12px rgba(99,102,241,0.4)" : "none",
        }}
      >
        {/* Thumbnail preview */}
        {preset.type === "image" && preset.imageUrl ? (
          <img
            src={preset.imageUrl}
            alt={preset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full" style={{ background: preset.preview }} />
        )}

        {/* Active check */}
        {active && (
          <div
            className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full"
            style={{ background: "var(--accent-indigo)" }}
          >
            <CheckCircle size={10} color="#fff" />
          </div>
        )}

        {/* Stars overlay for gradients */}
        {preset.type === "gradient" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 70% 15%, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 50% 70%, rgba(255,255,255,0.5), transparent)" }}
          />
        )}
      </div>
      <span className="text-xs text-center truncate" style={{ color: active ? "var(--text-primary)" : "var(--text-muted)" }}>
        {preset.name}
      </span>
    </button>
  );
}

export default function Settings({ windowId }: AppProps) {
  const { themes, activeThemeId, setTheme } = useThemeStore();
  const { activeId, setWallpaper, setCustomImage, customImageUrl } = useWallpaperStore();

  function handleSetTheme(id: string) {
    setTheme(id);
    // Switch wallpaper to matching gradient preset if one exists
    const matchingPreset = PRESETS.find((p) => p.id === id);
    if (matchingPreset) setWallpaper(id);
  }
  const [section, setSection] = useState("wallpaper");
  const [urlInput, setUrlInput] = useState(customImageUrl);
  const [urlMode, setUrlMode] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUrlApply() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    // Basic URL validation
    try { new URL(trimmed); } catch { setUrlError(true); return; }
    setUrlError(false);
    setCustomImage(trimmed);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCustomImage(dataUrl);
      setUrlInput("(uploaded image)");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex h-full" style={{ background: "rgba(4,6,20,0.97)" }}>
      {/* ── Sidebar ── */}
      <div
        className="flex flex-col flex-shrink-0"
        style={{
          width: 168,
          borderRight: "1px solid var(--glass-border)",
          background: "rgba(8,10,28,0.6)",
          padding: "12px 8px",
        }}
      >
        <p className="px-3 mb-3 text-xs font-semibold tracking-wider" style={{ color: "var(--text-muted)" }}>
          SETTINGS
        </p>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className="w-full text-left px-3 py-2 rounded-xl text-sm transition-colors"
            style={{
              background: section === s.id ? "rgba(99,102,241,0.18)" : "transparent",
              color: section === s.id ? "var(--text-primary)" : "var(--text-secondary)",
              borderLeft: section === s.id ? "2px solid var(--accent-indigo)" : "2px solid transparent",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-5">

        {/* ════ WALLPAPER ════ */}
        {section === "wallpaper" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Wallpaper
            </h2>

            {/* Current preview */}
            <div
              className="w-full rounded-2xl overflow-hidden relative"
              style={{ aspectRatio: "21/9", border: "1px solid var(--glass-border)" }}
            >
              {(() => {
                const p = PRESETS.find((x) => x.id === activeId) ?? PRESETS[0];
                if (p.type === "image" && p.imageUrl) {
                  return <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />;
                }
                return <div className="w-full h-full" style={{ background: p.preview }} />;
              })()}
              <div
                className="absolute bottom-0 left-0 right-0 px-3 py-2 text-xs font-medium"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {PRESETS.find((x) => x.id === activeId)?.name ?? "Custom"}
              </div>
            </div>

            {/* Custom image section */}
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                IMAGEM PERSONALIZADA
              </p>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors hover:bg-white/10"
                  style={{ border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}
                >
                  <Upload size={12} /> Carregar arquivo
                </button>
                <button
                  onClick={() => setUrlMode((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors hover:bg-white/10"
                  style={{
                    border: `1px solid ${urlMode ? "rgba(99,102,241,0.4)" : "var(--glass-border)"}`,
                    color: urlMode ? "var(--accent-indigo)" : "var(--text-secondary)",
                    background: urlMode ? "rgba(99,102,241,0.1)" : "transparent",
                  }}
                >
                  <Link size={12} /> URL
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

              {urlMode && (
                <div className="flex gap-2">
                  <input
                    value={urlInput}
                    onChange={(e) => { setUrlInput(e.target.value); setUrlError(false); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleUrlApply(); }}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="flex-1 px-3 py-2 rounded-xl text-xs outline-none selectable"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${urlError ? "#EF4444" : "var(--glass-border)"}`,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                  <button
                    onClick={handleUrlApply}
                    className="px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:brightness-110"
                    style={{ background: "var(--accent-indigo)", color: "#fff" }}
                  >
                    Aplicar
                  </button>
                </div>
              )}
              {urlError && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>URL inválida</p>
              )}
            </div>

            {/* Preset groups */}
            {PRESET_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                  {group.label.toUpperCase()}
                </p>
                <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
                  {group.ids.map((id) => {
                    const preset = PRESETS.find((p) => p.id === id);
                    if (!preset) return null;
                    return (
                      <WallpaperThumb
                        key={id}
                        preset={preset}
                        active={activeId === id}
                        onClick={() => setWallpaper(id)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════ APPEARANCE ════ */}
        {section === "appearance" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Appearance
            </h2>

            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                COLOR THEME
              </p>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSetTheme(t.id)}
                    className="relative flex flex-col rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
                    style={{
                      border: activeThemeId === t.id
                        ? `2px solid ${t.accentPrimary}`
                        : "2px solid var(--glass-border)",
                    }}
                  >
                    <div className="h-16 w-full" style={{ background: t.bg, position: "relative", overflow: "hidden" }}>
                      <div className="absolute inset-0" style={{ background: t.wallpaperGradient, opacity: 0.8 }} />
                      <div className="absolute bottom-2 left-2 right-2 h-4 rounded-md" style={{ background: t.glassBg, border: `1px solid ${t.glassBorder}` }} />
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between" style={{ background: "rgba(8,10,28,0.8)" }}>
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{t.name}</span>
                      {activeThemeId === t.id && <CheckCircle size={12} style={{ color: t.accentPrimary }} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                ACCENT COLORS
              </p>
              <div className="flex gap-4">
                {[
                  { label: "Primary",   color: themes.find((t) => t.id === activeThemeId)?.accentPrimary },
                  { label: "Secondary", color: themes.find((t) => t.id === activeThemeId)?.accentSecondary },
                  { label: "Tertiary",  color: themes.find((t) => t.id === activeThemeId)?.accentTertiary },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full" style={{ background: s.color, boxShadow: `0 0 16px ${s.color}60` }} />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ ABOUT ════ */}
        {section === "about" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              About NebulaOS
            </h2>
            <div className="flex flex-col gap-2">
              {[
                ["Version",   "1.0.0"],
                ["Build",     "2025.05.22"],
                ["Runtime",   "Next.js 14 + React 18"],
                ["Animation", "Framer Motion 12"],
                ["State",     "Zustand 5"],
                ["Styling",   "Tailwind CSS 3"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}
                >
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>{k}</span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
