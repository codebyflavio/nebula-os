"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useNotificationStore } from "@/stores/notificationStore";
import Wallpaper from "./Wallpaper";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import Spotlight from "./Spotlight";
import NotificationCenter from "./NotificationCenter";
import BootScreen from "./BootScreen";
import ToastContainer from "./Toast";
import ContextMenu from "./ContextMenu";
import SnapOverlay from "./SnapOverlay";
import DesktopIcons from "./DesktopIcons";
import WindowContainer from "@/components/windows/WindowContainer";
import { toast } from "./Toast";

export default function Desktop() {
  const { activeTheme } = useThemeStore();
  const push = useNotificationStore((s) => s.push);

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--nebula-bg", activeTheme.bg);
    root.style.setProperty("--glass-bg", activeTheme.glassBg);
    root.style.setProperty("--glass-border", activeTheme.glassBorder);
    root.style.setProperty("--accent-indigo", activeTheme.accentPrimary);
    root.style.setProperty("--accent-cyan", activeTheme.accentSecondary);
    root.style.setProperty("--accent-purple", activeTheme.accentTertiary);
  }, [activeTheme]);

  // Boot notification + toast
  useEffect(() => {
    const t1 = setTimeout(() => {
      push({
        title: "Welcome to NebulaOS",
        body: "System ready. Open the Terminal to get started.",
        type: "success",
        appId: "os",
      });
      toast("System ready", "Open the Terminal to get started.", "success");
    }, 2800); // after boot screen
    return () => clearTimeout(t1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Boot splash — renders above everything */}
      <BootScreen />

      <div
        className="relative overflow-hidden select-none"
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* Layer 0 — animated wallpaper */}
        <Wallpaper />

        {/* Layer 1 — menu bar */}
        <MenuBar />

        {/* Layer 2 — desktop icons */}
        <DesktopIcons />

        {/* Layer 3 — snap preview */}
        <SnapOverlay />

        {/* Layer 4 — windows */}
        <WindowContainer />

        {/* Layer 4 — dock */}
        <Dock />

        {/* Layer 5 — context menu */}
        <ContextMenu />

        {/* Layer 6 — spotlight */}
        <Spotlight />

        {/* Layer 7 — notification center */}
        <NotificationCenter />

        {/* Layer 8 — toasts */}
        <ToastContainer />
      </div>
    </>
  );
}
