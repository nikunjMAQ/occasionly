import { create } from "zustand";

export type SyncState = "syncing" | "synced" | "offline" | "guest" | "failed";
export type RealtimeStatus = "inactive" | "active" | "connecting" | "error";

interface SyncStore {
  syncState: SyncState;
  pendingCount: number;
  lastSyncTime: number | null;
  realtimeStatus: RealtimeStatus;
  setSyncState: (state: SyncState) => void;
  setPendingCount: (count: number) => void;
  setLastSyncTime: (time: number | null) => void;
  setRealtimeStatus: (status: RealtimeStatus) => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
  syncState: "guest",
  pendingCount: 0,
  lastSyncTime: null,
  realtimeStatus: "inactive",
  setSyncState: (state) => set({ syncState: state }),
  setPendingCount: (count) => set({ pendingCount: count }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
  setRealtimeStatus: (status) => set({ realtimeStatus: status }),
}));
