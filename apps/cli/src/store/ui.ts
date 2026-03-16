import { create } from 'zustand';

type Overlay = 'none' | 'settings' | 'channels' | 'command-palette';

interface UIState {
  sidebarVisible: boolean;
  activeOverlay: Overlay;
  toggleSidebar: () => void;
  setOverlay: (overlay: Overlay) => void;
  closeOverlay: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarVisible: false,
  activeOverlay: 'none',
  toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
  setOverlay: (overlay) => set({ activeOverlay: overlay }),
  closeOverlay: () => set({ activeOverlay: 'none' }),
}));
