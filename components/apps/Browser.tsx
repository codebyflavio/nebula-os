"use client";
import { useState, useCallback } from "react";
import { AppProps } from "@/types";
import {
  Search, ExternalLink, Globe, ArrowLeft,
  Star, Clock, Trash2, Plus,
} from "lucide-react";

interface HistoryEntry {
  url: string;
  title: string;
  favicon: string;
  visitedAt: number;
}

interface Bookmark {
  id: string;
  url: string;
  title: string;
  favicon: string;
}

const SUGGESTIONS = [
  { label: "GitHub",        url: "https://github.com",              emoji: "🐙" },
  { label: "YouTube",       url: "https://youtube.com",             emoji: "▶️" },
  { label: "Wikipedia",     url: "https://en.wikipedia.org",        emoji: "📖" },
  { label: "Google",        url: "https://google.com",              emoji: "🔍" },
  { label: "Twitter / X",   url: "https://x.com",                   emoji: "𝕏"  },
  { label: "Reddit",        url: "https://reddit.com",              emoji: "🤖" },
  { label: "Hacker News",   url: "https://news.ycombinator.com",    emoji: "🟠" },
  { label: "CodePen",       url: "https://codepen.io",              emoji: "✏️" },
  { label: "MDN Docs",      url: "https://developer.mozilla.org",   emoji: "📚" },
  { label: "Vercel",        url: "https://vercel.com",              emoji: "▲"  },
  { label: "Excalidraw",    url: "https://excalidraw.com",          emoji: "🎨" },
  { label: "ChatGPT",       url: "https://chat.openai.com",         emoji: "🤖" },
];

function getFavicon(url: string) {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return "";
  }
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return url; }
}

function resolveUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  if (t.includes(".") && !t.includes(" ")) return "https://" + t;
  return `https://duckduckgo.com/?q=${encodeURIComponent(t)}`;
}

// ── Launched screen ────────────────────────────────────────
function LaunchedCard({ url, onBack }: { url: string; onBack: () => void }) {
  const domain = getDomain(url);
  const favicon = getFavicon(url);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
      {/* Site card */}
      <div
        className="flex flex-col items-center gap-4 w-full max-w-sm p-8 rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--glass-border)",
        }}
      >
        {/* Favicon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          {favicon ? (
            <img src={favicon} alt="" width={32} height={32} className="w-8 h-8" />
          ) : (
            <Globe size={28} style={{ color: "var(--text-muted)" }} />
          )}
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <span
            className="text-base font-semibold"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
          >
            {domain}
          </span>
          <span
            className="text-xs break-all max-w-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {url.length > 60 ? url.slice(0, 60) + "…" : url}
          </span>
        </div>

        {/* Info pill */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
          style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", color: "var(--accent-indigo)" }}
        >
          <ExternalLink size={12} />
          Aberto no browser real
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs transition-colors hover:bg-white/10"
          style={{ color: "var(--text-muted)", border: "1px solid var(--glass-border)" }}
        >
          ← Voltar
        </button>
        <button
          onClick={() => window.open(url, "_blank")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
          style={{ background: "var(--accent-indigo)", color: "#fff" }}
        >
          <ExternalLink size={12} />
          Abrir novamente
        </button>
      </div>

      <p className="text-xs text-center max-w-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
        Sites modernos bloqueiam incorporação em iframes por segurança.
        O NebulaOS Browser abre no seu browser real.
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────
export default function Browser({ windowId }: AppProps) {
  const [input, setInput]         = useState("");
  const [launched, setLaunched]   = useState<string | null>(null);
  const [history, setHistory]     = useState<HistoryEntry[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tab, setTab]             = useState<"home" | "history" | "bookmarks">("home");

  const navigate = useCallback((raw: string) => {
    const url = resolveUrl(raw);
    if (!url) return;

    // Add to history
    setHistory((h) => [
      { url, title: getDomain(url), favicon: getFavicon(url), visitedAt: Date.now() },
      ...h.filter((e) => e.url !== url).slice(0, 19),
    ]);

    // Open in new tab
    window.open(url, "_blank", "noopener,noreferrer");
    setLaunched(url);
    setInput("");
  }, []);

  function addBookmark(url: string) {
    if (bookmarks.find((b) => b.url === url)) return;
    setBookmarks((b) => [...b, {
      id: Math.random().toString(36).slice(2),
      url,
      title: getDomain(url),
      favicon: getFavicon(url),
    }]);
  }

  function removeBookmark(id: string) {
    setBookmarks((b) => b.filter((bm) => bm.id !== id));
  }

  const filteredSuggestions = input.trim()
    ? SUGGESTIONS.filter(
        (s) =>
          s.label.toLowerCase().includes(input.toLowerCase()) ||
          s.url.includes(input.toLowerCase())
      )
    : SUGGESTIONS;

  return (
    <div className="flex flex-col h-full" style={{ background: "rgba(3,5,18,0.98)" }}>

      {/* ── Toolbar ── */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b flex-shrink-0"
        style={{ borderColor: "var(--glass-border)", background: "rgba(6,8,24,0.7)" }}
      >
        {/* Tab pills */}
        <div className="flex items-center gap-1">
          {([
            { id: "home",      label: "Home" },
            { id: "history",   label: "Histórico" },
            { id: "bookmarks", label: "Favoritos" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setLaunched(null); }}
              className="px-2.5 py-1 rounded-lg text-xs transition-colors"
              style={{
                background: tab === t.id ? "rgba(99,102,241,0.2)" : "transparent",
                color: tab === t.id ? "var(--accent-indigo)" : "var(--text-muted)",
                border: tab === t.id ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* URL bar */}
        <div
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}
        >
          <Search size={11} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setTab("home"); setLaunched(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") navigate(input); }}
            onFocus={() => setLaunched(null)}
            placeholder="Pesquisar ou digitar endereço…"
            className="flex-1 bg-transparent outline-none text-xs selectable"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
          />
          {input && (
            <button
              onClick={() => navigate(input)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs"
              style={{ background: "var(--accent-indigo)", color: "#fff" }}
            >
              <ExternalLink size={10} /> Ir
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Launched confirmation */}
        {launched && <LaunchedCard url={launched} onBack={() => setLaunched(null)} />}

        {/* Home */}
        {!launched && tab === "home" && (
          <div className="flex flex-col gap-6 p-5">
            {/* Hero search */}
            <div className="flex flex-col items-center gap-4 py-4">
              <Globe size={32} strokeWidth={1.2} style={{ color: "var(--accent-indigo)", opacity: 0.5 }} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Links abrem no seu browser real
              </p>
            </div>

            {/* Suggestions grid */}
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                {input ? "RESULTADOS" : "SUGESTÕES"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {filteredSuggestions.map((s) => (
                  <button
                    key={s.url}
                    onClick={() => navigate(s.url)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-white/8 group"
                    style={{ border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.03)" }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{s.emoji}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate" style={{ color: "var(--text-secondary)" }}>
                        {s.label}
                      </span>
                      <span className="text-xs truncate" style={{ color: "var(--text-muted)", fontSize: 10 }}>
                        {getDomain(s.url)}
                      </span>
                    </div>
                    <ExternalLink
                      size={10}
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      style={{ color: "var(--accent-cyan)" }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent */}
            {history.length > 0 && !input && (
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                  RECENTES
                </p>
                <div className="flex flex-col gap-1">
                  {history.slice(0, 5).map((h) => (
                    <button
                      key={h.url}
                      onClick={() => navigate(h.url)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      >
                        <img src={h.favicon} alt="" width={16} height={16} className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <span className="flex-1 text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                        {h.title}
                      </span>
                      <span className="text-xs truncate max-w-[140px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 10 }}>
                        {getDomain(h.url)}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); addBookmark(h.url); }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all"
                        style={{ color: "var(--text-muted)" }}
                        title="Adicionar aos favoritos"
                      >
                        <Star size={11} />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History tab */}
        {!launched && tab === "history" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                HISTÓRICO ({history.length})
              </p>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                  style={{ color: "#EF4444" }}
                >
                  <Trash2 size={11} /> Limpar
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2" style={{ color: "var(--text-muted)" }}>
                <Clock size={28} style={{ opacity: 0.2 }} />
                <span className="text-sm">Sem histórico</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(h.url)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <img src={h.favicon} alt="" width={16} height={16} className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {h.title}
                      </span>
                      <span className="text-xs truncate" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 10 }}>
                        {h.url}
                      </span>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)", fontSize: 10 }}>
                      {new Date(h.visitedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); addBookmark(h.url); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all flex-shrink-0"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Star size={11} />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookmarks tab */}
        {!launched && tab === "bookmarks" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                FAVORITOS ({bookmarks.length})
              </p>
            </div>
            {bookmarks.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2" style={{ color: "var(--text-muted)" }}>
                <Star size={28} style={{ opacity: 0.2 }} />
                <span className="text-sm">Sem favoritos</span>
                <span className="text-xs text-center max-w-xs">
                  Clique na ⭐ ao lado de um site no histórico para adicionar
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {bookmarks.map((bm) => (
                  <button
                    key={bm.id}
                    onClick={() => navigate(bm.url)}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group relative"
                    style={{ border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.03)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <img src={bm.favicon} alt="" width={20} height={20} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate" style={{ color: "var(--text-secondary)" }}>
                        {bm.title}
                      </span>
                      <span className="text-xs truncate" style={{ color: "var(--text-muted)", fontSize: 10 }}>
                        {getDomain(bm.url)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeBookmark(bm.id); }}
                      className="absolute top-1.5 right-1.5 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                      style={{ color: "#EF4444" }}
                    >
                      <Trash2 size={10} />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
