"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/stores/osStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { Bell, X, CheckCheck, Info, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { NotificationType } from "@/types";

const TYPE_CONFIG: Record<NotificationType, { Icon: any; color: string }> = {
  info:    { Icon: Info,          color: "var(--accent-cyan)" },
  success: { Icon: CheckCircle,   color: "#22C55E" },
  warning: { Icon: AlertTriangle, color: "#F59E0B" },
  error:   { Icon: AlertCircle,   color: "#EF4444" },
};

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function NotificationCenter() {
  const { notifPanelOpen, closeNotifPanel } = useOSStore();
  const { notifications, markAllRead, dismiss, clearAll } = useNotificationStore();

  return (
    <AnimatePresence>
      {notifPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0"
            style={{ zIndex: 7999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNotifPanel}
          />

          {/* Panel */}
          <motion.div
            className="notif-panel glass"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="flex items-center gap-2">
                <Bell size={14} style={{ color: "var(--accent-indigo)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Notifications
                </span>
              </div>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllRead}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10 text-xs"
                      style={{ color: "var(--text-muted)" }}
                      title="Mark all read"
                    >
                      <CheckCheck size={13} />
                    </button>
                    <button
                      onClick={clearAll}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10 text-xs"
                      style={{ color: "var(--text-muted)" }}
                      title="Clear all"
                    >
                      <X size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* List */}
            {notifications.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 gap-3"
                style={{ color: "var(--text-muted)" }}
              >
                <Bell size={32} style={{ opacity: 0.2 }} />
                <span className="text-sm">No notifications</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {notifications.map((n) => {
                    const { Icon, color } = TYPE_CONFIG[n.type];
                    return (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                        className="glass-light rounded-xl p-3 relative"
                        style={{
                          borderLeft: `2px solid ${color}`,
                          opacity: n.read ? 0.6 : 1,
                        }}
                      >
                        <button
                          onClick={() => dismiss(n.id)}
                          className="absolute top-2 right-2 p-0.5 rounded transition-colors hover:bg-white/10"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <X size={11} />
                        </button>
                        <div className="flex items-start gap-2 pr-5">
                          <Icon size={14} style={{ color, flexShrink: 0, marginTop: 1 }} />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span
                              className="text-xs font-semibold truncate"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {n.title}
                            </span>
                            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                              {n.body}
                            </span>
                            <span
                              className="text-xs mt-1"
                              style={{ color: "var(--text-muted)", fontSize: 10 }}
                            >
                              {timeAgo(n.timestamp)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
