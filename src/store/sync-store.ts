import { create } from "zustand";

export type SyncState = "syncing" | "synced" | "offline" | "guest" | "failed";

interface SyncStore {
  syncState: SyncState;
  pendingCount: number;
  setSyncState: (state: SyncState) => void;
  setPendingCount: (count: number) => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
  syncState: "guest",
  pendingCount: 0,
  setSyncState: (state) => set({ syncState: state }),
  setPendingCount: (count) => set({ pendingCount: count }),
}));
