"use client";
import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { create } from "zustand";
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from "lucide-react";

type ToastType = "info" | "success" | "warning" | "error";

interface ToastItem {
  id: string;
  title: string;
  body?: string;
  type: ToastType;
}

interface ToastStore {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (t) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { ...t, id }].slice(-5) }));
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(title: string, body?: string, type: ToastType = "info") {
  useToastStore.getState().push({ title, body, type });
}

const CONFIG: Record<ToastType, { Icon: any; color: string; bg: string }> = {
  info:    { Icon: Info,          color: "var(--accent-cyan)",    bg: "rgba(6,182,212,0.12)" },
  success: { Icon: CheckCircle,   color: "#22C55E",               bg: "rgba(34,197,94,0.12)" },
  warning: { Icon: AlertTriangle, color: "#F59E0B",               bg: "rgba(245,158,11,0.12)" },
  error:   { Icon: AlertCircle,   color: "#EF4444",               bg: "rgba(239,68,68,0.12)" },
};

const AUTO_DISMISS = 4000;

function ToastCard({ item }: { item: ToastItem }) {
  const remove = useToastStore((s) => s.remove);
  const { Icon, color, bg } = CONFIG[item.type];

  useEffect(() => {
    const t = setTimeout(() => remove(item.id), AUTO_DISMISS);
    return () => clearTimeout(t);
  }, [item.id, remove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.88, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="glass flex items-start gap-3 px-4 py-3 rounded-2xl pointer-events-auto w-80 max-w-[calc(100vw-24px)]"
      style={{
        background: "rgba(8,10,28,0.92)",
        borderLeft: `3px solid ${color}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--glass-border)`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-lg mt-0.5 flex-shrink-0"
        style={{ width: 28, height: 28, background: bg }}
      >
        <Icon size={14} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {item.title}
        </p>
        {item.body && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {item.body}
          </p>
        )}
      </div>
      <button
        onClick={() => remove(item.id)}
        className="p-0.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
        style={{ color: "var(--text-muted)" }}
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="fixed flex flex-col gap-2 items-end pointer-events-none"
      style={{ bottom: "calc(var(--dock-h) + 12px)", right: 12, zIndex: 9500 }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastCard key={t.id} item={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
