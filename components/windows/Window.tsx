"use client";
import { useRef, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowStore } from "@/stores/windowStore";
import { getApp } from "@/lib/apps";
import { WindowState } from "@/types";
import { useSnapStore, getSnapZone, snapRect } from "@/components/os/SnapOverlay";
import { APP_COLORS } from "@/lib/apps";

interface Props {
  win: WindowState;
}

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export default function Window({ win }: Props) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeToggle, setPositionAndSize } =
    useWindowStore();
  const frameRef = useRef<HTMLDivElement>(null);
  const app = getApp(win.appId);
  const setZone = useSnapStore((s) => s.setZone);

  // ── Drag with snap detection ────────────────────────────────
  const startDrag = useCallback(
    (e: React.MouseEvent) => {
      if (win.isMaximized) return;
      e.preventDefault();
      focusWindow(win.id);
      const startX = e.clientX - win.x;
      const startY = e.clientY - win.y;
      const el = frameRef.current;
      if (!el) return;

      function onMove(ev: MouseEvent) {
        const menuH = 28;
        const x = Math.max(0, ev.clientX - startX);
        const y = Math.max(menuH, ev.clientY - startY);
        el!.style.left = x + "px";
        el!.style.top = y + "px";
        setZone(getSnapZone(ev.clientX, ev.clientY));
      }

      function onUp(ev: MouseEvent) {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        const zone = getSnapZone(ev.clientX, ev.clientY);
        setZone(null);
        const rect = snapRect(zone);
        if (rect) {
          setPositionAndSize(win.id, rect.x, rect.y, rect.w, rect.h);
          el!.style.left = rect.x + "px";
          el!.style.top = rect.y + "px";
          el!.style.width = rect.w + "px";
          el!.style.height = rect.h + "px";
        } else {
          const menuH = 28;
          const x = Math.max(0, ev.clientX - startX);
          const y = Math.max(menuH, ev.clientY - startY);
          setPositionAndSize(win.id, x, y, win.width, win.height);
        }
      }

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win, focusWindow, setPositionAndSize]
  );

  // ── Resize ───────────────────────────────────────────────────
  const startResize = useCallback(
    (e: React.MouseEvent, dir: ResizeDir) => {
      if (win.isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      focusWindow(win.id);
      const startX = e.clientX;
      const startY = e.clientY;
      const { x, y, width, height, minWidth, minHeight } = win;
      const el = frameRef.current;
      if (!el) return;

      function onMove(ev: MouseEvent) {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let nx = x, ny = y, nw = width, nh = height;

        if (dir.includes("e")) nw = Math.max(minWidth, width + dx);
        if (dir.includes("s")) nh = Math.max(minHeight, height + dy);
        if (dir.includes("w")) {
          nw = Math.max(minWidth, width - dx);
          nx = x + (width - nw);
        }
        if (dir.includes("n")) {
          nh = Math.max(minHeight, height - dy);
          ny = y + (height - nh);
        }

        el!.style.left = nx + "px";
        el!.style.top = ny + "px";
        el!.style.width = nw + "px";
        el!.style.height = nh + "px";
      }

      function onUp(ev: MouseEvent) {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let nx = x, ny = y, nw = width, nh = height;
        if (dir.includes("e")) nw = Math.max(minWidth, width + dx);
        if (dir.includes("s")) nh = Math.max(minHeight, height + dy);
        if (dir.includes("w")) { nw = Math.max(minWidth, width - dx); nx = x + (width - nw); }
        if (dir.includes("n")) { nh = Math.max(minHeight, height - dy); ny = y + (height - nh); }
        setPositionAndSize(win.id, nx, ny, nw, nh);
      }

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win, focusWindow, setPositionAndSize]
  );

  if (!app) return null;
  const AppComponent = app.component;

  return (
    <motion.div
      ref={frameRef}
      className={`window-frame glass ${win.isFocused ? "window-focused" : ""}`}
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        pointerEvents: win.isMinimized ? "none" : undefined,
      }}
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={
        win.isMinimized
          ? { opacity: 0, scale: 0.3, y: "calc(100vh - 100px)", transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }
          : { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 32 } }
      }
      exit={{ opacity: 0, scale: 0.88, y: 16, transition: { duration: 0.15 } }}
      onMouseDown={() => !win.isMinimized && focusWindow(win.id)}
    >
      {/* Resize handles */}
      {(["n","s","e","w","ne","nw","se","sw"] as ResizeDir[]).map((dir) => (
        <div
          key={dir}
          className={`resize-handle resize-${dir}`}
          onMouseDown={(e) => startResize(e, dir)}
        />
      ))}

      {/* Title bar */}
      <div
        className="window-titlebar"
        onMouseDown={startDrag}
        onDoubleClick={() => maximizeToggle(win.id, window.innerWidth, window.innerHeight)}
      >
        {/* Traffic lights */}
        <div className="traffic-light-group flex items-center gap-1.5 no-drag">
          <button
            className="traffic-light close"
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
            title="Close"
          />
          <button
            className="traffic-light min"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
            title="Minimize"
          />
          <button
            className="traffic-light max"
            onClick={(e) => {
              e.stopPropagation();
              maximizeToggle(win.id, window.innerWidth, window.innerHeight);
            }}
            title="Maximize"
          />
        </div>

        {/* Title with colored dot */}
        <div className="flex-1 flex items-center justify-center gap-1.5" style={{ marginLeft: -52 }}>
          {APP_COLORS[win.appId] && (
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: APP_COLORS[win.appId].to,
                boxShadow: `0 0 6px ${APP_COLORS[win.appId].glow}`,
                opacity: win.isFocused ? 1 : 0.4,
              }}
            />
          )}
          <span
            className="text-xs font-medium truncate select-none"
            style={{ color: win.isFocused ? "var(--text-secondary)" : "var(--text-muted)" }}
          >
            {win.title}
          </span>
        </div>
      </div>

      {/* App content */}
      <div className="window-content">
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-full shimmer-bg" />
          }
        >
          <AppComponent windowId={win.id} />
        </Suspense>
      </div>
    </motion.div>
  );
}
