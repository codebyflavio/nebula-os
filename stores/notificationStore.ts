import { create } from "zustand";
import { Notification, NotificationType } from "@/types";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  push: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  push: (n) => {
    const notif: Notification = {
      ...n,
      id: genId(),
      timestamp: Date.now(),
      read: false,
    };
    set((s) => ({
      notifications: [notif, ...s.notifications].slice(0, 50),
      unreadCount: s.unreadCount + 1,
    }));
    // Mirror to toast system (lazy import avoids circular dep)
    import("@/components/os/Toast").then(({ toast }) => {
      toast(n.title, n.body, n.type);
    }).catch(() => {});
  },

  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  dismiss: (id) =>
    set((s) => {
      const notifications = s.notifications.filter((n) => n.id !== id);
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

// Convenience helper for use outside React
export function notify(
  title: string,
  body: string,
  type: NotificationType = "info",
  appId?: string
) {
  useNotificationStore.getState().push({ title, body, type, appId });
}
