import { create } from "zustand";

interface OSStore {
  spotlightOpen: boolean;
  notifPanelOpen: boolean;
  activeDesktop: number;
  bootComplete: boolean;

  openSpotlight: () => void;
  closeSpotlight: () => void;
  toggleSpotlight: () => void;
  toggleNotifPanel: () => void;
  closeNotifPanel: () => void;
  setDesktop: (n: number) => void;
  setBootComplete: () => void;
}

export const useOSStore = create<OSStore>((set) => ({
  spotlightOpen: false,
  notifPanelOpen: false,
  activeDesktop: 1,
  bootComplete: false,

  openSpotlight: () => set({ spotlightOpen: true, notifPanelOpen: false }),
  closeSpotlight: () => set({ spotlightOpen: false }),
  toggleSpotlight: () =>
    set((s) => ({ spotlightOpen: !s.spotlightOpen, notifPanelOpen: false })),
  toggleNotifPanel: () =>
    set((s) => ({ notifPanelOpen: !s.notifPanelOpen, spotlightOpen: false })),
  closeNotifPanel: () => set({ notifPanelOpen: false }),
  setDesktop: (n) => set({ activeDesktop: n }),
  setBootComplete: () => set({ bootComplete: true }),
}));
