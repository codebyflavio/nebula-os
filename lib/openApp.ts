import { useWindowStore } from "@/stores/windowStore";
import { getApp } from "./apps";

let windowCounter = 0;

export function openApp(appId: string) {
  const app = getApp(appId);
  if (!app) return;

  const store = useWindowStore.getState();

  // singleton: bring existing window to front
  if (app.singleton) {
    const existing = store.windows.find((w) => w.appId === appId);
    if (existing) {
      if (existing.isMinimized) store.restoreWindow(existing.id);
      else store.focusWindow(existing.id);
      return;
    }
  }

  windowCounter += 1;
  const id = `${appId}-${windowCounter}`;
  const offset = ((windowCounter - 1) % 6) * 24;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const menuH = 28;
  const dockH = 68;

  const w = Math.min(app.defaultWidth, vw - 80);
  const h = Math.min(app.defaultHeight, vh - menuH - dockH - 40);
  const x = Math.max(40, Math.floor((vw - w) / 2) + offset);
  const y = Math.max(menuH + 8, Math.floor((vh - menuH - dockH - h) / 2) + offset);

  store.openWindow({
    id,
    appId,
    title: app.name,
    icon: app.icon,
    x,
    y,
    width: w,
    height: h,
    minWidth: app.minWidth ?? 280,
    minHeight: app.minHeight ?? 200,
  });
}
