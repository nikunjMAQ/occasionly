import { create } from "zustand";
import { OccasionEvent } from "@/types/event";

interface UIStore {
  addReminderOpen: boolean;
  commandPaletteOpen: boolean;
  settingsOpen: boolean;
  editingEvent: OccasionEvent | null;
  openAddReminder: () => void;
  closeAddReminder: () => void;
  openEditReminder: (event: OccasionEvent) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  addReminderOpen: false,
  commandPaletteOpen: false,
  settingsOpen: false,
  editingEvent: null,
  openAddReminder: () => set({ addReminderOpen: true, editingEvent: null }),
  closeAddReminder: () => set({ addReminderOpen: false, editingEvent: null }),
  openEditReminder: (event) => set({ addReminderOpen: true, editingEvent: event }),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  setSettingsOpen: (open: boolean) => set({ settingsOpen: open }),
}));
