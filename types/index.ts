// ── Window ──────────────────────────────────────────────
export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  /** snapshot before maximise */
  restoreRect?: { x: number; y: number; width: number; height: number };
}

// ── App Registry ─────────────────────────────────────────
export interface AppDefinition {
  id: string;
  name: string;
  icon: string;                 // lucide / react-icon name or URL
  component: React.ComponentType<AppProps>;
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
  /** Whether the app can have multiple windows open at once */
  singleton?: boolean;
}

export interface AppProps {
  windowId: string;
}

// ── File System ──────────────────────────────────────────
export type FSNodeType = "file" | "directory";

export interface FSNode {
  id: string;
  name: string;
  type: FSNodeType;
  parentId: string | null;
  content?: string;             // for files
  children?: string[];          // ids — for directories
  createdAt: number;
  updatedAt: number;
  icon?: string;
}

// ── Notifications ────────────────────────────────────────
export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  appId?: string;
  icon?: string;
  timestamp: number;
  read: boolean;
}

// ── Themes ───────────────────────────────────────────────
export interface Theme {
  id: string;
  name: string;
  bg: string;
  glassBg: string;
  glassBorder: string;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  wallpaperGradient: string;
}

// ── Desktop ──────────────────────────────────────────────
export interface DesktopIcon {
  id: string;
  appId: string;
  label: string;
  icon: string;
  x: number;
  y: number;
}
