"use client";
import { useState, useEffect } from "react";
import { useOSStore } from "@/stores/osStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useThemeStore } from "@/stores/themeStore";
import { Search, Bell, Wifi, Volume2, Battery } from "lucide-react";
import { openApp } from "@/lib/openApp";

export default function MenuBar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [battery] = useState(87);
  const { toggleSpotlight, toggleNotifPanel } = useOSStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const { activeTheme } = useThemeStore();

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-no-context
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "var(--menubar-h)",
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        justifyContent: "space-between",
        background: "rgba(2,4,18,0.88)",
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* ── Left: logo + app menu ── */}
      <div className="flex items-center gap-4">
        {/* Logotype */}
        <button
          onClick={toggleSpotlight}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          title="Spotlight (Ctrl+Space)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L4 7v10l8 5 8-5V7L12 2Z"
              stroke={activeTheme.accentPrimary}
              strokeWidth="1.5"
              fill={`${activeTheme.accentPrimary}22`}
            />
            <circle cx="12" cy="12" r="2.5" fill={activeTheme.accentPrimary} />
          </svg>
          <span
            className="text-xs font-bold tracking-[0.14em]"
            style={{ color: "var(--text-primary)", fontSize: 10 }}
          >
            NEBULA
          </span>
        </button>

        {/* App shortcuts */}
        {[
          { label: "Terminal", id: "terminal" },
          { label: "Files", id: "files" },
          { label: "Browser", id: "browser" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => openApp(item.id)}
            className="text-xs transition-colors hover:text-white"
            style={{ color: "var(--text-muted)", fontSize: 11 }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Right: system tray ── */}
      <div className="flex items-center gap-0.5">
        {/* Wifi */}
        <div className="px-1.5 py-0.5" style={{ color: "var(--text-muted)" }}>
          <Wifi size={11} />
        </div>

        {/* Volume */}
        <div className="px-1.5 py-0.5" style={{ color: "var(--text-muted)" }}>
          <Volume2 size={11} />
        </div>

        {/* Battery */}
        <div className="flex items-center gap-1 px-1.5 py-0.5">
          <div
            className="relative flex items-center"
            style={{ width: 20, height: 11 }}
          >
            <div
              className="w-full h-full rounded-sm"
              style={{ border: "1px solid rgba(255,255,255,0.25)", padding: "1px" }}
            >
              <div
                className="h-full rounded-sm"
                style={{
                  width: `${battery}%`,
                  background: battery > 20 ? "#22C55E" : "#EF4444",
                }}
              />
            </div>
            {/* battery tip */}
            <div
              className="absolute -right-0.5 rounded-r-sm"
              style={{ width: 2, height: 5, background: "rgba(255,255,255,0.2)", top: "50%", transform: "translateY(-50%)" }}
            />
          </div>
          <span style={{ color: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }}>
            {battery}%
          </span>
        </div>

        {/* Spotlight */}
        <button
          onClick={toggleSpotlight}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors hover:bg-white/10"
          style={{ color: "var(--text-secondary)" }}
          title="Spotlight (Ctrl+Space)"
        >
          <Search size={11} />
        </button>

        {/* Notification bell */}
        <button
          onClick={toggleNotifPanel}
          className="relative flex items-center px-1.5 py-0.5 rounded-md transition-colors hover:bg-white/10"
          style={{ color: "var(--text-secondary)" }}
          title="Notifications"
        >
          <Bell size={11} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-white"
              style={{
                width: 11, height: 11, fontSize: 7,
                background: activeTheme.accentPrimary,
                fontWeight: 700,
              }}
            >
              {unreadCount > 9 ? "9" : unreadCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-3 mx-1.5" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Date + time */}
        <div
          className="flex items-center gap-1.5"
          style={{ color: "var(--text-secondary)", fontSize: 11 }}
        >
          <span style={{ color: "var(--text-muted)" }}>{date}</span>
          <span
            className="font-semibold tabular-nums"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", letterSpacing: "0.02em" }}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
