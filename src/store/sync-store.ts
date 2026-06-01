import { create } from "zustand";

export type SyncState = "syncing" | "synced" | "offline" | "guest" | "failed";

interface SyncStore {
  syncState: SyncState;
  pendingCount: number;
  lastSyncTime: number | null;
  setSyncState: (state: SyncState) => void;
  setPendingCount: (count: number) => void;
  setLastSyncTime: (time: number | null) => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
  syncState: "guest",
  pendingCount: 0,
  lastSyncTime: null,
  setSyncState: (state) => set({ syncState: state }),
  setPendingCount: (count) => set({ pendingCount: count }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
}));
